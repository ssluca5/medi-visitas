<script lang="ts">
  import { FileSpreadsheet, Download, Loader2 } from "lucide-svelte";
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

<div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
  <div class="sm:flex sm:justify-between sm:items-center mb-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Relatórios</h1>
      <p class="text-sm text-slate-500 mt-1">Exporte os dados da sua organização em formato CSV para análise avançada.</p>
    </div>
  </div>

  {#if errorMsg}
    <div class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
      {errorMsg}
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Profissionais -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-5 flex-1">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FileSpreadsheet class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-semibold text-slate-800">Profissionais</h2>
        </div>
        <p class="text-sm text-slate-500 mb-6">
          Exportação completa da base de profissionais cadastrados pela sua equipe, incluindo dados de contato, localidade, especialidade e estágio no funil.
        </p>
      </div>
      <div class="px-5 py-4 border-t border-slate-100 bg-slate-50">
        <button
          class="w-full flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onclick={() => downloadCSV("profissionais")}
          disabled={isDownloadingProfissionais}
        >
          {#if isDownloadingProfissionais}
            <Loader2 class="w-4 h-4 animate-spin" />
            Processando...
          {:else}
            <Download class="w-4 h-4" />
            Baixar CSV
          {/if}
        </button>
      </div>
    </div>

    <!-- Visitas -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-5 flex-1">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FileSpreadsheet class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-semibold text-slate-800">Visitas e Agenda</h2>
        </div>
        <p class="text-sm text-slate-500 mb-6">
          Exportação de todo o histórico de visitas e agendamentos realizados pela equipe, incluindo status, profissional visitado, anotações e quem realizou a visita.
        </p>
      </div>
      <div class="px-5 py-4 border-t border-slate-100 bg-slate-50">
        <button
          class="w-full flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onclick={() => downloadCSV("visitas")}
          disabled={isDownloadingVisitas}
        >
          {#if isDownloadingVisitas}
            <Loader2 class="w-4 h-4 animate-spin" />
            Processando...
          {:else}
            <Download class="w-4 h-4" />
            Baixar CSV
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
