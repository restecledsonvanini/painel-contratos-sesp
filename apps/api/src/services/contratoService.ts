import type { ContractCreateInput, ContractUpdateInput } from '@painel/schema';
import { ContractUpdateSchema } from '@painel/schema';
import { getActorId } from '../lib/audit';
import { notFound } from '../lib/errors';
import { contratoRepository } from '../repositories/contratoRepository';
import type { Request } from 'express';

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
  const record = await contratoRepository.findById(id);
  if (!record) throw notFound('Contract not found');
  return mapContractRecord(record);
}

export const contratoService = {
  async list() {
    const records = await contratoRepository.findMany();
    return records.map(mapContractRecord);
  },

  async getById(id: string) {
    return loadMappedContract(id);
  },

  async create(parsed: ContractCreateInput, req: Request) {
    const actorId = getActorId(req);
    const createdId = await contratoRepository.createWithAditivos(
      {
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
      (parsed.aditivos ?? []).map((a) => ({
        numAditivo: a.numAditivo,
        protocoloAdit: a.protocoloAdit,
        novoFimVigencia: a.novoFimVigencia ? new Date(a.novoFimVigencia) : null,
        valorAdicionalCents: a.valorAdicional != null ? Math.round(a.valorAdicional * 100) : null,
      })),
      { changedBy: actorId },
    );
    return loadMappedContract(createdId);
  },

  async update(id: string, parsed: ContractUpdateInput, req: Request) {
    const existing = await contratoRepository.findByIdBare(id);
    if (!existing) throw notFound('Contract not found');

    const gestorId = (parsed.gestorId as string | undefined) ?? existing.gestorId;
    const fiscalId = (parsed.fiscalId as string | undefined) ?? existing.fiscalId;
    if (gestorId === fiscalId) {
      ContractUpdateSchema.parse({ ...parsed, gestorId, fiscalId });
    }

    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value !== undefined) data[key] = value;
    }
    if (data.dataInicio !== undefined) {
      data.dataInicio = data.dataInicio ? new Date(String(data.dataInicio)) : null;
    }
    if (data.dataFimOrig !== undefined) {
      data.dataFimOrig = data.dataFimOrig ? new Date(String(data.dataFimOrig)) : null;
    }

    await contratoRepository.update(id, data, existing, { changedBy: getActorId(req) });
    return loadMappedContract(id);
  },

  async remove(id: string, req: Request) {
    const existing = await contratoRepository.findById(id);
    if (!existing) throw notFound('Contract not found');
    await contratoRepository.delete(id, existing, { changedBy: getActorId(req) });
    return { success: true };
  },
};
