/** Enums estáveis de domínio — espelho dos enums Postgres do modelo alvo. */

export const PilarOrcamentario = {
  CUSTEIO: 'CUSTEIO',
  INVESTIMENTO: 'INVESTIMENTO',
  SERVICOS: 'SERVICOS',
} as const;
export type PilarOrcamentario = (typeof PilarOrcamentario)[keyof typeof PilarOrcamentario];

export const NaturezaObjeto = {
  SERVICO_CONTINUADO: 'SERVICO_CONTINUADO',
  SERVICO_NAO_CONTINUADO: 'SERVICO_NAO_CONTINUADO',
  OBRA: 'OBRA',
  SERVICO_ENGENHARIA: 'SERVICO_ENGENHARIA',
  COMPRA: 'COMPRA',
  LOCACAO_BEM_MOVEL: 'LOCACAO_BEM_MOVEL',
  LOCACAO_IMOVEL: 'LOCACAO_IMOVEL',
  SOLUCAO_TIC: 'SOLUCAO_TIC',
} as const;
export type NaturezaObjeto = (typeof NaturezaObjeto)[keyof typeof NaturezaObjeto];

export const SituacaoContrato = {
  EM_ELABORACAO: 'EM_ELABORACAO',
  ASSINADO: 'ASSINADO',
  VIGENTE: 'VIGENTE',
  SUSPENSO: 'SUSPENSO',
  RESCINDIDO: 'RESCINDIDO',
  ENCERRADO: 'ENCERRADO',
  ANULADO: 'ANULADO',
} as const;
export type SituacaoContrato = (typeof SituacaoContrato)[keyof typeof SituacaoContrato];

export const UnidadeTempo = {
  DIAS: 'DIAS',
  MESES: 'MESES',
  ANOS: 'ANOS',
} as const;
export type UnidadeTempo = (typeof UnidadeTempo)[keyof typeof UnidadeTempo];

export const PapelResponsavel = {
  GESTOR: 'GESTOR',
  GESTOR_SUBSTITUTO: 'GESTOR_SUBSTITUTO',
  FISCAL_TECNICO: 'FISCAL_TECNICO',
  FISCAL_ADMINISTRATIVO: 'FISCAL_ADMINISTRATIVO',
  FISCAL_SETORIAL: 'FISCAL_SETORIAL',
  FISCAL_SUBSTITUTO: 'FISCAL_SUBSTITUTO',
  PREPOSTO_CONTRATADA: 'PREPOSTO_CONTRATADA',
} as const;
export type PapelResponsavel = (typeof PapelResponsavel)[keyof typeof PapelResponsavel];

export const TipoAlteracao = {
  ADITIVO_PRAZO: 'ADITIVO_PRAZO',
  ADITIVO_ACRESCIMO_QUANTITATIVO: 'ADITIVO_ACRESCIMO_QUANTITATIVO',
  ADITIVO_SUPRESSAO: 'ADITIVO_SUPRESSAO',
  ADITIVO_PRAZO_VALOR: 'ADITIVO_PRAZO_VALOR',
  ADITIVO_QUALITATIVO: 'ADITIVO_QUALITATIVO',
  ADITIVO_SUBROGACAO: 'ADITIVO_SUBROGACAO',
  APOSTILAMENTO_REAJUSTE: 'APOSTILAMENTO_REAJUSTE',
  APOSTILAMENTO_REPACTUACAO: 'APOSTILAMENTO_REPACTUACAO',
  APOSTILAMENTO_REEQUILIBRIO: 'APOSTILAMENTO_REEQUILIBRIO',
  APOSTILAMENTO_DOTACAO: 'APOSTILAMENTO_DOTACAO',
  APOSTILAMENTO_FISCALIZACAO: 'APOSTILAMENTO_FISCALIZACAO',
  APOSTILAMENTO_CORRECAO_MATERIAL: 'APOSTILAMENTO_CORRECAO_MATERIAL',
} as const;
export type TipoAlteracao = (typeof TipoAlteracao)[keyof typeof TipoAlteracao];

export const SituacaoAlteracao = {
  MINUTA: 'MINUTA',
  ASSINADO: 'ASSINADO',
  PUBLICADO: 'PUBLICADO',
  CANCELADO: 'CANCELADO',
} as const;
export type SituacaoAlteracao = (typeof SituacaoAlteracao)[keyof typeof SituacaoAlteracao];

export const Periodicidade = {
  UNICA: 'UNICA',
  DIARIA: 'DIARIA',
  MENSAL: 'MENSAL',
  ANUAL: 'ANUAL',
} as const;
export type Periodicidade = (typeof Periodicidade)[keyof typeof Periodicidade];

