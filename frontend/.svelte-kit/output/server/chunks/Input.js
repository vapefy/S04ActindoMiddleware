import { d as attr, c as attr_class, j as bind_props, e as stringify } from "./index2.js";
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      type = "text",
      id,
      name,
      placeholder,
      value = "",
      disabled = false,
      required = false,
      autocomplete,
      class: className = "",
      oninput
    } = $$props;
    $$renderer2.push(`<input${attr("type", type)}${attr("id", id)}${attr("name", name)}${attr("placeholder", placeholder)}${attr("value", value)}${attr("disabled", disabled, true)}${attr("required", required, true)}${attr("autocomplete", autocomplete)}${attr_class(`input ${stringify(className)}`)}/>`);
    bind_props($$props, { value });
  });
}
export {
  Input as I
};
