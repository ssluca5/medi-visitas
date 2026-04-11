<script lang="ts">
  import type { EvolucaoPeriodo } from '$lib/types';

  interface Props {
    dados: EvolucaoPeriodo[];
    granularidade: 'semana' | 'mes';
  }

  let { dados }: Props = $props();

  const ESTAGIOS = [
    { key: 'PROSPECTADO', cssVar: '--pipeline-prospectado', label: 'Prospectado', hex: '#f59e0b' },
    { key: 'VISITADO', cssVar: '--pipeline-visitado', label: 'Visitado', hex: '#3b82f6' },
    { key: 'INTERESSADO', cssVar: '--pipeline-interessado', label: 'Interessado', hex: '#8b5cf6' },
    { key: 'PRESCRITOR', cssVar: '--pipeline-prescritor', label: 'Prescritor', hex: '#10b981' },
    { key: 'FIDELIZADO', cssVar: '--pipeline-fidelizado', label: 'Fidelizado', hex: '#059669' },
  ] as const;

  const HEIGHT = 300;
  const PADDING = { top: 16, right: 16, bottom: 38, left: 40 };

  const svgWidth = $derived(Math.max(400, dados.length * 80 + PADDING.left + PADDING.right));
  const chartH = $derived(HEIGHT - PADDING.top - PADDING.bottom);
  const chartW = $derived(svgWidth - PADDING.left - PADDING.right);

  const maxValor = $derived(
    Math.max(
      1,
      ...dados.flatMap((d) => ESTAGIOS.map((e) => d[e.key as keyof EvolucaoPeriodo] as number))
    )
  );

  function xScale(i: number): number {
    if (dados.length <= 1) return PADDING.left + chartW / 2;
    return PADDING.left + (i / (dados.length - 1)) * chartW;
  }

  function yScale(v: number): number {
    return PADDING.top + chartH - (v / maxValor) * chartH;
  }

  // Smooth cubic bezier path using Catmull-Rom to bezier conversion
  function buildSmoothPath(key: string): string {
    if (dados.length === 0) return '';
    const points = dados.map((d, i) => {
      const v = d[key as keyof EvolucaoPeriodo] as number;
      return { x: xScale(i), y: yScale(v) };
    });

    if (points.length === 1) return `M${points[0].x},${points[0].y}`;
    if (points.length === 2) return `M${points[0].x},${points[0].y}L${points[1].x},${points[1].y}`;

    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  }

  // Area path (close to bottom)
  function buildAreaPath(key: string): string {
    if (dados.length === 0) return '';
    const linePath = buildSmoothPath(key);
    const lastX = xScale(dados.length - 1);
    const firstX = xScale(0);
    const bottom = PADDING.top + chartH;
    return `${linePath}L${lastX},${bottom}L${firstX},${bottom}Z`;
  }

  // Tooltip state
  let tooltip = $state<{ x: number; y: number; i: number; d: EvolucaoPeriodo; side: 'above' | 'below' } | null>(null);
  let containerEl = $state<HTMLDivElement | null>(null);

  function handleMouseMove(e: MouseEvent, d: EvolucaoPeriodo, i: number) {
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const side = y < 80 ? 'below' : 'above';
    tooltip = { x, y, i, d, side };
  }

  function handleMouseLeave() {
    tooltip = null;
  }
</script>

