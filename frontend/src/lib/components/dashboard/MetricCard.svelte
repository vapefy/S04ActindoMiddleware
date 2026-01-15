<script lang="ts">
	import type { MetricStats } from '$api/types';
	import Card from '$components/ui/Card.svelte';

	interface Props {
		title: string;
		stats: MetricStats;
	}

	let { title, stats }: Props = $props();
</script>

<Card hover>
	<h3 class="text-sm font-medium uppercase tracking-wider text-gray-400 mb-4">
		{title}
	</h3>

	<div class="flex justify-between gap-6">
		<div class="space-y-1">
			<p class="text-xs uppercase tracking-wider text-gray-500">Erfolgreich</p>
			<p class="text-3xl font-bold text-emerald-400">{stats.success}</p>
		</div>
		<div class="space-y-1">
			<p class="text-xs uppercase tracking-wider text-gray-500">Fehler</p>
			<p class="text-3xl font-bold text-red-400">{stats.failed}</p>
		</div>
	</div>

	<p class="mt-4 text-sm text-gray-500">
		Avg <span class="text-gray-300 font-medium">{stats.averageDurationSeconds.toFixed(1)}s</span> pro Lauf
	</p>
</Card>
