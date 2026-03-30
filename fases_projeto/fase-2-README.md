# Fase 2 — Cadastro de Profissionais + Classificação de Potencial

> MediVisitas · CRM para propagandistas farmacêuticos  
> Módulo: `apps/web` + `apps/api` + `packages/database`  
> Pré-requisito: **Fase 1 concluída** (auth Clerk funcionando)

---

## Objetivo da Fase

Implementar o cadastro completo de profissionais de saúde (médicos, farmacêuticos, dentistas etc.) com classificação de potencial de prescrição, incluindo:

- Schema Prisma: `Profissional`, `Especialidade`, `Endereco`, `ContatoProfissional`, `EstagioLog`
- Pipeline inicial: `Prospectado → Visitado → Interessado → Prescritor → Fidelizado`
- CRUD completo de profissionais via API Fastify (com soft delete)
- UI: listagem com filtros, FAB + Sheet lateral para criação/edição
- Classificação de potencial: `BAIXO | MEDIO | ALTO | ESTRATEGICO`
- Busca e paginação no backend

---

## Entregáveis

| #   | Artefato                                                            | Localização                                                                 |
| --- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Migration Prisma com todos os novos modelos                         | `packages/database/prisma/migrations/`                                      |
| 2   | Seed de especialidades                                              | `packages/database/prisma/seed.ts`                                          |
| 3   | `POST /profissionais` — criação com validação Zod                   | `apps/api/src/routes/profissionais/create.ts`                               |
| 4   | `GET /profissionais` — listagem com filtros + paginação             | `apps/api/src/routes/profissionais/list.ts`                                 |
| 5   | `GET /profissionais/:id` — detalhe                                  | `apps/api/src/routes/profissionais/get.ts`                                  |
| 6   | `PUT /profissionais/:id` — edição                                   | `apps/api/src/routes/profissionais/update.ts`                               |
| 7   | `DELETE /profissionais/:id` — soft delete                           | `apps/api/src/routes/profissionais/delete.ts`                               |
| 8   | `PATCH /profissionais/:id/estagio` — mudança de estágio do pipeline | `apps/api/src/routes/profissionais/estagio.ts`                              |
| 9   | Página `/dashboard/profissionais` — listagem + filtros              | `apps/web/app/(protected)/dashboard/profissionais/page.tsx`                 |
| 10  | Sheet lateral de criação/edição                                     | `apps/web/components/profissionais/ProfissionalSheet.tsx`                   |
| 11  | Badges de potencial e estágio                                       | `apps/web/components/profissionais/PotencialBadge.tsx` + `EstagioBadge.tsx` |
| 12  | Testes das 6 rotas (TDD)                                            | `apps/api/src/routes/profissionais/*.test.ts`                               |

---

## Modelo de Dados (Prisma)

```prisma
// Acrescentar em packages/database/prisma/schema.prisma

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
  CELULAR
  EMAIL
  WHATSAPP
}

model Especialidade {
  id            String         @id @default(cuid())
  nome          String         @unique
  profissionais Profissional[]
  deletedAt     DateTime?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Profissional {
  id               String               @id @default(cuid())
  nome             String
  crm              String?              @unique
  crf              String?              @unique
  cro              String?              @unique
  especialidadeId  String
  especialidade    Especialidade        @relation(fields: [especialidadeId], references: [id], onDelete: Restrict)
  potencial        PotencialPrescricao  @default(MEDIO)
  estagioPipeline  EstagioPipeline      @default(PROSPECTADO)
  observacoes      String?
  enderecos        Endereco[]
  contatos         ContatoProfissional[]
  estagioLogs      EstagioLog[]
  deletedAt        DateTime?
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt

  @@index([especialidadeId])
  @@index([potencial])
  @@index([estagioPipeline])
  @@index([deletedAt])
}

model Endereco {
  id             String       @id @default(cuid())
  profissionalId String
  profissional   Profissional @relation(fields: [profissionalId], references: [id], onDelete: Restrict)
  logradouro     String
  numero         String
  complemento    String?
  bairro         String
  cidade         String
  estado         String       @db.Char(2)
  cep            String       @db.Char(8)
  principal      Boolean      @default(false)
  deletedAt      DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([profissionalId])
}

model ContatoProfissional {
  id             String       @id @default(cuid())
  profissionalId String
  profissional   Profissional @relation(fields: [profissionalId], references: [id], onDelete: Restrict)
  tipo           TipoContato
  valor          String
  principal      Boolean      @default(false)
  deletedAt      DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([profissionalId])
}

model EstagioLog {
  id              String           @id @default(cuid())
  profissionalId  String
  profissional    Profissional     @relation(fields: [profissionalId], references: [id], onDelete: Restrict)
  estagioAnterior EstagioPipeline?
  estagioNovo     EstagioPipeline
  userId          String           // Clerk userId — sem FK (sistema externo)
  observacao      String?
  // Imutável por design: sem deletedAt, sem updatedAt
  createdAt       DateTime         @default(now())

  @@index([profissionalId])
  @@index([userId])
}
```

