import { z } from 'zod';

const uuid = z.string().uuid();

export const LookupOptionSchema = z.object({
  id: uuid,
  label: z.string(),
  codigo: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

export const DominioValorCreateSchema = z.object({
  codigo: z.string().min(1).max(64),
  label: z.string().min(1),
  parentId: uuid.nullable().optional(),
  ordem: z.number().int().nonnegative().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
  codigoLegado: z.string().nullable().optional(),
});

export const DominioValorUpdateSchema = DominioValorCreateSchema.partial().extend({
  ativo: z.boolean().optional(),
});

export const OrgaoCreateSchema = z.object({
  sigla: z.string().min(1).max(20),
  nome: z.string().min(1),
  tipo: z.enum([
    'POLICIA_MILITAR',
    'POLICIA_CIVIL',
    'BOMBEIROS',
    'POLICIA_PENAL',
    'POLICIA_CIENTIFICA',
    'TRANSITO',
    'ADMINISTRACAO_DIRETA',
  ]),
  parentId: uuid.nullable().optional(),
  ativo: z.boolean().optional(),
});

export const OrgaoUpdateSchema = OrgaoCreateSchema.partial();

export const UnidadeOrganizacionalCreateSchema = z.object({
  orgaoId: uuid,
  parentId: uuid.nullable().optional(),
  sigla: z.string().min(1).max(40),
  nome: z.string().min(1),
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
    .nullable()
    .optional(),
  municipioId: uuid.nullable().optional(),
  ativo: z.boolean().optional(),
});

export const UnidadeOrganizacionalUpdateSchema = UnidadeOrganizacionalCreateSchema.partial();

export type DominioValorCreateInput = z.infer<typeof DominioValorCreateSchema>;
export type DominioValorUpdateInput = z.infer<typeof DominioValorUpdateSchema>;
export type OrgaoCreateInput = z.infer<typeof OrgaoCreateSchema>;
export type OrgaoUpdateInput = z.infer<typeof OrgaoUpdateSchema>;
export type UnidadeOrganizacionalCreateInput = z.infer<typeof UnidadeOrganizacionalCreateSchema>;
export type UnidadeOrganizacionalUpdateInput = z.infer<typeof UnidadeOrganizacionalUpdateSchema>;
export type LookupOption = z.infer<typeof LookupOptionSchema>;
