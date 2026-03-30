---
name: ui-patterns
description: Padrões de componentes UI do MediVisitas com snippets
---

# ui-patterns.md

## CSS Variables (globals.css)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --accent: 221.2 83.2% 53.3%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
}
```

**Regra**: nunca usar hex como `#fff`, `rgb(255,255,255)` diretamente em componentes — usar `rgb(var(--background))`.

## FAB + Sheet Lateral (create/edit)

```tsx
// FAB — botão flutuante
<Button
  onClick={() => setOpen(true)}
  style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '8px' }}
>
  <Plus className="h-4 w-4 mr-2" />
  Novo Profissional
</Button>

// Sheet lateral — padrão para formulários
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>{profissional ? 'Editar' : 'Novo'} Profissional</SheetTitle>
    </SheetHeader>
    <MeuFormulario />
  </SheetContent>
</Sheet>
```

## DropdownMenuContent

```tsx
<DropdownMenuContent
  style={{
    backgroundColor: "rgb(var(--accent))",
    borderRadius: "8px",
  }}
>
  <DropdownMenuItem onClick={() => router.push(`/profissionais/${id}`)}>
    Editar
  </DropdownMenuItem>
  <DropdownMenuItem
    onClick={() => handleDelete(id)}
    style={{ color: "rgb(var(--destructive))" }}
  >
    Excluir
  </DropdownMenuItem>
</DropdownMenuContent>
```

## Badges (PotencialBadge, EstagioBadge)

```tsx
const corPorPotencial = {
  ALTO: 'bg-green-100 text-green-800',
  MEDIO: 'bg-yellow-100 text-yellow-800',
  BAIXO: 'bg-gray-100 text-gray-800',
}

<span className={corPorPotencial[potencial]}>
  {potencial}
</span>
```

## Select com Optgroup

```tsx
<select>
  <optgroup label="Médicos">
    <option value="clinico">Clínico Geral</option>
    <option value="cardiologista">Cardiologista</option>
  </optgroup>
  <optgroup label="Farmácia">
    <option value="farmaceutico">Farmacêutico</option>
  </optgroup>
</select>
```

## Hint de Campo Opcional

```tsx
<div className="space-y-2">
  <Label>
    Email <span className="text-muted-foreground text-xs">(opcional)</span>
  </Label>
  <Input type="email" />
  {/* hint fica ABAIXO do label */}
</div>
```
