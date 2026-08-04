import { z } from 'zod';

const uuid = z.string().uuid();

const digits = (value: string) => value.replace(/\D/g, '');

export const TipoPessoaSchema = z.enum(['JURIDICA', 'FISICA']);
export const PorteEmpresaSchema = z.enum(['MEI', 'ME', 'EPP', 'DEMAIS']);
export const SituacaoFornecedorSchema = z.enum(['ATIVO', 'INATIVO', 'IMPEDIDO', 'INIDONEO']);
export const TipoSancaoSchema = z.enum([
  'ADVERTENCIA',
  'MULTA',
  'IMPEDIMENTO_LICITAR',
  'DECLARACAO_INIDONEIDADE',
]);

export const FornecedorContatoCreateSchema = z.object({
  nome: z.string().min(1),
  cargo: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal('')),
  telefone: z.string().nullable().optional(),
  principal: z.boolean().optional(),
});

export const FornecedorContatoUpdateSchema = FornecedorContatoCreateSchema.partial();

export const FornecedorSancaoCreateSchema = z.object({
  tipo: TipoSancaoSchema,
  processo: z.string().nullable().optional(),
  dataInicio: z.string().min(1),
  dataFim: z.string().nullable().optional(),
  abrangencia: z.string().nullable().optional(),
  fonte: z.string().nullable().optional(),
});

export const FornecedorSancaoUpdateSchema = FornecedorSancaoCreateSchema.partial();

export const FornecedorCreateSchema = z
  .object({
    tipoPessoa: TipoPessoaSchema.optional().default('JURIDICA'),
    documento: z.string().optional(),
    /** @deprecated use documento */
    cnpj: z.string().optional(),
    razaoSocial: z.string().optional(),
    /** @deprecated use razaoSocial */
    nome: z.string().optional(),
    nomeFantasia: z.string().nullable().optional(),
    inscricaoEstadual: z.string().nullable().optional(),
    porte: PorteEmpresaSchema.nullable().optional(),
    municipioId: uuid.nullable().optional(),
    situacao: SituacaoFornecedorSchema.optional(),
    codigoLegado: z.string().nullable().optional(),
    contatos: z.array(FornecedorContatoCreateSchema).optional(),
  })
  .superRefine((data, ctx) => {
    const razao = data.razaoSocial || data.nome;
    if (!razao) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'razaoSocial é obrigatório',
        path: ['razaoSocial'],
      });
    }
    const rawDoc = data.documento || data.cnpj;
    if (!rawDoc) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'documento é obrigatório',
        path: ['documento'],
      });
      return;
    }
    const doc = digits(rawDoc);
    const expected = data.tipoPessoa === 'FISICA' ? 11 : 14;
    if (doc.length !== expected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          data.tipoPessoa === 'FISICA'
            ? 'CPF deve ter 11 dígitos'
            : 'CNPJ deve ter 14 dígitos',
        path: ['documento'],
      });
    }
  })
  .transform((raw) => ({
    tipoPessoa: raw.tipoPessoa,
    documento: digits(raw.documento || raw.cnpj || ''),
    razaoSocial: (raw.razaoSocial || raw.nome || '').trim(),
    nomeFantasia: raw.nomeFantasia || null,
    inscricaoEstadual: raw.inscricaoEstadual || null,
    porte: raw.porte ?? null,
    municipioId: raw.municipioId ?? null,
    situacao: raw.situacao ?? ('ATIVO' as const),
    codigoLegado: raw.codigoLegado || null,
    contatos: raw.contatos,
  }));

export const FornecedorUpdateSchema = z
  .object({
    tipoPessoa: TipoPessoaSchema.optional(),
    documento: z.string().min(1).optional(),
    cnpj: z.string().optional(),
    razaoSocial: z.string().min(1).optional(),
    nome: z.string().optional(),
    nomeFantasia: z.string().nullable().optional(),
    inscricaoEstadual: z.string().nullable().optional(),
    porte: PorteEmpresaSchema.nullable().optional(),
    municipioId: uuid.nullable().optional(),
    situacao: SituacaoFornecedorSchema.optional(),
    codigoLegado: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const rawDoc = data.documento || data.cnpj;
    if (!rawDoc) return;
    const doc = digits(rawDoc);
    const tipo = data.tipoPessoa ?? 'JURIDICA';
    const expected = tipo === 'FISICA' ? 11 : 14;
    if (doc.length !== expected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: tipo === 'FISICA' ? 'CPF deve ter 11 dígitos' : 'CNPJ deve ter 14 dígitos',
        path: ['documento'],
      });
    }
  })
  .transform((raw) => {
    const next: Record<string, unknown> = {};
    if (raw.tipoPessoa !== undefined) next.tipoPessoa = raw.tipoPessoa;
    if (raw.documento !== undefined || raw.cnpj !== undefined) {
      next.documento = digits(raw.documento || raw.cnpj || '');
    }
    if (raw.razaoSocial !== undefined || raw.nome !== undefined) {
      next.razaoSocial = raw.razaoSocial || raw.nome;
    }
    if (raw.nomeFantasia !== undefined) next.nomeFantasia = raw.nomeFantasia;
    if (raw.inscricaoEstadual !== undefined) next.inscricaoEstadual = raw.inscricaoEstadual;
    if (raw.porte !== undefined) next.porte = raw.porte;
    if (raw.municipioId !== undefined) next.municipioId = raw.municipioId;
    if (raw.situacao !== undefined) next.situacao = raw.situacao;
    if (raw.codigoLegado !== undefined) next.codigoLegado = raw.codigoLegado;
    return next;
  });

