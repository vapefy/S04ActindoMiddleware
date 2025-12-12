using ActindoMiddleware.Application.Services;
using ActindoMiddleware.DTOs.Requests;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("actindo/transactions")]
public sealed class ActindoTransactionsController : ControllerBase
{
    private readonly TransactionService _transactionService;

    public ActindoTransactionsController(TransactionService transactionService)
    {
        _transactionService = transactionService;
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

        var result = await _transactionService.GetTransactionsAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }
}
