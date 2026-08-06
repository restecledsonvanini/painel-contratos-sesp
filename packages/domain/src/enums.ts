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
