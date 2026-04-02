<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import type { Visita, PaginationInfo, StatusVisita, MaterialTecnico } from '$lib/types';
  import { Calendar, Clock, Package, Plus, Trash2, Edit2 } from 'lucide-svelte';
  import VisitaSheet from '$lib/components/ui/VisitaSheet.svelte';

  interface Props {
    data: { sessionToken: string | null };
  }

  let { data }: Props = $props();

  let visitas = $state<Visita[]>([]);
  let pagination = $state<PaginationInfo>({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  let loading = $state(true);
  let filtroStatus = $state<StatusVisita | ''>('');

  let materiaisOptions = $state<MaterialTecnico[]>([]);
  let sheetOpen = $state(false);
  let selectedVisita = $state<Visita | null>(null);

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
    sheetOpen = true;
  }

  function handleEditarVisita(event: Event, visita: Visita) {
    event.stopPropagation();
    selectedVisita = visita;
    sheetOpen = true;
  }

  let deleteConfirmOpen = $state(false);
  let visitaToDelete = $state<Visita | null>(null);

  function handleExcluirVisita(event: Event, visita: Visita) {
    event.stopPropagation();
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

  onMount(() => {
    loadVisitas();
    loadMateriais();
  });
</script>

<svelte:head>
	<title>Agenda de Visitas — MediVisitas</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex flex-wrap justify-between items-end gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Agenda de Visitas</h1>
      <p class="text-sm text-gray-500 mt-1">Gerencie seu cronograma global de visitas a profissionais.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <select 
        bind:value={filtroStatus} 
        onchange={() => loadVisitas(1)} 
        class="block bg-white rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm shadow-sm"
      >
        <option value="">Todos os status</option>
        <option value="AGENDADA">Agendadas</option>
        <option value="REALIZADA">Realizadas</option>
        <option value="CANCELADA">Canceladas</option>
        <option value="NAO_REALIZADA">Não Realizadas</option>
      </select>
      <Button onclick={handleNovaVisita} class="gap-2">
        <Plus class="w-4 h-4" /> Nova Visita
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
    {#if loading}
      <div class="flex justify-center p-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
      </div>
    {:else if visitas.length === 0}
      <div class="text-center py-20 bg-gray-50">
        <div class="flex justify-center mb-4">
          <div class="bg-indigo-100 p-3 rounded-full text-indigo-500">
            <Calendar class="mx-auto h-8 w-8" />
          </div>
        </div>
        <p class="text-sm font-medium text-gray-700">Nenhuma visita encontrada.</p>
        <p class="text-xs text-gray-500 mt-1">Use a página de Profissionais para reagendar ou planejar novos encontros.</p>
      </div>
    {:else}
      <ul class="divide-y divide-gray-100">
        {#each visitas as visita}
          <li 
            onclick={(e) => handleEditarVisita(e, visita)}
            class="group p-5 bg-white hover:bg-slate-50 hover:-translate-y-[1px] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative border-b border-gray-100 last:border-0"
          >
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <a href="/dashboard/profissionais/{visita.profissionalId}" onclick={(e) => e.stopPropagation()} class="text-base font-bold text-slate-900 hover:text-indigo-600 hover:underline">
                  {visita.profissional?.nome || 'Profissional Desconhecido'}
                </a>
                {#if visita.profissional?.especialidade}
                  <span class="text-[10px] uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                    {visita.profissional.especialidade.nome}
                  </span>
                {/if}
              </div>
              <div class="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar class="w-4 h-4 text-slate-400" />
                <span class="font-medium">
                  {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(visita.dataVisita))} às {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
                </span>
              </div>
            </div>
            
            <div class="flex flex-wrap items-center sm:justify-end gap-4 2xl:gap-6">
              {#if visita.duracaoMinutos}
                <div class="flex items-center gap-1.5 text-xs text-slate-500" title="Duração estimada">
                  <Clock class="w-3.5 h-3.5 text-slate-400" />
                  <span>{visita.duracaoMinutos} min</span>
                </div>
              {/if}
              <div class="flex items-center gap-1.5 text-xs text-slate-500" title={visita.materiais && visita.materiais.length > 0 ? visita.materiais.map(m => `${m.quantidade}x ${m.materialTecnico?.nome || 'Material'}`).join('\n') : 'Sem materiais'}>
                <Package class="w-3.5 h-3.5 text-slate-400" />
                <span>{visita.materiais?.length || 0} materiais</span>
              </div>
              <StatusVisitaBadge status={visita.status} />
              
              <!-- Ações -->
              <div class="flex items-center justify-center gap-1">
                <button type="button" onclick={(e) => handleEditarVisita(e, visita)} class="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors cursor-pointer" title="Editar/Detalhes">
                  <Edit2 class="w-4 h-4" />
                </button>
                <button type="button" onclick={(e) => handleExcluirVisita(e, visita)} class="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer" title="Excluir">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </li>
        {/each}
      </ul>
      {#if pagination.totalPages > 1}
        <div class="bg-gray-50 border-t px-5 py-3 flex justify-between items-center">
          <span class="text-sm text-gray-500 font-medium">Página {pagination.page} de {pagination.totalPages}</span>
          <div class="space-x-2">
            <Button variant="outline" size="sm" disabled={pagination.page <= 1} onclick={() => loadVisitas(pagination.page - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onclick={() => loadVisitas(pagination.page + 1)}>Próxima</Button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<VisitaSheet
  bind:open={sheetOpen}
  onclose={() => { sheetOpen = false; loadVisitas(pagination.page); }}
  visita={selectedVisita}
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
