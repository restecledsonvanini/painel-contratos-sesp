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

describe('alteracoes API', () => {
  let ready = false;
  let contratoId = '';
  let nextFim = '2030-12-31';

  beforeAll(async () => {
    ready = await dbReady();
    if (!ready) return;
    const db = getPrisma();
    const contrato = await db.contrato.findFirst({
      where: { numeroGms: '456', anoGms: 2025 },
    });
    if (!contrato) throw new Error('Contrato GMS 456 do seed não encontrado');
    contratoId = contrato.id;

    // limpa minutas de testes anteriores
    await db.alteracaoContratual.deleteMany({
      where: { contratoId, situacao: 'MINUTA' },
    });

    const rows = await db.$queryRawUnsafe<Array<{ fim: Date }>>(
      `SELECT fn_data_fim_vigencia_atual($1)::date AS fim`,
      contratoId,
    );
    const atual = rows[0]?.fim ? new Date(rows[0].fim) : new Date(contrato.dataFimVigenciaOriginal);
    const projetada = new Date(atual);
    projetada.setUTCFullYear(projetada.getUTCFullYear() + 1);
    nextFim = projetada.toISOString().slice(0, 10);
  });

  it('simula aditivo de prazo dentro do limite', async () => {
    if (!ready) return;
    const res = await request(app)
      .post(`/api/v1/contracts/${contratoId}/alteracoes/simular`)
      .set('Authorization', 'Bearer gestor')
      .send({
        tipo: 'ADITIVO_PRAZO',
        objetoDescricao: 'Prorrogação teste',
        dataAssinatura: '2026-03-01',
        novaDataFimVigencia: nextFim,
        valorAcrescido: 0,
      });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.dataFimVigenciaProjetada).toBe(nextFim);
  });

  it('rejeita apostilamento com acréscimo de valor', async () => {
    if (!ready) return;
    const res = await request(app)
      .post(`/api/v1/alteracoes/${contratoId}/simular`)
      .set('Authorization', 'Bearer gestor')
      .send({
        tipo: 'APOSTILAMENTO_REAJUSTE',
        objetoDescricao: 'Reajuste inválido',
        dataAssinatura: '2026-03-01',
        valorAcrescido: 1000,
      });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(false);
    expect(res.body.erros.join(' ')).toMatch(/Apostilamento/i);
  });

  it('cria minuta de prorrogação válida', async () => {
    if (!ready) return;
    const res = await request(app)
      .post(`/api/v1/contracts/${contratoId}/alteracoes`)
      .set('Authorization', 'Bearer gestor')
      .send({
        tipo: 'ADITIVO_PRAZO',
        objetoDescricao: 'Minuta de prorrogação',
        dataAssinatura: '2026-06-01',
        novaDataFimVigencia: nextFim,
        situacao: 'MINUTA',
      });
    expect(res.status).toBe(201);
    expect(res.body.tipo).toBe('ADITIVO_PRAZO');
    expect(res.body.situacao).toBe('MINUTA');

    const list = await request(app).get(`/api/v1/contracts/${contratoId}/alteracoes`);
    expect(list.status).toBe(200);
    expect(list.body.length).toBeGreaterThanOrEqual(1);

    await disconnectPrisma();
  });
});
