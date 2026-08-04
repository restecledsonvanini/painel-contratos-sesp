import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContractsList = lazy(() => import('./pages/ContractsList'));
const ContractForm = lazy(() => import('./pages/ContractForm'));
const ContractDetail = lazy(() => import('./pages/ContractDetail'));
const EmpresasList = lazy(() => import('./pages/EmpresasList'));
const FornecedoresList = lazy(() => import('./pages/FornecedoresList'));
const ServicosList = lazy(() => import('./pages/ServicosList'));
const EntidadesGestorasList = lazy(() => import('./pages/EntidadesGestorasList'));
const EmpresasForm = lazy(() => import('./pages/EmpresasForm'));
const EntidadesGestorasForm = lazy(() => import('./pages/EntidadesGestorasForm'));
const UnidadesFspList = lazy(() => import('./pages/UnidadesFspList'));
const UnidadesFspForm = lazy(() => import('./pages/UnidadesFspForm'));
const FornecedoresForm = lazy(() => import('./pages/FornecedoresForm'));
const ServicosForm = lazy(() => import('./pages/ServicosForm'));
const DevUi = lazy(() => import('./pages/DevUi'));

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
          <Route path="/empresas" element={<EmpresasList />} />
          <Route path="/empresas/new" element={<EmpresasForm />} />
          <Route path="/empresas/:id/edit" element={<EmpresasForm />} />
          <Route path="/fornecedores" element={<FornecedoresList />} />
          <Route path="/fornecedores/new" element={<FornecedoresForm />} />
          <Route path="/fornecedores/:id/edit" element={<FornecedoresForm />} />
          <Route path="/servicos" element={<ServicosList />} />
          <Route path="/servicos/new" element={<ServicosForm />} />
          <Route path="/servicos/:id/edit" element={<ServicosForm />} />
          <Route path="/entidades-gestoras" element={<EntidadesGestorasList />} />
          <Route path="/entidades-gestoras/new" element={<EntidadesGestorasForm />} />
          <Route path="/entidades-gestoras/:id/edit" element={<EntidadesGestorasForm />} />
          <Route path="/unidades-fsp" element={<UnidadesFspList />} />
          <Route path="/unidades-fsp/new" element={<UnidadesFspForm />} />
          <Route path="/unidades-fsp/:id/edit" element={<UnidadesFspForm />} />
          <Route path="/dev/ui" element={<DevUi />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}
