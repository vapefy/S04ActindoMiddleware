using System.Diagnostics;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.Application.Services;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Collections.Concurrent;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("api/actindo/products")]
[Authorize(Policy = AuthPolicies.Write)]
public sealed class ActindoProductsController : ControllerBase
{
    private readonly ProductCreateService _productCreateService;
    private readonly ProductSaveService _productSaveService;
    private readonly IDashboardMetricsService _dashboardMetrics;
    private readonly ActindoClient _actindoClient;
    private readonly IActindoEndpointProvider _endpointProvider;
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> InventoryLocks = new(StringComparer.OrdinalIgnoreCase);
    private const int MaxConcurrentInventoryPosts = 8;

    public ActindoProductsController(
        ProductCreateService productCreateService,
        ProductSaveService productSaveService,
        IDashboardMetricsService dashboardMetrics,
        ActindoClient actindoClient,
        IActindoEndpointProvider endpointProvider)
    {
        _productCreateService = productCreateService;
        _productSaveService = productSaveService;
        _dashboardMetrics = dashboardMetrics;
        _actindoClient = actindoClient;
        _endpointProvider = endpointProvider;
    }

    /// <summary>
    /// Erstellt ein Master-Produkt inkl. Inventar und Varianten in Actindo
    /// </summary>
    [HttpPost("create")]
    [ProducesResponseType(typeof(CreateProductResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CreateProductResponse>> CreateProduct(
        [FromBody] CreateProductRequest request,
        CancellationToken _)
    {
        if (request?.Product == null)
            return BadRequest("Product payload is missing");

        using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(10));
        var cancellationToken = cts.Token;

        var jobHandle = await _dashboardMetrics.BeginJobAsync(
            DashboardMetricType.Product,
            DashboardJobEndpoints.ProductCreate,
            DashboardPayloadSerializer.Serialize(request),
            cancellationToken);
        using var jobScope = DashboardJobContext.Begin(jobHandle.Id);
        var stopwatch = Stopwatch.StartNew();
        var success = false;
        string? responsePayload = null;
        string? errorPayload = null;
        try
        {
            var result = await _productCreateService.CreateAsync(request, cancellationToken);
            success = true;
            responsePayload = DashboardPayloadSerializer.Serialize(result);

            // Save master product to local database
            var product = request.Product;
            var hasVariants = product.Variants?.Count > 0;
            var masterVariantStatus = hasVariants ? "master" : "single";
            var masterName = GetProductName(product);

            await _dashboardMetrics.SaveProductAsync(
                jobHandle.Id,
                product.sku,
                masterName,
                result.ProductId,
                masterVariantStatus,
                null, // parentSku
                null, // variantCode
                cancellationToken);

            // Save variants to local database
            if (result.Variants != null)
            {
                foreach (var variantResult in result.Variants)
                {
                    var variantDto = product.Variants?.FirstOrDefault(v => v.sku == variantResult.Sku);
                    var variantName = variantDto != null ? GetProductName(variantDto) : string.Empty;
                    var variantCode = variantDto?._pim_varcode;

                    await _dashboardMetrics.SaveProductAsync(
                        jobHandle.Id,
                        variantResult.Sku,
                        variantName,
                        variantResult.Id,
                        "child",
                        product.sku, // parentSku = master SKU
                        variantCode,
                        cancellationToken);
                }
            }

            return Created(
                string.Empty, // kein Location-Header notwendig
                result);
        }
        catch (Exception ex)
        {
            errorPayload = DashboardPayloadSerializer.SerializeError(ex);
            throw;
        }
        finally
        {
            await _dashboardMetrics.CompleteJobAsync(
                jobHandle,
                success,
                stopwatch.Elapsed,
                responsePayload,
                errorPayload,
                cancellationToken);
        }
    }

    private static string GetProductName(DTOs.ProductDto product)
    {
        return product._pim_art_name__actindo_basic__de_DE
            ?? product._pim_art_name__actindo_basic__en_US
            ?? product._pim_art_nameactindo_basic_de_DE
            ?? product._pim_art_nameactindo_basic_en_US
            ?? string.Empty;
    }

    private static (int? actindoId, string? sku, decimal? price, decimal? priceEmployee, decimal? priceMember) ExtractPriceData(JsonElement element)
    {
        int? actindoId = null;
        string? sku = null;
        decimal? price = null;
        decimal? priceEmployee = null;
        decimal? priceMember = null;

        // Actindo ID extrahieren
        if (element.TryGetProperty("id", out var idProp))
        {
            if (idProp.ValueKind == JsonValueKind.Number && idProp.TryGetInt32(out var id))
                actindoId = id;
            else if (idProp.ValueKind == JsonValueKind.String && int.TryParse(idProp.GetString(), out var idStr))
                actindoId = idStr;
        }

        // SKU extrahieren (falls vorhanden)
        if (element.TryGetProperty("sku", out var skuProp) && skuProp.ValueKind == JsonValueKind.String)
            sku = skuProp.GetString();

        // Basispreis extrahieren: _pim_price.currencies.EUR.base.price
        price = ExtractPriceFromField(element, "_pim_price");
        priceEmployee = ExtractPriceFromField(element, "_pim_price_employee");
        priceMember = ExtractPriceFromField(element, "_pim_price_member");

        return (actindoId, sku, price, priceEmployee, priceMember);
    }

    private static decimal? ExtractPriceFromField(JsonElement element, string fieldName)
    {
        if (!element.TryGetProperty(fieldName, out var priceObj))
            return null;

        // Versuche: currencies.EUR.basePrice.price (currencies kann Object oder Array sein)
        if (priceObj.TryGetProperty("currencies", out var currencies))
        {
            if (currencies.ValueKind == JsonValueKind.Object)
            {
                // Object: { "EUR": { "basePrice": { "price": 19.99 } } }
                foreach (var currency in currencies.EnumerateObject())
                {
                    if (currency.Value.TryGetProperty("basePrice", out var baseProp) &&
                        baseProp.TryGetProperty("price", out var priceProp))
                    {
                        if (priceProp.TryGetDecimal(out var p))
                            return p;
                    }
                }
            }
            else if (currencies.ValueKind == JsonValueKind.Array)
            {
                // Array: [{ "currency": "EUR", "basePrice": { "price": 19.99 } }]
                foreach (var currency in currencies.EnumerateArray())
                {
                    if (currency.TryGetProperty("basePrice", out var baseProp) &&
                        baseProp.TryGetProperty("price", out var priceProp))
                    {
                        if (priceProp.TryGetDecimal(out var p))
                            return p;
                    }
                }
            }
        }

        return null;
    }

    private static string? ExtractSkuFromResponse(JsonElement response)
    {
        // Actindo Response: {"product":{"id":172441,"sku":"10855",...},"success":true,...}
        if (response.TryGetProperty("product", out var product) &&
            product.TryGetProperty("sku", out var skuProp) &&
            skuProp.ValueKind == JsonValueKind.String)
        {
            return skuProp.GetString();
        }
        return null;
    }

    /// <summary>
    /// Aktualisiert ein bestehendes Produkt und seine Varianten in Actindo.
    /// </summary>
    [HttpPost("save")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CreateProductResponse>> SaveProduct(
        [FromBody] SaveProductRequest request,
        CancellationToken _)
    {
        if (request?.Product == null)
            return BadRequest("Product payload is missing");

        using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(10));
        var cancellationToken = cts.Token;

        var jobHandle = await _dashboardMetrics.BeginJobAsync(
            DashboardMetricType.Product,
            DashboardJobEndpoints.ProductSave,
            DashboardPayloadSerializer.Serialize(request),
            cancellationToken);
        using var jobScope = DashboardJobContext.Begin(jobHandle.Id);
        var stopwatch = Stopwatch.StartNew();
        var success = false;
        string? responsePayload = null;
        string? errorPayload = null;
        try
        {
            var result = await _productSaveService.SaveAsync(request, cancellationToken);
            success = true;
            responsePayload = DashboardPayloadSerializer.Serialize(result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            errorPayload = DashboardPayloadSerializer.SerializeError(ex);
            throw;
        }
        finally
        {
            await _dashboardMetrics.CompleteJobAsync(
                jobHandle,
                success,
                stopwatch.Elapsed,
                responsePayload,
                errorPayload,
                cancellationToken);
        }
    }

    [HttpPost("inventory")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AdjustInventory(
        [FromBody] AdjustInventoryRequest request,
        CancellationToken _)
    {
        if (request?.Inventories == null || request.Inventories.Count == 0)
        {
            return BadRequest("inventories darf nicht leer sein.");
        }

        using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(10));
        var cancellationToken = cts.Token;

        var jobHandle = await _dashboardMetrics.BeginJobAsync(
            DashboardMetricType.Product,
            DashboardJobEndpoints.ProductInventory,
            DashboardPayloadSerializer.Serialize(request),
            cancellationToken);
        using var jobScope = DashboardJobContext.Begin(jobHandle.Id);
        var stopwatch = Stopwatch.StartNew();
        var success = false;
        string? responsePayload = null;
        string? errorPayload = null;

        try
        {
            var endpoints = await _endpointProvider.GetAsync(cancellationToken);
            var results = new ConcurrentBag<object>();
            var workItems = new List<(string sku, InventoryStock stock)>();

            foreach (var kvp in request.Inventories)
            {
                var sku = kvp.Key;
                var entry = kvp.Value;
                if (string.IsNullOrWhiteSpace(sku) || entry?.Stocks == null || entry.Stocks.Count == 0)
                    continue;

                foreach (var stockEntry in entry.Stocks)
                {
                    if (stockEntry?.WarehouseId is null || stockEntry.Stock is null)
                        continue;
                    workItems.Add((sku, stockEntry));
                }
            }

            var throttler = new SemaphoreSlim(MaxConcurrentInventoryPosts);
            var tasks = workItems.Select(async item =>
            {
                await throttler.WaitAsync(cancellationToken);
                var key = $"wh:{item.stock.WarehouseId}";
                var sem = InventoryLocks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
                await sem.WaitAsync(cancellationToken);
                try
                {
                    var payload = new
                    {
                        inventory = new
                        {
                            sku = item.sku,
                            synchronousSync = true,
                            compareOldValue = true,
                            _fulfillment_inventory_amount = item.stock.Stock,
                            _fulfillment_inventory_warehouse = item.stock.WarehouseId,
                            _fulfillment_inventory_compartment = 111,
                            _fulfillment_inventory_postingType = new[] { new { id = 571 } },
                            _fulfillment_inventory_postingText = "Bestandseinbuchung",
                            _fulfillment_inventory_origin = "Middleware import"
                        }
                    };

                    var result = await _actindoClient.PostAsync(
                        endpoints.CreateInventory,
                        payload,
                        cancellationToken);
                    results.Add(new { sku = item.sku, warehouseId = item.stock.WarehouseId, response = result });
                }
                finally
                {
                    sem.Release();
                    throttler.Release();
                }
            }).ToArray();

            await Task.WhenAll(tasks);

            // Speichere Bestandsdaten in DB
            foreach (var item in workItems)
            {
                await _dashboardMetrics.UpdateProductStockAsync(
                    item.sku,
                    (int)(item.stock.Stock ?? 0),
                    item.stock.WarehouseId ?? 0,
                    cancellationToken);
            }

            success = true;
            responsePayload = DashboardPayloadSerializer.Serialize(results);
            return Ok(new { results });
        }
        catch (Exception ex)
        {
            errorPayload = DashboardPayloadSerializer.SerializeError(ex);
            throw;
        }
        finally
        {
            await _dashboardMetrics.CompleteJobAsync(
                jobHandle,
                success,
                stopwatch.Elapsed,
                responsePayload,
                errorPayload,
                cancellationToken);
        }
    }

    [HttpPost("price")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdatePrices(
        [FromBody] JsonElement body,
        CancellationToken _)
    {
        if (body.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
            return BadRequest("Payload ist erforderlich.");

        using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(10));
        var cancellationToken = cts.Token;

        var jobHandle = await _dashboardMetrics.BeginJobAsync(
            DashboardMetricType.Product,
            DashboardJobEndpoints.ProductPrice,
            body.GetRawText(),
            cancellationToken);

        using var jobScope = DashboardJobContext.Begin(jobHandle.Id);
        var stopwatch = Stopwatch.StartNew();
        var success = false;
        string? responsePayload = null;
        string? errorPayload = null;

        try
        {
            var endpoints = await _endpointProvider.GetAsync(cancellationToken);
            var results = new List<JsonElement>();

            var priceUpdates = new List<(int? actindoId, string? sku, decimal? price, decimal? priceEmployee, decimal? priceMember)>();

            if (body.TryGetProperty("variant_prices", out var variantPrices) &&
                variantPrices.ValueKind == JsonValueKind.Array &&
                variantPrices.GetArrayLength() > 0)
            {
                foreach (var variant in variantPrices.EnumerateArray())
                {
                    var forwarded = new { product = variant, thaw = true };
                    var resp = await _actindoClient.PostAsync(
                        endpoints.SaveProduct,
                        forwarded,
                        cancellationToken);
                    results.Add(resp);

                    // Extrahiere Preisdaten für DB-Update (aus Request und Response)
                    var priceData = ExtractPriceData(variant);
                    var skuFromResponse = ExtractSkuFromResponse(resp);
                    if (!string.IsNullOrWhiteSpace(skuFromResponse))
                        priceData = (priceData.actindoId, skuFromResponse, priceData.price, priceData.priceEmployee, priceData.priceMember);
                    if (priceData.actindoId.HasValue || !string.IsNullOrWhiteSpace(priceData.sku))
                        priceUpdates.Add(priceData);
                }
            }
            else
            {
                var forwarded = new { product = body, thaw = true };
                var resp = await _actindoClient.PostAsync(
                    endpoints.SaveProduct,
                    forwarded,
                    cancellationToken);
                results.Add(resp);

                // Extrahiere Preisdaten für DB-Update (aus Request und Response)
                var priceData = ExtractPriceData(body);
                var skuFromResponse = ExtractSkuFromResponse(resp);
                if (!string.IsNullOrWhiteSpace(skuFromResponse))
                    priceData = (priceData.actindoId, skuFromResponse, priceData.price, priceData.priceEmployee, priceData.priceMember);
                if (priceData.actindoId.HasValue || !string.IsNullOrWhiteSpace(priceData.sku))
                    priceUpdates.Add(priceData);
            }

            // Speichere Preisdaten in DB (versuche erst per ActindoId, dann per SKU)
            foreach (var update in priceUpdates)
            {
                if (update.actindoId.HasValue)
                {
                    await _dashboardMetrics.UpdateProductPriceByActindoIdAsync(
                        update.actindoId.Value,
                        update.price,
                        update.priceEmployee,
                        update.priceMember,
                        cancellationToken);
                }
                if (!string.IsNullOrWhiteSpace(update.sku))
                {
                    await _dashboardMetrics.UpdateProductPriceAsync(
                        update.sku,
                        update.price,
                        update.priceEmployee,
                        update.priceMember,
                        cancellationToken);
                }
            }

            success = true;
            responsePayload = DashboardPayloadSerializer.Serialize(results);
            return Ok(new { results });
        }
        catch (Exception ex)
        {
            errorPayload = DashboardPayloadSerializer.SerializeError(ex);
            throw;
        }
        finally
        {
            await _dashboardMetrics.CompleteJobAsync(
                jobHandle,
                success,
                stopwatch.Elapsed,
                responsePayload,
                errorPayload,
                cancellationToken);
        }
    }
}
