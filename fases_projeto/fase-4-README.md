# Fase 4 — Agenda Inteligente

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack frontend: **SvelteKit 2 + Svelte 5 Runes + Tailwind CSS v4**
> Pré-requisito: Fase 3 concluída (histórico de visitas funcionando)

---

## Objetivo da Fase

Implementar uma agenda inteligente para o propagandista planejar e visualizar suas visitas,
com sugestões automáticas baseadas em potencial de prescrição e tempo desde a última visita:

- Schema Prisma: `AgendaItem` (slot de tempo planejado) + extensão de `Visita`
- Visualização em calendário semanal e mensal
- Sugestões automáticas de profissionais a visitar (regra de negócio)
- Drag-and-drop para reorganizar agendamentos
- Integração com o histórico de visitas da Fase 3
- Notificação visual de visitas atrasadas e profissionais sem visita recente

---

## Entregáveis

| #   | Artefato                                                        | Localização                                                   |
| --- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Migration Prisma: `AgendaItem`                                  | `packages/database/prisma/migrations/`                        |
| 2   | `POST /agenda` — criar item                                     | `apps/api/src/routes/agenda/create.ts`                        |
| 3   | `GET /agenda` — listar por período                              | `apps/api/src/routes/agenda/list.ts`                          |
| 4   | `GET /agenda/:id` — detalhe                                     | `apps/api/src/routes/agenda/get.ts`                           |
| 5   | `PUT /agenda/:id` — editar                                      | `apps/api/src/routes/agenda/update.ts`                        |
| 6   | `DELETE /agenda/:id` — soft delete                              | `apps/api/src/routes/agenda/delete.ts`                        |
| 7   | `GET /agenda/sugestoes` — profissionais sugeridos               | `apps/api/src/routes/agenda/sugestoes.ts`                     |
| 8   | `PATCH /agenda/:id/vincular-visita` — vincular visita realizada | `apps/api/src/routes/agenda/vincular.ts`                      |
| 9   | Página `/dashboard/agenda` — visão calendário                   | `apps/web/src/routes/dashboard/agenda/+page.svelte`           |
| 10  | Server load da agenda                                           | `apps/web/src/routes/dashboard/agenda/+page.server.ts`        |
| 11  | Componente CalendarioSemanal                                    | `apps/web/src/lib/components/agenda/CalendarioSemanal.svelte` |
| 12  | Componente CalendarioMensal                                     | `apps/web/src/lib/components/agenda/CalendarioMensal.svelte`  |
| 13  | AgendaItemSheet (FAB + Sheet)                                   | `apps/web/src/lib/components/agenda/AgendaItemSheet.svelte`   |
| 14  | PainelSugestoes                                                 | `apps/web/src/lib/components/agenda/PainelSugestoes.svelte`   |
| 15  | AgendaItemCard                                                  | `apps/web/src/lib/components/agenda/AgendaItemCard.svelte`    |
| 16  | Testes de todas as rotas (TDD)                                  | `apps/api/src/routes/agenda/*.test.ts`                        |

---

## Modelo de Dados (Prisma)

```prisma
// Acrescentar em packages/database/prisma/schema.prisma

enum StatusAgenda {
  PLANEJADO    // item criado, visita ainda não realizada
  REALIZADO    // visita vinculada e concluída
  CANCELADO    // item cancelado antes da visita
  REAGENDADO   // movido para outro horário (mantém histórico)
}

enum PrioridadeAgenda {
  BAIXA
  NORMAL
  ALTA
  URGENTE
}

model AgendaItem {
  id             String           @id @default(cuid())
  userId         String           // Clerk userId — sem FK (sistema externo)
  profissionalId String
  profissional   Profissional     @relation(fields: [profissionalId], references: [id], onDelete: Restrict)
  dataHoraInicio DateTime
  dataHoraFim    DateTime?
  titulo         String
  observacoes    String?
  status         StatusAgenda     @default(PLANEJADO)
  prioridade     PrioridadeAgenda @default(NORMAL)
  visitaId       String?          // vinculada após realização
  visita         Visita?          @relation(fields: [visitaId], references: [id], onDelete: Restrict)
  // Soft delete padrão
  deletedAt      DateTime?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  @@index([userId])
  @@index([profissionalId])
  @@index([dataHoraInicio])
  @@index([status])
  @@index([deletedAt])
}
```

