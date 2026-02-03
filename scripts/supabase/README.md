Supabase setup & execution notes

Overview
--------
This folder contains the SQL initialization script to create tables, triggers and basic seed data for the Hub de Inteligência Contratual. Run these steps in a *staging* Supabase project before applying to production.

Step-by-step (staging)
----------------------
1. Create a new Supabase project in your desired region.
2. Open the Supabase Dashboard > SQL Editor > New Query.
3. Paste the contents of `scripts/supabase/init_schema.sql` and run the query. Resolve any errors.
4. In the SQL Editor, verify the tables: `unidades_fsp`, `entidades_gestoras`, `empresas`, `contratos`, `aditivos`, `audit_logs` and the `view_consolidada`.
5. Run tests: insert a sample `contrato` via SQL to ensure triggers/audit works. Example:

   -- Set the current user (server-side import or function should set this before inserts)
   SELECT set_config('app.current_user', '00000000-0000-0000-0000-000000000000', true);
   SELECT set_config('app.current_user_source', 'google_sheets:sheet-ABC', true);

   INSERT INTO entidades_gestoras (nome, cpf) VALUES ('Gestor Teste', '12345678901') RETURNING id;
   INSERT INTO empresas (cnpj, razao_social) VALUES ('00000000000191', 'Empresa X') RETURNING id;

   -- Then insert contrato using the returned ids; check audit_logs afterwards.

6. If everything works in staging, repeat the script execution in production (or use migration tooling). Always back up production DB before applying schema changes.

Best practices for import scripts (Google Sheets -> DB)
------------------------------------------------------
- On each migration/import run using Prisma or Node: set the current user and source for the session so triggers record who/where changes originate from.
  Example (Prisma + raw SQL):

  // set current user for this connection / transaction
  await prisma.$executeRaw`SELECT set_config('app.current_user', ${userId}, true)`;
  await prisma.$executeRaw`SELECT set_config('app.current_user_source', ${sourceLabel}, true)`;

  // then perform your transactional inserts/updates
  await prisma.$transaction(async (tx) => {
    // create contrato and aditivos here using tx
  });

- For bulk imports, perform a dry-run validation first and write problematic rows to a CSV for human correction.

Security notes
--------------
- Keep SUPABASE_SERVICE_ROLE_KEY secret; only set it in server-side environment variables (Netlify Functions env, not in the browser).
- For direct client access to Supabase, restrict operations using Row Level Security and policies. For the initial MVP, prefer routing writes through the backend API which verifies roles and sets `app.current_user` before writing (recommended).

If you'd like, I can also generate:
- A migration-friendly SQL file compatible with Prisma Migrate (I can convert schema to the Prisma model if helpful).
- A small Node script to run the seed and demonstrate how to set the `app.current_user` and `app.current_user_source` values before a transaction (for the migration process).

Next steps
----------
Confirm if you want me to generate the migration-compatible Prisma model + seed script (I won't run it against your Supabase instance without your approval). Also tell me whether you want the sample user IDs to be deterministic or generated during seeding.