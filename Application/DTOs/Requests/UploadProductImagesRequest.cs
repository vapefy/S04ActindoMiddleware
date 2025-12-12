using System.Collections.Generic;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class UploadProductImagesRequest
{
    public required int Id { get; init; }
    public required List<ProductImageDto> Images { get; init; }
    public required List<ProductImagePathDto> Paths { get; init; }
}

public sealed class ProductImageDto
{
    public required string Path { get; init; }
    public required string Type { get; init; }
    public required string Content { get; init; }
    public bool RenameOnExistingFile { get; init; } = false;
    public bool CreateDirectoryStructure { get; init; } = true;
}

public sealed class ProductImagePathDto
{
    public required string Id { get; init; }
}
