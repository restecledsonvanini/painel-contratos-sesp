import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/index';
import { getPrisma, disconnectPrisma } from '../src/lib/prisma';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';
process.env.VITEST = 'true';

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

  it('LEITOR não pode criar contrato', async () => {
    if (!ready) return;
    const res = await request(app)
      .post('/api/v1/contracts')
      .set('Authorization', 'Bearer leitor')
      .send({ numeroGms: '1', anoGms: 2026, objeto: 'x' });
    expect(res.status).toBe(403);
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
