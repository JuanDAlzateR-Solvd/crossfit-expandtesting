import { test, expect } from '../src/fixtures/test';

/**
 * WOD Leaderboard — the sortable static table at /tables.
 * Verifies data presence and that clicking a column header sorts ascending.
 */
test.describe('WOD Leaderboard — sortable (/tables) @tables', () => {
  test('the leaderboard lists the expected athletes @smoke', async ({ dataTablesPage }) => {
    await dataTablesPage.goto();
    await expect(dataTablesPage.rows).toHaveCount(4);
    await expect(dataTablesPage.columnHeader('Last Name')).toBeVisible();
    await expect(dataTablesPage.rowContaining('jsmith@gmail.com')).toBeVisible();
  });

  test('sorting by Last Name orders the leaderboard ascending @regression', async ({
    dataTablesPage,
  }) => {
    await dataTablesPage.goto();
    const before = await dataTablesPage.columnValues(0);
    const ascending = [...before].sort((a, b) => a.localeCompare(b));

    await dataTablesPage.sortBy('Last Name');

    // Poll until the DOM reflects the sorted order (tablesorter reorders async).
    await expect.poll(() => dataTablesPage.columnValues(0)).toEqual(ascending);
  });
});
