using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Nav;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActindoMiddleware.Controllers;

[ApiController]
[Route("api/sync")]
[Authorize(Policy = AuthPolicies.Write)]
public sealed class SyncController : ControllerBase
{
    private readonly INavClient _navClient;
    private readonly IDashboardMetricsService _dashboardMetrics;
    private readonly ILogger<SyncController> _logger;

    public SyncController(
        INavClient navClient,
        IDashboardMetricsService dashboardMetrics,
        ILogger<SyncController> logger)
    {
        _navClient = navClient;
        _dashboardMetrics = dashboardMetrics;
        _logger = logger;
    }

    /// <summary>
    /// Check if NAV API is configured
    /// </summary>
    [HttpGet("status")]
    public async Task<ActionResult<object>> GetStatus(CancellationToken cancellationToken)
    {
        var configured = await _navClient.IsConfiguredAsync(cancellationToken);
        return Ok(new { configured });
    }

    /// <summary>
    /// Get product sync status
    /// </summary>
    [HttpGet("products")]
    public async Task<ActionResult<ProductSyncStatusDto>> GetProductSyncStatus(CancellationToken cancellationToken)
    {
        var configured = await _navClient.IsConfiguredAsync(cancellationToken);
        if (!configured)
        {
            return BadRequest(new { error = "NAV API is not configured" });
        }

        // Get products from Middleware
        var middlewareProducts = await _dashboardMetrics.GetCreatedProductsAsync(10000, true, cancellationToken);

        // Get products from NAV
        IReadOnlyList<NavProductRecord> navProducts;
        try
        {
            navProducts = await _navClient.GetProductsAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get products from NAV");
            return StatusCode(502, new { error = "Failed to connect to NAV API", details = ex.Message });
        }

        // Create lookup by SKU
        var navBySku = navProducts.ToDictionary(p => p.Sku, StringComparer.OrdinalIgnoreCase);

        var items = new List<ProductSyncItemDto>();
        var needsSync = 0;
        var synced = 0;

        foreach (var product in middlewareProducts)
        {
            navBySku.TryGetValue(product.Sku, out var navProduct);

            var hasMiddlewareId = product.ProductId.HasValue;
            var hasNavId = navProduct?.ActindoId.HasValue == true;
            var requiresSync = hasMiddlewareId && !hasNavId;

            if (requiresSync)
                needsSync++;
            else if (hasMiddlewareId && hasNavId)
                synced++;

            items.Add(new ProductSyncItemDto
            {
                Sku = product.Sku,
                Name = product.Name,
                MiddlewareActindoId = product.ProductId,
                NavNavId = navProduct?.NavId,
                NavActindoId = navProduct?.ActindoId,
                NeedsSync = requiresSync,
                VariantStatus = product.VariantStatus
            });
        }

        return Ok(new ProductSyncStatusDto
        {
            TotalInMiddleware = middlewareProducts.Count,
            TotalInNav = navProducts.Count,
            Synced = synced,
            NeedsSync = needsSync,
            Items = items
        });
    }

