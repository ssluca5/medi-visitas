---
name: medivisitas-design
description: >
  MediVisitas design system. Use this skill for EVERY frontend task —
  new screens, components, forms, modals, badges, buttons, sheets, tables.
  Ensures visual consistency across the entire CRM application.
  Trigger phrases: "create", "build", "add", "implement", "screen",
  "component", "form", "modal", "button", "sheet", "table", "card",
  "badge", "page", "tela", "componente", "formulário".
---

# MediVisitas Design System

Leia este arquivo completamente antes de escrever qualquer código frontend.
Todo elemento de UI deve seguir estas especificações — sem exceções.

---

## Personalidade Visual

Profissional, limpo, médico. Fundo cinza muito claro (`#f8f9fa`).
Azul como cor principal — transmite confiança e precisão clínica.
Inspirado em sistemas CRM médicos modernos.
**Nunca** use gradientes, sombras pesadas ou elementos decorativos.

---

## 1. Cores — Sempre CSS Variables

| Variable | Valor | Uso |
|---|---|---|
| `--bg-primary` | `#f8f9fa` | Fundo principal — cinza muito claro |
| `--bg-surface` | `#ffffff` | Cards, modais, sheets, sidebar |
| `--text-primary` | `#111827` | Títulos, textos principais |
| `--text-secondary` | `#6b7280` | Labels, descrições, subtítulos |
| `--text-muted` | `#9ca3af` | Placeholders, textos inativos |
| `--brand-primary` | `#2563eb` | Azul — botões primários, itens ativos |
| `--brand-light` | `#eff6ff` | Fundo leve azul — item ativo na sidebar |
| `--status-ativo` | `#059669` | Verde — status Ativo |
| `--status-inativo` | `#9ca3af` | Cinza — status Inativo |
| `--pipeline-prospectado` | `#f59e0b` | Âmbar — estágio Prospectado |
| `--pipeline-visitado` | `#3b82f6` | Azul — estágio Visitado |
| `--pipeline-interessado` | `#8b5cf6` | Roxo — estágio Interessado |
| `--pipeline-prescritor` | `#10b981` | Verde — estágio Prescritor |
| `--pipeline-fidelizado` | `#059669` | Verde escuro — estágio Fidelizado |
| `--potencial-alto` | `#dc2626` | Vermelho — potencial Alto |
| `--potencial-medio` | `#f59e0b` | Âmbar — potencial Médio |
| `--potencial-baixo` | `#6b7280` | Cinza — potencial Baixo |
| `--potencial-estrategico` | `#7c3aed` | Roxo — potencial Estratégico |
| `--border-base` | `#e5e7eb` | Bordas de cards, tabelas e inputs |
| `--danger` | `#dc2626` | Vermelho — ações destrutivas |

---

## 2. Tipografia

Font: **Inter**. Weights: 400, 500, 600.

| Elemento | Tamanho | Weight |
|---|---|---|
| H1 — Título de página | 24px | 600 |
| H2 — Subtítulo de seção | 16px | 600 |
| Body | 14px | 400 |
| Small / Muted | 13px | 400 |
| Eyebrow / Label de seção | 11px | 600 uppercase |
| Cabeçalho de tabela | 12px | 600 uppercase |

**Padrão de página:**
```tsx
<div>
  <h1 className="text-2xl font-semibold text-gray-900">Profissionais</h1>
  <p className="text-sm text-gray-500 mt-0.5">
    1 profissional cadastrado
  </p>
</div>
```

---

## 3. Layout

- **Sidebar:** Fixa, 200px, fundo branco, borda direita `--border-base`
- **Fundo da aplicação:** `#f8f9fa` — cinza muito claro
- **Content area:** padding 32px
- **Desktop-first** em todas as telas

---

## 4. Sidebar

