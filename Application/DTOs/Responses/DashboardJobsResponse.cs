using System;
using System.Collections.Generic;
using ActindoMiddleware.Application.Monitoring;

namespace ActindoMiddleware.DTOs.Responses;

public sealed class DashboardJobsResponse
{
    public IReadOnlyCollection<DashboardJobDto> Jobs { get; init; } = Array.Empty<DashboardJobDto>();
}

public sealed class DashboardJobDto
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
    public IReadOnlyCollection<DashboardJobActindoLogDto> ActindoLogs { get; init; } = Array.Empty<DashboardJobActindoLogDto>();
}

public sealed class ReplayJobRequest
{
    public string? Payload { get; init; }
}

public sealed class DashboardJobActindoLogDto
{
    public string Endpoint { get; init; } = string.Empty;
    public string RequestPayload { get; init; } = string.Empty;
    public string? ResponsePayload { get; init; }
    public bool Success { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
}
