using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Services;

public sealed class CustomerSaveService : CustomerSynchronizationService
{
    public CustomerSaveService(
        ActindoClient client,
        IActindoEndpointProvider endpoints,
        ILogger<CustomerSaveService> logger)
        : base(client, endpoints, logger)
    {
    }

    public Task<CreateCustomerResponse> SaveAsync(
        SaveCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.Customer);
        ArgumentNullException.ThrowIfNull(request.PrimaryAddress);

        return SyncAsync(
            request.Customer,
            request.PrimaryAddress,
            useSaveEndpoint: true,
            cancellationToken);
    }
}
