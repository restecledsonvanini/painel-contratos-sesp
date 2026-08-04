import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Running seed script (local Docker / staging)');

  const systemUserId = '00000000-0000-0000-0000-000000000000';

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_user', ${systemUserId}, true)`;
    await tx.$executeRaw`SELECT set_config('app.current_user_source', 'seed:initial', true)`;

    await tx.unidadeFsp.upsert({
      where: { sigla: 'PMPR' },
      update: { nome: 'Polícia Militar' },
      create: { sigla: 'PMPR', nome: 'Polícia Militar' },
    });

    await tx.unidadeFsp.upsert({
      where: { sigla: 'PCPR' },
      update: { nome: 'Polícia Civil' },
      create: { sigla: 'PCPR', nome: 'Polícia Civil' },
    });

    await tx.unidadeFsp.upsert({
      where: { sigla: 'CB' },
      update: { nome: 'Corpo de Bombeiros' },
      create: { sigla: 'CB', nome: 'Corpo de Bombeiros' },
    });

    await tx.empresa.upsert({
      where: { cnpj: '00000000000191' },
      update: { razaoSocial: 'Fornecedor Exemplo LTDA' },
      create: { cnpj: '00000000000191', razaoSocial: 'Fornecedor Exemplo LTDA' },
    });

    const gestor = await tx.entidadeGestora.upsert({
      where: { cpf: '12345678901' },
      update: { nome: 'Gestor Exemplo' },
      create: { nome: 'Gestor Exemplo', cpf: '12345678901' },
    });

    const fiscal = await tx.entidadeGestora.upsert({
      where: { cpf: '98765432100' },
      update: { nome: 'Fiscal Exemplo' },
      create: { nome: 'Fiscal Exemplo', cpf: '98765432100' },
    });

    const empresa = await tx.empresa.findUnique({ where: { cnpj: '00000000000191' } });
    const unidade = await tx.unidadeFsp.findUnique({ where: { sigla: 'PMPR' } });

    if (!empresa || !unidade) {
      throw new Error('Seed prerequisites missing (empresa/unidade)');
    }

    const existing = await tx.contrato.findUnique({
      where: { numGms_anoGms: { numGms: 123, anoGms: 2026 } },
      include: { aditivos: true },
    });

    if (existing) {
      await tx.aditivo.deleteMany({ where: { contratoId: existing.id } });
      await tx.contrato.update({
        where: { id: existing.id },
        data: {
          protocoloCabeca: '15.848.565-6',
          unidadeFspId: unidade.id,
          gestorId: gestor.id,
          fiscalId: fiscal.id,
          empresaId: empresa.id,
          status: 'vigente',
          modalidade: 'Dispensa',
          objeto: 'Serviço de Exemplo',
          valorAnualCents: 1000000,
          dataInicio: new Date('2026-02-01'),
          dataFimOrig: new Date('2027-01-31'),
        },
      });

      await tx.aditivo.create({
        data: {
          contratoId: existing.id,
          numAditivo: 1,
          protocoloAdit: 'AD-001',
          novoFimVigencia: new Date('2027-06-30'),
          valorAdicionalCents: 200000,
        },
      });
    } else {
      const contrato = await tx.contrato.create({
        data: {
          protocoloCabeca: '15.848.565-6',
          numGms: 123,
          anoGms: 2026,
          unidadeFspId: unidade.id,
          gestorId: gestor.id,
          fiscalId: fiscal.id,
          empresaId: empresa.id,
          status: 'vigente',
          modalidade: 'Dispensa',
          objeto: 'Serviço de Exemplo',
          valorAnualCents: 1000000,
          dataInicio: new Date('2026-02-01'),
          dataFimOrig: new Date('2027-01-31'),
        },
      });

      await tx.aditivo.create({
        data: {
          contratoId: contrato.id,
          numAditivo: 1,
          protocoloAdit: 'AD-001',
          novoFimVigencia: new Date('2027-06-30'),
          valorAdicionalCents: 200000,
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
