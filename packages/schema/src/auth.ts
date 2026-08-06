import { z } from 'zod';
import { normalizeRole, Role as RoleEnum, type Role } from '@painel/domain';

const CANONICAL = [
  RoleEnum.VISITANTE,
  RoleEnum.ANALISTA,
  RoleEnum.GESTOR,
  RoleEnum.ADMIN,
] as const;

/** Papéis canônicos (`@painel/domain`); entrada aceita aliases legados. */
export const RoleSchema = z.preprocess(
  (raw) => normalizeRole(typeof raw === 'string' ? raw : undefined),
  z.enum(CANONICAL),
);

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const UsuarioCreateSchema = z.object({
  email: z.string().email(),
  nome: z.string().min(1).nullable().optional(),
  password: z.string().min(6),
  role: RoleSchema.optional().default('ANALISTA'),
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

export type { Role };
export type LoginInput = z.infer<typeof LoginSchema>;
export type UsuarioCreateInput = z.infer<typeof UsuarioCreateSchema>;
export type UsuarioUpdateInput = z.infer<typeof UsuarioUpdateSchema>;
