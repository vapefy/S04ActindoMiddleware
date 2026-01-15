namespace ActindoMiddleware.Infrastructure.Actindo;

public sealed class ActindoOAuthOptions
{
    public string TokenEndpoint { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;

    /// <summary>
    /// Relative or absolute path where the refresh token will be persisted.
    /// Defaults to ".actindo-refresh-token" inside the content root.
    /// </summary>
    public string RefreshTokenFilePath { get; set; } = ".actindo-refresh-token";
}
