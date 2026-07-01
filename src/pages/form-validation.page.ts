import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import type { FormValidationPayload } from '../data/form-data';

/**
 * Page Object for `/form-validation`.
 *
 * NOTE: the live page ships a markup bug — both the "Contact number" and
 * "PickUp Date" inputs share `id="validationCustom05"`, so a label lookup for
 * the date resolves to the wrong field. We therefore locate the date input by
 * its `name` attribute (a documented, justified fallback to CSS), while the
 * other fields use clean accessible label/role locators.
 */
export class FormValidationPage extends BasePage {
  readonly contactNameInput: Locator;
  readonly contactNumberInput: Locator;
  readonly pickupDateInput: Locator;
  readonly paymentMethodSelect: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/form-validation');
    this.contactNameInput = page.getByLabel('Contact Name');
    this.contactNumberInput = page.getByLabel('Contact number');
    this.pickupDateInput = page.locator('input[name="pickupdate"]'); // see NOTE: duplicate id
    this.paymentMethodSelect = page.getByLabel('Payment Method');
    this.submitButton = page.getByRole('button', { name: /register/i });
  }

  /** Fill any subset of the form; only provided fields are touched. */
  async fillForm(payload: Partial<FormValidationPayload>): Promise<void> {
    if (payload.contactName !== undefined) await this.contactNameInput.fill(payload.contactName);
    if (payload.contactNumber !== undefined)
      await this.contactNumberInput.fill(payload.contactNumber);
    if (payload.pickupDate !== undefined) await this.pickupDateInput.fill(payload.pickupDate);
    if (payload.paymentMethod !== undefined) {
      // Select by option value (`cashondelivery` / `card`) — robust to label whitespace.
      await this.paymentMethodSelect.selectOption(payload.paymentMethod);
    }
  }

  /** Fill (a subset of) the form and submit it. */
  async submitForm(payload: Partial<FormValidationPayload>): Promise<void> {
    await this.fillForm(payload);
    await this.submitButton.click();
  }

  /** The inline validation feedback element carrying the given message.
   * Scoped to Bootstrap's .invalid-feedback elements to avoid matching
   * unrelated page text. */
  errorFor(message: string | RegExp): Locator {
    return this.page.locator('.invalid-feedback').getByText(message);
  }

  /** Assert an invalid submit kept us on the form and surfaced the given error. */
  async expectValidationError(message: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(/\/form-validation$/);
    await expect(this.errorFor(message)).toBeVisible();
  }

  /** Assert a valid submit reached the confirmation page. */
  async expectConfirmation(): Promise<void> {
    await expect(this.page).toHaveURL(/\/form-confirmation$/);
    await expect(this.page.getByText(/thank you for validating your ticket/i)).toBeVisible();
  }
}
