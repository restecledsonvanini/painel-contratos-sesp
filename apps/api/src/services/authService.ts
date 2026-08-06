import { LoginSchema, UsuarioCreateSchema, UsuarioUpdateSchema } from '@painel/schema';
import { notFound, unauthorized } from '../lib/errors';
import { signJwt, verifyPassword } from '../lib/jwt';
import { normalizeRole, publicUser, type AuthUser } from '../lib/authTypes';
import { assertEmailDomainAllowed } from '../lib/emailDomain';
import { usuarioRepository } from '../repositories/usuarioRepository';

export const authService = {
  async login(body: unknown) {
    const input = LoginSchema.parse(body);
    await assertEmailDomainAllowed(input.email);
    const user = await usuarioRepository.findByEmail(input.email);
    if (!user || !user.ativo) throw unauthorized('Credenciais inválidas');
    if (!verifyPassword(input.password, user.passwordHash)) {
      throw unauthorized('Credenciais inválidas');
    }
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: normalizeRole(user.role),
      orgaoId: user.orgaoId,
      servidorId: user.servidorId,
      ativo: user.ativo,
    };
    const token = signJwt({
      sub: authUser.id,
      email: authUser.email,
      role: authUser.role,
      orgaoId: authUser.orgaoId,
      servidorId: authUser.servidorId,
    });
    return { token, user: publicUser(authUser) };
  },

  async me(user: AuthUser | undefined) {
    if (!user) throw unauthorized();
    if (user.id === 'system' || user.id.startsWith('user-')) {
      return publicUser(user);
    }
    const fresh = await usuarioRepository.findById(user.id);
    if (!fresh || !fresh.ativo) throw unauthorized('Usuário inativo');
    return {
      id: fresh.id,
      email: fresh.email,
      nome: fresh.nome,
      role: normalizeRole(fresh.role),
      orgaoId: fresh.orgaoId,
      servidorId: fresh.servidorId,
      ativo: fresh.ativo,
      orgao: fresh.orgao,
      servidor: fresh.servidor,
    };
  },
};

export const usuarioService = {
  list: () => usuarioRepository.list(),
  get: async (id: string) => {
    const u = await usuarioRepository.findById(id);
    if (!u) throw notFound('Usuário não encontrado');
    return u;
  },
  create: async (body: unknown) => {
    const parsed = UsuarioCreateSchema.parse(body);
    await assertEmailDomainAllowed(parsed.email);
    return usuarioRepository.create(parsed);
  },
  update: async (id: string, body: unknown) => {
    const parsed = UsuarioUpdateSchema.parse(body);
    if (parsed.email) await assertEmailDomainAllowed(parsed.email);
    return usuarioRepository.update(id, parsed);
  },
};
