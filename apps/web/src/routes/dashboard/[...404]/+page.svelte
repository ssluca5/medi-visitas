<script lang="ts">
	import { MapPin } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>Página não encontrada — MediVisitas</title>
</svelte:head>

<div class="flex flex-col items-center justify-center py-24 px-6 text-center">
	<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--slate-100))] mb-5">
		<MapPin class="h-7 w-7 text-[rgb(var(--slate-400))]" />
	</div>
	<h1 class="page-title mb-2">Página não encontrada</h1>
	<p class="text-sm text-[rgb(var(--slate-400))] max-w-sm mb-6">
		A rota que você acessou não existe no dashboard. Verifique o endereço ou volte para a tela inicial.
	</p>
	<Button onclick={() => window.location.href = '/dashboard'}>
		Voltar ao Dashboard
	</Button>
</div>
