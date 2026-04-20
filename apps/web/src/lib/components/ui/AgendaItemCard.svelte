<script lang="ts">
	import type { AgendaItem, PrioridadeAgenda, StatusAgenda } from '$lib/types';
	import { Clock } from 'lucide-svelte';

	interface Props {
		item: AgendaItem;
		onclick?: () => void;
	}

	let { item, onclick }: Props = $props();

	const prioridadeCores: Record<PrioridadeAgenda, string> = {
		URGENTE: 'rgb(239 68 68)',
		ALTA: 'rgb(245 158 11)',
		MEDIA: 'rgb(59 130 246)',
		BAIXA: 'rgb(148 163 184)'
	};

	const statusLabels: Record<StatusAgenda, string> = {
		PLANEJADO: 'Planejado',
		CONFIRMADO: 'Confirmado',
		REALIZADO: 'Realizado',
		CANCELADO: 'Cancelado'
	};

	const statusColors: Record<StatusAgenda, string> = {
		PLANEJADO: 'bg-blue-50 text-blue-700',
		CONFIRMADO: 'bg-emerald-50 text-emerald-700',
		REALIZADO: 'bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-600))]',
		CANCELADO: 'bg-red-50 text-red-600'
	};

	let horaInicio = $derived(
		new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
			new Date(item.dataHoraInicio)
		)
	);

	let horaFim = $derived(
		new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
			new Date(item.dataHoraFim)
		)
	);

	let duracaoPx = $derived.by(() => {
		const diffMs = new Date(item.dataHoraFim).getTime() - new Date(item.dataHoraInicio).getTime();
		const minutos = Math.max(1, diffMs / 60000);
		// 1 minuto = 2px (já que 60min = 120px no CalendarioSemanal)
		// Vamos garantir no mínimo 75px para o conteúdo do cartão não quebrar
		return Math.max(minutos * 2, 75);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="group relative z-10 shrink-0 rounded-lg bg-white border border-[rgb(var(--slate-200))] p-3 cursor-pointer will-change-transform transition-all duration-200 ease-out hover:-translate-y-[1px] shadow-sm hover:shadow-md hover:z-20 active:scale-[0.98] overflow-hidden"
	style="border-left: 3px solid {prioridadeCores[item.prioridade]}; height: {duracaoPx}px;"
	{onclick}
>
	<div class="flex items-start justify-between gap-2">
		<div class="min-w-0 flex-1">
			<p class="text-[13px] font-semibold text-[rgb(var(--slate-800))] truncate">
				{item.profissional?.nome ?? 'Profissional'}
			</p>
			{#if item.profissional?.especialidade}
				<p class="text-[10px] uppercase tracking-wider text-[rgb(var(--slate-400))] font-medium mt-0.5">
					{item.profissional.especialidade.nome}
				</p>
			{/if}
		</div>
		<span
			class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold {statusColors[item.status]}"
		>
			{statusLabels[item.status]}
		</span>
	</div>

	<div class="mt-2 flex items-center gap-1.5 text-[11px] text-[rgb(var(--slate-500))]">
		<Clock class="h-3 w-3 text-[rgb(var(--slate-400))]" />
		<span class="font-medium">{horaInicio} – {horaFim}</span>
	</div>

	{#if item.observacoes}
		<p class="mt-1.5 text-[11px] text-[rgb(var(--slate-400))] truncate">{item.observacoes}</p>
	{/if}
</div>
