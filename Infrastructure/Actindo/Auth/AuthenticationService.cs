using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ActindoMiddleware.Infrastructure.Actindo.Auth;

public interface IAuthenticationService
{
    Task<OAuthToken> ExchangeAuthorizationCodeAsync(string code, string redirectUri, CancellationToken ct = default);
    Task<OAuthToken> RefreshAsync(string refreshToken, CancellationToken ct = default);
    Task<string> GetValidAccessTokenAsync(CancellationToken ct = default);
    void ClearTokens();
    OAuthStatusSnapshot GetStatusSnapshot();
}

public sealed class AuthenticationService : IAuthenticationService
{
    private readonly HttpClient _httpClient;
    private readonly IActindoAvailabilityTracker _availabilityTracker;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly Uri _tokenEndpoint;
    private readonly string _refreshTokenFilePath;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web);
    private readonly SemaphoreSlim _refreshLock = new(1, 1);
    private readonly ILogger<AuthenticationService> _logger;

    private OAuthToken? _currentToken;
    private string? _lastErrorMessage;
    private DateTimeOffset? _lastErrorAt;

    public AuthenticationService(
        HttpClient httpClient,
        IOptions<ActindoOAuthOptions> options,
        IHostEnvironment hostEnvironment,
        IActindoAvailabilityTracker availabilityTracker,
        ILogger<AuthenticationService> logger)
    {
        ArgumentNullException.ThrowIfNull(httpClient);
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(hostEnvironment);
        ArgumentNullException.ThrowIfNull(logger);

        var oauthOptions = options.Value
                           ?? throw new ArgumentException("Actindo OAuth options are not configured.", nameof(options));

        if (string.IsNullOrWhiteSpace(oauthOptions.ClientId) ||
            string.IsNullOrWhiteSpace(oauthOptions.ClientSecret) ||
            string.IsNullOrWhiteSpace(oauthOptions.TokenEndpoint))
        {
            throw new InvalidOperationException("Actindo OAuth configuration is incomplete.");
        }

        _httpClient = httpClient;
        _clientId = oauthOptions.ClientId;
        _clientSecret = oauthOptions.ClientSecret;
        _tokenEndpoint = new Uri(oauthOptions.TokenEndpoint);
        _availabilityTracker = availabilityTracker;
        _logger = logger;

        _refreshTokenFilePath = ResolveRefreshTokenPath(
            oauthOptions.RefreshTokenFilePath,
            hostEnvironment.ContentRootPath);

        LoadExistingRefreshToken();
    }

    public async Task<OAuthToken> ExchangeAuthorizationCodeAsync(
        string code,
        string redirectUri,
        CancellationToken ct = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);
        ArgumentException.ThrowIfNullOrWhiteSpace(redirectUri);

        var values = new Dictionary<string, string>
        {
            ["grant_type"] = "authorization_code",
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["redirect_uri"] = redirectUri,
            ["code"] = code
        };

        using var content = new FormUrlEncodedContent(values);
        _logger.LogInformation("Exchange auth code at {Endpoint}", _tokenEndpoint);
        try
        {
            using var response = await _httpClient.PostAsync(_tokenEndpoint, content, ct).ConfigureAwait(false);
            var rawContent = await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);

            if (!response.IsSuccessStatusCode)
            {
                SetLastError($"Token exchange failed ({(int)response.StatusCode}): {rawContent}");
                _availabilityTracker.ReportFailure(new InvalidOperationException(rawContent));
                throw new InvalidOperationException($"Token exchange failed ({(int)response.StatusCode}): {rawContent}");
            }

            var token = DeserializeToken(rawContent);
            token.ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(token.ExpiresIn - 60);
            _currentToken = token;
            ClearLastError();
            _availabilityTracker.ReportSuccess();
            _logger.LogInformation("Authorization code exchange succeeded. ExpiresIn: {ExpiresIn}", token.ExpiresIn);

            if (!string.IsNullOrEmpty(token.RefreshToken))
            {
                PersistRefreshToken(token.RefreshToken);
            }

            return token;
        }
        catch (Exception ex)
        {
            SetLastError(ex.Message);
            _availabilityTracker.ReportFailure(ex);
            throw;
        }
    }

    public async Task<OAuthToken> RefreshAsync(
        string refreshToken,
        CancellationToken ct = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(refreshToken);

        var values = new Dictionary<string, string>
        {
            ["grant_type"] = "refresh_token",
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["refresh_token"] = refreshToken
        };

        using var content = new FormUrlEncodedContent(values);
        _logger.LogInformation("Refreshing access token at {Endpoint}", _tokenEndpoint);
        try
        {
            using var response = await _httpClient.PostAsync(_tokenEndpoint, content, ct).ConfigureAwait(false);
            var rawContent = await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);

            if (!response.IsSuccessStatusCode)
            {
                SetLastError($"Token refresh failed ({(int)response.StatusCode}): {rawContent}");
                _availabilityTracker.ReportFailure(new InvalidOperationException(rawContent));
                throw new InvalidOperationException($"Token refresh failed ({(int)response.StatusCode}): {rawContent}");
            }

            var token = DeserializeToken(rawContent);
            token.ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(token.ExpiresIn - 60);

            if (!string.IsNullOrEmpty(token.RefreshToken))
            {
                PersistRefreshToken(token.RefreshToken);
            }
            else
            {
                token.RefreshToken = refreshToken;
                PersistRefreshToken(refreshToken);
            }

            _currentToken = token;
            ClearLastError();
            _availabilityTracker.ReportSuccess();
            _logger.LogInformation("Token refresh succeeded. New expiry in {ExpiresIn} seconds.", token.ExpiresIn);
            return token;
        }
        catch (Exception ex)
        {
            SetLastError(ex.Message);
            _availabilityTracker.ReportFailure(ex);
            throw;
        }
    }

    public async Task<string> GetValidAccessTokenAsync(CancellationToken ct = default)
    {
        await _refreshLock.WaitAsync(ct);
        try
        {
            var shouldRefresh =
                _currentToken == null ||
                _currentToken.ExpiresAt == null ||
                DateTimeOffset.UtcNow >= _currentToken.ExpiresAt.Value.AddMinutes(-2);

            if (shouldRefresh)
            {
                if (string.IsNullOrWhiteSpace(_currentToken?.RefreshToken))
                {
                    LoadExistingRefreshToken();
                }

                var refreshToken = _currentToken?.RefreshToken;

                if (!string.IsNullOrWhiteSpace(refreshToken))
                {
                    _logger.LogInformation("Refreshing token because current one is missing or expiring.");
                    await RefreshAsync(refreshToken!, ct).ConfigureAwait(false);
                }
            }
        }
        finally
        {
            _refreshLock.Release();
        }

        if (_currentToken?.AccessToken == null)
        {
            throw new InvalidOperationException(
                "No access token available. Initialize the integration via ExchangeAuthorizationCodeAsync first.");
        }

        return _currentToken.AccessToken;
    }

    public OAuthStatusSnapshot GetStatusSnapshot()
    {
        var token = _currentToken;
        return new OAuthStatusSnapshot
        {
            HasAccessToken = !string.IsNullOrWhiteSpace(token?.AccessToken),
            HasRefreshToken = !string.IsNullOrWhiteSpace(token?.RefreshToken),
            AccessTokenExpiresAt = token?.ExpiresAt,
            LastErrorAt = _lastErrorAt,
            LastErrorMessage = _lastErrorMessage
        };
    }

    public void ClearTokens()
    {
        _logger.LogWarning("Clearing Actindo OAuth tokens and refresh token file.");
        _currentToken = null;
        ClearLastError();

        try
        {
            if (File.Exists(_refreshTokenFilePath))
            {
                File.Delete(_refreshTokenFilePath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete refresh token file at {Path}", _refreshTokenFilePath);
        }
    }

    private void LoadExistingRefreshToken()
    {
        if (!File.Exists(_refreshTokenFilePath))
            return;

        var savedToken = File.ReadAllText(_refreshTokenFilePath).Trim();
        if (string.IsNullOrEmpty(savedToken))
            return;

        _currentToken = new OAuthToken
        {
            RefreshToken = savedToken,
            ExpiresAt = null
        };
        _logger.LogInformation("Loaded refresh token from {Path}", _refreshTokenFilePath);
    }

    private void PersistRefreshToken(string refreshToken)
    {
        var directory = Path.GetDirectoryName(_refreshTokenFilePath);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        File.WriteAllText(_refreshTokenFilePath, refreshToken);
        _logger.LogInformation("Persisted refresh token to {Path}", _refreshTokenFilePath);
    }

    private OAuthToken DeserializeToken(string rawContent)
    {
        return JsonSerializer.Deserialize<OAuthToken>(rawContent, _serializerOptions)
               ?? throw new InvalidOperationException("Empty token JSON received from Actindo.");
    }

    private void SetLastError(string? message)
    {
        if (string.IsNullOrWhiteSpace(message))
            message = "Unknown OAuth error";

        _lastErrorAt = DateTimeOffset.UtcNow;
        _lastErrorMessage = message;
    }

    private void ClearLastError()
    {
        _lastErrorAt = null;
        _lastErrorMessage = null;
    }

    private static string ResolveRefreshTokenPath(string configuredPath, string contentRoot)
    {
        if (string.IsNullOrWhiteSpace(configuredPath))
            configuredPath = ".actindo-refresh-token";

        return Path.IsPathRooted(configuredPath)
            ? configuredPath
            : Path.Combine(contentRoot, configuredPath);
    }
}
