# Fase 8 — Notificações + Lembretes Automáticos

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack frontend: **SvelteKit 2 + Svelte 5 Runes + Tailwind CSS v4**
> Pré-requisito: Fases 3, 4, 6 e 7 concluídas

---

## Objetivo da Fase

Implementar um sistema de notificações in-app e lembretes automáticos para o propagandista,
garantindo que nenhuma visita importante seja esquecida:

- Notificações in-app persistidas no banco (não push/email nesta fase)
- Lembretes automáticos gerados por jobs periódicos via Supabase Edge Functions
- Tipos de lembrete: visita agendada para hoje, profissional sem visita, visita atrasada
- Centro de notificações na sidebar com badge de contagem
- Marcação como lida individualmente ou em massa
- Histórico de notificações com paginação

---

## Entregáveis

| #   | Artefato                                                  | Localização                                                          |
| --- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Migration Prisma: `Notificacao`                           | `packages/database/prisma/migrations/`                               |
| 2   | `GET /notificacoes` — listagem com filtro lidas/não lidas | `apps/api/src/routes/notificacoes/list.ts`                           |
| 3   | `GET /notificacoes/contagem` — total não lidas            | `apps/api/src/routes/notificacoes/contagem.ts`                       |
| 4   | `PATCH /notificacoes/:id/lida` — marcar como lida         | `apps/api/src/routes/notificacoes/marcar-lida.ts`                    |
| 5   | `PATCH /notificacoes/marcar-todas-lidas` — marcar todas   | `apps/api/src/routes/notificacoes/marcar-todas.ts`                   |
| 6   | `DELETE /notificacoes/:id` — soft delete                  | `apps/api/src/routes/notificacoes/delete.ts`                         |
| 7   | Edge Function: `gerar-lembretes` — job diário             | `supabase/functions/gerar-lembretes/index.ts`                        |
| 8   | Sino de notificações na Sidebar                           | `apps/web/src/lib/components/layout/SinoNotificacoes.svelte`         |
| 9   | Painel dropdown de notificações                           | `apps/web/src/lib/components/notificacoes/PainelNotificacoes.svelte` |
| 10  | Item de notificação                                       | `apps/web/src/lib/components/notificacoes/ItemNotificacao.svelte`    |
| 11  | Página `/dashboard/notificacoes` — histórico completo     | `apps/web/src/routes/dashboard/notificacoes/+page.svelte`            |
| 12  | Server load da página                                     | `apps/web/src/routes/dashboard/notificacoes/+page.server.ts`         |
| 13  | Testes das rotas de API (TDD)                             | `apps/api/src/routes/notificacoes/*.test.ts`                         |

---

## Modelo de Dados (Prisma)

```prisma
// Acrescentar em packages/database/prisma/schema.prisma

enum TipoNotificacao {
  VISITA_HOJE          // agendamento para hoje
  VISITA_ATRASADA      // AgendaItem PLANEJADO vencido
  SEM_VISITA_30_DIAS   // profissional sem visita há 30+ dias
  SEM_VISITA_60_DIAS   // profissional sem visita há 60+ dias (urgente)
  PROSPECTADO_PENDENTE // profissional PROSPECTADO sem nenhuma visita
  SISTEMA              // mensagem administrativa
}

enum PrioridadeNotificacao {
  INFO
  NORMAL
  ALTA
  URGENTE
}

model Notificacao {
  id             String                @id @default(cuid())
  userId         String                // Clerk userId — sem FK
  tipo           TipoNotificacao
  prioridade     PrioridadeNotificacao @default(NORMAL)
  titulo         String
  mensagem       String
  lida           Boolean               @default(false)
  lidaEm         DateTime?
  // Referências opcionais — sem FK (evita Restrict em cascata)
  profissionalId String?
  agendaItemId   String?
  visitaId       String?
  // Soft delete padrão
  deletedAt      DateTime?
  createdAt      DateTime              @default(now())
  updatedAt      DateTime              @updatedAt

  @@index([userId])
  @@index([userId, lida])
  @@index([tipo])
  @@index([createdAt])
  @@index([deletedAt])
}
```

