# Plano de Implementação — Sistema Hub de Inteligência Contratual (SESP/PR)

**Objetivo:** Construir um sistema moderno e robusto para gestão e monitoramento contratual. Stack escolhida: **Frontend React (SPA)** hospedado em **Netlify**, **Backend** REST via **Netlify Functions**, **DB**: **Supabase Postgres** (managed). O foco é segurança, auditabilidade, performance e experiência do colaborador.

---

## 1) Resumo Executivo
- **Stack principal:** React 19+ + TypeScript + Tailwind v4.1 + Lucid React (Design System) (frontend) • REST API (Node, Netlify Functions) • Prisma ORM • Postgres (Supabase) • Supabase Storage (anexos) • Zod (validação runtime) • Storybook, Vitest, Playwright for QA.
- **Papeis:** **Admin** (dashboards & insights) e **Colaborador** (inserção/edição via formulários). RBAC e audit logs obrigatórios.

---

## 2) Arquitetura (alto nível)
```
[ Netlify (React SPA) ]         UI (dumb components + hooks)
           |
      HTTPS / REST
           |
[ Netlify Functions (Node) ]   Controllers -> Services -> Repositories
           |
      Prisma (Postgres)
           |
[ Supabase Postgres + Storage ] (managed DB + files)

Observability: Sentry, Prometheus-style metrics or provider, backups automatizados
```

- **Rationale:** Netlify + Netlify Functions permite deploys simples do frontend e endpoints serverless que encapsulam regras, validações e RBAC (recomendado para controle e conformidade). Supabase fornece Postgres gerenciado e Storage integrado para anexos.

---

## 3) Estrutura de Repositório (sugestão — leve monorepo)
```
/ (repo root)
  /apps
    /web         -> React SPA (create-vite / pnpm + TS)
    /api         -> Netlify Functions (Node + Express or small framework)
  /packages
    /ui          -> Design system (Lucid wrappers, Tailwind tokens)
    /schema      -> Zod schemas + shared TS types (consumido por web + api)
    /db          -> prisma schema & migrations
  /scripts       -> migration, import scripts (google sheets -> db)
  /infra         -> terraform / supabase configs / env examples
  README.md
```
- Benefício: separação clara entre UI, regras de negócio e schema/ types compartilhados.

---

## 4) Adaptação do `index.html` (workflow)
1. **Mapear** o HTML existente em componentes: Header, Sidebar, DashboardLayout, Cards, Tables, Forms, Footer.  
2. **Criar componentes** em `packages/ui` com tokens de estilo (cores, espaçamento, tipografia).  
3. **Implementar pages** em `apps/web/src/pages/*` replicando layout original, mantendo identidade visual (cores & espaçamentos).  
4. **Migrar scripts** (se houver JS inline) para hooks e utilitários: `useFleetMap`, `useContractsFilters`, `useAditivosAlerts`.
5. **Testes visuais**: Storybook stories por componente e snapshots visuais (Chromatic / Percy opcional).

Checklist rápido para adaptação do front:
- [ ] Mapear blocos do `index.html` para componentes
- [ ] Criar tokens e classes `CSS-Para-Humanos` (como padrão do projeto)
- [ ] Priorizar componentes reusáveis (Card, Table, Modal, FormField, Select)
- [ ] Implementar stories e tests básicos

---

## Router & Routes (frontend)
- **Stack update:** incluir **React Router v6** para roteamento client-side e **TanStack Query (React Query)** para fetching/caching dos dados. Mantemos **React 19+**, **TypeScript**, **Tailwind v4.1**, **Lucid React**, **React Hook Form** e **Zod**.
- **Guards & RBAC:** proteger rotas via route-guards (hooks `useAuth`, `useRole`) e redirecionamentos do cliente; todas operações sensíveis passam por API server-side para segurança.
- **Lazy loading & Code-splitting:** usar `React.lazy` + dynamic imports nas rotas pesadas (mapas, relatórios) para otimizar performance inicial.

