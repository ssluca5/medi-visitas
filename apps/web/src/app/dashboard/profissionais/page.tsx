'use client'

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk, useSession } from '@clerk/nextjs';
import { Plus, LogOut, Users, Calendar, FileText, BarChart3, ChevronLeft, ChevronRight, Stethoscope, Pencil, ArrowRight, ArrowLeft, Power, Trash2, Play } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PotencialBadge } from '@/components/profissionais/PotencialBadge';
import { EstagioBadge } from '@/components/profissionais/EstagioBadge';
import { FiltrosProfissionais, FiltrosProfissionaisState } from '@/components/profissionais/FiltrosProfissionais';
import { ProfissionalSheet, ProfissionalFormData } from '@/components/profissionais/ProfissionalSheet';
import type { PotencialPrescricao } from '@/components/profissionais/PotencialBadge';
import type { EstagioPipeline } from '@/components/profissionais/EstagioBadge';

const navItems = [
  { href: '/dashboard/profissionais', label: 'Profissionais', icon: Users },
  { href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/visitas', label: 'Visitas', icon: FileText },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: BarChart3 },
];

const cadAuxItems = [
  { href: '/dashboard/especialidades', label: 'Especialidades', icon: Stethoscope },
];

interface Profissional {
  id: string;
  nome: string;
  crm: string | null;
  email: string | null;
  telefone: string | null;
  potencial: PotencialPrescricao;
  estagioPipeline: EstagioPipeline;
  especialidadeId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  especialidade: {
    id: string;
    nome: string;
    categoria: string;
  } | null;
  endereco: {
    id: string;
    logradouro: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
  } | null;
  contatos: Array<{
    id: string;
    tipo: 'TELEFONE' | 'EMAIL' | 'WHATSAPP' | 'OUTRO';
    valor: string;
    observacao: string | null;
  }>;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function ProfissionaisPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { session } = useSession();

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosProfissionaisState>({
    busca: '',
    potencial: '',
    estagioPipeline: '',
  });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [profissionalEmEdicao, setProfissionalEmEdicao] = useState<ProfissionalFormData | null>(null);
  const [especialidades, setEspecialidades] = useState<Array<{ id: string; nome: string; categoria: string }>>([]);

  const fetchProfissionais = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = await session?.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (filtros.busca) params.append('busca', filtros.busca);
      if (filtros.potencial) params.append('potencial', filtros.potencial);
      if (filtros.estagioPipeline) params.append('estagioPipeline', filtros.estagioPipeline);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profissionais?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar profissionais');
      }

      const data = await response.json();
      setProfissionais(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [session, filtros, pagination.pageSize]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfissionais(1);
    } else if (isLoaded && !user) {
      // Usuário carregado mas não logado
      setLoading(false);
    }
  }, [isLoaded, user, filtros]);

  const fetchEspecialidades = useCallback(async () => {
    const token = await session?.getToken();
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/especialidades`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEspecialidades(data.data);
      }
    } catch (err) {
      console.error('Erro ao carregar especialidades:', err);
    }
  }, [session]);

  useEffect(() => {
    fetchEspecialidades();
  }, [fetchEspecialidades]);

  const handlePageChange = (newPage: number) => {
    fetchProfissionais(newPage);
  };

  const handleFiltrosChange = (newFiltros: FiltrosProfissionaisState) => {
    setFiltros(newFiltros);
  };

  const handleNovoProfissional = () => {
    setProfissionalEmEdicao(null);
    setSheetOpen(true);
  };

  const handleEditarProfissional = (profissional: Profissional) => {
    setProfissionalEmEdicao({
      id: profissional.id,
      nome: profissional.nome,
      crm: profissional.crm || '',
      email: profissional.email || '',
      telefone: profissional.telefone || '',
      potencial: profissional.potencial,
      estagioPipeline: profissional.estagioPipeline,
      especialidadeId: profissional.especialidadeId || '',
      endereco: {
        logradouro: profissional.endereco?.logradouro || '',
        numero: profissional.endereco?.numero || '',
        complemento: profissional.endereco?.complemento || '',
        bairro: profissional.endereco?.bairro || '',
        cidade: profissional.endereco?.cidade || '',
        estado: profissional.endereco?.estado || '',
        cep: profissional.endereco?.cep || '',
      },
      contatos: profissional.contatos.map((c) => ({
        tipo: c.tipo,
        valor: c.valor,
        observacao: c.observacao || '',
      })),
    });
    setSheetOpen(true);
  };

  const handleSalvarProfissional = async (data: ProfissionalFormData) => {
    const token = await session?.getToken();
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const url = data.id
      ? `${process.env.NEXT_PUBLIC_API_URL}/profissionais/${data.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/profissionais`;

    const method = data.id ? 'PUT' : 'POST';

    // Preparar dados para API
    const apiData = {
      nome: data.nome,
      crm: data.crm || undefined,
      email: data.email || undefined,
      telefone: data.telefone || undefined,
      potencial: data.potencial,
      estagioPipeline: data.estagioPipeline,
      especialidadeId: data.especialidadeId || undefined,
      endereco: Object.values(data.endereco).some((v) => v) ? data.endereco : undefined,
      contatos: data.contatos.length > 0 ? data.contatos : undefined,
    };

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar profissional');
    }

    // Recarregar lista
    fetchProfissionais(pagination.page);
  };

  const handleAvancarEstagio = async (profissional: Profissional) => {
    const token = await session?.getToken();
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const estagios: EstagioPipeline[] = ['PROSPECTADO', 'VISITADO', 'INTERESSADO', 'PRESCRITOR', 'FIDELIZADO'];
    const currentIndex = estagios.indexOf(profissional.estagioPipeline);
    const proximoEstagio = estagios[currentIndex + 1];

    if (!proximoEstagio) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profissionais/${profissional.id}/estagio`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estagioNovo: proximoEstagio }),
    });

    if (response.ok) {
      fetchProfissionais(pagination.page);
    }
  };

  const handleRetrocederEstagio = async (profissional: Profissional) => {
    const token = await session?.getToken();
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const estagios: EstagioPipeline[] = ['PROSPECTADO', 'VISITADO', 'INTERESSADO', 'PRESCRITOR', 'FIDELIZADO'];
    const currentIndex = estagios.indexOf(profissional.estagioPipeline);
    const estagioAnterior = estagios[currentIndex - 1];

    if (!estagioAnterior) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profissionais/${profissional.id}/estagio`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estagioNovo: estagioAnterior }),
    });

    if (response.ok) {
      fetchProfissionais(pagination.page);
    }
  };

  const handleToggleAtivo = async (profissional: Profissional) => {
    const token = await session?.getToken();
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const isAtivo = !profissional.deletedAt;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profissionais/${profissional.id}/ativo`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ativo: !isAtivo }),
    });

    if (response.ok) {
      fetchProfissionais(pagination.page);
    }
  };

  const handleExcluirProfissional = async (profissional: Profissional) => {
    if (!confirm(`Tem certeza que deseja excluir o profissional "${profissional.nome}"?`)) {
      return;
    }

    const token = await session?.getToken();
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profissionais/${profissional.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Erro ao excluir profissional');
      return;
    }

    fetchProfissionais(pagination.page);
  };

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
              style={{ color: item.href === '/dashboard/profissionais' ? 'rgb(var(--color-brand-500))' : 'rgb(var(--color-text))' }}
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
              Profissionais
            </h2>
            <p className="text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
              {pagination.total} profissionais cadastrados
            </p>
          </div>
        </header>

        {/* Filtros */}
        <FiltrosProfissionais filtros={filtros} onChange={handleFiltrosChange} />

        {/* Lista de profissionais */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div style={{ color: 'rgb(var(--color-text-muted))' }}>Carregando...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div style={{ color: 'rgb(239 68 68)' }}>{error}</div>
          </div>
        ) : profissionais.length === 0 ? (
          <div
            className="flex items-center justify-center rounded-lg py-12"
            style={{ backgroundColor: 'rgb(var(--color-surface-2))', border: '1px solid rgb(var(--color-border))' }}
          >
            <div style={{ color: 'rgb(var(--color-text-muted))' }}>
              Nenhum profissional encontrado
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgb(var(--color-border))' }}>
              <table className="w-full">
                <thead
                  className="text-left"
                  style={{ backgroundColor: 'rgb(var(--color-surface-2))' }}
                >
                  <tr>
                    <th className="p-4 text-sm font-medium text-slate-600 w-1/3 text-left">
                      Nome
                    </th>
                    <th className="p-4 text-sm font-medium text-slate-600 w-1/4 text-left">
                      Especialidade
                    </th>
                    <th className="p-4 text-sm font-medium text-slate-600 w-24 text-center">
                      Potencial
                    </th>
                    <th className="p-4 text-sm font-medium text-slate-600 w-28 text-center">
                      Estágio
                    </th>
                    <th className="p-4 text-sm font-medium text-slate-600 w-36 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profissionais.map((profissional) => {
                    const isAtivo = !profissional.deletedAt;
                    return (
                    <tr
                      key={profissional.id}
                      className={`border-t cursor-pointer hover:bg-black/5 transition-all duration-200 ${!isAtivo ? 'italic opacity-70 text-slate-400' : ''}`}
                      style={{ borderColor: 'rgb(var(--color-border))' }}
                    >
                      <td className="p-4 w-1/3 text-left" onClick={() => handleEditarProfissional(profissional)}>
                        <div>
                          <div className={`font-medium ${isAtivo ? 'text-slate-900' : 'text-slate-400'}`}>
                            {profissional.nome}
                          </div>
                          <div className={`text-sm ${isAtivo ? 'text-slate-500' : 'text-slate-300'}`}>
                            {profissional.crm || profissional.email || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm w-1/4 text-left" onClick={() => handleEditarProfissional(profissional)}>
                        {profissional.especialidade?.nome || '-'}
                      </td>
                      <td className="p-4 w-24 text-center">
                        <PotencialBadge potencial={profissional.potencial} />
                      </td>
                      <td className="p-4 w-28 text-center">
                        <EstagioBadge estagio={profissional.estagioPipeline} />
                      </td>
                      <td className="p-4 w-36 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRetrocederEstagio(profissional);
                              }}
                              disabled={profissional.estagioPipeline === 'PROSPECTADO' || !isAtivo}
                              title="Retroceder estágio"
                              className="group p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAvancarEstagio(profissional);
                              }}
                              disabled={profissional.estagioPipeline === 'FIDELIZADO' || !isAtivo}
                              title="Avançar estágio"
                              className="group p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                            </button>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAtivo(profissional);
                            }}
                            title={isAtivo ? 'Inativar' : 'Ativar'}
                            className="group p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                          >
                            {isAtivo ? (
                              <Power className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors duration-200" />
                            ) : (
                              <Play className="w-5 h-5 text-slate-300 group-hover:text-green-600 transition-colors duration-200" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditarProfissional(profissional);
                            }}
                            title="Editar"
                            className="group p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                          >
                            <Pencil className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExcluirProfissional(profissional);
                            }}
                            title="Excluir"
                            className="group p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors duration-200" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
                Página {pagination.page} de {pagination.totalPages} ({pagination.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Sheet de edição/criação */}
        <ProfissionalSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          profissional={profissionalEmEdicao}
          onSave={handleSalvarProfissional}
          especialidades={especialidades}
        />

        {/* FAB - Mobile and Desktop */}
        <Button
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
          style={{ backgroundColor: 'rgb(var(--accent))', borderRadius: '50%' }}
          onClick={handleNovoProfissional}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </main>
    </div>
  );
}
