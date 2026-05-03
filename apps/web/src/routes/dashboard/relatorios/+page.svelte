<script lang="ts">
  import { Users, Calendar, Download, Loader2, FileSpreadsheet } from "lucide-svelte";
  import { apiFetch } from "$lib/api";

  let { data } = $props();

  let isDownloadingProfissionais = $state(false);
  let isDownloadingVisitas = $state(false);
  let errorMsg = $state<string | null>(null);

  async function downloadCSV(type: "profissionais" | "visitas") {
    if (type === "profissionais") isDownloadingProfissionais = true;
    if (type === "visitas") isDownloadingVisitas = true;
    errorMsg = null;

    try {
      const res = await apiFetch(`/relatorios/${type}`, data.sessionToken);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Erro ao baixar relatório de ${type}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (e: any) {
      errorMsg = e.message;
    } finally {
      if (type === "profissionais") isDownloadingProfissionais = false;
      if (type === "visitas") isDownloadingVisitas = false;
    }
  }
</script>

<svelte:head>
  <title>Relatórios — MediVisitas</title>
</svelte:head>

<div class="flex flex-wrap items-center justify-between gap-4 mb-6">
  <div class="flex items-center gap-3">
    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
      <FileSpreadsheet class="h-4.5 w-4.5 text-white" />
    </div>
    <div>
      <h1 class="text-lg font-bold text-[rgb(var(--slate-800))]">Relatórios</h1>
      <p class="text-[11px] text-[rgb(var(--slate-400))]">Exporte os dados da sua organização em formato CSV para análise avançada.</p>
    </div>
  </div>
</div>

{#if errorMsg}
  <div class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
    {errorMsg}
  </div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Profissionais -->
  <div class="flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group">
    <div class="flex items-center gap-4 mb-4">
      <div class="p-3 bg-blue-50 text-blue-600 rounded-xl transition-colors">
        <Users class="size-6" />
      </div>
      <h3 class="text-lg font-bold text-slate-900">Profissionais</h3>
    </div>

    <p class="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
      Exportação completa da base de profissionais cadastrados pela sua equipe, incluindo dados de contato, localidade, especialidade e estágio no funil.
    </p>

    <button
      class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onclick={() => downloadCSV("profissionais")}
      disabled={isDownloadingProfissionais}
    >
      {#if isDownloadingProfissionais}
        <Loader2 class="size-4 animate-spin" />
        Processando...
      {:else}
        <Download class="size-4" />
        Baixar arquivo CSV
      {/if}
    </button>
  </div>

  <!-- Visitas -->
  <div class="flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group">
    <div class="flex items-center gap-4 mb-4">
      <div class="p-3 bg-blue-50 text-blue-600 rounded-xl transition-colors">
        <Calendar class="size-6" />
      </div>
      <h3 class="text-lg font-bold text-slate-900">Visitas e Agenda</h3>
    </div>

    <p class="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
      Exportação de todo o histórico de visitas e agendamentos realizados pela equipe, incluindo status, profissional visitado, anotações e quem realizou a visita.
    </p>

    <button
      class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onclick={() => downloadCSV("visitas")}
      disabled={isDownloadingVisitas}
    >
      {#if isDownloadingVisitas}
        <Loader2 class="size-4 animate-spin" />
        Processando...
      {:else}
        <Download class="size-4" />
        Baixar arquivo CSV
      {/if}
    </button>
  </div>
</div>
