import type { NaturezaObjeto, TipoAlteracao } from './enums';
import { NaturezaObjeto as N, TipoAlteracao as T } from './enums';
import { monthsBetween, dataFimVigenciaAtual } from './vigencia';

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

const TIPOS_PRAZO: TipoAlteracao[] = [T.ADITIVO_PRAZO, T.ADITIVO_PRAZO_VALOR];
const TIPOS_VALOR: TipoAlteracao[] = [
  T.ADITIVO_ACRESCIMO_QUANTITATIVO,
  T.ADITIVO_SUPRESSAO,
  T.ADITIVO_PRAZO_VALOR,
];

export function isAditivoPrazo(tipo: TipoAlteracao) {
  return TIPOS_PRAZO.includes(tipo);
}

export function isAditivoValor(tipo: TipoAlteracao) {
  return TIPOS_VALOR.includes(tipo);
}

export function isApostilamento(tipo: TipoAlteracao) {
  return String(tipo).startsWith('APOSTILAMENTO_');
}

export type SimulacaoAlteracaoInput = {
  tipo: TipoAlteracao;
  naturezaObjeto: NaturezaObjeto;
  reforma?: boolean;
  prorrogavel: boolean;
  limiteProrrogacaoMeses: number | null;
  dataFimVigenciaOriginal: Date;
  novasDatasFimExistentes: Array<Date | null | undefined>;
  valorGlobalOriginalCents: number;
  valorAcrescidoAtualCents: number;
  valorSuprimidoAtualCents: number;
  valorAcrescidoNovoCents: number;
  valorSuprimidoNovoCents: number;
  novaDataFimVigencia?: Date | null;
  justificativaExcepcional?: string | null;
};

export type SimulacaoAlteracaoResult = {
  ok: boolean;
  erros: string[];
  avisos: string[];
  acrescimo: SimulacaoLimite;
  percentualSuprimido: number;
  mesesProrrogados: number;
  dataFimVigenciaAtual: string;
  dataFimVigenciaProjetada: string | null;
  exigeJustificativaExcepcional: boolean;
};

export function simularAlteracao(input: SimulacaoAlteracaoInput): SimulacaoAlteracaoResult {
  const erros: string[] = [];
  const avisos: string[] = [];
  const reforma = input.reforma ?? false;

  const fimAtual = dataFimVigenciaAtual(
    input.dataFimVigenciaOriginal,
    input.novasDatasFimExistentes,
  );

  let dataFimProjetada: Date | null = null;
  let mesesProrrogados = monthsBetween(input.dataFimVigenciaOriginal, fimAtual);

  if (isApostilamento(input.tipo)) {
    if (input.valorAcrescidoNovoCents > 0 || input.valorSuprimidoNovoCents > 0) {
      erros.push('Apostilamento não pode alterar valor global por acréscimo/supressão');
    }
    if (input.novaDataFimVigencia) {
      erros.push('Apostilamento não pode alterar prazo de vigência');
    }
  }

  if (isAditivoPrazo(input.tipo)) {
    if (!input.novaDataFimVigencia) {
      erros.push('Aditivo de prazo exige novaDataFimVigencia');
    } else if (!input.prorrogavel) {
      erros.push('Contrato não é prorrogável');
    } else if (input.novaDataFimVigencia.getTime() <= fimAtual.getTime()) {
      erros.push('novaDataFimVigencia deve ser posterior à vigência atual');
    } else {
      dataFimProjetada = input.novaDataFimVigencia;
      mesesProrrogados = monthsBetween(
        input.dataFimVigenciaOriginal,
        input.novaDataFimVigencia,
      );
      if (
        input.limiteProrrogacaoMeses != null &&
        mesesProrrogados > input.limiteProrrogacaoMeses &&
        !input.justificativaExcepcional?.trim()
      ) {
        erros.push(
          `Prorrogação acumulada (${mesesProrrogados} meses) excede limite (${input.limiteProrrogacaoMeses}) — justificativaExcepcional obrigatória`,
        );
      }
    }
  }

  const acrescimo = simularAcrescimo(
    input.valorGlobalOriginalCents,
    input.valorAcrescidoAtualCents,
    isAditivoValor(input.tipo) ? input.valorAcrescidoNovoCents : 0,
    input.naturezaObjeto,
    reforma,
  );

  const suprimidoAcumulado =
    input.valorSuprimidoAtualCents +
    (isAditivoValor(input.tipo) ? input.valorSuprimidoNovoCents : 0);
  const percentualSuprimido = percentualAcrescido(
    input.valorGlobalOriginalCents,
    suprimidoAcumulado,
  );

  if (isAditivoValor(input.tipo)) {
    if (acrescimo.excedeu && !input.justificativaExcepcional?.trim()) {
      erros.push(
        `Acréscimo acumulado (${acrescimo.percentualAcrescido.toFixed(2)}%) excede limite (${acrescimo.limitePercent}%) — justificativaExcepcional obrigatória`,
      );
    }
    if (percentualSuprimido > 25 + 1e-9 && !input.justificativaExcepcional?.trim()) {
      erros.push(
        `Supressão acumulada (${percentualSuprimido.toFixed(2)}%) excede 25% — justificativaExcepcional obrigatória`,
      );
    }
  }

  if (acrescimo.percentualAcrescido > acrescimo.limitePercent * 0.8) {
    avisos.push('Acréscimo próximo do limite legal');
  }

  const exigeJustificativaExcepcional =
    acrescimo.exigeJustificativaExcepcional ||
    percentualSuprimido > 25 ||
    (input.limiteProrrogacaoMeses != null && mesesProrrogados > input.limiteProrrogacaoMeses);

  return {
    ok: erros.length === 0,
    erros,
    avisos,
    acrescimo,
    percentualSuprimido,
    mesesProrrogados,
    dataFimVigenciaAtual: fimAtual.toISOString().slice(0, 10),
    dataFimVigenciaProjetada: dataFimProjetada
      ? dataFimProjetada.toISOString().slice(0, 10)
      : null,
    exigeJustificativaExcepcional,
  };
}
