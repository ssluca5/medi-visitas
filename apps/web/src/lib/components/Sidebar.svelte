<script lang="ts">
	import { page } from '$app/state';
	import {
		Users,
		Calendar,
		FileText,
		BarChart3,
		Stethoscope,
		LogOut,
		LayoutDashboard,
		Package,
		PanelLeftClose,
		PanelLeft
	} from 'lucide-svelte';
	import type { NavItem } from '$lib/types';
	import SinoNotificacoes from '$lib/components/layout/SinoNotificacoes.svelte';
	import { PUBLIC_LANDING_URL } from '$env/static/public';

	interface Props {
		userName: string;
		sessionToken: string | null;
		plano?: string;
		organizationId?: string;
		trialExpiraEm?: string;
		role?: string;
		statusOrg?: string;
		temRelatorios?: boolean;
		temGestaoEquipe?: boolean;
	}

	let {
		userName,
		sessionToken,
		plano,
		trialExpiraEm,
		role,
		statusOrg,
		temRelatorios = false,
		temGestaoEquipe = false
	}: Props = $props();

	let diasRestantes = $derived.by(() => {
		if (!trialExpiraEm || statusOrg !== 'TRIAL_ATIVO') return null;
		const expira = new Date(trialExpiraEm);
		const agora = new Date();
		const diff = Math.ceil((expira.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
		return Math.max(0, diff);
	});

	let collapsed = $state(false);

	// Restore from localStorage on mount
	$effect(() => {
		const stored = localStorage.getItem('sidebar-state');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				collapsed = parsed.collapsed ?? false;
			} catch {
				collapsed = false;
			}
		}
	});

	// Persist to localStorage
	$effect(() => {
		localStorage.setItem('sidebar-state', JSON.stringify({ collapsed }));
	});

	const navItems: (NavItem & { tourAttr?: string })[] = [
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tourAttr: 'data-tour-dashboard' },
		{ href: '/dashboard/agenda', label: 'Agenda', icon: Calendar, tourAttr: 'data-tour-agenda' },
		{ href: '/dashboard/visitas', label: 'Visitas', icon: FileText },
		{ href: '/dashboard/pipeline', label: 'Pipeline', icon: BarChart3, tourAttr: 'data-tour-pipeline' }
	];

	let adminItems = $derived.by((): NavItem[] => role === 'OWNER' && temGestaoEquipe ? [
		{ href: '/dashboard/equipe', label: 'Equipe', icon: Users },
		{ href: '/dashboard/gestor', label: 'Gestão/Resumo', icon: BarChart3 }
	] : []);

	let planoLabel = $derived.by(() => {
		if (statusOrg === 'TRIAL_ATIVO') return `Trial - ${diasRestantes ?? 0}d`;
		if (plano === 'BASICO') return 'Basico';
		if (plano === 'PROFISSIONAL') return 'Profissional';
		if (plano === 'EQUIPE') return 'Equipe';
		if (plano === 'EMPRESARIAL') return 'Empresarial';
		return plano ?? 'Plano';
	});

	const cadAuxItems: (NavItem & { tourAttr?: string })[] = [
		{ href: '/dashboard/profissionais', label: 'Profissionais', icon: Users, tourAttr: 'data-tour-profissionais' },
		{ href: '/dashboard/especialidades', label: 'Especialidades', icon: Stethoscope, tourAttr: 'data-tour-especialidades' },
		{ href: '/dashboard/materiais', label: 'Materiais e Amostras', icon: Package, tourAttr: 'data-tour-materiais' }
	];

	let currentPath = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		if (href === '/dashboard') return currentPath === '/dashboard';
		return currentPath.startsWith(href);
	}

	function toggleCollapse() {
		collapsed = !collapsed;
	}

	import { useClerkContext } from 'svelte-clerk';
	const clerkCtx = useClerkContext();

	async function sair() {
		const redirectUrl = PUBLIC_LANDING_URL ?? 'http://localhost:4321';
		await clerkCtx.clerk?.signOut({ redirectUrl });
		// Fallback caso o signOut nÃ£o redirecione automaticamente
		window.location.href = redirectUrl;
	}
</script>

<aside
	aria-label="NavegaÃ§Ã£o principal"
	class="hidden flex-shrink-0 flex-col h-full bg-white border-r border-[rgb(var(--slate-200))] relative transition-[width] duration-300 ease-in-out lg:flex overflow-visible"
	class:w-64={!collapsed}
	class:w-16={collapsed}
