export {
  formatCents,
  formatDateISO,
  formatPrazo,
  formatPercent,
  formatDiasAteVencimento,
  formatDocumento,
} from '@painel/domain';

export function formatCurrencyFromReais(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
