# Website Blueprint — Marketing Site + Payload CMS

> Starter template chuẩn hóa để khởi tạo mọi dự án website mới mà không phải làm lại từ đầu.
> Stack đồng bộ, quy trình đồng bộ. Mỗi dự án mới chỉ khác phần nội dung + theme marketing.

---

## 0. Quyết định đã chốt

- **Path A — Code-first**: Next.js + Payload + Tailwind + shadcn. Kiểm soát tối đa, vibe-code với Claude, GSAP/R3F first-class.
- **CMS**: Payload (in-repo), **Postgres + Vercel**.
- **Chiến lược chi phí: FREE-FIRST** (xem mục 9.6). Khởi đầu bằng đồ miễn phí, chỉ mua khi thực sự đáng.
- **shadcn studio**: CHƯA cần ngay — shadcn/ui + block free đủ khởi đầu. Mua sau khi thấy "đau" vì dựng block thủ công (lifetime, không vội).
- **React Bits**: dùng bản **FREE** (reactbits.dev) trước cho lớp "wow"; chỉ mua **Pro** khi cần component shader/3D cụ thể (cài qua shadcn CLI, copy & own).
- **Local DB**: mặc định **Neon dev branch** (không Docker, giống prod). Docker chỉ là tùy chọn offline.
- **Figma**: dùng shadcn studio Figma Kit (khớp 1-1 component) + Figma MCP để design-to-code.
- **Light/Dark + WCAG**: bắt buộc, baked-in từ đầu (xem mục 6.5).
- **Instatic — đã cân nhắc, KHÔNG chọn**: là stack thay thế (Bun, không Next.js, không Tailwind, không React ở trang public) nên không nhét vào Path A được; còn v0.0.x. Có thể xem lại khi nó đạt 1.0 nếu cần CMS visual kéo-thả thuần.
- **Render**: mặc định **static-first + ISR + on-demand revalidation** (xem mục 2.5). SSR chỉ khi bắt buộc.
- **Astro — KHÔNG dùng**: phá vỡ tích hợp Payload in-repo + deploy một-nơi, và AI hỗ trợ yếu hơn Next.js. Astro chỉ hợp blueprint static + headless rời (không phải hướng này).

---

## 1. Triết lý thiết kế

Một **template repository** duy nhất trên GitHub. Mỗi dự án mới: bấm *"Use this template"* → có ngay toàn bộ tech stack, cấu trúc, CMS, config, CI/CD và quy trình. Việc còn lại chỉ là đổi nội dung, đổi theme (màu/font/layout marketing) và viết animation đặc thù.

Ba nguyên tắc:

- **Một codebase duy nhất** — Payload CMS chạy ngay trong Next.js (cùng repo, cùng deploy). Không tách backend riêng, không phải quản lý 2 server.
- **Code ownership** — toàn bộ UI lấy từ shadcn/ui + shadcn studio (copy-paste/CLI), bạn sở hữu code, không lock-in.
- **Cấu hình qua biến môi trường + theme tokens** — phần khác nhau giữa các dự án được cô lập vào vài file, không đụng vào core.

---

## 2. Tech stack chuẩn

| Lớp | Công nghệ | Ghi chú |
|---|---|---|
| Framework | **Next.js (App Router)** + TypeScript | Nền tảng cho cả marketing site lẫn CMS |
| Styling | **Tailwind CSS** + CSS variables (design tokens) | Theme đổi qua token, không sửa component |
| UI — cấu trúc | **shadcn/ui** (free, MIT) + **shadcn studio** (blocks/templates premium) | Marketing blocks + admin dashboard UI |
| UI — animated/wow | **React Bits Pro** (component shader/3D/text) | Cài qua shadcn CLI, copy & own; lazy-load |
| CMS | **Payload CMS** (chạy in-repo) | Auth, admin UI, REST/GraphQL API có sẵn |
| Database | **Neon Postgres qua Vercel Marketplace** | Adapter `@payloadcms/db-vercel-postgres`; billing trong Vercel |
| Theming | CSS variables + **next-themes** (light/dark) | Toggle + tôn trọng `prefers-color-scheme` |
| Accessibility | Semantic HTML + ARIA, audit WCAG 2.1 AA | Bước kiểm tra bắt buộc trước ship |
| Animation | **GSAP** (scroll/timeline) + **three.js** / React Three Fiber | Lazy-load, chỉ ở điểm nhấn |
| Forms/validation | React Hook Form + **Zod** | Zod là nguồn chân lý schema (form, env, API) |
| Render | **Static + ISR + on-demand revalidation** | Payload hook gọi `revalidatePath`/`revalidateTag` khi publish |
| Type safety | **TypeScript strict** + env validation (Zod) | AI bắt lỗi lúc build, cấu hình sai fail sớm |
| Test (guardrail AI) | **Playwright** (e2e) + **Vitest** (unit) | AI tự xác minh thay vì review tay |
| Quan sát | Vercel Analytics + **Sentry** | Cùng hệ Vercel, không thêm dashboard |
| Deploy | **Vercel** | Next.js + Payload deploy chung |
| Storage media | **Vercel Blob** (`@payloadcms/storage-vercel-blob`); Cloudflare R2 nếu nhiều media | Bắt buộc — serverless không lưu file trên disk |
| Local dev DB | **Neon dev branch** (mặc định) / SQLite / Docker (offline) | Không cần Docker cho quy trình thường |
| Email | Resend (form contact, reset password) | Tùy chọn |
| Quản lý package | pnpm | Nhanh, gọn disk |

