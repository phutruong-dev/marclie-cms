# TTD — Task Tracking Document

> **Mục tiêu:** Scaffold starter template **Marclie CMS** (Next.js + Payload + Tailwind v4 + shadcn) từ `BLUEPRINT.md` đến khi chạy được local, deploy được Vercel và biến thành GitHub Template.
> **Triết lý thực thi:** Dựng **cỗ máy trước, nội dung sau**. Bắt đầu từ **Payload `website` template** (đã maintain sẵn plugin/drafts/live-preview) rồi *own & rebrand*, thay vì hand-build từ số 0. Guardrail (lint/typecheck/CI/env) bật **sớm** để mọi code (kể cả AI sinh) bị kiểm từ commit đầu.
> **Cách dùng:** Làm tuần tự theo phase. Tick `[x]` khi xong. Mỗi phase có **Definition of Done (DoD)** — không qua phase sau khi DoD chưa đạt.
> **Nguồn chân lý:** `BLUEPRINT.md` (tham chiếu ghi trong ngoặc, ví dụ *[BP §2]*).

**Trạng thái tổng:** `Chưa bắt đầu`

Legend: `[ ]` chưa làm · `[~]` đang làm · `[x]` xong · `[!]` bị chặn/cần quyết định

> 📌 **Khác biệt so với bản nháp trước (đã review):** (1) scaffold từ Payload website template thay vì build tay; (2) guardrail/CI/env dời lên sớm (Phase 2); (3) Tailwind **v4** chính thức; (4) thống nhất 1 DB adapter; (5) dùng plugin Payload thay hand-roll; (6) thêm drafts/versions/live-preview, access control, Lexical render, seed, block registry; (7) **Home làm vertical-slice trước**, 4 trang còn lại đẩy về sau; (8) khử trùng tech stack (xem Phụ lục D).

---

## Phase 0 — Quyết định kỹ thuật & khóa version *(chốt trước khi gõ lệnh)* ✅ XONG

- [x] **Khóa bộ ba tương thích**: **Next.js 15.x · React 19 · Payload 3.x** — đã verify: Payload hỗ trợ Next 15.2.9–15.4.x (và 16.2.6+), Node ≥20.9 *[BP §2 lưu ý, §10]*
- [x] **Tailwind v4** (đã chốt) — shadcn CLI bản v4+React 19; v4: `@import "tailwindcss"`, tokens qua `@theme`, dark qua `@custom-variant dark` (Phụ lục E). ⚠️ verify Tailwind version template ship ở Phase 1 *[BP §2, §6.5]*
- [x] **DB adapter `@payloadcms/db-postgres`** trỏ Neon cho cả local lẫn prod *[BP §9.5]*
- [x] **Base scaffold: Payload `website` template** *[BP §0 Path A, §4]*
- [x] Công cụ verify: Node 24.14.1 · pnpm 10.33 · git 2.53 · corepack 0.34.6 (đạt yêu cầu)
- [x] Repo: **`git@github.com:phutruong-dev/marclie-cms.git`** (đã tạo) — sẽ là `origin` ở Phase 1

**DoD:** ✅ Đã ghi `docs/adr/0001-stack-and-versions.md`. Version triad, Tailwind v4, DB adapter, base template, repo — đã chốt.

---

## Phase 1 — Scaffold nền tảng + Git + CLAUDE.md skeleton ✅ DoD ĐẠT

- [x] Scaffold từ **Payload website template** (degit tag `v3.85.1`, không qua create-payload-app vì shell non-TTY) — db postgres → Neon *[BP §4]*
- [x] `git init` (branch `main`) + commit `80354e3` + `.gitignore` (bỏ `.env`, `.next`, `node_modules`); origin = `phutruong-dev/marclie-cms` *[BP §6.6]*
- [x] **`CLAUDE.md` skeleton** (sẽ lớn dần): stack, version lock, lệnh, lõi-vs-mở-rộng, vị trí skill *[BP §6.6]*
- [x] **Cài 3 skill ngoài cốt lõi** (Phụ lục F.1): shadcn (`.agents/skills/`), GSAP ×8 (`.agents/skills/`), tailwind-theme-builder/jezweb (`.claude/skills/`) — lệnh ghi trong `CLAUDE.md`
- [x] `package.json`: version ghim cứng (Payload 3.85.1) + scripts `dev`/`build`/`payload`/`generate:types`/`generate:importmap` (template có sẵn; **chưa có `seed` script** — template dùng route `/next/seed` + SeedButton) *[BP §9]*
- [x] Khóa Node (`.nvmrc`=24) + `.gitattributes` (LF) — engines đã có sẵn trong package.json *[BP §2.6]*
- [x] Cây thư mục template: dùng `(frontend)` thay `(marketing)` — sẽ ánh xạ/đổi tên ở phase sau nếu cần *[BP §3]*

