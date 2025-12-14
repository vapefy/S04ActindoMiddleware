namespace ActindoMiddleware.Application;

public static class ActindoEndpoints
{
    public const string CREATE_PRODUCT =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.create";

    public const string SAVE_PRODUCT =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.save";

    public const string CREATE_INVENTORY =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.Fulfillment.Inventories.create";

    public const string CREATE_INVENTORY_MOVEMENT =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.Fulfillment.InventoryMovements.create";

    public const string CREATE_RELATION =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.changeVariantMaster";

    public const string CREATE_CUSTOMER =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.CustomersAndSuppliers.Customers.create";

    public const string SAVE_CUSTOMER =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.CustomersAndSuppliers.Customers.save";

    public const string SAVE_PRIMARY_ADDRESS =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.CustomersAndSuppliers.PrimaryAddresses.save";

    public const string GET_TRANSACTIONS =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.RetailSuite.RetailSuiteFaktBase.BusinessDocuments.getList";

    public const string CREATE_FILE =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.ECM.Explorer.create";

    public const string PRODUCT_FILES_SAVE =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.save";

    public const string GET_PRODUCT_LIST =
        "https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.getList";
}