> **Regras obrigatórias aplicadas:**
>
> - `deletedAt` em todas as entidades de negócio (exceto `EstagioLog` — imutável por design)
> - `onDelete: Restrict` em **todas** as FKs — nunca Cascade
> - Índices em colunas de filtro frequente: `potencial`, `estagioPipeline`, `deletedAt`
> - `EstagioLog` é append-only: sem soft delete, sem updatedAt

---

## Contratos de API

### `POST /profissionais` → 201

```json
// Body
{
  "nome": "Dr. João Silva",
  "crm": "12345-SP",
  "especialidadeId": "cuid...",
  "potencial": "ALTO",
  "observacoes": "Preferência por visitas às terças",
  "enderecos": [
    {
      "logradouro": "Av. Paulista",
      "numero": "1000",
      "bairro": "Bela Vista",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01310100",
      "principal": true
    }
  ],
  "contatos": [
    {
      "tipo": "CELULAR",
      "valor": "11999999999",
      "principal": true
    }
  ]
}
```

### `GET /profissionais` → 200

```
Query params:
  page            Int     default 1
  pageSize        Int     default 20 (max 100)
  busca           String  (nome, crm, crf, cro — ILIKE)
  potencial       PotencialPrescricao
  estagio         EstagioPipeline
  especialidadeId String

Response:
{
  "data": [ ...profissionais com especialidade incluída ],
  "total": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

### `PATCH /profissionais/:id/estagio` → 200

```json
// Body
{ "estagioNovo": "VISITADO", "observacao": "Primeira visita realizada" }

// Comportamento:
// 1. Cria EstagioLog imutável com estagioAnterior + estagioNovo + userId
// 2. Atualiza Profissional.estagioPipeline
// 3. Retorna profissional atualizado
```

> **Regra:** `GET /profissionais` e `GET /profissionais/:id` **nunca** retornam registros com `deletedAt != null`.

---

## Seed de Especialidades

```typescript
// packages/database/prisma/seed.ts
const especialidades = [
  // Médicos — Clínica
  { nome: "Clínico Geral" },
  { nome: "Médico de Família" },
  // Médicos — Especialistas
  { nome: "Cardiologista" },
  { nome: "Endocrinologista" },
  { nome: "Neurologista" },
  { nome: "Pediatra" },
  { nome: "Psiquiatra" },
  { nome: "Reumatologista" },
  { nome: "Ginecologista" },
  { nome: "Urologista" },
  // Farmácia
  { nome: "Farmacêutico" },
  // Odontologia
  { nome: "Dentista" },
  { nome: "Ortodontista" },
];
```

---

## Estrutura de Pastas Esperada ao Final da Fase

```
apps/
├── web/
│   ├── app/(protected)/dashboard/
│   │   └── profissionais/
│   │       └── page.tsx                    ← listagem + filtros
│   └── components/
│       └── profissionais/
│           ├── ProfissionalSheet.tsx        ← FAB + Sheet criar/editar
│           ├── ProfissionalCard.tsx         ← linha/card da listagem
│           ├── PotencialBadge.tsx           ← badge colorido de potencial
│           ├── EstagioBadge.tsx             ← badge de estágio do pipeline
│           └── FiltrosProfissionais.tsx     ← barra de filtros
└── api/
    └── src/
        └── routes/
            └── profissionais/
                ├── index.ts                 ← registra todas as rotas do domínio
                ├── create.ts
                ├── create.test.ts
                ├── list.ts
                ├── list.test.ts
                ├── get.ts
                ├── get.test.ts
                ├── update.ts
                ├── update.test.ts
                ├── delete.ts
                ├── delete.test.ts
                ├── estagio.ts
                └── estagio.test.ts
