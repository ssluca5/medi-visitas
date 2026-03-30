"use client";

import { Search } from "lucide-react";
import type { PotencialPrescricao } from "./PotencialBadge";
import type { EstagioPipeline } from "./EstagioBadge";

export interface FiltrosProfissionaisState {
  busca: string;
  potencial: PotencialPrescricao | "";
  estagioPipeline: EstagioPipeline | "";
}

interface FiltrosProfissionaisProps {
  filtros: FiltrosProfissionaisState;
  onChange: (filtros: FiltrosProfissionaisState) => void;
}

export function FiltrosProfissionais({
  filtros,
  onChange,
}: FiltrosProfissionaisProps) {
  const handleChange = (
    field: keyof FiltrosProfissionaisState,
    value: string,
  ) => {
    onChange({ ...filtros, [field]: value });
  };

  return (
    <div
      className="mb-6 flex flex-col gap-4 rounded-lg p-4 sm:flex-row"
      style={{
        backgroundColor: "rgb(var(--color-surface-2))",
        border: "1px solid rgb(var(--color-border))",
      }}
    >
      {/* Busca textual */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: "rgb(var(--color-text-muted))" }}
        />
        <input
          type="text"
          placeholder="Buscar por nome, CRM ou email..."
          value={filtros.busca}
          onChange={(e) => handleChange("busca", e.target.value)}
          className="w-full rounded-md border py-2 pl-10 pr-4 text-sm"
          style={{
            backgroundColor: "rgb(var(--color-surface))",
            borderColor: "rgb(var(--color-border))",
            color: "rgb(var(--color-text))",
          }}
        />
      </div>

      {/* Select potencial */}
      <select
        value={filtros.potencial}
        onChange={(e) => handleChange("potencial", e.target.value)}
        className="rounded-md border py-2 px-3 text-sm"
        style={{
          backgroundColor: "rgb(var(--color-surface))",
          borderColor: "rgb(var(--color-border))",
          color: "rgb(var(--color-text))",
        }}
      >
        <option value="">Todos os potenciais</option>
        <option value="BAIXO">Baixo</option>
        <option value="MEDIO">Médio</option>
        <option value="ALTO">Alto</option>
        <option value="ESTRATEGICO">Estratégico</option>
      </select>

      {/* Select estágio */}
      <select
        value={filtros.estagioPipeline}
        onChange={(e) => handleChange("estagioPipeline", e.target.value)}
        className="rounded-md border py-2 px-3 text-sm"
        style={{
          backgroundColor: "rgb(var(--color-surface))",
          borderColor: "rgb(var(--color-border))",
          color: "rgb(var(--color-text))",
        }}
      >
        <option value="">Todos os estágios</option>
        <option value="PROSPECTADO">Prospectado</option>
        <option value="VISITADO">Visitado</option>
        <option value="INTERESSADO">Interessado</option>
        <option value="PRESCRITOR">Prescritor</option>
        <option value="FIDELIZADO">Fidelizado</option>
      </select>
    </div>
  );
}
