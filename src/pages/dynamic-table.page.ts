import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for `/dynamic-table`.
 *
 * The table's columns AND rows are shuffled on every page load and the values
 * are randomized, so nothing can be located by fixed index. Cells are found by
 * resolving the column from its header text and the row from its label text —
 * the resilient pattern this page is designed to exercise. The page also shows
 * a highlighted `#chrome-cpu` label that must equal the Chrome row's CPU cell.
 */
export class DynamicTablePage extends BasePage {
  readonly table: Locator;
  readonly chromeCpuLabel: Locator;

  constructor(page: Page) {
    super(page, '/dynamic-table');
    this.table = page.getByRole('table');
    this.chromeCpuLabel = page.locator('#chrome-cpu');
  }

  /** The CPU percentage shown in the highlighted label, e.g. "7.9%". */
  async displayedChromeCpu(): Promise<string> {
    const text = (await this.chromeCpuLabel.innerText()).trim(); // "Chrome CPU: 7.9%"
    return text.match(/[\d.]+%/)?.[0] ?? text;
  }

  /** Read a cell by locating its column via header text and its row via label text. */
  async cell(rowLabel: string, columnHeader: string): Promise<string> {
    const headers = await this.table.getByRole('columnheader').allInnerTexts();
    const columnIndex = headers.findIndex((h) => h.trim().toLowerCase() === columnHeader.toLowerCase());
    const row = this.table.getByRole('row').filter({ hasText: rowLabel });
    return (await row.getByRole('cell').nth(columnIndex).innerText()).trim();
  }

  /** The Chrome row's CPU cell value, located by header/row text (not index). */
  async chromeCpuFromTable(): Promise<string> {
    return this.cell('Chrome', 'CPU');
  }

  /** Assert the highlighted label matches the value in the table cell. */
  async expectChromeCpuMatches(): Promise<void> {
    const displayed = await this.displayedChromeCpu();
    const fromTable = await this.chromeCpuFromTable();
    expect(fromTable).toBe(displayed);
  }
}
