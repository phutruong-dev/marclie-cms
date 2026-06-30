# ADR 0002 — ESLint flat config & react-hooks v6

- **Status:** Accepted
- **Date:** 2026-06-30
- **Related:** `eslint.config.mjs`, Phase 2 (TTD)

## Context
The template's `pnpm lint` crashed with `Converting circular structure to JSON` inside `@eslint/eslintrc` (FlatCompat) when loading `eslint-config-next` 16 + ESLint 9. After the fix, react-hooks v6 reported 5 errors in template code.

## Decision

### 1. Drop FlatCompat → native flat config
`eslint-config-next@16` exports ready-made flat config arrays (`./core-web-vitals`, `./typescript`). Import and spread them directly and **remove `FlatCompat`** → the crash is gone.

```js
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
export default [...nextCoreWebVitals, ...nextTypeScript, /* overrides */]
```

### 2. react-hooks v6 — per-file disable on intentional patterns
`eslint-plugin-react-hooks` v6 (React-Compiler-era) promotes two rules to errors in template code:
- `react-hooks/set-state-in-effect` ×3 — `src/providers/Theme/index.tsx`, `ThemeSelector`, `src/Header/Component.client.tsx` (client-only theme/header hydration in an effect).
- `react-hooks/refs` ×2 — `src/components/Card/index.tsx` (`card.ref`/`link.ref` from the `useClickableCard` hook).

These are intentional, working patterns from the base template. We **do not lower the rules globally** (we still want to catch new violations in our own code); instead we **disable per-file** (`/* eslint-disable <rule> -- reason */`) in those four files, with an explanatory comment.

Why not handle it in `eslint.config.mjs`: flat config requires the plugin to be declared in the same config object as the rule; `eslint-plugin-react-hooks` is not directly resolvable (a transitive dep of next under strict pnpm), and re-registering risks "Cannot redefine plugin".

### 3. Warnings do not fail CI
`pnpm lint` still has 7 warnings (unused args in template hooks/tests) — kept as warnings; `--max-warnings 0` is not enabled at this stage.

## Consequences
- `pnpm lint` → 0 errors, exit 0.
- When Theme/Card are refactored to React-Compiler-friendly patterns, remove the corresponding `eslint-disable` comments.
