using ActindoMiddleware.DTOs;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class SaveProductRequest
{
    public required ProductDto Product { get; init; }
}
