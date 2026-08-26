# 2026-08-26 — Vistoria completa do backend

Auditoria de leitura sobre `apps/api/src` (67 arquivos), com apoio de `packages/db`, `packages/schema` e `packages/domain`.
Stack auditada: Express 5.2 + Prisma 4.16 + Postgres + JWT próprio (HS256).

**Nenhum arquivo de código foi alterado.** Este documento é o registro do diagnóstico; a remediação é decisão posterior.

---

## 0. Veredito

A arquitetura é sólida: camadas `rota → controller → service → repository` bem definidas, `asyncHandler` uniforme, `errorHandler` centralizado, Zod nos writes, RBAC presente em **todos** os endpoints de mutação, paginação com teto, materialized views para dashboards e audit log com GUC de sessão.

O que compromete o conjunto é a **camada de autenticação e autorização não estar fechada**. No estado atual a API é, na prática, pública com privilégio de ADMIN. Isso precede qualquer outra discussão.

| Eixo | Situação |
|---|---|
| Autenticação | **Quebrada** — bypass ativo em produção |
| Autorização por papel (RBAC) | **Boa** — gates presentes em todas as escritas |
| Autorização por órgão (multi-tenant) | **Quebrada** — IDOR generalizado |
| Endurecimento HTTP | **Ausente** — sem helmet/CORS/rate limit/compressão |
| Performance | **Um gargalo dominante** (contratos) + ajustes pontuais |
| Padrão de código | **Coerente**, com 3 violações de camada relevantes |
| Código morto / legado | **Pouco** — nenhum `TODO`/`FIXME` no backend |

---

## 1. P0 — Segurança bloqueante

### 1.1 Tokens sintéticos aceitos em produção

`apps/api/src/middleware/auth.ts:85-88`

```ts
if (legacy[token]) {
  req.user = legacy[token];
  return next();
}
```

O comentário da linha 52 promete "(+ legado só com VITEST)", mas **não existe guarda de ambiente**. Qualquer cliente que envie `Authorization: Bearer admin` recebe papel ADMIN sintético, mesmo com `AUTH_REQUIRED=1`. Isso anula o RBAC inteiro.

Efeito colateral: o lookup `legacy[token]` em objeto literal responde a chaves de `Object.prototype` (`constructor`, `toString`), atribuindo um valor não-usuário a `req.user`.

**Correção:** restringir a `process.env.VITEST === 'true'`; usar `Map` ou `Object.create(null)`; garantir rejeição em produção.

### 1.2 Bypass sem header ligado por padrão

`apps/api/src/middleware/auth.ts:7-8,66-69`

```ts
const DEV_BYPASS =
  process.env.AUTH_REQUIRED !== '1' && process.env.AUTH_REQUIRED !== 'true';
```

Requisição sem `Authorization` recebe `SYSTEM_USER` com `role: 'ADMIN'`. A política é **opt-out**: basta esquecer a variável em um deploy para a API ficar aberta.

**Correção:** inverter para fail-closed — bypass só com opt-in explícito (`AUTH_DEV_BYPASS=1`) e nunca quando `NODE_ENV=production`.

### 1.3 Segredos com fallback embutido

| Local | Fallback |
|---|---|
| `apps/api/src/lib/jwt.ts:3` | `'painel-dev-secret-change-me'` |
| `apps/api/src/server.ts:9-11` | `postgresql://painel:pass@localhost:5434/painel_db` |

Com o segredo default, JWTs válidos podem ser forjados por qualquer um que conheça o repositório.

**Correção:** abortar o boot em produção quando `JWT_SECRET`/`DATABASE_URL` não estiverem definidos.

### 1.4 IDOR generalizado — escopo de órgão

`getOrgaoScope` só é aplicado em **listagens**. Nenhum acesso por ID verifica o órgão.

A própria função falha aberta:

```ts
// apps/api/src/lib/audit.ts:11-17
export function getOrgaoScope(req: Request): { orgaoId?: string | null } {
  const user = req.user;
  if (!user) return {};
  if (normalizeRole(user.role) === 'ADMIN') return {};
  if (!user.orgaoId) return {};   // <- fail-open
  return { orgaoId: user.orgaoId };
}
```

Como os tokens sintéticos têm `orgaoId: null`, mesmo os endpoints que chamam o escopo não filtram nada nesse caminho.

