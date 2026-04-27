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

	interface Props {
		userName: string;
		sessionToken: string | null;
		plano?: string;
		organizationId?: string;
		trialExpiraEm?: string;
	}

	let { userName, sessionToken, plano, organizationId, trialExpiraEm }: Props = $props();

	let diasRestantes = $derived.by(() => {
		if (!trialExpiraEm || plano !== "TRIAL") return null;
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
			} catch {}
		}
	});

	// Persist to localStorage
	$effect(() => {
		localStorage.setItem('sidebar-state', JSON.stringify({ collapsed }));
	});

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

	function toggleCollapse() {
		collapsed = !collapsed;
	}
</script>

<aside
	aria-label="Navegação principal"
	class="hidden flex-shrink-0 flex-col h-full bg-white border-r border-[rgb(var(--slate-200))] relative transition-[width] duration-300 ease-in-out lg:flex overflow-visible"
	class:w-64={!collapsed}
	class:w-16={collapsed}
>
	<!-- Header with toggle -->
	<div class="shrink-0 flex items-center justify-between px-5 pt-5 pb-4">
		{#if !collapsed}
			<div class="flex-1 min-w-0">
				<h1 class="text-lg font-semibold tracking-tight text-[rgb(var(--slate-900))]">MediVisitas</h1>
				<p class="text-xs text-[rgb(var(--slate-400))] mt-0.5">CRM para Propagandistas</p>
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

		<!-- Section Divider -->
		{#if !collapsed}
			<div class="pt-5 pb-1">
				<div class="px-3 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--slate-400))]">
					Cadastros
				</div>
			</div>
		{:else}
			<div class="pt-3 pb-1 flex justify-center">
				<div class="w-6 h-px bg-[rgb(var(--slate-200))]"></div>
			</div>
		{/if}

		{#each cadAuxItems as item}
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
	</nav>

	<!-- Plan badge -->
	{#if plano && !collapsed}
		<div class="px-3 py-2 mb-1">
			<span
				class="text-xs px-2 py-0.5 rounded-full font-medium {plano === 'TRIAL' || plano === 'INDIVIDUAL'
					? 'bg-amber-100 text-amber-800'
					: 'bg-emerald-100 text-emerald-800'}"
			>
				{plano === 'INDIVIDUAL' ? 'Individual' : plano === 'TRIAL' ? 'Trial' : plano === 'EMPRESA' ? 'Empresa' : plano}
			</span>
		</div>
	{/if}

	<!-- Trial expiry banner -->
	{#if diasRestantes !== null && diasRestantes <= 2 && !collapsed}
		<div class="mx-3 mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
			<p class="text-xs font-medium text-amber-800">
				{#if diasRestantes === 0}
					Trial expira hoje
				{:else if diasRestantes === 1}
					Trial expira amanhã
				{:else}
					Trial expira em {diasRestantes} dias
				{/if}
			</p>
			<a href="/planos" class="mt-1 block text-xs text-amber-600 underline hover:text-amber-700">
				Assinar agora
			</a>
		</div>
	{/if}

	<!-- User footer (anchored to bottom) -->
	<div class="mt-auto shrink-0 border-t border-[rgb(var(--slate-200))] bg-white p-4">
		<div
			class="flex items-center w-full gap-3 px-1 py-2 transition-all duration-300"
			class:flex-col={collapsed}
			class:gap-2={collapsed}
			class:items-center={collapsed}
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm">
				{userName.charAt(0).toUpperCase()}
			</div>
			{#if !collapsed}
				<div class="flex-1 min-w-0">
					<p class="text-[13px] font-medium text-[rgb(var(--slate-700))] truncate">{userName}</p>
				</div>
			{/if}
			<div class="relative z-10">
				<SinoNotificacoes {sessionToken} />
			</div>
		</div>
		<form method="POST" action="/logout">
			<button
				type="submit"
				aria-label="Sair do sistema"
				class="mt-1 flex w-full items-center justify-center gap-3 rounded-lg px-3 py-1.5 text-[13px] text-[rgb(var(--slate-400))] will-change-transform transition-all duration-200 ease-out hover:bg-[rgb(var(--slate-50))] hover:text-[rgb(var(--slate-600))] hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] cursor-pointer"
			>
				<LogOut class="h-4 w-4" />
				{#if !collapsed}
					<span>Sair</span>
				{/if}
			</button>
		</form>
	</div>
</aside>
