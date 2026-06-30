# CLAUDE.md — Marclie CMS

> Bộ nhớ & quy ước dự án cho Claude/AI agent. **Đọc file này đầu mỗi phiên.**
> Kế hoạch thực thi: `TTD.md`. Quyết định kiến trúc: `docs/adr/`. Định hướng gốc: `BLUEPRINT.md`.

## Dự án là gì
Starter template **Marclie CMS**: marketing site + CMS trong **một** Next.js app (Payload chạy in-repo). Mỗi dự án mới = đổi nội dung + theme tokens, không đụng lõi.

## Tech stack (đã khóa — xem `docs/adr/0001`)
- **Next.js 16.2.6** (App Router, Turbopack) · **React 19.2.6**
- **Payload 3.85.1** (ghim cứng) — admin tại `/admin`, REST/GraphQL tự sinh
- **Tailwind v4** (CSS-first `@theme`) + **shadcn/ui** (trong `src/components/ui/`)
- **Postgres qua `@payloadcms/db-postgres`** → **Neon** (local dev branch + prod). Biến `DATABASE_URL`.
- Plugins Payload: seo, redirects, nested-docs, search, form-builder; richtext **Lexical**; live-preview
- Test: **Playwright** (e2e) + **Vitest** (int). Quản lý package: **pnpm**. Node: `.nvmrc` = 24.

## Lệnh
```bash
pnpm dev                 # chạy dev (localhost:3000, /admin)
pnpm build               # build production
pnpm start               # chạy bản build
pnpm lint                # eslint
pnpm lint:fix            # eslint --fix
pnpm generate:types      # sinh src/payload-types.ts từ config
pnpm generate:importmap  # sinh import map cho admin
pnpm payload             # CLI Payload (migrate, v.v.)
pnpm test                # test:int + test:e2e
pnpm test:int            # vitest
pnpm test:e2e            # playwright
```
> Yêu cầu `.env` có `DATABASE_URL` (Neon) + `PAYLOAD_SECRET`. Mẫu: `.env.example`.

## Cấu trúc (template website)
```
src/
├── app/
│   ├── (frontend)/        # site public (home, [slug], posts, search...)
│   └── (payload)/         # admin + api Payload  ← LÕI, đừng sửa
├── collections/           # Pages, Posts, Categories, Media, Users
├── blocks/                # block CMS + component (RenderBlocks.tsx = registry)
├── heros/                 # các kiểu hero
├── Header/ , Footer/      # globals (nav)
├── plugins/index.ts       # cấu hình plugin Payload
├── components/ui/         # shadcn/ui base
├── providers/Theme/       # light/dark (next-themes-style)
├── endpoints/seed/        # seed dữ liệu mẫu
├── fields/ , hooks/ , utilities/ , access/
└── payload.config.ts      # ⭐ cấu hình CMS trung tâm
```

## Quy ước "lõi vs mở rộng" (để dễ nâng cấp Payload)
- **Lõi — đừng sửa:** `src/app/(payload)/`, cơ chế Payload core. Nâng cấp Payload không vênh.
- **Mở rộng — chỗ tùy chỉnh:** `src/collections/`, `src/blocks/`, `src/cms/` (branding/plugin nội bộ — *sẽ tạo ở Phase 8*), nội dung trong `(frontend)/`, design tokens.
- **Brand đổi qua tokens** (Tailwind v4 `@theme`), không sửa component.

## Branding Marclie CMS (Phase 8)
Gom branding vào `src/cms/branding.ts` (`admin.meta`, Logo/Icon, CSS admin). Lõi Payload giữ nguyên.

## Skills đã cài (xem `TTD.md` Phụ lục F)
Vị trí: `.agents/skills/` (quản lý bởi skills.sh, lock ở `skills-lock.json`) + `.claude/skills/` (Claude Code).
- **shadcn** (`.agents/skills/shadcn`) — dựng/cấu hình UI shadcn; tự đọc `components.json`.
- **GSAP ×8** (`.agents/skills/gsap-*`) — animation; ưu tiên `gsap-react` (hook `useGSAP`, SSR), `gsap-scrolltrigger`, `gsap-timeline`.
- **tailwind-theme-builder** (`.claude/skills/`, từ jezweb) — pattern 4 bước Tailwind v4 `@theme inline` + dark mode + migration. ⚠️ assets của skill là **Vite** → dự án Next.js dùng `@tailwindcss/postcss` (đã có), bỏ `vite.config`; lấy `index.css`/pattern.
- Cập nhật skills.sh: `pnpm dlx skills update`. Cập nhật jezweb: copy lại từ repo.
- Có sẵn trong môi trường: `code-review`, `verify`, `security-review`, `design:accessibility-review`, `ui-ux-pro-max`, `frontend-design`.

## Git
- `main` = production. Conventional Commits (`feat:`, `fix:`, `chore:`...). `.env` không commit.
- Remote: `git@github.com:phutruong-dev/marclie-cms.git`.

## Mô hình sync
Code → git · Schema CMS → Payload migrations (trong git) · Dữ liệu → DB từng môi trường (KHÔNG qua git).
