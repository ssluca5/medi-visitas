<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import type { Visita, PaginationInfo, StatusVisita, MaterialTecnico } from '$lib/types';
  import { Calendar, Clock, Package, Plus, Trash2, Search, CalendarDays, ChevronLeft, ChevronRight, Copy } from 'lucide-svelte';
  import VisitaSheet from '$lib/components/ui/VisitaSheet.svelte';
  import BotaoGravacao from '$lib/components/ui/BotaoGravacao.svelte';
  import ModalGravacao from '$lib/components/ui/ModalGravacao.svelte';

  interface Props {
    data: { sessionToken: string | null };
  }

  let { data }: Props = $props();

  let modalGravacaoAberto = $state(false);
  let visitaParaGravar = $state<string | null>(null);

  function abrirGravacao() {
    const visitaGravavel = visitas.find(v => v.status === 'AGENDADA' || v.status === 'REALIZADA');
    if (visitaGravavel) {
      visitaParaGravar = visitaGravavel.id;
      modalGravacaoAberto = true;
    }
  }

  function handleGravacaoSalva() {
    loadVisitas(pagination.page);
  }

  let visitas = $state<Visita[]>([]);
  let pagination = $state<PaginationInfo>({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  let loading = $state(true);
  let filtroStatus = $state<StatusVisita | ''>('');
  let filtroBusca = $state('');
  let filtroDataInicio = $state('');
  let filtroDataFim = $state('');

  let materiaisOptions = $state<MaterialTecnico[]>([]);
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

  async function loadVisitas(page = 1) {
    loading = true;
    try {
      let url = `/visitas?page=${page}&pageSize=${pagination.pageSize}`;
      if (filtroStatus) url += `&status=${filtroStatus}`;
      if (filtroBusca.trim()) url += `&q=${encodeURIComponent(filtroBusca.trim())}`;
      if (filtroDataInicio) url += `&dataInicio=${new Date(filtroDataInicio).toISOString()}`;
      if (filtroDataFim) url += `&dataFim=${new Date(filtroDataFim + 'T23:59:59').toISOString()}`;
      const res = await apiFetch(url, data.sessionToken);
      if (res.ok) {
        const json = await res.json();
        visitas = json.data || json;
        if (json.pagination) pagination = json.pagination;
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
        loadVisitas(pagination.page);
      } else {
        alert('Erro ao excluir visita');
      }
    } catch {}
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
    // Track all filter values
    filtroBusca;
    filtroStatus;
    filtroDataInicio;
    filtroDataFim;
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => loadVisitas(1), 300);
  });

  onMount(() => {
    loadVisitas();
    loadMateriais();
  });
</script>

