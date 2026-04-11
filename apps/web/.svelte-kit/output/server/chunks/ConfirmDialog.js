import {
  s as sanitize_props,
  a as spread_props,
  b as slot,
  h as attr_class,
  ah as bind_props,
  d as stringify,
  f as escape_html,
  i as attr,
} from "./index.js";
import { X } from "./x.js";
import { T as Triangle_alert } from "./triangle-alert.js";
import { I as Icon } from "./Icon.js";
function Trash_2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }],
    ["line", { x1: "10", x2: "10", y1: "11", y2: "17" }],
    ["line", { x1: "14", x2: "14", y1: "11", y2: "17" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "trash-2" },
      $$sanitized_props,
      {
        /**
         * @component @name Trash2
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA2aDE4IiAvPgogIDxwYXRoIGQ9Ik0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjYiIC8+CiAgPHBhdGggZD0iTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MiIgLz4KICA8bGluZSB4MT0iMTAiIHgyPSIxMCIgeTE9IjExIiB5Mj0iMTciIC8+CiAgPGxpbmUgeDE9IjE0IiB4Mj0iMTQiIHkxPSIxMSIgeTI9IjE3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/trash-2
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
        $$slots: { default: true },
      },
    ]),
  );
}
function Sheet($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = void 0, onclose, side = "right", children } = $$props;
    if (open) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="fixed inset-0 z-50 bg-black/30" role="presentation"></div> <div${attr_class(
          "fixed inset-y-0 z-50 flex h-full w-[90%] max-w-md flex-col bg-white shadow-2xl overflow-x-hidden sm:max-w-sm",
          void 0,
          {
            "right-0": side === "right",
            "left-0": side === "left",
            "border-l": side === "right",
            "border-r": side === "left",
          },
        )} role="dialog" aria-modal="true"><button type="button" class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer">`,
      );
      X($$renderer2, { class: "h-4 w-4" });
      $$renderer2.push(
        `<!----> <span class="sr-only">Fechar</span></button> <div class="flex-1 overflow-y-auto p-6">`,
      );
      children($$renderer2);
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { open });
  });
}
function ConfirmDialog($$renderer, $$props) {
  let {
    open,
    onclose,
    title,
    description,
    confirmLabel = "Excluir",
    cancelLabel = "Cancelar",
    variant = "danger",
    onconfirm,
    loading = false,
    isBlockingDialog = false,
  } = $$props;
  const iconBgMap = {
    danger: "bg-red-50",
    warning: "bg-amber-50",
    info: "bg-blue-50",
  };
  const iconColorMap = {
    danger: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
  };
  const confirmBtnMap = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-amber-600 hover:bg-amber-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };
  if (open) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(
      `<div class="fixed inset-0 z-50 flex items-center justify-center"><div class="absolute inset-0 bg-black/30" role="presentation"></div> <div class="relative z-10 w-full max-w-md mx-4 rounded-2xl shadow-2xl bg-white border border-slate-200/80"><div class="p-7"><div class="flex items-start gap-4"><div${attr_class(`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl ${stringify(iconBgMap[variant])}`)}>`,
    );
    if (variant === "warning") {
      $$renderer.push("<!--[0-->");
      Triangle_alert($$renderer, {
        class: `w-5 h-5 ${stringify(iconColorMap[variant])}`,
      });
    } else {
      $$renderer.push("<!--[-1-->");
      Trash_2($$renderer, {
        class: `w-5 h-5 ${stringify(iconColorMap[variant])}`,
      });
    }
    $$renderer.push(
      `<!--]--></div> <div class="flex-1 pt-0.5"><h3 class="text-lg font-semibold text-slate-900">${escape_html(title)}</h3> `,
    );
    if (description) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(
        `<div class="text-sm text-slate-600 mt-2 leading-relaxed [&amp;>strong]:text-slate-700 [&amp;>strong]:font-medium [&amp;>p+p]:mt-3">`,
      );
      description($$renderer);
      $$renderer.push(`<!----></div>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(
      `<!--]--></div></div> <div class="flex justify-end gap-3 mt-8">`,
    );
    if (isBlockingDialog) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(
        `<button${attr("disabled", loading, true)} class="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm">${escape_html(loading ? "Aguarde..." : "Entendi")}</button>`,
      );
    } else {
      $$renderer.push("<!--[-1-->");
      $$renderer.push(
        `<button${attr("disabled", loading, true)} class="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50">${escape_html(cancelLabel)}</button> <button${attr("disabled", loading, true)}${attr_class(`px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 ${stringify(confirmBtnMap[variant])}`)}>${escape_html(loading ? "Aguarde..." : confirmLabel)}</button>`,
      );
    }
    $$renderer.push(`<!--]--></div></div></div></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
}
export { ConfirmDialog as C, Sheet as S, Trash_2 as T };
