using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Application.DTOs.Customers;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Services;

public abstract class CustomerSynchronizationService
{
    private readonly ActindoClient _client;
    private readonly ILogger _logger;

    protected CustomerSynchronizationService(
        ActindoClient client,
        ILogger logger)
    {
        _client = client;
        _logger = logger;
    }

    protected async Task<CreateCustomerResponse> SyncAsync(
        CustomerDto customer,
        PrimaryAddressDto primaryAddress,
        bool useSaveEndpoint,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(customer);
        ArgumentNullException.ThrowIfNull(primaryAddress);

        var endpoint = useSaveEndpoint
            ? ActindoEndpoints.SAVE_CUSTOMER
            : ActindoEndpoints.CREATE_CUSTOMER;

        _logger.LogInformation(
            "{Action} Actindo customer {ShortName}",
            useSaveEndpoint ? "Saving" : "Creating",
            customer.shortName);

        var customerResponse = await _client.PostAsync(
            endpoint,
            new { customer },
            cancellationToken);

        var customerId = customerResponse
            .GetProperty("data")
            .GetProperty("id")
            .GetInt32();

        _logger.LogInformation(
            "Customer {CustomerId} synced (endpoint: {Endpoint})",
            customerId,
            endpoint);

        primaryAddress.id = customerId;

        var primaryResponse = await _client.PostAsync(
            ActindoEndpoints.SAVE_PRIMARY_ADDRESS,
            new { primaryAddress },
            cancellationToken);

        var primaryAddressId = primaryResponse
            .GetProperty("data")
            .GetProperty("id")
            .GetInt32();

        _logger.LogInformation(
            "Primary address {PrimaryAddressId} saved for customer {CustomerId}",
            primaryAddressId,
            customerId);

        return new CreateCustomerResponse
        {
            Message = useSaveEndpoint ? "Customer saved" : "Customer created",
            CustomerId = customerId,
            PrimaryAddressId = primaryAddressId,
            Success = true
        };
    }
}
