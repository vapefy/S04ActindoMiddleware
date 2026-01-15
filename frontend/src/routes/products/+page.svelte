<script lang="ts">
	import { onMount } from 'svelte';
	import { RefreshCw, Search, Package, ChevronDown, ChevronRight, Euro, BoxIcon } from 'lucide-svelte';
	import { products as productsApi } from '$api/client';
	import type { ProductListItem } from '$api/types';
	import { formatDate } from '$utils/format';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Card from '$components/ui/Card.svelte';
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Badge from '$components/ui/Badge.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Spinner from '$components/ui/Spinner.svelte';

	function formatPrice(price: number | null): string {
		if (price === null) return '-';
		return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
	}

	let products: ProductListItem[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let search = $state('');

	// Expanded master products (SKU -> variants)
	let expandedProducts: Record<string, ProductListItem[]> = $state({});
	let loadingVariants: Record<string, boolean> = $state({});

	let filteredProducts = $derived(
		search.trim()
			? products.filter(
					(p) =>
						p.sku.toLowerCase().includes(search.toLowerCase()) ||
						p.name.toLowerCase().includes(search.toLowerCase()) ||
						(p.variantCode && p.variantCode.toLowerCase().includes(search.toLowerCase()))
				)
			: products
	);

	onMount(() => {
		loadProducts();
	});

	async function loadProducts() {
		loading = true;
		error = '';
		expandedProducts = {};
		try {
			products = await productsApi.list();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Fehler beim Laden';
		} finally {
			loading = false;
		}
	}

	async function toggleVariants(masterSku: string) {
		if (expandedProducts[masterSku]) {
			// Collapse
			const { [masterSku]: _, ...rest } = expandedProducts;
			expandedProducts = rest;
		} else {
			// Expand - load variants
			loadingVariants = { ...loadingVariants, [masterSku]: true };
			try {
				const variants = await productsApi.getVariants(masterSku);
				expandedProducts = { ...expandedProducts, [masterSku]: variants };
			} catch (err) {
				console.error('Failed to load variants:', err);
			} finally {
				const { [masterSku]: _, ...rest } = loadingVariants;
				loadingVariants = rest;
			}
		}
	}

	function getVariantStatusBadge(status: string) {
		switch (status) {
			case 'master':
				return { variant: 'primary' as const, label: 'Master' };
			case 'child':
				return { variant: 'default' as const, label: 'Variante' };
			default:
				return null;
		}
	}
</script>

<svelte:head>
	<title>Products | Actindo Middleware</title>
</svelte:head>

<PageHeader title="Produkte" subtitle="Uebersicht aller erstellten Produkte">
	{#snippet actions()}
		<Button variant="ghost" onclick={loadProducts} disabled={loading}>
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
				placeholder="Suche nach SKU, Name oder Variantencode..."
				bind:value={search}
				class="pl-11"
			/>
		</div>
	</div>

	{#if loading && products.length === 0}
		<div class="flex justify-center py-12">
			<Spinner />
		</div>
	{:else if filteredProducts.length === 0}
		<div class="text-center py-12 text-gray-400">
			<Package size={48} class="mx-auto mb-4 opacity-50" />
			<p>{search ? 'Keine Produkte gefunden' : 'Noch keine Produkte vorhanden'}</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-white/10">
						<th
							class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium w-10"
						>
						</th>
						<th
							class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium"
						>
							SKU
						</th>
						<th
							class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium"
						>
							Name
						</th>
						<th
							class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium"
						>
							Status
						</th>
						<th
							class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium"
						>
							Actindo ID
						</th>
						<th
							class="text-right py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium"
						>
							Preis
						</th>
						<th
							class="text-right py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium"
						>
							Bestand
						</th>
						<th
							class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium"
						>
							Erstellt
						</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredProducts as product}
						{@const isExpanded = !!expandedProducts[product.sku]}
						{@const isLoading = !!loadingVariants[product.sku]}
						{@const isMaster = product.variantStatus === 'master'}
						{@const statusBadge = getVariantStatusBadge(product.variantStatus)}

						<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
							<!-- Expand Button -->
							<td class="py-3 px-4">
								{#if isMaster && product.variantCount && product.variantCount > 0}
									<button
										type="button"
										onclick={() => toggleVariants(product.sku)}
										class="p-1 rounded hover:bg-white/10 transition-colors"
										disabled={isLoading}
									>
										{#if isLoading}
											<RefreshCw size={16} class="animate-spin text-gray-400" />
										{:else if isExpanded}
											<ChevronDown size={16} class="text-royal-400" />
										{:else}
											<ChevronRight size={16} class="text-gray-400" />
										{/if}
									</button>
								{/if}
							</td>

							<!-- SKU -->
							<td class="py-3 px-4">
								<span
									class="font-mono text-sm {isMaster
										? 'text-royal-300 font-semibold'
										: 'text-royal-300'}"
								>
									{product.sku}
								</span>
							</td>

							<!-- Name -->
							<td class="py-3 px-4">
								{product.name || '-'}
							</td>

							<!-- Status -->
							<td class="py-3 px-4">
								{#if statusBadge}
									<Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
									{#if isMaster && product.variantCount}
										<span class="ml-2 text-xs text-gray-500">
											({product.variantCount} Varianten)
										</span>
									{/if}
								{:else}
									<span class="text-gray-500">-</span>
								{/if}
							</td>

							<!-- Actindo ID -->
							<td class="py-3 px-4">
								{#if product.productId}
									<span class="font-mono text-sm">{product.productId}</span>
								{:else}
									<span class="text-gray-500">-</span>
								{/if}
							</td>

							<!-- Preis -->
							<td class="py-3 px-4 text-right">
								{#if product.lastPrice !== null}
									<span class="font-mono text-sm text-green-400">{formatPrice(product.lastPrice)}</span>
									{#if product.lastPriceEmployee || product.lastPriceMember}
										<div class="text-xs text-gray-500 mt-0.5">
											{#if product.lastPriceEmployee}MA: {formatPrice(product.lastPriceEmployee)}{/if}
											{#if product.lastPriceMember}{product.lastPriceEmployee ? ' / ' : ''}Mit: {formatPrice(product.lastPriceMember)}{/if}
										</div>
									{/if}
								{:else}
									<span class="text-gray-500">-</span>
								{/if}
							</td>

							<!-- Bestand -->
							<td class="py-3 px-4 text-right">
								{#if product.lastStock !== null}
									<span class="font-mono text-sm {product.lastStock > 0 ? 'text-blue-400' : 'text-red-400'}">
										{product.lastStock}
									</span>
								{:else}
									<span class="text-gray-500">-</span>
								{/if}
							</td>

							<!-- Erstellt -->
							<td class="py-3 px-4 text-sm text-gray-400">
								{formatDate(product.createdAt)}
							</td>
						</tr>

						<!-- Expanded Variants -->
						{#if isExpanded && expandedProducts[product.sku]}
							{#each expandedProducts[product.sku] as variant}
								<tr class="border-b border-white/5 bg-royal-900/20">
									<td class="py-2 px-4"></td>
									<td class="py-2 px-4">
										<span class="font-mono text-sm text-gray-400 pl-4">
											<span class="text-royal-600 mr-1">└</span>
											{variant.sku}
										</span>
									</td>
									<td class="py-2 px-4">
										{#if variant.variantCode}
											<Badge variant="default" class="font-mono text-xs"
												>{variant.variantCode}</Badge
											>
										{:else}
											<span class="text-gray-500">-</span>
										{/if}
									</td>
									<td class="py-2 px-4">
										<Badge variant="default">Variante</Badge>
									</td>
									<td class="py-2 px-4">
										{#if variant.productId}
											<span class="font-mono text-sm">{variant.productId}</span>
										{:else}
											<span class="text-gray-500">-</span>
										{/if}
									</td>
									<td class="py-2 px-4 text-right">
										{#if variant.lastPrice !== null}
											<span class="font-mono text-sm text-green-400">{formatPrice(variant.lastPrice)}</span>
										{:else}
											<span class="text-gray-500">-</span>
										{/if}
									</td>
									<td class="py-2 px-4 text-right">
										{#if variant.lastStock !== null}
											<span class="font-mono text-sm {variant.lastStock > 0 ? 'text-blue-400' : 'text-red-400'}">
												{variant.lastStock}
											</span>
										{:else}
											<span class="text-gray-500">-</span>
										{/if}
									</td>
									<td class="py-2 px-4 text-sm text-gray-400">
										{formatDate(variant.createdAt)}
									</td>
								</tr>
							{/each}
						{/if}
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
			<span>{filteredProducts.length} Produkte</span>
		</div>
	{/if}
</Card>
