---
name: health-check
description: Verificação de saúde do projeto MediVisitas. Use /health-check.
---

# health-check

## Verificações

1. **Typecheck completo**

   ```bash
   cd apps/api ; npx tsc --noEmit
   cd apps/web ; npx tsc --noEmit
   ```

2. **Lint sem warnings novos**

   ```bash
   cd apps/web ; npx next lint
   ```

3. **Buscar uso de `any` no TypeScript**

   ```bash
   grep -rn ": any" apps/api/src/ apps/web/src/
   grep -rn "as any" apps/api/src/ apps/web/src/
   ```

4. **Buscar hard delete em dados de pacientes**

   ```bash
   grep -rn "\.delete\(" apps/api/src/routes/
   # exceto EstagioLog
   ```

5. **Verificar variáveis de ambiente documentadas**
   - `CLERK_SECRET_KEY`
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_JWT_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`

6. **Relatório**: arquivo, linha e descrição de cada problema encontrado.
