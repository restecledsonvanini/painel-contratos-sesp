import { readFileSync } from 'node:fs';
import path from 'node:path';
import { randomBytes, scryptSync } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DOMINIOS_SEED } from './seed/dominios.js';
import { ORGAOS_SEED, UNIDADES_SEDE } from './seed/orgaos.js';
import { createPrismaClient } from './src/client.ts';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';

const prisma = createPrismaClient(process.env.DATABASE_URL);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

type MunicipioJson = { codigoIbge: string; nome: string; uf: string };

/** Documentos/CPFs canônicos dos 5 exemplares — tudo fora disso é lixo de teste. */
const FORNECEDOR_DOCS = [
  '00000000000191',
  '11222333000181',
  '44555666000172',
  '77888999000163',
  '33444555000190',
] as const;

const SERVIDOR_CPFS = [
  '12345678901',
  '98765432100',
  '11122233344',
  '55566677788',
  '99988877766',
] as const;

const CATALOGO_NOMES = [
  'Locação de viaturas',
  'Fornecimento de gêneros alimentícios',
  'Manutenção de sistemas de segurança',
  'Limpeza e conservação',
  'SUV operacional',
] as const;

const CONTRATO_KEYS = [
  { numeroGms: '123', anoGms: 2026 },
  { numeroGms: '456', anoGms: 2025 },
  { numeroGms: '789', anoGms: 2026 },
  { numeroGms: '321', anoGms: 2024 },
  { numeroGms: '555', anoGms: 2026 },
] as const;

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

  // Desativa valores de teste criados pelos testes da API
  await prisma.dominioValor.updateMany({
    where: { codigo: { startsWith: 'TEST_' } },
    data: { ativo: false },
  });
}

