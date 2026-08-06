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
      .set('Authorization', 'Bearer admin')
      .send({ codigo: `TEST_${Date.now()}`, label: 'Unidade teste', ordem: 99 });
    if (create.status === 503) {
      console.warn('Skipping — database unavailable');
      return;
    }
    expect(create.status).toBe(201);
    expect(create.body.id).toBeTruthy();

    const del = await request(app)
      .delete(`/api/v1/dominios/unidade-medida/valores/${create.body.id}`)
      .set('Authorization', 'Bearer admin');
    expect(del.status).toBe(200);
    expect(del.body.ativo).toBe(false);
  });

  it('GET /orgaos/arvore e /unidades/arvore: SESP raiz com forças filhas', async () => {
    const orgaos = await request(app).get('/api/v1/orgaos/arvore');
    const unidades = await request(app).get('/api/v1/unidades/arvore');
    if (orgaos.status === 503) {
      console.warn('Skipping — database unavailable');
      return;
    }
    expect(orgaos.status).toBe(200);
    expect(unidades.status).toBe(200);
    expect(orgaos.body).toEqual(unidades.body);

    const roots = orgaos.body as Array<{
      sigla: string;
      kind: string;
      children: Array<{ sigla: string; kind: string; children?: unknown[] }>;
    }>;
    expect(roots[0]?.sigla).toBe('SESP');
    expect(roots[0]?.kind).toBe('orgao');

    const forcas = roots[0].children.filter((c) => c.kind === 'orgao').map((c) => c.sigla);
    expect(forcas).toEqual(expect.arrayContaining(['PMPR', 'PCPR', 'CBMPR', 'DEPPEN', 'PCP', 'DETRAN']));
    expect(forcas).not.toContain('SESP');

    const pmpr = roots[0].children.find((c) => c.sigla === 'PMPR');
    expect(pmpr?.kind).toBe('orgao');
    const sedes = (pmpr?.children ?? []).filter((c: { kind?: string }) => c.kind === 'unidade');
    expect(sedes.length).toBeGreaterThanOrEqual(1);
    expect(sedes.some((s: { sigla?: string }) => s.sigla === 'CG-PMPR')).toBe(true);
  });

  it('listagem de órgãos inclui parentId das forças sob SESP', async () => {
    const res = await request(app).get('/api/v1/orgaos');
    if (res.status === 503) {
      console.warn('Skipping — database unavailable');
      return;
    }
    expect(res.status).toBe(200);
    const list = res.body as Array<{ sigla: string; parentId: string | null; parent?: { sigla: string } }>;
    const sesp = list.find((o) => o.sigla === 'SESP');
    const pmpr = list.find((o) => o.sigla === 'PMPR');
    expect(sesp?.parentId).toBeNull();
    expect(pmpr?.parentId).toBe(sesp?.id);
    expect(pmpr?.parent?.sigla).toBe('SESP');
  });
});
