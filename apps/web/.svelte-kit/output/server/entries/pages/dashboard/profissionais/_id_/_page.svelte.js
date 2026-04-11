import {
  s as sanitize_props,
  a as spread_props,
  b as slot,
  m as getContext,
  e as ensure_array_like,
  h as attr_class,
  d as stringify,
  f as escape_html,
  l as head,
  k as derived,
  c as store_get,
  i as attr,
  g as unsubscribe_stores,
} from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { a as apiFetch } from "../../../../../chunks/api.js";
import { V as VisitaSheet } from "../../../../../chunks/VisitaSheet.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { T as Trending_up } from "../../../../../chunks/trending-up.js";
import { C as Clock } from "../../../../../chunks/clock.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { C as Calendar_plus } from "../../../../../chunks/calendar-plus.js";
function Activity($$renderer, $$props) {
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
        d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      },
    ],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "activity" },
      $$sanitized_props,
      {
        /**
         * @component @name Activity
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTJoLTIuNDhhMiAyIDAgMCAwLTEuOTMgMS40NmwtMi4zNSA4LjM2YS4yNS4yNSAwIDAgMS0uNDggMEw5LjI0IDIuMThhLjI1LjI1IDAgMCAwLS40OCAwbC0yLjM1IDguMzZBMiAyIDAgMCAxIDQuNDkgMTJIMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/activity
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
function List_todo($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["rect", { x: "3", y: "5", width: "6", height: "6", rx: "1" }],
    ["path", { d: "m3 17 2 2 4-4" }],
    ["path", { d: "M13 6h8" }],
    ["path", { d: "M13 12h8" }],
    ["path", { d: "M13 18h8" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "list-todo" },
      $$sanitized_props,
      {
        /**
         * @component @name ListTodo
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIzIiB5PSI1IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cGF0aCBkPSJtMyAxNyAyIDIgNC00IiAvPgogIDxwYXRoIGQ9Ik0xMyA2aDgiIC8+CiAgPHBhdGggZD0iTTEzIDEyaDgiIC8+CiAgPHBhdGggZD0iTTEzIDE4aDgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list-todo
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
function Pencil($$renderer, $$props) {
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
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      },
    ],
    ["path", { d: "m15 5 4 4" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "pencil" },
      $$sanitized_props,
      {
        /**
         * @component @name Pencil
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
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
function User($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "12", cy: "7", r: "4" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "user" },
      $$sanitized_props,
      {
        /**
         * @component @name User
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
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
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe,
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe,
    },
    /** @type {typeof updated} */
    updated: stores$1.updated,
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  },
};
function TimelineProfissional($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { itens } = $$props;
    function formatData(iso) {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(iso));
    }
    function formatHora(iso) {
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    }
    const statusVisitaClass = {
      REALIZADA: "bg-emerald-50 text-emerald-700",
      CANCELADA: "bg-red-50 text-red-600",
      NAO_REALIZADA: "bg-slate-100 text-slate-600",
      AGENDADA: "bg-blue-50 text-blue-700",
    };
    const statusAgendaClass = {
      REALIZADO: "bg-emerald-50 text-emerald-700",
      CANCELADO: "bg-red-50 text-red-600",
      CONFIRMADO: "bg-blue-50 text-blue-700",
      PLANEJADO: "bg-slate-100 text-slate-600",
    };
    const estagioLabels = {
      PROSPECTADO: "Prospectado",
      VISITADO: "Visitado",
      INTERESSADO: "Interessado",
      PRESCRITOR: "Prescritor",
      FIDELIZADO: "Fidelizado",
    };
    if (itens.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="text-center py-12"><p class="text-sm text-slate-400">Nenhum evento no histórico</p></div>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(
        `<div class="relative ml-3 pl-6 space-y-5"><div class="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-100"></div> <!--[-->`,
      );
      const each_array = ensure_array_like(itens);
      for (
        let $$index = 0, $$length = each_array.length;
        $$index < $$length;
        $$index++
      ) {
        let item = each_array[$$index];
        $$renderer2.push(`<div class="relative">`);
        if (item.tipo === "VISITA") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(
            `<div${attr_class(`absolute -left-[calc(1.5rem+5px)] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-[3px] ring-slate-50 shadow-sm ${stringify(item.status === "REALIZADA" ? "bg-emerald-500" : item.status === "CANCELADA" ? "bg-red-500" : item.status === "NAO_REALIZADA" ? "bg-slate-500" : "bg-blue-500")} `)}></div>`,
          );
        } else if (item.tipo === "ESTAGIO") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(
            `<div class="absolute -left-[calc(1.5rem+5px)] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-[3px] ring-slate-50 shadow-sm bg-violet-500"></div>`,
          );
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(
            `<div class="absolute -left-[calc(1.5rem+5px)] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-[3px] ring-slate-50 shadow-sm bg-amber-500"></div>`,
          );
        }
        $$renderer2.push(
          `<!--]--> <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200"><div class="flex items-center gap-2 mb-2">`,
        );
        if (item.tipo === "VISITA") {
          $$renderer2.push("<!--[0-->");
          Calendar($$renderer2, { class: "w-3.5 h-3.5 text-slate-400" });
        } else if (item.tipo === "ESTAGIO") {
          $$renderer2.push("<!--[1-->");
          Trending_up($$renderer2, { class: "w-3.5 h-3.5 text-violet-400" });
        } else {
          $$renderer2.push("<!--[-1-->");
          Clock($$renderer2, { class: "w-3.5 h-3.5 text-amber-400" });
        }
        $$renderer2.push(
          `<!--]--> <span class="text-[13px] font-semibold text-slate-700">${escape_html(formatData(item.data))}</span> <span class="text-slate-300">·</span> <span class="text-[13px] text-slate-500">${escape_html(formatHora(item.data))}</span></div> `,
        );
        if (item.tipo === "VISITA") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex items-center gap-2 flex-wrap">`);
          if (item.status) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<span${attr_class(`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(statusVisitaClass[item.status] ?? "bg-slate-100 text-slate-600")}`)}>${escape_html(item.status)}</span>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (item.duracaoMinutos) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<span class="text-xs text-slate-400">${escape_html(item.duracaoMinutos)}min</span>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div> `);
          if (item.objetivoVisita) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<p class="text-[13px] text-slate-600 mt-1.5">${escape_html(item.objetivoVisita)}</p>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (item.resumo) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<p class="text-xs text-slate-500 mt-1">${escape_html(item.resumo)}</p>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else if (item.tipo === "ESTAGIO") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<p class="text-[13px] text-slate-600">`);
          if (item.estagioAnterior) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<span class="text-slate-400">${escape_html(estagioLabels[item.estagioAnterior] ?? item.estagioAnterior)}</span> <span class="text-slate-300 mx-1">→</span>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(
            `<!--]--> <span class="font-semibold text-violet-700">${escape_html(estagioLabels[item.estagioNovo ?? ""] ?? item.estagioNovo)}</span></p>`,
          );
        } else if (item.tipo === "AGENDAMENTO") {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<div class="flex items-center gap-2 flex-wrap">`);
          if (item.status) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<span${attr_class(`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(statusAgendaClass[item.status] ?? "bg-slate-100 text-slate-600")}`)}>${escape_html(item.status)}</span>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (item.prioridade) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<span${attr_class(`text-xs font-semibold ${stringify(item.prioridade === "URGENTE" ? "text-red-600" : item.prioridade === "ALTA" ? "text-amber-600" : item.prioridade === "MEDIA" ? "text-blue-600" : "text-slate-400")} `)}>${escape_html(item.prioridade)}</span>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div> `);
          if (item.dataFim) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<p class="text-xs text-slate-400 mt-1">até ${escape_html(formatHora(item.dataFim))}</p>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (item.observacoes) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<p class="text-xs text-slate-500 mt-1">${escape_html(item.observacoes)}</p>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let id = derived(
      () => store_get(($$store_subs ??= {}), "$page", page).params.id,
    );
    let profissional = null;
    let visitas = [];
    let materiaisOptions = [];
    let timelineItens = [];
    let loading = true;
    let abaAtiva = "timeline";
    let visitaSheetOpen = false;
    let visitaEmEdicao = null;
    const potencialConfig = {
      ALTO: { label: "Alto", class: "bg-emerald-50 text-emerald-700" },
      MEDIO: { label: "Médio", class: "bg-amber-50 text-amber-700" },
      BAIXO: { label: "Baixo", class: "bg-red-50 text-red-600" },
      ESTRATEGICO: {
        label: "Estratégico",
        class: "bg-violet-50 text-violet-700",
      },
    };
    const estagioConfig = {
      PROSPECTADO: {
        label: "Prospectado",
        class: "bg-slate-100 text-slate-600",
      },
      VISITADO: { label: "Visitado", class: "bg-blue-50 text-blue-700" },
      INTERESSADO: {
        label: "Interessado",
        class: "bg-purple-50 text-purple-700",
      },
      PRESCRITOR: {
        label: "Prescritor",
        class: "bg-emerald-50 text-emerald-700",
      },
      FIDELIZADO: { label: "Fidelizado", class: "bg-amber-50 text-amber-700" },
    };
    const classificacaoConfig = {
      FORTE: { label: "Forte", class: "bg-emerald-50 text-emerald-700" },
      INTERMEDIARIO: {
        label: "Intermediário",
        class: "bg-amber-50 text-amber-700",
      },
      FRACO: { label: "Fraco", class: "bg-red-50 text-red-600" },
    };
    const tratamentoLabels = {
      DR: "Dr.",
      DRA: "Dra.",
      PROF: "Prof.",
      PROFA: "Profa.",
      SR: "Sr.",
      SRA: "Sra.",
    };
    const sexoLabels = {
      MASCULINO: "Masculino",
      FEMININO: "Feminino",
      NAO_INFORMADO: "Não informado",
    };
    async function loadData() {
      loading = true;
      try {
        const [profRes, visitasRes, matRes, timelineRes] = await Promise.all([
          apiFetch(`/profissionais/${id()}`, data.sessionToken),
          apiFetch(
            `/visitas?profissionalId=${id()}&pageSize=50`,
            data.sessionToken,
          ),
          apiFetch(`/materiais?pageSize=100`, data.sessionToken),
          apiFetch(`/profissionais/${id()}/timeline`, data.sessionToken),
        ]);
        if (profRes.ok) profissional = await profRes.json();
        if (visitasRes.ok) {
          const json = await visitasRes.json();
          visitas = json.data || json;
        }
        if (matRes.ok) {
          const json = await matRes.json();
          materiaisOptions = json.data || json;
        }
        if (timelineRes.ok) {
          const json = await timelineRes.json();
          timelineItens = json.itens || [];
        }
      } catch (err) {
        console.error(err);
      } finally {
        loading = false;
      }
    }
    function getInitials(nome) {
      return nome
        .split(" ")
        .slice(0, 2)
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase();
    }
    function getNomeCompleto(prof) {
      const prefix = prof.tratamento
        ? (tratamentoLabels[prof.tratamento] ?? "") + " "
        : "";
      return prefix + prof.nome;
    }
    const tabs = [
      { id: "timeline", label: "Timeline", icon: Activity },
      { id: "visitas", label: "Visitas", icon: Calendar },
      { id: "agenda", label: "Agenda", icon: List_todo },
      { id: "dados", label: "Dados", icon: User },
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("aho02t", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(
            `<title>${escape_html(profissional ? profissional.nome : "Perfil do Profissional")} — MediVisitas</title>`,
          );
        });
      });
      $$renderer3.push(
        `<div class="min-h-screen bg-slate-50 p-4 lg:p-8"><div class="flex items-center mb-6"><a href="/dashboard/profissionais" class="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group">`,
      );
      Arrow_left($$renderer3, {
        class: "w-4 h-4 group-hover:-translate-x-0.5 transition-transform",
      });
      $$renderer3.push(`<!----> Voltar para CRM</a></div> `);
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(
          `<div class="flex justify-center items-start pt-32"><div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div></div>`,
        );
      } else if (profissional) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(
          `<div class="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-10 items-start"><div class="col-span-1 lg:sticky lg:top-8"><div class="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col"><div class="flex flex-col items-center text-center"><div class="w-14 h-14 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xl font-bold mb-3 ring-4 ring-slate-50">${escape_html(getInitials(profissional.nome))}</div> <h1 class="text-[22px] leading-tight font-bold text-slate-950 mb-1">${escape_html(getNomeCompleto(profissional))}</h1> <p class="text-sm font-medium text-slate-500 mb-2">${escape_html(profissional.especialidade?.nome ?? "Sem especialidade")} `,
        );
        if (profissional.subEspecialidade?.nome) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<span class="text-slate-300">·</span>${escape_html(profissional.subEspecialidade.nome)}`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(
          `<!--]--></p></div> <hr class="border-slate-100 my-6"/> <div class="flex flex-wrap gap-2 justify-center mb-4">`,
        );
        if (profissional.potencial && potencialConfig[profissional.potencial]) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<span${attr_class(`inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(potencialConfig[profissional.potencial].class)}`)}>${escape_html(potencialConfig[profissional.potencial].label)}</span>`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (
          profissional.estagioPipeline &&
          estagioConfig[profissional.estagioPipeline]
        ) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<span${attr_class(`inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(estagioConfig[profissional.estagioPipeline].class)}`)}>${escape_html(estagioConfig[profissional.estagioPipeline].label)}</span>`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (
          profissional.classificacao &&
          classificacaoConfig[profissional.classificacao]
        ) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<span${attr_class(`inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider ${stringify(classificacaoConfig[profissional.classificacao].class)}`)}>${escape_html(classificacaoConfig[profissional.classificacao].label)}</span>`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> <div class="space-y-3">`);
        if (profissional.crm) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<div class="flex justify-between"><span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CRM</span> <span class="text-[13px] font-semibold text-slate-900">${escape_html(profissional.crm)}</span></div>`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (profissional.cpfCnpj) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<div class="flex justify-between"><span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CPF/CNPJ</span> <span class="text-[13px] font-semibold text-slate-900">${escape_html(profissional.cpfCnpj)}</span></div>`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (profissional.sexo) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<div class="flex justify-between"><span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sexo</span> <span class="text-[13px] font-semibold text-slate-900">${escape_html(sexoLabels[profissional.sexo] ?? profissional.sexo)}</span></div>`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (profissional.dataNascimento) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<div class="flex justify-between"><span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nasc.</span> <span class="text-[13px] font-semibold text-slate-900">${escape_html(new Date(profissional.dataNascimento).toLocaleDateString("pt-BR", { timeZone: "UTC" }))}</span></div>`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> `);
        if (profissional.observacoes) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<hr class="border-slate-100 my-4"/> <p class="text-[13px] font-medium text-slate-600 leading-relaxed bg-slate-50/50 rounded-md p-3 border border-slate-100/50">${escape_html(profissional.observacoes)}</p>`,
          );
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(
          `<!--]--> <div class="mt-auto pt-6"><a${attr("href", `/dashboard/profissionais?editId=${stringify(profissional.id)}`)} class="flex items-center justify-center gap-2 w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm rounded-lg py-2.5 transition-all outline-none cursor-pointer">`,
        );
        Pencil($$renderer3, { class: "w-3.5 h-3.5 text-slate-400" });
        $$renderer3.push(
          `<!----> Editar Cadastro</a></div></div></div> <div class="col-span-1 lg:col-span-2 xl:col-span-3"><div class="flex items-center justify-between mb-6"><div class="flex gap-1 bg-white rounded-lg border border-slate-200 p-1 shadow-sm"><!--[-->`,
        );
        const each_array = ensure_array_like(tabs);
        for (
          let $$index = 0, $$length = each_array.length;
          $$index < $$length;
          $$index++
        ) {
          let tab = each_array[$$index];
          const Icon2 = tab.icon;
          const active = abaAtiva === tab.id;
          $$renderer3.push(
            `<button type="button"${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer ${stringify(active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")} `)}>`,
          );
          if (Icon2) {
            $$renderer3.push("<!--[-->");
            Icon2($$renderer3, { class: "w-3.5 h-3.5" });
            $$renderer3.push("<!--]-->");
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push("<!--]-->");
          }
          $$renderer3.push(` ${escape_html(tab.label)}</button>`);
        }
        $$renderer3.push(
          `<!--]--></div> <button type="button" class="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 shadow-sm transition-all hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer">`,
        );
        Calendar_plus($$renderer3, { class: "w-4 h-4" });
        $$renderer3.push(`<!----> Registrar Visita</button></div> `);
        {
          $$renderer3.push("<!--[0-->");
          TimelineProfissional($$renderer3, { itens: timelineItens });
        }
        $$renderer3.push(`<!--]--></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(
          `<div class="text-center py-20"><p class="text-sm text-slate-500">Profissional não encontrado.</p> <a href="/dashboard/profissionais" class="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">Voltar à listagem</a></div>`,
        );
      }
      $$renderer3.push(`<!--]--></div> `);
      VisitaSheet($$renderer3, {
        onclose: () => {
          visitaSheetOpen = false;
        },
        onsave: () => {
          loadData();
        },
        visita: visitaEmEdicao,
        profissionalId: id(),
        sessionToken: data.sessionToken,
        materiaisOptions,
        get open() {
          return visitaSheetOpen;
        },
        set open($$value) {
          visitaSheetOpen = $$value;
          $$settled = false;
        },
      });
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
export { _page as default };
