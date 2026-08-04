-- CreateEnum
CREATE TYPE "TipoOrgao" AS ENUM (
  'POLICIA_MILITAR',
  'POLICIA_CIVIL',
  'BOMBEIROS',
  'POLICIA_PENAL',
  'POLICIA_CIENTIFICA',
  'TRANSITO',
  'ADMINISTRACAO_DIRETA'
);

CREATE TYPE "NivelUnidade" AS ENUM (
  'COMANDO_GERAL',
  'DIRETORIA',
  'COMANDO_REGIONAL',
  'BATALHAO',
  'COMPANHIA',
  'DELEGACIA',
  'UNIDADE_PRISIONAL',
  'SETOR'
);

-- AlterTable Municipio
ALTER TABLE "Municipio" ADD COLUMN IF NOT EXISTS "codigoIbge" TEXT;
ALTER TABLE "Municipio" ADD COLUMN IF NOT EXISTS "regiaoAdministrativa" TEXT;

-- Backfill placeholder for any existing rows without codigoIbge
UPDATE "Municipio"
SET "codigoIbge" = 'LEGACY-' || "id"
WHERE "codigoIbge" IS NULL;

ALTER TABLE "Municipio" ALTER COLUMN "codigoIbge" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Municipio_codigoIbge_key" ON "Municipio"("codigoIbge");
CREATE INDEX IF NOT EXISTS "Municipio_uf_nome_idx" ON "Municipio"("uf", "nome");

-- CreateTable Dominio
CREATE TABLE "Dominio" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "descricao" TEXT,
  "editavelPeloUsuario" BOOLEAN NOT NULL DEFAULT true,
  "permiteHierarquia" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Dominio_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Dominio_slug_key" ON "Dominio"("slug");

-- CreateTable DominioValor
CREATE TABLE "DominioValor" (
  "id" TEXT NOT NULL,
  "dominioId" TEXT NOT NULL,
  "codigo" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "parentId" TEXT,
  "ordem" INTEGER NOT NULL DEFAULT 0,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "metadata" JSONB,
  "codigoLegado" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DominioValor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DominioValor_dominioId_codigo_key" ON "DominioValor"("dominioId", "codigo");
CREATE INDEX "DominioValor_dominioId_ativo_ordem_idx" ON "DominioValor"("dominioId", "ativo", "ordem");
CREATE INDEX "DominioValor_parentId_idx" ON "DominioValor"("parentId");

ALTER TABLE "DominioValor"
  ADD CONSTRAINT "DominioValor_dominioId_fkey"
  FOREIGN KEY ("dominioId") REFERENCES "Dominio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DominioValor"
  ADD CONSTRAINT "DominioValor_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "DominioValor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable Orgao
CREATE TABLE "Orgao" (
  "id" TEXT NOT NULL,
  "sigla" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "tipo" "TipoOrgao" NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Orgao_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Orgao_sigla_key" ON "Orgao"("sigla");

-- CreateTable UnidadeOrganizacional
CREATE TABLE "UnidadeOrganizacional" (
  "id" TEXT NOT NULL,
  "orgaoId" TEXT NOT NULL,
  "parentId" TEXT,
  "sigla" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "nivel" "NivelUnidade" NOT NULL,
  "municipioId" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UnidadeOrganizacional_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UnidadeOrganizacional_orgaoId_sigla_key" ON "UnidadeOrganizacional"("orgaoId", "sigla");
CREATE INDEX "UnidadeOrganizacional_parentId_idx" ON "UnidadeOrganizacional"("parentId");
CREATE INDEX "UnidadeOrganizacional_municipioId_idx" ON "UnidadeOrganizacional"("municipioId");
CREATE INDEX "UnidadeOrganizacional_orgaoId_ativo_idx" ON "UnidadeOrganizacional"("orgaoId", "ativo");

ALTER TABLE "UnidadeOrganizacional"
  ADD CONSTRAINT "UnidadeOrganizacional_orgaoId_fkey"
  FOREIGN KEY ("orgaoId") REFERENCES "Orgao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UnidadeOrganizacional"
  ADD CONSTRAINT "UnidadeOrganizacional_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "UnidadeOrganizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "UnidadeOrganizacional"
  ADD CONSTRAINT "UnidadeOrganizacional_municipioId_fkey"
  FOREIGN KEY ("municipioId") REFERENCES "Municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Trigger: impede ciclo na árvore de unidades
CREATE OR REPLACE FUNCTION fn_impedir_ciclo_unidade()
RETURNS TRIGGER AS $$
DECLARE
  cursor_id TEXT;
BEGIN
  IF NEW."parentId" IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW."parentId" = NEW."id" THEN
    RAISE EXCEPTION 'UnidadeOrganizacional não pode ser pai de si mesma';
  END IF;

  cursor_id := NEW."parentId";
  WHILE cursor_id IS NOT NULL LOOP
    IF cursor_id = NEW."id" THEN
      RAISE EXCEPTION 'Ciclo detectado na hierarquia de UnidadeOrganizacional';
    END IF;
    SELECT "parentId" INTO cursor_id FROM "UnidadeOrganizacional" WHERE "id" = cursor_id;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_impedir_ciclo_unidade ON "UnidadeOrganizacional";
CREATE TRIGGER trg_impedir_ciclo_unidade
  BEFORE INSERT OR UPDATE OF "parentId" ON "UnidadeOrganizacional"
  FOR EACH ROW
  EXECUTE PROCEDURE fn_impedir_ciclo_unidade();
