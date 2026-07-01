# AGENTS.md — Marclie CMS

Conventions for **any** AI agent working in this repo (Claude Code, Cursor, Copilot, Codex, etc.). Claude-specific memory lives in `CLAUDE.md`; this file is the tool-agnostic subset. If your tool reads `CLAUDE.md`, read that too — it is the fuller version.

## Read first (in order)
1. **`CLAUDE.md`** — stack, commands, core-vs-extension, branding.
2. **`MAP.md`** — where everything lives; read before searching the tree.
3. **`TTD.md`** — the phase-by-phase execution plan and current status.
4. **`docs/adr/`** — why decisions were made (don't relitigate them).

## What this project is
**Marclie CMS** — a marketing site + CMS in one Next.js app, meant to be reused as a GitHub Template. Built on the Payload engine in-repo: the `payload` package/CLI, `payload.config.ts`, and `@payloadcms/*` are the real engine and are used as-is. Brand the product as **"Marclie CMS"**, never "a Payload project".

## Hard rules
- **Language:** all docs and code comments in **English**. (Owner chat replies may be Vietnamese.)
- **Core vs extension:**
  - **Do NOT edit** `src/app/(payload)/` or engine internals — keeps engine upgrades conflict-free.
  - **Customise only in** `src/collections/`, `src/blocks/`, `src/cms/` (branding), `(frontend)/` content, and design tokens.
- **Rebrand via tokens**, not components — edit CSS variables in `src/app/(frontend)/globals.css` (Tailwind v4 `@theme`). Dark mode uses the `data-theme` attribute, not a `.dark` class.
- **Access control:** public-readable collections use `read: authenticatedOrPublished` (published-only for the public). Never widen access silently.
- **Never commit `.env`** or secrets. Env is validated by `src/env.ts` (zod).
- **Pinned versions:** Next 16.2.6 · React 19.2.6 · engine 3.85.1. Don't bump without an ADR.

## Definition of done (every task)
1. Code compiles: `pnpm typecheck` and `pnpm lint` → **0 errors**.
2. If runtime-affecting: it actually runs (`pnpm dev` / `pnpm build`) — verify, don't assume.
3. After **any** config field change: `pnpm generate:types`.
4. **Update the docs** — this is part of "done", not extra work: `CLAUDE.md` (conventions), `TTD.md` (progress), `MAP.md` (if layout changed), `CHANGELOG.md`, `docs/adr/` (new decisions). Stale docs mislead the next agent.

## Common recipes (dedicated skills exist)
- **Add a layout block** → `.claude/skills/add-block` (config + Component + RenderBlocks + expose in collection + generate types).
- **Create a collection** → `.claude/skills/create-collection` (config + register in `payload.config.ts` + access control + optional frontend route).
- **Theme / dark mode** → `.claude/skills/tailwind-theme-builder` + `docs/theming.md`.

## Commands
See `CLAUDE.md` → Commands. Most-used: `pnpm dev`, `pnpm typecheck`, `pnpm lint`, `pnpm generate:types`, `pnpm seed` (resets + loads demo content; stop the dev server first).

## Git
`main` = production. Conventional Commits (`feat:`/`fix:`/`chore:`…). CI runs lint + typecheck on every push/PR.
