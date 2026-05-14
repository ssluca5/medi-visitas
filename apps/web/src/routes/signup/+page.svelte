<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PUBLIC_LANDING_URL } from '$env/static/public';
	import { ArrowLeft } from 'lucide-svelte';
	import { useClerkContext, SignUp } from 'svelte-clerk';

	// Captura o plano escolhido na landing page (ex: ?plano=BASICO)
	const planoParam = $derived(page.url.searchParams.get('plano'));
	const onboardingUrl = $derived(
		planoParam ? `/onboarding?plano=${planoParam}` : '/onboarding'
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

	// Dados dinâmicos do painel esquerdo por plano
	const planosInfo: Record<string, PlanoInfo> = {
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
			depoimento: 'Com a transcrição de IA e as metas, meus relatórios ficam prontos antes do almoço.',
			autorNome: 'Marina Silva',
			autorCargo: 'Propagandista (8 anos)',
			autorIniciais: 'MS',
			autorAvatarUrl: 'https://i.pravatar.cc/150?img=5',
			metricas: [
				{ valor: 'R$ 149', rotulo: 'Por mês' },
				{ valor: 'Metas', rotulo: 'Incluídas' },
				{ valor: '50', rotulo: 'Transcrições IA' },
				{ valor: '24h', rotulo: 'Suporte' },
			],
		},
		EQUIPE: {
			nome: 'Plano Equipe',
			preco: 'R$ 349/mês',
			badge: 'Para times',
			depoimento: 'Distribuo metas pelo gestor e acompanho toda a operação em tempo real pelo dashboard.',
			autorNome: 'Roberto Gomes',
			autorCargo: 'Gestor (12 anos)',
			autorIniciais: 'RG',
			autorAvatarUrl: 'https://i.pravatar.cc/150?img=33',
			metricas: [
				{ valor: 'R$ 349', rotulo: 'Por mês' },
				{ valor: '10', rotulo: 'Usuários' },
				{ valor: 'Metas', rotulo: 'Por gestor' },
				{ valor: '4h', rotulo: 'Suporte' },
			],
		},
	};

	// Dados padrão (trial / sem plano)
	const planoPadrao: PlanoInfo = {
		nome: '7 dias grátis.\nSem cartão de crédito.',
		metricas: [
			{ valor: '7 dias', rotulo: 'Grátis para testar' },
			{ valor: '100', rotulo: 'Profissionais' },
			{ valor: '200+', rotulo: 'Propagandistas' },
			{ valor: '4.9★', rotulo: 'Avaliação' },
		],
	};

	const planoDados = $derived(
		planoParam && planosInfo[planoParam] ? planosInfo[planoParam] : planoPadrao
	);

	onMount(async () => {
		const clerkCtx = useClerkContext();
		if (clerkCtx?.clerk) {
			await clerkCtx.clerk.load();
			if (clerkCtx.clerk.user) {
				goto('/dashboard');
			}
		}
	});
</script>

<svelte:head>
	<title>Criar conta — MediVisitas</title>
	<meta name="description" content="Crie sua conta no MediVisitas — 7 dias grátis, sem cartão de crédito" />
</svelte:head>

