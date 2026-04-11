<script lang="ts">
  import { Clock } from 'lucide-svelte';
  import type { StatusAgenda, PrioridadeAgenda } from '$lib/types';

  interface Props {
    agendamentos: Array<{
      id: string;
      dataHoraInicio: string;
      dataHoraFim: string;
      status: StatusAgenda;
      prioridade: PrioridadeAgenda;
      profissional: {
        nome: string;
        especialidade: { nome: string } | null;
      } | null;
    }>;
  }

  let { agendamentos }: Props = $props();

  function formatHora(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  }

  function formatData(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(iso));
  }

  const prioridadeBadge: Record<string, string> = {
    URGENTE: 'bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold ml-2',
    ALTA: 'bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold ml-2',
    MEDIA: 'bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold ml-2',
    BAIXA: 'bg-slate-50 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold ml-2'
  };
</script>

<div class="card-surface p-5 h-full">
  <h3 class="text-sm font-semibold text-slate-700 mb-4">Próximos Agendamentos</h3>

  {#if agendamentos.length === 0}
    <div class="text-center py-8">
      <p class="text-sm text-slate-400">Nenhum agendamento futuro</p>
    </div>
  {:else}
    <div class="space-y-2.5">
      {#each agendamentos as ag}
        <div
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group"
        >
          <div class="flex-shrink-0 w-12 text-center">
            <span class="text-[13px] font-bold text-violet-600">{formatHora(ag.dataHoraInicio)}</span>
            <span class="block text-[10px] text-slate-400 mt-0.5">{formatData(ag.dataHoraInicio)}</span>
          </div>
          <div class="min-w-0 border-l border-slate-100 pl-3 flex-1">
            <p class="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">
              {ag.profissional?.nome ?? 'Sem profissional'}
            </p>
            <p class="text-[11px] text-slate-400 truncate">
              {ag.profissional?.especialidade?.nome ?? ''}
              {#if ag.prioridade}
                <span class="{prioridadeBadge[ag.prioridade] ?? prioridadeBadge.BAIXA}">{ag.prioridade}</span>
              {/if}
            </p>
          </div>
          <Clock class="h-3.5 w-3.5 text-slate-300 shrink-0" />
        </div>
      {/each}
    </div>
  {/if}
</div>
