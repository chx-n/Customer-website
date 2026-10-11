# Northline Car Rental Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete local car-rental web app with a polished responsive frontend, SQLite-backed vehicles and bookings, real cookie sessions, and working login/logout for testing.

**Architecture:** Next.js App Router provides server-rendered marketing and protected pages plus route handlers. Domain helpers in `lib/` isolate SQLite access, password hashing, signed cookies, validation, and booking totals. Client-only components handle fleet filters, auth forms, and reservation submission.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Motion, Phosphor Icons, SQLite via better-sqlite3, bcryptjs, jose, Vitest, and Playwright-compatible manual smoke endpoints.

## Global Constraints

- Product is a local demo. Do not claim live inventory, real partners, testimonials, payments, or production pricing.
- Working brand name is Northline. Use one dark page theme and one restrained electric-lime accent.
- Passwords must never be stored in plaintext. Session cookie must be HTTP-only, same-site, signed, and cleared on logout.
- All booking totals must be computed server-side from stored car price.
- All visible forms need labels, focus states, inline error text, and disabled/loading states.
- All multi-column layouts collapse explicitly below 768px.
- Reduced-motion users receive opacity/color feedback without transform choreography.
- No pure-black background, gradient text, fake testimonials, decorative status dots, or em-dashes in visible product copy.
- No production code before its behavior test is red, except static configuration and design documentation.

---

### Task 1: Scaffold application and test harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `tests/smoke.test.ts`

**Interfaces:**
- Produces runnable `npm run dev`, `npm run build`, and `npm test` commands.
- Produces root metadata and global CSS tokens consumed by every later task.

- [ ] **Step 1: Add package manifest and scripts.**

