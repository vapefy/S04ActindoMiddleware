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

    public ActindoProductsController(
        ProductCreateService productCreateService,
        ProductSaveService productSaveService)
    {
        _productCreateService = productCreateService;
        _productSaveService = productSaveService;
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

        var result = await _productCreateService.CreateAsync(request, cancellationToken);

        return Created(
            string.Empty, // kein Location-Header notwendig
            result);
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

        var result = await _productSaveService.SaveAsync(request, cancellationToken);
        return Ok(result);
    }
}
