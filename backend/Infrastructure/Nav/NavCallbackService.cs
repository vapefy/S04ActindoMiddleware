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
    /// </summary>
    public async Task SendCallbackAsync(
        string sku,
        string? bufferId,
        object result,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var settings = await _settingsStore.GetActindoSettingsAsync(cancellationToken);

            if (string.IsNullOrWhiteSpace(settings.NavApiUrl) || string.IsNullOrWhiteSpace(settings.NavApiToken))
            {
                _logger.LogWarning("NAV callback skipped: NavApiUrl or NavApiToken not configured");
                return;
            }

            // Serialize result to JsonElement, then merge with sku + bufferId
            var resultJson = JsonSerializer.SerializeToElement(result, SerializerOptions);
            var payload = BuildPayload(resultJson, sku, bufferId);

            using var request = new HttpRequestMessage(HttpMethod.Post, settings.NavApiUrl);
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", settings.NavApiToken);
            request.Content = JsonContent.Create(payload, options: SerializerOptions);

            var response = await _httpClient.SendAsync(request, cancellationToken);

            _logger.LogInformation(
                "NAV callback sent for SKU={Sku} BufferId={BufferId}: HTTP {Status}",
                sku, bufferId ?? "(none)", (int)response.StatusCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "NAV callback failed for SKU={Sku} BufferId={BufferId}",
                sku, bufferId ?? "(none)");
            // Kein Re-throw — Callback-Fehler sollen den Job nicht gefährden
        }
    }

    private static object BuildPayload(JsonElement result, string sku, string? bufferId)
    {
        // Wandelt das result-Objekt in ein Dictionary um und fügt sku + bufferId hinzu
        var dict = new System.Collections.Generic.Dictionary<string, object?>();

        if (result.ValueKind == JsonValueKind.Object)
        {
            foreach (var prop in result.EnumerateObject())
                dict[prop.Name] = prop.Value;
        }

        dict["sku"] = sku;
        dict["bufferId"] = bufferId;

        return dict;
    }
}
