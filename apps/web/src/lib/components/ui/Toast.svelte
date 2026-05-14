<script lang="ts">
	import { toasts, removerToast } from '$lib/stores/toast.svelte';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { CircleCheck, CircleX, Info, AlertTriangle, X } from 'lucide-svelte';

	const iconMap = {
		success: CircleCheck,
		error: CircleX,
		info: Info,
		warning: AlertTriangle
	};

	const styleMap = {
		success: { bg: 'var(--success-bg)', border: 'var(--success-border)', text: 'var(--success-text)' },
		error:   { bg: 'var(--danger-soft)', border: 'rgb(252 165 165)', text: 'var(--danger-text)' },
		info:    { bg: 'var(--brand-light)', border: 'var(--info-border)', text: 'var(--info-text)' },
		warning: { bg: 'var(--warning-light)', border: 'var(--warning-soft)', text: 'var(--warning-text)' }
	};
</script>

<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
	{#each toasts.value as t (t.id)}
		{@const Icon = iconMap[t.type]}
		{@const colors = styleMap[t.type]}
		<div
			class="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg pointer-events-auto min-w-72 max-w-sm"
			style="background-color: {colors.bg}; border-color: {colors.border};"
			in:fly={{ y: 20, duration: 300, easing: cubicOut }}
			out:fade={{ duration: 150 }}
		>
			<Icon class="w-5 h-5 shrink-0" style="color: {colors.text};" />
			<span class="text-sm flex-1" style="color: {colors.text};">{t.message}</span>
			<button
				onclick={() => removerToast(t.id)}
				class="p-0.5 rounded hover:opacity-80 cursor-pointer shrink-0 transition-opacity"
				style="color: {colors.text};"
			>
				<X class="w-3.5 h-3.5" />
			</button>
		</div>
	{/each}
</div>
