import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/** Page Object for `/register`. */
export class RegisterPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/register');
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password');
    this.submitButton = page.getByRole('button', { name: /register/i });
  }

  /** Fill and submit the registration form. */
  async register(
    username: string,
    password: string,
    confirmPassword: string = password,
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButton.click();
  }

  /** Assert a rejected registration: flash visible and page remains on /register. */
  async expectMessage(message: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(/\/register$/);
    await this.expectFlash(message);
  }

  /** Assert a successful registration: flash visible and redirected to /login. */
  async expectRegistrationSucceeded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login$/);
    await this.expectFlash('Successfully registered, you can log in now.');
  }
}
