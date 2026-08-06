-- Backfill de papéis + default ANALISTA (após ADD VALUE commitado).

UPDATE "Usuario" SET role = 'VISITANTE' WHERE role = 'LEITOR';
UPDATE "Usuario" SET role = 'ANALISTA' WHERE role IN ('COLABORADOR', 'FISCAL');

ALTER TABLE "Usuario" ALTER COLUMN "role" SET DEFAULT 'ANALISTA'::"Role";
