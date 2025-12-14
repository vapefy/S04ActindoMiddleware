using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ActindoMiddleware.Infrastructure.Security;

public static class StaticBearerDefaults
{
    public const string AuthenticationScheme = "StaticBearer";
}

public sealed class StaticBearerOptions : AuthenticationSchemeOptions
{
    /// <summary>
    /// Fallback bearer token, can be overridden via configuration ("StaticBearer:Token").
    /// </summary>
    public string Token { get; set; } = "oS4rP1nXQk8sJ3hC7dG2zF9aVwB0YpLmR2tH8eQxU5bN7kZcA1fM6jTqE3vW9yL";
}

public sealed class StaticBearerAuthenticationHandler : AuthenticationHandler<StaticBearerOptions>
{
    public StaticBearerAuthenticationHandler(
        IOptionsMonitor<StaticBearerOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("Authorization", out var authHeader) || authHeader.Count == 0)
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var header = authHeader.ToString();
        if (!header.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var token = header.Substring("Bearer ".Length).Trim();
        if (string.IsNullOrWhiteSpace(token) || !string.Equals(token, Options.Token, StringComparison.Ordinal))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid bearer token"));
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "api-bearer"),
            new Claim(ClaimTypes.Role, Application.Security.UserRole.Admin)
        };
        var identity = new ClaimsIdentity(claims, StaticBearerDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, StaticBearerDefaults.AuthenticationScheme);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
