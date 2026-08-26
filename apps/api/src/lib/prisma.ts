import { createPrismaClient } from '@painel/db';
import { getActorFromContext, getRequestId } from './requestContext';

const WRITE_ACTIONS = new Set([
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'deleteMany',
]);

function createPrisma() {
  const url = getDatabaseUrl();
  const client = createPrismaClient(url);
  return client.$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        if (!WRITE_ACTIONS.has(operation)) {
          return query(args);
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
        return query(args);
      },
    },
  });
}

export type AppPrisma = ReturnType<typeof createPrisma>;

let prisma: AppPrisma | null = null;

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not configured');
  }
  return url;
}

export function getPrisma(): AppPrisma {
  if (prisma) return prisma;
  prisma = createPrisma();
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}
