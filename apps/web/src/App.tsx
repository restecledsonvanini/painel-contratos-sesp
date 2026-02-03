import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const ContractsList = lazy(() => import('./pages/ContractsList'));
const ContractForm = lazy(() => import('./pages/ContractForm'));

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">Centro de Inteligência Contratual</h1>
        <nav className="mt-2">
          <Link to="/">Dashboard</Link> | <Link to="/contracts">Contratos</Link>
        </nav>
      </header>

      <main className="p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<div>Dashboard (placeholder)</div>} />
            <Route path="/contracts" element={<ContractsList />} />
            <Route path="/contracts/new" element={<ContractForm />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
