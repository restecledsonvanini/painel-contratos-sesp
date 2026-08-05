-- Fatia 9: Usuario (ex-User), Role enum, JWT auth fields, escopo por órgão

CREATE TYPE "Role" AS ENUM ('LEITOR', 'COLABORADOR', 'FISCAL', 'GESTOR', 'ADMIN');

ALTER TABLE "User" RENAME TO "Usuario";

ALTER TABLE "Usuario" RENAME CONSTRAINT "User_pkey" TO "Usuario_pkey";

ALTER INDEX "User_sub_key" RENAME TO "Usuario_sub_key";
ALTER INDEX "User_email_key" RENAME TO "Usuario_email_key";

ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "nome" TEXT;
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "servidorId" TEXT;
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "orgaoId" TEXT;
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "ativo" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Migrar role texto → enum
ALTER TABLE "Usuario" ADD COLUMN "role_new" "Role";

UPDATE "Usuario"
SET "role_new" = CASE
  WHEN lower("role") IN ('admin', 'administrador') THEN 'ADMIN'::"Role"
  WHEN lower("role") IN ('gestor') THEN 'GESTOR'::"Role"
  WHEN lower("role") IN ('fiscal') THEN 'FISCAL'::"Role"
  WHEN lower("role") IN ('leitor', 'reader') THEN 'LEITOR'::"Role"
  ELSE 'COLABORADOR'::"Role"
END;

ALTER TABLE "Usuario" DROP COLUMN "role";
ALTER TABLE "Usuario" RENAME COLUMN "role_new" TO "role";
ALTER TABLE "Usuario" ALTER COLUMN "role" SET NOT NULL;
ALTER TABLE "Usuario" ALTER COLUMN "role" SET DEFAULT 'COLABORADOR'::"Role";

CREATE INDEX "Usuario_role_ativo_idx" ON "Usuario"("role", "ativo");
CREATE INDEX "Usuario_orgaoId_idx" ON "Usuario"("orgaoId");
CREATE INDEX "Usuario_servidorId_idx" ON "Usuario"("servidorId");

ALTER TABLE "Usuario"
  ADD CONSTRAINT "Usuario_servidorId_fkey"
  FOREIGN KEY ("servidorId") REFERENCES "Servidor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Usuario"
  ADD CONSTRAINT "Usuario_orgaoId_fkey"
  FOREIGN KEY ("orgaoId") REFERENCES "Orgao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
