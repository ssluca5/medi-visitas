---
name: entities-detailed
description: Mapeamento detalhado das entidades do MediVisitas
---

# entities.md

## Usuario

```prisma
model Usuario {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  role      String   @default("USER")
  deletedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([clerkId])
}
```

- `clerkId`: vem do Clerk (`session.sub`)
- `role`: `USER` | `ADMIN`

---

## Organization

```prisma
model Organization {
  id         String    @id @default(cuid())
  clerkOrgId String    @unique
  name       String
  deletedAt  DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}
```

- `clerkOrgId`: ID da org no Clerk (para multi-tenant, Fase 10)

---

## Especialidade

```prisma
model Especialidade {
  id        String    @id @default(cuid())
  nome      String
  categoria String    // "Médicos" | "Farmácia" | "Odontologia" | "Outros"
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  profissionais Profissional[]

  @@index([categoria])
  @@index([deletedAt])
}
```

---

## Endereco

```prisma
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
```

---

## Profissional

```prisma
model Profissional {
  id              String              @id @default(cuid())
  nome            String
  crm             String?
  email           String?
  telefone        String?
  potencial       PotencialPrescricao  @default(MEDIO)
  estagioPipeline EstagioPipeline      @default(PROSPECTADO)
  especialidadeId String?
  enderecoId      String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  deletedAt       DateTime?

  especialidade   Especialidade?      @relation(fields: [especialidadeId], references: [id], onDelete: Restrict)
  endereco        Endereco?           @relation(fields: [enderecoId], references: [id], onDelete: Restrict)
  contatos        ContatoProfissional[]
  estagioLogs     EstagioLog[]

  @@index([potencial])
  @@index([estagioPipeline])
  @@index([deletedAt])
}
```

### Enums

```prisma
enum PotencialPrescricao {
  ALTO
  MEDIO
  BAIXO
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
```

---

## ContatoProfissional

```prisma
model ContatoProfissional {
  id             String       @id @default(cuid())
  profissionalId String
  tipo           TipoContato
  valor          String
  observacao     String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  deletedAt      DateTime?

  profissional   Profissional @relation(fields: [profissionalId], references: [id], onDelete: Restrict)

  @@index([profissionalId])
  @@index([deletedAt])
}
```

---

## EstagioLog (IMUTÁVEL)

```prisma
// EstagioLog é IMUTÁVEL por design — sem deletedAt, sem updatedAt
model EstagioLog {
  id              String         @id @default(cuid())
  profissionalId  String
  estagioAnterior EstagioPipeline?
  estagioNovo     EstagioPipeline
  userId          String
  createdAt       DateTime       @default(now())

  profissional    Profissional   @relation(fields: [profissionalId], references: [id], onDelete: Restrict)

  @@index([profissionalId])
}
```

**Importante**: Não tem `deletedAt` nem `updatedAt` — nunca fazer update ou delete.
