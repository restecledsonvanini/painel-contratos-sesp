import { Navigate, useParams } from 'react-router-dom';

/** Rotas antigas → destino canônico (bookmarks e links externos). */
export const LEGACY_REDIRECTS: ReadonlyArray<{ path: string; to: string }> = [
  { path: '/estrategico', to: '/painel?tab=estrategico' },
  { path: '/alertas', to: '/painel?tab=alertas' },
  { path: '/fornecedores', to: '/cadastros?tab=fornecedores' },
  { path: '/empresas', to: '/cadastros?tab=fornecedores' },
  { path: '/empresas/new', to: '/fornecedores/new' },
  { path: '/servidores', to: '/cadastros?tab=servidores' },
  { path: '/entidades-gestoras', to: '/cadastros?tab=servidores' },
  { path: '/entidades-gestoras/new', to: '/servidores/new' },
  { path: '/catalogo-itens', to: '/cadastros?tab=catalogo' },
  { path: '/servicos', to: '/cadastros?tab=catalogo' },
  { path: '/servicos/new', to: '/catalogo-itens/new' },
  { path: '/dotacoes', to: '/cadastros?tab=dotacoes' },
  { path: '/importacao', to: '/utilitarios?tab=importacao' },
  { path: '/unidades', to: '/configuracoes?tab=organizacao' },
  { path: '/unidades-fsp', to: '/configuracoes?tab=organizacao' },
  { path: '/unidades-fsp/new', to: '/unidades/new' },
  { path: '/dominios', to: '/configuracoes?tab=listas' },
];

export const LEGACY_EDIT_REDIRECTS: ReadonlyArray<{ path: string; toBase: string }> = [
  { path: '/empresas/:id/edit', toBase: '/fornecedores' },
  { path: '/entidades-gestoras/:id/edit', toBase: '/servidores' },
  { path: '/servicos/:id/edit', toBase: '/catalogo-itens' },
  { path: '/unidades-fsp/:id/edit', toBase: '/unidades' },
];

function LegacyEditRedirect({ toBase }: { toBase: string }) {
  const { id } = useParams();
  return <Navigate to={`${toBase}/${id}/edit`} replace />;
}

export { LegacyEditRedirect };
