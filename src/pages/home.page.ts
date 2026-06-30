import { type Page, type Locator, type Response, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the landing page (`/`).
 *
 * Surfaces the key landing elements (main heading, the "sample applications"
 * feature section, and the Login feature link) and a reachability helper.
 */
export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly sampleAppsHeading: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page, '/');
    this.heading = page.getByRole('heading', { level: 1 });
    this.sampleAppsHeading = page.getByRole('heading', {
      name: /sample applications for practice test automation/i,
    });
    this.loginLink = page.getByRole('link', { name: 'Test Login Page' });
  }

  /** Navigate to the homepage and return the navigation response. */
  async open(): Promise<Response | null> {
    return this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  /** Assert the core landing elements are present and visible. */
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Automation Testing Practice/i);
    await expect(this.heading).toBeVisible();
    await expect(this.sampleAppsHeading).toBeVisible();
    await expect(this.loginLink).toBeVisible();
  }

  /** Follow the Login feature link from the landing page. */
  async openLogin(): Promise<void> {
    await this.loginLink.click();
  }
}
