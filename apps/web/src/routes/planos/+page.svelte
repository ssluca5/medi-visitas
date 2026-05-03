<script lang="ts">
  import { PUBLIC_API_URL, PUBLIC_LANDING_URL } from '$env/static/public';
  import { useClerkContext } from 'svelte-clerk';
  import { Check, LogOut } from 'lucide-svelte';
  import ModalContatoEmpresarial from '$lib/components/planos/ModalContatoEmpresarial.svelte';

  type PlanoKey = 'BASICO' | 'PROFISSIONAL' | 'EQUIPE';

  let { data } = $props<{
    data: {
      plano: string | null;
      status: string | null;
      diasRestantes: number | null;
      sessionToken: string | null;
      temStripe?: boolean;
    };
  }>();

  const planos: Array<{
    key: PlanoKey;
    nome: string;
    descricao: string;
    preco: string;
    suporte: string;
    destaque?: string;
    features: string[];
  }> = [
    {
      key: 'BASICO',
      nome: 'Basico',
      descricao: 'Para organizar a carteira e manter a rotina comercial em dia.',
      preco: 'R$ 79',
      suporte: '48h',
      features: [
        'Ate 100 profissionais cadastrados',
        'Agenda inteligente',
        'Historico de visitas',
        'Pipeline comercial',
        'Notificacoes automaticas'
      ]
    },
    {
      key: 'PROFISSIONAL',
      nome: 'Profissional',
      descricao: 'Para representantes que usam IA e relatórios no dia a dia.',
      preco: 'R$ 149',
      suporte: '24h',
      destaque: 'Mais completo',
      features: [
        'Profissionais ilimitados',
        'Tudo do Basico',
        '50 transcricoes de IA por mes',
        'Pacotes adicionais de IA',
        'Relatorios e exportacao CSV'
      ]
    },
    {
      key: 'EQUIPE',
      nome: 'Equipe',
      descricao: 'Para gestores com ate 10 propagandistas na mesma operacao.',
      preco: 'R$ 349',
      suporte: '4h',
      features: [
        'Tudo do Profissional',
        'Ate 10 usuarios na equipe',
        '200 transcricoes compartilhadas',
        'Dashboard do gestor',
        'Uso de IA por membro'
      ]
    }
  ];

  let loading = $state<string | null>(null);
  let error = $state<string | null>(null);
  let modalContatoAberto = $state(false);
  const clerkCtx = useClerkContext();

  async function sair() {
    const redirectUrl = PUBLIC_LANDING_URL ?? 'http://localhost:4321';
    await clerkCtx.clerk?.signOut({ redirectUrl });
    window.location.href = redirectUrl;
  }

  async function assinar(plano: PlanoKey) {
    loading = plano;
    error = null;

    try {
      const res = await fetch(`${PUBLIC_API_URL}/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(data.sessionToken ? { Authorization: `Bearer ${data.sessionToken}` } : {})
        },
        body: JSON.stringify({ plano })
      });

      if (!res.ok) {
        const errData = await res.json();
        error = errData.error || 'Erro ao criar sessao de checkout';
        return;
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      error = 'Erro de conexao. Tente novamente.';
    } finally {
      loading = null;
    }
  }

  async function gerenciarAssinatura() {
    loading = 'PORTAL';
    error = null;

    try {
      const res = await fetch(`${PUBLIC_API_URL}/billing/portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(data.sessionToken ? { Authorization: `Bearer ${data.sessionToken}` } : {})
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        error = errData.error || 'Erro ao abrir portal de gerenciamento';
        return;
      }

      const { portalUrl } = await res.json();
      window.location.href = portalUrl;
    } catch {
      error = 'Erro de conexao. Tente novamente.';
    } finally {
      loading = null;
    }
  }
</script>

<svelte:head>
  <title>Planos - MediVisitas</title>
