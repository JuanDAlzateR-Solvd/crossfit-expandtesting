# Research & Mapping: CrossFit.com → ExpandTesting Practice Site

> **Purpose:** Read-only research to ground a Playwright + TypeScript UI automation
> suite. We automate against **practice.expandtesting.com** (a site purpose-built and
> sanctioned for automation), but every feature is chosen because it mirrors a real
> user-facing function on **crossfit.com**. This keeps the suite portfolio-credible:
> it tells a coherent "QA for a CrossFit web product" story while testing a site we
> are actually allowed to drive.
>
> **Method:** Each ExpandTesting feature below was verified by loading its live page on
> 2026-06-30. crossfit.com was viewed read-only (no forms submitted, no login attempted,
> no stateful actions). Nothing is listed that could not be confirmed.

---

## A) CrossFit.com — Main User-Facing Functionalities

Observed by viewing public pages (read-only). Paths noted where exposed in nav/footer.

| #   | Functionality                         | Path / Location                             | Notes                                                         |
| --- | ------------------------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| 1   | **Workout of the Day (WOD)**          | `/wod`, `/workout`                          | Daily-changing workout content — dynamic, date-driven data.   |
| 2   | **Hero Workouts & Movements library** | under `/workout`                            | Reference/list content.                                       |
| 3   | **Gym / Affiliate locator**           | `/map` ("Find a Gym")                       | Geolocation + search + results listing.                       |
| 4   | **Media / Journal / Articles**        | `/media`                                    | Editorial content listing & detail pages.                     |
| 5   | **Store (e-commerce)**                | `store.crossfit.com`                        | Product listing, cart, checkout.                              |
| 6   | **Education / Courses**               | `/education/about`, `/certificate-courses/` | Course catalog, course finder, registration entry points.     |
| 7   | **Games**                             | `games.crossfit.com`                        | Leaderboards, athlete data, sortable/paginated tables.        |
| 8   | **Open a CrossFit Gym (affiliation)** | `/open-crossfit-gym`                        | Multi-step lead/application form.                             |
| 9   | **Contact Us**                        | `/contact-us`                               | Contact form with field validation.                           |
| 10  | **FAQ / Help Center**                 | `/faq`                                      | Static informational content (often in accordions/expanders). |
| 11  | **Ticket sales (CrossFit Games)**     | external (Ticketmaster)                     | Transactional purchase flow.                                  |
| 12  | **Account / sign-in entry points**    | Games & Store login links                   | Authentication entry points (viewed only — never submitted).  |
| 13  | **Testimonials carousel**             | homepage                                    | Dynamic, rotating UI component.                               |
| 14  | **Newsletter / email capture**        | footer / inline                             | Email-field form with validation.                             |

**Takeaway:** crossfit.com is a content + commerce + community platform whose core
testable surfaces are **authentication, form-driven flows (contact, affiliate, course
signup), data tables (Games leaderboards), dynamic content (WOD, carousels), and media
listings**. Those are exactly the QA skill areas the ExpandTesting features below let us
practice on a site we're permitted to automate.

---

## B) ExpandTesting — Verified Testable Features (live, confirmed 2026-06-30)

Each row was loaded and confirmed. Details captured for use in later test design.

| Feature                      | URL path                                   | Verified details                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Login**                    | `/login`                                   | Username + password fields, Login button. Creds `practice` / `SuperSecretPassword!`. Success → `/secure` ("You logged into a secure area!"); failure → "Your username is invalid!" / "Your password is invalid!" |
| **Register**                 | `/register`                                | Username, Password, Confirm Password fields + Register button. Supports positive/negative scenarios.                                                                                             |
| **Forgot Password**          | `/forgot-password`                         | Email field + "Retrieve password" button; simulates reset-email workflow.                                                                                                                        |
| **OTP Login**                | `/otp-login`                               | Email field + "Send OTP Code". Test creds: `practice@expandtesting.com` / OTP `214365`.                                                                                                          |
| **Form Validation**          | `/form-validation`                         | Contact Name, Contact Number, PickUp Date, Payment Method (dropdown). Per-field validation messages + "Looks good!" success states. Register/submit button.                                      |
| **File Upload**              | `/upload`                                  | File input + drag-drop zone + Upload button. Max 500KB. Success shows confirmation (✔ / uploaded filename).                                                                                      |
| **Notification Message**     | `/notification-message`                    | "Click here to load a new message" trigger; flash messages "Action successful" / "Action unsuccessful, please try again".                                                                        |
| **Dynamic Table**            | `/dynamic-table`                           | Task-manager table (Name, CPU, Network, Disk, Memory). Rows/cols re-order and values randomize on reload; highlighted "Chrome CPU" value to locate.                                              |
| **Sortable Data Tables**     | `/tables`                                  | Columns: Last Name, First Name, Email, Due, Web Site, Action. Two tables (with/without id+class). Edit/Delete actions per row.                                                                   |
| **Dynamic Pagination Table** | `/dynamic-pagination-table`                | Student records (Name, Gender, Class, Home State, Major, Activity). DataTables-based pagination, sorting, filtering; rows-per-page selectable.                                                   |
| **Dropdown List**            | `/dropdown`                                | Simple dropdown (Option 1/2), Date-of-Birth selector, and large Country dropdown (Afghanistan→Zimbabwe).                                                                                         |
| **Drag and Drop**            | `/drag-and-drop`                           | Two columns A and B; drag A onto B and assert the swap.                                                                                                                                          |
| **JavaScript Dialogs**       | `/js-dialogs`                              | JS Alert / JS Confirm / JS Prompt buttons; "Dialog Response:" result text after interaction.                                                                                                     |
| **IFrame**                   | `/iframe`                                  | Three iframes: YouTube embed, TinyMCE rich-text editor ("Your content goes here"), internal subscription form.                                                                                   |
| **REST API + Swagger**       | `/api/api-docs/` (UI), `/api/health-check` | Swagger UI loads. `/api/health-check` returns `{"success":true,"status":"UP","message":"API is up!"}` — API confirmed live.                                                                      |