**Onde falta escopo:**

| Endpoint | Arquivo |
|---|---|
| `GET/PUT/PATCH/DELETE /contracts/:id` | `controllers/contractsController.ts:11-27` |
| Alterações contratuais (list/get/create/update/delete/simular) | `controllers/alteracaoController.ts:10-41` |
| Dotações, empenhos, reservas, publicações, documentos | `controllers/orcamentoController.ts:15-169` |
| `timeline` / `limites` / `financeiro` / `auditoria` por `contratoId` | `controllers/dashboardController.ts:106-119` |
| KPIs de dashboard (exceto `getPorOrgao`) | `controllers/dashboardController.ts:22-119` |
| `GET /servidores/:id` | `controllers/partesController.ts:90-92` |
| `POST /alertas/:id/reconhecer` | `controllers/operacaoController.ts:16-18` |
| Importações (`create`/`get`/`aplicar`) | `services/operacaoService.ts:18-22` |

**Correção estrutural:** não espalhar `if` pelos controllers. `services/exportService.ts:174-179` já implementa o padrão certo (`assertContractInScope`) — promover para `lib/` e chamar no service antes de qualquer operação por ID. Depois tornar `getOrgaoScope` fail-closed para papéis não-ADMIN sem `orgaoId`.

> **Resolvido na onda 2** (`lib/scope.ts`). O escopo passou a valer em todo acesso por ID de contrato e nos recursos aninhados; `getOrgaoScope` é fail-closed; a migration `20260826100000_usuario_orgao_backfill` vincula usuários órfãos. Continua **em aberto**: importações e KPIs agregados do dashboard — ambos precisam de decisão de produto (a `Importacao` não tem órgão no modelo, e as views analíticas agregam todos os órgãos).

### 1.5 Criação em órgão alheio

`services/contratoService.ts:203-217` + `repositories/contratoRepository.ts:250-256` aceitam qualquer `unidadeGestoraId` válido. O mesmo vale para `servidorRepository.create` (`orgaoId` livre do body).

**Correção:** para não-ADMIN, forçar `unidadeGestoraId === user.orgaoId` (ou subunidade filha).

> **Resolvido na onda 2** para contratos (`assertUnidadeGestoraInScope`, que aceita o órgão ou uma unidade organizacional dele). `servidorRepository.create` continua aceitando `orgaoId` livre do body.

---

## 2. P1 — Endurecimento HTTP

> **Resolvido na onda 3** (`middleware/security.ts`). Detalhes de decisão ao final da seção.

Nenhum destes middlewares existe em `apps/api/src/index.ts`:

| Faltante | Risco |
|---|---|
| `helmet` | clickjacking, MIME sniffing, sem HSTS |
| CORS configurado | origens não controladas |
| Rate limit | brute force em `/auth/login` (senha mínima de 6 chars, sem lockout) |
| `compression` | payloads JSON grandes sem gzip |
| `trust proxy` | IP incorreto atrás de proxy (invalida rate limit futuro) |
| Timeout de request | requisições penduradas |

**Outros pontos da superfície HTTP:**

- `middleware/auth.ts:59-63` — rotas públicas casadas por **regex de sufixo** (`/\/health(\/|$)/`). Qualquer caminho contendo um segmento `health` dispensa autenticação. Hoje nenhum desses caminhos serve dados reais, mas a allowlist deveria ser exata, não por padrão. Match também é case-sensitive.
- `index.ts:78-79` — `/metrics` e `/docs` públicos mesmo com `AUTH_REQUIRED=1`: expõem latências por rota e a superfície OpenAPI completa.
- `index.ts:72-75` — `/health/db` devolve `err.message` cru do Prisma no 503.
- `lib/errors.ts:111` — log de erro 500 inclui `String(err)` completo.
- `index.ts:40-42` — `authenticate` roda **antes** de `requestContextMiddleware` e `observabilityMiddleware`; requisições rejeitadas com 401 não entram em métricas nem em logs de acesso.
- `lib/emailDomain.ts:43` — allowlist de domínio de e-mail **fail-open** quando o domínio não foi semeado.
- `routes/operacao.ts:19-20` — `GET /alertas` e `/alertas/configs` sem `requireMinRole`: VISITANTE lê.
- `services/exportService.ts:37-40` — `csvEscape` trata aspas e vírgulas mas não neutraliza células iniciadas em `=`, `+`, `-`, `@` (CSV injection ao abrir no Excel).
- `controllers/catalogoController.ts:44-46` — spread de `req.body` antes do Zod permite sobrescrever `categoriaItemId` da rota.
- `lib/jwt.ts:25-28,56-76` — `scryptSync` sem parâmetros explícitos e **síncrono** (bloqueia o event loop no login); `alg` do header não é validado; TTL de 12h sem revogação. Mitigado por `auth.ts:93-94` recarregar o usuário do banco, ignorando `role`/`orgaoId` do payload.
- `packages/db/package.json` — Prisma travado em **4.16.2** (2023).

