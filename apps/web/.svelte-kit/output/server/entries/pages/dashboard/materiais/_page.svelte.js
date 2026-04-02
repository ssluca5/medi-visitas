import { s as sanitize_props, a as spread_props, b as slot, l as head, f as escape_html, h as attr, e as ensure_array_like, i as attr_class, d as stringify } from "../../../../chunks/index.js";
import { B as Button, S as Sheet, a as apiFetch } from "../../../../chunks/Sheet.js";
import { t as toasts } from "../../../../chunks/toast.js";
import { P as Plus, C as ConfirmDialog, T as Trash_2 } from "../../../../chunks/ConfirmDialog.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { P as Package } from "../../../../chunks/package.js";
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
    ["ellipse", { "cx": "12", "cy": "5", "rx": "9", "ry": "3" }],
    ["path", { "d": "M3 5V19A9 3 0 0 0 21 19V5" }],
    ["path", { "d": "M3 12A9 3 0 0 0 21 12" }]
  ];
  Icon($$renderer, spread_props([
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
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let materiais = [];
    let loading = true;
    let error = null;
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
        const res = await apiFetch("/materiais?pageSize=500&incluirInativos=true", data.sessionToken);
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
          tipo: formTipo
        };
        const url = materialEmEdicao ? `/materiais/${materialEmEdicao.id}` : "/materiais";
        const method = materialEmEdicao ? "PUT" : "POST";
        const res = await apiFetch(url, data.sessionToken, { method, body: JSON.stringify(payload) });
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
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("10qjr13", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Materiais e Amostras — MediVisitas</title>`);
        });
      });
      $$renderer3.push(`<header class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Materiais &amp; Amostras</h2> <p class="text-sm text-slate-500 mt-1">Gerencie os materiais entregues nas visitas</p></div> `);
      Button($$renderer3, {
        onclick: handleNovo,
        class: "hidden sm:flex gap-2",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "h-4 w-4" });
          $$renderer4.push(`<!----> Novo Material`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></header> `);
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="card-surface py-20 flex flex-col items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 mb-4"></div> <p class="text-slate-500 text-sm">Carregando...</p></div>`);
      } else if (error) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<div class="card-surface py-20 flex flex-col items-center justify-center">`);
        Database($$renderer3, { class: "h-8 w-8 text-red-500 mb-2" });
        $$renderer3.push(`<!----> <p class="text-slate-700 font-medium">Falha ao conectar no servidor</p> <p class="text-slate-500 text-sm">${escape_html(error)}</p> `);
        Button($$renderer3, {
          class: "mt-4",
          variant: "outline",
          onclick: loadMateriais,
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Tentar novamente`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
      } else if (materiais.length === 0) {
        $$renderer3.push("<!--[2-->");
        $$renderer3.push(`<div class="card-surface py-20 flex flex-col items-center justify-center text-center px-4">`);
        Package($$renderer3, { class: "h-10 w-10 text-slate-300 mb-4" });
        $$renderer3.push(`<!----> <h3 class="text-lg font-medium text-slate-900">Nenhum material encontrado</h3> <p class="text-slate-500 max-w-sm mt-2 mb-6">Cadastre as amostras grátis, folders e apresentações que os RCs distribuem aos médicos.</p> `);
        Button($$renderer3, {
          onclick: handleNovo,
          class: "gap-2",
          children: ($$renderer4) => {
            Plus($$renderer4, { class: "h-4 w-4" });
            $$renderer4.push(`<!----> Cadastrar Primeiro Material`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        const each_array = ensure_array_like(materiais);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let material = each_array[$$index];
          const isAtivo = !material.deletedAt;
          $$renderer3.push(`<div${attr_class("card-surface p-5 transition-all cursor-pointer flex flex-col h-full hover:border-indigo-200 hover:shadow-md", void 0, { "opacity-50": !isAtivo })}><div class="flex items-start justify-between mb-3"><div class="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 flex-shrink-0">`);
          Package($$renderer3, { class: "h-5 w-5 text-indigo-600" });
          $$renderer3.push(`<!----></div> <div class="flex flex-col items-end gap-1.5 ml-3 min-w-0"><span class="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-slate-100 text-slate-600 text-right w-fit">${escape_html(getTipoLabel(material.tipo))}</span> `);
          if (!isAtivo) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-600 text-right w-fit border border-red-100">Inativo</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div></div> <h3 class="font-semibold text-slate-900 mb-1">${escape_html(material.nome)}</h3> `);
          if (material.descricao) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">${escape_html(material.descricao)}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<p class="text-sm text-slate-400 italic mb-4 flex-1">Sem descrição</p>`);
          }
          $$renderer3.push(`<!--]--> <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100"><div class="flex gap-2"><button class="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 -ml-1.5 rounded transition-colors flex items-center justify-center" title="Excluir">`);
          Trash_2($$renderer3, { class: "h-4 w-4" });
          $$renderer3.push(`<!----></button> <button${attr_class(`text-xs font-semibold p-1.5 rounded transition-colors flex items-center justify-center ${stringify(isAtivo ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-green-600 hover:text-green-700 hover:bg-green-50")}`)}${attr("title", isAtivo ? "Inativar" : "Ativar")}>`);
          if (isAtivo) {
            $$renderer3.push("<!--[0-->");
            Power($$renderer3, { class: "w-4 h-4" });
          } else {
            $$renderer3.push("<!--[-1-->");
            Play($$renderer3, { class: "w-4 h-4" });
          }
          $$renderer3.push(`<!--]--></button></div> <button class="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors">Editar</button></div></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      Button($$renderer3, {
        class: "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden z-10 p-0",
        onclick: handleNovo,
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "h-6 w-6 text-white" });
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<div class="h-full flex flex-col"><div class="mb-6 px-1"><h3 class="text-lg font-bold text-slate-900">${escape_html(materialEmEdicao ? "Editar Material" : "Novo Material")}</h3> <p class="text-sm text-slate-500 mt-1">Preencha os detalhes da amostra ou material técnico</p></div> <div class="space-y-5 px-1 flex-1"><div><label for="tipo" class="block text-sm font-semibold text-slate-700 mb-1">Tipo de Material</label> `);
          $$renderer4.select(
            {
              id: "tipo",
              value: formTipo,
              class: "block w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white"
            },
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
            }
          );
          $$renderer4.push(`</div> <div><label for="nome" class="block text-sm font-semibold text-slate-700 mb-1">Nome do Produto</label> <input id="nome"${attr("value", formNome)} type="text" placeholder="Ex: Medicamento X 500mg" class="block w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border placeholder:text-slate-400"/></div> <div><label for="desc" class="block text-sm font-semibold text-slate-700 mb-1">Descrição</label> <textarea id="desc" rows="3" placeholder="Observações adicionais ou notas técnicas..." class="block w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border resize-none placeholder:text-slate-400">`);
          const $$body = escape_html(formDescricao);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div></div> <div class="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-8">`);
          Button($$renderer4, {
            variant: "outline",
            onclick: () => sheetOpen = false,
            disabled: isSaving,
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Cancelar`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            onclick: handleSalvar,
            disabled: isSaving || !formNome.trim(),
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->${escape_html(isSaving ? "Salvando..." : "Salvar Material")}`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div>`);
        };
        Sheet($$renderer3, {
          onclose: () => sheetOpen = false,
          get open() {
            return sheetOpen;
          },
          set open($$value) {
            sheetOpen = $$value;
            $$settled = false;
          },
          children,
          $$slots: { default: true }
        });
      }
      $$renderer3.push(`<!----> `);
      {
        let description = function($$renderer4) {
          $$renderer4.push(`<p>Tem certeza que deseja excluir '<strong>${escape_html(itemToDelete?.nome)}</strong>'?</p> <p>Isso poderá afetar o histórico de visitas que usaram este item.</p>`);
        };
        ConfirmDialog($$renderer3, {
          open: deleteConfirmOpen,
          title: "Excluir Material",
          confirmLabel: "Excluir",
          variant: "danger",
          onclose: () => deleteConfirmOpen = false,
          onconfirm: confirmarExcluir,
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
