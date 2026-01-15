using System;
using System.Threading;

namespace ActindoMiddleware.Application.Monitoring;

public static class DashboardJobContext
{
    private static readonly AsyncLocal<Guid?> CurrentId = new();

    public static IDisposable Begin(Guid jobId)
    {
        var previous = CurrentId.Value;
        CurrentId.Value = jobId;
        return new Scope(previous);
    }

    public static Guid? CurrentJobId => CurrentId.Value;

    private sealed class Scope : IDisposable
    {
        private readonly Guid? _previous;
        private bool _disposed;

        public Scope(Guid? previous)
        {
            _previous = previous;
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            CurrentId.Value = _previous;
            _disposed = true;
        }
    }
}
