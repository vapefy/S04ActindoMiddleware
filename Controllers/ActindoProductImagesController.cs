using ActindoMiddleware.Application.Services;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("actindo/products/image")]
public sealed class ActindoProductImagesController : ControllerBase
{
    private readonly ProductImageService _productImageService;

    public ActindoProductImagesController(ProductImageService productImageService)
    {
        _productImageService = productImageService;
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

        var response = await _productImageService.UploadAsync(request, cancellationToken);
        return Created(string.Empty, response);
    }
}
