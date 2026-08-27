import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loginAs } from './helpers/auth';

async function assertNoCriticalAxe(page: import('@playwright/test').Page, context: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .disableRules([
      // Charts/SVGs do Recharts geram ruído de contraste/região em smoke
      'color-contrast',
    ])
    .analyze();

  const serious = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  expect(serious, `${context}: ${serious.map((v) => v.id).join(', ')}`).toEqual([]);
}

test.describe('smoke + a11y', () => {
  test('painel tático carrega e passa axe', async ({ page }) => {
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Painel tático/i })).toBeVisible();
    await expect(page.locator('#conteudo-principal')).toBeVisible();
    await assertNoCriticalAxe(page, 'tático');
  });

  test('lista de contratos e skip-link', async ({ page }) => {
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/contracts');
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible({ timeout: 15_000 });

    const search = page.getByRole('button', { name: /Buscar contratos/i });
    await expect(search).toBeVisible();
    await search.click();
    await expect(page.getByRole('dialog', { name: /Busca global/i })).toBeVisible();
    await page.keyboard.press('Escape');

    const skip = page.getByRole('link', { name: /Ir para o conteúdo principal/i });
    await skip.focus();
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page.locator('#conteudo-principal')).toBeFocused();

    const row = page.getByRole('link', { name: /Abrir contrato/i }).first();
    if (await row.count()) {
      await row.click();
      const crumbs = page.getByRole('navigation', { name: /Breadcrumb/i });
      await expect(crumbs).toBeVisible({ timeout: 15_000 });
      await expect(crumbs.getByRole('link', { name: /^Contratos$/i })).toBeVisible();
    }

    await assertNoCriticalAxe(page, 'contratos');
  });

  test('login tem alerta acessível em falha', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Entrar/i })).toBeVisible();
    await page.getByLabel(/E-mail/i).fill('invalido@sesp.pr.gov.br');
    await page.getByLabel(/Senha/i).fill('errada');
    await page.getByRole('button', { name: /Entrar/i }).click();
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 15_000 });
    await assertNoCriticalAxe(page, 'login');
  });

  test('painel estratégico e wizard novo contrato', async ({ page }) => {
    await loginAs(page, 'analista@sesp.pr.gov.br', 'analista123');
    await page.goto('/estrategico');
    await expect(page.getByRole('heading', { name: /Painel estratégico/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByLabel(/Filtrar pilar/i)).toBeVisible();
    await expect(page.locator('select.select-field')).toHaveCount(0);
    await assertNoCriticalAxe(page, 'estratégico');

    await page.goto('/contracts/new');
    await expect(page.getByRole('heading', { name: /Novo contrato/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Progresso/i })).toBeVisible();
    await assertNoCriticalAxe(page, 'wizard');
  });

  test('viewport mobile 375px — shell e lista', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'somente projeto mobile');
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Painel tático/i })).toBeVisible();
    await page.getByRole('button', { name: /Abrir menu|Fechar menu/i }).click();
    await expect(page.getByRole('navigation', { name: /Navegação principal/i })).toBeVisible();
  });
});
