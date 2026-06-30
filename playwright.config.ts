import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

/**
 * Playwright configuration for the CrossFit-themed UI automation suite,
 * targeting https://practice.expandtesting.com (a public site built for
 * automation practice).
 *
 * @see https://playwright.dev/docs/test-configuration
 */
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel. */
  fullyParallel: true,

  /* Fail the build on CI if test.only is accidentally left in the source. */
  forbidOnly: isCI,

  /* Retry once on CI, never locally. */
  retries: isCI ? 1 : 0,

  /* Limit workers on CI for stability; use the default locally. */
  workers: isCI ? 2 : undefined,

  /* Per-test timeout and assertion timeout. */
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  /* HTML report. */
  reporter: [['html', { open: 'never' }], ['list']],

  /* Shared settings for all projects. */
  use: {
    baseURL: env.baseURL,

    /* Collect trace on first retry, screenshots on failure, video on failure. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  /* Cross-browser projects. */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
