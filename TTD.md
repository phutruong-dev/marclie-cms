# TTD — Task Tracking Document

> **Goal:** Scaffold the **Marclie CMS** starter (Next.js + CMS engine + Tailwind v4 + shadcn) until it runs locally, deploys on Vercel, and becomes a GitHub Template.
> **Execution philosophy:** Build the **engine first, content later**. Start from the base **`website` template** (which already ships maintained plugins/drafts/live-preview), then *own & rebrand* it instead of hand-building from scratch. Turn guardrails (lint/typecheck/CI/env) on **early** so all code — including AI-generated — is checked from the first commit.
> **How to use:** Work phase by phase. Tick `[x]` when done. Each phase has a **Definition of Done (DoD)** — do not advance until the DoD is met.
> **Source of truth:** this file (`TTD.md`) + `docs/adr/` + `CLAUDE.md`. (The original `BLUEPRINT.md` strategy doc has been removed; its decisions are captured here and in the ADRs.)

**Overall status:** Phase 0–12 done — **production live at https://marclie-cms.vercel.app** (Blob store / PR-preview DB branch / domain deferred). Phase 13 (quality) / 14 (GitHub Template) next.

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

## Phase 3 — Tailwind v4 + Design tokens + Light/Dark ✅ DONE

- [x] **Tailwind v4** — verified: template uses `@import "tailwindcss"` + `@config` in `src/app/(frontend)/globals.css`; `components.json` wired for shadcn
- [x] **Design tokens via `@theme`** — verified the full four-step pattern in `globals.css`: `:root` (light) + `[data-theme='dark']` (dark) oklch tokens → `@theme inline` mapping. Single token file: `globals.css` (template keeps tokens here, not `styles/theme.css`)
- [x] **Dark mode** — driven by `[data-theme='dark']` attribute (NOT `.dark`); `InitTheme` no-flash script + `ThemeSelector` toggle, respects `prefers-color-scheme`
- [x] **Documented** in `docs/theming.md` + `CLAUDE.md` ("rebrand = edit tokens"); fixed the `.dark` → `data-theme` note
- [x] Brand tokens kept **neutral** (per-project decision for a reusable starter); rebrand path documented

**DoD:** ✅ Verified in browser: switching `data-theme` light↔dark inverts the whole body bg/text (`--background` white↔near-black); tokens drive the site tone; admin (separate SCSS) unaffected. Visual screenshot of seeded content deferred to Phase 6; contrast audit to Phase 13.

> 🏷️ Phase 8 note: page `<title>` still reads "Payload Website Template" → rebrand via SiteSettings/metadata.

---

## Phase 4 — Normalise Collections / Globals / Plugins *(template already has these — mostly review & adjust)* ✅ DONE

- [x] Reviewed template collections: `Users`, `Media`, `Pages` (layout builder + tabs), `Posts`, `Categories` — all well-structured
- [x] `Media` — **alt now `required: true`** (was commented out); image resizing already configured (thumbnail…og)
- [x] Added **`Projects`** collection (portfolio): `src/collections/Projects/index.ts` — featuredImage, summary, content, gallery, client/year/projectUrl/categories (sidebar), SEO tab, drafts/versions/autosave; registered in `payload.config.ts`
- [x] **Plugins verified present**: `plugin-form-builder`, `plugin-seo`, `plugin-redirects`, `plugin-nested-docs` (categories), `plugin-search` (posts) — fixed SEO title branding `"Payload Website Template"` → `"Marclie CMS"`
- [x] **Drafts + Versions + Autosave** already on for `Pages`/`Posts`; added the same to `Projects`
- [x] **Live Preview** already configured (admin breakpoints + per-collection preview URL)
- [x] **Access control verified**: `authenticatedOrPublished` (public reads `_status: published` only; auth users see drafts), `anyone` for Media read — correct
- [~] Globals: template ships `Header` + `Footer` (the nav globals). `SiteSettings` (logo/social) **deferred to Phase 8** (branding) to avoid dead config — Header/Footer cover navigation now

**DoD:** ✅ `pnpm generate:types` includes `projects`; typecheck + lint (0 err) pass; schema pushed to Neon; `/api/projects` → 200 `{docs:[],totalDocs:0}` (collection live, access control returns published-only); `/admin` 200.

---

## Phase 5 — Block system & registry + Lexical rendering ✅ DONE

