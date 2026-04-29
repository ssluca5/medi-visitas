# Fase Melhorias — UX & Polimento

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack: **SvelteKit 2 + Svelte 5 Runes + Tailwind CSS v4**
> Pré-requisito: Todas as fases anteriores concluídas
> Esta fase não cria novas funcionalidades de negócio — melhora a experiência existente

---

## Objetivo

Elevar a qualidade percebida do produto para nível comercial:
tela de login premium, perfil do usuário, correção do bug de primeiro acesso,
tour interativo, tratamento de erros, empty states, toasts, confirmações,
loading states e página 404 personalizada.

---

## Itens a Implementar

| #   | Item                                            | Tipo         | Complexidade |
| --- | ----------------------------------------------- | ------------ | ------------ |
| 1   | Tela de login premium                           | Nova tela    | Média        |
| 2   | Página de perfil do usuário                     | Nova tela    | Média        |
| 3   | Bug: Failed to fetch no primeiro acesso         | Correção     | Alta         |
| 4   | Tour de primeiro acesso (onboarding interativo) | Nova feature | Alta         |
| 5   | Telas de erro amigáveis                         | Nova tela    | Baixa        |
| 6   | Empty states em todas as listagens              | Componente   | Média        |
| 7   | Toast/Snackbar de feedback de ações             | Componente   | Média        |
| 8   | Modal de confirmação para ações destrutivas     | Componente   | Baixa        |
| 9   | Indicador de carregamento global                | Componente   | Baixa        |
| 10  | Página 404 personalizada                        | Nova tela    | Baixa        |

---

## ITEM 1 — Tela de Login Premium

### Problema atual

A tela de login usa o componente padrão do Clerk sem customização,
sem identidade visual do MediVisitas e sem layout premium.

### Solução

**Arquivo:** `apps/web/src/routes/login/[[...rest]]/+page.svelte`

Layout dividido 50/50:

- **Esquerda:** painel visual com identidade do produto
- **Direita:** formulário do Clerk customizado

```svelte
<script lang="ts">
  import { SignIn } from '@clerk/sveltekit'
</script>

<div class="min-h-screen flex">

  <!-- Painel esquerdo — identidade visual -->
  <div class="hidden lg:flex w-1/2 flex-col justify-between p-12"
    style="background-color: #111827;">

    <!-- Logo -->
    <div class="flex items-center gap-2">
      <span class="text-xl font-bold text-white">MediVisitas</span>
      <span class="w-1.5 h-1.5 rounded-full" style="background-color: #2563eb;"></span>
    </div>

    <!-- Citação central -->
    <div>
      <p class="text-3xl font-light leading-relaxed"
        style="color: rgba(255,255,255,0.9);">
        "A agenda que organiza
        sua carteira enquanto
        você visita médicos."
      </p>
      <div class="mt-8 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-semibold text-white"
          style="background-color: #2563eb;">JF</div>
        <div>
          <p class="text-sm font-medium text-white">Jamille Fritz</p>
          <p class="text-xs" style="color: rgba(255,255,255,0.5);">
            Propagandista · Natudermefarma
          </p>
        </div>
      </div>
    </div>

    <!-- Métricas no rodapé -->
    <div class="grid grid-cols-3 gap-6 pt-8 border-t"
      style="border-color: rgba(255,255,255,0.1);">
      {#each [
        { valor: '200+', label: 'Propagandistas ativos' },
        { valor: '4.9', label: 'Avaliação média' },
        { valor: '68%', label: 'Menos tempo em relatórios' },
      ] as m}
        <div>
          <p class="text-2xl font-bold text-white">{m.valor}</p>
          <p class="text-xs mt-1" style="color: rgba(255,255,255,0.5);">{m.label}</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- Painel direito — formulário Clerk -->
  <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8"
    style="background-color: #f8f9fa;">

    <!-- Logo mobile (só aparece em telas pequenas) -->
    <div class="lg:hidden flex items-center gap-2 mb-8">
      <span class="text-xl font-bold" style="color: #111827;">MediVisitas</span>
      <span class="w-1.5 h-1.5 rounded-full" style="background-color: #2563eb;"></span>
    </div>

    <!-- Componente Clerk customizado -->
    <SignIn
      appearance={{
        variables: {
          colorPrimary: '#2563eb',
          colorBackground: '#ffffff',
          colorText: '#111827',
          colorTextSecondary: '#6b7280',
          colorInputBackground: '#ffffff',
          colorInputText: '#111827',
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        },
        elements: {
          rootBox: 'w-full max-w-sm',
          card: 'shadow-none border border-gray-200 rounded-2xl',
          headerTitle: 'text-xl font-semibold text-gray-900',
          headerSubtitle: 'text-sm text-gray-500',
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-11',
          formFieldInput: 'border-gray-200 rounded-xl h-10 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
          footerActionLink: 'text-blue-600 font-medium hover:text-blue-700',
          identityPreviewText: 'text-gray-700',
          formFieldLabel: 'text-sm font-medium text-gray-700',
        }
      }}
    />

    <!-- Link voltar para landing -->
    <a href={import.meta.env.PUBLIC_LANDING_URL}
      class="mt-6 text-sm transition-colors"
      style="color: #9ca3af;"
      onmouseenter={(e) => e.target.style.color = '#111827'}
      onmouseleave={(e) => e.target.style.color = '#9ca3af'}>
      ← Voltar para o site
    </a>
  </div>
</div>
```

