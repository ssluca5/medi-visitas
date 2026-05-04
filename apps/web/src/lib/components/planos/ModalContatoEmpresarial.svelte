<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public';
  import { toast } from '$lib/stores/toast.svelte';
  import { cubicOut } from 'svelte/easing';
  import { fade, fly, scale } from 'svelte/transition';
  import { Check, X, ChevronDown } from 'lucide-svelte';

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
      toast.aviso('Preencha todos os campos obrigatórios.');
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
      toast.erro('Erro de conexão. Tente novamente.');
    } finally {
      enviando = false;
    }
  }
</script>

{#if aberto}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background: rgb(17 24 39 / 0.5); backdrop-filter: blur(4px);"
    transition:fade={{ duration: 150 }}
    onclick={fechar}
    role="presentation"
  >
    <!-- Modal Container -->
    <div
      class="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      transition:fly={{ y: 16, duration: 220, easing: cubicOut }}
      onclick={(event) => event.stopPropagation()}
      onkeydown={(event) => event.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      {#if enviado}
        <!-- ══════════ Estado de Sucesso ══════════ -->
        <div class="py-16 px-8 text-center flex flex-col items-center">
          <div
            class="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
            style="background-color: var(--success-bg);"
            in:scale={{ duration: 350, delay: 100, start: 0.5, easing: cubicOut }}
          >
            <Check class="h-8 w-8" style="color: var(--success-text);" />
          </div>
          <h2 class="text-xl font-bold text-slate-900">
            Mensagem enviada!
          </h2>
          <p class="mt-2 text-sm text-slate-500 max-w-xs">
            Nossa equipe entrará em contato em até 1 dia útil pelo email
            <strong class="text-slate-700">{email}</strong>.
          </p>
          <button
            onclick={fechar}
            class="mt-8 h-11 rounded-xl px-8 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
            style="background-color: var(--brand-primary);"
          >
            Fechar
          </button>
        </div>
      {:else}
        <!-- ══════════ Cabeçalho ══════════ -->
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Plano Empresarial</h2>
            <p class="text-sm text-slate-500 mt-1">Para equipes com mais de 10 propagandistas.</p>
          </div>
          <button
            onclick={fechar}
            class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Fechar"
          >
            <X class="size-5" />
          </button>
        </div>

        <!-- ══════════ Formulário ══════════ -->
        <div class="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          <!-- Linha 1: Nome + Email -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="contato-nome" class="block text-sm font-semibold text-slate-800 mb-1.5">
                Nome <span class="text-red-500">*</span>
              </label>
              <input
                id="contato-nome"
                bind:value={nome}
                class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label for="contato-email" class="block text-sm font-semibold text-slate-800 mb-1.5">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="contato-email"
                bind:value={email}
                type="email"
                class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <!-- Linha 2: Telefone + Empresa -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="contato-telefone" class="block text-sm font-semibold text-slate-800 mb-1.5">
                Telefone <span class="text-red-500">*</span>
              </label>
              <input
                id="contato-telefone"
                bind:value={telefone}
                class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label for="contato-empresa" class="block text-sm font-semibold text-slate-800 mb-1.5">
                Empresa <span class="text-red-500">*</span>
              </label>
              <input
                id="contato-empresa"
                bind:value={empresa}
                class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          <!-- Linha 3: Select com ChevronDown customizado -->
          <div>
            <label for="contato-usuarios" class="block text-sm font-semibold text-slate-800 mb-1.5">
              Número estimado de propagandistas
            </label>
            <div class="relative">
              <select
                id="contato-usuarios"
                bind:value={usuariosEstimados}
                class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 appearance-none cursor-pointer"
              >
                <option value={11}>11 a 20</option>
                <option value={21}>21 a 50</option>
                <option value={51}>51 a 100</option>
                <option value={101}>Mais de 100</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <!-- Linha 4: Textarea -->
          <div>
            <label for="contato-mensagem" class="block text-sm font-semibold text-slate-800 mb-1.5">
              Mensagem
            </label>
            <textarea
              id="contato-mensagem"
              bind:value={mensagem}
              rows="3"
              class="w-full min-h-[100px] px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400 resize-none"
              placeholder="Conte um pouco sobre sua operação ou dúvidas..."
            ></textarea>
          </div>
        </div>

        <!-- ══════════ Rodapé ══════════ -->
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onclick={fechar}
            class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onclick={enviar}
            disabled={enviando}
            class="px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
          >
            {enviando ? 'Enviando...' : 'Enviar mensagem'}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
