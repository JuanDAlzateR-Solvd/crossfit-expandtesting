# Interview Prep

How to present this project in a Test Automation Engineer interview. It targets
**ExpandTesting Practice** (`https://practice.expandtesting.com/`) with Playwright +
TypeScript; the CrossFit theme is cosmetic.

## Elevator pitch (30 seconds)

"A portfolio-quality Playwright + TypeScript UI suite built on the Page Object Model with
custom fixtures. It covers authentication, form validation, data tables, dynamic/async
content, and file upload — 60 tests across Chromium, Firefox, and WebKit, all green, with
ESLint/Prettier/strict-TS gates. It's themed as a 'CrossFit fitness framework' for a
memorable narrative, but it honestly tests a public practice site, not crossfit.com."

## Talking points per decision

- **Why POM + fixtures?** Separation of concerns: selectors/behavior in page objects, specs
  read as intent. Fixtures inject ready-to-use page objects, removing setup boilerplate and
  centralizing wiring. Layering (`config→data→pages→fixtures→tests`) is one-directional.
- **Selector strategy?** Accessibility-first (`getByRole`/`getByLabel`/`getByText`/
  `getByTestId`). I only drop to CSS/id when the site's markup forces it — and I comment why.
  Concrete example: `/form-validation` ships a **duplicate `id`**, so I select the date field
  by `name`.
- **How do you keep tests non-flaky?** Web-first, auto-waiting assertions; no sleeps. I
  root-caused a real flake: the site loads third-party ad scripts, so `waitUntil:'load'`
  timed out under parallel runs — I switched navigation to `domcontentloaded`. For async
  table sorting I used `expect.poll` instead of a one-shot read. I fixed causes rather than
  papering over with retries.
- **Data-driven testing?** Negative login cases live as typed data (`invalidCredentials[]`
  with an `expectedError` regex) and generate tests via `for…of`. Payloads for forms live in
  `src/data` too — data separated from logic.
- **Cross-browser & reporting?** Three projects (Chromium/Firefox/WebKit); HTML + list
  reporters; trace on first retry, screenshot/video on failure — enough to debug CI failures
  without slowing green runs.
- **Tooling / quality gates?** Strict TypeScript (no `any`), ESLint (with the Playwright
  plugin scoped to `tests/**`), Prettier, and a documented would-be CI pipeline. I even read
  the ESLint-plugin source to configure `expect-expect` (`assertFunctionPatterns:["^expect"]`)
  so it recognizes assertions that live in page-object methods.
- **Config as single source of truth?** `src/config/env.ts` reads `process.env` with safe
  defaults (public practice values, no secrets); `playwright.config.ts` pulls `baseURL` from
  it, so config and data never drift.

## Explaining the ExpandTesting → CrossFit mapping

- **The framing:** I wanted a coherent product story ("QA for a CrossFit web product") but I
  will only automate a site that's _meant_ to be automated. So I researched crossfit.com
  read-only to derive realistic scenarios, then mapped each to a real, confirmed ExpandTesting
  feature that exercises the same QA skill.
- **Examples:** Login → "Athlete Login"; Games leaderboard → sortable/paginated tables ("WOD
  Leaderboard"); coach-cert uploads → file upload ("Workout Log Upload"); booking/contact
  forms → form validation ("Box Drop-In Booking Form").
- **Discipline / honesty:** the theme is cosmetic — code names stay accurate, titles carry
  the real URL path for traceability, and I _deliberately excluded_ a "box locator" scenario
  because no locator page is automated. This shows I won't overstate coverage.

## Likely questions + suggested answers

- **"How do you handle dynamic content?"** The `/dynamic-table` test: columns and rows
  shuffle on every load and values are random, so I locate by **header text and row text**,
  never by index, and assert the highlighted `#chrome-cpu` label equals the Chrome row's CPU
  cell within the same load. That's the resilient-locator skill in miniature.
- **"Positive and negative coverage?"** Yes — e.g. login (valid → secure area; wrong
  username/password/empty → the correct error each); registration (unique valid user →
  success; mismatched passwords, missing fields → the exact server messages); form validation
  (valid → confirmation page; blank required field & bad number pattern → inline errors).
- **"How do you avoid flaky tests?"** (see talking point above) — web-first assertions,
  `expect.poll`, DCL navigation, root-cause over retries.
- **"How would you scale this?"** Add page objects + fixtures per feature; keep data in
  `src/data`; the mapping doc lists the backlog (forgot-password, OTP, dropdown, drag-drop,
  iframe, dialogs) and an API-testing layer via Playwright's `request` fixture.
- **"Why pnpm / ESLint 8?"** Environment standardized on pnpm; ESLint 8 because the project
  uses the legacy `.eslintrc.json` format (ESLint 9 defaults to flat config).
- **"What did you learn about the SUT?"** Several real markup quirks (duplicate ids, a
  pre-filled field, an id-without-testid) — I verified behavior live and adapted tests to
  reality rather than assuming, which is exactly the mindset for testing real apps.
- **"CI story?"** Documented pipeline (frozen-lockfile install, `--with-deps` browsers,
  lint/typecheck/test matrix, report+trace artifacts). Config already flips retries/workers
  when `CI` is set; the workflow file is the next step.

## What this project demonstrates

- **End-to-end ownership:** research → architecture → tooling → tests → docs/handoff.
- **Design maturity:** POM, fixtures, layering, typed data, single-source config.
- **Real-world testing instincts:** verify against reality, resilient locators, root-cause
  flakiness fixes, honest coverage claims.
- **Engineering rigor:** strict TS (no `any`), lint/format/type gates, cross-browser,
  reproducible installs, and thorough documentation.
- **Communication:** a clear narrative (the CrossFit theme) balanced with disclosure about
  what is and isn't tested.
