<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_LANDING_URL } from '$env/static/public';
	import { ArrowLeft } from 'lucide-svelte';
	import { useClerkContext, SignIn } from 'svelte-clerk';

	let { data } = $props<{ data: { email: string; redirectUrl: string | null } }>();
	let redirectUrl = $derived(data.redirectUrl ?? '/dashboard');
	let signInInitialValues = $derived(data.email ? { emailAddress: data.email } : undefined);

	onMount(async () => {
		const clerkCtx = useClerkContext();
		if (clerkCtx?.clerk) {
			await clerkCtx.clerk.load();
			if (clerkCtx.clerk.user) {
				goto(redirectUrl);
			}
		}
	});
</script>

<svelte:head>
	<title>Login — MediVisitas</title>
	<meta name="description" content="Faça login no MediVisitas — CRM para Propagandistas Farmacêuticos" />
</svelte:head>

<div class="min-h-screen flex">

	<!-- ═══ Painel Esquerdo — Dark / Identidade Visual ═══ -->
	<div class="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
		style="background-color: rgb(var(--slate-900));">

		<!-- Glow Radial no Fundo -->
		<div class="absolute top-1/4 left-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>

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

		<!-- Citação central -->
		<div class="flex flex-col gap-4 relative z-10">
			<p class="text-3xl md:text-4xl font-medium leading-snug"
				style="color: rgb(var(--slate-50));">
				"A ferramenta que transformou<br>
				minha gestão de visitas.<br>
				Simples, eficiente e inteligente."
			</p>
			<div class="mt-4 flex items-center gap-3">
				<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
					style="background-color: rgb(var(--accent)); color: rgb(var(--slate-50));">
					JF
				</div>
				<div>
					<p class="text-sm font-medium" style="color: rgb(var(--slate-50));">Jamille Fritz</p>
					<p class="text-xs" style="color: rgb(var(--slate-400));">
						Propagandista Farmacêutica · Natudermefarma
					</p>
				</div>
			</div>
		</div>

		<!-- BASE — Trust Indicators -->
		<div class="grid grid-cols-4 gap-6 pt-8 border-t relative z-10"
			style="border-color: rgba(255,255,255,0.1);">
			{#each [
				{ valor: '200+', label: 'Usuários ativos' },
				{ valor: '4.9★', label: 'Avaliação na loja' },
				{ valor: '68%', label: 'Redução de relatórios' },
				{ valor: '10h+', label: 'Economizadas/mês' },
			] as m}
				<div>
					<p class="text-2xl font-bold" style="color: rgb(var(--slate-50));">{m.valor}</p>
					<p class="text-xs mt-1" style="color: rgba(255,255,255,0.4);">{m.label}</p>
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
			<h1 class="page-title-marker text-2xl font-bold" style="color: var(--text-primary);">Bem-vindo</h1>
			<p class="text-sm mt-1" style="color: var(--text-secondary);">
				Faça login para acessar sua conta
			</p>
		</div>

		<!-- Componente Clerk com aparência completamente customizada -->
		<SignIn
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
			path="/login"
			signUpUrl="/onboarding"
			initialValues={signInInitialValues}
			forceRedirectUrl={redirectUrl}
			fallbackRedirectUrl="/dashboard"
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
