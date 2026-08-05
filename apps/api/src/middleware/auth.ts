import { NextFunction, Request, Response } from 'express';
import { getPrisma } from '../lib/prisma';
import { verifyJwt } from '../lib/jwt';
import { AuthUser, normalizeRole } from '../lib/authTypes';
import { unauthorized } from '../lib/errors';

const DEV_BYPASS =
  process.env.AUTH_REQUIRED !== '1' && process.env.AUTH_REQUIRED !== 'true';

const SYSTEM_USER: AuthUser = {
  id: 'system',
  email: null,
  nome: 'Sistema (dev)',
  role: 'COLABORADOR',
  orgaoId: null,
  servidorId: null,
  ativo: true,
};

async function loadUsuario(id: string): Promise<AuthUser | null> {
  const db = getPrisma();
  const u = await db.usuario.findUnique({ where: { id } });
  if (!u || !u.ativo) return null;
  return {
    id: u.id,
    email: u.email,
    nome: u.nome,
    role: normalizeRole(u.role),
    orgaoId: u.orgaoId,
    servidorId: u.servidorId,
    ativo: u.ativo,
  };
}

/**
 * Auth real (JWT) + compat de tokens legados + bypass de desenvolvimento.
 *
 * - Authorization: Bearer <jwt> → Usuario do banco
 * - Bearer admin|colaborador|gestor|fiscal|leitor → papel sintético (compat testes)
 * - Sem header → COLABORADOR system se AUTH_REQUIRED não estiver ativo; senão 401
 * - /auth/login, /health*, /docs, /metrics são públicos
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const path = req.path || '';
    const isPublic =
      /\/auth\/login\/?$/.test(path) ||
      /\/health(\/|$)/.test(path) ||
      /\/docs\/?$/.test(path) ||
      /\/metrics\/?$/.test(path);

    const auth = req.headers.authorization;
    if (!auth) {
      if (isPublic || DEV_BYPASS) {
        req.user = SYSTEM_USER;
        return next();
      }
      return next(unauthorized());
    }

    const parts = auth.split(' ');
    const token = parts[1];
    if (!token) return next(unauthorized('Token ausente'));

    const legacy: Record<string, AuthUser> = {
      admin: {
        id: 'user-admin',
        email: 'admin@local',
        nome: 'Admin legado',
        role: 'ADMIN',
        orgaoId: null,
        servidorId: null,
        ativo: true,
      },
      colaborador: {
        id: 'user-colab',
        email: 'colaborador@local',
        nome: 'Colaborador legado',
        role: 'COLABORADOR',
        orgaoId: null,
        servidorId: null,
        ativo: true,
      },
      gestor: {
        id: 'user-gestor',
        email: 'gestor@local',
        nome: 'Gestor legado',
        role: 'GESTOR',
        orgaoId: null,
        servidorId: null,
        ativo: true,
      },
      fiscal: {
        id: 'user-fiscal',
        email: 'fiscal@local',
        nome: 'Fiscal legado',
        role: 'FISCAL',
        orgaoId: null,
        servidorId: null,
        ativo: true,
      },
      leitor: {
        id: 'user-leitor',
        email: 'leitor@local',
        nome: 'Leitor legado',
        role: 'LEITOR',
        orgaoId: null,
        servidorId: null,
        ativo: true,
      },
    };

    if (legacy[token]) {
      req.user = legacy[token];
      return next();
    }

    const payload = verifyJwt(token);
    if (!payload) return next(unauthorized('Token inválido ou expirado'));

    const user = await loadUsuario(payload.sub);
    if (!user) return next(unauthorized('Usuário inativo ou inexistente'));

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}
