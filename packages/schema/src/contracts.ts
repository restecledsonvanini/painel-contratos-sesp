import { z } from 'zod';
import { ItemContratoCreateSchema } from './itens';

const uuid = z.string().uuid();

export const PilarOrcamentarioSchema = z.enum(['CUSTEIO', 'INVESTIMENTO', 'SERVICOS']);
export const NaturezaObjetoSchema = z.enum([
  'SERVICO_CONTINUADO',
  'SERVICO_NAO_CONTINUADO',
  'OBRA',
  'SERVICO_ENGENHARIA',
  'COMPRA',
  'LOCACAO_BEM_MOVEL',
  'LOCACAO_IMOVEL',
  'SOLUCAO_TIC',
]);
export const SituacaoContratoSchema = z.enum([
  'EM_ELABORACAO',
  'ASSINADO',
  'VIGENTE',
  'SUSPENSO',
  'RESCINDIDO',
  'ENCERRADO',
  'ANULADO',
]);
export const UnidadeTempoSchema = z.enum(['DIAS', 'MESES', 'ANOS']);
export const PapelResponsavelSchema = z.enum([
  'GESTOR',
  'GESTOR_SUBSTITUTO',
  'FISCAL_TECNICO',
  'FISCAL_ADMINISTRATIVO',
  'FISCAL_SETORIAL',
  'FISCAL_SUBSTITUTO',
  'PREPOSTO_CONTRATADA',
]);
export const TipoGarantiaSchema = z.enum(['NENHUMA', 'CAUCAO', 'SEGURO_GARANTIA', 'FIANCA_BANCARIA']);

const STATUS_LEGADO_TO_SITUACAO: Record<string, z.infer<typeof SituacaoContratoSchema>> = {
  vigente: 'VIGENTE',
  encerrado: 'ENCERRADO',
  suspenso: 'SUSPENSO',
  rescindido: 'RESCINDIDO',
  anulado: 'ANULADO',
  elaborado: 'EM_ELABORACAO',
  em_elaboracao: 'EM_ELABORACAO',
  assinando: 'ASSINADO',
  assinado: 'ASSINADO',
};

export const AditivoCreateSchema = z.object({
  numAditivo: z.number().int().nonnegative(),
  protocoloAdit: z.string().min(1),
  novoFimVigencia: z.string().nullable().optional(),
  valorAdicional: z.number().nonnegative().optional(),
});

export const ContratoResponsavelCreateSchema = z.object({
  servidorId: uuid,
  papel: PapelResponsavelSchema,
  atoDesignacao: z.string().nullable().optional(),
  dataInicio: z.string().min(1),
  dataFim: z.string().nullable().optional(),
});

export const ContratoRateioCreateSchema = z
  .object({
    unidadeId: uuid,
    percentual: z.number().min(0).max(100).nullable().optional(),
    valorCents: z.number().int().nonnegative().nullable().optional(),
    quantidade: z.number().nullable().optional(),
    observacao: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.percentual == null && data.valorCents == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe percentual ou valorCents',
        path: ['percentual'],
      });
    }
  });

const gestorFiscalRefine = <T extends { gestorId?: string; fiscalId?: string }>(
  data: T,
  ctx: z.RefinementCtx,
) => {
  if (data.gestorId && data.fiscalId && data.gestorId === data.fiscalId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'gestorId and fiscalId must be different',
      path: ['fiscalId'],
    });
  }
};

