# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js App Router, TypeScript, Tailwind CSS, Motion, SQLite, and cookie-based sessions. Chosen for one full-stack app that can be tested locally without external services.

## Users

People planning short trips who want to compare and reserve a car quickly. A secondary user is a returning renter checking upcoming reservations.

## Product Purpose

Northline lets people browse a focused fleet, choose pickup and return dates, reserve a car, and manage bookings from one account. Success means a first-time visitor can understand the offer, sign in, and complete a test reservation without assistance.

## Positioning

The product is positioned around a calm, high-confidence rental flow: a small, curated fleet with clear pricing and a short path from route planning to reservation.

## Operating Context

Visitors arrive on mobile or desktop, scan a visual fleet, filter by practical needs, open a vehicle detail page, and sign in before confirming a reservation. Returning renters use a protected dashboard to view reservations and sign out.

## Capabilities and Constraints

- Public landing page with search, featured vehicles, and clear reservation entry points.
- Fleet browsing with category, transmission, seats, and price filters.
- Vehicle detail pages with date selection and reservation CTA.
- Account registration, login, session persistence, protected dashboard, and logout.
- SQLite persistence for users, vehicles, and bookings.
- Visitors create their own local account for testing; no user credentials are seeded into the database.
- No payment processing, email delivery, admin console, or production pricing claims in this build.

## Brand Commitments

- Working product name: Northline.
- Voice: direct, calm, capable, and travel-focused.
- No supplied logo, photography, testimonials, or customer evidence. Do not present invented proof as real.

## Evidence on Hand

No existing product code, content system, brand assets, or verified business data. Vehicle and pricing records are clearly sample data for local testing.

## Product Principles

1. Make the next useful action obvious.
2. Show enough vehicle detail to support a confident choice.
3. Keep account state visible and reversible.
4. Use sample data honestly while making the demo feel complete.

## Accessibility & Inclusion

Keyboard access, visible focus states, readable contrast, labeled form controls, reduced-motion support, and responsive layouts are required. Inputs must not rely on placeholder text as labels.
