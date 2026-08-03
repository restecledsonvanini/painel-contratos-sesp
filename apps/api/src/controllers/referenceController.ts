import { Request, Response } from 'express';

let prisma: any = null;

async function getPrismaClient() {
  if (prisma) {
    return prisma;
  }

  // If DATABASE_URL is not configured, avoid instantiating PrismaClient
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set — skipping Prisma client initialization');
    return null;
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    return prisma;
  } catch (error: any) {
    console.warn('Prisma client unavailable:', error?.message || error);
    return null;
  }
}

// Simple in-memory mock stores used when DB is not available or for entities not modeled in Prisma
const mockStores: Record<string, Map<string, any>> = {
  fornecedores: new Map(),
  servicos: new Map(),
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function listUnidadesFsp(_req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) {
    console.warn('listUnidadesFsp: database unavailable, returning empty list');
    return res.status(200).json([]);
  }

  const unidades = await db.unidadeFsp.findMany({ orderBy: { nome: 'asc' } });
  return res.status(200).json(unidades);
}

export async function createUnidadeFsp(req: Request, res: Response) {
  try {
    const { sigla, nome } = req.body;
    if (!sigla || !nome) {
      return res.status(400).json({ error: 'sigla and nome are required' });
    }

    const db = await getPrismaClient();
    if (!db) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const unidade = await db.unidadeFsp.create({ data: { sigla, nome } });
    return res.status(201).json(unidade);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listEmpresas(_req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) {
    console.warn('listEmpresas: database unavailable, returning empty list');
    return res.status(200).json([]);
  }

  const empresas = await db.empresa.findMany({ orderBy: { razaoSocial: 'asc' } });
  return res.status(200).json(empresas);
}

export async function createEmpresa(req: Request, res: Response) {
  try {
    const { cnpj, razaoSocial } = req.body;
    if (!cnpj || !razaoSocial) {
      return res.status(400).json({ error: 'cnpj and razaoSocial are required' });
    }

    const db = await getPrismaClient();
    if (!db) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const empresa = await db.empresa.create({ data: { cnpj, razaoSocial } });
    return res.status(201).json(empresa);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listEntidadesGestoras(_req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) {
    console.warn('listEntidadesGestoras: database unavailable, returning empty list');
    return res.status(200).json([]);
  }

  const entidades = await db.entidadeGestora.findMany({ orderBy: { nome: 'asc' } });
  return res.status(200).json(entidades);
}

export async function createEntidadeGestora(req: Request, res: Response) {
  try {
    const { nome, cpf } = req.body;
    if (!nome || !cpf) {
      return res.status(400).json({ error: 'nome and cpf are required' });
    }

    const db = await getPrismaClient();
    if (!db) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const entidade = await db.entidadeGestora.create({ data: { nome, cpf } });
    return res.status(201).json(entidade);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// --- Fornecedores ---
export async function listFornecedores(_req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const fornecedores = await db.fornecedor.findMany({ orderBy: { nome: 'asc' } });
    return res.status(200).json(fornecedores.map((item: any) => ({ ...item, cnpj: item.cnpj ?? '' })));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createFornecedor(req: Request, res: Response) {
  const { nome, cnpj } = req.body;
  if (!nome) return res.status(400).json({ error: 'nome is required' });

  const db = await getPrismaClient();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const record = await db.fornecedor.create({ data: { nome, cnpj: cnpj || null } });
    return res.status(201).json({ ...record, cnpj: record.cnpj ?? '' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getFornecedor(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const record = await db.fornecedor.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Fornecedor not found' });
    return res.status(200).json({ ...record, cnpj: record.cnpj ?? '' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateFornecedor(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const existing = await db.fornecedor.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Fornecedor not found' });

    const updated = await db.fornecedor.update({
      where: { id: req.params.id },
      data: {
        nome: req.body.nome ?? existing.nome,
        cnpj: req.body.cnpj ?? existing.cnpj ?? null,
      },
    });

    return res.status(200).json({ ...updated, cnpj: updated.cnpj ?? '' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteFornecedor(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const existing = await db.fornecedor.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Fornecedor not found' });

    await db.fornecedor.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// --- Serviços ---
export async function listServicos(_req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const servicos = await db.servico.findMany({ orderBy: { titulo: 'asc' } });
    return res.status(200).json(servicos.map((item: any) => ({ ...item, descricao: item.descricao ?? '' })));
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createServico(req: Request, res: Response) {
  const { titulo, descricao } = req.body;
  if (!titulo) return res.status(400).json({ error: 'titulo is required' });

  const db = await getPrismaClient();
  if (!db) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const record = await db.servico.create({ data: { titulo, descricao: descricao || null } });
    return res.status(201).json({ ...record, descricao: record.descricao ?? '' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getServico(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const record = await db.servico.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Servico not found' });
    return res.status(200).json({ ...record, descricao: record.descricao ?? '' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateServico(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const existing = await db.servico.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Servico not found' });

    const updated = await db.servico.update({
      where: { id: req.params.id },
      data: {
        titulo: req.body.titulo ?? existing.titulo,
        descricao: req.body.descricao ?? existing.descricao ?? null,
      },
    });

    return res.status(200).json({ ...updated, descricao: updated.descricao ?? '' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteServico(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(503).json({ error: 'Database unavailable' });

  try {
    const existing = await db.servico.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Servico not found' });

    await db.servico.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// --- Empresa CRUD ---
export async function getEmpresa(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(404).json({ error: 'Not found' });

  const record = await db.empresa.findUnique({ where: { id: req.params.id } });
  if (!record) return res.status(404).json({ error: 'Empresa not found' });
  return res.status(200).json(record);
}

export async function updateEmpresa(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();
    if (!db) return res.status(503).json({ error: 'Database unavailable' });

    const record = await db.empresa.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Empresa not found' });

    const updated = await db.empresa.update({ where: { id: req.params.id }, data: { cnpj: req.body.cnpj ?? record.cnpj, razaoSocial: req.body.razaoSocial ?? record.razaoSocial } });
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteEmpresa(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();
    if (!db) return res.status(503).json({ error: 'Database unavailable' });

    const record = await db.empresa.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Empresa not found' });

    await db.empresa.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// --- EntidadeGestora CRUD ---
export async function getEntidadeGestora(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(404).json({ error: 'Not found' });

  const record = await db.entidadeGestora.findUnique({ where: { id: req.params.id } });
  if (!record) return res.status(404).json({ error: 'Entidade not found' });
  return res.status(200).json(record);
}

export async function updateEntidadeGestora(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();
    if (!db) return res.status(503).json({ error: 'Database unavailable' });

    const record = await db.entidadeGestora.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Entidade not found' });

    const updated = await db.entidadeGestora.update({ where: { id: req.params.id }, data: { nome: req.body.nome ?? record.nome, cpf: req.body.cpf ?? record.cpf } });
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteEntidadeGestora(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();
    if (!db) return res.status(503).json({ error: 'Database unavailable' });

    const record = await db.entidadeGestora.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Entidade not found' });

    await db.entidadeGestora.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// --- UnidadeFsp CRUD ---
export async function getUnidadeFsp(req: Request, res: Response) {
  const db = await getPrismaClient();
  if (!db) return res.status(404).json({ error: 'Not found' });

  const record = await db.unidadeFsp.findUnique({ where: { id: req.params.id } });
  if (!record) return res.status(404).json({ error: 'Unidade not found' });
  return res.status(200).json(record);
}

export async function updateUnidadeFsp(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();
    if (!db) return res.status(503).json({ error: 'Database unavailable' });

    const record = await db.unidadeFsp.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Unidade not found' });

    const updated = await db.unidadeFsp.update({ where: { id: req.params.id }, data: { sigla: req.body.sigla ?? record.sigla, nome: req.body.nome ?? record.nome } });
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteUnidadeFsp(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();
    if (!db) return res.status(503).json({ error: 'Database unavailable' });

    const record = await db.unidadeFsp.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Unidade not found' });

    await db.unidadeFsp.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
