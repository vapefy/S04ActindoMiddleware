using ActindoMiddleware.Application.DTOs.Customers;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class CreateCustomerRequest
{
    public required CustomerDto Customer { get; init; }
    public required PrimaryAddressDto PrimaryAddress { get; init; }
}
