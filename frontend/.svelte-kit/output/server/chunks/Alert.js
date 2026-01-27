import { f as attr_class, g as stringify } from "./index2.js";
import { X } from "./Spinner.js";
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
  Alert as A
};
