<script lang="ts">
  import type { PipelineResponse, EstagioPipeline, Profissional } from '$lib/types';
  import { Search, X, GripVertical } from 'lucide-svelte';

  interface Props {
    pipeline: PipelineResponse | null;
    busca: string;
    onBuscaChange: (value: string) => void;
    onMove: (profissionalId: string, origem: EstagioPipeline, destino: EstagioPipeline) => void;
  }

  let { pipeline, busca, onBuscaChange, onMove }: Props = $props();

  const COLUNAS: { key: EstagioPipeline; label: string; cssVar: string }[] = [
    { key: 'PROSPECTADO', label: 'Prospectado', cssVar: '--pipeline-prospectado' },
    { key: 'VISITADO', label: 'Visitado', cssVar: '--pipeline-visitado' },
    { key: 'INTERESSADO', label: 'Interessado', cssVar: '--pipeline-interessado' },
    { key: 'PRESCRITOR', label: 'Prescritor', cssVar: '--pipeline-prescritor' },
    { key: 'FIDELIZADO', label: 'Fidelizado', cssVar: '--pipeline-fidelizado' },
  ];

  function potencialBadge(potencial: string) {
    switch (potencial) {
      case 'ALTO': return 'bg-emerald-100 text-emerald-800';
      case 'MEDIO': return 'bg-amber-100 text-amber-800';
      case 'BAIXO': return 'bg-orange-100 text-orange-800';
      case 'ESTRATEGICO': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-500))]';
    }
  }

  // Drag state
  let dragProfId = $state<string | null>(null);
  let dragOrigem = $state<EstagioPipeline | null>(null);
  let dropTarget = $state<EstagioPipeline | null>(null);

  function handleDragStart(e: DragEvent, prof: Profissional, colKey: EstagioPipeline) {
    dragProfId = prof.id;
    dragOrigem = colKey;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', prof.id);
    }
  }

  function handleDragEnd() {
    dragProfId = null;
    dragOrigem = null;
    dropTarget = null;
  }

  function handleDragOver(e: DragEvent, colKey: EstagioPipeline) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    dropTarget = colKey;
  }

  function handleDragLeave(e: DragEvent, colKey: EstagioPipeline) {
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !related.closest(`[data-col="${colKey}"]`)) {
      if (dropTarget === colKey) dropTarget = null;
    }
  }

  function handleDrop(e: DragEvent, colKey: EstagioPipeline) {
    e.preventDefault();
    dropTarget = null;
    if (dragProfId && dragOrigem && dragOrigem !== colKey) {
      onMove(dragProfId, dragOrigem, colKey);
    }
    dragProfId = null;
    dragOrigem = null;
  }

  function handleCardClick(e: MouseEvent, profId: string) {
    // Don't navigate if we just finished a drag
    if (dragProfId) {
      e.preventDefault();
      return;
    }
    window.location.href = `/dashboard/profissionais/${profId}`;
  }

</script>

<div class="mb-4">
  <div class="relative">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate-400))]" />
    <input
      type="text"
      placeholder="Buscar por nome ou CRM..."
      value={busca}
      oninput={(e) => onBuscaChange((e.target as HTMLInputElement).value)}
      class="w-full pl-10 pr-8 h-9 rounded-lg border border-[rgb(var(--slate-200))] bg-white text-sm text-[rgb(var(--slate-700))] placeholder:text-[rgb(var(--slate-400))] focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
    />
    {#if busca}
      <button
        onclick={() => onBuscaChange('')}
        class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded hover:bg-[rgb(var(--slate-100))]"
      >
        <X class="h-3.5 w-3.5 text-[rgb(var(--slate-400))]" />
      </button>
    {/if}
  </div>
</div>

<div class="flex gap-3 h-[calc(100vh-350px)] min-h-[400px] overflow-x-auto">
  {#each COLUNAS as col}
    {@const profissionais = pipeline?.data[col.key] ?? []}
    {@const total = pipeline?.totaisPorEstagio[col.key] ?? 0}
    <div
      class="flex-1 min-w-[160px] flex flex-col rounded-xl {dropTarget === col.key ? 'bg-blue-50/60 ring-2 ring-blue-300 ring-inset' : ''}"
      data-col={col.key}
      role="region"
      ondragover={(e) => handleDragOver(e, col.key)}
      ondragleave={(e) => handleDragLeave(e, col.key)}
      ondrop={(e) => handleDrop(e, col.key)}
    >
      <!-- Column header -->
      <div class="h-10 flex items-center justify-between px-3 mb-2 flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="h-2.5 w-2.5 rounded-full flex-shrink-0" style="background-color: var({col.cssVar})"></div>
          <span class="text-[12px] font-semibold text-[rgb(var(--slate-700))]">{col.label}</span>
          <span class="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-500))]">{total}</span>
        </div>
      </div>

      {#if profissionais.length === 0}
        <!-- Empty state — same height as one card -->
        <div class="flex items-center justify-center h-[84px] rounded-lg border border-dashed border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))]/50 mx-0.5 {dropTarget === col.key ? 'border-blue-300 bg-blue-50/40' : ''}">
          <p class="text-[11px] text-[rgb(var(--slate-400))]">
            {dropTarget === col.key ? 'Solte aqui' : 'Nenhum profissional'}
          </p>
        </div>
      {:else}
        <!-- Cards list -->
        <div class="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
          {#each profissionais as prof}
            {@const isDragging = dragProfId === prof.id}
            <div
              role="button"
              tabindex="0"
              draggable="true"
              ondragstart={(e: DragEvent) => handleDragStart(e, prof, col.key)}
              ondragend={handleDragEnd}
              onclick={(e: MouseEvent) => handleCardClick(e, prof.id)}
              onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') window.location.href = `/dashboard/profissionais/${prof.id}`; }}
              class="text-left w-full rounded-lg border border-[rgb(var(--slate-200))] bg-white hover:border-[rgb(var(--slate-300))] px-3 py-2.5 min-h-[80px] flex flex-col justify-between cursor-grab select-none will-change-transform transition-all duration-200 hover:shadow-sm {isDragging ? 'opacity-40 scale-95' : ''}"
            >
              <!-- Linha 1: Nome + Grip -->
              <div class="flex items-start gap-1.5">
                <GripVertical class="h-3.5 w-3.5 text-[rgb(var(--slate-300))] mt-0.5 shrink-0" />
                <p class="text-[13px] font-medium text-[rgb(var(--slate-800))] leading-snug min-w-0 flex-1">{prof.nome}</p>
              </div>

              <!-- Linha 2: Especialidade + Badge Potencial -->
              <div class="flex items-center justify-between mt-2 gap-1 pl-5">
                <p class="text-[10px] text-[rgb(var(--slate-400))] truncate flex-1">
                  {prof.especialidade?.nome ?? '—'}
                </p>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 {potencialBadge(prof.potencial)}">
                  {prof.potencial}
                </span>
              </div>

              <!-- Linha 3: CRM -->
              <p class="text-[10px] text-[rgb(var(--slate-400))] mt-1 pl-5">
                CRM {prof.crm ?? '—'}
              </p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>
