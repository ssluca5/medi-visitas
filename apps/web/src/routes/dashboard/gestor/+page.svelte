<script lang="ts">
	import { Users, Stethoscope, CalendarCheck, FileText, Download } from 'lucide-svelte';
	import CardResumo from '$lib/components/dashboard/CardResumo.svelte';
	import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';

	let { data } = $props<{ data: any }>();

	const resumo = $derived(data.resumo);
	const kpis = $derived(resumo?.kpis);
	const pipeline = $derived(resumo?.pipeline);
	const visitasRecentes = $derived(resumo?.visitasRecentes || []);
</script>

<svelte:head>
	<title>Visão Gestor — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
	<div class="flex items-center gap-3">
		<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-sm">
			<FileText class="h-[18px] w-[18px] text-white" />
		</div>
		<div>
			<h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Gestão / Resumo</h1>
			<p class="text-[11px] text-[rgb(var(--slate-400))]">Métricas e performance de toda a organização</p>
		</div>
	</div>
</div>

{#if resumo}
	<!-- KPIs Row -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6 items-stretch">
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
				titulo="Total de Profissionais"
				valor={kpis?.totalProfissionais || 0}
				icone={Stethoscope}
				corIcone="text-emerald-600"
				corFundo="bg-emerald-50"
			/>
		</div>
		<div class="will-change-transform transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
			<CardResumo
				titulo="Visitas Realizadas"
				valor={kpis?.totalVisitas || 0}
				icone={CalendarCheck}
				corIcone="text-violet-600"
				corFundo="bg-violet-50"
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
		<!-- Pipeline Aggregation -->
		<div class="card-surface p-5 h-full">
			<h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Evolução do Funil (Agregada)</h3>
			<div class="space-y-4">
				{#each Object.entries(pipeline || {}) as [estagio, total]}
					<div class="flex items-center justify-between">
						<span class="text-sm text-[rgb(var(--slate-700))] font-medium capitalize">{estagio.toLowerCase()}</span>
						<span class="text-sm font-bold text-[rgb(var(--slate-900))] bg-[rgb(var(--slate-100))] px-2.5 py-1 rounded-md">{total}</span>
					</div>
					{#if estagio !== 'FIDELIZADO'}
						<hr class="border-[rgb(var(--slate-100))]" />
					{/if}
				{/each}
			</div>
		</div>

		<!-- Recent Visits -->
		<div class="card-surface p-5 h-full">
			<h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Últimas Visitas Realizadas</h3>
			<div class="space-y-2.5">
				{#each visitasRecentes as visita}
					<div class="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--slate-50))] border border-[rgb(var(--slate-100))]">
						<div class="flex-shrink-0 w-14 text-center border-r border-[rgb(var(--slate-200))] pr-2">
							<span class="text-[13px] font-bold text-[rgb(var(--slate-700))]">
								{new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(visita.dataVisita))}
							</span>
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-[13px] font-medium text-[rgb(var(--slate-700))] truncate">
								{visita.profissional?.nome ?? 'Profissional'}
							</p>
							<p class="text-[11px] text-[rgb(var(--slate-400))] truncate">
								Representante: {visita.userName}
							</p>
						</div>
						<StatusVisitaBadge status={visita.status} />
					</div>
				{:else}
					<p class="text-sm text-[rgb(var(--slate-500))]">Nenhuma visita encontrada.</p>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="card-surface p-8 text-center text-[rgb(var(--slate-500))]">
		Falha ao carregar o resumo do gestor. Tente novamente mais tarde.
	</div>
{/if}
