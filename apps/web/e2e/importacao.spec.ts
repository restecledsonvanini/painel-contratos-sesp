import { expect, test } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('importação CSV', () => {
  test('dry-run separa linhas válidas e bloqueia aplicar com erro', async ({ page }) => {
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/utilitarios?tab=importacao');
    await expect(page.getByRole('heading', { name: /Importação CSV/i })).toBeVisible({
      timeout: 15_000,
    });

    await page.getByRole('button', { name: /Restaurar exemplo/i }).click();
    await page.getByRole('button', { name: /1\. Dry-run/i }).click();

    await expect(page.getByText(/1 válidas/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/1 com erro/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /2\. Aplicar/i })).toBeDisabled();
  });

  test('aplica lote 100% válido', async ({ page }) => {
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/utilitarios?tab=importacao');
    await expect(page.getByRole('heading', { name: /Importação CSV/i })).toBeVisible({
      timeout: 15_000,
    });

    const doc = `${Date.now().toString().slice(-12)}99`;
    const csv = [
      'documento,razaoSocial,tipoPessoa,nomeFantasia',
      `${doc},Fornecedor E2E SA,JURIDICA,E2E`,
    ].join('\n');

    await page.locator('textarea').fill(csv);
    await page.getByRole('button', { name: /1\. Dry-run/i }).click();
    await expect(page.getByText(/1 válidas/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/0 com erro/i)).toBeVisible();

    await page.getByRole('button', { name: /2\. Aplicar/i }).click();
    await expect(page.getByText(/APLICADO/i)).toBeVisible({ timeout: 15_000 });
  });
});
