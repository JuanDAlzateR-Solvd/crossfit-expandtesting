import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/** Page Object for `/forgot-password`. */
export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/forgot-password');
    this.emailInput = page.getByLabel('E-mail');
    this.submitButton = page.getByRole('button', { name: /retrieve password/i });
  }

  /** Enter an email and submit the password-recovery form. */
  async requestReset(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  /** Assert the resulting flash banner contains the given message. */
  async expectMessage(message: string | RegExp): Promise<void> {
    await this.expectFlash(message);
  }
}
