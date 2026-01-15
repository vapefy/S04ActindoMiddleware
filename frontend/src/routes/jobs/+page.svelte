<script lang="ts">
	import { onMount } from 'svelte';
	import {
		RefreshCw,
		Search,
		Trash2,
		Play,
		ChevronLeft,
		ChevronRight,
		Activity
	} from 'lucide-svelte';
	import { jobsStore, type JobStatusFilter, type JobTypeFilter } from '$stores/dashboard';
	import { permissions } from '$stores/auth';
	import type { Job } from '$api/types';
	import { formatDate, formatDuration, prettifyJson } from '$utils/format';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Card from '$components/ui/Card.svelte';
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Badge from '$components/ui/Badge.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Spinner from '$components/ui/Spinner.svelte';
	import Modal from '$components/ui/Modal.svelte';
	import CodeBlock from '$components/ui/CodeBlock.svelte';

	let perms = $derived($permissions);
	let jobs = $derived($jobsStore.jobs);
	let total = $derived($jobsStore.total);
	let page = $derived($jobsStore.page);
	let pageSize = $derived($jobsStore.pageSize);
	let selectedJobId = $derived($jobsStore.selectedJobId);
	let statusFilter = $derived($jobsStore.statusFilter);
	let typeFilter = $derived($jobsStore.typeFilter);
	let loading = $derived($jobsStore.loading);
	let error = $derived($jobsStore.error);

	let selectedJob = $derived(jobs.find((j) => j.id === selectedJobId) ?? null);
	let totalPages = $derived(Math.max(1, Math.ceil(total / pageSize)));

	let search = $state('');
	let searchTimeout: ReturnType<typeof setTimeout>;

	const statusOptions: { value: JobStatusFilter; label: string }[] = [
		{ value: 'all', label: 'Alle' },
		{ value: 'success', label: 'Erfolgreich' },
		{ value: 'failed', label: 'Fehlgeschlagen' }
	];

	const typeOptions: { value: JobTypeFilter; label: string }[] = [
		{ value: 'all', label: 'Alle Typen' },
		{ value: 'product', label: 'Produkte' },
		{ value: 'customer', label: 'Kunden' },
		{ value: 'transaction', label: 'Transaktionen' },
		{ value: 'media', label: 'Medien' }
	];

	// Replay modal
	let replayOpen = $state(false);
	let replayPayload = $state('');
	let replayLoading = $state(false);
	let replayError = $state('');

	onMount(() => {
		jobsStore.load();
		const interval = setInterval(() => jobsStore.load(), 15000);
		return () => clearInterval(interval);
	});

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			jobsStore.setSearch(target.value);
		}, 300);
	}

	async function handleDeleteJob(jobId: string) {
		if (!confirm('Diesen Job wirklich loeschen?')) return;
		try {
			await jobsStore.deleteJob(jobId);
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Fehler beim Loeschen');
		}
	}

	async function handleClearAll() {
		if (!confirm('Gesamte Job-Historie wirklich loeschen?')) return;
		try {
			await jobsStore.deleteAllJobs();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Fehler beim Loeschen');
		}
	}

	function openReplayModal() {
		if (!selectedJob) return;
		replayPayload = selectedJob.requestPayload || '{}';
		replayError = '';
		replayOpen = true;
	}

	async function handleReplay() {
		if (!selectedJob) return;

		try {
			JSON.parse(replayPayload);
		} catch {
			replayError = 'Ungueltiges JSON';
			return;
		}

		replayLoading = true;
		replayError = '';

		try {
			await jobsStore.replayJob(selectedJob.id, replayPayload);
			replayOpen = false;
			jobsStore.load();
		} catch (err) {
			replayError = err instanceof Error ? err.message : 'Replay fehlgeschlagen';
		} finally {
			replayLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Jobs | Actindo Middleware</title>
</svelte:head>

<PageHeader title="Job Monitor" subtitle="Uebersicht aller API-Jobs und Fehler">
	{#snippet actions()}
		{#if perms.canWrite}
			<Button variant="danger" onclick={handleClearAll} disabled={jobs.length === 0}>
				<Trash2 size={16} />
				Alle loeschen
			</Button>
		{/if}
		<Button variant="ghost" onclick={() => jobsStore.load()} disabled={loading}>
			<RefreshCw size={16} class={loading ? 'animate-spin' : ''} />
			Aktualisieren
		</Button>
	{/snippet}
</PageHeader>

{#if error}
	<Alert variant="error" class="mb-6">{error}</Alert>
{/if}

<div class="grid lg:grid-cols-2 gap-6">
	<!-- Jobs List -->
	<Card>
		<!-- Search & Filter -->
		<div class="mb-4 space-y-3">
			<div class="relative">
				<Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
				<Input
					type="search"
					placeholder="Suche nach Endpoint..."
					value={search}
					oninput={handleSearch}
					class="pl-11"
				/>
			</div>

			<!-- Filter Dropdowns -->
			<div class="flex flex-wrap gap-2">
				<select
					value={statusFilter}
					onchange={(e) => jobsStore.setStatusFilter(e.currentTarget.value as JobStatusFilter)}
					class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white
						focus:outline-none focus:border-royal-400/60 focus:ring-4 focus:ring-royal-400/10
						cursor-pointer"
				>
					{#each statusOptions as opt}
						<option value={opt.value} class="bg-gray-900">{opt.label}</option>
					{/each}
				</select>

				<select
					value={typeFilter}
					onchange={(e) => jobsStore.setTypeFilter(e.currentTarget.value as JobTypeFilter)}
					class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white
						focus:outline-none focus:border-royal-400/60 focus:ring-4 focus:ring-royal-400/10
						cursor-pointer"
				>
					{#each typeOptions as opt}
						<option value={opt.value} class="bg-gray-900">{opt.label}</option>
					{/each}
				</select>
			</div>
		</div>

		{#if loading && jobs.length === 0}
			<div class="flex justify-center py-12">
				<Spinner />
			</div>
		{:else if jobs.length === 0}
			<div class="text-center py-12 text-gray-400">
				<Activity size={48} class="mx-auto mb-4 opacity-50" />
				<p>Keine Jobs vorhanden</p>
			</div>
		{:else}
			<div class="space-y-2 max-h-[500px] overflow-y-auto">
				{#each jobs as job}
					<button
						type="button"
						class="
							w-full text-left p-4 rounded-xl border transition-all
							{job.id === selectedJobId
								? 'bg-royal-600/20 border-royal-600/50'
								: 'bg-white/5 border-white/10 hover:bg-white/10'}
						"
						onclick={() => jobsStore.selectJob(job.id)}
					>
						<div class="flex items-center justify-between gap-2 mb-2">
							<span class="font-medium truncate">{job.endpoint}</span>
							<Badge variant={job.success ? 'success' : 'error'}>
								{job.success ? 'OK' : 'Fehler'}
							</Badge>
						</div>
						<div class="flex items-center gap-4 text-xs text-gray-400">
							<span>{formatDuration(job.durationMilliseconds)}</span>
							<span>{formatDate(job.startedAt)}</span>
						</div>
					</button>
				{/each}
			</div>

			<!-- Pagination -->
			<div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
				<span class="text-sm text-gray-400">
					Seite {page} / {totalPages}
				</span>
				<div class="flex gap-2">
					<Button
						variant="ghost"
						size="small"
						disabled={page <= 1}
						onclick={() => jobsStore.setPage(page - 1)}
					>
						<ChevronLeft size={16} />
					</Button>
					<Button
						variant="ghost"
						size="small"
						disabled={page >= totalPages}
						onclick={() => jobsStore.setPage(page + 1)}
					>
						<ChevronRight size={16} />
					</Button>
				</div>
			</div>
		{/if}
	</Card>

	<!-- Job Details -->
	<Card>
		{#if selectedJob}
			<div class="flex items-center justify-between mb-4">
				<div>
					<h3 class="text-lg font-semibold">{selectedJob.endpoint}</h3>
					<p class="text-sm text-gray-400">
						{formatDate(selectedJob.startedAt)} - {formatDuration(selectedJob.durationMilliseconds)}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<Badge variant={selectedJob.success ? 'success' : 'error'}>
						{selectedJob.success ? 'Erfolgreich' : 'Fehler'}
					</Badge>
					{#if perms.canWrite}
						<Button variant="ghost" size="small" onclick={openReplayModal}>
							<Play size={14} />
							Replay
						</Button>
						<Button variant="danger" size="small" onclick={() => handleDeleteJob(selectedJob.id)}>
							<Trash2 size={14} />
						</Button>
					{/if}
				</div>
			</div>

			<div class="space-y-4">
				<div>
					<h4 class="text-sm font-medium text-gray-400 mb-2">Request</h4>
					<CodeBlock code={prettifyJson(selectedJob.requestPayload)} maxHeight="200px" />
				</div>

				<div>
					<h4 class="text-sm font-medium text-gray-400 mb-2">Response</h4>
					<CodeBlock
						code={prettifyJson(
							selectedJob.success
								? selectedJob.responsePayload
								: selectedJob.errorPayload ?? selectedJob.responsePayload
						)}
						error={!selectedJob.success}
						maxHeight="200px"
					/>
				</div>

				{#if selectedJob.actindoLogs && selectedJob.actindoLogs.length > 0}
					<div>
						<h4 class="text-sm font-medium text-gray-400 mb-2">
							Actindo Calls ({selectedJob.actindoLogs.length})
						</h4>
						<div class="space-y-3 max-h-[300px] overflow-y-auto">
							{#each selectedJob.actindoLogs as log}
								<div class="p-3 rounded-xl bg-black/20 border border-white/5">
									<div class="flex items-center justify-between mb-2">
										<span class="text-sm font-medium">{log.endpoint}</span>
										<Badge variant={log.success ? 'success' : 'error'}>
											{log.success ? 'OK' : 'Fehler'}
										</Badge>
									</div>
									<div class="grid md:grid-cols-2 gap-2">
										<CodeBlock code={prettifyJson(log.requestPayload)} maxHeight="120px" />
										<CodeBlock
											code={prettifyJson(log.responsePayload)}
											error={!log.success}
											maxHeight="120px"
										/>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center py-12 text-gray-400">
				<Activity size={48} class="mx-auto mb-4 opacity-50" />
				<p>Waehle einen Job aus der Liste</p>
			</div>
		{/if}
	</Card>
</div>

<!-- Replay Modal -->
<Modal bind:open={replayOpen} title="Job Replay">
	<div class="space-y-4">
		<p class="text-sm text-gray-400">
			Bearbeite das Request-Payload und sende den Job erneut.
		</p>

		{#if replayError}
			<Alert variant="error">{replayError}</Alert>
		{/if}

		<textarea
			bind:value={replayPayload}
			class="
				w-full h-64 p-4 rounded-xl
				bg-black/30 border border-white/10
				font-mono text-sm text-white
				resize-none outline-none
				focus:border-royal-400/60 focus:ring-4 focus:ring-royal-400/10
			"
		></textarea>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (replayOpen = false)}>Abbrechen</Button>
		<Button onclick={handleReplay} disabled={replayLoading}>
			{replayLoading ? 'Sende...' : 'Replay senden'}
		</Button>
	{/snippet}
</Modal>
