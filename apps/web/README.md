# apps/web — MediVisitas Frontend

> SvelteKit 2 + Svelte 5 Runes + Tailwind CSS v4
> CRM para propagandistas farmacêuticos

---

## Stack

| Tecnologia   | Versão           | Uso                                    |
| ------------ | ---------------- | -------------------------------------- |
| SvelteKit    | 2.x              | Framework fullstack (SSR + SPA)        |
| Svelte       | 5.x              | UI com Runes API                       |
| Tailwind CSS | v4               | Estilização (CSS-first, sem config JS) |
| Clerk        | @clerk/sveltekit | Autenticação e gestão de sessão        |
| TypeScript   | 5.x              | Tipagem estática                       |
| Vite         | 6.x              | Bundler e dev server                   |

---

## Comandos

```powershell
# Desenvolvimento (porta 5173)
pnpm --filter @medivisitas/web dev

# Build de produção
pnpm --filter @medivisitas/web build

# Preview do build
pnpm --filter @medivisitas/web preview

# Verificação de tipos
pnpm --filter @medivisitas/web check
```

---

## Estrutura de Pastas

```
apps/web/
├── src/
│   ├── app.d.ts                    ← tipos globais (locals, PageData)
│   ├── app.html                    ← template HTML raiz
│   ├── app.css                     ← CSS global + Tailwind v4 @theme
│   ├── hooks.server.ts             ← middleware: valida JWT Clerk, injeta locals
│   ├── routes/
│   │   ├── +layout.svelte          ← layout raiz (ProgressBar, ToastContainer)
│   │   ├── +layout.server.ts       ← carrega sessionToken do Clerk
│   │   ├── +error.svelte           ← página de erro global (404, 500, 403)
│   │   ├── login/
│   │   │   └── [[...rest]]/        ← tela de login premium (split layout)
│   │   ├── signup/
│   │   │   └── [[...rest]]/        ← tela de cadastro
│   │   ├── onboarding/
│   │   │   └── +page.svelte        ← escolha de plano pós-cadastro
│   │   ├── convite/
│   │   │   └── [id]/               ← aceite de convite de equipe
│   │   └── dashboard/
│   │       ├── +layout.svelte      ← layout do app (Sidebar + ToastContainer)
│   │       ├── +layout.server.ts   ← verifica sessão, redireciona se não logado
│   │       ├── +page.svelte        ← Dashboard principal
│   │       ├── profissionais/      ← CRUD de profissionais
│   │       ├── visitas/            ← histórico de visitas + gravação IA
│   │       ├── agenda/             ← calendário + sugestões automáticas
│   │       ├── pipeline/           ← kanban + analytics
│   │       ├── especialidades/     ← cadastro de especialidades
│   │       ├── materiais/          ← materiais e amostras
│   │       ├── notificacoes/       ← histórico de notificações
│   │       ├── equipe/             ← gestão de membros (OWNER only)
│   │       ├── gestor/             ← dashboard consolidado (OWNER only)
│   │       ├── relatorios/         ← exportação CSV
│   │       └── perfil/             ← perfil do usuário
│   └── lib/
│       ├── api.ts                  ← apiFetch autenticado com interceptações
│       ├── types.ts                ← interfaces TypeScript do domínio
│       ├── stores/
│       │   └── toast.svelte.ts     ← store de toasts (Svelte 5 Runes)
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.svelte
│       │   │   └── SinoNotificacoes.svelte
│       │   ├── dashboard/
│       │   │   ├── CardResumo.svelte
│       │   │   ├── PainelAlertas.svelte
│       │   │   ├── ListaProximasVisitas.svelte
│       │   │   ├── TourPrimeiroAcesso.svelte
│       │   │   └── WidgetTranscricoes.svelte
│       │   ├── notificacoes/
│       │   │   └── PainelNotificacoes.svelte
│       │   └── ui/
│       │       ├── Button.svelte
│       │       ├── EmptyState.svelte
│       │       ├── ModalConfirmacao.svelte
│       │       ├── ModalGravacao.svelte
│       │       ├── ProgressBar.svelte
│       │       ├── Skeleton.svelte
│       │       ├── StatusVisitaBadge.svelte
│       │       ├── ToastContainer.svelte
│       │       └── VisitaSheet.svelte
└── static/                         ← assets estáticos (favicon, imagens)
```

