# 2026-08-06 — Tipagem, RBAC de usuário e higiene pós-Fase 9

Plano transversal (`packages/schema`, `packages/domain`, `apps/api`, `apps/web`).
Sucede: `plan/2026-08-05_hierarquia_sesp_navegacao_e_saneamento.md` (**Fases 0–9 concluídas**).

Escopo: fechar gaps deixados de propósito (ou descobertos) após o saneamento — **tipagem de contrato**, **papéis de acesso de ponta a ponta**, e **higiene** (aliases legados, env, OpenAPI, testes). Não reabre o modelo hierárquico nem o wizard de contrato.

---

## 0. Premissas (não regredir)

| Conquista | Proteção |
|---|---|
| Hierarquia SESP → forças → subunidades; `unidadeGestoraId` → `Orgao` | API contracts + seed |
| Navegação 5 destinos + redirects | e2e smoke |
| Export CSV/XLSX/PDF | `exports.test.ts` |
| Auth canônico `VISITANTE · ANALISTA · GESTOR · ADMIN` + allowlist | `auth.test.ts` |
| DTOs iniciais em `@painel/schema` + `createCrudHooks` / `invalidate.ts` | build web |
| Import CSV transacional (`dotacao`/`unidade`) | `operacao.test.ts` |

**Regra:** nenhuma fase fecha com `npm run api:test` ou `npm run web:e2e` vermelho. Em Windows, parar `api:dev` antes de `prisma generate`.

**Fora de escopo:**
- Refatorar `ContractForm` (821 linhas) além do estritamente necessário para tipagem de writes.
- `makeCrudService` na API (fase opcional / última).
- Relatório PDF completo (ficha de 1 página já entregue).
- Convenção `index.type.ts` / pasta `customTypes/` — rejeitada; contrato continua em `@painel/schema`.

---

## 1. Diagnóstico

### 1.1 Tipagem — o que está certo vs incompleto

A arquitetura-alvo pós-Fase 9:

| Camada | Pacote / local | Conteúdo |
|---|---|---|
| Resposta da API | `packages/schema/src/dto.ts` | `*DTO` |
| Entrada validada | `packages/schema/src/*.ts` | `*CreateSchema` / `*UpdateSchema` → `z.infer` |
| Vocabulário | `packages/domain` | enums, labels, `ROLE_RANK` |
| UI-only | pages | `FormValues` **só** quando ≠ payload |

**Gaps:**

| Sintoma | Evidência |
|---|---|
| DTOs de resposta faltando | `Usuario`, `Alerta`, `CatalogoItem`, `Dominio`/`DominioValor`, `Simulacao` ainda locais nas pages |
| Writes tipados frouxo | `createCrudHooks` default `Partial<TEntity>`; `useContracts` usa `Partial<ContratoDTO>` |
| FormValues ≈ CreateInput | `UnidadeForm`, `DotacaoForm`, `ServidoresForm`, `CatalogoForm`, `FornecedoresForm` |
| Duplicata de enum | `UnidadeTempoPrazo` (`lib/prazo.ts`) vs `UnidadeTempo` (domain); `Role` em domain **e** schema |
| Árvore reinventada | `TreeNode` em `UnidadesList.tsx` vs `ArvoreOrgaoDTO` |
| Alias duplo | hooks reexportam `ContratoDTO as Contract` enquanto pages poderiam importar o DTO |
| Escape hatch | `Record<string, unknown>` em `useOrganizacao`, `UsuariosPage`, patches de contrato |

### 1.2 RBAC — modelo canônico vs realidade

Papéis (já no domínio):

| Papel | Rank | Intenção |
|---|---|---|
| `VISITANTE` | 1 | leitura |
| `ANALISTA` | 2 | cadastros / import / export / contratos |
| `GESTOR` | 3 | alterações contratuais / organograma |
| `ADMIN` | 4 | usuários, listas de domínio, segurança |

**Buracos:**