>
	<!-- Header with toggle -->
	<div class="shrink-0 flex items-center justify-between px-5 pt-5 pb-4">
		{#if !collapsed}
			<div class="flex-1 min-w-0 flex items-center gap-2">
				<svg width="22" height="22" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
					<rect width="32" height="32" rx="6" fill="#2563eb"/>
					<text x="16" y="23" font-family="Inter,sans-serif" font-weight="700" font-size="20" fill="white" text-anchor="middle">M</text>
				</svg>
				<div>
					<h1 class="text-lg font-semibold tracking-tight text-[rgb(var(--slate-900))] leading-tight">MediVisitas</h1>
					<p class="text-[10px] text-[rgb(var(--slate-400))] leading-tight">CRM para Propagandistas</p>
				</div>
			</div>
			<button
				onclick={toggleCollapse}
				aria-label="Recolher sidebar"
				aria-expanded="true"
				class="ml-2 shrink-0 p-1.5 rounded-md text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer"
				title="Recolher sidebar"
			>
				<PanelLeftClose class="h-4 w-4" />
			</button>
		{:else}
			<button
				onclick={toggleCollapse}
				aria-label="Expandir sidebar"
				aria-expanded="false"
				class="mx-auto p-1.5 rounded-md text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] transition-all duration-200 cursor-pointer"
				title="Expandir sidebar"
			>
				<PanelLeft class="h-4 w-4" />
			</button>
		{/if}
	</div>

	<!-- Navigation (scrollable middle section) -->
	<nav aria-label="Principal" class="flex-1 overflow-y-auto overflow-x-visible px-3 space-y-0.5">
		{#each navItems as item}
			{@const active = isActive(item.href)}
			{@const Icon = item.icon}
			{@const tourSpread = item.tourAttr ? { [item.tourAttr]: '' } : {}}
			<a
				href={item.href}
				aria-current={active ? 'page' : undefined}
				class={collapsed
					? `group flex items-center justify-center rounded-lg p-2 transition-all duration-200 ease-out cursor-pointer ${active ? 'bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]' : 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}`
					: active
						? 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]'
						: 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))] will-change-transform transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]'}
				title={collapsed ? item.label : undefined}
				{...tourSpread}
			>
				<Icon class={active
					? 'h-[18px] w-[18px] text-blue-600 transition-colors duration-200'
					: 'h-[18px] w-[18px] text-[rgb(var(--slate-400))] group-hover:text-[rgb(var(--slate-600))] transition-colors duration-200'} />
				{#if !collapsed}
					<span>{item.label}</span>
				{/if}
			</a>
		{/each}

		<!-- Section Divider: Cadastros -->
		{#if !collapsed}
			<p class="px-2.5 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]" style="letter-spacing: 0.07em;">
				Cadastros
			</p>
		{:else}
			<div class="pt-3 pb-1 flex justify-center">
				<div class="w-6 h-px bg-[rgb(var(--slate-200))]"></div>
			</div>
		{/if}

		{#each cadAuxItems as item}
			{@const active = isActive(item.href)}
			{@const Icon = item.icon}
			{@const tourSpread = item.tourAttr ? { [item.tourAttr]: '' } : {}}
			<a
				href={item.href}
				aria-current={active ? 'page' : undefined}
				class={collapsed
					? `group flex items-center justify-center rounded-lg p-2 transition-all duration-200 ease-out cursor-pointer ${active ? 'bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]' : 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}`
					: active
						? 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]'
						: 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))] will-change-transform transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]'}
				title={collapsed ? item.label : undefined}
				{...tourSpread}
			>
				<Icon class={active
					? 'h-[18px] w-[18px] text-blue-600 transition-colors duration-200'
					: 'h-[18px] w-[18px] text-[rgb(var(--slate-400))] group-hover:text-[rgb(var(--slate-600))] transition-colors duration-200'} />
				{#if !collapsed}
					<span>{item.label}</span>
				{/if}
			</a>
		{/each}

		<!-- Section Divider: Configurações -->
		{#if !collapsed}
			<p class="px-2.5 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]" style="letter-spacing: 0.07em;">
				Configurações
			</p>
		{:else}
			<div class="pt-3 pb-1 flex justify-center">
				<div class="w-6 h-px bg-[rgb(var(--slate-200))]"></div>
			</div>
		{/if}

		{#each adminItems as item}
			{@const active = isActive(item.href)}
			{@const Icon = item.icon}
			<a
				href={item.href}
				aria-current={active ? 'page' : undefined}
				class={collapsed
					? `group flex items-center justify-center rounded-lg p-2 transition-all duration-200 ease-out cursor-pointer ${active ? 'bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]' : 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}`
					: active
						? 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]'
						: 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))] will-change-transform transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]'}
				title={collapsed ? item.label : undefined}
			>
				<Icon class={active
					? 'h-[18px] w-[18px] text-blue-600 transition-colors duration-200'
					: 'h-[18px] w-[18px] text-[rgb(var(--slate-400))] group-hover:text-[rgb(var(--slate-600))] transition-colors duration-200'} />
				{#if !collapsed}
					<span>{item.label}</span>
				{/if}
			</a>
		{/each}

		{#if role === 'OWNER' && !temGestaoEquipe}
			<span
				class={collapsed
					? 'flex items-center justify-center rounded-lg p-2 text-[rgb(var(--slate-300))] cursor-not-allowed'
					: 'flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-300))] cursor-not-allowed'}
				title="Disponivel no Plano Equipe"
			>
				<Users class="h-[18px] w-[18px]" />
				{#if !collapsed}
					<span>Equipe</span>
					<span class="ml-auto text-[10px] font-semibold" style="color: var(--text-muted);">Equipe</span>
				{/if}
			</span>
			<span
				class={collapsed
					? 'flex items-center justify-center rounded-lg p-2 text-[rgb(var(--slate-300))] cursor-not-allowed'
					: 'flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-300))] cursor-not-allowed'}
				title="Disponivel no Plano Equipe"
			>
				<BarChart3 class="h-[18px] w-[18px]" />
				{#if !collapsed}
					<span>Gestor</span>
					<span class="ml-auto text-[10px] font-semibold" style="color: var(--text-muted);">Equipe</span>
				{/if}
			</span>
		{/if}

		{#if !temRelatorios}
			<span
				class={collapsed
					? 'flex items-center justify-center rounded-lg p-2 text-[rgb(var(--slate-300))] cursor-not-allowed'
					: 'flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-300))] cursor-not-allowed'}
				title="Disponivel no Plano Profissional"
			>
				<FileText class="h-[18px] w-[18px]" />
				{#if !collapsed}
					<span>Relatorios</span>
					<span class="ml-auto text-[10px] font-semibold" style="color: var(--text-muted);">Pro</span>
				{/if}
			</span>
		{:else}
			<a
				href="/dashboard/relatorios"
				aria-current={isActive('/dashboard/relatorios') ? 'page' : undefined}
				class={collapsed
					? `group flex items-center justify-center rounded-lg p-2 transition-all duration-200 ease-out cursor-pointer ${isActive('/dashboard/relatorios') ? 'bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]' : 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}`
					: isActive('/dashboard/relatorios')
						? 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]'
						: 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))] will-change-transform transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]'}
				title={collapsed ? 'Relatorios' : undefined}
			>
				<FileText class={isActive('/dashboard/relatorios')
					? 'h-[18px] w-[18px] text-blue-600 transition-colors duration-200'
					: 'h-[18px] w-[18px] text-[rgb(var(--slate-400))] group-hover:text-[rgb(var(--slate-600))] transition-colors duration-200'} />
				{#if !collapsed}
					<span>Relatorios</span>
				{/if}
			</a>
		{/if}
	</nav>

	<!-- Trial expiry banner -->
	{#if diasRestantes !== null && diasRestantes <= 2 && !collapsed}
		<div class="mx-3 mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
			<p class="text-xs font-medium text-amber-800">
				{#if diasRestantes === 0}
					Trial expira hoje
				{:else if diasRestantes === 1}
					Trial expira amanhÃ£
				{:else}
					Trial expira em {diasRestantes} dias
				{/if}
			</p>
			<a href="/planos" class="mt-1 block text-xs text-amber-600 underline hover:text-amber-700">
				Assinar agora
			</a>
		</div>
	{/if}

	<!-- Footer da sidebar â€” estrutura correta -->
	<div class="mt-auto shrink-0 border-t px-2 py-2 bg-white border-[rgb(var(--slate-100))]">

		<div class="flex items-center gap-1 transition-all duration-300"
				 class:flex-col={collapsed}
				 class:gap-2={collapsed}>
			<a href="/dashboard/perfil"
				class="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
				title="Meu Perfil">
				<!-- Avatar -->
				<div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm"
					style="background-color: #2563eb;">
					{userName.charAt(0).toUpperCase()}
				</div>
				<!-- Nome + plano embaixo -->
				{#if !collapsed}
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium text-[rgb(var(--slate-900))]">
							{userName}
						</p>
						<!-- Badge do plano aqui embaixo, menor e integrado -->
						<p class="text-[10px] truncate text-blue-600" style="line-height: 1.2;">
							{planoLabel}
						</p>
					</div>
				{/if}
			</a>
			<!-- Sino de notificaÃ§Ãµes -->
			<div class="relative z-10 flex-shrink-0">
				<SinoNotificacoes {sessionToken} />
			</div>
		</div>

		<!-- BotÃ£o sair -->
		<button onclick={sair}
			class="mt-0.5 flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[rgb(var(--slate-400))] transition-colors hover:bg-gray-50 hover:text-gray-600 cursor-pointer"
		>
			<LogOut class="h-3.5 w-3.5" />
			{#if !collapsed}
				Sair
			{/if}
		</button>
	</div>
</aside>
