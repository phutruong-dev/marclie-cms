# Deployment — Vercel + Neon + Blob

How Marclie CMS is deployed and what is prepared in the repo vs. done in the dashboards. See ADR `0003` for the rationale; TTD Phase 12 for the checklist.

## Model
- **Code** → git (Vercel builds from the repo).
- **Schema** → engine migrations in `src/migrations/`, applied on deploy (`pnpm migrate`). No auto-push in production.
- **Data/content** → per-environment Postgres (Neon); never in git. Prod content lives in the prod DB.
- **Media** → Vercel Blob in prod/preview; local disk in dev.

## Build & migrations
- Postgres adapter auto-pushes schema in **dev** (`NODE_ENV !== production`) and is **off in production** by default → prod uses committed migrations.
- **Vercel build command:** `pnpm run vercel-build` → `payload migrate && pnpm build`. Pending migrations apply before each production/preview build.
- Migration scripts:
  ```bash
  pnpm migrate          # apply pending migrations
  pnpm migrate:create   # generate a migration from the current config (needs a DB)
  pnpm migrate:status   # applied / pending
  ```
- **Baseline migration (one-time, before first prod deploy):** point `DATABASE_URL` at a fresh DB, run `pnpm migrate:create`, commit `src/migrations/*.ts`. See `src/migrations/README.md`.

## Media (Vercel Blob)
- Plugin: `@payloadcms/storage-vercel-blob` on the `media` collection, `enabled` only when `BLOB_READ_WRITE_TOKEN` is set.
- Local dev has no token → media stays on local disk (`/api/media`); nothing to configure.
- `next/image` allows `*.public.blob.vercel-storage.com` (see `next.config.ts`).

## Production environment variables
Set in Vercel (Neon/Blob integrations inject some automatically):
| Var | Source |
|---|---|
| `DATABASE_URL` | Neon (Vercel Marketplace integration) |
| `PAYLOAD_SECRET` | manual — a long random string |
| `NEXT_PUBLIC_SERVER_URL` | production URL (Vercel also exposes `VERCEL_PROJECT_PRODUCTION_URL`) |
| `PREVIEW_SECRET`, `CRON_SECRET` | manual — random strings |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob integration (auto) |

## CI (`.github/workflows/ci.yml`)
- `quality` job: lint + typecheck on every push/PR.
- `integration` job: `postgres:16` service → `pnpm migrate` → `pnpm test:int` → `pnpm build`. The production `build` step is skipped until a baseline migration is committed, then activates automatically.

## Repo-side vs. dashboard-side (Phase 12)
**Done in the repo (this pass):**
- Vercel Blob plugin + `next/image` remote pattern + `BLOB_READ_WRITE_TOKEN` env.
- Migration scripts, `migrationDir`, and the `pnpm run vercel-build` deploy build command.
- CI Postgres-backed integration + gated build job.

**Still dashboard/DB-side (interactive):**
- Connect the repo to Vercel; set the build command to `pnpm run vercel-build`.
- Provision Neon via the Vercel Marketplace (branch-per-preview) + add a Blob store.
- Generate & commit the **baseline migration** against a real DB.
- Set production env vars; attach a domain; confirm PR → preview deploy + dedicated Neon branch.
