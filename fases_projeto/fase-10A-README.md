# Fase 10A — Multi-tenant SaaS

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack: **SvelteKit 2 + Svelte 5 + Fastify + Prisma + Supabase**
> Pré-requisito: Todas as fases anteriores concluídas
> ⚠️ Esta é a mudança mais profunda do projeto — afeta todas as tabelas

---

## Objetivo da Fase

Transformar o MediVisitas de single-user em multi-tenant, permitindo que múltiplas
empresas (representadas comerciais) usem a plataforma com dados completamente isolados:

- Modelo **Organização → Membros → Dados**
- Plano individual: propagandista usa sozinho (organização de 1 pessoa)
- Plano empresa: gestor cadastra múltiplos propagandistas
- Isolamento total de dados por `organizationId` em todas as tabelas
- Clerk Organizations para gerenciar membros e convites
- Roles: `OWNER` (gestor) e `MEMBER` (propagandista)
- Onboarding pós-cadastro: individual ou empresa

---

## Modelo de Dados — Mudanças

### Nova tabela: `Organization`

```prisma
enum PlanoOrganizacao {
  TRIAL        // 7 dias gratuitos
  INDIVIDUAL   // 1 propagandista
  EMPRESA      // múltiplos propagandistas
  ENTERPRISE   // sob consulta
}

enum StatusOrganizacao {
  TRIAL_ATIVO
  ATIVO
  SUSPENSO     // pagamento falhou
  CANCELADO
}

model Organization {
  id                String              @id @default(cuid())
  clerkOrgId        String              @unique  // ID da org no Clerk
  nome              String
  slug              String              @unique  // para URL: app.medivisitas.com/org/slug
  plano             PlanoOrganizacao    @default(TRIAL)
  status            StatusOrganizacao   @default(TRIAL_ATIVO)
  trialExpiraEm     DateTime            // now() + 7 dias
  planoAtivoEm      DateTime?
  stripeCustomerId  String?             @unique
  stripeSubId       String?             @unique
  limiteUsuarios    Int                 @default(1)
  // Soft delete padrão
  deletedAt         DateTime?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  membros           OrganizationMembro[]
  profissionais     Profissional[]
  especialidades    Especialidade[]
  visitas           Visita[]
  agendaItems       AgendaItem[]
  notificacoes      Notificacao[]
  materiais         MaterialTecnico[]

  @@index([clerkOrgId])
  @@index([status])
  @@index([trialExpiraEm])
}

enum RoleMembro {
  OWNER    // gestor — pode convidar e gerenciar
  MEMBER   // propagandista — acesso aos próprios dados
}

model OrganizationMembro {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Restrict)
  userId         String       // Clerk userId
  role           RoleMembro   @default(MEMBER)
  deletedAt      DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([organizationId, userId])
  @@index([userId])
  @@index([organizationId])
}
```

### Campos adicionados em todas as tabelas existentes

```prisma
// Adicionar em: Profissional, Especialidade, Visita, AgendaItem,
//              Notificacao, MaterialTecnico, EstagioLog

organizationId String
organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Restrict)

// Índice obrigatório em todas:
@@index([organizationId])
```

> **Regra crítica:** `organizationId` em **todas** as tabelas de negócio.
> Toda query da API deve filtrar por `organizationId` — nunca apenas por `userId`.

---

## Hierarquia de Acesso

```
Organization (empresa/conta)
├── OWNER (gestor)
│   ├── Vê dados de todos os membros
│   ├── Convida/remove membros
│   └── Gerencia plano e billing
└── MEMBER (propagandista)
    ├── Vê apenas seus próprios dados (userId)
    └── Não acessa dados de outros membros
```

---

## Middleware de Tenant — Hook Fastify

