# Fase 7 — Pipeline Comercial + Analytics

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack frontend: **SvelteKit 2 + Svelte 5 Runes + Tailwind CSS v4**
> Pré-requisito: Fase 4 concluída (agenda inteligente funcionando)

---

## Objetivo da Fase

Implementar a visualização e gestão completa do pipeline comercial (funil de conversão de
profissionais) e o painel de analytics com métricas de desempenho do propagandista:

- Visualização do funil: `Prospectado → Visitado → Interessado → Prescritor → Fidelizado`
- Movimentação de profissionais entre estágios com registro imutável em `EstagioLog`
- Métricas consolidadas: visitas realizadas, taxa de conversão, cobertura de carteira
- Gráficos de evolução temporal (visitas por semana/mês, conversões por período)
- Ranking de profissionais por potencial e atividade
- Exportação de relatório em CSV

---

## Entregáveis

| #   | Artefato                                                               | Localização                                                    |
| --- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1   | `GET /pipeline` — profissionais agrupados por estágio                  | `apps/api/src/routes/pipeline/index.ts`                        |
| 2   | `GET /pipeline/metricas` — KPIs consolidados                           | `apps/api/src/routes/pipeline/metricas.ts`                     |
| 3   | `GET /pipeline/evolucao` — série temporal de conversões                | `apps/api/src/routes/pipeline/evolucao.ts`                     |
| 4   | `GET /pipeline/visitas-por-periodo` — visitas agrupadas por semana/mês | `apps/api/src/routes/pipeline/visitas-periodo.ts`              |
| 5   | `GET /pipeline/exportar` — CSV de profissionais + estágios             | `apps/api/src/routes/pipeline/exportar.ts`                     |
| 6   | Página `/dashboard/pipeline` — funil + analytics                       | `apps/web/src/routes/dashboard/pipeline/+page.svelte`          |
| 7   | Server load da página                                                  | `apps/web/src/routes/dashboard/pipeline/+page.server.ts`       |
| 8   | FunilPipeline.svelte — visualização do funil                           | `apps/web/src/lib/components/pipeline/FunilPipeline.svelte`    |
| 9   | KanbanPipeline.svelte — cards por coluna de estágio                    | `apps/web/src/lib/components/pipeline/KanbanPipeline.svelte`   |
| 10  | CardMetrica.svelte — KPI individual                                    | `apps/web/src/lib/components/pipeline/CardMetrica.svelte`      |
| 11  | GraficoVisitas.svelte — barras por período                             | `apps/web/src/lib/components/pipeline/GraficoVisitas.svelte`   |
| 12  | GraficoConversao.svelte — linha de evolução de estágios                | `apps/web/src/lib/components/pipeline/GraficoConversao.svelte` |
| 13  | Testes de todas as rotas (TDD)                                         | `apps/api/src/routes/pipeline/*.test.ts`                       |

---

## Contratos de API

### `GET /pipeline` → 200

```
Query params:
  busca          String   opcional — filtra por nome/CRM
  potencial      PotencialPrescricao  opcional
  especialidadeId String  opcional

Response:
{
  "data": {
    "PROSPECTADO":  [ ...profissionais ],
    "VISITADO":     [ ...profissionais ],
    "INTERESSADO":  [ ...profissionais ],
    "PRESCRITOR":   [ ...profissionais ],
    "FIDELIZADO":   [ ...profissionais ]
  },
  "totaisPorEstagio": {
    "PROSPECTADO": 12,
    "VISITADO": 8,
    "INTERESSADO": 5,
    "PRESCRITOR": 3,
    "FIDELIZADO": 2
  },
  "totalGeral": 30
}
```

### `GET /pipeline/metricas` → 200

```
Query params:
  dataInicio  DateTime  default: 30 dias atrás
  dataFim     DateTime  default: hoje

Response:
{
  "totalProfissionais": 30,
  "totalAtivos": 28,
  "visitasRealizadas": 45,
  "visitasPlanejadas": 12,
  "taxaConversaoProspectadoVisitado": 0.67,
  "taxaConversaoVisitadoInteressado": 0.625,
  "taxaConversaoInteressadoPrescritor": 0.60,
  "taxaConversaoPrescritorFidelizado": 0.67,
  "profissionaisSemVisitaUltimos30Dias": 8,
  "mediaVisitasPorSemana": 3.2,
  "periodo": { "dataInicio": "...", "dataFim": "..." }
}
```

