using System;
using System.Threading;
using System.Threading.Tasks;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Services;

public sealed class ProductCreateService : ProductSynchronizationService
{
    public ProductCreateService(
        ActindoClient client,
        IActindoEndpointProvider endpoints,
        ILogger<ProductCreateService> logger)
        : base(client, endpoints, logger)
    {
    }

    public Task<CreateProductResponse> CreateAsync(
        CreateProductRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.Product);

        return SyncAsync(
            request.Product,
            useSaveEndpoint: false,
            stripVariantSetInformation: false,
            cancellationToken);
    }
}
