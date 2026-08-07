import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

/** e2e com AUTH ligada para exercitar gates de papel (canAct / RequireRole). */
const authEnv = {
  AUTH_REQUIRED: '1',
  VITE_AUTH_REQUIRED: '1',
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
      url: 'http://localhost:8888/api/v1/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { ...process.env, ...authEnv },
    },
    {
      command: 'npm run dev',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { ...process.env, ...authEnv },
    },
  ],
});
