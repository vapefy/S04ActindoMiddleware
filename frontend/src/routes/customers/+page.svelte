<script lang="ts">
	import { onMount } from 'svelte';
	import { RefreshCw, Search, Users } from 'lucide-svelte';
	import { customers as customersApi } from '$api/client';
	import type { CustomerListItem } from '$api/types';
	import { formatDate } from '$utils/format';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Card from '$components/ui/Card.svelte';
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Spinner from '$components/ui/Spinner.svelte';

	let customers: CustomerListItem[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let search = $state('');

	let filteredCustomers = $derived(
		search.trim()
			? customers.filter(
					(c) =>
						c.debtorNumber.toLowerCase().includes(search.toLowerCase()) ||
						c.name.toLowerCase().includes(search.toLowerCase())
				)
			: customers
	);

	onMount(() => {
		loadCustomers();
	});

	async function loadCustomers() {
		loading = true;
		error = '';
		try {
			customers = await customersApi.list();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Fehler beim Laden';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Customers | Actindo Middleware</title>
</svelte:head>

<PageHeader title="Kunden" subtitle="Uebersicht aller erstellten Kunden">
	{#snippet actions()}
		<Button variant="ghost" onclick={loadCustomers} disabled={loading}>
			<RefreshCw size={16} class={loading ? 'animate-spin' : ''} />
			Aktualisieren
		</Button>
	{/snippet}
</PageHeader>

{#if error}
	<Alert variant="error" class="mb-6">{error}</Alert>
{/if}

<Card>
	<!-- Search -->
	<div class="mb-6">
		<div class="relative max-w-md">
			<Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
			<Input
				type="search"
				placeholder="Suche nach Debitorennr. oder Name..."
				bind:value={search}
				class="pl-11"
			/>
		</div>
	</div>

	{#if loading && customers.length === 0}
		<div class="flex justify-center py-12">
			<Spinner />
		</div>
	{:else if filteredCustomers.length === 0}
		<div class="text-center py-12 text-gray-400">
			<Users size={48} class="mx-auto mb-4 opacity-50" />
			<p>{search ? 'Keine Kunden gefunden' : 'Noch keine Kunden vorhanden'}</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-white/10">
						<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">
							Debitorennr.
						</th>
						<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">
							Name
						</th>
						<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">
							Actindo ID
						</th>
						<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">
							Erstellt
						</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredCustomers as customer}
						<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
							<td class="py-3 px-4">
								<span class="font-mono text-sm text-royal-300">{customer.debtorNumber}</span>
							</td>
							<td class="py-3 px-4">{customer.name || '-'}</td>
							<td class="py-3 px-4">
								{#if customer.customerId}
									<span class="font-mono text-sm">{customer.customerId}</span>
								{:else}
									<span class="text-gray-500">-</span>
								{/if}
							</td>
							<td class="py-3 px-4 text-sm text-gray-400">
								{formatDate(customer.createdAt)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
			{filteredCustomers.length} von {customers.length} Kunden
		</div>
	{/if}
</Card>
