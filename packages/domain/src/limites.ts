import type { NaturezaObjeto } from './enums';
import { NaturezaObjeto as N } from './enums';

/** Limite de acréscimo (art. 125): 25% geral, 50% obra/engenharia em reforma. */
export function limiteAcrescimoPercent(natureza: NaturezaObjeto, reforma = false): number {
  if (reforma && (natureza === N.OBRA || natureza === N.SERVICO_ENGENHARIA)) {
    return 50;
  }
  return 25;
}

/** Limite máximo de prorrogação em meses (art. 106/107). */
export function limiteProrrogacaoMesesDefault(natureza: NaturezaObjeto): number | null {
  switch (natureza) {
    case N.SERVICO_CONTINUADO:
      return 120;
    case N.LOCACAO_IMOVEL:
      return 120;
    case N.SOLUCAO_TIC:
      return 60;
    case N.SERVICO_NAO_CONTINUADO:
    case N.COMPRA:
      return null;
    default:
      return 60;
  }
}

export function percentualAcrescido(valorOriginalCents: number, valorAcrescidoCents: number): number {
  if (valorOriginalCents <= 0) return 0;
  return (valorAcrescidoCents / valorOriginalCents) * 100;
}

export function limiteAcrescimoDisponivelCents(
  valorOriginalCents: number,
  valorAcrescidoCents: number,
  natureza: NaturezaObjeto,
  reforma = false,
): number {
  const pct = limiteAcrescimoPercent(natureza, reforma);
  const teto = Math.floor((valorOriginalCents * pct) / 100);
  return Math.max(0, teto - valorAcrescidoCents);
}

export type SimulacaoLimite = {
  percentualAcrescido: number;
  limitePercent: number;
  disponivelCents: number;
  excedeu: boolean;
  exigeJustificativaExcepcional: boolean;
};

export function simularAcrescimo(
  valorOriginalCents: number,
  valorAcrescidoAtualCents: number,
  valorAcrescidoNovoCents: number,
  natureza: NaturezaObjeto,
  reforma = false,
): SimulacaoLimite {
  const acumulado = valorAcrescidoAtualCents + valorAcrescidoNovoCents;
  const limitePercent = limiteAcrescimoPercent(natureza, reforma);
  const pct = percentualAcrescido(valorOriginalCents, acumulado);
  const disponivelCents = limiteAcrescimoDisponivelCents(
    valorOriginalCents,
    valorAcrescidoAtualCents,
    natureza,
    reforma,
  );
  const excedeu = pct > limitePercent + 1e-9;
  return {
    percentualAcrescido: pct,
    limitePercent,
    disponivelCents,
    excedeu,
    exigeJustificativaExcepcional: excedeu,
  };
}
