using System;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class DeleteProductRequest
{
    public int ProductId { get; set; }
    public Guid JobId { get; set; }
    public string? Sku { get; set; }
}