```typescript
// apps/api/src/hooks/tenant.ts
// Executado APÓS verifyClerkToken em todas as rotas protegidas

import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    organizationId?: string;
    role?: "OWNER" | "MEMBER";
  }
}

export async function resolveTenant(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.userId;
  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  // Buscar organização ativa do usuário
  const membro = await prisma.organizationMembro.findFirst({
    where: { userId, deletedAt: null },
    include: { organization: true },
    orderBy: { createdAt: "desc" },
  });

  if (!membro) {
    return reply
      .status(403)
      .send({ error: "Organização não encontrada. Complete o onboarding." });
  }

  const org = membro.organization;

  // Verificar se trial expirou
  if (org.status === "TRIAL_ATIVO" && org.trialExpiraEm < new Date()) {
    await prisma.organization.update({
      where: { id: org.id },
      data: { status: "SUSPENSO" },
    });
    return reply.status(402).send({
      error: "Trial expirado. Assine um plano para continuar.",
      code: "TRIAL_EXPIRED",
    });
  }

  // Verificar se conta está ativa
  if (org.status === "SUSPENSO" || org.status === "CANCELADO") {
    return reply.status(402).send({
      error: "Conta suspensa. Verifique o pagamento.",
      code: "ACCOUNT_SUSPENDED",
    });
  }

  request.organizationId = org.id;
  request.role = membro.role;
}
```

---

## Mudanças na API — Padrão de Queries

Toda rota passa a filtrar por `organizationId`. Para MEMBER, também filtra por `userId`:

```typescript
// ANTES (single-tenant)
const profissionais = await prisma.profissional.findMany({
  where: { deletedAt: null, userId: request.userId },
});

// DEPOIS (multi-tenant)
const where: any = {
  deletedAt: null,
  organizationId: request.organizationId,
};

// MEMBER vê apenas seus próprios registros
if (request.role === "MEMBER") {
  where.userId = request.userId;
}
// OWNER vê todos da organização — sem filtro de userId

const profissionais = await prisma.profissional.findMany({ where });
```

---

## Onboarding — Fluxo Pós-Cadastro

```typescript
// apps/api/src/routes/onboarding/index.ts
// Chamado uma única vez após o primeiro login

// POST /onboarding/individual
// Cria Organization com limiteUsuarios=1 + OrganizationMembro OWNER

// POST /onboarding/empresa
// Body: { nomeEmpresa: string }
// Cria Organization + OrganizationMembro OWNER + configura Clerk Org

// GET /onboarding/status
// Retorna se o usuário já completou onboarding
// { concluido: boolean, organizationId?: string, role?: string }
```

---

## Gestão de Membros (OWNER only)

```typescript
// POST /organizacao/membros/convidar
// Body: { email: string, role: 'MEMBER' }
// Envia convite via Clerk + cria registro pendente

// GET /organizacao/membros
// Lista membros ativos da organização

// DELETE /organizacao/membros/:userId
// Remove membro (soft delete no OrganizationMembro)

// PATCH /organizacao/membros/:userId/role
// Altera role do membro (somente OWNER pode fazer isso)
```

---

## Mudanças no Frontend

### +layout.server.ts — carregar org do usuário

```typescript
// apps/web/src/routes/dashboard/+layout.server.ts
export const load: LayoutServerLoad = async ({ locals, fetch }) => {
  if (!locals.userId) throw redirect(302, "/login");

  // Buscar status da organização
  const res = await fetch(`${PUBLIC_API_URL}/onboarding/status`, {
    headers: { Authorization: `Bearer ${locals.sessionToken}` },
  });
  const { concluido, organizationId, role, plano, status } = await res.json();

  // Redirecionar para onboarding se não concluído
  if (!concluido) throw redirect(302, "/onboarding");

  // Redirecionar para página de planos se trial expirou
  if (status === "SUSPENSO")
    throw redirect(302, "/planos?motivo=trial_expirado");

  return { usuario: locals.userName, role, plano, organizationId };
};
```

### Página de Onboarding

```
/onboarding
├── Passo 1: "Como você usará o MediVisitas?"
│   ├── [Sou propagandista individual]
│   └── [Represento uma empresa]
├── Passo 2A (individual): Confirmação → redireciona para /dashboard
└── Passo 2B (empresa): Nome da empresa → Convidar propagandistas → /dashboard
```

### Sidebar — mostrar plano e role

```svelte
<!-- Adicionar no footer da Sidebar -->
<div class="px-3 py-2 mb-1">
  <span class="text-xs px-2 py-0.5 rounded-full font-medium"
    style={plano === 'TRIAL_ATIVO'
      ? 'background-color: #fef3c7; color: #92400e;'
      : 'background-color: #d1fae5; color: #065f46;'}>
    {plano === 'TRIAL_ATIVO' ? `Trial — ${diasRestantes}d restantes` : plano}
  </span>
</div>
```

---

## Estrutura de Pastas — Novos arquivos

