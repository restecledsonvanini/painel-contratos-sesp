import { z } from 'zod';

const uuid = z.string().uuid();

const gestorFiscalRefine = <T extends { gestorId?: string; fiscalId?: string }>(
  data: T,
  ctx: z.RefinementCtx
) => {
  if (data.gestorId && data.fiscalId && data.gestorId === data.fiscalId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'gestorId and fiscalId must be different',
      path: ['fiscalId'],
    });
  }
};

export const AditivoCreateSchema = z.object({
  numAditivo: z.number().int().nonnegative(),
  protocoloAdit: z.string().min(1),
  novoFimVigencia: z.string().nullable().optional(),
  valorAdicional: z.number().nonnegative().optional(),
});

export const ContractCreateSchema = z
  .object({
    protocoloCabeca: z.string().optional().nullable(),
    numGms: z.number().int().nonnegative(),
    anoGms: z.number().int().gte(2000),
    unidadeFspId: uuid,
    gestorId: uuid,
    fiscalId: uuid,
    empresaId: uuid,
    modalidade: z.string().min(1),
    objeto: z.string().min(1),
    valorAnual: z.number().nonnegative(),
    dataInicio: z.string().nullish(),
    dataFimOrig: z.string().nullish(),
    status: z.string().optional(),
    aditivos: z.array(AditivoCreateSchema).optional(),
  })
  .superRefine(gestorFiscalRefine)
  .transform((raw) => ({
    ...raw,
    valorAnualCents: Math.round(raw.valorAnual * 100),
    dataInicio: raw.dataInicio || null,
    dataFimOrig: raw.dataFimOrig || null,
  }));

export const ContractUpdateSchema = z
  .object({
    protocoloCabeca: z.string().nullish(),
    numGms: z.number().int().nonnegative().optional(),
    anoGms: z.number().int().gte(2000).optional(),
    unidadeFspId: uuid.optional(),
    gestorId: uuid.optional(),
    fiscalId: uuid.optional(),
    empresaId: uuid.optional(),
    modalidade: z.string().min(1).optional(),
    objeto: z.string().min(1).optional(),
    valorAnual: z.number().nonnegative().optional(),
    valorAnualCents: z.number().int().nonnegative().optional(),
    dataInicio: z.string().nullish(),
    dataFimOrig: z.string().nullish(),
    status: z.string().min(1).optional(),
  })
  .superRefine(gestorFiscalRefine)
  .transform((raw) => {
    const next: Record<string, unknown> = { ...raw };
    if (raw.valorAnual !== undefined && raw.valorAnualCents === undefined) {
      next.valorAnualCents = Math.round(raw.valorAnual * 100);
    }
    delete next.valorAnual;
    return next;
  });

export const EmpresaCreateSchema = z.object({
  cnpj: z.string().min(8),
  razaoSocial: z.string().min(1),
});

export const EmpresaUpdateSchema = EmpresaCreateSchema.partial();

export const EntidadeGestoraCreateSchema = z.object({
  nome: z.string().min(1),
  cpf: z.string().min(11),
});

export const EntidadeGestoraUpdateSchema = EntidadeGestoraCreateSchema.partial();

export const UnidadeFspCreateSchema = z.object({
  sigla: z.string().min(1),
  nome: z.string().min(1),
});

export const UnidadeFspUpdateSchema = UnidadeFspCreateSchema.partial();

export const FornecedorCreateSchema = z.object({
  nome: z.string().min(1),
  cnpj: z.string().optional().nullable(),
});

export const FornecedorUpdateSchema = FornecedorCreateSchema.partial();

export const ServicoCreateSchema = z.object({
  titulo: z.string().min(1),
  descricao: z.string().optional().nullable(),
});

export const ServicoUpdateSchema = ServicoCreateSchema.partial();

export type ContractCreateInput = z.infer<typeof ContractCreateSchema>;
export type ContractUpdateInput = z.infer<typeof ContractUpdateSchema>;
export type AditivoCreateInput = z.infer<typeof AditivoCreateSchema>;