> **Regras obrigatórias:**
>
> - `Notificacao` com `deletedAt DateTime?` — soft delete padrão
> - `profissionalId`, `agendaItemId`, `visitaId` são **strings sem FK** — referências
>   opcionais para navegação, sem `onDelete: Restrict` (evita problemas se o registro
>   referenciado for deletado)
> - `userId` sem FK — Clerk é sistema externo
> - Índice composto `[userId, lida]` para query de contagem ser O(1)

---

## Contratos de API

### `GET /notificacoes` → 200

```
Query params:
  lida      Boolean   opcional — filtra por lida/não lida
  tipo      TipoNotificacao  opcional
  page      Int       default 1
  pageSize  Int       default 20 (max 50)

Response:
{
  "data": [
    {
      "id": "cuid...",
      "tipo": "VISITA_HOJE",
      "prioridade": "ALTA",
      "titulo": "Visita agendada para hoje",
      "mensagem": "Dr. João Silva — 14h00 — Apresentação de produto",
      "lida": false,
      "lidaEm": null,
      "profissionalId": "cuid...",
      "agendaItemId": "cuid...",
      "createdAt": "2026-04-06T06:00:00.000Z"
    }
  ],
  "total": 12,
  "naoLidas": 5,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### `GET /notificacoes/contagem` → 200

```json
{ "naoLidas": 5 }
```

### `PATCH /notificacoes/:id/lida` → 200

```json
// Body vazio — marca como lida e seta lidaEm = now()
{ "id": "cuid...", "lida": true, "lidaEm": "2026-04-06T10:00:00.000Z" }
```

### `PATCH /notificacoes/marcar-todas-lidas` → 200

```json
{ "atualizadas": 5 }
// Marca todas não lidas do userId como lidas
```

### `DELETE /notificacoes/:id` → 204

```
// Soft delete — seta deletedAt = now()
// Retorna 404 se não encontrada ou de outro userId
```

---

## Ordem de Registro das Rotas no Fastify

**IMPORTANTE** — registrar rotas estáticas antes das dinâmicas:

```typescript
// apps/api/src/routes/notificacoes/index.ts
router.get('/notificacoes/contagem', ...)          // 1. estática primeiro
router.patch('/notificacoes/marcar-todas-lidas', ...) // 2. estática antes de :id
router.get('/notificacoes', ...)                   // 3. listagem
router.patch('/notificacoes/:id/lida', ...)        // 4. dinâmica por último
router.delete('/notificacoes/:id', ...)            // 5. dinâmica por último
```

---

## Edge Function — Supabase: `gerar-lembretes`

A Edge Function é um job Deno executado via cron no Supabase.
Roda diariamente às **06:00 BRT** e gera notificações para todos os usuários.

```typescript
// supabase/functions/gerar-lembretes/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async () => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const ha30Dias = new Date();
  ha30Dias.setDate(ha30Dias.getDate() - 30);
  const ha60Dias = new Date();
  ha60Dias.setDate(ha60Dias.getDate() - 60);

  const notificacoesParaCriar: NotificacaoInsert[] = [];

  // 1. VISITA_HOJE — AgendaItems PLANEJADO com dataHoraInicio hoje
  const { data: agendaHoje } = await supabase
    .from("AgendaItem")
    .select(
      "id, userId, dataHoraInicio, profissionalId, profissional:Profissional(nome)",
    )
    .eq("status", "PLANEJADO")
    .is("deletedAt", null)
    .gte("dataHoraInicio", hoje.toISOString())
    .lt("dataHoraInicio", amanha.toISOString());

  for (const item of agendaHoje ?? []) {
    notificacoesParaCriar.push({
      userId: item.userId,
      tipo: "VISITA_HOJE",
      prioridade: "ALTA",
      titulo: "Visita agendada para hoje",
      mensagem: `${item.profissional.nome} — ${formatarHora(item.dataHoraInicio)}`,
      profissionalId: item.profissionalId,
      agendaItemId: item.id,
    });
  }

  // 2. VISITA_ATRASADA — AgendaItems PLANEJADO vencidos
  const { data: atrasados } = await supabase
    .from("AgendaItem")
    .select(
      "id, userId, dataHoraInicio, profissionalId, profissional:Profissional(nome)",
    )
    .eq("status", "PLANEJADO")
    .is("deletedAt", null)
    .lt("dataHoraInicio", hoje.toISOString());

  for (const item of atrasados ?? []) {
    notificacoesParaCriar.push({
      userId: item.userId,
      tipo: "VISITA_ATRASADA",
      prioridade: "URGENTE",
      titulo: "Visita não realizada",
      mensagem: `Agendamento com ${item.profissional.nome} não foi registrado como realizado`,
      profissionalId: item.profissionalId,
      agendaItemId: item.id,
    });
  }

  // 3. SEM_VISITA_30_DIAS e SEM_VISITA_60_DIAS
  // Implementar via query SQL raw no Supabase para performance

  // Inserir todas as notificações em batch
  if (notificacoesParaCriar.length > 0) {
    await supabase.from("Notificacao").insert(notificacoesParaCriar);
  }

  return new Response(
    JSON.stringify({ geradas: notificacoesParaCriar.length }),
    { headers: { "Content-Type": "application/json" } },
  );
});
```

### Configuração do Cron no Supabase

```toml
# supabase/config.toml — adicionar:
[functions.gerar-lembretes]
verify_jwt = false

