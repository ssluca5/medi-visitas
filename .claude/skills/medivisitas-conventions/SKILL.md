---
name: medivisitas-conventions
description: Convenções de código e domínio do MediVisitas. Consultar antes de qualquer implementação.
---

# medivisitas-conventions

## Gotchas (prioridade máxima)

### Banco de Dados

- **Soft delete é obrigatório** em todas entidades de negócio — exceto `EstagioLog` (é imutável).
- **NUNCA** usar hard delete: `prisma.model.delete({ where: { id } })` → usar `update` com `deletedAt`.
- `onDelete: Restrict` em todas FKs — `Cascade` está proibido.
- `Decimal(15,2)` para valores monetários/comissões.

### Backend

- Clerk JWT vai no `preHandler`, **nunca inline** na rota.
- Validar sempre com Zod schema antes de acessar o banco.
- Não fazer `console.log` em produção — usar Pino logger do Fastify.

### Frontend

- **Nunca hex hardcoded** — usar CSS Variables de `globals.css`.
- FAB + Sheet lateral para create/edit — **nunca modal centralizado**.
- `DropdownMenuContent` precisa de `style={{ backgroundColor: '...' }}` inline.
- Campos opcionais: hint **abaixo** do label, não acima.

## Referências

- Regras de domínio: `refs/domain-rules.md`
- Padrões de UI: `refs/ui-patterns.md`
