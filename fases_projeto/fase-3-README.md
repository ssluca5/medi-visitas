# Fase 3 — Histórico de Visitas + Materiais Técnicos

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack frontend: **SvelteKit 2 + Svelte 5 Runes + Tailwind CSS v4**
> Pré-requisito: Fase 2 concluída

---

## Objetivo da Fase

- Schema Prisma: `Visita`, `MaterialTecnico`, `VisitaMaterial`
- Ciclo de vida: `AGENDADA → REALIZADA | CANCELADA | NAO_REALIZADA`
- CRUD de visitas — **nunca deletadas, apenas canceladas via status**
- CRUD de materiais com soft delete
- UI SvelteKit: listagem geral, histórico por profissional, FAB + Sheet lateral

---

## Entregáveis

| #   | Artefato                             | Localização                                                        |
| --- | ------------------------------------ | ------------------------------------------------------------------ |
| 1   | Migration Prisma                     | `packages/database/prisma/migrations/`                             |
| 2   | Seed de materiais                    | `packages/database/prisma/seed.ts`                                 |
| 3   | `POST /visitas`                      | `apps/api/src/routes/visitas/create.ts`                            |
| 4   | `GET /visitas`                       | `apps/api/src/routes/visitas/list.ts`                              |
| 5   | `GET /visitas/:id`                   | `apps/api/src/routes/visitas/get.ts`                               |
| 6   | `PUT /visitas/:id`                   | `apps/api/src/routes/visitas/update.ts`                            |
| 7   | `PATCH /visitas/:id/status`          | `apps/api/src/routes/visitas/status.ts`                            |
| 8   | `POST /materiais`                    | `apps/api/src/routes/materiais/create.ts`                          |
| 9   | `GET /materiais`                     | `apps/api/src/routes/materiais/list.ts`                            |
| 10  | `PUT /materiais/:id`                 | `apps/api/src/routes/materiais/update.ts`                          |
| 11  | `DELETE /materiais/:id`              | `apps/api/src/routes/materiais/delete.ts`                          |
| 12  | Página listagem geral                | `apps/web/src/routes/dashboard/visitas/+page.svelte`               |
| 13  | Server load listagem                 | `apps/web/src/routes/dashboard/visitas/+page.server.ts`            |
| 14  | Detalhe profissional + aba Histórico | `apps/web/src/routes/dashboard/profissionais/[id]/+page.svelte`    |
| 15  | Server load profissional             | `apps/web/src/routes/dashboard/profissionais/[id]/+page.server.ts` |
| 16  | VisitaSheet.svelte                   | `apps/web/src/lib/components/visitas/VisitaSheet.svelte`           |
| 17  | StatusVisitaBadge.svelte             | `apps/web/src/lib/components/visitas/StatusVisitaBadge.svelte`     |
| 18  | HistoricoVisitas.svelte              | `apps/web/src/lib/components/visitas/HistoricoVisitas.svelte`      |
| 19  | MaterialSelector.svelte              | `apps/web/src/lib/components/visitas/MaterialSelector.svelte`      |
| 20  | Testes TDD                           | `apps/api/src/routes/visitas/*.test.ts` + `materiais/*.test.ts`    |

---

## Modelo de Dados (Prisma)

```prisma
enum StatusVisita {
  AGENDADA
  REALIZADA
  CANCELADA
  NAO_REALIZADA
}

enum TipoMaterial {
  BULA
  FOLDER
  APRESENTACAO
  AMOSTRA
  OUTRO
}

model Visita {
  id             String           @id @default(cuid())
  profissionalId String
  profissional   Profissional     @relation(fields: [profissionalId], references: [id], onDelete: Restrict)
  userId         String           // Clerk userId — sem FK (sistema externo)
  dataVisita     DateTime
  duracaoMinutos Int?
  status         StatusVisita     @default(AGENDADA)
  objetivoVisita String?
  resumo         String?
  proximaAcao    String?
  materiais      VisitaMaterial[]
  // SEM deletedAt — cancelar via status (regra CLAUDE.md)
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  @@index([profissionalId])
  @@index([userId])
  @@index([status])
  @@index([dataVisita])
}

model MaterialTecnico {
  id         String           @id @default(cuid())
  nome       String
  descricao  String?
  tipo       TipoMaterial
  arquivoUrl String?
  visitas    VisitaMaterial[]
  deletedAt  DateTime?
  createdAt  DateTime         @default(now())
  updatedAt  DateTime         @updatedAt

  @@index([tipo])
  @@index([deletedAt])
}

model VisitaMaterial {
  id                String          @id @default(cuid())
  visitaId          String
  visita            Visita          @relation(fields: [visitaId], references: [id], onDelete: Restrict)
  materialTecnicoId String
  materialTecnico   MaterialTecnico @relation(fields: [materialTecnicoId], references: [id], onDelete: Restrict)
  quantidade        Int             @default(1)
  // Imutável — sem deletedAt, sem updatedAt
  createdAt         DateTime        @default(now())

  @@unique([visitaId, materialTecnicoId])
  @@index([visitaId])
  @@index([materialTecnicoId])
}
```

