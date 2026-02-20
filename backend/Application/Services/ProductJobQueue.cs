using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ActindoMiddleware.Application.Services;

public enum ProductSyncJobStatus
{
    Queued,
    Running,
    Completed,
    Failed
}

public sealed class ProductJobInfo
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Sku { get; init; } = string.Empty;
    public string Operation { get; init; } = string.Empty; // "create", "save", "full"
    public string? BufferId { get; init; }
    public ProductSyncJobStatus Status { get; set; } = ProductSyncJobStatus.Queued;
    public DateTimeOffset QueuedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public string? Error { get; set; }
}

public sealed class ProductJobQueue
{
    private readonly SemaphoreSlim _semaphore = new(5, 5);
    private readonly ConcurrentDictionary<Guid, ProductJobInfo> _jobs = new();
    private readonly ILogger<ProductJobQueue> _logger;

    public ProductJobQueue(ILogger<ProductJobQueue> logger)
    {
        _logger = logger;
    }

    public Guid Enqueue(string sku, string operation, string? bufferId, Func<CancellationToken, Task> work)
    {
        var info = new ProductJobInfo
        {
            Sku = sku,
            Operation = operation,
            BufferId = bufferId
        };

        _jobs[info.Id] = info;

        _logger.LogInformation(
            "Product sync job queued: {JobId} SKU={Sku} Operation={Operation} BufferId={BufferId}",
            info.Id, sku, operation, bufferId ?? "(none)");

        _ = RunAsync(info, work);

        return info.Id;
    }

    private async Task RunAsync(ProductJobInfo info, Func<CancellationToken, Task> work)
    {
        await _semaphore.WaitAsync();

        info.Status = ProductSyncJobStatus.Running;
        info.StartedAt = DateTimeOffset.UtcNow;

        _logger.LogInformation(
            "Product sync job started: {JobId} SKU={Sku} Operation={Operation}",
            info.Id, info.Sku, info.Operation);

        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(30));
            await work(cts.Token);
            info.Status = ProductSyncJobStatus.Completed;

            _logger.LogInformation(
                "Product sync job completed: {JobId} SKU={Sku}",
                info.Id, info.Sku);
        }
        catch (Exception ex)
        {
            info.Status = ProductSyncJobStatus.Failed;
            info.Error = ex.Message;

            _logger.LogError(ex,
                "Product sync job failed: {JobId} SKU={Sku}",
                info.Id, info.Sku);
        }
        finally
        {
            _semaphore.Release();
            info.CompletedAt = DateTimeOffset.UtcNow;

            // Auto-remove after 5 minutes
            _ = Task.Delay(TimeSpan.FromMinutes(5))
                    .ContinueWith(_ => _jobs.TryRemove(info.Id, out _));
        }
    }

    public IReadOnlyList<ProductJobInfo> GetAll() =>
        _jobs.Values.OrderBy(j => j.QueuedAt).ToList();
}
