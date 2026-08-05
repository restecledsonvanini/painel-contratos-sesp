import { z } from 'zod';

const uuid = z.string().uuid();

export const TipoAlteracaoSchema = z.enum([
  'ADITIVO_PRAZO',
  'ADITIVO_ACRESCIMO_QUANTITATIVO',
  'ADITIVO_SUPRESSAO',
  'ADITIVO_PRAZO_VALOR',
  'ADITIVO_QUALITATIVO',
  'ADITIVO_SUBROGACAO',
  'APOSTILAMENTO_REAJUSTE',
  'APOSTILAMENTO_REPACTUACAO',
  'APOSTILAMENTO_REEQUILIBRIO',
  'APOSTILAMENTO_DOTACAO',
  'APOSTILAMENTO_FISCALIZACAO',
  'APOSTILAMENTO_CORRECAO_MATERIAL',
]);

export const SituacaoAlteracaoSchema = z.enum([
  'MINUTA',
  'ASSINADO',
  'PUBLICADO',
  'CANCELADO',
]);

export const UnidadeTempoSchema = z.enum(['DIAS', 'MESES', 'ANOS']);

export const AlteracaoItemCreateSchema = z.object({
  itemContratoId: uuid.nullable().optional(),
  catalogoItemId: uuid.nullable().optional(),
  quantidadeDelta: z.number(),
  valorUnitarioNovo: z.number().nonnegative().optional(),
  valorUnitarioNovoCents: z.number().int().nonnegative().optional(),
  observacao: z.string().nullable().optional(),
}).transform((raw) => ({
  itemContratoId: raw.itemContratoId ?? null,
  catalogoItemId: raw.catalogoItemId ?? null,
  quantidadeDelta: raw.quantidadeDelta,
  valorUnitarioNovoCents:
    raw.valorUnitarioNovoCents ??
    (raw.valorUnitarioNovo != null ? Math.round(raw.valorUnitarioNovo * 100) : null),
  observacao: raw.observacao ?? null,
}));

export const AlteracaoContratualCreateSchema = z
  .object({
    tipo: TipoAlteracaoSchema,
    numero: z.number().int().positive().optional(),
    eProtocolo: z.string().nullable().optional(),
    objetoDescricao: z.string().min(1),
    fundamentoLegalId: uuid.nullable().optional(),
    justificativa: z.string().nullable().optional(),
    justificativaExcepcional: z.string().nullable().optional(),
    dataAssinatura: z.string().min(1),
    dataInicioEfeito: z.string().nullable().optional(),
    prazoAcrescidoValor: z.number().int().positive().nullable().optional(),
    prazoAcrescidoUnidade: UnidadeTempoSchema.nullable().optional(),
    novaDataFimVigencia: z.string().nullable().optional(),
    valorAcrescido: z.number().nonnegative().optional(),
    valorAcrescidoCents: z.number().int().nonnegative().optional(),
    valorSuprimido: z.number().nonnegative().optional(),
    valorSuprimidoCents: z.number().int().nonnegative().optional(),
    percentualReajuste: z.number().nullable().optional(),
    situacao: SituacaoAlteracaoSchema.optional(),
    codigoLegado: z.string().nullable().optional(),
    itens: z.array(AlteracaoItemCreateSchema).optional(),
  })
  .transform((raw) => ({
    tipo: raw.tipo,
    numero: raw.numero,
    eProtocolo: raw.eProtocolo ?? null,
    objetoDescricao: raw.objetoDescricao,
    fundamentoLegalId: raw.fundamentoLegalId ?? null,
    justificativa: raw.justificativa ?? null,
    justificativaExcepcional: raw.justificativaExcepcional ?? null,
    dataAssinatura: raw.dataAssinatura,
    dataInicioEfeito: raw.dataInicioEfeito ?? null,
    prazoAcrescidoValor: raw.prazoAcrescidoValor ?? null,
    prazoAcrescidoUnidade: raw.prazoAcrescidoUnidade ?? null,
    novaDataFimVigencia: raw.novaDataFimVigencia ?? null,
    valorAcrescidoCents:
      raw.valorAcrescidoCents ?? Math.round((raw.valorAcrescido ?? 0) * 100),
    valorSuprimidoCents:
      raw.valorSuprimidoCents ?? Math.round((raw.valorSuprimido ?? 0) * 100),
    percentualReajuste: raw.percentualReajuste ?? null,
    situacao: raw.situacao ?? 'MINUTA',
    codigoLegado: raw.codigoLegado ?? null,
    itens: raw.itens ?? [],
  }));

export const AlteracaoContratualUpdateSchema = z
  .object({
    tipo: TipoAlteracaoSchema.optional(),
    numero: z.number().int().positive().optional(),
    eProtocolo: z.string().nullable().optional(),
    objetoDescricao: z.string().min(1).optional(),
    fundamentoLegalId: uuid.nullable().optional(),
    justificativa: z.string().nullable().optional(),
    justificativaExcepcional: z.string().nullable().optional(),
    dataAssinatura: z.string().optional(),
    dataInicioEfeito: z.string().nullable().optional(),
    prazoAcrescidoValor: z.number().int().positive().nullable().optional(),
    prazoAcrescidoUnidade: UnidadeTempoSchema.nullable().optional(),
    novaDataFimVigencia: z.string().nullable().optional(),
    valorAcrescido: z.number().nonnegative().optional(),
    valorAcrescidoCents: z.number().int().nonnegative().optional(),
    valorSuprimido: z.number().nonnegative().optional(),
    valorSuprimidoCents: z.number().int().nonnegative().optional(),
    percentualReajuste: z.number().nullable().optional(),
    situacao: SituacaoAlteracaoSchema.optional(),
    codigoLegado: z.string().nullable().optional(),
  })
  .transform((raw) => {
    const next: Record<string, unknown> = { ...raw };
    if (raw.valorAcrescido !== undefined && raw.valorAcrescidoCents === undefined) {
      next.valorAcrescidoCents = Math.round(raw.valorAcrescido * 100);
    }
    if (raw.valorSuprimido !== undefined && raw.valorSuprimidoCents === undefined) {
      next.valorSuprimidoCents = Math.round(raw.valorSuprimido * 100);
    }
    delete next.valorAcrescido;
    delete next.valorSuprimido;
    return next;
  });

export const AlteracaoSimularSchema = AlteracaoContratualCreateSchema;

export type AlteracaoItemCreateInput = z.infer<typeof AlteracaoItemCreateSchema>;
export type AlteracaoContratualCreateInput = z.infer<typeof AlteracaoContratualCreateSchema>;
export type AlteracaoContratualUpdateInput = z.infer<typeof AlteracaoContratualUpdateSchema>;
export type AlteracaoSimularInput = z.infer<typeof AlteracaoSimularSchema>;
