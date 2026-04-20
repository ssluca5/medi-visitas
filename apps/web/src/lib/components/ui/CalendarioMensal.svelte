<script lang="ts">
	import type { AgendaItem } from '$lib/types';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface Props {
		items: AgendaItem[];
		currentDate: Date;
		onNavigate: (date: Date) => void;
		onDayClick: (date: Date) => void;
	}

	let { items, currentDate, onNavigate, onDayClick }: Props = $props();

	function getLocalISODate(d: Date) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}


	let ano = $derived(currentDate.getFullYear());
	let mes = $derived(currentDate.getMonth());

	let primeiroDia = $derived(new Date(ano, mes, 1));
	let ultimoDia = $derived(new Date(ano, mes + 1, 0));

	// Grid começando na segunda-feira
	let diasGrid = $derived(() => {
		const dias: (Date | null)[] = [];
		let startDow = primeiroDia.getDay();
		startDow = startDow === 0 ? 6 : startDow - 1; // Monday = 0

		for (let i = 0; i < startDow; i++) {
			dias.push(null);
		}
		for (let d = 1; d <= ultimoDia.getDate(); d++) {
			dias.push(new Date(ano, mes, d));
		}
		// Pad final
		while (dias.length % 7 !== 0) {
			dias.push(null);
		}
		return dias;
	});

	let contagemPorDia = $derived.by(() => {
		const map = new Map<string, number>();
		for (const item of items) {
			const key = getLocalISODate(new Date(item.dataHoraInicio));
			map.set(key, (map.get(key) ?? 0) + 1);
		}
		return map;
	});

	function navMes(dir: number) {
		const next = new Date(currentDate);
		next.setMonth(next.getMonth() + dir);
		onNavigate(next);
	}

	function isHoje(d: Date): boolean {
		const hoje = new Date();
		return d.toISOString().slice(0, 10) === hoje.toISOString().slice(0, 10);
	}

	// Formata mês com capitalização correta: "Abril de 2026"
	function formatMonth(d: Date): string {
		const f = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
		const str = f.format(d);
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	const diasHeader = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
</script>

<div class="flex flex-col">
	<!-- Header navegação -->
	<div class="flex items-center justify-between mb-4">
		<button
			type="button"
			class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer"
			onclick={() => navMes(-1)}
			aria-label="Mês anterior"
		>
			<ChevronLeft class="h-5 w-5" />
		</button>
		<h3 class="text-lg font-bold text-[rgb(var(--slate-800))]">
			{formatMonth(currentDate)}
		</h3>
		<button
			type="button"
			class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer"
			onclick={() => navMes(1)}
			aria-label="Próximo mês"
		>
			<ChevronRight class="h-5 w-5" />
		</button>
	</div>

	<!-- Cabeçalho dias -->
	<div class="grid grid-cols-7 gap-px mb-1">
		{#each diasHeader as d}
			<div class="text-center text-[10px] uppercase tracking-wider font-semibold text-[rgb(var(--slate-400))] py-1">
				{d}
			</div>
		{/each}
	</div>

	<!-- Grade -->
	<div class="grid grid-cols-7 gap-px">
		{#each diasGrid() as dia}
			{#if dia}
				{@const key = getLocalISODate(dia)}
				{@const count = contagemPorDia.get(key) ?? 0}
				<button
					type="button"
					class="relative h-16 rounded-lg text-center p-1 transition-all duration-150 cursor-pointer
						{isHoje(dia)
						? 'bg-blue-50 border-2 border-blue-300'
						: 'bg-white border border-[rgb(var(--slate-100))] hover:bg-[rgb(var(--slate-50))] hover:border-[rgb(var(--slate-200))]'}"
					onclick={() => onDayClick(dia)}
				>
					<span
						class="text-xs font-semibold {isHoje(dia) ? 'text-blue-700' : 'text-[rgb(var(--slate-700))]'}"
					>
						{dia.getDate()}
					</span>
					{#if count > 0}
						<div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
							<span
								class="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-100 px-1 text-[9px] font-bold text-blue-700"
							>
								{count}
							</span>
						</div>
					{/if}
				</button>
			{:else}
				<div class="h-16"></div>
			{/if}
		{/each}
	</div>
</div>
