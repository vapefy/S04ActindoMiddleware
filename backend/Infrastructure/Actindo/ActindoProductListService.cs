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

/// <summary>
/// Internal record to hold parsed product data from Actindo.
/// </summary>
internal sealed record ActindoProductData(
    int? Id,
    string Sku,
    string VariantStatus,
    string? ParentSku,
    string? VariantCode,
    string? CreatedAt);

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

    /// <summary>
    /// Holt Produkte aus Actindo.
    /// </summary>
    /// <param name="includeVariants">Wenn true, werden auch Child-Varianten als separate Produkte zurückgegeben</param>
    /// <param name="cancellationToken">Cancellation token</param>
    public async Task<IReadOnlyList<ProductListItem>> GetActindoProductsAsync(
        bool includeVariants = false,
        CancellationToken cancellationToken = default)
    {
        var items = await FetchProductElementsAsync(cancellationToken);

        // Build lookup for variant counts und parent SKUs
        var childrenBySku = items
            .Where(p => p.VariantStatus == "child")
            .ToArray();

        int CountVariants(string masterSku) =>
            string.IsNullOrWhiteSpace(masterSku)
                ? 0
                : childrenBySku.Count(c => c.ParentSku == masterSku ||
                    c.Sku.StartsWith(masterSku + "-", StringComparison.OrdinalIgnoreCase));

        var result = new List<ProductListItem>();

        foreach (var item in items)
        {
            // Wenn includeVariants=false, nur single und master zeigen
            if (!includeVariants && item.VariantStatus == "child")
                continue;

            DateTimeOffset? created = null;
            if (DateTimeOffset.TryParse(item.CreatedAt, out var parsed))
            {
                created = parsed;
            }

            var variantCount = item.VariantStatus == "master" ? CountVariants(item.Sku) : (int?)null;

            result.Add(new ProductListItem
            {
                JobId = Guid.Empty,
                ProductId = item.Id,
                Sku = item.Sku,
                Name = string.Empty,
                VariantCount = variantCount,
                CreatedAt = created,
                VariantStatus = item.VariantStatus,
                ParentSku = item.ParentSku,
                VariantCode = item.VariantCode
            });
        }

        return result;
    }

    /// <summary>
    /// Holt alle Varianten für ein Master-Produkt.
    /// </summary>
    public async Task<IReadOnlyList<ProductListItem>> GetVariantsForMasterAsync(
        string masterSku,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("GetVariantsForMasterAsync called for masterSku={MasterSku}", masterSku);

        if (string.IsNullOrWhiteSpace(masterSku))
            return Array.Empty<ProductListItem>();

        var items = await FetchProductElementsAsync(cancellationToken);
        var result = new List<ProductListItem>();

        // Log all children for debugging
        var allChildren = items.Where(p => p.VariantStatus == "child").ToList();
        _logger.LogInformation("Found {Count} total child products", allChildren.Count);

        foreach (var item in items)
        {
            if (item.VariantStatus != "child")
                continue;

            // Match by parentSku or by SKU prefix
            var isVariant = item.ParentSku == masterSku ||
                item.Sku.StartsWith(masterSku + "-", StringComparison.OrdinalIgnoreCase);

            _logger.LogDebug("Checking child: sku={Sku}, parentSku={ParentSku}, masterSku={MasterSku}, isMatch={IsMatch}",
                item.Sku, item.ParentSku, masterSku, isVariant);

            if (!isVariant)
                continue;

            DateTimeOffset? created = null;
            if (DateTimeOffset.TryParse(item.CreatedAt, out var parsed))
            {
                created = parsed;
            }

            result.Add(new ProductListItem
            {
                JobId = Guid.Empty,
                ProductId = item.Id,
                Sku = item.Sku,
                Name = string.Empty,
                VariantCount = null,
                CreatedAt = created,
                VariantStatus = "child",
                ParentSku = item.ParentSku ?? masterSku,
                VariantCode = item.VariantCode
            });
        }

        _logger.LogInformation("Returning {Count} variants for masterSku={MasterSku}", result.Count, masterSku);
        return result;
    }

    public async Task<IReadOnlyList<int>> GetVariantIdsForMasterAsync(
        string masterSku,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(masterSku))
            return Array.Empty<int>();

        var items = await FetchProductElementsAsync(cancellationToken);
        var prefix = masterSku + "-";

        var ids = items
            .Where(p => p.VariantStatus == "child")
            .Where(p => p.Sku.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            .Where(p => p.Id.HasValue)
            .Select(p => p.Id!.Value)
            .Distinct()
            .ToList();

        return ids;
    }

    private async Task<List<ActindoProductData>> FetchProductElementsAsync(CancellationToken cancellationToken)
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
            return new List<ActindoProductData>();

        var result = new List<ActindoProductData>();

        foreach (var item in data.EnumerateArray())
        {
            var id = TryReadInt(item, "id") ?? TryReadInt(item, "entityId");
            var sku = item.TryGetProperty("sku", out var skuProp) ? skuProp.GetString() ?? string.Empty : string.Empty;
            var variantStatus = item.TryGetProperty("variantStatus", out var vsProp) ? vsProp.GetString() ?? "single" : "single";
            var parentSku = item.TryGetProperty("_pim_parent_sku", out var psProp) ? psProp.GetString() : null;
            var variantCode = item.TryGetProperty("_pim_varcode", out var vcProp) ? vcProp.GetString() : null;
            var createdAt = item.TryGetProperty("created", out var createdProp) ? createdProp.GetString() : null;

            result.Add(new ActindoProductData(id, sku, variantStatus, parentSku, variantCode, createdAt));
        }

        // Debug: Log first few items to see structure
        _logger.LogInformation("Fetched {Count} products from Actindo", result.Count);
        foreach (var item in result.Take(3))
        {
            _logger.LogInformation("  Product: sku={Sku}, variantStatus={Status}, parentSku={Parent}, varcode={Varcode}",
                item.Sku, item.VariantStatus, item.ParentSku ?? "(no _pim_parent_sku)", item.VariantCode ?? "(no _pim_varcode)");
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
