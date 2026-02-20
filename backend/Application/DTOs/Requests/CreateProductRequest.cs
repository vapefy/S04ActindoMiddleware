using System.Text.Json.Serialization;
using ActindoMiddleware.DTOs;
using ActindoMiddleware.Infrastructure.Serialization;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class CreateProductRequest
{
    public required ProductDto Product { get; init; } = default!;

    [JsonPropertyName("await")]
    public bool Await { get; init; } = true;

    [JsonPropertyName("bufferId")]
    [JsonConverter(typeof(StringOrNumberJsonConverter))]
    public string? BufferId { get; init; }
}
