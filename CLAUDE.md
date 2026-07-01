# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository. Read this first.

## Project overview

**What it is:** A portfolio-quality UI test-automation suite built with **Playwright +
TypeScript**, following the **Page Object Model (POM)** with custom fixtures.

**What it tests:** The **ExpandTesting Practice** site — `https://practice.expandtesting.com/`
— a public website purpose-built for automation learning. Every test runs against that SUT.

**Why it's CrossFit-themed:** The suite wears a cosmetic "CrossFit fitness automation
framework" skin (test titles, docs, scenario framing) for a memorable portfolio narrative.
The theme is **decorative only**.

> ⚠️ **Load-bearing honesty rule:** `crossfit.com` is **NOT** under test and is **never**
> automated. It was used only for read-only research to inspire naming. Never write code,
> tests, or docs implying crossfit.com is exercised. See `docs/naming-conventions.md`.

## Folder structure

```
.
├── CLAUDE.md                     # This file (auto-loaded by Claude Code)
├── README.md                     # Human-facing intro: Test Target, stack, mapping, CI section
├── playwright.config.ts          # baseURL from env, 3 browser projects, timeouts, reporters
├── tsconfig.json                 # strict ESM, target ES2022, moduleResolution node
├── .eslintrc.json                # ESLint 8 (legacy config); Playwright rules scoped to tests/**
├── .prettierrc / .prettierignore # Prettier config (single quotes, width 100)
├── .env.example                  # Documents BASE_URL / TEST_* / OTP_* (public values, no secrets)
├── package.json                  # pnpm scripts + exact-pinned devDeps
├── pnpm-lock.yaml                # Committed lockfile (do NOT gitignore)
├── src/
│   ├── config/env.ts             # Typed env config; reads process.env with public-practice defaults
│   ├── data/
│   │   ├── credentials.ts         # validCredentials + invalidCredentials[] (name + expectedError regex)
│   │   └── form-data.ts           # FormValidationPayload types + valid/invalid payloads
│   ├── pages/                    # Page Objects (one class per page) — see docs/ARCHITECTURE.md
│   │   ├── base.page.ts           # Abstract BasePage: goto (DCL), flash helpers
│   │   ├── home.page.ts           # HomePage (/)
│   │   ├── login.page.ts          # LoginPage (/login)
│   │   ├── register.page.ts       # RegisterPage (/register)
│   │   ├── forgot-password.page.ts# ForgotPasswordPage (/forgot-password) — NO spec yet
│   │   ├── form-validation.page.ts# FormValidationPage (/form-validation)
│   │   ├── upload.page.ts         # UploadPage (/upload)
│   │   ├── data-tables.page.ts    # DataTablesPage (/tables, sortable)
│   │   ├── pagination-table.page.ts# PaginationTablePage (/dynamic-pagination-table, DataTables)
│   │   └── dynamic-table.page.ts  # DynamicTablePage (/dynamic-table, randomized)
│   ├── fixtures/test.ts          # extend(base) → injects all page objects; re-exports expect
│   └── README.md                 # Layering deep-dive + "how to add a page"
├── tests/
│   ├── smoke.spec.ts             # Homepage smoke (via HomePage fixture)
│   ├── login.spec.ts             # Athlete Login (+valid / data-driven negatives)
│   ├── register.spec.ts          # Athlete Sign-Up (+valid unique user / -negatives)
│   ├── form-validation.spec.ts   # Box Drop-In Booking Form (+valid / -negatives)
│   ├── tables.spec.ts            # WOD Leaderboard — sortable
│   ├── pagination-table.spec.ts  # WOD Leaderboard — Athlete Roster (paginated)
│   ├── dynamic-table.spec.ts     # Live WOD Metrics (resilient locators)
│   ├── upload.spec.ts            # Workout Log Upload
│   └── fixtures/workout-log.txt  # Small upload fixture (<500KB)
└── docs/
    ├── research-and-mapping.md   # Feature research + full ExpandTesting↔CrossFit map
    ├── naming-conventions.md     # CrossFit theming rules (cosmetic)
    ├── ARCHITECTURE.md           # Deep technical reference
    ├── CONTRIBUTING.md           # How to extend correctly
    ├── SESSION_HANDOFF.md        # Context snapshot of the build session
    └── INTERVIEW_PREP.md         # Interview readiness guide
```

## Architecture decisions (the short version — full detail in `docs/ARCHITECTURE.md`)

- **Page Object Model + custom fixtures.** Locators/actions live in `src/pages`; specs read
  as behavior. Fixtures (`src/fixtures/test.ts`) inject ready-to-use page objects so a spec
  does `test('...', async ({ loginPage }) => {...})`.
- **One-directional layering:** `config → data → pages → fixtures → tests`. A lower layer
  never imports a higher one.
- **Accessible-first locators:** `getByRole` / `getByLabel` / `getByText` / `getByTestId`.
  CSS is a documented fallback only when the page's markup forces it (e.g. the duplicate-id
  bug on `/form-validation`).
- **Strong typing, no `any`.** Test data is typed and lives in `src/data`.
- **Assertions live in page-object `expect*` methods** (e.g. `loginPage.expectLoggedIn()`).
  ESLint's `playwright/expect-expect` is configured to recognize this via
  `assertFunctionPatterns: ["^expect"]`.
- **Navigation waits for `domcontentloaded`, not full `load`.** The SUT embeds slow
  third-party ad/affiliate resources; waiting for `load` caused navigation timeouts under
  parallel runs. `BasePage.goto` / `HomePage.open` use `{ waitUntil: 'domcontentloaded' }`.

