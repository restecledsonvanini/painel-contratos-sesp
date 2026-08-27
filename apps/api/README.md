# API — Hub de Inteligência Contratual (SESP/PR)

Express + Prisma + Postgres local (Docker). Também exporta handler Netlify Functions via `serverless-http`.

## Pré-requisitos

- Node 20+
- Docker Desktop com Postgres do projeto

## Banco local (Docker)

```bash
docker compose -f docker/docker-compose.postgres.yml up -d
```

Credenciais (ver `.env.example`):

```
DATABASE_URL=postgresql://painel:pass@localhost:5434/painel_db
```

> O compose do projeto publica Postgres em **5434** para não conflitar com outros containers em `:5432`.

Na raiz do monorepo:

```bash
# criar .env na raiz com DATABASE_URL acima (ou exportar no shell)
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
```

## Subir a API

```bash
# na raiz
npm run api:dev

# ou
npm --workspace apps/api run dev
```

API em `http://localhost:8888`

Rotas:

- `GET /.netlify/functions/api/health`
- `/.netlify/functions/api/contracts`
- `/.netlify/functions/api/references/*`

O Vite (`apps/web`) faz proxy de `/.netlify/functions/api` → `:8888`.

## Auth

JWT via `POST /auth/login` (grava cookie HttpOnly `painel_session`; o JSON ainda devolve `token` para clientes de API). `POST /auth/logout` apaga o cookie. Em desenvolvimento/testes, tokens sintéticos:

| Header | Papel |
|---|---|
| `Authorization: Bearer admin` | ADMIN |
| `Authorization: Bearer analista` | ANALISTA |
| `Authorization: Bearer gestor` | GESTOR |
| `Authorization: Bearer visitante` | VISITANTE |

Flags: `AUTH_REQUIRED` (API) e `VITE_AUTH_REQUIRED` (web) devem casar.
## Erros

Formato uniforme:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
```

## Testes

Com Postgres Docker no ar e `DATABASE_URL` definido:

```bash
npm run api:test
```

## Prisma

Cliente gerado a partir de `packages/db/prisma/schema.prisma` (Prisma **4.16.x**). Não use Prisma 7 neste app.
