<script lang="ts">
	import { page } from '$app/state';
	import { Home, RotateCcw, AlertTriangle, ShieldX, FileQuestion } from 'lucide-svelte';

	const statusConfig: Record<number, { icon: typeof AlertTriangle; title: string; desc: string; emoji: string }> = {
		404: {
			icon: FileQuestion,
			title: 'Página não encontrada',
			desc: 'A página que você está procurando não existe ou foi movida.',
			emoji: '🔍'
		},
		403: {
			icon: ShieldX,
			title: 'Acesso negado',
			desc: 'Você não tem permissão para acessar este recurso.',
			emoji: '🔒'
		},
		500: {
			icon: AlertTriangle,
			title: 'Erro interno',
			desc: 'Algo deu errado no servidor. Tente novamente em instantes.',
			emoji: '⚠️'
		}
	};

	const status = $derived(page.status);
	const config = $derived(statusConfig[status] || statusConfig[500]);
</script>

<svelte:head>
	<title>Erro {status} — MediVisitas</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-8" style="background-color: var(--bg-primary);">
	<div class="text-center max-w-md">
		<!-- Ícone -->
		<div class="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
			style="background-color: var(--bg-surface); border: 1px solid var(--border-base);">
			{config.emoji}
		</div>

		<!-- Código -->
		<p class="text-6xl font-bold mb-2" style="color: var(--border-base);">{status}</p>

		<!-- Título -->
		<h1 class="page-title-marker text-xl font-semibold mb-2" style="color: var(--text-primary);">{config.title}</h1>

		<!-- Descrição -->
		<p class="text-sm mb-8" style="color: var(--text-muted);">
			{config.desc}
		</p>

		<!-- Ações -->
		<div class="flex items-center justify-center gap-3">
			<a
				href="/dashboard"
				class="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-white
					transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
				style="background-color: var(--brand-primary);"
			>
				<Home class="w-4 h-4" />
				Ir para o dashboard
			</a>
			<button
				onclick={() => window.location.reload()}
				class="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium
					border transition-all duration-200 hover:bg-gray-50 cursor-pointer"
				style="color: var(--text-secondary); border-color: var(--border-base);"
			>
				<RotateCcw class="w-4 h-4" />
				Tentar novamente
			</button>
		</div>
	</div>
</div>
