using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Monitoring;

public interface IDashboardMetricsService
{
    Task<DashboardJobHandle> BeginJobAsync(
        DashboardMetricType type,
        string endpoint,
        string requestPayload,
        CancellationToken cancellationToken = default);

    Task CompleteJobAsync(
        DashboardJobHandle handle,
        bool success,
        TimeSpan duration,
        string? responsePayload,
        string? errorPayload,
        CancellationToken cancellationToken = default);

    Task<DashboardMetricsSnapshot> GetSnapshotAsync(
        TimeSpan window,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DashboardJobRecord>> GetRecentJobsAsync(
        int limit,
        DashboardMetricType? typeFilter,
        CancellationToken cancellationToken = default);

    Task<DashboardJobRecord?> GetJobAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task AppendActindoLogAsync(
        Guid jobId,
        string endpoint,
        string requestPayload,
        string? responsePayload,
        bool success,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DashboardJobActindoLog>> GetActindoLogsAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task ClearJobHistoryAsync(CancellationToken cancellationToken = default);

    Task DeleteJobAsync(Guid jobId, CancellationToken cancellationToken = default);
}

public enum DashboardMetricType
{
    Product = 0,
    Customer = 1,
    Transaction = 2,
    Media = 3
}

public sealed record DashboardMetricEvent(
    DashboardMetricType Type,
    bool Success,
    TimeSpan Duration,
    DateTimeOffset CompletedAt);

public sealed record MetricSnapshot
{
    public int Success { get; init; }
    public int Failed { get; init; }
    public double AverageDurationSeconds { get; init; }

    public static MetricSnapshot Empty => new()
    {
        Success = 0,
        Failed = 0,
        AverageDurationSeconds = 0
    };
}

public sealed record DashboardMetricsSnapshot
{
    public int ActiveJobs { get; init; }
    public MetricSnapshot ProductStats { get; init; } = MetricSnapshot.Empty;
    public MetricSnapshot CustomerStats { get; init; } = MetricSnapshot.Empty;
    public MetricSnapshot TransactionStats { get; init; } = MetricSnapshot.Empty;
    public MetricSnapshot MediaStats { get; init; } = MetricSnapshot.Empty;
}

public sealed class DashboardMetricsService : IDashboardMetricsService
{
    private const string DefaultConnectionString = "Data Source=App_Data/dashboard.db";
    private readonly string _connectionString;
    private readonly ILogger<DashboardMetricsService> _logger;
    private bool _initialized;
    private readonly object _initializationLock = new();

    public DashboardMetricsService(
        IConfiguration configuration,
        IHostEnvironment hostEnvironment,
        ILogger<DashboardMetricsService> logger)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        ArgumentNullException.ThrowIfNull(hostEnvironment);
        ArgumentNullException.ThrowIfNull(logger);

        _logger = logger;
        _connectionString = BuildConnectionString(
            configuration.GetConnectionString("Dashboard"),
            hostEnvironment.ContentRootPath);
    }

    public async Task<DashboardJobHandle> BeginJobAsync(
        DashboardMetricType type,
        string endpoint,
        string requestPayload,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        var handle = new DashboardJobHandle(Guid.NewGuid());
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            INSERT INTO JobEvents (
                Id,
                Type,
                Success,
                DurationMilliseconds,
                StartedAt,
                Endpoint,
                RequestPayload)
            VALUES (@id, @type, 0, 0, @startedAt, @endpoint, @requestPayload);
            """;

        command.Parameters.AddWithValue("@id", handle.Id.ToString());
        command.Parameters.AddWithValue("@type", (int)type);
        command.Parameters.AddWithValue("@startedAt", DateTimeOffset.UtcNow.ToString("o", CultureInfo.InvariantCulture));
        command.Parameters.AddWithValue("@endpoint", endpoint);
        command.Parameters.AddWithValue("@requestPayload", requestPayload);

        await command.ExecuteNonQueryAsync(cancellationToken);

        return handle;
    }

    public async Task CompleteJobAsync(
        DashboardJobHandle handle,
        bool success,
        TimeSpan duration,
        string? responsePayload,
        string? errorPayload,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            UPDATE JobEvents
            SET Success = @success,
                DurationMilliseconds = @duration,
                CompletedAt = @completedAt,
                ResponsePayload = @responsePayload,
                ErrorPayload = @errorPayload
            WHERE Id = @id;
            """;

        command.Parameters.AddWithValue("@success", success ? 1 : 0);
        command.Parameters.AddWithValue("@duration", Math.Max(0, (long)Math.Round(duration.TotalMilliseconds)));
        command.Parameters.AddWithValue("@completedAt", DateTimeOffset.UtcNow.ToString("o", CultureInfo.InvariantCulture));
        command.Parameters.AddWithValue("@responsePayload", (object?)responsePayload ?? DBNull.Value);
        command.Parameters.AddWithValue("@errorPayload", (object?)errorPayload ?? DBNull.Value);
        command.Parameters.AddWithValue("@id", handle.Id.ToString());

        var affected = await command.ExecuteNonQueryAsync(cancellationToken);
        if (affected == 0)
        {
            _logger.LogWarning("Dashboard job handle {Handle} not found when completing.", handle.Id);
        }
    }

    public async Task<DashboardMetricsSnapshot> GetSnapshotAsync(
        TimeSpan window,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        var threshold = DateTimeOffset.UtcNow - window;
        var events = new List<DashboardMetricEvent>();
        int activeJobs;

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using (var activeCommand = connection.CreateCommand())
        {
            activeCommand.CommandText = "SELECT COUNT(*) FROM JobEvents WHERE CompletedAt IS NULL;";
            var scalar = await activeCommand.ExecuteScalarAsync(cancellationToken);
            activeJobs = Convert.ToInt32(scalar, CultureInfo.InvariantCulture);
        }

        await using (var statsCommand = connection.CreateCommand())
        {
            statsCommand.CommandText =
                """
                SELECT Type, Success, DurationMilliseconds, CompletedAt
                FROM JobEvents
                WHERE CompletedAt IS NOT NULL AND CompletedAt >= @threshold;
                """;

            statsCommand.Parameters.AddWithValue("@threshold", threshold.ToString("o", CultureInfo.InvariantCulture));

            await using var reader = await statsCommand.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                var typeValue = reader.GetInt32(0);
                if (!Enum.IsDefined(typeof(DashboardMetricType), typeValue))
                    continue;

                var type = (DashboardMetricType)typeValue;
                var success = reader.GetInt32(1) == 1;
                var duration = TimeSpan.FromMilliseconds(reader.GetInt64(2));
                var completedAtString = reader.GetString(3);
                var completedAt = DateTimeOffset.TryParse(
                    completedAtString,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.RoundtripKind,
                    out var parsedCompletedAt)
                    ? parsedCompletedAt
                    : DateTimeOffset.UtcNow;

                events.Add(new DashboardMetricEvent(
                    type,
                    success,
                    duration,
                    completedAt));
            }
        }

        return new DashboardMetricsSnapshot
        {
            ActiveJobs = activeJobs,
            ProductStats = BuildMetricSnapshot(events, DashboardMetricType.Product),
            CustomerStats = BuildMetricSnapshot(events, DashboardMetricType.Customer),
            TransactionStats = BuildMetricSnapshot(events, DashboardMetricType.Transaction),
            MediaStats = BuildMetricSnapshot(events, DashboardMetricType.Media)
        };
    }

