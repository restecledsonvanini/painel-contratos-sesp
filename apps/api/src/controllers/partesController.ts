import { Request, Response } from 'express';
import { routeParam } from '../lib/params';
import { fornecedorService, servidorService } from '../services/partesService';

export async function listFornecedores(req: Request, res: Response) {
  const flat = String(req.query.flat || '') === 'true';
  if (flat) return res.status(200).json(await fornecedorService.listAll());
  return res.status(200).json(await fornecedorService.list(req.query as Record<string, unknown>));
}

export async function getFornecedor(req: Request, res: Response) {
  return res.status(200).json(await fornecedorService.get(routeParam(req, 'id')));
}

export async function createFornecedor(req: Request, res: Response) {
  const created = await fornecedorService.create(req.body);
  return res.status(201).json({
    ...created,
    id: created.id,
    label: `${created.razaoSocial} (${created.documento})`,
  });
}

export async function updateFornecedor(req: Request, res: Response) {
  return res.status(200).json(await fornecedorService.update(routeParam(req, 'id'), req.body));
}

export async function deleteFornecedor(req: Request, res: Response) {
  return res.status(200).json(await fornecedorService.remove(routeParam(req, 'id')));
}

export async function createFornecedorContato(req: Request, res: Response) {
  return res
    .status(201)
    .json(await fornecedorService.createContato(routeParam(req, 'id'), req.body));
}

export async function updateFornecedorContato(req: Request, res: Response) {
  return res
    .status(200)
    .json(
      await fornecedorService.updateContato(
        routeParam(req, 'id'),
        routeParam(req, 'contatoId'),
        req.body,
      ),
    );
}

export async function deleteFornecedorContato(req: Request, res: Response) {
  return res
    .status(200)
    .json(await fornecedorService.removeContato(routeParam(req, 'id'), routeParam(req, 'contatoId')));
}

export async function createFornecedorSancao(req: Request, res: Response) {
  return res
    .status(201)
    .json(await fornecedorService.createSancao(routeParam(req, 'id'), req.body));
}

export async function updateFornecedorSancao(req: Request, res: Response) {
  return res
    .status(200)
    .json(
      await fornecedorService.updateSancao(
        routeParam(req, 'id'),
        routeParam(req, 'sancaoId'),
        req.body,
      ),
    );
}

export async function deleteFornecedorSancao(req: Request, res: Response) {
  return res
    .status(200)
    .json(await fornecedorService.removeSancao(routeParam(req, 'id'), routeParam(req, 'sancaoId')));
}

export async function listServidores(req: Request, res: Response) {
  const flat = String(req.query.flat || '') === 'true';
  if (flat) return res.status(200).json(await servidorService.listAll());
  return res.status(200).json(await servidorService.list(req.query as Record<string, unknown>));
}

export async function getServidor(req: Request, res: Response) {
  return res.status(200).json(await servidorService.get(routeParam(req, 'id')));
}

export async function createServidor(req: Request, res: Response) {
  const created = await servidorService.create(req.body);
  return res.status(201).json({
    ...created,
    id: created.id,
    label: created.cargo ? `${created.nome} — ${created.cargo}` : created.nome,
  });
}

export async function updateServidor(req: Request, res: Response) {
  return res.status(200).json(await servidorService.update(routeParam(req, 'id'), req.body));
}

export async function deleteServidor(req: Request, res: Response) {
  return res.status(200).json(await servidorService.remove(routeParam(req, 'id')));
}
