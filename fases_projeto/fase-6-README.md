# Fase 6 — Dashboard + CRM Avançado

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack frontend: **SvelteKit 2 + Svelte 5 Runes + Tailwind CSS v4**
> Pré-requisito: Fases 3, 4 e 7 concluídas (visitas, agenda e pipeline funcionando)

---

## Objetivo da Fase

Implementar o dashboard principal da aplicação e as funcionalidades avançadas de CRM,
centralizando as informações mais relevantes para o propagandista em uma única tela:

- Dashboard com visão geral: KPIs do dia, visitas recentes, próximos agendamentos, alertas
- Página de detalhe completo do profissional (histórico + pipeline + contatos + agenda)
- Busca global por nome, CRM, especialidade ou cidade
- Linha do tempo unificada de interações com cada profissional
- Painel de alertas: profissionais sem visita, visitas atrasadas, agendamentos do dia
- Sidebar com navegação ativa e informações do usuário logado

---

## Entregáveis

| #   | Artefato                                                         | Localização                                                         |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | `GET /dashboard/resumo` — dados consolidados do dia              | `apps/api/src/routes/dashboard/resumo.ts`                           |
| 2   | `GET /dashboard/alertas` — alertas e pendências                  | `apps/api/src/routes/dashboard/alertas.ts`                          |
| 3   | `GET /dashboard/proximos-agendamentos` — agenda do dia/semana    | `apps/api/src/routes/dashboard/proximos.ts`                         |
| 4   | `GET /busca` — busca global de profissionais                     | `apps/api/src/routes/busca/index.ts`                                |
| 5   | `GET /profissionais/:id/timeline` — linha do tempo de interações | `apps/api/src/routes/profissionais/timeline.ts`                     |
| 6   | Página `/dashboard` — home do sistema                            | `apps/web/src/routes/dashboard/+page.svelte`                        |
| 7   | Server load do dashboard                                         | `apps/web/src/routes/dashboard/+page.server.ts`                     |
| 8   | Página `/dashboard/profissionais/[id]` — detalhe avançado        | `apps/web/src/routes/dashboard/profissionais/[id]/+page.svelte`     |
| 9   | Server load do detalhe                                           | `apps/web/src/routes/dashboard/profissionais/[id]/+page.server.ts`  |
| 10  | Layout da área autenticada com sidebar                           | `apps/web/src/routes/dashboard/+layout.svelte`                      |
| 11  | Server load do layout                                            | `apps/web/src/routes/dashboard/+layout.server.ts`                   |
| 12  | CardResumo.svelte — KPI do dashboard                             | `apps/web/src/lib/components/dashboard/CardResumo.svelte`           |
| 13  | PainelAlertas.svelte — alertas e pendências                      | `apps/web/src/lib/components/dashboard/PainelAlertas.svelte`        |
| 14  | ListaProximasVisitas.svelte — agenda do dia                      | `apps/web/src/lib/components/dashboard/ListaProximasVisitas.svelte` |
| 15  | BuscaGlobal.svelte — input de busca com resultados               | `apps/web/src/lib/components/dashboard/BuscaGlobal.svelte`          |
| 16  | TimelineProfissional.svelte — linha do tempo                     | `apps/web/src/lib/components/crm/TimelineProfissional.svelte`       |
| 17  | DetalheContatos.svelte — contatos do profissional                | `apps/web/src/lib/components/crm/DetalheContatos.svelte`            |
| 18  | Sidebar.svelte — navegação lateral                               | `apps/web/src/lib/components/layout/Sidebar.svelte`                 |
| 19  | Testes das rotas de API (TDD)                                    | `apps/api/src/routes/dashboard/*.test.ts`                           |

---

## Contratos de API

### `GET /dashboard/resumo` → 200

```
Response:
{
  "visitasHoje": 3,
  "visitasSemana": 12,
  "agendamentosHoje": 2,
  "profissionaisAtivos": 28,
  "profissionaisSemVisitaUltimos30Dias": 8,
  "ultimasVisitas": [
    {
      "id": "cuid...",
      "profissional": { "id": "...", "nome": "Dr. João Silva", "especialidade": "..." },
      "dataVisita": "2026-04-03T10:00:00.000Z",
      "status": "REALIZADA",
      "resumo": "Demonstrou interesse no produto X"
    }
  ],
  "proximosAgendamentos": [
    {
      "id": "cuid...",
      "profissional": { "id": "...", "nome": "Dra. Maria Santos" },
      "dataHoraInicio": "2026-04-04T09:00:00.000Z",
      "titulo": "Visita de acompanhamento"
    }
  ]
}
```

