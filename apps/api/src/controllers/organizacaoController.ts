import { Request, Response } from 'express';
import { municipioService, orgaoService, unidadeService } from '../services/orgaoService';
import { routeParam } from '../lib/params';

export async function listOrgaos(_req: Request, res: Response) {
  return res.status(200).json(await orgaoService.list());
}
export async function arvoreOrgaos(_req: Request, res: Response) {
  return res.status(200).json(await orgaoService.arvore());
}
export async function getOrgao(req: Request, res: Response) {
  return res.status(200).json(await orgaoService.get(routeParam(req, 'id')));
}
export async function createOrgao(req: Request, res: Response) {
  return res.status(201).json(await orgaoService.create(req.body));
}
export async function updateOrgao(req: Request, res: Response) {
  return res.status(200).json(await orgaoService.update(routeParam(req, 'id'), req.body));
}
export async function deleteOrgao(req: Request, res: Response) {
  return res.status(200).json(await orgaoService.remove(routeParam(req, 'id')));
}

export async function listUnidades(_req: Request, res: Response) {
  return res.status(200).json(await unidadeService.list());
}
export async function arvoreUnidades(_req: Request, res: Response) {
  return res.status(200).json(await unidadeService.arvore());
}
export async function getUnidade(req: Request, res: Response) {
  return res.status(200).json(await unidadeService.get(routeParam(req, 'id')));
}
export async function createUnidade(req: Request, res: Response) {
  return res.status(201).json(await unidadeService.create(req.body));
}
export async function updateUnidade(req: Request, res: Response) {
  return res.status(200).json(await unidadeService.update(routeParam(req, 'id'), req.body));
}
export async function deleteUnidade(req: Request, res: Response) {
  return res.status(200).json(await unidadeService.remove(routeParam(req, 'id')));
}

export async function listMunicipios(req: Request, res: Response) {
  return res.status(200).json(await municipioService.search(req.query as Record<string, unknown>));
}