Exemplo de árvore de rotas (ASCII):
```
/ (Dashboard)                       -> DashboardLayout
├─ /contracts                       -> ContractsList
│   ├─ /contracts/new               -> ContractForm (wizard)
│   ├─ /contracts/:id               -> ContractDetail
│   │   └─ /contracts/:id/aditivos  -> AditivosList / AddAditivo
│   └─ /contracts/import            -> ContractsImport (CSV dry-run)
├─ /reports                         -> Reports (Viaturômetro, Saúde Contratual)
├─ /admin                           -> AdminLayout (role: admin)
│   ├─ /admin/users                 -> UsersManagement
│   └─ /admin/settings              -> AppSettings
├─ /auth/login                      -> Login
├─ /profile                         -> Profile
└─ /help                            -> Help / Docs
```
- **Routing patterns:** use nested routes for layout composition (DashboardLayout, AdminLayout), data loading via React Query in route-level hooks (e.g., `useContractsQuery`) and optimistic updates for create/edit flows.

Checklist de rotas & UX:
- [ ] Definir rotas principais e proteções RBAC
- [ ] Implementar lazy-loaded route modules para mapas e relatórios
- [ ] Criar hooks de dados (`useContracts`, `useContract`, `useAditivos`) usando React Query
- [ ] Implementar feedbacks de carregamento e erros por rota

---

## 5) Esquema de Banco (Postgres — versão resumida)
- Regras gerais: **surrogate PK** (`id` UUID) para principais tabelas + campos naturais com `UNIQUE` (ex.: `protocolo_cabeca`, `num_gms`+`ano_gms`).  
- Valores monetários: **INTEGER (centavos)** — ex.: `valor_anual_cents INT`  
- Datas: **DATE** para vigência (`data_inicio`, `data_fim`), timestamps UTC (`created_at timestamptz`, `updated_at timestamptz`).  
- Integridade: FK, CHECKs, UNIQUE, triggers para auditoria e regras (ex.: impedir gestor==fiscal).

Exemplo ER simplificado (ASCII):
```
[unidades_fsp] 1---* [contratos] *---1 [empresas]
                   |
                   *
                [aditivos]
```
Tabelas essenciais (sintético):
- unidades_fsp(id UUID PK, sigla TEXT UNIQUE, nome TEXT)
- entidades_gestoras(id UUID PK, nome TEXT, cpf TEXT UNIQUE)
- municipios(id UUID PK, nome TEXT, uf TEXT)
- empresas(id UUID PK, cnpj TEXT UNIQUE, razao_social TEXT)
- contratos(id UUID PK, protocolo_cabeca TEXT UNIQUE, num_gms INT, ano_gms INT, unidade_fsp_id FK, gestor_id FK, fiscal_id FK, empresa_id FK, modalidade TEXT, objeto TEXT, valor_anual_cents INT, data_inicio DATE, data_fim_orig DATE, status TEXT, created_at timestamptz, updated_at timestamptz)
- aditivos(id UUID PK, contrato_id FK, num_aditivo INT, protocolo_adit TEXT, novo_fim_vigencia DATE, valor_adicional_cents INT, created_at timestamptz)
- audit_logs(id UUID, tabela TEXT, registro_id UUID, action TEXT, diff JSONB, changed_by UUID, changed_at timestamptz)

---


## 6) API Design (REST) — Endpoints principais
- `POST /auth/login` (se for auth custom) or use Supabase Auth + server-side session
- `GET /contracts` (filters, pagination)
- `GET /contracts/:id`
- `POST /contracts` (create with payload validated by Zod)
- `PUT /contracts/:id` (update)
- `DELETE /contracts/:id` (soft-delete with audit)
- `POST /contracts/import` (CSV import / dry-run)
- `POST /contracts/:id/aditivos` (add aditivo)
- `GET /reports/*` (aggregates for dashboard)

Recomendações: usar controllers → services → repositories pattern. Validar payloads com Zod and run final server-side constraints within DB transaction.

---

## 7) Auth & RBAC
- MVP: **Supabase Auth** for user accounts; server-side middleware to enforce roles (admin / colaborador) and map `sub` -> internal user.  
- Produção: integrar SSO/IdP (SAML/OIDC) se requisitado pelo órgão.  
- Policies: críticas (delete/update) só via backend endpoints; não expor regras sensíveis no client.

---

## 8) Testes, CI/CD & Deploy
- Frontend: Netlify (build previews), Storybook deploy, E2E Playwright on PRs.  
- API: GitHub Actions run lint → typecheck → unit tests → integration tests; deploy via Netlify Functions or container (Render) depending on needs.  
- Backups: snapshots diários do Supabase (configurar retenção e testes de restore).

---

## 9) Checklist de Implementação (priorizada)

