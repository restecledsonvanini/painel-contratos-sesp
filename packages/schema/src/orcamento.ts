import { z } from 'zod';

const uuid = z.string().uuid();

export const TipoEmpenhoSchema = z.enum(['ORDINARIO', 'ESTIMATIVO', 'GLOBAL']);
export const SituacaoEmpenhoSchema = z.enum(['EMITIDO', 'LIQUIDADO', 'PAGO', 'ANULADO']);
export const SituacaoReservaSchema = z.enum(['ATIVA', 'BAIXADA', 'CANCELADA']);

export const DotacaoCreateSchema = z
  .object({
    exercicio: z.number().int().gte(2000),
    codigo: z.string().min(1),
    unidadeOrcamentaria: z.string().nullable().optional(),
    funcionalProgramatica: z.string().nullable().optional(),
    naturezaDespesaId: uuid,
    fonteRecursoId: uuid,
    descricao: z.string().nullable().optional(),
  })
  .transform((raw) => ({
    ...raw,
    unidadeOrcamentaria: raw.unidadeOrcamentaria ?? null,
    funcionalProgramatica: raw.funcionalProgramatica ?? null,
    descricao: raw.descricao ?? null,
  }));

export const DotacaoUpdateSchema = z.object({
  exercicio: z.number().int().gte(2000).optional(),
  codigo: z.string().min(1).optional(),
  unidadeOrcamentaria: z.string().nullable().optional(),
  funcionalProgramatica: z.string().nullable().optional(),
  naturezaDespesaId: uuid.optional(),
  fonteRecursoId: uuid.optional(),
  descricao: z.string().nullable().optional(),
});

export const ContratoDotacaoCreateSchema = z
  .object({
    dotacaoId: uuid,
    exercicio: z.number().int().gte(2000),
    valorPrevisto: z.number().nonnegative().optional(),
    valorPrevistoCents: z.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.valorPrevisto == null && data.valorPrevistoCents == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'valorPrevisto é obrigatório',
        path: ['valorPrevisto'],
      });
    }
  })
  .transform((raw) => ({
    dotacaoId: raw.dotacaoId,
    exercicio: raw.exercicio,
    valorPrevistoCents:
      raw.valorPrevistoCents ?? Math.round((raw.valorPrevisto ?? 0) * 100),
  }));

export const EmpenhoCreateSchema = z
  .object({
    dotacaoId: uuid.nullable().optional(),
    numero: z.string().min(1),
    exercicio: z.number().int().gte(2000),
    tipo: TipoEmpenhoSchema.optional(),
    data: z.string().min(1),
    valor: z.number().nonnegative().optional(),
    valorCents: z.number().int().nonnegative().optional(),
    valorLiquidado: z.number().nonnegative().optional(),
    valorLiquidadoCents: z.number().int().nonnegative().optional(),
    valorPago: z.number().nonnegative().optional(),
    valorPagoCents: z.number().int().nonnegative().optional(),
    situacao: SituacaoEmpenhoSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.valor == null && data.valorCents == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'valor é obrigatório',
        path: ['valor'],
      });
    }
  })
  .transform((raw) => ({
    dotacaoId: raw.dotacaoId ?? null,
    numero: raw.numero,
    exercicio: raw.exercicio,
    tipo: raw.tipo ?? 'ORDINARIO',
    data: raw.data,
    valorCents: raw.valorCents ?? Math.round((raw.valor ?? 0) * 100),
    valorLiquidadoCents:
      raw.valorLiquidadoCents ?? Math.round((raw.valorLiquidado ?? 0) * 100),
    valorPagoCents: raw.valorPagoCents ?? Math.round((raw.valorPago ?? 0) * 100),
    situacao: raw.situacao ?? 'EMITIDO',
  }));

export const EmpenhoUpdateSchema = z
  .object({
    dotacaoId: uuid.nullable().optional(),
    numero: z.string().min(1).optional(),
    exercicio: z.number().int().gte(2000).optional(),
    tipo: TipoEmpenhoSchema.optional(),
    data: z.string().optional(),
    valor: z.number().nonnegative().optional(),
    valorCents: z.number().int().nonnegative().optional(),
    valorLiquidado: z.number().nonnegative().optional(),
    valorLiquidadoCents: z.number().int().nonnegative().optional(),
    valorPago: z.number().nonnegative().optional(),
    valorPagoCents: z.number().int().nonnegative().optional(),
    situacao: SituacaoEmpenhoSchema.optional(),
  })
  .transform((raw) => {
    const next: Record<string, unknown> = { ...raw };
    if (raw.valor !== undefined && raw.valorCents === undefined) {
      next.valorCents = Math.round(raw.valor * 100);
    }
    if (raw.valorLiquidado !== undefined && raw.valorLiquidadoCents === undefined) {
      next.valorLiquidadoCents = Math.round(raw.valorLiquidado * 100);
    }
    if (raw.valorPago !== undefined && raw.valorPagoCents === undefined) {
      next.valorPagoCents = Math.round(raw.valorPago * 100);
    }
    delete next.valor;
    delete next.valorLiquidado;
    delete next.valorPago;
    return next;
  });

