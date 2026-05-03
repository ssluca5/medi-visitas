<script lang="ts">
	import {
		Users,
		Stethoscope,
		CalendarCheck,
		TrendingUp,
		Calendar,
		CalendarDays,
		Search,
		X,
		BarChart3,
		ArrowUpRight,
		Mic
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { apiFetch } from '$lib/api';
	import CardResumo from '$lib/components/dashboard/CardResumo.svelte';
	import PainelAlertas from '$lib/components/dashboard/PainelAlertas.svelte';
	import ListaProximasVisitas from '$lib/components/dashboard/ListaProximasVisitas.svelte';
	import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
	import TourPrimeiroAcesso from '$lib/components/ui/TourPrimeiroAcesso.svelte';
	import type { DashboardResumo, Alerta } from '$lib/types';

	interface Props {
		data: {
			resumo: DashboardResumo | null;
			alertas: Alerta[];
			sessionToken: string | null;
			tourConcluidoEm: string | null;
			role: 'OWNER' | 'MEMBER' | null;
		};
	}

	let mostrarTour = $state(false);

	$effect(() => {
		if (!data.tourConcluidoEm) {
			mostrarTour = true;
		}
	});

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

	// Saudação dinâmica
	const saudacao = $derived.by(() => {
		const h = new Date().getHours();
		if (h < 12) return 'Bom dia';
		if (h < 18) return 'Boa tarde';
		return 'Boa noite';
	});

	// Transcrições IA — fetch inline
	let transcStatus = $state<{ usadas: number; limite: number; restantes: number } | null>(null);

	$effect(() => {
		async function fetchTransc() {
			try {
				const res = await apiFetch('/transcricoes/status', data.sessionToken);
				if (res.ok) transcStatus = await res.json();
			} catch {}
		}
		fetchTransc();
	});
</script>

<svelte:head>
	<title>Dashboard — MediVisitas</title>
</svelte:head>

<div class="dashboard-container">
	<!-- ═══════════════════════════════════════════════════
	     Header — Saudação + Busca
	     ═══════════════════════════════════════════════════ -->
	<header class="mb-8 flex items-start justify-between gap-4 flex-wrap">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-[rgb(var(--slate-900))]">
				{saudacao} 👋
			</h1>
			<p class="text-sm text-[rgb(var(--slate-400))] mt-1">
				Acompanhe métricas, agendamentos e o uso de IA em tempo real.
			</p>
		</div>

		<!-- Busca global -->
		<div role="search" aria-label="Buscar profissionais" class="relative w-72">
			<Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate-400))]" />
			<input
				type="text"
				placeholder="Buscar profissional, visita ou especialidade..."
				bind:value={query}
				class="search-input"
				onblur={() => { setTimeout(() => { aberto = false; }, 200); }}
				onfocus={() => { if (resultados.length > 0) aberto = true; }}
			/>
			{#if aberto}
				<div
					id="search-results"
					role="listbox"
					aria-label="Resultados da busca"
					class="search-dropdown"
				>
					{#each resultados as r}
						<button
							type="button"
							role="option"
							aria-selected="false"
							onclick={() => handleSelect(r)}
							class="search-result-item"
						>
							<p class="text-sm font-medium text-[rgb(var(--slate-800))]">{r.nome}</p>
							<p class="text-xs text-[rgb(var(--slate-400))] mt-0.5">
								{#if r.crm}{r.crm}{/if}
								{#if r.especialidade} · {r.especialidade}{/if}
								{#if r.cidade} · {r.cidade}{/if}
							</p>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- ═══════════════════════════════════════════════════
	     KPI Cards Row — 4 métricas principais
	     ═══════════════════════════════════════════════════ -->
	<section class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8" aria-label="Métricas principais">
		<CardResumo
			titulo="Visitas Hoje"
			valor={resumo?.visitasHoje ?? 0}
			icone={CalendarCheck}
			corIcone="text-violet-600"
			corFundo="bg-violet-50"
			subtexto="↑ 12% vs. ontem"
			subtextoCor="#059669"
		/>
		<CardResumo
			titulo="Visitas Semana"
			valor={resumo?.visitasSemana ?? 0}
			icone={Calendar}
			corIcone="text-blue-600"
			corFundo="bg-blue-50"
			subtexto="+ 3% vs. semana anterior"
			subtextoCor="#2563eb"
		/>
		<CardResumo
			titulo="Profissionais"
			valor={resumo?.totalProfissionais ?? 0}
			icone={Users}
			corIcone="text-emerald-600"
			corFundo="bg-emerald-50"
			subtexto="+5 novos"
			subtextoCor="#059669"
		/>
		<CardResumo
			titulo="Especialidades"
			valor={resumo?.totalEspecialidades ?? 0}
			icone={Stethoscope}
			corIcone="text-amber-600"
			corFundo="bg-amber-50"
			subtexto="Estável"
			subtextoCor="rgb(var(--slate-400))"
		/>
	</section>

	<!-- ═══════════════════════════════════════════════════
	     Transcrições IA — Barra de uso inline
	     ═══════════════════════════════════════════════════ -->
	{#if transcStatus}
	<section class="transcricoes-inline mb-8" aria-label="Uso de transcrições IA">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2.5">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
					<Mic class="h-4 w-4 text-violet-600" />
				</div>
				<span class="text-sm font-medium text-[rgb(var(--slate-700))]">
					Transcrições IA Usadas este mês
				</span>
			</div>
			<div class="flex items-center gap-4">
				<span class="text-sm font-bold text-[rgb(var(--slate-800))]">
					{transcStatus.usadas}/{transcStatus.limite}
				</span>
				<a
					href="/planos"
					class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
				>
					Comprar mais
				</a>
			</div>
		</div>
		<div class="mt-3">
			<div class="progress-track">
				<div
					class="progress-fill"
					style="width: {Math.min(100, Math.round((transcStatus.usadas / Math.max(1, transcStatus.limite)) * 100))}%;"
				></div>
			</div>
			<p class="text-xs text-[rgb(var(--slate-400))] mt-2">
				{transcStatus.restantes} restantes
			</p>
		</div>
	</section>
	{/if}

	<!-- ═══════════════════════════════════════════════════
	     Alertas + Próximos Agendamentos — Grid 2 colunas
	     ═══════════════════════════════════════════════════ -->
	<section class="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8" aria-label="Alertas e agendamentos">
		<PainelAlertas alertas={alertas} />
		<ListaProximasVisitas agendamentos={resumo?.proximosAgendamentos ?? []} />
	</section>

	<!-- ═══════════════════════════════════════════════════
	     Métricas & Conversão — seção com link
	     ═══════════════════════════════════════════════════ -->
	<section class="metricas-section mb-8" aria-label="Métricas e conversão">
		<div class="flex items-center justify-between mb-5">
			<div class="flex items-center gap-2.5">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
					<BarChart3 class="h-4 w-4 text-blue-600" />
				</div>
				<span class="text-sm font-semibold text-[rgb(var(--slate-700))]">Métricas & Conversão</span>
			</div>
			<a
				href="/dashboard/pipeline"
				class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors group"
			>
				Ver relatório completo
				<ArrowUpRight class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
			</a>
		</div>

		<!-- Últimas Visitas (dentro da seção de métricas) -->
		{#if resumo?.ultimasVisitas && resumo.ultimasVisitas.length > 0}
			<div class="space-y-2">
				{#each resumo.ultimasVisitas as visita}
					<a
						href="/dashboard/profissionais/{visita.id}"
						class="visita-row group"
					>
						<div class="flex-shrink-0 w-16 text-center">
							<span class="text-[13px] font-bold text-[rgb(var(--slate-700))]">
								{new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(visita.dataVisita))}
							</span>
							<span class="block text-[10px] text-[rgb(var(--slate-400))] mt-0.5">
								{new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
							</span>
						</div>
						<div class="min-w-0 border-l border-[rgb(var(--slate-100))] pl-3 flex-1">
							<p class="text-[13px] font-medium text-[rgb(var(--slate-700))] truncate group-hover:text-blue-600 transition-colors">
								{visita.profissional?.nome ?? 'Profissional'}
							</p>
							<p class="text-[11px] text-[rgb(var(--slate-400))] truncate">
								{visita.profissional?.especialidade?.nome ?? ''}
								{#if visita.objetivoVisita}
									<span class="text-[rgb(var(--slate-300))]"> · </span>{visita.objetivoVisita}
								{/if}
							</p>
						</div>
						<StatusVisitaBadge status={visita.status} />
					</a>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-10">
				<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 mb-3">
					<BarChart3 class="h-6 w-6 text-blue-400" />
				</div>
				<p class="text-sm font-medium text-[rgb(var(--slate-600))]">Sem dados de conversão</p>
				<p class="text-xs text-[rgb(var(--slate-400))] mt-1 text-center max-w-[260px]">
					Registre visitas para acompanhar suas métricas de desempenho.
				</p>
			</div>
		{/if}
	</section>

	<!-- ═══════════════════════════════════════════════════
	     Acesso Rápido — Links rápidos
	     ═══════════════════════════════════════════════════ -->
	<section aria-label="Acesso rápido">
		<h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Acesso Rápido</h3>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each [
				{ title: 'Profissionais', desc: 'Gerenciar cadastros', icon: Users, href: '/dashboard/profissionais', hoverBorder: 'hover:border-blue-200', hoverBg: 'hover:bg-blue-50/40', hoverIcon: 'group-hover:text-blue-600' },
				{ title: 'Visitas', desc: 'Histórico de visitas', icon: CalendarDays, href: '/dashboard/visitas', hoverBorder: 'hover:border-sky-200', hoverBg: 'hover:bg-sky-50/40', hoverIcon: 'group-hover:text-sky-600' },
				{ title: 'Especialidades', desc: 'Categorias e subs', icon: Stethoscope, href: '/dashboard/especialidades', hoverBorder: 'hover:border-emerald-200', hoverBg: 'hover:bg-emerald-50/40', hoverIcon: 'group-hover:text-emerald-600' },
				{ title: 'Pipeline', desc: 'Funil de conversão', icon: TrendingUp, href: '/dashboard/pipeline', hoverBorder: 'hover:border-violet-200', hoverBg: 'hover:bg-violet-50/40', hoverIcon: 'group-hover:text-violet-600' }
			] as item}
				{@const Icon = item.icon}
				<a
					href={item.href}
					class="quick-link group {item.hoverBorder} {item.hoverBg}"
				>
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--slate-50))] group-hover:bg-white transition-colors">
						<Icon class="h-5 w-5 text-[rgb(var(--slate-400))] {item.hoverIcon} transition-colors" />
					</div>
					<div>
						<p class="text-[13px] font-semibold text-[rgb(var(--slate-700))] group-hover:text-[rgb(var(--slate-900))]">{item.title}</p>
						<p class="text-[11px] text-[rgb(var(--slate-400))] font-medium">{item.desc}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>

{#if mostrarTour}
	<TourPrimeiroAcesso
		sessionToken={data.sessionToken}
		onclose={() => mostrarTour = false}
	/>
{/if}

<style>
	/* ── Dashboard Container ── */
	.dashboard-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	/* ── Search Input ── */
	.search-input {
		width: 100%;
		height: 42px;
		padding-left: 40px;
		padding-right: 14px;
		font-size: 13px;
		border-radius: 12px;
		border: 1px solid rgba(226, 232, 240, 0.8);
		background-color: rgba(248, 250, 252, 0.6);
		color: rgb(var(--slate-800));
		transition: all 200ms ease-out;
		outline: none;
	}
	.search-input::placeholder {
		color: rgb(var(--slate-400));
	}
	.search-input:focus {
		background-color: #ffffff;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
	}

	/* ── Search Dropdown ── */
	.search-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 6px;
		background: #ffffff;
		border-radius: 12px;
		border: 1px solid rgba(226, 232, 240, 0.8);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
		z-index: 50;
		max-height: 320px;
		overflow-y: auto;
	}
	.search-result-item {
		width: 100%;
		text-align: left;
		padding: 12px 16px;
		transition: background-color 150ms ease;
		cursor: pointer;
		border-bottom: 1px solid rgba(241, 245, 249, 0.8);
	}
	.search-result-item:last-child {
		border-bottom: none;
	}
	.search-result-item:hover {
		background-color: rgb(248 250 252);
	}

	/* ── Transcrições Inline Section ── */
	.transcricoes-inline {
		background: #ffffff;
		border-radius: 16px;
		padding: 20px 24px;
		border: 1px solid rgba(226, 232, 240, 0.7);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
	}
	.progress-track {
		height: 6px;
		width: 100%;
		border-radius: 999px;
		background-color: rgb(241 245 249);
	}
	.progress-fill {
		height: 6px;
		border-radius: 999px;
		background-color: #2563eb;
		transition: width 500ms ease-out;
	}

	/* ── Métricas Section ── */
	.metricas-section {
		background: #ffffff;
		border-radius: 16px;
		padding: 24px;
		border: 1px solid rgba(226, 232, 240, 0.7);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
	}

	/* ── Visita Row ── */
	.visita-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		border-radius: 12px;
		transition: all 200ms ease-out;
	}
	.visita-row:hover {
		background-color: rgb(248 250 252);
	}

	/* ── Quick Link Cards ── */
	.quick-link {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		background: #ffffff;
		border-radius: 16px;
		border: 1px solid rgba(226, 232, 240, 0.7);
		transition: all 200ms ease-out;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
	}
	.quick-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}
	.quick-link:active {
		transform: scale(0.98);
	}
</style>