### Phase 1: Foundation (✅ CONCLUÍDO)
1. [x] Scaffold monorepo: `apps/web`, `apps/api`, `packages/ui`, `packages/schema`, `db`.
2. [x] Criar Prisma schema inicial (Postgres) com migrations e seeds.
   - Gerado: 8 tabelas (UnidadeFsp, EntidadeGestora, Municipio, Empresa, Contrato, Aditivo, AuditLog, User)
   - Migrations aplicadas: init.sql + post.sql + source_field.sql + uuid_defaults.sql
   - Seed data: 3 unidades, 1 empresa, 1 contrato de exemplo, 1 aditivo, 2 audit logs
3. [x] Implementar pacote `packages/schema` com Zod schemas + TS types.
4. [x] Scaffold frontend (React + Vite + Tailwind + Lucid) e design system mínimo.
5. [x] Sincronizar Supabase: todas as tabelas, triggers, índices, extensões live em staging.

### Phase 2: API CRUD Core (🔄 EM PROGRESSO)
6. [ ] Implementar CRUD completo (`/contracts`) na API com validações e testes.
   - [x] POST /contracts (criar contrato com validação Zod)
   - [ ] GET /contracts (listar com filters, pagination, search)
   - [ ] GET /contracts/:id (detalhe + aditivos relacionados)
   - [ ] PUT /contracts/:id (atualizar com validação e audit)
   - [ ] DELETE /contracts/:id (soft-delete com audit)
   - [ ] POST /contracts/import (CSV bulk import com dry-run)
7. [ ] Implementar autenticação real: Supabase JWT verification no middleware `apps/api/src/middleware/auth.ts`
8. [ ] Testes unitários e integração para endpoints (Vitest + Supertest)

### Phase 3: Frontend Integration (⏳ PRÓXIMO)
9. [ ] Integrar React Query hooks com API endpoints (useContracts, useContract, useCreateContract, etc)
10. [ ] Implementar Form de criação (typeahead lookups, tabs, keyboard shortcuts, autosave rascunho).
11. [ ] Implementar ContractsList com paginação, filtros e busca.
12. [ ] Implementar ContractDetail com edição inline e aditivos management.
13. [ ] Testes E2E com Playwright para fluxos de criação e edição.

### Phase 4: Advanced Features (⏳ FUTURO)
14. [ ] Implementar upload/anexos (Supabase Storage) e linkagem ao DB.
15. [ ] Criar scripts de migração das planilhas e rodar validação em staging.
16. [ ] Criar Dashboard MVP (Viaturômetro, Saúde Contratual) com queries otimizadas.
17. [ ] Implementar relatórios exportáveis (PDF, CSV).
18. [ ] Integrar SSO/OIDC (se requisitado).

### Phase 5: QA & Deploy (⏳ FUTURO)
19. [ ] Tests (unit, integration, E2E) e a11y checks; integrar CI com GitHub Actions.
20. [ ] Deploy em staging e validar migração de dados.
21. [ ] Documentação (README, runbooks, run migration steps) e treinamento colaboradores.

---

## 10) Dívidas Técnicas & Notas de Implementação

### Constraints & Limitações Conhecidas
- **Prisma v4 fixed**: Pinned a `^4.16.2` para evitar breaking changes do v7 (datasource { url = env(...) }). Não atualizar sem revisão completa.
- **UUID generation**: Inicial (`init.sql`) não incluía `DEFAULT gen_random_uuid()` nos IDs. **Workaround**: migration `00000000000003_fix_uuid_defaults.sql` adicionou defaults. Futuras tabelas precisam ter UUID explicit no SQL.
- **PgBouncer connection pooling**: Supabase usa transaction-mode pooler na porta 6543. Migrations devem rodar na porta 5432 (DIRECT_URL). Aplicação usa DATABASE_URL (pooled).
- **ts-node warning**: Seed script gera warning sobre module type. Fix: adicionar `"type": "module"` em `packages/db/package.json` (opcional para MVP).

### Testing & Auth Gap
- **Auth middleware placeholder**: `apps/api/src/middleware/auth.ts` usa demo tokens ('admin'/'colaborador'). **TODO**: implementar Supabase JWT verify real.
- **No E2E tests yet**: Playwright tests precisam ser criados para flows de contrato (criar, editar, deletar, import CSV).
- **Missing error handling**: Frontend não tem tratamento robusto de erros HTTP (retry, toast notifications, etc).

### API Completeness
- **Only POST /contracts**: Endpoints GET, PUT, DELETE faltam. Precisam de validação, RBAC checks, e audit logging.
- **CSV import untested**: Script de import sheets precisa ser validado em staging com dados reais.
- **Report endpoints missing**: `/reports/viaturometro`, `/reports/saude-contratual` ainda não existem.