## Feature mapping (ExpandTesting → CrossFit)

Themed `describe` titles carry the real URL path for traceability. Full table +
justifications: `docs/research-and-mapping.md`; theming rules: `docs/naming-conventions.md`.

| CrossFit scenario (title)        | ExpandTesting feature                | URL path                    | Spec                               |
| -------------------------------- | ------------------------------------ | --------------------------- | ---------------------------------- |
| Athlete Login                    | Login                                | `/login`                    | `tests/login.spec.ts`              |
| Athlete Sign-Up                  | Register                             | `/register`                 | `tests/register.spec.ts`           |
| Box Drop-In Booking Form         | Form Validation                      | `/form-validation`          | `tests/form-validation.spec.ts`    |
| WOD Leaderboard — sortable       | Sortable Data Tables                 | `/tables`                   | `tests/tables.spec.ts`             |
| WOD Leaderboard — Athlete Roster | Dynamic Pagination Table             | `/dynamic-pagination-table` | `tests/pagination-table.spec.ts`   |
| Live WOD Metrics                 | Dynamic Table                        | `/dynamic-table`            | `tests/dynamic-table.spec.ts`      |
| Workout Log Upload               | File Upload                          | `/upload`                   | `tests/upload.spec.ts`             |
| Athlete Account Recovery         | Forgot Password                      | `/forgot-password`          | _(page object only — no spec yet)_ |
| _(neutral, not themed)_          | Notification / Dropdown / JS Dialogs | various                     | _(not implemented)_                |

## How to run (pnpm — see note below)

```bash
pnpm install                       # install deps (uses committed pnpm-lock.yaml)
pnpm exec playwright install       # download browsers (first time only)

pnpm test                          # full suite, all 3 browsers (60 tests)
pnpm run test:chromium             # single browser
pnpm run test:headed               # headed
pnpm run test:ui                   # Playwright UI / time-travel
pnpm run test:report               # open last HTML report

pnpm run lint                      # ESLint
pnpm run typecheck                 # tsc --noEmit
pnpm run format:check              # Prettier check (pnpm run format to fix)
```

**Package manager:** This project uses **pnpm**. In the dev environment `npm` is aliased to
`pnpm`, and `package.json` pins pnpm via `devEngines`. Use `pnpm` (or `pnpm exec`, not
`npx`).

## Environment setup

- **Node:** current LTS (18+). Dev was on Node v24. **pnpm** ~11.x.
- **Dependencies (exact-pinned):** `@playwright/test` 1.61.1, `typescript` 6.0.3,
  `@types/node` 26.0.1, `eslint` ^8.57.1, `@typescript-eslint/*` ^8.62.1,
  `eslint-plugin-playwright` 2.10.4, `eslint-config-prettier` 10.1.8, `prettier` ^3.9.3.
- **No `.env` needed to run.** All values default to the site's _publicly documented_
  practice credentials in `src/config/env.ts`. Override via env vars (`.env.example`):
  `BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD`, `OTP_EMAIL`, `OTP_CODE`.
- **CI:** setting `CI=1` enables 1 retry and bounds workers. No workflow file exists yet
  (README documents the intended pipeline).

## Known issues / limitations / TODOs

- **Forgot Password:** `ForgotPasswordPage` exists and is wired as a fixture, but has **no
  spec**. OTP (`/otp-login`) has **no page object or spec**. Both were deferred.
- **No CI workflow file** (`.github/workflows/`) — deliberately deferred; README describes
  the would-be pipeline. Add on request.
- **Dependency versions ahead of LTS:** `@types/node` 26 and `typescript` 6.0.3 resolved
  newer than typical. `tsconfig.json` sets `"ignoreDeprecations": "6.0"` for
  `moduleResolution: node`. If a future session prefers conventional LTS (TS 5.x, @types/node
  22), that's a safe, discussable change.
- **Upload negative path** (file > 500KB → "File too large…") is **not implemented**
  (unverified live). Positive upload only.
- **Live-site dependency:** tests hit the real SUT, so transient network flakiness is
  possible. Mitigated by the `domcontentloaded` wait; local retries are off by design.
- **SUT markup quirks are real, not bugs in our code** (see `docs/ARCHITECTURE.md` §quirks):
  duplicate `id="validationCustom05"`, pre-filled Contact Name `value="dodo"`,
  `#uploaded-files` uses an `id` (no `data-testid`), dynamic-table shuffles columns/rows.

## How Claude should behave in future sessions

- **Tone:** senior Test Automation Engineer. Be precise and concise; recommend, don't
  survey.
- **Verify against the live site before asserting behavior.** Never invent messages,
  selectors, or flows. If curl-without-cookies is inconclusive, run a real Playwright check.
  When reality differs from expectation, adjust the test to reality and note it.
- **Keep the layering and POM intact.** New selectors go in page objects, not specs. New
  data goes in `src/data`. Prefer accessible locators; document any CSS fallback.
- **Respect the theming honesty rule.** Theme only where a real ExpandTesting feature backs
  it; keep neutral names elsewhere; never imply crossfit.com is tested.
- **Keep the gates green:** `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm test`
  must all pass before considering work done.
- **Ask before changing without clear direction:** dependency major versions / package
  manager; `playwright.config.ts` policies (retries, timeouts, projects); the ESLint/Prettier
  setup; the naming-convention rules; deleting or rewriting existing page objects.
- **Follow the process docs:** `docs/CONTRIBUTING.md` (how to extend), `docs/ARCHITECTURE.md`
  (why it's shaped this way), `docs/SESSION_HANDOFF.md` (history + next steps).