**DoD:** ✅ HOÀN TẤT. `pnpm dev` chạy (Next 16.2.6); `/admin`→200, `/admin/login`→200, `/`→200; schema push lên Neon; admin user đầu đã tạo; `payload-types.ts` đã regenerate cho Postgres. CLAUDE.md + 3 skill + `.nvmrc`/`.gitattributes` xong.

> 🎁 Template đã kèm sẵn (giảm việc Phase 4–7): blocks + `RenderBlocks.tsx` (registry), collections + access control, plugins (seo/redirects/nested-docs/search/form-builder), Theme light/dark, seed endpoint, RichText Lexical, Playwright + Vitest.
> 🔐 **Nhắc:** Neon connection string đã lộ trong chat → rotate password ở Neon Console sau khi xong test.

---

## Phase 2 — Walking skeleton + Guardrail *(bật sớm — guardrail là then chốt vibecode)* *[BP §2.6]*

- [ ] **TypeScript strict** bật toàn bộ
- [ ] **Validate env bằng Zod** (`@t3-oss/env-nextjs`) — config/DB sai **fail ngay từ Phase 3** *[BP §2.6]*
- [ ] ESLint + Prettier (+ lint-staged/husky tùy chọn)
- [ ] **Playwright (e2e) — guardrail chính**: smoke test load `/` và mở `/admin`
- [ ] **Vitest (unit) — tối giản**: chỉ cho lib/helper có logic thật (xem Phụ lục D)
- [ ] **GitHub Actions CI**: lint + typecheck + build + test — phải **xanh trên app skeleton** *[BP §9]*
- [ ] Quy ước: mọi phase sau chỉ merge khi **CI xanh**

