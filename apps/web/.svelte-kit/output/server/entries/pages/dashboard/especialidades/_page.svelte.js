import {
  s as sanitize_props,
  a as spread_props,
  b as slot,
  l as head,
  f as escape_html,
  i as attr,
  d as stringify,
  e as ensure_array_like,
  h as attr_class,
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
import { S as Stethoscope } from "../../../../chunks/stethoscope.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { P as Power, a as Play } from "../../../../chunks/power.js";
function Chevron_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.469.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [["path", { d: "m6 9 6 6 6-6" }]];
  Icon(
    $$renderer,
    spread_props([
      { name: "chevron-down" },
      $$sanitized_props,
      {
        /**
         * @component @name ChevronDown
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chevron-down
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
    let especialidades = [];
    let loading = true;
    let error = null;
    let sheetOpen = false;
    let especialidadeEmEdicao = null;
    let expandedIds = /* @__PURE__ */ new Set();
    let formNome = "";
    let formCategoria = "";
    let deleteConfirmOpen = false;
    let isBlockingDialog = false;
    let categoryDeleteConfirmOpen = false;
    let subDeleteConfirmOpen = false;
    let addingSubToEspId = null;
    let formNomeSub = "";
    let savingNewSub = false;
    function formatarCategoria(cat) {
      if (!cat) return "";
      const lower = cat.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    async function fetchEspecialidades() {
      loading = true;
      error = null;
      try {
        const response = await apiFetch(
          "/especialidades?incluirInativos=true",
          data.sessionToken,
        );
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        const json = await response.json();
        const withSubs = await Promise.all(
          json.data.map(async (esp) => {
            try {
              const subRes = await apiFetch(
                `/especialidades/${esp.id}/subespecialidades?incluirInativas=true`,
                data.sessionToken,
              );
              if (subRes.ok) {
                const subData = await subRes.json();
                return { ...esp, subEspecialidades: subData.data || [] };
              }
            } catch {}
            return { ...esp, subEspecialidades: [] };
          }),
        );
        especialidades = withSubs;
      } catch (err) {
        error = err instanceof Error ? err.message : "Erro desconhecido";
      } finally {
        loading = false;
      }
    }
    let especialidadesAgrupadas = derived(() =>
      especialidades.reduce((acc, esp) => {
        const cat = formatarCategoria(esp.categoria);
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(esp);
        return acc;
      }, {}),
    );
    let categoriasOrdenadas = derived(() =>
      Object.keys(especialidadesAgrupadas()).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase()),
      ),
    );
    function handleNovaEspecialidade() {
      especialidadeEmEdicao = null;
      formNome = "";
      formCategoria = "";
      sheetOpen = true;
    }
    async function handleSalvarEspecialidade() {
      if (!formNome.trim() || !formCategoria.trim()) {
        toasts.show("error", "Nome e categoria são obrigatórios.");
        return;
      }
      const formData = {
        id: especialidadeEmEdicao?.id,
        nome: formNome,
        categoria:
          formCategoria.charAt(0).toUpperCase() +
          formCategoria.slice(1).toLowerCase(),
      };
      const url = formData.id
        ? `/especialidades/${formData.id}`
        : "/especialidades";
      const method = formData.id ? "PUT" : "POST";
      try {
        const response = await apiFetch(url, data.sessionToken, {
          method,
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        sheetOpen = false;
        toasts.show(
          "success",
          formData.id ? "Especialidade atualizada!" : "Especialidade criada!",
        );
        fetchEspecialidades();
      } catch (err) {
        toasts.show(
          "error",
          err instanceof Error ? err.message : "Erro ao salvar",
        );
      }
    }
    async function confirmDeleteEspecialidade() {
      return;
    }
    async function confirmDeleteCategoria() {
      return;
    }
    async function confirmDeleteSub() {
      return;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("ninlt0", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Especialidades — MediVisitas</title>`);
        });
      });
      $$renderer3.push(
        `<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">`,
      );
      Stethoscope($$renderer3, { class: "h-4.5 w-4.5 text-white" });
      $$renderer3.push(
        `<!----></div> <div><h1 class="text-lg font-bold text-slate-800">Especialidades</h1> <p class="text-[11px] text-slate-400">Gerencie as especialidades e subespecialidades médicas</p></div></div> <div class="flex items-center gap-2">`,
      );
      Button($$renderer3, {
        onclick: handleNovaEspecialidade,
        class: "hidden sm:inline-flex gap-2",
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "h-4 w-4" });
          $$renderer4.push(`<!----> Nova Especialidade`);
        },
        $$slots: { default: true },
      });
      $$renderer3.push(`<!----></div></div> `);
      if (loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(
          `<div class="card-surface flex items-center justify-center py-20"><div class="flex flex-col items-center gap-3"><div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div> <span class="text-sm text-slate-400">Carregando especialidades...</span></div></div>`,
        );
      } else if (error) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(
          `<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">`,
        );
        Stethoscope($$renderer3, { class: "h-6 w-6 text-red-400" });
        $$renderer3.push(
          `<!----></div> <div class="text-center"><p class="text-sm font-medium text-slate-700">Erro ao carregar</p> <p class="text-xs text-slate-400 mt-1">${escape_html(error)}</p></div> `,
        );
        Button($$renderer3, {
          variant: "outline",
          size: "sm",
          onclick: () => fetchEspecialidades(),
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Tentar novamente`);
          },
          $$slots: { default: true },
        });
        $$renderer3.push(`<!----></div>`);
      } else if (categoriasOrdenadas().length === 0) {
        $$renderer3.push("<!--[2-->");
        $$renderer3.push(
          `<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">`,
        );
        Stethoscope($$renderer3, { class: "h-7 w-7 text-slate-400" });
        $$renderer3.push(
          `<!----></div> <div class="text-center"><p class="text-sm font-medium text-slate-700">Nenhuma especialidade cadastrada</p> <p class="text-xs text-slate-400 mt-1">Comece adicionando a primeira especialidade</p></div> `,
        );
        Button($$renderer3, {
          size: "sm",
          onclick: handleNovaEspecialidade,
          class: "gap-2",
          children: ($$renderer4) => {
            Plus($$renderer4, { class: "h-4 w-4" });
            $$renderer4.push(`<!----> Criar Especialidade`);
          },
          $$slots: { default: true },
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="space-y-6"><!--[-->`);
        const each_array = ensure_array_like(categoriasOrdenadas());
        for (
          let $$index_2 = 0, $$length = each_array.length;
          $$index_2 < $$length;
          $$index_2++
        ) {
          let categoria = each_array[$$index_2];
          $$renderer3.push(
            `<div class="group"><div class="mb-3 flex items-center justify-between"><div class="flex items-center gap-2.5"><div class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">`,
          );
          Stethoscope($$renderer3, { class: "h-3.5 w-3.5 text-slate-500" });
          $$renderer3.push(
            `<!----></div> <h3 class="text-sm font-semibold text-slate-700 tracking-wide">${escape_html(formatarCategoria(categoria))}</h3> <span class="text-xs text-slate-400">(${escape_html(especialidadesAgrupadas()[categoria].length)})</span></div> <button title="Excluir categoria" class="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer">`,
          );
          Trash_2($$renderer3, {
            class:
              "w-3.5 h-3.5 text-slate-400 hover:text-red-500 transition-colors",
          });
          $$renderer3.push(
            `<!----></button></div> <div class="card-surface overflow-hidden"><table class="table-fixed w-full"><thead><tr class="border-b border-slate-100"><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-12"></th><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[40%]">Nome</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Subs</th><th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[20%]">Status</th><th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[25%]">Ações</th></tr></thead><tbody><!--[-->`,
          );
          const each_array_1 = ensure_array_like(
            especialidadesAgrupadas()[categoria].sort((a, b) =>
              a.nome.localeCompare(b.nome),
            ),
          );
          for (
            let $$index_1 = 0, $$length2 = each_array_1.length;
            $$index_1 < $$length2;
            $$index_1++
          ) {
            let esp = each_array_1[$$index_1];
            const subCount = esp.subEspecialidades?.length ?? 0;
            const isExpanded = expandedIds.has(esp.id);
            $$renderer3.push(
              `<tr${attr_class("group border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60", void 0, { "opacity-50": !esp.ativo })}><td class="p-3.5">`,
            );
            if (subCount > 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(
                `<button class="p-1 rounded-md hover:bg-slate-100 transition-all duration-200 cursor-pointer"${attr("title", isExpanded ? "Recolher" : "Expandir")}>`,
              );
              if (isExpanded) {
                $$renderer3.push("<!--[0-->");
                Chevron_down($$renderer3, { class: "w-4 h-4 text-slate-400" });
              } else {
                $$renderer3.push("<!--[-1-->");
                Chevron_right($$renderer3, { class: "w-4 h-4 text-slate-400" });
              }
              $$renderer3.push(`<!--]--></button>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(
              `<!--]--></td><td class="p-3.5"><span${attr_class("text-sm font-medium text-slate-800", void 0, { "text-slate-400": !esp.ativo })}>${escape_html(esp.nome)}</span></td><td class="p-3.5 text-center">`,
            );
            if (subCount > 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(
                `<span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-medium text-slate-600">${escape_html(subCount)}</span>`,
              );
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<span class="text-xs text-slate-300">—</span>`);
            }
            $$renderer3.push(
              `<!--]--></td><td class="p-3.5"><span${attr_class(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                void 0,
                {
                  "bg-emerald-50": esp.ativo,
                  "text-emerald-700": esp.ativo,
                  "bg-slate-100": !esp.ativo,
                  "text-slate-400": !esp.ativo,
                },
              )}>${escape_html(esp.ativo ? "Ativa" : "Inativa")}</span></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button${attr("title", esp.ativo ? "Inativar" : "Ativar")}${attr_class(`p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer ${stringify(esp.ativo ? "hover:text-amber-600" : "hover:text-green-600")}`)}>`,
            );
            if (esp.ativo) {
              $$renderer3.push("<!--[0-->");
              Power($$renderer3, { class: "w-4 h-4" });
            } else {
              $$renderer3.push("<!--[-1-->");
              Play($$renderer3, { class: "w-4 h-4" });
            }
            $$renderer3.push(
              `<!--]--></button> <button title="Excluir" class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer">`,
            );
            Trash_2($$renderer3, { class: "w-3.5 h-3.5 transition-colors" });
            $$renderer3.push(`<!----></button></div></td></tr> `);
            if (isExpanded) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<!--[-->`);
              const each_array_2 = ensure_array_like(
                esp.subEspecialidades ?? [],
              );
              for (
                let $$index = 0, $$length3 = each_array_2.length;
                $$index < $$length3;
                $$index++
              ) {
                let sub = each_array_2[$$index];
                $$renderer3.push(
                  `<tr${attr_class("border-t border-slate-50 bg-slate-25 transition-all", void 0, { "opacity-60": !!sub.deletedAt, italic: !!sub.deletedAt })}><td class="p-3.5"></td><td class="p-3.5 pl-9"><span class="text-sm text-slate-500">↳ ${escape_html(sub.nome)}</span></td><td class="p-3.5"></td><td class="p-3.5">`,
                );
                if (sub.deletedAt) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(
                    `<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-400">Inativa</span>`,
                  );
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(
                    `<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700">Ativa</span>`,
                  );
                }
                $$renderer3.push(
                  `<!--]--></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button${attr("title", sub.deletedAt ? "Ativar" : "Inativar")}${attr_class(`p-2 rounded-lg text-slate-500 opacity-40 hover:opacity-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer ${stringify(sub.deletedAt ? "hover:text-green-600" : "hover:text-amber-600")}`)}>`,
                );
                if (sub.deletedAt) {
                  $$renderer3.push("<!--[0-->");
                  Play($$renderer3, { class: "w-4 h-4" });
                } else {
                  $$renderer3.push("<!--[-1-->");
                  Power($$renderer3, { class: "w-4 h-4" });
                }
                $$renderer3.push(
                  `<!--]--></button> <button title="Excluir subespecialidade" class="p-2 rounded-lg text-slate-500 opacity-40 hover:opacity-100 hover:text-red-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer">`,
                );
                Trash_2($$renderer3, { class: "w-3 h-3 transition-colors" });
                $$renderer3.push(`<!----></button></div></td></tr>`);
              }
              $$renderer3.push(`<!--]--> `);
              if (addingSubToEspId === esp.id) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(
                  `<tr class="border-t border-slate-50 bg-blue-50/30"><td class="p-3.5"></td><td class="p-2.5 pl-9" colspan="2"><div class="flex items-center gap-2"><span class="text-sm text-slate-400">↳</span> <input type="text"${attr("value", formNomeSub)} class="input-base text-sm py-1.5" placeholder="Nome da subespecialidade"/></div></td><td class="p-2.5"></td><td class="p-2.5"><div class="flex justify-center items-center gap-1"><button${attr("disabled", savingNewSub, true)} class="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50">${escape_html("Salvar")}</button> <button class="px-2.5 py-1 text-xs font-medium rounded-md text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">Cancelar</button></div></td></tr>`,
                );
              } else {
                $$renderer3.push("<!--[-1-->");
                $$renderer3.push(
                  `<tr class="border-t border-slate-50"><td class="p-2.5"></td><td class="p-2.5 pl-9" colspan="4"><button class="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">`,
                );
                Plus($$renderer3, { class: "w-3.5 h-3.5" });
                $$renderer3.push(
                  `<!----> Adicionar subespecialidade</button></td></tr>`,
                );
              }
              $$renderer3.push(`<!--]-->`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--></tbody></table></div></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      {
        let children = function ($$renderer4) {
          $$renderer4.push(
            `<div class="space-y-6"><div><h3 class="text-lg font-semibold text-slate-900">${escape_html(especialidadeEmEdicao ? "Editar Especialidade" : "Nova Especialidade")}</h3> <p class="text-sm text-slate-400 mt-1">${escape_html(especialidadeEmEdicao ? "Atualize os dados abaixo" : "Preencha os dados para cadastrar")}</p></div> <div class="space-y-5"><div><label for="esp-nome" class="input-label">Nome</label> <input id="esp-nome" type="text"${attr("value", formNome)} class="input-base" placeholder="Ex: Cardiologia"/> <p class="input-hint">Nome da especialidade médica</p></div> <div class="relative"><label for="esp-categoria" class="input-label">Categoria</label> <div class="relative"><input id="esp-categoria" type="text"${attr("value", formCategoria)} class="input-base pr-9" placeholder="Selecione ou crie uma categoria" autocomplete="off"/> <button type="button"${attr("tabindex", -1)} class="absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">`,
          );
          Chevron_down($$renderer4, {
            class: `w-4 h-4 transition-transform duration-200 ${stringify("")}`,
          });
          $$renderer4.push(
            `<!----></button></div> <p class="input-hint">Selecione existente ou digite para criar nova</p> `,
          );
          {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(
            `<!--]--></div></div> <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">`,
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
            onclick: handleSalvarEspecialidade,
            children: ($$renderer5) => {
              $$renderer5.push(
                `<!---->${escape_html(especialidadeEmEdicao ? "Salvar" : "Criar")}`,
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
      Button($$renderer3, {
        class:
          "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden",
        onclick: handleNovaEspecialidade,
        children: ($$renderer4) => {
          Plus($$renderer4, { class: "h-6 w-6 text-white" });
        },
        $$slots: { default: true },
      });
      $$renderer3.push(`<!----> `);
      {
        let description = function ($$renderer4) {
          {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        ConfirmDialog($$renderer3, {
          open: deleteConfirmOpen,
          onclose: () => {
            deleteConfirmOpen = false;
            isBlockingDialog = false;
          },
          title: isBlockingDialog
            ? "Especialidade em uso"
            : "Excluir especialidade",
          onconfirm: confirmDeleteEspecialidade,
          variant: isBlockingDialog ? "warning" : "danger",
          isBlockingDialog,
          description,
        });
      }
      $$renderer3.push(`<!----> `);
      {
        let description = function ($$renderer4) {
          {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        ConfirmDialog($$renderer3, {
          open: categoryDeleteConfirmOpen,
          onclose: () => (categoryDeleteConfirmOpen = false),
          title: "Excluir categoria",
          variant: "danger",
          onconfirm: confirmDeleteCategoria,
          description,
        });
      }
      $$renderer3.push(`<!----> `);
      {
        let description = function ($$renderer4) {
          {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        ConfirmDialog($$renderer3, {
          open: subDeleteConfirmOpen,
          onclose: () => (subDeleteConfirmOpen = false),
          title: "Excluir subespecialidade",
          variant: "danger",
          onconfirm: confirmDeleteSub,
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
