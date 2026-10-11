# Contributing

## Local setup

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Generate a unique local `SESSION_SECRET` with the command in `README.md`.
4. Run `npm install` and `npm run dev`.

## Before opening a pull request

Run:

```bash
npm run lint
npm test
npm run build
```

Do not include `.env*` files other than `.env.example`, SQLite databases, generated build state, credentials, customer data, or screenshots containing private information. Keep sample data clearly labeled as sample data.

Prefer small changes with tests for validation, authentication, booking, and redirect behavior. Explain security-sensitive changes in the pull request description.
