using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Application.Security;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Infrastructure.Security;

public sealed class SqliteUserStore : IUserStore
{
    private const string DefaultConnectionString = "Data Source=App_Data/dashboard.db";
    private readonly string _connectionString;
    private readonly ILogger<SqliteUserStore> _logger;
    private bool _initialized;
    private readonly object _initGate = new();

    public SqliteUserStore(
        IConfiguration configuration,
        IHostEnvironment hostEnvironment,
        ILogger<SqliteUserStore> logger)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        ArgumentNullException.ThrowIfNull(hostEnvironment);
        ArgumentNullException.ThrowIfNull(logger);

        _logger = logger;
        _connectionString = BuildConnectionString(
            configuration.GetConnectionString("Dashboard"),
            hostEnvironment.ContentRootPath);
    }

    public async Task<bool> HasAnyUsersAsync(CancellationToken cancellationToken = default)
    {
        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(1) FROM Users;";
        var result = await command.ExecuteScalarAsync(cancellationToken);
        return Convert.ToInt64(result) > 0;
    }

    public async Task<UserRecord?> ValidateCredentialsAsync(
        string username,
        string password,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            return null;

        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = @"
SELECT Id, Username, Role, PasswordSalt, PasswordHash, PasswordIterations, CreatedAt
FROM Users
WHERE Username = @username
LIMIT 1;";
        command.Parameters.AddWithValue("@username", username.Trim());

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
            return null;

        var id = Guid.Parse(reader.GetString(0));
        var storedUsername = reader.GetString(1);
        var role = reader.GetString(2);
        var salt = (byte[])reader["PasswordSalt"];
        var hash = (byte[])reader["PasswordHash"];
        var iterations = reader.GetInt32(5);
        var createdAt = DateTimeOffset.Parse(reader.GetString(6));

        return PasswordHasher.Verify(password, salt, hash, iterations)
            ? new UserRecord(id, storedUsername, role, createdAt)
            : null;
    }

    public async Task<IReadOnlyList<UserRecord>> GetUsersAsync(CancellationToken cancellationToken = default)
    {
        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT Id, Username, Role, CreatedAt FROM Users ORDER BY Username;";

        var results = new List<UserRecord>();
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            results.Add(new UserRecord(
                Guid.Parse(reader.GetString(0)),
                reader.GetString(1),
                reader.GetString(2),
                DateTimeOffset.Parse(reader.GetString(3))));
        }

        return results;
    }

    public async Task<UserRecord> CreateUserAsync(
        string username,
        string password,
        string role,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new InvalidOperationException("Username is required.");
        if (string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("Password is required.");

        role = NormalizeRole(role);
        username = username.Trim();

        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await EnsureUsernameIsAvailableAsync(connection, username, cancellationToken);

        var hashResult = PasswordHasher.Hash(password);
        var now = DateTimeOffset.UtcNow;
        var id = Guid.NewGuid();

        await using var command = connection.CreateCommand();
        command.CommandText = @"
INSERT INTO Users (Id, Username, Role, PasswordSalt, PasswordHash, PasswordIterations, CreatedAt)
VALUES (@id, @username, @role, @salt, @hash, @iterations, @createdAt);";
        command.Parameters.AddWithValue("@id", id.ToString());
        command.Parameters.AddWithValue("@username", username);
        command.Parameters.AddWithValue("@role", role);
        command.Parameters.AddWithValue("@salt", hashResult.Salt);
        command.Parameters.AddWithValue("@hash", hashResult.Hash);
        command.Parameters.AddWithValue("@iterations", hashResult.Iterations);
        command.Parameters.AddWithValue("@createdAt", now.ToString("O"));

        try
        {
            await command.ExecuteNonQueryAsync(cancellationToken);
        }
        catch (SqliteException ex) when (ex.SqliteErrorCode == 19)
        {
            throw new InvalidOperationException("Username already exists.");
        }

        _logger.LogInformation("Created user {Username} with role {Role}", username, role);
        return new UserRecord(id, username, role, now);
    }

    public async Task SetUserRoleAsync(Guid userId, string role, CancellationToken cancellationToken = default)
    {
        role = NormalizeRole(role);

        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = "UPDATE Users SET Role = @role WHERE Id = @id;";
        command.Parameters.AddWithValue("@role", role);
        command.Parameters.AddWithValue("@id", userId.ToString());
        var rows = await command.ExecuteNonQueryAsync(cancellationToken);
        if (rows == 0)
            throw new InvalidOperationException("User not found.");
    }

    public async Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM Users WHERE Id = @id;";
        command.Parameters.AddWithValue("@id", userId.ToString());
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<RegistrationRecord> CreateRegistrationAsync(
        string username,
        string password,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new InvalidOperationException("Username is required.");
        if (string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("Password is required.");

        username = username.Trim();

        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await EnsureUsernameIsAvailableAsync(connection, username, cancellationToken);

        var hashResult = PasswordHasher.Hash(password);
        var now = DateTimeOffset.UtcNow;
        var id = Guid.NewGuid();

        await using var command = connection.CreateCommand();
        command.CommandText = @"
INSERT INTO Registrations (Id, Username, PasswordSalt, PasswordHash, PasswordIterations, CreatedAt)
VALUES (@id, @username, @salt, @hash, @iterations, @createdAt);";
        command.Parameters.AddWithValue("@id", id.ToString());
        command.Parameters.AddWithValue("@username", username);
        command.Parameters.AddWithValue("@salt", hashResult.Salt);
        command.Parameters.AddWithValue("@hash", hashResult.Hash);
        command.Parameters.AddWithValue("@iterations", hashResult.Iterations);
        command.Parameters.AddWithValue("@createdAt", now.ToString("O"));

        try
        {
            await command.ExecuteNonQueryAsync(cancellationToken);
        }
        catch (SqliteException ex) when (ex.SqliteErrorCode == 19)
        {
            throw new InvalidOperationException("Registration already exists for this username.");
        }

        _logger.LogInformation("Created registration for {Username}", username);
        return new RegistrationRecord(id, username, now);
    }

    public async Task<IReadOnlyList<RegistrationRecord>> GetRegistrationsAsync(CancellationToken cancellationToken = default)
    {
        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT Id, Username, CreatedAt FROM Registrations ORDER BY CreatedAt DESC;";

        var results = new List<RegistrationRecord>();
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            results.Add(new RegistrationRecord(
                Guid.Parse(reader.GetString(0)),
                reader.GetString(1),
                DateTimeOffset.Parse(reader.GetString(2))));
        }

        return results;
    }

    public async Task ApproveRegistrationAsync(Guid registrationId, string role, CancellationToken cancellationToken = default)
    {
        role = NormalizeRole(role);

        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);

        await using var select = connection.CreateCommand();
        select.Transaction = (SqliteTransaction)transaction;
        select.CommandText = @"
SELECT Id, Username, PasswordSalt, PasswordHash, PasswordIterations, CreatedAt
FROM Registrations
WHERE Id = @id
LIMIT 1;";
        select.Parameters.AddWithValue("@id", registrationId.ToString());

        await using var reader = await select.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            await transaction.RollbackAsync(cancellationToken);
            throw new InvalidOperationException("Registration not found.");
        }

        var username = reader.GetString(1);
        var salt = (byte[])reader["PasswordSalt"];
        var hash = (byte[])reader["PasswordHash"];
        var iterations = reader.GetInt32(4);
        var createdAt = DateTimeOffset.Parse(reader.GetString(5));

        await EnsureUsernameIsAvailableAsync(connection, username, cancellationToken, (SqliteTransaction)transaction, registrationId);

        await using (var insert = connection.CreateCommand())
        {
            insert.Transaction = (SqliteTransaction)transaction;
            insert.CommandText = @"
INSERT INTO Users (Id, Username, Role, PasswordSalt, PasswordHash, PasswordIterations, CreatedAt)
VALUES (@id, @username, @role, @salt, @hash, @iterations, @createdAt);";
            insert.Parameters.AddWithValue("@id", Guid.NewGuid().ToString());
            insert.Parameters.AddWithValue("@username", username);
            insert.Parameters.AddWithValue("@role", role);
            insert.Parameters.AddWithValue("@salt", salt);
            insert.Parameters.AddWithValue("@hash", hash);
            insert.Parameters.AddWithValue("@iterations", iterations);
            insert.Parameters.AddWithValue("@createdAt", createdAt.ToString("O"));
            await insert.ExecuteNonQueryAsync(cancellationToken);
        }

        await using (var delete = connection.CreateCommand())
        {
            delete.Transaction = (SqliteTransaction)transaction;
            delete.CommandText = "DELETE FROM Registrations WHERE Id = @id;";
            delete.Parameters.AddWithValue("@id", registrationId.ToString());
            await delete.ExecuteNonQueryAsync(cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);
        _logger.LogInformation("Approved registration for {Username} with role {Role}", username, role);
    }

    public async Task DeleteRegistrationAsync(Guid registrationId, CancellationToken cancellationToken = default)
    {
        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM Registrations WHERE Id = @id;";
        command.Parameters.AddWithValue("@id", registrationId.ToString());
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task ChangePasswordAsync(
        string username,
        string currentPassword,
        string newPassword,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new InvalidOperationException("Username is required.");
        if (string.IsNullOrWhiteSpace(currentPassword))
            throw new InvalidOperationException("Current password is required.");
        if (string.IsNullOrWhiteSpace(newPassword))
            throw new InvalidOperationException("New password is required.");

        await EnsureInitializedAsync(cancellationToken);
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        // Verify current password
        await using var selectCommand = connection.CreateCommand();
        selectCommand.CommandText = @"
SELECT Id, PasswordSalt, PasswordHash, PasswordIterations
FROM Users
WHERE Username = @username
LIMIT 1;";
        selectCommand.Parameters.AddWithValue("@username", username.Trim());

        await using var reader = await selectCommand.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
            throw new InvalidOperationException("User not found.");

        var id = reader.GetString(0);
        var salt = (byte[])reader["PasswordSalt"];
        var hash = (byte[])reader["PasswordHash"];
        var iterations = reader.GetInt32(3);

        if (!PasswordHasher.Verify(currentPassword, salt, hash, iterations))
            throw new InvalidOperationException("Current password is incorrect.");

        // Hash new password and update
        var newHashResult = PasswordHasher.Hash(newPassword);

        await using var updateCommand = connection.CreateCommand();
        updateCommand.CommandText = @"
UPDATE Users
SET PasswordSalt = @salt, PasswordHash = @hash, PasswordIterations = @iterations
WHERE Id = @id;";
        updateCommand.Parameters.AddWithValue("@salt", newHashResult.Salt);
        updateCommand.Parameters.AddWithValue("@hash", newHashResult.Hash);
        updateCommand.Parameters.AddWithValue("@iterations", newHashResult.Iterations);
        updateCommand.Parameters.AddWithValue("@id", id);
        await updateCommand.ExecuteNonQueryAsync(cancellationToken);

        _logger.LogInformation("Password changed for user {Username}", username);
    }

    private async Task EnsureInitializedAsync(CancellationToken cancellationToken)
    {
        if (_initialized)
            return;

        lock (_initGate)
        {
            if (_initialized)
                return;
            _initialized = true;
        }

        var dataSource = new SqliteConnectionStringBuilder(_connectionString).DataSource;
        if (!string.IsNullOrWhiteSpace(dataSource))
        {
            var directory = Path.GetDirectoryName(dataSource);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
        }

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = @"
CREATE TABLE IF NOT EXISTS Users (
    Id TEXT PRIMARY KEY,
    Username TEXT NOT NULL UNIQUE,
    Role TEXT NOT NULL,
    PasswordSalt BLOB NOT NULL,
    PasswordHash BLOB NOT NULL,
    PasswordIterations INTEGER NOT NULL,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Registrations (
    Id TEXT PRIMARY KEY,
    Username TEXT NOT NULL UNIQUE,
    PasswordSalt BLOB NOT NULL,
    PasswordHash BLOB NOT NULL,
    PasswordIterations INTEGER NOT NULL,
    CreatedAt TEXT NOT NULL
);";
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    private static string NormalizeRole(string role)
    {
        role = (role ?? string.Empty).Trim().ToLowerInvariant();
        return role switch
        {
            UserRole.Read => UserRole.Read,
            UserRole.Write => UserRole.Write,
            UserRole.Admin => UserRole.Admin,
            _ => throw new InvalidOperationException("Invalid role. Use read, write or admin.")
        };
    }

    private static async Task EnsureUsernameIsAvailableAsync(
        SqliteConnection connection,
        string username,
        CancellationToken cancellationToken,
        SqliteTransaction? transaction = null,
        Guid? ignoreRegistrationId = null)
    {
        await using var command = connection.CreateCommand();
        command.Transaction = transaction;
        command.CommandText = @"
SELECT 1 FROM Users WHERE Username = @username
UNION ALL
SELECT 1 FROM Registrations WHERE Username = @username AND (@ignoreId IS NULL OR Id <> @ignoreId)
LIMIT 1;";
        command.Parameters.AddWithValue("@username", username);
        command.Parameters.AddWithValue("@ignoreId", ignoreRegistrationId?.ToString() ?? (object)DBNull.Value);

        var exists = await command.ExecuteScalarAsync(cancellationToken);
        if (exists is not null)
            throw new InvalidOperationException("Username already exists or is pending approval.");
    }

    private static string BuildConnectionString(string? configured, string contentRoot)
    {
        var resolved = string.IsNullOrWhiteSpace(configured) ? DefaultConnectionString : configured;
        var builder = new SqliteConnectionStringBuilder(resolved);

        if (string.IsNullOrWhiteSpace(builder.DataSource))
            builder.DataSource = "App_Data/dashboard.db";

        if (!Path.IsPathRooted(builder.DataSource))
        {
            builder.DataSource = Path.Combine(contentRoot, builder.DataSource);
        }

        return builder.ToString();
    }
}
