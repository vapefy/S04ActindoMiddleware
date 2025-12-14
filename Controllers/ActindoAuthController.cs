using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.Infrastructure.Actindo.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("actindo/auth")]
[Authorize(Policy = AuthPolicies.Admin)]
public sealed class ActindoAuthController : ControllerBase
{
    private readonly IAuthenticationService _authenticationService;

    public ActindoAuthController(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    /// <summary>
    /// Tauscht einen Authorization Code gegen Access/Refresh Token und speichert das Refresh Token.
    /// </summary>
    [HttpPost("exchange")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ExchangeAuthorizationCode(
        [FromBody] ExchangeAuthCodeRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request?.Code) ||
            string.IsNullOrWhiteSpace(request.RedirectUri))
        {
            return BadRequest("Code and redirectUri are required.");
        }

        var token = await _authenticationService
            .ExchangeAuthorizationCodeAsync(request.Code, request.RedirectUri, cancellationToken);

        return Ok(new
        {
            token.AccessToken,
            token.RefreshToken,
            token.ExpiresIn
        });
    }

    [HttpPost("reset")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public IActionResult ResetTokens()
    {
        _authenticationService.ClearTokens();
        return NoContent();
    }
}
