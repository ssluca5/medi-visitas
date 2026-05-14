<script lang="ts">
  import { onMount } from "svelte";
  import { apiFetch } from "$lib/api";
  import Button from "$lib/components/ui/Button.svelte";
  import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
  import {
    ArrowRight,
    BarChart2,
    Bookmark,
    CalendarCheck,
    CalendarDays,
    Check,
    Clock3,
    Columns3,
    Download,
    FileText,
    Filter,
    LayoutGrid,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    PieChart,
    Plus,
    RefreshCw,
    Save,
    Search,
    Star,
    Trash2,
    TrendingUp,
    Users,
    X,
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

  interface TemplateRelatorio {
    id: string;
    tipo: Tipo;
    titulo: string;
    descricao: string;
    favorito: boolean;
    icon: typeof CalendarDays;
    tone: "brand" | "ai" | "success" | "trial";
    colunas: string[];
    filtros?: Filtros;
    salvoId?: string;
  }

  const REPORT_TEMPLATES: TemplateRelatorio[] = [
    {
      id: "template-visitas-mes",
      tipo: "visitas",
      titulo: "Visitas do mês",
      descricao: "Todas as visitas realizadas no período, por profissional.",
      favorito: true,
      icon: CalendarDays,
      tone: "brand",
      colunas: ["profissional", "dataVisita", "status", "especialidade", "duracaoMinutos"],
    },
    {
      id: "template-conversao-pipeline",
      tipo: "pipeline",
      titulo: "Conversão por Pipeline",
      descricao: "Funil de prospectado a prescritor, com taxa de conversão.",
      favorito: false,
      icon: TrendingUp,
      tone: "ai",
      colunas: ["profissional", "especialidade", "estagioAtual", "dataTransicao", "diasNoEstagio"],
    },
    {
      id: "template-performance-equipe",
      tipo: "profissionais",
      titulo: "Performance da Equipe",
      descricao: "Carteira de profissionais, potencial e estágio atual.",
      favorito: false,
      icon: Users,
      tone: "success",
      colunas: ["nome", "especialidade", "potencial", "estagioPipeline", "ultimaVisita"],
    },
    {
      id: "template-distribuicao-amostras",
      tipo: "visitas",
      titulo: "Distribuição de Amostras",
      descricao: "Amostras e materiais entregues por produto e especialidade.",
      favorito: false,
      icon: Package,
      tone: "trial",
      colunas: ["profissional", "dataVisita", "especialidade", "materiais", "status"],
    },
  ];

  const COLUNAS_DISPONIVEIS: Record<Tipo, { value: string; label: string }[]> = {
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

  const ESTAGIO_OPCOES = [
    { value: "PROSPECTADO", label: "Prospectado", active: "seg-active-blue" },
    { value: "VISITADO", label: "Visitado", active: "seg-active-sky" },
    { value: "INTERESSADO", label: "Interessado", active: "seg-active-amber" },
    { value: "PRESCRITOR", label: "Prescritor", active: "seg-active-emerald" },
    { value: "FIDELIZADO", label: "Fidelizado", active: "seg-active-indigo" },
  ];
  const POTENCIAL_OPCOES = [
    { value: "FORTE", label: "Forte", active: "seg-active-emerald" },
    { value: "INTERMEDIARIO", label: "Intermediário", active: "seg-active-amber" },
    { value: "FRACO", label: "Fraco", active: "seg-active-rose" },
  ];
  const LABEL_POTENCIAL: Record<string, string> = {
    FORTE: "Forte",
    INTERMEDIARIO: "Intermediário",
    FRACO: "Fraco",
    NAO_DEFINIDO: "Não definida",
  };
  const LABEL_TIPO: Record<Tipo, string> = {
    visitas: "Visitas",
    profissionais: "Profissionais",
    pipeline: "Pipeline",
  };

  let tipo = $state<Tipo>("visitas");
  let filtros = $state<Filtros>({});
  let colunaSel = $state<string[]>(["profissional", "dataVisita", "status", "especialidade", "duracaoMinutos"]);
  let nomeRel = $state("");
  let buscaTemplate = $state("");
  let somenteFavoritos = $state(false);
  let favoritos = $state<string[]>(["template-visitas-mes"]);
  let salvos = $state<RelatorioSalvo[]>([]);
  let resultado = $state<ResultadoPrevia | null>(null);
  let carregando = $state(false);
  let salvando = $state(false);
  let excluindo = $state(false);
  let exportando = $state<"csv" | "pdf" | null>(null);
  let erro = $state("");
  let mostrarColunas = $state(false);
  let mostrarHistorico = $state(false);
  let painelEsquerdoRecolhido = $state(false);
  let relatorioParaExcluir = $state<RelatorioSalvo | null>(null);
  let especialidades = $state<{ id: string; nome: string }[]>([]);

  let colunasDisponiveis = $derived(COLUNAS_DISPONIVEIS[tipo]);
  let templatesDisponiveis = $derived([
    ...REPORT_TEMPLATES.map((template) => ({
      ...template,
      favorito: favoritos.includes(template.id),
    })),
    ...salvos.map((salvo) => {
      const id = `salvo-${salvo.id}`;
      return {
        id,
        tipo: salvo.tipo,
        titulo: salvo.nome,
        descricao: descreverRelatorioSalvo(salvo),
        favorito: favoritos.includes(id),
        icon: Bookmark,
        tone: "brand" as const,
        colunas: salvo.config.colunas,
        filtros: salvo.config.filtros ?? {},
        salvoId: salvo.id,
      };
    }),
  ]);
  let totalFavoritos = $derived(templatesDisponiveis.filter((template) => template.favorito).length);
  let mesReferencia = $derived(
    new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date()),
  );
  let templateAtual = $derived(
    templatesDisponiveis.find((template) => template.tipo === tipo && arraysIguais(template.colunas, colunaSel)) ??
      templatesDisponiveis.find((template) => template.tipo === tipo) ??
      templatesDisponiveis[0],
  );
  let templatesFiltrados = $derived(
    templatesDisponiveis.filter((template) => {
      const termo = buscaTemplate.trim().toLowerCase();
      const correspondeBusca = !termo || `${template.titulo} ${template.descricao}`.toLowerCase().includes(termo);
      return correspondeBusca && (!somenteFavoritos || template.favorito);
    }),
  );
  let filtrosAtivos = $derived(contarFiltros(filtros));
  let metricas = $derived(calcularMetricas(resultado));
  let barras = $derived(criarBarras(resultado));
  let distribuicao = $derived(criarDistribuicao(resultado));
  let doughnutStyle = $derived(criarDoughnut(distribuicao));
  let linhasVisiveis = $derived(resultado?.linhas.slice(0, 7) ?? []);
  let tituloPreview = $derived(resultado ? templateAtual.titulo : "Pronto para gerar");

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

  function selecionarTemplate(template: TemplateRelatorio) {
    tipo = template.tipo;
    colunaSel = [...template.colunas];
    filtros = { ...(template.filtros ?? {}) };
    nomeRel = template.salvoId ? template.titulo : "";
    resultado = null;
    erro = "";
  }

  function novoDoZero() {
    tipo = "visitas";
    filtros = {};
    colunaSel = ["profissional", "dataVisita", "status"];
    nomeRel = "";
    buscaTemplate = "";
    somenteFavoritos = false;
    mostrarColunas = true;
    mostrarHistorico = false;
    painelEsquerdoRecolhido = false;
    resultado = null;
    erro = "";
  }

  function toggleColuna(valor: string) {
    colunaSel = colunaSel.includes(valor)
      ? colunaSel.filter((coluna) => coluna !== valor)
      : [...colunaSel, valor];
    resultado = null;
  }

  function toggleMulti(lista: string[], valor: string): string[] {
    return lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];
  }

  function atualizarEstagio(estagio: string) {
    filtros.estagios = toggleMulti(filtros.estagios ?? [], estagio);
    resultado = null;
  }

  function atualizarPotencial(potencial: string) {
    filtros.potenciais = toggleMulti(filtros.potenciais ?? [], potencial);
    resultado = null;
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
        salvarTemplateLocalmente(nomeRel.trim());
        return;
      }

      const salvo = await res.json();
      salvos = [salvo, ...salvos.filter((item) => item.id !== salvo.id)];
      nomeRel = "";
      mostrarHistorico = true;
    } catch {
      salvarTemplateLocalmente(nomeRel.trim());
    } finally {
      salvando = false;
    }
  }

  function salvarTemplateLocalmente(nome: string) {
    const salvo: RelatorioSalvo = {
      id: `local-${Date.now()}`,
      nome,
      tipo,
      config: { colunas: [...colunaSel], filtros: { ...filtros } },
      updatedAt: new Date().toISOString(),
    };
    salvos = [salvo, ...salvos];
    nomeRel = "";
    erro = "";
    mostrarHistorico = true;
  }

  async function confirmarExclusao() {
    if (!relatorioParaExcluir) return;

    const id = relatorioParaExcluir.id;
    excluindo = true;
    try {
      if (!id.startsWith("local-")) {
        const res = await apiFetch(`/relatorios/configuracoes/${id}`, data.sessionToken, {
          method: "DELETE",
        });

        if (!res.ok) {
          erro = "Erro ao excluir relatório salvo.";
          return;
        }
      }

      salvos = salvos.filter((salvo) => salvo.id !== id);
      favoritos = favoritos.filter((favoritoId) => favoritoId !== `salvo-${id}`);
      if (!salvos.length) {
        mostrarHistorico = false;
      }
      relatorioParaExcluir = null;
      erro = "";
    } catch {
      erro = "Erro de conexão.";
    } finally {
      excluindo = false;
    }
  }

  function carregarSalvo(relatorio: RelatorioSalvo) {
    tipo = relatorio.tipo;
    colunaSel = relatorio.config.colunas;
    filtros = relatorio.config.filtros ?? {};
    nomeRel = relatorio.nome;
    resultado = null;
    erro = "";
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
        config: encodeURIComponent(JSON.stringify({ colunas: colunaSel, filtros })),
      });
      const res = await apiFetch(`/relatorios/exportar?${params}`, data.sessionToken);

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

  function abrirHistorico() {
    painelEsquerdoRecolhido = false;
    mostrarHistorico = !mostrarHistorico;
    mostrarColunas = false;
  }

  function abrirFiltros() {
    painelEsquerdoRecolhido = false;
    mostrarColunas = false;
  }

  function abrirColunas() {
    painelEsquerdoRecolhido = false;
    mostrarColunas = true;
  }

  function toggleFavorito(template: TemplateRelatorio, event: MouseEvent) {
    event.stopPropagation();
    favoritos = favoritos.includes(template.id)
      ? favoritos.filter((id) => id !== template.id)
      : [...favoritos, template.id];
  }

  function descreverRelatorioSalvo(relatorio: RelatorioSalvo): string {
    const totalColunas = relatorio.config.colunas.length;
    const totalFiltros = contarFiltros(relatorio.config.filtros ?? {});
    return `${LABEL_TIPO[relatorio.tipo]} personalizado com ${totalColunas} coluna${totalColunas !== 1 ? "s" : ""} e ${totalFiltros} filtro${totalFiltros !== 1 ? "s" : ""}.`;
  }

  function labelColuna(valor: string): string {
    return colunasDisponiveis.find((coluna) => coluna.value === valor)?.label ?? valor;
  }

  function arraysIguais(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((item) => b.includes(item));
  }

  function contarFiltros(ativos: Filtros): number {
    return [
      ativos.dataInicio,
      ativos.dataFim,
      ativos.especialidadeId,
      ...(ativos.estagios ?? []),
      ...(ativos.potenciais ?? []),
    ].filter(Boolean).length;
  }

  function valorTexto(valor: unknown): string {
    return String(valor ?? "—");
  }

  function normalizarEnum(valor: unknown): string {
    return valorTexto(valor)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letra) => letra.toUpperCase());
  }

  function formatarValor(coluna: string, valor: unknown): string {
    if (valor === null || valor === undefined || valor === "") return "—";
    if (coluna.toLowerCase().includes("estagio")) return normalizarEnum(valor);
    if (coluna === "status") return normalizarEnum(valor);
    if (coluna === "potencial") return LABEL_POTENCIAL[valorTexto(valor)] ?? normalizarEnum(valor);
    return valorTexto(valor);
  }

  function statusClass(valor: unknown): string {
    const status = valorTexto(valor).toUpperCase();
    if (status.includes("CANCEL") || status.includes("REAGEND")) {
      return "bg-[var(--trial-bg)] text-[var(--trial-text)]";
    }
    if (status === "—") return "bg-[rgb(var(--slate-100))] text-ui-secondary";
    return "bg-[var(--success-bg)] text-[var(--success-text)]";
  }

  function estagioClass(valor: unknown): string {
    const estagio = valorTexto(valor).toUpperCase();
    if (estagio.includes("PROSPECT")) return "bg-[var(--trial-bg)] text-[var(--trial-text)]";
    if (estagio.includes("INTERESS")) return "bg-violet-50 text-[var(--ai-primary)]";
    if (estagio.includes("PRESCR") || estagio.includes("FIDEL")) return "bg-[var(--success-bg)] text-[var(--success-text)]";
    return "bg-[var(--brand-light)] text-[var(--brand-dark)]";
  }

  function badgeEhEnum(coluna: string): boolean {
    return coluna === "status" || coluna.toLowerCase().includes("estagio");
  }

  function calcularMetricas(preview: ResultadoPrevia | null) {
    const linhas = preview?.linhas ?? [];
    const total = preview?.total ?? 0;
    const profissionais = new Set(
      linhas.map((linha) => valorTexto(linha.profissional ?? linha.nome)).filter((valor) => valor !== "—"),
    ).size;
    const prescritores = linhas.filter((linha) =>
      valorTexto(linha.estagioPipeline ?? linha.estagioAtual).toUpperCase().includes("PRESCR"),
    ).length;
    const duracoes = linhas
      .map((linha) => Number(linha.duracaoMinutos))
      .filter((valor) => Number.isFinite(valor) && valor > 0);
    const media = duracoes.length
      ? Math.round(duracoes.reduce((soma, valor) => soma + valor, 0) / duracoes.length)
      : 0;

    return [
      {
        label: tipo === "profissionais" ? "Profissionais" : "Total de registros",
        value: total ? String(total) : "—",
        delta: total ? "Pronto para exportar" : "Gere uma prévia",
        trend: "up",
      },
      {
        label: "Profissionais",
        value: profissionais ? String(profissionais) : "—",
        delta: profissionais ? "Carteira filtrada" : "Sem dados",
        trend: "up",
      },
      {
        label: "Taxa de prescrição",
        value: total ? `${Math.round((prescritores / total) * 100)}%` : "—",
        delta: total ? `${prescritores} prescritor(es)` : "Aguardando",
        trend: "up",
      },
      {
        label: "Tempo médio",
        value: media ? `${media}m` : "—",
        delta: media ? "Visitas com duração" : "Sem duração",
        trend: media ? "down" : "neutral",
      },
    ];
  }

  function chaveAgrupamento(linha: Record<string, string | number>, indice: number): string {
    const dataLinha = valorTexto(linha.dataVisita ?? linha.dataTransicao ?? linha.ultimaVisita);
    if (dataLinha !== "—" && dataLinha.length >= 10) return dataLinha.slice(5);
    return `L${(indice % 8) + 1}`;
  }

  function criarBarras(preview: ResultadoPrevia | null) {
    const linhas = preview?.linhas ?? [];
    const agrupado = new Map<string, number>();

    linhas.forEach((linha, indice) => {
      const chave = chaveAgrupamento(linha, indice);
      agrupado.set(chave, (agrupado.get(chave) ?? 0) + 1);
    });

    const entries = Array.from(agrupado.entries()).slice(0, 12);
    const max = Math.max(...entries.map(([, valor]) => valor), 1);
    return entries.map(([label, valor], indice) => ({
      label,
      value: valor,
      height: `${Math.max(8, (valor / max) * 100)}%`,
      destaque: indice === Math.min(4, entries.length - 1),
    }));
  }

  function criarDistribuicao(preview: ResultadoPrevia | null) {
    const linhas = preview?.linhas ?? [];
    const agrupado = new Map<string, number>();

    linhas.forEach((linha) => {
      const chave = valorTexto(linha.especialidade ?? linha.potencial ?? linha.status);
      if (chave !== "—") agrupado.set(chave, (agrupado.get(chave) ?? 0) + 1);
    });

    return Array.from(agrupado.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));
  }

  function criarDoughnut(items: { label: string; value: number }[]): string {
    const total = items.reduce((soma, item) => soma + item.value, 0);
    const cores = ["var(--brand-primary)", "var(--ai-primary)", "var(--status-ativo)", "var(--trial-text)", "var(--text-primary)"];
    if (!total) return "background: conic-gradient(var(--border-base) 0deg 360deg);";

    let inicio = 0;
    const segmentos = items.map((item, indice) => {
      const fim = inicio + (item.value / total) * 360;
      const segmento = `${cores[indice % cores.length]} ${inicio}deg ${fim}deg`;
      inicio = fim;
      return segmento;
    });

    return `background: conic-gradient(${segmentos.join(", ")});`;
  }

  function toneClass(tone: TemplateRelatorio["tone"]): string {
    const classes = {
      brand: "bg-[var(--brand-primary)] text-white",
      ai: "bg-violet-100 text-[var(--ai-primary)]",
      success: "bg-[var(--success-bg)] text-[var(--success-text)]",
      trial: "bg-[var(--trial-bg)] text-[var(--trial-text)]",
    };
    return classes[tone];
  }

  function dataAtualizacao(): string {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  }
