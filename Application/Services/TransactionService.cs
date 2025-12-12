using System.Linq;
using System.Text.Json;
using ActindoMiddleware.DTOs.Requests;
using ActindoMiddleware.Infrastructure.Actindo;

namespace ActindoMiddleware.Application.Services;

public sealed class TransactionService
{
    private readonly ActindoClient _client;

    public TransactionService(ActindoClient client)
    {
        _client = client;
    }

    public Task<JsonElement> GetTransactionsAsync(
        GetTransactionsRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var formattedDate = request.Date;

        if (DateTime.TryParse(request.Date, out var parsed))
            formattedDate = parsed.ToString("yyyy-MM-dd HH:mm:ss");

        var payload = new
        {
            filter = new object[]
            {
                new
                {
                    property = "documentDate",
                    @operator = ">",
                    value = formattedDate
                },
                new
                {
                    property = "type",
                    @operator = "=",
                    value = "RB"
                },
                new
                {
                    property = "type",
                    @operator = "=",
                    value = "GU"
                }
            },
            serializeOptionals = new[] { "legacyProperties" },
            start = 0,
            limit = 50
        };

        return _client.PostAsync(
            ActindoEndpoints.GET_TRANSACTIONS,
            payload,
            cancellationToken);
    }
}
