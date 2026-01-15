<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		RefreshCw,
		Package,
		Users,
		ArrowRightLeft,
		CheckCircle2,
		XCircle,
		AlertTriangle,
		Settings
	} from 'lucide-svelte';
	import { syncStore, type SyncTab } from '$stores/sync';
	import { permissions } from '$stores/auth';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Card from '$components/ui/Card.svelte';
	import Button from '$components/ui/Button.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Spinner from '$components/ui/Spinner.svelte';
	import Badge from '$components/ui/Badge.svelte';

	let perms = $derived($permissions);
	let state = $derived($syncStore);

	let successMessage = $state('');

	onMount(async () => {
		if (!perms.canWrite) {
			goto('/');
			return;
		}

		const configured = await syncStore.checkStatus();
		if (configured) {
			syncStore.loadProducts();
		}
	});

	function handleTabChange(tab: SyncTab) {
		syncStore.setTab(tab);
	}

	async function handleSyncSelected() {
		try {
			let result;
			if (state.tab === 'products') {
				result = await syncStore.syncSelectedProducts();
				successMessage = `${result.synced} Produkt(e) synchronisiert`;
			} else {
				result = await syncStore.syncSelectedCustomers();
				if (result.errors && result.errors.length > 0) {
					successMessage = `${result.synced} Kunde(n) synchronisiert. Fehler: ${result.errors.length}`;
				} else {
					successMessage = `${result.synced} Kunde(n) synchronisiert`;
				}
			}
		} catch (e) {
			// Error is handled in store
		}
	}

	async function handleSyncAll() {
		if (!confirm('Alle fehlenden Actindo-IDs zu NAV synchronisieren?')) return;

		try {
			let result;
			if (state.tab === 'products') {
				result = await syncStore.syncAllProducts();
				if (result.message) {
					successMessage = result.message;
				} else {
					successMessage = `${result.synced} Produkt(e) synchronisiert`;
				}
			} else {
				result = await syncStore.syncAllCustomers();
				if (result.errors && result.errors.length > 0) {
					successMessage = `${result.synced} Kunde(n) synchronisiert. Fehler: ${result.errors.length}`;
				} else {
					successMessage = `${result.synced} Kunde(n) synchronisiert`;
				}
			}
		} catch (e) {
			// Error is handled in store
		}
	}

	function handleSelectAllNeedsSync() {
		if (state.tab === 'products') {
			syncStore.selectAllProducts(true);
		} else {
			syncStore.selectAllCustomers(true);
		}
	}

	function handleClearSelection() {
		if (state.tab === 'products') {
			syncStore.clearProductSelection();
		} else {
			syncStore.clearCustomerSelection();
		}
	}

	let selectedCount = $derived(
		state.tab === 'products' ? state.selectedProductSkus.size : state.selectedCustomerIds.size
	);

	let needsSyncCount = $derived(
		state.tab === 'products'
			? state.products?.needsSync ?? 0
			: state.customers?.needsSync ?? 0
	);
</script>

<svelte:head>
	<title>Sync Status | Actindo Middleware</title>
</svelte:head>

