import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/index';
import { getPrisma } from '../src/lib/prisma';
import { signJwt } from '../src/lib/jwt';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';
process.env.VITEST = 'true';

/**
 * Escopo de órgão (IDOR).
 *
 * Os tokens sintéticos (`Bearer gestor`) não têm órgão e por isso ficam fora
 * do escopo, então estes testes criam usuários reais e assinam JWTs para eles.
 */
describe('escopo de órgão', () => {
  let ready = false;
  /** Contrato do órgão do usuário sob teste. */
  let contratoProprio = '';
  /** Contrato de outro órgão: todo acesso deve ser negado. */
  let contratoAlheio = '';
  let tokenGestorComOrgao = '';
  let tokenSemOrgao = '';
  const createdUserIds: string[] = [];

  async function createUser(email: string, role: string, orgaoId: string | null) {
    const db = getPrisma();
    const user = await db.usuario.upsert({
      where: { email },
      update: { role: role as never, orgaoId, ativo: true },
      create: { email, nome: `Teste ${role}`, role: role as never, orgaoId, ativo: true },
    });
    createdUserIds.push(user.id);
    return signJwt({ sub: user.id, email: user.email, role, orgaoId });
  }

  beforeAll(async () => {
    try {
      const db = getPrisma();
      await db.$queryRaw`SELECT 1`;
      ready = true;
    } catch {
      return;
    }

    const db = getPrisma();
    const contratos = await db.contrato.findMany({
      select: { id: true, unidadeGestoraId: true },
    });
    const orgaos = [...new Set(contratos.map((c) => c.unidadeGestoraId))];
    // Precisa de dois órgãos distintos com contrato para haver o que separar.
    if (orgaos.length < 2) {
      ready = false;
      return;
    }

    const proprio = contratos.find((c) => c.unidadeGestoraId === orgaos[0])!;
    const alheio = contratos.find((c) => c.unidadeGestoraId === orgaos[1])!;
    contratoProprio = proprio.id;
    contratoAlheio = alheio.id;

    tokenGestorComOrgao = await createUser(
      'escopo-gestor@teste.local',
      'GESTOR',
      proprio.unidadeGestoraId,
    );
    tokenSemOrgao = await createUser('escopo-sem-orgao@teste.local', 'GESTOR', null);
  });

  afterAll(async () => {
    if (!createdUserIds.length) return;
    await getPrisma().usuario.deleteMany({ where: { id: { in: createdUserIds } } });
  });

  function asGestor(path: string) {
    return request(app).get(path).set('Authorization', `Bearer ${tokenGestorComOrgao}`);
  }

  it('permite o contrato do próprio órgão', async () => {
    if (!ready) return;
    const res = await asGestor(`/api/v1/contracts/${contratoProprio}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(contratoProprio);
  });

  it('nega o contrato de outro órgão', async () => {
    if (!ready) return;
    const res = await asGestor(`/api/v1/contracts/${contratoAlheio}`);
    expect(res.status).toBe(403);
  });

  it('nega os recursos aninhados de contrato de outro órgão', async () => {
    if (!ready) return;
    const rotas = [
      `/api/v1/contracts/${contratoAlheio}/alteracoes`,
      `/api/v1/contracts/${contratoAlheio}/empenhos`,
      `/api/v1/contracts/${contratoAlheio}/dotacoes`,
      `/api/v1/contracts/${contratoAlheio}/publicacoes`,
      `/api/v1/contracts/${contratoAlheio}/documentos`,
      `/api/v1/contracts/${contratoAlheio}/timeline`,
      `/api/v1/contracts/${contratoAlheio}/financeiro`,
      `/api/v1/contracts/${contratoAlheio}/auditoria`,
    ];
    for (const rota of rotas) {
      const res = await asGestor(rota);
      expect(res.status, rota).toBe(403);
    }
  });

  it('nega escrita em contrato de outro órgão', async () => {
    if (!ready) return;
    const simular = await request(app)
      .post(`/api/v1/contracts/${contratoAlheio}/alteracoes/simular`)
      .set('Authorization', `Bearer ${tokenGestorComOrgao}`)
      .send({
        tipo: 'ADITIVO_PRAZO',
        objetoDescricao: 'Tentativa fora de escopo',
        dataAssinatura: '2026-03-01',
        novaDataFimVigencia: '2027-12-31',
        valorAcrescido: 0,
      });
    expect(simular.status).toBe(403);

    const remocao = await request(app)
      .delete(`/api/v1/contracts/${contratoAlheio}`)
      .set('Authorization', `Bearer ${tokenGestorComOrgao}`);
    expect(remocao.status).toBe(403);
  });

  it('nega export de contrato de outro órgão', async () => {
    if (!ready) return;
    const res = await asGestor(`/api/v1/contracts/${contratoAlheio}/export.csv`);
    expect(res.status).toBe(403);
  });

  it('lista só contratos do próprio órgão', async () => {
    if (!ready) return;
    const res = await asGestor('/api/v1/contracts');
    expect(res.status).toBe(200);
    const ids = (res.body.data ?? res.body).map((c: { id: string }) => c.id);
    expect(ids).toContain(contratoProprio);
    expect(ids).not.toContain(contratoAlheio);
  });

  it('usuário demo do seed tem órgão e continua listando contratos', async () => {
    if (!ready) return;
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'analista@sesp.pr.gov.br', password: 'analista123' });
    if (login.status === 401) return; // banco sem os usuários demo
    expect(login.body.user.orgaoId).toBeTruthy();

    const res = await request(app)
      .get('/api/v1/contracts')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
  });

  it('usuário não-ADMIN sem órgão é negado em vez de ver tudo', async () => {
    if (!ready) return;
    const res = await request(app)
      .get('/api/v1/contracts')
      .set('Authorization', `Bearer ${tokenSemOrgao}`);
    expect(res.status).toBe(403);
  });
});
