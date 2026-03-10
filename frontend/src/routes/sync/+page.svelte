<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		RefreshCw,
		Package,
		Users,
		ArrowRightLeft,
		CheckCircle2,
		AlertTriangle,
		Settings,
		ChevronRight,
		ChevronDown,
		Eraser,
		Zap,
		CircleAlert,
		Eye
	} from 'lucide-svelte';
	import { syncStore } from '$stores/sync';
	import { permissions } from '$stores/auth';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Card from '$components/ui/Card.svelte';
	import Button from '$components/ui/Button.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Spinner from '$components/ui/Spinner.svelte';
	import Badge from '$components/ui/Badge.svelte';

	let perms = $derived($permissions);
	let syncState = $derived($syncStore);

	let successMessage = $state('');
	let showAll = $state(false);

	onMount(async () => {
		if (!perms.canWrite) { goto('/'); return; }
		const configured = await syncStore.checkStatus();
		if (configured) syncStore.loadProducts();
	});

	async function handleSyncSelected() {
		try {
			const result = syncState.tab === 'products'
				? await syncStore.syncSelectedProducts()
				: await syncStore.syncSelectedCustomers();
			const n = 'synced' in result ? result.synced : 0;
			successMessage = `${n} Eintrag/Einträge zu NAV synchronisiert`;
		} catch { /* handled in store */ }
	}

	async function handleSyncAll() {
		if (!confirm('Alle fehlenden Actindo-IDs an NAV übertragen?')) return;
		try {
			const result = syncState.tab === 'products'
				? await syncStore.syncAllProducts()
				: await syncStore.syncAllCustomers();
			const n = 'synced' in result ? result.synced : 0;
			successMessage = `${n} Eintrag/Einträge synchronisiert`;
		} catch { /* handled in store */ }
	}

	async function handleClearIds() {
		if (!confirm('Actindo-IDs der ausgewählten Produkte in NAV leeren?')) return;
		try {
			const result = await syncStore.clearSelectedProductIds();
			const n = 'cleared' in result ? result.cleared : 0;
			successMessage = `IDs von ${n} Produkt(en) geleert`;
		} catch { /* handled in store */ }
	}

	async function handleForceSync() {
		if (!confirm('Actindo-IDs der ausgewählten Produkte in NAV überschreiben?')) return;
		try {
			const result = await syncStore.forceSyncSelectedProducts();
			const n = 'synced' in result ? result.synced : 0;
			successMessage = `${n} Produkt(e) überschrieben`;
		} catch { /* handled in store */ }
	}

	let selectedCount = $derived(
		syncState.tab === 'products' ? syncState.selectedProductSkus.size : syncState.selectedCustomerIds.size
	);

	// Products that have a problem (need attention)
	let problemItems = $derived(
		syncState.products?.items.filter(p =>
			p.status === 'NeedsSync' || p.status === 'Mismatch' || p.status === 'Orphan'
		) ?? []
	);

	let displayedItems = $derived(showAll ? (syncState.products?.items ?? []) : problemItems);

	let problemCount = $derived(problemItems.length);

	function statusInfo(status: string): { label: string; detail: string; color: string } {
		switch (status) {
			case 'Synced':
				return { label: 'OK', detail: 'Actindo-ID ist in NAV eingetragen', color: 'text-green-400' };
			case 'NeedsSync':
				return { label: 'ID fehlt in NAV', detail: 'Middleware kennt die Actindo-ID, NAV noch nicht', color: 'text-amber-400' };
			case 'Mismatch':
				return { label: 'Falsche ID in NAV', detail: 'NAV hat eine andere Actindo-ID als tatsächlich', color: 'text-red-400' };
			case 'Orphan':
				return { label: 'NAV-ID ungültig', detail: 'Die ID, die NAV hat, existiert nicht in Actindo', color: 'text-red-400' };
			case 'ActindoOnly':
				return { label: 'Nur in Actindo', detail: 'Middleware kennt dieses Produkt nicht', color: 'text-gray-400' };
			case 'NavOnly':
				return { label: 'Nur in NAV', detail: 'Existiert nur in NAV', color: 'text-gray-400' };
			default:
				return { label: status, detail: '', color: 'text-gray-400' };
		}
	}

	function needsAction(status: string) {
		return status === 'NeedsSync' || status === 'Mismatch' || status === 'Orphan';
	}
