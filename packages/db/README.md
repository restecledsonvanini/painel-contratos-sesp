# DB (Prisma)

Schema e migrações Prisma Migrate (v4.16.x) para Postgres local/staging.

## Bring-up local (Docker do projeto)

```bash
docker compose -f docker/docker-compose.postgres.yml up -d
# host: localhost:5434  user/pass/db: painel / pass / painel_db
```

```bash
# na raiz — defina DATABASE_URL (ver .env.example)
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
```

`DATABASE_URL` típico:

```
postgresql://painel:pass@localhost:5434/painel_db
```

## Notas

- Migrações em `prisma/migrations/` (formato Prisma). SQL legado em `prisma/migrations_legacy/`.
- Seed (`seed_supabase.ts`) é reexecutável (upsert + reset do contrato sample).
- Use a connection string de serviço/admin para migrate/seed; não exponha no browser.
- Em produção: backup antes de `migrate deploy`.
