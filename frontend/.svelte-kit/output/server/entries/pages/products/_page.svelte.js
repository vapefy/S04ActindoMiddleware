import { h as head, e as ensure_array_like, d as attr, f as attr_class, g as stringify } from "../../../chunks/index2.js";
import { p as products } from "../../../chunks/client2.js";
import { a as formatDate } from "../../../chunks/format.js";
import { P as PageHeader, R as Refresh_cw } from "../../../chunks/PageHeader.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { B as Badge } from "../../../chunks/Badge.js";
import { A as Alert } from "../../../chunks/Alert.js";
import { S as Spinner } from "../../../chunks/Spinner.js";
import { S as Search } from "../../../chunks/search.js";
import { P as Package, C as Chevron_down } from "../../../chunks/package.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
import { $ as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    function formatPrice(price) {
      if (price === null) return "-";
      return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price);
    }
    let products$1 = [];
    let loading = true;
    let error = "";
    let search = "";
    let expandedProducts = {};
    let loadingVariants = {};
    let stockModalStocks = [];
    stockModalStocks.reduce((sum, s) => sum + s.stock, 0);
    let filteredProducts = search.trim() ? products$1.filter((p) => p.sku.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase()) || p.variantCode && p.variantCode.toLowerCase().includes(search.toLowerCase())) : products$1;
    async function loadProducts() {
      loading = true;
      error = "";
      expandedProducts = {};
      try {
        products$1 = await products.list();
      } catch (err) {
        error = err instanceof Error ? err.message : "Fehler beim Laden";
      } finally {
        loading = false;
      }
    }
    function getVariantStatusBadge(status) {
      switch (status) {
        case "master":
          return { variant: "primary", label: "Master" };
        case "child":
          return { variant: "default", label: "Variante" };
        case "single":
        default:
          return { variant: "default", label: "Single" };
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1dj9mz1", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Products | Actindo Middleware</title>`);
        });
      });
      {
        let actions = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            onclick: loadProducts,
            disabled: loading,
            children: ($$renderer5) => {
              Refresh_cw($$renderer5, { size: 16, class: loading ? "animate-spin" : "" });
              $$renderer5.push(`<!----> Aktualisieren`);
            }
          });
        };
        PageHeader($$renderer3, {
          title: "Produkte",
          subtitle: "Uebersicht aller erstellten Produkte",
          actions
        });
      }
      $$renderer3.push(`<!----> `);
      if (error) {
        $$renderer3.push("<!--[-->");
        Alert($$renderer3, {
          variant: "error",
          class: "mb-6",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(error)}`);
          }
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="mb-6"><div class="relative max-w-md">`);
          Search($$renderer4, {
            size: 18,
            class: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          });
          $$renderer4.push(`<!----> `);
          Input($$renderer4, {
            type: "search",
            placeholder: "Suche nach SKU, Name oder Variantencode...",
            class: "pl-11",
            get value() {
              return search;
            },
            set value($$value) {
              search = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div> `);
          if (loading && products$1.length === 0) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="flex justify-center py-12">`);
            Spinner($$renderer4, {});
            $$renderer4.push(`<!----></div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            if (filteredProducts.length === 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="text-center py-12 text-gray-400">`);
              Package($$renderer4, { size: 48, class: "mx-auto mb-4 opacity-50" });
              $$renderer4.push(`<!----> <p>${escape_html(search ? "Keine Produkte gefunden" : "Noch keine Produkte vorhanden")}</p></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-white/10"><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium w-10"></th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">SKU</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Name</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Status</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Actindo ID</th><th class="text-right py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Preis</th><th class="text-right py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Bestand</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Erstellt</th></tr></thead><tbody><!--[-->`);
              const each_array = ensure_array_like(filteredProducts);
              for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
                let product = each_array[$$index_1];
                const isExpanded = !!expandedProducts[product.sku];
                const isLoading = !!loadingVariants[product.sku];
                const isMaster = product.variantStatus === "master";
                const statusBadge = getVariantStatusBadge(product.variantStatus);
                $$renderer4.push(`<tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="py-3 px-4">`);
                if (isMaster && product.variantCount && product.variantCount > 0) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<button type="button" class="p-1 rounded hover:bg-white/10 transition-colors"${attr("disabled", isLoading, true)}>`);
                  if (isLoading) {
                    $$renderer4.push("<!--[-->");
                    Refresh_cw($$renderer4, { size: 16, class: "animate-spin text-gray-400" });
                  } else {
                    $$renderer4.push("<!--[!-->");
                    if (isExpanded) {
                      $$renderer4.push("<!--[-->");
                      Chevron_down($$renderer4, { size: 16, class: "text-royal-400" });
                    } else {
                      $$renderer4.push("<!--[!-->");
                      Chevron_right($$renderer4, { size: 16, class: "text-gray-400" });
                    }
                    $$renderer4.push(`<!--]-->`);
                  }
                  $$renderer4.push(`<!--]--></button>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></td><td class="py-3 px-4"><span${attr_class(`font-mono text-sm ${stringify(isMaster ? "text-royal-300 font-semibold" : "text-royal-300")}`)}>${escape_html(product.sku)}</span></td><td class="py-3 px-4">${escape_html(product.name || "-")}</td><td class="py-3 px-4">`);
                Badge($$renderer4, {
                  variant: statusBadge.variant,
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(statusBadge.label)}`);
                  }
                });
                $$renderer4.push(`<!----> `);
                if (isMaster && product.variantCount) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<span class="ml-2 text-xs text-gray-500">(${escape_html(product.variantCount)} Varianten)</span>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></td><td class="py-3 px-4">`);
                if (product.productId) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<span class="font-mono text-sm">${escape_html(product.productId)}</span>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<span class="text-gray-500">-</span>`);
                }
                $$renderer4.push(`<!--]--></td><td class="py-3 px-4 text-right">`);
                if (product.lastPrice !== null) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<span class="font-mono text-sm text-green-400">${escape_html(formatPrice(product.lastPrice))}</span> `);
                  if (product.lastPriceEmployee || product.lastPriceMember) {
                    $$renderer4.push("<!--[-->");
                    $$renderer4.push(`<div class="text-xs text-gray-500 mt-0.5">`);
                    if (product.lastPriceEmployee) {
                      $$renderer4.push("<!--[-->");
                      $$renderer4.push(`MA: ${escape_html(formatPrice(product.lastPriceEmployee))}`);
                    } else {
                      $$renderer4.push("<!--[!-->");
                    }
                    $$renderer4.push(`<!--]--> `);
                    if (product.lastPriceMember) {
                      $$renderer4.push("<!--[-->");
                      $$renderer4.push(`${escape_html(product.lastPriceEmployee ? " / " : "")}Mit: ${escape_html(formatPrice(product.lastPriceMember))}`);
                    } else {
                      $$renderer4.push("<!--[!-->");
                    }
                    $$renderer4.push(`<!--]--></div>`);
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]-->`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<span class="text-gray-500">-</span>`);
                }
                $$renderer4.push(`<!--]--></td><td class="py-3 px-4 text-right">`);
                if (product.lastStock !== null) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<button type="button"${attr_class(`font-mono text-sm ${stringify(product.lastStock > 0 ? "text-blue-400" : "text-red-400")} underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-pointer`)}>${escape_html(product.lastStock)}</button>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<span class="text-gray-500">-</span>`);
                }
                $$renderer4.push(`<!--]--></td><td class="py-3 px-4 text-sm text-gray-400">${escape_html(formatDate(product.createdAt))}</td></tr> `);
                if (isExpanded && expandedProducts[product.sku]) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<!--[-->`);
                  const each_array_1 = ensure_array_like(expandedProducts[product.sku]);
                  for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                    let variant = each_array_1[$$index];
                    $$renderer4.push(`<tr class="border-b border-white/5 bg-royal-900/20"><td class="py-2 px-4"></td><td class="py-2 px-4"><span class="font-mono text-sm text-gray-400 pl-4"><span class="text-royal-600 mr-1">└</span> ${escape_html(variant.sku)}</span></td><td class="py-2 px-4">`);
                    if (variant.variantCode) {
                      $$renderer4.push("<!--[-->");
                      Badge($$renderer4, {
                        variant: "default",
                        class: "font-mono text-xs",
                        children: ($$renderer5) => {
                          $$renderer5.push(`<!---->${escape_html(variant.variantCode)}`);
                        }
                      });
                    } else {
                      $$renderer4.push("<!--[!-->");
                      $$renderer4.push(`<span class="text-gray-500">-</span>`);
                    }
                    $$renderer4.push(`<!--]--></td><td class="py-2 px-4">`);
                    Badge($$renderer4, {
                      variant: "default",
                      children: ($$renderer5) => {
                        $$renderer5.push(`<!---->Variante`);
                      }
                    });
                    $$renderer4.push(`<!----></td><td class="py-2 px-4">`);
                    if (variant.productId) {
                      $$renderer4.push("<!--[-->");
                      $$renderer4.push(`<span class="font-mono text-sm">${escape_html(variant.productId)}</span>`);
                    } else {
                      $$renderer4.push("<!--[!-->");
                      $$renderer4.push(`<span class="text-gray-500">-</span>`);
                    }
                    $$renderer4.push(`<!--]--></td><td class="py-2 px-4 text-right">`);
                    if (variant.lastPrice !== null) {
                      $$renderer4.push("<!--[-->");
                      $$renderer4.push(`<span class="font-mono text-sm text-green-400">${escape_html(formatPrice(variant.lastPrice))}</span>`);
                    } else {
                      $$renderer4.push("<!--[!-->");
                      $$renderer4.push(`<span class="text-gray-500">-</span>`);
                    }
                    $$renderer4.push(`<!--]--></td><td class="py-2 px-4 text-right">`);
                    if (variant.lastStock !== null) {
                      $$renderer4.push("<!--[-->");
                      $$renderer4.push(`<button type="button"${attr_class(`font-mono text-sm ${stringify(variant.lastStock > 0 ? "text-blue-400" : "text-red-400")} underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-pointer`)}>${escape_html(variant.lastStock)}</button>`);
                    } else {
                      $$renderer4.push("<!--[!-->");
                      $$renderer4.push(`<span class="text-gray-500">-</span>`);
                    }
                    $$renderer4.push(`<!--]--></td><td class="py-2 px-4 text-sm text-gray-400">${escape_html(formatDate(variant.createdAt))}</td></tr>`);
                  }
                  $$renderer4.push(`<!--]-->`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]-->`);
              }
              $$renderer4.push(`<!--]--></tbody></table></div> <div class="mt-4 pt-4 border-t border-white/10 text-sm text-gray-400"><span>${escape_html(filteredProducts.length)} Produkte</span></div>`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        }
      });
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
