import { PrismaClient } from './generated/client/index.js';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';

const prisma = new PrismaClient();

async function main() {
  console.log('Running seed script (local Docker / staging)');

  const systemUserId = '00000000-0000-0000-0000-000000000000';

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_user', ${systemUserId}, true)`;
    await tx.$executeRaw`SELECT set_config('app.current_user_source', 'seed:demo', true)`;

    const unidades = [
      { sigla: 'PMPR', nome: 'Polícia Militar do Paraná' },
      { sigla: 'PCPR', nome: 'Polícia Civil do Paraná' },
      { sigla: 'CBMPR', nome: 'Corpo de Bombeiros do Paraná' },
      { sigla: 'DEPPEN', nome: 'Polícia Penal do Paraná' },
      { sigla: 'SESP', nome: 'Secretaria de Estado da Segurança Pública' },
    ];

    for (const u of unidades) {
      await tx.unidadeFsp.upsert({
        where: { sigla: u.sigla },
        update: { nome: u.nome },
        create: u,
      });
    }

    const empresas = [
      { cnpj: '00000000000191', razaoSocial: 'Fornecedor Exemplo LTDA' },
      { cnpj: '11222333000181', razaoSocial: 'Locadora Paraná Veículos S.A.' },
      { cnpj: '44555666000172', razaoSocial: 'Alimentos Cascavel Ltda' },
      { cnpj: '77888999000163', razaoSocial: 'Tech Segurança Sistemas ME' },
    ];

    for (const e of empresas) {
      await tx.empresa.upsert({
        where: { cnpj: e.cnpj },
        update: { razaoSocial: e.razaoSocial },
        create: e,
      });
    }

    const gestores = [
      { cpf: '12345678901', nome: 'Gestor Exemplo' },
      { cpf: '98765432100', nome: 'Fiscal Exemplo' },
      { cpf: '11122233344', nome: 'Ana Paula Ferreira' },
      { cpf: '55566677788', nome: 'Carlos Eduardo Lima' },
      { cpf: '99988877766', nome: 'Mariana Souza Ribeiro' },
    ];

    for (const g of gestores) {
      await tx.entidadeGestora.upsert({
        where: { cpf: g.cpf },
        update: { nome: g.nome },
        create: g,
      });
    }

    const fornecedores = [
      { nome: 'Locadora Paraná Veículos S.A.', cnpj: '11222333000181' },
      { nome: 'Alimentos Cascavel Ltda', cnpj: '44555666000172' },
      { nome: 'Tech Segurança Sistemas ME', cnpj: '77888999000163' },
      { nome: 'Serviços Gerais Curitiba EIRELI', cnpj: '33444555000190' },
    ];

    for (const f of fornecedores) {
      const existing = await tx.fornecedor.findFirst({ where: { cnpj: f.cnpj } });
      if (existing) {
        await tx.fornecedor.update({ where: { id: existing.id }, data: { nome: f.nome } });
      } else {
        await tx.fornecedor.create({ data: f });
      }
    }

    const servicos = [
      { titulo: 'Locação de viaturas', descricao: 'Frota caracterizada e descaracterizada' },
      { titulo: 'Fornecimento de gêneros alimentícios', descricao: 'Unidades prisionais e operacionais' },
      { titulo: 'Manutenção de sistemas de segurança', descricao: 'CFTV, alarmes e controle de acesso' },
      { titulo: 'Limpeza e conservação', descricao: 'Postos de trabalho em sedes administrativas' },
    ];

    for (const s of servicos) {
      const existing = await tx.servico.findFirst({ where: { titulo: s.titulo } });
      if (existing) {
        await tx.servico.update({
          where: { id: existing.id },
          data: { descricao: s.descricao },
        });
      } else {
        await tx.servico.create({ data: s });
      }
    }

    const unidadePmpr = await tx.unidadeFsp.findUniqueOrThrow({ where: { sigla: 'PMPR' } });
    const unidadeDeppen = await tx.unidadeFsp.findUniqueOrThrow({ where: { sigla: 'DEPPEN' } });
    const unidadeSesp = await tx.unidadeFsp.findUniqueOrThrow({ where: { sigla: 'SESP' } });

    const empresaExemplo = await tx.empresa.findUniqueOrThrow({ where: { cnpj: '00000000000191' } });
    const empresaLocadora = await tx.empresa.findUniqueOrThrow({ where: { cnpj: '11222333000181' } });
    const empresaAlimentos = await tx.empresa.findUniqueOrThrow({ where: { cnpj: '44555666000172' } });

    const gestor = await tx.entidadeGestora.findUniqueOrThrow({ where: { cpf: '12345678901' } });
    const fiscal = await tx.entidadeGestora.findUniqueOrThrow({ where: { cpf: '98765432100' } });
    const ana = await tx.entidadeGestora.findUniqueOrThrow({ where: { cpf: '11122233344' } });
    const carlos = await tx.entidadeGestora.findUniqueOrThrow({ where: { cpf: '55566677788' } });

    const contratosDemo = [
      {
        numGms: 123,
        anoGms: 2026,
        protocoloCabeca: '15.848.565-6',
        unidadeFspId: unidadePmpr.id,
        gestorId: gestor.id,
        fiscalId: fiscal.id,
        empresaId: empresaExemplo.id,
        modalidade: 'Dispensa',
        objeto: 'Serviço de exemplo — manutenção preventiva',
        valorAnualCents: 1_000_000,
        dataInicio: new Date('2026-02-01'),
        dataFimOrig: new Date('2027-01-31'),
        status: 'vigente',
        aditivo: {
          numAditivo: 1,
          protocoloAdit: 'AD-001',
          novoFimVigencia: new Date('2027-06-30'),
          valorAdicionalCents: 200_000,
        },
      },
      {
        numGms: 456,
        anoGms: 2025,
        protocoloCabeca: '20.112.334-1',
        unidadeFspId: unidadeSesp.id,
        gestorId: ana.id,
        fiscalId: carlos.id,
        empresaId: empresaLocadora.id,
        modalidade: 'Pregão eletrônico',
        objeto: 'Locação de 40 viaturas descaracterizadas para uso operacional',
        valorAnualCents: 4_800_000_00,
        dataInicio: new Date('2025-03-01'),
        dataFimOrig: new Date('2026-02-28'),
        status: 'vigente',
        aditivo: {
          numAditivo: 1,
          protocoloAdit: 'AD-LOC-01',
          novoFimVigencia: new Date('2027-02-28'),
          valorAdicionalCents: 0,
        },
      },
      {
        numGms: 789,
        anoGms: 2026,
        protocoloCabeca: '21.445.778-9',
        unidadeFspId: unidadeDeppen.id,
        gestorId: carlos.id,
        fiscalId: ana.id,
        empresaId: empresaAlimentos.id,
        modalidade: 'Pregão eletrônico',
        objeto: 'Fornecimento de gêneros alimentícios para unidades prisionais',
        valorAnualCents: 12_500_000_00,
        dataInicio: new Date('2026-01-15'),
        dataFimOrig: new Date('2026-12-31'),
        status: 'vigente',
        aditivo: null,
      },
      {
        numGms: 321,
        anoGms: 2024,
        protocoloCabeca: '18.900.100-2',
        unidadeFspId: unidadePmpr.id,
        gestorId: gestor.id,
        fiscalId: fiscal.id,
        empresaId: empresaExemplo.id,
        modalidade: 'Inexigibilidade',
        objeto: 'Licenciamento de software de monitoramento (encerrado)',
        valorAnualCents: 350_000_00,
        dataInicio: new Date('2024-01-01'),
        dataFimOrig: new Date('2025-12-31'),
        status: 'encerrado',
        aditivo: null,
      },
    ];

    for (const c of contratosDemo) {
      const existing = await tx.contrato.findUnique({
        where: { numGms_anoGms: { numGms: c.numGms, anoGms: c.anoGms } },
      });

      let contratoId: string;
      if (existing) {
        await tx.aditivo.deleteMany({ where: { contratoId: existing.id } });
        await tx.contrato.update({
          where: { id: existing.id },
          data: {
            protocoloCabeca: c.protocoloCabeca,
            unidadeFspId: c.unidadeFspId,
            gestorId: c.gestorId,
            fiscalId: c.fiscalId,
            empresaId: c.empresaId,
            modalidade: c.modalidade,
            objeto: c.objeto,
            valorAnualCents: c.valorAnualCents,
            dataInicio: c.dataInicio,
            dataFimOrig: c.dataFimOrig,
            status: c.status,
          },
        });
        contratoId = existing.id;
      } else {
        const created = await tx.contrato.create({
          data: {
            protocoloCabeca: c.protocoloCabeca,
            numGms: c.numGms,
            anoGms: c.anoGms,
            unidadeFspId: c.unidadeFspId,
            gestorId: c.gestorId,
            fiscalId: c.fiscalId,
            empresaId: c.empresaId,
            modalidade: c.modalidade,
            objeto: c.objeto,
            valorAnualCents: c.valorAnualCents,
            dataInicio: c.dataInicio,
            dataFimOrig: c.dataFimOrig,
            status: c.status,
          },
        });
        contratoId = created.id;
      }

      if (c.aditivo) {
        await tx.aditivo.create({
          data: {
            contratoId,
            numAditivo: c.aditivo.numAditivo,
            protocoloAdit: c.aditivo.protocoloAdit,
            novoFimVigencia: c.aditivo.novoFimVigencia,
            valorAdicionalCents: c.aditivo.valorAdicionalCents,
          },
        });
      }
    }
  });

  const counts = {
    unidades: await prisma.unidadeFsp.count(),
    empresas: await prisma.empresa.count(),
    entidades: await prisma.entidadeGestora.count(),
    fornecedores: await prisma.fornecedor.count(),
    servicos: await prisma.servico.count(),
    contratos: await prisma.contrato.count(),
  };

  console.log('Seed complete:', counts);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
