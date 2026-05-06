<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { Mic, Square, Loader2, X, AlertCircle, Volume2, CalendarPlus, TrendingUp } from 'lucide-svelte';
  import { useGravacaoAudio } from '$lib/hooks/useGravacaoAudio.svelte';
  import { PUBLIC_API_URL } from '$env/static/public';
  import type { EstagioPipeline } from '$lib/types';

  type Etapa = 'selecionar' | 'gravar' | 'processar' | 'revisar';
  type ProximaVisitaSugerida = {
    dataISO: string | null;
    observacao: string;
  } | null;

  const ORDEM_ESTAGIOS: EstagioPipeline[] = ['PROSPECTADO', 'VISITADO', 'INTERESSADO', 'PRESCRITOR', 'FIDELIZADO'];
  const ESTAGIO_LABELS: Record<string, string> = {
    PROSPECTADO: 'Prospectado',
    VISITADO: 'Visitado',
    INTERESSADO: 'Interessado',
    PRESCRITOR: 'Prescritor',
    FIDELIZADO: 'Fidelizado'
  };

  interface Props {
    open: boolean;
    visitaId: string;
    profissionalEstagio?: EstagioPipeline | string;
    sessionToken: string | null;
    onclose: () => void;
    onsave: (campos: {
      resumo: string;
      proximaAcao: string;
      objetivoVisita: string;
      proximaVisitaSugerida: ProximaVisitaSugerida;
      sugestaoEstagio: EstagioPipeline | null;
    }) => void;
  }

  let { open = $bindable(), visitaId, profissionalEstagio, sessionToken, onclose, onsave }: Props = $props();

  let etapa = $state<Etapa>('selecionar');
  let salvarAudio = $state<boolean | null>(null);
  let resumo = $state('');
  let proximaAcao = $state('');
  let objetivoVisita = $state('');
  let erro = $state('');
  let erroLimite = $state(false);
  let comprando = $state<number | null>(null);
  let proximaVisitaSugerida = $state<ProximaVisitaSugerida>(null);
  let sugestaoEstagio = $state<EstagioPipeline | null>(null);
  let confirmarAgenda = $state(false);
  let confirmarEstagio = $state(false);
  let salvandoExtras = $state(false);
  let gravacao = useGravacaoAudio();

  let podeConfirmarEstagio = $derived.by(() => {
    if (!sugestaoEstagio) return false;
    if (!profissionalEstagio) return true;

    const idxAtual = ORDEM_ESTAGIOS.indexOf(profissionalEstagio as EstagioPipeline);
    const idxNovo = ORDEM_ESTAGIOS.indexOf(sugestaoEstagio);

    return idxAtual === -1 ? true : idxNovo > idxAtual;
  });

  $effect(() => {
    if (!podeConfirmarEstagio) confirmarEstagio = false;
  });

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
    erroLimite = false;
    comprando = null;
    proximaVisitaSugerida = null;
    sugestaoEstagio = null;
    confirmarAgenda = false;
    confirmarEstagio = false;
    salvandoExtras = false;
    gravacao.descartar();
  }

  function fechar() {
    resetar();
    onclose();
  }

  async function verificarSaldoAntesDeGravar() {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/transcricoes/status`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.permitido) {
          erro = data.limite === 0
            ? 'Transcricoes por IA estao disponiveis a partir do Plano Profissional.'
            : 'Limite de transcricoes atingido. Compre um pacote adicional para continuar.';
          erroLimite = true;
          return false;
        }
      }
      return true;
    } catch {
      return true; // Se falhar a checagem, permite tentar e barrar no backend
    }
  }

  async function iniciarGravacao() {
    erro = '';
    erroLimite = false;
    
    const podeGravar = await verificarSaldoAntesDeGravar();
    if (!podeGravar) return;

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
    erroLimite = false;

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

      if (res.status === 402) {
        erro = 'Limite de transcricoes atingido. Compre um pacote adicional para continuar.';
        erroLimite = true;
        etapa = 'selecionar';
        gravacao.descartar();
        return;
      }

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Erro ao processar áudio');
      }

      const campos = await res.json();
      resumo = campos.resumo || '';
      proximaAcao = campos.proximaAcao || '';
      objetivoVisita = campos.objetivoVisita || '';
      proximaVisitaSugerida = campos.proximaVisitaSugerida ?? null;
      sugestaoEstagio = campos.sugestaoEstagio ?? null;
      confirmarAgenda = false;
      confirmarEstagio = false;
      etapa = 'revisar';
    } catch (err: any) {
      erro = err.message;
      etapa = 'gravar';
    }
  }

  async function confirmarSalvar() {
    salvandoExtras = true;
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

      if (confirmarAgenda && proximaVisitaSugerida) {
        const agendaRes = await fetch(`${PUBLIC_API_URL}/visitas/${visitaId}/confirmar-agenda`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dataISO: proximaVisitaSugerida.dataISO,
            observacao: proximaVisitaSugerida.observacao
          })
        });

        if (!agendaRes.ok) {
          const body = await agendaRes.json().catch(() => null);
          throw new Error(body?.error || 'Erro ao criar próxima visita');
        }
      }

      if (confirmarEstagio && sugestaoEstagio) {
        const estagioRes = await fetch(`${PUBLIC_API_URL}/visitas/${visitaId}/confirmar-estagio`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ novoEstagio: sugestaoEstagio })
        });

        if (!estagioRes.ok) {
          const body = await estagioRes.json().catch(() => null);
          throw new Error(body?.error || 'Erro ao avançar estágio');
        }
      }

      onsave({ resumo, proximaAcao, objetivoVisita, proximaVisitaSugerida, sugestaoEstagio });
      fechar();
    } catch (err: any) {
      erro = err.message;
    } finally {
      salvandoExtras = false;
    }
  }

  async function comprarPacote(quantidade: 20 | 50 | 100) {
    try {
      comprando = quantidade;
      const res = await fetch(`${PUBLIC_API_URL}/transcricoes/comprar-pacote`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantidade })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      } else {
        const data = await res.json().catch(() => null);
        erro = data?.error ?? 'Erro ao iniciar compra.';
      }
    } catch {
      erro = 'Erro de conexão.';
    } finally {
      comprando = null;
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
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
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
                {#each [0, 1, 2, 3, 4] as i}
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

            {#if proximaVisitaSugerida}
              <div
                class="border border-gray-200 rounded-lg p-3 space-y-2"
                style={confirmarAgenda ? 'border-color: var(--brand-primary); background-color: var(--brand-light);' : ''}
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex min-w-0 gap-2">
                    <CalendarPlus class="w-4 h-4 shrink-0 mt-0.5" style="color: var(--brand-primary);" />
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-900">Próxima visita sugerida</p>
                      <p class="text-xs text-gray-500 mt-0.5">{proximaVisitaSugerida.observacao}</p>
                      {#if proximaVisitaSugerida.dataISO}
                        <p class="text-xs font-medium mt-1" style="color: var(--brand-primary);">
                          {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(proximaVisitaSugerida.dataISO))}
                        </p>
                      {:else}
                        <p class="text-xs text-gray-400 mt-1">Data não identificada. Será agendada em 30 dias.</p>
                      {/if}
                    </div>
                  </div>
                  <button
                    onclick={() => confirmarAgenda = !confirmarAgenda}
                    class="px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors shrink-0 cursor-pointer"
                    style={confirmarAgenda
                      ? 'background-color: var(--brand-primary); color: white; border-color: var(--brand-primary);'
                      : 'border-color: var(--border-base); color: var(--text-secondary);'}
                  >
                    {confirmarAgenda ? 'Confirmado' : 'Confirmar'}
                  </button>
                </div>
              </div>
            {/if}

            {#if sugestaoEstagio && podeConfirmarEstagio}
              <div
                class="border border-gray-200 rounded-lg p-3 space-y-2"
                style={confirmarEstagio ? 'border-color: var(--pipeline-interessado); background-color: color-mix(in srgb, var(--pipeline-interessado) 10%, white);' : ''}
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex min-w-0 gap-2">
                    <TrendingUp class="w-4 h-4 shrink-0 mt-0.5" style="color: var(--pipeline-interessado);" />
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-900">Mudança de estágio sugerida</p>
                      <p class="text-xs text-gray-500 mt-0.5">
                        A IA identificou que o médico pode avançar para
                        <strong>{ESTAGIO_LABELS[sugestaoEstagio] ?? sugestaoEstagio}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    onclick={() => confirmarEstagio = !confirmarEstagio}
                    class="px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors shrink-0 cursor-pointer"
                    style={confirmarEstagio
                      ? 'background-color: var(--pipeline-interessado); color: white; border-color: var(--pipeline-interessado);'
                      : 'border-color: var(--border-base); color: var(--text-secondary);'}
                  >
                    {confirmarEstagio ? 'Confirmado' : 'Confirmar'}
                  </button>
                </div>
              </div>
            {/if}

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
          <div class="flex flex-col gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
            <div class="flex items-center gap-2">
              <AlertCircle class="w-4 h-4 shrink-0" />
              {erro}
            </div>
            {#if erroLimite}
              <div class="mt-1 grid grid-cols-3 gap-2">
                {#each [
                  { quantidade: 20, label: '+20', preco: 'R$ 19' },
                  { quantidade: 50, label: '+50', preco: 'R$ 39' },
                  { quantidade: 100, label: '+100', preco: 'R$ 69' }
                ] as pacote}
                  <button
                    onclick={() => comprarPacote(pacote.quantidade as 20 | 50 | 100)}
                    disabled={comprando !== null}
                    class="flex min-h-14 flex-col items-center justify-center rounded-md bg-red-100 px-2 py-2 text-xs font-medium text-red-800 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {#if comprando === pacote.quantidade}
                      <Loader2 class="h-4 w-4 animate-spin" />
                    {:else}
                      <span>{pacote.label}</span>
                      <span>{pacote.preco}</span>
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}
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
            disabled={salvarAudio === null || salvandoExtras}
            style="background-color: var(--brand-primary); border-radius: 8px;"
            class="flex-1 h-10 text-sm font-medium text-white hover:opacity-90 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {#if salvandoExtras}
              <Loader2 class="w-4 h-4 animate-spin" />
              Salvando...
            {:else}
              Confirmar
            {/if}
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