### `GET /pipeline/evolucao` → 200

```
Query params:
  dataInicio  DateTime  obrigatório
  dataFim     DateTime  obrigatório
  granularidade  "semana" | "mes"  default: "semana"

Response:
{
  "data": [
    {
      "periodo": "2026-W10",
      "label": "Semana 10",
      "PROSPECTADO": 2,
      "VISITADO": 3,
      "INTERESSADO": 1,
      "PRESCRITOR": 0,
      "FIDELIZADO": 1
    }
  ]
}
// Baseado em EstagioLog — cada transição registrada conta para o período
```

### `GET /pipeline/visitas-por-periodo` → 200

```
Query params:
  dataInicio     DateTime  obrigatório
  dataFim        DateTime  obrigatório
  granularidade  "semana" | "mes"  default: "semana"

Response:
{
  "data": [
    {
      "periodo": "2026-W10",
      "label": "Semana 10",
      "AGENDADA": 3,
      "REALIZADA": 5,
      "CANCELADA": 1,
      "NAO_REALIZADA": 0,
      "total": 9
    }
  ]
}
```

### `GET /pipeline/exportar` → 200

```
Response: text/csv
Headers: Content-Disposition: attachment; filename="pipeline-YYYY-MM-DD.csv"

Colunas: Nome, CRM/CRF/CRO, Especialidade, Potencial, Estágio,
         Última Visita, Total de Visitas, Cidade, Estado
```

---

## Lógica de Métricas — Implementar Exatamente Assim

```typescript
// Taxa de conversão entre estágios consecutivos
// Usa EstagioLog para calcular quantos chegaram em cada estágio no período

async function calcularTaxaConversao(
  estagioOrigem: EstagioPipeline,
  estagioDestino: EstagioPipeline,
  dataInicio: Date,
  dataFim: Date,
  prisma: PrismaClient,
): Promise<number> {
  const chegaram = await prisma.estagioLog.count({
    where: {
      estagioAnterior: estagioOrigem,
      estagioNovo: estagioDestino,
      createdAt: { gte: dataInicio, lte: dataFim },
    },
  });

  const sairamdOrigem = await prisma.estagioLog.count({
    where: {
      estagioAnterior: estagioOrigem,
      createdAt: { gte: dataInicio, lte: dataFim },
    },
  });

  return sairamdOrigem === 0 ? 0 : chegaram / sairamdOrigem;
}

// Profissionais sem visita nos últimos N dias
async function profissionaisSemVisita(
  diasLimite: number,
  userId: string,
  prisma: PrismaClient,
): Promise<number> {
  const limite = new Date();
  limite.setDate(limite.getDate() - diasLimite);

  // Busca profissionais ativos que NÃO têm visita REALIZADA após o limite
  const comVisita = await prisma.visita.findMany({
    where: {
      userId,
      status: "REALIZADA",
      dataVisita: { gte: limite },
    },
    select: { profissionalId: true },
    distinct: ["profissionalId"],
  });

  const idsComVisita = comVisita.map((v) => v.profissionalId);

  return prisma.profissional.count({
    where: {
      deletedAt: null,
      id: { notIn: idsComVisita },
    },
  });
}
```

---

## Estrutura de Pastas — SvelteKit

```
apps/web/src/
├── routes/dashboard/pipeline/
│   ├── +page.svelte           ← página principal
│   └── +page.server.ts        ← load SSR (métricas + pipeline inicial)
└── lib/components/pipeline/
    ├── FunilPipeline.svelte    ← visualização SVG do funil
    ├── KanbanPipeline.svelte   ← colunas por estágio com cards
    ├── CardMetrica.svelte      ← KPI individual (número + label + variação)
    ├── GraficoVisitas.svelte   ← barras empilhadas por período
    └── GraficoConversao.svelte ← linha de evolução de estágios
```

---

## Padrões de UI — Svelte 5 + Design System (SKILL.md)

### Regras invioláveis

