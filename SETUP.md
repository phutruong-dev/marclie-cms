# SETUP.md — start a new project from the Marclie CMS template

Checklist for spinning up a **new client project** from this starter. The core stays untouched — you change content, tokens, and branding. For day-to-day conventions read `CLAUDE.md`; for a getting-started overview read `README.md`.

## 1. Create the repo
- [ ] On GitHub, **Use this template** → new repo (once this repo is marked a Template — TTD Phase 14). Or clone and reset git history.
- [ ] `corepack enable` (activates pnpm) · confirm Node matches `.nvmrc` (24).
- [ ] `pnpm install`

## 2. Database (Neon)
- [ ] Create a Neon project → create a **dev branch** for local work.
- [ ] Copy env: `cp .env.example .env`
- [ ] Fill `.env`:
  - [ ] `DATABASE_URL` — the Neon connection string (`?sslmode=require`)
  - [ ] `PAYLOAD_SECRET` — a long random string
  - [ ] `NEXT_PUBLIC_SERVER_URL` — `http://localhost:3000` for local
  - [ ] `PREVIEW_SECRET`, `CRON_SECRET` — random strings
- [ ] `pnpm dev` → the engine pushes the schema to Neon; open `/admin` and create the first admin user.

## 3. Load / clear demo content
- [ ] `pnpm seed` loads demo pages/posts/projects/nav/media (stop the dev server first).
- [ ] Before going live, replace demo content with the client's real content (via `/admin`), or edit the seed builders in `src/endpoints/seed/`.

## 4. Rebrand
- [ ] **Colours & type** → edit token variables in `src/app/(frontend)/globals.css` (Tailwind v4 `@theme`; both light and `[data-theme='dark']`). See `docs/theming.md`. Don't edit components for rebranding.
- [ ] **Admin branding** → `src/cms/branding.ts` (title/favicon/OG), `src/cms/graphics/Logo.tsx` + `Icon.tsx` (wordmark/monogram), `src/cms/admin.scss`.
- [ ] **Site logo** → `src/components/Logo/Logo.tsx`.
- [ ] **Frontend metadata defaults** → `src/utilities/mergeOpenGraph.ts` + `generateMeta.ts`.
- [ ] Replace favicon/OG assets in `public/`.

## 5. Tailor content model (only if needed)
- [ ] New content type → `create-collection` skill (register in `payload.config.ts`, set access control, `pnpm generate:types`).
- [ ] New section/block → `add-block` skill (config + Component + `RenderBlocks` + expose in the layout field).
- [ ] After any config change: `pnpm generate:types` then `pnpm typecheck`.

## 6. Guardrails green
- [ ] `pnpm lint` → 0 errors
- [ ] `pnpm typecheck` → 0 errors
- [ ] `pnpm build` succeeds
- [ ] `pnpm test:int` passes

## 7. Deploy (Vercel — see TTD Phase 12)
- [ ] Connect the repo to Vercel.
- [ ] Provision **Neon Postgres** via the Vercel Marketplace (auto-injected env, branch-per-preview).
- [ ] Add **Vercel Blob** for media; set `next/image` remote patterns.
- [ ] Set production env vars; **run engine migrations on deploy** (no auto-push in prod).
- [ ] PR → Vercel Preview Deploy + a dedicated Neon DB branch.
- [ ] Attach the client domain.

## 8. Housekeeping
- [ ] Update `README.md` title/description for the client project.
- [ ] Keep `CLAUDE.md` / `MAP.md` / `CHANGELOG.md` current as you diverge from the template.
- [ ] Record new decisions in `docs/adr/`.
