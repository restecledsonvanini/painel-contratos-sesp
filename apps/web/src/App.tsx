import React, { Suspense, lazy } from 'react';
import { Navigate, Routes, Route, useParams } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContractsList = lazy(() => import('./pages/ContractsList'));
const ContractForm = lazy(() => import('./pages/ContractForm'));
const ContractDetail = lazy(() => import('./pages/ContractDetail'));
const FornecedoresList = lazy(() => import('./pages/FornecedoresList'));
const FornecedoresForm = lazy(() => import('./pages/FornecedoresForm'));
const ServidoresList = lazy(() => import('./pages/ServidoresList'));
const ServidoresForm = lazy(() => import('./pages/ServidoresForm'));
const ServicosList = lazy(() => import('./pages/ServicosList'));
const ServicosForm = lazy(() => import('./pages/ServicosForm'));
const UnidadesFspList = lazy(() => import('./pages/UnidadesFspList'));
const UnidadesFspForm = lazy(() => import('./pages/UnidadesFspForm'));
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
          <Route path="/contracts" element={<ContractsList />} />
          <Route path="/contracts/new" element={<ContractForm />} />
          <Route path="/contracts/:id/edit" element={<ContractForm />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />

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

          <Route path="/servicos" element={<ServicosList />} />
          <Route path="/servicos/new" element={<ServicosForm />} />
          <Route path="/servicos/:id/edit" element={<ServicosForm />} />
          <Route path="/unidades-fsp" element={<UnidadesFspList />} />
          <Route path="/unidades-fsp/new" element={<UnidadesFspForm />} />
          <Route path="/unidades-fsp/:id/edit" element={<UnidadesFspForm />} />
          <Route path="/dominios" element={<DominiosPage />} />
          <Route path="/dev/ui" element={<DevUi />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}
