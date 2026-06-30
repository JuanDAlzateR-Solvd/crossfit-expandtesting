import { test, expect } from '../src/fixtures/test';

/**
 * Homepage smoke test for the ExpandTesting Practice site.
 *
 * Confirms the landing page loads, its key elements render, and that a known
 * practice feature (the Login page) is reachable from the landing page. Uses
 * the HomePage page object (no raw selectors here) and web-first assertions.
 */
test.describe('Practice site smoke (/) @smoke', () => {
  test('landing page loads with key elements and the Login feature is reachable', async ({
    homePage,
    page,
  }) => {
    const response = await homePage.open();

    // Page loads with a successful HTTP response.
    expect(response?.ok()).toBeTruthy();

    // Title + key landing elements (main heading, feature section, feature link) are visible.
    await homePage.expectLoaded();

    // A known feature link is reachable: following it lands on the Login page.
    await homePage.openLogin();
    await expect(page).toHaveURL(/\/login$/);
  });
});
