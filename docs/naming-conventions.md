# Naming Conventions — CrossFit Theme (Cosmetic Only)

This suite wears a CrossFit "fitness automation framework" skin. The theme is **purely
cosmetic**: it shapes human-facing scenario names, test titles, and documentation — nothing
more.

## Ground rules (read before naming anything)

1. **The real system under test is [ExpandTesting Practice](https://practice.expandtesting.com/).**
   crossfit.com is **never automated and never under test** — it was read-only research used
   only to inspire the theme.
2. **Code stays accurate; theme stays in prose.** Page Object classes, fixtures, data
   symbols, and file names keep neutral, technically-truthful names that match the real
   ExpandTesting feature (`LoginPage`, `loginPage`, `tests/login.spec.ts`). The CrossFit
   flavor lives only in `describe`/`test` titles, tags, and docs.
3. **Theme only where the analogy genuinely fits.** If a CrossFit label would be forced or
   misleading, use a neutral, accurate name instead. Never invent a themed scenario that has
   no backing ExpandTesting feature.
4. **Always preserve traceability.** Every themed scenario must point back to a real feature
   path, so reviewers can verify what's actually being tested.

## How scenario naming works

| Element               | Convention                                                           | Example                                                          |
| --------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Spec file             | Neutral, feature-based                                               | `tests/login.spec.ts`                                            |
| `describe` block      | `"<CrossFit Scenario> (<url path>)"` — flavor **plus** the real path | `test.describe('Athlete Login (/login)', ...)`                   |
| `test` title          | Plain-English behavior (no need to force theme)                      | `test('rejects an invalid password with an error message', ...)` |
| Page Object / fixture | Neutral, matches the feature                                         | `LoginPage`, `loginPage`                                         |
| Tags                  | Skill/area + run-tier                                                | `@auth @smoke @negative`                                         |

Suggested tags: `@auth`, `@forms`, `@tables`, `@upload`, `@smoke`, `@negative`,
`@regression`.

Example:

```ts
import { test } from '../src/fixtures/test';
import { validCredentials, invalidCredentials } from '../src/data/credentials';

test.describe('Athlete Login (/login) @auth', () => {
  test('a registered athlete signs in with valid credentials @smoke', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(validCredentials);
    await loginPage.expectLoggedIn();
  });
});
```

The class is `LoginPage` (accurate); the `describe` carries the theme and the `/login` path
(traceable); the title describes behavior.

## Mapping: feature → code → scenario label

`Themed?` legend: ✅ themed · 🟡 lightly themed (still accurate) · ⚪ neutral (no clean
analogy — kept plain on purpose).

| ExpandTesting feature    | URL path                    | Neutral code symbol                           | CrossFit scenario label              | Themed? |
| ------------------------ | --------------------------- | --------------------------------------------- | ------------------------------------ | :-----: |
| Login                    | `/login`                    | `LoginPage` / `loginPage`                     | Athlete Login                        |   ✅    |
| Register                 | `/register`                 | `RegisterPage` / `registerPage`               | Athlete Onboarding                   |   ✅    |
| Forgot Password          | `/forgot-password`          | `ForgotPasswordPage` / `forgotPasswordPage`   | Athlete Account Recovery             |   🟡    |
| OTP Login                | `/otp-login`                | _(future page object)_                        | Drop-In Check-In (OTP)               |   🟡    |
| Form Validation          | `/form-validation`          | `FormValidationPage` / `formValidationPage`   | Box Drop-In Booking Form             |   ✅    |
| File Upload              | `/upload`                   | `UploadPage` / `uploadPage`                   | Coach Certification Upload           |   ✅    |
| Sortable Data Tables     | `/tables`                   | `DataTablesPage` / `dataTablesPage`           | Box Leaderboard (sortable)           |   ✅    |
| Dynamic Pagination Table | `/dynamic-pagination-table` | `PaginationTablePage` / `paginationTablePage` | Athlete Roster (paginated)           |   ✅    |
| Dynamic Table            | `/dynamic-table`            | `DynamicTablePage` / `dynamicTablePage`       | Live WOD Metrics board               |   ✅    |
| Drag and Drop            | `/drag-and-drop`            | _(future page object)_                        | WOD Builder (reorder movements)      |   ✅    |
| IFrame                   | `/iframe`                   | _(future page object)_                        | Workout Video / Coach Notes (iframe) |   ✅    |
| Notification Message     | `/notification-message`     | _(future page object)_                        | Flash / Notification Message         |   ⚪    |
| Dropdown List            | `/dropdown`                 | _(future page object)_                        | Dropdown Selection                   |   ⚪    |
| JavaScript Dialogs       | `/js-dialogs`               | _(future page object)_                        | JavaScript Dialogs                   |   ⚪    |

### Deliberately excluded

- **"Box / Affiliate Locator"** — a tempting CrossFit analogy (crossfit.com has a gym
  locator), but **this suite does not automate any locator page**, so applying the theme
  here would imply coverage that doesn't exist. It is intentionally omitted. (ExpandTesting
  does expose a `/geolocation` page; if a locator scenario is added to scope later, it could
  be themed then — only once a real test backs it.)

## Checklist for naming a new scenario

1. Confirm the feature exists on ExpandTesting Practice and note its real URL path.
2. Pick a CrossFit label **only** if the analogy is natural; otherwise stay neutral.
3. Keep the Page Object / fixture / file name accurate to the feature (no theme).
4. Name the `describe` block `"<Scenario> (<url path>)"`; describe behavior in `test` titles.
5. Add appropriate tags.
6. Never write anything implying crossfit.com is the system under test.
