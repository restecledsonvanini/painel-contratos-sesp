import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Running Supabase seed script (staging)');

  // Ensure you set DATABASE_URL in env before running this script.
  // This script sets session variables 'app.current_user' and 'app.current_user_source'
  // so that audit triggers record who/where changes originate from.

  // Create a system user for seed operations (deterministic id for repeatability)
  const systemUserId = '00000000-0000-0000-0000-000000000000';

  await prisma.$transaction(async (tx) => {
    // Set session context for audit triggers
    await tx.$executeRaw`SELECT set_config('app.current_user', ${systemUserId}, true)`;
    await tx.$executeRaw`SELECT set_config('app.current_user_source', 'seed:initial', true)`;

    // Upsert lookup data
    await tx.unidadeFsp.upsert({
      where: { sigla: 'PMPR' },
      update: {},
      create: { sigla: 'PMPR', nome: 'Polícia Militar' },
    });

    await tx.unidadeFsp.upsert({
      where: { sigla: 'PCPR' },
      update: {},
      create: { sigla: 'PCPR', nome: 'Polícia Civil' },
    });

    await tx.empresa.upsert({
      where: { cnpj: '00000000000191' },
      update: {},
      create: { cnpj: '00000000000191', razaoSocial: 'Fornecedor Exemplo LTDA' },
    });

    // Create gestor and fiscal
    const gestor = await tx.entidadeGestora.upsert({
      where: { cpf: '12345678901' },
      update: {},
      create: { nome: 'Gestor Exemplo', cpf: '12345678901' },
    });

    const fiscal = await tx.entidadeGestora.upsert({
      where: { cpf: '98765432100' },
      update: {},
      create: { nome: 'Fiscal Exemplo', cpf: '98765432100' },
    });

    const empresa = await tx.empresa.findUnique({ where: { cnpj: '00000000000191' } });
    const unidade = await tx.unidadeFsp.findUnique({ where: { sigla: 'PMPR' } });

    // Insert sample contrato
    if (empresa && unidade) {
      const contrato = await tx.contrato.create({
        data: {
          protocoloCabeca: '15.848.565-6',
          numGms: 123,
          anoGms: 2026,
          unidadeFspId: unidade.id,
          gestorId: gestor.id,
          fiscalId: fiscal.id,
          empresaId: empresa.id,
          status: 'Vigente',
          modalidade: 'Dispensa',
          objeto: 'Serviço de Exemplo',
          valorAnualCents: 1000000, // R$10.000,00
          dataInicio: new Date('2026-02-01'),
          dataFimOrig: new Date('2027-01-31'),
        },
      });

      // add an aditivo
      await tx.aditivo.create({
        data: {
          contratoId: contrato.id,
          numAditivo: 1,
          protocoloAdit: 'AD-001',
          novoFimVigencia: new Date('2027-06-30'),
          valorAdicionalCents: 200000, // R$2.000,00
        },
      });
    }
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