| # | Gap | Risco |
|---|---|---|
| 1 | Gates de UI usam `!token \|\| hasMinRole(...)` — sem token, **mostra** write (ok só com auth off) | Com `VITE_AUTH_REQUIRED=1` e sessão vazia inconsistente, UX mentirosa; Config › Usuários/Segurança aparece para anônimo |
| 2 | Listas de cadastro (`FornecedoresList`, `ServidoresList`, `CatalogoList`, `DotacoesList`) **sempre** mostram Novo/Editar/Excluir | VISITANTE vê botões; 403 só na rota |
| 3 | API ainda declara `requireMinRole('COLABORADOR')` em várias rotas | Funciona via alias, mas documenta legado; alvo é `ANALISTA` |
| 4 | Front exige **GESTOR** para `/unidades`; API permite **ANALISTA** (`organizacao.ts`) | Escalação / inconsistência de política |
| 5 | `POST/GET` exports e search: UI gate ANALISTA; API **sem** `requireMinRole` | Vazamento se token VISITANTE |
| 6 | Dashboard controllers **sem** `getOrgaoScope` | KPIs cross-órgão para não-ADMIN |
| 7 | `SegurancaPage` faz `PATCH`; API só tem `PUT /dominios/:slug/valores/:id` | Toggle de domínio de e-mail **quebrado** |
| 8 | `DominiosPage` atrás de GESTOR na seção; writes API são ADMIN | GESTOR vê UI que 403 |
| 9 | `.env.example` sem `AUTH_REQUIRED`, `VITE_AUTH_REQUIRED`, `AUTH_EMAIL_DOMAINS`, `JWT_SECRET` | Deploy/dev desalinhados |
| 10 | Login ainda sugere `leitor@…`; tokens sintéticos `colaborador`/`leitor`/`fiscal` vivos | Dívida de naming |

### 1.3 Higiene residual

- Aliases de resposta ainda emitidos: `empresaId`, `empresaName`, `unidadeFspId`, `cnpj` (plano §7 ordem front→API→schema **incompleta**).
- Endpoints mortos ainda montados: `/references/empresas`, `/servicos`, `/entidades-gestoras` (pages web já apagadas).
- OpenAPI cobre fatia fina; texto de segurança cita tokens legados.
- `toLocaleString` currency restante em `ContractForm` / `DevUi`.
- Matriz de testes de papel incompleta (só VISITANTE create + ADMIN usuarios).
- e2e sem navegação gated por role.

---

## 2. Decisões de tipagem (travadas neste plano)

1. **Contrato compartilhado = `@painel/schema`.** Sem pasta `customTypes/` e sem `index.type.ts` por componente para entidades de API.
2. **FormValues** ficam na page **apenas** quando o formulário ≠ payload (ex.: contato embutido no create de fornecedor, strings vazias para selects). Caso 1:1 → usar `*CreateInput` / `Pick` / `z.input`.
3. **Writes** tipam com `*CreateInput` / `*UpdateInput`, nunca `Partial<*DTO>`.
4. **Um nome por tipo:** preferir importar `XxxDTO` do schema; aliases nos hooks (`as Contract`) podem permanecer **ou** ser removidos numa fase — não crescer um terceiro nome.
5. **`Role` canônico** vive em `@painel/domain`; schema reexporta / valida com Zod apontando para o mesmo conjunto (eliminar `type Role` paralelo em `auth.ts` se divergir).
6. **Níveis de unidade:** lista única (`NivelUnidade`) — já decidido na Fase 9; não reabrir por força neste plano.

---

## 3. Matriz de papéis (alvo)

Política única front+API. Células = papel **mínimo**.

| Recurso | Leitura | Escrita / ação |
|---|---|---|
| Painel / dashboard / contratos lista-detalhe | VISITANTE | — |
| Contrato create/update/delete | — | ANALISTA |
| Fornecedor / servidor / catálogo / dotação | VISITANTE | ANALISTA |
| Importação CSV / exportação | — | ANALISTA |
| Alertas reconhecer | — | ANALISTA |
| Alterações contratuais (simular/criar) | VISITANTE (ver) | GESTOR |
| Órgãos / unidades (organograma) | VISITANTE | **GESTOR** (alinhar API) |
| Domínios (valores de lista) | GESTOR (ver) | **ADMIN** |
| Usuários CRUD | — | ADMIN |
| Segurança (allowlist e-mail) | — | ADMIN |
| Admin jobs (`gerar-alertas`, `refresh-analytics`) | — | ADMIN *(elevar do ANALISTA atual)* |

