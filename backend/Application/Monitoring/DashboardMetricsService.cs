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

    Task<DashboardJobsResult> GetRecentJobsAsync(
        int limit,
        int offset,
        DashboardMetricType? typeFilter,
        string? search,
        bool? onlyFailed,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProductListItem>> GetCreatedProductsAsync(
        int limit,
        bool includeVariants,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProductListItem>> GetVariantsForMasterAsync(
        string masterSku,
        CancellationToken cancellationToken = default);

    Task SaveProductAsync(
        Guid jobId,
        string sku,
        string name,
        int? actindoProductId,
        string variantStatus,
        string? parentSku,
        string? variantCode,
        CancellationToken cancellationToken = default);

    Task UpdateProductPriceAsync(
        string sku,
        decimal? price,
        decimal? priceEmployee,
        decimal? priceMember,
        CancellationToken cancellationToken = default);

    Task UpdateProductPriceByActindoIdAsync(
        int actindoProductId,
        decimal? price,
        decimal? priceEmployee,
        decimal? priceMember,
        CancellationToken cancellationToken = default);

    Task UpdateProductStockAsync(
        string sku,
        int stock,
        int warehouseId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<CustomerListItem>> GetCreatedCustomersAsync(
        int limit,
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

public sealed record DashboardJobsResult(IReadOnlyList<DashboardJobRecord> Jobs, long Total);

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

    public async Task<DashboardJobsResult> GetRecentJobsAsync(
        int limit,
        int offset,
        DashboardMetricType? typeFilter,
        string? search,
        bool? onlyFailed,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        var jobs = new List<DashboardJobRecord>();
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var searchTerm = string.IsNullOrWhiteSpace(search) ? null : search.Trim().ToLowerInvariant();

        // Total count
        await using (var countCommand = connection.CreateCommand())
        {
            // onlyFailed: null = all, true = only failed (Success=0), false = only success (Success=1)
            countCommand.CommandText =
                """
                SELECT COUNT(1)
                FROM JobEvents
                WHERE (@typeFilter IS NULL OR Type = @typeFilter)
                  AND (@statusFilter IS NULL OR Success = @statusFilter)
                  AND (
                        @search IS NULL
                        OR lower(Endpoint) LIKE @searchLike
                        OR lower(COALESCE(RequestPayload,'')) LIKE @searchLike
                        OR lower(COALESCE(ResponsePayload,'')) LIKE @searchLike
                        OR lower(COALESCE(ErrorPayload,'')) LIKE @searchLike
                      );
                """;
            countCommand.Parameters.AddWithValue("@typeFilter", typeFilter.HasValue ? (object)(int)typeFilter.Value : DBNull.Value);
            countCommand.Parameters.AddWithValue("@search", (object?)searchTerm ?? DBNull.Value);
            countCommand.Parameters.AddWithValue("@searchLike", searchTerm is null ? DBNull.Value : $"%{searchTerm}%");
            // onlyFailed=true means Success=0, onlyFailed=false means Success=1, null means all
            countCommand.Parameters.AddWithValue("@statusFilter", onlyFailed.HasValue ? (object)(onlyFailed.Value ? 0 : 1) : DBNull.Value);

            var totalScalar = await countCommand.ExecuteScalarAsync(cancellationToken);
            var total = Convert.ToInt64(totalScalar);

            await FillJobs(connection, jobs, limit, offset, typeFilter, searchTerm, onlyFailed, cancellationToken);
            return new DashboardJobsResult(jobs, total);
        }
    }

    private static async Task FillJobs(
        SqliteConnection connection,
        List<DashboardJobRecord> jobs,
        int limit,
        int offset,
        DashboardMetricType? typeFilter,
        string? search,
        bool? onlyFailed,
        CancellationToken cancellationToken)
    {
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
              AND (@statusFilter IS NULL OR Success = @statusFilter)
              AND (
                    @search IS NULL
                    OR lower(Endpoint) LIKE @searchLike
                    OR lower(COALESCE(RequestPayload,'')) LIKE @searchLike
                    OR lower(COALESCE(ResponsePayload,'')) LIKE @searchLike
                    OR lower(COALESCE(ErrorPayload,'')) LIKE @searchLike
                  )
            ORDER BY COALESCE(CompletedAt, StartedAt) DESC
            LIMIT @limit OFFSET @offset;
            """;
        command.Parameters.AddWithValue("@limit", Math.Max(1, limit));
        command.Parameters.AddWithValue("@offset", Math.Max(0, offset));
        command.Parameters.AddWithValue("@typeFilter", typeFilter.HasValue ? (object)(int)typeFilter.Value : DBNull.Value);
        command.Parameters.AddWithValue("@search", (object?)search ?? DBNull.Value);
        command.Parameters.AddWithValue("@searchLike", search is null ? DBNull.Value : $"%{search}%");
        // onlyFailed=true means Success=0, onlyFailed=false means Success=1, null means all
        command.Parameters.AddWithValue("@statusFilter", onlyFailed.HasValue ? (object)(onlyFailed.Value ? 0 : 1) : DBNull.Value);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            jobs.Add(MapRecord(reader));
        }
    }

    public async Task<IReadOnlyList<ProductListItem>> GetCreatedProductsAsync(
        int limit,
        bool includeVariants,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        var products = new List<ProductListItem>();
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = includeVariants
            ? """
              SELECT p.Id,
                     p.JobId,
                     p.ActindoProductId,
                     p.Sku,
                     p.Name,
                     p.VariantStatus,
                     p.ParentSku,
                     p.VariantCode,
                     p.CreatedAt,
                     (SELECT COUNT(*) FROM Products c WHERE c.ParentSku = p.Sku) AS VariantCount,
                     p.LastPrice,
                     p.LastPriceEmployee,
                     p.LastPriceMember,
                     p.LastStock,
                     p.LastWarehouseId,
                     p.LastPriceUpdatedAt,
                     p.LastStockUpdatedAt
              FROM Products p
              ORDER BY p.CreatedAt DESC
              LIMIT @limit;
              """
            : """
              SELECT p.Id,
                     p.JobId,
                     p.ActindoProductId,
                     p.Sku,
                     p.Name,
                     p.VariantStatus,
                     p.ParentSku,
                     p.VariantCode,
                     p.CreatedAt,
                     (SELECT COUNT(*) FROM Products c WHERE c.ParentSku = p.Sku) AS VariantCount,
                     p.LastPrice,
                     p.LastPriceEmployee,
                     p.LastPriceMember,
                     p.LastStock,
                     p.LastWarehouseId,
                     p.LastPriceUpdatedAt,
                     p.LastStockUpdatedAt
              FROM Products p
              WHERE p.VariantStatus != 'child'
              ORDER BY p.CreatedAt DESC
              LIMIT @limit;
              """;
        command.Parameters.AddWithValue("@limit", Math.Max(1, limit));

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            products.Add(MapProductListItem(reader));
        }

        return products;
    }

    private static ProductListItem MapProductListItem(SqliteDataReader reader)
    {
        var createdAtStr = reader.IsDBNull(8) ? null : reader.GetString(8);
        DateTimeOffset? createdAt = null;
        if (createdAtStr != null && DateTimeOffset.TryParse(createdAtStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var parsed))
        {
            createdAt = parsed;
        }

        var variantCount = reader.IsDBNull(9) ? (int?)null : reader.GetInt32(9);

        var priceUpdatedAtStr = reader.IsDBNull(15) ? null : reader.GetString(15);
        DateTimeOffset? priceUpdatedAt = null;
        if (priceUpdatedAtStr != null && DateTimeOffset.TryParse(priceUpdatedAtStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var parsedPrice))
        {
            priceUpdatedAt = parsedPrice;
        }

        var stockUpdatedAtStr = reader.IsDBNull(16) ? null : reader.GetString(16);
        DateTimeOffset? stockUpdatedAt = null;
        if (stockUpdatedAtStr != null && DateTimeOffset.TryParse(stockUpdatedAtStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var parsedStock))
        {
            stockUpdatedAt = parsedStock;
        }

        return new ProductListItem
        {
            JobId = Guid.Parse(reader.GetString(1)),
            ProductId = reader.IsDBNull(2) ? null : reader.GetInt32(2),
            Sku = reader.GetString(3),
            Name = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
            VariantStatus = reader.GetString(5),
            ParentSku = reader.IsDBNull(6) ? null : reader.GetString(6),
            VariantCode = reader.IsDBNull(7) ? null : reader.GetString(7),
            CreatedAt = createdAt,
            VariantCount = variantCount > 0 ? variantCount : null,
            LastPrice = reader.IsDBNull(10) ? null : reader.GetDecimal(10),
            LastPriceEmployee = reader.IsDBNull(11) ? null : reader.GetDecimal(11),
            LastPriceMember = reader.IsDBNull(12) ? null : reader.GetDecimal(12),
            LastStock = reader.IsDBNull(13) ? null : reader.GetInt32(13),
            LastWarehouseId = reader.IsDBNull(14) ? null : reader.GetInt32(14),
            LastPriceUpdatedAt = priceUpdatedAt,
            LastStockUpdatedAt = stockUpdatedAt
        };
    }

    public async Task<IReadOnlyList<ProductListItem>> GetVariantsForMasterAsync(
        string masterSku,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        if (string.IsNullOrWhiteSpace(masterSku))
            return Array.Empty<ProductListItem>();

        var products = new List<ProductListItem>();
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            SELECT p.Id,
                   p.JobId,
                   p.ActindoProductId,
                   p.Sku,
                   p.Name,
                   p.VariantStatus,
                   p.ParentSku,
                   p.VariantCode,
                   p.CreatedAt,
                   0 AS VariantCount,
                   p.LastPrice,
                   p.LastPriceEmployee,
                   p.LastPriceMember,
                   p.LastStock,
                   p.LastWarehouseId,
                   p.LastPriceUpdatedAt,
                   p.LastStockUpdatedAt
            FROM Products p
            WHERE p.ParentSku = @masterSku
            ORDER BY p.Sku;
            """;
        command.Parameters.AddWithValue("@masterSku", masterSku);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            products.Add(MapProductListItem(reader));
        }

        return products;
    }

    public async Task SaveProductAsync(
        Guid jobId,
        string sku,
        string name,
        int? actindoProductId,
        string variantStatus,
        string? parentSku,
        string? variantCode,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            INSERT INTO Products (Id, JobId, ActindoProductId, Sku, Name, VariantStatus, ParentSku, VariantCode, CreatedAt)
            VALUES (@id, @jobId, @actindoProductId, @sku, @name, @variantStatus, @parentSku, @variantCode, @createdAt);
            """;

        command.Parameters.AddWithValue("@id", Guid.NewGuid().ToString());
        command.Parameters.AddWithValue("@jobId", jobId.ToString());
        command.Parameters.AddWithValue("@actindoProductId", actindoProductId.HasValue ? actindoProductId.Value : DBNull.Value);
        command.Parameters.AddWithValue("@sku", sku);
        command.Parameters.AddWithValue("@name", name ?? string.Empty);
        command.Parameters.AddWithValue("@variantStatus", variantStatus);
        command.Parameters.AddWithValue("@parentSku", (object?)parentSku ?? DBNull.Value);
        command.Parameters.AddWithValue("@variantCode", (object?)variantCode ?? DBNull.Value);
        command.Parameters.AddWithValue("@createdAt", DateTimeOffset.UtcNow.ToString("o", CultureInfo.InvariantCulture));

        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task UpdateProductPriceAsync(
        string sku,
        decimal? price,
        decimal? priceEmployee,
        decimal? priceMember,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        if (string.IsNullOrWhiteSpace(sku))
            return;

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            UPDATE Products
            SET LastPrice = @price,
                LastPriceEmployee = @priceEmployee,
                LastPriceMember = @priceMember,
                LastPriceUpdatedAt = @updatedAt
            WHERE Sku = @sku;
            """;

        command.Parameters.AddWithValue("@sku", sku);
        command.Parameters.AddWithValue("@price", price.HasValue ? price.Value : DBNull.Value);
        command.Parameters.AddWithValue("@priceEmployee", priceEmployee.HasValue ? priceEmployee.Value : DBNull.Value);
        command.Parameters.AddWithValue("@priceMember", priceMember.HasValue ? priceMember.Value : DBNull.Value);
        command.Parameters.AddWithValue("@updatedAt", DateTimeOffset.UtcNow.ToString("o", CultureInfo.InvariantCulture));

        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task UpdateProductPriceByActindoIdAsync(
        int actindoProductId,
        decimal? price,
        decimal? priceEmployee,
        decimal? priceMember,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            UPDATE Products
            SET LastPrice = @price,
                LastPriceEmployee = @priceEmployee,
                LastPriceMember = @priceMember,
                LastPriceUpdatedAt = @updatedAt
            WHERE ActindoProductId = @actindoProductId;
            """;

        command.Parameters.AddWithValue("@actindoProductId", actindoProductId);
        command.Parameters.AddWithValue("@price", price.HasValue ? price.Value : DBNull.Value);
        command.Parameters.AddWithValue("@priceEmployee", priceEmployee.HasValue ? priceEmployee.Value : DBNull.Value);
        command.Parameters.AddWithValue("@priceMember", priceMember.HasValue ? priceMember.Value : DBNull.Value);
        command.Parameters.AddWithValue("@updatedAt", DateTimeOffset.UtcNow.ToString("o", CultureInfo.InvariantCulture));

        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task UpdateProductStockAsync(
        string sku,
        int stock,
        int warehouseId,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        if (string.IsNullOrWhiteSpace(sku))
            return;

        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            UPDATE Products
            SET LastStock = @stock,
                LastWarehouseId = @warehouseId,
                LastStockUpdatedAt = @updatedAt
            WHERE Sku = @sku;
            """;

        command.Parameters.AddWithValue("@sku", sku);
        command.Parameters.AddWithValue("@stock", stock);
        command.Parameters.AddWithValue("@warehouseId", warehouseId);
        command.Parameters.AddWithValue("@updatedAt", DateTimeOffset.UtcNow.ToString("o", CultureInfo.InvariantCulture));

        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<CustomerListItem>> GetCreatedCustomersAsync(
        int limit,
        CancellationToken cancellationToken = default)
    {
        EnsureDatabase();

        var customers = new List<CustomerListItem>();
        await using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            SELECT Id,
                   RequestPayload,
                   ResponsePayload,
                   COALESCE(CompletedAt, StartedAt) AS CompletedAt
            FROM JobEvents
            WHERE Endpoint IN (@createEndpoint, @saveEndpoint) AND Success = 1
            ORDER BY COALESCE(CompletedAt, StartedAt) DESC
            LIMIT @limit;
            """;
        command.Parameters.AddWithValue("@createEndpoint", DashboardJobEndpoints.CustomerCreate);
        command.Parameters.AddWithValue("@saveEndpoint", DashboardJobEndpoints.CustomerSave);
        command.Parameters.AddWithValue("@limit", Math.Max(1, limit));

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            var requestPayload = reader.GetString(1);
            var responsePayload = reader.IsDBNull(2) ? null : reader.GetString(2);
            var completedAt = reader.IsDBNull(3)
                ? (DateTimeOffset?)null
                : DateTimeOffset.Parse(reader.GetString(3), CultureInfo.InvariantCulture);

            var (name, debtor) = TryParseCustomerFromRequest(requestPayload);
            var customerId = TryParseCustomerId(responsePayload);

            customers.Add(new CustomerListItem
            {
                JobId = Guid.Parse(reader.GetString(0)),
                CustomerId = customerId,
                DebtorNumber = debtor,
                Name = name,
                CreatedAt = completedAt
            });
        }

        return customers;
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

            // Products table for storing created products with variants
            using var productsCommand = connection.CreateCommand();
            productsCommand.CommandText =
                """
                CREATE TABLE IF NOT EXISTS Products
                (
                    Id TEXT PRIMARY KEY NOT NULL,
                    JobId TEXT NOT NULL,
                    ActindoProductId INTEGER NULL,
                    Sku TEXT NOT NULL,
                    Name TEXT NOT NULL DEFAULT '',
                    VariantStatus TEXT NOT NULL DEFAULT 'single',
                    ParentSku TEXT NULL,
                    VariantCode TEXT NULL,
                    CreatedAt TEXT NOT NULL,
                    FOREIGN KEY (JobId) REFERENCES JobEvents (Id) ON DELETE CASCADE
                );
                """;
            productsCommand.ExecuteNonQuery();

            using var productsSkuIndex = connection.CreateCommand();
            productsSkuIndex.CommandText =
                """
                CREATE INDEX IF NOT EXISTS IX_Products_Sku
                    ON Products (Sku);
                """;
            productsSkuIndex.ExecuteNonQuery();

            using var productsParentIndex = connection.CreateCommand();
            productsParentIndex.CommandText =
                """
                CREATE INDEX IF NOT EXISTS IX_Products_ParentSku
                    ON Products (ParentSku);
                """;
            productsParentIndex.ExecuteNonQuery();

            // Preis- und Bestandsfelder
            EnsureColumn(connection, "Products", "LastPrice", "REAL NULL");
            EnsureColumn(connection, "Products", "LastPriceEmployee", "REAL NULL");
            EnsureColumn(connection, "Products", "LastPriceMember", "REAL NULL");
            EnsureColumn(connection, "Products", "LastStock", "INTEGER NULL");
            EnsureColumn(connection, "Products", "LastWarehouseId", "INTEGER NULL");
            EnsureColumn(connection, "Products", "LastPriceUpdatedAt", "TEXT NULL");
            EnsureColumn(connection, "Products", "LastStockUpdatedAt", "TEXT NULL");

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

    private static (string sku, string name, int? variants, string variantStatus) TryParseProductFromRequest(string requestPayload)
    {
        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(requestPayload);
            if (!doc.RootElement.TryGetProperty("product", out var product))
                return (string.Empty, string.Empty, null, "single");

            var sku = product.TryGetProperty("sku", out var skuProp) ? skuProp.GetString() ?? string.Empty : string.Empty;
            var name = GetFirstNonEmpty(
                product,
                "name",
                "_pim_art_name__actindo_basic__de_DE",
                "_pim_art_name__actindo_basic__en_US",
                "_pim_art_nameactindo_basic_de_DE",
                "_pim_art_nameactindo_basic_en_US");

            int? variantCount = null;
            if (product.TryGetProperty("variants", out var variantsElement) &&
                variantsElement.ValueKind == System.Text.Json.JsonValueKind.Array)
            {
                variantCount = variantsElement.GetArrayLength();
            }

            // Extract variantStatus - default to "single" if not present, or "master" if variants exist
            var variantStatus = product.TryGetProperty("variantStatus", out var vsProp)
                ? vsProp.GetString() ?? "single"
                : (variantCount > 0 ? "master" : "single");

            return (sku, name, variantCount, variantStatus);
        }
        catch
        {
            return (string.Empty, string.Empty, null, "single");
        }
    }

    private static int? TryParseProductId(string? responsePayload)
    {
        if (string.IsNullOrWhiteSpace(responsePayload))
            return null;

        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(responsePayload);
            var root = doc.RootElement;
            if (root.TryGetProperty("productId", out var idProp) && idProp.TryGetInt32(out var id))
            {
                return id;
            }

            if (root.TryGetProperty("product", out var product))
            {
                if (product.TryGetProperty("id", out var pid) && pid.TryGetInt32(out var p))
                    return p;
                if (product.TryGetProperty("entityId", out var eid) && eid.TryGetInt32(out var e))
                    return e;
                if (pid.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(pid.GetString(), out var ps))
                    return ps;
            }
        }
        catch
        {
            // ignore
        }

        return null;
    }

    private static int? TryParseCustomerId(string? responsePayload)
    {
        if (string.IsNullOrWhiteSpace(responsePayload))
            return null;

        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(responsePayload);
            var root = doc.RootElement;
            if (root.TryGetProperty("customerId", out var cid) && cid.TryGetInt32(out var id))
                return id;

            if (root.TryGetProperty("customer", out var customer))
            {
                if (customer.TryGetProperty("id", out var pid) && pid.TryGetInt32(out var p))
                    return p;
                if (customer.TryGetProperty("entityId", out var eid) && eid.TryGetInt32(out var e))
                    return e;
                if (pid.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(pid.GetString(), out var ps))
                    return ps;
            }
        }
        catch
        {
            // ignore
        }

        return null;
    }

    private static (string name, string debtorNumber) TryParseCustomerFromRequest(string requestPayload)
    {
        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(requestPayload);
            if (!doc.RootElement.TryGetProperty("customer", out var customer))
                return (string.Empty, string.Empty);

            var name = customer.TryGetProperty("shortName", out var nameProp) ? nameProp.GetString() ?? string.Empty : string.Empty;
            var debtor = customer.TryGetProperty("_customer_debitorennumber", out var debProp) ? debProp.GetString() ?? string.Empty : string.Empty;
            return (name, debtor);
        }
        catch
        {
            return (string.Empty, string.Empty);
        }
    }

    private static string GetFirstNonEmpty(System.Text.Json.JsonElement element, params string[] propertyNames)
    {
        foreach (var name in propertyNames)
        {
            if (element.TryGetProperty(name, out var value) &&
                value.ValueKind == System.Text.Json.JsonValueKind.String)
            {
                var s = value.GetString();
                if (!string.IsNullOrWhiteSpace(s))
                    return s;
            }
        }

        return string.Empty;
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
