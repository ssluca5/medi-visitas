<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import MobileNav from '$lib/components/MobileNav.svelte';
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
</svelte:head>

{#if isDashboard}
	<div class="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-[rgb(var(--slate-50))]">
		<MobileNav userName={data.userName ?? 'Usuário'} sessionToken={data.sessionToken} />
		<Sidebar userName={data.userName ?? 'Usuário'} sessionToken={data.sessionToken} />

		<main class="flex-1 min-w-0 h-full overflow-y-auto">
			<div class="p-4 lg:p-8">
				{@render children()}
			</div>
		</main>
	</div>
{:else}
	{@render children()}
{/if}

<Toast />
