import type { Role } from '@painel/domain';
import { hasMinRole, normalizeRole, ROLE_RANK } from '@painel/domain';
import type { AuthUserDTO } from '@painel/schema';

export type AuthUser = AuthUserDTO;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export { hasMinRole, normalizeRole, ROLE_RANK };
export type { Role };

export function publicUser(user: AuthUser): AuthUserDTO {
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
