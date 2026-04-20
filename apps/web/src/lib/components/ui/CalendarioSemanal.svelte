<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { AgendaItem } from '$lib/types';
	import AgendaItemCard from './AgendaItemCard.svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface Props {
		items: AgendaItem[];
		currentDate: Date;
		onNavigate: (date: Date) => void;
		onItemClick: (item: AgendaItem) => void;
		onSlotClick?: (date: Date, hour: number) => void;
	}

	let { items, currentDate, onNavigate, onItemClick, onSlotClick }: Props = $props();

	function getLocalISODate(d: Date) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}


	const HORA_INICIO = 7;
	const HORA_FIM = 19;
	const SLOT_HORAS = Array.from({ length: HORA_FIM - HORA_INICIO }, (_, i) => HORA_INICIO + i);

	// Tempo atual para a linha de hoje
	let agora = $state(new Date());
	let timerInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		timerInterval = setInterval(() => {
			agora = new Date();
		}, 60_000); // atualiza a cada minuto
	});

	onDestroy(() => {
		clearInterval(timerInterval);
	});

	// Calcula início da semana (segunda-feira)
	function getInicioSemana(d: Date): Date {
		const result = new Date(d);
		const day = result.getDay();
		const diff = day === 0 ? -6 : 1 - day;
		result.setDate(result.getDate() + diff);
		result.setHours(0, 0, 0, 0);
		return result;
	}

	let inicioSemana = $derived(getInicioSemana(currentDate));

	let diasSemana = $derived(
		Array.from({ length: 7 }, (_, i) => {
			const d = new Date(inicioSemana);
			d.setDate(d.getDate() + i);
			return d;
		})
	);

	let itemsPorDia = $derived.by(() => {
		const map = new Map<string, AgendaItem[]>();
		for (const d of diasSemana) {
			const key = getLocalISODate(d);
			map.set(key, []);
		}
		for (const item of items) {
			const key = getLocalISODate(new Date(item.dataHoraInicio));
			if (map.has(key)) {
				map.get(key)!.push(item);
			}
		}
		return map;
	});

	function navSemana(dir: number) {
		const next = new Date(currentDate);
		next.setDate(next.getDate() + dir * 7);
		onNavigate(next);
	}

	function isHoje(d: Date): boolean {
		const hoje = new Date();
		return d.toISOString().slice(0, 10) === hoje.toISOString().slice(0, 10);
	}

	const dayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
	const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit' });

	// Formata mês com "de" minúsculo: "abril de 2026" → capitaliza só primeira letra
	function formatMonth(d: Date): string {
		const f = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
		const str = f.format(d); // "abril de 2026"
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function getItemsParaHora(dia: Date, hora: number): AgendaItem[] {
		const key = getLocalISODate(dia);
		const allItems = itemsPorDia.get(key) ?? [];
		return allItems.filter((item) => {
			const h = new Date(item.dataHoraInicio).getHours();
			return h === hora;
		});
	}

	// Posição da linha do tempo atual (percentual dentro do slot de hora)
	function getCurrentTimePosition(hora: number): number | null {
		const h = agora.getHours();
		const m = agora.getMinutes();
		if (h !== hora) return null;
		return (m / 60) * 100;
	}


</script>

<div class="flex flex-col h-full">
	<!-- Header: navegação -->
	<div class="flex items-center justify-between px-1 mb-4">
		<button
			type="button"
			class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer"
			onclick={() => navSemana(-1)}
			aria-label="Semana anterior"
		>
			<ChevronLeft class="h-5 w-5" />
		</button>
		<h3 class="text-lg font-bold text-[rgb(var(--slate-800))]">
			{formatMonth(currentDate)}
		</h3>
		<button
			type="button"
			class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer"
			onclick={() => navSemana(1)}
			aria-label="Próxima semana"
		>
			<ChevronRight class="h-5 w-5" />
		</button>
	</div>

	<!-- Grade semanal -->
	<div class="flex-1 overflow-auto">
		<div class="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] min-w-[720px]">
			<!-- Cabeçalho dos dias -->
			<div class="sticky top-0 z-10 bg-white border-b border-[rgb(var(--slate-100))]"></div>
			{#each diasSemana as dia}
				<div
					class="sticky top-0 z-10 bg-white border-b border-[rgb(var(--slate-100))] text-center py-2.5 px-1"
				>
					<p
						class="text-[10px] uppercase tracking-wider font-semibold
							{isHoje(dia) ? 'text-blue-600 font-bold' : 'text-[rgb(var(--slate-400))]'}"
					>
						{dayFormatter.format(dia)}
					</p>
					<div class="flex items-center justify-center mt-1">
						{#if isHoje(dia)}
							<span
								class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm"
							>
								{dateFormatter.format(dia)}
							</span>
						{:else}
							<span class="text-sm font-bold text-[rgb(var(--slate-700))]">
								{dateFormatter.format(dia)}
							</span>
						{/if}
					</div>
				</div>
			{/each}

			<!-- Slots de horas -->
			{#each SLOT_HORAS as hora}
				<!-- Eixo de hora: alinhado ao centro da linha divisória -->
				<div
					class="relative border-r border-[rgb(var(--slate-100))] pr-3 text-right"
					style="height: 120px;"
				>
					<span
						class="absolute top-1 right-3 text-[11px] font-medium text-[rgb(var(--slate-400))] tabular-nums"
					>
						{String(hora).padStart(2, '0')}:00
					</span>
				</div>
				{#each diasSemana as dia, diaIdx}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="relative border-b border-r border-[rgb(var(--slate-100))] p-1 flex flex-col gap-1 transition-colors duration-150 cursor-pointer
							{isHoje(dia) ? 'bg-blue-50/30' : ''}
							hover:bg-blue-50/50 hover:z-10"
						style="height: 120px;"
						onclick={(e) => { 
							if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('absolute')) {
								onSlotClick?.(dia, hora);
							}
						}}
					>
						<!-- Linha do tempo atual -->
						{#if isHoje(dia)}
							{@const pos = getCurrentTimePosition(hora)}
							{#if pos !== null}
								<div
									class="absolute left-0 right-0 z-20 pointer-events-none"
									style="top: {pos}%;"
								>
									<div class="relative flex items-center">
										<!-- Bolinha -->
										<div
											class="absolute -left-[5px] w-[10px] h-[10px] rounded-full bg-red-500 shadow-sm"
										></div>
										<!-- Linha -->
										<div class="w-full h-[2px] bg-red-500/80"></div>
									</div>
								</div>
							{/if}
						{/if}

						{#each getItemsParaHora(dia, hora) as item}
							<AgendaItemCard {item} onclick={() => onItemClick(item)} />
						{/each}
					</div>
				{/each}
			{/each}
		</div>
	</div>
</div>
