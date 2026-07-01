import { test } from '../src/fixtures/test';

/**
 * Athlete Sign-Up — registration against /register (server-validated).
 *
 * Usernames may contain only lowercase letters, digits, and single hyphens, so
 * the positive case builds a unique hyphenated name per run (idempotent). Flash
 * messages below were confirmed against the live site.
 */
test.describe('Athlete Sign-Up (/register) @auth', () => {
  test('a new athlete registers successfully and is sent to log in @smoke', async ({
    registerPage,
  }) => {
    const username = `athlete-${Date.now()}`;
    await registerPage.goto();
    await registerPage.register(username, 'Burpees123!');
    await registerPage.expectRegistrationSucceeded();
  });

  test('registration is rejected when the passwords do not match @negative', async ({
    registerPage,
  }) => {
    await registerPage.goto();
    await registerPage.register(`athlete-${Date.now()}`, 'Burpees123!', 'Different123!');
    await registerPage.expectMessage('Passwords do not match.');
  });

  test('registration is rejected when required fields are missing @negative', async ({
    registerPage,
  }) => {
    await registerPage.goto();
    await registerPage.register('', '', '');
    await registerPage.expectMessage('All fields are required.');
  });
});
