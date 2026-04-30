# apps/api — Fastify

> Backend do MediVisitas. Consulte o [`CLAUDE.md`](../../CLAUDE.md) na raiz para convenções globais.

---

## Stack local

| Item      | Detalhe                            |
| --------- | ---------------------------------- |
| Framework | Fastify                            |
| ORM       | Prisma (via `packages/database`)   |
| Validação | Zod + `@fastify/type-provider-zod` |
| Auth      | Clerk JWT em `preHandler`          |
| Logger    | Pino (nativo do Fastify)           |
| Porta dev | `3002`                             |

---

## Scripts

```powershell
# Iniciar dev
pnpm --filter api dev

# Build
pnpm --filter api build

# Verificar porta em uso (PowerShell)
Get-NetTCPConnection -LocalPort 3002

# Matar processo na porta
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3002).OwningProcess
```

---

## Variáveis de ambiente

Arquivo: `apps/api/.env`

```env
DATABASE_URL=
DIRECT_URL=
CLERK_SECRET_KEY=
CLERK_JWT_KEY=
CLERK_AUTHORIZED_PARTIES=   # Ex: https://app.medivisitas.com,http://localhost:5173
PORT=3002
```

---

## Estrutura de pastas

```
apps/api/src/
├── app.ts                # Instância Fastify + registro de plugins
├── server.ts             # Entry point (listen)
├── hooks/
│   └── auth.ts           # preHandler Clerk JWT (verifyToken from @clerk/backend)
├── routes/               # Schemas co-locados em cada diretório de rota
│   ├── profissionais/
│   │   ├── index.ts      # Rotas CRUD
│   │   ├── schemas.ts    # Zod schemas
│   │   └── timeline.ts   # Timeline do profissional
│   ├── visitas/
│   │   ├── index.ts
│   │   └── schemas.ts
│   ├── agenda/
│   │   ├── index.ts
│   │   └── schemas.ts
│   ├── pipeline/
│   │   ├── index.ts
│   │   └── schemas.ts
│   └── index.ts          # Registro de rotas
├── plugins/
│   └── clerk.ts          # Plugin Fastify para Clerk
└── lib/
    └── prisma.ts         # PrismaClient com extensão softDelete
```

---

## Convenções de rota

```typescript
// ✅ Padrão obrigatório de rota
fastify.get(
  "/profissionais",
  {
    preHandler: [verifyClerkToken], // auth sempre aqui
    schema: {
      querystring: ListProfissionaisSchema,
      response: { 200: ProfissionaisResponseSchema },
    },
  },
  async (request, reply) => {
    const { userId } = request; // injetado pelo hook
    // ...
  },
);

// ✅ Hook de auth (apps/api/src/hooks/auth.ts)
import { verifyToken } from "@clerk/backend";

export async function verifyClerkToken(request, reply) {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    const payload = await verifyToken(token, {
      issuer: request.headers.origin ? `${request.headers.origin}/` : undefined,
    });
    request.userId = payload.sub;
  } catch {
    reply.code(401).send({ error: "Unauthorized" });
  }
}
```

---

## Regras de dados

- **Soft delete obrigatório** — nunca `DELETE` em dados de negócio; filtrar por `deletedAt: null` em todas as queries
- Respostas paginadas para listas (cursor-based ou offset)
- Erros sempre com `{ error: string, code?: string }`

---

## Skills para este módulo

Instalação: `/plugin marketplace add obra/superpowers-marketplace`  
Fastify/Node.js (mcollina): `npx skills add mcollina/skills`

### ⚙️ Backend & API

| Skill                         | Repositório       | Quando usar                                                |
| ----------------------------- | ----------------- | ---------------------------------------------------------- |
| `fastify`                     | `mcollina/skills` | **Sempre** ao criar/editar rotas, plugins ou hooks Fastify |
| `node`                        | `mcollina/skills` | Patterns async, error handling, streams, event loop        |
| `oauth`                       | `mcollina/skills` | Implementação de fluxo Clerk JWT / OAuth 2.0               |
| `typescript-magician`         | `mcollina/skills` | Tipagem avançada, generics, eliminação de `any`            |
| `linting-neostandard-eslint9` | `mcollina/skills` | Configuração de linting ESLint v9 flat config              |

### 🗄️ Banco de dados (ver também `packages/database/README.md`)

| Skill                              | Repositório             | Quando usar                              |
| ---------------------------------- | ----------------------- | ---------------------------------------- |
| `supabase-postgres-best-practices` | `supabase/agent-skills` | Queries Prisma que geram SQL no Supabase |

### 🧪 Qualidade & Testes

| Skill                            | Repositório        | Quando usar                      |
| -------------------------------- | ------------------ | -------------------------------- |
| `test-driven-development`        | `obra/superpowers` | Toda rota ou service novo        |
| `systematic-debugging`           | `obra/superpowers` | Erros de runtime, bugs de lógica |
| `testing-anti-patterns`          | `obra/superpowers` | Revisão de testes existentes     |
| `verification-before-completion` | `obra/superpowers` | Antes de encerrar sessão         |

### 📐 Processo

| Skill           | Repositório        | Quando usar                               |
| --------------- | ------------------ | ----------------------------------------- |
| `brainstorming` | `obra/superpowers` | Design de endpoints antes de codar        |
| `write-plan`    | `obra/superpowers` | Refatorações ou novas features multi-rota |

---

## Checklist de feature backend

- [ ] `preHandler: [verifyClerkToken]` em todas as rotas protegidas
- [ ] Schema Zod de entrada e saída definido
- [ ] Soft delete: queries filtram `deletedAt: null`
- [ ] Erros retornam `{ error: string }` com status correto
- [ ] Rota testada com curl/Postman antes de encerrar sessão
