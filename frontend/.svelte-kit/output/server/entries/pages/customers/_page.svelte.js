import { h as head, e as ensure_array_like } from "../../../chunks/index2.js";
import { c as customers } from "../../../chunks/client2.js";
import { a as formatDate } from "../../../chunks/format.js";
import { P as PageHeader, R as Refresh_cw } from "../../../chunks/PageHeader.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { A as Alert } from "../../../chunks/Alert.js";
import { S as Spinner } from "../../../chunks/Spinner.js";
import { S as Search } from "../../../chunks/search.js";
import { U as Users } from "../../../chunks/users.js";
import { $ as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let customers$1 = [];
    let loading = true;
    let error = "";
    let search = "";
    let filteredCustomers = search.trim() ? customers$1.filter((c) => c.debtorNumber.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())) : customers$1;
    async function loadCustomers() {
      loading = true;
      error = "";
      try {
        customers$1 = await customers.list();
      } catch (err) {
        error = err instanceof Error ? err.message : "Fehler beim Laden";
      } finally {
        loading = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("hmlmb2", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Customers | Actindo Middleware</title>`);
        });
      });
      {
        let actions = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            onclick: loadCustomers,
            disabled: loading,
            children: ($$renderer5) => {
              Refresh_cw($$renderer5, { size: 16, class: loading ? "animate-spin" : "" });
              $$renderer5.push(`<!----> Aktualisieren`);
            }
          });
        };
        PageHeader($$renderer3, {
          title: "Kunden",
          subtitle: "Uebersicht aller erstellten Kunden",
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
            placeholder: "Suche nach Debitorennr. oder Name...",
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
          if (loading && customers$1.length === 0) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="flex justify-center py-12">`);
            Spinner($$renderer4, {});
            $$renderer4.push(`<!----></div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            if (filteredCustomers.length === 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="text-center py-12 text-gray-400">`);
              Users($$renderer4, { size: 48, class: "mx-auto mb-4 opacity-50" });
              $$renderer4.push(`<!----> <p>${escape_html(search ? "Keine Kunden gefunden" : "Noch keine Kunden vorhanden")}</p></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-white/10"><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Debitorennr.</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Name</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Actindo ID</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Erstellt</th></tr></thead><tbody><!--[-->`);
              const each_array = ensure_array_like(filteredCustomers);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let customer = each_array[$$index];
                $$renderer4.push(`<tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="py-3 px-4"><span class="font-mono text-sm text-royal-300">${escape_html(customer.debtorNumber)}</span></td><td class="py-3 px-4">${escape_html(customer.name || "-")}</td><td class="py-3 px-4">`);
                if (customer.customerId) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<span class="font-mono text-sm">${escape_html(customer.customerId)}</span>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<span class="text-gray-500">-</span>`);
                }
                $$renderer4.push(`<!--]--></td><td class="py-3 px-4 text-sm text-gray-400">${escape_html(formatDate(customer.createdAt))}</td></tr>`);
              }
              $$renderer4.push(`<!--]--></tbody></table></div> <div class="mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">${escape_html(filteredCustomers.length)} von ${escape_html(customers$1.length)} Kunden</div>`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        }
      });
      $$renderer3.push(`<!---->`);
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
