import { Request, Response } from 'express';
import { ContractCreateSchema, ContractUpdateSchema } from '../../../../packages/schema/src/contracts';
import { getActorId, writeAuditLog } from '../lib/audit';
import { notFound } from '../lib/errors';
import { getPrisma } from '../lib/prisma';

const contractInclude = {
  aditivos: true,
  unidadeFsp: true,
  gestor: true,
  fiscal: true,
  empresa: true,
} as const;

function mapContractRecord(record: any) {
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
    valorAnual: record.valorAnualCents != null ? record.valorAnualCents / 100 : undefined,
    valorAnualCents: record.valorAnualCents,
    dataInicio: record.dataInicio,
    dataFimOrig: record.dataFimOrig,
    status: record.status,
    aditivos: record.aditivos?.map((aditivo: any) => ({
      id: aditivo.id,
      numAditivo: aditivo.numAditivo,
      protocoloAdit: aditivo.protocoloAdit,
      novoFimVigencia: aditivo.novoFimVigencia,
      valorAdicional: aditivo.valorAdicionalCents != null ? aditivo.valorAdicionalCents / 100 : undefined,
    })),
  };
}

async function loadMappedContract(id: string) {
  const db = getPrisma();
  const record = await db.contrato.findUnique({
    where: { id },
    include: contractInclude,
  });
  if (!record) {
    throw notFound('Contract not found');
  }
  return mapContractRecord(record);
}

export async function listContracts(_req: Request, res: Response) {
  const db = getPrisma();
  const records = await db.contrato.findMany({
    orderBy: { createdAt: 'desc' },
    include: contractInclude,
  });
  return res.status(200).json(records.map(mapContractRecord));
}

export async function getContract(req: Request, res: Response) {
  return res.status(200).json(await loadMappedContract(req.params.id));
}

export async function createContract(req: Request, res: Response) {
  const parsed = ContractCreateSchema.parse(req.body);
  const db = getPrisma();
  const actorId = getActorId(req);

  const createdId = await db.$transaction(async (tx) => {
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
        valorAnualCents: parsed.valorAnualCents,
        dataInicio: parsed.dataInicio ? new Date(parsed.dataInicio) : null,
        dataFimOrig: parsed.dataFimOrig ? new Date(parsed.dataFimOrig) : null,
        status: parsed.status || 'vigente',
      },
    });

    if (parsed.aditivos?.length) {
      for (const a of parsed.aditivos) {
        await tx.aditivo.create({
          data: {
            contratoId: contrato.id,
            numAditivo: a.numAditivo,
            protocoloAdit: a.protocoloAdit,
            novoFimVigencia: a.novoFimVigencia ? new Date(a.novoFimVigencia) : null,
            valorAdicionalCents: a.valorAdicional != null ? Math.round(a.valorAdicional * 100) : null,
          },
        });
      }
    }

    await tx.auditLog.create({
      data: {
        tabela: 'contrato',
        registroId: contrato.id,
        action: 'create',
        diff: { id: contrato.id },
        changedBy: actorId,
        source: 'api',
      },
    });

    return contrato.id;
  });

  return res.status(201).json(await loadMappedContract(createdId));
}

export async function updateContract(req: Request, res: Response) {
  const parsed = ContractUpdateSchema.parse(req.body);
  const db = getPrisma();
  const actorId = getActorId(req);

  const existing = await db.contrato.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw notFound('Contract not found');
  }

  const gestorId = (parsed.gestorId as string | undefined) ?? existing.gestorId;
  const fiscalId = (parsed.fiscalId as string | undefined) ?? existing.fiscalId;
  if (gestorId === fiscalId) {
    ContractUpdateSchema.parse({ ...parsed, gestorId, fiscalId });
  }

  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (value !== undefined) {
      data[key] = value;
    }
  }
  if (data.dataInicio !== undefined) {
    data.dataInicio = data.dataInicio ? new Date(String(data.dataInicio)) : null;
  }
  if (data.dataFimOrig !== undefined) {
    data.dataFimOrig = data.dataFimOrig ? new Date(String(data.dataFimOrig)) : null;
  }

  await db.$transaction(async (tx) => {
    await tx.contrato.update({
      where: { id: req.params.id },
      data,
    });

    await tx.auditLog.create({
      data: {
        tabela: 'contrato',
        registroId: req.params.id,
        action: 'update',
        diff: { before: existing, patch: data },
        changedBy: actorId,
        source: 'api',
      },
    });
  });

  return res.status(200).json(await loadMappedContract(req.params.id));
}

export async function deleteContract(req: Request, res: Response) {
  const db = getPrisma();
  const actorId = getActorId(req);

  const existing = await db.contrato.findUnique({
    where: { id: req.params.id },
    include: { aditivos: true },
  });
  if (!existing) {
    throw notFound('Contract not found');
  }

  await db.$transaction(async (tx) => {
    await tx.aditivo.deleteMany({ where: { contratoId: req.params.id } });
    await tx.contrato.delete({ where: { id: req.params.id } });
    await tx.auditLog.create({
      data: {
        tabela: 'contrato',
        registroId: req.params.id,
        action: 'delete',
        diff: { id: existing.id, aditivos: existing.aditivos.length },
        changedBy: actorId,
        source: 'api',
      },
    });
  });

  return res.status(200).json({ success: true });
}
