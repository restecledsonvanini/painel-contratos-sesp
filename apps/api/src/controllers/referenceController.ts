import { Request, Response } from 'express';
import {
  EmpresaCreateSchema,
  EmpresaUpdateSchema,
  EntidadeGestoraCreateSchema,
  EntidadeGestoraUpdateSchema,
  FornecedorCreateSchema,
  FornecedorUpdateSchema,
  ServicoCreateSchema,
  ServicoUpdateSchema,
  UnidadeFspCreateSchema,
  UnidadeFspUpdateSchema,
} from '../../../../packages/schema/src/contracts';
import { getActorId, writeAuditLog } from '../lib/audit';
import { notFound } from '../lib/errors';
import { getPrisma } from '../lib/prisma';

async function auditRef(tabela: string, registroId: string, action: string, req: Request, diff?: unknown) {
  await writeAuditLog({
    tabela,
    registroId,
    action,
    diff,
    changedBy: getActorId(req),
    source: 'api',
  });
}

export async function listUnidadesFsp(_req: Request, res: Response) {
  const db = getPrisma();
  const unidades = await db.unidadeFsp.findMany({ orderBy: { nome: 'asc' } });
  return res.status(200).json(unidades);
}

export async function createUnidadeFsp(req: Request, res: Response) {
  const parsed = UnidadeFspCreateSchema.parse(req.body);
  const db = getPrisma();
  const unidade = await db.unidadeFsp.create({ data: parsed });
  await auditRef('unidadeFsp', unidade.id, 'create', req, unidade);
  return res.status(201).json(unidade);
}

export async function getUnidadeFsp(req: Request, res: Response) {
  const db = getPrisma();
  const record = await db.unidadeFsp.findUnique({ where: { id: req.params.id } });
  if (!record) throw notFound('Unidade not found');
  return res.status(200).json(record);
}

export async function updateUnidadeFsp(req: Request, res: Response) {
  const parsed = UnidadeFspUpdateSchema.parse(req.body);
  const db = getPrisma();
  const existing = await db.unidadeFsp.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Unidade not found');
  const updated = await db.unidadeFsp.update({ where: { id: req.params.id }, data: parsed });
  await auditRef('unidadeFsp', updated.id, 'update', req, { before: existing, patch: parsed });
  return res.status(200).json(updated);
}

export async function deleteUnidadeFsp(req: Request, res: Response) {
  const db = getPrisma();
  const existing = await db.unidadeFsp.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Unidade not found');
  await db.unidadeFsp.delete({ where: { id: req.params.id } });
  await auditRef('unidadeFsp', existing.id, 'delete', req, existing);
  return res.status(200).json({ success: true });
}

export async function listEmpresas(_req: Request, res: Response) {
  const db = getPrisma();
  const empresas = await db.empresa.findMany({ orderBy: { razaoSocial: 'asc' } });
  return res.status(200).json(empresas);
}

export async function createEmpresa(req: Request, res: Response) {
  const parsed = EmpresaCreateSchema.parse(req.body);
  const db = getPrisma();
  const empresa = await db.empresa.create({ data: parsed });
  await auditRef('empresa', empresa.id, 'create', req, empresa);
  return res.status(201).json(empresa);
}

export async function getEmpresa(req: Request, res: Response) {
  const db = getPrisma();
  const record = await db.empresa.findUnique({ where: { id: req.params.id } });
  if (!record) throw notFound('Empresa not found');
  return res.status(200).json(record);
}

export async function updateEmpresa(req: Request, res: Response) {
  const parsed = EmpresaUpdateSchema.parse(req.body);
  const db = getPrisma();
  const existing = await db.empresa.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Empresa not found');
  const updated = await db.empresa.update({ where: { id: req.params.id }, data: parsed });
  await auditRef('empresa', updated.id, 'update', req, { before: existing, patch: parsed });
  return res.status(200).json(updated);
}

export async function deleteEmpresa(req: Request, res: Response) {
  const db = getPrisma();
  const existing = await db.empresa.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Empresa not found');
  await db.empresa.delete({ where: { id: req.params.id } });
  await auditRef('empresa', existing.id, 'delete', req, existing);
  return res.status(200).json({ success: true });
}

export async function listEntidadesGestoras(_req: Request, res: Response) {
  const db = getPrisma();
  const entidades = await db.entidadeGestora.findMany({ orderBy: { nome: 'asc' } });
  return res.status(200).json(entidades);
}

export async function createEntidadeGestora(req: Request, res: Response) {
  const parsed = EntidadeGestoraCreateSchema.parse(req.body);
  const db = getPrisma();
  const entidade = await db.entidadeGestora.create({ data: parsed });
  await auditRef('entidadeGestora', entidade.id, 'create', req, entidade);
  return res.status(201).json(entidade);
}

