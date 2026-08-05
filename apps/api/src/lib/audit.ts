import { Request } from 'express';
import { getPrisma } from './prisma';
import { getActorFromContext, getRequestId } from './requestContext';
import { normalizeRole } from './authTypes';

export function getActorId(req: Request): string | null {
  return req.user?.id ?? getActorFromContext() ?? null;
}

/** Escopo de órgão: ADMIN sem filtro; demais com orgaoId no token. */
export function getOrgaoScope(req: Request): { orgaoId?: string | null } {
  const user = req.user;
  if (!user) return {};
  if (normalizeRole(user.role) === 'ADMIN') return {};
  if (!user.orgaoId) return {};
  return { orgaoId: user.orgaoId };
}

export async function writeAuditLog(input: {
  tabela: string;
  registroId: string;
  action: string;
  diff?: unknown;
  changedBy?: string | null;
  source?: string;
  requestId?: string | null;
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
      requestId: input.requestId ?? getRequestId() ?? null,
    },
  });
}
