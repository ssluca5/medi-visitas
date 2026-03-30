# MediVisitas — CLAUDE.md

> CRM para propagandistas farmacêuticos  
> Ambiente: Windows / PowerShell / pnpm monorepo / Kilo Code no VS Code

---

## Estrutura do Monorepo

```
mediivisitas/
├── apps/
│   ├── web/          # Next.js 14 (App Router) → README: apps/web/README.md
│   └── api/          # Fastify              → README: apps/api/README.md
├── packages/
│   └── database/     # Prisma + tipos       → README: packages/database/README.md
├── CLAUDE.md
└── pnpm-workspace.yaml
```

> **Sempre consultar o `README.md` da pasta relevante** antes de iniciar qualquer implementação.  
> Cada README contém as **skills específicas** para aquele módulo.

---

## Stack

| Camada          | Tecnologia                        |
|-----------------|-----------------------------------|
| Frontend        | Next.js 14 (App Router)           |
| Backend         | Fastify                           |
| ORM             | Prisma                            |
| Banco           | PostgreSQL via Supabase            |
| Auth            | Clerk                             |
| IA / Áudio      | MiniMax 2.7                       |
| Package Manager | pnpm (monorepo)                   |

---

## Roadmap — 10 Fases

| Fase | Escopo                                             | Skills Principais              | Status     |
|------|----------------------------------------------------|-------------------------------|------------|
| 1    | Setup + Autenticação (Clerk)                       | `frontend-design`, `fastify`  | ✅ Concluída |
| 2    | Cadastro profissional + Classificação de potencial | `frontend-design`, `fastify`, `supabase-postgres-best-practices` | ✅ Concluída |
| 3    | Histórico de visitas + Materiais técnicos          | idem Fase 2                   | ⬜ Pendente |
| 4    | Agenda inteligente                                 | idem + `brainstorming`        | ⬜ Pendente |
| 5    | IA — transcrição de visitas com MiniMax 2.7        | `claude-api`, `node`          | ⬜ Pendente |
| 6    | Dashboard + CRM avançado                           | `frontend-design`, `canvas-design` | ⬜ Pendente |
| 7    | Pipeline comercial + Analytics                     | `frontend-design`, `fastify`  | ⬜ Pendente |
| 8    | Notificações + Lembretes automáticos               | `supabase-edge-functions`     | ⬜ Pendente |
| 9    | Integração com API de farmácia                     | `fastify`, `node`             | ⬜ Pendente |
| 10   | Multi-tenant SaaS                                  | `brainstorming`, `write-plan` | ⬜ Pendente |

> Abrir uma nova conversa no Kilo Code por fase.

---

## Catálogo de Skills

Instalar antes de começar. Cada módulo tem sua tabela detalhada no respectivo `README.md`.

### Diretório de skills

O Kilo Code lê skills em:

```
.kilocode/
└── skills/
    ├── frontend-design/SKILL.md
    ├── fastify/SKILL.md
    ├── brainstorming/SKILL.md
    └── ...
```

### Instalação manual (PowerShell)

O Kilo Code não suporta `/plugin marketplace` do Claude Code. Instalar clonando os repositórios e copiando para `.kilocode\skills\`:

```powershell
# 1. obra/superpowers (TDD, debugging, planning)
git clone https://github.com/obra/superpowers.git C:\temp\superpowers
Copy-Item -Recurse "C:\temp\superpowers\skills\*" ".kilocode\skills\"

# 2. anthropics/skills (frontend-design, claude-api, etc.)
git clone https://github.com/anthropics/skills.git C:\temp\anthropic-skills
Copy-Item -Recurse "C:\temp\anthropic-skills\skills\frontend-design" ".kilocode\skills\"
Copy-Item -Recurse "C:\temp\anthropic-skills\skills\claude-api" ".kilocode\skills\"
Copy-Item -Recurse "C:\temp\anthropic-skills\skills\canvas-design" ".kilocode\skills\"
Copy-Item -Recurse "C:\temp\anthropic-skills\skills\web-artifacts-builder" ".kilocode\skills\"
Copy-Item -Recurse "C:\temp\anthropic-skills\skills\webapp-testing" ".kilocode\skills\"

