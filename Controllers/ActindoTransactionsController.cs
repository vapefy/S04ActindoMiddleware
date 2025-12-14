using System.Diagnostics;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.Application.Services;
using ActindoMiddleware.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("actindo/transactions")]
[Authorize(Policy = AuthPolicies.Write)]
public sealed class ActindoTransactionsController : ControllerBase
{
    private readonly TransactionService _transactionService;
    private readonly IDashboardMetricsService _dashboardMetrics;

    public ActindoTransactionsController(
        TransactionService transactionService,
        IDashboardMetricsService dashboardMetrics)
    {
        _transactionService = transactionService;
        _dashboardMetrics = dashboardMetrics;
    }

    [HttpPost("get")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetTransactions(
        [FromBody] GetTransactionsRequest request,
        CancellationToken cancellationToken)
    {
        if (request == null)
            return BadRequest("Request payload is required");

        var jobHandle = await _dashboardMetrics.BeginJobAsync(
            DashboardMetricType.Transaction,
            DashboardJobEndpoints.TransactionsGet,
            DashboardPayloadSerializer.Serialize(request),
            cancellationToken);
        using var jobScope = DashboardJobContext.Begin(jobHandle.Id);
        var stopwatch = Stopwatch.StartNew();
        var success = false;
        string? responsePayload = null;
        string? errorPayload = null;
        try
        {
            var result = await _transactionService.GetTransactionsAsync(request, cancellationToken);
            success = true;
            responsePayload = DashboardPayloadSerializer.Serialize(result);
            return StatusCode(StatusCodes.Status201Created, result);
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