```tsx
<aside className="fixed left-0 top-0 h-full w-48 bg-white border-r border-gray-200 flex flex-col">
  {/* Logo */}
  <div className="p-4">
    <p className="font-bold text-gray-900 text-base">MediVisitas</p>
    <p className="text-xs text-gray-400">CRM para Propagandistas</p>
  </div>

  {/* Nav */}
  <nav className="flex-1 px-3 py-2 space-y-0.5">
    {/* Nav item — inactive */}
    <a className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm
      text-gray-600 hover:bg-gray-50 transition-colors">
      <Icon className="w-4 h-4" />
      Dashboard
    </a>

    {/* Nav item — active */}
    <a className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium"
      style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
      <Icon className="w-4 h-4" />
      Profissionais
    </a>

    {/* Group label */}
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-2 py-1 mt-3">
      CADASTROS
    </p>
  </nav>

  {/* Footer com usuário */}
  <div className="p-3 border-t border-gray-100">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full flex items-center justify-center
        text-xs font-semibold text-white"
        style={{ backgroundColor: '#2563eb' }}>
        L
      </div>
      <span className="text-sm text-gray-700">Lucas Silveira</span>
    </div>
    <button className="flex items-center gap-1.5 mt-2 text-xs text-gray-400
      hover:text-gray-600 transition-colors">
      <LogOut className="w-3 h-3" />
      Sair
    </button>
  </div>
</aside>
```

---

## 5. Componentes

### 5.1 Botões

**Primário (azul):**
```tsx
<button
  style={{ backgroundColor: '#2563eb', borderRadius: '8px' }}
  className="h-9 px-4 text-sm font-medium text-white hover:opacity-90
    transition-opacity flex items-center gap-2">
  <Plus className="w-4 h-4" />
  Novo Profissional
</button>
```

**Secundário / Ghost:**
```tsx
<button className="h-9 px-4 text-sm font-medium border border-gray-200 rounded-lg
  bg-white text-gray-700 hover:bg-gray-50 transition-colors">
  Cancelar
</button>
```

**Danger (destrutivo):**
```tsx
<button
  style={{ backgroundColor: '#dc2626', borderRadius: '8px' }}
  className="h-9 px-4 text-sm font-medium text-white hover:opacity-90">
  Excluir
</button>
```

**Link inline:**
```tsx
<button className="text-sm font-medium" style={{ color: '#2563eb' }}>
  + Adicionar subespecialidade
</button>
```

### 5.2 Sheet Lateral (Formulários)

