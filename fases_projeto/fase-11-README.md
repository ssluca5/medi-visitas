# Fase 11 — Landing Page (Astro)

> MediVisitas · CRM para propagandistas farmacêuticos
> Stack: **Astro 4 + Svelte 5 + Tailwind CSS v4**
> Domínio: `medivisitas.com` (landing) → `app.medivisitas.com` (app)

---

## Objetivo da Fase

Criar o site de apresentação do MediVisitas que servirá como porta de entrada
para o produto, com screenshots reais das funcionalidades, seção de planos e
CTA de cadastro integrado ao Clerk:

- Site estático de alta performance (Lighthouse 100)
- Screenshots e demos das funcionalidades principais
- Seção de planos com preços
- CTA "Começar trial gratuito" → cadastro via Clerk
- Design alinhado ao design system do app (mesmas cores e tipografia)
- SEO otimizado com meta tags, sitemap e schema.org
- Responsivo — mobile first

---

## Estrutura do Site

```
medivisitas.com/
├── /                    ← Home (hero + features + planos + CTA)
├── /funcionalidades     ← Detalhamento de cada módulo
├── /planos              ← Comparativo detalhado de planos
├── /sobre               ← Sobre o produto
└── /contato             ← Formulário de contato
```

---

## Tecnologia — Por que Astro

- **HTML estático** — carrega em < 1s, ideal para conversão
- **Svelte islands** — componentes interativos apenas onde necessário
- **Tailwind v4 nativo** — mesmo design system do app
- **Zero JS por padrão** — só envia JS para o client quando há interatividade
- **Deploy simples** — Vercel, Netlify ou Cloudflare Pages

---

## Estrutura de Pastas

```
apps/landing/                    ← novo workspace no monorepo
├── src/
│   ├── pages/
│   │   ├── index.astro          ← Home
│   │   ├── funcionalidades.astro
│   │   ├── planos.astro
│   │   └── contato.astro
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro     ← nav fixa
│   │   │   └── Footer.astro
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── Features.astro
│   │   │   ├── Screenshots.astro
│   │   │   ├── Planos.astro
│   │   │   ├── Depoimentos.astro
│   │   │   └── CTA.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       └── Badge.astro
│   ├── layouts/
│   │   └── Base.astro           ← html, head, meta tags
│   └── styles/
│       └── global.css           ← CSS variables (mesmas do app)
├── public/
│   ├── screenshots/             ← prints das telas do app
│   │   ├── dashboard.webp
│   │   ├── profissionais.webp
│   │   ├── agenda.webp
│   │   ├── pipeline.webp
│   │   └── gravacao-ia.webp
│   ├── favicon.ico
│   └── og-image.png             ← imagem para redes sociais
├── astro.config.mjs
├── package.json
└── tailwind.config.mjs
```

---

## Seções da Home

### 1. Header — navegação fixa

```
[MediVisitas logo]  Funcionalidades  Planos  Sobre    [Fazer login]  [Começar grátis →]
```

- Scroll suave entre seções
- "Fazer login" → `https://app.medivisitas.com/login`
- "Começar grátis" → `https://app.medivisitas.com/signup`

---

### 2. Hero

```
CRM para Propagandistas Farmacêuticos
que funciona do jeito que você trabalha.

Gerencie sua carteira de médicos, registre visitas por voz
com IA e nunca perca um follow-up importante.

[Começar trial de 7 dias →]    [Ver demonstração]

Sem cartão de crédito. 7 dias gratuitos.

[Screenshot do dashboard do app — imagem grande]
```

**Paleta do Hero:**

- Fundo: `#f8f9fa` (mesmo do app)
- Título: `#111827` font-bold text-5xl
- Subtítulo: `#6b7280` text-xl
- CTA primário: `#2563eb` (mesmo azul do app)
- CTA secundário: outline

---

### 3. Features — 6 funcionalidades principais

```
Por que propagandistas escolhem o MediVisitas

[Ícone] Agenda Inteligente        [Ícone] Pipeline Visual
Sugestões automáticas de quem     Funil Prospectado → Fidelizado
visitar baseadas em potencial     com histórico de cada transição
e tempo sem visita.               imutável.

[Ícone] Gravação por Voz + IA     [Ícone] Notificações Automáticas
Grave o resumo da visita em       Alertas de profissionais sem
áudio. A IA preenche os campos    visita, agendamentos atrasados
automaticamente.                  e lembretes diários.

[Ícone] Histórico Completo        [Ícone] Analytics
Linha do tempo unificada de       Métricas de conversão, visitas
visitas, mudanças de estágio e    por período e exportação CSV
agendamentos por profissional.    para relatórios externos.
```

