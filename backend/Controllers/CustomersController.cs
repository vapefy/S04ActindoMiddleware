using System.Linq;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("api/customers")]
[Authorize(Policy = AuthPolicies.Read)]
public sealed class CustomersController : ControllerBase
{
    private readonly IDashboardMetricsService _metricsService;

    public CustomersController(IDashboardMetricsService metricsService)
    {
        _metricsService = metricsService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CustomerListItemDto>>> Get(int limit = 200, CancellationToken cancellationToken = default)
    {
        limit = Math.Clamp(limit, 1, 500);
        var items = await _metricsService.GetCreatedCustomersAsync(limit, cancellationToken);
        return Ok(items.Select(c => new CustomerListItemDto
        {
            JobId = c.JobId,
            CustomerId = c.CustomerId,
            DebtorNumber = c.DebtorNumber ?? string.Empty,
            Name = c.Name ?? string.Empty,
            CreatedAt = c.CreatedAt
        }));
    }
}

