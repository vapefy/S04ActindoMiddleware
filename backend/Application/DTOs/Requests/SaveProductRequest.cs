using System.Text.Json.Serialization;
using ActindoMiddleware.DTOs;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class SaveProductRequest
{
    public required ProductDto Product { get; init; }

    [JsonPropertyName("await")]
    public bool Await { get; init; } = true;

    [JsonPropertyName("bufferId")]
    public string? BufferId { get; init; }
}
