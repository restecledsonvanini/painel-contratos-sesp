export type UnidadeTempoPrazo = 'DIAS' | 'MESES' | 'ANOS';

/** Soma prazo à data de início (YYYY-MM-DD) e devolve a data fim sugerida. */
export function sugerirDataFim(
  dataInicio: string,
  valor: number,
  unidade: UnidadeTempoPrazo = 'MESES',
): string | null {
  if (!dataInicio || !valor || valor <= 0) return null;
  const [y, m, d] = dataInicio.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (unidade === 'DIAS') date.setUTCDate(date.getUTCDate() + valor);
  else if (unidade === 'ANOS') date.setUTCFullYear(date.getUTCFullYear() + valor);
  else date.setUTCMonth(date.getUTCMonth() + valor);
  return date.toISOString().slice(0, 10);
}
