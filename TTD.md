# TTD — Task Tracking Document

> **Goal:** Scaffold the **Marclie CMS** starter (Next.js + CMS engine + Tailwind v4 + shadcn) until it runs locally, deploys on Vercel, and becomes a GitHub Template.
> **Execution philosophy:** Build the **engine first, content later**. Start from the base **`website` template** (which already ships maintained plugins/drafts/live-preview), then *own & rebrand* it instead of hand-building from scratch. Turn guardrails (lint/typecheck/CI/env) on **early** so all code — including AI-generated — is checked from the first commit.
> **How to use:** Work phase by phase. Tick `[x]` when done. Each phase has a **Definition of Done (DoD)** — do not advance until the DoD is met.
> **Source of truth:** this file (`TTD.md`) + `docs/adr/` + `CLAUDE.md`. (The original `BLUEPRINT.md` strategy doc has been removed; its decisions are captured here and in the ADRs.)

**Overall status:** Phase 0–2 done · Phase 3 next.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked / needs decision

> 📌 **Foundation note:** Marclie CMS currently runs on the Payload engine in-repo. Package/CLI names like `payload`, `@payloadcms/*`, and `payload.config.ts` are the real engine and stay as-is; the product is branded "Marclie CMS". See `CLAUDE.md`.

---

## Phase 0 — Technical decisions & version lock *(settle before running commands)* ✅ DONE

- [x] **Lock the compatibility trio**: **Next.js 16.2.6 · React 19.2.6 · engine 3.85.1** — verified: engine supports Next 16.2.6+, Node ≥20.9
- [x] **Tailwind v4** — shadcn CLI for v4 + React 19; v4: `@import "tailwindcss"`, tokens via `@theme`, dark via `@custom-variant dark` (Appendix E). Confirmed the template already ships v4.
- [x] **DB adapter `@payloadcms/db-postgres`** pointed at Neon for both local and prod
- [x] **Base scaffold: `website` template**
- [x] Tooling verified: Node 24.14.1 · pnpm 10.33 · git 2.53 · corepack 0.34.6
- [x] Repo: **`git@github.com:phutruong-dev/marclie-cms.git`** — set as `origin` in Phase 1

**DoD:** ✅ Recorded in `docs/adr/0001-stack-and-versions.md`. Version trio, Tailwind v4, DB adapter, base template, repo — all locked.

---

## Phase 1 — Foundation scaffold + Git + CLAUDE.md ✅ DONE

- [x] Scaffold the **website template** (degit tag `v3.85.1`; `create-payload-app` needs a TTY → not used) — db postgres → Neon
- [x] `git init` (branch `main`) + commit `80354e3` + `.gitignore` (`.env`, `.next`, `node_modules`); origin = `phutruong-dev/marclie-cms`
- [x] **`CLAUDE.md`** (grows over time): stack, version lock, commands, core-vs-extension, skill locations
- [x] **Install 3 core external skills** (Appendix F.1): shadcn (`.agents/skills/`), GSAP ×8 (`.agents/skills/`), tailwind-theme-builder/jezweb (`.claude/skills/`) — commands in `CLAUDE.md`
- [x] `package.json`: hard-pinned versions (engine 3.85.1) + scripts `dev`/`build`/`payload`/`generate:types`/`generate:importmap` (from template; **no `seed` script yet** — template uses the `/next/seed` route + SeedButton)
- [x] Lock Node (`.nvmrc`=24) + `.gitattributes` (LF) — engines already declared in package.json
- [x] Template layout uses `(frontend)` instead of `(marketing)` — map/rename later if needed

**DoD:** ✅ `pnpm dev` runs (Next 16.2.6); `/admin`→200, `/admin/login`→200, `/`→200; schema pushed to Neon; first admin user created; `payload-types.ts` regenerated for Postgres. CLAUDE.md + 3 skills + `.nvmrc`/`.gitattributes` done.

> 🎁 The template already includes (reduces Phase 4–7 work): blocks + `RenderBlocks.tsx` (registry), collections + access control, plugins (seo/redirects/nested-docs/search/form-builder), Theme light/dark, seed endpoint, Lexical rich text, Playwright + Vitest.

---

## Phase 2 — Walking skeleton + Guardrails *(early — guardrails are the key to AI-assisted work)* ✅ LOCAL DoD MET

