<script lang="ts">
	import { onMount } from 'svelte';
	import { apiFetch } from '$lib/api';
	import type {
		AgendaItem,
		SugestaoProfissional,
		PrioridadeAgenda,
		StatusAgenda
	} from '$lib/types';
	import CalendarioSemanal from '$lib/components/ui/CalendarioSemanal.svelte';
	import CalendarioMensal from '$lib/components/ui/CalendarioMensal.svelte';
	import PainelSugestoes from '$lib/components/ui/PainelSugestoes.svelte';
	import VisitaSheet from '$lib/components/ui/VisitaSheet.svelte';
	import type { Visita, MaterialTecnico } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { CalendarDays, CalendarRange, Plus, Sparkles } from 'lucide-svelte';

	interface Props {
		data: { sessionToken: string | null };
	}

	let { data }: Props = $props();

	// ── State ──
	let items = $state<AgendaItem[]>([]);
	let sugestoes = $state<SugestaoProfissional[]>([]);
	let loading = $state(true);
	let loadingSugestoes = $state(false);
	let saving = $state(false);
	
	let materiaisOptions = $state<MaterialTecnico[]>([]);

	let currentDate = $state(new Date());
	let viewMode = $state<'semanal' | 'mensal'>('semanal');

	let sheetOpen = $state(false);
	let selectedVisita = $state<Visita | null>(null);
	let agendarProfissionalId = $state('');
	let agendarProfissionalNome = $state('');
	let defaultDateStr = $state('');
	let defaultTimeStr = $state('');

	let confirmDeleteOpen = $state(false);
	let deleteId = $state('');

	let showSugestoes = $state(true);

	// ── Derived ──
	let dateRange = $derived(() => {
		if (viewMode === 'semanal') {
			const d = new Date(currentDate);
			const day = d.getDay();
			const diff = day === 0 ? -6 : 1 - day;
			const start = new Date(d);
			start.setDate(d.getDate() + diff);
			start.setHours(0, 0, 0, 0);
			const end = new Date(start);
			end.setDate(start.getDate() + 6);
			end.setHours(23, 59, 59, 999);
			return { start, end };
		} else {
			const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
			return { start, end };
		}
	});

	// ── Data Loading ──
	async function loadItems() {
		loading = true;
		try {
			const range = dateRange();
			const params = new URLSearchParams({
				dataInicio: range.start.toISOString(),
				dataFim: range.end.toISOString(),
				pageSize: '100' // Using Visitas max page size
			});
			
			const res = await apiFetch(`/visitas?${params}`, data.sessionToken);

			let newItems: AgendaItem[] = [];

			if (res.ok) {
				const jsonVisitas = await res.json();
				const visitas = jsonVisitas.data || [];
				for (const v of visitas) {
					const startDt = new Date(v.dataVisita);
					const endDt = new Date(startDt);
					endDt.setMinutes(startDt.getMinutes() + (v.duracaoMinutos || 30));

					let mapStatus: StatusAgenda = 'REALIZADO';
					if (v.status === 'AGENDADA') mapStatus = 'CONFIRMADO';
					else if (v.status === 'CANCELADA' || v.status === 'NAO_REALIZADA') mapStatus = 'CANCELADO';

					newItems.push({
						id: `v-${v.id}`,
						profissionalId: v.profissionalId,
						visitaId: v.id,
						dataHoraInicio: startDt.toISOString(),
						dataHoraFim: endDt.toISOString(),
						status: mapStatus,
						prioridade: 'MEDIA',
						observacoes: v.resumo || v.objetivoVisita || null,
						profissional: {
							id: v.profissionalId,
							nome: v.profissional?.nome || 'Profissional',
							especialidade: v.profissional?.especialidade || null
						},
						createdAt: v.createdAt,
						updatedAt: v.updatedAt,
						// we sneak in rawVisita so handleItemClick can pass it to VisitaSheet
						rawVisita: v
					} as any);
				}
			}

			// Sort by time
			newItems.sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());
			items = newItems;
		} catch (e) {
			console.error('Erro ao carregar agenda:', e);
		} finally {
			loading = false;
		}
	}

	async function loadSugestoes() {
		loadingSugestoes = true;
		try {
			const range = dateRange();
			const params = new URLSearchParams({
				dataInicio: range.start.toISOString(),
				dataFim: range.end.toISOString()
			});
			const res = await apiFetch(`/agenda/sugestoes?${params}`, data.sessionToken);
			if (res.ok) {
				const json = await res.json();
				sugestoes = json.data || [];
			}
		} catch (e) {
			console.error('Erro ao carregar sugestões:', e);
		} finally {
			loadingSugestoes = false;
		}
	}

	async function loadMateriais() {
		try {
			const res = await apiFetch(`/materiais?pageSize=100`, data.sessionToken);
			if (res.ok) {
				const json = await res.json();
				materiaisOptions = json.data || json;
			}
		} catch (e) {
			console.error(e);
		}
	}

	onMount(() => {
		loadItems();
		loadSugestoes();
		loadMateriais();
	});

	// Reload on navigation
	$effect(() => {
		// Trigger on currentDate or viewMode change
		const _ = currentDate.getTime() + (viewMode === 'semanal' ? 0 : 1);
		loadItems();
		loadSugestoes();
	});

	// ── Handlers ──
	function handleNavigate(newDate: Date) {
		currentDate = newDate;
	}

	function handleItemClick(item: any) {
		selectedVisita = item.rawVisita || null;
		agendarProfissionalId = ''; // Visita sheet handles professional natively if editing
		agendarProfissionalNome = '';
		sheetOpen = true;
	}

	function handleDayClick(date: Date) {
		viewMode = 'semanal';
		currentDate = date;
	}

	function handleAgendar(profissionalId: string) {
		const sug = sugestoes.find((s) => s.profissional.id === profissionalId);
		selectedVisita = null;
		agendarProfissionalId = profissionalId;
		agendarProfissionalNome = sug?.profissional.nome ?? '';
		defaultDateStr = '';
		defaultTimeStr = '';
		sheetOpen = true;
	}

	function handleSlotClick(date: Date, hour: number) {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		defaultDateStr = `${y}-${m}-${d}`;
		defaultTimeStr = `${String(hour).padStart(2, '0')}:00`;
		
		selectedVisita = null;
		agendarProfissionalId = '';
		agendarProfissionalNome = '';
		sheetOpen = true;
	}

	function handleVisitaDelete(id: string) {
		// VisitaSheet deletes it via API and calls this if successful.
		// So we just reload the calendar items.
		loadItems();
		loadSugestoes();
	}
