import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { RequireAuth } from './components/RequireAuth';
import { RequireRole } from './components/RequireRole';
import { LookupsProvider } from './providers/LookupsProvider';

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
const DotacaoForm = lazy(() => import('./pages/DotacaoForm'));
const AlteracaoForm = lazy(() => import('./pages/AlteracaoForm'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UnidadeForm = lazy(() => import('./pages/UnidadeForm'));
const DevUi = lazy(() => import('./pages/DevUi'));

function RedirectEdit({ toBase }: { toBase: string }) {
  const { id } = useParams();
  return <Navigate to={`${toBase}/${id}/edit`} replace />;
}

function AuthenticatedShell() {
  return (
    <RequireAuth>
      <LookupsProvider>
        <DashboardLayout />
      </LookupsProvider>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div>Carregando…</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthenticatedShell />}>
          <Route path="/" element={<Navigate to="/painel?tab=tatico" replace />} />
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/estrategico" element={<Navigate to="/painel?tab=estrategico" replace />} />
          <Route path="/alertas" element={<Navigate to="/painel?tab=alertas" replace />} />

          <Route path="/contracts" element={<ContractsList />} />
          <Route
            path="/contracts/new"
            element={
              <RequireRole min="ANALISTA">
                <ContractForm />
              </RequireRole>
            }
          />
          <Route
            path="/contracts/:id/edit"
            element={
              <RequireRole min="ANALISTA">
                <ContractForm />
              </RequireRole>
            }
          />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route
            path="/contracts/:id/alteracoes/nova"
            element={
              <RequireRole min="GESTOR">
                <AlteracaoForm />
              </RequireRole>
            }
          />

          <Route path="/cadastros" element={<CadastrosPage />} />
          <Route
            path="/utilitarios"
            element={
              <RequireRole min="ANALISTA">
                <UtilitariosPage />
              </RequireRole>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <RequireRole min="GESTOR">
                <ConfiguracoesPage />
              </RequireRole>
            }
          />

          <Route path="/fornecedores" element={<Navigate to="/cadastros?tab=fornecedores" replace />} />
          <Route
            path="/fornecedores/new"
            element={
              <RequireRole min="ANALISTA">
                <FornecedoresForm />
              </RequireRole>
            }
          />
          <Route
            path="/fornecedores/:id/edit"
            element={
              <RequireRole min="ANALISTA">
                <FornecedoresForm />
              </RequireRole>
            }
          />
          <Route path="/empresas" element={<Navigate to="/cadastros?tab=fornecedores" replace />} />
          <Route path="/empresas/new" element={<Navigate to="/fornecedores/new" replace />} />
          <Route path="/empresas/:id/edit" element={<RedirectEdit toBase="/fornecedores" />} />

          <Route path="/servidores" element={<Navigate to="/cadastros?tab=servidores" replace />} />
          <Route
            path="/servidores/new"
            element={
              <RequireRole min="ANALISTA">
                <ServidoresForm />
              </RequireRole>
            }
          />
          <Route
            path="/servidores/:id/edit"
            element={
              <RequireRole min="ANALISTA">
                <ServidoresForm />
              </RequireRole>
            }
          />
          <Route path="/entidades-gestoras" element={<Navigate to="/cadastros?tab=servidores" replace />} />
          <Route path="/entidades-gestoras/new" element={<Navigate to="/servidores/new" replace />} />
          <Route path="/entidades-gestoras/:id/edit" element={<RedirectEdit toBase="/servidores" />} />

          <Route path="/catalogo-itens" element={<Navigate to="/cadastros?tab=catalogo" replace />} />
          <Route
            path="/catalogo-itens/new"
            element={
              <RequireRole min="ANALISTA">
                <CatalogoForm />
              </RequireRole>
            }
          />
          <Route
            path="/catalogo-itens/:id/edit"
            element={
              <RequireRole min="ANALISTA">
                <CatalogoForm />
              </RequireRole>
            }
          />
          <Route path="/servicos" element={<Navigate to="/cadastros?tab=catalogo" replace />} />
          <Route path="/servicos/new" element={<Navigate to="/catalogo-itens/new" replace />} />
          <Route path="/servicos/:id/edit" element={<RedirectEdit toBase="/catalogo-itens" />} />

          <Route path="/dotacoes" element={<Navigate to="/cadastros?tab=dotacoes" replace />} />
          <Route
            path="/dotacoes/new"
            element={
              <RequireRole min="ANALISTA">
                <DotacaoForm />
              </RequireRole>
            }
          />
          <Route
            path="/dotacoes/:id/edit"
            element={
              <RequireRole min="ANALISTA">
                <DotacaoForm />
              </RequireRole>
            }
          />
          <Route path="/importacao" element={<Navigate to="/utilitarios?tab=importacao" replace />} />

          <Route path="/unidades" element={<Navigate to="/configuracoes?tab=organizacao" replace />} />
          <Route
            path="/unidades/new"
            element={
              <RequireRole min="GESTOR">
                <UnidadeForm />
              </RequireRole>
            }
          />
          <Route
            path="/unidades/:id/edit"
            element={
              <RequireRole min="GESTOR">
                <UnidadeForm />
              </RequireRole>
            }
          />
          <Route path="/unidades-fsp" element={<Navigate to="/configuracoes?tab=organizacao" replace />} />
          <Route path="/unidades-fsp/new" element={<Navigate to="/unidades/new" replace />} />
          <Route path="/unidades-fsp/:id/edit" element={<RedirectEdit toBase="/unidades" />} />
          <Route path="/dominios" element={<Navigate to="/configuracoes?tab=listas" replace />} />
          <Route path="/dev/ui" element={<DevUi />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
