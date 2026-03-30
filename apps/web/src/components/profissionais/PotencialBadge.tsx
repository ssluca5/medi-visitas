'use client'

type PotencialPrescricao = 'BAIXO' | 'MEDIO' | 'ALTO' | 'ESTRATEGICO';

interface PotencialBadgeProps {
  potencial: PotencialPrescricao;
}

const potencialConfig: Record<PotencialPrescricao, { label: string; bg: string; text: string }> = {
  BAIXO: {
    label: 'Baixo',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  MEDIO: {
    label: 'Médio',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  ALTO: {
    label: 'Alto',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
  },
  ESTRATEGICO: {
    label: 'Estratégico',
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
};

export function PotencialBadge({ potencial }: PotencialBadgeProps) {
  const config = potencialConfig[potencial] || potencialConfig.MEDIO;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

export type { PotencialPrescricao };
