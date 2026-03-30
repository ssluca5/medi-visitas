---
name: domain-review
description: Revisa conformidade com regras do domínio médico. Use /domain-review.
---

# domain-review

## Verificações

1. **Ler diff das mudanças**

   ```bash
   git diff main -- apps/api/src/ apps/web/src/ packages/database/prisma/
   ```

2. **Autorização antes de acesso a dados de pacientes**
   - Verificar que `verifyClerkToken` está no `preHandler` de toda rota de profissionais/visitas
   - Verificar que `request.userId` é usado para filtrar dados

3. **Datas/Horas: seguem o padrão do projeto?**
   - `DateTime` com `@default(now())` no Prisma
   - Nunca `String` para datas

4. **Exclusões: usam soft delete?**
   - Buscar `prisma.model.delete(` → deveria ser `update` com `deletedAt`
   - `EstagioLog` é exceção: não tem soft delete (imutável)

5. **Relatório**: cada violação com arquivo, linha e descrição.
