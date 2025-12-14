using System;

namespace ActindoMiddleware.DTOs.Responses;

public sealed class ProductListItemDto
{
    public Guid JobId { get; init; }
    public int? ProductId { get; init; }
    public string Sku { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public int? VariantCount { get; init; }
    public DateTimeOffset? CreatedAt { get; init; }
}

