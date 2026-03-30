'use client'

import { useState, useEffect } from 'react';
import { Plus, ChevronDown, Check } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface Especialidade {
  id: string;
  nome: string;
  categoria: string;
  ativo: boolean;
}

export interface EspecialidadeFormData {
  id?: string;
  nome: string;
  categoria: string;
}

interface EspecialidadeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  especialidade?: EspecialidadeFormData | null;
  onSave: (data: EspecialidadeFormData) => Promise<void>;
  categoriasExistentes?: string[];
}

const emptyFormData: EspecialidadeFormData = {
  nome: '',
  categoria: '',
};

// Função para formatar categoria: primeira letra maiúscula, resto minúsculo
const formatarCategoria = (categoria: string): string => {
  if (!categoria) return '';
  const lower = categoria.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export function EspecialidadeSheet({ open, onOpenChange, especialidade, onSave, categoriasExistentes: categoriasFromProps = [] }: EspecialidadeSheetProps) {
  const [formData, setFormData] = useState<EspecialidadeFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoriasExistentes, setCategoriasExistentes] = useState<string[]>([]);

  // Atualiza categorias quando recebidas do props e ordena alfabeticamente
  useEffect(() => {
    if (categoriasFromProps.length > 0) {
      const categoriasFormatadas = categoriasFromProps.map(formatarCategoria);
      setCategoriasExistentes(prev => {
        // Mescla as categorias existentes com as novas, removendo duplicatas
        const todas = [...prev, ...categoriasFormatadas];
        const unicas = [...new Set(todas)];
        // Ordena alfabeticamente
        return unicas.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      });
    }
  }, [categoriasFromProps]);

  useEffect(() => {
    if (especialidade) {
      setFormData({
        id: especialidade.id,
        nome: especialidade.nome,
        categoria: formatarCategoria(especialidade.categoria),
      });
      // Adiciona a categoria da especialidade editada às existentes se não existir
      if (especialidade.categoria && !categoriasExistentes.includes(formatarCategoria(especialidade.categoria))) {
        setCategoriasExistentes(prev => [...prev, formatarCategoria(especialidade.categoria)]);
      }
    } else {
      setFormData(emptyFormData);
    }
    setShowDropdown(false);
    setShowNewCategoryInput(false);
    setNewCategory('');
  }, [especialidade, open]);

  const handleSelectCategoria = (categoria: string) => {
    setFormData({ ...formData, categoria: formatarCategoria(categoria) });
    setShowDropdown(false);
    setShowNewCategoryInput(false);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const categoriaFormatada = formatarCategoria(newCategory.trim());
      // Adiciona a nova categoria à lista de existentes
      if (!categoriasExistentes.includes(categoriaFormatada)) {
        setCategoriasExistentes(prev => [...prev, categoriaFormatada]);
      }
      setFormData({ ...formData, categoria: categoriaFormatada });
      setShowNewCategoryInput(false);
      setNewCategory('');
    }
  };

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
              {especialidade?.id ? 'Editar Especialidade' : 'Nova Especialidade'}
            </h2>
          </div>

          {/* Form */}
          <div className="flex-1 space-y-4 pb-20">
            <div>
              <label className="mb-1 block text-sm font-normal text-slate-600">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full rounded-md border border-slate-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                placeholder="Ex: Cardiologia"
              />
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-normal text-slate-600">
                Categoria *
              </label>
              
              {/* Select customizado */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full rounded-md border border-slate-200 py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-left flex items-center justify-between cursor-pointer"
                >
                  <span className={formData.categoria ? 'text-slate-900' : 'text-slate-400'}>
                    {formData.categoria || 'Selecione uma categoria'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md border border-slate-200 shadow-lg max-h-60 overflow-auto">
                    {categoriasExistentes.map((categoria) => (
                      <button
                        key={categoria}
                        type="button"
                        onClick={() => handleSelectCategoria(categoria)}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center justify-between cursor-pointer text-slate-700"
                      >
                        {categoria}
                        {formData.categoria && formData.categoria.toLowerCase() === categoria.toLowerCase() && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                    
                    {/* Opção de adicionar nova categoria */}
                    {!showNewCategoryInput && (
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryInput(true)}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-blue-600 border-t border-slate-100"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar nova categoria
                      </button>
                    )}

                    {/* Input para nova categoria */}
                    {showNewCategoryInput && (
                      <div className="p-2 border-t border-slate-100">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Nome da nova categoria"
                          className="w-full rounded-md border border-slate-200 py-2 px-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 mb-2"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewCategory();
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddNewCategory}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Adicionar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowNewCategoryInput(false);
                              setNewCategory('');
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="absolute bottom-0 left-0 right-0 border-t p-4"
            style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}
          >
            <Button
              type="submit"
              disabled={saving || !formData.nome.trim() || !formData.categoria.trim()}
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
