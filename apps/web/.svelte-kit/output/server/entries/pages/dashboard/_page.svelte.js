import { s as sanitize_props, a as spread_props, b as slot, l as head, e as ensure_array_like, f as escape_html } from "../../../chunks/index.js";
import { U as Users } from "../../../chunks/users.js";
import { S as Stethoscope } from "../../../chunks/stethoscope.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Calendar_check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "M3 10h18" }],
    ["path", { "d": "m9 16 2 2 4-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "calendar-check" },
    $$sanitized_props,
    {
      /**
       * @component @name CalendarCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4IiAvPgogIDxwYXRoIGQ9Im05IDE2IDIgMiA0LTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/calendar-check
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
function Trending_up($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["polyline", { "points": "22 7 13.5 15.5 8.5 10.5 2 17" }],
    ["polyline", { "points": "16 7 22 7 22 13" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trending-up" },
    $$sanitized_props,
    {
      /**
       * @component @name TrendingUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWxpbmUgcG9pbnRzPSIyMiA3IDEzLjUgMTUuNSA4LjUgMTAuNSAyIDE3IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjE2IDcgMjIgNyAyMiAxMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/trending-up
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
function _page($$renderer) {
  const recentProfissionais = [
    {
      name: "Dr. Carlos Silva",
      spec: "Cardiologia",
      status: "Novo"
    },
    {
      name: "Dra. Ana Costa",
      spec: "Pediatria",
      status: "Atualizado"
    },
    { name: "Dr. João Pereira", spec: "Ortopedia", status: "Novo" }
  ];
  const upcomingVisits = [
    {
      name: "Dra. Maria Clara",
      time: "14:30",
      spec: "Dermatologia"
    },
    {
      name: "Dr. Roberto Alves",
      time: "16:00",
      spec: "Endocrinologia"
    }
  ];
  head("x1i5gj", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Dashboard — MediVisitas</title>`);
    });
  });
  $$renderer.push(`<header class="mb-6"><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h2> <p class="text-sm text-slate-400 mt-1">Visão geral do seu dia</p></header> <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 mb-6 items-stretch"><div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm"><div class="flex items-center gap-3 mb-4"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">`);
  Users($$renderer, { class: "h-5 w-5 text-blue-600" });
  $$renderer.push(`<!----></div> <div><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Profissionais</p> <p class="text-xl font-semibold text-slate-900 leading-none mt-1">—</p></div></div> <div class="mt-auto space-y-2 border-t border-slate-100 pt-3"><!--[-->`);
  const each_array = ensure_array_like(recentProfissionais);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let p = each_array[$$index];
    $$renderer.push(`<div class="flex justify-between items-center group cursor-pointer"><div class="min-w-0"><p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">${escape_html(p.name)}</p> <p class="text-[11px] text-slate-400 truncate">${escape_html(p.spec)}</p></div> <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">${escape_html(p.status)}</span></div>`);
  }
  $$renderer.push(`<!--]--></div></div> <div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm"><div class="flex items-center gap-3 mb-4"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">`);
  Stethoscope($$renderer, { class: "h-5 w-5 text-emerald-600" });
  $$renderer.push(`<!----></div> <div><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Especialidades</p> <p class="text-xl font-semibold text-slate-900 leading-none mt-1">—</p></div></div> <div class="mt-auto border-t border-slate-100 pt-3"><p class="text-xs text-slate-500 font-medium leading-relaxed">Top ativas:</p> <div class="flex flex-wrap gap-1.5 mt-2"><span class="text-[11px] font-medium px-2 py-1 bg-slate-50 text-slate-600 outline-1 outline-slate-100 rounded-md">Cardiologia</span> <span class="text-[11px] font-medium px-2 py-1 bg-slate-50 text-slate-600 outline-1 outline-slate-100 rounded-md">Pediatria</span></div></div></div> <div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm"><div class="flex items-center gap-3 mb-4"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">`);
  Calendar_check($$renderer, { class: "h-5 w-5 text-violet-600" });
  $$renderer.push(`<!----></div> <div><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Visitas Hoje</p> <p class="text-xl font-semibold text-slate-900 leading-none mt-1">—</p></div></div> <div class="mt-auto space-y-2 border-t border-slate-100 pt-3"><p class="text-xs text-slate-500 font-medium mb-1">Próximos compromissos:</p> <!--[-->`);
  const each_array_1 = ensure_array_like(upcomingVisits);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let v = each_array_1[$$index_1];
    $$renderer.push(`<div class="flex items-center gap-2 group cursor-pointer"><div class="flex-shrink-0 w-10 text-center"><span class="text-[11px] font-bold text-violet-600">${escape_html(v.time)}</span></div> <div class="min-w-0 border-l border-slate-100 pl-2"><p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-violet-600 transition-colors">${escape_html(v.name)}</p> <p class="text-[11px] text-slate-400 truncate">${escape_html(v.spec)}</p></div></div>`);
  }
  $$renderer.push(`<!--]--></div></div> <div class="card-surface p-4 flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm"><div class="flex items-center gap-3 mb-4"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">`);
  Trending_up($$renderer, { class: "h-5 w-5 text-amber-600" });
  $$renderer.push(`<!----></div> <div><p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pipeline</p> <p class="text-xl font-semibold text-slate-900 leading-none mt-1">—</p></div></div> <div class="mt-auto border-t border-slate-100 pt-3"><div class="flex justify-between items-center mb-1.5 cursor-pointer group"><span class="text-[12px] font-medium text-slate-600 group-hover:text-amber-600 transition-colors">Prospectado</span> <span class="text-[12px] font-bold text-slate-900">5</span></div> <div class="w-full bg-slate-100 rounded-full h-1.5 mb-3"><div class="bg-amber-400 h-1.5 rounded-full outline-hidden" style="width: 45%"></div></div> <div class="flex justify-between items-center mb-1.5 cursor-pointer group"><span class="text-[12px] font-medium text-slate-600 group-hover:text-emerald-600 transition-colors">Interessado</span> <span class="text-[12px] font-bold text-slate-900">2</span></div> <div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-emerald-400 h-1.5 rounded-full outline-hidden" style="width: 20%"></div></div></div></div></div> <div class="card-surface p-5 transition-all duration-200 hover:shadow-sm"><h3 class="text-sm font-semibold text-slate-700 mb-4">Acesso Rápido</h3> <div class="grid grid-cols-1 gap-4 sm:grid-cols-3"><a href="/dashboard/profissionais" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">`);
  Users($$renderer, {
    class: "h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors"
  });
  $$renderer.push(`<!----></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Profissionais</p> <p class="text-[11px] text-slate-400 font-medium">Gerenciar cadastros</p></div></a> <a href="/dashboard/especialidades" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">`);
  Stethoscope($$renderer, {
    class: "h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors"
  });
  $$renderer.push(`<!----></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Especialidades</p> <p class="text-[11px] text-slate-400 font-medium">Categorias e subs</p></div></a> <a href="/dashboard/pipeline" class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-violet-200 hover:bg-violet-50/40 active:scale-[0.98]"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">`);
  Trending_up($$renderer, {
    class: "h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-colors"
  });
  $$renderer.push(`<!----></div> <div><p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Pipeline</p> <p class="text-[11px] text-slate-400 font-medium">Funil de conversão</p></div></a></div></div>`);
}
export {
  _page as default
};
