# Marclie CMS

A production-ready **marketing site + CMS starter** in a single Next.js app. Use it as the base for a client website: change **content + theme tokens**, leave the core untouched. Designed to be reused as a **GitHub Template**.

> **Technical foundation:** Marclie CMS runs on the [Payload](https://payloadcms.com) engine in-repo. The `payload` package/CLI, `payload.config.ts`, and `@payloadcms/*` are the real engine and are used as-is. The product is branded **Marclie CMS**.

## What you get
- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript strict**
- **CMS admin** at `/admin` with auto-generated REST/GraphQL APIs
- **Layout builder** (stackable blocks) + **Lexical** rich text + **Live Preview** + **Draft Preview**
- Collections: `Pages`, `Posts`, `Projects` (portfolio), `Categories`, `Media`, `Users`
- Plugins: SEO, redirects, nested-docs, search, form-builder
- **Tailwind v4** (CSS-first `@theme`) + **shadcn/ui**, light/dark via `data-theme`
- **GSAP** (scroll/timeline) + **three.js/R3F** (lazy 3D) animation wrappers
- Static-first rendering (SSG + on-demand revalidation), drafts gated by auth
- Guardrails: ESLint + Prettier + Vitest + Playwright + GitHub Actions CI

## Prerequisites
- **Node 24** (see `.nvmrc`) and **pnpm** (`corepack enable`)
- A **Postgres** database — a [Neon](https://neon.tech) dev branch is recommended (free)

## Quick start
```bash
cp .env.example .env      # then fill in the values (see below)
pnpm install
pnpm dev                  # http://localhost:3000  ·  admin at /admin
```
On first run, open `/admin` and follow the prompts to create the first admin user. To load demo content:
```bash
# stop the dev server first
pnpm seed                 # resets the DB + loads demo pages, posts, projects, nav, media
```

### Environment variables (`.env`)
| Var | What |
|---|---|
| `DATABASE_URL` | Postgres/Neon connection string (`?sslmode=require`) |
| `PAYLOAD_SECRET` | Secret for encrypting JWT tokens |
| `NEXT_PUBLIC_SERVER_URL` | Base URL, no trailing slash (`http://localhost:3000` locally) |
| `PREVIEW_SECRET` | Validates draft-preview requests |
| `CRON_SECRET` | Authenticates scheduled jobs |

Env is validated at dev/build time by `src/env.ts` (zod). Bypass with `SKIP_ENV_VALIDATION=1`.

## Common commands
```bash
pnpm dev                 # dev server (localhost:3000, /admin)
pnpm build / pnpm start  # production build / run it
pnpm lint  /  pnpm typecheck
pnpm generate:types      # regenerate src/payload-types.ts after any config change
pnpm seed                # reset + load demo content (stop dev server first)
pnpm test                # Vitest (int) + Playwright (e2e)
```

## How to customise
- **Rebrand colours** → edit the token variables in `src/app/(frontend)/globals.css` (Tailwind v4 `@theme`). See `docs/theming.md`.
- **Brand the admin/logo** → `src/cms/` (`branding.ts`, `graphics/`, `admin.scss`).
- **Add a content block** → the `add-block` project skill (config + Component + registry).
- **Add a content type** → the `create-collection` project skill.

## Documentation
| File | For |
|---|---|
| `CLAUDE.md` | Conventions & project memory (read first) |
| `AGENTS.md` | Tool-agnostic AI-agent conventions |
| `MAP.md` | Repo map — where everything lives |
| `TTD.md` | Phase-by-phase execution plan & status |
| `SETUP.md` | Checklist for starting a **new project** from this template |
| `CHANGELOG.md` | Notable changes |
| `docs/adr/` | Architecture Decision Records |
| `docs/theming.md` · `rendering.md` · `animation.md` | Deep-dive guides |

## Deployment
Target: **Vercel** + **Neon Postgres** (Vercel Marketplace, branch-per-preview) + **Vercel Blob** for media. Run engine migrations on deploy (no auto-push in prod). Full CI/CD wiring is tracked in `TTD.md` Phase 12.

## License
Private starter. The underlying Payload engine is MIT-licensed.
