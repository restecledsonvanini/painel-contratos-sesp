import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { RequireAuth } from './components/RequireAuth';
import { RequireRole } from './components/RequireRole';
import { LookupsProvider } from './providers/LookupsProvider';
import {
  LEGACY_EDIT_REDIRECTS,
  LEGACY_REDIRECTS,
  LegacyEditRedirect,
} from './lib/legacyRoutes';

const PainelPage = lazy(() => import('./features/painel/pages/PainelPage'));
const CadastrosPage = lazy(() => import('./features/cadastros/pages/CadastrosPage'));
const UtilitariosPage = lazy(() => import('./features/utilitarios/pages/UtilitariosPage'));
const ConfiguracoesPage = lazy(() => import('./features/configuracoes/pages/ConfiguracoesPage'));
const ContractsList = lazy(() => import('./features/contratos/pages/ContractsList'));
const ContractForm = lazy(() => import('./features/contratos/wizard/ContractWizard'));
const ContractDetail = lazy(() => import('./features/contratos/detail/ContractDetail'));
const FornecedoresForm = lazy(() => import('./features/cadastros/pages/FornecedoresForm'));
const ServidoresForm = lazy(() => import('./features/cadastros/pages/ServidoresForm'));
const CatalogoForm = lazy(() => import('./features/cadastros/pages/CatalogoForm'));
const DotacaoForm = lazy(() => import('./features/cadastros/pages/DotacaoForm'));
const AlteracaoForm = lazy(() => import('./features/contratos/pages/AlteracaoForm'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const UnidadeForm = lazy(() => import('./features/configuracoes/pages/UnidadeForm'));
const DevUi = lazy(() => import('./features/dev/pages/DevUi'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
    <Suspense
      fallback={
        <div role="status" aria-busy="true" className="p-6 text-sm text-[var(--text-muted)]">
          Carregando…
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthenticatedShell />}>
          <Route path="/" element={<Navigate to="/painel?tab=tatico" replace />} />
          <Route path="/painel" element={<PainelPage />} />
          {LEGACY_REDIRECTS.map(({ path, to }) => (
            <Route key={path} path={path} element={<Navigate to={to} replace />} />
          ))}
          {LEGACY_EDIT_REDIRECTS.map(({ path, toBase }) => (
            <Route key={path} path={path} element={<LegacyEditRedirect toBase={toBase} />} />
          ))}

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
          <Route path="/dev/ui" element={<DevUi />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
