<script lang="ts">
  import { goto } from '$app/navigation'
  import { PUBLIC_API_URL } from '$env/static/public'
  import { page } from '$app/state'

  let step = $state(1)
  let selectedType = $state<'individual' | 'empresa' | null>(null)
  let nomeEmpresa = $state('')
  let loading = $state(false)
  let error = $state('')

  const sessionToken = $derived(page.data.sessionToken)

  function selectType(type: 'individual' | 'empresa') {
    selectedType = type
    step = 2
  }

  async function submit() {
    loading = true
    error = ''

    try {
      const endpoint = selectedType === 'individual'
        ? `${PUBLIC_API_URL}/onboarding/individual`
        : `${PUBLIC_API_URL}/onboarding/empresa`

      const body = selectedType === 'empresa'
        ? JSON.stringify({ nomeEmpresa })
        : undefined

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao criar organização')
      }

      goto('/dashboard')
    } catch (e) {
      error = e instanceof Error ? e.message : 'Erro desconhecido'
    } finally {
      loading = false
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-[rgb(var(--slate-50))]">
  <div class="w-full max-w-md p-8">
    {#if step === 1}
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
          Bem-vindo ao MediVisitas
        </h1>
        <p class="mt-2 text-[rgb(var(--slate-500))]">
          Como você usará o sistema?
        </p>
      </div>

      <div class="space-y-3">
        <button
          onclick={() => selectType('individual')}
          class="w-full p-4 rounded-lg border-2 border-[rgb(var(--slate-200))] hover:border-[rgb(var(--blue-500))] hover:bg-[rgb(var(--blue-50))] transition-all text-left cursor-pointer"
        >
          <p class="font-medium text-[rgb(var(--slate-900))]">
            Sou propagandista individual
          </p>
          <p class="text-sm text-[rgb(var(--slate-500))] mt-1">
            Usuário único, gerencio meus próprios profissionais e visitas
          </p>
        </button>

        <button
          onclick={() => selectType('empresa')}
          class="w-full p-4 rounded-lg border-2 border-[rgb(var(--slate-200))] hover:border-[rgb(var(--blue-500))] hover:bg-[rgb(var(--blue-50))] transition-all text-left cursor-pointer"
        >
          <p class="font-medium text-[rgb(var(--slate-900))]">
            Represento uma empresa
          </p>
          <p class="text-sm text-[rgb(var(--slate-500))] mt-1">
            Gestor com múltiplos propagandistas na equipe
          </p>
        </button>
      </div>
    {/if}

    {#if step === 2 && selectedType === 'individual'}
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
          Configuração Individual
        </h1>
        <p class="mt-2 text-[rgb(var(--slate-500))]">
          Sua conta será configurada para uso pessoal.
        </p>
      </div>

      <div class="bg-white rounded-lg border border-[rgb(var(--slate-200))] p-6 mb-6">
        <p class="text-sm text-[rgb(var(--slate-600))]">
          Você terá 7 dias de trial gratuito para explorar todas as funcionalidades.
        </p>
      </div>

      <button
        onclick={submit}
        disabled={loading}
        class="w-full py-2.5 px-4 rounded-lg bg-[rgb(var(--blue-600))] text-white font-medium hover:bg-[rgb(var(--blue-700))] disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? 'Criando...' : 'Começar agora'}
      </button>
    {/if}

    {#if step === 2 && selectedType === 'empresa'}
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
          Nome da Empresa
        </h1>
        <p class="mt-2 text-[rgb(var(--slate-500))]">
          Identifique sua representação comercial
        </p>
      </div>

      <div class="space-y-4">
        <input
          type="text"
          bind:value={nomeEmpresa}
          placeholder="Ex: Farmácia Silva"
          class="w-full px-3 py-2 rounded-lg border border-[rgb(var(--slate-300))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onclick={submit}
          disabled={loading || nomeEmpresa.trim().length === 0}
          class="w-full py-2.5 px-4 rounded-lg bg-[rgb(var(--blue-600))] text-white font-medium hover:bg-[rgb(var(--blue-700))] disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? 'Criando...' : 'Criar organização'}
        </button>
      </div>
    {/if}

    {#if error}
      <p class="mt-4 text-sm text-[rgb(var(--red-600))] text-center">{error}</p>
    {/if}
  </div>
</div>
