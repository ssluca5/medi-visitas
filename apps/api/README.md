# apps/api — Fastify

> Backend do MediVisitas. Consulte o [`CLAUDE.md`](../../CLAUDE.md) na raiz para convenções globais.

---

## Stack local

| Item          | Detalhe                               |
| ------------- | ------------------------------------- |
| Framework     | Fastify 5.8                           |
| ORM           | Prisma 5.22 (via `packages/database`) |
| Validação     | Zod                                   |
| Auth          | Clerk JWT em `preHandler`             |
| Pagamentos    | Stripe SDK v22                        |
| Email         | Resend                                |
| Monitoramento | Sentry                                |
| IA            | MiniMax                               |
| Logger        | Pino (nativo do Fastify)              |
| Porta dev     | `3002`                                |

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
├── app.ts                    # Instância Fastify + registro de plugins e middlewares
├── server.ts                 # Entry point (listen)
├── env.ts                    # dotenv loader
├── instrument.ts             # Sentry init
├── hooks/
│   ├── auth.ts               # preHandler Clerk JWT (verifyToken from @clerk/backend)
│   ├── auth.test.ts          # Testes do hook de auth
│   └── tenant.ts             # Resolução de tenant (organizationId, role, plano)
├── lib/
│   ├── prisma.ts             # PrismaClient com extensão softDelete + slow query log
│   └── tenant.ts             # Builders tipados (buildTenantWhere, buildResourceWhere)
├── plugins/
│   └── clerk.ts              # Plugin Fastify: decora request com userId/orgId
├── schemas/
│   └── me.ts                 # Schemas Zod compartilhados (/me)
├── services/
│   ├── minimax.ts            # Integração MiniMax (STT + Chat Completion)
│   ├── planos.ts             # Lógica de planos/assinaturas
│   ├── stripe.ts             # Stripe Checkout + Customer Portal
│   ├── transcricoes.ts       # Controle de cotas de transcrição
│   └── __tests__/
│       └── minimax.test.ts   # Testes do serviço MiniMax
├── scripts/
│   └── fix-categorias.ts     # Script one-off de migração de dados
└── routes/
    ├── health.ts             # GET /health — público (check de banco)
    ├── me.ts                 # GET /me, PATCH /me/tour — dados do usuário logado
    ├── me.test.ts            # Testes /me
    ├── profissionais/
    │   ├── index.ts          # CRUD profissionais
    │   ├── schemas.ts        # Zod schemas
    │   ├── timeline.ts       # GET /profissionais/timeline
    │   └── timeline.test.ts  # Testes timeline
    ├── especialidades/
    │   └── index.ts          # CRUD especialidades
    ├── subespecialidades/
    │   └── index.ts          # CRUD subespecialidades
    ├── materiais/
    │   ├── index.ts          # CRUD materiais técnicos
    │   └── schemas.ts
    ├── visitas/
    │   ├── index.ts          # CRUD visitas + upload áudio + transcrição
    │   ├── schemas.ts
    │   └── transcricao.test.ts
    ├── agenda/
    │   ├── index.ts          # CRUD agenda inteligente
    │   └── schemas.ts
    ├── pipeline/
    │   ├── index.ts          # Kanban + funil + métricas pipeline
    │   ├── schemas.ts
    │   └── index.test.ts
    ├── dashboard/
    │   ├── index.ts          # KPI cards + alertas + próximas visitas
    │   ├── schemas.ts
    │   └── index.test.ts
    ├── busca/
    │   ├── index.ts          # Busca global
    │   ├── schemas.ts
    │   └── index.test.ts
    ├── notificacoes/
    │   ├── index.ts          # CRUD notificações + polling
    │   ├── schemas.ts
    │   └── index.test.ts
    ├── onboarding/
    │   ├── index.ts          # Status do onboarding
    │   └── index.test.ts
    ├── organizacao/
    │   └── index.ts          # Gestão da organização + convites
    ├── billing/
    │   └── index.ts          # Stripe checkout + portal + status
    ├── transcricoes/
    │   └── index.ts          # Controle de transcrições disponíveis
    ├── gestor/
    │   └── index.ts          # Dashboard do gestor (OWNER only)
    ├── relatorios/
    │   └── index.ts          # Exportação CSV (OWNER only)
    ├── contato/
    │   └── index.ts          # POST /contato — formulário público
    └── webhooks/
        ├── clerk.ts          # Webhook Clerk (user.created/updated/deleted) via Svix
        ├── stripe.ts         # Webhook Stripe (checkout/completed, subscription, invoices)
        └── stripe.test.ts    # Testes webhook Stripe