# supabase/functions/gerar-lembretes/config.toml
[schedule]
cron = "0 9 * * *"  # 06:00 BRT = 09:00 UTC
```

> **Observação:** Para não gerar notificações duplicadas, antes de inserir
> verificar se já existe notificação do mesmo `tipo` + `agendaItemId` (ou
> `profissionalId`) criada hoje para o mesmo `userId`.

---

## Estrutura de Pastas — SvelteKit

```
apps/web/src/
├── routes/dashboard/notificacoes/
│   ├── +page.svelte           ← histórico completo paginado
│   └── +page.server.ts        ← load SSR
└── lib/components/
    ├── layout/
    │   └── SinoNotificacoes.svelte   ← sino + badge na sidebar
    └── notificacoes/
        ├── PainelNotificacoes.svelte ← dropdown com lista
        └── ItemNotificacao.svelte    ← item individual

supabase/
└── functions/
    └── gerar-lembretes/
        └── index.ts
```

---

## Padrões de UI — Svelte 5 + Design System (SKILL.md)

### Regras invioláveis

- Fundo `#f8f9fa` — nunca branco puro
- Azul `#2563eb` — botões primários
- **CSS Variables** — nunca hex hardcoded em componentes
- **`$state`, `$derived`, `$effect`** — nunca stores clássicas para estado local
- **`{@const}`** em `{#each}` — nunca `<svelte:component>`
- **`fly` + `fade` + `cubicOut`** no painel dropdown
- Micro-interações nos itens: `transition-colors duration-200`

### Cores por Prioridade

```
INFO:    bg #eff6ff · color #1e40af · ícone: Info
NORMAL:  bg #fef3c7 · color #92400e · ícone: Bell
ALTA:    bg #fee2e2 · color #991b1b · ícone: AlertTriangle
URGENTE: bg #fef2f2 · color #7f1d1d · ícone: AlertCircle
```

### SinoNotificacoes.svelte — sino na sidebar