**Escopo por órgão (`getOrgaoScope`):** ADMIN vê tudo; demais filtram pelo `user.orgaoId` em listagens sensíveis — **incluindo dashboard**.

**Helper de UI proposto:**

```ts
// apps/web/src/lib/access.ts
export function canAct(min: Role): boolean {
  if (!isAuthRequired()) return true; // bypass dev espelhando API
  return Boolean(token) && hasMinRole(min);
}
```

Substituir todos os `!token || hasMinRole(...)`.

---

## 4. Faseamento

Cada fase é entregável e reversível. Critério comum: API tests + e2e verdes.

| Fase | Escopo | Migration | Risco | Pronto quando |
|---|---|---|---|---|
| **0. Rede** | Baseline atual (46 API / 9 e2e); inventário de gates `!token` | — | — | Números registrados neste arquivo |
| **1. RBAC endurecido** | `canAct`; gates em listas; API `ANALISTA`/`GESTOR` canônicos; exports + search com min role; dashboard + `getOrgaoScope`; Seguranca PUT; Dominios UI ADMIN; env example; elevar jobs admin | não | **alto** | Matriz §3 respeitada; VISITANTE sem botões de write |
| **2. Usuário & papéis (produto)** | `UsuarioDTO` + AuthUser alinhado; UsuariosPage (orgao/servidor, get by id); seed `visitante@`; login hint; docs AUTH_* | não* | médio | CRUD usuário coerente; login sem “leitor” |
| **3. Tipagem — DTOs + writes** | DTOs faltantes; hooks com Create/Update; FormValues 1:1; TreeNode→ArvoreOrgaoDTO; UnidadeTempo único; apertar `createCrudHooks` | não | médio | Zero entity interface inventada em pages de cadastro |
| **4. Aliases & mortos** | Front para de ler fallbacks restantes; API para de emitir `empresa*`/`unidadeFsp*`/`cnpj`; desmontar ou marcar deprecated `/references/empresas\|servicos\|entidades-gestoras`; dropar LEGACY_ROLES após testes | não** | médio | Grep zero em front para `empresaName`/`unidadeFspId` (exceto redirects) |
| **5. Observabilidade & testes** | OpenAPI completo o suficiente; matriz auth nos testes; e2e smoke com login VISITANTE vs ANALISTA; money `formatCurrency*` no ContractForm/DevUi | não | baixo | OpenAPI lista paths principais; teste de rank cobre 4 papéis |

\* Migration só se for necessário enriquecer `Usuario` (hoje campos já existem).  
\*\* Remoção de colunas/enums legados no DB **não** entra — só de emissão JSON e aliases de string.

### Dependências

```
0 → 1 → 2
      ↘ 3 → 4 → 5
```

Fase 1 antes de 2 (segurança > UX de usuário). Fase 3 independente de 2 após 1. Fase 4 depende de 3 (UI já tipada nos nomes canônicos).

---

## 5. Detalhe das fases

### Fase 0 — Rede de proteção

- Rodar e anotar: `npm run api:test`, `npm run web:e2e`.
- Listar ocorrências de `!token || hasMinRole` (grep).
- Confirmar `AUTH_REQUIRED` / `VITE_AUTH_REQUIRED` no ambiente local (mesmo valor).

### Fase 1 — RBAC endurecido