    /// <summary>
    /// Get customer sync status
    /// </summary>
    [HttpGet("customers")]
    public async Task<ActionResult<CustomerSyncStatusDto>> GetCustomerSyncStatus(CancellationToken cancellationToken)
    {
        var configured = await _navClient.IsConfiguredAsync(cancellationToken);
        if (!configured)
        {
            return BadRequest(new { error = "NAV API is not configured" });
        }

        // Get customers from Middleware
        var middlewareCustomers = await _dashboardMetrics.GetCreatedCustomersAsync(10000, cancellationToken);

        // Get customers from NAV
        IReadOnlyList<NavCustomerRecord> navCustomers;
        try
        {
            navCustomers = await _navClient.GetCustomersAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get customers from NAV");
            return StatusCode(502, new { error = "Failed to connect to NAV API", details = ex.Message });
        }

        // Create lookup by NAV ID (DebtorNumber)
        var navByDebtorNumber = navCustomers.ToDictionary(
            c => c.NavId.ToString(),
            StringComparer.OrdinalIgnoreCase);

        var items = new List<CustomerSyncItemDto>();
        var needsSync = 0;
        var synced = 0;

        foreach (var customer in middlewareCustomers)
        {
            navByDebtorNumber.TryGetValue(customer.DebtorNumber, out var navCustomer);

            var hasMiddlewareId = customer.CustomerId.HasValue;
            var hasNavId = navCustomer?.ActindoId.HasValue == true;
            var requiresSync = hasMiddlewareId && !hasNavId;

            if (requiresSync)
                needsSync++;
            else if (hasMiddlewareId && hasNavId)
                synced++;

            items.Add(new CustomerSyncItemDto
            {
                DebtorNumber = customer.DebtorNumber,
                Name = customer.Name,
                MiddlewareActindoId = customer.CustomerId,
                NavNavId = navCustomer?.NavId,
                NavActindoId = navCustomer?.ActindoId,
                NeedsSync = requiresSync
            });
        }

        return Ok(new CustomerSyncStatusDto
        {
            TotalInMiddleware = middlewareCustomers.Count,
            TotalInNav = navCustomers.Count,
            Synced = synced,
            NeedsSync = needsSync,
            Items = items
        });
    }

    /// <summary>
    /// Sync selected products to NAV
    /// </summary>
    [HttpPost("products")]
    public async Task<ActionResult> SyncProducts([FromBody] SyncProductsRequest request, CancellationToken cancellationToken)
    {
        if (request.Skus.Count == 0)
        {
            return BadRequest(new { error = "No products specified" });
        }

        var configured = await _navClient.IsConfiguredAsync(cancellationToken);
        if (!configured)
        {
            return BadRequest(new { error = "NAV API is not configured" });
        }

        // Get products from Middleware
        var middlewareProducts = await _dashboardMetrics.GetCreatedProductsAsync(10000, true, cancellationToken);
        var productsBySku = middlewareProducts.ToDictionary(p => p.Sku, StringComparer.OrdinalIgnoreCase);

        // Get products from NAV to get the NAV IDs
        var navProducts = await _navClient.GetProductsAsync(cancellationToken);
        var navBySku = navProducts.ToDictionary(p => p.Sku, StringComparer.OrdinalIgnoreCase);

        var toSync = new List<(int NavId, int ActindoId)>();

        foreach (var sku in request.Skus)
        {
            if (!productsBySku.TryGetValue(sku, out var product) || !product.ProductId.HasValue)
            {
                _logger.LogWarning("Product {Sku} not found in Middleware or has no Actindo ID", sku);
                continue;
            }

            if (!navBySku.TryGetValue(sku, out var navProduct))
            {
                _logger.LogWarning("Product {Sku} not found in NAV", sku);
                continue;
            }

            toSync.Add((navProduct.NavId, product.ProductId.Value));
        }

        if (toSync.Count == 0)
        {
            return BadRequest(new { error = "No valid products to sync" });
        }

        try
        {
            await _navClient.SetProductActindoIdsAsync(toSync, cancellationToken);
            _logger.LogInformation("Synced {Count} products to NAV", toSync.Count);
            return Ok(new { synced = toSync.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to sync products to NAV");
            return StatusCode(502, new { error = "Failed to sync to NAV API", details = ex.Message });
        }
    }

    /// <summary>
    /// Sync a customer to NAV
    /// </summary>
    [HttpPost("customers")]
    public async Task<ActionResult> SyncCustomer([FromBody] SyncCustomerRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.DebtorNumber))
        {
            return BadRequest(new { error = "No customer specified" });
        }

        var configured = await _navClient.IsConfiguredAsync(cancellationToken);
        if (!configured)
        {
            return BadRequest(new { error = "NAV API is not configured" });
        }

        // Get customers from Middleware
        var middlewareCustomers = await _dashboardMetrics.GetCreatedCustomersAsync(10000, cancellationToken);
        var customer = middlewareCustomers.FirstOrDefault(c =>
            string.Equals(c.DebtorNumber, request.DebtorNumber, StringComparison.OrdinalIgnoreCase));

        if (customer == null || !customer.CustomerId.HasValue)
        {
            return BadRequest(new { error = "Customer not found in Middleware or has no Actindo ID" });
        }

        // Get customers from NAV to get the NAV ID
        var navCustomers = await _navClient.GetCustomersAsync(cancellationToken);
        var navCustomer = navCustomers.FirstOrDefault(c =>
            c.NavId.ToString() == request.DebtorNumber);

        if (navCustomer == null)
        {
            return BadRequest(new { error = "Customer not found in NAV" });
        }

        try
        {
            await _navClient.SetCustomerActindoIdAsync(navCustomer.NavId, customer.CustomerId.Value, cancellationToken);
            _logger.LogInformation("Synced customer {DebtorNumber} to NAV", request.DebtorNumber);
            return Ok(new { synced = 1 });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to sync customer to NAV");
            return StatusCode(502, new { error = "Failed to sync to NAV API", details = ex.Message });
        }
    }

