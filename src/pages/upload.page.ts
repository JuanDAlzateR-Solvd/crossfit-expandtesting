import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for `/upload`.
 *
 * The file input and submit button expose stable `data-testid` attributes
 * (`file-input` / `file-submit`), so we target those via `getByTestId`.
 */
export class UploadPage extends BasePage {
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly uploadedFiles: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    super(page, '/upload');
    this.fileInput = page.getByTestId('file-input');
    this.uploadButton = page.getByTestId('file-submit');
    // The success panel exposes an id (no data-testid) and renders the uploaded
    // file name (server-prefixed with a timestamp) inside it.
    this.uploadedFiles = page.locator('#uploaded-files');
    this.successHeading = page.getByRole('heading', { name: /file uploaded/i });
  }

  /** Select a file (by absolute path) and submit the upload. */
  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }

  /**
   * Assert the upload succeeded: the "File Uploaded!" heading is shown and the
   * uploaded-files panel reports the given file name. (The server prefixes a
   * timestamp, so the original name appears as a substring.)
   */
  async expectUploadSuccess(fileName: string): Promise<void> {
    await expect(this.successHeading).toBeVisible();
    await expect(this.uploadedFiles).toContainText(fileName);
  }
}
