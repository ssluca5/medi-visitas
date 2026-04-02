import { P as PUBLIC_API_URL } from "./public.js";
import { ag as attributes, j as clsx, k as derived, i as attr_class, af as bind_props } from "./index.js";
import { X } from "./x.js";
async function apiFetch(path, token, options = {}) {
  const headers = {
    ...options.headers
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...options,
    headers
  });
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
  return res;
}
function Button($$renderer, $$props) {
  let {
    variant = "default",
    size = "default",
    href,
    class: className = "",
    children,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const variantClasses = {
    default: "bg-[rgb(var(--accent))] text-white shadow-sm hover:bg-[rgb(var(--accent))]/90",
    destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
    outline: "border bg-white shadow-sm hover:bg-slate-50",
    secondary: "bg-slate-100 text-slate-700 shadow-sm hover:bg-slate-200/70",
    ghost: "hover:bg-slate-100",
    link: "text-[rgb(var(--accent))] underline-offset-4 hover:underline"
  };
  const sizeClasses = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-lg px-3 text-xs",
    lg: "h-10 rounded-lg px-8",
    icon: "h-9 w-9"
  };
  let classes = derived(() => `inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))]/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`);
  if (href) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<a${attributes({ href, class: clsx(classes()), ...rest })}>`);
    children($$renderer);
    $$renderer.push(`<!----></a>`);
  } else {
    $$renderer.push("<!--[-1-->");
    $$renderer.push(`<button${attributes({ class: clsx(classes()), ...rest })}>`);
    children($$renderer);
    $$renderer.push(`<!----></button>`);
  }
  $$renderer.push(`<!--]-->`);
}
function Sheet($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = void 0, onclose, side = "right", children } = $$props;
    if (open) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" role="presentation"></div> <div${attr_class("fixed inset-y-0 z-50 flex h-full w-[90%] max-w-md flex-col bg-white shadow-2xl overflow-x-hidden sm:max-w-sm", void 0, {
        "right-0": side === "right",
        "left-0": side === "left",
        "border-l": side === "right",
        "border-r": side === "left"
      })} role="dialog" aria-modal="true"><button type="button" class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer">`);
      X($$renderer2, { class: "h-4 w-4" });
      $$renderer2.push(`<!----> <span class="sr-only">Fechar</span></button> <div class="flex-1 overflow-y-auto p-6">`);
      children($$renderer2);
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { open });
  });
}
export {
  Button as B,
  Sheet as S,
  apiFetch as a
};
