using ActindoMiddleware.Application.DTOs.Customers;

namespace ActindoMiddleware.DTOs.Requests;

public sealed class SaveCustomerRequest
{
    public required CustomerDto Customer { get; init; }
    public required PrimaryAddressDto PrimaryAddress { get; init; }
}
