using System.Collections.Generic;
using System.Security.Claims;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IUserStore _userStore;

    public AuthController(IUserStore userStore)
    {
        _userStore = userStore;
    }

    [HttpGet("me")]
    public ActionResult<MeResponse> Me()
    {
        var identity = User?.Identity;
        if (identity?.IsAuthenticated != true)
        {
            return Ok(new MeResponse { Authenticated = false });
        }

        var principal = User ?? throw new InvalidOperationException("No ClaimsPrincipal available.");
        var username = principal.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var role = principal.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        return Ok(new MeResponse
        {
            Authenticated = true,
            Username = username,
            Role = role
        });
    }

    [HttpGet("bootstrap-needed")]
    public async Task<IActionResult> BootstrapNeeded(CancellationToken cancellationToken)
    {
        var hasAny = await _userStore.HasAnyUsersAsync(cancellationToken);
        return Ok(new { needed = !hasAny });
    }

    [HttpPost("bootstrap")]
    public async Task<IActionResult> Bootstrap([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
    {
        var hasAny = await _userStore.HasAnyUsersAsync(cancellationToken);
        if (hasAny)
            return Forbid();

        var created = await _userStore.CreateUserAsync(
            request.Username,
            request.Password,
            UserRole.Admin,
            cancellationToken);

        await SignInAsync(created.Username, created.Role);
        return Ok(new { created.Username, created.Role });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await _userStore.ValidateCredentialsAsync(
            request.Username ?? string.Empty,
            request.Password ?? string.Empty,
            cancellationToken);

        if (user is null)
            return Unauthorized(new { error = "Invalid username or password" });

        await SignInAsync(user.Username, user.Role);
        return Ok(new { user.Username, user.Role });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var registration = await _userStore.CreateRegistrationAsync(
                request.Username,
                request.Password,
                cancellationToken);
            return Ok(new { registration.Id, registration.Username, registration.CreatedAt });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    private async Task SignInAsync(string username, string role)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username),
            new(ClaimTypes.Role, role)
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {
                IsPersistent = true
            });
    }
}
