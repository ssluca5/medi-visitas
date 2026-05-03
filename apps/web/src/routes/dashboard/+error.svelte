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
  <p class="text-7xl font-black mb-4" style="color: #e5e7eb;">
    {page.status}
  </p>

  <h1 class="text-xl font-semibold mb-2" style="color: #111827;">
    {#if page.status === 404}
      Essa página não existe
    {:else if page.status === 403}
      Sem permissão
    {:else}
      Algo deu errado
    {/if}
  </h1>

  <p class="text-sm mb-6" style="color: #9ca3af;">
    {page.error?.message ?? 'Ocorreu um erro inesperado.'}
  </p>

  <div class="flex gap-3">
    <button
      onclick={() => goto('/dashboard')}
      class="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-white
        transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md cursor-pointer"
      style="background-color: #2563eb;">
      <Home class="w-4 h-4" />
      Ir para o dashboard
    </button>
    <button
      onclick={() => window.location.reload()}
      class="inline-flex items-center gap-2 h-10 px-5 rounded-lg border text-sm font-medium
        transition-all duration-200 hover:bg-gray-50 cursor-pointer"
      style="border-color: #e5e7eb; color: #374151;">
      <RotateCcw class="w-4 h-4" />
      Tentar novamente
    </button>
  </div>
</div>