```svelte
<script lang="ts">
  import { Bell } from 'lucide-svelte'
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  const { sessionToken } = $props<{ sessionToken: string | null }>()

  let naoLidas = $state(0)
  let painelAberto = $state(false)

  // Polling leve a cada 60s para atualizar badge
  $effect(() => {
    carregarContagem()
    const intervalo = setInterval(carregarContagem, 60_000)
    return () => clearInterval(intervalo)
  })

  async function carregarContagem() {
    const res = await fetch(
      `${import.meta.env.PUBLIC_API_URL}/notificacoes/contagem`,
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    )
    if (res.ok) {
      const data = await res.json()
      naoLidas = data.naoLidas
    }
  }
</script>

<div class="relative">
  <button
    class="relative flex items-center justify-center w-8 h-8 rounded-md
           transition-colors duration-200 hover:bg-gray-100"
    onclick={() => painelAberto = !painelAberto}
    aria-label="Notificações"
  >
    <Bell class="w-4 h-4" style="color: #6b7280;" />

    {#if naoLidas > 0}
      <span
        class="absolute -top-0.5 -right-0.5 flex items-center justify-center
               w-4 h-4 rounded-full text-white text-[10px] font-bold"
        style="background-color: #dc2626;"
      >
        {naoLidas > 9 ? '9+' : naoLidas}
      </span>
    {/if}
  </button>

  {#if painelAberto}
    <div
      class="fixed inset-0 z-40"
      onclick={() => painelAberto = false}
      transition:fade={{ duration: 150 }}
    />
    <div
      class="absolute right-0 top-10 z-50 w-80 rounded-xl border shadow-xl overflow-hidden"
      style="background-color: #ffffff; border-color: #e5e7eb;"
      transition:fly={{ y: -8, duration: 200, easing: cubicOut }}
    >
      <PainelNotificacoes
        {sessionToken}
        onFechar={() => painelAberto = false}
        onContagemAtualizada={(n) => naoLidas = n}
      />
    </div>
  {/if}
</div>
```

### PainelNotificacoes.svelte

```svelte
<script lang="ts">
  const { sessionToken, onFechar, onContagemAtualizada } = $props<{
    sessionToken: string | null
    onFechar: () => void
    onContagemAtualizada: (n: number) => void
  }>()

  let notificacoes = $state<Notificacao[]>([])
  let loading = $state(true)

  let naoLidasCount = $derived(notificacoes.filter(n => !n.lida).length)

  $effect(() => {
    onContagemAtualizada(naoLidasCount)
  })

  $effect(() => {
    carregarNotificacoes()
  })

  async function marcarTodasLidas() {
    await fetch(`${import.meta.env.PUBLIC_API_URL}/notificacoes/marcar-todas-lidas`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${sessionToken}` }
    })
    notificacoes = notificacoes.map(n => ({ ...n, lida: true }))
  }
</script>

