# MAP.md — Marclie CMS repo map

> Single source of truth for "where things live". Read this before searching the tree.
> Keep it in sync whenever the layout changes (it is part of every task's definition of done).

## Top-level

| Path | What it is |
|---|---|
| `CLAUDE.md` | Project conventions & memory for AI. Read first. |
| `MAP.md` | This file — repo map. |
| `TTD.md` | Task tracking document (execution plan, phase by phase). |
| `CHANGELOG.md` | Notable changes (Keep a Changelog). |
| `BLUEPRINT.md` | Original strategy/vision document. |
| `docs/adr/` | Architecture Decision Records (numbered). |
| `README.md` | Engine/template readme (from the base template). |
| `.env.example` | Environment variable template. |
| `.github/workflows/ci.yml` | CI: lint + typecheck on push/PR. |
| `.agents/skills/`, `.claude/skills/` | Installed AI skills (see CLAUDE.md → Installed skills). |
| `package.json` | Scripts + pinned deps. |
| `next.config.ts` | Next.js config; imports `src/env.ts` for env validation. |
| `tsconfig.json` | TypeScript (strict). |
| `eslint.config.mjs` | ESLint flat config (see ADR 0002). |
| `vitest.config.mts`, `playwright.config.ts` | Test configs. |
| `redirects.ts`, `next-sitemap.config.cjs` | Redirects & sitemap. |
| `components.json` | shadcn/ui config. |
| `tailwind.config.mjs`, `postcss.config.js` | Tailwind v4 setup. |

## `src/` — application

| Path | Responsibility |
|---|---|
| `app/(frontend)/` | Public marketing site: `page.tsx` (home), `[slug]`, `posts/`, `search/`, sitemaps, preview routes, `globals.css`. |
| `app/(payload)/` | **CMS admin + API — core, do not edit.** `admin/[[...segments]]`, `api/`, GraphQL. |
| `payload.config.ts` | ⭐ Central CMS config: db adapter, collections, globals, plugins, editor. |
| `env.ts` | Env schema (zod + @t3-oss/env-nextjs). |
| `collections/` | CMS collections: `Pages`, `Posts`, `Categories`, `Media`, `Users`. |
| `blocks/` | Layout-builder blocks + their React components. `RenderBlocks.tsx` = block registry. |
| `heros/` | Hero variants (`HighImpact`, `MediumImpact`, `LowImpact`, `PostHero`) + `RenderHero.tsx`. |
| `Header/`, `Footer/` | Global nav config + components. |
| `plugins/index.ts` | CMS plugin wiring (seo, redirects, nested-docs, search, form-builder). |
| `components/` | Shared UI. `ui/` = shadcn primitives; `RichText/` = Lexical renderer; `Media/`, `Link/`, `Card/`, etc. |
| `providers/` | React providers. `Theme/` = light/dark (theme tokens + selector). |
| `fields/` | Reusable field configs (`link`, `linkGroup`, `defaultLexical`). |
| `hooks/` | Collection/field hooks (revalidation, populate). |
| `endpoints/seed/` | Seed data (sample pages, posts, media). |
| `access/` | Access-control helpers (`anyone`, `authenticated`, `authenticatedOrPublished`). |
| `utilities/` | Helpers (URLs, meta, formatting, `cn`, etc.). |
| `search/` | Search plugin sync/field overrides + component. |

## `src/cms/` — (planned, Phase 8)
Marclie CMS branding (`branding.ts`) and internal plugins. Does not exist yet.

## `tests/`
| Path | What |
|---|---|
| `tests/int/` | Vitest integration tests (boot the CMS, query via Local API). |
| `tests/e2e/` | Playwright e2e (`admin`, `frontend`). |
| `tests/helpers/` | Login / seed helpers. |

## Conventions recap
- **Core vs extension:** edit `collections/`, `blocks/`, content, tokens; leave `app/(payload)/` + engine internals alone.
- **Rebrand = change theme tokens** (Tailwind v4 `@theme`), not components.
- See `CLAUDE.md` for stack, commands, and skills.
