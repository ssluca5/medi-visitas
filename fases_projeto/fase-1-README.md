# Fase 1 — Setup + Autenticação (Clerk)

> MediVisitas · CRM para propagandistas farmacêuticos  
> Módulo: `apps/web` + `apps/api` + `packages/database`

---

## Objetivo da Fase

Estabelecer a base do monorepo e implementar autenticação completa com Clerk, incluindo:

- Estrutura de pastas e configuração do monorepo pnpm
- Schema Prisma inicial (`User`, `Organization`)
- Backend Fastify com hook de verificação JWT Clerk
- Frontend Next.js 14 com App Router, telas de Login / Signup / Dashboard shell
- Design system base (CSS Variables, tipografia, paleta)

---

## Entregáveis

| # | Artefato | Localização |
|---|----------|-------------|
| 1 | `pnpm-workspace.yaml` configurado | `/` |
| 2 | `packages/database/prisma/schema.prisma` com `User` + `Organization` | `packages/database/` |
| 3 | Migration inicial aplicada no Supabase | `packages/database/prisma/migrations/` |
| 4 | Plugin Clerk no Fastify (`preHandler` hook) | `apps/api/src/hooks/auth.ts` |
| 5 | Rota `GET /me` protegida | `apps/api/src/routes/me.ts` |
| 6 | Middleware Clerk no Next.js (`middleware.ts`) | `apps/web/` |
| 7 | Páginas `/login`, `/signup`, `/dashboard` (shell) | `apps/web/app/` |
| 8 | Design system: CSS Variables + tema base | `apps/web/app/globals.css` |
| 9 | Testes da rota `/me` (TDD) | `apps/api/src/routes/me.test.ts` |

---

## Modelo de Dados (Prisma)

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  clerkId   String    @unique
  email     String    @unique
  name      String?
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([clerkId])
}

