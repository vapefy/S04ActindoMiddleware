using System;

namespace ActindoMiddleware.Infrastructure.Actindo;

public sealed class ActindoAvailabilitySnapshot
{
    public string State { get; init; } = "unknown";
    public string Message { get; init; } = string.Empty;
    public DateTimeOffset? LastSuccessAt { get; init; }
    public DateTimeOffset? LastFailureAt { get; init; }
}