### Resultado da onda 3

Aplicado: helmet, compression, CORS por allowlist (`CORS_ORIGINS`; vazio mantém o comportamento atual de não emitir header), `trust proxy` opt-in, rate limit de login, timeout de requisição, allowlist exata de rotas públicas, `/metrics` e `/docs` sob ADMIN, `/health/db` sem detalhe do Prisma, log de 500 sem `String(err)` em produção, CSV com neutralização de fórmula, e observabilidade antes da autenticação (401 agora entra em métrica e log).

Duas decisões que divergem do texto original da vistoria:

- **Rate limit não é global.** Um teto por IP derrubaria uma rede com NAT — cenário comum em órgão público. Ficou só no login, com chave IP+e-mail e contando apenas tentativa falha.
- **`requireMinRole` em `/alertas` não foi aplicado.** `GET /contracts` e `GET /contracts/:id` também não têm gate de papel: leitura é liberada a qualquer autenticado e restringida por órgão. Colocar gate só em alertas seria incoerente; se leitura deve exigir papel mínimo, é uma mudança de produto para toda a API.

Continua **em aberto** nesta seção: `emailDomain` segue fail-open quando não há allowlist configurada (travar deixaria implantação nova sem login; agora emite aviso em produção), `scryptSync` síncrono no login, `alg` do JWT não validado, TTL de 12h sem revogação, spread de `req.body` em `catalogoController`, e o upgrade do Prisma.

---

## 3. P1 — Performance

### 3.1 Gargalo dominante: listagem de contratos

`repositories/contratoRepository.ts:144-149` faz `findMany` **sem paginação**, com `contractInclude` (`:14-51`) que puxa o grafo completo: alterações, itens → catálogo → categoria, responsáveis → servidor inteiro, rateios e quatro domínios com `true`.

`services/exportService.ts:193-195` reaproveita **a mesma** chamada, e `:150-171` monta o XLSX inteiro em memória.

**Correção:** separar `listInclude` (enxuto, com `select` explícito) de `detailInclude`; aplicar o `parsePagination` que já existe (`lib/pagination.ts`, teto `MAX_PAGE_SIZE=100`); query dedicada com projeção mínima para export.

### 3.2 Endpoints mais caros

| # | Endpoint | Motivo |
|---|---|---|
| 1 | `GET /contracts` | grafo completo, sem paginação |
| 2 | `GET /exports/contratos.csv` \| `.xlsx` | mesma carga + serialização em memória |
| 3 | `GET /lookups` | reconstrói todo o dicionário por request |
| 4 | `POST /admin/refresh-analytics` | 14× `REFRESH MV CONCURRENTLY` sequencial, sem mutex |
| 5 | `POST /admin/gerar-alertas` | queries em views + N upserts sequenciais |
| 6 | `?flat=true` em fornecedores/servidores/catálogo | full table scan |
| 7 | `GET /orgaos/arvore` | todos os órgãos + unidades |
| 8 | `GET /importacoes/:id` | lote + todas as linhas |

### 3.3 Paginação — cobertura

`lib/pagination.ts` (default 25, máx. 100) é usado em 5 repositories. **Não** é usado em: `GET /contracts`, `GET /lookups`, `GET /alertas`, `/references/fornecedores`, `/dotacoes`, `/orgaos`, `/unidades`, `/dominios` e em todo `?flat=true`. A função `paginate()` (`:37-46`) está definida e nunca é chamada.

### 3.4 Custo por operação Prisma

