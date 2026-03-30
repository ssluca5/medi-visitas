---
name: domain-model
description: Resumo do modelo de domínio do MediVisitas
---

# domain-model

## Entidades Principais

| Entidade              | Descrição                     | Soft Delete        |
| --------------------- | ----------------------------- | ------------------ |
| `Usuario`             | Usuários do sistema via Clerk | Sim                |
| `Organization`        | Organizações (clerkOrgId)     | Sim                |
| `Especialidade`       | Especialidades médicas        | Sim                |
| `Endereco`            | Endereços de profissionais    | Sim                |
| `Profissional`        | Profissionais da visita       | Sim                |
| `ContatoProfissional` | Contatos (tel/email)          | Sim                |
| `EstagioLog`          | Log imutável de transições    | **Não** (imutável) |

## Relacionamentos

```
Usuario (1) → (N) Organization
Organization (1) → (N) Profissional
Especialidade (1) → (N) Profissional
Profissional (1) → (N) Endereco
Profissional (1) → (N) ContatoProfissional
Profissional (1) → (N) EstagioLog
```

## Enums

- `PotencialPrescricao`: `ALTO`, `MEDIO`, `BAIXO`
- `EstagioPipeline`: `PROSPECTADO`, `VISITADO`, `INTERESSADO`, `PRESCRITOR`, `FIDELIZADO`
- `TipoContato`: `TELEFONE`, `EMAIL`, `WHATSAPP`, `OUTRO`

## Detalhes

- `EstagioLog` não tem `deletedAt` nem `updatedAt` — é imutável.
- `Profissional` tem exatamente um `estagioPipeline` ativo.
- Todas as outras entidades de negócio têm `deletedAt DateTime?`.
