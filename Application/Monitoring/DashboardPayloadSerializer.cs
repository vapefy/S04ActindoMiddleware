using System;
using System.Text.Json;

namespace ActindoMiddleware.Application.Monitoring;

public static class DashboardPayloadSerializer
{
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true
    };

    public static string Serialize<T>(T value)
    {
        return JsonSerializer.Serialize(value, Options);
    }

    public static string SerializeError(Exception exception)
    {
        return Serialize(new
        {
            error = exception.Message
        });
    }
}
