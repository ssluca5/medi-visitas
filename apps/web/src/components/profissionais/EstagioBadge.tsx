"use client";

type EstagioPipeline =
  | "PROSPECTADO"
  | "VISITADO"
  | "INTERESSADO"
  | "PRESCRITOR"
  | "FIDELIZADO";

interface EstagioBadgeProps {
  estagio: EstagioPipeline;
}

const estagioConfig: Record<
  EstagioPipeline,
  { label: string; bg: string; text: string }
> = {
  PROSPECTADO: {
    label: "Prospectado",
    bg: "bg-slate-100",
    text: "text-slate-700",
  },
  VISITADO: {
    label: "Visitado",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  INTERESSADO: {
    label: "Interessado",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  PRESCRITOR: {
    label: "Prescritor",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  FIDELIZADO: {
    label: "Fidelizado",
    bg: "bg-green-100",
    text: "text-green-800",
  },
};

export function EstagioBadge({ estagio }: EstagioBadgeProps) {
  const config = estagioConfig[estagio] || estagioConfig.PROSPECTADO;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

export type { EstagioPipeline };
