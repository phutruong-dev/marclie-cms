# ADR 0001 — Stack & khóa version

- **Trạng thái:** Accepted
- **Ngày:** 2026-06-30
- **Liên quan:** `BLUEPRINT.md`, `TTD.md` (Phase 0)

## Bối cảnh
Starter **Marclie CMS** cần khóa version + lựa chọn nền tảng trước khi scaffold để mọi dự án con đồng nhất và tránh vênh tương thích (rủi ro số 1 theo BP §10).

## Quyết định

### 1. Base scaffold
- Dùng **Payload `website` template**: `pnpm create payload-app -t website`.
- Lý do: tiết kiệm thời gian, dễ test, đã maintain sẵn plugin (SEO, form-builder, redirects, nested-docs, search), drafts/versions/live-preview, Lexical. Tùy biến sau = code thêm, **giữ nguyên lõi Payload**. (Không dùng `blank`.)

### 2. Khóa version
| Thành phần | Chốt | Ghi chú |
|---|---|---|
| Node | ≥ 20.9; pin `.nvmrc` (khuyến nghị **22 LTS** cho tái lập; máy hiện chạy 24.14.1 vẫn OK) | Payload 3.x yêu cầu ≥ 20.9 |
| pnpm | **10.x** (qua corepack) | Đang có 10.33.0 |
| Next.js | **16.2.6** (theo template stable v3.85.1) | Payload hỗ trợ 16.2.6+. *Cập nhật: ban đầu dự kiến 15.x, nhưng website template stable đã chuyển sang Next 16 → đi theo template.* |
| React | **19.2.6** | Đi kèm Next 16; Payload 3 admin yêu cầu |
| Payload | **3.85.1** (ghim cứng, stable mới nhất) | Main đang tiến tới 4.0-canary → KHÔNG dùng main |
| Tailwind | **v4** (^4.1.18, native trong template) | **Không cần migrate v3→v4** — template stable đã là v4 |
| DB adapter | **`@payloadcms/db-postgres`** → Neon | Dùng chung local + prod, tránh drift migration |

### 3. Database
- `@payloadcms/db-postgres` trỏ **Neon** cho cả local (dev branch) lẫn prod. SQLite chỉ là lối thoát hiểm prototype; Docker chỉ khi cần offline. Sync: code→git, schema→migrations, data→DB từng môi trường (BP §9.5).

### 4. Tailwind v4 (đã xác minh khi scaffold)
- Website template stable **đã dùng Tailwind v4** (`tailwindcss ^4.1.18`, `@tailwindcss/postcss`, `tw-animate-css`) → **không cần migrate v3→v4**. Cảnh báo "template ship v3" ở bản nháp đã được package.json đính chính.
- shadcn/ui: dùng CLI bản hỗ trợ v4 + React 19 (template `components.json` đã có sẵn).
- Admin Payload dùng SCSS riêng, độc lập Tailwind → không xung đột.

### 4b. Đổi mongodb → postgres khi scaffold
- Template mặc định `@payloadcms/db-mongodb` → đã **đổi sang `@payloadcms/db-postgres`** (package.json + `src/payload.config.ts` dùng `postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } })`).
- `docker-compose.yml` đổi từ mongo → postgres (chỉ dùng offline). `.env.example` đổi sang Postgres/Neon.

### 5. Repo
- Remote đã tạo: **`git@github.com:phutruong-dev/marclie-cms.git`** → sẽ set làm `origin` ở Phase 1.
- Khuyến nghị để **private** nếu sau nhúng asset premium (shadcn studio); nếu không thì public tùy ý.

### 6. Skill ngoài cần cài (Phase 1)
- shadcn/ui: `pnpm dlx skills add shadcn/ui`
- Tailwind v4+shadcn (jezweb, adapt Vite→Next.js): `openskills install jezweb/claude-skills`
- GSAP official: `npx skills add https://github.com/greensock/gsap-skills`

## Hệ quả
- Mọi phase sau bám version đã khóa; nâng cấp (vd Next 16) đi qua ADR mới + test.
- Điểm cần kiểm tra đầu Phase 1: phiên bản Tailwind mà template ship.
