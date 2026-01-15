using System;

namespace ActindoMiddleware.Infrastructure.Actindo;

public interface IActindoAvailabilityTracker
{
    void ReportSuccess();
    void ReportFailure(Exception exception);
    ActindoAvailabilitySnapshot GetSnapshot();
}

