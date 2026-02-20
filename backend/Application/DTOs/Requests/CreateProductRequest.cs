using System.Text.Json.Serialization;
using ActindoMiddleware.DTOs;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class CreateProductRequest
{
    public required ProductDto Product { get; init; } = default!;

    [JsonPropertyName("await")]
    public bool Await { get; init; } = true;

    [JsonPropertyName("bufferId")]
    public string? BufferId { get; init; }
}
