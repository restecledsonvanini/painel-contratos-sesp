import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

/**
 * Prisma 7 exige driver adapter. Factory único para API, seed e scripts.
 */
export function createPrismaClient(url: string): PrismaClient {
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}
