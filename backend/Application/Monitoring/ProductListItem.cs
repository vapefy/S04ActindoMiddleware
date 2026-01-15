using System;

namespace ActindoMiddleware.Application.Monitoring;

public sealed class ProductListItem
{
    public Guid JobId { get; init; }
    public int? ProductId { get; init; }
    public string Sku { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public int? VariantCount { get; init; }
    public DateTimeOffset? CreatedAt { get; init; }
    public string VariantStatus { get; init; } = "single";
    public string? ParentSku { get; init; }
    public string? VariantCode { get; init; }
}

