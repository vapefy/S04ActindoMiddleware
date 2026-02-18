using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.DTOs;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Services;

public abstract class ProductSynchronizationService
{
    private readonly ActindoClient _client;
    private readonly IActindoEndpointProvider _endpoints;
    private readonly ILogger _logger;
    private readonly SemaphoreSlim _relationLock = new(1, 1);
    private ActindoEndpointSet? _endpointCache;
    private const int MaxConcurrentVariantOperations = 4;
    private const int InventoryWorkerCount = 3;

    private static readonly JsonSerializerOptions LogSerializerOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true
    };

    protected ProductSynchronizationService(
        ActindoClient client,
        IActindoEndpointProvider endpoints,
        ILogger logger)
    {
        _client = client;
        _endpoints = endpoints;
        _logger = logger;
    }

    protected async Task<CreateProductResponse> SyncAsync(
        ProductDto product,
        bool useSaveEndpoint,
        bool stripVariantSetInformation,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(product);

        var endpoints = await ResolveEndpointsAsync(cancellationToken);

        NormalizeProductAdditionalProperties(product);

        if (stripVariantSetInformation)
            StripVariantSetInformation(product);

        foreach (var variant in product.Variants ?? Enumerable.Empty<ProductDto>())
            NormalizeProductAdditionalProperties(variant);

        var productEndpoint = useSaveEndpoint
            ? endpoints.SaveProduct
            : endpoints.CreateProduct;

        _logger.LogInformation(
            "{Operation} product for SKU {Sku}",
            useSaveEndpoint ? "Save" : "Create",
            product.sku);

        // Strip variants/inventory before sending master to Actindo (handled individually)
        var variants = product.Variants;
        var inventory = product.Inventory;
        product.Variants = null;
        product.Inventory = null;
        var masterPayload = new { product };
        LogEndpointPayload(productEndpoint, masterPayload);
        var masterResponse = await _client.PostAsync(productEndpoint, masterPayload, cancellationToken);
        product.Variants = variants;
        product.Inventory = inventory;

        var masterProductId = ReadProductId(masterResponse);

        _logger.LogInformation(
            "Master product synced for SKU {Sku} with ID {Id}",
            product.sku,
            masterProductId);

        foreach (var inventory in product.Inventory ?? Enumerable.Empty<InventoryDto>())
        {
            var inventoryPayload = BuildInventoryPayload(product.sku, inventory);
            LogEndpointPayload(endpoints.CreateInventory, inventoryPayload);
            await _client.PostAsync(endpoints.CreateInventory, inventoryPayload, cancellationToken);
            await Task.Delay(100, cancellationToken);
            _logger.LogInformation(
                "Inventory posted for SKU {Sku} warehouse {Warehouse} compartment {Compartment}",
                product.sku,
                inventory.WarehouseId,
                inventory.CompartmentId);
        }

        var createdVariants = new List<VariantCreationResult>();
        var variantErrors = new List<string>();
        var inventoryErrors = new ConcurrentBag<string>();
        var inventoryChannel = Channel.CreateUnbounded<InventoryWorkItem>(new UnboundedChannelOptions
        {
            SingleReader = false,
            SingleWriter = false
        });

        var inventoryWorkers = Enumerable.Range(0, InventoryWorkerCount)
            .Select(_ => ProcessInventoryQueueAsync(
                inventoryChannel.Reader,
                inventoryErrors,
                cancellationToken))
            .ToArray();

        var variants = product.Variants ?? new List<ProductDto>();
        VariantSyncResult[] results = Array.Empty<VariantSyncResult>();

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
                    inventoryChannel.Writer,
                    cancellationToken))
                .ToArray();

            try
            {
                results = await Task.WhenAll(tasks);
            }
            finally
            {
                inventoryChannel.Writer.TryComplete();
                await Task.WhenAll(inventoryWorkers);
            }

            foreach (var result in results.OrderBy(r => r.Index))
            {
                if (result.Result is not null)
                    createdVariants.Add(result.Result);

                if (!string.IsNullOrEmpty(result.Error))
                    variantErrors.Add(result.Error!);
            }
        }
        else
        {
            inventoryChannel.Writer.TryComplete();
            await Task.WhenAll(inventoryWorkers);
        }

        foreach (var error in inventoryErrors)
        {
            variantErrors.Add(error);
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
        ChannelWriter<InventoryWorkItem> inventoryWriter,
        CancellationToken cancellationToken)
    {
        await semaphore.WaitAsync(cancellationToken);
        try
        {
            var endpoints = await ResolveEndpointsAsync(cancellationToken);
            var isNew = string.IsNullOrWhiteSpace(variant.id);
            var variantEndpoint = isNew ? endpoints.CreateProduct : endpoints.SaveProduct;

            _logger.LogInformation(
                "Start variant sync for SKU {Sku} ({Operation})",
                variant.sku,
                isNew ? "create" : "save");

            if (IsIndiVariant(variant))
            {
                var indiResult = await HandleIndiVariantAsync(
                    masterProduct,
                    variant,
                    masterProductId,
                    variantEndpoint,
                    cancellationToken);
                return new VariantSyncResult(index, indiResult, null);
            }

            var variantPayload = new { product = variant };
            LogEndpointPayload(variantEndpoint, variantPayload);
            var variantResponse = await _client.PostAsync(
                variantEndpoint,
                variantPayload,
                cancellationToken);

            var variantProductId = ReadProductId(variantResponse);

            _logger.LogInformation(
                "Variant synced for SKU {Sku} with ID {Id}",
                variant.sku,
                variantProductId);

            var relationPayload = new
            {
                variantProduct = new { id = variantProductId },
                parentProduct = new { id = masterProductId }
            };
            LogEndpointPayload(endpoints.CreateRelation, relationPayload);
            await _relationLock.WaitAsync(cancellationToken);
            try
            {
                await _client.PostAsync(
                    endpoints.CreateRelation,
                    relationPayload,
                    cancellationToken);
                _logger.LogInformation(
                    "Variant {Sku} linked to master {MasterId}",
                    variant.sku,
                    masterProductId);
            }
            finally
            {
                _relationLock.Release();
            }

            foreach (var inventory in variant.Inventory ?? Enumerable.Empty<InventoryDto>())
            {
                await inventoryWriter.WriteAsync(
                    new InventoryWorkItem(variant.sku, inventory),
                    cancellationToken);
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

    private async Task<ActindoEndpointSet> ResolveEndpointsAsync(CancellationToken cancellationToken) =>
        _endpointCache ??= await _endpoints.GetAsync(cancellationToken);

    private static int ReadProductId(System.Text.Json.JsonElement responseRoot)
    {
        static int? TryExtractId(System.Text.Json.JsonElement element, string propertyName)
        {
            if (!element.TryGetProperty(propertyName, out var prop))
                return null;

            if (prop.ValueKind == System.Text.Json.JsonValueKind.Number && prop.TryGetInt32(out var number))
                return number;

            if (prop.ValueKind == System.Text.Json.JsonValueKind.String &&
                int.TryParse(prop.GetString(), out var parsed))
            {
                return parsed;
            }

            return null;
        }

        if (responseRoot.TryGetProperty("product", out var product))
        {
            var id = TryExtractId(product, "id") ?? TryExtractId(product, "entityId");
            if (id.HasValue)
                return id.Value;
        }

        var rootId = TryExtractId(responseRoot, "productId");
        if (rootId.HasValue)
            return rootId.Value;

        var message = responseRoot.TryGetProperty("displayMessage", out var msg) ? msg.GetString() : null;
        throw new InvalidOperationException(
            string.IsNullOrWhiteSpace(message)
                ? "Actindo hat keine Produkt-ID zurueckgegeben."
                : $"Actindo hat keine Produkt-ID zurueckgegeben: {message}");
    }

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

        if (!string.IsNullOrWhiteSpace(variant.id))
            payload["id"] = variant.id;

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
        int masterProductId,
        string productEndpoint,
        CancellationToken cancellationToken)
    {
        var masterSku = $"{masterProduct.sku}-INDI";
        var indiMasterPayload = new { product = BuildIndiMasterPayload(masterProduct, variant, masterSku) };
        var endpoints = await ResolveEndpointsAsync(cancellationToken);
        LogEndpointPayload(productEndpoint, indiMasterPayload);
        var indiMasterResponse = await _client.PostAsync(
            productEndpoint,
            indiMasterPayload,
            cancellationToken);

        var indiMasterId = ReadProductId(indiMasterResponse);

        _logger.LogInformation(
            "INDI product synced for SKU {Sku} with ID {Id} (no relation to master)",
            masterSku,
            indiMasterId);

        return new VariantCreationResult(masterSku, indiMasterId);
    }

    private async Task ProcessInventoryQueueAsync(
        ChannelReader<InventoryWorkItem> reader,
        ConcurrentBag<string> errors,
        CancellationToken cancellationToken)
    {
        var endpoints = await ResolveEndpointsAsync(cancellationToken);

        await foreach (var workItem in reader.ReadAllAsync(cancellationToken))
        {
            try
            {
                var payload = BuildInventoryPayload(workItem.Sku, workItem.Inventory);
                LogEndpointPayload(endpoints.CreateInventory, payload);
                await _client.PostAsync(
                    endpoints.CreateInventory,
                    payload,
                    cancellationToken);
                await Task.Delay(100, cancellationToken);

                _logger.LogInformation(
                    "Inventory posted for SKU {Sku} warehouse {Warehouse} compartment {Compartment}",
                    workItem.Sku,
                    workItem.Inventory.WarehouseId,
                    workItem.Inventory.CompartmentId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Inventory sync failed for SKU {Sku}", workItem.Sku);
                errors.Add($"{workItem.Sku}: {ex.Message}");
            }
        }
    }

    private sealed record VariantSyncResult(int Index, VariantCreationResult? Result, string? Error);
    private sealed record InventoryWorkItem(string Sku, InventoryDto Inventory);
}
