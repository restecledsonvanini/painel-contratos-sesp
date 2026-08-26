import { getPrisma } from './prisma';
import { badRequest } from './errors';
import { isProduction } from './env';
import { EMAIL_DOMAINS_SLUG } from '@painel/domain';

let allowlistWarned = false;

function warnAllowlistMissing() {
  if (allowlistWarned || !isProduction()) return;
  allowlistWarned = true;
  console.warn(
    JSON.stringify({
      code: 'EMAIL_ALLOWLIST_EMPTY',
      message:
        'Nenhum domínio de e-mail permitido configurado: qualquer domínio consegue autenticar. Defina AUTH_EMAIL_DOMAINS ou popule o domínio no banco.',
    }),
  );
}

/** Extrai o domínio do e-mail (parte após @), em minúsculas. */
export function emailDomainOf(email: string): string | null {
  const at = email.lastIndexOf('@');
  if (at < 0) return null;
  const domain = email.slice(at + 1).trim().toLowerCase();
  return domain || null;
}

/**
 * Allowlist de domínio de e-mail.
 * - `AUTH_EMAIL_DOMAINS=*`: libera tudo (dev/teste)
 * - `AUTH_EMAIL_DOMAINS=a.com,b.com`: lista fixa (sobrescreve o banco)
 * - senão: lê `DominioValor` do slug `dominios-email-permitidos`
 * - se o domínio ainda não foi semeado / sem valores: libera (não trava ambientes vazios)
 */
export async function assertEmailDomainAllowed(email: string) {
  const domain = emailDomainOf(email);
  if (!domain) throw badRequest('E-mail inválido');

  const env = process.env.AUTH_EMAIL_DOMAINS?.trim();
  if (env === '*' || env === 'any') return;

  if (env) {
    const allowed = env
      .split(/[,;\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length && !allowed.includes(domain)) {
      throw badRequest(`Domínio de e-mail não permitido: ${domain}`);
    }
    return;
  }

  const db = getPrisma();
  const row = await db.dominio.findUnique({
    where: { slug: EMAIL_DOMAINS_SLUG },
    include: { valores: { where: { ativo: true }, select: { codigo: true, label: true } } },
  });
  // Sem allowlist configurada não há o que aplicar. Travar aqui deixaria uma
  // implantação nova sem nenhum login possível, então libera — mas em produção
  // avisa, para não passar a impressão de que a restrição está ativa.
  if (!row || row.valores.length === 0) {
    warnAllowlistMissing();
    return;
  }

  const ok = row.valores.some((v) => {
    const code = v.codigo.trim().toLowerCase();
    const label = v.label.trim().toLowerCase();
    return code === domain || label === domain;
  });
  if (!ok) throw badRequest(`Domínio de e-mail não permitido: ${domain}`);
}
