<script lang="ts">
	import { PUBLIC_CLERK_SIGN_IN_HOSTED_URL } from '$env/static/public';

	const redirectUrl = typeof window !== 'undefined'
		? `${PUBLIC_CLERK_SIGN_IN_HOSTED_URL}?redirect_url=${encodeURIComponent(window.location.origin + '/dashboard')}`
		: PUBLIC_CLERK_SIGN_IN_HOSTED_URL;
</script>

<svelte:head>
	<title>Login — MediVisitas</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[rgb(var(--color-surface-2))]">
	<div class="w-full max-w-md p-8 rounded-xl bg-[rgb(var(--color-surface))] shadow-xl border border-[rgb(var(--color-border))]">
		<div class="text-center mb-8">
			<h1 class="text-2xl font-bold text-[rgb(var(--color-text))]">MediVisitas</h1>
			<p class="text-sm text-[rgb(var(--color-text-muted))] mt-1">CRM para Propagandistas Farmacêuticos</p>
		</div>

		<div class="text-center space-y-4">
			<p class="text-sm text-[rgb(var(--color-text-muted))]">
				Faça login para acessar o sistema.
			</p>
			<a
				href={redirectUrl}
			aria-label="Entrar com Clerk"
				class="inline-flex items-center justify-center w-full h-11 rounded-[var(--radius)] bg-[rgb(var(--accent))] text-white font-medium text-sm will-change-transform transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:scale-[0.98]"
			>
				Entrar com Clerk
			</a>
		</div>
	</div>
</div>
