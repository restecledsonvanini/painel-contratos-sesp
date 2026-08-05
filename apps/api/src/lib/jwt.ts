import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const JWT_SECRET = () => process.env.JWT_SECRET || 'painel-dev-secret-change-me';
const TOKEN_TTL_SEC = Number(process.env.JWT_TTL_SEC || 60 * 60 * 12);

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64url');
}

function fromB64url(input: string) {
  return Buffer.from(input, 'base64url');
}

export type JwtPayload = {
  sub: string;
  email?: string | null;
  role: string;
  orgaoId?: string | null;
  servidorId?: string | null;
  iat: number;
  exp: number;
};

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  const actual = scryptSync(password, salt, expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_TTL_SEC,
  };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(body));
  const sig = createHmac('sha256', JWT_SECRET()).update(`${h}.${p}`).digest();
  return `${h}.${p}.${b64url(sig)}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const expected = createHmac('sha256', JWT_SECRET()).update(`${h}.${p}`).digest();
  let actual: Buffer;
  try {
    actual = fromB64url(s);
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const payload = JSON.parse(fromB64url(p).toString('utf8')) as JwtPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.sub) return null;
    return payload;
  } catch {
    return null;
  }
}
