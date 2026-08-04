
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
export type EntidadeGestoraPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "EntidadeGestora"
  objects: {
    gestorContratos: ContratoPayload<ExtArgs>[]
    fiscalContratos: ContratoPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    nome: string
    cpf: string
  }, ExtArgs["result"]["entidadeGestora"]>
  composites: {}
}

/**
 * Model EntidadeGestora
 * 
 */
export type EntidadeGestora = runtime.Types.DefaultSelection<EntidadeGestoraPayload>
export type MunicipioPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Municipio"
  objects: {}
  scalars: $Extensions.GetResult<{
    id: string
    nome: string
    uf: string
  }, ExtArgs["result"]["municipio"]>
  composites: {}
}

/**
 * Model Municipio
 * 
 */
export type Municipio = runtime.Types.DefaultSelection<MunicipioPayload>
export type EmpresaPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Empresa"
  objects: {
    contratos: ContratoPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    cnpj: string
    razaoSocial: string
  }, ExtArgs["result"]["empresa"]>
  composites: {}
}

/**
 * Model Empresa
 * 
 */
export type Empresa = runtime.Types.DefaultSelection<EmpresaPayload>
export type FornecedorPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Fornecedor"
  objects: {}
  scalars: $Extensions.GetResult<{
    id: string
    cnpj: string | null
    nome: string
    createdAt: Date
  }, ExtArgs["result"]["fornecedor"]>
  composites: {}
}

/**
 * Model Fornecedor
 * 
 */
