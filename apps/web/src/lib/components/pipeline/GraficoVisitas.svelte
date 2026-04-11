<script lang="ts">
  import type { VisitasPeriodo } from '$lib/types';

  interface Props {
    dados: VisitasPeriodo[];
  }

  let { dados }: Props = $props();

  const BAR_GROUP_WIDTH = 52;
  const BAR_WIDTH = 12;
  const GAP = 4;
  const HEIGHT = 300;
  const PADDING = { top: 16, bottom: 34, left: 10, right: 10 };

  const chartH = HEIGHT - PADDING.top - PADDING.bottom;

  const maxValor = $derived(
    Math.max(1, ...dados.map((d) => Math.max(d.REALIZADA, d.AGENDADA, d.CANCELADA)))
  );

  const svgWidth = $derived(Math.max(400, dados.length * (BAR_GROUP_WIDTH + GAP * 3) + PADDING.left + PADDING.right));

  const COLORS = {
    REALIZADA: '#2563eb',
    AGENDADA: '#bae6fd',
    CANCELADA: '#94a3b8',
  };

  // Tooltip state
  let tooltip = $state<{ x: number; y: number; d: VisitasPeriodo; side: 'above' | 'below' } | null>(null);
  let containerEl = $state<HTMLDivElement | null>(null);
  let svgEl = $state<SVGSVGElement | null>(null);

  function hitTest(e: MouseEvent): { d: VisitasPeriodo; side: 'above' | 'below' } | null {
    if (!svgEl || !containerEl || dados.length === 0) return null;

    const svgRect = svgEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    // Mouse position relative to SVG rendered area
    const mx = e.clientX - svgRect.left;

    // Scale from rendered SVG pixels to SVG viewBox coordinates
    const scaleX = svgWidth / svgRect.width;
    const svgX = mx * scaleX;

    // Check which bar group this x falls into
    for (let i = 0; i < dados.length; i++) {
      const x = PADDING.left + i * (BAR_GROUP_WIDTH + GAP * 3) + GAP * 2;
      if (svgX >= x - GAP && svgX <= x + BAR_GROUP_WIDTH + GAP) {
        const containerY = e.clientY - containerRect.top;
        return {
          d: dados[i],
          side: containerY < 80 ? 'below' : 'above',
        };
      }
    }
    return null;
  }

  function handleContainerMouseMove(e: MouseEvent) {
    const hit = hitTest(e);
    if (hit && containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      tooltip = {
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top,
        d: hit.d,
        side: hit.side,
      };
    } else {
      tooltip = null;
    }
  }

  function handleContainerMouseLeave() {
    tooltip = null;
  }
</script>

