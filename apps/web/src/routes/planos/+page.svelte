<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public';
  import { useClerkContext } from 'svelte-clerk';
  import { Check, LogOut } from 'lucide-svelte';
  import ModalContatoEmpresarial from '$lib/components/planos/ModalContatoEmpresarial.svelte';
  import { toast } from '$lib/stores/toast.svelte';

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
    tag?: string;
    tagClasses?: string;
    features: string[];
  }> = [
    {
      key: 'BASICO',
      nome: 'Básico',
      descricao: 'Para organizar a carteira e manter a rotina comercial em dia.',
      preco: 'R$ 79',
      suporte: '48h',
      tag: 'Essencial',
      tagClasses: 'bg-slate-100 text-slate-700',
      features: [
        'Até 100 profissionais cadastrados',
        'Agenda inteligente',
        'Histórico de visitas',
        'Pipeline comercial',
        'Notificações automáticas'
      ]
    },
    {
      key: 'PROFISSIONAL',
      nome: 'Profissional',
      descricao: 'Para representantes que usam IA, relatórios e metas no dia a dia.',
      preco: 'R$ 149',
      suporte: '24h',
      tag: 'Mais completo',
      tagClasses: 'bg-emerald-100 text-emerald-700',
      features: [
        'Profissionais ilimitados',
        'Metas de visitas e pipeline',
        'Tudo do Básico',
        '50 transcrições de IA por mês',
        'Pacotes adicionais de IA',
        'Relatórios e exportação CSV'
      ]
    },
    {
      key: 'EQUIPE',
      nome: 'Equipe',
      descricao: 'Para gestores com até 10 propagandistas e distribuição de metas.',
      preco: 'R$ 349',
      suporte: '4h',
      tag: 'Para times',
      tagClasses: 'bg-purple-100 text-purple-700',
      features: [
        'Tudo do Profissional',
        'Metas distribuídas pelo gestor',
        'Até 10 usuários na equipe',
        '200 transcrições compartilhadas',
        'Dashboard do gestor',
        'Uso de IA por membro'
      ]
    }
  ];

  let loading = $state<string | null>(null);
  let error = $state<string | null>(null);
  let modalContatoAberto = $state(false);
  const clerkCtx = useClerkContext();

  const isEncerrado = $derived(data.status === 'SUSPENSO' || data.status === 'CANCELADO');
  let selectedPlan = $state<PlanoKey | null>(null);
  const selectedNome = $derived(planos.find((p) => p.key === selectedPlan)?.nome ?? '');

  async function sair() {
    // 1. Invalidar sessão no Clerk (sem redirect automático)
    await clerkCtx.clerk?.signOut();
    // 2. Rota server-side deleta o cookie httpOnly e redireciona para /login
    window.location.href = '/logout';
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
        error = errData.error || 'Erro ao criar sessão de checkout';
        return;
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      error = 'Erro de conexão. Tente novamente.';
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
      error = 'Erro de conexão. Tente novamente.';
    } finally {
      loading = null;
    }
  }
</script>

<svelte:head>
  <title>Planos - MediVisitas</title>
</svelte:head>

