using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using ActindoMiddleware.Infrastructure.Actindo.Auth;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Infrastructure.Actindo;

public sealed class ActindoClient
{
    private readonly HttpClient _httpClient;
    private readonly IAuthenticationService _authenticationService;
    private readonly ILogger<ActindoClient> _logger;
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public ActindoClient(
        HttpClient httpClient,
        IAuthenticationService authenticationService,
        ILogger<ActindoClient> logger)
    {
        _httpClient = httpClient;
        _authenticationService = authenticationService;
        _logger = logger;
    }

    public async Task<JsonElement> PostAsync(
        string endpoint,
        object payload,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(endpoint);
        ArgumentNullException.ThrowIfNull(payload);

        var serializedPayload = JsonSerializer.Serialize(payload, SerializerOptions);
        _logger.LogInformation("Actindo POST {Endpoint} payload: {Payload}", endpoint, serializedPayload);

        var token = await _authenticationService.GetValidAccessTokenAsync(cancellationToken);

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        try
        {
            using var response = await _httpClient.PostAsJsonAsync(endpoint, payload, cancellationToken);
            var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

            _logger.LogInformation(
                "Actindo response {StatusCode} for {Endpoint}: {Response}",
                (int)response.StatusCode,
                endpoint,
                responseContent);

            response.EnsureSuccessStatusCode();

            using var document = JsonDocument.Parse(responseContent);
            return document.RootElement.Clone();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Actindo request to {Endpoint} failed.", endpoint);
            throw;
        }
    }
}
