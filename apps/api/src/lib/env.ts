/**
 * Decisões de ambiente da API, centralizadas.
 *
 * Regra geral: tudo que afrouxa autenticação é opt-in e fica indisponível em
 * produção, independentemente de qualquer outra variável.
 */

const DEV_JWT_SECRET = 'painel-dev-secret-change-me';
const MIN_JWT_SECRET_LENGTH = 32;

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/** Ambiente de teste automatizado (Vitest define VITEST=true). */
export function isTestEnv(): boolean {
  return process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';
}

/**
 * Tokens sintéticos (`Bearer admin|gestor|analista|visitante`) usados pela
 * suíte de testes. Nunca aceitos fora dela.
 */
export function syntheticTokensAllowed(): boolean {
  return isTestEnv();
}

function flagEnabled(value: string | undefined): boolean {
  return value === '1' || value === 'true';
}

/**
 * Bypass sem header `Authorization`, que atribui um ADMIN sintético.
 *
 * Opt-in explícito via AUTH_DEV_BYPASS. AUTH_REQUIRED=1 desliga, e produção
 * desliga sempre. Em teste segue ligado por padrão para não exigir header em
 * cenários que não exercitam RBAC.
 */
export function devBypassEnabled(): boolean {
  if (isProduction()) return false;
  if (flagEnabled(process.env.AUTH_REQUIRED)) return false;
  if (isTestEnv()) return true;
  return flagEnabled(process.env.AUTH_DEV_BYPASS);
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) return secret;
  if (isProduction()) {
    throw new Error('JWT_SECRET é obrigatório em produção');
  }
  return DEV_JWT_SECRET;
}

/**
 * Falha no boot quando produção está mal configurada. Chamado no carregamento
 * de `index.ts`, depois do dotenv de `server.ts`.
 */
export function assertProductionConfig(): void {
  if (!isProduction()) return;

  const problems: string[] = [];

  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    problems.push('JWT_SECRET não definido');
  } else if (secret === DEV_JWT_SECRET) {
    problems.push('JWT_SECRET está usando o valor de desenvolvimento');
  } else if (secret.length < MIN_JWT_SECRET_LENGTH) {
    problems.push(`JWT_SECRET precisa de ao menos ${MIN_JWT_SECRET_LENGTH} caracteres`);
  }

  if (!process.env.DATABASE_URL?.trim()) {
    problems.push('DATABASE_URL não definido');
  }

  if (problems.length) {
    throw new Error(`Configuração inválida para produção: ${problems.join('; ')}`);
  }
}
