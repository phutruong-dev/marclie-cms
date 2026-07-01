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

## Production infrastructure (2026-07-01)

> Where prod lives, so future deploys target the right resources. **IDs only — no secrets.**
> Secrets live in Vercel env vars (and, temporarily, `../../my-api.md` — rotate + delete that).

| Resource | Value |
|---|---|
| **Live URL** | https://marclie-cms.vercel.app |
| **Git repo** | `github.com/phutruong-dev/marclie-cms` (branch `main` → auto-deploys prod) |
| **Vercel project** | name `marclie-cms` · id `prj_G5xLB6PNzi1OJ44YYSqvUYVjriuO` |
| **Vercel team/owner** | `phu-truong` · team id `team_HHQzqGvN4EeV8T3HSymIZjJO` |
| **Build command** | `pnpm run vercel-build` (= `payload migrate && payload generate:importmap && pnpm build`) |
| **Runtime Node** | 24.x |
| **Neon org** | `Phu Dev` · `org-gentle-tree-01335350` |
| **Neon PROD db** | project `marclie-cms-prod` · id `ancient-forest-83446570` · branch `main` · region `aws-eu-central-1` (direct connection string → `DATABASE_URL`) |
| **Neon DEV db** | none currently — the old dev project was deleted. For local dev, create a fresh Neon project/branch and put its connection string in `.env` (`DATABASE_URL`). Never point local dev at the prod DB. |
| **Vercel Blob** | store `marclie-cms-media` · id `store_hlslN6ZTzjo1gnz9` · region `iad1` (injects `BLOB_READ_WRITE_TOKEN`) |

**Prod env vars** (set in Vercel → Settings → Environment Variables): `DATABASE_URL` (Neon prod), `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`, `CRON_SECRET`, `BLOB_READ_WRITE_TOKEN` (auto from Blob store).

### How to deploy
- **Normal:** push to `main` → Vercel auto-deploys production (runs migrate → generate:importmap → build).
- **Schema change:** run the `Generate baseline migration` GitHub Action (Node 22 — `migrate:create` breaks on Node 24), commit the new file, push. `payload migrate` (apply) runs on deploy (fine on Node 24).
- **Manual redeploy (API):** `POST https://api.vercel.com/v13/deployments` with `{project:"prj_G5xLB6PNzi1OJ44YYSqvUYVjriuO", target:"production", gitSource:{type:"github", repoId:1284827582, ref:"main"}}`.

**Deferred (optional):**
- **Branch-per-preview** via the Neon–Vercel integration (chose a separate prod project over the Marketplace for now).
- Custom **domain**.
- Sentry / Vercel Analytics.

## Repo-side (reference)
- Vercel Blob plugin + `next/image` remote pattern + `BLOB_READ_WRITE_TOKEN` env (token-gated).
- Migration scripts, `migrationDir`, and the `pnpm run vercel-build` deploy build command.
- CI Postgres-backed integration + gated build job.