    public async Task<IReadOnlyList<DashboardJobRecord>> GetRecentJobsAsync(
        int limit,
        DashboardMetricType? typeFilter,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        var jobs = new List<DashboardJobRecord>();
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            SELECT Id,
                   Type,
                   Success,
                   DurationMilliseconds,
                   StartedAt,
                   CompletedAt,
                   Endpoint,
                   RequestPayload,
                   ResponsePayload,
                   ErrorPayload
            FROM JobEvents
            WHERE (@typeFilter IS NULL OR Type = @typeFilter)
            ORDER BY COALESCE(CompletedAt, StartedAt) DESC
            LIMIT @limit;
            """;
        command.Parameters.AddWithValue("@limit", Math.Max(1, limit));
        if (typeFilter.HasValue)
        {
            command.Parameters.AddWithValue("@typeFilter", (int)typeFilter.Value);
        }
        else
        {
            command.Parameters.AddWithValue("@typeFilter", DBNull.Value);
        }

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            jobs.Add(MapRecord(reader));
        }

        return jobs;
    }

    public async Task<DashboardJobRecord?> GetJobAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            SELECT Id,
                   Type,
                   Success,
                   DurationMilliseconds,
                   StartedAt,
                   CompletedAt,
                   Endpoint,
                   RequestPayload,
                   ResponsePayload,
                   ErrorPayload
            FROM JobEvents
            WHERE Id = @id
            LIMIT 1;
            """;
        command.Parameters.AddWithValue("@id", jobId.ToString());

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (await reader.ReadAsync(cancellationToken))
        {
            return MapRecord(reader);
        }

        return null;
    }

