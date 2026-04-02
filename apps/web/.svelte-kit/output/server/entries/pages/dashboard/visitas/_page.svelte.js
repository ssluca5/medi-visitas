import { s as sanitize_props, a as spread_props, b as slot, l as head, e as ensure_array_like, h as attr, d as stringify, f as escape_html } from "../../../../chunks/index.js";
import { B as Button, a as apiFetch } from "../../../../chunks/Sheet.js";
import { V as VisitaSheet, S as StatusVisitaBadge } from "../../../../chunks/VisitaSheet.js";
import { P as Plus, C as ConfirmDialog, T as Trash_2 } from "../../../../chunks/ConfirmDialog.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { P as Package } from "../../../../chunks/package.js";
function Clock($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["polyline", { "points": "12 6 12 12 16 14" }]
  ];
  Icon($$renderer, spread_props([
    { name: "clock" },
    $$sanitized_props,
    {
      /**
       * @component @name Clock
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cG9seWxpbmUgcG9pbnRzPSIxMiA2IDEyIDEyIDE2IDE0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/clock
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
function Pen($$renderer, $$props) {
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
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "pen" },
    $$sanitized_props,
    {
      /**
       * @component @name Pen
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pen
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let visitas = [];
    let pagination = { page: 1, pageSize: 20, total: 0, totalPages: 0 };
    let loading = true;
    let filtroStatus = "";
    let materiaisOptions = [];
    let sheetOpen = false;
    let selectedVisita = null;
    async function loadVisitas(page = 1) {
      loading = true;
      try {
        let url = `/visitas?page=${page}&pageSize=${pagination.pageSize}`;
        if (filtroStatus) ;
        const res = await apiFetch(url, data.sessionToken);
        if (res.ok) {
          const json = await res.json();
          visitas = json.data || json;
          if (json.pagination) pagination = json.pagination;
        }
      } catch (err) {
        console.error(err);
      } finally {
        loading = false;
      }
    }
    function handleNovaVisita() {
      selectedVisita = null;
      sheetOpen = true;
    }
    let deleteConfirmOpen = false;
    async function confirmExcluirVisita() {
      return;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("wv08mz", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Agenda de Visitas — MediVisitas</title>`);
        });
      });
      $$renderer3.push(`<div class="space-y-6"><div class="flex flex-wrap justify-between items-end gap-4"><div><h1 class="text-2xl font-bold text-gray-900">Agenda de Visitas</h1> <p class="text-sm text-gray-500 mt-1">Gerencie seu cronograma global de visitas a profissionais.</p></div> <div class="flex flex-wrap items-center gap-3">`);
      $$renderer3.select(
        {
          value: filtroStatus,
          onchange: () => loadVisitas(1),
          class: "block bg-white rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm shadow-sm"
        },
        ($$renderer4) => {
          $$renderer4.option({ value: "" }, ($$renderer5) => {
            $$renderer5.push(`Todos os status`);
          });
          $$renderer4.option({ value: "AGENDADA" }, ($$renderer5) => {
            $$renderer5.push(`Agendadas`);
          });
          $$renderer4.option({ value: "REALIZADA" }, ($$renderer5) => {
            $$renderer5.push(`Realizadas`);
          });
          $$renderer4.option({ value: "CANCELADA" }, ($$renderer5) => {
            $$renderer5.push(`Canceladas`);
          });
          $$renderer4.option({ value: "NAO_REALIZADA" }, ($$renderer5) => {
            $$renderer5.push(`Não Realizadas`);
          });
        }
      );
      $$renderer3.push(` `);
      Button($$renderer3, {
        onclick: handleNovaVisita,
        class: "gap-2",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "w-4 h-4" });
          $$renderer4.push(`<!----> Nova Visita`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div> <div class="bg-white rounded-lg shadow-sm border overflow-hidden">`);
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex justify-center p-12"><div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div></div>`);
      } else if (visitas.length === 0) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<div class="text-center py-20 bg-gray-50"><div class="flex justify-center mb-4"><div class="bg-indigo-100 p-3 rounded-full text-indigo-500">`);
        Calendar($$renderer3, { class: "mx-auto h-8 w-8" });
        $$renderer3.push(`<!----></div></div> <p class="text-sm font-medium text-gray-700">Nenhuma visita encontrada.</p> <p class="text-xs text-gray-500 mt-1">Use a página de Profissionais para reagendar ou planejar novos encontros.</p></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<ul class="divide-y divide-gray-100"><!--[-->`);
        const each_array = ensure_array_like(visitas);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let visita = each_array[$$index];
          $$renderer3.push(`<li class="group p-5 bg-white hover:bg-slate-50 hover:-translate-y-[1px] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative border-b border-gray-100 last:border-0"><div class="flex-1"><div class="flex flex-wrap items-center gap-2"><a${attr("href", `/dashboard/profissionais/${stringify(visita.profissionalId)}`)} class="text-base font-bold text-slate-900 hover:text-indigo-600 hover:underline">${escape_html(visita.profissional?.nome || "Profissional Desconhecido")}</a> `);
          if (visita.profissional?.especialidade) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="text-[10px] uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">${escape_html(visita.profissional.especialidade.nome)}</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-1 flex items-center gap-1.5 text-sm text-slate-500">`);
          Calendar($$renderer3, { class: "w-4 h-4 text-slate-400" });
          $$renderer3.push(`<!----> <span class="font-medium">${escape_html(new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(visita.dataVisita)))} às ${escape_html(new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(visita.dataVisita)))}</span></div></div> <div class="flex flex-wrap items-center sm:justify-end gap-4 2xl:gap-6">`);
          if (visita.duracaoMinutos) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="flex items-center gap-1.5 text-xs text-slate-500" title="Duração estimada">`);
            Clock($$renderer3, { class: "w-3.5 h-3.5 text-slate-400" });
            $$renderer3.push(`<!----> <span>${escape_html(visita.duracaoMinutos)} min</span></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <div class="flex items-center gap-1.5 text-xs text-slate-500" title="Materiais">`);
          Package($$renderer3, { class: "w-3.5 h-3.5 text-slate-400" });
          $$renderer3.push(`<!----> <span>${escape_html(visita.materiais.length)} materiais</span></div> `);
          StatusVisitaBadge($$renderer3, { status: visita.status });
          $$renderer3.push(`<!----> <div class="flex items-center justify-center gap-1"><button type="button" class="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors cursor-pointer" title="Editar/Detalhes">`);
          Pen($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button> <button type="button" class="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer" title="Excluir">`);
          Trash_2($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button></div></div></li>`);
        }
        $$renderer3.push(`<!--]--></ul> `);
        if (pagination.totalPages > 1) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="bg-gray-50 border-t px-5 py-3 flex justify-between items-center"><span class="text-sm text-gray-500 font-medium">Página ${escape_html(pagination.page)} de ${escape_html(pagination.totalPages)}</span> <div class="space-x-2">`);
          Button($$renderer3, {
            variant: "outline",
            size: "sm",
            disabled: pagination.page <= 1,
            onclick: () => loadVisitas(pagination.page - 1),
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Anterior`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            variant: "outline",
            size: "sm",
            disabled: pagination.page >= pagination.totalPages,
            onclick: () => loadVisitas(pagination.page + 1),
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Próxima`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></div></div> `);
      VisitaSheet($$renderer3, {
        onclose: () => {
          sheetOpen = false;
          loadVisitas(pagination.page);
        },
        visita: selectedVisita,
        sessionToken: data.sessionToken,
        materiaisOptions,
        get open() {
          return sheetOpen;
        },
        set open($$value) {
          sheetOpen = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      {
        let description = function($$renderer4) {
          $$renderer4.push(`<p>A exclusão de dados é permanente, deseja prosseguir?</p>`);
        };
        ConfirmDialog($$renderer3, {
          open: deleteConfirmOpen,
          title: "Excluir/Cancelar Visita",
          confirmLabel: "Excluir",
          variant: "danger",
          onclose: () => deleteConfirmOpen = false,
          onconfirm: confirmExcluirVisita,
          description
        });
      }
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
export {
  _page as default
};
