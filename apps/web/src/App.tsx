import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContractsList = lazy(() => import('./pages/ContractsList'));
const ContractForm = lazy(() => import('./pages/ContractForm'));
const ContractDetail = lazy(() => import('./pages/ContractDetail'));

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
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}
