import { Request, Response } from 'express';
import { dominioService, lookupService } from '../services/dominioService';
import { municipioService, orgaoService, unidadeService } from '../services/orgaoService';
import { routeParam } from '../lib/params';

export async function getLookups(req: Request, res: Response) {
  const { payload, etag } = await lookupService.getPayload();
  const inm = req.header('if-none-match');
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'public, max-age=60');
  if (inm && inm === etag) {
    return res.status(304).end();
  }
  return res.status(200).json(payload);
}

export async function getLookupSlug(req: Request, res: Response) {
  const slug = routeParam(req, 'slug');
  const result = await lookupService.search(slug, req.query as Record<string, unknown>);
  return res.status(200).json(result);
}

export async function listDominios(_req: Request, res: Response) {
  return res.status(200).json(await dominioService.list());
}

export async function getDominio(req: Request, res: Response) {
  return res.status(200).json(await dominioService.getBySlug(routeParam(req, 'slug')));
}

export async function listDominioValores(req: Request, res: Response) {
  const includeInativos = String(req.query.includeInativos || '') === 'true';
  return res
    .status(200)
    .json(await dominioService.listValores(routeParam(req, 'slug'), includeInativos));
}

export async function createDominioValor(req: Request, res: Response) {
  const created = await dominioService.createValor(routeParam(req, 'slug'), req.body);
  return res.status(201).json({
    id: created.id,
    label: created.label,
    codigo: created.codigo,
    parentId: created.parentId,
    metadata: created.metadata,
  });
}

export async function updateDominioValor(req: Request, res: Response) {
  const updated = await dominioService.updateValor(
    routeParam(req, 'slug'),
    routeParam(req, 'id'),
    req.body,
  );
  return res.status(200).json(updated);
}

export async function deleteDominioValor(req: Request, res: Response) {
  const updated = await dominioService.deactivateValor(
    routeParam(req, 'slug'),
    routeParam(req, 'id'),
  );
  return res.status(200).json(updated);
}

export async function listOrgaos(_req: Request, res: Response) {
  return res.status(200).json(await orgaoService.list());
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
