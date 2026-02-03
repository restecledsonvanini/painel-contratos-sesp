# API (Netlify Functions) — quick notes

This folder contains example code for the API that will run as Netlify Functions or as a small Node service.

What I added as an example:
- `src/controllers/contractsController.ts` — example controller for `POST /contracts` demonstrating Zod validation + Prisma transactional writes + basic audit log.

Notes before running:
- Configure `DATABASE_URL` to point to your Supabase Postgres instance.
- Install dependencies: `pnpm install` (add `prisma`, `@prisma/client`, `express`, `zod` etc.).
- This is sample code for review; I'll add routing, auth middleware and tests after you approve the contract shapes.

Suggested next steps (ask me to run any of these):
1. Generate Prisma client: `npx prisma generate` after adding `DATABASE_URL`.
2. Create migration: `npx prisma migrate dev --name init`
3. Add auth middleware and route wiring (I can generate those files next).

Suggested one-line commit message after scaffolding the API:  
`feat(api): add contract create controller with validation and transaction`
