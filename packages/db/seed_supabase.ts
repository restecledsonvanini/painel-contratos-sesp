import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from './generated/client/index.js';
import { DOMINIOS_SEED } from './seed/dominios.js';
import { ORGAOS_SEED, UNIDADES_DEMO } from './seed/orgaos.js';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

type MunicipioJson = { codigoIbge: string; nome: string; uf: string };

async function seedMunicipios() {
  const file = path.join(__dirname, 'seed/data/municipios-pr.json');
  const municipios = JSON.parse(readFileSync(file, 'utf8')) as MunicipioJson[];
  for (const m of municipios) {
    await prisma.municipio.upsert({
      where: { codigoIbge: m.codigoIbge },
      update: { nome: m.nome, uf: m.uf },
      create: { codigoIbge: m.codigoIbge, nome: m.nome, uf: m.uf },
    });
  }
  return municipios.length;
}

async function seedDominios() {
  const codigoToId = new Map<string, string>();

  for (const d of DOMINIOS_SEED) {
    const dominio = await prisma.dominio.upsert({
      where: { slug: d.slug },
      update: {
        nome: d.nome,
        descricao: d.descricao ?? null,
        editavelPeloUsuario: d.editavelPeloUsuario,
        permiteHierarquia: d.permiteHierarquia ?? false,
      },
      create: {
        slug: d.slug,
        nome: d.nome,
        descricao: d.descricao ?? null,
        editavelPeloUsuario: d.editavelPeloUsuario,
        permiteHierarquia: d.permiteHierarquia ?? false,
      },
    });

    for (const v of d.valores) {
      let parentId: string | null = null;
      if (v.parentCodigo) {
        parentId =
          codigoToId.get(`modalidade-licitacao:${v.parentCodigo}`) ??
          codigoToId.get(`${d.slug}:${v.parentCodigo}`) ??
          null;
      }

      const valor = await prisma.dominioValor.upsert({
        where: { dominioId_codigo: { dominioId: dominio.id, codigo: v.codigo } },
        update: {
          label: v.label,
          ordem: v.ordem,
          parentId,
          metadata: v.metadata ?? undefined,
          ativo: true,
        },
        create: {
          dominioId: dominio.id,
          codigo: v.codigo,
          label: v.label,
          ordem: v.ordem,
          parentId,
          metadata: v.metadata ?? undefined,
        },
      });
      codigoToId.set(`${d.slug}:${v.codigo}`, valor.id);
    }
  }
}

async function seedOrgaosEUnidades() {
  const curitiba = await prisma.municipio.findUniqueOrThrow({ where: { codigoIbge: '4106902' } });

  for (const o of ORGAOS_SEED) {
    await prisma.orgao.upsert({
      where: { sigla: o.sigla },
      update: { nome: o.nome, tipo: o.tipo, ativo: true },
      create: o,
    });
  }

  for (const u of UNIDADES_DEMO) {
    const orgao = await prisma.orgao.findUniqueOrThrow({ where: { sigla: u.orgaoSigla } });
    await prisma.unidadeOrganizacional.upsert({
      where: { orgaoId_sigla: { orgaoId: orgao.id, sigla: u.sigla } },
      update: {
        nome: u.nome,
        nivel: u.nivel,
        municipioId: curitiba.id,
        ativo: true,
      },
      create: {
        orgaoId: orgao.id,
        sigla: u.sigla,
        nome: u.nome,
        nivel: u.nivel,
        municipioId: curitiba.id,
      },
    });
  }

  // 33BPM child of CG-PMPR when both exist
  const pmpr = await prisma.orgao.findUniqueOrThrow({ where: { sigla: 'PMPR' } });
  const cg = await prisma.unidadeOrganizacional.findUnique({
    where: { orgaoId_sigla: { orgaoId: pmpr.id, sigla: 'CG-PMPR' } },
  });
  const bpm = await prisma.unidadeOrganizacional.findUnique({
    where: { orgaoId_sigla: { orgaoId: pmpr.id, sigla: '33BPM' } },
  });
  if (cg && bpm && bpm.parentId !== cg.id) {
    await prisma.unidadeOrganizacional.update({
      where: { id: bpm.id },
      data: { parentId: cg.id },
    });
  }
}

