import { writable } from 'svelte/store';
import type { ProductSyncStatus, CustomerSyncStatus } from '$api/types';
import { sync as syncApi } from '$api/client';

export type SyncTab = 'products' | 'customers';

interface SyncState {
	configured: boolean | null;
	tab: SyncTab;
	products: ProductSyncStatus | null;
	customers: CustomerSyncStatus | null;
	loading: boolean;
	syncing: boolean;
	error: string | null;
	selectedProductSkus: Set<string>;
	selectedCustomerIds: Set<string>;
	expandedProducts: Set<string>;
	hideSynced: boolean;
}

function createSyncStore() {
	const { subscribe, set, update } = writable<SyncState>({
		configured: null,
		tab: 'products',
		products: null,
		customers: null,
		loading: false,
		syncing: false,
		error: null,
		selectedProductSkus: new Set(),
		selectedCustomerIds: new Set(),
		expandedProducts: new Set(),
		hideSynced: true // Default to hiding synced products
	});

	let currentState: SyncState;
	subscribe((s) => (currentState = s));

	return {
		subscribe,

		async checkStatus() {
			try {
				const status = await syncApi.status();
				update((s) => ({ ...s, configured: status.configured }));
				return status.configured;
			} catch (e) {
				update((s) => ({
					...s,
					configured: false,
					error: e instanceof Error ? e.message : 'Fehler beim Pruefen der Konfiguration'
				}));
				return false;
			}
		},

		async loadProducts() {
			update((s) => ({ ...s, loading: true, error: null }));
			try {
				const products = await syncApi.getProductStatus();
				update((s) => ({
					...s,
					products,
					loading: false,
					selectedProductSkus: new Set(),
					expandedProducts: new Set()
				}));
			} catch (e) {
				update((s) => ({
					...s,
					loading: false,
					error: e instanceof Error ? e.message : 'Fehler beim Laden der Produkte'
				}));
			}
		},

		async loadCustomers() {
			update((s) => ({ ...s, loading: true, error: null }));
			try {
				const customers = await syncApi.getCustomerStatus();
				update((s) => ({
					...s,
					customers,
					loading: false,
					selectedCustomerIds: new Set()
				}));
			} catch (e) {
				update((s) => ({
					...s,
					loading: false,
					error: e instanceof Error ? e.message : 'Fehler beim Laden der Kunden'
				}));
			}
		},

		setTab(tab: SyncTab) {
			update((s) => ({ ...s, tab }));
			if (tab === 'products' && !currentState.products) {
				this.loadProducts();
			} else if (tab === 'customers' && !currentState.customers) {
				this.loadCustomers();
			}
		},

		toggleProductSelection(sku: string) {
			update((s) => {
				const newSet = new Set(s.selectedProductSkus);
				if (newSet.has(sku)) {
					newSet.delete(sku);
				} else {
					newSet.add(sku);
				}
				return { ...s, selectedProductSkus: newSet };
			});
		},

		selectAllProducts(needsSyncOnly = false) {
			update((s) => {
				if (!s.products) return s;
				const items = needsSyncOnly
					? s.products.items.filter((p) => p.needsSync || p.status === 'NeedsSync')
					: s.products.items;
				// Also collect variants that need sync
				const skus: string[] = [];
				for (const item of items) {
					skus.push(item.sku);
					if (item.variants) {
						for (const v of item.variants) {
							if (!needsSyncOnly || v.status === 'NeedsSync') {
								skus.push(v.sku);
							}
						}
					}
				}
				return {
					...s,
					selectedProductSkus: new Set(skus)
				};
			});
		},

		clearProductSelection() {
			update((s) => ({ ...s, selectedProductSkus: new Set() }));
		},

		toggleProductExpanded(sku: string) {
			update((s) => {
				const newSet = new Set(s.expandedProducts);
				if (newSet.has(sku)) {
					newSet.delete(sku);
				} else {
					newSet.add(sku);
				}
				return { ...s, expandedProducts: newSet };
			});
		},

		expandAllProducts() {
			update((s) => {
				if (!s.products) return s;
				const masters = s.products.items
					.filter((p) => p.variantStatus === 'master' && p.variants.length > 0)
					.map((p) => p.sku);
				return { ...s, expandedProducts: new Set(masters) };
			});
		},

		collapseAllProducts() {
			update((s) => ({ ...s, expandedProducts: new Set() }));
		},

		toggleHideSynced() {
			update((s) => ({ ...s, hideSynced: !s.hideSynced }));
		},

		toggleCustomerSelection(debtorNumber: string) {
			update((s) => {
				const newSet = new Set(s.selectedCustomerIds);
				if (newSet.has(debtorNumber)) {
					newSet.delete(debtorNumber);
				} else {
					newSet.add(debtorNumber);
				}
				return { ...s, selectedCustomerIds: newSet };
			});
		},

		selectAllCustomers(needsSyncOnly = false) {
			update((s) => {
				if (!s.customers) return s;
				const items = needsSyncOnly
					? s.customers.items.filter((c) => c.needsSync)
					: s.customers.items;
				return {
					...s,
					selectedCustomerIds: new Set(items.map((c) => c.debtorNumber))
				};
			});
		},

		clearCustomerSelection() {
			update((s) => ({ ...s, selectedCustomerIds: new Set() }));
		},

		async syncSelectedProducts() {
			if (currentState.selectedProductSkus.size === 0) return { synced: 0 };

			update((s) => ({ ...s, syncing: true, error: null }));
			try {
				const result = await syncApi.syncProducts([...currentState.selectedProductSkus]);
				// Reload products after sync
				await this.loadProducts();
				update((s) => ({ ...s, syncing: false }));
				return result;
			} catch (e) {
				update((s) => ({
					...s,
					syncing: false,
					error: e instanceof Error ? e.message : 'Fehler beim Synchronisieren'
				}));
				throw e;
			}
		},

		async syncAllProducts() {
			update((s) => ({ ...s, syncing: true, error: null }));
			try {
				const result = await syncApi.syncAllProducts();
				// Reload products after sync
				await this.loadProducts();
				update((s) => ({ ...s, syncing: false }));
				return result;
			} catch (e) {
				update((s) => ({
					...s,
					syncing: false,
					error: e instanceof Error ? e.message : 'Fehler beim Synchronisieren'
				}));
				throw e;
			}
		},

		async syncSelectedCustomers() {
			if (currentState.selectedCustomerIds.size === 0) return { synced: 0, errors: [] };

			update((s) => ({ ...s, syncing: true, error: null }));
			try {
				let synced = 0;
				const errors: string[] = [];

				for (const debtorNumber of currentState.selectedCustomerIds) {
					try {
						await syncApi.syncCustomer(debtorNumber);
						synced++;
					} catch (e) {
						errors.push(`${debtorNumber}: ${e instanceof Error ? e.message : 'Fehler'}`);
					}
				}

				// Reload customers after sync
				await this.loadCustomers();
				update((s) => ({ ...s, syncing: false }));
				return { synced, errors };
			} catch (e) {
				update((s) => ({
					...s,
					syncing: false,
					error: e instanceof Error ? e.message : 'Fehler beim Synchronisieren'
				}));
				throw e;
			}
		},

		async syncAllCustomers() {
			update((s) => ({ ...s, syncing: true, error: null }));
			try {
				const result = await syncApi.syncAllCustomers();
				// Reload customers after sync
				await this.loadCustomers();
				update((s) => ({ ...s, syncing: false }));
				return result;
			} catch (e) {
				update((s) => ({
					...s,
					syncing: false,
					error: e instanceof Error ? e.message : 'Fehler beim Synchronisieren'
				}));
				throw e;
			}
		},

		async clearSelectedProductIds() {
			if (currentState.selectedProductSkus.size === 0) return { cleared: 0 };

			update((s) => ({ ...s, syncing: true, error: null }));
			try {
				const result = await syncApi.clearProductIds([...currentState.selectedProductSkus]);
				// Reload products after clearing
				await this.loadProducts();
				update((s) => ({ ...s, syncing: false }));
				return result;
			} catch (e) {
				update((s) => ({
					...s,
					syncing: false,
					error: e instanceof Error ? e.message : 'Fehler beim Leeren der IDs'
				}));
				throw e;
			}
		},

		async forceSyncSelectedProducts() {
			if (currentState.selectedProductSkus.size === 0) return { synced: 0 };

			update((s) => ({ ...s, syncing: true, error: null }));
			try {
				const result = await syncApi.forceSyncProducts([...currentState.selectedProductSkus]);
				// Reload products after sync
				await this.loadProducts();
				update((s) => ({ ...s, syncing: false }));
				return result;
			} catch (e) {
				update((s) => ({
					...s,
					syncing: false,
					error: e instanceof Error ? e.message : 'Fehler beim Synchronisieren'
				}));
				throw e;
			}
		},

		refresh() {
			if (currentState.tab === 'products') {
				this.loadProducts();
			} else {
				this.loadCustomers();
			}
		},

		clear() {
			set({
				configured: null,
				tab: 'products',
				products: null,
				customers: null,
				loading: false,
				syncing: false,
				error: null,
				selectedProductSkus: new Set(),
				selectedCustomerIds: new Set(),
				expandedProducts: new Set(),
				hideSynced: true
			});
		}
	};
}

export const syncStore = createSyncStore();
