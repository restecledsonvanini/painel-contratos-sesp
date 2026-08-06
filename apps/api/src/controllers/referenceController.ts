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
  return res
    .status(200)
    .json(await referenciaService.unidadesFsp.update(routeParam(req, 'id'), req.body, req));
}
export async function deleteUnidadeFsp(req: Request, res: Response) {
  return res.status(200).json(await referenciaService.unidadesFsp.remove(routeParam(req, 'id'), req));
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
  return res
    .status(200)
    .json(await referenciaService.fornecedores.update(routeParam(req, 'id'), req.body, req));
}
export async function deleteFornecedor(req: Request, res: Response) {
  return res
    .status(200)
    .json(await referenciaService.fornecedores.remove(routeParam(req, 'id'), req));
}