O MediVisitas usa Sheet lateral para criar/editar — não modal centralizado.

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent
    side="right"
    className="w-[420px] overflow-y-auto"
    style={{ backgroundColor: '#ffffff' }}>

    <SheetHeader className="pb-4 border-b border-gray-100">
      <SheetTitle className="text-lg font-semibold text-gray-900">
        Novo Profissional
      </SheetTitle>
      <p className="text-sm text-gray-500">Preencha os dados para cadastrar</p>
    </SheetHeader>

    <div className="py-5 space-y-6">
      {/* Seção com eyebrow */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            DADOS BÁSICOS
          </p>
        </div>
        <div className="space-y-4">
          {/* campos */}
        </div>
      </div>
    </div>

    {/* Ações fixas no rodapé */}
    <div className="flex gap-3 pt-4 border-t border-gray-100">
      <button className="flex-1 h-10 text-sm font-medium border border-gray-200
        rounded-lg bg-white text-gray-700 hover:bg-gray-50">
        Cancelar
      </button>
      <button
        style={{ backgroundColor: '#2563eb', borderRadius: '8px' }}
        className="flex-1 h-10 text-sm font-medium text-white hover:opacity-90">
        Cadastrar Profissional
      </button>
    </div>
  </SheetContent>
</Sheet>
```

**Seções dentro do Sheet — sempre com eyebrow + ícone:**
```tsx
// DADOS BÁSICOS
// CONTATO
// ATUAÇÃO
// CLASSIFICAÇÃO
```

### 5.3 Tabela de Listagem

```tsx
<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
  {/* Cabeçalho da tabela */}
  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-4 py-3
    border-b border-gray-100 bg-gray-50">
    {['NOME', 'ESPECIALIDADE', 'POTENCIAL', 'ESTÁGIO', 'AÇÕES'].map(col => (
      <p key={col} className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {col}
      </p>
    ))}
  </div>

  {/* Linha da tabela */}
  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-4 py-3
    border-b border-gray-100 hover:bg-gray-50 transition-colors items-center">
    {/* Nome + avatar */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center
        text-xs font-semibold text-white"
        style={{ backgroundColor: '#2563eb' }}>
        T
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">Dr. João Silva</p>
        <p className="text-xs text-gray-500">CRM 123456</p>
      </div>
    </div>

    {/* Especialidade */}
    <p className="text-sm text-gray-600">Cardiologia</p>

    {/* Potencial badge */}
    <PotencialBadge potencial="Médio" />

    {/* Estágio badge */}
    <EstágioBadge estagio="Prospectado" />

    {/* Ações */}
    <div className="flex items-center gap-1">
      <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400
        hover:text-gray-600 transition-colors" title="Ver detalhes">
        <ArrowRight className="w-4 h-4" />
      </button>
      <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400
        hover:text-gray-600 transition-colors" title="Inativar">
        <Power className="w-4 h-4" />
      </button>
      <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400
        hover:text-gray-600 transition-colors" title="Editar">
        <Pencil className="w-4 h-4" />
      </button>
      <button className="p-1.5 rounded hover:bg-gray-100 text-red-400
        hover:text-red-600 transition-colors" title="Excluir">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
```

### 5.4 Badges de Status

**Status Ativo/Inativo:**
```tsx
// Ativo
<span className="text-sm font-medium" style={{ color: '#059669' }}>
  Ativa
</span>

// Inativo (texto muted, sem negrito)
<span className="text-sm text-gray-400">Inativa</span>
```

**Potencial de prescrição:**
```tsx
const potencialColors = {
  Alto: { color: '#dc2626' },
  Médio: { color: '#f59e0b' },
  Baixo: { color: '#6b7280' },
  Estratégico: { color: '#7c3aed' },
}

<span className="text-sm font-medium"
  style={{ color: potencialColors[potencial].color }}>
  {potencial}
</span>
```

**Estágio no pipeline:**
```tsx
const estagioColors = {
  Prospectado: { bg: '#fef3c7', color: '#92400e' },
  Visitado:    { bg: '#dbeafe', color: '#1e40af' },
  Interessado: { bg: '#ede9fe', color: '#5b21b6' },
  Prescritor:  { bg: '#d1fae5', color: '#065f46' },
  Fidelizado:  { bg: '#d1fae5', color: '#064e3b' },
}

<span className="text-xs font-medium px-2 py-0.5 rounded"
  style={{
    backgroundColor: estagioColors[estagio].bg,
    color: estagioColors[estagio].color
  }}>
  {estagio}
</span>
```

### 5.5 Cards do Dashboard

```tsx
// Card de estatística com ícone
<div className="bg-white rounded-xl border border-gray-200 p-5">
  <div className="flex items-start justify-between mb-4">
    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: '#eff6ff' }}>
      <Users className="w-5 h-5" style={{ color: '#2563eb' }} />
    </div>
  </div>
  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
    PROFISSIONAIS
  </p>
  <p className="text-2xl font-bold text-gray-900">—</p>

  {/* Lista de itens recentes */}
  <div className="mt-3 space-y-2">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-700">Dr. Carlos Silva</p>
        <p className="text-xs text-gray-500">Cardiologia</p>
      </div>
      <span className="text-xs px-2 py-0.5 rounded"
        style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
        Novo
      </span>
    </div>
  </div>
