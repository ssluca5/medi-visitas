<script lang="ts">
  import type { EvolucaoPeriodo } from '$lib/types';

  interface Props {
    dados: EvolucaoPeriodo[];
    granularidade: 'semana' | 'mes';
  }

  let { dados, granularidade }: Props = $props();

  const ESTAGIOS = [
    { key: 'PROSPECTADO', label: 'Prospectado', barClass: 'bg-amber-400' },
    { key: 'VISITADO', label: 'Visitado', barClass: 'bg-blue-500' },
    { key: 'INTERESSADO', label: 'Interessado', barClass: 'bg-violet-500' },
    { key: 'PRESCRITOR', label: 'Prescritor', barClass: 'bg-emerald-500' },
    { key: 'FIDELIZADO', label: 'Fidelizado', barClass: 'bg-green-600' }
  ] as const;

  type EstagioItem = (typeof ESTAGIOS)[number];

  let periodoSelecionadoIndex = $state(0);
  let assinaturaDados = $state('');

  $effect(() => {
    const assinaturaAtual = dados.map((item) => item.periodo).join('|');
    if (assinaturaAtual !== assinaturaDados) {
      assinaturaDados = assinaturaAtual;
      periodoSelecionadoIndex = Math.max(0, dados.length - 1);
    }
  });

  const periodoSelecionado = $derived(dados[periodoSelecionadoIndex] ?? null);

  const estagiosPeriodo = $derived(
    ESTAGIOS.map((estagio) => {
      const valor = Number(periodoSelecionado?.[estagio.key] || 0);
      const anterior = Number(dados[periodoSelecionadoIndex - 1]?.[estagio.key] || 0);

      return {
        ...estagio,
        valor,
        variacao: valor - anterior
      };
    })
  );

  const maiorValor = $derived(Math.max(1, ...estagiosPeriodo.map((estagio) => estagio.valor)));

  function larguraFunil(valor: number) {
    return `${Math.max(valor > 0 ? 6 : 0, (valor / maiorValor) * 100)}%`;
  }

  function variacaoLabel(variacao: number) {
    if (variacao > 0) return `+${variacao}`;
    return String(variacao);
  }

  function variacaoClass(variacao: number) {
    if (variacao > 0) return 'bg-emerald-100 text-emerald-700';
    if (variacao < 0) return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-ui-secondary';
  }

  function periodoAriaLabel(item: EvolucaoPeriodo) {
    return `Selecionar ${granularidade === 'semana' ? 'semana' : 'mês'} ${item.label}`;
  }

  function stageTitle(estagio: EstagioItem, valor: number) {
    return `${estagio.label}: ${valor}`;
  }
</script>

<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full" style="content-visibility: auto; contain-intrinsic-size: 400px 320px;">
  <div class="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
    <div>
      <h2 class="text-base font-semibold text-ui-primary">Evolução do Pipeline</h2>
      <p class="mt-1 text-sm text-ui-secondary">Tendência por estágio</p>
    </div>

    {#if dados.length > 0}
      <div class="hide-scrollbar flex overflow-x-auto rounded-lg bg-slate-100 p-1">
        {#each dados as item, index}
          <button
            type="button"
            onclick={() => (periodoSelecionadoIndex = index)}
            aria-pressed={periodoSelecionadoIndex === index}
            aria-label={periodoAriaLabel(item)}
            class="cursor-pointer whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition-colors {periodoSelecionadoIndex === index ? 'bg-white font-semibold text-ui-primary shadow-sm' : 'font-medium text-ui-secondary hover-text-ui-primary'}"
          >
            {item.label}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  {#if dados.length === 0}
    <div class="flex min-h-[280px] flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200">
      <p class="text-xs text-ui-muted">Sem dados para o período selecionado</p>
    </div>
  {:else}
    <div class="flex-1 space-y-3">
      {#each estagiosPeriodo as estagio}
        <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
          <div class="mb-2 flex items-end justify-between gap-3">
            <span class="text-sm font-semibold text-ui-strong">{estagio.label}</span>
            <div class="flex items-center gap-2">
              <span class="text-lg font-semibold text-ui-primary">{estagio.valor}</span>
              <span class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold {variacaoClass(estagio.variacao)}">
                {variacaoLabel(estagio.variacao)}
              </span>
            </div>
          </div>

          <div class="h-2 w-full rounded-full bg-slate-200">
            <div
              class="h-2 rounded-full transition-all {estagio.barClass}"
              style="width: {larguraFunil(estagio.valor)};"
              aria-label={stageTitle(estagio, estagio.valor)}
              title={stageTitle(estagio, estagio.valor)}
            ></div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .hide-scrollbar {
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