async function main() {
  console.log('Running seed script (local Docker / staging)');

  const systemUserId = '00000000-0000-0000-0000-000000000000';

  console.log('Seeding municípios PR...');
  const municipiosCount = await seedMunicipios();

  console.log('Seeding domínios...');
  await seedDominios();

  console.log('Seeding órgãos e unidades...');
  await seedOrgaosEUnidades();

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

    const fornecedores = [
      { documento: '00000000000191', razaoSocial: 'Fornecedor Exemplo LTDA' },
      { documento: '11222333000181', razaoSocial: 'Locadora Paraná Veículos S.A.' },
      { documento: '44555666000172', razaoSocial: 'Alimentos Cascavel Ltda' },
      { documento: '77888999000163', razaoSocial: 'Tech Segurança Sistemas ME' },
      { documento: '33444555000190', razaoSocial: 'Serviços Gerais Curitiba EIRELI' },
    ];

    for (const f of fornecedores) {
      await tx.fornecedor.upsert({
        where: { documento: f.documento },
        update: { razaoSocial: f.razaoSocial, tipoPessoa: 'JURIDICA', situacao: 'ATIVO' },
        create: {
          tipoPessoa: 'JURIDICA',
          documento: f.documento,
          razaoSocial: f.razaoSocial,
          situacao: 'ATIVO',
        },
      });
    }

    const servidores = [
      { cpf: '12345678901', nome: 'Gestor Exemplo', cargo: 'Gestor de contratos' },
      { cpf: '98765432100', nome: 'Fiscal Exemplo', cargo: 'Fiscal de contratos' },
      { cpf: '11122233344', nome: 'Ana Paula Ferreira', cargo: 'Gestora' },
      { cpf: '55566677788', nome: 'Carlos Eduardo Lima', cargo: 'Fiscal técnico' },
      { cpf: '99988877766', nome: 'Mariana Souza Ribeiro', cargo: 'Fiscal administrativa' },
    ];

    for (const s of servidores) {
      const existing = await tx.servidor.findFirst({ where: { cpf: s.cpf } });
      if (existing) {
        await tx.servidor.update({
          where: { id: existing.id },
          data: { nome: s.nome, cargo: s.cargo, ativo: true },
        });
      } else {
        await tx.servidor.create({ data: { ...s, ativo: true } });
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

    const empresaExemplo = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '00000000000191' } });
    const empresaLocadora = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '11222333000181' } });
    const empresaAlimentos = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '44555666000172' } });

    const gestor = await tx.servidor.findFirstOrThrow({ where: { cpf: '12345678901' } });
    const fiscal = await tx.servidor.findFirstOrThrow({ where: { cpf: '98765432100' } });
    const ana = await tx.servidor.findFirstOrThrow({ where: { cpf: '11122233344' } });
    const carlos = await tx.servidor.findFirstOrThrow({ where: { cpf: '55566677788' } });

    const contratosDemo = [
      {
        numGms: 123,
        anoGms: 2026,
        protocoloCabeca: '15.848.565-6',
        unidadeFspId: unidadePmpr.id,
        gestorId: gestor.id,
        fiscalId: fiscal.id,
        fornecedorId: empresaExemplo.id,
        modalidade: 'DISPENSA',
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
        fornecedorId: empresaLocadora.id,
        modalidade: 'PREGAO_ELETRONICO',
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
        fornecedorId: empresaAlimentos.id,
        modalidade: 'PREGAO_ELETRONICO',
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
        fornecedorId: empresaExemplo.id,
        modalidade: 'INEXIGIBILIDADE',
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
            fornecedorId: c.fornecedorId,
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
            fornecedorId: c.fornecedorId,
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
    municipios: municipiosCount,
    dominios: await prisma.dominio.count(),
    dominioValores: await prisma.dominioValor.count(),
    orgaos: await prisma.orgao.count(),
    unidadesOrg: await prisma.unidadeOrganizacional.count(),
    unidadesFsp: await prisma.unidadeFsp.count(),
    fornecedores: await prisma.fornecedor.count(),
    servidores: await prisma.servidor.count(),
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
