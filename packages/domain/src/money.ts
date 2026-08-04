/** Formatação e conversão de valores monetários em centavos (nunca float). */

export function reaisToCents(reais: number): number {
  return Math.round(reais * 100);
}

export function centsToReais(cents: number): number {
  return cents / 100;
}

export function formatCents(cents: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(centsToReais(cents));
}

export function parseReaisInput(raw: string): number | null {
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  if (!cleaned || cleaned === '-' || cleaned === '.') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return reaisToCents(value);
}