export const ReservaCreateSchema = z
  .object({
    contratoId: uuid.nullable().optional(),
    processoId: uuid.nullable().optional(),
    numero: z.string().min(1),
    data: z.string().min(1),
    valor: z.number().nonnegative().optional(),
    valorCents: z.number().int().nonnegative().optional(),
    situacao: SituacaoReservaSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.valor == null && data.valorCents == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'valor é obrigatório',
        path: ['valor'],
      });
    }
  })
  .transform((raw) => ({
    contratoId: raw.contratoId ?? null,
    processoId: raw.processoId ?? null,
    numero: raw.numero,
    data: raw.data,
    valorCents: raw.valorCents ?? Math.round((raw.valor ?? 0) * 100),
    situacao: raw.situacao ?? 'ATIVA',
  }));

export const PublicacaoCreateSchema = z
  .object({
    contratoId: uuid.nullable().optional(),
    alteracaoId: uuid.nullable().optional(),
    veiculoId: uuid.optional(),
    veiculoCodigo: z.string().optional(),
    dataPublicacao: z.string().min(1),
    numeroEdicao: z.string().nullable().optional(),
    idPncp: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const hasC = Boolean(data.contratoId);
    const hasA = Boolean(data.alteracaoId);
    if (hasC === hasA) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe exatamente um de contratoId ou alteracaoId',
        path: ['contratoId'],
      });
    }
    if (!data.veiculoId && !data.veiculoCodigo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'veiculoId ou veiculoCodigo é obrigatório',
        path: ['veiculoId'],
      });
    }
  })
  .transform((raw) => ({
    contratoId: raw.contratoId ?? null,
    alteracaoId: raw.alteracaoId ?? null,
    veiculoId: raw.veiculoId ?? null,
    veiculoCodigo: raw.veiculoCodigo ?? null,
    dataPublicacao: raw.dataPublicacao,
    numeroEdicao: raw.numeroEdicao ?? null,
    idPncp: raw.idPncp ?? null,
    url: raw.url ?? null,
  }));

export const DocumentoCreateSchema = z
  .object({
    contratoId: uuid.nullable().optional(),
    alteracaoId: uuid.nullable().optional(),
    processoId: uuid.nullable().optional(),
    tipoDocumentoId: uuid.optional(),
    tipoDocumentoCodigo: z.string().optional(),
    nome: z.string().min(1),
    storageKey: z.string().nullable().optional(),
    urlExterna: z.string().nullable().optional(),
    mimeType: z.string().nullable().optional(),
    tamanhoBytes: z.number().int().nonnegative().nullable().optional(),
    uploadedById: uuid.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.tipoDocumentoId && !data.tipoDocumentoCodigo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'tipoDocumentoId ou tipoDocumentoCodigo é obrigatório',
        path: ['tipoDocumentoId'],
      });
    }
  })
  .transform((raw) => ({
    contratoId: raw.contratoId ?? null,
    alteracaoId: raw.alteracaoId ?? null,
    processoId: raw.processoId ?? null,
    tipoDocumentoId: raw.tipoDocumentoId ?? null,
    tipoDocumentoCodigo: raw.tipoDocumentoCodigo ?? null,
    nome: raw.nome,
    storageKey: raw.storageKey ?? null,
    urlExterna: raw.urlExterna ?? null,
    mimeType: raw.mimeType ?? null,
    tamanhoBytes: raw.tamanhoBytes ?? null,
    uploadedById: raw.uploadedById ?? null,
  }));

export type DotacaoCreateInput = z.infer<typeof DotacaoCreateSchema>;
export type DotacaoUpdateInput = z.infer<typeof DotacaoUpdateSchema>;
export type ContratoDotacaoCreateInput = z.infer<typeof ContratoDotacaoCreateSchema>;
export type EmpenhoCreateInput = z.infer<typeof EmpenhoCreateSchema>;
export type EmpenhoUpdateInput = z.infer<typeof EmpenhoUpdateSchema>;
export type ReservaCreateInput = z.infer<typeof ReservaCreateSchema>;
export type PublicacaoCreateInput = z.infer<typeof PublicacaoCreateSchema>;
export type DocumentoCreateInput = z.infer<typeof DocumentoCreateSchema>;
