# Migrations

Engine (Payload) schema migrations, committed to git and run on deploy.

## How it works
- **Dev:** the Postgres adapter **auto-pushes** the schema to your Neon dev branch (no migration files needed while iterating). `NODE_ENV !== 'production'`.
- **Production:** auto-push is **off** by default. Prod applies the migrations in this folder via `pnpm migrate` (wired into the Vercel build command `pnpm ci` → `payload migrate && pnpm build`). This is intentional — no auto-push in prod (TTD Appendix A / Phase 12).

## Generate the baseline migration (one-time, before the first prod deploy)
Requires a reachable database (a fresh Neon branch is ideal):
```bash
# 1. point DATABASE_URL at a fresh DB (or a dedicated migration branch)
pnpm migrate:create           # diffs config → SQL, writes <timestamp>_initial.ts here
git add src/migrations && git commit -m "chore(db): baseline migration"
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
