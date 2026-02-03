# DB (Prisma)

This folder contains the `schema.prisma` and helper scripts for migrations and seeding.

Quick notes:
- Set `DATABASE_URL` before running migrations or seeds.
- Generate the client: `npx prisma generate --schema=./prisma/schema.prisma`
- Create a migration (staging): `npm run db:migrate:create` (from repo root) — this will create migration files under `packages/db/prisma/migrations` for review.
- Alternatively (no DB connection / offline), generate a SQL migration diff locally: `npx prisma migrate diff --from-empty --to-schema-datamodel=./prisma/schema.prisma --script > ./prisma/migrations/00000000000000_init.sql`
- Supplemental SQL for triggers, extensions and view is available at: `packages/db/prisma/migrations/00000000000001_post.sql` (apply this in staging via Supabase SQL editor or include in migration workflow).
- Apply migrations (production): `npm run db:migrate:deploy` (ensure DATABASE_URL is set to production DB and backups are taken).
- Run seed (use service role DB connection and run against staging first):
  - `npm --workspace packages/db run seed` (ensure `DATABASE_URL` or `DIRECT_URL` env is set to the staging DB connection).

Notes and precautions:
- Use the **service role** DATABASE_URL when running migrations and seeds (set in `.env.local` or CI secrets). Do NOT expose the service role key to the browser.
- The seed script sets session variables (`app.current_user` and `app.current_user_source`) so audit triggers record who/where changes originate from. If you want deterministic user ids for audit attribution, update the `systemUserId` in the seed script.
- Always run in a staging instance first and test before running in production.

Do not run migrations on production without backup and review of schema changes.
