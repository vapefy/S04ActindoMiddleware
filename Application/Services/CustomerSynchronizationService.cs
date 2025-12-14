using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.Application.DTOs.Customers;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Services;

public abstract class CustomerSynchronizationService
{
    private readonly ActindoClient _client;
    private readonly IActindoEndpointProvider _endpoints;
    private readonly ILogger _logger;

    protected CustomerSynchronizationService(
        ActindoClient client,
        IActindoEndpointProvider endpoints,
        ILogger logger)
    {
        _client = client;
        _endpoints = endpoints;
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

        var endpoints = await _endpoints.GetAsync(cancellationToken);
        var endpoint = useSaveEndpoint
            ? endpoints.SaveCustomer
            : endpoints.CreateCustomer;

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
            endpoints.SavePrimaryAddress,
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
