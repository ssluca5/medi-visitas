<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		data: { userId: string | null; sessionToken: string | null; userName?: string };
		children: Snippet;
	}

	let { data, children }: Props = $props();

	// ── View Transitions API — silky SPA navigation ──
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let isDashboard = $derived(page.url.pathname.startsWith('/dashboard'));
</script>

<svelte:head>
	<title>MediVisitas — CRM para Propagandistas</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

{#if isDashboard}
	<div class="flex min-h-screen bg-slate-50/80">
		<Sidebar userName={data.userName ?? 'Usuário'} />

		<main class="flex-1 overflow-y-auto">
			<div class="px-5 py-5 lg:px-6">
				{#key page.url.pathname}
					<div in:fade={{ duration: 180, delay: 80 }} out:fade={{ duration: 80 }}>
						{@render children()}
					</div>
				{/key}
			</div>
		</main>
	</div>
{:else}
	{#key page.url.pathname}
		<div in:fade={{ duration: 180, delay: 80 }} out:fade={{ duration: 80 }}>
			{@render children()}
		</div>
	{/key}
{/if}

<Toast />
