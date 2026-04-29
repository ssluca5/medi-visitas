<script lang="ts">
	import { apiFetch } from '$lib/api';
	import { Brain, Sparkles, Loader2, ShoppingCart } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	
	let { sessionToken } = $props<{ sessionToken: string }>();

	let status = $state<{ permitido: boolean, usadas: number, limite: number, extras: number, restantes: number } | null>(null);
	let loading = $state(true);
	let comprando = $state(false);
	
	$effect(() => {
		async function fetchStatus() {
			try {
				const res = await apiFetch('/transcricoes/status', sessionToken);
				if (res.ok) {
					status = await res.json();
				}
			} catch (e) {
				console.error(e);
			} finally {
				loading = false;
			}
		}
		fetchStatus();
	});

	async function comprarPacote() {
		try {
			comprando = true;
			const res = await apiFetch('/transcricoes/comprar-pacote', sessionToken, { method: 'POST' });
			if (res.ok) {
				const data = await res.json();
				if (data.checkoutUrl) {
					window.location.href = data.checkoutUrl;
				}
			} else {
				toast.error('Erro ao iniciar compra.');
			}
		} catch {
			toast.error('Erro de conexão.');
		} finally {
			comprando = false;
		}
	}
</script>

{#if loading}
	<div class="h-full min-h-32 flex items-center justify-center rounded-xl border border-[rgb(var(--slate-100))] bg-white/50 backdrop-blur-sm p-5">
		<Loader2 class="h-6 w-6 text-violet-500 animate-spin" />
	</div>
{:else if status}
	{#if status.limite === 999999}
		<!-- Plano EMPRESA (ilimitado) -->
		<div class="card-surface p-5 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-white relative overflow-hidden h-full">
			<div class="absolute -right-4 -top-4 w-24 h-24 bg-violet-100 rounded-full opacity-50 blur-2xl"></div>
			
			<div class="flex items-center justify-between mb-3 relative z-10">
				<div class="flex items-center gap-2 text-violet-700">
					<Brain class="h-5 w-5" />
					<h3 class="text-sm font-semibold">MediVisitas AI</h3>
				</div>
				<div class="flex items-center gap-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
					<Sparkles class="h-3 w-3" />
					<span>ILIMITADO</span>
				</div>
			</div>
			
			<p class="text-xs text-[rgb(var(--slate-500))] mb-3 relative z-10">
				Seu plano Empresa inclui transcrições e extração de insights por Inteligência Artificial de forma ilimitada.
			</p>
			
			<div class="flex items-baseline gap-1 mt-auto relative z-10">
				<span class="text-2xl font-bold text-violet-700">{status.usadas}</span>
				<span class="text-[11px] text-[rgb(var(--slate-500))] font-medium uppercase tracking-wide">utilizadas no mês</span>
			</div>
		</div>
	{:else}
		<!-- Plano INDIVIDUAL (limitado) -->
		<div class="card-surface p-5 rounded-xl border {status.restantes === 0 ? 'border-red-200 bg-red-50/30' : 'border-violet-100 bg-gradient-to-br from-violet-50/50 to-white'} relative overflow-hidden h-full flex flex-col">
			<div class="flex items-center justify-between mb-3">
				<div class="flex items-center gap-2 {status.restantes === 0 ? 'text-red-700' : 'text-violet-700'}">
					<Brain class="h-5 w-5" />
					<h3 class="text-sm font-semibold">MediVisitas AI</h3>
				</div>
			</div>
			
			<div class="mb-4">
				<div class="flex justify-between items-end mb-1.5">
					<span class="text-[11px] font-medium text-[rgb(var(--slate-500))] uppercase tracking-wide">Transcrições</span>
					<div class="text-right">
						<span class="text-lg font-bold {status.restantes === 0 ? 'text-red-600' : 'text-[rgb(var(--slate-800))]'}">{status.restantes}</span>
						<span class="text-xs text-[rgb(var(--slate-400))]">/{status.limite} restam</span>
					</div>
				</div>
				
				<div class="h-2 w-full bg-[rgb(var(--slate-100))] rounded-full overflow-hidden">
					<div 
						class="h-full rounded-full transition-all duration-500 {status.restantes === 0 ? 'bg-red-500' : status.restantes <= 5 ? 'bg-amber-500' : 'bg-violet-500'}"
						style="width: {Math.min(100, (status.usadas / status.limite) * 100)}%"
					></div>
				</div>
			</div>
			
			<button 
				onclick={comprarPacote}
				disabled={comprando}
				class="mt-auto w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[rgb(var(--slate-200))] bg-white hover:bg-[rgb(var(--slate-50))] hover:border-violet-300 text-sm font-medium text-[rgb(var(--slate-700))] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
			>
				{#if comprando}
					<Loader2 class="h-4 w-4 animate-spin text-violet-600" />
					<span>Processando...</span>
				{:else}
					<ShoppingCart class="h-4 w-4 text-violet-600" />
					<span>Pacote Extra (+20)</span>
				{/if}
			</button>
		</div>
	{/if}
{/if}