**DoD:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` đều xanh local + trên CI.

---

## Phase 3 — Tailwind v4 + Design tokens + Light/Dark *[BP §6.5]*

- [ ] Cấu hình **Tailwind v4** (`@import "tailwindcss"`); shadcn/ui base qua CLI bản v4 *[BP §2, §5]*
- [ ] Định nghĩa **design tokens qua `@theme`** trong `src/styles/theme.css`, dạng cặp light/dark (`--background`, `--foreground`, radius, font...) *[BP §3, §6.5]* — Phụ lục E
- [ ] Dark mode v4: `@custom-variant dark (&:is(.dark *))` + `next-themes` (toggle + tôn trọng `prefers-color-scheme`)
- [ ] Tài liệu hóa: **"đổi brand = đổi token trong `theme.css`"** *[BP §5]*

**DoD:** Toggle light/dark chạy; đổi 1 token đổi tông toàn site; admin Payload (SCSS riêng) không bị ảnh hưởng.

---

## Phase 4 — Chuẩn hóa Collections / Globals / Plugins *(template đã có sẵn — chủ yếu rà & chỉnh)* *[BP §4]*

- [ ] Rà collections template: `Users`, `Media`, `Pages` (layout builder), `Posts`, `Categories` — chỉnh field theo nhu cầu
- [ ] `Media` — **bắt buộc alt text**, resize tự động *[BP §4, §6.5]*
- [ ] Thêm **`Portfolio / Projects`** (template chưa có) *[BP §4]*
- [ ] Globals `SiteSettings` (logo, social) + `Navigation` (header/footer) — dùng **`plugin-nested-docs`** cho menu *[BP §4]*
- [ ] **Dùng plugin chính thức thay hand-roll** *[BP §4.1]*: `plugin-form-builder` (Forms + Submissions), `plugin-seo`, `plugin-redirects`, `plugin-search`
- [ ] **Drafts + Versions + Autosave** bật cho `Pages`/`Posts` (gắn với ISR ở Phase 7) — *khó retrofit, làm sớm*
- [ ] **Live Preview** trỏ về frontend
- [ ] **Access control rõ ràng**: public chỉ đọc bản `published`; draft chỉ user đăng nhập *[BP §4]*

**DoD:** Tạo thử Page bằng block trong admin; lưu DB; type sinh khớp; access control chặn draft với khách; migration cập nhật.

---

## Phase 5 — Block system & Registry + Render Lexical *[BP §4, §5]*

- [ ] **Block registry**: một file duy nhất map `blockSlug → React component` (DRY, AI thêm block không sót) *[BP §4]*
- [ ] Block mẫu trong `src/blocks/`: **Hero, Features, Gallery, CTA** (CMS field + component cặp đôi)
- [ ] **Serializer render Lexical rich text → React** (dùng cho Posts/nội dung dài) — *thường bị quên*
- [ ] Đọc dữ liệu trong RSC bằng **Payload Local API** (không qua HTTP) *[BP §2.5]*

**DoD:** Một Page ghép từ ≥2 block render đúng; richtext render đúng; thêm 1 block mới chỉ cần sửa registry + 2 file.

---

## Phase 6 — Vertical slice: trang Home end-to-end *(chứng minh cả pipeline)* *[BP §5, §2.5]*

> Mục tiêu: **không dựng cả 5 trang vội**. Làm 1 trang xuyên suốt để khóa pipeline; 4 trang còn lại chỉ là nội dung (Phase 10).

- [ ] `(marketing)/layout.tsx` — Header/Footer đọc từ `Navigation`
- [ ] Trang **Home** lấy nội dung thật từ Payload (block-based)
- [ ] Form contact: **`plugin-form-builder` định nghĩa form** → frontend render bằng **React Hook Form + Zod** → submit lưu Submissions *[BP §2]* (xem Phụ lục D về vai trò)
- [ ] **Seed tối thiểu**: admin user + Home page mẫu + Navigation + SiteSettings (script `pnpm seed`)
- [ ] `next/image` cấu hình **remotePatterns cho Vercel Blob** (ảnh không load nếu thiếu)

**DoD:** Mở Home thấy nội dung từ CMS; sửa trong admin → publish → trang đổi (chuẩn bị cho Phase 7); form submit lưu DB; `pnpm seed` dựng lại được từ DB trống.

---

## Phase 7 — Render strategy & On-demand revalidation *[BP §2.5]*

- [ ] Marketing/CMS pages: **static (SSG) + ISR**
- [ ] **Payload `afterChange` hook** gọi `revalidatePath` / `revalidateTag` khi publish
- [ ] Admin Payload: luôn dynamic, không cache
- [ ] Phần động (search/cá nhân hóa): SSR/RSC theo request

**DoD:** Publish trong admin → Home cập nhật **không rebuild toàn site**; draft không lộ ra public.

---

## Phase 8 — Branding Marclie CMS *[BP §4.1]*

- [ ] `src/cms/branding.ts`: `admin.meta` (title "Marclie CMS", favicon)
- [ ] Thay `admin.components.graphics.Logo` / `Icon` + CSS admin riêng
- [ ] Quy ước: **lõi Payload giữ nguyên**; custom chỉ ở `src/collections/`, `src/cms/`
- [ ] (Sau) Đóng gói custom thành **plugin nội bộ** tái dùng *[BP §4.1]*

**DoD:** Admin hiển thị brand "Marclie CMS" + logo; lõi Payload chưa bị sửa (dễ nâng cấp).

---

## Phase 9 — Animation (GSAP & three.js) *[BP §6]*

- [ ] GSAP + ScrollTrigger trong `components/animations/` (wrapper cô lập)
- [ ] three.js / R3F — **luôn lazy-load** (`next/dynamic`, `ssr:false`)
- [ ] Preset mẫu: fade-in-on-scroll, parallax, 3D hero placeholder *[BP §6]*
- [ ] Tôn trọng `prefers-reduced-motion` *[BP §6.5]*
- [ ] (Tùy chọn) **React Bits free** qua shadcn CLI — phân vai rõ với GSAP, tránh trùng hiệu ứng (Phụ lục D); **Pro hoãn** *[BP §0, §2]*

**DoD:** Bật/tắt preset không phá layout; reduced-motion giảm animation; đo Lighthouse trước ship.

---

## Phase 10 — Nội dung & các trang còn lại *(muộn — chỉ là content)* *[BP §5]*

- [ ] Tạo nội dung 4 trang: `about`, `services`, `portfolio`, `contact` (ráp từ block đã có, không code mới)
- [ ] Mở rộng seed nếu cần dữ liệu mẫu cho portfolio/blog

**DoD:** 5 trang render đầy đủ; portfolio đọc từ collection; không phát sinh block/logic mới ngoài registry.

---

## Phase 11 — File vibecode & tài liệu *[BP §6.6]*

- [ ] `CLAUDE.md` — hoàn thiện (lớn dần từ Phase 1): convention, lõi-vs-mở-rộng, brand, cách dùng shadcn/React Bits
- [ ] `AGENTS.md` — quy ước chung cho AI agent
- [ ] `CHANGELOG.md` — Keep a Changelog
- [ ] `.claude/skills/` — skill riêng (thêm block, tạo collection)
- [ ] `docs/adr/` — ghi quyết định kiến trúc (đã bắt đầu từ Phase 0)
- [ ] `README.md` (khởi động) + `SETUP.md` (checklist dự án mới) *[BP §3, §9]*
- [ ] `.env.example` *[BP §9]* + `docker-compose.yml` (**offline tùy chọn**, không phải mặc định) *[BP §9.5]*

**DoD:** Người/AI mới đọc `CLAUDE.md` + `README.md` là khởi động được.

---

## Phase 12 — CI/CD & Hosting Vercel *[BP §9, §9.5]*

- [ ] Connect repo vào Vercel
- [ ] **Neon Postgres qua Vercel Marketplace** (env tự inject, branch-per-preview) *[BP §9.5]*
- [ ] **Vercel Blob** cho media *[BP §9.5]*
- [ ] Set env production; **chạy Payload migrate khi deploy** (không auto-push trên prod)
- [ ] PR → **Vercel Preview Deploy** + **Neon DB branch** riêng *[BP §6.6]*
- [ ] Gắn domain

**DoD:** Push `main` → auto-deploy prod; PR → preview deploy + DB branch riêng; migrate chạy đúng.

---

## Phase 13 — Chất lượng trước ship *[BP §6.5, §7]*

- [ ] `design:accessibility-review` — WCAG 2.1 AA, **kiểm cả light & dark** *[BP §6.5]*
- [ ] Color contrast ≥ 4.5:1 (text thường) cả 2 theme; keyboard nav + focus rõ
- [ ] Lighthouse/perf (ngân sách cho three.js) *[BP §6, §10]*
- [ ] SEO: kiểm metadata/sitemap/OG (đã có `plugin-seo`, chỉ verify) *[BP §7]*
- [ ] Test form end-to-end
- [ ] (Tùy chọn) Vercel Analytics + **Sentry** (error ≠ analytics, không trùng — Phụ lục D) *[BP §2]*

**DoD:** A11y/SEO/perf đạt ngưỡng; form hoạt động trên prod.

---

## Phase 14 — Biến repo thành GitHub Template *[BP §8]*

- [ ] Push blueprint hoàn chỉnh → GitHub → tick **Template repository**
- [ ] Test "Use this template" → repo độc lập, không dính lịch sử gốc
- [ ] Ghi quy trình cập nhật blueprint (cherry-pick cho dự án cũ) *[BP §8]*

**DoD:** Tạo thử 1 dự án mới từ template, chạy end-to-end theo quy trình §7.

---

## Phụ lục A — Mô hình sync *[BP §9.5]*
- **Code** → git · **Schema CMS** → Payload migrations (trong git) · **Dữ liệu/nội dung** → KHÔNG qua git, mỗi môi trường DB riêng, nội dung client sống ở **DB production**.

## Phụ lục B — Chi phí FREE-FIRST *[BP §9.6]*
- Free toàn bộ lúc đầu; tối thiểu **Vercel Pro $20/tháng** (thương mại; 1 seat phủ mọi site). shadcn studio & React Bits Pro: mua-một-lần **khi cần**.

## Phụ lục C — Rủi ro theo dõi *[BP §10]*
- [ ] Tương thích version Payload ↔ Next/Tailwind v4/shadcn — khóa & test khi nâng cấp
- [ ] shadcn block / React Bits theo kịp Tailwind v4 chưa — verify khi copy từng component
- [ ] License shadcn studio nếu repo public → cân nhắc private
- [ ] Bảo trì blueprint định kỳ; performance three.js (lazy-load + ngân sách Lighthouse)

## Phụ lục D — Khử trùng tech stack *(quyết định)*
| Hạng mục | Vấn đề trùng | Quyết định |
|---|---|---|
| Forms | Hand-roll `Forms/Submissions` ↔ `plugin-form-builder` | **Bỏ hand-roll**, dùng plugin. RHF+Zod chỉ lo **render + validate** form ở frontend (không trùng) |
| DB adapter | `db-vercel-postgres` ↔ sqlite/postgres | Thống nhất **`@payloadcms/db-postgres`** (Neon) cho local + prod |
| Animation | React Bits ↔ GSAP cho hiệu ứng đơn giản | Phân vai: **GSAP = scroll/timeline**, **React Bits = drop-in wow**; cả 2 Pro hoãn |
| UI blocks | shadcn studio ↔ shadcn/ui | studio **hoãn** (chưa cài) → chưa trùng |
| Local DB | `docker-compose` ↔ Neon dev branch | Docker chỉ **offline tùy chọn**, không mặc định |
| Test | Vitest ↔ Playwright | Không trùng; site CMS ít logic → **Playwright chính**, Vitest tối giản |
| Observability | Sentry ↔ Vercel Analytics | Không trùng (error monitoring ≠ web analytics) — đều tùy chọn |

## Phụ lục E — Ghi chú Tailwind v4 *(quan trọng cho shadcn theo kịp)*
- Dùng **Tailwind v4**: `@import "tailwindcss"` thay `@tailwind base/components/utilities`.
- **Design tokens định nghĩa qua `@theme`** trong `theme.css` (CSS-first), không còn `tailwind.config.js` kiểu cũ — đây là chỗ đổi brand.
- Dark mode: khai báo `@custom-variant dark (&:is(.dark *))` + `next-themes` đặt class `.dark`.
- **shadcn/ui**: dùng CLI bản hỗ trợ **Tailwind v4 + React 19**; `components.json` trỏ đúng `theme.css`. Khi copy block shadcn/React Bits, **verify từng cái đã hỗ trợ v4** (một số còn lag) → ghi vào `CLAUDE.md`.
- Admin Payload dùng SCSS nội bộ, **độc lập Tailwind v4** → không xung đột.

## Phụ lục F — Claude skills theo phase
Gắn skill có sẵn vào đúng phase để làm nhanh & chuẩn hơn:

| Phase | Skill | Dùng để |
|---|---|---|
| 0 | `deep-research` | Check tương thích version Next 15 / React 19 / Payload 3 / Tailwind v4 trước khi khóa |
| 1, 11 | `init` | Sinh khung `CLAUDE.md` chuẩn từ codebase |
| 1, 11 | `claude-automation-recommender` | Gợi ý hook/subagent/skill/plugin nên dựng cho `.claude/skills/` (cũng là cửa khám phá marketplace) |
| 3, 5, 6, 10 | `ui-ux-pro-max` + `frontend-design` | Dựng block/theme/trang marketing — hỗ trợ thẳng React/Next/Tailwind/shadcn |
| Mọi phase code | `code-review` | Guardrail review diff (bổ trợ CI ở Phase 2) |
| DoD các phase | `verify` | Chạy app thật, xác minh thay đổi hoạt động |
| 4, 13 | `security-review` | Soát access control (public chỉ đọc published) + trước ship |
| 13 | `design:accessibility-review` | WCAG 2.1 AA, kiểm light/dark |

**Không dùng ở dự án này:** `greenshift-blocks` (WordPress/Gutenberg), `railway:use-railway` (ta đi Vercel), skill xử lý tài liệu pdf/docx/xlsx/pptx, sinh ảnh/video.

**Tooling (không phải skill) liên quan:** Figma MCP + shadcn studio Figma Kit cho design-to-code *[BP §0, §7]*.

**Khám phá thêm từ marketplace:** dùng lệnh `/plugin` hoặc chạy `claude-automation-recommender`. (`ui-ux-pro-max`, `frontend-design` vốn đến từ plugin/marketplace.)

### F.1 — Skill ngoài cần cài thêm *(rất quan trọng cho stack này)*
Cài ở **Phase 0/1** để mọi phase UI/animation về sau chuẩn ngay:

| Skill | Cài | Phase | Vì sao quan trọng |
|---|---|---|---|
| **shadcn/ui skill** | `pnpm dlx skills add shadcn/ui` | 3, 5, 6, 10 | Cả dự án dùng shadcn — skill đọc `components.json`, chạy `shadcn info --json`, bơm đúng API/component/CLI vào AI. **Nền tảng nhất.** |
| **Tailwind v4 + shadcn** (jezweb) | `openskills install jezweb/claude-skills` | 3 | Chuẩn hóa pattern 4 bước CSS-var + `@theme inline` + dark mode tự động (khớp Phụ lục E). ⚠️ Skill viết cho **Vite** → dự án Next.js dùng `@tailwindcss/postcss`, **lấy pattern CSS + template, bỏ phần Vite** (`vite.config.ts`, `@tailwindcss/vite`). |
| **GSAP skills** (official GreenSock) | `npx skills add https://github.com/greensock/gsap-skills` hoặc `/plugin marketplace add greensock/gsap-skills` | 9 | 8 skill; ưu tiên `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, **`gsap-react`** (hook `useGSAP`, xử lý SSR — quan trọng với Next.js), `gsap-performance`. |

> Ghi lệnh cài 3 skill này vào `CLAUDE.md` (Phase 1) để mọi phiên/agent sau đều có sẵn context.
