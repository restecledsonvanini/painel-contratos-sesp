-- Fatia 6: Dotacao, Empenho, Reserva, Publicacao, Documento

CREATE TYPE "TipoEmpenho" AS ENUM ('ORDINARIO', 'ESTIMATIVO', 'GLOBAL');
CREATE TYPE "SituacaoEmpenho" AS ENUM ('EMITIDO', 'LIQUIDADO', 'PAGO', 'ANULADO');
CREATE TYPE "SituacaoReserva" AS ENUM ('ATIVA', 'BAIXADA', 'CANCELADA');

CREATE TABLE "DotacaoOrcamentaria" (
  "id" TEXT NOT NULL,
  "exercicio" INTEGER NOT NULL,
  "codigo" TEXT NOT NULL,
  "unidadeOrcamentaria" TEXT,
  "funcionalProgramatica" TEXT,
  "naturezaDespesaId" TEXT NOT NULL,
  "fonteRecursoId" TEXT NOT NULL,
  "descricao" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DotacaoOrcamentaria_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DotacaoOrcamentaria_exercicio_codigo_key"
  ON "DotacaoOrcamentaria"("exercicio", "codigo");
CREATE INDEX "DotacaoOrcamentaria_fonteRecursoId_idx" ON "DotacaoOrcamentaria"("fonteRecursoId");
CREATE INDEX "DotacaoOrcamentaria_naturezaDespesaId_idx" ON "DotacaoOrcamentaria"("naturezaDespesaId");

ALTER TABLE "DotacaoOrcamentaria"
  ADD CONSTRAINT "DotacaoOrcamentaria_naturezaDespesaId_fkey"
  FOREIGN KEY ("naturezaDespesaId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DotacaoOrcamentaria"
  ADD CONSTRAINT "DotacaoOrcamentaria_fonteRecursoId_fkey"
  FOREIGN KEY ("fonteRecursoId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ContratoDotacao" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT NOT NULL,
  "dotacaoId" TEXT NOT NULL,
  "exercicio" INTEGER NOT NULL,
  "valorPrevistoCents" BIGINT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContratoDotacao_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContratoDotacao_contratoId_dotacaoId_exercicio_key"
  ON "ContratoDotacao"("contratoId", "dotacaoId", "exercicio");
CREATE INDEX "ContratoDotacao_dotacaoId_idx" ON "ContratoDotacao"("dotacaoId");

ALTER TABLE "ContratoDotacao"
  ADD CONSTRAINT "ContratoDotacao_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContratoDotacao"
  ADD CONSTRAINT "ContratoDotacao_dotacaoId_fkey"
  FOREIGN KEY ("dotacaoId") REFERENCES "DotacaoOrcamentaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "Empenho" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT NOT NULL,
  "dotacaoId" TEXT,
  "numero" TEXT NOT NULL,
  "exercicio" INTEGER NOT NULL,
  "tipo" "TipoEmpenho" NOT NULL DEFAULT 'ORDINARIO',
  "data" DATE NOT NULL,
  "valorCents" BIGINT NOT NULL,
  "valorLiquidadoCents" BIGINT NOT NULL DEFAULT 0,
  "valorPagoCents" BIGINT NOT NULL DEFAULT 0,
  "situacao" "SituacaoEmpenho" NOT NULL DEFAULT 'EMITIDO',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Empenho_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Empenho_valores_chk" CHECK (
    "valorCents" >= 0
    AND "valorLiquidadoCents" >= 0
    AND "valorPagoCents" >= 0
    AND "valorLiquidadoCents" <= "valorCents"
    AND "valorPagoCents" <= "valorLiquidadoCents"
  )
);

CREATE UNIQUE INDEX "Empenho_numero_exercicio_key" ON "Empenho"("numero", "exercicio");
CREATE INDEX "Empenho_contratoId_idx" ON "Empenho"("contratoId");
CREATE INDEX "Empenho_dotacaoId_idx" ON "Empenho"("dotacaoId");

ALTER TABLE "Empenho"
  ADD CONSTRAINT "Empenho_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Empenho"
  ADD CONSTRAINT "Empenho_dotacaoId_fkey"
  FOREIGN KEY ("dotacaoId") REFERENCES "DotacaoOrcamentaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ReservaOrcamentaria" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT,
  "processoId" TEXT,
  "numero" TEXT NOT NULL,
  "data" DATE NOT NULL,
  "valorCents" BIGINT NOT NULL,
  "situacao" "SituacaoReserva" NOT NULL DEFAULT 'ATIVA',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReservaOrcamentaria_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ReservaOrcamentaria_valor_chk" CHECK ("valorCents" >= 0)
);

CREATE INDEX "ReservaOrcamentaria_contratoId_idx" ON "ReservaOrcamentaria"("contratoId");
CREATE INDEX "ReservaOrcamentaria_processoId_idx" ON "ReservaOrcamentaria"("processoId");
CREATE INDEX "ReservaOrcamentaria_numero_idx" ON "ReservaOrcamentaria"("numero");

ALTER TABLE "ReservaOrcamentaria"
  ADD CONSTRAINT "ReservaOrcamentaria_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReservaOrcamentaria"
  ADD CONSTRAINT "ReservaOrcamentaria_processoId_fkey"
  FOREIGN KEY ("processoId") REFERENCES "ProcessoContratacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Publicacao" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT,
  "alteracaoId" TEXT,
  "veiculoId" TEXT NOT NULL,
  "dataPublicacao" DATE NOT NULL,
  "numeroEdicao" TEXT,
  "idPncp" TEXT,
  "url" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Publicacao_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Publicacao_alvo_chk" CHECK (
    ("contratoId" IS NOT NULL) <> ("alteracaoId" IS NOT NULL)
  )
);

CREATE INDEX "Publicacao_dataPublicacao_idx" ON "Publicacao"("dataPublicacao");
CREATE INDEX "Publicacao_contratoId_idx" ON "Publicacao"("contratoId");
CREATE INDEX "Publicacao_alteracaoId_idx" ON "Publicacao"("alteracaoId");

ALTER TABLE "Publicacao"
  ADD CONSTRAINT "Publicacao_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Publicacao"
  ADD CONSTRAINT "Publicacao_alteracaoId_fkey"
  FOREIGN KEY ("alteracaoId") REFERENCES "AlteracaoContratual"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Publicacao"
  ADD CONSTRAINT "Publicacao_veiculoId_fkey"
  FOREIGN KEY ("veiculoId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "Documento" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT,
  "alteracaoId" TEXT,
  "processoId" TEXT,
  "tipoDocumentoId" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "storageKey" TEXT,
  "urlExterna" TEXT,
  "mimeType" TEXT,
  "tamanhoBytes" INTEGER,
  "uploadedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Documento_contratoId_idx" ON "Documento"("contratoId");
CREATE INDEX "Documento_alteracaoId_idx" ON "Documento"("alteracaoId");
CREATE INDEX "Documento_processoId_idx" ON "Documento"("processoId");
CREATE INDEX "Documento_tipoDocumentoId_idx" ON "Documento"("tipoDocumentoId");

ALTER TABLE "Documento"
  ADD CONSTRAINT "Documento_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Documento"
  ADD CONSTRAINT "Documento_alteracaoId_fkey"
  FOREIGN KEY ("alteracaoId") REFERENCES "AlteracaoContratual"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Documento"
  ADD CONSTRAINT "Documento_processoId_fkey"
  FOREIGN KEY ("processoId") REFERENCES "ProcessoContratacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Documento"
  ADD CONSTRAINT "Documento_tipoDocumentoId_fkey"
  FOREIGN KEY ("tipoDocumentoId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
