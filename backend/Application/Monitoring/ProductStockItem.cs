using System;

namespace ActindoMiddleware.Application.Monitoring;

public sealed class ProductStockItem
{
    public string Sku { get; init; } = string.Empty;
    public int WarehouseId { get; init; }
    public int Stock { get; init; }
    public DateTimeOffset UpdatedAt { get; init; }
}
