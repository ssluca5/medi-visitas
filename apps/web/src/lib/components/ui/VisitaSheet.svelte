<script lang="ts">
  import Sheet from './Sheet.svelte';
  import Button from './Button.svelte';
  import MaterialSelector from './MaterialSelector.svelte';
  import { Search, ChevronDown } from 'lucide-svelte';
  import type { Visita, MaterialTecnico, StatusVisita, VisitaMaterial, Profissional } from '$lib/types';
  import { apiFetch } from '$lib/api';

  interface Props {
    open: boolean;
    onclose: () => void;
    visita?: Partial<Visita> | null;
    profissionalId?: string; // Preenchendo fixo se abrir a partir do perfil
    sessionToken: string | null;
    materiaisOptions: MaterialTecnico[];
  }

  let { open = $bindable(), onclose, visita = null, profissionalId, sessionToken, materiaisOptions }: Props = $props();

  let loading = $state(false);

  // Estado local do form
  let status = $state<StatusVisita>('AGENDADA');
  let dataVisita = $state('');
  let duracaoMinutos = $state<number | ''>('');
  let objetivoVisita = $state('');
  let resumo = $state('');
  let proximaAcao = $state('');
  let selections = $state<VisitaMaterial[]>([]);

  let isReadOnly = $derived.by(() => {
    if (status === 'REALIZADA' || status === 'CANCELADA') return true;
    if (dataVisita) {
      const execTime = new Date(dataVisita);
      if (duracaoMinutos) {
        execTime.setMinutes(execTime.getMinutes() + Number(duracaoMinutos));
      }
      if (execTime < new Date()) {
        return true;
      }
    }
    return false;
  });

  // Autocomplete estado para nova visita sem id vinculado
  let searchQuery = $state('');
  let profissionaisFiltrados = $state<Profissional[]>([]);
  let isComboBoxOpen = $state(false);
  let selectedProfissionalForNew = $state<Profissional | null>(null);

  async function searchProfissionais() {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      profissionaisFiltrados = [];
      return;
    }
    try {
      const res = await apiFetch(`/profissionais?q=${encodeURIComponent(searchQuery)}`, sessionToken);
      if (res.ok) {
        const json = await res.json();
        const todos = json.data || json;
        profissionaisFiltrados = todos.filter((p: Profissional) => !!p.nome.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);
      }
    } catch {}
  }

  // Carregar dados quando a drawer abre ou quando visita muda
  $effect(() => {
    if (open) {
      if (visita?.id) {
        // Edit mode
        status = visita.status || 'AGENDADA';
        dataVisita = visita.dataVisita ? new Date(visita.dataVisita).toISOString().slice(0, 16) : '';
        duracaoMinutos = visita.duracaoMinutos || '';
        objetivoVisita = visita.objetivoVisita || '';
        resumo = visita.resumo || '';
        proximaAcao = visita.proximaAcao || '';
        selections = visita.materiais ? JSON.parse(JSON.stringify(visita.materiais)) : [];
      } else {
        // Create mode
        status = 'AGENDADA';
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dataVisita = now.toISOString().slice(0, 16);
        duracaoMinutos = '';
        objetivoVisita = '';
        resumo = '';
        proximaAcao = '';
        selections = [];
        
        selectedProfissionalForNew = null;
        searchQuery = '';
      }
    }
  });

  async function handleSalvar(e: Event) {
    e.preventDefault();
    loading = true;
    
    const token = sessionToken;

    const payload = {
      profissionalId: profissionalId || visita?.profissionalId || selectedProfissionalForNew?.id,
      status,
      dataVisita: new Date(dataVisita).toISOString(),
      duracaoMinutos: duracaoMinutos ? Number(duracaoMinutos) : null,
      objetivoVisita,
      resumo: status === 'REALIZADA' || status === 'CANCELADA' || status === 'NAO_REALIZADA' ? resumo : null,
      proximaAcao: status === 'REALIZADA' || status === 'CANCELADA' || status === 'NAO_REALIZADA' ? proximaAcao : null,
      materiais: selections.map(s => ({
        materialTecnicoId: s.materialTecnicoId,
        quantidade: s.quantidade
      }))
    };

    const url = visita?.id ? `/visitas/${visita.id}` : `/visitas`;
    const method = visita?.id ? 'PUT' : 'POST';

    try {
      const res = await apiFetch(url, token, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onclose();
      } else {
        const error = await res.json().catch(() => null);
        console.error('Falha ao salvar visita', error);
        alert(error?.message || 'Erro ao salvar a visita.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro inesperado de conexão.');
    } finally {
      loading = false;
    }
  }
</script>

<Sheet {open} {onclose} side="right">
  <div class="flex h-full flex-col">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900">
        {isReadOnly ? 'Detalhes da Visita' : (visita?.id ? 'Editar Visita' : 'Registrar Visita')}
      </h2>
      <p class="mt-1 text-sm text-gray-500">
        {isReadOnly ? 'Esta visita já foi executada e não pode ser alterada.' : 'Preencha os detalhes e os materiais entregues.'}
      </p>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto pr-2 pb-6">
      <form
        onsubmit={handleSalvar}
        class="space-y-5"
        id="visitaForm"
      >

        <div class="space-y-4">
          
          {#if !profissionalId && !visita?.profissionalId}
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1" for="profissionalBusca">Selecione o Profissional</label>
              {#if selectedProfissionalForNew}
                <div class="flex items-center justify-between border border-gray-300 rounded-md py-2 px-3 bg-indigo-50">
                  <span class="text-sm font-medium text-slate-800">{selectedProfissionalForNew.nome}</span>
                  <button type="button" class="text-xs text-indigo-600 hover:underline" onclick={() => selectedProfissionalForNew = null}>Trocar</button>
                </div>
              {:else}
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search class="w-4 h-4" />
                  </span>
                  <input
                    id="profissionalBusca"
                    type="text"
                    bind:value={searchQuery}
                    oninput={searchProfissionais}
                    onfocus={() => isComboBoxOpen = true}
                    onblur={() => setTimeout(() => isComboBoxOpen = false, 200)}
                    placeholder="Buscar médico..."
                    class="block w-full pl-9 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                    autocomplete="off"
                  />
                </div>
                {#if isComboBoxOpen && profissionaisFiltrados.length > 0}
                  <div class="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {#each profissionaisFiltrados as prof}
                      <button
                        type="button"
                        onclick={() => { selectedProfissionalForNew = prof; isComboBoxOpen = false; searchQuery = ''; }}
                        class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                      >
                        <div class="font-medium text-slate-800">{prof.nome}</div>
                        {#if prof.especialidade}
                          <div class="text-xs text-slate-500">{prof.especialidade.nome}</div>
                        {/if}
                      </button>
                    {/each}
                  </div>
                {/if}
              {/if}
            </div>
          {/if}

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="dataVisita">Data e Hora</label>
            <input
              type="datetime-local"
              id="dataVisita"
              name="dataVisita"
              bind:value={dataVisita}
              required
              disabled={isReadOnly}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="status">Status</label>
              <select
                id="status"
                name="status"
                bind:value={status}
                disabled={isReadOnly}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="AGENDADA">Agendada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
                <option value="NAO_REALIZADA">Não Realizada</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="duracaoMinutos">Duração (min)</label>
              <input
                type="number"
                id="duracaoMinutos"
                name="duracaoMinutos"
                bind:value={duracaoMinutos}
                disabled={isReadOnly}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="e.g. 30"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="objetivoVisita">Objetivo da Visita</label>
          <textarea
            id="objetivoVisita"
            name="objetivoVisita"
            rows="3"
            bind:value={objetivoVisita}
            disabled={isReadOnly}
            class="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Apresentação do produto X"
          ></textarea>
        </div>

        {#if status === 'REALIZADA' || status === 'CANCELADA' || status === 'NAO_REALIZADA' || isReadOnly}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="resumo">Resumo da Visita / Feedback</label>
            <textarea
              id="resumo"
              name="resumo"
              rows="3"
              bind:value={resumo}
              disabled={isReadOnly}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="O médico gostou da amostra..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="proximaAcao">Próxima Ação / Follow-up</label>
            <input
              type="text"
              id="proximaAcao"
              name="proximaAcao"
              bind:value={proximaAcao}
              disabled={isReadOnly}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="Retornar daqui a 30 dias"
            />
          </div>
        {/if}

        <hr class="border-gray-200" />
        
        <!-- Componente de Materiais -->
        <div>
          <h3 class="text-md font-semibold text-gray-800 mb-3">Materiais / Amostras</h3>
          <MaterialSelector {materiaisOptions} bind:selections={selections} {isReadOnly} />
        </div>
      </form>
    </div>

    <!-- Footer Actions -->
    <div class="mt-auto border-t bg-white pt-4 pb-2">
      <div class="flex justify-end gap-3">
        {#if isReadOnly}
          <Button variant="outline" type="button" onclick={onclose}>
            Fechar
          </Button>
        {:else}
          <Button variant="outline" type="button" onclick={onclose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" form="visitaForm" disabled={loading || (!profissionalId && !visita?.profissionalId && !selectedProfissionalForNew?.id)}>
            {#if loading}
              Salvando...
            {:else}
              Salvar Visita
            {/if}
          </Button>
        {/if}
      </div>
    </div>
  </div>
</Sheet>
