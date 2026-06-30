import { test, expect } from '../src/fixtures/test';

/**
 * Athlete Roster — the DataTables-powered paginated grid at
 * /dynamic-pagination-table. Verifies default page size, page-size change, and
 * search/filter behavior.
 */
test.describe('WOD Leaderboard — Athlete Roster (/dynamic-pagination-table) @tables', () => {
  test('the roster shows the default page size of 3 @smoke', async ({ paginationTablePage }) => {
    await paginationTablePage.goto();
    await expect(paginationTablePage.rows).toHaveCount(3);
  });

  test('increasing the page size shows more athletes @regression', async ({
    paginationTablePage,
  }) => {
    await paginationTablePage.goto();
    await paginationTablePage.setPageSize(5);
    await expect(paginationTablePage.rows).toHaveCount(5);
  });

  test('searching filters the roster to matching athletes @regression', async ({
    paginationTablePage,
  }) => {
    await paginationTablePage.goto();
    await paginationTablePage.search('Jane Smith');
    await expect(paginationTablePage.rows).toHaveCount(1);
    await expect(paginationTablePage.table.getByText('Jane Smith')).toBeVisible();
  });
});
