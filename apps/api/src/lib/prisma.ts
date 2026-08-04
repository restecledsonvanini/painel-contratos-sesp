import { PrismaClient } from '@painel/db';

let prisma: PrismaClient | null = null;

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not configured');
  }
  return url;
}

export function getPrisma(): PrismaClient {
  if (prisma) {
    return prisma;
  }

  getDatabaseUrl();
  prisma = new PrismaClient();
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}
