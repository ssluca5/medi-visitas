<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { apiFetch } from '$lib/api';
	import { Users, Calendar, BarChart3, Stethoscope, Package, ArrowRight, X, Check } from 'lucide-svelte';

	interface Props {
		sessionToken: string | null;
		onclose?: () => void;
	}

	let { sessionToken, onclose }: Props = $props();

	let currentStep = $state(0);
	let visible = $state(true);

	// Retângulo de recorte (spotlight) calculado a partir do elemento alvo
	let cutout = $state<{ x: number; y: number; w: number; h: number } | null>(null);

	// Estilo de posição do card
	let cardStyle = $state('bottom: 24px; right: 24px;');

	const steps = [
		{
			icon: null,
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
			title: 'Especialidades',
			desc: 'Cadastre e organize as especialidades médicas dos profissionais da sua carteira.',
			color: '#0891b2',
			destaque: 'data-tour-especialidades',
		},
		{
			icon: Package,
			title: 'Materiais e Amostras',
			desc: 'Gerencie materiais promocionais e amostras grátis para cada visita.',
			color: '#8b5cf6',
			destaque: 'data-tour-materiais',
		},
	];

	let totalSteps = steps.length;
	let StepIcon = $derived(steps[currentStep].icon);

	function atualizarPosicoes(attr: string) {
		const el = document.querySelector(`[${attr}]`);
		if (!el) {
			cutout = null;
			cardStyle = 'bottom: 24px; right: 24px;';
			return;
		}

		el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

		const rect = el.getBoundingClientRect();
		const padding = 8;

		// Recorte (spotlight) com padding
		cutout = {
			x: rect.left - padding,
			y: rect.top - padding,
			w: rect.width + padding * 2,
			h: rect.height + padding * 2,
		};

		// Posicionar card à direita do elemento
		const cardWidth = 320;
		const cardHeight = 260;
		const gap = 20;

		let left = rect.right + gap;
		let top = rect.top + rect.height / 2 - cardHeight / 2;

		// Se não couber à direita, colocar embaixo
		if (left + cardWidth > window.innerWidth - 24) {
			left = Math.max(24, rect.left);
			top = rect.bottom + gap;
		}

		// Limitar aos bounds da viewport
		top = Math.max(16, Math.min(top, window.innerHeight - cardHeight - 16));
		left = Math.max(16, left);

		cardStyle = `top: ${top}px; left: ${left}px;`;
	}

	$effect(() => {
		if (!visible) return;

		if (currentStep === 0) {
			// Passo 0 (boas-vindas): sem spotlight, card no canto inferior direito
			cutout = null;
			cardStyle = 'bottom: 24px; right: 24px;';
		} else {
			const step = steps[currentStep];
			if (step?.destaque) {
				setTimeout(() => atualizarPosicoes(step.destaque), 120);
			}
		}

		return () => {
			cutout = null;
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
		cutout = null;
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
	<!-- Overlay SVG com recorte (spotlight) — bloqueia TODOS os cliques -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[9988]"
		transition:fade={{ duration: 300 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => { if (e.key === 'Escape') pular(); }}
		role="presentation"
	>
		<svg
			width="100%"
			height="100%"
			xmlns="http://www.w3.org/2000/svg"
			class="block"
		>
			<defs>
				<mask id="tour-mask">
					<!-- Branco = overlay visível (escuro) -->
					<rect width="100%" height="100%" fill="white" />
					<!-- Preto = recorte transparente (spotlight) -->
					{#if cutout}
						<rect
							x={cutout.x}
							y={cutout.y}
							width={cutout.w}
							height={cutout.h}
							rx="10"
							fill="black"
						/>
					{/if}
				</mask>
			</defs>

			<!-- Fundo escuro com recorte -->
			<rect
				width="100%"
				height="100%"
				fill="rgba(0,0,0,0.5)"
				mask="url(#tour-mask)"
			/>

			<!-- Anel brilhante ao redor do recorte -->
			{#if cutout}
				<rect
					x={cutout.x}
					y={cutout.y}
					width={cutout.w}
					height={cutout.h}
					rx="10"
					fill="none"
					stroke={steps[currentStep].color}
					stroke-width="2.5"
					class="tour-ring"
				/>
			{/if}
		</svg>
	</div>

	<!-- Card do tour — acima do overlay, interativo -->
	<div
		class="fixed z-[9991]"
		style={cardStyle}
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
						{#if StepIcon}
							<StepIcon class="w-6 h-6 text-white" />
						{:else}
							<!-- Favicon MediVisitas -->
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-7 h-7">
								<rect width="32" height="32" rx="6" fill="rgba(255,255,255,0.2)"/>
								<text x="16" y="23" font-family="Inter,sans-serif" font-weight="700" font-size="20" fill="white" text-anchor="middle">M</text>
							</svg>
						{/if}
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
						{#each steps as step, i}
							<div
								class="h-1.5 rounded-full transition-all duration-300"
								title={step.title}
								style="width: {i === currentStep ? '16px' : '6px'}; background-color: {i === currentStep ? steps[currentStep].color : '#e5e7eb'};"
							></div>
						{/each}
					</div>

					<!-- Botões -->
					<div class="flex items-center gap-1.5">
						{#if currentStep > 0}
							<button
								onclick={prevStep}
								class="px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-500))] transition-colors cursor-pointer hover:bg-gray-50"
							>
								Anterior
							</button>
						{:else}
							<button
								onclick={pular}
								class="px-2.5 py-1.5 text-[11px] font-medium rounded-lg text-[rgb(var(--slate-400))] transition-colors cursor-pointer hover:bg-gray-50"
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
	.tour-ring {
		animation: tour-pulse 2s ease-in-out infinite;
	}

	@keyframes tour-pulse {
		0%, 100% {
			stroke-opacity: 1;
		}
		50% {
			stroke-opacity: 0.5;
		}
	}
</style>
