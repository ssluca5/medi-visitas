<script lang="ts">
  import { Package } from 'lucide-svelte';
  import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
  import type { Visita } from '$lib/types';

  interface Props {
    visitas: Visita[];
  }

  let { visitas }: Props = $props();

  const visitasComMateriais = $derived(
    visitas.filter((v) => v.materiais && v.materiais.length > 0)
  );

  const totaisPorMaterial = $derived.by(() => {
    const map = new Map<string, { nome: string; quantidade: number }>();
    for (const v of visitasComMateriais) {
      for (const m of v.materiais) {
        const nome = m.materialTecnico?.nome ?? m.materialTecnicoId;
        const existing = map.get(m.materialTecnicoId);
        if (existing) {
          existing.quantidade += m.quantidade;
        } else {
          map.set(m.materialTecnicoId, { nome, quantidade: m.quantidade });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.quantidade - a.quantidade);
  });

  function formatData(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  }
</script>

<div class="space-y-6">
  {#if visitasComMateriais.length === 0}
    <div class="text-center py-20 bg-white rounded-xl border border-dashed border-[rgb(var(--slate-200))]">
      <div class="flex justify-center mb-4">
        <div class="bg-[rgb(var(--slate-100))] p-3 rounded-full">
          <Package class="w-7 h-7 text-[rgb(var(--slate-400))]" />
        </div>
      </div>
      <p class="text-sm font-medium text-[rgb(var(--slate-600))]">Nenhum material registrado</p>
      <p class="text-xs text-[rgb(var(--slate-400))] mt-1">Os materiais entregues nas visitas aparecerão aqui.</p>
    </div>
  {:else}
    <div class="bg-white rounded-xl border border-[rgb(var(--slate-100))] p-5">
      <div class="flex items-center gap-2 mb-4">
        <Package class="w-4 h-4 text-indigo-600" />
        <h3 class="text-xs font-bold text-[rgb(var(--slate-400))] uppercase tracking-widest">Total Acumulado</h3>
      </div>
      <div class="space-y-2">
        {#each totaisPorMaterial as mat}
          <div class="flex justify-between items-center">
            <span class="text-sm text-[rgb(var(--slate-600))]">{mat.nome}</span>
            <span class="text-sm font-semibold text-[rgb(var(--slate-800))] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">{mat.quantidade}x</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[rgb(var(--slate-100))] p-5">
      <h3 class="text-xs font-bold text-[rgb(var(--slate-400))] uppercase tracking-widest mb-4">Por Visita</h3>
      <div class="space-y-4">
        {#each visitasComMateriais as visita}
          <div class="border border-[rgb(var(--slate-100))] rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-[rgb(var(--slate-700))]">{formatData(visita.dataVisita)}</span>
              <StatusVisitaBadge status={visita.status} />
            </div>
            <div class="flex flex-wrap gap-2">
              {#each visita.materiais as vm}
                <span class="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-md">
                  {vm.quantidade}x {vm.materialTecnico?.nome ?? 'Material'}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