- [x] **Block registry** verified: `src/blocks/RenderBlocks.tsx` maps `blockType → component`. Extended with `features`, `gallery`
- [x] Sample blocks: **CTA** (`CallToAction`) + **Hero** (`src/heros/`) already in template; **added `Features`** (grid of items) and **`Gallery`** (image grid) — config + Component pair each, registered in `RenderBlocks` and exposed in the `Pages` layout
- [x] **Lexical → React serializer** verified: `src/components/RichText` (`jsxConverters` for default nodes + inline blocks banner/media/code/cta + internal links)
- [x] RSC data via the **engine Local API** — template pages already use it (`getPayload` + `payload.find`)

**DoD:** ✅ `generate:types` includes `FeaturesBlock`/`GalleryBlock`; typecheck + lint (0 err) pass; `/admin` 200 (schema pushed); adding a block = config.ts + Component.tsx + 1 registry line (+ expose in collection). Full visual render of a multi-block page is exercised in Phase 6 (Home vertical slice).

---

## Phase 6 — Vertical slice: end-to-end Home page *(prove the whole pipeline)* ✅ DONE

> Goal: **don't build all 5 pages yet**. Build one page end-to-end to lock the pipeline; the other 4 are just content (Phase 10).

- [x] Frontend layout (`(frontend)/layout.tsx`) reads Header/Footer globals — template provides it
- [x] **Home** page pulls real content from the CMS (block-based) — seeded `home` page renders (`/` 200)
- [x] Contact form: `plugin-form-builder` form + frontend `FormBlock` (RHF) → submit saves to Submissions (verified: POST `/api/form-submissions` → id 1)
- [x] **`pnpm seed` script** (`src/seed.ts`, tsx): resets + loads demo content (Home, Contact, posts, nav, media). Verified: empty DB → 2 pages / 3 posts / 1 form / 4 media
- [~] `next/image` **remotePatterns for Vercel Blob** — deferred to Phase 12 (Blob not configured yet; local media works via `/api/media`)

**Fix applied:** template revalidate hooks crashed during CLI seed (`revalidatePath` needs Next context, and some seed ops omit `disableRevalidate`). Added an env guard `DISABLE_REVALIDATE` to all revalidate hooks; `pnpm seed` sets it.

**DoD:** ✅ Home shows CMS content (`/` 200, `home` page seeded); `/contact` 200; form submit saved (submission id 1); `pnpm seed` rebuilds from empty DB. Publish→revalidate flow exercised in Phase 7.

> 🏷️ Phase 8: seeded demo content (`src/endpoints/seed/*`) still uses "Payload" branding/title → rebrand with the broader branding pass.

---

## Phase 7 — Render strategy & on-demand revalidation ✅ DONE *(verify + document)*

- [x] Marketing/CMS pages **SSG**: `/`, `/[slug]`, `/posts/[slug]` via `generateStaticParams`; `/posts` + `/posts/page/[n]` use `force-static` + `revalidate = 600` (ISR 10m)
- [x] **Engine `afterChange` hooks** call `revalidatePath`/`revalidateTag` on publish — wired on Pages, Posts, Header, Footer
- [x] CMS admin + `/api` always **dynamic** (ƒ in build output)
- [x] `/search` dynamic per request
- [x] Drafts gated: `authenticatedOrPublished` access + `draftMode()` + `/next/preview` (PREVIEW_SECRET)
- [x] Documented in `docs/rendering.md`

**DoD:** ✅ Verified by route directives + Phase 2 build classification (○ Static / ● SSG / ƒ Dynamic) + hook wiring + access control. Live ISR cache behaviour validates in production (Phase 12) — `next dev` re-renders every request, so on-demand revalidation is a no-op locally by design.

---

## Phase 8 — Marclie CMS branding ✅ DONE

- [x] `src/cms/branding.ts`: admin `meta` (title "Marclie CMS", titleSuffix, favicon `/favicon.svg`, OG) — wired into `payload.config`
- [x] `admin.components.graphics.Logo` / `Icon` → `src/cms/graphics/*` (Marclie wordmark + monogram); `src/cms/admin.scss` style hook (loaded via import in `Icon.tsx`; Payload 3 has no top-level `admin.css`)
- [x] Rebranded: site header logo (`components/Logo`), `BeforeLogin` text, frontend metadata (`mergeOpenGraph.ts`, `generateMeta.ts`, search/posts page titles), and demo seed titles/descriptions — removed all user-facing "Payload" strings (kept legit payloadcms.com engine doc links in BeforeDashboard)
- [x] Convention: engine core untouched; customisation only in `src/collections/`, `src/cms/`
- [ ] (Later) Package customisations into a reusable **internal plugin**

