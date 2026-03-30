# Fase 2 — Cadastro de Profissionais + Classificação de Potencial

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar CRUD completo de profissionais com classificação de potencial e pipeline de estágios para o CRM MediVisitas.

**Architecture:** Monorepo pnpm com apps/web (Next.js 14), apps/api (Fastify) e packages/database (Prisma). Backend expõe REST API com autenticação Clerk. Frontend consome API com padrão FAB+Sheet para create/edit.

**Tech Stack:** Next.js 14, Fastify, Prisma, PostgreSQL/Supabase, Zod, shadcn/ui, Tailwind CSS

---

## Fase 1: Banco de Dados

### Task 1: Criar migration Prisma

**Files:**

- Create: `packages/database/prisma/migrations/YYYYMMDDHHMMSS_profissionais/migration.sql`
- Modify: `packages/database/prisma/schema.prisma`
- Modify: `packages/database/package.json`

- [ ] **Step 1: Criar arquivo de migration manualmente** com timestamp `20260325203000`

```sql
-- Criar enum PotencialPrescricao
CREATE TYPE "PotencialPrescricao" AS ENUM ('BAIXO', 'MEDIO', 'ALTO', 'ESTRATEGICO');

-- Criar enum EstagioPipeline
CREATE TYPE "EstagioPipeline" AS ENUM ('PROSPECTADO', 'VISITADO', 'INTERESSADO', 'PRESCRITOR', 'FIDELIZADO');

-- Criar enum TipoContato
CREATE TYPE "TipoContato" AS ENUM ('TELEFONE', 'EMAIL', 'WHATSAPP', 'OUTRO');

-- Criar tabela Especialidade
CREATE TABLE "Especialidade" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "nome" TEXT NOT NULL,
  "categoria" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMP
);

-- Criar tabela Profissional
CREATE TABLE "Profissional" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "nome" TEXT NOT NULL,
  "crm" TEXT,
  "email" TEXT,
  "telefone" TEXT,
  "potencial" "PotencialPrescricao" NOT NULL DEFAULT 'MEDIO',
  "estagioPipeline" "EstagioPipeline" NOT NULL DEFAULT 'PROSPECTADO',
  "especialidadeId" TEXT,
  "enderecoId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMP,
  CONSTRAINT "Profissional_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE RESTRICT,
  CONSTRAINT "Profissional_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT
);

-- Criar tabela Endereco
CREATE TABLE "Endereco" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "logradouro" TEXT,
  "numero" TEXT,
  "complemento" TEXT,
  "bairro" TEXT,
  "cidade" TEXT,
  "estado" TEXT,
  "cep" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMP
);

-- Criar tabela ContatoProfissional
CREATE TABLE "ContatoProfissional" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "profissionalId" TEXT NOT NULL,
  "tipo" "TipoContato" NOT NULL,
  "valor" TEXT NOT NULL,
  "observacao" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMP,
  CONSTRAINT "ContatoProfissional_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE RESTRICT
);

-- Criar tabela EstagioLog (imutável - sem deletedAt, sem updatedAt)
CREATE TABLE "EstagioLog" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "profissionalId" TEXT NOT NULL,
  "estagioAnterior" "EstagioPipeline",
  "estagioNovo" "EstagioPipeline" NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "EstagioLog_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE RESTRICT
);

-- Criar índices para colunas de filtro
CREATE INDEX "Profissional_potencial_idx" ON "Profissional"("potencial");
CREATE INDEX "Profissional_estagioPipeline_idx" ON "Profissional"("estagioPipeline");
CREATE INDEX "Profissional_deletedAt_idx" ON "Profissional"("deletedAt");
CREATE INDEX "Profissional_especialidadeId_idx" ON "Profissional"("especialidadeId");
CREATE INDEX "EstagioLog_profissionalId_idx" ON "EstagioLog"("profissionalId");
CREATE INDEX "EstagioLog_userId_idx" ON "EstagioLog"("userId");
CREATE INDEX "ContatoProfissional_profissionalId_idx" ON "ContatoProfissional"("profissionalId");
CREATE INDEX "Especialidade_categoria_idx" ON "Especialidade"("categoria");
```