- Fundo `#f8f9fa` — nunca branco puro
- Azul `#2563eb` — botões primários e itens ativos
- **CSS Variables** para cores — nunca hex hardcoded em componentes
- **`$state`, `$derived`, `$effect`** — nunca stores clássicas para estado local
- **`{@const}`** em `{#each}` — nunca `<svelte:component>`
- **`fly` + `fade` + `cubicOut`** nas transições
- Micro-interações: `transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]`

### Cores dos Estágios (design system)

```
PROSPECTADO  → bg: #fef3c7 · color: #92400e  · barra: #f59e0b
VISITADO     → bg: #dbeafe · color: #1e40af  · barra: #3b82f6
INTERESSADO  → bg: #ede9fe · color: #5b21b6  · barra: #8b5cf6
PRESCRITOR   → bg: #d1fae5 · color: #065f46  · barra: #10b981
FIDELIZADO   → bg: #d1fae5 · color: #064e3b  · barra: #059669
```

### Layout da Página Pipeline

```
┌─────────────────────────────────────────────────────────┐
│  Pipeline Comercial              [Exportar CSV]  [Filtros]│
├─────────────────────────────────────────────────────────┤
│  [KPI: Total]  [KPI: Visitas]  [KPI: Conversão]  [KPI: Sem visita] │
├─────────────────────────────────────────────────────────┤
│  [Funil visual]  │  [Gráfico de visitas por semana]      │
├──────────────────┴──────────────────────────────────────┤
│         Kanban — colunas por estágio                    │
│  PROSP  │  VISIT  │  INTER  │  PRESC  │  FIDEL          │
│  [Card] │  [Card] │  [Card] │  [Card] │  [Card]         │
│  [Card] │         │         │         │                  │
└─────────────────────────────────────────────────────────┘
```

### CardMetrica.svelte

```svelte
<script lang="ts">
  const {
    titulo,
    valor,
    subtitulo,
    icone,
    corIcone = '#2563eb',
    corFundoIcone = '#eff6ff',
  } = $props<{
    titulo: string
    valor: string | number
    subtitulo?: string
    icone: any
    corIcone?: string
    corFundoIcone?: string
  }>()
</script>

<div class="rounded-xl border p-5"
  style="background-color: #ffffff; border-color: #e5e7eb;">
  <div class="flex items-start justify-between mb-4">
    <div class="w-9 h-9 rounded-lg flex items-center justify-center"
      style="background-color: {corFundoIcone};">
      <svelte:component this={icone} class="w-5 h-5" style="color: {corIcone};" />
    </div>
  </div>
  <p class="text-xs font-semibold uppercase tracking-wider mb-1"
    style="color: #9ca3af;">{titulo}</p>
  <p class="text-2xl font-bold" style="color: #111827;">{valor}</p>
  {#if subtitulo}
    <p class="text-xs mt-1" style="color: #6b7280;">{subtitulo}</p>
  {/if}
</div>
```

### FunilPipeline.svelte — SVG inline com Svelte 5

```svelte
<script lang="ts">
  const { totais } = $props<{
    totais: Record<string, number>
  }>()

  const estagios = [
    { key: 'PROSPECTADO', label: 'Prospectado', cor: '#f59e0b' },
    { key: 'VISITADO',    label: 'Visitado',    cor: '#3b82f6' },
    { key: 'INTERESSADO', label: 'Interessado', cor: '#8b5cf6' },
    { key: 'PRESCRITOR',  label: 'Prescritor',  cor: '#10b981' },
    { key: 'FIDELIZADO',  label: 'Fidelizado',  cor: '#059669' },
  ]

  const total = $derived(totais['PROSPECTADO'] ?? 0 || 1)
</script>

<div class="space-y-1">
  {#each estagios as estagio, i}
    {@const count = totais[estagio.key] ?? 0}
    {@const largura = Math.max(20, (count / total) * 100)}
    <div class="flex items-center gap-3">
      <div class="w-24 text-right text-xs font-medium" style="color: #6b7280;">
        {estagio.label}
      </div>
      <div class="flex-1 h-8 rounded flex items-center px-3"
        style="width: {largura}%; background-color: {estagio.cor}20;
               border-left: 3px solid {estagio.cor};">
        <span class="text-xs font-semibold" style="color: {estagio.cor};">
          {count}
        </span>
      </div>
    </div>
  {/each}
</div>
```

