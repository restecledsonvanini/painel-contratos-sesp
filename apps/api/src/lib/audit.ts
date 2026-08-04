import { Request } from 'express';
import { getPrisma } from './prisma';

export function getActorId(req: Request): string | null {
  return (req as any).user?.id ?? null;
}

export async function writeAuditLog(input: {
  tabela: string;
  registroId: string;
  action: string;
  diff?: unknown;
  changedBy?: string | null;
  source?: string;
}) {
  const db = getPrisma();
  await db.auditLog.create({
    data: {
      tabela: input.tabela,
      registroId: input.registroId,
      action: input.action,
      diff: (input.diff ?? {}) as object,
      changedBy: input.changedBy ?? null,
      source: input.source ?? 'api',
    },
  });
}