</script>

<svelte:head>
	<title>Agenda | MediVisitas</title>
	<meta name="description" content="Agenda inteligente de visitas médicas" />
</svelte:head>

<div class="flex flex-col h-full overflow-hidden">
	<!-- Top bar -->
	<div class="flex flex-wrap items-center justify-between gap-4 mb-6">
		<div class="flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
				<CalendarDays class="h-4.5 w-4.5 text-white" />
			</div>
			<div>
				<h1 class="text-lg font-bold text-slate-800">Agenda</h1>
				<p class="text-[11px] text-slate-400">Planeje visitas e acompanhe compromissos</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<!-- Toggle view -->
			<div class="flex rounded-lg bg-slate-100 p-0.5">
				<button
					type="button"
					class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer
						{viewMode === 'semanal'
						? 'bg-white text-slate-800 shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
					onclick={() => (viewMode = 'semanal')}
				>
					<CalendarRange class="h-3.5 w-3.5" />
					Semana
				</button>
				<button
					type="button"
					class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer
						{viewMode === 'mensal'
						? 'bg-white text-slate-800 shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
					onclick={() => (viewMode = 'mensal')}
				>
					<CalendarDays class="h-3.5 w-3.5" />
					Mês
				</button>
			</div>

			<!-- Toggle sugestões -->
			<button
				type="button"
				class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer
					{showSugestoes
					? 'border-blue-200 bg-blue-50 text-blue-700'
					: 'border-slate-200 text-slate-500 hover:text-slate-700'}"
				onclick={() => (showSugestoes = !showSugestoes)}
			>
				<Sparkles class="h-3.5 w-3.5" />
				Sugestões
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Calendar area -->
		<div class="flex-1 overflow-auto p-4">
			{#if loading}
				<div class="flex items-center justify-center h-64">
					<div class="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
				</div>
			{:else if viewMode === 'semanal'}
				<CalendarioSemanal
					{items}
					{currentDate}
					onNavigate={handleNavigate}
					onItemClick={handleItemClick}
					onSlotClick={handleSlotClick}
				/>
			{:else}
				<CalendarioMensal
					{items}
					{currentDate}
					onNavigate={handleNavigate}
					onDayClick={handleDayClick}
				/>
			{/if}
		</div>

		<!-- Painel sugestões -->
		{#if showSugestoes}
			<div class="w-[300px] border-l border-slate-100 bg-slate-50/50 p-4 overflow-y-auto">
				<PainelSugestoes
					{sugestoes}
					loading={loadingSugestoes}
					onAgendar={handleAgendar}
				/>
			</div>
		{/if}
	</div>
</div>

<!-- Sheet de criação/edição -->
<VisitaSheet
	bind:open={sheetOpen}
	visita={selectedVisita}
	profissionalId={agendarProfissionalId}
	profissionalNome={agendarProfissionalNome}
	defaultDateTime={defaultDateStr && defaultTimeStr ? `${defaultDateStr}T${defaultTimeStr}` : undefined}
	sessionToken={data.sessionToken}
	materiaisOptions={materiaisOptions}
	onclose={() => (sheetOpen = false)}
	onsave={() => { 
		loadItems(); 
		loadSugestoes(); 
	}}
	ondelete={handleVisitaDelete}
/>


