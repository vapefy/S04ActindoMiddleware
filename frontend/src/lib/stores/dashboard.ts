import { writable } from 'svelte/store';
import type { DashboardSummary, Job, JobsResponse } from '$api/types';
import { dashboard as dashboardApi } from '$api/client';

interface DashboardState {
	summary: DashboardSummary | null;
	loading: boolean;
	error: string | null;
}

export type JobStatusFilter = 'all' | 'success' | 'failed';
export type JobTypeFilter = 'all' | 'product' | 'customer' | 'transaction' | 'media';

interface JobsState {
	jobs: Job[];
	total: number;
	page: number;
	pageSize: number;
	search: string;
	statusFilter: JobStatusFilter;
	typeFilter: JobTypeFilter;
	selectedJobId: string | null;
	loading: boolean;
	error: string | null;
}

const POLL_INTERVAL_MS = 60000; // 1 Minute

function createDashboardStore() {
	const { subscribe, set, update } = writable<DashboardState>({
		summary: null,
		loading: false,
		error: null
	});

	let pollInterval: ReturnType<typeof setInterval> | null = null;

	return {
		subscribe,

		async load() {
			update((s) => ({ ...s, loading: true, error: null }));
			try {
				const summary = await dashboardApi.summary();
				set({ summary, loading: false, error: null });
			} catch (e) {
				update((s) => ({
					...s,
					loading: false,
					error: e instanceof Error ? e.message : 'Fehler beim Laden'
				}));
			}
		},

		startPolling() {
			if (pollInterval) return;

			// Initial load
			this.load();

			// Start polling
			pollInterval = setInterval(() => {
				this.load();
			}, POLL_INTERVAL_MS);
		},

		stopPolling() {
			if (pollInterval) {
				clearInterval(pollInterval);
				pollInterval = null;
			}
		},

		clear() {
			this.stopPolling();
			set({ summary: null, loading: false, error: null });
		}
	};
}

function createJobsStore() {
	const { subscribe, set, update } = writable<JobsState>({
		jobs: [],
		total: 0,
		page: 1,
		pageSize: 20,
		search: '',
		statusFilter: 'all',
		typeFilter: 'all',
		selectedJobId: null,
		loading: false,
		error: null
	});

	let currentState: JobsState;
	subscribe((s) => (currentState = s));

	return {
		subscribe,

		async load() {
			update((s) => ({ ...s, loading: true, error: null }));
			try {
				const response = await dashboardApi.jobs({
					limit: currentState.pageSize,
					page: currentState.page,
					search: currentState.search || undefined,
					onlyFailed: currentState.statusFilter === 'failed' ? true : currentState.statusFilter === 'success' ? false : undefined,
					type: currentState.typeFilter !== 'all' ? currentState.typeFilter : undefined
				});
				update((s) => ({
					...s,
					jobs: response.jobs,
					total: response.total,
					loading: false,
					error: null,
					selectedJobId: s.selectedJobId && response.jobs.some((j) => j.id === s.selectedJobId)
						? s.selectedJobId
						: response.jobs[0]?.id ?? null
				}));
			} catch (e) {
				update((s) => ({
					...s,
					loading: false,
					error: e instanceof Error ? e.message : 'Fehler beim Laden'
				}));
			}
		},

		setPage(page: number) {
			update((s) => ({ ...s, page }));
			this.load();
		},

		setSearch(search: string) {
			update((s) => ({ ...s, search, page: 1 }));
			this.load();
		},

		setStatusFilter(statusFilter: JobStatusFilter) {
			update((s) => ({ ...s, statusFilter, page: 1 }));
			this.load();
		},

		setTypeFilter(typeFilter: JobTypeFilter) {
			update((s) => ({ ...s, typeFilter, page: 1 }));
			this.load();
		},

		selectJob(jobId: string | null) {
			update((s) => ({ ...s, selectedJobId: jobId }));
		},

		async deleteJob(jobId: string) {
			await dashboardApi.deleteJob(jobId);
			update((s) => ({
				...s,
				jobs: s.jobs.filter((j) => j.id !== jobId),
				total: Math.max(0, s.total - 1),
				selectedJobId: s.selectedJobId === jobId ? (s.jobs[0]?.id ?? null) : s.selectedJobId
			}));
		},

		async deleteAllJobs() {
			await dashboardApi.deleteAllJobs();
			update((s) => ({
				...s,
				jobs: [],
				total: 0,
				selectedJobId: null
			}));
		},

		async replayJob(jobId: string, payload?: string) {
			return await dashboardApi.replayJob(jobId, payload);
		}
	};
}

export const dashboardStore = createDashboardStore();
export const jobsStore = createJobsStore();