- [ ] **Step 2: Atualizar schema.prisma** com os modelos e enums

```prisma
enum PotencialPrescricao {
  BAIXO
  MEDIO
  ALTO
  ESTRATEGICO
}

enum EstagioPipeline {
  PROSPECTADO
  VISITADO
  INTERESSADO
  PRESCRITOR
  FIDELIZADO
}

enum TipoContato {
  TELEFONE
  EMAIL
  WHATSAPP
  OUTRO
}

model Especialidade {
  id        String    @id @default(cuid())
  nome      String
  categoria String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  profissionais Profissional[]

  @@index([categoria])
  @@index([deletedAt])
}

model Endereco {
  id          String    @id @default(cuid())
  logradouro  String?
  numero      String?
  complemento String?
  bairro      String?
  cidade      String?
  estado      String?
  cep         String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  profissionais Profissional[]
}

model Profissional {
  id              String            @id @default(cuid())
  nome            String
  crm             String?
  email           String?
  telefone        String?
  potencial       PotencialPrescricao @default(MEDIO)
  estagioPipeline EstagioPipeline    @default(PROSPECTADO)
  especialidadeId String?
  enderecoId      String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  deletedAt       DateTime?

  especialidade   Especialidade?    @relation(fields: [especialidadeId], references: [id], onDelete: Restrict)
  endereco        Endereco?         @relation(fields: [enderecoId], references: [id], onDelete: Restrict)
  contatos        ContatoProfissional[]
  estagioLogs     EstagioLog[]

  @@index([potencial])
  @@index([estagioPipeline])
  @@index([deletedAt])
  @@index([especialidadeId])
}

model ContatoProfissional {
  id            String       @id @default(cuid())
  profissionalId String
  tipo          TipoContato
  valor         String
  observacao    String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  deletedAt     DateTime?

  profissional  Profissional @relation(fields: [profissionalId], references: [id], onDelete: Restrict)

  @@index([profissionalId])
  @@index([deletedAt])
}

model EstagioLog {
  id              String         @id @default(cuid())
  profissionalId  String
  estagioAnterior EstagioPipeline?
  estagioNovo     EstagioPipeline
  userId          String
  createdAt       DateTime       @default(now())

  profissional    Profissional   @relation(fields: [profissionalId], references: [id], onDelete: Restrict)

  @@index([profissionalId])
  @@index([userId])
}
```

- [ ] **Step 3: Executar migration**

```powershell
pnpm --filter database prisma migrate dev --name profissionais
```

- [ ] **Step 4: Verificar tabelas no banco**

```powershell
pnpm --filter database prisma studio
```

### Task 2: Criar seed de especialidades

**Files:**

- Create: `packages/database/prisma/seed.ts`

- [ ] **Step 1: Criar seed com especialidades por categoria**

```typescript
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categorias = {
    Médicos: [
      "Clínico Geral",
      "Cardiologia",
      "Dermatologia",
      "Endocrinologia",
      "Gastroenterologia",
      "Neurologia",
      "Oncologia",
      "Ortopedia",
      "Pediatria",
      "Psiquiatria",
      "Reumatologia",
      "Urologia",
    ],
    Farmácia: [
      "Farmácia Clínica",
      "Farmácia Hospitalar",
      "Farmácia Magistral",
      "Farmácia Oncológica",
    ],
    Odontologia: [
      "Cirurgia Bucomaxilofacial",
      "Endodontia",
      "Implantodontia",
      "Odontopediatria",
      "Ortodontia",
      "Periodontia",
    ],
  };

  for (const [categoria, especialidades] of Object.entries(categorias)) {
    for (const nome of especialidades) {
      await prisma.especialidade.upsert({
        where: {
          id: `${categoria.toLowerCase().replace(/\s/g, "-")}-${nome.toLowerCase().replace(/\s/g, "-")}`,
        },
        update: {},
        create: {
          id: `${categoria.toLowerCase().replace(/\s/g, "-")}-${nome.toLowerCase().replace(/\s/g, "-")}`,
          nome,
          categoria,
        },
      });
    }
  }

  console.log("Seed de especialidades executado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Executar seed**

```powershell
pnpm --filter database prisma db seed
```

---

## Fase 2: API Backend (TDD)

### Task 3: ROTAS - POST /profissionais

**Files:**

- Create: `apps/api/src/routes/profissionais/create.test.ts`
- Create: `apps/api/src/routes/profissionais/create.ts`
- Create: `apps/api/src/routes/profissionais/schemas.ts`

- [ ] **Step 1: Criar Zod schemas de validação**

```typescript
// apps/api/src/routes/profissionais/schemas.ts
import { z } from "zod";

