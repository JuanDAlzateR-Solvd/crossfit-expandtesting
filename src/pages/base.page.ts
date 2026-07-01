import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Abstract base for every Page Object.
 *
 * Holds the Playwright `page` handle and the page's path (relative to the
 * configured `baseURL`), and provides navigation + assertion helpers shared
 * across the ExpandTesting pages — most of which surface a Bootstrap flash
 * banner rendered with `role="alert"`.
 *
 * Subclasses pass their own path via `super(page, '/path')` and declare their
 * locators as `readonly` properties in their constructor.
 */
export abstract class BasePage {
  protected constructor(
    protected readonly page: Page,
    /** Path relative to `baseURL`, e.g. `/login`. */
    protected readonly path: string,
  ) {}

  /**
   * Navigate to this page (relative to the configured `baseURL`).
   *
   * Waits for `domcontentloaded` rather than the full `load` event: the practice
   * site embeds slow third-party ad/affiliate resources that can otherwise push
   * navigation past the timeout. The DOM we test against is ready at DCL.
   */
  async goto(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  /** The current browser URL. */
  url(): string {
    return this.page.url();
  }

  /** The current document title. */
  async title(): Promise<string> {
    return this.page.title();
  }

  /** Shared flash / notification banner (Bootstrap alert) used across pages. */
  protected get flashAlert(): Locator {
    return this.page.getByRole('alert');
  }

  /** Assert the flash banner is visible and contains the given text. */
  async expectFlash(message: string | RegExp): Promise<void> {
    await expect(this.flashAlert).toBeVisible();
    await expect(this.flashAlert).toContainText(message);
  }
}
