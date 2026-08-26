import type { Express, Request } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { isProduction, isTestEnv } from '../lib/env';
import { tooManyRequests } from '../lib/errors';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_LOGIN_MAX = 10;

/** Origens liberadas para CORS. Vazio = nenhum header, que é o padrão histórico. */
function corsOrigins(): string[] {
  return (process.env.CORS_ORIGINS || '')
    .split(/[,;\s]+/)
    .map((o) => o.trim())
    .filter(Boolean);
}

/**
 * Confiar em `X-Forwarded-For` sem proxy na frente deixaria qualquer cliente
 * forjar o próprio IP e escapar do rate limit, então isto é opt-in — exceto em
 * produção, onde presumimos o proxy/CDN de borda.
 */
function trustProxySetting(): number | false {
  const raw = process.env.TRUST_PROXY?.trim();
  if (raw) {
    if (raw === 'false' || raw === '0') return false;
    const hops = Number(raw);
    return Number.isFinite(hops) && hops > 0 ? hops : 1;
  }
  return isProduction() ? 1 : false;
}

/**
 * Rate limit de login.
 *
 * A chave combina IP e e-mail: em rede corporativa com NAT, muita gente
 * compartilha o mesmo IP, e limitar só por IP tiraria o escritório inteiro do
 * ar por causa de um alvo sob ataque.
 */
export const loginRateLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  limit: () => Number(process.env.AUTH_LOGIN_RATE_MAX || DEFAULT_LOGIN_MAX),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // Só tentativa falha consome cota: quem acerta a senha não é força bruta, e
  // sem isto uma bateria de e2e ou um dia de trabalho normal esgotaria o limite.
  skipSuccessfulRequests: true,
  // A suíte faz vários logins seguidos do mesmo IP; ligue TEST_RATE_LIMIT=1
  // no teste que exercita o limitador.
  skip: () => isTestEnv() && process.env.TEST_RATE_LIMIT !== '1',
  keyGenerator: (req: Request) => {
    const body = req.body as { email?: unknown } | undefined;
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    return `${ipKeyGenerator(req.ip ?? '')}:${email}`;
  },
  handler: (_req, _res, next) => {
    next(tooManyRequests('Muitas tentativas de login. Tente novamente em alguns minutos.'));
  },
});

export function applyHardening(app: Express) {
  app.set('trust proxy', trustProxySetting());

  const origins = corsOrigins();
  app.use(
    helmet({
      // API JSON não serve documento; CSP só pesaria o header.
      contentSecurityPolicy: false,
      // O padrão `same-origin` bloquearia um front hospedado em outra origem.
      crossOriginResourcePolicy: { policy: origins.length ? 'cross-origin' : 'same-origin' },
    }),
  );

  if (origins.length) {
    app.use(cors({ origin: origins, credentials: true }));
  }

  app.use(compression());
}
