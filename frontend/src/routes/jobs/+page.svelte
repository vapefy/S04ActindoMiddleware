<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Loader2,
		Clock,
		CheckCircle2,
		XCircle,
		Zap,
		RefreshCw,
		PackageSearch
	} from 'lucide-svelte';
	import type { ProductJobInfo } from '$api/types';
	import { products as productsApi } from '$api/client';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Card from '$components/ui/Card.svelte';
	import Button from '$components/ui/Button.svelte';

	let activeJobs = $state<ProductJobInfo[]>([]);
	let loading = $state(true);
	let now = $state(Date.now());

	let runningCount = $derived(activeJobs.filter((j) => j.status === 'running').length);
	let queuedCount = $derived(activeJobs.filter((j) => j.status === 'queued').length);
	let completedCount = $derived(activeJobs.filter((j) => j.status === 'completed').length);
	let failedCount = $derived(activeJobs.filter((j) => j.status === 'failed').length);

	async function load() {
		try {
			activeJobs = await productsApi.activeJobs();
		} catch {
			// ignore
		} finally {
			loading = false;
		}
	}

	function elapsedSeconds(from: string | null, to: string | null): string {
		if (!from) return '—';
		const start = new Date(from).getTime();
		const end = to ? new Date(to).getTime() : now;
		const secs = Math.max(0, Math.floor((end - start) / 1000));
		if (secs < 60) return `${secs}s`;
		const m = Math.floor(secs / 60);
		const s = secs % 60;
		return `${m}m ${s}s`;
	}

	function operationLabel(op: string): string {
		if (op === 'create') return 'Anlegen';
		if (op === 'save') return 'Speichern';
		if (op === 'full') return 'Full Sync';
		return op;
	}

	onMount(() => {
		load();
		const pollInterval = setInterval(() => load(), 3000);
		const clockInterval = setInterval(() => (now = Date.now()), 1000);
		return () => {
			clearInterval(pollInterval);
			clearInterval(clockInterval);
		};
	});
</script>

<svelte:head>
	<title>Jobs | Actindo Middleware</title>
</svelte:head>