**Funcionalidades incluídas automaticamente pelo Clerk:**

- Login com email/senha
- Login com Google (se configurado)
- "Esqueci minha senha" com envio de email
- Verificação de email
- Proteção contra brute force

---

## ITEM 2 — Página de Perfil do Usuário

### Problema atual

Não existe página de perfil — o usuário não consegue ver nem alterar seus dados.

### Estrutura

**Arquivo:** `apps/web/src/routes/dashboard/perfil/+page.svelte`
**Server load:** `apps/web/src/routes/dashboard/perfil/+page.server.ts`
**Adicionar na Sidebar:** link "Perfil" com ícone User no footer

### Seções da página

```
/dashboard/perfil

┌─────────────────────────────────────────────────────┐
│  Perfil                                              │
│  Gerencie suas informações e assinatura             │
├──────────────────┬──────────────────────────────────┤
│  DADOS PESSOAIS  │  PLANO E ASSINATURA               │
│                  │                                   │
│  Avatar          │  Plano: Individual                │
│  Nome completo   │  Status: Trial ativo              │
│  E-mail          │  Expira em: 5 dias                │
│  (via Clerk)     │  [Assinar agora]                  │
│                  │  [Gerenciar assinatura]           │
├──────────────────┼──────────────────────────────────┤
│  SEGURANÇA       │  ORGANIZAÇÃO                      │
│                  │                                   │
│  Trocar senha    │  Nome da empresa                  │
│  Sessões ativas  │  Membros (se OWNER)               │
│  [via Clerk]     │  [Convidar membro]                │
├──────────────────┴──────────────────────────────────┤
│  ZONA DE PERIGO                                     │
│  [Cancelar assinatura]  [Excluir conta]             │
└─────────────────────────────────────────────────────┘
```

### Implementação

