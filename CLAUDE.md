# CLAUDE.md — Marclie CMS

> Project memory & conventions for Claude / AI agents. **Read this file at the start of every session.**
> Execution plan: `TTD.md`. Repo map: `MAP.md`. Architecture decisions: `docs/adr/`. History: `CHANGELOG.md`.
> Non-Claude agents: `AGENTS.md`. Getting started: `README.md`. New-project checklist: `SETUP.md`.

## ⚠️ REQUIRED CONVENTIONS
- **Regenerate the admin import map after config changes.** Adding/removing plugins or custom admin components requires `pnpm generate:importmap` (commit `src/app/(payload)/admin/importMap.js`) — a stale map renders the **production** admin blank (dev resolves dynamically and hides the bug). For Blob, generate with `BLOB_READ_WRITE_TOKEN` set. The `vercel-build` script also regenerates it on deploy as a safety net.
- **Update docs as part of "done".** After finishing ANY task (stack change, script, structure, skill, convention…), re-check and update this file, plus `TTD.md` (progress), `MAP.md` (if layout changed), `CHANGELOG.md`, and `docs/adr/` (new decisions). Stale docs mislead AI — treat updating them as part of the task's definition of done, not extra work.
- **Language:** ALL documentation and code comments are written in **English**. (Chat replies to the owner are in Vietnamese.)
- **Branding:** This is the **Marclie CMS** project — refer to the product as "Marclie CMS", not as "a Payload project". See foundation note below.

## What this is
**Marclie CMS** — a starter template combining a marketing site + CMS in a single Next.js app. Each new project changes content + theme tokens only; the core is left untouched.

> **Technical foundation (for AI accuracy):** Marclie CMS is currently built on the Payload framework (engine) running in-repo. The npm package `payload`, the `payload` CLI, `payload.config.ts`, and `@payloadcms/*` packages are the real engine and must be used as-is. Over time the project will be customised into a distinct Marclie CMS. Brand the product as Marclie CMS; keep this one note for engine accuracy.

## Tech stack (locked — see `docs/adr/0001`)
- **Next.js 16.2.6** (App Router, Turbopack) · **React 19.2.6**
- **CMS engine 3.85.1** (pinned) — admin at `/admin`, auto-generated REST/GraphQL
- **Tailwind v4** (CSS-first `@theme`) + **shadcn/ui** (in `src/components/ui/`)
- **Postgres via `@payloadcms/db-postgres`** → **Neon** (local dev branch + prod). Env var `DATABASE_URL`.
- CMS plugins: seo, redirects, nested-docs, search, form-builder; rich text **Lexical**; live-preview
- Tests: **Playwright** (e2e) + **Vitest** (int). Package manager: **pnpm**. Node: `.nvmrc` = 24.

## Commands
```bash
pnpm dev                 # dev server (localhost:3000, /admin)
pnpm build               # production build
pnpm start               # run the production build
pnpm lint                # eslint (native flat config, see docs/adr/0002)
pnpm lint:fix            # eslint --fix
pnpm typecheck           # tsc --noEmit
pnpm generate:types      # generate src/payload-types.ts from config
pnpm generate:importmap  # generate the admin import map
pnpm payload             # CMS engine CLI (migrate, etc.)
pnpm migrate             # apply pending DB migrations (run on deploy)
pnpm migrate:create      # generate a migration from the current config (needs a DB)
pnpm run vercel-build    # deploy build: payload migrate && pnpm build (Vercel build command)
pnpm seed                # reset + load demo content (tsx; sets DISABLE_REVALIDATE=true). Stop the dev server first.
pnpm test                # test:int + test:e2e
pnpm test:int            # vitest
pnpm test:e2e            # playwright
```
> Requires `.env` with `DATABASE_URL` (Neon) + `PAYLOAD_SECRET`. Template: `.env.example`.
> **Env validation:** `src/env.ts` (`@t3-oss/env-nextjs` + zod) is imported in `next.config.ts`; missing/invalid config fails at dev/build time. Bypass with `SKIP_ENV_VALIDATION=1`.
> **CI:** `.github/workflows/ci.yml` runs lint + typecheck on every push/PR (build + e2e/int need a DB → added in Phase 12).

## Layout
See `MAP.md` for the full repo map. Key directories live under `src/` (`app/`, `collections/`, `blocks/`, `components/`, `providers/`, `plugins/`, `endpoints/`) with `payload.config.ts` as the central CMS config.

