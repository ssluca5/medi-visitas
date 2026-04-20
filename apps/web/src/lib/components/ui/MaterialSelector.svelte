<script lang="ts">
  import type { MaterialTecnico, VisitaMaterial } from '$lib/types';

  interface Props {
    materiaisOptions?: MaterialTecnico[];
    selections?: VisitaMaterial[];
    isReadOnly?: boolean;
  }
  let { materiaisOptions = [], selections = $bindable([]), isReadOnly = false }: Props = $props();

  let selectedId = $state('');
  let quantidade = $state(1);

  function adicionarMaterial() {
    if (!selectedId) return;

    const exist = selections.find(m => m.materialTecnicoId === selectedId);
    if (exist) {
      if (confirm("Material já selecionado. Deseja adicionar mais a quantidade existente?")) {
        exist.quantidade += quantidade;
        selections = [...selections];
      }
    } else {
      const mat = materiaisOptions.find(m => m.id === selectedId);
      selections = [...selections, { materialTecnicoId: selectedId, quantidade, materialTecnico: mat }];
    }

    selectedId = '';
    quantidade = 1;
  }

  function removerMaterial(idx: number) {
    selections.splice(idx, 1);
    selections = [...selections];
  }
</script>

<div class="space-y-4">
  <div class="flex gap-2 items-end">
    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700 mb-1" for="materialSelectedId">Material Técnico</label>
      <select id="materialSelectedId" bind:value={selectedId} disabled={isReadOnly} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]">
        <option value="">-- Selecione --</option>
        {#each materiaisOptions as mat}
          <option value={mat.id}>{mat.nome} ({mat.tipo})</option>
        {/each}
      </select>
    </div>
    
    <div class="w-20">
      <label class="block text-sm font-medium text-gray-700 mb-1" for="materialQtd">Qtd</label>
      <input id="materialQtd" type="number" min="1" bind:value={quantidade} disabled={isReadOnly} class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border disabled:bg-[rgb(var(--slate-50))] disabled:text-[rgb(var(--slate-500))]">
    </div>

    <div>
      <button type="button" onclick={adicionarMaterial} disabled={!selectedId || isReadOnly} class="flex items-center justify-center w-9 h-9 text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg leading-none cursor-pointer" title="Adicionar material">+</button>
    </div>
  </div>

  {#if selections.length > 0}
    <div class="bg-gray-50 rounded-md border p-3">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Materiais a Entregar:</h4>
      <ul class="space-y-2">
        {#each selections as sel, i}
          <li class="flex items-center justify-between text-sm bg-white p-2 rounded shadow-sm border border-gray-200">
            <div>
              <span class="font-medium text-indigo-700 bg-indigo-50 px-2 rounded-full text-xs py-0.5">{sel.quantidade}x</span>
              <span class="ml-2 text-gray-800">{sel.materialTecnico?.nome || 'Material Desconhecido'}</span>
            </div>
            <div class={isReadOnly ? "hidden" : "block"}>
              <button type="button" class="text-red-500 hover:text-red-700 p-1" onclick={() => removerMaterial(i)} aria-label="Remover">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
