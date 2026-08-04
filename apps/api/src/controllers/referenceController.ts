import { Request, Response } from 'express';
import { routeParam } from '../lib/params';
import { referenciaService } from '../services/referenciaService';

export async function listUnidadesFsp(_req: Request, res: Response) {
  return res.status(200).json(await referenciaService.unidadesFsp.list());
}
export async function createUnidadeFsp(req: Request, res: Response) {
  return res.status(201).json(await referenciaService.unidadesFsp.create(req.body, req));
}
export async function getUnidadeFsp(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.unidadesFsp.get(routeParam(req, 'id')));
}
export async function updateUnidadeFsp(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.unidadesFsp.update(routeParam(req, 'id'), req.body, req));
}
export async function deleteUnidadeFsp(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.unidadesFsp.remove(routeParam(req, 'id'), req));
}

export async function listEmpresas(_req: Request, res: Response) {
  return res.status(200).json(await referenciaService.empresas.list());
}
export async function createEmpresa(req: Request, res: Response) {
  return res.status(201).json(await referenciaService.empresas.create(req.body, req));
}
export async function getEmpresa(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.empresas.get(routeParam(req, 'id')));
}
export async function updateEmpresa(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.empresas.update(routeParam(req, 'id'), req.body, req));
}
export async function deleteEmpresa(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.empresas.remove(routeParam(req, 'id'), req));
}

export async function listEntidadesGestoras(_req: Request, res: Response) {
  return res.status(200).json(await referenciaService.entidadesGestoras.list());
}
export async function createEntidadeGestora(req: Request, res: Response) {
  return res.status(201).json(await referenciaService.entidadesGestoras.create(req.body, req));
}
export async function getEntidadeGestora(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.entidadesGestoras.get(routeParam(req, 'id')));
}
export async function updateEntidadeGestora(req: Request, res: Response) {
  return res
    .status(200)
    .json(await referenciaService.entidadesGestoras.update(routeParam(req, 'id'), req.body, req));
}
export async function deleteEntidadeGestora(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.entidadesGestoras.remove(routeParam(req, 'id'), req));
}

export async function listFornecedores(_req: Request, res: Response) {
  return res.status(200).json(await referenciaService.fornecedores.list());
}
export async function createFornecedor(req: Request, res: Response) {
  return res.status(201).json(await referenciaService.fornecedores.create(req.body, req));
}
export async function getFornecedor(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.fornecedores.get(routeParam(req, 'id')));
}
export async function updateFornecedor(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.fornecedores.update(routeParam(req, 'id'), req.body, req));
}
export async function deleteFornecedor(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.fornecedores.remove(routeParam(req, 'id'), req));
}

export async function listServicos(_req: Request, res: Response) {
  return res.status(200).json(await referenciaService.servicos.list());
}
export async function createServico(req: Request, res: Response) {
  return res.status(201).json(await referenciaService.servicos.create(req.body, req));
}
export async function getServico(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.servicos.get(routeParam(req, 'id')));
}
export async function updateServico(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.servicos.update(routeParam(req, 'id'), req.body, req));
}
export async function deleteServico(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.servicos.remove(routeParam(req, 'id'), req));
}
