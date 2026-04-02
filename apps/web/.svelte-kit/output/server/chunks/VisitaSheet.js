import { i as attr_class, f as escape_html, af as bind_props, e as ensure_array_like, h as attr, j as clsx, k as derived } from "./index.js";
import { S as Sheet, B as Button } from "./Sheet.js";
import { S as Search } from "./search.js";
function StatusVisitaBadge($$renderer, $$props) {
  let badge;
  let status = $$props["status"];
  const config = {
    AGENDADA: {
      label: "Agendada",
      classes: "bg-blue-100 text-blue-800 border-blue-200"
    },
    REALIZADA: {
      label: "Realizada",
      classes: "bg-green-100 text-green-800 border-green-200"
    },
    CANCELADA: {
      label: "Cancelada",
      classes: "bg-red-100 text-red-800 border-red-200"
    },
    NAO_REALIZADA: {
      label: "Não Realizada",
      classes: "bg-orange-100 text-orange-800 border-orange-200"
    }
  };
  badge = config[status] || {
    label: status,
    classes: "bg-gray-100 text-gray-800 border-gray-200"
  };
  $$renderer.push(`<span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.classes}`)}>${escape_html(badge.label)}</span>`);
  bind_props($$props, { status });
}
function MaterialSelector($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { materiaisOptions = [], selections = [], isReadOnly = false } = $$props;
    let selectedId = "";
    let quantidade = 1;
    $$renderer2.push(`<div class="space-y-4"><div class="flex gap-2 items-end"><div class="flex-1"><label class="block text-sm font-medium text-gray-700 mb-1" for="materialSelectedId">Material Técnico</label> `);
    $$renderer2.select(
      {
        id: "materialSelectedId",
        value: selectedId,
        disabled: isReadOnly,
        class: "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Selecione --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(materiaisOptions);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let mat = each_array[$$index];
          $$renderer3.option({ value: mat.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(mat.nome)} (${escape_html(mat.tipo)})`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div class="w-20"><label class="block text-sm font-medium text-gray-700 mb-1" for="materialQtd">Qtd</label> <input id="materialQtd" type="number" min="1"${attr("value", quantidade)}${attr("disabled", isReadOnly, true)} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"/></div> <div><button type="button"${attr("disabled", !selectedId, true)} class="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-transparent font-medium rounded-lg px-4 py-[0.55rem] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Add</button></div></div> `);
    if (selections.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-gray-50 rounded-md border p-3"><h4 class="text-sm font-medium text-gray-700 mb-2">Materiais a Entregar:</h4> <ul class="space-y-2"><!--[-->`);
      const each_array_1 = ensure_array_like(selections);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let sel = each_array_1[i];
        $$renderer2.push(`<li class="flex items-center justify-between text-sm bg-white p-2 rounded shadow-sm border border-gray-200"><div><span class="font-medium text-indigo-700 bg-indigo-50 px-2 rounded-full text-xs py-0.5">${escape_html(sel.quantidade)}x</span> <span class="ml-2 text-gray-800">${escape_html(sel.materialTecnico?.nome || "Material Desconhecido")}</span></div> <div${attr_class(clsx(isReadOnly ? "hidden" : "block"))}><button type="button" class="text-red-500 hover:text-red-700 p-1" aria-label="Remover"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></li>`);
      }
      $$renderer2.push(`<!--]--></ul></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { selections });
  });
}
function VisitaSheet($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      open = void 0,
      onclose,
      visita = null,
      profissionalId,
      sessionToken,
      materiaisOptions
    } = $$props;
    let loading = false;
    let status = "AGENDADA";
    let dataVisita = "";
    let duracaoMinutos = "";
    let objetivoVisita = "";
    let resumo = "";
    let proximaAcao = "";
    let selections = [];
    let isReadOnly = derived(() => {
      return false;
    });
    let searchQuery = "";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Sheet($$renderer3, {
        open,
        onclose,
        side: "right",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex h-full flex-col"><div class="mb-6"><h2 class="text-xl font-bold text-gray-900">${escape_html(isReadOnly() ? "Detalhes da Visita" : visita?.id ? "Editar Visita" : "Registrar Visita")}</h2> <p class="mt-1 text-sm text-gray-500">${escape_html(isReadOnly() ? "Esta visita já foi executada e não pode ser alterada." : "Preencha os detalhes e os materiais entregues.")}</p></div> <div class="flex-1 overflow-y-auto pr-2 pb-6"><form class="space-y-5" id="visitaForm"><div class="space-y-4">`);
          if (!profissionalId && !visita?.profissionalId) {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<div class="relative"><label class="block text-sm font-medium text-gray-700 mb-1" for="profissionalBusca">Selecione o Profissional</label> `);
            {
              $$renderer4.push("<!--[-1-->");
              $$renderer4.push(`<div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">`);
              Search($$renderer4, { class: "w-4 h-4" });
              $$renderer4.push(`<!----></span> <input id="profissionalBusca" type="text"${attr("value", searchQuery)} placeholder="Buscar médico..." class="block w-full pl-9 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border" autocomplete="off"/></div> `);
              {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]-->`);
            }
            $$renderer4.push(`<!--]--></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> <div><label class="block text-sm font-medium text-gray-700 mb-1" for="dataVisita">Data e Hora</label> <input type="datetime-local" id="dataVisita" name="dataVisita"${attr("value", dataVisita)} required=""${attr("disabled", isReadOnly(), true)} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"/></div> <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1" for="status">Status</label> `);
          $$renderer4.select(
            {
              id: "status",
              name: "status",
              value: status,
              disabled: isReadOnly(),
              class: "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
            },
            ($$renderer5) => {
              $$renderer5.option({ value: "AGENDADA" }, ($$renderer6) => {
                $$renderer6.push(`Agendada`);
              });
              $$renderer5.option({ value: "REALIZADA" }, ($$renderer6) => {
                $$renderer6.push(`Realizada`);
              });
              $$renderer5.option({ value: "CANCELADA" }, ($$renderer6) => {
                $$renderer6.push(`Cancelada`);
              });
              $$renderer5.option({ value: "NAO_REALIZADA" }, ($$renderer6) => {
                $$renderer6.push(`Não Realizada`);
              });
            }
          );
          $$renderer4.push(`</div> <div><label class="block text-sm font-medium text-gray-700 mb-1" for="duracaoMinutos">Duração (min)</label> <input type="number" id="duracaoMinutos" name="duracaoMinutos"${attr("value", duracaoMinutos)}${attr("disabled", isReadOnly(), true)} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500" placeholder="e.g. 30"/></div></div></div> <div><label class="block text-sm font-medium text-gray-700 mb-1" for="objetivoVisita">Objetivo da Visita</label> <textarea id="objetivoVisita" name="objetivoVisita" rows="3"${attr("disabled", isReadOnly(), true)} class="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500" placeholder="Apresentação do produto X">`);
          const $$body = escape_html(objetivoVisita);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div> `);
          if (isReadOnly()) {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<div><label class="block text-sm font-medium text-gray-700 mb-1" for="resumo">Resumo da Visita / Feedback</label> <textarea id="resumo" name="resumo" rows="3"${attr("disabled", isReadOnly(), true)} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500" placeholder="O médico gostou da amostra...">`);
            const $$body_1 = escape_html(resumo);
            if ($$body_1) {
              $$renderer4.push(`${$$body_1}`);
            }
            $$renderer4.push(`</textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1" for="proximaAcao">Próxima Ação / Follow-up</label> <input type="text" id="proximaAcao" name="proximaAcao"${attr("value", proximaAcao)}${attr("disabled", isReadOnly(), true)} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500" placeholder="Retornar daqui a 30 dias"/></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> <hr class="border-gray-200"/> <div><h3 class="text-md font-semibold text-gray-800 mb-3">Materiais / Amostras</h3> `);
          MaterialSelector($$renderer4, {
            materiaisOptions,
            isReadOnly: isReadOnly(),
            get selections() {
              return selections;
            },
            set selections($$value) {
              selections = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></form></div> <div class="mt-auto border-t bg-white pt-4 pb-2"><div class="flex justify-end gap-3">`);
          if (isReadOnly()) {
            $$renderer4.push("<!--[0-->");
            Button($$renderer4, {
              variant: "outline",
              type: "button",
              onclick: onclose,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Fechar`);
              },
              $$slots: { default: true }
            });
          } else {
            $$renderer4.push("<!--[-1-->");
            Button($$renderer4, {
              variant: "outline",
              type: "button",
              onclick: onclose,
              disabled: loading,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Cancelar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              type: "submit",
              form: "visitaForm",
              disabled: !profissionalId && !visita?.profissionalId && true,
              children: ($$renderer5) => {
                {
                  $$renderer5.push("<!--[-1-->");
                  $$renderer5.push(`Salvar Visita`);
                }
                $$renderer5.push(`<!--]-->`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }
          $$renderer4.push(`<!--]--></div></div></div>`);
        },
        $$slots: { default: true }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { open });
  });
}
export {
  StatusVisitaBadge as S,
  VisitaSheet as V
};
