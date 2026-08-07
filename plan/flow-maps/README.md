# Flow maps — documentos vivos

Mapas Mermaid para estudar o monorepo **painel-contratos-sesp** (Hub de Inteligência Contratual · Lei 14.133/2021).

São **documentos incrementais**: atualize quando rotas, Sidebar ou contrato HTTP mudarem. Não substituem OpenAPI (`GET /api/v1/docs`) nem os planos em `plan/`.

| # | Arquivo | Pergunta que responde |
|---|---------|------------------------|
| 1 | [01-api-recursos.md](./01-api-recursos.md) | Quais blocos a API expõe e quem pode escrever? |
| 2 | [02-frontend-sidebar.md](./02-frontend-sidebar.md) | O que cada item da Sidebar abre e que impacto tem? |
| 3 | [03-comunicacao-fe-be.md](./03-comunicacao-fe-be.md) | Como o browser fala com Postgres via Vite + Express? |

## Como ler

1. Comece pelo **#3** se você quer o “fio elétrico” (proxy, JWT, React Query).
2. Use o **#1** como mapa mental da superfície HTTP (agrupado, não endpoint a endpoint).
3. Use o **#2** para conectar UX (menu) → páginas → papéis → APIs.

## Stack (atalho)

```text
apps/web     React 18 + Vite + TanStack Query + React Router + @painel/ui
apps/api     Express 5 + Prisma + Zod (@painel/schema) + domain (@painel/domain)
packages/db  Postgres (Docker :5434) + migrations + seed
```

Bases HTTP montadas em paralelo: `/api/v1/*` e `/.netlify/functions/api/*` (mesmo app).
