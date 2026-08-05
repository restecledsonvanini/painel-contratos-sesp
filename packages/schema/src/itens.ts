import { z } from 'zod';

const uuid = z.string().uuid();

export const PeriodicidadeSchema = z.enum(['UNICA', 'DIARIA', 'MENSAL', 'ANUAL']);
export const TipoAtributoSchema = z.enum([
  'TEXTO',
  'TEXTO_LONGO',
  'NUMERO',
  'MOEDA',
  'DATA',
  'BOOLEANO',
  'SELECAO',
  'MULTI_SELECAO',
  'MUNICIPIO',
  'UNIDADE',
]);

export const CatalogoItemCreateSchema = z.object({
  categoriaItemId: uuid,
  codigo: z.string().nullable().optional(),
  nome: z.string().min(1),
  descricao: z.string().nullable().optional(),
  unidadeMedidaPadraoId: uuid,
  atributosPadrao: z.record(z.unknown()).nullable().optional(),
  ativo: z.boolean().optional(),
});

export const CatalogoItemUpdateSchema = CatalogoItemCreateSchema.partial();

export const ItemAtributoDefCreateSchema = z.object({
  categoriaItemId: uuid,
  chave: z.string().min(1).max(64),
  label: z.string().min(1),
  tipo: TipoAtributoSchema,
  dominioSlug: z.string().nullable().optional(),
  obrigatorio: z.boolean().optional(),
  unidade: z.string().nullable().optional(),
  ordem: z.number().int().nonnegative().optional(),
  ajuda: z.string().nullable().optional(),
  ativo: z.boolean().optional(),
});

export const ItemAtributoDefUpdateSchema = ItemAtributoDefCreateSchema.partial().omit({
  categoriaItemId: true,
  chave: true,
});

export const ItemContratoCreateSchema = z.object({
  sequencia: z.number().int().positive().optional(),
  catalogoItemId: uuid,
  descricaoComplementar: z.string().nullable().optional(),
  quantidade: z.number().positive(),
  unidadeMedidaId: uuid.optional(),
  valorUnitario: z.number().nonnegative().optional(),
  valorUnitarioCents: z.number().int().nonnegative().optional(),
  periodicidade: PeriodicidadeSchema.optional(),
  unidadeDestinoId: uuid.nullable().optional(),
  municipioExecucaoId: uuid.nullable().optional(),
  enderecoExecucao: z.string().nullable().optional(),
  atributos: z.record(z.unknown()).nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.valorUnitario == null && data.valorUnitarioCents == null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'valorUnitario é obrigatório',
      path: ['valorUnitario'],
    });
  }
}).transform((raw) => ({
  ...raw,
  valorUnitarioCents:
    raw.valorUnitarioCents ?? Math.round((raw.valorUnitario ?? 0) * 100),
  periodicidade: raw.periodicidade ?? 'UNICA',
}));

export const ItemContratoUpdateSchema = z.object({
  sequencia: z.number().int().positive().optional(),
  catalogoItemId: uuid.optional(),
  descricaoComplementar: z.string().nullable().optional(),
  quantidade: z.number().positive().optional(),
  unidadeMedidaId: uuid.optional(),
  valorUnitario: z.number().nonnegative().optional(),
  valorUnitarioCents: z.number().int().nonnegative().optional(),
  periodicidade: PeriodicidadeSchema.optional(),
  unidadeDestinoId: uuid.nullable().optional(),
  municipioExecucaoId: uuid.nullable().optional(),
  enderecoExecucao: z.string().nullable().optional(),
  atributos: z.record(z.unknown()).nullable().optional(),
}).transform((raw) => {
  const next: Record<string, unknown> = { ...raw };
  if (raw.valorUnitario !== undefined && raw.valorUnitarioCents === undefined) {
    next.valorUnitarioCents = Math.round(raw.valorUnitario * 100);
  }
  delete next.valorUnitario;
  return next;
});

export type CatalogoItemCreateInput = z.infer<typeof CatalogoItemCreateSchema>;
export type CatalogoItemUpdateInput = z.infer<typeof CatalogoItemUpdateSchema>;
export type ItemAtributoDefCreateInput = z.infer<typeof ItemAtributoDefCreateSchema>;
export type ItemAtributoDefUpdateInput = z.infer<typeof ItemAtributoDefUpdateSchema>;
export type ItemContratoCreateInput = z.infer<typeof ItemContratoCreateSchema>;
export type ItemContratoUpdateInput = z.infer<typeof ItemContratoUpdateSchema>;
