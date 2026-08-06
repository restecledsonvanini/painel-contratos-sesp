import type { Role } from '@painel/domain';
import { hasMinRole, normalizeRole, ROLE_RANK } from '@painel/domain';

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

export { hasMinRole, normalizeRole, ROLE_RANK };
export type { Role };

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