```svelte
<!-- apps/web/src/routes/dashboard/perfil/+page.svelte -->
<script lang="ts">
  import { UserProfile } from '@clerk/sveltekit'
  import { PUBLIC_API_URL } from '$env/static/public'

  const { data } = $props()

  let abaAtiva = $state<'dados' | 'plano' | 'seguranca' | 'organizacao'>('dados')
</script>

<!-- Header -->
<div class="p-6 border-b" style="border-color: #e5e7eb;">
  <h1 class="text-2xl font-semibold" style="color: #111827;">Meu Perfil</h1>
  <p class="text-sm mt-0.5" style="color: #6b7280;">
    Gerencie suas informações e assinatura
  </p>
</div>

<!-- Abas -->
<div class="flex border-b px-6" style="border-color: #e5e7eb;">
  {#each [
    { id: 'dados',       label: 'Dados Pessoais' },
    { id: 'plano',       label: 'Plano e Assinatura' },
    { id: 'seguranca',   label: 'Segurança' },
    { id: 'organizacao', label: 'Organização' },
  ] as aba}
    {@const isAtiva = abaAtiva === aba.id}
    <button
      class="border-b-2 pb-3 pt-4 text-sm font-medium mr-6 transition-colors"
      style={isAtiva
        ? 'border-color: #2563eb; color: #2563eb;'
        : 'border-color: transparent; color: #6b7280;'}
      onclick={() => abaAtiva = aba.id}
    >
      {aba.label}
    </button>
  {/each}
</div>

<!-- Conteúdo das abas -->
<div class="p-6 max-w-2xl">

  <!-- ABA: Dados Pessoais (via Clerk UserProfile) -->
  {#if abaAtiva === 'dados'}
    <UserProfile
      appearance={{
        variables: {
          colorPrimary: '#2563eb',
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif',
        },
        elements: {
          rootBox: 'w-full',
          card: 'shadow-none border-0 p-0',
          navbar: 'hidden',
          pageScrollBox: 'p-0',
        }
      }}
    />

  <!-- ABA: Plano e Assinatura -->
  {:else if abaAtiva === 'plano'}
    <!-- Card de status do plano -->
    <div class="rounded-xl border p-6 mb-4"
      style="background-color: #ffffff; border-color: #e5e7eb;">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider"
            style="color: #9ca3af;">PLANO ATUAL</p>
          <p class="text-xl font-bold mt-1" style="color: #111827;">
            {data.plano === 'INDIVIDUAL' ? 'Individual' : 'Empresa'}
          </p>
          <p class="text-sm mt-1" style="color: #6b7280;">
            {data.plano === 'INDIVIDUAL' ? 'R$ 79/mês' : 'R$ 49/mês por usuário'}
          </p>
        </div>
        <!-- Badge de status -->
        {#if data.statusOrg === 'TRIAL_ATIVO'}
          <span class="px-3 py-1 rounded-full text-xs font-semibold"
            style="background-color: #fef3c7; color: #92400e;">
            Trial — {data.diasRestantes}d restantes
          </span>
        {:else if data.statusOrg === 'ATIVO'}
          <span class="px-3 py-1 rounded-full text-xs font-semibold"
            style="background-color: #d1fae5; color: #065f46;">
            Ativo
          </span>
        {:else}
          <span class="px-3 py-1 rounded-full text-xs font-semibold"
            style="background-color: #fee2e2; color: #991b1b;">
            Suspenso
          </span>
        {/if}
      </div>

      <!-- Próxima cobrança -->
      {#if data.proximaCobranca}
        <p class="text-xs mt-4 pt-4 border-t" style="color: #9ca3af; border-color: #f3f4f6;">
          Próxima cobrança em {data.proximaCobranca}
        </p>
      {/if}

      <!-- Ações -->
      <div class="flex gap-3 mt-4">
        {#if data.statusOrg === 'TRIAL_ATIVO'}
          <a href="/planos"
            class="h-9 px-4 rounded-lg text-sm font-medium text-white flex items-center"
            style="background-color: #2563eb;">
            Assinar agora
          </a>
        {/if}
        {#if data.stripeCustomerId}
          <button
            onclick={abrirPortalStripe}
            class="h-9 px-4 rounded-lg border text-sm font-medium"
            style="border-color: #e5e7eb; color: #374151;">
            Gerenciar assinatura
          </button>
        {/if}
      </div>
    </div>

    <!-- Histórico de uso -->
    <div class="rounded-xl border p-6"
      style="background-color: #ffffff; border-color: #e5e7eb;">
      <p class="text-sm font-semibold mb-4" style="color: #111827;">Uso do período</p>
      <div class="space-y-3">
        {#each [
          { label: 'Profissionais cadastrados', valor: data.totalProfissionais, limite: 'Ilimitado' },
          { label: 'Visitas registradas', valor: data.totalVisitas, limite: 'Ilimitado' },
          { label: 'Transcrições por IA', valor: data.totalTranscricoes, limite: data.limiteTranscricoes },
        ] as uso}
          <div class="flex items-center justify-between">
            <span class="text-sm" style="color: #6b7280;">{uso.label}</span>
            <span class="text-sm font-medium" style="color: #111827;">
              {uso.valor} / {uso.limite}
            </span>
          </div>
        {/each}
      </div>
    </div>

  <!-- ABA: Segurança (via Clerk) -->
  {:else if abaAtiva === 'seguranca'}
    <UserProfile
      appearance={{ elements: { rootBox: 'w-full', card: 'shadow-none border-0 p-0', navbar: 'hidden' } }}
    />

  <!-- ABA: Organização -->
  {:else if abaAtiva === 'organizacao'}
    <!-- Nome da organização -->
    <div class="rounded-xl border p-6 mb-4"
      style="background-color: #ffffff; border-color: #e5e7eb;">
      <p class="text-sm font-semibold mb-4" style="color: #111827;">Dados da organização</p>
      <div class="space-y-1.5">
        <label class="text-sm font-medium" style="color: #374151;">Nome</label>
        <input
          value={data.organizacao.nome}
          class="w-full h-9 px-3 text-sm rounded-lg border"
          style="border-color: #e5e7eb; color: #111827;" />
      </div>
      <button class="mt-4 h-9 px-4 rounded-lg text-sm font-medium text-white"
        style="background-color: #2563eb;">
        Salvar
      </button>
    </div>

    <!-- Membros (somente OWNER) -->
    {#if data.role === 'OWNER'}
      <div class="rounded-xl border p-6"
        style="background-color: #ffffff; border-color: #e5e7eb;">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-semibold" style="color: #111827;">
            Membros ({data.membros.length})
          </p>
          <button class="h-8 px-3 rounded-lg text-xs font-medium text-white"
            style="background-color: #2563eb;">
            + Convidar
          </button>
        </div>
        {#each data.membros as membro}
          <div class="flex items-center justify-between py-3 border-t"
            style="border-color: #f3f4f6;">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center
                          text-xs font-semibold text-white"
                style="background-color: #2563eb;">
                {membro.nome.charAt(0)}
              </div>
              <div>
                <p class="text-sm font-medium" style="color: #111827;">{membro.nome}</p>
                <p class="text-xs" style="color: #9ca3af;">{membro.email}</p>
              </div>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full"
              style={membro.role === 'OWNER'
                ? 'background-color: #eff6ff; color: #1e40af;'
                : 'background-color: #f3f4f6; color: #6b7280;'}>
              {membro.role === 'OWNER' ? 'Gestor' : 'Membro'}
            </span>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Zona de perigo -->
    <div class="rounded-xl border mt-4 p-6"
      style="background-color: #ffffff; border-color: #fee2e2;">
      <p class="text-sm font-semibold mb-1" style="color: #dc2626;">Zona de perigo</p>
      <p class="text-xs mb-4" style="color: #9ca3af;">
        Ações irreversíveis. Prossiga com cuidado.
      </p>
      <div class="flex gap-3">
        <button class="h-9 px-4 rounded-lg border text-sm font-medium"
          style="border-color: #fca5a5; color: #dc2626;">
          Cancelar assinatura
        </button>
        <button class="h-9 px-4 rounded-lg border text-sm font-medium"
          style="border-color: #fca5a5; color: #dc2626;">
          Excluir conta
        </button>
      </div>
    </div>
  {/if}
</div>
```