/** Lista única de níveis para todas as forças (decisão Fase 9). */
export const NivelUnidade = {
  COMANDO_GERAL: 'COMANDO_GERAL',
  DIRETORIA: 'DIRETORIA',
  COMANDO_REGIONAL: 'COMANDO_REGIONAL',
  BATALHAO: 'BATALHAO',
  COMPANHIA: 'COMPANHIA',
  DELEGACIA: 'DELEGACIA',
  UNIDADE_PRISIONAL: 'UNIDADE_PRISIONAL',
  SETOR: 'SETOR',
} as const;
export type NivelUnidade = (typeof NivelUnidade)[keyof typeof NivelUnidade];

export const TipoSancao = {
  ADVERTENCIA: 'ADVERTENCIA',
  MULTA: 'MULTA',
  IMPEDIMENTO_LICITAR: 'IMPEDIMENTO_LICITAR',
  DECLARACAO_INIDONEIDADE: 'DECLARACAO_INIDONEIDADE',
} as const;
export type TipoSancao = (typeof TipoSancao)[keyof typeof TipoSancao];

export const PILAR_LABELS: Record<PilarOrcamentario, string> = {
  CUSTEIO: 'Custeio',
  INVESTIMENTO: 'Investimento',
  SERVICOS: 'Serviços',
};

export const NATUREZA_OBJETO_LABELS: Record<NaturezaObjeto, string> = {
  SERVICO_CONTINUADO: 'Serviço continuado',
  SERVICO_NAO_CONTINUADO: 'Serviço não continuado',
  OBRA: 'Obra',
  SERVICO_ENGENHARIA: 'Serviço de engenharia',
  COMPRA: 'Compra',
  LOCACAO_BEM_MOVEL: 'Locação de bem móvel',
  LOCACAO_IMOVEL: 'Locação de imóvel',
  SOLUCAO_TIC: 'Solução de TIC',
};

export const SITUACAO_CONTRATO_LABELS: Record<SituacaoContrato, string> = {
  EM_ELABORACAO: 'Em elaboração',
  ASSINADO: 'Assinado',
  VIGENTE: 'Vigente',
  SUSPENSO: 'Suspenso',
  RESCINDIDO: 'Rescindido',
  ENCERRADO: 'Encerrado',
  ANULADO: 'Anulado',
};

export const TIPO_ALTERACAO_LABELS: Record<TipoAlteracao, string> = {
  ADITIVO_PRAZO: 'Aditivo de prazo',
  ADITIVO_ACRESCIMO_QUANTITATIVO: 'Aditivo de acréscimo',
  ADITIVO_SUPRESSAO: 'Aditivo de supressão',
  ADITIVO_PRAZO_VALOR: 'Aditivo de prazo e valor',
  ADITIVO_QUALITATIVO: 'Aditivo qualitativo',
  ADITIVO_SUBROGACAO: 'Aditivo de sub-rogação',
  APOSTILAMENTO_REAJUSTE: 'Apostilamento — reajuste',
  APOSTILAMENTO_REPACTUACAO: 'Apostilamento — repactuação',
  APOSTILAMENTO_REEQUILIBRIO: 'Apostilamento — reequilíbrio',
  APOSTILAMENTO_DOTACAO: 'Apostilamento — dotação',
  APOSTILAMENTO_FISCALIZACAO: 'Apostilamento — fiscalização',
  APOSTILAMENTO_CORRECAO_MATERIAL: 'Apostilamento — correção material',
};

export const TIPO_SANCAO_LABELS: Record<TipoSancao, string> = {
  ADVERTENCIA: 'Advertência',
  MULTA: 'Multa',
  IMPEDIMENTO_LICITAR: 'Impedimento de licitar',
  DECLARACAO_INIDONEIDADE: 'Declaração de inidoneidade',
};

export const NIVEL_UNIDADE_LABELS: Record<NivelUnidade, string> = {
  COMANDO_GERAL: 'Comando geral',
  DIRETORIA: 'Diretoria',
  COMANDO_REGIONAL: 'Comando regional',
  BATALHAO: 'Batalhão',
  COMPANHIA: 'Companhia',
  DELEGACIA: 'Delegacia',
  UNIDADE_PRISIONAL: 'Unidade prisional',
  SETOR: 'Setor',
};

export function enumOptions<T extends string>(
  labels: Record<T, string>,
): Array<{ value: T; label: string }> {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
