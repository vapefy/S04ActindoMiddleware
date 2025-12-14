using System.Diagnostics;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.Application.Services;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("actindo/products/image")]
[Authorize(Policy = AuthPolicies.Write)]
public sealed class ActindoProductImagesController : ControllerBase
{
    private readonly ProductImageService _productImageService;
    private readonly IDashboardMetricsService _dashboardMetrics;

    public ActindoProductImagesController(
        ProductImageService productImageService,
        IDashboardMetricsService dashboardMetrics)
    {
        _productImageService = productImageService;
        _dashboardMetrics = dashboardMetrics;
    }

    [HttpPost]
    [ProducesResponseType(typeof(CreateProductResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateProductResponse>> UploadImages(
        [FromBody] UploadProductImagesRequest request,
        CancellationToken cancellationToken)
    {
        if (request?.Images == null || request.Paths == null)
            return BadRequest("Images and paths are required.");

        var jobHandle = await _dashboardMetrics.BeginJobAsync(
            DashboardMetricType.Media,
            DashboardJobEndpoints.ProductImagesUpload,
            DashboardPayloadSerializer.Serialize(request),
            cancellationToken);
        using var jobScope = DashboardJobContext.Begin(jobHandle.Id);
        var stopwatch = Stopwatch.StartNew();
        var success = false;
        string? responsePayload = null;
        string? errorPayload = null;
        try
        {
            var response = await _productImageService.UploadAsync(request, cancellationToken);
            success = true;
            responsePayload = DashboardPayloadSerializer.Serialize(response);
            return Created(string.Empty, response);
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
