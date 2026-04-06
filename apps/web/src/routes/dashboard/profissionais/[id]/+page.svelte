<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  import { ArrowLeft, CalendarPlus, Phone, Mail, MapPin, Calendar, Clock, Package, Pencil, FileText, Target, User, Activity, ListTodo } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import StatusVisitaBadge from '$lib/components/ui/StatusVisitaBadge.svelte';
  import VisitaSheet from '$lib/components/ui/VisitaSheet.svelte';
  import TimelineProfissional from '$lib/components/crm/TimelineProfissional.svelte';
  import DetalheContatos from '$lib/components/crm/DetalheContatos.svelte';
  import type {
    Profissional,
    Visita,
    MaterialTecnico,
    PotencialPrescricao,
    EstagioPipeline,
    ClassificacaoRelacionamento,
    TimelineItem
  } from '$lib/types';

  interface Props {
    data: { sessionToken: string | null };
  }

  let { data }: Props = $props();

  let id = $derived($page.params.id);
  let profissional = $state<Profissional | null>(null);
  let visitas = $state<Visita[]>([]);
  let materiaisOptions = $state<MaterialTecnico[]>([]);
  let timelineItens = $state<TimelineItem[]>([]);
  let loading = $state(true);
  let abaAtiva = $state<'timeline' | 'visitas' | 'agenda' | 'dados'>('timeline');

  let visitaSheetOpen = $state(false);
  let visitaEmEdicao = $state<Visita | null>(null);

  // ── Badge helpers ──
  const potencialConfig: Record<PotencialPrescricao, { label: string; class: string }> = {
    ALTO: { label: 'Alto', class: 'bg-emerald-50 text-emerald-700' },
    MEDIO: { label: 'Médio', class: 'bg-amber-50 text-amber-700' },
    BAIXO: { label: 'Baixo', class: 'bg-red-50 text-red-600' },
    ESTRATEGICO: { label: 'Estratégico', class: 'bg-violet-50 text-violet-700' }
  };

  const estagioConfig: Record<EstagioPipeline, { label: string; class: string }> = {
    PROSPECTADO: { label: 'Prospectado', class: 'bg-slate-100 text-slate-600' },
    VISITADO: { label: 'Visitado', class: 'bg-blue-50 text-blue-700' },
    INTERESSADO: { label: 'Interessado', class: 'bg-purple-50 text-purple-700' },
    PRESCRITOR: { label: 'Prescritor', class: 'bg-emerald-50 text-emerald-700' },
    FIDELIZADO: { label: 'Fidelizado', class: 'bg-amber-50 text-amber-700' }
  };

  const classificacaoConfig: Record<ClassificacaoRelacionamento, { label: string; class: string }> = {
    FORTE: { label: 'Forte', class: 'bg-emerald-50 text-emerald-700' },
    INTERMEDIARIO: { label: 'Intermediário', class: 'bg-amber-50 text-amber-700' },
    FRACO: { label: 'Fraco', class: 'bg-red-50 text-red-600' }
  };

  const tratamentoLabels: Record<string, string> = { DR: 'Dr.', DRA: 'Dra.', PROF: 'Prof.', PROFA: 'Profa.', SR: 'Sr.', SRA: 'Sra.' };
  const sexoLabels: Record<string, string> = { MASCULINO: 'Masculino', FEMININO: 'Feminino', NAO_INFORMADO: 'Não informado' };

  async function loadData() {
    loading = true;
    try {
      const [profRes, visitasRes, matRes, timelineRes] = await Promise.all([
        apiFetch(`/profissionais/${id}`, data.sessionToken),
        apiFetch(`/visitas?profissionalId=${id}&pageSize=50`, data.sessionToken),
        apiFetch(`/materiais?pageSize=100`, data.sessionToken),
        apiFetch(`/profissionais/${id}/timeline`, data.sessionToken)
      ]);

      if (profRes.ok) profissional = await profRes.json();
      if (visitasRes.ok) {
        const json = await visitasRes.json();
        visitas = json.data || json;
      }
      if (matRes.ok) {
        const json = await matRes.json();
        materiaisOptions = json.data || json;
      }
      if (timelineRes.ok) {
        const json = await timelineRes.json();
        timelineItens = json.itens || [];
      }
    } catch(err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadData();
  });

  function handleNovaVisita() {
    visitaEmEdicao = null;
    visitaSheetOpen = true;
  }

  function handleEditarVisita(visita: Visita) {
    visitaEmEdicao = visita;
    visitaSheetOpen = true;
  }

  function getInitials(nome: string): string {
    return nome.split(' ').slice(0, 2).map(n => n.charAt(0)).join('').toUpperCase();
  }

  function getNomeCompleto(prof: Profissional): string {
    const prefix = prof.tratamento ? (tratamentoLabels[prof.tratamento] ?? '') + ' ' : '';
    return prefix + prof.nome;
  }

  const tabs = [
    { id: 'timeline' as const, label: 'Timeline', icon: Activity },
    { id: 'visitas' as const, label: 'Visitas', icon: Calendar },
    { id: 'agenda' as const, label: 'Agenda', icon: ListTodo },
    { id: 'dados' as const, label: 'Dados', icon: User }
  ];
