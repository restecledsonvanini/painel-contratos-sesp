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
  let unidadeGestoraId = '';
  let subunidadeId = '';
  let fornecedorId = '';
  let gestorId = '';
  let fiscalId = '';
  let modalidadeCodigo = 'PREGAO_ELETRONICO';

  beforeAll(async () => {
    ready = await dbReady();
    if (!ready) return;

    const db = getPrisma();
    const suffix = Date.now().toString();
    const rand = Math.floor(Math.random() * 9000) + 1000;

    const orgao = await db.orgao.findFirst({ where: { ativo: true, sigla: { not: 'SESP' } } });
    if (!orgao) throw new Error('Nenhum órgão/força no seed');
    const unidade = await db.unidadeOrganizacional.findFirst({
      where: { ativo: true, orgaoId: orgao.id },
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

    unidadeGestoraId = orgao.id;
    subunidadeId = unidade?.id ?? '';
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
        unidadeGestoraId,
        subunidadeId: subunidadeId || undefined,
        gestorId,
        fiscalId,
        fornecedorId,
        modalidade: modalidadeCodigo,
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
    expect(createRes.body.situacao).toBe('VIGENTE');
    expect(createRes.body.responsaveis?.length).toBeGreaterThanOrEqual(2);
    expect(createRes.body.aditivos).toHaveLength(1);

    const id = createRes.body.id as string;

    const getRes = await request(app).get(`/.netlify/functions/api/contracts/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.objeto).toBe('Contrato integração');
    expect(getRes.body.unidadeGestoraId).toBe(unidadeGestoraId);
    expect(getRes.body).toHaveProperty('criadoPor');
    expect(getRes.body).toHaveProperty('atualizadoPor');
    expect(getRes.body).toHaveProperty('createdAt');
    expect(getRes.body).toHaveProperty('updatedAt');

    const updateRes = await request(app)
      .put(`/.netlify/functions/api/contracts/${id}`)
      .send({ status: 'encerrado', valorAnual: 2600 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.situacao).toBe('ENCERRADO');
    expect(updateRes.body.valorAnual).toBe(2600);

    const deleteRes = await request(app).delete(`/.netlify/functions/api/contracts/${id}`);
    expect(deleteRes.status).toBe(200);

    const getAfterDelete = await request(app).get(`/api/v1/contracts/${id}`);
    expect(getAfterDelete.status).toBe(404);
    expect(getAfterDelete.body.error?.code).toBe('NOT_FOUND');
  });

  it('PATCH DISPENSA sem fundamentoLegalId retorna 422', async () => {
    if (!ready) {
      console.warn('Skipping DB integration test — DATABASE_URL unreachable');
      return;
    }

    const db = getPrisma();
    const modalidadeDispensa = await db.dominioValor.findFirst({
      where: {
        codigo: 'DISPENSA',
        ativo: true,
        dominio: { slug: 'modalidade-licitacao' },
      },
    });
    const fundamento = await db.dominioValor.findFirst({
      where: {
        ativo: true,
        codigo: 'ART_75_I',
        dominio: { slug: 'fundamento-legal' },
      },
    });
    if (!modalidadeDispensa || !fundamento) {
      console.warn('Skipping — domínio DISPENSA/ART_75_I ausente no seed');
      return;
    }

    const numGms = Math.floor(Math.random() * 900000) + 100000;
    const createRes = await request(app)
      .post('/api/v1/contracts')
      .set('Authorization', 'Bearer analista')
      .send({
        numGms,
        anoGms: 2026,
        unidadeGestoraId,
        subunidadeId: subunidadeId || undefined,
        gestorId,
        fiscalId,
        fornecedorId,
        modalidade: 'DISPENSA',
        fundamentoLegalId: fundamento.id,
        objeto: 'Contrato dispensa teste fundamento',
        valorAnual: 1000,
        dataInicio: '2026-01-01',
        dataFimOrig: '2026-12-31',
      });
    expect(createRes.status).toBe(201);
    const id = createRes.body.id as string;

    const patchRes = await request(app)
      .patch(`/api/v1/contracts/${id}`)
      .set('Authorization', 'Bearer analista')
      .send({ fundamentoLegalId: null });
    expect(patchRes.status).toBe(422);
    expect(patchRes.body.error?.code).toBe('LEGAL_RULE_VIOLATION');

    await request(app).delete(`/api/v1/contracts/${id}`).set('Authorization', 'Bearer analista');
    await disconnectPrisma();
  });

  it('GET /contracts pagina e omite o grafo pesado', async () => {
    if (!ready) return;
    const res = await request(app)
      .get('/api/v1/contracts')
      .query({ page: 1, pageSize: 2 })
      .set('Authorization', 'Bearer admin');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.meta).toMatchObject({ page: 1, pageSize: 2 });
    expect(res.body.meta.total).toBeGreaterThan(0);
    if (res.body.data[0]) {
      expect(res.body.data[0].itens).toBeUndefined();
      expect(res.body.data[0].alteracoes).toBeUndefined();
    }
  });

  it('GET /contracts filtra por situacao no banco', async () => {
    if (!ready) return;
    const res = await request(app)
      .get('/api/v1/contracts')
      .query({ situacao: 'VIGENTE', pageSize: 100 })
      .set('Authorization', 'Bearer admin');
    expect(res.status).toBe(200);
    for (const row of res.body.data) {
      expect(row.situacao).toBe('VIGENTE');
    }
  });
});
