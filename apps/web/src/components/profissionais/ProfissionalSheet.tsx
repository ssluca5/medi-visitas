'use client'

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { PotencialPrescricao } from './PotencialBadge';
import type { EstagioPipeline } from './EstagioBadge';

export interface ProfissionalFormData {
  id?: string;
  nome: string;
  crm: string;
  email: string;
  telefone: string;
  potencial: PotencialPrescricao;
  estagioPipeline: EstagioPipeline;
  especialidadeId: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contatos: Array<{
    tipo: 'TELEFONE' | 'EMAIL' | 'WHATSAPP' | 'OUTRO';
    valor: string;
    observacao: string;
  }>;
}

interface EspecialidadeOption {
  id: string;
  nome: string;
  categoria: string;
}

interface ProfissionalSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional?: ProfissionalFormData | null;
  onSave: (data: ProfissionalFormData) => Promise<void>;
  especialidades?: EspecialidadeOption[];
}

// Especialidades agrupadas por categoria
const especialidadesPorCategoria = {
  'Médicos': [
    { id: 'medicos-clinico-geral', nome: 'Clínico Geral' },
    { id: 'medicos-cardiologia', nome: 'Cardiologia' },
    { id: 'medicos-dermatologia', nome: 'Dermatologia' },
    { id: 'medicos-endocrinologia', nome: 'Endocrinologia' },
    { id: 'medicos-gastroenterologia', nome: 'Gastroenterologia' },
    { id: 'medicos-neurologia', nome: 'Neurologia' },
    { id: 'medicos-oncologia', nome: 'Oncologia' },
    { id: 'medicos-ortopedia', nome: 'Ortopedia' },
    { id: 'medicos-pediatria', nome: 'Pediatria' },
    { id: 'medicos-psiquiatria', nome: 'Psiquiatria' },
    { id: 'medicos-reumatologia', nome: 'Reumatologia' },
    { id: 'medicos-urologia', nome: 'Urologia' },
  ],
  'Farmácia': [
    { id: 'farmacia-farmacia-clinica', nome: 'Farmácia Clínica' },
    { id: 'farmacia-farmacia-hospitalar', nome: 'Farmácia Hospitalar' },
    { id: 'farmacia-farmacia-magistral', nome: 'Farmácia Magistral' },
    { id: 'farmacia-farmacia-oncologica', nome: 'Farmácia Oncológica' },
  ],
  'Odontologia': [
    { id: 'odontologia-cirurgia-bucomaxilofacial', nome: 'Cirurgia Bucomaxilofacial' },
    { id: 'odontologia-endodontia', nome: 'Endodontia' },
    { id: 'odontologia-implantodontia', nome: 'Implantodontia' },
    { id: 'odontologia-odontopediatria', nome: 'Odontopediatria' },
    { id: 'odontologia-ortodontia', nome: 'Ortodontia' },
    { id: 'odontologia-periodontia', nome: 'Periodontia' },
  ],
};

const emptyFormData: ProfissionalFormData = {
  nome: '',
  crm: '',
  email: '',
  telefone: '',
  potencial: 'MEDIO',
  estagioPipeline: 'PROSPECTADO',
  especialidadeId: '',
  endereco: {
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  },
  contatos: [],
};

