using System.Linq;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("api/registrations")]
[Authorize(Policy = AuthPolicies.Admin)]
public sealed class RegistrationsController : ControllerBase
{
    private readonly IUserStore _userStore;

    public RegistrationsController(IUserStore userStore)
    {
        _userStore = userStore;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<RegistrationDto>>> Get(CancellationToken cancellationToken)
    {
        var registrations = await _userStore.GetRegistrationsAsync(cancellationToken);
        return Ok(registrations.Select(r => new RegistrationDto
        {
            Id = r.Id,
            Username = r.Username,
            CreatedAt = r.CreatedAt
        }));
    }

    [HttpPost("{registrationId:guid}/approve")]
    public async Task<IActionResult> Approve(Guid registrationId, [FromBody] ApproveRegistrationRequest request, CancellationToken cancellationToken)
    {
        await _userStore.ApproveRegistrationAsync(registrationId, request.Role, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{registrationId:guid}")]
    public async Task<IActionResult> Delete(Guid registrationId, CancellationToken cancellationToken)
    {
        await _userStore.DeleteRegistrationAsync(registrationId, cancellationToken);
        return NoContent();
    }
}
