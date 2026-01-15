using System;

namespace ActindoMiddleware.DTOs.Responses;

public sealed class CustomerListItemDto
{
    public Guid JobId { get; init; }
    public int? CustomerId { get; init; }
    public string DebtorNumber { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public DateTimeOffset? CreatedAt { get; init; }
}

