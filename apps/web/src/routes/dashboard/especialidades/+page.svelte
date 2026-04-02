<script lang="ts">
	import { Plus, Trash2, ChevronDown, ChevronRight, Stethoscope, Search, Power, Play } from 'lucide-svelte';
	import { apiFetch } from '$lib/api';
	import { toasts } from '$lib/stores/toast';
	import Button from '$lib/components/ui/Button.svelte';
	import Sheet from '$lib/components/ui/Sheet.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import type {
		Especialidade,
		EspecialidadeFormData,
		SubEspecialidade,
		SubEspecialidadeFormData
	} from '$lib/types';

	interface Props {
		data: { sessionToken: string | null };
	}

	let { data }: Props = $props();

	// ── Estado ──
	let especialidades = $state<Especialidade[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let sheetOpen = $state(false);
	let especialidadeEmEdicao = $state<EspecialidadeFormData | null>(null);

	// Expansão de subespecialidades
	let expandedIds = $state<Set<string>>(new Set());

	// Form fields
	let formNome = $state('');
	let formCategoria = $state('');

	// Delete dialogs
	let deleteConfirmOpen = $state(false);
	let deleteErrorMessage = $state<string | null>(null);
	let isBlockingDialog = $state(false);
	let itemToDelete = $state<Especialidade | null>(null);
	let categoryDeleteConfirmOpen = $state(false);
	let categoryToDelete = $state<string | null>(null);

	// Sub delete
	let subToDelete = $state<{ sub: SubEspecialidade; espNome: string } | null>(null);
	let subDeleteConfirmOpen = $state(false);

	// Sub create
	let addingSubToEspId = $state<string | null>(null);
	let formNomeSub = $state('');
	let savingNewSub = $state(false);

	// ── Helpers ──
	function formatarCategoria(cat: string): string {
		if (!cat) return '';
		const lower = cat.toLowerCase();
		return lower.charAt(0).toUpperCase() + lower.slice(1);
	}

	function toggleExpand(id: string) {
		const next = new Set(expandedIds);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		expandedIds = next;
	}

	// ── Fetch ──
	async function fetchEspecialidades() {
		loading = true;
		error = null;

		try {
			const response = await apiFetch('/especialidades?incluirInativos=true', data.sessionToken);
			if (!response.ok) throw new Error(`Erro ${response.status}`);
			const json = await response.json();

			const withSubs = await Promise.all(
				(json.data as Especialidade[]).map(async (esp) => {
					try {
						const subRes = await apiFetch(
							`/especialidades/${esp.id}/subespecialidades?incluirInativas=true`,
							data.sessionToken
						);
						if (subRes.ok) {
							const subData = await subRes.json();
							return { ...esp, subEspecialidades: subData.data || [] };
						}
					} catch {}
					return { ...esp, subEspecialidades: [] };
				})
			);

			especialidades = withSubs;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erro desconhecido';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		fetchEspecialidades();
	});

	// ── Agrupamento ──
	let especialidadesAgrupadas = $derived(
		especialidades.reduce(
			(acc, esp) => {
				const cat = formatarCategoria(esp.categoria);
				if (!acc[cat]) acc[cat] = [];
				acc[cat].push(esp);
				return acc;
			},
			{} as Record<string, Especialidade[]>
		)
	);

	let categoriasOrdenadas = $derived(
		Object.keys(especialidadesAgrupadas).sort((a, b) =>
			a.toLowerCase().localeCompare(b.toLowerCase())
		)
	);

	// Combobox de categorias
	let categoriaDropdownOpen = $state(false);
	let categoriasFiltradas = $derived(
		categoriasOrdenadas.filter((c) =>
			c.toLowerCase().includes(formCategoria.toLowerCase())
		)
	);

	// ── Ações ──
	function handleNovaEspecialidade() {
		especialidadeEmEdicao = null;
		formNome = '';
		formCategoria = '';
		sheetOpen = true;
	}

	function handleEditarEspecialidade(esp: Especialidade) {
		especialidadeEmEdicao = { id: esp.id, nome: esp.nome, categoria: esp.categoria };
		formNome = esp.nome;
		formCategoria = esp.categoria;
		sheetOpen = true;
	}

	async function handleSalvarEspecialidade() {
		if (!formNome.trim() || !formCategoria.trim()) {
			toasts.show('error', 'Nome e categoria são obrigatórios.');
			return;
		}

		const formData: EspecialidadeFormData = {
			id: especialidadeEmEdicao?.id,
			nome: formNome,
			categoria: formCategoria.charAt(0).toUpperCase() + formCategoria.slice(1).toLowerCase()
		};

		const url = formData.id ? `/especialidades/${formData.id}` : '/especialidades';
		const method = formData.id ? 'PUT' : 'POST';

		try {
			const response = await apiFetch(url, data.sessionToken, {
				method,
				body: JSON.stringify(formData)
			});

			if (!response.ok) throw new Error(`Erro ${response.status}`);

			sheetOpen = false;
			toasts.show('success', formData.id ? 'Especialidade atualizada!' : 'Especialidade criada!');
			fetchEspecialidades();
		} catch (err) {
			toasts.show('error', err instanceof Error ? err.message : 'Erro ao salvar');
		}
	}

	async function handleToggleAtivo(esp: Especialidade) {
		try {
			const response = await apiFetch(`/especialidades/${esp.id}/ativo`, data.sessionToken, {
				method: 'PATCH',
				body: JSON.stringify({ ativo: !esp.ativo })
			});

			if (response.ok) {
				const result = await response.json();

				especialidades = especialidades.map((e) => {
					if (e.id === esp.id) {
						const newAtivo = result.ativo;
						return {
							...e,
							ativo: newAtivo,
							subEspecialidades: (e.subEspecialidades || []).map((s) => ({
								...s,
								deletedAt: newAtivo ? null : new Date().toISOString()
							}))
						};
					}
					return e;
				});

				if (result.filhasInativadas > 0) {
					toasts.show('info', `"${esp.nome}" inativada. ${result.filhasInativadas} sub(s) também.`);
				} else if (result.filhasReativadas > 0) {
					toasts.show('info', `"${esp.nome}" reativada. ${result.filhasReativadas} sub(s) também.`);
				} else {
					toasts.show('success', result.ativo ? `"${esp.nome}" reativada.` : `"${esp.nome}" inativada.`);
				}
			}
		} catch (err) {
			toasts.show('error', 'Erro ao alterar status');
		}
	}

	async function handleToggleSub(sub: SubEspecialidade, espId: string) {
		const isAtivo = !sub.deletedAt;
		try {
			const response = await apiFetch(`/subespecialidades/${sub.id}/ativo`, data.sessionToken, {
				method: 'PATCH',
				body: JSON.stringify({ ativo: !isAtivo })
			});

			if (response.ok) {
				especialidades = especialidades.map((e) => {
					if (e.id !== espId) return e;
					return {
						...e,
						subEspecialidades: (e.subEspecialidades || []).map((s) =>
							s.id === sub.id
								? { ...s, deletedAt: isAtivo ? new Date().toISOString() : null }
								: s
						)
					};
				});
				toasts.show(
					'success',
					isAtivo ? `"${sub.nome}" inativada.` : `"${sub.nome}" reativada.`
				);
			}
		} catch {
			toasts.show('error', 'Erro ao alterar status');
		}
	}

	async function handleExcluirEspecialidade(esp: Especialidade) {
		try {
			const checkRes = await apiFetch(
				`/especialidades/${esp.id}/profissionais-ativos`,
				data.sessionToken
			);
			if (checkRes.ok) {
				const checkData = await checkRes.json();
				if (checkData.temProfissionaisAtivos) {
					deleteErrorMessage =
						checkData.count === 1
							? `Existe ${checkData.count} profissional ativo vinculado. Inative-o primeiro.`
							: `Existem ${checkData.count} profissionais ativos vinculados. Inative-os primeiro.`;
					itemToDelete = esp;
					isBlockingDialog = true;
					deleteConfirmOpen = true;
					return;
				}
			}
		} catch {}

		itemToDelete = esp;
		deleteErrorMessage = null;
		isBlockingDialog = false;
		deleteConfirmOpen = true;
	}

	async function confirmDeleteEspecialidade() {
		if (!itemToDelete) return;

		const response = await apiFetch(`/especialidades/${itemToDelete.id}`, data.sessionToken, {
			method: 'DELETE'
		});

		if (!response.ok) {
			const d = await response.json();
			toasts.show('error', d.error || 'Erro ao excluir');
			deleteConfirmOpen = false;
			return;
		}

		especialidades = especialidades.filter((e) => e.id !== itemToDelete!.id);
		toasts.show('success', `"${itemToDelete.nome}" excluída.`);
		deleteConfirmOpen = false;
		itemToDelete = null;
	}

	async function confirmDeleteCategoria() {
		if (!categoryToDelete) return;

		const response = await apiFetch(
			`/especialidades/categorias/${encodeURIComponent(categoryToDelete)}`,
			data.sessionToken,
			{ method: 'DELETE' }
		);

		if (!response.ok) {
			const d = await response.json();
			toasts.show('error', d.error || 'Erro ao excluir categoria');
			categoryDeleteConfirmOpen = false;
			return;
		}

		const result = await response.json();
		especialidades = especialidades.filter((e) => e.categoria !== categoryToDelete);
		toasts.show('success', `Categoria "${categoryToDelete}" excluída (${result.excluidas} itens).`);
		categoryDeleteConfirmOpen = false;
		categoryToDelete = null;
	}

	// ── Subespecialidade delete ──
	function handleExcluirSub(sub: SubEspecialidade, espNome: string) {
		subToDelete = { sub, espNome };
		subDeleteConfirmOpen = true;
	}

	async function confirmDeleteSub() {
		if (!subToDelete) return;
		const { sub } = subToDelete;
		try {
			const response = await apiFetch(`/subespecialidades/${sub.id}`, data.sessionToken, {
				method: 'DELETE'
			});

			if (response.ok) {
				especialidades = especialidades.map((e) => ({
					...e,
					subEspecialidades: (e.subEspecialidades || []).filter((s) => s.id !== sub.id)
				}));
				toasts.show('success', `"${sub.nome}" excluída.`);
			} else if (response.status === 409) {
				toasts.show(
					'error',
					'Subespecialidade possui profissionais vinculados. Desvincule-os primeiro.'
				);
			} else {
				toasts.show('error', 'Erro ao excluir subespecialidade.');
			}
		} catch {
			toasts.show('error', 'Erro ao excluir subespecialidade.');
		} finally {
			subDeleteConfirmOpen = false;
			subToDelete = null;
		}
	}

	// ── Subespecialidade create ──
	function handleStartAddSub(espId: string) {
		addingSubToEspId = espId;
		formNomeSub = '';
		// Garantir que o painel está expandido
		if (!expandedIds.has(espId)) {
			const next = new Set(expandedIds);
			next.add(espId);
			expandedIds = next;
		}
	}

	function handleCancelAddSub() {
		addingSubToEspId = null;
		formNomeSub = '';
	}

	async function handleSalvarSub(espId: string) {
		if (!formNomeSub.trim()) {
			toasts.show('error', 'Nome da subespecialidade é obrigatório.');
			return;
		}

		savingNewSub = true;
		try {
			const response = await apiFetch('/subespecialidades', data.sessionToken, {
				method: 'POST',
				body: JSON.stringify({ nome: formNomeSub.trim(), especialidadeId: espId })
			});

			if (response.status === 409) {
				toasts.show('error', 'Já existe uma subespecialidade com este nome.');
				return;
			}

			if (!response.ok) throw new Error(`Erro ${response.status}`);

			const result = await response.json();
			const novaSub = result.data;

			especialidades = especialidades.map((e) =>
				e.id === espId
					? {
							...e,
							subEspecialidades: [
								...(e.subEspecialidades || []),
								{ id: novaSub.id, nome: novaSub.nome, especialidadeId: espId, deletedAt: null }
							]
						}
					: e
			);

			toasts.show('success', 'Subespecialidade criada com sucesso.');
			addingSubToEspId = null;
			formNomeSub = '';
		} catch (err) {
			toasts.show('error', err instanceof Error ? err.message : 'Erro ao criar subespecialidade.');
		} finally {
			savingNewSub = false;
		}
	}
</script>

<svelte:head>
	<title>Especialidades — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<header class="mb-6 flex items-center justify-between">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight text-slate-900">Especialidades</h2>
		<p class="text-sm text-slate-400 mt-1">
			{especialidades.length} especialidade(s) cadastrada(s)
		</p>
	</div>
	<Button onclick={handleNovaEspecialidade} class="hidden sm:inline-flex gap-2">
		<Plus class="h-4 w-4" />
		Nova Especialidade
	</Button>
</header>

<!-- Content -->
{#if loading}
	<div class="card-surface flex items-center justify-center py-20">
		<div class="flex flex-col items-center gap-3">
			<div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
			<span class="text-sm text-slate-400">Carregando especialidades...</span>
		</div>
	</div>
{:else if error}
	<div class="card-surface flex flex-col items-center justify-center py-20 gap-4">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
			<Stethoscope class="h-6 w-6 text-red-400" />
		</div>
		<div class="text-center">
			<p class="text-sm font-medium text-slate-700">Erro ao carregar</p>
			<p class="text-xs text-slate-400 mt-1">{error}</p>
		</div>
		<Button variant="outline" size="sm" onclick={() => fetchEspecialidades()}>
			Tentar novamente
		</Button>
	</div>
{:else if categoriasOrdenadas.length === 0}
	<div class="card-surface flex flex-col items-center justify-center py-20 gap-4">
		<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
			<Stethoscope class="h-7 w-7 text-slate-400" />
		</div>
		<div class="text-center">
			<p class="text-sm font-medium text-slate-700">Nenhuma especialidade cadastrada</p>
			<p class="text-xs text-slate-400 mt-1">Comece adicionando a primeira especialidade</p>
		</div>
		<Button size="sm" onclick={handleNovaEspecialidade} class="gap-2">
			<Plus class="h-4 w-4" />
			Criar Especialidade
		</Button>
	</div>
{:else}
	<div class="space-y-6">
		{#each categoriasOrdenadas as categoria}
			<div class="group">
				<!-- Category Header -->
				<div class="mb-3 flex items-center justify-between">
					<div class="flex items-center gap-2.5">
						<div class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
							<Stethoscope class="h-3.5 w-3.5 text-slate-500" />
						</div>
						<h3 class="text-sm font-semibold text-slate-700 tracking-wide">
							{formatarCategoria(categoria)}
						</h3>
						<span class="text-xs text-slate-400">({especialidadesAgrupadas[categoria].length})</span>
					</div>
					<button
						onclick={() => { categoryToDelete = categoria; categoryDeleteConfirmOpen = true; }}
						title="Excluir categoria"
						class="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer"
					>
						<Trash2 class="w-3.5 h-3.5 text-slate-400 hover:text-red-500 transition-colors" />
					</button>
				</div>

				<!-- Table -->
				<div class="card-surface overflow-hidden">
					<table class="table-fixed w-full">
						<thead>
							<tr class="border-b border-slate-100">
								<th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-12"></th>
								<th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[40%]">Nome</th>
								<th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Subs</th>
								<th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[20%]">Status</th>
								<th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[25%]">Ações</th>
							</tr>
						</thead>
						<tbody>
							{#each especialidadesAgrupadas[categoria].sort((a, b) => a.nome.localeCompare(b.nome)) as esp (esp.id)}
								{@const subCount = esp.subEspecialidades?.length ?? 0}
								{@const isExpanded = expandedIds.has(esp.id)}
								<tr
									class="group border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60"
									class:opacity-50={!esp.ativo}
									onclick={() => handleEditarEspecialidade(esp)}
								>
									<td class="p-3.5">
										{#if subCount > 0}
											<button
												onclick={(e) => { e.stopPropagation(); toggleExpand(esp.id); }}
												class="p-1 rounded-md hover:bg-slate-100 transition-all duration-200 cursor-pointer"
												title={isExpanded ? 'Recolher' : 'Expandir'}
											>
												{#if isExpanded}
													<ChevronDown class="w-4 h-4 text-slate-400" />
												{:else}
													<ChevronRight class="w-4 h-4 text-slate-400" />
												{/if}
											</button>
										{/if}
									</td>
									<td class="p-3.5">
										<span class="text-sm font-medium text-slate-800" class:text-slate-400={!esp.ativo}>{esp.nome}</span>
									</td>
									<td class="p-3.5 text-center">
										{#if subCount > 0}
											<span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-medium text-slate-600">
												{subCount}
											</span>
										{:else}
											<span class="text-xs text-slate-300">—</span>
										{/if}
									</td>
									<td class="p-3.5">
										<span
											class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
											class:bg-emerald-50={esp.ativo}
											class:text-emerald-700={esp.ativo}
											class:bg-slate-100={!esp.ativo}
											class:text-slate-400={!esp.ativo}
										>
											{esp.ativo ? 'Ativa' : 'Inativa'}
										</span>
									</td>
									<td class="p-3.5">
										<div class="flex justify-center items-center gap-0.5">
											<button
												onclick={(e) => { e.stopPropagation(); handleToggleAtivo(esp); }}
												title={esp.ativo ? 'Inativar' : 'Ativar'}
												class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer {esp.ativo ? 'hover:text-amber-600' : 'hover:text-green-600'}"
											>
												{#if esp.ativo}
													<Power class="w-4 h-4" />
												{:else}
													<Play class="w-4 h-4" />
												{/if}
											</button>
											<button
												onclick={(e) => { e.stopPropagation(); handleExcluirEspecialidade(esp); }}
												title="Excluir"
												class="p-2 rounded-lg text-slate-500 opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
											>
												<Trash2 class="w-3.5 h-3.5 transition-colors" />
											</button>
										</div>
									</td>
								</tr>
								<!-- Sub rows -->
								{#if isExpanded}
									{#each esp.subEspecialidades ?? [] as sub (sub.id)}
										<tr
											class="border-t border-slate-50 bg-slate-25 transition-all"
											class:opacity-60={!!sub.deletedAt}
											class:italic={!!sub.deletedAt}
										>
											<td class="p-3.5"></td>
											<td class="p-3.5 pl-9">
												<span class="text-sm text-slate-500">↳ {sub.nome}</span>
											</td>
											<td class="p-3.5"></td>
											<td class="p-3.5">
												{#if sub.deletedAt}
													<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-400">Inativa</span>
												{:else}
													<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700">Ativa</span>
												{/if}
											</td>
											<td class="p-3.5">
												<div class="flex justify-center items-center gap-0.5">
													<button
														onclick={(e) => {
															e.stopPropagation();
															handleToggleSub(sub, esp.id);
														}}
														title={sub.deletedAt ? 'Ativar' : 'Inativar'}
														class="p-2 rounded-lg text-slate-500 opacity-40 hover:opacity-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer {sub.deletedAt ? 'hover:text-green-600' : 'hover:text-amber-600'}"
													>
														{#if sub.deletedAt}
															<Play class="w-4 h-4" />
														{:else}
															<Power class="w-4 h-4" />
														{/if}
													</button>
													<button
														onclick={(e) => {
															e.stopPropagation();
															handleExcluirSub(sub, esp.nome);
														}}
														title="Excluir subespecialidade"
														class="p-2 rounded-lg text-slate-500 opacity-40 hover:opacity-100 hover:text-red-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
													>
														<Trash2
															class="w-3 h-3 transition-colors"
														/>
													</button>
												</div>
											</td>
										</tr>
									{/each}
									<!-- Inline Add Sub row -->
									{#if addingSubToEspId === esp.id}
										<tr class="border-t border-slate-50 bg-blue-50/30">
											<td class="p-3.5"></td>
											<td class="p-2.5 pl-9" colspan="2">
												<div class="flex items-center gap-2">
													<span class="text-sm text-slate-400">↳</span>
													<input
														type="text"
														bind:value={formNomeSub}
														class="input-base text-sm py-1.5"
														placeholder="Nome da subespecialidade"
														onclick={(e) => e.stopPropagation()}
														onkeydown={(e) => {
															if (e.key === 'Enter') { e.preventDefault(); handleSalvarSub(esp.id); }
															if (e.key === 'Escape') handleCancelAddSub();
														}}
													/>
												</div>
											</td>
											<td class="p-2.5"></td>
											<td class="p-2.5">
												<div class="flex justify-center items-center gap-1">
													<button
														onclick={(e) => { e.stopPropagation(); handleSalvarSub(esp.id); }}
														disabled={savingNewSub}
														class="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
													>
														{savingNewSub ? 'Salvando...' : 'Salvar'}
													</button>
													<button
														onclick={(e) => { e.stopPropagation(); handleCancelAddSub(); }}
														class="px-2.5 py-1 text-xs font-medium rounded-md text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
													>
														Cancelar
													</button>
												</div>
											</td>
										</tr>
									{:else}
										<tr class="border-t border-slate-50">
											<td class="p-2.5"></td>
											<td class="p-2.5 pl-9" colspan="4">
												<button
													onclick={(e) => { e.stopPropagation(); handleStartAddSub(esp.id); }}
													class="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
												>
													<Plus class="w-3.5 h-3.5" />
													Adicionar subespecialidade
												</button>
											</td>
										</tr>
									{/if}
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/each}
	</div>
{/if}


<!-- Sheet de Criação/Edição -->
<Sheet bind:open={sheetOpen} onclose={() => (sheetOpen = false)}>
	{#snippet children()}
		<div class="space-y-6">
			<div>
				<h3 class="text-lg font-semibold text-slate-900">
					{especialidadeEmEdicao ? 'Editar Especialidade' : 'Nova Especialidade'}
				</h3>
				<p class="text-sm text-slate-400 mt-1">
					{especialidadeEmEdicao ? 'Atualize os dados abaixo' : 'Preencha os dados para criar'}
				</p>
			</div>

			<div class="space-y-5">
				<div>
					<label for="esp-nome" class="input-label">Nome</label>
					<input
						id="esp-nome"
						type="text"
						bind:value={formNome}
						class="input-base"
						placeholder="Ex: Cardiologia"
					/>
					<p class="input-hint">Nome da especialidade médica</p>
				</div>

				<div class="relative">
					<label for="esp-categoria" class="input-label">Categoria</label>
					<div class="relative">
						<input
							id="esp-categoria"
							type="text"
							bind:value={formCategoria}
							onfocus={() => (categoriaDropdownOpen = true)}
							onblur={() => setTimeout(() => (categoriaDropdownOpen = false), 150)}
							oninput={() => (categoriaDropdownOpen = true)}
							class="input-base pr-9"
							placeholder="Selecione ou crie uma categoria"
							autocomplete="off"
						/>
						<button
							type="button"
							tabindex={-1}
							onmousedown={(e) => {
								e.preventDefault();
								categoriaDropdownOpen = !categoriaDropdownOpen;
							}}
							class="absolute inset-y-0 right-0 flex items-center px-2.5
								text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
						>
							<ChevronDown
								class="w-4 h-4 transition-transform duration-200 {categoriaDropdownOpen ? 'rotate-180' : ''}"
							/>
						</button>
					</div>
					<p class="input-hint">Selecione existente ou digite para criar nova</p>

					{#if categoriaDropdownOpen && (categoriasFiltradas.length > 0 || formCategoria.trim())}
						<div class="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto">
							{#each categoriasFiltradas as cat}
								<button
									type="button"
									onmousedown={() => { formCategoria = cat; categoriaDropdownOpen = false; }}
									class="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2"
								>
									<span>{cat}</span>
								</button>
							{/each}

							{#if formCategoria.trim() && !categoriasOrdenadas.some((c) => c.toLowerCase() === formCategoria.trim().toLowerCase())}
								<button
									type="button"
									onmousedown={() => {
										formCategoria = formCategoria.trim().charAt(0).toUpperCase() + formCategoria.trim().slice(1).toLowerCase();
										categoriaDropdownOpen = false;
									}}
									class="w-full px-3 py-2.5 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-2 border-t border-slate-100"
								>
									<span class="text-blue-500">+</span>
									<span>Criar "<strong>{formCategoria.trim()}</strong>"</span>
								</button>
							{/if}

							{#if categoriasFiltradas.length === 0 && !formCategoria.trim()}
								<div class="px-3 py-2.5 text-sm text-slate-400">
									Digite para criar uma categoria
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
				<Button variant="outline" onclick={() => (sheetOpen = false)}>Cancelar</Button>
				<Button onclick={handleSalvarEspecialidade}>
					{especialidadeEmEdicao ? 'Salvar' : 'Criar'}
				</Button>
			</div>
		</div>
	{/snippet}
</Sheet>

<!-- FAB (mobile) -->
<Button
	class="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden"
	onclick={handleNovaEspecialidade}
>
	<Plus class="h-6 w-6 text-white" />
</Button>

<!-- Confirm Dialogs -->
<ConfirmDialog
	open={deleteConfirmOpen}
	onclose={() => { deleteConfirmOpen = false; isBlockingDialog = false; }}
	title={isBlockingDialog ? 'Especialidade em uso' : 'Excluir especialidade'}
	onconfirm={confirmDeleteEspecialidade}
	variant={isBlockingDialog ? 'warning' : 'danger'}
	{isBlockingDialog}
>
{#snippet description()}
	{#if isBlockingDialog && deleteErrorMessage}
		<p>{deleteErrorMessage}</p>
	{:else if itemToDelete}
		<p>Você está prestes a excluir a especialidade <strong>"{itemToDelete.nome}"</strong>.</p>
		<p>Esta ação não pode ser desfeita.</p>
	{/if}
{/snippet}
</ConfirmDialog>

<ConfirmDialog
	open={categoryDeleteConfirmOpen}
	onclose={() => (categoryDeleteConfirmOpen = false)}
	title="Excluir categoria"
	variant="danger"
	onconfirm={confirmDeleteCategoria}
>
{#snippet description()}
	{#if categoryToDelete}
		<p>
			A exclusão da categoria <strong>"{categoryToDelete}"</strong> também excluirá todas
			as especialidades e subespecialidades vinculadas.
		</p>
		<p>Esta ação não pode ser desfeita.</p>
	{/if}
{/snippet}
</ConfirmDialog>

<ConfirmDialog
	open={subDeleteConfirmOpen}
	onclose={() => (subDeleteConfirmOpen = false)}
	title="Excluir subespecialidade"
	variant="danger"
	onconfirm={confirmDeleteSub}
>
{#snippet description()}
	{#if subToDelete}
		<p>Excluir a subespecialidade <strong>"{subToDelete.sub.nome}"</strong> de "{subToDelete.espNome}"?</p>
		<p>Esta ação não pode ser desfeita.</p>
	{/if}
{/snippet}
</ConfirmDialog>