### Link na Sidebar

```svelte
<!-- Adicionar no footer da Sidebar, acima do botão Sair -->
<a href="/dashboard/perfil"
  class="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors w-full"
  style={$page.url.pathname === '/dashboard/perfil'
    ? 'background-color: #eff6ff; color: #2563eb;'
    : 'color: #6b7280;'}>
  <User class="w-4 h-4" />
  Meu perfil
</a>
```

---

## ITEM 3 — Correção: Failed to Fetch no Primeiro Acesso

### Causa raiz

Quando o usuário completa o onboarding, o `organizationId` é criado na API mas
ainda **não está disponível no token do Clerk** — o token é gerado antes do
onboarding e não reflete a nova organização até a próxima renovação.
As queries da API recebem `organizationId: undefined` e retornam erro.

### Solução

**Estratégia:** forçar refresh do token Clerk após o onboarding + verificação
no hook `resolveTenant` para retornar resposta clara em vez de crash.

**Arquivo 1:** `apps/api/src/hooks/tenant.ts`

```typescript
// Melhorar a mensagem de erro quando organizationId não encontrado
export async function resolveTenant(request, reply) {
  // ... código existente ...

  if (!membro) {
    // Retornar 403 com código específico para o frontend tratar
    return reply.status(403).send({
      error: "Organização não encontrada",
      code: "ORGANIZATION_NOT_FOUND",
      action: "complete_onboarding", // instrui o frontend
    });
  }
}
```

**Arquivo 2:** `apps/web/src/lib/api.ts`

```typescript
// Interceptar erro 403 com code ORGANIZATION_NOT_FOUND
export async function apiFetch(path: string, options = {}) {
  const token = await getToken();
  const res = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 403) {
    const body = await res.json();
    if (body.code === "ORGANIZATION_NOT_FOUND") {
      // Redirecionar para onboarding em vez de mostrar erro
      window.location.href = "/onboarding";
      return;
    }
  }

  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}
```

**Arquivo 3:** `apps/web/src/routes/onboarding/+page.svelte`

```svelte
<!-- Após concluir o onboarding, forçar refresh do token antes de redirecionar -->
<script lang="ts">
  import { useClerk } from '@clerk/sveltekit'

  const clerk = useClerk()

  async function concluirOnboarding() {
    // Chamar API para criar organização
    await apiFetch('/onboarding/individual', { method: 'POST' })

    // Forçar refresh da sessão Clerk para incluir o novo organizationId
    await clerk.session?.reload()

    // Aguardar um ciclo para garantir propagação
    await new Promise(resolve => setTimeout(resolve, 500))

    // Redirecionar para dashboard
    goto('/dashboard')
  }
</script>
```

---

## ITEM 4 — Tour de Primeiro Acesso

### Comportamento

- Aparece **somente na primeira visita ao dashboard**
- Registrado no banco — nunca repete mesmo que o usuário mude de dispositivo
- 4 passos guiados com highlight dos elementos reais
- Pode ser dispensado mas fica disponível em Perfil → "Rever tutorial"

### Modelo de dados

```prisma
// Adicionar em Organization
tourConcluidoEm DateTime?   // null = não fez o tour
```

### Componente