> Lưu ý phiên bản: trước khi chốt, kiểm tra Payload và shadcn studio có tương thích cùng phiên bản Next.js / Tailwind / React mới nhất không (đây là điểm hay vênh). Khóa version trong `package.json` để mọi dự án đồng nhất.

---

## 2.5. Render strategy (per-route)

Next.js App Router cho render theo từng route — không chọn một kiểu cho cả site:

- **Marketing + nội dung CMS** (home, about, services, portfolio, blog): **static (SSG) + ISR**. Khi editor publish trong Payload, hook gọi `revalidatePath`/`revalidateTag` để tạo lại đúng trang đó (on-demand revalidation). Nhanh như static, cập nhật như dynamic, không rebuild toàn site.
- **Phần động/cá nhân hóa** (search, dữ liệu theo user): **SSR / RSC** theo request.
- **Admin Payload**: luôn dynamic, không cache.
- Đọc dữ liệu trong RSC bằng **Payload Local API** (gọi thẳng, không qua HTTP).

Quy ước: *static-first → ISR cho CMS → SSR chỉ khi bắt buộc*.

---

## 2.6. Nguyên tắc tech stack cho vibecode AI

Chọn công cụ phổ biến + dựng guardrail để AI tự kiểm lỗi:

- **TypeScript strict** + **Zod** làm nguồn chân lý schema → AI suy luận kiểu chính xác, bắt lỗi lúc build.
- **Validate env** (Zod / `@t3-oss/env-nextjs`) → cấu hình sai fail ngay.
- **ESLint + Prettier + typecheck trong CI** → mọi code AI sinh ra bị kiểm trước khi merge.
- **Playwright (e2e) + Vitest (unit)** → guardrail quan trọng nhất: AI chạy test tự xác minh.
- **File nhỏ, component-driven** → AI edit chính xác, tránh file khổng lồ.
- **Ưu tiên copy-own** (shadcn/ui, React Bits) thay vì thư viện hộp đen → AI đọc & sửa được.
- **CLAUDE.md ghi rõ convention** → AI theo pattern thay vì đoán.
- **Cô lập animation** trong wrapper → sửa nội dung không phá layout/hiệu năng.
- **pnpm + khóa version Node/deps** → môi trường tái lập.

---

## 3. Cấu trúc thư mục

Single Next.js app, Payload tích hợp bên trong:

```
my-website/
├── .claude/
│   └── skills/                # ⭐ Skill riêng dự án cho vibecode
├── .git/                      # ⭐ Git khởi tạo ngay từ đầu
├── docs/                      # Tài liệu kiến trúc/quyết định
├── CLAUDE.md                  # ⭐ Bộ nhớ & quy ước dự án cho Claude
├── AGENTS.md                  # Quy ước cho AI agent nói chung
├── CHANGELOG.md               # ⭐ Nhật ký thay đổi (Keep a Changelog)
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Nhóm route public — KHÁC NHAU mỗi dự án
│   │   │   ├── page.tsx           # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── portfolio/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── layout.tsx         # Header/Footer marketing
│   │   ├── (payload)/             # Admin CMS — GIỐNG NHAU mọi dự án
│   │   │   └── admin/[[...segments]]/
│   │   └── api/                   # Payload + custom API routes
│   ├── collections/               # Schema CMS: Pages, Posts, Media, Users, Forms...
│   ├── blocks/                    # Section blocks tái sử dụng (Hero, Features, CTA...)
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   ├── marketing/             # Component cho site công khai
│   │   └── animations/            # GSAP / three.js wrappers
│   ├── lib/                       # utils, payload client, helpers
│   ├── styles/
│   │   └── theme.css              # ⭐ DESIGN TOKENS — đổi đây cho mỗi brand
│   └── payload.config.ts          # ⭐ Cấu hình CMS trung tâm
├── .env.example                   # Mẫu biến môi trường
├── docker-compose.yml             # Postgres local (dev)
├── README.md                      # Hướng dẫn khởi động
├── SETUP.md                       # Checklist tạo dự án mới
└── package.json
```

