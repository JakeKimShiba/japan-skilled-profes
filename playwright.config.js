import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 30000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5181',
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5181 --strictPort',
    url: 'http://127.0.0.1:5181',
    reuseExistingServer: false,
  },
});
