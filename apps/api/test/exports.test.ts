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

describe('exports, search e openapi schemas', () => {
  let ready = false;

  beforeAll(async () => {
    ready = await dbReady();
  });

  it('exporta contratos.csv com BOM e cabeçalho', async () => {
    if (!ready) return;
    const res = await request(app).get('/api/v1/exports/contratos.csv');
    expect(res.status).toBe(200);
    expect(String(res.headers['content-type'])).toMatch(/csv|excel/i);
    const body = res.text || res.body?.toString?.() || '';
    expect(body).toContain('numeroGms');
    expect(body).toContain('fornecedor');
  });

  it('busca global retorna grupos', async () => {
    if (!ready) return;
    const res = await request(app).get('/api/v1/search').query({ q: '456' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.contratos)).toBe(true);
    expect(Array.isArray(res.body.fornecedores)).toBe(true);
    expect(Array.isArray(res.body.servidores)).toBe(true);
  });

  it('OpenAPI inclui schemas Zod e exports', async () => {
    if (!ready) return;
    const docs = await request(app).get('/api/v1/docs');
    expect(docs.status).toBe(200);
    expect(docs.body.components.schemas.Login).toBeTruthy();
    expect(docs.body.components.schemas.ContractCreate).toBeTruthy();
    expect(docs.body.paths['/api/v1/exports/contratos.csv']).toBeTruthy();
    expect(docs.body.paths['/api/v1/search']).toBeTruthy();
    await disconnectPrisma();
  });
});