### `GET /dashboard/alertas` → 200

```
Response:
{
  "data": [
    {
      "tipo": "SEM_VISITA_30_DIAS",
      "titulo": "8 profissionais sem visita há mais de 30 dias",
      "descricao": "Dr. Carlos Lima, Dra. Ana Paula...",
      "severidade": "ALTA",
      "profissionaisIds": ["cuid1", "cuid2"]
    },
    {
      "tipo": "VISITA_ATRASADA",
      "titulo": "2 visitas agendadas para ontem não realizadas",
      "severidade": "URGENTE",
      "agendamentoIds": ["cuid3"]
    },
    {
      "tipo": "AGENDAMENTO_HOJE",
      "titulo": "3 visitas agendadas para hoje",
      "severidade": "INFO",
      "agendamentoIds": ["cuid4", "cuid5", "cuid6"]
    }
  ]
}
```

### `GET /busca` → 200

```
Query params:
  q       String  obrigatório (mínimo 2 caracteres)
  limite  Int     default 10

Response:
{
  "data": [
    {
      "id": "cuid...",
      "nome": "Dr. João Silva",
      "crm": "12345-SP",
      "especialidade": "Cardiologia",
      "estagioPipeline": "VISITADO",
      "cidade": "São Paulo",
      "estado": "SP"
    }
  ],
  "total": 3
}
// Busca ILIKE em: nome, crm, crf, cro, especialidade.nome, endereco.cidade
```

### `GET /profissionais/:id/timeline` → 200

```
Response:
{
  "data": [
    {
      "tipo": "VISITA",
      "data": "2026-04-03T10:00:00.000Z",
      "titulo": "Visita realizada",
      "descricao": "Resumo: Demonstrou interesse...",
      "status": "REALIZADA",
      "icone": "clipboard-list"
    },
    {
      "tipo": "ESTAGIO",
      "data": "2026-03-20T09:00:00.000Z",
      "titulo": "Avançou para Visitado",
      "descricao": "Estágio anterior: Prospectado",
      "icone": "trending-up"
    },
    {
      "tipo": "AGENDAMENTO",
      "data": "2026-04-10T09:00:00.000Z",
      "titulo": "Visita agendada",
      "descricao": "Apresentação de produto",
      "status": "PLANEJADO",
      "icone": "calendar"
    }
  ]
}
// Ordem cronológica reversa (mais recente primeiro)
// Une: Visita + EstagioLog + AgendaItem do profissional
```

---

## Tipos de Alerta e Severidade

```typescript
type TipoAlerta =
  | "SEM_VISITA_30_DIAS" // profissionais sem visita há mais de 30 dias
  | "SEM_VISITA_60_DIAS" // profissionais sem visita há mais de 60 dias (urgente)
  | "VISITA_ATRASADA" // AgendaItem PLANEJADO com dataHoraInicio < agora
  | "AGENDAMENTO_HOJE" // AgendaItem PLANEJADO com dataHoraInicio hoje
  | "PROSPECTADO_SEM_VISITA"; // profissional PROSPECTADO sem nenhuma visita

type SeveridadeAlerta = "INFO" | "NORMAL" | "ALTA" | "URGENTE";

const severidadeCor = {
  INFO: { bg: "#eff6ff", color: "#1e40af", borda: "#3b82f6" },
  NORMAL: { bg: "#fef3c7", color: "#92400e", borda: "#f59e0b" },
  ALTA: { bg: "#fee2e2", color: "#991b1b", borda: "#ef4444" },
  URGENTE: { bg: "#fef2f2", color: "#7f1d1d", borda: "#dc2626" },
};
```

---

## Estrutura de Pastas — SvelteKit