```

---

## Padrões de UI para esta Fase

### Listagem de Profissionais

- Tabela com colunas: **Nome · Especialidade · Potencial · Estágio · Ações**
- Barra de filtros acima: busca textual + select de potencial + select de estágio
- **FAB** no canto inferior direito (`+`) → abre Sheet em modo criação
- Clicar em qualquer linha → abre Sheet em modo edição

### Badges de Potencial

| Valor         | Cor                                    |
| ------------- | -------------------------------------- |
| `BAIXO`       | cinza · `rgb(var(--color-text-muted))` |
| `MEDIO`       | azul · `rgb(var(--color-brand-500))`   |
| `ALTO`        | âmbar · `rgb(220 150 30)`              |
| `ESTRATEGICO` | verde · `rgb(22 163 74)`               |

### Badges de Estágio do Pipeline

| Valor         | Cor          |
| ------------- | ------------ |
| `PROSPECTADO` | cinza neutro |
| `VISITADO`    | azul claro   |
| `INTERESSADO` | amarelo      |
| `PRESCRITOR`  | verde claro  |
| `FIDELIZADO`  | verde escuro |

### Sheet Lateral (FAB + Sheet)

- Largura: `min(480px, 100vw)` — full-width em mobile
- Seções do formulário: **Dados Pessoais · Especialidade · Potencial · Endereço · Contatos**
- Select de especialidade com `optgroup` separando Médicos / Farmácia / Odontologia
- Textos auxiliares de campos opcionais ficam **abaixo** do label
- Botão salvar: `style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '8px' }}`
- Nunca usar modal centralizado — sempre Sheet lateral

---

## Skills Necessárias para esta Fase

| Skill                              | Repositório           | Obrigatória                      |
| ---------------------------------- | --------------------- | -------------------------------- |
| `brainstorming`                    | obra/superpowers      | ✅ Sim                           |
| `write-plan`                       | obra/superpowers      | ✅ Sim                           |
| `test-driven-development`          | obra/superpowers      | ✅ Sim                           |
| `verification-before-completion`   | obra/superpowers      | ✅ Sim                           |
| `frontend-design`                  | anthropics/skills     | ✅ Sim                           |
| `fastify`                          | mcollina/skills       | ✅ Sim                           |
| `node`                             | mcollina/skills       | ✅ Sim                           |
| `typescript-magician`              | mcollina/skills       | ✅ Sim — enums + tipos complexos |
| `supabase-postgres-best-practices` | supabase/agent-skills | ✅ Sim                           |

---

## Sequência de Implementação (TDD)

```
1.  [PLAN]    Rodar skill `brainstorming` → decisões de schema, paginação, filtros
2.  [PLAN]    Rodar skill `write-plan` → subtarefas atômicas
3.  [DB]      Escrever migration Prisma com todos os modelos
4.  [DB]      Aplicar migration: pnpm --filter database prisma migrate dev --name profissionais
5.  [DB]      Criar e executar seed de especialidades
6.  [DB]      Verificar tabelas e índices no Supabase / Prisma Studio
7.  [API RED] Escrever testes falhando para POST /profissionais
8.  [API GRN] Implementar POST /profissionais
9.  [API RED] Escrever testes falhando para GET /profissionais (paginação + filtros)
10. [API GRN] Implementar GET /profissionais
11. [API]     Repetir ciclo TDD para GET/:id → PUT → DELETE → PATCH /estagio
12. [API RFT] Extrair schemas Zod compartilhados; verificar tipagem completa
13. [WEB]     PotencialBadge + EstagioBadge (componentes puros, sem lógica de fetch)
14. [WEB]     FiltrosProfissionais (estado local, emite callbacks)
15. [WEB]     ProfissionalSheet (FAB + Sheet, formulário controlado, chamadas à API)
16. [WEB]     Página /dashboard/profissionais (integração completa)
17. [VER]     Rodar skill `verification-before-completion`
```

---

## Checklist de Conclusão da Fase 2

```
Banco de Dados
[ ] Migration aplicada sem erros
[ ] Tabelas criadas: Especialidade, Profissional, Endereco, ContatoProfissional, EstagioLog
[ ] Seed executado — especialidades disponíveis
[ ] Índices criados: potencial, estagioPipeline, deletedAt, especialidadeId
[ ] EstagioLog: sem deletedAt, sem updatedAt (imutável)
[ ] onDelete: Restrict em todas as FKs

