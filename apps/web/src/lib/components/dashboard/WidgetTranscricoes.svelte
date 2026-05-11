<script lang="ts">
  import { apiFetch } from '$lib/api';
  import { Loader2, Mic, Minus } from 'lucide-svelte';
  import { toast } from '$lib/stores/toast.svelte';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let {
    sessionToken,
    plano = 'TRIAL',
    pacotesIaDisponiveis = false
  } = $props<{
    sessionToken: string | null;
    plano?: string;
    pacotesIaDisponiveis?: boolean;
  }>();

  let status = $state<{
    permitido: boolean;
    usadas: number;
    limite: number;
    extras: number;
    restantes: number;
  } | null>(null);
  let loading = $state(true);
  let comprando = $state<number | null>(null);

  // ── Estado de visibilidade (persistido em localStorage) ─────────────
  // 'expanded' = card completo; 'minimized' = bolha flutuante
  type WidgetView = 'expanded' | 'minimized';
  let view = $state<WidgetView>('expanded');

  const STORAGE_KEY = 'widget-transcricoes-view';

  $effect(() => {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    // Migração: valores antigos 'hidden' voltam como 'minimized' para não deixar o widget inacessível.
    if (stored === 'minimized' || stored === 'hidden') {
      view = 'minimized';
    } else if (stored === 'expanded') {
      view = 'expanded';
    }
  });

  $effect(() => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, view);
  });

  function minimizar() {
    view = 'minimized';
  }

  function expandir() {
    view = 'expanded';
  }

  const pacotes = [
    { quantidade: 20, label: '+20', preco: 'R$ 19' },
    { quantidade: 50, label: '+50', preco: 'R$ 39' },
    { quantidade: 100, label: '+100', preco: 'R$ 69' }
  ] as const;

  const planoLabel = $derived.by(() => {
    if (plano === 'BASICO') return 'Básico';
    if (plano === 'PROFISSIONAL') return 'Pro';
    if (plano === 'EQUIPE') return 'Equipe';
    if (plano === 'EMPRESA' || plano === 'EMPRESARIAL') return 'Ilimitado';
    return 'Trial';
  });

  const planoIlimitado = $derived(plano === 'EMPRESA' || plano === 'EMPRESARIAL' || (status?.limite ?? 0) >= 999999);
  const porcentagem = $derived.by(() => {
    if (!status || status.limite <= 0 || planoIlimitado) return 0;
    return Math.min(100, Math.round((status.usadas / status.limite) * 100));
  });
  const corBarra = $derived.by(() => {
    if (!status || status.restantes === 0 || porcentagem >= 100) return '#dc2626';
    if (porcentagem >= 80) return '#f59e0b';
    return '#2563eb';
  });

  $effect(() => {
    async function fetchStatus() {
      try {
        const res = await apiFetch('/transcricoes/status', sessionToken);
        if (res.ok) {
          status = await res.json();
        }
      } finally {
        loading = false;
      }
    }

    fetchStatus();
  });

  async function comprarPacote(quantidade: 20 | 50 | 100) {
    try {
      comprando = quantidade;
      const res = await apiFetch('/transcricoes/comprar-pacote', sessionToken, {
        method: 'POST',
        body: JSON.stringify({ quantidade })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      } else {
        const data = await res.json().catch(() => null);
        toast.erro(data?.error ?? 'Erro ao iniciar compra.');
      }
    } catch {
      toast.erro('Erro de conexao.');
    } finally {
      comprando = null;
    }
  }
</script>

{#if plano !== 'BASICO' && !planoIlimitado}
  <div class="fixed z-40" style="bottom: 24px; right: 24px;">
    {#if view === 'minimized'}
      <!-- Bolha flutuante minimizada -->
      <button
        type="button"
        onclick={expandir}
        aria-label="Expandir widget de Transcrições IA"
        title="Expandir Transcrições IA"
        class="relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 cursor-pointer"
        style="background-color: #7c3aed;"
        in:fade={{ duration: 150 }}
      >
        <Mic class="h-5 w-5 text-white" />
        {#if status && status.restantes === 0}
          <span
            class="absolute -top-0.5 -right-0.5 flex h-3 w-3 rounded-full border-2 border-white"
            style="background-color: #dc2626;"
            aria-hidden="true"
          ></span>
        {/if}
      </button>
    {:else}
      <!-- Card completo -->
      <div
        class="flex w-72 flex-col rounded-xl border border-[rgb(var(--slate-200))] bg-white p-4 shadow-lg"
        in:fly={{ y: 8, duration: 200, easing: cubicOut }}
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <div class="flex min-w-0 items-center gap-2">
            <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg" style="background-color: #f5f3ff;">
              <Mic class="h-3.5 w-3.5" style="color: #7c3aed;" />
            </div>
            <span class="truncate text-sm font-medium text-[rgb(var(--slate-900))]">Transcrições IA</span>
          </div>
          <div class="flex flex-shrink-0 items-center gap-1">
            <span
              class="rounded px-2 py-0.5 font-medium"
              style="background-color: #f5f3ff; color: #7c3aed; font-size: 10px;"
            >
              {planoLabel}
            </span>
            <button
              type="button"
              onclick={minimizar}
              aria-label="Minimizar widget"
              title="Minimizar"
              class="flex h-6 w-6 items-center justify-center rounded-md text-[rgb(var(--slate-400))] transition-colors hover:bg-[rgb(var(--slate-100))] hover:text-[rgb(var(--slate-700))] cursor-pointer"
            >
              <Minus class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {#if loading}
          <div class="flex flex-1 items-center justify-center py-8">
            <Loader2 class="h-5 w-5 animate-spin" style="color: #7c3aed;" />
          </div>
        {:else if status}
          <div class="mb-3">
            <div class="mb-1.5 flex justify-between">
              <span class="text-xs text-[rgb(var(--slate-500))]">Usadas este mês</span>
              <span class="text-xs font-medium text-[rgb(var(--slate-900))]">
                {status.usadas} / {status.limite}
              </span>
            </div>
            <div class="h-1.5 w-full rounded-full bg-[rgb(var(--slate-100))]">
              <div
                class="h-1.5 rounded-full transition-all duration-500"
                style="width: {porcentagem}%; background-color: {corBarra};"
              ></div>
            </div>
            <p class="mt-1.5 text-xs" class:text-red-600={status.restantes === 0} class:text-[rgb(var(--slate-400))]={status.restantes !== 0}>
              {status.restantes === 0 ? 'Limite atingido' : `${status.restantes} restantes`}
            </p>
          </div>

          {#if pacotesIaDisponiveis}
            <p class="mb-2 text-xs text-[rgb(var(--slate-400))]">Comprar mais</p>
            <div class="grid grid-cols-3 gap-1.5">
              {#each pacotes as pacote}
                <button
                  onclick={() => comprarPacote(pacote.quantidade)}
                  disabled={comprando !== null}
                  class="flex flex-col items-center rounded-lg border border-[rgb(var(--slate-200))] px-1 py-2 transition-all hover:border-purple-300 hover:bg-purple-50/30 disabled:opacity-50 cursor-pointer"
                >
                  <span class="text-xs font-medium text-[rgb(var(--slate-900))]">{pacote.label}</span>
                  <span class="text-xs text-[rgb(var(--slate-400))]" style="font-size: 10px;">
                    {#if comprando === pacote.quantidade}
                      ...
                    {:else}
                      {pacote.preco}
                    {/if}
                  </span>
                </button>
              {/each}
            </div>
          {/if}
        {:else}
          <p class="text-xs text-[rgb(var(--slate-400))]">Não foi possível carregar o uso de IA.</p>
        {/if}
      </div>
    {/if}
  </div>
{/if}
