import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const unidades = [
    { sigla: 'PMPR', nome: 'Polícia Militar' },
    { sigla: 'PCPR', nome: 'Polícia Civil' },
    { sigla: 'CB', nome: 'Corpo de Bombeiros' }
  ];

  for (const u of unidades) {
    await prisma.unidadeFsp.upsert({
      where: { sigla: u.sigla },
      update: {},
      create: u,
    });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
