using ActindoMiddleware.DTOs;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class CreateProductRequest
{
    public required ProductDto Product { get; init; } = default!;
}