> **Também adicionar em `Visita`:**
>
> ```prisma
> agendaItems AgendaItem[]  // relação inversa
> ```

**Regras obrigatórias:**

- `AgendaItem` com `deletedAt DateTime?` — soft delete padrão
- `onDelete: Restrict` em todas as FKs
- `userId` sem FK — Clerk é sistema externo
- `visitaId` nullable — vinculado apenas após visita realizada

---

## Regra de Negócio — Sugestões Inteligentes

O endpoint `GET /agenda/sugestoes` retorna profissionais priorizados pela fórmula:

```
Pontuação = peso_potencial + peso_tempo_sem_visita

peso_potencial:
  ESTRATEGICO → 40 pontos
  ALTO        → 30 pontos
  MEDIO       → 20 pontos
  BAIXO       → 10 pontos

peso_tempo_sem_visita (dias desde última visita REALIZADA):
  > 60 dias  → 40 pontos  (urgente)
  > 30 dias  → 30 pontos  (importante)
  > 15 dias  → 20 pontos  (normal)
  ≤ 15 dias  → 10 pontos  (recente)
  sem visita → 50 pontos  (nunca visitado — máxima prioridade)

Filtros aplicados:
  - Apenas profissionais ativos (deletedAt IS NULL)
  - Apenas estágios: PROSPECTADO, VISITADO, INTERESSADO, PRESCRITOR
  - Excluir profissionais já agendados no período informado
```

---

## Contratos de API

### `POST /agenda` → 201

```json
{
  "profissionalId": "cuid...",
  "dataHoraInicio": "2026-04-10T09:00:00.000Z",
  "dataHoraFim": "2026-04-10T09:30:00.000Z",
  "titulo": "Visita de apresentação",
  "observacoes": "Levar amostras do produto A",
  "prioridade": "ALTA"
}
```

### `GET /agenda` → 200

```
Query params:
  dataInicio   DateTime  obrigatório
  dataFim      DateTime  obrigatório
  status       StatusAgenda  opcional
  profissionalId String  opcional

Response:
{
  "data": [ ...agendaItems com profissional incluído ],
  "total": 42
}
```

### `GET /agenda/sugestoes` → 200

```
Query params:
  dataInicio  DateTime  obrigatório (período para checar agendamentos existentes)
  dataFim     DateTime  obrigatório
  limite      Int       default 10

Response:
{
  "data": [
    {
      "profissional": { ...dados },
      "pontuacao": 80,
      "diasSemVisita": 45,
      "ultimaVisita": "2026-02-24T10:00:00.000Z" | null,
      "motivo": "Potencial Alto + 45 dias sem visita"
    }
  ]
}
```

### `PATCH /agenda/:id/vincular-visita` → 200

```json
{ "visitaId": "cuid..." }
// Comportamento:
// 1. Valida que visitaId existe e pertence ao mesmo profissionalId
// 2. Atualiza AgendaItem.visitaId e status para REALIZADO
// 3. Retorna AgendaItem atualizado com visita incluída
```

---

## Estrutura de Pastas — SvelteKit

```
apps/web/src/
├── routes/dashboard/agenda/
│   ├── +page.svelte           ← página principal da agenda
│   └── +page.server.ts        ← load SSR (semana atual)
└── lib/components/agenda/
    ├── CalendarioSemanal.svelte  ← grade 7 dias × horas
    ├── CalendarioMensal.svelte   ← grade mensal com dots de eventos
    ├── AgendaItemSheet.svelte    ← FAB + Sheet criar/editar
    ├── AgendaItemCard.svelte     ← card de item na grade
    └── PainelSugestoes.svelte   ← lista lateral de sugestões
```

---

## Padrões de UI — Svelte 5 + Design System (SKILL.md)

### Regras invioláveis

