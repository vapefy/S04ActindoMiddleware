using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.DTOs;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Services;

public abstract class ProductSynchronizationService
{
    private readonly ActindoClient _client;
    private readonly ILogger _logger;
    private const int MaxConcurrentVariantOperations = 4;

    private static readonly JsonSerializerOptions LogSerializerOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true
    };

    protected ProductSynchronizationService(
        ActindoClient client,
        ILogger logger)
    {
        _client = client;
        _logger = logger;
    }

    protected async Task<CreateProductResponse> SyncAsync(
        ProductDto product,
        bool useSaveEndpoint,
        bool stripVariantSetInformation,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(product);

        NormalizeProductAdditionalProperties(product);

        if (stripVariantSetInformation)
            StripVariantSetInformation(product);

        foreach (var variant in product.Variants ?? Enumerable.Empty<ProductDto>())
            NormalizeProductAdditionalProperties(variant);

        var productEndpoint = useSaveEndpoint
            ? ActindoEndpoints.SAVE_PRODUCT
            : ActindoEndpoints.CREATE_PRODUCT;

        _logger.LogInformation(
            "{Operation} product for SKU {Sku}",
            useSaveEndpoint ? "Save" : "Create",
            product.sku);

        var masterPayload = new { product };
        LogEndpointPayload(productEndpoint, masterPayload);
        var masterResponse = await _client.PostAsync(productEndpoint, masterPayload, cancellationToken);

        var masterProductId = masterResponse
            .GetProperty("product")
            .GetProperty("id")
            .GetInt32();

        _logger.LogInformation(
            "Master product synced for SKU {Sku} with ID {Id}",
            product.sku,
            masterProductId);

        foreach (var inventory in product.Inventory ?? Enumerable.Empty<InventoryDto>())
        {
            var inventoryPayload = BuildInventoryPayload(product.sku, inventory);
            LogEndpointPayload(ActindoEndpoints.CREATE_INVENTORY, inventoryPayload);
            await _client.PostAsync(ActindoEndpoints.CREATE_INVENTORY, inventoryPayload, cancellationToken);
            await Task.Delay(100, cancellationToken);
            _logger.LogInformation(
                "Inventory posted for SKU {Sku} warehouse {Warehouse} compartment {Compartment}",
                product.sku,
                inventory.WarehouseId,
                inventory.CompartmentId);
        }

        var createdVariants = new List<VariantCreationResult>();
        var variantErrors = new List<string>();

        var variants = product.Variants ?? new List<ProductDto>();
        if (variants.Count > 0)
        {
            using var semaphore = new SemaphoreSlim(MaxConcurrentVariantOperations);
            var tasks = variants
                .Select((variant, index) => SyncVariantAsync(
                    product,
                    variant,
                    index,
                    masterProductId,
                    productEndpoint,
                    semaphore,
                    cancellationToken))
                .ToArray();

            var results = await Task.WhenAll(tasks);

            foreach (var result in results.OrderBy(r => r.Index))
            {
                if (result.Result is not null)
                    createdVariants.Add(result.Result);

                if (!string.IsNullOrEmpty(result.Error))
                    variantErrors.Add(result.Error!);
            }
        }

        return new CreateProductResponse
        {
            Message = useSaveEndpoint ? "Product saved" : "Product created",
            ProductId = masterProductId,
            Variants = createdVariants,
            VariantErrors = variantErrors,
            Success = variantErrors.Count == 0
        };
    }

    private async Task<VariantSyncResult> SyncVariantAsync(
        ProductDto masterProduct,
        ProductDto variant,
        int index,
        int masterProductId,
        string productEndpoint,
        SemaphoreSlim semaphore,
        CancellationToken cancellationToken)
    {
        await semaphore.WaitAsync(cancellationToken);
        try
        {
            _logger.LogInformation("Start variant sync for SKU {Sku}", variant.sku);

            if (IsIndiVariant(variant))
            {
                var indiResult = await HandleIndiVariantAsync(
                    masterProduct,
                    variant,
                    cancellationToken);
                return new VariantSyncResult(index, indiResult, null);
            }

            var variantPayload = new { product = variant };
            LogEndpointPayload(productEndpoint, variantPayload);
            var variantResponse = await _client.PostAsync(
                productEndpoint,
                variantPayload,
                cancellationToken);

            var variantProductId = variantResponse
                .GetProperty("product")
                .GetProperty("id")
                .GetInt32();

            _logger.LogInformation(
                "Variant synced for SKU {Sku} with ID {Id}",
                variant.sku,
                variantProductId);

            var relationPayload = new
            {
                variantProduct = new { id = variantProductId },
                parentProduct = new { id = masterProductId }
            };
            LogEndpointPayload(ActindoEndpoints.CREATE_RELATION, relationPayload);
            await _client.PostAsync(
                ActindoEndpoints.CREATE_RELATION,
                relationPayload,
                cancellationToken);

            foreach (var inventory in variant.Inventory ?? Enumerable.Empty<InventoryDto>())
            {
                var variantInventoryPayload = BuildInventoryPayload(variant.sku, inventory);
                LogEndpointPayload(ActindoEndpoints.CREATE_INVENTORY, variantInventoryPayload);
                await _client.PostAsync(
                    ActindoEndpoints.CREATE_INVENTORY,
                    variantInventoryPayload,
                    cancellationToken);
                await Task.Delay(100, cancellationToken);

                _logger.LogInformation(
                    "Inventory posted for SKU {Sku} warehouse {Warehouse} compartment {Compartment}",
                    variant.sku,
                    inventory.WarehouseId,
                    inventory.CompartmentId);
            }

            return new VariantSyncResult(
                index,
                new VariantCreationResult(variant.sku, variantProductId),
                null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Variant sync failed for SKU {Sku}", variant.sku);
            return new VariantSyncResult(index, null, $"{variant.sku}: {ex.Message}");
        }
        finally
        {
            semaphore.Release();
        }
    }

    private static object BuildInventoryPayload(string sku, InventoryDto inventory)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sku);
        ArgumentNullException.ThrowIfNull(inventory);

        return new
        {
            inventory = new
            {
                sku,
                synchronousSync = true,
                compareOldValue = true,
                _fulfillment_inventory_amount = inventory.Stock,
                _fulfillment_inventory_warehouse = inventory.WarehouseId,
                _fulfillment_inventory_compartment = inventory.CompartmentId,
                _fulfillment_inventory_postingType = new[] { new { id = 571 } },
                _fulfillment_inventory_postingText = "Initiale Bestandseinbuchung",
                _fulfillment_inventory_origin = "Middleware import"
            }
        };
    }

    private void LogEndpointPayload(string endpoint, object payload)
    {
        var json = JsonSerializer.Serialize(payload, LogSerializerOptions);
        _logger.LogInformation("Payload for {Endpoint}:{NewLine}{Payload}", endpoint, Environment.NewLine, json);
    }

    private static readonly (string Source, string Target)[] AdditionalPropertyMappings =
    {
        ("pim_ean", "_pim_ean"),
        ("_pim_products_keywordsactindo_basicde_DE", "_pim_products_keywords__actindo_basic__de_DE"),
        ("_pim_products_keywordsactindo_basic_de_DE", "_pim_products_keywords__actindo_basic__de_DE"),
        ("_pim_products_keywordsactindo_basicen_US", "_pim_products_keywords__actindo_basic__en_US"),
        ("_pim_products_keywordsactindo_basic_en_US", "_pim_products_keywords__actindo_basic__en_US"),
        ("_pim_art_nameactindo_basicde_DE", "_pim_art_name__actindo_basic__de_DE"),
        ("_pim_art_nameactindo_basic_de_DE", "_pim_art_name__actindo_basic__de_DE"),
        ("_pim_art_nameactindo_basicen_US", "_pim_art_name__actindo_basic__en_US"),
        ("_pim_art_nameactindo_basic_en_US", "_pim_art_name__actindo_basic__en_US"),
        ("_pim_products_meta_titleactindo_basicde_DE", "_pim_products_meta_title__actindo_basic__de_DE"),
        ("_pim_products_meta_titleactindo_basic_de_DE", "_pim_products_meta_title__actindo_basic__de_DE"),
        ("_pim_products_meta_titleactindo_basicen_US", "_pim_products_meta_title__actindo_basic__en_US"),
        ("_pim_products_meta_titleactindo_basic_en_US", "_pim_products_meta_title__actindo_basic__en_US"),
        ("_pim_products_meta_descriptionactindo_basicde_DE", "_pim_products_meta_description__actindo_basic__de_DE"),
        ("_pim_products_meta_descriptionactindo_basic_de_DE", "_pim_products_meta_description__actindo_basic__de_DE"),
        ("_pim_products_meta_descriptionactindo_basicen_US", "_pim_products_meta_description__actindo_basic__en_US"),
        ("_pim_products_meta_descriptionactindo_basic_en_US", "_pim_products_meta_description__actindo_basic__en_US"),
        ("_pim_baseprice", "_pim_baseprice")
    };

    private static void NormalizeProductAdditionalProperties(ProductDto product)
    {
        if (product.AdditionalProperties is null)
            return;

        foreach (var (source, target) in AdditionalPropertyMappings)
        {
            if (product.AdditionalProperties.Remove(source, out var value))
            {
                product.AdditionalProperties[target] = value;
            }
        }
    }

    private static void StripVariantSetInformation(ProductDto product)
    {
        product._pim_variants = null;
        product.AdditionalProperties?.Remove("_pim_variants");
    }

    private static bool IsIndiVariant(ProductDto variant) =>
        !string.IsNullOrWhiteSpace(variant._pim_varcode) &&
        variant._pim_varcode.Contains("INDI", StringComparison.OrdinalIgnoreCase);

    private static object BuildIndiMasterPayload(
        ProductDto masterProduct,
        ProductDto variant,
        string masterSku)
    {
        ArgumentNullException.ThrowIfNull(masterProduct);
        ArgumentNullException.ThrowIfNull(variant);
        ArgumentException.ThrowIfNullOrWhiteSpace(masterSku);

        const string name = "INDI-Dein Wunschname";

        var payload = new Dictionary<string, object?>
        {
            ["sku"] = masterSku,
            ["attributeSetId"] = variant.attributeSetId,
            ["_pim_art_name__actindo_basic__de_DE"] = name,
            ["_pim_art_name__actindo_basic__en_US"] = name
        };

        if (variant._pim_price is not null)
            payload["_pim_price"] = variant._pim_price;

        if (variant._pim_price_member is not null)
            payload["_pim_price_member"] = variant._pim_price_member;

        if (variant._pim_price_employee is not null)
            payload["_pim_price_employee"] = variant._pim_price_employee;

        return payload;
    }

    private async Task<VariantCreationResult> HandleIndiVariantAsync(
        ProductDto masterProduct,
        ProductDto variant,
        CancellationToken cancellationToken)
    {
        var masterSku = $"{masterProduct.sku}-INDI";
        var indiMasterPayload = new { product = BuildIndiMasterPayload(masterProduct, variant, masterSku) };
        LogEndpointPayload(ActindoEndpoints.CREATE_PRODUCT, indiMasterPayload);
        var indiMasterResponse = await _client.PostAsync(
            ActindoEndpoints.CREATE_PRODUCT,
            indiMasterPayload,
            cancellationToken);

        var indiMasterId = indiMasterResponse
            .GetProperty("product")
            .GetProperty("id")
            .GetInt32();

        _logger.LogInformation(
            "INDI master product created for SKU {Sku} with ID {Id}",
            masterSku,
            indiMasterId);

        return new VariantCreationResult(masterSku, indiMasterId);
    }

    private sealed record VariantSyncResult(int Index, VariantCreationResult? Result, string? Error);
}
