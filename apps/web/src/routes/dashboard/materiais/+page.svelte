<script lang="ts">
  import { Plus, Trash2, Package, Tag, FileText, Database, Info, Power, Play, Search, Pencil } from 'lucide-svelte';
  import { apiFetch } from '$lib/api';
  import { toasts } from '$lib/stores/toast';
  import Button from '$lib/components/ui/Button.svelte';
  import Sheet from '$lib/components/ui/Sheet.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import type { MaterialTecnico, TipoMaterial } from '$lib/types';
  import { onMount } from 'svelte';

  interface Props {
    data: { sessionToken: string | null };
  }

  let { data }: Props = $props();

  let materiais = $state<MaterialTecnico[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Filters
  let filtroBusca = $state('');
  let filtroTipo = $state<TipoMaterial | ''>('');

  let materiaisFiltrados = $derived(
    materiais.filter(m => {
      const matchBusca = !filtroBusca || m.nome.toLowerCase().includes(filtroBusca.toLowerCase()) || (m.descricao && m.descricao.toLowerCase().includes(filtroBusca.toLowerCase()));
      const matchTipo = !filtroTipo || m.tipo === filtroTipo;
      return matchBusca && matchTipo;
    })
  );

  // Edit/Create state
  let sheetOpen = $state(false);
  let materialEmEdicao = $state<MaterialTecnico | null>(null);
  let formNome = $state('');
  let formDescricao = $state('');
  let formTipo = $state<TipoMaterial>('AMOSTRA');
  let isSaving = $state(false);

  // Delete state
  let deleteConfirmOpen = $state(false);
  let itemToDelete = $state<MaterialTecnico | null>(null);

  async function loadMateriais() {
    loading = true;
    error = null;
    try {
      const res = await apiFetch('/materiais?pageSize=500&incluirInativos=true', data.sessionToken);
      if (!res.ok) throw new Error('Erro ao carregar materiais');
      const json = await res.json();
      materiais = json.data || json;
    } catch(err) {
      error = err instanceof Error ? err.message : 'Erro';
    } finally {
      loading = false;
    }
  }

  onMount(() => loadMateriais());

  function handleNovo() {
    materialEmEdicao = null;
    formNome = '';
    formDescricao = '';
    formTipo = 'AMOSTRA';
    sheetOpen = true;
  }

  function handleEditar(m: MaterialTecnico) {
    materialEmEdicao = m;
    formNome = m.nome;
    formDescricao = m.descricao || '';
    formTipo = m.tipo;
    sheetOpen = true;
  }

  async function handleSalvar() {
    if (!formNome.trim()) {
      toasts.show('error', 'Nome é obrigatório');
      return;
    }
    isSaving = true;
    try {
      const payload = {
        nome: formNome,
        descricao: formDescricao || null,
        tipo: formTipo
      };
      
      const url = materialEmEdicao ? `/materiais/${materialEmEdicao.id}` : '/materiais';
      const method = materialEmEdicao ? 'PUT' : 'POST';

      const res = await apiFetch(url, data.sessionToken, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toasts.show('success', 'Material salvo com sucesso');
        sheetOpen = false;
        loadMateriais();
      } else {
        const errorData = await res.json().catch(() => null);
        toasts.show('error', errorData?.error || 'Erro ao salvar material');
      }
    } catch(err) {
      toasts.show('error', 'Erro ao salvar material');
    } finally {
      isSaving = false;
    }
  }

  function handleExcluir(m: MaterialTecnico) {
    itemToDelete = m;
    deleteConfirmOpen = true;
  }

  async function confirmarExcluir() {
    if (!itemToDelete) return;
    try {
      const res = await apiFetch(`/materiais/${itemToDelete.id}`, data.sessionToken, { method: 'DELETE' });
      if (res.ok) {
        toasts.show('success', 'Material excluído');
        materiais = materiais.filter(m => m.id !== itemToDelete!.id);
      } else {
        toasts.show('error', 'Erro ao excluir material');
      }
    } catch(e) {
      toasts.show('error', 'Erro interno');
    } finally {
      deleteConfirmOpen = false;
      itemToDelete = null;
    }
  }

  async function handleToggleAtivo(material: MaterialTecnico) {
    const isAtivo = !material.deletedAt;
    try {
      const res = await apiFetch(`/materiais/${material.id}/ativo`, data.sessionToken, {
        method: 'PATCH',
        body: JSON.stringify({ ativo: !isAtivo })
      });
      if (res.ok) {
        const json = await res.json();
        materiais = materiais.map(m => m.id === json.id ? json : m);
        toasts.show('success', isAtivo ? `"${material.nome}" inativado.` : `"${material.nome}" reativado.`);
      } else {
        toasts.show('error', 'Erro ao mudar status do material');
      }
    } catch(e) {
      toasts.show('error', 'Erro interno');
    }
  }

  function getTipoLabel(tipo: TipoMaterial) {
    switch (tipo) {
      case 'AMOSTRA': return 'Amostra Grátis';
      case 'BULA': return 'Bula';
      case 'APRESENTACAO': return 'Apresentação';
      case 'FOLDER': return 'Folder';
      case 'OUTRO': return 'Outro';
    }
    return tipo;
  }

  function getBadgeClasses(tipo: TipoMaterial) {
    switch (tipo) {
      case 'AMOSTRA': return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      case 'APRESENTACAO': return 'bg-indigo-50 text-indigo-700 border-indigo-200/50';
      case 'FOLDER': return 'bg-blue-50 text-blue-700 border-blue-200/50';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  }
</script>

<svelte:head>
  <title>Materiais e Amostras — MediVisitas</title>
</svelte:head>

<!-- Page Header -->
<header class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Materiais & Amostras</h2>
    <p class="text-sm text-slate-500 mt-1">{materiais.length} material(is) cadastrado(s)</p>
  </div>
  <Button onclick={handleNovo} class="hidden sm:flex gap-2">
    <Plus class="h-4 w-4" /> Novo Material
  </Button>
</header>

<!-- Filters -->
<div class="card-surface p-4 mb-6">
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Buscar por nome ou descrição..."
        bind:value={filtroBusca}
        class="input-base !pl-9 w-full"
      />
    </div>
    <div class="w-full sm:w-64 shrink-0">
      <select bind:value={filtroTipo} class="input-base w-full">
        <option value="">Todos os tipos</option>
        <option value="AMOSTRA">Amostra Grátis</option>
        <option value="BULA">Bula</option>
        <option value="APRESENTACAO">Apresentação</option>
        <option value="FOLDER">Folder / Informativo</option>
        <option value="OUTRO">Outro</option>
      </select>
    </div>
  </div>
</div>

{#if loading}
  <div class="card-surface py-20 flex flex-col items-center justify-center">
    <div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 mb-4"></div>
    <p class="text-slate-500 text-sm">Carregando...</p>
  </div>
{:else if error}
  <div class="card-surface py-20 flex flex-col items-center justify-center">
    <Database class="h-8 w-8 text-red-500 mb-2" />
    <p class="text-slate-700 font-medium">Falha ao conectar no servidor</p>
    <p class="text-slate-500 text-sm">{error}</p>
    <Button class="mt-4" variant="outline" onclick={loadMateriais}>Tentar novamente</Button>
  </div>
{:else if materiais.length === 0}
  <div class="card-surface py-20 flex flex-col items-center justify-center text-center px-4">
    <Package class="h-10 w-10 text-slate-300 mb-4" />
    <h3 class="text-lg font-medium text-slate-900">Nenhum material encontrado</h3>
    <p class="text-slate-500 max-w-sm mt-2 mb-6">Cadastre as amostras grátis, folders e apresentações que os RCs distribuem aos médicos.</p>
    <Button onclick={handleNovo} class="gap-2">
      <Plus class="h-4 w-4" /> Cadastrar Primeiro Material
    </Button>
  </div>
{:else}
  <div class="card-surface overflow-hidden">
    <table class="table-fixed w-full">
      <thead>
        <tr class="border-b border-slate-100">
          <th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[35%]">Material</th>
          <th class="p-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-[35%]">Descrição</th>
          <th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Tipo</th>
          <th class="p-3.5 text-center text-xs font-medium text-slate-400 uppercase tracking-wider w-[15%]">Ações</th>
        </tr>
      </thead>
      <tbody>
        {#each materiaisFiltrados as material (material.id)}
          {@const isAtivo = !material.deletedAt}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <tr
            class="group border-t border-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/60"
            class:opacity-50={!isAtivo}
            onclick={() => handleEditar(material)}
          >
            <td class="p-3.5">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-sm"
                  class:bg-indigo-50={isAtivo}
                  class:text-indigo-600={isAtivo}
                  class:border={isAtivo}
                  class:border-indigo-100={isAtivo}
                  class:bg-slate-100={!isAtivo}
                  class:text-slate-400={!isAtivo}
                >
                  <Package class="h-4 w-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate" class:text-slate-900={isAtivo} class:text-slate-400={!isAtivo}>
                    {material.nome}
                  </p>
                  {#if !isAtivo}
                    <p class="text-[10px] uppercase font-bold tracking-wider rounded text-red-600 mt-0.5">
                      Inativo
                    </p>
                  {/if}
                </div>
              </div>
            </td>
            <td class="p-3.5 text-left">
              {#if material.descricao}
                <span class="text-sm text-slate-500 truncate block">
                  {material.descricao}
                </span>
              {:else}
                <span class="text-sm text-slate-300 truncate block">
                  —
                </span>
              {/if}
            </td>
            <td class="p-3.5 text-center">
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wider uppercase border {getBadgeClasses(material.tipo)}">
                {getTipoLabel(material.tipo)}
              </span>
            </td>
            <td class="p-3.5">
              <div class="flex justify-center items-center gap-1">
                <button
                  onclick={(e) => { e.stopPropagation(); handleToggleAtivo(material); }}
                  title={isAtivo ? 'Inativar' : 'Ativar'}
                  class="p-1.5 rounded-md text-slate-400 transition-colors cursor-pointer {isAtivo ? 'hover:text-amber-600 hover:bg-amber-50' : 'hover:text-green-600 hover:bg-green-50'}"
                >
                  {#if isAtivo}
                    <Power class="w-4 h-4" />
                  {:else}
                    <Play class="w-4 h-4" />
                  {/if}
                </button>
                <button
                  onclick={(e) => { e.stopPropagation(); handleEditar(material); }}
                  title="Editar"
                  class="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  onclick={(e) => { e.stopPropagation(); handleExcluir(material); }}
                  title="Excluir"
                  class="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if materiaisFiltrados.length === 0 && materiais.length > 0}
      <div class="py-12 flex flex-col items-center justify-center text-center">
        <p class="text-slate-500 text-sm">Nenhum material encontrado com esses filtros.</p>
        <Button class="mt-4" variant="outline" onclick={() => { filtroBusca = ''; filtroTipo = ''; }}>Limpar Filtros</Button>
      </div>
    {/if}
  </div>
{/if}

<!-- Mobile FAB -->
<Button
  class="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center !rounded-full shadow-lg sm:hidden z-10 p-0"
  onclick={handleNovo}
>
  <Plus class="h-6 w-6 text-white" />
</Button>

<!-- Form Sheet -->
<Sheet bind:open={sheetOpen} onclose={() => sheetOpen = false}>
  {#snippet children()}
    <div class="h-full flex flex-col">
      <div class="mb-6 px-1">
        <h3 class="text-lg font-bold text-slate-900">
          {materialEmEdicao ? 'Editar Material' : 'Novo Material'}
        </h3>
        <p class="text-sm text-slate-500 mt-1">Preencha os detalhes da amostra ou material técnico</p>
      </div>

      <div class="space-y-5 px-1 flex-1">
        <div>
          <label for="tipo" class="block text-sm font-semibold text-slate-700 mb-1">Tipo de Material</label>
          <select 
            id="tipo" 
            bind:value={formTipo}
            class="block w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white"
          >
            <option value="AMOSTRA">Amostra Grátis</option>
            <option value="BULA">Bula</option>
            <option value="APRESENTACAO">Apresentação</option>
            <option value="FOLDER">Folder / Informativo</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>

        <div>
          <label for="nome" class="block text-sm font-semibold text-slate-700 mb-1">Nome do Produto</label>
          <input 
            id="nome" 
            bind:value={formNome} 
            type="text" 
            placeholder="Ex: Medicamento X 500mg" 
            class="block w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border placeholder:text-slate-400"
          />
        </div>

        <div>
          <label for="desc" class="block text-sm font-semibold text-slate-700 mb-1">Descrição</label>
          <textarea 
            id="desc" 
            bind:value={formDescricao} 
            rows="3" 
            placeholder="Observações adicionais ou notas técnicas..."
            class="block w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border resize-none placeholder:text-slate-400"
          ></textarea>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-8">
        <Button variant="outline" onclick={() => sheetOpen = false} disabled={isSaving}>Cancelar</Button>
        <Button onclick={handleSalvar} disabled={isSaving || !formNome.trim()}>
          {isSaving ? 'Salvando...' : 'Salvar Material'}
        </Button>
      </div>
    </div>
  {/snippet}
</Sheet>

<ConfirmDialog
  open={deleteConfirmOpen}
  title="Excluir Material"
  confirmLabel="Excluir"
  variant="danger"
  onclose={() => deleteConfirmOpen = false}
  onconfirm={confirmarExcluir}
>
  {#snippet description()}
    <p>Tem certeza que deseja excluir '<strong>{itemToDelete?.nome}</strong>'?</p>
    <p>Isso poderá afetar o histórico de visitas que usaram este item.</p>
  {/snippet}
</ConfirmDialog>
