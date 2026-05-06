# MediVisitas — Contexto do Domínio

## O que é

CRM especializado para propagandistas farmacêuticos (representantes de laboratórios
que visitam médicos e clínicas para promover medicamentos).

## Quem usa

- Propagandistas farmacêuticos em campo (usuário principal)
- Gestores de equipe de vendas (usuário secundário)
- A esposa do desenvolvedor usa este sistema no trabalho

## Problema que resolve

Propagandistas perdem vendas por falta de controle de visitas, histórico de médicos
visitados, e acompanhamento de metas. Hoje usam planilhas ou memória.

## Domínio principal

- Profissional de Saúde (Doctor) — médico/farmacêutico/clínico visitado pelo propagandista
- Visita (Visit) — registro de uma visita a um profissional
- Produto (Product) — medicamento sendo promovido pelo laboratório
- Meta (Goal) — meta de visitas por período
- Roteiro (Route) — planejamento de visitas do dia/semana
- Laboratório (Organization/Lab) — empresa que o propagandista representa
- Especialidade (Specialty) — área médica do profissional visitado
- Estágio (Stage) — estágio do profissional no pipeline comercial

## Pipeline Comercial

```
Prospectado → Visitado → Interessado → Prescritor → Fidelizado
```

- Cada profissional tem **exatamente um** estágio ativo
- Transições registradas em `EstagioLog` (imutável)

## Status atual

Produto em fase avançada (10+ fases concluídas, incluindo multi-tenant SaaS e billing Stripe).
Próximo passo: integração com API da farmácia (Fase 9).

## Stack

- Frontend: SvelteKit 2 (Svelte 5 Runes) + Tailwind CSS v4
- Backend: Fastify 5.8 + Prisma 5.22 + PostgreSQL (Supabase)
- Auth: Clerk (@clerk/backend v3.4)
- IA/Áudio: MiniMax (Fase 5 — transcrição)
- Package Manager: pnpm monorepo
- Landing: Astro 5 + Svelte islands

## Decisões arquiteturais relevantes

- Soft delete obrigatório com `deletedAt` — nunca `DELETE`
- `onDelete: Restrict` em todas as FKs — nunca `Cascade`
- `Decimal(15,2)` para valores monetários/comissões
- Clerk JWT via `preHandler` hook — nunca inline nas rotas
- FAB + Sheet lateral para create/edit — nunca modal centralizado
- View Transitions API via `onNavigate` no layout root