    public async Task AppendActindoLogAsync(
        Guid jobId,
        string endpoint,
        string requestPayload,
        string? responsePayload,
        bool success,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            INSERT INTO JobActindoLogs (
                JobId,
                Endpoint,
                RequestPayload,
                ResponsePayload,
                Success,
                CreatedAt)
            VALUES (@jobId, @endpoint, @requestPayload, @responsePayload, @success, @createdAt);
            """;
        command.Parameters.AddWithValue("@jobId", jobId.ToString());
        command.Parameters.AddWithValue("@endpoint", endpoint);
        command.Parameters.AddWithValue("@requestPayload", requestPayload);
        command.Parameters.AddWithValue("@responsePayload", (object?)responsePayload ?? DBNull.Value);
        command.Parameters.AddWithValue("@success", success ? 1 : 0);
        command.Parameters.AddWithValue("@createdAt", DateTimeOffset.UtcNow.ToString("o", CultureInfo.InvariantCulture));

        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DashboardJobActindoLog>> GetActindoLogsAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();
        var logs = new List<DashboardJobActindoLog>();

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            SELECT Id,
                   JobId,
                   Endpoint,
                    RequestPayload,
                    ResponsePayload,
                    Success,
                    CreatedAt
            FROM JobActindoLogs
            WHERE JobId = @jobId
            ORDER BY Id ASC;
            """;
        command.Parameters.AddWithValue("@jobId", jobId.ToString());

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            logs.Add(MapActindoLog(reader));
        }

