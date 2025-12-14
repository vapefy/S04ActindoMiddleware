using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ActindoMiddleware.Application.Security;

public interface IUserStore
{
    Task<bool> HasAnyUsersAsync(CancellationToken cancellationToken = default);
    Task<UserRecord?> ValidateCredentialsAsync(string username, string password, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UserRecord>> GetUsersAsync(CancellationToken cancellationToken = default);
    Task<UserRecord> CreateUserAsync(string username, string password, string role, CancellationToken cancellationToken = default);
    Task SetUserRoleAsync(Guid userId, string role, CancellationToken cancellationToken = default);
    Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<RegistrationRecord> CreateRegistrationAsync(string username, string password, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<RegistrationRecord>> GetRegistrationsAsync(CancellationToken cancellationToken = default);
    Task ApproveRegistrationAsync(Guid registrationId, string role, CancellationToken cancellationToken = default);
    Task DeleteRegistrationAsync(Guid registrationId, CancellationToken cancellationToken = default);
}
