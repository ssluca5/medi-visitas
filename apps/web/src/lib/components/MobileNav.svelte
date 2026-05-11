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
		Menu,
		Target,
		Bell,
		User,
		HelpCircle,
		Settings,
		CreditCard,
		Building2,
		Shield,
		ChevronUp
	} from 'lucide-svelte';
	import type { NavItem } from '$lib/types';
	import Sheet from '$lib/components/ui/Sheet.svelte';
	import SinoNotificacoes from '$lib/components/layout/SinoNotificacoes.svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		userName: string;
		sessionToken: string | null;
		role?: string;
		temRelatorios?: boolean;
		temGestaoEquipe?: boolean;
		temMetas?: boolean;
	}

	let {
		userName,
		sessionToken,
		role,
		temRelatorios = false,
		temGestaoEquipe = false,
		temMetas = false
	}: Props = $props();

	let drawerOpen = $state(false);
	let userMenuOpen = $state(false);

	const navItems: NavItem[] = [
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
		{ href: '/dashboard/visitas', label: 'Visitas', icon: FileText },
		{ href: '/dashboard/pipeline', label: 'Pipeline', icon: BarChart3 }
	];

	const cadAuxItems: NavItem[] = [
		{ href: '/dashboard/profissionais', label: 'Profissionais', icon: Users },
		{ href: '/dashboard/especialidades', label: 'Especialidades', icon: Stethoscope },
		{ href: '/dashboard/materiais', label: 'Materiais e Amostras', icon: Package }
	];

	let adminItems = $derived.by((): NavItem[] =>
		role === 'OWNER' && temGestaoEquipe
			? [
					{ href: '/dashboard/equipe', label: 'Equipe', icon: Users },
					{ href: '/dashboard/gestor', label: 'Gestor', icon: BarChart3 }
				]
			: []
	);

	let currentPath = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		if (href === '/dashboard') return currentPath === '/dashboard';
		return currentPath.startsWith(href);
	}

	function closeDrawer() {
		drawerOpen = false;
		userMenuOpen = false;
	}

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	const userMenuItems = [
		{ href: '/dashboard/perfil#conta', label: 'Conta', icon: User },
		{ href: '/dashboard/perfil#plano', label: 'Plano', icon: CreditCard },
		{ href: '/dashboard/perfil#organizacao', label: 'Organização', icon: Building2 },
		{ href: '/dashboard/perfil#seguranca', label: 'Segurança', icon: Shield },
		{ href: '/dashboard/perfil#notificacoes', label: 'Notificações', icon: Bell },
		{ href: '/dashboard/perfil#preferencias', label: 'Preferências', icon: Settings },
		{ href: '/dashboard/suporte', label: 'Ajuda / Suporte', icon: HelpCircle }
	] as const;

	import { useClerkContext } from 'svelte-clerk';
	const clerkCtx = useClerkContext();

	async function sair() {
		// Informa ao Clerk para redirecionar para a nossa rota de logout
		// que limpa o cookie httpOnly e redireciona para o login
		await clerkCtx.clerk?.signOut({ redirectUrl: '/logout' });
	}
</script>

<!-- Mobile header bar (visible below lg) -->
<header class="flex lg:hidden items-center justify-between px-4 py-3 bg-white border-b border-[rgb(var(--slate-200))] shrink-0">
	<button
		type="button"
		onclick={() => (drawerOpen = true)}
		aria-label="Abrir menu de navegação"
		aria-expanded={drawerOpen}
		aria-haspopup="dialog"
		class="p-2 -ml-2 rounded-lg text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-700))] hover:bg-[rgb(var(--slate-100))] transition-colors cursor-pointer"
	>
		<Menu class="h-5 w-5" />
	</button>

	<div class="flex-1 min-w-0 flex items-center justify-center gap-2">
		<svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
			<rect width="32" height="32" rx="6" fill="var(--brand-primary)"/>
			<text x="16" y="23" font-family="Inter,sans-serif" font-weight="700" font-size="20" fill="white" text-anchor="middle">M</text>
		</svg>
		<h1 class="text-base font-semibold text-[rgb(var(--slate-900))] tracking-tight">MediVisitas</h1>
	</div>

	<div class="relative z-10">
		<SinoNotificacoes {sessionToken} />
	</div>
