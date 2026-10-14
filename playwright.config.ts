import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:5187', browserName: 'chromium', screenshot: 'only-on-failure' },
  webServer: { command: 'pnpm dev', url: 'http://127.0.0.1:5187/api/health', reuseExistingServer: true, timeout: 60_000 },
  reporter: 'list',
});
