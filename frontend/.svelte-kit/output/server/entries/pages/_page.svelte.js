import { f as store_get, h as head, u as unsubscribe_stores } from "../../chunks/index2.js";
import { d as dashboardStore } from "../../chunks/dashboard.js";
import { $ as escape_html } from "../../chunks/context.js";
import "clsx";
import { C as Card } from "../../chunks/Card.js";
import { f as formatDateShort } from "../../chunks/format.js";
import { A as Alert } from "../../chunks/Alert.js";
import { S as Spinner } from "../../chunks/Spinner.js";
function MetricCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { title, stats } = $$props;
    Card($$renderer2, {
      hover: true,
      children: ($$renderer3) => {
        $$renderer3.push(`<h3 class="text-sm font-medium uppercase tracking-wider text-gray-400 mb-4">${escape_html(title)}</h3> <div class="flex justify-between gap-6"><div class="space-y-1"><p class="text-xs uppercase tracking-wider text-gray-500">Erfolgreich</p> <p class="text-3xl font-bold text-emerald-400">${escape_html(stats.success)}</p></div> <div class="space-y-1"><p class="text-xs uppercase tracking-wider text-gray-500">Fehler</p> <p class="text-3xl font-bold text-red-400">${escape_html(stats.failed)}</p></div></div> <p class="mt-4 text-sm text-gray-500">Avg <span class="text-gray-300 font-medium">${escape_html(stats.averageDurationSeconds.toFixed(1))}s</span> pro Lauf</p>`);
      }
    });
  });
}
function HeroSection($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { activeJobs, generatedAt } = $$props;
    $$renderer2.push(`<section class="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-royal-800/90 to-royal-900/90 border border-white/10 shadow-2xl shadow-royal-900/50"><div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle at 80% 20%, rgba(59, 160, 255, 0.3), transparent 50%)"></div> <div class="relative grid md:grid-cols-3 gap-8 items-center"><div class="md:col-span-2"><h1 class="text-3xl md:text-4xl font-bold tracking-tight">Realtime Sync Monitor</h1> <p class="mt-2 text-lg text-royal-200/80">Koenigsblaues Cockpit fuer deine Actindo-Jobs</p></div> <div class="grid grid-cols-2 md:grid-cols-1 gap-4"><div><p class="text-xs uppercase tracking-wider text-royal-300/70">Aktive Jobs</p> <p class="text-4xl md:text-5xl font-bold">${escape_html(activeJobs)}</p></div> <div><p class="text-xs uppercase tracking-wider text-royal-300/70">Letzte Aktualisierung</p> <p class="text-lg md:text-xl font-medium text-royal-100/80">${escape_html(formatDateShort(generatedAt))}</p></div></div></div></section>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let summary = store_get($$store_subs ??= {}, "$dashboardStore", dashboardStore).summary;
    let loading = store_get($$store_subs ??= {}, "$dashboardStore", dashboardStore).loading;
    let error = store_get($$store_subs ??= {}, "$dashboardStore", dashboardStore).error;
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard | Actindo Middleware</title>`);
      });
    });
    if (loading && !summary) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-20">`);
      Spinner($$renderer2, { size: "large" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (error && !summary) {
        $$renderer2.push("<!--[-->");
        Alert($$renderer2, {
          variant: "error",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(error)}`);
          }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        if (summary) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="space-y-8 animate-fade-in">`);
          HeroSection($$renderer2, {
            activeJobs: summary.activeJobs,
            generatedAt: summary.generatedAt
          });
          $$renderer2.push(`<!----> <section class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">`);
          MetricCard($$renderer2, { title: "Produkte", stats: summary.products });
          $$renderer2.push(`<!----> `);
          MetricCard($$renderer2, { title: "Kunden", stats: summary.customers });
          $$renderer2.push(`<!----> `);
          MetricCard($$renderer2, { title: "Transaktionen", stats: summary.transactions });
          $$renderer2.push(`<!----> `);
          MetricCard($$renderer2, { title: "Medien", stats: summary.media });
          $$renderer2.push(`<!----></section></div>`);
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
