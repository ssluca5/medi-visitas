# packages/database — Prisma + PostgreSQL (Supabase)

> Camada de dados compartilhada do MediVisitas. Consulte o [`CLAUDE.md`](../../CLAUDE.md) na raiz para convenções globais.

---

## Stack local

| Item             | Detalhe                                     |
|------------------|---------------------------------------------|
| ORM              | Prisma                                      |
| Banco            | PostgreSQL via Supabase                     |
| Pool de conexões | Supabase Pooler (Transaction mode)          |

---

## Scripts

```powershell
# Gerar cliente Prisma
pnpm --filter database prisma generate

# Criar nova migration
pnpm --filter database prisma migrate dev --name <nome_descritivo>

# Aplicar migrations em produção
pnpm --filter database prisma migrate deploy

# Abrir Prisma Studio
pnpm --filter database prisma studio

# Reset do banco em desenvolvimento
pnpm --filter database prisma migrate reset
```

---

## Variáveis de ambiente

Arquivo: `packages/database/.env`

```env
# Pooler (Transaction mode) — para queries normais via Prisma
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct (para migrations — não usar pooler)
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> ⚠️ `DATABASE_URL` usa porta `6543` (pooler). `DIRECT_URL` usa porta `5432` (direto) — obrigatório para `migrate`.

---

## Configuração do schema.prisma

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")   // obrigatório para migrations no Supabase
}

generator client {
  provider = "prisma-client-js"
}
```

---

## Convenções de schema

### Campos obrigatórios em toda entidade principal

```prisma
model Exemplo {
  id        String    @id @default(cuid())
  // ... campos de negócio ...
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // soft delete — NUNCA deletar registros diretamente
}
```

### Soft delete — regra absoluta

```typescript
// ✅ Correto — sempre filtrar deletedAt
const profissionais = await prisma.profissional.findMany({
  where: { deletedAt: null }
})

// ✅ Correto — soft delete
await prisma.profissional.update({
  where: { id },
  data: { deletedAt: new Date() }
})

// ❌ NUNCA — hard delete em dados de negócio
await prisma.profissional.delete({ where: { id } })
```

### Foreign keys

```prisma
// ✅ Obrigatório — onDelete: Restrict em todas as FKs de negócio
visitas  Visita[]
model Visita {
  profissionalId String
  profissional   Profissional @relation(fields: [profissionalId], references: [id], onDelete: Restrict)
}
```

### Valores monetários

```prisma
// ✅ Decimal(15,2) para qualquer valor monetário ou comissão
comissao Decimal @db.Decimal(15, 2)
```

---

## Modelo de domínio — entidades principais

```prisma
enum Potencial {
  FRACO
  MEDIO
  FORTE
}

enum EstagiosPipeline {
  PROSPECTADO
  VISITADO
  INTERESSADO
  PRESCRITOR
  FIDELIZADO
}

model Profissional {
  id            String    @id @default(cuid())
  nome          String
  especialidade String
  crm           String?
  email         String?
  telefone      String?
  potencial     Potencial @default(MEDIO)
  estagio       EstagiosPipeline @default(PROSPECTADO)
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  visitas       Visita[]
  estagioLog    EstagioLog[]
}

model Visita {
  id              String   @id @default(cuid())
  profissionalId  String
  profissional    Profissional @relation(fields: [profissionalId], references: [id], onDelete: Restrict)
  userId          String   // Clerk userId do propagandista
  dataVisita      DateTime
  observacoes     String?
  transcricao     String?  // preenchida pela IA (Fase 5)
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  materiais       MaterialEnviado[]
}

model EstagioLog {
  id              String           @id @default(cuid())
  profissionalId  String
  profissional    Profissional     @relation(fields: [profissionalId], references: [id], onDelete: Restrict)
  estagioAnterior EstagiosPipeline
  estagioNovo     EstagiosPipeline
  userId          String           // quem fez a transição
  createdAt       DateTime         @default(now())
  // Sem deletedAt — log é imutável
}
```

---

## Skills para este módulo

Instalação Supabase: `npx skills add supabase/agent-skills`

### 🗄️ Banco de dados & Supabase

| Skill | Repositório | Instalação | Quando usar |
|-------|-------------|-----------|-------------|
| `supabase-postgres-best-practices` | `supabase/agent-skills` | `npx skills add supabase/agent-skills` | **Sempre** ao escrever migrations, queries ou RLS |
| `supabase-auth` | `supabase/agent-skills` | idem | Configuração de RLS com Clerk/auth |
| `supabase-edge-functions` | `supabase/agent-skills` | idem | Funções Supabase (Fase 8 — notificações) |

### 🧪 Qualidade

| Skill | Repositório | Quando usar |
|-------|-------------|-------------|
| `test-driven-development` | `obra/superpowers` | Testes de migrations e queries críticas |
| `verification-before-completion` | `obra/superpowers` | Antes de rodar `migrate deploy` em produção |

---

## Checklist de migration

- [ ] `DIRECT_URL` configurado (migrations falham com pooler)
- [ ] `onDelete: Restrict` em todas as FKs novas
- [ ] `deletedAt DateTime?` em entidades novas de negócio
- [ ] Valores monetários como `Decimal @db.Decimal(15, 2)`
- [ ] Migration testada com `prisma migrate dev` antes de commitar
- [ ] `prisma generate` executado após alterações no schema
