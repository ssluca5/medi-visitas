<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { AlertTriangle, Trash2 } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Variant = 'danger' | 'warning' | 'info';

	interface Props {
		open: boolean;
		onclose: () => void;
		title: string;
		description?: Snippet;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: Variant;
		onconfirm: () => void;
		loading?: boolean;
		isBlockingDialog?: boolean;
	}

	let {
		open,
		onclose,
		title,
		description,
		confirmLabel = 'Excluir',
		cancelLabel = 'Cancelar',
		variant = 'danger',
		onconfirm,
		loading = false,
		isBlockingDialog = false
	}: Props = $props();

	const iconBgMap: Record<Variant, string> = {
		danger: 'bg-red-50',
		warning: 'bg-amber-50',
		info: 'bg-blue-50'
	};

	const iconColorMap: Record<Variant, string> = {
		danger: 'text-red-600',
		warning: 'text-amber-600',
		info: 'text-blue-600'
	};

	const confirmBtnMap: Record<Variant, string> = {
		danger: 'bg-red-600 hover:bg-red-700',
		warning: 'bg-amber-600 hover:bg-amber-700',
		info: 'bg-blue-600 hover:bg-blue-700'
	};
</script>

{#if open}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center"
		transition:fade={{ duration: 200 }}
	>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/30"
			onclick={onclose}
			role="presentation"
		></div>

		<!-- Dialog Card -->
		<div
			class="relative z-10 w-full max-w-md mx-4 rounded-2xl shadow-2xl bg-white border border-[rgb(var(--slate-200))]/80"
			transition:scale={{ start: 0.95, duration: 200, easing: cubicOut }}
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
		>
			<div class="p-7">
				<!-- Header: Icon + Text -->
				<div class="flex items-start gap-4">
					<div
						class="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl {iconBgMap[variant]}"
					>
						{#if variant === 'warning'}
							<AlertTriangle class="w-5 h-5 {iconColorMap[variant]}" />
						{:else}
							<Trash2 class="w-5 h-5 {iconColorMap[variant]}" />
						{/if}
					</div>
					<div class="flex-1 pt-0.5">
						<h3 id="confirm-dialog-title" class="text-lg font-semibold text-[rgb(var(--slate-900))]">{title}</h3>
						{#if description}
							<div
								class="text-sm text-[rgb(var(--slate-600))] mt-2 leading-relaxed
									[&>strong]:text-[rgb(var(--slate-700))] [&>strong]:font-medium
									[&>p+p]:mt-3"
							>
								{@render description()}
							</div>
						{/if}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex justify-end gap-3 mt-8">
					{#if isBlockingDialog}
						<button
							onclick={onclose}
							disabled={loading}
							class="px-4 py-2 rounded-lg text-sm font-medium
								bg-white border border-[rgb(var(--slate-300))] text-[rgb(var(--slate-700))]
								will-change-transform hover:bg-[rgb(var(--slate-50))] hover:-translate-y-[1px]
								active:scale-[0.98] transition-all duration-200
								cursor-pointer disabled:opacity-50 shadow-sm"
						>
							{loading ? 'Aguarde...' : 'Entendi'}
						</button>
					{:else}
						<button
							onclick={onclose}
							disabled={loading}
							aria-label={cancelLabel}
							class="px-4 py-2 rounded-lg text-sm font-medium
								bg-white border border-[rgb(var(--slate-300))] text-[rgb(var(--slate-700))]
								will-change-transform hover:bg-[rgb(var(--slate-50))] hover:-translate-y-[1px]
								active:scale-[0.98] transition-all duration-200
								cursor-pointer disabled:opacity-50"
						>
							{cancelLabel}
						</button>
						<button
							onclick={onconfirm}
							disabled={loading}
							aria-label={confirmLabel}
							class="px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm
								will-change-transform hover:-translate-y-[1px] active:scale-[0.98]
								transition-all duration-200 cursor-pointer
								disabled:opacity-50 {confirmBtnMap[variant]}"
						>
							{loading ? 'Aguarde...' : confirmLabel}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
