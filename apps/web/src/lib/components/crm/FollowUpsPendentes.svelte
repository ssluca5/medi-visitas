<script lang="ts">
  import { ArrowRight, FileText } from 'lucide-svelte';
  import type { VisaoGeralFollowUp } from '$lib/types';

  interface Props {
    followUps: VisaoGeralFollowUp[];
    oneditarvisita?: (visitaId: string) => void;
  }

  let { followUps, oneditarvisita }: Props = $props();

  function formatData(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  }
</script>

<div class="bg-white rounded-xl border border-[rgb(var(--slate-100))] p-5">
  <div class="flex items-center gap-2 mb-4">
    <ArrowRight class="w-4 h-4 text-amber-600" />
    <h3 class="text-xs font-bold text-[rgb(var(--slate-400))] uppercase tracking-widest">Follow-ups Pendentes</h3>
  </div>

  {#if followUps.length > 0}
    <div class="space-y-3">
      {#each followUps as fup}
        <button
          type="button"
          class="w-full text-left flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100 hover:border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
          onclick={() => oneditarvisita?.(fup.visitaId)}
        >
          <FileText class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div class="min-w-0">
            <p class="text-sm text-[rgb(var(--slate-700))]">{fup.acao}</p>
            <p class="text-xs text-[rgb(var(--slate-400))] mt-1">Visita de {formatData(fup.dataVisitaOrigem)}</p>
          </div>
        </button>
      {/each}
    </div>
  {:else}
    <p class="text-sm text-[rgb(var(--slate-400))] text-center py-4">Nenhum follow-up pendente</p>
  {/if}
</div>
