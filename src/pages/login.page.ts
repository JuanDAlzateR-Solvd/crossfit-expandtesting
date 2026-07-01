import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import type { Credentials } from '../data/credentials';

/**
 * Page Object for `/login`.
 *
 * Reference example for the suite: locators are exposed as `readonly`
 * properties (preferring accessible label/role locators) and behaviour is
 * exposed as high-level action/assertion methods.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/login');
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /login/i });
  }

  /** Fill the form and submit. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /** Convenience overload for a typed {@link Credentials} object. */
  async loginAs(credentials: Credentials): Promise<void> {
    await this.login(credentials.username, credentials.password);
  }

  /** Assert a successful login (redirect to `/secure` + success banner). */
  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/secure$/);
    await this.expectFlash('You logged into a secure area!');
  }

  /** Assert login failed with the given error message and the page stayed on /login. */
  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(/\/login$/);
    await this.expectFlash(message);
  }
}
