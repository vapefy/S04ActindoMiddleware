using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Application.Services;
using ActindoMiddleware.DTOs.Requests;

namespace ActindoMiddleware.Application.Monitoring;

public interface IJobReplayService
{
    Task<object> ReplayAsync(string endpoint, string payload, CancellationToken cancellationToken = default);
}

public sealed class JobReplayService : IJobReplayService
{
    private readonly ProductCreateService _productCreateService;
    private readonly ProductSaveService _productSaveService;
    private readonly CustomerCreateService _customerCreateService;
    private readonly CustomerSaveService _customerSaveService;
    private readonly TransactionService _transactionService;
    private readonly ProductImageService _productImageService;

    public JobReplayService(
        ProductCreateService productCreateService,
        ProductSaveService productSaveService,
        CustomerCreateService customerCreateService,
        CustomerSaveService customerSaveService,
        TransactionService transactionService,
        ProductImageService productImageService)
    {
        _productCreateService = productCreateService;
        _productSaveService = productSaveService;
        _customerCreateService = customerCreateService;
        _customerSaveService = customerSaveService;
        _transactionService = transactionService;
        _productImageService = productImageService;
    }

    public async Task<object> ReplayAsync(string endpoint, string payload, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(payload);

        return endpoint switch
        {
            DashboardJobEndpoints.ProductCreate => await ReplayProductCreateAsync(payload, cancellationToken),
            DashboardJobEndpoints.ProductSave => await ReplayProductSaveAsync(payload, cancellationToken),
            DashboardJobEndpoints.CustomerCreate => await ReplayCustomerCreateAsync(payload, cancellationToken),
            DashboardJobEndpoints.CustomerSave => await ReplayCustomerSaveAsync(payload, cancellationToken),
            DashboardJobEndpoints.TransactionsGet => await ReplayTransactionsAsync(payload, cancellationToken),
            DashboardJobEndpoints.ProductImagesUpload => await ReplayProductImagesAsync(payload, cancellationToken),

            _ => throw new InvalidOperationException(
                $"Endpoint '{endpoint}' wird fuer Replays nicht unterstuetzt.")
        };
    }

    private async Task<object> ReplayProductCreateAsync(string payload, CancellationToken cancellationToken)
    {
        var request = Deserialize<CreateProductRequest>(payload);
        return await _productCreateService.CreateAsync(request, cancellationToken);
    }

    private async Task<object> ReplayProductSaveAsync(string payload, CancellationToken cancellationToken)
    {
        var request = Deserialize<SaveProductRequest>(payload);
        return await _productSaveService.SaveAsync(request, cancellationToken);
    }

    private async Task<object> ReplayCustomerCreateAsync(string payload, CancellationToken cancellationToken)
    {
        var request = Deserialize<CreateCustomerRequest>(payload);
        return await _customerCreateService.CreateAsync(request, cancellationToken);
    }

    private async Task<object> ReplayCustomerSaveAsync(string payload, CancellationToken cancellationToken)
    {
        var request = Deserialize<SaveCustomerRequest>(payload);
        return await _customerSaveService.SaveAsync(request, cancellationToken);
    }

    private async Task<object> ReplayTransactionsAsync(string payload, CancellationToken cancellationToken)
    {
        var request = Deserialize<GetTransactionsRequest>(payload);
        return await _transactionService.GetTransactionsAsync(request, cancellationToken);
    }

    private async Task<object> ReplayProductImagesAsync(string payload, CancellationToken cancellationToken)
    {
        var request = Deserialize<UploadProductImagesRequest>(payload);
        return await _productImageService.UploadAsync(request, cancellationToken);
    }

    private static T Deserialize<T>(string payload)
    {
        var result = JsonSerializer.Deserialize<T>(payload, DashboardPayloadSerializer.Options);
        return result ?? throw new InvalidOperationException("Payload konnte nicht gelesen werden.");
    }
}