export const ServidorCreateSchema = z
  .object({
    nome: z.string().min(1),
    cpf: z.string().nullable().optional(),
    rgFuncional: z.string().nullable().optional(),
    cargo: z.string().nullable().optional(),
    orgaoId: uuid.nullable().optional(),
    unidadeId: uuid.nullable().optional(),
    email: z.string().email().nullable().optional().or(z.literal('')),
    telefone: z.string().nullable().optional(),
    ativo: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cpf == null || data.cpf === '') return;
    if (digits(data.cpf).length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CPF deve ter 11 dígitos',
        path: ['cpf'],
      });
    }
  })
  .transform((raw) => ({
    ...raw,
    cpf: raw.cpf ? digits(raw.cpf) : null,
    rgFuncional: raw.rgFuncional || null,
    cargo: raw.cargo || null,
    orgaoId: raw.orgaoId ?? null,
    unidadeId: raw.unidadeId ?? null,
    email: raw.email || null,
    telefone: raw.telefone || null,
    ativo: raw.ativo ?? true,
  }));

export const ServidorUpdateSchema = z
  .object({
    nome: z.string().min(1).optional(),
    cpf: z.string().nullable().optional(),
    rgFuncional: z.string().nullable().optional(),
    cargo: z.string().nullable().optional(),
    orgaoId: uuid.nullable().optional(),
    unidadeId: uuid.nullable().optional(),
    email: z.string().email().nullable().optional().or(z.literal('')),
    telefone: z.string().nullable().optional(),
    ativo: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cpf == null || data.cpf === '') return;
    if (digits(data.cpf).length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CPF deve ter 11 dígitos',
        path: ['cpf'],
      });
    }
  })
  .transform((raw) => {
    const next: Record<string, unknown> = { ...raw };
    if (raw.cpf !== undefined) next.cpf = raw.cpf ? digits(raw.cpf) : null;
    return next;
  });

/** @deprecated Use FornecedorCreateSchema — mantido só para migração de payload legado. */
export const EmpresaCreateSchema = z
  .object({
    cnpj: z.string().min(8),
    razaoSocial: z.string().min(1),
  })
  .transform((raw) => ({
    tipoPessoa: 'JURIDICA' as const,
    documento: digits(raw.cnpj),
    razaoSocial: raw.razaoSocial,
  }));

export const EmpresaUpdateSchema = z
  .object({
    cnpj: z.string().min(8).optional(),
    razaoSocial: z.string().min(1).optional(),
  })
  .transform((raw) => {
    const next: { documento?: string; razaoSocial?: string } = {};
    if (raw.cnpj !== undefined) next.documento = digits(raw.cnpj);
    if (raw.razaoSocial !== undefined) next.razaoSocial = raw.razaoSocial;
    return next;
  });

/** @deprecated Use ServidorCreateSchema */
export const EntidadeGestoraCreateSchema = z
  .object({
    nome: z.string().min(1),
    cpf: z.string().min(11),
  })
  .transform((raw) => ({
    nome: raw.nome,
    cpf: digits(raw.cpf),
  }));

export const EntidadeGestoraUpdateSchema = z
  .object({
    nome: z.string().min(1).optional(),
    cpf: z.string().min(11).optional(),
  })
  .transform((raw) => {
    const next: { nome?: string; cpf?: string | null } = {};
    if (raw.nome !== undefined) next.nome = raw.nome;
    if (raw.cpf !== undefined) next.cpf = digits(raw.cpf);
    return next;
  });

export type FornecedorCreateInput = z.infer<typeof FornecedorCreateSchema>;
export type FornecedorUpdateInput = z.infer<typeof FornecedorUpdateSchema>;
export type FornecedorContatoCreateInput = z.infer<typeof FornecedorContatoCreateSchema>;
export type FornecedorContatoUpdateInput = z.infer<typeof FornecedorContatoUpdateSchema>;
export type FornecedorSancaoCreateInput = z.infer<typeof FornecedorSancaoCreateSchema>;
export type FornecedorSancaoUpdateInput = z.infer<typeof FornecedorSancaoUpdateSchema>;
export type ServidorCreateInput = z.infer<typeof ServidorCreateSchema>;
export type ServidorUpdateInput = z.infer<typeof ServidorUpdateSchema>;
