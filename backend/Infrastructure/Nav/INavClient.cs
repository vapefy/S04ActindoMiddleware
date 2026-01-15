namespace ActindoMiddleware.Infrastructure.Nav;

/// <summary>
/// Response from NAV API for customer Actindo IDs
/// </summary>
public sealed record NavCustomerRecord(int NavId, int? ActindoId);

/// <summary>
/// Response from NAV API for product Actindo IDs
/// </summary>
public sealed record NavProductRecord(int NavId, string Sku, int? ActindoId);

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
    /// Get all products with their Actindo IDs from NAV
    /// </summary>
    Task<IReadOnlyList<NavProductRecord>> GetProductsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Set Actindo ID for a single customer in NAV
    /// </summary>
    Task SetCustomerActindoIdAsync(int navId, int actindoId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Set Actindo IDs for multiple products in NAV
    /// </summary>
    Task SetProductActindoIdsAsync(IEnumerable<(int NavId, int ActindoId)> products, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if NAV API is configured
    /// </summary>
    Task<bool> IsConfiguredAsync(CancellationToken cancellationToken = default);
}