async function seedOrgaosESedes() {
  const curitiba = await prisma.municipio.findUniqueOrThrow({ where: { codigoIbge: '4106902' } });
  const sedeSiglas = new Set(UNIDADES_SEDE.map((u) => `${u.orgaoSigla}:${u.sigla}`));

  // 1ª passagem: upsert sem parent (garante SESP existe antes do vínculo)
  for (const o of ORGAOS_SEED) {
    const { parentSigla: _p, ...data } = o;
    await prisma.orgao.upsert({
      where: { sigla: o.sigla },
      update: { nome: o.nome, tipo: o.tipo, ativo: true },
      create: data,
    });
  }

  // 2ª passagem: parentId (SESP → forças)
  for (const o of ORGAOS_SEED) {
    const parentId = o.parentSigla
      ? (await prisma.orgao.findUniqueOrThrow({ where: { sigla: o.parentSigla } })).id
      : null;
    await prisma.orgao.update({
      where: { sigla: o.sigla },
      data: { parentId },
    });
  }

  for (const u of UNIDADES_SEDE) {
    const orgao = await prisma.orgao.findUniqueOrThrow({ where: { sigla: u.orgaoSigla } });
    await prisma.unidadeOrganizacional.upsert({
      where: { orgaoId_sigla: { orgaoId: orgao.id, sigla: u.sigla } },
      update: {
        nome: u.nome,
        nivel: u.nivel,
        municipioId: curitiba.id,
        parentId: null,
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

  // Remove subunidades que não são sede (ex.: 33BPM) — usuário cadastra depois
  const extras = await prisma.unidadeOrganizacional.findMany({
    include: { orgao: { select: { sigla: true } } },
  });
  for (const u of extras) {
    const key = `${u.orgao.sigla}:${u.sigla}`;
    if (!sedeSiglas.has(key)) {
      await prisma.unidadeOrganizacional.delete({ where: { id: u.id } }).catch(() => {
        // se estiver vinculada a contrato, apenas desativa
        return prisma.unidadeOrganizacional.update({
          where: { id: u.id },
          data: { ativo: false },
        });
      });
    }
  }
}

/**
 * Apaga dados operacionais/demo e lixo de testes, preservando
 * municípios, domínios oficiais e órgãos/sedes.
 */
async function purgeOperacional() {
  console.log('Limpando dados operacionais e lixo de testes...');

  await prisma.$executeRaw`SELECT set_config('app.current_user', 'seed:purge', true)`;
  await prisma.$executeRaw`SELECT set_config('app.request_id', 'seed-purge', true)`;

  await prisma.alerta.deleteMany({});
  await prisma.importacaoLinha.deleteMany({});
  await prisma.importacaoLote.deleteMany({});
  await prisma.documento.deleteMany({});
  await prisma.publicacao.deleteMany({});
  await prisma.empenho.deleteMany({});
  await prisma.reservaOrcamentaria.deleteMany({});
  await prisma.contratoDotacao.deleteMany({});
  await prisma.dotacaoOrcamentaria.deleteMany({});
  await prisma.alteracaoItem.deleteMany({});
  await prisma.alteracaoContratual.deleteMany({});
  await prisma.itemContrato.deleteMany({});
  await prisma.contratoResponsavel.deleteMany({});
  await prisma.contratoRateio.deleteMany({});
  await prisma.contrato.deleteMany({});
  await prisma.processoContratacao.deleteMany({});

  await prisma.fornecedorSancao.deleteMany({});
  await prisma.fornecedorContato.deleteMany({});
  await prisma.fornecedor.deleteMany({
    where: { documento: { notIn: [...FORNECEDOR_DOCS] } },
  });

  await prisma.servidor.deleteMany({
    where: { OR: [{ cpf: null }, { cpf: { notIn: [...SERVIDOR_CPFS] } }] },
  });

  await prisma.catalogoItem.deleteMany({});

  await prisma.usuario.deleteMany({});
  await prisma.auditLog.deleteMany({});
}

async function main() {
  console.log('Running curated seed (5 exemplares / entidade; forças preservadas)');

  console.log('Seeding municípios PR...');
  const municipiosCount = await seedMunicipios();

  console.log('Seeding domínios...');
  await seedDominios();

  console.log('Seeding órgãos e sedes...');
  await seedOrgaosESedes();

  await purgeOperacional();

  const systemUserId = '00000000-0000-0000-0000-000000000000';

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_user', ${systemUserId}, true)`;
    await tx.$executeRaw`SELECT set_config('app.current_user_source', 'seed:demo', true)`;

    // Compat legado UnidadeFsp = mesmas forças (sem subunidades)
    const forcasFsp = [
      { sigla: 'PMPR', nome: 'Polícia Militar do Paraná' },
      { sigla: 'PCPR', nome: 'Polícia Civil do Paraná' },
      { sigla: 'CBMPR', nome: 'Corpo de Bombeiros Militar do Paraná' },
      { sigla: 'DEPPEN', nome: 'Departamento Penitenciário do Paraná' },
      { sigla: 'SESP', nome: 'Secretaria de Estado da Segurança Pública' },
    ];
    for (const u of forcasFsp) {
      await tx.unidadeFsp.upsert({
        where: { sigla: u.sigla },
        update: { nome: u.nome },
        create: u,
      });
    }
    await tx.unidadeFsp.deleteMany({
      where: { sigla: { notIn: forcasFsp.map((f) => f.sigla) } },
    });

    const orgaoPmpr = await tx.orgao.findUniqueOrThrow({ where: { sigla: 'PMPR' } });
    const orgaoPcpr = await tx.orgao.findUniqueOrThrow({ where: { sigla: 'PCPR' } });
    const orgaoCbm = await tx.orgao.findUniqueOrThrow({ where: { sigla: 'CBMPR' } });
    const orgaoDeppen = await tx.orgao.findUniqueOrThrow({ where: { sigla: 'DEPPEN' } });
    const orgaoSesp = await tx.orgao.findUniqueOrThrow({ where: { sigla: 'SESP' } });

    const sede = async (orgaoId: string, sigla: string) =>
      tx.unidadeOrganizacional.findUniqueOrThrow({
        where: { orgaoId_sigla: { orgaoId, sigla } },
      });

    const unidadePmpr = await sede(orgaoPmpr.id, 'CG-PMPR');
    const unidadePcpr = await sede(orgaoPcpr.id, 'DG-PCPR');
    const unidadeCbm = await sede(orgaoCbm.id, 'CG-CBMPR');
    const unidadeDeppen = await sede(orgaoDeppen.id, 'DIR-DEPPEN');
    const unidadeSesp = await sede(orgaoSesp.id, 'GAB-SESP');

    // ——— 5 Fornecedores ———
    const fornecedoresSeed = [
      {
        documento: '00000000000191',
        razaoSocial: 'Fornecedor Exemplo LTDA',
        nomeFantasia: 'Fornecedor Exemplo',
      },
      {
        documento: '11222333000181',
        razaoSocial: 'Locadora Paraná Veículos S.A.',
        nomeFantasia: 'Locadora Paraná',
      },
      {
        documento: '44555666000172',
        razaoSocial: 'Alimentos Cascavel Ltda',
        nomeFantasia: 'Alimentos Cascavel',
      },
      {
        documento: '77888999000163',
        razaoSocial: 'Tech Segurança Sistemas ME',
        nomeFantasia: 'Tech Segurança',
      },
      {
        documento: '33444555000190',
        razaoSocial: 'Serviços Gerais Curitiba EIRELI',
        nomeFantasia: 'Serviços Gerais CWB',
      },
    ];
    for (const f of fornecedoresSeed) {
      await tx.fornecedor.upsert({
        where: { documento: f.documento },
        update: {
          razaoSocial: f.razaoSocial,
          nomeFantasia: f.nomeFantasia,
          tipoPessoa: 'JURIDICA',
          situacao: 'ATIVO',
        },
        create: {
          tipoPessoa: 'JURIDICA',
          documento: f.documento,
          razaoSocial: f.razaoSocial,
          nomeFantasia: f.nomeFantasia,
          situacao: 'ATIVO',
        },
      });
    }

    // ——— 5 Servidores (2 gestores + 3 fiscais; cargo define o papel no formulário) ———
    const servidoresSeed = [
      {
        cpf: '12345678901',
        nome: 'Gestor Exemplo',
        cargo: 'Gestor de contratos',
        orgaoId: orgaoPmpr.id,
        unidadeId: unidadePmpr.id,
      },
      {
        cpf: '98765432100',
        nome: 'Fiscal Exemplo',
        cargo: 'Fiscal de contratos',
        orgaoId: orgaoPmpr.id,
        unidadeId: unidadePmpr.id,
      },
      {
        cpf: '11122233344',
        nome: 'Ana Paula Ferreira',
        cargo: 'Gestora de contratos',
        orgaoId: orgaoSesp.id,
        unidadeId: unidadeSesp.id,
      },
      {
        cpf: '55566677788',
        nome: 'Carlos Eduardo Lima',
        cargo: 'Fiscal técnico',
        orgaoId: orgaoSesp.id,
        unidadeId: unidadeSesp.id,
      },
      {
        cpf: '99988877766',
        nome: 'Mariana Souza Ribeiro',
        cargo: 'Fiscal administrativa',
        orgaoId: orgaoDeppen.id,
        unidadeId: unidadeDeppen.id,
      },
    ];
    for (const s of servidoresSeed) {
      const existing = await tx.servidor.findFirst({ where: { cpf: s.cpf } });
      if (existing) {
        await tx.servidor.update({
          where: { id: existing.id },
          data: {
            nome: s.nome,
            cargo: s.cargo,
            orgaoId: s.orgaoId,
            unidadeId: s.unidadeId,
            ativo: true,
          },
        });
      } else {
        await tx.servidor.create({ data: { ...s, ativo: true } });
      }
    }

    // ——— 5 Catálogo ———
    const catalogoSeed = [
      { nome: 'Locação de viaturas', descricao: 'Frota caracterizada e descaracterizada', cat: 'VEICULO', um: 'UN' },
      { nome: 'Fornecimento de gêneros alimentícios', descricao: 'Unidades prisionais e operacionais', cat: 'ALIMENTO', um: 'KG' },
      { nome: 'Manutenção de sistemas de segurança', descricao: 'CFTV, alarmes e controle de acesso', cat: 'SERVICO', um: 'SERVICO' },
      { nome: 'Limpeza e conservação', descricao: 'Postos de trabalho em sedes administrativas', cat: 'POSTO_TRABALHO', um: 'POSTO' },
      { nome: 'SUV operacional', descricao: 'Veículo tipo SUV para uso operacional', cat: 'VEICULO', um: 'UN' },
    ];
    for (const item of catalogoSeed) {
      const cat = await tx.dominioValor.findFirstOrThrow({
        where: { dominio: { slug: 'categoria-item' }, codigo: item.cat },
      });
      const um = await tx.dominioValor.findFirstOrThrow({
        where: { dominio: { slug: 'unidade-medida' }, codigo: item.um },
      });
      await tx.catalogoItem.upsert({
        where: { categoriaItemId_nome: { categoriaItemId: cat.id, nome: item.nome } },
        update: { descricao: item.descricao, unidadeMedidaPadraoId: um.id, ativo: true },
        create: {
          categoriaItemId: cat.id,
          nome: item.nome,
          descricao: item.descricao,
          unidadeMedidaPadraoId: um.id,
          ativo: true,
        },
      });
    }

    const catVeiculo = await tx.dominioValor.findFirstOrThrow({
      where: { dominio: { slug: 'categoria-item' }, codigo: 'VEICULO' },
    });
    const catImovel = await tx.dominioValor.findFirstOrThrow({
      where: { dominio: { slug: 'categoria-item' }, codigo: 'IMOVEL' },
    });
    const atributosSeed = [
      { categoriaItemId: catVeiculo.id, chave: 'tipoVeiculo', label: 'Tipo de veículo', tipo: 'SELECAO' as const, dominioSlug: 'tipo-veiculo', ordem: 1 },
      { categoriaItemId: catVeiculo.id, chave: 'caracterizacao', label: 'Caracterização', tipo: 'SELECAO' as const, ordem: 2, ajuda: 'CARACTERIZADA ou DESCARACTERIZADA' },
      { categoriaItemId: catVeiculo.id, chave: 'modalidadeUso', label: 'Modalidade de uso', tipo: 'SELECAO' as const, ordem: 3 },
      { categoriaItemId: catImovel.id, chave: 'metragemM2', label: 'Metragem (m²)', tipo: 'NUMERO' as const, unidade: 'm²', ordem: 1, obrigatorio: true },
      { categoriaItemId: catImovel.id, chave: 'destinacaoImovel', label: 'Destinação', tipo: 'SELECAO' as const, dominioSlug: 'destinacao-imovel', ordem: 2 },
    ];
    for (const a of atributosSeed) {
      await tx.itemAtributoDef.upsert({
        where: { categoriaItemId_chave: { categoriaItemId: a.categoriaItemId, chave: a.chave } },
        update: {
          label: a.label,
          tipo: a.tipo,
          dominioSlug: a.dominioSlug ?? null,
          unidade: a.unidade ?? null,
          ordem: a.ordem,
          obrigatorio: a.obrigatorio ?? false,
          ajuda: a.ajuda ?? null,
          ativo: true,
        },
        create: {
          categoriaItemId: a.categoriaItemId,
          chave: a.chave,
          label: a.label,
          tipo: a.tipo,
          dominioSlug: a.dominioSlug ?? null,
          unidade: a.unidade ?? null,
          ordem: a.ordem,
          obrigatorio: a.obrigatorio ?? false,
          ajuda: a.ajuda ?? null,
        },
      });
    }

    const fExemplo = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '00000000000191' } });
    const fLocadora = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '11222333000181' } });
    const fAlimentos = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '44555666000172' } });
    const fTech = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '77888999000163' } });
    const fLimpeza = await tx.fornecedor.findUniqueOrThrow({ where: { documento: '33444555000190' } });

    const gestorPmpr = await tx.servidor.findFirstOrThrow({ where: { cpf: '12345678901' } });
    const fiscalPmpr = await tx.servidor.findFirstOrThrow({ where: { cpf: '98765432100' } });
    const gestoraSesp = await tx.servidor.findFirstOrThrow({ where: { cpf: '11122233344' } });
    const fiscalSesp = await tx.servidor.findFirstOrThrow({ where: { cpf: '55566677788' } });
    const fiscalDeppen = await tx.servidor.findFirstOrThrow({ where: { cpf: '99988877766' } });

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
    const fundamentoByCodigo = async (codigo: string) => {
      const d = await tx.dominio.findUniqueOrThrow({ where: { slug: 'fundamento-legal' } });
      return tx.dominioValor.findUniqueOrThrow({
        where: { dominioId_codigo: { dominioId: d.id, codigo } },
      });
    };

    const modDispensa = await modalidadeByCodigo('DISPENSA');
    const modPregao = await modalidadeByCodigo('PREGAO_ELETRONICO');
    const modInex = await modalidadeByCodigo('INEXIGIBILIDADE');
    const fundDispensa = await fundamentoByCodigo('ART_75_I');
    const fundInex = await fundamentoByCodigo('ART_74_I');
    const catServico = await categoriaByCodigo('SERVICO_EVENTUAL');
    const catLocVeic = await categoriaByCodigo('LOCACAO_VEICULOS');
    const catAlim = await categoriaByCodigo('GENEROS_ALIMENTICIOS');
    const catLimpeza = await categoriaByCodigo('SERVICO_EVENTUAL');

    // ——— 5 Contratos (gestora = Orgao/força; subunidade = sede) ———
    const contratosDemo = [
      {
        numeroGms: '123',
        anoGms: 2026,
        eProtocolo: '15.848.565-6',
        unidadeGestoraId: orgaoPmpr.id,
        subunidadeId: unidadePmpr.id,
        gestorId: gestorPmpr.id,
        fiscalId: fiscalPmpr.id,
        fornecedorId: fExemplo.id,
        modalidadeId: modDispensa.id,
        fundamentoLegalId: fundDispensa.id,
        categoriaContratacaoId: catServico.id,
        naturezaObjeto: 'SERVICO_CONTINUADO' as const,
        pilar: 'SERVICOS' as const,
        objeto: 'Manutenção preventiva de equipamentos de segurança — PMPR',
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
        catalogoNome: 'Manutenção de sistemas de segurança',
      },
      {
        numeroGms: '456',
        anoGms: 2025,
        eProtocolo: '20.112.334-1',
        unidadeGestoraId: orgaoSesp.id,
        subunidadeId: unidadeSesp.id,
        gestorId: gestoraSesp.id,
        fiscalId: fiscalSesp.id,
        fornecedorId: fLocadora.id,
        modalidadeId: modPregao.id,
        fundamentoLegalId: null as string | null,
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
        catalogoNome: 'SUV operacional',
        itemQtd: 40,
        itemValorUnitarioCents: BigInt(10_000_00),
        garantiaValidade: new Date('2026-09-18'),
      },
      {
        numeroGms: '789',
        anoGms: 2026,
        eProtocolo: '21.445.778-9',
        unidadeGestoraId: orgaoDeppen.id,
        subunidadeId: unidadeDeppen.id,
        gestorId: gestoraSesp.id,
        fiscalId: fiscalDeppen.id,
        fornecedorId: fAlimentos.id,
        modalidadeId: modPregao.id,
        fundamentoLegalId: null as string | null,
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
        catalogoNome: 'Fornecimento de gêneros alimentícios',
      },
      {
        numeroGms: '321',
        anoGms: 2024,
        eProtocolo: '18.900.100-2',
        unidadeGestoraId: orgaoPcpr.id,
        subunidadeId: unidadePcpr.id,
        gestorId: gestorPmpr.id,
        fiscalId: fiscalPmpr.id,
        fornecedorId: fTech.id,
        modalidadeId: modInex.id,
        fundamentoLegalId: fundInex.id,
        categoriaContratacaoId: catServico.id,
        naturezaObjeto: 'SOLUCAO_TIC' as const,
        pilar: 'INVESTIMENTO' as const,
        objeto: 'Licenciamento de software de monitoramento — encerrado',
        valorGlobalOriginalCents: BigInt(35_000_000),
        dataInicioVigencia: new Date('2024-01-01'),
        dataFimVigenciaOriginal: new Date('2025-12-31'),
        prazoInicialValor: 24,
        situacao: 'ENCERRADO' as const,
        aditivo: null,
        catalogoNome: 'Manutenção de sistemas de segurança',
      },
      {
        numeroGms: '555',
        anoGms: 2026,
        eProtocolo: '22.100.200-5',
        unidadeGestoraId: orgaoCbm.id,
        subunidadeId: unidadeCbm.id,
        gestorId: gestoraSesp.id,
        fiscalId: fiscalSesp.id,
        fornecedorId: fLimpeza.id,
        modalidadeId: modPregao.id,
        fundamentoLegalId: null as string | null,
        categoriaContratacaoId: catLimpeza.id,
        naturezaObjeto: 'SERVICO_CONTINUADO' as const,
        pilar: 'SERVICOS' as const,
        objeto: 'Limpeza e conservação das sedes do CBMPR',
        valorGlobalOriginalCents: BigInt(2_400_000_00),
        dataInicioVigencia: new Date('2026-03-01'),
        dataFimVigenciaOriginal: new Date('2027-02-28'),
        prazoInicialValor: 12,
        situacao: 'VIGENTE' as const,
        aditivo: null,
        catalogoNome: 'Limpeza e conservação',
      },
    ];

    for (const c of contratosDemo) {
      const created = await tx.contrato.create({
        data: {
          numeroGms: c.numeroGms,
          anoGms: c.anoGms,
          eProtocolo: c.eProtocolo,
          unidadeGestoraId: c.unidadeGestoraId,
          subunidadeId: c.subunidadeId,
          fornecedorId: c.fornecedorId,
          modalidadeId: c.modalidadeId,
          fundamentoLegalId: c.fundamentoLegalId,
          categoriaContratacaoId: c.categoriaContratacaoId,
          naturezaObjeto: c.naturezaObjeto,
          pilar: c.pilar,
          objeto: c.objeto,
          valorGlobalOriginalCents: c.valorGlobalOriginalCents,
          dataAssinatura: c.dataInicioVigencia,
          dataInicioVigencia: c.dataInicioVigencia,
          dataFimVigenciaOriginal: c.dataFimVigenciaOriginal,
          prazoInicialValor: c.prazoInicialValor,
          prazoInicialUnidade: 'MESES',
          situacao: c.situacao,
          prorrogavel: true,
          limiteProrrogacaoMeses: 60,
          garantiaTipo: c.garantiaValidade ? 'CAUCAO' : 'NENHUMA',
          garantiaValorCents: c.garantiaValidade ? BigInt(100_000_00) : null,
          garantiaValidade: c.garantiaValidade ?? null,
        },
      });

      await tx.contratoResponsavel.create({
        data: {
          contratoId: created.id,
          servidorId: c.gestorId,
          papel: 'GESTOR',
          dataInicio: c.dataInicioVigencia,
        },
      });
      await tx.contratoResponsavel.create({
        data: {
          contratoId: created.id,
          servidorId: c.fiscalId,
          papel: 'FISCAL_TECNICO',
          dataInicio: c.dataInicioVigencia,
        },
      });
      await tx.contratoRateio.create({
        data: {
          contratoId: created.id,
          unidadeId: c.subunidadeId,
          percentual: 100,
        },
      });

      if (c.catalogoNome) {
        const catalogo = await tx.catalogoItem.findFirstOrThrow({ where: { nome: c.catalogoNome } });
        await tx.itemContrato.create({
          data: {
            contratoId: created.id,
            sequencia: 1,
            catalogoItemId: catalogo.id,
            quantidade: c.itemQtd ?? 1,
            unidadeMedidaId: catalogo.unidadeMedidaPadraoId,
            valorUnitarioCents: c.itemValorUnitarioCents ?? c.valorGlobalOriginalCents,
            periodicidade: c.itemQtd ? 'MENSAL' : 'UNICA',
            unidadeDestinoId: c.subunidadeId,
            atributos:
              c.numeroGms === '456'
                ? {
                    tipoVeiculo: 'SUV',
                    caracterizacao: 'DESCARACTERIZADA',
                    modalidadeUso: 'LOCACAO',
                  }
                : undefined,
          },
        });
      }

      if (c.aditivo) {
        const valor = c.aditivo.valorAdicionalCents ?? 0;
        const temPrazo = Boolean(c.aditivo.novoFimVigencia);
        const tipo =
          temPrazo && valor > 0
            ? 'ADITIVO_PRAZO_VALOR'
            : temPrazo
              ? 'ADITIVO_PRAZO'
              : 'ADITIVO_ACRESCIMO_QUANTITATIVO';
        await tx.alteracaoContratual.create({
          data: {
            contratoId: created.id,
            tipo: tipo as never,
            numero: c.aditivo.numAditivo,
            eProtocolo: c.aditivo.protocoloAdit,
            objetoDescricao: 'Aditivo de demonstração',
            dataAssinatura: c.dataInicioVigencia,
            novaDataFimVigencia: c.aditivo.novoFimVigencia,
            valorAcrescidoCents: BigInt(valor),
            valorSuprimidoCents: BigInt(0),
            situacao: 'ASSINADO',
          },
        });
      }
    }
  });

  // Orçamento / publicidade do contrato GMS 456 (referência dos testes)
  const contrato456 = await prisma.contrato.findUnique({
    where: { numeroGms_anoGms: { numeroGms: '456', anoGms: 2025 } },
  });
  if (contrato456) {
    const natureza = await prisma.dominioValor.findFirstOrThrow({
      where: { dominio: { slug: 'natureza-despesa' }, codigo: '33903900' },
    });
    const fonte = await prisma.dominioValor.findFirstOrThrow({
      where: { dominio: { slug: 'fonte-recurso' }, codigo: 'TESOURO_ESTADO' },
    });
    const veiculoPncp = await prisma.dominioValor.findFirstOrThrow({
      where: { dominio: { slug: 'veiculo-publicacao' }, codigo: 'PNCP' },
    });
    const tipoDoc = await prisma.dominioValor.findFirstOrThrow({
      where: { dominio: { slug: 'tipo-documento' }, codigo: 'CONTRATO_ASSINADO' },
    });

    const dotacao = await prisma.dotacaoOrcamentaria.upsert({
      where: { exercicio_codigo: { exercicio: 2025, codigo: '3390.39.00.10.301' } },
      update: {
        naturezaDespesaId: natureza.id,
        fonteRecursoId: fonte.id,
        descricao: 'Locação de veículos — SESP',
      },
      create: {
        exercicio: 2025,
        codigo: '3390.39.00.10.301',
        naturezaDespesaId: natureza.id,
        fonteRecursoId: fonte.id,
        descricao: 'Locação de veículos — SESP',
      },
    });

    await prisma.contratoDotacao.create({
      data: {
        contratoId: contrato456.id,
        dotacaoId: dotacao.id,
        exercicio: 2025,
        valorPrevistoCents: BigInt(480_000_000),
      },
    });
    await prisma.empenho.create({
      data: {
        contratoId: contrato456.id,
        dotacaoId: dotacao.id,
        numero: 'NE-2025-0456',
        exercicio: 2025,
        tipo: 'ORDINARIO',
        data: new Date('2025-03-10'),
        valorCents: BigInt(120_000_000),
        situacao: 'EMITIDO',
      },
    });
    await prisma.reservaOrcamentaria.create({
      data: {
        contratoId: contrato456.id,
        numero: 'NR-2025-0456',
        data: new Date('2025-02-20'),
        valorCents: BigInt(480_000_000),
        situacao: 'ATIVA',
      },
    });
    await prisma.publicacao.create({
      data: {
        contratoId: contrato456.id,
        veiculoId: veiculoPncp.id,
        dataPublicacao: new Date('2025-03-05'),
        idPncp: 'PNCP-2025-456',
        url: 'https://pncp.gov.br/exemplo/456',
      },
    });
    await prisma.documento.create({
      data: {
        contratoId: contrato456.id,
        tipoDocumentoId: tipoDoc.id,
        nome: 'Contrato assinado — locação de viaturas',
        urlExterna: 'https://example.local/docs/contrato-456.pdf',
        mimeType: 'application/pdf',
      },
    });
  }

  // Usuários demo
  const orgaoSesp = await prisma.orgao.findFirst({ where: { sigla: 'SESP' } });
  const servidorGestor = await prisma.servidor.findFirst({ where: { cpf: '12345678901' } });
  const demoUsers = [
    {
      email: 'admin@sesp.pr.gov.br',
      nome: 'Administrador SESP',
      password: 'admin123',
      role: 'ADMIN' as const,
      orgaoId: null as string | null,
      servidorId: null as string | null,
    },
    {
      email: 'gestor@sesp.pr.gov.br',
      nome: 'Gestor Contratos',
      password: 'gestor123',
      role: 'GESTOR' as const,
      orgaoId: orgaoSesp?.id ?? null,
      servidorId: servidorGestor?.id ?? null,
    },
    {
      email: 'visitante@sesp.pr.gov.br',
      nome: 'Visitante Escopo SESP',
      password: 'visitante123',
      role: 'VISITANTE' as const,
      orgaoId: orgaoSesp?.id ?? null,
      servidorId: null as string | null,
    },
    // Alias legado (um release): mesmo papel VISITANTE
    {
      email: 'leitor@sesp.pr.gov.br',
      nome: 'Visitante (legado leitor@)',
      password: 'leitor123',
      role: 'VISITANTE' as const,
      orgaoId: orgaoSesp?.id ?? null,
      servidorId: null as string | null,
    },
    {
      email: 'analista@sesp.pr.gov.br',
      nome: 'Analista Contratos',
      password: 'analista123',
      role: 'ANALISTA' as const,
      orgaoId: orgaoSesp?.id ?? null,
      servidorId: null as string | null,
    },
  ];
  for (const u of demoUsers) {
    await prisma.usuario.create({
      data: {
        email: u.email,
        nome: u.nome,
        role: u.role,
        orgaoId: u.orgaoId,
        servidorId: u.servidorId,
        passwordHash: hashPassword(u.password),
        ativo: true,
      },
    });
  }

  // Refresh analytics se a função existir
  try {
    await prisma.$executeRaw`SELECT refresh_dashboard_views()`;
  } catch {
    // migration analítica pode não estar presente em ambientes vazios
  }

  const counts = {
    municipios: municipiosCount,
    dominios: await prisma.dominio.count(),
    dominioValoresAtivos: await prisma.dominioValor.count({ where: { ativo: true } }),
    orgaos: await prisma.orgao.count(),
    unidadesSede: await prisma.unidadeOrganizacional.count({ where: { ativo: true } }),
    unidadesFsp: await prisma.unidadeFsp.count(),
    fornecedores: await prisma.fornecedor.count(),
    servidores: await prisma.servidor.count(),
    catalogoItens: await prisma.catalogoItem.count({ where: { ativo: true } }),
    contratos: await prisma.contrato.count(),
    usuarios: await prisma.usuario.count(),
    contratosKeys: CONTRATO_KEYS,
  };

  console.log('Seed curated complete:', counts);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
