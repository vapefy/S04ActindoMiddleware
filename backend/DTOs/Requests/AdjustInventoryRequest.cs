using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class AdjustInventoryRequest
{
    [JsonPropertyName("inventories")]
    public Dictionary<string, InventoryEntry>? Inventories { get; set; }
}

public sealed class InventoryEntry
{
    [JsonPropertyName("stocks")]
    public List<InventoryStock> Stocks { get; set; } = new();
}

public sealed class InventoryStock
{
    [JsonPropertyName("warehouse_id")]
    public string? WarehouseId { get; set; }

    [JsonPropertyName("stock")]
    public decimal? Stock { get; set; }
}
