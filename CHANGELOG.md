# Changelog

All notable changes to Marclie CMS are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project aims to follow [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added
- Scaffolded Marclie CMS from the Payload website template (pinned engine `3.85.1`): Next.js 16.2.6, React 19.2.6, Tailwind v4, Postgres.
- `docs/theming.md` — theming guide (token file, Tailwind v4 four-step pattern, dark mode via `data-theme`, how to rebrand).
- `Projects` collection (portfolio): case studies with gallery, client/year/url, categories, SEO, drafts/versions.
- Project docs: `CLAUDE.md`, `TTD.md`, `MAP.md`, `CHANGELOG.md`, ADRs `0001` (stack & versions) and `0002` (eslint flat config & react-hooks).
- Environment validation: `src/env.ts` (`@t3-oss/env-nextjs` + zod), enforced in `next.config.ts`.
- `typecheck` script (`tsc --noEmit`).
- GitHub Actions CI (`.github/workflows/ci.yml`): lint + typecheck on push/PR.
- External AI skills: shadcn, GSAP ×8, tailwind-theme-builder.
- `.nvmrc` (Node 24) and `.gitattributes` (enforce LF).

### Changed
- Database adapter swapped from MongoDB to Postgres (`@payloadcms/db-postgres`) for both local (Neon dev branch) and production.
- ESLint: replaced `FlatCompat` with native flat config to fix a circular-JSON crash; react-hooks v6 rules disabled per-file on intentional template patterns.
- Vitest: raised `hookTimeout`/`testTimeout` for booting the CMS against remote Neon.
- All documentation and code comments standardised to English; product branded as Marclie CMS.
- `Media.alt` is now required (accessibility); SEO page-title fallback rebranded to "Marclie CMS".

### Removed
- `docker-compose.yml` and `Dockerfile` — the project uses Neon + Vercel, so local Docker is unnecessary.
- `BLUEPRINT.md` — the original strategy doc; its decisions now live in `TTD.md` and `docs/adr/`. Removed all `[BP §x]` references accordingly.