### KanbanPipeline.svelte — colunas com Svelte 5

```svelte
<script lang="ts">
  const { profissionaisPorEstagio, onMoverEstagio } = $props<{
    profissionaisPorEstagio: Record<string, Profissional[]>
    onMoverEstagio: (profissionalId: string, novoEstagio: string) => void
  }>()

  const colunas = [
    { key: 'PROSPECTADO', label: 'Prospectado', cor: '#f59e0b', bgHeader: '#fef3c7' },
    { key: 'VISITADO',    label: 'Visitado',    cor: '#3b82f6', bgHeader: '#dbeafe' },
    { key: 'INTERESSADO', label: 'Interessado', cor: '#8b5cf6', bgHeader: '#ede9fe' },
    { key: 'PRESCRITOR',  label: 'Prescritor',  cor: '#10b981', bgHeader: '#d1fae5' },
    { key: 'FIDELIZADO',  label: 'Fidelizado',  cor: '#059669', bgHeader: '#d1fae5' },
  ]
</script>

<div class="grid grid-cols-5 gap-3 overflow-x-auto">
  {#each colunas as coluna}
    {@const profissionais = profissionaisPorEstagio[coluna.key] ?? []}
    <div class="flex flex-col gap-2 min-w-[180px]">
      <!-- Cabeçalho da coluna -->
      <div class="flex items-center justify-between rounded-lg px-3 py-2"
        style="background-color: {coluna.bgHeader};">
        <span class="text-xs font-semibold" style="color: {coluna.cor};">
          {coluna.label}
        </span>
        <span class="text-xs font-bold rounded-full px-2 py-0.5"
          style="background-color: {coluna.cor}20; color: {coluna.cor};">
          {profissionais.length}
        </span>
      </div>
      <!-- Cards dos profissionais -->
      {#each profissionais as prof}
        <div
          class="rounded-lg border p-3 cursor-pointer
                 transition-all duration-200 ease-out
                 hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]"
          style="background-color: #ffffff; border-color: #e5e7eb;"
        >
          <p class="text-sm font-medium truncate" style="color: #111827;">
            {prof.nome}
          </p>
          <p class="text-xs mt-0.5 truncate" style="color: #6b7280;">
            {prof.especialidade?.nome ?? '—'}
          </p>
        </div>
      {/each}
    </div>
  {/each}
</div>
```

### GraficoVisitas.svelte — barras usando SVG nativo

```svelte
<script lang="ts">
  // Usar SVG nativo — sem dependência de biblioteca de gráficos
  // Barras empilhadas por status de visita ao longo do tempo

  const { dados } = $props<{
    dados: Array<{
      label: string
      REALIZADA: number
      AGENDADA: number
      CANCELADA: number
      NAO_REALIZADA: number
    }>
  }>()

  const altura = 160
  const maxTotal = $derived(
    Math.max(...dados.map(d => d.REALIZADA + d.AGENDADA + d.CANCELADA + d.NAO_REALIZADA), 1)
  )
</script>

<!-- SVG responsivo — sem largura fixa -->
<svg viewBox="0 0 {dados.length * 48} {altura + 30}"
  class="w-full" style="min-height: 140px;">
  {#each dados as d, i}
    {@const x = i * 48 + 8}
    {@const totalBarra = d.REALIZADA + d.AGENDADA + d.CANCELADA + d.NAO_REALIZADA}
    {@const escala = altura / maxTotal}

    <!-- Barra REALIZADA (verde) -->
    {@const altRealizadas = d.REALIZADA * escala}
    <rect x={x} y={altura - altRealizadas} width="32" height={altRealizadas}
      fill="#10b981" rx="2"/>

    <!-- Label abaixo -->
    <text x={x + 16} y={altura + 16} text-anchor="middle"
      font-size="10" fill="#9ca3af">{d.label}</text>
  {/each}
</svg>
```

### Estado reativo — Svelte 5 Runes

