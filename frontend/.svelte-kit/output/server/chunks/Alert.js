import { s as sanitize_props, a as spread_props, b as slot, c as attr_class, e as stringify } from "./index2.js";
import { I as Icon } from "./Spinner.js";
function X($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M18 6 6 18" }],
    ["path", { "d": "m6 6 12 12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "x" },
    $$sanitized_props,
    {
      /**
       * @component @name X
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
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
function Alert($$renderer, $$props) {
  let {
    variant = "info",
    dismissible = false,
    class: className = "",
    ondismiss,
    children
  } = $$props;
  const variantClasses = {
    error: "bg-red-500/10 border-red-500/40 text-red-400",
    success: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
    warning: "bg-amber-500/10 border-amber-500/40 text-amber-400",
    info: "bg-royal-500/10 border-royal-500/40 text-royal-300"
  };
  $$renderer.push(`<div${attr_class(` flex items-start gap-3 px-4 py-3 rounded-xl border animate-fade-in ${stringify(variantClasses[variant])} ${stringify(className)} `)} role="alert"><div class="flex-1 text-sm">`);
  children($$renderer);
  $$renderer.push(`<!----></div> `);
  if (dismissible) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<button type="button" class="p-1 rounded-lg hover:bg-white/10 transition-colors">`);
    X($$renderer, { size: 16 });
    $$renderer.push(`<!----></button>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
export {
  Alert as A,
  X
};
