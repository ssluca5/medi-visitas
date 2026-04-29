<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { apiFetch } from '$lib/api';
	import { Users, Calendar, BarChart3, Stethoscope, Sparkles, ArrowRight, X, Check } from 'lucide-svelte';

	interface Props {
		sessionToken: string | null;
		onclose?: () => void;
	}

	let { sessionToken, onclose }: Props = $props();

	let currentStep = $state(0);
	let visible = $state(true);

	const steps = [
		{
			icon: Sparkles,
			title: 'Bem-vindo ao MediVisitas!',
			desc: 'Vamos conhecer as principais funcionalidades em alguns passos rápidos.',
			color: '#2563eb',
			destaque: 'data-tour-dashboard',
		},
		{
			icon: Users,
			title: 'Gerencie Profissionais',
			desc: 'Cadastre médicos e profissionais de saúde. Acompanhe potencial de prescrição.',
			color: '#059669',
			destaque: 'data-tour-profissionais',
		},
		{
			icon: Calendar,
			title: 'Agenda Inteligente',
			desc: 'Planeje visitas com calendário interativo. Arraste e solte para reagendar.',
			color: '#7c3aed',
			destaque: 'data-tour-agenda',
		},
		{
			icon: BarChart3,
			title: 'Pipeline Comercial',
			desc: 'Visualize o funil de vendas e acompanhe a evolução no pipeline.',
			color: '#ea580c',
			destaque: 'data-tour-pipeline',
		},
		{
			icon: Stethoscope,
			title: 'Especialidades & Materiais',
			desc: 'Organize especialidades médicas e materiais técnicos para cada visita.',
			color: '#0891b2',
			destaque: 'data-tour-especialidades',
		},
	];

	let totalSteps = steps.length;
	let StepIcon = $derived(steps[currentStep].icon);

	function destacarElemento(attr: string) {
		// Remover destaque anterior
		document.querySelectorAll('[data-tour-highlighted]').forEach(el => {
			el.removeAttribute('data-tour-highlighted');
		});
		// Destacar novo elemento
		const el = document.querySelector(`[${attr}]`);
		if (el) {
			el.setAttribute('data-tour-highlighted', '');
			el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}

	$effect(() => {
		if (visible && steps[currentStep]?.destaque) {
			// Pequeno delay para garantir que o DOM está pronto
			setTimeout(() => destacarElemento(steps[currentStep].destaque), 100);
		}
		return () => {
			document.querySelectorAll('[data-tour-highlighted]').forEach(el => {
				el.removeAttribute('data-tour-highlighted');
			});
		};
	});

	function nextStep() {
		if (currentStep < totalSteps - 1) {
			currentStep++;
		} else {
			concluirTour();
		}
	}

	function prevStep() {
		if (currentStep > 0) currentStep--;
	}

	async function concluirTour() {
		visible = false;
		document.querySelectorAll('[data-tour-highlighted]').forEach(el => {
			el.removeAttribute('data-tour-highlighted');
		});
		try {
			await apiFetch('/me/tour', sessionToken, { method: 'PATCH' });
		} catch (e) {
			console.error('Erro ao salvar tour:', e);
		}
		onclose?.();
	}

	function pular() {
		concluirTour();
	}
</script>

{#if visible}
	<!-- Overlay escuro de fundo -->
	<div
		class="fixed inset-0 z-[9988] pointer-events-none"
		style="background: rgba(0,0,0,0.55); transition: opacity 300ms;"
		transition:fade={{ duration: 300 }}
	></div>

	<!-- Card fixo no canto inferior direito -->
	<div
		class="fixed z-[9991]"
		style="bottom: 24px; right: 24px;"
		transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
	>
		{#key currentStep}
			<div
				class="w-80 rounded-2xl bg-white shadow-2xl border border-[rgb(var(--slate-200))] overflow-hidden"
				in:fly={{ y: 10, duration: 250, easing: cubicOut }}
			>
				<!-- Header colorido -->
				<div class="relative px-6 pt-6 pb-5 text-center" style="background-color: {steps[currentStep].color};">
					<!-- Botão fechar -->
					<button
						onclick={pular}
						class="absolute top-3 right-3 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
						title="Pular tour"
					>
						<X class="w-4 h-4" />
					</button>

					<!-- Ícone -->
					<div class="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3"
						style="background-color: rgba(255,255,255,0.15);">
						<StepIcon class="w-6 h-6 text-white" />
					</div>

					<h2 class="text-sm font-bold text-white">{steps[currentStep].title}</h2>
				</div>

				<!-- Corpo -->
				<div class="px-6 py-4">
					<p class="text-xs text-center leading-relaxed text-[rgb(var(--slate-500))]">
						{steps[currentStep].desc}
					</p>
				</div>

				<!-- Footer -->
				<div class="px-6 pb-5 flex items-center justify-between">
					<!-- Indicadores -->
					<div class="flex gap-1.5">
						{#each steps as _, i}
							<div
								class="h-1.5 rounded-full transition-all duration-300"
								style="width: {i === currentStep ? '16px' : '6px'}; background-color: {i === currentStep ? steps[currentStep].color : '#e5e7eb'};"
							></div>
						{/each}
					</div>

					<!-- Botões -->
					<div class="flex items-center gap-1.5">
						{#if currentStep > 0}
							<button
								onclick={prevStep}
								class="px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer hover:bg-gray-50"
								style="color: #6b7280; border-color: #e5e7eb;"
							>
								Anterior
							</button>
						{:else}
							<button
								onclick={pular}
								class="px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer hover:bg-gray-50"
								style="color: #9ca3af;"
							>
								Pular
							</button>
						{/if}

						<button
							onclick={nextStep}
							class="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-lg text-white transition-all duration-200 cursor-pointer hover:-translate-y-[1px] hover:shadow-md"
							style="background-color: {steps[currentStep].color};"
						>
							{#if currentStep === totalSteps - 1}
								<Check class="w-3 h-3" />
								Começar
							{:else}
								Próximo
								<ArrowRight class="w-3 h-3" />
							{/if}
						</button>
					</div>
				</div>
			</div>
		{/key}
	</div>
{/if}

<style>
	:global([data-tour-highlighted]) {
		outline: 3px solid #2563eb !important;
		outline-offset: 6px !important;
		border-radius: 8px !important;
		box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55) !important;
		position: relative !important;
		z-index: 9990 !important;
		transition: outline 0.3s ease, box-shadow 0.3s ease;
	}
</style>
