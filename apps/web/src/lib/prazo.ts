import type { UnidadeTempo } from '@painel/domain';

/** Soma prazo à data de início (YYYY-MM-DD) e devolve a data fim sugerida. */
export function sugerirDataFim(
  dataInicio: string,
  valor: number,
  unidade: UnidadeTempo = 'MESES',
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

/** Filtro de janela de vencimento (lista de contratos / exportação). */
export function matchVencimento(dias: number | null, filtro: string): boolean {
  if (dias == null) return false;
  if (filtro === 'vencidos') return dias < 0;
  if (filtro === '0-60') return dias >= 0 && dias <= 60;
  if (filtro === '0-30') return dias >= 0 && dias <= 30;
  if (filtro === '31-60') return dias >= 31 && dias <= 60;
  if (filtro === '61-90') return dias >= 61 && dias <= 90;
  if (filtro === '91-120') return dias >= 91 && dias <= 120;
  if (filtro === '121-180') return dias >= 121 && dias <= 180;
  if (filtro === '>180') return dias > 180;
  return true;
}
