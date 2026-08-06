import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/index';
import { getPrisma, disconnectPrisma } from '../src/lib/prisma';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';
process.env.VITEST = 'true';
process.env.AUTH_EMAIL_DOMAINS ||= '*';

async function dbReady() {
  try {
    const db = getPrisma();
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

describe('auth e RBAC', () => {
  let ready = false;

  beforeAll(async () => {
    ready = await dbReady();
  });

  it('login retorna JWT e /auth/me', async () => {
    if (!ready) return;
    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sesp.pr.gov.br',
      password: 'admin123',
    });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
    expect(login.body.user.role).toBe('ADMIN');

    const me = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe('admin@sesp.pr.gov.br');
  });

  it('VISITANTE (legado leitor) não pode criar contrato', async () => {
    if (!ready) return;
    const res = await request(app)
      .post('/api/v1/contracts')
      .set('Authorization', 'Bearer leitor')
      .send({ numeroGms: '1', anoGms: 2026, objeto: 'x' });
    expect(res.status).toBe(403);
  });

  it('lista usuários exige ADMIN', async () => {
    if (!ready) return;
    const denied = await request(app)
      .get('/api/v1/usuarios')
      .set('Authorization', 'Bearer gestor');
    expect(denied.status).toBe(403);

    const ok = await request(app)
      .get('/api/v1/usuarios')
      .set('Authorization', 'Bearer admin');
    expect(ok.status).toBe(200);
    expect(Array.isArray(ok.body)).toBe(true);
  });

  it('credencial inválida retorna 401', async () => {
    if (!ready) return;
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sesp.pr.gov.br',
      password: 'wrong',
    });
    expect(res.status).toBe(401);
    await disconnectPrisma();
  });
});

describe('allowlist de e-mail', () => {
  it('rejeita domínio fora da allowlist quando AUTH_EMAIL_DOMAINS é restrito', async () => {
    const prev = process.env.AUTH_EMAIL_DOMAINS;
    process.env.AUTH_EMAIL_DOMAINS = 'sesp.pr.gov.br';
    try {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'alguem@gmail.com',
        password: 'x',
      });
      expect(res.status).toBe(400);
    } finally {
      process.env.AUTH_EMAIL_DOMAINS = prev;
    }
  });
});
