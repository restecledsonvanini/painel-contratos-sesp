import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/index';
import { contractsToCsv } from '../src/services/exportService';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';
process.env.VITEST = 'true';
process.env.AUTH_EMAIL_DOMAINS ||= '*';

describe('cabeçalhos de segurança', () => {
  it('aplica helmet e omite o X-Powered-By', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('não emite CORS enquanto CORS_ORIGINS não for configurado', async () => {
    const res = await request(app)
      .get('/api/v1/health')
      .set('Origin', 'https://exemplo-malicioso.test');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('superfície pública', () => {
  const keys = ['AUTH_REQUIRED', 'AUTH_DEV_BYPASS', 'VITEST'] as const;
  let saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
    process.env.AUTH_REQUIRED = '1';
  });

  afterEach(() => {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it('mantém /health e /health/db abertos', async () => {
    expect((await request(app).get('/api/v1/health')).status).toBe(200);
    expect([200, 503]).toContain((await request(app).get('/api/v1/health/db')).status);
  });

  it('não libera caminhos que apenas contenham um segmento health', async () => {
    // O regex antigo (/\/health(\/|$)/) dispensava auth em qualquer caminho assim.
    const res = await request(app).get('/api/v1/health/nao-existe');
    expect(res.status).toBe(401);
  });

  it('/metrics e /docs exigem ADMIN', async () => {
    for (const rota of ['/api/v1/metrics', '/api/v1/docs']) {
      const anonimo = await request(app).get(rota);
      expect(anonimo.status, `${rota} anônimo`).toBe(401);

      const visitante = await request(app).get(rota).set('Authorization', 'Bearer visitante');
      expect(visitante.status, `${rota} visitante`).toBe(403);

      const admin = await request(app).get(rota).set('Authorization', 'Bearer admin');
      expect(admin.status, `${rota} admin`).toBe(200);
    }
  });
});

describe('rate limit de login', () => {
  const keys = ['TEST_RATE_LIMIT', 'AUTH_LOGIN_RATE_MAX'] as const;
  let saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  });

  afterEach(() => {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it('bloqueia com 429 após estourar o limite', async () => {
    process.env.TEST_RATE_LIMIT = '1';
    process.env.AUTH_LOGIN_RATE_MAX = '3';
    // A chave inclui o e-mail; um endereço único evita herdar contagem de outro teste.
    const email = `brute-${Date.now()}@sesp.pr.gov.br`;

    const statuses: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password: 'senha-errada' });
      statuses.push(res.status);
    }

    expect(statuses.slice(0, 3).every((s) => s !== 429)).toBe(true);
    expect(statuses[3]).toBe(429);
  });

  it('login bem-sucedido não consome cota', async () => {
    process.env.TEST_RATE_LIMIT = '1';
    process.env.AUTH_LOGIN_RATE_MAX = '2';
    const credenciais = { email: 'admin@sesp.pr.gov.br', password: 'admin123' };

    const statuses: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      const res = await request(app).post('/api/v1/auth/login').send(credenciais);
      statuses.push(res.status);
    }
    if (statuses[0] === 401) return; // banco sem os usuários demo
    expect(statuses.every((s) => s === 200)).toBe(true);
  });

  it('não limita quando o e-mail é outro', async () => {
    process.env.TEST_RATE_LIMIT = '1';
    process.env.AUTH_LOGIN_RATE_MAX = '1';
    const primeiro = `alvo-${Date.now()}@sesp.pr.gov.br`;
    const outro = `vizinho-${Date.now()}@sesp.pr.gov.br`;

    await request(app).post('/api/v1/auth/login').send({ email: primeiro, password: 'x' });
    const bloqueado = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: primeiro, password: 'x' });
    expect(bloqueado.status).toBe(429);

    const vizinho = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: outro, password: 'x' });
    expect(vizinho.status).not.toBe(429);
  });
});

describe('CSV injection', () => {
  it('neutraliza células iniciadas por caractere de fórmula', () => {
    const rows = [
      { id: 'x', numeroGms: '1', anoGms: 2026, objeto: '=HYPERLINK("http://mal.test")' },
      { id: 'y', numeroGms: '2', anoGms: 2026, objeto: '+1+1' },
      { id: 'z', numeroGms: '3', anoGms: 2026, objeto: 'Objeto normal' },
    ] as never;

    const csv = contractsToCsv(rows);
    expect(csv).toContain(`"'=HYPERLINK(""http://mal.test"")"`);
    expect(csv).toContain(`'+1+1`);
    expect(csv).toContain('Objeto normal');
    expect(csv).not.toContain(',=HYPERLINK');
  });
});