</script>

<svelte:head>
	<title>Sync | Actindo Middleware</title>
</svelte:head>

<PageHeader title="NAV Sync" subtitle="Actindo-IDs zwischen Middleware und NAV abgleichen">
	{#snippet actions()}
		<Button variant="ghost" onclick={() => syncStore.refresh()} disabled={syncState.loading}>
			<RefreshCw size={16} class={syncState.loading ? 'animate-spin' : ''} />
			Aktualisieren
		</Button>
	{/snippet}
</PageHeader>

{#if syncState.error}
	<Alert variant="error" class="mb-6" dismissible ondismiss={() => ($syncStore.error = null)}>
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
			<p class="text-gray-400 mb-6">Bitte NAV API URL und Token in den Einstellungen eintragen.</p>
			<Button onclick={() => goto('/settings')}>Zu den Einstellungen</Button>
		</div>
	</Card>
{:else if syncState.configured === null}
	<div class="flex justify-center py-12"><Spinner size="large" /></div>
{:else}
	<!-- Tabs -->
	<div class="flex gap-2 mb-6">
		<button type="button"
			class="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
				{syncState.tab === 'products' ? 'bg-royal-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}"
			onclick={() => syncStore.setTab('products')}
		>
			<Package size={16} />
			Produkte
			{#if problemCount > 0}
				<span class="text-xs bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded-full">{problemCount}</span>
			{/if}
		</button>
		<button type="button"
			class="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
				{syncState.tab === 'customers' ? 'bg-royal-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}"
			onclick={() => syncStore.setTab('customers')}
		>
			<Users size={16} />
			Kunden
			{#if syncState.customers && syncState.customers.needsSync > 0}
				<span class="text-xs bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded-full">{syncState.customers.needsSync}</span>
			{/if}
		</button>
	</div>

	<!-- ===== PRODUCTS TAB ===== -->
	{#if syncState.tab === 'products'}
		{#if syncState.loading && !syncState.products}
			<div class="flex justify-center py-12"><Spinner /></div>
		{:else if syncState.products}

			<!-- Stats -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
				<div class="rounded-xl border border-white/10 bg-white/5 p-4">
					<p class="text-2xl font-bold">{syncState.products.items.length}</p>
					<p class="text-sm text-gray-400 mt-0.5">Gesamt</p>
				</div>
				<div class="rounded-xl border border-green-500/20 bg-green-900/10 p-4">
					<p class="text-2xl font-bold text-green-400">{syncState.products.synced}</p>
					<p class="text-sm text-gray-400 mt-0.5">Synchronisiert</p>
				</div>
				<div class="rounded-xl border border-amber-500/20 bg-amber-900/10 p-4">
					<p class="text-2xl font-bold text-amber-400">{syncState.products.needsSync}</p>
					<p class="text-sm text-gray-400 mt-0.5">ID fehlt in NAV</p>
				</div>
				<div class="rounded-xl border border-red-500/20 bg-red-900/10 p-4">
					<p class="text-2xl font-bold text-red-400">{syncState.products.mismatch + syncState.products.orphaned}</p>
					<p class="text-sm text-gray-400 mt-0.5">Falsch / Ungültig</p>
				</div>
			</div>

			<!-- Action bar -->
			{#if selectedCount > 0}
				<div class="flex flex-wrap items-center gap-2 mb-4 px-4 py-3 bg-royal-600/10 border border-royal-500/30 rounded-xl">
					<span class="text-sm font-medium text-royal-300">{selectedCount} ausgewählt</span>
					<span class="text-gray-600">·</span>
					<Button size="small" onclick={handleSyncSelected} disabled={syncState.syncing}>
						<ArrowRightLeft size={13} />
						ID zu NAV übertragen
					</Button>
					<Button variant="secondary" size="small" onclick={handleForceSync} disabled={syncState.syncing}>
						<Zap size={13} />
						Überschreiben
					</Button>
					<Button variant="danger" size="small" onclick={handleClearIds} disabled={syncState.syncing}>
						<Eraser size={13} />
						ID leeren
					</Button>
					<button type="button" class="ml-auto text-xs text-gray-500 hover:text-gray-300"
						onclick={() => syncStore.clearProductSelection()}>
						Auswahl aufheben
					</button>
				</div>
			{:else if syncState.products.needsSync > 0}
				<div class="flex items-center gap-3 mb-4">
					<Button onclick={handleSyncAll} disabled={syncState.syncing}>
						<ArrowRightLeft size={14} />
						Alle {syncState.products.needsSync} fehlenden IDs zu NAV übertragen
					</Button>
				</div>
			{/if}

			<!-- Table -->
			{#if displayedItems.length > 0}
				<Card>
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b border-white/10 text-left text-gray-400">
									<th class="pb-3 pr-3 w-8"></th>
									<th class="pb-3 pr-3 w-6"></th>
									<th class="pb-3 pr-4">SKU</th>
									<th class="pb-3 pr-4">Name</th>
									<th class="pb-3 pr-4 text-right">Middleware-ID</th>
									<th class="pb-3 pr-4 text-right">NAV hat ID</th>
									<th class="pb-3">Problem</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-white/5">
								{#each displayedItems as product}
									{@const info = statusInfo(product.status)}
									{@const hasVariants = product.variantStatus === 'master' && product.variants.length > 0}
									{@const isExpanded = syncState.expandedProducts.has(product.sku)}
									{@const isProblem = needsAction(product.status)}

									<tr class="hover:bg-white/5 transition-colors {isProblem ? '' : 'opacity-50'}">
										<!-- Expand -->
										<td class="py-3 pr-3">
											{#if hasVariants}
												<button type="button"
													class="p-0.5 hover:bg-white/10 rounded text-gray-500"
													onclick={() => syncStore.toggleProductExpanded(product.sku)}>
													{#if isExpanded}
														<ChevronDown size={14} />
													{:else}
														<ChevronRight size={14} />
													{/if}
												</button>
											{/if}
										</td>

										<!-- Checkbox -->
										<td class="py-3 pr-3">
											{#if isProblem}
												<input type="checkbox"
													checked={syncState.selectedProductSkus.has(product.sku)}
													onchange={() => syncStore.toggleProductSelection(product.sku)}
													class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"
												/>
											{/if}
										</td>

										<!-- SKU -->
										<td class="py-3 pr-4 font-mono font-medium">
											{product.sku}
											{#if hasVariants}
												<span class="text-gray-500 font-normal ml-1 text-xs">({product.variants.length} Var.)</span>
											{/if}
										</td>

										<!-- Name -->
										<td class="py-3 pr-4 text-gray-300 truncate max-w-48">{product.name || '—'}</td>

										<!-- Middleware ID -->
										<td class="py-3 pr-4 text-right font-mono text-gray-400 text-xs">
											{product.actindoId ?? product.middlewareActindoId ?? '—'}
										</td>

										<!-- NAV ID -->
										<td class="py-3 pr-4 text-right font-mono text-gray-400 text-xs">
											{product.navActindoId ?? '—'}
										</td>

										<!-- Status -->
										<td class="py-3">
											{#if product.status === 'Synced'}
												<span class="text-green-400 text-xs flex items-center gap-1">
													<CheckCircle2 size={12} />
													OK
												</span>
											{:else if product.status === 'NeedsSync'}
												<span class="text-amber-400 text-xs flex items-center gap-1" title={info.detail}>
													<AlertTriangle size={12} />
													ID fehlt in NAV
												</span>
											{:else if product.status === 'Mismatch'}
												<span class="text-red-400 text-xs flex items-center gap-1" title={info.detail}>
													<CircleAlert size={12} />
													Falsche ID in NAV
												</span>
											{:else if product.status === 'Orphan'}
												<span class="text-red-400 text-xs flex items-center gap-1" title={info.detail}>
													<CircleAlert size={12} />
													NAV-ID ungültig
												</span>
											{:else}
												<span class="text-gray-500 text-xs">{info.label}</span>
											{/if}
										</td>
									</tr>

									<!-- Variants -->
									{#if hasVariants && isExpanded}
										{#each product.variants as variant}
											{@const vInfo = statusInfo(variant.status)}
											{@const vProblem = needsAction(variant.status)}
											<tr class="hover:bg-white/5 transition-colors bg-white/[0.02] {vProblem ? '' : 'opacity-50'}">
												<td class="py-2 pr-3"></td>
												<td class="py-2 pr-3">
													{#if vProblem}
														<input type="checkbox"
															checked={syncState.selectedProductSkus.has(variant.sku)}
															onchange={() => syncStore.toggleProductSelection(variant.sku)}
															class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"
														/>
													{/if}
												</td>
												<td class="py-2 pr-4 font-mono text-gray-400 pl-5 text-xs">
													↳ {variant.sku}
													{#if variant.variantCode}
														<span class="text-gray-600 ml-1">({variant.variantCode})</span>
													{/if}
												</td>
												<td class="py-2 pr-4 text-gray-500 text-xs truncate max-w-48">{variant.name || '—'}</td>
												<td class="py-2 pr-4 text-right font-mono text-gray-500 text-xs">
													{variant.actindoId ?? variant.middlewareActindoId ?? '—'}
												</td>
												<td class="py-2 pr-4 text-right font-mono text-gray-500 text-xs">
													{variant.navActindoId ?? '—'}
												</td>
												<td class="py-2">
													{#if variant.status === 'Synced'}
														<span class="text-green-400/60 text-xs flex items-center gap-1"><CheckCircle2 size={11} />OK</span>
													{:else if variant.status === 'NeedsSync'}
														<span class="text-amber-400 text-xs flex items-center gap-1" title={vInfo.detail}><AlertTriangle size={11} />ID fehlt in NAV</span>
													{:else if variant.status === 'Mismatch'}
														<span class="text-red-400 text-xs flex items-center gap-1" title={vInfo.detail}><CircleAlert size={11} />Falsche ID in NAV</span>
													{:else if variant.status === 'Orphan'}
														<span class="text-red-400 text-xs flex items-center gap-1" title={vInfo.detail}><CircleAlert size={11} />NAV-ID ungültig</span>
													{:else}
														<span class="text-gray-600 text-xs">{vInfo.label}</span>
													{/if}
												</td>
											</tr>
										{/each}
									{/if}
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Toggle all / legend -->
					<div class="mt-4 pt-4 border-t border-white/5 flex items-start justify-between gap-4">
						<div class="text-xs text-gray-600 space-y-1">
							<p><span class="text-amber-400">ID fehlt in NAV</span> — Middleware kennt die Actindo-ID, NAV hat sie noch nicht</p>
							<p><span class="text-red-400">Falsche ID in NAV</span> — NAV hat eine Actindo-ID eingetragen, die nicht stimmt</p>
							<p><span class="text-red-400">NAV-ID ungültig</span> — Die ID die NAV hat existiert nicht mehr in Actindo</p>
						</div>
						<button type="button"
							class="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 shrink-0"
							onclick={() => (showAll = !showAll)}>
							<Eye size={12} />
							{showAll ? 'Nur Probleme' : `Alle anzeigen (${syncState.products.items.length})`}
						</button>
					</div>
				</Card>
			{:else}
				<Card>
					<div class="text-center py-12 text-gray-400">
						<CheckCircle2 size={48} class="mx-auto mb-4 text-green-400 opacity-60" />
						<p class="font-medium">Alles synchronisiert</p>
						<p class="text-sm text-gray-500 mt-1">Keine offenen Sync-Probleme gefunden.</p>
						{#if !showAll}
							<button type="button" class="text-xs text-royal-400 mt-3 hover:underline"
								onclick={() => (showAll = true)}>Alle Produkte anzeigen</button>
						{/if}
					</div>
				</Card>
			{/if}
		{:else}
			<Card>
				<div class="text-center py-12 text-gray-400">
					<Package size={48} class="mx-auto mb-4 opacity-40" />
					<p>Keine Produkte vorhanden</p>
				</div>
			</Card>
		{/if}
	{/if}

	<!-- ===== CUSTOMERS TAB ===== -->
	{#if syncState.tab === 'customers'}
		{#if syncState.loading && !syncState.customers}
			<div class="flex justify-center py-12"><Spinner /></div>
		{:else if syncState.customers && syncState.customers.items.length > 0}

			<!-- Stats -->
			<div class="grid grid-cols-3 gap-3 mb-6">
				<div class="rounded-xl border border-white/10 bg-white/5 p-4">
					<p class="text-2xl font-bold">{syncState.customers.totalInMiddleware}</p>
					<p class="text-sm text-gray-400 mt-0.5">Gesamt</p>
				</div>
				<div class="rounded-xl border border-green-500/20 bg-green-900/10 p-4">
					<p class="text-2xl font-bold text-green-400">{syncState.customers.synced}</p>
					<p class="text-sm text-gray-400 mt-0.5">Synchronisiert</p>
				</div>
				<div class="rounded-xl border border-amber-500/20 bg-amber-900/10 p-4">
					<p class="text-2xl font-bold text-amber-400">{syncState.customers.needsSync}</p>
					<p class="text-sm text-gray-400 mt-0.5">ID fehlt in NAV</p>
				</div>
			</div>

			<!-- Action bar -->
			{#if selectedCount > 0}
				<div class="flex items-center gap-3 mb-4 px-4 py-3 bg-royal-600/10 border border-royal-500/30 rounded-xl">
					<span class="text-sm font-medium text-royal-300">{selectedCount} ausgewählt</span>
					<Button size="small" onclick={handleSyncSelected} disabled={syncState.syncing}>
						<ArrowRightLeft size={13} />
						Zu NAV übertragen
					</Button>
					<button type="button" class="ml-auto text-xs text-gray-500 hover:text-gray-300"
						onclick={() => syncStore.clearCustomerSelection()}>
						Auswahl aufheben
					</button>
				</div>
			{:else if syncState.customers.needsSync > 0}
				<div class="mb-4">
					<Button onclick={handleSyncAll} disabled={syncState.syncing}>
						<ArrowRightLeft size={14} />
						Alle {syncState.customers.needsSync} fehlenden IDs zu NAV übertragen
					</Button>
				</div>
			{/if}

			<Card>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-white/10 text-left text-gray-400">
								<th class="pb-3 pr-4 w-8"></th>
								<th class="pb-3 pr-4">Debitor-Nr.</th>
								<th class="pb-3 pr-4">Name</th>
								<th class="pb-3 pr-4 text-right">Middleware-ID</th>
								<th class="pb-3 pr-4 text-right">NAV hat ID</th>
								<th class="pb-3">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/5">
							{#each syncState.customers.items as customer}
								<tr class="hover:bg-white/5 transition-colors {customer.needsSync ? '' : 'opacity-50'}">
									<td class="py-3 pr-4">
										{#if customer.needsSync}
											<input type="checkbox"
												checked={syncState.selectedCustomerIds.has(customer.debtorNumber)}
												onchange={() => syncStore.toggleCustomerSelection(customer.debtorNumber)}
												class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"
											/>
										{/if}
									</td>
									<td class="py-3 pr-4 font-mono">{customer.debtorNumber}</td>
									<td class="py-3 pr-4 text-gray-300 truncate max-w-64">{customer.name || '—'}</td>
									<td class="py-3 pr-4 text-right font-mono text-gray-400 text-xs">
										{customer.middlewareActindoId ?? '—'}
									</td>
									<td class="py-3 pr-4 text-right font-mono text-gray-400 text-xs">
										{customer.navActindoId ?? '—'}
									</td>
									<td class="py-3">
										{#if customer.needsSync}
											<span class="text-amber-400 text-xs flex items-center gap-1">
												<AlertTriangle size={12} />
												ID fehlt in NAV
											</span>
										{:else}
											<span class="text-green-400 text-xs flex items-center gap-1">
												<CheckCircle2 size={12} />
												OK
											</span>
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
					<Users size={48} class="mx-auto mb-4 opacity-40" />
					<p>Keine Kunden vorhanden</p>
				</div>
			</Card>
		{/if}
	{/if}
{/if}