export const ContractCreateSchema = z
  .object({
    processoId: uuid.nullable().optional(),
    numeroGms: z.union([z.string().min(1), z.number().int().nonnegative()]).optional(),
    /** @deprecated use numeroGms */
    numGms: z.number().int().nonnegative().optional(),
    anoGms: z.number().int().gte(2000),
    numeroContrato: z.string().nullable().optional(),
    eProtocolo: z.string().nullable().optional(),
    /** @deprecated use eProtocolo */
    protocoloCabeca: z.string().nullable().optional(),
    pilar: PilarOrcamentarioSchema.optional().default('SERVICOS'),
    categoriaContratacaoId: uuid.optional(),
    naturezaObjeto: NaturezaObjetoSchema.optional().default('SERVICO_CONTINUADO'),
    modalidadeId: uuid.optional(),
    /** código legado ou id — resolvido no service se for código */
    modalidade: z.string().min(1).optional(),
    fundamentoLegalId: uuid.nullable().optional(),
    objeto: z.string().min(1),
    fornecedorId: uuid.optional(),
    empresaId: uuid.optional(),
    unidadeGestoraId: uuid.optional(),
    /** @deprecated use unidadeGestoraId */
    unidadeFspId: uuid.optional(),
    dataAssinatura: z.string().nullish(),
    dataInicioVigencia: z.string().nullish(),
    /** @deprecated */
    dataInicio: z.string().nullish(),
    prazoInicialValor: z.number().int().positive().optional(),
    prazoInicialUnidade: UnidadeTempoSchema.optional().default('MESES'),
    dataFimVigenciaOriginal: z.string().nullish(),
    /** @deprecated */
    dataFimOrig: z.string().nullish(),
    prorrogavel: z.boolean().optional().default(true),
    limiteProrrogacaoMeses: z.number().int().nullable().optional(),
    valorGlobalOriginal: z.number().nonnegative().optional(),
    /** @deprecated use valorGlobalOriginal */
    valorAnual: z.number().nonnegative().optional(),
    indiceReajuste: z.string().nullable().optional(),
    mesAniversarioReajuste: z.number().int().min(1).max(12).nullable().optional(),
    situacao: SituacaoContratoSchema.optional(),
    /** @deprecated use situacao */
    status: z.string().optional(),
    garantiaTipo: TipoGarantiaSchema.nullable().optional(),
    garantiaValorCents: z.number().int().nonnegative().nullable().optional(),
    garantiaValidade: z.string().nullish(),
    observacoes: z.string().nullable().optional(),
    codigoLegado: z.string().nullable().optional(),
    gestorId: uuid.optional(),
    fiscalId: uuid.optional(),
    responsaveis: z.array(ContratoResponsavelCreateSchema).optional(),
    rateios: z.array(ContratoRateioCreateSchema).optional(),
    itens: z.array(ItemContratoCreateSchema).optional(),
    aditivos: z.array(AditivoCreateSchema).optional(),
  })
  .superRefine((data, ctx) => {
    gestorFiscalRefine(data, ctx);
    if (!data.fornecedorId && !data.empresaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'fornecedorId é obrigatório',
        path: ['fornecedorId'],
      });
    }
    if (!data.unidadeGestoraId && !data.unidadeFspId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'unidadeGestoraId é obrigatório',
        path: ['unidadeGestoraId'],
      });
    }
    if (data.numeroGms == null && data.numGms == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'numeroGms é obrigatório',
        path: ['numeroGms'],
      });
    }
    if (data.valorGlobalOriginal == null && data.valorAnual == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'valorGlobalOriginal é obrigatório',
        path: ['valorGlobalOriginal'],
      });
    }
    if (!data.modalidadeId && !data.modalidade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'modalidadeId ou modalidade é obrigatório',
        path: ['modalidadeId'],
      });
    }
    const inicio = data.dataInicioVigencia || data.dataInicio;
    const fim = data.dataFimVigenciaOriginal || data.dataFimOrig;
    if (!inicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'dataInicioVigencia é obrigatória',
        path: ['dataInicioVigencia'],
      });
    }
    if (!fim) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'dataFimVigenciaOriginal é obrigatória',
        path: ['dataFimVigenciaOriginal'],
      });
    }
  })
  .transform((raw) => {
    const valor =
      raw.valorGlobalOriginal != null
        ? Math.round(raw.valorGlobalOriginal * 100)
        : Math.round((raw.valorAnual ?? 0) * 100);
    const inicio = (raw.dataInicioVigencia || raw.dataInicio)!;
    const fim = (raw.dataFimVigenciaOriginal || raw.dataFimOrig)!;
    const situacao =
      raw.situacao ||
      (raw.status ? STATUS_LEGADO_TO_SITUACAO[raw.status.toLowerCase()] : undefined) ||
      'VIGENTE';

    return {
      processoId: raw.processoId ?? null,
      numeroGms: String(raw.numeroGms ?? raw.numGms),
      anoGms: raw.anoGms,
      numeroContrato: raw.numeroContrato ?? null,
      eProtocolo: raw.eProtocolo ?? raw.protocoloCabeca ?? null,
      pilar: raw.pilar,
      categoriaContratacaoId: raw.categoriaContratacaoId ?? null,
      naturezaObjeto: raw.naturezaObjeto,
      modalidadeId: raw.modalidadeId ?? null,
      modalidadeCodigo: raw.modalidadeId ? null : raw.modalidade ?? null,
      fundamentoLegalId: raw.fundamentoLegalId ?? null,
      objeto: raw.objeto,
      fornecedorId: (raw.fornecedorId ?? raw.empresaId)!,
      unidadeGestoraId: raw.unidadeGestoraId ?? null,
      unidadeFspIdLegacy: raw.unidadeGestoraId ? null : raw.unidadeFspId ?? null,
      dataAssinatura: raw.dataAssinatura || null,
      dataInicioVigencia: inicio,
      prazoInicialValor: raw.prazoInicialValor ?? null,
      prazoInicialUnidade: raw.prazoInicialUnidade,
      dataFimVigenciaOriginal: fim,
      prorrogavel: raw.prorrogavel,
      limiteProrrogacaoMeses: raw.limiteProrrogacaoMeses ?? null,
      valorGlobalOriginalCents: valor,
      indiceReajuste: raw.indiceReajuste ?? null,
      mesAniversarioReajuste: raw.mesAniversarioReajuste ?? null,
      situacao,
      garantiaTipo: raw.garantiaTipo ?? null,
      garantiaValorCents: raw.garantiaValorCents ?? null,
      garantiaValidade: raw.garantiaValidade || null,
      observacoes: raw.observacoes ?? null,
      codigoLegado: raw.codigoLegado ?? null,
      gestorId: raw.gestorId ?? null,
      fiscalId: raw.fiscalId ?? null,
      responsaveis: raw.responsaveis,
      rateios: raw.rateios,
      itens: raw.itens,
      aditivos: raw.aditivos,
    };
  });

