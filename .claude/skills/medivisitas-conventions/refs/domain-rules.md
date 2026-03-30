---
name: domain-rules
description: Regras de negócio detalhadas do domínio MediVisitas
---

# domain-rules.md

## Pipeline Comercial

```
Prospectado → Visitado → Interessado → Prescritor → Fidelizado
```

- Cada `Profissional` tem **exatamente um** `estagioPipeline` ativo por vez.
- Transições são **imutáveis**: gravadas em `EstagioLog` (sem `deletedAt`, sem `updatedAt`).
- `EstagioLog` registra: `estagioAnterior`, `estagioNovo`, `userId`, `createdAt`.

## Visitas (Fase 3 — pendente)

- Uma `Visita` pertence a um `Profissional`.
- Campos: `data`, `duracao`, `observacoes`, `transcricao` (Fase 5), `status`.
- **Nunca deletar** — usar `status: 'cancelada'`.
- Datas/Horas: `DateTime` com `@default(now())` — nunca string.

## Especialidades

- Categorias: `Médicos`, `Farmácia`, `Odontologia`, `Outros`.
- Usa `optgroup` no select do frontend para separar categorias.
- Nunca deletar — soft delete apenas.

## Autenticação (Clerk)

### Backend (`apps/api/src/hooks/auth.ts`)

```typescript
import { verifyToken } from "@clerk/backend";

export async function verifyClerkToken(request, reply) {
  const token = request.headers.authorization?.replace("Bearer ", "");
  const payload = await verifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY!,
    jwtKey: process.env.CLERK_JWT_KEY!,
  });
  request.userId = payload.sub;
  request.orgId = payload.org_id;
}
```

### Frontend (Next.js middleware)

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

## MiniMax 2.7 — Fase 5 (pendente)

- Transcrição via API REST — **não armazenar áudio** após transcrição (LGPD).
- Transcrições vinculadas à `Visita` — **imutáveis** após confirmação.
- Usar skill `claude-api` para integração.

## Multi-tenant (Fase 10 — pendente)

- Cada organização tem `clerkOrgId` em `Organization`.
- Filtros por `orgId` em todas as queries de negócio.