<!-- Header -->
<div class="flex items-center justify-between px-4 py-3 border-b"
  style="border-color: #e5e7eb;">
  <p class="text-sm font-semibold" style="color: #111827;">
    Notificações
    {#if naoLidasCount > 0}
      <span class="ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium text-white"
        style="background-color: #2563eb;">{naoLidasCount}</span>
    {/if}
  </p>
  {#if naoLidasCount > 0}
    <button
      class="text-xs font-medium transition-colors duration-200"
      style="color: #2563eb;"
      onclick={marcarTodasLidas}
    >
      Marcar todas como lidas
    </button>
  {/if}
</div>

<!-- Lista -->
<div class="max-h-96 overflow-y-auto divide-y" style="border-color: #f3f4f6;">
  {#if loading}
    <div class="flex items-center justify-center py-8">
      <p class="text-sm" style="color: #9ca3af;">Carregando...</p>
    </div>
  {:else if notificacoes.length === 0}
    <div class="flex flex-col items-center justify-center py-8 gap-2">
      <Bell class="w-8 h-8" style="color: #e5e7eb;" />
      <p class="text-sm" style="color: #9ca3af;">Nenhuma notificação</p>
    </div>
  {:else}
    {#each notificacoes as notif}
      <ItemNotificacao
        {notif}
        {sessionToken}
        onLida={() => {
          notificacoes = notificacoes.map(n =>
            n.id === notif.id ? { ...n, lida: true } : n
          )
        }}
        onDeletada={() => {
          notificacoes = notificacoes.filter(n => n.id !== notif.id)
        }}
      />
    {/each}
  {/if}
</div>

<!-- Footer -->
<div class="border-t px-4 py-2.5" style="border-color: #e5e7eb;">
  <a
    href="/dashboard/notificacoes"
    class="text-xs font-medium block text-center transition-colors duration-200"
    style="color: #2563eb;"
    onclick={onFechar}
  >
    Ver histórico completo →
  </a>
</div>
```

### ItemNotificacao.svelte

```svelte
<script lang="ts">
  import { Bell, AlertTriangle, AlertCircle, Info, X } from 'lucide-svelte'

  const { notif, sessionToken, onLida, onDeletada } = $props<{
    notif: Notificacao
    sessionToken: string | null
    onLida: () => void
    onDeletada: () => void
  }>()

  const iconeMap = {
    INFO:    Info,
    NORMAL:  Bell,
    ALTA:    AlertTriangle,
    URGENTE: AlertCircle,
  }

  const corMap = {
    INFO:    '#3b82f6',
    NORMAL:  '#f59e0b',
    ALTA:    '#ef4444',
    URGENTE: '#dc2626',
  }

  async function marcarLida() {
    await fetch(
      `${import.meta.env.PUBLIC_API_URL}/notificacoes/${notif.id}/lida`,
      { method: 'PATCH', headers: { Authorization: `Bearer ${sessionToken}` } }
    )
    onLida()
  }

  async function deletar() {
    await fetch(
      `${import.meta.env.PUBLIC_API_URL}/notificacoes/${notif.id}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${sessionToken}` } }
    )
    onDeletada()
  }
</script>

<div
  class="flex items-start gap-3 px-4 py-3 transition-colors duration-200
         {notif.lida ? '' : 'bg-blue-50/40'} hover:bg-gray-50 cursor-default"
  onclick={!notif.lida ? marcarLida : undefined}
>
  {@const Icon = iconeMap[notif.prioridade]}
  {@const cor = corMap[notif.prioridade]}

  <!-- Ícone com ponto de não lida -->
  <div class="relative flex-shrink-0 mt-0.5">
    <Icon class="w-4 h-4" style="color: {cor};" />
    {#if !notif.lida}
      <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
        style="background-color: #2563eb;"></span>
    {/if}
  </div>

  <!-- Conteúdo -->
  <div class="flex-1 min-w-0">
    <p class="text-xs font-semibold {notif.lida ? '' : 'font-medium'}"
      style="color: {notif.lida ? '#6b7280' : '#111827'};">
      {notif.titulo}
    </p>
    <p class="text-xs mt-0.5 truncate" style="color: #9ca3af;">
      {notif.mensagem}
    </p>
    <p class="text-[10px] mt-1" style="color: #d1d5db;">
      {formatarTempoRelativo(notif.createdAt)}
    </p>
  </div>

  <!-- Botão deletar -->
  <button
    class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded
           transition-all duration-200 hover:bg-gray-200"
    onclick|stopPropagation={deletar}
    aria-label="Remover notificação"
  >
    <X class="w-3 h-3" style="color: #9ca3af;" />
  </button>
</div>
```

---

## Integração na Sidebar

```svelte
<!-- apps/web/src/lib/components/layout/Sidebar.svelte -->
<!-- Adicionar SinoNotificacoes no footer, ao lado do avatar -->

<div class="p-3 border-t flex items-center justify-between"
  style="border-color: #e5e7eb;">
  <div class="flex items-center gap-2 min-w-0">
    <div class="w-7 h-7 rounded-full flex items-center justify-center
                text-xs font-semibold text-white flex-shrink-0"
      style="background-color: #2563eb;">
      {usuario.iniciais}
    </div>
    <span class="text-sm truncate" style="color: #374151;">{usuario.nome}</span>
  </div>
  <div class="flex items-center gap-1 flex-shrink-0">
    <SinoNotificacoes {sessionToken} />
    <button
      class="flex items-center p-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100"
      onclick={sair}
      aria-label="Sair"
    >
      <LogOut class="w-4 h-4" style="color: #9ca3af;" />
    </button>
  </div>
</div>
```

---

## Página de Histórico — `/dashboard/notificacoes`

```svelte
<!-- Layout da página -->
<div class="p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-semibold" style="color: #111827;">Notificações</h1>
      <p class="text-sm mt-0.5" style="color: #6b7280;">
        {total} notificação(ões) · {naoLidas} não lida(s)
      </p>
    </div>
    <div class="flex items-center gap-3">
      <!-- Filtro lidas/não lidas -->
      <select bind:value={filtroLida} class="h-9 px-3 text-sm rounded-lg border"
        style="border-color: #e5e7eb; background-color: #ffffff;">
        <option value="">Todas</option>
        <option value="false">Não lidas</option>
        <option value="true">Lidas</option>
      </select>
      {#if naoLidas > 0}
        <button
          class="h-9 px-4 rounded-lg text-sm font-medium text-white"
          style="background-color: #2563eb; border-radius: 8px;"
          onclick={marcarTodasLidas}
        >
          Marcar todas como lidas
        </button>
      {/if}
    </div>
  </div>

  <!-- Lista paginada -->
  <div class="rounded-xl border overflow-hidden"
    style="background-color: #ffffff; border-color: #e5e7eb;">
    {#each notificacoes as notif}
      <ItemNotificacao {notif} {sessionToken}
        onLida={...} onDeletada={...} />
    {/each}
  </div>

  <!-- Paginação simples -->
  {#if totalPages > 1}
    <div class="flex items-center justify-center gap-3 mt-6">
      <button disabled={page === 1} onclick={() => page--}>← Anterior</button>
      <span class="text-sm" style="color: #6b7280;">{page} / {totalPages}</span>
      <button disabled={page === totalPages} onclick={() => page++}>Próxima →</button>
    </div>
  {/if}
</div>
```

---

## Variáveis de Ambiente

```env
# apps/web/.env
PUBLIC_API_URL=http://localhost:3002

# supabase/.env (para Edge Function local)
SUPABASE_URL=https://iediyaalqoukolmfrboq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

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
| `supabase-edge-functions`          | supabase/agent-skills | ✅ Sim — Edge Function        |

---

## Sequência de Implementação (TDD)

```
1.  [PLAN]    skill brainstorming → modelo, deduplicação de lembretes, polling vs SSE
2.  [PLAN]    skill write-plan → subtarefas atômicas

3.  [DB]      Migration: Notificacao + enums TipoNotificacao + PrioridadeNotificacao
4.  [DB]      pnpm --filter database prisma migrate dev --name notificacoes
5.  [DB]      Verificar tabela e índices no Prisma Studio

6.  [API RED] Testes falhando → GET /notificacoes (filtros + paginação)
7.  [API GRN] Implementar GET /notificacoes
8.  [API RED] Testes falhando → GET /notificacoes/contagem
9.  [API GRN] Implementar GET /notificacoes/contagem
10. [API RED] Testes falhando → PATCH /notificacoes/:id/lida
11. [API GRN] Implementar PATCH /notificacoes/:id/lida
12. [API RED] Testes falhando → PATCH /notificacoes/marcar-todas-lidas
13. [API GRN] Implementar PATCH /notificacoes/marcar-todas-lidas
14. [API RED] Testes falhando → DELETE /notificacoes/:id (soft delete)
15. [API GRN] Implementar DELETE /notificacoes/:id
16. [API RFT] Garantir ordem de registro das rotas (estáticas antes de :id)

17. [EDGE]    Implementar gerar-lembretes/index.ts com deduplicação
18. [EDGE]    Testar localmente: supabase functions serve gerar-lembretes
19. [EDGE]    Configurar cron no supabase/config.toml

20. [WEB]     Carregar skill medivisitas-design antes de qualquer componente
21. [WEB]     ItemNotificacao.svelte — $props, cores por prioridade, {@const}
22. [WEB]     PainelNotificacoes.svelte — $state, $derived para contagem, marcar todas
23. [WEB]     SinoNotificacoes.svelte — $state, $effect para polling 60s, fly+fade
24. [WEB]     Integrar SinoNotificacoes na Sidebar (footer, ao lado do logout)
25. [WEB]     +page.server.ts /dashboard/notificacoes
26. [WEB]     +page.svelte /dashboard/notificacoes — lista paginada + filtros

27. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 8

```
Banco de Dados
[ ] Migration aplicada sem erros
[ ] Tabela Notificacao com todos os campos
[ ] Enums TipoNotificacao e PrioridadeNotificacao criados
[ ] profissionalId, agendaItemId, visitaId sem FK (strings nullable)
[ ] Índice composto [userId, lida] criado
[ ] deletedAt DateTime? — soft delete padrão

API
[ ] Rotas estáticas registradas antes de rotas com :id
[ ] GET /notificacoes → paginação + filtros (lida, tipo)
[ ] GET /notificacoes → nunca retorna deletedAt != null
[ ] GET /notificacoes/contagem → retorna { naoLidas: N }
[ ] PATCH /notificacoes/:id/lida → seta lida=true + lidaEm=now()
[ ] PATCH /notificacoes/marcar-todas-lidas → retorna { atualizadas: N }
[ ] DELETE /notificacoes/:id → soft delete, 404 para outro userId
[ ] Todos endpoints filtram por userId do token
[ ] verifyClerkToken em todas as rotas
[ ] Sem schema: nas rotas Fastify
[ ] Testes passando

Edge Function
[ ] gerar-lembretes gera VISITA_HOJE para AgendaItems do dia
[ ] gerar-lembretes gera VISITA_ATRASADA para AgendaItems vencidos
[ ] gerar-lembretes não duplica notificação do mesmo tipo+referência no mesmo dia
[ ] Cron configurado para 09:00 UTC (06:00 BRT)
[ ] Testado localmente com supabase functions serve

Frontend (SvelteKit + Svelte 5)
[ ] SinoNotificacoes exibe badge com contagem não lidas
[ ] Badge some quando naoLidas === 0
[ ] Badge mostra "9+" para mais de 9 não lidas
[ ] Polling de 60s atualiza badge sem recarregar página
[ ] $effect limpa o intervalo ao destruir componente (return clearInterval)
[ ] PainelNotificacoes abre com fly+fade ao clicar no sino
[ ] Painel fecha ao clicar fora (overlay invisible)
[ ] "Marcar todas como lidas" funciona e atualiza UI
[ ] ItemNotificacao: ponto azul visível para não lidas
[ ] ItemNotificacao: clique marca como lida
[ ] ItemNotificacao: botão X deleta (soft delete)
[ ] Página /notificacoes: lista paginada com filtros
[ ] Zero stores clássicas — $state/$derived/$effect
[ ] {@const} em {#each} — zero <svelte:component>
[ ] fly + fade + cubicOut no painel
[ ] Nenhum hex hardcoded em componentes
[ ] PUBLIC_API_URL (não NEXT_PUBLIC_)

Geral
[ ] pnpm test → 100% passando
[ ] pnpm --filter @medivisitas/web build → sem erros TypeScript
[ ] pnpm --filter api build → sem erros TypeScript
[ ] skill verification-before-completion executada
[ ] CLAUDE.md: Fase 8 marcada como Concluída
```

---

## Comandos Úteis (PowerShell)

```powershell
# Migration
pnpm --filter database prisma migrate dev --name notificacoes

# Prisma Studio
cd C:\Users\<usuario>\.vscode\projects\medivisitas\packages\database ; npx prisma studio

# API (porta 3002)
pnpm --filter api dev

# Frontend SvelteKit (porta 5173)
pnpm --filter @medivisitas/web dev

# Edge Function local (requer Supabase CLI)
supabase functions serve gerar-lembretes --env-file supabase/.env

# Deploy da Edge Function
supabase functions deploy gerar-lembretes

# Testes
pnpm --filter api test
pnpm --filter @medivisitas/web build
```

---

## Resultado Esperado

Ao concluir a Fase 8, o propagandista terá:

1. Badge no sino da sidebar mostrando quantas notificações não lidas existem
2. Dropdown rápido com as últimas notificações ao clicar no sino
3. Notificações automáticas geradas todo dia às 06h: visitas do dia, atrasos, profissionais sem visita
4. Possibilidade de marcar notificações individualmente ou todas como lidas
5. Histórico completo de notificações em `/dashboard/notificacoes` com filtros e paginação
6. Limpeza de notificações via soft delete sem perder histórico
