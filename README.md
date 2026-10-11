# Northline Rental

Northline Rental is a full-stack car-rental demo built with Next.js App Router, TypeScript, Tailwind CSS, SQLite, bcryptjs, and signed HTTP-only cookie sessions. It lets a first-time visitor browse a focused sample fleet, compare daily prices, create a local account, reserve a vehicle, and log out.

> This repository is a local demo. Vehicle data, prices, and availability are sample data. It has no payment processing, live inventory, email delivery, or production deployment configuration.

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
node -e "const fs=require('fs'); const crypto=require('crypto'); const p='.env.local'; let v=fs.readFileSync(p,'utf8'); v=v.replace('SESSION_SECRET=', 'SESSION_SECRET='+crypto.randomBytes(32).toString('base64url')); fs.writeFileSync(p,v)"
npm run dev
```

Open `http://localhost:3000`, create a local account, reserve a sample car, then use the account menu to log out. SQLite is created at `data/northline.sqlite`; that directory is intentionally ignored by Git.

## Useful commands

```bash
npm run dev       # local development server
npm test          # Vitest suite
npm run lint      # TypeScript check
npm run build     # production build
```

## Security model

- `SESSION_SECRET` is required outside the test environment and must be at least 32 bytes.
- Passwords are hashed with bcryptjs; raw passwords never enter API responses.
- Sessions use signed JWTs in `HttpOnly`, `SameSite=Lax` cookies with production-only `Secure` and issuer/audience validation.
- API responses are marked `no-store`, and baseline browser security headers are configured in `next.config.ts`.
- `.env*`, SQLite files, build output, TypeScript incremental state, and local agent/editor state are ignored.
- No real customer, payment, production, or third-party API credentials belong in this repository.

Read [SECURITY.md](SECURITY.md) before deploying or reporting a vulnerability.

## Project map

See [STRUCTURE.md](STRUCTURE.md) for the code layout and [PRODUCT.md](PRODUCT.md) for the product scope. The public UI lives in `app/` and `components/`; auth, SQLite, seed data, and validation live in `lib/`.

## Contributing

Small, focused pull requests are welcome. Run the full local checks before opening one. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Released under the [MIT License](LICENSE).
