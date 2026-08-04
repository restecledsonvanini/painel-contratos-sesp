
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

exports.Prisma.EntidadeGestoraScalarFieldEnum = {
  id: 'id',
  nome: 'nome',
  cpf: 'cpf'
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

exports.Prisma.EmpresaScalarFieldEnum = {
  id: 'id',
  cnpj: 'cnpj',
  razaoSocial: 'razaoSocial'
};

exports.Prisma.FornecedorScalarFieldEnum = {
  id: 'id',
  cnpj: 'cnpj',
  nome: 'nome',
  createdAt: 'createdAt'
};

exports.Prisma.ContratoScalarFieldEnum = {
  id: 'id',
  protocoloCabeca: 'protocoloCabeca',
  numGms: 'numGms',
  anoGms: 'anoGms',
  unidadeFspId: 'unidadeFspId',
  gestorId: 'gestorId',
  fiscalId: 'fiscalId',
  empresaId: 'empresaId',
  modalidade: 'modalidade',
  objeto: 'objeto',
  valorAnualCents: 'valorAnualCents',
  dataInicio: 'dataInicio',
  dataFimOrig: 'dataFimOrig',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
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

exports.Prisma.ServicoScalarFieldEnum = {
  id: 'id',
  titulo: 'titulo',
  descricao: 'descricao',
  createdAt: 'createdAt'
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

exports.Prisma.ModelName = {
  UnidadeFsp: 'UnidadeFsp',
  EntidadeGestora: 'EntidadeGestora',
  Municipio: 'Municipio',
  Dominio: 'Dominio',
  DominioValor: 'DominioValor',
  Orgao: 'Orgao',
  UnidadeOrganizacional: 'UnidadeOrganizacional',
  Empresa: 'Empresa',
  Fornecedor: 'Fornecedor',
  Contrato: 'Contrato',
  Aditivo: 'Aditivo',
  Servico: 'Servico',
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