export const ContractUpdateSchema = z
  .object({
    processoId: uuid.nullable().optional(),
    numeroGms: z.union([z.string().min(1), z.number().int().nonnegative()]).optional(),
    numGms: z.number().int().nonnegative().optional(),
    anoGms: z.number().int().gte(2000).optional(),
    numeroContrato: z.string().nullable().optional(),
    eProtocolo: z.string().nullable().optional(),
    protocoloCabeca: z.string().nullish(),
    pilar: PilarOrcamentarioSchema.optional(),
    categoriaContratacaoId: uuid.optional(),
    naturezaObjeto: NaturezaObjetoSchema.optional(),
    modalidadeId: uuid.optional(),
    modalidade: z.string().min(1).optional(),
    fundamentoLegalId: uuid.nullable().optional(),
    objeto: z.string().min(1).optional(),
    fornecedorId: uuid.optional(),
    empresaId: uuid.optional(),
    unidadeGestoraId: uuid.optional(),
    unidadeFspId: uuid.optional(),
    dataAssinatura: z.string().nullish(),
    dataInicioVigencia: z.string().nullish(),
    dataInicio: z.string().nullish(),
    prazoInicialValor: z.number().int().positive().optional(),
    prazoInicialUnidade: UnidadeTempoSchema.optional(),
    dataFimVigenciaOriginal: z.string().nullish(),
    dataFimOrig: z.string().nullish(),
    prorrogavel: z.boolean().optional(),
    limiteProrrogacaoMeses: z.number().int().nullable().optional(),
    valorGlobalOriginal: z.number().nonnegative().optional(),
    valorAnual: z.number().nonnegative().optional(),
    valorAnualCents: z.number().int().nonnegative().optional(),
    indiceReajuste: z.string().nullable().optional(),
    mesAniversarioReajuste: z.number().int().min(1).max(12).nullable().optional(),
    situacao: SituacaoContratoSchema.optional(),
    status: z.string().optional(),
    garantiaTipo: TipoGarantiaSchema.nullable().optional(),
    garantiaValorCents: z.number().int().nonnegative().nullable().optional(),
    garantiaValidade: z.string().nullish(),
    observacoes: z.string().nullable().optional(),
    gestorId: uuid.optional(),
    fiscalId: uuid.optional(),
  })
  .superRefine(gestorFiscalRefine)
  .transform((raw) => {
    const next: Record<string, unknown> = {};
    if (raw.processoId !== undefined) next.processoId = raw.processoId;
    if (raw.numeroGms !== undefined || raw.numGms !== undefined) {
      next.numeroGms = String(raw.numeroGms ?? raw.numGms);
    }
    if (raw.anoGms !== undefined) next.anoGms = raw.anoGms;
    if (raw.numeroContrato !== undefined) next.numeroContrato = raw.numeroContrato;
    if (raw.eProtocolo !== undefined || raw.protocoloCabeca !== undefined) {
      next.eProtocolo = raw.eProtocolo ?? raw.protocoloCabeca ?? null;
    }
    if (raw.pilar !== undefined) next.pilar = raw.pilar;
    if (raw.categoriaContratacaoId !== undefined) next.categoriaContratacaoId = raw.categoriaContratacaoId;
    if (raw.naturezaObjeto !== undefined) next.naturezaObjeto = raw.naturezaObjeto;
    if (raw.modalidadeId !== undefined) next.modalidadeId = raw.modalidadeId;
    if (raw.modalidade !== undefined) next.modalidadeCodigo = raw.modalidade;
    if (raw.fundamentoLegalId !== undefined) next.fundamentoLegalId = raw.fundamentoLegalId;
    if (raw.objeto !== undefined) next.objeto = raw.objeto;
    if (raw.fornecedorId !== undefined || raw.empresaId !== undefined) {
      next.fornecedorId = raw.fornecedorId ?? raw.empresaId;
    }
    if (raw.unidadeGestoraId !== undefined) next.unidadeGestoraId = raw.unidadeGestoraId;
    if (raw.unidadeFspId !== undefined) next.unidadeFspIdLegacy = raw.unidadeFspId;
    if (raw.dataAssinatura !== undefined) next.dataAssinatura = raw.dataAssinatura || null;
    if (raw.dataInicioVigencia !== undefined || raw.dataInicio !== undefined) {
      next.dataInicioVigencia = raw.dataInicioVigencia || raw.dataInicio || null;
    }
    if (raw.prazoInicialValor !== undefined) next.prazoInicialValor = raw.prazoInicialValor;
    if (raw.prazoInicialUnidade !== undefined) next.prazoInicialUnidade = raw.prazoInicialUnidade;
    if (raw.dataFimVigenciaOriginal !== undefined || raw.dataFimOrig !== undefined) {
      next.dataFimVigenciaOriginal = raw.dataFimVigenciaOriginal || raw.dataFimOrig || null;
    }
    if (raw.prorrogavel !== undefined) next.prorrogavel = raw.prorrogavel;
    if (raw.limiteProrrogacaoMeses !== undefined) next.limiteProrrogacaoMeses = raw.limiteProrrogacaoMeses;
    if (raw.valorGlobalOriginal !== undefined) {
      next.valorGlobalOriginalCents = Math.round(raw.valorGlobalOriginal * 100);
    } else if (raw.valorAnual !== undefined) {
      next.valorGlobalOriginalCents = Math.round(raw.valorAnual * 100);
    } else if (raw.valorAnualCents !== undefined) {
      next.valorGlobalOriginalCents = raw.valorAnualCents;
    }
    if (raw.indiceReajuste !== undefined) next.indiceReajuste = raw.indiceReajuste;
    if (raw.mesAniversarioReajuste !== undefined) next.mesAniversarioReajuste = raw.mesAniversarioReajuste;
    if (raw.situacao !== undefined) {
      next.situacao = raw.situacao;
    } else if (raw.status !== undefined) {
      next.situacao = STATUS_LEGADO_TO_SITUACAO[raw.status.toLowerCase()] ?? raw.status.toUpperCase();
    }
    if (raw.garantiaTipo !== undefined) next.garantiaTipo = raw.garantiaTipo;
    if (raw.garantiaValorCents !== undefined) next.garantiaValorCents = raw.garantiaValorCents;
    if (raw.garantiaValidade !== undefined) next.garantiaValidade = raw.garantiaValidade || null;
    if (raw.observacoes !== undefined) next.observacoes = raw.observacoes;
    if (raw.gestorId !== undefined) next.gestorId = raw.gestorId;
    if (raw.fiscalId !== undefined) next.fiscalId = raw.fiscalId;
    return next;
  });