### Frontend Polish
- **Mock API calls**: ContractsList e ContractForm chamam axios para endpoints, mas logic de erro/loading é minimal.
- **Design system incomplete**: Componentes Lucid React usados mas não há Storybook stories.
- **No optimistic updates**: React Query queries não têm optimistic mutation handling.
- **Missing a11y**: Nenhum teste com axe-core ainda.

### DevOps & Deployment
- **No CI/CD pipeline**: GitHub Actions workflow não está configurado (lint, test, build, deploy).
- **Netlify Functions untested**: API roda com Express localmente; deployment em Netlify Functions não foi validado.
- **No monitoring**: Sentry ou similar não está integrado.

---

## 11) Próximos Passos Imediatos (Próxima Sessão)

### Curto Prazo (Semana 1)
1. **Implementar endpoints GET /contracts e GET /contracts/:id**
   - Usar Prisma queries com includes (Aditivo, EntidadeGestora, Empresa)
   - Adicionar paginação e filtros (status, data_inicio, unidade, empresa)
   - Testes com Vitest + Supertest

2. **Implementar Supabase JWT auth real**
   - Substituir placeholder em `apps/api/src/middleware/auth.ts` com `@supabase/supabase-js` + JWT verify
   - Testar login flow completo (Supabase UI ou custom form)
   - Validar RBAC no middleware

3. **Ligar frontend com API**
   - Criar hooks React Query: `useContracts()`, `useContract(id)`, `useCreateContract()`, etc
   - Telas ContractsList e ContractForm chamar API real
   - Implementar error/loading states com toast notifications (usar `react-hot-toast` ou similar)

### Médio Prazo (Semana 2)
4. **Implementar PUT e DELETE endpoints**
   - Validar autorização (só admin/gestor pode editar)
   - Atualizar audit logs com campo `source` ("web:form", "api:import", etc)
   - Soft-delete com flag `deleted_at`

5. **Criar dashboard MVP**
   - Query `view_consolidada` para listar contratos e aditivos
   - Cards mostrando: total de contratos, valor total, vencimentos próximos
   - Gráficos básicos (Recharts): distribuição por modalidade, por unidade

6. **Implementar import CSV**
   - Endpoint POST /contracts/import com dry-run
   - Validar rows com Zod antes de inserir
   - Retornar relatório de erros/sucesso

### Testes & CI
7. **GitHub Actions CI setup**
   - Lint (ESLint) + typecheck (tsc) + test (Vitest)
   - Run on PRs e main branch
   - Opcional: Playwright E2E em staging

8. **Testes de aceitação**
   - Validar migração de dados real (se houver planilhas para importar)
   - Testar RBAC: admin vê tudo, colaborador vê só seus contratos
   - Verificar audit logs registram todas mudanças

### Critério de Aceitação para Milestone 1
- ✅ Todos endpoints CRUD funcionando (GET, POST, PUT, DELETE)
- ✅ Auth com Supabase JWT live
- ✅ Frontend lê/escreve dados via API
- ✅ Dashboard MVP mostra overview de contratos
- ✅ Audit logs registram todas operações (who/what/when)
- ✅ Testes unitários + integração cobrindo 70% da lógica
- ✅ Nenhuma dívida crítica bloqueando deploy em staging

---

## 12) Critérios de Aceitação Final (MVP)
- Deploy em staging funcional com login, CRUD contratos, import CSV e Dashboard MVP.
- Migração das planilhas testada com <1% inconsistências manuais.
- RBAC e audit logs funcionando (todas as mudanças têm registro de `who/when/what`).

---

## 13) Comandos Úteis (Referência Rápida)

```bash
# Database
npm run db:generate          # Gerar Prisma Client
npm run db:migrate:deploy    # Aplicar migrations em produção
npm run db:seed             # Executar seed com Prisma

# API
npm run api:dev             # Rodar servidor Express localmente
npm run api:test            # Rodar testes Vitest

# Web
npm run web:dev             # Rodar Vite dev server
npm run web:build           # Build para produção
npm run web:preview         # Preview build localmente

# Root
npm run lint                # ESLint em todo workspace
npm run type-check          # TypeScript compilation check
```

---

> **Última atualização:** 2026-02-03 — Supabase sync completo, Phase 1 finalizada, iniciando Phase 2 (CRUD endpoints completos).
