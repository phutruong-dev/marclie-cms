# Changelog

All notable changes to Marclie CMS are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project aims to follow [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added
- Scaffolded Marclie CMS from the Payload website template (pinned engine `3.85.1`): Next.js 16.2.6, React 19.2.6, Tailwind v4, Postgres.
- `docs/theming.md` — theming guide (token file, Tailwind v4 four-step pattern, dark mode via `data-theme`, how to rebrand).
- `docs/rendering.md` — per-route render strategy (SSG/ISR, on-demand revalidation, drafts/preview).
- `Projects` collection (portfolio): case studies with gallery, client/year/url, categories, SEO, drafts/versions.
- `Features` and `Gallery` layout blocks (config + component), registered in the block registry and the Pages layout.
- `pnpm seed` CLI script (`src/seed.ts`) to reset and load demo content.
- Marclie CMS branding under `src/cms/` (`branding.ts`, `graphics/Logo`, `graphics/Icon`, `admin.scss`): branded admin title, favicon, login wordmark.
- Project docs: `CLAUDE.md`, `TTD.md`, `MAP.md`, `CHANGELOG.md`, ADRs `0001` (stack & versions) and `0002` (eslint flat config & react-hooks).
- Environment validation: `src/env.ts` (`@t3-oss/env-nextjs` + zod), enforced in `next.config.ts`.
- `typecheck` script (`tsc --noEmit`).
- GitHub Actions CI (`.github/workflows/ci.yml`): lint + typecheck on push/PR.
- External AI skills: shadcn, GSAP ×8, tailwind-theme-builder.
- `.nvmrc` (Node 24) and `.gitattributes` (enforce LF).
- Animation wrappers in `src/components/animations/` (GSAP + three.js/R3F): `AnimateIn` (fade/slide-in on scroll + stagger), `Parallax` (scrubbed), `Hero3D` (lazy, client-only WebGL placeholder), `useReducedMotion`, and a central `gsap.ts` plugin registry. All respect `prefers-reduced-motion`. `AnimateIn` wired into the Features block. Deps: `gsap`, `@gsap/react`, `three`, `@react-three/fiber`, `@react-three/drei`.
- `docs/animation.md` — animation guide (wrappers, presets, lazy-loading 3D, reduced-motion, the R3F polymorphic-typing caveat).
- Marketing pages `about`, `services`, `portfolio` (seeded, composed from existing blocks) and rich-text seed helpers (`endpoints/seed/lexical.ts`).
- Portfolio frontend: `projects/[slug]` detail route (SSG, drafts/preview) and 3 sample `Projects` (`endpoints/seed/projects-data.ts`). The portfolio page lists projects via the Archive block reading the `projects` collection.
- `AGENTS.md` — tool-agnostic AI-agent conventions (non-Claude subset of `CLAUDE.md`).
- `SETUP.md` — checklist for starting a new project from the template.
- Project-specific Claude Code skills: `.claude/skills/add-block` and `.claude/skills/create-collection`.
- **Phase 12 — production live** at `https://marclie-cms.vercel.app` (Vercel + Neon):
  - Vercel project linked to `phutruong-dev/marclie-cms`; build command `pnpm run vercel-build`; production env set (DATABASE_URL/PAYLOAD_SECRET/NEXT_PUBLIC_SERVER_URL/PREVIEW_SECRET/CRON_SECRET).
  - Dedicated empty Neon prod project `marclie-cms-prod`; baseline migration applied on deploy; demo content seeded.
  - `.github/workflows/generate-baseline-migration.yml` — one-shot workflow that generates the baseline migration on **Node 22** (`migrate:create` fails on Node 24 via tsx+drizzle-kit).
  - Renamed the deploy script `ci` → `vercel-build` (`pnpm ci` is a pnpm builtin and never ran the script); removed the unused `@swc-node/register` dev-dep.
  - Vercel Blob store `marclie-cms-media` created + connected (injects `BLOB_READ_WRITE_TOKEN`); prod re-seeded with Blob enabled so media (32 files) is served from Blob.
  - Deferred: Neon branch-per-preview, custom domain.
- Phase 12 repo-side prep (ADR `0003`, `docs/deployment.md`):
  - Vercel Blob media storage (`@payloadcms/storage-vercel-blob` 3.85.1) on the `media` collection, token-gated (local dev keeps disk storage); `next/image` remote pattern `*.public.blob.vercel-storage.com`; `BLOB_READ_WRITE_TOKEN` in `env.ts` + `.env.example`.
  - Migration workflow: `migrate`/`migrate:create`/`migrate:status` scripts, explicit `migrationDir: src/migrations/`, `src/migrations/README.md`, and a `vercel-build` deploy build command (`payload migrate && pnpm build`).
  - CI `integration` job (Postgres 16 service → migrate → int tests → build; production build gated on a committed baseline migration).

### Changed
- `README.md` rewritten for Marclie CMS getting-started (replaced the base template's Payload readme).
- Database adapter swapped from MongoDB to Postgres (`@payloadcms/db-postgres`) for both local (Neon dev branch) and production.
- ESLint: replaced `FlatCompat` with native flat config to fix a circular-JSON crash; react-hooks v6 rules disabled per-file on intentional template patterns.
- Vitest: raised `hookTimeout`/`testTimeout` for booting the CMS against remote Neon.
- All documentation and code comments standardised to English; product branded as Marclie CMS.
- `Media.alt` is now required (accessibility); SEO page-title fallback rebranded to "Marclie CMS".
- Revalidate hooks honour a `DISABLE_REVALIDATE` env flag so CLI seeding works outside a Next.js request context.
- `components/Media` and `AnimateIn` build their polymorphic element via `React.createElement` so they survive R3F's global `JSX.IntrinsicElements` augmentation under `tsc`.
- `Card`, `CollectionArchive` and the Archive block (config + Component) now support the `projects` collection in addition to `posts`.
- Seed: categories are created with an awaited `Promise.all` (so their IDs can be referenced by projects) instead of an un-awaited array nested inside another `Promise.all` (latent template bug); footer/header nav rebranded — removed user-facing "Payload"/template links.
- Replaced all user-facing "Payload Website Template" branding with "Marclie CMS" (logo, admin, metadata, seed content).

### Removed
- `docker-compose.yml` and `Dockerfile` — the project uses Neon + Vercel, so local Docker is unnecessary.
- `BLUEPRINT.md` — the original strategy doc; its decisions now live in `TTD.md` and `docs/adr/`. Removed all `[BP §x]` references accordingly.
