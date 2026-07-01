# Architecture

Deep technical reference for the CrossFit-themed Playwright + TypeScript suite. See
`CLAUDE.md` for the quick overview and `docs/CONTRIBUTING.md` for extension recipes.

## Layering

```
src/config/  →  src/data/  →  src/pages/  →  src/fixtures/  →  tests/
```

Dependencies flow left→right only; a lower layer never imports a higher one.

| Layer    | Path                   | Responsibility                                       | May import                         |
| -------- | ---------------------- | ---------------------------------------------------- | ---------------------------------- |
| Config   | `src/config/env.ts`    | Env values from `process.env` + typed defaults       | —                                  |
| Data     | `src/data/*.ts`        | Typed test data; no Playwright                       | `config`                           |
| Pages    | `src/pages/*.page.ts`  | Encapsulate DOM: locators + action/assertion methods | `@playwright/test`, `data` (types) |
| Fixtures | `src/fixtures/test.ts` | Inject page objects into `test`                      | `@playwright/test`, `pages`        |
| Tests    | `tests/*.spec.ts`      | Specs only; import from `../src/fixtures/test`       | `fixtures`, `data`                 |

## Page Object Model

### `BasePage` (abstract) — `src/pages/base.page.ts`

- Constructor: `protected constructor(page: Page, path: string)`. Subclasses call
  `super(page, '/route')`.
- `goto()` → `page.goto(this.path, { waitUntil: 'domcontentloaded' })`.
  **Why DCL, not `load`:** the SUT loads slow third-party ad/affiliate scripts; waiting for
  the full `load` event intermittently exceeded `navigationTimeout` under parallel runs.
- `url()`, `title()` helpers.
- `flashAlert` getter → `page.getByRole('alert')`; `expectFlash(msg)` asserts the Bootstrap
  flash banner (most ExpandTesting pages surface `role="alert"`).

### Concrete page objects

| Class                 | File                       | Path                        | Notable members                                                                                                                                                                      |
| --------------------- | -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HomePage`            | `home.page.ts`             | `/`                         | `heading` (level 1), `sampleAppsHeading`, `loginLink`; `open()` returns the nav `Response`; `expectLoaded()`, `openLogin()`                                                          |
| `LoginPage`           | `login.page.ts`            | `/login`                    | `usernameInput`/`passwordInput`/`submitButton`; `login()`, `loginAs(creds)`, `expectLoggedIn()`, `expectError(msg)`                                                                  |
| `RegisterPage`        | `register.page.ts`         | `/register`                 | `username`/`password`/`confirmPassword`; `register(u,p,confirm?)`, `expectMessage(msg)`                                                                                              |
| `ForgotPasswordPage`  | `forgot-password.page.ts`  | `/forgot-password`          | `emailInput`, `submitButton`; `requestReset(email)`, `expectMessage(msg)`. **No spec yet.**                                                                                          |
| `FormValidationPage`  | `form-validation.page.ts`  | `/form-validation`          | field locators; `fillForm(payload)`, `submitForm(payload)`, `errorFor(text)`, `expectValidationError(msg)`, `expectConfirmation()`                                                   |
| `UploadPage`          | `upload.page.ts`           | `/upload`                   | `fileInput`/`uploadButton` (testids), `uploadedFiles` (`#uploaded-files`), `successHeading`; `uploadFile(path)`, `expectUploadSuccess(name)`                                         |
| `DataTablesPage`      | `data-tables.page.ts`      | `/tables`                   | `table` (`#table1`), `rows`; `columnHeader(name)`, `sortBy(col)`, `columnValues(index)`                                                                                              |
| `PaginationTablePage` | `pagination-table.page.ts` | `/dynamic-pagination-table` | `table` (`#example`), `rows`, `pageSizeSelect` (combobox), `searchInput` (searchbox), `next/previousButton`; `setPageSize(n)`, `search(term)`, `goToNextPage()`, `visibleRowCount()` |
| `DynamicTablePage`    | `dynamic-table.page.ts`    | `/dynamic-table`            | `table`, `chromeCpuLabel` (`#chrome-cpu`); `displayedChromeCpu()`, `cell(rowLabel,colHeader)`, `chromeCpuFromTable()`, `expectChromeCpuMatches()`                                    |

## Fixtures — `src/fixtures/test.ts`

- Extends Playwright's base `test` with one fixture per page object, all typed via the
  `PageObjects` interface. Each fixture is `async ({ page }, use) => { await use(new XPage(page)); }`.
- Re-exports `expect` so specs import **both** `test` and `expect` from
  `../src/fixtures/test` (never directly from `@playwright/test`).
- Wired fixtures: `homePage`, `loginPage`, `registerPage`, `forgotPasswordPage`,
  `formValidationPage`, `uploadPage`, `dataTablesPage`, `paginationTablePage`,
  `dynamicTablePage`.
- **Scope/teardown:** page objects are lightweight wrappers over the built-in (test-scoped)
  `page`; no explicit teardown needed. Playwright disposes the `page`/`context` per test.

## Test data strategy — `src/data/`

- **`credentials.ts`**
  - `Credentials { username, password }`, `validCredentials` (from `env`).
  - `InvalidCredentialScenario { name, username, password, expectedError: RegExp }` and
    `invalidCredentials[]` for data-driven negative login (wrong username, wrong password,
    empty username, empty password). Each scenario isolates one variable so the SUT's
    message is deterministic.
- **`form-data.ts`**
  - `PaymentMethod = 'cashondelivery' | 'card'` (the `<select>` **values**).
  - `FormValidationPayload { contactName, contactNumber, pickupDate, paymentMethod }`.
  - `validFormPayload` (contactNumber `012-3456789` matches the required pattern).
  - `invalidFormPayloads` = `{ blankContactName, badContactNumber }` (partial payloads).
