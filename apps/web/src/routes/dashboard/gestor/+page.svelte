<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Users, Stethoscope, CalendarCheck, BarChart3, ChevronDown } from 'lucide-svelte';
	import { apiFetch } from '$lib/api';
	import CardResumo from '$lib/components/dashboard/CardResumo.svelte';
	import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';

	let { data } = $props<{ data: any }>();

	let resumoData = $state(untrack(() => data.resumo));
	let membroSelecionado = $state(untrack(() => data.membroIdSelecionado || ''));

	$effect(() => {
		resumoData = data.resumo;
		membroSelecionado = data.membroIdSelecionado || '';
	});

	const kpis = $derived(resumoData?.kpis);
	const pipeline = $derived(resumoData?.pipeline);
	const visitasRecentes = $derived(resumoData?.visitasRecentes || []);
	const membros = $derived(data.membros || []);

	// Nome do membro selecionado para exibir nos títulos
	const nomeMembro = $derived(() => {
		if (!membroSelecionado) return 'Toda a equipe';
		const m = membros.find((mb: any) => mb.userId === membroSelecionado);
		return m?.user?.name || m?.user?.email || 'Membro';
	});

	// Nomes dos estágios do funil traduzidos
	const estagioLabels: Record<string, string> = {
		PROSPECTADO: 'Prospectado',
		VISITADO: 'Visitado',
		INTERESSADO: 'Interessado',
		PRESCRITOR: 'Prescritor',
		FIDELIZADO: 'Fidelizado'
	};

	// Cores dos estágios para os badges
	const estagioCores: Record<string, string> = {
		PROSPECTADO: 'bg-slate-100 text-slate-700',
		VISITADO: 'bg-blue-100 text-blue-700',
		INTERESSADO: 'bg-amber-100 text-amber-700',
		PRESCRITOR: 'bg-emerald-100 text-emerald-700',
		FIDELIZADO: 'bg-purple-100 text-purple-700'
	};

	async function handleFilterChange(e: Event) {
		const select = e.target as HTMLSelectElement;
		const value = select.value;
		
		// Atualiza localmente para feedback visual imediato
		membroSelecionado = value;

		try {
			const resumoUrl = value ? `/gestor/resumo?userId=${value}` : '/gestor/resumo';
			const res = await apiFetch(resumoUrl, data.sessionToken);
			
			if (res.ok) {
				const novoResumo = await res.json();
				resumoData = novoResumo;
				
				// Atualiza URL silenciosamente, sem disparar goto
				const url = new URL(window.location.href);
				if (value) {
					url.searchParams.set('membroId', value);
				} else {
					url.searchParams.delete('membroId');
				}
				window.history.replaceState(null, '', url.toString());
			}
		} catch (err) {
			console.error("Erro ao carregar novo resumo:", err);
		}
	}

	function formatDateParts(dateStr: string): { dia: string; mes: string } {
		const d = new Date(dateStr);
		return {
			dia: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
			mes: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
		};
	}
</script>

<svelte:head>
	<title>Visão Gestor — MediVisitas</title>
</svelte:head>

<!-- Page Header com Filtro -->
<div class="page-header">
	<div class="page-header-main">
		<div class="page-header-icon">
			<BarChart3 class="h-5 w-5 text-white" />
		</div>
		<div>
			<h1 class="page-title">Gestão / Resumo</h1>
			<p class="page-description">Métricas e performance da organização.</p>
		</div>
	</div>

	<!-- Filtro Mestre (Seletor de Membro) -->
	{#if membros.length > 0}
		<div class="relative w-full sm:w-64">
			<select
				value={membroSelecionado}
				onchange={handleFilterChange}
				class="w-full h-10 px-3 pr-10 rounded-lg border border-[rgb(var(--slate-200))] bg-white text-sm text-[rgb(var(--slate-700))] outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 shadow-sm transition-all appearance-none cursor-pointer"
			>
				<option value="">Toda a equipe</option>
				{#each membros as membro}
					<option value={membro.userId}>
						{membro.user?.name || membro.user?.email || 'Membro'}
					</option>
				{/each}
			</select>
			<ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate-400))] pointer-events-none" />
		</div>
	{/if}
</div>

{#if resumoData}
	<!-- KPIs Row -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
		<div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
			<CardResumo
				titulo="Membros na Equipe"
				valor={kpis?.totalMembros || 0}
				icone={Users}
				corIcone="text-blue-600"
				corFundo="bg-blue-50"
			/>
		</div>
		<div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
			<CardResumo
				titulo={membroSelecionado ? 'Profissionais' : 'Total de Profissionais'}
				valor={kpis?.totalProfissionais || 0}
				icone={Stethoscope}
				corIcone="text-emerald-600"
				corFundo="bg-emerald-50"
			/>
		</div>
		<div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
			<CardResumo
				titulo={membroSelecionado ? 'Visitas' : 'Visitas Realizadas'}
				valor={kpis?.totalVisitas || 0}
				icone={CalendarCheck}
				corIcone="text-blue-600"
				corFundo="bg-blue-100"
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
		<!-- Pipeline Aggregation -->
		<div class="card-surface p-5 h-full">
			<h3 class="section-title mb-4">
				{#if membroSelecionado}
					Evolução do Funil ({nomeMembro()})
				{:else}
					Evolução do Funil (Agregada)
				{/if}
			</h3>
			<div class="space-y-0">
				{#each Object.entries(pipeline || {}) as [estagio, total]}
					<div class="flex items-center justify-between py-3 border-b border-[rgb(var(--slate-100))] last:border-0">
						<span class="text-sm font-medium text-[rgb(var(--slate-700))]">
							{estagioLabels[estagio] || estagio.toLowerCase()}
						</span>
						<span class="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md text-xs font-bold {estagioCores[estagio] || 'bg-slate-100 text-slate-700'}">
							{total}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent Visits -->
		<div class="card-surface p-5 h-full">
			<h3 class="section-title mb-4">
				{#if membroSelecionado}
					Últimas Visitas ({nomeMembro()})
				{:else}
					Últimas Visitas Realizadas
				{/if}
			</h3>
			<div class="space-y-3">
				{#each visitasRecentes as visita}
					{@const dateParts = formatDateParts(visita.dataVisita || visita.createdAt)}
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[rgb(var(--slate-100))] rounded-xl bg-[rgb(var(--slate-50))]/50 hover:bg-[rgb(var(--slate-50))] transition-colors">
						<div class="flex items-center gap-4">
							<div class="flex flex-col items-center justify-center px-3 border-r border-[rgb(var(--slate-200))] pr-4">
								<span class="text-sm font-bold text-[rgb(var(--slate-700))]">{dateParts.dia}</span>
								<span class="text-xs text-[rgb(var(--slate-500))] uppercase">{dateParts.mes}</span>
							</div>
							<div class="min-w-0">
								<p class="text-sm font-bold text-[rgb(var(--slate-900))] truncate">
									{visita.profissional?.nome ?? 'Profissional'}
								</p>
								<p class="text-xs text-[rgb(var(--slate-500))] mt-0.5 truncate">
									Rep: {visita.userName}
								</p>
							</div>
						</div>
						<div class="mt-3 sm:mt-0 flex-shrink-0">
							<StatusVisitaBadge status={visita.status} />
						</div>
					</div>
				{:else}
					<p class="text-muted-standard py-4">Nenhuma visita encontrada.</p>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="card-surface p-8 text-center text-[rgb(var(--slate-500))]">
		Falha ao carregar o resumo do gestor. Tente novamente mais tarde.
	</div>
{/if}
