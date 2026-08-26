import React from 'react';
import { Button, Card, Page } from '@painel/ui';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Page title="Algo deu errado" description="A tela quebrou. Recarregue para continuar.">
        <Card variant="bordered" className="space-y-3 p-4 text-sm">
          <p>Se o erro persistir, volte ao painel e tente de novo.</p>
          <Button type="button" onClick={() => window.location.assign('/painel')}>
            Voltar ao painel
          </Button>
        </Card>
      </Page>
    );
  }
}