**Quy ước "giống nhau vs khác nhau":**

- *Giống nhau mọi dự án* (đừng sửa): `(payload)/`, `collections/`, `lib/`, cơ chế blocks, CI/CD.
- *Khác nhau mỗi dự án* (chỗ cần chỉnh): `styles/theme.css` (tokens), nội dung trong `(marketing)/`, `animations/` đặc thù, biến môi trường.

---

## 4. CMS — Payload (thay thế WordPress)

Payload chạy ngay trong repo, cung cấp admin panel tại `/admin` với auth, phân quyền, và API tự sinh.

Các **collections** mặc định nên có sẵn trong blueprint:

- **Pages** — quản lý trang động bằng *block-based layout* (editor chọn Hero, Features, Gallery, CTA... kéo thả như WordPress Gutenberg).
- **Posts / Blog** — bài viết, category, tag, SEO fields.
- **Portfolio / Projects** — cho trang portfolio.
- **Media** — upload ảnh, gắn alt text, resize tự động.
- **Forms / Submissions** — lưu nội dung form contact.
- **Users** — admin/editor roles.
- **Globals**: `SiteSettings` (logo, social links), `Navigation` (menu header/footer).

Cách này cho client tự sửa nội dung như WordPress, nhưng frontend vẫn là Next.js tùy biến hoàn toàn. Mỗi block trong CMS map tới một React component trong `src/blocks/`.

### 4.1. Marclie CMS — branding & mở rộng

Starter khởi đầu từ Payload để tiết kiệm thời gian, nhưng được tổ chức để bạn rebrand thành **Marclie CMS** và custom sâu về sau (Payload là MIT, config bằng code):

- **Branding**: `admin.meta` (title "Marclie CMS", favicon) + `admin.components.graphics.Logo`/`Icon` để thay logo, + CSS admin riêng. Gom vào một file `src/cms/branding.ts`.
- **Mở rộng tính năng**: custom collections/fields, custom field components (React), custom admin views/routes, REST/GraphQL endpoints riêng, access control, hooks, background jobs — đóng gói thành plugin nội bộ tái dùng cho mọi site.
- **Quy ước lõi vs mở rộng**: lõi Payload giữ nguyên; mọi custom đặt trong `src/collections/`, `src/cms/` (branding, plugins nội bộ), không sửa cấu hình lõi để dễ nâng cấp Payload.
- **Bối cảnh**: Figma mua Payload (6/2025), Payload Cloud tạm dừng nhận mới → self-host (hướng của ta) là chuẩn; bản OSS vẫn phát triển.

---

## 5. Frontend marketing — shadcn studio

5 trang (home/about/services/portfolio/contact) dựng từ **blocks của shadcn studio**. Vì các dự án dùng chung bộ block, giao diện sẽ nhất quán; sự khác biệt thương hiệu đến từ **design tokens** trong `theme.css` (màu, font, radius, spacing) — đổi token là đổi toàn bộ "tông" site mà không sửa component.

Workflow tạo trang: lấy block từ shadcn studio (Copy Prompt / CLI / Figma-to-code) → đưa vào `src/blocks/` → nối dữ liệu từ Payload → ráp vào trang.

---

## 6. Animation — GSAP & three.js

Tách riêng khỏi UI để không xung đột và để dễ bật/tắt theo dự án:

- Đặt trong `src/components/animations/` dưới dạng wrapper component.
- **GSAP** + ScrollTrigger cho hiệu ứng scroll, reveal, timeline.
- **three.js / React Three Fiber** cho hero 3D — **luôn lazy-load** (`next/dynamic`, `ssr: false`) để không nặng trang.
- Có sẵn vài preset mẫu trong blueprint (fade-in-on-scroll, parallax, 3D hero placeholder) để dự án mới chỉ cần bật lên dùng.

> three.js nặng — chỉ dùng ở điểm nhấn, đo Lighthouse trước khi ship.

---

## 6.5. Light/Dark mode & WCAG (bắt buộc)

**Light/Dark** xây từ đầu, không bolt-on sau: dùng `next-themes` + design tokens dạng cặp (`--background`, `--foreground`...) định nghĩa cho cả 2 theme trong `theme.css`. shadcn/ui vốn hỗ trợ dark mode sẵn nên các block kế thừa tự động. Có toggle + mặc định theo `prefers-color-scheme`.