<div class="min-h-screen flex">

	<!-- ═══ Painel Esquerdo — Dark / Identidade Visual ═══ -->
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
			<p class="text-sm mt-1.5 text-ui-muted">CRM para Propagandistas Farmacêuticos</p>
		</div>

		<!-- MEIO — Cabeçalho e Depoimento -->
		<div class="flex flex-col gap-8 relative z-10">
			<!-- Título e Badge -->
			<div class="mb-2">
				<h1 class="page-title-marker text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 whitespace-pre-line">{planoDados.nome}</h1>
				<div class="flex items-center gap-3">
					{#if planoDados.preco}
						<span class="text-xl font-medium text-ui-disabled">{planoDados.preco}</span>
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
					<p class="text-2xl md:text-3xl font-medium leading-snug text-ui-inverse-soft">
						"{planoDados.depoimento}"
					</p>
					
					<div class="mt-2 flex items-center gap-3">
						<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-brand-500 text-white">
							{planoDados.autorIniciais}
						</div>
						
						<div class="flex flex-col">
							<span class="text-sm font-medium text-ui-inverse-soft">{planoDados.autorNome}</span>
							<span class="text-xs text-ui-muted mt-0.5">{planoDados.autorCargo}</span>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- BASE — Métricas -->
		<div class="grid grid-cols-4 gap-6 pt-8 border-t relative z-10" style="border-color: rgba(255,255,255,0.1);">
			{#each planoDados.metricas as m}
				<div>
					<p class="text-2xl font-bold text-ui-inverse-soft">{m.valor}</p>
					<p class="text-xs mt-1" style="color: rgba(255,255,255,0.4);">{m.rotulo}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- ═══ Painel Direito — formulário Clerk customizado ═══ -->
	<div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8"
		style="background-color: var(--bg-primary);">

		<!-- Logo mobile (só em telas pequenas) -->
		<div class="lg:hidden flex items-center gap-2 mb-8">
			<span class="text-xl font-bold" style="color: var(--text-primary);">MediVisitas</span>
			<span class="w-2 h-2 rounded-full" style="background-color: var(--brand-primary);"></span>
		</div>

		<!-- Título acima do componente Clerk -->
		<div class="w-full max-w-sm mb-6 text-center">
			<h1 class="page-title-marker text-2xl font-bold" style="color: var(--text-primary);">Criar conta</h1>
			<p class="text-sm mt-1 text-ui-secondary">
				{#if planoDados.preco}
					{planoDados.preco} · {planoDados.badge}
				{:else}
					Experimente agora
				{/if}
			</p>
		</div>

		<!-- Componente Clerk com aparência completamente customizada -->
		<SignUp
			appearance={{
				layout: {
					logoPlacement: 'none',
					showOptionalFields: false,
					privacyPageUrl: '',
					termsPageUrl: '',
				},
				variables: {
					colorPrimary: 'var(--brand-primary)',
					colorBackground: 'var(--bg-surface)',
					colorText: 'var(--text-primary)',
					colorTextSecondary: 'var(--text-secondary)',
					colorTextOnPrimaryBackground: 'var(--bg-surface)',
					colorInputBackground: 'var(--bg-surface)',
					colorInputText: 'var(--text-primary)',
					colorDanger: 'var(--danger)',
					colorSuccess: 'var(--status-ativo)',
					colorWarning: 'var(--pipeline-prospectado)',
					colorNeutral: 'var(--text-secondary)',
					colorAlphaShade: 'var(--text-primary)',
					fontFamily: 'Inter, sans-serif',
					fontSize: '14px',
					fontWeight: {
						normal: 400,
						medium: 500,
						bold: 600,
					},
					borderRadius: '10px',
					spacingUnit: '4px',
				},
				elements: {
					rootBox: 'w-full max-w-sm',
					card: {
						boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
						border: '1px solid var(--border-base)',
						borderRadius: '16px',
						padding: '32px',
						backgroundColor: 'var(--bg-surface)',
					},
					headerTitle: { display: 'none' },
					headerSubtitle: { display: 'none' },
					logoBox: { display: 'none' },
					logoImage: { display: 'none' },
					formButtonPrimary: {
						backgroundColor: 'var(--brand-primary)',
						borderRadius: '10px',
						height: '44px',
						fontSize: '14px',
						fontWeight: '600',
						'&:hover': { backgroundColor: 'var(--brand-dark)' },
						'&:focus': { outline: '2px solid var(--brand-primary)', outlineOffset: '2px' },
					},
					formFieldInput: {
						borderColor: 'var(--border-base)',
						borderRadius: '10px',
						height: '40px',
						fontSize: '14px',
						'&:focus': {
							borderColor: 'var(--brand-primary)',
							boxShadow: '0 0 0 3px rgba(37,99,235,0.1)',
						},
					},
					formFieldLabel: {
						fontSize: '13px',
						fontWeight: '500',
						color: 'var(--text-body)',
					},
					socialButtonsBlockButton: {
						borderColor: 'var(--border-base)',
						borderRadius: '10px',
						height: '40px',
						fontSize: '14px',
						color: 'var(--text-body)',
						'&:hover': { backgroundColor: 'rgb(var(--slate-50))', borderColor: 'rgb(var(--slate-300))' },
					},
					socialButtonsBlockButtonText: {
						fontSize: '14px',
						fontWeight: '500',
					},
					dividerLine: { backgroundColor: 'var(--border-base)' },
					dividerText: { color: 'var(--text-muted)', fontSize: '12px' },
					footerActionLink: {
						color: 'var(--brand-primary)',
						fontWeight: '500',
						fontSize: '13px',
						'&:hover': { color: 'var(--brand-dark)' },
					},
					footerActionText: {
						color: 'var(--text-secondary)',
						fontSize: '13px',
					},
					footer: { display: 'none' },
					footerPages: { display: 'none' },
					footerPagesLink: { display: 'none' },
					formFieldErrorText: {
						color: 'var(--danger)',
						fontSize: '12px',
					},
					alertText: { fontSize: '13px' },
					otpCodeFieldInput: {
						borderColor: 'var(--border-base)',
						borderRadius: '8px',
						'&:focus': { borderColor: 'var(--brand-primary)' },
					},
				},
			}}
			routing="path"
			path="/signup"
			signInUrl="/login"
			fallbackRedirectUrl={onboardingUrl}
		/>

		<!-- Link voltar para o site -->
		<a
			href={PUBLIC_LANDING_URL ?? 'http://localhost:4321'}
			class="mt-6 text-sm transition-colors flex items-center gap-1"
			style="color: var(--text-muted);"
			onmouseenter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
			onmouseleave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
		>
			<ArrowLeft class="w-3.5 h-3.5" />
			Voltar para o site
		</a>
	</div>
</div>
