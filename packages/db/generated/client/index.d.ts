
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type UnidadeFspPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "UnidadeFsp"
  objects: {
    contratos: ContratoPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    sigla: string
    nome: string
  }, ExtArgs["result"]["unidadeFsp"]>
  composites: {}
}

/**
 * Model UnidadeFsp
 * 
 */
export type UnidadeFsp = runtime.Types.DefaultSelection<UnidadeFspPayload>
export type MunicipioPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Municipio"
  objects: {
    unidades: UnidadeOrganizacionalPayload<ExtArgs>[]
    fornecedores: FornecedorPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa: string | null
  }, ExtArgs["result"]["municipio"]>
  composites: {}
}

/**
 * Model Municipio
 * 
 */
export type Municipio = runtime.Types.DefaultSelection<MunicipioPayload>
export type DominioPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Dominio"
  objects: {
    valores: DominioValorPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    slug: string
    nome: string
    descricao: string | null
    editavelPeloUsuario: boolean
    permiteHierarquia: boolean
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["dominio"]>
  composites: {}
}

/**
 * Model Dominio
 * 
 */
export type Dominio = runtime.Types.DefaultSelection<DominioPayload>
export type DominioValorPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "DominioValor"
  objects: {
    dominio: DominioPayload<ExtArgs>
    parent: DominioValorPayload<ExtArgs> | null
    children: DominioValorPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    dominioId: string
    codigo: string
    label: string
    parentId: string | null
    ordem: number
    ativo: boolean
    metadata: Prisma.JsonValue | null
    codigoLegado: string | null
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["dominioValor"]>
  composites: {}
}

/**
 * Model DominioValor
 * 
 */
export type DominioValor = runtime.Types.DefaultSelection<DominioValorPayload>
export type OrgaoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Orgao"
  objects: {
    unidades: UnidadeOrganizacionalPayload<ExtArgs>[]
    servidores: ServidorPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo: boolean
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["orgao"]>
  composites: {}
}

/**
 * Model Orgao
 * 
 */
export type Orgao = runtime.Types.DefaultSelection<OrgaoPayload>
export type UnidadeOrganizacionalPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "UnidadeOrganizacional"
  objects: {
    orgao: OrgaoPayload<ExtArgs>
    parent: UnidadeOrganizacionalPayload<ExtArgs> | null
    children: UnidadeOrganizacionalPayload<ExtArgs>[]
    municipio: MunicipioPayload<ExtArgs>
    servidores: ServidorPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    orgaoId: string
    parentId: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo: boolean
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["unidadeOrganizacional"]>
  composites: {}
}

/**
 * Model UnidadeOrganizacional
 * 
 */
export type UnidadeOrganizacional = runtime.Types.DefaultSelection<UnidadeOrganizacionalPayload>
export type FornecedorPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Fornecedor"
  objects: {
    municipio: MunicipioPayload<ExtArgs> | null
    contatos: FornecedorContatoPayload<ExtArgs>[]
    sancoes: FornecedorSancaoPayload<ExtArgs>[]
    contratos: ContratoPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    tipoPessoa: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia: string | null
    inscricaoEstadual: string | null
    porte: PorteEmpresa | null
    municipioId: string | null
    situacao: SituacaoFornecedor
    codigoLegado: string | null
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["fornecedor"]>
  composites: {}
}

/**
 * Model Fornecedor
 * 
 */
export type Fornecedor = runtime.Types.DefaultSelection<FornecedorPayload>
export type FornecedorContatoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "FornecedorContato"
  objects: {
    fornecedor: FornecedorPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    fornecedorId: string
    nome: string
    cargo: string | null
    email: string | null
    telefone: string | null
    principal: boolean
    createdAt: Date
  }, ExtArgs["result"]["fornecedorContato"]>
  composites: {}
}

/**
 * Model FornecedorContato
 * 
 */
export type FornecedorContato = runtime.Types.DefaultSelection<FornecedorContatoPayload>
export type FornecedorSancaoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "FornecedorSancao"
  objects: {
    fornecedor: FornecedorPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    fornecedorId: string
    tipo: TipoSancao
    processo: string | null
    dataInicio: Date
    dataFim: Date | null
    abrangencia: string | null
    fonte: string | null
    createdAt: Date
  }, ExtArgs["result"]["fornecedorSancao"]>
  composites: {}
}

/**
 * Model FornecedorSancao
 * 
 */
export type FornecedorSancao = runtime.Types.DefaultSelection<FornecedorSancaoPayload>
export type ServidorPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Servidor"
  objects: {
    orgao: OrgaoPayload<ExtArgs> | null
    unidade: UnidadeOrganizacionalPayload<ExtArgs> | null
    gestorContratos: ContratoPayload<ExtArgs>[]
    fiscalContratos: ContratoPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    nome: string
    cpf: string | null
    rgFuncional: string | null
    cargo: string | null
    orgaoId: string | null
    unidadeId: string | null
    email: string | null
    telefone: string | null
    ativo: boolean
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["servidor"]>
  composites: {}
}

/**
 * Model Servidor
 * 
 */
export type Servidor = runtime.Types.DefaultSelection<ServidorPayload>
export type ContratoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Contrato"
  objects: {
    unidadeFsp: UnidadeFspPayload<ExtArgs>
    gestor: ServidorPayload<ExtArgs>
    fiscal: ServidorPayload<ExtArgs>
    fornecedor: FornecedorPayload<ExtArgs>
    aditivos: AditivoPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    protocoloCabeca: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio: Date | null
    dataFimOrig: Date | null
    status: string
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["contrato"]>
  composites: {}
}

/**
 * Model Contrato
 * 
 */
export type Contrato = runtime.Types.DefaultSelection<ContratoPayload>
export type AditivoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Aditivo"
  objects: {
    contrato: ContratoPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    contratoId: string
    numAditivo: number
    protocoloAdit: string
    novoFimVigencia: Date | null
    valorAdicionalCents: number | null
    createdAt: Date
  }, ExtArgs["result"]["aditivo"]>
  composites: {}
}

/**
 * Model Aditivo
 * 
 */
export type Aditivo = runtime.Types.DefaultSelection<AditivoPayload>
export type ServicoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Servico"
  objects: {}
  scalars: $Extensions.GetResult<{
    id: string
    titulo: string
    descricao: string | null
    createdAt: Date
  }, ExtArgs["result"]["servico"]>
  composites: {}
}

/**
 * Model Servico
 * 
 */
export type Servico = runtime.Types.DefaultSelection<ServicoPayload>
export type AuditLogPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "AuditLog"
  objects: {}
  scalars: $Extensions.GetResult<{
    id: string
    tabela: string
    registroId: string
    action: string
    diff: Prisma.JsonValue
    changedBy: string | null
    source: string | null
    changedAt: Date
  }, ExtArgs["result"]["auditLog"]>
  composites: {}
}

/**
 * Model AuditLog
 * 
 */
export type AuditLog = runtime.Types.DefaultSelection<AuditLogPayload>
export type UserPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "User"
  objects: {}
  scalars: $Extensions.GetResult<{
    id: string
    sub: string | null
    email: string | null
    role: string
    createdAt: Date
  }, ExtArgs["result"]["user"]>
  composites: {}
}

/**
 * Model User
 * 
 */
export type User = runtime.Types.DefaultSelection<UserPayload>

/**
 * Enums
 */

export const TipoOrgao: {
  POLICIA_MILITAR: 'POLICIA_MILITAR',
  POLICIA_CIVIL: 'POLICIA_CIVIL',
  BOMBEIROS: 'BOMBEIROS',
  POLICIA_PENAL: 'POLICIA_PENAL',
  POLICIA_CIENTIFICA: 'POLICIA_CIENTIFICA',
  TRANSITO: 'TRANSITO',
  ADMINISTRACAO_DIRETA: 'ADMINISTRACAO_DIRETA'
};

export type TipoOrgao = (typeof TipoOrgao)[keyof typeof TipoOrgao]


export const NivelUnidade: {
  COMANDO_GERAL: 'COMANDO_GERAL',
  DIRETORIA: 'DIRETORIA',
  COMANDO_REGIONAL: 'COMANDO_REGIONAL',
  BATALHAO: 'BATALHAO',
  COMPANHIA: 'COMPANHIA',
  DELEGACIA: 'DELEGACIA',
  UNIDADE_PRISIONAL: 'UNIDADE_PRISIONAL',
  SETOR: 'SETOR'
};

export type NivelUnidade = (typeof NivelUnidade)[keyof typeof NivelUnidade]


export const TipoPessoa: {
  JURIDICA: 'JURIDICA',
  FISICA: 'FISICA'
};

export type TipoPessoa = (typeof TipoPessoa)[keyof typeof TipoPessoa]


export const PorteEmpresa: {
  MEI: 'MEI',
  ME: 'ME',
  EPP: 'EPP',
  DEMAIS: 'DEMAIS'
};

export type PorteEmpresa = (typeof PorteEmpresa)[keyof typeof PorteEmpresa]


export const SituacaoFornecedor: {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  IMPEDIDO: 'IMPEDIDO',
  INIDONEO: 'INIDONEO'
};

export type SituacaoFornecedor = (typeof SituacaoFornecedor)[keyof typeof SituacaoFornecedor]


export const TipoSancao: {
  ADVERTENCIA: 'ADVERTENCIA',
  MULTA: 'MULTA',
  IMPEDIMENTO_LICITAR: 'IMPEDIMENTO_LICITAR',
  DECLARACAO_INIDONEIDADE: 'DECLARACAO_INIDONEIDADE'
};

export type TipoSancao = (typeof TipoSancao)[keyof typeof TipoSancao]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more UnidadeFsps
 * const unidadeFsps = await prisma.unidadeFsp.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more UnidadeFsps
   * const unidadeFsps = await prisma.unidadeFsp.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.unidadeFsp`: Exposes CRUD operations for the **UnidadeFsp** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UnidadeFsps
    * const unidadeFsps = await prisma.unidadeFsp.findMany()
    * ```
    */
  get unidadeFsp(): Prisma.UnidadeFspDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.municipio`: Exposes CRUD operations for the **Municipio** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Municipios
    * const municipios = await prisma.municipio.findMany()
    * ```
    */
  get municipio(): Prisma.MunicipioDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.dominio`: Exposes CRUD operations for the **Dominio** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dominios
    * const dominios = await prisma.dominio.findMany()
    * ```
    */
  get dominio(): Prisma.DominioDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.dominioValor`: Exposes CRUD operations for the **DominioValor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DominioValors
    * const dominioValors = await prisma.dominioValor.findMany()
    * ```
    */
  get dominioValor(): Prisma.DominioValorDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.orgao`: Exposes CRUD operations for the **Orgao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orgaos
    * const orgaos = await prisma.orgao.findMany()
    * ```
    */
  get orgao(): Prisma.OrgaoDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.unidadeOrganizacional`: Exposes CRUD operations for the **UnidadeOrganizacional** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UnidadeOrganizacionals
    * const unidadeOrganizacionals = await prisma.unidadeOrganizacional.findMany()
    * ```
    */
  get unidadeOrganizacional(): Prisma.UnidadeOrganizacionalDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.fornecedor`: Exposes CRUD operations for the **Fornecedor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Fornecedors
    * const fornecedors = await prisma.fornecedor.findMany()
    * ```
    */
  get fornecedor(): Prisma.FornecedorDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.fornecedorContato`: Exposes CRUD operations for the **FornecedorContato** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FornecedorContatoes
    * const fornecedorContatoes = await prisma.fornecedorContato.findMany()
    * ```
    */
  get fornecedorContato(): Prisma.FornecedorContatoDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.fornecedorSancao`: Exposes CRUD operations for the **FornecedorSancao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FornecedorSancaos
    * const fornecedorSancaos = await prisma.fornecedorSancao.findMany()
    * ```
    */
  get fornecedorSancao(): Prisma.FornecedorSancaoDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.servidor`: Exposes CRUD operations for the **Servidor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servidors
    * const servidors = await prisma.servidor.findMany()
    * ```
    */
  get servidor(): Prisma.ServidorDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.contrato`: Exposes CRUD operations for the **Contrato** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Contratoes
    * const contratoes = await prisma.contrato.findMany()
    * ```
    */
  get contrato(): Prisma.ContratoDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.aditivo`: Exposes CRUD operations for the **Aditivo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Aditivos
    * const aditivos = await prisma.aditivo.findMany()
    * ```
    */
  get aditivo(): Prisma.AditivoDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.servico`: Exposes CRUD operations for the **Servico** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servicos
    * const servicos = await prisma.servico.findMany()
    * ```
    */
  get servico(): Prisma.ServicoDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<GlobalReject, ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export type Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export type Args<T, F extends $Public.Operation> = $Public.Args<T, F>
  export type Payload<T, F extends $Public.Operation> = $Public.Payload<T, F>
  export type Result<T, A, F extends $Public.Operation> = $Public.Result<T, A, F>
  export type Exact<T, W> = $Public.Exact<T, W>

  /**
   * Prisma Client JS version: 4.16.2
   * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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
    Contrato: 'Contrato',
    Aditivo: 'Aditivo',
    Servico: 'Servico',
    AuditLog: 'AuditLog',
    User: 'User'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'unidadeFsp' | 'municipio' | 'dominio' | 'dominioValor' | 'orgao' | 'unidadeOrganizacional' | 'fornecedor' | 'fornecedorContato' | 'fornecedorSancao' | 'servidor' | 'contrato' | 'aditivo' | 'servico' | 'auditLog' | 'user'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      UnidadeFsp: {
        payload: UnidadeFspPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.UnidadeFspFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnidadeFspFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload>
          }
          findFirst: {
            args: Prisma.UnidadeFspFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnidadeFspFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload>
          }
          findMany: {
            args: Prisma.UnidadeFspFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload>[]
          }
          create: {
            args: Prisma.UnidadeFspCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload>
          }
          createMany: {
            args: Prisma.UnidadeFspCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.UnidadeFspDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload>
          }
          update: {
            args: Prisma.UnidadeFspUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload>
          }
          deleteMany: {
            args: Prisma.UnidadeFspDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UnidadeFspUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UnidadeFspUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeFspPayload>
          }
          aggregate: {
            args: Prisma.UnidadeFspAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUnidadeFsp>
          }
          groupBy: {
            args: Prisma.UnidadeFspGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UnidadeFspGroupByOutputType>[]
          }
          count: {
            args: Prisma.UnidadeFspCountArgs<ExtArgs>,
            result: $Utils.Optional<UnidadeFspCountAggregateOutputType> | number
          }
        }
      }
      Municipio: {
        payload: MunicipioPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.MunicipioFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MunicipioFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload>
          }
          findFirst: {
            args: Prisma.MunicipioFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MunicipioFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload>
          }
          findMany: {
            args: Prisma.MunicipioFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload>[]
          }
          create: {
            args: Prisma.MunicipioCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload>
          }
          createMany: {
            args: Prisma.MunicipioCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.MunicipioDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload>
          }
          update: {
            args: Prisma.MunicipioUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload>
          }
          deleteMany: {
            args: Prisma.MunicipioDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.MunicipioUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.MunicipioUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<MunicipioPayload>
          }
          aggregate: {
            args: Prisma.MunicipioAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateMunicipio>
          }
          groupBy: {
            args: Prisma.MunicipioGroupByArgs<ExtArgs>,
            result: $Utils.Optional<MunicipioGroupByOutputType>[]
          }
          count: {
            args: Prisma.MunicipioCountArgs<ExtArgs>,
            result: $Utils.Optional<MunicipioCountAggregateOutputType> | number
          }
        }
      }
      Dominio: {
        payload: DominioPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.DominioFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DominioFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload>
          }
          findFirst: {
            args: Prisma.DominioFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DominioFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload>
          }
          findMany: {
            args: Prisma.DominioFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload>[]
          }
          create: {
            args: Prisma.DominioCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload>
          }
          createMany: {
            args: Prisma.DominioCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.DominioDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload>
          }
          update: {
            args: Prisma.DominioUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload>
          }
          deleteMany: {
            args: Prisma.DominioDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DominioUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DominioUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioPayload>
          }
          aggregate: {
            args: Prisma.DominioAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDominio>
          }
          groupBy: {
            args: Prisma.DominioGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DominioGroupByOutputType>[]
          }
          count: {
            args: Prisma.DominioCountArgs<ExtArgs>,
            result: $Utils.Optional<DominioCountAggregateOutputType> | number
          }
        }
      }
      DominioValor: {
        payload: DominioValorPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.DominioValorFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DominioValorFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload>
          }
          findFirst: {
            args: Prisma.DominioValorFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DominioValorFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload>
          }
          findMany: {
            args: Prisma.DominioValorFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload>[]
          }
          create: {
            args: Prisma.DominioValorCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload>
          }
          createMany: {
            args: Prisma.DominioValorCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.DominioValorDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload>
          }
          update: {
            args: Prisma.DominioValorUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload>
          }
          deleteMany: {
            args: Prisma.DominioValorDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DominioValorUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DominioValorUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DominioValorPayload>
          }
          aggregate: {
            args: Prisma.DominioValorAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDominioValor>
          }
          groupBy: {
            args: Prisma.DominioValorGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DominioValorGroupByOutputType>[]
          }
          count: {
            args: Prisma.DominioValorCountArgs<ExtArgs>,
            result: $Utils.Optional<DominioValorCountAggregateOutputType> | number
          }
        }
      }
      Orgao: {
        payload: OrgaoPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.OrgaoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrgaoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload>
          }
          findFirst: {
            args: Prisma.OrgaoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrgaoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload>
          }
          findMany: {
            args: Prisma.OrgaoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload>[]
          }
          create: {
            args: Prisma.OrgaoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload>
          }
          createMany: {
            args: Prisma.OrgaoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.OrgaoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload>
          }
          update: {
            args: Prisma.OrgaoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload>
          }
          deleteMany: {
            args: Prisma.OrgaoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.OrgaoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.OrgaoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<OrgaoPayload>
          }
          aggregate: {
            args: Prisma.OrgaoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateOrgao>
          }
          groupBy: {
            args: Prisma.OrgaoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<OrgaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrgaoCountArgs<ExtArgs>,
            result: $Utils.Optional<OrgaoCountAggregateOutputType> | number
          }
        }
      }
      UnidadeOrganizacional: {
        payload: UnidadeOrganizacionalPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.UnidadeOrganizacionalFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnidadeOrganizacionalFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload>
          }
          findFirst: {
            args: Prisma.UnidadeOrganizacionalFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnidadeOrganizacionalFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload>
          }
          findMany: {
            args: Prisma.UnidadeOrganizacionalFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload>[]
          }
          create: {
            args: Prisma.UnidadeOrganizacionalCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload>
          }
          createMany: {
            args: Prisma.UnidadeOrganizacionalCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.UnidadeOrganizacionalDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload>
          }
          update: {
            args: Prisma.UnidadeOrganizacionalUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload>
          }
          deleteMany: {
            args: Prisma.UnidadeOrganizacionalDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UnidadeOrganizacionalUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UnidadeOrganizacionalUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UnidadeOrganizacionalPayload>
          }
          aggregate: {
            args: Prisma.UnidadeOrganizacionalAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUnidadeOrganizacional>
          }
          groupBy: {
            args: Prisma.UnidadeOrganizacionalGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UnidadeOrganizacionalGroupByOutputType>[]
          }
          count: {
            args: Prisma.UnidadeOrganizacionalCountArgs<ExtArgs>,
            result: $Utils.Optional<UnidadeOrganizacionalCountAggregateOutputType> | number
          }
        }
      }
      Fornecedor: {
        payload: FornecedorPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.FornecedorFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FornecedorFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload>
          }
          findFirst: {
            args: Prisma.FornecedorFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FornecedorFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload>
          }
          findMany: {
            args: Prisma.FornecedorFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload>[]
          }
          create: {
            args: Prisma.FornecedorCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload>
          }
          createMany: {
            args: Prisma.FornecedorCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.FornecedorDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload>
          }
          update: {
            args: Prisma.FornecedorUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload>
          }
          deleteMany: {
            args: Prisma.FornecedorDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.FornecedorUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.FornecedorUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorPayload>
          }
          aggregate: {
            args: Prisma.FornecedorAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFornecedor>
          }
          groupBy: {
            args: Prisma.FornecedorGroupByArgs<ExtArgs>,
            result: $Utils.Optional<FornecedorGroupByOutputType>[]
          }
          count: {
            args: Prisma.FornecedorCountArgs<ExtArgs>,
            result: $Utils.Optional<FornecedorCountAggregateOutputType> | number
          }
        }
      }
      FornecedorContato: {
        payload: FornecedorContatoPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.FornecedorContatoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FornecedorContatoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload>
          }
          findFirst: {
            args: Prisma.FornecedorContatoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FornecedorContatoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload>
          }
          findMany: {
            args: Prisma.FornecedorContatoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload>[]
          }
          create: {
            args: Prisma.FornecedorContatoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload>
          }
          createMany: {
            args: Prisma.FornecedorContatoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.FornecedorContatoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload>
          }
          update: {
            args: Prisma.FornecedorContatoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload>
          }
          deleteMany: {
            args: Prisma.FornecedorContatoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.FornecedorContatoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.FornecedorContatoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorContatoPayload>
          }
          aggregate: {
            args: Prisma.FornecedorContatoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFornecedorContato>
          }
          groupBy: {
            args: Prisma.FornecedorContatoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<FornecedorContatoGroupByOutputType>[]
          }
          count: {
            args: Prisma.FornecedorContatoCountArgs<ExtArgs>,
            result: $Utils.Optional<FornecedorContatoCountAggregateOutputType> | number
          }
        }
      }
      FornecedorSancao: {
        payload: FornecedorSancaoPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.FornecedorSancaoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FornecedorSancaoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload>
          }
          findFirst: {
            args: Prisma.FornecedorSancaoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FornecedorSancaoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload>
          }
          findMany: {
            args: Prisma.FornecedorSancaoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload>[]
          }
          create: {
            args: Prisma.FornecedorSancaoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload>
          }
          createMany: {
            args: Prisma.FornecedorSancaoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.FornecedorSancaoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload>
          }
          update: {
            args: Prisma.FornecedorSancaoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload>
          }
          deleteMany: {
            args: Prisma.FornecedorSancaoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.FornecedorSancaoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.FornecedorSancaoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<FornecedorSancaoPayload>
          }
          aggregate: {
            args: Prisma.FornecedorSancaoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFornecedorSancao>
          }
          groupBy: {
            args: Prisma.FornecedorSancaoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<FornecedorSancaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.FornecedorSancaoCountArgs<ExtArgs>,
            result: $Utils.Optional<FornecedorSancaoCountAggregateOutputType> | number
          }
        }
      }
      Servidor: {
        payload: ServidorPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.ServidorFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServidorFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload>
          }
          findFirst: {
            args: Prisma.ServidorFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServidorFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload>
          }
          findMany: {
            args: Prisma.ServidorFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload>[]
          }
          create: {
            args: Prisma.ServidorCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload>
          }
          createMany: {
            args: Prisma.ServidorCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.ServidorDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload>
          }
          update: {
            args: Prisma.ServidorUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload>
          }
          deleteMany: {
            args: Prisma.ServidorDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ServidorUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ServidorUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServidorPayload>
          }
          aggregate: {
            args: Prisma.ServidorAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateServidor>
          }
          groupBy: {
            args: Prisma.ServidorGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ServidorGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServidorCountArgs<ExtArgs>,
            result: $Utils.Optional<ServidorCountAggregateOutputType> | number
          }
        }
      }
      Contrato: {
        payload: ContratoPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.ContratoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContratoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload>
          }
          findFirst: {
            args: Prisma.ContratoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContratoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload>
          }
          findMany: {
            args: Prisma.ContratoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload>[]
          }
          create: {
            args: Prisma.ContratoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload>
          }
          createMany: {
            args: Prisma.ContratoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.ContratoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload>
          }
          update: {
            args: Prisma.ContratoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload>
          }
          deleteMany: {
            args: Prisma.ContratoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ContratoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ContratoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ContratoPayload>
          }
          aggregate: {
            args: Prisma.ContratoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateContrato>
          }
          groupBy: {
            args: Prisma.ContratoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ContratoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContratoCountArgs<ExtArgs>,
            result: $Utils.Optional<ContratoCountAggregateOutputType> | number
          }
        }
      }
      Aditivo: {
        payload: AditivoPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.AditivoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AditivoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload>
          }
          findFirst: {
            args: Prisma.AditivoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AditivoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload>
          }
          findMany: {
            args: Prisma.AditivoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload>[]
          }
          create: {
            args: Prisma.AditivoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload>
          }
          createMany: {
            args: Prisma.AditivoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.AditivoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload>
          }
          update: {
            args: Prisma.AditivoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload>
          }
          deleteMany: {
            args: Prisma.AditivoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AditivoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AditivoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AditivoPayload>
          }
          aggregate: {
            args: Prisma.AditivoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAditivo>
          }
          groupBy: {
            args: Prisma.AditivoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AditivoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AditivoCountArgs<ExtArgs>,
            result: $Utils.Optional<AditivoCountAggregateOutputType> | number
          }
        }
      }
      Servico: {
        payload: ServicoPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.ServicoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServicoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload>
          }
          findFirst: {
            args: Prisma.ServicoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServicoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload>
          }
          findMany: {
            args: Prisma.ServicoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload>[]
          }
          create: {
            args: Prisma.ServicoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload>
          }
          createMany: {
            args: Prisma.ServicoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.ServicoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload>
          }
          update: {
            args: Prisma.ServicoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload>
          }
          deleteMany: {
            args: Prisma.ServicoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ServicoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ServicoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicoPayload>
          }
          aggregate: {
            args: Prisma.ServicoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateServico>
          }
          groupBy: {
            args: Prisma.ServicoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ServicoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServicoCountArgs<ExtArgs>,
            result: $Utils.Optional<ServicoCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: AuditLogPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>,
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: UserPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>,
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UnidadeFspCountOutputType
   */


  export type UnidadeFspCountOutputType = {
    contratos: number
  }

  export type UnidadeFspCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    contratos?: boolean | UnidadeFspCountOutputTypeCountContratosArgs
  }

  // Custom InputTypes

  /**
   * UnidadeFspCountOutputType without action
   */
  export type UnidadeFspCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFspCountOutputType
     */
    select?: UnidadeFspCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * UnidadeFspCountOutputType without action
   */
  export type UnidadeFspCountOutputTypeCountContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ContratoWhereInput
  }



  /**
   * Count Type MunicipioCountOutputType
   */


  export type MunicipioCountOutputType = {
    unidades: number
    fornecedores: number
  }

  export type MunicipioCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    unidades?: boolean | MunicipioCountOutputTypeCountUnidadesArgs
    fornecedores?: boolean | MunicipioCountOutputTypeCountFornecedoresArgs
  }

  // Custom InputTypes

  /**
   * MunicipioCountOutputType without action
   */
  export type MunicipioCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MunicipioCountOutputType
     */
    select?: MunicipioCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * MunicipioCountOutputType without action
   */
  export type MunicipioCountOutputTypeCountUnidadesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: UnidadeOrganizacionalWhereInput
  }


  /**
   * MunicipioCountOutputType without action
   */
  export type MunicipioCountOutputTypeCountFornecedoresArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: FornecedorWhereInput
  }



  /**
   * Count Type DominioCountOutputType
   */


  export type DominioCountOutputType = {
    valores: number
  }

  export type DominioCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    valores?: boolean | DominioCountOutputTypeCountValoresArgs
  }

  // Custom InputTypes

  /**
   * DominioCountOutputType without action
   */
  export type DominioCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioCountOutputType
     */
    select?: DominioCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * DominioCountOutputType without action
   */
  export type DominioCountOutputTypeCountValoresArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: DominioValorWhereInput
  }



  /**
   * Count Type DominioValorCountOutputType
   */


  export type DominioValorCountOutputType = {
    children: number
  }

  export type DominioValorCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    children?: boolean | DominioValorCountOutputTypeCountChildrenArgs
  }

  // Custom InputTypes

  /**
   * DominioValorCountOutputType without action
   */
  export type DominioValorCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValorCountOutputType
     */
    select?: DominioValorCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * DominioValorCountOutputType without action
   */
  export type DominioValorCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: DominioValorWhereInput
  }



  /**
   * Count Type OrgaoCountOutputType
   */


  export type OrgaoCountOutputType = {
    unidades: number
    servidores: number
  }

  export type OrgaoCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    unidades?: boolean | OrgaoCountOutputTypeCountUnidadesArgs
    servidores?: boolean | OrgaoCountOutputTypeCountServidoresArgs
  }

  // Custom InputTypes

  /**
   * OrgaoCountOutputType without action
   */
  export type OrgaoCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgaoCountOutputType
     */
    select?: OrgaoCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * OrgaoCountOutputType without action
   */
  export type OrgaoCountOutputTypeCountUnidadesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: UnidadeOrganizacionalWhereInput
  }


  /**
   * OrgaoCountOutputType without action
   */
  export type OrgaoCountOutputTypeCountServidoresArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ServidorWhereInput
  }



  /**
   * Count Type UnidadeOrganizacionalCountOutputType
   */


  export type UnidadeOrganizacionalCountOutputType = {
    children: number
    servidores: number
  }

  export type UnidadeOrganizacionalCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    children?: boolean | UnidadeOrganizacionalCountOutputTypeCountChildrenArgs
    servidores?: boolean | UnidadeOrganizacionalCountOutputTypeCountServidoresArgs
  }

  // Custom InputTypes

  /**
   * UnidadeOrganizacionalCountOutputType without action
   */
  export type UnidadeOrganizacionalCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacionalCountOutputType
     */
    select?: UnidadeOrganizacionalCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * UnidadeOrganizacionalCountOutputType without action
   */
  export type UnidadeOrganizacionalCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: UnidadeOrganizacionalWhereInput
  }


  /**
   * UnidadeOrganizacionalCountOutputType without action
   */
  export type UnidadeOrganizacionalCountOutputTypeCountServidoresArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ServidorWhereInput
  }



  /**
   * Count Type FornecedorCountOutputType
   */


  export type FornecedorCountOutputType = {
    contatos: number
    sancoes: number
    contratos: number
  }

  export type FornecedorCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    contatos?: boolean | FornecedorCountOutputTypeCountContatosArgs
    sancoes?: boolean | FornecedorCountOutputTypeCountSancoesArgs
    contratos?: boolean | FornecedorCountOutputTypeCountContratosArgs
  }

  // Custom InputTypes

  /**
   * FornecedorCountOutputType without action
   */
  export type FornecedorCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorCountOutputType
     */
    select?: FornecedorCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * FornecedorCountOutputType without action
   */
  export type FornecedorCountOutputTypeCountContatosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: FornecedorContatoWhereInput
  }


  /**
   * FornecedorCountOutputType without action
   */
  export type FornecedorCountOutputTypeCountSancoesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: FornecedorSancaoWhereInput
  }


  /**
   * FornecedorCountOutputType without action
   */
  export type FornecedorCountOutputTypeCountContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ContratoWhereInput
  }



  /**
   * Count Type ServidorCountOutputType
   */


  export type ServidorCountOutputType = {
    gestorContratos: number
    fiscalContratos: number
  }

  export type ServidorCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    gestorContratos?: boolean | ServidorCountOutputTypeCountGestorContratosArgs
    fiscalContratos?: boolean | ServidorCountOutputTypeCountFiscalContratosArgs
  }

  // Custom InputTypes

  /**
   * ServidorCountOutputType without action
   */
  export type ServidorCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServidorCountOutputType
     */
    select?: ServidorCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * ServidorCountOutputType without action
   */
  export type ServidorCountOutputTypeCountGestorContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ContratoWhereInput
  }


  /**
   * ServidorCountOutputType without action
   */
  export type ServidorCountOutputTypeCountFiscalContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ContratoWhereInput
  }



  /**
   * Count Type ContratoCountOutputType
   */


  export type ContratoCountOutputType = {
    aditivos: number
  }

  export type ContratoCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    aditivos?: boolean | ContratoCountOutputTypeCountAditivosArgs
  }

  // Custom InputTypes

  /**
   * ContratoCountOutputType without action
   */
  export type ContratoCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContratoCountOutputType
     */
    select?: ContratoCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * ContratoCountOutputType without action
   */
  export type ContratoCountOutputTypeCountAditivosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AditivoWhereInput
  }



  /**
   * Models
   */

  /**
   * Model UnidadeFsp
   */


  export type AggregateUnidadeFsp = {
    _count: UnidadeFspCountAggregateOutputType | null
    _min: UnidadeFspMinAggregateOutputType | null
    _max: UnidadeFspMaxAggregateOutputType | null
  }

  export type UnidadeFspMinAggregateOutputType = {
    id: string | null
    sigla: string | null
    nome: string | null
  }

  export type UnidadeFspMaxAggregateOutputType = {
    id: string | null
    sigla: string | null
    nome: string | null
  }

  export type UnidadeFspCountAggregateOutputType = {
    id: number
    sigla: number
    nome: number
    _all: number
  }


  export type UnidadeFspMinAggregateInputType = {
    id?: true
    sigla?: true
    nome?: true
  }

  export type UnidadeFspMaxAggregateInputType = {
    id?: true
    sigla?: true
    nome?: true
  }

  export type UnidadeFspCountAggregateInputType = {
    id?: true
    sigla?: true
    nome?: true
    _all?: true
  }

  export type UnidadeFspAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnidadeFsp to aggregate.
     */
    where?: UnidadeFspWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeFsps to fetch.
     */
    orderBy?: Enumerable<UnidadeFspOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnidadeFspWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeFsps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeFsps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UnidadeFsps
    **/
    _count?: true | UnidadeFspCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnidadeFspMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnidadeFspMaxAggregateInputType
  }

  export type GetUnidadeFspAggregateType<T extends UnidadeFspAggregateArgs> = {
        [P in keyof T & keyof AggregateUnidadeFsp]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnidadeFsp[P]>
      : GetScalarType<T[P], AggregateUnidadeFsp[P]>
  }




  export type UnidadeFspGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: UnidadeFspWhereInput
    orderBy?: Enumerable<UnidadeFspOrderByWithAggregationInput>
    by: UnidadeFspScalarFieldEnum[]
    having?: UnidadeFspScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnidadeFspCountAggregateInputType | true
    _min?: UnidadeFspMinAggregateInputType
    _max?: UnidadeFspMaxAggregateInputType
  }


  export type UnidadeFspGroupByOutputType = {
    id: string
    sigla: string
    nome: string
    _count: UnidadeFspCountAggregateOutputType | null
    _min: UnidadeFspMinAggregateOutputType | null
    _max: UnidadeFspMaxAggregateOutputType | null
  }

  type GetUnidadeFspGroupByPayload<T extends UnidadeFspGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UnidadeFspGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnidadeFspGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnidadeFspGroupByOutputType[P]>
            : GetScalarType<T[P], UnidadeFspGroupByOutputType[P]>
        }
      >
    >


  export type UnidadeFspSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sigla?: boolean
    nome?: boolean
    contratos?: boolean | UnidadeFsp$contratosArgs<ExtArgs>
    _count?: boolean | UnidadeFspCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["unidadeFsp"]>

  export type UnidadeFspSelectScalar = {
    id?: boolean
    sigla?: boolean
    nome?: boolean
  }

  export type UnidadeFspInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    contratos?: boolean | UnidadeFsp$contratosArgs<ExtArgs>
    _count?: boolean | UnidadeFspCountOutputTypeArgs<ExtArgs>
  }


  type UnidadeFspGetPayload<S extends boolean | null | undefined | UnidadeFspArgs> = $Types.GetResult<UnidadeFspPayload, S>

  type UnidadeFspCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<UnidadeFspFindManyArgs, 'select' | 'include'> & {
      select?: UnidadeFspCountAggregateInputType | true
    }

  export interface UnidadeFspDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UnidadeFsp'], meta: { name: 'UnidadeFsp' } }
    /**
     * Find zero or one UnidadeFsp that matches the filter.
     * @param {UnidadeFspFindUniqueArgs} args - Arguments to find a UnidadeFsp
     * @example
     * // Get one UnidadeFsp
     * const unidadeFsp = await prisma.unidadeFsp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UnidadeFspFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UnidadeFspFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UnidadeFsp'> extends True ? Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one UnidadeFsp that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UnidadeFspFindUniqueOrThrowArgs} args - Arguments to find a UnidadeFsp
     * @example
     * // Get one UnidadeFsp
     * const unidadeFsp = await prisma.unidadeFsp.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UnidadeFspFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeFspFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first UnidadeFsp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFspFindFirstArgs} args - Arguments to find a UnidadeFsp
     * @example
     * // Get one UnidadeFsp
     * const unidadeFsp = await prisma.unidadeFsp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UnidadeFspFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UnidadeFspFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UnidadeFsp'> extends True ? Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first UnidadeFsp that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFspFindFirstOrThrowArgs} args - Arguments to find a UnidadeFsp
     * @example
     * // Get one UnidadeFsp
     * const unidadeFsp = await prisma.unidadeFsp.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UnidadeFspFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeFspFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more UnidadeFsps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFspFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UnidadeFsps
     * const unidadeFsps = await prisma.unidadeFsp.findMany()
     * 
     * // Get first 10 UnidadeFsps
     * const unidadeFsps = await prisma.unidadeFsp.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unidadeFspWithIdOnly = await prisma.unidadeFsp.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UnidadeFspFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeFspFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a UnidadeFsp.
     * @param {UnidadeFspCreateArgs} args - Arguments to create a UnidadeFsp.
     * @example
     * // Create one UnidadeFsp
     * const UnidadeFsp = await prisma.unidadeFsp.create({
     *   data: {
     *     // ... data to create a UnidadeFsp
     *   }
     * })
     * 
    **/
    create<T extends UnidadeFspCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeFspCreateArgs<ExtArgs>>
    ): Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many UnidadeFsps.
     *     @param {UnidadeFspCreateManyArgs} args - Arguments to create many UnidadeFsps.
     *     @example
     *     // Create many UnidadeFsps
     *     const unidadeFsp = await prisma.unidadeFsp.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UnidadeFspCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeFspCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UnidadeFsp.
     * @param {UnidadeFspDeleteArgs} args - Arguments to delete one UnidadeFsp.
     * @example
     * // Delete one UnidadeFsp
     * const UnidadeFsp = await prisma.unidadeFsp.delete({
     *   where: {
     *     // ... filter to delete one UnidadeFsp
     *   }
     * })
     * 
    **/
    delete<T extends UnidadeFspDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeFspDeleteArgs<ExtArgs>>
    ): Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one UnidadeFsp.
     * @param {UnidadeFspUpdateArgs} args - Arguments to update one UnidadeFsp.
     * @example
     * // Update one UnidadeFsp
     * const unidadeFsp = await prisma.unidadeFsp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UnidadeFspUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeFspUpdateArgs<ExtArgs>>
    ): Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more UnidadeFsps.
     * @param {UnidadeFspDeleteManyArgs} args - Arguments to filter UnidadeFsps to delete.
     * @example
     * // Delete a few UnidadeFsps
     * const { count } = await prisma.unidadeFsp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UnidadeFspDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeFspDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnidadeFsps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFspUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UnidadeFsps
     * const unidadeFsp = await prisma.unidadeFsp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UnidadeFspUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeFspUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UnidadeFsp.
     * @param {UnidadeFspUpsertArgs} args - Arguments to update or create a UnidadeFsp.
     * @example
     * // Update or create a UnidadeFsp
     * const unidadeFsp = await prisma.unidadeFsp.upsert({
     *   create: {
     *     // ... data to create a UnidadeFsp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UnidadeFsp we want to update
     *   }
     * })
    **/
    upsert<T extends UnidadeFspUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeFspUpsertArgs<ExtArgs>>
    ): Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of UnidadeFsps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFspCountArgs} args - Arguments to filter UnidadeFsps to count.
     * @example
     * // Count the number of UnidadeFsps
     * const count = await prisma.unidadeFsp.count({
     *   where: {
     *     // ... the filter for the UnidadeFsps we want to count
     *   }
     * })
    **/
    count<T extends UnidadeFspCountArgs>(
      args?: Subset<T, UnidadeFspCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnidadeFspCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UnidadeFsp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFspAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UnidadeFspAggregateArgs>(args: Subset<T, UnidadeFspAggregateArgs>): Prisma.PrismaPromise<GetUnidadeFspAggregateType<T>>

    /**
     * Group by UnidadeFsp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeFspGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UnidadeFspGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnidadeFspGroupByArgs['orderBy'] }
        : { orderBy?: UnidadeFspGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UnidadeFspGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnidadeFspGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UnidadeFsp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UnidadeFspClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    contratos<T extends UnidadeFsp$contratosArgs<ExtArgs> = {}>(args?: Subset<T, UnidadeFsp$contratosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UnidadeFsp base type for findUnique actions
   */
  export type UnidadeFspFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFsp to fetch.
     */
    where: UnidadeFspWhereUniqueInput
  }

  /**
   * UnidadeFsp findUnique
   */
  export interface UnidadeFspFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends UnidadeFspFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UnidadeFsp findUniqueOrThrow
   */
  export type UnidadeFspFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFsp to fetch.
     */
    where: UnidadeFspWhereUniqueInput
  }


  /**
   * UnidadeFsp base type for findFirst actions
   */
  export type UnidadeFspFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFsp to fetch.
     */
    where?: UnidadeFspWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeFsps to fetch.
     */
    orderBy?: Enumerable<UnidadeFspOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnidadeFsps.
     */
    cursor?: UnidadeFspWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeFsps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeFsps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnidadeFsps.
     */
    distinct?: Enumerable<UnidadeFspScalarFieldEnum>
  }

  /**
   * UnidadeFsp findFirst
   */
  export interface UnidadeFspFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends UnidadeFspFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UnidadeFsp findFirstOrThrow
   */
  export type UnidadeFspFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFsp to fetch.
     */
    where?: UnidadeFspWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeFsps to fetch.
     */
    orderBy?: Enumerable<UnidadeFspOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnidadeFsps.
     */
    cursor?: UnidadeFspWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeFsps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeFsps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnidadeFsps.
     */
    distinct?: Enumerable<UnidadeFspScalarFieldEnum>
  }


  /**
   * UnidadeFsp findMany
   */
  export type UnidadeFspFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeFsps to fetch.
     */
    where?: UnidadeFspWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeFsps to fetch.
     */
    orderBy?: Enumerable<UnidadeFspOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UnidadeFsps.
     */
    cursor?: UnidadeFspWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeFsps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeFsps.
     */
    skip?: number
    distinct?: Enumerable<UnidadeFspScalarFieldEnum>
  }


  /**
   * UnidadeFsp create
   */
  export type UnidadeFspCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * The data needed to create a UnidadeFsp.
     */
    data: XOR<UnidadeFspCreateInput, UnidadeFspUncheckedCreateInput>
  }


  /**
   * UnidadeFsp createMany
   */
  export type UnidadeFspCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UnidadeFsps.
     */
    data: Enumerable<UnidadeFspCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UnidadeFsp update
   */
  export type UnidadeFspUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * The data needed to update a UnidadeFsp.
     */
    data: XOR<UnidadeFspUpdateInput, UnidadeFspUncheckedUpdateInput>
    /**
     * Choose, which UnidadeFsp to update.
     */
    where: UnidadeFspWhereUniqueInput
  }


  /**
   * UnidadeFsp updateMany
   */
  export type UnidadeFspUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UnidadeFsps.
     */
    data: XOR<UnidadeFspUpdateManyMutationInput, UnidadeFspUncheckedUpdateManyInput>
    /**
     * Filter which UnidadeFsps to update
     */
    where?: UnidadeFspWhereInput
  }


  /**
   * UnidadeFsp upsert
   */
  export type UnidadeFspUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * The filter to search for the UnidadeFsp to update in case it exists.
     */
    where: UnidadeFspWhereUniqueInput
    /**
     * In case the UnidadeFsp found by the `where` argument doesn't exist, create a new UnidadeFsp with this data.
     */
    create: XOR<UnidadeFspCreateInput, UnidadeFspUncheckedCreateInput>
    /**
     * In case the UnidadeFsp was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnidadeFspUpdateInput, UnidadeFspUncheckedUpdateInput>
  }


  /**
   * UnidadeFsp delete
   */
  export type UnidadeFspDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
    /**
     * Filter which UnidadeFsp to delete.
     */
    where: UnidadeFspWhereUniqueInput
  }


  /**
   * UnidadeFsp deleteMany
   */
  export type UnidadeFspDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnidadeFsps to delete
     */
    where?: UnidadeFspWhereInput
  }


  /**
   * UnidadeFsp.contratos
   */
  export type UnidadeFsp$contratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    where?: ContratoWhereInput
    orderBy?: Enumerable<ContratoOrderByWithRelationInput>
    cursor?: ContratoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<ContratoScalarFieldEnum>
  }


  /**
   * UnidadeFsp without action
   */
  export type UnidadeFspArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeFsp
     */
    select?: UnidadeFspSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeFspInclude<ExtArgs> | null
  }



  /**
   * Model Municipio
   */


  export type AggregateMunicipio = {
    _count: MunicipioCountAggregateOutputType | null
    _min: MunicipioMinAggregateOutputType | null
    _max: MunicipioMaxAggregateOutputType | null
  }

  export type MunicipioMinAggregateOutputType = {
    id: string | null
    codigoIbge: string | null
    nome: string | null
    uf: string | null
    regiaoAdministrativa: string | null
  }

  export type MunicipioMaxAggregateOutputType = {
    id: string | null
    codigoIbge: string | null
    nome: string | null
    uf: string | null
    regiaoAdministrativa: string | null
  }

  export type MunicipioCountAggregateOutputType = {
    id: number
    codigoIbge: number
    nome: number
    uf: number
    regiaoAdministrativa: number
    _all: number
  }


  export type MunicipioMinAggregateInputType = {
    id?: true
    codigoIbge?: true
    nome?: true
    uf?: true
    regiaoAdministrativa?: true
  }

  export type MunicipioMaxAggregateInputType = {
    id?: true
    codigoIbge?: true
    nome?: true
    uf?: true
    regiaoAdministrativa?: true
  }

  export type MunicipioCountAggregateInputType = {
    id?: true
    codigoIbge?: true
    nome?: true
    uf?: true
    regiaoAdministrativa?: true
    _all?: true
  }

  export type MunicipioAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Municipio to aggregate.
     */
    where?: MunicipioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Municipios to fetch.
     */
    orderBy?: Enumerable<MunicipioOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MunicipioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Municipios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Municipios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Municipios
    **/
    _count?: true | MunicipioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MunicipioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MunicipioMaxAggregateInputType
  }

  export type GetMunicipioAggregateType<T extends MunicipioAggregateArgs> = {
        [P in keyof T & keyof AggregateMunicipio]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMunicipio[P]>
      : GetScalarType<T[P], AggregateMunicipio[P]>
  }




  export type MunicipioGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: MunicipioWhereInput
    orderBy?: Enumerable<MunicipioOrderByWithAggregationInput>
    by: MunicipioScalarFieldEnum[]
    having?: MunicipioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MunicipioCountAggregateInputType | true
    _min?: MunicipioMinAggregateInputType
    _max?: MunicipioMaxAggregateInputType
  }


  export type MunicipioGroupByOutputType = {
    id: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa: string | null
    _count: MunicipioCountAggregateOutputType | null
    _min: MunicipioMinAggregateOutputType | null
    _max: MunicipioMaxAggregateOutputType | null
  }

  type GetMunicipioGroupByPayload<T extends MunicipioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<MunicipioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MunicipioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MunicipioGroupByOutputType[P]>
            : GetScalarType<T[P], MunicipioGroupByOutputType[P]>
        }
      >
    >


  export type MunicipioSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    codigoIbge?: boolean
    nome?: boolean
    uf?: boolean
    regiaoAdministrativa?: boolean
    unidades?: boolean | Municipio$unidadesArgs<ExtArgs>
    fornecedores?: boolean | Municipio$fornecedoresArgs<ExtArgs>
    _count?: boolean | MunicipioCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["municipio"]>

  export type MunicipioSelectScalar = {
    id?: boolean
    codigoIbge?: boolean
    nome?: boolean
    uf?: boolean
    regiaoAdministrativa?: boolean
  }

  export type MunicipioInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    unidades?: boolean | Municipio$unidadesArgs<ExtArgs>
    fornecedores?: boolean | Municipio$fornecedoresArgs<ExtArgs>
    _count?: boolean | MunicipioCountOutputTypeArgs<ExtArgs>
  }


  type MunicipioGetPayload<S extends boolean | null | undefined | MunicipioArgs> = $Types.GetResult<MunicipioPayload, S>

  type MunicipioCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<MunicipioFindManyArgs, 'select' | 'include'> & {
      select?: MunicipioCountAggregateInputType | true
    }

  export interface MunicipioDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Municipio'], meta: { name: 'Municipio' } }
    /**
     * Find zero or one Municipio that matches the filter.
     * @param {MunicipioFindUniqueArgs} args - Arguments to find a Municipio
     * @example
     * // Get one Municipio
     * const municipio = await prisma.municipio.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends MunicipioFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, MunicipioFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Municipio'> extends True ? Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Municipio that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {MunicipioFindUniqueOrThrowArgs} args - Arguments to find a Municipio
     * @example
     * // Get one Municipio
     * const municipio = await prisma.municipio.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends MunicipioFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, MunicipioFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Municipio that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipioFindFirstArgs} args - Arguments to find a Municipio
     * @example
     * // Get one Municipio
     * const municipio = await prisma.municipio.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends MunicipioFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, MunicipioFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Municipio'> extends True ? Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Municipio that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipioFindFirstOrThrowArgs} args - Arguments to find a Municipio
     * @example
     * // Get one Municipio
     * const municipio = await prisma.municipio.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends MunicipioFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, MunicipioFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Municipios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipioFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Municipios
     * const municipios = await prisma.municipio.findMany()
     * 
     * // Get first 10 Municipios
     * const municipios = await prisma.municipio.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const municipioWithIdOnly = await prisma.municipio.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends MunicipioFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MunicipioFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Municipio.
     * @param {MunicipioCreateArgs} args - Arguments to create a Municipio.
     * @example
     * // Create one Municipio
     * const Municipio = await prisma.municipio.create({
     *   data: {
     *     // ... data to create a Municipio
     *   }
     * })
     * 
    **/
    create<T extends MunicipioCreateArgs<ExtArgs>>(
      args: SelectSubset<T, MunicipioCreateArgs<ExtArgs>>
    ): Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Municipios.
     *     @param {MunicipioCreateManyArgs} args - Arguments to create many Municipios.
     *     @example
     *     // Create many Municipios
     *     const municipio = await prisma.municipio.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends MunicipioCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MunicipioCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Municipio.
     * @param {MunicipioDeleteArgs} args - Arguments to delete one Municipio.
     * @example
     * // Delete one Municipio
     * const Municipio = await prisma.municipio.delete({
     *   where: {
     *     // ... filter to delete one Municipio
     *   }
     * })
     * 
    **/
    delete<T extends MunicipioDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, MunicipioDeleteArgs<ExtArgs>>
    ): Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Municipio.
     * @param {MunicipioUpdateArgs} args - Arguments to update one Municipio.
     * @example
     * // Update one Municipio
     * const municipio = await prisma.municipio.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends MunicipioUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, MunicipioUpdateArgs<ExtArgs>>
    ): Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Municipios.
     * @param {MunicipioDeleteManyArgs} args - Arguments to filter Municipios to delete.
     * @example
     * // Delete a few Municipios
     * const { count } = await prisma.municipio.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends MunicipioDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MunicipioDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Municipios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Municipios
     * const municipio = await prisma.municipio.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends MunicipioUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, MunicipioUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Municipio.
     * @param {MunicipioUpsertArgs} args - Arguments to update or create a Municipio.
     * @example
     * // Update or create a Municipio
     * const municipio = await prisma.municipio.upsert({
     *   create: {
     *     // ... data to create a Municipio
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Municipio we want to update
     *   }
     * })
    **/
    upsert<T extends MunicipioUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, MunicipioUpsertArgs<ExtArgs>>
    ): Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Municipios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipioCountArgs} args - Arguments to filter Municipios to count.
     * @example
     * // Count the number of Municipios
     * const count = await prisma.municipio.count({
     *   where: {
     *     // ... the filter for the Municipios we want to count
     *   }
     * })
    **/
    count<T extends MunicipioCountArgs>(
      args?: Subset<T, MunicipioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MunicipioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Municipio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MunicipioAggregateArgs>(args: Subset<T, MunicipioAggregateArgs>): Prisma.PrismaPromise<GetMunicipioAggregateType<T>>

    /**
     * Group by Municipio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MunicipioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MunicipioGroupByArgs['orderBy'] }
        : { orderBy?: MunicipioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MunicipioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMunicipioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Municipio.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__MunicipioClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    unidades<T extends Municipio$unidadesArgs<ExtArgs> = {}>(args?: Subset<T, Municipio$unidadesArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findMany', never>| Null>;

    fornecedores<T extends Municipio$fornecedoresArgs<ExtArgs> = {}>(args?: Subset<T, Municipio$fornecedoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Municipio base type for findUnique actions
   */
  export type MunicipioFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * Filter, which Municipio to fetch.
     */
    where: MunicipioWhereUniqueInput
  }

  /**
   * Municipio findUnique
   */
  export interface MunicipioFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends MunicipioFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Municipio findUniqueOrThrow
   */
  export type MunicipioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * Filter, which Municipio to fetch.
     */
    where: MunicipioWhereUniqueInput
  }


  /**
   * Municipio base type for findFirst actions
   */
  export type MunicipioFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * Filter, which Municipio to fetch.
     */
    where?: MunicipioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Municipios to fetch.
     */
    orderBy?: Enumerable<MunicipioOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Municipios.
     */
    cursor?: MunicipioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Municipios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Municipios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Municipios.
     */
    distinct?: Enumerable<MunicipioScalarFieldEnum>
  }

  /**
   * Municipio findFirst
   */
  export interface MunicipioFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends MunicipioFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Municipio findFirstOrThrow
   */
  export type MunicipioFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * Filter, which Municipio to fetch.
     */
    where?: MunicipioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Municipios to fetch.
     */
    orderBy?: Enumerable<MunicipioOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Municipios.
     */
    cursor?: MunicipioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Municipios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Municipios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Municipios.
     */
    distinct?: Enumerable<MunicipioScalarFieldEnum>
  }


  /**
   * Municipio findMany
   */
  export type MunicipioFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * Filter, which Municipios to fetch.
     */
    where?: MunicipioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Municipios to fetch.
     */
    orderBy?: Enumerable<MunicipioOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Municipios.
     */
    cursor?: MunicipioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Municipios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Municipios.
     */
    skip?: number
    distinct?: Enumerable<MunicipioScalarFieldEnum>
  }


  /**
   * Municipio create
   */
  export type MunicipioCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * The data needed to create a Municipio.
     */
    data: XOR<MunicipioCreateInput, MunicipioUncheckedCreateInput>
  }


  /**
   * Municipio createMany
   */
  export type MunicipioCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Municipios.
     */
    data: Enumerable<MunicipioCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Municipio update
   */
  export type MunicipioUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * The data needed to update a Municipio.
     */
    data: XOR<MunicipioUpdateInput, MunicipioUncheckedUpdateInput>
    /**
     * Choose, which Municipio to update.
     */
    where: MunicipioWhereUniqueInput
  }


  /**
   * Municipio updateMany
   */
  export type MunicipioUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Municipios.
     */
    data: XOR<MunicipioUpdateManyMutationInput, MunicipioUncheckedUpdateManyInput>
    /**
     * Filter which Municipios to update
     */
    where?: MunicipioWhereInput
  }


  /**
   * Municipio upsert
   */
  export type MunicipioUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * The filter to search for the Municipio to update in case it exists.
     */
    where: MunicipioWhereUniqueInput
    /**
     * In case the Municipio found by the `where` argument doesn't exist, create a new Municipio with this data.
     */
    create: XOR<MunicipioCreateInput, MunicipioUncheckedCreateInput>
    /**
     * In case the Municipio was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MunicipioUpdateInput, MunicipioUncheckedUpdateInput>
  }


  /**
   * Municipio delete
   */
  export type MunicipioDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
    /**
     * Filter which Municipio to delete.
     */
    where: MunicipioWhereUniqueInput
  }


  /**
   * Municipio deleteMany
   */
  export type MunicipioDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Municipios to delete
     */
    where?: MunicipioWhereInput
  }


  /**
   * Municipio.unidades
   */
  export type Municipio$unidadesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    where?: UnidadeOrganizacionalWhereInput
    orderBy?: Enumerable<UnidadeOrganizacionalOrderByWithRelationInput>
    cursor?: UnidadeOrganizacionalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<UnidadeOrganizacionalScalarFieldEnum>
  }


  /**
   * Municipio.fornecedores
   */
  export type Municipio$fornecedoresArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    where?: FornecedorWhereInput
    orderBy?: Enumerable<FornecedorOrderByWithRelationInput>
    cursor?: FornecedorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<FornecedorScalarFieldEnum>
  }


  /**
   * Municipio without action
   */
  export type MunicipioArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MunicipioInclude<ExtArgs> | null
  }



  /**
   * Model Dominio
   */


  export type AggregateDominio = {
    _count: DominioCountAggregateOutputType | null
    _min: DominioMinAggregateOutputType | null
    _max: DominioMaxAggregateOutputType | null
  }

  export type DominioMinAggregateOutputType = {
    id: string | null
    slug: string | null
    nome: string | null
    descricao: string | null
    editavelPeloUsuario: boolean | null
    permiteHierarquia: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DominioMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    nome: string | null
    descricao: string | null
    editavelPeloUsuario: boolean | null
    permiteHierarquia: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DominioCountAggregateOutputType = {
    id: number
    slug: number
    nome: number
    descricao: number
    editavelPeloUsuario: number
    permiteHierarquia: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DominioMinAggregateInputType = {
    id?: true
    slug?: true
    nome?: true
    descricao?: true
    editavelPeloUsuario?: true
    permiteHierarquia?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DominioMaxAggregateInputType = {
    id?: true
    slug?: true
    nome?: true
    descricao?: true
    editavelPeloUsuario?: true
    permiteHierarquia?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DominioCountAggregateInputType = {
    id?: true
    slug?: true
    nome?: true
    descricao?: true
    editavelPeloUsuario?: true
    permiteHierarquia?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DominioAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dominio to aggregate.
     */
    where?: DominioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dominios to fetch.
     */
    orderBy?: Enumerable<DominioOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DominioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dominios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dominios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Dominios
    **/
    _count?: true | DominioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DominioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DominioMaxAggregateInputType
  }

  export type GetDominioAggregateType<T extends DominioAggregateArgs> = {
        [P in keyof T & keyof AggregateDominio]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDominio[P]>
      : GetScalarType<T[P], AggregateDominio[P]>
  }




  export type DominioGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: DominioWhereInput
    orderBy?: Enumerable<DominioOrderByWithAggregationInput>
    by: DominioScalarFieldEnum[]
    having?: DominioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DominioCountAggregateInputType | true
    _min?: DominioMinAggregateInputType
    _max?: DominioMaxAggregateInputType
  }


  export type DominioGroupByOutputType = {
    id: string
    slug: string
    nome: string
    descricao: string | null
    editavelPeloUsuario: boolean
    permiteHierarquia: boolean
    createdAt: Date
    updatedAt: Date
    _count: DominioCountAggregateOutputType | null
    _min: DominioMinAggregateOutputType | null
    _max: DominioMaxAggregateOutputType | null
  }

  type GetDominioGroupByPayload<T extends DominioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<DominioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DominioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DominioGroupByOutputType[P]>
            : GetScalarType<T[P], DominioGroupByOutputType[P]>
        }
      >
    >


  export type DominioSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    nome?: boolean
    descricao?: boolean
    editavelPeloUsuario?: boolean
    permiteHierarquia?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    valores?: boolean | Dominio$valoresArgs<ExtArgs>
    _count?: boolean | DominioCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["dominio"]>

  export type DominioSelectScalar = {
    id?: boolean
    slug?: boolean
    nome?: boolean
    descricao?: boolean
    editavelPeloUsuario?: boolean
    permiteHierarquia?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DominioInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    valores?: boolean | Dominio$valoresArgs<ExtArgs>
    _count?: boolean | DominioCountOutputTypeArgs<ExtArgs>
  }


  type DominioGetPayload<S extends boolean | null | undefined | DominioArgs> = $Types.GetResult<DominioPayload, S>

  type DominioCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<DominioFindManyArgs, 'select' | 'include'> & {
      select?: DominioCountAggregateInputType | true
    }

  export interface DominioDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dominio'], meta: { name: 'Dominio' } }
    /**
     * Find zero or one Dominio that matches the filter.
     * @param {DominioFindUniqueArgs} args - Arguments to find a Dominio
     * @example
     * // Get one Dominio
     * const dominio = await prisma.dominio.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DominioFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, DominioFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Dominio'> extends True ? Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Dominio that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {DominioFindUniqueOrThrowArgs} args - Arguments to find a Dominio
     * @example
     * // Get one Dominio
     * const dominio = await prisma.dominio.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DominioFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Dominio that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioFindFirstArgs} args - Arguments to find a Dominio
     * @example
     * // Get one Dominio
     * const dominio = await prisma.dominio.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DominioFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, DominioFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Dominio'> extends True ? Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Dominio that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioFindFirstOrThrowArgs} args - Arguments to find a Dominio
     * @example
     * // Get one Dominio
     * const dominio = await prisma.dominio.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DominioFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Dominios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dominios
     * const dominios = await prisma.dominio.findMany()
     * 
     * // Get first 10 Dominios
     * const dominios = await prisma.dominio.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dominioWithIdOnly = await prisma.dominio.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DominioFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<DominioPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Dominio.
     * @param {DominioCreateArgs} args - Arguments to create a Dominio.
     * @example
     * // Create one Dominio
     * const Dominio = await prisma.dominio.create({
     *   data: {
     *     // ... data to create a Dominio
     *   }
     * })
     * 
    **/
    create<T extends DominioCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DominioCreateArgs<ExtArgs>>
    ): Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Dominios.
     *     @param {DominioCreateManyArgs} args - Arguments to create many Dominios.
     *     @example
     *     // Create many Dominios
     *     const dominio = await prisma.dominio.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends DominioCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Dominio.
     * @param {DominioDeleteArgs} args - Arguments to delete one Dominio.
     * @example
     * // Delete one Dominio
     * const Dominio = await prisma.dominio.delete({
     *   where: {
     *     // ... filter to delete one Dominio
     *   }
     * })
     * 
    **/
    delete<T extends DominioDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DominioDeleteArgs<ExtArgs>>
    ): Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Dominio.
     * @param {DominioUpdateArgs} args - Arguments to update one Dominio.
     * @example
     * // Update one Dominio
     * const dominio = await prisma.dominio.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DominioUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DominioUpdateArgs<ExtArgs>>
    ): Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Dominios.
     * @param {DominioDeleteManyArgs} args - Arguments to filter Dominios to delete.
     * @example
     * // Delete a few Dominios
     * const { count } = await prisma.dominio.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DominioDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dominios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dominios
     * const dominio = await prisma.dominio.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DominioUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DominioUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dominio.
     * @param {DominioUpsertArgs} args - Arguments to update or create a Dominio.
     * @example
     * // Update or create a Dominio
     * const dominio = await prisma.dominio.upsert({
     *   create: {
     *     // ... data to create a Dominio
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dominio we want to update
     *   }
     * })
    **/
    upsert<T extends DominioUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DominioUpsertArgs<ExtArgs>>
    ): Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Dominios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioCountArgs} args - Arguments to filter Dominios to count.
     * @example
     * // Count the number of Dominios
     * const count = await prisma.dominio.count({
     *   where: {
     *     // ... the filter for the Dominios we want to count
     *   }
     * })
    **/
    count<T extends DominioCountArgs>(
      args?: Subset<T, DominioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DominioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dominio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DominioAggregateArgs>(args: Subset<T, DominioAggregateArgs>): Prisma.PrismaPromise<GetDominioAggregateType<T>>

    /**
     * Group by Dominio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DominioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DominioGroupByArgs['orderBy'] }
        : { orderBy?: DominioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DominioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDominioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Dominio.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__DominioClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    valores<T extends Dominio$valoresArgs<ExtArgs> = {}>(args?: Subset<T, Dominio$valoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Dominio base type for findUnique actions
   */
  export type DominioFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * Filter, which Dominio to fetch.
     */
    where: DominioWhereUniqueInput
  }

  /**
   * Dominio findUnique
   */
  export interface DominioFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends DominioFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Dominio findUniqueOrThrow
   */
  export type DominioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * Filter, which Dominio to fetch.
     */
    where: DominioWhereUniqueInput
  }


  /**
   * Dominio base type for findFirst actions
   */
  export type DominioFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * Filter, which Dominio to fetch.
     */
    where?: DominioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dominios to fetch.
     */
    orderBy?: Enumerable<DominioOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dominios.
     */
    cursor?: DominioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dominios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dominios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dominios.
     */
    distinct?: Enumerable<DominioScalarFieldEnum>
  }

  /**
   * Dominio findFirst
   */
  export interface DominioFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends DominioFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Dominio findFirstOrThrow
   */
  export type DominioFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * Filter, which Dominio to fetch.
     */
    where?: DominioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dominios to fetch.
     */
    orderBy?: Enumerable<DominioOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dominios.
     */
    cursor?: DominioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dominios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dominios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dominios.
     */
    distinct?: Enumerable<DominioScalarFieldEnum>
  }


  /**
   * Dominio findMany
   */
  export type DominioFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * Filter, which Dominios to fetch.
     */
    where?: DominioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dominios to fetch.
     */
    orderBy?: Enumerable<DominioOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Dominios.
     */
    cursor?: DominioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dominios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dominios.
     */
    skip?: number
    distinct?: Enumerable<DominioScalarFieldEnum>
  }


  /**
   * Dominio create
   */
  export type DominioCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * The data needed to create a Dominio.
     */
    data: XOR<DominioCreateInput, DominioUncheckedCreateInput>
  }


  /**
   * Dominio createMany
   */
  export type DominioCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Dominios.
     */
    data: Enumerable<DominioCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Dominio update
   */
  export type DominioUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * The data needed to update a Dominio.
     */
    data: XOR<DominioUpdateInput, DominioUncheckedUpdateInput>
    /**
     * Choose, which Dominio to update.
     */
    where: DominioWhereUniqueInput
  }


  /**
   * Dominio updateMany
   */
  export type DominioUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Dominios.
     */
    data: XOR<DominioUpdateManyMutationInput, DominioUncheckedUpdateManyInput>
    /**
     * Filter which Dominios to update
     */
    where?: DominioWhereInput
  }


  /**
   * Dominio upsert
   */
  export type DominioUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * The filter to search for the Dominio to update in case it exists.
     */
    where: DominioWhereUniqueInput
    /**
     * In case the Dominio found by the `where` argument doesn't exist, create a new Dominio with this data.
     */
    create: XOR<DominioCreateInput, DominioUncheckedCreateInput>
    /**
     * In case the Dominio was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DominioUpdateInput, DominioUncheckedUpdateInput>
  }


  /**
   * Dominio delete
   */
  export type DominioDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
    /**
     * Filter which Dominio to delete.
     */
    where: DominioWhereUniqueInput
  }


  /**
   * Dominio deleteMany
   */
  export type DominioDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dominios to delete
     */
    where?: DominioWhereInput
  }


  /**
   * Dominio.valores
   */
  export type Dominio$valoresArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    where?: DominioValorWhereInput
    orderBy?: Enumerable<DominioValorOrderByWithRelationInput>
    cursor?: DominioValorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<DominioValorScalarFieldEnum>
  }


  /**
   * Dominio without action
   */
  export type DominioArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dominio
     */
    select?: DominioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioInclude<ExtArgs> | null
  }



  /**
   * Model DominioValor
   */


  export type AggregateDominioValor = {
    _count: DominioValorCountAggregateOutputType | null
    _avg: DominioValorAvgAggregateOutputType | null
    _sum: DominioValorSumAggregateOutputType | null
    _min: DominioValorMinAggregateOutputType | null
    _max: DominioValorMaxAggregateOutputType | null
  }

  export type DominioValorAvgAggregateOutputType = {
    ordem: number | null
  }

  export type DominioValorSumAggregateOutputType = {
    ordem: number | null
  }

  export type DominioValorMinAggregateOutputType = {
    id: string | null
    dominioId: string | null
    codigo: string | null
    label: string | null
    parentId: string | null
    ordem: number | null
    ativo: boolean | null
    codigoLegado: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DominioValorMaxAggregateOutputType = {
    id: string | null
    dominioId: string | null
    codigo: string | null
    label: string | null
    parentId: string | null
    ordem: number | null
    ativo: boolean | null
    codigoLegado: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DominioValorCountAggregateOutputType = {
    id: number
    dominioId: number
    codigo: number
    label: number
    parentId: number
    ordem: number
    ativo: number
    metadata: number
    codigoLegado: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DominioValorAvgAggregateInputType = {
    ordem?: true
  }

  export type DominioValorSumAggregateInputType = {
    ordem?: true
  }

  export type DominioValorMinAggregateInputType = {
    id?: true
    dominioId?: true
    codigo?: true
    label?: true
    parentId?: true
    ordem?: true
    ativo?: true
    codigoLegado?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DominioValorMaxAggregateInputType = {
    id?: true
    dominioId?: true
    codigo?: true
    label?: true
    parentId?: true
    ordem?: true
    ativo?: true
    codigoLegado?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DominioValorCountAggregateInputType = {
    id?: true
    dominioId?: true
    codigo?: true
    label?: true
    parentId?: true
    ordem?: true
    ativo?: true
    metadata?: true
    codigoLegado?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DominioValorAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which DominioValor to aggregate.
     */
    where?: DominioValorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DominioValors to fetch.
     */
    orderBy?: Enumerable<DominioValorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DominioValorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DominioValors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DominioValors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DominioValors
    **/
    _count?: true | DominioValorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DominioValorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DominioValorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DominioValorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DominioValorMaxAggregateInputType
  }

  export type GetDominioValorAggregateType<T extends DominioValorAggregateArgs> = {
        [P in keyof T & keyof AggregateDominioValor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDominioValor[P]>
      : GetScalarType<T[P], AggregateDominioValor[P]>
  }




  export type DominioValorGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: DominioValorWhereInput
    orderBy?: Enumerable<DominioValorOrderByWithAggregationInput>
    by: DominioValorScalarFieldEnum[]
    having?: DominioValorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DominioValorCountAggregateInputType | true
    _avg?: DominioValorAvgAggregateInputType
    _sum?: DominioValorSumAggregateInputType
    _min?: DominioValorMinAggregateInputType
    _max?: DominioValorMaxAggregateInputType
  }


  export type DominioValorGroupByOutputType = {
    id: string
    dominioId: string
    codigo: string
    label: string
    parentId: string | null
    ordem: number
    ativo: boolean
    metadata: JsonValue | null
    codigoLegado: string | null
    createdAt: Date
    updatedAt: Date
    _count: DominioValorCountAggregateOutputType | null
    _avg: DominioValorAvgAggregateOutputType | null
    _sum: DominioValorSumAggregateOutputType | null
    _min: DominioValorMinAggregateOutputType | null
    _max: DominioValorMaxAggregateOutputType | null
  }

  type GetDominioValorGroupByPayload<T extends DominioValorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<DominioValorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DominioValorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DominioValorGroupByOutputType[P]>
            : GetScalarType<T[P], DominioValorGroupByOutputType[P]>
        }
      >
    >


  export type DominioValorSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dominioId?: boolean
    codigo?: boolean
    label?: boolean
    parentId?: boolean
    ordem?: boolean
    ativo?: boolean
    metadata?: boolean
    codigoLegado?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dominio?: boolean | DominioArgs<ExtArgs>
    parent?: boolean | DominioValorArgs<ExtArgs>
    children?: boolean | DominioValor$childrenArgs<ExtArgs>
    _count?: boolean | DominioValorCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["dominioValor"]>

  export type DominioValorSelectScalar = {
    id?: boolean
    dominioId?: boolean
    codigo?: boolean
    label?: boolean
    parentId?: boolean
    ordem?: boolean
    ativo?: boolean
    metadata?: boolean
    codigoLegado?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DominioValorInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    dominio?: boolean | DominioArgs<ExtArgs>
    parent?: boolean | DominioValorArgs<ExtArgs>
    children?: boolean | DominioValor$childrenArgs<ExtArgs>
    _count?: boolean | DominioValorCountOutputTypeArgs<ExtArgs>
  }


  type DominioValorGetPayload<S extends boolean | null | undefined | DominioValorArgs> = $Types.GetResult<DominioValorPayload, S>

  type DominioValorCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<DominioValorFindManyArgs, 'select' | 'include'> & {
      select?: DominioValorCountAggregateInputType | true
    }

  export interface DominioValorDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DominioValor'], meta: { name: 'DominioValor' } }
    /**
     * Find zero or one DominioValor that matches the filter.
     * @param {DominioValorFindUniqueArgs} args - Arguments to find a DominioValor
     * @example
     * // Get one DominioValor
     * const dominioValor = await prisma.dominioValor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DominioValorFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, DominioValorFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'DominioValor'> extends True ? Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one DominioValor that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {DominioValorFindUniqueOrThrowArgs} args - Arguments to find a DominioValor
     * @example
     * // Get one DominioValor
     * const dominioValor = await prisma.dominioValor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DominioValorFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioValorFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first DominioValor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioValorFindFirstArgs} args - Arguments to find a DominioValor
     * @example
     * // Get one DominioValor
     * const dominioValor = await prisma.dominioValor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DominioValorFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, DominioValorFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'DominioValor'> extends True ? Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first DominioValor that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioValorFindFirstOrThrowArgs} args - Arguments to find a DominioValor
     * @example
     * // Get one DominioValor
     * const dominioValor = await prisma.dominioValor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DominioValorFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioValorFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more DominioValors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioValorFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DominioValors
     * const dominioValors = await prisma.dominioValor.findMany()
     * 
     * // Get first 10 DominioValors
     * const dominioValors = await prisma.dominioValor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dominioValorWithIdOnly = await prisma.dominioValor.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DominioValorFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioValorFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a DominioValor.
     * @param {DominioValorCreateArgs} args - Arguments to create a DominioValor.
     * @example
     * // Create one DominioValor
     * const DominioValor = await prisma.dominioValor.create({
     *   data: {
     *     // ... data to create a DominioValor
     *   }
     * })
     * 
    **/
    create<T extends DominioValorCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DominioValorCreateArgs<ExtArgs>>
    ): Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many DominioValors.
     *     @param {DominioValorCreateManyArgs} args - Arguments to create many DominioValors.
     *     @example
     *     // Create many DominioValors
     *     const dominioValor = await prisma.dominioValor.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends DominioValorCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioValorCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DominioValor.
     * @param {DominioValorDeleteArgs} args - Arguments to delete one DominioValor.
     * @example
     * // Delete one DominioValor
     * const DominioValor = await prisma.dominioValor.delete({
     *   where: {
     *     // ... filter to delete one DominioValor
     *   }
     * })
     * 
    **/
    delete<T extends DominioValorDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DominioValorDeleteArgs<ExtArgs>>
    ): Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one DominioValor.
     * @param {DominioValorUpdateArgs} args - Arguments to update one DominioValor.
     * @example
     * // Update one DominioValor
     * const dominioValor = await prisma.dominioValor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DominioValorUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DominioValorUpdateArgs<ExtArgs>>
    ): Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more DominioValors.
     * @param {DominioValorDeleteManyArgs} args - Arguments to filter DominioValors to delete.
     * @example
     * // Delete a few DominioValors
     * const { count } = await prisma.dominioValor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DominioValorDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DominioValorDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DominioValors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioValorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DominioValors
     * const dominioValor = await prisma.dominioValor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DominioValorUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DominioValorUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DominioValor.
     * @param {DominioValorUpsertArgs} args - Arguments to update or create a DominioValor.
     * @example
     * // Update or create a DominioValor
     * const dominioValor = await prisma.dominioValor.upsert({
     *   create: {
     *     // ... data to create a DominioValor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DominioValor we want to update
     *   }
     * })
    **/
    upsert<T extends DominioValorUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DominioValorUpsertArgs<ExtArgs>>
    ): Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of DominioValors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioValorCountArgs} args - Arguments to filter DominioValors to count.
     * @example
     * // Count the number of DominioValors
     * const count = await prisma.dominioValor.count({
     *   where: {
     *     // ... the filter for the DominioValors we want to count
     *   }
     * })
    **/
    count<T extends DominioValorCountArgs>(
      args?: Subset<T, DominioValorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DominioValorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DominioValor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioValorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DominioValorAggregateArgs>(args: Subset<T, DominioValorAggregateArgs>): Prisma.PrismaPromise<GetDominioValorAggregateType<T>>

    /**
     * Group by DominioValor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DominioValorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DominioValorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DominioValorGroupByArgs['orderBy'] }
        : { orderBy?: DominioValorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DominioValorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDominioValorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for DominioValor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__DominioValorClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    dominio<T extends DominioArgs<ExtArgs> = {}>(args?: Subset<T, DominioArgs<ExtArgs>>): Prisma__DominioClient<$Types.GetResult<DominioPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    parent<T extends DominioValorArgs<ExtArgs> = {}>(args?: Subset<T, DominioValorArgs<ExtArgs>>): Prisma__DominioValorClient<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    children<T extends DominioValor$childrenArgs<ExtArgs> = {}>(args?: Subset<T, DominioValor$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<DominioValorPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * DominioValor base type for findUnique actions
   */
  export type DominioValorFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * Filter, which DominioValor to fetch.
     */
    where: DominioValorWhereUniqueInput
  }

  /**
   * DominioValor findUnique
   */
  export interface DominioValorFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends DominioValorFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * DominioValor findUniqueOrThrow
   */
  export type DominioValorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * Filter, which DominioValor to fetch.
     */
    where: DominioValorWhereUniqueInput
  }


  /**
   * DominioValor base type for findFirst actions
   */
  export type DominioValorFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * Filter, which DominioValor to fetch.
     */
    where?: DominioValorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DominioValors to fetch.
     */
    orderBy?: Enumerable<DominioValorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DominioValors.
     */
    cursor?: DominioValorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DominioValors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DominioValors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DominioValors.
     */
    distinct?: Enumerable<DominioValorScalarFieldEnum>
  }

  /**
   * DominioValor findFirst
   */
  export interface DominioValorFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends DominioValorFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * DominioValor findFirstOrThrow
   */
  export type DominioValorFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * Filter, which DominioValor to fetch.
     */
    where?: DominioValorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DominioValors to fetch.
     */
    orderBy?: Enumerable<DominioValorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DominioValors.
     */
    cursor?: DominioValorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DominioValors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DominioValors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DominioValors.
     */
    distinct?: Enumerable<DominioValorScalarFieldEnum>
  }


  /**
   * DominioValor findMany
   */
  export type DominioValorFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * Filter, which DominioValors to fetch.
     */
    where?: DominioValorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DominioValors to fetch.
     */
    orderBy?: Enumerable<DominioValorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DominioValors.
     */
    cursor?: DominioValorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DominioValors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DominioValors.
     */
    skip?: number
    distinct?: Enumerable<DominioValorScalarFieldEnum>
  }


  /**
   * DominioValor create
   */
  export type DominioValorCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * The data needed to create a DominioValor.
     */
    data: XOR<DominioValorCreateInput, DominioValorUncheckedCreateInput>
  }


  /**
   * DominioValor createMany
   */
  export type DominioValorCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DominioValors.
     */
    data: Enumerable<DominioValorCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * DominioValor update
   */
  export type DominioValorUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * The data needed to update a DominioValor.
     */
    data: XOR<DominioValorUpdateInput, DominioValorUncheckedUpdateInput>
    /**
     * Choose, which DominioValor to update.
     */
    where: DominioValorWhereUniqueInput
  }


  /**
   * DominioValor updateMany
   */
  export type DominioValorUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DominioValors.
     */
    data: XOR<DominioValorUpdateManyMutationInput, DominioValorUncheckedUpdateManyInput>
    /**
     * Filter which DominioValors to update
     */
    where?: DominioValorWhereInput
  }


  /**
   * DominioValor upsert
   */
  export type DominioValorUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * The filter to search for the DominioValor to update in case it exists.
     */
    where: DominioValorWhereUniqueInput
    /**
     * In case the DominioValor found by the `where` argument doesn't exist, create a new DominioValor with this data.
     */
    create: XOR<DominioValorCreateInput, DominioValorUncheckedCreateInput>
    /**
     * In case the DominioValor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DominioValorUpdateInput, DominioValorUncheckedUpdateInput>
  }


  /**
   * DominioValor delete
   */
  export type DominioValorDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    /**
     * Filter which DominioValor to delete.
     */
    where: DominioValorWhereUniqueInput
  }


  /**
   * DominioValor deleteMany
   */
  export type DominioValorDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which DominioValors to delete
     */
    where?: DominioValorWhereInput
  }


  /**
   * DominioValor.children
   */
  export type DominioValor$childrenArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
    where?: DominioValorWhereInput
    orderBy?: Enumerable<DominioValorOrderByWithRelationInput>
    cursor?: DominioValorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<DominioValorScalarFieldEnum>
  }


  /**
   * DominioValor without action
   */
  export type DominioValorArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DominioValor
     */
    select?: DominioValorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DominioValorInclude<ExtArgs> | null
  }



  /**
   * Model Orgao
   */


  export type AggregateOrgao = {
    _count: OrgaoCountAggregateOutputType | null
    _min: OrgaoMinAggregateOutputType | null
    _max: OrgaoMaxAggregateOutputType | null
  }

  export type OrgaoMinAggregateOutputType = {
    id: string | null
    sigla: string | null
    nome: string | null
    tipo: TipoOrgao | null
    ativo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrgaoMaxAggregateOutputType = {
    id: string | null
    sigla: string | null
    nome: string | null
    tipo: TipoOrgao | null
    ativo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrgaoCountAggregateOutputType = {
    id: number
    sigla: number
    nome: number
    tipo: number
    ativo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrgaoMinAggregateInputType = {
    id?: true
    sigla?: true
    nome?: true
    tipo?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrgaoMaxAggregateInputType = {
    id?: true
    sigla?: true
    nome?: true
    tipo?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrgaoCountAggregateInputType = {
    id?: true
    sigla?: true
    nome?: true
    tipo?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrgaoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orgao to aggregate.
     */
    where?: OrgaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orgaos to fetch.
     */
    orderBy?: Enumerable<OrgaoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrgaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orgaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orgaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orgaos
    **/
    _count?: true | OrgaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrgaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrgaoMaxAggregateInputType
  }

  export type GetOrgaoAggregateType<T extends OrgaoAggregateArgs> = {
        [P in keyof T & keyof AggregateOrgao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrgao[P]>
      : GetScalarType<T[P], AggregateOrgao[P]>
  }




  export type OrgaoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: OrgaoWhereInput
    orderBy?: Enumerable<OrgaoOrderByWithAggregationInput>
    by: OrgaoScalarFieldEnum[]
    having?: OrgaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrgaoCountAggregateInputType | true
    _min?: OrgaoMinAggregateInputType
    _max?: OrgaoMaxAggregateInputType
  }


  export type OrgaoGroupByOutputType = {
    id: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo: boolean
    createdAt: Date
    updatedAt: Date
    _count: OrgaoCountAggregateOutputType | null
    _min: OrgaoMinAggregateOutputType | null
    _max: OrgaoMaxAggregateOutputType | null
  }

  type GetOrgaoGroupByPayload<T extends OrgaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<OrgaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrgaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrgaoGroupByOutputType[P]>
            : GetScalarType<T[P], OrgaoGroupByOutputType[P]>
        }
      >
    >


  export type OrgaoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sigla?: boolean
    nome?: boolean
    tipo?: boolean
    ativo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    unidades?: boolean | Orgao$unidadesArgs<ExtArgs>
    servidores?: boolean | Orgao$servidoresArgs<ExtArgs>
    _count?: boolean | OrgaoCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["orgao"]>

  export type OrgaoSelectScalar = {
    id?: boolean
    sigla?: boolean
    nome?: boolean
    tipo?: boolean
    ativo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrgaoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    unidades?: boolean | Orgao$unidadesArgs<ExtArgs>
    servidores?: boolean | Orgao$servidoresArgs<ExtArgs>
    _count?: boolean | OrgaoCountOutputTypeArgs<ExtArgs>
  }


  type OrgaoGetPayload<S extends boolean | null | undefined | OrgaoArgs> = $Types.GetResult<OrgaoPayload, S>

  type OrgaoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<OrgaoFindManyArgs, 'select' | 'include'> & {
      select?: OrgaoCountAggregateInputType | true
    }

  export interface OrgaoDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Orgao'], meta: { name: 'Orgao' } }
    /**
     * Find zero or one Orgao that matches the filter.
     * @param {OrgaoFindUniqueArgs} args - Arguments to find a Orgao
     * @example
     * // Get one Orgao
     * const orgao = await prisma.orgao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends OrgaoFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, OrgaoFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Orgao'> extends True ? Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Orgao that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {OrgaoFindUniqueOrThrowArgs} args - Arguments to find a Orgao
     * @example
     * // Get one Orgao
     * const orgao = await prisma.orgao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends OrgaoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, OrgaoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Orgao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgaoFindFirstArgs} args - Arguments to find a Orgao
     * @example
     * // Get one Orgao
     * const orgao = await prisma.orgao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends OrgaoFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, OrgaoFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Orgao'> extends True ? Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Orgao that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgaoFindFirstOrThrowArgs} args - Arguments to find a Orgao
     * @example
     * // Get one Orgao
     * const orgao = await prisma.orgao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends OrgaoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, OrgaoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Orgaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgaoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orgaos
     * const orgaos = await prisma.orgao.findMany()
     * 
     * // Get first 10 Orgaos
     * const orgaos = await prisma.orgao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orgaoWithIdOnly = await prisma.orgao.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends OrgaoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, OrgaoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Orgao.
     * @param {OrgaoCreateArgs} args - Arguments to create a Orgao.
     * @example
     * // Create one Orgao
     * const Orgao = await prisma.orgao.create({
     *   data: {
     *     // ... data to create a Orgao
     *   }
     * })
     * 
    **/
    create<T extends OrgaoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, OrgaoCreateArgs<ExtArgs>>
    ): Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Orgaos.
     *     @param {OrgaoCreateManyArgs} args - Arguments to create many Orgaos.
     *     @example
     *     // Create many Orgaos
     *     const orgao = await prisma.orgao.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends OrgaoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, OrgaoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Orgao.
     * @param {OrgaoDeleteArgs} args - Arguments to delete one Orgao.
     * @example
     * // Delete one Orgao
     * const Orgao = await prisma.orgao.delete({
     *   where: {
     *     // ... filter to delete one Orgao
     *   }
     * })
     * 
    **/
    delete<T extends OrgaoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, OrgaoDeleteArgs<ExtArgs>>
    ): Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Orgao.
     * @param {OrgaoUpdateArgs} args - Arguments to update one Orgao.
     * @example
     * // Update one Orgao
     * const orgao = await prisma.orgao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends OrgaoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, OrgaoUpdateArgs<ExtArgs>>
    ): Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Orgaos.
     * @param {OrgaoDeleteManyArgs} args - Arguments to filter Orgaos to delete.
     * @example
     * // Delete a few Orgaos
     * const { count } = await prisma.orgao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends OrgaoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, OrgaoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orgaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orgaos
     * const orgao = await prisma.orgao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends OrgaoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, OrgaoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Orgao.
     * @param {OrgaoUpsertArgs} args - Arguments to update or create a Orgao.
     * @example
     * // Update or create a Orgao
     * const orgao = await prisma.orgao.upsert({
     *   create: {
     *     // ... data to create a Orgao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Orgao we want to update
     *   }
     * })
    **/
    upsert<T extends OrgaoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, OrgaoUpsertArgs<ExtArgs>>
    ): Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Orgaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgaoCountArgs} args - Arguments to filter Orgaos to count.
     * @example
     * // Count the number of Orgaos
     * const count = await prisma.orgao.count({
     *   where: {
     *     // ... the filter for the Orgaos we want to count
     *   }
     * })
    **/
    count<T extends OrgaoCountArgs>(
      args?: Subset<T, OrgaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrgaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Orgao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrgaoAggregateArgs>(args: Subset<T, OrgaoAggregateArgs>): Prisma.PrismaPromise<GetOrgaoAggregateType<T>>

    /**
     * Group by Orgao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrgaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrgaoGroupByArgs['orderBy'] }
        : { orderBy?: OrgaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrgaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrgaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Orgao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__OrgaoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    unidades<T extends Orgao$unidadesArgs<ExtArgs> = {}>(args?: Subset<T, Orgao$unidadesArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findMany', never>| Null>;

    servidores<T extends Orgao$servidoresArgs<ExtArgs> = {}>(args?: Subset<T, Orgao$servidoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Orgao base type for findUnique actions
   */
  export type OrgaoFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * Filter, which Orgao to fetch.
     */
    where: OrgaoWhereUniqueInput
  }

  /**
   * Orgao findUnique
   */
  export interface OrgaoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends OrgaoFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Orgao findUniqueOrThrow
   */
  export type OrgaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * Filter, which Orgao to fetch.
     */
    where: OrgaoWhereUniqueInput
  }


  /**
   * Orgao base type for findFirst actions
   */
  export type OrgaoFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * Filter, which Orgao to fetch.
     */
    where?: OrgaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orgaos to fetch.
     */
    orderBy?: Enumerable<OrgaoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orgaos.
     */
    cursor?: OrgaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orgaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orgaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orgaos.
     */
    distinct?: Enumerable<OrgaoScalarFieldEnum>
  }

  /**
   * Orgao findFirst
   */
  export interface OrgaoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends OrgaoFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Orgao findFirstOrThrow
   */
  export type OrgaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * Filter, which Orgao to fetch.
     */
    where?: OrgaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orgaos to fetch.
     */
    orderBy?: Enumerable<OrgaoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orgaos.
     */
    cursor?: OrgaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orgaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orgaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orgaos.
     */
    distinct?: Enumerable<OrgaoScalarFieldEnum>
  }


  /**
   * Orgao findMany
   */
  export type OrgaoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * Filter, which Orgaos to fetch.
     */
    where?: OrgaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orgaos to fetch.
     */
    orderBy?: Enumerable<OrgaoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orgaos.
     */
    cursor?: OrgaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orgaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orgaos.
     */
    skip?: number
    distinct?: Enumerable<OrgaoScalarFieldEnum>
  }


  /**
   * Orgao create
   */
  export type OrgaoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * The data needed to create a Orgao.
     */
    data: XOR<OrgaoCreateInput, OrgaoUncheckedCreateInput>
  }


  /**
   * Orgao createMany
   */
  export type OrgaoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orgaos.
     */
    data: Enumerable<OrgaoCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Orgao update
   */
  export type OrgaoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * The data needed to update a Orgao.
     */
    data: XOR<OrgaoUpdateInput, OrgaoUncheckedUpdateInput>
    /**
     * Choose, which Orgao to update.
     */
    where: OrgaoWhereUniqueInput
  }


  /**
   * Orgao updateMany
   */
  export type OrgaoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orgaos.
     */
    data: XOR<OrgaoUpdateManyMutationInput, OrgaoUncheckedUpdateManyInput>
    /**
     * Filter which Orgaos to update
     */
    where?: OrgaoWhereInput
  }


  /**
   * Orgao upsert
   */
  export type OrgaoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * The filter to search for the Orgao to update in case it exists.
     */
    where: OrgaoWhereUniqueInput
    /**
     * In case the Orgao found by the `where` argument doesn't exist, create a new Orgao with this data.
     */
    create: XOR<OrgaoCreateInput, OrgaoUncheckedCreateInput>
    /**
     * In case the Orgao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrgaoUpdateInput, OrgaoUncheckedUpdateInput>
  }


  /**
   * Orgao delete
   */
  export type OrgaoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
    /**
     * Filter which Orgao to delete.
     */
    where: OrgaoWhereUniqueInput
  }


  /**
   * Orgao deleteMany
   */
  export type OrgaoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orgaos to delete
     */
    where?: OrgaoWhereInput
  }


  /**
   * Orgao.unidades
   */
  export type Orgao$unidadesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    where?: UnidadeOrganizacionalWhereInput
    orderBy?: Enumerable<UnidadeOrganizacionalOrderByWithRelationInput>
    cursor?: UnidadeOrganizacionalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<UnidadeOrganizacionalScalarFieldEnum>
  }


  /**
   * Orgao.servidores
   */
  export type Orgao$servidoresArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    where?: ServidorWhereInput
    orderBy?: Enumerable<ServidorOrderByWithRelationInput>
    cursor?: ServidorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<ServidorScalarFieldEnum>
  }


  /**
   * Orgao without action
   */
  export type OrgaoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Orgao
     */
    select?: OrgaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: OrgaoInclude<ExtArgs> | null
  }



  /**
   * Model UnidadeOrganizacional
   */


  export type AggregateUnidadeOrganizacional = {
    _count: UnidadeOrganizacionalCountAggregateOutputType | null
    _min: UnidadeOrganizacionalMinAggregateOutputType | null
    _max: UnidadeOrganizacionalMaxAggregateOutputType | null
  }

  export type UnidadeOrganizacionalMinAggregateOutputType = {
    id: string | null
    orgaoId: string | null
    parentId: string | null
    sigla: string | null
    nome: string | null
    nivel: NivelUnidade | null
    municipioId: string | null
    ativo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UnidadeOrganizacionalMaxAggregateOutputType = {
    id: string | null
    orgaoId: string | null
    parentId: string | null
    sigla: string | null
    nome: string | null
    nivel: NivelUnidade | null
    municipioId: string | null
    ativo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UnidadeOrganizacionalCountAggregateOutputType = {
    id: number
    orgaoId: number
    parentId: number
    sigla: number
    nome: number
    nivel: number
    municipioId: number
    ativo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UnidadeOrganizacionalMinAggregateInputType = {
    id?: true
    orgaoId?: true
    parentId?: true
    sigla?: true
    nome?: true
    nivel?: true
    municipioId?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UnidadeOrganizacionalMaxAggregateInputType = {
    id?: true
    orgaoId?: true
    parentId?: true
    sigla?: true
    nome?: true
    nivel?: true
    municipioId?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UnidadeOrganizacionalCountAggregateInputType = {
    id?: true
    orgaoId?: true
    parentId?: true
    sigla?: true
    nome?: true
    nivel?: true
    municipioId?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UnidadeOrganizacionalAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnidadeOrganizacional to aggregate.
     */
    where?: UnidadeOrganizacionalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeOrganizacionals to fetch.
     */
    orderBy?: Enumerable<UnidadeOrganizacionalOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnidadeOrganizacionalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeOrganizacionals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeOrganizacionals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UnidadeOrganizacionals
    **/
    _count?: true | UnidadeOrganizacionalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnidadeOrganizacionalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnidadeOrganizacionalMaxAggregateInputType
  }

  export type GetUnidadeOrganizacionalAggregateType<T extends UnidadeOrganizacionalAggregateArgs> = {
        [P in keyof T & keyof AggregateUnidadeOrganizacional]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnidadeOrganizacional[P]>
      : GetScalarType<T[P], AggregateUnidadeOrganizacional[P]>
  }




  export type UnidadeOrganizacionalGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: UnidadeOrganizacionalWhereInput
    orderBy?: Enumerable<UnidadeOrganizacionalOrderByWithAggregationInput>
    by: UnidadeOrganizacionalScalarFieldEnum[]
    having?: UnidadeOrganizacionalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnidadeOrganizacionalCountAggregateInputType | true
    _min?: UnidadeOrganizacionalMinAggregateInputType
    _max?: UnidadeOrganizacionalMaxAggregateInputType
  }


  export type UnidadeOrganizacionalGroupByOutputType = {
    id: string
    orgaoId: string
    parentId: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo: boolean
    createdAt: Date
    updatedAt: Date
    _count: UnidadeOrganizacionalCountAggregateOutputType | null
    _min: UnidadeOrganizacionalMinAggregateOutputType | null
    _max: UnidadeOrganizacionalMaxAggregateOutputType | null
  }

  type GetUnidadeOrganizacionalGroupByPayload<T extends UnidadeOrganizacionalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UnidadeOrganizacionalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnidadeOrganizacionalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnidadeOrganizacionalGroupByOutputType[P]>
            : GetScalarType<T[P], UnidadeOrganizacionalGroupByOutputType[P]>
        }
      >
    >


  export type UnidadeOrganizacionalSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgaoId?: boolean
    parentId?: boolean
    sigla?: boolean
    nome?: boolean
    nivel?: boolean
    municipioId?: boolean
    ativo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    orgao?: boolean | OrgaoArgs<ExtArgs>
    parent?: boolean | UnidadeOrganizacionalArgs<ExtArgs>
    children?: boolean | UnidadeOrganizacional$childrenArgs<ExtArgs>
    municipio?: boolean | MunicipioArgs<ExtArgs>
    servidores?: boolean | UnidadeOrganizacional$servidoresArgs<ExtArgs>
    _count?: boolean | UnidadeOrganizacionalCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["unidadeOrganizacional"]>

  export type UnidadeOrganizacionalSelectScalar = {
    id?: boolean
    orgaoId?: boolean
    parentId?: boolean
    sigla?: boolean
    nome?: boolean
    nivel?: boolean
    municipioId?: boolean
    ativo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UnidadeOrganizacionalInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    orgao?: boolean | OrgaoArgs<ExtArgs>
    parent?: boolean | UnidadeOrganizacionalArgs<ExtArgs>
    children?: boolean | UnidadeOrganizacional$childrenArgs<ExtArgs>
    municipio?: boolean | MunicipioArgs<ExtArgs>
    servidores?: boolean | UnidadeOrganizacional$servidoresArgs<ExtArgs>
    _count?: boolean | UnidadeOrganizacionalCountOutputTypeArgs<ExtArgs>
  }


  type UnidadeOrganizacionalGetPayload<S extends boolean | null | undefined | UnidadeOrganizacionalArgs> = $Types.GetResult<UnidadeOrganizacionalPayload, S>

  type UnidadeOrganizacionalCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<UnidadeOrganizacionalFindManyArgs, 'select' | 'include'> & {
      select?: UnidadeOrganizacionalCountAggregateInputType | true
    }

  export interface UnidadeOrganizacionalDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UnidadeOrganizacional'], meta: { name: 'UnidadeOrganizacional' } }
    /**
     * Find zero or one UnidadeOrganizacional that matches the filter.
     * @param {UnidadeOrganizacionalFindUniqueArgs} args - Arguments to find a UnidadeOrganizacional
     * @example
     * // Get one UnidadeOrganizacional
     * const unidadeOrganizacional = await prisma.unidadeOrganizacional.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UnidadeOrganizacionalFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UnidadeOrganizacionalFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UnidadeOrganizacional'> extends True ? Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one UnidadeOrganizacional that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UnidadeOrganizacionalFindUniqueOrThrowArgs} args - Arguments to find a UnidadeOrganizacional
     * @example
     * // Get one UnidadeOrganizacional
     * const unidadeOrganizacional = await prisma.unidadeOrganizacional.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UnidadeOrganizacionalFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeOrganizacionalFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first UnidadeOrganizacional that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeOrganizacionalFindFirstArgs} args - Arguments to find a UnidadeOrganizacional
     * @example
     * // Get one UnidadeOrganizacional
     * const unidadeOrganizacional = await prisma.unidadeOrganizacional.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UnidadeOrganizacionalFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UnidadeOrganizacionalFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UnidadeOrganizacional'> extends True ? Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first UnidadeOrganizacional that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeOrganizacionalFindFirstOrThrowArgs} args - Arguments to find a UnidadeOrganizacional
     * @example
     * // Get one UnidadeOrganizacional
     * const unidadeOrganizacional = await prisma.unidadeOrganizacional.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UnidadeOrganizacionalFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeOrganizacionalFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more UnidadeOrganizacionals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeOrganizacionalFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UnidadeOrganizacionals
     * const unidadeOrganizacionals = await prisma.unidadeOrganizacional.findMany()
     * 
     * // Get first 10 UnidadeOrganizacionals
     * const unidadeOrganizacionals = await prisma.unidadeOrganizacional.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unidadeOrganizacionalWithIdOnly = await prisma.unidadeOrganizacional.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UnidadeOrganizacionalFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeOrganizacionalFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a UnidadeOrganizacional.
     * @param {UnidadeOrganizacionalCreateArgs} args - Arguments to create a UnidadeOrganizacional.
     * @example
     * // Create one UnidadeOrganizacional
     * const UnidadeOrganizacional = await prisma.unidadeOrganizacional.create({
     *   data: {
     *     // ... data to create a UnidadeOrganizacional
     *   }
     * })
     * 
    **/
    create<T extends UnidadeOrganizacionalCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeOrganizacionalCreateArgs<ExtArgs>>
    ): Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many UnidadeOrganizacionals.
     *     @param {UnidadeOrganizacionalCreateManyArgs} args - Arguments to create many UnidadeOrganizacionals.
     *     @example
     *     // Create many UnidadeOrganizacionals
     *     const unidadeOrganizacional = await prisma.unidadeOrganizacional.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UnidadeOrganizacionalCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeOrganizacionalCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UnidadeOrganizacional.
     * @param {UnidadeOrganizacionalDeleteArgs} args - Arguments to delete one UnidadeOrganizacional.
     * @example
     * // Delete one UnidadeOrganizacional
     * const UnidadeOrganizacional = await prisma.unidadeOrganizacional.delete({
     *   where: {
     *     // ... filter to delete one UnidadeOrganizacional
     *   }
     * })
     * 
    **/
    delete<T extends UnidadeOrganizacionalDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeOrganizacionalDeleteArgs<ExtArgs>>
    ): Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one UnidadeOrganizacional.
     * @param {UnidadeOrganizacionalUpdateArgs} args - Arguments to update one UnidadeOrganizacional.
     * @example
     * // Update one UnidadeOrganizacional
     * const unidadeOrganizacional = await prisma.unidadeOrganizacional.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UnidadeOrganizacionalUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeOrganizacionalUpdateArgs<ExtArgs>>
    ): Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more UnidadeOrganizacionals.
     * @param {UnidadeOrganizacionalDeleteManyArgs} args - Arguments to filter UnidadeOrganizacionals to delete.
     * @example
     * // Delete a few UnidadeOrganizacionals
     * const { count } = await prisma.unidadeOrganizacional.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UnidadeOrganizacionalDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UnidadeOrganizacionalDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnidadeOrganizacionals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeOrganizacionalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UnidadeOrganizacionals
     * const unidadeOrganizacional = await prisma.unidadeOrganizacional.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UnidadeOrganizacionalUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeOrganizacionalUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UnidadeOrganizacional.
     * @param {UnidadeOrganizacionalUpsertArgs} args - Arguments to update or create a UnidadeOrganizacional.
     * @example
     * // Update or create a UnidadeOrganizacional
     * const unidadeOrganizacional = await prisma.unidadeOrganizacional.upsert({
     *   create: {
     *     // ... data to create a UnidadeOrganizacional
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UnidadeOrganizacional we want to update
     *   }
     * })
    **/
    upsert<T extends UnidadeOrganizacionalUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UnidadeOrganizacionalUpsertArgs<ExtArgs>>
    ): Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of UnidadeOrganizacionals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeOrganizacionalCountArgs} args - Arguments to filter UnidadeOrganizacionals to count.
     * @example
     * // Count the number of UnidadeOrganizacionals
     * const count = await prisma.unidadeOrganizacional.count({
     *   where: {
     *     // ... the filter for the UnidadeOrganizacionals we want to count
     *   }
     * })
    **/
    count<T extends UnidadeOrganizacionalCountArgs>(
      args?: Subset<T, UnidadeOrganizacionalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnidadeOrganizacionalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UnidadeOrganizacional.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeOrganizacionalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UnidadeOrganizacionalAggregateArgs>(args: Subset<T, UnidadeOrganizacionalAggregateArgs>): Prisma.PrismaPromise<GetUnidadeOrganizacionalAggregateType<T>>

    /**
     * Group by UnidadeOrganizacional.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadeOrganizacionalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UnidadeOrganizacionalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnidadeOrganizacionalGroupByArgs['orderBy'] }
        : { orderBy?: UnidadeOrganizacionalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UnidadeOrganizacionalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnidadeOrganizacionalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UnidadeOrganizacional.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UnidadeOrganizacionalClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    orgao<T extends OrgaoArgs<ExtArgs> = {}>(args?: Subset<T, OrgaoArgs<ExtArgs>>): Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    parent<T extends UnidadeOrganizacionalArgs<ExtArgs> = {}>(args?: Subset<T, UnidadeOrganizacionalArgs<ExtArgs>>): Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    children<T extends UnidadeOrganizacional$childrenArgs<ExtArgs> = {}>(args?: Subset<T, UnidadeOrganizacional$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findMany', never>| Null>;

    municipio<T extends MunicipioArgs<ExtArgs> = {}>(args?: Subset<T, MunicipioArgs<ExtArgs>>): Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    servidores<T extends UnidadeOrganizacional$servidoresArgs<ExtArgs> = {}>(args?: Subset<T, UnidadeOrganizacional$servidoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UnidadeOrganizacional base type for findUnique actions
   */
  export type UnidadeOrganizacionalFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeOrganizacional to fetch.
     */
    where: UnidadeOrganizacionalWhereUniqueInput
  }

  /**
   * UnidadeOrganizacional findUnique
   */
  export interface UnidadeOrganizacionalFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends UnidadeOrganizacionalFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UnidadeOrganizacional findUniqueOrThrow
   */
  export type UnidadeOrganizacionalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeOrganizacional to fetch.
     */
    where: UnidadeOrganizacionalWhereUniqueInput
  }


  /**
   * UnidadeOrganizacional base type for findFirst actions
   */
  export type UnidadeOrganizacionalFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeOrganizacional to fetch.
     */
    where?: UnidadeOrganizacionalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeOrganizacionals to fetch.
     */
    orderBy?: Enumerable<UnidadeOrganizacionalOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnidadeOrganizacionals.
     */
    cursor?: UnidadeOrganizacionalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeOrganizacionals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeOrganizacionals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnidadeOrganizacionals.
     */
    distinct?: Enumerable<UnidadeOrganizacionalScalarFieldEnum>
  }

  /**
   * UnidadeOrganizacional findFirst
   */
  export interface UnidadeOrganizacionalFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends UnidadeOrganizacionalFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UnidadeOrganizacional findFirstOrThrow
   */
  export type UnidadeOrganizacionalFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeOrganizacional to fetch.
     */
    where?: UnidadeOrganizacionalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeOrganizacionals to fetch.
     */
    orderBy?: Enumerable<UnidadeOrganizacionalOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnidadeOrganizacionals.
     */
    cursor?: UnidadeOrganizacionalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeOrganizacionals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeOrganizacionals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnidadeOrganizacionals.
     */
    distinct?: Enumerable<UnidadeOrganizacionalScalarFieldEnum>
  }


  /**
   * UnidadeOrganizacional findMany
   */
  export type UnidadeOrganizacionalFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * Filter, which UnidadeOrganizacionals to fetch.
     */
    where?: UnidadeOrganizacionalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnidadeOrganizacionals to fetch.
     */
    orderBy?: Enumerable<UnidadeOrganizacionalOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UnidadeOrganizacionals.
     */
    cursor?: UnidadeOrganizacionalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnidadeOrganizacionals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnidadeOrganizacionals.
     */
    skip?: number
    distinct?: Enumerable<UnidadeOrganizacionalScalarFieldEnum>
  }


  /**
   * UnidadeOrganizacional create
   */
  export type UnidadeOrganizacionalCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * The data needed to create a UnidadeOrganizacional.
     */
    data: XOR<UnidadeOrganizacionalCreateInput, UnidadeOrganizacionalUncheckedCreateInput>
  }


  /**
   * UnidadeOrganizacional createMany
   */
  export type UnidadeOrganizacionalCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UnidadeOrganizacionals.
     */
    data: Enumerable<UnidadeOrganizacionalCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UnidadeOrganizacional update
   */
  export type UnidadeOrganizacionalUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * The data needed to update a UnidadeOrganizacional.
     */
    data: XOR<UnidadeOrganizacionalUpdateInput, UnidadeOrganizacionalUncheckedUpdateInput>
    /**
     * Choose, which UnidadeOrganizacional to update.
     */
    where: UnidadeOrganizacionalWhereUniqueInput
  }


  /**
   * UnidadeOrganizacional updateMany
   */
  export type UnidadeOrganizacionalUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UnidadeOrganizacionals.
     */
    data: XOR<UnidadeOrganizacionalUpdateManyMutationInput, UnidadeOrganizacionalUncheckedUpdateManyInput>
    /**
     * Filter which UnidadeOrganizacionals to update
     */
    where?: UnidadeOrganizacionalWhereInput
  }


  /**
   * UnidadeOrganizacional upsert
   */
  export type UnidadeOrganizacionalUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * The filter to search for the UnidadeOrganizacional to update in case it exists.
     */
    where: UnidadeOrganizacionalWhereUniqueInput
    /**
     * In case the UnidadeOrganizacional found by the `where` argument doesn't exist, create a new UnidadeOrganizacional with this data.
     */
    create: XOR<UnidadeOrganizacionalCreateInput, UnidadeOrganizacionalUncheckedCreateInput>
    /**
     * In case the UnidadeOrganizacional was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnidadeOrganizacionalUpdateInput, UnidadeOrganizacionalUncheckedUpdateInput>
  }


  /**
   * UnidadeOrganizacional delete
   */
  export type UnidadeOrganizacionalDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    /**
     * Filter which UnidadeOrganizacional to delete.
     */
    where: UnidadeOrganizacionalWhereUniqueInput
  }


  /**
   * UnidadeOrganizacional deleteMany
   */
  export type UnidadeOrganizacionalDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnidadeOrganizacionals to delete
     */
    where?: UnidadeOrganizacionalWhereInput
  }


  /**
   * UnidadeOrganizacional.children
   */
  export type UnidadeOrganizacional$childrenArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
    where?: UnidadeOrganizacionalWhereInput
    orderBy?: Enumerable<UnidadeOrganizacionalOrderByWithRelationInput>
    cursor?: UnidadeOrganizacionalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<UnidadeOrganizacionalScalarFieldEnum>
  }


  /**
   * UnidadeOrganizacional.servidores
   */
  export type UnidadeOrganizacional$servidoresArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    where?: ServidorWhereInput
    orderBy?: Enumerable<ServidorOrderByWithRelationInput>
    cursor?: ServidorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<ServidorScalarFieldEnum>
  }


  /**
   * UnidadeOrganizacional without action
   */
  export type UnidadeOrganizacionalArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadeOrganizacional
     */
    select?: UnidadeOrganizacionalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UnidadeOrganizacionalInclude<ExtArgs> | null
  }



  /**
   * Model Fornecedor
   */


  export type AggregateFornecedor = {
    _count: FornecedorCountAggregateOutputType | null
    _min: FornecedorMinAggregateOutputType | null
    _max: FornecedorMaxAggregateOutputType | null
  }

  export type FornecedorMinAggregateOutputType = {
    id: string | null
    tipoPessoa: TipoPessoa | null
    documento: string | null
    razaoSocial: string | null
    nomeFantasia: string | null
    inscricaoEstadual: string | null
    porte: PorteEmpresa | null
    municipioId: string | null
    situacao: SituacaoFornecedor | null
    codigoLegado: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FornecedorMaxAggregateOutputType = {
    id: string | null
    tipoPessoa: TipoPessoa | null
    documento: string | null
    razaoSocial: string | null
    nomeFantasia: string | null
    inscricaoEstadual: string | null
    porte: PorteEmpresa | null
    municipioId: string | null
    situacao: SituacaoFornecedor | null
    codigoLegado: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FornecedorCountAggregateOutputType = {
    id: number
    tipoPessoa: number
    documento: number
    razaoSocial: number
    nomeFantasia: number
    inscricaoEstadual: number
    porte: number
    municipioId: number
    situacao: number
    codigoLegado: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FornecedorMinAggregateInputType = {
    id?: true
    tipoPessoa?: true
    documento?: true
    razaoSocial?: true
    nomeFantasia?: true
    inscricaoEstadual?: true
    porte?: true
    municipioId?: true
    situacao?: true
    codigoLegado?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FornecedorMaxAggregateInputType = {
    id?: true
    tipoPessoa?: true
    documento?: true
    razaoSocial?: true
    nomeFantasia?: true
    inscricaoEstadual?: true
    porte?: true
    municipioId?: true
    situacao?: true
    codigoLegado?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FornecedorCountAggregateInputType = {
    id?: true
    tipoPessoa?: true
    documento?: true
    razaoSocial?: true
    nomeFantasia?: true
    inscricaoEstadual?: true
    porte?: true
    municipioId?: true
    situacao?: true
    codigoLegado?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FornecedorAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Fornecedor to aggregate.
     */
    where?: FornecedorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fornecedors to fetch.
     */
    orderBy?: Enumerable<FornecedorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FornecedorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fornecedors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fornecedors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Fornecedors
    **/
    _count?: true | FornecedorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FornecedorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FornecedorMaxAggregateInputType
  }

  export type GetFornecedorAggregateType<T extends FornecedorAggregateArgs> = {
        [P in keyof T & keyof AggregateFornecedor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFornecedor[P]>
      : GetScalarType<T[P], AggregateFornecedor[P]>
  }




  export type FornecedorGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: FornecedorWhereInput
    orderBy?: Enumerable<FornecedorOrderByWithAggregationInput>
    by: FornecedorScalarFieldEnum[]
    having?: FornecedorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FornecedorCountAggregateInputType | true
    _min?: FornecedorMinAggregateInputType
    _max?: FornecedorMaxAggregateInputType
  }


  export type FornecedorGroupByOutputType = {
    id: string
    tipoPessoa: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia: string | null
    inscricaoEstadual: string | null
    porte: PorteEmpresa | null
    municipioId: string | null
    situacao: SituacaoFornecedor
    codigoLegado: string | null
    createdAt: Date
    updatedAt: Date
    _count: FornecedorCountAggregateOutputType | null
    _min: FornecedorMinAggregateOutputType | null
    _max: FornecedorMaxAggregateOutputType | null
  }

  type GetFornecedorGroupByPayload<T extends FornecedorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<FornecedorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FornecedorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FornecedorGroupByOutputType[P]>
            : GetScalarType<T[P], FornecedorGroupByOutputType[P]>
        }
      >
    >


  export type FornecedorSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipoPessoa?: boolean
    documento?: boolean
    razaoSocial?: boolean
    nomeFantasia?: boolean
    inscricaoEstadual?: boolean
    porte?: boolean
    municipioId?: boolean
    situacao?: boolean
    codigoLegado?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    municipio?: boolean | MunicipioArgs<ExtArgs>
    contatos?: boolean | Fornecedor$contatosArgs<ExtArgs>
    sancoes?: boolean | Fornecedor$sancoesArgs<ExtArgs>
    contratos?: boolean | Fornecedor$contratosArgs<ExtArgs>
    _count?: boolean | FornecedorCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["fornecedor"]>

  export type FornecedorSelectScalar = {
    id?: boolean
    tipoPessoa?: boolean
    documento?: boolean
    razaoSocial?: boolean
    nomeFantasia?: boolean
    inscricaoEstadual?: boolean
    porte?: boolean
    municipioId?: boolean
    situacao?: boolean
    codigoLegado?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FornecedorInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    municipio?: boolean | MunicipioArgs<ExtArgs>
    contatos?: boolean | Fornecedor$contatosArgs<ExtArgs>
    sancoes?: boolean | Fornecedor$sancoesArgs<ExtArgs>
    contratos?: boolean | Fornecedor$contratosArgs<ExtArgs>
    _count?: boolean | FornecedorCountOutputTypeArgs<ExtArgs>
  }


  type FornecedorGetPayload<S extends boolean | null | undefined | FornecedorArgs> = $Types.GetResult<FornecedorPayload, S>

  type FornecedorCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<FornecedorFindManyArgs, 'select' | 'include'> & {
      select?: FornecedorCountAggregateInputType | true
    }

  export interface FornecedorDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Fornecedor'], meta: { name: 'Fornecedor' } }
    /**
     * Find zero or one Fornecedor that matches the filter.
     * @param {FornecedorFindUniqueArgs} args - Arguments to find a Fornecedor
     * @example
     * // Get one Fornecedor
     * const fornecedor = await prisma.fornecedor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FornecedorFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, FornecedorFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Fornecedor'> extends True ? Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Fornecedor that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FornecedorFindUniqueOrThrowArgs} args - Arguments to find a Fornecedor
     * @example
     * // Get one Fornecedor
     * const fornecedor = await prisma.fornecedor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FornecedorFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Fornecedor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorFindFirstArgs} args - Arguments to find a Fornecedor
     * @example
     * // Get one Fornecedor
     * const fornecedor = await prisma.fornecedor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FornecedorFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, FornecedorFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Fornecedor'> extends True ? Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Fornecedor that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorFindFirstOrThrowArgs} args - Arguments to find a Fornecedor
     * @example
     * // Get one Fornecedor
     * const fornecedor = await prisma.fornecedor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FornecedorFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Fornecedors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Fornecedors
     * const fornecedors = await prisma.fornecedor.findMany()
     * 
     * // Get first 10 Fornecedors
     * const fornecedors = await prisma.fornecedor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fornecedorWithIdOnly = await prisma.fornecedor.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FornecedorFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Fornecedor.
     * @param {FornecedorCreateArgs} args - Arguments to create a Fornecedor.
     * @example
     * // Create one Fornecedor
     * const Fornecedor = await prisma.fornecedor.create({
     *   data: {
     *     // ... data to create a Fornecedor
     *   }
     * })
     * 
    **/
    create<T extends FornecedorCreateArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorCreateArgs<ExtArgs>>
    ): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Fornecedors.
     *     @param {FornecedorCreateManyArgs} args - Arguments to create many Fornecedors.
     *     @example
     *     // Create many Fornecedors
     *     const fornecedor = await prisma.fornecedor.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FornecedorCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Fornecedor.
     * @param {FornecedorDeleteArgs} args - Arguments to delete one Fornecedor.
     * @example
     * // Delete one Fornecedor
     * const Fornecedor = await prisma.fornecedor.delete({
     *   where: {
     *     // ... filter to delete one Fornecedor
     *   }
     * })
     * 
    **/
    delete<T extends FornecedorDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorDeleteArgs<ExtArgs>>
    ): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Fornecedor.
     * @param {FornecedorUpdateArgs} args - Arguments to update one Fornecedor.
     * @example
     * // Update one Fornecedor
     * const fornecedor = await prisma.fornecedor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FornecedorUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorUpdateArgs<ExtArgs>>
    ): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Fornecedors.
     * @param {FornecedorDeleteManyArgs} args - Arguments to filter Fornecedors to delete.
     * @example
     * // Delete a few Fornecedors
     * const { count } = await prisma.fornecedor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FornecedorDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fornecedors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Fornecedors
     * const fornecedor = await prisma.fornecedor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FornecedorUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Fornecedor.
     * @param {FornecedorUpsertArgs} args - Arguments to update or create a Fornecedor.
     * @example
     * // Update or create a Fornecedor
     * const fornecedor = await prisma.fornecedor.upsert({
     *   create: {
     *     // ... data to create a Fornecedor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Fornecedor we want to update
     *   }
     * })
    **/
    upsert<T extends FornecedorUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorUpsertArgs<ExtArgs>>
    ): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Fornecedors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorCountArgs} args - Arguments to filter Fornecedors to count.
     * @example
     * // Count the number of Fornecedors
     * const count = await prisma.fornecedor.count({
     *   where: {
     *     // ... the filter for the Fornecedors we want to count
     *   }
     * })
    **/
    count<T extends FornecedorCountArgs>(
      args?: Subset<T, FornecedorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FornecedorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Fornecedor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FornecedorAggregateArgs>(args: Subset<T, FornecedorAggregateArgs>): Prisma.PrismaPromise<GetFornecedorAggregateType<T>>

    /**
     * Group by Fornecedor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FornecedorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FornecedorGroupByArgs['orderBy'] }
        : { orderBy?: FornecedorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FornecedorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFornecedorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Fornecedor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__FornecedorClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    municipio<T extends MunicipioArgs<ExtArgs> = {}>(args?: Subset<T, MunicipioArgs<ExtArgs>>): Prisma__MunicipioClient<$Types.GetResult<MunicipioPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    contatos<T extends Fornecedor$contatosArgs<ExtArgs> = {}>(args?: Subset<T, Fornecedor$contatosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    sancoes<T extends Fornecedor$sancoesArgs<ExtArgs> = {}>(args?: Subset<T, Fornecedor$sancoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    contratos<T extends Fornecedor$contratosArgs<ExtArgs> = {}>(args?: Subset<T, Fornecedor$contratosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Fornecedor base type for findUnique actions
   */
  export type FornecedorFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * Filter, which Fornecedor to fetch.
     */
    where: FornecedorWhereUniqueInput
  }

  /**
   * Fornecedor findUnique
   */
  export interface FornecedorFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends FornecedorFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Fornecedor findUniqueOrThrow
   */
  export type FornecedorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * Filter, which Fornecedor to fetch.
     */
    where: FornecedorWhereUniqueInput
  }


  /**
   * Fornecedor base type for findFirst actions
   */
  export type FornecedorFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * Filter, which Fornecedor to fetch.
     */
    where?: FornecedorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fornecedors to fetch.
     */
    orderBy?: Enumerable<FornecedorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Fornecedors.
     */
    cursor?: FornecedorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fornecedors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fornecedors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fornecedors.
     */
    distinct?: Enumerable<FornecedorScalarFieldEnum>
  }

  /**
   * Fornecedor findFirst
   */
  export interface FornecedorFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends FornecedorFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Fornecedor findFirstOrThrow
   */
  export type FornecedorFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * Filter, which Fornecedor to fetch.
     */
    where?: FornecedorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fornecedors to fetch.
     */
    orderBy?: Enumerable<FornecedorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Fornecedors.
     */
    cursor?: FornecedorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fornecedors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fornecedors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fornecedors.
     */
    distinct?: Enumerable<FornecedorScalarFieldEnum>
  }


  /**
   * Fornecedor findMany
   */
  export type FornecedorFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * Filter, which Fornecedors to fetch.
     */
    where?: FornecedorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fornecedors to fetch.
     */
    orderBy?: Enumerable<FornecedorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Fornecedors.
     */
    cursor?: FornecedorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fornecedors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fornecedors.
     */
    skip?: number
    distinct?: Enumerable<FornecedorScalarFieldEnum>
  }


  /**
   * Fornecedor create
   */
  export type FornecedorCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * The data needed to create a Fornecedor.
     */
    data: XOR<FornecedorCreateInput, FornecedorUncheckedCreateInput>
  }


  /**
   * Fornecedor createMany
   */
  export type FornecedorCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Fornecedors.
     */
    data: Enumerable<FornecedorCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Fornecedor update
   */
  export type FornecedorUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * The data needed to update a Fornecedor.
     */
    data: XOR<FornecedorUpdateInput, FornecedorUncheckedUpdateInput>
    /**
     * Choose, which Fornecedor to update.
     */
    where: FornecedorWhereUniqueInput
  }


  /**
   * Fornecedor updateMany
   */
  export type FornecedorUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Fornecedors.
     */
    data: XOR<FornecedorUpdateManyMutationInput, FornecedorUncheckedUpdateManyInput>
    /**
     * Filter which Fornecedors to update
     */
    where?: FornecedorWhereInput
  }


  /**
   * Fornecedor upsert
   */
  export type FornecedorUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * The filter to search for the Fornecedor to update in case it exists.
     */
    where: FornecedorWhereUniqueInput
    /**
     * In case the Fornecedor found by the `where` argument doesn't exist, create a new Fornecedor with this data.
     */
    create: XOR<FornecedorCreateInput, FornecedorUncheckedCreateInput>
    /**
     * In case the Fornecedor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FornecedorUpdateInput, FornecedorUncheckedUpdateInput>
  }


  /**
   * Fornecedor delete
   */
  export type FornecedorDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
    /**
     * Filter which Fornecedor to delete.
     */
    where: FornecedorWhereUniqueInput
  }


  /**
   * Fornecedor deleteMany
   */
  export type FornecedorDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Fornecedors to delete
     */
    where?: FornecedorWhereInput
  }


  /**
   * Fornecedor.contatos
   */
  export type Fornecedor$contatosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    where?: FornecedorContatoWhereInput
    orderBy?: Enumerable<FornecedorContatoOrderByWithRelationInput>
    cursor?: FornecedorContatoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<FornecedorContatoScalarFieldEnum>
  }


  /**
   * Fornecedor.sancoes
   */
  export type Fornecedor$sancoesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    where?: FornecedorSancaoWhereInput
    orderBy?: Enumerable<FornecedorSancaoOrderByWithRelationInput>
    cursor?: FornecedorSancaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<FornecedorSancaoScalarFieldEnum>
  }


  /**
   * Fornecedor.contratos
   */
  export type Fornecedor$contratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    where?: ContratoWhereInput
    orderBy?: Enumerable<ContratoOrderByWithRelationInput>
    cursor?: ContratoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<ContratoScalarFieldEnum>
  }


  /**
   * Fornecedor without action
   */
  export type FornecedorArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorInclude<ExtArgs> | null
  }



  /**
   * Model FornecedorContato
   */


  export type AggregateFornecedorContato = {
    _count: FornecedorContatoCountAggregateOutputType | null
    _min: FornecedorContatoMinAggregateOutputType | null
    _max: FornecedorContatoMaxAggregateOutputType | null
  }

  export type FornecedorContatoMinAggregateOutputType = {
    id: string | null
    fornecedorId: string | null
    nome: string | null
    cargo: string | null
    email: string | null
    telefone: string | null
    principal: boolean | null
    createdAt: Date | null
  }

  export type FornecedorContatoMaxAggregateOutputType = {
    id: string | null
    fornecedorId: string | null
    nome: string | null
    cargo: string | null
    email: string | null
    telefone: string | null
    principal: boolean | null
    createdAt: Date | null
  }

  export type FornecedorContatoCountAggregateOutputType = {
    id: number
    fornecedorId: number
    nome: number
    cargo: number
    email: number
    telefone: number
    principal: number
    createdAt: number
    _all: number
  }


  export type FornecedorContatoMinAggregateInputType = {
    id?: true
    fornecedorId?: true
    nome?: true
    cargo?: true
    email?: true
    telefone?: true
    principal?: true
    createdAt?: true
  }

  export type FornecedorContatoMaxAggregateInputType = {
    id?: true
    fornecedorId?: true
    nome?: true
    cargo?: true
    email?: true
    telefone?: true
    principal?: true
    createdAt?: true
  }

  export type FornecedorContatoCountAggregateInputType = {
    id?: true
    fornecedorId?: true
    nome?: true
    cargo?: true
    email?: true
    telefone?: true
    principal?: true
    createdAt?: true
    _all?: true
  }

  export type FornecedorContatoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which FornecedorContato to aggregate.
     */
    where?: FornecedorContatoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FornecedorContatoes to fetch.
     */
    orderBy?: Enumerable<FornecedorContatoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FornecedorContatoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FornecedorContatoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FornecedorContatoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FornecedorContatoes
    **/
    _count?: true | FornecedorContatoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FornecedorContatoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FornecedorContatoMaxAggregateInputType
  }

  export type GetFornecedorContatoAggregateType<T extends FornecedorContatoAggregateArgs> = {
        [P in keyof T & keyof AggregateFornecedorContato]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFornecedorContato[P]>
      : GetScalarType<T[P], AggregateFornecedorContato[P]>
  }




  export type FornecedorContatoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: FornecedorContatoWhereInput
    orderBy?: Enumerable<FornecedorContatoOrderByWithAggregationInput>
    by: FornecedorContatoScalarFieldEnum[]
    having?: FornecedorContatoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FornecedorContatoCountAggregateInputType | true
    _min?: FornecedorContatoMinAggregateInputType
    _max?: FornecedorContatoMaxAggregateInputType
  }


  export type FornecedorContatoGroupByOutputType = {
    id: string
    fornecedorId: string
    nome: string
    cargo: string | null
    email: string | null
    telefone: string | null
    principal: boolean
    createdAt: Date
    _count: FornecedorContatoCountAggregateOutputType | null
    _min: FornecedorContatoMinAggregateOutputType | null
    _max: FornecedorContatoMaxAggregateOutputType | null
  }

  type GetFornecedorContatoGroupByPayload<T extends FornecedorContatoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<FornecedorContatoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FornecedorContatoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FornecedorContatoGroupByOutputType[P]>
            : GetScalarType<T[P], FornecedorContatoGroupByOutputType[P]>
        }
      >
    >


  export type FornecedorContatoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fornecedorId?: boolean
    nome?: boolean
    cargo?: boolean
    email?: boolean
    telefone?: boolean
    principal?: boolean
    createdAt?: boolean
    fornecedor?: boolean | FornecedorArgs<ExtArgs>
  }, ExtArgs["result"]["fornecedorContato"]>

  export type FornecedorContatoSelectScalar = {
    id?: boolean
    fornecedorId?: boolean
    nome?: boolean
    cargo?: boolean
    email?: boolean
    telefone?: boolean
    principal?: boolean
    createdAt?: boolean
  }

  export type FornecedorContatoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    fornecedor?: boolean | FornecedorArgs<ExtArgs>
  }


  type FornecedorContatoGetPayload<S extends boolean | null | undefined | FornecedorContatoArgs> = $Types.GetResult<FornecedorContatoPayload, S>

  type FornecedorContatoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<FornecedorContatoFindManyArgs, 'select' | 'include'> & {
      select?: FornecedorContatoCountAggregateInputType | true
    }

  export interface FornecedorContatoDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FornecedorContato'], meta: { name: 'FornecedorContato' } }
    /**
     * Find zero or one FornecedorContato that matches the filter.
     * @param {FornecedorContatoFindUniqueArgs} args - Arguments to find a FornecedorContato
     * @example
     * // Get one FornecedorContato
     * const fornecedorContato = await prisma.fornecedorContato.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FornecedorContatoFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, FornecedorContatoFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'FornecedorContato'> extends True ? Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one FornecedorContato that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FornecedorContatoFindUniqueOrThrowArgs} args - Arguments to find a FornecedorContato
     * @example
     * // Get one FornecedorContato
     * const fornecedorContato = await prisma.fornecedorContato.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FornecedorContatoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorContatoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first FornecedorContato that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorContatoFindFirstArgs} args - Arguments to find a FornecedorContato
     * @example
     * // Get one FornecedorContato
     * const fornecedorContato = await prisma.fornecedorContato.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FornecedorContatoFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, FornecedorContatoFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'FornecedorContato'> extends True ? Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first FornecedorContato that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorContatoFindFirstOrThrowArgs} args - Arguments to find a FornecedorContato
     * @example
     * // Get one FornecedorContato
     * const fornecedorContato = await prisma.fornecedorContato.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FornecedorContatoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorContatoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more FornecedorContatoes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorContatoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FornecedorContatoes
     * const fornecedorContatoes = await prisma.fornecedorContato.findMany()
     * 
     * // Get first 10 FornecedorContatoes
     * const fornecedorContatoes = await prisma.fornecedorContato.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fornecedorContatoWithIdOnly = await prisma.fornecedorContato.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FornecedorContatoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorContatoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a FornecedorContato.
     * @param {FornecedorContatoCreateArgs} args - Arguments to create a FornecedorContato.
     * @example
     * // Create one FornecedorContato
     * const FornecedorContato = await prisma.fornecedorContato.create({
     *   data: {
     *     // ... data to create a FornecedorContato
     *   }
     * })
     * 
    **/
    create<T extends FornecedorContatoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorContatoCreateArgs<ExtArgs>>
    ): Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many FornecedorContatoes.
     *     @param {FornecedorContatoCreateManyArgs} args - Arguments to create many FornecedorContatoes.
     *     @example
     *     // Create many FornecedorContatoes
     *     const fornecedorContato = await prisma.fornecedorContato.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FornecedorContatoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorContatoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FornecedorContato.
     * @param {FornecedorContatoDeleteArgs} args - Arguments to delete one FornecedorContato.
     * @example
     * // Delete one FornecedorContato
     * const FornecedorContato = await prisma.fornecedorContato.delete({
     *   where: {
     *     // ... filter to delete one FornecedorContato
     *   }
     * })
     * 
    **/
    delete<T extends FornecedorContatoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorContatoDeleteArgs<ExtArgs>>
    ): Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one FornecedorContato.
     * @param {FornecedorContatoUpdateArgs} args - Arguments to update one FornecedorContato.
     * @example
     * // Update one FornecedorContato
     * const fornecedorContato = await prisma.fornecedorContato.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FornecedorContatoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorContatoUpdateArgs<ExtArgs>>
    ): Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more FornecedorContatoes.
     * @param {FornecedorContatoDeleteManyArgs} args - Arguments to filter FornecedorContatoes to delete.
     * @example
     * // Delete a few FornecedorContatoes
     * const { count } = await prisma.fornecedorContato.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FornecedorContatoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorContatoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FornecedorContatoes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorContatoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FornecedorContatoes
     * const fornecedorContato = await prisma.fornecedorContato.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FornecedorContatoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorContatoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FornecedorContato.
     * @param {FornecedorContatoUpsertArgs} args - Arguments to update or create a FornecedorContato.
     * @example
     * // Update or create a FornecedorContato
     * const fornecedorContato = await prisma.fornecedorContato.upsert({
     *   create: {
     *     // ... data to create a FornecedorContato
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FornecedorContato we want to update
     *   }
     * })
    **/
    upsert<T extends FornecedorContatoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorContatoUpsertArgs<ExtArgs>>
    ): Prisma__FornecedorContatoClient<$Types.GetResult<FornecedorContatoPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of FornecedorContatoes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorContatoCountArgs} args - Arguments to filter FornecedorContatoes to count.
     * @example
     * // Count the number of FornecedorContatoes
     * const count = await prisma.fornecedorContato.count({
     *   where: {
     *     // ... the filter for the FornecedorContatoes we want to count
     *   }
     * })
    **/
    count<T extends FornecedorContatoCountArgs>(
      args?: Subset<T, FornecedorContatoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FornecedorContatoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FornecedorContato.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorContatoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FornecedorContatoAggregateArgs>(args: Subset<T, FornecedorContatoAggregateArgs>): Prisma.PrismaPromise<GetFornecedorContatoAggregateType<T>>

    /**
     * Group by FornecedorContato.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorContatoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FornecedorContatoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FornecedorContatoGroupByArgs['orderBy'] }
        : { orderBy?: FornecedorContatoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FornecedorContatoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFornecedorContatoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for FornecedorContato.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__FornecedorContatoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    fornecedor<T extends FornecedorArgs<ExtArgs> = {}>(args?: Subset<T, FornecedorArgs<ExtArgs>>): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * FornecedorContato base type for findUnique actions
   */
  export type FornecedorContatoFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorContato to fetch.
     */
    where: FornecedorContatoWhereUniqueInput
  }

  /**
   * FornecedorContato findUnique
   */
  export interface FornecedorContatoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends FornecedorContatoFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * FornecedorContato findUniqueOrThrow
   */
  export type FornecedorContatoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorContato to fetch.
     */
    where: FornecedorContatoWhereUniqueInput
  }


  /**
   * FornecedorContato base type for findFirst actions
   */
  export type FornecedorContatoFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorContato to fetch.
     */
    where?: FornecedorContatoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FornecedorContatoes to fetch.
     */
    orderBy?: Enumerable<FornecedorContatoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FornecedorContatoes.
     */
    cursor?: FornecedorContatoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FornecedorContatoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FornecedorContatoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FornecedorContatoes.
     */
    distinct?: Enumerable<FornecedorContatoScalarFieldEnum>
  }

  /**
   * FornecedorContato findFirst
   */
  export interface FornecedorContatoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends FornecedorContatoFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * FornecedorContato findFirstOrThrow
   */
  export type FornecedorContatoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorContato to fetch.
     */
    where?: FornecedorContatoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FornecedorContatoes to fetch.
     */
    orderBy?: Enumerable<FornecedorContatoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FornecedorContatoes.
     */
    cursor?: FornecedorContatoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FornecedorContatoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FornecedorContatoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FornecedorContatoes.
     */
    distinct?: Enumerable<FornecedorContatoScalarFieldEnum>
  }


  /**
   * FornecedorContato findMany
   */
  export type FornecedorContatoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorContatoes to fetch.
     */
    where?: FornecedorContatoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FornecedorContatoes to fetch.
     */
    orderBy?: Enumerable<FornecedorContatoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FornecedorContatoes.
     */
    cursor?: FornecedorContatoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FornecedorContatoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FornecedorContatoes.
     */
    skip?: number
    distinct?: Enumerable<FornecedorContatoScalarFieldEnum>
  }


  /**
   * FornecedorContato create
   */
  export type FornecedorContatoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * The data needed to create a FornecedorContato.
     */
    data: XOR<FornecedorContatoCreateInput, FornecedorContatoUncheckedCreateInput>
  }


  /**
   * FornecedorContato createMany
   */
  export type FornecedorContatoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FornecedorContatoes.
     */
    data: Enumerable<FornecedorContatoCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * FornecedorContato update
   */
  export type FornecedorContatoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * The data needed to update a FornecedorContato.
     */
    data: XOR<FornecedorContatoUpdateInput, FornecedorContatoUncheckedUpdateInput>
    /**
     * Choose, which FornecedorContato to update.
     */
    where: FornecedorContatoWhereUniqueInput
  }


  /**
   * FornecedorContato updateMany
   */
  export type FornecedorContatoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FornecedorContatoes.
     */
    data: XOR<FornecedorContatoUpdateManyMutationInput, FornecedorContatoUncheckedUpdateManyInput>
    /**
     * Filter which FornecedorContatoes to update
     */
    where?: FornecedorContatoWhereInput
  }


  /**
   * FornecedorContato upsert
   */
  export type FornecedorContatoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * The filter to search for the FornecedorContato to update in case it exists.
     */
    where: FornecedorContatoWhereUniqueInput
    /**
     * In case the FornecedorContato found by the `where` argument doesn't exist, create a new FornecedorContato with this data.
     */
    create: XOR<FornecedorContatoCreateInput, FornecedorContatoUncheckedCreateInput>
    /**
     * In case the FornecedorContato was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FornecedorContatoUpdateInput, FornecedorContatoUncheckedUpdateInput>
  }


  /**
   * FornecedorContato delete
   */
  export type FornecedorContatoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
    /**
     * Filter which FornecedorContato to delete.
     */
    where: FornecedorContatoWhereUniqueInput
  }


  /**
   * FornecedorContato deleteMany
   */
  export type FornecedorContatoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which FornecedorContatoes to delete
     */
    where?: FornecedorContatoWhereInput
  }


  /**
   * FornecedorContato without action
   */
  export type FornecedorContatoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorContato
     */
    select?: FornecedorContatoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorContatoInclude<ExtArgs> | null
  }



  /**
   * Model FornecedorSancao
   */


  export type AggregateFornecedorSancao = {
    _count: FornecedorSancaoCountAggregateOutputType | null
    _min: FornecedorSancaoMinAggregateOutputType | null
    _max: FornecedorSancaoMaxAggregateOutputType | null
  }

  export type FornecedorSancaoMinAggregateOutputType = {
    id: string | null
    fornecedorId: string | null
    tipo: TipoSancao | null
    processo: string | null
    dataInicio: Date | null
    dataFim: Date | null
    abrangencia: string | null
    fonte: string | null
    createdAt: Date | null
  }

  export type FornecedorSancaoMaxAggregateOutputType = {
    id: string | null
    fornecedorId: string | null
    tipo: TipoSancao | null
    processo: string | null
    dataInicio: Date | null
    dataFim: Date | null
    abrangencia: string | null
    fonte: string | null
    createdAt: Date | null
  }

  export type FornecedorSancaoCountAggregateOutputType = {
    id: number
    fornecedorId: number
    tipo: number
    processo: number
    dataInicio: number
    dataFim: number
    abrangencia: number
    fonte: number
    createdAt: number
    _all: number
  }


  export type FornecedorSancaoMinAggregateInputType = {
    id?: true
    fornecedorId?: true
    tipo?: true
    processo?: true
    dataInicio?: true
    dataFim?: true
    abrangencia?: true
    fonte?: true
    createdAt?: true
  }

  export type FornecedorSancaoMaxAggregateInputType = {
    id?: true
    fornecedorId?: true
    tipo?: true
    processo?: true
    dataInicio?: true
    dataFim?: true
    abrangencia?: true
    fonte?: true
    createdAt?: true
  }

  export type FornecedorSancaoCountAggregateInputType = {
    id?: true
    fornecedorId?: true
    tipo?: true
    processo?: true
    dataInicio?: true
    dataFim?: true
    abrangencia?: true
    fonte?: true
    createdAt?: true
    _all?: true
  }

  export type FornecedorSancaoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which FornecedorSancao to aggregate.
     */
    where?: FornecedorSancaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FornecedorSancaos to fetch.
     */
    orderBy?: Enumerable<FornecedorSancaoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FornecedorSancaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FornecedorSancaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FornecedorSancaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FornecedorSancaos
    **/
    _count?: true | FornecedorSancaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FornecedorSancaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FornecedorSancaoMaxAggregateInputType
  }

  export type GetFornecedorSancaoAggregateType<T extends FornecedorSancaoAggregateArgs> = {
        [P in keyof T & keyof AggregateFornecedorSancao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFornecedorSancao[P]>
      : GetScalarType<T[P], AggregateFornecedorSancao[P]>
  }




  export type FornecedorSancaoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: FornecedorSancaoWhereInput
    orderBy?: Enumerable<FornecedorSancaoOrderByWithAggregationInput>
    by: FornecedorSancaoScalarFieldEnum[]
    having?: FornecedorSancaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FornecedorSancaoCountAggregateInputType | true
    _min?: FornecedorSancaoMinAggregateInputType
    _max?: FornecedorSancaoMaxAggregateInputType
  }


  export type FornecedorSancaoGroupByOutputType = {
    id: string
    fornecedorId: string
    tipo: TipoSancao
    processo: string | null
    dataInicio: Date
    dataFim: Date | null
    abrangencia: string | null
    fonte: string | null
    createdAt: Date
    _count: FornecedorSancaoCountAggregateOutputType | null
    _min: FornecedorSancaoMinAggregateOutputType | null
    _max: FornecedorSancaoMaxAggregateOutputType | null
  }

  type GetFornecedorSancaoGroupByPayload<T extends FornecedorSancaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<FornecedorSancaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FornecedorSancaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FornecedorSancaoGroupByOutputType[P]>
            : GetScalarType<T[P], FornecedorSancaoGroupByOutputType[P]>
        }
      >
    >


  export type FornecedorSancaoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fornecedorId?: boolean
    tipo?: boolean
    processo?: boolean
    dataInicio?: boolean
    dataFim?: boolean
    abrangencia?: boolean
    fonte?: boolean
    createdAt?: boolean
    fornecedor?: boolean | FornecedorArgs<ExtArgs>
  }, ExtArgs["result"]["fornecedorSancao"]>

  export type FornecedorSancaoSelectScalar = {
    id?: boolean
    fornecedorId?: boolean
    tipo?: boolean
    processo?: boolean
    dataInicio?: boolean
    dataFim?: boolean
    abrangencia?: boolean
    fonte?: boolean
    createdAt?: boolean
  }

  export type FornecedorSancaoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    fornecedor?: boolean | FornecedorArgs<ExtArgs>
  }


  type FornecedorSancaoGetPayload<S extends boolean | null | undefined | FornecedorSancaoArgs> = $Types.GetResult<FornecedorSancaoPayload, S>

  type FornecedorSancaoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<FornecedorSancaoFindManyArgs, 'select' | 'include'> & {
      select?: FornecedorSancaoCountAggregateInputType | true
    }

  export interface FornecedorSancaoDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FornecedorSancao'], meta: { name: 'FornecedorSancao' } }
    /**
     * Find zero or one FornecedorSancao that matches the filter.
     * @param {FornecedorSancaoFindUniqueArgs} args - Arguments to find a FornecedorSancao
     * @example
     * // Get one FornecedorSancao
     * const fornecedorSancao = await prisma.fornecedorSancao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FornecedorSancaoFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, FornecedorSancaoFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'FornecedorSancao'> extends True ? Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one FornecedorSancao that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FornecedorSancaoFindUniqueOrThrowArgs} args - Arguments to find a FornecedorSancao
     * @example
     * // Get one FornecedorSancao
     * const fornecedorSancao = await prisma.fornecedorSancao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FornecedorSancaoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorSancaoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first FornecedorSancao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorSancaoFindFirstArgs} args - Arguments to find a FornecedorSancao
     * @example
     * // Get one FornecedorSancao
     * const fornecedorSancao = await prisma.fornecedorSancao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FornecedorSancaoFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, FornecedorSancaoFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'FornecedorSancao'> extends True ? Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first FornecedorSancao that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorSancaoFindFirstOrThrowArgs} args - Arguments to find a FornecedorSancao
     * @example
     * // Get one FornecedorSancao
     * const fornecedorSancao = await prisma.fornecedorSancao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FornecedorSancaoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorSancaoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more FornecedorSancaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorSancaoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FornecedorSancaos
     * const fornecedorSancaos = await prisma.fornecedorSancao.findMany()
     * 
     * // Get first 10 FornecedorSancaos
     * const fornecedorSancaos = await prisma.fornecedorSancao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fornecedorSancaoWithIdOnly = await prisma.fornecedorSancao.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FornecedorSancaoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorSancaoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a FornecedorSancao.
     * @param {FornecedorSancaoCreateArgs} args - Arguments to create a FornecedorSancao.
     * @example
     * // Create one FornecedorSancao
     * const FornecedorSancao = await prisma.fornecedorSancao.create({
     *   data: {
     *     // ... data to create a FornecedorSancao
     *   }
     * })
     * 
    **/
    create<T extends FornecedorSancaoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorSancaoCreateArgs<ExtArgs>>
    ): Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many FornecedorSancaos.
     *     @param {FornecedorSancaoCreateManyArgs} args - Arguments to create many FornecedorSancaos.
     *     @example
     *     // Create many FornecedorSancaos
     *     const fornecedorSancao = await prisma.fornecedorSancao.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FornecedorSancaoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorSancaoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FornecedorSancao.
     * @param {FornecedorSancaoDeleteArgs} args - Arguments to delete one FornecedorSancao.
     * @example
     * // Delete one FornecedorSancao
     * const FornecedorSancao = await prisma.fornecedorSancao.delete({
     *   where: {
     *     // ... filter to delete one FornecedorSancao
     *   }
     * })
     * 
    **/
    delete<T extends FornecedorSancaoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorSancaoDeleteArgs<ExtArgs>>
    ): Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one FornecedorSancao.
     * @param {FornecedorSancaoUpdateArgs} args - Arguments to update one FornecedorSancao.
     * @example
     * // Update one FornecedorSancao
     * const fornecedorSancao = await prisma.fornecedorSancao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FornecedorSancaoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorSancaoUpdateArgs<ExtArgs>>
    ): Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more FornecedorSancaos.
     * @param {FornecedorSancaoDeleteManyArgs} args - Arguments to filter FornecedorSancaos to delete.
     * @example
     * // Delete a few FornecedorSancaos
     * const { count } = await prisma.fornecedorSancao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FornecedorSancaoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FornecedorSancaoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FornecedorSancaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorSancaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FornecedorSancaos
     * const fornecedorSancao = await prisma.fornecedorSancao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FornecedorSancaoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorSancaoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FornecedorSancao.
     * @param {FornecedorSancaoUpsertArgs} args - Arguments to update or create a FornecedorSancao.
     * @example
     * // Update or create a FornecedorSancao
     * const fornecedorSancao = await prisma.fornecedorSancao.upsert({
     *   create: {
     *     // ... data to create a FornecedorSancao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FornecedorSancao we want to update
     *   }
     * })
    **/
    upsert<T extends FornecedorSancaoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, FornecedorSancaoUpsertArgs<ExtArgs>>
    ): Prisma__FornecedorSancaoClient<$Types.GetResult<FornecedorSancaoPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of FornecedorSancaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorSancaoCountArgs} args - Arguments to filter FornecedorSancaos to count.
     * @example
     * // Count the number of FornecedorSancaos
     * const count = await prisma.fornecedorSancao.count({
     *   where: {
     *     // ... the filter for the FornecedorSancaos we want to count
     *   }
     * })
    **/
    count<T extends FornecedorSancaoCountArgs>(
      args?: Subset<T, FornecedorSancaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FornecedorSancaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FornecedorSancao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorSancaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FornecedorSancaoAggregateArgs>(args: Subset<T, FornecedorSancaoAggregateArgs>): Prisma.PrismaPromise<GetFornecedorSancaoAggregateType<T>>

    /**
     * Group by FornecedorSancao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FornecedorSancaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FornecedorSancaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FornecedorSancaoGroupByArgs['orderBy'] }
        : { orderBy?: FornecedorSancaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FornecedorSancaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFornecedorSancaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for FornecedorSancao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__FornecedorSancaoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    fornecedor<T extends FornecedorArgs<ExtArgs> = {}>(args?: Subset<T, FornecedorArgs<ExtArgs>>): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * FornecedorSancao base type for findUnique actions
   */
  export type FornecedorSancaoFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorSancao to fetch.
     */
    where: FornecedorSancaoWhereUniqueInput
  }

  /**
   * FornecedorSancao findUnique
   */
  export interface FornecedorSancaoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends FornecedorSancaoFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * FornecedorSancao findUniqueOrThrow
   */
  export type FornecedorSancaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorSancao to fetch.
     */
    where: FornecedorSancaoWhereUniqueInput
  }


  /**
   * FornecedorSancao base type for findFirst actions
   */
  export type FornecedorSancaoFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorSancao to fetch.
     */
    where?: FornecedorSancaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FornecedorSancaos to fetch.
     */
    orderBy?: Enumerable<FornecedorSancaoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FornecedorSancaos.
     */
    cursor?: FornecedorSancaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FornecedorSancaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FornecedorSancaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FornecedorSancaos.
     */
    distinct?: Enumerable<FornecedorSancaoScalarFieldEnum>
  }

  /**
   * FornecedorSancao findFirst
   */
  export interface FornecedorSancaoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends FornecedorSancaoFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * FornecedorSancao findFirstOrThrow
   */
  export type FornecedorSancaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorSancao to fetch.
     */
    where?: FornecedorSancaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FornecedorSancaos to fetch.
     */
    orderBy?: Enumerable<FornecedorSancaoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FornecedorSancaos.
     */
    cursor?: FornecedorSancaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FornecedorSancaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FornecedorSancaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FornecedorSancaos.
     */
    distinct?: Enumerable<FornecedorSancaoScalarFieldEnum>
  }


  /**
   * FornecedorSancao findMany
   */
  export type FornecedorSancaoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * Filter, which FornecedorSancaos to fetch.
     */
    where?: FornecedorSancaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FornecedorSancaos to fetch.
     */
    orderBy?: Enumerable<FornecedorSancaoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FornecedorSancaos.
     */
    cursor?: FornecedorSancaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FornecedorSancaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FornecedorSancaos.
     */
    skip?: number
    distinct?: Enumerable<FornecedorSancaoScalarFieldEnum>
  }


  /**
   * FornecedorSancao create
   */
  export type FornecedorSancaoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * The data needed to create a FornecedorSancao.
     */
    data: XOR<FornecedorSancaoCreateInput, FornecedorSancaoUncheckedCreateInput>
  }


  /**
   * FornecedorSancao createMany
   */
  export type FornecedorSancaoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FornecedorSancaos.
     */
    data: Enumerable<FornecedorSancaoCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * FornecedorSancao update
   */
  export type FornecedorSancaoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * The data needed to update a FornecedorSancao.
     */
    data: XOR<FornecedorSancaoUpdateInput, FornecedorSancaoUncheckedUpdateInput>
    /**
     * Choose, which FornecedorSancao to update.
     */
    where: FornecedorSancaoWhereUniqueInput
  }


  /**
   * FornecedorSancao updateMany
   */
  export type FornecedorSancaoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FornecedorSancaos.
     */
    data: XOR<FornecedorSancaoUpdateManyMutationInput, FornecedorSancaoUncheckedUpdateManyInput>
    /**
     * Filter which FornecedorSancaos to update
     */
    where?: FornecedorSancaoWhereInput
  }


  /**
   * FornecedorSancao upsert
   */
  export type FornecedorSancaoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * The filter to search for the FornecedorSancao to update in case it exists.
     */
    where: FornecedorSancaoWhereUniqueInput
    /**
     * In case the FornecedorSancao found by the `where` argument doesn't exist, create a new FornecedorSancao with this data.
     */
    create: XOR<FornecedorSancaoCreateInput, FornecedorSancaoUncheckedCreateInput>
    /**
     * In case the FornecedorSancao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FornecedorSancaoUpdateInput, FornecedorSancaoUncheckedUpdateInput>
  }


  /**
   * FornecedorSancao delete
   */
  export type FornecedorSancaoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
    /**
     * Filter which FornecedorSancao to delete.
     */
    where: FornecedorSancaoWhereUniqueInput
  }


  /**
   * FornecedorSancao deleteMany
   */
  export type FornecedorSancaoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which FornecedorSancaos to delete
     */
    where?: FornecedorSancaoWhereInput
  }


  /**
   * FornecedorSancao without action
   */
  export type FornecedorSancaoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FornecedorSancao
     */
    select?: FornecedorSancaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FornecedorSancaoInclude<ExtArgs> | null
  }



  /**
   * Model Servidor
   */


  export type AggregateServidor = {
    _count: ServidorCountAggregateOutputType | null
    _min: ServidorMinAggregateOutputType | null
    _max: ServidorMaxAggregateOutputType | null
  }

  export type ServidorMinAggregateOutputType = {
    id: string | null
    nome: string | null
    cpf: string | null
    rgFuncional: string | null
    cargo: string | null
    orgaoId: string | null
    unidadeId: string | null
    email: string | null
    telefone: string | null
    ativo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServidorMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    cpf: string | null
    rgFuncional: string | null
    cargo: string | null
    orgaoId: string | null
    unidadeId: string | null
    email: string | null
    telefone: string | null
    ativo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServidorCountAggregateOutputType = {
    id: number
    nome: number
    cpf: number
    rgFuncional: number
    cargo: number
    orgaoId: number
    unidadeId: number
    email: number
    telefone: number
    ativo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ServidorMinAggregateInputType = {
    id?: true
    nome?: true
    cpf?: true
    rgFuncional?: true
    cargo?: true
    orgaoId?: true
    unidadeId?: true
    email?: true
    telefone?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServidorMaxAggregateInputType = {
    id?: true
    nome?: true
    cpf?: true
    rgFuncional?: true
    cargo?: true
    orgaoId?: true
    unidadeId?: true
    email?: true
    telefone?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServidorCountAggregateInputType = {
    id?: true
    nome?: true
    cpf?: true
    rgFuncional?: true
    cargo?: true
    orgaoId?: true
    unidadeId?: true
    email?: true
    telefone?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ServidorAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servidor to aggregate.
     */
    where?: ServidorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servidors to fetch.
     */
    orderBy?: Enumerable<ServidorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServidorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servidors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servidors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Servidors
    **/
    _count?: true | ServidorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServidorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServidorMaxAggregateInputType
  }

  export type GetServidorAggregateType<T extends ServidorAggregateArgs> = {
        [P in keyof T & keyof AggregateServidor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServidor[P]>
      : GetScalarType<T[P], AggregateServidor[P]>
  }




  export type ServidorGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ServidorWhereInput
    orderBy?: Enumerable<ServidorOrderByWithAggregationInput>
    by: ServidorScalarFieldEnum[]
    having?: ServidorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServidorCountAggregateInputType | true
    _min?: ServidorMinAggregateInputType
    _max?: ServidorMaxAggregateInputType
  }


  export type ServidorGroupByOutputType = {
    id: string
    nome: string
    cpf: string | null
    rgFuncional: string | null
    cargo: string | null
    orgaoId: string | null
    unidadeId: string | null
    email: string | null
    telefone: string | null
    ativo: boolean
    createdAt: Date
    updatedAt: Date
    _count: ServidorCountAggregateOutputType | null
    _min: ServidorMinAggregateOutputType | null
    _max: ServidorMaxAggregateOutputType | null
  }

  type GetServidorGroupByPayload<T extends ServidorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ServidorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServidorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServidorGroupByOutputType[P]>
            : GetScalarType<T[P], ServidorGroupByOutputType[P]>
        }
      >
    >


  export type ServidorSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cpf?: boolean
    rgFuncional?: boolean
    cargo?: boolean
    orgaoId?: boolean
    unidadeId?: boolean
    email?: boolean
    telefone?: boolean
    ativo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    orgao?: boolean | OrgaoArgs<ExtArgs>
    unidade?: boolean | UnidadeOrganizacionalArgs<ExtArgs>
    gestorContratos?: boolean | Servidor$gestorContratosArgs<ExtArgs>
    fiscalContratos?: boolean | Servidor$fiscalContratosArgs<ExtArgs>
    _count?: boolean | ServidorCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["servidor"]>

  export type ServidorSelectScalar = {
    id?: boolean
    nome?: boolean
    cpf?: boolean
    rgFuncional?: boolean
    cargo?: boolean
    orgaoId?: boolean
    unidadeId?: boolean
    email?: boolean
    telefone?: boolean
    ativo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ServidorInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    orgao?: boolean | OrgaoArgs<ExtArgs>
    unidade?: boolean | UnidadeOrganizacionalArgs<ExtArgs>
    gestorContratos?: boolean | Servidor$gestorContratosArgs<ExtArgs>
    fiscalContratos?: boolean | Servidor$fiscalContratosArgs<ExtArgs>
    _count?: boolean | ServidorCountOutputTypeArgs<ExtArgs>
  }


  type ServidorGetPayload<S extends boolean | null | undefined | ServidorArgs> = $Types.GetResult<ServidorPayload, S>

  type ServidorCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<ServidorFindManyArgs, 'select' | 'include'> & {
      select?: ServidorCountAggregateInputType | true
    }

  export interface ServidorDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Servidor'], meta: { name: 'Servidor' } }
    /**
     * Find zero or one Servidor that matches the filter.
     * @param {ServidorFindUniqueArgs} args - Arguments to find a Servidor
     * @example
     * // Get one Servidor
     * const servidor = await prisma.servidor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ServidorFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ServidorFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Servidor'> extends True ? Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Servidor that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ServidorFindUniqueOrThrowArgs} args - Arguments to find a Servidor
     * @example
     * // Get one Servidor
     * const servidor = await prisma.servidor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ServidorFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ServidorFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Servidor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServidorFindFirstArgs} args - Arguments to find a Servidor
     * @example
     * // Get one Servidor
     * const servidor = await prisma.servidor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ServidorFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ServidorFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Servidor'> extends True ? Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Servidor that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServidorFindFirstOrThrowArgs} args - Arguments to find a Servidor
     * @example
     * // Get one Servidor
     * const servidor = await prisma.servidor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ServidorFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ServidorFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Servidors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServidorFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servidors
     * const servidors = await prisma.servidor.findMany()
     * 
     * // Get first 10 Servidors
     * const servidors = await prisma.servidor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const servidorWithIdOnly = await prisma.servidor.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ServidorFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServidorFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Servidor.
     * @param {ServidorCreateArgs} args - Arguments to create a Servidor.
     * @example
     * // Create one Servidor
     * const Servidor = await prisma.servidor.create({
     *   data: {
     *     // ... data to create a Servidor
     *   }
     * })
     * 
    **/
    create<T extends ServidorCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ServidorCreateArgs<ExtArgs>>
    ): Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Servidors.
     *     @param {ServidorCreateManyArgs} args - Arguments to create many Servidors.
     *     @example
     *     // Create many Servidors
     *     const servidor = await prisma.servidor.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ServidorCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServidorCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Servidor.
     * @param {ServidorDeleteArgs} args - Arguments to delete one Servidor.
     * @example
     * // Delete one Servidor
     * const Servidor = await prisma.servidor.delete({
     *   where: {
     *     // ... filter to delete one Servidor
     *   }
     * })
     * 
    **/
    delete<T extends ServidorDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ServidorDeleteArgs<ExtArgs>>
    ): Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Servidor.
     * @param {ServidorUpdateArgs} args - Arguments to update one Servidor.
     * @example
     * // Update one Servidor
     * const servidor = await prisma.servidor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ServidorUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ServidorUpdateArgs<ExtArgs>>
    ): Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Servidors.
     * @param {ServidorDeleteManyArgs} args - Arguments to filter Servidors to delete.
     * @example
     * // Delete a few Servidors
     * const { count } = await prisma.servidor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ServidorDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServidorDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servidors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServidorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servidors
     * const servidor = await prisma.servidor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ServidorUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ServidorUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Servidor.
     * @param {ServidorUpsertArgs} args - Arguments to update or create a Servidor.
     * @example
     * // Update or create a Servidor
     * const servidor = await prisma.servidor.upsert({
     *   create: {
     *     // ... data to create a Servidor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Servidor we want to update
     *   }
     * })
    **/
    upsert<T extends ServidorUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ServidorUpsertArgs<ExtArgs>>
    ): Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Servidors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServidorCountArgs} args - Arguments to filter Servidors to count.
     * @example
     * // Count the number of Servidors
     * const count = await prisma.servidor.count({
     *   where: {
     *     // ... the filter for the Servidors we want to count
     *   }
     * })
    **/
    count<T extends ServidorCountArgs>(
      args?: Subset<T, ServidorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServidorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Servidor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServidorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServidorAggregateArgs>(args: Subset<T, ServidorAggregateArgs>): Prisma.PrismaPromise<GetServidorAggregateType<T>>

    /**
     * Group by Servidor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServidorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServidorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServidorGroupByArgs['orderBy'] }
        : { orderBy?: ServidorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServidorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServidorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Servidor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ServidorClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    orgao<T extends OrgaoArgs<ExtArgs> = {}>(args?: Subset<T, OrgaoArgs<ExtArgs>>): Prisma__OrgaoClient<$Types.GetResult<OrgaoPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    unidade<T extends UnidadeOrganizacionalArgs<ExtArgs> = {}>(args?: Subset<T, UnidadeOrganizacionalArgs<ExtArgs>>): Prisma__UnidadeOrganizacionalClient<$Types.GetResult<UnidadeOrganizacionalPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    gestorContratos<T extends Servidor$gestorContratosArgs<ExtArgs> = {}>(args?: Subset<T, Servidor$gestorContratosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    fiscalContratos<T extends Servidor$fiscalContratosArgs<ExtArgs> = {}>(args?: Subset<T, Servidor$fiscalContratosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Servidor base type for findUnique actions
   */
  export type ServidorFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * Filter, which Servidor to fetch.
     */
    where: ServidorWhereUniqueInput
  }

  /**
   * Servidor findUnique
   */
  export interface ServidorFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends ServidorFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Servidor findUniqueOrThrow
   */
  export type ServidorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * Filter, which Servidor to fetch.
     */
    where: ServidorWhereUniqueInput
  }


  /**
   * Servidor base type for findFirst actions
   */
  export type ServidorFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * Filter, which Servidor to fetch.
     */
    where?: ServidorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servidors to fetch.
     */
    orderBy?: Enumerable<ServidorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servidors.
     */
    cursor?: ServidorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servidors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servidors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servidors.
     */
    distinct?: Enumerable<ServidorScalarFieldEnum>
  }

  /**
   * Servidor findFirst
   */
  export interface ServidorFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends ServidorFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Servidor findFirstOrThrow
   */
  export type ServidorFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * Filter, which Servidor to fetch.
     */
    where?: ServidorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servidors to fetch.
     */
    orderBy?: Enumerable<ServidorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servidors.
     */
    cursor?: ServidorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servidors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servidors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servidors.
     */
    distinct?: Enumerable<ServidorScalarFieldEnum>
  }


  /**
   * Servidor findMany
   */
  export type ServidorFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * Filter, which Servidors to fetch.
     */
    where?: ServidorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servidors to fetch.
     */
    orderBy?: Enumerable<ServidorOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Servidors.
     */
    cursor?: ServidorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servidors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servidors.
     */
    skip?: number
    distinct?: Enumerable<ServidorScalarFieldEnum>
  }


  /**
   * Servidor create
   */
  export type ServidorCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * The data needed to create a Servidor.
     */
    data: XOR<ServidorCreateInput, ServidorUncheckedCreateInput>
  }


  /**
   * Servidor createMany
   */
  export type ServidorCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Servidors.
     */
    data: Enumerable<ServidorCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Servidor update
   */
  export type ServidorUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * The data needed to update a Servidor.
     */
    data: XOR<ServidorUpdateInput, ServidorUncheckedUpdateInput>
    /**
     * Choose, which Servidor to update.
     */
    where: ServidorWhereUniqueInput
  }


  /**
   * Servidor updateMany
   */
  export type ServidorUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Servidors.
     */
    data: XOR<ServidorUpdateManyMutationInput, ServidorUncheckedUpdateManyInput>
    /**
     * Filter which Servidors to update
     */
    where?: ServidorWhereInput
  }


  /**
   * Servidor upsert
   */
  export type ServidorUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * The filter to search for the Servidor to update in case it exists.
     */
    where: ServidorWhereUniqueInput
    /**
     * In case the Servidor found by the `where` argument doesn't exist, create a new Servidor with this data.
     */
    create: XOR<ServidorCreateInput, ServidorUncheckedCreateInput>
    /**
     * In case the Servidor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServidorUpdateInput, ServidorUncheckedUpdateInput>
  }


  /**
   * Servidor delete
   */
  export type ServidorDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
    /**
     * Filter which Servidor to delete.
     */
    where: ServidorWhereUniqueInput
  }


  /**
   * Servidor deleteMany
   */
  export type ServidorDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servidors to delete
     */
    where?: ServidorWhereInput
  }


  /**
   * Servidor.gestorContratos
   */
  export type Servidor$gestorContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    where?: ContratoWhereInput
    orderBy?: Enumerable<ContratoOrderByWithRelationInput>
    cursor?: ContratoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<ContratoScalarFieldEnum>
  }


  /**
   * Servidor.fiscalContratos
   */
  export type Servidor$fiscalContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    where?: ContratoWhereInput
    orderBy?: Enumerable<ContratoOrderByWithRelationInput>
    cursor?: ContratoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<ContratoScalarFieldEnum>
  }


  /**
   * Servidor without action
   */
  export type ServidorArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servidor
     */
    select?: ServidorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServidorInclude<ExtArgs> | null
  }



  /**
   * Model Contrato
   */


  export type AggregateContrato = {
    _count: ContratoCountAggregateOutputType | null
    _avg: ContratoAvgAggregateOutputType | null
    _sum: ContratoSumAggregateOutputType | null
    _min: ContratoMinAggregateOutputType | null
    _max: ContratoMaxAggregateOutputType | null
  }

  export type ContratoAvgAggregateOutputType = {
    numGms: number | null
    anoGms: number | null
    valorAnualCents: number | null
  }

  export type ContratoSumAggregateOutputType = {
    numGms: number | null
    anoGms: number | null
    valorAnualCents: number | null
  }

  export type ContratoMinAggregateOutputType = {
    id: string | null
    protocoloCabeca: string | null
    numGms: number | null
    anoGms: number | null
    unidadeFspId: string | null
    gestorId: string | null
    fiscalId: string | null
    fornecedorId: string | null
    modalidade: string | null
    objeto: string | null
    valorAnualCents: number | null
    dataInicio: Date | null
    dataFimOrig: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContratoMaxAggregateOutputType = {
    id: string | null
    protocoloCabeca: string | null
    numGms: number | null
    anoGms: number | null
    unidadeFspId: string | null
    gestorId: string | null
    fiscalId: string | null
    fornecedorId: string | null
    modalidade: string | null
    objeto: string | null
    valorAnualCents: number | null
    dataInicio: Date | null
    dataFimOrig: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContratoCountAggregateOutputType = {
    id: number
    protocoloCabeca: number
    numGms: number
    anoGms: number
    unidadeFspId: number
    gestorId: number
    fiscalId: number
    fornecedorId: number
    modalidade: number
    objeto: number
    valorAnualCents: number
    dataInicio: number
    dataFimOrig: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ContratoAvgAggregateInputType = {
    numGms?: true
    anoGms?: true
    valorAnualCents?: true
  }

  export type ContratoSumAggregateInputType = {
    numGms?: true
    anoGms?: true
    valorAnualCents?: true
  }

  export type ContratoMinAggregateInputType = {
    id?: true
    protocoloCabeca?: true
    numGms?: true
    anoGms?: true
    unidadeFspId?: true
    gestorId?: true
    fiscalId?: true
    fornecedorId?: true
    modalidade?: true
    objeto?: true
    valorAnualCents?: true
    dataInicio?: true
    dataFimOrig?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContratoMaxAggregateInputType = {
    id?: true
    protocoloCabeca?: true
    numGms?: true
    anoGms?: true
    unidadeFspId?: true
    gestorId?: true
    fiscalId?: true
    fornecedorId?: true
    modalidade?: true
    objeto?: true
    valorAnualCents?: true
    dataInicio?: true
    dataFimOrig?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContratoCountAggregateInputType = {
    id?: true
    protocoloCabeca?: true
    numGms?: true
    anoGms?: true
    unidadeFspId?: true
    gestorId?: true
    fiscalId?: true
    fornecedorId?: true
    modalidade?: true
    objeto?: true
    valorAnualCents?: true
    dataInicio?: true
    dataFimOrig?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ContratoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contrato to aggregate.
     */
    where?: ContratoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contratoes to fetch.
     */
    orderBy?: Enumerable<ContratoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContratoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contratoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contratoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Contratoes
    **/
    _count?: true | ContratoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContratoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContratoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContratoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContratoMaxAggregateInputType
  }

  export type GetContratoAggregateType<T extends ContratoAggregateArgs> = {
        [P in keyof T & keyof AggregateContrato]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContrato[P]>
      : GetScalarType<T[P], AggregateContrato[P]>
  }




  export type ContratoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ContratoWhereInput
    orderBy?: Enumerable<ContratoOrderByWithAggregationInput>
    by: ContratoScalarFieldEnum[]
    having?: ContratoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContratoCountAggregateInputType | true
    _avg?: ContratoAvgAggregateInputType
    _sum?: ContratoSumAggregateInputType
    _min?: ContratoMinAggregateInputType
    _max?: ContratoMaxAggregateInputType
  }


  export type ContratoGroupByOutputType = {
    id: string
    protocoloCabeca: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio: Date | null
    dataFimOrig: Date | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: ContratoCountAggregateOutputType | null
    _avg: ContratoAvgAggregateOutputType | null
    _sum: ContratoSumAggregateOutputType | null
    _min: ContratoMinAggregateOutputType | null
    _max: ContratoMaxAggregateOutputType | null
  }

  type GetContratoGroupByPayload<T extends ContratoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ContratoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContratoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContratoGroupByOutputType[P]>
            : GetScalarType<T[P], ContratoGroupByOutputType[P]>
        }
      >
    >


  export type ContratoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    protocoloCabeca?: boolean
    numGms?: boolean
    anoGms?: boolean
    unidadeFspId?: boolean
    gestorId?: boolean
    fiscalId?: boolean
    fornecedorId?: boolean
    modalidade?: boolean
    objeto?: boolean
    valorAnualCents?: boolean
    dataInicio?: boolean
    dataFimOrig?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    unidadeFsp?: boolean | UnidadeFspArgs<ExtArgs>
    gestor?: boolean | ServidorArgs<ExtArgs>
    fiscal?: boolean | ServidorArgs<ExtArgs>
    fornecedor?: boolean | FornecedorArgs<ExtArgs>
    aditivos?: boolean | Contrato$aditivosArgs<ExtArgs>
    _count?: boolean | ContratoCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["contrato"]>

  export type ContratoSelectScalar = {
    id?: boolean
    protocoloCabeca?: boolean
    numGms?: boolean
    anoGms?: boolean
    unidadeFspId?: boolean
    gestorId?: boolean
    fiscalId?: boolean
    fornecedorId?: boolean
    modalidade?: boolean
    objeto?: boolean
    valorAnualCents?: boolean
    dataInicio?: boolean
    dataFimOrig?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ContratoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    unidadeFsp?: boolean | UnidadeFspArgs<ExtArgs>
    gestor?: boolean | ServidorArgs<ExtArgs>
    fiscal?: boolean | ServidorArgs<ExtArgs>
    fornecedor?: boolean | FornecedorArgs<ExtArgs>
    aditivos?: boolean | Contrato$aditivosArgs<ExtArgs>
    _count?: boolean | ContratoCountOutputTypeArgs<ExtArgs>
  }


  type ContratoGetPayload<S extends boolean | null | undefined | ContratoArgs> = $Types.GetResult<ContratoPayload, S>

  type ContratoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<ContratoFindManyArgs, 'select' | 'include'> & {
      select?: ContratoCountAggregateInputType | true
    }

  export interface ContratoDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Contrato'], meta: { name: 'Contrato' } }
    /**
     * Find zero or one Contrato that matches the filter.
     * @param {ContratoFindUniqueArgs} args - Arguments to find a Contrato
     * @example
     * // Get one Contrato
     * const contrato = await prisma.contrato.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ContratoFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ContratoFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Contrato'> extends True ? Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Contrato that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ContratoFindUniqueOrThrowArgs} args - Arguments to find a Contrato
     * @example
     * // Get one Contrato
     * const contrato = await prisma.contrato.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ContratoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ContratoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Contrato that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContratoFindFirstArgs} args - Arguments to find a Contrato
     * @example
     * // Get one Contrato
     * const contrato = await prisma.contrato.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ContratoFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ContratoFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Contrato'> extends True ? Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Contrato that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContratoFindFirstOrThrowArgs} args - Arguments to find a Contrato
     * @example
     * // Get one Contrato
     * const contrato = await prisma.contrato.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ContratoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ContratoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Contratoes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContratoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Contratoes
     * const contratoes = await prisma.contrato.findMany()
     * 
     * // Get first 10 Contratoes
     * const contratoes = await prisma.contrato.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contratoWithIdOnly = await prisma.contrato.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ContratoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ContratoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Contrato.
     * @param {ContratoCreateArgs} args - Arguments to create a Contrato.
     * @example
     * // Create one Contrato
     * const Contrato = await prisma.contrato.create({
     *   data: {
     *     // ... data to create a Contrato
     *   }
     * })
     * 
    **/
    create<T extends ContratoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ContratoCreateArgs<ExtArgs>>
    ): Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Contratoes.
     *     @param {ContratoCreateManyArgs} args - Arguments to create many Contratoes.
     *     @example
     *     // Create many Contratoes
     *     const contrato = await prisma.contrato.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ContratoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ContratoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Contrato.
     * @param {ContratoDeleteArgs} args - Arguments to delete one Contrato.
     * @example
     * // Delete one Contrato
     * const Contrato = await prisma.contrato.delete({
     *   where: {
     *     // ... filter to delete one Contrato
     *   }
     * })
     * 
    **/
    delete<T extends ContratoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ContratoDeleteArgs<ExtArgs>>
    ): Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Contrato.
     * @param {ContratoUpdateArgs} args - Arguments to update one Contrato.
     * @example
     * // Update one Contrato
     * const contrato = await prisma.contrato.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ContratoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ContratoUpdateArgs<ExtArgs>>
    ): Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Contratoes.
     * @param {ContratoDeleteManyArgs} args - Arguments to filter Contratoes to delete.
     * @example
     * // Delete a few Contratoes
     * const { count } = await prisma.contrato.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ContratoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ContratoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contratoes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContratoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Contratoes
     * const contrato = await prisma.contrato.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ContratoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ContratoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Contrato.
     * @param {ContratoUpsertArgs} args - Arguments to update or create a Contrato.
     * @example
     * // Update or create a Contrato
     * const contrato = await prisma.contrato.upsert({
     *   create: {
     *     // ... data to create a Contrato
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Contrato we want to update
     *   }
     * })
    **/
    upsert<T extends ContratoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ContratoUpsertArgs<ExtArgs>>
    ): Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Contratoes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContratoCountArgs} args - Arguments to filter Contratoes to count.
     * @example
     * // Count the number of Contratoes
     * const count = await prisma.contrato.count({
     *   where: {
     *     // ... the filter for the Contratoes we want to count
     *   }
     * })
    **/
    count<T extends ContratoCountArgs>(
      args?: Subset<T, ContratoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContratoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Contrato.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContratoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContratoAggregateArgs>(args: Subset<T, ContratoAggregateArgs>): Prisma.PrismaPromise<GetContratoAggregateType<T>>

    /**
     * Group by Contrato.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContratoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContratoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContratoGroupByArgs['orderBy'] }
        : { orderBy?: ContratoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContratoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContratoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Contrato.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ContratoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    unidadeFsp<T extends UnidadeFspArgs<ExtArgs> = {}>(args?: Subset<T, UnidadeFspArgs<ExtArgs>>): Prisma__UnidadeFspClient<$Types.GetResult<UnidadeFspPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    gestor<T extends ServidorArgs<ExtArgs> = {}>(args?: Subset<T, ServidorArgs<ExtArgs>>): Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    fiscal<T extends ServidorArgs<ExtArgs> = {}>(args?: Subset<T, ServidorArgs<ExtArgs>>): Prisma__ServidorClient<$Types.GetResult<ServidorPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    fornecedor<T extends FornecedorArgs<ExtArgs> = {}>(args?: Subset<T, FornecedorArgs<ExtArgs>>): Prisma__FornecedorClient<$Types.GetResult<FornecedorPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    aditivos<T extends Contrato$aditivosArgs<ExtArgs> = {}>(args?: Subset<T, Contrato$aditivosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Contrato base type for findUnique actions
   */
  export type ContratoFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * Filter, which Contrato to fetch.
     */
    where: ContratoWhereUniqueInput
  }

  /**
   * Contrato findUnique
   */
  export interface ContratoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends ContratoFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Contrato findUniqueOrThrow
   */
  export type ContratoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * Filter, which Contrato to fetch.
     */
    where: ContratoWhereUniqueInput
  }


  /**
   * Contrato base type for findFirst actions
   */
  export type ContratoFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * Filter, which Contrato to fetch.
     */
    where?: ContratoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contratoes to fetch.
     */
    orderBy?: Enumerable<ContratoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contratoes.
     */
    cursor?: ContratoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contratoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contratoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contratoes.
     */
    distinct?: Enumerable<ContratoScalarFieldEnum>
  }

  /**
   * Contrato findFirst
   */
  export interface ContratoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends ContratoFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Contrato findFirstOrThrow
   */
  export type ContratoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * Filter, which Contrato to fetch.
     */
    where?: ContratoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contratoes to fetch.
     */
    orderBy?: Enumerable<ContratoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contratoes.
     */
    cursor?: ContratoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contratoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contratoes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contratoes.
     */
    distinct?: Enumerable<ContratoScalarFieldEnum>
  }


  /**
   * Contrato findMany
   */
  export type ContratoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * Filter, which Contratoes to fetch.
     */
    where?: ContratoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contratoes to fetch.
     */
    orderBy?: Enumerable<ContratoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Contratoes.
     */
    cursor?: ContratoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contratoes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contratoes.
     */
    skip?: number
    distinct?: Enumerable<ContratoScalarFieldEnum>
  }


  /**
   * Contrato create
   */
  export type ContratoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * The data needed to create a Contrato.
     */
    data: XOR<ContratoCreateInput, ContratoUncheckedCreateInput>
  }


  /**
   * Contrato createMany
   */
  export type ContratoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Contratoes.
     */
    data: Enumerable<ContratoCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Contrato update
   */
  export type ContratoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * The data needed to update a Contrato.
     */
    data: XOR<ContratoUpdateInput, ContratoUncheckedUpdateInput>
    /**
     * Choose, which Contrato to update.
     */
    where: ContratoWhereUniqueInput
  }


  /**
   * Contrato updateMany
   */
  export type ContratoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Contratoes.
     */
    data: XOR<ContratoUpdateManyMutationInput, ContratoUncheckedUpdateManyInput>
    /**
     * Filter which Contratoes to update
     */
    where?: ContratoWhereInput
  }


  /**
   * Contrato upsert
   */
  export type ContratoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * The filter to search for the Contrato to update in case it exists.
     */
    where: ContratoWhereUniqueInput
    /**
     * In case the Contrato found by the `where` argument doesn't exist, create a new Contrato with this data.
     */
    create: XOR<ContratoCreateInput, ContratoUncheckedCreateInput>
    /**
     * In case the Contrato was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContratoUpdateInput, ContratoUncheckedUpdateInput>
  }


  /**
   * Contrato delete
   */
  export type ContratoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
    /**
     * Filter which Contrato to delete.
     */
    where: ContratoWhereUniqueInput
  }


  /**
   * Contrato deleteMany
   */
  export type ContratoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contratoes to delete
     */
    where?: ContratoWhereInput
  }


  /**
   * Contrato.aditivos
   */
  export type Contrato$aditivosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    where?: AditivoWhereInput
    orderBy?: Enumerable<AditivoOrderByWithRelationInput>
    cursor?: AditivoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<AditivoScalarFieldEnum>
  }


  /**
   * Contrato without action
   */
  export type ContratoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contrato
     */
    select?: ContratoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ContratoInclude<ExtArgs> | null
  }



  /**
   * Model Aditivo
   */


  export type AggregateAditivo = {
    _count: AditivoCountAggregateOutputType | null
    _avg: AditivoAvgAggregateOutputType | null
    _sum: AditivoSumAggregateOutputType | null
    _min: AditivoMinAggregateOutputType | null
    _max: AditivoMaxAggregateOutputType | null
  }

  export type AditivoAvgAggregateOutputType = {
    numAditivo: number | null
    valorAdicionalCents: number | null
  }

  export type AditivoSumAggregateOutputType = {
    numAditivo: number | null
    valorAdicionalCents: number | null
  }

  export type AditivoMinAggregateOutputType = {
    id: string | null
    contratoId: string | null
    numAditivo: number | null
    protocoloAdit: string | null
    novoFimVigencia: Date | null
    valorAdicionalCents: number | null
    createdAt: Date | null
  }

  export type AditivoMaxAggregateOutputType = {
    id: string | null
    contratoId: string | null
    numAditivo: number | null
    protocoloAdit: string | null
    novoFimVigencia: Date | null
    valorAdicionalCents: number | null
    createdAt: Date | null
  }

  export type AditivoCountAggregateOutputType = {
    id: number
    contratoId: number
    numAditivo: number
    protocoloAdit: number
    novoFimVigencia: number
    valorAdicionalCents: number
    createdAt: number
    _all: number
  }


  export type AditivoAvgAggregateInputType = {
    numAditivo?: true
    valorAdicionalCents?: true
  }

  export type AditivoSumAggregateInputType = {
    numAditivo?: true
    valorAdicionalCents?: true
  }

  export type AditivoMinAggregateInputType = {
    id?: true
    contratoId?: true
    numAditivo?: true
    protocoloAdit?: true
    novoFimVigencia?: true
    valorAdicionalCents?: true
    createdAt?: true
  }

  export type AditivoMaxAggregateInputType = {
    id?: true
    contratoId?: true
    numAditivo?: true
    protocoloAdit?: true
    novoFimVigencia?: true
    valorAdicionalCents?: true
    createdAt?: true
  }

  export type AditivoCountAggregateInputType = {
    id?: true
    contratoId?: true
    numAditivo?: true
    protocoloAdit?: true
    novoFimVigencia?: true
    valorAdicionalCents?: true
    createdAt?: true
    _all?: true
  }

  export type AditivoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Aditivo to aggregate.
     */
    where?: AditivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Aditivos to fetch.
     */
    orderBy?: Enumerable<AditivoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AditivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Aditivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Aditivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Aditivos
    **/
    _count?: true | AditivoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AditivoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AditivoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AditivoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AditivoMaxAggregateInputType
  }

  export type GetAditivoAggregateType<T extends AditivoAggregateArgs> = {
        [P in keyof T & keyof AggregateAditivo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAditivo[P]>
      : GetScalarType<T[P], AggregateAditivo[P]>
  }




  export type AditivoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AditivoWhereInput
    orderBy?: Enumerable<AditivoOrderByWithAggregationInput>
    by: AditivoScalarFieldEnum[]
    having?: AditivoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AditivoCountAggregateInputType | true
    _avg?: AditivoAvgAggregateInputType
    _sum?: AditivoSumAggregateInputType
    _min?: AditivoMinAggregateInputType
    _max?: AditivoMaxAggregateInputType
  }


  export type AditivoGroupByOutputType = {
    id: string
    contratoId: string
    numAditivo: number
    protocoloAdit: string
    novoFimVigencia: Date | null
    valorAdicionalCents: number | null
    createdAt: Date
    _count: AditivoCountAggregateOutputType | null
    _avg: AditivoAvgAggregateOutputType | null
    _sum: AditivoSumAggregateOutputType | null
    _min: AditivoMinAggregateOutputType | null
    _max: AditivoMaxAggregateOutputType | null
  }

  type GetAditivoGroupByPayload<T extends AditivoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<AditivoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AditivoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AditivoGroupByOutputType[P]>
            : GetScalarType<T[P], AditivoGroupByOutputType[P]>
        }
      >
    >


  export type AditivoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contratoId?: boolean
    numAditivo?: boolean
    protocoloAdit?: boolean
    novoFimVigencia?: boolean
    valorAdicionalCents?: boolean
    createdAt?: boolean
    contrato?: boolean | ContratoArgs<ExtArgs>
  }, ExtArgs["result"]["aditivo"]>

  export type AditivoSelectScalar = {
    id?: boolean
    contratoId?: boolean
    numAditivo?: boolean
    protocoloAdit?: boolean
    novoFimVigencia?: boolean
    valorAdicionalCents?: boolean
    createdAt?: boolean
  }

  export type AditivoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    contrato?: boolean | ContratoArgs<ExtArgs>
  }


  type AditivoGetPayload<S extends boolean | null | undefined | AditivoArgs> = $Types.GetResult<AditivoPayload, S>

  type AditivoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<AditivoFindManyArgs, 'select' | 'include'> & {
      select?: AditivoCountAggregateInputType | true
    }

  export interface AditivoDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Aditivo'], meta: { name: 'Aditivo' } }
    /**
     * Find zero or one Aditivo that matches the filter.
     * @param {AditivoFindUniqueArgs} args - Arguments to find a Aditivo
     * @example
     * // Get one Aditivo
     * const aditivo = await prisma.aditivo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AditivoFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, AditivoFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Aditivo'> extends True ? Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Aditivo that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {AditivoFindUniqueOrThrowArgs} args - Arguments to find a Aditivo
     * @example
     * // Get one Aditivo
     * const aditivo = await prisma.aditivo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AditivoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AditivoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Aditivo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AditivoFindFirstArgs} args - Arguments to find a Aditivo
     * @example
     * // Get one Aditivo
     * const aditivo = await prisma.aditivo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AditivoFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, AditivoFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Aditivo'> extends True ? Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Aditivo that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AditivoFindFirstOrThrowArgs} args - Arguments to find a Aditivo
     * @example
     * // Get one Aditivo
     * const aditivo = await prisma.aditivo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AditivoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AditivoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Aditivos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AditivoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Aditivos
     * const aditivos = await prisma.aditivo.findMany()
     * 
     * // Get first 10 Aditivos
     * const aditivos = await prisma.aditivo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aditivoWithIdOnly = await prisma.aditivo.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AditivoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AditivoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Aditivo.
     * @param {AditivoCreateArgs} args - Arguments to create a Aditivo.
     * @example
     * // Create one Aditivo
     * const Aditivo = await prisma.aditivo.create({
     *   data: {
     *     // ... data to create a Aditivo
     *   }
     * })
     * 
    **/
    create<T extends AditivoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AditivoCreateArgs<ExtArgs>>
    ): Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Aditivos.
     *     @param {AditivoCreateManyArgs} args - Arguments to create many Aditivos.
     *     @example
     *     // Create many Aditivos
     *     const aditivo = await prisma.aditivo.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends AditivoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AditivoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Aditivo.
     * @param {AditivoDeleteArgs} args - Arguments to delete one Aditivo.
     * @example
     * // Delete one Aditivo
     * const Aditivo = await prisma.aditivo.delete({
     *   where: {
     *     // ... filter to delete one Aditivo
     *   }
     * })
     * 
    **/
    delete<T extends AditivoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AditivoDeleteArgs<ExtArgs>>
    ): Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Aditivo.
     * @param {AditivoUpdateArgs} args - Arguments to update one Aditivo.
     * @example
     * // Update one Aditivo
     * const aditivo = await prisma.aditivo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AditivoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AditivoUpdateArgs<ExtArgs>>
    ): Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Aditivos.
     * @param {AditivoDeleteManyArgs} args - Arguments to filter Aditivos to delete.
     * @example
     * // Delete a few Aditivos
     * const { count } = await prisma.aditivo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AditivoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AditivoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Aditivos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AditivoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Aditivos
     * const aditivo = await prisma.aditivo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AditivoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AditivoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Aditivo.
     * @param {AditivoUpsertArgs} args - Arguments to update or create a Aditivo.
     * @example
     * // Update or create a Aditivo
     * const aditivo = await prisma.aditivo.upsert({
     *   create: {
     *     // ... data to create a Aditivo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Aditivo we want to update
     *   }
     * })
    **/
    upsert<T extends AditivoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AditivoUpsertArgs<ExtArgs>>
    ): Prisma__AditivoClient<$Types.GetResult<AditivoPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Aditivos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AditivoCountArgs} args - Arguments to filter Aditivos to count.
     * @example
     * // Count the number of Aditivos
     * const count = await prisma.aditivo.count({
     *   where: {
     *     // ... the filter for the Aditivos we want to count
     *   }
     * })
    **/
    count<T extends AditivoCountArgs>(
      args?: Subset<T, AditivoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AditivoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Aditivo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AditivoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AditivoAggregateArgs>(args: Subset<T, AditivoAggregateArgs>): Prisma.PrismaPromise<GetAditivoAggregateType<T>>

    /**
     * Group by Aditivo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AditivoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AditivoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AditivoGroupByArgs['orderBy'] }
        : { orderBy?: AditivoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AditivoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAditivoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Aditivo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AditivoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    contrato<T extends ContratoArgs<ExtArgs> = {}>(args?: Subset<T, ContratoArgs<ExtArgs>>): Prisma__ContratoClient<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Aditivo base type for findUnique actions
   */
  export type AditivoFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * Filter, which Aditivo to fetch.
     */
    where: AditivoWhereUniqueInput
  }

  /**
   * Aditivo findUnique
   */
  export interface AditivoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AditivoFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Aditivo findUniqueOrThrow
   */
  export type AditivoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * Filter, which Aditivo to fetch.
     */
    where: AditivoWhereUniqueInput
  }


  /**
   * Aditivo base type for findFirst actions
   */
  export type AditivoFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * Filter, which Aditivo to fetch.
     */
    where?: AditivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Aditivos to fetch.
     */
    orderBy?: Enumerable<AditivoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Aditivos.
     */
    cursor?: AditivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Aditivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Aditivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Aditivos.
     */
    distinct?: Enumerable<AditivoScalarFieldEnum>
  }

  /**
   * Aditivo findFirst
   */
  export interface AditivoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AditivoFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Aditivo findFirstOrThrow
   */
  export type AditivoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * Filter, which Aditivo to fetch.
     */
    where?: AditivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Aditivos to fetch.
     */
    orderBy?: Enumerable<AditivoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Aditivos.
     */
    cursor?: AditivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Aditivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Aditivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Aditivos.
     */
    distinct?: Enumerable<AditivoScalarFieldEnum>
  }


  /**
   * Aditivo findMany
   */
  export type AditivoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * Filter, which Aditivos to fetch.
     */
    where?: AditivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Aditivos to fetch.
     */
    orderBy?: Enumerable<AditivoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Aditivos.
     */
    cursor?: AditivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Aditivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Aditivos.
     */
    skip?: number
    distinct?: Enumerable<AditivoScalarFieldEnum>
  }


  /**
   * Aditivo create
   */
  export type AditivoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * The data needed to create a Aditivo.
     */
    data: XOR<AditivoCreateInput, AditivoUncheckedCreateInput>
  }


  /**
   * Aditivo createMany
   */
  export type AditivoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Aditivos.
     */
    data: Enumerable<AditivoCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Aditivo update
   */
  export type AditivoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * The data needed to update a Aditivo.
     */
    data: XOR<AditivoUpdateInput, AditivoUncheckedUpdateInput>
    /**
     * Choose, which Aditivo to update.
     */
    where: AditivoWhereUniqueInput
  }


  /**
   * Aditivo updateMany
   */
  export type AditivoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Aditivos.
     */
    data: XOR<AditivoUpdateManyMutationInput, AditivoUncheckedUpdateManyInput>
    /**
     * Filter which Aditivos to update
     */
    where?: AditivoWhereInput
  }


  /**
   * Aditivo upsert
   */
  export type AditivoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * The filter to search for the Aditivo to update in case it exists.
     */
    where: AditivoWhereUniqueInput
    /**
     * In case the Aditivo found by the `where` argument doesn't exist, create a new Aditivo with this data.
     */
    create: XOR<AditivoCreateInput, AditivoUncheckedCreateInput>
    /**
     * In case the Aditivo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AditivoUpdateInput, AditivoUncheckedUpdateInput>
  }


  /**
   * Aditivo delete
   */
  export type AditivoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
    /**
     * Filter which Aditivo to delete.
     */
    where: AditivoWhereUniqueInput
  }


  /**
   * Aditivo deleteMany
   */
  export type AditivoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Aditivos to delete
     */
    where?: AditivoWhereInput
  }


  /**
   * Aditivo without action
   */
  export type AditivoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Aditivo
     */
    select?: AditivoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AditivoInclude<ExtArgs> | null
  }



  /**
   * Model Servico
   */


  export type AggregateServico = {
    _count: ServicoCountAggregateOutputType | null
    _min: ServicoMinAggregateOutputType | null
    _max: ServicoMaxAggregateOutputType | null
  }

  export type ServicoMinAggregateOutputType = {
    id: string | null
    titulo: string | null
    descricao: string | null
    createdAt: Date | null
  }

  export type ServicoMaxAggregateOutputType = {
    id: string | null
    titulo: string | null
    descricao: string | null
    createdAt: Date | null
  }

  export type ServicoCountAggregateOutputType = {
    id: number
    titulo: number
    descricao: number
    createdAt: number
    _all: number
  }


  export type ServicoMinAggregateInputType = {
    id?: true
    titulo?: true
    descricao?: true
    createdAt?: true
  }

  export type ServicoMaxAggregateInputType = {
    id?: true
    titulo?: true
    descricao?: true
    createdAt?: true
  }

  export type ServicoCountAggregateInputType = {
    id?: true
    titulo?: true
    descricao?: true
    createdAt?: true
    _all?: true
  }

  export type ServicoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servico to aggregate.
     */
    where?: ServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicos to fetch.
     */
    orderBy?: Enumerable<ServicoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Servicos
    **/
    _count?: true | ServicoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServicoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServicoMaxAggregateInputType
  }

  export type GetServicoAggregateType<T extends ServicoAggregateArgs> = {
        [P in keyof T & keyof AggregateServico]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServico[P]>
      : GetScalarType<T[P], AggregateServico[P]>
  }




  export type ServicoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ServicoWhereInput
    orderBy?: Enumerable<ServicoOrderByWithAggregationInput>
    by: ServicoScalarFieldEnum[]
    having?: ServicoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServicoCountAggregateInputType | true
    _min?: ServicoMinAggregateInputType
    _max?: ServicoMaxAggregateInputType
  }


  export type ServicoGroupByOutputType = {
    id: string
    titulo: string
    descricao: string | null
    createdAt: Date
    _count: ServicoCountAggregateOutputType | null
    _min: ServicoMinAggregateOutputType | null
    _max: ServicoMaxAggregateOutputType | null
  }

  type GetServicoGroupByPayload<T extends ServicoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ServicoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServicoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServicoGroupByOutputType[P]>
            : GetScalarType<T[P], ServicoGroupByOutputType[P]>
        }
      >
    >


  export type ServicoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    descricao?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["servico"]>

  export type ServicoSelectScalar = {
    id?: boolean
    titulo?: boolean
    descricao?: boolean
    createdAt?: boolean
  }


  type ServicoGetPayload<S extends boolean | null | undefined | ServicoArgs> = $Types.GetResult<ServicoPayload, S>

  type ServicoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<ServicoFindManyArgs, 'select' | 'include'> & {
      select?: ServicoCountAggregateInputType | true
    }

  export interface ServicoDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Servico'], meta: { name: 'Servico' } }
    /**
     * Find zero or one Servico that matches the filter.
     * @param {ServicoFindUniqueArgs} args - Arguments to find a Servico
     * @example
     * // Get one Servico
     * const servico = await prisma.servico.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ServicoFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ServicoFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Servico'> extends True ? Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Servico that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ServicoFindUniqueOrThrowArgs} args - Arguments to find a Servico
     * @example
     * // Get one Servico
     * const servico = await prisma.servico.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ServicoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Servico that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoFindFirstArgs} args - Arguments to find a Servico
     * @example
     * // Get one Servico
     * const servico = await prisma.servico.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ServicoFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ServicoFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Servico'> extends True ? Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Servico that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoFindFirstOrThrowArgs} args - Arguments to find a Servico
     * @example
     * // Get one Servico
     * const servico = await prisma.servico.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ServicoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Servicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servicos
     * const servicos = await prisma.servico.findMany()
     * 
     * // Get first 10 Servicos
     * const servicos = await prisma.servico.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const servicoWithIdOnly = await prisma.servico.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ServicoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Servico.
     * @param {ServicoCreateArgs} args - Arguments to create a Servico.
     * @example
     * // Create one Servico
     * const Servico = await prisma.servico.create({
     *   data: {
     *     // ... data to create a Servico
     *   }
     * })
     * 
    **/
    create<T extends ServicoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ServicoCreateArgs<ExtArgs>>
    ): Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Servicos.
     *     @param {ServicoCreateManyArgs} args - Arguments to create many Servicos.
     *     @example
     *     // Create many Servicos
     *     const servico = await prisma.servico.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ServicoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Servico.
     * @param {ServicoDeleteArgs} args - Arguments to delete one Servico.
     * @example
     * // Delete one Servico
     * const Servico = await prisma.servico.delete({
     *   where: {
     *     // ... filter to delete one Servico
     *   }
     * })
     * 
    **/
    delete<T extends ServicoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ServicoDeleteArgs<ExtArgs>>
    ): Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Servico.
     * @param {ServicoUpdateArgs} args - Arguments to update one Servico.
     * @example
     * // Update one Servico
     * const servico = await prisma.servico.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ServicoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ServicoUpdateArgs<ExtArgs>>
    ): Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Servicos.
     * @param {ServicoDeleteManyArgs} args - Arguments to filter Servicos to delete.
     * @example
     * // Delete a few Servicos
     * const { count } = await prisma.servico.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ServicoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servicos
     * const servico = await prisma.servico.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ServicoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ServicoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Servico.
     * @param {ServicoUpsertArgs} args - Arguments to update or create a Servico.
     * @example
     * // Update or create a Servico
     * const servico = await prisma.servico.upsert({
     *   create: {
     *     // ... data to create a Servico
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Servico we want to update
     *   }
     * })
    **/
    upsert<T extends ServicoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ServicoUpsertArgs<ExtArgs>>
    ): Prisma__ServicoClient<$Types.GetResult<ServicoPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Servicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoCountArgs} args - Arguments to filter Servicos to count.
     * @example
     * // Count the number of Servicos
     * const count = await prisma.servico.count({
     *   where: {
     *     // ... the filter for the Servicos we want to count
     *   }
     * })
    **/
    count<T extends ServicoCountArgs>(
      args?: Subset<T, ServicoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServicoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Servico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServicoAggregateArgs>(args: Subset<T, ServicoAggregateArgs>): Prisma.PrismaPromise<GetServicoAggregateType<T>>

    /**
     * Group by Servico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServicoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServicoGroupByArgs['orderBy'] }
        : { orderBy?: ServicoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServicoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServicoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Servico.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ServicoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Servico base type for findUnique actions
   */
  export type ServicoFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Filter, which Servico to fetch.
     */
    where: ServicoWhereUniqueInput
  }

  /**
   * Servico findUnique
   */
  export interface ServicoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends ServicoFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Servico findUniqueOrThrow
   */
  export type ServicoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Filter, which Servico to fetch.
     */
    where: ServicoWhereUniqueInput
  }


  /**
   * Servico base type for findFirst actions
   */
  export type ServicoFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Filter, which Servico to fetch.
     */
    where?: ServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicos to fetch.
     */
    orderBy?: Enumerable<ServicoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servicos.
     */
    cursor?: ServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servicos.
     */
    distinct?: Enumerable<ServicoScalarFieldEnum>
  }

  /**
   * Servico findFirst
   */
  export interface ServicoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends ServicoFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Servico findFirstOrThrow
   */
  export type ServicoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Filter, which Servico to fetch.
     */
    where?: ServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicos to fetch.
     */
    orderBy?: Enumerable<ServicoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servicos.
     */
    cursor?: ServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servicos.
     */
    distinct?: Enumerable<ServicoScalarFieldEnum>
  }


  /**
   * Servico findMany
   */
  export type ServicoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Filter, which Servicos to fetch.
     */
    where?: ServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicos to fetch.
     */
    orderBy?: Enumerable<ServicoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Servicos.
     */
    cursor?: ServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicos.
     */
    skip?: number
    distinct?: Enumerable<ServicoScalarFieldEnum>
  }


  /**
   * Servico create
   */
  export type ServicoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * The data needed to create a Servico.
     */
    data: XOR<ServicoCreateInput, ServicoUncheckedCreateInput>
  }


  /**
   * Servico createMany
   */
  export type ServicoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Servicos.
     */
    data: Enumerable<ServicoCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Servico update
   */
  export type ServicoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * The data needed to update a Servico.
     */
    data: XOR<ServicoUpdateInput, ServicoUncheckedUpdateInput>
    /**
     * Choose, which Servico to update.
     */
    where: ServicoWhereUniqueInput
  }


  /**
   * Servico updateMany
   */
  export type ServicoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Servicos.
     */
    data: XOR<ServicoUpdateManyMutationInput, ServicoUncheckedUpdateManyInput>
    /**
     * Filter which Servicos to update
     */
    where?: ServicoWhereInput
  }


  /**
   * Servico upsert
   */
  export type ServicoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * The filter to search for the Servico to update in case it exists.
     */
    where: ServicoWhereUniqueInput
    /**
     * In case the Servico found by the `where` argument doesn't exist, create a new Servico with this data.
     */
    create: XOR<ServicoCreateInput, ServicoUncheckedCreateInput>
    /**
     * In case the Servico was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServicoUpdateInput, ServicoUncheckedUpdateInput>
  }


  /**
   * Servico delete
   */
  export type ServicoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Filter which Servico to delete.
     */
    where: ServicoWhereUniqueInput
  }


  /**
   * Servico deleteMany
   */
  export type ServicoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servicos to delete
     */
    where?: ServicoWhereInput
  }


  /**
   * Servico without action
   */
  export type ServicoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
  }



  /**
   * Model AuditLog
   */


  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    tabela: string | null
    registroId: string | null
    action: string | null
    changedBy: string | null
    source: string | null
    changedAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    tabela: string | null
    registroId: string | null
    action: string | null
    changedBy: string | null
    source: string | null
    changedAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    tabela: number
    registroId: number
    action: number
    diff: number
    changedBy: number
    source: number
    changedAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    tabela?: true
    registroId?: true
    action?: true
    changedBy?: true
    source?: true
    changedAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    tabela?: true
    registroId?: true
    action?: true
    changedBy?: true
    source?: true
    changedAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    tabela?: true
    registroId?: true
    action?: true
    diff?: true
    changedBy?: true
    source?: true
    changedAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: Enumerable<AuditLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: Enumerable<AuditLogOrderByWithAggregationInput>
    by: AuditLogScalarFieldEnum[]
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }


  export type AuditLogGroupByOutputType = {
    id: string
    tabela: string
    registroId: string
    action: string
    diff: JsonValue
    changedBy: string | null
    source: string | null
    changedAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tabela?: boolean
    registroId?: boolean
    action?: boolean
    diff?: boolean
    changedBy?: boolean
    source?: boolean
    changedAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    tabela?: boolean
    registroId?: boolean
    action?: boolean
    diff?: boolean
    changedBy?: boolean
    source?: boolean
    changedAt?: boolean
  }


  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogArgs> = $Types.GetResult<AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<AuditLogFindManyArgs, 'select' | 'include'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AuditLogFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'AuditLog'> extends True ? Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one AuditLog that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AuditLogFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'AuditLog'> extends True ? Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AuditLogFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
    **/
    create<T extends AuditLogCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>
    ): Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many AuditLogs.
     *     @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     *     @example
     *     // Create many AuditLogs
     *     const auditLog = await prisma.auditLog.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends AuditLogCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
    **/
    delete<T extends AuditLogDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>
    ): Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AuditLogUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>
    ): Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AuditLogDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AuditLogUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
    **/
    upsert<T extends AuditLogUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>
    ): Prisma__AuditLogClient<$Types.GetResult<AuditLogPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * AuditLog base type for findUnique actions
   */
  export type AuditLogFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUnique
   */
  export interface AuditLogFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AuditLogFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }


  /**
   * AuditLog base type for findFirst actions
   */
  export type AuditLogFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: Enumerable<AuditLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: Enumerable<AuditLogScalarFieldEnum>
  }

  /**
   * AuditLog findFirst
   */
  export interface AuditLogFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AuditLogFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: Enumerable<AuditLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: Enumerable<AuditLogScalarFieldEnum>
  }


  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: Enumerable<AuditLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: Enumerable<AuditLogScalarFieldEnum>
  }


  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }


  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: Enumerable<AuditLogCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }


  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
  }


  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }


  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }


  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
  }


  /**
   * AuditLog without action
   */
  export type AuditLogArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
  }



  /**
   * Model User
   */


  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    sub: string | null
    email: string | null
    role: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    sub: string | null
    email: string | null
    role: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    sub: number
    email: number
    role: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    sub?: true
    email?: true
    role?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    sub?: true
    email?: true
    role?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    sub?: true
    email?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: Enumerable<UserOrderByWithAggregationInput>
    by: UserScalarFieldEnum[]
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }


  export type UserGroupByOutputType = {
    id: string
    sub: string | null
    email: string | null
    role: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sub?: boolean
    email?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    sub?: boolean
    email?: boolean
    role?: boolean
    createdAt?: boolean
  }


  type UserGetPayload<S extends boolean | null | undefined | UserArgs> = $Types.GetResult<UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'User'> extends True ? Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'User'> extends True ? Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<UserPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * User base type for findUnique actions
   */
  export type UserFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUnique
   */
  export interface UserFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends UserFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User base type for findFirst actions
   */
  export type UserFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: Enumerable<UserScalarFieldEnum>
  }

  /**
   * User findFirst
   */
  export interface UserFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends UserFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }


  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: Enumerable<UserCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }


  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }


  /**
   * User without action
   */
  export type UserArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UnidadeFspScalarFieldEnum: {
    id: 'id',
    sigla: 'sigla',
    nome: 'nome'
  };

  export type UnidadeFspScalarFieldEnum = (typeof UnidadeFspScalarFieldEnum)[keyof typeof UnidadeFspScalarFieldEnum]


  export const MunicipioScalarFieldEnum: {
    id: 'id',
    codigoIbge: 'codigoIbge',
    nome: 'nome',
    uf: 'uf',
    regiaoAdministrativa: 'regiaoAdministrativa'
  };

  export type MunicipioScalarFieldEnum = (typeof MunicipioScalarFieldEnum)[keyof typeof MunicipioScalarFieldEnum]


  export const DominioScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    nome: 'nome',
    descricao: 'descricao',
    editavelPeloUsuario: 'editavelPeloUsuario',
    permiteHierarquia: 'permiteHierarquia',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DominioScalarFieldEnum = (typeof DominioScalarFieldEnum)[keyof typeof DominioScalarFieldEnum]


  export const DominioValorScalarFieldEnum: {
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

  export type DominioValorScalarFieldEnum = (typeof DominioValorScalarFieldEnum)[keyof typeof DominioValorScalarFieldEnum]


  export const OrgaoScalarFieldEnum: {
    id: 'id',
    sigla: 'sigla',
    nome: 'nome',
    tipo: 'tipo',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrgaoScalarFieldEnum = (typeof OrgaoScalarFieldEnum)[keyof typeof OrgaoScalarFieldEnum]


  export const UnidadeOrganizacionalScalarFieldEnum: {
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

  export type UnidadeOrganizacionalScalarFieldEnum = (typeof UnidadeOrganizacionalScalarFieldEnum)[keyof typeof UnidadeOrganizacionalScalarFieldEnum]


  export const FornecedorScalarFieldEnum: {
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

  export type FornecedorScalarFieldEnum = (typeof FornecedorScalarFieldEnum)[keyof typeof FornecedorScalarFieldEnum]


  export const FornecedorContatoScalarFieldEnum: {
    id: 'id',
    fornecedorId: 'fornecedorId',
    nome: 'nome',
    cargo: 'cargo',
    email: 'email',
    telefone: 'telefone',
    principal: 'principal',
    createdAt: 'createdAt'
  };

  export type FornecedorContatoScalarFieldEnum = (typeof FornecedorContatoScalarFieldEnum)[keyof typeof FornecedorContatoScalarFieldEnum]


  export const FornecedorSancaoScalarFieldEnum: {
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

  export type FornecedorSancaoScalarFieldEnum = (typeof FornecedorSancaoScalarFieldEnum)[keyof typeof FornecedorSancaoScalarFieldEnum]


  export const ServidorScalarFieldEnum: {
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

  export type ServidorScalarFieldEnum = (typeof ServidorScalarFieldEnum)[keyof typeof ServidorScalarFieldEnum]


  export const ContratoScalarFieldEnum: {
    id: 'id',
    protocoloCabeca: 'protocoloCabeca',
    numGms: 'numGms',
    anoGms: 'anoGms',
    unidadeFspId: 'unidadeFspId',
    gestorId: 'gestorId',
    fiscalId: 'fiscalId',
    fornecedorId: 'fornecedorId',
    modalidade: 'modalidade',
    objeto: 'objeto',
    valorAnualCents: 'valorAnualCents',
    dataInicio: 'dataInicio',
    dataFimOrig: 'dataFimOrig',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ContratoScalarFieldEnum = (typeof ContratoScalarFieldEnum)[keyof typeof ContratoScalarFieldEnum]


  export const AditivoScalarFieldEnum: {
    id: 'id',
    contratoId: 'contratoId',
    numAditivo: 'numAditivo',
    protocoloAdit: 'protocoloAdit',
    novoFimVigencia: 'novoFimVigencia',
    valorAdicionalCents: 'valorAdicionalCents',
    createdAt: 'createdAt'
  };

  export type AditivoScalarFieldEnum = (typeof AditivoScalarFieldEnum)[keyof typeof AditivoScalarFieldEnum]


  export const ServicoScalarFieldEnum: {
    id: 'id',
    titulo: 'titulo',
    descricao: 'descricao',
    createdAt: 'createdAt'
  };

  export type ServicoScalarFieldEnum = (typeof ServicoScalarFieldEnum)[keyof typeof ServicoScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    tabela: 'tabela',
    registroId: 'registroId',
    action: 'action',
    diff: 'diff',
    changedBy: 'changedBy',
    source: 'source',
    changedAt: 'changedAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    sub: 'sub',
    email: 'email',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Deep Input Types
   */


  export type UnidadeFspWhereInput = {
    AND?: Enumerable<UnidadeFspWhereInput>
    OR?: Enumerable<UnidadeFspWhereInput>
    NOT?: Enumerable<UnidadeFspWhereInput>
    id?: StringFilter | string
    sigla?: StringFilter | string
    nome?: StringFilter | string
    contratos?: ContratoListRelationFilter
  }

  export type UnidadeFspOrderByWithRelationInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    contratos?: ContratoOrderByRelationAggregateInput
  }

  export type UnidadeFspWhereUniqueInput = {
    id?: string
    sigla?: string
  }

  export type UnidadeFspOrderByWithAggregationInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    _count?: UnidadeFspCountOrderByAggregateInput
    _max?: UnidadeFspMaxOrderByAggregateInput
    _min?: UnidadeFspMinOrderByAggregateInput
  }

  export type UnidadeFspScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UnidadeFspScalarWhereWithAggregatesInput>
    OR?: Enumerable<UnidadeFspScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UnidadeFspScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    sigla?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
  }

  export type MunicipioWhereInput = {
    AND?: Enumerable<MunicipioWhereInput>
    OR?: Enumerable<MunicipioWhereInput>
    NOT?: Enumerable<MunicipioWhereInput>
    id?: StringFilter | string
    codigoIbge?: StringFilter | string
    nome?: StringFilter | string
    uf?: StringFilter | string
    regiaoAdministrativa?: StringNullableFilter | string | null
    unidades?: UnidadeOrganizacionalListRelationFilter
    fornecedores?: FornecedorListRelationFilter
  }

  export type MunicipioOrderByWithRelationInput = {
    id?: SortOrder
    codigoIbge?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
    regiaoAdministrativa?: SortOrderInput | SortOrder
    unidades?: UnidadeOrganizacionalOrderByRelationAggregateInput
    fornecedores?: FornecedorOrderByRelationAggregateInput
  }

  export type MunicipioWhereUniqueInput = {
    id?: string
    codigoIbge?: string
  }

  export type MunicipioOrderByWithAggregationInput = {
    id?: SortOrder
    codigoIbge?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
    regiaoAdministrativa?: SortOrderInput | SortOrder
    _count?: MunicipioCountOrderByAggregateInput
    _max?: MunicipioMaxOrderByAggregateInput
    _min?: MunicipioMinOrderByAggregateInput
  }

  export type MunicipioScalarWhereWithAggregatesInput = {
    AND?: Enumerable<MunicipioScalarWhereWithAggregatesInput>
    OR?: Enumerable<MunicipioScalarWhereWithAggregatesInput>
    NOT?: Enumerable<MunicipioScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    codigoIbge?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
    uf?: StringWithAggregatesFilter | string
    regiaoAdministrativa?: StringNullableWithAggregatesFilter | string | null
  }

  export type DominioWhereInput = {
    AND?: Enumerable<DominioWhereInput>
    OR?: Enumerable<DominioWhereInput>
    NOT?: Enumerable<DominioWhereInput>
    id?: StringFilter | string
    slug?: StringFilter | string
    nome?: StringFilter | string
    descricao?: StringNullableFilter | string | null
    editavelPeloUsuario?: BoolFilter | boolean
    permiteHierarquia?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    valores?: DominioValorListRelationFilter
  }

  export type DominioOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    nome?: SortOrder
    descricao?: SortOrderInput | SortOrder
    editavelPeloUsuario?: SortOrder
    permiteHierarquia?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    valores?: DominioValorOrderByRelationAggregateInput
  }

  export type DominioWhereUniqueInput = {
    id?: string
    slug?: string
  }

  export type DominioOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    nome?: SortOrder
    descricao?: SortOrderInput | SortOrder
    editavelPeloUsuario?: SortOrder
    permiteHierarquia?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DominioCountOrderByAggregateInput
    _max?: DominioMaxOrderByAggregateInput
    _min?: DominioMinOrderByAggregateInput
  }

  export type DominioScalarWhereWithAggregatesInput = {
    AND?: Enumerable<DominioScalarWhereWithAggregatesInput>
    OR?: Enumerable<DominioScalarWhereWithAggregatesInput>
    NOT?: Enumerable<DominioScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    slug?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
    descricao?: StringNullableWithAggregatesFilter | string | null
    editavelPeloUsuario?: BoolWithAggregatesFilter | boolean
    permiteHierarquia?: BoolWithAggregatesFilter | boolean
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type DominioValorWhereInput = {
    AND?: Enumerable<DominioValorWhereInput>
    OR?: Enumerable<DominioValorWhereInput>
    NOT?: Enumerable<DominioValorWhereInput>
    id?: StringFilter | string
    dominioId?: StringFilter | string
    codigo?: StringFilter | string
    label?: StringFilter | string
    parentId?: StringNullableFilter | string | null
    ordem?: IntFilter | number
    ativo?: BoolFilter | boolean
    metadata?: JsonNullableFilter
    codigoLegado?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    dominio?: XOR<DominioRelationFilter, DominioWhereInput>
    parent?: XOR<DominioValorRelationFilter, DominioValorWhereInput> | null
    children?: DominioValorListRelationFilter
  }

  export type DominioValorOrderByWithRelationInput = {
    id?: SortOrder
    dominioId?: SortOrder
    codigo?: SortOrder
    label?: SortOrder
    parentId?: SortOrderInput | SortOrder
    ordem?: SortOrder
    ativo?: SortOrder
    metadata?: SortOrderInput | SortOrder
    codigoLegado?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dominio?: DominioOrderByWithRelationInput
    parent?: DominioValorOrderByWithRelationInput
    children?: DominioValorOrderByRelationAggregateInput
  }

  export type DominioValorWhereUniqueInput = {
    id?: string
    dominioId_codigo?: DominioValorDominioIdCodigoCompoundUniqueInput
  }

  export type DominioValorOrderByWithAggregationInput = {
    id?: SortOrder
    dominioId?: SortOrder
    codigo?: SortOrder
    label?: SortOrder
    parentId?: SortOrderInput | SortOrder
    ordem?: SortOrder
    ativo?: SortOrder
    metadata?: SortOrderInput | SortOrder
    codigoLegado?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DominioValorCountOrderByAggregateInput
    _avg?: DominioValorAvgOrderByAggregateInput
    _max?: DominioValorMaxOrderByAggregateInput
    _min?: DominioValorMinOrderByAggregateInput
    _sum?: DominioValorSumOrderByAggregateInput
  }

  export type DominioValorScalarWhereWithAggregatesInput = {
    AND?: Enumerable<DominioValorScalarWhereWithAggregatesInput>
    OR?: Enumerable<DominioValorScalarWhereWithAggregatesInput>
    NOT?: Enumerable<DominioValorScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    dominioId?: StringWithAggregatesFilter | string
    codigo?: StringWithAggregatesFilter | string
    label?: StringWithAggregatesFilter | string
    parentId?: StringNullableWithAggregatesFilter | string | null
    ordem?: IntWithAggregatesFilter | number
    ativo?: BoolWithAggregatesFilter | boolean
    metadata?: JsonNullableWithAggregatesFilter
    codigoLegado?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type OrgaoWhereInput = {
    AND?: Enumerable<OrgaoWhereInput>
    OR?: Enumerable<OrgaoWhereInput>
    NOT?: Enumerable<OrgaoWhereInput>
    id?: StringFilter | string
    sigla?: StringFilter | string
    nome?: StringFilter | string
    tipo?: EnumTipoOrgaoFilter | TipoOrgao
    ativo?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    unidades?: UnidadeOrganizacionalListRelationFilter
    servidores?: ServidorListRelationFilter
  }

  export type OrgaoOrderByWithRelationInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    unidades?: UnidadeOrganizacionalOrderByRelationAggregateInput
    servidores?: ServidorOrderByRelationAggregateInput
  }

  export type OrgaoWhereUniqueInput = {
    id?: string
    sigla?: string
  }

  export type OrgaoOrderByWithAggregationInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrgaoCountOrderByAggregateInput
    _max?: OrgaoMaxOrderByAggregateInput
    _min?: OrgaoMinOrderByAggregateInput
  }

  export type OrgaoScalarWhereWithAggregatesInput = {
    AND?: Enumerable<OrgaoScalarWhereWithAggregatesInput>
    OR?: Enumerable<OrgaoScalarWhereWithAggregatesInput>
    NOT?: Enumerable<OrgaoScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    sigla?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
    tipo?: EnumTipoOrgaoWithAggregatesFilter | TipoOrgao
    ativo?: BoolWithAggregatesFilter | boolean
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type UnidadeOrganizacionalWhereInput = {
    AND?: Enumerable<UnidadeOrganizacionalWhereInput>
    OR?: Enumerable<UnidadeOrganizacionalWhereInput>
    NOT?: Enumerable<UnidadeOrganizacionalWhereInput>
    id?: StringFilter | string
    orgaoId?: StringFilter | string
    parentId?: StringNullableFilter | string | null
    sigla?: StringFilter | string
    nome?: StringFilter | string
    nivel?: EnumNivelUnidadeFilter | NivelUnidade
    municipioId?: StringFilter | string
    ativo?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    orgao?: XOR<OrgaoRelationFilter, OrgaoWhereInput>
    parent?: XOR<UnidadeOrganizacionalRelationFilter, UnidadeOrganizacionalWhereInput> | null
    children?: UnidadeOrganizacionalListRelationFilter
    municipio?: XOR<MunicipioRelationFilter, MunicipioWhereInput>
    servidores?: ServidorListRelationFilter
  }

  export type UnidadeOrganizacionalOrderByWithRelationInput = {
    id?: SortOrder
    orgaoId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    nivel?: SortOrder
    municipioId?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    orgao?: OrgaoOrderByWithRelationInput
    parent?: UnidadeOrganizacionalOrderByWithRelationInput
    children?: UnidadeOrganizacionalOrderByRelationAggregateInput
    municipio?: MunicipioOrderByWithRelationInput
    servidores?: ServidorOrderByRelationAggregateInput
  }

  export type UnidadeOrganizacionalWhereUniqueInput = {
    id?: string
    orgaoId_sigla?: UnidadeOrganizacionalOrgaoIdSiglaCompoundUniqueInput
  }

  export type UnidadeOrganizacionalOrderByWithAggregationInput = {
    id?: SortOrder
    orgaoId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    nivel?: SortOrder
    municipioId?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UnidadeOrganizacionalCountOrderByAggregateInput
    _max?: UnidadeOrganizacionalMaxOrderByAggregateInput
    _min?: UnidadeOrganizacionalMinOrderByAggregateInput
  }

  export type UnidadeOrganizacionalScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UnidadeOrganizacionalScalarWhereWithAggregatesInput>
    OR?: Enumerable<UnidadeOrganizacionalScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UnidadeOrganizacionalScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    orgaoId?: StringWithAggregatesFilter | string
    parentId?: StringNullableWithAggregatesFilter | string | null
    sigla?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
    nivel?: EnumNivelUnidadeWithAggregatesFilter | NivelUnidade
    municipioId?: StringWithAggregatesFilter | string
    ativo?: BoolWithAggregatesFilter | boolean
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type FornecedorWhereInput = {
    AND?: Enumerable<FornecedorWhereInput>
    OR?: Enumerable<FornecedorWhereInput>
    NOT?: Enumerable<FornecedorWhereInput>
    id?: StringFilter | string
    tipoPessoa?: EnumTipoPessoaFilter | TipoPessoa
    documento?: StringFilter | string
    razaoSocial?: StringFilter | string
    nomeFantasia?: StringNullableFilter | string | null
    inscricaoEstadual?: StringNullableFilter | string | null
    porte?: EnumPorteEmpresaNullableFilter | PorteEmpresa | null
    municipioId?: StringNullableFilter | string | null
    situacao?: EnumSituacaoFornecedorFilter | SituacaoFornecedor
    codigoLegado?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    municipio?: XOR<MunicipioRelationFilter, MunicipioWhereInput> | null
    contatos?: FornecedorContatoListRelationFilter
    sancoes?: FornecedorSancaoListRelationFilter
    contratos?: ContratoListRelationFilter
  }

  export type FornecedorOrderByWithRelationInput = {
    id?: SortOrder
    tipoPessoa?: SortOrder
    documento?: SortOrder
    razaoSocial?: SortOrder
    nomeFantasia?: SortOrderInput | SortOrder
    inscricaoEstadual?: SortOrderInput | SortOrder
    porte?: SortOrderInput | SortOrder
    municipioId?: SortOrderInput | SortOrder
    situacao?: SortOrder
    codigoLegado?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    municipio?: MunicipioOrderByWithRelationInput
    contatos?: FornecedorContatoOrderByRelationAggregateInput
    sancoes?: FornecedorSancaoOrderByRelationAggregateInput
    contratos?: ContratoOrderByRelationAggregateInput
  }

  export type FornecedorWhereUniqueInput = {
    id?: string
    documento?: string
  }

  export type FornecedorOrderByWithAggregationInput = {
    id?: SortOrder
    tipoPessoa?: SortOrder
    documento?: SortOrder
    razaoSocial?: SortOrder
    nomeFantasia?: SortOrderInput | SortOrder
    inscricaoEstadual?: SortOrderInput | SortOrder
    porte?: SortOrderInput | SortOrder
    municipioId?: SortOrderInput | SortOrder
    situacao?: SortOrder
    codigoLegado?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FornecedorCountOrderByAggregateInput
    _max?: FornecedorMaxOrderByAggregateInput
    _min?: FornecedorMinOrderByAggregateInput
  }

  export type FornecedorScalarWhereWithAggregatesInput = {
    AND?: Enumerable<FornecedorScalarWhereWithAggregatesInput>
    OR?: Enumerable<FornecedorScalarWhereWithAggregatesInput>
    NOT?: Enumerable<FornecedorScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    tipoPessoa?: EnumTipoPessoaWithAggregatesFilter | TipoPessoa
    documento?: StringWithAggregatesFilter | string
    razaoSocial?: StringWithAggregatesFilter | string
    nomeFantasia?: StringNullableWithAggregatesFilter | string | null
    inscricaoEstadual?: StringNullableWithAggregatesFilter | string | null
    porte?: EnumPorteEmpresaNullableWithAggregatesFilter | PorteEmpresa | null
    municipioId?: StringNullableWithAggregatesFilter | string | null
    situacao?: EnumSituacaoFornecedorWithAggregatesFilter | SituacaoFornecedor
    codigoLegado?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type FornecedorContatoWhereInput = {
    AND?: Enumerable<FornecedorContatoWhereInput>
    OR?: Enumerable<FornecedorContatoWhereInput>
    NOT?: Enumerable<FornecedorContatoWhereInput>
    id?: StringFilter | string
    fornecedorId?: StringFilter | string
    nome?: StringFilter | string
    cargo?: StringNullableFilter | string | null
    email?: StringNullableFilter | string | null
    telefone?: StringNullableFilter | string | null
    principal?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
    fornecedor?: XOR<FornecedorRelationFilter, FornecedorWhereInput>
  }

  export type FornecedorContatoOrderByWithRelationInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    principal?: SortOrder
    createdAt?: SortOrder
    fornecedor?: FornecedorOrderByWithRelationInput
  }

  export type FornecedorContatoWhereUniqueInput = {
    id?: string
  }

  export type FornecedorContatoOrderByWithAggregationInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    principal?: SortOrder
    createdAt?: SortOrder
    _count?: FornecedorContatoCountOrderByAggregateInput
    _max?: FornecedorContatoMaxOrderByAggregateInput
    _min?: FornecedorContatoMinOrderByAggregateInput
  }

  export type FornecedorContatoScalarWhereWithAggregatesInput = {
    AND?: Enumerable<FornecedorContatoScalarWhereWithAggregatesInput>
    OR?: Enumerable<FornecedorContatoScalarWhereWithAggregatesInput>
    NOT?: Enumerable<FornecedorContatoScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    fornecedorId?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
    cargo?: StringNullableWithAggregatesFilter | string | null
    email?: StringNullableWithAggregatesFilter | string | null
    telefone?: StringNullableWithAggregatesFilter | string | null
    principal?: BoolWithAggregatesFilter | boolean
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type FornecedorSancaoWhereInput = {
    AND?: Enumerable<FornecedorSancaoWhereInput>
    OR?: Enumerable<FornecedorSancaoWhereInput>
    NOT?: Enumerable<FornecedorSancaoWhereInput>
    id?: StringFilter | string
    fornecedorId?: StringFilter | string
    tipo?: EnumTipoSancaoFilter | TipoSancao
    processo?: StringNullableFilter | string | null
    dataInicio?: DateTimeFilter | Date | string
    dataFim?: DateTimeNullableFilter | Date | string | null
    abrangencia?: StringNullableFilter | string | null
    fonte?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    fornecedor?: XOR<FornecedorRelationFilter, FornecedorWhereInput>
  }

  export type FornecedorSancaoOrderByWithRelationInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    tipo?: SortOrder
    processo?: SortOrderInput | SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrderInput | SortOrder
    abrangencia?: SortOrderInput | SortOrder
    fonte?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    fornecedor?: FornecedorOrderByWithRelationInput
  }

  export type FornecedorSancaoWhereUniqueInput = {
    id?: string
  }

  export type FornecedorSancaoOrderByWithAggregationInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    tipo?: SortOrder
    processo?: SortOrderInput | SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrderInput | SortOrder
    abrangencia?: SortOrderInput | SortOrder
    fonte?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FornecedorSancaoCountOrderByAggregateInput
    _max?: FornecedorSancaoMaxOrderByAggregateInput
    _min?: FornecedorSancaoMinOrderByAggregateInput
  }

  export type FornecedorSancaoScalarWhereWithAggregatesInput = {
    AND?: Enumerable<FornecedorSancaoScalarWhereWithAggregatesInput>
    OR?: Enumerable<FornecedorSancaoScalarWhereWithAggregatesInput>
    NOT?: Enumerable<FornecedorSancaoScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    fornecedorId?: StringWithAggregatesFilter | string
    tipo?: EnumTipoSancaoWithAggregatesFilter | TipoSancao
    processo?: StringNullableWithAggregatesFilter | string | null
    dataInicio?: DateTimeWithAggregatesFilter | Date | string
    dataFim?: DateTimeNullableWithAggregatesFilter | Date | string | null
    abrangencia?: StringNullableWithAggregatesFilter | string | null
    fonte?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type ServidorWhereInput = {
    AND?: Enumerable<ServidorWhereInput>
    OR?: Enumerable<ServidorWhereInput>
    NOT?: Enumerable<ServidorWhereInput>
    id?: StringFilter | string
    nome?: StringFilter | string
    cpf?: StringNullableFilter | string | null
    rgFuncional?: StringNullableFilter | string | null
    cargo?: StringNullableFilter | string | null
    orgaoId?: StringNullableFilter | string | null
    unidadeId?: StringNullableFilter | string | null
    email?: StringNullableFilter | string | null
    telefone?: StringNullableFilter | string | null
    ativo?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    orgao?: XOR<OrgaoRelationFilter, OrgaoWhereInput> | null
    unidade?: XOR<UnidadeOrganizacionalRelationFilter, UnidadeOrganizacionalWhereInput> | null
    gestorContratos?: ContratoListRelationFilter
    fiscalContratos?: ContratoListRelationFilter
  }

  export type ServidorOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrderInput | SortOrder
    rgFuncional?: SortOrderInput | SortOrder
    cargo?: SortOrderInput | SortOrder
    orgaoId?: SortOrderInput | SortOrder
    unidadeId?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    orgao?: OrgaoOrderByWithRelationInput
    unidade?: UnidadeOrganizacionalOrderByWithRelationInput
    gestorContratos?: ContratoOrderByRelationAggregateInput
    fiscalContratos?: ContratoOrderByRelationAggregateInput
  }

  export type ServidorWhereUniqueInput = {
    id?: string
    cpf?: string
    rgFuncional?: string
  }

  export type ServidorOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrderInput | SortOrder
    rgFuncional?: SortOrderInput | SortOrder
    cargo?: SortOrderInput | SortOrder
    orgaoId?: SortOrderInput | SortOrder
    unidadeId?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ServidorCountOrderByAggregateInput
    _max?: ServidorMaxOrderByAggregateInput
    _min?: ServidorMinOrderByAggregateInput
  }

  export type ServidorScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ServidorScalarWhereWithAggregatesInput>
    OR?: Enumerable<ServidorScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ServidorScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
    cpf?: StringNullableWithAggregatesFilter | string | null
    rgFuncional?: StringNullableWithAggregatesFilter | string | null
    cargo?: StringNullableWithAggregatesFilter | string | null
    orgaoId?: StringNullableWithAggregatesFilter | string | null
    unidadeId?: StringNullableWithAggregatesFilter | string | null
    email?: StringNullableWithAggregatesFilter | string | null
    telefone?: StringNullableWithAggregatesFilter | string | null
    ativo?: BoolWithAggregatesFilter | boolean
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type ContratoWhereInput = {
    AND?: Enumerable<ContratoWhereInput>
    OR?: Enumerable<ContratoWhereInput>
    NOT?: Enumerable<ContratoWhereInput>
    id?: StringFilter | string
    protocoloCabeca?: StringNullableFilter | string | null
    numGms?: IntFilter | number
    anoGms?: IntFilter | number
    unidadeFspId?: StringFilter | string
    gestorId?: StringFilter | string
    fiscalId?: StringFilter | string
    fornecedorId?: StringFilter | string
    modalidade?: StringFilter | string
    objeto?: StringFilter | string
    valorAnualCents?: IntFilter | number
    dataInicio?: DateTimeNullableFilter | Date | string | null
    dataFimOrig?: DateTimeNullableFilter | Date | string | null
    status?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    unidadeFsp?: XOR<UnidadeFspRelationFilter, UnidadeFspWhereInput>
    gestor?: XOR<ServidorRelationFilter, ServidorWhereInput>
    fiscal?: XOR<ServidorRelationFilter, ServidorWhereInput>
    fornecedor?: XOR<FornecedorRelationFilter, FornecedorWhereInput>
    aditivos?: AditivoListRelationFilter
  }

  export type ContratoOrderByWithRelationInput = {
    id?: SortOrder
    protocoloCabeca?: SortOrderInput | SortOrder
    numGms?: SortOrder
    anoGms?: SortOrder
    unidadeFspId?: SortOrder
    gestorId?: SortOrder
    fiscalId?: SortOrder
    fornecedorId?: SortOrder
    modalidade?: SortOrder
    objeto?: SortOrder
    valorAnualCents?: SortOrder
    dataInicio?: SortOrderInput | SortOrder
    dataFimOrig?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    unidadeFsp?: UnidadeFspOrderByWithRelationInput
    gestor?: ServidorOrderByWithRelationInput
    fiscal?: ServidorOrderByWithRelationInput
    fornecedor?: FornecedorOrderByWithRelationInput
    aditivos?: AditivoOrderByRelationAggregateInput
  }

  export type ContratoWhereUniqueInput = {
    id?: string
    protocoloCabeca?: string
    numGms_anoGms?: ContratoNumGmsAnoGmsCompoundUniqueInput
  }

  export type ContratoOrderByWithAggregationInput = {
    id?: SortOrder
    protocoloCabeca?: SortOrderInput | SortOrder
    numGms?: SortOrder
    anoGms?: SortOrder
    unidadeFspId?: SortOrder
    gestorId?: SortOrder
    fiscalId?: SortOrder
    fornecedorId?: SortOrder
    modalidade?: SortOrder
    objeto?: SortOrder
    valorAnualCents?: SortOrder
    dataInicio?: SortOrderInput | SortOrder
    dataFimOrig?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ContratoCountOrderByAggregateInput
    _avg?: ContratoAvgOrderByAggregateInput
    _max?: ContratoMaxOrderByAggregateInput
    _min?: ContratoMinOrderByAggregateInput
    _sum?: ContratoSumOrderByAggregateInput
  }

  export type ContratoScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ContratoScalarWhereWithAggregatesInput>
    OR?: Enumerable<ContratoScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ContratoScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    protocoloCabeca?: StringNullableWithAggregatesFilter | string | null
    numGms?: IntWithAggregatesFilter | number
    anoGms?: IntWithAggregatesFilter | number
    unidadeFspId?: StringWithAggregatesFilter | string
    gestorId?: StringWithAggregatesFilter | string
    fiscalId?: StringWithAggregatesFilter | string
    fornecedorId?: StringWithAggregatesFilter | string
    modalidade?: StringWithAggregatesFilter | string
    objeto?: StringWithAggregatesFilter | string
    valorAnualCents?: IntWithAggregatesFilter | number
    dataInicio?: DateTimeNullableWithAggregatesFilter | Date | string | null
    dataFimOrig?: DateTimeNullableWithAggregatesFilter | Date | string | null
    status?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type AditivoWhereInput = {
    AND?: Enumerable<AditivoWhereInput>
    OR?: Enumerable<AditivoWhereInput>
    NOT?: Enumerable<AditivoWhereInput>
    id?: StringFilter | string
    contratoId?: StringFilter | string
    numAditivo?: IntFilter | number
    protocoloAdit?: StringFilter | string
    novoFimVigencia?: DateTimeNullableFilter | Date | string | null
    valorAdicionalCents?: IntNullableFilter | number | null
    createdAt?: DateTimeFilter | Date | string
    contrato?: XOR<ContratoRelationFilter, ContratoWhereInput>
  }

  export type AditivoOrderByWithRelationInput = {
    id?: SortOrder
    contratoId?: SortOrder
    numAditivo?: SortOrder
    protocoloAdit?: SortOrder
    novoFimVigencia?: SortOrderInput | SortOrder
    valorAdicionalCents?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    contrato?: ContratoOrderByWithRelationInput
  }

  export type AditivoWhereUniqueInput = {
    id?: string
  }

  export type AditivoOrderByWithAggregationInput = {
    id?: SortOrder
    contratoId?: SortOrder
    numAditivo?: SortOrder
    protocoloAdit?: SortOrder
    novoFimVigencia?: SortOrderInput | SortOrder
    valorAdicionalCents?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AditivoCountOrderByAggregateInput
    _avg?: AditivoAvgOrderByAggregateInput
    _max?: AditivoMaxOrderByAggregateInput
    _min?: AditivoMinOrderByAggregateInput
    _sum?: AditivoSumOrderByAggregateInput
  }

  export type AditivoScalarWhereWithAggregatesInput = {
    AND?: Enumerable<AditivoScalarWhereWithAggregatesInput>
    OR?: Enumerable<AditivoScalarWhereWithAggregatesInput>
    NOT?: Enumerable<AditivoScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    contratoId?: StringWithAggregatesFilter | string
    numAditivo?: IntWithAggregatesFilter | number
    protocoloAdit?: StringWithAggregatesFilter | string
    novoFimVigencia?: DateTimeNullableWithAggregatesFilter | Date | string | null
    valorAdicionalCents?: IntNullableWithAggregatesFilter | number | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type ServicoWhereInput = {
    AND?: Enumerable<ServicoWhereInput>
    OR?: Enumerable<ServicoWhereInput>
    NOT?: Enumerable<ServicoWhereInput>
    id?: StringFilter | string
    titulo?: StringFilter | string
    descricao?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
  }

  export type ServicoOrderByWithRelationInput = {
    id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type ServicoWhereUniqueInput = {
    id?: string
  }

  export type ServicoOrderByWithAggregationInput = {
    id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ServicoCountOrderByAggregateInput
    _max?: ServicoMaxOrderByAggregateInput
    _min?: ServicoMinOrderByAggregateInput
  }

  export type ServicoScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ServicoScalarWhereWithAggregatesInput>
    OR?: Enumerable<ServicoScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ServicoScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    titulo?: StringWithAggregatesFilter | string
    descricao?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: Enumerable<AuditLogWhereInput>
    OR?: Enumerable<AuditLogWhereInput>
    NOT?: Enumerable<AuditLogWhereInput>
    id?: StringFilter | string
    tabela?: StringFilter | string
    registroId?: StringFilter | string
    action?: StringFilter | string
    diff?: JsonFilter
    changedBy?: StringNullableFilter | string | null
    source?: StringNullableFilter | string | null
    changedAt?: DateTimeFilter | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    tabela?: SortOrder
    registroId?: SortOrder
    action?: SortOrder
    diff?: SortOrder
    changedBy?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    changedAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = {
    id?: string
  }

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    tabela?: SortOrder
    registroId?: SortOrder
    action?: SortOrder
    diff?: SortOrder
    changedBy?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    changedAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: Enumerable<AuditLogScalarWhereWithAggregatesInput>
    OR?: Enumerable<AuditLogScalarWhereWithAggregatesInput>
    NOT?: Enumerable<AuditLogScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    tabela?: StringWithAggregatesFilter | string
    registroId?: StringWithAggregatesFilter | string
    action?: StringWithAggregatesFilter | string
    diff?: JsonWithAggregatesFilter
    changedBy?: StringNullableWithAggregatesFilter | string | null
    source?: StringNullableWithAggregatesFilter | string | null
    changedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type UserWhereInput = {
    AND?: Enumerable<UserWhereInput>
    OR?: Enumerable<UserWhereInput>
    NOT?: Enumerable<UserWhereInput>
    id?: StringFilter | string
    sub?: StringNullableFilter | string | null
    email?: StringNullableFilter | string | null
    role?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    sub?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserWhereUniqueInput = {
    id?: string
    sub?: string
    email?: string
  }

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    sub?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    sub?: StringNullableWithAggregatesFilter | string | null
    email?: StringNullableWithAggregatesFilter | string | null
    role?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type UnidadeFspCreateInput = {
    id?: string
    sigla: string
    nome: string
    contratos?: ContratoCreateNestedManyWithoutUnidadeFspInput
  }

  export type UnidadeFspUncheckedCreateInput = {
    id?: string
    sigla: string
    nome: string
    contratos?: ContratoUncheckedCreateNestedManyWithoutUnidadeFspInput
  }

  export type UnidadeFspUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    contratos?: ContratoUpdateManyWithoutUnidadeFspNestedInput
  }

  export type UnidadeFspUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    contratos?: ContratoUncheckedUpdateManyWithoutUnidadeFspNestedInput
  }

  export type UnidadeFspCreateManyInput = {
    id?: string
    sigla: string
    nome: string
  }

  export type UnidadeFspUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
  }

  export type UnidadeFspUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
  }

  export type MunicipioCreateInput = {
    id?: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa?: string | null
    unidades?: UnidadeOrganizacionalCreateNestedManyWithoutMunicipioInput
    fornecedores?: FornecedorCreateNestedManyWithoutMunicipioInput
  }

  export type MunicipioUncheckedCreateInput = {
    id?: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa?: string | null
    unidades?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutMunicipioInput
    fornecedores?: FornecedorUncheckedCreateNestedManyWithoutMunicipioInput
  }

  export type MunicipioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigoIbge?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    regiaoAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    unidades?: UnidadeOrganizacionalUpdateManyWithoutMunicipioNestedInput
    fornecedores?: FornecedorUpdateManyWithoutMunicipioNestedInput
  }

  export type MunicipioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigoIbge?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    regiaoAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    unidades?: UnidadeOrganizacionalUncheckedUpdateManyWithoutMunicipioNestedInput
    fornecedores?: FornecedorUncheckedUpdateManyWithoutMunicipioNestedInput
  }

  export type MunicipioCreateManyInput = {
    id?: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa?: string | null
  }

  export type MunicipioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigoIbge?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    regiaoAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MunicipioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigoIbge?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    regiaoAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DominioCreateInput = {
    id?: string
    slug: string
    nome: string
    descricao?: string | null
    editavelPeloUsuario?: boolean
    permiteHierarquia?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    valores?: DominioValorCreateNestedManyWithoutDominioInput
  }

  export type DominioUncheckedCreateInput = {
    id?: string
    slug: string
    nome: string
    descricao?: string | null
    editavelPeloUsuario?: boolean
    permiteHierarquia?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    valores?: DominioValorUncheckedCreateNestedManyWithoutDominioInput
  }

  export type DominioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    editavelPeloUsuario?: BoolFieldUpdateOperationsInput | boolean
    permiteHierarquia?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    valores?: DominioValorUpdateManyWithoutDominioNestedInput
  }

  export type DominioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    editavelPeloUsuario?: BoolFieldUpdateOperationsInput | boolean
    permiteHierarquia?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    valores?: DominioValorUncheckedUpdateManyWithoutDominioNestedInput
  }

  export type DominioCreateManyInput = {
    id?: string
    slug: string
    nome: string
    descricao?: string | null
    editavelPeloUsuario?: boolean
    permiteHierarquia?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DominioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    editavelPeloUsuario?: BoolFieldUpdateOperationsInput | boolean
    permiteHierarquia?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DominioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    editavelPeloUsuario?: BoolFieldUpdateOperationsInput | boolean
    permiteHierarquia?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DominioValorCreateInput = {
    id?: string
    codigo: string
    label: string
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dominio: DominioCreateNestedOneWithoutValoresInput
    parent?: DominioValorCreateNestedOneWithoutChildrenInput
    children?: DominioValorCreateNestedManyWithoutParentInput
  }

  export type DominioValorUncheckedCreateInput = {
    id?: string
    dominioId: string
    codigo: string
    label: string
    parentId?: string | null
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: DominioValorUncheckedCreateNestedManyWithoutParentInput
  }

  export type DominioValorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dominio?: DominioUpdateOneRequiredWithoutValoresNestedInput
    parent?: DominioValorUpdateOneWithoutChildrenNestedInput
    children?: DominioValorUpdateManyWithoutParentNestedInput
  }

  export type DominioValorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dominioId?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: DominioValorUncheckedUpdateManyWithoutParentNestedInput
  }

  export type DominioValorCreateManyInput = {
    id?: string
    dominioId: string
    codigo: string
    label: string
    parentId?: string | null
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DominioValorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DominioValorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dominioId?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgaoCreateInput = {
    id?: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    unidades?: UnidadeOrganizacionalCreateNestedManyWithoutOrgaoInput
    servidores?: ServidorCreateNestedManyWithoutOrgaoInput
  }

  export type OrgaoUncheckedCreateInput = {
    id?: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    unidades?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutOrgaoInput
    servidores?: ServidorUncheckedCreateNestedManyWithoutOrgaoInput
  }

  export type OrgaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoOrgaoFieldUpdateOperationsInput | TipoOrgao
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidades?: UnidadeOrganizacionalUpdateManyWithoutOrgaoNestedInput
    servidores?: ServidorUpdateManyWithoutOrgaoNestedInput
  }

  export type OrgaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoOrgaoFieldUpdateOperationsInput | TipoOrgao
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidades?: UnidadeOrganizacionalUncheckedUpdateManyWithoutOrgaoNestedInput
    servidores?: ServidorUncheckedUpdateManyWithoutOrgaoNestedInput
  }

  export type OrgaoCreateManyInput = {
    id?: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrgaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoOrgaoFieldUpdateOperationsInput | TipoOrgao
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoOrgaoFieldUpdateOperationsInput | TipoOrgao
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnidadeOrganizacionalCreateInput = {
    id?: string
    sigla: string
    nome: string
    nivel: NivelUnidade
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao: OrgaoCreateNestedOneWithoutUnidadesInput
    parent?: UnidadeOrganizacionalCreateNestedOneWithoutChildrenInput
    children?: UnidadeOrganizacionalCreateNestedManyWithoutParentInput
    municipio: MunicipioCreateNestedOneWithoutUnidadesInput
    servidores?: ServidorCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalUncheckedCreateInput = {
    id?: string
    orgaoId: string
    parentId?: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutParentInput
    servidores?: ServidorUncheckedCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneRequiredWithoutUnidadesNestedInput
    parent?: UnidadeOrganizacionalUpdateOneWithoutChildrenNestedInput
    children?: UnidadeOrganizacionalUpdateManyWithoutParentNestedInput
    municipio?: MunicipioUpdateOneRequiredWithoutUnidadesNestedInput
    servidores?: ServidorUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgaoId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    municipioId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: UnidadeOrganizacionalUncheckedUpdateManyWithoutParentNestedInput
    servidores?: ServidorUncheckedUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalCreateManyInput = {
    id?: string
    orgaoId: string
    parentId?: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnidadeOrganizacionalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnidadeOrganizacionalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgaoId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    municipioId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorCreateInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    municipio?: MunicipioCreateNestedOneWithoutFornecedoresInput
    contatos?: FornecedorContatoCreateNestedManyWithoutFornecedorInput
    sancoes?: FornecedorSancaoCreateNestedManyWithoutFornecedorInput
    contratos?: ContratoCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorUncheckedCreateInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    municipioId?: string | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contatos?: FornecedorContatoUncheckedCreateNestedManyWithoutFornecedorInput
    sancoes?: FornecedorSancaoUncheckedCreateNestedManyWithoutFornecedorInput
    contratos?: ContratoUncheckedCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    municipio?: MunicipioUpdateOneWithoutFornecedoresNestedInput
    contatos?: FornecedorContatoUpdateManyWithoutFornecedorNestedInput
    sancoes?: FornecedorSancaoUpdateManyWithoutFornecedorNestedInput
    contratos?: ContratoUpdateManyWithoutFornecedorNestedInput
  }

  export type FornecedorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    municipioId?: NullableStringFieldUpdateOperationsInput | string | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contatos?: FornecedorContatoUncheckedUpdateManyWithoutFornecedorNestedInput
    sancoes?: FornecedorSancaoUncheckedUpdateManyWithoutFornecedorNestedInput
    contratos?: ContratoUncheckedUpdateManyWithoutFornecedorNestedInput
  }

  export type FornecedorCreateManyInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    municipioId?: string | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FornecedorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    municipioId?: NullableStringFieldUpdateOperationsInput | string | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorContatoCreateInput = {
    id?: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    principal?: boolean
    createdAt?: Date | string
    fornecedor: FornecedorCreateNestedOneWithoutContatosInput
  }

  export type FornecedorContatoUncheckedCreateInput = {
    id?: string
    fornecedorId: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    principal?: boolean
    createdAt?: Date | string
  }

  export type FornecedorContatoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fornecedor?: FornecedorUpdateOneRequiredWithoutContatosNestedInput
  }

  export type FornecedorContatoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorContatoCreateManyInput = {
    id?: string
    fornecedorId: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    principal?: boolean
    createdAt?: Date | string
  }

  export type FornecedorContatoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorContatoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorSancaoCreateInput = {
    id?: string
    tipo: TipoSancao
    processo?: string | null
    dataInicio: Date | string
    dataFim?: Date | string | null
    abrangencia?: string | null
    fonte?: string | null
    createdAt?: Date | string
    fornecedor: FornecedorCreateNestedOneWithoutSancoesInput
  }

  export type FornecedorSancaoUncheckedCreateInput = {
    id?: string
    fornecedorId: string
    tipo: TipoSancao
    processo?: string | null
    dataInicio: Date | string
    dataFim?: Date | string | null
    abrangencia?: string | null
    fonte?: string | null
    createdAt?: Date | string
  }

  export type FornecedorSancaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoSancaoFieldUpdateOperationsInput | TipoSancao
    processo?: NullableStringFieldUpdateOperationsInput | string | null
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abrangencia?: NullableStringFieldUpdateOperationsInput | string | null
    fonte?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fornecedor?: FornecedorUpdateOneRequiredWithoutSancoesNestedInput
  }

  export type FornecedorSancaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoSancaoFieldUpdateOperationsInput | TipoSancao
    processo?: NullableStringFieldUpdateOperationsInput | string | null
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abrangencia?: NullableStringFieldUpdateOperationsInput | string | null
    fonte?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorSancaoCreateManyInput = {
    id?: string
    fornecedorId: string
    tipo: TipoSancao
    processo?: string | null
    dataInicio: Date | string
    dataFim?: Date | string | null
    abrangencia?: string | null
    fonte?: string | null
    createdAt?: Date | string
  }

  export type FornecedorSancaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoSancaoFieldUpdateOperationsInput | TipoSancao
    processo?: NullableStringFieldUpdateOperationsInput | string | null
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abrangencia?: NullableStringFieldUpdateOperationsInput | string | null
    fonte?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorSancaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoSancaoFieldUpdateOperationsInput | TipoSancao
    processo?: NullableStringFieldUpdateOperationsInput | string | null
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abrangencia?: NullableStringFieldUpdateOperationsInput | string | null
    fonte?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServidorCreateInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao?: OrgaoCreateNestedOneWithoutServidoresInput
    unidade?: UnidadeOrganizacionalCreateNestedOneWithoutServidoresInput
    gestorContratos?: ContratoCreateNestedManyWithoutGestorInput
    fiscalContratos?: ContratoCreateNestedManyWithoutFiscalInput
  }

  export type ServidorUncheckedCreateInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    orgaoId?: string | null
    unidadeId?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    gestorContratos?: ContratoUncheckedCreateNestedManyWithoutGestorInput
    fiscalContratos?: ContratoUncheckedCreateNestedManyWithoutFiscalInput
  }

  export type ServidorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneWithoutServidoresNestedInput
    unidade?: UnidadeOrganizacionalUpdateOneWithoutServidoresNestedInput
    gestorContratos?: ContratoUpdateManyWithoutGestorNestedInput
    fiscalContratos?: ContratoUpdateManyWithoutFiscalNestedInput
  }

  export type ServidorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    orgaoId?: NullableStringFieldUpdateOperationsInput | string | null
    unidadeId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gestorContratos?: ContratoUncheckedUpdateManyWithoutGestorNestedInput
    fiscalContratos?: ContratoUncheckedUpdateManyWithoutFiscalNestedInput
  }

  export type ServidorCreateManyInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    orgaoId?: string | null
    unidadeId?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServidorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServidorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    orgaoId?: NullableStringFieldUpdateOperationsInput | string | null
    unidadeId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContratoCreateInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    unidadeFsp: UnidadeFspCreateNestedOneWithoutContratosInput
    gestor: ServidorCreateNestedOneWithoutGestorContratosInput
    fiscal: ServidorCreateNestedOneWithoutFiscalContratosInput
    fornecedor: FornecedorCreateNestedOneWithoutContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    aditivos?: AditivoUncheckedCreateNestedManyWithoutContratoInput
  }

  export type ContratoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidadeFsp?: UnidadeFspUpdateOneRequiredWithoutContratosNestedInput
    gestor?: ServidorUpdateOneRequiredWithoutGestorContratosNestedInput
    fiscal?: ServidorUpdateOneRequiredWithoutFiscalContratosNestedInput
    fornecedor?: FornecedorUpdateOneRequiredWithoutContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    gestorId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aditivos?: AditivoUncheckedUpdateManyWithoutContratoNestedInput
  }

  export type ContratoCreateManyInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContratoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContratoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    gestorId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AditivoCreateInput = {
    id?: string
    numAditivo: number
    protocoloAdit: string
    novoFimVigencia?: Date | string | null
    valorAdicionalCents?: number | null
    createdAt?: Date | string
    contrato: ContratoCreateNestedOneWithoutAditivosInput
  }

  export type AditivoUncheckedCreateInput = {
    id?: string
    contratoId: string
    numAditivo: number
    protocoloAdit: string
    novoFimVigencia?: Date | string | null
    valorAdicionalCents?: number | null
    createdAt?: Date | string
  }

  export type AditivoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    numAditivo?: IntFieldUpdateOperationsInput | number
    protocoloAdit?: StringFieldUpdateOperationsInput | string
    novoFimVigencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    valorAdicionalCents?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contrato?: ContratoUpdateOneRequiredWithoutAditivosNestedInput
  }

  export type AditivoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contratoId?: StringFieldUpdateOperationsInput | string
    numAditivo?: IntFieldUpdateOperationsInput | number
    protocoloAdit?: StringFieldUpdateOperationsInput | string
    novoFimVigencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    valorAdicionalCents?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AditivoCreateManyInput = {
    id?: string
    contratoId: string
    numAditivo: number
    protocoloAdit: string
    novoFimVigencia?: Date | string | null
    valorAdicionalCents?: number | null
    createdAt?: Date | string
  }

  export type AditivoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    numAditivo?: IntFieldUpdateOperationsInput | number
    protocoloAdit?: StringFieldUpdateOperationsInput | string
    novoFimVigencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    valorAdicionalCents?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AditivoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contratoId?: StringFieldUpdateOperationsInput | string
    numAditivo?: IntFieldUpdateOperationsInput | number
    protocoloAdit?: StringFieldUpdateOperationsInput | string
    novoFimVigencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    valorAdicionalCents?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicoCreateInput = {
    id?: string
    titulo: string
    descricao?: string | null
    createdAt?: Date | string
  }

  export type ServicoUncheckedCreateInput = {
    id?: string
    titulo: string
    descricao?: string | null
    createdAt?: Date | string
  }

  export type ServicoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicoCreateManyInput = {
    id?: string
    titulo: string
    descricao?: string | null
    createdAt?: Date | string
  }

  export type ServicoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    tabela: string
    registroId: string
    action: string
    diff: JsonNullValueInput | InputJsonValue
    changedBy?: string | null
    source?: string | null
    changedAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    tabela: string
    registroId: string
    action: string
    diff: JsonNullValueInput | InputJsonValue
    changedBy?: string | null
    source?: string | null
    changedAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tabela?: StringFieldUpdateOperationsInput | string
    registroId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diff?: JsonNullValueInput | InputJsonValue
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tabela?: StringFieldUpdateOperationsInput | string
    registroId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diff?: JsonNullValueInput | InputJsonValue
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    tabela: string
    registroId: string
    action: string
    diff: JsonNullValueInput | InputJsonValue
    changedBy?: string | null
    source?: string | null
    changedAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tabela?: StringFieldUpdateOperationsInput | string
    registroId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diff?: JsonNullValueInput | InputJsonValue
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tabela?: StringFieldUpdateOperationsInput | string
    registroId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    diff?: JsonNullValueInput | InputJsonValue
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    sub?: string | null
    email?: string | null
    role?: string
    createdAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    sub?: string | null
    email?: string | null
    role?: string
    createdAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sub?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sub?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    sub?: string | null
    email?: string | null
    role?: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sub?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sub?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type ContratoListRelationFilter = {
    every?: ContratoWhereInput
    some?: ContratoWhereInput
    none?: ContratoWhereInput
  }

  export type ContratoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UnidadeFspCountOrderByAggregateInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
  }

  export type UnidadeFspMaxOrderByAggregateInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
  }

  export type UnidadeFspMinOrderByAggregateInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type UnidadeOrganizacionalListRelationFilter = {
    every?: UnidadeOrganizacionalWhereInput
    some?: UnidadeOrganizacionalWhereInput
    none?: UnidadeOrganizacionalWhereInput
  }

  export type FornecedorListRelationFilter = {
    every?: FornecedorWhereInput
    some?: FornecedorWhereInput
    none?: FornecedorWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UnidadeOrganizacionalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FornecedorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MunicipioCountOrderByAggregateInput = {
    id?: SortOrder
    codigoIbge?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
    regiaoAdministrativa?: SortOrder
  }

  export type MunicipioMaxOrderByAggregateInput = {
    id?: SortOrder
    codigoIbge?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
    regiaoAdministrativa?: SortOrder
  }

  export type MunicipioMinOrderByAggregateInput = {
    id?: SortOrder
    codigoIbge?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
    regiaoAdministrativa?: SortOrder
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type DominioValorListRelationFilter = {
    every?: DominioValorWhereInput
    some?: DominioValorWhereInput
    none?: DominioValorWhereInput
  }

  export type DominioValorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DominioCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    editavelPeloUsuario?: SortOrder
    permiteHierarquia?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DominioMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    editavelPeloUsuario?: SortOrder
    permiteHierarquia?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DominioMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    editavelPeloUsuario?: SortOrder
    permiteHierarquia?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }
  export type JsonNullableFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase>, Exclude<keyof Required<JsonNullableFilterBase>, 'path'>>,
        Required<JsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase>, 'path'>>

  export type JsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type DominioRelationFilter = {
    is?: DominioWhereInput | null
    isNot?: DominioWhereInput | null
  }

  export type DominioValorRelationFilter = {
    is?: DominioValorWhereInput | null
    isNot?: DominioValorWhereInput | null
  }

  export type DominioValorDominioIdCodigoCompoundUniqueInput = {
    dominioId: string
    codigo: string
  }

  export type DominioValorCountOrderByAggregateInput = {
    id?: SortOrder
    dominioId?: SortOrder
    codigo?: SortOrder
    label?: SortOrder
    parentId?: SortOrder
    ordem?: SortOrder
    ativo?: SortOrder
    metadata?: SortOrder
    codigoLegado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DominioValorAvgOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type DominioValorMaxOrderByAggregateInput = {
    id?: SortOrder
    dominioId?: SortOrder
    codigo?: SortOrder
    label?: SortOrder
    parentId?: SortOrder
    ordem?: SortOrder
    ativo?: SortOrder
    codigoLegado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DominioValorMinOrderByAggregateInput = {
    id?: SortOrder
    dominioId?: SortOrder
    codigo?: SortOrder
    label?: SortOrder
    parentId?: SortOrder
    ordem?: SortOrder
    ativo?: SortOrder
    codigoLegado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DominioValorSumOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }
  export type JsonNullableWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntNullableFilter
    _min?: NestedJsonNullableFilter
    _max?: NestedJsonNullableFilter
  }

  export type EnumTipoOrgaoFilter = {
    equals?: TipoOrgao
    in?: Enumerable<TipoOrgao>
    notIn?: Enumerable<TipoOrgao>
    not?: NestedEnumTipoOrgaoFilter | TipoOrgao
  }

  export type ServidorListRelationFilter = {
    every?: ServidorWhereInput
    some?: ServidorWhereInput
    none?: ServidorWhereInput
  }

  export type ServidorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrgaoCountOrderByAggregateInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgaoMaxOrderByAggregateInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgaoMinOrderByAggregateInput = {
    id?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTipoOrgaoWithAggregatesFilter = {
    equals?: TipoOrgao
    in?: Enumerable<TipoOrgao>
    notIn?: Enumerable<TipoOrgao>
    not?: NestedEnumTipoOrgaoWithAggregatesFilter | TipoOrgao
    _count?: NestedIntFilter
    _min?: NestedEnumTipoOrgaoFilter
    _max?: NestedEnumTipoOrgaoFilter
  }

  export type EnumNivelUnidadeFilter = {
    equals?: NivelUnidade
    in?: Enumerable<NivelUnidade>
    notIn?: Enumerable<NivelUnidade>
    not?: NestedEnumNivelUnidadeFilter | NivelUnidade
  }

  export type OrgaoRelationFilter = {
    is?: OrgaoWhereInput | null
    isNot?: OrgaoWhereInput | null
  }

  export type UnidadeOrganizacionalRelationFilter = {
    is?: UnidadeOrganizacionalWhereInput | null
    isNot?: UnidadeOrganizacionalWhereInput | null
  }

  export type MunicipioRelationFilter = {
    is?: MunicipioWhereInput | null
    isNot?: MunicipioWhereInput | null
  }

  export type UnidadeOrganizacionalOrgaoIdSiglaCompoundUniqueInput = {
    orgaoId: string
    sigla: string
  }

  export type UnidadeOrganizacionalCountOrderByAggregateInput = {
    id?: SortOrder
    orgaoId?: SortOrder
    parentId?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    nivel?: SortOrder
    municipioId?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnidadeOrganizacionalMaxOrderByAggregateInput = {
    id?: SortOrder
    orgaoId?: SortOrder
    parentId?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    nivel?: SortOrder
    municipioId?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnidadeOrganizacionalMinOrderByAggregateInput = {
    id?: SortOrder
    orgaoId?: SortOrder
    parentId?: SortOrder
    sigla?: SortOrder
    nome?: SortOrder
    nivel?: SortOrder
    municipioId?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumNivelUnidadeWithAggregatesFilter = {
    equals?: NivelUnidade
    in?: Enumerable<NivelUnidade>
    notIn?: Enumerable<NivelUnidade>
    not?: NestedEnumNivelUnidadeWithAggregatesFilter | NivelUnidade
    _count?: NestedIntFilter
    _min?: NestedEnumNivelUnidadeFilter
    _max?: NestedEnumNivelUnidadeFilter
  }

  export type EnumTipoPessoaFilter = {
    equals?: TipoPessoa
    in?: Enumerable<TipoPessoa>
    notIn?: Enumerable<TipoPessoa>
    not?: NestedEnumTipoPessoaFilter | TipoPessoa
  }

  export type EnumPorteEmpresaNullableFilter = {
    equals?: PorteEmpresa | null
    in?: Enumerable<PorteEmpresa> | null
    notIn?: Enumerable<PorteEmpresa> | null
    not?: NestedEnumPorteEmpresaNullableFilter | PorteEmpresa | null
  }

  export type EnumSituacaoFornecedorFilter = {
    equals?: SituacaoFornecedor
    in?: Enumerable<SituacaoFornecedor>
    notIn?: Enumerable<SituacaoFornecedor>
    not?: NestedEnumSituacaoFornecedorFilter | SituacaoFornecedor
  }

  export type FornecedorContatoListRelationFilter = {
    every?: FornecedorContatoWhereInput
    some?: FornecedorContatoWhereInput
    none?: FornecedorContatoWhereInput
  }

  export type FornecedorSancaoListRelationFilter = {
    every?: FornecedorSancaoWhereInput
    some?: FornecedorSancaoWhereInput
    none?: FornecedorSancaoWhereInput
  }

  export type FornecedorContatoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FornecedorSancaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FornecedorCountOrderByAggregateInput = {
    id?: SortOrder
    tipoPessoa?: SortOrder
    documento?: SortOrder
    razaoSocial?: SortOrder
    nomeFantasia?: SortOrder
    inscricaoEstadual?: SortOrder
    porte?: SortOrder
    municipioId?: SortOrder
    situacao?: SortOrder
    codigoLegado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FornecedorMaxOrderByAggregateInput = {
    id?: SortOrder
    tipoPessoa?: SortOrder
    documento?: SortOrder
    razaoSocial?: SortOrder
    nomeFantasia?: SortOrder
    inscricaoEstadual?: SortOrder
    porte?: SortOrder
    municipioId?: SortOrder
    situacao?: SortOrder
    codigoLegado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FornecedorMinOrderByAggregateInput = {
    id?: SortOrder
    tipoPessoa?: SortOrder
    documento?: SortOrder
    razaoSocial?: SortOrder
    nomeFantasia?: SortOrder
    inscricaoEstadual?: SortOrder
    porte?: SortOrder
    municipioId?: SortOrder
    situacao?: SortOrder
    codigoLegado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTipoPessoaWithAggregatesFilter = {
    equals?: TipoPessoa
    in?: Enumerable<TipoPessoa>
    notIn?: Enumerable<TipoPessoa>
    not?: NestedEnumTipoPessoaWithAggregatesFilter | TipoPessoa
    _count?: NestedIntFilter
    _min?: NestedEnumTipoPessoaFilter
    _max?: NestedEnumTipoPessoaFilter
  }

  export type EnumPorteEmpresaNullableWithAggregatesFilter = {
    equals?: PorteEmpresa | null
    in?: Enumerable<PorteEmpresa> | null
    notIn?: Enumerable<PorteEmpresa> | null
    not?: NestedEnumPorteEmpresaNullableWithAggregatesFilter | PorteEmpresa | null
    _count?: NestedIntNullableFilter
    _min?: NestedEnumPorteEmpresaNullableFilter
    _max?: NestedEnumPorteEmpresaNullableFilter
  }

  export type EnumSituacaoFornecedorWithAggregatesFilter = {
    equals?: SituacaoFornecedor
    in?: Enumerable<SituacaoFornecedor>
    notIn?: Enumerable<SituacaoFornecedor>
    not?: NestedEnumSituacaoFornecedorWithAggregatesFilter | SituacaoFornecedor
    _count?: NestedIntFilter
    _min?: NestedEnumSituacaoFornecedorFilter
    _max?: NestedEnumSituacaoFornecedorFilter
  }

  export type FornecedorRelationFilter = {
    is?: FornecedorWhereInput | null
    isNot?: FornecedorWhereInput | null
  }

  export type FornecedorContatoCountOrderByAggregateInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    principal?: SortOrder
    createdAt?: SortOrder
  }

  export type FornecedorContatoMaxOrderByAggregateInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    principal?: SortOrder
    createdAt?: SortOrder
  }

  export type FornecedorContatoMinOrderByAggregateInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    principal?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumTipoSancaoFilter = {
    equals?: TipoSancao
    in?: Enumerable<TipoSancao>
    notIn?: Enumerable<TipoSancao>
    not?: NestedEnumTipoSancaoFilter | TipoSancao
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type FornecedorSancaoCountOrderByAggregateInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    tipo?: SortOrder
    processo?: SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrder
    abrangencia?: SortOrder
    fonte?: SortOrder
    createdAt?: SortOrder
  }

  export type FornecedorSancaoMaxOrderByAggregateInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    tipo?: SortOrder
    processo?: SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrder
    abrangencia?: SortOrder
    fonte?: SortOrder
    createdAt?: SortOrder
  }

  export type FornecedorSancaoMinOrderByAggregateInput = {
    id?: SortOrder
    fornecedorId?: SortOrder
    tipo?: SortOrder
    processo?: SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrder
    abrangencia?: SortOrder
    fonte?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumTipoSancaoWithAggregatesFilter = {
    equals?: TipoSancao
    in?: Enumerable<TipoSancao>
    notIn?: Enumerable<TipoSancao>
    not?: NestedEnumTipoSancaoWithAggregatesFilter | TipoSancao
    _count?: NestedIntFilter
    _min?: NestedEnumTipoSancaoFilter
    _max?: NestedEnumTipoSancaoFilter
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type ServidorCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrder
    rgFuncional?: SortOrder
    cargo?: SortOrder
    orgaoId?: SortOrder
    unidadeId?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServidorMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrder
    rgFuncional?: SortOrder
    cargo?: SortOrder
    orgaoId?: SortOrder
    unidadeId?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServidorMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrder
    rgFuncional?: SortOrder
    cargo?: SortOrder
    orgaoId?: SortOrder
    unidadeId?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnidadeFspRelationFilter = {
    is?: UnidadeFspWhereInput | null
    isNot?: UnidadeFspWhereInput | null
  }

  export type ServidorRelationFilter = {
    is?: ServidorWhereInput | null
    isNot?: ServidorWhereInput | null
  }

  export type AditivoListRelationFilter = {
    every?: AditivoWhereInput
    some?: AditivoWhereInput
    none?: AditivoWhereInput
  }

  export type AditivoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContratoNumGmsAnoGmsCompoundUniqueInput = {
    numGms: number
    anoGms: number
  }

  export type ContratoCountOrderByAggregateInput = {
    id?: SortOrder
    protocoloCabeca?: SortOrder
    numGms?: SortOrder
    anoGms?: SortOrder
    unidadeFspId?: SortOrder
    gestorId?: SortOrder
    fiscalId?: SortOrder
    fornecedorId?: SortOrder
    modalidade?: SortOrder
    objeto?: SortOrder
    valorAnualCents?: SortOrder
    dataInicio?: SortOrder
    dataFimOrig?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContratoAvgOrderByAggregateInput = {
    numGms?: SortOrder
    anoGms?: SortOrder
    valorAnualCents?: SortOrder
  }

  export type ContratoMaxOrderByAggregateInput = {
    id?: SortOrder
    protocoloCabeca?: SortOrder
    numGms?: SortOrder
    anoGms?: SortOrder
    unidadeFspId?: SortOrder
    gestorId?: SortOrder
    fiscalId?: SortOrder
    fornecedorId?: SortOrder
    modalidade?: SortOrder
    objeto?: SortOrder
    valorAnualCents?: SortOrder
    dataInicio?: SortOrder
    dataFimOrig?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContratoMinOrderByAggregateInput = {
    id?: SortOrder
    protocoloCabeca?: SortOrder
    numGms?: SortOrder
    anoGms?: SortOrder
    unidadeFspId?: SortOrder
    gestorId?: SortOrder
    fiscalId?: SortOrder
    fornecedorId?: SortOrder
    modalidade?: SortOrder
    objeto?: SortOrder
    valorAnualCents?: SortOrder
    dataInicio?: SortOrder
    dataFimOrig?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContratoSumOrderByAggregateInput = {
    numGms?: SortOrder
    anoGms?: SortOrder
    valorAnualCents?: SortOrder
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type ContratoRelationFilter = {
    is?: ContratoWhereInput | null
    isNot?: ContratoWhereInput | null
  }

  export type AditivoCountOrderByAggregateInput = {
    id?: SortOrder
    contratoId?: SortOrder
    numAditivo?: SortOrder
    protocoloAdit?: SortOrder
    novoFimVigencia?: SortOrder
    valorAdicionalCents?: SortOrder
    createdAt?: SortOrder
  }

  export type AditivoAvgOrderByAggregateInput = {
    numAditivo?: SortOrder
    valorAdicionalCents?: SortOrder
  }

  export type AditivoMaxOrderByAggregateInput = {
    id?: SortOrder
    contratoId?: SortOrder
    numAditivo?: SortOrder
    protocoloAdit?: SortOrder
    novoFimVigencia?: SortOrder
    valorAdicionalCents?: SortOrder
    createdAt?: SortOrder
  }

  export type AditivoMinOrderByAggregateInput = {
    id?: SortOrder
    contratoId?: SortOrder
    numAditivo?: SortOrder
    protocoloAdit?: SortOrder
    novoFimVigencia?: SortOrder
    valorAdicionalCents?: SortOrder
    createdAt?: SortOrder
  }

  export type AditivoSumOrderByAggregateInput = {
    numAditivo?: SortOrder
    valorAdicionalCents?: SortOrder
  }

  export type IntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type ServicoCountOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
  }

  export type ServicoMaxOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
  }

  export type ServicoMinOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter = 
    | PatchUndefined<
        Either<Required<JsonFilterBase>, Exclude<keyof Required<JsonFilterBase>, 'path'>>,
        Required<JsonFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase>, 'path'>>

  export type JsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    tabela?: SortOrder
    registroId?: SortOrder
    action?: SortOrder
    diff?: SortOrder
    changedBy?: SortOrder
    source?: SortOrder
    changedAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tabela?: SortOrder
    registroId?: SortOrder
    action?: SortOrder
    changedBy?: SortOrder
    source?: SortOrder
    changedAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    tabela?: SortOrder
    registroId?: SortOrder
    action?: SortOrder
    changedBy?: SortOrder
    source?: SortOrder
    changedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase>, Exclude<keyof Required<JsonWithAggregatesFilterBase>, 'path'>>,
        Required<JsonWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase>, 'path'>>

  export type JsonWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntFilter
    _min?: NestedJsonFilter
    _max?: NestedJsonFilter
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    sub?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    sub?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    sub?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type ContratoCreateNestedManyWithoutUnidadeFspInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutUnidadeFspInput>, Enumerable<ContratoUncheckedCreateWithoutUnidadeFspInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutUnidadeFspInput>
    createMany?: ContratoCreateManyUnidadeFspInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type ContratoUncheckedCreateNestedManyWithoutUnidadeFspInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutUnidadeFspInput>, Enumerable<ContratoUncheckedCreateWithoutUnidadeFspInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutUnidadeFspInput>
    createMany?: ContratoCreateManyUnidadeFspInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type ContratoUpdateManyWithoutUnidadeFspNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutUnidadeFspInput>, Enumerable<ContratoUncheckedCreateWithoutUnidadeFspInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutUnidadeFspInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutUnidadeFspInput>
    createMany?: ContratoCreateManyUnidadeFspInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutUnidadeFspInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutUnidadeFspInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type ContratoUncheckedUpdateManyWithoutUnidadeFspNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutUnidadeFspInput>, Enumerable<ContratoUncheckedCreateWithoutUnidadeFspInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutUnidadeFspInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutUnidadeFspInput>
    createMany?: ContratoCreateManyUnidadeFspInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutUnidadeFspInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutUnidadeFspInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type UnidadeOrganizacionalCreateNestedManyWithoutMunicipioInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutMunicipioInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutMunicipioInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutMunicipioInput>
    createMany?: UnidadeOrganizacionalCreateManyMunicipioInputEnvelope
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
  }

  export type FornecedorCreateNestedManyWithoutMunicipioInput = {
    create?: XOR<Enumerable<FornecedorCreateWithoutMunicipioInput>, Enumerable<FornecedorUncheckedCreateWithoutMunicipioInput>>
    connectOrCreate?: Enumerable<FornecedorCreateOrConnectWithoutMunicipioInput>
    createMany?: FornecedorCreateManyMunicipioInputEnvelope
    connect?: Enumerable<FornecedorWhereUniqueInput>
  }

  export type UnidadeOrganizacionalUncheckedCreateNestedManyWithoutMunicipioInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutMunicipioInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutMunicipioInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutMunicipioInput>
    createMany?: UnidadeOrganizacionalCreateManyMunicipioInputEnvelope
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
  }

  export type FornecedorUncheckedCreateNestedManyWithoutMunicipioInput = {
    create?: XOR<Enumerable<FornecedorCreateWithoutMunicipioInput>, Enumerable<FornecedorUncheckedCreateWithoutMunicipioInput>>
    connectOrCreate?: Enumerable<FornecedorCreateOrConnectWithoutMunicipioInput>
    createMany?: FornecedorCreateManyMunicipioInputEnvelope
    connect?: Enumerable<FornecedorWhereUniqueInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UnidadeOrganizacionalUpdateManyWithoutMunicipioNestedInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutMunicipioInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutMunicipioInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutMunicipioInput>
    upsert?: Enumerable<UnidadeOrganizacionalUpsertWithWhereUniqueWithoutMunicipioInput>
    createMany?: UnidadeOrganizacionalCreateManyMunicipioInputEnvelope
    set?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    disconnect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    delete?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    update?: Enumerable<UnidadeOrganizacionalUpdateWithWhereUniqueWithoutMunicipioInput>
    updateMany?: Enumerable<UnidadeOrganizacionalUpdateManyWithWhereWithoutMunicipioInput>
    deleteMany?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
  }

  export type FornecedorUpdateManyWithoutMunicipioNestedInput = {
    create?: XOR<Enumerable<FornecedorCreateWithoutMunicipioInput>, Enumerable<FornecedorUncheckedCreateWithoutMunicipioInput>>
    connectOrCreate?: Enumerable<FornecedorCreateOrConnectWithoutMunicipioInput>
    upsert?: Enumerable<FornecedorUpsertWithWhereUniqueWithoutMunicipioInput>
    createMany?: FornecedorCreateManyMunicipioInputEnvelope
    set?: Enumerable<FornecedorWhereUniqueInput>
    disconnect?: Enumerable<FornecedorWhereUniqueInput>
    delete?: Enumerable<FornecedorWhereUniqueInput>
    connect?: Enumerable<FornecedorWhereUniqueInput>
    update?: Enumerable<FornecedorUpdateWithWhereUniqueWithoutMunicipioInput>
    updateMany?: Enumerable<FornecedorUpdateManyWithWhereWithoutMunicipioInput>
    deleteMany?: Enumerable<FornecedorScalarWhereInput>
  }

  export type UnidadeOrganizacionalUncheckedUpdateManyWithoutMunicipioNestedInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutMunicipioInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutMunicipioInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutMunicipioInput>
    upsert?: Enumerable<UnidadeOrganizacionalUpsertWithWhereUniqueWithoutMunicipioInput>
    createMany?: UnidadeOrganizacionalCreateManyMunicipioInputEnvelope
    set?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    disconnect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    delete?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    update?: Enumerable<UnidadeOrganizacionalUpdateWithWhereUniqueWithoutMunicipioInput>
    updateMany?: Enumerable<UnidadeOrganizacionalUpdateManyWithWhereWithoutMunicipioInput>
    deleteMany?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
  }

  export type FornecedorUncheckedUpdateManyWithoutMunicipioNestedInput = {
    create?: XOR<Enumerable<FornecedorCreateWithoutMunicipioInput>, Enumerable<FornecedorUncheckedCreateWithoutMunicipioInput>>
    connectOrCreate?: Enumerable<FornecedorCreateOrConnectWithoutMunicipioInput>
    upsert?: Enumerable<FornecedorUpsertWithWhereUniqueWithoutMunicipioInput>
    createMany?: FornecedorCreateManyMunicipioInputEnvelope
    set?: Enumerable<FornecedorWhereUniqueInput>
    disconnect?: Enumerable<FornecedorWhereUniqueInput>
    delete?: Enumerable<FornecedorWhereUniqueInput>
    connect?: Enumerable<FornecedorWhereUniqueInput>
    update?: Enumerable<FornecedorUpdateWithWhereUniqueWithoutMunicipioInput>
    updateMany?: Enumerable<FornecedorUpdateManyWithWhereWithoutMunicipioInput>
    deleteMany?: Enumerable<FornecedorScalarWhereInput>
  }

  export type DominioValorCreateNestedManyWithoutDominioInput = {
    create?: XOR<Enumerable<DominioValorCreateWithoutDominioInput>, Enumerable<DominioValorUncheckedCreateWithoutDominioInput>>
    connectOrCreate?: Enumerable<DominioValorCreateOrConnectWithoutDominioInput>
    createMany?: DominioValorCreateManyDominioInputEnvelope
    connect?: Enumerable<DominioValorWhereUniqueInput>
  }

  export type DominioValorUncheckedCreateNestedManyWithoutDominioInput = {
    create?: XOR<Enumerable<DominioValorCreateWithoutDominioInput>, Enumerable<DominioValorUncheckedCreateWithoutDominioInput>>
    connectOrCreate?: Enumerable<DominioValorCreateOrConnectWithoutDominioInput>
    createMany?: DominioValorCreateManyDominioInputEnvelope
    connect?: Enumerable<DominioValorWhereUniqueInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DominioValorUpdateManyWithoutDominioNestedInput = {
    create?: XOR<Enumerable<DominioValorCreateWithoutDominioInput>, Enumerable<DominioValorUncheckedCreateWithoutDominioInput>>
    connectOrCreate?: Enumerable<DominioValorCreateOrConnectWithoutDominioInput>
    upsert?: Enumerable<DominioValorUpsertWithWhereUniqueWithoutDominioInput>
    createMany?: DominioValorCreateManyDominioInputEnvelope
    set?: Enumerable<DominioValorWhereUniqueInput>
    disconnect?: Enumerable<DominioValorWhereUniqueInput>
    delete?: Enumerable<DominioValorWhereUniqueInput>
    connect?: Enumerable<DominioValorWhereUniqueInput>
    update?: Enumerable<DominioValorUpdateWithWhereUniqueWithoutDominioInput>
    updateMany?: Enumerable<DominioValorUpdateManyWithWhereWithoutDominioInput>
    deleteMany?: Enumerable<DominioValorScalarWhereInput>
  }

  export type DominioValorUncheckedUpdateManyWithoutDominioNestedInput = {
    create?: XOR<Enumerable<DominioValorCreateWithoutDominioInput>, Enumerable<DominioValorUncheckedCreateWithoutDominioInput>>
    connectOrCreate?: Enumerable<DominioValorCreateOrConnectWithoutDominioInput>
    upsert?: Enumerable<DominioValorUpsertWithWhereUniqueWithoutDominioInput>
    createMany?: DominioValorCreateManyDominioInputEnvelope
    set?: Enumerable<DominioValorWhereUniqueInput>
    disconnect?: Enumerable<DominioValorWhereUniqueInput>
    delete?: Enumerable<DominioValorWhereUniqueInput>
    connect?: Enumerable<DominioValorWhereUniqueInput>
    update?: Enumerable<DominioValorUpdateWithWhereUniqueWithoutDominioInput>
    updateMany?: Enumerable<DominioValorUpdateManyWithWhereWithoutDominioInput>
    deleteMany?: Enumerable<DominioValorScalarWhereInput>
  }

  export type DominioCreateNestedOneWithoutValoresInput = {
    create?: XOR<DominioCreateWithoutValoresInput, DominioUncheckedCreateWithoutValoresInput>
    connectOrCreate?: DominioCreateOrConnectWithoutValoresInput
    connect?: DominioWhereUniqueInput
  }

  export type DominioValorCreateNestedOneWithoutChildrenInput = {
    create?: XOR<DominioValorCreateWithoutChildrenInput, DominioValorUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: DominioValorCreateOrConnectWithoutChildrenInput
    connect?: DominioValorWhereUniqueInput
  }

  export type DominioValorCreateNestedManyWithoutParentInput = {
    create?: XOR<Enumerable<DominioValorCreateWithoutParentInput>, Enumerable<DominioValorUncheckedCreateWithoutParentInput>>
    connectOrCreate?: Enumerable<DominioValorCreateOrConnectWithoutParentInput>
    createMany?: DominioValorCreateManyParentInputEnvelope
    connect?: Enumerable<DominioValorWhereUniqueInput>
  }

  export type DominioValorUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<Enumerable<DominioValorCreateWithoutParentInput>, Enumerable<DominioValorUncheckedCreateWithoutParentInput>>
    connectOrCreate?: Enumerable<DominioValorCreateOrConnectWithoutParentInput>
    createMany?: DominioValorCreateManyParentInputEnvelope
    connect?: Enumerable<DominioValorWhereUniqueInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DominioUpdateOneRequiredWithoutValoresNestedInput = {
    create?: XOR<DominioCreateWithoutValoresInput, DominioUncheckedCreateWithoutValoresInput>
    connectOrCreate?: DominioCreateOrConnectWithoutValoresInput
    upsert?: DominioUpsertWithoutValoresInput
    connect?: DominioWhereUniqueInput
    update?: XOR<DominioUpdateWithoutValoresInput, DominioUncheckedUpdateWithoutValoresInput>
  }

  export type DominioValorUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<DominioValorCreateWithoutChildrenInput, DominioValorUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: DominioValorCreateOrConnectWithoutChildrenInput
    upsert?: DominioValorUpsertWithoutChildrenInput
    disconnect?: boolean
    delete?: boolean
    connect?: DominioValorWhereUniqueInput
    update?: XOR<DominioValorUpdateWithoutChildrenInput, DominioValorUncheckedUpdateWithoutChildrenInput>
  }

  export type DominioValorUpdateManyWithoutParentNestedInput = {
    create?: XOR<Enumerable<DominioValorCreateWithoutParentInput>, Enumerable<DominioValorUncheckedCreateWithoutParentInput>>
    connectOrCreate?: Enumerable<DominioValorCreateOrConnectWithoutParentInput>
    upsert?: Enumerable<DominioValorUpsertWithWhereUniqueWithoutParentInput>
    createMany?: DominioValorCreateManyParentInputEnvelope
    set?: Enumerable<DominioValorWhereUniqueInput>
    disconnect?: Enumerable<DominioValorWhereUniqueInput>
    delete?: Enumerable<DominioValorWhereUniqueInput>
    connect?: Enumerable<DominioValorWhereUniqueInput>
    update?: Enumerable<DominioValorUpdateWithWhereUniqueWithoutParentInput>
    updateMany?: Enumerable<DominioValorUpdateManyWithWhereWithoutParentInput>
    deleteMany?: Enumerable<DominioValorScalarWhereInput>
  }

  export type DominioValorUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<Enumerable<DominioValorCreateWithoutParentInput>, Enumerable<DominioValorUncheckedCreateWithoutParentInput>>
    connectOrCreate?: Enumerable<DominioValorCreateOrConnectWithoutParentInput>
    upsert?: Enumerable<DominioValorUpsertWithWhereUniqueWithoutParentInput>
    createMany?: DominioValorCreateManyParentInputEnvelope
    set?: Enumerable<DominioValorWhereUniqueInput>
    disconnect?: Enumerable<DominioValorWhereUniqueInput>
    delete?: Enumerable<DominioValorWhereUniqueInput>
    connect?: Enumerable<DominioValorWhereUniqueInput>
    update?: Enumerable<DominioValorUpdateWithWhereUniqueWithoutParentInput>
    updateMany?: Enumerable<DominioValorUpdateManyWithWhereWithoutParentInput>
    deleteMany?: Enumerable<DominioValorScalarWhereInput>
  }

  export type UnidadeOrganizacionalCreateNestedManyWithoutOrgaoInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutOrgaoInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutOrgaoInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutOrgaoInput>
    createMany?: UnidadeOrganizacionalCreateManyOrgaoInputEnvelope
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
  }

  export type ServidorCreateNestedManyWithoutOrgaoInput = {
    create?: XOR<Enumerable<ServidorCreateWithoutOrgaoInput>, Enumerable<ServidorUncheckedCreateWithoutOrgaoInput>>
    connectOrCreate?: Enumerable<ServidorCreateOrConnectWithoutOrgaoInput>
    createMany?: ServidorCreateManyOrgaoInputEnvelope
    connect?: Enumerable<ServidorWhereUniqueInput>
  }

  export type UnidadeOrganizacionalUncheckedCreateNestedManyWithoutOrgaoInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutOrgaoInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutOrgaoInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutOrgaoInput>
    createMany?: UnidadeOrganizacionalCreateManyOrgaoInputEnvelope
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
  }

  export type ServidorUncheckedCreateNestedManyWithoutOrgaoInput = {
    create?: XOR<Enumerable<ServidorCreateWithoutOrgaoInput>, Enumerable<ServidorUncheckedCreateWithoutOrgaoInput>>
    connectOrCreate?: Enumerable<ServidorCreateOrConnectWithoutOrgaoInput>
    createMany?: ServidorCreateManyOrgaoInputEnvelope
    connect?: Enumerable<ServidorWhereUniqueInput>
  }

  export type EnumTipoOrgaoFieldUpdateOperationsInput = {
    set?: TipoOrgao
  }

  export type UnidadeOrganizacionalUpdateManyWithoutOrgaoNestedInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutOrgaoInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutOrgaoInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutOrgaoInput>
    upsert?: Enumerable<UnidadeOrganizacionalUpsertWithWhereUniqueWithoutOrgaoInput>
    createMany?: UnidadeOrganizacionalCreateManyOrgaoInputEnvelope
    set?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    disconnect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    delete?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    update?: Enumerable<UnidadeOrganizacionalUpdateWithWhereUniqueWithoutOrgaoInput>
    updateMany?: Enumerable<UnidadeOrganizacionalUpdateManyWithWhereWithoutOrgaoInput>
    deleteMany?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
  }

  export type ServidorUpdateManyWithoutOrgaoNestedInput = {
    create?: XOR<Enumerable<ServidorCreateWithoutOrgaoInput>, Enumerable<ServidorUncheckedCreateWithoutOrgaoInput>>
    connectOrCreate?: Enumerable<ServidorCreateOrConnectWithoutOrgaoInput>
    upsert?: Enumerable<ServidorUpsertWithWhereUniqueWithoutOrgaoInput>
    createMany?: ServidorCreateManyOrgaoInputEnvelope
    set?: Enumerable<ServidorWhereUniqueInput>
    disconnect?: Enumerable<ServidorWhereUniqueInput>
    delete?: Enumerable<ServidorWhereUniqueInput>
    connect?: Enumerable<ServidorWhereUniqueInput>
    update?: Enumerable<ServidorUpdateWithWhereUniqueWithoutOrgaoInput>
    updateMany?: Enumerable<ServidorUpdateManyWithWhereWithoutOrgaoInput>
    deleteMany?: Enumerable<ServidorScalarWhereInput>
  }

  export type UnidadeOrganizacionalUncheckedUpdateManyWithoutOrgaoNestedInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutOrgaoInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutOrgaoInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutOrgaoInput>
    upsert?: Enumerable<UnidadeOrganizacionalUpsertWithWhereUniqueWithoutOrgaoInput>
    createMany?: UnidadeOrganizacionalCreateManyOrgaoInputEnvelope
    set?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    disconnect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    delete?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    update?: Enumerable<UnidadeOrganizacionalUpdateWithWhereUniqueWithoutOrgaoInput>
    updateMany?: Enumerable<UnidadeOrganizacionalUpdateManyWithWhereWithoutOrgaoInput>
    deleteMany?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
  }

  export type ServidorUncheckedUpdateManyWithoutOrgaoNestedInput = {
    create?: XOR<Enumerable<ServidorCreateWithoutOrgaoInput>, Enumerable<ServidorUncheckedCreateWithoutOrgaoInput>>
    connectOrCreate?: Enumerable<ServidorCreateOrConnectWithoutOrgaoInput>
    upsert?: Enumerable<ServidorUpsertWithWhereUniqueWithoutOrgaoInput>
    createMany?: ServidorCreateManyOrgaoInputEnvelope
    set?: Enumerable<ServidorWhereUniqueInput>
    disconnect?: Enumerable<ServidorWhereUniqueInput>
    delete?: Enumerable<ServidorWhereUniqueInput>
    connect?: Enumerable<ServidorWhereUniqueInput>
    update?: Enumerable<ServidorUpdateWithWhereUniqueWithoutOrgaoInput>
    updateMany?: Enumerable<ServidorUpdateManyWithWhereWithoutOrgaoInput>
    deleteMany?: Enumerable<ServidorScalarWhereInput>
  }

  export type OrgaoCreateNestedOneWithoutUnidadesInput = {
    create?: XOR<OrgaoCreateWithoutUnidadesInput, OrgaoUncheckedCreateWithoutUnidadesInput>
    connectOrCreate?: OrgaoCreateOrConnectWithoutUnidadesInput
    connect?: OrgaoWhereUniqueInput
  }

  export type UnidadeOrganizacionalCreateNestedOneWithoutChildrenInput = {
    create?: XOR<UnidadeOrganizacionalCreateWithoutChildrenInput, UnidadeOrganizacionalUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: UnidadeOrganizacionalCreateOrConnectWithoutChildrenInput
    connect?: UnidadeOrganizacionalWhereUniqueInput
  }

  export type UnidadeOrganizacionalCreateNestedManyWithoutParentInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutParentInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutParentInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutParentInput>
    createMany?: UnidadeOrganizacionalCreateManyParentInputEnvelope
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
  }

  export type MunicipioCreateNestedOneWithoutUnidadesInput = {
    create?: XOR<MunicipioCreateWithoutUnidadesInput, MunicipioUncheckedCreateWithoutUnidadesInput>
    connectOrCreate?: MunicipioCreateOrConnectWithoutUnidadesInput
    connect?: MunicipioWhereUniqueInput
  }

  export type ServidorCreateNestedManyWithoutUnidadeInput = {
    create?: XOR<Enumerable<ServidorCreateWithoutUnidadeInput>, Enumerable<ServidorUncheckedCreateWithoutUnidadeInput>>
    connectOrCreate?: Enumerable<ServidorCreateOrConnectWithoutUnidadeInput>
    createMany?: ServidorCreateManyUnidadeInputEnvelope
    connect?: Enumerable<ServidorWhereUniqueInput>
  }

  export type UnidadeOrganizacionalUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutParentInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutParentInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutParentInput>
    createMany?: UnidadeOrganizacionalCreateManyParentInputEnvelope
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
  }

  export type ServidorUncheckedCreateNestedManyWithoutUnidadeInput = {
    create?: XOR<Enumerable<ServidorCreateWithoutUnidadeInput>, Enumerable<ServidorUncheckedCreateWithoutUnidadeInput>>
    connectOrCreate?: Enumerable<ServidorCreateOrConnectWithoutUnidadeInput>
    createMany?: ServidorCreateManyUnidadeInputEnvelope
    connect?: Enumerable<ServidorWhereUniqueInput>
  }

  export type EnumNivelUnidadeFieldUpdateOperationsInput = {
    set?: NivelUnidade
  }

  export type OrgaoUpdateOneRequiredWithoutUnidadesNestedInput = {
    create?: XOR<OrgaoCreateWithoutUnidadesInput, OrgaoUncheckedCreateWithoutUnidadesInput>
    connectOrCreate?: OrgaoCreateOrConnectWithoutUnidadesInput
    upsert?: OrgaoUpsertWithoutUnidadesInput
    connect?: OrgaoWhereUniqueInput
    update?: XOR<OrgaoUpdateWithoutUnidadesInput, OrgaoUncheckedUpdateWithoutUnidadesInput>
  }

  export type UnidadeOrganizacionalUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<UnidadeOrganizacionalCreateWithoutChildrenInput, UnidadeOrganizacionalUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: UnidadeOrganizacionalCreateOrConnectWithoutChildrenInput
    upsert?: UnidadeOrganizacionalUpsertWithoutChildrenInput
    disconnect?: boolean
    delete?: boolean
    connect?: UnidadeOrganizacionalWhereUniqueInput
    update?: XOR<UnidadeOrganizacionalUpdateWithoutChildrenInput, UnidadeOrganizacionalUncheckedUpdateWithoutChildrenInput>
  }

  export type UnidadeOrganizacionalUpdateManyWithoutParentNestedInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutParentInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutParentInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutParentInput>
    upsert?: Enumerable<UnidadeOrganizacionalUpsertWithWhereUniqueWithoutParentInput>
    createMany?: UnidadeOrganizacionalCreateManyParentInputEnvelope
    set?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    disconnect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    delete?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    update?: Enumerable<UnidadeOrganizacionalUpdateWithWhereUniqueWithoutParentInput>
    updateMany?: Enumerable<UnidadeOrganizacionalUpdateManyWithWhereWithoutParentInput>
    deleteMany?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
  }

  export type MunicipioUpdateOneRequiredWithoutUnidadesNestedInput = {
    create?: XOR<MunicipioCreateWithoutUnidadesInput, MunicipioUncheckedCreateWithoutUnidadesInput>
    connectOrCreate?: MunicipioCreateOrConnectWithoutUnidadesInput
    upsert?: MunicipioUpsertWithoutUnidadesInput
    connect?: MunicipioWhereUniqueInput
    update?: XOR<MunicipioUpdateWithoutUnidadesInput, MunicipioUncheckedUpdateWithoutUnidadesInput>
  }

  export type ServidorUpdateManyWithoutUnidadeNestedInput = {
    create?: XOR<Enumerable<ServidorCreateWithoutUnidadeInput>, Enumerable<ServidorUncheckedCreateWithoutUnidadeInput>>
    connectOrCreate?: Enumerable<ServidorCreateOrConnectWithoutUnidadeInput>
    upsert?: Enumerable<ServidorUpsertWithWhereUniqueWithoutUnidadeInput>
    createMany?: ServidorCreateManyUnidadeInputEnvelope
    set?: Enumerable<ServidorWhereUniqueInput>
    disconnect?: Enumerable<ServidorWhereUniqueInput>
    delete?: Enumerable<ServidorWhereUniqueInput>
    connect?: Enumerable<ServidorWhereUniqueInput>
    update?: Enumerable<ServidorUpdateWithWhereUniqueWithoutUnidadeInput>
    updateMany?: Enumerable<ServidorUpdateManyWithWhereWithoutUnidadeInput>
    deleteMany?: Enumerable<ServidorScalarWhereInput>
  }

  export type UnidadeOrganizacionalUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<Enumerable<UnidadeOrganizacionalCreateWithoutParentInput>, Enumerable<UnidadeOrganizacionalUncheckedCreateWithoutParentInput>>
    connectOrCreate?: Enumerable<UnidadeOrganizacionalCreateOrConnectWithoutParentInput>
    upsert?: Enumerable<UnidadeOrganizacionalUpsertWithWhereUniqueWithoutParentInput>
    createMany?: UnidadeOrganizacionalCreateManyParentInputEnvelope
    set?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    disconnect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    delete?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    connect?: Enumerable<UnidadeOrganizacionalWhereUniqueInput>
    update?: Enumerable<UnidadeOrganizacionalUpdateWithWhereUniqueWithoutParentInput>
    updateMany?: Enumerable<UnidadeOrganizacionalUpdateManyWithWhereWithoutParentInput>
    deleteMany?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
  }

  export type ServidorUncheckedUpdateManyWithoutUnidadeNestedInput = {
    create?: XOR<Enumerable<ServidorCreateWithoutUnidadeInput>, Enumerable<ServidorUncheckedCreateWithoutUnidadeInput>>
    connectOrCreate?: Enumerable<ServidorCreateOrConnectWithoutUnidadeInput>
    upsert?: Enumerable<ServidorUpsertWithWhereUniqueWithoutUnidadeInput>
    createMany?: ServidorCreateManyUnidadeInputEnvelope
    set?: Enumerable<ServidorWhereUniqueInput>
    disconnect?: Enumerable<ServidorWhereUniqueInput>
    delete?: Enumerable<ServidorWhereUniqueInput>
    connect?: Enumerable<ServidorWhereUniqueInput>
    update?: Enumerable<ServidorUpdateWithWhereUniqueWithoutUnidadeInput>
    updateMany?: Enumerable<ServidorUpdateManyWithWhereWithoutUnidadeInput>
    deleteMany?: Enumerable<ServidorScalarWhereInput>
  }

  export type MunicipioCreateNestedOneWithoutFornecedoresInput = {
    create?: XOR<MunicipioCreateWithoutFornecedoresInput, MunicipioUncheckedCreateWithoutFornecedoresInput>
    connectOrCreate?: MunicipioCreateOrConnectWithoutFornecedoresInput
    connect?: MunicipioWhereUniqueInput
  }

  export type FornecedorContatoCreateNestedManyWithoutFornecedorInput = {
    create?: XOR<Enumerable<FornecedorContatoCreateWithoutFornecedorInput>, Enumerable<FornecedorContatoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<FornecedorContatoCreateOrConnectWithoutFornecedorInput>
    createMany?: FornecedorContatoCreateManyFornecedorInputEnvelope
    connect?: Enumerable<FornecedorContatoWhereUniqueInput>
  }

  export type FornecedorSancaoCreateNestedManyWithoutFornecedorInput = {
    create?: XOR<Enumerable<FornecedorSancaoCreateWithoutFornecedorInput>, Enumerable<FornecedorSancaoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<FornecedorSancaoCreateOrConnectWithoutFornecedorInput>
    createMany?: FornecedorSancaoCreateManyFornecedorInputEnvelope
    connect?: Enumerable<FornecedorSancaoWhereUniqueInput>
  }

  export type ContratoCreateNestedManyWithoutFornecedorInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutFornecedorInput>, Enumerable<ContratoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutFornecedorInput>
    createMany?: ContratoCreateManyFornecedorInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type FornecedorContatoUncheckedCreateNestedManyWithoutFornecedorInput = {
    create?: XOR<Enumerable<FornecedorContatoCreateWithoutFornecedorInput>, Enumerable<FornecedorContatoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<FornecedorContatoCreateOrConnectWithoutFornecedorInput>
    createMany?: FornecedorContatoCreateManyFornecedorInputEnvelope
    connect?: Enumerable<FornecedorContatoWhereUniqueInput>
  }

  export type FornecedorSancaoUncheckedCreateNestedManyWithoutFornecedorInput = {
    create?: XOR<Enumerable<FornecedorSancaoCreateWithoutFornecedorInput>, Enumerable<FornecedorSancaoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<FornecedorSancaoCreateOrConnectWithoutFornecedorInput>
    createMany?: FornecedorSancaoCreateManyFornecedorInputEnvelope
    connect?: Enumerable<FornecedorSancaoWhereUniqueInput>
  }

  export type ContratoUncheckedCreateNestedManyWithoutFornecedorInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutFornecedorInput>, Enumerable<ContratoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutFornecedorInput>
    createMany?: ContratoCreateManyFornecedorInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type EnumTipoPessoaFieldUpdateOperationsInput = {
    set?: TipoPessoa
  }

  export type NullableEnumPorteEmpresaFieldUpdateOperationsInput = {
    set?: PorteEmpresa | null
  }

  export type EnumSituacaoFornecedorFieldUpdateOperationsInput = {
    set?: SituacaoFornecedor
  }

  export type MunicipioUpdateOneWithoutFornecedoresNestedInput = {
    create?: XOR<MunicipioCreateWithoutFornecedoresInput, MunicipioUncheckedCreateWithoutFornecedoresInput>
    connectOrCreate?: MunicipioCreateOrConnectWithoutFornecedoresInput
    upsert?: MunicipioUpsertWithoutFornecedoresInput
    disconnect?: boolean
    delete?: boolean
    connect?: MunicipioWhereUniqueInput
    update?: XOR<MunicipioUpdateWithoutFornecedoresInput, MunicipioUncheckedUpdateWithoutFornecedoresInput>
  }

  export type FornecedorContatoUpdateManyWithoutFornecedorNestedInput = {
    create?: XOR<Enumerable<FornecedorContatoCreateWithoutFornecedorInput>, Enumerable<FornecedorContatoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<FornecedorContatoCreateOrConnectWithoutFornecedorInput>
    upsert?: Enumerable<FornecedorContatoUpsertWithWhereUniqueWithoutFornecedorInput>
    createMany?: FornecedorContatoCreateManyFornecedorInputEnvelope
    set?: Enumerable<FornecedorContatoWhereUniqueInput>
    disconnect?: Enumerable<FornecedorContatoWhereUniqueInput>
    delete?: Enumerable<FornecedorContatoWhereUniqueInput>
    connect?: Enumerable<FornecedorContatoWhereUniqueInput>
    update?: Enumerable<FornecedorContatoUpdateWithWhereUniqueWithoutFornecedorInput>
    updateMany?: Enumerable<FornecedorContatoUpdateManyWithWhereWithoutFornecedorInput>
    deleteMany?: Enumerable<FornecedorContatoScalarWhereInput>
  }

  export type FornecedorSancaoUpdateManyWithoutFornecedorNestedInput = {
    create?: XOR<Enumerable<FornecedorSancaoCreateWithoutFornecedorInput>, Enumerable<FornecedorSancaoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<FornecedorSancaoCreateOrConnectWithoutFornecedorInput>
    upsert?: Enumerable<FornecedorSancaoUpsertWithWhereUniqueWithoutFornecedorInput>
    createMany?: FornecedorSancaoCreateManyFornecedorInputEnvelope
    set?: Enumerable<FornecedorSancaoWhereUniqueInput>
    disconnect?: Enumerable<FornecedorSancaoWhereUniqueInput>
    delete?: Enumerable<FornecedorSancaoWhereUniqueInput>
    connect?: Enumerable<FornecedorSancaoWhereUniqueInput>
    update?: Enumerable<FornecedorSancaoUpdateWithWhereUniqueWithoutFornecedorInput>
    updateMany?: Enumerable<FornecedorSancaoUpdateManyWithWhereWithoutFornecedorInput>
    deleteMany?: Enumerable<FornecedorSancaoScalarWhereInput>
  }

  export type ContratoUpdateManyWithoutFornecedorNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutFornecedorInput>, Enumerable<ContratoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutFornecedorInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutFornecedorInput>
    createMany?: ContratoCreateManyFornecedorInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutFornecedorInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutFornecedorInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type FornecedorContatoUncheckedUpdateManyWithoutFornecedorNestedInput = {
    create?: XOR<Enumerable<FornecedorContatoCreateWithoutFornecedorInput>, Enumerable<FornecedorContatoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<FornecedorContatoCreateOrConnectWithoutFornecedorInput>
    upsert?: Enumerable<FornecedorContatoUpsertWithWhereUniqueWithoutFornecedorInput>
    createMany?: FornecedorContatoCreateManyFornecedorInputEnvelope
    set?: Enumerable<FornecedorContatoWhereUniqueInput>
    disconnect?: Enumerable<FornecedorContatoWhereUniqueInput>
    delete?: Enumerable<FornecedorContatoWhereUniqueInput>
    connect?: Enumerable<FornecedorContatoWhereUniqueInput>
    update?: Enumerable<FornecedorContatoUpdateWithWhereUniqueWithoutFornecedorInput>
    updateMany?: Enumerable<FornecedorContatoUpdateManyWithWhereWithoutFornecedorInput>
    deleteMany?: Enumerable<FornecedorContatoScalarWhereInput>
  }

  export type FornecedorSancaoUncheckedUpdateManyWithoutFornecedorNestedInput = {
    create?: XOR<Enumerable<FornecedorSancaoCreateWithoutFornecedorInput>, Enumerable<FornecedorSancaoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<FornecedorSancaoCreateOrConnectWithoutFornecedorInput>
    upsert?: Enumerable<FornecedorSancaoUpsertWithWhereUniqueWithoutFornecedorInput>
    createMany?: FornecedorSancaoCreateManyFornecedorInputEnvelope
    set?: Enumerable<FornecedorSancaoWhereUniqueInput>
    disconnect?: Enumerable<FornecedorSancaoWhereUniqueInput>
    delete?: Enumerable<FornecedorSancaoWhereUniqueInput>
    connect?: Enumerable<FornecedorSancaoWhereUniqueInput>
    update?: Enumerable<FornecedorSancaoUpdateWithWhereUniqueWithoutFornecedorInput>
    updateMany?: Enumerable<FornecedorSancaoUpdateManyWithWhereWithoutFornecedorInput>
    deleteMany?: Enumerable<FornecedorSancaoScalarWhereInput>
  }

  export type ContratoUncheckedUpdateManyWithoutFornecedorNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutFornecedorInput>, Enumerable<ContratoUncheckedCreateWithoutFornecedorInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutFornecedorInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutFornecedorInput>
    createMany?: ContratoCreateManyFornecedorInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutFornecedorInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutFornecedorInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type FornecedorCreateNestedOneWithoutContatosInput = {
    create?: XOR<FornecedorCreateWithoutContatosInput, FornecedorUncheckedCreateWithoutContatosInput>
    connectOrCreate?: FornecedorCreateOrConnectWithoutContatosInput
    connect?: FornecedorWhereUniqueInput
  }

  export type FornecedorUpdateOneRequiredWithoutContatosNestedInput = {
    create?: XOR<FornecedorCreateWithoutContatosInput, FornecedorUncheckedCreateWithoutContatosInput>
    connectOrCreate?: FornecedorCreateOrConnectWithoutContatosInput
    upsert?: FornecedorUpsertWithoutContatosInput
    connect?: FornecedorWhereUniqueInput
    update?: XOR<FornecedorUpdateWithoutContatosInput, FornecedorUncheckedUpdateWithoutContatosInput>
  }

  export type FornecedorCreateNestedOneWithoutSancoesInput = {
    create?: XOR<FornecedorCreateWithoutSancoesInput, FornecedorUncheckedCreateWithoutSancoesInput>
    connectOrCreate?: FornecedorCreateOrConnectWithoutSancoesInput
    connect?: FornecedorWhereUniqueInput
  }

  export type EnumTipoSancaoFieldUpdateOperationsInput = {
    set?: TipoSancao
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FornecedorUpdateOneRequiredWithoutSancoesNestedInput = {
    create?: XOR<FornecedorCreateWithoutSancoesInput, FornecedorUncheckedCreateWithoutSancoesInput>
    connectOrCreate?: FornecedorCreateOrConnectWithoutSancoesInput
    upsert?: FornecedorUpsertWithoutSancoesInput
    connect?: FornecedorWhereUniqueInput
    update?: XOR<FornecedorUpdateWithoutSancoesInput, FornecedorUncheckedUpdateWithoutSancoesInput>
  }

  export type OrgaoCreateNestedOneWithoutServidoresInput = {
    create?: XOR<OrgaoCreateWithoutServidoresInput, OrgaoUncheckedCreateWithoutServidoresInput>
    connectOrCreate?: OrgaoCreateOrConnectWithoutServidoresInput
    connect?: OrgaoWhereUniqueInput
  }

  export type UnidadeOrganizacionalCreateNestedOneWithoutServidoresInput = {
    create?: XOR<UnidadeOrganizacionalCreateWithoutServidoresInput, UnidadeOrganizacionalUncheckedCreateWithoutServidoresInput>
    connectOrCreate?: UnidadeOrganizacionalCreateOrConnectWithoutServidoresInput
    connect?: UnidadeOrganizacionalWhereUniqueInput
  }

  export type ContratoCreateNestedManyWithoutGestorInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutGestorInput>, Enumerable<ContratoUncheckedCreateWithoutGestorInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutGestorInput>
    createMany?: ContratoCreateManyGestorInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type ContratoCreateNestedManyWithoutFiscalInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutFiscalInput>, Enumerable<ContratoUncheckedCreateWithoutFiscalInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutFiscalInput>
    createMany?: ContratoCreateManyFiscalInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type ContratoUncheckedCreateNestedManyWithoutGestorInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutGestorInput>, Enumerable<ContratoUncheckedCreateWithoutGestorInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutGestorInput>
    createMany?: ContratoCreateManyGestorInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type ContratoUncheckedCreateNestedManyWithoutFiscalInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutFiscalInput>, Enumerable<ContratoUncheckedCreateWithoutFiscalInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutFiscalInput>
    createMany?: ContratoCreateManyFiscalInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type OrgaoUpdateOneWithoutServidoresNestedInput = {
    create?: XOR<OrgaoCreateWithoutServidoresInput, OrgaoUncheckedCreateWithoutServidoresInput>
    connectOrCreate?: OrgaoCreateOrConnectWithoutServidoresInput
    upsert?: OrgaoUpsertWithoutServidoresInput
    disconnect?: boolean
    delete?: boolean
    connect?: OrgaoWhereUniqueInput
    update?: XOR<OrgaoUpdateWithoutServidoresInput, OrgaoUncheckedUpdateWithoutServidoresInput>
  }

  export type UnidadeOrganizacionalUpdateOneWithoutServidoresNestedInput = {
    create?: XOR<UnidadeOrganizacionalCreateWithoutServidoresInput, UnidadeOrganizacionalUncheckedCreateWithoutServidoresInput>
    connectOrCreate?: UnidadeOrganizacionalCreateOrConnectWithoutServidoresInput
    upsert?: UnidadeOrganizacionalUpsertWithoutServidoresInput
    disconnect?: boolean
    delete?: boolean
    connect?: UnidadeOrganizacionalWhereUniqueInput
    update?: XOR<UnidadeOrganizacionalUpdateWithoutServidoresInput, UnidadeOrganizacionalUncheckedUpdateWithoutServidoresInput>
  }

  export type ContratoUpdateManyWithoutGestorNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutGestorInput>, Enumerable<ContratoUncheckedCreateWithoutGestorInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutGestorInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutGestorInput>
    createMany?: ContratoCreateManyGestorInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutGestorInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutGestorInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type ContratoUpdateManyWithoutFiscalNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutFiscalInput>, Enumerable<ContratoUncheckedCreateWithoutFiscalInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutFiscalInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutFiscalInput>
    createMany?: ContratoCreateManyFiscalInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutFiscalInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutFiscalInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type ContratoUncheckedUpdateManyWithoutGestorNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutGestorInput>, Enumerable<ContratoUncheckedCreateWithoutGestorInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutGestorInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutGestorInput>
    createMany?: ContratoCreateManyGestorInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutGestorInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutGestorInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type ContratoUncheckedUpdateManyWithoutFiscalNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutFiscalInput>, Enumerable<ContratoUncheckedCreateWithoutFiscalInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutFiscalInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutFiscalInput>
    createMany?: ContratoCreateManyFiscalInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutFiscalInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutFiscalInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type UnidadeFspCreateNestedOneWithoutContratosInput = {
    create?: XOR<UnidadeFspCreateWithoutContratosInput, UnidadeFspUncheckedCreateWithoutContratosInput>
    connectOrCreate?: UnidadeFspCreateOrConnectWithoutContratosInput
    connect?: UnidadeFspWhereUniqueInput
  }

  export type ServidorCreateNestedOneWithoutGestorContratosInput = {
    create?: XOR<ServidorCreateWithoutGestorContratosInput, ServidorUncheckedCreateWithoutGestorContratosInput>
    connectOrCreate?: ServidorCreateOrConnectWithoutGestorContratosInput
    connect?: ServidorWhereUniqueInput
  }

  export type ServidorCreateNestedOneWithoutFiscalContratosInput = {
    create?: XOR<ServidorCreateWithoutFiscalContratosInput, ServidorUncheckedCreateWithoutFiscalContratosInput>
    connectOrCreate?: ServidorCreateOrConnectWithoutFiscalContratosInput
    connect?: ServidorWhereUniqueInput
  }

  export type FornecedorCreateNestedOneWithoutContratosInput = {
    create?: XOR<FornecedorCreateWithoutContratosInput, FornecedorUncheckedCreateWithoutContratosInput>
    connectOrCreate?: FornecedorCreateOrConnectWithoutContratosInput
    connect?: FornecedorWhereUniqueInput
  }

  export type AditivoCreateNestedManyWithoutContratoInput = {
    create?: XOR<Enumerable<AditivoCreateWithoutContratoInput>, Enumerable<AditivoUncheckedCreateWithoutContratoInput>>
    connectOrCreate?: Enumerable<AditivoCreateOrConnectWithoutContratoInput>
    createMany?: AditivoCreateManyContratoInputEnvelope
    connect?: Enumerable<AditivoWhereUniqueInput>
  }

  export type AditivoUncheckedCreateNestedManyWithoutContratoInput = {
    create?: XOR<Enumerable<AditivoCreateWithoutContratoInput>, Enumerable<AditivoUncheckedCreateWithoutContratoInput>>
    connectOrCreate?: Enumerable<AditivoCreateOrConnectWithoutContratoInput>
    createMany?: AditivoCreateManyContratoInputEnvelope
    connect?: Enumerable<AditivoWhereUniqueInput>
  }

  export type UnidadeFspUpdateOneRequiredWithoutContratosNestedInput = {
    create?: XOR<UnidadeFspCreateWithoutContratosInput, UnidadeFspUncheckedCreateWithoutContratosInput>
    connectOrCreate?: UnidadeFspCreateOrConnectWithoutContratosInput
    upsert?: UnidadeFspUpsertWithoutContratosInput
    connect?: UnidadeFspWhereUniqueInput
    update?: XOR<UnidadeFspUpdateWithoutContratosInput, UnidadeFspUncheckedUpdateWithoutContratosInput>
  }

  export type ServidorUpdateOneRequiredWithoutGestorContratosNestedInput = {
    create?: XOR<ServidorCreateWithoutGestorContratosInput, ServidorUncheckedCreateWithoutGestorContratosInput>
    connectOrCreate?: ServidorCreateOrConnectWithoutGestorContratosInput
    upsert?: ServidorUpsertWithoutGestorContratosInput
    connect?: ServidorWhereUniqueInput
    update?: XOR<ServidorUpdateWithoutGestorContratosInput, ServidorUncheckedUpdateWithoutGestorContratosInput>
  }

  export type ServidorUpdateOneRequiredWithoutFiscalContratosNestedInput = {
    create?: XOR<ServidorCreateWithoutFiscalContratosInput, ServidorUncheckedCreateWithoutFiscalContratosInput>
    connectOrCreate?: ServidorCreateOrConnectWithoutFiscalContratosInput
    upsert?: ServidorUpsertWithoutFiscalContratosInput
    connect?: ServidorWhereUniqueInput
    update?: XOR<ServidorUpdateWithoutFiscalContratosInput, ServidorUncheckedUpdateWithoutFiscalContratosInput>
  }

  export type FornecedorUpdateOneRequiredWithoutContratosNestedInput = {
    create?: XOR<FornecedorCreateWithoutContratosInput, FornecedorUncheckedCreateWithoutContratosInput>
    connectOrCreate?: FornecedorCreateOrConnectWithoutContratosInput
    upsert?: FornecedorUpsertWithoutContratosInput
    connect?: FornecedorWhereUniqueInput
    update?: XOR<FornecedorUpdateWithoutContratosInput, FornecedorUncheckedUpdateWithoutContratosInput>
  }

  export type AditivoUpdateManyWithoutContratoNestedInput = {
    create?: XOR<Enumerable<AditivoCreateWithoutContratoInput>, Enumerable<AditivoUncheckedCreateWithoutContratoInput>>
    connectOrCreate?: Enumerable<AditivoCreateOrConnectWithoutContratoInput>
    upsert?: Enumerable<AditivoUpsertWithWhereUniqueWithoutContratoInput>
    createMany?: AditivoCreateManyContratoInputEnvelope
    set?: Enumerable<AditivoWhereUniqueInput>
    disconnect?: Enumerable<AditivoWhereUniqueInput>
    delete?: Enumerable<AditivoWhereUniqueInput>
    connect?: Enumerable<AditivoWhereUniqueInput>
    update?: Enumerable<AditivoUpdateWithWhereUniqueWithoutContratoInput>
    updateMany?: Enumerable<AditivoUpdateManyWithWhereWithoutContratoInput>
    deleteMany?: Enumerable<AditivoScalarWhereInput>
  }

  export type AditivoUncheckedUpdateManyWithoutContratoNestedInput = {
    create?: XOR<Enumerable<AditivoCreateWithoutContratoInput>, Enumerable<AditivoUncheckedCreateWithoutContratoInput>>
    connectOrCreate?: Enumerable<AditivoCreateOrConnectWithoutContratoInput>
    upsert?: Enumerable<AditivoUpsertWithWhereUniqueWithoutContratoInput>
    createMany?: AditivoCreateManyContratoInputEnvelope
    set?: Enumerable<AditivoWhereUniqueInput>
    disconnect?: Enumerable<AditivoWhereUniqueInput>
    delete?: Enumerable<AditivoWhereUniqueInput>
    connect?: Enumerable<AditivoWhereUniqueInput>
    update?: Enumerable<AditivoUpdateWithWhereUniqueWithoutContratoInput>
    updateMany?: Enumerable<AditivoUpdateManyWithWhereWithoutContratoInput>
    deleteMany?: Enumerable<AditivoScalarWhereInput>
  }

  export type ContratoCreateNestedOneWithoutAditivosInput = {
    create?: XOR<ContratoCreateWithoutAditivosInput, ContratoUncheckedCreateWithoutAditivosInput>
    connectOrCreate?: ContratoCreateOrConnectWithoutAditivosInput
    connect?: ContratoWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ContratoUpdateOneRequiredWithoutAditivosNestedInput = {
    create?: XOR<ContratoCreateWithoutAditivosInput, ContratoUncheckedCreateWithoutAditivosInput>
    connectOrCreate?: ContratoCreateOrConnectWithoutAditivosInput
    upsert?: ContratoUpsertWithoutAditivosInput
    connect?: ContratoWhereUniqueInput
    update?: XOR<ContratoUpdateWithoutAditivosInput, ContratoUncheckedUpdateWithoutAditivosInput>
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }
  export type NestedJsonNullableFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase>, Exclude<keyof Required<NestedJsonNullableFilterBase>, 'path'>>,
        Required<NestedJsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase>, 'path'>>

  export type NestedJsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedEnumTipoOrgaoFilter = {
    equals?: TipoOrgao
    in?: Enumerable<TipoOrgao>
    notIn?: Enumerable<TipoOrgao>
    not?: NestedEnumTipoOrgaoFilter | TipoOrgao
  }

  export type NestedEnumTipoOrgaoWithAggregatesFilter = {
    equals?: TipoOrgao
    in?: Enumerable<TipoOrgao>
    notIn?: Enumerable<TipoOrgao>
    not?: NestedEnumTipoOrgaoWithAggregatesFilter | TipoOrgao
    _count?: NestedIntFilter
    _min?: NestedEnumTipoOrgaoFilter
    _max?: NestedEnumTipoOrgaoFilter
  }

  export type NestedEnumNivelUnidadeFilter = {
    equals?: NivelUnidade
    in?: Enumerable<NivelUnidade>
    notIn?: Enumerable<NivelUnidade>
    not?: NestedEnumNivelUnidadeFilter | NivelUnidade
  }

  export type NestedEnumNivelUnidadeWithAggregatesFilter = {
    equals?: NivelUnidade
    in?: Enumerable<NivelUnidade>
    notIn?: Enumerable<NivelUnidade>
    not?: NestedEnumNivelUnidadeWithAggregatesFilter | NivelUnidade
    _count?: NestedIntFilter
    _min?: NestedEnumNivelUnidadeFilter
    _max?: NestedEnumNivelUnidadeFilter
  }

  export type NestedEnumTipoPessoaFilter = {
    equals?: TipoPessoa
    in?: Enumerable<TipoPessoa>
    notIn?: Enumerable<TipoPessoa>
    not?: NestedEnumTipoPessoaFilter | TipoPessoa
  }

  export type NestedEnumPorteEmpresaNullableFilter = {
    equals?: PorteEmpresa | null
    in?: Enumerable<PorteEmpresa> | null
    notIn?: Enumerable<PorteEmpresa> | null
    not?: NestedEnumPorteEmpresaNullableFilter | PorteEmpresa | null
  }

  export type NestedEnumSituacaoFornecedorFilter = {
    equals?: SituacaoFornecedor
    in?: Enumerable<SituacaoFornecedor>
    notIn?: Enumerable<SituacaoFornecedor>
    not?: NestedEnumSituacaoFornecedorFilter | SituacaoFornecedor
  }

  export type NestedEnumTipoPessoaWithAggregatesFilter = {
    equals?: TipoPessoa
    in?: Enumerable<TipoPessoa>
    notIn?: Enumerable<TipoPessoa>
    not?: NestedEnumTipoPessoaWithAggregatesFilter | TipoPessoa
    _count?: NestedIntFilter
    _min?: NestedEnumTipoPessoaFilter
    _max?: NestedEnumTipoPessoaFilter
  }

  export type NestedEnumPorteEmpresaNullableWithAggregatesFilter = {
    equals?: PorteEmpresa | null
    in?: Enumerable<PorteEmpresa> | null
    notIn?: Enumerable<PorteEmpresa> | null
    not?: NestedEnumPorteEmpresaNullableWithAggregatesFilter | PorteEmpresa | null
    _count?: NestedIntNullableFilter
    _min?: NestedEnumPorteEmpresaNullableFilter
    _max?: NestedEnumPorteEmpresaNullableFilter
  }

  export type NestedEnumSituacaoFornecedorWithAggregatesFilter = {
    equals?: SituacaoFornecedor
    in?: Enumerable<SituacaoFornecedor>
    notIn?: Enumerable<SituacaoFornecedor>
    not?: NestedEnumSituacaoFornecedorWithAggregatesFilter | SituacaoFornecedor
    _count?: NestedIntFilter
    _min?: NestedEnumSituacaoFornecedorFilter
    _max?: NestedEnumSituacaoFornecedorFilter
  }

  export type NestedEnumTipoSancaoFilter = {
    equals?: TipoSancao
    in?: Enumerable<TipoSancao>
    notIn?: Enumerable<TipoSancao>
    not?: NestedEnumTipoSancaoFilter | TipoSancao
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedEnumTipoSancaoWithAggregatesFilter = {
    equals?: TipoSancao
    in?: Enumerable<TipoSancao>
    notIn?: Enumerable<TipoSancao>
    not?: NestedEnumTipoSancaoWithAggregatesFilter | TipoSancao
    _count?: NestedIntFilter
    _min?: NestedEnumTipoSancaoFilter
    _max?: NestedEnumTipoSancaoFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type NestedIntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }
  export type NestedJsonFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase>, Exclude<keyof Required<NestedJsonFilterBase>, 'path'>>,
        Required<NestedJsonFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase>, 'path'>>

  export type NestedJsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type ContratoCreateWithoutUnidadeFspInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gestor: ServidorCreateNestedOneWithoutGestorContratosInput
    fiscal: ServidorCreateNestedOneWithoutFiscalContratosInput
    fornecedor: FornecedorCreateNestedOneWithoutContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateWithoutUnidadeFspInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    gestorId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    aditivos?: AditivoUncheckedCreateNestedManyWithoutContratoInput
  }

  export type ContratoCreateOrConnectWithoutUnidadeFspInput = {
    where: ContratoWhereUniqueInput
    create: XOR<ContratoCreateWithoutUnidadeFspInput, ContratoUncheckedCreateWithoutUnidadeFspInput>
  }

  export type ContratoCreateManyUnidadeFspInputEnvelope = {
    data: Enumerable<ContratoCreateManyUnidadeFspInput>
    skipDuplicates?: boolean
  }

  export type ContratoUpsertWithWhereUniqueWithoutUnidadeFspInput = {
    where: ContratoWhereUniqueInput
    update: XOR<ContratoUpdateWithoutUnidadeFspInput, ContratoUncheckedUpdateWithoutUnidadeFspInput>
    create: XOR<ContratoCreateWithoutUnidadeFspInput, ContratoUncheckedCreateWithoutUnidadeFspInput>
  }

  export type ContratoUpdateWithWhereUniqueWithoutUnidadeFspInput = {
    where: ContratoWhereUniqueInput
    data: XOR<ContratoUpdateWithoutUnidadeFspInput, ContratoUncheckedUpdateWithoutUnidadeFspInput>
  }

  export type ContratoUpdateManyWithWhereWithoutUnidadeFspInput = {
    where: ContratoScalarWhereInput
    data: XOR<ContratoUpdateManyMutationInput, ContratoUncheckedUpdateManyWithoutContratosInput>
  }

  export type ContratoScalarWhereInput = {
    AND?: Enumerable<ContratoScalarWhereInput>
    OR?: Enumerable<ContratoScalarWhereInput>
    NOT?: Enumerable<ContratoScalarWhereInput>
    id?: StringFilter | string
    protocoloCabeca?: StringNullableFilter | string | null
    numGms?: IntFilter | number
    anoGms?: IntFilter | number
    unidadeFspId?: StringFilter | string
    gestorId?: StringFilter | string
    fiscalId?: StringFilter | string
    fornecedorId?: StringFilter | string
    modalidade?: StringFilter | string
    objeto?: StringFilter | string
    valorAnualCents?: IntFilter | number
    dataInicio?: DateTimeNullableFilter | Date | string | null
    dataFimOrig?: DateTimeNullableFilter | Date | string | null
    status?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type UnidadeOrganizacionalCreateWithoutMunicipioInput = {
    id?: string
    sigla: string
    nome: string
    nivel: NivelUnidade
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao: OrgaoCreateNestedOneWithoutUnidadesInput
    parent?: UnidadeOrganizacionalCreateNestedOneWithoutChildrenInput
    children?: UnidadeOrganizacionalCreateNestedManyWithoutParentInput
    servidores?: ServidorCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalUncheckedCreateWithoutMunicipioInput = {
    id?: string
    orgaoId: string
    parentId?: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutParentInput
    servidores?: ServidorUncheckedCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalCreateOrConnectWithoutMunicipioInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    create: XOR<UnidadeOrganizacionalCreateWithoutMunicipioInput, UnidadeOrganizacionalUncheckedCreateWithoutMunicipioInput>
  }

  export type UnidadeOrganizacionalCreateManyMunicipioInputEnvelope = {
    data: Enumerable<UnidadeOrganizacionalCreateManyMunicipioInput>
    skipDuplicates?: boolean
  }

  export type FornecedorCreateWithoutMunicipioInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contatos?: FornecedorContatoCreateNestedManyWithoutFornecedorInput
    sancoes?: FornecedorSancaoCreateNestedManyWithoutFornecedorInput
    contratos?: ContratoCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorUncheckedCreateWithoutMunicipioInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contatos?: FornecedorContatoUncheckedCreateNestedManyWithoutFornecedorInput
    sancoes?: FornecedorSancaoUncheckedCreateNestedManyWithoutFornecedorInput
    contratos?: ContratoUncheckedCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorCreateOrConnectWithoutMunicipioInput = {
    where: FornecedorWhereUniqueInput
    create: XOR<FornecedorCreateWithoutMunicipioInput, FornecedorUncheckedCreateWithoutMunicipioInput>
  }

  export type FornecedorCreateManyMunicipioInputEnvelope = {
    data: Enumerable<FornecedorCreateManyMunicipioInput>
    skipDuplicates?: boolean
  }

  export type UnidadeOrganizacionalUpsertWithWhereUniqueWithoutMunicipioInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    update: XOR<UnidadeOrganizacionalUpdateWithoutMunicipioInput, UnidadeOrganizacionalUncheckedUpdateWithoutMunicipioInput>
    create: XOR<UnidadeOrganizacionalCreateWithoutMunicipioInput, UnidadeOrganizacionalUncheckedCreateWithoutMunicipioInput>
  }

  export type UnidadeOrganizacionalUpdateWithWhereUniqueWithoutMunicipioInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    data: XOR<UnidadeOrganizacionalUpdateWithoutMunicipioInput, UnidadeOrganizacionalUncheckedUpdateWithoutMunicipioInput>
  }

  export type UnidadeOrganizacionalUpdateManyWithWhereWithoutMunicipioInput = {
    where: UnidadeOrganizacionalScalarWhereInput
    data: XOR<UnidadeOrganizacionalUpdateManyMutationInput, UnidadeOrganizacionalUncheckedUpdateManyWithoutUnidadesInput>
  }

  export type UnidadeOrganizacionalScalarWhereInput = {
    AND?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
    OR?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
    NOT?: Enumerable<UnidadeOrganizacionalScalarWhereInput>
    id?: StringFilter | string
    orgaoId?: StringFilter | string
    parentId?: StringNullableFilter | string | null
    sigla?: StringFilter | string
    nome?: StringFilter | string
    nivel?: EnumNivelUnidadeFilter | NivelUnidade
    municipioId?: StringFilter | string
    ativo?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type FornecedorUpsertWithWhereUniqueWithoutMunicipioInput = {
    where: FornecedorWhereUniqueInput
    update: XOR<FornecedorUpdateWithoutMunicipioInput, FornecedorUncheckedUpdateWithoutMunicipioInput>
    create: XOR<FornecedorCreateWithoutMunicipioInput, FornecedorUncheckedCreateWithoutMunicipioInput>
  }

  export type FornecedorUpdateWithWhereUniqueWithoutMunicipioInput = {
    where: FornecedorWhereUniqueInput
    data: XOR<FornecedorUpdateWithoutMunicipioInput, FornecedorUncheckedUpdateWithoutMunicipioInput>
  }

  export type FornecedorUpdateManyWithWhereWithoutMunicipioInput = {
    where: FornecedorScalarWhereInput
    data: XOR<FornecedorUpdateManyMutationInput, FornecedorUncheckedUpdateManyWithoutFornecedoresInput>
  }

  export type FornecedorScalarWhereInput = {
    AND?: Enumerable<FornecedorScalarWhereInput>
    OR?: Enumerable<FornecedorScalarWhereInput>
    NOT?: Enumerable<FornecedorScalarWhereInput>
    id?: StringFilter | string
    tipoPessoa?: EnumTipoPessoaFilter | TipoPessoa
    documento?: StringFilter | string
    razaoSocial?: StringFilter | string
    nomeFantasia?: StringNullableFilter | string | null
    inscricaoEstadual?: StringNullableFilter | string | null
    porte?: EnumPorteEmpresaNullableFilter | PorteEmpresa | null
    municipioId?: StringNullableFilter | string | null
    situacao?: EnumSituacaoFornecedorFilter | SituacaoFornecedor
    codigoLegado?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type DominioValorCreateWithoutDominioInput = {
    id?: string
    codigo: string
    label: string
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: DominioValorCreateNestedOneWithoutChildrenInput
    children?: DominioValorCreateNestedManyWithoutParentInput
  }

  export type DominioValorUncheckedCreateWithoutDominioInput = {
    id?: string
    codigo: string
    label: string
    parentId?: string | null
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: DominioValorUncheckedCreateNestedManyWithoutParentInput
  }

  export type DominioValorCreateOrConnectWithoutDominioInput = {
    where: DominioValorWhereUniqueInput
    create: XOR<DominioValorCreateWithoutDominioInput, DominioValorUncheckedCreateWithoutDominioInput>
  }

  export type DominioValorCreateManyDominioInputEnvelope = {
    data: Enumerable<DominioValorCreateManyDominioInput>
    skipDuplicates?: boolean
  }

  export type DominioValorUpsertWithWhereUniqueWithoutDominioInput = {
    where: DominioValorWhereUniqueInput
    update: XOR<DominioValorUpdateWithoutDominioInput, DominioValorUncheckedUpdateWithoutDominioInput>
    create: XOR<DominioValorCreateWithoutDominioInput, DominioValorUncheckedCreateWithoutDominioInput>
  }

  export type DominioValorUpdateWithWhereUniqueWithoutDominioInput = {
    where: DominioValorWhereUniqueInput
    data: XOR<DominioValorUpdateWithoutDominioInput, DominioValorUncheckedUpdateWithoutDominioInput>
  }

  export type DominioValorUpdateManyWithWhereWithoutDominioInput = {
    where: DominioValorScalarWhereInput
    data: XOR<DominioValorUpdateManyMutationInput, DominioValorUncheckedUpdateManyWithoutValoresInput>
  }

  export type DominioValorScalarWhereInput = {
    AND?: Enumerable<DominioValorScalarWhereInput>
    OR?: Enumerable<DominioValorScalarWhereInput>
    NOT?: Enumerable<DominioValorScalarWhereInput>
    id?: StringFilter | string
    dominioId?: StringFilter | string
    codigo?: StringFilter | string
    label?: StringFilter | string
    parentId?: StringNullableFilter | string | null
    ordem?: IntFilter | number
    ativo?: BoolFilter | boolean
    metadata?: JsonNullableFilter
    codigoLegado?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type DominioCreateWithoutValoresInput = {
    id?: string
    slug: string
    nome: string
    descricao?: string | null
    editavelPeloUsuario?: boolean
    permiteHierarquia?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DominioUncheckedCreateWithoutValoresInput = {
    id?: string
    slug: string
    nome: string
    descricao?: string | null
    editavelPeloUsuario?: boolean
    permiteHierarquia?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DominioCreateOrConnectWithoutValoresInput = {
    where: DominioWhereUniqueInput
    create: XOR<DominioCreateWithoutValoresInput, DominioUncheckedCreateWithoutValoresInput>
  }

  export type DominioValorCreateWithoutChildrenInput = {
    id?: string
    codigo: string
    label: string
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dominio: DominioCreateNestedOneWithoutValoresInput
    parent?: DominioValorCreateNestedOneWithoutChildrenInput
  }

  export type DominioValorUncheckedCreateWithoutChildrenInput = {
    id?: string
    dominioId: string
    codigo: string
    label: string
    parentId?: string | null
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DominioValorCreateOrConnectWithoutChildrenInput = {
    where: DominioValorWhereUniqueInput
    create: XOR<DominioValorCreateWithoutChildrenInput, DominioValorUncheckedCreateWithoutChildrenInput>
  }

  export type DominioValorCreateWithoutParentInput = {
    id?: string
    codigo: string
    label: string
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dominio: DominioCreateNestedOneWithoutValoresInput
    children?: DominioValorCreateNestedManyWithoutParentInput
  }

  export type DominioValorUncheckedCreateWithoutParentInput = {
    id?: string
    dominioId: string
    codigo: string
    label: string
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: DominioValorUncheckedCreateNestedManyWithoutParentInput
  }

  export type DominioValorCreateOrConnectWithoutParentInput = {
    where: DominioValorWhereUniqueInput
    create: XOR<DominioValorCreateWithoutParentInput, DominioValorUncheckedCreateWithoutParentInput>
  }

  export type DominioValorCreateManyParentInputEnvelope = {
    data: Enumerable<DominioValorCreateManyParentInput>
    skipDuplicates?: boolean
  }

  export type DominioUpsertWithoutValoresInput = {
    update: XOR<DominioUpdateWithoutValoresInput, DominioUncheckedUpdateWithoutValoresInput>
    create: XOR<DominioCreateWithoutValoresInput, DominioUncheckedCreateWithoutValoresInput>
  }

  export type DominioUpdateWithoutValoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    editavelPeloUsuario?: BoolFieldUpdateOperationsInput | boolean
    permiteHierarquia?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DominioUncheckedUpdateWithoutValoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    editavelPeloUsuario?: BoolFieldUpdateOperationsInput | boolean
    permiteHierarquia?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DominioValorUpsertWithoutChildrenInput = {
    update: XOR<DominioValorUpdateWithoutChildrenInput, DominioValorUncheckedUpdateWithoutChildrenInput>
    create: XOR<DominioValorCreateWithoutChildrenInput, DominioValorUncheckedCreateWithoutChildrenInput>
  }

  export type DominioValorUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dominio?: DominioUpdateOneRequiredWithoutValoresNestedInput
    parent?: DominioValorUpdateOneWithoutChildrenNestedInput
  }

  export type DominioValorUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    dominioId?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DominioValorUpsertWithWhereUniqueWithoutParentInput = {
    where: DominioValorWhereUniqueInput
    update: XOR<DominioValorUpdateWithoutParentInput, DominioValorUncheckedUpdateWithoutParentInput>
    create: XOR<DominioValorCreateWithoutParentInput, DominioValorUncheckedCreateWithoutParentInput>
  }

  export type DominioValorUpdateWithWhereUniqueWithoutParentInput = {
    where: DominioValorWhereUniqueInput
    data: XOR<DominioValorUpdateWithoutParentInput, DominioValorUncheckedUpdateWithoutParentInput>
  }

  export type DominioValorUpdateManyWithWhereWithoutParentInput = {
    where: DominioValorScalarWhereInput
    data: XOR<DominioValorUpdateManyMutationInput, DominioValorUncheckedUpdateManyWithoutChildrenInput>
  }

  export type UnidadeOrganizacionalCreateWithoutOrgaoInput = {
    id?: string
    sigla: string
    nome: string
    nivel: NivelUnidade
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: UnidadeOrganizacionalCreateNestedOneWithoutChildrenInput
    children?: UnidadeOrganizacionalCreateNestedManyWithoutParentInput
    municipio: MunicipioCreateNestedOneWithoutUnidadesInput
    servidores?: ServidorCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalUncheckedCreateWithoutOrgaoInput = {
    id?: string
    parentId?: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutParentInput
    servidores?: ServidorUncheckedCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalCreateOrConnectWithoutOrgaoInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    create: XOR<UnidadeOrganizacionalCreateWithoutOrgaoInput, UnidadeOrganizacionalUncheckedCreateWithoutOrgaoInput>
  }

  export type UnidadeOrganizacionalCreateManyOrgaoInputEnvelope = {
    data: Enumerable<UnidadeOrganizacionalCreateManyOrgaoInput>
    skipDuplicates?: boolean
  }

  export type ServidorCreateWithoutOrgaoInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    unidade?: UnidadeOrganizacionalCreateNestedOneWithoutServidoresInput
    gestorContratos?: ContratoCreateNestedManyWithoutGestorInput
    fiscalContratos?: ContratoCreateNestedManyWithoutFiscalInput
  }

  export type ServidorUncheckedCreateWithoutOrgaoInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    unidadeId?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    gestorContratos?: ContratoUncheckedCreateNestedManyWithoutGestorInput
    fiscalContratos?: ContratoUncheckedCreateNestedManyWithoutFiscalInput
  }

  export type ServidorCreateOrConnectWithoutOrgaoInput = {
    where: ServidorWhereUniqueInput
    create: XOR<ServidorCreateWithoutOrgaoInput, ServidorUncheckedCreateWithoutOrgaoInput>
  }

  export type ServidorCreateManyOrgaoInputEnvelope = {
    data: Enumerable<ServidorCreateManyOrgaoInput>
    skipDuplicates?: boolean
  }

  export type UnidadeOrganizacionalUpsertWithWhereUniqueWithoutOrgaoInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    update: XOR<UnidadeOrganizacionalUpdateWithoutOrgaoInput, UnidadeOrganizacionalUncheckedUpdateWithoutOrgaoInput>
    create: XOR<UnidadeOrganizacionalCreateWithoutOrgaoInput, UnidadeOrganizacionalUncheckedCreateWithoutOrgaoInput>
  }

  export type UnidadeOrganizacionalUpdateWithWhereUniqueWithoutOrgaoInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    data: XOR<UnidadeOrganizacionalUpdateWithoutOrgaoInput, UnidadeOrganizacionalUncheckedUpdateWithoutOrgaoInput>
  }

  export type UnidadeOrganizacionalUpdateManyWithWhereWithoutOrgaoInput = {
    where: UnidadeOrganizacionalScalarWhereInput
    data: XOR<UnidadeOrganizacionalUpdateManyMutationInput, UnidadeOrganizacionalUncheckedUpdateManyWithoutUnidadesInput>
  }

  export type ServidorUpsertWithWhereUniqueWithoutOrgaoInput = {
    where: ServidorWhereUniqueInput
    update: XOR<ServidorUpdateWithoutOrgaoInput, ServidorUncheckedUpdateWithoutOrgaoInput>
    create: XOR<ServidorCreateWithoutOrgaoInput, ServidorUncheckedCreateWithoutOrgaoInput>
  }

  export type ServidorUpdateWithWhereUniqueWithoutOrgaoInput = {
    where: ServidorWhereUniqueInput
    data: XOR<ServidorUpdateWithoutOrgaoInput, ServidorUncheckedUpdateWithoutOrgaoInput>
  }

  export type ServidorUpdateManyWithWhereWithoutOrgaoInput = {
    where: ServidorScalarWhereInput
    data: XOR<ServidorUpdateManyMutationInput, ServidorUncheckedUpdateManyWithoutServidoresInput>
  }

  export type ServidorScalarWhereInput = {
    AND?: Enumerable<ServidorScalarWhereInput>
    OR?: Enumerable<ServidorScalarWhereInput>
    NOT?: Enumerable<ServidorScalarWhereInput>
    id?: StringFilter | string
    nome?: StringFilter | string
    cpf?: StringNullableFilter | string | null
    rgFuncional?: StringNullableFilter | string | null
    cargo?: StringNullableFilter | string | null
    orgaoId?: StringNullableFilter | string | null
    unidadeId?: StringNullableFilter | string | null
    email?: StringNullableFilter | string | null
    telefone?: StringNullableFilter | string | null
    ativo?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type OrgaoCreateWithoutUnidadesInput = {
    id?: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    servidores?: ServidorCreateNestedManyWithoutOrgaoInput
  }

  export type OrgaoUncheckedCreateWithoutUnidadesInput = {
    id?: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    servidores?: ServidorUncheckedCreateNestedManyWithoutOrgaoInput
  }

  export type OrgaoCreateOrConnectWithoutUnidadesInput = {
    where: OrgaoWhereUniqueInput
    create: XOR<OrgaoCreateWithoutUnidadesInput, OrgaoUncheckedCreateWithoutUnidadesInput>
  }

  export type UnidadeOrganizacionalCreateWithoutChildrenInput = {
    id?: string
    sigla: string
    nome: string
    nivel: NivelUnidade
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao: OrgaoCreateNestedOneWithoutUnidadesInput
    parent?: UnidadeOrganizacionalCreateNestedOneWithoutChildrenInput
    municipio: MunicipioCreateNestedOneWithoutUnidadesInput
    servidores?: ServidorCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalUncheckedCreateWithoutChildrenInput = {
    id?: string
    orgaoId: string
    parentId?: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    servidores?: ServidorUncheckedCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalCreateOrConnectWithoutChildrenInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    create: XOR<UnidadeOrganizacionalCreateWithoutChildrenInput, UnidadeOrganizacionalUncheckedCreateWithoutChildrenInput>
  }

  export type UnidadeOrganizacionalCreateWithoutParentInput = {
    id?: string
    sigla: string
    nome: string
    nivel: NivelUnidade
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao: OrgaoCreateNestedOneWithoutUnidadesInput
    children?: UnidadeOrganizacionalCreateNestedManyWithoutParentInput
    municipio: MunicipioCreateNestedOneWithoutUnidadesInput
    servidores?: ServidorCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalUncheckedCreateWithoutParentInput = {
    id?: string
    orgaoId: string
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutParentInput
    servidores?: ServidorUncheckedCreateNestedManyWithoutUnidadeInput
  }

  export type UnidadeOrganizacionalCreateOrConnectWithoutParentInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    create: XOR<UnidadeOrganizacionalCreateWithoutParentInput, UnidadeOrganizacionalUncheckedCreateWithoutParentInput>
  }

  export type UnidadeOrganizacionalCreateManyParentInputEnvelope = {
    data: Enumerable<UnidadeOrganizacionalCreateManyParentInput>
    skipDuplicates?: boolean
  }

  export type MunicipioCreateWithoutUnidadesInput = {
    id?: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa?: string | null
    fornecedores?: FornecedorCreateNestedManyWithoutMunicipioInput
  }

  export type MunicipioUncheckedCreateWithoutUnidadesInput = {
    id?: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa?: string | null
    fornecedores?: FornecedorUncheckedCreateNestedManyWithoutMunicipioInput
  }

  export type MunicipioCreateOrConnectWithoutUnidadesInput = {
    where: MunicipioWhereUniqueInput
    create: XOR<MunicipioCreateWithoutUnidadesInput, MunicipioUncheckedCreateWithoutUnidadesInput>
  }

  export type ServidorCreateWithoutUnidadeInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao?: OrgaoCreateNestedOneWithoutServidoresInput
    gestorContratos?: ContratoCreateNestedManyWithoutGestorInput
    fiscalContratos?: ContratoCreateNestedManyWithoutFiscalInput
  }

  export type ServidorUncheckedCreateWithoutUnidadeInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    orgaoId?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    gestorContratos?: ContratoUncheckedCreateNestedManyWithoutGestorInput
    fiscalContratos?: ContratoUncheckedCreateNestedManyWithoutFiscalInput
  }

  export type ServidorCreateOrConnectWithoutUnidadeInput = {
    where: ServidorWhereUniqueInput
    create: XOR<ServidorCreateWithoutUnidadeInput, ServidorUncheckedCreateWithoutUnidadeInput>
  }

  export type ServidorCreateManyUnidadeInputEnvelope = {
    data: Enumerable<ServidorCreateManyUnidadeInput>
    skipDuplicates?: boolean
  }

  export type OrgaoUpsertWithoutUnidadesInput = {
    update: XOR<OrgaoUpdateWithoutUnidadesInput, OrgaoUncheckedUpdateWithoutUnidadesInput>
    create: XOR<OrgaoCreateWithoutUnidadesInput, OrgaoUncheckedCreateWithoutUnidadesInput>
  }

  export type OrgaoUpdateWithoutUnidadesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoOrgaoFieldUpdateOperationsInput | TipoOrgao
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    servidores?: ServidorUpdateManyWithoutOrgaoNestedInput
  }

  export type OrgaoUncheckedUpdateWithoutUnidadesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoOrgaoFieldUpdateOperationsInput | TipoOrgao
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    servidores?: ServidorUncheckedUpdateManyWithoutOrgaoNestedInput
  }

  export type UnidadeOrganizacionalUpsertWithoutChildrenInput = {
    update: XOR<UnidadeOrganizacionalUpdateWithoutChildrenInput, UnidadeOrganizacionalUncheckedUpdateWithoutChildrenInput>
    create: XOR<UnidadeOrganizacionalCreateWithoutChildrenInput, UnidadeOrganizacionalUncheckedCreateWithoutChildrenInput>
  }

  export type UnidadeOrganizacionalUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneRequiredWithoutUnidadesNestedInput
    parent?: UnidadeOrganizacionalUpdateOneWithoutChildrenNestedInput
    municipio?: MunicipioUpdateOneRequiredWithoutUnidadesNestedInput
    servidores?: ServidorUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgaoId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    municipioId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    servidores?: ServidorUncheckedUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalUpsertWithWhereUniqueWithoutParentInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    update: XOR<UnidadeOrganizacionalUpdateWithoutParentInput, UnidadeOrganizacionalUncheckedUpdateWithoutParentInput>
    create: XOR<UnidadeOrganizacionalCreateWithoutParentInput, UnidadeOrganizacionalUncheckedCreateWithoutParentInput>
  }

  export type UnidadeOrganizacionalUpdateWithWhereUniqueWithoutParentInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    data: XOR<UnidadeOrganizacionalUpdateWithoutParentInput, UnidadeOrganizacionalUncheckedUpdateWithoutParentInput>
  }

  export type UnidadeOrganizacionalUpdateManyWithWhereWithoutParentInput = {
    where: UnidadeOrganizacionalScalarWhereInput
    data: XOR<UnidadeOrganizacionalUpdateManyMutationInput, UnidadeOrganizacionalUncheckedUpdateManyWithoutChildrenInput>
  }

  export type MunicipioUpsertWithoutUnidadesInput = {
    update: XOR<MunicipioUpdateWithoutUnidadesInput, MunicipioUncheckedUpdateWithoutUnidadesInput>
    create: XOR<MunicipioCreateWithoutUnidadesInput, MunicipioUncheckedCreateWithoutUnidadesInput>
  }

  export type MunicipioUpdateWithoutUnidadesInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigoIbge?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    regiaoAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedores?: FornecedorUpdateManyWithoutMunicipioNestedInput
  }

  export type MunicipioUncheckedUpdateWithoutUnidadesInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigoIbge?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    regiaoAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedores?: FornecedorUncheckedUpdateManyWithoutMunicipioNestedInput
  }

  export type ServidorUpsertWithWhereUniqueWithoutUnidadeInput = {
    where: ServidorWhereUniqueInput
    update: XOR<ServidorUpdateWithoutUnidadeInput, ServidorUncheckedUpdateWithoutUnidadeInput>
    create: XOR<ServidorCreateWithoutUnidadeInput, ServidorUncheckedCreateWithoutUnidadeInput>
  }

  export type ServidorUpdateWithWhereUniqueWithoutUnidadeInput = {
    where: ServidorWhereUniqueInput
    data: XOR<ServidorUpdateWithoutUnidadeInput, ServidorUncheckedUpdateWithoutUnidadeInput>
  }

  export type ServidorUpdateManyWithWhereWithoutUnidadeInput = {
    where: ServidorScalarWhereInput
    data: XOR<ServidorUpdateManyMutationInput, ServidorUncheckedUpdateManyWithoutServidoresInput>
  }

  export type MunicipioCreateWithoutFornecedoresInput = {
    id?: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa?: string | null
    unidades?: UnidadeOrganizacionalCreateNestedManyWithoutMunicipioInput
  }

  export type MunicipioUncheckedCreateWithoutFornecedoresInput = {
    id?: string
    codigoIbge: string
    nome: string
    uf: string
    regiaoAdministrativa?: string | null
    unidades?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutMunicipioInput
  }

  export type MunicipioCreateOrConnectWithoutFornecedoresInput = {
    where: MunicipioWhereUniqueInput
    create: XOR<MunicipioCreateWithoutFornecedoresInput, MunicipioUncheckedCreateWithoutFornecedoresInput>
  }

  export type FornecedorContatoCreateWithoutFornecedorInput = {
    id?: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    principal?: boolean
    createdAt?: Date | string
  }

  export type FornecedorContatoUncheckedCreateWithoutFornecedorInput = {
    id?: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    principal?: boolean
    createdAt?: Date | string
  }

  export type FornecedorContatoCreateOrConnectWithoutFornecedorInput = {
    where: FornecedorContatoWhereUniqueInput
    create: XOR<FornecedorContatoCreateWithoutFornecedorInput, FornecedorContatoUncheckedCreateWithoutFornecedorInput>
  }

  export type FornecedorContatoCreateManyFornecedorInputEnvelope = {
    data: Enumerable<FornecedorContatoCreateManyFornecedorInput>
    skipDuplicates?: boolean
  }

  export type FornecedorSancaoCreateWithoutFornecedorInput = {
    id?: string
    tipo: TipoSancao
    processo?: string | null
    dataInicio: Date | string
    dataFim?: Date | string | null
    abrangencia?: string | null
    fonte?: string | null
    createdAt?: Date | string
  }

  export type FornecedorSancaoUncheckedCreateWithoutFornecedorInput = {
    id?: string
    tipo: TipoSancao
    processo?: string | null
    dataInicio: Date | string
    dataFim?: Date | string | null
    abrangencia?: string | null
    fonte?: string | null
    createdAt?: Date | string
  }

  export type FornecedorSancaoCreateOrConnectWithoutFornecedorInput = {
    where: FornecedorSancaoWhereUniqueInput
    create: XOR<FornecedorSancaoCreateWithoutFornecedorInput, FornecedorSancaoUncheckedCreateWithoutFornecedorInput>
  }

  export type FornecedorSancaoCreateManyFornecedorInputEnvelope = {
    data: Enumerable<FornecedorSancaoCreateManyFornecedorInput>
    skipDuplicates?: boolean
  }

  export type ContratoCreateWithoutFornecedorInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    unidadeFsp: UnidadeFspCreateNestedOneWithoutContratosInput
    gestor: ServidorCreateNestedOneWithoutGestorContratosInput
    fiscal: ServidorCreateNestedOneWithoutFiscalContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateWithoutFornecedorInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fiscalId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    aditivos?: AditivoUncheckedCreateNestedManyWithoutContratoInput
  }

  export type ContratoCreateOrConnectWithoutFornecedorInput = {
    where: ContratoWhereUniqueInput
    create: XOR<ContratoCreateWithoutFornecedorInput, ContratoUncheckedCreateWithoutFornecedorInput>
  }

  export type ContratoCreateManyFornecedorInputEnvelope = {
    data: Enumerable<ContratoCreateManyFornecedorInput>
    skipDuplicates?: boolean
  }

  export type MunicipioUpsertWithoutFornecedoresInput = {
    update: XOR<MunicipioUpdateWithoutFornecedoresInput, MunicipioUncheckedUpdateWithoutFornecedoresInput>
    create: XOR<MunicipioCreateWithoutFornecedoresInput, MunicipioUncheckedCreateWithoutFornecedoresInput>
  }

  export type MunicipioUpdateWithoutFornecedoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigoIbge?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    regiaoAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    unidades?: UnidadeOrganizacionalUpdateManyWithoutMunicipioNestedInput
  }

  export type MunicipioUncheckedUpdateWithoutFornecedoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigoIbge?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
    regiaoAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    unidades?: UnidadeOrganizacionalUncheckedUpdateManyWithoutMunicipioNestedInput
  }

  export type FornecedorContatoUpsertWithWhereUniqueWithoutFornecedorInput = {
    where: FornecedorContatoWhereUniqueInput
    update: XOR<FornecedorContatoUpdateWithoutFornecedorInput, FornecedorContatoUncheckedUpdateWithoutFornecedorInput>
    create: XOR<FornecedorContatoCreateWithoutFornecedorInput, FornecedorContatoUncheckedCreateWithoutFornecedorInput>
  }

  export type FornecedorContatoUpdateWithWhereUniqueWithoutFornecedorInput = {
    where: FornecedorContatoWhereUniqueInput
    data: XOR<FornecedorContatoUpdateWithoutFornecedorInput, FornecedorContatoUncheckedUpdateWithoutFornecedorInput>
  }

  export type FornecedorContatoUpdateManyWithWhereWithoutFornecedorInput = {
    where: FornecedorContatoScalarWhereInput
    data: XOR<FornecedorContatoUpdateManyMutationInput, FornecedorContatoUncheckedUpdateManyWithoutContatosInput>
  }

  export type FornecedorContatoScalarWhereInput = {
    AND?: Enumerable<FornecedorContatoScalarWhereInput>
    OR?: Enumerable<FornecedorContatoScalarWhereInput>
    NOT?: Enumerable<FornecedorContatoScalarWhereInput>
    id?: StringFilter | string
    fornecedorId?: StringFilter | string
    nome?: StringFilter | string
    cargo?: StringNullableFilter | string | null
    email?: StringNullableFilter | string | null
    telefone?: StringNullableFilter | string | null
    principal?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
  }

  export type FornecedorSancaoUpsertWithWhereUniqueWithoutFornecedorInput = {
    where: FornecedorSancaoWhereUniqueInput
    update: XOR<FornecedorSancaoUpdateWithoutFornecedorInput, FornecedorSancaoUncheckedUpdateWithoutFornecedorInput>
    create: XOR<FornecedorSancaoCreateWithoutFornecedorInput, FornecedorSancaoUncheckedCreateWithoutFornecedorInput>
  }

  export type FornecedorSancaoUpdateWithWhereUniqueWithoutFornecedorInput = {
    where: FornecedorSancaoWhereUniqueInput
    data: XOR<FornecedorSancaoUpdateWithoutFornecedorInput, FornecedorSancaoUncheckedUpdateWithoutFornecedorInput>
  }

  export type FornecedorSancaoUpdateManyWithWhereWithoutFornecedorInput = {
    where: FornecedorSancaoScalarWhereInput
    data: XOR<FornecedorSancaoUpdateManyMutationInput, FornecedorSancaoUncheckedUpdateManyWithoutSancoesInput>
  }

  export type FornecedorSancaoScalarWhereInput = {
    AND?: Enumerable<FornecedorSancaoScalarWhereInput>
    OR?: Enumerable<FornecedorSancaoScalarWhereInput>
    NOT?: Enumerable<FornecedorSancaoScalarWhereInput>
    id?: StringFilter | string
    fornecedorId?: StringFilter | string
    tipo?: EnumTipoSancaoFilter | TipoSancao
    processo?: StringNullableFilter | string | null
    dataInicio?: DateTimeFilter | Date | string
    dataFim?: DateTimeNullableFilter | Date | string | null
    abrangencia?: StringNullableFilter | string | null
    fonte?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
  }

  export type ContratoUpsertWithWhereUniqueWithoutFornecedorInput = {
    where: ContratoWhereUniqueInput
    update: XOR<ContratoUpdateWithoutFornecedorInput, ContratoUncheckedUpdateWithoutFornecedorInput>
    create: XOR<ContratoCreateWithoutFornecedorInput, ContratoUncheckedCreateWithoutFornecedorInput>
  }

  export type ContratoUpdateWithWhereUniqueWithoutFornecedorInput = {
    where: ContratoWhereUniqueInput
    data: XOR<ContratoUpdateWithoutFornecedorInput, ContratoUncheckedUpdateWithoutFornecedorInput>
  }

  export type ContratoUpdateManyWithWhereWithoutFornecedorInput = {
    where: ContratoScalarWhereInput
    data: XOR<ContratoUpdateManyMutationInput, ContratoUncheckedUpdateManyWithoutContratosInput>
  }

  export type FornecedorCreateWithoutContatosInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    municipio?: MunicipioCreateNestedOneWithoutFornecedoresInput
    sancoes?: FornecedorSancaoCreateNestedManyWithoutFornecedorInput
    contratos?: ContratoCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorUncheckedCreateWithoutContatosInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    municipioId?: string | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sancoes?: FornecedorSancaoUncheckedCreateNestedManyWithoutFornecedorInput
    contratos?: ContratoUncheckedCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorCreateOrConnectWithoutContatosInput = {
    where: FornecedorWhereUniqueInput
    create: XOR<FornecedorCreateWithoutContatosInput, FornecedorUncheckedCreateWithoutContatosInput>
  }

  export type FornecedorUpsertWithoutContatosInput = {
    update: XOR<FornecedorUpdateWithoutContatosInput, FornecedorUncheckedUpdateWithoutContatosInput>
    create: XOR<FornecedorCreateWithoutContatosInput, FornecedorUncheckedCreateWithoutContatosInput>
  }

  export type FornecedorUpdateWithoutContatosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    municipio?: MunicipioUpdateOneWithoutFornecedoresNestedInput
    sancoes?: FornecedorSancaoUpdateManyWithoutFornecedorNestedInput
    contratos?: ContratoUpdateManyWithoutFornecedorNestedInput
  }

  export type FornecedorUncheckedUpdateWithoutContatosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    municipioId?: NullableStringFieldUpdateOperationsInput | string | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sancoes?: FornecedorSancaoUncheckedUpdateManyWithoutFornecedorNestedInput
    contratos?: ContratoUncheckedUpdateManyWithoutFornecedorNestedInput
  }

  export type FornecedorCreateWithoutSancoesInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    municipio?: MunicipioCreateNestedOneWithoutFornecedoresInput
    contatos?: FornecedorContatoCreateNestedManyWithoutFornecedorInput
    contratos?: ContratoCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorUncheckedCreateWithoutSancoesInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    municipioId?: string | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contatos?: FornecedorContatoUncheckedCreateNestedManyWithoutFornecedorInput
    contratos?: ContratoUncheckedCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorCreateOrConnectWithoutSancoesInput = {
    where: FornecedorWhereUniqueInput
    create: XOR<FornecedorCreateWithoutSancoesInput, FornecedorUncheckedCreateWithoutSancoesInput>
  }

  export type FornecedorUpsertWithoutSancoesInput = {
    update: XOR<FornecedorUpdateWithoutSancoesInput, FornecedorUncheckedUpdateWithoutSancoesInput>
    create: XOR<FornecedorCreateWithoutSancoesInput, FornecedorUncheckedCreateWithoutSancoesInput>
  }

  export type FornecedorUpdateWithoutSancoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    municipio?: MunicipioUpdateOneWithoutFornecedoresNestedInput
    contatos?: FornecedorContatoUpdateManyWithoutFornecedorNestedInput
    contratos?: ContratoUpdateManyWithoutFornecedorNestedInput
  }

  export type FornecedorUncheckedUpdateWithoutSancoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    municipioId?: NullableStringFieldUpdateOperationsInput | string | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contatos?: FornecedorContatoUncheckedUpdateManyWithoutFornecedorNestedInput
    contratos?: ContratoUncheckedUpdateManyWithoutFornecedorNestedInput
  }

  export type OrgaoCreateWithoutServidoresInput = {
    id?: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    unidades?: UnidadeOrganizacionalCreateNestedManyWithoutOrgaoInput
  }

  export type OrgaoUncheckedCreateWithoutServidoresInput = {
    id?: string
    sigla: string
    nome: string
    tipo: TipoOrgao
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    unidades?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutOrgaoInput
  }

  export type OrgaoCreateOrConnectWithoutServidoresInput = {
    where: OrgaoWhereUniqueInput
    create: XOR<OrgaoCreateWithoutServidoresInput, OrgaoUncheckedCreateWithoutServidoresInput>
  }

  export type UnidadeOrganizacionalCreateWithoutServidoresInput = {
    id?: string
    sigla: string
    nome: string
    nivel: NivelUnidade
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao: OrgaoCreateNestedOneWithoutUnidadesInput
    parent?: UnidadeOrganizacionalCreateNestedOneWithoutChildrenInput
    children?: UnidadeOrganizacionalCreateNestedManyWithoutParentInput
    municipio: MunicipioCreateNestedOneWithoutUnidadesInput
  }

  export type UnidadeOrganizacionalUncheckedCreateWithoutServidoresInput = {
    id?: string
    orgaoId: string
    parentId?: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: UnidadeOrganizacionalUncheckedCreateNestedManyWithoutParentInput
  }

  export type UnidadeOrganizacionalCreateOrConnectWithoutServidoresInput = {
    where: UnidadeOrganizacionalWhereUniqueInput
    create: XOR<UnidadeOrganizacionalCreateWithoutServidoresInput, UnidadeOrganizacionalUncheckedCreateWithoutServidoresInput>
  }

  export type ContratoCreateWithoutGestorInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    unidadeFsp: UnidadeFspCreateNestedOneWithoutContratosInput
    fiscal: ServidorCreateNestedOneWithoutFiscalContratosInput
    fornecedor: FornecedorCreateNestedOneWithoutContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateWithoutGestorInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    aditivos?: AditivoUncheckedCreateNestedManyWithoutContratoInput
  }

  export type ContratoCreateOrConnectWithoutGestorInput = {
    where: ContratoWhereUniqueInput
    create: XOR<ContratoCreateWithoutGestorInput, ContratoUncheckedCreateWithoutGestorInput>
  }

  export type ContratoCreateManyGestorInputEnvelope = {
    data: Enumerable<ContratoCreateManyGestorInput>
    skipDuplicates?: boolean
  }

  export type ContratoCreateWithoutFiscalInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    unidadeFsp: UnidadeFspCreateNestedOneWithoutContratosInput
    gestor: ServidorCreateNestedOneWithoutGestorContratosInput
    fornecedor: FornecedorCreateNestedOneWithoutContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateWithoutFiscalInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    aditivos?: AditivoUncheckedCreateNestedManyWithoutContratoInput
  }

  export type ContratoCreateOrConnectWithoutFiscalInput = {
    where: ContratoWhereUniqueInput
    create: XOR<ContratoCreateWithoutFiscalInput, ContratoUncheckedCreateWithoutFiscalInput>
  }

  export type ContratoCreateManyFiscalInputEnvelope = {
    data: Enumerable<ContratoCreateManyFiscalInput>
    skipDuplicates?: boolean
  }

  export type OrgaoUpsertWithoutServidoresInput = {
    update: XOR<OrgaoUpdateWithoutServidoresInput, OrgaoUncheckedUpdateWithoutServidoresInput>
    create: XOR<OrgaoCreateWithoutServidoresInput, OrgaoUncheckedCreateWithoutServidoresInput>
  }

  export type OrgaoUpdateWithoutServidoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoOrgaoFieldUpdateOperationsInput | TipoOrgao
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidades?: UnidadeOrganizacionalUpdateManyWithoutOrgaoNestedInput
  }

  export type OrgaoUncheckedUpdateWithoutServidoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoOrgaoFieldUpdateOperationsInput | TipoOrgao
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidades?: UnidadeOrganizacionalUncheckedUpdateManyWithoutOrgaoNestedInput
  }

  export type UnidadeOrganizacionalUpsertWithoutServidoresInput = {
    update: XOR<UnidadeOrganizacionalUpdateWithoutServidoresInput, UnidadeOrganizacionalUncheckedUpdateWithoutServidoresInput>
    create: XOR<UnidadeOrganizacionalCreateWithoutServidoresInput, UnidadeOrganizacionalUncheckedCreateWithoutServidoresInput>
  }

  export type UnidadeOrganizacionalUpdateWithoutServidoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneRequiredWithoutUnidadesNestedInput
    parent?: UnidadeOrganizacionalUpdateOneWithoutChildrenNestedInput
    children?: UnidadeOrganizacionalUpdateManyWithoutParentNestedInput
    municipio?: MunicipioUpdateOneRequiredWithoutUnidadesNestedInput
  }

  export type UnidadeOrganizacionalUncheckedUpdateWithoutServidoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgaoId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    municipioId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: UnidadeOrganizacionalUncheckedUpdateManyWithoutParentNestedInput
  }

  export type ContratoUpsertWithWhereUniqueWithoutGestorInput = {
    where: ContratoWhereUniqueInput
    update: XOR<ContratoUpdateWithoutGestorInput, ContratoUncheckedUpdateWithoutGestorInput>
    create: XOR<ContratoCreateWithoutGestorInput, ContratoUncheckedCreateWithoutGestorInput>
  }

  export type ContratoUpdateWithWhereUniqueWithoutGestorInput = {
    where: ContratoWhereUniqueInput
    data: XOR<ContratoUpdateWithoutGestorInput, ContratoUncheckedUpdateWithoutGestorInput>
  }

  export type ContratoUpdateManyWithWhereWithoutGestorInput = {
    where: ContratoScalarWhereInput
    data: XOR<ContratoUpdateManyMutationInput, ContratoUncheckedUpdateManyWithoutGestorContratosInput>
  }

  export type ContratoUpsertWithWhereUniqueWithoutFiscalInput = {
    where: ContratoWhereUniqueInput
    update: XOR<ContratoUpdateWithoutFiscalInput, ContratoUncheckedUpdateWithoutFiscalInput>
    create: XOR<ContratoCreateWithoutFiscalInput, ContratoUncheckedCreateWithoutFiscalInput>
  }

  export type ContratoUpdateWithWhereUniqueWithoutFiscalInput = {
    where: ContratoWhereUniqueInput
    data: XOR<ContratoUpdateWithoutFiscalInput, ContratoUncheckedUpdateWithoutFiscalInput>
  }

  export type ContratoUpdateManyWithWhereWithoutFiscalInput = {
    where: ContratoScalarWhereInput
    data: XOR<ContratoUpdateManyMutationInput, ContratoUncheckedUpdateManyWithoutFiscalContratosInput>
  }

  export type UnidadeFspCreateWithoutContratosInput = {
    id?: string
    sigla: string
    nome: string
  }

  export type UnidadeFspUncheckedCreateWithoutContratosInput = {
    id?: string
    sigla: string
    nome: string
  }

  export type UnidadeFspCreateOrConnectWithoutContratosInput = {
    where: UnidadeFspWhereUniqueInput
    create: XOR<UnidadeFspCreateWithoutContratosInput, UnidadeFspUncheckedCreateWithoutContratosInput>
  }

  export type ServidorCreateWithoutGestorContratosInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao?: OrgaoCreateNestedOneWithoutServidoresInput
    unidade?: UnidadeOrganizacionalCreateNestedOneWithoutServidoresInput
    fiscalContratos?: ContratoCreateNestedManyWithoutFiscalInput
  }

  export type ServidorUncheckedCreateWithoutGestorContratosInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    orgaoId?: string | null
    unidadeId?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    fiscalContratos?: ContratoUncheckedCreateNestedManyWithoutFiscalInput
  }

  export type ServidorCreateOrConnectWithoutGestorContratosInput = {
    where: ServidorWhereUniqueInput
    create: XOR<ServidorCreateWithoutGestorContratosInput, ServidorUncheckedCreateWithoutGestorContratosInput>
  }

  export type ServidorCreateWithoutFiscalContratosInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orgao?: OrgaoCreateNestedOneWithoutServidoresInput
    unidade?: UnidadeOrganizacionalCreateNestedOneWithoutServidoresInput
    gestorContratos?: ContratoCreateNestedManyWithoutGestorInput
  }

  export type ServidorUncheckedCreateWithoutFiscalContratosInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    orgaoId?: string | null
    unidadeId?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    gestorContratos?: ContratoUncheckedCreateNestedManyWithoutGestorInput
  }

  export type ServidorCreateOrConnectWithoutFiscalContratosInput = {
    where: ServidorWhereUniqueInput
    create: XOR<ServidorCreateWithoutFiscalContratosInput, ServidorUncheckedCreateWithoutFiscalContratosInput>
  }

  export type FornecedorCreateWithoutContratosInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    municipio?: MunicipioCreateNestedOneWithoutFornecedoresInput
    contatos?: FornecedorContatoCreateNestedManyWithoutFornecedorInput
    sancoes?: FornecedorSancaoCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorUncheckedCreateWithoutContratosInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    municipioId?: string | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contatos?: FornecedorContatoUncheckedCreateNestedManyWithoutFornecedorInput
    sancoes?: FornecedorSancaoUncheckedCreateNestedManyWithoutFornecedorInput
  }

  export type FornecedorCreateOrConnectWithoutContratosInput = {
    where: FornecedorWhereUniqueInput
    create: XOR<FornecedorCreateWithoutContratosInput, FornecedorUncheckedCreateWithoutContratosInput>
  }

  export type AditivoCreateWithoutContratoInput = {
    id?: string
    numAditivo: number
    protocoloAdit: string
    novoFimVigencia?: Date | string | null
    valorAdicionalCents?: number | null
    createdAt?: Date | string
  }

  export type AditivoUncheckedCreateWithoutContratoInput = {
    id?: string
    numAditivo: number
    protocoloAdit: string
    novoFimVigencia?: Date | string | null
    valorAdicionalCents?: number | null
    createdAt?: Date | string
  }

  export type AditivoCreateOrConnectWithoutContratoInput = {
    where: AditivoWhereUniqueInput
    create: XOR<AditivoCreateWithoutContratoInput, AditivoUncheckedCreateWithoutContratoInput>
  }

  export type AditivoCreateManyContratoInputEnvelope = {
    data: Enumerable<AditivoCreateManyContratoInput>
    skipDuplicates?: boolean
  }

  export type UnidadeFspUpsertWithoutContratosInput = {
    update: XOR<UnidadeFspUpdateWithoutContratosInput, UnidadeFspUncheckedUpdateWithoutContratosInput>
    create: XOR<UnidadeFspCreateWithoutContratosInput, UnidadeFspUncheckedCreateWithoutContratosInput>
  }

  export type UnidadeFspUpdateWithoutContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
  }

  export type UnidadeFspUncheckedUpdateWithoutContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
  }

  export type ServidorUpsertWithoutGestorContratosInput = {
    update: XOR<ServidorUpdateWithoutGestorContratosInput, ServidorUncheckedUpdateWithoutGestorContratosInput>
    create: XOR<ServidorCreateWithoutGestorContratosInput, ServidorUncheckedCreateWithoutGestorContratosInput>
  }

  export type ServidorUpdateWithoutGestorContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneWithoutServidoresNestedInput
    unidade?: UnidadeOrganizacionalUpdateOneWithoutServidoresNestedInput
    fiscalContratos?: ContratoUpdateManyWithoutFiscalNestedInput
  }

  export type ServidorUncheckedUpdateWithoutGestorContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    orgaoId?: NullableStringFieldUpdateOperationsInput | string | null
    unidadeId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fiscalContratos?: ContratoUncheckedUpdateManyWithoutFiscalNestedInput
  }

  export type ServidorUpsertWithoutFiscalContratosInput = {
    update: XOR<ServidorUpdateWithoutFiscalContratosInput, ServidorUncheckedUpdateWithoutFiscalContratosInput>
    create: XOR<ServidorCreateWithoutFiscalContratosInput, ServidorUncheckedCreateWithoutFiscalContratosInput>
  }

  export type ServidorUpdateWithoutFiscalContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneWithoutServidoresNestedInput
    unidade?: UnidadeOrganizacionalUpdateOneWithoutServidoresNestedInput
    gestorContratos?: ContratoUpdateManyWithoutGestorNestedInput
  }

  export type ServidorUncheckedUpdateWithoutFiscalContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    orgaoId?: NullableStringFieldUpdateOperationsInput | string | null
    unidadeId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gestorContratos?: ContratoUncheckedUpdateManyWithoutGestorNestedInput
  }

  export type FornecedorUpsertWithoutContratosInput = {
    update: XOR<FornecedorUpdateWithoutContratosInput, FornecedorUncheckedUpdateWithoutContratosInput>
    create: XOR<FornecedorCreateWithoutContratosInput, FornecedorUncheckedCreateWithoutContratosInput>
  }

  export type FornecedorUpdateWithoutContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    municipio?: MunicipioUpdateOneWithoutFornecedoresNestedInput
    contatos?: FornecedorContatoUpdateManyWithoutFornecedorNestedInput
    sancoes?: FornecedorSancaoUpdateManyWithoutFornecedorNestedInput
  }

  export type FornecedorUncheckedUpdateWithoutContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    municipioId?: NullableStringFieldUpdateOperationsInput | string | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contatos?: FornecedorContatoUncheckedUpdateManyWithoutFornecedorNestedInput
    sancoes?: FornecedorSancaoUncheckedUpdateManyWithoutFornecedorNestedInput
  }

  export type AditivoUpsertWithWhereUniqueWithoutContratoInput = {
    where: AditivoWhereUniqueInput
    update: XOR<AditivoUpdateWithoutContratoInput, AditivoUncheckedUpdateWithoutContratoInput>
    create: XOR<AditivoCreateWithoutContratoInput, AditivoUncheckedCreateWithoutContratoInput>
  }

  export type AditivoUpdateWithWhereUniqueWithoutContratoInput = {
    where: AditivoWhereUniqueInput
    data: XOR<AditivoUpdateWithoutContratoInput, AditivoUncheckedUpdateWithoutContratoInput>
  }

  export type AditivoUpdateManyWithWhereWithoutContratoInput = {
    where: AditivoScalarWhereInput
    data: XOR<AditivoUpdateManyMutationInput, AditivoUncheckedUpdateManyWithoutAditivosInput>
  }

  export type AditivoScalarWhereInput = {
    AND?: Enumerable<AditivoScalarWhereInput>
    OR?: Enumerable<AditivoScalarWhereInput>
    NOT?: Enumerable<AditivoScalarWhereInput>
    id?: StringFilter | string
    contratoId?: StringFilter | string
    numAditivo?: IntFilter | number
    protocoloAdit?: StringFilter | string
    novoFimVigencia?: DateTimeNullableFilter | Date | string | null
    valorAdicionalCents?: IntNullableFilter | number | null
    createdAt?: DateTimeFilter | Date | string
  }

  export type ContratoCreateWithoutAditivosInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
    unidadeFsp: UnidadeFspCreateNestedOneWithoutContratosInput
    gestor: ServidorCreateNestedOneWithoutGestorContratosInput
    fiscal: ServidorCreateNestedOneWithoutFiscalContratosInput
    fornecedor: FornecedorCreateNestedOneWithoutContratosInput
  }

  export type ContratoUncheckedCreateWithoutAditivosInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContratoCreateOrConnectWithoutAditivosInput = {
    where: ContratoWhereUniqueInput
    create: XOR<ContratoCreateWithoutAditivosInput, ContratoUncheckedCreateWithoutAditivosInput>
  }

  export type ContratoUpsertWithoutAditivosInput = {
    update: XOR<ContratoUpdateWithoutAditivosInput, ContratoUncheckedUpdateWithoutAditivosInput>
    create: XOR<ContratoCreateWithoutAditivosInput, ContratoUncheckedCreateWithoutAditivosInput>
  }

  export type ContratoUpdateWithoutAditivosInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidadeFsp?: UnidadeFspUpdateOneRequiredWithoutContratosNestedInput
    gestor?: ServidorUpdateOneRequiredWithoutGestorContratosNestedInput
    fiscal?: ServidorUpdateOneRequiredWithoutFiscalContratosNestedInput
    fornecedor?: FornecedorUpdateOneRequiredWithoutContratosNestedInput
  }

  export type ContratoUncheckedUpdateWithoutAditivosInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    gestorId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContratoCreateManyUnidadeFspInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    gestorId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContratoUpdateWithoutUnidadeFspInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gestor?: ServidorUpdateOneRequiredWithoutGestorContratosNestedInput
    fiscal?: ServidorUpdateOneRequiredWithoutFiscalContratosNestedInput
    fornecedor?: FornecedorUpdateOneRequiredWithoutContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateWithoutUnidadeFspInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    gestorId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aditivos?: AditivoUncheckedUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateManyWithoutContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    gestorId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnidadeOrganizacionalCreateManyMunicipioInput = {
    id?: string
    orgaoId: string
    parentId?: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FornecedorCreateManyMunicipioInput = {
    id?: string
    tipoPessoa?: TipoPessoa
    documento: string
    razaoSocial: string
    nomeFantasia?: string | null
    inscricaoEstadual?: string | null
    porte?: PorteEmpresa | null
    situacao?: SituacaoFornecedor
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnidadeOrganizacionalUpdateWithoutMunicipioInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneRequiredWithoutUnidadesNestedInput
    parent?: UnidadeOrganizacionalUpdateOneWithoutChildrenNestedInput
    children?: UnidadeOrganizacionalUpdateManyWithoutParentNestedInput
    servidores?: ServidorUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalUncheckedUpdateWithoutMunicipioInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgaoId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: UnidadeOrganizacionalUncheckedUpdateManyWithoutParentNestedInput
    servidores?: ServidorUncheckedUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalUncheckedUpdateManyWithoutUnidadesInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgaoId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorUpdateWithoutMunicipioInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contatos?: FornecedorContatoUpdateManyWithoutFornecedorNestedInput
    sancoes?: FornecedorSancaoUpdateManyWithoutFornecedorNestedInput
    contratos?: ContratoUpdateManyWithoutFornecedorNestedInput
  }

  export type FornecedorUncheckedUpdateWithoutMunicipioInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contatos?: FornecedorContatoUncheckedUpdateManyWithoutFornecedorNestedInput
    sancoes?: FornecedorSancaoUncheckedUpdateManyWithoutFornecedorNestedInput
    contratos?: ContratoUncheckedUpdateManyWithoutFornecedorNestedInput
  }

  export type FornecedorUncheckedUpdateManyWithoutFornecedoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoPessoa?: EnumTipoPessoaFieldUpdateOperationsInput | TipoPessoa
    documento?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    porte?: NullableEnumPorteEmpresaFieldUpdateOperationsInput | PorteEmpresa | null
    situacao?: EnumSituacaoFornecedorFieldUpdateOperationsInput | SituacaoFornecedor
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DominioValorCreateManyDominioInput = {
    id?: string
    codigo: string
    label: string
    parentId?: string | null
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DominioValorUpdateWithoutDominioInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: DominioValorUpdateOneWithoutChildrenNestedInput
    children?: DominioValorUpdateManyWithoutParentNestedInput
  }

  export type DominioValorUncheckedUpdateWithoutDominioInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: DominioValorUncheckedUpdateManyWithoutParentNestedInput
  }

  export type DominioValorUncheckedUpdateManyWithoutValoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DominioValorCreateManyParentInput = {
    id?: string
    dominioId: string
    codigo: string
    label: string
    ordem?: number
    ativo?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DominioValorUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dominio?: DominioUpdateOneRequiredWithoutValoresNestedInput
    children?: DominioValorUpdateManyWithoutParentNestedInput
  }

  export type DominioValorUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    dominioId?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: DominioValorUncheckedUpdateManyWithoutParentNestedInput
  }

  export type DominioValorUncheckedUpdateManyWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    dominioId?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    codigoLegado?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnidadeOrganizacionalCreateManyOrgaoInput = {
    id?: string
    parentId?: string | null
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServidorCreateManyOrgaoInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    unidadeId?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnidadeOrganizacionalUpdateWithoutOrgaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: UnidadeOrganizacionalUpdateOneWithoutChildrenNestedInput
    children?: UnidadeOrganizacionalUpdateManyWithoutParentNestedInput
    municipio?: MunicipioUpdateOneRequiredWithoutUnidadesNestedInput
    servidores?: ServidorUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalUncheckedUpdateWithoutOrgaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    municipioId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: UnidadeOrganizacionalUncheckedUpdateManyWithoutParentNestedInput
    servidores?: ServidorUncheckedUpdateManyWithoutUnidadeNestedInput
  }

  export type ServidorUpdateWithoutOrgaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidade?: UnidadeOrganizacionalUpdateOneWithoutServidoresNestedInput
    gestorContratos?: ContratoUpdateManyWithoutGestorNestedInput
    fiscalContratos?: ContratoUpdateManyWithoutFiscalNestedInput
  }

  export type ServidorUncheckedUpdateWithoutOrgaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    unidadeId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gestorContratos?: ContratoUncheckedUpdateManyWithoutGestorNestedInput
    fiscalContratos?: ContratoUncheckedUpdateManyWithoutFiscalNestedInput
  }

  export type ServidorUncheckedUpdateManyWithoutServidoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    unidadeId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnidadeOrganizacionalCreateManyParentInput = {
    id?: string
    orgaoId: string
    sigla: string
    nome: string
    nivel: NivelUnidade
    municipioId: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServidorCreateManyUnidadeInput = {
    id?: string
    nome: string
    cpf?: string | null
    rgFuncional?: string | null
    cargo?: string | null
    orgaoId?: string | null
    email?: string | null
    telefone?: string | null
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnidadeOrganizacionalUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneRequiredWithoutUnidadesNestedInput
    children?: UnidadeOrganizacionalUpdateManyWithoutParentNestedInput
    municipio?: MunicipioUpdateOneRequiredWithoutUnidadesNestedInput
    servidores?: ServidorUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgaoId?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    municipioId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: UnidadeOrganizacionalUncheckedUpdateManyWithoutParentNestedInput
    servidores?: ServidorUncheckedUpdateManyWithoutUnidadeNestedInput
  }

  export type UnidadeOrganizacionalUncheckedUpdateManyWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgaoId?: StringFieldUpdateOperationsInput | string
    sigla?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    nivel?: EnumNivelUnidadeFieldUpdateOperationsInput | NivelUnidade
    municipioId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServidorUpdateWithoutUnidadeInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgao?: OrgaoUpdateOneWithoutServidoresNestedInput
    gestorContratos?: ContratoUpdateManyWithoutGestorNestedInput
    fiscalContratos?: ContratoUpdateManyWithoutFiscalNestedInput
  }

  export type ServidorUncheckedUpdateWithoutUnidadeInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    rgFuncional?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    orgaoId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gestorContratos?: ContratoUncheckedUpdateManyWithoutGestorNestedInput
    fiscalContratos?: ContratoUncheckedUpdateManyWithoutFiscalNestedInput
  }

  export type FornecedorContatoCreateManyFornecedorInput = {
    id?: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    principal?: boolean
    createdAt?: Date | string
  }

  export type FornecedorSancaoCreateManyFornecedorInput = {
    id?: string
    tipo: TipoSancao
    processo?: string | null
    dataInicio: Date | string
    dataFim?: Date | string | null
    abrangencia?: string | null
    fonte?: string | null
    createdAt?: Date | string
  }

  export type ContratoCreateManyFornecedorInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fiscalId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FornecedorContatoUpdateWithoutFornecedorInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorContatoUncheckedUpdateWithoutFornecedorInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorContatoUncheckedUpdateManyWithoutContatosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorSancaoUpdateWithoutFornecedorInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoSancaoFieldUpdateOperationsInput | TipoSancao
    processo?: NullableStringFieldUpdateOperationsInput | string | null
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abrangencia?: NullableStringFieldUpdateOperationsInput | string | null
    fonte?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorSancaoUncheckedUpdateWithoutFornecedorInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoSancaoFieldUpdateOperationsInput | TipoSancao
    processo?: NullableStringFieldUpdateOperationsInput | string | null
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abrangencia?: NullableStringFieldUpdateOperationsInput | string | null
    fonte?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorSancaoUncheckedUpdateManyWithoutSancoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoSancaoFieldUpdateOperationsInput | TipoSancao
    processo?: NullableStringFieldUpdateOperationsInput | string | null
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abrangencia?: NullableStringFieldUpdateOperationsInput | string | null
    fonte?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContratoUpdateWithoutFornecedorInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidadeFsp?: UnidadeFspUpdateOneRequiredWithoutContratosNestedInput
    gestor?: ServidorUpdateOneRequiredWithoutGestorContratosNestedInput
    fiscal?: ServidorUpdateOneRequiredWithoutFiscalContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateWithoutFornecedorInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    gestorId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aditivos?: AditivoUncheckedUpdateManyWithoutContratoNestedInput
  }

  export type ContratoCreateManyGestorInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    fiscalId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContratoCreateManyFiscalInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fornecedorId: string
    modalidade: string
    objeto: string
    valorAnualCents: number
    dataInicio?: Date | string | null
    dataFimOrig?: Date | string | null
    status: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContratoUpdateWithoutGestorInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidadeFsp?: UnidadeFspUpdateOneRequiredWithoutContratosNestedInput
    fiscal?: ServidorUpdateOneRequiredWithoutFiscalContratosNestedInput
    fornecedor?: FornecedorUpdateOneRequiredWithoutContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateWithoutGestorInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aditivos?: AditivoUncheckedUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateManyWithoutGestorContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContratoUpdateWithoutFiscalInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unidadeFsp?: UnidadeFspUpdateOneRequiredWithoutContratosNestedInput
    gestor?: ServidorUpdateOneRequiredWithoutGestorContratosNestedInput
    fornecedor?: FornecedorUpdateOneRequiredWithoutContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateWithoutFiscalInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    gestorId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aditivos?: AditivoUncheckedUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateManyWithoutFiscalContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    gestorId?: StringFieldUpdateOperationsInput | string
    fornecedorId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AditivoCreateManyContratoInput = {
    id?: string
    numAditivo: number
    protocoloAdit: string
    novoFimVigencia?: Date | string | null
    valorAdicionalCents?: number | null
    createdAt?: Date | string
  }

  export type AditivoUpdateWithoutContratoInput = {
    id?: StringFieldUpdateOperationsInput | string
    numAditivo?: IntFieldUpdateOperationsInput | number
    protocoloAdit?: StringFieldUpdateOperationsInput | string
    novoFimVigencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    valorAdicionalCents?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AditivoUncheckedUpdateWithoutContratoInput = {
    id?: StringFieldUpdateOperationsInput | string
    numAditivo?: IntFieldUpdateOperationsInput | number
    protocoloAdit?: StringFieldUpdateOperationsInput | string
    novoFimVigencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    valorAdicionalCents?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AditivoUncheckedUpdateManyWithoutAditivosInput = {
    id?: StringFieldUpdateOperationsInput | string
    numAditivo?: IntFieldUpdateOperationsInput | number
    protocoloAdit?: StringFieldUpdateOperationsInput | string
    novoFimVigencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    valorAdicionalCents?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}