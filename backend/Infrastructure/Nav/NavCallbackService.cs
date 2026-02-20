using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Application.Configuration;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Infrastructure.Nav;

public sealed class NavCallbackService
{
    private readonly HttpClient _httpClient;
    private readonly ISettingsStore _settingsStore;
    private readonly ILogger<NavCallbackService> _logger;

    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public NavCallbackService(
        HttpClient httpClient,
        ISettingsStore settingsStore,
        ILogger<NavCallbackService> logger)
    {
        _httpClient = httpClient;
        _settingsStore = settingsStore;
        _logger = logger;
    }

    /// <summary>
    /// Sendet das Sync-Ergebnis an NAV zurück. Wirft keine Exception — Fehler werden nur geloggt.
    /// Gibt true zurück wenn NAV mit {"success": true} geantwortet hat.
    /// </summary>
    public async Task<bool> SendCallbackAsync(
        string sku,
        string? bufferId,
        object result,
        bool created,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var settings = await _settingsStore.GetActindoSettingsAsync(cancellationToken);

            if (string.IsNullOrWhiteSpace(settings.NavApiUrl) || string.IsNullOrWhiteSpace(settings.NavApiToken))
            {
                _logger.LogWarning("NAV callback skipped: NavApiUrl or NavApiToken not configured");
                return false;
            }

            // Serialize result to JsonElement, then merge with sku + bufferId + created
            var resultJson = JsonSerializer.SerializeToElement(result, SerializerOptions);
            var payload = BuildPayload(resultJson, sku, bufferId, created);

            var tokenPreview = settings.NavApiToken!.Length > 8
                ? settings.NavApiToken[..8] + "..."
                : "(short)";
            var payloadJson = JsonSerializer.Serialize(payload, SerializerOptions);
            _logger.LogInformation(
                "NAV callback: POST {Url} | Token starts with: {TokenPreview}",
                settings.NavApiUrl, tokenPreview);
            _logger.LogInformation("NAV callback body: {Body}", payloadJson);

            using var request = new HttpRequestMessage(HttpMethod.Post, settings.NavApiUrl);
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", settings.NavApiToken);
            request.Content = JsonContent.Create(payload, options: SerializerOptions);

            var response = await _httpClient.SendAsync(request, cancellationToken);
            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

            _logger.LogInformation(
                "NAV callback sent for SKU={Sku} BufferId={BufferId}: HTTP {Status} | Response: {Body}",
                sku, bufferId ?? "(none)", (int)response.StatusCode,
                responseBody.Length > 500 ? responseBody[..500] : responseBody);

            return NavAcknowledgedSuccess(responseBody);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "NAV callback failed for SKU={Sku} BufferId={BufferId}",
                sku, bufferId ?? "(none)");
            return false;
        }
    }

    /// <summary>
    /// Prüft ob NAV mit {"success": true} (oder "true") geantwortet hat.
    /// </summary>
    private static bool NavAcknowledgedSuccess(string responseBody)
    {
        try
        {
            using var doc = JsonDocument.Parse(responseBody);
            if (doc.RootElement.TryGetProperty("success", out var successProp))
            {
                return successProp.ValueKind == JsonValueKind.True ||
                       (successProp.ValueKind == JsonValueKind.String &&
                        successProp.GetString()?.Equals("true", StringComparison.OrdinalIgnoreCase) == true);
            }
        }
        catch { /* kein gültiges JSON */ }
        return false;
    }

    private static object BuildPayload(JsonElement result, string sku, string? bufferId, bool created)
    {
        // Wandelt das result-Objekt in ein Dictionary um und fügt sku + bufferId + created hinzu
        var dict = new System.Collections.Generic.Dictionary<string, object?>();

        if (result.ValueKind == JsonValueKind.Object)
        {
            foreach (var prop in result.EnumerateObject())
                dict[prop.Name] = prop.Value;
        }

        dict["requestType"] = "actindo.product.response";
        dict["sku"] = sku;
        dict["bufferId"] = bufferId;
        dict["created"] = created;

        return dict;
    }
}
