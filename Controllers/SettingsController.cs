using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.Infrastructure.Actindo.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("settings")]
[Authorize(Policy = AuthPolicies.Admin)]
public sealed class SettingsController : ControllerBase
{
    private readonly ISettingsStore _settingsStore;
    private readonly IActindoEndpointProvider _endpointProvider;
    private readonly IAuthenticationService _authenticationService;

    public SettingsController(
        ISettingsStore settingsStore,
        IActindoEndpointProvider endpointProvider,
        IAuthenticationService authenticationService)
    {
        _settingsStore = settingsStore;
        _endpointProvider = endpointProvider;
        _authenticationService = authenticationService;
    }

    [HttpGet("actindo")]
    public async Task<ActionResult<ActindoSettingsDto>> GetActindoSettings(CancellationToken cancellationToken)
    {
        var settings = await _settingsStore.GetActindoSettingsAsync(cancellationToken);
        return Ok(new ActindoSettingsDto
        {
            AccessToken = settings.AccessToken,
            AccessTokenExpiresAt = settings.AccessTokenExpiresAt,
            RefreshToken = settings.RefreshToken,
            TokenEndpoint = settings.TokenEndpoint,
            ClientId = settings.ClientId,
            ClientSecret = settings.ClientSecret,
            Endpoints = settings.Endpoints ?? new()
        });
    }

    [HttpPut("actindo")]
    public async Task<IActionResult> SaveActindoSettings([FromBody] ActindoSettingsDto payload, CancellationToken cancellationToken)
    {
        var toSave = new ActindoSettings
        {
            AccessToken = payload.AccessToken,
            AccessTokenExpiresAt = payload.AccessTokenExpiresAt,
            RefreshToken = payload.RefreshToken,
            TokenEndpoint = payload.TokenEndpoint,
            ClientId = payload.ClientId,
            ClientSecret = payload.ClientSecret,
            Endpoints = payload.Endpoints ?? new()
        };

        await _settingsStore.SaveActindoSettingsAsync(toSave, cancellationToken);
        _endpointProvider.Invalidate();
        _authenticationService.InvalidateCache();
        return NoContent();
    }
}
