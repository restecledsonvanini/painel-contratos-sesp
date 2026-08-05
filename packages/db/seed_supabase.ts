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

    const pmprOrgao = await tx.orgao.findUniqueOrThrow({ where: { sigla: 'PMPR' } });
    const deppenOrgao = await tx.orgao.findUniqueOrThrow({ where: { sigla: 'DEPPEN' } });
    const sespOrgao = await tx.orgao.findUniqueOrThrow({ where: { sigla: 'SESP' } });

    const unidadePmpr = await tx.unidadeOrganizacional.findUniqueOrThrow({
      where: { orgaoId_sigla: { orgaoId: pmprOrgao.id, sigla: 'CG-PMPR' } },
    });
    const unidadeDeppen = await tx.unidadeOrganizacional.findUniqueOrThrow({
      where: { orgaoId_sigla: { orgaoId: deppenOrgao.id, sigla: 'DIR-DEPPEN' } },
    });
    const unidadeSesp = await tx.unidadeOrganizacional.findUniqueOrThrow({
      where: { orgaoId_sigla: { orgaoId: sespOrgao.id, sigla: 'GAB-SESP' } },
    });

    const empresaExemplo = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '00000000000191' } });
    const empresaLocadora = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '11222333000181' } });
    const empresaAlimentos = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '44555666000172' } });

    const gestor = await tx.servidor.findFirstOrThrow({ where: { cpf: '12345678901' } });
    const fiscal = await tx.servidor.findFirstOrThrow({ where: { cpf: '98765432100' } });
    const ana = await tx.servidor.findFirstOrThrow({ where: { cpf: '11122233344' } });
    const carlos = await tx.servidor.findFirstOrThrow({ where: { cpf: '55566677788' } });

    const modalidadeByCodigo = async (codigo: string) => {
      const d = await tx.dominio.findUniqueOrThrow({ where: { slug: 'modalidade-licitacao' } });
      return tx.dominioValor.findUniqueOrThrow({
        where: { dominioId_codigo: { dominioId: d.id, codigo } },
      });
    };
    const categoriaByCodigo = async (codigo: string) => {
      const d = await tx.dominio.findUniqueOrThrow({ where: { slug: 'categoria-contratacao' } });
      return tx.dominioValor.findUniqueOrThrow({
        where: { dominioId_codigo: { dominioId: d.id, codigo } },
      });
    };

    const modDispensa = await modalidadeByCodigo('DISPENSA');
    const modPregao = await modalidadeByCodigo('PREGAO_ELETRONICO');
    const modInex = await modalidadeByCodigo('INEXIGIBILIDADE');
    const catServico = await categoriaByCodigo('SERVICO_EVENTUAL');
    const catLocVeic = await categoriaByCodigo('LOCACAO_VEICULOS');
    const catAlim = await categoriaByCodigo('GENEROS_ALIMENTICIOS');

    const contratosDemo = [
      {
        numeroGms: '123',
        anoGms: 2026,
        eProtocolo: '15.848.565-6',
        unidadeGestoraId: unidadePmpr.id,
        gestorId: gestor.id,
        fiscalId: fiscal.id,
        fornecedorId: empresaExemplo.id,
        modalidadeId: modDispensa.id,
        categoriaContratacaoId: catServico.id,
        naturezaObjeto: 'SERVICO_CONTINUADO' as const,
        pilar: 'SERVICOS' as const,
        objeto: 'Serviço de exemplo — manutenção preventiva',
        valorGlobalOriginalCents: BigInt(1_000_000),
        dataInicioVigencia: new Date('2026-02-01'),
        dataFimVigenciaOriginal: new Date('2027-01-31'),
        prazoInicialValor: 12,
        situacao: 'VIGENTE' as const,
        aditivo: {
          numAditivo: 1,
          protocoloAdit: 'AD-001',
          novoFimVigencia: new Date('2027-06-30'),
          valorAdicionalCents: 200_000,
        },
      },
      {
        numeroGms: '456',
        anoGms: 2025,
        eProtocolo: '20.112.334-1',
        unidadeGestoraId: unidadeSesp.id,
        gestorId: ana.id,
        fiscalId: carlos.id,
        fornecedorId: empresaLocadora.id,
        modalidadeId: modPregao.id,
        categoriaContratacaoId: catLocVeic.id,
        naturezaObjeto: 'LOCACAO_BEM_MOVEL' as const,
        pilar: 'CUSTEIO' as const,
        objeto: 'Locação de 40 viaturas descaracterizadas para uso operacional',
        valorGlobalOriginalCents: BigInt(480_000_000),
        dataInicioVigencia: new Date('2025-03-01'),
        dataFimVigenciaOriginal: new Date('2026-02-28'),
        prazoInicialValor: 12,
        situacao: 'VIGENTE' as const,
        aditivo: {
          numAditivo: 1,
          protocoloAdit: 'AD-LOC-01',
          novoFimVigencia: new Date('2027-02-28'),
          valorAdicionalCents: 0,
        },
      },
      {
        numeroGms: '789',
        anoGms: 2026,
        eProtocolo: '21.445.778-9',
        unidadeGestoraId: unidadeDeppen.id,
        gestorId: carlos.id,
        fiscalId: ana.id,
        fornecedorId: empresaAlimentos.id,
        modalidadeId: modPregao.id,
        categoriaContratacaoId: catAlim.id,
        naturezaObjeto: 'COMPRA' as const,
        pilar: 'CUSTEIO' as const,
        objeto: 'Fornecimento de gêneros alimentícios para unidades prisionais',
        valorGlobalOriginalCents: BigInt(1_250_000_000),
        dataInicioVigencia: new Date('2026-01-15'),
        dataFimVigenciaOriginal: new Date('2026-12-31'),
        prazoInicialValor: 12,
        situacao: 'VIGENTE' as const,
        aditivo: null,
      },
      {
        numeroGms: '321',
        anoGms: 2024,
        eProtocolo: '18.900.100-2',
        unidadeGestoraId: unidadePmpr.id,
        gestorId: gestor.id,
        fiscalId: fiscal.id,
        fornecedorId: empresaExemplo.id,
        modalidadeId: modInex.id,
        categoriaContratacaoId: catServico.id,
        naturezaObjeto: 'SOLUCAO_TIC' as const,
        pilar: 'INVESTIMENTO' as const,
        objeto: 'Licenciamento de software de monitoramento (encerrado)',
        valorGlobalOriginalCents: BigInt(35_000_000),
        dataInicioVigencia: new Date('2024-01-01'),
        dataFimVigenciaOriginal: new Date('2025-12-31'),
        prazoInicialValor: 24,
        situacao: 'ENCERRADO' as const,
        aditivo: null,
      },
    ];

    for (const c of contratosDemo) {
      const existing = await tx.contrato.findUnique({
        where: { numeroGms_anoGms: { numeroGms: c.numeroGms, anoGms: c.anoGms } },
      });

      let contratoId: string;
      const baseData = {
        eProtocolo: c.eProtocolo,
        unidadeGestoraId: c.unidadeGestoraId,
        fornecedorId: c.fornecedorId,
        modalidadeId: c.modalidadeId,
        categoriaContratacaoId: c.categoriaContratacaoId,
        naturezaObjeto: c.naturezaObjeto,
        pilar: c.pilar,
        objeto: c.objeto,
        valorGlobalOriginalCents: c.valorGlobalOriginalCents,
        dataAssinatura: c.dataInicioVigencia,
        dataInicioVigencia: c.dataInicioVigencia,
        dataFimVigenciaOriginal: c.dataFimVigenciaOriginal,
        prazoInicialValor: c.prazoInicialValor,
        prazoInicialUnidade: 'MESES' as const,
        prorrogavel: true,
        limiteProrrogacaoMeses: 120,
        situacao: c.situacao,
      };

      if (existing) {
        await tx.aditivo.deleteMany({ where: { contratoId: existing.id } });
        await tx.contratoResponsavel.deleteMany({ where: { contratoId: existing.id } });
        await tx.contratoRateio.deleteMany({ where: { contratoId: existing.id } });
        await tx.contrato.update({ where: { id: existing.id }, data: baseData });
        contratoId = existing.id;
      } else {
        const created = await tx.contrato.create({
          data: {
            numeroGms: c.numeroGms,
            anoGms: c.anoGms,
            ...baseData,
          },
        });
        contratoId = created.id;
      }

      await tx.contratoResponsavel.create({
        data: {
          contratoId,
          servidorId: c.gestorId,
          papel: 'GESTOR',
          dataInicio: c.dataInicioVigencia,
        },
      });
      await tx.contratoResponsavel.create({
        data: {
          contratoId,
          servidorId: c.fiscalId,
          papel: 'FISCAL_TECNICO',
          dataInicio: c.dataInicioVigencia,
        },
      });
      await tx.contratoRateio.create({
        data: {
          contratoId,
          unidadeId: c.unidadeGestoraId,
          percentual: 100,
        },
      });

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
