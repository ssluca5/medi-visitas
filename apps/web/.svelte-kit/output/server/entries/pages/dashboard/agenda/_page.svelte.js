import {
  n as ssr_context,
  s as sanitize_props,
  a as spread_props,
  b as slot,
  o as attr_style,
  d as stringify,
  f as escape_html,
  h as attr_class,
  k as derived,
  e as ensure_array_like,
  l as head,
} from "../../../../chunks/index.js";
import { a as apiFetch } from "../../../../chunks/api.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { C as Chevron_left } from "../../../../chunks/chevron-left.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { C as Calendar_plus } from "../../../../chunks/calendar-plus.js";
import { V as VisitaSheet } from "../../../../chunks/VisitaSheet.js";
import { C as Calendar_days } from "../../../../chunks/calendar-days.js";
import { I as Icon } from "../../../../chunks/Icon.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function Calendar_range($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M17 14h-6" }],
    ["path", { d: "M13 18H7" }],
    ["path", { d: "M7 14h.01" }],
    ["path", { d: "M17 18h.01" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "calendar-range" },
      $$sanitized_props,
      {
        /**
         * @component @name CalendarRange
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0xNiAydjQiIC8+CiAgPHBhdGggZD0iTTMgMTBoMTgiIC8+CiAgPHBhdGggZD0iTTggMnY0IiAvPgogIDxwYXRoIGQ9Ik0xNyAxNGgtNiIgLz4KICA8cGF0aCBkPSJNMTMgMThINyIgLz4KICA8cGF0aCBkPSJNNyAxNGguMDEiIC8+CiAgPHBhdGggZD0iTTE3IDE4aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/calendar-range
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
function Sparkles($$renderer, $$props) {
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
        d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      },
    ],
    ["path", { d: "M20 3v4" }],
    ["path", { d: "M22 5h-4" }],
    ["path", { d: "M4 17v2" }],
    ["path", { d: "M5 18H3" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "sparkles" },
      $$sanitized_props,
      {
        /**
         * @component @name Sparkles
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOS45MzcgMTUuNUEyIDIgMCAwIDAgOC41IDE0LjA2M2wtNi4xMzUtMS41ODJhLjUuNSAwIDAgMSAwLS45NjJMOC41IDkuOTM2QTIgMiAwIDAgMCA5LjkzNyA4LjVsMS41ODItNi4xMzVhLjUuNSAwIDAgMSAuOTYzIDBMMTQuMDYzIDguNUEyIDIgMCAwIDAgMTUuNSA5LjkzN2w2LjEzNSAxLjU4MWEuNS41IDAgMCAxIDAgLjk2NEwxNS41IDE0LjA2M2EyIDIgMCAwIDAtMS40MzcgMS40MzdsLTEuNTgyIDYuMTM1YS41LjUgMCAwIDEtLjk2MyAweiIgLz4KICA8cGF0aCBkPSJNMjAgM3Y0IiAvPgogIDxwYXRoIGQ9Ik0yMiA1aC00IiAvPgogIDxwYXRoIGQ9Ik00IDE3djIiIC8+CiAgPHBhdGggZD0iTTUgMThIMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/sparkles
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
function AgendaItemCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { item } = $$props;
    const prioridadeCores = {
      URGENTE: "#ef4444",
      ALTA: "#f59e0b",
      MEDIA: "#3b82f6",
      BAIXA: "#94a3b8",
    };
    const statusLabels = {
      PLANEJADO: "Planejado",
      CONFIRMADO: "Confirmado",
      REALIZADO: "Realizado",
      CANCELADO: "Cancelado",
    };
    const statusColors = {
      PLANEJADO: "bg-blue-50 text-blue-700",
      CONFIRMADO: "bg-emerald-50 text-emerald-700",
      REALIZADO: "bg-slate-100 text-slate-600",
      CANCELADO: "bg-red-50 text-red-600",
    };
    let horaInicio = derived(() =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(item.dataHoraInicio)),
    );
    let horaFim = derived(() =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(item.dataHoraFim)),
    );
    let duracaoPx = derived(() => {
      const diffMs =
        new Date(item.dataHoraFim).getTime() -
        new Date(item.dataHoraInicio).getTime();
      const minutos = Math.max(1, diffMs / 6e4);
      return Math.max(minutos * 2, 75);
    });
    $$renderer2.push(
      `<div class="group relative z-10 shrink-0 rounded-lg bg-white border border-slate-200 p-3 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-[1px] shadow-sm hover:shadow-md hover:z-20 active:scale-[0.98] overflow-hidden"${attr_style(`border-left: 3px solid ${stringify(prioridadeCores[item.prioridade])}; height: ${stringify(duracaoPx())}px;`)}><div class="flex items-start justify-between gap-2"><div class="min-w-0 flex-1"><p class="text-[13px] font-semibold text-slate-800 truncate">${escape_html(item.profissional?.nome ?? "Profissional")}</p> `,
    );
    if (item.profissional?.especialidade) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<p class="text-[10px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">${escape_html(item.profissional.especialidade.nome)}</p>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(
      `<!--]--></div> <span${attr_class(`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${stringify(statusColors[item.status])}`)}>${escape_html(statusLabels[item.status])}</span></div> <div class="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">`,
    );
    Clock($$renderer2, { class: "h-3 w-3 text-slate-400" });
    $$renderer2.push(
      `<!----> <span class="font-medium">${escape_html(horaInicio())} – ${escape_html(horaFim())}</span></div> `,
    );
    if (item.observacoes) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<p class="mt-1.5 text-[11px] text-slate-400 truncate">${escape_html(item.observacoes)}</p>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function CalendarioSemanal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { items, currentDate } = $$props;
    function getLocalISODate(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    const HORA_INICIO = 7;
    const HORA_FIM = 19;
    const SLOT_HORAS = Array.from(
      { length: HORA_FIM - HORA_INICIO },
      (_, i) => HORA_INICIO + i,
    );
    let agora = /* @__PURE__ */ new Date();
    let timerInterval;
    onDestroy(() => {
      clearInterval(timerInterval);
    });
    function getInicioSemana(d) {
      const result = new Date(d);
      const day = result.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      result.setDate(result.getDate() + diff);
      result.setHours(0, 0, 0, 0);
      return result;
    }
    let inicioSemana = derived(() => getInicioSemana(currentDate));
    let diasSemana = derived(() =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(inicioSemana());
        d.setDate(d.getDate() + i);
        return d;
      }),
    );
    let itemsPorDia = derived(() => {
      const map = /* @__PURE__ */ new Map();
      for (const d of diasSemana()) {
        const key = getLocalISODate(d);
        map.set(key, []);
      }
      for (const item of items) {
        const key = getLocalISODate(new Date(item.dataHoraInicio));
        if (map.has(key)) {
          map.get(key).push(item);
        }
      }
      return map;
    });
    function isHoje(d) {
      const hoje = /* @__PURE__ */ new Date();
      return d.toISOString().slice(0, 10) === hoje.toISOString().slice(0, 10);
    }
    const dayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
    const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" });
    function formatMonth(d) {
      const f = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      });
      const str = f.format(d);
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function getItemsParaHora(dia, hora) {
      const key = getLocalISODate(dia);
      const allItems = itemsPorDia().get(key) ?? [];
      return allItems.filter((item) => {
        const h = new Date(item.dataHoraInicio).getHours();
        return h === hora;
      });
    }
    function getCurrentTimePosition(hora) {
      const h = agora.getHours();
      const m = agora.getMinutes();
      if (h !== hora) return null;
      return (m / 60) * 100;
    }
    $$renderer2.push(
      `<div class="flex flex-col h-full"><div class="flex items-center justify-between px-1 mb-4"><button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer" aria-label="Semana anterior">`,
    );
    Chevron_left($$renderer2, { class: "h-5 w-5" });
    $$renderer2.push(
      `<!----></button> <h3 class="text-lg font-bold text-slate-800">${escape_html(formatMonth(currentDate))}</h3> <button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer" aria-label="Próxima semana">`,
    );
    Chevron_right($$renderer2, { class: "h-5 w-5" });
    $$renderer2.push(
      `<!----></button></div> <div class="flex-1 overflow-auto"><div class="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] min-w-[720px]"><div class="sticky top-0 z-10 bg-white border-b border-slate-100"></div> <!--[-->`,
    );
    const each_array = ensure_array_like(diasSemana());
    for (
      let $$index = 0, $$length = each_array.length;
      $$index < $$length;
      $$index++
    ) {
      let dia = each_array[$$index];
      $$renderer2.push(
        `<div class="sticky top-0 z-10 bg-white border-b border-slate-100 text-center py-2.5 px-1"><p${attr_class(`text-[10px] uppercase tracking-wider font-semibold ${stringify(isHoje(dia) ? "text-blue-600 font-bold" : "text-slate-400")}`)}>${escape_html(dayFormatter.format(dia))}</p> <div class="flex items-center justify-center mt-1">`,
      );
      if (isHoje(dia)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(
          `<span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm">${escape_html(dateFormatter.format(dia))}</span>`,
        );
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(
          `<span class="text-sm font-bold text-slate-700">${escape_html(dateFormatter.format(dia))}</span>`,
        );
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array_1 = ensure_array_like(SLOT_HORAS);
    for (
      let $$index_3 = 0, $$length = each_array_1.length;
      $$index_3 < $$length;
      $$index_3++
    ) {
      let hora = each_array_1[$$index_3];
      $$renderer2.push(
        `<div class="relative border-r border-slate-100 pr-3 text-right" style="height: 120px;"><span class="absolute top-1 right-3 text-[11px] font-medium text-slate-400 tabular-nums">${escape_html(String(hora).padStart(2, "0"))}:00</span></div> <!--[-->`,
      );
      const each_array_2 = ensure_array_like(diasSemana());
      for (
        let diaIdx = 0, $$length2 = each_array_2.length;
        diaIdx < $$length2;
        diaIdx++
      ) {
        let dia = each_array_2[diaIdx];
        $$renderer2.push(
          `<div${attr_class(`relative border-b border-r border-slate-100 p-1 flex flex-col gap-1 transition-colors duration-150 cursor-pointer ${stringify(isHoje(dia) ? "bg-blue-50/30" : "")} hover:bg-blue-50/50 hover:z-10`)} style="height: 120px;">`,
        );
        if (isHoje(dia)) {
          $$renderer2.push("<!--[0-->");
          const pos = getCurrentTimePosition(hora);
          if (pos !== null) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(
              `<div class="absolute left-0 right-0 z-20 pointer-events-none"${attr_style(`top: ${stringify(pos)}%;`)}><div class="relative flex items-center"><div class="absolute -left-[5px] w-[10px] h-[10px] rounded-full bg-red-500 shadow-sm"></div> <div class="w-full h-[2px] bg-red-500/80"></div></div></div>`,
            );
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        const each_array_3 = ensure_array_like(getItemsParaHora(dia, hora));
        for (
          let $$index_1 = 0, $$length3 = each_array_3.length;
          $$index_1 < $$length3;
          $$index_1++
        ) {
          let item = each_array_3[$$index_1];
          AgendaItemCard($$renderer2, { item });
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
function PainelSugestoes($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { sugestoes, loading = false } = $$props;
    const potencialLabels = {
      ESTRATEGICO: "Estratégico",
      ALTO: "Alto",
      MEDIO: "Médio",
      BAIXO: "Baixo",
    };
    const potencialColors = {
      ESTRATEGICO: "bg-violet-50 text-violet-700 ring-1 ring-violet-300",
      ALTO: "bg-amber-50 text-amber-700 ring-1 ring-amber-300",
      MEDIO: "bg-blue-50 text-blue-700 ring-1 ring-blue-300",
      BAIXO: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
    };
    function formatDias(dias) {
      if (dias === null) return "Nunca visitado";
      if (dias === 0) return "Hoje";
      if (dias === 1) return "1 dia";
      return `${dias} dias`;
    }
    $$renderer2.push(
      `<div class="flex flex-col h-full"><div class="flex items-center gap-2 mb-4"><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">`,
    );
    Trending_up($$renderer2, { class: "h-4 w-4 text-blue-600" });
    $$renderer2.push(
      `<!----></div> <div><h3 class="text-sm font-semibold text-slate-800">Sugestões</h3> <p class="text-[10px] text-slate-400">Quem você deve visitar</p></div></div> `,
    );
    if (loading) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="flex justify-center py-8"><div class="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div></div>`,
      );
    } else if (sugestoes.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(
        `<div class="text-center py-8"><p class="text-sm text-slate-400">Nenhuma sugestão disponível</p></div>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(
        `<div class="space-y-3 flex-1 overflow-y-auto"><!--[-->`,
      );
      const each_array = ensure_array_like(sugestoes.slice(0, 10));
      for (
        let $$index = 0, $$length = each_array.length;
        $$index < $$length;
        $$index++
      ) {
        let sug = each_array[$$index];
        $$renderer2.push(
          `<div class="group bg-white border border-slate-200 shadow-sm rounded-xl p-4 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-md hover:border-slate-300"><div class="flex items-start justify-between gap-2"><div class="min-w-0 flex-1"><p class="text-[13px] font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors">${escape_html(sug.profissional.nome)}</p> `,
        );
        if (sug.profissional.especialidade) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(
            `<p class="text-[10px] text-slate-400 mt-0.5 truncate">${escape_html(sug.profissional.especialidade.nome)}</p>`,
          );
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(
          `<!--]--></div> <div class="flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-600" title="Pontuação de prioridade">`,
        );
        Trending_up($$renderer2, { class: "h-2.5 w-2.5" });
        $$renderer2.push(
          `<!----> ${escape_html(sug.pontuacao)}</div></div> <div class="mt-2 flex items-center gap-3"><span${attr_class(`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${stringify(potencialColors[sug.profissional.potencial])}`)}>${escape_html(potencialLabels[sug.profissional.potencial])}</span> <span class="flex items-center gap-1 text-[10px] text-slate-400">`,
        );
        Clock($$renderer2, { class: "h-2.5 w-2.5" });
        $$renderer2.push(
          `<!----> ${escape_html(formatDias(sug.diasSemVisita))}</span></div> <button type="button" class="flex w-full items-center justify-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 mt-3 py-2 rounded-lg font-medium text-[12px] transition-colors duration-200 ease-out active:scale-[0.98] cursor-pointer">`,
        );
        Calendar_plus($$renderer2, { class: "h-3.5 w-3.5" });
        $$renderer2.push(`<!----> Agendar Visita</button></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let items = [];
    let sugestoes = [];
    let loading = true;
    let loadingSugestoes = false;
    let materiaisOptions = [];
    let currentDate = /* @__PURE__ */ new Date();
    let sheetOpen = false;
    let selectedVisita = null;
    let agendarProfissionalId = "";
    let agendarProfissionalNome = "";
    let dateRange = derived(() => () => {
      {
        const d = new Date(currentDate);
        const day = d.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const start = new Date(d);
        start.setDate(d.getDate() + diff);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
    });
    async function loadItems() {
      loading = true;
      try {
        const range = dateRange()();
        const params = new URLSearchParams({
          dataInicio: range.start.toISOString(),
          dataFim: range.end.toISOString(),
          pageSize: "100",
          // Using Visitas max page size
        });
        const res = await apiFetch(`/visitas?${params}`, data.sessionToken);
        let newItems = [];
        if (res.ok) {
          const jsonVisitas = await res.json();
          const visitas = jsonVisitas.data || [];
          for (const v of visitas) {
            const startDt = new Date(v.dataVisita);
            const endDt = new Date(startDt);
            endDt.setMinutes(startDt.getMinutes() + (v.duracaoMinutos || 30));
            let mapStatus = "REALIZADO";
            if (v.status === "AGENDADA") mapStatus = "CONFIRMADO";
            else if (v.status === "CANCELADA" || v.status === "NAO_REALIZADA")
              mapStatus = "CANCELADO";
            newItems.push({
              id: `v-${v.id}`,
              profissionalId: v.profissionalId,
              visitaId: v.id,
              dataHoraInicio: startDt.toISOString(),
              dataHoraFim: endDt.toISOString(),
              status: mapStatus,
              prioridade: "MEDIA",
              observacoes: v.resumo || v.objetivoVisita || null,
              profissional: {
                id: v.profissionalId,
                nome: v.profissional?.nome || "Profissional",
                especialidade: v.profissional?.especialidade || null,
              },
              createdAt: v.createdAt,
              updatedAt: v.updatedAt,
              // we sneak in rawVisita so handleItemClick can pass it to VisitaSheet
              rawVisita: v,
            });
          }
        }
        newItems.sort(
          (a, b) =>
            new Date(a.dataHoraInicio).getTime() -
            new Date(b.dataHoraInicio).getTime(),
        );
        items = newItems;
      } catch (e) {
        console.error("Erro ao carregar agenda:", e);
      } finally {
        loading = false;
      }
    }
    async function loadSugestoes() {
      loadingSugestoes = true;
      try {
        const range = dateRange()();
        const params = new URLSearchParams({
          dataInicio: range.start.toISOString(),
          dataFim: range.end.toISOString(),
        });
        const res = await apiFetch(
          `/agenda/sugestoes?${params}`,
          data.sessionToken,
        );
        if (res.ok) {
          const json = await res.json();
          sugestoes = json.data || [];
        }
      } catch (e) {
        console.error("Erro ao carregar sugestões:", e);
      } finally {
        loadingSugestoes = false;
      }
    }
    function handleVisitaDelete(id) {
      loadItems();
      loadSugestoes();
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1vajkwu", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Agenda | MediVisitas</title>`);
        });
        $$renderer4.push(
          `<meta name="description" content="Agenda inteligente de visitas médicas"/>`,
        );
      });
      $$renderer3.push(
        `<div class="flex flex-col h-full overflow-hidden"><div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">`,
      );
      Calendar_days($$renderer3, { class: "h-4.5 w-4.5 text-white" });
      $$renderer3.push(
        `<!----></div> <div><h1 class="text-lg font-bold text-slate-800">Agenda</h1> <p class="text-[11px] text-slate-400">Planeje visitas e acompanhe compromissos</p></div></div> <div class="flex items-center gap-2"><div class="flex rounded-lg bg-slate-100 p-0.5"><button type="button"${attr_class(
          `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${stringify(
            "bg-white text-slate-800 shadow-sm",
          )}`,
        )}>`,
      );
      Calendar_range($$renderer3, { class: "h-3.5 w-3.5" });
      $$renderer3.push(
        `<!----> Semana</button> <button type="button"${attr_class(`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${stringify("text-slate-500 hover:text-slate-700")}`)}>`,
      );
      Calendar_days($$renderer3, { class: "h-3.5 w-3.5" });
      $$renderer3.push(
        `<!----> Mês</button></div> <button type="button"${attr_class(
          `flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${stringify(
            "border-blue-200 bg-blue-50 text-blue-700",
          )}`,
        )}>`,
      );
      Sparkles($$renderer3, { class: "h-3.5 w-3.5" });
      $$renderer3.push(
        `<!----> Sugestões</button></div></div> <div class="flex flex-1 overflow-hidden"><div class="flex-1 overflow-auto p-4">`,
      );
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(
          `<div class="flex items-center justify-center h-64"><div class="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div></div>`,
        );
      } else {
        $$renderer3.push("<!--[1-->");
        CalendarioSemanal($$renderer3, {
          items,
          currentDate,
        });
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(
          `<div class="w-[300px] border-l border-slate-100 bg-slate-50/50 p-4 overflow-y-auto">`,
        );
        PainelSugestoes($$renderer3, {
          sugestoes,
          loading: loadingSugestoes,
        });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--></div></div> `);
      VisitaSheet($$renderer3, {
        visita: selectedVisita,
        profissionalId: agendarProfissionalId,
        profissionalNome: agendarProfissionalNome,
        defaultDateTime: void 0,
        sessionToken: data.sessionToken,
        materiaisOptions,
        onclose: () => (sheetOpen = false),
        onsave: () => {
          loadItems();
          loadSugestoes();
        },
        ondelete: handleVisitaDelete,
        get open() {
          return sheetOpen;
        },
        set open($$value) {
          sheetOpen = $$value;
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
  });
}
export { _page as default };