</script>

<svelte:head>
  <title>Relatórios — MediVisitas</title>
</svelte:head>



<div class="reports-shell">
  <header class="reports-header">
    <div class="flex min-w-0 items-center gap-4">
      <div class="page-header-icon h-12 w-12 rounded-xl">
        <FileText class="h-5 w-5 text-white" />
      </div>
      <div class="min-w-0">
        <h1 class="page-title">Relatórios</h1>
        <p class="page-description">Crie, filtre e exporte relatórios personalizados.</p>
      </div>
    </div>

    <div class="reports-actions">
      <Button
        variant="outline"
        size="sm"
        onclick={abrirHistorico}
        disabled={!salvos.length}
        aria-pressed={mostrarHistorico}
      >
        <Clock3 class="h-4 w-4" />
        {mostrarHistorico ? "Ocultar histórico" : "Histórico"}
      </Button>
      <Button variant="outline" size="sm" onclick={() => (somenteFavoritos = !somenteFavoritos)}>
        <Bookmark class="h-4 w-4" />
        Favoritos · {totalFavoritos}
      </Button>
      <Button size="sm" onclick={novoDoZero}>
        <Plus class="h-4 w-4" />
        Novo do zero
      </Button>
    </div>
  </header>

  <section class:workspace-collapsed={painelEsquerdoRecolhido} class="reports-workspace">
    <aside class:builder-collapsed={painelEsquerdoRecolhido} class="reports-builder" aria-label="Configuração do relatório">
      {#if painelEsquerdoRecolhido}
        <div class="collapsed-rail">
          <button
            type="button"
            class="collapse-toggle"
            onclick={() => (painelEsquerdoRecolhido = false)}
            aria-label="Expandir templates e filtros"
            title="Expandir painel"
          >
            <PanelLeftOpen class="h-4 w-4" />
          </button>
          <span>Templates</span>
        </div>
      {:else}
      <div class="builder-scroll">
        <div class="builder-section-header">
          <div class="flex items-center gap-2">
            <h2 class="section-title">Templates</h2>
            <span class="count-pill">{templatesDisponiveis.length}</span>
          </div>
          <div class="builder-header-tools">
            <div class="search-control">
              <Search class="h-4 w-4 text-ui-muted" />
              <input bind:value={buscaTemplate} placeholder="Buscar..." aria-label="Buscar template" />
            </div>
            <button
              type="button"
              class="collapse-toggle"
              onclick={() => (painelEsquerdoRecolhido = true)}
              aria-label="Recolher templates e filtros"
              title="Recolher painel"
            >
              <PanelLeftClose class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="template-grid">
          {#each templatesFiltrados as template}
            {@const Icon = template.icon}
            {@const selecionado = templateAtual.titulo === template.titulo}
            <div
              class:selected-template={selecionado}
              class="template-card"
              onclick={() => selecionarTemplate(template)}
              onkeydown={(event) => {
                if (event.key === "Enter" || event.key === " ") selecionarTemplate(template);
              }}
              role="button"
              tabindex="0"
              aria-pressed={selecionado}
            >
              <button
                type="button"
                class:favorite-active={template.favorito}
                class="template-favorite"
                onclick={(event) => toggleFavorito(template, event)}
                aria-label={template.favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Star class="h-4 w-4" />
              </button>
              <span class="template-icon {toneClass(template.tone)}">
                <Icon class="h-5 w-5" />
              </span>
              <span class="template-title">{template.titulo}</span>
              <span class="template-description">{template.descricao}</span>
              <span class="template-footer">
                <span class="template-select">
                  {#if selecionado}
                    Selecionado <Check class="h-3.5 w-3.5" />
                  {:else}
                    Selecionar <ArrowRight class="h-3.5 w-3.5" />
                  {/if}
                </span>
              </span>
            </div>
          {/each}
        </div>

        <div class="quick-filters">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <Filter class="h-4 w-4 text-[var(--text-primary)]" />
              <h2 class="section-title">Filtros rápidos</h2>
              {#if filtrosAtivos}
                <span class="count-pill">{filtrosAtivos}</span>
              {/if}
            </div>
            <button class="advanced-link" type="button" onclick={() => (mostrarColunas = !mostrarColunas)}>
              Colunas
              <Columns3 class="h-4 w-4" />
            </button>
          </div>

          <div class="filter-grid">
            <label class="field-control">
              <span>Período inicial</span>
              <input class="input-base report-input" type="date" bind:value={filtros.dataInicio} />
            </label>
            <label class="field-control">
              <span>Período final</span>
              <input class="input-base report-input" type="date" bind:value={filtros.dataFim} />
            </label>
            <label class="field-control md:col-span-2">
              <span>Especialidade</span>
              <select class="input-base report-input" bind:value={filtros.especialidadeId}>
                <option value="">Todas as especialidades</option>
                {#each especialidades as especialidade}
                  <option value={especialidade.id}>{especialidade.nome}</option>
                {/each}
              </select>
            </label>
          </div>

          <!-- Estágio Pipeline -->
          <div class="field-control mt-5 pt-5 border-t border-[rgb(var(--slate-100))]">
            <span>Estágio Pipeline</span>
            <div class="rounded-lg border border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))] p-1 space-y-1">
              <div class="grid grid-cols-3 gap-1" role="group" aria-label="Estágio no pipeline linha 1">
                {#each ESTAGIO_OPCOES.slice(0, 3) as opt}
                  <button
                    type="button"
                    class="segmented-btn flex-1 {(filtros.estagios ?? []).includes(opt.value) ? opt.active : ''}"
                    onclick={() => atualizarEstagio(opt.value)}
                  >
                    {opt.label}
                  </button>
                {/each}
              </div>
              <div class="grid grid-cols-2 gap-1" role="group" aria-label="Estágio no pipeline linha 2">
                {#each ESTAGIO_OPCOES.slice(3) as opt}
                  <button
                    type="button"
                    class="segmented-btn flex-1 {(filtros.estagios ?? []).includes(opt.value) ? opt.active : ''}"
                    onclick={() => atualizarEstagio(opt.value)}
                  >
                    {opt.label}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- Classificação do relacionamento (antigo Potencial) -->
          <div class="field-control mt-5">
            <span>Classificação do relacionamento</span>
            <div class="rounded-lg border border-[rgb(var(--slate-200))] bg-[rgb(var(--slate-50))] p-1">
              <div class="grid grid-cols-3 gap-1" role="group" aria-label="Classificação do relacionamento">
                {#each POTENCIAL_OPCOES as opt}
                  <button
                    type="button"
                    class="segmented-btn col-span-1 {(filtros.potenciais ?? []).includes(opt.value) ? opt.active : ''}"
                    onclick={() => atualizarPotencial(opt.value)}
                  >
                    {opt.label}
                  </button>
                {/each}
                <button
                  type="button"
                  class="segmented-btn col-span-3 {(filtros.potenciais ?? []).includes('NAO_DEFINIDO') ? 'seg-active-slate' : ''}"
                  onclick={() => atualizarPotencial('NAO_DEFINIDO')}
                >
                  Não definida
                </button>
              </div>
            </div>
          </div>

          {#if mostrarColunas}
            <div class="columns-panel">
              {#each colunasDisponiveis as coluna}
                <label class="column-option">
                  <input
                    type="checkbox"
                    checked={colunaSel.includes(coluna.value)}
                    onchange={() => toggleColuna(coluna.value)}
                  />
                  <span>{coluna.label}</span>
                </label>
              {/each}
            </div>
          {/if}

          <div class="save-row">
            <label class="field-control">
              <span>Nome do relatório</span>
              <input class="input-base report-input" bind:value={nomeRel} placeholder="Ex: Visitas do mês" />
            </label>
            <Button variant="outline" onclick={salvar} disabled={salvando}>
              <Save class="h-4 w-4" />
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        {#if salvos.length && mostrarHistorico}
          <div class="saved-panel">
            <div class="flex items-center justify-between gap-3">
              <h2 class="section-title">Histórico salvo</h2>
              <span class="count-pill">{salvos.length}</span>
            </div>
            <div class="space-y-1.5">
              {#each salvos.slice(0, 5) as salvo}
                <div class="saved-item">
                  <button type="button" onclick={() => carregarSalvo(salvo)}>
                    <span>{salvo.nome}</span>
                    <small>{LABEL_TIPO[salvo.tipo]}</small>
                  </button>
                  <button
                    type="button"
                    class="delete-saved"
                    onclick={() => (relatorioParaExcluir = salvo)}
                    aria-label="Excluir relatório salvo"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="builder-footer">
        <Button onclick={executar} disabled={carregando} class="w-full">
          {#if carregando}
            <RefreshCw class="h-4 w-4 animate-spin" />
            Gerando prévia...
          {:else}
            <BarChart2 class="h-4 w-4" />
            Gerar prévia
          {/if}
        </Button>
      </div>
      {/if}
    </aside>

    <main class="reports-preview" aria-label="Pré-visualização do relatório">
      <div class="preview-scroll">
        <div class="preview-topbar">
          <div class="min-w-0">
            <p class="eyebrow-text">Pré-visualização</p>
            <h2 class="preview-title">
              {tituloPreview}
              {#if tipo === "visitas"}
                <span>· {mesReferencia}</span>
              {/if}
            </h2>
            <p class="preview-subtitle">
              {#if resultado}
                Atualizado em {dataAtualizacao()} · {resultado.total} registro{resultado.total !== 1 ? "s" : ""}
              {:else}
                Selecione filtros e gere uma prévia para liberar exportação
              {/if}
            </p>
          </div>

          <div class="preview-actions">
            <Button variant="outline" size="sm" onclick={() => exportar("pdf")} disabled={!resultado || exportando !== null}>
              {#if exportando === "pdf"}
                <RefreshCw class="h-4 w-4 animate-spin" />
              {:else}
                <FileText class="h-4 w-4" />
              {/if}
              PDF
            </Button>
            <Button size="sm" onclick={() => exportar("csv")} disabled={!resultado || exportando !== null}>
              {#if exportando === "csv"}
                <RefreshCw class="h-4 w-4 animate-spin" />
              {:else}
                <Download class="h-4 w-4" />
              {/if}
              Exportar
            </Button>
          </div>
        </div>

        {#if erro}
          <div class="error-banner">
            <X class="h-4 w-4" />
            {erro}
          </div>
        {/if}

        <div class="metric-grid">
          {#each metricas as metrica}
            <article class="metric-card">
              <p>{metrica.label}</p>
              <strong>{metrica.value}</strong>
              <span class:negative-trend={metrica.trend === "down"}>{metrica.delta}</span>
            </article>
          {/each}
        </div>

        <div class="charts-grid">
          <article class="chart-card chart-card-wide">
            <div class="chart-header">
              <h3 class="section-title">{tipo === "pipeline" ? "Transições por período" : "Registros por período"}</h3>
              <span class="count-pill">Diário</span>
            </div>

            {#if carregando}
              <div class="chart-empty">
                <RefreshCw class="h-5 w-5 animate-spin" />
                Processando dados...
              </div>
            {:else if barras.length}
              <div class="bar-chart" aria-label="Gráfico de barras">
                {#each barras as barra}
                  <div class="bar-column">
                    <span class:highlight-bar={barra.destaque} class="bar" style={`height: ${barra.height};`}>
                      <small>{barra.value}</small>
                    </span>
                    <em>{barra.label}</em>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="chart-empty">
                <LayoutGrid class="h-5 w-5" />
                Aguardando prévia
              </div>
            {/if}
          </article>

          <article class="chart-card">
            <div class="chart-header">
              <h3 class="section-title">Por especialidade</h3>
              <PieChart class="h-4 w-4 text-ui-muted" />
            </div>

            {#if distribuicao.length}
              <div class="distribution-layout">
                <div class="doughnut" style={doughnutStyle}>
                  <span></span>
                </div>
                <div class="legend-list">
                  {#each distribuicao as item, index}
                    <div class="legend-item">
                      <span class={`legend-dot legend-dot-${index}`}></span>
                      <p>{item.label}</p>
                      <strong>{item.value}</strong>
                    </div>
                  {/each}
                </div>
              </div>
            {:else}
              <div class="chart-empty">
                <PieChart class="h-5 w-5" />
                Sem agrupamento
              </div>
            {/if}
          </article>
        </div>

        <article class="detail-card">
          <div class="detail-header">
            <div class="flex items-center gap-2">
              <h3 class="section-title">Detalhamento</h3>
              <span class="count-pill">{linhasVisiveis.length} de {resultado?.total ?? 0}</span>
            </div>
            <div class="detail-tools">
              <button type="button" onclick={abrirFiltros}>
                <Filter class="h-4 w-4" />
                Filtrar
              </button>
              <button type="button" onclick={abrirColunas}>
                <Columns3 class="h-4 w-4" />
                Colunas
              </button>
            </div>
          </div>

          {#if carregando}
            <div class="table-state">
              <RefreshCw class="h-6 w-6 animate-spin text-[var(--brand-primary)]" />
              Gerando linhas do relatório...
            </div>
          {:else if resultado}
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    {#each resultado.colunas as coluna}
                      <th>{labelColuna(coluna)}</th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each linhasVisiveis as linha}
                    <tr>
                      {#each resultado.colunas as coluna}
                        {@const valor = linha[coluna] ?? "—"}
                        <td>
                          {#if badgeEhEnum(coluna)}
                            <span class="table-badge {coluna === 'status' ? statusClass(valor) : estagioClass(valor)}">
                              {formatarValor(coluna, valor)}
                            </span>
                          {:else}
                            {formatarValor(coluna, valor)}
                          {/if}
                        </td>
                      {/each}
                    </tr>
                  {/each}
                  {#if resultado.linhas.length === 0}
                    <tr>
                      <td colspan={resultado.colunas.length} class="empty-cell">
                        Nenhum registro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  {/if}
                </tbody>
              </table>
            </div>
          {:else}
            <div class="table-state">
              <CalendarCheck class="h-6 w-6 text-[var(--brand-primary)]" />
              A prévia aparecerá aqui depois da geração.
            </div>
          {/if}
        </article>
      </div>
    </main>
  </section>
</div>

<ConfirmDialog
  open={relatorioParaExcluir !== null}
  onclose={() => (relatorioParaExcluir = null)}
  title="Excluir relatório salvo"
  confirmLabel="Excluir"
  onconfirm={confirmarExclusao}
  loading={excluindo}
  variant="danger"
>
  {#snippet description()}
    {#if relatorioParaExcluir}
      <p>O relatório salvo <strong>"{relatorioParaExcluir.nome}"</strong> será removido da sua lista.</p>
      <p>Esta ação não pode ser desfeita.</p>
    {/if}
  {/snippet}
</ConfirmDialog>

<style>
  .reports-shell {
    min-height: calc(100vh - 4rem);
    max-width: 100%;
    overflow-x: clip;
    color: var(--text-primary);
  }

  .reports-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: -0.5rem -0.5rem 0;
    padding: 0.5rem 0.5rem 1.5rem;
  }

  .reports-actions,
  .preview-actions,
  .detail-tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .reports-shell :global(button) {
    cursor: pointer;
  }

  .reports-shell :global(button:disabled) {
    cursor: not-allowed;
  }

  .reports-actions :global(button),
  .preview-actions :global(button),
  .builder-footer :global(button),
  .save-row :global(button),
  .detail-tools button,
  .advanced-link,
  .template-select,
  .collapse-toggle,
  .chart-empty,
  .table-state {
    gap: 0.625rem;
  }

  .reports-workspace {
    display: flex;
    flex-direction: row;
    min-width: 0;
    min-height: calc(100vh - 10.5rem);
    overflow: hidden;
    border: 1px solid var(--border-base);
    border-radius: 12px;
    background: var(--bg-surface);
  }

  .reports-builder {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    min-width: 0;
    width: 24rem;
    border-right: 1px solid var(--border-base);
    background: color-mix(in srgb, var(--bg-primary) 72%, var(--bg-surface));
    transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms cubic-bezier(0.4, 0, 0.2, 1);
    overflow-x: hidden;
  }

  .builder-collapsed {
    width: 4.5rem;
    background: var(--bg-surface);
  }

  .collapsed-rail {
    display: flex;
    height: 100%;
    min-height: 28rem;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0.75rem;
  }

  .collapsed-rail span {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    color: var(--text-muted);
    font-size: var(--font-size-small);
    font-weight: 600;
  }

  .builder-scroll,
  .preview-scroll {
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .builder-scroll {
    flex: 1;
    min-width: 0;
    padding: 1.75rem;
  }

  .builder-footer {
    border-top: 1px solid var(--border-base);
    background: var(--bg-surface);
    padding: 1rem 1.25rem;
  }

  .builder-section-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .builder-header-tools {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.6rem;
  }

  .collapse-toggle {
    display: inline-flex;
    height: 2.5rem;
    width: 2.5rem;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-base);
    border-radius: 12px;
    background: var(--bg-surface);
    color: var(--text-secondary);
    transition:
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;
  }

  .collapse-toggle:hover {
    border-color: rgb(var(--slate-300));
    background: rgb(var(--slate-50));
    color: var(--text-primary);
  }

  .count-pill {
    display: inline-flex;
    min-width: 1.75rem;
    height: 1.75rem;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgb(var(--slate-100));
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0 0.55rem;
  }

  .search-control {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    height: 2.5rem;
    min-width: 0;
    border: 1px solid var(--border-base);
    border-radius: 12px;
    background: var(--bg-surface);
    padding: 0 0.85rem;
  }

  .search-control input,
  .field-control input {
    width: 100%;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--text-primary);
    font-size: 0.875rem;
    outline: none;
  }

  .search-control input::placeholder,
  .field-control input::placeholder {
    color: var(--text-muted);
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .template-card {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 11.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.85rem;
    border: 1px solid var(--border-base);
    border-radius: 16px;
    background: var(--bg-surface);
    padding: 1.25rem;
    text-align: left;
    cursor: pointer;
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      transform 160ms ease;
  }

  .template-card:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--brand-primary) 42%, transparent);
    outline-offset: 2px;
  }

  .template-card:hover {
    transform: translateY(-1px);
    border-color: rgb(var(--slate-300));
    box-shadow: 0 12px 24px rgb(var(--slate-900) / 0.06);
  }

  .selected-template {
    border-color: var(--text-primary);
    box-shadow: inset 0 0 0 1px var(--text-primary);
  }

  .template-favorite {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    height: 1.85rem;
    width: 1.85rem;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: var(--text-muted);
    transition:
      background-color 160ms ease,
      color 160ms ease;
    z-index: 1;
  }

  .template-favorite:hover {
    background: rgb(var(--slate-100));
    color: var(--trial-text);
  }

  .template-favorite.favorite-active {
    color: var(--trial-text);
  }

  .template-favorite.favorite-active :global(svg) {
    fill: var(--trial-text);
  }

  .template-icon {
    display: inline-flex;
    height: 2.75rem;
    width: 2.75rem;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
  }

  .template-title {
    max-width: 100%;
    color: var(--text-primary);
    font-size: var(--font-size-body);
    font-weight: 600;
    line-height: var(--line-height-body);
  }

  .template-description {
    max-width: 100%;
    color: var(--text-secondary);
    font-size: var(--font-size-small);
    line-height: var(--line-height-small);
  }

  .template-footer {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: auto;
    color: var(--text-secondary);
    font-size: 0.8rem;
  }

  .template-select,
  .advanced-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--text-primary);
    font-weight: 600;
  }

  .quick-filters,
  .saved-panel {
    min-width: 0;
    margin-top: 1.5rem;
    border-radius: 16px;
    background: color-mix(in srgb, var(--bg-primary) 82%, var(--bg-surface));
    padding: 1.25rem;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
    margin-top: 1.25rem;
  }

  .field-control {
    display: grid;
    min-width: 0;
    gap: 0.45rem;
  }

  .field-control span {
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .field-control input,
  .field-control select {
    width: 100%;
    min-width: 0;
    height: 2.65rem;
    border: 1px solid var(--border-base);
    border-radius: 12px;
    background-color: var(--bg-surface);
    padding: 0 0.85rem;
    cursor: pointer;
  }

  .field-control input:not([type]) {
    cursor: text;
  }

  .field-control select.report-input {
    appearance: none;
    padding-right: 2.75rem;
    background-position: right 0.9rem center;
    background-repeat: no-repeat;
    background-size: 1rem;
  }

  .chip-group,
  .columns-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .filter-chip {
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: var(--text-primary);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.45rem 0.7rem;
    transition:
      background-color 160ms ease,
      border-color 160ms ease;
  }

  .filter-chip:hover,
  .chip-active {
    border-color: var(--border-base);
    background: var(--bg-surface);
  }

  .chip-active {
    color: var(--brand-primary);
  }

  .filter-group {
    margin-top: 1.25rem;
    border-top: 1px solid var(--border-base);
    padding-top: 1.25rem;
  }

  .report-segmented {
    margin-top: 0.55rem;
  }

  .columns-panel {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-width: 0;
    border-top: 1px solid var(--border-base);
    padding-top: 1rem;
  }

  .column-option {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    color: var(--text-secondary);
    font-size: 0.86rem;
    cursor: pointer;
  }

  .column-option input {
    accent-color: var(--brand-primary);
    cursor: pointer;
  }

  .save-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    min-width: 0;
    align-items: end;
    gap: 0.75rem;
    margin-top: 1.25rem;
  }

  .saved-panel {
    min-width: 0;
    background: var(--bg-surface);
    border: 1px solid var(--border-base);
  }

  .saved-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .saved-item > button:first-child {
    display: grid;
    min-width: 0;
    gap: 0.1rem;
    border-radius: 10px;
    padding: 0.65rem 0.75rem;
    text-align: left;
    cursor: pointer;
  }

  .saved-item > button:first-child:hover,
  .delete-saved:hover,
  .detail-tools button:hover {
    background: rgb(var(--slate-100));
  }

  .saved-item span {
    overflow: hidden;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .saved-item small {
    color: var(--text-secondary);
    font-size: 0.75rem;
  }

  .delete-saved {
    display: inline-flex;
    height: 2.25rem;
    width: 2.25rem;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: var(--danger);
    cursor: pointer;
  }

  .reports-preview {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    background: color-mix(in srgb, var(--bg-primary) 58%, var(--bg-surface));
  }

  .preview-scroll {
    height: 100%;
    min-width: 0;
    padding: 1.75rem;
  }

  .preview-topbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .preview-title {
    margin-top: 0.25rem;
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 2rem;
    letter-spacing: 0;
  }

  .preview-title span {
    color: var(--text-muted);
    font-style: italic;
    font-weight: 400;
  }

  .preview-subtitle {
    margin-top: 0.45rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    border: 1px solid var(--danger-border);
    border-radius: 12px;
    background: var(--danger-light);
    color: var(--danger);
    padding: 0.8rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.9rem;
    margin-top: 1.75rem;
  }

  .metric-card,
  .chart-card,
  .detail-card {
    border: 1px solid var(--border-base);
    border-radius: 16px;
    background: var(--bg-surface);
  }

  .metric-card {
    padding: 1.05rem 1.2rem;
  }

  .metric-card p {
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .metric-card strong {
    display: block;
    margin-top: 0.45rem;
    color: var(--text-primary);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 2rem;
  }

  .metric-card span {
    display: block;
    margin-top: 0.45rem;
    color: var(--success-text);
    font-size: 0.8rem;
    font-weight: 700;
  }

  .metric-card .negative-trend {
    color: var(--danger);
  }

  .charts-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 0.86fr);
    gap: 1rem;
    margin-top: 1rem;
  }

  .chart-card {
    min-height: 15.5rem;
    padding: 1.35rem;
  }

  .chart-header,
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .bar-chart {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    align-items: end;
    gap: 0.65rem;
    height: 10rem;
    margin-top: 1.4rem;
  }

  .bar-column {
    display: grid;
    height: 100%;
    min-width: 0;
    grid-template-rows: 1fr auto;
    align-items: end;
    justify-items: center;
    gap: 0.55rem;
  }

  .bar {
    position: relative;
    width: 100%;
    min-height: 0.5rem;
    border-radius: 8px 8px 2px 2px;
    background: var(--brand-primary);
  }

  .highlight-bar {
    background: var(--text-primary);
  }

  .bar small {
    position: absolute;
    top: -1.25rem;
    left: 50%;
    transform: translateX(-50%);
    color: var(--text-primary);
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 700;
  }

  .bar-column em {
    overflow: hidden;
    width: 100%;
    color: var(--text-muted);
    font-size: 0.75rem;
    font-style: normal;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chart-empty,
  .table-state {
    display: flex;
    min-height: 10rem;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .distribution-layout {
    display: grid;
    grid-template-columns: 8.5rem minmax(0, 1fr);
    align-items: center;
    gap: 1.25rem;
    margin-top: 1.35rem;
  }

  .doughnut {
    display: grid;
    height: 8.5rem;
    width: 8.5rem;
    place-items: center;
    border-radius: 999px;
  }

  .doughnut span {
    display: block;
    height: 4.9rem;
    width: 4.9rem;
    border-radius: 999px;
    background: var(--bg-surface);
  }

  .legend-list {
    display: grid;
    gap: 0.65rem;
  }

  .legend-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.6rem;
    color: var(--text-secondary);
    font-size: 0.86rem;
  }

  .legend-item p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .legend-item strong {
    color: var(--text-muted);
    font-weight: 600;
  }

  .legend-dot {
    height: 0.65rem;
    width: 0.65rem;
    border-radius: 3px;
    background: var(--text-primary);
  }

  .legend-dot-0 {
    background: var(--brand-primary);
  }

  .legend-dot-1 {
    background: var(--ai-primary);
  }

  .legend-dot-2 {
    background: var(--status-ativo);
  }

  .legend-dot-3 {
    background: var(--trial-text);
  }

  .detail-card {
    margin-top: 1rem;
    overflow: hidden;
  }

  .detail-header {
    padding: 1.15rem 1.35rem;
    border-bottom: 1px solid var(--border-base);
  }

  .detail-tools button {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border-radius: 10px;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 700;
    padding: 0.45rem 0.6rem;
    cursor: pointer;
  }

  .table-wrap {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 42rem;
  }

  th {
    background: color-mix(in srgb, var(--bg-primary) 82%, var(--bg-surface));
    color: var(--text-muted);
    font-size: 0.73rem;
    font-weight: 750;
    letter-spacing: 0;
    padding: 0.95rem 1.15rem;
    text-align: left;
    text-transform: uppercase;
    white-space: nowrap;
  }

  td {
    border-top: 1px solid var(--border-base);
    color: var(--text-body);
    font-size: 0.875rem;
    padding: 1rem 1.15rem;
    vertical-align: middle;
  }

  .table-badge {
    display: inline-flex;
    min-width: 5.5rem;
    justify-content: center;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.35rem 0.7rem;
  }

  .empty-cell {
    color: var(--text-secondary);
    padding: 4rem 1rem;
    text-align: center;
  }

  @media (max-width: 1280px) {
    .reports-workspace {
      grid-template-columns: minmax(21rem, 0.52fr) minmax(0, 1fr);
    }

    .reports-workspace.workspace-collapsed {
      grid-template-columns: 4.5rem minmax(0, 1fr);
    }

    .metric-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .charts-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 1024px) {
    .reports-header,
    .preview-topbar {
      align-items: stretch;
      flex-direction: column;
    }

    .reports-workspace {
      grid-template-columns: 1fr;
      overflow: visible;
    }

    .reports-builder {
      border-right: 0;
      border-bottom: 1px solid var(--border-base);
    }
  }

  @media (max-width: 720px) {
    .reports-workspace {
      border-radius: 0;
      margin-inline: 0;
    }

    .builder-scroll,
    .preview-scroll {
      padding: 1rem;
    }

    .builder-section-header,
    .template-grid,
    .filter-grid,
    .columns-panel,
    .save-row,
    .metric-grid,
    .distribution-layout {
      grid-template-columns: 1fr;
    }

    .bar-chart {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      height: 12rem;
    }

    table {
      min-width: 34rem;
    }
  }
</style>
