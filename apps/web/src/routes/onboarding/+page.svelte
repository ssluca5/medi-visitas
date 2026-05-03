<script lang="ts">
  import { PUBLIC_API_URL, PUBLIC_LANDING_URL } from '$env/static/public'
  import { page } from '$app/state'
  import { ArrowLeft, Check } from 'lucide-svelte'

  type PlanoKey = 'BASICO' | 'PROFISSIONAL' | 'EQUIPE';

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
      descricao: 'Para representantes que usam IA e relatórios no dia a dia.',
      preco: 'R$ 149',
      suporte: '24h',
      tag: 'Mais completo',
      tagClasses: 'bg-emerald-100 text-emerald-700',
      features: [
        'Profissionais ilimitados',
        'Tudo do Básico',
        '50 transcrições de IA por mês',
        'Pacotes adicionais de IA',
        'Relatórios e exportação CSV'
      ]
    },
    {
      key: 'EQUIPE',
      nome: 'Equipe',
      descricao: 'Para gestores com até 10 propagandistas na mesma operação.',
      preco: 'R$ 349',
      suporte: '4h',
      tag: 'Para times',
      tagClasses: 'bg-purple-100 text-purple-700',
      features: [
        'Tudo do Profissional',
        'Até 10 usuários na equipe',
        '200 transcrições compartilhadas',
        'Dashboard do gestor',
        'Uso de IA por membro'
      ]
    }
  ];

  // Estados
  let etapa = $state<'escolha' | 'nome-empresa' | 'processando'>('escolha')
  let opcaoSelecionada = $state<PlanoKey>('PROFISSIONAL')
  let nomeEmpresa = $state('')
  let loading = $state(false)
  let erro = $state('')

  const sessionToken = $derived(page.data.sessionToken)

  // Ao selecionar equipe → ir para etapa de nome
  function selecionarOpcao(opcao: typeof opcaoSelecionada) {
    opcaoSelecionada = opcao
    if (opcao === 'EQUIPE') {
      etapa = 'nome-empresa'
    } else {
      // Individual — ir direto para confirmação
      confirmar()
    }
  }

  async function confirmar() {
    loading = true
    erro = ''

    try {
      // Determinar endpoint e body
      const isEmpresa = opcaoSelecionada === 'EQUIPE'
      const endpoint = isEmpresa
        ? `${PUBLIC_API_URL}/onboarding/empresa`
        : `${PUBLIC_API_URL}/onboarding/individual`

      const body = isEmpresa
        ? JSON.stringify({ nomeEmpresa: nomeEmpresa.trim() })
        : undefined

      const headers: Record<string, string> = {
        Authorization: `Bearer ${sessionToken}`,
      }
      if (body) {
        headers['Content-Type'] = 'application/json'
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body,
      })

      if (!res.ok) {
        let msg = 'Erro ao criar organização'
        try {
          const data = await res.json()
          if (data.error) msg = data.error
        } catch {
          // response body may be empty or non-JSON
        }
        throw new Error(msg)
      }

      // Redirecionar para checkout Stripe com o plano selecionado
      const checkoutRes = await fetch(`${PUBLIC_API_URL}/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ plano: opcaoSelecionada }),
      })

      if (checkoutRes.ok) {
        const { checkoutUrl } = await checkoutRes.json()
        window.location.href = checkoutUrl
        return
      }

      // Fallback
      await new Promise(r => setTimeout(r, 1000))
      window.location.href = '/dashboard'

    } catch (e) {
      erro = e instanceof Error ? e.message : 'Erro desconhecido'
      loading = false
    }
  }
</script>

{#if etapa === 'escolha'}
<div class="flex h-screen w-full overflow-hidden bg-white font-sans">

  <!-- ═══ Painel Esquerdo — Dark / Proposta de Valor ═══ -->
  <div class="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
    style="background-color: rgb(var(--slate-900));">

    <!-- TOPO — Logo -->
    <div class="relative z-10">
      <div class="flex items-center gap-2">
        <p class="text-2xl font-bold tracking-tight"
          style="color: rgb(var(--slate-50));">MediVisitas</p>
        <span class="w-2 h-2 rounded-full"
          style="background-color: rgb(var(--accent));"></span>
      </div>
      <p class="text-sm mt-1.5"
        style="color: rgb(var(--slate-300));">CRM para Propagandistas Farmacêuticos</p>
    </div>

    <!-- MEIO — Proposta de Valor -->
    <div class="flex flex-col gap-4 relative z-10">
      <h2 class="text-3xl md:text-4xl font-medium leading-snug"
        style="color: rgb(var(--slate-50));">
        "Transforme sua rotina de visitas em resultados reais."
      </h2>
      <p class="text-sm"
        style="color: rgb(var(--slate-400));">
        Escolha o plano ideal para o seu momento. Faça o upgrade ou cancele a qualquer momento, sem burocracia.
      </p>
    </div>

    <!-- BASE — Trust Indicators -->
    <div class="grid grid-cols-4 gap-6 pt-8 border-t relative z-10"
      style="border-color: rgba(255,255,255,0.1);">
      {#each [
        { valor: '7 dias', label: 'Trial gratuito' },
        { valor: 'Zero', label: 'Taxa de setup' },
        { valor: 'Imediato', label: 'Acesso liberado' },
        { valor: 'Fácil', label: 'Cancelamento online' },
      ] as m}
        <div>
          <p class="text-2xl font-bold" style="color: rgb(var(--slate-50));">{m.valor}</p>
          <p class="text-xs mt-1" style="color: rgba(255,255,255,0.4);">{m.label}</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- ═══ Painel Direito — Escolha de Planos ═══ -->
  <div class="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-12 md:px-20 bg-white relative overflow-y-auto">

    <!-- Logo mobile -->
    <div class="lg:hidden text-center mb-10">
      <div class="flex items-center justify-center gap-2">
        <span class="text-2xl font-bold" style="color: #111827;">MediVisitas</span>
        <span class="w-2 h-2 rounded-full" style="background-color: rgb(var(--accent));"></span>
      </div>
      <p class="text-sm mt-1" style="color: #6b7280;">CRM para Propagandistas Farmacêuticos</p>
    </div>

    <!-- Cabeçalho -->
    <div class="mb-8 text-center w-full max-w-lg">
      <h1 class="text-3xl font-bold mb-2" style="color: #0f172a;">Como você quer começar?</h1>
      <p class="text-sm" style="color: #64748b;">Escolha uma opção abaixo. Você pode mudar depois.</p>
    </div>

    <!-- Cards de opção -->
    <div class="flex flex-col gap-5 w-full max-w-lg">
      {#each planos as plano}
        {@const isSelected = opcaoSelecionada === plano.key}
        <button
          type="button"
          onclick={() => (opcaoSelecionada = plano.key)}
          class="relative flex flex-col p-6 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200
            {isSelected
              ? 'border-blue-600 bg-blue-50/30 ring-4 ring-blue-600/10 shadow-md'
              : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 shadow-sm'}"
        >
          <!-- Radio indicator -->
          <div class="absolute top-6 right-6">
            <div
              class="flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors
                {isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}"
            >
              {#if isSelected}
                <Check class="size-3 text-white" strokeWidth={3} />
              {/if}
            </div>
          </div>

          <!-- Top row: Tag, Nome e Preço -->
          <div class="flex flex-col pr-8 w-full">
            <div class="flex items-center gap-2 mb-1 min-h-[22px]">
              {#if plano.tag}
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest {plano.tagClasses}"
                >
                  {plano.tag}
                </span>
              {/if}
            </div>
            
            <div class="flex items-center justify-between w-full">
              <h2 class="text-lg font-semibold" style="color: var(--text-primary);">
                {plano.nome}
              </h2>
              <div class="text-right">
                <span class="text-2xl font-bold" style="color: var(--text-primary);">
                  {plano.preco}
                </span>
                <span class="text-xs" style="color: var(--text-muted);">/mês</span>
              </div>
            </div>
            
            <p class="mt-1 text-sm leading-tight" style="color: var(--text-secondary);">
              {plano.descricao}
            </p>
          </div>

          <ul class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {#each plano.features as feature}
              <li class="flex items-center gap-1.5 text-xs" style="color: var(--text-primary);">
                <Check class="w-3.5 h-3.5 shrink-0" style="color: var(--status-ativo);" />
                <span>{feature}</span>
              </li>
            {/each}
          </ul>
        </button>
      {/each}
    </div>

    <!-- Botão Continuar -->
    <button
      onclick={() => selecionarOpcao(opcaoSelecionada)}
      disabled={loading}
      class="mt-6 w-full max-w-lg h-12 rounded-xl text-sm font-semibold text-white
             transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
             hover:opacity-90 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
      style="background-color: #2563eb;">
      {#if loading}
        <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"/>
          <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Processando...
      {:else}
        Continuar
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      {/if}
    </button>

    <!-- Erro -->
    {#if erro}
      <p class="mt-4 text-sm text-center max-w-lg" style="color: #dc2626;">{erro}</p>
    {/if}

    <!-- Nota de rodapé -->
    <p class="mt-6 text-xs text-center max-w-lg" style="color: #94a3b8;">
      Todos os planos incluem 7 dias de trial. Cancele quando quiser.
    </p>

    <!-- Link voltar para o site -->
    <a
      href={PUBLIC_LANDING_URL ?? 'http://localhost:4321'}
      class="mt-6 text-sm transition-colors flex items-center gap-1"
      style="color: #9ca3af;"
      onmouseenter={(e) => (e.currentTarget.style.color = '#6b7280')}
      onmouseleave={(e) => (e.currentTarget.style.color = '#9ca3af')}
    >
      <ArrowLeft class="w-3.5 h-3.5" />
      Voltar para o site
    </a>
  </div>
</div>

<!-- ETAPA 2: Nome da empresa -->
{:else if etapa === 'nome-empresa'}
<div class="min-h-screen flex flex-col items-center justify-center p-6"
  style="background-color: #f8f9fa;">

  <!-- Logo -->
  <div class="flex items-center gap-2 mb-8">
    <span class="text-xl font-bold" style="color: #111827;">MediVisitas</span>
    <span class="w-2 h-2 rounded-full" style="background-color: #2563eb;"></span>
  </div>

  <div class="w-full max-w-sm">

    <!-- Voltar -->
    <button
      onclick={() => { etapa = 'escolha'; erro = ''; }}
      class="flex items-center gap-1.5 text-sm mb-6 transition-colors cursor-pointer"
      style="color: #9ca3af;">
      ← Voltar
    </button>

    <!-- Título -->
    <h1 class="text-2xl font-bold mb-2" style="color: #111827;">
      {opcaoSelecionada === 'trial-empresa' ? 'Começar trial da empresa' : 'Configurar plano Empresa'}
    </h1>
    <p class="text-sm mb-6" style="color: #6b7280;">
      Informe o nome da sua representação comercial.
    </p>

    <!-- Card com resumo da escolha -->
    <div class="rounded-xl p-4 mb-6 border"
      style="background-color: #f5f3ff; border-color: #e9d5ff;">
      <p class="text-xs font-semibold uppercase tracking-wider mb-1"
        style="color: #7c3aed;">VOCÊ ESCOLHEU</p>
      <p class="text-sm font-medium" style="color: #111827;">
        {opcaoSelecionada === 'EQUIPE'
          ? 'Plano Equipe — R$ 349/mês'
          : `Plano ${opcaoSelecionada} — Assinatura Empresa`}
      </p>
    </div>

    <!-- Campo nome -->
    <div class="space-y-1.5 mb-6">
      <label for="nome-empresa" class="text-sm font-medium" style="color: #374151;">
        Nome da empresa <span style="color: #dc2626;">*</span>
      </label>
      <input
        id="nome-empresa"
        type="text"
        bind:value={nomeEmpresa}
        placeholder="Ex: Representações Silva Ltda"
        class="w-full h-10 px-3 text-sm rounded-xl border transition-colors
               focus:outline-none focus:ring-2"
        style="border-color: #e5e7eb; color: #111827;
               --tw-ring-color: rgba(37,99,235,0.2);"
        onkeydown={(e) => e.key === 'Enter' && nomeEmpresa.trim() && confirmar()}
      />
      <p class="text-xs" style="color: #9ca3af;">
        Pode ser alterado depois nas configurações.
      </p>
    </div>

    <!-- Botão confirmar -->
    <button
      onclick={confirmar}
      disabled={loading || nomeEmpresa.trim().length === 0}
      class="w-full h-11 rounded-xl text-sm font-semibold text-white
             transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
             hover:opacity-90 cursor-pointer"
      style="background-color: #2563eb; border-radius: 12px;">
      {#if loading}
        <span class="flex items-center justify-center gap-2">
          <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10"
              stroke="white" stroke-width="4"/>
            <path class="opacity-75" fill="white"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Criando organização...
        </span>
      {:else}
        Continuar para pagamento →
      {/if}
    </button>

    <!-- Erro -->
    {#if erro}
      <p class="mt-3 text-sm text-center" style="color: #dc2626;">{erro}</p>
    {/if}

  </div>
</div>

<!-- ETAPA 3: Processando (loading) -->
{:else if etapa === 'processando'}
<div class="min-h-screen flex flex-col items-center justify-center p-6"
  style="background-color: #f8f9fa;">
  <svg class="animate-spin w-8 h-8 mb-4" viewBox="0 0 24 24" fill="none">
    <circle class="opacity-25" cx="12" cy="12" r="10"
      stroke="#2563eb" stroke-width="4"/>
    <path class="opacity-75" fill="#2563eb"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
  <p class="text-sm font-medium" style="color: #111827;">Configurando sua conta...</p>
  <p class="text-xs mt-1" style="color: #9ca3af;">Isso leva apenas alguns segundos.</p>
</div>
{/if}
