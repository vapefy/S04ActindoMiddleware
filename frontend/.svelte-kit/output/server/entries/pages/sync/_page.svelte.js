import { s as sanitize_props, a as spread_props, b as slot, c as store_get, h as head, f as attr_class, g as stringify, e as ensure_array_like, d as attr, u as unsubscribe_stores } from "../../../chunks/index2.js";
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
import { P as Package, C as Chevron_down } from "../../../chunks/package.js";
import { U as Users } from "../../../chunks/users.js";
import { A as Arrow_right_left } from "../../../chunks/arrow-right-left.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { $ as escape_html } from "../../../chunks/context.js";
function Circle_alert($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
    [
      "line",
      { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
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
function Eraser($$renderer, $$props) {
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
        "d": "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"
      }
    ],
    ["path", { "d": "M22 21H7" }],
    ["path", { "d": "m5 11 9 9" }]
  ];
  Icon($$renderer, spread_props([
    { name: "eraser" },
    $$sanitized_props,
    {
      /**
       * @component @name Eraser
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNyAyMS00LjMtNC4zYy0xLTEtMS0yLjUgMC0zLjRsOS42LTkuNmMxLTEgMi41LTEgMy40IDBsNS42IDUuNmMxIDEgMSAyLjUgMCAzLjRMMTMgMjEiIC8+CiAgPHBhdGggZD0iTTIyIDIxSDciIC8+CiAgPHBhdGggZD0ibTUgMTEgOSA5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eraser
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
function Eye_off($$renderer, $$props) {
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
        "d": "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
      }
    ],
    ["path", { "d": "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
    [
      "path",
      {
        "d": "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
      }
    ],
    ["path", { "d": "m2 2 20 20" }]
  ];
  Icon($$renderer, spread_props([
    { name: "eye-off" },
    $$sanitized_props,
    {
      /**
       * @component @name EyeOff
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAuNzMzIDUuMDc2YTEwLjc0NCAxMC43NDQgMCAwIDEgMTEuMjA1IDYuNTc1IDEgMSAwIDAgMSAwIC42OTYgMTAuNzQ3IDEwLjc0NyAwIDAgMS0xLjQ0NCAyLjQ5IiAvPgogIDxwYXRoIGQ9Ik0xNC4wODQgMTQuMTU4YTMgMyAwIDAgMS00LjI0Mi00LjI0MiIgLz4KICA8cGF0aCBkPSJNMTcuNDc5IDE3LjQ5OWExMC43NSAxMC43NSAwIDAgMS0xNS40MTctNS4xNTEgMSAxIDAgMCAxIDAtLjY5NiAxMC43NSAxMC43NSAwIDAgMSA0LjQ0Ni01LjE0MyIgLz4KICA8cGF0aCBkPSJtMiAyIDIwIDIwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye-off
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
function Eye($$renderer, $$props) {
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
        "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "eye" },
    $$sanitized_props,
    {
      /**
       * @component @name Eye
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
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
function Info($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "info" },
    $$sanitized_props,
    {
      /**
       * @component @name Info
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
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
function Zap($$renderer, $$props) {
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
        "d": "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "zap" },
    $$sanitized_props,
    {
      /**
       * @component @name Zap
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxNGExIDEgMCAwIDEtLjc4LTEuNjNsOS45LTEwLjJhLjUuNSAwIDAgMSAuODYuNDZsLTEuOTIgNi4wMkExIDEgMCAwIDAgMTMgMTBoN2ExIDEgMCAwIDEgLjc4IDEuNjNsLTkuOSAxMC4yYS41LjUgMCAwIDEtLjg2LS40NmwxLjkyLTYuMDJBMSAxIDAgMCAwIDExIDE0eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/zap
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
    selectedCustomerIds: /* @__PURE__ */ new Set(),
    expandedProducts: /* @__PURE__ */ new Set(),
    hideSynced: true
    // Default to hiding synced products
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
          selectedProductSkus: /* @__PURE__ */ new Set(),
          expandedProducts: /* @__PURE__ */ new Set()
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
        const items = needsSyncOnly ? s.products.items.filter((p) => p.needsSync || p.status === "NeedsSync") : s.products.items;
        const skus = [];
        for (const item of items) {
          skus.push(item.sku);
          if (item.variants) {
            for (const v of item.variants) {
              if (!needsSyncOnly || v.status === "NeedsSync") {
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
      update((s) => ({ ...s, selectedProductSkus: /* @__PURE__ */ new Set() }));
    },
    toggleProductExpanded(sku) {
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
        const masters = s.products.items.filter((p) => p.variantStatus === "master" && p.variants.length > 0).map((p) => p.sku);
        return { ...s, expandedProducts: new Set(masters) };
      });
    },
    collapseAllProducts() {
      update((s) => ({ ...s, expandedProducts: /* @__PURE__ */ new Set() }));
    },
    toggleHideSynced() {
      update((s) => ({ ...s, hideSynced: !s.hideSynced }));
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
    async clearSelectedProductIds() {
      if (currentState.selectedProductSkus.size === 0) return { cleared: 0 };
      update((s) => ({ ...s, syncing: true, error: null }));
      try {
        const result = await sync.clearProductIds([...currentState.selectedProductSkus]);
        await this.loadProducts();
        update((s) => ({ ...s, syncing: false }));
        return result;
      } catch (e) {
        update((s) => ({
          ...s,
          syncing: false,
          error: e instanceof Error ? e.message : "Fehler beim Leeren der IDs"
        }));
        throw e;
      }
    },
    async forceSyncSelectedProducts() {
      if (currentState.selectedProductSkus.size === 0) return { synced: 0 };
      update((s) => ({ ...s, syncing: true, error: null }));
      try {
        const result = await sync.forceSyncProducts([...currentState.selectedProductSkus]);
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
        selectedCustomerIds: /* @__PURE__ */ new Set(),
        expandedProducts: /* @__PURE__ */ new Set(),
        hideSynced: true
      });
    }
  };
}
const syncStore = createSyncStore();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$permissions", permissions);
    let syncState = store_get($$store_subs ??= {}, "$syncStore", syncStore);
    let successMessage = "";
    async function handleSyncSelected() {
      try {
        let result;
        if (syncState.tab === "products") {
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
        if (syncState.tab === "products") {
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
      if (syncState.tab === "products") {
        syncStore.selectAllProducts(true);
      } else {
        syncStore.selectAllCustomers(true);
      }
    }
    function handleClearSelection() {
      if (syncState.tab === "products") {
        syncStore.clearProductSelection();
      } else {
        syncStore.clearCustomerSelection();
      }
    }
    async function handleClearIds() {
      if (!confirm("Actindo-IDs der ausgewaehlten Produkte in NAV leeren?")) return;
      try {
        const result = await syncStore.clearSelectedProductIds();
        if (result.message) {
          successMessage = result.message;
        } else {
          successMessage = `Actindo-IDs von ${result.cleared} Produkt(en) geleert`;
        }
      } catch (e) {
      }
    }
    async function handleForceSync() {
      if (!confirm("Actindo-IDs der ausgewaehlten Produkte in NAV ueberschreiben?")) return;
      try {
        const result = await syncStore.forceSyncSelectedProducts();
        if (result.message) {
          successMessage = result.message;
        } else {
          successMessage = `${result.synced} Produkt(e) synchronisiert`;
        }
      } catch (e) {
      }
    }
    let selectedCount = syncState.tab === "products" ? syncState.selectedProductSkus.size : syncState.selectedCustomerIds.size;
    let needsSyncCount = syncState.tab === "products" ? syncState.products?.needsSync ?? 0 : syncState.customers?.needsSync ?? 0;
    let orphanCount = syncState.products?.orphaned ?? 0;
    let mismatchCount = syncState.products?.mismatch ?? 0;
    let filteredProductItems = syncState.hideSynced && syncState.products ? syncState.products.items.filter((p) => p.status !== "Synced") : syncState.products?.items ?? [];
    function getStatusBadge(status) {
      switch (status) {
        case "Synced":
          return { variant: "success", label: "Sync" };
        case "NeedsSync":
          return { variant: "warning", label: "Sync fehlt" };
        case "Mismatch":
          return { variant: "error", label: "Falsche ID" };
        case "Orphan":
          return { variant: "error", label: "Verwaist" };
        case "ActindoOnly":
          return { variant: "info", label: "Nur Actindo" };
        case "NavOnly":
          return { variant: "secondary", label: "Nur NAV" };
        default:
          return { variant: "default", label: status };
      }
    }
    function getStatusIcon(status) {
      switch (status) {
        case "Synced":
          return { icon: Circle_check, class: "text-green-400" };
        case "NeedsSync":
          return { icon: Triangle_alert, class: "text-amber-400" };
        case "Mismatch":
          return { icon: Circle_alert, class: "text-red-400" };
        case "Orphan":
          return { icon: Trash_2, class: "text-red-400" };
        case "ActindoOnly":
          return { icon: Info, class: "text-blue-400" };
        case "NavOnly":
          return { icon: Circle_x, class: "text-gray-400" };
        default:
          return { icon: Info, class: "text-gray-400" };
      }
    }
    function getPresenceIcon(present) {
      return present ? { icon: Circle_check, class: "text-green-400" } : { icon: Circle_x, class: "text-gray-500" };
    }
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
          disabled: syncState.loading,
          children: ($$renderer4) => {
            Refresh_cw($$renderer4, { size: 16, class: syncState.loading ? "animate-spin" : "" });
            $$renderer4.push(`<!----> Aktualisieren`);
          }
        });
      };
      PageHeader($$renderer2, {
        title: "Sync Status",
        subtitle: "3-Wege-Vergleich: Actindo, NAV und Middleware",
        actions
      });
    }
    $$renderer2.push(`<!----> `);
    if (syncState.error) {
      $$renderer2.push("<!--[-->");
      Alert($$renderer2, {
        variant: "error",
        class: "mb-6",
        dismissible: true,
        ondismiss: () => syncState.error = null,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(syncState.error)}`);
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
    if (syncState.configured === false) {
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
      if (syncState.configured === null) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex justify-center py-12">`);
        Spinner($$renderer2, { size: "large" });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex gap-2 mb-6"><button type="button"${attr_class(`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${stringify(syncState.tab === "products" ? "bg-royal-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white")}`)}>`);
        Package($$renderer2, { size: 18 });
        $$renderer2.push(`<!----> Produkte `);
        if (syncState.products) {
          $$renderer2.push("<!--[-->");
          if (syncState.products.needsSync > 0) {
            $$renderer2.push("<!--[-->");
            Badge($$renderer2, {
              variant: "warning",
              children: ($$renderer3) => {
                $$renderer3.push(`<!---->${escape_html(syncState.products.needsSync)}`);
              }
            });
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (syncState.products.mismatch > 0) {
            $$renderer2.push("<!--[-->");
            Badge($$renderer2, {
              variant: "error",
              children: ($$renderer3) => {
                $$renderer3.push(`<!---->${escape_html(syncState.products.mismatch)}`);
              }
            });
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (syncState.products.orphaned > 0) {
            $$renderer2.push("<!--[-->");
            Badge($$renderer2, {
              variant: "error",
              children: ($$renderer3) => {
                $$renderer3.push(`<!---->${escape_html(syncState.products.orphaned)}`);
              }
            });
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></button> <button type="button"${attr_class(`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${stringify(syncState.tab === "customers" ? "bg-royal-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white")}`)}>`);
        Users($$renderer2, { size: 18 });
        $$renderer2.push(`<!----> Kunden `);
        if (syncState.customers) {
          $$renderer2.push("<!--[-->");
          Badge($$renderer2, {
            variant: syncState.customers.needsSync > 0 ? "warning" : "success",
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->${escape_html(syncState.customers.needsSync)}`);
            }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></button></div> `);
        if (syncState.tab === "products" && syncState.products) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">`);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold text-blue-400">${escape_html(syncState.products.totalInActindo)}</p> <p class="text-sm text-gray-400">In Actindo</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold">${escape_html(syncState.products.totalInNav)}</p> <p class="text-sm text-gray-400">In NAV</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold">${escape_html(syncState.products.totalInMiddleware)}</p> <p class="text-sm text-gray-400">In Middleware</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold text-green-400">${escape_html(syncState.products.synced)}</p> <p class="text-sm text-gray-400">Synchronisiert</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold text-amber-400">${escape_html(syncState.products.needsSync)}</p> <p class="text-sm text-gray-400">Sync fehlt</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold text-red-400">${escape_html(syncState.products.mismatch)}</p> <p class="text-sm text-gray-400">Falsche ID</p>`);
            }
          });
          $$renderer2.push(`<!----> `);
          Card($$renderer2, {
            class: "text-center",
            children: ($$renderer3) => {
              $$renderer3.push(`<p class="text-3xl font-bold text-red-400">${escape_html(syncState.products.orphaned)}</p> <p class="text-sm text-gray-400">Verwaist</p>`);
            }
          });
          $$renderer2.push(`<!----></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (syncState.tab === "customers" && syncState.customers) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">`);
            Card($$renderer2, {
              class: "text-center",
              children: ($$renderer3) => {
                $$renderer3.push(`<p class="text-3xl font-bold">${escape_html(syncState.customers.totalInMiddleware)}</p> <p class="text-sm text-gray-400">In Middleware</p>`);
              }
            });
            $$renderer2.push(`<!----> `);
            Card($$renderer2, {
              class: "text-center",
              children: ($$renderer3) => {
                $$renderer3.push(`<p class="text-3xl font-bold">${escape_html(syncState.customers.totalInNav)}</p> <p class="text-sm text-gray-400">In NAV</p>`);
              }
            });
            $$renderer2.push(`<!----> `);
            Card($$renderer2, {
              class: "text-center",
              children: ($$renderer3) => {
                $$renderer3.push(`<p class="text-3xl font-bold text-green-400">${escape_html(syncState.customers.synced)}</p> <p class="text-sm text-gray-400">Synchronisiert</p>`);
              }
            });
            $$renderer2.push(`<!----> `);
            Card($$renderer2, {
              class: "text-center",
              children: ($$renderer3) => {
                $$renderer3.push(`<p class="text-3xl font-bold text-amber-400">${escape_html(syncState.customers.needsSync)}</p> <p class="text-sm text-gray-400">Ausstehend</p>`);
              }
            });
            $$renderer2.push(`<!----></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--> `);
        if (syncState.tab === "products" && mismatchCount > 0) {
          $$renderer2.push("<!--[-->");
          Alert($$renderer2, {
            variant: "error",
            class: "mb-6",
            children: ($$renderer3) => {
              $$renderer3.push(`<strong>ID Konflikt:</strong> ${escape_html(mismatchCount)} Produkt(e) haben in NAV eine falsche Actindo-ID eingetragen.
			Die IDs in NAV sollten korrigiert werden.`);
            }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (syncState.tab === "products" && orphanCount > 0) {
          $$renderer2.push("<!--[-->");
          Alert($$renderer2, {
            variant: "warning",
            class: "mb-6",
            children: ($$renderer3) => {
              $$renderer3.push(`<strong>Achtung:</strong> ${escape_html(orphanCount)} Produkt(e) existieren in NAV/Middleware aber nicht mehr in Actindo.
			Diese Actindo-IDs sollten in NAV bereinigt werden.`);
            }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (syncState.tab === "products" && (needsSyncCount > 0 || selectedCount > 0)) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex flex-wrap gap-2 mb-6">`);
          if (needsSyncCount > 0) {
            $$renderer2.push("<!--[-->");
            Button($$renderer2, {
              variant: "ghost",
              onclick: handleSelectAllNeedsSync,
              children: ($$renderer3) => {
                $$renderer3.push(`<!---->Alle ausstehenden auswaehlen (${escape_html(needsSyncCount)})`);
              }
            });
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
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
              disabled: syncState.syncing,
              children: ($$renderer3) => {
                Arrow_right_left($$renderer3, { size: 16 });
                $$renderer3.push(`<!----> ${escape_html(syncState.syncing ? "Synchronisiere..." : `Sync zu NAV (${selectedCount})`)}`);
              }
            });
            $$renderer2.push(`<!----> `);
            Button($$renderer2, {
              variant: "danger",
              onclick: handleClearIds,
              disabled: syncState.syncing,
              children: ($$renderer3) => {
                Eraser($$renderer3, { size: 16 });
                $$renderer3.push(`<!----> ${escape_html(syncState.syncing ? "Leere..." : "Actindo ID leeren")}`);
              }
            });
            $$renderer2.push(`<!----> `);
            Button($$renderer2, {
              variant: "primary",
              onclick: handleForceSync,
              disabled: syncState.syncing,
              children: ($$renderer3) => {
                Zap($$renderer3, { size: 16 });
                $$renderer3.push(`<!----> ${escape_html(syncState.syncing ? "Synchronisiere..." : "Actindo ID Sync")}`);
              }
            });
            $$renderer2.push(`<!---->`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (needsSyncCount > 0) {
            $$renderer2.push("<!--[-->");
            Button($$renderer2, {
              variant: "ghost",
              onclick: handleSyncAll,
              disabled: syncState.syncing,
              children: ($$renderer3) => {
                Arrow_right_left($$renderer3, { size: 16 });
                $$renderer3.push(`<!----> ${escape_html(syncState.syncing ? "Synchronisiere..." : "Alle synchronisieren")}`);
              }
            });
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (syncState.tab === "customers" && needsSyncCount > 0) {
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
                disabled: syncState.syncing,
                children: ($$renderer3) => {
                  Arrow_right_left($$renderer3, { size: 16 });
                  $$renderer3.push(`<!----> ${escape_html(syncState.syncing ? "Synchronisiere..." : `Auswahl synchronisieren (${selectedCount})`)}`);
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
              disabled: syncState.syncing,
              children: ($$renderer3) => {
                Arrow_right_left($$renderer3, { size: 16 });
                $$renderer3.push(`<!----> ${escape_html(syncState.syncing ? "Synchronisiere..." : "Alle synchronisieren")}`);
              }
            });
            $$renderer2.push(`<!----></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--> `);
        if (syncState.tab === "products") {
          $$renderer2.push("<!--[-->");
          if (syncState.loading && !syncState.products) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="flex justify-center py-12">`);
            Spinner($$renderer2, {});
            $$renderer2.push(`<!----></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (syncState.products && syncState.products.items.length > 0) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<div class="flex justify-between items-center mb-4"><div class="flex gap-2">`);
              if (syncState.products.items.some((p) => p.variantStatus === "master" && p.variants.length > 0)) {
                $$renderer2.push("<!--[-->");
                Button($$renderer2, {
                  variant: "ghost",
                  size: "small",
                  onclick: () => syncStore.expandAllProducts(),
                  children: ($$renderer3) => {
                    Chevron_down($$renderer3, { size: 14 });
                    $$renderer3.push(`<!----> Alle aufklappen`);
                  }
                });
                $$renderer2.push(`<!----> `);
                Button($$renderer2, {
                  variant: "ghost",
                  size: "small",
                  onclick: () => syncStore.collapseAllProducts(),
                  children: ($$renderer3) => {
                    Chevron_right($$renderer3, { size: 14 });
                    $$renderer3.push(`<!----> Alle zuklappen`);
                  }
                });
                $$renderer2.push(`<!---->`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]--></div> `);
              Button($$renderer2, {
                variant: "ghost",
                size: "small",
                onclick: () => syncStore.toggleHideSynced(),
                title: syncState.hideSynced ? "Synchronisierte anzeigen" : "Synchronisierte ausblenden",
                children: ($$renderer3) => {
                  if (syncState.hideSynced) {
                    $$renderer3.push("<!--[-->");
                    Eye($$renderer3, { size: 14 });
                    $$renderer3.push(`<!----> Sync anzeigen (${escape_html(syncState.products.synced)})`);
                  } else {
                    $$renderer3.push("<!--[!-->");
                    Eye_off($$renderer3, { size: 14 });
                    $$renderer3.push(`<!----> Sync ausblenden`);
                  }
                  $$renderer3.push(`<!--]-->`);
                }
              });
              $$renderer2.push(`<!----></div> `);
              Card($$renderer2, {
                children: ($$renderer3) => {
                  $$renderer3.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-white/10 text-left text-sm text-gray-400"><th class="pb-3 pr-2 w-8"></th><th class="pb-3 pr-4 w-10"></th><th class="pb-3 pr-4">SKU</th><th class="pb-3 pr-4">Name</th><th class="pb-3 pr-4">Typ</th><th class="pb-3 pr-2 text-center" title="In Actindo">Act</th><th class="pb-3 pr-2 text-center" title="In NAV">NAV</th><th class="pb-3 pr-2 text-center" title="In Middleware">MW</th><th class="pb-3 pr-4 text-right">Actindo ID</th><th class="pb-3 pr-4 text-right">NAV Actindo ID</th><th class="pb-3 text-center">Status</th></tr></thead><tbody><!--[-->`);
                  const each_array = ensure_array_like(filteredProductItems);
                  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
                    let product = each_array[$$index_1];
                    const hasVariants = product.variantStatus === "master" && product.variants.length > 0;
                    const isExpanded = syncState.expandedProducts.has(product.sku);
                    const statusBadge = getStatusBadge(product.status);
                    getStatusIcon(product.status);
                    const actindoPresence = getPresenceIcon(product.inActindo);
                    const navPresence = getPresenceIcon(product.inNav);
                    const mwPresence = getPresenceIcon(product.inMiddleware);
                    $$renderer3.push(`<tr${attr_class(`border-b border-white/5 hover:bg-white/5 transition-colors ${stringify(product.status === "NeedsSync" ? "bg-amber-500/5" : "")} ${stringify(product.status === "Mismatch" ? "bg-red-500/10" : "")} ${stringify(product.status === "Orphan" ? "bg-red-500/5" : "")}`)}><td class="py-3 pr-2">`);
                    if (hasVariants) {
                      $$renderer3.push("<!--[-->");
                      $$renderer3.push(`<button type="button" class="p-1 hover:bg-white/10 rounded">`);
                      if (isExpanded) {
                        $$renderer3.push("<!--[-->");
                        Chevron_down($$renderer3, { size: 16, class: "text-gray-400" });
                      } else {
                        $$renderer3.push("<!--[!-->");
                        Chevron_right($$renderer3, { size: 16, class: "text-gray-400" });
                      }
                      $$renderer3.push(`<!--]--></button>`);
                    } else {
                      $$renderer3.push("<!--[!-->");
                    }
                    $$renderer3.push(`<!--]--></td><td class="py-3 pr-4">`);
                    if (product.inNav) {
                      $$renderer3.push("<!--[-->");
                      $$renderer3.push(`<input type="checkbox"${attr("checked", syncState.selectedProductSkus.has(product.sku), true)} class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"/>`);
                    } else {
                      $$renderer3.push("<!--[!-->");
                    }
                    $$renderer3.push(`<!--]--></td><td class="py-3 pr-4 font-mono text-sm">${escape_html(product.sku)} `);
                    if (hasVariants) {
                      $$renderer3.push("<!--[-->");
                      $$renderer3.push(`<span class="text-gray-500 ml-1">(${escape_html(product.variants.length)})</span>`);
                    } else {
                      $$renderer3.push("<!--[!-->");
                    }
                    $$renderer3.push(`<!--]--></td><td class="py-3 pr-4 truncate max-w-48">${escape_html(product.name || "-")}</td><td class="py-3 pr-4">`);
                    Badge($$renderer3, {
                      variant: product.variantStatus === "master" ? "info" : product.variantStatus === "child" ? "secondary" : "default",
                      children: ($$renderer4) => {
                        $$renderer4.push(`<!---->${escape_html(product.variantStatus === "single" ? "Single" : product.variantStatus)}`);
                      }
                    });
                    $$renderer3.push(`<!----></td><td class="py-3 pr-2 text-center"><!---->`);
                    actindoPresence.icon?.($$renderer3, {
                      size: 16,
                      class: `inline ${stringify(actindoPresence.class)}`
                    });
                    $$renderer3.push(`<!----></td><td class="py-3 pr-2 text-center"><!---->`);
                    navPresence.icon?.($$renderer3, { size: 16, class: `inline ${stringify(navPresence.class)}` });
                    $$renderer3.push(`<!----></td><td class="py-3 pr-2 text-center"><!---->`);
                    mwPresence.icon?.($$renderer3, { size: 16, class: `inline ${stringify(mwPresence.class)}` });
                    $$renderer3.push(`<!----></td><td class="py-3 pr-4 text-right font-mono text-sm">${escape_html(product.actindoId ?? product.middlewareActindoId ?? "-")}</td><td class="py-3 pr-4 text-right font-mono text-sm">${escape_html(product.navActindoId ?? "-")}</td><td class="py-3 text-center">`);
                    Badge($$renderer3, {
                      variant: statusBadge.variant,
                      children: ($$renderer4) => {
                        $$renderer4.push(`<!---->${escape_html(statusBadge.label)}`);
                      }
                    });
                    $$renderer3.push(`<!----></td></tr> `);
                    if (hasVariants && isExpanded) {
                      $$renderer3.push("<!--[-->");
                      $$renderer3.push(`<!--[-->`);
                      const each_array_1 = ensure_array_like(product.variants);
                      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                        let variant = each_array_1[$$index];
                        const vStatusBadge = getStatusBadge(variant.status);
                        const vActindoPresence = getPresenceIcon(variant.inActindo);
                        const vNavPresence = getPresenceIcon(variant.inNav);
                        const vMwPresence = getPresenceIcon(variant.inMiddleware);
                        $$renderer3.push(`<tr${attr_class(`border-b border-white/5 hover:bg-white/5 transition-colors bg-white/[0.02] ${stringify(variant.status === "NeedsSync" ? "bg-amber-500/5" : "")} ${stringify(variant.status === "Mismatch" ? "bg-red-500/10" : "")} ${stringify(variant.status === "Orphan" ? "bg-red-500/5" : "")}`)}><td class="py-2 pr-2"></td><td class="py-2 pr-4">`);
                        if (variant.inNav) {
                          $$renderer3.push("<!--[-->");
                          $$renderer3.push(`<input type="checkbox"${attr("checked", syncState.selectedProductSkus.has(variant.sku), true)} class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"/>`);
                        } else {
                          $$renderer3.push("<!--[!-->");
                        }
                        $$renderer3.push(`<!--]--></td><td class="py-2 pr-4 font-mono text-sm pl-6 text-gray-400">${escape_html(variant.sku)}</td><td class="py-2 pr-4 truncate max-w-48 text-gray-400 text-sm">${escape_html(variant.variantCode || variant.name || "-")}</td><td class="py-2 pr-4">`);
                        Badge($$renderer3, {
                          variant: "secondary",
                          children: ($$renderer4) => {
                            $$renderer4.push(`<!---->child`);
                          }
                        });
                        $$renderer3.push(`<!----></td><td class="py-2 pr-2 text-center"><!---->`);
                        vActindoPresence.icon?.($$renderer3, {
                          size: 14,
                          class: `inline ${stringify(vActindoPresence.class)}`
                        });
                        $$renderer3.push(`<!----></td><td class="py-2 pr-2 text-center"><!---->`);
                        vNavPresence.icon?.($$renderer3, { size: 14, class: `inline ${stringify(vNavPresence.class)}` });
                        $$renderer3.push(`<!----></td><td class="py-2 pr-2 text-center"><!---->`);
                        vMwPresence.icon?.($$renderer3, { size: 14, class: `inline ${stringify(vMwPresence.class)}` });
                        $$renderer3.push(`<!----></td><td class="py-2 pr-4 text-right font-mono text-sm text-gray-400">${escape_html(variant.actindoId ?? variant.middlewareActindoId ?? "-")}</td><td class="py-2 pr-4 text-right font-mono text-sm text-gray-400">${escape_html(variant.navActindoId ?? "-")}</td><td class="py-2 text-center">`);
                        Badge($$renderer3, {
                          variant: vStatusBadge.variant,
                          children: ($$renderer4) => {
                            $$renderer4.push(`<!---->${escape_html(vStatusBadge.label)}`);
                          }
                        });
                        $$renderer3.push(`<!----></td></tr>`);
                      }
                      $$renderer3.push(`<!--]-->`);
                    } else {
                      $$renderer3.push("<!--[!-->");
                    }
                    $$renderer3.push(`<!--]-->`);
                  }
                  $$renderer3.push(`<!--]--></tbody></table></div>`);
                }
              });
              $$renderer2.push(`<!---->`);
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
        if (syncState.tab === "customers") {
          $$renderer2.push("<!--[-->");
          if (syncState.loading && !syncState.customers) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="flex justify-center py-12">`);
            Spinner($$renderer2, {});
            $$renderer2.push(`<!----></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (syncState.customers && syncState.customers.items.length > 0) {
              $$renderer2.push("<!--[-->");
              Card($$renderer2, {
                children: ($$renderer3) => {
                  $$renderer3.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-white/10 text-left text-sm text-gray-400"><th class="pb-3 pr-4 w-10"></th><th class="pb-3 pr-4">Debitorennr.</th><th class="pb-3 pr-4">Name</th><th class="pb-3 pr-4 text-right">Middleware ID</th><th class="pb-3 pr-4 text-right">NAV ID</th><th class="pb-3 text-right">NAV Actindo ID</th><th class="pb-3 text-center">Status</th></tr></thead><tbody><!--[-->`);
                  const each_array_2 = ensure_array_like(syncState.customers.items);
                  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                    let customer = each_array_2[$$index_2];
                    $$renderer3.push(`<tr${attr_class(`border-b border-white/5 hover:bg-white/5 transition-colors ${stringify(customer.needsSync ? "bg-amber-500/5" : "")}`)}><td class="py-3 pr-4">`);
                    if (customer.needsSync) {
                      $$renderer3.push("<!--[-->");
                      $$renderer3.push(`<input type="checkbox"${attr("checked", syncState.selectedCustomerIds.has(customer.debtorNumber), true)} class="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-500 focus:ring-royal-400"/>`);
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
