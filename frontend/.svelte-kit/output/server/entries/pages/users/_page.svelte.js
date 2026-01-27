import { s as sanitize_props, a as spread_props, b as slot, g as stringify, e as ensure_array_like, k as bind_props, c as store_get, u as unsubscribe_stores, h as head } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import { $ as escape_html } from "../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { u as users, r as registrations } from "../../../chunks/client2.js";
import { p as permissions } from "../../../chunks/auth.js";
import { a as formatDate } from "../../../chunks/format.js";
import { P as PageHeader, R as Refresh_cw } from "../../../chunks/PageHeader.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { B as Badge } from "../../../chunks/Badge.js";
import { A as Alert } from "../../../chunks/Alert.js";
import { I as Icon, S as Spinner, X } from "../../../chunks/Spinner.js";
import { C as Circle_user } from "../../../chunks/circle-user.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
function Check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$renderer, spread_props([
    { name: "check" },
    $$sanitized_props,
    {
      /**
       * @component @name Check
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
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
function User_plus($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { "cx": "9", "cy": "7", "r": "4" }],
    ["line", { "x1": "19", "x2": "19", "y1": "8", "y2": "14" }],
    ["line", { "x1": "22", "x2": "16", "y1": "11", "y2": "11" }]
  ];
  Icon($$renderer, spread_props([
    { name: "user-plus" },
    $$sanitized_props,
    {
      /**
       * @component @name UserPlus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iNCIgLz4KICA8bGluZSB4MT0iMTkiIHgyPSIxOSIgeTE9IjgiIHkyPSIxNCIgLz4KICA8bGluZSB4MT0iMjIiIHgyPSIxNiIgeTE9IjExIiB5Mj0iMTEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user-plus
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
function Select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id,
      options,
      value = "",
      disabled = false,
      class: className = "",
      onchange
    } = $$props;
    $$renderer2.select(
      {
        id,
        value,
        disabled,
        class: ` w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white outline-none cursor-pointer transition-all focus:border-royal-400/60 focus:ring-4 focus:ring-royal-400/10 disabled:opacity-50 disabled:cursor-not-allowed ${stringify(className)} `,
        onchange
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(options);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let option = each_array[$$index];
          $$renderer3.option({ value: option.value, class: "bg-dark-800" }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(option.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    bind_props($$props, { value });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$permissions", permissions);
    let usersList = [];
    let registrationsList = [];
    let loading = true;
    let error = "";
    let newUsername = "";
    let newPassword = "";
    let newRole = "read";
    let createLoading = false;
    let approvalRoles = {};
    const roleOptions = [
      { value: "read", label: "Read" },
      { value: "write", label: "Write" },
      { value: "admin", label: "Admin" }
    ];
    async function loadData() {
      loading = true;
      error = "";
      try {
        const [users$1, regs] = await Promise.all([users.list(), registrations.list()]);
        usersList = users$1;
        registrationsList = regs;
        regs.forEach((r) => {
          if (!approvalRoles[r.id]) approvalRoles[r.id] = "read";
        });
      } catch (err) {
        error = err instanceof Error ? err.message : "Fehler beim Laden";
      } finally {
        loading = false;
      }
    }
    async function handleRoleChange(userId, role) {
      try {
        await users.setRole(userId, { role });
        loadData();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Fehler beim Aendern");
      }
    }
    async function handleDeleteUser(userId) {
      if (!confirm("User wirklich loeschen?")) return;
      try {
        await users.delete(userId);
        loadData();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Fehler beim Loeschen");
      }
    }
    async function handleApproveRegistration(regId, role) {
      try {
        await registrations.approve(regId, { role });
        loadData();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Fehler beim Genehmigen");
      }
    }
    async function handleRejectRegistration(regId) {
      if (!confirm("Registrierung ablehnen?")) return;
      try {
        await registrations.reject(regId);
        loadData();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Fehler beim Ablehnen");
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("9fk07v", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Users | Actindo Middleware</title>`);
        });
      });
      {
        let actions = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            onclick: loadData,
            disabled: loading,
            children: ($$renderer5) => {
              Refresh_cw($$renderer5, { size: 16, class: loading ? "animate-spin" : "" });
              $$renderer5.push(`<!----> Aktualisieren`);
            }
          });
        };
        PageHeader($$renderer3, {
          title: "Benutzerverwaltung",
          subtitle: "Benutzer und Registrierungen verwalten",
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
      $$renderer3.push(`<!--]--> <div class="grid lg:grid-cols-3 gap-6">`);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
          User_plus($$renderer4, { size: 20 });
          $$renderer4.push(`<!----> Neuer Benutzer</h3> `);
          {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--> <form class="space-y-4"><div><label class="label" for="new-username">Benutzername</label> `);
          Input($$renderer4, {
            id: "new-username",
            placeholder: "username",
            required: true,
            get value() {
              return newUsername;
            },
            set value($$value) {
              newUsername = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div><label class="label" for="new-password">Passwort</label> `);
          Input($$renderer4, {
            id: "new-password",
            type: "password",
            placeholder: "********",
            required: true,
            get value() {
              return newPassword;
            },
            set value($$value) {
              newPassword = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div><label class="label" for="new-role">Rolle</label> `);
          Select($$renderer4, {
            id: "new-role",
            options: roleOptions,
            get value() {
              return newRole;
            },
            set value($$value) {
              newRole = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> `);
          Button($$renderer4, {
            type: "submit",
            disabled: createLoading,
            class: "w-full",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->${escape_html("Benutzer erstellen")}`);
            }
          });
          $$renderer4.push(`<!----></form>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        class: "lg:col-span-2",
        children: ($$renderer4) => {
          $$renderer4.push(`<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
          Circle_user($$renderer4, { size: 20 });
          $$renderer4.push(`<!----> Benutzer (${escape_html(usersList.length)})</h3> `);
          if (loading && usersList.length === 0) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="flex justify-center py-8">`);
            Spinner($$renderer4, {});
            $$renderer4.push(`<!----></div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            if (usersList.length === 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<p class="text-center py-8 text-gray-400">Keine Benutzer vorhanden</p>`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-white/10"><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">Benutzer</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">Rolle</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">Erstellt</th><th class="text-right py-3 px-4 text-xs uppercase tracking-wider text-gray-400">Aktionen</th></tr></thead><tbody><!--[-->`);
              const each_array = ensure_array_like(usersList);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let user = each_array[$$index];
                $$renderer4.push(`<tr class="border-b border-white/5"><td class="py-3 px-4 font-medium">${escape_html(user.username)}</td><td class="py-3 px-4">`);
                Select($$renderer4, {
                  options: roleOptions,
                  value: user.role,
                  onchange: (e) => handleRoleChange(user.id, e.currentTarget.value),
                  class: "w-28"
                });
                $$renderer4.push(`<!----></td><td class="py-3 px-4 text-sm text-gray-400">${escape_html(formatDate(user.createdAt))}</td><td class="py-3 px-4 text-right">`);
                Button($$renderer4, {
                  variant: "danger",
                  size: "small",
                  onclick: () => handleDeleteUser(user.id),
                  children: ($$renderer5) => {
                    Trash_2($$renderer5, { size: 14 });
                  }
                });
                $$renderer4.push(`<!----></td></tr>`);
              }
              $$renderer4.push(`<!--]--></tbody></table></div>`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        }
      });
      $$renderer3.push(`<!----></div> `);
      if (registrationsList.length > 0) {
        $$renderer3.push("<!--[-->");
        Card($$renderer3, {
          class: "mt-6",
          children: ($$renderer4) => {
            $$renderer4.push(`<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
            Badge($$renderer4, {
              variant: "warning",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html(registrationsList.length)}`);
              }
            });
            $$renderer4.push(`<!----> Offene Registrierungen</h3> <div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-white/10"><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">Benutzer</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">Angefragt am</th><th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">Rolle</th><th class="text-right py-3 px-4 text-xs uppercase tracking-wider text-gray-400">Aktionen</th></tr></thead><tbody><!--[-->`);
            const each_array_1 = ensure_array_like(registrationsList);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let reg = each_array_1[$$index_1];
              $$renderer4.push(`<tr class="border-b border-white/5"><td class="py-3 px-4 font-medium">${escape_html(reg.username)}</td><td class="py-3 px-4 text-sm text-gray-400">${escape_html(formatDate(reg.createdAt))}</td><td class="py-3 px-4">`);
              Select($$renderer4, {
                options: roleOptions,
                value: approvalRoles[reg.id] ?? "read",
                onchange: (e) => approvalRoles[reg.id] = e.currentTarget.value,
                class: "w-28"
              });
              $$renderer4.push(`<!----></td><td class="py-3 px-4"><div class="flex justify-end gap-2">`);
              Button($$renderer4, {
                size: "small",
                onclick: () => handleApproveRegistration(reg.id, approvalRoles[reg.id] ?? "read"),
                children: ($$renderer5) => {
                  Check($$renderer5, { size: 14 });
                  $$renderer5.push(`<!----> Genehmigen`);
                }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                variant: "danger",
                size: "small",
                onclick: () => handleRejectRegistration(reg.id),
                children: ($$renderer5) => {
                  X($$renderer5, { size: 14 });
                }
              });
              $$renderer4.push(`<!----></div></td></tr>`);
            }
            $$renderer4.push(`<!--]--></tbody></table></div>`);
          }
        });
      } else {
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
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
