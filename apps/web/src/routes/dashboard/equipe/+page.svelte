<script lang="ts">
  import { apiFetch } from '$lib/api';
  import { toast } from '$lib/stores/toast.svelte';
  import { Users, Mail, UserPlus, Shield, Loader2, Trash2, Link, X, Plus } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import Sheet from '$lib/components/ui/Sheet.svelte';
  
  let { data } = $props<{ data: any }>();
  let membros = $state<any[]>([]);
  let convites = $state<any[]>([]);

  $effect(() => {
    membros = data.equipe.membros || [];
    convites = data.equipe.convites || [];
  });
  
  let isOwner = $derived(data.me?.role === 'OWNER');
  let currentUserEmail = $derived(data.me?.email || '');
  
  // Invite State
  let showInviteModal = $state(false);
  let inviteEmail = $state('');
  let inviteRole = $state('MEMBER');
  let sendingInvite = $state(false);
  let isValidEmail = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim()));
  
  // Delete State
  let showDeleteConfirm = $state(false);
  let itemToDelete = $state<{type: 'membro' | 'convite', id: string} | null>(null);

  async function loadData() {
    try {
      const [membrosRes, convitesRes, infoRes] = await Promise.all([
        apiFetch('/organizacao/membros', data.sessionToken),
        apiFetch('/organizacao/convites', data.sessionToken),
        apiFetch('/organizacao/info', data.sessionToken)
      ]);
      
      if (membrosRes.ok) {
        const json = await membrosRes.json();
        membros = json.data;
      }
      if (convitesRes.ok) {
        const json = await convitesRes.json();
        convites = json.data;
      }
      if (infoRes.ok) {
        const json = await infoRes.json();
        data.equipe.info = json;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function enviarConvite(e: Event) {
    e.preventDefault();
    if (!inviteEmail) return;
    
    sendingInvite = true;
    try {
      const res = await apiFetch('/organizacao/membros/convidar', data.sessionToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      
      const json = await res.json();
      
      if (res.ok) {
        toast.sucesso('Convite gerado com sucesso!');
        inviteEmail = '';
        showInviteModal = false;
        loadData();
      } else {
        toast.erro(json.error || 'Erro ao enviar convite');
      }
    } catch {
      toast.erro('Erro de conexão');
    } finally {
      sendingInvite = false;
    }
  }

  function confirmDelete(type: 'membro' | 'convite', id: string) {
    itemToDelete = { type, id };
    showDeleteConfirm = true;
  }

  async function executeDelete() {
    if (!itemToDelete) return;
    
    try {
      let res;
      if (itemToDelete.type === 'convite') {
        res = await apiFetch(`/organizacao/convites/${itemToDelete.id}`, data.sessionToken, { method: 'DELETE' });
      } else {
        res = await apiFetch(`/organizacao/membros/${itemToDelete.id}`, data.sessionToken, { method: 'DELETE' });
      }
      
      if (res.ok) {
        toast.sucesso(itemToDelete.type === 'convite' ? 'Convite cancelado' : 'Membro removido');
        loadData();
      } else {
        const json = await res.json();
        toast.erro(json.error || 'Erro na operação');
      }
    } catch {
      toast.erro('Erro de conexão');
    } finally {
      showDeleteConfirm = false;
      itemToDelete = null;
    }
  }

  function copyInviteLink(token: string) {
    const url = `${window.location.origin}/aceitar-convite/${token}`;
    navigator.clipboard.writeText(url);
    toast.sucesso('Link do convite copiado!');
  }
</script>

<svelte:head>
  <title>Gestão de Equipe — MediVisitas</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="page-header">
    <div class="page-header-main">
      <div class="page-header-icon">
        <Users class="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 class="page-title">Gestão de Equipe</h1>
        <p class="page-description">Gerencie os membros da sua organização e convites pendentes.</p>
      </div>
    </div>
    
    {#if isOwner}
      <Button onclick={() => showInviteModal = true} class="gap-2">
        <Plus class="h-4 w-4" />
        Convidar Membro
      </Button>
    {/if}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Membros Ativos -->
    <div class="lg:col-span-2 space-y-4">
      <h2 class="section-title">Membros da Equipe</h2>
      
      <div class="bg-white border border-[rgb(var(--slate-200))] rounded-xl overflow-hidden shadow-sm">
        {#if membros.length === 0}
          <div class="p-8 text-center text-[rgb(var(--slate-500))]">
            Nenhum membro encontrado.
          </div>
        {:else}
          <div class="divide-y divide-[rgb(var(--slate-100))]">
            {#each membros as membro}
              <div class="p-4 flex items-center justify-between hover:bg-[rgb(var(--slate-50))] transition-colors">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                    {(membro.user?.name || membro.user?.email || '?').charAt(0)}
                  </div>
                  <div>
                    <p class="font-medium text-[rgb(var(--slate-800))] text-sm">{membro.user?.name || 'Usuário Pendente'}</p>
                    <p class="text-xs text-[rgb(var(--slate-500))]">{membro.user?.email || 'Sem email'}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium {membro.role === 'OWNER' ? 'bg-amber-100 text-amber-800' : 'bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-700))]'}">
                    {#if membro.role === 'OWNER'}
                      <Shield class="w-3 h-3" /> Gestor
                    {:else}
                      Representante
                    {/if}
                  </span>
                  
                  {#if isOwner}
                    {@const isSelf = membro.user?.email === currentUserEmail}
                    <button 
                      onclick={() => { if (!isSelf) confirmDelete('membro', membro.userId); }}
                      disabled={isSelf}
                      class="p-1.5 rounded-lg transition-colors {isSelf ? 'text-[rgb(var(--slate-300))] cursor-not-allowed opacity-50' : 'text-[rgb(var(--slate-400))] hover:text-red-600 hover:bg-red-50 cursor-pointer'}"
                      title={isSelf ? 'Você não pode remover a si mesmo' : 'Remover membro'}
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  {:else}
                    <div class="w-7"></div> <!-- Placeholder to keep alignment -->
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Convites Pendentes -->
    <div class="lg:col-span-1 space-y-4">
      <h2 class="text-base font-semibold text-[rgb(var(--slate-700))]">Convites Pendentes</h2>
      
      <div class="bg-white border border-[rgb(var(--slate-200))] rounded-xl overflow-hidden shadow-sm">
        {#if convites.length === 0}
          <div class="p-6 text-center text-sm text-[rgb(var(--slate-500))]">
            Nenhum convite pendente.
          </div>
        {:else}
          <div class="divide-y divide-[rgb(var(--slate-100))]">
            {#each convites as convite}
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-2 text-sm text-[rgb(var(--slate-800))] font-medium">
                    <Mail class="w-4 h-4 text-[rgb(var(--slate-400))]" />
                    <span class="truncate">{convite.email}</span>
                  </div>
                  {#if isOwner}
                    <button 
                      onclick={() => confirmDelete('convite', convite.id)}
                      class="text-[rgb(var(--slate-400))] hover:text-red-600 transition-colors cursor-pointer"
                      title="Cancelar convite"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  {/if}
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-xs text-[rgb(var(--slate-500))]">
                    Enviado: {new Date(convite.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <button 
                    onclick={() => copyInviteLink(convite.token)}
                    class="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <Link class="w-3 h-3" />
                    Copiar Link
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Sheet Convite -->
<Sheet bind:open={showInviteModal} onclose={() => showInviteModal = false}>
  {#snippet children()}
      <div class="space-y-5">
        <div>
          <h3 class="text-lg font-semibold text-[rgb(var(--slate-900))]">Convidar novo membro</h3>
          <p class="mt-1 text-sm text-[rgb(var(--slate-500))]">Envie um convite para adicionar um colaborador à organização.</p>
        </div>

      <form onsubmit={enviarConvite} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1" for="inviteEmail">Email do colaborador</label>
          <input 
            type="email" 
            id="inviteEmail"
            bind:value={inviteEmail} 
            required
            class="w-full px-3 py-2 border border-[rgb(var(--slate-200))] rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="colaborador@exemplo.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1" for="inviteRole">Nível de Acesso</label>
          <select 
            id="inviteRole"
            bind:value={inviteRole}
            class="w-full px-3 py-2 border border-[rgb(var(--slate-200))] rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="MEMBER">Representante (Acesso Padrão)</option>
            <option value="OWNER">Gestor (Acesso Total)</option>
          </select>
          <p class="mt-1.5 text-xs text-[rgb(var(--slate-500))]">
            Representantes veem apenas suas próprias visitas. Gestores têm visão global.
          </p>
        </div>
        
        <div class="pt-4 flex flex-col-reverse gap-3 border-t border-[rgb(var(--slate-100))]">
          <button 
            type="button" 
            onclick={() => showInviteModal = false}
            class="h-10 rounded-lg border border-[rgb(var(--slate-200))] px-4 text-sm font-medium text-[rgb(var(--slate-600))] transition-colors hover:bg-[rgb(var(--slate-50))] cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={sendingInvite || !isValidEmail}
            class="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {#if sendingInvite}
              <Loader2 class="w-4 h-4 animate-spin" /> Processando...
            {:else}
              Gerar Convite
            {/if}
          </button>
        </div>
      </form>
    </div>
  {/snippet}
</Sheet>

<ConfirmDialog 
  open={showDeleteConfirm}
  title={itemToDelete?.type === 'convite' ? 'Cancelar Convite' : 'Remover Membro'}
  confirmLabel={itemToDelete?.type === 'convite' ? 'Sim, cancelar' : 'Sim, remover'}
  variant="danger"
  onclose={() => showDeleteConfirm = false}
  onconfirm={executeDelete}
>
  {#snippet description()}
    <p>Tem certeza que deseja {itemToDelete?.type === 'convite' ? 'cancelar este convite pendente' : 'remover este membro da organização'}?</p>
  {/snippet}
</ConfirmDialog>
