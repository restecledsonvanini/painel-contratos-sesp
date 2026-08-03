import { Request, Response } from 'express';
import { ContractCreateSchema } from '../../../../packages/schema/src/contracts';

let prisma: any = null;

async function getPrismaClient() {
  if (prisma) {
    return prisma;
  }

  const databaseUrl = process.env.DATABASE_URL || 'postgresql://painel:pass@localhost:5432/painel_db';
  process.env.DATABASE_URL = databaseUrl;

  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    return prisma;
  } catch (error: any) {
    console.warn('Prisma client unavailable:', error?.message || error);
    return null;
  }
}

async function mapContractRecord(record: any) {
  return {
    id: record.id,
    protocoloCabeca: record.protocoloCabeca,
    numGms: record.numGms,
    anoGms: record.anoGms,
    unidadeFspId: record.unidadeFspId,
    unidadeFsp: record.unidadeFsp
      ? { id: record.unidadeFsp.id, sigla: record.unidadeFsp.sigla, nome: record.unidadeFsp.nome }
      : undefined,
    gestorId: record.gestorId,
    gestorName: record.gestor?.nome,
    fiscalId: record.fiscalId,
    fiscalName: record.fiscal?.nome,
    empresaId: record.empresaId,
    empresaName: record.empresa?.razaoSocial,
    modalidade: record.modalidade,
    objeto: record.objeto,
    valorAnual: record.valorAnualCents ? record.valorAnualCents / 100 : undefined,
    valorAnualCents: record.valorAnualCents,
    dataInicio: record.dataInicio,
    dataFimOrig: record.dataFimOrig,
    status: record.status,
    aditivos: record.aditivos?.map((aditivo: any) => ({
      numAditivo: aditivo.numAditivo,
      protocoloAdit: aditivo.protocoloAdit,
      novoFimVigencia: aditivo.novoFimVigencia,
      valorAdicional: aditivo.valorAdicionalCents ? aditivo.valorAdicionalCents / 100 : undefined,
    })),
  };
}

export async function listContracts(_req: Request, res: Response) {
  try {
    const db = await getPrismaClient();

    if (!db) {
      return res.status(200).json([]);
    }

    const records = await db.contrato.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        aditivos: true,
        unidadeFsp: true,
        gestor: true,
        fiscal: true,
        empresa: true,
      },
    });

    const contracts = await Promise.all(records.map(mapContractRecord));
    return res.status(200).json(contracts);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getContract(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();

    if (!db) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const record = await db.contrato.findUnique({
      where: { id: req.params.id },
      include: {
        aditivos: true,
        unidadeFsp: true,
        gestor: true,
        fiscal: true,
        empresa: true,
      },
    });

    if (!record) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    return res.status(200).json(await mapContractRecord(record));
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createContract(req: Request, res: Response) {
  try {
    const parsed = ContractCreateSchema.parse(req.body);
    const db = await getPrismaClient();

    if (!db) {
      return res.status(500).json({ error: 'Database unavailable' });
    }

    const result = await db.$transaction(async (tx: any) => {
      const contrato = await tx.contrato.create({
        data: {
          protocoloCabeca: parsed.protocoloCabeca || null,
          numGms: parsed.numGms,
          anoGms: parsed.anoGms,
          unidadeFspId: parsed.unidadeFspId,
          gestorId: parsed.gestorId,
          fiscalId: parsed.fiscalId,
          empresaId: parsed.empresaId,
          modalidade: parsed.modalidade,
          objeto: parsed.objeto,
          valorAnualCents: (parsed as any).valorAnualCents,
          dataInicio: parsed.dataInicio || null,
          dataFimOrig: parsed.dataFimOrig || null,
          status: parsed.status || 'vigente',
        },
      });

      if (parsed.aditivos && parsed.aditivos.length > 0) {
        for (const a of parsed.aditivos) {
          await (tx as any).aditivo.create({
            data: {
              contratoId: contrato.id,
              numAditivo: a.numAditivo,
              protocoloAdit: a.protocoloAdit,
              novoFimVigencia: a.novoFimVigencia || null,
              valorAdicionalCents: a.valorAdicional ? Math.round(a.valorAdicional * 100) : null,
            },
          });
        }
      }

      await (tx as any).auditLog.create({
        data: {
          tabela: 'contrato',
          registroId: contrato.id,
          action: 'create',
          diff: {},
          changedBy: (req as any).user?.id || null,
        },
      });

      return contrato;
    });

    return res.status(201).json(result);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateContract(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();

    if (!db) {
      return res.status(500).json({ error: 'Database unavailable' });
    }

    const record = await db.contrato.findUnique({ where: { id: req.params.id } });
    if (!record) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const updated = await db.contrato.update({
      where: { id: req.params.id },
      data: {
        protocoloCabeca: req.body.protocoloCabeca ?? record.protocoloCabeca,
        numGms: req.body.numGms ?? record.numGms,
        anoGms: req.body.anoGms ?? record.anoGms,
        unidadeFspId: req.body.unidadeFspId ?? record.unidadeFspId,
        gestorId: req.body.gestorId ?? record.gestorId,
        fiscalId: req.body.fiscalId ?? record.fiscalId,
        empresaId: req.body.empresaId ?? record.empresaId,
        modalidade: req.body.modalidade ?? record.modalidade,
        objeto: req.body.objeto ?? record.objeto,
        valorAnualCents: req.body.valorAnualCents ?? record.valorAnualCents,
        dataInicio: req.body.dataInicio ?? record.dataInicio,
        dataFimOrig: req.body.dataFimOrig ?? record.dataFimOrig,
        status: req.body.status ?? record.status,
      },
    });

    return res.status(200).json(updated);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteContract(req: Request, res: Response) {
  try {
    const db = await getPrismaClient();

    if (!db) {
      return res.status(500).json({ error: 'Database unavailable' });
    }

    const record = await db.contrato.findUnique({ where: { id: req.params.id } });
    if (!record) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    await db.contrato.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
