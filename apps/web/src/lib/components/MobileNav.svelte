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
		Bell
	} from 'lucide-svelte';
	import type { NavItem } from '$lib/types';
	import Sheet from '$lib/components/ui/Sheet.svelte';
	import SinoNotificacoes from '$lib/components/layout/SinoNotificacoes.svelte';

	interface Props {
		userName: string;
		sessionToken: string | null;
	}

	let { userName, sessionToken }: Props = $props();

	let drawerOpen = $state(false);

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

	let currentPath = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		if (href === '/dashboard') return currentPath === '/dashboard';
		return currentPath.startsWith(href);
	}

	function closeDrawer() {
		drawerOpen = false;
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

	<div class="flex-1 min-w-0 text-center">
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
			<h1 class="text-lg font-semibold tracking-tight text-[rgb(var(--slate-900))]">MediVisitas</h1>
			<p class="text-xs text-[rgb(var(--slate-400))] mt-0.5">CRM para Propagandistas</p>
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
		</nav>

		<!-- User footer -->
		<div class="shrink-0 border-t border-[rgb(var(--slate-100))] p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm">
					{userName.charAt(0).toUpperCase()}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-[13px] font-medium text-[rgb(var(--slate-700))] truncate">{userName}</p>
				</div>
			</div>
			<form method="POST" action="/logout">
				<button
					type="submit"
					aria-label="Sair do sistema"
					class="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-[rgb(var(--slate-400))] transition-all duration-200 ease-out hover:bg-[rgb(var(--slate-50))] hover:text-[rgb(var(--slate-600))] cursor-pointer"
				>
					<LogOut class="h-4 w-4" />
					<span>Sair</span>
				</button>
			</form>
		</div>
	</div>
</Sheet>
