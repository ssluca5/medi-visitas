<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon?: any;
		icone?: string;
		titulo: string;
		descricao: string;
		acaoLabel?: string;
		acaoOnclick?: () => void;
		children?: Snippet;
	}

	let { icon: Icon, icone, titulo, descricao, acaoLabel, acaoOnclick, children }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl border border-[rgb(var(--slate-200))] bg-white">
	<!-- Ícone decorativo -->
	<div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[rgb(var(--slate-100))]">
		{#if Icon}
			<Icon class="h-6 w-6 text-ui-muted" />
		{:else}
			<span class="text-2xl">{icone || '📋'}</span>
		{/if}
	</div>

	<h3 class="text-sm font-semibold text-ui-body">{titulo}</h3>
	<p class="text-xs mt-1 max-w-xs leading-relaxed text-ui-muted">{descricao}</p>

	{#if children}
		<div class="mt-5">
			{@render children()}
		</div>
	{:else if acaoLabel && acaoOnclick}
		<button
			onclick={acaoOnclick}
			class="mt-5 h-9 px-4 rounded-lg text-xs font-medium text-white bg-blue-600 cursor-pointer
				will-change-transform transition-all duration-200 hover:-translate-y-[1px] hover:bg-blue-700 hover:shadow-md active:scale-[0.98]">
			{acaoLabel}
		</button>
	{/if}
</div>
