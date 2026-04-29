<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public'
  import { page } from '$app/state'

  // Estados
  let etapa = $state<'escolha' | 'nome-empresa' | 'processando'>('escolha')
  let opcaoSelecionada = $state<'trial-individual' | 'trial-empresa' | 'pagar-individual' | 'pagar-empresa'>('trial-individual')
  let nomeEmpresa = $state('')
  let loading = $state(false)
  let erro = $state('')

  const sessionToken = $derived(page.data.sessionToken)

  // Ao selecionar trial empresa ou pagar empresa → ir para etapa de nome
  function selecionarOpcao(opcao: typeof opcaoSelecionada) {
    opcaoSelecionada = opcao
    if (opcao === 'trial-empresa' || opcao === 'pagar-empresa') {
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
      const isEmpresa = opcaoSelecionada?.includes('empresa')
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

      // Se escolheu pagar, redirecionar para checkout Stripe
      if (opcaoSelecionada?.startsWith('pagar')) {
        const plano = opcaoSelecionada === 'pagar-individual' ? 'INDIVIDUAL' : 'EMPRESA'
        const checkoutRes = await fetch(`${PUBLIC_API_URL}/billing/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ plano }),
        })

        if (checkoutRes.ok) {
          const { checkoutUrl } = await checkoutRes.json()
          window.location.href = checkoutUrl
          return
        }
      }

      // Trial — forçar reload completo para novo token Clerk
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
    <div class="grid grid-cols-3 gap-6 pt-8 border-t relative z-10"
      style="border-color: rgba(255,255,255,0.1);">
      {#each [
        { valor: '7 dias', label: 'Trial gratuito' },
        { valor: '200+', label: 'Propagandistas' },
        { valor: '4.9★', label: 'Avaliação média' },
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
    <div class="flex flex-col gap-4 w-full max-w-lg">

      <!-- OPÇÃO A: Trial gratuito individual -->
      <button
        onclick={() => selecionarOpcao('trial-individual')}
        disabled={loading}
        class="w-full text-left p-5 rounded-2xl border-2 bg-white transition-all cursor-pointer relative group
               disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]
               ${opcaoSelecionada === 'trial-individual'
                 ? 'border-blue-600 shadow-lg shadow-blue-600/10 ring-4 ring-blue-600/10'
                 : 'border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5'}"
      >
        <!-- Radio indicator -->
        <div class="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${opcaoSelecionada === 'trial-individual'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-slate-300 bg-white'}">
          {#if opcaoSelecionada === 'trial-individual'}
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          {/if}
        </div>

        <div class="flex items-start justify-between pr-8">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                        ${opcaoSelecionada === 'trial-individual' ? 'bg-blue-600' : 'bg-blue-50'}">
              <svg class="w-5 h-5 transition-colors ${opcaoSelecionada === 'trial-individual' ? 'text-white' : 'text-blue-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="font-semibold" style="color: #111827;">
                Começar trial gratuito — 7 dias
              </p>
              <p class="text-sm mt-1" style="color: #6b7280;">
                Uso individual. Sem cartão de crédito.
                Explore tudo sem compromisso.
              </p>
            </div>
          </div>
          <span class="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-3"
            style="background-color: #d1fae5; color: #065f46;">
            Grátis
          </span>
        </div>
      </button>

      <!-- OPÇÃO B: Assinar Individual -->
      <button
        onclick={() => selecionarOpcao('pagar-individual')}
        disabled={loading}
        class="w-full text-left p-5 rounded-2xl border-2 bg-white transition-all cursor-pointer relative group
               disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]
               ${opcaoSelecionada === 'pagar-individual'
                 ? 'border-blue-600 shadow-lg shadow-blue-600/10 ring-4 ring-blue-600/10'
                 : 'border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5'}"
      >
        <!-- Radio indicator -->
        <div class="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${opcaoSelecionada === 'pagar-individual'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-slate-300 bg-white'}">
          {#if opcaoSelecionada === 'pagar-individual'}
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          {/if}
        </div>

        <div class="flex items-start gap-4 pr-8">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${opcaoSelecionada === 'pagar-individual' ? 'bg-blue-600' : 'bg-blue-50'}">
            <svg class="w-5 h-5 transition-colors ${opcaoSelecionada === 'pagar-individual' ? 'text-white' : 'text-blue-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <p class="font-semibold" style="color: #111827;">
                Plano Individual
              </p>
              <p class="font-bold" style="color: #2563eb;">
                R$ 79<span class="text-xs font-normal">/mês</span>
              </p>
            </div>
            <p class="text-sm" style="color: #6b7280;">
              Para propagandistas autônomos. Acesso completo,
              transcrição por IA, agenda inteligente.
            </p>
            <ul class="flex flex-wrap gap-2 mt-3">
              {#each ['Cadastro ilimitado', 'IA 50/mês', 'Pipeline', 'Agenda'] as f}
                <li class="flex items-center gap-1.5 text-xs" style="color: #475569;">
                  <svg class="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </button>

      <!-- OPÇÃO C: Assinar Empresa -->
      <button
        onclick={() => selecionarOpcao('pagar-empresa')}
        disabled={loading}
        class="w-full text-left p-5 rounded-2xl border-2 bg-white transition-all cursor-pointer relative group
               disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]
               ${opcaoSelecionada === 'pagar-empresa'
                 ? 'border-violet-600 shadow-lg shadow-violet-600/10 ring-4 ring-violet-600/10'
                 : 'border-slate-200 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-600/5'}"
      >
        <!-- Radio indicator -->
        <div class="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${opcaoSelecionada === 'pagar-empresa'
                      ? 'border-violet-600 bg-violet-600'
                      : 'border-slate-300 bg-white'}">
          {#if opcaoSelecionada === 'pagar-empresa'}
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          {/if}
        </div>

        <div class="flex items-start gap-4 pr-8">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${opcaoSelecionada === 'pagar-empresa' ? 'bg-violet-600' : 'bg-violet-50'}">
            <svg class="w-5 h-5 transition-colors ${opcaoSelecionada === 'pagar-empresa' ? 'text-white' : 'text-violet-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                   M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                   m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <p class="font-semibold" style="color: #111827;">
                Plano Empresa
              </p>
              <p class="font-bold" style="color: #7c3aed;">
                R$ 49<span class="text-xs font-normal">/mês por usuário</span>
              </p>
            </div>
            <p class="text-sm" style="color: #6b7280;">
              Para gestores com equipe de propagandistas.
              Dashboard consolidado e IA ilimitada.
            </p>
            <ul class="flex flex-wrap gap-2 mt-3">
              {#each ['Múltiplos usuários', 'IA ilimitada', 'Dashboard gestor', 'Relatórios'] as f}
                <li class="flex items-center gap-1.5 text-xs" style="color: #475569;">
                  <svg class="w-3.5 h-3.5 text-violet-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </button>

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
        {opcaoSelecionada === 'trial-empresa'
          ? 'Trial gratuito de 7 dias — Plano Empresa'
          : 'Plano Empresa — R$ 49/mês por usuário'}
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
        {opcaoSelecionada === 'trial-empresa' ? 'Começar trial grátis →' : 'Continuar para pagamento →'}
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
