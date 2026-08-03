import { Router } from 'express';
import {
  createEmpresa,
  createEntidadeGestora,
  createUnidadeFsp,
  listEmpresas,
  listEntidadesGestoras,
  listUnidadesFsp,
  getEmpresa,
  updateEmpresa,
  deleteEmpresa,
  getEntidadeGestora,
  updateEntidadeGestora,
  deleteEntidadeGestora,
  getUnidadeFsp,
  updateUnidadeFsp,
  deleteUnidadeFsp,
  // fornecedores & serviços (mocked)
  listFornecedores,
  createFornecedor,
  getFornecedor,
  updateFornecedor,
  deleteFornecedor,
  listServicos,
  createServico,
  getServico,
  updateServico,
  deleteServico,
} from '../controllers/referenceController';

const router = Router();

router.get('/empresas', listEmpresas);
router.post('/empresas', createEmpresa);
router.get('/empresas/:id', getEmpresa);
router.put('/empresas/:id', updateEmpresa);
router.delete('/empresas/:id', deleteEmpresa);

router.get('/entidades-gestoras', listEntidadesGestoras);
router.post('/entidades-gestoras', createEntidadeGestora);
router.get('/entidades-gestoras/:id', getEntidadeGestora);
router.put('/entidades-gestoras/:id', updateEntidadeGestora);
router.delete('/entidades-gestoras/:id', deleteEntidadeGestora);

router.get('/unidades-fsp', listUnidadesFsp);
router.post('/unidades-fsp', createUnidadeFsp);
router.get('/unidades-fsp/:id', getUnidadeFsp);
router.put('/unidades-fsp/:id', updateUnidadeFsp);
router.delete('/unidades-fsp/:id', deleteUnidadeFsp);

// Fornecedores (mocked)
router.get('/fornecedores', listFornecedores);
router.post('/fornecedores', createFornecedor);
router.get('/fornecedores/:id', getFornecedor);
router.put('/fornecedores/:id', updateFornecedor);
router.delete('/fornecedores/:id', deleteFornecedor);

// Serviços (mocked)
router.get('/servicos', listServicos);
router.post('/servicos', createServico);
router.get('/servicos/:id', getServico);
router.put('/servicos/:id', updateServico);
router.delete('/servicos/:id', deleteServico);

export default router;
