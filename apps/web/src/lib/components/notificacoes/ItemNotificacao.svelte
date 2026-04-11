<script lang="ts">
	import { Bell, AlertTriangle, AlertCircle, Info, X } from 'lucide-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { Notificacao, PrioridadeNotificacao } from '$lib/types';

	interface Props {
		notif: Notificacao;
		sessionToken: string | null;
		onLida: () => void;
		onDeletada: () => void;
	}

	let { notif, sessionToken, onLida, onDeletada }: Props = $props();

	const iconeMap: Record<PrioridadeNotificacao, typeof Bell> = {
		INFO: Info,
		NORMAL: Bell,
		ALTA: AlertTriangle,
		URGENTE: AlertCircle
	};

	const corMap: Record<PrioridadeNotificacao, string> = {
		INFO: '#3b82f6',
		NORMAL: '#f59e0b',
		ALTA: '#ef4444',
		URGENTE: '#dc2626'
	};

	let Icon = $derived(iconeMap[notif.prioridade]);
	let cor = $derived(corMap[notif.prioridade]);

	function formatarTempoRelativo(dataIso: string): string {
		const agora = Date.now();
		const data = new Date(dataIso).getTime();
		const diffMs = agora - data;
		const diffMin = Math.floor(diffMs / 60000);
		const diffHora = Math.floor(diffMs / 3600000);
		const diffDia = Math.floor(diffMs / 86400000);

		if (diffMin < 1) return 'agora';
		if (diffMin < 60) return `há ${diffMin}min`;
		if (diffHora < 24) return `há ${diffHora}h`;
		return `há ${diffDia}d`;
	}

	async function marcarLida() {
		if (notif.lida) return;
		await fetch(`${PUBLIC_API_URL}/notificacoes/${notif.id}/lida`, {
			method: 'PATCH',
			headers: { Authorization: `Bearer ${sessionToken}` }
		});
		onLida();
	}

	async function deletar(e: MouseEvent) {
		e.stopPropagation();
		await fetch(`${PUBLIC_API_URL}/notificacoes/${notif.id}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${sessionToken}` }
		});
		onDeletada();
	}
</script>

<div
	class="flex items-start gap-3 px-4 py-3 transition-colors duration-200 cursor-default {notif.lida
		? ''
		: 'bg-blue-50/40'} hover:bg-gray-50 group"
	onclick={marcarLida}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && marcarLida()}
>
	<!-- Ícone com ponto de não lida -->
	<div class="relative flex-shrink-0 mt-0.5">
		<Icon class="w-4 h-4" style="color: {cor};" />
		{#if !notif.lida}
			<span
				class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
				style="background-color: #2563eb;"
			></span>
		{/if}
	</div>

	<!-- Conteúdo -->
	<div class="flex-1 min-w-0">
		<p
			class="text-xs {notif.lida ? 'text-slate-500' : 'font-semibold text-slate-900'}"
		>
			{notif.titulo}
		</p>
		<p class="text-xs mt-0.5 truncate text-slate-400">
			{notif.mensagem}
		</p>
		<p class="text-[10px] mt-1 text-slate-300">
			{formatarTempoRelativo(notif.createdAt)}
		</p>
	</div>

	<!-- Botão deletar -->
	<button
		class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 hover:bg-gray-200 cursor-pointer"
		onclick={deletar}
		aria-label="Remover notificação"
	>
		<X class="w-3 h-3 text-slate-400" />
	</button>
</div>
