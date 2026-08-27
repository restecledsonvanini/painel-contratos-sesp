import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('auth — shell', () => {
  test('sem token em /contracts redireciona ao login', async ({ page }) => {
    await page.goto('/contracts');
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /Entrar/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Navegação principal/i })).toHaveCount(0);
  });

  test('login volta para a rota de origem', async ({ page }) => {
    await page.goto('/contracts');
    await expect(page).toHaveURL(/\/login/);
    await page.getByLabel(/E-mail/i).fill('analista@sesp.pr.gov.br');
    await page.getByLabel(/Senha/i).fill('analista123');
    await page.getByRole('button', { name: /Entrar/i }).click();
    await expect(page).toHaveURL(/\/contracts/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible();
  });

  test('visitante autenticado vê a lista e não o botão Novo', async ({ page }) => {
    await loginAs(page, 'visitante@sesp.pr.gov.br', 'visitante123');
    await page.goto('/contracts');
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('link', { name: /Novo contrato/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Novo contrato/i })).toHaveCount(0);
  });
});
