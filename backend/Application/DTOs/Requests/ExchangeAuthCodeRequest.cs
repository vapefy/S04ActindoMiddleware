namespace ActindoMiddleware.DTOs.Requests;

public sealed class ExchangeAuthCodeRequest
{
    public required string Code { get; init; }
    public required string RedirectUri { get; init; }
}
