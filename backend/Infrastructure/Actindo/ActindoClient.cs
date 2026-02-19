using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Infrastructure.Actindo.Auth;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Infrastructure.Actindo;

public sealed class ActindoClient
{
    private readonly HttpClient _httpClient;
    private readonly IAuthenticationService _authenticationService;
    private readonly IDashboardMetricsService _dashboardMetrics;
    private readonly IActindoAvailabilityTracker _availabilityTracker;
    private readonly ILogger<ActindoClient> _logger;
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public ActindoClient(
        HttpClient httpClient,
        IAuthenticationService authenticationService,
        IDashboardMetricsService dashboardMetrics,
        IActindoAvailabilityTracker availabilityTracker,
        ILogger<ActindoClient> logger)
    {
        _httpClient = httpClient;
        _authenticationService = authenticationService;
        _dashboardMetrics = dashboardMetrics;
        _availabilityTracker = availabilityTracker;
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

            if (!response.IsSuccessStatusCode)
            {
                var actindoError = TryExtractActindoErrorMessage(responseContent) ?? responseContent;
                var ex = new InvalidOperationException($"Actindo-Fehler {(int)response.StatusCode} ({endpoint}): {actindoError}");

                _logger.LogError("Actindo request to {Endpoint} failed with {StatusCode}: {Response}", endpoint, (int)response.StatusCode, responseContent);
                _availabilityTracker.ReportFailure(ex);
                await AppendActindoLogAsync(endpoint, serializedPayload, responseContent, false, cancellationToken);
                throw ex;
            }

            _availabilityTracker.ReportSuccess();
            await AppendActindoLogAsync(endpoint, serializedPayload, responseContent, true, cancellationToken);

            using var document = JsonDocument.Parse(responseContent);
            return document.RootElement.Clone();
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _availabilityTracker.ReportFailure(ex);
            _logger.LogError(ex, "Actindo request to {Endpoint} failed.", endpoint);
            await AppendActindoLogAsync(
                endpoint,
                serializedPayload,
                DashboardPayloadSerializer.SerializeError(ex),
                false,
                cancellationToken);
            throw;
        }
    }

    private static string? TryExtractActindoErrorMessage(string responseContent)
    {
        try
        {
            using var doc = JsonDocument.Parse(responseContent);
            if (doc.RootElement.TryGetProperty("error", out var errorProp))
                return errorProp.GetString();
        }
        catch { }
        return null;
    }

    private async Task AppendActindoLogAsync(
        string endpoint,
        string requestPayload,
        string? responsePayload,
        bool success,
        CancellationToken cancellationToken)
    {
        var jobId = DashboardJobContext.CurrentJobId;
        if (!jobId.HasValue)
            return;

        try
        {
            await _dashboardMetrics.AppendActindoLogAsync(
                jobId.Value,
                endpoint,
                requestPayload,
                responsePayload,
                success,
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to persist Actindo log for job {JobId}", jobId);
        }
    }
}