export async function getEntidadeGestora(req: Request, res: Response) {
  const db = getPrisma();
  const record = await db.entidadeGestora.findUnique({ where: { id: req.params.id } });
  if (!record) throw notFound('Entidade not found');
  return res.status(200).json(record);
}

export async function updateEntidadeGestora(req: Request, res: Response) {
  const parsed = EntidadeGestoraUpdateSchema.parse(req.body);
  const db = getPrisma();
  const existing = await db.entidadeGestora.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Entidade not found');
  const updated = await db.entidadeGestora.update({ where: { id: req.params.id }, data: parsed });
  await auditRef('entidadeGestora', updated.id, 'update', req, { before: existing, patch: parsed });
  return res.status(200).json(updated);
}

export async function deleteEntidadeGestora(req: Request, res: Response) {
  const db = getPrisma();
  const existing = await db.entidadeGestora.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Entidade not found');
  await db.entidadeGestora.delete({ where: { id: req.params.id } });
  await auditRef('entidadeGestora', existing.id, 'delete', req, existing);
  return res.status(200).json({ success: true });
}

export async function listFornecedores(_req: Request, res: Response) {
  const db = getPrisma();
  const fornecedores = await db.fornecedor.findMany({ orderBy: { nome: 'asc' } });
  return res.status(200).json(fornecedores.map((item) => ({ ...item, cnpj: item.cnpj ?? '' })));
}

export async function createFornecedor(req: Request, res: Response) {
  const parsed = FornecedorCreateSchema.parse(req.body);
  const db = getPrisma();
  const record = await db.fornecedor.create({
    data: { nome: parsed.nome, cnpj: parsed.cnpj || null },
  });
  await auditRef('fornecedor', record.id, 'create', req, record);
  return res.status(201).json({ ...record, cnpj: record.cnpj ?? '' });
}

export async function getFornecedor(req: Request, res: Response) {
  const db = getPrisma();
  const record = await db.fornecedor.findUnique({ where: { id: req.params.id } });
  if (!record) throw notFound('Fornecedor not found');
  return res.status(200).json({ ...record, cnpj: record.cnpj ?? '' });
}

export async function updateFornecedor(req: Request, res: Response) {
  const parsed = FornecedorUpdateSchema.parse(req.body);
  const db = getPrisma();
  const existing = await db.fornecedor.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Fornecedor not found');
  const updated = await db.fornecedor.update({
    where: { id: req.params.id },
    data: {
      nome: parsed.nome ?? existing.nome,
      cnpj: parsed.cnpj === undefined ? existing.cnpj : parsed.cnpj || null,
    },
  });
  await auditRef('fornecedor', updated.id, 'update', req, { before: existing, patch: parsed });
  return res.status(200).json({ ...updated, cnpj: updated.cnpj ?? '' });
}

export async function deleteFornecedor(req: Request, res: Response) {
  const db = getPrisma();
  const existing = await db.fornecedor.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Fornecedor not found');
  await db.fornecedor.delete({ where: { id: req.params.id } });
  await auditRef('fornecedor', existing.id, 'delete', req, existing);
  return res.status(200).json({ success: true });
}

export async function listServicos(_req: Request, res: Response) {
  const db = getPrisma();
  const servicos = await db.servico.findMany({ orderBy: { titulo: 'asc' } });
  return res.status(200).json(servicos.map((item) => ({ ...item, descricao: item.descricao ?? '' })));
}

export async function createServico(req: Request, res: Response) {
  const parsed = ServicoCreateSchema.parse(req.body);
  const db = getPrisma();
  const record = await db.servico.create({
    data: { titulo: parsed.titulo, descricao: parsed.descricao || null },
  });
  await auditRef('servico', record.id, 'create', req, record);
  return res.status(201).json({ ...record, descricao: record.descricao ?? '' });
}

export async function getServico(req: Request, res: Response) {
  const db = getPrisma();
  const record = await db.servico.findUnique({ where: { id: req.params.id } });
  if (!record) throw notFound('Servico not found');
  return res.status(200).json({ ...record, descricao: record.descricao ?? '' });
}

export async function updateServico(req: Request, res: Response) {
  const parsed = ServicoUpdateSchema.parse(req.body);
  const db = getPrisma();
  const existing = await db.servico.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Servico not found');
  const updated = await db.servico.update({
    where: { id: req.params.id },
    data: {
      titulo: parsed.titulo ?? existing.titulo,
      descricao: parsed.descricao === undefined ? existing.descricao : parsed.descricao || null,
    },
  });
  await auditRef('servico', updated.id, 'update', req, { before: existing, patch: parsed });
  return res.status(200).json({ ...updated, descricao: updated.descricao ?? '' });
}

export async function deleteServico(req: Request, res: Response) {
  const db = getPrisma();
  const existing = await db.servico.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound('Servico not found');
  await db.servico.delete({ where: { id: req.params.id } });
  await auditRef('servico', existing.id, 'delete', req, existing);
  return res.status(200).json({ success: true });
}
