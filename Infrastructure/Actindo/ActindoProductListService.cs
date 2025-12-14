using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Infrastructure.Actindo.Auth;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Infrastructure.Actindo;

public sealed class ActindoProductListService
{
    private readonly HttpClient _httpClient;
    private readonly IAuthenticationService _authService;
    private readonly IActindoEndpointProvider _endpoints;
    private readonly ILogger<ActindoProductListService> _logger;
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public ActindoProductListService(
        HttpClient httpClient,
        IAuthenticationService authService,
        IActindoEndpointProvider endpoints,
        ILogger<ActindoProductListService> logger)
    {
        _httpClient = httpClient;
        _authService = authService;
        _endpoints = endpoints;
        _logger = logger;
    }

    public async Task<IReadOnlyList<ProductListItem>> GetActindoProductsAsync(CancellationToken cancellationToken = default)
    {
        var endpoints = await _endpoints.GetAsync(cancellationToken);
        var endpoint = endpoints.GetProductList;
        var token = await _authService.GetValidAccessTokenAsync(cancellationToken);

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using var response = await _httpClient.GetAsync(endpoint, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Actindo product list failed {Status}: {Content}", (int)response.StatusCode, content);
            throw new InvalidOperationException($"Actindo product list failed ({(int)response.StatusCode}): {content}");
        }

        using var doc = JsonDocument.Parse(content);
        if (!doc.RootElement.TryGetProperty("data", out var data) || data.ValueKind != JsonValueKind.Array)
            return Array.Empty<ProductListItem>();

        var items = data.EnumerateArray().ToList();

        // Build lookup for variant counts
        var children = items
            .Where(e => e.TryGetProperty("variantStatus", out var vs) && vs.GetString() == "child")
            .Select(e => e.GetProperty("sku").GetString() ?? string.Empty)
            .ToArray();

        int CountVariants(string masterSku) =>
            string.IsNullOrWhiteSpace(masterSku)
                ? 0
                : children.Count(sku => sku.StartsWith(masterSku + "-", StringComparison.OrdinalIgnoreCase));

        var result = new List<ProductListItem>();

        foreach (var element in items)
        {
            var variantStatus = element.TryGetProperty("variantStatus", out var vs) ? vs.GetString() : null;
            if (variantStatus != "single" && variantStatus != "master")
                continue;

            var sku = element.TryGetProperty("sku", out var skuProp) ? skuProp.GetString() ?? string.Empty : string.Empty;
            var id = TryReadInt(element, "id") ?? TryReadInt(element, "entityId");
            var createdAt = element.TryGetProperty("created", out var createdProp) ? createdProp.GetString() : null;
            DateTimeOffset? created = null;
            if (DateTimeOffset.TryParse(createdAt, out var parsed))
            {
                created = parsed;
            }

            var variantCount = variantStatus == "master" ? CountVariants(sku) : (int?)null;

            result.Add(new ProductListItem
            {
                JobId = Guid.Empty,
                ProductId = id,
                Sku = sku,
                Name = string.Empty,
                VariantCount = variantCount,
                CreatedAt = created
            });
        }

        return result;
    }

    private static int? TryReadInt(JsonElement element, string property)
    {
        if (!element.TryGetProperty(property, out var prop))
            return null;

        if (prop.ValueKind == JsonValueKind.Number && prop.TryGetInt32(out var n))
            return n;

        if (prop.ValueKind == JsonValueKind.String && int.TryParse(prop.GetString(), out var parsed))
            return parsed;

        return null;
    }
}

