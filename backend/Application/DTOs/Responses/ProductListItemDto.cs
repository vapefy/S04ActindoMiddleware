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

    /// <summary>
    /// "single" = kein Master/Variante, "master" = Hauptprodukt mit Varianten, "child" = Variante
    /// </summary>
    public string VariantStatus { get; init; } = "single";

    /// <summary>
    /// Bei Varianten: SKU des Master-Produkts
    /// </summary>
    public string? ParentSku { get; init; }

    /// <summary>
    /// Bei Varianten: Variantencode (z.B. "L", "M", "XL")
    /// </summary>
    public string? VariantCode { get; init; }
}

