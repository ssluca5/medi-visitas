<script lang="ts">
	import { Bell, CheckCheck } from 'lucide-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ItemNotificacao from '$lib/components/notificacoes/ItemNotificacao.svelte';
	import type { Notificacao } from '$lib/types';

	interface Props {
		data: {
			data: Notificacao[];
			total: number;
			naoLidas: number;
			page: number;
			pageSize: number;
			totalPages: number;
			sessionToken: string | null;
		};
	}

	let { data }: Props = $props();

	let page = $state(data.page);
	let filtroLida = $state('');
	let notificacoes = $state<Notificacao[]>(data.data);
	let total = $state(data.total);
	let naoLidas = $state(data.naoLidas);
	let totalPages = $state(data.totalPages);
	let loading = $state(false);

	$effect(() => {
		// Re-carregar quando page ou filtroLida mudam
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		page;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		filtroLida;
		carregar();
	});

	async function carregar() {
		loading = true;
		try {
			const params = new URLSearchParams({
				page: String(page),
				pageSize: '20'
			});
			if (filtroLida) params.set('lida', filtroLida);

			const res = await fetch(
				`${PUBLIC_API_URL}/notificacoes?${params}`,
				{ headers: { Authorization: `Bearer ${data.sessionToken}` } }
			);
			if (res.ok) {
				const body = await res.json();
				notificacoes = body.data;
				total = body.total;
				naoLidas = body.naoLidas;
				totalPages = body.totalPages;
			}
		} finally {
			loading = false;
		}
	}

	async function marcarTodasLidas() {
		await fetch(`${PUBLIC_API_URL}/notificacoes/marcar-todas-lidas`, {
			method: 'PATCH',
			headers: { Authorization: `Bearer ${data.sessionToken}` }
		});
		notificacoes = notificacoes.map((n) => ({ ...n, lida: true }));
		naoLidas = 0;
	}
</script>

<div>
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm"
			>
				<Bell class="h-5 w-5 text-white" />
			</div>
			<div>
				<h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">Notificações</h1>
				<p class="text-sm text-[rgb(var(--slate-500))] mt-0.5">
					{total} notificação{total !== 1 ? 'ões' : ''} · {naoLidas} não lida{naoLidas !== 1
						? 's'
						: ''}
				</p>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<select
				bind:value={filtroLida}
				class="h-9 px-3 text-sm rounded-lg border border-[rgb(var(--slate-200))] bg-white text-[rgb(var(--slate-700))] cursor-pointer"
			>
				<option value="">Todas</option>
				<option value="false">Não lidas</option>
				<option value="true">Lidas</option>
			</select>
			{#if naoLidas > 0}
				<button
					class="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors duration-200"
					style="background-color: rgb(var(--accent)); border-radius: var(--radius);"
					onclick={marcarTodasLidas}
				>
					<CheckCheck class="h-4 w-4" />
					Marcar todas como lidas
				</button>
			{/if}
		</div>
	</div>

	<!-- Lista -->
	<div class="rounded-xl border border-[rgb(var(--slate-200))] overflow-hidden bg-white">
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<p class="text-sm text-[rgb(var(--slate-400))]">Carregando...</p>
			</div>
		{:else if notificacoes.length === 0}
			<div class="flex flex-col items-center justify-center py-12 gap-2">
				<Bell class="w-10 h-10 text-[rgb(var(--slate-200))]" />
				<p class="text-sm text-[rgb(var(--slate-400))]">Nenhuma notificação encontrada</p>
			</div>
		{:else}
			<div class="divide-y divide-[rgb(var(--slate-100))]">
				{#each notificacoes as notif (notif.id)}
					<ItemNotificacao
						{notif}
						sessionToken={data.sessionToken}
						onLida={() => {
							notificacoes = notificacoes.map((n) =>
								n.id === notif.id ? { ...n, lida: true } : n
							);
							naoLidas = Math.max(0, naoLidas - 1);
						}}
						onDeletada={() => {
							notificacoes = notificacoes.filter((n) => n.id !== notif.id);
							total = Math.max(0, total - 1);
						}}
					/>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Paginação -->
	{#if totalPages > 1}
		<div class="flex items-center justify-center gap-3 mt-6">
			<button
				class="px-3 py-1.5 text-sm rounded-lg border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-600))] transition-colors duration-200 hover:bg-[rgb(var(--slate-50))] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
				disabled={page === 1}
				onclick={() => (page = page - 1)}
			>
				← Anterior
			</button>
			<span class="text-sm text-[rgb(var(--slate-500))]">{page} / {totalPages}</span>
			<button
				class="px-3 py-1.5 text-sm rounded-lg border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-600))] transition-colors duration-200 hover:bg-[rgb(var(--slate-50))] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
				disabled={page === totalPages}
				onclick={() => (page = page + 1)}
			>
				Próxima →
			</button>
		</div>
	{/if}
</div>
