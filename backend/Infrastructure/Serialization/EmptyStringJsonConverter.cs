using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ActindoMiddleware.Infrastructure.Serialization;

/// <summary>
/// Allows reference-type properties to treat empty string JSON tokens as null.
/// Useful for APIs that sometimes send "" instead of an object.
/// </summary>
public sealed class EmptyStringJsonConverter<T> : JsonConverter<T?> where T : class
{
    public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            var value = reader.GetString();
            return string.IsNullOrEmpty(value) ? null : throw new JsonException($"Cannot convert non-empty string to {typeof(T).Name}.");
        }

        return JsonSerializer.Deserialize<T>(ref reader, options);
    }

    public override void Write(Utf8JsonWriter writer, T? value, JsonSerializerOptions options)
    {
        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        JsonSerializer.Serialize(writer, value, options);
    }
}
