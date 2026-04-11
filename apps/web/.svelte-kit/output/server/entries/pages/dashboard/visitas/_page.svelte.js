import {
  s as sanitize_props,
  a as spread_props,
  b as slot,
  l as head,
  i as attr,
  e as ensure_array_like,
  h as attr_class,
  d as stringify,
  f as escape_html,
} from "../../../../chunks/index.js";
import { a as apiFetch } from "../../../../chunks/api.js";
import { S as StatusVisitaBadge } from "../../../../chunks/StatusVisitaBadge.js";
import { B as Button } from "../../../../chunks/Button.js";
import {
  C as ConfirmDialog,
  T as Trash_2,
} from "../../../../chunks/ConfirmDialog.js";
import { V as VisitaSheet } from "../../../../chunks/VisitaSheet.js";
import { C as Calendar_days } from "../../../../chunks/calendar-days.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { P as Package } from "../../../../chunks/package.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Chevron_left } from "../../../../chunks/chevron-left.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function Copy($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      {
        width: "14",
        height: "14",
        x: "8",
        y: "8",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
      },
    ],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "copy" },
      $$sanitized_props,
      {
        /**
         * @component @name Copy
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let visitas = [];
    let pagination = { page: 1, pageSize: 20, total: 0, totalPages: 0 };
    let loading = true;
    let filtroStatus = "";
    let filtroBusca = "";
    let filtroDataInicio = "";
    let filtroDataFim = "";
    let materiaisOptions = [];
    let sheetOpen = false;
    let selectedVisita = null;
    let duplicateSource = null;
    async function loadVisitas(page = 1) {
      loading = true;
      try {
        let url = `/visitas?page=${page}&pageSize=${pagination.pageSize}`;
        if (filtroStatus);
        if (filtroBusca.trim())
          url += `&q=${encodeURIComponent(filtroBusca.trim())}`;
        if (filtroDataInicio);
        if (filtroDataFim);
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
      duplicateSource = null;
      sheetOpen = true;
    }
    let deleteConfirmOpen = false;
    async function confirmExcluirVisita() {
      return;
    }
    function isVisitaPassada(visita) {
      if (visita.status === "REALIZADA") return true;
      const execTime = new Date(visita.dataVisita);
      if (visita.duracaoMinutos) {
        execTime.setMinutes(execTime.getMinutes() + visita.duracaoMinutos);
      }
      return execTime < /* @__PURE__ */ new Date();
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("wv08mz", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Histórico de Visitas — MediVisitas</title>`);
        });
      });
      $$renderer3.push(
        `<div class="space-y-6"><div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">`,
      );
      Calendar_days($$renderer3, { class: "h-4.5 w-4.5 text-white" });
      $$renderer3.push(
        `<!----></div> <div><h1 class="text-lg font-bold text-slate-800">Histórico de Visitas</h1> <p class="text-xs text-slate-400">Gerencie seu cronograma global de visitas a profissionais</p></div></div> `,
      );
      Button($$renderer3, {
        onclick: handleNovaVisita,
        class: "gap-2",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "w-4 h-4" });
          $$renderer4.push(`<!----> Nova Visita`);
        },
        $$slots: { default: true },
      });
      $$renderer3.push(
        `<!----></div> <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><div class="flex flex-wrap items-end gap-3"><div class="flex-1 min-w-[200px]"><label class="block text-xs font-medium text-slate-500 mb-1.5" for="buscaVisita">Buscar por profissional</label> <div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">`,
      );
      Search($$renderer3, { class: "w-4 h-4" });
      $$renderer3.push(
        `<!----></span> <input id="buscaVisita" type="text"${attr("value", filtroBusca)} placeholder="Nome do profissional..." class="block w-full pl-9 rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-slate-50/50"/></div></div> <div class="min-w-[160px]"><label class="block text-xs font-medium text-slate-500 mb-1.5" for="dataInicio">Data início</label> <input id="dataInicio" type="date"${attr("value", filtroDataInicio)} class="block w-full rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-slate-50/50"/></div> <div class="min-w-[160px]"><label class="block text-xs font-medium text-slate-500 mb-1.5" for="dataFim">Data fim</label> <input id="dataFim" type="date"${attr("value", filtroDataFim)} class="block w-full rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-slate-50/50"/></div> <div class="min-w-[150px]"><label class="block text-xs font-medium text-slate-500 mb-1.5" for="filtroStatusVisita">Status</label> `,
      );
      $$renderer3.select(
        {
          id: "filtroStatusVisita",
          value: filtroStatus,
          class:
            "block w-full bg-slate-50/50 rounded-lg border border-slate-200 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 shadow-sm",
        },
        ($$renderer4) => {
          $$renderer4.option({ value: "" }, ($$renderer5) => {
            $$renderer5.push(`Todos`);
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
        },
      );
      $$renderer3.push(
        `</div> <div class="flex gap-2"><button type="button" class="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">Limpar</button></div></div></div> <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">`,
      );
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(
          `<div class="flex justify-center p-12"><div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div></div>`,
        );
      } else if (visitas.length === 0) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(
          `<div class="text-center py-20 bg-slate-50"><div class="flex justify-center mb-4"><div class="bg-indigo-100 p-3 rounded-full text-indigo-500">`,
        );
        Calendar($$renderer3, { class: "mx-auto h-8 w-8" });
        $$renderer3.push(
          `<!----></div></div> <p class="text-sm font-medium text-slate-700">Nenhuma visita encontrada.</p> <p class="text-xs text-slate-400 mt-1">Cadastre uma nova visita clicando no botão acima.</p></div>`,
        );
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(
          `<div class="overflow-x-auto"><table class="table-fixed w-full"><thead><tr class="border-b border-slate-100"><th class="text-left p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[24%]">Profissional</th><th class="text-left p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[22%]">Data / Hora</th><th class="text-center p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Duração</th><th class="text-center p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Materiais</th><th class="text-center p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[18%]">Status</th><th class="text-center p-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider w-[12%]">Ações</th></tr></thead><tbody><!--[-->`,
        );
        const each_array = ensure_array_like(visitas);
        for (
          let $$index = 0, $$length = each_array.length;
          $$index < $$length;
          $$index++
        ) {
          let visita = each_array[$$index];
          const passada = isVisitaPassada(visita);
          $$renderer3.push(
            `<tr${attr_class(`border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60 group ${stringify(passada ? "opacity-70" : "")}`)}><td class="p-3.5"><div><p class="text-sm font-medium text-slate-900">${escape_html(visita.profissional?.nome || "Profissional Desconhecido")}</p> `,
          );
          if (visita.profissional?.especialidade) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(
              `<span class="text-xs text-slate-400">${escape_html(visita.profissional.especialidade.nome)}</span>`,
            );
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(
            `<!--]--></div></td><td class="p-3.5"><div class="flex items-center gap-1.5 text-sm text-slate-700">`,
          );
          Calendar($$renderer3, {
            class: "w-3.5 h-3.5 text-slate-400 shrink-0",
          });
          $$renderer3.push(
            `<!----> <span class="font-medium">${escape_html(new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(visita.dataVisita)))}</span> <span class="font-medium">às</span> <span class="font-medium">${escape_html(new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(visita.dataVisita)))}</span></div></td><td class="p-3.5 text-center">`,
          );
          if (visita.duracaoMinutos) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(
              `<div class="inline-flex items-center gap-1 text-sm text-slate-600">`,
            );
            Clock($$renderer3, { class: "w-3.5 h-3.5 text-slate-400" });
            $$renderer3.push(
              `<!----> ${escape_html(visita.duracaoMinutos)} min</div>`,
            );
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<span class="text-sm text-slate-300">—</span>`);
          }
          $$renderer3.push(
            `<!--]--></td><td class="p-3.5 text-center"><div class="inline-flex items-center gap-1 text-sm text-slate-600"${attr("title", visita.materiais && visita.materiais.length > 0 ? visita.materiais.map((m) => `${m.quantidade}x ${m.materialTecnico?.nome || "Material"}`).join("\n") : "Sem materiais")}>`,
          );
          Package($$renderer3, { class: "w-3.5 h-3.5 text-slate-400" });
          $$renderer3.push(
            `<!----> ${escape_html(visita.materiais?.length || 0)}</div></td><td class="p-3.5 text-center">`,
          );
          StatusVisitaBadge($$renderer3, { status: visita.status });
          $$renderer3.push(
            `<!----></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button type="button" class="p-2 rounded-lg transition-all duration-200 cursor-pointer text-slate-500 opacity-60 hover:opacity-100 hover:text-indigo-600 hover:bg-slate-100" title="Duplicar visita">`,
          );
          Copy($$renderer3, { class: "w-3.5 h-3.5" });
          $$renderer3.push(
            `<!----></button> <button type="button"${attr("disabled", passada, true)}${attr_class(`p-2 rounded-lg transition-all duration-200 cursor-pointer ${stringify(passada ? "text-slate-300 cursor-not-allowed" : "text-slate-500 opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-slate-100")}`)}${attr("title", passada ? "Visita já ocorrida" : "Excluir visita")}>`,
          );
          Trash_2($$renderer3, { class: "w-3.5 h-3.5" });
          $$renderer3.push(`<!----></button></div></td></tr>`);
        }
        $$renderer3.push(`<!--]--></tbody></table></div> `);
        if (pagination.totalPages > 1) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<div class="bg-slate-50/80 border-t border-slate-100 px-5 py-3 flex justify-between items-center"><span class="text-sm text-slate-500 font-medium">Página ${escape_html(pagination.page)} de ${escape_html(pagination.totalPages)} (${escape_html(pagination.total)} registros)</span> <div class="flex items-center gap-1"><button type="button"${attr("disabled", pagination.page <= 1, true)} class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">`,
          );
          Chevron_left($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(
            `<!----></button> <button type="button"${attr("disabled", pagination.page >= pagination.totalPages, true)} class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">`,
          );
          Chevron_right($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button></div></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></div></div> `);
      VisitaSheet($$renderer3, {
        onclose: () => {
          sheetOpen = false;
          duplicateSource = null;
        },
        onsave: () => {
          sheetOpen = false;
          duplicateSource = null;
          loadVisitas(pagination.page);
        },
        ondelete: () => {
          sheetOpen = false;
          loadVisitas(pagination.page);
        },
        visita: selectedVisita,
        duplicateSource,
        sessionToken: data.sessionToken,
        materiaisOptions,
        get open() {
          return sheetOpen;
        },
        set open($$value) {
          sheetOpen = $$value;
          $$settled = false;
        },
      });
      $$renderer3.push(`<!----> `);
      {
        let description = function ($$renderer4) {
          $$renderer4.push(
            `<p>A exclusão de dados é permanente, deseja prosseguir?</p>`,
          );
        };
        ConfirmDialog($$renderer3, {
          open: deleteConfirmOpen,
          title: "Excluir/Cancelar Visita",
          confirmLabel: "Excluir",
          variant: "danger",
          onclose: () => (deleteConfirmOpen = false),
          onconfirm: confirmExcluirVisita,
          description,
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
export { _page as default };
