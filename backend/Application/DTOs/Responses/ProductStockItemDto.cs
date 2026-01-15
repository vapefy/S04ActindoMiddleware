using System;

namespace ActindoMiddleware.DTOs.Responses;

public sealed class ProductStockItemDto
{
    public string Sku { get; init; } = string.Empty;
    public int WarehouseId { get; init; }
    public int Stock { get; init; }
    public DateTimeOffset UpdatedAt { get; init; }
}
