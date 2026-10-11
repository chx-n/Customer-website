# Project Structure

```text
app/
  (marketing)/       public landing and fleet routes
  (auth)/            login and registration
  dashboard/         protected renter account
  api/               auth, car, and booking route handlers
.github/             public-repo CI and contribution metadata
components/          focused UI components and client interactions
lib/                 database, auth, validation, and domain helpers
public/              local static assets
tests/               unit and route behavior tests
docs/superpowers/   product design and implementation records
```

Keep database and auth logic in `lib/`. Keep client-only state in leaf components. Keep route handlers thin: parse input, call a domain function, return a typed response.

Local secrets, SQLite data, build output, TypeScript incremental state, and agent/editor state are ignored. The repository contains sample fleet records and no production credentials.