- [x] **TypeScript strict** — template already sets `strict: true`; added `pnpm typecheck` script
- [x] **Env validation with Zod** (`@t3-oss/env-nextjs` + zod) → `src/env.ts`, imported in `next.config.ts`; bypass with `SKIP_ENV_VALIDATION=1`
- [x] ESLint + Prettier — **fixed the lint crash**: dropped FlatCompat → native flat config; react-hooks v6 disabled per-file (ADR 0002). `pnpm lint` → 0 errors
- [x] **Playwright (e2e)** — template ships `tests/e2e/*` (needs browser+server → run in Phase 13/`verify`)
- [x] **Vitest (int)** — template ships it; raised `hookTimeout` (booting the engine over Neon >10s). `pnpm test:int` PASS
- [x] **GitHub Actions CI** `.github/workflows/ci.yml`: lint + typecheck on every push/PR (build + e2e/int need a DB → Phase 12)
- [x] Convention: later phases merge only when CI is green

**DoD:** ✅ local: `pnpm lint` (0 err) · `pnpm typecheck` · `pnpm build` · `pnpm test:int` all green. CI (lint+typecheck) verifies on push. ⏳ build/e2e on CI deferred to Phase 12 (needs Postgres service + migrations).

---

## Phase 3 — Tailwind v4 + Design tokens + Light/Dark

- [ ] Configure **Tailwind v4** (`@import "tailwindcss"`); shadcn/ui base via the v4 CLI — note: template already on v4, so mostly verify
- [ ] Define **design tokens via `@theme`** (light/dark pairs: `--background`, `--foreground`, radius, font…) — Appendix E; locate the template's token file
- [ ] Dark mode v4: `@custom-variant dark (&:is(.dark *))` + theme provider (toggle + respect `prefers-color-scheme`)
- [ ] Document: **"rebrand = change tokens"**

**DoD:** light/dark toggle works; changing one token shifts the whole site's tone; the CMS admin (separate SCSS) is unaffected.

---

## Phase 4 — Normalise Collections / Globals / Plugins *(template already has these — mostly review & adjust)*

- [ ] Review template collections: `Users`, `Media`, `Pages` (layout builder), `Posts`, `Categories` — adjust fields as needed
- [ ] `Media` — **require alt text**, automatic resizing
- [ ] Add **`Portfolio / Projects`** (not in template)
- [ ] Globals `SiteSettings` (logo, social) + `Navigation` (header/footer) — use **`plugin-nested-docs`** for menus
- [ ] **Use official plugins instead of hand-rolling**: `plugin-form-builder` (Forms + Submissions), `plugin-seo`, `plugin-redirects`, `plugin-search`
- [ ] **Drafts + Versions + Autosave** enabled for `Pages`/`Posts` (ties into ISR in Phase 7) — *hard to retrofit, do early*
- [ ] **Live Preview** pointed at the frontend
- [ ] **Explicit access control**: public reads only `published`; drafts require an authenticated user

**DoD:** create a Page from blocks in admin; saved to DB; generated types match; access control blocks drafts for anonymous users; migration updated.

---

## Phase 5 — Block system & registry + Lexical rendering

- [ ] **Block registry**: a single file mapping `blockSlug → React component` (DRY; AI adds blocks without missing a spot)
- [ ] Sample blocks in `src/blocks/`: **Hero, Features, Gallery, CTA** (CMS field + component pair)
- [ ] **Serializer to render Lexical rich text → React** (for Posts/long content) — *often forgotten*
- [ ] Read data in RSC via the **engine Local API** (no HTTP)

**DoD:** a Page composed of ≥2 blocks renders correctly; rich text renders correctly; adding a new block only touches the registry + 2 files.

---

## Phase 6 — Vertical slice: end-to-end Home page *(prove the whole pipeline)*

> Goal: **don't build all 5 pages yet**. Build one page end-to-end to lock the pipeline; the other 4 are just content (Phase 10).

