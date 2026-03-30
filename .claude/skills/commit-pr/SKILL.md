---
name: commit-pr
description: Commita mudanças, faz push e abre PR. Use /commit-pr.
---

# commit-pr

## Passo a passo

1. **Analisar diff staged**

   ```bash
   git diff --staged
   git status
   ```

2. **Escrever commit message** (formato Conventional Commits)

   ```
   tipo(escopo): descrição curta

   Descrição mais detalhada se necessário.
   ```

   Tipos: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`

3. **Commitar e fazer push**

   ```bash
   git add <arquivos>
   git commit -m "tipo(escopo): descrição"
   git push -u origin HEAD
   ```

4. **Abrir PR** com:
   - Título: mesmo do commit
   - Descrição: o que mudou e **como testar**
   - Label da fase (ex: `fase-3`)

   ```bash
   gh pr create --title "feat(profissionais): adicionar filtro por potencial" --body "## O que\n- Adiciona filtro por potencial na listagem\n\n## Como testar\n1. Ir a /dashboard/profissionais\n2. Verificar que o filtro funciona"
   ```
