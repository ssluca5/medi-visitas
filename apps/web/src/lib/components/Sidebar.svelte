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
		Package
	} from 'lucide-svelte';
	import type { NavItem } from '$lib/types';
	import BuscaGlobal from '$lib/components/dashboard/BuscaGlobal.svelte';

	interface Props {
		userName: string;
		sessionToken?: string | null;
	}

	let { userName, sessionToken }: Props = $props();

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

	function navClass(active: boolean): string {
		return active
			? 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] font-medium bg-slate-100/80 text-slate-900 transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]'
			: 'group flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-[background-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]';
	}

	function iconClass(active: boolean): string {
		return active
			? 'h-[18px] w-[18px] text-blue-600 transition-colors duration-200'
			: 'h-[18px] w-[18px] text-slate-400 group-hover:text-slate-600 transition-colors duration-200';
	}
</script>

<aside
	class="hidden w-64 flex-col border-r border-slate-200 lg:flex bg-white"
>
	<!-- Brand -->
	<div class="px-5 pt-5 pb-4">
		<h1 class="text-lg font-semibold tracking-tight text-slate-900">MediVisitas</h1>
		<p class="text-xs text-slate-400 mt-0.5">CRM para Propagandistas</p>
	</div>

	<!-- Busca -->
	<div class="px-3 pb-3">
		<BuscaGlobal sessionToken={sessionToken ?? null} />
	</div>

	<!-- Navigation -->
	<nav class="flex-1 px-3 space-y-0.5">
		{#each navItems as item}
			{@const active = isActive(item.href)}
			{@const Icon = item.icon}
			<a href={item.href} class={navClass(active)}>
				<Icon class={iconClass(active)} />
				<span>{item.label}</span>
			</a>
		{/each}

		<!-- Section Divider -->
		<div class="pt-5 pb-1">
			<div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
				Cadastros
			</div>
		</div>

		{#each cadAuxItems as item}
			{@const active = isActive(item.href)}
			{@const Icon = item.icon}
			<a href={item.href} class={navClass(active)}>
				<Icon class={iconClass(active)} />
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>

	<!-- User footer -->
	<div class="border-t border-slate-100 px-3 py-3">
		<div class="flex items-center gap-3 px-3 py-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white shadow-sm">
				{userName.charAt(0).toUpperCase()}
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-[13px] font-medium text-slate-700 truncate">{userName}</p>
			</div>
		</div>
		<form method="POST" action="/logout">
			<button
				type="submit"
				class="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-slate-400 transition-all duration-200 ease-out hover:bg-slate-50 hover:text-slate-600 hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] cursor-pointer"
			>
				<LogOut class="h-4 w-4" />
				Sair
			</button>
		</form>
	</div>
</aside>