**WCAG 2.1 AA** là tiêu chuẩn mục tiêu, đưa vào quy trình như bước kiểm tra bắt buộc (không phụ thuộc một skill cụ thể):

- Dùng semantic HTML + ARIA đúng chỗ; mọi ảnh có alt (CMS bắt nhập alt ở Media).
- Kiểm color contrast cho **cả light lẫn dark** ≥ 4.5:1 (text thường).
- Keyboard navigable: focus order hợp lý, focus indicator rõ.
- Chạy `design:accessibility-review` (skill có sẵn) trên mỗi trang trước khi ship; tùy chọn thêm axe/Lighthouse trong CI.
- Lưu ý animation: tôn trọng `prefers-reduced-motion` — tắt/giảm GSAP/three.js cho người chọn giảm chuyển động.

---

## 6.6. File vibecode & Git (có sẵn từ đầu)

**File thân thiện vibecode** giúp mình (và mọi AI agent) hiểu dự án ngay:

- `CLAUDE.md` — quy ước dự án: stack, cấu trúc, lệnh build/test, vùng "lõi vs mở rộng", brand Marclie CMS, cách dùng shadcn studio + React Bits. Mình đọc file này đầu mỗi phiên.
- `.claude/skills/` — skill riêng dự án (vd: "thêm block marketing mới", "tạo collection Payload"). React Bits Pro cũng có Agent Skills — tham chiếu vào đây.
- `AGENTS.md` — bản quy ước chung cho agent (chuẩn mở, không riêng Claude).
- `CHANGELOG.md` — theo chuẩn *Keep a Changelog*, cập nhật mỗi lần nâng cấp blueprint.
- `docs/` — ghi lại quyết định kiến trúc (ADR) để dự án sau không hỏi lại.

**Git từ đầu** (gắn liền deploy Vercel):

- `git init` + `.gitignore` chuẩn Next.js (bỏ `.env*`, `.next`, `node_modules`).
- **Conventional Commits** (`feat:`, `fix:`, `chore:`) để CHANGELOG/tự động hóa dễ.
- `main` = production; mỗi nhánh/PR → **Vercel Preview Deploy** kèm **Neon database branch** riêng để test an toàn.
- Push lên GitHub → Vercel auto-deploy. Không thao tác thủ công.

---

## 7. Quy trình làm việc cho mỗi dự án mới

1. **Khởi tạo**: GitHub → *Use this template* → repo mới (Git đã sẵn) → `pnpm install` → copy `.env.example` thành `.env`, điền DB + secrets → connect Vercel + Neon (Marketplace) + Vercel Blob.
2. **Branding**: sửa `styles/theme.css` (màu/font/radius) + thay logo trong `SiteSettings`. Site đổi toàn bộ tông ngay.
3. **Thiết kế (Figma)**: dùng shadcn studio Figma Kit dựng ý tưởng 5 trang. Vì kit khớp component thật → Figma-to-code sát.
4. **Dựng marketing với Claude**: Copy Prompt từ blocks shadcn studio hoặc Figma-to-code → mình ráp section, chỉnh nội dung, responsive.
5. **Cấu hình CMS**: chỉnh collections nếu dự án cần field riêng; nối các trang đọc nội dung động từ Payload.
6. **Animation**: bật preset GSAP/three.js cần dùng, thêm hiệu ứng đặc thù.
7. **Hoàn thiện**: chạy `design:accessibility-review` (WCAG 2.1 AA, kiểm cả light & dark), Lighthouse/performance, SEO (metadata, sitemap, OG), test form.
8. **Deploy**: connect repo vào Vercel, set env, gắn Postgres (Neon/Supabase), domain.

Quy trình giống hệt nhau ở mọi dự án → bạn (và mình) làm nhanh dần theo thời gian.

---

## 8. Biến repo thành GitHub Template

1. Dựng repo blueprint hoàn chỉnh (mục 9).
2. Push lên GitHub.
3. Settings → tick **Template repository**.
4. Từ đó mỗi dự án mới bấm *"Use this template"* → repo độc lập, không dính lịch sử commit gốc.
5. Khi blueprint nâng cấp (thêm block, sửa config), cập nhật repo gốc; dự án cũ có thể cherry-pick phần cần.

---

## 9. Việc cần làm khi scaffold (bước sau)

Khi bạn duyệt xong, mình sẽ dựng:

