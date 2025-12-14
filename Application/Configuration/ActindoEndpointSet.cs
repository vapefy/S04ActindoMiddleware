using ActindoMiddleware.Application;

namespace ActindoMiddleware.Application.Configuration;

public sealed class ActindoEndpointSet
{
    public required string CreateProduct { get; init; }
    public required string SaveProduct { get; init; }
    public required string CreateInventory { get; init; }
    public required string CreateInventoryMovement { get; init; }
    public required string CreateRelation { get; init; }
    public required string CreateCustomer { get; init; }
    public required string SaveCustomer { get; init; }
    public required string SavePrimaryAddress { get; init; }
    public required string GetTransactions { get; init; }
    public required string CreateFile { get; init; }
    public required string ProductFilesSave { get; init; }
    public required string GetProductList { get; init; }

    public static ActindoEndpointSet FromDictionary(IDictionary<string, string> values)
    {
        string Get(string key, string fallback) =>
            values.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value)
                ? value
                : fallback;

        return new ActindoEndpointSet
        {
            CreateProduct = Get("CREATE_PRODUCT", ActindoEndpoints.CREATE_PRODUCT),
            SaveProduct = Get("SAVE_PRODUCT", ActindoEndpoints.SAVE_PRODUCT),
            CreateInventory = Get("CREATE_INVENTORY", ActindoEndpoints.CREATE_INVENTORY),
            CreateInventoryMovement = Get("CREATE_INVENTORY_MOVEMENT", ActindoEndpoints.CREATE_INVENTORY_MOVEMENT),
            CreateRelation = Get("CREATE_RELATION", ActindoEndpoints.CREATE_RELATION),
            CreateCustomer = Get("CREATE_CUSTOMER", ActindoEndpoints.CREATE_CUSTOMER),
            SaveCustomer = Get("SAVE_CUSTOMER", ActindoEndpoints.SAVE_CUSTOMER),
            SavePrimaryAddress = Get("SAVE_PRIMARY_ADDRESS", ActindoEndpoints.SAVE_PRIMARY_ADDRESS),
            GetTransactions = Get("GET_TRANSACTIONS", ActindoEndpoints.GET_TRANSACTIONS),
            CreateFile = Get("CREATE_FILE", ActindoEndpoints.CREATE_FILE),
            ProductFilesSave = Get("PRODUCT_FILES_SAVE", ActindoEndpoints.PRODUCT_FILES_SAVE),
            GetProductList = Get("GET_PRODUCT_LIST", ActindoEndpoints.GET_PRODUCT_LIST)
        };
    }
}
