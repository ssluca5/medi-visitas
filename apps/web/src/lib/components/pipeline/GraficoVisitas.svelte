<script lang="ts">
  import type { VisitasPeriodo } from '$lib/types';

  interface Props {
    dados: VisitasPeriodo[];
  }

  let { dados }: Props = $props();

  const STATUS = [
    {
      key: 'REALIZADA',
      label: 'Realizadas',
      dotClass: 'bg-blue-600',
      barClass: 'bg-blue-600'
    },
    {
      key: 'AGENDADA',
      label: 'Agendadas',
      dotClass: 'bg-sky-300',
      barClass: 'bg-sky-300'
    },
    {
      key: 'CANCELADA',
      label: 'Canceladas',
      dotClass: 'bg-slate-400',
      barClass: 'bg-slate-400'
    },
    {
      key: 'NAO_REALIZADA',
      label: 'Não Realizadas',
      dotClass: 'bg-amber-400',
      barClass: 'bg-amber-400'
    }
  ] as const;

  type StatusItem = (typeof STATUS)[number];

  const totais = $derived(
    STATUS.map((status) => ({
      ...status,
      total: dados.reduce((sum, item) => sum + Number(item[status.key] || 0), 0)
    }))
  );

  function totalPeriodo(item: VisitasPeriodo) {
    return STATUS.reduce((sum, status) => sum + Number(item[status.key] || 0), 0);
  }

  function segmentosVisiveis(item: VisitasPeriodo) {
    const total = totalPeriodo(item);

    return STATUS.map((status) => {
      const valor = Number(item[status.key] || 0);
      return {
        ...status,
        valor,
        percentual: total > 0 ? (valor / total) * 100 : 0
      };
    }).filter((status) => status.valor > 0);
  }

  function roundedClass(index: number, total: number) {
    if (total === 1) return 'rounded-full';
    if (index === 0) return 'rounded-l-full';
    if (index === total - 1) return 'rounded-r-full';
    return '';
  }

  function segmentTitle(periodo: VisitasPeriodo, status: StatusItem, valor: number) {
    return `${periodo.label} - ${status.label}: ${valor}`;
  }
</script>

<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full" style="content-visibility: auto; contain-intrinsic-size: 400px 320px;">
  <div class="mb-6">
    <h2 class="text-base font-semibold text-ui-primary">Visitas por Período</h2>
    <p class="mt-1 mb-4 text-sm text-ui-secondary">Distribuição por status em cada período</p>

    {#if dados.length > 0}
      <div class="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 lg:grid-cols-4">
        {#each totais as status, index}
          <div class="flex min-w-0 items-center justify-center gap-2 px-3 py-3 {index % 2 === 0 ? 'border-r border-slate-100' : ''} {index < 2 ? 'border-b border-slate-100 lg:border-b-0' : ''} {index < totais.length - 1 ? 'lg:border-r lg:border-slate-100' : ''}">
            <div class="flex min-w-0 items-center gap-2">
              <div class="size-2.5 shrink-0 rounded-full {status.dotClass}"></div>
              <span class="truncate text-[11px] font-semibold uppercase text-ui-secondary">{status.label}</span>
            </div>
            <span class="shrink-0 text-sm font-semibold text-ui-primary">{status.total}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if dados.length === 0}
    <div class="flex min-h-[260px] flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200">
      <p class="text-xs text-ui-muted">Sem dados para o período selecionado</p>
    </div>
  {:else}
    <div class="flex flex-1 flex-col justify-between gap-4 pt-1">
      {#each dados as periodo}
        {@const total = totalPeriodo(periodo)}
        {@const segmentos = segmentosVisiveis(periodo)}
        <div class="grid grid-cols-[minmax(4.5rem,6rem)_1fr] items-center gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-ui-strong">{periodo.label}</p>
            <p class="text-xs text-ui-muted">{total} visita{total === 1 ? '' : 's'}</p>
          </div>

          <div class="h-7 rounded-full bg-slate-100 p-1">
            {#if total > 0}
              <div class="flex h-full overflow-hidden rounded-full">
                {#each segmentos as segmento, index}
                  <div
                    class="flex h-full min-w-8 items-center justify-center px-2 text-xs font-bold text-white/90 {segmento.barClass} {roundedClass(index, segmentos.length)}"
                    style="width: {segmento.percentual}%;"
                    aria-label={segmentTitle(periodo, segmento, segmento.valor)}
                    title={segmentTitle(periodo, segmento, segmento.valor)}
                  >
                    {segmento.valor}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
