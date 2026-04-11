<script lang="ts">
	import { Users, Stethoscope, CalendarCheck, TrendingUp, Calendar, CalendarDays, Search, X } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { apiFetch } from '$lib/api';
	import CardResumo from '$lib/components/dashboard/CardResumo.svelte';
	import PainelAlertas from '$lib/components/dashboard/PainelAlertas.svelte';
	import ListaProximasVisitas from '$lib/components/dashboard/ListaProximasVisitas.svelte';
	import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
	import type { DashboardResumo, Alerta } from '$lib/types';

	interface Props {
		data: {
			resumo: DashboardResumo | null;
			alertas: Alerta[];
			sessionToken: string | null;
		};
	}

	let { data }: Props = $props();

	const resumo = $derived(data.resumo);
	const alertas = $derived(data.alertas);

	// Search state
	let query = $state('');
	let resultados = $state<Array<{ id: string; nome: string; crm?: string; especialidade?: string; cidade?: string }>>([]);
	let aberto = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (query.length < 2) { resultados = []; aberto = false; return; }
		clearTimeout(timer);
		timer = setTimeout(async () => {
			try {
				const res = await apiFetch(`/busca?q=${encodeURIComponent(query)}`, data.sessionToken);
				if (res.ok) { const json = await res.json(); resultados = json.resultados; aberto = resultados.length > 0; }
			} catch {}
		}, 300);
	});

	function handleSelect(r: { id: string }) {
		aberto = false; query = '';
		goto(`/dashboard/profissionais/${r.id}`);
	}
</script>

<svelte:head>
	<title>Dashboard — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-6">
	<div class="flex items-center gap-3">
		<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
			<TrendingUp class="h-[18px] w-[18px] text-white" />
		</div>
		<div>
			<h1 class="text-lg font-bold text-slate-800">Dashboard</h1>
			<p class="text-[11px] text-slate-400">Visão geral do seu dia</p>
		</div>
	</div>
</div>

<!-- Dashboard Toolbar -->
<div class="flex justify-between items-center mb-6">
	<div class="relative w-96">
		<div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-blue-300 focus-within:shadow-md">
			<Search class="h-4 w-4 text-slate-400 shrink-0" />
			<input
				type="text"
				placeholder="Buscar profissionais..."
				bind:value={query}
				onblur={() => { setTimeout(() => { aberto = false; }, 200); }}
				onfocus={() => { if (resultados.length > 0) aberto = true; }}
				class="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
			/>
			{#if query}
				<button onclick={() => { query = ''; resultados = []; aberto = false; }} class="text-slate-400 hover:text-slate-600 cursor-pointer">
					<X class="h-4 w-4" />
				</button>
			{/if}
		</div>
		{#if aberto}
			<div class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg z-50 max-h-80 overflow-y-auto">
				{#each resultados as r}
					<button
						type="button"
						onclick={() => handleSelect(r)}
						class="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
					>
						<p class="text-sm font-medium text-slate-800">{r.nome}</p>
						<p class="text-xs text-slate-400 mt-0.5">
							{#if r.crm}{r.crm}{/if}
							{#if r.especialidade} · {r.especialidade}{/if}
							{#if r.cidade} · {r.cidade}{/if}
						</p>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Quick Actions -->
<div class="card-surface p-5 mb-6 transition-all duration-200 hover:shadow-sm">
	<h3 class="text-sm font-semibold text-slate-700 mb-4">Acesso Rápido</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<a
			href="/dashboard/profissionais"
			class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-blue-200 hover:bg-blue-50/40 active:scale-[0.98]"
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
				<Users class="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
			</div>
			<div>
				<p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Profissionais</p>
				<p class="text-[11px] text-slate-400 font-medium">Gerenciar cadastros</p>
			</div>
		</a>
		<a
			href="/dashboard/visitas"
			class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-sky-200 hover:bg-sky-50/40 active:scale-[0.98]"
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
				<CalendarDays class="h-4 w-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
			</div>
			<div>
				<p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Visitas</p>
				<p class="text-[11px] text-slate-400 font-medium">Histórico de visitas</p>
			</div>
		</a>
		<a
			href="/dashboard/especialidades"
			class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40 active:scale-[0.98]"
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
				<Stethoscope class="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
			</div>
			<div>
				<p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Especialidades</p>
				<p class="text-[11px] text-slate-400 font-medium">Categorias e subs</p>
			</div>
		</a>
		<a
			href="/dashboard/pipeline"
			class="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm hover:border-violet-200 hover:bg-violet-50/40 active:scale-[0.98]"
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
				<TrendingUp class="h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
			</div>
			<div>
				<p class="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Pipeline</p>
				<p class="text-[11px] text-slate-400 font-medium">Funil de conversão</p>
			</div>
		</a>
	</div>
</div>

<!-- KPI Cards Row -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 items-stretch">
	<div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
		<CardResumo
			titulo="Visitas Hoje"
			valor={resumo?.visitasHoje ?? 0}
			icone={CalendarCheck}
			corIcone="text-violet-600"
			corFundo="bg-violet-50"
		/>
	</div>
	<div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
		<CardResumo
			titulo="Visitas Semana"
			valor={resumo?.visitasSemana ?? 0}
			icone={Calendar}
			corIcone="text-blue-600"
			corFundo="bg-blue-50"
		/>
	</div>
	<div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
		<CardResumo
			titulo="Profissionais"
			valor={resumo?.totalProfissionais ?? 0}
			icone={Users}
			corIcone="text-emerald-600"
			corFundo="bg-emerald-50"
		/>
	</div>
	<div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
		<CardResumo
			titulo="Especialidades"
			valor={resumo?.totalEspecialidades ?? 0}
			icone={Stethoscope}
			corIcone="text-amber-600"
			corFundo="bg-amber-50"
		/>
	</div>
</div>

<!-- Alertas + Próximos Agendamentos -->
<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
	<PainelAlertas alertas={alertas} />
	<ListaProximasVisitas agendamentos={resumo?.proximosAgendamentos ?? []} />
</div>

<!-- Últimas Visitas -->
{#if resumo?.ultimasVisitas && resumo.ultimasVisitas.length > 0}
	<div class="card-surface p-5 mb-6">
		<h3 class="text-sm font-semibold text-slate-700 mb-4">Últimas Visitas</h3>
		<div class="space-y-2.5">
			{#each resumo.ultimasVisitas as visita}
				<a
					href="/dashboard/profissionais/{visita.id}"
					class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group"
				>
					<div class="flex-shrink-0 w-16 text-center">
						<span class="text-[13px] font-bold text-slate-700">
							{new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(visita.dataVisita))}
						</span>
						<span class="block text-[10px] text-slate-400 mt-0.5">
							{new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
						</span>
					</div>
					<div class="min-w-0 border-l border-slate-100 pl-3 flex-1">
						<p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">
							{visita.profissional?.nome ?? 'Profissional'}
						</p>
						<p class="text-[11px] text-slate-400 truncate">
							{visita.profissional?.especialidade?.nome ?? ''}
							{#if visita.objetivoVisita}
								<span class="text-slate-300"> · </span>{visita.objetivoVisita}
							{/if}
						</p>
					</div>
					<StatusVisitaBadge status={visita.status} />
				</a>
			{/each}
		</div>
	</div>
{/if}