</div>
```

**Card do Pipeline (barra de progresso por estágio):**
```tsx
<div className="bg-white rounded-xl border border-gray-200 p-5">
  <div className="flex items-start justify-between mb-4">
    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: '#fef3c7' }}>
      <TrendingUp className="w-5 h-5 text-amber-500" />
    </div>
  </div>
  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
    PIPELINE
  </p>
  <div className="space-y-2">
    {[
      { label: 'Prospectado', count: 5, color: '#f59e0b' },
      { label: 'Interessado', count: 2, color: '#10b981' },
    ].map(item => (
      <div key={item.label} className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{item.label}</p>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full"
              style={{ width: `${(item.count / 10) * 100}%`, backgroundColor: item.color }} />
          </div>
          <span className="text-sm font-medium text-gray-700 w-4 text-right">
            {item.count}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 5.6 Input Fields

```tsx
<div className="space-y-1.5">
  <label className="text-sm font-medium text-gray-700">
    Nome completo <span className="text-red-500">*</span>
  </label>
  <input
    className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
      bg-white placeholder:text-gray-400"
    placeholder="Dr. João Silva"
  />
  {/* Helper text abaixo do campo */}
  <p className="text-xs text-gray-400">Registro profissional</p>
</div>
```

**Campos lado a lado (grid 2 colunas):**
```tsx
<div className="grid grid-cols-2 gap-3">
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">CRM</label>
    <input className="..." placeholder="123456" />
  </div>
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">UF do CRM</label>
    <input className="..." placeholder="SP" />
  </div>
</div>
```

**Select com combobox:**
```tsx
<select className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
  bg-white text-gray-900">
  <option value="">Selecione a especialidade...</option>
</select>
```

### 5.7 Toggle de seleção (Potencial / Estágio / Classificação)

Usado para seleção de uma opção entre várias — não usar radio buttons.

```tsx
// Estágio no pipeline
<div className="flex flex-wrap gap-2">
  {['Prospectado', 'Visitado', 'Interessado', 'Prescritor', 'Fidelizado'].map(estagio => (
    <button key={estagio}
      onClick={() => setSelected(estagio)}
      className={cn(
        "px-3 py-1.5 text-sm rounded-lg border transition-colors",
        selected === estagio
          ? "border-blue-500 text-white"
          : "border-gray-200 text-gray-600 hover:border-gray-300"
      )}
      style={selected === estagio ? { backgroundColor: '#2563eb' } : {}}>
      {estagio}
    </button>
  ))}
</div>
```

### 5.8 Tabela de Especialidades (agrupada por categoria)

```tsx
// Grupo de categoria
<div className="mb-6">
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2">
      <Stethoscope className="w-4 h-4 text-gray-400" />
      <h3 className="font-semibold text-gray-900">Farmácia</h3>
      <span className="text-xs text-gray-400">(4)</span>
    </div>
    <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  </div>

  {/* Tabela dentro do grupo */}
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="grid grid-cols-[1fr_auto_auto_auto] px-4 py-2.5
      border-b border-gray-100 bg-gray-50">
      {['NOME', 'SUBS', 'STATUS', 'AÇÕES'].map(col => (
        <p key={col} className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {col}
        </p>
      ))}
    </div>

    {/* Linha expandível */}
    <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center">
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-900">Farmácia Clínica</span>
        </div>
        <span className="text-sm text-gray-500 text-center">1</span>
        <span className="text-sm font-medium" style={{ color: '#059669' }}>Ativa</span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    {/* Subespecialidade (indentada) */}
    <div className="px-4 py-2.5 pl-10 border-b border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">└</span>
        <span className="text-sm text-gray-700">Teste</span>
      </div>
    </div>

    {/* Adicionar subespecialidade */}
    <div className="px-4 py-2 pl-10">
      <button className="text-sm font-medium" style={{ color: '#2563eb' }}>
        + Adicionar subespecialidade
      </button>
    </div>
  </div>
</div>
```

### 5.9 Modal de Confirmação Destrutiva

```tsx
// Padrão observado no modal "Excluir categoria"
<AlertDialog>
  <AlertDialogContent
    className="max-w-sm"
    style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
    <div className="flex flex-col items-start gap-4">
      {/* Ícone destrutivo */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#fee2e2' }}>
        <Trash2 className="w-5 h-5" style={{ color: '#dc2626' }} />
      </div>

      <div>
        <AlertDialogTitle className="text-base font-semibold text-gray-900">
          Excluir categoria
        </AlertDialogTitle>
        <AlertDialogDescription className="text-sm text-gray-500 mt-1">
          A exclusão da categoria <strong>"Farmácia"</strong> também
          excluirá todas as especialidades e subespecialidades vinculadas.
          <br /><br />
          Esta ação não pode ser desfeita.
        </AlertDialogDescription>
      </div>

      <div className="flex gap-3 w-full">
        <AlertDialogCancel className="flex-1 h-9 text-sm border-gray-200">
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          className="flex-1 h-9 text-sm text-white"
          style={{ backgroundColor: '#dc2626', borderRadius: '8px' }}>
          Excluir
        </AlertDialogAction>
      </div>
    </div>
  </AlertDialogContent>
</AlertDialog>
```

### 5.10 Filtros de listagem (barra de filtros)

```tsx
// Padrão da tela de Profissionais
<div className="flex gap-3 mb-4">
  {/* Search */}
  <div className="relative flex-1 max-w-xs">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      className="w-full h-9 pl-9 pr-3 text-sm border border-gray-200 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        bg-white placeholder:text-gray-400"
      placeholder="Buscar por nome ou CRM..."
    />
  </div>

  {/* Selects de filtro */}
  <select className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white
    text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
    <option>Todos os potenciais</option>
  </select>
  <select className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white
    text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
    <option>Todos os estágios</option>
  </select>
  <select className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white
    text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
    <option>Todas as classificações</option>
  </select>
</div>
```

### 5.11 Cards de Acesso Rápido (Dashboard)

```tsx
<div className="grid grid-cols-3 gap-4 mt-6">
  {[
    { title: 'Profissionais', desc: 'Gerenciar cadastros', icon: Users, href: '/profissionais' },
    { title: 'Especialidades', desc: 'Categorias e subs', icon: Stethoscope, href: '/especialidades' },
    { title: 'Pipeline', desc: 'Funil de conversão', icon: TrendingUp, href: '/pipeline' },
  ].map(item => (
    <a key={item.title} href={item.href}
      className="bg-white rounded-xl border border-gray-200 p-4
        hover:border-blue-200 hover:shadow-sm transition-all flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: '#eff6ff' }}>
        <item.icon className="w-5 h-5" style={{ color: '#2563eb' }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
        <p className="text-xs text-gray-500">{item.desc}</p>
      </div>
    </a>
  ))}
</div>
```

---

## 6. Copy (Textos e Mensagens)

**Idioma:** Português (Brasil) para toda a UI.

**Títulos de página:** Substantivo, capitalizado
```
✅ Profissionais  ✅ Especialidades  ✅ Agenda  ✅ Pipeline
❌ Gerenciar Profissionais  ❌ Lista de especialidades
```

**Subtítulos:**
```
✅ 1 profissional cadastrado
✅ 25 especialidade(s) cadastrada(s)
✅ CRM para Propagandistas
```

**Ações:**
```
✅ Novo Profissional  ✅ Nova Especialidade  ✅ Cadastrar Profissional
✅ + Adicionar subespecialidade  ✅ Criar
❌ Salvar  ❌ OK  ❌ Submit
```

**Confirmações destrutivas:**
```
Title:  Excluir categoria
Body:   A exclusão da categoria "X" também excluirá todas as
        especialidades e subespecialidades vinculadas.
        Esta ação não pode ser desfeita.
Cancel: Cancelar
Action: Excluir
```

**Helper texts (abaixo dos campos):**
```
CRM:      "Registro profissional"
UF:       "Estado do registro"
CEP:      "Preenche endereço, bairro, cidade e UF"
Potencial: "Volume estimado de prescrições"
Estágio:  "Acompanhamento do relacionamento"
```

**Toast messages:**
```
✅ Profissional cadastrado com sucesso.
✅ Especialidade criada.
✅ Estágio atualizado.
```

---

## 7. Ícones

Biblioteca: **Lucide React** exclusivamente.

| Contexto | Ícone |
|---|---|
| Dashboard | `LayoutDashboard` |
| Profissionais | `Users` ou `UserCheck` |
| Agenda | `Calendar` |
| Visitas | `ClipboardList` |
| Pipeline | `TrendingUp` |
| Especialidades | `Stethoscope` |
| Adicionar | `Plus` |
| Ver detalhes / navegar | `ArrowRight` |
| Inativar | `Power` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Expandir | `ChevronRight` |
| Recolher | `ChevronDown` |
| Buscar | `Search` |
| Sair | `LogOut` |
| Potencial Alto | `TrendingUp` |
| Visita | `MapPin` |

Tamanhos: `w-4 h-4` na tabela e inline, `w-5 h-5` em cards e sidebar.

---

## 8. Gotchas — Erros Frequentes a Evitar

1. **SheetContent background** — sempre `style={{ backgroundColor: '#ffffff' }}`.
   Sem isso fica transparente.

2. **DropdownMenuContent** — mesmo fix: `style={{ backgroundColor: '#ffffff' }}`.

3. **Botões primários** — `style={{ backgroundColor: '#2563eb', borderRadius: '8px' }}`.
   Tailwind border-radius é sobrescrito pelo shadcn.

4. **Fundo da aplicação** — `#f8f9fa`, nunca branco puro.

5. **Estágios do pipeline** — são unidirecionais: Prospectado → Visitado → Interessado
   → Prescritor → Fidelizado. Nunca permitir regressão.

6. **EstagioLog é imutável** — nunca editar ou deletar registros de log de estágio.

7. **Soft delete** — `deletedAt` timestamp, nunca DELETE físico em dados de profissionais.

8. **Modal de confirmação destrutiva** — sempre com ícone de lixeira em fundo vermelho claro
   (`#fee2e2`), título claro sobre o que será excluído, e aviso "Esta ação não pode ser desfeita."

9. **Helper texts** — sempre abaixo do campo, nunca no placeholder.
   Placeholder é exemplo do formato esperado.

10. **Campos lado a lado** — usar grid 2 colunas para CRM/UF, Número/Complemento,
    Cidade/UF. Nunca empilhar campos curtos verticalmente.