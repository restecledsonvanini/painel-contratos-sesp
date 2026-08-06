import React, { Suspense, lazy } from 'react';
import { Navigate, Routes, Route, useParams } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

const PainelPage = lazy(() => import('./pages/PainelPage'));
const CadastrosPage = lazy(() => import('./pages/CadastrosPage'));
const UtilitariosPage = lazy(() => import('./pages/UtilitariosPage'));
const ConfiguracoesPage = lazy(() => import('./pages/ConfiguracoesPage'));
const ContractsList = lazy(() => import('./pages/ContractsList'));
const ContractForm = lazy(() => import('./pages/ContractForm'));
const ContractDetail = lazy(() => import('./pages/ContractDetail'));
const FornecedoresForm = lazy(() => import('./pages/FornecedoresForm'));
const ServidoresForm = lazy(() => import('./pages/ServidoresForm'));
const CatalogoForm = lazy(() => import('./pages/CatalogoForm'));
const AlteracaoForm = lazy(() => import('./pages/AlteracaoForm'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UnidadeForm = lazy(() => import('./pages/UnidadeForm'));
const DevUi = lazy(() => import('./pages/DevUi'));

function RedirectEdit({ toBase }: { toBase: string }) {
  const { id } = useParams();
  return <Navigate to={`${toBase}/${id}/edit`} replace />;
}

export default function App() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/painel?tab=tatico" replace />} />
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/estrategico" element={<Navigate to="/painel?tab=estrategico" replace />} />
          <Route path="/alertas" element={<Navigate to="/painel?tab=alertas" replace />} />

          <Route path="/contracts" element={<ContractsList />} />
          <Route path="/contracts/new" element={<ContractForm />} />
          <Route path="/contracts/:id/edit" element={<ContractForm />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="/contracts/:id/alteracoes/nova" element={<AlteracaoForm />} />

          <Route path="/cadastros" element={<CadastrosPage />} />
          <Route path="/utilitarios" element={<UtilitariosPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/fornecedores" element={<Navigate to="/cadastros?tab=fornecedores" replace />} />
          <Route path="/fornecedores/new" element={<FornecedoresForm />} />
          <Route path="/fornecedores/:id/edit" element={<FornecedoresForm />} />
          <Route path="/empresas" element={<Navigate to="/cadastros?tab=fornecedores" replace />} />
          <Route path="/empresas/new" element={<Navigate to="/fornecedores/new" replace />} />
          <Route path="/empresas/:id/edit" element={<RedirectEdit toBase="/fornecedores" />} />

          <Route path="/servidores" element={<Navigate to="/cadastros?tab=servidores" replace />} />
          <Route path="/servidores/new" element={<ServidoresForm />} />
          <Route path="/servidores/:id/edit" element={<ServidoresForm />} />
          <Route path="/entidades-gestoras" element={<Navigate to="/cadastros?tab=servidores" replace />} />
          <Route path="/entidades-gestoras/new" element={<Navigate to="/servidores/new" replace />} />
          <Route path="/entidades-gestoras/:id/edit" element={<RedirectEdit toBase="/servidores" />} />

          <Route path="/catalogo-itens" element={<Navigate to="/cadastros?tab=catalogo" replace />} />
          <Route path="/catalogo-itens/new" element={<CatalogoForm />} />
          <Route path="/catalogo-itens/:id/edit" element={<CatalogoForm />} />
          <Route path="/servicos" element={<Navigate to="/cadastros?tab=catalogo" replace />} />
          <Route path="/servicos/new" element={<Navigate to="/catalogo-itens/new" replace />} />
          <Route path="/servicos/:id/edit" element={<RedirectEdit toBase="/catalogo-itens" />} />

          <Route path="/dotacoes" element={<Navigate to="/cadastros?tab=dotacoes" replace />} />
          <Route path="/importacao" element={<Navigate to="/utilitarios?tab=importacao" replace />} />

          <Route path="/unidades" element={<Navigate to="/configuracoes?tab=organizacao" replace />} />
          <Route path="/unidades/new" element={<UnidadeForm />} />
          <Route path="/unidades/:id/edit" element={<UnidadeForm />} />
          <Route path="/unidades-fsp" element={<Navigate to="/configuracoes?tab=organizacao" replace />} />
          <Route path="/unidades-fsp/new" element={<Navigate to="/unidades/new" replace />} />
          <Route path="/unidades-fsp/:id/edit" element={<RedirectEdit toBase="/unidades" />} />
          <Route path="/dominios" element={<Navigate to="/configuracoes?tab=listas" replace />} />
          <Route path="/dev/ui" element={<DevUi />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}
