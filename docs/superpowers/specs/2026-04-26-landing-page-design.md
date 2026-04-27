# Landing Page — Design Spec

> MediVisitas Phase 11
> Date: 2026-04-26
> Stack: Astro 5 + Svelte 5 Islands + Tailwind CSS v4

---

## Overview

Criar landing page estática em Astro para `medivisitas.com`, separada do app SvelteKit em `app.medivisitas.com`. Objetivo: converter visitantes em usuários via CTAs claros.

### Domínios

| Domínio               | Servido por                 |
| --------------------- | --------------------------- |
| `medivisitas.com`     | Landing page (Astro static) |
| `app.medivisitas.com` | App SvelteKit (existente)   |

---

## Architecture

### Tech Stack

| Camada         | Tecnologia                               |
| -------------- | ---------------------------------------- |
| Framework      | Astro 5 (output: static)                 |
| Interatividade | Svelte 5 islands (`client:load`)         |
| Styling        | Tailwind CSS v4 (CSS-first @theme)       |
| SEO            | @astrojs/sitemap, schema.org             |
| Package        | `@medivisitas/landing` no pnpm workspace |

### Por que Astro?

- Output estático = HTML puro, zero JS desnecessário
- Islands pattern = hidratar apenas componentes interativos
- Built-in sitemap, SEO otimizado
- Consistência com Svelte (mesmo ecossistema do app)

---

## Directory Structure

```
apps/landing/
├── astro.config.mjs
├── src/
│   ├── layouts/
│   │   └── Base.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── Screenshots.svelte
│   │   ├── Planos.astro
│   │   ├── CTA.astro
│   │   └── Footer.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── funcionalidades.astro
│   │   ├── planos.astro
│   │   └── contato.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── screenshots/
│   │   ├── dashboard.webp
│   │   ├── profissionais.webp
│   │   ├── agenda.webp
│   │   ├── pipeline.webp
│   │   └── gravacao-ia.webp
│   └── og-image.png
└── package.json
```

---

## Design Tokens

Compartilhar as mesmas CSS variables do app (`apps/web/src/app.css`):

```css
:root {
  --color-surface: 255 255 255;
  --color-surface-2: 248 250 252; /* #f8f9fa — fundo da app */
  --color-border: 226 232 240;
  --color-text: 15 23 42; /* #0f172a */
  --color-text-muted: 100 116 139;
  --accent: 37 99 235; /* #2563eb */
  --radius: 8px;
}
```

Fonte: Inter (Google Fonts via `<link>`)

---

## Sections — Home Page

### 1. Header

- Sticky top com backdrop blur
- Logo "MediVisitas" à esquerda
- Nav central: Funcionalidades, Planos, Contato
- À direita: "Fazer login" (ghost) + "Começar grátis" (primary)
- Links:
  - Login → `https://app.medivisitas.com/login`
  - Começar grátis → `https://app.medivisitas.com/signup`

### 2. Hero

- Headline: "CRM para propagandistas farmacêuticos"
- Subheadline: "Organize visitas, acompanhe profissionais e aumente suas prescrições com uma plataforma feita para o seu dia a dia."
- CTA principal: "Começar grátis" (button large, accent)
- Screenshot do dashboard em destaque (mockup com dados realistas)
- Background: gradient sutil de surface para surface-2

### 3. Features (6 cards)

Grid 3×2 (2×3 em mobile). Cada card:

- Ícone (Lucide ou similar)
- Título
- Descrição curta

Funcionalidades:

1. **Cadastro de Profissionais** — CRM completo com pipeline de estágios
2. **Agenda Inteligente** — Calendário semanal com rotas otimizadas
3. **Pipeline Comercial** — Funil visual: Prospectado → Fidelizado
4. **Gravação com IA** — Transcreva visitas automaticamente com MiniMax
5. **Dashboard Analítico** — KPIs, alertas e métricas em tempo real
6. **Multi-tenant** — Gestão de equipes com isolamento de dados

### 4. Screenshots (Svelte Island)

- Componente Svelte com `client:load`
- 5 tabs: Dashboard, Profissionais, Agenda, Pipeline, Gravação IA
- Cada tab mostra screenshot .webp correspondente
- Transição suave entre tabs (fade)
- Imagens com `loading="lazy"` e dimensões explícitas

### 5. Planos

Tabela comparativa:

| Feature       | Individual | Empresa      |
| ------------- | ---------- | ------------ |
| Preço         | Gratuito   | Sob consulta |
| Profissionais | Até 50     | Ilimitados   |
| Usuários      | 1          | Ilimitados   |
| Gravação IA   | 10/mês     | Ilimitada    |
| Suporte       | Email      | Dedicado     |
| Multi-tenant  | —          | ✓            |

CTA: "Começar grátis" para Individual, "Fale conosco" para Empresa

### 6. CTA Final

- Headline: "Comece a organizar suas visitas hoje"
- Sub: "Gratuito para começar. Sem cartão de crédito."
- Botão grande: "Criar conta grátis"

### 7. Footer

- Logo + descrição curta
- Links: Funcionalidades, Planos, Contato, Login
- Copyright © 2026 MediVisitas
- Links legais (placeholder): Termos, Privacidade

---

## Pages

### / (Home)

Todas as seções acima, na ordem.

### /funcionalidades

Versão expandida das Features com mais detalhes por funcionalidade.

### /planos

Tabela de planos expandida com FAQ.

### /contato

Informações de contato + CTAs (sem formulário funcional).

---

## SEO Configuration

### Base.astro

```html
<title>MediVisitas — CRM para Propagandistas Farmacêuticos</title>
<meta
  name="description"
  content="Organize visitas, acompanhe profissionais e aumente suas prescrições. CRM feito para propagandistas farmacêuticos."
/>
<link rel="canonical" href="https://medivisitas.com" />

<!-- Open Graph -->
<meta
  property="og:title"
  content="MediVisitas — CRM para Propagandistas Farmacêuticos"
/>
<meta
  property="og:description"
  content="Organize visitas, acompanhe profissionais e aumente suas prescrições."
/>
<meta property="og:image" content="https://medivisitas.com/og-image.png" />
<meta property="og:url" content="https://medivisitas.com" />
<meta property="og:type" content="website" />

<!-- Schema.org -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MediVisitas",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "CRM para propagandistas farmacêuticos",
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL",
        "name": "Individual"
      }
    ]
  }
</script>
```

### Sitemap

@astrojs/sitemap com `site: 'https://medivisitas.com'`

---

## Dependencies

```json
{
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/svelte": "^4.x",
    "@astrojs/tailwind": "^6.x",
    "@astrojs/sitemap": "^3.x",
    "svelte": "^5.x",
    "tailwindcss": "^4.x",
    "lucide-svelte": "^0.x"
  }
}
```

---

## Performance Targets

- Lighthouse Performance: ≥ 95
- Lighthouse SEO: 100
- Lighthouse Accessibility: ≥ 95
- First Contentful Paint: < 1.5s
- Total bundle JS: < 50KB (apenas Svelte island)

---

## Out of Scope

- Formulário de contato funcional (apenas CTAs)
- Blog / conteúdo dinâmico
- Internacionalização EN (preparar hreflang, implementar depois)
- Analytics (adicionar depois com Plausible ou similar)
- Dark mode na landing (app suporta, landing não por enquanto)