**Regras obrigatórias:**

- `Visita` sem `deletedAt` — cancelamento via `status` (regra CLAUDE.md)
- `VisitaMaterial` imutável — sem `deletedAt`, sem `updatedAt`
- `onDelete: Restrict` em todas as FKs
- `userId` sem FK em `Visita` — Clerk é sistema externo

---

## Contratos de API

### `POST /visitas` → 201

```json
{
  "profissionalId": "cuid...",
  "dataVisita": "2026-03-30T14:00:00.000Z",
  "duracaoMinutos": 30,
  "objetivoVisita": "Apresentar novo produto linha cardiologia",
  "materiais": [{ "materialTecnicoId": "cuid...", "quantidade": 2 }]
}
```

userId preenchido via token Clerk no preHandler — nunca via body.
VisitaMaterial criados em transação atômica com a Visita.

### `GET /visitas` — Query params

- `page`, `pageSize` (default 1 / 20)
- `profissionalId`, `status`, `dataInicio`, `dataFim`

### `PATCH /visitas/:id/status`

```json
{ "status": "REALIZADA", "resumo": "...", "proximaAcao": "..." }
```

### Transições de Status

| De              | Para            | Observação                |
| --------------- | --------------- | ------------------------- |
| `AGENDADA`      | `REALIZADA`     | Visita concluída          |
| `AGENDADA`      | `CANCELADA`     | Cancelada antes           |
| `AGENDADA`      | `NAO_REALIZADA` | Não foi possível realizar |
| `REALIZADA`     | —               | Status final              |
| `CANCELADA`     | —               | Status final              |
| `NAO_REALIZADA` | —               | Status final              |

---

## Estrutura de Pastas — SvelteKit

```
apps/web/src/
├── routes/dashboard/
│   ├── visitas/
│   │   ├── +page.svelte          ← listagem + filtros
│   │   └── +page.server.ts       ← load SSR
│   └── profissionais/[id]/
│       ├── +page.svelte          ← detalhe + aba Histórico
│       └── +page.server.ts       ← load do profissional
└── lib/components/visitas/
    ├── VisitaSheet.svelte
    ├── StatusVisitaBadge.svelte
    ├── HistoricoVisitas.svelte
    └── MaterialSelector.svelte
```

---

## Padrões de UI — Svelte 5 + Design System (SKILL.md)

### Regras invioláveis

- Fundo `#f8f9fa` — nunca branco puro
- Azul `#2563eb` — botões primários e itens ativos
- **CSS Variables** para todas as cores — nunca hex hardcoded em componentes
- **FAB + Sheet lateral** com `svelte/transition` — nunca modal centralizado
- **`$state`, `$derived`, `$effect`** — nunca stores clássicas para estado local
- **`{@const Icon = item.icon}`** em `{#each}` — nunca `<svelte:component>`
- **`fly` + `fade`** do `svelte/transition` na Sheet e toasts

### Sheet Lateral — padrão obrigatório

```svelte
<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  let sheetOpen = $state(false)
  let visitaEmEdicao = $state<Visita | null>(null)
</script>

{#if sheetOpen}
  <div
    class="fixed inset-0 z-40 bg-black/40"
    transition:fade={{ duration: 200 }}
    onclick={() => sheetOpen = false}
  />
  <aside
    class="fixed right-0 top-0 z-50 h-full overflow-y-auto shadow-xl"
    style="width: min(520px, 100vw); background-color: #ffffff;"
    transition:fly={{ x: '100%', duration: 300, easing: cubicOut }}
  >
    <!-- header + formulário + rodapé -->
    <div class="sticky bottom-0 flex gap-3 border-t p-4" style="background-color: #ffffff; border-color: #e5e7eb;">
      <button
        class="flex-1 h-10 rounded-lg border text-sm font-medium"
        style="border-color: #e5e7eb; color: #374151;"
        onclick={() => sheetOpen = false}
      >Cancelar</button>
      <button
        class="flex-1 h-10 rounded-lg text-sm font-medium text-white"
        style="background-color: #2563eb; border-radius: 8px;"
      >Salvar Visita</button>
    </div>
  </aside>
{/if}

<button
  class="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
  style="background-color: #2563eb;"
  onclick={() => { visitaEmEdicao = null; sheetOpen = true }}
>+</button>
```

