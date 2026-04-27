<script lang="ts">
  import { page } from '$app/state'

  const motivo = $derived(page.url.searchParams.get('motivo'))
</script>

<div class="min-h-screen flex items-center justify-center bg-[rgb(var(--slate-50))]">
  <div class="w-full max-w-md p-8 text-center">
    <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
      {motivo === 'trial_expirado' ? 'Seu trial expirou' : 'Conta suspensa'}
    </h1>
    <p class="mt-3 text-[rgb(var(--slate-500))]">
      {#if motivo === 'trial_expirado'}
        Seu período de teste gratuito de 7 dias chegou ao fim. Assine um plano para continuar usando o MediVisitas.
      {:else}
        Sua conta está suspensa. Verifique o pagamento para reativar o acesso.
      {/if}
    </p>

    <div class="mt-8 p-6 bg-white rounded-lg border border-[rgb(var(--slate-200))]">
      <p class="text-sm text-[rgb(var(--slate-400))]">
        Planos em breve. Entre em contato com o suporte para mais informações.
      </p>
    </div>
  </div>
</div>