<PageHeader title="Sync Status" subtitle="NAV und Actindo ID Synchronisation">
	{#snippet actions()}
		<Button variant="ghost" onclick={() => syncStore.refresh()} disabled={state.loading}>
			<RefreshCw size={16} class={state.loading ? 'animate-spin' : ''} />
			Aktualisieren
		</Button>
	{/snippet}
</PageHeader>

{#if state.error}
	<Alert variant="error" class="mb-6" dismissible ondismiss={() => (state.error = null)}>
		{state.error}
	</Alert>
{/if}

{#if successMessage}
	<Alert variant="success" class="mb-6" dismissible ondismiss={() => (successMessage = '')}>
		{successMessage}
	</Alert>
{/if}

{#if state.configured === false}
	<Card>
		<div class="text-center py-12">
			<Settings size={48} class="mx-auto mb-4 text-gray-500" />
			<h3 class="text-xl font-semibold mb-2">NAV API nicht konfiguriert</h3>
			<p class="text-gray-400 mb-6">
				Bitte konfiguriere die NAV API URL und den Token in den Einstellungen.
			</p>
			<Button onclick={() => goto('/settings')}>Zu den Einstellungen</Button>
		</div>
	</Card>
{:else if state.configured === null}
	<div class="flex justify-center py-12">
		<Spinner size="large" />
	</div>
{:else}
	<!-- Tabs -->
	<div class="flex gap-2 mb-6">
		<button
			type="button"
			class="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
				{state.tab === 'products'
				? 'bg-royal-600 text-white'
				: 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}"
			onclick={() => handleTabChange('products')}
		>
			<Package size={18} />
			Produkte
			{#if state.products}
				<Badge variant={state.products.needsSync > 0 ? 'warning' : 'success'}>
					{state.products.needsSync}
				</Badge>
			{/if}
		</button>
		<button
			type="button"
			class="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
				{state.tab === 'customers'
				? 'bg-royal-600 text-white'
				: 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}"
			onclick={() => handleTabChange('customers')}
		>
			<Users size={18} />
			Kunden
			{#if state.customers}
				<Badge variant={state.customers.needsSync > 0 ? 'warning' : 'success'}>
					{state.customers.needsSync}
				</Badge>
			{/if}
		</button>
	</div>

	<!-- Summary Cards -->
	{#if state.tab === 'products' && state.products}
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
			<Card class="text-center">
				<p class="text-3xl font-bold">{state.products.totalInMiddleware}</p>
				<p class="text-sm text-gray-400">In Middleware</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold">{state.products.totalInNav}</p>
				<p class="text-sm text-gray-400">In NAV</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-green-400">{state.products.synced}</p>
				<p class="text-sm text-gray-400">Synchronisiert</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-amber-400">{state.products.needsSync}</p>
				<p class="text-sm text-gray-400">Ausstehend</p>
			</Card>
		</div>
	{:else if state.tab === 'customers' && state.customers}
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
			<Card class="text-center">
				<p class="text-3xl font-bold">{state.customers.totalInMiddleware}</p>
				<p class="text-sm text-gray-400">In Middleware</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold">{state.customers.totalInNav}</p>
				<p class="text-sm text-gray-400">In NAV</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-green-400">{state.customers.synced}</p>
				<p class="text-sm text-gray-400">Synchronisiert</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-amber-400">{state.customers.needsSync}</p>
				<p class="text-sm text-gray-400">Ausstehend</p>
			</Card>
		</div>
	{/if}

	<!-- Action Buttons -->
	{#if needsSyncCount > 0}
		<div class="flex flex-wrap gap-2 mb-6">
			<Button variant="ghost" onclick={handleSelectAllNeedsSync}>
				Alle ausstehenden auswaehlen ({needsSyncCount})
			</Button>
			{#if selectedCount > 0}
				<Button variant="ghost" onclick={handleClearSelection}>
					Auswahl aufheben ({selectedCount})
				</Button>
				<Button onclick={handleSyncSelected} disabled={state.syncing}>
					<ArrowRightLeft size={16} />
					{state.syncing ? 'Synchronisiere...' : `Auswahl synchronisieren (${selectedCount})`}
				</Button>
			{/if}
			<Button variant="primary" onclick={handleSyncAll} disabled={state.syncing}>
				<ArrowRightLeft size={16} />
				{state.syncing ? 'Synchronisiere...' : 'Alle synchronisieren'}
			</Button>
		</div>
	{/if}

	<!-- Products Table -->
	{#if state.tab === 'products'}
		{#if state.loading && !state.products}
			<div class="flex justify-center py-12">
				<Spinner />
			</div>
		{:else if state.products && state.products.items.length > 0}
			<Card>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-white/10 text-left text-sm text-gray-400">
								<th class="pb-3 pr-4 w-10"></th>
								<th class="pb-3 pr-4">SKU</th>
								<th class="pb-3 pr-4">Name</th>
								<th class="pb-3 pr-4">Typ</th>
								<th class="pb-3 pr-4 text-right">Middleware ID</th>
								<th class="pb-3 pr-4 text-right">NAV ID</th>
								<th class="pb-3 text-right">NAV Actindo ID</th>
								<th class="pb-3 text-center">Status</th>
							</tr>
						</thead>
						<tbody>
							{#each state.products.items as product}
								<tr
									class="border-b border-white/5 hover:bg-white/5 transition-colors
										{product.needsSync ? 'bg-amber-500/5' : ''}"
								>
									<td class="py-3 pr-4">
										{#if product.needsSync}
											<input
												type="checkbox"
												checked={state.selectedProductSkus.has(product.sku)}
												onchange={() => syncStore.toggleProductSelection(product.sku)}
												class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"
											/>
										{/if}
									</td>
									<td class="py-3 pr-4 font-mono text-sm">{product.sku}</td>
									<td class="py-3 pr-4 truncate max-w-48">{product.name || '-'}</td>
									<td class="py-3 pr-4">
										<Badge
											variant={product.variantStatus === 'master'
												? 'info'
												: product.variantStatus === 'child'
													? 'secondary'
													: 'default'}
										>
											{product.variantStatus}
										</Badge>
									</td>
									<td class="py-3 pr-4 text-right font-mono text-sm">
										{product.middlewareActindoId ?? '-'}
									</td>
									<td class="py-3 pr-4 text-right font-mono text-sm">
										{product.navNavId ?? '-'}
									</td>
									<td class="py-3 text-right font-mono text-sm">
										{product.navActindoId ?? '-'}
									</td>
									<td class="py-3 text-center">
										{#if product.needsSync}
											<AlertTriangle size={18} class="inline text-amber-400" />
										{:else if product.middlewareActindoId && product.navActindoId}
											<CheckCircle2 size={18} class="inline text-green-400" />
										{:else}
											<XCircle size={18} class="inline text-gray-500" />
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card>
		{:else}
			<Card>
				<div class="text-center py-12 text-gray-400">
					<Package size={48} class="mx-auto mb-4 opacity-50" />
					<p>Keine Produkte vorhanden</p>
				</div>
			</Card>
		{/if}
	{/if}

	<!-- Customers Table -->
	{#if state.tab === 'customers'}
		{#if state.loading && !state.customers}
			<div class="flex justify-center py-12">
				<Spinner />
			</div>
		{:else if state.customers && state.customers.items.length > 0}
			<Card>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-white/10 text-left text-sm text-gray-400">
								<th class="pb-3 pr-4 w-10"></th>
								<th class="pb-3 pr-4">Debitorennr.</th>
								<th class="pb-3 pr-4">Name</th>
								<th class="pb-3 pr-4 text-right">Middleware ID</th>
								<th class="pb-3 pr-4 text-right">NAV ID</th>
								<th class="pb-3 text-right">NAV Actindo ID</th>
								<th class="pb-3 text-center">Status</th>
							</tr>
						</thead>
						<tbody>
							{#each state.customers.items as customer}
								<tr
									class="border-b border-white/5 hover:bg-white/5 transition-colors
										{customer.needsSync ? 'bg-amber-500/5' : ''}"
								>
									<td class="py-3 pr-4">
										{#if customer.needsSync}
											<input
												type="checkbox"
												checked={state.selectedCustomerIds.has(customer.debtorNumber)}
												onchange={() => syncStore.toggleCustomerSelection(customer.debtorNumber)}
												class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"
											/>
										{/if}
									</td>
									<td class="py-3 pr-4 font-mono text-sm">{customer.debtorNumber}</td>
									<td class="py-3 pr-4 truncate max-w-64">{customer.name || '-'}</td>
									<td class="py-3 pr-4 text-right font-mono text-sm">
										{customer.middlewareActindoId ?? '-'}
									</td>
									<td class="py-3 pr-4 text-right font-mono text-sm">
										{customer.navNavId ?? '-'}
									</td>
									<td class="py-3 text-right font-mono text-sm">
										{customer.navActindoId ?? '-'}
									</td>
									<td class="py-3 text-center">
										{#if customer.needsSync}
											<AlertTriangle size={18} class="inline text-amber-400" />
										{:else if customer.middlewareActindoId && customer.navActindoId}
											<CheckCircle2 size={18} class="inline text-green-400" />
										{:else}
											<XCircle size={18} class="inline text-gray-500" />
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card>
		{:else}
			<Card>
				<div class="text-center py-12 text-gray-400">
					<Users size={48} class="mx-auto mb-4 opacity-50" />
					<p>Keine Kunden vorhanden</p>
				</div>
			</Card>
		{/if}
	{/if}
{/if}
