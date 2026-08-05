import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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

describe('dashboard analitico API', () => {
  let ready = false;
  let contratoId = '';

  beforeAll(async () => {
    ready = await dbReady();
    if (!ready) return;
    const db = getPrisma();
    const contrato = await db.contrato.findFirst({
      where: { numeroGms: '456', anoGms: 2025 },
    });
    if (!contrato) throw new Error('Contrato GMS 456 não encontrado');
    contratoId = contrato.id;
  });

  afterAll(async () => {
    await disconnectPrisma();
  });

  it('retorna KPIs gerais da MV', async () => {
    if (!ready) return;
    const res = await request(app).get('/api/v1/dashboard/kpis');
    expect(res.status).toBe(200);
    expect(Number(res.body.totalContratos)).toBeGreaterThanOrEqual(1);
    expect(Number(res.body.valorSobGestaoCents)).toBeGreaterThan(0);
    expect(res.headers.etag).toBeTruthy();
  });

  it('retorna vencimentos, timeline e limites do contrato', async () => {
    if (!ready) return;
    const venc = await request(app).get('/api/v1/dashboard/vencimentos');
    expect(venc.status).toBe(200);
    expect(Array.isArray(venc.body)).toBe(true);

    const timeline = await request(app).get(`/api/v1/contracts/${contratoId}/timeline`);
    expect(timeline.status).toBe(200);
    expect(timeline.body.length).toBeGreaterThanOrEqual(3);
    expect(timeline.body.some((e: any) => e.tipo === 'INICIO_VIGENCIA')).toBe(true);

    const limites = await request(app).get(`/api/v1/contracts/${contratoId}/limites`);
    expect(limites.status).toBe(200);
    expect(limites.body.limiteAcrescimoPercent).toBe(25);

    const fin = await request(app).get(`/api/v1/contracts/${contratoId}/financeiro`);
    expect(fin.status).toBe(200);
    expect(fin.body.valorGlobalOriginalCents).toBe(480000000);
  });

  it('refresh analytics responde ok', async () => {
    if (!ready) return;
    const res = await request(app)
      .post('/api/v1/admin/refresh-analytics')
      .set('Authorization', 'Bearer admin');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('cobre endpoints estratégicos das 16 perguntas', async () => {
    if (!ready) return;
    const paths = [
      '/api/v1/dashboard/por-orgao',
      '/api/v1/dashboard/custos?agrupar=fonteRecurso',
      '/api/v1/dashboard/aditivos',
      '/api/v1/dashboard/fornecedores',
      '/api/v1/dashboard/fiscalizacao',
      '/api/v1/dashboard/publicidade',
      '/api/v1/dashboard/modalidade',
      '/api/v1/dashboard/frota',
      '/api/v1/dashboard/imoveis',
      '/api/v1/dashboard/postos',
      '/api/v1/dashboard/alimentacao',
      '/api/v1/dashboard/itens',
    ];
    for (const path of paths) {
      const res = await request(app).get(path);
      expect(res.status, path).toBe(200);
      expect(res.body != null, path).toBe(true);
    }
  });
});
