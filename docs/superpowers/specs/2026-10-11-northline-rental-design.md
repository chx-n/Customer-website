# Northline Car Rental Design

## Approved scope

Build a complete local full-stack car rental demo from an empty workspace. Deliver the public browsing flow, account flow, protected renter dashboard, SQLite persistence, and testable login/logout behavior.

## User flow

1. Visitor lands on Northline and sees a clear route to browse the fleet.
2. Visitor searches by pickup location and dates, then opens a vehicle.
3. Vehicle detail page explains sample price, practical specs, and reservation dates.
4. Visitor registers or logs in.
5. Reservation is created in SQLite and shown in the dashboard.
6. User logs out. Protected dashboard redirects to login until a new session exists.

## Surface design

The public page uses a dark automotive editorial system: off-black surfaces, soft white type, cool gray secondary text, and one restrained electric-lime accent. The hero is an asymmetric split with real car photography and a compact search surface bridging into the next section. The fleet is an asymmetric grid, not a row of identical cards. Authenticated screens use the same tokens with denser, task-first layout.

## Architecture

Next.js App Router owns UI and backend route handlers. SQLite stores users, cars, and bookings. Passwords are hashed with bcryptjs. Signed HTTP-only cookies carry a short-lived session token generated with jose. Server components read session state through `lib/auth.ts`; client components own date/filter/search interactions.

## Routes

- `/` landing page
- `/fleet` searchable fleet
- `/fleet/[slug]` vehicle detail and reservation form
- `/login` login form
- `/register` registration form
- `/dashboard` protected account and bookings
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/cars`
- `/api/bookings`

## Data model

- `users`: id, name, email, password hash, created timestamp
- `cars`: id, slug, name, category, transmission, seats, price per day, location, image URL, description, features JSON, created timestamp
- `bookings`: id, user id, car id, pickup date, return date, total amount, status, created timestamp

Dates must be ISO `YYYY-MM-DD`. Booking validation rejects missing fields, return dates before pickup dates, dates in the past, and unknown cars. Total is computed server-side from stored car price and inclusive rental days.

## States

- Forms show inline errors below the related field or form.
- Buttons expose disabled/loading labels during submission.
- Fleet and dashboard have empty states.
- Unauthorized dashboard access redirects to `/login?next=/dashboard`.
- Logout clears the session cookie and returns to `/`.

## Accessibility and responsive behavior

All controls have labels, focus rings, keyboard access, and adequate contrast. Reduced motion removes transform-based entrance motion. Multi-column layouts become single-column under 768px. Hero CTA remains visible in the first viewport at desktop and mobile.

## Testing contract

- Unit tests cover password/session helpers and booking validation.
- Route tests cover register, login, logout, protected access, and booking creation.
- A production build must pass.
- Manual smoke flow must demonstrate register/login, dashboard access, booking creation, logout, and dashboard redirect.

## Deliberate exclusions

No payments, real inventory locking, email confirmation, maps, external OAuth, admin tools, or production deployment setup.
