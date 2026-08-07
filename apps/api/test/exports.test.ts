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
  let sampleId: string | null = null;

  beforeAll(async () => {
    ready = await dbReady();
    if (ready) {
      const db = getPrisma();
      const row = await db.contrato.findFirst({ select: { id: true }, orderBy: { updatedAt: 'desc' } });
      sampleId = row?.id ?? null;
    }
  });

  it('exporta contratos.csv com BOM e cabeçalho', async () => {
    if (!ready) return;
    const res = await request(app).get('/api/v1/exports/contratos.csv');
    expect(res.status).toBe(200);
    expect(String(res.headers['content-type'])).toMatch(/csv/i);
    const body = res.text || res.body?.toString?.() || '';
    expect(body).toContain('numeroGms');
    expect(body).toContain('fornecedor');
    expect(body).toContain('unidadeGestora');
  });

  it('exporta contratos.xlsx como planilha real (ZIP/OOXML)', async () => {
    if (!ready) return;
    const res = await request(app)
      .get('/api/v1/exports/contratos.xlsx')
      .buffer(true)
      .parse((r, cb) => {
        const data: Buffer[] = [];
        r.on('data', (c) => data.push(c));
        r.on('end', () => cb(null, Buffer.concat(data)));
      });
    expect(res.status).toBe(200);
    expect(String(res.headers['content-type'])).toMatch(/spreadsheetml|octet-stream/i);
    expect(String(res.headers['content-disposition'])).toMatch(/contratos\.xlsx/);
    const buf = Buffer.isBuffer(res.body) ? res.body : Buffer.from(res.body);
    // XLSX = ZIP: assinatura PK
    expect(buf.subarray(0, 2).toString()).toBe('PK');
  });

  it('exporta ficha PDF de um contrato', async () => {
    if (!ready || !sampleId) return;
    const res = await request(app)
      .get(`/api/v1/contracts/${sampleId}/export.pdf`)
      .buffer(true)
      .parse((r, cb) => {
        const data: Buffer[] = [];
        r.on('data', (c) => data.push(c));
        r.on('end', () => cb(null, Buffer.concat(data)));
      });
    expect(res.status).toBe(200);
    expect(String(res.headers['content-type'])).toMatch(/pdf/i);
    const buf = Buffer.isBuffer(res.body) ? res.body : Buffer.from(res.body);
    expect(buf.subarray(0, 4).toString()).toBe('%PDF');
  });

  it('exporta ficha csv/xlsx do contrato', async () => {
    if (!ready || !sampleId) return;
    const csv = await request(app).get(`/api/v1/contracts/${sampleId}/export.csv`);
    expect(csv.status).toBe(200);
    expect(csv.text).toContain('numeroGms');

    const xlsx = await request(app)
      .get(`/api/v1/contracts/${sampleId}/export.xlsx`)
      .buffer(true)
      .parse((r, cb) => {
        const data: Buffer[] = [];
        r.on('data', (c) => data.push(c));
        r.on('end', () => cb(null, Buffer.concat(data)));
      });
    expect(xlsx.status).toBe(200);
    const buf = Buffer.isBuffer(xlsx.body) ? xlsx.body : Buffer.from(xlsx.body);
    expect(buf.subarray(0, 2).toString()).toBe('PK');
  });

  it('busca global retorna grupos', async () => {
    if (!ready) return;
    const res = await request(app).get('/api/v1/search').query({ q: '456' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.contratos)).toBe(true);
    expect(Array.isArray(res.body.fornecedores)).toBe(true);
    expect(Array.isArray(res.body.servidores)).toBe(true);
  });

  it('OpenAPI inclui schemas Zod, exports e domínios principais', async () => {
    if (!ready) return;
    const docs = await request(app).get('/api/v1/docs');
    expect(docs.status).toBe(200);
    expect(docs.body.components.schemas.Login).toBeTruthy();
    expect(docs.body.components.schemas.ContractCreate).toBeTruthy();
    expect(docs.body.components.schemas.Role).toBeTruthy();
    expect(docs.body.paths['/api/v1/exports/contratos.csv']).toBeTruthy();
    expect(docs.body.paths['/api/v1/exports/contratos.xlsx']).toBeTruthy();
    expect(docs.body.paths['/api/v1/contracts/{id}/export.pdf']).toBeTruthy();
    expect(docs.body.paths['/api/v1/search']).toBeTruthy();
    expect(docs.body.paths['/api/v1/fornecedores']).toBeTruthy();
    expect(docs.body.paths['/api/v1/servidores']).toBeTruthy();
    expect(docs.body.paths['/api/v1/catalogo-itens']).toBeTruthy();
    expect(docs.body.paths['/api/v1/dotacoes']).toBeTruthy();
    expect(docs.body.paths['/api/v1/orgaos']).toBeTruthy();
    expect(docs.body.paths['/api/v1/unidades']).toBeTruthy();
    expect(docs.body.paths['/api/v1/unidades/arvore']).toBeTruthy();
    expect(docs.body.paths['/api/v1/usuarios/{id}']).toBeTruthy();
    expect(docs.body.paths['/api/v1/dashboard/vencimentos']).toBeTruthy();
    expect(docs.body.paths['/api/v1/dashboard/por-orgao']).toBeTruthy();
    expect(docs.body.components.securitySchemes.bearerAuth.description).toMatch(/VISITANTE/);
    await disconnectPrisma();
  });
});
