<script lang="ts">
  import { onMount } from "svelte";
  import { apiFetch } from "$lib/api";
  import {
    FileText,
    Download,
    Save,
    Trash2,
    BarChart2,
    Users,
    TrendingUp,
    X,
    RefreshCw,
  } from "lucide-svelte";

  let { data } = $props();

  type Tipo = "visitas" | "profissionais" | "pipeline";

  interface Filtros {
    dataInicio?: string;
    dataFim?: string;
    estagios?: string[];
    potenciais?: string[];
    especialidadeId?: string;
  }

  interface Config {
    colunas: string[];
    filtros: Filtros;
  }

  interface RelatorioSalvo {
    id: string;
    nome: string;
    tipo: Tipo;
    config: Config;
    updatedAt: string;
  }

  interface ResultadoPrevia {
    colunas: string[];
    linhas: Record<string, string | number>[];
    total: number;
  }

  const TIPOS = [
    { value: "visitas", label: "Visitas", icon: FileText },
    { value: "profissionais", label: "Profissionais", icon: Users },
    { value: "pipeline", label: "Pipeline", icon: TrendingUp },
  ] as const;

  const COLUNAS_DISPONIVEIS: Record<
    Tipo,
    { value: string; label: string }[]
  > = {
    visitas: [
      { value: "dataVisita", label: "Data da Visita" },
      { value: "profissional", label: "Profissional" },
      { value: "especialidade", label: "Especialidade" },
      { value: "status", label: "Status" },
      { value: "objetivoVisita", label: "Objetivo" },
      { value: "resumo", label: "Resumo" },
      { value: "proximaAcao", label: "Próxima Ação" },
      { value: "materiais", label: "Materiais" },
      { value: "duracaoMinutos", label: "Duração (min)" },
    ],
    profissionais: [
      { value: "nome", label: "Nome" },
      { value: "crm", label: "CRM" },
      { value: "especialidade", label: "Especialidade" },
      { value: "subEspecialidade", label: "Subespecialidade" },
      { value: "potencial", label: "Potencial" },
      { value: "estagioPipeline", label: "Estágio" },
      { value: "classificacao", label: "Classificação" },
      { value: "cidade", label: "Cidade" },
      { value: "ultimaVisita", label: "Última Visita" },
    ],
    pipeline: [
      { value: "profissional", label: "Profissional" },
      { value: "especialidade", label: "Especialidade" },
      { value: "estagioAtual", label: "Estágio Atual" },
      { value: "estagioAnterior", label: "Estágio Anterior" },
      { value: "dataTransicao", label: "Data Transição" },
      { value: "diasNoEstagio", label: "Dias no Estágio" },
    ],
  };

  const ESTAGIOS = [
    "PROSPECTADO",
    "VISITADO",
    "INTERESSADO",
    "PRESCRITOR",
    "FIDELIZADO",
  ];
  const POTENCIAIS = ["BAIXO", "MEDIO", "ALTO", "ESTRATEGICO"];
  const LABEL_ESTAGIO: Record<string, string> = {
    PROSPECTADO: "Prospectado",
    VISITADO: "Visitado",
    INTERESSADO: "Interessado",
    PRESCRITOR: "Prescritor",
    FIDELIZADO: "Fidelizado",
  };
  const LABEL_POTENCIAL: Record<string, string> = {
    BAIXO: "Baixo",
    MEDIO: "Médio",
    ALTO: "Alto",
    ESTRATEGICO: "Estratégico",
  };

  let tipo = $state<Tipo>("visitas");
  let filtros = $state<Filtros>({});
  let colunaSel = $state<string[]>(["profissional", "dataVisita", "status"]);
  let nomeRel = $state("");
  let salvos = $state<RelatorioSalvo[]>([]);
  let resultado = $state<ResultadoPrevia | null>(null);
  let carregando = $state(false);
  let salvando = $state(false);
  let exportando = $state<"csv" | "pdf" | null>(null);
  let erro = $state("");
  let especialidades = $state<{ id: string; nome: string }[]>([]);

  let colunasDisponiveis = $derived(COLUNAS_DISPONIVEIS[tipo]);

  onMount(async () => {
    await Promise.all([carregarSalvos(), carregarEspecialidades()]);
  });

  async function carregarSalvos() {
    try {
      const res = await apiFetch("/relatorios/configuracoes", data.sessionToken);
      if (res.ok) salvos = await res.json();
    } catch {
      salvos = [];
    }
  }

  async function carregarEspecialidades() {
    try {
      const res = await apiFetch("/especialidades", data.sessionToken);
      const payload = await res.json();
      const lista = Array.isArray(payload) ? payload : (payload.data ?? []);
      especialidades = lista.map((e: any) => ({ id: e.id, nome: e.nome }));
    } catch {
      especialidades = [];
    }
  }

  function selecionarTipo(t: Tipo) {
    tipo = t;
    colunaSel = COLUNAS_DISPONIVEIS[t].slice(0, 3).map((c) => c.value);
    resultado = null;
    filtros = {};
  }

  function toggleColuna(valor: string) {
    colunaSel = colunaSel.includes(valor)
      ? colunaSel.filter((c) => c !== valor)
      : [...colunaSel, valor];
  }

  function toggleMulti(lista: string[], valor: string): string[] {
    return lista.includes(valor)
      ? lista.filter((v) => v !== valor)
      : [...lista, valor];
  }

  async function executar() {
    if (!colunaSel.length) {
      erro = "Selecione ao menos uma coluna.";
      return;
    }

    erro = "";
    carregando = true;
    resultado = null;

    try {
      const res = await apiFetch("/relatorios/executar", data.sessionToken, {
        method: "POST",
        body: JSON.stringify({
          tipo,
          config: { colunas: colunaSel, filtros },
        }),
      });

      if (!res.ok) {
        erro = "Erro ao executar relatório.";
        return;
      }

      resultado = await res.json();
    } catch {
      erro = "Erro de conexão.";
    } finally {
      carregando = false;
    }
  }

  async function salvar() {
    if (!nomeRel.trim()) {
      erro = "Informe um nome para salvar.";
      return;
    }

    erro = "";
    salvando = true;

    try {
      const res = await apiFetch("/relatorios/configuracoes", data.sessionToken, {
        method: "POST",
        body: JSON.stringify({
          nome: nomeRel.trim(),
          tipo,
          config: { colunas: colunaSel, filtros },
        }),
      });

      if (!res.ok) {
        erro = "Erro ao salvar relatório.";
        return;
      }

      await carregarSalvos();
      nomeRel = "";
    } catch {
      erro = "Erro de conexão.";
    } finally {
      salvando = false;
    }
  }

  async function excluirSalvo(id: string) {
    const res = await apiFetch(`/relatorios/configuracoes/${id}`, data.sessionToken, {
      method: "DELETE",
    });
    if (res.ok) salvos = salvos.filter((s) => s.id !== id);
  }

  function carregarSalvo(rel: RelatorioSalvo) {
    tipo = rel.tipo;
    colunaSel = rel.config.colunas;
    filtros = rel.config.filtros ?? {};
    resultado = null;
  }

  async function exportar(formato: "csv" | "pdf") {
    if (!resultado) return;

    let popup: Window | null = null;
    let url: string | null = null;

    if (formato === "pdf") popup = window.open("", "_blank");
    exportando = formato;
    erro = "";

    try {
      const params = new URLSearchParams({
        formato,
        tipo,
        config: encodeURIComponent(
          JSON.stringify({ colunas: colunaSel, filtros }),
        ),
      });
      const res = await apiFetch(
        `/relatorios/exportar?${params}`,
        data.sessionToken,
      );

      if (!res.ok) {
        erro = "Erro ao exportar relatório.";
        popup?.close();
        return;
      }

      const blob = await res.blob();
      url = window.URL.createObjectURL(blob);

      if (formato === "pdf") {
        if (popup) popup.location.href = url;
        else window.open(url, "_blank");
        return;
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-${tipo}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      popup?.close();
      erro = "Erro de conexão.";
    } finally {
      exportando = null;
      if (url) {
        const objectUrl = url;
        window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
      }
    }
  }

  function labelColuna(valor: string): string {
    return colunasDisponiveis.find((c) => c.value === valor)?.label ?? valor;
  }
</script>

<svelte:head>
  <title>Relatórios — MediVisitas</title>
</svelte:head>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
  <div class="p-8">
    <div class="mb-6">
      <h1 class="page-title">Relatórios</h1>
      <p class="page-description">
        Crie, filtre e exporte relatórios personalizados
      </p>
    </div>

    <div class="flex gap-6 items-start">
      <div class="w-72 flex-shrink-0 space-y-4">
        <div class="card-surface p-4">
          <p class="eyebrow-text mb-3">
            Tipo de relatório
          </p>
          <div class="space-y-1">
            {#each TIPOS as t}
              {@const Icon = t.icon}
              <button
                onclick={() => selecionarTipo(t.value as Tipo)}
                class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-left"
                style={tipo === t.value
                  ? "background-color:var(--brand-light);color:var(--brand-primary);"
                  : "color:var(--text-body);"}
              >
                <Icon class="w-4 h-4" />
                <span class={tipo === t.value ? "font-medium" : ""}>
                  {t.label}
                </span>
              </button>
            {/each}
          </div>
        </div>

        <div class="card-surface p-4">
          <p class="eyebrow-text mb-3">
            Colunas
          </p>
          <div class="space-y-1.5">
            {#each colunasDisponiveis as col}
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colunaSel.includes(col.value)}
                  onchange={() => toggleColuna(col.value)}
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-muted-standard">{col.label}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="card-surface p-4">
          <p class="eyebrow-text mb-3">
            Filtros
          </p>
          <div class="space-y-3">
            <div class="space-y-1.5">
              <label class="input-label" for="rel-data-inicio">Data início</label>
              <input
                id="rel-data-inicio"
                type="date"
                bind:value={filtros.dataInicio}
                class="input-base"
              />
            </div>
            <div class="space-y-1.5">
              <label class="input-label" for="rel-data-fim">Data fim</label>
              <input
                id="rel-data-fim"
                type="date"
                bind:value={filtros.dataFim}
                class="input-base"
              />
            </div>
            <div class="space-y-1.5">
              <span class="input-label">Estágios</span>
              <div class="flex flex-wrap gap-1.5">
                {#each ESTAGIOS as e}
                  <button
                    onclick={() => {
                      filtros.estagios = toggleMulti(filtros.estagios ?? [], e);
                    }}
                    class="px-2 py-0.5 text-xs rounded border transition-colors"
                    style={(filtros.estagios ?? []).includes(e)
                      ? "background-color:var(--brand-primary);color:white;border-color:var(--brand-primary);"
                      : "border-color:var(--border-base);color:var(--text-secondary);"}
                  >
                    {LABEL_ESTAGIO[e]}
                  </button>
                {/each}
              </div>
            </div>
            <div class="space-y-1.5">
              <span class="input-label">Potencial</span>
              <div class="flex flex-wrap gap-1.5">
                {#each POTENCIAIS as p}
                  <button
                    onclick={() => {
                      filtros.potenciais = toggleMulti(
                        filtros.potenciais ?? [],
                        p,
                      );
                    }}
                    class="px-2 py-0.5 text-xs rounded border transition-colors"
                    style={(filtros.potenciais ?? []).includes(p)
                      ? "background-color:var(--brand-primary);color:white;border-color:var(--brand-primary);"
                      : "border-color:var(--border-base);color:var(--text-secondary);"}
                  >
                    {LABEL_POTENCIAL[p]}
                  </button>
                {/each}
              </div>
            </div>
            {#if especialidades.length}
              <div class="space-y-1.5">
                <label class="input-label" for="rel-especialidade">
                  Especialidade
                </label>
                <select
                  id="rel-especialidade"
                  bind:value={filtros.especialidadeId}
                  class="input-base"
                >
                  <option value="">Todas</option>
                  {#each especialidades as esp}
                    <option value={esp.id}>{esp.nome}</option>
                  {/each}
                </select>
              </div>
            {/if}
          </div>
        </div>

        {#if salvos.length}
          <div class="card-surface p-4">
            <p class="eyebrow-text mb-3">
              Salvos
            </p>
            <div class="space-y-1">
              {#each salvos as rel}
                <div class="flex items-center gap-1 group">
                  <button
                    onclick={() => carregarSalvo(rel)}
                    class="flex-1 text-left px-2 py-1.5 rounded text-muted-standard hover:bg-[rgb(var(--slate-50))] transition-colors truncate"
                  >
                    {rel.nome}
                  </button>
                  <button
                    onclick={() => excluirSalvo(rel.id)}
                    class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                    aria-label="Excluir relatório salvo"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="flex-1 min-w-0 space-y-4">
        <div class="card-surface p-4 flex items-center gap-3">
          <input
            bind:value={nomeRel}
            placeholder="Nome do relatório"
            class="input-base flex-1"
          />
          <button
            onclick={salvar}
            disabled={salvando}
            class="h-9 px-3 text-sm font-medium border border-[rgb(var(--slate-200))] rounded-lg bg-white text-[rgb(var(--slate-700))] hover:bg-[rgb(var(--slate-50))] transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save class="w-4 h-4" />Salvar
          </button>
          <div class="h-6 w-px bg-[rgb(var(--slate-200))]"></div>
          <button
            onclick={executar}
            disabled={carregando}
            style="background-color:var(--brand-primary);border-radius:var(--radius);"
            class="h-9 px-4 text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {#if carregando}
              <RefreshCw class="w-4 h-4 animate-spin" />Gerando...
            {:else}
              <BarChart2 class="w-4 h-4" />Gerar Prévia
            {/if}
          </button>
          <button
            onclick={() => exportar("csv")}
            disabled={!resultado || exportando !== null}
            class="h-9 px-3 text-sm font-medium border border-[rgb(var(--slate-200))] rounded-lg bg-white text-[rgb(var(--slate-700))] hover:bg-[rgb(var(--slate-50))] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download class="w-4 h-4" />CSV
          </button>
          <button
            onclick={() => exportar("pdf")}
            disabled={!resultado || exportando !== null}
            class="h-9 px-3 text-sm font-medium border border-[rgb(var(--slate-200))] rounded-lg bg-white text-[rgb(var(--slate-700))] hover:bg-[rgb(var(--slate-50))] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download class="w-4 h-4" />PDF
          </button>
        </div>

        {#if erro}
          <div class="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <X class="w-4 h-4 flex-shrink-0" />{erro}
          </div>
        {/if}

        {#if !resultado && !carregando}
          <div class="card-surface flex flex-col items-center justify-center py-20 text-center">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style="background-color:var(--brand-light);"
            >
              <BarChart2 class="w-6 h-6" style="color:var(--brand-primary);" />
            </div>
            <p class="table-cell-primary mb-1">Nenhum dado ainda</p>
            <p class="text-muted-standard">
              Selecione o tipo, configure as colunas e clique em "Gerar Prévia"
            </p>
          </div>
        {:else if resultado}
          <div class="table-shell">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p class="table-cell-primary">
                Prévia
                <span class="table-cell-secondary ml-1">
                  ({resultado.total} registro{resultado.total !== 1 ? "s" : ""})
                </span>
              </p>
              {#if resultado.total >= 500}
                <span class="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Limitado a 500 registros
                </span>
              {/if}
            </div>
            <div class="overflow-x-auto">
              <table class="data-table">
                <thead>
                  <tr>
                    {#each resultado.colunas as col}
                      <th class="table-head-cell text-left whitespace-nowrap">
                        {labelColuna(col)}
                      </th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each resultado.linhas as linha}
                    <tr class="hover:bg-[rgb(var(--slate-50))] transition-colors">
                      {#each resultado.colunas as col}
                        <td class="table-cell whitespace-nowrap">
                          {linha[col] ?? "—"}
                        </td>
                      {/each}
                    </tr>
                  {/each}
                  {#if resultado.linhas.length === 0}
                    <tr>
                      <td
                        colspan={resultado.colunas.length}
                        class="px-4 py-12 table-cell-empty text-center"
                      >
                        Nenhum registro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  {/if}
                </tbody>
              </table>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
