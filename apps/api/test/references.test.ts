import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import referencesRouter from '../src/routes/references';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5432/painel_db';

const prisma = new PrismaClient();

const app = express();
app.use(bodyParser.json());
app.use('/references', referencesRouter);

describe('reference persistence', () => {
  afterEach(async () => {
    await prisma.fornecedor.deleteMany({});
    await prisma.servico.deleteMany({});
  });

  it('persists a fornecedor in the database', async () => {
    const payload = { nome: 'ACME Ltda', cnpj: '12345678000100' };

    const res = await request(app).post('/references/fornecedores').send(payload);

    expect(res.status).toBe(201);
    const created = await prisma.fornecedor.findUnique({ where: { id: res.body.id } });
    expect(created).toMatchObject({ nome: payload.nome, cnpj: payload.cnpj });
  });

  it('persists a servico in the database', async () => {
    const payload = { titulo: 'Monitoramento', descricao: 'Atendimento 24/7' };

    const res = await request(app).post('/references/servicos').send(payload);

    expect(res.status).toBe(201);
    const created = await prisma.servico.findUnique({ where: { id: res.body.id } });
    expect(created).toMatchObject({ titulo: payload.titulo, descricao: payload.descricao });
  });
});
