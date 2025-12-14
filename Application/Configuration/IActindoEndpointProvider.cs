using System.Threading;
using System.Threading.Tasks;

namespace ActindoMiddleware.Application.Configuration;

public interface IActindoEndpointProvider
{
    Task<ActindoEndpointSet> GetAsync(CancellationToken cancellationToken = default);
    void Invalidate();
}

