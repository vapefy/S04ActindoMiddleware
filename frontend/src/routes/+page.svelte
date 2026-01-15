<script lang="ts">
	import { dashboardStore } from '$stores/dashboard';
	import { HeroSection, MetricCard } from '$components/dashboard';
	import Alert from '$components/ui/Alert.svelte';
	import Spinner from '$components/ui/Spinner.svelte';

	let summary = $derived($dashboardStore.summary);
	let loading = $derived($dashboardStore.loading);
	let error = $derived($dashboardStore.error);
</script>

<svelte:head>
	<title>Dashboard | Actindo Middleware</title>
</svelte:head>

{#if loading && !summary}
	<div class="flex items-center justify-center py-20">
		<Spinner size="large" />
	</div>
{:else if error && !summary}
	<Alert variant="error">{error}</Alert>
{:else if summary}
	<div class="space-y-8 animate-fade-in">
		<HeroSection activeJobs={summary.activeJobs} generatedAt={summary.generatedAt} />

		<section class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<MetricCard title="Produkte" stats={summary.products} />
			<MetricCard title="Kunden" stats={summary.customers} />
			<MetricCard title="Transaktionen" stats={summary.transactions} />
			<MetricCard title="Medien" stats={summary.media} />
		</section>
	</div>
{/if}