```
apps/api/src/
├── hooks/
│   └── tenant.ts              ← hook resolveTenant
└── routes/
    ├── onboarding/
    │   └── index.ts           ← POST /onboarding/individual|empresa
    └── organizacao/
        └── index.ts           ← gestão de membros (OWNER only)

apps/web/src/
└── routes/
    ├── onboarding/
    │   └── +page.svelte       ← seleção individual/empresa + nome
    └── planos/
        └── +page.svelte       ← página quando trial expira
```

---

## Migration — Estratégia

Esta migration é a mais complexa do projeto. Executar nesta ordem:

```sql
-- 1. Criar tabelas novas (sem quebrar as existentes)
CREATE TABLE "Organization" (...)
CREATE TABLE "OrganizationMembro" (...)

-- 2. Adicionar colunas nullable primeiro (sem NOT NULL)
ALTER TABLE "Profissional" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Especialidade" ADD COLUMN "organizationId" TEXT;
-- ... repetir para todas as tabelas

-- 3. Criar organização padrão para dados existentes
INSERT INTO "Organization" (id, nome, plano, status, ...) VALUES ('org_default', 'Organização Padrão', ...)

-- 4. Preencher organizationId nos dados existentes
UPDATE "Profissional" SET "organizationId" = 'org_default' WHERE "organizationId" IS NULL;
-- ... repetir

-- 5. Tornar NOT NULL após preencher
ALTER TABLE "Profissional" ALTER COLUMN "organizationId" SET NOT NULL;
-- ... repetir

-- 6. Criar índices
CREATE INDEX ON "Profissional"("organizationId");
-- ... repetir
```

---

## Sequência de Implementação

```
1.  [PLAN]    skill brainstorming → estratégia de migration, hierarquia de acesso
2.  [PLAN]    skill write-plan → subtarefas atômicas

3.  [DB]      Migration em 3 partes: criar tabelas → adicionar nullable → NOT NULL
4.  [DB]      Verificar dados existentes preservados no Prisma Studio

5.  [API]     Implementar hooks/tenant.ts (resolveTenant)
6.  [API]     Adicionar resolveTenant no preHandler de todas as rotas protegidas
7.  [API]     Atualizar todas as queries para filtrar por organizationId
8.  [API]     MEMBER filtra também por userId, OWNER vê tudo da org
9.  [API]     Implementar POST /onboarding/individual e /empresa
10. [API]     Implementar GET /onboarding/status
11. [API]     Implementar rotas de gestão de membros (OWNER only)
12. [API]     Testes TDD para tenant hook e onboarding

13. [WEB]     Atualizar +layout.server.ts para verificar onboarding + status
14. [WEB]     Criar /onboarding com seleção individual/empresa
15. [WEB]     Criar /planos para trial expirado
16. [WEB]     Adicionar badge de plano na Sidebar
17. [WEB]     Página de gestão de membros para OWNER

18. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 10A

```
Banco de Dados
[ ] Tabelas Organization e OrganizationMembro criadas
[ ] organizationId adicionado em todas as tabelas de negócio
[ ] Dados existentes migrados para organização padrão
[ ] Índices criados em todas as tabelas

API
[ ] resolveTenant hook funcionando
[ ] Trial expirado retorna 402 com code: TRIAL_EXPIRED
[ ] Conta suspensa retorna 402 com code: ACCOUNT_SUSPENDED
[ ] MEMBER vê apenas seus próprios dados (userId filter)
[ ] OWNER vê todos os dados da organização
[ ] POST /onboarding/individual → cria org + membro OWNER
[ ] POST /onboarding/empresa → cria org com nome + membro OWNER
[ ] GET /onboarding/status → retorna concluido + role + plano
[ ] Rotas de membros protegidas por role OWNER
[ ] Testes passando

Frontend
[ ] +layout.server.ts redireciona para /onboarding se não concluído
[ ] +layout.server.ts redireciona para /planos se suspenso
[ ] Página /onboarding funciona para individual e empresa
[ ] Badge de plano/trial na Sidebar
[ ] Dias restantes do trial calculados corretamente
[ ] Página de gestão de membros para OWNER

Geral
[ ] pnpm test → 100%
[ ] pnpm --filter @medivisitas/web build → sem erros
[ ] pnpm --filter api build → sem erros
[ ] CLAUDE.md: Fase 10A marcada como Concluída
```
