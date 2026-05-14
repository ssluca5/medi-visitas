<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { apiFetch } from '$lib/api';
	import Toast from '$lib/components/ui/Toast.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import MobileNav from '$lib/components/MobileNav.svelte';

	import { ClerkProvider } from 'svelte-clerk';
	import type { Snippet } from 'svelte';

interface Props {
		data: {
			userId: string | null;
			sessionToken: string | null;
			userName?: string;
			avatarUrl?: string | null;
			plano?: string;
			organizationId?: string;
			trialExpiraEm?: string;
			role?: string;
			status?: string;
			limites?: {
				temRelatorios?: boolean;
				temGestaoEquipe?: boolean;
				temMetas?: boolean;
				temIa?: boolean;
				pacotesIaDisponiveis?: boolean;
			};
		};
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

	onMount(() => {
		if (!data.sessionToken) return;

		async function validarMembroAtivo() {
			if (!page.url.pathname.startsWith('/dashboard')) return;

			try {
				const res = await apiFetch('/me', data.sessionToken);
				if (!res.ok) return;

				const me = await res.json();
				if (!me.organizationId) {
					window.location.href = '/logout?motivo=membro_removido';
				}
			} catch {
				// Mantem a sessao se a rede falhar; a proxima verificacao tenta novamente.
			}
		}

		const interval = window.setInterval(validarMembroAtivo, 5_000);
		validarMembroAtivo();

		return () => window.clearInterval(interval);
	});
</script>

<svelte:head>
	<title>MediVisitas — CRM para Propagandistas</title>
</svelte:head>

<ClerkProvider>
	{#if isDashboard}
		<div class="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-[rgb(var(--slate-50))]">
<MobileNav
				userName={data.userName ?? 'Usuário'}
				avatarUrl={data.avatarUrl}
				sessionToken={data.sessionToken}
				role={data.role}
				temRelatorios={data.limites?.temRelatorios ?? false}
				temGestaoEquipe={data.limites?.temGestaoEquipe ?? false}
				temMetas={data.limites?.temMetas ?? false}
			/>
<Sidebar
				userName={data.userName ?? 'Usuário'}
				avatarUrl={data.avatarUrl}
				sessionToken={data.sessionToken}
				plano={data.plano}
				organizationId={data.organizationId}
				trialExpiraEm={data.trialExpiraEm}
				role={data.role}
				statusOrg={data.status}
				temRelatorios={data.limites?.temRelatorios ?? false}
				temGestaoEquipe={data.limites?.temGestaoEquipe ?? false}
				temMetas={data.limites?.temMetas ?? false}
			/>

			<main class="flex-1 min-w-0 h-full overflow-y-auto">
				<div class="p-4 lg:p-8">
					{@render children()}
				</div>
			</main>
		</div>
	{:else}
		{@render children()}
	{/if}

	<ProgressBar />
	<Toast />
</ClerkProvider>