API
[ ] POST   /profissionais → 201 com dados corretos
[ ] GET    /profissionais → lista paginada com filtros funcionando
[ ] GET    /profissionais → nunca retorna registros com deletedAt != null
[ ] GET    /profissionais/:id → 404 para id inexistente ou deletado
[ ] PUT    /profissionais/:id → atualiza campos e retorna profissional atualizado
[ ] DELETE /profissionais/:id → soft delete (seta deletedAt, não remove do banco)
[ ] PATCH  /profissionais/:id/estagio → cria EstagioLog + atualiza estagioPipeline
[ ] Todas as rotas protegidas com verifyClerkToken no preHandler
[ ] Validação Zod em todos os bodies e query params
[ ] Testes passando para todas as rotas

Frontend
[ ] Listagem carrega profissionais corretamente via API
[ ] Filtros (busca textual, potencial, estágio) atualizam a lista
[ ] Paginação funciona
[ ] FAB abre Sheet lateral de criação
[ ] Sheet de criação envia POST e atualiza a listagem ao salvar
[ ] Clicar em profissional abre Sheet em modo edição com dados preenchidos
[ ] Sheet de edição envia PUT e atualiza a listagem ao salvar
[ ] PotencialBadge exibe cor correta para cada nível
[ ] EstagioBadge exibe cor correta para cada estágio
[ ] Select de especialidade usa optgroup (Médicos / Farmácia / Odontologia)
[ ] Nenhum hex hardcoded em componentes (somente CSS variables)
[ ] Sheet é lateral — nunca modal centralizado

Geral
[ ] pnpm test — todos os testes passando
[ ] Sem TypeScript errors (pnpm --filter web build ; pnpm --filter api build)
[ ] Skill verification-before-completion executada
[ ] CLAUDE.md atualizado: Fase 2 marcada como ✅ Concluída
```

---

## Comandos Úteis (PowerShell)

```powershell
# Nova migration
pnpm --filter database prisma migrate dev --name profissionais

# Executar seed
pnpm --filter database prisma db seed

# Visualizar banco
pnpm --filter database prisma studio

# Rodar API (porta 3001)
pnpm --filter api dev

# Rodar Web (porta 3000)
pnpm --filter web dev

# Rodar testes da API
pnpm --filter api test

# Type check do frontend
pnpm --filter web build

# Verificar porta em uso
Get-NetTCPConnection -LocalPort 3001

# Matar processo na porta
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess
```

---

## Resultado Esperado

Ao concluir a Fase 2, o propagandista poderá:

1. Cadastrar profissionais de saúde com dados completos (CRM/CRF/CRO, especialidade, endereço, contatos)
2. Classificar cada profissional pelo potencial de prescrição (Baixo → Estratégico)
3. Visualizar e filtrar sua carteira de profissionais
4. Avançar profissionais no pipeline (Prospectado → Fidelizado) com log imutável de cada transição
5. Editar dados cadastrais via Sheet lateral sem perder contexto da listagem
