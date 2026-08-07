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

test.describe('RBAC — Nova alteração contratual', () => {
  test('ANALISTA não vê botão Nova alteração no detalhe', async ({ page }) => {
    await loginAs(page, 'analista@sesp.pr.gov.br', 'analista123');
    await page.goto('/contracts');
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible({
      timeout: 15_000,
    });

    const row = page.getByRole('link', { name: /Abrir contrato/i }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.click();
    await expect(page.getByRole('navigation', { name: /Breadcrumb/i })).toBeVisible({
      timeout: 15_000,
    });

    await expect(page.getByRole('button', { name: /Nova alteração/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Nova alteração/i })).toHaveCount(0);
  });

  test('GESTOR vê Nova alteração e form pré-preenche data fim', async ({ page }) => {
    await loginAs(page, 'gestor@sesp.pr.gov.br', 'gestor123');
    await page.goto('/contracts');
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible({
      timeout: 15_000,
    });

    const row = page.getByRole('link', { name: /Abrir contrato/i }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.click();
    await expect(page.getByRole('navigation', { name: /Breadcrumb/i })).toBeVisible({
      timeout: 15_000,
    });

    const nova = page.getByRole('link', { name: /Nova alteração/i }).first();
    await expect(nova).toBeVisible({ timeout: 15_000 });
    await nova.click();

    await expect(page.getByRole('heading', { name: /Nova alteração contratual/i })).toBeVisible({
      timeout: 15_000,
    });
    const dataFim = page.getByLabel(/Nova data fim vigência/i);
    await expect(dataFim).toBeVisible();
    await expect(dataFim).not.toHaveValue('');
  });
});
