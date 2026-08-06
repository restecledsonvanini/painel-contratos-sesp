import { Request, Response } from 'express';
import { routeParam } from '../lib/params';
import { authService, usuarioService } from '../services/authService';

export async function login(req: Request, res: Response) {
  return res.status(200).json(await authService.login(req.body));
}

export async function me(req: Request, res: Response) {
  return res.status(200).json(await authService.me(req.user));
}

export async function listUsuarios(_req: Request, res: Response) {
  return res.status(200).json(await usuarioService.list());
}

export async function getUsuario(req: Request, res: Response) {
  return res.status(200).json(await usuarioService.get(routeParam(req, 'id')));
}

export async function createUsuario(req: Request, res: Response) {
  return res.status(201).json(await usuarioService.create(req.body));
}

export async function updateUsuario(req: Request, res: Response) {
  return res.status(200).json(await usuarioService.update(routeParam(req, 'id'), req.body));
}