export const UnidadeFspCreateSchema = z.object({
  sigla: z.string().min(1),
  nome: z.string().min(1),
});

export const UnidadeFspUpdateSchema = UnidadeFspCreateSchema.partial();

export const ServicoCreateSchema = z.object({
  titulo: z.string().min(1),
  descricao: z.string().optional().nullable(),
});

export const ServicoUpdateSchema = ServicoCreateSchema.partial();

/** Etapas do wizard de lançamento (front). */
export const CONTRACT_WIZARD_STEPS = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'partes', label: 'Partes' },
  { id: 'itens', label: 'Objeto e itens' },
  { id: 'vigencia', label: 'Vigência' },
  { id: 'orcamento', label: 'Orçamento' },
  { id: 'rateio', label: 'Rateio' },
  { id: 'publicidade', label: 'Publicidade' },
  { id: 'revisao', label: 'Revisão' },
] as const;

export type ContractWizardStepId = (typeof CONTRACT_WIZARD_STEPS)[number]['id'];

export const ContractStepIdentificacaoSchema = z.object({
  numGms: z.number({ invalid_type_error: 'Informe o número GMS' }).int().nonnegative(),
  anoGms: z.number({ invalid_type_error: 'Informe o ano GMS' }).int().gte(2000),
  protocoloCabeca: z.string().nullable().optional(),
  numeroContrato: z.string().nullable().optional(),
  pilar: PilarOrcamentarioSchema,
  naturezaObjeto: NaturezaObjetoSchema,
  modalidade: z.string().min(1, 'Selecione a modalidade'),
  fundamentoLegalId: z.string().uuid().nullable().optional().or(z.literal('')),
  objeto: z.string().min(1, 'Descreva o objeto'),
});