- Fundo `#f8f9fa` — nunca branco puro
- Azul `#2563eb` — botões primários e itens ativos
- **CSS Variables** para todas as cores — nunca hex hardcoded em componentes
- **FAB + Sheet lateral** com `svelte/transition` — nunca modal centralizado
- **`$state`, `$derived`, `$effect`** — nunca stores clássicas para estado local
- **`{@const}`** em `{#each}` para variáveis dinâmicas — nunca `<svelte:component>`
- **`fly` + `fade` + `cubicOut`** na Sheet e toasts

### Cores por Status e Prioridade

```
StatusAgenda:
  PLANEJADO   → bg: #dbeafe · color: #1e40af  (azul)
  REALIZADO   → bg: #d1fae5 · color: #065f46  (verde)
  CANCELADO   → bg: #f3f4f6 · color: #6b7280  (cinza)
  REAGENDADO  → bg: #fef3c7 · color: #92400e  (âmbar)

PrioridadeAgenda (borda esquerda do AgendaItemCard):
  URGENTE → #dc2626  (vermelho)
  ALTA    → #f59e0b  (âmbar)
  NORMAL  → #2563eb  (azul)
  BAIXA   → #9ca3af  (cinza)
```

### Layout da Agenda

```
┌─────────────────────────────────────────────────────┐
│  ← Semana anterior   04/04 – 10/04/2026   Próxima → │
│  [Semana] [Mês]                        [+ Agendar]  │
├──────────┬──────────────────────────────────────────┤
│          │  SEG   TER   QUA   QUI   SEX   SAB   DOM │
│  SUGES-  ├──────────────────────────────────────────┤
│  TÕES    │  08h                                     │
│          │  09h  [Card] [Card]                      │
│  • Dr.X  │  10h         [Card]                      │
│  • Dr.Y  │  11h                                     │
│  • Dr.Z  │  14h  [Card]                             │
│          │  15h                                     │
└──────────┴──────────────────────────────────────────┘
```

### AgendaItemCard.svelte

```svelte
<script lang="ts">
  const { item, onclick } = $props<{
    item: AgendaItem
    onclick: () => void
  }>()

  const prioridadeCor = {
    URGENTE: '#dc2626',
    ALTA:    '#f59e0b',
    NORMAL:  '#2563eb',
    BAIXA:   '#9ca3af',
  }
</script>

<button
  class="w-full rounded-lg p-2 text-left transition-all duration-200
         hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] cursor-pointer"
  style="
    background-color: #eff6ff;
    border-left: 3px solid {prioridadeCor[item.prioridade]};
  "
  {onclick}
>
  <p class="text-xs font-semibold truncate" style="color: #1e40af;">
    {item.profissional.nome}
  </p>
  <p class="text-xs mt-0.5" style="color: #6b7280;">
    {formatarHora(item.dataHoraInicio)}
    {#if item.dataHoraFim}
      – {formatarHora(item.dataHoraFim)}
    {/if}
  </p>
</button>
```

### CalendarioSemanal.svelte — estrutura com Runes

```svelte
<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  let semanaAtual = $state(new Date())
  let viewMode = $state<'semana' | 'mes'>('semana')
  let itensAgenda = $state<AgendaItem[]>([])
  let sugestoes = $state<Sugestao[]>([])
  let sheetOpen = $state(false)
  let itemEmEdicao = $state<AgendaItem | null>(null)

  let diasDaSemana = $derived(calcularDiasDaSemana(semanaAtual))

  let itensPorDia = $derived(
    diasDaSemana.reduce((acc, dia) => {
      acc[dia.toISOString()] = itensAgenda.filter(item =>
        mesmoDia(new Date(item.dataHoraInicio), dia)
      )
      return acc
    }, {} as Record<string, AgendaItem[]>)
  )

  $effect(() => {
    carregarAgenda()
    carregarSugestoes()
  })

  function irParaSemana(delta: number) {
    const nova = new Date(semanaAtual)
    nova.setDate(nova.getDate() + delta * 7)
    semanaAtual = nova
  }
</script>
```

### AgendaItemSheet.svelte — FAB + Sheet padrão

