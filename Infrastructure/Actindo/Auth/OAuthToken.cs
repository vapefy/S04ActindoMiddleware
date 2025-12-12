using System.Text.Json.Serialization;

namespace ActindoMiddleware.Infrastructure.Actindo.Auth;

public sealed class OAuthToken
{
    [JsonPropertyName("access_token")] public string AccessToken { get; set; } = "";
    [JsonPropertyName("token_type")]   public string TokenType   { get; set; } = "bearer";
    [JsonPropertyName("expires_in")]   public int ExpiresIn   { get; set; } = 3600;
    [JsonPropertyName("refresh_token")]public string RefreshToken{ get; set; } = "";
    [JsonPropertyName("scope")]        public string Scope       { get; set; } = "";
    [JsonPropertyName("loggedOutCnt")] public int LoggedOutCnt { get; set; } = 1;
    // convenience
    [JsonIgnore] public DateTimeOffset? ExpiresAt { get; set; }
}