using ActindoMiddleware.Application.Security;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Policy = AuthPolicies.Admin)]
public sealed class UsersController : ControllerBase
{
    private readonly IUserStore _userStore;

    public UsersController(IUserStore userStore)
    {
        _userStore = userStore;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserDto>>> GetUsers(CancellationToken cancellationToken)
    {
        var users = await _userStore.GetUsersAsync(cancellationToken);
        return Ok(users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Role = u.Role,
            CreatedAt = u.CreatedAt
        }));
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
    {
        var created = await _userStore.CreateUserAsync(
            request.Username,
            request.Password,
            request.Role,
            cancellationToken);

        return Ok(new UserDto
        {
            Id = created.Id,
            Username = created.Username,
            Role = created.Role,
            CreatedAt = created.CreatedAt
        });
    }

    [HttpPut("{userId:guid}/role")]
    public async Task<IActionResult> SetRole(Guid userId, [FromBody] SetUserRoleRequest request, CancellationToken cancellationToken)
    {
        await _userStore.SetUserRoleAsync(userId, request.Role, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{userId:guid}")]
    public async Task<IActionResult> DeleteUser(Guid userId, CancellationToken cancellationToken)
    {
        await _userStore.DeleteUserAsync(userId, cancellationToken);
        return NoContent();
    }
}