```svelte
<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  let sheetOpen = $state(false)
  let profissionalPreSelecionado = $state<string | null>(null)

  // Pode ser chamado externamente via bind: ou evento
  export function abrirComProfissional(profissionalId: string) {
    profissionalPreSelecionado = profissionalId
    sheetOpen = true
  }
</script>

{#if sheetOpen}
  <div
    class="fixed inset-0 z-40 bg-black/40"
    transition:fade={{ duration: 200 }}
    onclick={() => sheetOpen = false}
  />
  <aside
    class="fixed right-0 top-0 z-50 h-full overflow-y-auto shadow-xl"
    style="width: min(480px, 100vw); background-color: #ffffff;"
    transition:fly={{ x: '100%', duration: 300, easing: cubicOut }}
  >
    <!-- Seções: Profissional · Data e Hora · Prioridade · Observações -->
    <div class="sticky bottom-0 flex gap-3 border-t p-4"
      style="background-color: #ffffff; border-color: #e5e7eb;">
      <button
        class="flex-1 h-10 rounded-lg border text-sm font-medium"
        style="border-color: #e5e7eb; color: #374151;"
        onclick={() => sheetOpen = false}
      >Cancelar</button>
      <button
        class="flex-1 h-10 rounded-lg text-sm font-medium text-white"
        style="background-color: #2563eb; border-radius: 8px;"
      >Salvar</button>
    </div>
  </aside>
{/if}

<button
  class="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center
         justify-center rounded-full text-white shadow-lg"
  style="background-color: #2563eb;"
  onclick={() => { itemEmEdicao = null; sheetOpen = true }}
  aria-label="Novo agendamento"
>+</button>
```

### PainelSugestoes.svelte

```svelte
<script lang="ts">
  const { sugestoes, onAgendar } = $props<{
    sugestoes: Sugestao[]
    onAgendar: (profissionalId: string) => void
  }>()
</script>

<aside class="w-56 flex-shrink-0 border-r"
  style="background-color: #ffffff; border-color: #e5e7eb;">
  <div class="p-3 border-b" style="border-color: #e5e7eb;">
    <p class="text-xs font-semibold uppercase tracking-wider"
      style="color: #6b7280;">Sugestões</p>
  </div>
  <ul class="divide-y" style="border-color: #e5e7eb;">
    {#each sugestoes as s}
      <li class="p-3">
        <p class="text-sm font-medium truncate" style="color: #111827;">
          {s.profissional.nome}
        </p>
        <p class="text-xs mt-0.5" style="color: #6b7280;">
          {s.diasSemVisita === null
            ? 'Nunca visitado'
            : `${s.diasSemVisita}d sem visita`}
        </p>
        <button
          class="mt-2 w-full h-7 rounded text-xs font-medium text-white"
          style="background-color: #2563eb;"
          onclick={() => onAgendar(s.profissional.id)}
        >Agendar</button>
      </li>
    {/each}
  </ul>
</aside>
```

---

## Variáveis de Ambiente

```env
# apps/web/.env
PUBLIC_API_URL=http://localhost:3002
```

Acessar via `import.meta.env.PUBLIC_API_URL` — nunca `process.env.NEXT_PUBLIC_`.

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
1.  [PLAN]    skill brainstorming → fórmula de sugestões, estrutura do calendário, drag-drop
2.  [PLAN]    skill write-plan → subtarefas atômicas numeradas

3.  [DB]      Migration: AgendaItem + enums StatusAgenda + PrioridadeAgenda
4.  [DB]      Adicionar relação inversa em Visita: agendaItems AgendaItem[]
5.  [DB]      pnpm --filter database prisma migrate dev --name agenda-inteligente
6.  [DB]      Verificar tabelas e índices no Prisma Studio

7.  [API RED] Testes falhando → POST /agenda
8.  [API GRN] Implementar POST /agenda
9.  [API RED] Testes falhando → GET /agenda (filtro por período)
10. [API GRN] Implementar GET /agenda
11. [API]     Ciclo TDD: GET/:id → PUT → DELETE (soft delete)
12. [API RED] Testes falhando → GET /agenda/sugestoes (fórmula de pontuação)
13. [API GRN] Implementar GET /agenda/sugestoes
14. [API RED] Testes falhando → PATCH /agenda/:id/vincular-visita
15. [API GRN] Implementar PATCH /agenda/:id/vincular-visita
16. [API RFT] Extrair lógica de pontuação em função pura testável

