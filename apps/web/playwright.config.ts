import { defineConfig, devices } from '@playwright/test';

/** Portas dedicadas ao e2e — evita colidir com `npm run dev` (:5173/:8888) sem AUTH. */
const webPort = Number(process.env.PW_WEB_PORT || 5174);
const apiPort = Number(process.env.PW_API_PORT || 8889);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${webPort}`;

/** e2e com AUTH ligada para exercitar gates de papel (canAct / RequireRole). */
const authEnv = {
  AUTH_REQUIRED: '1',
  VITE_AUTH_REQUIRED: '1',
  AUTH_DEV_BYPASS: '0',
  AUTH_EMAIL_DOMAINS: '*',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://painel:pass@localhost:5434/painel_db',
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: [
    {
      command: 'npm run dev --prefix ../api',
      url: `http://localhost:${apiPort}/api/v1/health`,
      reuseExistingServer: process.env.PW_REUSE === '1',
      timeout: 120_000,
      env: { ...process.env, ...authEnv, PORT: String(apiPort) },
    },
    {
      command: `npm run dev -- --port ${webPort} --strictPort`,
      url: baseURL,
      reuseExistingServer: process.env.PW_REUSE === '1',
      timeout: 120_000,
      env: { ...process.env, ...authEnv, PW_API_PORT: String(apiPort) },
    },
  ],
});