</script>

<svelte:head>
  <title>{profissional ? profissional.nome : 'Perfil do Profissional'} — MediVisitas</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 p-4 lg:p-8">

  <!-- Botão Voltar -->
  <div class="flex items-center mb-6">
    <a href="/dashboard/profissionais" class="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group">
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      Voltar para CRM
    </a>
  </div>

  {#if loading}
    <div class="flex justify-center items-start pt-32">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
    </div>
  {:else if profissional}
    <!-- Layout Principal: Card Esquerdo + Conteúdo Direito -->
    <div class="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-10 items-start">

      <!-- ═══ COLUNA ESQUERDA: Card de Perfil ═══ -->
      <div class="col-span-1 lg:sticky lg:top-8">
        <div class="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">

          <!-- Identificação -->
          <div class="flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xl font-bold mb-3 ring-4 ring-slate-50">
              {getInitials(profissional.nome)}
            </div>
            <h1 class="text-[22px] leading-tight font-bold text-slate-950 mb-1">{getNomeCompleto(profissional)}</h1>
            <p class="text-sm font-medium text-slate-500 mb-2">
              {profissional.especialidade?.nome ?? 'Sem especialidade'}
              {#if profissional.subEspecialidade?.nome}
                <span class="text-slate-300"> · </span>{profissional.subEspecialidade.nome}
              {/if}
            </p>
          </div>

          <hr class="border-slate-100 my-6">

          <!-- Classificação badges -->
          <div class="flex flex-wrap gap-2 justify-center mb-4">
            {#if profissional.potencial && potencialConfig[profissional.potencial]}
              <span class="inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider {potencialConfig[profissional.potencial].class}">
                {potencialConfig[profissional.potencial].label}
              </span>
            {/if}
            {#if profissional.estagioPipeline && estagioConfig[profissional.estagioPipeline]}
              <span class="inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider {estagioConfig[profissional.estagioPipeline].class}">
                {estagioConfig[profissional.estagioPipeline].label}
              </span>
            {/if}
            {#if profissional.classificacao && classificacaoConfig[profissional.classificacao]}
              <span class="inline-flex items-center px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wider {classificacaoConfig[profissional.classificacao].class}">
                {classificacaoConfig[profissional.classificacao].label}
              </span>
            {/if}
          </div>

          <!-- Dados Pessoais compactos -->
          <div class="space-y-3">
            {#if profissional.crm}
              <div class="flex justify-between">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CRM</span>
                <span class="text-[13px] font-semibold text-slate-900">{profissional.crm}</span>
              </div>
            {/if}
            {#if profissional.cpfCnpj}
              <div class="flex justify-between">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CPF/CNPJ</span>
                <span class="text-[13px] font-semibold text-slate-900">{profissional.cpfCnpj}</span>
              </div>
            {/if}
            {#if profissional.sexo}
              <div class="flex justify-between">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sexo</span>
                <span class="text-[13px] font-semibold text-slate-900">{sexoLabels[profissional.sexo] ?? profissional.sexo}</span>
              </div>
            {/if}
            {#if profissional.dataNascimento}
              <div class="flex justify-between">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nasc.</span>
                <span class="text-[13px] font-semibold text-slate-900">{new Date(profissional.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
              </div>
            {/if}
          </div>

          <!-- Observações -->
          {#if profissional.observacoes}
            <hr class="border-slate-100 my-4">
            <p class="text-[13px] font-medium text-slate-600 leading-relaxed bg-slate-50/50 rounded-md p-3 border border-slate-100/50">{profissional.observacoes}</p>
          {/if}

          <!-- Botão Editar -->
          <div class="mt-auto pt-6">
            <a
              href="/dashboard/profissionais"
              class="flex items-center justify-center gap-2 w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm rounded-lg py-2.5 transition-all outline-none cursor-pointer"
            >
              <Pencil class="w-3.5 h-3.5 text-slate-400" />
              Editar Cadastro
            </a>
          </div>
        </div>
      </div>

      <!-- ═══ COLUNA DIREITA: Tabs ═══ -->
      <div class="col-span-1 lg:col-span-2 xl:col-span-3">
        <!-- Tab bar -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex gap-1 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
            {#each tabs as tab}
              {@const Icon = tab.icon}
              {@const active = abaAtiva === tab.id}
              <button
                type="button"
                onclick={() => { abaAtiva = tab.id; }}
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer
                  {active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                "
              >
                <Icon class="w-3.5 h-3.5" />
                {tab.label}
              </button>
            {/each}
          </div>
          <button
            type="button"
            onclick={handleNovaVisita}
            class="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 shadow-sm transition-all hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer"
          >
            <CalendarPlus class="w-4 h-4" />
            Registrar Visita
          </button>
        </div>

        <!-- Tab content -->
        {#if abaAtiva === 'timeline'}
          <TimelineProfissional itens={timelineItens} />

        {:else if abaAtiva === 'visitas'}
          {#if visitas.length === 0}
            <div class="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
              <div class="flex justify-center mb-4">
                <div class="bg-slate-100 p-3 rounded-full">
                  <Calendar class="w-7 h-7 text-slate-400" />
                </div>
              </div>
              <p class="text-sm font-medium text-slate-600">Nenhuma visita registrada</p>
              <p class="text-xs text-slate-400 mt-1">Registre a primeira visita para este profissional.</p>
              <button
                type="button"
                onclick={handleNovaVisita}
                class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <CalendarPlus class="w-4 h-4" />
                Criar primeira visita
              </button>
            </div>
          {:else}
            <div class="border-l-2 border-slate-100 ml-3 pl-6 space-y-6">
              {#each visitas as visita}
                <div class="relative">
                  <div class="absolute -left-[31px] top-[26px] w-3 h-3 rounded-full ring-4 ring-slate-50 shadow-sm
                    {visita.status === 'REALIZADA' ? 'bg-emerald-500' : visita.status === 'CANCELADA' ? 'bg-red-500' : visita.status === 'NAO_REALIZADA' ? 'bg-slate-500' : 'bg-blue-500'}
                  "></div>

                  <button
                    type="button"
                    class="w-full text-left bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-[1px] cursor-pointer border border-slate-100 hover:border-slate-200"
                    onclick={() => handleEditarVisita(visita)}
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <Calendar class="w-3.5 h-3.5 text-slate-400" />
                        <span class="text-sm font-semibold text-slate-700">
                          {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(visita.dataVisita))}
                        </span>
                        <span class="text-slate-300">·</span>
                        <span class="text-sm font-semibold text-slate-700">
                          {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(visita.dataVisita))}
                        </span>
                        {#if visita.duracaoMinutos}
                          <span class="text-slate-300">·</span>
                          <span class="flex items-center gap-1 text-xs text-slate-400">
                            <Clock class="w-3 h-3" />{visita.duracaoMinutos}min
                          </span>
                        {/if}
                      </div>
                      <StatusVisitaBadge status={visita.status} />
                    </div>

                    {#if visita.objetivoVisita}
                      <div class="flex items-start gap-2 mt-2">
                        <Target class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <p class="text-slate-600 text-sm">{visita.objetivoVisita}</p>
                      </div>
                    {/if}

                    {#if visita.resumo}
                      <div class="flex items-start gap-2 mt-2">
                        <FileText class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <p class="text-slate-500 text-sm">{visita.resumo}</p>
                      </div>
                    {/if}

                    {#if visita.materiais && visita.materiais.length > 0}
                      <div class="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-slate-50">
                        <Package class="w-3 h-3 text-slate-400 shrink-0" />
                        {#each visita.materiais as vm}
                          <span class="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-md">
                            {vm.quantidade}x {vm.materialTecnico?.nome || 'Material'}
                          </span>
                        {/each}
                      </div>
                    {/if}
                  </button>
                </div>
              {/each}
            </div>
          {/if}

        {:else if abaAtiva === 'agenda'}
          <div class="text-center py-12 bg-white rounded-xl border border-slate-100">
            <p class="text-sm text-slate-400">Agenda deste profissional será exibida aqui</p>
          </div>

        {:else if abaAtiva === 'dados'}
          <div class="bg-white rounded-xl border border-slate-100 p-6">
            <DetalheContatos
              contatos={profissional.contatos ?? []}
              telefone={profissional.telefone}
              email={profissional.email}
              endereco={profissional.endereco}
            />
          </div>
        {/if}
      </div>
    </div>
{:else}
  <div class="text-center py-20">
    <p class="text-sm text-slate-500">Profissional não encontrado.</p>
    <a href="/dashboard/profissionais" class="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">Voltar à listagem</a>
  </div>
{/if}
</div>

<VisitaSheet
  bind:open={visitaSheetOpen}
  onclose={() => { visitaSheetOpen = false; }}
  onsave={() => { loadData(); }}
  visita={visitaEmEdicao}
  profissionalId={id}
  sessionToken={data.sessionToken}
  {materiaisOptions}
/>
