<script lang="ts">
  import type { EstagioPipeline } from '$lib/types';

  interface Props {
    totaisPorEstagio: Record<EstagioPipeline, number> | null;
  }

  let { totaisPorEstagio }: Props = $props();

  const ETAPAS: { key: EstagioPipeline; label: string; cssVar: string }[] = [
    { key: 'PROSPECTADO', label: 'Prospectado', cssVar: '--pipeline-prospectado' },
    { key: 'VISITADO', label: 'Visitado', cssVar: '--pipeline-visitado' },
    { key: 'INTERESSADO', label: 'Interessado', cssVar: '--pipeline-interessado' },
    { key: 'PRESCRITOR', label: 'Prescritor', cssVar: '--pipeline-prescritor' },
    { key: 'FIDELIZADO', label: 'Fidelizado', cssVar: '--pipeline-fidelizado' },
  ];

  const total = $derived(
    totaisPorEstagio
      ? Object.values(totaisPorEstagio).reduce((a, b) => a + b, 0)
      : 0
  );
</script>

<div class="card-surface p-5">
  <h3 class="text-sm font-semibold text-[rgb(var(--slate-700))] mb-4">Funil de Conversão</h3>
  <div class="grid grid-cols-5 gap-4">
    {#each ETAPAS as etapa}
      {@const count = totaisPorEstagio?.[etapa.key] ?? 0}
      {@const pct = total > 0 ? Math.round((count / total) * 100) : 0}
      <div class="flex flex-col items-center gap-2">
        <span class="text-[11px] font-medium text-[rgb(var(--slate-500))] truncate w-full text-center">{etapa.label}</span>
        <span class="text-2xl font-bold text-[rgb(var(--slate-800))]">{pct}%</span>
        <span class="text-[11px] text-[rgb(var(--slate-400))]">{count} prof.</span>
        <div class="w-full h-2 bg-[rgb(var(--slate-100))] rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-[width] duration-500 ease-out"
            style="width: {pct}%; background-color: var({etapa.cssVar})"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>
