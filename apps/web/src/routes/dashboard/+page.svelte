<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Search, Target, X } from 'lucide-svelte';
  import { apiFetch } from '$lib/api';
  import TourPrimeiroAcesso from '$lib/components/ui/TourPrimeiroAcesso.svelte';
  import WidgetTranscricoes from '$lib/components/dashboard/WidgetTranscricoes.svelte';
  import type { DashboardResumoV2, Meta, SugestaoBusca } from '$lib/types';

  interface Props {
    data: {
      resumo: DashboardResumoV2 | null;
      sessionToken: string | null;
      tourConcluidoEm: string | null;
      plano?: string;
      pacotesIaDisponiveis?: boolean;
      role?: string | null;
    };
  }

  let { data }: Props = $props();

  let profissionalSelecionado = $state<{
    id: string;
    nome: string;
    especialidade: string;
    estagioPipeline: string;
  } | null>(null);

  let resumo = $state<DashboardResumoV2 | null>(untrack(() => data.resumo));
  let buscaQuery = $state('');
  let sugestoesBusca = $state<SugestaoBusca[]>([]);
  let buscaOpen = $state(false);
  let metaAlertas = $state<Meta[]>([]);
  let timer: ReturnType<typeof setTimeout>;

  const mostrarTour = $derived(!data.tourConcluidoEm);

  const estagiosPipeline = [
    { key: 'PROSPECTADO', label: 'Prospectado', color: 'var(--pipeline-prospectado)' },
    { key: 'VISITADO', label: 'Visitado', color: 'var(--pipeline-visitado)' },
    { key: 'INTERESSADO', label: 'Interessado', color: 'var(--pipeline-interessado)' },
    { key: 'PRESCRITOR', label: 'Prescritor', color: 'var(--pipeline-prescritor)' },
    { key: 'FIDELIZADO', label: 'Fidelizado', color: 'var(--status-ativo)' },
  ];

  const estagioColors: Record<string, { bg: string; color: string }> = {
    PROSPECTADO: { bg: 'var(--warning-light)', color: 'var(--warning-text)' },
    VISITADO: { bg: 'var(--info-light)', color: 'var(--info-text)' },
    INTERESSADO: { bg: 'rgb(237 233 254)', color: 'rgb(91 33 182)' },
    PRESCRITOR: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
    FIDELIZADO: { bg: 'var(--success-bg)', color: 'rgb(6 78 59)' },
  };

  // ── Busca com debounce ────────────────────────────────

  $effect(() => {
    if (buscaQuery.length < 2) {
      sugestoesBusca = [];
      buscaOpen = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/profissionais?busca=${encodeURIComponent(buscaQuery)}&pageSize=5`,
          data.sessionToken,
        );
        if (res.ok) {
          const json = await res.json();
          sugestoesBusca = (json.data ?? []).map(
            (p: Record<string, unknown>) => ({
              id: p.id as string,
              nome: p.nome as string,
              especialidade:
                (p.especialidade as { nome?: string } | null)?.nome ?? '',
            }),
          );
          buscaOpen = sugestoesBusca.length > 0;
        }
      } catch {
        sugestoesBusca = [];
        buscaOpen = false;
      }
    }, 300);
  });

  // ── Seleção / limpeza de profissional ──────────────────

  async function selecionarProfissional(prof: SugestaoBusca) {
    buscaOpen = false;
    buscaQuery = '';
    profissionalSelecionado = {
      id: prof.id,
      nome: prof.nome,
      especialidade: prof.especialidade,
      estagioPipeline: '',
    };
    try {
      const res = await apiFetch(
        `/dashboard/resumo?profissionalId=${prof.id}`,
        data.sessionToken,
      );
      if (res.ok) {
        const json: DashboardResumoV2 = await res.json();
        resumo = json;
        const found = Object.entries(json.pipeline).find(
          ([, v]) => v > 0,
        )?.[0];
        profissionalSelecionado = {
          ...profissionalSelecionado,
          estagioPipeline: found ?? '',
        };
      }
    } catch {
      // mantém estado atual
    }
  }

  async function limparSelecao() {
    profissionalSelecionado = null;
    try {
      const res = await apiFetch('/dashboard/resumo', data.sessionToken);
      if (res.ok) resumo = await res.json();
    } catch {
      // mantém estado atual
    }
  }

  // ── Formatação de datas ───────────────────────────────

  function formatarHora(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  function formatarDataCurta(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(new Date(iso));
  }

  // ── Helpers de progresso ──────────────────────────────

  function pct(atual: number, meta: number): number {
    return Math.min((atual / (meta || 1)) * 100, 100);
  }

  function barColor(atual: number, meta: number): string {
    return atual >= meta ? 'var(--status-ativo)' : 'var(--brand-primary)';
  }

  function prioridadeColor(p: string): string {
    if (p === 'ALTA' || p === 'URGENTE') return 'var(--danger)';
    if (p === 'MEDIA') return 'var(--pipeline-prospectado)';
    return 'var(--text-muted)';
  }

  function prioridadeBg(p: string): string {
    if (p === 'ALTA' || p === 'URGENTE') return 'var(--danger-soft)';
    if (p === 'MEDIA') return 'var(--warning-light)';
    return 'var(--neutral-light)';
  }

  function prioridadeTextColor(p: string): string {
    if (p === 'ALTA' || p === 'URGENTE') return 'var(--danger)';
    if (p === 'MEDIA') return 'var(--warning-text)';
    return 'var(--text-secondary)';
  }

  function statusBg(s: string): string {
    if (s === 'REALIZADA') return 'var(--success-bg)';
    if (s === 'CANCELADA') return 'var(--danger-soft)';
    return 'var(--info-light)';
  }

  function statusColor(s: string): string {
    if (s === 'REALIZADA') return 'var(--success-text)';
    if (s === 'CANCELADA') return 'var(--danger-text)';
    return 'var(--info-text)';
  }

  function diasRestantesMeta(iso: string): number {
    const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
    return Math.max(0, diff);
  }

  function metaAlertaIconClass(meta: Meta): string {
    return meta.alertas?.prazoCritico
      ? 'mt-0.5 h-4 w-4 flex-shrink-0 text-red-600'
      : 'mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600';
  }

  async function fetchAlertasMetas() {
    try {
      const res = await apiFetch('/metas/alertas', data.sessionToken);
      if (res.ok) {
        metaAlertas = await res.json();
      }
    } catch {
      metaAlertas = [];
    }
  }

  onMount(() => {
    fetchAlertasMetas();
  });
</script>

<svelte:head>
  <title>Dashboard — MediVisitas</title>
</svelte:head>

<!-- ═══ ZONA 1 — Barra de contexto ═══ -->
<div class="mb-6">
  <div class="relative max-w-md">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-muted" />
    <input
      type="text"
      bind:value={buscaQuery}
      placeholder="Buscar médico..."
      class="input-base !pl-9"
      autocomplete="off"
    />

    {#if buscaOpen && sugestoesBusca.length > 0}
      <div
        class="absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
      >
        {#each sugestoesBusca as prof}
          <button
            onmousedown={() => selecionarProfissional(prof)}
            class="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
              style="background-color: var(--brand-primary)"
            >
              {prof.nome.charAt(0)}
            </div>
            <div>
              <p class="text-sm font-medium text-ui-primary">{prof.nome}</p>
              <p class="text-xs text-ui-muted">{prof.especialidade}</p>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  {#if profissionalSelecionado}
    <div
      class="mt-3 flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg w-fit"
    >
      <div
        class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
        style="background-color: var(--brand-primary)"
      >
        {profissionalSelecionado.nome.charAt(0)}
      </div>
      <div>
        <span class="text-sm font-medium text-blue-900">
          {profissionalSelecionado.nome}
        </span>
        <span class="text-xs text-blue-500 ml-2">
          {profissionalSelecionado.especialidade}
        </span>
        {#if profissionalSelecionado.estagioPipeline}
          <span class="text-xs text-blue-400 ml-2">·</span>
          <span class="text-xs text-blue-500 ml-1">
            {profissionalSelecionado.estagioPipeline}
          </span>
        {/if}
      </div>
      <button
        onclick={limparSelecao}
        class="ml-2 text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  {/if}
</div>

<!-- ═══ ZONA 2 — KPIs (5 cards) ═══ -->
<div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
  <!-- Visitas Hoje -->
  <div class="dashboard-kpi-card bg-white rounded-xl border border-gray-200 p-4">
    <p class="text-xs font-semibold uppercase tracking-wider text-ui-muted mb-3">
      Visitas Hoje
    </p>
    <div class="flex items-end justify-between mb-2">
      <p class="text-2xl font-bold text-ui-primary">
        {resumo?.kpis.visitasHoje ?? 0}
      </p>
      <p class="text-xs text-ui-muted mb-1">
        / {resumo?.kpis.metaDiaria ?? 0}
      </p>
    </div>
    <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        style="width: {pct(resumo?.kpis.visitasHoje ?? 0, resumo?.kpis.metaDiaria ?? 0)}%; background-color: {barColor(resumo?.kpis.visitasHoje ?? 0, resumo?.kpis.metaDiaria ?? 0)}"
      >
      </div>
    </div>
  </div>

  <!-- Visitas Semana -->
  <div class="dashboard-kpi-card bg-white rounded-xl border border-gray-200 p-4">
    <p class="text-xs font-semibold uppercase tracking-wider text-ui-muted mb-3">
      Visitas Semana
    </p>
    <div class="flex items-end justify-between mb-2">
      <p class="text-2xl font-bold text-ui-primary">
        {resumo?.kpis.visitasSemana ?? 0}
      </p>
      <p class="text-xs text-ui-muted mb-1">
        / {resumo?.kpis.metaSemanal ?? 0}
      </p>
    </div>
    <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        style="width: {pct(resumo?.kpis.visitasSemana ?? 0, resumo?.kpis.metaSemanal ?? 0)}%; background-color: {barColor(resumo?.kpis.visitasSemana ?? 0, resumo?.kpis.metaSemanal ?? 0)}"
      >
      </div>
    </div>
  </div>

  <!-- Visitas Mês -->
  <div class="dashboard-kpi-card bg-white rounded-xl border border-gray-200 p-4">
    <p class="text-xs font-semibold uppercase tracking-wider text-ui-muted mb-3">
      Visitas Mês
    </p>
    <div class="flex items-end justify-between mb-2">
      <p class="text-2xl font-bold text-ui-primary">
        {resumo?.kpis.visitasMes ?? 0}
      </p>
      <p class="text-xs text-ui-muted mb-1">
        / {resumo?.kpis.metaMensal ?? 0}
      </p>
    </div>
    <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        style="width: {pct(resumo?.kpis.visitasMes ?? 0, resumo?.kpis.metaMensal ?? 0)}%; background-color: {barColor(resumo?.kpis.visitasMes ?? 0, resumo?.kpis.metaMensal ?? 0)}"
      >
      </div>
    </div>
  </div>

  <!-- Sem Visita +30d -->
  <div
    class="dashboard-kpi-card bg-white rounded-xl border p-4"
    class:border-red-200={(resumo?.kpis.medicosSemVisita30d ?? 0) > 10}
    class:border-gray-200={(resumo?.kpis.medicosSemVisita30d ?? 0) <= 10}
  >
    <p class="text-xs font-semibold uppercase tracking-wider text-ui-muted mb-3">
      Sem Visita +30d
    </p>
    <p
      class="text-2xl font-bold"
      class:text-red-600={(resumo?.kpis.medicosSemVisita30d ?? 0) > 10}
      class:text-ui-primary={(resumo?.kpis.medicosSemVisita30d ?? 0) <= 10}
    >
      {resumo?.kpis.medicosSemVisita30d ?? 0}
    </p>
    <p class="text-xs text-ui-muted mt-1">profissionais</p>
  </div>

  <!-- Taxa de Conversão -->
  <div class="dashboard-kpi-card bg-white rounded-xl border border-gray-200 p-4">
    <p class="text-xs font-semibold uppercase tracking-wider text-ui-muted mb-3">
      Conversão
    </p>
    <p class="text-2xl font-bold text-ui-primary">
      {resumo?.kpis.taxaConversao ?? 0}%
    </p>
    <p class="text-xs text-ui-muted mt-1">Prosp. → Prescritor</p>
  </div>
</div>

<!-- ═══ ZONA 3 — Grid 2 colunas ═══ -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  <!-- COLUNA ESQUERDA -->
  <div class="space-y-6">
    <!-- Próximas Visitas -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-ui-primary">Próximas Visitas</h2>
        <a href="/dashboard/agenda" class="text-xs font-medium" style="color: var(--brand-primary)">
          Ver agenda →
        </a>
      </div>
      <div class="divide-y divide-gray-50">
        {#each resumo?.proximasVisitas ?? [] as visita}
          <div
            class="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <div class="text-center w-12 flex-shrink-0">
              <p class="text-xs font-semibold text-ui-primary">
                {formatarHora(visita.dataHora)}
              </p>
              <p class="text-[10px] text-ui-muted">
                {formatarDataCurta(visita.dataHora)}
              </p>
            </div>
            <div
              class="w-0.5 h-8 rounded-full flex-shrink-0"
              style="background-color: {prioridadeColor(visita.prioridade)}"
            >
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-ui-primary truncate">
                {visita.profissionalNome}
              </p>
              <p class="text-xs text-ui-muted truncate">{visita.especialidade}</p>
            </div>
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded flex-shrink-0"
              style="background-color: {prioridadeBg(visita.prioridade)}; color: {prioridadeTextColor(visita.prioridade)}"
            >
              {visita.prioridade}
            </span>
          </div>
        {:else}
          <div class="px-5 py-8 text-center">
            <p class="text-sm text-ui-muted">Nenhuma visita agendada</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Alertas Inteligentes -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-ui-primary">Alertas</h2>
      </div>
      <div class="divide-y divide-gray-50">
        {#each resumo?.alertas ?? [] as alerta}
          <div class="px-5 py-3.5 flex items-start gap-3">
            <div
              class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style="background-color: {alerta.urgencia === 'alta' ? 'var(--danger)' : 'var(--pipeline-prospectado)'}"
            >
            </div>
            <div>
              <p class="text-sm text-ui-body">{alerta.descricao}</p>
              <p class="text-xs text-ui-muted mt-0.5">{alerta.profissionalNome}</p>
            </div>
          </div>
        {/each}
        {#each metaAlertas as meta}
          <div class="px-5 py-3.5 flex items-start gap-3">
            <Target class={metaAlertaIconClass(meta)} />
            <div>
              <p
                class="text-sm"
                class:text-red-700={meta.alertas?.prazoCritico}
                class:text-amber-700={!meta.alertas?.prazoCritico}
              >
                Meta "{meta.nome}" esta em risco - {diasRestantesMeta(meta.dataFim)} dias restantes
              </p>
              <p class="text-xs text-ui-muted mt-0.5">Metas</p>
            </div>
          </div>
        {/each}
        {#if (resumo?.alertas ?? []).length === 0 && metaAlertas.length === 0}
          <div class="px-5 py-8 text-center">
            <p class="text-sm text-ui-muted">Nenhum alerta no momento</p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- COLUNA DIREITA -->
  <div class="space-y-6">
    <!-- Últimas Visitas -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-ui-primary">Últimas Visitas</h2>
        <a href="/dashboard/visitas" class="text-xs font-medium" style="color: var(--brand-primary)">
          Ver todas →
        </a>
      </div>
      <div class="divide-y divide-gray-50">
        {#each resumo?.ultimasVisitas ?? [] as visita}
          <div
            class="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <div class="text-center w-12 flex-shrink-0">
              <p class="text-xs font-semibold text-ui-primary">
                {formatarDataCurta(visita.dataHora)}
              </p>
              <p class="text-[10px] text-ui-muted">
                {formatarHora(visita.dataHora)}
              </p>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-ui-primary truncate">
                {visita.profissionalNome}
              </p>
              <p class="text-xs text-ui-muted truncate">
                {visita.resumo ?? visita.especialidade}
              </p>
            </div>
            <span
              class="text-[10px] font-medium px-2 py-0.5 rounded flex-shrink-0"
              style="background-color: {statusBg(visita.status)}; color: {statusColor(visita.status)}"
            >
              {visita.status}
            </span>
          </div>
        {:else}
          <div class="px-5 py-8 text-center">
            <p class="text-sm text-ui-muted">Nenhuma visita registrada</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Mini Pipeline -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-ui-primary">Pipeline</h2>
        <a href="/dashboard/pipeline" class="text-xs font-medium" style="color: var(--brand-primary)">
          Ver completo →
        </a>
      </div>
      <div class="px-5 py-4 space-y-3">
        {#each estagiosPipeline as estagio}
          {@const count = resumo?.pipeline[estagio.key as keyof typeof resumo.pipeline] ?? 0}
          {@const total = Object.values(resumo?.pipeline ?? {}).reduce((a, b) => a + b, 0) || 1}
          <div class="flex items-center gap-3">
            <p class="text-xs text-ui-secondary w-24 flex-shrink-0">{estagio.label}</p>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                style="width: {(count / total) * 100}%; background-color: {estagio.color}"
              >
              </div>
            </div>
            <p class="text-xs font-semibold text-ui-body w-6 text-right flex-shrink-0">
              {count}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- ═══ ZONA 4 — Médicos sem visita recente ═══ -->
<div class="bg-white rounded-xl border border-gray-200">
  <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
    <div class="flex items-center gap-2">
      <h2 class="text-sm font-semibold text-ui-primary">
        Profissionais sem visita recente
      </h2>
      {#if (resumo?.medicosSemVisita ?? []).length > 0}
        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">
          {resumo?.medicosSemVisita.length}
        </span>
      {/if}
    </div>
  </div>
  <div class="divide-y divide-gray-50">
    {#each resumo?.medicosSemVisita ?? [] as medico}
      <div
        class="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors"
      >
        <div
          class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
          style="background-color: var(--brand-primary)"
        >
          {medico.nome.charAt(0)}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-ui-primary truncate">{medico.nome}</p>
          <p class="text-xs text-ui-muted">{medico.especialidade}</p>
        </div>
        <span class="text-xs text-red-500 font-medium flex-shrink-0">
          {medico.diasSemVisita}d sem visita
        </span>
        <span
          class="text-[10px] font-medium px-2 py-0.5 rounded flex-shrink-0"
          style="background-color: {estagioColors[medico.estagioPipeline]?.bg ?? 'var(--neutral-light)'}; color: {estagioColors[medico.estagioPipeline]?.color ?? 'var(--text-secondary)'}"
        >
          {medico.estagioPipeline}
        </span>
      </div>
    {:else}
      <div class="px-5 py-8 text-center">
        <p class="text-sm text-ui-muted">
          Todos os profissionais foram visitados recentemente
        </p>
      </div>
    {/each}
  </div>
</div>

<!-- Widget Transcrições (sticky canto inferior direito — o próprio componente gerencia fixed + minimize/hide) -->
<WidgetTranscricoes
  sessionToken={data.sessionToken!}
  plano={data.plano ?? 'TRIAL'}
  pacotesIaDisponiveis={data.pacotesIaDisponiveis ?? false}
  role={data.role}
/>

{#if mostrarTour}
  <TourPrimeiroAcesso sessionToken={data.sessionToken} />
{/if}

<style>
  .dashboard-kpi-card {
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease;
  }

  .dashboard-kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgb(15 23 42 / 0.08);
  }
</style>