export function ProfissionalSheet({ open, onOpenChange, profissional, onSave, especialidades = [] }: ProfissionalSheetProps) {
  const [formData, setFormData] = useState<ProfissionalFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('dadosPessoais');

  // Agrupar especialidades por categoria
  const especialidadesPorCategoria = especialidades.reduce((acc, esp) => {
    if (!acc[esp.categoria]) {
      acc[esp.categoria] = [];
    }
    acc[esp.categoria].push(esp);
    return acc;
  }, {} as Record<string, EspecialidadeOption[]>);

  useEffect(() => {
    if (profissional) {
      setFormData({
        ...profissional,
        endereco: profissional.endereco || emptyFormData.endereco,
        contatos: profissional.contatos || [],
      });
    } else {
      setFormData(emptyFormData);
    }
  }, [profissional, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleAddContato = () => {
    setFormData({
      ...formData,
      contatos: [
        ...formData.contatos,
        { tipo: 'TELEFONE', valor: '', observacao: '' },
      ],
    });
  };

  const handleRemoveContato = (index: number) => {
    setFormData({
      ...formData,
      contatos: formData.contatos.filter((_, i) => i !== index),
    });
  };

  const handleContatoChange = (index: number, field: string, value: string) => {
    const newContatos = [...formData.contatos];
    newContatos[index] = { ...newContatos[index], [field]: value };
    setFormData({ ...formData, contatos: newContatos });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        style={{
          backgroundColor: 'rgb(var(--color-surface))',
          width: 'min(640px, 100vw)',
        }}
        className="overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          {/* Header */}
          <div className="mb-6">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              {profissional ? 'Editar Profissional' : 'Novo Profissional'}
            </h2>
          </div>

          {/* Seções colapsáveis */}
          <div className="flex-1 space-y-4 overflow-y-auto pb-20">
            {/* Dados Pessoais */}
            <Section
              title="Dados Pessoais"
              expanded={expandedSection === 'dadosPessoais'}
              onToggle={() => toggleSection('dadosPessoais')}
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    CRM
                  </label>
                  <input
                    type="text"
                    value={formData.crm}
                    onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  />
                </div>
              </div>
            </Section>

            {/* Especialidade */}
            <Section
              title="Especialidade"
              expanded={expandedSection === 'especialidade'}
              onToggle={() => toggleSection('especialidade')}
            >
              <div>
                <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                  Especialidade
                </label>
                <select
                  value={formData.especialidadeId}
                  onChange={(e) => setFormData({ ...formData, especialidadeId: e.target.value })}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  style={{ color: '#0F172A' }}
                >
                  <option value="">Selecione uma especialidade</option>
                  {Object.entries(especialidadesPorCategoria).map(([categoria, specs]) => (
                    <optgroup key={categoria} label={categoria}>
                      {specs.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.nome}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </Section>

            {/* Potencial e Estágio */}
            <Section
              title="Classificação"
              expanded={expandedSection === 'classificacao'}
              onToggle={() => toggleSection('classificacao')}
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    Potencial de Prescrição
                  </label>
                  <select
                    value={formData.potencial}
                    onChange={(e) => setFormData({ ...formData, potencial: e.target.value as PotencialPrescricao })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  >
                    <option value="BAIXO">Baixo</option>
                    <option value="MEDIO">Médio</option>
                    <option value="ALTO">Alto</option>
                    <option value="ESTRATEGICO">Estratégico</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    Estágio do Pipeline
                  </label>
                  <select
                    value={formData.estagioPipeline}
                    onChange={(e) => setFormData({ ...formData, estagioPipeline: e.target.value as EstagioPipeline })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  >
                    <option value="PROSPECTADO">Prospectado</option>
                    <option value="VISITADO">Visitado</option>
                    <option value="INTERESSADO">Interessado</option>
                    <option value="PRESCRITOR">Prescritor</option>
                    <option value="FIDELIZADO">Fidelizado</option>
                  </select>
                </div>
              </div>
            </Section>

            {/* Endereço */}
            <Section
              title="Endereço"
              expanded={expandedSection === 'endereco'}
              onToggle={() => toggleSection('endereco')}
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    Logradouro
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.logradouro}
                    onChange={(e) => setFormData({
                      ...formData,
                      endereco: { ...formData.endereco, logradouro: e.target.value }
                    })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                      Número
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.numero}
                      onChange={(e) => setFormData({
                        ...formData,
                        endereco: { ...formData.endereco, numero: e.target.value }
                      })}
                      className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ color: '#0F172A' }}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.complemento}
                      onChange={(e) => setFormData({
                        ...formData,
                        endereco: { ...formData.endereco, complemento: e.target.value }
                      })}
                      className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ color: '#0F172A' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.bairro}
                    onChange={(e) => setFormData({
                      ...formData,
                      endereco: { ...formData.endereco, bairro: e.target.value }
                    })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.cidade}
                      onChange={(e) => setFormData({
                        ...formData,
                        endereco: { ...formData.endereco, cidade: e.target.value }
                      })}
                      className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ color: '#0F172A' }}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                      Estado
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.estado}
                      onChange={(e) => setFormData({
                        ...formData,
                        endereco: { ...formData.endereco, estado: e.target.value }
                      })}
                      className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ color: '#0F172A' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-normal" style={{ color: '#475569' }}>
                    CEP
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.cep}
                    onChange={(e) => setFormData({
                      ...formData,
                      endereco: { ...formData.endereco, cep: e.target.value }
                    })}
                    className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    style={{ color: '#0F172A' }}
                  />
                </div>
              </div>
            </Section>

            {/* Contatos */}
            <Section
              title="Contatos"
              expanded={expandedSection === 'contatos'}
              onToggle={() => toggleSection('contatos')}
            >
              <div className="space-y-4">
                {formData.contatos.map((contato, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <select
                        value={contato.tipo}
                        onChange={(e) => handleContatoChange(index, 'tipo', e.target.value)}
                        className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        style={{ color: '#0F172A' }}
                      >
                        <option value="TELEFONE">Telefone</option>
                        <option value="EMAIL">Email</option>
                        <option value="WHATSAPP">WhatsApp</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Valor"
                        value={contato.valor}
                        onChange={(e) => handleContatoChange(index, 'valor', e.target.value)}
                        className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        style={{ color: '#0F172A' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveContato(index)}
                      className="mt-2 rounded-md p-2 hover:bg-black/5"
                      style={{ color: 'rgb(var(--color-text-muted))' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddContato}
                  className="w-full"
                  style={{ borderColor: 'rgb(var(--color-border))' }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Contato
                </Button>
              </div>
            </Section>
          </div>

          {/* Footer com botão salvar */}
          <div
            className="absolute bottom-0 left-0 right-0 border-t p-4"
            style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}
          >
            <Button
              type="submit"
              disabled={saving || !formData.nome.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// Componente auxiliar para seções colapsáveis
interface SectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, expanded, onToggle, children }: SectionProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left cursor-pointer transition-colors duration-200 hover:bg-slate-100"
        style={{ minHeight: '44px' }}
      >
        <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text))' }}>
          {title}
        </span>
        <span style={{ color: 'rgb(var(--color-text-muted))' }}>
          {expanded ? '−' : '+'}
        </span>
      </button>
      <div className="border-b border-gray-200" />
      {expanded && <div className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
}
