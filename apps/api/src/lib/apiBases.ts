/**
 * Prefixos sob os quais a API é montada. Compartilhado entre o roteamento e a
 * allowlist de rotas públicas, para que os dois não saiam de sincronia.
 */
export const API_BASES = ['/api/v1', '/.netlify/functions/api'] as const;
