import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, SidebarProvider, Toaster } from '@painel/ui';
import { AuthProvider } from './providers/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';
import './index.css';
import './theme.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter
              future={{
                v7_relativeSplatPath: true,
                v7_startTransition: true,
              }}
            >
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </SidebarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
