<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { CircleCheck, CircleX, Info, X } from 'lucide-svelte';

	const iconMap = {
		success: CircleCheck,
		error: CircleX,
		info: Info
	};

	const iconColorMap = {
		success: 'text-emerald-500',
		error: 'text-red-500',
		info: 'text-blue-500'
	};
</script>

<div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 pointer-events-none">
	{#each $toasts as toast (toast.id)}
		{@const Icon = iconMap[toast.type]}
		<div
			class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl pointer-events-auto min-w-[280px] max-w-[400px] bg-white border border-slate-200"
			in:fly={{ y: 20, duration: 250, easing: cubicOut }}
			out:fade={{ duration: 150 }}
		>
			<Icon class="w-5 h-5 shrink-0 {iconColorMap[toast.type]}" />
			<span class="text-sm flex-1 text-slate-700">{toast.message}</span>
			<button
				onclick={() => toasts.dismiss(toast.id)}
				class="p-0.5 rounded hover:bg-slate-100 cursor-pointer shrink-0 transition-colors"
			>
				<X class="w-3.5 h-3.5 text-slate-400" />
			</button>
		</div>
	{/each}
</div>