---

### 4. Screenshots — galeria das telas

```
Veja o MediVisitas em ação

[Tab: Dashboard] [Tab: Profissionais] [Tab: Agenda] [Tab: Pipeline] [Tab: IA]

[Screenshot grande da aba selecionada]
[Descrição curta da funcionalidade]
```

Componente Svelte interativo (island) para trocar as tabs:

```svelte
<!-- apps/landing/src/components/sections/Screenshots.svelte -->
<script lang="ts">
  let abaAtiva = $state('dashboard')

  const abas = [
    { id: 'dashboard', label: 'Dashboard', src: '/screenshots/dashboard.webp',
      desc: 'Visão geral do dia com KPIs, alertas e próximas visitas.' },
    { id: 'profissionais', label: 'Profissionais', src: '/screenshots/profissionais.webp',
      desc: 'Carteira completa com filtros por potencial e estágio.' },
    { id: 'agenda', label: 'Agenda', src: '/screenshots/agenda.webp',
      desc: 'Calendário semanal com sugestões automáticas de visitas.' },
    { id: 'pipeline', label: 'Pipeline', src: '/screenshots/pipeline.webp',
      desc: 'Funil visual com métricas de conversão por estágio.' },
    { id: 'ia', label: 'Gravação IA', src: '/screenshots/gravacao-ia.webp',
      desc: 'Grave em áudio e a IA preenche o resumo automaticamente.' },
  ]
</script>

<div>
  <!-- Tabs -->
  <div class="flex gap-2 justify-center mb-8 flex-wrap">
    {#each abas as aba}
      <button
        onclick={() => abaAtiva = aba.id}
        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        style={abaAtiva === aba.id
          ? 'background-color: #2563eb; color: #ffffff;'
          : 'background-color: #f3f4f6; color: #6b7280;'}
      >
        {aba.label}
      </button>
    {/each}
  </div>

  <!-- Screenshot ativa -->
  {#each abas as aba}
    {#if abaAtiva === aba.id}
      <div class="text-center">
        <img
          src={aba.src}
          alt={aba.label}
          class="rounded-2xl shadow-2xl border mx-auto max-w-4xl w-full"
          style="border-color: #e5e7eb;"
          loading="lazy"
        />
        <p class="mt-4 text-lg" style="color: #6b7280;">{aba.desc}</p>
      </div>
    {/if}
  {/each}
</div>
```

---

### 5. Planos

```
Comece grátis. Pague quando estiver convencido.

                    [Individual]              [Empresa]
                    R$ 79/mês                R$ 49/mês por usuário
                    Para autônomos           Para equipes

Trial gratuito      ✓ 7 dias                ✓ 7 dias
Profissionais       Ilimitado               Ilimitado
Propagandistas      1                       Ilimitado
Agenda + Pipeline   ✓                       ✓
Gravação por IA     50/mês                  Ilimitado
Notificações        ✓                       ✓
Dashboard gestor    —                       ✓
Relatórios          —                       ✓
Suporte             Email                   Prioritário

                [Começar grátis →]      [Começar grátis →]
```

---

### 6. Depoimentos (placeholder)

```
O que propagandistas dizem sobre o MediVisitas

"Reduzi o tempo de registro de visitas em 70% com a gravação por IA."
— Lucas S., Propagandista há 8 anos

"Finalmente consigo saber quais médicos preciso visitar com mais urgência."
— Ana P., Representante farmacêutica
```

---

### 7. CTA Final

```
Pronto para organizar sua carteira de clientes?

Comece seu trial gratuito de 7 dias agora.
Sem cartão de crédito. Cancele quando quiser.

[Criar conta grátis →]
```

---

## SEO — Base.astro

```astro
---
interface Props {
  titulo: string
  descricao: string
  ogImage?: string
}

const {
  titulo,
  descricao,
  ogImage = '/og-image.png'
} = Astro.props
---

<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{titulo} | MediVisitas</title>
    <meta name="description" content={descricao} />

    <!-- Open Graph -->
    <meta property="og:title" content={titulo} />
    <meta property="og:description" content={descricao} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />

    <!-- Schema.org -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "MediVisitas",
        "description": "CRM para propagandistas farmacêuticos",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "79",
          "priceCurrency": "BRL"
        }
      }
    </script>

    <!-- Canonical -->
    <link rel="canonical" href={Astro.url} />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Configuração Astro

```javascript
// apps/landing/astro.config.mjs
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://medivisitas.com",
  integrations: [svelte(), tailwind(), sitemap()],
  output: "static", // HTML estático puro
});
```

---

## Adicionando ao Monorepo

```json
// pnpm-workspace.yaml — adicionar:
// - 'apps/landing'