- **Adding data:** put new fixtures here as typed exports; keep them Playwright-free so any
  layer can import them. See `docs/CONTRIBUTING.md`.

## Selector strategy

Preference order:

1. `getByRole(role, { name })` — most resilient / accessibility-aligned.
2. `getByLabel(text)` — form fields with real labels.
3. `getByTestId(id)` — where the app exposes `data-testid` (e.g. upload `file-input`,
   `file-submit`).
4. `getByText(text)` — visible copy (flash messages, validation feedback).
5. **CSS/id fallback — only when the markup forces it, and always commented.** Examples:
   `input[name="pickupdate"]` (duplicate `id` bug) and `#uploaded-files` (no `data-testid`).

Locators are exposed as `readonly` properties initialized in the constructor.

## Assertion patterns

- **Web-first, auto-waiting** assertions only: `expect(locator).toBeVisible()`,
  `expect(page).toHaveURL(...)`, `expect(page).toHaveTitle(...)`, `toHaveCount(...)`,
  `toContainText(...)`. **No `waitForTimeout`/sleeps.**
- **Assertions live in page-object `expect*` methods** (`expectLoggedIn`, `expectError`,
  `expectConfirmation`, `expectValidationError`, `expectUploadSuccess`,
  `expectChromeCpuMatches`, `expectMessage`, `expectFlash`, `expectLoaded`). Specs stay
  declarative. ESLint recognizes these via `assertFunctionPatterns: ["^expect"]`.
- **Polling for async DOM reordering:** tablesorter reorders asynchronously, so the sort
  test uses `await expect.poll(() => dataTablesPage.columnValues(0)).toEqual(ascending)`
  instead of a one-shot read.
- **Data-driven tests** use `for (const scenario of invalidCredentials) { test(...) }`.
  No `if/else` inside `test()` bodies (respects `playwright/no-conditional-in-test`).

## Playwright config decisions — `playwright.config.ts`

| Setting             | Value                                | Rationale                                                         |
| ------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| `baseURL`           | `env.baseURL`                        | Single source of truth (config + data share `src/config/env.ts`). |
| `testDir`           | `./tests`                            | Specs only.                                                       |
| `fullyParallel`     | `true`                               | Fast; tests are independent.                                      |
| `retries`           | `isCI ? 1 : 0`                       | Retry transient CI flakiness; surface real failures locally.      |
| `workers`           | `isCI ? 2 : undefined`               | Bound CI concurrency; default locally.                            |
| `timeout`           | `30_000`                             | Per-test.                                                         |
| `expect.timeout`    | `5_000`                              | Assertion auto-wait.                                              |
| `actionTimeout`     | `10_000`                             | Per action.                                                       |
| `navigationTimeout` | `15_000`                             | Paired with the `domcontentloaded` wait.                          |
| `trace`             | `on-first-retry`                     | Debug artifact without slowing green runs.                        |
| `screenshot`        | `only-on-failure`                    | —                                                                 |
| `video`             | `retain-on-failure`                  | —                                                                 |
| `reporter`          | `[['html',{open:'never'}],['list']]` | HTML artifact + readable console.                                 |
| `projects`          | chromium, firefox, webkit            | Cross-browser coverage.                                           |

## TypeScript / lint / format

- **`tsconfig.json`:** `strict`, `target ES2022`, ESM (`module ESNext`,
  `moduleResolution node`), `noEmit`, extra strictness (`noUnusedLocals`, etc.),
  `"ignoreDeprecations": "6.0"` (TS6 deprecates bare `moduleResolution: node`).
- **`.eslintrc.json`:** ESLint 8 legacy config; base = `eslint:recommended` +
  `@typescript-eslint/recommended` + `prettier`. **`tests/**` override** adds
  `plugin:playwright/recommended` and sets
  `playwright/expect-expect: ["error", { assertFunctionPatterns: ["^expect"] }]`.
  Playwright rules are scoped to `tests/**` so page-object `expect()` calls (in `src/`)
  don't trip `no-standalone-expect`.
- **Prettier:** single quotes, semicolons, trailing commas, width 100. `.claude/` and the
  usual build/artifact dirs are ignored; `pnpm-lock.yaml` is Prettier-ignored but **git-tracked**.

## SUT behavior quirks (real site, not our bugs) — must preserve

- **Login:** errors are "Your username is invalid!" / "Your password is invalid!";
  success flash "You logged into a secure area!" at `/secure`.
- **Register (server-side):** usernames = lowercase letters, digits, single hyphens, 3–39
  chars, no leading/trailing hyphen. Messages: "Successfully registered, you can log in
  now." (→ `/login`), "Passwords do not match.", "All fields are required."
- **Form validation:** duplicate `id="validationCustom05"` (Contact number & PickUp Date) →
  date located by `input[name="pickupdate"]`. Contact Name is pre-filled `value="dodo"` →
  negative "required name" test must **clear** it. Contact number pattern `[0-9]{3}-[0-9]{7}`.
  Payment `<select>` selected by **value** (`cashondelivery`/`card`). Valid submit navigates
  to `/form-confirmation` ("Thank you for validating your ticket").
- **Upload:** success heading "File Uploaded!"; the uploaded filename appears in
  `#uploaded-files` (an **id**, no `data-testid`); server prefixes a timestamp so the
  original name is a substring. Max 500KB.
- **Dynamic table:** columns AND rows shuffle per load; values randomize. Locate the CPU
  column by header text and the Chrome row by row text; the `#chrome-cpu` label always equals
  the Chrome row's CPU cell within a single load.
