import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContractCreateSchema } from '../../../packages/schema/src/contracts';
import axios from 'axios';

export default function ContractForm() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(ContractCreateSchema as any) });

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/.netlify/functions/api/contracts', data);
      alert('Contrato criado (verificar staging)');
    } catch (err) {
      alert('Erro ao criar contrato');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm">numGms</label>
        <input {...register('numGms', { valueAsNumber: true })} className="input" />
      </div>
      <div>
        <label className="block text-sm">anoGms</label>
        <input {...register('anoGms', { valueAsNumber: true })} className="input" />
      </div>
      <div>
        <label className="block text-sm">valorAnual (BRL)</label>
        <input {...register('valorAnual', { valueAsNumber: true })} className="input" />
      </div>

      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Salvar</button>
    </form>
  );
}
