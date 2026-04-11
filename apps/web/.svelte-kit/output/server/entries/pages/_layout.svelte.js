import {
  s as sanitize_props,
  a as spread_props,
  b as slot,
  e as ensure_array_like,
  c as store_get,
  d as stringify,
  f as escape_html,
  g as unsubscribe_stores,
  h as attr_class,
  i as attr,
  j as clsx,
  k as derived,
  l as head,
} from "../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { p as page } from "../../chunks/index3.js";
import { t as toasts } from "../../chunks/toast.js";
import { I as Info } from "../../chunks/info.js";
import { I as Icon } from "../../chunks/Icon.js";
import { X } from "../../chunks/x.js";
import { B as Bell } from "../../chunks/bell.js";
import { C as Calendar } from "../../chunks/calendar.js";
import { C as Chart_column } from "../../chunks/chart-column.js";
import { U as Users } from "../../chunks/users.js";
import { S as Stethoscope } from "../../chunks/stethoscope.js";
import { P as Package } from "../../chunks/package.js";
function Circle_check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m9 12 2 2 4-4" }],
  ];
  Icon(
    $$renderer,
    spread_props([
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
        $$slots: { default: true },
      },
    ]),
  );
}
function Circle_x($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "m9 9 6 6" }],
  ];
  Icon(
    $$renderer,
    spread_props([
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
        $$slots: { default: true },
      },
    ]),
  );
}
function File_text($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      {
        d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M10 9H8" }],
    ["path", { d: "M16 13H8" }],
    ["path", { d: "M16 17H8" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "file-text" },
      $$sanitized_props,
      {
        /**
         * @component @name FileText
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0IiAvPgogIDxwYXRoIGQ9Ik0xMCA5SDgiIC8+CiAgPHBhdGggZD0iTTE2IDEzSDgiIC8+CiAgPHBhdGggZD0iTTE2IDE3SDgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/file-text
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
function Layout_dashboard($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1" }],
    ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "layout-dashboard" },
      $$sanitized_props,
      {
        /**
         * @component @name LayoutDashboard
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
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
function Log_out($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
    ["polyline", { points: "16 17 21 12 16 7" }],
    ["line", { x1: "21", x2: "9", y1: "12", y2: "12" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "log-out" },
      $$sanitized_props,
      {
        /**
         * @component @name LogOut
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgMTcgMjEgMTIgMTYgNyIgLz4KICA8bGluZSB4MT0iMjEiIHgyPSI5IiB5MT0iMTIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/log-out
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
function Panel_left_close($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m16 15-3-3 3-3" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "panel-left-close" },
      $$sanitized_props,
      {
        /**
         * @component @name PanelLeftClose
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik05IDN2MTgiIC8+CiAgPHBhdGggZD0ibTE2IDE1LTMtMyAzLTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/panel-left-close
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
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const iconMap = { success: Circle_check, error: Circle_x, info: Info };
    const iconColorMap = {
      success: "text-emerald-500",
      error: "text-red-500",
      info: "text-blue-500",
    };
    $$renderer2.push(
      `<div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 pointer-events-none"><!--[-->`,
    );
    const each_array = ensure_array_like(
      store_get(($$store_subs ??= {}), "$toasts", toasts),
    );
    for (
      let $$index = 0, $$length = each_array.length;
      $$index < $$length;
      $$index++
    ) {
      let toast = each_array[$$index];
      const Icon2 = iconMap[toast.type];
      $$renderer2.push(
        `<div class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl pointer-events-auto min-w-[280px] max-w-[400px] bg-white border border-slate-200">`,
      );
      Icon2($$renderer2, {
        class: `w-5 h-5 shrink-0 ${stringify(iconColorMap[toast.type])}`,
      });
      $$renderer2.push(
        `<!----> <span class="text-sm flex-1 text-slate-700">${escape_html(toast.message)}</span> <button class="p-0.5 rounded hover:bg-slate-100 cursor-pointer shrink-0 transition-colors">`,
      );
      X($$renderer2, { class: "w-3.5 h-3.5 text-slate-400" });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function SinoNotificacoes($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(
      `<div class="relative"><button class="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" aria-label="Notificações">`,
    );
    Bell($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { userName } = $$props;
    let collapsed = false;
    const navItems = [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: Layout_dashboard,
      },
      { href: "/dashboard/agenda", label: "Agenda", icon: Calendar },
      { href: "/dashboard/visitas", label: "Visitas", icon: File_text },
      {
        href: "/dashboard/pipeline",
        label: "Pipeline",
        icon: Chart_column,
      },
    ];
    const cadAuxItems = [
      {
        href: "/dashboard/profissionais",
        label: "Profissionais",
        icon: Users,
      },
      {
        href: "/dashboard/especialidades",
        label: "Especialidades",
        icon: Stethoscope,
      },
      {
        href: "/dashboard/materiais",
        label: "Materiais e Amostras",
        icon: Package,
      },
    ];
    let currentPath = derived(() => page.url.pathname);
    function isActive(href) {
      if (href === "/dashboard") return currentPath() === "/dashboard";
      return currentPath().startsWith(href);
    }
    $$renderer2.push(
      `<aside${attr_class("hidden flex-shrink-0 flex-col h-full bg-white border-r border-slate-200 relative transition-[width] duration-300 ease-in-out lg:flex overflow-visible", void 0, { "w-64": !collapsed, "w-16": collapsed })}><div class="shrink-0 flex items-center justify-between px-5 pt-5 pb-4">`,
    );
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="flex-1 min-w-0"><h1 class="text-lg font-semibold tracking-tight text-slate-900">MediVisitas</h1> <p class="text-xs text-slate-400 mt-0.5">CRM para Propagandistas</p></div> <button class="ml-2 shrink-0 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer" title="Recolher sidebar">`,
      );
      Panel_left_close($$renderer2, { class: "h-4 w-4" });
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(
      `<!--]--></div> <nav class="flex-1 overflow-y-auto overflow-x-visible px-3 space-y-0.5"><!--[-->`,
    );
    const each_array = ensure_array_like(navItems);
    for (
      let $$index = 0, $$length = each_array.length;
      $$index < $$length;
      $$index++
    ) {
      let item = each_array[$$index];
      const active = isActive(item.href);
      const Icon2 = item.icon;
      $$renderer2.push(
        `<a${attr("href", item.href)}${attr_class(clsx(active ? "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-slate-100/80 text-slate-900 transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]" : "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]"))}${attr("title", void 0)}>`,
      );
      if (Icon2) {
        $$renderer2.push("<!--[-->");
        Icon2($$renderer2, {
          class: active
            ? "h-[18px] w-[18px] text-blue-600 transition-colors duration-200"
            : "h-[18px] w-[18px] text-slate-400 group-hover:text-slate-600 transition-colors duration-200",
        });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span>${escape_html(item.label)}</span>`);
      }
      $$renderer2.push(`<!--]--></a>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="pt-5 pb-1"><div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-300">Cadastros</div></div>`,
      );
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array_1 = ensure_array_like(cadAuxItems);
    for (
      let $$index_1 = 0, $$length = each_array_1.length;
      $$index_1 < $$length;
      $$index_1++
    ) {
      let item = each_array_1[$$index_1];
      const active = isActive(item.href);
      const Icon2 = item.icon;
      $$renderer2.push(
        `<a${attr("href", item.href)}${attr_class(clsx(active ? "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-slate-100/80 text-slate-900 transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]" : "group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]"))}${attr("title", void 0)}>`,
      );
      if (Icon2) {
        $$renderer2.push("<!--[-->");
        Icon2($$renderer2, {
          class: active
            ? "h-[18px] w-[18px] text-blue-600 transition-colors duration-200"
            : "h-[18px] w-[18px] text-slate-400 group-hover:text-slate-600 transition-colors duration-200",
        });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span>${escape_html(item.label)}</span>`);
      }
      $$renderer2.push(`<!--]--></a>`);
    }
    $$renderer2.push(
      `<!--]--></nav> <div class="mt-auto shrink-0 border-t border-slate-200 bg-white p-4"><div${attr_class(
        "flex items-center w-full gap-3 px-1 py-2 transition-all duration-300",
        void 0,
        {
          "flex-col": collapsed,
          "gap-2": collapsed,
          "items-center": collapsed,
        },
      )}><div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white shadow-sm">${escape_html(userName.charAt(0).toUpperCase())}</div> `,
    );
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="flex-1 min-w-0"><p class="text-[13px] font-medium text-slate-700 truncate">${escape_html(userName)}</p></div>`,
      );
    }
    $$renderer2.push(`<!--]--> <div class="relative z-10">`);
    SinoNotificacoes($$renderer2);
    $$renderer2.push(
      `<!----></div></div> <form method="POST" action="/logout"><button type="submit" class="mt-1 flex w-full items-center justify-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-slate-400 transition-all duration-200 ease-out hover:bg-slate-50 hover:text-slate-600 hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] cursor-pointer">`,
    );
    Log_out($$renderer2, { class: "h-4 w-4" });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span>Sair</span>`);
    }
    $$renderer2.push(`<!--]--></button></form></div></aside>`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, children } = $$props;
    let isDashboard = derived(() => page.url.pathname.startsWith("/dashboard"));
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(
          `<title>MediVisitas — CRM para Propagandistas</title>`,
        );
      });
    });
    if (isDashboard()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="flex h-screen w-full overflow-hidden bg-slate-50">`,
      );
      Sidebar($$renderer2, {
        userName: data.userName ?? "Usuário",
        sessionToken: data.sessionToken,
      });
      $$renderer2.push(
        `<!----> <main class="flex-1 min-w-0 h-full overflow-y-auto"><div class="p-8">`,
      );
      children($$renderer2);
      $$renderer2.push(`<!----></div></main></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    }
    $$renderer2.push(`<!--]--> `);
    Toast($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export { _layout as default };
