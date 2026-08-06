-- Fase 1: hierarquia SESP → forças (Orgao.parentId)

ALTER TABLE "Orgao" ADD COLUMN IF NOT EXISTS "parentId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Orgao_parentId_fkey'
  ) THEN
    ALTER TABLE "Orgao"
      ADD CONSTRAINT "Orgao_parentId_fkey"
      FOREIGN KEY ("parentId") REFERENCES "Orgao"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Orgao_parentId_idx" ON "Orgao"("parentId");
CREATE INDEX IF NOT EXISTS "Orgao_ativo_idx" ON "Orgao"("ativo");

-- Backfill: forças sob SESP (mantenedora)
UPDATE "Orgao" AS o
SET "parentId" = s.id
FROM "Orgao" AS s
WHERE s.sigla = 'SESP'
  AND o.sigla <> 'SESP'
  AND o."parentId" IS NULL;
