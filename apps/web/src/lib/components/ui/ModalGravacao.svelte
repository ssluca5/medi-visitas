<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { Mic, Square, Loader2, X, AlertCircle, Volume2 } from 'lucide-svelte';
  import { useGravacaoAudio } from '$lib/hooks/useGravacaoAudio.svelte';
  import { PUBLIC_API_URL } from '$env/static/public';

  type Etapa = 'selecionar' | 'gravar' | 'processar' | 'revisar';

  interface Props {
    open: boolean;
    visitaId: string;
    sessionToken: string | null;
    onclose: () => void;
    onsave: (campos: { resumo: string; proximaAcao: string; objetivoVisita: string }) => void;
  }

  let { open = $bindable(), visitaId, sessionToken, onclose, onsave }: Props = $props();

  let etapa = $state<Etapa>('selecionar');
  let salvarAudio = $state<boolean | null>(null);
  let resumo = $state('');
  let proximaAcao = $state('');
  let objetivoVisita = $state('');
  let erro = $state('');
  let gravacao = useGravacaoAudio();

  function formatarDuracao(segundos: number): string {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function resetar() {
    etapa = 'selecionar';
    salvarAudio = null;
    resumo = '';
    proximaAcao = '';
    objetivoVisita = '';
    erro = '';
    gravacao.descartar();
  }

  function fechar() {
    resetar();
    onclose();
  }

  async function iniciarGravacao() {
    await gravacao.iniciar();
    if (gravacao.erroPermissao) {
      erro = gravacao.erroPermissao;
      return;
    }
    etapa = 'gravar';
  }

  async function processarAudio() {
    etapa = 'processar';
    erro = '';

    try {
      if (!gravacao.audioBlob) {
        erro = 'Nenhum áudio gravado';
        etapa = 'gravar';
        return;
      }

      const formData = new FormData();
      formData.append('audio', gravacao.audioBlob, 'gravacao.webm');

      const res = await fetch(`${PUBLIC_API_URL}/visitas/${visitaId}/transcricao`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
        body: formData
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Erro ao processar áudio');
      }

      const campos = await res.json();
      resumo = campos.resumo || '';
      proximaAcao = campos.proximaAcao || '';
      objetivoVisita = campos.objetivoVisita || '';
      etapa = 'revisar';
    } catch (err: any) {
      erro = err.message;
      etapa = 'gravar';
    }
  }

  async function confirmarSalvar() {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/visitas/${visitaId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resumo, proximaAcao, objetivoVisita })
      });

      if (!res.ok) throw new Error('Erro ao salvar campos');

      onsave({ resumo, proximaAcao, objetivoVisita });
      fechar();
    } catch (err: any) {
      erro = err.message;
    }
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
    transition:fade={{ duration: 200 }}
    onclick={fechar}
    role="presentation"
  >
    <!-- Modal -->
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center"
            style="background-color: #f3e8ff;"
          >
            <Volume2 class="w-5 h-5" style="color: #7c3aed;" />
          </div>
          <div>
            <h2 class="text-base font-semibold text-gray-900">
              {#if etapa === 'selecionar'}Gravar visita
              {:else if etapa === 'gravar'}Gravando...
              {:else if etapa === 'processar'}Processando
              {:else}Revisar campos{/if}
            </h2>
            <p class="text-xs text-gray-500">
              {#if etapa === 'selecionar'}Clique para iniciar a gravação
              {:else if etapa === 'gravar'}Fale sobre a visita realizada
              {:else if etapa === 'processar'}A IA está transcrevendo e extraindo campos
              {:else}Revise os campos extraídos pela IA{/if}
            </p>
          </div>
        </div>
        <button onclick={fechar} class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Conteúdo -->
      <div class="p-5 space-y-5">
        <!-- Selecionar -->
        {#if etapa === 'selecionar'}
          <div class="text-center py-8" transition:fade={{ duration: 200 }}>
            <button
              onclick={iniciarGravacao}
              class="w-20 h-20 rounded-full flex items-center justify-center mx-auto
                hover:scale-105 transition-transform cursor-pointer shadow-lg"
              style="background-color: #7c3aed;"
            >
              <Mic class="w-8 h-8 text-white" />
            </button>
            <p class="text-sm text-gray-500 mt-4">Toque para iniciar gravação</p>
            <p class="text-xs text-gray-400 mt-1">Máximo 3 minutos</p>
          </div>
        {/if}

        <!-- Gravar -->
        {#if etapa === 'gravar'}
          <div class="text-center py-4" transition:fade={{ duration: 200 }}>
            <p class="text-3xl font-mono font-bold text-gray-900 mb-4">
              {formatarDuracao(gravacao.duracaoSegundos)}
            </p>

            {#if gravacao.gravando}
              <div class="flex items-center justify-center gap-1 mb-6">
                {#each Array(5) as _, i}
                  <div
                    class="w-1 rounded-full animate-pulse"
                    style="height: {20 + Math.random() * 20}px; background-color: #7c3aed; animation-delay: {i * 100}ms;"
                  ></div>
                {/each}
              </div>
            {/if}

            <button
              onclick={() => gravacao.parar()}
              class="w-16 h-16 rounded-full flex items-center justify-center mx-auto
                hover:scale-105 transition-transform cursor-pointer"
              style="background-color: #dc2626;"
            >
              <Square class="w-6 h-6 text-white fill-white" />
            </button>
            <p class="text-xs text-gray-400 mt-3">Toque para parar</p>
          </div>
        {/if}

        <!-- Processar -->
        {#if etapa === 'processar'}
          <div class="text-center py-8" transition:fade={{ duration: 200 }}>
            <Loader2 class="w-10 h-10 mx-auto animate-spin" style="color: #7c3aed;" />
            <p class="text-sm text-gray-600 mt-4">Transcrevendo áudio...</p>
            <p class="text-xs text-gray-400 mt-1">Isso pode levar até 30 segundos</p>
          </div>
        {/if}

        <!-- Revisar -->
        {#if etapa === 'revisar'}
          <div class="space-y-4" transition:fade={{ duration: 200 }}>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700" for="resumo">Resumo</label>
              <textarea
                id="resumo"
                bind:value={resumo}
                rows="3"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  bg-white"
              ></textarea>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700" for="objetivoVisita">Objetivo da Visita</label>
              <input
                id="objetivoVisita"
                type="text"
                bind:value={objetivoVisita}
                class="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  bg-white"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700" for="proximaAcao">Próxima Ação</label>
              <input
                id="proximaAcao"
                type="text"
                bind:value={proximaAcao}
                class="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  bg-white"
              />
            </div>

            <!-- Salvar áudio? -->
            <div class="border-t border-gray-100 pt-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Salvar gravação de áudio?</p>
              <div class="flex gap-2">
                <button
                  onclick={() => salvarAudio = true}
                  class="px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer"
                  style={salvarAudio === true
                    ? 'background-color: #2563eb; color: white; border-color: #2563eb;'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}
                >
                  Sim
                </button>
                <button
                  onclick={() => salvarAudio = false}
                  class="px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer"
                  style={salvarAudio === false
                    ? 'background-color: #2563eb; color: white; border-color: #2563eb;'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        {/if}

        <!-- Erro -->
        {#if erro}
          <div class="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
            <AlertCircle class="w-4 h-4 shrink-0" />
            {erro}
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-5 border-t border-gray-100">
        <button
          onclick={fechar}
          class="flex-1 h-10 text-sm font-medium border border-gray-200 rounded-lg
            bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancelar
        </button>

        {#if etapa === 'gravar' && !gravacao.gravando && gravacao.audioBlob}
          <button
            onclick={processarAudio}
            style="background-color: #7c3aed; border-radius: 8px;"
            class="flex-1 h-10 text-sm font-medium text-white hover:opacity-90 cursor-pointer"
          >
            Processar com IA
          </button>
        {:else if etapa === 'revisar'}
          <button
            onclick={confirmarSalvar}
            disabled={salvarAudio === null}
            style="background-color: #2563eb; border-radius: 8px;"
            class="flex-1 h-10 text-sm font-medium text-white hover:opacity-90 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
