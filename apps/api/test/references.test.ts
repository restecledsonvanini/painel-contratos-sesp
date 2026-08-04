import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/index';
import { disconnectPrisma, getPrisma } from '../src/lib/prisma';

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

describe('references API integration', () => {
  let ready = false;
  const createdFornecedorIds: string[] = [];
  const createdServicoIds: string[] = [];

  beforeAll(async () => {
    ready = await dbReady();
  });

  afterEach(async () => {
    if (!ready) return;
    const db = getPrisma();
    if (createdFornecedorIds.length) {
      await db.fornecedor.deleteMany({ where: { id: { in: createdFornecedorIds.splice(0) } } });
    }
    if (createdServicoIds.length) {
      await db.servico.deleteMany({ where: { id: { in: createdServicoIds.splice(0) } } });
    }
  });

  it('persists fornecedor CRUD', async () => {
    if (!ready) {
      console.warn('Skipping references integration — DATABASE_URL unreachable');
      return;
    }

    const cnpj = `${Date.now()}`.padStart(14, '9').slice(0, 14);
    const createRes = await request(app)
      .post('/.netlify/functions/api/references/fornecedores')
      .send({ nome: 'ACME Ltda', cnpj });

    expect(createRes.status).toBe(201);
    createdFornecedorIds.push(createRes.body.id);

    const listRes = await request(app).get('/.netlify/functions/api/references/fornecedores');
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((item: any) => item.id === createRes.body.id)).toBe(true);

    const updateRes = await request(app)
      .put(`/.netlify/functions/api/references/fornecedores/${createRes.body.id}`)
      .send({ nome: 'ACME Atualizada' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.nome).toBe('ACME Atualizada');

    const deleteRes = await request(app).delete(
      `/.netlify/functions/api/references/fornecedores/${createRes.body.id}`
    );
    expect(deleteRes.status).toBe(200);
    createdFornecedorIds.pop();
  });

  it('persists servico and validates payload', async () => {
    if (!ready) return;

    const invalid = await request(app).post('/.netlify/functions/api/references/servicos').send({});
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.code).toBe('VALIDATION_ERROR');

    const createRes = await request(app)
      .post('/.netlify/functions/api/references/servicos')
      .send({ titulo: 'Monitoramento', descricao: '24/7' });
    expect(createRes.status).toBe(201);
    createdServicoIds.push(createRes.body.id);

    const getRes = await request(app).get(
      `/.netlify/functions/api/references/servicos/${createRes.body.id}`
    );
    expect(getRes.status).toBe(200);
    expect(getRes.body.titulo).toBe('Monitoramento');

    await request(app).delete(`/.netlify/functions/api/references/servicos/${createRes.body.id}`);
    createdServicoIds.pop();
    await disconnectPrisma();
  });
});
