# DB (Prisma)

This folder contains the `schema.prisma` and helper scripts for migrations and seeding.

Quick notes:
- Set `DATABASE_URL` before running migrations or seeds.
- Generate the client: `npx prisma generate`
- Create a migration: `npx prisma migrate dev --name init`
- Run seed: `node dist/seed.js` (compile TS or run via `ts-node`)

Do not run migrations on production without backup and review of schema changes.