```svelte
<script lang="ts">
  import { onMount } from 'svelte'

  // Filtros e período
  let periodoSelecionado = $state<'7d' | '30d' | '90d'>('30d')
  let granularidade = $state<'semana' | 'mes'>('semana')
  let viewMode = $state<'funil' | 'kanban'>('kanban')
  let filtroEstagio = $state<string | null>(null)

  // Dados
  let metricas = $state<Metricas | null>(null)
  let pipeline = $state<PipelineData | null>(null)
  let dadosGrafico = $state<DadoGrafico[]>([])
  let loading = $state(true)

  // Derivados
  let periodoEmDias = $derived(
    periodoSelecionado === '7d' ? 7 :
    periodoSelecionado === '30d' ? 30 : 90
  )

  let totalFunil = $derived(
    pipeline ? Object.values(pipeline.totaisPorEstagio).reduce((a, b) => a + b, 0) : 0
  )

  $effect(() => {
    // Re-carrega quando período ou granularidade mudam
    void carregarTudo(periodoEmDias, granularidade)
  })
</script>
```

---

## Exportação CSV

```typescript
// apps/api/src/routes/pipeline/exportar.ts
// Gera CSV diretamente no Fastify sem biblioteca externa

const linhas = [
  [
    "Nome",
    "CRM",
    "Especialidade",
    "Potencial",
    "Estágio",
    "Última Visita",
    "Total Visitas",
    "Cidade",
    "Estado",
  ].join(","),
  ...profissionais.map((p) =>
    [
      `"${p.nome}"`,
      p.crm ?? p.crf ?? p.cro ?? "",
      `"${p.especialidade?.nome ?? ""}"`,
      p.potencial,
      p.estagioPipeline,
      ultimaVisita?.toISOString().split("T")[0] ?? "",
      totalVisitas,
      `"${p.enderecoPrincipal?.cidade ?? ""}"`,
      p.enderecoPrincipal?.estado ?? "",
    ].join(","),
  ),
];

reply
  .header("Content-Type", "text/csv; charset=utf-8")
  .header(
    "Content-Disposition",
    `attachment; filename="pipeline-${new Date().toISOString().split("T")[0]}.csv"`,
  )
  .send(linhas.join("\n"));
```

---

## Variáveis de Ambiente

```env
# apps/web/.env
PUBLIC_API_URL=http://localhost:3002
```

`import.meta.env.PUBLIC_API_URL` — nunca `process.env.NEXT_PUBLIC_`.

---

## Skills Necessárias

| Skill                              | Repositório           | Obrigatória                   |
| ---------------------------------- | --------------------- | ----------------------------- |
| `brainstorming`                    | obra/superpowers      | ✅ Sim                        |
| `write-plan`                       | obra/superpowers      | ✅ Sim                        |
| `test-driven-development`          | obra/superpowers      | ✅ Sim                        |
| `verification-before-completion`   | obra/superpowers      | ✅ Sim                        |
| `medivisitas-design`               | `.kilocode/skills/`   | ✅ Sim — antes de qualquer UI |
| `frontend-design`                  | anthropics/skills     | ✅ Sim                        |
| `fastify`                          | mcollina/skills       | ✅ Sim                        |
| `node`                             | mcollina/skills       | ✅ Sim                        |
| `typescript-magician`              | mcollina/skills       | ✅ Sim                        |
| `supabase-postgres-best-practices` | supabase/agent-skills | ✅ Sim                        |

---

## Sequência de Implementação (TDD)

