using System;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ActindoMiddleware.Infrastructure.Actindo;
using System.Threading;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.DTOs.Requests;
using System.Linq;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("products")]
[Authorize(Policy = AuthPolicies.Read)]
public sealed class ProductsController : ControllerBase
{
    private readonly IDashboardMetricsService _metricsService;
    private readonly ActindoProductListService _productListService;
    private readonly ActindoClient _actindoClient;
    private readonly IActindoEndpointProvider _endpointProvider;

    public ProductsController(
        IDashboardMetricsService metricsService,
        ActindoProductListService productListService,
        ActindoClient actindoClient,
        IActindoEndpointProvider endpointProvider)
    {
        _metricsService = metricsService;
        _productListService = productListService;
        _actindoClient = actindoClient;
        _endpointProvider = endpointProvider;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductListItemDto>>> Get(int limit = 200, CancellationToken cancellationToken = default)
    {
        limit = Math.Clamp(limit, 1, 500);
        var items = await _metricsService.GetCreatedProductsAsync(limit, cancellationToken);
        return Ok(items.Select(p => new ProductListItemDto
        {
            JobId = p.JobId,
            ProductId = p.ProductId,
            Sku = p.Sku ?? string.Empty,
            Name = p.Name ?? string.Empty,
            VariantCount = p.VariantCount,
            CreatedAt = p.CreatedAt
        }));
    }

    [HttpGet("sync")]
    public async Task<ActionResult<IReadOnlyList<ProductListItemDto>>> Sync(CancellationToken cancellationToken = default)
    {
        var items = await _productListService.GetActindoProductsAsync(cancellationToken);
        return Ok(items.Select(p => new ProductListItemDto
        {
            JobId = p.JobId,
            ProductId = p.ProductId,
            Sku = p.Sku ?? string.Empty,
            Name = p.Name ?? string.Empty,
            VariantCount = p.VariantCount,
            CreatedAt = p.CreatedAt
        }));
    }

    [HttpPost("delete")]
    [Authorize(Policy = AuthPolicies.Write)]
    public async Task<IActionResult> DeleteProduct(
        [FromBody] DeleteProductRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request == null || request.ProductId <= 0 || request.JobId == Guid.Empty)
            return BadRequest("productId und jobId sind erforderlich.");

        var endpoints = await _endpointProvider.GetAsync(cancellationToken);
        var payload = new { product = new { id = request.ProductId } };
        var variantIds = Array.Empty<int>();
        if (!string.IsNullOrWhiteSpace(request.Sku))
        {
            try
            {
                variantIds = (await _productListService
                        .GetVariantIdsForMasterAsync(request.Sku, cancellationToken))
                    .ToArray();
            }
            catch
            {
                // wenn Variantenliste nicht geladen werden kann, fahren wir fort und loeschen nur den Master
            }
        }

        try
        {
            // erst Varianten loeschen
            foreach (var variantId in variantIds)
            {
                var variantPayload = new { product = new { id = variantId } };
                var variantResponse = await _actindoClient.PostAsync(
                    endpoints.DeleteProduct,
                    variantPayload,
                    cancellationToken);

                if (variantResponse.TryGetProperty("success", out var successChild) &&
                    successChild.ValueKind == System.Text.Json.JsonValueKind.False)
                {
                    var displayMessage = variantResponse.TryGetProperty("displayMessage", out var msgChild) ? msgChild.GetString() : null;
                    var messageChild = !string.IsNullOrWhiteSpace(displayMessage)
                        ? displayMessage
                        : $"Actindo Delete meldet Fehler fuer Variante {variantId}.";
                    return StatusCode(StatusCodes.Status502BadGateway, new { error = messageChild, variantId });
                }
            }

            var response = await _actindoClient.PostAsync(
                endpoints.DeleteProduct,
                payload,
                cancellationToken);

            // Wenn Actindo ein success=false zurückgibt, als Fehler behandeln
            if (response.TryGetProperty("success", out var successProp) &&
                successProp.ValueKind == System.Text.Json.JsonValueKind.False)
            {
                var displayMessage = response.TryGetProperty("displayMessage", out var msg) ? msg.GetString() : null;
                var displayTitle = response.TryGetProperty("displayMessageTitle", out var title) ? title.GetString() : null;
                var error = response.TryGetProperty("error", out var err) ? err.GetRawText() : null;
                var message = !string.IsNullOrWhiteSpace(displayMessage)
                    ? displayMessage
                    : "Actindo Delete meldet Fehler.";
                return StatusCode(StatusCodes.Status502BadGateway, new { error = message, title = displayTitle, actindo = error });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway, new { error = ex.Message });
        }

        await _metricsService.DeleteJobAsync(request.JobId, cancellationToken);
        return NoContent();
    }
}
