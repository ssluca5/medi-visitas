'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { Plus, Users, Calendar, FileText, BarChart3, LogOut, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navItems = [
  { href: '/dashboard/profissionais', label: 'Profissionais', icon: Users },
  { href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/visitas', label: 'Visitas', icon: FileText },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: BarChart3 },
]

const cadAuxItems = [
  { href: '/dashboard/especialidades', label: 'Especialidades', icon: Stethoscope },
]

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside
        className="hidden w-64 flex-col border-r p-4 lg:flex"
        style={{ backgroundColor: 'rgb(var(--color-surface-2))', borderColor: 'rgb(var(--color-border))' }}
      >
        <div className="mb-8">
          <h1
            className="text-xl font-bold"
            style={{ color: 'rgb(var(--color-text))' }}
          >
            MediVisitas
          </h1>
          <p
            className="text-sm"
            style={{ color: 'rgb(var(--color-text-muted))' }}
          >
            CRM para Propagandistas
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-black/5"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Divisão Cadastros Auxiliares */}
          <div className="pt-4">
            <div className="mb-2 px-3 text-xs font-medium uppercase" style={{ color: 'rgb(var(--color-text-muted))' }}>
              Cadastros Auxiliares
            </div>
            {cadAuxItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-black/5"
                style={{ color: 'rgb(var(--color-text))' }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="pt-4">
          <div
            className="mb-4 text-sm"
            style={{ color: 'rgb(var(--color-text-muted))' }}
          >
            {user?.fullName || user?.emailAddresses?.[0]?.emailAddress}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => signOut({ redirectUrl: '/login' })}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              Dashboard
            </h2>
            <p
              className="text-sm"
              style={{ color: 'rgb(var(--color-text-muted))' }}
            >
              Bem-vindo ao MediVisitas
            </p>
          </div>
        </header>

        <div
          className="rounded-lg p-8 text-center"
          style={{ backgroundColor: 'rgb(var(--color-surface-2))', border: '1px solid rgb(var(--color-border))' }}
        >
          <p
            className="text-lg"
            style={{ color: 'rgb(var(--color-text-muted))' }}
          >
            Use o menu lateral para navegar entre as seções
          </p>
        </div>

        {/* FAB - Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg lg:hidden"
              style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '50%' }}
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            style={{ backgroundColor: 'rgb(var(--color-surface))' }}
          >
            <div className="space-y-4 pt-4">
              <p
                className="text-sm font-medium"
                style={{ color: 'rgb(var(--color-text))' }}
              >
                Menu Rápido
              </p>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-black/5"
                  style={{ color: 'rgb(var(--color-text))' }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  )
}