---

## Regras Obrigatórias — Svelte 5 Runes

### ✅ Usar sempre

```svelte
<script lang="ts">
  // Estado reativo
  let count = $state(0)
  let dobro = $derived(count * 2)

  // Efeitos colaterais
  $effect(() => {
    console.log('count mudou:', count)
    return () => console.log('cleanup')
  })

  // Props de componente
  const { titulo, onclose } = $props<{
    titulo: string
    onclose: () => void
  }>()
</script>

<!-- Ícones dinâmicos em {#each} -->
{#each itens as item}
  {@const Icon = item.icon}
  <Icon class="w-4 h-4" />
{/each}

<!-- Layout com children -->
{@render children()}
```

### ❌ Nunca usar

```svelte
<!-- Stores clássicas para estado local -->
import { writable } from 'svelte/store'
let count = writable(0)  ← PROIBIDO

<!-- svelte:component -->
<svelte:component this={Icon} />  ← PROIBIDO

<!-- slot (legado) -->
<slot />  ← PROIBIDO — usar {@render children()}

<!-- Reactive statements legados -->
$: dobro = count * 2  ← PROIBIDO — usar $derived
```

---

## Variáveis de Ambiente

```env
# apps/web/.env
PUBLIC_API_URL=http://localhost:3002
PUBLIC_LANDING_URL=http://localhost:4321
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
PUBLIC_CLERK_SIGN_IN_URL=/login
PUBLIC_CLERK_SIGN_UP_URL=/signup
PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Nunca expor no frontend:
# CLERK_SECRET_KEY → usar somente em hooks.server.ts
```

> **Regra crítica:** variáveis públicas acessadas via `$env/static/public` — **nunca** via `import.meta.env` ou `process.env`.

```typescript
// ✅ Correto
import { PUBLIC_API_URL } from "$env/static/public";

// ❌ Errado
const url = import.meta.env.PUBLIC_API_URL;
```

---

## Autenticação — Fluxo Clerk

```
1. hooks.server.ts → verifica JWT do Clerk em cada request SSR
2. Injeta em event.locals: { userId, sessionToken, userName, userEmail }
3. +layout.server.ts do dashboard → redireciona para landing se não logado
4. Componentes acessam sessionToken via data prop do layout
5. apiFetch() envia Bearer token em todas as requisições
```

```typescript
// hooks.server.ts — padrão de injeção
export const handle: Handle = async ({ event, resolve }) => {
  const { userId, sessionId, getToken } = await auth(event);
  event.locals.userId = userId ?? null;
  event.locals.sessionToken = sessionId ? await getToken() : null;
  return resolve(event);
};
```

---

## Padrão de Fetch — apiFetch

```typescript
// lib/api.ts
import { PUBLIC_API_URL } from "$env/static/public";

export async function apiFetch(
  path: string,
  token: string | null,
  options: RequestInit = {},
): Promise<Response>;

// Comportamentos automáticos:
// - Injeta Authorization: Bearer {token}
// - 401 → redireciona para /login
// - 403 ORGANIZATION_NOT_FOUND → redireciona para /onboarding
```

```svelte
<!-- Uso nos componentes -->
<script lang="ts">
  import { apiFetch } from '$lib/api'
  const { data } = $props()

  async function carregarDados() {
    const res = await apiFetch('/profissionais', data.sessionToken)
    if (res.ok) profissionais = await res.json()
  }
</script>
```

---

