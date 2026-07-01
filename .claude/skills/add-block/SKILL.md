---
name: add-block
description: "Add a new layout-builder block to Marclie CMS. Use whenever the user wants to create a new content block, section, or layout element for the Pages/Posts layout builder (e.g. a testimonials block, a pricing block, a stats block). Walks through the config + Component pair, the RenderBlocks registry, exposing it in a collection layout field, and regenerating types."
compatibility: claude-code-only
---

# Add a block

Marclie CMS renders pages from a **layout builder**: editors stack blocks, and `RenderBlocks.tsx` maps each `blockType` to a React component. Adding a block is always the same four (+1) steps. Do **not** invent a new rendering path.

## The 5 steps

1. **Config** — `src/blocks/<Name>/config.ts` exports a `Block` (`slug`, `interfaceName`, `labels`, `fields`).
2. **Component** — `src/blocks/<Name>/Component.tsx` exports `<Name>Block` typed from the generated `<Name>Block` interface.
3. **Register** — add the import + one line to `blockComponents` in `src/blocks/RenderBlocks.tsx` (key = the block `slug`).
4. **Expose** — add the config to the `blocks: [...]` array of the collection's layout field (`src/collections/Pages/index.ts`, line ~77; and `Posts` if relevant).
5. **Generate types** — `pnpm generate:types` so `<Name>Block` exists in `src/payload-types.ts`, then `pnpm typecheck`.

## Templates

`config.ts`:

```ts
import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',            // becomes the blockType + RenderBlocks key
  interfaceName: 'StatsBlock', // the generated TS interface name
  labels: { singular: 'Stats', plural: 'Stats' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}
```

`Component.tsx` (server component by default; add `'use client'` only if it needs hooks):

```tsx
import React from 'react'

import type { StatsBlock as StatsBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

export const StatsBlock: React.FC<StatsBlockProps> = ({ heading, items }) => {
  return (
    <div className="container">
      {heading && <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>}
      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
        {(items || []).map((item, i) => (
          <div key={i}>
            <div className="text-4xl font-bold">{item.value}</div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

`RenderBlocks.tsx`:

```ts
import { StatsBlock } from '@/blocks/Stats/Component'
// ...
const blockComponents = {
  // ...existing
  stats: StatsBlock, // key MUST equal the config slug
}
```

Collection layout field (`src/collections/Pages/index.ts`):

```ts
import { Stats } from '../../blocks/Stats/config'
// ...
blocks: [CallToAction, Content, Features, Gallery, MediaBlock, Archive, FormBlock, Stats],
```

## Rules

- **Style with theme tokens**, not hardcoded colours: `bg-card`, `text-muted-foreground`, `border-border` (see `docs/theming.md`). This keeps light/dark and rebrand working.
- Reuse existing patterns: `container` for width, `AnimateIn` from `@/components/animations` for scroll reveals (see `Features/Component.tsx`), `Media`/`RichText` components for images/rich text.
- **Never edit `src/app/(payload)/`** or engine internals — blocks are pure extension.
- The `RenderBlocks` key, the config `slug`, and the `blockType` must all be identical string.
- After changing any `config.ts` field, always `pnpm generate:types` before `pnpm typecheck` — the component's props type comes from the generated interface.

## Verify

```bash
pnpm generate:types && pnpm typecheck && pnpm lint
```

Then add the block to a page in `/admin` (or a seed builder in `src/endpoints/seed/`) and confirm it renders. Reference existing blocks: `Features` and `Gallery` were added this exact way (see `CHANGELOG.md` / TTD Phase 5).
