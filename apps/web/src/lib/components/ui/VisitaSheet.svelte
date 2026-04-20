<script lang="ts">
  import Sheet from './Sheet.svelte';
  import Button from './Button.svelte';
  import MaterialSelector from './MaterialSelector.svelte';
  import { Search } from 'lucide-svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import type { Visita, MaterialTecnico, StatusVisita, VisitaMaterial, Profissional } from '$lib/types';
  import { apiFetch } from '$lib/api';

  interface Props {
    open: boolean;
    onclose: () => void;
    onsave?: () => void;
    visita?: Partial<Visita> | null;
    duplicateSource?: Partial<Visita> | null;
    profissionalId?: string; // Preenchendo fixo se abrir a partir do perfil
    sessionToken: string | null;
    materiaisOptions: MaterialTecnico[];
    defaultDateTime?: string;
    profissionalNome?: string;
    ondelete?: (id: string) => void;
  }

  let { open = $bindable(), onclose, onsave, visita = null, duplicateSource = null, profissionalId, profissionalNome, sessionToken, materiaisOptions, defaultDateTime, ondelete }: Props = $props();

  let loading = $state(false);
  let confirmDeleteOpen = $state(false);

  // Estado local do form
  let status = $state<StatusVisita>('AGENDADA');
  let dataVisita = $state('');
  let duracaoMinutos = $state<number | ''>('');
  let objetivoVisita = $state('');
  let resumo = $state('');
  let proximaAcao = $state('');
  let motivoCancelamento = $state('');
  let motivoNaoRealizacao = $state('');
  let selections = $state<VisitaMaterial[]>([]);

  let hasPassed = $derived.by(() => {
    if (!visita?.dataVisita) return false;
    const execTime = new Date(visita.dataVisita);
    if (visita.duracaoMinutos) {
      execTime.setMinutes(execTime.getMinutes() + Number(visita.duracaoMinutos));
    }
    return execTime < new Date();
  });

  let isReadOnly = $derived.by(() => {
    // Modo criação: nunca é read-only
    if (!visita?.id) return false;

    // Visitas futuras nunca são somente leitura
    if (!hasPassed) return false;

    // REALIZADA passada = read-only
    if (visita.status === 'REALIZADA') return true;

    // CANCELADA ou NAO_REALIZADA passada = read-only
    if ((visita.status === 'CANCELADA' || visita.status === 'NAO_REALIZADA') && hasPassed) return true;

    return false;
  });

  let canDelete = $derived.by(() => {
    if (!visita?.id || !ondelete) return false;
    
    // Pode excluir sempre que a visita for no futuro
    if (!hasPassed) return true;
    
    // Se a visita já passou, não pode excluir para preservar o histórico
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
      if (duplicateSource) {
        // Duplicate mode — pre-fill from source, reset IDs
        status = 'AGENDADA';
        if (duplicateSource.dataVisita) {
          const d = new Date(duplicateSource.dataVisita);
          d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
          dataVisita = d.toISOString().slice(0, 16);
        } else {
          dataVisita = '';
        }
        duracaoMinutos = duplicateSource.duracaoMinutos || '';
        objetivoVisita = duplicateSource.objetivoVisita || '';
        resumo = '';
        proximaAcao = '';
        motivoCancelamento = '';
        motivoNaoRealizacao = '';
        selections = duplicateSource.materiais ? JSON.parse(JSON.stringify(duplicateSource.materiais)) : [];
        selectedProfissionalForNew = null;
        searchQuery = '';
      } else if (visita?.id) {
        // Edit mode
        status = visita.status || 'AGENDADA';
        if (visita.dataVisita) {
          const d = new Date(visita.dataVisita);
          d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
          dataVisita = d.toISOString().slice(0, 16);
        } else {
          dataVisita = '';
        }
        duracaoMinutos = visita.duracaoMinutos || '';
        objetivoVisita = visita.objetivoVisita || '';
        resumo = visita.resumo || '';
        proximaAcao = visita.proximaAcao || '';
        motivoCancelamento = visita.motivoCancelamento || '';
        motivoNaoRealizacao = visita.motivoNaoRealizacao || '';
        selections = visita.materiais ? JSON.parse(JSON.stringify(visita.materiais)) : [];
      } else {
        // Create mode
        status = 'AGENDADA';
        if (defaultDateTime) {
          dataVisita = defaultDateTime.slice(0, 16);
        } else {
          // If no default date, standard empty mode
          dataVisita = '';
        }
        duracaoMinutos = '';
        objetivoVisita = '';
        resumo = '';
        proximaAcao = '';
        motivoCancelamento = '';
        motivoNaoRealizacao = '';
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
      resumo: status === 'REALIZADA' ? resumo : null,
      proximaAcao: status === 'REALIZADA' ? proximaAcao : null,
      motivoCancelamento: status === 'CANCELADA' ? motivoCancelamento : null,
      motivoNaoRealizacao: status === 'NAO_REALIZADA' ? motivoNaoRealizacao : null,
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
        if (onsave) onsave();
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

  function handleExcluir() {
    if (!visita?.id || !ondelete) return;
    confirmDeleteOpen = true;
  }

  async function confirmExcluir() {
    if (!visita?.id || !ondelete) return;
    loading = true;
    try {
      const res = await apiFetch(`/visitas/${visita.id}`, sessionToken, { method: 'DELETE' });
      if (res.ok) {
        ondelete(visita.id);
        confirmDeleteOpen = false;
        onclose();
      } else {
        alert('Erro ao excluir visita.');
      }
    } catch (err) {
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
      <h2 class="text-lg font-semibold text-[rgb(var(--slate-900))]">
        {isReadOnly ? 'Detalhes da Visita' : (duplicateSource ? 'Duplicar Visita' : (visita?.id ? 'Editar Visita' : 'Registrar Visita'))}
      </h2>
      <p class="mt-1 text-sm text-[rgb(var(--slate-400))]">
        {isReadOnly ? 'Esta visita já foi executada e não pode ser alterada.' : (duplicateSource ? 'Altere os dados e salve para criar uma nova visita.' : 'Preencha os detalhes e os materiais entregues.')}
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
          
          {#if profissionalId && !visita?.profissionalId}
            {#if typeof profissionalId === 'string' && profissionalNome}
              <div class="mb-4">
                <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5">Profissional</label>
                <div class="px-3 py-2 bg-[rgb(var(--slate-50))] border border-[rgb(var(--slate-200))] rounded-lg text-sm text-[rgb(var(--slate-700))] font-medium">
                  {profissionalNome}
                </div>
              </div>
            {/if}
          {:else if visita?.profissionalId}
            <div class="mb-4">
              <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5">Profissional</label>
              <div class="px-3 py-2 bg-[rgb(var(--slate-50))] border border-[rgb(var(--slate-200))] rounded-lg text-sm text-[rgb(var(--slate-700))] font-medium">
                {visita.profissional?.nome || 'Profissional'}
              </div>
            </div>
          {:else if !profissionalId && !visita?.profissionalId}
            <div class="relative">
              <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="profissionalBusca">Selecione o Profissional</label>
              {#if selectedProfissionalForNew}
                <div class="flex items-center justify-between border border-[rgb(var(--slate-200))] rounded-lg py-2 px-3 bg-indigo-50">
                  <span class="text-sm font-medium text-[rgb(var(--slate-800))]">{selectedProfissionalForNew.nome}</span>
                  <button type="button" class="text-xs text-indigo-600 hover:underline" onclick={() => selectedProfissionalForNew = null}>Trocar</button>
                </div>
              {:else}
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--slate-400))] pointer-events-none">
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
                    class="input-base !pl-9"
                    autocomplete="off"
                  />
                </div>
                {#if isComboBoxOpen && profissionaisFiltrados.length > 0}
                  <div class="absolute z-50 mt-1 w-full bg-white border border-[rgb(var(--slate-200))] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {#each profissionaisFiltrados as prof}
                      <button
                        type="button"
                        onclick={() => { selectedProfissionalForNew = prof; isComboBoxOpen = false; searchQuery = ''; }}
                        class="w-full text-left px-4 py-2 text-sm hover:bg-[rgb(var(--slate-50))] transition-colors"
                      >
                        <div class="font-medium text-[rgb(var(--slate-800))]">{prof.nome}</div>
                        {#if prof.especialidade}
                          <div class="text-xs text-[rgb(var(--slate-500))]">{prof.especialidade.nome}</div>
                        {/if}
                      </button>
                    {/each}
                  </div>
                {/if}
              {/if}
            </div>
          {/if}

          <div>
            <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="dataVisita">Data e Hora</label>
            <input
              type="datetime-local"
              id="dataVisita"
              name="dataVisita"
              bind:value={dataVisita}
              required
              disabled={isReadOnly}
              class="input-base disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="status">Status</label>
              <select
                id="status"
                name="status"
                bind:value={status}
                disabled={isReadOnly}
                class="input-base disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]"
              >
                <option value="AGENDADA">Agendada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
                <option value="NAO_REALIZADA">Não Realizada</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="duracaoMinutos">Duração (min)</label>
              <input
                type="number"
                id="duracaoMinutos"
                name="duracaoMinutos"
                bind:value={duracaoMinutos}
                disabled={isReadOnly}
                class="input-base disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]"
                placeholder="e.g. 30"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="objetivoVisita">Objetivo da Visita</label>
          <textarea
            id="objetivoVisita"
            name="objetivoVisita"
            rows="3"
            bind:value={objetivoVisita}
            disabled={isReadOnly}
            class="resize-none input-base disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]"
            placeholder="Apresentação do produto X"
          ></textarea>
        </div>

        {#if status === 'REALIZADA' || (isReadOnly && visita?.status === 'REALIZADA')}
          <div>
            <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="resumo">Resumo da Visita / Feedback</label>
            <textarea
              id="resumo"
              name="resumo"
              rows="3"
              bind:value={resumo}
              disabled={isReadOnly}
              class="resize-none input-base disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]"
              placeholder="O médico gostou da amostra..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="proximaAcao">Próxima Ação / Follow-up</label>
            <input
              type="text"
              id="proximaAcao"
              name="proximaAcao"
              bind:value={proximaAcao}
              disabled={isReadOnly}
              class="input-base disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]"
              placeholder="Retornar daqui a 30 dias"
            />
          </div>
        {/if}

        {#if status === 'CANCELADA' || (isReadOnly && visita?.status === 'CANCELADA')}
          <div>
            <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="motivoCancelamento">Motivo do Cancelamento</label>
            <textarea
              id="motivoCancelamento"
              name="motivoCancelamento"
              rows="3"
              bind:value={motivoCancelamento}
              disabled={isReadOnly}
              class="resize-none input-base disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]"
              placeholder="Descreva o motivo do cancelamento..."
            ></textarea>
          </div>
        {/if}

        {#if status === 'NAO_REALIZADA' || (isReadOnly && visita?.status === 'NAO_REALIZADA')}
          <div>
            <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1.5" for="motivoNaoRealizacao">Motivo da Não Realização</label>
            <textarea
              id="motivoNaoRealizacao"
              name="motivoNaoRealizacao"
              rows="3"
              bind:value={motivoNaoRealizacao}
              disabled={isReadOnly}
              class="resize-none input-base disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]"
              placeholder="Descreva o motivo da não realização..."
            ></textarea>
          </div>
        {/if}

        <hr class="border-[rgb(var(--slate-200))]" />

        <!-- Componente de Materiais -->
        <div>
          <h3 class="text-sm font-semibold text-[rgb(var(--slate-800))] mb-3">Materiais / Amostras</h3>
          <MaterialSelector {materiaisOptions} bind:selections={selections} {isReadOnly} />
        </div>
      </form>
    </div>

    <!-- Footer Actions -->
    <div class="mt-auto border-t border-[rgb(var(--slate-100))] pt-4 pb-2">
      <div class="flex justify-between gap-3">
        {#if canDelete}
          <Button variant="destructive" type="button" onclick={handleExcluir} disabled={loading}>
            Excluir
          </Button>
        {:else}
           <div></div>
        {/if}

        <div class="flex gap-3 ml-auto">
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
  </div>
</Sheet>

<ConfirmDialog
  open={confirmDeleteOpen}
  title="Excluir Visita"
  confirmLabel="Excluir"
  variant="danger"
  onclose={() => confirmDeleteOpen = false}
  onconfirm={confirmExcluir}
>
  {#snippet description()}
    <p>A exclusão de dados é permanente. Tem certeza que deseja prosseguir?</p>
  {/snippet}
</ConfirmDialog>
