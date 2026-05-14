<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { apiFetch } from '$lib/api';
  import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import type { Visita, PaginationInfo, StatusVisita, MaterialTecnico } from '$lib/types';
  import { Calendar, Clock, Package, Plus, Trash2, Search, FileText, ChevronLeft, ChevronRight, Copy, Mic } from 'lucide-svelte';
  import VisitaSheet from '$lib/components/ui/VisitaSheet.svelte';
  import ModalGravacao from '$lib/components/ui/ModalGravacao.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { toasts } from '$lib/stores/toast.svelte';

  interface Props {
    data: { sessionToken: string | null; visitas?: any; materiais?: any[] };
  }

  let { data }: Props = $props();

  let modalGravacaoAberto = $state(false);
  let visitaParaGravar = $state<string | null>(null);

  function abrirGravacaoVisita(event: Event, visita: Visita) {
    event.stopPropagation();
    if (isVisitaPassada(visita)) return;
    visitaParaGravar = visita.id;
    modalGravacaoAberto = true;
  }

  function handleGravacaoSalva() {
    loadVisitas(pagination.page);
  }

  function abrirGravacaoRapida() {
    if (!visitaGravacaoRapida) {
      toasts.show('info', 'Nenhuma visita disponível para gravar nesta página.');
      return;
    }
    visitaParaGravar = visitaGravacaoRapida.id;
    modalGravacaoAberto = true;
  }

  let visitas = $state<Visita[]>(untrack(() => data.visitas?.data ?? []));
  let pagination = $state<PaginationInfo>(
    untrack(() =>
      data.visitas
        ? { page: data.visitas.page ?? 1, pageSize: data.visitas.pageSize ?? 20, total: data.visitas.total ?? 0, totalPages: data.visitas.totalPages ?? 0 }
        : { page: 1, pageSize: 20, total: 0, totalPages: 0 },
    ),
  );
  let loading = $state(false);
  let filtroStatus = $state<StatusVisita | ''>('');
  let filtroBusca = $state('');
  let filtroDataInicio = $state('');
  let filtroDataFim = $state('');

  let temFiltrosAtivos = $derived(
    !!filtroBusca || !!filtroStatus || !!filtroDataInicio || !!filtroDataFim
  );

  let visitaGravacaoRapida = $derived(
    visitas.find((visita) => !isVisitaPassada(visita) && (visita.status === 'AGENDADA' || visita.status === 'REALIZADA')) ?? null
  );

  // Total real de visitas cadastradas (sem filtros)
  let totalCadastrados = $state(untrack(() => data.visitas?.total ?? 0));

  let materiaisOptions = $state<MaterialTecnico[]>(untrack(() => data.materiais ?? []));

  const potencialLabel: Record<string, string> = {
    ALTO: 'Alto',
    MEDIO: 'Médio',
    BAIXO: 'Baixo',
    ESTRATEGICO: 'Estratégico'
  };
  const estagioLabel: Record<string, string> = {
    PROSPECTADO: 'Prospectado',
    VISITADO: 'Visitado',
    INTERESSADO: 'Interessado',
    PRESCRITOR: 'Prescritor',
    FIDELIZADO: 'Fidelizado'
  };
  const classificacaoLabel: Record<string, string> = {
    FORTE: 'Forte',
    INTERMEDIARIO: 'Intermediário',
    FRACO: 'Fraco'
  };
  let sheetOpen = $state(false);
  let selectedVisita = $state<Visita | null>(null);
  let duplicateSource = $state<Visita | null>(null);

  async function loadMateriais() {
    try {
      const res = await apiFetch(`/materiais?pageSize=100`, data.sessionToken);
      if (res.ok) {
        const json = await res.json();
        materiaisOptions = json.data || json;
      }
    } catch (e) {
      console.error(e);
    }
  }

  type VisitaFilters = {
    status: StatusVisita | '';
    busca: string;
    dataInicio: string;
    dataFim: string;
  };

  async function loadVisitas(page = 1, filters: VisitaFilters = {
    status: filtroStatus,
    busca: filtroBusca,
    dataInicio: filtroDataInicio,
    dataFim: filtroDataFim
  }) {
    loading = true;
    try {
      let url = `/visitas?page=${page}&pageSize=${pagination.pageSize}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.busca.trim()) url += `&q=${encodeURIComponent(filters.busca.trim())}`;
      if (filters.dataInicio) url += `&dataInicio=${new Date(filters.dataInicio).toISOString()}`;
      if (filters.dataFim) url += `&dataFim=${new Date(filters.dataFim + 'T23:59:59').toISOString()}`;
      const res = await apiFetch(url, data.sessionToken);
      if (res.ok) {
        const json = await res.json();
        visitas = json.data || json;
        if (json.pagination) {
          pagination = json.pagination;
          // Atualiza total cadastrados apenas quando não há filtros
          if (!temFiltrosAtivos) {
            totalCadastrados = json.pagination.total;
          }
        }
      }
    } catch(err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function handleNovaVisita() {
    selectedVisita = null;
    duplicateSource = null;
    sheetOpen = true;
  }

  function handleEditarVisita(event: Event, visita: Visita) {
    event.stopPropagation();
    selectedVisita = visita;
    duplicateSource = null;
    sheetOpen = true;
  }

  function handleDuplicarVisita(event: Event, visita: Visita) {
    event.stopPropagation();
    selectedVisita = null;
    duplicateSource = visita;
    sheetOpen = true;
  }

  let deleteConfirmOpen = $state(false);
  let visitaToDelete = $state<Visita | null>(null);

  function handleExcluirVisita(event: Event, visita: Visita) {
    event.stopPropagation();
    if (isVisitaPassada(visita)) return;
    visitaToDelete = visita;
    deleteConfirmOpen = true;
  }

  async function confirmExcluirVisita() {
    if (!visitaToDelete) return;
    try {
      const res = await apiFetch(`/visitas/${visitaToDelete.id}`, data.sessionToken, { method: 'DELETE' });
      if (res.ok) {
        toasts.show('error', 'Visita excluída.');
        loadVisitas(pagination.page);
      } else {
        toasts.show('error', 'Erro ao excluir visita');
      }
    } catch {
      toasts.show('error', 'Erro ao excluir visita');
    }
    deleteConfirmOpen = false;
    visitaToDelete = null;
  }

  function isVisitaPassada(visita: Visita): boolean {
    if (visita.status === 'REALIZADA') return true;
    // CANCELADA e NAO_REALIZADA: só são "passadas" se a data já chegou
    const execTime = new Date(visita.dataVisita);
    if (visita.duracaoMinutos) {
      execTime.setMinutes(execTime.getMinutes() + visita.duracaoMinutos);
    }
    return execTime < new Date();
  }

  let filterTimeout: ReturnType<typeof setTimeout>;

  function limparFiltros() {
    filtroBusca = '';
    filtroStatus = '';
    filtroDataInicio = '';
    filtroDataFim = '';
    loadVisitas(1);
  }

  // Filtro em tempo real — debounce para busca por texto
  $effect(() => {
    const filters = {
      status: filtroStatus,
      busca: filtroBusca,
      dataInicio: filtroDataInicio,
      dataFim: filtroDataFim
    };
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => loadVisitas(1, filters), 300);
  });

  onMount(() => {
    if (materiaisOptions.length === 0) void loadMateriais();
  });
</script>

<svelte:head>
	<title>Histórico de Visitas — MediVisitas</title>
</svelte:head>

<div class="space-y-6 pb-24">
  <!-- Header -->
  <div class="page-header">
    <div class="page-header-main">
      <div class="page-header-icon">
        <FileText class="h-4.5 w-4.5 text-white" />
      </div>
      <div>
        <h1 class="page-title">Histórico de Visitas</h1>
        <p class="page-description">Gerencie seu cronograma global de visitas a profissionais.</p>
      </div>
    </div>
    {#if totalCadastrados > 0 || visitas.length > 0}
      <Button onclick={handleNovaVisita} class="gap-2">
        <Plus class="w-4 h-4" /> Nova Visita
      </Button>
    {/if}
  </div>

  <!-- Filtros -->
  <div class="card-surface p-4 mb-6" role="search" aria-label="Filtros de visitas">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1.4fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)]">
      <!-- Busca por nome -->
      <div class="relative">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ui-muted pointer-events-none" />
          <input
            id="buscaVisita"
            type="text"
            bind:value={filtroBusca}
            onkeydown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            placeholder="Buscar por profissional..."
            aria-label="Buscar por profissional"
            class="input-base !pl-9"
          />
        </div>
      </div>

      <!-- Data início -->
      <div>
        <label class="sr-only" for="dataInicio">Data início</label>
        <input
          id="dataInicio"
          type="date"
          bind:value={filtroDataInicio}
          aria-label="Filtrar por data inicial"
          title="Data início"
          class="input-base cursor-pointer"
        />
      </div>

      <!-- Data fim -->
      <div>
        <label class="sr-only" for="dataFim">Data fim</label>
        <input
          id="dataFim"
          type="date"
          bind:value={filtroDataFim}
          aria-label="Filtrar por data final"
          title="Data fim"
          class="input-base cursor-pointer"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="sr-only" for="filtroStatusVisita">Status</label>
        <select 
          id="filtroStatusVisita"
          bind:value={filtroStatus}
          aria-label="Filtrar por status"
          class="input-base cursor-pointer"
        >
          <option value="">Todos os status</option>
          <option value="AGENDADA">Agendadas</option>
          <option value="REALIZADA">Realizadas</option>
          <option value="CANCELADA">Canceladas</option>
          <option value="NAO_REALIZADA">Não Realizadas</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Grid / Tabela -->
  <div class="table-shell">
    {#if loading}
      <div class="flex justify-center p-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
      </div>
    {:else if visitas.length === 0 && temFiltrosAtivos}
      <div class="py-12 flex flex-col items-center justify-center text-center">
        <p class="text-muted-standard">Nenhuma visita encontrada com esses filtros.</p>
        <Button class="mt-4" variant="outline" onclick={limparFiltros}>Limpar Filtros</Button>
      </div>
    {:else if visitas.length === 0}
      <EmptyState
        icon={Calendar}
        titulo="Nenhuma visita cadastrada"
        descricao="Cadastre sua primeira visita para começar."
      >
        <Button onclick={handleNovaVisita} class="gap-2">
          <Plus class="w-4 h-4" /> Nova Visita
        </Button>
      </EmptyState>
    {:else}
      <div class="space-y-3 md:hidden">
        {#each visitas as visita}
          {@const passada = isVisitaPassada(visita)}
          <article class="rounded-xl border border-[rgb(var(--slate-200))] bg-white p-4 shadow-sm">
            <button
              type="button"
              class="w-full text-left"
              onclick={(e) => handleEditarVisita(e, visita)}
            >
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm">
                  {(visita.profissional?.nome || 'P').charAt(0).toUpperCase()}
                </div>
                <div class="min-w-0 flex-1">
                  <!-- Linha 1: Nome -->
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {visita.profissional?.nome || 'Profissional Desconhecido'}
                  </p>

                  <!-- Linha 2: Especialidade · Potencial · Estágio · Classificação -->
                  <p class="text-xs truncate">
                    <span class="text-gray-500">
                      {visita.profissional?.especialidade?.nome ?? '—'}
                    </span>
                    {#if visita.profissional?.potencial || visita.profissional?.estagioPipeline || visita.profissional?.classificacao}
                      <span class="text-gray-300"> · </span>
                      <span class="text-gray-400">
                        {[
                          potencialLabel[visita.profissional?.potencial ?? ''],
                          estagioLabel[visita.profissional?.estagioPipeline ?? ''],
                          classificacaoLabel[visita.profissional?.classificacao ?? '']
                        ].filter(Boolean).join(' · ')}
                      </span>
                    {/if}
                  </p>
                </div>
                <StatusVisitaBadge status={visita.status} />
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-ui-secondary">
                <div class="flex items-center gap-1.5">
                  <Calendar class="h-3.5 w-3.5 text-ui-muted" />
                  <span>
                    {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(visita.dataVisita))}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Clock class="h-3.5 w-3.5 text-ui-muted" />
                  <span>
                    {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Package class="h-3.5 w-3.5 text-ui-muted" />
                  <span>{visita.materiais?.length || 0} materiais</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Clock class="h-3.5 w-3.5 text-ui-muted" />
                  <span>{visita.duracaoMinutos ? `${visita.duracaoMinutos} min` : 'Sem duração'}</span>
                </div>
              </div>
            </button>

            <div class="mt-3 flex items-center justify-end gap-1 border-t border-[rgb(var(--slate-100))] pt-3">
              <button
                type="button"
                onclick={(e) => abrirGravacaoVisita(e, visita)}
                disabled={passada}
                class={passada
                  ? 'rounded-lg p-2 text-ui-disabled cursor-not-allowed'
                  : 'row-action hover:text-purple-600'}
                title={passada ? 'Visita já ocorrida' : 'Gravar áudio da visita'}
              >
                <Mic class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onclick={(e) => handleDuplicarVisita(e, visita)}
                class="row-action hover:text-indigo-600"
                title="Duplicar visita"
              >
                <Copy class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onclick={(e) => handleExcluirVisita(e, visita)}
                disabled={passada}
                class={passada
                  ? 'rounded-lg p-2 text-ui-disabled cursor-not-allowed'
                  : 'row-action hover:text-red-600'}
                title={passada ? 'Visita já ocorrida' : 'Excluir visita'}
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        {/each}
      </div>

      <div class="hidden overflow-x-auto md:block">
        <table class="data-table">
          <thead>
            <tr>
              <th class="table-head-cell text-left w-[28%]">Profissional</th>
              <th class="table-head-cell text-center w-[22%]">Data / Hora</th>
              <th class="table-head-cell text-center w-[12%]">Duração</th>
              <th class="table-head-cell text-center w-[12%]">Materiais</th>
              <th class="table-head-cell text-center w-[14%]">Status</th>
              <th class="table-head-cell text-center w-[12%]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {#each visitas as visita}
              {@const passada = isVisitaPassada(visita)}
              <tr 
                class="group border-t border-[rgb(var(--slate-50))] transition-all duration-200 cursor-pointer hover:bg-[rgb(var(--slate-50))]/60"
                onclick={(e) => handleEditarVisita(e, visita)}
              >
                <!-- Profissional -->
                <td class="table-cell">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm"
                    >
                      {(visita.profissional?.nome || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div class="min-w-0">
                      <!-- Linha 1: Nome -->
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {visita.profissional?.nome || 'Profissional Desconhecido'}
                      </p>

                      <!-- Linha 2: Especialidade · Potencial · Estágio · Classificação -->
                      <p class="text-xs truncate">
                        <span class="text-gray-500">
                          {visita.profissional?.especialidade?.nome ?? '—'}
                        </span>
                        {#if visita.profissional?.potencial || visita.profissional?.estagioPipeline || visita.profissional?.classificacao}
                          <span class="text-gray-300"> · </span>
                          <span class="text-gray-400">
                            {[
                              potencialLabel[visita.profissional?.potencial ?? ''],
                              estagioLabel[visita.profissional?.estagioPipeline ?? ''],
                              classificacaoLabel[visita.profissional?.classificacao ?? '']
                            ].filter(Boolean).join(' · ')}
                          </span>
                        {/if}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Data/Hora -->
                <td class="table-cell text-center">
                  <div class="inline-flex items-center gap-1.5 table-cell-primary">
                    <Calendar class="w-3.5 h-3.5 text-ui-muted shrink-0" />
                    <span>
                      {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(visita.dataVisita))}
                    </span>
                    <span>às</span>
                    <span>
                      {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
                    </span>
                  </div>
                </td>

                <!-- Duração -->
                <td class="table-cell text-center">
                  {#if visita.duracaoMinutos}
                    <div class="inline-flex items-center gap-1 table-cell-primary">
                      <Clock class="w-3.5 h-3.5 text-ui-muted" />
                      {visita.duracaoMinutos} min
                    </div>
                  {:else}
                    <span class="table-cell-empty">—</span>
                  {/if}
                </td>

                <!-- Materiais -->
                <td class="table-cell text-center">
                  <div class="inline-flex items-center gap-1 table-cell-primary" title={visita.materiais && visita.materiais.length > 0 ? visita.materiais.map(m => `${m.quantidade}x ${m.materialTecnico?.nome || 'Material'}`).join('\n') : 'Sem materiais'}>
                    <Package class="w-3.5 h-3.5 text-ui-muted" />
                    {visita.materiais?.length || 0}
                  </div>
                </td>

                <!-- Status -->
                <td class="table-cell text-center">
                  <StatusVisitaBadge status={visita.status} />
                </td>

                <!-- Ações -->
                <td class="table-cell">
                  <div class="flex justify-center items-center gap-0.5">
                    <button
                      type="button"
                      onclick={(e) => abrirGravacaoVisita(e, visita)}
                      disabled={passada}
                      class={passada
                        ? 'rounded-lg p-2 text-ui-disabled cursor-not-allowed'
                        : 'row-action hover:text-purple-600'}
                      title={passada ? 'Visita já ocorrida' : 'Gravar áudio da visita'}
                    >
                      <Mic class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onclick={(e) => handleDuplicarVisita(e, visita)}
                      class="row-action hover:text-indigo-600"
                      title="Duplicar visita"
                    >
                      <Copy class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onclick={(e) => handleExcluirVisita(e, visita)}
                      disabled={passada}
                      class={passada
                        ? 'rounded-lg p-2 text-ui-disabled cursor-not-allowed'
                        : 'row-action hover:text-red-600'}
                      title={passada ? 'Visita já ocorrida' : 'Excluir visita'}
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      {#if pagination.totalPages > 1}
        <div class="bg-[rgb(var(--slate-50))]/80 border-t border-[rgb(var(--slate-100))] px-5 py-3 flex justify-between items-center">
          <span class="table-cell-secondary">
            Página {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
          </span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onclick={() => loadVisitas(pagination.page - 1)}
              class="p-1.5 rounded-lg text-ui-muted hover-text-ui-secondary hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onclick={() => loadVisitas(pagination.page + 1)}
              class="p-1.5 rounded-lg text-ui-muted hover-text-ui-secondary hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

{#if !sheetOpen}
<button
  type="button"
  onclick={abrirGravacaoRapida}
  disabled={!visitaGravacaoRapida}
  class="fixed bottom-8 right-8 z-[9999] flex h-12 min-w-[14.5rem] cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
  style="background-color: var(--brand-primary); box-shadow: 0 14px 28px color-mix(in srgb, var(--brand-primary) 24%, transparent);"
  title={visitaGravacaoRapida ? `Gravar transcrição para ${visitaGravacaoRapida.profissional?.nome || 'visita'}` : 'Nenhuma visita disponível para gravar'}
>
  <Mic class="h-4 w-4" />
  Gravar transcrição com IA
</button>
{/if}


{#if visitaParaGravar}
  <ModalGravacao
    bind:open={modalGravacaoAberto}
    visitaId={visitaParaGravar}
    profissionalEstagio={visitas.find(v => v.id === visitaParaGravar)?.profissional?.estagioPipeline}
    sessionToken={data.sessionToken}
    onclose={() => { modalGravacaoAberto = false; visitaParaGravar = null; }}
    onsave={handleGravacaoSalva}
  />
{/if}

<VisitaSheet
  bind:open={sheetOpen}
  onclose={() => { sheetOpen = false; duplicateSource = null; }}
  onsave={() => { sheetOpen = false; duplicateSource = null; loadVisitas(pagination.page); }}
  ondelete={() => { sheetOpen = false; loadVisitas(pagination.page); }}
  visita={selectedVisita}
  duplicateSource={duplicateSource}
  sessionToken={data.sessionToken}
  {materiaisOptions}
/>

<ConfirmDialog
  open={deleteConfirmOpen}
  title="Excluir/Cancelar Visita"
  confirmLabel="Excluir"
  variant="danger"
  onclose={() => deleteConfirmOpen = false}
  onconfirm={confirmExcluirVisita}
>
  {#snippet description()}
    <p>A exclusão de dados é permanente, deseja prosseguir?</p>
  {/snippet}
</ConfirmDialog>

<style>
  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
</style>
