import { formatCents } from './money';
import type { UnidadeTempo } from './enums';
import { UnidadeTempo as U } from './enums';

export { formatCents };

export function formatDateISO(iso: string | Date | null | undefined, locale = 'pt-BR'): string {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(d);
}

export function formatPrazo(valor: number, unidade: UnidadeTempo): string {
  const labels: Record<UnidadeTempo, [string, string]> = {
    [U.DIAS]: ['dia', 'dias'],
    [U.MESES]: ['mês', 'meses'],
    [U.ANOS]: ['ano', 'anos'],
  };
  const [sing, plur] = labels[unidade];
  return `${valor} ${valor === 1 ? sing : plur}`;
}

export function formatPercent(value: number, digits = 2, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100);
}

export function formatDiasAteVencimento(dias: number): string {
  if (dias < 0) return `vencido há ${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'dia' : 'dias'}`;
  if (dias === 0) return 'vence hoje';
  return `vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}

export function formatDocumento(digits: string): string {
  const d = digits.replace(/\D/g, '');
  if (d.length === 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (d.length === 14) {
    return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return digits;
}
