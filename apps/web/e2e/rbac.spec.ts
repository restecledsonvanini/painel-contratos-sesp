import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('RBAC — botão Novo contrato', () => {
  test('VISITANTE não vê Novo contrato', async ({ page }) => {
    await loginAs(page, 'visitante@sesp.pr.gov.br', 'visitante123');
    await page.goto('/contracts');
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('button', { name: /Novo contrato/i })).toHaveCount(0);
  });

  test('ANALISTA vê Novo contrato', async ({ page }) => {
    await loginAs(page, 'analista@sesp.pr.gov.br', 'analista123');
    await page.goto('/contracts');
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('button', { name: /Novo contrato/i })).toBeVisible();
  });
});