### StatusVisitaBadge.svelte

```svelte
<script lang="ts">
  type StatusVisita = 'AGENDADA' | 'REALIZADA' | 'CANCELADA' | 'NAO_REALIZADA'
  const { status }: { status: StatusVisita } = $props()

  const config = {
    AGENDADA:      { label: 'Agendada',      bg: '#dbeafe', color: '#1e40af' },
    REALIZADA:     { label: 'Realizada',     bg: '#d1fae5', color: '#065f46' },
    CANCELADA:     { label: 'Cancelada',     bg: '#f3f4f6', color: '#6b7280' },
    NAO_REALIZADA: { label: 'Não realizada', bg: '#fee2e2', color: '#991b1b' },
  }
</script>

<span
  class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
  style="background-color: {config[status].bg}; color: {config[status].color};"
>
  {config[status].label}
</span>
```

### Estado reativo — Svelte 5 Runes

```svelte
<script lang="ts">
  // CORRETO
  let visitas = $state<Visita[]>([])
  let loading = $state(true)
  let filtroStatus = $state('')

  let visitasFiltradas = $derived(
    filtroStatus ? visitas.filter(v => v.status === filtroStatus) : visitas
  )

  $effect(() => { carregarVisitas() })

  // NUNCA — stores clássicas para estado local
  // import { writable } from 'svelte/store'
</script>
```

### Abas no detalhe do profissional

```svelte
<script lang="ts">
  let abaAtiva = $state<'dados' | 'historico'>('dados')
</script>

<nav class="-mb-px flex gap-6 border-b px-6" style="border-color: #e5e7eb;">
  {#each [
    { id: 'dados',     label: 'Dados Cadastrais' },
    { id: 'historico', label: 'Histórico de Visitas' },
  ] as aba}
    {@const isAtiva = abaAtiva === aba.id}
    <button
      class="border-b-2 pb-3 pt-4 text-sm font-medium transition-colors"
      style={isAtiva
        ? 'border-color: #2563eb; color: #2563eb;'
        : 'border-color: transparent; color: #6b7280;'}
      onclick={() => abaAtiva = aba.id}
    >
      {aba.label}
    </button>
  {/each}
</nav>
```

### Variáveis de ambiente — SvelteKit

```env
# apps/web/.env  (não .env.local como no Next.js)
PUBLIC_API_URL=http://localhost:3002
```

Acessar via `import.meta.env.PUBLIC_API_URL` — não `process.env.NEXT_PUBLIC_`.

---

## Seed de Materiais

```typescript
const materiais = [
  { nome: "Bula Produto A", tipo: "BULA" },
  { nome: "Bula Produto B", tipo: "BULA" },
  { nome: "Folder Cardiologia", tipo: "FOLDER" },
  { nome: "Folder Neurologia", tipo: "FOLDER" },
  { nome: "Apresentação Pipeline 2026", tipo: "APRESENTACAO" },
  { nome: "Amostra Produto A — 10mg", tipo: "AMOSTRA" },
  { nome: "Amostra Produto B — 20mg", tipo: "AMOSTRA" },
];
```

---

## Skills Necessárias

| Skill                              | Repositório           | Obrigatória                       |
| ---------------------------------- | --------------------- | --------------------------------- |
| `brainstorming`                    | obra/superpowers      | ✅ Sim                            |
| `write-plan`                       | obra/superpowers      | ✅ Sim                            |
| `test-driven-development`          | obra/superpowers      | ✅ Sim                            |
| `verification-before-completion`   | obra/superpowers      | ✅ Sim                            |
| `medivisitas-design`               | `.kilocode/skills/`   | ✅ Sim — **antes de qualquer UI** |
| `frontend-design`                  | anthropics/skills     | ✅ Sim                            |
| `fastify`                          | mcollina/skills       | ✅ Sim                            |
| `node`                             | mcollina/skills       | ✅ Sim                            |
| `typescript-magician`              | mcollina/skills       | ✅ Sim                            |
| `supabase-postgres-best-practices` | supabase/agent-skills | ✅ Sim                            |

---

## Sequência de Implementação (TDD)

