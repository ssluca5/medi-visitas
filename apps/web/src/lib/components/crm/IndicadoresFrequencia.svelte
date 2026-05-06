<script lang="ts">
  import { Calendar } from 'lucide-svelte';
  import type { VisaoGeralFrequencia } from '$lib/types';

  interface Props {
    frequencia: VisaoGeralFrequencia | null;
  }

  let { frequencia }: Props = $props();
</script>

<div class="bg-white rounded-xl border border-[rgb(var(--slate-100))] p-5">
  <div class="flex items-center gap-2 mb-4">
    <Calendar class="w-4 h-4 text-emerald-600" />
    <h3 class="text-xs font-bold text-[rgb(var(--slate-400))] uppercase tracking-widest">Frequência & Intervalo</h3>
  </div>

  {#if frequencia}
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-sm text-[rgb(var(--slate-500))]">Média mensal</span>
        <span class="text-sm font-semibold text-[rgb(var(--slate-800))]">{frequencia.mediaMensal} visitas/mês</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-[rgb(var(--slate-500))]">Maior intervalo</span>
        <span class="text-sm font-semibold text-[rgb(var(--slate-800))]">{frequencia.maiorIntervalo} dias</span>
      </div>
      <hr class="border-[rgb(var(--slate-100))]" />
      <div class="flex justify-between">
        <span class="text-sm text-[rgb(var(--slate-500))]">Últimos 30 dias</span>
        <span class="text-sm font-semibold text-[rgb(var(--slate-800))]">{frequencia.ultimos30d} visitas</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-[rgb(var(--slate-500))]">Últimos 60 dias</span>
        <span class="text-sm font-semibold text-[rgb(var(--slate-800))]">{frequencia.ultimos60d} visitas</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-[rgb(var(--slate-500))]">Últimos 90 dias</span>
        <span class="text-sm font-semibold text-[rgb(var(--slate-800))]">{frequencia.ultimos90d} visitas</span>
      </div>
    </div>
  {:else}
    <p class="text-sm text-[rgb(var(--slate-400))] text-center py-4">Sem dados de frequência</p>
  {/if}
</div>