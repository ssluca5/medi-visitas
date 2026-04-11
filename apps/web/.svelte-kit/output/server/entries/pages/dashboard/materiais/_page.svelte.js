import {
  s as sanitize_props,
  a as spread_props,
  b as slot,
  l as head,
  i as attr,
  f as escape_html,
  e as ensure_array_like,
  h as attr_class,
  d as stringify,
  k as derived,
} from "../../../../chunks/index.js";
import { a as apiFetch } from "../../../../chunks/api.js";
import { t as toasts } from "../../../../chunks/toast.js";
import { B as Button } from "../../../../chunks/Button.js";
import {
  S as Sheet,
  C as ConfirmDialog,
  T as Trash_2,
} from "../../../../chunks/ConfirmDialog.js";
import { P as Package } from "../../../../chunks/package.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { P as Power, a as Play } from "../../../../chunks/power.js";
function Database($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }],
    ["path", { d: "M3 12A9 3 0 0 0 21 12" }],
  ];
  Icon(
    $$renderer,
    spread_props([
      { name: "database" },
      $$sanitized_props,
      {
        /**
         * @component @name Database
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8ZWxsaXBzZSBjeD0iMTIiIGN5PSI1IiByeD0iOSIgcnk9IjMiIC8+CiAgPHBhdGggZD0iTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNSIgLz4KICA8cGF0aCBkPSJNMyAxMkE5IDMgMCAwIDAgMjEgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/database
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
    let materiais = [];
    let loading = true;
    let error = null;
    let filtroBusca = "";
    let filtroTipo = "";
    let materiaisFiltrados = derived(() =>
      materiais.filter((m) => {
        const matchBusca =
          !filtroBusca ||
          m.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
          (m.descricao &&
            m.descricao.toLowerCase().includes(filtroBusca.toLowerCase()));
        const matchTipo = !filtroTipo || m.tipo === filtroTipo;
        return matchBusca && matchTipo;
      }),
    );
    let sheetOpen = false;
    let materialEmEdicao = null;
    let formNome = "";
    let formDescricao = "";
    let formTipo = "AMOSTRA";
    let isSaving = false;
    let deleteConfirmOpen = false;
    let itemToDelete = null;
    async function loadMateriais() {
      loading = true;
      error = null;
      try {
        const res = await apiFetch(
          "/materiais?pageSize=500&incluirInativos=true",
          data.sessionToken,
        );
        if (!res.ok) throw new Error("Erro ao carregar materiais");
        const json = await res.json();
        materiais = json.data || json;
      } catch (err) {
        error = err instanceof Error ? err.message : "Erro";
      } finally {
        loading = false;
      }
    }
    function handleNovo() {
      materialEmEdicao = null;
      formNome = "";
      formDescricao = "";
      formTipo = "AMOSTRA";
      sheetOpen = true;
    }
    async function handleSalvar() {
      if (!formNome.trim()) {
        toasts.show("error", "Nome é obrigatório");
        return;
      }
      isSaving = true;
      try {
        const payload = {
          nome: formNome,
          descricao: formDescricao || null,
          tipo: formTipo,
        };
        const url = materialEmEdicao
          ? `/materiais/${materialEmEdicao.id}`
          : "/materiais";
        const method = materialEmEdicao ? "PUT" : "POST";
        const res = await apiFetch(url, data.sessionToken, {
          method,
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toasts.show("success", "Material salvo com sucesso");
          sheetOpen = false;
          loadMateriais();
        } else {
          const errorData = await res.json().catch(() => null);
          toasts.show("error", errorData?.error || "Erro ao salvar material");
        }
      } catch (err) {
        toasts.show("error", "Erro ao salvar material");
      } finally {
        isSaving = false;
      }
    }
    async function confirmarExcluir() {
      return;
    }
    function getTipoLabel(tipo) {
      switch (tipo) {
        case "AMOSTRA":
          return "Amostra Grátis";
        case "BULA":
          return "Bula";
        case "APRESENTACAO":
          return "Apresentação";
        case "FOLDER":
          return "Folder";
        case "OUTRO":
          return "Outro";
      }
      return tipo;
    }
    function getBadgeClasses(tipo) {
      switch (tipo) {
        case "AMOSTRA":
          return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
        case "APRESENTACAO":
          return "bg-indigo-50 text-indigo-700 border-indigo-200/50";
        case "FOLDER":
          return "bg-blue-50 text-blue-700 border-blue-200/50";
        default:
          return "bg-slate-100 text-slate-600 border-slate-200";
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("10qjr13", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Materiais e Amostras — MediVisitas</title>`);
        });
      });
      $$renderer3.push(
        `<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">`,
      );
      Package($$renderer3, { class: "h-4.5 w-4.5 text-white" });
      $$renderer3.push(
        `<!----></div> <div><h1 class="text-lg font-bold text-slate-800">Materiais &amp; Amostras</h1> <p class="text-[11px] text-slate-400">Cadastre as amostras grátis, folders e apresentações</p></div></div> <div class="flex items-center gap-2">`,
      );
      Button($$renderer3, {
        onclick: handleNovo,
        class: "hidden sm:inline-flex gap-2",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "h-4 w-4" });
          $$renderer4.push(`<!----> Novo Material`);
        },
        $$slots: { default: true },
      });
      $$renderer3.push(
        `<!----></div></div> <div class="card-surface p-4 mb-6"><div class="flex flex-col sm:flex-row gap-4"><div class="relative flex-1">`,
      );
      Search($$renderer3, {
        class:
          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none",
      });
      $$renderer3.push(
        `<!----> <input type="text" placeholder="Buscar por nome ou descrição..."${attr("value", filtroBusca)} class="input-base !pl-9 w-full"/></div> <div class="w-full sm:w-64 shrink-0">`,
      );
      $$renderer3.select(
        { value: filtroTipo, class: "input-base w-full" },
        ($$renderer4) => {
          $$renderer4.option({ value: "" }, ($$renderer5) => {
            $$renderer5.push(`Todos os tipos`);
          });
          $$renderer4.option({ value: "AMOSTRA" }, ($$renderer5) => {
            $$renderer5.push(`Amostra Grátis`);
          });
          $$renderer4.option({ value: "BULA" }, ($$renderer5) => {
            $$renderer5.push(`Bula`);
          });
          $$renderer4.option({ value: "APRESENTACAO" }, ($$renderer5) => {
            $$renderer5.push(`Apresentação`);
          });
          $$renderer4.option({ value: "FOLDER" }, ($$renderer5) => {
            $$renderer5.push(`Folder / Informativo`);
          });
          $$renderer4.option({ value: "OUTRO" }, ($$renderer5) => {
            $$renderer5.push(`Outro`);
          });
        },
      );
      $$renderer3.push(`</div></div></div> `);
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(
          `<div class="card-surface py-20 flex flex-col items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 mb-4"></div> <p class="text-slate-500 text-sm">Carregando...</p></div>`,
        );
      } else if (error) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(
          `<div class="card-surface py-20 flex flex-col items-center justify-center">`,
        );
        Database($$renderer3, { class: "h-8 w-8 text-red-500 mb-2" });
        $$renderer3.push(
          `<!----> <p class="text-slate-700 font-medium">Falha ao conectar no servidor</p> <p class="text-slate-500 text-sm">${escape_html(error)}</p> `,
        );
        Button($$renderer3, {
          class: "mt-4",
          variant: "outline",
          onclick: loadMateriais,
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Tentar novamente`);
          },
          $$slots: { default: true },
        });
        $$renderer3.push(`<!----></div>`);
      } else if (materiais.length === 0) {
        $$renderer3.push("<!--[2-->");
        $$renderer3.push(
          `<div class="card-surface py-20 flex flex-col items-center justify-center text-center px-4">`,
        );
        Package($$renderer3, { class: "h-10 w-10 text-slate-300 mb-4" });
        $$renderer3.push(
          `<!----> <h3 class="text-lg font-medium text-slate-900">Nenhum material encontrado</h3> <p class="text-slate-500 max-w-sm mt-2 mb-6">Cadastre as amostras grátis, folders e apresentações que os RCs distribuem aos médicos.</p> `,
        );
        Button($$renderer3, {
          onclick: handleNovo,
          class: "gap-2",
          children: ($$renderer4) => {
            Plus($$renderer4, { class: "h-4 w-4" });
            $$renderer4.push(`<!----> Cadastrar Primeiro Material`);
          },
          $$slots: { default: true },
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(
          `<div class="card-surface overflow-hidden"><table class="table-fixed w-full"><thead><tr class="border-b border-slate-100"><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[35%]">Material</th><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[35%]">Descrição</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Tipo</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Ações</th></tr></thead><tbody><!--[-->`,
        );
        const each_array = ensure_array_like(materiaisFiltrados());
        for (
          let $$index = 0, $$length = each_array.length;
          $$index < $$length;
          $$index++
        ) {
          let material = each_array[$$index];
          const isAtivo = !material.deletedAt;
          $$renderer3.push(
            `<tr${attr_class("group border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60", void 0, { "opacity-50": !isAtivo })}><td class="p-3.5"><div class="flex items-center gap-3"><div${attr_class(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-sm",
              void 0,
              {
                "bg-indigo-50": isAtivo,
                "text-indigo-600": isAtivo,
                border: isAtivo,
                "border-indigo-100": isAtivo,
                "bg-slate-100": !isAtivo,
                "text-slate-400": !isAtivo,
              },
            )}>`,
          );
          Package($$renderer3, { class: "h-4 w-4" });
          $$renderer3.push(
            `<!----></div> <div class="min-w-0"><p${attr_class("text-sm font-medium truncate", void 0, { "text-slate-900": isAtivo, "text-slate-400": !isAtivo })}>${escape_html(material.nome)}</p> `,
          );
          if (!isAtivo) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(
              `<p class="text-[10px] uppercase font-bold tracking-wider rounded text-red-600 mt-0.5">Inativo</p>`,
            );
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(
            `<!--]--></div></div></td><td class="p-3.5 text-left">`,
          );
          if (material.descricao) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(
              `<span class="text-sm text-slate-500 truncate block">${escape_html(material.descricao)}</span>`,
            );
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(
              `<span class="text-sm text-slate-300 truncate block">—</span>`,
            );
          }
          $$renderer3.push(
            `<!--]--></td><td class="p-3.5 text-center"><span${attr_class(`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wider uppercase border ${stringify(getBadgeClasses(material.tipo))}`)}>${escape_html(getTipoLabel(material.tipo))}</span></td><td class="p-3.5"><div class="flex justify-center items-center gap-1"><button${attr("title", isAtivo ? "Inativar" : "Ativar")}${attr_class(`p-1.5 rounded-md text-slate-400 transition-colors cursor-pointer ${stringify(isAtivo ? "hover:text-amber-600 hover:bg-amber-50" : "hover:text-green-600 hover:bg-green-50")}`)}>`,
          );
          if (isAtivo) {
            $$renderer3.push("<!--[0-->");
            Power($$renderer3, { class: "w-4 h-4" });
          } else {
            $$renderer3.push("<!--[-1-->");
            Play($$renderer3, { class: "w-4 h-4" });
          }
          $$renderer3.push(
            `<!--]--></button> <button title="Excluir" class="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">`,
          );
          Trash_2($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----></button></div></td></tr>`);
        }
        $$renderer3.push(`<!--]--></tbody></table> `);
        if (materiaisFiltrados().length === 0 && materiais.length > 0) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(
            `<div class="py-12 flex flex-col items-center justify-center text-center"><p class="text-slate-500 text-sm">Nenhum material encontrado com esses filtros.</p> `,
          );
          Button($$renderer3, {
            class: "mt-4",
            variant: "outline",
            onclick: () => {
              filtroBusca = "";
              filtroTipo = "";
            },
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Limpar Filtros`);
            },
            $$slots: { default: true },
          });
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      Button($$renderer3, {
        class:
          "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden z-10 p-0",
        onclick: handleNovo,
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "h-6 w-6 text-white" });
        },
        $$slots: { default: true },
      });
      $$renderer3.push(`<!----> `);
      {
        let children = function ($$renderer4) {
          $$renderer4.push(
            `<div class="space-y-5"><div><h3 class="text-lg font-semibold text-slate-900">${escape_html(materialEmEdicao ? "Editar Material" : "Novo Material")}</h3> <p class="text-sm text-slate-400 mt-1">Preencha os dados para cadastrar</p></div> <div class="space-y-3"><div><label for="tipo" class="input-label">Tipo de Material</label> `,
          );
          $$renderer4.select(
            { id: "tipo", value: formTipo, class: "input-base" },
            ($$renderer5) => {
              $$renderer5.option({ value: "AMOSTRA" }, ($$renderer6) => {
                $$renderer6.push(`Amostra Grátis`);
              });
              $$renderer5.option({ value: "BULA" }, ($$renderer6) => {
                $$renderer6.push(`Bula`);
              });
              $$renderer5.option({ value: "APRESENTACAO" }, ($$renderer6) => {
                $$renderer6.push(`Apresentação`);
              });
              $$renderer5.option({ value: "FOLDER" }, ($$renderer6) => {
                $$renderer6.push(`Folder / Informativo`);
              });
              $$renderer5.option({ value: "OUTRO" }, ($$renderer6) => {
                $$renderer6.push(`Outro`);
              });
            },
          );
          $$renderer4.push(
            `</div> <div><label for="nome" class="input-label">Nome do Produto *</label> <input id="nome"${attr("value", formNome)} type="text" class="input-base" placeholder="Ex: Medicamento X 500mg"/></div> <div><label for="desc" class="input-label">Descrição</label> <textarea id="desc" rows="3" class="input-base resize-none" placeholder="Observações adicionais ou notas técnicas...">`,
          );
          const $$body = escape_html(formDescricao);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(
            `</textarea></div></div> <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">`,
          );
          Button($$renderer4, {
            variant: "outline",
            onclick: () => (sheetOpen = false),
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Cancelar`);
            },
            $$slots: { default: true },
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            onclick: handleSalvar,
            disabled: isSaving || !formNome.trim(),
            children: ($$renderer5) => {
              $$renderer5.push(
                `<!---->${escape_html(isSaving ? "Salvando..." : "Salvar Material")}`,
              );
            },
            $$slots: { default: true },
          });
          $$renderer4.push(`<!----></div></div>`);
        };
        Sheet($$renderer3, {
          onclose: () => (sheetOpen = false),
          get open() {
            return sheetOpen;
          },
          set open($$value) {
            sheetOpen = $$value;
            $$settled = false;
          },
          children,
          $$slots: { default: true },
        });
      }
      $$renderer3.push(`<!----> `);
      {
        let description = function ($$renderer4) {
          $$renderer4.push(
            `<p>Tem certeza que deseja excluir '<strong>${escape_html(itemToDelete?.nome)}</strong>'?</p> <p>Isso poderá afetar o histórico de visitas que usaram este item.</p>`,
          );
        };
        ConfirmDialog($$renderer3, {
          open: deleteConfirmOpen,
          title: "Excluir Material",
          confirmLabel: "Excluir",
          variant: "danger",
          onclose: () => (deleteConfirmOpen = false),
          onconfirm: confirmarExcluir,
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
