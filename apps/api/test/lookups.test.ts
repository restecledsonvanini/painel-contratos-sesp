import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';
import { DominioValorCreateSchema } from '@painel/schema';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';
process.env.VITEST = 'true';

describe('lookups API', () => {
  it('validates dominio valor create schema', () => {
    expect(DominioValorCreateSchema.parse({ codigo: 'X', label: 'X' })).toMatchObject({
      codigo: 'X',
      label: 'X',
    });
  });

  it('GET /api/v1/lookups returns dominios and orgaos', async () => {
    const res = await request(app).get('/api/v1/lookups');
    if (res.status === 503) {
      console.warn('Skipping — database unavailable');
      return;
    }
    expect(res.status).toBe(200);
    expect(res.body.dominios['modalidade-licitacao']).toBeTruthy();
    expect(Array.isArray(res.body.orgaos)).toBe(true);
    expect(res.headers.etag).toBeTruthy();
  });

  it('GET /api/v1/lookups/municipios?q=curi finds Curitiba', async () => {
    const res = await request(app).get('/api/v1/lookups/municipios').query({ q: 'curi' });
    if (res.status === 503) {
      console.warn('Skipping — database unavailable');
      return;
    }
    expect(res.status).toBe(200);
    expect(res.body.data.some((m: { nome?: string; label?: string }) =>
      String(m.label || m.nome || '').toLowerCase().includes('curitiba'),
    )).toBe(true);
  });

  it('CRUD valor em dominio editavel', async () => {
    const create = await request(app)
      .post('/api/v1/dominios/unidade-medida/valores')
      .send({ codigo: `TEST_${Date.now()}`, label: 'Unidade teste', ordem: 99 });
    if (create.status === 503) {
      console.warn('Skipping — database unavailable');
      return;
    }
    expect(create.status).toBe(201);
    expect(create.body.id).toBeTruthy();

    const del = await request(app).delete(
      `/api/v1/dominios/unidade-medida/valores/${create.body.id}`,
    );
    expect(del.status).toBe(200);
    expect(del.body.ativo).toBe(false);
  });
});
