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
1. [ ] Scaffold monorepo: `apps/web`, `apps/api`, `packages/ui`, `packages/schema`, `db`.
2. [ ] Criar Prisma schema inicial (Postgres) com migrations e seeds.
3. [ ] Implementar pacote `packages/schema` com Zod schemas + TS types.
4. [ ] Scaffold frontend (React + Vite + Tailwind + Lucid) e design system mínimo.
5. [ ] Implementar CRUD básico (`/contracts`) na API com validações e testes.
6. [ ] Implementar Form de criação (typeahead lookups, tabs, keyboard shortcuts, autosave rascunho).
7. [ ] Implementar upload/anexos (Supabase Storage) e linkagem ao DB.
8. [ ] Criar scripts de migração das planilhas e rodar validação em staging.
9. [ ] Criar Dashboard MVP (Viaturômetro, Saúde Contratual) com queries otimizadas.
10. [ ] Tests (unit, integration, E2E) e a11y checks; integrar CI.
11. [ ] Documentação (README, runbooks, run migration steps) e treinamento mínimo para colaboradores.

---

## 10) Critérios de Aceitação
- Deploy em staging funcional com login, CRUD contratos, import CSV e Dashboard MVP.
- Migração das planilhas testada com <1% inconsistências manuais.
- RBAC e audit logs funcionando (todas as mudanças têm registro de `who/when/what`).

---

## 11) Próximos passos (imediatos)
1. Confirmar provider Supabase (projeto e credenciais de dev).  
2. Eu gero: **Prisma schema** (Postgres) + **Zod DTOs** + exemplos de endpoints REST (controllers/services).
3. Decidir onde rodar API: Netlify Functions (serverless) ou Render container (long-lived). Sugestão inicial: **Netlify Functions** (já alinhado com sua preferência).  

---

> Arquivo salvo em `skills/task-plan/task.md`. Se quiser, eu gero os artefatos (Prisma schema, Zod schemas e endpoints) para revisão — quer que eu gere agora?