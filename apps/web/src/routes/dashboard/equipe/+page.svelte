<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import { toast } from '$lib/stores/toast.svelte';
  import { Users, Mail, UserPlus, Shield, Loader2, Trash2, Link, X, Plus, Mic, Save, ShoppingCart, Sparkles, FileText, CheckCircle2, PackagePlus } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import Sheet from '$lib/components/ui/Sheet.svelte';
  
  let { data } = $props<{ data: any }>();
  let membros = $state<any[]>([]);
  let convites = $state<any[]>([]);
  let transcricoes = $state<any>(null);
  let transcricoesErro = $state<string | null>(null);
  let carregandoTranscricoes = $state(false);
  let cotaInputs = $state<Record<string, number>>({});
  let savingCota = $state<string | null>(null);
  let comprandoPacote = $state<number | null>(null);

  $effect(() => {
    membros = data.equipe.membros || [];
    convites = data.equipe.convites || [];
    transcricoes = data.equipe.transcricoes || null;
    transcricoesErro = data.equipe.transcricoesError || null;
    cotaInputs = Object.fromEntries(
      (data.equipe.transcricoes?.membros || []).map((membro: any) => [
        membro.userId,
        membro.cota ?? 0
      ])
    );
  });
  
  let isOwner = $derived(data.me?.role === 'OWNER');
  let currentUserEmail = $derived(data.me?.email || '');
  const pacotesIa = [20, 50, 100] as const;

  function percentualUso(membro: { cota?: number; usadas?: number }) {
    const cota = Number(membro.cota ?? 0);
    if (cota <= 0) return 0;
    return Math.min(100, Math.round((Number(membro.usadas ?? 0) / cota) * 100));
  }

  onMount(() => {
    if (isOwner && !transcricoes) {
      carregarTranscricoes();
    }
  });
  
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
      carregarTranscricoes();
    } catch (e) {
      console.error(e);
    }
  }

  async function carregarTranscricoes() {
    carregandoTranscricoes = true;
    transcricoesErro = null;

    try {
      const res = await apiFetch('/transcricoes/equipe', data.sessionToken);
      if (res.ok) {
        const json = await res.json();
        transcricoes = json;
        cotaInputs = Object.fromEntries(
          (json.membros || []).map((membro: any) => [
            membro.userId,
            membro.cota ?? 0
          ])
        );
      } else {
        const json = await res.json().catch(() => ({}));
        transcricoes = null;
        transcricoesErro = json.error || 'Não foi possível carregar as cotas de IA.';
      }
    } catch {
      transcricoes = null;
      transcricoesErro = 'Erro de conexão ao carregar as cotas de IA.';
    } finally {
      carregandoTranscricoes = false;
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

  async function copyInviteLink(convite: { id?: string; token?: string }) {
    const token = convite.token ?? convite.id;
    if (!token) {
      toast.erro('Convite sem identificador. Atualize a página e tente novamente.');
      return;
    }

    const url = `${window.location.origin}/aceitar-convite/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.sucesso('Link do convite copiado!');
    } catch {
      toast.erro('Não foi possível copiar o link do convite.');
    }
  }
  async function salvarCota(userId: string) {
    const limite = Math.max(0, Number(cotaInputs[userId] ?? 0));
    savingCota = userId;

    try {
      const res = await apiFetch(`/transcricoes/equipe/${userId}`, data.sessionToken, {
        method: 'PATCH',
        body: JSON.stringify({ limite })
      });

      if (res.ok) {
        transcricoes = await res.json();
        cotaInputs = Object.fromEntries(
          (transcricoes.membros || []).map((membro: any) => [
            membro.userId,
            membro.cota ?? 0
          ])
        );
        toast.sucesso('Cota de IA atualizada.');
      } else {
        const json = await res.json().catch(() => ({}));
        toast.erro(json.error || 'Erro ao atualizar a cota.');
      }
    } catch {
      toast.erro('Erro de conexão.');
    } finally {
      savingCota = null;
    }
  }

  async function comprarPacote(quantidade: 20 | 50 | 100) {
    comprandoPacote = quantidade;

    try {
      const res = await apiFetch('/transcricoes/comprar-pacote', data.sessionToken, {
        method: 'POST',
        body: JSON.stringify({ quantidade })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.checkoutUrl) window.location.href = json.checkoutUrl;
      } else {
        const json = await res.json().catch(() => ({}));
        toast.erro(json.error || 'Erro ao iniciar compra.');
      }
    } catch {
      toast.erro('Erro de conexão.');
    } finally {
      comprandoPacote = null;
    }
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
        <p class="page-description">Gerencie membros, convites e distribua as cotas de transcrições de IA da organização.</p>
      </div>
    </div>
    
    {#if isOwner}
      <Button onclick={() => showInviteModal = true} class="gap-2">
        <Plus class="h-4 w-4" />
        Convidar Membro
      </Button>
    {/if}
  </div>

  {#if isOwner}
    <section class="mt-8">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 class="section-title">Transcrições de IA</h2>
          <p class="text-sm" style="color: var(--text-secondary);">
            Distribua cotas apenas para representantes. Gestores usam a cota total da organização.
          </p>
        </div>
        {#if transcricoes}
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-secondary);">Comprar extras:</span>
            <div class="flex cursor-pointer rounded-xl border p-1 shadow-sm" style="background-color: var(--bg-primary); border-color: var(--border-base);">
              {#each pacotesIa as quantidade}
                <button
                  type="button"
                  disabled={comprandoPacote !== null}
                  onclick={() => comprarPacote(quantidade)}
                  class="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all hover:bg-[var(--bg-surface)] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  style="color: var(--text-primary);"
                >
                  {#if comprandoPacote === quantidade}
                    <Loader2 class="h-4 w-4 animate-spin" style="color: var(--brand-primary);" />
                  {:else}
                    <ShoppingCart class="h-4 w-4" style="color: var(--text-muted);" />
                  {/if}
                  +{quantidade}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      {#if carregandoTranscricoes}
        <div class="flex items-center gap-3 rounded-xl border p-5 text-sm" style="background-color: var(--bg-surface); border-color: var(--border-base); color: var(--text-secondary);">
          <Loader2 class="h-4 w-4 animate-spin" style="color: var(--brand-primary);" />
          Carregando cotas de IA...
        </div>
      {:else if transcricoes}
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div class="equipe-kpi-card flex items-center gap-4 rounded-xl border p-5 shadow-sm" style="background-color: var(--bg-surface); border-color: var(--border-base);">
            <div class="shrink-0 rounded-full p-3" style="background-color: var(--bg-primary); color: var(--text-secondary);">
              <FileText class="h-6 w-6" />
            </div>
            <div class="flex flex-col">
              <span class="mb-1 text-sm font-medium" style="color: var(--text-secondary);">Total mensal</span>
              <span class="text-2xl font-semibold" style="color: var(--text-primary);">{transcricoes.limite}</span>
            </div>
          </div>

          <div class="equipe-kpi-card flex items-center gap-4 rounded-xl border p-5 shadow-sm" style="background-color: var(--danger-light); border-color: var(--danger-border);">
            <div class="shrink-0 rounded-full p-3" style="background-color: color-mix(in srgb, var(--danger) 10%, var(--bg-surface)); color: var(--danger);">
              <CheckCircle2 class="h-6 w-6" />
            </div>
            <div class="flex flex-col">
              <span class="mb-1 text-sm font-medium" style="color: var(--text-secondary);">Usadas</span>
              <span class="text-2xl font-semibold" style="color: var(--danger);">{transcricoes.usadas}</span>
            </div>
          </div>

          <div class="equipe-kpi-card flex items-center gap-4 rounded-xl border-2 p-5 shadow-sm" style="background-color: color-mix(in srgb, var(--brand-light) 45%, var(--bg-surface)); border-color: var(--brand-light);">
            <div class="shrink-0 rounded-full p-3" style="background-color: var(--brand-light); color: var(--brand-primary);">
              <Sparkles class="h-6 w-6" />
            </div>
            <div class="flex flex-col">
              <span class="mb-1 text-sm font-medium" style="color: var(--text-secondary);">Sem distribuir</span>
              <span class="text-2xl font-semibold" style="color: var(--brand-primary);">{transcricoes.semDistribuir}</span>
            </div>
          </div>

          <div class="equipe-kpi-card flex items-center gap-4 rounded-xl border p-5 shadow-sm" style="background-color: color-mix(in srgb, var(--success-bg) 35%, var(--bg-surface)); border-color: var(--border-base);">
            <div class="shrink-0 rounded-full p-3" style="background-color: var(--success-bg); color: var(--success-text);">
              <PackagePlus class="h-6 w-6" />
            </div>
            <div class="flex flex-col">
              <span class="mb-1 text-sm font-medium" style="color: var(--text-secondary);">Extras compradas</span>
              <span class="text-2xl font-semibold" style="color: var(--success-text);">{transcricoes.extras}</span>
            </div>
          </div>
        </div>

        <div class="mt-5 space-y-3">
          {#each transcricoes.membros as membro}
            <div class="flex flex-col justify-between rounded-xl border border-[var(--border-base)] p-4 shadow-sm transition-colors hover:border-[var(--brand-primary)] sm:flex-row sm:items-center" style="background-color: var(--bg-surface);">
              <div class="flex min-w-0 items-center gap-4">
                <div class="shrink-0 rounded-full p-2" style="background-color: var(--bg-primary); color: var(--text-secondary);">
                  <Mic class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold" style="color: var(--text-primary);">
                    {membro.user?.name || membro.user?.email || 'Usuário'}
                  </p>
                  <div class="mt-1 flex items-center gap-2">
                    <div class="h-1.5 w-24 overflow-hidden rounded-full" style="background-color: var(--border-base);">
                      <div
                        class="h-full rounded-full transition-all"
                        style="width: {percentualUso(membro)}%; background-color: var(--brand-primary);"
                      ></div>
                    </div>
                    <span class="text-xs font-medium" style="color: var(--text-secondary);">{percentualUso(membro)}% usado</span>
                  </div>
                  <p class="mt-1 truncate text-xs" style="color: var(--text-muted);">
                    {membro.cota > 0
                      ? `${membro.usadas} de ${membro.cota} usadas · ${membro.restantes} disponíveis`
                      : 'Sem cota definida'}
                  </p>
                </div>
              </div>

              <div class="mt-4 flex items-center sm:mt-0">
                <div class="flex items-center overflow-hidden rounded-lg border border-[var(--border-base)] shadow-sm transition-all focus-within:border-[var(--brand-primary)] focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/20">
                  <span class="flex h-9 items-center border-r px-3 pr-2 text-xs font-semibold" style="background-color: var(--bg-primary); border-color: var(--border-base); color: var(--text-secondary);">Cota</span>
                  <input
                    type="number"
                    min="0"
                    max={transcricoes.limite}
                    value={cotaInputs[membro.userId] ?? membro.cota}
                    oninput={(event) => {
                      cotaInputs[membro.userId] = Number((event.currentTarget as HTMLInputElement).value);
                    }}
                    class="h-9 w-16 border-none px-2 text-center text-sm font-semibold outline-none focus:ring-0"
                    style="background-color: var(--bg-surface); color: var(--text-primary);"
                    aria-label="Cota de transcrições"
                  />
                  <button
                    type="button"
                    disabled={savingCota === membro.userId}
                    onclick={() => salvarCota(membro.userId)}
                    class="flex h-9 cursor-pointer items-center gap-1.5 bg-[var(--brand-primary)] px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {#if savingCota === membro.userId}
                      <Loader2 class="h-3.5 w-3.5 animate-spin" />
                    {:else}
                      <Save class="h-3.5 w-3.5" />
                    {/if}
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          {:else}
            <div class="rounded-xl border p-5 text-sm shadow-sm" style="background-color: var(--bg-surface); border-color: var(--border-base); color: var(--text-secondary);">
              Nenhum representante na equipe para distribuir cotas.
            </div>
          {/each}
        </div>
      {:else}
        <div class="rounded-xl border p-5" style="background-color: var(--bg-surface); border-color: var(--border-base);">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm font-medium" style="color: var(--text-primary);">Distribuição de IA indisponível</p>
              <p class="mt-1 text-sm" style="color: var(--text-secondary);">
                {transcricoesErro || 'Não foi possível carregar as cotas de transcrições.'}
              </p>
            </div>
            <Button type="button" variant="outline" class="gap-2" onclick={carregarTranscricoes}>
              Tentar novamente
            </Button>
          </div>
        </div>
      {/if}
    </section>
  {/if}

  <div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Membros Ativos -->
    <section class="overflow-hidden rounded-xl border shadow-sm lg:col-span-2" style="background-color: var(--bg-surface); border-color: var(--border-base);">
      <div class="border-b px-5 py-4" style="border-color: var(--border-base);">
        <h2 class="section-title">Membros da Equipe</h2>
      </div>

      <div>
        {#if membros.length === 0}
          <div class="p-8 text-center text-sm" style="color: var(--text-secondary);">
            Nenhum membro encontrado.
          </div>
        {:else}
          <div class="divide-y divide-[var(--border-base)]">
            {#each membros as membro}
              <div class="p-4 flex items-center justify-between hover:bg-[var(--brand-light)]/40 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold uppercase" style="background-color: var(--brand-light); color: var(--brand-primary);">
                    {(membro.user?.name || membro.user?.email || '?').charAt(0)}
                  </div>
                  <div>
                    <p class="text-sm font-medium" style="color: var(--text-primary);">{membro.user?.name || 'Usuário Pendente'}</p>
                    <p class="text-xs" style="color: var(--text-secondary);">{membro.user?.email || 'Sem email'}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-widest"
                    style={membro.role === 'OWNER'
                      ? 'background-color: var(--trial-bg); color: var(--trial-text); border-color: color-mix(in srgb, var(--pipeline-prospectado) 35%, transparent);'
                      : 'background-color: var(--brand-light); color: var(--text-secondary); border-color: var(--border-base);'}
                  >
                    {#if membro.role === 'OWNER'}
                      <Shield class="w-3 h-3" /> Gestor
                    {:else}
                      Propagandista
                    {/if}
                  </span>
                  
                  {#if isOwner}
                    {@const isSelf = membro.user?.email === currentUserEmail}
                    <button 
                      onclick={() => { if (!isSelf) confirmDelete('membro', membro.userId); }}
                      disabled={isSelf}
                      class="p-1.5 rounded-lg transition-colors {isSelf ? 'text-[var(--text-muted)] cursor-not-allowed opacity-50' : 'text-[var(--text-secondary)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] cursor-pointer'}"
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
    </section>

    <!-- Convites Pendentes -->
    <section class="overflow-hidden rounded-xl border shadow-sm lg:col-span-1" style="background-color: var(--bg-surface); border-color: var(--border-base);">
      <div class="border-b px-5 py-4" style="border-color: var(--border-base);">
        <h2 class="section-title">Convites Pendentes</h2>
      </div>

      <div>
        {#if convites.length === 0}
          <div class="p-6 text-center text-sm" style="color: var(--text-secondary);">
            Nenhum convite pendente.
          </div>
        {:else}
<div class="divide-y divide-[var(--border-base)]">
            {#each convites as convite}
              <div class="flex items-center justify-between px-4 py-3 gap-4">
                <div class="flex items-center gap-2 min-w-0 text-sm font-medium" style="color: var(--text-primary);">
                  <Mail class="w-4 h-4 shrink-0" style="color: var(--text-muted);" />
                  <span class="truncate">{convite.email}</span>
                </div>
                {#if isOwner}
                  <button
                    onclick={() => confirmDelete('convite', convite.id)}
                    class="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors cursor-pointer shrink-0"
                    title="Cancelar convite"
                  >
                    <X class="w-4 h-4" />
                  </button>
                {/if}
                <button
                  onclick={() => copyInviteLink(convite)}
                  class="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80 cursor-pointer shrink-0"
                  style="color: var(--brand-primary);"
                >
                  <Link class="w-3 h-3" />
                  <span class="hidden sm:inline">Copiar Link</span>
                  <span class="sm:hidden">Copiar</span>
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>
  </div>
</div>

<!-- Sheet Convite -->
<Sheet bind:open={showInviteModal} onclose={() => showInviteModal = false}>
  {#snippet children()}
      <div class="space-y-5">
        <div class="border-b pb-4 pr-8" style="border-color: var(--border-base);">
          <h3 class="text-lg font-semibold" style="color: var(--text-primary);">Convidar novo membro</h3>
          <p class="mt-1 text-sm" style="color: var(--text-secondary);">Envie um convite para adicionar um colaborador à organização.</p>
        </div>

      <form onsubmit={enviarConvite} class="space-y-5">
        <div class="space-y-1.5">
          <div class="mb-4 flex items-center gap-2">
            <UserPlus class="h-4 w-4" style="color: var(--text-muted);" />
            <p class="eyebrow-text">Acesso</p>
          </div>

          <label class="input-label" for="inviteEmail">Email do colaborador</label>
          <input 
            type="email" 
            id="inviteEmail"
            bind:value={inviteEmail} 
            required
            class="input-base h-9 py-0"
            placeholder="colaborador@exemplo.com"
          />
          <p class="input-hint">O convite será enviado para este email.</p>
        </div>
        
        <div class="space-y-1.5">
          <label class="input-label" for="inviteRole">Nível de acesso</label>
          <select 
            id="inviteRole"
            bind:value={inviteRole}
            class="input-base h-10 py-0 leading-5"
          >
            <option value="MEMBER">Propagandista (Acesso Padrão)</option>
            <option value="OWNER">Gestor (Acesso Total)</option>
          </select>
          <p class="input-hint">
            Propagandistas veem apenas suas próprias visitas. Gestores têm visão global.
          </p>
        </div>
        
        <div class="border-t pt-4" style="border-color: var(--border-base);">
          <div class="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={sendingInvite || !isValidEmail}
              class="w-full gap-2"
            >
              {#if sendingInvite}
                <Loader2 class="w-4 h-4 animate-spin" /> Processando...
              {:else}
                Gerar Convite
              {/if}
            </Button>
            <Button
              type="button"
              onclick={() => showInviteModal = false}
              variant="outline"
              class="w-full"
            >
              Cancelar
            </Button>
          </div>
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

<style>
  .equipe-kpi-card {
    will-change: transform;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease;
  }

  .equipe-kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgb(15 23 42 / 0.08);
  }
</style>
