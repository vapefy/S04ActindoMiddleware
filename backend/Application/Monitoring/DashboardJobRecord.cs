using System;

namespace ActindoMiddleware.Application.Monitoring;

public sealed class DashboardJobRecord
{
    public Guid Id { get; init; }
    public DashboardMetricType Type { get; init; }
    public string Endpoint { get; init; } = string.Empty;
    public bool Success { get; init; }
    public long DurationMilliseconds { get; init; }
    public DateTimeOffset StartedAt { get; init; }
    public DateTimeOffset? CompletedAt { get; init; }
    public string RequestPayload { get; init; } = string.Empty;
    public string? ResponsePayload { get; init; }
    public string? ErrorPayload { get; init; }
}