export const ContractStepPartesSchema = z
  .object({
    fornecedorId: z.string().uuid('Selecione o fornecedor'),
    unidadeGestoraId: z.string().uuid('Selecione a unidade gestora'),
    gestorId: z.string().uuid().optional().or(z.literal('')),
    fiscalId: z.string().uuid().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.gestorId && data.fiscalId && data.gestorId === data.fiscalId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Gestor e fiscal devem ser pessoas diferentes',
        path: ['fiscalId'],
      });
    }
  });

export const ContractStepVigenciaSchema = z.object({
  dataInicio: z.string().min(1, 'Informe o início da vigência'),
  dataFimOrig: z.string().min(1, 'Informe o fim original da vigência'),
  prazoInicialValor: z.number().int().positive().optional(),
  prazoInicialUnidade: UnidadeTempoSchema.optional(),
  prorrogavel: z.boolean().optional(),
  limiteProrrogacaoMeses: z.number().int().nullable().optional(),
  indiceReajuste: z.string().nullable().optional(),
  mesAniversarioReajuste: z.number().int().min(1).max(12).nullable().optional(),
});

export const ContractStepOrcamentoSchema = z.object({
  valorAnual: z.number({ invalid_type_error: 'Informe o valor global' }).nonnegative(),
});

export type ContractCreateInput = z.infer<typeof ContractCreateSchema>;
export type ContractUpdateInput = z.infer<typeof ContractUpdateSchema>;
export type AditivoCreateInput = z.infer<typeof AditivoCreateSchema>;
export type ContratoResponsavelCreateInput = z.infer<typeof ContratoResponsavelCreateSchema>;
export type ContratoRateioCreateInput = z.infer<typeof ContratoRateioCreateSchema>;
