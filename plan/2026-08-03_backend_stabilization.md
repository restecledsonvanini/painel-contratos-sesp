# Plano de finalização do backend — estabilização

Data: 2026-08-03  
Status: implementado (2026-08-03)  
Escopo: estabilizar API + Postgres Docker local — sem expansão de domínio e sem JWT/Supabase  
Relacionado: [tech_debt_2026-08-03.md](./tech_debt_2026-08-03.md)

## Decisões travadas

- **Auth:** manter placeholder local (`Authorization: Bearer admin` | `Bearer colaborador`; sem header → `colaborador` em dev). Aplicar RBAC em todas as rotas de escrita. Documentar o contrato de headers no README da API.
- **Domínio:** não vincular Fornecedor/Serviço ao Contrato; não criar histórico de custos; não criar endpoint de timeline/saúde contratual.
- **Banco:** Postgres local via `docker/docker-compose.postgres.yml` (`painel` / `pass` / `painel_db` em **`:5434`** no host).
- **Prisma:** pin `4.16.x` em `apps/api`, alinhado a `packages/db` e root (remover drift v7).
- **Aditivos no update:** nesta fase o `PUT /contracts/:id` **não** sincroniza aditivos; apenas campos do contrato. Aditivos continuam criáveis no `POST` (payload aninhado).
- **Delete:** `onDelete: Cascade` no Prisma (`Aditivo` → `Contrato`) **e** delete transacional explícito de aditivos antes do contrato (defesa em profundidade).

## Diagnóstico: dívida técnica vs codebase

| Item em tech_debt | Realidade no código | Ação nesta fase |
|---|---|---|
| Padronizar `DATABASE_URL` / bootstrap | Contratos usam fallback; referências exigem env; README desatualizado | Cliente Prisma único + docs Docker |
| Formato de erro / middleware | 500/503/[]/404 inconsistentes; Zod só no create | Middleware + shape único |
| Completar CRUD / integridade | CRUD HTTP existe; update sem Zod; delete falha com aditivos (`ON DELETE RESTRICT`); audit só no create | Fechar buracos sem expandir domínio |
| Auth JWT/Supabase | Placeholder | Adiar; só RBAC consistente + docs |
| Testes / health / logs | Health ok; testes fracos | Testes de integração reais contra Docker |
| *(gap extra)* Migrações Prisma | SQL flat em `packages/db/prisma/migrations/*.sql` — `migrate deploy` não funciona | Baseline Prisma Migrate v4 |
| *(gap extra)* Prisma v7 em `apps/api` vs v4 em `packages/db` | Dual client / risco de API incompatível | Pin `apps/api` em `4.16.x` |

```mermaid
flowchart LR
  subgraph local [Dev local]
    Web[apps/web :5173]
    Api[apps/api :8888]
    Pg[Docker Postgres :5434]
  end
  Web -->|"proxy /.netlify/functions/api"| Api
  Api --> Pg
```

## Fase 0 — Fundação de banco e Prisma (bloqueante)

1. Alinhar `prisma` e `@prisma/client` em `apps/api/package.json` para `4.16.x`. Reinstalar deps e limpar `apps/api/node_modules/@prisma` conflitante se necessário.
2. Criar cliente único em `apps/api/src/lib/prisma.ts`, consumido por `contractsController` e `referenceController`. Exigir `DATABASE_URL`; sem fallback divergente entre controllers.
3. Corrigir `packages/db/prisma/migrations`:
   - Formato Prisma Migrate (`migration_lock.toml` + pastas `*/migration.sql`).
   - Baseline consolidada alinhada a `packages/db/prisma/schema.prisma` (Fornecedor, Servico, `AuditLog.source`, UUID defaults).
   - Segunda migration (ou step na baseline) com triggers/checks/view de `00000000000001_post.sql`, de forma idempotente (`CREATE OR REPLACE` / `IF NOT EXISTS`).
   - No schema: `Aditivo.contrato` com `onDelete: Cascade`.
4. Documentar bring-up em `apps/api/README.md`:
   - `docker compose -f docker/docker-compose.postgres.yml up -d`
   - `DATABASE_URL=postgresql://painel:pass@localhost:5434/painel_db` (ver `.env.example`)
   - `npm run db:generate` → `npm run db:migrate:deploy` → `npm run db:seed`
   - `npm run dev` em `apps/api` (porta 8888)
5. Tornar `packages/db/seed_supabase.ts` reexecutável no Docker local (upsert / limpeza do contrato sample).

