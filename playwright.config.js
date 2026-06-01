import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  reporter: [['html', { outputFolder: 'tests/report' }], ['list']],
  use: {
    baseURL: 'https://www.interviewalpha.ai',
    trace: 'on-first-retry',
  },
});