export const PotencialPrescricaoSchema = z.nativeEnum({
  BAIXO: "BAIXO",
  MEDIO: "MEDIO",
  ALTO: "ALTO",
  ESTRATEGICO: "ESTRATEGICO",
});

export const EstagioPipelineSchema = z.nativeEnum({
  PROSPECTADO: "PROSPECTADO",
  VISITADO: "VISITADO",
  INTERESSADO: "INTERESSADO",
  PRESCRITOR: "PRESCRITOR",
  FIDELIZADO: "FIDELIZADO",
});

export const TipoContatoSchema = z.nativeEnum({
  TELEFONE: "TELEFONE",
  EMAIL: "EMAIL",
  WHATSAPP: "WHATSAPP",
  OUTRO: "OUTRO",
});

export const EnderecoSchema = z
  .object({
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    cep: z.string().optional(),
  })
  .optional();

export const ContatoSchema = z.object({
  tipo: TipoContatoSchema,
  valor: z.string().min(1),
  observacao: z.string().optional(),
});

export const CreateProfissionalSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  crm: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  telefone: z.string().optional(),
  potencial: PotencialPrescricaoSchema.default("MEDIO"),
  estagioPipeline: EstagioPipelineSchema.default("PROSPECTADO"),
  especialidadeId: z.string().optional(),
  endereco: EnderecoSchema.optional(),
  contatos: z.array(ContatoSchema).optional(),
});

export const UpdateProfissionalSchema = CreateProfissionalSchema.partial();

export const ListProfissionaisQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  busca: z.string().optional(),
  potencial: PotencialPrescricaoSchema.optional(),
  estagioPipeline: EstagioPipelineSchema.optional(),
});

export const UpdateEstagioSchema = z.object({
  estagioNovo: EstagioPipelineSchema,
});

