using System;
using System.Net.Http;
using System.Net.Sockets;
using System.Threading;

namespace ActindoMiddleware.Infrastructure.Actindo;

public sealed class ActindoAvailabilityTracker : IActindoAvailabilityTracker
{
    private readonly object _gate = new();
    private DateTimeOffset? _lastSuccessAt;
    private DateTimeOffset? _lastFailureAt;
    private string _state = "unknown";
    private string _message = string.Empty;

    public void ReportSuccess()
    {
        lock (_gate)
        {
            _lastSuccessAt = DateTimeOffset.UtcNow;
            _state = "ok";
            _message = "Actindo erreichbar";
        }
    }

    public void ReportFailure(Exception exception)
    {
        ArgumentNullException.ThrowIfNull(exception);

        var isConnectivity = IsConnectivityFailure(exception);
        lock (_gate)
        {
            _lastFailureAt = DateTimeOffset.UtcNow;
            _state = isConnectivity ? "error" : "warning";
            _message = isConnectivity ? "Actindo nicht erreichbar" : "Actindo Fehler";
        }
    }

    public ActindoAvailabilitySnapshot GetSnapshot()
    {
        lock (_gate)
        {
            return new ActindoAvailabilitySnapshot
            {
                State = _state,
                Message = _message,
                LastSuccessAt = _lastSuccessAt,
                LastFailureAt = _lastFailureAt
            };
        }
    }

    private static bool IsConnectivityFailure(Exception exception)
    {
        if (exception is HttpRequestException)
            return true;

        if (exception is SocketException)
            return true;

        if (exception.InnerException != null)
            return IsConnectivityFailure(exception.InnerException);

        return false;
    }
}

