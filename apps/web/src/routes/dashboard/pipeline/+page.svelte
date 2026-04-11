<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import { BarChart3, Users, CalendarCheck, TrendingUp, Download, RefreshCw } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { toasts } from '$lib/stores/toast';
  import CardMetrica from '$lib/components/pipeline/CardMetrica.svelte';
  import FunilPipeline from '$lib/components/pipeline/FunilPipeline.svelte';
  import KanbanPipeline from '$lib/components/pipeline/KanbanPipeline.svelte';
  import GraficoVisitas from '$lib/components/pipeline/GraficoVisitas.svelte';
  import GraficoConversao from '$lib/components/pipeline/GraficoConversao.svelte';
  import type {
    PipelineResponse,
    MetricasPipeline,
    EvolucaoPeriodo,
    VisitasPeriodo,
    EstagioPipeline,
    Profissional,
  } from '$lib/types';

  interface Props {
    data: { sessionToken: string | null };
  }

  let { data }: Props = $props();

  // Estado
  let pipeline = $state<PipelineResponse | null>(null);
  let metricas = $state<MetricasPipeline | null>(null);
  let evolucao = $state<EvolucaoPeriodo[]>([]);
  let visitasPeriodo = $state<VisitasPeriodo[]>([]);
  let loading = $state(true);
  let erro = $state<string | null>(null);
  let busca = $state('');
  let granularidade = $state<'semana' | 'mes'>('semana');

  // Filtro de datas (últimos 30 dias por padrão)
  const hoje = new Date();
  const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
  let dataInicio = $state(trintaDiasAtras.toISOString().split('T')[0]);
  let dataFim = $state(hoje.toISOString().split('T')[0]);

  // Filtro client-side do Kanban (sem refresh da tela)
  let pipelineFiltrado = $derived.by(() => {
    if (!pipeline) return null;
    if (!busca.trim()) return pipeline;

    const termo = busca.toLowerCase();
    const filtrado: Record<EstagioPipeline, Profissional[]> = {
      PROSPECTADO: [],
      VISITADO: [],
      INTERESSADO: [],
      PRESCRITOR: [],
      FIDELIZADO: [],
    };
    const totais: Record<EstagioPipeline, number> = {
      PROSPECTADO: 0,
      VISITADO: 0,
      INTERESSADO: 0,
      PRESCRITOR: 0,
      FIDELIZADO: 0,
    };

    for (const key of Object.keys(pipeline.data) as EstagioPipeline[]) {
      filtrado[key] = pipeline.data[key].filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          (p.crm && p.crm.toLowerCase().includes(termo))
      );
      totais[key] = filtrado[key].length;
    }

    return {
      data: filtrado,
      totaisPorEstagio: totais,
      totalGeral: Object.values(totais).reduce((a, b) => a + b, 0),
    };
  });

  async function carregarDados() {
    loading = true;
    erro = null;
    try {
      const qs = `dataInicio=${dataInicio}&dataFim=${dataFim}`;

      const [pipelineRes, metricasRes, evolucaoRes, visitasRes] = await Promise.all([
        apiFetch('/pipeline', data.sessionToken),
        apiFetch(`/pipeline/metricas?${qs}`, data.sessionToken),
        apiFetch(`/pipeline/evolucao?${qs}&granularidade=${granularidade}`, data.sessionToken),
        apiFetch(`/pipeline/visitas-por-periodo?${qs}&granularidade=${granularidade}`, data.sessionToken),
      ]);

      if (pipelineRes.ok) pipeline = await pipelineRes.json();
      if (metricasRes.ok) metricas = await metricasRes.json();
      if (evolucaoRes.ok) {
        const json = await evolucaoRes.json();
        evolucao = json.data ?? [];
      }
      if (visitasRes.ok) {
        const json = await visitasRes.json();
        visitasPeriodo = json.data ?? [];
      }

      if (!pipelineRes.ok || !metricasRes.ok) {
        erro = 'Erro ao carregar alguns dados do pipeline';
      }
    } catch (e) {
      erro = 'Erro ao conectar com o servidor';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function exportarCSV() {
    try {
      const res = await apiFetch('/pipeline/exportar', data.sessionToken);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pipeline-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Erro ao exportar:', e);
    }
  }

  onMount(() => {
    carregarDados();
  });

  async function moverProfissional(profId: string, origem: EstagioPipeline, destino: EstagioPipeline) {
    if (!pipeline) return;

    // Update otimista
    const prof = pipeline.data[origem].find((p) => p.id === profId);
    if (!prof) return;

    pipeline.data[origem] = pipeline.data[origem].filter((p) => p.id !== profId);
    pipeline.data[destino] = [...pipeline.data[destino], { ...prof, estagioPipeline: destino }];
    pipeline.totaisPorEstagio[origem] = pipeline.data[origem].length;
    pipeline.totaisPorEstagio[destino] = pipeline.data[destino].length;

    try {
      const res = await apiFetch(`/profissionais/${profId}/estagio`, data.sessionToken, {
        method: 'PATCH',
        body: JSON.stringify({ estagioNovo: destino }),
      });

      if (res.ok) {
        toasts.show('success', `${prof.nome} movido para ${destino.toLowerCase()}`);
      } else {
        // Reverter em caso de erro
        pipeline.data[destino] = pipeline.data[destino].filter((p) => p.id !== profId);
        pipeline.data[origem] = [...pipeline.data[origem], prof];
        pipeline.totaisPorEstagio[origem] = pipeline.data[origem].length;
        pipeline.totaisPorEstagio[destino] = pipeline.data[destino].length;
        const err = await res.json().catch(() => null);
        toasts.show('error', err?.error || 'Erro ao mover profissional');
      }
    } catch (e) {
      // Reverter em caso de erro de rede
      pipeline.data[destino] = pipeline.data[destino].filter((p) => p.id !== profId);
      pipeline.data[origem] = [...pipeline.data[origem], prof];
      pipeline.totaisPorEstagio[origem] = pipeline.data[origem].length;
      pipeline.totaisPorEstagio[destino] = pipeline.data[destino].length;
      toasts.show('error', 'Erro ao conectar com o servidor');
    }
  }
</script>

<svelte:head>
  <title>Pipeline — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<div class="flex flex-wrap items-center justify-between gap-4 mb-6">
  <div class="flex items-center gap-3">
    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
      <BarChart3 class="h-4.5 w-4.5 text-white" />
    </div>
    <div>
      <h1 class="text-lg font-bold text-slate-800">Pipeline</h1>
      <p class="text-[11px] text-slate-400">Funil de conversão e analytics</p>
    </div>
  </div>
  <div class="flex items-center gap-2">
    <Button variant="outline" size="sm" onclick={carregarDados}>
      <RefreshCw class="h-3.5 w-3.5 mr-1.5" />
      Atualizar
    </Button>
    <Button variant="outline" size="sm" onclick={exportarCSV}>
      <Download class="h-3.5 w-3.5 mr-1.5" />
      Exportar CSV
    </Button>
  </div>
</div>

<!-- Filtros de período -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
  <div class="flex flex-wrap items-end gap-3">
    <div class="min-w-[160px]">
      <label class="block text-xs font-medium text-slate-500 mb-1.5" for="dataInicioPipeline">Data início</label>
      <input
        id="dataInicioPipeline"
        type="date"
        bind:value={dataInicio}
        onchange={carregarDados}
        class="block w-full rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-slate-50/50"
      />
    </div>
    <div class="min-w-[160px]">
      <label class="block text-xs font-medium text-slate-500 mb-1.5" for="dataFimPipeline">Data fim</label>
      <input
        id="dataFimPipeline"
        type="date"
        bind:value={dataFim}
        onchange={carregarDados}
        class="block w-full rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-slate-50/50"
      />
    </div>
    <div>
      <div class="h-[18px] mb-1.5"></div>
      <div class="flex items-center rounded-lg bg-slate-100 p-0.5">
        <button
          onclick={() => { granularidade = 'semana'; carregarDados(); }}
          class="px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer {granularidade === 'semana' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"
        >
          Semana
        </button>
        <button
          onclick={() => { granularidade = 'mes'; carregarDados(); }}
          class="px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer {granularidade === 'mes' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"
        >
          Mês
        </button>
      </div>
    </div>
  </div>
</div>

{#if loading}
  <div class="flex items-center justify-center h-64">
    <RefreshCw class="h-6 w-6 text-slate-400 animate-spin" />
  </div>
{:else if erro}
  <div class="card-surface p-8 text-center">
    <p class="text-sm text-red-500 font-medium">{erro}</p>
    <Button variant="outline" size="sm" class="mt-3" onclick={carregarDados}>Tentar novamente</Button>
  </div>
{:else}
  <!-- KPI Cards -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 items-stretch">
    <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
      <CardMetrica
        titulo="Total Profissionais"
        valor={metricas?.totalProfissionais ?? 0}
        icone={Users}
        corIcone="text-blue-600"
        corFundo="bg-blue-50"
      />
    </div>
    <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
      <CardMetrica
        titulo="Visitas Realizadas"
        valor={metricas?.visitasRealizadas ?? 0}
        subtitulo="{metricas?.visitasPlanejadas ?? 0} planejadas no período"
        icone={CalendarCheck}
        corIcone="text-violet-600"
        corFundo="bg-violet-50"
      />
    </div>
    <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
      <CardMetrica
        titulo="Média/Semana"
        valor={metricas?.mediaVisitasPorSemana ?? 0}
        icone={TrendingUp}
        corIcone="text-emerald-600"
        corFundo="bg-emerald-50"
      />
    </div>
    <div class="transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl">
      <CardMetrica
        titulo="Sem Visita (30d)"
        valor={metricas?.profissionaisSemVisitaUltimos30Dias ?? 0}
        icone={Users}
        corIcone="text-amber-600"
        corFundo="bg-amber-50"
      />
    </div>
  </div>

  <!-- Funil de Conversão -->
  <div class="mb-6">
    <FunilPipeline totaisPorEstagio={pipeline?.totaisPorEstagio ?? null} />
  </div>

  <!-- Kanban em largura total -->
  <div class="w-full mb-6">
    <KanbanPipeline pipeline={pipelineFiltrado} {busca} onBuscaChange={(v) => busca = v} onMove={moverProfissional} />
  </div>

  <!-- Charts -->
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6 mt-10">
    <GraficoVisitas dados={visitasPeriodo} />
    <GraficoConversao dados={evolucao} {granularidade} />
  </div>
{/if}
