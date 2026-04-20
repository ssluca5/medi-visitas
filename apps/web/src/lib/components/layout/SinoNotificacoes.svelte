<script lang="ts">
	import { Bell } from 'lucide-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import PainelNotificacoes from '$lib/components/notificacoes/PainelNotificacoes.svelte';

	interface Props {
		sessionToken: string | null;
	}

	let { sessionToken }: Props = $props();

	let naoLidas = $state(0);
	let painelAberto = $state(false);

	// Polling leve a cada 60s para atualizar badge
	$effect(() => {
		carregarContagem();
		const intervalo = setInterval(carregarContagem, 60_000);
		return () => clearInterval(intervalo);
	});

	async function carregarContagem() {
		const res = await fetch(
			`${PUBLIC_API_URL}/notificacoes/contagem`,
			{ headers: { Authorization: `Bearer ${sessionToken}` } }
		);
		if (res.ok) {
			const data = await res.json();
			naoLidas = data.naoLidas;
		}
	}
</script>

<div class="relative">
	<button
		class="relative p-2 text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-100))] rounded-full transition-colors cursor-pointer"
		onclick={() => (painelAberto = !painelAberto)}
		aria-label="Notificações"
		aria-expanded={painelAberto}
		aria-haspopup="true"
	>
		<Bell class="w-5 h-5" />

		{#if naoLidas > 0}
			<span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" aria-label="{naoLidas} notificações não lidas" role="status"></span>
		{/if}
	</button>

	{#if painelAberto}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-40"
			onclick={() => (painelAberto = false)}
			transition:fade={{ duration: 150 }}
		></div>
		<div
			class="absolute bottom-0 left-full ml-4 z-[100] w-80 rounded-xl border border-[rgb(var(--slate-100))] shadow-2xl overflow-hidden bg-white"
			transition:fly={{ x: -8, duration: 200, easing: cubicOut }}
		>
			<PainelNotificacoes
				{sessionToken}
				onFechar={() => (painelAberto = false)}
				onContagemAtualizada={(n) => (naoLidas = n)}
			/>
		</div>
	{/if}
</div>