```
1.  [PLAN]    skill brainstorming → VisitaMaterial, regras de transição de status
2.  [PLAN]    skill write-plan → subtarefas atômicas numeradas
3.  [DB]      Migration: Visita + MaterialTecnico + VisitaMaterial + enums
4.  [DB]      pnpm --filter database prisma migrate dev --name visitas-materiais
5.  [DB]      Seed: pnpm --filter database prisma db seed
6.  [DB]      Verificar tabelas e índices no Prisma Studio

7.  [API RED] Testes falhando → POST /visitas (transação atômica)
8.  [API GRN] Implementar POST /visitas
9.  [API RED] Testes falhando → GET /visitas (filtros + paginação)
10. [API GRN] Implementar GET /visitas
11. [API]     Ciclo TDD: GET/:id → PUT → PATCH /status (validar transições)
12. [API]     Ciclo TDD: POST/GET/PUT/DELETE /materiais
13. [API RFT] Schemas Zod compartilhados; userId via token nunca via body

14. [WEB]     Carregar skill medivisitas-design antes de qualquer componente
15. [WEB]     StatusVisitaBadge.svelte — $props(), inline style para cores
16. [WEB]     MaterialSelector.svelte — $state para seleção, agrupado por tipo
17. [WEB]     VisitaSheet.svelte — FAB + fly/fade + cubicOut
18. [WEB]     HistoricoVisitas.svelte — $state, ordem cronológica reversa
19. [WEB]     +page.server.ts de visitas (load SSR)
20. [WEB]     +page.svelte /dashboard/visitas — integração completa
21. [WEB]     +page.svelte /dashboard/profissionais/[id] — aba Histórico

22. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 3

```
Banco de Dados
[ ] Migration aplicada sem erros
[ ] Tabelas: Visita, MaterialTecnico, VisitaMaterial
[ ] Seed executado — materiais disponíveis
[ ] Visita: sem deletedAt (cancelamento via status)
[ ] VisitaMaterial: sem deletedAt, sem updatedAt (imutável)
[ ] @@unique([visitaId, materialTecnicoId]) criado
[ ] onDelete: Restrict em todas as FKs

API — Visitas
[ ] POST /visitas → 201 com VisitaMaterial em transação atômica
[ ] GET /visitas → lista paginada com filtros
[ ] GET /visitas/:id → detalhe com materiais
[ ] PUT /visitas/:id → 200 quando AGENDADA, 409 quando status final
[ ] PATCH /visitas/:id/status → transição válida OK, inválida 422
[ ] userId via token Clerk (nunca via body)
[ ] verifyClerkToken no preHandler de todas as rotas
[ ] Validação Zod em todos os bodies e query params
[ ] Testes passando

API — Materiais
[ ] POST/GET/PUT/DELETE funcionando
[ ] GET nunca retorna deletedAt != null
[ ] DELETE é soft delete
[ ] Testes passando

Frontend (SvelteKit + Svelte 5)
[ ] Rotas em src/routes/ — componentes em src/lib/components/
[ ] $state, $derived, $effect — zero stores clássicas para estado local
[ ] {@const} para ícones em {#each} — zero <svelte:component>
[ ] fly + fade + cubicOut na Sheet
[ ] FAB abre Sheet em modo criação
[ ] Sheet edição com dados preenchidos
[ ] Sheet somente leitura para status final
[ ] MaterialSelector agrupado por TipoMaterial com quantidade
[ ] StatusVisitaBadge com cor correta por status
[ ] Aba Histórico com $state para aba ativa
[ ] Botão "+ Nova Visita" pré-preenche profissionalId
[ ] Nenhum hex hardcoded (CSS variables ou inline style nos badges)
[ ] Sheet lateral com fly — zero modal centralizado
[ ] PUBLIC_API_URL (não NEXT_PUBLIC_)

Geral
[ ] pnpm test → 100% passando
[ ] pnpm --filter @medivisitas/web build → sem erros
[ ] pnpm --filter api build → sem erros
[ ] skill verification-before-completion executada
[ ] CLAUDE.md: Fase 3 marcada como Concluída
```

---

## Comandos Úteis (PowerShell)

```powershell
pnpm --filter database prisma migrate dev --name visitas-materiais
pnpm --filter database prisma db seed
cd C:\Users\<usuario>\.vscode\projects\medivisitas\packages\database ; npx prisma studio

pnpm --filter api dev                    # porta 3002
pnpm --filter @medivisitas/web dev       # porta 5173
pnpm --filter api test
pnpm --filter @medivisitas/web build

Stop-Process -Id (Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue
```
