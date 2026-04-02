# MediVisitas — CLAUDE.md

> CRM para propagandistas farmacêuticos
> Ambiente: Windows / PowerShell / pnpm monorepo

---

## Stack Completa

| Camada          | Tecnologia                    |
| --------------- | ----------------------------- |
| Frontend        | SvelteKit 2 (Svelte 5 Runes)  |
| Styling         | Tailwind CSS v4 (CSS-first)   |
| Backend         | Fastify 4.28                  |
| ORM             | Prisma 5.22                   |
| Banco           | PostgreSQL via Supabase       |
| Auth            | Clerk (`@clerk/backend` v1.8) |
| IA / Áudio      | MiniMax 2.7 (Fase 5)          |
| Package Manager | pnpm (monorepo)               |

---

## Regras de Domínio — Críticas

### Dados de Pacientes / Profissionais

- **Soft delete obrigatório** — nunca `DELETE`; usar `deletedAt: new Date()`.
  - Locais: todas entidades de negócio (`Especialidade`, `Profissional`, `Endereco`, `ContatoProfissional`).
  - **Exceção**: `EstagioLog` é **imutável** por design — sem `deletedAt`, sem `updatedAt`.
- `onDelete: Restrict` em **todas** as FKs — nunca `Cascade`.
- `Decimal(15,2)` para valores monetários/comissões.
- Campos de auditoria obrigatórios: `createdAt`, `updatedAt`, `deletedAt?`.

### Datas/Horas de Visitas

- Sempre `DateTime` com `@default(now())` — nunca string.
- Visitas nunca são deletadas — apenas canceladas (campo `status`).

### Autenticação e Autorização

- Backend: Clerk JWT em `preHandler` hook — **nunca inline** nas rotas.
- Frontend: `hooks.server.ts` valida JWT do Clerk via `verifyToken` e injeta `event.locals.userId`.
- Verificar `userId` em **toda** rota protegida.

### UI/UX

- **CSS Variables para todas as cores** — nunca hex hardcoded.
- **Tailwind v4 @theme** para design tokens (cores, fontes, radius).
- **FAB + Sheet lateral** para create/edit — nunca modal centralizado.
- **View Transitions API** via `onNavigate` no layout root.
- **svelte/transition** (fly, fade, scale) para Sheet, Toast e ConfirmDialog.
- Botões: usar componente `Button.svelte` com variantes (default, outline, ghost, destructive).
- Svelte 5 Runes: usar `$state`, `$derived`, `$effect` — nunca stores reativas clássicas para estado local.
- Componentes dinâmicos: `{@const Icon = item.icon}` no bloco `{#each}`, nunca `<svelte:component>`.

### Pipeline Comercial

```
Prospectado → Visitado → Interessado → Prescritor → Fidelizado
```

- Cada profissional tem **exatamente um** estágio ativo.
- Transições em `EstagioLog` (imutável).

---

## Comandos Essenciais

```powershell
# Dev
pnpm --filter @medivisitas/web dev   # Frontend SvelteKit (porta 5173)
pnpm dev:api                          # Backend Fastify (porta 3002)

# Build
pnpm --filter @medivisitas/web build  # Build SvelteKit

# Database
pnpm --filter database prisma migrate dev   # Migration
pnpm --filter database prisma generate      # Gerar cliente

# PowerShell
Get-NetTCPConnection -LocalPort <porta>    # Ver porta
Stop-Process -Id (Get-NetTCPConnection -LocalPort <porta>).OwningProcess  # Matar processo
```

---

## Pipeline de 10 Fases

| Fase | Escopo                             | Status       |
| ---- | ---------------------------------- | ------------ |
| 1    | Setup + Autenticação (Clerk)       | ✅ Concluída |
| 2    | Cadastro profissionais + Potencial | ✅ Concluída |
| 3    | Histórico de visitas + Materiais   | ✅ Concluída |
| 4    | Agenda inteligente                 | ⬜ Pendente  |
| 5    | IA — transcrição MiniMax 2.7       | ⬜ Pendente  |
| 6    | Dashboard + CRM avançado           | ⬜ Pendente  |
| 7    | Pipeline comercial + Analytics     | ⬜ Pendente  |
| 8    | Notificações + Lembretes           | ⬜ Pendente  |
| 9    | Integração API farmácia            | ⬜ Pendente  |
| 10   | Multi-tenant SaaS                  | ⬜ Pendente  |

---

## Checklist de Qualidade (por feature)

- [ ] Soft delete (`deletedAt DateTime?`)
- [ ] FK com `onDelete: Restrict`
- [ ] Validação Zod na rota Fastify
- [ ] Hook Clerk no preHandler
- [ ] CSS via variáveis (sem hex hardcoded)
- [ ] FAB + Sheet para create/edit
- [ ] TDD: testes antes do código
- [ ] `verification-before-completion` antes de encerrar

---

## Referências Detalhadas

| Módulo      | Referência                                        |
| ----------- | ------------------------------------------------- |
| Backend     | `apps/api/README.md`                              |
| Frontend    | `apps/web/README.md`                              |
| Banco       | `packages/database/README.md`                     |
| Convenções  | `.claude/skills/medivisitas-conventions/SKILL.md` |
| Entidades   | `.claude/skills/domain-model/refs/entities.md`    |
| Verificação | `.claude/skills/verify-app/SKILL.md`              |

---

## Histórico de Correções

<!-- Formato: "- [YYYY-MM-DD] Problema → Solução correta" -->

- [2026-03-25] `clerkClient.verifyToken` deprecado → usar `verifyToken` direto de `@clerk/backend`
- [2026-03-25] Clerk middleware novo (API v5) → `clerkMiddleware` + `createRouteMatcher`
- [2026-03-25] Prisma 7.x breaking changes → Prisma 5.22.0 fixo
- [2026-03-25] Enum string literals no frontend para evitar dependência circular com Prisma
- [2026-04-01] Migração frontend Next.js 14 → SvelteKit 2 + Svelte 5 + Tailwind v4
- [2026-04-01] `svelte:component` deprecado em Svelte 5 → usar `{@const Icon = item.icon}` no bloco `{#each}`
- [2026-04-01] `{@const}` inválido dentro de `<a>` → mover para nível do bloco `{#each}`
- [2026-04-01] SvelteKit env vars: usar `PUBLIC_` prefix (não `NEXT_PUBLIC_`)

## Design System

Para TODA tarefa de frontend carregue obrigatoriamente:
**Skill:** `medivisitas-design`

Invoke: "Use the medivisitas-design skill before writing any UI code."

### Regras visuais críticas
- Fundo da aplicação: #f8f9fa — nunca branco puro
- Azul #2563eb para botões primários e itens ativos
- Estágios são unidirecionais — nunca regredir
- AlertDialog obrigatório para ações destrutivas
- EstagioLog é imutável — nunca editar ou deletar