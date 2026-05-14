<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { Home, RotateCcw } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Erro — MediVisitas</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
  <!-- Código do erro -->
  <p class="text-7xl font-black mb-4 text-ui-faint">
    {page.status}
  </p>

  <h1 class="page-title-marker text-xl font-semibold mb-2 text-ui-primary">
    {#if page.status === 404}
      Essa página não existe
    {:else if page.status === 403}
      Sem permissão
    {:else}
      Algo deu errado
    {/if}
  </h1>

  <p class="text-sm mb-6 text-ui-muted">
    {#if page.status === 404}
      A página que você procura não existe ou foi movida.
    {:else if page.status === 403}
      Você não tem permissão para acessar este recurso.
    {:else}
      Ocorreu um erro inesperado. Tente novamente.
    {/if}
  </p>

  <div class="flex gap-3">
    <button
      onclick={() => goto('/dashboard')}
      class="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-white
        transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md cursor-pointer"
      style="background-color: var(--brand-primary);">
      <Home class="w-4 h-4" />
      Ir para o dashboard
    </button>
    <button
      onclick={() => window.location.reload()}
      class="inline-flex items-center gap-2 h-10 px-5 rounded-lg border text-sm font-medium
        border-[rgb(var(--slate-200))] text-ui-body
        transition-all duration-200 hover:bg-gray-50 cursor-pointer">
      <RotateCcw class="w-4 h-4" />
      Tentar novamente
    </button>
  </div>
</div>