`lib/prisma.ts:18-34` — o middleware `$use` de audit GUC dispara um `$executeRawUnsafe` com `set_config` **antes de cada operação ORM**, praticamente dobrando os round-trips. Impacto pior em loops de escrita.

**Correção:** aplicar o GUC uma vez por transação/request via `$transaction` interativa, em vez de por operação.

### 3.5 N+1 e transações

| Local | Problema |
|---|---|
| `alertaRepository.ts:90-125` | `findUnique` + `update`/`create` por candidato, **sem transação** — estado parcial em caso de falha |
| `contratoRepository.ts:401-424` | `findUnique` de catálogo por item dentro do loop |
| `importacaoRepository.ts:430-462` | lote inteiro em **uma** transação — locks prolongados |
| `importacaoRepository.ts:354-364` | validação linha a linha, sequencial |
| `contratoService.ts:225-243` | `update` faz `findByIdBare` + `findById` completo depois |

### 3.6 Índices ausentes

Colunas usadas em filtro/ordenação sem índice: `Contrato.createdAt` (é o `orderBy` padrão da listagem), `Contrato.dataAssinatura`, `Contrato.garantiaValidade`, `Servidor.ativo`, `Alerta.reconhecidoEm`, além das FKs `Contrato.processoId`, `Servidor.unidadeId` e `Fornecedor.municipioId`.

Não há índices redundantes no estado final do schema.

### 3.7 Cache HTTP

`GET /dashboard/*` e `GET /lookups` têm ETag e 304, mas em ambos o **payload é construído antes** da comparação — o banco é consultado de qualquer forma. `GET /lookups` é o único com `Cache-Control` (`public, max-age=60`). Listagens (`/contracts`, `/fornecedores`, `/lookups/:slug`, `/orgaos/arvore`) não têm nada.

---

## 4. P2 — Qualidade, acoplamento e redundância

### 4.1 Violações de camada

| Local | Problema | Severidade |
|---|---|---|
| `routes/exports.ts:35-104` | busca global inteira (Prisma + queries `OR` + formatação) dentro do arquivo de rota | Alta |
| `repositories/contratoRepository.ts` | 554 linhas: resolução de FK, regras de negócio, compat legado FSP, conversão de aditivos | Alta |
| `repositories/orcamentoRepository.ts:321-408` | 6 mapeadores de DTO exportados, com o service apenas repassando | Alta |
| `routes/exports.ts:16-135` | handlers HTTP definidos no router, sem controller | Média |
| `services/{alteracao,orcamento,dashboard}Service.ts` | `getPrisma()` direto em `ensureContrato` | Média |
| 10+ repositories | lançam `notFound`/`badRequest` (semântica HTTP na persistência) | Média |
| `controllers/lookupsController.ts:66-106` | handlers de **organização** morando no controller de lookups | Média |

`getPrisma()` aparece fora de repositories em 8 pontos: `middleware/auth.ts:22`, `index.ts:67`, `routes/exports.ts:39`, `lib/audit.ts:28`, `lib/emailDomain.ts:38`, `services/dashboardService.ts:6`, `services/alteracaoService.ts:79`, `services/orcamentoService.ts:23`.

Nenhum import circular. Nenhum service faz `res.json`.

### 4.2 Tipagem

**30 usos explícitos de `any`**, concentrados em mapeadores:

| Arquivo | Ocorrências |
|---|---|
| `services/contratoService.ts` | 10 — `mapContractRecord(record: any)`, o pior ponto do backend |
| `repositories/orcamentoRepository.ts` | 6 |
| `services/orcamentoService.ts` | 6 |
| `services/alteracaoService.ts` | 5 |
| `lib/zodToJsonSchema.ts` | 2 (introspeção Zod, justificável) |
| `repositories/catalogoRepository.ts` | 1 |

### 4.3 Redundâncias

