import { Request, Response } from 'express';
import { routeParam } from '../lib/params';
import {
  atributoDefService,
  catalogoService,
  itemContratoService,
} from '../services/catalogoService';

export async function listCatalogo(req: Request, res: Response) {
  if (String(req.query.flat || '') === 'true') {
    return res.status(200).json(await catalogoService.listAll());
  }
  return res.status(200).json(await catalogoService.list(req.query as Record<string, unknown>));
}

export async function getCatalogoItem(req: Request, res: Response) {
  return res.status(200).json(await catalogoService.get(routeParam(req, 'id')));
}

export async function createCatalogoItem(req: Request, res: Response) {
  const created = await catalogoService.create(req.body);
  return res.status(201).json({
    ...created,
    id: created.id,
    label: created.nome,
  });
}

export async function updateCatalogoItem(req: Request, res: Response) {
  return res.status(200).json(await catalogoService.update(routeParam(req, 'id'), req.body));
}

export async function deleteCatalogoItem(req: Request, res: Response) {
  return res.status(200).json(await catalogoService.remove(routeParam(req, 'id')));
}

export async function listAtributosCategoria(req: Request, res: Response) {
  const includeInativos = String(req.query.includeInativos || '') === 'true';
  return res
    .status(200)
    .json(await atributoDefService.listByCategoria(routeParam(req, 'id'), includeInativos));
}

export async function createAtributoDef(req: Request, res: Response) {
  const body = { ...req.body, categoriaItemId: routeParam(req, 'id') };
  return res.status(201).json(await atributoDefService.create(body));
}

export async function updateAtributoDef(req: Request, res: Response) {
  return res
    .status(200)
    .json(await atributoDefService.update(routeParam(req, 'atributoId'), req.body));
}

export async function deleteAtributoDef(req: Request, res: Response) {
  return res.status(200).json(await atributoDefService.remove(routeParam(req, 'atributoId')));
}

export async function listItensContrato(req: Request, res: Response) {
  return res.status(200).json(await itemContratoService.list(routeParam(req, 'id')));
}

export async function getItemContrato(req: Request, res: Response) {
  return res
    .status(200)
    .json(await itemContratoService.get(routeParam(req, 'id'), routeParam(req, 'itemId')));
}

export async function createItemContrato(req: Request, res: Response) {
  return res.status(201).json(await itemContratoService.create(routeParam(req, 'id'), req.body));
}

export async function updateItemContrato(req: Request, res: Response) {
  return res
    .status(200)
    .json(
      await itemContratoService.update(
        routeParam(req, 'id'),
        routeParam(req, 'itemId'),
        req.body,
      ),
    );
}

export async function deleteItemContrato(req: Request, res: Response) {
  return res
    .status(200)
    .json(await itemContratoService.remove(routeParam(req, 'id'), routeParam(req, 'itemId')));
}