</svelte:head>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <a href="/dashboard" class="text-sm font-medium" style="color: var(--brand-primary);">
          Voltar para o dashboard
        </a>
        <h1 class="mt-4 text-2xl font-semibold" style="color: var(--text-primary);">
          {data.status === 'SUSPENSO' || data.status === 'CANCELADO'
            ? 'Sua assinatura foi encerrada'
            : 'Planos'}
        </h1>
        <p class="mt-1 text-sm" style="color: var(--text-secondary);">
          {#if data.status === 'TRIAL_ATIVO'}
            Trial ativo: {data.diasRestantes ?? 0} dia(s) restantes.
          {:else if data.status === 'SUSPENSO' || data.status === 'CANCELADO'}
            Escolha um plano para continuar usando o MediVisitas.
          {:else}
            Escolha o plano ideal para sua rotina comercial.
          {/if}
        </p>
      </div>

      {#if data.status === 'SUSPENSO' || data.status === 'CANCELADO'}
        <button
          onclick={sair}
          class="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm"
          style="background-color: var(--bg-surface); border-color: var(--border-base); color: var(--text-secondary);"
        >
          <LogOut class="h-4 w-4" />
          Sair da conta
        </button>
      {/if}
    </div>

    {#if error}
      <div
        class="mb-5 rounded-lg border px-4 py-3 text-sm"
        style="background-color: var(--danger-light); border-color: var(--danger-border); color: var(--danger);"
      >
        {error}
      </div>
    {/if}

    <div class="grid gap-4 lg:grid-cols-3">
      {#each planos as plano}
        {@const isAtual = data.plano === plano.key}
        <div
          class="flex rounded-xl border p-6"
          style="background-color: var(--bg-surface); border-color: {isAtual ? 'var(--brand-primary)' : 'var(--border-base)'}; border-width: {isAtual ? '2px' : '1px'};"
        >
          <div class="flex w-full flex-col">
            <div class="flex min-h-7 items-center gap-2">
              {#if isAtual}
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  style="background-color: var(--brand-light); color: var(--brand-dark);"
                >
                  Seu plano atual
                </span>
              {:else if plano.destaque}
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  style="background-color: var(--success-bg); color: var(--success-text);"
                >
                  {plano.destaque}
                </span>
              {/if}
            </div>

            <h2 class="mt-3 text-lg font-semibold" style="color: var(--text-primary);">
              {plano.nome}
            </h2>
            <p class="mt-1 min-h-10 text-sm" style="color: var(--text-secondary);">
              {plano.descricao}
            </p>

            <div class="mt-4">
              <span class="text-3xl font-semibold" style="color: var(--text-primary);">
                {plano.preco}
              </span>
              <span class="text-sm" style="color: var(--text-muted);">/mes</span>
            </div>

            <ul class="mt-5 flex-1 space-y-2">
              {#each plano.features as feature}
                <li class="flex items-start gap-2 text-sm" style="color: var(--text-primary);">
                  <Check class="mt-0.5 h-4 w-4 shrink-0" style="color: var(--status-ativo);" />
                  <span>{feature}</span>
                </li>
              {/each}
            </ul>

            <p class="mt-4 text-xs" style="color: var(--text-muted);">
              Suporte por email - resposta em {plano.suporte}
            </p>

            <div class="mt-6">
              {#if isAtual && data.status === 'ATIVO' && data.temStripe}
                <button
                  onclick={gerenciarAssinatura}
                  disabled={loading !== null}
                  class="h-10 w-full rounded-lg border text-sm font-medium disabled:opacity-50"
                  style="border-color: var(--brand-primary); color: var(--brand-primary);"
                >
                  {loading === 'PORTAL' ? 'Abrindo...' : 'Gerenciar assinatura'}
                </button>
              {:else}
                <button
                  onclick={() => assinar(plano.key)}
                  disabled={loading !== null || isAtual}
                  class="h-10 w-full rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                  style="background-color: var(--brand-primary);"
                >
                  {loading === plano.key ? 'Aguarde...' : isAtual ? 'Plano selecionado' : 'Assinar agora'}
                </button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div
      class="mt-4 rounded-xl border p-6"
      style="background-color: var(--bg-surface); border-color: var(--border-base);"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-semibold" style="color: var(--text-primary);">Empresarial</h2>
          <p class="mt-1 max-w-2xl text-sm" style="color: var(--text-secondary);">
            Para equipes com mais de 10 propagandistas. Preco e funcionalidades customizados para sua operacao.
          </p>
        </div>
        <button
          onclick={() => (modalContatoAberto = true)}
          class="h-10 rounded-lg px-5 text-sm font-semibold text-white"
          style="background-color: var(--ai-primary);"
        >
          Falar com o comercial
        </button>
      </div>
    </div>
  </div>
</div>

<ModalContatoEmpresarial
  aberto={modalContatoAberto}
  onFechar={() => (modalContatoAberto = false)}
/>
