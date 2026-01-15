using System;

namespace ActindoMiddleware.DTOs.Responses;

public sealed class RegistrationDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public DateTimeOffset CreatedAt { get; init; }
}

