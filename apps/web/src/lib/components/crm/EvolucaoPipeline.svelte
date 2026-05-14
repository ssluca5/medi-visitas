<script lang="ts">
  import { TrendingUp } from 'lucide-svelte';
  import type { VisaoGeralPipeline } from '$lib/types';

  interface Props {
    pipeline: VisaoGeralPipeline | null;
  }

  let { pipeline }: Props = $props();

  const estagioLabels: Record<string, string> = {
    PROSPECTADO: 'Prospectado',
    VISITADO: 'Visitado',
    INTERESSADO: 'Interessado',
    PRESCRITOR: 'Prescritor',
    FIDELIZADO: 'Fidelizado',
  };
</script>

<div class="bg-white rounded-xl border border-[rgb(var(--slate-100))] p-5">
  <div class="flex items-center gap-2 mb-4">
    <TrendingUp class="w-4 h-4 text-violet-600" />
    <h3 class="eyebrow-text">Evolução no Pipeline</h3>
  </div>

  {#if pipeline}
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-sm text-ui-secondary">Estágio atual</span>
        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-violet-50 text-violet-700">
          {estagioLabels[pipeline.estagioAtual] ?? pipeline.estagioAtual}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-ui-secondary">Neste estágio há</span>
        <span class="text-sm font-semibold text-ui-strong">
          {pipeline.historico.length > 0 ? `${pipeline.historico[pipeline.historico.length - 1].dias} dias` : '--'}
        </span>
      </div>
      <hr class="border-[rgb(var(--slate-100))]" />
      <p class="eyebrow-text mb-2">Histórico</p>
      {#each pipeline.historico as etapa}
        <div class="flex justify-between items-center">
          <span class="text-sm text-ui-secondary">{estagioLabels[etapa.estagio] ?? etapa.estagio}</span>
          <span class="text-xs text-ui-muted">{etapa.dias > 0 ? `${etapa.dias} dias` : '--'}</span>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-sm text-ui-muted text-center py-4">Sem histórico de pipeline</p>
  {/if}
</div>