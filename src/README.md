# `src/` — Test Architecture

This suite follows the **Page Object Model (POM)** with custom Playwright fixtures.
The layering keeps test data, page interactions, and specs cleanly separated so the
suite stays readable and scalable as coverage grows.

## Layers

```
config/   →  data/   →  pages/   →  fixtures/   →  ../tests/
```

Dependencies flow **left to right** only (a lower layer never imports a higher one):

| Layer        | Folder         | Responsibility                                                                                                                                         | May import                              |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| **Config**   | `src/config`   | Single source of truth for environment values (`baseURL`, credentials, OTP). Reads `process.env` with typed defaults; no hardcoded secrets.            | —                                       |
| **Data**     | `src/data`     | Pure, strongly-typed test data (valid/invalid credentials, form payloads). No Playwright.                                                              | `config`                                |
| **Pages**    | `src/pages`    | Page Objects. Encapsulate the DOM: locators as `readonly` properties + high-level action/assertion methods. One class per page; all extend `BasePage`. | `@playwright/test`, `data` (types only) |
| **Fixtures** | `src/fixtures` | Extend Playwright's `test` to inject ready-to-use page objects.                                                                                        | `@playwright/test`, `pages`             |
| **Tests**    | `../tests`     | Specs only. Import `{ test, expect }` from `../src/fixtures/test`.                                                                                     | `fixtures`, `data`                      |

## Conventions

- **Files:** `kebab-case.page.ts`; **classes:** `PascalCase` (e.g. `LoginPage`).
- **Locators:** prefer accessible locators — `getByRole`, `getByLabel`, `getByText`,
  `getByTestId`. Fall back to CSS only when no accessible handle exists, and document why
  (see `form-validation.page.ts`, which works around a duplicate-`id` bug on the live page).
- **Typing:** strict throughout, no `any`. Public methods declare explicit return types.
- **Imports:** relative paths, no path aliases (zero-config under ESM).

## Adding a new page

1. Create `src/pages/<feature>.page.ts` extending `BasePage`, passing the path to `super`.
2. Expose locators as `readonly` properties in the constructor and add high-level methods.
3. Register it in `src/fixtures/test.ts`: add a field to `PageObjects` and a fixture that
   `use(new <Feature>Page(page))`.
4. Put any reusable test data in `src/data/`.

## Example

```ts
import { test, expect } from '../src/fixtures/test';
import { validCredentials } from '../src/data/credentials';

test('valid login reaches the secure area', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.loginAs(validCredentials);
  await loginPage.expectLoggedIn();
});
```
