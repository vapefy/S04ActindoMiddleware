using System;

namespace ActindoMiddleware.Application.Security;

public sealed record RegistrationRecord(Guid Id, string Username, DateTimeOffset CreatedAt);