<svelte:head>
	<title>Histórico de Visitas — MediVisitas</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
        <CalendarDays class="h-4.5 w-4.5 text-white" />
      </div>
      <div>
        <h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Histórico de Visitas</h1>
        <p class="text-xs text-[rgb(var(--slate-400))]">Gerencie seu cronograma global de visitas a profissionais</p>
      </div>
    </div>
    <Button onclick={handleNovaVisita} class="gap-2">
      <Plus class="w-4 h-4" /> Nova Visita
    </Button>
  </div>

  <!-- Filtros -->
  <div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] p-4">
    <div class="flex flex-wrap items-end gap-3">
      <!-- Busca por nome -->
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="buscaVisita">Buscar por profissional</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--slate-400))]">
            <Search class="w-4 h-4" />
          </span>
          <input
            id="buscaVisita"
            type="text"
            bind:value={filtroBusca}
            onkeydown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            placeholder="Nome do profissional..."
            class="block w-full pl-9 rounded-lg border border-[rgb(var(--slate-200))] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-[rgb(var(--slate-50))]/50"
          />
        </div>
      </div>

      <!-- Data início -->
      <div class="min-w-[160px]">
        <label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="dataInicio">Data início</label>
        <input
          id="dataInicio"
          type="date"
          bind:value={filtroDataInicio}
          class="block w-full rounded-lg border border-[rgb(var(--slate-200))] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-[rgb(var(--slate-50))]/50 cursor-pointer"
        />
      </div>

      <!-- Data fim -->
      <div class="min-w-[160px]">
        <label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="dataFim">Data fim</label>
        <input
          id="dataFim"
          type="date"
          bind:value={filtroDataFim}
          class="block w-full rounded-lg border border-[rgb(var(--slate-200))] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 bg-[rgb(var(--slate-50))]/50 cursor-pointer"
        />
      </div>

      <!-- Status -->
      <div class="min-w-[150px]">
        <label class="block text-xs font-medium text-[rgb(var(--slate-500))] mb-1.5" for="filtroStatusVisita">Status</label>
        <select 
          id="filtroStatusVisita"
          bind:value={filtroStatus}
          class="block w-full bg-[rgb(var(--slate-50))]/50 rounded-lg border border-[rgb(var(--slate-200))] py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 shadow-sm cursor-pointer"
        >
          <option value="">Todos</option>
          <option value="AGENDADA">Agendadas</option>
          <option value="REALIZADA">Realizadas</option>
          <option value="CANCELADA">Canceladas</option>
          <option value="NAO_REALIZADA">Não Realizadas</option>
        </select>
      </div>

      <!-- Botões -->
      <div class="flex gap-2">
        <button
          type="button"
          onclick={limparFiltros}
          class="px-3 py-2 text-xs font-medium text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))] border border-[rgb(var(--slate-200))] rounded-lg hover:bg-[rgb(var(--slate-50))] transition-colors cursor-pointer"
        >
          Limpar
        </button>
      </div>
    </div>
  </div>

  <!-- Grid / Tabela -->
  <div class="bg-white rounded-xl shadow-sm border border-[rgb(var(--slate-200))] overflow-hidden">
    {#if loading}
      <div class="flex justify-center p-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
      </div>
    {:else if visitas.length === 0}
      <div class="text-center py-20 bg-[rgb(var(--slate-50))]">
        <div class="flex justify-center mb-4">
          <div class="bg-indigo-100 p-3 rounded-full text-indigo-500">
            <Calendar class="mx-auto h-8 w-8" />
          </div>
        </div>
        <p class="text-sm font-medium text-[rgb(var(--slate-700))]">Nenhuma visita encontrada.</p>
        <p class="text-xs text-[rgb(var(--slate-400))] mt-1">Cadastre uma nova visita clicando no botão acima.</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="table-fixed w-full">
          <thead>
            <tr class="border-b border-[rgb(var(--slate-100))]">
              <th class="text-left p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[24%]">Profissional</th>
              <th class="text-left p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[22%]">Data / Hora</th>
              <th class="text-center p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[12%]">Duração</th>
              <th class="text-center p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[12%]">Materiais</th>
              <th class="text-center p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[18%]">Status</th>
              <th class="text-center p-3.5 text-xs font-medium text-[rgb(var(--slate-400))] uppercase tracking-wider w-[12%]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {#each visitas as visita}
              {@const passada = isVisitaPassada(visita)}
              <tr 
                class="border-t border-[rgb(var(--slate-50))] transition-all duration-200 cursor-pointer hover:bg-[rgb(var(--slate-50))]/60 group {passada ? 'opacity-70' : ''}"
                onclick={(e) => handleEditarVisita(e, visita)}
              >
                <!-- Profissional -->
                <td class="p-3.5">
                  <div>
                    <p class="text-sm font-medium text-[rgb(var(--slate-900))]">{visita.profissional?.nome || 'Profissional Desconhecido'}</p>
                    {#if visita.profissional?.especialidade}
                      <span class="text-xs text-[rgb(var(--slate-400))]">
                        {visita.profissional.especialidade.nome}
                      </span>
                    {/if}
                  </div>
                </td>

                <!-- Data/Hora -->
                <td class="p-3.5">
                  <div class="flex items-center gap-1.5 text-sm text-[rgb(var(--slate-700))]">
                    <Calendar class="w-3.5 h-3.5 text-[rgb(var(--slate-400))] shrink-0" />
                    <span class="font-medium">
                      {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(visita.dataVisita))}
                    </span>
                    <span class="font-medium">às</span>
                    <span class="font-medium">
                      {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
                    </span>
                  </div>
                </td>

                <!-- Duração -->
                <td class="p-3.5 text-center">
                  {#if visita.duracaoMinutos}
                    <div class="inline-flex items-center gap-1 text-sm text-[rgb(var(--slate-600))]">
                      <Clock class="w-3.5 h-3.5 text-[rgb(var(--slate-400))]" />
                      {visita.duracaoMinutos} min
                    </div>
                  {:else}
                    <span class="text-sm text-[rgb(var(--slate-300))]">—</span>
                  {/if}
                </td>

                <!-- Materiais -->
                <td class="p-3.5 text-center">
                  <div class="inline-flex items-center gap-1 text-sm text-[rgb(var(--slate-600))]" title={visita.materiais && visita.materiais.length > 0 ? visita.materiais.map(m => `${m.quantidade}x ${m.materialTecnico?.nome || 'Material'}`).join('\n') : 'Sem materiais'}>
                    <Package class="w-3.5 h-3.5 text-[rgb(var(--slate-400))]" />
                    {visita.materiais?.length || 0}
                  </div>
                </td>

                <!-- Status -->
                <td class="p-3.5 text-center">
                  <StatusVisitaBadge status={visita.status} />
                </td>

                <!-- Ações -->
                <td class="p-3.5">
                  <div class="flex justify-center items-center gap-0.5">
                    <button
                      type="button"
                      onclick={(e) => handleDuplicarVisita(e, visita)}
                      class="p-2 rounded-lg transition-all duration-200 cursor-pointer
                        text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:text-indigo-600 hover:bg-[rgb(var(--slate-100))]"
                      title="Duplicar visita"
                    >
                      <Copy class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onclick={(e) => handleExcluirVisita(e, visita)}
                      disabled={passada}
                      class="p-2 rounded-lg transition-all duration-200 cursor-pointer
                        {passada ? 'text-[rgb(var(--slate-300))] cursor-not-allowed' : 'text-[rgb(var(--slate-500))] opacity-60 hover:opacity-100 hover:text-red-600 hover:bg-[rgb(var(--slate-100))]'}"
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
          <span class="text-sm text-[rgb(var(--slate-500))] font-medium">
            Página {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
          </span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onclick={() => loadVisitas(pagination.page - 1)}
              class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onclick={() => loadVisitas(pagination.page + 1)}
              class="p-1.5 rounded-lg text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<BotaoGravacao onclick={abrirGravacao} />

{#if visitaParaGravar}
  <ModalGravacao
    bind:open={modalGravacaoAberto}
    visitaId={visitaParaGravar}
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
