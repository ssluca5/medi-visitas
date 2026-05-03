<script lang="ts">
  import { apiFetch } from '$lib/api';
  import { toast } from '$lib/stores/toast.svelte';
  import { Loader2, MailCheck, ShieldCheck, AlertCircle } from 'lucide-svelte';
  
  let { data } = $props<{ data: any }>();
  
  let aceitando = $state(false);
  let errorMsg = $state(data.error);

  async function aceitarConvite() {
    if (!data.sessionToken) {
      toast.erro('Você precisa fazer login primeiro!');
      return;
    }
    
    aceitando = true;
    try {
      const res = await apiFetch(`/organizacao/convites/token/${data.token}/aceitar`, data.sessionToken, {
        method: 'POST'
      });
      
      if (res.ok) {
        toast.sucesso('Convite aceito! Redirecionando...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        const json = await res.json();
        errorMsg = json.error || 'Erro ao aceitar convite';
      }
    } catch(e) {
      errorMsg = 'Erro de conexão';
    } finally {
      aceitando = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <div class="flex justify-center text-violet-600 mb-6">
      <div class="h-16 w-16 bg-violet-100 rounded-full flex items-center justify-center">
        <MailCheck class="h-8 w-8" />
      </div>
    </div>
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Convite para Equipe
    </h2>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {#if errorMsg}
        <div class="rounded-md bg-red-50 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <AlertCircle class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Convite inválido</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{errorMsg}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 text-center">
          <a href="/dashboard" class="text-sm font-medium text-violet-600 hover:text-violet-500">
            Voltar para o sistema
          </a>
        </div>
      {:else if data.convite}
        <div class="text-center mb-6">
          <p class="text-gray-600">Você foi convidado para participar da organização:</p>
          <p class="text-xl font-bold text-gray-900 mt-2">{data.convite.organizationName}</p>
          <p class="text-sm text-gray-500 mt-1">Como: {data.convite.role === 'OWNER' ? 'Gestor' : 'Representante'}</p>
        </div>
        
        {#if !data.sessionToken}
          <div class="rounded-md bg-amber-50 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <ShieldCheck class="h-5 w-5 text-amber-400" />
              </div>
              <div class="ml-3 text-sm text-amber-800">
                <p>Você precisa estar logado com a conta <strong>{data.convite.email}</strong> para aceitar o convite.</p>
              </div>
            </div>
          </div>
          <a href="/sign-in?redirect_url=/aceitar-convite/{data.token}" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700">
            Fazer Login
          </a>
        {:else}
          <button 
            onclick={aceitarConvite}
            disabled={aceitando}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-70"
          >
            {#if aceitando}
              <Loader2 class="w-5 h-5 animate-spin mr-2" />
              Processando...
            {:else}
              Aceitar Convite
            {/if}
          </button>
        {/if}
      {/if}
    </div>
  </div>
</div>
