<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	type Size = 'default' | 'sm' | 'lg' | 'icon';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		href?: string;
		children: Snippet;
	}

	let { variant = 'default', size = 'default', href, class: className = '', children, ...rest }: Props = $props();

	const variantClasses: Record<Variant, string> = {
		default: 'bg-[rgb(var(--accent))] text-white shadow-sm hover:bg-[rgb(var(--accent))]/90',
		destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
		outline: 'border bg-white shadow-sm hover:bg-slate-50',
		secondary: 'bg-slate-100 text-slate-700 shadow-sm hover:bg-slate-200/70',
		ghost: 'hover:bg-slate-100',
		link: 'text-[rgb(var(--accent))] underline-offset-4 hover:underline'
	};

	const sizeClasses: Record<Size, string> = {
		default: 'h-9 px-4 py-2',
		sm: 'h-8 rounded-lg px-3 text-xs',
		lg: 'h-10 rounded-lg px-8',
		icon: 'h-9 w-9'
	};

	let classes = $derived(
		`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))]/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
	);
</script>

{#if href}
	<a {href} class={classes} {...rest as any}>
		{@render children()}
	</a>
{:else}
	<button class={classes} {...rest}>
		{@render children()}
	</button>
{/if}
