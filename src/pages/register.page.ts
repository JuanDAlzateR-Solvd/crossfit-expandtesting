import { type Page, type Locator } from '@playwright/test';
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

  /** Assert the resulting flash banner contains the given message. */
  async expectMessage(message: string | RegExp): Promise<void> {
    await this.expectFlash(message);
  }
}