```
1.  [PLAN]    skill brainstorming → queries de métricas, estrutura do kanban, gráficos SVG
2.  [PLAN]    skill write-plan → subtarefas atômicas

3.  [API RED] Testes falhando → GET /pipeline
4.  [API GRN] Implementar GET /pipeline (profissionais agrupados)
5.  [API RED] Testes falhando → GET /pipeline/metricas (KPIs + taxas de conversão)
6.  [API GRN] Implementar GET /pipeline/metricas
7.  [API RED] Testes falhando → GET /pipeline/evolucao (série temporal)
8.  [API GRN] Implementar GET /pipeline/evolucao (via EstagioLog)
9.  [API RED] Testes falhando → GET /pipeline/visitas-por-periodo
10. [API GRN] Implementar GET /pipeline/visitas-por-periodo
11. [API]     Implementar GET /pipeline/exportar (CSV — sem TDD, testar manualmente)
12. [API RFT] Extrair funções puras: calcularTaxaConversao, profissionaisSemVisita

13. [WEB]     Carregar skill medivisitas-design antes de qualquer componente
14. [WEB]     CardMetrica.svelte — $props(), ícone via svelte:component (único caso aceito)
15. [WEB]     FunilPipeline.svelte — $props(), $derived para largura das barras SVG
16. [WEB]     KanbanPipeline.svelte — $props(), colunas com cores do design system
17. [WEB]     GraficoVisitas.svelte — SVG nativo + $derived para escala
18. [WEB]     GraficoConversao.svelte — SVG nativo para linha temporal
19. [WEB]     +page.server.ts — load SSR (métricas + pipeline dos últimos 30d)
20. [WEB]     +page.svelte /dashboard/pipeline — integração + filtros + export

21. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 7

```
API
[ ] GET /pipeline → profissionais agrupados por todos os 5 estágios
[ ] GET /pipeline → filtros de busca, potencial e especialidade funcionando
[ ] GET /pipeline/metricas → todos os KPIs calculados corretamente
[ ] GET /pipeline/metricas → taxas de conversão baseadas em EstagioLog
[ ] GET /pipeline/metricas → profissionaisSemVisitaUltimos30Dias correto
[ ] GET /pipeline/evolucao → série temporal correta por semana e por mês
[ ] GET /pipeline/visitas-por-periodo → agrupado por StatusVisita
[ ] GET /pipeline/exportar → CSV com todos os campos, header correto
[ ] Todas as rotas protegidas com verifyClerkToken
[ ] userId do token usado nos filtros (propagandista vê apenas sua carteira)
[ ] Sem schema: nas rotas Fastify
[ ] Testes passando para todas as rotas

Frontend (SvelteKit + Svelte 5)
[ ] Zero stores clássicas — $state/$derived/$effect
[ ] {@const} em {#each} para variáveis — zero <svelte:component> (exceto CardMetrica)
[ ] fly + fade nas transições
[ ] CardMetrica exibe KPIs corretos
[ ] FunilPipeline exibe barras proporcionais ao total de PROSPECTADO
[ ] KanbanPipeline exibe 5 colunas com cards dos profissionais
[ ] KanbanPipeline: cores de cabeçalho corretas por estágio
[ ] GraficoVisitas exibe barras por período com cores por status
[ ] Seletor de período (7d/30d/90d) atualiza tudo via $effect
[ ] Toggle Funil/Kanban funciona com $state(viewMode)
[ ] Botão exportar CSV chama GET /pipeline/exportar e faz download
[ ] Micro-interações nos cards (hover + active)
[ ] Nenhum hex hardcoded em componentes (inline style nos SVGs é aceito)
[ ] PUBLIC_API_URL (não NEXT_PUBLIC_)

Geral
[ ] pnpm test → 100% passando
[ ] pnpm --filter @medivisitas/web build → sem erros TypeScript
[ ] pnpm --filter api build → sem erros TypeScript
[ ] skill verification-before-completion executada
[ ] CLAUDE.md: Fase 7 marcada como Concluída
```

---

## Comandos Úteis (PowerShell)

```powershell
# Não há migration nesta fase — apenas novas rotas e componentes

# API (porta 3002)
pnpm --filter api dev

# Frontend SvelteKit (porta 5173)
pnpm --filter @medivisitas/web dev

# Testes da API
pnpm --filter api test

# Type check frontend
pnpm --filter @medivisitas/web build

# Matar porta travada
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue
```

---

## Resultado Esperado

Ao concluir a Fase 7, o propagandista poderá:

1. Visualizar toda a carteira de profissionais distribuída nos 5 estágios do pipeline
2. Alternar entre visão de funil (proporcional) e kanban (colunas com cards)
3. Consultar KPIs: total de visitas, taxa de conversão por estágio, profissionais sem visita recente
4. Analisar a evolução de visitas e conversões semana a semana ou mês a mês
5. Filtrar o pipeline por potencial, especialidade ou busca por nome
6. Exportar a carteira completa em CSV para uso externo
