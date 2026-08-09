import { defineConfig, devices } from '@playwright/test';

const IS_CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  reporter: IS_CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @devtools-hub/api dev',
      url: 'http://localhost:4000/api/v1/ping',
      reuseExistingServer: !IS_CI,
      timeout: 60_000,
    },
    {
      command: 'pnpm --filter @devtools-hub/web dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !IS_CI,
      timeout: 60_000,
    },
  ],
});
