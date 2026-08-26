import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Page } from '@painel/ui';

export default function NotFound() {
  return (
    <Page title="Página não encontrada" description="Esse endereço não existe neste painel.">
      <Card variant="bordered" className="space-y-3 p-4 text-sm">
        <p>Confira o link ou volte ao início.</p>
        <Link className="text-[var(--primary)] underline" to="/painel">
          Voltar ao painel
        </Link>
      </Card>
    </Page>
  );
}
