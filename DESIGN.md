# Northline Design System

## Direction

Northline is a dark, editorial automotive rental experience. It should feel like a quiet night drive: high contrast, precise type, generous space, and one sharp lime accent that marks action and availability.

## Tokens

- Background: near-black charcoal, not pure black.
- Elevated surface: deep graphite.
- Text: soft white for primary, muted cool gray for secondary.
- Accent: restrained electric lime for primary actions and selected states.
- Border: low-contrast graphite line.
- Radius: 16px for major surfaces, 10px for controls, full pill only for compact filter/status chips.

## Typography

Use a system sans stack with optical sizing. Display headings are tight and left aligned. Body copy stays short and readable. UI labels use the same family at a smaller size and stronger weight.

## Composition

- First viewport: split hero with editorial copy and real vehicle photography.
- Search panel overlaps the lower hero edge to connect intent with action.
- Anonymous visitors get a short first-trip rail inside the real flow: choose dates, compare cars, reserve when ready.
- Pickup and return dates persist from search through vehicle detail and the login handoff.
- The landing page answers first-rental questions in sequence: trip intent, fleet comparison, decision details, FAQ, then one final action.
- Fleet uses an asymmetric grid with one lead vehicle and supporting vehicles.
- Authenticated screens prioritize scanability and task completion over marketing decoration.
- Mobile collapses every multi-column surface to one column below 768px.

## Motion

Motion serves hierarchy and feedback. Use short ease-out transitions for controls, small press scale on buttons, and restrained reveal for the first viewport. Respect `prefers-reduced-motion`. No perpetual decorative loops.

## Content Rules

- Use plain rental language: Browse cars, View details, Reserve car, Log in, Log out.
- Never invent testimonials, partner logos, occupancy claims, or live availability claims.
- Sample vehicle records are labeled as demo data in the application where needed.
