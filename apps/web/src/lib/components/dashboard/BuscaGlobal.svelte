<script lang="ts">
  import { goto } from '$app/navigation';
  import { apiFetch } from '$lib/api';
  import { Search, X } from 'lucide-svelte';
  import type { BuscaResultado } from '$lib/types';

  interface Props {
    sessionToken: string | null;
  }

  let { sessionToken }: Props = $props();

  let query = $state('');
  let resultados = $state<BuscaResultado[]>([]);
  let aberto = $state(false);
  let loading = $state(false);
  let timer: ReturnType<typeof setTimeout>;

  $effect(() => {
    if (query.length < 2) {
      resultados = [];
      aberto = false;
      return;
    }

    clearTimeout(timer);
    timer = setTimeout(async () => {
      loading = true;
      try {
        const res = await apiFetch(`/busca?q=${encodeURIComponent(query)}`, sessionToken);
        if (res.ok) {
          const json = await res.json();
          resultados = json.resultados;
          aberto = resultados.length > 0;
        }
      } finally {
        loading = false;
      }
    }, 300);
  });

  function handleSelect(resultado: BuscaResultado) {
    aberto = false;
    query = '';
    goto(`/dashboard/profissionais/${resultado.id}`);
  }

  function handleBlur() {
    setTimeout(() => { aberto = false; }, 200);
  }
</script>

<div class="relative">
  <div class="flex items-center gap-2 rounded-lg border border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))] px-3 py-2 transition-all duration-200 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-sm">
    <Search class="h-4 w-4 text-[rgb(var(--slate-400))] shrink-0" />
    <input
      type="text"
      placeholder="Buscar profissionais..."
      bind:value={query}
      onblur={handleBlur}
      onfocus={() => { if (resultados.length > 0) aberto = true; }}
      class="w-full bg-transparent text-sm text-[rgb(var(--slate-700))] placeholder:text-[rgb(var(--slate-400))] outline-none"
    />
    {#if query}
      <button onclick={() => { query = ''; resultados = []; aberto = false; }} class="text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] cursor-pointer">
        <X class="h-4 w-4" />
      </button>
    {/if}
  </div>

  {#if aberto}
    <div class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[rgb(var(--slate-200))] shadow-lg z-50 max-h-80 overflow-y-auto">
      {#each resultados as r}
        <button
          type="button"
          onclick={() => handleSelect(r)}
          class="w-full text-left px-4 py-3 hover:bg-[rgb(var(--slate-50))] transition-colors border-b border-[rgb(var(--slate-50))] last:border-0 cursor-pointer"
        >
          <p class="text-sm font-medium text-[rgb(var(--slate-800))]">{r.nome}</p>
          <p class="text-xs text-[rgb(var(--slate-400))] mt-0.5">
            {#if r.crm}{r.crm}{/if}
            {#if r.especialidade} · {r.especialidade}{/if}
            {#if r.cidade} · {r.cidade}{/if}
          </p>
        </button>
      {/each}
    </div>
  {/if}
</div>
