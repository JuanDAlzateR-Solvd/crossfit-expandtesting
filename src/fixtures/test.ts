/**
 * Custom Playwright test fixtures.
 *
 * Extends the base `test` with a worker/test-scoped instance of each Page
 * Object, so specs receive ready-to-use page objects by destructuring:
 *
 * ```ts
 * import { test, expect } from '../src/fixtures/test';
 *
 * test('login works', async ({ loginPage }) => {
 *   await loginPage.goto();
 *   await loginPage.login('practice', 'SuperSecretPassword!');
 *   await loginPage.expectLoggedIn();
 * });
 * ```
 */
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { FormValidationPage } from '../pages/form-validation.page';
import { UploadPage } from '../pages/upload.page';
import { DataTablesPage } from '../pages/data-tables.page';
import { PaginationTablePage } from '../pages/pagination-table.page';
import { DynamicTablePage } from '../pages/dynamic-table.page';

/** The set of page objects injected into every test. */
export interface PageObjects {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  forgotPasswordPage: ForgotPasswordPage;
  formValidationPage: FormValidationPage;
  uploadPage: UploadPage;
  dataTablesPage: DataTablesPage;
  paginationTablePage: PaginationTablePage;
  dynamicTablePage: DynamicTablePage;
}

export const test = base.extend<PageObjects>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  formValidationPage: async ({ page }, use) => {
    await use(new FormValidationPage(page));
  },
  uploadPage: async ({ page }, use) => {
    await use(new UploadPage(page));
  },
  dataTablesPage: async ({ page }, use) => {
    await use(new DataTablesPage(page));
  },
  paginationTablePage: async ({ page }, use) => {
    await use(new PaginationTablePage(page));
  },
  dynamicTablePage: async ({ page }, use) => {
    await use(new DynamicTablePage(page));
  },
});

export { expect };