<div class="min-h-dvh overflow-x-hidden lg:h-dvh lg:overflow-hidden" style="background-color: var(--bg-primary);">
  <div class="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col lg:h-full">
    <!-- 1. Barra superior: Voltar (esq) + Sair (dir) -->
    <header class="flex items-center justify-between w-full mb-10">
      {#if data.status === 'ATIVO' || data.status === 'TRIAL_ATIVO'}
        <a href="/dashboard" class="text-sm font-medium transition-opacity hover:opacity-80" style="color: var(--brand-primary);">
          ← Voltar para o dashboard
        </a>
      {:else}
        <a href="/onboarding" class="text-sm font-medium transition-opacity hover:opacity-80" style="color: var(--brand-primary);">
          ← Voltar para o início
        </a>
      {/if}
      {#if data.status === 'SUSPENSO' || data.status === 'CANCELADO'}
        <button
          onclick={sair}
          class="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors hover:bg-slate-50 cursor-pointer"
          style="background-color: var(--bg-surface); border-color: var(--border-base); color: var(--text-secondary);"
        >
          <LogOut class="h-4 w-4" />
          Sair da conta
        </button>
      {/if}
    </header>

    <!-- 2. Cabeçalho centralizado (funil visual) -->
    <div class="text-center mb-10 flex flex-col items-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-3" style="color: var(--text-primary);">
        {data.status === 'SUSPENSO' || data.status === 'CANCELADO'
          ? 'Sua assinatura foi encerrada'
          : 'Planos'}
      </h1>
      <p class="text-base max-w-lg" style="color: var(--text-secondary);">
        {#if data.status === 'TRIAL_ATIVO'}
          Trial ativo: {data.diasRestantes ?? 0} dia(s) restantes.
        {:else if data.status === 'SUSPENSO' || data.status === 'CANCELADO'}
          Escolha um plano para reativar sua conta e continuar organizando suas visitas.
        {:else}
          Escolha o plano ideal para sua rotina comercial.
        {/if}
      </p>
    </div>

    {#if error}
      <div
        class="mb-7 rounded-lg border px-4 py-3 text-sm"
        style="background-color: var(--danger-light); border-color: var(--danger-border); color: var(--danger);"
      >
        {error}
      </div>
    {/if}

    <!-- 3. Radio Cards: 3 colunas selecionáveis -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-7 w-full">
      {#each planos as plano}
        {@const isSelected = selectedPlan === plano.key}
        {@const isAtual = data.plano === plano.key}
        <button
          type="button"
          onclick={() => (selectedPlan = plano.key)}
          class="relative flex flex-col p-7 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200
            {isSelected
              ? 'border-blue-600 bg-blue-50/30 ring-4 ring-blue-600/10 shadow-md'
              : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 shadow-sm'}"
        >
          <!-- Radio indicator -->
          <div class="absolute top-7 right-7">
            <div
              class="flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors
                {isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}"
            >
              {#if isSelected}
                <Check class="size-3.5 text-white" />
              {/if}
            </div>
          </div>

          <!-- Tag area — altura fixa para alinhamento -->
          <div class="flex min-h-[28px] items-center gap-2">
            {#if isAtual && !isEncerrado}
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700"
              >
                Seu plano atual
              </span>
            {:else if plano.tag}
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest {plano.tagClasses}"
              >
                {plano.tag}
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
            <span class="text-3xl font-bold" style="color: var(--text-primary);">
              {plano.preco}
            </span>
            <span class="text-sm" style="color: var(--text-muted);">/mês</span>
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
            Suporte por email — resposta em {plano.suporte}
          </p>

          <!-- Botão removido para unificar ação no CTA global -->
        </button>
      {/each}
    </div>

    <!-- CTA Global centralizado -->
    <div class="w-full flex justify-center mt-8 mb-8">
      <button
        disabled={loading !== null || (selectedPlan === data.plano && data.status === 'ATIVO' && !data.temStripe)}
        onclick={() => {
          if (!selectedPlan) {
            toast.erro('Selecione um plano para continuar.');
            return;
          }
          if (selectedPlan === data.plano && data.status === 'ATIVO' && data.temStripe) {
            gerenciarAssinatura();
          } else {
            assinar(selectedPlan);
          }
        }}
        class="w-full max-w-sm h-[52px] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
      >
        {#if loading === 'PORTAL'}
          Abrindo portal...
        {:else if loading}
          Processando...
        {:else if selectedPlan && selectedPlan === data.plano && data.status === 'ATIVO'}
          {data.temStripe ? 'Gerenciar assinatura' : `Plano ${selectedNome} ativo`}
        {:else if selectedPlan && selectedPlan === data.plano}
          Renovar plano {selectedNome} →
        {:else if selectedPlan}
          Assinar plano {selectedNome} →
        {:else}
          Selecione um plano
        {/if}
      </button>
    </div>

    <!-- 4. Card Empresarial (mesma largura da grid) -->
    <div
      class="w-full rounded-2xl border p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      style="background-color: var(--bg-surface); border-color: var(--border-base);"
    >
      <div>
        <h3 class="text-lg font-bold" style="color: var(--text-primary);">Empresarial</h3>
        <p class="text-sm mt-1" style="color: var(--text-secondary);">
          Para equipes com mais de 10 propagandistas. Preço e funcionalidades customizados.
        </p>
      </div>
      <button
        onclick={() => (modalContatoAberto = true)}
        class="whitespace-nowrap px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
      >
        Falar com o comercial
      </button>
    </div>
  </div>
</div>

<ModalContatoEmpresarial
  aberto={modalContatoAberto}
  onFechar={() => (modalContatoAberto = false)}
/>
