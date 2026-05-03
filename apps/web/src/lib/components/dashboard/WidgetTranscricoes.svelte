<script lang="ts">
  import { apiFetch } from '$lib/api';
  import { Brain, Loader2, ShoppingCart } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  let { sessionToken } = $props<{ sessionToken: string }>();

  let status = $state<{
    permitido: boolean;
    usadas: number;
    limite: number;
    extras: number;
    restantes: number;
  } | null>(null);
  let loading = $state(true);
  let comprando = $state<number | null>(null);

  const pacotes = [
    { quantidade: 20, label: '+20', preco: 'R$ 19' },
    { quantidade: 50, label: '+50', preco: 'R$ 39' },
    { quantidade: 100, label: '+100', preco: 'R$ 69' }
  ] as const;

  $effect(() => {
    async function fetchStatus() {
      try {
        const res = await apiFetch('/transcricoes/status', sessionToken);
        if (res.ok) {
          status = await res.json();
        }
      } catch (e) {
        console.error(e);
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
        toast.error(data?.error ?? 'Erro ao iniciar compra.');
      }
    } catch {
      toast.error('Erro de conexao.');
    } finally {
      comprando = null;
    }
  }
</script>

{#if loading}
  <div class="flex h-full min-h-32 items-center justify-center rounded-xl border bg-white p-5">
    <Loader2 class="h-6 w-6 animate-spin" style="color: var(--ai-primary);" />
  </div>
{:else if status}
  <div
    class="card-surface flex h-full flex-col rounded-xl border p-5"
    style="background-color: var(--bg-surface); border-color: var(--border-base);"
  >
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2" style="color: var(--ai-primary);">
        <Brain class="h-5 w-5" />
        <h3 class="text-sm font-semibold">MediVisitas AI</h3>
      </div>
      <span class="text-xs font-medium" style="color: var(--text-muted);">
        {status.extras > 0 ? `${status.extras} extras` : 'Plano'}
      </span>
    </div>

    {#if status.limite === 0}
      <p class="text-sm" style="color: var(--text-secondary);">
        Transcricoes por IA disponiveis a partir do Plano Profissional.
      </p>
      <a
        href="/planos"
        class="mt-4 inline-flex h-9 items-center justify-center rounded-lg text-sm font-medium text-white"
        style="background-color: var(--brand-primary);"
      >
        Ver planos
      </a>
    {:else}
      <div class="mb-4">
        <div class="mb-1.5 flex items-end justify-between">
          <span class="text-[11px] font-medium uppercase tracking-wide" style="color: var(--text-secondary);">
            Transcricoes
          </span>
          <div class="text-right">
            <span class="text-lg font-semibold" style="color: {status.restantes === 0 ? 'var(--danger)' : 'var(--text-primary)'};">
              {status.restantes}
            </span>
            <span class="text-xs" style="color: var(--text-muted);">/{status.limite + status.extras} restam</span>
          </div>
        </div>

        <div class="h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--slate-100))]">
          <div
            class="h-full rounded-full transition-all duration-500"
            style="width: {Math.min(100, (status.usadas / Math.max(1, status.limite + status.extras)) * 100)}%; background-color: {status.restantes === 0 ? 'var(--danger)' : 'var(--ai-primary)'};"
          ></div>
        </div>
      </div>

      <div class="mt-auto grid grid-cols-3 gap-2">
        {#each pacotes as pacote}
          <button
            onclick={() => comprarPacote(pacote.quantidade)}
            disabled={comprando !== null}
            class="flex flex-col items-center justify-center rounded-lg border px-2 py-2 text-xs font-medium transition-colors disabled:opacity-60"
            style="border-color: var(--border-base); color: var(--text-primary); background-color: var(--bg-surface);"
            title={`Comprar ${pacote.label} transcricoes`}
          >
            {#if comprando === pacote.quantidade}
              <Loader2 class="h-4 w-4 animate-spin" style="color: var(--ai-primary);" />
            {:else}
              <ShoppingCart class="h-4 w-4" style="color: var(--ai-primary);" />
              <span>{pacote.label}</span>
              <span style="color: var(--text-muted);">{pacote.preco}</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}
