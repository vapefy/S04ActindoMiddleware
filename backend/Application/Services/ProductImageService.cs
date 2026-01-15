using System.Linq;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.DTOs.Responses;
using ActindoMiddleware.Infrastructure.Actindo;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Services;

public sealed class ProductImageService
{
    private readonly ActindoClient _client;
    private readonly IActindoEndpointProvider _endpoints;
    private readonly ILogger<ProductImageService> _logger;

    public ProductImageService(
        ActindoClient client,
        IActindoEndpointProvider endpoints,
        ILogger<ProductImageService> logger)
    {
        _client = client;
        _endpoints = endpoints;
        _logger = logger;
    }

    public async Task<CreateProductResponse> UploadAsync(
        UploadProductImagesRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.Images);
        ArgumentNullException.ThrowIfNull(request.Paths);

        var endpoints = await _endpoints.GetAsync(cancellationToken);

        foreach (var image in request.Images)
        {
            _logger.LogInformation("Uploading product image {Path}", image.Path);

            await _client.PostAsync(
                endpoints.CreateFile,
                new
                {
                    path = image.Path,
                    type = image.Type,
                    renameOnExistingFile = image.RenameOnExistingFile,
                    createDirectoryStructure = image.CreateDirectoryStructure,
                    content = image.Content
                },
                cancellationToken);

            await Task.Delay(100, cancellationToken);
        }

        _logger.LogInformation("Relating {Count} images to product {ProductId}", request.Paths.Count, request.Id);

        await _client.PostAsync(
            endpoints.ProductFilesSave,
            new
            {
                product = new
                {
                    id = request.Id,
                    _pim_images = new
                    {
                        images = request.Paths.Select(path => new { id = path.Id }).ToArray()
                    }
                }
            },
            cancellationToken);

        return new CreateProductResponse
        {
            Message = "Images created and related to product",
            ProductId = request.Id,
            Success = true
        };
    }
}
