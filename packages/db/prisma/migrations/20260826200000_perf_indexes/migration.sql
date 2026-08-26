-- Índices das colunas usadas em filtro/ordenação da listagem e do export.

CREATE INDEX IF NOT EXISTS "Contrato_createdAt_idx" ON "Contrato"("createdAt");
CREATE INDEX IF NOT EXISTS "Contrato_dataAssinatura_idx" ON "Contrato"("dataAssinatura");
CREATE INDEX IF NOT EXISTS "Contrato_garantiaValidade_idx" ON "Contrato"("garantiaValidade");
CREATE INDEX IF NOT EXISTS "Contrato_processoId_idx" ON "Contrato"("processoId");

CREATE INDEX IF NOT EXISTS "Fornecedor_municipioId_idx" ON "Fornecedor"("municipioId");

CREATE INDEX IF NOT EXISTS "Servidor_unidadeId_idx" ON "Servidor"("unidadeId");
CREATE INDEX IF NOT EXISTS "Servidor_ativo_idx" ON "Servidor"("ativo");

CREATE INDEX IF NOT EXISTS "Alerta_reconhecidoEm_idx" ON "Alerta"("reconhecidoEm");
