import { z } from 'zod';

export const RoleSchema = z.enum(['LEITOR', 'COLABORADOR', 'FISCAL', 'GESTOR', 'ADMIN']);

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const UsuarioCreateSchema = z.object({
  email: z.string().email(),
  nome: z.string().min(1).nullable().optional(),
  password: z.string().min(6),
  role: RoleSchema.optional().default('COLABORADOR'),
  servidorId: z.string().uuid().nullable().optional(),
  orgaoId: z.string().uuid().nullable().optional(),
  ativo: z.boolean().optional().default(true),
  sub: z.string().nullable().optional(),
});

export const UsuarioUpdateSchema = z.object({
  email: z.string().email().optional(),
  nome: z.string().min(1).nullable().optional(),
  password: z.string().min(6).optional(),
  role: RoleSchema.optional(),
  servidorId: z.string().uuid().nullable().optional(),
  orgaoId: z.string().uuid().nullable().optional(),
  ativo: z.boolean().optional(),
  sub: z.string().nullable().optional(),
});

export type Role = z.infer<typeof RoleSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UsuarioCreateInput = z.infer<typeof UsuarioCreateSchema>;
export type UsuarioUpdateInput = z.infer<typeof UsuarioUpdateSchema>;
