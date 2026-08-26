-- A API passou a negar acesso a papéis não-ADMIN sem órgão vinculado (antes o
-- vazio era tratado como "vê tudo"). Vincula quem ficou sem órgão à SESP para
-- que contas existentes não percam o acesso na subida.

UPDATE "Usuario"
SET "orgaoId" = (SELECT id FROM "Orgao" WHERE sigla = 'SESP' LIMIT 1)
WHERE "orgaoId" IS NULL
  AND role <> 'ADMIN'
  AND EXISTS (SELECT 1 FROM "Orgao" WHERE sigla = 'SESP');
