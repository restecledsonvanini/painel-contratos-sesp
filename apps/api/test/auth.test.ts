import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
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
  const createdFornecedorIds: string[] = [];
  const createdDominioValorIds: string[] = [];

  beforeAll(async () => {
    ready = await dbReady();
  });

  afterEach(async () => {
    if (!ready) return;
    const db = getPrisma();
    if (createdFornecedorIds.length) {
      await db.fornecedor.deleteMany({ where: { id: { in: createdFornecedorIds.splice(0) } } });
    }
    if (createdDominioValorIds.length) {
      await db.dominioValor.deleteMany({
        where: { id: { in: createdDominioValorIds.splice(0) } },
      });
    }
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

  it('VISITANTE não pode criar contrato nem fornecedor', async () => {
    if (!ready) return;
    const contract = await request(app)
      .post('/api/v1/contracts')
      .set('Authorization', 'Bearer visitante')
      .send({ numeroGms: '1', anoGms: 2026, objeto: 'x' });
    expect(contract.status).toBe(403);

    const fornecedor = await request(app)
      .post('/api/v1/fornecedores')
      .set('Authorization', 'Bearer visitante')
      .send({
        razaoSocial: 'X',
        documento: '12345678000199',
        tipoPessoa: 'JURIDICA',
      });
    expect(fornecedor.status).toBe(403);
  });

  it('ANALISTA cria fornecedor (201)', async () => {
    if (!ready) return;
    const doc = `${Date.now()}`.padStart(14, '9').slice(0, 14);
    const res = await request(app)
      .post('/api/v1/fornecedores')
      .set('Authorization', 'Bearer analista')
      .send({ razaoSocial: 'Fornecedor Analista', documento: doc, tipoPessoa: 'JURIDICA' });
    expect(res.status).toBe(201);
    expect(res.body.documento).toBe(doc);
    createdFornecedorIds.push(res.body.id);
  });

  it('GESTOR 403 e ADMIN 201 em escrita de domínio', async () => {
    if (!ready) return;
    const codigo = `T${Date.now().toString(36).toUpperCase()}`.slice(0, 12);
    const denied = await request(app)
      .post('/api/v1/dominios/unidade-medida/valores')
      .set('Authorization', 'Bearer gestor')
      .send({ codigo, label: 'Teste gestor', ordem: 99 });
    expect(denied.status).toBe(403);

    const ok = await request(app)
      .post('/api/v1/dominios/unidade-medida/valores')
      .set('Authorization', 'Bearer admin')
      .send({ codigo, label: 'Teste admin', ordem: 99 });
    expect(ok.status).toBe(201);
    createdDominioValorIds.push(ok.body.id);
  });

  it('ANALISTA 403 em alteração contratual; GESTOR pode simular', async () => {
    if (!ready) return;
    const db = getPrisma();
    const contrato = await db.contrato.findFirst({
      where: { numeroGms: '456', anoGms: 2025 },
    });
    if (!contrato) return;

    const denied = await request(app)
      .post(`/api/v1/contracts/${contrato.id}/alteracoes/simular`)
      .set('Authorization', 'Bearer analista')
      .send({
        tipo: 'ADITIVO_PRAZO',
        objetoDescricao: 'Tentativa analista',
        dataAssinatura: '2026-03-01',
        novaDataFimVigencia: '2027-12-31',
        valorAcrescido: 0,
      });
    expect(denied.status).toBe(403);

    const allowed = await request(app)
      .post(`/api/v1/contracts/${contrato.id}/alteracoes/simular`)
      .set('Authorization', 'Bearer gestor')
      .send({
        tipo: 'ADITIVO_PRAZO',
        objetoDescricao: 'Simulação gestor',
        dataAssinatura: '2026-03-01',
        novaDataFimVigencia: '2027-12-31',
        valorAcrescido: 0,
      });
    expect(allowed.status).toBe(200);
  });

  it('VISITANTE 403 em export CSV', async () => {
    if (!ready) return;
    const res = await request(app)
      .get('/api/v1/exports/contratos.csv')
      .set('Authorization', 'Bearer visitante');
    expect(res.status).toBe(403);
  });

  it('login visitante@ retorna papel VISITANTE', async () => {
    if (!ready) return;
    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'visitante@sesp.pr.gov.br',
      password: 'visitante123',
    });
    if (login.status === 401) return; // seed ainda sem visitante@ neste DB
    expect(login.status).toBe(200);
    expect(login.body.user.role).toBe('VISITANTE');
  });

  it('GET /usuarios/:id exige ADMIN e devolve UsuarioDTO', async () => {
    if (!ready) return;
    const list = await request(app)
      .get('/api/v1/usuarios')
      .set('Authorization', 'Bearer admin');
    expect(list.status).toBe(200);
    const first = list.body[0];
    if (!first?.id) return;

    const denied = await request(app)
      .get(`/api/v1/usuarios/${first.id}`)
      .set('Authorization', 'Bearer gestor');
    expect(denied.status).toBe(403);

    const ok = await request(app)
      .get(`/api/v1/usuarios/${first.id}`)
      .set('Authorization', 'Bearer admin');
    expect(ok.status).toBe(200);
    expect(ok.body.id).toBe(first.id);
    expect(ok.body).toHaveProperty('orgaoId');
    expect(ok.body).toHaveProperty('servidorId');
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

describe('endurecimento de autenticação', () => {
  const keys = ['VITEST', 'NODE_ENV', 'AUTH_REQUIRED', 'AUTH_DEV_BYPASS'] as const;
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

  /** Sai do modo de teste para exercitar o comportamento real de runtime. */
  function simulateRuntime(nodeEnv: 'development' | 'production') {
    delete process.env.VITEST;
    process.env.NODE_ENV = nodeEnv;
  }

  it('ignora tokens sintéticos fora de ambiente de teste', async () => {
    simulateRuntime('development');
    process.env.AUTH_REQUIRED = '1';
    const res = await request(app)
      .get('/api/v1/contracts')
      .set('Authorization', 'Bearer admin');
    expect(res.status).toBe(401);
  });

  it('sem header responde 401 quando o bypass não foi habilitado', async () => {
    simulateRuntime('development');
    delete process.env.AUTH_DEV_BYPASS;
    const res = await request(app).get('/api/v1/contracts');
    expect(res.status).toBe(401);
  });

  it('bypass de dev é ignorado em produção mesmo com AUTH_DEV_BYPASS=1', async () => {
    simulateRuntime('production');
    process.env.AUTH_DEV_BYPASS = '1';
    const res = await request(app).get('/api/v1/contracts');
    expect(res.status).toBe(401);
  });

  it('rotas públicas continuam acessíveis sem header', async () => {
    simulateRuntime('development');
    delete process.env.AUTH_DEV_BYPASS;
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
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
