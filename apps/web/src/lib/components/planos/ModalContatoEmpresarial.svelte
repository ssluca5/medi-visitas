<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public';
  import { toast } from '$lib/stores/toast.svelte';
  import { cubicOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import { Check, X } from 'lucide-svelte';

  const { aberto, onFechar } = $props<{
    aberto: boolean;
    onFechar: () => void;
  }>();

  let nome = $state('');
  let email = $state('');
  let telefone = $state('');
  let empresa = $state('');
  let usuariosEstimados = $state(11);
  let mensagem = $state('');
  let enviando = $state(false);
  let enviado = $state(false);

  function fechar() {
    onFechar();
    enviado = false;
  }

  async function enviar() {
    if (!nome || !email || !telefone || !empresa) {
      toast.aviso('Preencha todos os campos obrigatorios.');
      return;
    }

    enviando = true;
    try {
      const res = await fetch(`${PUBLIC_API_URL}/contato/empresarial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          empresa,
          usuariosEstimados,
          mensagem
        })
      });

      if (res.ok) {
        enviado = true;
      } else {
        toast.erro('Erro ao enviar. Tente novamente.');
      }
    } catch {
      toast.erro('Erro de conexao. Tente novamente.');
    } finally {
      enviando = false;
    }
  }
</script>

{#if aberto}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background: rgb(17 24 39 / 0.42);"
    transition:fade={{ duration: 150 }}
    onclick={fechar}
  >
    <div
      class="w-full max-w-lg rounded-xl border p-6 shadow-xl"
      style="background-color: var(--bg-surface); border-color: var(--border-base);"
      transition:fly={{ y: 16, duration: 220, easing: cubicOut }}
      onclick={(event) => event.stopPropagation()}
    >
      {#if enviado}
        <div class="py-8 text-center">
          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style="background-color: var(--success-bg); color: var(--success-text);"
          >
            <Check class="h-7 w-7" />
          </div>
          <h2 class="text-xl font-semibold" style="color: var(--text-primary);">
            Mensagem enviada
          </h2>
          <p class="mt-2 text-sm" style="color: var(--text-secondary);">
            Nossa equipe entrara em contato em ate 1 dia util pelo email
            <strong>{email}</strong>.
          </p>
          <button
            onclick={fechar}
            class="mt-6 h-10 rounded-lg px-5 text-sm font-medium text-white"
            style="background-color: var(--brand-primary);"
          >
            Fechar
          </button>
        </div>
      {:else}
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold" style="color: var(--text-primary);">
              Plano Empresarial
            </h2>
            <p class="mt-1 text-sm" style="color: var(--text-secondary);">
              Para equipes com mais de 10 propagandistas.
            </p>
          </div>
          <button
            onclick={fechar}
            class="rounded-lg p-1.5 transition-colors hover:bg-[rgb(var(--slate-100))]"
            aria-label="Fechar"
          >
            <X class="h-4 w-4" style="color: var(--text-muted);" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium" style="color: var(--text-primary);">Nome *</label>
              <input bind:value={nome} class="input-base h-9 py-0" placeholder="Seu nome completo" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium" style="color: var(--text-primary);">Email *</label>
              <input bind:value={email} type="email" class="input-base h-9 py-0" placeholder="seu@email.com" />
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium" style="color: var(--text-primary);">Telefone *</label>
              <input bind:value={telefone} class="input-base h-9 py-0" placeholder="(11) 99999-9999" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium" style="color: var(--text-primary);">Empresa *</label>
              <input bind:value={empresa} class="input-base h-9 py-0" placeholder="Nome da empresa" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium" style="color: var(--text-primary);">
              Numero estimado de propagandistas
            </label>
            <select bind:value={usuariosEstimados} class="input-base h-9 py-0">
              <option value={11}>11 a 20</option>
              <option value={21}>21 a 50</option>
              <option value={51}>51 a 100</option>
              <option value={101}>Mais de 100</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium" style="color: var(--text-primary);">
              Mensagem
            </label>
            <textarea
              bind:value={mensagem}
              rows="3"
              class="input-base min-h-24 resize-none"
              placeholder="Conte um pouco sobre sua operacao ou duvidas..."
            ></textarea>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            onclick={fechar}
            class="h-10 flex-1 rounded-lg border text-sm font-medium"
            style="border-color: var(--border-base); color: var(--text-secondary); background-color: var(--bg-surface);"
          >
            Cancelar
          </button>
          <button
            onclick={enviar}
            disabled={enviando}
            class="h-10 flex-1 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style="background-color: var(--ai-primary);"
          >
            {enviando ? 'Enviando...' : 'Enviar mensagem'}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
