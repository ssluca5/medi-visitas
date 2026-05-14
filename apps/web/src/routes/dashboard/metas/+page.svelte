<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import type { Meta } from '$lib/types';
  import { apiFetch } from '$lib/api';
  import { toasts } from '$lib/stores/toast.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Sheet from '$lib/components/ui/Sheet.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import {
    AlertTriangle,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Pencil,
    Plus,
    Target,
    Trash2,
    TrendingDown,
    TrendingUp,
    UserRound,
    Users,
  } from 'lucide-svelte';

  type PlanoMetaForm = 'PROFISSIONAL' | 'EQUIPE';
  type StatusFiltro = 'TODAS' | Meta['status'];
  type EscopoFiltro = 'MINHAS' | 'EQUIPE';
  type IndicadorKey = 'visitas' | 'avancos' | 'prescritores';

  type MetaTemplate = {
    nome: string;
    descricao: string;
    visitas: number;
    avancos: number;
    prescritores: number;
  };

  type MembroEquipe = {
    userId: string;
    role: 'OWNER' | 'MEMBER';
    user?: {
      name?: string | null;
      email?: string | null;
    };
  };

  interface Props {
    data: {
      sessionToken: string | null;
      userId: string;
      userName?: string | null;
      role?: string | null;
      plano?: string | null;
      temGestaoEquipe?: boolean;
      metas?: Meta[];
      membros?: MembroEquipe[];
    };
  }

  let { data }: Props = $props();

  function normalizeList<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)) {
      return (value as { data: T[] }).data;
    }
    return [];
  }

  let metas = $state<Meta[]>(untrack(() => normalizeList(data.metas)));
  let membros = $state<MembroEquipe[]>(untrack(() => normalizeList(data.membros)));
  let loading = $state(false);
  let loadingMembros = $state(false);
  let saving = $state(false);

  let sheetOpen = $state(false);
  let metaEmEdicao = $state<Meta | null>(null);
  let deleteConfirmOpen = $state(false);
  let metaParaExcluir = $state<Meta | null>(null);
  let drilldownAtual = $state<{ metaId: string; key: IndicadorKey } | null>(null);
  let metasExpandidas = $state<Set<string>>(new Set());

  function toggleExpandMeta(event: Event, metaId: string) {
    event.stopPropagation();
    const next = new Set(metasExpandidas);
    if (next.has(metaId)) {
      next.delete(metaId);
      if (drilldownAtual?.metaId === metaId) drilldownAtual = null;
    } else {
      next.add(metaId);
    }
    metasExpandidas = next;
  }

  let statusFiltro = $state<StatusFiltro>('TODAS');
  let escopoFiltro = $state<EscopoFiltro>('MINHAS');
  let responsavelFiltro = $state('TODOS');

  let formNome = $state('');
  let formDescricao = $state('');
  let formDataInicio = $state('');
  let formDataFim = $state('');
  let formMetaVisitas = $state(0);
  let formMetaAvancos = $state(0);
  let formMetaPrescritores = $state(0);
  let formResponsavelId = $state('');
  let formPlano = $state<PlanoMetaForm>('PROFISSIONAL');

  const templatesMeta: MetaTemplate[] = [
    {
      nome: 'Meta mensal de visitas',
      descricao: 'Acompanhamento recorrente de visitas realizadas no mês.',
      visitas: 80,
      avancos: 0,
      prescritores: 0,
    },
    {
      nome: 'Meta mensal de pipeline',
      descricao: 'Acompanhamento recorrente de avanços no pipeline comercial.',
      visitas: 0,
      avancos: 20,
      prescritores: 0,
    },
    {
      nome: 'Meta mensal de prescritores',
      descricao: 'Acompanhamento recorrente de novos profissionais no estágio Prescritor.',
      visitas: 0,
      avancos: 0,
      prescritores: 8,
    },
  ];

  const podeGerenciarEquipe = $derived(
    data.temGestaoEquipe === true &&
      data.role === 'OWNER' &&
      (data.plano === 'EQUIPE' || data.plano === 'EMPRESARIAL'),
  );

  const metasFiltradas = $derived.by(() => {
    return metas.filter((meta) => {
      if (statusFiltro !== 'TODAS' && meta.status !== statusFiltro) return false;

      if (!podeGerenciarEquipe) {
        return meta.responsavelId === data.userId;
      }

      if (escopoFiltro === 'MINHAS') {
        return meta.responsavelId === data.userId;
      }

      // Visão EQUIPE: mostra todas as metas da organização
      // Filtra por membro selecionado, se houver
      if (responsavelFiltro !== 'TODOS' && meta.responsavelId !== responsavelFiltro) return false;

      return true;
    });
  });

  const temFiltrosAtivos = $derived(statusFiltro !== 'TODAS' || escopoFiltro !== 'MINHAS' || responsavelFiltro !== 'TODOS');

  const formMetaValido = $derived.by(() => {
    const temIndicador = Number(formMetaVisitas) > 0 || Number(formMetaAvancos) > 0 || Number(formMetaPrescritores) > 0;
    const periodoValido = !!formDataInicio && !!formDataFim && new Date(formDataFim) > new Date(formDataInicio);
    const responsavelValido = !!formResponsavelId.trim();
    return !!formNome.trim() && periodoValido && temIndicador && responsavelValido;
  });

  const resumo = $derived.by(() => {
    const total = metasFiltradas.length;
    const ativas = metasFiltradas.filter((meta) => meta.status === 'ATIVA').length;
    const atingidas = metasFiltradas.filter((meta) => meta.status === 'ATINGIDA').length;
    const emRisco = metasFiltradas.filter(
      (meta) => meta.alertas?.emRisco || meta.alertas?.prazoCritico,
    ).length;
    const progressoMedio =
      total === 0
        ? 0
        : Math.round(
            metasFiltradas.reduce((sum, meta) => sum + (meta.progresso?.geral ?? 0), 0) /
              total,
          );
    const taxaSucesso = total === 0 ? 0 : Math.round((atingidas / total) * 100);

    return { total, ativas, atingidas, emRisco, progressoMedio, taxaSucesso };
  });

  const tituloEscopo = $derived.by(() => {
    if (!podeGerenciarEquipe) return 'Metas pessoais';
    return escopoFiltro === 'MINHAS' ? 'Minhas metas' : 'Metas da equipe';
  });

  $effect(() => {
    if (!podeGerenciarEquipe) {
      escopoFiltro = 'MINHAS';
      responsavelFiltro = 'TODOS';
      formPlano = 'PROFISSIONAL';
      formResponsavelId = data.userId ?? '';
    }
  });

  function hojeInput(): string {
    return new Date().toISOString().split('T')[0];
  }

  function fimMesInput(): string {
    const agora = new Date();
    return new Date(agora.getFullYear(), agora.getMonth() + 1, 0).toISOString().split('T')[0];
  }

  function inputDateToIso(value: string, endOfDay = false): string {
    const suffix = endOfDay ? 'T23:59:59' : 'T00:00:00';
    return new Date(`${value}${suffix}`).toISOString();
  }

  function formatarData(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  }

  function diasRestantes(iso: string): number {
    const fim = new Date(iso);
    const hoje = new Date();
    return Math.max(0, Math.ceil((fim.getTime() - hoje.getTime()) / 86400000));
  }

  function clampPercent(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, value));
  }

  function statusLabel(status: Meta['status']): string {
    if (status === 'ATINGIDA') return 'Atingida';
    if (status === 'EXPIRADA') return 'Expirada';
    return 'Ativa';
  }

  function statusClass(status: Meta['status']): string {
    if (status === 'ATINGIDA') return 'status-success';
    if (status === 'EXPIRADA') return 'status-danger';
    return 'status-brand';
  }

  function barColor(percentual: number): string {
    if (percentual >= 100) return 'var(--status-ativo)';
    if (percentual >= 60) return 'var(--brand-primary)';
    if (percentual >= 30) return 'var(--trial-text)';
    return 'var(--danger)';
  }

  function membroLabel(userId: string): string {
    const membro = membros.find((item) => item.userId === userId);
    return membro?.user?.name || membro?.user?.email || userId;
  }

  function indicadorLabel(key: IndicadorKey): string {
    if (key === 'visitas') return 'Visitas realizadas';
    if (key === 'avancos') return 'Avanços no pipeline';
    return 'Novos prescritores';
  }

  function indicadorDescricao(key: IndicadorKey): string {
    if (key === 'visitas') return 'Conta visitas realizadas dentro do periodo configurado para a meta.';
    if (key === 'avancos') return 'Conta mudanças registradas no pipeline comercial dentro do período.';
    return 'Conta profissionais que chegaram ao estagio Prescritor dentro do periodo.';
  }

  function metaIndicadores(meta: Meta) {
    return [
      {
        key: 'visitas' as const,
        label: indicadorLabel('visitas'),
        realizado: meta.progresso.visitas.realizado,
        alvo: meta.metaVisitas,
        percentual: meta.progresso.visitas.percentual,
      },
      {
        key: 'avancos' as const,
        label: indicadorLabel('avancos'),
        realizado: meta.progresso.avancosPipeline.realizado,
        alvo: meta.metaAvancosPipeline,
        percentual: meta.progresso.avancosPipeline.percentual,
      },
      {
        key: 'prescritores' as const,
        label: indicadorLabel('prescritores'),
        realizado: meta.progresso.prescritores.realizado,
        alvo: meta.metaPrescritores,
        percentual: meta.progresso.prescritores.percentual,
      },
    ];
  }

  function evolucaoPeriodo(meta: Meta) {
    const inicio = new Date(meta.dataInicio).getTime();
    const fim = new Date(meta.dataFim).getTime();
    const hoje = Date.now();
    const total = Math.max(1, fim - inicio);
    const decorrido = clampPercent(((hoje - inicio) / total) * 100);
    const progresso = clampPercent(meta.progresso.geral);
    const ritmo = progresso >= decorrido ? 'No ritmo' : 'Abaixo do ritmo';

    return {
      decorrido: Math.round(decorrido),
      progresso: Math.round(progresso),
      ritmo,
    };
  }

  function detalharIndicador(meta: Meta, key: IndicadorKey) {
    const indicador = metaIndicadores(meta).find((item) => item.key === key) ?? metaIndicadores(meta)[0];
    const restante = Math.max(0, indicador.alvo - indicador.realizado);

    return {
      ...indicador,
      restante,
      descricao: indicadorDescricao(key),
    };
  }

  function alternarDrilldown(event: MouseEvent, meta: Meta, key: IndicadorKey) {
    event.stopPropagation();
    drilldownAtual =
      drilldownAtual?.metaId === meta.id && drilldownAtual.key === key
        ? null
        : { metaId: meta.id, key };
  }

  function deveIgnorarCliqueMeta(event: Event): boolean {
    const target = event.target;
    return target instanceof HTMLElement && !!target.closest('[data-no-edit]');
  }

  function handleMetaCardClick(event: MouseEvent, meta: Meta) {
    if (deveIgnorarCliqueMeta(event)) return;
    toggleExpandMeta(event, meta.id);
  }

  function handleMetaCardKeydown(event: KeyboardEvent, meta: Meta) {
    if (deveIgnorarCliqueMeta(event)) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpandMeta(event, meta.id);
    }
  }

  function aplicarTemplate(template: MetaTemplate) {
    formNome = template.nome;
    formDescricao = template.descricao;
    formDataInicio = hojeInput();
    formDataFim = fimMesInput();
    formMetaVisitas = template.visitas;
    formMetaAvancos = template.avancos;
    formMetaPrescritores = template.prescritores;
  }

  async function fetchMetas() {
    loading = true;
    try {
      const res = await apiFetch('/metas', data.sessionToken);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Erro ao carregar metas.');
      }
      metas = normalizeList(await res.json());
    } catch (err) {
      metas = [];
      toasts.show('error', err instanceof Error ? err.message : 'Erro ao carregar metas.');
    } finally {
      loading = false;
    }
  }

  async function fetchMembros() {
    if (!podeGerenciarEquipe) return;

    loadingMembros = true;
    try {
      const res = await apiFetch('/organizacao/membros', data.sessionToken);
      if (!res.ok) return;
      const body = await res.json();
      membros = normalizeList(body);
    } catch {
      membros = [];
    } finally {
      loadingMembros = false;
    }
  }

  function limparForm() {
    formNome = '';
    formDescricao = '';
    formDataInicio = hojeInput();
    formDataFim = fimMesInput();
    formMetaVisitas = 0;
    formMetaAvancos = 0;
    formMetaPrescritores = 0;
    formPlano = 'PROFISSIONAL';
    formResponsavelId = data.userId ?? '';
  }

  function handleNovaMeta() {
    metaEmEdicao = null;
    limparForm();
    sheetOpen = true;
  }

  function handleEditarMeta(meta: Meta) {
    drilldownAtual = null;
    metaEmEdicao = meta;
    formNome = meta.nome;
    formDescricao = meta.descricao ?? '';
    formDataInicio = meta.dataInicio.split('T')[0];
    formDataFim = meta.dataFim.split('T')[0];
    formMetaVisitas = meta.metaVisitas;
    formMetaAvancos = meta.metaAvancosPipeline;
    formMetaPrescritores = meta.metaPrescritores;
    formPlano = podeGerenciarEquipe ? meta.plano : 'PROFISSIONAL';
    formResponsavelId = meta.responsavelId;
    sheetOpen = true;
  }

  function selecionarPlano(plano: PlanoMetaForm) {
    formPlano = podeGerenciarEquipe ? plano : 'PROFISSIONAL';
    if (formPlano === 'PROFISSIONAL') {
      formResponsavelId = data.userId ?? '';
    } else if (!formResponsavelId || formResponsavelId === data.userId) {
      formResponsavelId = membros[0]?.userId ?? data.userId ?? '';
    }
  }

  function limparFiltros() {
    statusFiltro = 'TODAS';
    escopoFiltro = 'MINHAS';
    responsavelFiltro = 'TODOS';
  }

  function validarForm(): boolean {
    if (!formNome.trim()) {
      toasts.show('error', 'O nome da meta e obrigatorio.');
      return false;
    }

    if (!formDataInicio || !formDataFim) {
      toasts.show('error', 'Informe o periodo da meta.');
      return false;
    }

    if (new Date(formDataFim) <= new Date(formDataInicio)) {
      toasts.show('error', 'A data final deve ser maior que a data inicial.');
      return false;
    }

    if (formMetaVisitas <= 0 && formMetaAvancos <= 0 && formMetaPrescritores <= 0) {
      toasts.show('error', 'Informe pelo menos um indicador da meta.');
      return false;
    }

    if (!formResponsavelId.trim()) {
      toasts.show('error', 'Informe o responsavel pela meta.');
      return false;
    }

    return true;
  }

  async function handleSalvarMeta() {
    if (!validarForm()) return;

    saving = true;
    const plano = podeGerenciarEquipe ? formPlano : 'PROFISSIONAL';
    const responsavelId = plano === 'PROFISSIONAL' ? data.userId : formResponsavelId.trim();
    const payload = {
      nome: formNome.trim(),
      descricao: formDescricao.trim() || undefined,
      dataInicio: inputDateToIso(formDataInicio),
      dataFim: inputDateToIso(formDataFim, true),
      metaVisitas: Number(formMetaVisitas) || 0,
      metaAvancosPipeline: Number(formMetaAvancos) || 0,
      metaPrescritores: Number(formMetaPrescritores) || 0,
      responsavelId,
      plano,
    };

    const url = metaEmEdicao ? `/metas/${metaEmEdicao.id}` : '/metas';
    const method = metaEmEdicao ? 'PUT' : 'POST';

    try {
      const res = await apiFetch(url, data.sessionToken, {
        method,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Erro ao salvar meta.');
      }

      const metaAtualizada: Meta = await res.json();
      metas = metaEmEdicao
        ? metas.map((meta) => (meta.id === metaAtualizada.id ? metaAtualizada : meta))
        : [metaAtualizada, ...metas];
      sheetOpen = false;
      toasts.show('success', metaEmEdicao ? 'Meta atualizada.' : 'Meta criada.');
    } catch (err) {
      toasts.show('error', err instanceof Error ? err.message : 'Erro ao salvar meta.');
    } finally {
      saving = false;
    }
  }

  function handleExcluirMeta(meta: Meta) {
    metaParaExcluir = meta;
    deleteConfirmOpen = true;
  }

  async function confirmarExclusao() {
    if (!metaParaExcluir) return;

    try {
      const res = await apiFetch(`/metas/${metaParaExcluir.id}`, data.sessionToken, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Erro ao excluir meta.');
      }

      metas = metas.filter((meta) => meta.id !== metaParaExcluir?.id);
      toasts.show('error', 'Meta excluida.');
      if (metaEmEdicao?.id === metaParaExcluir.id) {
        sheetOpen = false;
        metaEmEdicao = null;
      }
    } catch (err) {
      toasts.show('error', err instanceof Error ? err.message : 'Erro ao excluir meta.');
    } finally {
      deleteConfirmOpen = false;
      metaParaExcluir = null;
    }
  }

  onMount(() => {
    limparForm();
    if (!data.metas) void fetchMetas();
    if (podeGerenciarEquipe && membros.length === 0) void fetchMembros();
  });
</script>

<svelte:head>
  <title>Metas - MediVisitas</title>
</svelte:head>

<div class="space-y-6">
  <header class="page-header">
    <div class="page-header-main">
      <div class="page-header-icon">
        <Target class="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 class="page-title">Metas</h1>
        <p class="page-description">
          Acompanhe metas reais de visitas, avancos no pipeline e novos prescritores.
        </p>
      </div>
    </div>

    {#if metas.length > 0}
      <Button onclick={handleNovaMeta} class="gap-2">
        <Plus class="h-4 w-4" />
        Nova Meta
      </Button>
    {/if}
  </header>

  {#if podeGerenciarEquipe}
    <section class="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Esquerda: Título -->
        <div>
          <span class="text-xs font-bold text-ui-muted uppercase tracking-wider">Visualização</span>
          <h2 class="text-lg font-bold text-ui-primary mt-0.5">{tituloEscopo}</h2>
        </div>

        <!-- Direita: Controles alinhados horizontalmente -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <!-- Dropdown de membros (aparece apenas na aba Equipe, na mesma linha) -->
          {#if escopoFiltro === 'EQUIPE'}
            <div class="w-full sm:w-56">
              <select class="input-base h-10 w-full py-0" bind:value={responsavelFiltro}>
                <option value="TODOS">Todos os membros</option>
                {#each membros as membro}
                  <option value={membro.userId}>{membroLabel(membro.userId)}</option>
                {/each}
              </select>
            </div>
          {/if}

          <!-- Botões de Toggle -->
          <div class="segmented-control min-w-56 shrink-0">
            <button
              type="button"
              class="segmented-btn {escopoFiltro === 'MINHAS' ? 'seg-active-blue' : ''}"
              onclick={() => {
                escopoFiltro = 'MINHAS';
                responsavelFiltro = 'TODOS';
              }}
            >
              Minhas metas
            </button>
            <button
              type="button"
              class="segmented-btn {escopoFiltro === 'EQUIPE' ? 'seg-active-blue' : ''}"
              onclick={() => (escopoFiltro = 'EQUIPE')}
            >
              Equipe
            </button>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Metas Ativas -->
    <div class="interactive-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center text-center gap-2">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Target class="h-5 w-5" />
      </div>
      <span class="text-sm font-medium text-ui-secondary">Metas ativas</span>
      <span class="text-3xl font-bold text-ui-primary">{resumo.ativas}</span>
      <p class="text-xs text-ui-muted">
        <span class="font-medium text-blue-600">{resumo.total}</span> metas no total
      </p>
    </div>

    <!-- Concluídas -->
    <div class="interactive-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center text-center gap-2">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 class="h-5 w-5" />
      </div>
      <span class="text-sm font-medium text-ui-secondary">Concluídas</span>
      <span class="text-3xl font-bold text-emerald-600">{resumo.atingidas}</span>
      <p class="text-xs text-ui-muted">
        {#if resumo.taxaSucesso >= 50}
          <span class="inline-flex items-center gap-0.5 font-medium text-emerald-600"><TrendingUp class="h-3 w-3" /> {resumo.taxaSucesso}%</span>
        {:else}
          <span class="inline-flex items-center gap-0.5 font-medium text-ui-secondary"><TrendingDown class="h-3 w-3" /> {resumo.taxaSucesso}%</span>
        {/if}
        taxa de sucesso
      </p>
    </div>

    <!-- Em Risco -->
    <div class="interactive-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center text-center gap-2">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle class="h-5 w-5" />
      </div>
      <span class="text-sm font-medium text-ui-secondary">Em risco</span>
      <span class="text-3xl font-bold {resumo.emRisco > 0 ? 'text-red-600' : 'text-ui-primary'}">{resumo.emRisco}</span>
      <p class="text-xs text-ui-muted">
        {#if resumo.emRisco > 0}
          <span class="font-medium text-red-500">Atenção necessária</span>
        {:else}
          Nenhuma meta em risco
        {/if}
      </p>
    </div>

    <!-- Progresso Médio -->
    <div class="interactive-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center text-center gap-2">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600">
        <BarChart3 class="h-5 w-5" />
      </div>
      <span class="text-sm font-medium text-ui-secondary">Progresso médio</span>
      <span class="text-3xl font-bold text-ui-primary">{resumo.progressoMedio}%</span>
      <p class="text-xs text-ui-muted">
        {#if resumo.progressoMedio >= 70}
          <span class="inline-flex items-center gap-0.5 font-medium text-emerald-600"><TrendingUp class="h-3 w-3" /> Bom ritmo</span>
        {:else if resumo.progressoMedio >= 40}
          <span class="inline-flex items-center gap-0.5 font-medium text-amber-600">Ritmo moderado</span>
        {:else}
          <span class="inline-flex items-center gap-0.5 font-medium text-red-500"><TrendingDown class="h-3 w-3" /> Abaixo do esperado</span>
        {/if}
      </p>
    </div>
  </section>

  <section class="rounded-xl border bg-white shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b">
      <div>
        <h2 class="text-lg font-bold text-ui-primary">{tituloEscopo}</h2>
        <p class="text-sm text-ui-secondary">{metasFiltradas.length} meta(s) encontrada(s)</p>
      </div>
      <div class="w-full sm:w-64">
        <select class="input-base h-10 w-full py-0" bind:value={statusFiltro}>
          <option value="TODAS">Todos os status</option>
          <option value="ATIVA">Ativas</option>
          <option value="ATINGIDA">Atingidas</option>
          <option value="EXPIRADA">Expiradas</option>
        </select>
      </div>
    </div>

    {#if loading}
      <div class="flex items-center justify-center py-16">
        <Loader2 class="h-6 w-6 animate-spin text-[var(--brand-primary)]" />
      </div>
    {:else if metasFiltradas.length === 0 && metas.length > 0 && temFiltrosAtivos}
      <div class="px-5 py-16 text-center">
        <Target class="mx-auto h-12 w-12 text-[var(--text-muted)]" />
        <h3 class="mt-4 text-base font-semibold text-[var(--text-primary)]">Nenhuma meta encontrada com esses filtros</h3>
        <p class="mx-auto mt-1 max-w-md text-sm text-[var(--text-secondary)]">
          Ajuste o status ou limpe os filtros para voltar a visualizar as metas cadastradas.
        </p>
        <Button onclick={limparFiltros} class="mt-5" variant="outline">
          Limpar Filtros
        </Button>
      </div>
    {:else if metasFiltradas.length === 0}
      <div class="px-5 py-16 text-center">
        <Target class="mx-auto h-12 w-12 text-[var(--text-muted)]" />
        <h3 class="mt-4 text-base font-semibold text-[var(--text-primary)]">Nenhuma meta encontrada</h3>
        <p class="mx-auto mt-1 max-w-md text-sm text-[var(--text-secondary)]">
          Crie uma meta com pelo menos um indicador para acompanhar o desempenho real.
        </p>
        <Button onclick={handleNovaMeta} class="mt-5 gap-2">
          <Plus class="h-4 w-4" />
          Nova Meta
        </Button>
      </div>
    {:else}
      <div class="divide-y">
        {#each metasFiltradas as meta}
          {@const evolucao = evolucaoPeriodo(meta)}
          {@const indicadoresConfigurados = metaIndicadores(meta).filter(i => i.alvo > 0)}
          <div
            class="group relative cursor-pointer p-6 transition-all hover:bg-slate-50/60"
            role="button"
            tabindex="0"
            onclick={(event) => handleMetaCardClick(event, meta)}
            onkeydown={(event) => handleMetaCardKeydown(event, meta)}
          >
            <!-- Botões no canto superior direito -->
            <div class="absolute top-6 right-6 flex items-center gap-1">
              {#if metasExpandidas.has(meta.id)}
                <button
                  class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ui-muted transition-all hover:bg-blue-50 hover:text-blue-600"
                  onclick={(event) => { event.stopPropagation(); handleEditarMeta(meta); }}
                  title="Editar meta"
                  data-no-edit
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ui-muted transition-all hover:bg-red-50 hover:text-red-600"
                  onclick={(event) => { event.stopPropagation(); handleExcluirMeta(meta); }}
                  title="Excluir meta"
                  data-no-edit
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              {/if}
              <button
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ui-muted transition-all hover:bg-slate-100 hover-text-ui-secondary"
                onclick={(event) => toggleExpandMeta(event, meta.id)}
                title={metasExpandidas.has(meta.id) ? 'Recolher detalhes' : 'Expandir detalhes'}
                data-no-edit
              >
                <ChevronDown class="h-4 w-4 transition-transform duration-300 {metasExpandidas.has(meta.id) ? 'rotate-180' : ''}" />
              </button>
            </div>

            <!-- Cabeçalho da Meta -->
            <div class="flex items-start gap-4 mb-5 pr-14">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {#if meta.plano === 'EQUIPE'}
                  <Users class="h-6 w-6" />
                {:else}
                  <UserRound class="h-6 w-6" />
                {/if}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-3 mb-1">
                  <h3 class="text-lg font-bold text-ui-primary truncate">{meta.nome}</h3>
                  <span class="status-chip {statusClass(meta.status)}">{statusLabel(meta.status)}</span>
                  {#if meta.alertas?.prazoCritico}
                    <span class="status-chip status-danger">Prazo crítico</span>
                  {:else if meta.alertas?.emRisco}
                    <span class="status-chip status-warning">Em risco</span>
                  {/if}
                </div>
                <p class="text-sm text-ui-secondary">
                  {formatarData(meta.dataInicio)} a {formatarData(meta.dataFim)}
                  {#if meta.status === 'ATIVA'}
                    · <span class="font-medium text-ui-body">{diasRestantes(meta.dataFim)} dia(s) restantes</span>
                  {/if}
                </p>
                {#if meta.descricao}
                  <p class="text-sm text-ui-secondary mt-2">{meta.descricao}</p>
                {/if}
                {#if podeGerenciarEquipe || meta.plano === 'EQUIPE'}
                  <p class="mt-1 text-xs text-ui-secondary">
                    Responsável: <span class="font-medium text-ui-body">{membroLabel(meta.responsavelId)}</span>
                  </p>
                {/if}
              </div>
            </div>

            {#if metasExpandidas.has(meta.id)}
              <!-- Bloco de Progresso (expandido) -->
              <div class="rounded-xl bg-slate-50 border border-slate-100 p-5 animate-slide-down">
                {#if indicadoresConfigurados.length === 1}
                  <!-- Indicador único: layout compacto -->
                  {@const ind = indicadoresConfigurados[0]}
                  <div class="flex justify-between items-end mb-3">
                    <div>
                      <p class="text-sm font-semibold text-ui-primary mb-1">{ind.label}</p>
                      <span class="status-chip {evolucao.ritmo === 'No ritmo' ? 'status-success' : 'status-warning'}">{evolucao.ritmo}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-3xl font-black text-blue-600">{ind.realizado}</span>
                      <span class="text-sm font-medium text-ui-secondary"> / {ind.alvo} realizados</span>
                    </div>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                    <div
                      class="h-3 rounded-full transition-all duration-500"
                      style="width: {clampPercent(ind.percentual)}%; background-color: {barColor(ind.percentual)}"
                    ></div>
                  </div>
                  <div class="flex justify-between text-xs font-medium text-ui-secondary">
                    <span>{Math.round(ind.percentual)}% do objetivo alcançado</span>
                    <span>{evolucao.decorrido}% do tempo decorrido</span>
                  </div>
                {:else}
                  <!-- Múltiplos indicadores -->
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <p class="text-sm font-semibold text-ui-primary">Progresso geral</p>
                      <span class="status-chip mt-1 {evolucao.ritmo === 'No ritmo' ? 'status-success' : 'status-warning'}">{evolucao.ritmo}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-3xl font-black text-blue-600">{meta.progresso.geral}%</span>
                    </div>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
                    <div
                      class="h-3 rounded-full transition-all duration-500"
                      style="width: {clampPercent(meta.progresso.geral)}%; background-color: {barColor(meta.progresso.geral)}"
                    ></div>
                  </div>
                  <div class="grid gap-3 md:grid-cols-3" data-no-edit>
                    {#each indicadoresConfigurados as indicador}
                      <button
                        type="button"
                        class="rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors cursor-pointer hover:border-[var(--brand-primary)] hover:bg-[var(--brand-light)] {drilldownAtual?.metaId === meta.id && drilldownAtual?.key === indicador.key ? 'bg-[var(--brand-light)]' : ''}"
                        onclick={(event) => alternarDrilldown(event, meta, indicador.key)}
                      >
                        <p class="text-xs font-medium text-ui-secondary">{indicador.label}</p>
                        <p class="mt-1 text-lg font-bold text-ui-primary">
                          {indicador.realizado}<span class="text-sm font-normal text-ui-muted">/{indicador.alvo}</span>
                        </p>
                        <div class="mt-2 h-1.5 rounded-full bg-slate-100">
                          <div
                            class="h-1.5 rounded-full transition-all duration-500"
                            style="width: {clampPercent(indicador.percentual)}%; background-color: {barColor(indicador.percentual)}"
                          ></div>
                        </div>
                      </button>
                    {/each}
                  </div>
                  <div class="flex justify-between text-xs font-medium text-ui-secondary mt-3">
                    <span>{evolucao.progresso}% do objetivo alcançado</span>
                    <span>{evolucao.decorrido}% do tempo decorrido</span>
                  </div>
                {/if}
              </div>

              <!-- Drilldown -->
              {#if drilldownAtual?.metaId === meta.id}
                {@const detalhe = detalharIndicador(meta, drilldownAtual.key)}
                <div class="mt-4 rounded-xl border border-blue-200 p-4 animate-slide-down" data-no-edit>
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-ui-primary">{detalhe.label}</p>
                      <p class="mt-1 text-sm text-ui-secondary">{detalhe.descricao}</p>
                    </div>
                    <button
                      type="button"
                      class="text-sm font-medium text-blue-600 hover-text-ui-brand-strong transition-colors"
                      onclick={(event) => {
                        event.stopPropagation();
                        drilldownAtual = null;
                      }}
                    >
                      Fechar
                    </button>
                  </div>
                  <div class="mt-4 grid gap-3 sm:grid-cols-3">
                    <div class="rounded-lg bg-slate-50 p-3">
                      <p class="text-xs text-ui-secondary">Realizado</p>
                      <p class="mt-1 text-lg font-bold text-ui-primary">{detalhe.realizado}</p>
                    </div>
                    <div class="rounded-lg bg-slate-50 p-3">
                      <p class="text-xs text-ui-secondary">Meta</p>
                      <p class="mt-1 text-lg font-bold text-ui-primary">{detalhe.alvo}</p>
                    </div>
                    <div class="rounded-lg bg-slate-50 p-3">
                      <p class="text-xs text-ui-secondary">Restante</p>
                      <p class="mt-1 text-lg font-bold text-ui-primary">{detalhe.restante}</p>
                    </div>
                  </div>
                </div>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<Sheet open={sheetOpen} onclose={() => (sheetOpen = false)}>
  {#snippet children()}
    <div class="space-y-5">
      <div>
        <h3 class="text-lg font-semibold text-ui-primary">
          {metaEmEdicao ? 'Editar Meta' : 'Nova Meta'}
        </h3>
        <p class="mt-1 text-sm text-ui-muted">
          Defina o periodo, o responsavel e pelo menos um indicador.
        </p>
      </div>

      <form
        id="metaForm"
        class="space-y-5"
        onsubmit={(event) => {
          event.preventDefault();
          handleSalvarMeta();
        }}
      >
        <section>
          <h4 class="section-header">
            <Target class="h-3.5 w-3.5" />
            Identificacao
          </h4>
          <div class="space-y-3">
            <div>
              <label for="meta-nome" class="input-label">Nome <span class="text-ui-muted">*</span></label>
              <input id="meta-nome" bind:value={formNome} class="input-base" placeholder="Meta mensal de visitas" />
            </div>

            <div>
              <label for="meta-descricao" class="input-label">Descricao</label>
              <textarea
                id="meta-descricao"
                rows={3}
                bind:value={formDescricao}
                class="input-base resize-none"
                placeholder="Contexto da meta"
              ></textarea>
              <p class="input-hint">Opcional</p>
            </div>

            {#if podeGerenciarEquipe}
              <div>
                <span class="input-label">Tipo de meta</span>
                <div class="segmented-control" role="group" aria-label="Tipo de meta">
                  <button
                    type="button"
                    onclick={() => selecionarPlano('PROFISSIONAL')}
                    class="segmented-btn {formPlano === 'PROFISSIONAL' ? 'seg-active-blue' : ''}"
                  >
                    Pessoal
                  </button>
                  <button
                    type="button"
                    onclick={() => selecionarPlano('EQUIPE')}
                    class="segmented-btn {formPlano === 'EQUIPE' ? 'seg-active-blue' : ''}"
                  >
                    Equipe
                  </button>
                </div>
              </div>

              {#if formPlano === 'EQUIPE'}
                <div>
                  <label for="meta-responsavel" class="input-label">Responsavel <span class="text-red-500">*</span></label>
                  <select id="meta-responsavel" bind:value={formResponsavelId} class="input-base" disabled={loadingMembros}>
                    {#if membros.length === 0}
                      <option value="">Nenhum membro disponivel</option>
                    {:else}
                      {#each membros as membro}
                        <option value={membro.userId}>{membroLabel(membro.userId)}</option>
                      {/each}
                    {/if}
                  </select>
                  <p class="input-hint">Selecione o propagandista acompanhado por esta meta.</p>
                </div>
              {/if}
            {:else}
              <div class="rounded-lg border bg-[var(--brand-light)] p-3 text-sm text-[var(--brand-dark)]">
                Esta assinatura acompanha apenas metas pessoais.
              </div>
            {/if}
          </div>
        </section>

        <section>
          <h4 class="section-header">
            <CalendarDays class="h-3.5 w-3.5" />
            Periodo
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="meta-data-inicio" class="input-label">Data inicio</label>
              <input id="meta-data-inicio" type="date" bind:value={formDataInicio} class="input-base" />
            </div>
            <div>
              <label for="meta-data-fim" class="input-label">Data fim</label>
              <input id="meta-data-fim" type="date" bind:value={formDataFim} class="input-base" />
            </div>
          </div>
        </section>

        <section>
          <h4 class="section-header">
            <Target class="h-3.5 w-3.5" />
            Templates recorrentes
          </h4>
          <div class="grid gap-2">
            {#each templatesMeta as template}
              <button
                type="button"
                class="rounded-lg border border-[rgb(var(--slate-200))] bg-white p-3 text-left transition-colors cursor-pointer hover:border-[var(--brand-primary)] hover:bg-[var(--brand-light)]"
                onclick={() => aplicarTemplate(template)}
              >
                <p class="text-sm font-medium text-[var(--text-primary)]">{template.nome}</p>
                <p class="mt-1 text-xs text-[var(--text-secondary)]">{template.descricao}</p>
              </button>
            {/each}
          </div>
        </section>

        <section>
          <h4 class="section-header">
            <BarChart3 class="h-3.5 w-3.5" />
            Indicadores <span class="text-ui-muted">*</span>
          </h4>
          <p class="input-hint mb-3">
            Informe pelo menos uma meta: visitas, pipeline ou novos prescritores.
          </p>
          <div class="space-y-3">
            <div>
              <label for="meta-visitas" class="input-label">Meta de visitas</label>
              <input id="meta-visitas" type="number" min="0" bind:value={formMetaVisitas} class="input-base" />
              <p class="input-hint">Total de visitas realizadas no periodo.</p>
            </div>
            <div>
              <label for="meta-avancos" class="input-label">Meta de avanços no pipeline</label>
              <input id="meta-avancos" type="number" min="0" bind:value={formMetaAvancos} class="input-base" />
              <p class="input-hint">Mudancas de estagio registradas no periodo.</p>
            </div>
            <div>
              <label for="meta-prescritores" class="input-label">Meta de novos prescritores</label>
              <input id="meta-prescritores" type="number" min="0" bind:value={formMetaPrescritores} class="input-base" />
              <p class="input-hint">Profissionais que chegaram ao estagio Prescritor.</p>
            </div>
          </div>
        </section>
      </form>

      <div class="flex flex-col gap-3 border-t border-[rgb(var(--slate-100))] pt-4">
        <Button type="submit" form="metaForm" class="w-full gap-2" disabled={saving || !formMetaValido}>
          {#if saving}
            <Loader2 class="h-4 w-4 animate-spin" />
          {/if}
          {metaEmEdicao ? 'Salvar Alterações' : 'Cadastrar Meta'}
        </Button>
        {#if metaEmEdicao}
          <Button variant="destructive" type="button" onclick={() => handleExcluirMeta(metaEmEdicao!)} class="w-full" disabled={saving}>
            Excluir
          </Button>
        {/if}
        <Button variant="outline" onclick={() => (sheetOpen = false)} class="w-full" disabled={saving}>
          Cancelar
        </Button>
      </div>
    </div>
  {/snippet}
</Sheet>

<ConfirmDialog
  open={deleteConfirmOpen}
  onclose={() => {
    deleteConfirmOpen = false;
    metaParaExcluir = null;
  }}
  title="Excluir meta"
  onconfirm={confirmarExclusao}
  variant="danger"
>
  {#snippet description()}
    {#if metaParaExcluir}
      <p>Voce esta prestes a excluir <strong>"{metaParaExcluir.nome}"</strong>.</p>
      <p>Esta acao nao pode ser desfeita.</p>
    {/if}
  {/snippet}
</ConfirmDialog>

<style>
  .interactive-card {
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease;
  }

  .interactive-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgb(15 23 42 / 0.08);
  }

  .status-chip {
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
  }

  .status-brand {
    background-color: var(--brand-light);
    color: var(--brand-dark);
  }

  .status-success {
    background-color: var(--success-bg);
    color: var(--success-text);
  }

  .status-danger {
    background-color: var(--danger-light);
    color: var(--danger);
  }

  .status-warning {
    background-color: var(--trial-bg);
    color: var(--trial-text);
  }
</style>
