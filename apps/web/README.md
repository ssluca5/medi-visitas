# apps/web — Next.js 14 (App Router)

> Frontend do MediVisitas. Consulte o [`CLAUDE.md`](../../CLAUDE.md) na raiz para convenções globais.

---

## Stack local

| Item             | Detalhe                          |
|------------------|----------------------------------|
| Framework        | Next.js 14 (App Router)          |
| Estilização      | Tailwind CSS + CSS Variables     |
| Componentes UI   | shadcn/ui                        |
| Auth (client)    | Clerk (`@clerk/nextjs`)          |
| HTTP client      | fetch nativo / React Query       |
| Porta dev        | `3000`                           |

---

## Scripts

```powershell
# Iniciar dev
pnpm --filter web dev

# Build
pnpm --filter web build

# Verificar porta em uso (PowerShell)
Get-NetTCPConnection -LocalPort 3000

# Matar processo na porta
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
```

---

## Variáveis de ambiente

Arquivo: `apps/web/.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Estrutura de pastas

```
apps/web/src/
├── app/
│   ├── (auth)/           # Rotas públicas (sign-in, sign-up Clerk)
│   ├── (dashboard)/      # Rotas protegidas (middleware Clerk)
│   │   ├── profissionais/
│   │   ├── visitas/
│   │   ├── agenda/
│   │   └── pipeline/
│   └── layout.tsx
├── components/
│   ├── ui/               # shadcn/ui base
│   └── [feature]/        # Componentes de domínio
├── hooks/
├── lib/
└── styles/
    └── globals.css       # CSS Variables de cor definidas aqui
```

---

## Padrão de UI obrigatório

Todas as ações de **criar** e **editar** usam **FAB + Sheet lateral**. Nunca modal centralizado.

```tsx
// ✅ FAB abre Sheet lateral
<Sheet>
  <SheetTrigger asChild>
    <Button
      className="fixed bottom-6 right-6 rounded-full w-14 h-14"
      style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '50%' }}
    >
      <Plus />
    </Button>
  </SheetTrigger>
  <SheetContent side="right">
    {/* Formulário aqui */}
  </SheetContent>
</Sheet>

// ✅ DropdownMenuContent — backgroundColor inline (evita bug de transparência)
<DropdownMenuContent style={{ backgroundColor: 'rgb(var(--background))' }}>
  ...
</DropdownMenuContent>

// ✅ Botões — style inline obrigatório (Tailwind border-radius é sobrescrito)
<Button style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '8px' }}>
  Salvar
</Button>
```

---

## Skills para este módulo

Antes de implementar, instale e consulte as skills abaixo.  
Instalação única do `obra/superpowers`: `/plugin marketplace add obra/superpowers-marketplace`

### 🎨 Design & UI/UX

| Skill | Repositório | Quando usar |
|-------|-------------|-------------|
| `frontend-design` | `anthropics/skills` _(nativo)_ | **Sempre** ao criar/editar componentes ou páginas |
| `canvas-design` | `anthropics/skills` _(nativo)_ | Mockups e wireframes |
| `web-artifacts-builder` | `anthropics/skills` _(nativo)_ | Artifacts HTML/React interativos |

### 🧪 Qualidade & Testes

| Skill | Repositório | Quando usar |
|-------|-------------|-------------|
| `test-driven-development` | `obra/superpowers` | Toda implementação de lógica de componentes |
| `webapp-testing` | `anthropics/skills` _(nativo)_ | Testes E2E e de componentes |
| `systematic-debugging` | `obra/superpowers` | Investigação de bugs visuais ou de estado |
| `testing-anti-patterns` | `obra/superpowers` | Revisão de cobertura de testes |

### 📐 Processo

| Skill | Repositório | Quando usar |
|-------|-------------|-------------|
| `brainstorming` | `obra/superpowers` | Antes de iniciar qualquer feature nova |
| `write-plan` | `obra/superpowers` | Features com múltiplos arquivos ou fases |
| `verification-before-completion` | `obra/superpowers` | Antes de encerrar cada sessão |

---

## Checklist de feature frontend

- [ ] CSS Variables usadas para todas as cores (sem hex hardcoded)
- [ ] FAB + Sheet para create/edit (sem modal centralizado)
- [ ] `DropdownMenuContent` com `style` inline de backgroundColor
- [ ] Botões com `style` inline de backgroundColor + borderRadius
- [ ] Textos auxiliares de campos opcionais abaixo do label
- [ ] Componente testado manualmente no fluxo completo