- [ ] `(marketing)/layout.tsx` — Header/Footer read from `Navigation`
- [ ] **Home** page pulls real content from the CMS (block-based)
- [ ] Contact form: **`plugin-form-builder` defines the form** → frontend renders with **React Hook Form + Zod** → submit saves to Submissions (see Appendix D for roles)
- [ ] **Minimal seed**: admin user + sample Home page + Navigation + SiteSettings (`pnpm seed` script)
- [ ] `next/image` **remotePatterns for Vercel Blob** (images won't load otherwise)

**DoD:** Home shows CMS content; edit + publish in admin → page updates (prep for Phase 7); form submit saves to DB; `pnpm seed` rebuilds from an empty DB.

---

## Phase 7 — Render strategy & on-demand revalidation

- [ ] Marketing/CMS pages: **static (SSG) + ISR**
- [ ] **Engine `afterChange` hook** calls `revalidatePath` / `revalidateTag` on publish
- [ ] CMS admin: always dynamic, never cached
- [ ] Dynamic parts (search/personalised): SSR/RSC per request

**DoD:** publish in admin → Home updates **without rebuilding the whole site**; drafts never leak to the public.

---

## Phase 8 — Marclie CMS branding

- [ ] `src/cms/branding.ts`: `admin.meta` (title "Marclie CMS", favicon)
- [ ] Replace `admin.components.graphics.Logo` / `Icon` + custom admin CSS
- [ ] Convention: **engine core stays untouched**; customisation only in `src/collections/`, `src/cms/`
- [ ] (Later) Package customisations into a reusable **internal plugin**

**DoD:** admin shows the "Marclie CMS" brand + logo; engine core unmodified (easy to upgrade).

---

## Phase 9 — Animation (GSAP & three.js)

- [ ] GSAP + ScrollTrigger in `components/animations/` (isolated wrappers)
- [ ] three.js / R3F — **always lazy-load** (`next/dynamic`, `ssr:false`)
- [ ] Sample presets: fade-in-on-scroll, parallax, 3D hero placeholder
- [ ] Respect `prefers-reduced-motion`
- [ ] (Optional) **React Bits free** via shadcn CLI — distinct role from GSAP, avoid duplicate effects (Appendix D); **Pro deferred**

**DoD:** toggling a preset doesn't break layout; reduced-motion lowers animation; measure Lighthouse before shipping.

---

## Phase 10 — Content & remaining pages *(late — content only)*

- [ ] Author content for 4 pages: `about`, `services`, `portfolio`, `contact` (compose from existing blocks, no new code)
- [ ] Extend the seed if portfolio/blog need sample data

**DoD:** all 5 pages render; portfolio reads from its collection; no new blocks/logic beyond the registry.

---

## Phase 11 — AI-friendly files & docs

- [x] `CLAUDE.md` — conventions, core-vs-extension, branding, how to use shadcn/skills (started Phase 1, kept current)
- [x] `MAP.md` — repo map for AI
- [x] `CHANGELOG.md` — Keep a Changelog
- [ ] `AGENTS.md` — general AI-agent conventions
- [ ] `.claude/skills/` — project-specific skills (add a block, create a collection)
- [x] `docs/adr/` — architecture decisions (started Phase 0)
- [ ] `README.md` (getting started — currently the template's) + `SETUP.md` (new-project checklist)
- [x] `.env.example` (Postgres/Neon) — Docker removed (Neon + Vercel only)

**DoD:** a new person/AI can start the project by reading `CLAUDE.md` + `MAP.md` + `README.md`.

---

## Phase 12 — CI/CD & Vercel hosting

- [ ] Connect the repo to Vercel
- [ ] **Neon Postgres via the Vercel Marketplace** (auto-injected env, branch-per-preview)
- [ ] **Vercel Blob** for media
- [ ] Set production env; **run engine migrations on deploy** (no auto-push in prod)
- [ ] Extend CI: build + e2e/int with a Postgres service container + migrations
- [ ] PR → **Vercel Preview Deploy** + dedicated **Neon DB branch**
- [ ] Attach a domain

**DoD:** push `main` → auto-deploy prod; PR → preview deploy + dedicated DB branch; migrations run correctly.

---

## Phase 13 — Quality before shipping

- [ ] `design:accessibility-review` — WCAG 2.1 AA, **check both light & dark**
- [ ] Colour contrast ≥ 4.5:1 (body text) in both themes; keyboard nav + visible focus
- [ ] Lighthouse/perf (budget for three.js)
- [ ] SEO: verify metadata/sitemap/OG (`plugin-seo` present, just verify)
- [ ] End-to-end form test (run the Playwright e2e suite)
- [ ] (Optional) Vercel Analytics + **Sentry** (error monitoring ≠ analytics, no overlap — Appendix D)

**DoD:** a11y/SEO/perf meet thresholds; the form works in prod.

---

## Phase 14 — Turn the repo into a GitHub Template

- [ ] Push the complete starter → GitHub → tick **Template repository**
- [ ] Test "Use this template" → independent repo, no original history
- [ ] Document the update process (cherry-pick into older projects)

**DoD:** create a new project from the template and run it end-to-end per the §7 workflow.

---

## Appendix A — Sync model
- **Code** → git · **CMS schema** → engine migrations (in git) · **Data/content** → NOT via git; each environment has its own DB; client content lives in the **production DB**.

## Appendix B — FREE-FIRST cost
- Everything free initially; minimum **Vercel Pro $20/month** (commercial use; one seat covers all sites). shadcn studio & React Bits Pro: one-time purchase **when needed**.

## Appendix C — Risks to track
- [ ] Version compatibility engine ↔ Next/Tailwind v4/shadcn — lock & test on upgrades
- [ ] Whether shadcn blocks / React Bits have caught up to Tailwind v4 — verify per component when copying
- [ ] shadcn studio license if the repo is public → consider private
- [ ] Periodic starter maintenance; three.js performance (lazy-load + Lighthouse budget)

## Appendix D — Tech-stack de-duplication *(decisions)*
| Item | Overlap | Decision |
|---|---|---|
| Forms | Hand-rolled `Forms/Submissions` ↔ `plugin-form-builder` | **Drop hand-roll**, use the plugin. RHF+Zod only handle frontend **render + validation** (no overlap) |
| DB adapter | `db-vercel-postgres` ↔ sqlite/postgres | Standardise on **`@payloadcms/db-postgres`** (Neon) for local + prod |
| Animation | React Bits ↔ GSAP for simple effects | Split roles: **GSAP = scroll/timeline**, **React Bits = drop-in wow**; both Pro deferred |
| UI blocks | shadcn studio ↔ shadcn/ui | studio **deferred** (not installed) → no overlap yet |
| Local DB | Docker ↔ Neon dev branch | **Docker removed** — Neon + Vercel only |
| Test | Vitest ↔ Playwright | No overlap; CMS site has little logic → **Playwright primary**, Vitest minimal |
| Observability | Sentry ↔ Vercel Analytics | No overlap (error monitoring ≠ web analytics) — both optional |

## Appendix E — Tailwind v4 notes *(important for shadcn compatibility)*
- Use **Tailwind v4**: `@import "tailwindcss"` instead of `@tailwind base/components/utilities`.
- **Design tokens defined via `@theme`** (CSS-first), no legacy `tailwind.config.js` — this is the rebrand point.
- Dark mode: declare `@custom-variant dark (&:is(.dark *))` + a theme provider sets the `.dark` class.
- **shadcn/ui**: use the CLI supporting **Tailwind v4 + React 19**; `components.json` points at the token CSS. When copying shadcn/React Bits blocks, **verify each one supports v4** (some lag) → note in `CLAUDE.md`.
- The CMS admin uses internal SCSS, **independent of Tailwind v4** → no conflict.

## Appendix F — Claude skills per phase
Attach available skills to the right phase for speed & accuracy:

| Phase | Skill | Used for |
|---|---|---|
| 0 | `deep-research` | Check version compatibility (Next/React/engine/Tailwind v4) before locking |
| 1, 11 | `init` | Generate a standard `CLAUDE.md` from the codebase |
| 1, 11 | `claude-automation-recommender` | Suggest hooks/subagents/skills/plugins for `.claude/skills/` (also a marketplace discovery path) |
| 3, 5, 6, 10 | `ui-ux-pro-max` + `frontend-design` | Build blocks/theme/marketing pages — direct React/Next/Tailwind/shadcn support |
| every coding phase | `code-review` | Diff-review guardrail (complements CI from Phase 2) |
| each phase DoD | `verify` | Run the real app, confirm changes work |
| 4, 13 | `security-review` | Audit access control (public reads published only) + pre-ship |
| 13 | `design:accessibility-review` | WCAG 2.1 AA, check light/dark |

**Not used in this project:** `greenshift-blocks` (WordPress/Gutenberg), `railway:use-railway` (we use Vercel), document skills (pdf/docx/xlsx/pptx), image/video generation.

**Related tooling (not skills):** Figma MCP + shadcn studio Figma Kit for design-to-code.

**Discover more from the marketplace:** use `/plugin` or run `claude-automation-recommender`. (`ui-ux-pro-max`, `frontend-design` come from plugins/marketplace.)

### F.1 — External skills to install *(critical for this stack)*
Installed in **Phase 0/1** so every later UI/animation phase is accurate:

| Skill | Install | Phase | Why it matters |
|---|---|---|---|
| **shadcn/ui skill** | `pnpm dlx skills add shadcn/ui` | 3, 5, 6, 10 | The whole project uses shadcn — the skill reads `components.json`, runs `shadcn info --json`, and feeds the correct API/components/CLI to the AI. **Most foundational.** |
| **Tailwind v4 + shadcn** (jezweb, `tailwind-theme-builder`) | copied into `.claude/skills/` | 3 | Standardises the four-step CSS-var + `@theme inline` + auto dark-mode pattern (matches Appendix E). ⚠️ The skill is **Vite-based** → this Next.js project uses `@tailwindcss/postcss`; **reuse the CSS pattern/template, skip the Vite parts** (`vite.config.ts`, `@tailwindcss/vite`). |
| **GSAP skills** (official GreenSock) | `npx skills add https://github.com/greensock/gsap-skills` or `/plugin marketplace add greensock/gsap-skills` | 9 | 8 skills; prefer `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, **`gsap-react`** (`useGSAP` hook, SSR handling — important for Next.js), `gsap-performance`. |

> The install commands for these 3 skills are recorded in `CLAUDE.md` (Phase 1) so every later session/agent has the context.
