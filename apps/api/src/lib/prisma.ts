import { PrismaClient } from '@painel/db';
import { getActorFromContext, getRequestId } from './requestContext';

let prisma: PrismaClient | null = null;
let middlewareAttached = false;

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not configured');
  }
  return url;
}

const WRITE_ACTIONS = new Set([
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'deleteMany',
]);

function attachAuditGuc(client: PrismaClient) {
  if (middlewareAttached) return;
  middlewareAttached = true;
  client.$use(async (params, next) => {
    // Triggers de auditoria só disparam em escrita. Em findMany da listagem
    // o GUC dobrava round-trip à toa.
    if (!WRITE_ACTIONS.has(params.action)) {
      return next(params);
    }
    const actorId = getActorFromContext() ?? '';
    const requestId = getRequestId() ?? '';
    try {
      await client.$executeRawUnsafe(
        `SELECT set_config('app.current_user', $1, true), set_config('app.request_id', $2, true)`,
        actorId,
        requestId,
      );
    } catch {
      // GUC opcional — não bloqueia a operação se a sessão não permitir
    }
    return next(params);
  });
}

export function getPrisma(): PrismaClient {
  if (prisma) {
    return prisma;
  }

  getDatabaseUrl();
  prisma = new PrismaClient();
  attachAuditGuc(prisma);
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    middlewareAttached = false;
  }
}
