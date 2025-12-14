using System;
using System.Collections.Generic;

namespace ActindoMiddleware.Application.Configuration;

public sealed class ActindoSettings
{
    public string? AccessToken { get; init; }
    public DateTimeOffset? AccessTokenExpiresAt { get; init; }
    public string? RefreshToken { get; init; }
    public string? TokenEndpoint { get; init; }
    public string? ClientId { get; init; }
    public string? ClientSecret { get; init; }
    public Dictionary<string, string> Endpoints { get; init; } = new();
}

