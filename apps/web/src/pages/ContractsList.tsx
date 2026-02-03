import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

async function fetchContracts() {
  const res = await axios.get('/.netlify/functions/api/contracts');
  return res.data;
}

export default function ContractsList() {
  const { data, isLoading, error } = useQuery(['contracts'], fetchContracts);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading contracts</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Contratos</h2>
        <Link to="/contracts/new" className="bg-blue-600 text-white px-3 py-1 rounded">Novo Contrato</Link>
      </div>

      <table className="min-w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-2">Protocolo</th>
            <th className="p-2">GMS / Ano</th>
            <th className="p-2">Unidade</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.protocoloCabeca || '-'}</td>
                <td className="p-2">{c.numGms}/{c.anoGms}</td>
                <td className="p-2">{c.unidadeFspId}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={3} className="p-2">Nenhum contrato encontrado.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