model Organization {
  id        String    @id @default(cuid())
  clerkOrgId String   @unique
  name      String
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

> **Regras obrigatórias do CLAUDE.md aplicadas:**
> - `deletedAt DateTime?` em todas as entidades (soft delete)
> - Sem `onDelete: Cascade` — FKs futuras usarão `Restrict`
> - Campos de auditoria: `createdAt`, `updatedAt`, `deletedAt`

---

## Estrutura de Pastas Esperada ao Final da Fase

```
medivisitas/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── signup/page.tsx
│   │   │   ├── (protected)/
│   │   │   │   └── dashboard/page.tsx
│   │   │   ├── globals.css          ← CSS Variables + tema
│   │   │   └── layout.tsx           ← ClerkProvider
│   │   ├── middleware.ts             ← authMiddleware Clerk
│   │   ├── .env.local
│   │   └── package.json
│   └── api/
│       ├── src/
│       │   ├── hooks/
│       │   │   └── auth.ts           ← verifyClerkToken
│       │   ├── routes/
│       │   │   └── me.ts             ← GET /me
│       │   ├── plugins/
│       │   │   └── clerk.ts
│       │   └── server.ts
│       ├── .env
│       └── package.json
├── packages/
│   └── database/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── src/
│       │   └── index.ts             ← export PrismaClient
│       └── package.json
├── CLAUDE.md
└── pnpm-workspace.yaml
```

---

## Variáveis de Ambiente

### `apps/web/.env.local`
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### `apps/api/.env`
```env
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
PORT=3001
```

---

## Design System — CSS Variables Base

```css
/* apps/web/app/globals.css */
:root {
  /* Paleta principal — azul farmacêutico profissional */
  --color-brand-50:  240 248 255;
  --color-brand-100: 219 238 255;
  --color-brand-500: 37 99 235;
  --color-brand-600: 29 78 216;
  --color-brand-900: 30 58 138;

  /* Neutros */
  --color-surface:   255 255 255;
  --color-surface-2: 248 250 252;
  --color-border:    226 232 240;
  --color-text:      15 23 42;
  --color-text-muted: 100 116 139;

  /* Semânticos */
  --accent: var(--color-brand-500);
  --radius: 8px;
}

[data-theme="dark"] {
  --color-surface:   15 23 42;
  --color-surface-2: 30 41 59;
  --color-border:    51 65 85;
  --color-text:      248 250 252;
  --color-text-muted: 148 163 184;
}
```

> **Regra do CLAUDE.md:** nunca usar hex hardcoded em componentes — sempre `rgb(var(--nome))`.

---

## Padrões de UI para esta Fase

| Elemento | Implementação |
|----------|--------------|
| Botão primário | `style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '8px' }}` |
| Cards | `style={{ backgroundColor: 'rgb(var(--color-surface-2))', border: '1px solid rgb(var(--color-border))' }}` |
| Formulários de auth | Usar componentes nativos do Clerk (`<SignIn />`, `<SignUp />`) com `appearance` customizado |
| Dashboard shell | Sidebar fixa esquerda + área de conteúdo principal |
| FAB | Presente no dashboard shell (preparação para Fase 2) |

---

## Skills Necessárias para esta Fase

Verificar instalação em `.kilocode/skills/` antes de iniciar:

| Skill | Repositório | Obrigatória |
|-------|-------------|-------------|
| `brainstorming` | obra/superpowers | ✅ Sim — antes de qualquer feature |
| `write-plan` | obra/superpowers | ✅ Sim — planejar antes de codificar |
| `test-driven-development` | obra/superpowers | ✅ Sim — todo código de lógica |
| `verification-before-completion` | obra/superpowers | ✅ Sim — antes de encerrar sessão |
| `frontend-design` | anthropics/skills | ✅ Sim — UI/UX |
| `fastify` | mcollina/skills | ✅ Sim — rotas e plugins |
| `node` | mcollina/skills | ✅ Sim — async patterns |
| `oauth` | mcollina/skills | ✅ Sim — fluxo Clerk JWT |
| `supabase-postgres-best-practices` | supabase/agent-skills | ✅ Sim — migrations |

---

## Sequência de Implementação (TDD)

```
1. [PLAN]    Rodar skill `brainstorming` → levantar decisões de arquitetura
2. [PLAN]    Rodar skill `write-plan` → decompor em subtarefas atômicas
3. [DB]      Escrever migration Prisma → aplicar no Supabase → verificar
4. [API RED] Escrever teste falhando para GET /me
5. [API GRN] Implementar rota GET /me + hook verifyClerkToken
6. [API RFT] Refatorar + garantir tipagem Zod
7. [WEB]     Configurar ClerkProvider no layout.tsx
8. [WEB]     Implementar middleware.ts
9. [WEB]     Páginas /login e /signup com componentes Clerk customizados
10.[WEB]     Dashboard shell (sidebar + área de conteúdo)
11.[VER]     Rodar skill `verification-before-completion`
```

---

## Checklist de Conclusão da Fase 1

- [ ] `pnpm install` sem erros no monorepo completo
- [ ] Migration Prisma aplicada — tabelas `User` e `Organization` criadas no Supabase
- [ ] `GET /me` retorna `{ id, email, name }` com token Clerk válido
- [ ] `GET /me` retorna `401` sem token ou com token inválido
- [ ] Login/Signup funcionam via Clerk
- [ ] Redirect para `/dashboard` após autenticação
- [ ] Dashboard shell carrega corretamente (rotas protegidas)
- [ ] CSS Variables definidas — nenhum hex hardcoded em componentes
- [ ] Todos os testes passando (`pnpm test`)
- [ ] Skill `verification-before-completion` executada e sem pendências
- [ ] `CLAUDE.md` raiz atualizado: Fase 1 marcada como ✅ Concluída

---

## Comandos Úteis (PowerShell)

```powershell
# Instalar dependências
pnpm install

# Rodar migrations
pnpm --filter database prisma migrate dev --name init

# Rodar API
pnpm --filter api dev

# Rodar Web
pnpm --filter web dev

# Rodar todos os testes
pnpm test

# Verificar porta em uso
Get-NetTCPConnection -LocalPort 3001

# Matar processo na porta
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess
```

---

## Resultado Esperado

Ao concluir a Fase 1, o desenvolvedor terá:

1. Um monorepo pnpm funcional com Next.js 14 + Fastify + Prisma
2. Autenticação completa via Clerk (login, signup, sessão persistente)
3. API protegida com JWT Clerk verificado no `preHandler`
4. Design system base pronto para as fases seguintes
5. Schema de banco de dados com padrões de soft delete e auditoria estabelecidos
6. Suíte de testes cobrindo a camada de autenticação da API