**Web**
1. Criar `lib/access.ts` (`canAct` / `canWrite` helpers) e migrar: `ContractsList`, `ContractDetail`, `Dashboard`, `ImportacaoWizard`, `ExportacaoPage`, `AlertasList`, `UnidadesList`, `ConfiguracoesPage`, `DashboardLayout` (nav).
2. Cadastros: `canWrite` ANALISTA em Fornecedores/Servidores/Catalogo/Dotacoes lists (esconder ações).
3. `DominiosPage`: exigir ADMIN para mutações (espelhar API); GESTOR só leitura.
4. `SegurancaPage`: trocar `patch` → `put`.
5. Alertas: link Importação com ANALISTA (não ADMIN).

**API**
1. Trocar `requireMinRole('COLABORADOR')` → `'ANALISTA'` em: `contracts`, `partes`, `catalogo`, `orcamento`, `references`, `organizacao`, `operacao` (writes de alerta).
2. `organizacao` writes → `requireMinRole('GESTOR')` (alinhar front).
3. `exports.ts` (+ search se houver): `requireMinRole('ANALISTA')`.
4. Dashboard list handlers: passar `getOrgaoScope(req)`.
5. `POST /admin/gerar-alertas` e `refresh-analytics` → `ADMIN`.
6. Remover tokens sintéticos legados do middleware **ou** documentar como `VITEST`-only (preferência: só em `VITEST=true`).

**Ops**
- Atualizar `.env.example` com `AUTH_REQUIRED`, `VITE_AUTH_REQUIRED`, `AUTH_EMAIL_DOMAINS`, `JWT_SECRET`.
- README curto: “os dois flags devem casar”.

### Fase 2 — Usuário & papéis (produto)

1. `UsuarioDTO` (+ talvez `AuthUserDTO`) em `dto.ts`; `AuthProvider` e `UsuariosPage` consomem.
2. UsuariosPage: editar `orgaoId` / `servidorId`; usar `GET /usuarios/:id` se necessário; manter create + patch role/ativo.
3. Seed: e-mail `visitante@sesp.pr.gov.br` (manter `leitor@` como alias opcional um release, ou redirect no seed).
4. `LoginPage`: hint com `visitante@` / papéis corretos.
5. Unificar `Role` no schema para reexportar de `@painel/domain` (Zod enum = mesmos literais).
6. Documentar matriz §3 em comentário único (`packages/domain/src/roles.ts` ou README auth).

### Fase 3 — Tipagem (DTOs + writes)

1. Adicionar DTOs: `UsuarioDTO`, `AlertaDTO`, `CatalogoItemDTO`, `DominioDTO`, `DominioValorDTO`, `AlteracaoSimulacaoDTO`.
2. `createCrudHooks<TEntity, TCreate, TUpdate>` — callers passam Create/Update reais (fornecedor, servidor, unidadeFsp).
3. `useCreateContract` / `useUpdateContract` → `ContractCreateInput` / `ContractUpdateInput` (ou patch schema existente).
4. Forms 1:1: Dotacao, Unidade, Servidor, Catalogo — `useForm<CreateInput>` ou `z.infer`.
5. `UnidadesList`: usar `ArvoreOrgaoDTO`.
6. Remover `UnidadeTempoPrazo`; `prazo.ts` e `ContractForm` usam `UnidadeTempo` do domain.
7. Contato/sanção update: `FornecedorContatoUpdateInput` / `FornecedorSancaoUpdateInput` (não `Partial<Create>`).

### Fase 4 — Aliases & endpoints mortos

Ordem **obrigatória** (do plano 2026-08-05 §7):

1. Front: remover leituras restantes de `empresaName`, `empresaId`, `unidadeFspId`, `cnpj` como fonte (já parcialmente feito em lista/detalhe).
2. API: `contratoService` / `fornecedorRepository` param de emitir aliases.
3. Schema: remover campos `@deprecated` dos DTOs/Zod **depois** de (1)(2) + testes verdes.
4. Desmontar rotas alias `/references/empresas`, `/servicos`, `/entidades-gestoras` **ou** retornar 410 com mensagem; atualizar `references.test.ts`.
5. Remover `LEGACY_ROLES` / aliases `LEITOR|COLABORADOR|FISCAL` de `normalizeRole` após migrar testes e tokens Vitest.

### Fase 5 — Observabilidade & testes

