import { s as sanitize_props, a as spread_props, b as slot, f as attr_class, j as attr_style, g as stringify, c as store_get, u as unsubscribe_stores, h as head, e as ensure_array_like } from "../../../chunks/index2.js";
import { j as jobsStore } from "../../../chunks/dashboard.js";
import { p as permissions } from "../../../chunks/auth.js";
import { b as formatDuration, a as formatDate, p as prettifyJson } from "../../../chunks/format.js";
import { P as PageHeader, R as Refresh_cw } from "../../../chunks/PageHeader.js";
import { C as Card } from "../../../chunks/Card.js";
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { B as Badge } from "../../../chunks/Badge.js";
import { A as Alert } from "../../../chunks/Alert.js";
import { I as Icon, S as Spinner } from "../../../chunks/Spinner.js";
import { A as Activity, M as Modal } from "../../../chunks/Modal.js";
import { $ as escape_html } from "../../../chunks/context.js";
import { S as Search } from "../../../chunks/search.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
function Chevron_left($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-left" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgMTgtNi02IDYtNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-left
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
function Copy($$renderer, $$props) {
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
      {
        "width": "14",
        "height": "14",
        "x": "8",
        "y": "8",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "path",
      {
        "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "copy" },
    $$sanitized_props,
    {
      /**
       * @component @name Copy
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
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
function Play($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.460.1 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [["polygon", { "points": "6 3 20 12 6 21 6 3" }]];
  Icon($$renderer, spread_props([
    { name: "play" },
    $$sanitized_props,
    {
      /**
       * @component @name Play
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWdvbiBwb2ludHM9IjYgMyAyMCAxMiA2IDIxIDYgMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/play
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
function CodeBlock($$renderer, $$props) {
  let {
    code,
    error = false,
    maxHeight = "360px",
    class: className = ""
  } = $$props;
  $$renderer.push(`<div${attr_class(`relative group ${stringify(className)}`)}><pre${attr_class(` p-4 rounded-xl overflow-auto font-mono text-sm bg-black/40 border ${stringify(error ? "border-red-500/50 shadow-lg shadow-red-500/20" : "border-white/10")} `)}${attr_style(`max-height: ${stringify(maxHeight)}`)}><code class="text-gray-300 whitespace-pre-wrap break-words">${escape_html(code)}</code></pre> <button type="button" class="absolute top-2 right-2 p-2 rounded-lg bg-dark-700/80 border border-white/10 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all">`);
  {
    $$renderer.push("<!--[!-->");
    Copy($$renderer, { size: 16 });
  }
  $$renderer.push(`<!--]--></button></div>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let perms = store_get($$store_subs ??= {}, "$permissions", permissions);
    let jobs = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).jobs;
    let total = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).total;
    let page = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).page;
    let pageSize = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).pageSize;
    let selectedJobId = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).selectedJobId;
    let statusFilter = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).statusFilter;
    let typeFilter = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).typeFilter;
    let loading = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).loading;
    let error = store_get($$store_subs ??= {}, "$jobsStore", jobsStore).error;
    let selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;
    let totalPages = Math.max(1, Math.ceil(total / pageSize));
    let search = "";
    let searchTimeout;
    const statusOptions = [
      { value: "all", label: "Alle" },
      { value: "success", label: "Erfolgreich" },
      { value: "failed", label: "Fehlgeschlagen" }
    ];
    const typeOptions = [
      { value: "all", label: "Alle Typen" },
      { value: "product", label: "Produkte" },
      { value: "customer", label: "Kunden" },
      { value: "transaction", label: "Transaktionen" },
      { value: "media", label: "Medien" }
    ];
    let replayOpen = false;
    let replayPayload = "";
    let replayLoading = false;
    let replayError = "";
    function handleSearch(e) {
      const target = e.target;
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(
        () => {
          jobsStore.setSearch(target.value);
        },
        300
      );
    }
    async function handleDeleteJob(jobId) {
      if (!confirm("Diesen Job wirklich loeschen?")) return;
      try {
        await jobsStore.deleteJob(jobId);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Fehler beim Loeschen");
      }
    }
    async function handleClearAll() {
      if (!confirm("Gesamte Job-Historie wirklich loeschen?")) return;
      try {
        await jobsStore.deleteAllJobs();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Fehler beim Loeschen");
      }
    }
    function openReplayModal() {
      if (!selectedJob) return;
      replayPayload = selectedJob.requestPayload || "{}";
      replayError = "";
      replayOpen = true;
    }
    async function handleReplay() {
      if (!selectedJob) return;
      try {
        JSON.parse(replayPayload);
      } catch {
        replayError = "Ungueltiges JSON";
        return;
      }
      replayLoading = true;
      replayError = "";
      try {
        await jobsStore.replayJob(selectedJob.id, replayPayload);
        replayOpen = false;
        jobsStore.load();
      } catch (err) {
        replayError = err instanceof Error ? err.message : "Replay fehlgeschlagen";
      } finally {
        replayLoading = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("4b134t", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Jobs | Actindo Middleware</title>`);
        });
      });
      {
        let actions = function($$renderer4) {
          if (perms.canWrite) {
            $$renderer4.push("<!--[-->");
            Button($$renderer4, {
              variant: "danger",
              onclick: handleClearAll,
              disabled: jobs.length === 0,
              children: ($$renderer5) => {
                Trash_2($$renderer5, { size: 16 });
                $$renderer5.push(`<!----> Alle loeschen`);
              }
            });
          } else {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--> `);
          Button($$renderer4, {
            variant: "ghost",
            onclick: () => jobsStore.load(),
            disabled: loading,
            children: ($$renderer5) => {
              Refresh_cw($$renderer5, { size: 16, class: loading ? "animate-spin" : "" });
              $$renderer5.push(`<!----> Aktualisieren`);
            }
          });
          $$renderer4.push(`<!---->`);
        };
        PageHeader($$renderer3, {
          title: "Job Monitor",
          subtitle: "Uebersicht aller API-Jobs und Fehler",
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
      $$renderer3.push(`<!--]--> <div class="grid lg:grid-cols-2 gap-6">`);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="mb-4 space-y-3"><div class="relative">`);
          Search($$renderer4, {
            size: 18,
            class: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          });
          $$renderer4.push(`<!----> `);
          Input($$renderer4, {
            type: "search",
            placeholder: "Suche nach Endpoint...",
            value: search,
            oninput: handleSearch,
            class: "pl-11"
          });
          $$renderer4.push(`<!----></div> <div class="flex flex-wrap gap-2">`);
          $$renderer4.select(
            {
              value: statusFilter,
              onchange: (e) => jobsStore.setStatusFilter(e.currentTarget.value),
              class: "px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-400/60 focus:ring-4 focus:ring-royal-400/10 cursor-pointer"
            },
            ($$renderer5) => {
              $$renderer5.push(`<!--[-->`);
              const each_array = ensure_array_like(statusOptions);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let opt = each_array[$$index];
                $$renderer5.option({ value: opt.value, class: "bg-gray-900" }, ($$renderer6) => {
                  $$renderer6.push(`${escape_html(opt.label)}`);
                });
              }
              $$renderer5.push(`<!--]-->`);
            }
          );
          $$renderer4.push(` `);
          $$renderer4.select(
            {
              value: typeFilter,
              onchange: (e) => jobsStore.setTypeFilter(e.currentTarget.value),
              class: "px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-400/60 focus:ring-4 focus:ring-royal-400/10 cursor-pointer"
            },
            ($$renderer5) => {
              $$renderer5.push(`<!--[-->`);
              const each_array_1 = ensure_array_like(typeOptions);
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let opt = each_array_1[$$index_1];
                $$renderer5.option({ value: opt.value, class: "bg-gray-900" }, ($$renderer6) => {
                  $$renderer6.push(`${escape_html(opt.label)}`);
                });
              }
              $$renderer5.push(`<!--]-->`);
            }
          );
          $$renderer4.push(`</div></div> `);
          if (loading && jobs.length === 0) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="flex justify-center py-12">`);
            Spinner($$renderer4, {});
            $$renderer4.push(`<!----></div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            if (jobs.length === 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="text-center py-12 text-gray-400">`);
              Activity($$renderer4, { size: 48, class: "mx-auto mb-4 opacity-50" });
              $$renderer4.push(`<!----> <p>Keine Jobs vorhanden</p></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`<div class="space-y-2 max-h-[500px] overflow-y-auto"><!--[-->`);
              const each_array_2 = ensure_array_like(jobs);
              for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                let job = each_array_2[$$index_2];
                $$renderer4.push(`<button type="button"${attr_class(` w-full text-left p-4 rounded-xl border transition-all ${stringify(job.id === selectedJobId ? "bg-royal-600/20 border-royal-600/50" : "bg-white/5 border-white/10 hover:bg-white/10")} `)}><div class="flex items-center justify-between gap-2 mb-2"><span class="font-medium truncate">${escape_html(job.endpoint)}</span> `);
                Badge($$renderer4, {
                  variant: job.success ? "success" : "error",
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(job.success ? "OK" : "Fehler")}`);
                  }
                });
                $$renderer4.push(`<!----></div> <div class="flex items-center gap-4 text-xs text-gray-400"><span>${escape_html(formatDuration(job.durationMilliseconds))}</span> <span>${escape_html(formatDate(job.startedAt))}</span></div></button>`);
              }
              $$renderer4.push(`<!--]--></div> <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10"><span class="text-sm text-gray-400">Seite ${escape_html(page)} / ${escape_html(totalPages)}</span> <div class="flex gap-2">`);
              Button($$renderer4, {
                variant: "ghost",
                size: "small",
                disabled: page <= 1,
                onclick: () => jobsStore.setPage(page - 1),
                children: ($$renderer5) => {
                  Chevron_left($$renderer5, { size: 16 });
                }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                variant: "ghost",
                size: "small",
                disabled: page >= totalPages,
                onclick: () => jobsStore.setPage(page + 1),
                children: ($$renderer5) => {
                  Chevron_right($$renderer5, { size: 16 });
                }
              });
              $$renderer4.push(`<!----></div></div>`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          if (selectedJob) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="flex items-center justify-between mb-4"><div><h3 class="text-lg font-semibold">${escape_html(selectedJob.endpoint)}</h3> <p class="text-sm text-gray-400">${escape_html(formatDate(selectedJob.startedAt))} - ${escape_html(formatDuration(selectedJob.durationMilliseconds))}</p></div> <div class="flex items-center gap-2">`);
            Badge($$renderer4, {
              variant: selectedJob.success ? "success" : "error",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html(selectedJob.success ? "Erfolgreich" : "Fehler")}`);
              }
            });
            $$renderer4.push(`<!----> `);
            if (perms.canWrite) {
              $$renderer4.push("<!--[-->");
              Button($$renderer4, {
                variant: "ghost",
                size: "small",
                onclick: openReplayModal,
                children: ($$renderer5) => {
                  Play($$renderer5, { size: 14 });
                  $$renderer5.push(`<!----> Replay`);
                }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                variant: "danger",
                size: "small",
                onclick: () => handleDeleteJob(selectedJob.id),
                children: ($$renderer5) => {
                  Trash_2($$renderer5, { size: 14 });
                }
              });
              $$renderer4.push(`<!---->`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div></div> <div class="space-y-4"><div><h4 class="text-sm font-medium text-gray-400 mb-2">Request</h4> `);
            CodeBlock($$renderer4, {
              code: prettifyJson(selectedJob.requestPayload),
              maxHeight: "200px"
            });
            $$renderer4.push(`<!----></div> <div><h4 class="text-sm font-medium text-gray-400 mb-2">Response</h4> `);
            CodeBlock($$renderer4, {
              code: prettifyJson(selectedJob.success ? selectedJob.responsePayload : selectedJob.errorPayload ?? selectedJob.responsePayload),
              error: !selectedJob.success,
              maxHeight: "200px"
            });
            $$renderer4.push(`<!----></div> `);
            if (selectedJob.actindoLogs && selectedJob.actindoLogs.length > 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div><h4 class="text-sm font-medium text-gray-400 mb-2">Actindo Calls (${escape_html(selectedJob.actindoLogs.length)})</h4> <div class="space-y-3 max-h-[300px] overflow-y-auto"><!--[-->`);
              const each_array_3 = ensure_array_like(selectedJob.actindoLogs);
              for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
                let log = each_array_3[$$index_3];
                $$renderer4.push(`<div class="p-3 rounded-xl bg-black/20 border border-white/5"><div class="flex items-center justify-between mb-2"><span class="text-sm font-medium">${escape_html(log.endpoint)}</span> `);
                Badge($$renderer4, {
                  variant: log.success ? "success" : "error",
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(log.success ? "OK" : "Fehler")}`);
                  }
                });
                $$renderer4.push(`<!----></div> <div class="grid md:grid-cols-2 gap-2">`);
                CodeBlock($$renderer4, { code: prettifyJson(log.requestPayload), maxHeight: "120px" });
                $$renderer4.push(`<!----> `);
                CodeBlock($$renderer4, {
                  code: prettifyJson(log.responsePayload),
                  error: !log.success,
                  maxHeight: "120px"
                });
                $$renderer4.push(`<!----></div></div>`);
              }
              $$renderer4.push(`<!--]--></div></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push(`<div class="text-center py-12 text-gray-400">`);
            Activity($$renderer4, { size: 48, class: "mx-auto mb-4 opacity-50" });
            $$renderer4.push(`<!----> <p>Waehle einen Job aus der Liste</p></div>`);
          }
          $$renderer4.push(`<!--]-->`);
        }
      });
      $$renderer3.push(`<!----></div> `);
      {
        let footer = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            onclick: () => replayOpen = false,
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Abbrechen`);
            }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            onclick: handleReplay,
            disabled: replayLoading,
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->${escape_html(replayLoading ? "Sende..." : "Replay senden")}`);
            }
          });
          $$renderer4.push(`<!---->`);
        };
        Modal($$renderer3, {
          title: "Job Replay",
          get open() {
            return replayOpen;
          },
          set open($$value) {
            replayOpen = $$value;
            $$settled = false;
          },
          footer,
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="space-y-4"><p class="text-sm text-gray-400">Bearbeite das Request-Payload und sende den Job erneut.</p> `);
            if (replayError) {
              $$renderer4.push("<!--[-->");
              Alert($$renderer4, {
                variant: "error",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(replayError)}`);
                }
              });
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--> <textarea class="w-full h-64 p-4 rounded-xl bg-black/30 border border-white/10 font-mono text-sm text-white resize-none outline-none focus:border-royal-400/60 focus:ring-4 focus:ring-royal-400/10">`);
            const $$body = escape_html(replayPayload);
            if ($$body) {
              $$renderer4.push(`${$$body}`);
            }
            $$renderer4.push(`</textarea></div>`);
          },
          $$slots: { footer: true, default: true }
        });
      }
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
export {
  _page as default
};
