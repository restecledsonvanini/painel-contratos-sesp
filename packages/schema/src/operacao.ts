import { z } from 'zod';

export const TipoAlertaSchema = z.enum([
  'VENCIMENTO',
  'LIMITE_ACRESCIMO',
  'PRORROGACAO_ESGOTADA',
  'PUBLICACAO_PENDENTE',
  'GARANTIA_VENCENDO',
  'REAJUSTE_DEVIDO',
  'FORNECEDOR_SANCIONADO',
]);

export const SeveridadeAlertaSchema = z.enum(['INFO', 'ATENCAO', 'CRITICO']);

export const SituacaoImportacaoSchema = z.enum([
  'RECEBIDO',
  'VALIDADO',
  'APLICADO',
  'REJEITADO',
]);

export const TipoEntidadeImportacaoSchema = z.enum([
  'fornecedor',
  'servidor',
  'dotacao',
  'unidade',
]);

export const AlertaQuerySchema = z.object({
  tipo: TipoAlertaSchema.optional(),
  severidade: SeveridadeAlertaSchema.optional(),
  contratoId: z.string().uuid().optional(),
  reconhecido: z
    .enum(['true', 'false', '1', '0'])
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      return v === 'true' || v === '1';
    }),
});

export const ImportacaoCreateSchema = z
  .object({
    nomeArquivo: z.string().min(1).default('upload.csv'),
    tipoEntidade: TipoEntidadeImportacaoSchema,
    csv: z.string().optional(),
    linhas: z.array(z.record(z.string(), z.unknown())).optional(),
    dryRun: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    if (!data.csv && (!data.linhas || data.linhas.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe csv ou linhas',
        path: ['csv'],
      });
    }
  });

export const FornecedorImportLinhaSchema = z.object({
  documento: z.string().min(11),
  razaoSocial: z.string().min(1),
  tipoPessoa: z.enum(['JURIDICA', 'FISICA']).optional().default('JURIDICA'),
  nomeFantasia: z.string().optional(),
  situacao: z.enum(['ATIVO', 'INATIVO', 'IMPEDIDO', 'INIDONEO']).optional(),
});

export const ServidorImportLinhaSchema = z.object({
  cpf: z.string().min(11),
  nome: z.string().min(1),
  cargo: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  ativo: z
    .union([z.boolean(), z.enum(['true', 'false', '1', '0', 'sim', 'nao'])])
    .optional()
    .transform((v) => {
      if (v === undefined) return true;
      if (typeof v === 'boolean') return v;
      return v === 'true' || v === '1' || v === 'sim';
    }),
});

const boolish = z
  .union([z.boolean(), z.enum(['true', 'false', '1', '0', 'sim', 'nao'])])
  .optional()
  .transform((v) => {
    if (v === undefined) return true;
    if (typeof v === 'boolean') return v;
    return v === 'true' || v === '1' || v === 'sim';
  });

export const DotacaoImportLinhaSchema = z.object({
  exercicio: z.coerce.number().int().gte(2000),
  codigo: z.string().min(1),
  naturezaDespesaCodigo: z.string().min(1),
  fonteRecursoCodigo: z.string().min(1),
  unidadeOrcamentaria: z.string().optional(),
  funcionalProgramatica: z.string().optional(),
  descricao: z.string().optional(),
});

export const UnidadeImportLinhaSchema = z.object({
  orgaoSigla: z.string().min(1),
  sigla: z.string().min(1).max(40),
  nome: z.string().min(1),
  parentSigla: z.string().optional(),
  nivel: z
    .enum([
      'COMANDO_GERAL',
      'DIRETORIA',
      'COMANDO_REGIONAL',
      'BATALHAO',
      'COMPANHIA',
      'DELEGACIA',
      'UNIDADE_PRISIONAL',
      'SETOR',
    ])
    .optional()
    .nullable(),
  ativo: boolish,
});

export type AlertaQuery = z.infer<typeof AlertaQuerySchema>;
export type ImportacaoCreateInput = z.infer<typeof ImportacaoCreateSchema>;
export type DotacaoImportLinha = z.infer<typeof DotacaoImportLinhaSchema>;
export type UnidadeImportLinha = z.infer<typeof UnidadeImportLinhaSchema>;
