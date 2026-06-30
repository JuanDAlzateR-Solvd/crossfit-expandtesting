/**
 * Login test data — kept separate from page logic so specs stay declarative.
 */
import { env } from '../config/env';

export interface Credentials {
  readonly username: string;
  readonly password: string;
}

/** A negative-login scenario: bad input plus the error it must produce. */
export interface InvalidCredentialScenario extends Credentials {
  /** Human-readable scenario name, useful for data-driven test titles. */
  readonly name: string;
  /** The flash message the page is expected to show. */
  readonly expectedError: RegExp;
}

/** Known-good credentials (from env, defaulting to the public practice values). */
export const validCredentials: Credentials = {
  username: env.credentials.username,
  password: env.credentials.password,
};

/**
 * Data-driven negative cases for the login flow.
 *
 * Expected messages match the live ExpandTesting site (verified at runtime):
 * the username is checked first, so any bad/empty username yields the username
 * error; a valid username with a bad/empty password yields the password error.
 */
export const invalidCredentials: readonly InvalidCredentialScenario[] = [
  {
    name: 'wrong username',
    username: 'not-a-real-user',
    password: env.credentials.password,
    expectedError: /your username is invalid/i,
  },
  {
    name: 'wrong password',
    username: env.credentials.username,
    password: 'wrong-password',
    expectedError: /your password is invalid/i,
  },
  {
    name: 'empty username',
    username: '',
    password: env.credentials.password,
    expectedError: /your username is invalid/i,
  },
  {
    name: 'empty password',
    username: env.credentials.username,
    password: '',
    expectedError: /your password is invalid/i,
  },
];
