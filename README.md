# 🏋️ CrossFit-Inspired UI Automation Framework

> A Playwright + TypeScript test-automation suite framed like a CrossFit box's training
> program — every "workout" is a real, automatable web scenario, organized and named for
> clarity and recall.

---

## 🎯 Test Target — read this first

**The actual system under test (SUT) is [ExpandTesting Practice](https://practice.expandtesting.com/)** —
a public website _purpose-built for automation learning and practice_. Every test in this
repository runs against `https://practice.expandtesting.com/`.

> **crossfit.com is NOT under test and is never automated.** It was used **only** for
> read-only research to inspire the cosmetic theme (naming, scenario framing, docs) of this
> project. No test navigates to, submits to, or otherwise exercises crossfit.com. The
> CrossFit branding here is decorative; the engineering targets ExpandTesting Practice.

This separation is deliberate and load-bearing: we theme against a brand we admire, but we
only automate a site that explicitly invites automation.

---

## 🧰 Tech Stack

| Layer        | Choice                                                              |
| ------------ | ------------------------------------------------------------------- |
| Test runner  | [Playwright Test](https://playwright.dev) `@playwright/test` 1.61.1 |
| Language     | TypeScript 6.0.3 (strict, ESM)                                      |
| Runtime / PM | Node.js + pnpm                                                      |
| Browsers     | Chromium, Firefox, WebKit (cross-browser projects)                  |
| Design       | Page Object Model + custom Playwright fixtures                      |
| Reporting    | HTML report + list reporter; trace/screenshot/video on failure      |

## 🚀 Setup & Run

```bash
# 1. Install dependencies
pnpm install

# 2. Install Playwright browsers (first time only)
pnpm exec playwright install

# 3. Run the suite (all browsers)
pnpm test

# Useful variants
pnpm run test:chromium     # single browser
pnpm run test:headed       # watch it run
pnpm run test:ui           # Playwright UI mode (time-travel debugging)
pnpm run test:report       # open the last HTML report

# Quality gates (also used in CI)
pnpm run lint              # ESLint (TypeScript + Playwright rules)
pnpm run typecheck         # tsc --noEmit, strict type check
pnpm run format:check      # Prettier formatting check (use `format` to fix)
```

**Configuration / overrides.** All environment values are read from `process.env` with
safe defaults in [`src/config/env.ts`](src/config/env.ts) — nothing secret is hardcoded.
Override per environment:

| Variable                 | Default                                 | Purpose                                               |
| ------------------------ | --------------------------------------- | ----------------------------------------------------- |
| `BASE_URL`               | `https://practice.expandtesting.com`    | System under test                                     |
| `TEST_USERNAME`          | `practice`                              | Valid login user (publicly documented practice value) |
| `TEST_PASSWORD`          | `SuperSecretPassword!`                  | Valid login password (publicly documented)            |
| `OTP_EMAIL` / `OTP_CODE` | `practice@expandtesting.com` / `214365` | OTP login (documented practice values)                |
| `CI`                     | _unset_                                 | When set, enables 1 retry and bounded workers         |

## 🏗️ Architecture Overview

A clean, one-directional layering — each layer depends only on the ones to its left:

```
src/config/   →   src/data/   →   src/pages/   →   src/fixtures/   →   tests/
 (env values)     (typed test     (Page Objects,    (inject ready-      (specs only)
                   data, no        one per page,      to-use page
                   Playwright)     role/label         objects)
                                   locators)
```

```
.
├── src/
│   ├── config/      # Typed env config (baseURL, credentials) from process.env
│   ├── data/        # Typed test data (credentials, form payloads) — no logic
│   ├── pages/       # Page Objects (BasePage + one class per page under test)
│   ├── fixtures/    # Custom test fixtures that supply page objects to specs
│   └── README.md    # Deep-dive on the layering + how to add a page
├── tests/           # Spec files only
├── docs/
│   ├── research-and-mapping.md   # Feature research + full ExpandTesting↔CrossFit map
│   └── naming-conventions.md     # CrossFit naming conventions (cosmetic)
├── playwright.config.ts
└── tsconfig.json
```

See [`src/README.md`](src/README.md) for the full architecture write-up and the recipe for
adding a new page object + fixture.

## 🗺️ Feature Mapping

Every automated scenario traces back to a **real feature confirmed on ExpandTesting
Practice**, then gets a CrossFit-flavored label for readability. The CrossFit column is a
naming analogy only — it does **not** mean crossfit.com is exercised.

| 🏋️ CrossFit Scenario        | ExpandTesting feature    | URL path                    | Why it's worth testing                                                  |
| --------------------------- | ------------------------ | --------------------------- | ----------------------------------------------------------------------- |
| Athlete Login               | Login                    | `/login`                    | Auth is the gateway to every member feature; positive + negative paths. |
| Athlete Onboarding          | Register                 | `/register`                 | New-account creation; positive/negative registration.                   |
| Athlete Account Recovery    | Forgot Password          | `/forgot-password`          | Recovery flow; email-field validation.                                  |
| Drop-In Check-In (OTP)      | OTP Login                | `/otp-login`                | One-time-password / 2FA-style sign-in.                                  |
| Box Drop-In Booking Form    | Form Validation          | `/form-validation`          | Field-level validation across text, number, date, dropdown.             |
| Coach Certification Upload  | File Upload              | `/upload`                   | File handling: input + drag-drop, size limit, success state.            |
| Box Leaderboard (sortable)  | Sortable Data Tables     | `/tables`                   | Sorting + row actions on tabular data.                                  |
| Athlete Roster (paginated)  | Dynamic Pagination Table | `/dynamic-pagination-table` | Pagination, page-size, search/filter.                                   |
| Live WOD Metrics board      | Dynamic Table            | `/dynamic-table`            | Resilient locators for randomized/async content.                        |
| WOD Builder (reorder)       | Drag and Drop            | `/drag-and-drop`            | Drag-and-drop interactions.                                             |
| Workout Video / Coach Notes | IFrame                   | `/iframe`                   | Embedded video + rich-text editor inside iframes.                       |

The full 15-row research table (including the original crossfit.com analogues and the
reasoning behind each) lives in
[`docs/research-and-mapping.md`](docs/research-and-mapping.md). Naming rules — and where we
_deliberately keep neutral names_ — are in
[`docs/naming-conventions.md`](docs/naming-conventions.md).

### 🥇 Why these scenarios

The first wave prioritizes the 4–6 features that best demonstrate a Test Automation
Engineer's core skills (see section D of the research doc):

1. **Athlete Login** (`/login`) — authentication, positive + negative paths.
2. **Box Drop-In Booking Form** (`/form-validation`) — negative testing and field-level
   assertions across mixed input types.
3. **Box Leaderboard + Athlete Roster** (`/tables`, `/dynamic-pagination-table`) — data
   tables: sorting, pagination, filtering, row actions.
4. **Live WOD Metrics board** (`/dynamic-table`) — resilient, relationship-based locators
   for randomized/async content.
5. **Coach Certification Upload** (`/upload`) — end-to-end file handling.
6. **Athlete Onboarding + Recovery + Check-In** (`/register`, `/forgot-password`,
   `/otp-login`) — the full account lifecycle, including OTP.

Together they cover the key QA competencies: **authentication, form validation / negative
testing, data tables, async/dynamic content, and file handling.**

## ⚙️ Continuous Integration

> The repo is **CI-ready**, but no pipeline is wired yet — there is intentionally **no
> `.github/workflows/` file**. The workflow file can be added on request. This section
> documents how the suite _would_ run in CI.

**Install & prepare (reproducible):**

```bash
pnpm install --frozen-lockfile          # exact deps from the committed pnpm-lock.yaml
pnpm exec playwright install --with-deps  # browsers + OS-level dependencies
```

**Quality gates (fail fast, before the browser matrix):**

```bash
pnpm lint        # ESLint
pnpm typecheck   # tsc --noEmit
pnpm test        # Playwright across the browser matrix
```

**Browser matrix.** Run the suite across the three configured projects so a regression in
any engine is caught:

| Matrix entry | Command                        |
| ------------ | ------------------------------ |
| Chromium     | `pnpm test --project=chromium` |
| Firefox      | `pnpm test --project=firefox`  |
| WebKit       | `pnpm test --project=webkit`   |

`playwright.config.ts` already sets `retries: 1` when the `CI` env var is present and bounds
worker count for stable runs.

**Artifacts to upload (on failure / always):**

| Artifact                      | Path                 | Produced by                                              |
| ----------------------------- | -------------------- | -------------------------------------------------------- |
| HTML report                   | `playwright-report/` | HTML reporter                                            |
| Traces / screenshots / videos | `test-results/`      | `trace: on-first-retry`, `screenshot`/`video` on failure |

These are git-ignored locally and meant to be published as CI build artifacts for
post-run debugging.
