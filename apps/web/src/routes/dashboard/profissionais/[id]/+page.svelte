<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import { ChevronLeft, CalendarPlus, User, History } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
  import VisitaSheet from '$lib/components/ui/VisitaSheet.svelte';
  import type { Profissional, Visita, MaterialTecnico } from '$lib/types';

  interface Props {
    data: { sessionToken: string | null };
  }

  let { data }: Props = $props();

  let id = $derived($page.params.id);
  let profissional = $state<Profissional | null>(null);
  let visitas = $state<Visita[]>([]);
  let materiaisOptions = $state<MaterialTecnico[]>([]);
  let loading = $state(true);
  let activeTab = $state<'dados' | 'historico'>('historico');
  
  let visitaSheetOpen = $state(false);
  let visitaEmEdicao = $state<Visita | null>(null);

  async function loadData() {
    loading = true;
    try {
      const [profRes, visitasRes, matRes] = await Promise.all([
        apiFetch(`/profissionais/${id}`, data.sessionToken),
        apiFetch(`/visitas?profissionalId=${id}`, data.sessionToken),
        apiFetch(`/materiais`, data.sessionToken)
      ]);
      
      if (profRes.ok) profissional = await profRes.json();
      if (visitasRes.ok) {
        const json = await visitasRes.json();
        visitas = json.data || json;
      }
      if (matRes.ok) {
        const json = await matRes.json();
        materiaisOptions = json.data || json;
      }
    } catch(err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadData();
  });

  function handleNovaVisita() {
    visitaEmEdicao = null;
    visitaSheetOpen = true;
  }

  function handleEditarVisita(visita: Visita) {
    visitaEmEdicao = visita;
    visitaSheetOpen = true;
  }
</script>

<svelte:head>
	<title>{profissional ? profissional.nome : 'Perfil do Profissional'} — MediVisitas</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center gap-4">
    <Button href="/dashboard/profissionais" variant="outline" size="sm" class="gap-2">
      <ChevronLeft class="w-4 h-4" /> Voltar
    </Button>
    <h1 class="text-2xl font-bold text-gray-900">
      Perfil do Profissional
    </h1>
  </div>

  {#if loading}
    <div class="flex justify-center p-12">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
    </div>
  {:else if profissional}
    <!-- Profile Header -->
    <div class="bg-white rounded-lg shadow-sm border p-6 flex items-start gap-6">
      <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold shadow-sm">
        {profissional.nome.charAt(0).toUpperCase()}
      </div>
      <div class="flex-1">
        <h2 class="text-xl font-bold text-gray-900">{profissional.nome}</h2>
        <div class="text-sm text-gray-500 mt-1 flex gap-4">
          <span>CRM: {profissional.crm || 'N/A'}</span>
          <span>Especialidade: {profissional.especialidade?.nome || 'N/A'}</span>
        </div>
      </div>
      <div>
        <Button class="gap-2" onclick={handleNovaVisita}>
          <CalendarPlus class="w-4 h-4" />
          Registrar Visita
        </Button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          onclick={() => activeTab = 'historico'}
          class="flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'historico' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
        >
          <History class="w-4 h-4" /> Histórico de Visitas
        </button>
        <button
          onclick={() => activeTab = 'dados'}
          class="flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'dados' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
        >
          <User class="w-4 h-4" /> Dados Cadastrais
        </button>
      </nav>
    </div>

    <div class="py-4">
      {#if activeTab === 'historico'}
        <!-- Timeline -->
        <div class="space-y-4">
          {#if visitas.length === 0}
            <div class="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
              <p>Nenhuma visita registrada para este profissional.</p>
              <Button variant="outline" class="mt-4 gap-2" onclick={handleNovaVisita}>
                <CalendarPlus class="w-4 h-4" /> Primeira Visita
              </Button>
            </div>
          {:else}
            {#each visitas as visita}
              <button 
                class="w-full text-left bg-white rounded-lg border shadow-sm p-5 transition hover:shadow-md cursor-pointer block" 
                onclick={() => handleEditarVisita(visita)}
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="text-sm font-semibold text-slate-700">
                      {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(visita.dataVisita))} às {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
                    </div>
                    {#if visita.objetivoVisita}
                      <div class="text-slate-600 text-sm mt-2">{visita.objetivoVisita}</div>
                    {:else}
                      <div class="text-slate-400 italic text-sm mt-2">Nenhum objetivo detalhado</div>
                    {/if}
                  </div>
                  <StatusVisitaBadge status={visita.status} />
                </div>
                {#if visita.resumo}
                  <p class="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded border">{visita.resumo}</p>
                {/if}
                {#if visita.materiais && visita.materiais.length > 0}
                  <div class="mt-3 flex gap-2 flex-wrap">
                    {#each visita.materiais as vm}
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {vm.quantidade}x {vm.materialTecnico?.nome}
                      </span>
                    {/each}
                  </div>
                {/if}
              </button>
            {/each}
          {/if}
        </div>
      {:else}
        <!-- Dados Cadastrais Simples (Leitura) -->
        <div class="bg-white rounded-lg border shadow-sm p-6 grid grid-cols-2 gap-6">
          <div>
            <span class="block text-sm font-medium text-gray-500">Telefone</span>
            <span class="block text-sm text-gray-900 mt-1">{profissional.telefone || 'N/A'}</span>
          </div>
          <div>
            <span class="block text-sm font-medium text-gray-500">E-mail</span>
            <span class="block text-sm text-gray-900 mt-1">{profissional.email || 'N/A'}</span>
          </div>
          <div>
            <span class="block text-sm font-medium text-gray-500">Potencial de Prescrição</span>
            <span class="block text-sm text-gray-900 mt-1">{profissional.potencial || 'N/A'}</span>
          </div>
          <div>
            <span class="block text-sm font-medium text-gray-500">Estágio no Funil</span>
            <span class="block text-sm text-gray-900 mt-1">{profissional.estagioPipeline || 'N/A'}</span>
          </div>
          <div class="col-span-2 mt-4">
            <Button variant="outline" href="/dashboard/profissionais" class="text-sm">
               Editar dados gerais pela tabela de Profissionais
            </Button>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="text-center py-12 text-gray-500">Profissional não encontrado.</div>
  {/if}
</div>

<VisitaSheet
  bind:open={visitaSheetOpen}
  onclose={() => { visitaSheetOpen = false; loadData(); }}
  visita={visitaEmEdicao}
  profissionalId={id}
  sessionToken={data.sessionToken}
  {materiaisOptions}
/>
