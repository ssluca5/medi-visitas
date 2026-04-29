import "../../../../chunks/index-server.js";
import { J as attr, X as escape_html, _ as stringify, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, p as sanitize_props, s as derived, u as head } from "../../../../chunks/dev.js";
import { n as toasts } from "../../../../chunks/toast.svelte.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Package } from "../../../../chunks/package.js";
import { n as Play, t as Power } from "../../../../chunks/power.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { t as Search } from "../../../../chunks/search.js";
import { n as Trash_2, t as ConfirmDialog } from "../../../../chunks/ConfirmDialog.js";
import { t as Sheet } from "../../../../chunks/Sheet.js";
import { t as apiFetch } from "../../../../chunks/api.js";
import { t as Button } from "../../../../chunks/Button.js";
import { t as EmptyState } from "../../../../chunks/EmptyState.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/database.svelte
function Database($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "database" },
		sanitize_props($$props),
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
			iconNode: [
				["ellipse", {
					"cx": "12",
					"cy": "5",
					"rx": "9",
					"ry": "3"
				}],
				["path", { "d": "M3 5V19A9 3 0 0 0 21 19V5" }],
				["path", { "d": "M3 12A9 3 0 0 0 21 12" }]
			],
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
//#region src/routes/dashboard/materiais/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let materiais = [];
		let loading = true;
		let error = null;
		let filtroBusca = "";
		let filtroTipo = "";
		let materiaisFiltrados = derived(() => materiais.filter((m) => {
			const matchBusca = !filtroBusca || m.nome.toLowerCase().includes(filtroBusca.toLowerCase()) || m.descricao && m.descricao.toLowerCase().includes(filtroBusca.toLowerCase());
			const matchTipo = !filtroTipo || m.tipo === filtroTipo;
			return matchBusca && matchTipo;
		}));
		let sheetOpen = false;
		let materialEmEdicao = null;
		let formNome = "";
		let formNomeError = false;
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
			formNomeError = false;
			if (!formNome.trim()) {
				formNomeError = true;
				toasts.show("error", "Nome é obrigatório");
				document.getElementById("nome")?.focus();
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
				const res = await apiFetch(url, data.sessionToken, {
					method,
					body: JSON.stringify(payload)
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
			if (!itemToDelete) return;
			try {
				if ((await apiFetch(`/materiais/${itemToDelete.id}`, data.sessionToken, { method: "DELETE" })).ok) {
					toasts.show("success", "Material excluído");
					materiais = materiais.filter((m) => m.id !== itemToDelete.id);
				} else toasts.show("error", "Erro ao excluir material");
			} catch (e) {
				toasts.show("error", "Erro interno");
			} finally {
				deleteConfirmOpen = false;
				itemToDelete = null;
			}
		}
		function getTipoLabel(tipo) {
			switch (tipo) {
				case "AMOSTRA": return "Amostra Grátis";
				case "BULA": return "Bula";
				case "APRESENTACAO": return "Apresentação";
				case "FOLDER": return "Folder";
				case "OUTRO": return "Outro";
			}
			return tipo;
		}
		function getBadgeClasses(tipo) {
			switch (tipo) {
				case "AMOSTRA": return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
				case "APRESENTACAO": return "bg-indigo-50 text-indigo-700 border-indigo-200/50";
				case "FOLDER": return "bg-blue-50 text-blue-700 border-blue-200/50";
				default: return "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))] border-[rgb(var(--slate-200))]";
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("10qjr13", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Materiais e Amostras — MediVisitas</title>`);
				});
			});
			$$renderer.push(`<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">`);
			Package($$renderer, { class: "h-4.5 w-4.5 text-white" });
			$$renderer.push(`<!----></div> <div><h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Materiais &amp; Amostras</h1> <p class="text-[11px] text-[rgb(var(--slate-400))]">Cadastre as amostras grátis, folders e apresentações</p></div></div> <div class="flex items-center gap-2">`);
			Button($$renderer, {
				onclick: handleNovo,
				class: "hidden sm:inline-flex gap-2",
				children: ($$renderer) => {
					Plus($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> Novo Material`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> <div class="card-surface p-4 mb-6"><div class="flex flex-col sm:flex-row gap-4"><div class="relative flex-1">`);
			Search($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate-400))] pointer-events-none" });
			$$renderer.push(`<!----> <input type="text" placeholder="Buscar por nome ou descrição..."${attr("value", filtroBusca)} class="input-base !pl-9 w-full"/></div> <div class="w-full sm:w-64 shrink-0">`);
			$$renderer.select({
				value: filtroTipo,
				class: "input-base w-full"
			}, ($$renderer) => {
				$$renderer.option({ value: "" }, ($$renderer) => {
					$$renderer.push(`Todos os tipos`);
				});
				$$renderer.option({ value: "AMOSTRA" }, ($$renderer) => {
					$$renderer.push(`Amostra Grátis`);
				});
				$$renderer.option({ value: "BULA" }, ($$renderer) => {
					$$renderer.push(`Bula`);
				});
				$$renderer.option({ value: "APRESENTACAO" }, ($$renderer) => {
					$$renderer.push(`Apresentação`);
				});
				$$renderer.option({ value: "FOLDER" }, ($$renderer) => {
					$$renderer.push(`Folder / Informativo`);
				});
				$$renderer.option({ value: "OUTRO" }, ($$renderer) => {
					$$renderer.push(`Outro`);
				});
			});
			$$renderer.push(`</div></div></div> `);
			if (loading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="card-surface py-20 flex flex-col items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-2 border-[rgb(var(--slate-200))] border-t-indigo-600 mb-4"></div> <p class="text-[rgb(var(--slate-500))] text-sm">Carregando...</p></div>`);
			} else if (error) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="card-surface py-20 flex flex-col items-center justify-center">`);
				Database($$renderer, { class: "h-8 w-8 text-red-500 mb-2" });
				$$renderer.push(`<!----> <p class="text-[rgb(var(--slate-700))] font-medium">Falha ao conectar no servidor</p> <p class="text-[rgb(var(--slate-500))] text-sm">${escape_html(error)}</p> `);
				Button($$renderer, {
					class: "mt-4",
					variant: "outline",
					onclick: loadMateriais,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Tentar novamente`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else if (materiais.length === 0) {
				$$renderer.push("<!--[2-->");
				EmptyState($$renderer, {
					icon: Package,
					titulo: "Nenhum material encontrado",
					descricao: "Cadastre as amostras grátis, folders e apresentações que os RCs distribuem aos médicos.",
					acaoLabel: "Cadastrar Primeiro Material",
					acaoOnclick: handleNovo
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="card-surface overflow-hidden"><table class="table-fixed w-full"><thead><tr class="border-b border-[rgb(var(--slate-100))]"><th class="p-3.5 text-left text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[35%]">Material</th><th class="p-3.5 text-left text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[35%]">Descrição</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[15%]">Tipo</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[15%]">Ações</th></tr></thead><tbody><!--[-->`);
				const each_array = ensure_array_like(materiaisFiltrados());
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let material = each_array[$$index];
					const isAtivo = !material.deletedAt;
					$$renderer.push(`<tr${attr_class("group border-t border-[rgb(var(--slate-50))] transition-all duration-200 cursor-pointer hover:bg-[rgb(var(--slate-50))]/60", void 0, { "opacity-50": !isAtivo })}><td class="p-3.5"><div class="flex items-center gap-3"><div${attr_class("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-sm", void 0, {
						"bg-indigo-50": isAtivo,
						"text-indigo-600": isAtivo,
						"border": isAtivo,
						"border-indigo-100": isAtivo,
						"bg-[rgb(var(--slate-100))]": !isAtivo,
						"text-[rgb(var(--slate-400))]": !isAtivo
					})}>`);
					Package($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----></div> <div class="min-w-0"><p${attr_class("text-sm font-medium truncate", void 0, {
						"text-[rgb(var(--slate-900))]": isAtivo,
						"text-[rgb(var(--slate-400))]": !isAtivo
					})}>${escape_html(material.nome)}</p> `);
					if (!isAtivo) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-[10px] uppercase font-bold tracking-wider rounded text-red-600 mt-0.5">Inativo</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div></td><td class="p-3.5 text-left">`);
					if (material.descricao) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-sm text-[rgb(var(--slate-500))] truncate block">${escape_html(material.descricao)}</span>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<span class="text-sm text-[rgb(var(--slate-300))] truncate block">—</span>`);
					}
					$$renderer.push(`<!--]--></td><td class="p-3.5 text-center"><span${attr_class(`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wider uppercase border ${stringify(getBadgeClasses(material.tipo))}`)}>${escape_html(getTipoLabel(material.tipo))}</span></td><td class="p-3.5"><div class="flex justify-center items-center gap-1"><button${attr("title", isAtivo ? "Inativar" : "Ativar")}${attr_class(`p-1.5 rounded-md text-[rgb(var(--slate-400))] transition-colors cursor-pointer ${stringify(isAtivo ? "hover:text-amber-600 hover:bg-amber-50" : "hover:text-green-600 hover:bg-green-50")}`)}>`);
					if (isAtivo) {
						$$renderer.push("<!--[0-->");
						Power($$renderer, { class: "w-4 h-4" });
					} else {
						$$renderer.push("<!--[-1-->");
						Play($$renderer, { class: "w-4 h-4" });
					}
					$$renderer.push(`<!--]--></button> <button title="Excluir" class="p-1.5 rounded-md text-[rgb(var(--slate-400))] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">`);
					Trash_2($$renderer, { class: "w-4 h-4" });
					$$renderer.push(`<!----></button></div></td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table> `);
				if (materiaisFiltrados().length === 0 && materiais.length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="py-12 flex flex-col items-center justify-center text-center"><p class="text-[rgb(var(--slate-500))] text-sm">Nenhum material encontrado com esses filtros.</p> `);
					Button($$renderer, {
						class: "mt-4",
						variant: "outline",
						onclick: () => {
							filtroBusca = "";
							filtroTipo = "";
						},
						children: ($$renderer) => {
							$$renderer.push(`<!---->Limpar Filtros`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				class: "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden z-10 p-0",
				onclick: handleNovo,
				children: ($$renderer) => {
					Plus($$renderer, { class: "h-6 w-6 text-white" });
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			{
				function children($$renderer) {
					$$renderer.push(`<div class="space-y-5"><div><h3 class="text-lg font-semibold text-[rgb(var(--slate-900))]">${escape_html(materialEmEdicao ? "Editar Material" : "Novo Material")}</h3> <p class="text-sm text-[rgb(var(--slate-400))] mt-1">Preencha os dados para cadastrar</p></div> <div class="space-y-3"><div><label for="tipo" class="input-label">Tipo de Material</label> `);
					$$renderer.select({
						id: "tipo",
						value: formTipo,
						class: "input-base"
					}, ($$renderer) => {
						$$renderer.option({ value: "AMOSTRA" }, ($$renderer) => {
							$$renderer.push(`Amostra Grátis`);
						});
						$$renderer.option({ value: "BULA" }, ($$renderer) => {
							$$renderer.push(`Bula`);
						});
						$$renderer.option({ value: "APRESENTACAO" }, ($$renderer) => {
							$$renderer.push(`Apresentação`);
						});
						$$renderer.option({ value: "FOLDER" }, ($$renderer) => {
							$$renderer.push(`Folder / Informativo`);
						});
						$$renderer.option({ value: "OUTRO" }, ($$renderer) => {
							$$renderer.push(`Outro`);
						});
					});
					$$renderer.push(`</div> <div><label for="nome" class="input-label">Nome do Produto *</label> <input id="nome"${attr("value", formNome)} type="text"${attr_class(`input-base ${stringify(formNomeError ? "input-error" : "")}`)} placeholder="Ex: Medicamento X 500mg"/> `);
					if (formNomeError) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="input-error-msg">Nome é obrigatório</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div><label for="desc" class="input-label">Descrição</label> <textarea id="desc" rows="3" class="input-base resize-none" placeholder="Observações adicionais ou notas técnicas...">`);
					const $$body = escape_html(formDescricao);
					if ($$body) $$renderer.push(`${$$body}`);
					$$renderer.push(`</textarea></div></div> <div class="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--slate-100))]">`);
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
						onclick: handleSalvar,
						disabled: isSaving || !formNome.trim(),
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(isSaving ? "Salvando..." : "Salvar Material")}`);
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
			{
				function description($$renderer) {
					$$renderer.push(`<p>Tem certeza que deseja excluir '<strong>${escape_html(itemToDelete?.nome)}</strong>'?</p> <p>Isso poderá afetar o histórico de visitas que usaram este item.</p>`);
				}
				ConfirmDialog($$renderer, {
					open: deleteConfirmOpen,
					title: "Excluir Material",
					confirmLabel: "Excluir",
					variant: "danger",
					onclose: () => deleteConfirmOpen = false,
					onconfirm: confirmarExcluir,
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
