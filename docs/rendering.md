# Rendering & revalidation — Marclie CMS

Per-route render strategy. Convention: **static-first → on-demand revalidation → SSR only when required.**

## Per-route map
| Route | Strategy | Notes |
|---|---|---|
| `/` , `/[slug]` | **SSG** (`generateStaticParams`) | Marketing/CMS pages prerendered; updated on publish via on-demand revalidation |
| `/posts/[slug]` | **SSG** (`generateStaticParams`) | Same; on-demand revalidation |
| `/posts`, `/posts/page/[n]` | **Static + ISR** | `export const dynamic = 'force-static'` + `export const revalidate = 600` (10 min) |
| `/search` | **Dynamic (SSR)** | Per-request, user input |
| `/admin/**` | **Dynamic** | CMS admin, never cached |
| `/api/**`, GraphQL | **Dynamic** | Engine REST/GraphQL |
| sitemaps, preview routes | Dynamic route handlers | |

## On-demand revalidation (publish → update, no full rebuild)
Engine `afterChange` hooks call `revalidatePath` / `revalidateTag` when content is published:
- `src/collections/Pages/hooks/revalidatePage.ts` — revalidates `/` (home) or `/<slug>` + `pages-sitemap` tag.
- `src/collections/Posts/hooks/revalidatePost.ts` — revalidates `/posts/<slug>` + `posts-sitemap` tag.
- `src/Header/hooks/revalidateHeader.ts`, `src/Footer/hooks/revalidateFooter.ts` — revalidate global nav tags.

So publishing one page rebuilds only that path, not the whole site.

> **CLI guard:** these hooks no-op when `DISABLE_REVALIDATE=true` (set by `pnpm seed`), because `revalidatePath` requires a Next.js request context. In normal dev/prod runs the flag is unset and revalidation works.

## Drafts & live preview (no draft leaks)
- Collections use the `authenticatedOrPublished` access control: anonymous requests see only `_status: published`. Draft-only docs are never returned publicly.
- Frontend routes read `draftMode()`; preview is entered via `/next/preview` (and exited via `/next/exit-preview`), gated by `PREVIEW_SECRET`.
- `LivePreviewListener` + the admin live-preview config drive in-admin preview.

## Data access
Server Components read content through the **engine Local API** (`getPayload()` + `payload.find()`), not over HTTP.

## Verification
Route classifications confirmed by `next build` (○ Static / ● SSG / ƒ Dynamic) and by the route directives above. Live ISR cache behaviour is best observed in production (Phase 12 deploy) — `next dev` re-renders every request, so on-demand revalidation is a no-op locally by design.
