import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for `/tables` (static, sortable data tables).
 *
 * The page renders two tables (`#table1`, `#table2`); `#table1` is the
 * sortable one used for assertions. Columns: Last Name, First Name, Email,
 * Due, Web Site, Action.
 */
export class DataTablesPage extends BasePage {
  readonly table: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    super(page, '/tables');
    this.table = page.locator('#table1');
    this.rows = this.table.locator('tbody tr');
  }

  /** The clickable column header used to trigger sorting. */
  columnHeader(name: string | RegExp): Locator {
    return this.table.getByRole('columnheader', { name });
  }

  /** Sort the table by clicking the given column header. */
  async sortBy(columnName: string | RegExp): Promise<void> {
    await this.columnHeader(columnName).click();
  }

  /** All trimmed cell texts for a given (0-based) column index, top to bottom. */
  async columnValues(columnIndex: number): Promise<string[]> {
    const rowCount = await this.rows.count();
    const values: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      const cell = this.rows.nth(i).locator('td').nth(columnIndex);
      values.push((await cell.innerText()).trim());
    }
    return values;
  }
}