export type Fornecedor = runtime.Types.DefaultSelection<FornecedorPayload>
export type ContratoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Contrato"
  objects: {
    unidadeFsp: UnidadeFspPayload<ExtArgs>
    gestor: EntidadeGestoraPayload<ExtArgs>
    fiscal: EntidadeGestoraPayload<ExtArgs>
    empresa: EmpresaPayload<ExtArgs>
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
    empresaId: string
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
   * `prisma.entidadeGestora`: Exposes CRUD operations for the **EntidadeGestora** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EntidadeGestoras
    * const entidadeGestoras = await prisma.entidadeGestora.findMany()
    * ```
    */
  get entidadeGestora(): Prisma.EntidadeGestoraDelegate<GlobalReject, ExtArgs>;

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
   * `prisma.empresa`: Exposes CRUD operations for the **Empresa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Empresas
    * const empresas = await prisma.empresa.findMany()
    * ```
    */
  get empresa(): Prisma.EmpresaDelegate<GlobalReject, ExtArgs>;

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
    EntidadeGestora: 'EntidadeGestora',
    Municipio: 'Municipio',
    Empresa: 'Empresa',
    Fornecedor: 'Fornecedor',
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
      modelProps: 'unidadeFsp' | 'entidadeGestora' | 'municipio' | 'empresa' | 'fornecedor' | 'contrato' | 'aditivo' | 'servico' | 'auditLog' | 'user'
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
      EntidadeGestora: {
        payload: EntidadeGestoraPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.EntidadeGestoraFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EntidadeGestoraFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload>
          }
          findFirst: {
            args: Prisma.EntidadeGestoraFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EntidadeGestoraFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload>
          }
          findMany: {
            args: Prisma.EntidadeGestoraFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload>[]
          }
          create: {
            args: Prisma.EntidadeGestoraCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload>
          }
          createMany: {
            args: Prisma.EntidadeGestoraCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.EntidadeGestoraDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload>
          }
          update: {
            args: Prisma.EntidadeGestoraUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload>
          }
          deleteMany: {
            args: Prisma.EntidadeGestoraDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.EntidadeGestoraUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.EntidadeGestoraUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EntidadeGestoraPayload>
          }
          aggregate: {
            args: Prisma.EntidadeGestoraAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateEntidadeGestora>
          }
          groupBy: {
            args: Prisma.EntidadeGestoraGroupByArgs<ExtArgs>,
            result: $Utils.Optional<EntidadeGestoraGroupByOutputType>[]
          }
          count: {
            args: Prisma.EntidadeGestoraCountArgs<ExtArgs>,
            result: $Utils.Optional<EntidadeGestoraCountAggregateOutputType> | number
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
      Empresa: {
        payload: EmpresaPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.EmpresaFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmpresaFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload>
          }
          findFirst: {
            args: Prisma.EmpresaFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmpresaFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload>
          }
          findMany: {
            args: Prisma.EmpresaFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload>[]
          }
          create: {
            args: Prisma.EmpresaCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload>
          }
          createMany: {
            args: Prisma.EmpresaCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.EmpresaDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload>
          }
          update: {
            args: Prisma.EmpresaUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload>
          }
          deleteMany: {
            args: Prisma.EmpresaDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.EmpresaUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.EmpresaUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EmpresaPayload>
          }
          aggregate: {
            args: Prisma.EmpresaAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateEmpresa>
          }
          groupBy: {
            args: Prisma.EmpresaGroupByArgs<ExtArgs>,
            result: $Utils.Optional<EmpresaGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmpresaCountArgs<ExtArgs>,
            result: $Utils.Optional<EmpresaCountAggregateOutputType> | number
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
   * Count Type EntidadeGestoraCountOutputType
   */


  export type EntidadeGestoraCountOutputType = {
    gestorContratos: number
    fiscalContratos: number
  }

  export type EntidadeGestoraCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    gestorContratos?: boolean | EntidadeGestoraCountOutputTypeCountGestorContratosArgs
    fiscalContratos?: boolean | EntidadeGestoraCountOutputTypeCountFiscalContratosArgs
  }

  // Custom InputTypes

  /**
   * EntidadeGestoraCountOutputType without action
   */
  export type EntidadeGestoraCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestoraCountOutputType
     */
    select?: EntidadeGestoraCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * EntidadeGestoraCountOutputType without action
   */
  export type EntidadeGestoraCountOutputTypeCountGestorContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ContratoWhereInput
  }


  /**
   * EntidadeGestoraCountOutputType without action
   */
  export type EntidadeGestoraCountOutputTypeCountFiscalContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ContratoWhereInput
  }



  /**
   * Count Type EmpresaCountOutputType
   */


  export type EmpresaCountOutputType = {
    contratos: number
  }

  export type EmpresaCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    contratos?: boolean | EmpresaCountOutputTypeCountContratosArgs
  }

  // Custom InputTypes

  /**
   * EmpresaCountOutputType without action
   */
  export type EmpresaCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmpresaCountOutputType
     */
    select?: EmpresaCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * EmpresaCountOutputType without action
   */
  export type EmpresaCountOutputTypeCountContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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
   * Model EntidadeGestora
   */


  export type AggregateEntidadeGestora = {
    _count: EntidadeGestoraCountAggregateOutputType | null
    _min: EntidadeGestoraMinAggregateOutputType | null
    _max: EntidadeGestoraMaxAggregateOutputType | null
  }

  export type EntidadeGestoraMinAggregateOutputType = {
    id: string | null
    nome: string | null
    cpf: string | null
  }

  export type EntidadeGestoraMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    cpf: string | null
  }

  export type EntidadeGestoraCountAggregateOutputType = {
    id: number
    nome: number
    cpf: number
    _all: number
  }


  export type EntidadeGestoraMinAggregateInputType = {
    id?: true
    nome?: true
    cpf?: true
  }

  export type EntidadeGestoraMaxAggregateInputType = {
    id?: true
    nome?: true
    cpf?: true
  }

  export type EntidadeGestoraCountAggregateInputType = {
    id?: true
    nome?: true
    cpf?: true
    _all?: true
  }

  export type EntidadeGestoraAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which EntidadeGestora to aggregate.
     */
    where?: EntidadeGestoraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntidadeGestoras to fetch.
     */
    orderBy?: Enumerable<EntidadeGestoraOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EntidadeGestoraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntidadeGestoras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntidadeGestoras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EntidadeGestoras
    **/
    _count?: true | EntidadeGestoraCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EntidadeGestoraMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EntidadeGestoraMaxAggregateInputType
  }

  export type GetEntidadeGestoraAggregateType<T extends EntidadeGestoraAggregateArgs> = {
        [P in keyof T & keyof AggregateEntidadeGestora]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEntidadeGestora[P]>
      : GetScalarType<T[P], AggregateEntidadeGestora[P]>
  }




  export type EntidadeGestoraGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: EntidadeGestoraWhereInput
    orderBy?: Enumerable<EntidadeGestoraOrderByWithAggregationInput>
    by: EntidadeGestoraScalarFieldEnum[]
    having?: EntidadeGestoraScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EntidadeGestoraCountAggregateInputType | true
    _min?: EntidadeGestoraMinAggregateInputType
    _max?: EntidadeGestoraMaxAggregateInputType
  }


  export type EntidadeGestoraGroupByOutputType = {
    id: string
    nome: string
    cpf: string
    _count: EntidadeGestoraCountAggregateOutputType | null
    _min: EntidadeGestoraMinAggregateOutputType | null
    _max: EntidadeGestoraMaxAggregateOutputType | null
  }

  type GetEntidadeGestoraGroupByPayload<T extends EntidadeGestoraGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<EntidadeGestoraGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EntidadeGestoraGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EntidadeGestoraGroupByOutputType[P]>
            : GetScalarType<T[P], EntidadeGestoraGroupByOutputType[P]>
        }
      >
    >


  export type EntidadeGestoraSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cpf?: boolean
    gestorContratos?: boolean | EntidadeGestora$gestorContratosArgs<ExtArgs>
    fiscalContratos?: boolean | EntidadeGestora$fiscalContratosArgs<ExtArgs>
    _count?: boolean | EntidadeGestoraCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["entidadeGestora"]>

  export type EntidadeGestoraSelectScalar = {
    id?: boolean
    nome?: boolean
    cpf?: boolean
  }

  export type EntidadeGestoraInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    gestorContratos?: boolean | EntidadeGestora$gestorContratosArgs<ExtArgs>
    fiscalContratos?: boolean | EntidadeGestora$fiscalContratosArgs<ExtArgs>
    _count?: boolean | EntidadeGestoraCountOutputTypeArgs<ExtArgs>
  }


  type EntidadeGestoraGetPayload<S extends boolean | null | undefined | EntidadeGestoraArgs> = $Types.GetResult<EntidadeGestoraPayload, S>

  type EntidadeGestoraCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<EntidadeGestoraFindManyArgs, 'select' | 'include'> & {
      select?: EntidadeGestoraCountAggregateInputType | true
    }

  export interface EntidadeGestoraDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EntidadeGestora'], meta: { name: 'EntidadeGestora' } }
    /**
     * Find zero or one EntidadeGestora that matches the filter.
     * @param {EntidadeGestoraFindUniqueArgs} args - Arguments to find a EntidadeGestora
     * @example
     * // Get one EntidadeGestora
     * const entidadeGestora = await prisma.entidadeGestora.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EntidadeGestoraFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, EntidadeGestoraFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'EntidadeGestora'> extends True ? Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one EntidadeGestora that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {EntidadeGestoraFindUniqueOrThrowArgs} args - Arguments to find a EntidadeGestora
     * @example
     * // Get one EntidadeGestora
     * const entidadeGestora = await prisma.entidadeGestora.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends EntidadeGestoraFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, EntidadeGestoraFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first EntidadeGestora that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadeGestoraFindFirstArgs} args - Arguments to find a EntidadeGestora
     * @example
     * // Get one EntidadeGestora
     * const entidadeGestora = await prisma.entidadeGestora.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EntidadeGestoraFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, EntidadeGestoraFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'EntidadeGestora'> extends True ? Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first EntidadeGestora that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadeGestoraFindFirstOrThrowArgs} args - Arguments to find a EntidadeGestora
     * @example
     * // Get one EntidadeGestora
     * const entidadeGestora = await prisma.entidadeGestora.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends EntidadeGestoraFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, EntidadeGestoraFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more EntidadeGestoras that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadeGestoraFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EntidadeGestoras
     * const entidadeGestoras = await prisma.entidadeGestora.findMany()
     * 
     * // Get first 10 EntidadeGestoras
     * const entidadeGestoras = await prisma.entidadeGestora.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const entidadeGestoraWithIdOnly = await prisma.entidadeGestora.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends EntidadeGestoraFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EntidadeGestoraFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a EntidadeGestora.
     * @param {EntidadeGestoraCreateArgs} args - Arguments to create a EntidadeGestora.
     * @example
     * // Create one EntidadeGestora
     * const EntidadeGestora = await prisma.entidadeGestora.create({
     *   data: {
     *     // ... data to create a EntidadeGestora
     *   }
     * })
     * 
    **/
    create<T extends EntidadeGestoraCreateArgs<ExtArgs>>(
      args: SelectSubset<T, EntidadeGestoraCreateArgs<ExtArgs>>
    ): Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many EntidadeGestoras.
     *     @param {EntidadeGestoraCreateManyArgs} args - Arguments to create many EntidadeGestoras.
     *     @example
     *     // Create many EntidadeGestoras
     *     const entidadeGestora = await prisma.entidadeGestora.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends EntidadeGestoraCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EntidadeGestoraCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a EntidadeGestora.
     * @param {EntidadeGestoraDeleteArgs} args - Arguments to delete one EntidadeGestora.
     * @example
     * // Delete one EntidadeGestora
     * const EntidadeGestora = await prisma.entidadeGestora.delete({
     *   where: {
     *     // ... filter to delete one EntidadeGestora
     *   }
     * })
     * 
    **/
    delete<T extends EntidadeGestoraDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, EntidadeGestoraDeleteArgs<ExtArgs>>
    ): Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one EntidadeGestora.
     * @param {EntidadeGestoraUpdateArgs} args - Arguments to update one EntidadeGestora.
     * @example
     * // Update one EntidadeGestora
     * const entidadeGestora = await prisma.entidadeGestora.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EntidadeGestoraUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, EntidadeGestoraUpdateArgs<ExtArgs>>
    ): Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more EntidadeGestoras.
     * @param {EntidadeGestoraDeleteManyArgs} args - Arguments to filter EntidadeGestoras to delete.
     * @example
     * // Delete a few EntidadeGestoras
     * const { count } = await prisma.entidadeGestora.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EntidadeGestoraDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EntidadeGestoraDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EntidadeGestoras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadeGestoraUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EntidadeGestoras
     * const entidadeGestora = await prisma.entidadeGestora.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EntidadeGestoraUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, EntidadeGestoraUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EntidadeGestora.
     * @param {EntidadeGestoraUpsertArgs} args - Arguments to update or create a EntidadeGestora.
     * @example
     * // Update or create a EntidadeGestora
     * const entidadeGestora = await prisma.entidadeGestora.upsert({
     *   create: {
     *     // ... data to create a EntidadeGestora
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EntidadeGestora we want to update
     *   }
     * })
    **/
    upsert<T extends EntidadeGestoraUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, EntidadeGestoraUpsertArgs<ExtArgs>>
    ): Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of EntidadeGestoras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadeGestoraCountArgs} args - Arguments to filter EntidadeGestoras to count.
     * @example
     * // Count the number of EntidadeGestoras
     * const count = await prisma.entidadeGestora.count({
     *   where: {
     *     // ... the filter for the EntidadeGestoras we want to count
     *   }
     * })
    **/
    count<T extends EntidadeGestoraCountArgs>(
      args?: Subset<T, EntidadeGestoraCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EntidadeGestoraCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EntidadeGestora.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadeGestoraAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EntidadeGestoraAggregateArgs>(args: Subset<T, EntidadeGestoraAggregateArgs>): Prisma.PrismaPromise<GetEntidadeGestoraAggregateType<T>>

    /**
     * Group by EntidadeGestora.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntidadeGestoraGroupByArgs} args - Group by arguments.
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
      T extends EntidadeGestoraGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EntidadeGestoraGroupByArgs['orderBy'] }
        : { orderBy?: EntidadeGestoraGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EntidadeGestoraGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntidadeGestoraGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for EntidadeGestora.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EntidadeGestoraClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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

    gestorContratos<T extends EntidadeGestora$gestorContratosArgs<ExtArgs> = {}>(args?: Subset<T, EntidadeGestora$gestorContratosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    fiscalContratos<T extends EntidadeGestora$fiscalContratosArgs<ExtArgs> = {}>(args?: Subset<T, EntidadeGestora$fiscalContratosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findMany', never>| Null>;

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
   * EntidadeGestora base type for findUnique actions
   */
  export type EntidadeGestoraFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * Filter, which EntidadeGestora to fetch.
     */
    where: EntidadeGestoraWhereUniqueInput
  }

  /**
   * EntidadeGestora findUnique
   */
  export interface EntidadeGestoraFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends EntidadeGestoraFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * EntidadeGestora findUniqueOrThrow
   */
  export type EntidadeGestoraFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * Filter, which EntidadeGestora to fetch.
     */
    where: EntidadeGestoraWhereUniqueInput
  }


  /**
   * EntidadeGestora base type for findFirst actions
   */
  export type EntidadeGestoraFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * Filter, which EntidadeGestora to fetch.
     */
    where?: EntidadeGestoraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntidadeGestoras to fetch.
     */
    orderBy?: Enumerable<EntidadeGestoraOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EntidadeGestoras.
     */
    cursor?: EntidadeGestoraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntidadeGestoras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntidadeGestoras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EntidadeGestoras.
     */
    distinct?: Enumerable<EntidadeGestoraScalarFieldEnum>
  }

  /**
   * EntidadeGestora findFirst
   */
  export interface EntidadeGestoraFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends EntidadeGestoraFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * EntidadeGestora findFirstOrThrow
   */
  export type EntidadeGestoraFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * Filter, which EntidadeGestora to fetch.
     */
    where?: EntidadeGestoraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntidadeGestoras to fetch.
     */
    orderBy?: Enumerable<EntidadeGestoraOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EntidadeGestoras.
     */
    cursor?: EntidadeGestoraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntidadeGestoras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntidadeGestoras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EntidadeGestoras.
     */
    distinct?: Enumerable<EntidadeGestoraScalarFieldEnum>
  }


  /**
   * EntidadeGestora findMany
   */
  export type EntidadeGestoraFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * Filter, which EntidadeGestoras to fetch.
     */
    where?: EntidadeGestoraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntidadeGestoras to fetch.
     */
    orderBy?: Enumerable<EntidadeGestoraOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EntidadeGestoras.
     */
    cursor?: EntidadeGestoraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntidadeGestoras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntidadeGestoras.
     */
    skip?: number
    distinct?: Enumerable<EntidadeGestoraScalarFieldEnum>
  }


  /**
   * EntidadeGestora create
   */
  export type EntidadeGestoraCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * The data needed to create a EntidadeGestora.
     */
    data: XOR<EntidadeGestoraCreateInput, EntidadeGestoraUncheckedCreateInput>
  }


  /**
   * EntidadeGestora createMany
   */
  export type EntidadeGestoraCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EntidadeGestoras.
     */
    data: Enumerable<EntidadeGestoraCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * EntidadeGestora update
   */
  export type EntidadeGestoraUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * The data needed to update a EntidadeGestora.
     */
    data: XOR<EntidadeGestoraUpdateInput, EntidadeGestoraUncheckedUpdateInput>
    /**
     * Choose, which EntidadeGestora to update.
     */
    where: EntidadeGestoraWhereUniqueInput
  }


  /**
   * EntidadeGestora updateMany
   */
  export type EntidadeGestoraUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EntidadeGestoras.
     */
    data: XOR<EntidadeGestoraUpdateManyMutationInput, EntidadeGestoraUncheckedUpdateManyInput>
    /**
     * Filter which EntidadeGestoras to update
     */
    where?: EntidadeGestoraWhereInput
  }


  /**
   * EntidadeGestora upsert
   */
  export type EntidadeGestoraUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * The filter to search for the EntidadeGestora to update in case it exists.
     */
    where: EntidadeGestoraWhereUniqueInput
    /**
     * In case the EntidadeGestora found by the `where` argument doesn't exist, create a new EntidadeGestora with this data.
     */
    create: XOR<EntidadeGestoraCreateInput, EntidadeGestoraUncheckedCreateInput>
    /**
     * In case the EntidadeGestora was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EntidadeGestoraUpdateInput, EntidadeGestoraUncheckedUpdateInput>
  }


  /**
   * EntidadeGestora delete
   */
  export type EntidadeGestoraDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
    /**
     * Filter which EntidadeGestora to delete.
     */
    where: EntidadeGestoraWhereUniqueInput
  }


  /**
   * EntidadeGestora deleteMany
   */
  export type EntidadeGestoraDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which EntidadeGestoras to delete
     */
    where?: EntidadeGestoraWhereInput
  }


  /**
   * EntidadeGestora.gestorContratos
   */
  export type EntidadeGestora$gestorContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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
   * EntidadeGestora.fiscalContratos
   */
  export type EntidadeGestora$fiscalContratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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
   * EntidadeGestora without action
   */
  export type EntidadeGestoraArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntidadeGestora
     */
    select?: EntidadeGestoraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EntidadeGestoraInclude<ExtArgs> | null
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
    nome: string | null
    uf: string | null
  }

  export type MunicipioMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    uf: string | null
  }

  export type MunicipioCountAggregateOutputType = {
    id: number
    nome: number
    uf: number
    _all: number
  }


  export type MunicipioMinAggregateInputType = {
    id?: true
    nome?: true
    uf?: true
  }

  export type MunicipioMaxAggregateInputType = {
    id?: true
    nome?: true
    uf?: true
  }

  export type MunicipioCountAggregateInputType = {
    id?: true
    nome?: true
    uf?: true
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
    nome: string
    uf: string
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
    nome?: boolean
    uf?: boolean
  }, ExtArgs["result"]["municipio"]>

  export type MunicipioSelectScalar = {
    id?: boolean
    nome?: boolean
    uf?: boolean
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
   * Municipio without action
   */
  export type MunicipioArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipio
     */
    select?: MunicipioSelect<ExtArgs> | null
  }



  /**
   * Model Empresa
   */


  export type AggregateEmpresa = {
    _count: EmpresaCountAggregateOutputType | null
    _min: EmpresaMinAggregateOutputType | null
    _max: EmpresaMaxAggregateOutputType | null
  }

  export type EmpresaMinAggregateOutputType = {
    id: string | null
    cnpj: string | null
    razaoSocial: string | null
  }

  export type EmpresaMaxAggregateOutputType = {
    id: string | null
    cnpj: string | null
    razaoSocial: string | null
  }

  export type EmpresaCountAggregateOutputType = {
    id: number
    cnpj: number
    razaoSocial: number
    _all: number
  }


  export type EmpresaMinAggregateInputType = {
    id?: true
    cnpj?: true
    razaoSocial?: true
  }

  export type EmpresaMaxAggregateInputType = {
    id?: true
    cnpj?: true
    razaoSocial?: true
  }

  export type EmpresaCountAggregateInputType = {
    id?: true
    cnpj?: true
    razaoSocial?: true
    _all?: true
  }

  export type EmpresaAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Empresa to aggregate.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: Enumerable<EmpresaOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Empresas
    **/
    _count?: true | EmpresaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmpresaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmpresaMaxAggregateInputType
  }

  export type GetEmpresaAggregateType<T extends EmpresaAggregateArgs> = {
        [P in keyof T & keyof AggregateEmpresa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmpresa[P]>
      : GetScalarType<T[P], AggregateEmpresa[P]>
  }




  export type EmpresaGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: EmpresaWhereInput
    orderBy?: Enumerable<EmpresaOrderByWithAggregationInput>
    by: EmpresaScalarFieldEnum[]
    having?: EmpresaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmpresaCountAggregateInputType | true
    _min?: EmpresaMinAggregateInputType
    _max?: EmpresaMaxAggregateInputType
  }


  export type EmpresaGroupByOutputType = {
    id: string
    cnpj: string
    razaoSocial: string
    _count: EmpresaCountAggregateOutputType | null
    _min: EmpresaMinAggregateOutputType | null
    _max: EmpresaMaxAggregateOutputType | null
  }

  type GetEmpresaGroupByPayload<T extends EmpresaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<EmpresaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmpresaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmpresaGroupByOutputType[P]>
            : GetScalarType<T[P], EmpresaGroupByOutputType[P]>
        }
      >
    >


  export type EmpresaSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cnpj?: boolean
    razaoSocial?: boolean
    contratos?: boolean | Empresa$contratosArgs<ExtArgs>
    _count?: boolean | EmpresaCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["empresa"]>

  export type EmpresaSelectScalar = {
    id?: boolean
    cnpj?: boolean
    razaoSocial?: boolean
  }

  export type EmpresaInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    contratos?: boolean | Empresa$contratosArgs<ExtArgs>
    _count?: boolean | EmpresaCountOutputTypeArgs<ExtArgs>
  }


  type EmpresaGetPayload<S extends boolean | null | undefined | EmpresaArgs> = $Types.GetResult<EmpresaPayload, S>

  type EmpresaCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<EmpresaFindManyArgs, 'select' | 'include'> & {
      select?: EmpresaCountAggregateInputType | true
    }

  export interface EmpresaDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Empresa'], meta: { name: 'Empresa' } }
    /**
     * Find zero or one Empresa that matches the filter.
     * @param {EmpresaFindUniqueArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EmpresaFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, EmpresaFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Empresa'> extends True ? Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Empresa that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {EmpresaFindUniqueOrThrowArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends EmpresaFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, EmpresaFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Empresa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindFirstArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EmpresaFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, EmpresaFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Empresa'> extends True ? Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Empresa that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindFirstOrThrowArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends EmpresaFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, EmpresaFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Empresas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Empresas
     * const empresas = await prisma.empresa.findMany()
     * 
     * // Get first 10 Empresas
     * const empresas = await prisma.empresa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const empresaWithIdOnly = await prisma.empresa.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends EmpresaFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EmpresaFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Empresa.
     * @param {EmpresaCreateArgs} args - Arguments to create a Empresa.
     * @example
     * // Create one Empresa
     * const Empresa = await prisma.empresa.create({
     *   data: {
     *     // ... data to create a Empresa
     *   }
     * })
     * 
    **/
    create<T extends EmpresaCreateArgs<ExtArgs>>(
      args: SelectSubset<T, EmpresaCreateArgs<ExtArgs>>
    ): Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Empresas.
     *     @param {EmpresaCreateManyArgs} args - Arguments to create many Empresas.
     *     @example
     *     // Create many Empresas
     *     const empresa = await prisma.empresa.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends EmpresaCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EmpresaCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Empresa.
     * @param {EmpresaDeleteArgs} args - Arguments to delete one Empresa.
     * @example
     * // Delete one Empresa
     * const Empresa = await prisma.empresa.delete({
     *   where: {
     *     // ... filter to delete one Empresa
     *   }
     * })
     * 
    **/
    delete<T extends EmpresaDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, EmpresaDeleteArgs<ExtArgs>>
    ): Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Empresa.
     * @param {EmpresaUpdateArgs} args - Arguments to update one Empresa.
     * @example
     * // Update one Empresa
     * const empresa = await prisma.empresa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EmpresaUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, EmpresaUpdateArgs<ExtArgs>>
    ): Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Empresas.
     * @param {EmpresaDeleteManyArgs} args - Arguments to filter Empresas to delete.
     * @example
     * // Delete a few Empresas
     * const { count } = await prisma.empresa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EmpresaDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EmpresaDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Empresas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Empresas
     * const empresa = await prisma.empresa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EmpresaUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, EmpresaUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Empresa.
     * @param {EmpresaUpsertArgs} args - Arguments to update or create a Empresa.
     * @example
     * // Update or create a Empresa
     * const empresa = await prisma.empresa.upsert({
     *   create: {
     *     // ... data to create a Empresa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Empresa we want to update
     *   }
     * })
    **/
    upsert<T extends EmpresaUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, EmpresaUpsertArgs<ExtArgs>>
    ): Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Empresas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaCountArgs} args - Arguments to filter Empresas to count.
     * @example
     * // Count the number of Empresas
     * const count = await prisma.empresa.count({
     *   where: {
     *     // ... the filter for the Empresas we want to count
     *   }
     * })
    **/
    count<T extends EmpresaCountArgs>(
      args?: Subset<T, EmpresaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmpresaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Empresa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EmpresaAggregateArgs>(args: Subset<T, EmpresaAggregateArgs>): Prisma.PrismaPromise<GetEmpresaAggregateType<T>>

    /**
     * Group by Empresa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaGroupByArgs} args - Group by arguments.
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
      T extends EmpresaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmpresaGroupByArgs['orderBy'] }
        : { orderBy?: EmpresaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EmpresaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmpresaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Empresa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EmpresaClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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

    contratos<T extends Empresa$contratosArgs<ExtArgs> = {}>(args?: Subset<T, Empresa$contratosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<ContratoPayload<ExtArgs>, T, 'findMany', never>| Null>;

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
   * Empresa base type for findUnique actions
   */
  export type EmpresaFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa findUnique
   */
  export interface EmpresaFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends EmpresaFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Empresa findUniqueOrThrow
   */
  export type EmpresaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where: EmpresaWhereUniqueInput
  }


  /**
   * Empresa base type for findFirst actions
   */
  export type EmpresaFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: Enumerable<EmpresaOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Empresas.
     */
    distinct?: Enumerable<EmpresaScalarFieldEnum>
  }

  /**
   * Empresa findFirst
   */
  export interface EmpresaFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends EmpresaFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Empresa findFirstOrThrow
   */
  export type EmpresaFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: Enumerable<EmpresaOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Empresas.
     */
    distinct?: Enumerable<EmpresaScalarFieldEnum>
  }


  /**
   * Empresa findMany
   */
  export type EmpresaFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresas to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: Enumerable<EmpresaOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    distinct?: Enumerable<EmpresaScalarFieldEnum>
  }


  /**
   * Empresa create
   */
  export type EmpresaCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The data needed to create a Empresa.
     */
    data: XOR<EmpresaCreateInput, EmpresaUncheckedCreateInput>
  }


  /**
   * Empresa createMany
   */
  export type EmpresaCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Empresas.
     */
    data: Enumerable<EmpresaCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Empresa update
   */
  export type EmpresaUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The data needed to update a Empresa.
     */
    data: XOR<EmpresaUpdateInput, EmpresaUncheckedUpdateInput>
    /**
     * Choose, which Empresa to update.
     */
    where: EmpresaWhereUniqueInput
  }


  /**
   * Empresa updateMany
   */
  export type EmpresaUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Empresas.
     */
    data: XOR<EmpresaUpdateManyMutationInput, EmpresaUncheckedUpdateManyInput>
    /**
     * Filter which Empresas to update
     */
    where?: EmpresaWhereInput
  }


  /**
   * Empresa upsert
   */
  export type EmpresaUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The filter to search for the Empresa to update in case it exists.
     */
    where: EmpresaWhereUniqueInput
    /**
     * In case the Empresa found by the `where` argument doesn't exist, create a new Empresa with this data.
     */
    create: XOR<EmpresaCreateInput, EmpresaUncheckedCreateInput>
    /**
     * In case the Empresa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmpresaUpdateInput, EmpresaUncheckedUpdateInput>
  }


  /**
   * Empresa delete
   */
  export type EmpresaDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter which Empresa to delete.
     */
    where: EmpresaWhereUniqueInput
  }


  /**
   * Empresa deleteMany
   */
  export type EmpresaDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Empresas to delete
     */
    where?: EmpresaWhereInput
  }


  /**
   * Empresa.contratos
   */
  export type Empresa$contratosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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
   * Empresa without action
   */
  export type EmpresaArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EmpresaInclude<ExtArgs> | null
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
    cnpj: string | null
    nome: string | null
    createdAt: Date | null
  }

  export type FornecedorMaxAggregateOutputType = {
    id: string | null
    cnpj: string | null
    nome: string | null
    createdAt: Date | null
  }

  export type FornecedorCountAggregateOutputType = {
    id: number
    cnpj: number
    nome: number
    createdAt: number
    _all: number
  }


  export type FornecedorMinAggregateInputType = {
    id?: true
    cnpj?: true
    nome?: true
    createdAt?: true
  }

  export type FornecedorMaxAggregateInputType = {
    id?: true
    cnpj?: true
    nome?: true
    createdAt?: true
  }

  export type FornecedorCountAggregateInputType = {
    id?: true
    cnpj?: true
    nome?: true
    createdAt?: true
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
    cnpj: string | null
    nome: string
    createdAt: Date
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
    cnpj?: boolean
    nome?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["fornecedor"]>

  export type FornecedorSelectScalar = {
    id?: boolean
    cnpj?: boolean
    nome?: boolean
    createdAt?: boolean
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
   * Fornecedor without action
   */
  export type FornecedorArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fornecedor
     */
    select?: FornecedorSelect<ExtArgs> | null
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
    empresaId: string | null
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
    empresaId: string | null
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
    empresaId: number
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
    empresaId?: true
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
    empresaId?: true
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
    empresaId?: true
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
    empresaId: string
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
    empresaId?: boolean
    modalidade?: boolean
    objeto?: boolean
    valorAnualCents?: boolean
    dataInicio?: boolean
    dataFimOrig?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    unidadeFsp?: boolean | UnidadeFspArgs<ExtArgs>
    gestor?: boolean | EntidadeGestoraArgs<ExtArgs>
    fiscal?: boolean | EntidadeGestoraArgs<ExtArgs>
    empresa?: boolean | EmpresaArgs<ExtArgs>
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
    empresaId?: boolean
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
    gestor?: boolean | EntidadeGestoraArgs<ExtArgs>
    fiscal?: boolean | EntidadeGestoraArgs<ExtArgs>
    empresa?: boolean | EmpresaArgs<ExtArgs>
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

    gestor<T extends EntidadeGestoraArgs<ExtArgs> = {}>(args?: Subset<T, EntidadeGestoraArgs<ExtArgs>>): Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    fiscal<T extends EntidadeGestoraArgs<ExtArgs> = {}>(args?: Subset<T, EntidadeGestoraArgs<ExtArgs>>): Prisma__EntidadeGestoraClient<$Types.GetResult<EntidadeGestoraPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    empresa<T extends EmpresaArgs<ExtArgs> = {}>(args?: Subset<T, EmpresaArgs<ExtArgs>>): Prisma__EmpresaClient<$Types.GetResult<EmpresaPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

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


  export const EntidadeGestoraScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    cpf: 'cpf'
  };

  export type EntidadeGestoraScalarFieldEnum = (typeof EntidadeGestoraScalarFieldEnum)[keyof typeof EntidadeGestoraScalarFieldEnum]


  export const MunicipioScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    uf: 'uf'
  };

  export type MunicipioScalarFieldEnum = (typeof MunicipioScalarFieldEnum)[keyof typeof MunicipioScalarFieldEnum]


  export const EmpresaScalarFieldEnum: {
    id: 'id',
    cnpj: 'cnpj',
    razaoSocial: 'razaoSocial'
  };

  export type EmpresaScalarFieldEnum = (typeof EmpresaScalarFieldEnum)[keyof typeof EmpresaScalarFieldEnum]


  export const FornecedorScalarFieldEnum: {
    id: 'id',
    cnpj: 'cnpj',
    nome: 'nome',
    createdAt: 'createdAt'
  };

  export type FornecedorScalarFieldEnum = (typeof FornecedorScalarFieldEnum)[keyof typeof FornecedorScalarFieldEnum]


  export const ContratoScalarFieldEnum: {
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

  export type EntidadeGestoraWhereInput = {
    AND?: Enumerable<EntidadeGestoraWhereInput>
    OR?: Enumerable<EntidadeGestoraWhereInput>
    NOT?: Enumerable<EntidadeGestoraWhereInput>
    id?: StringFilter | string
    nome?: StringFilter | string
    cpf?: StringFilter | string
    gestorContratos?: ContratoListRelationFilter
    fiscalContratos?: ContratoListRelationFilter
  }

  export type EntidadeGestoraOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrder
    gestorContratos?: ContratoOrderByRelationAggregateInput
    fiscalContratos?: ContratoOrderByRelationAggregateInput
  }

  export type EntidadeGestoraWhereUniqueInput = {
    id?: string
    cpf?: string
  }

  export type EntidadeGestoraOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrder
    _count?: EntidadeGestoraCountOrderByAggregateInput
    _max?: EntidadeGestoraMaxOrderByAggregateInput
    _min?: EntidadeGestoraMinOrderByAggregateInput
  }

  export type EntidadeGestoraScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EntidadeGestoraScalarWhereWithAggregatesInput>
    OR?: Enumerable<EntidadeGestoraScalarWhereWithAggregatesInput>
    NOT?: Enumerable<EntidadeGestoraScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
    cpf?: StringWithAggregatesFilter | string
  }

  export type MunicipioWhereInput = {
    AND?: Enumerable<MunicipioWhereInput>
    OR?: Enumerable<MunicipioWhereInput>
    NOT?: Enumerable<MunicipioWhereInput>
    id?: StringFilter | string
    nome?: StringFilter | string
    uf?: StringFilter | string
  }

  export type MunicipioOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
  }

  export type MunicipioWhereUniqueInput = {
    id?: string
  }

  export type MunicipioOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
    _count?: MunicipioCountOrderByAggregateInput
    _max?: MunicipioMaxOrderByAggregateInput
    _min?: MunicipioMinOrderByAggregateInput
  }

  export type MunicipioScalarWhereWithAggregatesInput = {
    AND?: Enumerable<MunicipioScalarWhereWithAggregatesInput>
    OR?: Enumerable<MunicipioScalarWhereWithAggregatesInput>
    NOT?: Enumerable<MunicipioScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    nome?: StringWithAggregatesFilter | string
    uf?: StringWithAggregatesFilter | string
  }

  export type EmpresaWhereInput = {
    AND?: Enumerable<EmpresaWhereInput>
    OR?: Enumerable<EmpresaWhereInput>
    NOT?: Enumerable<EmpresaWhereInput>
    id?: StringFilter | string
    cnpj?: StringFilter | string
    razaoSocial?: StringFilter | string
    contratos?: ContratoListRelationFilter
  }

  export type EmpresaOrderByWithRelationInput = {
    id?: SortOrder
    cnpj?: SortOrder
    razaoSocial?: SortOrder
    contratos?: ContratoOrderByRelationAggregateInput
  }

  export type EmpresaWhereUniqueInput = {
    id?: string
    cnpj?: string
  }

  export type EmpresaOrderByWithAggregationInput = {
    id?: SortOrder
    cnpj?: SortOrder
    razaoSocial?: SortOrder
    _count?: EmpresaCountOrderByAggregateInput
    _max?: EmpresaMaxOrderByAggregateInput
    _min?: EmpresaMinOrderByAggregateInput
  }

  export type EmpresaScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EmpresaScalarWhereWithAggregatesInput>
    OR?: Enumerable<EmpresaScalarWhereWithAggregatesInput>
    NOT?: Enumerable<EmpresaScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    cnpj?: StringWithAggregatesFilter | string
    razaoSocial?: StringWithAggregatesFilter | string
  }

  export type FornecedorWhereInput = {
    AND?: Enumerable<FornecedorWhereInput>
    OR?: Enumerable<FornecedorWhereInput>
    NOT?: Enumerable<FornecedorWhereInput>
    id?: StringFilter | string
    cnpj?: StringNullableFilter | string | null
    nome?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
  }

  export type FornecedorOrderByWithRelationInput = {
    id?: SortOrder
    cnpj?: SortOrderInput | SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
  }

  export type FornecedorWhereUniqueInput = {
    id?: string
    cnpj?: string
  }

  export type FornecedorOrderByWithAggregationInput = {
    id?: SortOrder
    cnpj?: SortOrderInput | SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
    _count?: FornecedorCountOrderByAggregateInput
    _max?: FornecedorMaxOrderByAggregateInput
    _min?: FornecedorMinOrderByAggregateInput
  }

  export type FornecedorScalarWhereWithAggregatesInput = {
    AND?: Enumerable<FornecedorScalarWhereWithAggregatesInput>
    OR?: Enumerable<FornecedorScalarWhereWithAggregatesInput>
    NOT?: Enumerable<FornecedorScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    cnpj?: StringNullableWithAggregatesFilter | string | null
    nome?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
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
    empresaId?: StringFilter | string
    modalidade?: StringFilter | string
    objeto?: StringFilter | string
    valorAnualCents?: IntFilter | number
    dataInicio?: DateTimeNullableFilter | Date | string | null
    dataFimOrig?: DateTimeNullableFilter | Date | string | null
    status?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    unidadeFsp?: XOR<UnidadeFspRelationFilter, UnidadeFspWhereInput>
    gestor?: XOR<EntidadeGestoraRelationFilter, EntidadeGestoraWhereInput>
    fiscal?: XOR<EntidadeGestoraRelationFilter, EntidadeGestoraWhereInput>
    empresa?: XOR<EmpresaRelationFilter, EmpresaWhereInput>
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
    empresaId?: SortOrder
    modalidade?: SortOrder
    objeto?: SortOrder
    valorAnualCents?: SortOrder
    dataInicio?: SortOrderInput | SortOrder
    dataFimOrig?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    unidadeFsp?: UnidadeFspOrderByWithRelationInput
    gestor?: EntidadeGestoraOrderByWithRelationInput
    fiscal?: EntidadeGestoraOrderByWithRelationInput
    empresa?: EmpresaOrderByWithRelationInput
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
    empresaId?: SortOrder
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
    empresaId?: StringWithAggregatesFilter | string
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

  export type EntidadeGestoraCreateInput = {
    id?: string
    nome: string
    cpf: string
    gestorContratos?: ContratoCreateNestedManyWithoutGestorInput
    fiscalContratos?: ContratoCreateNestedManyWithoutFiscalInput
  }

  export type EntidadeGestoraUncheckedCreateInput = {
    id?: string
    nome: string
    cpf: string
    gestorContratos?: ContratoUncheckedCreateNestedManyWithoutGestorInput
    fiscalContratos?: ContratoUncheckedCreateNestedManyWithoutFiscalInput
  }

  export type EntidadeGestoraUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    gestorContratos?: ContratoUpdateManyWithoutGestorNestedInput
    fiscalContratos?: ContratoUpdateManyWithoutFiscalNestedInput
  }

  export type EntidadeGestoraUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    gestorContratos?: ContratoUncheckedUpdateManyWithoutGestorNestedInput
    fiscalContratos?: ContratoUncheckedUpdateManyWithoutFiscalNestedInput
  }

  export type EntidadeGestoraCreateManyInput = {
    id?: string
    nome: string
    cpf: string
  }

  export type EntidadeGestoraUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
  }

  export type EntidadeGestoraUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
  }

  export type MunicipioCreateInput = {
    id?: string
    nome: string
    uf: string
  }

  export type MunicipioUncheckedCreateInput = {
    id?: string
    nome: string
    uf: string
  }

  export type MunicipioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
  }

  export type MunicipioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
  }

  export type MunicipioCreateManyInput = {
    id?: string
    nome: string
    uf: string
  }

  export type MunicipioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
  }

  export type MunicipioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    uf?: StringFieldUpdateOperationsInput | string
  }

  export type EmpresaCreateInput = {
    id?: string
    cnpj: string
    razaoSocial: string
    contratos?: ContratoCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaUncheckedCreateInput = {
    id?: string
    cnpj: string
    razaoSocial: string
    contratos?: ContratoUncheckedCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    contratos?: ContratoUpdateManyWithoutEmpresaNestedInput
  }

  export type EmpresaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
    contratos?: ContratoUncheckedUpdateManyWithoutEmpresaNestedInput
  }

  export type EmpresaCreateManyInput = {
    id?: string
    cnpj: string
    razaoSocial: string
  }

  export type EmpresaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
  }

  export type EmpresaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
  }

  export type FornecedorCreateInput = {
    id?: string
    cnpj?: string | null
    nome: string
    createdAt?: Date | string
  }

  export type FornecedorUncheckedCreateInput = {
    id?: string
    cnpj?: string | null
    nome: string
    createdAt?: Date | string
  }

  export type FornecedorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorCreateManyInput = {
    id?: string
    cnpj?: string | null
    nome: string
    createdAt?: Date | string
  }

  export type FornecedorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FornecedorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    gestor: EntidadeGestoraCreateNestedOneWithoutGestorContratosInput
    fiscal: EntidadeGestoraCreateNestedOneWithoutFiscalContratosInput
    empresa: EmpresaCreateNestedOneWithoutContratosInput
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
    empresaId: string
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
    gestor?: EntidadeGestoraUpdateOneRequiredWithoutGestorContratosNestedInput
    fiscal?: EntidadeGestoraUpdateOneRequiredWithoutFiscalContratosNestedInput
    empresa?: EmpresaUpdateOneRequiredWithoutContratosNestedInput
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
    empresaId?: StringFieldUpdateOperationsInput | string
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
    empresaId: string
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
    empresaId?: StringFieldUpdateOperationsInput | string
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

  export type EntidadeGestoraCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrder
  }

  export type EntidadeGestoraMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrder
  }

  export type EntidadeGestoraMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cpf?: SortOrder
  }

  export type MunicipioCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
  }

  export type MunicipioMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
  }

  export type MunicipioMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    uf?: SortOrder
  }

  export type EmpresaCountOrderByAggregateInput = {
    id?: SortOrder
    cnpj?: SortOrder
    razaoSocial?: SortOrder
  }

  export type EmpresaMaxOrderByAggregateInput = {
    id?: SortOrder
    cnpj?: SortOrder
    razaoSocial?: SortOrder
  }

  export type EmpresaMinOrderByAggregateInput = {
    id?: SortOrder
    cnpj?: SortOrder
    razaoSocial?: SortOrder
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FornecedorCountOrderByAggregateInput = {
    id?: SortOrder
    cnpj?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
  }

  export type FornecedorMaxOrderByAggregateInput = {
    id?: SortOrder
    cnpj?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
  }

  export type FornecedorMinOrderByAggregateInput = {
    id?: SortOrder
    cnpj?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
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

  export type UnidadeFspRelationFilter = {
    is?: UnidadeFspWhereInput | null
    isNot?: UnidadeFspWhereInput | null
  }

  export type EntidadeGestoraRelationFilter = {
    is?: EntidadeGestoraWhereInput | null
    isNot?: EntidadeGestoraWhereInput | null
  }

  export type EmpresaRelationFilter = {
    is?: EmpresaWhereInput | null
    isNot?: EmpresaWhereInput | null
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
    empresaId?: SortOrder
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
    empresaId?: SortOrder
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
    empresaId?: SortOrder
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

  export type ContratoCreateNestedManyWithoutEmpresaInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutEmpresaInput>, Enumerable<ContratoUncheckedCreateWithoutEmpresaInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutEmpresaInput>
    createMany?: ContratoCreateManyEmpresaInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type ContratoUncheckedCreateNestedManyWithoutEmpresaInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutEmpresaInput>, Enumerable<ContratoUncheckedCreateWithoutEmpresaInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutEmpresaInput>
    createMany?: ContratoCreateManyEmpresaInputEnvelope
    connect?: Enumerable<ContratoWhereUniqueInput>
  }

  export type ContratoUpdateManyWithoutEmpresaNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutEmpresaInput>, Enumerable<ContratoUncheckedCreateWithoutEmpresaInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutEmpresaInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutEmpresaInput>
    createMany?: ContratoCreateManyEmpresaInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutEmpresaInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutEmpresaInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type ContratoUncheckedUpdateManyWithoutEmpresaNestedInput = {
    create?: XOR<Enumerable<ContratoCreateWithoutEmpresaInput>, Enumerable<ContratoUncheckedCreateWithoutEmpresaInput>>
    connectOrCreate?: Enumerable<ContratoCreateOrConnectWithoutEmpresaInput>
    upsert?: Enumerable<ContratoUpsertWithWhereUniqueWithoutEmpresaInput>
    createMany?: ContratoCreateManyEmpresaInputEnvelope
    set?: Enumerable<ContratoWhereUniqueInput>
    disconnect?: Enumerable<ContratoWhereUniqueInput>
    delete?: Enumerable<ContratoWhereUniqueInput>
    connect?: Enumerable<ContratoWhereUniqueInput>
    update?: Enumerable<ContratoUpdateWithWhereUniqueWithoutEmpresaInput>
    updateMany?: Enumerable<ContratoUpdateManyWithWhereWithoutEmpresaInput>
    deleteMany?: Enumerable<ContratoScalarWhereInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UnidadeFspCreateNestedOneWithoutContratosInput = {
    create?: XOR<UnidadeFspCreateWithoutContratosInput, UnidadeFspUncheckedCreateWithoutContratosInput>
    connectOrCreate?: UnidadeFspCreateOrConnectWithoutContratosInput
    connect?: UnidadeFspWhereUniqueInput
  }

  export type EntidadeGestoraCreateNestedOneWithoutGestorContratosInput = {
    create?: XOR<EntidadeGestoraCreateWithoutGestorContratosInput, EntidadeGestoraUncheckedCreateWithoutGestorContratosInput>
    connectOrCreate?: EntidadeGestoraCreateOrConnectWithoutGestorContratosInput
    connect?: EntidadeGestoraWhereUniqueInput
  }

  export type EntidadeGestoraCreateNestedOneWithoutFiscalContratosInput = {
    create?: XOR<EntidadeGestoraCreateWithoutFiscalContratosInput, EntidadeGestoraUncheckedCreateWithoutFiscalContratosInput>
    connectOrCreate?: EntidadeGestoraCreateOrConnectWithoutFiscalContratosInput
    connect?: EntidadeGestoraWhereUniqueInput
  }

  export type EmpresaCreateNestedOneWithoutContratosInput = {
    create?: XOR<EmpresaCreateWithoutContratosInput, EmpresaUncheckedCreateWithoutContratosInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutContratosInput
    connect?: EmpresaWhereUniqueInput
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

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UnidadeFspUpdateOneRequiredWithoutContratosNestedInput = {
    create?: XOR<UnidadeFspCreateWithoutContratosInput, UnidadeFspUncheckedCreateWithoutContratosInput>
    connectOrCreate?: UnidadeFspCreateOrConnectWithoutContratosInput
    upsert?: UnidadeFspUpsertWithoutContratosInput
    connect?: UnidadeFspWhereUniqueInput
    update?: XOR<UnidadeFspUpdateWithoutContratosInput, UnidadeFspUncheckedUpdateWithoutContratosInput>
  }

  export type EntidadeGestoraUpdateOneRequiredWithoutGestorContratosNestedInput = {
    create?: XOR<EntidadeGestoraCreateWithoutGestorContratosInput, EntidadeGestoraUncheckedCreateWithoutGestorContratosInput>
    connectOrCreate?: EntidadeGestoraCreateOrConnectWithoutGestorContratosInput
    upsert?: EntidadeGestoraUpsertWithoutGestorContratosInput
    connect?: EntidadeGestoraWhereUniqueInput
    update?: XOR<EntidadeGestoraUpdateWithoutGestorContratosInput, EntidadeGestoraUncheckedUpdateWithoutGestorContratosInput>
  }

  export type EntidadeGestoraUpdateOneRequiredWithoutFiscalContratosNestedInput = {
    create?: XOR<EntidadeGestoraCreateWithoutFiscalContratosInput, EntidadeGestoraUncheckedCreateWithoutFiscalContratosInput>
    connectOrCreate?: EntidadeGestoraCreateOrConnectWithoutFiscalContratosInput
    upsert?: EntidadeGestoraUpsertWithoutFiscalContratosInput
    connect?: EntidadeGestoraWhereUniqueInput
    update?: XOR<EntidadeGestoraUpdateWithoutFiscalContratosInput, EntidadeGestoraUncheckedUpdateWithoutFiscalContratosInput>
  }

  export type EmpresaUpdateOneRequiredWithoutContratosNestedInput = {
    create?: XOR<EmpresaCreateWithoutContratosInput, EmpresaUncheckedCreateWithoutContratosInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutContratosInput
    upsert?: EmpresaUpsertWithoutContratosInput
    connect?: EmpresaWhereUniqueInput
    update?: XOR<EmpresaUpdateWithoutContratosInput, EmpresaUncheckedUpdateWithoutContratosInput>
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
    gestor: EntidadeGestoraCreateNestedOneWithoutGestorContratosInput
    fiscal: EntidadeGestoraCreateNestedOneWithoutFiscalContratosInput
    empresa: EmpresaCreateNestedOneWithoutContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateWithoutUnidadeFspInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    gestorId: string
    fiscalId: string
    empresaId: string
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
    empresaId?: StringFilter | string
    modalidade?: StringFilter | string
    objeto?: StringFilter | string
    valorAnualCents?: IntFilter | number
    dataInicio?: DateTimeNullableFilter | Date | string | null
    dataFimOrig?: DateTimeNullableFilter | Date | string | null
    status?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
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
    fiscal: EntidadeGestoraCreateNestedOneWithoutFiscalContratosInput
    empresa: EmpresaCreateNestedOneWithoutContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateWithoutGestorInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    fiscalId: string
    empresaId: string
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
    gestor: EntidadeGestoraCreateNestedOneWithoutGestorContratosInput
    empresa: EmpresaCreateNestedOneWithoutContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateWithoutFiscalInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    empresaId: string
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

  export type ContratoCreateWithoutEmpresaInput = {
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
    gestor: EntidadeGestoraCreateNestedOneWithoutGestorContratosInput
    fiscal: EntidadeGestoraCreateNestedOneWithoutFiscalContratosInput
    aditivos?: AditivoCreateNestedManyWithoutContratoInput
  }

  export type ContratoUncheckedCreateWithoutEmpresaInput = {
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

  export type ContratoCreateOrConnectWithoutEmpresaInput = {
    where: ContratoWhereUniqueInput
    create: XOR<ContratoCreateWithoutEmpresaInput, ContratoUncheckedCreateWithoutEmpresaInput>
  }

  export type ContratoCreateManyEmpresaInputEnvelope = {
    data: Enumerable<ContratoCreateManyEmpresaInput>
    skipDuplicates?: boolean
  }

  export type ContratoUpsertWithWhereUniqueWithoutEmpresaInput = {
    where: ContratoWhereUniqueInput
    update: XOR<ContratoUpdateWithoutEmpresaInput, ContratoUncheckedUpdateWithoutEmpresaInput>
    create: XOR<ContratoCreateWithoutEmpresaInput, ContratoUncheckedCreateWithoutEmpresaInput>
  }

  export type ContratoUpdateWithWhereUniqueWithoutEmpresaInput = {
    where: ContratoWhereUniqueInput
    data: XOR<ContratoUpdateWithoutEmpresaInput, ContratoUncheckedUpdateWithoutEmpresaInput>
  }

  export type ContratoUpdateManyWithWhereWithoutEmpresaInput = {
    where: ContratoScalarWhereInput
    data: XOR<ContratoUpdateManyMutationInput, ContratoUncheckedUpdateManyWithoutContratosInput>
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

  export type EntidadeGestoraCreateWithoutGestorContratosInput = {
    id?: string
    nome: string
    cpf: string
    fiscalContratos?: ContratoCreateNestedManyWithoutFiscalInput
  }

  export type EntidadeGestoraUncheckedCreateWithoutGestorContratosInput = {
    id?: string
    nome: string
    cpf: string
    fiscalContratos?: ContratoUncheckedCreateNestedManyWithoutFiscalInput
  }

  export type EntidadeGestoraCreateOrConnectWithoutGestorContratosInput = {
    where: EntidadeGestoraWhereUniqueInput
    create: XOR<EntidadeGestoraCreateWithoutGestorContratosInput, EntidadeGestoraUncheckedCreateWithoutGestorContratosInput>
  }

  export type EntidadeGestoraCreateWithoutFiscalContratosInput = {
    id?: string
    nome: string
    cpf: string
    gestorContratos?: ContratoCreateNestedManyWithoutGestorInput
  }

  export type EntidadeGestoraUncheckedCreateWithoutFiscalContratosInput = {
    id?: string
    nome: string
    cpf: string
    gestorContratos?: ContratoUncheckedCreateNestedManyWithoutGestorInput
  }

  export type EntidadeGestoraCreateOrConnectWithoutFiscalContratosInput = {
    where: EntidadeGestoraWhereUniqueInput
    create: XOR<EntidadeGestoraCreateWithoutFiscalContratosInput, EntidadeGestoraUncheckedCreateWithoutFiscalContratosInput>
  }

  export type EmpresaCreateWithoutContratosInput = {
    id?: string
    cnpj: string
    razaoSocial: string
  }

  export type EmpresaUncheckedCreateWithoutContratosInput = {
    id?: string
    cnpj: string
    razaoSocial: string
  }

  export type EmpresaCreateOrConnectWithoutContratosInput = {
    where: EmpresaWhereUniqueInput
    create: XOR<EmpresaCreateWithoutContratosInput, EmpresaUncheckedCreateWithoutContratosInput>
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

  export type EntidadeGestoraUpsertWithoutGestorContratosInput = {
    update: XOR<EntidadeGestoraUpdateWithoutGestorContratosInput, EntidadeGestoraUncheckedUpdateWithoutGestorContratosInput>
    create: XOR<EntidadeGestoraCreateWithoutGestorContratosInput, EntidadeGestoraUncheckedCreateWithoutGestorContratosInput>
  }

  export type EntidadeGestoraUpdateWithoutGestorContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    fiscalContratos?: ContratoUpdateManyWithoutFiscalNestedInput
  }

  export type EntidadeGestoraUncheckedUpdateWithoutGestorContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    fiscalContratos?: ContratoUncheckedUpdateManyWithoutFiscalNestedInput
  }

  export type EntidadeGestoraUpsertWithoutFiscalContratosInput = {
    update: XOR<EntidadeGestoraUpdateWithoutFiscalContratosInput, EntidadeGestoraUncheckedUpdateWithoutFiscalContratosInput>
    create: XOR<EntidadeGestoraCreateWithoutFiscalContratosInput, EntidadeGestoraUncheckedCreateWithoutFiscalContratosInput>
  }

  export type EntidadeGestoraUpdateWithoutFiscalContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    gestorContratos?: ContratoUpdateManyWithoutGestorNestedInput
  }

  export type EntidadeGestoraUncheckedUpdateWithoutFiscalContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cpf?: StringFieldUpdateOperationsInput | string
    gestorContratos?: ContratoUncheckedUpdateManyWithoutGestorNestedInput
  }

  export type EmpresaUpsertWithoutContratosInput = {
    update: XOR<EmpresaUpdateWithoutContratosInput, EmpresaUncheckedUpdateWithoutContratosInput>
    create: XOR<EmpresaCreateWithoutContratosInput, EmpresaUncheckedCreateWithoutContratosInput>
  }

  export type EmpresaUpdateWithoutContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
  }

  export type EmpresaUncheckedUpdateWithoutContratosInput = {
    id?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    razaoSocial?: StringFieldUpdateOperationsInput | string
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
    gestor: EntidadeGestoraCreateNestedOneWithoutGestorContratosInput
    fiscal: EntidadeGestoraCreateNestedOneWithoutFiscalContratosInput
    empresa: EmpresaCreateNestedOneWithoutContratosInput
  }

  export type ContratoUncheckedCreateWithoutAditivosInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    gestorId: string
    fiscalId: string
    empresaId: string
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
    gestor?: EntidadeGestoraUpdateOneRequiredWithoutGestorContratosNestedInput
    fiscal?: EntidadeGestoraUpdateOneRequiredWithoutFiscalContratosNestedInput
    empresa?: EmpresaUpdateOneRequiredWithoutContratosNestedInput
  }

  export type ContratoUncheckedUpdateWithoutAditivosInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    gestorId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    empresaId?: StringFieldUpdateOperationsInput | string
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
    empresaId: string
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
    gestor?: EntidadeGestoraUpdateOneRequiredWithoutGestorContratosNestedInput
    fiscal?: EntidadeGestoraUpdateOneRequiredWithoutFiscalContratosNestedInput
    empresa?: EmpresaUpdateOneRequiredWithoutContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateWithoutUnidadeFspInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    gestorId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    empresaId?: StringFieldUpdateOperationsInput | string
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
    empresaId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContratoCreateManyGestorInput = {
    id?: string
    protocoloCabeca?: string | null
    numGms: number
    anoGms: number
    unidadeFspId: string
    fiscalId: string
    empresaId: string
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
    empresaId: string
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
    fiscal?: EntidadeGestoraUpdateOneRequiredWithoutFiscalContratosNestedInput
    empresa?: EmpresaUpdateOneRequiredWithoutContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateWithoutGestorInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    fiscalId?: StringFieldUpdateOperationsInput | string
    empresaId?: StringFieldUpdateOperationsInput | string
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
    empresaId?: StringFieldUpdateOperationsInput | string
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
    gestor?: EntidadeGestoraUpdateOneRequiredWithoutGestorContratosNestedInput
    empresa?: EmpresaUpdateOneRequiredWithoutContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateWithoutFiscalInput = {
    id?: StringFieldUpdateOperationsInput | string
    protocoloCabeca?: NullableStringFieldUpdateOperationsInput | string | null
    numGms?: IntFieldUpdateOperationsInput | number
    anoGms?: IntFieldUpdateOperationsInput | number
    unidadeFspId?: StringFieldUpdateOperationsInput | string
    gestorId?: StringFieldUpdateOperationsInput | string
    empresaId?: StringFieldUpdateOperationsInput | string
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
    empresaId?: StringFieldUpdateOperationsInput | string
    modalidade?: StringFieldUpdateOperationsInput | string
    objeto?: StringFieldUpdateOperationsInput | string
    valorAnualCents?: IntFieldUpdateOperationsInput | number
    dataInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimOrig?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContratoCreateManyEmpresaInput = {
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

  export type ContratoUpdateWithoutEmpresaInput = {
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
    gestor?: EntidadeGestoraUpdateOneRequiredWithoutGestorContratosNestedInput
    fiscal?: EntidadeGestoraUpdateOneRequiredWithoutFiscalContratosNestedInput
    aditivos?: AditivoUpdateManyWithoutContratoNestedInput
  }

  export type ContratoUncheckedUpdateWithoutEmpresaInput = {
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