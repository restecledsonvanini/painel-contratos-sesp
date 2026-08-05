
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.16.2
 * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
 */
Prisma.prismaVersion = {
  client: "4.16.2",
  engine: "4bc8b6e1b66cb932731fb1bdbbc550d1e010de81"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UnidadeFspScalarFieldEnum = {
  id: 'id',
  sigla: 'sigla',
  nome: 'nome'
};

exports.Prisma.MunicipioScalarFieldEnum = {
  id: 'id',
  codigoIbge: 'codigoIbge',
  nome: 'nome',
  uf: 'uf',
  regiaoAdministrativa: 'regiaoAdministrativa'
};

exports.Prisma.DominioScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  nome: 'nome',
  descricao: 'descricao',
  editavelPeloUsuario: 'editavelPeloUsuario',
  permiteHierarquia: 'permiteHierarquia',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DominioValorScalarFieldEnum = {
  id: 'id',
  dominioId: 'dominioId',
  codigo: 'codigo',
  label: 'label',
  parentId: 'parentId',
  ordem: 'ordem',
  ativo: 'ativo',
  metadata: 'metadata',
  codigoLegado: 'codigoLegado',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrgaoScalarFieldEnum = {
  id: 'id',
  sigla: 'sigla',
  nome: 'nome',
  tipo: 'tipo',
  ativo: 'ativo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UnidadeOrganizacionalScalarFieldEnum = {
  id: 'id',
  orgaoId: 'orgaoId',
  parentId: 'parentId',
  sigla: 'sigla',
  nome: 'nome',
  nivel: 'nivel',
  municipioId: 'municipioId',
  ativo: 'ativo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FornecedorScalarFieldEnum = {
  id: 'id',
  tipoPessoa: 'tipoPessoa',
  documento: 'documento',
  razaoSocial: 'razaoSocial',
  nomeFantasia: 'nomeFantasia',
  inscricaoEstadual: 'inscricaoEstadual',
  porte: 'porte',
  municipioId: 'municipioId',
  situacao: 'situacao',
  codigoLegado: 'codigoLegado',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FornecedorContatoScalarFieldEnum = {
  id: 'id',
  fornecedorId: 'fornecedorId',
  nome: 'nome',
  cargo: 'cargo',
  email: 'email',
  telefone: 'telefone',
  principal: 'principal',
  createdAt: 'createdAt'
};

exports.Prisma.FornecedorSancaoScalarFieldEnum = {
  id: 'id',
  fornecedorId: 'fornecedorId',
  tipo: 'tipo',
  processo: 'processo',
  dataInicio: 'dataInicio',
  dataFim: 'dataFim',
  abrangencia: 'abrangencia',
  fonte: 'fonte',
  createdAt: 'createdAt'
};

exports.Prisma.ServidorScalarFieldEnum = {
  id: 'id',
  nome: 'nome',
  cpf: 'cpf',
  rgFuncional: 'rgFuncional',
  cargo: 'cargo',
  orgaoId: 'orgaoId',
  unidadeId: 'unidadeId',
  email: 'email',
  telefone: 'telefone',
  ativo: 'ativo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProcessoContratacaoScalarFieldEnum = {
  id: 'id',
  eProtocolo: 'eProtocolo',
  ano: 'ano',
  objetoResumo: 'objetoResumo',
  unidadeDemandanteId: 'unidadeDemandanteId',
  modalidadePretendidaId: 'modalidadePretendidaId',
  valorEstimadoCents: 'valorEstimadoCents',
  etpConcluido: 'etpConcluido',
  dataEtp: 'dataEtp',
  termoReferenciaConcluido: 'termoReferenciaConcluido',
  dataTermoReferencia: 'dataTermoReferencia',
  situacao: 'situacao',
  observacoes: 'observacoes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContratoScalarFieldEnum = {
  id: 'id',
  processoId: 'processoId',
  numeroGms: 'numeroGms',
  anoGms: 'anoGms',
  numeroContrato: 'numeroContrato',
  eProtocolo: 'eProtocolo',
  pilar: 'pilar',
  categoriaContratacaoId: 'categoriaContratacaoId',
  naturezaObjeto: 'naturezaObjeto',
  modalidadeId: 'modalidadeId',
  fundamentoLegalId: 'fundamentoLegalId',
  objeto: 'objeto',
  fornecedorId: 'fornecedorId',
  unidadeGestoraId: 'unidadeGestoraId',
  dataAssinatura: 'dataAssinatura',
  dataInicioVigencia: 'dataInicioVigencia',
  prazoInicialValor: 'prazoInicialValor',
  prazoInicialUnidade: 'prazoInicialUnidade',
  dataFimVigenciaOriginal: 'dataFimVigenciaOriginal',
  prorrogavel: 'prorrogavel',
  limiteProrrogacaoMeses: 'limiteProrrogacaoMeses',
  valorGlobalOriginalCents: 'valorGlobalOriginalCents',
  indiceReajuste: 'indiceReajuste',
  mesAniversarioReajuste: 'mesAniversarioReajuste',
  situacao: 'situacao',
  dataEncerramento: 'dataEncerramento',
  motivoEncerramento: 'motivoEncerramento',
  garantiaTipo: 'garantiaTipo',
  garantiaValorCents: 'garantiaValorCents',
  garantiaValidade: 'garantiaValidade',
  reservaObservacao: 'reservaObservacao',
  observacoes: 'observacoes',
  codigoLegado: 'codigoLegado',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContratoResponsavelScalarFieldEnum = {
  id: 'id',
  contratoId: 'contratoId',
  servidorId: 'servidorId',
  papel: 'papel',
  atoDesignacao: 'atoDesignacao',
  dataInicio: 'dataInicio',
  dataFim: 'dataFim',
  createdAt: 'createdAt'
};

exports.Prisma.ContratoRateioScalarFieldEnum = {
  id: 'id',
  contratoId: 'contratoId',
  unidadeId: 'unidadeId',
  percentual: 'percentual',
  valorCents: 'valorCents',
  quantidade: 'quantidade',
  observacao: 'observacao',
  createdAt: 'createdAt'
};

exports.Prisma.AditivoScalarFieldEnum = {
  id: 'id',
  contratoId: 'contratoId',
  numAditivo: 'numAditivo',
  protocoloAdit: 'protocoloAdit',
  novoFimVigencia: 'novoFimVigencia',
  valorAdicionalCents: 'valorAdicionalCents',
  createdAt: 'createdAt'
};

exports.Prisma.CatalogoItemScalarFieldEnum = {
  id: 'id',
  categoriaItemId: 'categoriaItemId',
  codigo: 'codigo',
  nome: 'nome',
  descricao: 'descricao',
  unidadeMedidaPadraoId: 'unidadeMedidaPadraoId',
  atributosPadrao: 'atributosPadrao',
  ativo: 'ativo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ItemAtributoDefScalarFieldEnum = {
  id: 'id',
  categoriaItemId: 'categoriaItemId',
  chave: 'chave',
  label: 'label',
  tipo: 'tipo',
  dominioSlug: 'dominioSlug',
  obrigatorio: 'obrigatorio',
  unidade: 'unidade',
  ordem: 'ordem',
  ajuda: 'ajuda',
  ativo: 'ativo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ItemContratoScalarFieldEnum = {
  id: 'id',
  contratoId: 'contratoId',
  sequencia: 'sequencia',
  catalogoItemId: 'catalogoItemId',
  descricaoComplementar: 'descricaoComplementar',
  quantidade: 'quantidade',
  unidadeMedidaId: 'unidadeMedidaId',
  valorUnitarioCents: 'valorUnitarioCents',
  periodicidade: 'periodicidade',
  unidadeDestinoId: 'unidadeDestinoId',
  municipioExecucaoId: 'municipioExecucaoId',
  enderecoExecucao: 'enderecoExecucao',
  atributos: 'atributos',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  tabela: 'tabela',
  registroId: 'registroId',
  action: 'action',
  diff: 'diff',
  changedBy: 'changedBy',
  source: 'source',
  changedAt: 'changedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  sub: 'sub',
  email: 'email',
  role: 'role',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.TipoOrgao = {
  POLICIA_MILITAR: 'POLICIA_MILITAR',
  POLICIA_CIVIL: 'POLICIA_CIVIL',
  BOMBEIROS: 'BOMBEIROS',
  POLICIA_PENAL: 'POLICIA_PENAL',
  POLICIA_CIENTIFICA: 'POLICIA_CIENTIFICA',
  TRANSITO: 'TRANSITO',
  ADMINISTRACAO_DIRETA: 'ADMINISTRACAO_DIRETA'
};

exports.NivelUnidade = {
  COMANDO_GERAL: 'COMANDO_GERAL',
  DIRETORIA: 'DIRETORIA',
  COMANDO_REGIONAL: 'COMANDO_REGIONAL',
  BATALHAO: 'BATALHAO',
  COMPANHIA: 'COMPANHIA',
  DELEGACIA: 'DELEGACIA',
  UNIDADE_PRISIONAL: 'UNIDADE_PRISIONAL',
  SETOR: 'SETOR'
};

exports.TipoPessoa = {
  JURIDICA: 'JURIDICA',
  FISICA: 'FISICA'
};

exports.PorteEmpresa = {
  MEI: 'MEI',
  ME: 'ME',
  EPP: 'EPP',
  DEMAIS: 'DEMAIS'
};

exports.SituacaoFornecedor = {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  IMPEDIDO: 'IMPEDIDO',
  INIDONEO: 'INIDONEO'
};

exports.TipoSancao = {
  ADVERTENCIA: 'ADVERTENCIA',
  MULTA: 'MULTA',
  IMPEDIMENTO_LICITAR: 'IMPEDIMENTO_LICITAR',
  DECLARACAO_INIDONEIDADE: 'DECLARACAO_INIDONEIDADE'
};

exports.SituacaoProcesso = {
  PLANEJAMENTO: 'PLANEJAMENTO',
  EM_ANALISE_JURIDICA: 'EM_ANALISE_JURIDICA',
  EM_LICITACAO: 'EM_LICITACAO',
  HOMOLOGADO: 'HOMOLOGADO',
  CONTRATADO: 'CONTRATADO',
  FRACASSADO: 'FRACASSADO',
  DESERTO: 'DESERTO',
  CANCELADO: 'CANCELADO'
};

exports.PilarOrcamentario = {
  CUSTEIO: 'CUSTEIO',
  INVESTIMENTO: 'INVESTIMENTO',
  SERVICOS: 'SERVICOS'
};

exports.NaturezaObjeto = {
  SERVICO_CONTINUADO: 'SERVICO_CONTINUADO',
  SERVICO_NAO_CONTINUADO: 'SERVICO_NAO_CONTINUADO',
  OBRA: 'OBRA',
  SERVICO_ENGENHARIA: 'SERVICO_ENGENHARIA',
  COMPRA: 'COMPRA',
  LOCACAO_BEM_MOVEL: 'LOCACAO_BEM_MOVEL',
  LOCACAO_IMOVEL: 'LOCACAO_IMOVEL',
  SOLUCAO_TIC: 'SOLUCAO_TIC'
};

exports.UnidadeTempo = {
  DIAS: 'DIAS',
  MESES: 'MESES',
  ANOS: 'ANOS'
};

exports.SituacaoContrato = {
  EM_ELABORACAO: 'EM_ELABORACAO',
  ASSINADO: 'ASSINADO',
  VIGENTE: 'VIGENTE',
  SUSPENSO: 'SUSPENSO',
  RESCINDIDO: 'RESCINDIDO',
  ENCERRADO: 'ENCERRADO',
  ANULADO: 'ANULADO'
};

exports.TipoGarantia = {
  NENHUMA: 'NENHUMA',
  CAUCAO: 'CAUCAO',
  SEGURO_GARANTIA: 'SEGURO_GARANTIA',
  FIANCA_BANCARIA: 'FIANCA_BANCARIA'
};

exports.PapelResponsavel = {
  GESTOR: 'GESTOR',
  GESTOR_SUBSTITUTO: 'GESTOR_SUBSTITUTO',
  FISCAL_TECNICO: 'FISCAL_TECNICO',
  FISCAL_ADMINISTRATIVO: 'FISCAL_ADMINISTRATIVO',
  FISCAL_SETORIAL: 'FISCAL_SETORIAL',
  FISCAL_SUBSTITUTO: 'FISCAL_SUBSTITUTO',
  PREPOSTO_CONTRATADA: 'PREPOSTO_CONTRATADA'
};

exports.TipoAtributo = {
  TEXTO: 'TEXTO',
  TEXTO_LONGO: 'TEXTO_LONGO',
  NUMERO: 'NUMERO',
  MOEDA: 'MOEDA',
  DATA: 'DATA',
  BOOLEANO: 'BOOLEANO',
  SELECAO: 'SELECAO',
  MULTI_SELECAO: 'MULTI_SELECAO',
  MUNICIPIO: 'MUNICIPIO',
  UNIDADE: 'UNIDADE'
};

exports.Periodicidade = {
  UNICA: 'UNICA',
  DIARIA: 'DIARIA',
  MENSAL: 'MENSAL',
  ANUAL: 'ANUAL'
};

exports.Prisma.ModelName = {
  UnidadeFsp: 'UnidadeFsp',
  Municipio: 'Municipio',
  Dominio: 'Dominio',
  DominioValor: 'DominioValor',
  Orgao: 'Orgao',
  UnidadeOrganizacional: 'UnidadeOrganizacional',
  Fornecedor: 'Fornecedor',
  FornecedorContato: 'FornecedorContato',
  FornecedorSancao: 'FornecedorSancao',
  Servidor: 'Servidor',
  ProcessoContratacao: 'ProcessoContratacao',
  Contrato: 'Contrato',
  ContratoResponsavel: 'ContratoResponsavel',
  ContratoRateio: 'ContratoRateio',
  Aditivo: 'Aditivo',
  CatalogoItem: 'CatalogoItem',
  ItemAtributoDef: 'ItemAtributoDef',
  ItemContrato: 'ItemContrato',
  AuditLog: 'AuditLog',
  User: 'User'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
