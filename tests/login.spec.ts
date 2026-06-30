import { test } from '../src/fixtures/test';
import { validCredentials, invalidCredentials } from '../src/data/credentials';

/**
 * Athlete Login — authentication against /login.
 * Positive: valid credentials reach the secure area. Negative: data-driven over
 * the invalid-credential scenarios, each expecting the correct error flash.
 */
test.describe('Athlete Login (/login) @auth', () => {
  test('a registered athlete signs in with valid credentials and reaches the secure area @smoke', async ({
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.loginAs(validCredentials);
    await loginPage.expectLoggedIn();
  });

  for (const scenario of invalidCredentials) {
    test(`login is rejected: ${scenario.name} @negative`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(scenario.username, scenario.password);
      await loginPage.expectError(scenario.expectedError);
    });
  }
});
