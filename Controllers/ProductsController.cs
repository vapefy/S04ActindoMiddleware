using System.Linq;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ActindoMiddleware.Infrastructure.Actindo;
using System.Threading;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("products")]
[Authorize(Policy = AuthPolicies.Read)]
public sealed class ProductsController : ControllerBase
{
    private readonly IDashboardMetricsService _metricsService;
    private readonly ActindoProductListService _productListService;

    public ProductsController(
        IDashboardMetricsService metricsService,
        ActindoProductListService productListService)
    {
        _metricsService = metricsService;
        _productListService = productListService;
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
}