export const ProfissionalResponseSchema = z.object({
  id: z.string(),
  nome: z.string(),
  crm: z.string().nullable(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
  potencial: PotencialPrescricaoSchema,
  estagioPipeline: EstagioPipelineSchema,
  especialidadeId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  especialidade: z
    .object({
      id: z.string(),
      nome: z.string(),
      categoria: z.string(),
    })
    .nullable(),
  endereco: z
    .object({
      id: z.string(),
      logradouro: z.string().nullable(),
      numero: z.string().nullable(),
      complemento: z.string().nullable(),
      bairro: z.string().nullable(),
      cidade: z.string().nullable(),
      estado: z.string().nullable(),
      cep: z.string().nullable(),
    })
    .nullable(),
  contatos: z.array(
    z.object({
      id: z.string(),
      tipo: TipoContatoSchema,
      valor: z.string(),
      observacao: z.string().nullable(),
    }),
  ),
});

export const ProfissionaisListResponseSchema = z.object({
  data: z.array(ProfissionalResponseSchema),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
```

- [ ] **Step 2: Escrever teste RED**

```typescript
// apps/api/src/routes/profissionais/create.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import buildApp from "../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = buildApp();

describe("POST /profissionais", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("deve criar um profissional com dados mínimos", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/profissionais",
      headers: {
        authorization: "Bearer valid-test-token",
      },
      payload: {
        nome: "Dr. João Silva",
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.nome).toBe("Dr. João Silva");
    expect(body.potencial).toBe("MEDIO");
    expect(body.estagioPipeline).toBe("PROSPECTADO");
  });

  it("deve criar profissional com todos os campos", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/profissionais",
      headers: {
        authorization: "Bearer valid-test-token",
      },
      payload: {
        nome: "Dra. Maria Santos",
        crm: "CRM/SP 123456",
        email: "maria.santos@email.com",
        telefone: "(11) 99999-9999",
        potencial: "ALTO",
        estagioPipeline: "INTERESSADO",
        endereco: {
          logradouro: "Av. Paulista",
          numero: "1000",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01310-100",
        },
        contatos: [
          { tipo: "TELEFONE", valor: "(11) 3333-3333" },
          { tipo: "WHATSAPP", valor: "(11) 99999-9999" },
        ],
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.nome).toBe("Dra. Maria Santos");
    expect(body.crm).toBe("CRM/SP 123456");
    expect(body.email).toBe("maria.santos@email.com");
    expect(body.potencial).toBe("ALTO");
    expect(body.estagioPipeline).toBe("INTERESSADO");
    expect(body.endereco).toBeDefined();
    expect(body.contatos).toHaveLength(2);
  });

  it("deve retornar 400 para payload inválido", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/profissionais",
      headers: {
        authorization: "Bearer valid-test-token",
      },
      payload: {
        // nome é obrigatório
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("deve retornar 401 sem token", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/profissionais",
      payload: {
        nome: "Dr. Teste",
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
```

- [ ] **Step 3: Implementar rota GREEN**

```typescript
// apps/api/src/routes/profissionais/create.ts
import type { FastifyInstance } from "fastify";
import { verifyClerkToken } from "../../hooks/auth";
import { prisma } from "../../lib/prisma";
import { CreateProfissionalSchema } from "./schemas";

export async function createProfissionalRoutes(app: FastifyInstance) {
  app.post(
    "/profissionais",
    {
      preHandler: [verifyClerkToken],
      schema: {
        body: CreateProfissionalSchema,
        response: {
          201: z
            .object({
              /* response schema */
            })
            .parse({}),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request;
      const data = CreateProfissionalSchema.parse(request.body);

      const { endereco, contatos, ...profissionalData } = data;

      // Criar endereço se fornecido
      let enderecoId: string | undefined;
      if (endereco) {
        const novoEndereco = await prisma.endereco.create({
          data: endereco,
        });
        enderecoId = novoEndereco.id;
      }

      // Criar profissional
      const profissional = await prisma.profissional.create({
        data: {
          ...profissionalData,
          enderecoId,
          especialidadeId: data.especialidadeId,
        },
        include: {
          especialidade: true,
          endereco: true,
          contatos: true,
        },
      });

      // Criar contatos se fornecidos
      if (contatos && contatos.length > 0) {
        await prisma.contatoProfissional.createMany({
          data: contatos.map((contato) => ({
            ...contato,
            profissionalId: profissional.id,
          })),
        });
      }

      // Criar log inicial de estágio
      await prisma.estagioLog.create({
        data: {
          profissionalId: profissional.id,
          estagioAnterior: null,
          estagioNovo: profissional.estagioPipeline,
          userId,
        },
      });

      // Retornar profissional com relacionamentos
      const profissionalCompleto = await prisma.profissional.findUnique({
        where: { id: profissional.id },
        include: {
          especialidade: true,
          endereco: true,
          contatos: true,
        },
      });

      return reply.code(201).send(profissionalCompleto);
    },
  );
}
```

---

### Task 4: ROTAS - GET /profissionais (listagem com paginação e filtros)

**Files:**

- Create: `apps/api/src/routes/profissionais/list.test.ts`
- Create: `apps/api/src/routes/profissionais/list.ts`

- [ ] **Step 1: Escrever teste RED**
- [ ] **Step 2: Implementar rota GREEN**
- [ ] **Step 3: Implementar paginação offset-based**
- [ ] **Step 4: Implementar filtros: busca (ILIKE), potencial, estagioPipeline**

---

### Task 5: ROTAS - GET /profissionais/:id

**Files:**

- Create: `apps/api/src/routes/profissionais/get.test.ts`
- Create: `apps/api/src/routes/profissionais/get.ts`

- [ ] **Step 1: Escrever teste RED**
- [ ] **Step 2: Implementar rota GREEN**
- [ ] **Step 3: Garantir 404 para id inexistente ou deletado**

---

### Task 6: ROTAS - PUT /profissionais/:id

**Files:**

- Create: `apps/api/src/routes/profissionais/update.test.ts`
- Create: `apps/api/src/routes/profissionais/update.ts`

- [ ] **Step 1: Escrever teste RED**
- [ ] **Step 2: Implementar rota GREEN**
- [ ] **Step 3: Atualizar relacionamentos (endereco, contatos)**

---

### Task 7: ROTAS - DELETE /profissionais/:id (soft delete)

**Files:**

- Create: `apps/api/src/routes/profissionais/delete.test.ts`
- Create: `apps/api/src/routes/profissionais/delete.ts`

- [ ] **Step 1: Escrever teste RED**
- [ ] **Step 2: Implementar rota GREEN com soft delete (seta deletedAt)**
- [ ] **Step 3: Garantir que não remove registros do banco**

---

### Task 8: ROTAS - PATCH /profissionais/:id/estagio

**Files:**

- Create: `apps/api/src/routes/profissionais/estagio.test.ts`
- Create: `apps/api/src/routes/profissionais/estagio.ts`

- [ ] **Step 1: Escrever teste RED**
- [ ] **Step 2: Implementar rota GREEN**
- [ ] **Step 3: Criar EstagioLog na mesma transação que atualiza Profissional**
- [ ] **Step 4: Capturar userId do Clerk para o log**

---

### Task 9: Registrar todas as rotas

**Files:**

- Create: `apps/api/src/routes/profissionais/index.ts`
- Modify: `apps/api/src/routes/index.ts`

- [ ] **Step 1: Criar index.ts que exporta todas as rotas**
- [ ] **Step 2: Registrar no routes/index.ts principal**

---

## Fase 3: Frontend

### Task 10: Componentes de Badge

**Files:**

- Create: `apps/web/src/components/profissionais/PotencialBadge.tsx`
- Create: `apps/web/src/components/profissionais/EstagioBadge.tsx`

- [ ] **Step 1: Criar PotencialBadge com cores via CSS vars**
  - BAIXO: `rgb(var(--muted-foreground))`
  - MEDIO: `rgb(var(--primary))`
  - ALTO: `rgb(var(--warning))` ou amber
  - ESTRATEGICO: `rgb(var(--success))` ou green

- [ ] **Step 2: Criar EstagioBadge com cores via CSS vars**

### Task 11: FiltrosProfissionais

**Files:**

- Create: `apps/web/src/components/profissionais/FiltrosProfissionais.tsx`

- [ ] **Step 1: Componente com busca textual, select potencial, select estágio**
- [ ] **Step 2: Estado local com onChange para notificar página pai**

### Task 12: ProfissionalSheet (FAB + Sheet lateral)

**Files:**

- Create: `apps/web/src/components/profissionais/ProfissionalSheet.tsx`

- [ ] **Step 1: FAB fixo no canto inferior direito**
- [ ] **Step 2: SheetContent side="right" com min(480px, 100vw)**
- [ ] **Step 3: Formulário com seções colapsáveis**
- [ ] **Step 4: Select especialidade com optgroup por categoria**
- [ ] **Step 5: Botão salvar com CSS variables**

### Task 13: Página /dashboard/profissionais

**Files:**

- Create: `apps/web/src/app/(dashboard)/profissionais/page.tsx`

- [ ] **Step 1: Integrar FiltrosProfissionais**
- [ ] **Step 2: Listagem de profissionais**
- [ ] **Step 3: Integrar ProfissionalSheet**
- [ ] **Step 4: CRUD completo com atualização otimista**

---

## Verificação Final

- [ ] pnpm test → todos passando
- [ ] pnpm --filter web build → sem TypeScript errors
- [ ] pnpm --filter api build → sem TypeScript errors
- [ ] Fluxo completo testado: criar → listar → editar → avançar pipeline → deletar
- [ ] CLAUDE.md atualizado com conclusão da Fase 2
