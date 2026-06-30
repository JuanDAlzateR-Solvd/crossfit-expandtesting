/**
 * Environment configuration.
 *
 * Single source of truth for environment-dependent values. Everything is read
 * from `process.env` with sensible defaults so the suite runs zero-config
 * locally, yet every value can be overridden in CI or other environments.
 *
 * The default credentials are the ones *publicly documented* on
 * practice.expandtesting.com for automation practice — they are not secrets.
 * Real secrets must always come from the environment, never from source.
 */

export interface EnvConfig {
  /** Base URL of the system under test. */
  readonly baseURL: string;
  /** Known-good login credentials. */
  readonly credentials: Readonly<{ username: string; password: string }>;
  /** Known-good one-time-password login values. */
  readonly otp: Readonly<{ email: string; code: string }>;
}

export const env: EnvConfig = {
  baseURL: process.env.BASE_URL ?? 'https://practice.expandtesting.com',
  credentials: {
    username: process.env.TEST_USERNAME ?? 'practice',
    password: process.env.TEST_PASSWORD ?? 'SuperSecretPassword!',
  },
  otp: {
    email: process.env.OTP_EMAIL ?? 'practice@expandtesting.com',
    code: process.env.OTP_CODE ?? '214365',
  },
};
