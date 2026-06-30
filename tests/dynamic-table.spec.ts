import { test, expect } from '../src/fixtures/test';

/**
 * Live WOD Metrics — the randomized table at /dynamic-table.
 * Columns and rows shuffle on each load, so values are located by header/row
 * text. Verifies the highlighted Chrome-CPU label matches the table cell.
 */
test.describe('Live WOD Metrics (/dynamic-table) @tables', () => {
  test('the highlighted Chrome CPU matches the value in the table @smoke', async ({
    dynamicTablePage,
  }) => {
    await dynamicTablePage.goto();
    await dynamicTablePage.expectChromeCpuMatches();
  });

  test('the metrics table lists the Chrome process @regression', async ({ dynamicTablePage }) => {
    await dynamicTablePage.goto();
    await expect(dynamicTablePage.chromeCpuLabel).toBeVisible();
    await expect(dynamicTablePage.table.getByText('Chrome', { exact: true })).toBeVisible();
  });
});
