import { test } from '../src/fixtures/test';
import { validFormPayload, invalidFormPayloads } from '../src/data/form-data';

/**
 * Box Drop-In Booking Form — client-side validation on /form-validation.
 * Positive: a fully valid booking reaches the confirmation page. Negative:
 * empty and pattern-invalid submissions stay on the form and show field errors.
 */
test.describe('Box Drop-In Booking Form (/form-validation) @forms', () => {
  test('a valid booking is accepted and reaches the confirmation page @smoke', async ({
    formValidationPage,
  }) => {
    await formValidationPage.goto();
    await formValidationPage.submitForm(validFormPayload);
    await formValidationPage.expectConfirmation();
  });

  test('a booking with a blank required name is rejected @negative', async ({
    formValidationPage,
  }) => {
    await formValidationPage.goto();
    await formValidationPage.submitForm(invalidFormPayloads.blankContactName);
    await formValidationPage.expectValidationError('Please enter your Contact name.');
  });

  test('a malformed contact number is rejected @negative', async ({ formValidationPage }) => {
    await formValidationPage.goto();
    await formValidationPage.submitForm(invalidFormPayloads.badContactNumber);
    await formValidationPage.expectValidationError('Please provide your Contact number.');
  });
});
