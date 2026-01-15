import { s as sanitize_props, a as spread_props, b as slot, f as store_get, u as unsubscribe_stores, h as head, g as ensure_array_like, d as attr, e as stringify } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { s as settings } from "../../../chunks/client2.js";
import { p as permissions } from "../../../chunks/auth.js";
import { a as formatDate } from "../../../chunks/format.js";
import { P as PageHeader, R as Refresh_cw } from "../../../chunks/PageHeader.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { A as Alert } from "../../../chunks/Alert.js";
import { I as Icon, S as Spinner } from "../../../chunks/Spinner.js";
import { B as Badge } from "../../../chunks/Badge.js";
import { S as Settings } from "../../../chunks/settings.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { $ as escape_html } from "../../../chunks/context.js";
function Globe($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    [
      "path",
      { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }
    ],
    ["path", { "d": "M2 12h20" }]
  ];
  Icon($$renderer, spread_props([
    { name: "globe" },
    $$sanitized_props,
    {
      /**
       * @component @name Globe
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMmExNC41IDE0LjUgMCAwIDAgMCAyMCAxNC41IDE0LjUgMCAwIDAgMC0yMCIgLz4KICA8cGF0aCBkPSJNMiAxMmgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/globe
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
function Key($$renderer, $$props) {
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
        "d": "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"
      }
    ],
    ["path", { "d": "m21 2-9.6 9.6" }],
    ["circle", { "cx": "7.5", "cy": "15.5", "r": "5.5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "key" },
    $$sanitized_props,
    {
      /**
       * @component @name Key
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUuNSA3LjUgMi4zIDIuM2ExIDEgMCAwIDAgMS40IDBsMi4xLTIuMWExIDEgMCAwIDAgMC0xLjRMMTkgNCIgLz4KICA8cGF0aCBkPSJtMjEgMi05LjYgOS42IiAvPgogIDxjaXJjbGUgY3g9IjcuNSIgY3k9IjE1LjUiIHI9IjUuNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/key
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
function Link($$renderer, $$props) {
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
        "d": "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      }
    ],
    [
      "path",
      {
        "d": "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "link" },
    $$sanitized_props,
    {
      /**
       * @component @name Link
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MSIgLz4KICA8cGF0aCBkPSJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/link
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
function Save($$renderer, $$props) {
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
        "d": "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      }
    ],
    ["path", { "d": "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
    ["path", { "d": "M7 3v4a1 1 0 0 0 1 1h7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "save" },
    $$sanitized_props,
    {
      /**
       * @component @name Save
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuMiAzYTIgMiAwIDAgMSAxLjQuNmwzLjggMy44YTIgMiAwIDAgMSAuNiAxLjRWMTlhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yeiIgLz4KICA8cGF0aCBkPSJNMTcgMjF2LTdhMSAxIDAgMCAwLTEtMUg4YTEgMSAwIDAgMC0xIDF2NyIgLz4KICA8cGF0aCBkPSJNNyAzdjRhMSAxIDAgMCAwIDEgMWg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/save
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$permissions", permissions);
    let settings$1 = null;
    let loading = true;
    let saving = false;
    let error = "";
    let success = "";
    let clientId = "";
    let clientSecret = "";
    let tokenEndpoint = "";
    let accessToken = "";
    let refreshToken = "";
    let endpoints = {};
    let navApiUrl = "";
    let navApiToken = "";
    async function loadSettings() {
      loading = true;
      error = "";
      try {
        const data = await settings.get();
        settings$1 = data;
        clientId = data.clientId ?? "";
        clientSecret = data.clientSecret ?? "";
        tokenEndpoint = data.tokenEndpoint ?? "";
        accessToken = data.accessToken ?? "";
        refreshToken = data.refreshToken ?? "";
        endpoints = { ...data.endpoints };
        navApiUrl = data.navApiUrl ?? "";
        navApiToken = data.navApiToken ?? "";
      } catch (err) {
        error = err instanceof Error ? err.message : "Fehler beim Laden";
      } finally {
        loading = false;
      }
    }
    async function handleSave() {
      saving = true;
      error = "";
      success = "";
      try {
        await settings.update({
          clientId: clientId || null,
          clientSecret: clientSecret || null,
          tokenEndpoint: tokenEndpoint || null,
          accessToken: accessToken || null,
          accessTokenExpiresAt: settings$1?.accessTokenExpiresAt ?? null,
          refreshToken: refreshToken || null,
          endpoints,
          navApiUrl: navApiUrl || null,
          navApiToken: navApiToken || null
        });
        success = "Einstellungen gespeichert";
        loadSettings();
      } catch (err) {
        error = err instanceof Error ? err.message : "Fehler beim Speichern";
      } finally {
        saving = false;
      }
    }
    async function handleResetTokens() {
      if (!confirm("OAuth-Tokens wirklich zuruecksetzen?")) return;
      try {
        await settings.resetTokens();
        accessToken = "";
        refreshToken = "";
        success = "Tokens zurueckgesetzt";
        loadSettings();
      } catch (err) {
        error = err instanceof Error ? err.message : "Fehler beim Zuruecksetzen";
      }
    }
    function updateEndpoint(key, value) {
      endpoints = { ...endpoints, [key]: value };
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1i19ct2", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Settings | Actindo Middleware</title>`);
        });
      });
      {
        let actions = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            onclick: loadSettings,
            disabled: loading,
            children: ($$renderer5) => {
              Refresh_cw($$renderer5, { size: 16, class: loading ? "animate-spin" : "" });
              $$renderer5.push(`<!----> Aktualisieren`);
            }
          });
        };
        PageHeader($$renderer3, {
          title: "Einstellungen",
          subtitle: "Actindo OAuth und API-Konfiguration",
          actions
        });
      }
      $$renderer3.push(`<!----> `);
      if (error) {
        $$renderer3.push("<!--[-->");
        Alert($$renderer3, {
          variant: "error",
          class: "mb-6",
          dismissible: true,
          ondismiss: () => error = "",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(error)}`);
          }
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (success) {
        $$renderer3.push("<!--[-->");
        Alert($$renderer3, {
          variant: "success",
          class: "mb-6",
          dismissible: true,
          ondismiss: () => success = "",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(success)}`);
          }
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (loading && !settings$1) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="flex justify-center py-12">`);
        Spinner($$renderer3, { size: "large" });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<div class="grid lg:grid-cols-2 gap-6">`);
        Card($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
            Key($$renderer4, { size: 20 });
            $$renderer4.push(`<!----> OAuth Credentials</h3> <div class="space-y-4"><div><label class="label" for="token-endpoint">Token Endpoint</label> `);
            Input($$renderer4, {
              id: "token-endpoint",
              placeholder: "https://...",
              get value() {
                return tokenEndpoint;
              },
              set value($$value) {
                tokenEndpoint = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div><label class="label" for="client-id">Client ID</label> `);
            Input($$renderer4, {
              id: "client-id",
              placeholder: "Client ID",
              get value() {
                return clientId;
              },
              set value($$value) {
                clientId = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div><label class="label" for="client-secret">Client Secret</label> `);
            Input($$renderer4, {
              id: "client-secret",
              type: "password",
              placeholder: "********",
              get value() {
                return clientSecret;
              },
              set value($$value) {
                clientSecret = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div>`);
          }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold flex items-center gap-2">`);
            Settings($$renderer4, { size: 20 });
            $$renderer4.push(`<!----> Token Status</h3> `);
            Button($$renderer4, {
              variant: "danger",
              size: "small",
              onclick: handleResetTokens,
              children: ($$renderer5) => {
                Trash_2($$renderer5, { size: 14 });
                $$renderer5.push(`<!----> Tokens loeschen`);
              }
            });
            $$renderer4.push(`<!----></div> <div class="space-y-4"><div class="p-4 rounded-xl bg-black/20 border border-white/10"><div class="flex items-center justify-between mb-2"><span class="text-sm text-gray-400">Access Token</span> `);
            if (accessToken) {
              $$renderer4.push("<!--[-->");
              Badge($$renderer4, {
                variant: "success",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Vorhanden`);
                }
              });
            } else {
              $$renderer4.push("<!--[!-->");
              Badge($$renderer4, {
                variant: "error",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Fehlt`);
                }
              });
            }
            $$renderer4.push(`<!--]--></div> `);
            if (settings$1?.accessTokenExpiresAt) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<p class="text-sm text-gray-500">Gueltig bis: ${escape_html(formatDate(settings$1.accessTokenExpiresAt))}</p>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div> <div class="p-4 rounded-xl bg-black/20 border border-white/10"><div class="flex items-center justify-between"><span class="text-sm text-gray-400">Refresh Token</span> `);
            if (refreshToken) {
              $$renderer4.push("<!--[-->");
              Badge($$renderer4, {
                variant: "success",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Vorhanden`);
                }
              });
            } else {
              $$renderer4.push("<!--[!-->");
              Badge($$renderer4, {
                variant: "warning",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Fehlt`);
                }
              });
            }
            $$renderer4.push(`<!--]--></div></div> <div><label class="label" for="access-token">Access Token (manuell)</label> `);
            Input($$renderer4, {
              id: "access-token",
              type: "password",
              placeholder: "Access Token...",
              get value() {
                return accessToken;
              },
              set value($$value) {
                accessToken = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div><label class="label" for="refresh-token">Refresh Token (manuell)</label> `);
            Input($$renderer4, {
              id: "refresh-token",
              type: "password",
              placeholder: "Refresh Token...",
              get value() {
                return refreshToken;
              },
              set value($$value) {
                refreshToken = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div></div>`);
          }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          class: "lg:col-span-2",
          children: ($$renderer4) => {
            $$renderer4.push(`<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
            Globe($$renderer4, { size: 20 });
            $$renderer4.push(`<!----> NAV API Einstellungen</h3> <div class="grid sm:grid-cols-2 gap-4"><div><label class="label" for="nav-api-url">NAV API URL</label> `);
            Input($$renderer4, {
              id: "nav-api-url",
              placeholder: "https://notify.schalke04.de/nav/test/navapi",
              get value() {
                return navApiUrl;
              },
              set value($$value) {
                navApiUrl = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> <p class="text-xs text-gray-500 mt-1">Endpoint fuer NAV API Aufrufe</p></div> <div><label class="label" for="nav-api-token">NAV API Token</label> `);
            Input($$renderer4, {
              id: "nav-api-token",
              type: "password",
              placeholder: "Bearer Token...",
              get value() {
                return navApiToken;
              },
              set value($$value) {
                navApiToken = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----> <p class="text-xs text-gray-500 mt-1">Bearer Token fuer die Authentifizierung</p></div></div>`);
          }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          class: "lg:col-span-2",
          children: ($$renderer4) => {
            $$renderer4.push(`<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
            Link($$renderer4, { size: 20 });
            $$renderer4.push(`<!----> Actindo Endpoints</h3> <div class="grid sm:grid-cols-2 gap-4"><!--[-->`);
            const each_array = ensure_array_like(Object.entries(endpoints));
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let [key, value] = each_array[$$index];
              $$renderer4.push(`<div><label class="label"${attr("for", `endpoint-${stringify(key)}`)}>${escape_html(key)}</label> `);
              Input($$renderer4, {
                id: `endpoint-${stringify(key)}`,
                value,
                oninput: (e) => updateEndpoint(key, e.currentTarget.value),
                placeholder: "https://..."
              });
              $$renderer4.push(`<!----></div>`);
            }
            $$renderer4.push(`<!--]--></div>`);
          }
        });
        $$renderer3.push(`<!----></div> <div class="flex justify-end mt-6">`);
        Button($$renderer3, {
          onclick: handleSave,
          disabled: saving,
          children: ($$renderer4) => {
            Save($$renderer4, { size: 16 });
            $$renderer4.push(`<!----> ${escape_html(saving ? "Speichere..." : "Einstellungen speichern")}`);
          }
        });
        $$renderer3.push(`<!----></div>`);
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
