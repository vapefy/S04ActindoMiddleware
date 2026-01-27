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
		Settings,
		ChevronRight,
		ChevronDown,
		Trash2,
		Info
	} from 'lucide-svelte';
	import { syncStore, type SyncTab } from '$stores/sync';
	import { permissions } from '$stores/auth';
	import type { SyncStatus } from '$api/types';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Card from '$components/ui/Card.svelte';
	import Button from '$components/ui/Button.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Spinner from '$components/ui/Spinner.svelte';
	import Badge from '$components/ui/Badge.svelte';

	let perms = $derived($permissions);
	let syncState = $derived($syncStore);

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
			if (syncState.tab === 'products') {
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
			if (syncState.tab === 'products') {
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
		if (syncState.tab === 'products') {
			syncStore.selectAllProducts(true);
		} else {
			syncStore.selectAllCustomers(true);
		}
	}

	function handleClearSelection() {
		if (syncState.tab === 'products') {
			syncStore.clearProductSelection();
		} else {
			syncStore.clearCustomerSelection();
		}
	}

	let selectedCount = $derived(
		syncState.tab === 'products' ? syncState.selectedProductSkus.size : syncState.selectedCustomerIds.size
	);

	let needsSyncCount = $derived(
		syncState.tab === 'products'
			? syncState.products?.needsSync ?? 0
			: syncState.customers?.needsSync ?? 0
	);

	let orphanCount = $derived(syncState.products?.orphaned ?? 0);

	function getStatusBadge(status: SyncStatus) {
		switch (status) {
			case 'Synced':
				return { variant: 'success' as const, label: 'Sync' };
			case 'NeedsSync':
				return { variant: 'warning' as const, label: 'Sync fehlt' };
			case 'Orphan':
				return { variant: 'error' as const, label: 'Verwaist' };
			case 'ActindoOnly':
				return { variant: 'info' as const, label: 'Nur Actindo' };
			case 'NavOnly':
				return { variant: 'secondary' as const, label: 'Nur NAV' };
			default:
				return { variant: 'default' as const, label: status };
		}
	}

	function getStatusIcon(status: SyncStatus) {
		switch (status) {
			case 'Synced':
				return { icon: CheckCircle2, class: 'text-green-400' };
			case 'NeedsSync':
				return { icon: AlertTriangle, class: 'text-amber-400' };
			case 'Orphan':
				return { icon: Trash2, class: 'text-red-400' };
			case 'ActindoOnly':
				return { icon: Info, class: 'text-blue-400' };
			case 'NavOnly':
				return { icon: XCircle, class: 'text-gray-400' };
			default:
				return { icon: Info, class: 'text-gray-400' };
		}
	}

	function getPresenceIcon(present: boolean) {
		return present
			? { icon: CheckCircle2, class: 'text-green-400' }
			: { icon: XCircle, class: 'text-gray-500' };
	}
</script>

<svelte:head>
	<title>Sync Status | Actindo Middleware</title>
</svelte:head>

<PageHeader title="Sync Status" subtitle="3-Wege-Vergleich: Actindo, NAV und Middleware">
	{#snippet actions()}
		<Button variant="ghost" onclick={() => syncStore.refresh()} disabled={syncState.loading}>
			<RefreshCw size={16} class={syncState.loading ? 'animate-spin' : ''} />
			Aktualisieren
		</Button>
	{/snippet}
</PageHeader>

{#if syncState.error}
	<Alert variant="error" class="mb-6" dismissible ondismiss={() => (syncState.error = null)}>
		{syncState.error}
	</Alert>
{/if}

{#if successMessage}
	<Alert variant="success" class="mb-6" dismissible ondismiss={() => (successMessage = '')}>
		{successMessage}
	</Alert>
{/if}

{#if syncState.configured === false}
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
{:else if syncState.configured === null}
	<div class="flex justify-center py-12">
		<Spinner size="large" />
	</div>
{:else}
	<!-- Tabs -->
	<div class="flex gap-2 mb-6">
		<button
			type="button"
			class="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
				{syncState.tab === 'products'
				? 'bg-royal-600 text-white'
				: 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}"
			onclick={() => handleTabChange('products')}
		>
			<Package size={18} />
			Produkte
			{#if syncState.products}
				{#if syncState.products.needsSync > 0}
					<Badge variant="warning">{syncState.products.needsSync}</Badge>
				{/if}
				{#if syncState.products.orphaned > 0}
					<Badge variant="error">{syncState.products.orphaned}</Badge>
				{/if}
			{/if}
		</button>
		<button
			type="button"
			class="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
				{syncState.tab === 'customers'
				? 'bg-royal-600 text-white'
				: 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}"
			onclick={() => handleTabChange('customers')}
		>
			<Users size={18} />
			Kunden
			{#if syncState.customers}
				<Badge variant={syncState.customers.needsSync > 0 ? 'warning' : 'success'}>
					{syncState.customers.needsSync}
				</Badge>
			{/if}
		</button>
	</div>

	<!-- Summary Cards for Products (3-way) -->
	{#if syncState.tab === 'products' && syncState.products}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
			<Card class="text-center">
				<p class="text-3xl font-bold text-blue-400">{syncState.products.totalInActindo}</p>
				<p class="text-sm text-gray-400">In Actindo</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold">{syncState.products.totalInNav}</p>
				<p class="text-sm text-gray-400">In NAV</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold">{syncState.products.totalInMiddleware}</p>
				<p class="text-sm text-gray-400">In Middleware</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-green-400">{syncState.products.synced}</p>
				<p class="text-sm text-gray-400">Synchronisiert</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-amber-400">{syncState.products.needsSync}</p>
				<p class="text-sm text-gray-400">Sync fehlt</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-red-400">{syncState.products.orphaned}</p>
				<p class="text-sm text-gray-400">Verwaist</p>
			</Card>
		</div>
	{:else if syncState.tab === 'customers' && syncState.customers}
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
			<Card class="text-center">
				<p class="text-3xl font-bold">{syncState.customers.totalInMiddleware}</p>
				<p class="text-sm text-gray-400">In Middleware</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold">{syncState.customers.totalInNav}</p>
				<p class="text-sm text-gray-400">In NAV</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-green-400">{syncState.customers.synced}</p>
				<p class="text-sm text-gray-400">Synchronisiert</p>
			</Card>
			<Card class="text-center">
				<p class="text-3xl font-bold text-amber-400">{syncState.customers.needsSync}</p>
				<p class="text-sm text-gray-400">Ausstehend</p>
			</Card>
		</div>
	{/if}

	<!-- Orphan Warning -->
	{#if syncState.tab === 'products' && orphanCount > 0}
		<Alert variant="warning" class="mb-6">
			<strong>Achtung:</strong> {orphanCount} Produkt(e) existieren in NAV/Middleware aber nicht mehr in Actindo.
			Diese Actindo-IDs sollten in NAV bereinigt werden.
		</Alert>
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
				<Button onclick={handleSyncSelected} disabled={syncState.syncing}>
					<ArrowRightLeft size={16} />
					{syncState.syncing ? 'Synchronisiere...' : `Auswahl synchronisieren (${selectedCount})`}
				</Button>
			{/if}
			<Button variant="primary" onclick={handleSyncAll} disabled={syncState.syncing}>
				<ArrowRightLeft size={16} />
				{syncState.syncing ? 'Synchronisiere...' : 'Alle synchronisieren'}
			</Button>
		</div>
	{/if}

	<!-- Products Table -->
	{#if syncState.tab === 'products'}
		{#if syncState.loading && !syncState.products}
			<div class="flex justify-center py-12">
				<Spinner />
			</div>
		{:else if syncState.products && syncState.products.items.length > 0}
			<!-- Expand/Collapse buttons -->
			{#if syncState.products.items.some((p) => p.variantStatus === 'master' && p.variants.length > 0)}
				<div class="flex gap-2 mb-4">
					<Button variant="ghost" size="small" onclick={() => syncStore.expandAllProducts()}>
						<ChevronDown size={14} />
						Alle aufklappen
					</Button>
					<Button variant="ghost" size="small" onclick={() => syncStore.collapseAllProducts()}>
						<ChevronRight size={14} />
						Alle zuklappen
					</Button>
				</div>
			{/if}

			<Card>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-white/10 text-left text-sm text-gray-400">
								<th class="pb-3 pr-2 w-8"></th>
								<th class="pb-3 pr-4 w-10"></th>
								<th class="pb-3 pr-4">SKU</th>
								<th class="pb-3 pr-4">Name</th>
								<th class="pb-3 pr-4">Typ</th>
								<th class="pb-3 pr-2 text-center" title="In Actindo">Act</th>
								<th class="pb-3 pr-2 text-center" title="In NAV">NAV</th>
								<th class="pb-3 pr-2 text-center" title="In Middleware">MW</th>
								<th class="pb-3 pr-4 text-right">Actindo ID</th>
								<th class="pb-3 pr-4 text-right">NAV Actindo ID</th>
								<th class="pb-3 text-center">Status</th>
							</tr>
						</thead>
						<tbody>
							{#each syncState.products.items as product}
								{@const hasVariants = product.variantStatus === 'master' && product.variants.length > 0}
								{@const isExpanded = syncState.expandedProducts.has(product.sku)}
								{@const statusBadge = getStatusBadge(product.status)}
								{@const statusIcon = getStatusIcon(product.status)}
								{@const actindoPresence = getPresenceIcon(product.inActindo)}
								{@const navPresence = getPresenceIcon(product.inNav)}
								{@const mwPresence = getPresenceIcon(product.inMiddleware)}

								<!-- Master/Single row -->
								<tr
									class="border-b border-white/5 hover:bg-white/5 transition-colors
										{product.status === 'NeedsSync' ? 'bg-amber-500/5' : ''}
										{product.status === 'Orphan' ? 'bg-red-500/5' : ''}"
								>
									<td class="py-3 pr-2">
										{#if hasVariants}
											<button
												type="button"
												class="p-1 hover:bg-white/10 rounded"
												onclick={() => syncStore.toggleProductExpanded(product.sku)}
											>
												{#if isExpanded}
													<ChevronDown size={16} class="text-gray-400" />
												{:else}
													<ChevronRight size={16} class="text-gray-400" />
												{/if}
											</button>
										{/if}
									</td>
									<td class="py-3 pr-4">
										{#if product.status === 'NeedsSync'}
											<input
												type="checkbox"
												checked={syncState.selectedProductSkus.has(product.sku)}
												onchange={() => syncStore.toggleProductSelection(product.sku)}
												class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"
											/>
										{/if}
									</td>
									<td class="py-3 pr-4 font-mono text-sm">
										{product.sku}
										{#if hasVariants}
											<span class="text-gray-500 ml-1">({product.variants.length})</span>
										{/if}
									</td>
									<td class="py-3 pr-4 truncate max-w-48">{product.name || '-'}</td>
									<td class="py-3 pr-4">
										<Badge
											variant={product.variantStatus === 'master'
												? 'info'
												: product.variantStatus === 'child'
													? 'secondary'
													: 'default'}
										>
											{product.variantStatus === 'single' ? 'Single' : product.variantStatus}
										</Badge>
									</td>
									<td class="py-3 pr-2 text-center">
										<svelte:component this={actindoPresence.icon} size={16} class="inline {actindoPresence.class}" />
									</td>
									<td class="py-3 pr-2 text-center">
										<svelte:component this={navPresence.icon} size={16} class="inline {navPresence.class}" />
									</td>
									<td class="py-3 pr-2 text-center">
										<svelte:component this={mwPresence.icon} size={16} class="inline {mwPresence.class}" />
									</td>
									<td class="py-3 pr-4 text-right font-mono text-sm">
										{product.actindoId ?? product.middlewareActindoId ?? '-'}
									</td>
									<td class="py-3 pr-4 text-right font-mono text-sm">
										{product.navActindoId ?? '-'}
									</td>
									<td class="py-3 text-center">
										<Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
									</td>
								</tr>

								<!-- Variant rows (when expanded) -->
								{#if hasVariants && isExpanded}
									{#each product.variants as variant}
										{@const vStatusBadge = getStatusBadge(variant.status)}
										{@const vActindoPresence = getPresenceIcon(variant.inActindo)}
										{@const vNavPresence = getPresenceIcon(variant.inNav)}
										{@const vMwPresence = getPresenceIcon(variant.inMiddleware)}

										<tr
											class="border-b border-white/5 hover:bg-white/5 transition-colors bg-white/[0.02]
												{variant.status === 'NeedsSync' ? 'bg-amber-500/5' : ''}
												{variant.status === 'Orphan' ? 'bg-red-500/5' : ''}"
										>
											<td class="py-2 pr-2"></td>
											<td class="py-2 pr-4">
												{#if variant.status === 'NeedsSync'}
													<input
														type="checkbox"
														checked={syncState.selectedProductSkus.has(variant.sku)}
														onchange={() => syncStore.toggleProductSelection(variant.sku)}
														class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"
													/>
												{/if}
											</td>
											<td class="py-2 pr-4 font-mono text-sm pl-6 text-gray-400">
												{variant.sku}
											</td>
											<td class="py-2 pr-4 truncate max-w-48 text-gray-400 text-sm">
												{variant.variantCode || variant.name || '-'}
											</td>
											<td class="py-2 pr-4">
												<Badge variant="secondary">child</Badge>
											</td>
											<td class="py-2 pr-2 text-center">
												<svelte:component this={vActindoPresence.icon} size={14} class="inline {vActindoPresence.class}" />
											</td>
											<td class="py-2 pr-2 text-center">
												<svelte:component this={vNavPresence.icon} size={14} class="inline {vNavPresence.class}" />
											</td>
											<td class="py-2 pr-2 text-center">
												<svelte:component this={vMwPresence.icon} size={14} class="inline {vMwPresence.class}" />
											</td>
											<td class="py-2 pr-4 text-right font-mono text-sm text-gray-400">
												{variant.actindoId ?? variant.middlewareActindoId ?? '-'}
											</td>
											<td class="py-2 pr-4 text-right font-mono text-sm text-gray-400">
												{variant.navActindoId ?? '-'}
											</td>
											<td class="py-2 text-center">
												<Badge variant={vStatusBadge.variant}>{vStatusBadge.label}</Badge>
											</td>
										</tr>
									{/each}
								{/if}
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
	{#if syncState.tab === 'customers'}
		{#if syncState.loading && !syncState.customers}
			<div class="flex justify-center py-12">
				<Spinner />
			</div>
		{:else if syncState.customers && syncState.customers.items.length > 0}
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
							{#each syncState.customers.items as customer}
								<tr
									class="border-b border-white/5 hover:bg-white/5 transition-colors
										{customer.needsSync ? 'bg-amber-500/5' : ''}"
								>
									<td class="py-3 pr-4">
										{#if customer.needsSync}
											<input
												type="checkbox"
												checked={syncState.selectedCustomerIds.has(customer.debtorNumber)}
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
