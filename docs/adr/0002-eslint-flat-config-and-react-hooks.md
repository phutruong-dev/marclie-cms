# ADR 0002 — ESLint flat config & react-hooks v6

- **Trạng thái:** Accepted
- **Ngày:** 2026-06-30
- **Liên quan:** `eslint.config.mjs`, Phase 2 (TTD)

## Bối cảnh
`pnpm lint` của template crash với lỗi `Converting circular structure to JSON` trong `@eslint/eslintrc` (FlatCompat) khi load `eslint-config-next` 16 + ESLint 9. Sau khi sửa, react-hooks v6 báo 5 error trên code template.

## Quyết định

### 1. Bỏ FlatCompat → flat config native
`eslint-config-next@16` export sẵn flat config array (`./core-web-vitals`, `./typescript`). Import thẳng và spread, **bỏ `FlatCompat`** → hết crash.

```js
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
export default [...nextCoreWebVitals, ...nextTypeScript, /* overrides */]
```

### 2. react-hooks v6 — disable theo file trên pattern cố ý
`eslint-plugin-react-hooks` v6 (React-Compiler-era) nâng 2 rule thành error trên code template:
- `react-hooks/set-state-in-effect` ×3 — `src/providers/Theme/index.tsx`, `ThemeSelector`, `src/Header/Component.client.tsx` (hydrate theme/header trong effect client-only).
- `react-hooks/refs` ×2 — `src/components/Card/index.tsx` (`card.ref`/`link.ref` từ hook `useClickableCard`).

Đây là pattern **cố ý & chạy đúng** của template Payload. **Không hạ rule toàn cục** (vẫn muốn bắt vi phạm mới ở code của ta); thay vào đó **disable theo file** (`/* eslint-disable <rule> -- lý do */`) ngay tại 4 file đó, kèm chú thích.

Lý do không chỉnh trong `eslint.config.mjs`: flat config yêu cầu plugin được khai báo trong cùng config object với rule; `eslint-plugin-react-hooks` không resolve trực tiếp (transitive của next, pnpm strict), re-register có nguy cơ "Cannot redefine plugin".

### 3. Warnings không chặn CI
`pnpm lint` còn 7 warning (unused args trong hooks/tests của template) — giữ là warning, không bật `--max-warnings 0` ở giai đoạn này.

## Hệ quả
- `pnpm lint` → 0 error, exit 0.
- Khi refactor Theme/Card về pattern React-Compiler-friendly, gỡ các `eslint-disable` tương ứng.
