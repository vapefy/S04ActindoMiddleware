using System;

namespace ActindoMiddleware.Infrastructure.Actindo.Auth;

public sealed class OAuthStatusSnapshot
{
    public bool HasAccessToken { get; init; }
    public bool HasRefreshToken { get; init; }
    public DateTimeOffset? AccessTokenExpiresAt { get; init; }
    public DateTimeOffset? LastErrorAt { get; init; }
    public string? LastErrorMessage { get; init; }
}
