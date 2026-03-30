'use client'

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk, useSession } from '@clerk/nextjs';
import { Plus, LogOut, Users, Calendar, FileText, BarChart3, Stethoscope, Pencil, Trash2, Power, Play } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EspecialidadeSheet, EspecialidadeFormData } from '@/components/especialidades/EspecialidadeSheet';

const navItems = [
  { href: '/dashboard/profissionais', label: 'Profissionais', icon: Users },
  { href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/visitas', label: 'Visitas', icon: FileText },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: BarChart3 },
];

const cadAuxItems = [
  { href: '/dashboard/especialidades', label: 'Especialidades', icon: Stethoscope },
];

// Função para formatar categoria: primeira letra maiúscula, resto minúsculo
const formatarCategoria = (categoria: string): string => {
  if (!categoria) return '';
  const lower = categoria.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

interface Especialidade {
  id: string;
  nome: string;
  categoria: string;
  ativo: boolean;
}

export default function EspecialidadesPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { session } = useSession();

  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [especialidadeEmEdicao, setEspecialidadeEmEdicao] = useState<EspecialidadeFormData | null>(null);

  const fetchEspecialidades = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await session?.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/especialidades?incluirInativos=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Erro ${response.status}: ${errorBody}`)
      }

      const data = await response.json();
      setEspecialidades(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchEspecialidades();
    } else if (isLoaded && !user) {
      // Usuário carregado mas não logado
      setLoading(false);
    }
  }, [isLoaded, user]);

  const handleNovaEspecialidade = () => {
    setEspecialidadeEmEdicao(null);
    setSheetOpen(true);
  };

  const handleEditarEspecialidade = (especialidade: Especialidade) => {
    setEspecialidadeEmEdicao({
      id: especialidade.id,
      nome: especialidade.nome,
      categoria: especialidade.categoria,
    });
    setSheetOpen(true);
  };

  const handleSalvarEspecialidade = async (data: EspecialidadeFormData) => {
    const token = await session?.getToken();
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const url = data.id
      ? `${process.env.NEXT_PUBLIC_API_URL}/especialidades/${data.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/especialidades`;

    const method = data.id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        categoria: data.categoria
          ? data.categoria.charAt(0).toUpperCase() + data.categoria.slice(1).toLowerCase()
          : data.categoria,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Erro ${response.status}: ${errorBody}`)
    }

    fetchEspecialidades();
  };

  const handleToggleAtivo = async (especialidade: Especialidade) => {
    const token = await session?.getToken();
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/especialidades/${especialidade.id}/ativo`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ativo: !especialidade.ativo }),
    });

    if (response.ok) {
      fetchEspecialidades();
    }
  };

  const handleExcluirEspecialidade = async (especialidade: Especialidade) => {
    const token = await session?.getToken();
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    // Verificar se existem profissionais ativos vinculados a esta especialidade
    try {
      const responseCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/especialidades/${especialidade.id}/profissionais-ativos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseCheck.ok) {
        const data = await responseCheck.json();
        if (data.temProfissionaisAtivos) {
          alert('Não é possível excluir esta especialidade pois existem profissionais ativos vinculados a ela.');
          return;
        }
      }
    } catch (err) {
      console.error('Erro ao verificar profissionais vinculados:', err);
      // Se falhar a verificação, proceed com a exclusão
    }

    if (!confirm(`Tem certeza que deseja excluir a especialidade "${especialidade.nome}"?`)) {
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/especialidades/${especialidade.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Erro ao excluir especialidade');
      return;
    }

    fetchEspecialidades();
  };


  // Agrupar por categoria e ordenar alfabeticamente
  const especialidadesAgrupadas = especialidades.reduce((acc, esp) => {
    const categoriaFormatada = formatarCategoria(esp.categoria);
    if (!acc[categoriaFormatada]) {
      acc[categoriaFormatada] = [];
    }
    acc[categoriaFormatada].push(esp);
    return acc;
  }, {} as Record<string, Especialidade[]>);

  // Ordenar categorias alfabeticamente
  const categoriasOrdenadas = Object.keys(especialidadesAgrupadas).sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  // Ordenar especialidades dentro de cada categoria
  const especialidadesPorCategoria = categoriasOrdenadas.reduce((acc, categoria) => {
    acc[categoria] = especialidadesAgrupadas[categoria].sort((a, b) => 
      a.nome.toLowerCase().localeCompare(b.nome.toLowerCase())
    );
    return acc;
  }, {} as Record<string, Especialidade[]>);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div style={{ color: 'rgb(var(--color-text-muted))' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside
        className="hidden w-64 flex-col border-r p-4 lg:flex"
        style={{ backgroundColor: 'rgb(var(--color-surface-2))', borderColor: 'rgb(var(--color-border))' }}
      >
        <div className="mb-8">
          <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>
            MediVisitas
          </h1>
          <p className="text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
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
                style={{ color: item.href === '/dashboard/especialidades' ? 'rgb(var(--color-brand-500))' : 'rgb(var(--color-text))' }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="pt-4">
          <div className="mb-4 text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
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
            <h2 className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>
              Especialidades
            </h2>
            <p className="text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
              {especialidades.length} especialidade(s) cadastrada(s)
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            onClick={handleNovaEspecialidade}
            style={{ display: 'none' }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Especialidade
          </Button>
        </header>

        {/* Lista de especialidades */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div style={{ color: 'rgb(var(--color-text-muted))' }}>Carregando...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div style={{ color: 'rgb(239 68 68)' }}>{error}</div>
          </div>
        ) : Object.keys(especialidadesPorCategoria).length === 0 ? (
          <div
            className="flex items-center justify-center rounded-lg py-12"
            style={{ backgroundColor: 'rgb(var(--color-surface-2))', border: '1px solid rgb(var(--color-border))' }}
          >
            <div style={{ color: 'rgb(var(--color-text-muted))' }}>
              Nenhuma especialidade encontrada
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {categoriasOrdenadas.map((categoria) => (
              <div key={categoria}>
                <h3 className="mt-8 mb-3 text-base font-bold text-slate-800 tracking-wide">
                  {formatarCategoria(categoria)}
                </h3>
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgb(var(--color-border))' }}>
                  <table className="w-full">
                    <thead
                      className="text-left"
                      style={{ backgroundColor: 'rgb(var(--color-surface-2))' }}
                    >
                      <tr>
                        <th className="p-4 text-sm font-medium text-slate-600 w-1/2">
                          Nome
                        </th>
                        <th className="p-4 text-sm font-medium text-slate-600 w-1/4">
                          Status
                        </th>
                        <th className="p-4 text-sm font-medium text-slate-600 w-1/4 text-center">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {especialidadesPorCategoria[categoria].map((especialidade) => (
                        <tr
                          key={especialidade.id}
                          className={`border-t transition-all duration-200 ${!especialidade.ativo ? 'italic opacity-70 text-slate-400' : ''}`}
                          style={{ 
                            borderColor: 'rgb(var(--color-border))',
                          }}
                        >
                          <td className="p-4">
                            <div className={`font-normal ${especialidade.ativo ? 'text-slate-900' : 'text-slate-400'}`}>
                              {especialidade.nome}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                especialidade.ativo 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {especialidade.ativo ? 'Ativa' : 'Inativa'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center items-center gap-1">
                              <button
                                onClick={() => handleToggleAtivo(especialidade)}
                                title={especialidade.ativo ? 'Inativar' : 'Ativar'}
                                className="group p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                              >
                                {especialidade.ativo ? (
                                  <Power className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors duration-200" />
                                ) : (
                                  <Play className="w-5 h-5 text-slate-300 group-hover:text-green-600 transition-colors duration-200" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditarEspecialidade(especialidade)}
                                title="Editar"
                                className="group p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                              >
                                <Pencil className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                              </button>
                              <button
                                onClick={() => handleExcluirEspecialidade(especialidade)}
                                title="Excluir"
                                className="group p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                              >
                                <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors duration-200" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sheet de edição/criação */}
        <EspecialidadeSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          especialidade={especialidadeEmEdicao}
          onSave={handleSalvarEspecialidade}
          categoriasExistentes={Object.keys(especialidadesPorCategoria).map(formatarCategoria)}
        />

        {/* FAB - Mobile and Desktop */}
        <Button
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
          style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '50%' }}
          onClick={handleNovaEspecialidade}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </main>
    </div>
  );
}