```json
{
  "name": "northline-rental",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@phosphor-icons/react": "latest",
    "bcryptjs": "latest",
    "better-sqlite3": "latest",
    "jose": "latest",
    "motion": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@types/better-sqlite3": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "tailwindcss": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Add TypeScript, Next, Tailwind, PostCSS, and Vitest configuration.** Use strict TypeScript, `@/*` path alias, `jsdom` test environment, and Tailwind content paths covering `app`, `components`, and `lib`.
- [ ] **Step 3: Add root layout and global tokens.** Define dark background, graphite surfaces, soft-white text, lime accent, `focus-visible` outline, button active scale, reduced-motion rules, selection color, and mobile-safe `min-height: 100dvh` utilities.
- [ ] **Step 4: Write the initial smoke test.** Assert the test environment can import a pure helper module and run.
- [ ] **Step 5: Run `npm install` and `npm test`.** Expected: install succeeds and `tests/smoke.test.ts` passes.

### Task 2: Build database layer and seed sample fleet

**Files:**
- Create: `lib/db.ts`
- Create: `lib/schema.ts`
- Create: `lib/seed.ts`
- Create: `lib/cars.ts`
- Create: `tests/cars.test.ts`

**Interfaces:**
- `getDb(): Database` returns a singleton SQLite connection.
- `getCars(filters?: CarFilters): Car[]` returns filtered vehicles.
- `getCarBySlug(slug: string): Car | null` returns one vehicle.
- `createBooking(input: NewBooking): Booking` persists a booking after validation.

- [ ] **Step 1: Write failing car and seed tests.** Test that the seed creates at least six vehicles, `getCarBySlug('volvo-v60-cross-country')` returns the expected sample car, and category filtering excludes other categories.
- [ ] **Step 2: Run `npm test -- tests/cars.test.ts`.** Expected: FAIL because database helpers do not exist.
- [ ] **Step 3: Implement schema initialization.** Create users, cars, and bookings tables with foreign keys and indexes; use a workspace-local `data/northline.sqlite` path and create the directory on startup.
- [ ] **Step 4: Implement deterministic seed data.** Seed six clearly labeled demo vehicles with real image URLs, category, transmission, seats, price per day, location, description, and feature arrays. Use `INSERT OR IGNORE` by slug.
- [ ] **Step 5: Implement car queries and booking persistence helpers.** Add typed row mapping and filter composition without string interpolation of user values.
- [ ] **Step 6: Run the focused test and full test suite.** Expected: focused tests pass, then `npm test` passes.

### Task 3: Implement auth domain and route handlers

**Files:**
- Create: `lib/auth.ts`
- Create: `lib/auth-validation.ts`
- Create: `app/api/auth/register/route.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/me/route.ts`
- Create: `tests/auth.test.ts`

**Interfaces:**
- `hashPassword(password: string): Promise<string>`
- `verifyPassword(password: string, hash: string): Promise<boolean>`
- `createSession(userId: number): Promise<string>`
- `getCurrentUser(): Promise<SessionUser | null>`
- `requireUser(): Promise<SessionUser>` throws a typed unauthorized error.
- `validateCredentials(input): ValidationResult` returns field errors.

- [ ] **Step 1: Write failing auth tests.** Cover password hashing, invalid credentials, valid registration input, duplicate email rejection, valid login, logout cookie clearing, and `getCurrentUser()` with no cookie.
- [ ] **Step 2: Run `npm test -- tests/auth.test.ts`.** Expected: FAIL on missing auth helpers.
- [ ] **Step 3: Implement password hashing and signed JWT session cookie.** Use bcryptjs, jose, a required `SESSION_SECRET` outside tests, 7-day expiry, `httpOnly`, `sameSite: 'lax'`, `secure` in production, issuer/audience validation, and `path: '/'`.
- [ ] **Step 4: Implement register and login route handlers.** Parse JSON, validate fields, store normalized email, return safe user data, set cookie, and return 400/401/409 responses with inline-friendly error messages.
- [ ] **Step 5: Implement logout and current-user route handlers.** Logout expires the cookie; current-user returns 401 without a session and safe user JSON with one.
- [ ] **Step 6: Run auth tests and full suite.** Expected: all auth tests pass with no plaintext password assertion failures.

### Task 4: Add booking domain and API routes

**Files:**
- Create: `lib/booking-validation.ts`
- Create: `app/api/cars/route.ts`
- Create: `app/api/cars/[slug]/route.ts`
- Create: `app/api/bookings/route.ts`
- Create: `app/api/bookings/mine/route.ts`
- Create: `tests/bookings.test.ts`

**Interfaces:**
- `validateBookingInput(input: unknown): BookingValidationResult`
- `calculateRentalDays(pickupDate: string, returnDate: string): number`
- `calculateBookingTotal(pricePerDay: number, days: number): number`
- `getUserBookings(userId: number): BookingWithCar[]`

- [ ] **Step 1: Write failing validation tests.** Cover missing dates, invalid ISO dates, past pickup, return before pickup, one-day minimum, inclusive day math, and server-side total calculation.
- [ ] **Step 2: Run `npm test -- tests/bookings.test.ts`.** Expected: FAIL because helpers do not exist.
- [ ] **Step 3: Implement date and total helpers.** Use calendar-safe UTC date parsing and return inclusive rental days with a minimum of one.
- [ ] **Step 4: Implement public car route handlers.** Return all filtered cars, one car by slug, and 404 for missing slug.
- [ ] **Step 5: Implement protected booking create/list handlers.** Require session, validate payload, load stored car price, calculate total on server, insert booking, and return 201. List only current user's bookings.
- [ ] **Step 6: Run focused and full tests.** Expected: all booking tests pass.

### Task 5: Build shared UI shell and public landing page

**Files:**
- Create: `components/site-header.tsx`
- Create: `components/button.tsx`
- Create: `components/vehicle-card.tsx`
- Create: `components/hero-search.tsx`
- Create: `components/reveal.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(marketing)/fleet/page.tsx`
- Create: `app/(marketing)/fleet/[slug]/page.tsx`
- Create: `app/(marketing)/loading.tsx`
- Create: `app/(marketing)/error.tsx`

**Interfaces:**
- `VehicleCard({ car, featured }): JSX.Element`
- `HeroSearch({ initialValues }): JSX.Element`
- `SiteHeader({ user }): JSX.Element`
- `Reveal({ children, delay }): JSX.Element`

- [ ] **Step 1: Write component behavior tests.** Test `VehicleCard` renders accessible car name and CTA, `HeroSearch` has labeled location/date controls, and button active state class exists.
- [ ] **Step 2: Run component tests and confirm red.** Expected: FAIL because components do not exist.
- [ ] **Step 3: Implement shared tokens and components.** Use Phosphor icons, no hand-drawn SVG paths, semantic buttons/links, explicit focus, loading, disabled, and error states.
- [ ] **Step 4: Implement landing page.** Use a split photographic hero, search panel overlap, asymmetric fleet composition, a plain-text process section, sample-data note, and one final CTA. Keep hero under two headline lines and within first viewport.
- [ ] **Step 5: Implement fleet page.** Use server-loaded seed data plus URL query filters and a compact client filter bar. Include empty result state and `loading.tsx` skeleton.
- [ ] **Step 6: Implement car detail page.** Show image, specs, feature list, pricing, and authenticated or unauthenticated reservation entry. Keep date controls labeled and mobile stacked.
- [ ] **Step 7: Run component tests and build.** Expected: component tests pass and `npm run build` completes.

### Task 6: Build auth screens, dashboard, and reservation interaction

**Files:**
- Create: `components/auth-form.tsx`
- Create: `components/reservation-form.tsx`
- Create: `components/logout-button.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/register/page.tsx`
- Create: `app/dashboard/page.tsx`
- Create: `app/dashboard/loading.tsx`
- Create: `app/dashboard/error.tsx`

**Interfaces:**
- `AuthForm({ mode, nextPath }): JSX.Element`
- `ReservationForm({ car }): JSX.Element`
- `LogoutButton(): JSX.Element`

- [ ] **Step 1: Write client behavior tests.** Test login form pending state, invalid response rendering, registration success redirect, reservation total display, and logout request redirect.
- [ ] **Step 2: Run focused tests and confirm red.** Expected: FAIL because components do not exist.
- [ ] **Step 3: Implement auth forms.** Use controlled inputs, inline field errors, accessible status messages, and redirect to `next` or dashboard after success.
- [ ] **Step 4: Implement reservation form.** Default dates to tomorrow and the following day, reject invalid local dates before request, show computed total from API response, and redirect to dashboard after 201.
- [ ] **Step 5: Implement protected dashboard.** Server-side redirect unauthenticated users; show user name/email, upcoming bookings, empty state, and logout button.
- [ ] **Step 6: Run focused tests and full suite.** Expected: all tests pass.

### Task 7: Verify full app and run design quality gates

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`
- Create: `.env.example`
- Create: `.impeccable/review/desktop.png`
- Create: `.impeccable/review/mobile.png`

**Interfaces:**
- Produces documented local setup and a repeatable manual smoke flow.

- [ ] **Step 1: Add environment and runtime docs.** Document `SESSION_SECRET`, `npm install`, `npm run dev`, account registration, and test commands.
- [ ] **Step 2: Run `npm test` and `npm run build`.** Expected: exit 0.
- [ ] **Step 3: Run app smoke flow.** Register a unique user, log in, open dashboard, create a booking, verify it appears, call logout, and verify dashboard redirects to login. Capture response status for each step.
- [ ] **Step 4: Run `node .agents/skills/design/impeccable/scripts/detect.mjs --json app components lib`.** Fix mechanical findings that apply to changed UI.
- [ ] **Step 5: Inspect desktop and mobile screenshots.** Confirm no overflow, hero CTA visibility, readable contrast, focus ring, form errors, loading/empty/error states, and reduced-motion CSS.
- [ ] **Step 6: Run final test and build commands.** Expected: `npm test` and `npm run build` both exit 0 before reporting completion.
