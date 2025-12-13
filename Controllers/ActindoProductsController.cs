using System.Diagnostics;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Services;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("actindo/products")]
public sealed class ActindoProductsController : ControllerBase
{
    private readonly ProductCreateService _productCreateService;
    private readonly ProductSaveService _productSaveService;
    private readonly IDashboardMetricsService _dashboardMetrics;

    public ActindoProductsController(
        ProductCreateService productCreateService,
        ProductSaveService productSaveService,
        IDashboardMetricsService dashboardMetrics)
    {
        _productCreateService = productCreateService;
        _productSaveService = productSaveService;
        _dashboardMetrics = dashboardMetrics;
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
}
