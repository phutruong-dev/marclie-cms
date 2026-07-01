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

## Current production setup (2026-07-01)
- **Live:** `https://marclie-cms.vercel.app` (Vercel project `marclie-cms`, GitHub `phutruong-dev/marclie-cms`).
- **Build command:** `pnpm run vercel-build`. ⚠️ Not `pnpm ci` — pnpm reserves `ci` as a builtin (`ERR_PNPM_CI_NOT_IMPLEMENTED`) and won't run a script named `ci`.
- **Prod DB:** a dedicated **empty Neon project** `marclie-cms-prod` (direct connection string in `DATABASE_URL`), separate from the dev project. Migrations applied on deploy created the schema; `pnpm seed` loaded demo content.
- **Runtime Node:** 24.x (Vercel). Deploy runs `payload migrate` (apply) which is fine on 24.
- **Migration generation:** done on **Node 22** via the `Generate baseline migration` GitHub Action (see `src/migrations/README.md`) — `migrate:create` breaks on Node 24.

**Deferred (optional):**
- **Vercel Blob** store — until added, media uploaded in prod won't persist (Vercel FS is ephemeral).
- **Branch-per-preview** via the Neon–Vercel integration (chose a separate prod project over the Marketplace for now).
- Custom **domain**.

## Repo-side (reference)
- Vercel Blob plugin + `next/image` remote pattern + `BLOB_READ_WRITE_TOKEN` env (token-gated).
- Migration scripts, `migrationDir`, and the `pnpm run vercel-build` deploy build command.
- CI Postgres-backed integration + gated build job.
