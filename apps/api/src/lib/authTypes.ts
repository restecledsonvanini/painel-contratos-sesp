import type { Role } from '@painel/schema';

export type AuthUser = {
  id: string;
  email: string | null;
  nome: string | null;
  role: Role;
  orgaoId: string | null;
  servidorId: string | null;
  ativo: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const ROLE_RANK: Record<Role, number> = {
  LEITOR: 1,
  COLABORADOR: 2,
  FISCAL: 3,
  GESTOR: 4,
  ADMIN: 5,
};

const LEGACY: Record<string, Role> = {
  leitor: 'LEITOR',
  colaborador: 'COLABORADOR',
  fiscal: 'FISCAL',
  gestor: 'GESTOR',
  admin: 'ADMIN',
  administrador: 'ADMIN',
};

export function normalizeRole(role: string | null | undefined): Role {
  if (!role) return 'LEITOR';
  const upper = role.toUpperCase();
  if (upper in ROLE_RANK) return upper as Role;
  return LEGACY[role.toLowerCase()] ?? 'LEITOR';
}

export function hasMinRole(userRole: string | null | undefined, min: Role): boolean {
  return ROLE_RANK[normalizeRole(userRole)] >= ROLE_RANK[min];
}

export function publicUser(user: AuthUser) {
  return {
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
    orgaoId: user.orgaoId,
    servidorId: user.servidorId,
    ativo: user.ativo,
  };
}