```
apps/web/src/
├── routes/
│   └── dashboard/
│       ├── +layout.svelte         ← Sidebar + área de conteúdo
│       ├── +layout.server.ts      ← valida sessão + carrega user info
│       ├── +page.svelte           ← home do dashboard
│       ├── +page.server.ts        ← load SSR do resumo
│       └── profissionais/
│           └── [id]/
│               ├── +page.svelte   ← detalhe avançado do profissional
│               └── +page.server.ts
└── lib/
    └── components/
        ├── layout/
        │   └── Sidebar.svelte
        ├── dashboard/
        │   ├── CardResumo.svelte
        │   ├── PainelAlertas.svelte
        │   ├── ListaProximasVisitas.svelte
        │   └── BuscaGlobal.svelte
        └── crm/
            ├── TimelineProfissional.svelte
            └── DetalheContatos.svelte
```

---

## Padrões de UI — Svelte 5 + Design System (SKILL.md)

### Regras invioláveis

- Fundo `#f8f9fa` — nunca branco puro
- Azul `#2563eb` — botões primários e itens ativos na sidebar
- **CSS Variables** para cores — nunca hex hardcoded em componentes
- **`$state`, `$derived`, `$effect`** — nunca stores clássicas para estado local
- **`{@const Icon = item.icon}`** em `{#each}` — nunca `<svelte:component>`
- **`fly` + `fade` + `cubicOut`** nas transições
- Micro-interações: `transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98]`

### Layout Geral — dashboard/+layout.svelte

```svelte
<script lang="ts">
  import Sidebar from '$lib/components/layout/Sidebar.svelte'
  import { page } from '$app/stores'

  const { data, children } = $props()
</script>

<div class="flex min-h-screen" style="background-color: #f8f9fa;">
  <Sidebar usuario={data.usuario} rotaAtiva={$page.url.pathname} />
  <main class="flex-1 overflow-auto">
    {@render children()}
  </main>
</div>
```

### Sidebar.svelte — design system exato

```svelte
<script lang="ts">
  import {
    LayoutDashboard, Users, Calendar, ClipboardList,
    TrendingUp, Stethoscope, LogOut,
  } from 'lucide-svelte'

  const { usuario, rotaAtiva } = $props<{
    usuario: { nome: string; email: string; iniciais: string }
    rotaAtiva: string
  }>()

  const navItems = [
    { href: '/dashboard',              label: 'Dashboard',      icon: LayoutDashboard },
    { href: '/dashboard/profissionais', label: 'Profissionais', icon: Users },
    { href: '/dashboard/agenda',        label: 'Agenda',        icon: Calendar },
    { href: '/dashboard/visitas',       label: 'Visitas',       icon: ClipboardList },
    { href: '/dashboard/pipeline',      label: 'Pipeline',      icon: TrendingUp },
  ]

  const cadAuxItems = [
    { href: '/dashboard/especialidades', label: 'Especialidades', icon: Stethoscope },
  ]

  function isAtivo(href: string): boolean {
    if (href === '/dashboard') return rotaAtiva === '/dashboard'
    return rotaAtiva.startsWith(href)
  }
</script>

<aside class="fixed left-0 top-0 h-full w-48 flex flex-col border-r z-20"
  style="background-color: #ffffff; border-color: #e5e7eb;">

  <!-- Logo -->
  <div class="p-4 border-b" style="border-color: #e5e7eb;">
    <p class="font-bold text-base" style="color: #111827;">MediVisitas</p>
    <p class="text-xs" style="color: #9ca3af;">CRM para Propagandistas</p>
  </div>

  <!-- Nav -->
  <nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
    {#each navItems as item}
      {@const ativo = isAtivo(item.href)}
      {@const Icon = item.icon}
      <a
        href={item.href}
        class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors"
        style={ativo
          ? 'background-color: #eff6ff; color: #2563eb; font-weight: 500;'
          : 'color: #6b7280;'}
      >
        <Icon class="w-4 h-4" />
        {item.label}
      </a>
    {/each}

    <!-- Cadastros Auxiliares -->
    <p class="text-xs font-semibold uppercase tracking-wider px-2 py-1 mt-3"
      style="color: #9ca3af;">Cadastros</p>

    {#each cadAuxItems as item}
      {@const ativo = isAtivo(item.href)}
      {@const Icon = item.icon}
      <a
        href={item.href}
        class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors"
        style={ativo
          ? 'background-color: #eff6ff; color: #2563eb; font-weight: 500;'
          : 'color: #6b7280;'}
      >
        <Icon class="w-4 h-4" />
        {item.label}
      </a>
    {/each}
  </nav>

  <!-- Footer do usuário -->
  <div class="p-3 border-t" style="border-color: #e5e7eb;">
    <div class="flex items-center gap-2 mb-2">
      <div class="w-7 h-7 rounded-full flex items-center justify-center
                  text-xs font-semibold text-white flex-shrink-0"
        style="background-color: #2563eb;">
        {usuario.iniciais}
      </div>
      <span class="text-sm truncate" style="color: #374151;">{usuario.nome}</span>
    </div>
    <button
      class="flex items-center gap-1.5 text-xs w-full transition-colors"
      style="color: #9ca3af;"
      onclick={sair}
    >
      <LogOut class="w-3 h-3" />
      Sair
    </button>
  </div>
</aside>

<!-- Espaçador para o conteúdo não ficar sob a sidebar -->
<div class="w-48 flex-shrink-0"></div>
```