        return logs;
    }

    public async Task ClearJobHistoryAsync(CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var transaction = (SqliteTransaction)await connection.BeginTransactionAsync(cancellationToken);
        try
        {
            await using (var deleteLogs = connection.CreateCommand())
            {
                deleteLogs.Transaction = transaction;
                deleteLogs.CommandText = "DELETE FROM JobActindoLogs;";
                await deleteLogs.ExecuteNonQueryAsync(cancellationToken);
            }

            await using (var deleteJobs = connection.CreateCommand())
            {
                deleteJobs.Transaction = transaction;
                deleteJobs.CommandText = "DELETE FROM JobEvents;";
                await deleteJobs.ExecuteNonQueryAsync(cancellationToken);
            }

            await transaction.CommitAsync(cancellationToken);
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public async Task DeleteJobAsync(Guid jobId, CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var transaction = (SqliteTransaction)await connection.BeginTransactionAsync(cancellationToken);
        try
        {
            await using (var deleteLogs = connection.CreateCommand())
            {
                deleteLogs.Transaction = transaction;
                deleteLogs.CommandText = "DELETE FROM JobActindoLogs WHERE JobId = @jobId;";
                deleteLogs.Parameters.AddWithValue("@jobId", jobId.ToString());
                await deleteLogs.ExecuteNonQueryAsync(cancellationToken);
            }

            await using (var deleteJob = connection.CreateCommand())
            {
                deleteJob.Transaction = transaction;
                deleteJob.CommandText = "DELETE FROM JobEvents WHERE Id = @jobId;";
                deleteJob.Parameters.AddWithValue("@jobId", jobId.ToString());
                await deleteJob.ExecuteNonQueryAsync(cancellationToken);
            }

            await transaction.CommitAsync(cancellationToken);
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    private void EnsureDatabase()
    {
        if (_initialized)
            return;

        lock (_initializationLock)
        {
            if (_initialized)
                return;

            Directory.CreateDirectory(Path.GetDirectoryName(GetDatabasePath())!);
            using var connection = new SqliteConnection(_connectionString);
            connection.Open();

            using var command = connection.CreateCommand();
            command.CommandText =
                """
                CREATE TABLE IF NOT EXISTS JobEvents
                (
                    Id TEXT PRIMARY KEY NOT NULL,
                    Type INTEGER NOT NULL,
                    Success INTEGER NOT NULL DEFAULT 0,
                    DurationMilliseconds INTEGER NOT NULL DEFAULT 0,
                    StartedAt TEXT NOT NULL,
                    CompletedAt TEXT NULL,
                    Endpoint TEXT NOT NULL DEFAULT '',
                    RequestPayload TEXT NOT NULL DEFAULT '{}',
                    ResponsePayload TEXT NULL,
                    ErrorPayload TEXT NULL
                );
                """;
            command.ExecuteNonQuery();

            using var indexCommand = connection.CreateCommand();
            indexCommand.CommandText =
                """
                CREATE INDEX IF NOT EXISTS IX_JobEvents_CompletedAt
                    ON JobEvents (CompletedAt);
                """;
            indexCommand.ExecuteNonQuery();

            EnsureColumn(connection, "JobEvents", "Endpoint", "TEXT NOT NULL DEFAULT ''");
            EnsureColumn(connection, "JobEvents", "RequestPayload", "TEXT NOT NULL DEFAULT '{}'");
            EnsureColumn(connection, "JobEvents", "ResponsePayload", "TEXT NULL");
            EnsureColumn(connection, "JobEvents", "ErrorPayload", "TEXT NULL");

            using var logsCommand = connection.CreateCommand();
            logsCommand.CommandText =
                """
                CREATE TABLE IF NOT EXISTS JobActindoLogs
                (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    JobId TEXT NOT NULL,
                    Endpoint TEXT NOT NULL,
                    RequestPayload TEXT NOT NULL,
                    ResponsePayload TEXT NULL,
                    Success INTEGER NOT NULL DEFAULT 0,
                    CreatedAt TEXT NOT NULL,
                    FOREIGN KEY (JobId) REFERENCES JobEvents (Id) ON DELETE CASCADE
                );
                """;
            logsCommand.ExecuteNonQuery();

            using var logsIndex = connection.CreateCommand();
            logsIndex.CommandText =
                """
                CREATE INDEX IF NOT EXISTS IX_JobActindoLogs_JobId
                    ON JobActindoLogs (JobId);
                """;
            logsIndex.ExecuteNonQuery();

            _initialized = true;
        }
    }

    private static MetricSnapshot BuildMetricSnapshot(
        IReadOnlyCollection<DashboardMetricEvent> events,
        DashboardMetricType type)
    {
        var relevant = events.Where(evt => evt.Type == type).ToList();
        if (relevant.Count == 0)
            return MetricSnapshot.Empty;

        var failed = relevant.Count(evt => !evt.Success);
        var success = relevant.Count - failed;
        var averageSeconds = relevant.Average(evt => evt.Duration.TotalSeconds);

        return new MetricSnapshot
        {
            Success = success,
            Failed = failed,
            AverageDurationSeconds = Math.Round(averageSeconds, 2)
        };
    }

    private string GetDatabasePath()
    {
        var builder = new SqliteConnectionStringBuilder(_connectionString);
        return builder.DataSource;
    }

    private static void EnsureColumn(SqliteConnection connection, string table, string column, string definition)
    {
        using var pragmaCommand = connection.CreateCommand();
        pragmaCommand.CommandText = $"PRAGMA table_info({table});";

        using var reader = pragmaCommand.ExecuteReader();
        while (reader.Read())
        {
            var columnName = reader.GetString(1);
            if (string.Equals(columnName, column, StringComparison.OrdinalIgnoreCase))
                return;
        }

        using var alterCommand = connection.CreateCommand();
        alterCommand.CommandText = $"ALTER TABLE {table} ADD COLUMN {column} {definition};";
        alterCommand.ExecuteNonQuery();
    }

    private static DashboardJobRecord MapRecord(SqliteDataReader reader)
    {
        return new DashboardJobRecord
        {
            Id = Guid.Parse(reader.GetString(0)),
            Type = (DashboardMetricType)reader.GetInt32(1),
            Success = reader.GetInt32(2) == 1,
            DurationMilliseconds = reader.GetInt64(3),
            StartedAt = ParseDateTime(reader.GetString(4)),
            CompletedAt = reader.IsDBNull(5) ? null : ParseDateTime(reader.GetString(5)),
            Endpoint = reader.GetString(6),
            RequestPayload = reader.GetString(7),
            ResponsePayload = reader.IsDBNull(8) ? null : reader.GetString(8),
            ErrorPayload = reader.IsDBNull(9) ? null : reader.GetString(9)
        };
    }

    private static DashboardJobActindoLog MapActindoLog(SqliteDataReader reader)
    {
        return new DashboardJobActindoLog
        {
            Id = reader.GetInt64(0),
            JobId = Guid.Parse(reader.GetString(1)),
            Endpoint = reader.GetString(2),
            RequestPayload = reader.GetString(3),
            ResponsePayload = reader.IsDBNull(4) ? null : reader.GetString(4),
            Success = reader.GetInt32(5) == 1,
            CreatedAt = ParseDateTime(reader.GetString(6))
        };
    }

    private static DateTimeOffset ParseDateTime(string value)
    {
        return DateTimeOffset.TryParse(
            value,
            CultureInfo.InvariantCulture,
            DateTimeStyles.RoundtripKind,
            out var parsed)
            ? parsed
            : DateTimeOffset.UtcNow;
    }

    private static string BuildConnectionString(string? configured, string contentRoot)
    {
        var builder = new SqliteConnectionStringBuilder(
            string.IsNullOrWhiteSpace(configured) ? DefaultConnectionString : configured);

        if (!Path.IsPathRooted(builder.DataSource))
        {
            builder.DataSource = Path.Combine(contentRoot, builder.DataSource);
        }

        return builder.ToString();
    }
}
