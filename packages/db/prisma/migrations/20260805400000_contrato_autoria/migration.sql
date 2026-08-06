-- Autoria do contrato + backfill a partir do AuditLog (changedBy → Usuario).

ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "criadoPorId" TEXT;
ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "atualizadoPorId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Contrato_criadoPorId_fkey'
  ) THEN
    ALTER TABLE "Contrato"
      ADD CONSTRAINT "Contrato_criadoPorId_fkey"
      FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Contrato_atualizadoPorId_fkey'
  ) THEN
    ALTER TABLE "Contrato"
      ADD CONSTRAINT "Contrato_atualizadoPorId_fkey"
      FOREIGN KEY ("atualizadoPorId") REFERENCES "Usuario"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Contrato_criadoPorId_idx" ON "Contrato"("criadoPorId");
CREATE INDEX IF NOT EXISTS "Contrato_atualizadoPorId_idx" ON "Contrato"("atualizadoPorId");

-- Criador: primeiro create com changedBy = id de Usuario
UPDATE "Contrato" c
SET "criadoPorId" = a."changedBy"
FROM (
  SELECT DISTINCT ON ("registroId")
    "registroId",
    "changedBy"
  FROM "AuditLog"
  WHERE lower("tabela") IN ('contrato')
    AND "action" = 'create'
    AND "changedBy" IS NOT NULL
    AND "changedBy" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  ORDER BY "registroId", "changedAt" ASC
) a
WHERE c.id = a."registroId"
  AND c."criadoPorId" IS NULL
  AND EXISTS (SELECT 1 FROM "Usuario" u WHERE u.id = a."changedBy");

-- Última alteração: último create/update com changedBy válido
UPDATE "Contrato" c
SET "atualizadoPorId" = a."changedBy"
FROM (
  SELECT DISTINCT ON ("registroId")
    "registroId",
    "changedBy"
  FROM "AuditLog"
  WHERE lower("tabela") IN ('contrato')
    AND "action" IN ('create', 'update')
    AND "changedBy" IS NOT NULL
    AND "changedBy" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  ORDER BY "registroId", "changedAt" DESC
) a
WHERE c.id = a."registroId"
  AND EXISTS (SELECT 1 FROM "Usuario" u WHERE u.id = a."changedBy");

-- Se só houver criador, espelha em atualizadoPor
UPDATE "Contrato"
SET "atualizadoPorId" = "criadoPorId"
WHERE "atualizadoPorId" IS NULL AND "criadoPorId" IS NOT NULL;
