import type { UnidadeTempo } from './enums';
import { UnidadeTempo as U } from './enums';

export function addPrazo(inicio: Date, valor: number, unidade: UnidadeTempo): Date {
  const result = new Date(inicio.getTime());
  switch (unidade) {
    case U.DIAS:
      result.setUTCDate(result.getUTCDate() + valor);
      break;
    case U.MESES:
      result.setUTCMonth(result.getUTCMonth() + valor);
      break;
    case U.ANOS:
      result.setUTCFullYear(result.getUTCFullYear() + valor);
      break;
  }
  return result;
}

export function monthsBetween(from: Date, to: Date): number {
  const years = to.getUTCFullYear() - from.getUTCFullYear();
  const months = to.getUTCMonth() - from.getUTCMonth();
  const days = to.getUTCDate() - from.getUTCDate();
  let total = years * 12 + months;
  if (days < 0) total -= 1;
  return Math.max(0, total);
}

export function diasAte(dataFim: Date, hoje = new Date()): number {
  const start = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate());
  const end = Date.UTC(dataFim.getUTCFullYear(), dataFim.getUTCMonth(), dataFim.getUTCDate());
  return Math.round((end - start) / 86_400_000);
}

export function dataFimVigenciaAtual(
  dataFimOriginal: Date,
  novasDatasFim: Array<Date | null | undefined>,
): Date {
  let atual = dataFimOriginal;
  for (const d of novasDatasFim) {
    if (d && d.getTime() > atual.getTime()) {
      atual = d;
    }
  }
  return atual;
}

export type SituacaoEfetiva = 'VIGENTE' | 'A_VENCER' | 'VENCIDO' | string;

export function situacaoEfetiva(
  situacaoDeclarada: string,
  diasAteVencimento: number,
  janelaAVencer = 60,
): SituacaoEfetiva {
  if (situacaoDeclarada !== 'VIGENTE') return situacaoDeclarada;
  if (diasAteVencimento < 0) return 'VENCIDO';
  if (diasAteVencimento <= janelaAVencer) return 'A_VENCER';
  return 'VIGENTE';
}
