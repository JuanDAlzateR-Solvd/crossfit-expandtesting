# Session Handoff

Context snapshot of the build session that created this suite, for the next session.

## What was built, in order

1. **Research & mapping** (`docs/research-and-mapping.md`). Read-only review of crossfit.com
   (for theme inspiration) and live verification of ExpandTesting features with exact URL
   paths. Produced the ExpandTesting↔CrossFit mapping and a ranked priority list.
2. **Project init.** `package.json`, `tsconfig.json` (strict ESM), `@playwright/test` +
   TS toolchain, browsers installed, `playwright.config.ts` (baseURL, 3 projects, timeouts,
   trace/screenshot/video, HTML+list reporters, retries in CI).
3. **POM scaffold.** `BasePage` + page objects for the priority features, `src/config/env.ts`,
   `src/data/{credentials,form-data}.ts`, `src/fixtures/test.ts`, `src/README.md`. Wired
   fixtures so specs receive ready-to-use page objects.
4. **CrossFit theming (cosmetic).** Root `README.md` (prominent "Test Target" disclaimer) and
   `docs/naming-conventions.md` (theme rules + feature→code→label map). No code renamed.
5. **CI-readiness tooling.** ESLint 8 (`.eslintrc.json`) + Prettier + config-prettier,
   Playwright lint rules scoped to `tests/**`; scripts (`lint`, `format`, `test:ui`,
   `test:report`, etc.); `.env.example`; `.gitignore` (adds `/coverage`, keeps
   `pnpm-lock.yaml` tracked); README "Continuous Integration" section. **No workflow file.**
6. **First smoke test.** `HomePage` page object + `homePage` fixture; `tests/smoke.spec.ts`
   (loads homepage, key elements visible, Login reachable).
7. **Core 7 feature specs.** login, register, form-validation, tables, pagination-table,
   dynamic-table, upload — positive + negative where supported; new `DynamicTablePage`;
   data fixes; `tests/fixtures/workout-log.txt`.
8. **Green + gates.** Full suite **60 passing** across chromium/firefox/webkit; `lint`,
   `typecheck`, `format:check` clean.
9. **This handoff docs set** (`CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/CONTRIBUTING.md`,
   this file, `docs/INTERVIEW_PREP.md`).

## Design decisions + reasoning

- **POM + custom fixtures** — separation of concerns; specs read as behavior; fixtures remove
  boilerplate (`async ({ loginPage }) => …`).
- **One-directional layering** `config→data→pages→fixtures→tests` — predictable imports,
  testable data in isolation.
- **Accessible-first locators** — resilient and demonstrates good practice; CSS only as a
  documented fallback for the site's markup bugs.
- **Assertions in page-object `expect*` methods** — DRY, readable specs. Required teaching
  ESLint `expect-expect` via `assertFunctionPatterns: ["^expect"]` (learned from the plugin
  source that it regex-tests the method name).
- **`waitUntil: 'domcontentloaded'`** — root-cause fix for navigation timeouts caused by the
  SUT's third-party ad/affiliate resources under parallel load (chosen over adding retries,
  which would mask the issue).
- **`expect.poll` for sorting** — tablesorter reorders async; polling is web-first and
  deterministic vs a one-shot read.
- **Unique register username per run** (`athlete-${Date.now()}`) — idempotent positive
  registration against a server that enforces uniqueness + username charset rules.
- **Exact-pinned deps** — reproducible installs for a portfolio repo.

## Trade-offs / alternatives considered & rejected

- **pnpm vs npm:** the user's shell aliases `npm`→`pnpm`; we standardized on **pnpm** and
  kept the alias (rejected fighting the environment to force real npm).
- **ESLint 9 flat config vs ESLint 8 legacy:** chose **ESLint 8 + `.eslintrc.json`** because
  the requested config file is legacy-format; ESLint 9 would ignore it.
- **Adding retries to fix flakiness — rejected** in favor of the DCL navigation fix (root
  cause). Local retries remain off; CI keeps 1.
- **Renaming code symbols to CrossFit names — rejected**; theming is cosmetic (titles/docs)
  so code stays technically accurate and honest about the SUT.
- **Upload >500KB negative path — deferred** (not reliably verified live; avoided fabricating
  behavior).
- **Dependency downgrade to LTS (TS 5.x / @types/node 22) — noted, not done**; current
  versions resolved newer and work, with `ignoreDeprecations` set. Left as a discussable
  change.

## Known issues / flaky areas discovered

- **SUT markup quirks** (documented, worked around): duplicate `id="validationCustom05"`;
  Contact Name pre-filled `value="dodo"`; `#uploaded-files` has an `id` but no `data-testid`;
  dynamic-table shuffles columns/rows and randomizes values.
- **Login message reality:** "Your username/password is invalid!" (the initial research note
  of "Invalid username." was corrected against the live site).
- **Register charset:** usernames reject underscores; must be lowercase/digits/single-hyphen.
- **Flakiness source:** the live site's ad resources; mitigated via DCL wait. Tests depend on
  network/site availability by nature (E2E against a real site).

## Pending / not implemented

- Forgot Password spec (page object exists, untested); OTP page object + spec.
- CI workflow file (`.github/workflows/`).
- Additional features from the mapping (dropdown, drag-drop, iframe, JS dialogs,
  notification) — page objects/specs not built.
- REST API tests (Swagger endpoints under `/api/api-docs/`) — not started.

## Suggested next steps (priority order)

1. **Add the CI workflow** (`.github/workflows/playwright.yml`) matching the README's
   documented pipeline: install with `--frozen-lockfile`, install browsers with
   `--with-deps`, run lint + typecheck, then `pnpm test` across the browser matrix, and
   upload the `playwright-report/` and `test-results/` artifacts.
2. **Forgot Password spec** for the existing `ForgotPasswordPage` (verify the real
   success/validation message first).
3. **OTP flow** (`/otp-login`) — new page object + spec using `OTP_EMAIL`/`OTP_CODE` from
   `env`.
4. **Optional feature coverage** from the mapping (dropdown, drag-drop, iframe, JS dialogs,
   notification) — each: verify live → page object → fixture → spec.
5. **API layer** — smoke-test the ExpandTesting REST endpoints via Playwright's
   `request` fixture.
6. **Consider** downgrading TS/@types/node to LTS if targeting broad reproducibility (ask
   first).