### Dashboard Home — layout da página

```
┌─────────────────────────────────────────────────────────────┐
│  Bom dia, Lucas!            🔍 [Busca global...]            │
├──────────┬──────────┬──────────┬──────────────────────────┤
│ Visitas  │ Visitas  │ Agenda-  │ Sem visita               │
│ hoje: 3  │ semana:12│ mentos:2 │ 30d: 8                   │
├──────────┴──────────┴──────────┴──────────────────────────┤
│  Alertas e Pendências        │  Próximas Visitas Hoje      │
│  🔴 2 visitas atrasadas      │  09h · Dr. João Silva       │
│  🟡 8 sem visita (30d)       │  14h · Dra. Ana Paula       │
│  🔵 3 agendamentos hoje      │  [+ Ver agenda completa]    │
├──────────────────────────────┴─────────────────────────────┤
│  Últimas visitas realizadas                                 │
│  [Card] [Card] [Card]                                       │
│         [Cards de Acesso Rápido]                            │
│  [Profissionais] [Pipeline] [Especialidades]                │
└─────────────────────────────────────────────────────────────┘
```

### CardResumo.svelte

```svelte
<script lang="ts">
  const {
    titulo, valor, descricao,
    icone, corIcone = '#2563eb', corFundo = '#eff6ff',
  } = $props<{
    titulo: string
    valor: number | string
    descricao?: string
    icone: any
    corIcone?: string
    corFundo?: string
  }>()
</script>

<div class="rounded-xl border p-5 transition-all duration-200
            hover:-translate-y-[1px] hover:shadow-sm"
  style="background-color: #ffffff; border-color: #e5e7eb;">
  <div class="flex items-start justify-between mb-4">
    <div class="w-9 h-9 rounded-lg flex items-center justify-center"
      style="background-color: {corFundo};">
      <svelte:component this={icone} class="w-5 h-5" style="color: {corIcone};" />
    </div>
  </div>
  <p class="text-xs font-semibold uppercase tracking-wider mb-1"
    style="color: #9ca3af;">{titulo}</p>
  <p class="text-2xl font-bold" style="color: #111827;">{valor}</p>
  {#if descricao}
    <p class="text-xs mt-1" style="color: #6b7280;">{descricao}</p>
  {/if}
</div>
```

### BuscaGlobal.svelte — busca com debounce

```svelte
<script lang="ts">
  import { Search } from 'lucide-svelte'

  let query = $state('')
  let resultados = $state<ResultadoBusca[]>([])
  let aberto = $state(false)
  let timer: ReturnType<typeof setTimeout>

  $effect(() => {
    clearTimeout(timer)
    if (query.length < 2) {
      resultados = []
      aberto = false
      return
    }
    timer = setTimeout(async () => {
      const data = await buscar(query)
      resultados = data
      aberto = true
    }, 300)
  })
</script>

<div class="relative">
  <div class="relative">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
      style="color: #9ca3af;" />
    <input
      type="text"
      bind:value={query}
      placeholder="Buscar profissional, CRM, cidade..."
      class="w-full h-9 pl-9 pr-3 text-sm rounded-lg border"
      style="border-color: #e5e7eb; background-color: #ffffff; color: #111827;"
      onfocus={() => query.length >= 2 && (aberto = true)}
    />
  </div>

  {#if aberto && resultados.length > 0}
    <div
      class="absolute top-10 left-0 z-50 w-80 rounded-lg border shadow-lg overflow-hidden"
      style="background-color: #ffffff; border-color: #e5e7eb;"
    >
      {#each resultados as r}
        <a
          href="/dashboard/profissionais/{r.id}"
          class="flex items-center gap-3 px-4 py-3 border-b transition-colors hover:bg-gray-50"
          style="border-color: #f3f4f6;"
          onclick={() => aberto = false}
        >
          <div>
            <p class="text-sm font-medium" style="color: #111827;">{r.nome}</p>
            <p class="text-xs" style="color: #6b7280;">
              {r.especialidade} · {r.cidade}/{r.estado}
            </p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
```