> Other live pages exist (e.g. `/inputs`, `/checkboxes`, `/hovers`, `/dynamic-loading`,
> `/dynamic-controls`, `/add-remove-elements`, `/challenging-dom`, `/notes/app`,
> `/bookstore`, `/cars`) but the table above covers the QA-relevant core verified for
> this project.

---

## C) Mapping Table: ExpandTesting ↔ CrossFit.com

| ExpandTesting feature    | URL path                              | crossfit.com equivalent                       | Why it's relevant in a CrossFit QA context                                                                             |
| ------------------------ | ------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Login                    | `/login`                              | Games/Store account sign-in                   | Members log in to access training, leaderboards, and store orders — auth is the gateway to every personalized feature. |
| Register                 | `/register`                           | Account / course / affiliate signup           | New athletes and gym owners create accounts; registration correctness gates growth.                                    |
| Forgot Password          | `/forgot-password`                    | Account password recovery                     | Recovery flow must work or users get locked out of paid courses/orders.                                                |
| OTP Login                | `/otp-login`                          | 2FA / passwordless sign-in                    | Secure account access (purchases, certifications) increasingly uses OTP/2FA.                                           |
| Form Validation          | `/form-validation`                    | Contact Us, "Open a Gym", course signup forms | CrossFit's lead/affiliation/contact forms must reject bad input and guide users — core conversion path.                |
| File Upload              | `/upload`                             | Coach certs / affiliate docs / profile photo  | Trainers upload certification documents and gyms upload assets; upload limits and success states must hold.            |
| Notification Message     | `/notification-message`               | Flash/toast feedback after actions            | Confirmation/error toasts after submitting forms or adding to cart drive user trust.                                   |
| Dynamic Table            | `/dynamic-table`                      | WOD / live metrics widgets                    | WOD and live stats change daily/randomly; tests must locate data by content, not fixed position.                       |
| Sortable Data Tables     | `/tables`                             | Games leaderboards                            | Leaderboards are sortable tables of athlete data — sorting and row actions are central.                                |
| Dynamic Pagination Table | `/dynamic-pagination-table`           | Games leaderboards / gym directory            | Large athlete/affiliate lists need pagination, sort, and filter — high-traffic data views.                             |
| Dropdown List            | `/dropdown`                           | Country/region & filter selects               | Store checkout, gym locator, and signup forms rely on dropdowns (country, payment, filters).                           |
| Drag and Drop            | `/drag-and-drop`                      | Workout/program builder UIs                   | Coaching/program-builder tools use drag-drop ordering of movements.                                                    |
| JavaScript Dialogs       | `/js-dialogs`                         | Confirm-delete / cookie / leave-site prompts  | Destructive actions (cancel order, delete account) trigger native dialogs that must be handled.                        |
| IFrame                   | `/iframe`                             | Embedded video / rich-text editors            | CrossFit embeds YouTube workout videos and uses rich-text editors in journal/admin content.                            |
| REST API + Swagger       | `/api/api-docs/`, `/api/health-check` | Backend services behind the site              | API-level tests give fast, stable coverage of auth/data that underpins the UI.                                         |

---

## D) Top Priority Features to Automate (Ranked)

Ranked for **interview value** (Test Automation Engineer role) and **breadth of core QA
skills**: authentication, form validation / negative testing, data tables, async/dynamic
content, and file handling.

1. **Login (`/login`)** — The #1 demo of authentication: positive flow to `/secure` plus
   negative cases ("Invalid username." / "Invalid password.") — interviewers expect this first.
2. **Form Validation (`/form-validation`)** — Best showcase of negative testing & field-level
   assertions across text, numeric, date, and dropdown inputs with explicit error/success messages.
3. **Sortable / Pagination Tables (`/tables` + `/dynamic-pagination-table`)** — Proves data-table
   skills (sort, paginate, filter, row actions) directly mapping to CrossFit Games leaderboards.
4. **Dynamic Table (`/dynamic-table`)** — Demonstrates resilient locators for async/randomized
   content — locate by relationship, not index — a key signal of automation maturity.
5. **File Upload (`/upload`)** — Covers file handling end-to-end (input + drag-drop, size limit,
   success assertion), a skill many candidates skip.
6. **Register + Forgot Password / OTP (`/register`, `/forgot-password`, `/otp-login`)** — Rounds
   out the full account lifecycle and adds OTP/2FA, showing depth beyond a single login test.

> If trimming to 4: **Login, Form Validation, Sortable/Pagination Tables, File Upload** —
> together they cover all five core QA skill areas with the least overlap.

---

## Traceability Note

Every test built later must trace to a row in section **B** (a feature confirmed live on
2026-06-30) and justify itself via its **C** mapping to a real crossfit.com function.