```svelte
<!-- apps/web/src/lib/components/dashboard/TourPrimeiroAcesso.svelte -->
<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  const { onConcluir } = $props<{ onConcluir: () => void }>()

  let passoAtual = $state(0)

  const passos = [
    {
      titulo: 'Bem-vindo ao MediVisitas! 👋',
      descricao: 'Vamos dar uma volta rápida para você aproveitar ao máximo. Leva menos de 2 minutos.',
      destaque: null,  // nenhum elemento destacado no passo 0
      acao: 'Começar tour',
    },
    {
      titulo: 'Cadastre seus profissionais',
      descricao: 'Comece adicionando os médicos, farmacêuticos e dentistas da sua carteira. Clique em "+ Novo Profissional" para começar.',
      destaque: '[data-tour="btn-novo-profissional"]',
      acao: 'Entendi',
    },
    {
      titulo: 'A agenda sugere quem visitar',
      descricao: 'Após cadastrar profissionais, a agenda inteligente mostra automaticamente quem precisa de atenção primeiro.',
      destaque: '[data-tour="nav-agenda"]',
      acao: 'Próximo',
    },
    {
      titulo: 'Registre visitas por voz',
      descricao: 'Após uma visita, clique no microfone roxo e fale o resumo. A IA preenche tudo automaticamente.',
      destaque: '[data-tour="btn-gravacao"]',
      acao: 'Próximo',
    },
    {
      titulo: 'Acompanhe seu pipeline',
      descricao: 'No Pipeline você vê todos os profissionais organizados por estágio de relacionamento — de Prospectado a Fidelizado.',
      destaque: '[data-tour="nav-pipeline"]',
      acao: 'Concluir tour',
    },
  ]

  let passo = $derived(passos[passoAtual])
  let isUltimo = $derived(passoAtual === passos.length - 1)
  let progresso = $derived(((passoAtual) / (passos.length - 1)) * 100)

  function avancar() {
    if (isUltimo) {
      concluir()
    } else {
      passoAtual++
      destacarElemento()
    }
  }

  function destacarElemento() {
    // Remover highlight anterior
    document.querySelectorAll('[data-tour-highlighted]').forEach(el => {
      el.removeAttribute('data-tour-highlighted')
      el.style.removeProperty('position')
      el.style.removeProperty('z-index')
    })

    // Aplicar no elemento atual
    if (passo.destaque) {
      const el = document.querySelector(passo.destaque)
      if (el) {
        el.setAttribute('data-tour-highlighted', 'true')
        el.style.position = 'relative'
        el.style.zIndex = '1001'
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  async function concluir() {
    // Limpar highlights
    document.querySelectorAll('[data-tour-highlighted]').forEach(el => {
      el.removeAttribute('data-tour-highlighted')
      el.style.removeProperty('position')
      el.style.removeProperty('z-index')
    })

    // Salvar na API que tour foi concluído
    await fetch(`${PUBLIC_API_URL}/onboarding/tour-concluido`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${await getToken()}` }
    })

    onConcluir()
  }
</script>