</header>

<!-- Drawer Sheet -->
<Sheet bind:open={drawerOpen} onclose={closeDrawer} side="left">
	<div class="flex flex-col h-full -m-6">
		<!-- Drawer header -->
		<div class="shrink-0 px-5 pt-5 pb-4 border-b border-[rgb(var(--slate-100))]">
			<div class="flex items-center gap-2">
				<svg width="22" height="22" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
					<rect width="32" height="32" rx="6" fill="var(--brand-primary)"/>
					<text x="16" y="23" font-family="Inter,sans-serif" font-weight="700" font-size="20" fill="white" text-anchor="middle">M</text>
				</svg>
				<div>
					<h1 class="text-lg font-semibold tracking-tight text-[rgb(var(--slate-900))] leading-tight">MediVisitas</h1>
					<p class="text-[10px] text-[rgb(var(--slate-400))] mt-0.5 leading-tight">CRM para Propagandistas</p>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<nav aria-label="Navegação principal" class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
			{#each navItems as item}
				{@const active = isActive(item.href)}
				{@const Icon = item.icon}
				<a
					href={item.href}
					onclick={closeDrawer}
					aria-current={active ? 'page' : undefined}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ease-out cursor-pointer {active
						? 'font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]'
						: 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}"
				>
					<Icon class="h-[18px] w-[18px] {active ? 'text-blue-600' : 'text-[rgb(var(--slate-400))]'} transition-colors duration-200" />
					<span>{item.label}</span>
				</a>
			{/each}

			{#if !temMetas}
				<span
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[rgb(var(--slate-300))] cursor-not-allowed"
					title="Disponível no Plano Profissional ou Equipe"
				>
					<Target class="h-[18px] w-[18px]" />
					<span>Metas</span>
					<span class="ml-auto text-[10px] font-semibold" style="color: var(--text-muted);">Pro</span>
				</span>
			{:else}
				{@const activeMetas = isActive('/dashboard/metas')}
				<a
					href="/dashboard/metas"
					onclick={closeDrawer}
					aria-current={activeMetas ? 'page' : undefined}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ease-out cursor-pointer {activeMetas
						? 'font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]'
						: 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}"
				>
					<Target class="h-[18px] w-[18px] {activeMetas ? 'text-blue-600' : 'text-[rgb(var(--slate-400))]'} transition-colors duration-200" />
					<span>Metas</span>
				</a>
			{/if}

			<!-- Section divider -->
			<div class="pt-5 pb-1">
				<div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]">
					Cadastros
				</div>
			</div>

			{#each cadAuxItems as item}
				{@const active = isActive(item.href)}
				{@const Icon = item.icon}
				<a
					href={item.href}
					onclick={closeDrawer}
					aria-current={active ? 'page' : undefined}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ease-out cursor-pointer {active
						? 'font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]'
						: 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}"
				>
					<Icon class="h-[18px] w-[18px] {active ? 'text-blue-600' : 'text-[rgb(var(--slate-400))]'} transition-colors duration-200" />
					<span>{item.label}</span>
				</a>
			{/each}

			{#if adminItems.length > 0 || role === 'OWNER'}
				<div class="pt-5 pb-1">
					<div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]">
						Gestão
					</div>
				</div>

				{#if adminItems.length > 0}
					{#each adminItems as item}
						{@const active = isActive(item.href)}
						{@const Icon = item.icon}
						<a
							href={item.href}
							onclick={closeDrawer}
							aria-current={active ? 'page' : undefined}
							class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ease-out cursor-pointer {active
								? 'font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]'
								: 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}"
						>
							<Icon class="h-[18px] w-[18px] {active ? 'text-blue-600' : 'text-[rgb(var(--slate-400))]'} transition-colors duration-200" />
							<span>{item.label}</span>
						</a>
					{/each}
				{:else}
					<span class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[rgb(var(--slate-300))] cursor-not-allowed">
						<Users class="h-[18px] w-[18px]" />
						<span>Equipe</span>
						<span class="ml-auto text-[10px] font-semibold" style="color: var(--text-muted);">Equipe</span>
					</span>
					<span class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[rgb(var(--slate-300))] cursor-not-allowed">
						<BarChart3 class="h-[18px] w-[18px]" />
						<span>Gestor</span>
						<span class="ml-auto text-[10px] font-semibold" style="color: var(--text-muted);">Equipe</span>
					</span>
				{/if}
			{/if}

			<div class="pt-5 pb-1">
				<div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]">
					Conta
				</div>
			</div>

			{#if temRelatorios}
				{@const activeRelatorios = isActive('/dashboard/relatorios')}
				<a
					href="/dashboard/relatorios"
					onclick={closeDrawer}
					aria-current={activeRelatorios ? 'page' : undefined}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ease-out cursor-pointer {activeRelatorios
						? 'font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]'
						: 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}"
				>
					<FileText class="h-[18px] w-[18px] {activeRelatorios ? 'text-blue-600' : 'text-[rgb(var(--slate-400))]'} transition-colors duration-200" />
					<span>Relatórios</span>
				</a>
			{:else}
				<span class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[rgb(var(--slate-300))] cursor-not-allowed">
					<FileText class="h-[18px] w-[18px]" />
					<span>Relatórios</span>
					<span class="ml-auto text-[10px] font-semibold" style="color: var(--text-muted);">Pro</span>
				</span>
			{/if}

			{#each [
				{ href: '/dashboard/notificacoes', label: 'Notificações', icon: Bell },
				{ href: '/dashboard/perfil', label: 'Perfil', icon: User },
				{ href: '/dashboard/suporte', label: 'Suporte', icon: HelpCircle }
			] as item}
				{@const active = isActive(item.href)}
				{@const Icon = item.icon}
				<a
					href={item.href}
					onclick={closeDrawer}
					aria-current={active ? 'page' : undefined}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 ease-out cursor-pointer {active
						? 'font-medium bg-[rgb(var(--slate-100))]/80 text-[rgb(var(--slate-900))]'
						: 'text-[rgb(var(--slate-500))] hover:text-[rgb(var(--slate-800))] hover:bg-[rgb(var(--slate-50))]'}"
				>
					<Icon class="h-[18px] w-[18px] {active ? 'text-blue-600' : 'text-[rgb(var(--slate-400))]'} transition-colors duration-200" />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>

		<!-- User footer -->
		<div class="shrink-0 border-t border-[rgb(var(--slate-100))] p-3">
			<!-- Menu de opções do usuário (colapsável) -->
			{#if userMenuOpen}
				<div
					class="mb-2 flex flex-col rounded-xl border border-[rgb(var(--slate-100))] bg-white py-1 shadow-sm"
					transition:slide={{ duration: 200, easing: cubicOut }}
				>
					{#each userMenuItems as item}
						{@const Icon = item.icon}
						<a
							href={item.href}
							onclick={closeDrawer}
							class="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[rgb(var(--slate-700))] transition-colors hover:bg-[rgb(var(--slate-50))] hover:text-[rgb(var(--slate-900))]"
						>
							<Icon class="h-4 w-4 text-[rgb(var(--slate-400))]" />
							<span>{item.label}</span>
						</a>
					{/each}

					<div class="my-1 border-t border-[rgb(var(--slate-100))]"></div>

					<button
						type="button"
						onclick={() => {
							closeDrawer();
							sair();
						}}
						class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
					>
						<LogOut class="h-4 w-4 text-red-500" />
						<span>Sair</span>
					</button>
				</div>
			{/if}

			<!-- Botão com nome do usuário (toggle do menu) -->
			<button
				type="button"
				onclick={toggleUserMenu}
				aria-expanded={userMenuOpen}
				aria-haspopup="true"
				aria-controls="mobile-user-menu"
				class="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[rgb(var(--slate-50))] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
				title="Opções do usuário"
			>
				<div
					class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm"
				>
					{userName.charAt(0).toUpperCase()}
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-[13px] font-medium text-[rgb(var(--slate-700))]">
						{userName}
					</p>
					<p class="text-[10px] text-blue-600">
						{userMenuOpen ? 'Fechar menu' : 'Opções da conta'}
					</p>
				</div>
				<ChevronUp
					class="h-4 w-4 flex-shrink-0 text-[rgb(var(--slate-400))] transition-transform duration-200 {userMenuOpen
						? ''
						: 'rotate-180'}"
				/>
			</button>
		</div>
	</div>
</Sheet>
