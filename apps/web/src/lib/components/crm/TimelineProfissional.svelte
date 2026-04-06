<script lang="ts">
  import { Calendar, TrendingUp, Clock } from 'lucide-svelte';
  import type { TimelineItem } from '$lib/types';

  interface Props {
    itens: TimelineItem[];
  }

  let { itens }: Props = $props();

  function formatData(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(iso));
  }

  function formatHora(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(iso));
  }

  const statusVisitaClass: Record<string, string> = {
    REALIZADA: 'bg-emerald-50 text-emerald-700',
    CANCELADA: 'bg-red-50 text-red-600',
    NAO_REALIZADA: 'bg-slate-100 text-slate-600',
    AGENDADA: 'bg-blue-50 text-blue-700'
  };

  const statusAgendaClass: Record<string, string> = {
    REALIZADO: 'bg-emerald-50 text-emerald-700',
    CANCELADO: 'bg-red-50 text-red-600',
    CONFIRMADO: 'bg-blue-50 text-blue-700',
    PLANEJADO: 'bg-slate-100 text-slate-600'
  };

  const estagioLabels: Record<string, string> = {
    PROSPECTADO: 'Prospectado',
    VISITADO: 'Visitado',
    INTERESSADO: 'Interessado',
    PRESCRITOR: 'Prescritor',
    FIDELIZADO: 'Fidelizado'
  };
</script>

{#if itens.length === 0}
  <div class="text-center py-12">
    <p class="text-sm text-slate-400">Nenhum evento no histórico</p>
  </div>
{:else}
  <div class="border-l-2 border-slate-100 ml-3 pl-6 space-y-5">
    {#each itens as item}
      <div class="relative">
        <!-- Dot indicator -->
        {#if item.tipo === 'VISITA'}
          <div class="absolute -left-[31px] top-[6px] w-3 h-3 rounded-full ring-4 ring-slate-50 shadow-sm
            {item.status === 'REALIZADA' ? 'bg-emerald-500' : item.status === 'CANCELADA' ? 'bg-red-500' : item.status === 'NAO_REALIZADA' ? 'bg-slate-500' : 'bg-blue-500'}
          "></div>
        {:else if item.tipo === 'ESTAGIO'}
          <div class="absolute -left-[31px] top-[6px] w-3 h-3 rounded-full ring-4 ring-slate-50 shadow-sm bg-violet-500"></div>
        {:else}
          <div class="absolute -left-[31px] top-[6px] w-3 h-3 rounded-full ring-4 ring-slate-50 shadow-sm bg-amber-500"></div>
        {/if}

        <!-- Card -->
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
          <!-- Header: icon + date -->
          <div class="flex items-center gap-2 mb-2">
            {#if item.tipo === 'VISITA'}
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
            {:else if item.tipo === 'ESTAGIO'}
              <TrendingUp class="w-3.5 h-3.5 text-violet-400" />
            {:else}
              <Clock class="w-3.5 h-3.5 text-amber-400" />
            {/if}
            <span class="text-[13px] font-semibold text-slate-700">
              {formatData(item.data)}
            </span>
            <span class="text-slate-300">·</span>
            <span class="text-[13px] text-slate-500">
              {formatHora(item.data)}
            </span>
          </div>

          {#if item.tipo === 'VISITA'}
            <div class="flex items-center gap-2 flex-wrap">
              {#if item.status}
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider {statusVisitaClass[item.status] ?? 'bg-slate-100 text-slate-600'}">
                  {item.status}
                </span>
              {/if}
              {#if item.duracaoMinutos}
                <span class="text-xs text-slate-400">{item.duracaoMinutos}min</span>
              {/if}
            </div>
            {#if item.objetivoVisita}
              <p class="text-[13px] text-slate-600 mt-1.5">{item.objetivoVisita}</p>
            {/if}
            {#if item.resumo}
              <p class="text-xs text-slate-500 mt-1">{item.resumo}</p>
            {/if}

          {:else if item.tipo === 'ESTAGIO'}
            <p class="text-[13px] text-slate-600">
              {#if item.estagioAnterior}
                <span class="text-slate-400">{estagioLabels[item.estagioAnterior] ?? item.estagioAnterior}</span>
                <span class="text-slate-300 mx-1">&rarr;</span>
              {/if}
              <span class="font-semibold text-violet-700">{estagioLabels[item.estagioNovo ?? ''] ?? item.estagioNovo}</span>
            </p>

          {:else if item.tipo === 'AGENDAMENTO'}
            <div class="flex items-center gap-2 flex-wrap">
              {#if item.status}
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider {statusAgendaClass[item.status] ?? 'bg-slate-100 text-slate-600'}">
                  {item.status}
                </span>
              {/if}
              {#if item.prioridade}
                <span class="text-xs font-semibold
                  {item.prioridade === 'URGENTE' ? 'text-red-600' : item.prioridade === 'ALTA' ? 'text-amber-600' : item.prioridade === 'MEDIA' ? 'text-blue-600' : 'text-slate-400'}
                ">{item.prioridade}</span>
              {/if}
            </div>
            {#if item.dataFim}
              <p class="text-xs text-slate-400 mt-1">até {formatHora(item.dataFim)}</p>
            {/if}
            {#if item.observacoes}
              <p class="text-xs text-slate-500 mt-1">{item.observacoes}</p>
            {/if}
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/if}