// apps/landing/package.json
{
  "name": "@medivisitas/landing",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

```powershell
# Inicializar o projeto Astro
cd apps/landing
pnpm create astro@latest . --template minimal --install --no-git
pnpm add @astrojs/svelte @astrojs/tailwind @astrojs/sitemap
```

---

## Screenshots — Como Capturar

Antes de implementar a seção de screenshots, capturar as telas do app:

1. Abrir o app em `http://localhost:5173`
2. Usar dados de demonstração realistas (não "teste")
3. Capturar em resolução 1440×900 (desktop padrão)
4. Converter para `.webp` para performance
5. Salvar em `apps/landing/public/screenshots/`

Telas a capturar:

- `dashboard.webp` — home com KPIs e alertas
- `profissionais.webp` — listagem com filtros
- `agenda.webp` — calendário semanal
- `pipeline.webp` — kanban ou funil
- `gravacao-ia.webp` — modal de gravação

---

## Deploy

```
medivisitas.com      → Vercel (apps/landing) — static
app.medivisitas.com  → Vercel (apps/web) — SvelteKit
api.medivisitas.com  → Railway ou Fly.io (apps/api) — Fastify
```

Configurar no `vercel.json` de cada app:

```json
{
  "buildCommand": "pnpm --filter @medivisitas/landing build",
  "outputDirectory": "apps/landing/dist"
}
```

---

## Sequência de Implementação

```
1.  [PLAN]    skill brainstorming → estrutura de seções, conversão, SEO
2.  [PLAN]    skill write-plan → subtarefas atômicas

3.  [SETUP]   Criar apps/landing com Astro + Svelte + Tailwind
4.  [SETUP]   Adicionar ao pnpm-workspace.yaml

5.  [CONTENT] Capturar screenshots do app (dados demo reais)
6.  [CONTENT] Criar og-image.png (1200×630px)

7.  [DEV]     Base.astro — layout com SEO completo
8.  [DEV]     Header.astro — nav com links para app
9.  [DEV]     Hero.astro — headline + CTA + screenshot hero
10. [DEV]     Features.astro — 6 cards de funcionalidades
11. [DEV]     Screenshots.svelte — galeria interativa (island)
12. [DEV]     Planos.astro — tabela comparativa
13. [DEV]     CTA.astro — seção final
14. [DEV]     Footer.astro
15. [DEV]     Páginas internas (funcionalidades, planos, contato)

16. [SEO]     Verificar sitemap, meta tags, schema.org
17. [PERF]    Lighthouse — garantir score ≥ 95

18. [VER]     skill verification-before-completion
```

---

## Checklist de Conclusão da Fase 11

```
Setup
[ ] apps/landing criado e no pnpm-workspace.yaml
[ ] Astro + Svelte + Tailwind configurados
[ ] pnpm --filter @medivisitas/landing dev roda sem erros

Conteúdo
[ ] 5 screenshots capturados em .webp 1440×900
[ ] og-image.png criado (1200×630px)
[ ] Textos em pt-BR sem placeholder lorem ipsum

Componentes
[ ] Header com links corretos para app (login e signup)
[ ] Hero com headline, subtítulo e CTA
[ ] Features com 6 cards de funcionalidades reais
[ ] Screenshots com tabs interativas (Svelte island)
[ ] Planos com tabela comparativa Individual/Empresa
[ ] CTA final com link para signup
[ ] Footer com links úteis

SEO
[ ] Title e description únicos por página
[ ] Open Graph configurado
[ ] Schema.org SoftwareApplication
[ ] Sitemap gerado automaticamente
[ ] Canonical URLs

Performance
[ ] Lighthouse Performance ≥ 95
[ ] Imagens em .webp com loading="lazy"
[ ] Zero layout shift (CLS = 0)

Deploy
[ ] Build sem erros: pnpm --filter @medivisitas/landing build
[ ] Deploy configurado (Vercel/Netlify/Cloudflare)
[ ] Domínio medivisitas.com apontando para landing
[ ] app.medivisitas.com apontando para app SvelteKit
```

---

## Resultado Esperado

Ao concluir a Fase 11:

1. `medivisitas.com` exibe a landing page com todas as seções
2. Screenshots reais do app demonstram as funcionalidades
3. Visitante clica em "Começar trial" → vai para signup no app
4. SEO configurado para indexação no Google
5. Performance Lighthouse ≥ 95 em todas as métricas
6. Site responsivo funcionando em mobile, tablet e desktop
