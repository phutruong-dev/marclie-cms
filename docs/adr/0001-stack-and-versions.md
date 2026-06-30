# ADR 0001 — Stack & version lock

- **Status:** Accepted
- **Date:** 2026-06-30
- **Related:** `BLUEPRINT.md`, `TTD.md` (Phase 0)

## Context
The **Marclie CMS** starter needs locked versions and a chosen foundation before scaffolding, so every derived project stays consistent and avoids compatibility drift (the #1 risk per the blueprint).

## Decision

### 1. Base scaffold
- Scaffold from the **Payload `website` template**: `pnpm create payload-app -t website`.
- Rationale: saves time, easy to test, ships maintained plugins (SEO, form-builder, redirects, nested-docs, search), drafts/versions/live-preview, and Lexical. Later customisation = adding code while keeping the engine core intact. (Not the `blank` template.)
- Note: `create-payload-app` requires a TTY and failed in the non-interactive shell, so the template was pulled with `degit payloadcms/payload/templates/website#v3.85.1` and version-pinned manually.

### 2. Locked versions
| Component | Locked | Notes |
|---|---|---|
| Node | ≥ 20.9; `.nvmrc` = 24 | Engine requires ≥ 20.9 |
| pnpm | **10.x** (via corepack) | |
| Next.js | **16.2.6** (template default) | Engine supports 16.2.6+. (Originally planned 15.x, but the stable website template ships Next 16 → follow the template.) |
| React | **19.2.6** | Ships with Next 16; required by the engine admin |
| CMS engine | **3.85.1** (hard-pinned, latest stable) | `main` is heading to 4.0-canary → do NOT use `main` |
| Tailwind | **v4** (^4.1.18, native in template) | No v3→v4 migration needed |
| DB adapter | **`@payloadcms/db-postgres`** → Neon | One adapter for local + prod |

### 3. Database
- `@payloadcms/db-postgres` pointed at **Neon** for both local (dev branch) and production. SQLite is only an emergency prototype option; Docker only for fully offline work. Sync model: code → git, schema → migrations, data → per-environment DB.

### 4. Tailwind v4 (verified at scaffold)
- The stable website template already uses **Tailwind v4** (`tailwindcss ^4.1.18`, `@tailwindcss/postcss`, `tw-animate-css`) → no migration required.
- shadcn/ui uses the v4 + React 19 CLI (template `components.json` is present).
- The CMS admin uses its own SCSS, independent of Tailwind → no conflict.

### 4b. MongoDB → Postgres swap at scaffold
- The template defaults to `@payloadcms/db-mongodb` → swapped to **`@payloadcms/db-postgres`** (package.json + `src/payload.config.ts` uses `postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } })`).
- `.env.example` updated to Postgres/Neon.

### 5. Repository
- Remote: **`git@github.com:phutruong-dev/marclie-cms.git`**, set as `origin` in Phase 1.
- Keep it **private** if premium assets (e.g. shadcn studio) are embedded later; otherwise public is fine.

### 6. External skills (Phase 1)
- shadcn: `pnpm dlx skills add shadcn/ui`
- Tailwind v4 + shadcn (jezweb tailwind-theme-builder): copied into `.claude/skills/`
- GSAP (official): `npx skills add https://github.com/greensock/gsap-skills`

## Consequences
- All later phases follow the locked versions; upgrades (e.g. Next 17) go through a new ADR + tests.
- Check at the start of any work: the Tailwind/engine versions the template pins.