**DoD:** ✅ Verified in browser — admin login shows the "Marclie CMS" wordmark logo + tab title "Marclie CMS — Marclie CMS" + branded welcome; site `<title>`/OG = "Marclie CMS"; engine core unmodified.

> ⚠️ Known flaky: the seed's parallel `delete` clears can occasionally deadlock on Neon (`deadlock detected`) — just re-run `pnpm seed`.

---

## Phase 9 — Animation (GSAP & three.js) ✅ DONE

- [x] GSAP + ScrollTrigger in `src/components/animations/` (isolated wrappers) — central `gsap.ts` registers `useGSAP`+`ScrollTrigger` once; `useGSAP` scope/cleanup per wrapper
- [x] three.js / R3F — **always lazy-load** (`Hero3D/index.tsx` → `next/dynamic` `ssr:false`; WebGL `Scene.tsx` never imported server-side)
- [x] Sample presets: **fade-in-on-scroll** (`AnimateIn`, variants + stagger), **parallax** (`Parallax`, scrubbed), **3D hero placeholder** (`Hero3D`, distorted icosahedron). `AnimateIn` wired into the Features block as a live example
- [x] Respect `prefers-reduced-motion` — `useReducedMotion` (`useSyncExternalStore`); every wrapper renders the final visible state with motion off
- [x] Documented in `docs/animation.md`; deps `gsap`, `@gsap/react`, `three`, `@react-three/fiber`, `@react-three/drei`
- [ ] (Optional) **React Bits free** via shadcn CLI — distinct role from GSAP, avoid duplicate effects (Appendix D); **Pro deferred**

> ⚠️ R3F augments the global `JSX.IntrinsicElements` → polymorphic `as`/`htmlElement` components type-check `children` as `never`. Fix: `AnimateIn` + `components/Media` use `React.createElement` instead of a `<Tag>` JSX element. Reuse this for future polymorphic components.

**DoD:** ✅ `pnpm typecheck` + `pnpm lint` (0 err) + `pnpm build` all green (3D code-split, no SSR error); dev boots clean with the new deps, `/` 200, no console errors. Live preset visuals (stagger/parallax/3D in a page) land with content in **Phase 10**; Lighthouse budget measured in **Phase 13** ("before shipping").

---

## Phase 10 — Content & remaining pages *(late — content only)* ✅ DONE

- [x] Authored 4 pages: `about`, `services`, `portfolio` (new) + `contact` (Phase 6). `about`/`services` compose existing blocks (hero + content + features + cta); seed builders in `src/endpoints/seed/{about,services,portfolio}.ts` with a small lexical helper (`seed/lexical.ts`)
- [x] **Portfolio reads from the Projects collection**: `portfolio` page uses the **Archive block** `populateBy: collection`, `relationTo: 'projects'`. To enable this, generalised `Card`/`CollectionArchive`/`ArchiveBlock` (config + Component) to accept `projects`, and added the frontend detail route `src/app/(frontend)/projects/[slug]/` (mirrors `posts/[slug]`: `generateStaticParams` + `generateMetadata` + drafts). `generateMeta` accepts `Project`
- [x] Extended the seed: 3 sample `Projects` (`seed/projects-data.ts` — featuredImage, summary, content, meta, categories, published); categories creation now awaited + captured (fixed a latent template bug); nav updated (header: About/Services/Portfolio/Posts/Contact; footer rebranded — dropped user-facing "Payload"/template links)

