import {
  e as ensure_array_like,
  f as escape_html,
  i as attr,
  h as attr_class,
  j as clsx,
  ah as bind_props,
  k as derived,
} from "./index.js";
import { S as Sheet, C as ConfirmDialog } from "./ConfirmDialog.js";
import { B as Button } from "./Button.js";
import { a as apiFetch } from "./api.js";
import { S as Search } from "./search.js";
function MaterialSelector($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      materiaisOptions = [],
      selections = [],
      isReadOnly = false,
    } = $$props;
    let selectedId = "";
    let quantidade = 1;
    $$renderer2.push(
      `<div class="space-y-4"><div class="flex gap-2 items-end"><div class="flex-1"><label class="block text-sm font-medium text-gray-700 mb-1" for="materialSelectedId">Material Técnico</label> `,
    );
    $$renderer2.select(
      {
        id: "materialSelectedId",
        value: selectedId,
        disabled: isReadOnly,
        class:
          "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500",
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`-- Selecione --`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(materiaisOptions);
        for (
          let $$index = 0, $$length = each_array.length;
          $$index < $$length;
          $$index++
        ) {
          let mat = each_array[$$index];
          $$renderer3.option({ value: mat.id }, ($$renderer4) => {
            $$renderer4.push(
              `${escape_html(mat.nome)} (${escape_html(mat.tipo)})`,
            );
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
    );
    $$renderer2.push(
      `</div> <div class="w-20"><label class="block text-sm font-medium text-gray-700 mb-1" for="materialQtd">Qtd</label> <input id="materialQtd" type="number" min="1"${attr("value", quantidade)}${attr("disabled", isReadOnly, true)} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"/></div> <div><button type="button"${attr("disabled", !selectedId, true)} class="flex items-center justify-center w-9 h-9 text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg leading-none cursor-pointer" title="Adicionar material">+</button></div></div> `,
    );
    if (selections.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(
        `<div class="bg-gray-50 rounded-md border p-3"><h4 class="text-sm font-medium text-gray-700 mb-2">Materiais a Entregar:</h4> <ul class="space-y-2"><!--[-->`,
      );
      const each_array_1 = ensure_array_like(selections);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let sel = each_array_1[i];
        $$renderer2.push(
          `<li class="flex items-center justify-between text-sm bg-white p-2 rounded shadow-sm border border-gray-200"><div><span class="font-medium text-indigo-700 bg-indigo-50 px-2 rounded-full text-xs py-0.5">${escape_html(sel.quantidade)}x</span> <span class="ml-2 text-gray-800">${escape_html(sel.materialTecnico?.nome || "Material Desconhecido")}</span></div> <div${attr_class(clsx(isReadOnly ? "hidden" : "block"))}><button type="button" class="text-red-500 hover:text-red-700 p-1" aria-label="Remover"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></li>`,
        );
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
      onsave,
      visita = null,
      duplicateSource = null,
      profissionalId,
      profissionalNome,
      sessionToken,
      materiaisOptions,
      defaultDateTime,
      ondelete,
    } = $$props;
    let loading = false;
    let confirmDeleteOpen = false;
    let status = "AGENDADA";
    let dataVisita = "";
    let duracaoMinutos = "";
    let objetivoVisita = "";
    let resumo = "";
    let proximaAcao = "";
    let motivoCancelamento = "";
    let motivoNaoRealizacao = "";
    let selections = [];
    let hasPassed = derived(() => {
      if (!visita?.dataVisita) return false;
      const execTime = new Date(visita.dataVisita);
      if (visita.duracaoMinutos) {
        execTime.setMinutes(
          execTime.getMinutes() + Number(visita.duracaoMinutos),
        );
      }
      return execTime < /* @__PURE__ */ new Date();
    });
    let isReadOnly = derived(() => {
      if (!visita?.id) return false;
      if (!hasPassed()) return false;
      if (visita.status === "REALIZADA") return true;
      if (
        (visita.status === "CANCELADA" || visita.status === "NAO_REALIZADA") &&
        hasPassed()
      )
        return true;
      return false;
    });
    let canDelete = derived(() => {
      if (!visita?.id || !ondelete) return false;
      if (!hasPassed()) return true;
      return false;
    });
    let searchQuery = "";
    function handleExcluir() {
      if (!visita?.id || !ondelete) return;
      confirmDeleteOpen = true;
    }
    async function confirmExcluir() {
      if (!visita?.id || !ondelete) return;
      loading = true;
      try {
        const res = await apiFetch(`/visitas/${visita.id}`, sessionToken, {
          method: "DELETE",
        });
        if (res.ok) {
          ondelete(visita.id);
          confirmDeleteOpen = false;
          onclose();
        } else {
          alert("Erro ao excluir visita.");
        }
      } catch (err) {
        alert("Erro inesperado de conexão.");
      } finally {
        loading = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Sheet($$renderer3, {
        open,
        onclose,
        side: "right",
        children: ($$renderer4) => {
          $$renderer4.push(
            `<div class="flex h-full flex-col"><div class="mb-6"><h2 class="text-lg font-semibold text-slate-900">${escape_html(isReadOnly() ? "Detalhes da Visita" : duplicateSource ? "Duplicar Visita" : visita?.id ? "Editar Visita" : "Registrar Visita")}</h2> <p class="mt-1 text-sm text-slate-400">${escape_html(isReadOnly() ? "Esta visita já foi executada e não pode ser alterada." : duplicateSource ? "Altere os dados e salve para criar uma nova visita." : "Preencha os detalhes e os materiais entregues.")}</p></div> <div class="flex-1 overflow-y-auto pr-2 pb-6"><form class="space-y-5" id="visitaForm"><div class="space-y-4">`,
          );
          if (profissionalId && !visita?.profissionalId) {
            $$renderer4.push("<!--[0-->");
            if (typeof profissionalId === "string" && profissionalNome) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(
                `<div class="mb-4"><label class="block text-sm font-medium text-slate-700 mb-1.5">Profissional</label> <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">${escape_html(profissionalNome)}</div></div>`,
              );
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]-->`);
          } else if (visita?.profissionalId) {
            $$renderer4.push("<!--[1-->");
            $$renderer4.push(
              `<div class="mb-4"><label class="block text-sm font-medium text-slate-700 mb-1.5">Profissional</label> <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">${escape_html(visita.profissional?.nome || "Profissional")}</div></div>`,
            );
          } else if (!profissionalId && !visita?.profissionalId) {
            $$renderer4.push("<!--[2-->");
            $$renderer4.push(
              `<div class="relative"><label class="block text-sm font-medium text-slate-700 mb-1.5" for="profissionalBusca">Selecione o Profissional</label> `,
            );
            {
              $$renderer4.push("<!--[-1-->");
              $$renderer4.push(
                `<div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">`,
              );
              Search($$renderer4, { class: "w-4 h-4" });
              $$renderer4.push(
                `<!----></span> <input id="profissionalBusca" type="text"${attr("value", searchQuery)} placeholder="Buscar médico..." class="input-base !pl-9" autocomplete="off"/></div> `,
              );
              {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]-->`);
            }
            $$renderer4.push(`<!--]--></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(
            `<!--]--> <div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="dataVisita">Data e Hora</label> <input type="datetime-local" id="dataVisita" name="dataVisita"${attr("value", dataVisita)} required=""${attr("disabled", isReadOnly(), true)} class="input-base disabled:bg-slate-50 disabled:text-slate-500"/></div> <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="status">Status</label> `,
          );
          $$renderer4.select(
            {
              id: "status",
              name: "status",
              value: status,
              disabled: isReadOnly(),
              class: "input-base disabled:bg-slate-50 disabled:text-slate-500",
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
            },
          );
          $$renderer4.push(
            `</div> <div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="duracaoMinutos">Duração (min)</label> <input type="number" id="duracaoMinutos" name="duracaoMinutos"${attr("value", duracaoMinutos)}${attr("disabled", isReadOnly(), true)} class="input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="e.g. 30"/></div></div></div> <div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="objetivoVisita">Objetivo da Visita</label> <textarea id="objetivoVisita" name="objetivoVisita" rows="3"${attr("disabled", isReadOnly(), true)} class="resize-none input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="Apresentação do produto X">`,
          );
          const $$body = escape_html(objetivoVisita);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div> `);
          if (isReadOnly() && visita?.status === "REALIZADA") {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(
              `<div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="resumo">Resumo da Visita / Feedback</label> <textarea id="resumo" name="resumo" rows="3"${attr("disabled", isReadOnly(), true)} class="resize-none input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="O médico gostou da amostra...">`,
            );
            const $$body_1 = escape_html(resumo);
            if ($$body_1) {
              $$renderer4.push(`${$$body_1}`);
            }
            $$renderer4.push(
              `</textarea></div> <div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="proximaAcao">Próxima Ação / Follow-up</label> <input type="text" id="proximaAcao" name="proximaAcao"${attr("value", proximaAcao)}${attr("disabled", isReadOnly(), true)} class="input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="Retornar daqui a 30 dias"/></div>`,
            );
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (isReadOnly() && visita?.status === "CANCELADA") {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(
              `<div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="motivoCancelamento">Motivo do Cancelamento</label> <textarea id="motivoCancelamento" name="motivoCancelamento" rows="3"${attr("disabled", isReadOnly(), true)} class="resize-none input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="Descreva o motivo do cancelamento...">`,
            );
            const $$body_2 = escape_html(motivoCancelamento);
            if ($$body_2) {
              $$renderer4.push(`${$$body_2}`);
            }
            $$renderer4.push(`</textarea></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          if (isReadOnly() && visita?.status === "NAO_REALIZADA") {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(
              `<div><label class="block text-sm font-medium text-slate-700 mb-1.5" for="motivoNaoRealizacao">Motivo da Não Realização</label> <textarea id="motivoNaoRealizacao" name="motivoNaoRealizacao" rows="3"${attr("disabled", isReadOnly(), true)} class="resize-none input-base disabled:bg-slate-50 disabled:text-slate-500" placeholder="Descreva o motivo da não realização...">`,
            );
            const $$body_3 = escape_html(motivoNaoRealizacao);
            if ($$body_3) {
              $$renderer4.push(`${$$body_3}`);
            }
            $$renderer4.push(`</textarea></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(
            `<!--]--> <hr class="border-slate-200"/> <div><h3 class="text-sm font-semibold text-slate-800 mb-3">Materiais / Amostras</h3> `,
          );
          MaterialSelector($$renderer4, {
            materiaisOptions,
            isReadOnly: isReadOnly(),
            get selections() {
              return selections;
            },
            set selections($$value) {
              selections = $$value;
              $$settled = false;
            },
          });
          $$renderer4.push(
            `<!----></div></form></div> <div class="mt-auto border-t border-slate-100 pt-4 pb-2"><div class="flex justify-between gap-3">`,
          );
          if (canDelete()) {
            $$renderer4.push("<!--[0-->");
            Button($$renderer4, {
              variant: "destructive",
              type: "button",
              onclick: handleExcluir,
              disabled: loading,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Excluir`);
              },
              $$slots: { default: true },
            });
          } else {
            $$renderer4.push("<!--[-1-->");
            $$renderer4.push(`<div></div>`);
          }
          $$renderer4.push(`<!--]--> <div class="flex gap-3 ml-auto">`);
          if (isReadOnly()) {
            $$renderer4.push("<!--[0-->");
            Button($$renderer4, {
              variant: "outline",
              type: "button",
              onclick: onclose,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Fechar`);
              },
              $$slots: { default: true },
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
              $$slots: { default: true },
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              type: "submit",
              form: "visitaForm",
              disabled:
                loading || (!profissionalId && !visita?.profissionalId && true),
              children: ($$renderer5) => {
                if (loading) {
                  $$renderer5.push("<!--[0-->");
                  $$renderer5.push(`Salvando...`);
                } else {
                  $$renderer5.push("<!--[-1-->");
                  $$renderer5.push(`Salvar Visita`);
                }
                $$renderer5.push(`<!--]-->`);
              },
              $$slots: { default: true },
            });
            $$renderer4.push(`<!---->`);
          }
          $$renderer4.push(`<!--]--></div></div></div></div>`);
        },
        $$slots: { default: true },
      });
      $$renderer3.push(`<!----> `);
      {
        let description = function ($$renderer4) {
          $$renderer4.push(
            `<p>A exclusão de dados é permanente. Tem certeza que deseja prosseguir?</p>`,
          );
        };
        ConfirmDialog($$renderer3, {
          open: confirmDeleteOpen,
          title: "Excluir Visita",
          confirmLabel: "Excluir",
          variant: "danger",
          onclose: () => (confirmDeleteOpen = false),
          onconfirm: confirmExcluir,
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
    bind_props($$props, { open });
  });
}
export { VisitaSheet as V };
