using ActindoMiddleware.Application.Services;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("actindo/customer")]
public sealed class ActindoCustomersController : ControllerBase
{
    private readonly CustomerCreateService _customerCreateService;
    private readonly CustomerSaveService _customerSaveService;

    public ActindoCustomersController(
        CustomerCreateService customerCreateService,
        CustomerSaveService customerSaveService)
    {
        _customerCreateService = customerCreateService;
        _customerSaveService = customerSaveService;
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(CreateCustomerResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateCustomerResponse>> CreateCustomer(
        [FromBody] CreateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        if (request?.Customer == null || request.PrimaryAddress == null)
            return BadRequest("Customer and primaryAddress are required");

        var result = await _customerCreateService.CreateAsync(request, cancellationToken);
        return Created(string.Empty, result);
    }

    [HttpPost("save")]
    [ProducesResponseType(typeof(CreateCustomerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateCustomerResponse>> SaveCustomer(
        [FromBody] SaveCustomerRequest request,
        CancellationToken cancellationToken)
    {
        if (request?.Customer == null || request.PrimaryAddress == null)
            return BadRequest("Customer and primaryAddress are required");

        var result = await _customerSaveService.SaveAsync(request, cancellationToken);
        return Ok(result);
    }
}
