import { NextFunction, Request, Response } from 'express';
import { getPrisma } from '../lib/prisma';
import { verifyJwt } from '../lib/jwt';
import { AuthUser, normalizeRole } from '../lib/authTypes';
import { unauthorized } from '../lib/errors';
import { devBypassEnabled, syntheticTokensAllowed } from '../lib/env';
import { API_BASES } from '../lib/apiBases';
import { extractAccessToken } from '../lib/sessionCookie';

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
 * Papéis sintéticos da suíte de testes. `Map` (e não objeto literal) para que
 * chaves de Object.prototype — `constructor`, `toString` — não resolvam.
 */
const SYNTHETIC_USERS = new Map<string, AuthUser>([
  ['admin', synthetic('user-admin', 'admin@local', 'Admin legado', 'ADMIN')],
  ['analista', synthetic('user-analista', 'analista@local', 'Analista legado', 'ANALISTA')],
  ['gestor', synthetic('user-gestor', 'gestor@local', 'Gestor legado', 'GESTOR')],
  ['visitante', synthetic('user-visitante', 'visitante@local', 'Visitante legado', 'VISITANTE')],
]);

/**
 * Allowlist exata em vez de regex de sufixo. Com o padrão anterior
 * (`/\/health(\/|$)/`) qualquer caminho que contivesse um segmento `health`
 * dispensava autenticação.
 */
const PUBLIC_PATHS = new Set(
  API_BASES.flatMap((base) =>
    ['/auth/login', '/auth/logout', '/health', '/health/db'].map((suffix) => `${base}${suffix}`),
  ),
);

function isPublicPath(path: string): boolean {
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return PUBLIC_PATHS.has(normalized.toLowerCase());
}

/**
 * Auth real (JWT) + tokens de teste + bypass de desenvolvimento.
 *
 * - Authorization: Bearer <jwt> → Usuario do banco
 * - Cookie HttpOnly `painel_session` (browser)
 * - Bearer admin|analista|gestor|visitante → papel sintético, só em ambiente de teste
 * - Sem credencial → ADMIN system só quando o bypass de dev está habilitado; senão 401
 * - Públicas: /auth/login, /auth/logout, /health e /health/db
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const isPublic = isPublicPath(req.path || '');

    const token = extractAccessToken(req);
    if (!token) {
      if (isPublic || devBypassEnabled()) {
        req.user = SYSTEM_USER;
        return next();
      }
      return next(unauthorized());
    }

    if (syntheticTokensAllowed()) {
      const syntheticUser = SYNTHETIC_USERS.get(token);
      if (syntheticUser) {
        req.user = syntheticUser;
        return next();
      }
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