## Theming
Design tokens live in `src/app/(frontend)/globals.css` (Tailwind v4 `@theme`). Dark mode is driven by the `data-theme` attribute on `<html>` (not a `.dark` class), toggled by `src/providers/Theme`. **Rebrand = edit the token variables**, not components. Full guide: `docs/theming.md`.

## Rendering
Static-first: marketing/CMS pages are SSG with **on-demand revalidation** (engine `afterChange` hooks call `revalidatePath`/`revalidateTag` on publish); `/posts` uses time-based ISR (10 min); `/admin`, `/api`, `/search` are dynamic. Drafts are gated by `authenticatedOrPublished` + `draftMode`. Full guide: `docs/rendering.md`.

## Deployment
Vercel + Neon Postgres + Vercel Blob. **Dev auto-pushes schema; prod uses migrations** (`src/migrations/`, applied via `pnpm migrate`) — no auto-push in prod. Vercel build command = `pnpm run vercel-build` (`payload migrate && pnpm build`). Media: Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (prod/preview), local disk otherwise (dev). Generate the baseline migration once with `pnpm migrate:create` before the first prod deploy. Full guide: `docs/deployment.md` (ADR `0003`).

## Animation
Isolated wrappers in `src/components/animations/` (barrel: `@/components/animations`). **GSAP = scroll/timeline**, **three.js/R3F = 3D**. Presets: `AnimateIn` (fade/slide-in on scroll + stagger), `Parallax`, `Hero3D` (lazy, client-only WebGL). All respect `prefers-reduced-motion` via `useReducedMotion`. Import `gsap`/`ScrollTrigger` from `animations/gsap.ts` (registers plugins once); never call GSAP/three during SSR; **always** lazy-load 3D (`next/dynamic` `ssr:false`). Full guide: `docs/animation.md`. ⚠️ R3F's global JSX augmentation breaks polymorphic `as`/`htmlElement` typing → use `React.createElement` (see `AnimateIn`, `components/Media`).

## Core vs extension (keep upgrades painless)
- **Core — do not edit:** `src/app/(payload)/` and engine internals. Keeps engine upgrades conflict-free.
- **Extension — customise here:** `src/collections/`, `src/blocks/`, `src/cms/` (branding / internal plugins — created in Phase 8), content under `(frontend)/`, and design tokens.
- **Rebrand via tokens** (Tailwind v4 `@theme`), not by editing components.

## Marclie CMS branding
Brand identity is centralised in `src/cms/`: `branding.ts` (admin `meta` — title/favicon/OG), `graphics/Logo.tsx` + `graphics/Icon.tsx` (admin login wordmark + nav icon), `admin.scss` (admin style overrides, loaded via an import in `graphics/Icon.tsx`). The site header logo is `src/components/Logo/Logo.tsx`. Frontend metadata defaults live in `src/utilities/mergeOpenGraph.ts` + `generateMeta.ts`. Engine core stays untouched. To rebrand a project, edit these files.

## Installed skills (see `TTD.md` Appendix F)
Located in `.agents/skills/` (managed by skills.sh, locked in `skills-lock.json`) + `.claude/skills/` (Claude Code).
- **shadcn** (`.agents/skills/shadcn`) — build/configure shadcn UI; reads `components.json`.
- **GSAP ×8** (`.agents/skills/gsap-*`) — animation; prefer `gsap-react` (`useGSAP`, SSR), `gsap-scrolltrigger`, `gsap-timeline`.
- **tailwind-theme-builder** (`.claude/skills/`, from jezweb) — Tailwind v4 `@theme inline` four-step pattern + dark mode + migration. ⚠️ Its assets are Vite-based → this project uses `@tailwindcss/postcss` (already set up); skip `vite.config`, reuse the `index.css`/pattern.
- **add-block** (`.claude/skills/`) — project skill: add a layout-builder block (config + Component + `RenderBlocks` registry + expose in collection + `generate:types`).
- **create-collection** (`.claude/skills/`) — project skill: add a CMS collection (config + register in `payload.config.ts` + access control + optional frontend route).
- Also available in the environment: `code-review`, `verify`, `security-review`, `design:accessibility-review`, `ui-ux-pro-max`, `frontend-design`.

## Git
- `main` = production. Conventional Commits (`feat:`, `fix:`, `chore:`…). `.env` is never committed.
- Remote: `git@github.com:phutruong-dev/marclie-cms.git`.

## Sync model
Code → git · CMS schema → engine migrations (in git) · Data → per-environment DB (NOT via git).
