import { h as head } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import { $ as escape_html } from "../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { C as Card } from "../../../chunks/Card.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let username = "";
    let password = "";
    let passwordConfirm = "";
    let loading = false;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("52fghe", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Registrieren | Actindo Middleware</title>`);
        });
      });
      $$renderer3.push(`<div class="min-h-screen flex items-center justify-center p-4"><div class="w-full max-w-md"><div class="text-center mb-6"><div class="inline-flex items-center gap-3 mb-4"><div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal-400 to-royal-700 shadow-lg shadow-royal-600/40 border border-white/10"></div> <div class="text-left"><p class="font-bold tracking-wider uppercase">Actindo Middleware</p> <p class="text-sm text-gray-400">Registrierung</p></div></div></div> `);
      Card($$renderer3, {
        class: "gradient-border",
        children: ($$renderer4) => {
          {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push(`<h2 class="text-xl font-semibold mb-1">Registrieren</h2> <p class="text-sm text-gray-400 mb-4">Erstelle einen Account. Ein Admin muss dich freischalten.</p> `);
            {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> <form class="space-y-4"><div><label class="label" for="username">Benutzername</label> `);
            Input($$renderer4, {
              id: "username",
              placeholder: "username",
              autocomplete: "username",
              required: true,
              get value() {
                return username;
              },
              set value($$value) {
                username = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div><label class="label" for="password">Passwort</label> `);
            Input($$renderer4, {
              id: "password",
              type: "password",
              placeholder: "********",
              autocomplete: "new-password",
              required: true,
              get value() {
                return password;
              },
              set value($$value) {
                password = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div><label class="label" for="password-confirm">Passwort bestaetigen</label> `);
            Input($$renderer4, {
              id: "password-confirm",
              type: "password",
              placeholder: "********",
              autocomplete: "new-password",
              required: true,
              get value() {
                return passwordConfirm;
              },
              set value($$value) {
                passwordConfirm = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> `);
            Button($$renderer4, {
              type: "submit",
              disabled: loading,
              class: "w-full",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html("Registrieren")}`);
              }
            });
            $$renderer4.push(`<!----></form> <div class="mt-6 pt-4 border-t border-white/10 text-center"><p class="text-sm text-gray-400">Bereits einen Account? <a href="/login" class="link">Anmelden</a></p></div>`);
          }
          $$renderer4.push(`<!--]-->`);
        }
      });
      $$renderer3.push(`<!----></div></div>`);
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