### TimelineProfissional.svelte — linha do tempo unificada

```svelte
<script lang="ts">
  import { ClipboardList, TrendingUp, Calendar } from 'lucide-svelte'

  const { itens } = $props<{ itens: ItemTimeline[] }>()

  const iconeMap = {
    VISITA:       ClipboardList,
    ESTAGIO:      TrendingUp,
    AGENDAMENTO:  Calendar,
  }

  const corMap = {
    VISITA:      '#2563eb',
    ESTAGIO:     '#8b5cf6',
    AGENDAMENTO: '#f59e0b',
  }
</script>

<div class="relative">
  <!-- Linha vertical -->
  <div class="absolute left-4 top-0 bottom-0 w-px"
    style="background-color: #e5e7eb;"></div>

  <div class="space-y-4 pl-12">
    {#each itens as item}
      {@const Icon = iconeMap[item.tipo]}
      {@const cor = corMap[item.tipo]}

      <!-- Ícone na linha -->
      <div class="absolute left-0 w-8 h-8 rounded-full flex items-center
                  justify-center border-2"
        style="background-color: #ffffff; border-color: {cor};">
        <Icon class="w-4 h-4" style="color: {cor};" />
      </div>

      <!-- Conteúdo -->
      <div class="rounded-lg border p-3"
        style="background-color: #ffffff; border-color: #e5e7eb;">
        <div class="flex items-start justify-between">
          <p class="text-sm font-medium" style="color: #111827;">{item.titulo}</p>
          <p class="text-xs" style="color: #9ca3af;">
            {formatarData(item.data)}
          </p>
        </div>
        {#if item.descricao}
          <p class="text-xs mt-1" style="color: #6b7280;">{item.descricao}</p>
        {/if}
      </div>
    {/each}
  </div>
</div>
```

### Página de Detalhe do Profissional — abas com Svelte 5

```svelte
<script lang="ts">
  const { data } = $props()

  let abaAtiva = $state<'dados' | 'historico' | 'agenda' | 'timeline'>('timeline')

  const abas = [
    { id: 'timeline',  label: 'Linha do Tempo' },
    { id: 'historico', label: 'Visitas' },
    { id: 'agenda',    label: 'Agenda' },
    { id: 'dados',     label: 'Dados Cadastrais' },
  ]
</script>

<!-- Cabeçalho do profissional -->
<div class="px-6 py-5 border-b" style="background-color: #ffffff; border-color: #e5e7eb;">
  <div class="flex items-start justify-between">
    <div class="flex items-center gap-4">
      <!-- Avatar com iniciais -->
      <div class="w-12 h-12 rounded-full flex items-center justify-center
                  text-base font-bold text-white flex-shrink-0"
        style="background-color: #2563eb;">
        {data.profissional.nome.charAt(0)}
      </div>
      <div>
        <h1 class="text-xl font-semibold" style="color: #111827;">
          {data.profissional.nome}
        </h1>
        <p class="text-sm" style="color: #6b7280;">
          {data.profissional.especialidade?.nome}
          {#if data.profissional.crm}· CRM {data.profissional.crm}{/if}
        </p>
      </div>
    </div>
    <!-- Badges de potencial e estágio -->
    <div class="flex items-center gap-2">
      <PotencialBadge potencial={data.profissional.potencial} />
      <EstagioBadge estagio={data.profissional.estagioPipeline} />
    </div>
  </div>

  <!-- Abas -->
  <nav class="-mb-px flex gap-6 mt-4">
    {#each abas as aba}
      {@const isAtiva = abaAtiva === aba.id}
      <button
        class="border-b-2 pb-3 text-sm font-medium transition-colors"
        style={isAtiva
          ? 'border-color: #2563eb; color: #2563eb;'
          : 'border-color: transparent; color: #6b7280;'}
        onclick={() => abaAtiva = aba.id}
      >
        {aba.label}
      </button>
    {/each}
  </nav>
</div>

<!-- Conteúdo da aba -->
<div class="p-6">
  {#if abaAtiva === 'timeline'}
    <TimelineProfissional itens={data.timeline} />
  {:else if abaAtiva === 'historico'}
    <HistoricoVisitas profissionalId={data.profissional.id} />
  {:else if abaAtiva === 'agenda'}
    <!-- Agenda do profissional -->
  {:else if abaAtiva === 'dados'}
    <DetalheContatos profissional={data.profissional} />
  {/if}
</div>
```