1. OpenAPI: paths de partes, catálogo, dotações, órgãos/unidades, usuários, dashboard principal; security scheme com papéis canônicos.
2. `auth.test.ts`: matriz — VISITANTE 403 write; ANALISTA 201 create fornecedor; GESTOR 403 domínio write; ADMIN 200 domínio; ANALISTA 403 alteração; export 403 VISITANTE.
3. e2e: login VISITANTE → sem botão Novo contrato; login ANALISTA → botão visível (1–2 casos).
4. Substituir `toLocaleString` currency em `ContractForm` / `DevUi` por `formatCurrencyFromReais` / `formatCents`.
5. (Opcional) `makeCrudService` na API — só se sobrar capacidade; não bloqueia o plano.

---

## 6. Critérios de pronto (plano inteiro)

- [ ] Zero `!token || hasMinRole` em páginas/layout (exceto bypass explícito via `canAct` + `isAuthRequired`).
- [ ] Matriz §3 implementada e coberta por pelo menos um teste por célula crítica.
- [ ] Dashboard respeita `getOrgaoScope`.
- [ ] SegurancaPage toggle funciona (PUT).
- [ ] DTOs cobrem Usuario, Alerta, CatalogoItem, Dominio*, Simulação.
- [ ] Mutations de domínio tipadas com Create/Update Input.
- [ ] `.env.example` documenta auth.
- [ ] Front não depende de `empresa*` / `unidadeFsp*` para exibir contrato.
- [ ] `api:test` e `web:e2e` verdes.

---

## 7. Decisões

### Tomadas neste plano (2026-08-06)

| Tema | Decisão |
|---|---|
| Onde vivem tipos de API | Somente `@painel/schema` (+ enums em `@painel/domain`) |
| `index.type.ts` / `customTypes/` | **Não adotar** |
| Organograma write | GESTOR (API sobe de ANALISTA) |
| Jobs admin | ADMIN |
| Exports / search | ANALISTA mínimo na API |
| Remoção LEGACY_ROLES | Fase 4, após testes migrados |

### Em aberto (não bloqueiam Fase 1)

1. Manter `/references/unidades-fsp` como espelho read-only das forças ou deprecar junto dos outros aliases?
2. Password reset / convite de usuário — fora; só CRUD admin local.
3. Escopo órgão em **lookups** agregados — hoje global; filtrar por órgão pode ser follow-up.

---

## 8. Baseline (Fase 0 — 2026-08-06)

- Data: 2026-08-06
- Commit base: `314e28f` (`refactor: DTOs compartilhados, hooks CRUD e limpeza de tipagem`)
- Grep `!token \|\| hasMinRole`: **9** ocorrências (antes da Fase 1)
- `npm run api:test` / `web:e2e`: revalidados ao fechar Fase 1

### Fase 1 status

- [x] `lib/access.ts` (`useCanAct` / `canSeeNav`)
- [x] Gates UI migrados + listas de cadastro
- [x] API papéis canônicos; organograma GESTOR; exports ANALISTA; gerar-alertas ADMIN
- [x] `porOrgao` filtra por `getOrgaoScope` (demais MVs globais: follow-up)
- [x] Seguranca PUT; Dominios ADMIN UI; `.env.example`
- [x] Testes API verdes (46/46); e2e bloqueado neste ambiente (Playwright browser ausente no sandbox) — revalidar localmente

---

## 9. Relação com planos anteriores

| Plano | Estado |
|---|---|
| `2026-08-05_hierarquia_sesp_navegacao_e_saneamento.md` | ✅ 0–9 |
| `2026-08-04_api_refatoracao_modelo_contratual.md` | ✅ |
| `apps/web/plan/2026-08-04_frontend_refatoracao_contratual.md` | ✅ |
| **Este** (`2026-08-06_tipagem_rbac_e_higiene.md`) | 🔲 próximo |

Caminho crítico sugerido: **1 (RBAC) → 2 (usuário) → 3 (tipagem) → 4 (aliases) → 5 (testes/OpenAPI)**.
