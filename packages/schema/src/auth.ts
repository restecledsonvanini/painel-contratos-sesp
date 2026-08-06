import { z } from 'zod';

const CANONICAL = ['VISITANTE', 'ANALISTA', 'GESTOR', 'ADMIN'] as const;

function toCanonicalRole(raw: unknown): string {
  if (typeof raw !== 'string') return 'VISITANTE';
  const upper = raw.toUpperCase();
  const aliases: Record<string, (typeof CANONICAL)[number]> = {
    VISITANTE: 'VISITANTE',
    ANALISTA: 'ANALISTA',
    GESTOR: 'GESTOR',
    ADMIN: 'ADMIN',
    LEITOR: 'VISITANTE',
    COLABORADOR: 'ANALISTA',
    FISCAL: 'ANALISTA',
  };
  return aliases[upper] ?? aliases[raw.toLowerCase()] ?? 'VISITANTE';
}

/** Papéis canônicos; entrada aceita aliases legados (LEITOR/COLABORADOR/FISCAL). */
export const RoleSchema = z.preprocess(toCanonicalRole, z.enum(CANONICAL));

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

export type Role = (typeof CANONICAL)[number];
export type LoginInput = z.infer<typeof LoginSchema>;
export type UsuarioCreateInput = z.infer<typeof UsuarioCreateSchema>;
export type UsuarioUpdateInput = z.infer<typeof UsuarioUpdateSchema>;