**DoD:** ✅ `/`, `/about`, `/services`, `/portfolio`, `/contact` all 200 + render (browser-verified); portfolio archive lists 3 projects from the collection with categories/images, project cards link to `/projects/[slug]` detail (SSG, browser-verified); `pnpm typecheck`+`lint` (0 err)+`build` green (3 project pages SSG'd); `pnpm seed` rebuilds incl. projects. No new blocks — reused the Archive block + the Phase 5 registry; the only new code is standard project-route plumbing (mirrors posts) approved to satisfy "portfolio reads from its collection".

---

## Phase 11 — AI-friendly files & docs

- [x] `CLAUDE.md` — conventions, core-vs-extension, branding, how to use shadcn/skills (started Phase 1, kept current)
- [x] `MAP.md` — repo map for AI
- [x] `CHANGELOG.md` — Keep a Changelog
- [x] `AGENTS.md` — general AI-agent conventions (tool-agnostic subset of `CLAUDE.md`)
- [x] `.claude/skills/` — project-specific skills: `add-block`, `create-collection` (alongside `tailwind-theme-builder`)
- [x] `docs/adr/` — architecture decisions (started Phase 0)
- [x] `README.md` (rewritten for Marclie CMS getting-started; replaced the template's) + `SETUP.md` (new-project checklist)
- [x] `.env.example` (Postgres/Neon) — Docker removed (Neon + Vercel only)

**DoD:** ✅ a new person/AI can start the project by reading `CLAUDE.md` + `MAP.md` + `README.md`. `AGENTS.md` covers non-Claude agents; `add-block`/`create-collection` skills capture the two most common extension recipes; `SETUP.md` is the new-project checklist.

---

## Phase 12 — CI/CD & Vercel hosting

**Repo-side prep ✅ DONE (2026-07-01)** — see ADR `0003` + `docs/deployment.md`:
- [x] **Vercel Blob** for media — `@payloadcms/storage-vercel-blob` (3.85.1) on `media`, token-gated (`enabled: Boolean(BLOB_READ_WRITE_TOKEN)`); local dev unchanged (disk). `next/image` remotePattern `*.public.blob.vercel-storage.com`; `BLOB_READ_WRITE_TOKEN` in `env.ts` + `.env.example`
- [x] **Migrations on deploy, no auto-push in prod** — adapter push off in prod by default; explicit `migrationDir: src/migrations/`; scripts `migrate`/`migrate:create`/`migrate:status`; **Vercel build command `pnpm run vercel-build`** = `payload migrate && pnpm build`
- [x] **Extend CI** — new `integration` job: `postgres:16` service → `pnpm migrate` → `pnpm test:int` → `pnpm build` (build gated on a committed migration existing → CI green now, self-activates after baseline)
- [x] Verified: `pnpm generate:types` (config loads incl. Blob plugin) + `pnpm typecheck` + `pnpm lint` (0 err)

**Dashboard/DB-side — LIVE ✅ (2026-07-01):** production at `https://marclie-cms.vercel.app`
- [x] Connected the repo to Vercel (project `prj_G5xLB6…`, GitHub `phutruong-dev/marclie-cms`); build command = `pnpm run vercel-build` (set via API)
- [x] **Baseline migration generated via GitHub Actions** (`generate-baseline-migration.yml`) — `migrate:create` breaks on Node 24 (tsx+drizzle-kit `node:crypto?tsx-namespace`), so the workflow runs on **Node 22**. Committed `src/migrations/20260701_033504_initial.ts`; verified by applying to a throwaway empty Neon branch.
- [x] **Neon prod = dedicated empty project** `marclie-cms-prod` (`ancient-forest-83446570`), direct connection string (not the Marketplace). Dev stays on `red-thunder`.
- [x] Set production env (DATABASE_URL prod, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL, PREVIEW_SECRET, CRON_SECRET) via API
- [x] Deployed: build ran `payload migrate` (applied `20260701_033504_initial`) → `next build`; `/`, `/admin`, `/api/projects` → 200
- [x] Seeded prod demo content (`pnpm seed` → prod) + redeployed to SSG the populated DB; `/api/projects` totalDocs 3
- [ ] **Vercel Blob** store (injects `BLOB_READ_WRITE_TOKEN`) — deferred (media uploads in prod won't persist until added)
- [ ] **Branch-per-preview** via Neon–Vercel integration — deferred (chose a separate prod project over Marketplace for now)
- [ ] Attach a custom domain — deferred

**Learnings (important):**
- `pnpm ci` does **not** run a `ci` script (pnpm reserves `ci` → `ERR_PNPM_CI_NOT_IMPLEMENTED`); the deploy script is named **`vercel-build`** and the build command is `pnpm run vercel-build`.
- `payload migrate:create` (generate) hits a Node 24 tsx+drizzle-kit bug on any OS → generate on **Node 22** (GitHub Actions). `payload migrate` (apply) is unaffected → deploy on Node 24 is fine.

**DoD:** ✅ core met — push `main` → auto-deploy prod; migrations run correctly on deploy; prod live with content. ⏳ PR-preview-with-dedicated-DB-branch, Blob, and domain deferred (optional Stage 5).

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