- **Endpoint duplicado:** `/references/fornecedores` (`routes/references.ts:26-30`) e `/fornecedores` (`routes/partes.ts:26-30`) servem o mesmo repository; a versão legada **perde o audit wrapper** (`referenciaRepository.ts:72-84`).
- **`ensureContrato` triplicado:** `orcamentoService.ts:22-25`, `dashboardService.ts:5-8`, `alteracaoService.ts:78-82`.
- **Conversão centavos→reais em 4 arquivos:** `contratoService`, `alteracaoService`, `orcamentoRepository`, `catalogoRepository`.
- **Aliases legados de aditivo em 3 lugares:** `contratoService.ts:175-183`, `alteracaoService.ts:55-59`, `contratoRepository.ts:447-471`.
- **`resolveDominioValorId` em 2 implementações:** `orcamentoRepository.ts:12-24`, `importacaoRepository.ts:15-28`.
- **Filtro de busca fornecedor/servidor** replicado em `fornecedorRepository`, `servidorRepository` e `routes/exports.ts:61-80`.
- **Mapeador de item de contrato** duplicado entre `contratoService.ts:136-157` e `catalogoRepository.ts:29-39`.

### 4.4 Código morto

| Local | Item |
|---|---|
| `middleware/rbac.ts:6-14` | `requireRole` exportado, nunca usado |
| `routes/alteracoes.ts:29` | `export default` não importado |
| `repositories/fornecedorRepository.ts:19-21` | `mapFornecedor` é função identidade |
| `lib/pagination.ts:37-46` | `paginate()` nunca chamada |

Não há `TODO`, `FIXME` nem `@deprecated` em `apps/api/src`. Os comentários "legado" são todos de compatibilidade intencional.

### 4.5 RBAC inconsistente entre módulos

Papel mínimo para escrita varia sem critério documentado em recursos equivalentes:

| Router | Mínimo |
|---|---|
| `lookups.ts:16` (domínios) | ADMIN |
| `organizacao.ts:21`, `alteracoes.ts:14` | GESTOR |
| `contracts`, `partes`, `references`, `orcamento`, `catalogo`, `operacao` | ANALISTA |
| `auth.ts:18-21` (usuários) | ADMIN |

### 4.6 Outros

- **Validação Zod dividida:** alguns módulos validam no controller (`contracts`, `alteracoes`, `orcamento`), outros no service (`referencia`, `partes`, `catalogo`, `orgao`, `auth`, `dominio`). `referenceController.ts:8-9,27` passa `req.body` cru adiante.
- **Payload inflado:** o DTO de contrato devolve alterações duas vezes (`alteracoes` + alias `aditivos`) e valores em centavos **e** em reais.
- **`index.ts:82-83`** monta a API duas vezes (`/api/v1` e `/.netlify/functions/api`), dobrando o registro de rotas.
- **Nomenclatura mista PT/EN:** `contratoService` vs `contractsController` vs rota `/contracts`.
- **`lib/`** concentra 14 utilitários heterogêneos (erros HTTP, Prisma, audit, OpenAPI, paginação, JWT, métricas, observabilidade) sem subpastas.

---

## 5. Ordem de remediação sugerida

| Onda | Conteúdo | Justificativa |
|---|---|---|
| ~~**1**~~ | ~~Guarda `VITEST` nos tokens sintéticos; `DEV_BYPASS` fail-closed; fail-fast de `JWT_SECRET`/`DATABASE_URL`~~ | **Concluída.** |
| ~~**2**~~ | ~~`assertContratoInScope` em `lib/`; escopo em todos os acessos por ID; `getOrgaoScope` fail-closed; amarrar `unidadeGestoraId` na criação~~ | **Concluída**, menos importações e KPIs agregados (decisão de produto). |
| ~~**3**~~ | ~~helmet, CORS, rate limit no login, `trust proxy`, compression; fechar `/metrics` e `/docs`; sanitizar `/health/db`; anti-injection no CSV~~ | **Concluída.** `requireMinRole` em `/alertas` descartado por incoerência com as demais leituras. |
| **4** | `listInclude` vs `detailInclude`; paginar `/contracts`; export com projeção dedicada; GUC por transação; índices faltantes | Performance; exige atenção ao contrato de resposta consumido pelo front. |
| **5** | Extrair busca global para service; quebrar `contratoRepository`; mover mappers para service e tipar (eliminar `any`); unificar `ensureContrato` e conversão de centavos; remover código morto | Dívida técnica; sem urgência, alto ganho de manutenção. |
| **6** | Upgrade Prisma 4 → versão atual | Precisa de janela e regressão completa. |

**Regra herdada dos planos anteriores:** nenhuma onda fecha com `npm run api:test` ou `npm run web:e2e` vermelho.
