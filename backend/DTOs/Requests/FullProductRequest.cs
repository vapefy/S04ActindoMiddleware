using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using ActindoMiddleware.Infrastructure.Serialization;

namespace ActindoMiddleware.DTOs.Requests;

/// <summary>
/// Request für den Full Product Endpoint - erstellt/speichert Produkt mit Varianten, Preisen und Beständen in einem Request.
/// </summary>
public sealed class FullProductRequest
{
    /// <summary>
    /// Das Hauptprodukt (wird direkt an Actindo gesendet, ohne das variants-Feld).
    /// </summary>
    [JsonPropertyName("product")]
    public JsonElement Product { get; set; }

    /// <summary>
    /// Bestände pro SKU.
    /// </summary>
    [JsonPropertyName("inventories")]
    public Dictionary<string, InventoryEntry>? Inventories { get; set; }

    /// <summary>
    /// Wenn false: sofort 202 antworten und Sync im Hintergrund ausführen. NAV Callback erforderlich.
    /// </summary>
    [JsonPropertyName("await")]
    public bool Await { get; init; } = true;

    /// <summary>
    /// Buffer-ID aus NAV, wird im Callback zurückgesendet.
    /// </summary>
    [JsonPropertyName("bufferId")]
    [JsonConverter(typeof(StringOrNumberJsonConverter))]
    public string? BufferId { get; init; }
}
