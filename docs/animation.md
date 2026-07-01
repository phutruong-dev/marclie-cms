# Animation guide — Marclie CMS

Frontend animation is built on **GSAP** (scroll/timeline) and **three.js / React Three
Fiber** (3D), kept in isolated, reusable wrappers under
`src/components/animations/`. Nothing animates by default except where a wrapper is
used, and **every wrapper respects `prefers-reduced-motion`**.

> Role split (see `TTD.md` Appendix D): **GSAP = scroll/timeline motion**, three.js = 3D.
> React Bits (drop-in "wow" effects) is deferred.

## Where things live

| File | What |
|---|---|
| `animations/gsap.ts` | Central GSAP import — registers `useGSAP` + `ScrollTrigger` once. **Import `gsap`/`ScrollTrigger` from here**, not from the package. |
| `animations/useReducedMotion.ts` | Reactive `prefers-reduced-motion` hook (`useSyncExternalStore`). |
| `animations/AnimateIn.tsx` | Fade/slide-in on scroll, with optional stagger. |
| `animations/Parallax.tsx` | Scroll-scrubbed vertical parallax. |
| `animations/Hero3D/` | Lazy, client-only three.js hero placeholder (`Scene.tsx` = WebGL, `index.tsx` = `next/dynamic` loader). |
| `animations/index.ts` | Barrel — import everything from `@/components/animations`. |

## Presets

### Fade / slide-in on scroll — `AnimateIn`

```tsx
import { AnimateIn } from '@/components/animations'

<AnimateIn variant="fade-up">
  <h2>Animates once when it scrolls into view</h2>
</AnimateIn>

// Stagger direct children (e.g. a card grid):
<AnimateIn stagger={0.12} className="grid gap-6 md:grid-cols-3">
  {items.map((i) => <Card key={i.id} {...i} />)}
</AnimateIn>
```

Props: `variant` (`fade` · `fade-up` · `fade-down` · `fade-left` · `fade-right` · `zoom`,
default `fade-up`), `duration`, `delay`, `stagger`, `as` (element tag), `className`.
Live example: `src/blocks/Features/Component.tsx`.

### Parallax — `Parallax`

```tsx
import { Parallax } from '@/components/animations'

<Parallax speed={0.3}>
  <img src="…" alt="" />
</Parallax>
```

`speed` is the drift as a fraction of the element's height (positive = drifts up).

### 3D hero placeholder — `Hero3D`

```tsx
import { Hero3D } from '@/components/animations'

<Hero3D className="max-w-md" /> // fills its (square) container
```

three.js / R3F are heavy and browser-only, so `Hero3D` always lazy-loads the WebGL
`Scene` via `next/dynamic` with `ssr: false` (a skeleton shows while it loads). To
customise, edit/replace `Hero3D/Scene.tsx`.

## Rules

- **Always lazy-load 3D.** Never import `Hero3D/Scene` (or three.js / R3F) into a
  server component or top-level bundle — go through the `Hero3D` wrapper.
- **Run GSAP only on the client.** Wrappers use `useGSAP` (from `@gsap/react`) with a
  `scope` ref and automatic cleanup; never call `gsap`/`ScrollTrigger` during SSR.
- **Respect reduced motion.** Every wrapper checks `useReducedMotion()` and renders the
  final, visible state with motion disabled. Keep this when adding new presets.
- **Keep it isolated.** New animation primitives go in `animations/`; pages/blocks
  consume the wrappers — they don't call GSAP/three.js directly.

## Typing note (three.js + polymorphic components)

R3F augments the global `JSX.IntrinsicElements`, which narrows polymorphic `as` /
`htmlElement` components to a `never` children type under `tsc`. Affected wrappers
(`AnimateIn`, `components/Media`) use `React.createElement` instead of a `<Tag>` JSX
element to keep their typing intact. Reuse that pattern for new polymorphic components.

## Performance

- 3D is code-split, so it doesn't affect first load until rendered.
- `ScrollTrigger` instances are cleaned up automatically by `useGSAP` on unmount.
- Measure with Lighthouse before shipping (Phase 13); budget for three.js.
