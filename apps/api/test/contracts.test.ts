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

describe('contracts API integration', () => {
  let ready = false;
  let unidadeId = '';
  let fornecedorId = '';
  let gestorId = '';
  let fiscalId = '';

  beforeAll(async () => {
    ready = await dbReady();
    if (!ready) return;

    const db = getPrisma();
    const suffix = Date.now().toString();
    const rand = Math.floor(Math.random() * 9000) + 1000;

    const unidade = await db.unidadeFsp.create({
      data: { sigla: `T${suffix.slice(-5)}${rand}`.slice(0, 10), nome: `Unidade Teste ${suffix}` },
    });
    const fornecedor = await db.fornecedor.create({
      data: {
        tipoPessoa: 'JURIDICA',
        documento: `${suffix}${rand}`.padStart(14, '0').slice(-14),
        razaoSocial: `Fornecedor ${suffix}`,
        situacao: 'ATIVO',
      },
    });
    const gestor = await db.servidor.create({
      data: {
        nome: `Gestor ${suffix}`,
        cpf: `1${suffix}${rand}`.slice(0, 11).padStart(11, '1'),
        ativo: true,
      },
    });
    const fiscal = await db.servidor.create({
      data: {
        nome: `Fiscal ${suffix}`,
        cpf: `2${suffix}${rand}`.slice(0, 11).padStart(11, '2'),
        ativo: true,
      },
    });

    unidadeId = unidade.id;
    fornecedorId = fornecedor.id;
    gestorId = gestor.id;
    fiscalId = fiscal.id;
  });

  it('health responds ok on legacy and /api/v1', async () => {
    const legacy = await request(app).get('/.netlify/functions/api/health');
    expect(legacy.status).toBe(200);
    expect(legacy.body).toMatchObject({ ok: true });

    const v1 = await request(app).get('/api/v1/health');
    expect(v1.status).toBe(200);
    expect(v1.body).toMatchObject({ ok: true });
  });

  it('rejects invalid create payload with uniform error shape', async () => {
    const res = await request(app).post('/.netlify/functions/api/contracts').send({ numGms: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('creates, updates and deletes a contract with aditivos', async () => {
    if (!ready) {
      console.warn('Skipping DB integration test — DATABASE_URL unreachable');
      return;
    }

    const numGms = Math.floor(Math.random() * 900000) + 100000;

    const createRes = await request(app)
      .post('/.netlify/functions/api/contracts')
      .send({
        numGms,
        anoGms: 2026,
        unidadeFspId: unidadeId,
        gestorId,
        fiscalId,
        fornecedorId,
        modalidade: 'Dispensa',
        objeto: 'Contrato integração',
        valorAnual: 2500,
        dataInicio: '2026-01-01',
        dataFimOrig: '2026-12-31',
        aditivos: [
          {
            numAditivo: 1,
            protocoloAdit: 'AD-IT-1',
            novoFimVigencia: '2027-06-30',
            valorAdicional: 100,
          },
        ],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.id).toBeTruthy();
    expect(createRes.body.valorAnual).toBe(2500);
    expect(createRes.body.aditivos).toHaveLength(1);

    const id = createRes.body.id as string;

    const getRes = await request(app).get(`/.netlify/functions/api/contracts/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.objeto).toBe('Contrato integração');

    const updateRes = await request(app)
      .put(`/.netlify/functions/api/contracts/${id}`)
      .send({ status: 'encerrado', valorAnual: 2600 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('encerrado');
    expect(updateRes.body.valorAnual).toBe(2600);
    expect(updateRes.body.aditivos).toHaveLength(1);

    const deleteRes = await request(app).delete(`/.netlify/functions/api/contracts/${id}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const missing = await request(app).get(`/.netlify/functions/api/contracts/${id}`);
    expect(missing.status).toBe(404);

    const db = getPrisma();
    const leftoverAditivos = await db.aditivo.count({ where: { contratoId: id } });
    expect(leftoverAditivos).toBe(0);

    await disconnectPrisma();
  });
});