### PainelAlertas.svelte

```svelte
<script lang="ts">
  import { AlertTriangle, Clock, Calendar, Info } from 'lucide-svelte'

  const { alertas } = $props<{ alertas: Alerta[] }>()

  const iconeMap = {
    INFO:    Info,
    NORMAL:  Clock,
    ALTA:    AlertTriangle,
    URGENTE: AlertTriangle,
  }

  const corMap = {
    INFO:    { bg: '#eff6ff', color: '#1e40af', borda: '#3b82f6' },
    NORMAL:  { bg: '#fef3c7', color: '#92400e', borda: '#f59e0b' },
    ALTA:    { bg: '#fee2e2', color: '#991b1b', borda: '#ef4444' },
    URGENTE: { bg: '#fef2f2', color: '#7f1d1d', borda: '#dc2626' },
  }
</script>

<div class="space-y-2">
  {#each alertas as alerta}
    {@const cor = corMap[alerta.severidade]}
    {@const Icon = iconeMap[alerta.severidade]}
    <div
      class="flex items-start gap-3 rounded-lg border-l-4 p-3"
      style="background-color: {cor.bg}; border-color: {cor.borda};"
    >
      <Icon class="w-4 h-4 mt-0.5 flex-shrink-0" style="color: {cor.color};" />
      <div>
        <p class="text-sm font-medium" style="color: {cor.color};">
          {alerta.titulo}
        </p>
        {#if alerta.descricao}
          <p class="text-xs mt-0.5" style="color: {cor.color}; opacity: 0.8;">
            {alerta.descricao}
          </p>
        {/if}
      </div>
    </div>
  {/each}
</div>
```

---

## Layout do Detalhe do Profissional

```
┌─────────────────────────────────────────────────────────────┐
│  ← Voltar   [Avatar] Dr. João Silva           [Potencial]  │
│             Cardiologia · CRM 12345-SP         [Estágio]   │
├─────────────────────────────────────────────────────────────┤
│  [Linha do Tempo] [Visitas] [Agenda] [Dados Cadastrais]     │
├─────────────────────────────────────────────────────────────┤
│  Linha do Tempo                    │  Resumo rápido         │
│                                    │  Total visitas: 8      │
│  ●─ Visita realizada               │  Última visita: 03/04  │
│  │  "Demonstrou interesse..."      │  Próximo: 10/04        │
│  ●─ Avançou para Visitado          │                        │
│  │                                 │  Contatos:             │
│  ●─ Visita agendada (10/04)        │  📱 11 99999-9999      │
│                                    │  📧 joao@hospital.com  │
└────────────────────────────────────┴────────────────────────┘
```

---

## Layout Server — validação de sessão centralizada

