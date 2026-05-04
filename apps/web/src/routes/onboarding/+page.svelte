<script lang="ts">
  import { PUBLIC_API_URL, PUBLIC_LANDING_URL } from '$env/static/public'
  import { page } from '$app/state'
  import { ArrowLeft, Check } from 'lucide-svelte'

  type PlanoKey = 'GRATUITO' | 'BASICO' | 'PROFISSIONAL' | 'EQUIPE';

  const todosPlanos: Array<{
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
      key: 'GRATUITO',
      nome: '7 dias grátis',
      descricao: 'Experimente por 7 dias sem compromisso. Sem cartão de crédito.',
      preco: 'Grátis',
      suporte: '48h',
      tag: 'Recomendado',
      tagClasses: 'bg-emerald-100 text-emerald-700',
      features: [
        '7 dias de acesso completo',
        'Até 100 profissionais cadastrados',
        'Agenda inteligente',
        'Histórico de visitas',
        'Pipeline comercial'
      ]
    },
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
      descricao: 'Para representantes que usam IA e relatórios na rotina.',
      preco: 'R$ 149',
      suporte: '24h',
      tag: 'Mais popular',
      tagClasses: 'bg-blue-100 text-blue-700',
      features: [
        'Profissionais ilimitados',
        '50 transcrições de IA/mês',
        'Pacotes adicionais de IA',
        'Relatórios e CSV',
        'Tudo do Básico'
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

  // Plano da query string (?plano=BASICO, PROFISSIONAL, EQUIPE)
  // Mapeia slugs da landing para keys do onboarding
  const planoParamMap: Record<string, PlanoKey> = {
    'BASICO': 'BASICO',
    'PROFISSIONAL': 'PROFISSIONAL',
    'EQUIPE': 'EQUIPE',
  };
  const planoParam = $derived(page.url.searchParams.get('plano'));
  const planoFiltrado = $derived(planoParam ? planoParamMap[planoParam] : null);

	// Filtra planos: sem param → só gratuito; com param → só o plano escolhido
	const planos = $derived(
		planoFiltrado
			? todosPlanos.filter(p => p.key === planoFiltrado)
			: todosPlanos.filter(p => p.key === 'GRATUITO')
	);

	type PlanoInfo = {
		nome: string;
		preco?: string;
		badge?: string;
		depoimento?: string;
		autorNome?: string;
		autorCargo?: string;
		autorIniciais?: string;
		autorAvatarUrl?: string;
		metricas: { valor: string; rotulo: string }[];
	};

	const planosInfo: Record<PlanoKey, PlanoInfo> = {
		GRATUITO: {
			nome: '7 dias grátis.\nSem cartão de crédito.',
			metricas: [
				{ valor: '7 dias', rotulo: 'Grátis para testar' },
				{ valor: '100', rotulo: 'Profissionais' },
				{ valor: '200+', rotulo: 'Propagandistas' },
				{ valor: '4.9★', rotulo: 'Avaliação' },
			],
		},
		BASICO: {
			nome: 'Plano Básico',
			preco: 'R$ 79/mês',
			badge: 'Ideal para começar',
			depoimento: 'A agenda inteligente mudou minha rotina. Nunca mais esqueci uma visita.',
			autorNome: 'Carlos Almeida',
			autorCargo: 'Propagandista (3 anos)',
			autorIniciais: 'CA',
			autorAvatarUrl: 'https://i.pravatar.cc/150?img=11',
			metricas: [
				{ valor: 'R$ 79', rotulo: 'Por mês' },
				{ valor: '100', rotulo: 'Profissionais' },
				{ valor: '48h', rotulo: 'Suporte' },
				{ valor: '1', rotulo: 'Usuário' },
			],
		},
		PROFISSIONAL: {
			nome: 'Plano Profissional',
			preco: 'R$ 149/mês',
			badge: 'O mais popular',
			depoimento: 'Com a transcrição de IA, meus relatórios ficam prontos antes do almoço.',
			autorNome: 'Marina Silva',
			autorCargo: 'Propagandista (8 anos)',
			autorIniciais: 'MS',
			autorAvatarUrl: 'https://i.pravatar.cc/150?img=5',
			metricas: [
				{ valor: 'R$ 149', rotulo: 'Por mês' },
				{ valor: '500+', rotulo: 'Profissionais' },
				{ valor: '50', rotulo: 'Transcrições IA' },
				{ valor: '24h', rotulo: 'Suporte' },
			],
		},
		EQUIPE: {
			nome: 'Plano Equipe',
			preco: 'R$ 349/mês',
			badge: 'Para times',
			depoimento: 'Consigo acompanhar toda a operação em tempo real pelo dashboard.',
			autorNome: 'Roberto Gomes',
			autorCargo: 'Gestor (12 anos)',
			autorIniciais: 'RG',
			autorAvatarUrl: 'https://i.pravatar.cc/150?img=33',
			metricas: [
				{ valor: 'R$ 349', rotulo: 'Por mês' },
				{ valor: '10', rotulo: 'Usuários' },
				{ valor: '200', rotulo: 'Transcrições IA' },
				{ valor: '4h', rotulo: 'Suporte' },
			],
		},
	};

	// Estados
	let etapa = $state<'escolha' | 'nome-empresa' | 'processando'>('escolha')
	let opcaoSelecionada = $state<PlanoKey>(planoFiltrado ?? 'GRATUITO')
	let nomeEmpresa = $state('')
	let loading = $state(false)
	let erro = $state('')

	const sessionToken = $derived(page.data.sessionToken)
	const planoDados = $derived(planosInfo[opcaoSelecionada]);
	const planoUnico = $derived(planos[0]);

	/**
	 * Obtém um token válido — usa o sessionToken do layout,
	 * ou tenta refresh via /api/token se for null.
	 */
	async function getValidToken(): Promise<string> {
		if (sessionToken) return sessionToken;
		// Tentar refresh do token via endpoint server-side
		try {
			const res = await fetch('/api/token');
			if (res.ok) {
				const data = await res.json();
				if (data.token) return data.token;
			}
		} catch { /* ignore */ }
		throw new Error('Sessão expirada. Por favor, faça login novamente.');
	}


	function selecionarOpcao(opcao: typeof opcaoSelecionada) {
		opcaoSelecionada = opcao
		if (opcao === 'EQUIPE') {
			etapa = 'nome-empresa'
		} else if (opcao === 'GRATUITO') {
			confirmarGratuito()
		} else {
			confirmar()
		}
	}

	async function confirmarGratuito() {
		loading = true
		erro = ''

		try {
			const token = await getValidToken()
			const res = await fetch(`${PUBLIC_API_URL}/onboarding/individual`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
			})

			if (!res.ok) {
				let msg = 'Erro ao criar organização'
				try {
					const data = await res.json()
					if (data.error) msg = data.error
				} catch { /* empty */ }
				throw new Error(msg)
			}

			window.location.href = '/dashboard'
		} catch (e) {
			erro = e instanceof Error ? e.message : 'Erro desconhecido'
			loading = false
		}
	}

	async function confirmar() {
		loading = true
		erro = ''

		try {
			const token = await getValidToken()
			const isEmpresa = opcaoSelecionada === 'EQUIPE'
			const endpoint = isEmpresa
				? `${PUBLIC_API_URL}/onboarding/empresa`
				: `${PUBLIC_API_URL}/onboarding/individual`

			const body = isEmpresa
				? JSON.stringify({ nomeEmpresa: nomeEmpresa.trim() })
				: undefined

			const headers: Record<string, string> = {
				Authorization: `Bearer ${token}`,
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
				} catch { /* empty */ }
				throw new Error(msg)
			}

			// Paid plans: redirect to Stripe Checkout
			const checkoutRes = await fetch(`${PUBLIC_API_URL}/billing/checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ plano: opcaoSelecionada }),
			})

			if (checkoutRes.ok) {
				const { checkoutUrl } = await checkoutRes.json()
				window.location.href = checkoutUrl
				return
			}

			throw new Error('Erro ao criar sessão de pagamento')
		} catch (e) {
			erro = e instanceof Error ? e.message : 'Erro desconhecido'
			loading = false
		}
	}
</script>

{#if etapa === 'escolha'}
<div class="flex h-screen w-full overflow-hidden bg-white font-sans">

	<!-- ═══ Painel Esquerdo — Dark / Identidade Visual ═══ -->
	<div class="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-slate-900">

		<!-- Glow Radial no Fundo -->
		<div class="absolute top-1/4 left-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>

		<!-- TOPO — Logo -->
		<div class="relative z-10">
			<div class="flex items-center gap-2">
				<p class="text-2xl font-bold tracking-tight text-white">MediVisitas</p>
				<span class="w-2 h-2 rounded-full bg-brand-500"></span>
			</div>
			<p class="text-sm mt-1.5 text-slate-400">CRM para Propagandistas Farmacêuticos</p>
		</div>

		<!-- MEIO — Cabeçalho e Depoimento -->
		<div class="flex flex-col gap-8 relative z-10">
			<!-- Título e Badge -->
			<div class="mb-2">
				<h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 whitespace-pre-line">{planoDados.nome}</h1>
				<div class="flex items-center gap-3">
					{#if planoDados.preco}
						<span class="text-xl font-medium text-slate-300">{planoDados.preco}</span>
					{/if}
					{#if planoDados.badge}
						<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-50 border border-brand-500/30 uppercase tracking-widest">
							{planoDados.badge}
						</span>
					{/if}
				</div>
			</div>

			<!-- Depoimento Premium -->
			{#if planoDados.depoimento}
				<div class="flex flex-col gap-4 relative z-10 mt-4">
					<p class="text-2xl md:text-3xl font-medium leading-snug text-slate-50">
						"{planoDados.depoimento}"
					</p>
					
					<div class="mt-2 flex items-center gap-3">
						<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-brand-500 text-white">
							{planoDados.autorIniciais}
						</div>
						
						<div class="flex flex-col">
							<span class="text-sm font-medium text-slate-50">{planoDados.autorNome}</span>
							<span class="text-xs text-slate-400 mt-0.5">{planoDados.autorCargo}</span>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- BASE — Métricas -->
		<div class="grid grid-cols-4 gap-6 pt-8 border-t relative z-10" style="border-color: rgba(255,255,255,0.1);">
			{#each planoDados.metricas as m}
				<div>
					<p class="text-2xl font-bold text-slate-50">{m.valor}</p>
					<p class="text-xs mt-1" style="color: rgba(255,255,255,0.4);">{m.rotulo}</p>
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
    <div class="mb-10 text-center lg:text-left w-full max-w-md mx-auto lg:mx-0">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Tudo pronto para começar</h1>
      <p class="text-sm text-slate-500">
        {#if opcaoSelecionada === 'GRATUITO'}
          Aproveite seu período de teste. Você pode cancelar quando quiser.
        {:else}
          Você escolheu o plano {planoUnico.nome}. Finalize para começar.
        {/if}
      </p>
    </div>

    <!-- Summary Card -->
    <div class="w-full max-w-md mx-auto lg:mx-0 p-8 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm flex flex-col mb-8">
      <div class="pb-6 border-b border-slate-200/80 mb-6">
        <h2 class="text-2xl font-bold text-slate-900">{planoUnico.nome}</h2>
        <p class="text-sm text-slate-500 mt-2 leading-relaxed">
          {#if opcaoSelecionada === 'GRATUITO'}
            Acesso total a todas as ferramentas premium do MediVisitas. Sem cobranças automáticas.
          {:else}
            {planoUnico.descricao}
          {/if}
        </p>
      </div>

      <ul class="space-y-4 mb-8">
        {#if opcaoSelecionada === 'GRATUITO'}
          <li class="flex items-start gap-3 text-sm font-medium text-slate-700">
            <Check class="size-5 text-emerald-500 shrink-0"/>
            <span>Gestão completa da sua carteira de profissionais</span>
          </li>
          <li class="flex items-start gap-3 text-sm font-medium text-slate-700">
            <Check class="size-5 text-emerald-500 shrink-0"/>
            <span>Agenda inteligente com histórico de visitas</span>
          </li>
          <li class="flex items-start gap-3 text-sm font-medium text-slate-700">
            <Check class="size-5 text-emerald-500 shrink-0"/>
            <span>Relatórios e pipeline comercial integrados</span>
          </li>
        {:else}
          {#each planoUnico.features.slice(0, 3) as feature}
            <li class="flex items-start gap-3 text-sm font-medium text-slate-700">
              <Check class="size-5 text-emerald-500 shrink-0"/>
              <span>{feature}</span>
            </li>
          {/each}
        {/if}
      </ul>

      <!-- Botão Continuar -->
      <button
        onclick={() => selecionarOpcao(opcaoSelecionada)}
        disabled={loading}
        class="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {#if loading}
          <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"/>
            <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Processando...
        {:else}
          {opcaoSelecionada === 'GRATUITO' ? 'Começar meu teste grátis' : 'Continuar para pagamento'} <span>&rarr;</span>
        {/if}
      </button>

      {#if erro}
        <p class="mt-4 text-sm text-center" style="color: #dc2626;">{erro}</p>
      {/if}

      <p class="mt-5 text-xs text-slate-400 text-center">
        {#if opcaoSelecionada === 'GRATUITO'}
          Não exigimos cartão de crédito neste momento.
        {:else}
          Planos pagos podem ser cancelados a qualquer momento.
        {/if}
      </p>
    </div>

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
      Configurar plano Empresa
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
