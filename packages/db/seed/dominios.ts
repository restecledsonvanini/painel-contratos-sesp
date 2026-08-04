/** Domínios gerenciáveis (plano §4.2) */

export type DominioSeed = {
  slug: string;
  nome: string;
  descricao?: string;
  editavelPeloUsuario: boolean;
  permiteHierarquia?: boolean;
  valores: Array<{
    codigo: string;
    label: string;
    ordem: number;
    parentCodigo?: string;
    metadata?: Record<string, unknown>;
  }>;
};

export const DOMINIOS_SEED: DominioSeed[] = [
  {
    slug: 'modalidade-licitacao',
    nome: 'Modalidade de licitação',
    editavelPeloUsuario: false,
    valores: [
      { codigo: 'PREGAO_ELETRONICO', label: 'Pregão eletrônico', ordem: 1 },
      { codigo: 'CONCORRENCIA', label: 'Concorrência', ordem: 2 },
      { codigo: 'CONCURSO', label: 'Concurso', ordem: 3 },
      { codigo: 'LEILAO', label: 'Leilão', ordem: 4 },
      { codigo: 'DIALOGO_COMPETITIVO', label: 'Diálogo competitivo', ordem: 5 },
      { codigo: 'DISPENSA', label: 'Dispensa', ordem: 6 },
      { codigo: 'INEXIGIBILIDADE', label: 'Inexigibilidade', ordem: 7 },
      { codigo: 'ADESAO_ARP', label: 'Adesão à ARP', ordem: 8 },
      { codigo: 'CREDENCIAMENTO', label: 'Credenciamento', ordem: 9 },
    ],
  },
  {
    slug: 'fundamento-legal',
    nome: 'Fundamento legal',
    editavelPeloUsuario: true,
    permiteHierarquia: true,
    valores: [
      { codigo: 'ART_75_I', label: 'Art. 75, I', ordem: 1, parentCodigo: 'DISPENSA' },
      { codigo: 'ART_75_II', label: 'Art. 75, II', ordem: 2, parentCodigo: 'DISPENSA' },
      { codigo: 'ART_75_III', label: 'Art. 75, III', ordem: 3, parentCodigo: 'DISPENSA' },
      { codigo: 'ART_74_I', label: 'Art. 74, I', ordem: 4, parentCodigo: 'INEXIGIBILIDADE' },
      { codigo: 'ART_74_II', label: 'Art. 74, II', ordem: 5, parentCodigo: 'INEXIGIBILIDADE' },
      { codigo: 'ART_74_III', label: 'Art. 74, III', ordem: 6, parentCodigo: 'INEXIGIBILIDADE' },
      { codigo: 'ART_74_IV', label: 'Art. 74, IV', ordem: 7, parentCodigo: 'INEXIGIBILIDADE' },
      { codigo: 'ART_74_V', label: 'Art. 74, V', ordem: 8, parentCodigo: 'INEXIGIBILIDADE' },
      { codigo: 'ART_79', label: 'Art. 79', ordem: 9, parentCodigo: 'DISPENSA' },
    ],
  },
  {
    slug: 'categoria-contratacao',
    nome: 'Categoria de contratação',
    editavelPeloUsuario: true,
    valores: [
      { codigo: 'LOCACAO_VEICULOS', label: 'Locação de veículos', ordem: 1, metadata: { pilar: 'CUSTEIO', categoriaItemPadrao: 'VEICULO' } },
      { codigo: 'LOCACAO_IMOVEIS', label: 'Locação de imóveis', ordem: 2, metadata: { pilar: 'CUSTEIO', categoriaItemPadrao: 'IMOVEL' } },
      { codigo: 'GENEROS_ALIMENTICIOS', label: 'Gêneros alimentícios', ordem: 3, metadata: { pilar: 'CUSTEIO', categoriaItemPadrao: 'ALIMENTO' } },
      { codigo: 'AQUISICAO_VEICULOS', label: 'Aquisição de veículos', ordem: 4, metadata: { pilar: 'INVESTIMENTO', categoriaItemPadrao: 'VEICULO' } },
      { codigo: 'AQUISICAO_BENS_TATICOS', label: 'Aquisição de bens táticos', ordem: 5, metadata: { pilar: 'INVESTIMENTO', categoriaItemPadrao: 'EQUIPAMENTO_TATICO' } },
      { codigo: 'LOCACAO_MAO_DE_OBRA', label: 'Locação de mão de obra', ordem: 6, metadata: { pilar: 'SERVICOS', categoriaItemPadrao: 'POSTO_TRABALHO' } },
      { codigo: 'SERVICO_EVENTUAL', label: 'Serviço eventual', ordem: 7, metadata: { pilar: 'SERVICOS', categoriaItemPadrao: 'SERVICO' } },
      { codigo: 'FORNECIMENTO_REFEICAO', label: 'Fornecimento de refeição', ordem: 8, metadata: { pilar: 'CUSTEIO', categoriaItemPadrao: 'REFEICAO' } },
    ],
  },
  {
    slug: 'categoria-item',
    nome: 'Categoria de item',
    editavelPeloUsuario: true,
    valores: [
      { codigo: 'VEICULO', label: 'Veículo', ordem: 1 },
      { codigo: 'IMOVEL', label: 'Imóvel', ordem: 2 },
      { codigo: 'ALIMENTO', label: 'Alimento', ordem: 3 },
      { codigo: 'REFEICAO', label: 'Refeição', ordem: 4 },
      { codigo: 'ARMAMENTO', label: 'Armamento', ordem: 5 },
      { codigo: 'EQUIPAMENTO_TATICO', label: 'Equipamento tático', ordem: 6 },
      { codigo: 'POSTO_TRABALHO', label: 'Posto de trabalho', ordem: 7 },
      { codigo: 'SERVICO', label: 'Serviço', ordem: 8 },
      { codigo: 'MATERIAL_CONSUMO', label: 'Material de consumo', ordem: 9 },
    ],
  },
  {
    slug: 'unidade-medida',
    nome: 'Unidade de medida',
    editavelPeloUsuario: true,
    valores: [
      { codigo: 'UN', label: 'Unidade', ordem: 1 },
      { codigo: 'M2', label: 'm²', ordem: 2 },
      { codigo: 'M', label: 'Metro', ordem: 3 },
      { codigo: 'KG', label: 'Quilograma', ordem: 4 },
      { codigo: 'L', label: 'Litro', ordem: 5 },
      { codigo: 'DIA', label: 'Dia', ordem: 6 },
      { codigo: 'MES', label: 'Mês', ordem: 7 },
      { codigo: 'POSTO', label: 'Posto', ordem: 8 },
      { codigo: 'SERVICO', label: 'Serviço', ordem: 9 },
      { codigo: 'KM', label: 'Quilômetro', ordem: 10 },
    ],
  },
  {
    slug: 'natureza-despesa',
    nome: 'Natureza de despesa',
    editavelPeloUsuario: true,
    valores: [
      { codigo: '33903900', label: '3390.39.00 — Serviços de PJ', ordem: 1 },
      { codigo: '33903000', label: '3390.30.00 — Material de consumo', ordem: 2 },
      { codigo: '44905200', label: '4490.52.00 — Equipamento e material permanente', ordem: 3 },
      { codigo: '33903600', label: '3390.36.00 — Outros serviços de terceiros — PF', ordem: 4 },
      { codigo: '33903700', label: '3390.37.00 — Locação de mão de obra', ordem: 5 },
    ],
  },
  {
    slug: 'fonte-recurso',
    nome: 'Fonte de recurso',
    editavelPeloUsuario: true,
    valores: [
      { codigo: 'TESOURO_ESTADO', label: 'Tesouro do Estado', ordem: 1 },
      { codigo: 'FUNESP', label: 'FUNESP', ordem: 2 },
      { codigo: 'FUNSUSP', label: 'FUNSUSP', ordem: 3 },
      { codigo: 'EMENDA_PARLAMENTAR', label: 'Emenda parlamentar', ordem: 4 },
      { codigo: 'CONVENIO_UNIAO', label: 'Convênio União', ordem: 5 },
      { codigo: 'FUNDO_PENITENCIARIO', label: 'Fundo Penitenciário', ordem: 6 },
    ],
  },
  {
    slug: 'veiculo-publicacao',
    nome: 'Veículo de publicação',
    editavelPeloUsuario: false,
    valores: [
      { codigo: 'PNCP', label: 'PNCP', ordem: 1 },
      { codigo: 'DIOE', label: 'DIOE', ordem: 2 },
      { codigo: 'DOU', label: 'DOU', ordem: 3 },
      { codigo: 'SITE_ORGAO', label: 'Site do órgão', ordem: 4 },
    ],
  },
  {
    slug: 'tipo-documento',
    nome: 'Tipo de documento',
    editavelPeloUsuario: true,
    valores: [
      { codigo: 'CONTRATO_ASSINADO', label: 'Contrato assinado', ordem: 1 },
      { codigo: 'ETP', label: 'ETP', ordem: 2 },
      { codigo: 'TERMO_REFERENCIA', label: 'Termo de referência', ordem: 3 },
      { codigo: 'PORTARIA_DESIGNACAO', label: 'Portaria de designação', ordem: 4 },
      { codigo: 'PARECER_JURIDICO', label: 'Parecer jurídico', ordem: 5 },
      { codigo: 'NOTA_EMPENHO', label: 'Nota de empenho', ordem: 6 },
      { codigo: 'ATA_RP', label: 'Ata de RP', ordem: 7 },
      { codigo: 'TERMO_ADITIVO', label: 'Termo aditivo', ordem: 8 },
      { codigo: 'APOSTILA', label: 'Apostila', ordem: 9 },
    ],
  },
  {
    slug: 'destinacao-imovel',
    nome: 'Destinação de imóvel',
    editavelPeloUsuario: true,
    valores: [
      { codigo: 'SEDE_ADMINISTRATIVA', label: 'Sede administrativa', ordem: 1 },
      { codigo: 'DELEGACIA', label: 'Delegacia', ordem: 2 },
      { codigo: 'ALOJAMENTO', label: 'Alojamento', ordem: 3 },
      { codigo: 'DEPOSITO', label: 'Depósito', ordem: 4 },
      { codigo: 'GARAGEM', label: 'Garagem', ordem: 5 },
    ],
  },
  {
    slug: 'tipo-veiculo',
    nome: 'Tipo de veículo',
    editavelPeloUsuario: true,
    valores: [
      { codigo: 'SUV', label: 'SUV', ordem: 1 },
      { codigo: 'SEDAN', label: 'Sedan', ordem: 2 },
      { codigo: 'CAMINHONETE', label: 'Caminhonete', ordem: 3 },
      { codigo: 'CAMINHAO', label: 'Caminhão', ordem: 4 },
      { codigo: 'MOTOCICLETA', label: 'Motocicleta', ordem: 5 },
      { codigo: 'VAN', label: 'Van', ordem: 6 },
      { codigo: 'AMBULANCIA', label: 'Ambulância', ordem: 7 },
    ],
  },
];
