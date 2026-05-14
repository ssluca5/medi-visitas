<script lang="ts">
  import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
  import type { VisaoGeralResumo } from '$lib/types';

  interface Props {
    resumo: VisaoGeralResumo | null;
  }

  let { resumo }: Props = $props();

  const tendenciaIcon: Record<string, any> = {
    crescendo: TrendingUp,
    estavel: Minus,
    caindo: TrendingDown,
  };

  const tendenciaColor: Record<string, string> = {
    crescendo: 'text-emerald-600',
    estavel: 'text-amber-600',
    caindo: 'text-red-600',
  };

  const tendenciaLabel: Record<string, string> = {
    crescendo: 'Crescendo',
    estavel: 'Estável',
    caindo: 'Caindo',
  };
</script>

<div class="bg-white rounded-xl border border-[rgb(var(--slate-100))] p-5">
  <div class="flex items-center gap-2 mb-4">
    <Activity class="w-4 h-4 text-blue-600" />
    <h3 class="eyebrow-text">Resumo do Relacionamento</h3>
  </div>

  {#if resumo}
    <div class="grid grid-cols-4 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-ui-primary">{resumo.totalVisitas}</div>
        <div class="text-[11px] text-ui-muted mt-0.5">total de visitas</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-ui-primary">{resumo.frequenciaMensal}</div>
        <div class="text-[11px] text-ui-muted mt-0.5">visitas/mês</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-ui-primary">{resumo.diasSemVisita}</div>
        <div class="text-[11px] text-ui-muted mt-0.5">dias sem visita</div>
      </div>
      <div class="text-center">
        {#if resumo.tendencia}
          {@const Icon = tendenciaIcon[resumo.tendencia] ?? Minus}
          <div class="flex items-center justify-center gap-1">
            <Icon class="w-4 h-4 {tendenciaColor[resumo.tendencia] ?? ''}" />
            <span class="text-sm font-semibold {tendenciaColor[resumo.tendencia] ?? ''}">
              {tendenciaLabel[resumo.tendencia] ?? resumo.tendencia}
            </span>
          </div>
        {:else}
          <div class="text-sm text-ui-disabled">--</div>
        {/if}
        <div class="text-[11px] text-ui-muted mt-0.5">tendência</div>
      </div>
    </div>
  {:else}
    <p class="text-sm text-ui-muted text-center py-4">Nenhuma visita registrada ainda</p>
  {/if}
</div>
