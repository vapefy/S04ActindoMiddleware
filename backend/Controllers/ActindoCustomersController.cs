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
[Route("api/actindo/customer")]
[Authorize(Policy = AuthPolicies.Write)]
public sealed class ActindoCustomersController : ControllerBase
{
    private readonly CustomerCreateService _customerCreateService;
    private readonly CustomerSaveService _customerSaveService;
    private readonly IDashboardMetricsService _dashboardMetrics;

    public ActindoCustomersController(
        CustomerCreateService customerCreateService,
        CustomerSaveService customerSaveService,
        IDashboardMetricsService dashboardMetrics)
    {
        _customerCreateService = customerCreateService;
        _customerSaveService = customerSaveService;
        _dashboardMetrics = dashboardMetrics;
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(CreateCustomerResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateCustomerResponse>> CreateCustomer(
        [FromBody] CreateCustomerRequest request,
        CancellationToken _)
    {
        if (request?.Customer == null || request.PrimaryAddress == null)
            return BadRequest("Customer and primaryAddress are required");

        using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(10));
        var cancellationToken = cts.Token;

        var jobHandle = await _dashboardMetrics.BeginJobAsync(
            DashboardMetricType.Customer,
            DashboardJobEndpoints.CustomerCreate,
            DashboardPayloadSerializer.Serialize(request),
            cancellationToken);
        using var jobScope = DashboardJobContext.Begin(jobHandle.Id);
        var stopwatch = Stopwatch.StartNew();
        var success = false;
        string? responsePayload = null;
        string? errorPayload = null;
        try
        {
            var result = await _customerCreateService.CreateAsync(request, cancellationToken);
            success = true;
            responsePayload = DashboardPayloadSerializer.Serialize(result);
            return Created(string.Empty, result);
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

    [HttpPost("save")]
    [ProducesResponseType(typeof(CreateCustomerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateCustomerResponse>> SaveCustomer(
        [FromBody] SaveCustomerRequest request,
        CancellationToken _)
    {
        if (request?.Customer == null || request.PrimaryAddress == null)
            return BadRequest("Customer and primaryAddress are required");

        using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(10));
        var cancellationToken = cts.Token;

        var jobHandle = await _dashboardMetrics.BeginJobAsync(
            DashboardMetricType.Customer,
            DashboardJobEndpoints.CustomerSave,
            DashboardPayloadSerializer.Serialize(request),
            cancellationToken);
        using var jobScope = DashboardJobContext.Begin(jobHandle.Id);
        var stopwatch = Stopwatch.StartNew();
        var success = false;
        string? responsePayload = null;
        string? errorPayload = null;
        try
        {
            var result = await _customerSaveService.SaveAsync(request, cancellationToken);
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
