# Security Policy

## Scope

Northline Rental is a local demo, not a production rental service. It intentionally contains sample vehicles and local SQLite persistence. Do not use it with real customer, payment, identity, or operational data without a separate production security review.

## Safe configuration

Set a unique `SESSION_SECRET` with at least 32 bytes in every non-test environment. Never commit `.env.local`, database files, credentials, private keys, access tokens, or deployment exports. The checked-in `.env.example` contains no usable secret.

## Reporting a vulnerability

Please do not open a public issue for an undisclosed vulnerability. After this repository is created, use GitHub's private security advisory flow. If private advisories are unavailable, contact the maintainer through the email listed in the repository's GitHub profile and include reproduction steps, affected paths, impact, and a suggested fix.

## Deployment boundary

Before production use, add deployment-level controls that are outside this demo: HTTPS termination, secret rotation, durable rate limiting, dependency monitoring, backups, audit logging, access controls, and a real inventory/payment design.
