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

describe('alertas, importação e observabilidade', () => {
  let ready = false;

  beforeAll(async () => {
    ready = await dbReady();
  });

  it('health, health/db, docs e metrics', async () => {
    if (!ready) return;
    const health = await request(app).get('/api/v1/health');
    expect(health.status).toBe(200);
    expect(health.body.ok).toBe(true);

    const db = await request(app).get('/api/v1/health/db');
    expect(db.status).toBe(200);
    expect(db.body.ok).toBe(true);

    const docs = await request(app).get('/api/v1/docs');
    expect(docs.status).toBe(200);
    expect(docs.body.openapi).toBe('3.0.3');
    expect(docs.body.paths['/api/v1/alertas']).toBeTruthy();

    const metrics = await request(app).get('/api/v1/metrics');
    expect(metrics.status).toBe(200);
    expect(metrics.body.service).toBe('painel-contratos-api');
  });

  it('gera alertas idempotente e lista/reconhece', async () => {
    if (!ready) return;
    const gerar1 = await request(app).post('/api/v1/admin/gerar-alertas');
    expect(gerar1.status).toBe(200);
    expect(gerar1.body.ok).toBe(true);

    const gerar2 = await request(app).post('/api/v1/admin/gerar-alertas');
    expect(gerar2.status).toBe(200);
    expect(gerar2.body.created).toBe(0);

    const list = await request(app).get('/api/v1/alertas');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);

    if (list.body.length) {
      const id = list.body[0].id;
      const ack = await request(app).post(`/api/v1/alertas/${id}/reconhecer`);
      expect(ack.status).toBe(200);
      expect(ack.body.reconhecidoEm).toBeTruthy();
    }
  });

  it('importação CSV dry-run e aplica linhas válidas', async () => {
    if (!ready) return;
    const doc = `${Date.now().toString().slice(-12)}99`;
    const csv = [
      'documento,razaoSocial,tipoPessoa,nomeFantasia',
      `${doc},Fornecedor Import Teste SA,JURIDICA,Import Test`,
      '00011122233,Linha Invalida CNPJ Curto,JURIDICA,',
    ].join('\n');

    const dry = await request(app).post('/api/v1/importacoes').send({
      nomeArquivo: 'teste.csv',
      tipoEntidade: 'fornecedor',
      csv,
    });
    expect(dry.status).toBe(201);
    expect(dry.body.linhasValidas).toBe(1);
    expect(dry.body.linhasComErro).toBe(1);
    expect(dry.body.situacao).toBe('VALIDADO');

    const applyFail = await request(app).post(`/api/v1/importacoes/${dry.body.id}/aplicar`);
    expect(applyFail.status).toBe(400);

    const csvOk = [
      'documento,razaoSocial,tipoPessoa,nomeFantasia',
      `${doc},Fornecedor Import Teste SA,JURIDICA,Import Test`,
    ].join('\n');
    const dryOk = await request(app).post('/api/v1/importacoes').send({
      nomeArquivo: 'teste-ok.csv',
      tipoEntidade: 'fornecedor',
      csv: csvOk,
    });
    expect(dryOk.status).toBe(201);
    expect(dryOk.body.linhasComErro).toBe(0);

    const applied = await request(app).post(`/api/v1/importacoes/${dryOk.body.id}/aplicar`);
    expect(applied.status).toBe(200);
    expect(applied.body.situacao).toBe('APLICADO');
    expect(applied.body.linhas[0].registroCriadoId).toBeTruthy();

    const get = await request(app).get(`/api/v1/importacoes/${dryOk.body.id}`);
    expect(get.status).toBe(200);
    expect(get.body.situacao).toBe('APLICADO');

    await disconnectPrisma();
  });
});
