using System;

namespace ActindoMiddleware.Application.Monitoring;

public sealed class DashboardJobActindoLog
{
    public long Id { get; init; }
    public Guid JobId { get; init; }
    public string Endpoint { get; init; } = string.Empty;
    public string RequestPayload { get; init; } = string.Empty;
    public string? ResponsePayload { get; init; }
    public bool Success { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
}
