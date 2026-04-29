import "../../../../chunks/index-server.js";
import { J as attr, X as escape_html, _ as stringify, g as store_get, h as spread_props, l as ensure_array_like, m as slot, n as attr_class, p as sanitize_props, s as derived, u as head, v as unsubscribe_stores } from "../../../../chunks/dev.js";
import "../../../../chunks/navigation.js";
import { n as toasts } from "../../../../chunks/toast.svelte.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Arrow_left } from "../../../../chunks/arrow-left.js";
import { t as Arrow_right } from "../../../../chunks/arrow-right.js";
import { t as Calendar } from "../../../../chunks/calendar.js";
import { t as Chevron_left } from "../../../../chunks/chevron-left.js";
import { t as Chevron_right } from "../../../../chunks/chevron-right.js";
import { t as Map_pin } from "../../../../chunks/map-pin.js";
import { t as Phone } from "../../../../chunks/phone.js";
import { n as Play, t as Power } from "../../../../chunks/power.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { t as Search } from "../../../../chunks/search.js";
import { n as Trash_2, t as ConfirmDialog } from "../../../../chunks/ConfirmDialog.js";
import { t as Users } from "../../../../chunks/users.js";
import { t as X } from "../../../../chunks/x.js";
import { t as page } from "../../../../chunks/stores.js";
import { t as Sheet } from "../../../../chunks/Sheet.js";
import { t as apiFetch } from "../../../../chunks/api.js";
import "../../../../chunks/StatusVisitaBadge.js";
import { t as Button } from "../../../../chunks/Button.js";
import { t as EmptyState } from "../../../../chunks/EmptyState.js";
//#region ../../node_modules/.pnpm/lucide-svelte@0.469.0_svelte@5.55.1/node_modules/lucide-svelte/dist/icons/eye.svelte
function Eye($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "eye" },
		sanitize_props($$props),
		{
			/**
			* @component @name Eye
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", {
				"cx": "12",
				"cy": "12",
				"r": "3"
			}]],
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
//#region src/routes/dashboard/profissionais/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { data } = $$props;
		let profissionais = [];
		let pagination = {
			page: 1,
			pageSize: 20,
			total: 0,
			totalPages: 0
		};
		let loading = true;
		let error = null;
		let filtroBusca = "";
		let filtroPotencial = "";
		let filtroEstagio = "";
		let filtroClassificacao = "";
		let sheetOpen = false;
		let profissionalEmEdicao = null;
		let especialidades = [];
		let subEspecialidades = [];
		let deleteConfirmOpen = false;
		let profToDelete = null;
		let formNome = "";
		let formNomeError = false;
		let formCrm = "";
		let formEmail = "";
		let formTelefone = "";
		let formPotencial = "";
		let formEstagio = "PROSPECTADO";
		let formEspecialidadeId = "";
		let formSubEspecialidadeId = "";
		let formClassificacao = "";
		let formCep = "";
		let formLogradouro = "";
		let formNumero = "";
		let formComplemento = "";
		let formBairro = "";
		let formCidade = "";
		let formEstado = "";
		let formContatos = [];
		let formCpfCnpj = "";
		let formSexo = "NAO_INFORMADO";
		let formDataNascimento = "";
		let formTratamento = "";
		let formObservacoes = "";
		let formNomeConjuge = "";
		let formDataNascConjuge = "";
		const potencialConfig = {
			ALTO: {
				label: "Alto",
				class: "bg-emerald-50 text-emerald-700"
			},
			MEDIO: {
				label: "Médio",
				class: "bg-amber-50 text-amber-700"
			},
			BAIXO: {
				label: "Baixo",
				class: "bg-red-50 text-red-600"
			},
			ESTRATEGICO: {
				label: "Estratégico",
				class: "bg-violet-50 text-violet-700"
			}
		};
		const estagioConfig = {
			PROSPECTADO: {
				label: "Prospectado",
				class: "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]"
			},
			VISITADO: {
				label: "Visitado",
				class: "bg-blue-50 text-blue-700"
			},
			INTERESSADO: {
				label: "Interessado",
				class: "bg-purple-50 text-purple-700"
			},
			PRESCRITOR: {
				label: "Prescritor",
				class: "bg-emerald-50 text-emerald-700"
			},
			FIDELIZADO: {
				label: "Fidelizado",
				class: "bg-amber-50 text-amber-700"
			}
		};
		const estagios = [
			"PROSPECTADO",
			"VISITADO",
			"INTERESSADO",
			"PRESCRITOR",
			"FIDELIZADO"
		];
		let especialidadesAgrupadas = derived(() => especialidades.reduce((acc, esp) => {
			const cat = esp.categoria;
			if (!acc[cat]) acc[cat] = [];
			acc[cat].push(esp);
			return acc;
		}, {}));
		let categoriasOrdenadas = derived(() => Object.keys(especialidadesAgrupadas()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())));
		let isFetchingData = false;
		async function fetchProfissionais(page = 1) {
			if (isFetchingData) return;
			isFetchingData = true;
			loading = true;
			error = null;
			try {
				const response = await apiFetch(`/profissionais?${new URLSearchParams({
					page: page.toString(),
					pageSize: pagination.pageSize.toString()
				})}`, data.sessionToken);
				if (!response.ok) throw new Error("Erro ao carregar profissionais");
				const json = await response.json();
				profissionais = json.data ?? json;
				if (json.pagination) pagination = json.pagination;
			} catch (err) {
				error = err instanceof Error ? err.message : "Erro desconhecido";
			} finally {
				loading = false;
				isFetchingData = false;
			}
		}
		derived(() => store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("editId"));
		function handleNovoProfissional() {
			profissionalEmEdicao = null;
			formNome = "";
			formCrm = "";
			formEmail = "";
			formTelefone = "";
			formPotencial = "";
			formEstagio = "PROSPECTADO";
			formEspecialidadeId = "";
			formSubEspecialidadeId = "";
			formClassificacao = "";
			formCep = "";
			formLogradouro = "";
			formNumero = "";
			formComplemento = "";
			formBairro = "";
			formCidade = "";
			formEstado = "";
			formContatos = [];
			formCpfCnpj = "";
			formSexo = "NAO_INFORMADO";
			formDataNascimento = "";
			formTratamento = "";
			formObservacoes = "";
			formNomeConjuge = "";
			formDataNascConjuge = "";
			sheetOpen = true;
		}
		async function handleSalvarProfissional() {
			formNomeError = false;
			if (!formNome.trim()) {
				formNomeError = true;
				toasts.show("error", "O nome do profissional é obrigatório.");
				document.getElementById("prof-nome")?.focus();
				return;
			}
			const endObj = {
				cep: formCep.trim() || void 0,
				logradouro: formLogradouro.trim() || void 0,
				numero: formNumero.trim() || void 0,
				complemento: formComplemento.trim() || void 0,
				bairro: formBairro.trim() || void 0,
				cidade: formCidade.trim() || void 0,
				estado: formEstado.trim() || void 0
			};
			const temEndereco = Object.values(endObj).some((v) => v !== void 0);
			const contatosLimpos = formContatos.filter((c) => c.valor.trim()).map((c) => ({
				tipo: c.tipo,
				valor: c.valor.trim(),
				observacao: c.observacao.trim() || void 0
			}));
			const apiData = {
				nome: formNome.trim(),
				crm: formCrm.trim() || void 0,
				email: formEmail.trim() || void 0,
				telefone: formTelefone.trim() || void 0,
				potencial: formPotencial || void 0,
				estagioPipeline: formEstagio,
				especialidadeId: formEspecialidadeId || void 0,
				subEspecialidadeId: formSubEspecialidadeId || void 0,
				classificacao: formClassificacao || void 0,
				cpfCnpj: formCpfCnpj.trim() || void 0,
				sexo: formSexo || void 0,
				dataNascimento: formDataNascimento ? new Date(formDataNascimento).toISOString() : void 0,
				tratamento: formTratamento || void 0,
				observacoes: formObservacoes.trim() || void 0,
				nomeConjuge: formNomeConjuge.trim() || void 0,
				dataNascConjuge: formDataNascConjuge ? new Date(formDataNascConjuge).toISOString() : void 0,
				endereco: temEndereco ? endObj : void 0,
				contatos: contatosLimpos.length > 0 ? contatosLimpos : void 0
			};
			Object.keys(apiData).forEach((key) => {
				if (apiData[key] === void 0) delete apiData[key];
			});
			if (!formSubEspecialidadeId) apiData.subEspecialidadeId = null;
			if (!formEspecialidadeId) apiData.especialidadeId = null;
			if (!formClassificacao) apiData.classificacao = null;
			const url = profissionalEmEdicao?.id ? `/profissionais/${profissionalEmEdicao.id}` : "/profissionais";
			const method = profissionalEmEdicao?.id ? "PUT" : "POST";
			try {
				const response = await apiFetch(url, data.sessionToken, {
					method,
					body: JSON.stringify(apiData)
				});
				if (!response.ok) {
					const errBody = await response.json().catch(() => null);
					const msg = errBody?.error || errBody?.message || `Erro ${response.status}`;
					throw new Error(msg);
				}
				const updated = await response.json();
				if (profissionalEmEdicao?.id) profissionais = profissionais.map((p) => p.id === updated.id ? updated : p);
				else fetchProfissionais(pagination.page);
				sheetOpen = false;
				toasts.show("success", profissionalEmEdicao?.id ? "Profissional atualizado!" : "Profissional criado!");
			} catch (err) {
				toasts.show("error", err instanceof Error ? err.message : "Erro ao salvar");
			}
		}
		async function confirmDeleteProfissional() {
			if (!profToDelete) return;
			const response = await apiFetch(`/profissionais/${profToDelete.id}`, data.sessionToken, { method: "DELETE" });
			if (!response.ok) {
				const d = await response.json();
				toasts.show("error", d.error || "Erro ao excluir");
				deleteConfirmOpen = false;
				return;
			}
			profissionais = profissionais.filter((p) => p.id !== profToDelete.id);
			pagination.total = pagination.total - 1;
			toasts.show("success", `"${profToDelete.nome}" excluído.`);
			deleteConfirmOpen = false;
			profToDelete = null;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("5tv8ml", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Profissionais — MediVisitas</title>`);
				});
			});
			$$renderer.push(`<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">`);
			Users($$renderer, { class: "h-4.5 w-4.5 text-white" });
			$$renderer.push(`<!----></div> <div><h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Profissionais</h1> <p class="text-[11px] text-[rgb(var(--slate-400))]">Gerencie o cadastro e a classificação dos médicos</p></div></div> <div class="flex items-center gap-2">`);
			Button($$renderer, {
				onclick: handleNovoProfissional,
				class: "inline-flex gap-2",
				children: ($$renderer) => {
					Plus($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> <span class="hidden sm:inline">Novo Profissional</span> <span class="sm:hidden">Novo</span>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> <div class="card-surface p-4 mb-6" role="search" aria-label="Filtros de profissionais"><div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"><div class="relative">`);
			Search($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate-400))] pointer-events-none" });
			$$renderer.push(`<!----> <input type="text" placeholder="Buscar por nome ou CRM..."${attr("value", filtroBusca)} aria-label="Buscar profissionais" class="input-base !pl-9"/></div> `);
			$$renderer.select({
				value: filtroPotencial,
				onchange: () => fetchProfissionais(1),
				"aria-label": "Filtrar por potencial",
				class: "input-base"
			}, ($$renderer) => {
				$$renderer.option({ value: "" }, ($$renderer) => {
					$$renderer.push(`Todos os potenciais`);
				});
				$$renderer.option({ value: "ALTO" }, ($$renderer) => {
					$$renderer.push(`Alto`);
				});
				$$renderer.option({ value: "MEDIO" }, ($$renderer) => {
					$$renderer.push(`Médio`);
				});
				$$renderer.option({ value: "BAIXO" }, ($$renderer) => {
					$$renderer.push(`Baixo`);
				});
				$$renderer.option({ value: "ESTRATEGICO" }, ($$renderer) => {
					$$renderer.push(`Estratégico`);
				});
			});
			$$renderer.push(` `);
			$$renderer.select({
				value: filtroEstagio,
				onchange: () => fetchProfissionais(1),
				"aria-label": "Filtrar por estágio",
				class: "input-base"
			}, ($$renderer) => {
				$$renderer.option({ value: "" }, ($$renderer) => {
					$$renderer.push(`Todos os estágios`);
				});
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(estagios);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let est = each_array[$$index];
					$$renderer.option({ value: est }, ($$renderer) => {
						$$renderer.push(`${escape_html(estagioConfig[est].label)}`);
					});
				}
				$$renderer.push(`<!--]-->`);
			});
			$$renderer.push(` `);
			$$renderer.select({
				value: filtroClassificacao,
				onchange: () => fetchProfissionais(1),
				"aria-label": "Filtrar por classificação",
				class: "input-base"
			}, ($$renderer) => {
				$$renderer.option({ value: "" }, ($$renderer) => {
					$$renderer.push(`Todas as classificações`);
				});
				$$renderer.option({ value: "FORTE" }, ($$renderer) => {
					$$renderer.push(`Forte`);
				});
				$$renderer.option({ value: "INTERMEDIARIO" }, ($$renderer) => {
					$$renderer.push(`Intermediário`);
				});
				$$renderer.option({ value: "FRACO" }, ($$renderer) => {
					$$renderer.push(`Fraco`);
				});
			});
			$$renderer.push(`</div></div> `);
			if (loading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="card-surface flex items-center justify-center py-20" role="status" aria-live="polite"><div class="flex flex-col items-center gap-3"><div class="h-8 w-8 animate-spin rounded-full border-2 border-[rgb(var(--slate-200))] border-t-blue-600" aria-hidden="true"></div> <span class="text-sm text-[rgb(var(--slate-400))]">Carregando profissionais...</span></div></div>`);
			} else if (error) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="card-surface flex flex-col items-center justify-center py-20 gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">`);
				Users($$renderer, { class: "h-6 w-6 text-red-400" });
				$$renderer.push(`<!----></div> <div class="text-center"><p class="text-sm font-medium text-[rgb(var(--slate-700))]">Erro ao carregar</p> <p class="text-xs text-[rgb(var(--slate-400))] mt-1">${escape_html(error)}</p></div> `);
				Button($$renderer, {
					variant: "outline",
					size: "sm",
					onclick: () => fetchProfissionais(1),
					children: ($$renderer) => {
						$$renderer.push(`<!---->Tentar novamente`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else if (profissionais.length === 0) {
				$$renderer.push("<!--[2-->");
				EmptyState($$renderer, {
					icon: Users,
					titulo: "Nenhum profissional encontrado",
					descricao: "Use os filtros acima ou adicione um novo",
					acaoLabel: "Adicionar Profissional",
					acaoOnclick: handleNovoProfissional
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="card-surface overflow-hidden"><table class="table-fixed w-full" aria-label="Lista de profissionais"><thead><tr class="border-b border-[rgb(var(--slate-100))]"><th class="p-3.5 text-left text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[24%]">Nome</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[18%]">Especialidade</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[16%]">Subespecialidade</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[12%]">Potencial</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[12%]">Estágio</th><th class="p-3.5 text-center text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[18%]">Ações</th></tr></thead><tbody><!--[-->`);
				const each_array_1 = ensure_array_like(profissionais);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let prof = each_array_1[$$index_1];
					const isAtivo = !prof.deletedAt;
					$$renderer.push(`<tr${attr_class("group border-t border-[rgb(var(--slate-50))] transition-all duration-200 cursor-pointer hover:bg-[rgb(var(--slate-50))]/60", void 0, { "opacity-50": !isAtivo })}><td class="p-3.5"><div class="flex items-center gap-3"><div${attr_class("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm", void 0, {
						"bg-blue-600": isAtivo,
						"from-blue-500": isAtivo,
						"to-indigo-600": isAtivo,
						"text-white": isAtivo,
						"bg-[rgb(var(--slate-200))]": !isAtivo,
						"text-[rgb(var(--slate-400))]": !isAtivo
					})}>${escape_html(prof.nome.charAt(0).toUpperCase())}</div> <div class="min-w-0"><p${attr_class("text-sm font-medium truncate", void 0, {
						"text-[rgb(var(--slate-900))]": isAtivo,
						"text-[rgb(var(--slate-400))]": !isAtivo
					})}>${escape_html(prof.nome)}</p> <p${attr_class("text-xs truncate", void 0, {
						"text-[rgb(var(--slate-400))]": isAtivo,
						"text-[rgb(var(--slate-300))]": !isAtivo
					})}>${escape_html(prof.crm || "Sem CRM")}</p></div></div></td><td class="p-3.5 text-center"><span class="text-sm text-[rgb(var(--slate-700))] truncate block font-medium">${escape_html(prof.especialidade?.nome || "—")}</span></td><td class="p-3.5 text-center"><span class="text-sm text-[rgb(var(--slate-500))] truncate block">${escape_html(prof.subEspecialidade?.nome || "-")}</span></td><td class="p-3.5 text-center"><span${attr_class(`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${stringify(potencialConfig[prof.potencial]?.class ?? "bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]")}`)}>${escape_html(potencialConfig[prof.potencial]?.label ?? prof.potencial)}</span></td><td class="p-3.5 text-center"><span${attr_class(`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${stringify(estagioConfig[prof.estagioPipeline].class)}`)}>${escape_html(estagioConfig[prof.estagioPipeline].label)}</span></td><td class="p-3.5"><div class="flex justify-center items-center gap-0.5"><button${attr("aria-label", `Ver detalhes de ${stringify(prof.nome)}`)} title="Ver detalhes" class="p-2 rounded-lg text-[rgb(var(--slate-400))] hover:text-blue-600 hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer">`);
					Eye($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----></button> <a${attr("href", `/dashboard/profissionais/${prof.id}`)}${attr("aria-label", `Agenda e visitas de ${stringify(prof.nome)}`)} title="Agenda / Visitas" class="p-2 rounded-lg text-[rgb(var(--slate-400))] hover:text-emerald-600 hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer">`);
					Calendar($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----></a> <button${attr("disabled", prof.estagioPipeline === "PROSPECTADO" || !isAtivo, true)}${attr("aria-label", `Retroceder estágio de ${stringify(prof.nome)}`)} title="Retroceder estágio" class="p-2 rounded-lg text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">`);
					Arrow_left($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----></button> <button${attr("disabled", prof.estagioPipeline === "FIDELIZADO" || !isAtivo, true)}${attr("aria-label", `Avançar estágio de ${stringify(prof.nome)}`)} title="Avançar estágio" class="p-2 rounded-lg text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">`);
					Arrow_right($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----></button> <button${attr("aria-label", isAtivo ? `Inativar ${prof.nome}` : `Ativar ${prof.nome}`)}${attr("title", isAtivo ? "Inativar" : "Ativar")}${attr_class(`p-2 rounded-lg text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer ${stringify(isAtivo ? "hover:text-amber-600" : "hover:text-green-600")}`)}>`);
					if (isAtivo) {
						$$renderer.push("<!--[0-->");
						Power($$renderer, { class: "w-3.5 h-3.5" });
					} else {
						$$renderer.push("<!--[-1-->");
						Play($$renderer, { class: "w-3.5 h-3.5" });
					}
					$$renderer.push(`<!--]--></button> <button${attr("aria-label", `Excluir ${stringify(prof.nome)}`)} title="Excluir" class="p-2 rounded-lg text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer">`);
					Trash_2($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----></button></div></td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div> `);
				if (pagination.totalPages > 1) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<nav aria-label="Paginação de profissionais" class="mt-4 flex items-center justify-between"><p class="text-xs text-[rgb(var(--slate-400))]" aria-live="polite">Página ${escape_html(pagination.page)} de ${escape_html(pagination.totalPages)} · ${escape_html(pagination.total)} total</p> <div class="flex gap-1.5">`);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						onclick: () => fetchProfissionais(pagination.page - 1),
						disabled: pagination.page <= 1,
						"aria-label": "Página anterior",
						children: ($$renderer) => {
							Chevron_left($$renderer, { class: "h-4 w-4" });
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						onclick: () => fetchProfissionais(pagination.page + 1),
						disabled: pagination.page >= pagination.totalPages,
						"aria-label": "Próxima página",
						children: ($$renderer) => {
							Chevron_right($$renderer, { class: "h-4 w-4" });
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div></nav>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--> `);
			{
				function children($$renderer) {
					$$renderer.push(`<div class="space-y-5"><div><h3 class="text-lg font-semibold text-[rgb(var(--slate-900))]">${escape_html(profissionalEmEdicao ? "Editar Profissional" : "Novo Profissional")}</h3> <p class="text-sm text-[rgb(var(--slate-400))] mt-1">${escape_html(profissionalEmEdicao ? "Atualize os dados abaixo" : "Preencha os dados para cadastrar")}</p></div> <section><h4 class="section-header">`);
					Users($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> Dados Básicos</h4> <div class="space-y-3"><div class="grid gap-3" style="grid-template-columns: 30% 1fr"><div><label for="prof-tratamento" class="input-label">Tratamento</label> `);
					$$renderer.select({
						id: "prof-tratamento",
						value: formTratamento,
						class: "input-base"
					}, ($$renderer) => {
						$$renderer.option({ value: "" }, ($$renderer) => {
							$$renderer.push(`Nenhum`);
						});
						$$renderer.option({ value: "DR" }, ($$renderer) => {
							$$renderer.push(`Dr.`);
						});
						$$renderer.option({ value: "DRA" }, ($$renderer) => {
							$$renderer.push(`Dra.`);
						});
						$$renderer.option({ value: "PROF" }, ($$renderer) => {
							$$renderer.push(`Prof.`);
						});
						$$renderer.option({ value: "PROFA" }, ($$renderer) => {
							$$renderer.push(`Profa.`);
						});
						$$renderer.option({ value: "SR" }, ($$renderer) => {
							$$renderer.push(`Sr.`);
						});
						$$renderer.option({ value: "SRA" }, ($$renderer) => {
							$$renderer.push(`Sra.`);
						});
					});
					$$renderer.push(`</div> <div><label for="prof-nome" class="input-label">Nome completo *</label> <input id="prof-nome" type="text"${attr("value", formNome)}${attr_class(`input-base ${stringify(formNomeError ? "input-error" : "")}`)} placeholder="João Silva"/> `);
					if (formNomeError) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="input-error-msg">Nome é obrigatório</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div> <div><label for="prof-cpfcnpj" class="input-label">CPF/CNPJ</label> <input id="prof-cpfcnpj" type="text"${attr("value", formCpfCnpj)} class="input-base" placeholder="000.000.000-00"/></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-crm" class="input-label">CRM</label> <input id="prof-crm" type="text"${attr("value", formCrm)} class="input-base" placeholder="123456"/> <p class="text-xs text-[rgb(var(--slate-400))] mt-1">Registro profissional</p></div> <div><label for="prof-crm-uf" class="input-label">UF do CRM</label> <input id="prof-crm-uf" type="text"${attr("value", formEstado)} class="input-base" placeholder="SP"${attr("maxlength", 2)}/> <p class="text-xs text-[rgb(var(--slate-400))] mt-1">Estado do registro</p></div></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-sexo" class="input-label">Sexo</label> `);
					$$renderer.select({
						id: "prof-sexo",
						value: formSexo,
						class: "input-base"
					}, ($$renderer) => {
						$$renderer.option({ value: "NAO_INFORMADO" }, ($$renderer) => {
							$$renderer.push(`Não informado`);
						});
						$$renderer.option({ value: "MASCULINO" }, ($$renderer) => {
							$$renderer.push(`Masculino`);
						});
						$$renderer.option({ value: "FEMININO" }, ($$renderer) => {
							$$renderer.push(`Feminino`);
						});
					});
					$$renderer.push(`</div> <div><label for="prof-nascimento" class="input-label">Data de Nascimento</label> <input id="prof-nascimento" type="date"${attr("value", formDataNascimento)} class="input-base"/></div></div> <div><label for="prof-cadastro" class="input-label">Data de Cadastro</label> <input id="prof-cadastro" type="date"${attr("value", profissionalEmEdicao?.id ? profissionais.find((p) => p.id === profissionalEmEdicao?.id)?.createdAt?.split("T")[0] ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0])} disabled="" class="input-base opacity-60 cursor-not-allowed"/> <p class="text-xs text-[rgb(var(--slate-400))] mt-1">Preenchido automaticamente</p></div></div></section> <section class="border-t border-[rgb(var(--slate-100))] pt-6 mt-6"><h4 class="section-header">`);
					Phone($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> Contato</h4> <div class="space-y-3"><div><label for="prof-tel" class="input-label">Telefone</label> <input id="prof-tel" type="text"${attr("value", formTelefone)} class="input-base" placeholder="(11) 99999-0000"/></div> <div><label for="prof-email" class="input-label">E-mail</label> <input id="prof-email" type="email"${attr("value", formEmail)} class="input-base" placeholder="email@exemplo.com"/></div> <div class="mt-2"><div class="flex items-center justify-between mb-2"><span class="text-xs font-medium text-[rgb(var(--slate-500))]">Contatos adicionais</span> <button type="button" class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 will-change-transform transition-all duration-200 cursor-pointer hover:-translate-y-[1px] active:scale-[0.98]">`);
					Plus($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> Adicionar</button></div> `);
					if (formContatos.length === 0) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-xs text-[rgb(var(--slate-400))] italic py-2">Nenhum contato adicional cadastrado</p>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div class="space-y-2.5"><!--[-->`);
						const each_array_2 = ensure_array_like(formContatos);
						for (let idx = 0, $$length = each_array_2.length; idx < $$length; idx++) {
							let contato = each_array_2[idx];
							$$renderer.push(`<div class="relative rounded-lg border border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))]/50 p-3 transition-all duration-200 hover:border-[rgb(var(--slate-300))]"><button type="button" title="Remover contato" class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95">`);
							X($$renderer, { class: "h-3 w-3" });
							$$renderer.push(`<!----></button> <div class="space-y-2"><div class="w-full"><label${attr("for", `contato-tipo-${stringify(idx)}`)} class="input-label text-[10px]">Tipo</label> `);
							$$renderer.select({
								id: `contato-tipo-${stringify(idx)}`,
								value: contato.tipo,
								class: "input-base text-xs w-full"
							}, ($$renderer) => {
								$$renderer.option({ value: "TELEFONE" }, ($$renderer) => {
									$$renderer.push(`Telefone`);
								});
								$$renderer.option({ value: "EMAIL" }, ($$renderer) => {
									$$renderer.push(`Email`);
								});
								$$renderer.option({ value: "WHATSAPP" }, ($$renderer) => {
									$$renderer.push(`WhatsApp`);
								});
								$$renderer.option({ value: "OUTRO" }, ($$renderer) => {
									$$renderer.push(`Outro`);
								});
							});
							$$renderer.push(`</div> <div class="w-full"><label${attr("for", `contato-valor-${stringify(idx)}`)} class="input-label text-[10px]">Valor</label> <input${attr("id", `contato-valor-${stringify(idx)}`)}${attr("type", contato.tipo === "EMAIL" ? "email" : "text")}${attr("value", contato.valor)} class="input-base text-xs w-full"${attr("placeholder", contato.tipo === "EMAIL" ? "email@exemplo.com" : contato.tipo === "WHATSAPP" ? "(11) 99999-0000" : contato.tipo === "TELEFONE" ? "(11) 99999-0000" : "Valor do contato")}/></div> <div class="w-full"><label${attr("for", `contato-obs-${stringify(idx)}`)} class="input-label text-[10px]">Observação</label> <textarea${attr("id", `contato-obs-${stringify(idx)}`)}${attr("rows", 2)} class="input-base text-xs resize-none w-full" placeholder="Secretária, horário...">`);
							const $$body = escape_html(contato.observacao);
							if ($$body) $$renderer.push(`${$$body}`);
							$$renderer.push(`</textarea></div></div></div>`);
						}
						$$renderer.push(`<!--]--></div>`);
					}
					$$renderer.push(`<!--]--></div></div></section> <section class="border-t border-[rgb(var(--slate-100))] pt-6 mt-6"><h4 class="section-header">`);
					Map_pin($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> Atuação</h4> <div class="space-y-3"><div><label for="prof-esp" class="input-label">Especialidade</label> `);
					$$renderer.select({
						id: "prof-esp",
						value: formEspecialidadeId,
						class: "input-base"
					}, ($$renderer) => {
						$$renderer.option({ value: "" }, ($$renderer) => {
							$$renderer.push(`Selecione a especialidade...`);
						});
						$$renderer.push(`<!--[-->`);
						const each_array_3 = ensure_array_like(categoriasOrdenadas());
						for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
							let cat = each_array_3[$$index_4];
							$$renderer.push(`<optgroup${attr("label", cat)}><!--[-->`);
							const each_array_4 = ensure_array_like(especialidadesAgrupadas()[cat]);
							for (let $$index_3 = 0, $$length = each_array_4.length; $$index_3 < $$length; $$index_3++) {
								let esp = each_array_4[$$index_3];
								$$renderer.option({ value: esp.id }, ($$renderer) => {
									$$renderer.push(`${escape_html(esp.nome)}`);
								});
							}
							$$renderer.push(`<!--]--></optgroup>`);
						}
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(`</div> `);
					if (formEspecialidadeId && subEspecialidades.length > 0) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div><label for="prof-sub" class="input-label">Subespecialidade</label> `);
						$$renderer.select({
							id: "prof-sub",
							value: formSubEspecialidadeId,
							class: "input-base"
						}, ($$renderer) => {
							$$renderer.option({ value: "" }, ($$renderer) => {
								$$renderer.push(`Nenhuma`);
							});
							$$renderer.push(`<!--[-->`);
							const each_array_5 = ensure_array_like(subEspecialidades);
							for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
								let sub = each_array_5[$$index_5];
								$$renderer.option({ value: sub.id }, ($$renderer) => {
									$$renderer.push(`${escape_html(sub.nome)}`);
								});
							}
							$$renderer.push(`<!--]-->`);
						});
						$$renderer.push(`</div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div><label for="prof-cep" class="input-label">CEP</label> <div class="relative max-w-xs"><input id="prof-cep" type="text"${attr("value", formCep)} class="input-base !pr-8" placeholder="01001-000"${attr("maxlength", 9)}/> `);
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <p class="text-xs text-[rgb(var(--slate-400))] mt-1">Preenche endereço, bairro, cidade e UF</p></div> <div><label for="prof-logradouro" class="input-label">Endereço</label> <textarea id="prof-logradouro"${attr("rows", 2)} class="input-base resize-none leading-relaxed" placeholder="Rua, Av., Alameda...">`);
					const $$body_1 = escape_html(formLogradouro);
					if ($$body_1) $$renderer.push(`${$$body_1}`);
					$$renderer.push(`</textarea></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-numero" class="input-label">Número</label> <input id="prof-numero" type="text"${attr("value", formNumero)} class="input-base" placeholder="123"/></div> <div><label for="prof-complemento" class="input-label">Complemento</label> <input id="prof-complemento" type="text"${attr("value", formComplemento)} class="input-base" placeholder="Sala 10, Bloco B"/></div></div> <div><label for="prof-bairro" class="input-label">Bairro</label> <input id="prof-bairro" type="text"${attr("value", formBairro)} class="input-base" placeholder="Centro"/></div> <div class="grid grid-cols-4 gap-3"><div class="col-span-3"><label for="prof-cidade" class="input-label">Cidade</label> <input id="prof-cidade" type="text"${attr("value", formCidade)} class="input-base" placeholder="São Paulo"/></div> <div class="col-span-1"><label for="prof-estado" class="input-label">UF</label> <input id="prof-estado" type="text"${attr("value", formEstado)} class="input-base text-center" placeholder="SP"${attr("maxlength", 2)}/></div></div></div></section> <section class="border-t border-[rgb(var(--slate-100))] pt-6 mt-6"><h4 class="section-header"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Classificação</h4> <div class="space-y-5"><div><span class="input-label">Potencial de prescrição</span> <div class="segmented-control" role="group" aria-label="Potencial de prescrição"><!--[-->`);
					const each_array_6 = ensure_array_like([
						{
							value: "ALTO",
							label: "Alto",
							active: "seg-active-emerald"
						},
						{
							value: "MEDIO",
							label: "Médio",
							active: "seg-active-amber"
						},
						{
							value: "BAIXO",
							label: "Baixo",
							active: "seg-active-orange"
						},
						{
							value: "ESTRATEGICO",
							label: "Estratégico",
							active: "seg-active-indigo"
						}
					]);
					for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
						let opt = each_array_6[$$index_6];
						$$renderer.push(`<button type="button"${attr_class(`segmented-btn ${stringify(formPotencial === opt.value ? opt.active : "")}`)}>${escape_html(opt.label)}</button>`);
					}
					$$renderer.push(`<!--]--></div> <p class="text-xs text-[rgb(var(--slate-400))] mt-1.5">Volume estimado de prescrições</p></div> <div class="mt-5"><span class="input-label">Estágio no pipeline</span> <div class="segmented-control" role="group" aria-label="Estágio no pipeline"><!--[-->`);
					const each_array_7 = ensure_array_like([
						{
							value: "PROSPECTADO",
							label: "Prospectado",
							active: "seg-active-blue"
						},
						{
							value: "VISITADO",
							label: "Visitado",
							active: "seg-active-sky"
						},
						{
							value: "INTERESSADO",
							label: "Interessado",
							active: "seg-active-amber"
						},
						{
							value: "PRESCRITOR",
							label: "Prescritor",
							active: "seg-active-emerald"
						},
						{
							value: "FIDELIZADO",
							label: "Fidelizado",
							active: "seg-active-indigo"
						}
					]);
					for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
						let opt = each_array_7[$$index_7];
						$$renderer.push(`<button type="button"${attr_class(`segmented-btn ${stringify(formEstagio === opt.value ? opt.active : "")}`)}>${escape_html(opt.label)}</button>`);
					}
					$$renderer.push(`<!--]--></div> <p class="text-xs text-[rgb(var(--slate-400))] mt-1.5">Acompanhamento do relacionamento</p></div> <div class="mt-5"><span class="input-label">Classificação do relacionamento</span> <div class="rounded-lg border border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))] p-1"><div class="grid grid-cols-3 gap-1" role="group" aria-label="Classificação do relacionamento"><button type="button"${attr_class(`segmented-btn col-span-1 ${stringify(formClassificacao === "FORTE" ? "seg-active-emerald" : "")}`)}>Forte</button> <button type="button"${attr_class(`segmented-btn col-span-1 ${stringify(formClassificacao === "INTERMEDIARIO" ? "seg-active-amber" : "")}`)}>Intermediário</button> <button type="button"${attr_class(`segmented-btn col-span-1 ${stringify(formClassificacao === "FRACO" ? "seg-active-rose" : "")}`)}>Fraco</button> <button type="button"${attr_class(`segmented-btn col-span-3 ${stringify(formClassificacao === "" ? "seg-active-slate" : "")}`)}>Não definida</button></div></div></div></div></section> <section class="border-t border-[rgb(var(--slate-100))] pt-6 mt-6"><h4 class="section-header"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> Informações Complementares</h4> <div class="space-y-3"><div><label for="prof-observacoes" class="input-label">Observações</label> <textarea id="prof-observacoes"${attr("rows", 3)} class="input-base resize-none" placeholder="Anotações gerais...">`);
					const $$body_2 = escape_html(formObservacoes);
					if ($$body_2) $$renderer.push(`${$$body_2}`);
					$$renderer.push(`</textarea></div> <div class="grid grid-cols-2 gap-3"><div><label for="prof-conjuge" class="input-label">Nome do Cônjuge</label> <input id="prof-conjuge" type="text"${attr("value", formNomeConjuge)} class="input-base" placeholder="Nome do cônjuge"/></div> <div><label for="prof-nasc-conjuge" class="input-label">Data Nasc. Cônjuge</label> <input id="prof-nasc-conjuge" type="date"${attr("value", formDataNascConjuge)} class="input-base"/></div></div></div></section> <div class="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--slate-100))]">`);
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
						onclick: handleSalvarProfissional,
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(profissionalEmEdicao ? "Salvar Alterações" : "Cadastrar Profissional")}`);
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
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				class: "fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden",
				onclick: handleNovoProfissional,
				children: ($$renderer) => {
					Plus($$renderer, { class: "h-6 w-6 text-white" });
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			{
				function description($$renderer) {
					if (profToDelete) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p>Você está prestes a excluir <strong>"${escape_html(profToDelete.nome)}"</strong>.</p> <p>Esta ação não pode ser desfeita.</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				ConfirmDialog($$renderer, {
					open: deleteConfirmOpen,
					onclose: () => {
						deleteConfirmOpen = false;
						profToDelete = null;
					},
					title: "Excluir profissional",
					onconfirm: confirmDeleteProfissional,
					variant: "danger",
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
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };
