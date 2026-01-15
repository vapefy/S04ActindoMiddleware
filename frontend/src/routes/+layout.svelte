<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import '../app.css';
	import { authStore, isAuthenticated } from '$stores/auth';
	import { dashboardStore } from '$stores/dashboard';
	import Nav from '$components/layout/Nav.svelte';
	import Spinner from '$components/ui/Spinner.svelte';

	let { children } = $props();

	const publicRoutes = ['/login', '/register'];
	let initialized = $derived($authStore.initialized);
	let authenticated = $derived($isAuthenticated);
	let currentPath = $derived($page.url.pathname);
	let isPublicRoute = $derived(publicRoutes.some((r) => currentPath.startsWith(r)));

	onMount(async () => {
		await authStore.init();
	});

	$effect(() => {
		if (initialized && !authenticated && !isPublicRoute) {
			goto(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
		}
	});

	$effect(() => {
		if (authenticated && !isPublicRoute) {
			dashboardStore.startPolling();
			return () => dashboardStore.stopPolling();
		}
	});
</script>

<svelte:head>
	<title>Actindo Middleware</title>
</svelte:head>

{#if !initialized}
	<div class="min-h-screen flex items-center justify-center">
		<Spinner size="large" />
	</div>
{:else if isPublicRoute}
	{@render children()}
{:else if authenticated}
	<div class="min-h-screen flex flex-col">
		<Nav />
		<main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
			{@render children()}
		</main>
		<footer class="py-4 text-center text-sm text-gray-500 border-t border-white/5">
			Powered by FC Schalke 04 | Software & Development
		</footer>
	</div>
{/if}
