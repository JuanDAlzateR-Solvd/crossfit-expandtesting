import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for `/dynamic-pagination-table` (a DataTables-powered grid).
 *
 * Supports paging, page-size selection, and search/filter. Columns: Student
 * Name, Gender, Class Level, Home State, Major, Extracurricular Activity.
 *
 * DataTables renders its pagination as anchor "page links"; locator details
 * are finalised when the table test suite is built.
 */
export class PaginationTablePage extends BasePage {
  readonly table: Locator;
  readonly rows: Locator;
  readonly pageSizeSelect: Locator;
  readonly searchInput: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    super(page, '/dynamic-pagination-table');
    this.table = page.locator('#example');
    this.rows = this.table.locator('tbody tr');
    this.pageSizeSelect = page.getByRole('combobox');
    this.searchInput = page.getByRole('searchbox');
    this.nextButton = page.getByRole('link', { name: 'Next' });
    this.previousButton = page.getByRole('link', { name: 'Previous' });
  }

  /** Choose how many rows are shown per page (e.g. 3, 5, 10). */
  async setPageSize(size: number): Promise<void> {
    await this.pageSizeSelect.selectOption(String(size));
  }

  /** Type a term into the DataTables search/filter box. */
  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  /** Advance to the next page of results. */
  async goToNextPage(): Promise<void> {
    await this.nextButton.click();
  }

  /** Number of data rows currently rendered. */
  async visibleRowCount(): Promise<number> {
    return this.rows.count();
  }

  /** A locator for the first body row whose text contains the given string. */
  rowContaining(text: string | RegExp): Locator {
    return this.rows.filter({ hasText: text });
  }
}
