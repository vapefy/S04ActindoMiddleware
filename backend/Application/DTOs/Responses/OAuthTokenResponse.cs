using System.Text.Json.Serialization;

namespace ActindoMiddleware.DTOs.Responses;

public sealed class OAuthTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = default!;

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}
