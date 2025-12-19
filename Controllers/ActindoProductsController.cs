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
        CancellationToken cancellationToken)
    {
        if (request?.Product == null)
            return BadRequest("Product payload is missing");

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

    /// <summary>
    /// Aktualisiert ein bestehendes Produkt und seine Varianten in Actindo.
    /// </summary>
    [HttpPost("save")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CreateProductResponse>> SaveProduct(
        [FromBody] SaveProductRequest request,
        CancellationToken cancellationToken)
    {
        if (request?.Product == null)
            return BadRequest("Product payload is missing");

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
        CancellationToken cancellationToken)
    {
        if (request?.Inventories == null || request.Inventories.Count == 0)
        {
            return BadRequest("inventories darf nicht leer sein.");
        }

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
        CancellationToken cancellationToken)
    {
        if (body.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
            return BadRequest("Payload ist erforderlich.");

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