- `package.json` với version khóa cứng + scripts (`dev`, `build`, `payload`, `seed`).
- Khung Next.js App Router + tích hợp Payload + `payload.config.ts`.
- Bộ collections mặc định (Pages, Posts, Portfolio, Media, Forms, Users, Globals).
- `theme.css` với design tokens mẫu + cơ chế đổi theme.
- 5 trang marketing khung sẵn + vài block mẫu.
- Thư mục `animations/` với preset GSAP + three.js placeholder.
- `.env.example`, `docker-compose.yml` (Postgres local), `README.md`, `SETUP.md` (checklist dự án mới).
- File vibecode: `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md`, `.claude/skills/`, `docs/`.
- `git init` + `.gitignore` + commit khởi tạo (Conventional Commits).
- Branding Marclie CMS (`src/cms/branding.ts`) + cấu hình React Bits qua shadcn CLI.
- GitHub Actions CI (lint + typecheck + build) + cấu hình Vercel.

---

## 9.5. Hosting trên Vercel — tất cả một nơi

Mục tiêu: không quản lý server ở nhiều nơi. Với stack này, mọi thứ nằm trong **một dashboard, một hóa đơn Vercel**:

- **Compute**: Next.js + Payload chạy chung serverless trên Vercel.
- **Database**: **Neon Postgres qua Vercel Marketplace** (Vercel-Managed Integration) — billing trong Vercel, env vars tự inject, branch-per-preview.
- **Media**: **Vercel Blob** (serverless không lưu file trên disk).

**Local DB — mặc định Neon dev branch (không Docker):** dev local kết nối thẳng tới một Neon branch → không cài Docker, giống hệt prod, tạo/xóa branch trong vài giây. Tùy chọn khác: SQLite (`@payloadcms/db-sqlite`, zero setup, prototype nhanh) hoặc Docker (chỉ khi cần offline hoàn toàn). Vercel KHÔNG chạy Docker — **production không Docker, không server tự quản.**

**Mô hình sync (quan trọng):**

- **Code** → git (push/pull).
- **Schema CMS** → Payload **migrations** (nằm trong git).
- **Dữ liệu/nội dung** → KHÔNG sync qua git; mỗi môi trường có DB riêng. Nội dung client sống ở **DB production**. Push code không đụng nội dung thật.

**Lưu ý serverless**: cold start (Neon scale-to-zero + Vercel function) — ổn cho marketing site + CMS nhẹ. Tác vụ nặng/chạy nền lâu thì cân nhắc job runner riêng.

---

## 9.6. Chi phí — chiến lược FREE-FIRST

Gần như mọi thứ trong stack miễn phí. Khởi đầu free, chỉ chi tiền khi thực sự đáng:

| Thành phần | Free-first | Khi nào trả tiền |
|---|---|---|
| Next.js, Payload, Tailwind, shadcn/ui | Miễn phí (MIT) | Không bao giờ |
| React Bits | Bản **free** (reactbits.dev) | Pro chỉ khi cần shader/3D cụ thể (lifetime) |
| shadcn studio | Chưa cần | Mua sau khi thấy "đau" dựng block tay (lifetime) |
| Neon Postgres | Free tier: 10 branch, 100 CU-h/tháng, 0.5GB/project, tối đa 100 project | Upgrade từng project khi lớn |
| Media | Vercel Blob (hạn free) | Site nhiều media → Cloudflare R2 (10GB free, no egress) |
| Sentry, Vercel Analytics, Playwright, Vitest | Free tier | Khi scale |

**Chi phí cố định không tránh được — Vercel Pro $20/tháng:** gói Hobby (free) **cấm dùng thương mại/làm cho khách**. Làm web cho khách bắt buộc Pro $20/user/tháng. Điểm sáng: **một seat Pro phủ TẤT CẢ site khách** (nhiều project trong một team), không trả mỗi site. Né được $20 này chỉ bằng self-host VPS/Railway/Render — nhưng đó là quay lại quản server, ngược mục tiêu một-nơi.

→ Tổng chi tối thiểu để vận hành chuyên nghiệp: **$20/tháng (Vercel Pro)**. Mọi thứ khác bắt đầu từ $0; shadcn studio & React Bits Pro là khoản mua-một-lần tùy chọn, mua khi cần.

---

## 10. Rủi ro & lưu ý

- **Tương thích phiên bản**: Payload vs Next.js/Tailwind/shadcn studio đôi khi vênh — khóa version, test kỹ khi nâng cấp.
- **License shadcn studio**: mua lifetime cho phép unlimited project; kiểm tra điều khoản redistribute nếu blueprint là public repo (nên để **private** nếu nhúng template premium).
- **Bảo trì blueprint**: cử thời gian cập nhật định kỳ, nếu không các dự án sẽ phân nhánh xa nhau.
- **Performance three.js**: luôn lazy-load, đặt ngân sách Lighthouse.