    /// <summary>
    /// Sync all products that need syncing to NAV
    /// </summary>
    [HttpPost("products/all")]
    public async Task<ActionResult> SyncAllProducts(CancellationToken cancellationToken)
    {
        var configured = await _navClient.IsConfiguredAsync(cancellationToken);
        if (!configured)
        {
            return BadRequest(new { error = "NAV API is not configured" });
        }

        // Get products from Middleware
        var middlewareProducts = await _dashboardMetrics.GetCreatedProductsAsync(10000, true, cancellationToken);

        // Get products from NAV
        var navProducts = await _navClient.GetProductsAsync(cancellationToken);
        var navBySku = navProducts.ToDictionary(p => p.Sku, StringComparer.OrdinalIgnoreCase);

        var toSync = new List<(int NavId, int ActindoId)>();

        foreach (var product in middlewareProducts)
        {
            if (!product.ProductId.HasValue)
                continue;

            if (!navBySku.TryGetValue(product.Sku, out var navProduct))
                continue;

            // Only sync if NAV doesn't have the Actindo ID yet
            if (navProduct.ActindoId.HasValue)
                continue;

            toSync.Add((navProduct.NavId, product.ProductId.Value));
        }

        if (toSync.Count == 0)
        {
            return Ok(new { synced = 0, message = "No products need syncing" });
        }

        try
        {
            await _navClient.SetProductActindoIdsAsync(toSync, cancellationToken);
            _logger.LogInformation("Synced {Count} products to NAV", toSync.Count);
            return Ok(new { synced = toSync.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to sync products to NAV");
            return StatusCode(502, new { error = "Failed to sync to NAV API", details = ex.Message });
        }
    }

    /// <summary>
    /// Sync all customers that need syncing to NAV
    /// </summary>
    [HttpPost("customers/all")]
    public async Task<ActionResult> SyncAllCustomers(CancellationToken cancellationToken)
    {
        var configured = await _navClient.IsConfiguredAsync(cancellationToken);
        if (!configured)
        {
            return BadRequest(new { error = "NAV API is not configured" });
        }

        // Get customers from Middleware
        var middlewareCustomers = await _dashboardMetrics.GetCreatedCustomersAsync(10000, cancellationToken);

        // Get customers from NAV
        var navCustomers = await _navClient.GetCustomersAsync(cancellationToken);
        var navByDebtorNumber = navCustomers.ToDictionary(c => c.NavId.ToString(), StringComparer.OrdinalIgnoreCase);

        var synced = 0;
        var errors = new List<string>();

        foreach (var customer in middlewareCustomers)
        {
            if (!customer.CustomerId.HasValue)
                continue;

            if (!navByDebtorNumber.TryGetValue(customer.DebtorNumber, out var navCustomer))
                continue;

            // Only sync if NAV doesn't have the Actindo ID yet
            if (navCustomer.ActindoId.HasValue)
                continue;

            try
            {
                await _navClient.SetCustomerActindoIdAsync(navCustomer.NavId, customer.CustomerId.Value, cancellationToken);
                synced++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to sync customer {DebtorNumber}", customer.DebtorNumber);
                errors.Add($"Customer {customer.DebtorNumber}: {ex.Message}");
            }
        }

        if (errors.Count > 0)
        {
            return Ok(new { synced, errors });
        }

        return Ok(new { synced });
    }
}
