namespace ActindoMiddleware.DTOs.Responses;

/// <summary>
/// Status of a single product for sync
/// </summary>
public sealed class ProductSyncItemDto
{
    public string Sku { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public int? MiddlewareActindoId { get; init; }
    public int? NavNavId { get; init; }
    public int? NavActindoId { get; init; }
    public bool NeedsSync { get; init; }
    public string VariantStatus { get; init; } = "single";
}

/// <summary>
/// Status of a single customer for sync
/// </summary>
public sealed class CustomerSyncItemDto
{
    public string DebtorNumber { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public int? MiddlewareActindoId { get; init; }
    public int? NavNavId { get; init; }
    public int? NavActindoId { get; init; }
    public bool NeedsSync { get; init; }
}

/// <summary>
/// Summary of sync status for products
/// </summary>
public sealed class ProductSyncStatusDto
{
    public int TotalInMiddleware { get; init; }
    public int TotalInNav { get; init; }
    public int Synced { get; init; }
    public int NeedsSync { get; init; }
    public IReadOnlyList<ProductSyncItemDto> Items { get; init; } = [];
}

/// <summary>
/// Summary of sync status for customers
/// </summary>
public sealed class CustomerSyncStatusDto
{
    public int TotalInMiddleware { get; init; }
    public int TotalInNav { get; init; }
    public int Synced { get; init; }
    public int NeedsSync { get; init; }
    public IReadOnlyList<CustomerSyncItemDto> Items { get; init; } = [];
}

/// <summary>
/// Request to sync products to NAV
/// </summary>
public sealed class SyncProductsRequest
{
    public IReadOnlyList<string> Skus { get; init; } = [];
}

/// <summary>
/// Request to sync a customer to NAV
/// </summary>
public sealed class SyncCustomerRequest
{
    public string DebtorNumber { get; init; } = string.Empty;
}