**Fora de escopo nesta fase:** remover model `Municipio`; ligar Fornecedor/Servico a Contrato.

## Fase 1 — Erros, validação e camada HTTP

1. Middleware de erro em `apps/api/src/middleware/errorHandler.ts` com shape fixo:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
```

2. Em `packages/schema`:
   - `ContractUpdateSchema` (parcial, coerente com create; refine `gestorId !== fiscalId` quando ambos presentes).
   - Schemas mínimos: empresa, entidade gestora, unidade FSP, fornecedor, serviço.
3. Aplicar Zod em create e update de contratos; validar bodies das mutações de referências.
4. Remover `mockStores`, `generateId` e comentários “mocked” em `referenceController.ts` / `references.ts`.
5. DB indisponível → **503** em listagens e writes (não retornar `[]` fingindo sucesso).

## Fase 2 — Integridade de contratos e auditoria

1. `updateContract`: parse com `ContractUpdateSchema`; update tipado dos campos do contrato; **sem** sync de aditivos.
2. `deleteContract`: em transação, deletar aditivos e depois o contrato (Cascade no schema como rede de segurança); gravar `AuditLog`.
3. `AuditLog` app-level em create/update/delete de contrato; `source: 'api'`; `changedBy` a partir de `req.user.id` do stub (string — sem exigir row `User` UUID nesta fase).
4. `createContract` retorna payload via `mapContractRecord` (mesmo shape do GET).
5. Zod refine: `gestorId !== fiscalId` no create (e no update quando ambos forem enviados).

## Fase 3 — Auth placeholder + RBAC

1. Manter `apps/api/src/middleware/auth.ts` como stub; documentar no README:
   - Sem header → role `colaborador` (dev).
   - `Authorization: Bearer admin` | `Bearer colaborador`.
2. Aplicar `requireRole(['colaborador', 'admin'])` em POST/PUT/DELETE de `references` (hoje só contracts têm RBAC).
3. JWT/Supabase permanece dívida futura (atualizar nota em `tech_debt_2026-08-03.md` apontando este plano).

## Fase 4 — Testes e operação

1. Testes Vitest de integração com Postgres Docker (`DATABASE_URL` local):
   - Contratos: create (com aditivo) → get → update → delete (assert cascade).
   - Referências: create/list/update/delete de fornecedor e serviço (já cobertos parcialmente).
2. Endurecer `apps/api/test/contracts.test.ts` (hoje aceita 201/400/500).
3. Script root `api:dev` → workspace `apps/api` `dev`.
4. Health check permanece; log estruturado mínimo no error middleware (`console.error` com code/message).

## Ordem de execução

1. Fase 0 — Prisma + migrate + Cascade + seed + docs Docker  
2. Fase 1 — Erros + Zod + limpeza mock  
3. Fase 2 — Update/delete/audit de contratos  
4. Fase 3 — RBAC references + doc auth  
5. Fase 4 — Testes integração + `api:dev`

## Critério de pronto

- [x] `docker compose` + `migrate deploy` + `seed` sobe ambiente limpo.
- [x] CRUD contratos e referências com Zod e erros uniformes.
- [x] Delete de contrato com aditivos funciona.
- [x] RBAC stub em todas as mutações.
- [x] Suite de testes passa com Postgres Docker no ar.
- [x] Dívidas adiadas explícitas: JWT/Supabase; vínculos Fornecedor/Serviço; timeline/custos; Municipio; dashboard/ETL.

## Fora deste plano

Frontend (UI, responsividade, design system, cliente HTTP único) — bloco seguinte, após estabilização da API.

## Checklist de implementação

- [x] `fase0-prisma-docker` — Pin Prisma 4.16, client único, baseline migrate, Cascade Aditivo, seed idempotente, docs Docker
- [x] `fase1-erros-zod` — Middleware de erro, ContractUpdateSchema + schemas de refs, limpar mockStores
- [x] `fase2-contrato-audit` — Zod no update, delete com aditivos, audit CUD, resposta mapeada no create
- [x] `fase3-rbac` — RBAC nas mutações de references + documentar Bearer stub
- [x] `fase4-testes` — Testes integração reais + script `api:dev`

## Notas de execução (2026-08-03)

- Compose do projeto publica Postgres em **localhost:5434** (evita conflito com outros containers em `:5432`).
- `@prisma/client` fica na raiz do monorepo (não em `apps/api/node_modules`) para o generate funcionar.
- SQL legado arquivado em `packages/db/prisma/migrations_legacy/`.
- Status: **implementado**; JWT/Supabase e expansão de domínio seguem adiados.
