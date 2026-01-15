namespace ActindoMiddleware.DTOs.Responses;

public sealed class MeResponse
{
    public bool Authenticated { get; init; }
    public string Username { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
}

