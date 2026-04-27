<!-- apps/web/src/routes/planos/+page.svelte -->
<script lang="ts">
  import { page } from '$app/state';
  import { PUBLIC_API_URL } from '$env/static/public';

  const motivo = $derived(page.url.searchParams.get('motivo'));
  const checkout = $derived(page.url.searchParams.get('checkout'));

  let loading = $state<string | null>(null);
  let error = $state<string | null>(null);
  let ativando = $state(false);
  let planoAtivo = $state<string | null>(null);

  // Poll billing status when returning from checkout success
  $effect(() => {
    if (checkout !== 'success' || ativando) return;
    ativando = true;
    const interval = setInterval(async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(c => c.startsWith('__session='))
          ?.split('=')[1];
        const res = await fetch(`${PUBLIC_API_URL}/billing/status`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ATIVO') {
            clearInterval(interval);
            window.location.href = '/dashboard?checkout=success';
          }
        }
      } catch {}
    }, 2000);
    // Stop polling after 30s
    setTimeout(() => { clearInterval(interval); ativando = false; }, 30000);
    return () => clearInterval(interval);
  });

  // Check if user already has active plan
  $effect(() => {
    const token = document.cookie
      .split('; ')
      .find(c => c.startsWith('__session='))
      ?.split('=')[1];
    if (!token) return;
    fetch(`${PUBLIC_API_URL}/billing/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.status === 'ATIVO') planoAtivo = data.plano;
      })
      .catch(() => {});
  });

  async function assinar(plano: 'INDIVIDUAL' | 'EMPRESA') {
    loading = plano;
    error = null;

    try {
      const token = document.cookie
        .split('; ')
        .find(c => c.startsWith('__session='))
        ?.split('=')[1];

      const res = await fetch(`${PUBLIC_API_URL}/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ plano }),
      });

      if (!res.ok) {
        const data = await res.json();
        error = data.error || 'Erro ao criar sessão de checkout';
        return;
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      error = 'Erro de conexão. Tente novamente.';
    } finally {
      loading = null;
    }
  }

  async function gerenciar() {
    loading = 'PORTAL';
    error = null;

    try {
      const token = document.cookie
        .split('; ')
        .find(c => c.startsWith('__session='))
        ?.split('=')[1];

      const res = await fetch(`${PUBLIC_API_URL}/billing/portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const data = await res.json();
        error = data.error || 'Erro ao abrir portal de gerenciamento';
        return;
      }

      const { portalUrl } = await res.json();
      window.location.href = portalUrl;
    } catch {
      error = 'Erro de conexão. Tente novamente.';
    } finally {
      loading = null;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-[rgb(var(--slate-50))]">
  <div class="w-full max-w-3xl p-8">
    {#if checkout === 'success' && ativando}
      <div class="text-center mb-10">
        <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">Ativando assinatura...</h1>
        <p class="mt-3 text-[rgb(var(--slate-500))]">Aguarde enquanto confirmamos seu pagamento.</p>
        <div class="mt-6 flex justify-center">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-[rgb(var(--blue-600))] border-t-transparent"></div>
        </div>
      </div>
    {:else}
      <div class="text-center mb-10">
        <h1 class="text-2xl font-semibold text-[rgb(var(--slate-900))]">
          {motivo === 'trial_expirado' ? 'Seu trial expirou' : 'Escolha seu plano'}
        </h1>
        <p class="mt-3 text-[rgb(var(--slate-500))]">
          {#if motivo === 'trial_expirado'}
            Seu período de teste gratuito de 7 dias chegou ao fim. Assine um plano para continuar.
          {:else if planoAtivo}
            Você já possui um plano ativo. Gerencie sua assinatura abaixo.
          {:else}
            Trial de 7 dias gratuito em qualquer plano
          {/if}
        </p>
      </div>

      {#if checkout === 'cancelled'}
        <div class="mb-6 p-4 rounded-lg bg-[rgb(var(--amber-50))] border border-[rgb(var(--amber-200))] text-[rgb(var(--amber-800))] text-sm text-center">
          Checkout cancelado. Você pode tentar novamente quando quiser.
        </div>
      {/if}

      {#if error}
        <div class="mb-6 p-4 rounded-lg bg-[rgb(var(--red-50))] border border-[rgb(var(--red-200))] text-[rgb(var(--red-800))] text-sm text-center">
          {error}
        </div>
      {/if}

      {#if planoAtivo}
        <div class="text-center">
          <button
            onclick={gerenciar}
            disabled={loading !== null}
            class="py-2.5 px-6 rounded-lg bg-[rgb(var(--blue-600))] text-white font-medium text-sm hover:bg-[rgb(var(--blue-700))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading === 'PORTAL' ? 'Abrindo portal...' : 'Gerenciar assinatura'}
          </button>
        </div>
      {:else}
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Individual -->
          <div class="bg-white rounded-xl border border-[rgb(var(--slate-200))] p-6 flex flex-col">
            <h2 class="text-lg font-semibold text-[rgb(var(--slate-900))]">Individual</h2>
            <p class="text-sm text-[rgb(var(--slate-500))] mt-1">Para propagandistas autônomos</p>
            <div class="mt-4">
              <span class="text-3xl font-bold text-[rgb(var(--slate-900))]">R$ 79</span>
              <span class="text-[rgb(var(--slate-500))]">/mês</span>
            </div>
            <ul class="mt-6 space-y-3 flex-1">
              <li class="flex items-center gap-2 text-sm text-[rgb(var(--slate-700))]">
                <svg class="h-4 w-4 text-[rgb(var(--emerald-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Cadastro ilimitado de profissionais
              </li>
              <li class="flex items-center gap-2 text-sm text-[rgb(var(--slate-700))]">
                <svg class="h-4 w-4 text-[rgb(var(--emerald-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Agenda inteligente
              </li>
              <li class="flex items-center gap-2 text-sm text-[rgb(var(--slate-700))]">
                <svg class="h-4 w-4 text-[rgb(var(--emerald-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Pipeline comercial
              </li>
              <li class="flex items-center gap-2 text-sm text-[rgb(var(--slate-700))]">
                <svg class="h-4 w-4 text-[rgb(var(--emerald-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Transcrição por IA (50/mês)
              </li>
            </ul>
            <button
              onclick={() => assinar('INDIVIDUAL')}
              disabled={loading !== null}
              class="mt-6 w-full py-2.5 px-4 rounded-lg bg-[rgb(var(--blue-600))] text-white font-medium text-sm hover:bg-[rgb(var(--blue-700))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading === 'INDIVIDUAL' ? 'Redirecionando...' : 'Assinar agora'}
            </button>
          </div>

          <!-- Empresa -->
          <div class="bg-white rounded-xl border-2 border-[rgb(var(--blue-600))] p-6 flex flex-col relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[rgb(var(--blue-600))] text-white text-xs font-medium px-3 py-0.5 rounded-full">Popular</span>
            <h2 class="text-lg font-semibold text-[rgb(var(--slate-900))]">Empresa</h2>
            <p class="text-sm text-[rgb(var(--slate-500))] mt-1">Para equipes de propagandistas</p>
            <div class="mt-4">
              <span class="text-3xl font-bold text-[rgb(var(--slate-900))]">R$ 49</span>
              <span class="text-[rgb(var(--slate-500))]">/mês por usuário</span>
            </div>
            <ul class="mt-6 space-y-3 flex-1">
              <li class="flex items-center gap-2 text-sm text-[rgb(var(--slate-700))]">
                <svg class="h-4 w-4 text-[rgb(var(--emerald-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Tudo do Individual
              </li>
              <li class="flex items-center gap-2 text-sm text-[rgb(var(--slate-700))]">
                <svg class="h-4 w-4 text-[rgb(var(--emerald-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Múltiplos propagandistas
              </li>
              <li class="flex items-center gap-2 text-sm text-[rgb(var(--slate-700))]">
                <svg class="h-4 w-4 text-[rgb(var(--emerald-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Dashboard do gestor
              </li>
              <li class="flex items-center gap-2 text-sm text-[rgb(var(--slate-700))]">
                <svg class="h-4 w-4 text-[rgb(var(--emerald-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Transcrição por IA (ilimitada)
              </li>
            </ul>
            <button
              onclick={() => assinar('EMPRESA')}
              disabled={loading !== null}
              class="mt-6 w-full py-2.5 px-4 rounded-lg bg-[rgb(var(--blue-600))] text-white font-medium text-sm hover:bg-[rgb(var(--blue-700))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading === 'EMPRESA' ? 'Redirecionando...' : 'Assinar agora'}
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
