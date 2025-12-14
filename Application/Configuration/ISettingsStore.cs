using System.Threading;
using System.Threading.Tasks;

namespace ActindoMiddleware.Application.Configuration;

public interface ISettingsStore
{
    Task<ActindoSettings> GetActindoSettingsAsync(CancellationToken cancellationToken = default);
    Task SaveActindoSettingsAsync(ActindoSettings settings, CancellationToken cancellationToken = default);
}

