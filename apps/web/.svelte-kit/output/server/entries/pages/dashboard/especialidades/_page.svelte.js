import { J as attr, X as escape_html, _ as stringify, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, p as sanitize_props, s as derived, u as head } from "../../../../chunks/dev.js";
import { n as toasts } from "../../../../chunks/toast.svelte.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Chevron_right } from "../../../../chunks/chevron-right.js";
import { n as Play, t as Power } from "../../../../chunks/power.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { t as Stethoscope } from "../../../../chunks/stethoscope.js";
import { n as Trash_2, t as ConfirmDialog } from "../../../../chunks/ConfirmDialog.js";
import { t as Sheet } from "../../../../chunks/Sheet.js";
import { t as apiFetch } from "../../../../chunks/api.js";
import { t as Button } from "../../../../chunks/Button.js";
import { t as EmptyState } from "../../../../chunks/EmptyState.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/chevron-down.svelte
function Chevron_down($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "chevron-down" },
		sanitize_props($$props),
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
			iconNode: [["path", { "d": "m6 9 6 6 6-6" }]],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region src/routes/dashboard/especialidades/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let especialidades = [];
		let loading = true;
		let error = null;
		let sheetOpen = false;
		let especialidadeEmEdicao = null;
		let expandedIds = /* @__PURE__ */ new Set();
		let formNome = "";
		let formNomeError = false;
		let formCategoria = "";
		let deleteConfirmOpen = false;
		let isBlockingDialog = false;
		let itemToDelete = null;
		let categoryDeleteConfirmOpen = false;
		let categoryToDelete = null;
		let subToDelete = null;
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
				const response = await apiFetch("/especialidades?incluirInativos=true", data.sessionToken);
				if (!response.ok) throw new Error(`Erro ${response.status}`);
				const json = await response.json();
				especialidades = await Promise.all(json.data.map(async (esp) => {
					try {
						const subRes = await apiFetch(`/especialidades/${esp.id}/subespecialidades?incluirInativas=true`, data.sessionToken);
						if (subRes.ok) {
							const subData = await subRes.json();
							return {
								...esp,
								subEspecialidades: subData.data || []
							};
						}
					} catch {}
					return {
						...esp,
						subEspecialidades: []
					};
				}));
			} catch (err) {
				error = err instanceof Error ? err.message : "Erro desconhecido";
			} finally {
				loading = false;
			}
		}
		let especialidadesAgrupadas = derived(() => especialidades.reduce((acc, esp) => {
			const cat = formatarCategoria(esp.categoria);
			if (!acc[cat]) acc[cat] = [];
			acc[cat].push(esp);
			return acc;
		}, {}));
		let categoriasOrdenadas = derived(() => Object.keys(especialidadesAgrupadas()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())));
		derived(() => categoriasOrdenadas().filter((c) => c.toLowerCase().includes(formCategoria.toLowerCase())));
		function handleNovaEspecialidade() {
			especialidadeEmEdicao = null;
			formNome = "";
			formCategoria = "";
			sheetOpen = true;
		}
		async function handleSalvarEspecialidade() {
			formNomeError = false;
			if (!formNome.trim() || !formCategoria.trim()) {
				if (!formNome.trim()) formNomeError = true;
				if (!formCategoria.trim());
				toasts.show("error", "Nome e categoria são obrigatórios.");
				return;
			}
			const formData = {
				id: especialidadeEmEdicao?.id,
				nome: formNome,
				categoria: formCategoria.charAt(0).toUpperCase() + formCategoria.slice(1).toLowerCase()
			};
			const url = formData.id ? `/especialidades/${formData.id}` : "/especialidades";
			const method = formData.id ? "PUT" : "POST";
			try {
				const response = await apiFetch(url, data.sessionToken, {
					method,
					body: JSON.stringify(formData)
				});
				if (!response.ok) throw new Error(`Erro ${response.status}`);
				sheetOpen = false;
				toasts.show("success", formData.id ? "Especialidade atualizada!" : "Especialidade criada!");
				fetchEspecialidades();
			} catch (err) {
				toasts.show("error", err instanceof Error ? err.message : "Erro ao salvar");
			}
		}
		async function confirmDeleteEspecialidade() {
			if (!itemToDelete) return;
			const response = await apiFetch(`/especialidades/${itemToDelete.id}`, data.sessionToken, { method: "DELETE" });
			if (!response.ok) {
				const d = await response.json();
				toasts.show("error", d.error || "Erro ao excluir");
				deleteConfirmOpen = false;
				return;
			}
			especialidades = especialidades.filter((e) => e.id !== itemToDelete.id);
			toasts.show("success", `"${itemToDelete.nome}" excluída.`);
			deleteConfirmOpen = false;
			itemToDelete = null;
		}
		async function confirmDeleteCategoria() {
			if (!categoryToDelete) return;
			const response = await apiFetch(`/especialidades/categorias/${encodeURIComponent(categoryToDelete)}`, data.sessionToken, { method: "DELETE" });
			if (!response.ok) {
				const d = await response.json();
				toasts.show("error", d.error || "Erro ao excluir categoria");
				categoryDeleteConfirmOpen = false;
				return;
			}
			const result = await response.json();
			especialidades = especialidades.filter((e) => e.categoria !== categoryToDelete);
			toasts.show("success", `Categoria "${categoryToDelete}" excluída (${result.excluidas} itens).`);
			categoryDeleteConfirmOpen = false;
			categoryToDelete = null;
		}
		async function confirmDeleteSub() {
			if (!subToDelete) return;
			const { sub } = subToDelete;
			try {
				const response = await apiFetch(`/subespecialidades/${sub.id}`, data.sessionToken, { method: "DELETE" });
				if (response.ok) {
					especialidades = especialidades.map((e) => ({
						...e,
						subEspecialidades: (e.subEspecialidades || []).filter((s) => s.id !== sub.id)
					}));
					toasts.show("success", `"${sub.nome}" excluída.`);
				} else if (response.status === 409) toasts.show("error", "Subespecialidade possui profissionais vinculados. Desvincule-os primeiro.");
				else toasts.show("error", "Erro ao excluir subespecialidade.");
			} catch {
				toasts.show("error", "Erro ao excluir subespecialidade.");
			} finally {
				subDeleteConfirmOpen = false;
				subToDelete = null;
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("ninlt0", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Especialidades — MediVisitas</title>`);
				});
			});
			$$renderer.push(`<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">`);
			Stethoscope($$renderer, { class: "h-4.5 w-4.5 text-white" });
			$$renderer.push(`<!----></div> <div><h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Especialidades</h1> <p class="text-[11px] text-[rgb(var(--slate-400))]">Gerencie as especialidades e subespecialidades médicas</p></div></div> <div class="flex items-center gap-2">`);
			Button($$renderer, {
				onclick: handleNovaEspecialidade,
				class: "hidden sm:inline-flex gap-2",
				children: ($$renderer) => {
					Plus($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> Nova Especialidade`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> `);
			if (loading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="card-surface flex items-center justify-center py-20"><div class="flex flex-col items-center gap-3"><div class="h-8 w-8 animate-spin rounded-full border-2 border-[rgb(var(--slate-200))] border-t-blue-600"></div> <span class="text-sm text-[rgb(var(--slate-400))]">Carregando especialidades...</span></div></div>`);
			} else if (error) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">`);
				Stethoscope($$renderer, { class: "h-6 w-6 text-red-400" });
				$$renderer.push(`<!----></div> <div class="text-center"><p class="text-sm font-medium text-[rgb(var(--slate-700))]">Erro ao carregar</p> <p class="text-xs text-[rgb(var(--slate-400))] mt-1">${escape_html(error)}</p></div> `);
				Button($$renderer, {
					variant: "outline",
					size: "sm",
					onclick: () => fetchEspecialidades(),
					children: ($$renderer) => {
						$$renderer.push(`<!---->Tentar novamente`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else if (categoriasOrdenadas().length === 0) {
				$$renderer.push("<!--[2-->");
				EmptyState($$renderer, {
					icon: Stethoscope,
					titulo: "Nenhuma especialidade cadastrada",
					descricao: "Comece adicionando a primeira especialidade",
					acaoLabel: "Criar Especialidade",
					acaoOnclick: handleNovaEspecialidade
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="space-y-6"><!--[-->`);
				const each_array = ensure_array_like(categoriasOrdenadas());
				for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
					let categoria = each_array[$$index_2];
					$$renderer.push(`<div class="group"><div class="mb-3 flex items-center justify-between"><div class="flex items-center gap-2.5"><div class="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgb(var(--slate-100))]">`);
					Stethoscope($$renderer, { class: "h-3.5 w-3.5 text-[rgb(var(--slate-500))]" });
					$$renderer.push(`<!----></div> <h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] tracking-wide">${escape_html(formatarCategoria(categoria))}</h3> <span class="text-xs text-[rgb(var(--slate-400))]">(${escape_html(especialidadesAgrupadas()[categoria].length)})</span></div> <button title="Excluir categoria" class="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer">`);
					Trash_2($$renderer, { class: "w-3.5 h-3.5 text-[rgb(var(--slate-400))] hover:text-red-500 transition-colors" });
					$$renderer.push(`<!----></button></div> <div class="card-surface overflow-hidden"><table class="table-fixed w-full"><thead><tr class="border-b border-[rgb(var(--slate-100))]"><th class="p-3.5 text-left text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-12"></th><th class="p-3.5 text-left text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[40%]">Nome</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[15%]">Subs</th><th class="p-3.5 text-left text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[20%]">Status</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[25%]">Ações</th></tr></thead><tbody><!--[-->`);
					const each_array_1 = ensure_array_like(especialidadesAgrupadas()[categoria].sort((a, b) => a.nome.localeCompare(b.nome)));
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let esp = each_array_1[$$index_1];
						const subCount = esp.subEspecialidades?.length ?? 0;
						const isExpanded = expandedIds.has(esp.id);
						$$renderer.push(`<tr${attr_class("group border-t border-[rgb(var(--slate-50))] transition-all duration-200 cursor-pointer hover:bg-[rgb(var(--slate-50))]/60", void 0, { "opacity-50": !esp.ativo })}><td class="p-3.5">`);
						if (subCount > 0) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<button class="p-1 rounded-md hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer"${attr("title", isExpanded ? "Recolher" : "Expandir")}>`);
							if (isExpanded) {
								$$renderer.push("<!--[0-->");
								Chevron_down($$renderer, { class: "w-4 h-4 text-[rgb(var(--slate-400))]" });
							} else {
								$$renderer.push("<!--[-1-->");
								Chevron_right($$renderer, { class: "w-4 h-4 text-[rgb(var(--slate-400))]" });
							}
							$$renderer.push(`<!--]--></button>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></td><td class="p-3.5"><span${attr_class("text-sm font-medium text-[rgb(var(--slate-800))]", void 0, { "text-[rgb(var(--slate-400))]": !esp.ativo })}>${escape_html(esp.nome)}</span></td><td class="p-3.5 text-center">`);
						if (subCount > 0) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[rgb(var(--slate-100))] px-1.5 text-[11px] font-medium text-[rgb(var(--slate-600))]">${escape_html(subCount)}</span>`);
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<span class="text-xs text-[rgb(var(--slate-300))]">—</span>`);
						}
						$$renderer.push(`<!--]--></td><td class="p-3.5"><span${attr_class("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", void 0, {
							"bg-emerald-50": esp.ativo,
							"text-emerald-700": esp.ativo,
							"bg-[rgb(var(--slate-100))]": !esp.ativo,
							"text-[rgb(var(--slate-400))]": !esp.ativo
						})}>${escape_html(esp.ativo ? "Ativa" : "Inativa")}</span></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button${attr("title", esp.ativo ? "Inativar" : "Ativar")}${attr_class(`p-2 rounded-lg text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer ${stringify(esp.ativo ? "hover:text-amber-600" : "hover:text-green-600")}`)}>`);
						if (esp.ativo) {
							$$renderer.push("<!--[0-->");
							Power($$renderer, { class: "w-4 h-4" });
						} else {
							$$renderer.push("<!--[-1-->");
							Play($$renderer, { class: "w-4 h-4" });
						}
						$$renderer.push(`<!--]--></button> <button title="Excluir" class="p-2 rounded-lg text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer">`);
						Trash_2($$renderer, { class: "w-3.5 h-3.5 transition-colors" });
						$$renderer.push(`<!----></button></div></td></tr> `);
						if (isExpanded) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<!--[-->`);
							const each_array_2 = ensure_array_like(esp.subEspecialidades ?? []);
							for (let $$index = 0, $$length = each_array_2.length; $$index < $$length; $$index++) {
								let sub = each_array_2[$$index];
								$$renderer.push(`<tr${attr_class("border-t border-[rgb(var(--slate-50))] bg-[rgb(var(--slate-50))] transition-all", void 0, {
									"opacity-60": !!sub.deletedAt,
									"italic": !!sub.deletedAt
								})}><td class="p-3.5"></td><td class="p-3.5 pl-9"><span class="text-sm text-[rgb(var(--slate-500))]">↳ ${escape_html(sub.nome)}</span></td><td class="p-3.5"></td><td class="p-3.5">`);
								if (sub.deletedAt) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-400))]">Inativa</span>`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700">Ativa</span>`);
								}
								$$renderer.push(`<!--]--></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button${attr("title", sub.deletedAt ? "Ativar" : "Inativar")}${attr_class(`p-2 rounded-lg text-[rgb(var(--slate-500))] opacity-40 hover:opacity-100 hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer ${stringify(sub.deletedAt ? "hover:text-green-600" : "hover:text-amber-600")}`)}>`);
								if (sub.deletedAt) {
									$$renderer.push("<!--[0-->");
									Play($$renderer, { class: "w-4 h-4" });
								} else {
									$$renderer.push("<!--[-1-->");
									Power($$renderer, { class: "w-4 h-4" });
								}
								$$renderer.push(`<!--]--></button> <button title="Excluir subespecialidade" class="p-2 rounded-lg text-[rgb(var(--slate-500))] opacity-40 hover:opacity-100 hover:text-red-600 hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer">`);
								Trash_2($$renderer, { class: "w-3 h-3 transition-colors" });
								$$renderer.push(`<!----></button></div></td></tr>`);
							}
							$$renderer.push(`<!--]--> `);
							if (addingSubToEspId === esp.id) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<tr class="border-t border-[rgb(var(--slate-50))] bg-blue-50/30"><td class="p-3.5"></td><td class="p-2.5 pl-9" colspan="2"><div class="flex items-center gap-2"><span class="text-sm text-[rgb(var(--slate-400))]">↳</span> <input type="text"${attr("value", formNomeSub)} class="input-base text-sm py-1.5" placeholder="Nome da subespecialidade"/></div></td><td class="p-2.5"></td><td class="p-2.5"><div class="flex justify-center items-center gap-1"><button${attr("disabled", savingNewSub, true)} class="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50">${escape_html("Salvar")}</button> <button class="px-2.5 py-1 text-xs font-medium rounded-md text-[rgb(var(--slate-500))] hover:bg-[rgb(var(--slate-100))] transition-colors cursor-pointer">Cancelar</button></div></td></tr>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<tr class="border-t border-[rgb(var(--slate-50))]"><td class="p-2.5"></td><td class="p-2.5 pl-9" colspan="4"><button class="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">`);
								Plus($$renderer, { class: "w-3.5 h-3.5" });
								$$renderer.push(`<!----> Adicionar subespecialidade</button></td></tr>`);
							}
							$$renderer.push(`<!--]-->`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					$$renderer.push(`<!--]--></tbody></table></div></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--> `);
			{
				function children($$renderer) {
					$$renderer.push(`<div class="space-y-6"><div><h3 class="text-lg font-semibold text-[rgb(var(--slate-900))]">${escape_html(especialidadeEmEdicao ? "Editar Especialidade" : "Nova Especialidade")}</h3> <p class="text-sm text-[rgb(var(--slate-400))] mt-1">${escape_html(especialidadeEmEdicao ? "Atualize os dados abaixo" : "Preencha os dados para cadastrar")}</p></div> <div class="space-y-5"><div><label for="esp-nome" class="input-label">Nome</label> <input id="esp-nome" type="text"${attr("value", formNome)}${attr_class(`input-base ${stringify(formNomeError ? "input-error" : "")}`)} placeholder="Ex: Cardiologia"/> `);
					if (formNomeError) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="input-error-msg">Nome é obrigatório</p>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<p class="input-hint">Nome da especialidade médica</p>`);
					}
					$$renderer.push(`<!--]--></div> <div class="relative"><label for="esp-categoria" class="input-label">Categoria</label> <div class="relative"><input id="esp-categoria" type="text"${attr("value", formCategoria)} class="input-base pr-9" placeholder="Selecione ou crie uma categoria" autocomplete="off"/> <button type="button"${attr("tabindex", -1)} class="absolute inset-y-0 right-0 flex items-center px-2.5 text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] transition-colors cursor-pointer">`);
					Chevron_down($$renderer, { class: `w-4 h-4 transition-transform duration-200 ${stringify("")}` });
					$$renderer.push(`<!----></button></div> <p class="input-hint">Selecione existente ou digite para criar nova</p> `);
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div> <div class="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--slate-100))]">`);
					Button($$renderer, {
						variant: "outline",
						onclick: () => sheetOpen = false,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Cancelar`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: handleSalvarEspecialidade,
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(especialidadeEmEdicao ? "Salvar" : "Criar")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div></div>`);
				}
				Sheet($$renderer, {
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
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				class: "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden",
				onclick: handleNovaEspecialidade,
				children: ($$renderer) => {
					Plus($$renderer, { class: "h-6 w-6 text-white" });
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			{
				function description($$renderer) {
					if (itemToDelete) {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<p>Você está prestes a excluir a especialidade <strong>"${escape_html(itemToDelete.nome)}"</strong>.</p> <p>Esta ação não pode ser desfeita.</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				ConfirmDialog($$renderer, {
					open: deleteConfirmOpen,
					onclose: () => {
						deleteConfirmOpen = false;
						isBlockingDialog = false;
					},
					title: isBlockingDialog ? "Especialidade em uso" : "Excluir especialidade",
					onconfirm: confirmDeleteEspecialidade,
					variant: isBlockingDialog ? "warning" : "danger",
					isBlockingDialog,
					description,
					$$slots: { description: true }
				});
			}
			$$renderer.push(`<!----> `);
			{
				function description($$renderer) {
					if (categoryToDelete) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p>A exclusão da categoria <strong>"${escape_html(categoryToDelete)}"</strong> também excluirá todas
			as especialidades e subespecialidades vinculadas.</p> <p>Esta ação não pode ser desfeita.</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				ConfirmDialog($$renderer, {
					open: categoryDeleteConfirmOpen,
					onclose: () => categoryDeleteConfirmOpen = false,
					title: "Excluir categoria",
					variant: "danger",
					onconfirm: confirmDeleteCategoria,
					description,
					$$slots: { description: true }
				});
			}
			$$renderer.push(`<!----> `);
			{
				function description($$renderer) {
					if (subToDelete) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p>Excluir a subespecialidade <strong>"${escape_html(subToDelete.sub.nome)}"</strong> de "${escape_html(subToDelete.espNome)}"?</p> <p>Esta ação não pode ser desfeita.</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				ConfirmDialog($$renderer, {
					open: subDeleteConfirmOpen,
					onclose: () => subDeleteConfirmOpen = false,
					title: "Excluir subespecialidade",
					variant: "danger",
					onconfirm: confirmDeleteSub,
					description,
					$$slots: { description: true }
				});
			}
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
