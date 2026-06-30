# Theming — Marclie CMS

How colours, dark mode, and brand tokens work. **Rebrand = edit tokens here, not components.**

## Token file
All design tokens live in **`src/app/(frontend)/globals.css`** (Tailwind v4, CSS-first).
> Note: the blueprint mentioned `src/styles/theme.css`; the template keeps tokens in `globals.css` instead. We follow the template — this is the single token file.

## The four-step Tailwind v4 pattern
1. **Define CSS variables** — `:root { --background: …; --primary: … }` (light) and `[data-theme='dark'] { … }` (dark). Colours use `oklch()`.
2. **Map to Tailwind colours** — `@theme inline { --color-background: var(--background); … }`. This generates utilities like `bg-background`, `text-foreground`, `border-border`.
3. **Base styles** — `@layer base { body { @apply bg-background text-foreground } }`.
4. **Dark mode** — `@custom-variant dark (&:is([data-theme='dark'] *))`; the active theme is set on `<html data-theme="…">`.

## Light / dark mechanism
- Dark mode is driven by the **`data-theme` attribute** on `<html>` (values `light` / `dark`) — **not** a `.dark` class.
- `src/providers/Theme/InitTheme` injects a `beforeInteractive` script that sets `data-theme` before paint (no flash): default `light`, else `localStorage['payload-theme']`, else `prefers-color-scheme`.
- `src/providers/Theme/ThemeSelector` is the user-facing toggle (light / dark / auto), persisted to localStorage.
- `globals.css` keeps `html { opacity: 0 }` until `data-theme` is set, preventing a flash of the wrong theme.

## How to rebrand (change the whole site's tone)
Edit `src/app/(frontend)/globals.css`:
- **Brand colour:** change `--primary` (and `--primary-foreground`) in both `:root` and `[data-theme='dark']`.
- **Surfaces / text:** `--background`, `--foreground`, `--card`, `--muted`, `--accent`, `--border`, `--ring`.
- **Shape:** `--radius` (drives `rounded-sm/md/lg/xl`).
- **Fonts:** `--font-sans`, `--font-mono` (mapped under `@theme`).
- Keep light and dark in sync — every token has a value in both blocks; check contrast (Phase 13 / `design:accessibility-review`).

Because every component uses the mapped utilities (`bg-primary`, `text-foreground`, …), editing these variables re-themes the entire site without touching components.

## Admin styling
The CMS admin uses its own internal SCSS and is **independent** of these Tailwind tokens — changing site tokens does not affect `/admin`. Admin branding is handled separately in Phase 8 (`src/cms/branding.ts`).
