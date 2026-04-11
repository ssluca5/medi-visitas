<script lang="ts">
	import type { SugestaoProfissional, PotencialPrescricao } from '$lib/types';
	import { CalendarPlus, TrendingUp, Clock } from 'lucide-svelte';

	interface Props {
		sugestoes: SugestaoProfissional[];
		onAgendar: (profissionalId: string) => void;
		loading?: boolean;
	}

	let { sugestoes, onAgendar, loading = false }: Props = $props();

	const potencialLabels: Record<PotencialPrescricao, string> = {
		ESTRATEGICO: 'Estratégico',
		ALTO: 'Alto',
		MEDIO: 'Médio',
		BAIXO: 'Baixo'
	};

	const potencialColors: Record<PotencialPrescricao, string> = {
		ESTRATEGICO: 'bg-violet-50 text-violet-700 ring-1 ring-violet-300',
		ALTO: 'bg-amber-50 text-amber-700 ring-1 ring-amber-300',
		MEDIO: 'bg-blue-50 text-blue-700 ring-1 ring-blue-300',
		BAIXO: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200'
	};

	function formatDias(dias: number | null): string {
		if (dias === null) return 'Nunca visitado';
		if (dias === 0) return 'Hoje';
		if (dias === 1) return '1 dia';
		return `${dias} dias`;
	}
</script>

<div class="flex flex-col h-full">
	<div class="flex items-center gap-2 mb-4">
		<div
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50"
		>
			<TrendingUp class="h-4 w-4 text-blue-600" />
		</div>
		<div>
			<h3 class="text-sm font-semibold text-slate-800">Sugestões</h3>
			<p class="text-[10px] text-slate-400">Quem você deve visitar</p>
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center py-8">
			<div
				class="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"
			></div>
		</div>
	{:else if sugestoes.length === 0}
		<div class="text-center py-8">
			<p class="text-sm text-slate-400">Nenhuma sugestão disponível</p>
		</div>
	{:else}
		<div class="space-y-3 flex-1 overflow-y-auto">
			{#each sugestoes.slice(0, 10) as sug}
				<div
					class="group bg-white border border-slate-200 shadow-sm rounded-xl p-4 
						transition-all duration-200 ease-out 
						hover:-translate-y-[2px] hover:shadow-md hover:border-slate-300"
				>
					<div class="flex items-start justify-between gap-2">
						<div class="min-w-0 flex-1">
							<p
								class="text-[13px] font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors"
							>
								{sug.profissional.nome}
							</p>
							{#if sug.profissional.especialidade}
								<p class="text-[10px] text-slate-400 mt-0.5 truncate">
									{sug.profissional.especialidade.nome}
								</p>
							{/if}
						</div>
						<div
							class="flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-600"
							title="Pontuação de prioridade"
						>
							<TrendingUp class="h-2.5 w-2.5" />
							{sug.pontuacao}
						</div>
					</div>

					<div class="mt-2 flex items-center gap-3">
						<span
							class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold {potencialColors[sug.profissional.potencial]}"
						>
							{potencialLabels[sug.profissional.potencial]}
						</span>
						<span class="flex items-center gap-1 text-[10px] text-slate-400">
							<Clock class="h-2.5 w-2.5" />
							{formatDias(sug.diasSemVisita)}
						</span>
					</div>

					<!-- Botão Ghost Primário -->
					<button
						type="button"
						class="flex w-full items-center justify-center gap-1.5 
							text-blue-600 bg-blue-50 hover:bg-blue-100 
							mt-3 py-2 rounded-lg font-medium text-[12px]
							transition-colors duration-200 ease-out 
							active:scale-[0.98] cursor-pointer"
						onclick={() => onAgendar(sug.profissional.id)}
					>
						<CalendarPlus class="h-3.5 w-3.5" />
						Agendar Visita
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
