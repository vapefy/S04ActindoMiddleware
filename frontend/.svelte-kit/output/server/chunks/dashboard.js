import { w as writable } from "./index.js";
import { d as dashboard } from "./client2.js";
const POLL_INTERVAL_MS = 6e4;
function createDashboardStore() {
  const { subscribe, set, update } = writable({
    summary: null,
    loading: false,
    error: null
  });
  let pollInterval = null;
  return {
    subscribe,
    async load() {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const summary = await dashboard.summary();
        set({ summary, loading: false, error: null });
      } catch (e) {
        update((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : "Fehler beim Laden"
        }));
      }
    },
    startPolling() {
      if (pollInterval) return;
      this.load();
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
  const { subscribe, set, update } = writable({
    jobs: [],
    total: 0,
    page: 1,
    pageSize: 20,
    search: "",
    statusFilter: "all",
    typeFilter: "all",
    selectedJobId: null,
    loading: false,
    error: null
  });
  let currentState;
  subscribe((s) => currentState = s);
  return {
    subscribe,
    async load() {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const response = await dashboard.jobs({
          limit: currentState.pageSize,
          page: currentState.page,
          search: currentState.search || void 0,
          onlyFailed: currentState.statusFilter === "failed" ? true : currentState.statusFilter === "success" ? false : void 0,
          type: currentState.typeFilter !== "all" ? currentState.typeFilter : void 0
        });
        update((s) => ({
          ...s,
          jobs: response.jobs,
          total: response.total,
          loading: false,
          error: null,
          selectedJobId: s.selectedJobId && response.jobs.some((j) => j.id === s.selectedJobId) ? s.selectedJobId : response.jobs[0]?.id ?? null
        }));
      } catch (e) {
        update((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : "Fehler beim Laden"
        }));
      }
    },
    setPage(page) {
      update((s) => ({ ...s, page }));
      this.load();
    },
    setSearch(search) {
      update((s) => ({ ...s, search, page: 1 }));
      this.load();
    },
    setStatusFilter(statusFilter) {
      update((s) => ({ ...s, statusFilter, page: 1 }));
      this.load();
    },
    setTypeFilter(typeFilter) {
      update((s) => ({ ...s, typeFilter, page: 1 }));
      this.load();
    },
    selectJob(jobId) {
      update((s) => ({ ...s, selectedJobId: jobId }));
    },
    async deleteJob(jobId) {
      await dashboard.deleteJob(jobId);
      update((s) => ({
        ...s,
        jobs: s.jobs.filter((j) => j.id !== jobId),
        total: Math.max(0, s.total - 1),
        selectedJobId: s.selectedJobId === jobId ? s.jobs[0]?.id ?? null : s.selectedJobId
      }));
    },
    async deleteAllJobs() {
      await dashboard.deleteAllJobs();
      update((s) => ({
        ...s,
        jobs: [],
        total: 0,
        selectedJobId: null
      }));
    },
    async replayJob(jobId, payload) {
      return await dashboard.replayJob(jobId, payload);
    }
  };
}
const dashboardStore = createDashboardStore();
const jobsStore = createJobsStore();
export {
  dashboardStore as d,
  jobsStore as j
};