<div class="card-surface p-5">
  <div class="mb-4">
    <h3 class="text-base font-bold text-slate-800">Evolução do Pipeline</h3>
    <p class="text-xs text-slate-500 mt-1">Acompanhe a progressão dos profissionais por estágio</p>
  </div>
  {#if dados.length === 0}
    <div class="flex items-center justify-center h-[300px] rounded-lg border border-dashed border-slate-200">
      <p class="text-[11px] text-slate-400">Sem dados para o período selecionado</p>
    </div>
  {:else}
    <div bind:this={containerEl} class="overflow-x-auto relative h-[300px]">
      <svg width={svgWidth} height={HEIGHT} class="block w-full h-full" viewBox="0 0 {svgWidth} {HEIGHT}" preserveAspectRatio="xMidYMid meet">
        <defs>
          {#each ESTAGIOS as estagio}
            <linearGradient id="grad-{estagio.key}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color={estagio.hex} stop-opacity="0.20" />
              <stop offset="100%" stop-color={estagio.hex} stop-opacity="0.02" />
            </linearGradient>
          {/each}
        </defs>

        <!-- Grid lines — dashed, subtle -->
        {#each [0, 0.25, 0.5, 0.75, 1] as ratio}
          {@const y = PADDING.top + chartH * (1 - ratio)}
          <line
            x1={PADDING.left}
            y1={y}
            x2={PADDING.left + chartW}
            y2={y}
            stroke="#f1f5f9"
            stroke-width="1"
            stroke-dasharray="5 5"
          />
          <text
            x={PADDING.left - 6}
            y={y + 3}
            text-anchor="end"
            class="fill-slate-300 text-[9px]"
          >
            {Math.round(maxValor * ratio)}
          </text>
        {/each}

        <!-- Hover crosshair zones per data point -->
        {#each dados as d, i}
          {@const x = xScale(i)}
          <rect
            x={x - 20}
            y={PADDING.top}
            width={40}
            height={chartH}
            fill="transparent"
            class="cursor-pointer"
            role="presentation"
            onmousemove={(e) => handleMouseMove(e, d, i)}
            onmouseleave={handleMouseLeave}
          />
          {#if tooltip?.i === i}
            <line
              x1={x}
              y1={PADDING.top}
              x2={x}
              y2={PADDING.top + chartH}
              stroke="#cbd5e1"
              stroke-width="1"
              stroke-dasharray="3 3"
            />
          {/if}
        {/each}

        <!-- Lines per stage — smooth with gradient fill -->
        {#each ESTAGIOS as estagio}
          <!-- Area fill -->
          <path
            d={buildAreaPath(estagio.key)}
            fill="url(#grad-{estagio.key})"
            class="transition-[d,fill,stroke,cx,cy] duration-300"
          />
          <!-- Smooth line -->
          <path
            d={buildSmoothPath(estagio.key)}
            fill="none"
            stroke={estagio.hex}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transition-[d,fill,stroke,cx,cy] duration-300"
          />
        {/each}

        <!-- Data points -->
        {#each dados as d, i}
          {@const x = xScale(i)}
          {#each ESTAGIOS as estagio}
            {@const v = d[estagio.key as keyof EvolucaoPeriodo] as number}
            <circle
              cx={x}
              cy={yScale(v)}
              r="3"
              fill="white"
              stroke={estagio.hex}
              stroke-width="2"
              class="transition-[d,fill,stroke,cx,cy] duration-300"
            />
          {/each}
        {/each}

        <!-- X-axis labels (time only — weeks or months) -->
        {#each dados as d, i}
          <text
            x={xScale(i)}
            y={HEIGHT - 8}
            text-anchor="middle"
            class="fill-slate-400 text-[9px]"
          >
            {d.label}
          </text>
        {/each}
      </svg>

      <!-- Tooltip overlay -->
      {#if tooltip}
        <div
          class="absolute pointer-events-none z-10 bg-slate-800 text-white rounded-lg px-3 py-2 shadow-lg text-[11px] leading-relaxed min-w-[140px]"
          style="left: {Math.max(80, Math.min(tooltip.x, (containerEl?.clientWidth ?? 400) - 80))}px; top: {tooltip.y}px; transform: translate(-50%, {tooltip.side === 'above' ? '-100%' : '12px'});"
        >
          <p class="font-semibold mb-1">{tooltip.d.label}</p>
          {#each ESTAGIOS as estagio}
            {@const v = tooltip.d[estagio.key as keyof EvolucaoPeriodo] as number}
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-1.5">
                <span class="inline-block h-2 w-2 rounded-full" style="background-color: {estagio.hex}"></span>
                {estagio.label}
              </div>
              <strong>{v}</strong>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap items-center justify-center gap-3 mt-3">
      {#each ESTAGIOS as estagio}
        <div class="flex items-center gap-1.5">
          <div class="h-2.5 w-2.5 rounded-full" style="background-color: {estagio.hex}"></div>
          <span class="text-[11px] text-slate-500 font-medium">{estagio.label}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
