# Migrations

Engine (Payload) schema migrations, committed to git and run on deploy.

## How it works
- **Dev:** the Postgres adapter **auto-pushes** the schema to your Neon dev branch (no migration files needed while iterating). `NODE_ENV !== 'production'`.
- **Production:** auto-push is **off** by default. Prod applies the migrations in this folder via `pnpm migrate` (wired into the Vercel build command `pnpm run vercel-build` → `payload migrate && pnpm build`). This is intentional — no auto-push in prod (TTD Appendix A / Phase 12).

## Generating migrations — use GitHub Actions (Node 22), not local Node 24
`payload migrate:create` runs the config through **tsx**, and on **Node 24** tsx + drizzle-kit
throw `ENOENT: ... node:crypto?tsx-namespace` (reproduces on Windows *and* Linux). Generate on
**Node 22** instead. This repo ships a one-shot workflow for it:

- GitHub → **Actions → "Generate baseline migration" → Run workflow** (Node 22 on ubuntu). It
  runs `payload migrate:create` and commits the migration files back to `main`.
- `migrate:create` uses `disableDBConnect`, so it does not need a real database.

> `payload migrate` (**apply**) does **not** use drizzle-kit → it runs fine on Node 24 (local
> Windows and the Vercel deploy build). Only *generation* needs Node 22.

Local generation (only if you have Node 22 available):
```bash
# point DATABASE_URL at a reachable DB, then:
pnpm migrate:create           # diffs config → SQL, writes <timestamp>_<name>.ts here
git add src/migrations && git commit -m "chore(db): migration"
```
After a schema change (new collection/field), run `pnpm migrate:create` again to add a new migration, commit it, and it will apply on the next deploy.

## Commands
```bash
pnpm migrate          # apply pending migrations
pnpm migrate:create   # generate a new migration from the current config
pnpm migrate:status   # list applied / pending migrations
```

> This folder is tracked even while empty so the migration path is stable. Delete this
> README once real migration files land, or leave it as documentation.
