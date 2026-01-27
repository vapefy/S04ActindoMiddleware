import { s as sanitize_props, a as spread_props, b as slot, c as store_get, u as unsubscribe_stores, e as ensure_array_like, d as attr, f as attr_class, g as stringify, h as head } from "../../chunks/index2.js";
import { _ as getContext, $ as escape_html } from "../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { p as permissions, c as currentUser, a as authStore, i as isAuthenticated } from "../../chunks/auth.js";
import { d as dashboardStore } from "../../chunks/dashboard.js";
import { B as Button } from "../../chunks/Button.js";
import { M as Modal, A as Activity } from "../../chunks/Modal.js";
import { C as Chevron_down, P as Package } from "../../chunks/package.js";
import { I as Icon, S as Spinner } from "../../chunks/Spinner.js";
import { U as Users } from "../../chunks/users.js";
import { A as Arrow_right_left } from "../../chunks/arrow-right-left.js";
import { C as Circle_user } from "../../chunks/circle-user.js";
import { S as Settings } from "../../chunks/settings.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function Layout_dashboard($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      { "width": "7", "height": "9", "x": "3", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "5", "x": "14", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "9", "x": "14", "y": "12", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "5", "x": "3", "y": "16", "rx": "1" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "layout-dashboard" },
    $$sanitized_props,
    {
      /**
       * @component @name LayoutDashboard
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
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
function Nav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$dashboardStore", dashboardStore).summary;
    let perms = store_get($$store_subs ??= {}, "$permissions", permissions);
    let user = store_get($$store_subs ??= {}, "$currentUser", currentUser);
    let passwordModalOpen = false;
    let currentPassword = "";
    let newPassword = "";
    let confirmPassword = "";
    let passwordError = "";
    let passwordSuccess = false;
    let passwordLoading = false;
    const links = [
      { href: "/", label: "Dashboard", icon: Layout_dashboard },
      { href: "/products", label: "Products", icon: Package },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/jobs", label: "Jobs", icon: Activity },
      {
        href: "/sync",
        label: "Sync",
        icon: Arrow_right_left,
        writeOnly: true
      },
      {
        href: "/users",
        label: "Users",
        icon: Circle_user,
        adminOnly: true
      },
      {
        href: "/settings",
        label: "Settings",
        icon: Settings,
        adminOnly: true
      }
    ];
    function isActive(href) {
      if (href === "/") return store_get($$store_subs ??= {}, "$page", page).url.pathname === "/";
      return store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(href);
    }
    async function handleChangePassword() {
      passwordError = "";
      passwordSuccess = false;
      {
        passwordError = "Bitte alle Felder ausfuellen";
        return;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<nav class="sticky top-0 z-40 glass border-b border-white/5"><div class="max-w-7xl mx-auto px-4 sm:px-6"><div class="flex items-center justify-between h-16 gap-4"><div class="flex-shrink-0"><span class="text-lg font-bold tracking-wider uppercase text-white">Actindo <span class="text-royal-400">Middleware</span></span></div> <div class="hidden md:flex items-center gap-1"><!--[-->`);
      const each_array = ensure_array_like(links);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let link = each_array[$$index];
        if ((!link.adminOnly || perms.isAdmin) && (!link.writeOnly || perms.canWrite)) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<a${attr("href", link.href)}${attr_class(` flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide transition-all ${stringify(isActive(link.href) ? "bg-royal-600/30 text-white border border-royal-600/50" : "text-gray-400 hover:text-white hover:bg-white/5")} `)}><!---->`);
          link.icon?.($$renderer3, { size: 16 });
          $$renderer3.push(`<!----> ${escape_html(link.label)}</a>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></div> `);
      if (user) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="relative user-dropdown"><button type="button" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-royal-400/20 to-royal-600/20 border border-royal-400/30 hover:from-royal-400/30 hover:to-royal-600/30 transition-all cursor-pointer"><span class="w-2 h-2 rounded-full bg-royal-400 animate-pulse"></span> <span class="text-sm font-medium">${escape_html(user.username)}</span> `);
        Chevron_down($$renderer3, {
          size: 14,
          class: `transition-transform ${stringify("")}`
        });
        $$renderer3.push(`<!----></button> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div></div> <div class="md:hidden border-t border-white/5"><div class="flex overflow-x-auto px-4 py-2 gap-2"><!--[-->`);
      const each_array_1 = ensure_array_like(links);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let link = each_array_1[$$index_1];
        if ((!link.adminOnly || perms.isAdmin) && (!link.writeOnly || perms.canWrite)) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<a${attr("href", link.href)}${attr_class(` flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide whitespace-nowrap transition-all ${stringify(isActive(link.href) ? "bg-royal-600/30 text-white border border-royal-600/50" : "text-gray-400 hover:text-white hover:bg-white/5")} `)}><!---->`);
          link.icon?.($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> ${escape_html(link.label)}</a>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></div></div></nav> `);
      Modal($$renderer3, {
        title: "Passwort aendern",
        get open() {
          return passwordModalOpen;
        },
        set open($$value) {
          passwordModalOpen = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="space-y-4">`);
          if (passwordSuccess) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center">Passwort erfolgreich geaendert!</div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            if (passwordError) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">${escape_html(passwordError)}</div>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> <div><label for="currentPassword" class="block text-sm font-medium text-gray-400 mb-1">Aktuelles Passwort</label> <input type="password" id="currentPassword"${attr("value", currentPassword)} class="w-full px-4 py-2 rounded-lg bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-royal-500" placeholder="Aktuelles Passwort eingeben"/></div> <div><label for="newPassword" class="block text-sm font-medium text-gray-400 mb-1">Neues Passwort</label> <input type="password" id="newPassword"${attr("value", newPassword)} class="w-full px-4 py-2 rounded-lg bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-royal-500" placeholder="Neues Passwort eingeben"/></div> <div><label for="confirmPassword" class="block text-sm font-medium text-gray-400 mb-1">Passwort wiederholen</label> <input type="password" id="confirmPassword"${attr("value", confirmPassword)} class="w-full px-4 py-2 rounded-lg bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-royal-500" placeholder="Neues Passwort wiederholen"/></div> <div class="flex justify-end gap-3 pt-2">`);
            Button($$renderer4, {
              variant: "ghost",
              onclick: () => passwordModalOpen = false,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Abbrechen`);
              }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              onclick: handleChangePassword,
              disabled: passwordLoading,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html("Passwort aendern")}`);
              }
            });
            $$renderer4.push(`<!----></div>`);
          }
          $$renderer4.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!---->`);
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
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    const publicRoutes = ["/login", "/register"];
    let initialized = store_get($$store_subs ??= {}, "$authStore", authStore).initialized;
    let authenticated = store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated);
    let currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    let isPublicRoute = publicRoutes.some((r) => currentPath.startsWith(r));
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Actindo Middleware</title>`);
      });
    });
    if (!initialized) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="min-h-screen flex items-center justify-center">`);
      Spinner($$renderer2, { size: "large" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (isPublicRoute) {
        $$renderer2.push("<!--[-->");
        children($$renderer2);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (authenticated) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="min-h-screen flex flex-col">`);
          Nav($$renderer2);
          $$renderer2.push(`<!----> <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">`);
          children($$renderer2);
          $$renderer2.push(`<!----></main> <footer class="py-4 text-center text-sm text-gray-500 border-t border-white/5">Powered by FC Schalke 04 | Software &amp; Development</footer></div>`);
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
  _layout as default
};
