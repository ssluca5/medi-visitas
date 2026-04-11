import {
  s as sanitize_props,
  a as spread_props,
  b as slot,
  h as attr_class,
  f as escape_html,
  d as stringify,
  e as ensure_array_like,
  o as attr_style,
  k as derived,
  i as attr,
  l as head,
} from "../../../../chunks/index.js";
import { a as apiFetch } from "../../../../chunks/api.js";
import { B as Button } from "../../../../chunks/Button.js";
import "../../../../chunks/toast.js";
import { S as Search } from "../../../../chunks/search.js";
import { X } from "../../../../chunks/x.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
import { U as Users } from "../../../../chunks/users.js";
import { C as Calendar_check } from "../../../../chunks/calendar-check.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
function Download($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "7 10 12 15 17 10" }],
    ["line", { x1: "12", x2: "12", y1: "15", y2: "3" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "download" },
      $$sanitized_props,
      {
        /**
         * @component @name Download
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIgLz4KICA8cG9seWxpbmUgcG9pbnRzPSI3IDEwIDEyIDE1IDE3IDEwIiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTUiIHkyPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/download
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
function Grip_vertical($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { cx: "9", cy: "12", r: "1" }],
    ["circle", { cx: "9", cy: "5", r: "1" }],
    ["circle", { cx: "9", cy: "19", r: "1" }],
    ["circle", { cx: "15", cy: "12", r: "1" }],
    ["circle", { cx: "15", cy: "5", r: "1" }],
    ["circle", { cx: "15", cy: "19", r: "1" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "grip-vertical" },
      $$sanitized_props,
      {
        /**
         * @component @name GripVertical
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjUiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjE5IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iMTUiIGN5PSI1IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTkiIHI9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/grip-vertical
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
function Refresh_cw($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
    ["path", { d: "M21 3v5h-5" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
    ["path", { d: "M8 16H3v5" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "refresh-cw" },
      $$sanitized_props,
      {
        /**
         * @component @name RefreshCw
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAwIDEgOS05IDkuNzUgOS43NSAwIDAgMSA2Ljc0IDIuNzRMMjEgOCIgLz4KICA8cGF0aCBkPSJNMjEgM3Y1aC01IiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIgLz4KICA8cGF0aCBkPSJNOCAxNkgzdjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/refresh-cw
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
function CardMetrica($$renderer, $$props) {
  let { titulo, valor, subtitulo, icone: Icon2, corIcone, variacao } = $$props;
  $$renderer.push(
    `<div class="card-surface p-5 flex flex-col items-center justify-center text-center min-h-[110px] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm"><div${attr_class(`flex h-9 w-9 items-center justify-center rounded-xl ${stringify(corIcone)} mb-2`)}>`,
  );
  if (Icon2) {
    $$renderer.push("<!--[-->");
    Icon2($$renderer, { class: "h-4 w-4" });
    $$renderer.push("<!--]-->");
  } else {
    $$renderer.push("<!--[!-->");
    $$renderer.push("<!--]-->");
  }
  $$renderer.push(
    `</div> <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">${escape_html(titulo)}</p> <div class="flex items-center gap-2 mt-0.5"><p class="text-xl font-bold text-slate-900 leading-none">${escape_html(valor)}</p> `,
  );
  if (variacao !== void 0) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(
      `<span${attr_class(`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${stringify(variacao >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}`)}>${escape_html(variacao >= 0 ? "+" : "")}${escape_html(variacao)}%</span>`,
    );
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div> `);
  if (subtitulo) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(
      `<p class="text-[11px] text-slate-400 mt-1.5">${escape_html(subtitulo)}</p>`,
    );
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function FunilPipeline($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { totaisPorEstagio } = $$props;
    const ETAPAS = [
      {
        key: "PROSPECTADO",
        label: "Prospectado",
        cssVar: "--pipeline-prospectado",
      },
      {
        key: "VISITADO",
        label: "Visitado",
        cssVar: "--pipeline-visitado",
      },
      {
        key: "INTERESSADO",
        label: "Interessado",
        cssVar: "--pipeline-interessado",
      },
      {
        key: "PRESCRITOR",
        label: "Prescritor",
        cssVar: "--pipeline-prescritor",
      },
      {
        key: "FIDELIZADO",
        label: "Fidelizado",
        cssVar: "--pipeline-fidelizado",
      },
    ];
    const total = derived(() =>
      totaisPorEstagio
        ? Object.values(totaisPorEstagio).reduce((a, b) => a + b, 0)
        : 0,
    );
    $$renderer2.push(
      `<div class="card-surface p-5"><h3 class="text-sm font-semibold text-slate-700 mb-4">Funil de Conversão</h3> <div class="grid grid-cols-5 gap-4"><!--[-->`,
    );
    const each_array = ensure_array_like(ETAPAS);
    for (
      let $$index = 0, $$length = each_array.length;
      $$index < $$length;
      $$index++
    ) {
      let etapa = each_array[$$index];
      const count = totaisPorEstagio?.[etapa.key] ?? 0;
      const pct = total() > 0 ? Math.round((count / total()) * 100) : 0;
      $$renderer2.push(
        `<div class="flex flex-col items-center gap-2"><span class="text-[11px] font-medium text-slate-500 truncate w-full text-center">${escape_html(etapa.label)}</span> <span class="text-2xl font-bold text-slate-800">${escape_html(pct)}%</span> <span class="text-[11px] text-slate-400">${escape_html(count)} prof.</span> <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full rounded-full transition-[width] duration-500 ease-out"${attr_style(`width: ${stringify(pct)}%; background-color: var(${stringify(etapa.cssVar)})`)}></div></div></div>`,
      );
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function KanbanPipeline($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { pipeline, busca } = $$props;
    const COLUNAS = [
      {
        key: "PROSPECTADO",
        label: "Prospectado",
        cssVar: "--pipeline-prospectado",
      },
      {
        key: "VISITADO",
        label: "Visitado",
        cssVar: "--pipeline-visitado",
      },
      {
        key: "INTERESSADO",
        label: "Interessado",
        cssVar: "--pipeline-interessado",
      },
      {
        key: "PRESCRITOR",
        label: "Prescritor",
        cssVar: "--pipeline-prescritor",
      },
      {
        key: "FIDELIZADO",
        label: "Fidelizado",
        cssVar: "--pipeline-fidelizado",
      },
    ];
    function potencialBadge(potencial) {
      switch (potencial) {
        case "ALTO":
          return "bg-emerald-100 text-emerald-800";
        case "MEDIO":
          return "bg-amber-100 text-amber-800";
        case "BAIXO":
          return "bg-orange-100 text-orange-800";
        case "ESTRATEGICO":
          return "bg-indigo-100 text-indigo-800";
        default:
          return "bg-slate-100 text-slate-500";
      }
    }
    let dragProfId = null;
    let dropTarget = null;
    $$renderer2.push(`<div class="mb-4"><div class="relative">`);
    Search($$renderer2, {
      class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400",
    });
    $$renderer2.push(
      `<!----> <input type="text" placeholder="Buscar por nome ou CRM..."${attr("value", busca)} class="w-full pl-10 pr-8 h-9 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"/> `,
    );
    if (busca) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<button class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded hover:bg-slate-100">`,
      );
      X($$renderer2, { class: "h-3.5 w-3.5 text-slate-400" });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(
      `<!--]--></div></div> <div class="flex gap-3 h-[calc(100vh-350px)] min-h-[400px] overflow-x-auto"><!--[-->`,
    );
    const each_array = ensure_array_like(COLUNAS);
    for (
      let $$index_1 = 0, $$length = each_array.length;
      $$index_1 < $$length;
      $$index_1++
    ) {
      let col = each_array[$$index_1];
      const profissionais = pipeline?.data[col.key] ?? [];
      const total = pipeline?.totaisPorEstagio[col.key] ?? 0;
      $$renderer2.push(
        `<div${attr_class(`flex-1 min-w-[160px] flex flex-col rounded-xl ${stringify(dropTarget === col.key ? "bg-blue-50/60 ring-2 ring-blue-300 ring-inset" : "")}`)}${attr("data-col", col.key)} role="region"><div class="h-10 flex items-center justify-between px-3 mb-2 flex-shrink-0"><div class="flex items-center gap-2"><div class="h-2.5 w-2.5 rounded-full flex-shrink-0"${attr_style(`background-color: var(${stringify(col.cssVar)})`)}></div> <span class="text-[12px] font-semibold text-slate-700">${escape_html(col.label)}</span> <span class="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">${escape_html(total)}</span></div></div> `,
      );
      if (profissionais.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(
          `<div${attr_class(`flex items-center justify-center h-[84px] rounded-lg border border-dashed border-slate-200 bg-slate-50/50 mx-0.5 ${stringify(dropTarget === col.key ? "border-blue-300 bg-blue-50/40" : "")}`)}><p class="text-[11px] text-slate-400">${escape_html(dropTarget === col.key ? "Solte aqui" : "Nenhum profissional")}</p></div>`,
        );
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(
          `<div class="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-0.5"><!--[-->`,
        );
        const each_array_1 = ensure_array_like(profissionais);
        for (
          let $$index = 0, $$length2 = each_array_1.length;
          $$index < $$length2;
          $$index++
        ) {
          let prof = each_array_1[$$index];
          const isDragging = dragProfId === prof.id;
          $$renderer2.push(
            `<div role="button" tabindex="0" draggable="true"${attr_class(`text-left w-full rounded-lg border border-slate-200 bg-white hover:border-slate-300 px-3 py-2.5 min-h-[80px] flex flex-col justify-between cursor-grab select-none transition-all duration-200 hover:shadow-sm ${stringify(isDragging ? "opacity-40 scale-95" : "")}`)}><div class="flex items-start gap-1.5">`,
          );
          Grip_vertical($$renderer2, {
            class: "h-3.5 w-3.5 text-slate-300 mt-0.5 shrink-0",
          });
          $$renderer2.push(
            `<!----> <p class="text-[13px] font-medium text-slate-800 leading-snug min-w-0 flex-1">${escape_html(prof.nome)}</p></div> <div class="flex items-center justify-between mt-2 gap-1 pl-5"><p class="text-[10px] text-slate-400 truncate flex-1">${escape_html(prof.especialidade?.nome ?? "—")}</p> <span${attr_class(`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${stringify(potencialBadge(prof.potencial))}`)}>${escape_html(prof.potencial)}</span></div> <p class="text-[10px] text-slate-400 mt-1 pl-5">CRM ${escape_html(prof.crm ?? "—")}</p></div>`,
          );
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function GraficoVisitas($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { dados } = $$props;
    const BAR_GROUP_WIDTH = 52;
    const BAR_WIDTH = 12;
    const GAP = 4;
    const HEIGHT = 300;
    const PADDING = { top: 16, bottom: 34, left: 10, right: 10 };
    const chartH = HEIGHT - PADDING.top - PADDING.bottom;
    const maxValor = derived(() =>
      Math.max(
        1,
        ...dados.map((d) => Math.max(d.REALIZADA, d.AGENDADA, d.CANCELADA)),
      ),
    );
    const svgWidth = derived(() =>
      Math.max(
        400,
        dados.length * (BAR_GROUP_WIDTH + GAP * 3) +
          PADDING.left +
          PADDING.right,
      ),
    );
    const COLORS = {
      REALIZADA: "#2563eb",
      AGENDADA: "#bae6fd",
      CANCELADA: "#94a3b8",
    };
    let tooltip = null;
    $$renderer2.push(
      `<div class="card-surface p-5"><div class="mb-4"><h3 class="text-base font-bold text-slate-800">Visitas por Período</h3> <p class="text-xs text-slate-500 mt-1">Comparativo de status ao longo das semanas</p></div> `,
    );
    if (dados.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="flex items-center justify-center h-[300px] rounded-lg border border-dashed border-slate-200"><p class="text-[11px] text-slate-400">Sem dados para o período selecionado</p></div>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(
        `<div class="overflow-x-auto relative h-[300px]"><svg${attr("width", svgWidth())}${attr("height", HEIGHT)} class="block w-full h-full"${attr("viewBox", `0 0 ${stringify(svgWidth())} ${stringify(HEIGHT)}`)} preserveAspectRatio="xMidYMid meet"><!--[-->`,
      );
      const each_array = ensure_array_like([0, 0.25, 0.5, 0.75, 1]);
      for (
        let $$index = 0, $$length = each_array.length;
        $$index < $$length;
        $$index++
      ) {
        let ratio = each_array[$$index];
        const y = PADDING.top + chartH * (1 - ratio);
        $$renderer2.push(
          `<line${attr("x1", PADDING.left)}${attr("y1", y)}${attr("x2", svgWidth() - PADDING.right)}${attr("y2", y)} stroke="#f1f5f9" stroke-width="1" stroke-dasharray="5 5"></line>`,
        );
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array_1 = ensure_array_like(dados);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let d = each_array_1[i];
        const x = PADDING.left + i * (BAR_GROUP_WIDTH + GAP * 3) + GAP * 2;
        const hR = (d.REALIZADA / maxValor()) * chartH;
        const hA = (d.AGENDADA / maxValor()) * chartH;
        const hC = (d.CANCELADA / maxValor()) * chartH;
        if (tooltip?.d === d) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(
            `<rect${attr("x", x - GAP)}${attr("y", PADDING.top)}${attr("width", BAR_GROUP_WIDTH + GAP * 2)}${attr("height", chartH)} fill="rgba(0,0,0,0.03)" rx="4"></rect>`,
          );
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(
          `<!--]--><rect${attr("x", x)}${attr("y", PADDING.top + chartH - hR)}${attr("width", BAR_WIDTH)}${attr("height", hR)} rx="3"${attr("fill", COLORS.REALIZADA)} class="transition-[fill,height,y] duration-300"></rect><rect${attr("x", x + BAR_WIDTH + GAP)}${attr("y", PADDING.top + chartH - hA)}${attr("width", BAR_WIDTH)}${attr("height", hA)} rx="3"${attr("fill", COLORS.AGENDADA)} class="transition-[fill,height,y] duration-300"></rect><rect${attr("x", x + (BAR_WIDTH + GAP) * 2)}${attr("y", PADDING.top + chartH - hC)}${attr("width", BAR_WIDTH)}${attr("height", hC)} rx="3"${attr("fill", COLORS.CANCELADA)} class="transition-[fill,height,y] duration-300"></rect><text${attr("x", x + BAR_GROUP_WIDTH / 2)}${attr("y", HEIGHT - 8)} text-anchor="middle" class="fill-slate-400 text-[10px]">${escape_html(d.label)}</text>`,
        );
      }
      $$renderer2.push(`<!--]--></svg> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(
        `<!--]--></div> <div class="flex items-center justify-center gap-4 mt-3"><div class="flex items-center gap-1.5"><div class="h-2.5 w-2.5 rounded-sm"${attr_style(`background-color: ${stringify(COLORS.REALIZADA)}`)}></div> <span class="text-[11px] text-slate-500 font-medium">Realizada</span></div> <div class="flex items-center gap-1.5"><div class="h-2.5 w-2.5 rounded-sm"${attr_style(`background-color: ${stringify(COLORS.AGENDADA)}`)}></div> <span class="text-[11px] text-slate-500 font-medium">Agendada</span></div> <div class="flex items-center gap-1.5"><div class="h-2.5 w-2.5 rounded-sm"${attr_style(`background-color: ${stringify(COLORS.CANCELADA)}`)}></div> <span class="text-[11px] text-slate-500 font-medium">Cancelada</span></div></div>`,
      );
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function GraficoConversao($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { dados } = $$props;
    const ESTAGIOS = [
      {
        key: "PROSPECTADO",
        cssVar: "--pipeline-prospectado",
        label: "Prospectado",
        hex: "#f59e0b",
      },
      {
        key: "VISITADO",
        cssVar: "--pipeline-visitado",
        label: "Visitado",
        hex: "#3b82f6",
      },
      {
        key: "INTERESSADO",
        cssVar: "--pipeline-interessado",
        label: "Interessado",
        hex: "#8b5cf6",
      },
      {
        key: "PRESCRITOR",
        cssVar: "--pipeline-prescritor",
        label: "Prescritor",
        hex: "#10b981",
      },
      {
        key: "FIDELIZADO",
        cssVar: "--pipeline-fidelizado",
        label: "Fidelizado",
        hex: "#059669",
      },
    ];
    const HEIGHT = 300;
    const PADDING = { top: 16, right: 16, bottom: 38, left: 40 };
    const svgWidth = derived(() =>
      Math.max(400, dados.length * 80 + PADDING.left + PADDING.right),
    );
    const chartH = derived(() => HEIGHT - PADDING.top - PADDING.bottom);
    const chartW = derived(() => svgWidth() - PADDING.left - PADDING.right);
    const maxValor = derived(() =>
      Math.max(1, ...dados.flatMap((d) => ESTAGIOS.map((e) => d[e.key]))),
    );
    function xScale(i) {
      if (dados.length <= 1) return PADDING.left + chartW() / 2;
      return PADDING.left + (i / (dados.length - 1)) * chartW();
    }
    function yScale(v) {
      return PADDING.top + chartH() - (v / maxValor()) * chartH();
    }
    function buildSmoothPath(key) {
      if (dados.length === 0) return "";
      const points = dados.map((d, i) => {
        const v = d[key];
        return { x: xScale(i), y: yScale(v) };
      });
      if (points.length === 1) return `M${points[0].x},${points[0].y}`;
      if (points.length === 2)
        return `M${points[0].x},${points[0].y}L${points[1].x},${points[1].y}`;
      let path = `M${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        path += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      return path;
    }
    function buildAreaPath(key) {
      if (dados.length === 0) return "";
      const linePath = buildSmoothPath(key);
      const lastX = xScale(dados.length - 1);
      const firstX = xScale(0);
      const bottom = PADDING.top + chartH();
      return `${linePath}L${lastX},${bottom}L${firstX},${bottom}Z`;
    }
    let tooltip = null;
    $$renderer2.push(
      `<div class="card-surface p-5"><div class="mb-4"><h3 class="text-base font-bold text-slate-800">Evolução do Pipeline</h3> <p class="text-xs text-slate-500 mt-1">Acompanhe a progressão dos profissionais por estágio</p></div> `,
    );
    if (dados.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="flex items-center justify-center h-[300px] rounded-lg border border-dashed border-slate-200"><p class="text-[11px] text-slate-400">Sem dados para o período selecionado</p></div>`,
      );
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(
        `<div class="overflow-x-auto relative h-[300px]"><svg${attr("width", svgWidth())}${attr("height", HEIGHT)} class="block w-full h-full"${attr("viewBox", `0 0 ${stringify(svgWidth())} ${stringify(HEIGHT)}`)} preserveAspectRatio="xMidYMid meet"><defs><!--[-->`,
      );
      const each_array = ensure_array_like(ESTAGIOS);
      for (
        let $$index = 0, $$length = each_array.length;
        $$index < $$length;
        $$index++
      ) {
        let estagio = each_array[$$index];
        $$renderer2.push(
          `<linearGradient${attr("id", `grad-${stringify(estagio.key)}`)} x1="0" y1="0" x2="0" y2="1"><stop offset="0%"${attr("stop-color", estagio.hex)} stop-opacity="0.20"></stop><stop offset="100%"${attr("stop-color", estagio.hex)} stop-opacity="0.02"></stop></linearGradient>`,
        );
      }
      $$renderer2.push(`<!--]--></defs><!--[-->`);
      const each_array_1 = ensure_array_like([0, 0.25, 0.5, 0.75, 1]);
      for (
        let $$index_1 = 0, $$length = each_array_1.length;
        $$index_1 < $$length;
        $$index_1++
      ) {
        let ratio = each_array_1[$$index_1];
        const y = PADDING.top + chartH() * (1 - ratio);
        $$renderer2.push(
          `<line${attr("x1", PADDING.left)}${attr("y1", y)}${attr("x2", PADDING.left + chartW())}${attr("y2", y)} stroke="#f1f5f9" stroke-width="1" stroke-dasharray="5 5"></line><text${attr("x", PADDING.left - 6)}${attr("y", y + 3)} text-anchor="end" class="fill-slate-300 text-[9px]">${escape_html(Math.round(maxValor() * ratio))}</text>`,
        );
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array_2 = ensure_array_like(dados);
      for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
        each_array_2[i];
        const x = xScale(i);
        $$renderer2.push(
          `<rect${attr("x", x - 20)}${attr("y", PADDING.top)}${attr("width", 40)}${attr("height", chartH())} fill="transparent" class="cursor-pointer" role="presentation"></rect>`,
        );
        if (tooltip?.i === i) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(
            `<line${attr("x1", x)}${attr("y1", PADDING.top)}${attr("x2", x)}${attr("y2", PADDING.top + chartH())} stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"></line>`,
          );
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array_3 = ensure_array_like(ESTAGIOS);
      for (
        let $$index_3 = 0, $$length = each_array_3.length;
        $$index_3 < $$length;
        $$index_3++
      ) {
        let estagio = each_array_3[$$index_3];
        $$renderer2.push(
          `<path${attr("d", buildAreaPath(estagio.key))}${attr("fill", `url(#grad-${stringify(estagio.key)})`)} class="transition-[d,fill,stroke,cx,cy] duration-300"></path><path${attr("d", buildSmoothPath(estagio.key))} fill="none"${attr("stroke", estagio.hex)} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-[d,fill,stroke,cx,cy] duration-300"></path>`,
        );
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array_4 = ensure_array_like(dados);
      for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
        let d = each_array_4[i];
        const x = xScale(i);
        $$renderer2.push(`<!--[-->`);
        const each_array_5 = ensure_array_like(ESTAGIOS);
        for (
          let $$index_4 = 0, $$length2 = each_array_5.length;
          $$index_4 < $$length2;
          $$index_4++
        ) {
          let estagio = each_array_5[$$index_4];
          const v = d[estagio.key];
          $$renderer2.push(
            `<circle${attr("cx", x)}${attr("cy", yScale(v))} r="3" fill="white"${attr("stroke", estagio.hex)} stroke-width="2" class="transition-[d,fill,stroke,cx,cy] duration-300"></circle>`,
          );
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array_6 = ensure_array_like(dados);
      for (let i = 0, $$length = each_array_6.length; i < $$length; i++) {
        let d = each_array_6[i];
        $$renderer2.push(
          `<text${attr("x", xScale(i))}${attr("y", HEIGHT - 8)} text-anchor="middle" class="fill-slate-400 text-[9px]">${escape_html(d.label)}</text>`,
        );
      }
      $$renderer2.push(`<!--]--></svg> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(
        `<!--]--></div> <div class="flex flex-wrap items-center justify-center gap-3 mt-3"><!--[-->`,
      );
      const each_array_8 = ensure_array_like(ESTAGIOS);
      for (
        let $$index_8 = 0, $$length = each_array_8.length;
        $$index_8 < $$length;
        $$index_8++
      ) {
        let estagio = each_array_8[$$index_8];
        $$renderer2.push(
          `<div class="flex items-center gap-1.5"><div class="h-2.5 w-2.5 rounded-full"${attr_style(`background-color: ${stringify(estagio.hex)}`)}></div> <span class="text-[11px] text-slate-500 font-medium">${escape_html(estagio.label)}</span></div>`,
        );
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let pipeline = null;
    let metricas = null;
    let evolucao = [];
    let visitasPeriodo = [];
    let loading = true;
    let erro = null;
    let busca = "";
    let granularidade = "semana";
    const hoje = /* @__PURE__ */ new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1e3);
    let dataInicio = trintaDiasAtras.toISOString().split("T")[0];
    let dataFim = hoje.toISOString().split("T")[0];
    let pipelineFiltrado = derived(() => {
      if (!pipeline) return null;
      if (!busca.trim()) return pipeline;
      const termo = busca.toLowerCase();
      const filtrado = {
        PROSPECTADO: [],
        VISITADO: [],
        INTERESSADO: [],
        PRESCRITOR: [],
        FIDELIZADO: [],
      };
      const totais = {
        PROSPECTADO: 0,
        VISITADO: 0,
        INTERESSADO: 0,
        PRESCRITOR: 0,
        FIDELIZADO: 0,
      };
      for (const key of Object.keys(pipeline.data)) {
        filtrado[key] = pipeline.data[key].filter(
          (p) =>
            p.nome.toLowerCase().includes(termo) ||
            (p.crm && p.crm.toLowerCase().includes(termo)),
        );
        totais[key] = filtrado[key].length;
      }
      return {
        data: filtrado,
        totaisPorEstagio: totais,
        totalGeral: Object.values(totais).reduce((a, b) => a + b, 0),
      };
    });
    async function carregarDados() {
      loading = true;
      erro = null;
      try {
        const qs = `dataInicio=${dataInicio}&dataFim=${dataFim}`;
        const [pipelineRes, metricasRes, evolucaoRes, visitasRes] =
          await Promise.all([
            apiFetch("/pipeline", data.sessionToken),
            apiFetch(`/pipeline/metricas?${qs}`, data.sessionToken),
            apiFetch(
              `/pipeline/evolucao?${qs}&granularidade=${granularidade}`,
              data.sessionToken,
            ),
            apiFetch(
              `/pipeline/visitas-por-periodo?${qs}&granularidade=${granularidade}`,
              data.sessionToken,
            ),
          ]);
        if (pipelineRes.ok) pipeline = await pipelineRes.json();
        if (metricasRes.ok) metricas = await metricasRes.json();
        if (evolucaoRes.ok) {
          const json = await evolucaoRes.json();
          evolucao = json.data ?? [];
        }
        if (visitasRes.ok) {
          const json = await visitasRes.json();
          visitasPeriodo = json.data ?? [];
        }
        if (!pipelineRes.ok || !metricasRes.ok) {
          erro = "Erro ao carregar alguns dados do pipeline";
        }
      } catch (e) {
        erro = "Erro ao conectar com o servidor";
        console.error(e);
      } finally {
        loading = false;
      }
    }
    async function exportarCSV() {
      try {
        const res = await apiFetch("/pipeline/exportar", data.sessionToken);
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `pipeline-${/* @__PURE__ */ new Date().toISOString().split("T")[0]}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch (e) {
        console.error("Erro ao exportar:", e);
      }
    }
    head("4u8lvo", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Pipeline — MediVisitas</title>`);
      });
    });
    $$renderer2.push(
      `<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">`,
    );
    Chart_column($$renderer2, { class: "h-4.5 w-4.5 text-white" });
    $$renderer2.push(
      `<!----></div> <div><h1 class="text-lg font-bold text-slate-800">Pipeline</h1> <p class="text-[11px] text-slate-400">Funil de conversão e analytics</p></div></div> <div class="flex items-center gap-2">`,
    );
    Button($$renderer2, {
      variant: "outline",
      size: "sm",
      onclick: carregarDados,
      children: ($$renderer3) => {
        Refresh_cw($$renderer3, { class: "h-3.5 w-3.5 mr-1.5" });
        $$renderer3.push(`<!----> Atualizar`);
      },
      $$slots: { default: true },
    });
    $$renderer2.push(`<!----> `);
    Button($$renderer2, {
      variant: "outline",
      size: "sm",
      onclick: exportarCSV,
      children: ($$renderer3) => {
        Download($$renderer3, { class: "h-3.5 w-3.5 mr-1.5" });
        $$renderer3.push(`<!----> Exportar CSV`);
      },
      $$slots: { default: true },
    });
    $$renderer2.push(
      `<!----></div></div> <div class="card-surface p-3 mb-6 flex flex-wrap items-center gap-3"><label class="flex items-center gap-2"><span class="text-[12px] font-medium text-slate-500">De:</span> <input type="date"${attr("value", dataInicio)} class="h-8 rounded-lg border border-slate-200 px-2 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand-primary))]/50 cursor-pointer"/></label> <label class="flex items-center gap-2"><span class="text-[12px] font-medium text-slate-500">Até:</span> <input type="date"${attr("value", dataFim)} class="h-8 rounded-lg border border-slate-200 px-2 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand-primary))]/50 cursor-pointer"/></label> <div class="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5"><button${attr_class(
        `px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${stringify(
          "bg-white text-slate-800 shadow-sm",
        )}`,
      )}>Semana</button> <button${attr_class(`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${stringify("text-slate-500 hover:text-slate-700")}`)}>Mês</button></div></div> `,
    );
    if (loading) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64">`);
      Refresh_cw($$renderer2, { class: "h-6 w-6 text-slate-400 animate-spin" });
      $$renderer2.push(`<!----></div>`);
    } else if (erro) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(
        `<div class="card-surface p-8 text-center"><p class="text-sm text-red-500 font-medium">${escape_html(erro)}</p> `,
      );
      Button($$renderer2, {
        variant: "outline",
        size: "sm",
        class: "mt-3",
        onclick: carregarDados,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Tentar novamente`);
        },
        $$slots: { default: true },
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(
        `<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">`,
      );
      CardMetrica($$renderer2, {
        titulo: "Total Profissionais",
        valor: metricas?.totalProfissionais ?? 0,
        icone: Users,
        corIcone: "bg-blue-50 text-blue-600",
      });
      $$renderer2.push(`<!----> `);
      CardMetrica($$renderer2, {
        titulo: "Visitas Realizadas",
        valor: metricas?.visitasRealizadas ?? 0,
        subtitulo: `${stringify(metricas?.visitasPlanejadas ?? 0)} planejadas no período`,
        icone: Calendar_check,
        corIcone: "bg-violet-50 text-violet-600",
      });
      $$renderer2.push(`<!----> `);
      CardMetrica($$renderer2, {
        titulo: "Média/Semana",
        valor: metricas?.mediaVisitasPorSemana ?? 0,
        icone: Trending_up,
        corIcone: "bg-emerald-50 text-emerald-600",
      });
      $$renderer2.push(`<!----> `);
      CardMetrica($$renderer2, {
        titulo: "Sem Visita (30d)",
        valor: metricas?.profissionaisSemVisitaUltimos30Dias ?? 0,
        icone: Users,
        corIcone: "bg-amber-50 text-amber-600",
      });
      $$renderer2.push(`<!----></div> <div class="mb-6">`);
      FunilPipeline($$renderer2, {
        totaisPorEstagio: pipeline?.totaisPorEstagio ?? null,
      });
      $$renderer2.push(`<!----></div> <div class="w-full mb-6">`);
      KanbanPipeline($$renderer2, {
        pipeline: pipelineFiltrado(),
        busca,
      });
      $$renderer2.push(
        `<!----></div> <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6 mt-10">`,
      );
      GraficoVisitas($$renderer2, { dados: visitasPeriodo });
      $$renderer2.push(`<!----> `);
      GraficoConversao($$renderer2, { dados: evolucao });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export { _page as default };
