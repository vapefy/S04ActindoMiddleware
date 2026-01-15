import { s as sanitize_props, a as spread_props, b as slot, f as store_get, h as head, c as attr_class, e as stringify, g as ensure_array_like, d as attr, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { g as goto } from "../../../chunks/client.js";
import { w as writable } from "../../../chunks/index.js";
import { a as sync } from "../../../chunks/client2.js";
import { p as permissions } from "../../../chunks/auth.js";
import { P as PageHeader, R as Refresh_cw } from "../../../chunks/PageHeader.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
import { A as Alert } from "../../../chunks/Alert.js";
import { I as Icon, S as Spinner } from "../../../chunks/Spinner.js";
import { B as Badge } from "../../../chunks/Badge.js";
import { S as Settings } from "../../../chunks/settings.js";
import { P as Package } from "../../../chunks/package.js";
import { U as Users } from "../../../chunks/users.js";
import { A as Arrow_right_left } from "../../../chunks/arrow-right-left.js";
import { $ as escape_html } from "../../../chunks/context.js";
function Circle_check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "m9 12 2 2 4-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-check" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtOSAxMiAyIDIgNC00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Circle_x($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "m15 9-6 6" }],
    ["path", { "d": "m9 9 6 6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-x" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleX
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtMTUgOS02IDYiIC8+CiAgPHBhdGggZD0ibTkgOSA2IDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Triangle_alert($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "triangle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name TriangleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiIC8+CiAgPHBhdGggZD0iTTEyIDl2NCIgLz4KICA8cGF0aCBkPSJNMTIgMTdoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/triangle-alert
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function createSyncStore() {
  const { subscribe, set, update } = writable({
    configured: null,
    tab: "products",
    products: null,
    customers: null,
    loading: false,
    syncing: false,
    error: null,
    selectedProductSkus: /* @__PURE__ */ new Set(),
    selectedCustomerIds: /* @__PURE__ */ new Set()
  });
  let currentState;
  subscribe((s) => currentState = s);
  return {
    subscribe,
    async checkStatus() {
      try {
        const status = await sync.status();
        update((s) => ({ ...s, configured: status.configured }));
        return status.configured;
      } catch (e) {
        update((s) => ({
          ...s,
          configured: false,
          error: e instanceof Error ? e.message : "Fehler beim Pruefen der Konfiguration"
        }));
        return false;
      }
    },
    async loadProducts() {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const products = await sync.getProductStatus();
        update((s) => ({
          ...s,
          products,
          loading: false,
          selectedProductSkus: /* @__PURE__ */ new Set()
        }));
      } catch (e) {
        update((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : "Fehler beim Laden der Produkte"
        }));
      }
    },
    async loadCustomers() {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const customers = await sync.getCustomerStatus();
        update((s) => ({
          ...s,
          customers,
          loading: false,
          selectedCustomerIds: /* @__PURE__ */ new Set()
        }));
      } catch (e) {
        update((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : "Fehler beim Laden der Kunden"
        }));
      }
    },
    setTab(tab) {
      update((s) => ({ ...s, tab }));
      if (tab === "products" && !currentState.products) {
        this.loadProducts();
      } else if (tab === "customers" && !currentState.customers) {
        this.loadCustomers();
      }
    },
    toggleProductSelection(sku) {
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
        const items = needsSyncOnly ? s.products.items.filter((p) => p.needsSync) : s.products.items;
        return {
          ...s,
          selectedProductSkus: new Set(items.map((p) => p.sku))
        };
      });
    },
    clearProductSelection() {
      update((s) => ({ ...s, selectedProductSkus: /* @__PURE__ */ new Set() }));
    },
    toggleCustomerSelection(debtorNumber) {
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
        const items = needsSyncOnly ? s.customers.items.filter((c) => c.needsSync) : s.customers.items;
        return {
          ...s,
          selectedCustomerIds: new Set(items.map((c) => c.debtorNumber))
        };
      });
    },
    clearCustomerSelection() {
      update((s) => ({ ...s, selectedCustomerIds: /* @__PURE__ */ new Set() }));
    },
    async syncSelectedProducts() {
      if (currentState.selectedProductSkus.size === 0) return { synced: 0 };
      update((s) => ({ ...s, syncing: true, error: null }));
      try {
        const result = await sync.syncProducts([...currentState.selectedProductSkus]);
        await this.loadProducts();
        update((s) => ({ ...s, syncing: false }));
        return result;
      } catch (e) {
        update((s) => ({
          ...s,
          syncing: false,
          error: e instanceof Error ? e.message : "Fehler beim Synchronisieren"
        }));
        throw e;
      }
    },
    async syncAllProducts() {
      update((s) => ({ ...s, syncing: true, error: null }));
      try {
        const result = await sync.syncAllProducts();
        await this.loadProducts();
        update((s) => ({ ...s, syncing: false }));
        return result;
      } catch (e) {
        update((s) => ({
          ...s,
          syncing: false,
          error: e instanceof Error ? e.message : "Fehler beim Synchronisieren"
        }));
        throw e;
      }
    },
    async syncSelectedCustomers() {
      if (currentState.selectedCustomerIds.size === 0) return { synced: 0, errors: [] };
      update((s) => ({ ...s, syncing: true, error: null }));
      try {
        let synced = 0;
        const errors = [];
        for (const debtorNumber of currentState.selectedCustomerIds) {
          try {
            await sync.syncCustomer(debtorNumber);
            synced++;
          } catch (e) {
            errors.push(`${debtorNumber}: ${e instanceof Error ? e.message : "Fehler"}`);
          }
        }
        await this.loadCustomers();
        update((s) => ({ ...s, syncing: false }));
        return { synced, errors };
      } catch (e) {
        update((s) => ({
          ...s,
          syncing: false,
          error: e instanceof Error ? e.message : "Fehler beim Synchronisieren"
        }));
        throw e;
      }
    },
    async syncAllCustomers() {
      update((s) => ({ ...s, syncing: true, error: null }));
      try {
        const result = await sync.syncAllCustomers();
        await this.loadCustomers();
        update((s) => ({ ...s, syncing: false }));
        return result;
      } catch (e) {
        update((s) => ({
          ...s,
          syncing: false,
          error: e instanceof Error ? e.message : "Fehler beim Synchronisieren"
        }));
        throw e;
      }
    },
    refresh() {
      if (currentState.tab === "products") {
        this.loadProducts();
      } else {
        this.loadCustomers();
      }
    },
    clear() {
      set({
        configured: null,
        tab: "products",
        products: null,
        customers: null,
        loading: false,
        syncing: false,
        error: null,
        selectedProductSkus: /* @__PURE__ */ new Set(),
        selectedCustomerIds: /* @__PURE__ */ new Set()
      });
    }
  };
}
const syncStore = createSyncStore();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$permissions", permissions);
    let state = store_get($$store_subs ??= {}, "$syncStore", syncStore);
    let successMessage = "";
    async function handleSyncSelected() {
      try {
        let result;
        if (state.tab === "products") {
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
      }
    }
    async function handleSyncAll() {
      if (!confirm("Alle fehlenden Actindo-IDs zu NAV synchronisieren?")) return;
      try {
        let result;
        if (state.tab === "products") {
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
      }
    }
    function handleSelectAllNeedsSync() {
      if (state.tab === "products") {
        syncStore.selectAllProducts(true);
      } else {
        syncStore.selectAllCustomers(true);
      }
    }
    function handleClearSelection() {
      if (state.tab === "products") {
        syncStore.clearProductSelection();
      } else {
        syncStore.clearCustomerSelection();
      }
    }
    let selectedCount = state.tab === "products" ? state.selectedProductSkus.size : state.selectedCustomerIds.size;
    let needsSyncCount = state.tab === "products" ? state.products?.needsSync ?? 0 : state.customers?.needsSync ?? 0;
    head("pillow", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Sync Status | Actindo Middleware</title>`);
      });
    });
    {
      let actions = function($$renderer3) {
        Button($$renderer3, {
          variant: "ghost",
          onclick: () => syncStore.refresh(),
          disabled: state.loading,
          children: ($$renderer4) => {
            Refresh_cw($$renderer4, { size: 16, class: state.loading ? "animate-spin" : "" });
            $$renderer4.push(`<!----> Aktualisieren`);
          }
        });
      };
      PageHeader($$renderer2, {
        title: "Sync Status",
        subtitle: "NAV und Actindo ID Synchronisation",
        actions
      });
    }
    $$renderer2.push(`<!----> `);
    if (state.error) {
      $$renderer2.push("<!--[-->");
      Alert($$renderer2, {
        variant: "error",
        class: "mb-6",
        dismissible: true,
        ondismiss: () => state.error = null,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(state.error)}`);
        }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (successMessage) {
      $$renderer2.push("<!--[-->");
      Alert($$renderer2, {
        variant: "success",
        class: "mb-6",
        dismissible: true,
        ondismiss: () => successMessage = "",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(successMessage)}`);
        }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (state.configured === false) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="text-center py-12">`);
          Settings($$renderer3, { size: 48, class: "mx-auto mb-4 text-gray-500" });
          $$renderer3.push(`<!----> <h3 class="text-xl font-semibold mb-2">NAV API nicht konfiguriert</h3> <p class="text-gray-400 mb-6">Bitte konfiguriere die NAV API URL und den Token in den Einstellungen.</p> `);
          Button($$renderer3, {
            onclick: () => goto(),
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Zu den Einstellungen`);
            }
          });
          $$renderer3.push(`<!----></div>`);
        }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      if (state.configured === null) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex justify-center py-12">`);
        Spinner($$renderer2, { size: "large" });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex gap-2 mb-6"><button type="button"${attr_class(`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${stringify(state.tab === "products" ? "bg-royal-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white")}`)}>`);
        Package($$renderer2, { size: 18 });
        $$renderer2.push(`<!----> Produkte `);
        if (state.products) {
          $$renderer2.push("<!--[-->");
          Badge($$renderer2, {
            variant: state.products.needsSync > 0 ? "warning" : "success",
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->${escape_html(state.products.needsSync)}`);
            }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></button> <button type="button"${attr_class(`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${stringify(state.tab === "customers" ? "bg-royal-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white")}`)}>`);
        Users($$renderer2, { size: 18 });
        $$renderer2.push(`<!----> Kunden `);
        if (state.customers) {
          $$renderer2.push("<!--[-->");
          Badge($$renderer2, {
            variant: state.customers.needsSync > 0 ? "warning" : "success",
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->${escape_html(state.customers.needsSync)}`);
            }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></button></div> `);
        if (state.tab === "products" && state.products) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">`);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold">${escape_html(state.products.totalInMiddleware)}</p> <p class="text-sm text-gray-400">In Middleware</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold">${escape_html(state.products.totalInNav)}</p> <p class="text-sm text-gray-400">In NAV</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold text-green-400">${escape_html(state.products.synced)}</p> <p class="text-sm text-gray-400">Synchronisiert</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold text-amber-400">${escape_html(state.products.needsSync)}</p> <p class="text-sm text-gray-400">Ausstehend</p>`);
            }
          });
          $$renderer2.push(`<!----></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (state.tab === "customers" && state.customers) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">`);
            Card($$renderer2, {
              class: "text-center",
              children: ($$renderer3) => {
                $$renderer3.push(`<p class="text-3xl font-bold">${escape_html(state.customers.totalInMiddleware)}</p> <p class="text-sm text-gray-400">In Middleware</p>`);
              }
            });
            $$renderer2.push(`<!----> `);
            Card($$renderer2, {
              class: "text-center",
              children: ($$renderer3) => {
                $$renderer3.push(`<p class="text-3xl font-bold">${escape_html(state.customers.totalInNav)}</p> <p class="text-sm text-gray-400">In NAV</p>`);
              }
            });
            $$renderer2.push(`<!----> `);
            Card($$renderer2, {
              class: "text-center",
              children: ($$renderer3) => {
                $$renderer3.push(`<p class="text-3xl font-bold text-green-400">${escape_html(state.customers.synced)}</p> <p class="text-sm text-gray-400">Synchronisiert</p>`);
              }
            });
            $$renderer2.push(`<!----> `);
            Card($$renderer2, {
              class: "text-center",
              children: ($$renderer3) => {
                $$renderer3.push(`<p class="text-3xl font-bold text-amber-400">${escape_html(state.customers.needsSync)}</p> <p class="text-sm text-gray-400">Ausstehend</p>`);
              }
            });
            $$renderer2.push(`<!----></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--> `);
        if (needsSyncCount > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex flex-wrap gap-2 mb-6">`);
          Button($$renderer2, {
            variant: "ghost",
            onclick: handleSelectAllNeedsSync,
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->Alle ausstehenden auswaehlen (${escape_html(needsSyncCount)})`);
            }
          });
          $$renderer2.push(`<!----> `);
          if (selectedCount > 0) {
            $$renderer2.push("<!--[-->");
            Button($$renderer2, {
              variant: "ghost",
              onclick: handleClearSelection,
              children: ($$renderer3) => {
                $$renderer3.push(`<!---->Auswahl aufheben (${escape_html(selectedCount)})`);
              }
            });
            $$renderer2.push(`<!----> `);
            Button($$renderer2, {
              onclick: handleSyncSelected,
              disabled: state.syncing,
              children: ($$renderer3) => {
                Arrow_right_left($$renderer3, { size: 16 });
                $$renderer3.push(`<!----> ${escape_html(state.syncing ? "Synchronisiere..." : `Auswahl synchronisieren (${selectedCount})`)}`);
              }
            });
            $$renderer2.push(`<!---->`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          Button($$renderer2, {
            variant: "primary",
            onclick: handleSyncAll,
            disabled: state.syncing,
            children: ($$renderer3) => {
              Arrow_right_left($$renderer3, { size: 16 });
              $$renderer3.push(`<!----> ${escape_html(state.syncing ? "Synchronisiere..." : "Alle synchronisieren")}`);
            }
          });
          $$renderer2.push(`<!----></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (state.tab === "products") {
          $$renderer2.push("<!--[-->");
          if (state.loading && !state.products) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="flex justify-center py-12">`);
            Spinner($$renderer2, {});
            $$renderer2.push(`<!----></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (state.products && state.products.items.length > 0) {
              $$renderer2.push("<!--[-->");
              Card($$renderer2, {
                children: ($$renderer3) => {
                  $$renderer3.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-white/10 text-left text-sm text-gray-400"><th class="pb-3 pr-4 w-10"></th><th class="pb-3 pr-4">SKU</th><th class="pb-3 pr-4">Name</th><th class="pb-3 pr-4">Typ</th><th class="pb-3 pr-4 text-right">Middleware ID</th><th class="pb-3 pr-4 text-right">NAV ID</th><th class="pb-3 text-right">NAV Actindo ID</th><th class="pb-3 text-center">Status</th></tr></thead><tbody><!--[-->`);
                  const each_array = ensure_array_like(state.products.items);
                  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                    let product = each_array[$$index];
                    $$renderer3.push(`<tr${attr_class(`border-b border-white/5 hover:bg-white/5 transition-colors ${stringify(product.needsSync ? "bg-amber-500/5" : "")}`)}><td class="py-3 pr-4">`);
                    if (product.needsSync) {
                      $$renderer3.push("<!--[-->");
                      $$renderer3.push(`<input type="checkbox"${attr("checked", state.selectedProductSkus.has(product.sku), true)} class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"/>`);
                    } else {
                      $$renderer3.push("<!--[!-->");
                    }
                    $$renderer3.push(`<!--]--></td><td class="py-3 pr-4 font-mono text-sm">${escape_html(product.sku)}</td><td class="py-3 pr-4 truncate max-w-48">${escape_html(product.name || "-")}</td><td class="py-3 pr-4">`);
                    Badge($$renderer3, {
                      variant: product.variantStatus === "master" ? "info" : product.variantStatus === "child" ? "secondary" : "default",
                      children: ($$renderer4) => {
                        $$renderer4.push(`<!---->${escape_html(product.variantStatus)}`);
                      }
                    });
                    $$renderer3.push(`<!----></td><td class="py-3 pr-4 text-right font-mono text-sm">${escape_html(product.middlewareActindoId ?? "-")}</td><td class="py-3 pr-4 text-right font-mono text-sm">${escape_html(product.navNavId ?? "-")}</td><td class="py-3 text-right font-mono text-sm">${escape_html(product.navActindoId ?? "-")}</td><td class="py-3 text-center">`);
                    if (product.needsSync) {
                      $$renderer3.push("<!--[-->");
                      Triangle_alert($$renderer3, { size: 18, class: "inline text-amber-400" });
                    } else {
                      $$renderer3.push("<!--[!-->");
                      if (product.middlewareActindoId && product.navActindoId) {
                        $$renderer3.push("<!--[-->");
                        Circle_check($$renderer3, { size: 18, class: "inline text-green-400" });
                      } else {
                        $$renderer3.push("<!--[!-->");
                        Circle_x($$renderer3, { size: 18, class: "inline text-gray-500" });
                      }
                      $$renderer3.push(`<!--]-->`);
                    }
                    $$renderer3.push(`<!--]--></td></tr>`);
                  }
                  $$renderer3.push(`<!--]--></tbody></table></div>`);
                }
              });
            } else {
              $$renderer2.push("<!--[!-->");
              Card($$renderer2, {
                children: ($$renderer3) => {
                  $$renderer3.push(`<div class="text-center py-12 text-gray-400">`);
                  Package($$renderer3, { size: 48, class: "mx-auto mb-4 opacity-50" });
                  $$renderer3.push(`<!----> <p>Keine Produkte vorhanden</p></div>`);
                }
              });
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (state.tab === "customers") {
          $$renderer2.push("<!--[-->");
          if (state.loading && !state.customers) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="flex justify-center py-12">`);
            Spinner($$renderer2, {});
            $$renderer2.push(`<!----></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (state.customers && state.customers.items.length > 0) {
              $$renderer2.push("<!--[-->");
              Card($$renderer2, {
                children: ($$renderer3) => {
                  $$renderer3.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-white/10 text-left text-sm text-gray-400"><th class="pb-3 pr-4 w-10"></th><th class="pb-3 pr-4">Debitorennr.</th><th class="pb-3 pr-4">Name</th><th class="pb-3 pr-4 text-right">Middleware ID</th><th class="pb-3 pr-4 text-right">NAV ID</th><th class="pb-3 text-right">NAV Actindo ID</th><th class="pb-3 text-center">Status</th></tr></thead><tbody><!--[-->`);
                  const each_array_1 = ensure_array_like(state.customers.items);
                  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                    let customer = each_array_1[$$index_1];
                    $$renderer3.push(`<tr${attr_class(`border-b border-white/5 hover:bg-white/5 transition-colors ${stringify(customer.needsSync ? "bg-amber-500/5" : "")}`)}><td class="py-3 pr-4">`);
                    if (customer.needsSync) {
                      $$renderer3.push("<!--[-->");
                      $$renderer3.push(`<input type="checkbox"${attr("checked", state.selectedCustomerIds.has(customer.debtorNumber), true)} class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"/>`);
                    } else {
                      $$renderer3.push("<!--[!-->");
                    }
                    $$renderer3.push(`<!--]--></td><td class="py-3 pr-4 font-mono text-sm">${escape_html(customer.debtorNumber)}</td><td class="py-3 pr-4 truncate max-w-64">${escape_html(customer.name || "-")}</td><td class="py-3 pr-4 text-right font-mono text-sm">${escape_html(customer.middlewareActindoId ?? "-")}</td><td class="py-3 pr-4 text-right font-mono text-sm">${escape_html(customer.navNavId ?? "-")}</td><td class="py-3 text-right font-mono text-sm">${escape_html(customer.navActindoId ?? "-")}</td><td class="py-3 text-center">`);
                    if (customer.needsSync) {
                      $$renderer3.push("<!--[-->");
                      Triangle_alert($$renderer3, { size: 18, class: "inline text-amber-400" });
                    } else {
                      $$renderer3.push("<!--[!-->");
                      if (customer.middlewareActindoId && customer.navActindoId) {
                        $$renderer3.push("<!--[-->");
                        Circle_check($$renderer3, { size: 18, class: "inline text-green-400" });
                      } else {
                        $$renderer3.push("<!--[!-->");
                        Circle_x($$renderer3, { size: 18, class: "inline text-gray-500" });
                      }
                      $$renderer3.push(`<!--]-->`);
                    }
                    $$renderer3.push(`<!--]--></td></tr>`);
                  }
                  $$renderer3.push(`<!--]--></tbody></table></div>`);
                }
              });
            } else {
              $$renderer2.push("<!--[!-->");
              Card($$renderer2, {
                children: ($$renderer3) => {
                  $$renderer3.push(`<div class="text-center py-12 text-gray-400">`);
                  Users($$renderer3, { size: 48, class: "mx-auto mb-4 opacity-50" });
                  $$renderer3.push(`<!----> <p>Keine Kunden vorhanden</p></div>`);
                }
              });
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