<PageHeader title="Jobs" subtitle="Aktive und wartende Produkt-Sync-Jobs">
	{#snippet actions()}
		<div class="flex items-center gap-3">
			{#if runningCount > 0 || queuedCount > 0}
				<div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-royal-600/20 border border-royal-500/30">
					<Loader2 size={14} class="animate-spin text-royal-400" />
					<span class="text-xs text-royal-300 font-medium">Live · alle 3s</span>
				</div>
			{/if}
			<Button variant="ghost" onclick={load} disabled={loading}>
				<RefreshCw size={16} class={loading ? 'animate-spin' : ''} />
				Aktualisieren
			</Button>
		</div>
	{/snippet}
</PageHeader>

<!-- Summary Cards -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
	<div class="rounded-xl border bg-royal-600/10 border-royal-500/30 p-4">
		<div class="flex items-center gap-2 mb-1">
			<Loader2 size={16} class="text-royal-400 {runningCount > 0 ? 'animate-spin' : ''}" />
			<span class="text-xs text-gray-400 uppercase tracking-wide">Läuft</span>
		</div>
		<p class="text-2xl font-bold text-royal-300">{runningCount}</p>
	</div>
	<div class="rounded-xl border bg-white/5 border-white/10 p-4">
		<div class="flex items-center gap-2 mb-1">
			<Clock size={16} class="text-gray-400" />
			<span class="text-xs text-gray-400 uppercase tracking-wide">Wartend</span>
		</div>
		<p class="text-2xl font-bold text-gray-300">{queuedCount}</p>
	</div>
	<div class="rounded-xl border bg-green-900/10 border-green-500/20 p-4">
		<div class="flex items-center gap-2 mb-1">
			<CheckCircle2 size={16} class="text-green-400" />
			<span class="text-xs text-gray-400 uppercase tracking-wide">Fertig</span>
		</div>
		<p class="text-2xl font-bold text-green-300">{completedCount}</p>
	</div>
	<div class="rounded-xl border bg-red-900/10 border-red-500/20 p-4">
		<div class="flex items-center gap-2 mb-1">
			<XCircle size={16} class="text-red-400" />
			<span class="text-xs text-gray-400 uppercase tracking-wide">Fehler</span>
		</div>
		<p class="text-2xl font-bold text-red-300">{failedCount}</p>
	</div>
</div>

<!-- Jobs Table -->
<Card>
	{#if loading && activeJobs.length === 0}
		<div class="flex justify-center py-16">
			<Loader2 size={32} class="animate-spin text-royal-400" />
		</div>
	{:else if activeJobs.length === 0}
		<div class="text-center py-16 text-gray-400">
			<PackageSearch size={48} class="mx-auto mb-4 opacity-40" />
			<p class="font-medium mb-1">Keine aktiven Jobs</p>
			<p class="text-sm text-gray-500">Jobs erscheinen hier sobald ein Produkt-Sync mit await=false gestartet wird</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-white/10 text-left">
						<th class="pb-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
						<th class="pb-3 pr-4 font-medium text-gray-400 whitespace-nowrap">SKU</th>
						<th class="pb-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Operation</th>
						<th class="pb-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Queue-Zeit</th>
						<th class="pb-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Laufzeit</th>
						<th class="pb-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Buffer ID</th>
						<th class="pb-3 font-medium text-gray-400">Fehler</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5">
					{#each activeJobs as job (job.id)}
						<tr
							class="transition-colors
								{job.status === 'running'
								? 'bg-royal-600/5'
								: job.status === 'failed'
									? 'bg-red-900/5'
									: ''}"
						>
							<!-- Status -->
							<td class="py-3 pr-4">
								<div class="flex items-center gap-2 whitespace-nowrap">
									{#if job.status === 'running'}
										<Loader2 size={15} class="animate-spin text-royal-400 shrink-0" />
										<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-royal-600/30 text-royal-300">
											Läuft
										</span>
									{:else if job.status === 'queued'}
										<Clock size={15} class="text-gray-400 shrink-0" />
										<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
											Wartet
										</span>
									{:else if job.status === 'completed'}
										<CheckCircle2 size={15} class="text-green-400 shrink-0" />
										<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-green-900/40 text-green-300">
											Fertig
										</span>
									{:else}
										<XCircle size={15} class="text-red-400 shrink-0" />
										<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-red-900/40 text-red-300">
											Fehler
										</span>
									{/if}
								</div>
							</td>

							<!-- SKU -->
							<td class="py-3 pr-4">
								<span class="font-mono font-medium text-white">{job.sku}</span>
							</td>

							<!-- Operation -->
							<td class="py-3 pr-4">
								<div class="flex items-center gap-1.5">
									<Zap size={13} class="text-royal-400 shrink-0" />
									<span class="text-gray-300">{operationLabel(job.operation)}</span>
								</div>
							</td>

							<!-- Queue-Zeit -->
							<td class="py-3 pr-4 text-gray-400 tabular-nums whitespace-nowrap">
								{#if job.startedAt}
									{elapsedSeconds(job.queuedAt, job.startedAt)}
								{:else}
									<span class="text-royal-400">{elapsedSeconds(job.queuedAt, null)}</span>
								{/if}
							</td>

							<!-- Laufzeit -->
							<td class="py-3 pr-4 tabular-nums whitespace-nowrap">
								{#if job.status === 'running'}
									<span class="text-royal-300">{elapsedSeconds(job.startedAt, null)}</span>
								{:else if job.startedAt}
									<span class="text-gray-400">{elapsedSeconds(job.startedAt, job.completedAt)}</span>
								{:else}
									<span class="text-gray-600">—</span>
								{/if}
							</td>

							<!-- Buffer ID -->
							<td class="py-3 pr-4">
								{#if job.bufferId}
									<span class="font-mono text-xs text-gray-400 max-w-[120px] truncate block" title={job.bufferId}>
										{job.bufferId}
									</span>
								{:else}
									<span class="text-gray-600">—</span>
								{/if}
							</td>

							<!-- Fehler -->
							<td class="py-3">
								{#if job.error}
									<span class="text-xs text-red-400 max-w-[200px] truncate block" title={job.error}>
										{job.error}
									</span>
								{:else}
									<span class="text-gray-600">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="text-xs text-gray-600 mt-4">
			Abgeschlossene Jobs werden nach 5 Minuten automatisch entfernt.
		</p>
	{/if}
</Card>
