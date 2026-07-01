# ADR 0003 — Deploy: migrations in prod & Vercel Blob for media

- **Status:** Accepted
- **Date:** 2026-07-01
- **Related:** `src/payload.config.ts`, `src/plugins/index.ts`, `next.config.ts`, `package.json`, `.github/workflows/ci.yml`, `docs/deployment.md`, TTD Phase 12

## Context
Phase 12 hosts Marclie CMS on Vercel with Neon Postgres. Two production concerns must be settled in the repo before touching the Vercel/Neon dashboards:
1. **Schema changes in production** — the Postgres adapter auto-pushes schema in dev, which is unsafe for prod (data loss, no review). TTD Appendix A mandates schema-via-migrations, no auto-push in prod.
2. **Media storage** — local disk (`/api/media`) does not persist on Vercel's ephemeral filesystem; production needs durable object storage.

## Decision

### 1. Migrations run on deploy; no auto-push in prod
- The Postgres adapter disables `push` automatically when `NODE_ENV=production`, so prod already relies on committed migrations — we keep that default rather than forcing `push`.
- `migrationDir` is set explicitly to `src/migrations/` for a stable, tracked path.
- Scripts: `migrate`, `migrate:create`, `migrate:status`. The Vercel **build command is `pnpm ci`** = `payload migrate && pnpm build`, so pending migrations apply before each production build.
- **Dev keeps auto-push** (fast iteration against a Neon dev branch); migration files are generated with `pnpm migrate:create` only when schema stabilises, then committed.
- The **baseline migration must be generated once** (`pnpm migrate:create` against a fresh DB) before the first prod deploy — a DB-connected step, tracked in Phase 12.

### 2. Vercel Blob for media (token-gated)
- `@payloadcms/storage-vercel-blob` (pinned `3.85.1`) wired into `plugins` with `enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN)`.
- **Absent token → disabled → local disk** (unchanged dev experience). Vercel auto-injects `BLOB_READ_WRITE_TOKEN` when a Blob store is connected, enabling it in prod/preview only.
- `next.config.ts` `images.remotePatterns` gains `*.public.blob.vercel-storage.com` (https) so `next/image` serves Blob-hosted media.
- `BLOB_READ_WRITE_TOKEN` added to the env schema (`src/env.ts`, optional) and `.env.example`.

### 3. CI gains a Postgres-backed job
- New `integration` job: `postgres:16` service → install → `pnpm migrate` → `pnpm test:int` → `pnpm build`.
- Integration tests pass via dev auto-push regardless of committed migrations.
- The production `build` step is **gated on a committed migration existing** (`src/migrations/*.ts`), so CI stays green before the Phase 12 baseline is generated and **self-activates** once it lands.

## Consequences
- Production schema changes are explicit, reviewable, and applied on deploy — no surprise auto-push.
- Media persists in production without code changes to collections; dev is unaffected.
- CI exercises the real DB path now (int tests) and the full production build automatically after the baseline migration is committed.
- Remaining Phase 12 work is dashboard-side (connect Vercel, Neon Marketplace, Blob store, env, domain, preview branches) — see `docs/deployment.md`.
