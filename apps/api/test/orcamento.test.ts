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

describe('orcamento e publicidade API', () => {
  let ready = false;
  let contratoId = '';
  let dotacaoId = '';

  beforeAll(async () => {
    ready = await dbReady();
    if (!ready) return;
    const db = getPrisma();
    const contrato = await db.contrato.findFirst({
      where: { numeroGms: '456', anoGms: 2025 },
    });
    if (!contrato) throw new Error('Contrato GMS 456 do seed não encontrado');
    contratoId = contrato.id;
    const dotacao = await db.dotacaoOrcamentaria.findFirst({
      where: { exercicio: 2025, codigo: '3390.39.00.10.301' },
    });
    if (!dotacao) throw new Error('Dotação demo não encontrada — rode o seed');
    dotacaoId = dotacao.id;
  });

  it('lista dotações e vínculos do contrato', async () => {
    if (!ready) return;
    const list = await request(app).get('/api/v1/dotacoes');
    expect(list.status).toBe(200);
    expect(list.body.length).toBeGreaterThanOrEqual(1);

    const vinculos = await request(app).get(`/api/v1/contracts/${contratoId}/dotacoes`);
    expect(vinculos.status).toBe(200);
    expect(vinculos.body.some((d: any) => d.dotacaoId === dotacaoId)).toBe(true);
  });

  it('lista empenhos e publicações do contrato', async () => {
    if (!ready) return;
    const empenhos = await request(app).get(`/api/v1/contracts/${contratoId}/empenhos`);
    expect(empenhos.status).toBe(200);
    expect(empenhos.body.length).toBeGreaterThanOrEqual(1);

    const pubs = await request(app).get(`/api/v1/contracts/${contratoId}/publicacoes`);
    expect(pubs.status).toBe(200);
    expect(pubs.body.length).toBeGreaterThanOrEqual(1);
    expect(pubs.body[0].veiculo?.codigo).toBe('PNCP');
  });

  it('cria documento de metadados no contrato', async () => {
    if (!ready) return;
    const res = await request(app)
      .post(`/api/v1/contracts/${contratoId}/documentos`)
      .send({
        tipoDocumentoCodigo: 'NOTA_EMPENHO',
        nome: 'Nota de empenho teste',
        urlExterna: 'https://example.local/ne.pdf',
      });
    expect(res.status).toBe(201);
    expect(res.body.nome).toBe('Nota de empenho teste');
    expect(res.body.tipoDocumento?.codigo).toBe('NOTA_EMPENHO');

    await disconnectPrisma();
  });
});
