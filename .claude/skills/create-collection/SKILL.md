---
name: create-collection
description: "Create a new CMS collection in Marclie CMS. Use whenever the user wants to add a new content type / collection (e.g. Team members, Events, Testimonials, Products) with access control, drafts/versions, SEO, and — if it needs public pages — a frontend route. Follows the Projects collection as the reference pattern."
compatibility: claude-code-only
---

# Create a collection

A collection is a content type stored in Postgres and editable in `/admin`. `src/collections/Projects/index.ts` is the reference for a **public, page-backed** collection (drafts + versions + SEO + a `/projects/[slug]` route). Mirror it.

## Steps

1. **Config** — `src/collections/<Name>/index.ts` exporting a `CollectionConfig`.
2. **Register** — add to the `collections: [...]` array in `src/payload.config.ts` (line ~74).
3. **Generate types** — `pnpm generate:types` (adds the `<Name>` interface to `src/payload-types.ts`).
4. **Public route (only if it needs its own pages)** — mirror `src/app/(frontend)/projects/[slug]/` (`generateStaticParams` + `generateMetadata` + drafts). Skip this for admin-only / relationship-only data.
5. **Seed (optional)** — add a builder under `src/endpoints/seed/` and call it from `src/endpoints/seed/index.ts`.

## Config skeleton

```ts
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished, // public sees published only; auth users see drafts
    update: authenticated,
  },
  defaultPopulate: { title: true, slug: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    // ...content fields
  ],
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 50,
  },
}
```

## Access control — non-negotiable

- Public-readable content **must** use `read: authenticatedOrPublished` (public reads `_status: published` only; authenticated users see drafts). This is the security guarantee audited in TTD Phase 4/13.
- Use `read: anyone` **only** for assets meant to be fully public (like `Media`).
- `create/update/delete: authenticated`. Never widen these without a documented reason.

## Rules

- **Register in `payload.config.ts`** or the collection silently won't exist.
- Add `slugField` (from `payload`) + a SEO tab (see `Projects` for the `plugin-seo` field imports) if it has public detail pages.
- **Always `pnpm generate:types`** after config changes, then `pnpm typecheck`.
- If a public frontend route is added, it must gate drafts with `draftMode()` exactly like `projects/[slug]` / `posts/[slug]` — do not expose unpublished content.
- Schema reaches Neon via the engine (dev auto-push). For prod, a migration is generated (TTD Phase 12) — do not rely on auto-push in production.

## Verify

```bash
pnpm generate:types && pnpm typecheck && pnpm lint
# then boot and confirm the collection is live + access control:
pnpm dev   # /admin shows the collection; GET /api/<slug> → 200 with published-only docs
```

Reference: `Projects` was created exactly this way (TTD Phase 4 + Phase 10 for its frontend route).
