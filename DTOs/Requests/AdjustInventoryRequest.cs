using System.Text.Json.Serialization;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class AdjustInventoryRequest
{
    [JsonPropertyName("sku")]
    public string? Sku { get; set; }

    [JsonPropertyName("stock")]
    public decimal? Stock { get; set; }

    [JsonPropertyName("warehouse_id")]
    public int? WarehouseId { get; set; }
}
