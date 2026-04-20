<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		side?: 'left' | 'right';
		children: Snippet;
	}

	let { open = $bindable(), onclose, side = 'right', children }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-50 bg-black/30"
		transition:fade={{ duration: 200 }}
		onclick={onclose}
		role="presentation"
	></div>

	<!-- Panel -->
	<div
		class="fixed inset-y-0 z-50 flex h-full w-[90%] max-w-md flex-col bg-white shadow-2xl overflow-x-hidden sm:max-w-sm"
		class:right-0={side === 'right'}
		class:left-0={side === 'left'}
		class:border-l={side === 'right'}
		class:border-r={side === 'left'}
		transition:fly={{ x: side === 'right' ? 400 : -400, duration: 300, easing: cubicOut }}
		role="dialog"
		aria-modal="true"
	>
		<!-- Close button -->
		<button
			type="button"
			class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[rgb(var(--slate-400))] transition-all duration-200 hover:bg-[rgb(var(--slate-100))] hover:text-[rgb(var(--slate-600))] focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
			onclick={onclose}
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Fechar</span>
		</button>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto p-6">
			{@render children()}
		</div>
	</div>
{/if}
