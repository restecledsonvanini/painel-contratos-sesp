import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loginAs } from './helpers/auth';

test.describe('detalhe do contrato', () => {
  test('troca de aba na URL e axe no resumo', async ({ page }) => {
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/contracts');
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible({ timeout: 15_000 });

    const row = page.getByRole('link', { name: /Abrir contrato/i }).first();
    test.skip((await row.count()) === 0, 'sem contrato no seed');
    await row.click();

    const crumbs = page.getByRole('navigation', { name: /Breadcrumb/i });
    await expect(crumbs).toBeVisible({ timeout: 15_000 });

    await page.getByRole('tab', { name: /Linha do tempo/i }).click();
    await expect(page).toHaveURL(/tab=timeline/);
    await expect(page.locator('[role="tabpanel"]:not([hidden]) [tabindex="-1"]')).toBeFocused();

    await page.getByRole('tab', { name: /^Resumo$/i }).click();
    await expect(page).toHaveURL(/tab=resumo/);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .disableRules(['color-contrast'])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(serious, `resumo: ${serious.map((v) => v.id).join(', ')}`).toEqual([]);
  });
});
