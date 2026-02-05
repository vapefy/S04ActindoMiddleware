using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

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
}
