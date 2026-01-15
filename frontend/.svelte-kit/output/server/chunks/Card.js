import { c as attr_class, e as stringify } from "./index2.js";
function Card($$renderer, $$props) {
  let { class: className = "", hover = false, children } = $$props;
  $$renderer.push(`<div${attr_class(` glass-card p-6 ${stringify(hover ? "transition-transform duration-200 hover:-translate-y-1 hover:border-royal-700/50" : "")} ${stringify(className)} `)}>`);
  children($$renderer);
  $$renderer.push(`<!----></div>`);
}
export {
  Card as C
};