<!-- Overlay escurecido com buraco no elemento destacado -->
{#if passoAtual > 0}
  <div
    class="fixed inset-0 z-[1000] pointer-events-none"
    style="background: rgba(0,0,0,0.5);"
    transition:fade={{ duration: 300 }}
  />
{/if}

<!-- Card do tour -->
<div
  class="fixed z-[1002] w-80 rounded-2xl p-6 shadow-xl"
  style="
    background-color: #ffffff;
    bottom: 32px;
    right: 32px;
  "
  transition:fly={{ y: 20, duration: 400, easing: cubicOut }}
>
  <!-- Barra de progresso -->
  <div class="w-full h-1 rounded-full mb-5" style="background-color: #e5e7eb;">
    <div
      class="h-1 rounded-full transition-all duration-500"
      style="background-color: #2563eb; width: {progresso}%;"
    />
  </div>

  <!-- Número do passo -->
  <p class="text-xs font-semibold uppercase tracking-wider mb-2"
    style="color: #9ca3af;">
    Passo {passoAtual + 1} de {passos.length}
  </p>

  <!-- Título e descrição -->
  <h3 class="text-base font-semibold mb-2" style="color: #111827;">
    {passo.titulo}
  </h3>
  <p class="text-sm leading-relaxed" style="color: #6b7280;">
    {passo.descricao}
  </p>

  <!-- Ações -->
  <div class="flex items-center justify-between mt-5">
    <button
      onclick={concluir}
      class="text-xs transition-colors"
      style="color: #9ca3af;">
      Pular tour
    </button>
    <button
      onclick={avancar}
      class="h-9 px-4 rounded-lg text-sm font-medium text-white"
      style="background-color: #2563eb;">
      {passo.acao} →
    </button>
  </div>
</div>

<!-- CSS para o highlight do elemento -->
<style>
  :global([data-tour-highlighted]) {
    outline: 3px solid #2563eb !important;
    outline-offset: 4px !important;
    border-radius: 8px !important;
  }
</style>
```

### Integração no dashboard

```svelte
<!-- apps/web/src/routes/dashboard/+page.svelte -->
<script lang="ts">
  const { data } = $props()
  let mostrarTour = $state(!data.tourConcluido)
</script>

{#if mostrarTour}
  <TourPrimeiroAcesso onConcluir={() => mostrarTour = false} />
{/if}
```

### Atributos data-tour nos elementos

Adicionar `data-tour="btn-novo-profissional"` no botão de novo profissional,
`data-tour="nav-agenda"` no link da agenda na sidebar, etc.

---

## ITEM 5 — Telas de Erro Amigáveis

**Arquivo:** `apps/web/src/routes/+error.svelte`

```svelte
<script lang="ts">
  import { page } from '$app/stores'
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-6"
  style="background-color: #f8f9fa;">

  <!-- Código do erro em grande -->
  <p class="text-8xl font-black" style="color: #e5e7eb;">
    {$page.status}
  </p>

  <h1 class="text-2xl font-semibold mt-4" style="color: #111827;">
    {#if $page.status === 404}
      Página não encontrada
    {:else if $page.status === 403}
      Sem permissão de acesso
    {:else if $page.status === 500}
      Erro no servidor
    {:else}
      Algo deu errado
    {/if}
  </h1>

  <p class="text-sm mt-2 text-center max-w-sm" style="color: #6b7280;">
    {#if $page.status === 404}
      A página que você procura não existe ou foi movida.
    {:else if $page.status === 403}
      Você não tem permissão para acessar este recurso.
    {:else}
      Tente novamente. Se o problema persistir, entre em contato com o suporte.
    {/if}
  </p>

  <div class="flex gap-3 mt-8">
    <a href="/dashboard"
      class="h-10 px-5 rounded-lg text-sm font-medium text-white"
      style="background-color: #2563eb;">
      Ir para o dashboard
    </a>
    <button
      onclick={() => window.location.reload()}
      class="h-10 px-5 rounded-lg border text-sm font-medium"
      style="border-color: #e5e7eb; color: #374151;">
      Tentar novamente
    </button>
  </div>
</div>
```

---

## ITEM 6 — Empty States

**Arquivo:** `apps/web/src/lib/components/ui/EmptyState.svelte`

```svelte
<script lang="ts">
  const {
    titulo,
    descricao,
    acaoLabel,
    acaoOnclick,
    icone = '📋',
  } = $props<{
    titulo: string
    descricao: string
    acaoLabel?: string
    acaoOnclick?: () => void
    icone?: string
  }>()
</script>

<div class="flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl border"
  style="background-color: #ffffff; border-color: #e5e7eb;">

  <!-- Ícone decorativo em CSS -->
  <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
    style="background-color: #f8f9fa;">
    {icone}
  </div>

  <h3 class="text-base font-semibold" style="color: #111827;">{titulo}</h3>
  <p class="text-sm mt-1 max-w-xs" style="color: #9ca3af;">{descricao}</p>

  {#if acaoLabel && acaoOnclick}
    <button
      onclick={acaoOnclick}
      class="mt-6 h-9 px-4 rounded-lg text-sm font-medium text-white"
      style="background-color: #2563eb;">
      {acaoLabel}
    </button>
  {/if}
</div>
```

**Usar em todas as listagens:**

```svelte
<!-- Exemplo em profissionais/+page.svelte -->
{#if profissionais.length === 0}
  <EmptyState
    icone="👨‍⚕️"
    titulo="Nenhum profissional cadastrado"
    descricao="Adicione médicos, farmacêuticos e dentistas da sua carteira para começar."
    acaoLabel="+ Cadastrar primeiro profissional"
    acaoOnclick={() => sheetAberta = true}
  />
{/if}
```

**Textos por tela:**

| Tela           | Ícone | Título                      | Descrição                                                              |
| -------------- | ----- | --------------------------- | ---------------------------------------------------------------------- |
| Profissionais  | 👨‍⚕️    | "Nenhum profissional ainda" | "Cadastre médicos, farmacêuticos e dentistas da sua carteira."         |
| Visitas        | 📋    | "Nenhuma visita registrada" | "Registre sua primeira visita para começar o histórico."               |
| Agenda         | 📅    | "Agenda vazia"              | "Cadastre profissionais para receber sugestões automáticas de visita." |
| Pipeline       | 📊    | "Pipeline vazio"            | "Adicione profissionais para acompanhar o funil de conversão."         |
| Notificações   | 🔔    | "Nenhuma notificação"       | "Você está em dia. Novas notificações aparecem aqui."                  |
| Especialidades | 🩺    | "Nenhuma especialidade"     | "Adicione especialidades para organizar sua carteira."                 |

---

## ITEM 7 — Toast / Snackbar de Feedback

**Arquivo:** `apps/web/src/lib/stores/toast.svelte.ts`

```typescript
// Store de toasts usando Svelte 5 runes pattern
type ToastTipo = "sucesso" | "erro" | "info" | "aviso";

interface Toast {
  id: string;
  tipo: ToastTipo;
  mensagem: string;
  duracao?: number;
}

let toasts = $state<Toast[]>([]);

export function adicionarToast(
  tipo: ToastTipo,
  mensagem: string,
  duracao = 4000,
) {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, tipo, mensagem, duracao }];
  setTimeout(() => removerToast(id), duracao);
}

export function removerToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
}

export { toasts };
```

**Componente container:**

```svelte
<!-- apps/web/src/lib/components/ui/ToastContainer.svelte -->
<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import { toasts, removerToast } from '$lib/stores/toast.svelte'

  const corMap = {
    sucesso: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46', icon: '✓' },
    erro:    { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', icon: '✕' },
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: 'ℹ' },
    aviso:   { bg: '#fef3c7', border: '#fde68a', text: '#92400e', icon: '⚠' },
  }
</script>

<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center">
  {#each toasts as toast (toast.id)}
    <div
      class="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-72 max-w-sm"
      style="
        background-color: {corMap[toast.tipo].bg};
        border-color: {corMap[toast.tipo].border};
      "
      transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
    >
      <span class="text-sm font-bold" style="color: {corMap[toast.tipo].text};">
        {corMap[toast.tipo].icon}
      </span>
      <p class="text-sm flex-1" style="color: {corMap[toast.tipo].text};">
        {toast.mensagem}
      </p>
      <button
        onclick={() => removerToast(toast.id)}
        class="text-xs opacity-60 hover:opacity-100 transition-opacity"
        style="color: {corMap[toast.tipo].text};">
        ✕
      </button>
    </div>
  {/each}
</div>
```

**Adicionar no layout principal:**

```svelte
<!-- apps/web/src/routes/dashboard/+layout.svelte -->
<ToastContainer />
```

**Usar em qualquer ação:**

```svelte
import { adicionarToast } from '$lib/stores/toast.svelte'

// Após salvar profissional:
adicionarToast('sucesso', 'Profissional cadastrado com sucesso.')

// Após erro:
adicionarToast('erro', 'Erro ao salvar. Tente novamente.')

// Após deletar:
adicionarToast('info', 'Profissional removido.')
```

---

## ITEM 8 — Modal de Confirmação para Ações Destrutivas

**Arquivo:** `apps/web/src/lib/components/ui/ModalConfirmacao.svelte`

```svelte
<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  const {
    aberto,
    titulo,
    descricao,
    labelConfirmar = 'Excluir',
    labelCancelar = 'Cancelar',
    onConfirmar,
    onCancelar,
  } = $props<{
    aberto: boolean
    titulo: string
    descricao: string
    labelConfirmar?: string
    labelCancelar?: string
    onConfirmar: () => void
    onCancelar: () => void
  }>()
</script>

{#if aberto}
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background-color: rgba(0,0,0,0.4);"
    transition:fade={{ duration: 200 }}
    onclick={onCancelar}
  >
    <!-- Modal -->
    <div
      class="w-full max-w-sm rounded-2xl p-6 shadow-xl"
      style="background-color: #ffffff;"
      transition:fly={{ y: 16, duration: 300, easing: cubicOut }}
      onclick|stopPropagation={() => {}}
    >
      <!-- Ícone destrutivo -->
      <div class="w-10 h-10 rounded-full flex items-center justify-center mb-4"
        style="background-color: #fee2e2;">
        <span style="color: #dc2626; font-size: 18px;">⚠</span>
      </div>

      <h3 class="text-base font-semibold" style="color: #111827;">{titulo}</h3>
      <p class="text-sm mt-2 leading-relaxed" style="color: #6b7280;">{descricao}</p>
      <p class="text-xs mt-3 font-medium" style="color: #dc2626;">
        Esta ação não pode ser desfeita.
      </p>

      <div class="flex gap-3 mt-6">
        <button
          onclick={onCancelar}
          class="flex-1 h-10 rounded-xl border text-sm font-medium"
          style="border-color: #e5e7eb; color: #374151;">
          {labelCancelar}
        </button>
        <button
          onclick={onConfirmar}
          class="flex-1 h-10 rounded-xl text-sm font-medium text-white"
          style="background-color: #dc2626; border-radius: 10px;">
          {labelConfirmar}
        </button>
      </div>
    </div>
  </div>
{/if}
```

---

## ITEM 9 — Indicador de Carregamento Global

**Arquivo:** `apps/web/src/lib/components/ui/ProgressBar.svelte`

```svelte
<script lang="ts">
  import { navigating } from '$app/stores'
  import { fade } from 'svelte/transition'

  // A barra aparece automaticamente em toda navegação SvelteKit
  let progresso = $state(0)
  let timer: ReturnType<typeof setTimeout>

  $effect(() => {
    if ($navigating) {
      progresso = 0
      // Simula progresso crescente
      const incrementar = () => {
        progresso = Math.min(progresso + Math.random() * 15, 85)
        timer = setTimeout(incrementar, 200)
      }
      incrementar()
    } else {
      clearTimeout(timer)
      progresso = 100
      // Esconde após completar
      setTimeout(() => { progresso = 0 }, 300)
    }
  })
</script>

{#if progresso > 0}
  <div
    class="fixed top-0 left-0 z-[9999] h-0.5 transition-all"
    style="
      width: {progresso}%;
      background-color: #2563eb;
      transition: width 200ms ease, opacity 300ms ease;
      opacity: {progresso === 100 ? 0 : 1};
    "
    transition:fade={{ duration: 200 }}
  />
{/if}
```

**Adicionar no layout raiz:**

```svelte
<!-- apps/web/src/routes/+layout.svelte -->
<ProgressBar />
```

**Skeleton screen para cards (usar em listagens enquanto carregam):**

```svelte
<!-- apps/web/src/lib/components/ui/Skeleton.svelte -->
<script lang="ts">
  const { linhas = 3 } = $props<{ linhas?: number }>()
</script>

<div class="animate-pulse space-y-3">
  {#each Array(linhas) as _, i}
    <div class="h-12 rounded-lg" style="background-color: #f3f4f6; width: {100 - i * 5}%;"/>
  {/each}
</div>
```

---

## ITEM 10 — Página 404 Personalizada

Já coberta pelo `+error.svelte` do Item 5.
Adicionalmente, criar redirect específico para rotas inválidas dentro do dashboard:

**Arquivo:** `apps/web/src/routes/dashboard/[...404]/+page.svelte`

```svelte
<script lang="ts">
  import { goto } from '$app/navigation'
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
  <p class="text-7xl font-black" style="color: #e5e7eb;">404</p>
  <h1 class="text-xl font-semibold mt-4" style="color: #111827;">
    Essa página não existe
  </h1>
  <p class="text-sm mt-2" style="color: #9ca3af;">
    Verifique o endereço ou volte para o dashboard.
  </p>
  <button
    onclick={() => goto('/dashboard')}
    class="mt-6 h-10 px-5 rounded-lg text-sm font-medium text-white"
    style="background-color: #2563eb;">
    Ir para o dashboard
  </button>
</div>
```

---

## Sequência de Implementação Recomendada

```
PRIORIDADE ALTA (impacto imediato):
1. Item 3 — Correção do bug de primeiro acesso (causa os erros que você viu)
2. Item 7 — Toasts (feedback de ações — faltam em todo o app)
3. Item 6 — Empty states (telas em branco são confusas)

PRIORIDADE MÉDIA:
4. Item 1 — Tela de login premium
5. Item 4 — Tour de primeiro acesso
6. Item 9 — Loading / barra de progresso

PRIORIDADE NORMAL:
7. Item 2 — Página de perfil
8. Item 8 — Modal de confirmação destrutiva
9. Item 5 — Telas de erro amigáveis
10. Item 10 — Página 404
```

---

## Checklist de Conclusão

```
[ ] Bug primeiro acesso corrigido — novo usuário entra e vê dados normalmente
[ ] Tour aparece somente no primeiro acesso e não repete
[ ] Tour pode ser revisto em Perfil → "Rever tutorial"
[ ] Tela de login com layout split e visual premium
[ ] Reset de senha funcionando pelo Clerk
[ ] Página de perfil com 4 abas funcionando
[ ] Link "Meu perfil" na sidebar
[ ] Empty states em: Profissionais, Visitas, Agenda, Pipeline, Notificações, Especialidades
[ ] Toasts de sucesso/erro em todas as ações de criar/editar/deletar
[ ] Modal de confirmação antes de excluir qualquer registro
[ ] Barra de progresso de navegação no topo
[ ] Skeleton screens nas listagens durante carregamento
[ ] Página de erro (500, 403, 404) com design do MediVisitas
[ ] Página 404 interna no dashboard
[ ] pnpm --filter @medivisitas/web build → sem erros
[ ] CLAUDE.md atualizado com esta fase de melhorias
```
