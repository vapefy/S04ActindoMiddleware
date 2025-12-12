namespace ActindoMiddleware.DTOs.Responses;

public sealed class CreateCustomerResponse
{
    public string Message { get; init; } = "Customer created";
    public int CustomerId { get; init; }
    public int PrimaryAddressId { get; init; }
    public bool Success { get; init; } = true;
}
