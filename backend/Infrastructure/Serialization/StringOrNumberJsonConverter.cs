using System.Text.Json;
using System.Text.Json.Serialization;

namespace ActindoMiddleware.Infrastructure.Serialization;

/// <summary>
/// Accepts both JSON strings and numbers as string values.
/// Useful when external systems send numeric IDs that should be treated as strings.
/// </summary>
public sealed class StringOrNumberJsonConverter : JsonConverter<string?>
{
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return reader.TokenType switch
        {
            JsonTokenType.String => reader.GetString(),
            JsonTokenType.Number => reader.GetRawText(),
            JsonTokenType.Null => null,
            _ => throw new JsonException($"Cannot convert {reader.TokenType} to string")
        };
    }

    public override void Write(Utf8JsonWriter writer, string? value, JsonSerializerOptions options)
    {
        if (value is null)
            writer.WriteNullValue();
        else
            writer.WriteStringValue(value);
    }
}