<div class="card-surface p-5">
  <div class="mb-4">
    <h3 class="text-base font-bold text-slate-800">Visitas por Período</h3>
    <p class="text-xs text-slate-500 mt-1">Comparativo de status ao longo das semanas</p>
  </div>
  {#if dados.length === 0}
    <div class="flex items-center justify-center h-[300px] rounded-lg border border-dashed border-slate-200">
      <p class="text-[11px] text-slate-400">Sem dados para o período selecionado</p>
    </div>
  {:else}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={containerEl}
      class="overflow-x-auto relative h-[300px]"
      onmousemove={handleContainerMouseMove}
      onmouseleave={handleContainerMouseLeave}
    >
      <svg bind:this={svgEl} width={svgWidth} height={HEIGHT} class="block w-full h-full" viewBox="0 0 {svgWidth} {HEIGHT}" preserveAspectRatio="xMidYMid meet">
        <!-- Grid lines — dashed, subtle -->
        {#each [0, 0.25, 0.5, 0.75, 1] as ratio}
          {@const y = PADDING.top + chartH * (1 - ratio)}
          <line
            x1={PADDING.left}
            y1={y}
            x2={svgWidth - PADDING.right}
            y2={y}
            stroke="#f1f5f9"
            stroke-width="1"
            stroke-dasharray="5 5"
          />
        {/each}

        {#each dados as d, i}
          {@const x = PADDING.left + i * (BAR_GROUP_WIDTH + GAP * 3) + GAP * 2}
          {@const hR = (d.REALIZADA / maxValor) * chartH}
          {@const hA = (d.AGENDADA / maxValor) * chartH}
          {@const hC = (d.CANCELADA / maxValor) * chartH}

          <!-- Hover background highlight -->
          {#if tooltip?.d === d}
            <rect
              x={x - GAP}
              y={PADDING.top}
              width={BAR_GROUP_WIDTH + GAP * 2}
              height={chartH}
              fill="rgba(0,0,0,0.03)"
              rx="4"
            />
          {/if}

          <!-- REALIZADA -->
          <rect
            x={x}
            y={PADDING.top + chartH - hR}
            width={BAR_WIDTH}
            height={hR}
            rx="3"
            fill={COLORS.REALIZADA}
            class="transition-[fill,height,y] duration-300"
          />
          <!-- AGENDADA -->
          <rect
            x={x + BAR_WIDTH + GAP}
            y={PADDING.top + chartH - hA}
            width={BAR_WIDTH}
            height={hA}
            rx="3"
            fill={COLORS.AGENDADA}
            class="transition-[fill,height,y] duration-300"
          />
          <!-- CANCELADA -->
          <rect
            x={x + (BAR_WIDTH + GAP) * 2}
            y={PADDING.top + chartH - hC}
            width={BAR_WIDTH}
            height={hC}
            rx="3"
            fill={COLORS.CANCELADA}
            class="transition-[fill,height,y] duration-300"
          />

          <!-- Label -->
          <text
            x={x + BAR_GROUP_WIDTH / 2}
            y={HEIGHT - 8}
            text-anchor="middle"
            class="fill-slate-400 text-[10px]"
          >
            {d.label}
          </text>
        {/each}
      </svg>

      <!-- Tooltip overlay -->
      {#if tooltip}
        <div
          class="absolute pointer-events-none z-10 bg-slate-800 text-white rounded-lg px-3 py-2 shadow-lg text-[11px] leading-relaxed"
          style="left: {Math.max(60, Math.min(tooltip.x, (containerEl?.clientWidth ?? 400) - 60))}px; top: {tooltip.y}px; transform: translate(-50%, {tooltip.side === 'above' ? '-100%' : '12px'});"
        >
          <p class="font-semibold mb-1">{tooltip.d.label}</p>
          <div class="flex items-center gap-1.5">
            <span class="inline-block h-2 w-2 rounded-sm" style="background-color: {COLORS.REALIZADA}"></span>
            Realizada: <strong>{tooltip.d.REALIZADA}</strong>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="inline-block h-2 w-2 rounded-sm" style="background-color: {COLORS.AGENDADA}"></span>
            Agendada: <strong>{tooltip.d.AGENDADA}</strong>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="inline-block h-2 w-2 rounded-sm" style="background-color: {COLORS.CANCELADA}"></span>
            Cancelada: <strong>{tooltip.d.CANCELADA}</strong>
          </div>
        </div>
      {/if}
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-4 mt-3">
      <div class="flex items-center gap-1.5">
        <div class="h-2.5 w-2.5 rounded-sm" style="background-color: {COLORS.REALIZADA}"></div>
        <span class="text-[11px] text-slate-500 font-medium">Realizada</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="h-2.5 w-2.5 rounded-sm" style="background-color: {COLORS.AGENDADA}"></div>
        <span class="text-[11px] text-slate-500 font-medium">Agendada</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="h-2.5 w-2.5 rounded-sm" style="background-color: {COLORS.CANCELADA}"></div>
        <span class="text-[11px] text-slate-500 font-medium">Cancelada</span>
      </div>
    </div>
  {/if}
</div>
