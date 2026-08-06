import React, { Suspense, lazy } from 'react';
import { Navigate, Routes, Route, useParams } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardEstrategico = lazy(() => import('./pages/DashboardEstrategico'));
const ContractsList = lazy(() => import('./pages/ContractsList'));
const ContractForm = lazy(() => import('./pages/ContractForm'));
const ContractDetail = lazy(() => import('./pages/ContractDetail'));
const FornecedoresList = lazy(() => import('./pages/FornecedoresList'));
const FornecedoresForm = lazy(() => import('./pages/FornecedoresForm'));
const ServidoresList = lazy(() => import('./pages/ServidoresList'));
const ServidoresForm = lazy(() => import('./pages/ServidoresForm'));
const CatalogoList = lazy(() => import('./pages/CatalogoList'));
const CatalogoForm = lazy(() => import('./pages/CatalogoForm'));
const AlteracaoForm = lazy(() => import('./pages/AlteracaoForm'));
const DotacoesList = lazy(() => import('./pages/DotacoesList'));
const AlertasList = lazy(() => import('./pages/AlertasList'));
const ImportacaoWizard = lazy(() => import('./pages/ImportacaoWizard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UnidadesList = lazy(() => import('./pages/UnidadesList'));
const UnidadeForm = lazy(() => import('./pages/UnidadeForm'));
const DevUi = lazy(() => import('./pages/DevUi'));
const DominiosPage = lazy(() => import('./features/dominios/pages/DominiosPage'));

function RedirectEdit({ toBase }: { toBase: string }) {
  const { id } = useParams();
  return <Navigate to={`${toBase}/${id}/edit`} replace />;
}

export default function App() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/estrategico" element={<DashboardEstrategico />} />
          <Route path="/contracts" element={<ContractsList />} />
          <Route path="/contracts/new" element={<ContractForm />} />
          <Route path="/contracts/:id/edit" element={<ContractForm />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="/contracts/:id/alteracoes/nova" element={<AlteracaoForm />} />
          <Route path="/dotacoes" element={<DotacoesList />} />
          <Route path="/alertas" element={<AlertasList />} />
          <Route path="/importacao" element={<ImportacaoWizard />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/fornecedores" element={<FornecedoresList />} />
          <Route path="/fornecedores/new" element={<FornecedoresForm />} />
          <Route path="/fornecedores/:id/edit" element={<FornecedoresForm />} />
          <Route path="/empresas" element={<Navigate to="/fornecedores" replace />} />
          <Route path="/empresas/new" element={<Navigate to="/fornecedores/new" replace />} />
          <Route path="/empresas/:id/edit" element={<RedirectEdit toBase="/fornecedores" />} />

          <Route path="/servidores" element={<ServidoresList />} />
          <Route path="/servidores/new" element={<ServidoresForm />} />
          <Route path="/servidores/:id/edit" element={<ServidoresForm />} />
          <Route path="/entidades-gestoras" element={<Navigate to="/servidores" replace />} />
          <Route path="/entidades-gestoras/new" element={<Navigate to="/servidores/new" replace />} />
          <Route path="/entidades-gestoras/:id/edit" element={<RedirectEdit toBase="/servidores" />} />

          <Route path="/catalogo-itens" element={<CatalogoList />} />
          <Route path="/catalogo-itens/new" element={<CatalogoForm />} />
          <Route path="/catalogo-itens/:id/edit" element={<CatalogoForm />} />
          <Route path="/servicos" element={<Navigate to="/catalogo-itens" replace />} />
          <Route path="/servicos/new" element={<Navigate to="/catalogo-itens/new" replace />} />
          <Route path="/servicos/:id/edit" element={<RedirectEdit toBase="/catalogo-itens" />} />
          <Route path="/unidades" element={<UnidadesList />} />
          <Route path="/unidades/new" element={<UnidadeForm />} />
          <Route path="/unidades/:id/edit" element={<UnidadeForm />} />
          <Route path="/unidades-fsp" element={<Navigate to="/unidades" replace />} />
          <Route path="/unidades-fsp/new" element={<Navigate to="/unidades/new" replace />} />
          <Route path="/unidades-fsp/:id/edit" element={<RedirectEdit toBase="/unidades" />} />
          <Route path="/dominios" element={<DominiosPage />} />
          <Route path="/dev/ui" element={<DevUi />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}