```typescript
// apps/web/src/routes/dashboard/+layout.server.ts
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.userId) {
    throw redirect(302, "/login");
  }

  return {
    usuario: {
      id: locals.userId,
      nome: locals.userName ?? "Usuário",
      email: locals.userEmail ?? "",
      iniciais: (locals.userName ?? "U").charAt(0).toUpperCase(),
    },
  };
};
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
1.  [PLAN]    skill brainstorming → timeline unificada, alertas, busca global, layout
2.  [PLAN]    skill write-plan → subtarefas atômicas

3.  [API RED] Testes falhando → GET /dashboard/resumo
4.  [API GRN] Implementar GET /dashboard/resumo
5.  [API RED] Testes falhando → GET /dashboard/alertas (5 tipos)
6.  [API GRN] Implementar GET /dashboard/alertas
7.  [API RED] Testes falhando → GET /busca (ILIKE múltiplos campos)
8.  [API GRN] Implementar GET /busca
9.  [API RED] Testes falhando → GET /profissionais/:id/timeline (merge 3 entidades)
10. [API GRN] Implementar GET /profissionais/:id/timeline
11. [API RFT] Extrair helpers: calcularAlertas, montarTimeline

12. [WEB]     Carregar skill medivisitas-design antes de qualquer componente
13. [WEB]     +layout.server.ts — validação de sessão centralizada
14. [WEB]     Sidebar.svelte — nav com isAtivo() via $props, lucide-svelte
15. [WEB]     +layout.svelte — composição Sidebar + {@render children()}
16. [WEB]     CardResumo.svelte — $props, micro-interação
17. [WEB]     PainelAlertas.svelte — $props, cores por severidade
18. [WEB]     ListaProximasVisitas.svelte — $props, formato de hora
19. [WEB]     BuscaGlobal.svelte — $state + $effect para debounce
20. [WEB]     +page.server.ts dashboard — load SSR
21. [WEB]     +page.svelte dashboard — grid de KPIs + alertas + próximas visitas
22. [WEB]     TimelineProfissional.svelte — $props, linha vertical SVG + ícones
23. [WEB]     DetalheContatos.svelte — $props, formatação de contatos
24. [WEB]     +page.server.ts profissionais/[id] — load profissional + timeline
25. [WEB]     +page.svelte profissionais/[id] — abas com $state(abaAtiva)

26. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 6

```
API
[ ] GET /dashboard/resumo → KPIs + últimas visitas + próximos agendamentos
[ ] GET /dashboard/alertas → 5 tipos de alerta com severidade correta
[ ] GET /busca → ILIKE em nome, crm, crf, cro, especialidade, cidade
[ ] GET /busca → mínimo 2 caracteres, limite configurável
[ ] GET /profissionais/:id/timeline → merge de Visita + EstagioLog + AgendaItem
[ ] GET /profissionais/:id/timeline → ordem cronológica reversa
[ ] Todos os endpoints filtram por userId do token
[ ] verifyClerkToken no preHandler de todas as rotas
[ ] Sem schema: nas rotas Fastify
[ ] Testes passando

Frontend (SvelteKit + Svelte 5)
[ ] +layout.server.ts valida sessão e redireciona para /login se não autenticado
[ ] +layout.svelte usa {@render children()} (padrão SvelteKit 2)
[ ] Sidebar exibe item ativo com bg #eff6ff e cor #2563eb
[ ] Sidebar isAtivo() correto para rota /dashboard (exact) e demais (startsWith)
[ ] Sidebar exibe iniciais do usuário no avatar
[ ] Sidebar botão Sair funciona (signOut do Clerk)
[ ] BuscaGlobal debounce de 300ms com $effect
[ ] BuscaGlobal dropdown fecha ao clicar em resultado
[ ] CardResumo exibe 4 KPIs com ícones corretos
[ ] PainelAlertas exibe alertas com cores por severidade
[ ] ListaProximasVisitas exibe agendamentos do dia
[ ] TimelineProfissional exibe linha vertical + ícones por tipo
[ ] Detalhe do profissional tem 4 abas com $state(abaAtiva)
[ ] Aba ativa com borda azul (border-color: #2563eb)
[ ] Nenhum store clássico — $state/$derived/$effect
[ ] {@const Icon = item.icon} em {#each} — zero <svelte:component>
[ ] fly + fade nas transições onde aplicável
[ ] Nenhum hex hardcoded em componentes
[ ] PUBLIC_API_URL (não NEXT_PUBLIC_)
[ ] Fundo #f8f9fa em todas as páginas

Geral
[ ] pnpm test → 100% passando
[ ] pnpm --filter @medivisitas/web build → sem erros TypeScript
[ ] pnpm --filter api build → sem erros TypeScript
[ ] skill verification-before-completion executada
[ ] CLAUDE.md: Fase 6 marcada como Concluída
```

---

## Comandos Úteis (PowerShell)

```powershell
# Sem migration nesta fase

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

Ao concluir a Fase 6, o propagandista terá:

1. Uma home do sistema com visão geral do dia — KPIs, alertas e próximas visitas
2. Busca global rápida por qualquer profissional da carteira
3. Página de detalhe completo do profissional com linha do tempo unificada de interações
4. Sidebar navegável com item ativo destacado e informações do usuário logado
5. Painel de alertas destacando profissionais sem visita recente e agendamentos atrasados
6. Sessão validada centralmente no layout — sem verificações duplicadas por página
