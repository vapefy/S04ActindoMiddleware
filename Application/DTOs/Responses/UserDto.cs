using System;

namespace ActindoMiddleware.DTOs.Responses;

public sealed class UserDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public DateTimeOffset CreatedAt { get; init; }
}

