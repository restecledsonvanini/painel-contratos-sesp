/**
 * @deprecated Use `npm run seed` em packages/db (seed_supabase.ts).
 * Mantido só para não quebrar imports acidentais.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.warn('packages/db/seed.ts está deprecado. Use: npm run seed (seed_supabase.ts)');
  const unidades = [
    { sigla: 'PMPR', nome: 'Polícia Militar do Paraná' },
    { sigla: 'PCPR', nome: 'Polícia Civil do Paraná' },
    { sigla: 'CBMPR', nome: 'Corpo de Bombeiros Militar do Paraná' },
  ];
  for (const u of unidades) {
    await prisma.unidadeFsp.upsert({
      where: { sigla: u.sigla },
      update: { nome: u.nome },
      create: u,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