```

## Endpoints

| Método           | Rota                        | Auth        | Descrição                                        |
| ---------------- | --------------------------- | ----------- | ------------------------------------------------ |
| `GET`            | `/health`                   | Público     | Health check com verificação de banco            |
| `GET`            | `/me`                       | JWT         | Dados do usuário logado                          |
| `PATCH`          | `/me/tour`                  | JWT         | Marcar tour como concluído                       |
| `GET/POST`       | `/profissionais`            | JWT         | Listar/criar profissionais                       |
| `GET/PUT/DELETE` | `/profissionais/:id`        | JWT         | Detalhe/editar/soft-delete profissional          |
| `GET`            | `/profissionais/timeline`   | JWT         | Timeline de todos os profissionais               |
| `GET/POST`       | `/especialidades`           | JWT         | Listar/criar especialidades                      |
| `PUT/DELETE`     | `/especialidades/:id`       | JWT         | Editar/soft-delete especialidade                 |
| `GET/POST`       | `/subespecialidades`        | JWT         | Listar/criar subespecialidades                   |
| `PUT/DELETE`     | `/subespecialidades/:id`    | JWT         | Editar/soft-delete subespecialidade              |
| `GET/POST`       | `/materiais`                | JWT         | Listar/criar materiais técnicos                  |
| `PUT/DELETE`     | `/materiais/:id`            | JWT         | Editar/soft-delete material                      |
| `GET/POST`       | `/visitas`                  | JWT         | Listar/criar visitas                             |
| `GET/PUT`        | `/visitas/:id`              | JWT         | Detalhe/editar visita                            |
| `POST`           | `/visitas/:id/transcricao`  | JWT         | Enviar áudio para transcrição                    |
| `PATCH`          | `/visitas/:id/audio`        | JWT         | Atualizar URL do áudio                           |
| `GET/POST`       | `/agenda`                   | JWT         | Listar/criar itens da agenda                     |
| `PUT/DELETE`     | `/agenda/:id`               | JWT         | Editar/soft-delete item da agenda                |
| `GET`            | `/pipeline`                 | JWT         | Kanban + funil + métricas de pipeline            |
| `GET`            | `/dashboard/resumo`         | JWT         | KPI cards + próximas visitas                     |
| `GET`            | `/dashboard/alertas`        | JWT         | Alertas de pipeline e visitas                    |
| `GET`            | `/busca`                    | JWT         | Busca global (profissionais, visitas, materiais) |
| `GET`            | `/notificacoes`             | JWT         | Listar notificações do usuário                   |
| `PATCH`          | `/notificacoes/:id/lida`    | JWT         | Marcar notificação como lida                     |
| `GET`            | `/onboarding/status`        | JWT         | Status do onboarding do usuário                  |
| `GET`            | `/organizacao`              | JWT         | Detalhes da organização do usuário               |
| `POST`           | `/organizacao/convites`     | JWT (OWNER) | Convidar membro para equipe                      |
| `GET`            | `/organizacao/convites`     | JWT (OWNER) | Listar convites pendentes                        |
| `GET`            | `/organizacao/membros`      | JWT         | Listar membros da organização                    |
| `DELETE`         | `/organizacao/membros/:id`  | JWT (OWNER) | Remover membro                                   |
| `POST`           | `/billing/checkout`         | JWT         | Criar sessão de checkout Stripe                  |
| `POST`           | `/billing/portal`           | JWT         | Criar sessão do portal Stripe                    |
| `GET`            | `/billing/status`           | JWT         | Status da assinatura atual                       |
| `GET`            | `/transcricoes/disponiveis` | JWT         | Verificar transcrições disponíveis               |
| `GET`            | `/gestor/resumo`            | JWT (OWNER) | Dashboard resumo do gestor                       |
| `GET`            | `/relatorios/exportar`      | JWT (OWNER) | Exportar CSV de relatórios                       |
| `POST`           | `/contato`                  | Público     | Formulário de contato                            |
| `POST`           | `/webhooks/clerk`           | Svix        | Sincronização de usuários Clerk                  |
| `POST`           | `/webhooks/stripe`          | Stripe      | Eventos de assinatura Stripe                     |

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