# 3. mcollina/skills (Fastify, Node.js)
git clone https://github.com/mcollina/skills.git C:\temp\mcollina-skills
Copy-Item -Recurse "C:\temp\mcollina-skills\skills\*" ".kilocode\skills\"

# 4. supabase/agent-skills (Postgres, RLS, Edge Functions)
git clone https://github.com/supabase/agent-skills.git C:\temp\supabase-skills
Copy-Item -Recurse "C:\temp\supabase-skills\skills\*" ".kilocode\skills\"
```

### Skills da Anthropic

| Skill | Quando usar |
|-------|-------------|
| `frontend-design` | Qualquer implementação de UI/UX, componentes, páginas |
| `canvas-design` | Mockups, wireframes, composições visuais |
| `web-artifacts-builder` | Artifacts HTML/React interativos |
| `webapp-testing` | Testes E2E e de componentes web |
| `claude-api` | Integração com MiniMax ou qualquer API de IA (Fase 5) |

### Skills obra/superpowers (processo de desenvolvimento)

| Skill | Quando usar |
|-------|-------------|
| `brainstorming` | **Sempre antes** de iniciar uma feature nova |
| `write-plan` | Features com múltiplos arquivos ou etapas |
| `execute-plan` | Execução do plano em lotes de subagentes |
| `test-driven-development` | **Todo** código de lógica (RED → GREEN → REFACTOR) |
| `systematic-debugging` | Investigação de bugs — nunca adivinhar, sempre diagnosticar |
| `root-cause-tracing` | Problemas recorrentes ou difíceis de reproduzir |
| `testing-anti-patterns` | Revisão de qualidade de testes existentes |
| `verification-before-completion` | **Sempre antes** de encerrar uma sessão |
| `requesting-code-review` | Antes de abrir PR |
| `receiving-code-review` | Ao processar feedback de review |

### Skills mcollina/skills (Fastify + Node.js)

Criadas por Matteo Collina — maintainer do Fastify e membro do TSC do Node.js.

| Skill | Quando usar |
|-------|-------------|
| `fastify` | Qualquer rota, plugin, hook ou middleware no Fastify |
| `node` | Patterns async, error handling, graceful shutdown |
| `oauth` | Fluxo de auth Clerk JWT, tokens, OAuth 2.0 |
| `typescript-magician` | Tipagem avançada, eliminação de `any` |
| `linting-neostandard-eslint9` | Configuração/manutenção de ESLint |

### Skills supabase/agent-skills (banco de dados)

Skills oficiais mantidas pela equipe do Supabase.

| Skill | Quando usar |
|-------|-------------|
| `supabase-postgres-best-practices` | Migrations, queries, índices, RLS — **obrigatório** |
| `supabase-auth` | Configuração de RLS com autenticação |
| `supabase-edge-functions` | Funções serverless no Supabase (Fase 8) |

---

## Convenções de Código

### Banco de Dados (Prisma)

- **Soft delete obrigatório** — nunca `DELETE` em dados de negócio; usar `deletedAt DateTime?`
- **`onDelete: Restrict`** em todas as FKs — nunca `Cascade`
- **`Decimal(15,2)`** para valores monetários e comissões
- Campos de auditoria em toda entidade: `createdAt`, `updatedAt`, `deletedAt`

```prisma
model Exemplo {
  id        String    @id @default(cuid())
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Frontend (Next.js)

- **CSS Variables para todas as cores** — nunca hex hardcoded em componentes
- **FAB + Sheet lateral** — padrão para create/edit; nunca modal centralizado
- **`DropdownMenuContent`** com `style` inline explícito para `backgroundColor`
- **Botões** com `style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '8px' }}`
- Textos auxiliares de campos opcionais ficam **abaixo** do label
- Prefer `optgroup` em selects para separar categorias

### Backend (Fastify)

- **Clerk JWT** decodificado em `preHandler` hook — não inline nas rotas
- Rotas organizadas por domínio: `/profissionais`, `/visitas`, `/agenda`, `/pipeline`
- Respostas sempre tipadas via Zod schemas

### PowerShell / Windows

- Usar **`;`** no lugar de `&&` para encadear comandos
- Gerenciamento de portas: `Get-NetTCPConnection -LocalPort <porta>`
- Matar processo: `Stop-Process -Id (Get-NetTCPConnection -LocalPort <porta>).OwningProcess`

---

## Autenticação (Clerk)

```typescript
// apps/api/src/hooks/auth.ts
export async function verifyClerkToken(request, reply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    const session = await clerkClient.verifyToken(token)
    request.userId = session.sub
    request.orgId = session.org_id  // para multi-tenant (Fase 10)
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}
```

---

## Pipeline Comercial

```
Prospectado → Visitado → Interessado → Prescritor → Fidelizado
```

- Cada profissional tem exatamente um estágio ativo
- Transições registradas com timestamp e userId em `EstagioLog` (imutável, sem soft delete)

---

## Modelo de IA (MiniMax 2.7) — Fase 5

- Transcrição de áudio de visitas via API REST do MiniMax
- Áudios **não armazenados** em produção após transcrição (LGPD)
- Transcrições vinculadas à `Visita` e imutáveis após confirmação
- Usar a skill `claude-api` como referência de boas práticas de integração com APIs de IA

---

## Contexto para Kilo Code

Ao iniciar cada sessão:

1. Referenciar este `CLAUDE.md` no início da conversa
2. Ler o `README.md` da pasta da fase atual
3. Verificar/instalar as skills necessárias para o módulo
4. Nunca assumir implementações de sessões anteriores — verificar código existente
5. Uma sessão por fase; não misturar escopos

---

## Checklist de Qualidade (por feature)

- [ ] Soft delete implementado (`deletedAt DateTime?`)
- [ ] FK com `onDelete: Restrict`
- [ ] Validação Zod na rota Fastify
- [ ] Hook Clerk no preHandler
- [ ] CSS via variáveis (sem hex hardcoded)
- [ ] FAB + Sheet para create/edit
- [ ] Testes escritos antes do código (TDD via `test-driven-development`)
- [ ] Verificação completa antes de encerrar sessão (`verification-before-completion`)

---

## Log de Implementação

### Fase 1 — Setup + Autenticação (Clerk)
- **Concluída em:** 2026-03-25
- **Migrations aplicadas:** `20260325161402_init`
- **Decisões tomadas:**
  - Uso de `verifyToken` direto de `@clerk/backend` (não `clerkClient` que foi deprecado)
  - Clerk middleware usa `clerkMiddleware` + `createRouteMatcher` (API v5)
  - Prisma 5.22.0 usado ao invés de 7.x (breaking changes no schema)
- **Pendências para Fase 2:** Nenhuma

### Fase 2 — Cadastro de Profissionais + Classificação de Potencial
- **Concluída em:** 2026-03-25
- **Migrations aplicadas:** `20260325210000_profissionais` (pendente execução - advisory lock timeout no Supabase)
- **Enums criados:** PotencialPrescricao, EstagioPipeline, TipoContato
- **Tabelas criadas:** Especialidade, Profissional, Endereco, ContatoProfissional, EstagioLog
- **Rotas implementadas:**
  - POST /profissionais - Criar profissional
  - GET /profissionais - Listar com paginação e filtros
  - GET /profissionais/:id - Buscar por ID
  - PUT /profissionais/:id - Atualizar profissional
  - DELETE /profissionais/:id - Soft delete
  - PATCH /profissionais/:id/estagio - Avançar pipeline com EstagioLog
- **Componentes frontend:**
  - PotencialBadge, EstagioBadge, FiltrosProfissionais
  - ProfissionalSheet com FAB + Sheet lateral
  - Página /dashboard/profissionais com listagem completa
- **Decisões tomadas:**
  - Uso de string literals para enums no frontend (evita dependência circular)
  - Seções colapsáveis no formulário com estado expandido/retraído
  - Especialidades com optgroup por categoria (Médicos/Farmácia/Odontologia)
- **Pendências para Fase 3:** Aplicar migration quando Supabase Advisory Lock for liberado