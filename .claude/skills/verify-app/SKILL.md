---
name: verify-app
description: Checklist de verificação após qualquer mudança no MediVisitas
---

# verify-app

## Checklist — rodar após qualquer mudança

1. **Typecheck completo**

   ```bash
   cd apps/api && npx tsc --noEmit
   cd apps/web && npx tsc --noEmit
   ```

2. **Lint sem warnings novos**

   ```bash
   cd apps/web && npx next lint
   ```

3. **Testar fluxo crítico afetado**
   - Se mudou rota backend: testar a rota com curl ou Postman
   - Se mudou componente frontend: verificar no browser

4. **Dados de pacientes NÃO expostos sem autorização**
   - Verificar que rotas de profissionais filtram por `deletedAt: null`
   - Verificar que Clerk JWT está sendo validado no preHandler

5. **Exclusões usam soft delete**
   - Buscar `.delete(` que não seja `EstagioLog`
   - Confirmar que usa `update` com `deletedAt`

6. **Datas/Horas seguem o padrão**
   - `DateTime` com `@default(now())` no Prisma
   - Nunca string para datas
