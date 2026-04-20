<script lang="ts">
	import { Bell } from 'lucide-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { Notificacao } from '$lib/types';
	import ItemNotificacao from './ItemNotificacao.svelte';

	interface Props {
		sessionToken: string | null;
		onFechar: () => void;
		onContagemAtualizada: (n: number) => void;
	}

	let { sessionToken, onFechar, onContagemAtualizada }: Props = $props();

	let notificacoes = $state<Notificacao[]>([]);
	let loading = $state(true);

	let naoLidasCount = $derived(notificacoes.filter((n) => !n.lida).length);

	$effect(() => {
		onContagemAtualizada(naoLidasCount);
	});

	$effect(() => {
		carregarNotificacoes();
	});

	async function carregarNotificacoes() {
		loading = true;
		try {
			const res = await fetch(
				`${PUBLIC_API_URL}/notificacoes?pageSize=10`,
				{ headers: { Authorization: `Bearer ${sessionToken}` } }
			);
			if (res.ok) {
				const body = await res.json();
				notificacoes = body.data;
			}
		} finally {
			loading = false;
		}
	}

	async function marcarTodasLidas() {
		await fetch(`${PUBLIC_API_URL}/notificacoes/marcar-todas-lidas`, {
			method: 'PATCH',
			headers: { Authorization: `Bearer ${sessionToken}` }
		});
		notificacoes = notificacoes.map((n) => ({ ...n, lida: true }));
	}
</script>

<!-- Header -->
<div class="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--slate-200))]">
	<p class="text-sm font-semibold text-[rgb(var(--slate-900))]">
		Notificações
		{#if naoLidasCount > 0}
			<span
				class="ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium text-white"
				style="background-color: rgb(var(--accent));"
				aria-label="{naoLidasCount} não lidas">{naoLidasCount}</span
			>
		{/if}
	</p>
	{#if naoLidasCount > 0}
		<button
			class="text-xs font-medium transition-colors duration-200 cursor-pointer"
			style="color: rgb(var(--accent));"
			onclick={marcarTodasLidas}
			aria-label="Marcar todas as notificações como lidas"
		>
			Marcar todas como lidas
		</button>
	{/if}
</div>

<!-- Lista -->
<div role="list" aria-label="Lista de notificações" class="max-h-96 overflow-y-auto divide-y divide-[rgb(var(--slate-100))]">
	{#if loading}
		<div class="flex items-center justify-center py-8" aria-live="polite">
			<p class="text-sm text-[rgb(var(--slate-400))]">Carregando...</p>
		</div>
	{:else if notificacoes.length === 0}
		<div class="flex flex-col items-center justify-center py-8 gap-2">
			<Bell class="w-8 h-8 text-[rgb(var(--slate-200))]" />
			<p class="text-sm text-[rgb(var(--slate-400))]">Nenhuma notificação</p>
		</div>
	{:else}
		{#each notificacoes as notif (notif.id)}
			<ItemNotificacao
				{notif}
				{sessionToken}
				onLida={() => {
					notificacoes = notificacoes.map((n) =>
						n.id === notif.id ? { ...n, lida: true } : n
					);
				}}
				onDeletada={() => {
					notificacoes = notificacoes.filter((n) => n.id !== notif.id);
				}}
			/>
		{/each}
	{/if}
</div>

<!-- Footer -->
<div class="border-t border-[rgb(var(--slate-200))] px-4 py-2.5">
	<a
		href="/dashboard/notificacoes"
		class="text-xs font-medium block text-center transition-colors duration-200"
		style="color: rgb(var(--accent));"
		onclick={onFechar}
	>
		Ver histórico completo →
	</a>
</div>
