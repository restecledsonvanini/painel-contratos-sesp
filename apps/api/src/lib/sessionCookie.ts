import type { CookieOptions, Request, Response } from 'express';
import { isProduction } from './env';
import { TOKEN_TTL_SEC } from './jwt';

/** Cookie HttpOnly da sessão. O front não precisa (nem deve) ler o JWT. */
export const SESSION_COOKIE = 'painel_session';

export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction(),
    path: '/',
    maxAge: TOKEN_TTL_SEC * 1000,
  };
}

export function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    if (key !== name) continue;
    const raw = part.slice(eq + 1).trim();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return undefined;
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, { ...sessionCookieOptions(), maxAge: 0 });
}

/** Bearer tem prioridade (testes, clientes de API); senão o cookie do browser. */
export function extractAccessToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (header) {
    const [scheme, value] = header.split(' ');
    if (scheme === 'Bearer' && value) return value;
  }
  return readCookie(req, SESSION_COOKIE);
}
