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
    <h3 class="eyebrow-text">Frequência & Intervalo</h3>
  </div>

  {#if frequencia}
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-sm text-ui-secondary">Média mensal</span>
        <span class="text-sm font-semibold text-ui-strong">{frequencia.mediaMensal} visitas/mês</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-ui-secondary">Maior intervalo</span>
        <span class="text-sm font-semibold text-ui-strong">{frequencia.maiorIntervalo} dias</span>
      </div>
      <hr class="border-[rgb(var(--slate-100))]" />
      <div class="flex justify-between">
        <span class="text-sm text-ui-secondary">Últimos 30 dias</span>
        <span class="text-sm font-semibold text-ui-strong">{frequencia.ultimos30d} visitas</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-ui-secondary">Últimos 60 dias</span>
        <span class="text-sm font-semibold text-ui-strong">{frequencia.ultimos60d} visitas</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-ui-secondary">Últimos 90 dias</span>
        <span class="text-sm font-semibold text-ui-strong">{frequencia.ultimos90d} visitas</span>
      </div>
    </div>
  {:else}
    <p class="text-sm text-ui-muted text-center py-4">Sem dados de frequência</p>
  {/if}
</div>