namespace ActindoMiddleware.Application.Monitoring;

public static class DashboardJobEndpoints
{
    public const string ProductCreate = "POST /actindo/products/create";
    public const string ProductSave = "POST /actindo/products/save";
    public const string ProductInventory = "POST /actindo/products/inventory";
    public const string ProductPrice = "POST /actindo/products/price";
    public const string CustomerCreate = "POST /actindo/customer/create";
    public const string CustomerSave = "POST /actindo/customer/save";
    public const string TransactionsGet = "POST /actindo/transactions/get";
    public const string ProductImagesUpload = "POST /actindo/products/image";
}
