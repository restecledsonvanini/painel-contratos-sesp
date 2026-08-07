import { NextFunction, Request, Response } from 'express';
import { getPrisma } from '../lib/prisma';
import { verifyJwt } from '../lib/jwt';
import { AuthUser, normalizeRole } from '../lib/authTypes';
import { unauthorized } from '../lib/errors';

const DEV_BYPASS =
  process.env.AUTH_REQUIRED !== '1' && process.env.AUTH_REQUIRED !== 'true';

/** Bypass local: ADMIN para espelhar o front (useCanAct liberado sem AUTH). */
const SYSTEM_USER: AuthUser = {
  id: 'system',
  email: null,
  nome: 'Sistema (dev)',
  role: 'ADMIN',
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

function synthetic(id: string, email: string, nome: string, roleRaw: string): AuthUser {
  return {
    id,
    email,
    nome,
    role: normalizeRole(roleRaw),
    orgaoId: null,
    servidorId: null,
    ativo: true,
  };
}

/**
 * Auth real (JWT) + tokens de teste + bypass de desenvolvimento.
 *
 * - Authorization: Bearer <jwt> → Usuario do banco
 * - Bearer admin|analista|gestor|visitante (+ legado só com VITEST) → papel sintético
 * - Sem header → ADMIN system se AUTH_REQUIRED não estiver ativo; senão 401
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
      admin: synthetic('user-admin', 'admin@local', 'Admin legado', 'ADMIN'),
      analista: synthetic('user-analista', 'analista@local', 'Analista legado', 'ANALISTA'),
      gestor: synthetic('user-gestor', 'gestor@local', 'Gestor legado', 'GESTOR'),
      visitante: synthetic('user-visitante', 'visitante@local', 'Visitante legado', 'VISITANTE'),
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