## Design System

Paleta via CSS Variables (definidas em `app.css`):

| Variável  | Valor             | Uso                            |
| --------- | ----------------- | ------------------------------ |
| `#f8f9fa` | Cinza muito claro | Fundo da aplicação             |
| `#ffffff` | Branco            | Cards e superfícies            |
| `#2563eb` | Azul              | Botões primários, itens ativos |
| `#eff6ff` | Azul claro        | Fundo de item ativo            |
| `#7c3aed` | Roxo              | Elementos de IA e voz          |
| `#111827` | Quase preto       | Texto principal                |
| `#6b7280` | Cinza             | Texto secundário               |
| `#e5e7eb` | Cinza claro       | Bordas                         |

**Regras:**

- Fundo da app: sempre `#f8f9fa` — nunca branco puro
- Botão primário: `style="background-color: #2563eb; border-radius: 8px;"`
- SheetContent: sempre `style="background-color: #ffffff;"` explícito
- Zero hex hardcoded em classes Tailwind — usar `style=""` para cores do design system

Referência completa: `.kilocode/skills/medivisitas-design/SKILL.md`

---

## Toasts

```typescript
import { toast } from "$lib/stores/toast.svelte";

toast.sucesso("Profissional cadastrado.");
toast.erro("Erro ao salvar. Tente novamente.");
toast.info("3 notificações marcadas como lidas.");
toast.aviso("Trial expira em 2 dias.");
```

---

## Animações e Transições

```svelte
<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
</script>

<!-- Padrão para modais e sheets -->
<div transition:fly={{ y: 8, duration: 200, easing: cubicOut }}>

<!-- Padrão para overlays -->
<div transition:fade={{ duration: 150 }}>
```

---

## Controle de Acesso por Role

```svelte
<!-- Sidebar — itens visíveis só para OWNER -->
{#if data.role === 'OWNER'}
  <a href="/dashboard/equipe">Equipe</a>
  <a href="/dashboard/gestor">Gestor</a>
{/if}

<!-- +page.server.ts — proteger rota para OWNER -->
export const load = async ({ locals, fetch }) => {
  if (locals.role !== 'OWNER') throw redirect(302, '/dashboard')
  // ...
}
```

---

## Erros Comuns e Soluções

| Erro                          | Causa                      | Solução                                           |
| ----------------------------- | -------------------------- | ------------------------------------------------- |
| `PUBLIC_API_URL is undefined` | Usando `import.meta.env`   | Trocar para `$env/static/public`                  |
| `Failed to fetch`             | API não está rodando       | Subir a API: `pnpm --filter @medivisitas/api dev` |
| `slot` deprecated warning     | Usando `<slot />`          | Trocar para `{@render children()}`                |
| Tour aparece sempre           | `tour-concluido` não salvo | Verificar `PATCH /onboarding/tour-concluido`      |
| Dados vazios após onboarding  | Token Clerk desatualizado  | Usar `window.location.href` (não `goto`)          |
| SheetContent transparente     | Background não declarado   | Adicionar `style="background-color: #ffffff;"`    |

---

## Histórico de Mudanças Importantes

| Data       | Mudança                                                       |
| ---------- | ------------------------------------------------------------- |
| 2026-04-01 | Migração de Next.js 14 → SvelteKit 2 + Svelte 5 + Tailwind v4 |
| 2026-04-01 | `svelte:component` → `{@const Icon}` em `{#each}`             |
| 2026-04-01 | `<slot />` → `{@render children()}` em layouts                |
| 2026-04-01 | `NEXT_PUBLIC_` → `PUBLIC_` nas env vars                       |
| 2026-04-06 | `import.meta.env` → `$env/static/public`                      |
| 2026-04-06 | Stores clássicas → Svelte 5 Runes (`$state`, `$derived`)      |
| 2026-04-29 | Toast store migrado para `.svelte.ts` com `$state`            |
