SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('Empresa','EntidadeGestora','Fornecedor','Servidor','FornecedorContato','_Fornecedor_legado') ORDER BY 1;
SELECT column_name FROM information_schema.columns WHERE table_name='Contrato' AND column_name IN ('empresaId','fornecedorId');
