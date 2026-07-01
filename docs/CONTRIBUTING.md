# Contributing

How to extend this suite correctly. Read `docs/ARCHITECTURE.md` first for the "why".

## Golden rules

1. **Verify against the live site before asserting behavior.** Never invent messages,
   selectors, or flows. If behavior differs from expectation, adjust the test to reality and
   leave a comment.
2. **Selectors live in page objects, never in specs.** Specs call `page-object` methods and
   locators only.
3. **Prefer accessible locators** (`getByRole`/`getByLabel`/`getByText`/`getByTestId`).
   Use CSS/id only when the markup forces it — and comment why.
4. **Keep the gates green:** `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm test`.
5. **Respect the theming honesty rule** (`docs/naming-conventions.md`): theme only where a
   real ExpandTesting feature backs it; never imply crossfit.com is under test.

## Add a new test scenario (feature already has a page object)

1. Confirm the feature/behavior on `https://practice.expandtesting.com` (real messages,
   selectors, success/redirect). Record exact strings.
2. If the page object lacks a needed action/assertion, add an `expect*`/action method there
   (not in the spec).
3. Put any reusable data in `src/data/` as a typed export.
4. Create/extend `tests/<feature>.spec.ts`:
   ```ts
   import { test } from '../src/fixtures/test'; // add `expect` too if you assert inline
   import { validCredentials } from '../src/data/credentials';

   test.describe('Athlete Login (/login) @auth', () => {
     test('a registered athlete signs in with valid credentials @smoke', async ({ loginPage }) => {
       await loginPage.goto();
       await loginPage.loginAs(validCredentials);
       await loginPage.expectLoggedIn();
     });
   });
   ```
5. Run `pnpm exec playwright test <feature> --project=chromium` until green, then the full
   `pnpm test` (all browsers). Fix flakiness at the root (web-first assertions / `expect.poll`),
   not with sleeps or blanket retries.

## Add a new Page Object

1. Create `src/pages/<feature>.page.ts`:
   ```ts
   import { type Page, type Locator, expect } from '@playwright/test';
   import { BasePage } from './base.page';

   export class ThingPage extends BasePage {
     readonly someInput: Locator;

     constructor(page: Page) {
       super(page, '/thing'); // real URL path
       this.someInput = page.getByLabel('Some Field');
     }

     async doThing(value: string): Promise<void> {
       await this.someInput.fill(value);
     }

     async expectThingHappened(): Promise<void> {
       await expect(this.page.getByText(/done/i)).toBeVisible();
     }
   }
   ```
   - Expose locators as `readonly` properties set in the constructor.
   - Public methods declare explicit return types. No `any`.
   - Assertion helpers must start with `expect` (so ESLint counts them as assertions).
2. Wire it into `src/fixtures/test.ts`: import it, add a field to the `PageObjects`
   interface, and add the fixture:
   ```ts
   thingPage: async ({ page }, use) => {
     await use(new ThingPage(page));
   },
   ```
3. Add data to `src/data/` if needed.
4. Write the spec (see above).

## Naming conventions

| Thing             | Convention                                    | Example                                                                  |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| Page object file  | `kebab-case.page.ts`                          | `form-validation.page.ts`                                                |
| Page object class | `PascalCase` + `Page`                         | `FormValidationPage`                                                     |
| Fixture key       | `camelCase` + `Page`                          | `formValidationPage`                                                     |
| Spec file         | `kebab-case.spec.ts`, feature-based (neutral) | `form-validation.spec.ts`                                                |
| `describe` title  | `"<CrossFit Scenario> (<url path>) @tag"`     | `'Box Drop-In Booking Form (/form-validation) @forms'`                   |
| `test` title      | plain-English behavior + `@tag`               | `'a valid booking is accepted and reaches the confirmation page @smoke'` |
| Method            | `camelCase`; assertions start with `expect`   | `expectConfirmation()`                                                   |

**Tags in use:** `@auth`, `@forms`, `@tables`, `@upload`, `@smoke`, `@negative`,
`@regression`. Filter with `pnpm exec playwright test --grep @smoke`.

## CrossFit theming rules (cosmetic only)

- **Code stays neutral & accurate** (classes, fixtures, files match the real feature).
- **Theme lives in `describe`/test titles and docs**, and only where the analogy genuinely
  fits. Every themed title must include the real URL path for traceability.
- **Keep neutral** where there's no clean analogy (notification, dropdown, JS dialogs).
- **Never invent a themed scenario with no backing feature** (e.g. no "box locator" — we
  don't automate a locator page). See the excluded list in `docs/naming-conventions.md`.
- **Justify a new themed name** in the PR/commit by pointing at the real feature it maps to.

## Pre-commit / pre-push checklist

- [ ] Behavior verified against the live SUT; no invented strings/selectors.
- [ ] Selectors are in the page object; accessible-first (CSS fallback commented).
- [ ] New data is typed and in `src/data/`; no `any`.
- [ ] Assertion helpers are named `expect*`; web-first assertions; no sleeps.
- [ ] `describe` title is themed-where-appropriate and carries the URL path + a tag.
- [ ] `pnpm lint` → 0 errors.
- [ ] `pnpm typecheck` → clean.
- [ ] `pnpm format:check` → clean (`pnpm run format` to fix).
- [ ] `pnpm test` → green across chromium/firefox/webkit.
- [ ] No implication anywhere that crossfit.com is under test.
