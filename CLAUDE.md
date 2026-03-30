# MediVisitas — CLAUDE.md

> CRM para propagandistas farmacêuticos
> Ambiente: Windows / PowerShell / pnpm monorepo

---

## Stack Completa

| Camada          | Tecnologia                    |
| --------------- | ----------------------------- |
| Frontend        | Next.js 14 (App Router)       |
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
- Frontend: `clerkMiddleware` + `createRouteMatcher` (API Clerk v5).
- Verificar `userId` em **toda** rota protegida.

### UI/UX

- **CSS Variables para todas as cores** — nunca hex hardcoded.
- **FAB + Sheet lateral** para create/edit — nunca modal centralizado.
- `DropdownMenuContent` com `style` inline para `backgroundColor`.
- Botões: `style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '8px' }}`.
- Optgroup em selects para separar categorias.

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
pnpm dev                  # Frontend (Next.js, porta 3000)
pnpm dev:api              # Backend (Fastify, porta 3001)
pnpm build                # Build completo monorepo

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
| 3    | Histórico de visitas + Materiais   | ⬜ Pendente  |
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
