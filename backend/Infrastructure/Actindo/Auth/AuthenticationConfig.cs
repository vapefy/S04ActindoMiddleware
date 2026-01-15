using System.Text.Json;

namespace ActindoMiddleware.Infrastructure.Actindo.Auth;

public class AuthenticationConfig
{
    public string Url { get; set; }
    public JsonElement Payload { get; set; }
    public string ReturnField { get; set; }
}