17. [WEB]     Carregar skill medivisitas-design antes de qualquer componente
18. [WEB]     AgendaItemCard.svelte — $props(), cores por prioridade e status
19. [WEB]     PainelSugestoes.svelte — $props(), botão agendar
20. [WEB]     AgendaItemSheet.svelte — FAB + fly/fade + $state para form
21. [WEB]     CalendarioSemanal.svelte — $state + $derived para grade e navegação
22. [WEB]     CalendarioMensal.svelte — $state para mês, dots de eventos
23. [WEB]     +page.server.ts (load SSR semana atual)
24. [WEB]     +page.svelte /dashboard/agenda (integração completa)

25. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 4

```
Banco de Dados
[ ] Migration aplicada sem erros
[ ] Tabela AgendaItem criada com todos os campos
[ ] Enums StatusAgenda e PrioridadeAgenda criados
[ ] Relação inversa agendaItems adicionada em Visita
[ ] Índices: userId, profissionalId, dataHoraInicio, status, deletedAt
[ ] onDelete: Restrict em todas as FKs
[ ] visitaId nullable (vinculado só após realização)

API
[ ] POST /agenda → 201
[ ] GET /agenda → filtrado por período + status + profissionalId
[ ] GET /agenda → nunca retorna deletedAt != null
[ ] GET /agenda/:id → detalhe com profissional incluído
[ ] PUT /agenda/:id → atualiza quando PLANEJADO
[ ] DELETE /agenda/:id → soft delete (seta deletedAt)
[ ] GET /agenda/sugestoes → pontuação correta pela fórmula
[ ] GET /agenda/sugestoes → exclui profissionais já agendados no período
[ ] GET /agenda/sugestoes → exclui profissionais FIDELIZADO e deletados
[ ] PATCH /agenda/:id/vincular-visita → valida mesmo profissionalId
[ ] PATCH /agenda/:id/vincular-visita → atualiza status para REALIZADO
[ ] userId sempre do token Clerk (nunca do body)
[ ] verifyClerkToken no preHandler de todas as rotas
[ ] Sem schema: nas rotas Fastify
[ ] Testes passando para todas as rotas

Frontend (SvelteKit + Svelte 5)
[ ] Zero stores clássicas — só $state/$derived/$effect
[ ] Zero <svelte:component> — só {@const} em {#each}
[ ] fly + fade + cubicOut na Sheet
[ ] FAB abre AgendaItemSheet em modo criação
[ ] Sheet edição com dados preenchidos
[ ] CalendarioSemanal exibe itens na grade por horário
[ ] Navegação anterior/próxima semana funciona com $state
[ ] CalendarioMensal exibe dots de eventos por dia
[ ] PainelSugestoes exibe profissionais priorizados
[ ] Botão "Agendar" no PainelSugestoes pré-preenche profissionalId no Sheet
[ ] AgendaItemCard exibe borda colorida por prioridade
[ ] Vincular visita realizada a um AgendaItem funciona
[ ] Nenhum hex hardcoded em componentes (CSS variables ou inline style nos cards)
[ ] Sheet lateral com fly — nunca modal centralizado
[ ] PUBLIC_API_URL no .env (não NEXT_PUBLIC_)

Geral
[ ] pnpm test → 100% passando
[ ] pnpm --filter @medivisitas/web build → sem erros TypeScript
[ ] pnpm --filter api build → sem erros TypeScript
[ ] skill verification-before-completion executada
[ ] CLAUDE.md: Fase 4 marcada como Concluída
```

---

## Comandos Úteis (PowerShell)

```powershell
# Migration
pnpm --filter database prisma migrate dev --name agenda-inteligente

# Prisma Studio
cd C:\Users\<usuario>\.vscode\projects\medivisitas\packages\database ; npx prisma studio

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

Ao concluir a Fase 4, o propagandista poderá:

1. Visualizar sua semana e mês em formato calendário
2. Criar agendamentos vinculados a profissionais específicos
3. Receber sugestões automáticas de quem visitar, priorizadas por potencial e tempo sem visita
4. Vincular uma visita realizada a um agendamento planejado
5. Visualizar rapidamente quais visitas estão atrasadas ou profissionais sem visita recente
6. Navegar entre semanas e meses com estado reativo ($state)
