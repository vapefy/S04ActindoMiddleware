using System.Collections.Generic;

namespace ActindoMiddleware.DTOs.Responses;

public sealed class CreateProductResponse
{
    public string Message { get; init; } = "Product created";
    public int ProductId { get; init; }
    public IReadOnlyCollection<VariantCreationResult> Variants { get; init; } =
        Array.Empty<VariantCreationResult>();
    public IReadOnlyCollection<string> VariantErrors { get; init; } =
        Array.Empty<string>();
    public bool Success { get; init; }
}
