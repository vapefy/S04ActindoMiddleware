namespace ActindoMiddleware.Infrastructure.Nav;

/// <summary>
/// Response from NAV API for customer Actindo IDs
/// </summary>
public sealed record NavCustomerRecord(int NavId, int? ActindoId);

/// <summary>
/// Response from NAV API for product variant
/// </summary>
public sealed record NavProductVariant(string NavId, string? ActindoId, string Name);

/// <summary>
/// Response from NAV API for product Actindo IDs (with nested variants)
/// </summary>
public sealed record NavProductRecord
{
    public required string NavId { get; init; }
    public required string Sku { get; init; }
    public string? ActindoId { get; init; }
    public string Name { get; init; } = string.Empty;
    public IReadOnlyList<NavProductVariant> Variants { get; init; } = Array.Empty<NavProductVariant>();
}

/// <summary>
/// Client for communicating with NAV API
/// </summary>
public interface INavClient
{
    /// <summary>
    /// Get all customers with their Actindo IDs from NAV
    /// </summary>
    Task<IReadOnlyList<NavCustomerRecord>> GetCustomersAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all products with their Actindo IDs from NAV (includes nested variants)
    /// </summary>
    Task<IReadOnlyList<NavProductRecord>> GetProductsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Set Actindo ID for a single customer in NAV
    /// </summary>
    Task SetCustomerActindoIdAsync(int navId, int actindoId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Set Actindo IDs for multiple products in NAV (supports variants)
    /// </summary>
    Task SetProductActindoIdsAsync(
        IEnumerable<NavProductSyncRequest> products,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if NAV API is configured
    /// </summary>
    Task<bool> IsConfiguredAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Request to set Actindo ID for a product (with optional variants)
/// </summary>
public sealed record NavProductSyncRequest
{
    public required string NavId { get; init; }
    public required string ActindoId { get; init; }
    public IReadOnlyList<NavVariantSyncRequest>? Variants { get; init; }
}

/// <summary>
/// Request to set Actindo ID for a variant
/// </summary>
public sealed record NavVariantSyncRequest
{
    public required string NavId { get; init; }
    public required string ActindoId { get; init; }
}
