using System;

namespace ActindoMiddleware.Application.Security;

public sealed record UserRecord(
    Guid Id,
    string Username,
    string Role,
    DateTimeOffset CreatedAt);

