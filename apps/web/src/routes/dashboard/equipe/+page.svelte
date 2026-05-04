<script lang="ts">
  import { apiFetch } from '$lib/api';
  import { toast } from '$lib/stores/toast.svelte';
  import { Users, Mail, UserPlus, Shield, Loader2, Trash2, Link, X } from 'lucide-svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  
  let { data } = $props<{ data: any }>();
  let membros = $state<any[]>([]);
  let convites = $state<any[]>([]);

  $effect(() => {
    membros = data.equipe.membros || [];
    convites = data.equipe.convites || [];
  });
  
  let isOwner = $derived(data.me?.role === 'OWNER');
  
  // Invite State
  let showInviteModal = $state(false);
  let inviteEmail = $state('');
  let inviteRole = $state('MEMBER');
  let sendingInvite = $state(false);
  
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

<div class="space-y-6 max-w-5xl mx-auto">
  <!-- Header -->
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-sm text-white">
        <Users class="h-5 w-5" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-[rgb(var(--slate-800))]">Gestão de Equipe</h1>
        <p class="text-sm text-[rgb(var(--slate-500))]">Gerencie os membros da sua organização e convites pendentes.</p>
      </div>
    </div>
    
    {#if isOwner}
      <button 
        onclick={() => showInviteModal = true}
        class="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <UserPlus class="w-4 h-4" />
        Convidar Membro
      </button>
    {/if}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Membros Ativos -->
    <div class="lg:col-span-2 space-y-4">
      <h2 class="text-base font-semibold text-[rgb(var(--slate-700))]">Membros da Equipe</h2>
      
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
                  <div class="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold uppercase">
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
                  
                  {#if isOwner && membro.userId !== data.me?.id}
                    <button 
                      onclick={() => confirmDelete('membro', membro.userId)}
                      class="p-1.5 text-[rgb(var(--slate-400))] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover membro"
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
                      class="text-[rgb(var(--slate-400))] hover:text-red-600 transition-colors"
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
                    class="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
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

<!-- Modal Convite -->
{#if showInviteModal}
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
      <div class="p-5 border-b border-[rgb(var(--slate-100))] flex justify-between items-center">
        <h3 class="font-semibold text-[rgb(var(--slate-800))]">Convidar novo membro</h3>
        <button onclick={() => showInviteModal = false} class="text-[rgb(var(--slate-400))] hover:text-[rgb(var(--slate-600))]">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <form onsubmit={enviarConvite} class="p-5 space-y-4">
        <div>
          <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1" for="inviteEmail">Email do colaborador</label>
          <input 
            type="email" 
            id="inviteEmail"
            bind:value={inviteEmail} 
            required
            class="w-full px-3 py-2 border border-[rgb(var(--slate-200))] rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            placeholder="colaborador@exemplo.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-[rgb(var(--slate-700))] mb-1" for="inviteRole">Nível de Acesso</label>
          <select 
            id="inviteRole"
            bind:value={inviteRole}
            class="w-full px-3 py-2 border border-[rgb(var(--slate-200))] rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
          >
            <option value="MEMBER">Representante (Acesso Padrão)</option>
            <option value="OWNER">Gestor (Acesso Total)</option>
          </select>
          <p class="mt-1.5 text-xs text-[rgb(var(--slate-500))]">
            Representantes veem apenas suas próprias visitas. Gestores têm visão global.
          </p>
        </div>
        
        <div class="pt-2 flex justify-end gap-3">
          <button 
            type="button" 
            onclick={() => showInviteModal = false}
            class="px-4 py-2 text-sm font-medium text-[rgb(var(--slate-600))] hover:bg-[rgb(var(--slate-50))] rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={sendingInvite || !inviteEmail}
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-70"
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
  </div>
{/if}

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
