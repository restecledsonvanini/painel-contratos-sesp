import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ContractCreateSchema } from '../../../../packages/schema/src/contracts';

const prisma = new PrismaClient();

export async function createContract(req: Request, res: Response) {
  try {
    const parsed = ContractCreateSchema.parse(req.body);

    // Transactional create: contrato + aditivos (if any) + audit log
    const result = await prisma.$transaction(async (tx: any) => {
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

      // Basic audit log record
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
