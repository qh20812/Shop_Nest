# ShopNest — Kế hoạch refactor toàn bộ UI sang CSS thuần

> **Direction:** BẢNG HIỆU (signage / industrial catalog)
> **Branch:** `refactor/ui-web`
> **Trạng thái:** Phase 0 và Phase 1 hoàn tất (2026-11-22); Phase 2 chưa bắt đầu
> **Phạm vi:** toàn bộ UI React/Inertia + email template + error pages + PDF/invoice (tạo mới có điều kiện)
> **Ngoài phạm vi:** backend, route, props Inertia, nghiệp vụ, schema, seed, API

**Mục lục:** [0 Tóm tắt](#0-tóm-tắt-điều-hành) · [1 Quyết định](#1-quyết-định-đã-chốt) · [2 Hiện trạng](#2-hiện-trạng-đo-được) · [3 Direction](#3-direction-bảng-hiệu) · [4 Token](#4-hệ-thống-token) · [5 Kiến trúc code](#5-kiến-trúc-code-và-quy-ước-component) · [6 Design gate](#6-design-gate-3-skill-hợp-nhất) · [7 Lộ trình](#7-lộ-trình-12-phase) · [8 Thứ tự trang](#8-thứ-tự-trang-chi-tiết) · [9 Mapping](#9-mapping-primitive-cũ--mới) · [10 Kiểm chứng](#10-kiểm-chứng) · [11 Rủi ro](#11-rủi-ro-và-cách-giảm) · [12 Không làm](#12-việc-không-làm) · [13 Commit](#13-thứ-tự-commit-đề-xuất) · [14 Checklist](#14-phụ-lục--checklist-nhanh-cho-người-triển-khai) · [15 Nhật ký](#15-nhật-ký-cập-nhật)

---

## 0. Tóm tắt điều hành

### 0.1 Mục tiêu

1. Loại bỏ **hoàn toàn** Tailwind khỏi runtime, build và tooling.
2. Thay bằng CSS thuần có kiến trúc: token 2 tầng + primitive toàn cục + CSS Modules cho page.
3. Thống nhất 4 role (customer, seller, admin, shipper) trên **một** hệ thống thị giác duy nhất.
4. Xoá nợ kỹ thuật: `Page.css` (62 KB), `legacy-tokens.css`, `.dark`, Boxicons, `tailwind.config.ts`, `components.json`, `postcss.config.js`, shadcn alias.
5. Đưa dark mode thành hạng nhất (token override, không phải bản vá).
6. Áp bộ lọc chống "AI slop" và luật thẩm mỹ ở mọi phase, không chỉ ở trang chủ.

### 0.2 Kết quả bàn giao

| Hạng mục | Kết quả |
|---|---|
| CSS runtime | 1 entry `resources/css/app.css`, không Tailwind, không `@apply`, không `@theme` |
| Token | `--sn-*` 2 tầng, đầy đủ trong `resources/css/tokens/` |
| Component | 47 primitive toàn cục dùng class `sn-*`, variant qua `data-*` |
| Page | 78 page dùng `*.module.css`, không còn class Tailwind |
| Dark mode | `[data-theme='dark']`, đủ token, không FOUC |
| Workspace | `WorkspaceLayout` mới thay `layouts/app/AppLayout`, icon Lucide |
| Tooling | `scripts/check-tokens.mjs` viết lại thành guardrail CSS thuần |
| Docs | `DESIGN.md`, `COMPONENTS.md` viết lại; tài liệu cũ lỗi thời được xoá/archived |

### 0.3 Nguyên tắc bất biến

1. **Không đổi hợp đồng dữ liệu.** Route name, URL, props Inertia, payload, validation giữ nguyên.
2. **Không thêm tính năng.** Refactor thuần; mọi ý tưởng mới ghi vào backlog.
3. **Một nguồn màu duy nhất.** Không hex trong `.tsx`, không hex trong component CSS; chỉ trong `tokens/primitive.css`.
4. **Một accent duy nhất.** Cam đất `--sn-accent-600`. Không accent thứ hai cho role/category.
5. **Không class Tailwind mới** kể từ Phase 0. Tailwind bị đóng băng, gỡ ở Phase 11.
6. **Không inline style cho màu/khoảng cách.** Chỉ dùng inline style cho giá trị động (progress, transform theo toạ độ) qua custom property.
7. **Mỗi phase là một đơn vị merge được.** Không trộn phase, không merge khi chưa qua DoD.

### 0.4 Độ phức tạp

| Phase | Nội dung | Cỡ | File chạm |
|---|---|---:|---:|
| 0 | Baseline + đóng băng + guardrail | S | ~10 |
| 1 | Token + reset + dark mode | L | ~14 |
| 2 | 47 primitive | XL | ~60 |
| 3 | 4 shell/layout | L | ~20 |
| 4 | Storefront | L | ~35 |
| 5 | Auth | M | ~12 |
| 6 | Customer + Settings | XL | ~30 |
| 7 | Seller | L | ~20 |
| 8 | Admin | XL | ~55 |
| 9 | Shipper | S | ~4 |
| 10 | Email, error pages, PDF | M | ~12 |
| 11 | Gỡ Tailwind + dọn nợ | M | ~15 |
| 12 | QA sweep | L | toàn bộ |

### 0.5 Design read & dials

**Design read:** "Đọc đây là: marketplace đa ngành cho người mua Việt và ba vai trò vận hành, với ngôn ngữ bảng hiệu/catalogue in (nền giấy lạnh, một accent cam đất, đường kẻ thay bóng đổ), đi theo token tự dựng + CSS thuần, không Tailwind."

**Dials** (theo `design-taste-frontend`, đã hạ motion vì đây là UI giao dịch, không phải landing page):

| Khu vực | `DESIGN_VARIANCE` | `MOTION_INTENSITY` | `VISUAL_DENSITY` | Lý do |
|---|---:|---:|---:|---|
| Storefront | 8 | 5 | 4 | Catalogue bất đối xứng, ảnh dẫn dắt; motion chỉ hover/reveal |
| Auth | 6 | 4 | 3 | Split 6/6, form là trung tâm; không cần chuyển động |
| Customer account | 5 | 4 | 5 | Rail + bảng đơn; ưu tiên rõ hơn đẹp |
| Seller | 4 | 3 | 7 | Bảng, form, KPI; gần như tĩnh |
| Admin | 3 | 3 | 8 | Ledger dày nhất; không card soup, số tabular |
| Shipper | 4 | 3 | 6 | Mobile-first, tap target lớn |

Khác biệt so với baseline `8 / 6 / 4` của skill: **motion thấp hơn** vì mỗi animation phải có lý do (feedback hoặc state transition), và **density cao hơn** ở workspace vì đó là công cụ làm việc, không phải trang giới thiệu.

---

## 1. Quyết định đã chốt

| # | Quyết định | Giá trị |
|---|---|---|
| 1 | Hướng thẩm mỹ | **A — BẢNG HIỆU**, hướng mới hoàn toàn |
| 2 | Kiến trúc CSS | **Hybrid**: primitive global + CSS Modules cho page/domain layout |
| 3 | Token | **2 tầng**: primitive → semantic, prefix `--sn-` |
| 4 | Thứ tự | Nền tảng → Storefront → Auth → Customer → Seller → Admin → Shipper |
| 5 | Dark mode | **Giữ**, làm bằng token override ngay từ Phase 1 |
| 6 | Workspace cũ | **Rebuild sạch**, xoá `Page.css` + Boxicons |
| 7 | Gỡ Tailwind | **Đóng băng → gỡ ở Phase 11** |
| 8 | Dependency | Bỏ `tailwindcss`, `@tailwindcss/*`, `tailwind-merge`, `tailwindcss-animate`, `cva`, `clsx` |
| 9 | Kiểm chứng | `build` + `types` + `lint` + `check:tokens` + review thủ công |
| 10 | Quyền thay đổi | Toàn quyền bố cục, section, nhãn điều hướng, copy tiếng Việt trong UI |
| 11 | Phạm vi file | React UI + email + error pages + PDF (tạo mới nếu bật) |

---

## 2. Hiện trạng đo được

### 2.1 Số liệu

| Chỉ số | Giá trị |
|---|---:|
| File page | 79 (78 component + 1 `types.ts`) |
| File component | 139 |
| Primitive `components/ui` | 47 |
| Chỗ dùng `className=` | 2.096 |
| File import `Page.css` | 41 |
| `Page.css` | 62.838 bytes |
| `legacy-tokens.css` | 4.455 bytes |
| `tokens.css` (Tailwind `@theme`) | 5.042 bytes |
| Page file lớn nhất | `Seller/Promotions/Create.tsx` (82 chỗ `className`) |

### 2.2 Hai hệ thống song song

| Khu vực | Layout | CSS | Font | Icon | Palette |
|---|---|---|---|---|---|
| Storefront/Auth/Account/Chat | `StorefrontLayout`, `AuthLayout`, `AccountLayout` | Tailwind + `tokens.css` | Be Vietnam Pro | Lucide | Rice paper + lacquer red |
| Seller/Admin (Shipper hiện là stub) | `layouts/app/AppLayout` | `Page.css` + `legacy-tokens.css` | Be Vietnam Pro | Boxicons | `#1976d2`, `#9c27b0`, `#ff9800` |

Đây là nguyên nhân gốc khiến giao diện "không đúng ý": hai ngôn ngữ thị giác, hai bảng màu, hai thang mật độ, hai bộ icon.

### 2.3 Nợ kỹ thuật cụ thể

| File / nhóm | Vấn đề | Xử lý |
|---|---|---|
| `resources/css/Page.css` | `:root` riêng, `* { margin:0; padding:0 }` toàn cục, palette xanh/tím/cam, `.bx` 1.7rem | Xoá Phase 11 |
| `resources/css/legacy-tokens.css` | Alias shadcn trên palette `#2563eb`/`#cf52d0`, `.dark` | Xoá Phase 11 |
| `resources/css/tokens.css` | Token khai trong `@theme` (Tailwind-specific) | Giữ đến Phase 11 |
| `resources/css/base.css` | Dùng `@apply` | Giữ đến Phase 11, thay bằng `base/` |
| `tailwind.config.ts` | Không được load nhưng gây hiểu nhầm | Xoá Phase 11 |
| `components.json` | Trỏ `tailwind.config.js` không tồn tại | Xoá Phase 11 |
| `postcss.config.js` | Chỉ có plugin Tailwind | Xoá Phase 11 |
| `.prettierrc` | `prettier-plugin-tailwindcss`, `tailwindStylesheet` | Sửa Phase 11 |
| `eslint.config.js` | Ignore `tailwind.config.js` | Sửa Phase 11 |
| `scripts/check-tokens.mjs` | Regex token + allowlist file-level | Viết lại Phase 0, giữ ratchet |
| `scripts/token-allowlist.json` | 65 file trước Phase 0; 187 sau baseline; **186 sau Phase 1** | Giữ làm ratchet đến Phase 11 |
| `app.blade.php` | `class="font-sans antialiased"`, Boxicons CDN, Google Fonts link weight 300–800 | Self-host font + sửa Phase 1, bỏ Boxicons Phase 11 |
| `app.css` | `@import 'tailwindcss'`, `@custom-variant`, `@source` | Sửa Phase 1 |
| `DESIGN-02.md` | Fraunces + JetBrains Mono (trái quyết định) | Xoá/archived Phase 11 |
| `STITCH-DESIGN.md` | 11.325 dòng HTML dùng Tailwind CDN | Archived Phase 11 |
| `PROMPT.md`, `PLAN.md` | Kế hoạch Nếp cũ | Archived Phase 11 |
| `useTheme.ts` | Dùng `.dark` class | Sửa Phase 1 |
| `AppLayout.tsx` | Sidebar Boxicons hardcode | Thay Phase 3 |

### 2.4 Trang thiếu (backlog, không tạo trong refactor)

`Admin/CustomerSegments/*` (4), `Admin/Inventory/Report`, `Admin/Orders/Show`, `Admin/Returns/Show`, `Seller/Promotions/Edit|Show`, `Seller/Reports/*` (2), `Seller/Wallet/*` (3), `Product/Index|Show` (2), `Auth/ConfirmPassword` — **17 render target**.

Các `Inertia::render` này đang trỏ file không tồn tại. **Không sửa trong refactor UI**; ghi nhận để không bị hiểu là regression.

---

## 3. Direction: BẢNG HIỆU

### 3.1 Ý tưởng

ShopNest là chợ đa ngành, người bán được kiểm duyệt. Giao diện đọc như **bảng hiệu và catalogue in**: nền giấy lạnh, chữ mực gần đen, một mảng cam đất duy nhất, đường kẻ rõ, số liệu thẳng cột. Storefront là catalogue có nhịp; workspace là bảng vận hành, dày nhưng không rối.

Từ khoá: **rõ, rắn, thẳng, đáng tin, không trang trí thừa**.

### 3.2 Sáu nguyên tắc thị giác

1. **Đường kẻ thay bóng đổ.** Phân cấp bằng border, khoảng trắng và cỡ chữ. Shadow chỉ dùng cho overlay (dialog, popover, toast).
2. **Một accent.** Cam đất chỉ xuất hiện ở CTA chính, link, active state, focus ring. Không tô màu category, không tô màu role.
3. **Số phải thẳng.** Mọi giá, tồn kho, mã đơn, KPI dùng `font-variant-numeric: tabular-nums` và căn phải trong bảng.
4. **Nhãn nhỏ in hoa.** Metadata dùng 11 px, `letter-spacing: 0.1em`, uppercase; không dùng cho câu dài.
5. **Bo góc nhỏ.** 4 px cho control, 8 px cho surface. Không 20 px, không pill tràn lan (pill chỉ cho badge trạng thái và avatar).
6. **Không chuyển động trang trí.** Chỉ hover/focus/press và skeleton. Không parallax, không auto-carousel, không pulse vô hạn trên status dot.

### 3.3 Tư thế theo khu vực

| Khu vực | Grid | Mật độ | Nhịp dọc | Đặc trưng |
|---|---|---|---|---|
| Storefront | 12 cột, hero 7/5, shelf 4-up | Thoáng vừa | `--sn-section` | Catalogue in, tiêu đề lớn, ảnh 4:5, metadata 1 dòng |
| Auth | 6/6 split, form 420 px | Thoáng | 32 px | Không card giữa màn hình; panel trái là brand ledger |
| Customer account | 220 px rail + content | Vừa | 24–32 px | Bảng đơn, timeline, form dọc |
| Seller | 232 px sidebar | Dày | 20–24 px | KPI strip, bảng, form 2 cột |
| Admin | 232 px sidebar | Dày nhất | 16–20 px | Bảng ledger, filter bar, bulk action |
| Shipper | 232 px sidebar | Vừa | 20 px | Shell + empty state; danh sách chuyến chỉ khi backend có dữ liệu, tap target 44 px |

### 3.4 Anatomy component

| Component | Đặc tả |
|---|---|
| Button | Cao 32/40/48; padding ngang 12/16/20; radius 4 px (sm) / 6 px (md, lg); border 1 px; weight 500; icon 16/20 |
| Button primary | Fill `--sn-color-accent`, chữ `--sn-color-on-accent`, hover `--sn-color-accent-hover`, active `translateY(1px)` |
| Button secondary | Nền surface, border `--sn-color-border-strong`, chữ ink, hover `--sn-color-surface-sunken` |
| Button ghost | Không border, hover `--sn-color-surface-sunken` |
| Button tertiary | Chữ accent, gạch chân 1 px offset 3 px |
| Button destructive | Fill `--sn-color-danger`, chữ `--sn-color-on-danger` |
| Input | Cao 40; radius 6; border 1 px `--sn-color-border-strong`; nền surface; focus ring 2 px accent offset 2 |
| Label | 12 px, weight 500, margin-bottom 6 px; helper 12 px muted; error 12 px danger-text |
| Card | Nền surface, border 1 px `--sn-color-border`, radius 8, padding 16/20; **không shadow** |
| Table | Header 11 px uppercase, row 48 px, divider 1 px, hover `--sn-color-surface-sunken`; số căn phải |
| Badge | Cao 20/22, radius pill, padding 4/8, 12 px weight 500, nền wash + chữ text tương ứng |
| Dialog | Nền surface, radius 12, border 1, shadow overlay, max-width 480/640 |
| Toast | Radius 8, border-left 3 px theo tone, shadow popover, không glow |
| Tabs | Gạch chân 2 px accent cho active, không pill |
| Pagination | Nút 32 px vuông, số hiện tại fill ink, không dãy số dài |
| Skeleton | Nền `--sn-color-surface-sunken`, shimmer 1.4 s, đúng kích thước thật |
| Empty state | 1 dòng giải thích + 1 action, không minh hoạ vector tự vẽ |
| Chart | Lưới 1 px `--sn-color-border`, series accent + success + warning, không gradient |

### 3.5 Icon và ảnh

- **Lucide only**, stroke 1.75, size 14/16/20/24. Xoá Boxicons khỏi `app.blade.php` ở Phase 11.
- Ảnh sản phẩm 4:5, radius 2 px, `object-fit: cover`. Không overlay card lên ảnh.
- Logo giữ nguyên `public/image/ShopnestLogoSVG.svg`, không đổi màu.
- Không icon tự vẽ SVG, không emoji trong UI/alt/filename.

### 3.6 Copy

- Tiếng Việt, xưng "Bạn" với khách; workspace trung tính.
- Câu ngắn, danh từ cụ thể, không dấu chấm than trong giao dịch.
- Cấm: "Nâng tầm", "Liền mạch", "Bứt phá", "Thế hệ mới", "Khám phá ngay", "Không chỉ là… mà còn…".
- Giá: `1.290.000 ₫`. Ngày: `12/11/2026`. Giờ 24h: `14:30`. Mã đơn: `#SN-24817`.
- **Không em-dash (`—`) và không en-dash (`–`) trong copy hiển thị.** Dùng hyphen thường `-`. Áp cho heading, nhãn, badge, body, caption, alt text, button. (Dấu `…` chỉ dùng khi thật sự cần rút gọn, không dùng làm nhịp câu.)
- **Không số liệu giả chính xác.** Chỉ dùng số thật từ props/DB; nếu là dữ liệu mẫu phải ghi rõ trong code comment, không đưa lên UI như số thật.
- **Không nhãn trang trí:** không `01 / 02 / 03`, không `PHẦN 1`, không `No. 01`, không `Scroll to explore`, không `v0.6 / BETA`, không strip thành phố/thời tiết, không credit ảnh giả.
- **Không pill/tag phủ lên ảnh.** Caption (nếu có) nằm dưới ảnh.
- **Một CTA một ý.** Không dùng đồng thời "Liên hệ" + "Gọi cho chúng tôi" + "Bắt đầu" cho cùng một hành động.
- **Một giọng duy nhất mỗi trang.** Không trộn giọng kỹ thuật, giọng quảng cáo và giọng biên tập trong cùng một màn.

---

## 4. Hệ thống token

### 4.1 Quy tắc

1. Prefix `--sn-` để cùng tồn tại với `Page.css`/`legacy-tokens` trong giai đoạn chuyển đổi.
2. **Primitive** chỉ định nghĩa trong `tokens/primitive.css`. **Semantic** trong `tokens/semantic.css`. **Scale** (type/space/size/radius/shadow/motion/z) trong `tokens/scale.css`.
3. Component **chỉ** dùng semantic + scale. Không dùng primitive trực tiếp, trừ khi viết chính file token.
4. Không hex trong `resources/js/**`, không hex trong `components/*.css`, không `rgb()` rời.
5. Không đặt token theo tên component (`--sn-button-bg` là sai). Đặt theo vai trò (`--sn-color-accent`).
6. Mọi token phải có mặt trong cả light và dark, trừ token hình học.
7. **Surface trắng `#ffffff` chỉ dùng cho card/sheet trên nền `#f2f2ee`**, không dùng làm nền trang. Dark mode không dùng `#000` cho surface; chỉ dùng đen trong shadow/overlay.
8. **Accent `#c2410c` có saturation ~87%**, cao hơn mặc định 80% của skill. Chấp nhận có chủ đích: đây là fill đặc duy nhất, không glow, không gradient, contrast với trắng 5,2:1. Không thêm accent thứ hai để "cân bằng".

### 4.2 `tokens/primitive.css` — bảng màu gốc

```css
:root {
    /* Neutral — giấy lạnh, dùng cho light mode */
    --sn-neutral-0: #ffffff;
    --sn-neutral-25: #fcfcfa;
    --sn-neutral-50: #f7f7f4;
    --sn-neutral-100: #f2f2ee;
    --sn-neutral-150: #ecece7;
    --sn-neutral-200: #e3e3dd;
    --sn-neutral-300: #d2d2ca;
    --sn-neutral-400: #a9aaa0;
    --sn-neutral-500: #8e9086;
    --sn-neutral-600: #6b6e62;
    --sn-neutral-700: #53564b;
    --sn-neutral-800: #3a3d34;
    --sn-neutral-900: #262923;
    --sn-neutral-950: #15160f;
    --sn-neutral-1000: #0b0c0a;

    /* Graphite — than, dùng cho dark mode */
    --sn-graphite-50: #f1f2ea;
    --sn-graphite-100: #d6d9cf;
    --sn-graphite-200: #b4b8aa;
    --sn-graphite-300: #8d9184;
    --sn-graphite-350: #6e7466;
    --sn-graphite-400: #5a5f54;
    --sn-graphite-500: #3a4036;
    --sn-graphite-600: #2b3028;
    --sn-graphite-700: #242922;
    --sn-graphite-800: #1c201a;
    --sn-graphite-850: #151814;
    --sn-graphite-900: #101210;
    --sn-graphite-950: #0d0f0c;

    /* Accent — cam đất (bảng hiệu) */
    --sn-accent-50: #fdf1ec;
    --sn-accent-100: #fae0d5;
    --sn-accent-200: #f4c2ae;
    --sn-accent-300: #ec9d7f;
    --sn-accent-400: #e1744e;
    --sn-accent-500: #d0552b;
    --sn-accent-600: #c2410c;
    --sn-accent-700: #9a3208;
    --sn-accent-800: #7a2a0b;
    --sn-accent-900: #61240c;

    /* Success — xanh rêu */
    --sn-success-50: #e9f4ee;
    --sn-success-100: #d2e9dd;
    --sn-success-200: #a6d3bd;
    --sn-success-300: #6fb596;
    --sn-success-400: #3f9573;
    --sn-success-500: #1f6f4a;
    --sn-success-600: #1a5c3d;
    --sn-success-700: #154a32;
    --sn-success-800: #103a27;

    /* Warning — hổ phách tối */
    --sn-warning-50: #fbf2de;
    --sn-warning-100: #f6e3bb;
    --sn-warning-200: #ecc97f;
    --sn-warning-300: #dca93f;
    --sn-warning-400: #bc8a12;
    --sn-warning-500: #9a6200;
    --sn-warning-600: #7a4e00;
    --sn-warning-700: #5e3c00;

    /* Danger — đỏ gạch */
    --sn-danger-50: #fbeae8;
    --sn-danger-100: #f7d2ce;
    --sn-danger-200: #eea7a0;
    --sn-danger-300: #e0786e;
    --sn-danger-400: #cd4a3f;
    --sn-danger-500: #b3261e;
    --sn-danger-600: #8c1d18;
    --sn-danger-700: #711713;

    /* Dark-mode signal (đủ tương phản trên nền than) */
    --sn-signal-success: #5fc79b;
    --sn-signal-warning: #f0b44c;
    --sn-signal-danger: #f08a80;
    --sn-signal-accent: #ff8a5b;
    --sn-signal-accent-hover: #ffa277;
}
```

### 4.3 `tokens/semantic.css` — light mode

```css
:root,
[data-theme='light'] {
    color-scheme: light;

    /* Surface */
    --sn-color-canvas: var(--sn-neutral-100);          /* #f2f2ee */
    --sn-color-canvas-alt: var(--sn-neutral-50);       /* #f7f7f4 */
    --sn-color-surface: var(--sn-neutral-0);           /* #ffffff */
    --sn-color-surface-sunken: var(--sn-neutral-150);  /* #ecece7 */
    --sn-color-surface-strong: var(--sn-neutral-900);  /* #262923 */
    --sn-color-surface-inverse: var(--sn-neutral-950);

    /* Text */
    --sn-color-text: var(--sn-neutral-950);            /* #15160f */
    --sn-color-text-muted: var(--sn-neutral-700);      /* #53564b */
    --sn-color-text-faint: var(--sn-neutral-600);      /* #6b6e62 */
    --sn-color-text-inverse: var(--sn-neutral-25);     /* #fcfcfa */
    --sn-color-text-on-strong: var(--sn-neutral-25);

    /* Line */
    --sn-color-border: var(--sn-neutral-300);          /* #d2d2ca */
    --sn-color-border-strong: var(--sn-neutral-500);   /* #8e9086 */
    --sn-color-border-inverse: var(--sn-neutral-700);

    /* Accent */
    --sn-color-accent: var(--sn-accent-600);           /* #c2410c */
    --sn-color-accent-hover: var(--sn-accent-700);     /* #9a3208 */
    --sn-color-accent-text: var(--sn-accent-700);      /* #9a3208 */
    --sn-color-accent-wash: var(--sn-accent-50);       /* #fdf1ec */
    --sn-color-on-accent: var(--sn-neutral-0);         /* #ffffff */
    --sn-color-focus: var(--sn-accent-600);

    /* Success */
    --sn-color-success: var(--sn-success-500);         /* #1f6f4a */
    --sn-color-success-text: var(--sn-success-700);    /* #154a32 */
    --sn-color-success-wash: var(--sn-success-50);     /* #e9f4ee */
    --sn-color-on-success: var(--sn-neutral-0);

    /* Warning */
    --sn-color-warning: var(--sn-warning-500);         /* #9a6200 */
    --sn-color-warning-text: var(--sn-warning-600);    /* #7a4e00 */
    --sn-color-warning-wash: var(--sn-warning-50);     /* #fbf2de */
    --sn-color-on-warning: var(--sn-neutral-0);

    /* Danger */
    --sn-color-danger: var(--sn-danger-500);           /* #b3261e */
    --sn-color-danger-text: var(--sn-danger-600);      /* #8c1d18 */
    --sn-color-danger-wash: var(--sn-danger-50);       /* #fbeae8 */
    --sn-color-on-danger: var(--sn-neutral-0);

    /* Neutral badge */
    --sn-color-neutral: var(--sn-neutral-700);
    --sn-color-neutral-text: var(--sn-neutral-800);
    --sn-color-neutral-wash: var(--sn-neutral-150);

    /* Utility */
    --sn-color-overlay: rgb(21 22 15 / 0.52);
    --sn-color-selection: var(--sn-accent-100);
    --sn-color-scrim: rgb(21 22 15 / 0.08);
}
```

**Kiểm tra tương phản light (WCAG 2.2):**

| Cặp | Tỷ lệ | Kết luận |
|---|---:|---|
| `text` on `canvas` (`#15160f` / `#f2f2ee`) | 16,2:1 | AAA |
| `text-muted` on `canvas` (`#53564b` / `#f2f2ee`) | 6,7:1 | AA |
| `text-faint` on `canvas` (`#6b6e62` / `#f2f2ee`) | 4,6:1 | AA |
| `on-accent` on `accent` (`#ffffff` / `#c2410c`) | 5,2:1 | AA |
| `accent-text` on `canvas` (`#9a3208` / `#f2f2ee`) | 6,6:1 | AA |
| `on-success` on `success` (`#ffffff` / `#1f6f4a`) | 6,1:1 | AA |
| `on-warning` on `warning` (`#ffffff` / `#9a6200`) | 5,1:1 | AA |
| `on-danger` on `danger` (`#ffffff` / `#b3261e`) | 6,6:1 | AA |
| `border-strong` / `surface` (`#8e9086` / `#ffffff`) | 3,2:1 | AA (UI) |

### 4.4 `tokens/semantic.css` — dark mode

```css
[data-theme='dark'] {
    color-scheme: dark;

    /* Surface */
    --sn-color-canvas: var(--sn-graphite-950);         /* #0d0f0c */
    --sn-color-canvas-alt: var(--sn-graphite-900);     /* #101210 */
    --sn-color-surface: var(--sn-graphite-850);        /* #151814 */
    --sn-color-surface-sunken: var(--sn-graphite-900); /* #101210 */
    --sn-color-surface-strong: var(--sn-graphite-50);  /* #f1f2ea */
    --sn-color-surface-inverse: var(--sn-graphite-50);

    /* Text */
    --sn-color-text: var(--sn-graphite-50);            /* #f1f2ea */
    --sn-color-text-muted: var(--sn-graphite-200);     /* #b4b8aa */
    --sn-color-text-faint: var(--sn-graphite-300);     /* #8d9184 */
    --sn-color-text-inverse: var(--sn-graphite-950);
    --sn-color-text-on-strong: var(--sn-graphite-950);

    /* Line */
    --sn-color-border: var(--sn-graphite-600);         /* #2b3028 */
    --sn-color-border-strong: var(--sn-graphite-350);  /* #6e7466 */
    --sn-color-border-inverse: var(--sn-graphite-300);

    /* Accent */
    --sn-color-accent: var(--sn-signal-accent);        /* #ff8a5b */
    --sn-color-accent-hover: var(--sn-signal-accent-hover); /* #ffa277 */
    --sn-color-accent-text: var(--sn-signal-accent);   /* #ff8a5b */
    --sn-color-accent-wash: #3a241c;
    --sn-color-on-accent: #1a0e08;
    --sn-color-focus: var(--sn-signal-accent);

    /* Success */
    --sn-color-success: #3aa87a;
    --sn-color-success-text: var(--sn-signal-success);
    --sn-color-success-wash: #12291f;
    --sn-color-on-success: #07150f;

    /* Warning */
    --sn-color-warning: #b07416;
    --sn-color-warning-text: var(--sn-signal-warning);
    --sn-color-warning-wash: #2e2413;
    --sn-color-on-warning: #1a1205;

    /* Danger */
    --sn-color-danger: #e05a50;
    --sn-color-danger-text: var(--sn-signal-danger);
    --sn-color-danger-wash: #2e1714;
    --sn-color-on-danger: #1a0a08;

    /* Neutral badge */
    --sn-color-neutral: var(--sn-graphite-300);
    --sn-color-neutral-text: var(--sn-graphite-200);
    --sn-color-neutral-wash: var(--sn-graphite-700);

    /* Utility */
    --sn-color-overlay: rgb(0 0 0 / 0.66);
    --sn-color-selection: #4a2a1e;
    --sn-color-scrim: rgb(0 0 0 / 0.32);
}

/* Fallback khi chưa có JS: theo hệ điều hành */
@media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
        color-scheme: dark;
        --sn-color-canvas: var(--sn-graphite-950);
        --sn-color-canvas-alt: var(--sn-graphite-900);
        --sn-color-surface: var(--sn-graphite-850);
        --sn-color-surface-sunken: var(--sn-graphite-900);
        --sn-color-surface-strong: var(--sn-graphite-50);
        --sn-color-surface-inverse: var(--sn-graphite-50);
        --sn-color-text: var(--sn-graphite-50);
        --sn-color-text-muted: var(--sn-graphite-200);
        --sn-color-text-faint: var(--sn-graphite-300);
        --sn-color-text-inverse: var(--sn-graphite-950);
        --sn-color-text-on-strong: var(--sn-graphite-950);
        --sn-color-border: var(--sn-graphite-600);
        --sn-color-border-strong: var(--sn-graphite-350);
        --sn-color-border-inverse: var(--sn-graphite-300);
        --sn-color-accent: var(--sn-signal-accent);
        --sn-color-accent-hover: var(--sn-signal-accent-hover);
        --sn-color-accent-text: var(--sn-signal-accent);
        --sn-color-accent-wash: #3a241c;
        --sn-color-on-accent: #1a0e08;
        --sn-color-focus: var(--sn-signal-accent);
        --sn-color-success: #3aa87a;
        --sn-color-success-text: var(--sn-signal-success);
        --sn-color-success-wash: #12291f;
        --sn-color-on-success: #07150f;
        --sn-color-warning: #b07416;
        --sn-color-warning-text: var(--sn-signal-warning);
        --sn-color-warning-wash: #2e2413;
        --sn-color-on-warning: #1a1205;
        --sn-color-danger: #e05a50;
        --sn-color-danger-text: var(--sn-signal-danger);
        --sn-color-danger-wash: #2e1714;
        --sn-color-on-danger: #1a0a08;
        --sn-color-neutral: var(--sn-graphite-300);
        --sn-color-neutral-text: var(--sn-graphite-200);
        --sn-color-neutral-wash: var(--sn-graphite-700);
        --sn-color-overlay: rgb(0 0 0 / 0.66);
        --sn-color-selection: #4a2a1e;
        --sn-color-scrim: rgb(0 0 0 / 0.32);
    }
}
```

**Kiểm tra tương phản dark:**

| Cặp | Tỷ lệ | Kết luận |
|---|---:|---|
| `text` on `canvas` (`#f1f2ea` / `#0d0f0c`) | 17,1:1 | AAA |
| `text-muted` on `canvas` (`#b4b8aa` / `#0d0f0c`) | 9,5:1 | AAA |
| `text-faint` on `surface` (`#8d9184` / `#151814`) | 5,6:1 | AA |
| `accent` on `canvas` (`#ff8a5b` / `#0d0f0c`) | 8,3:1 | AAA |
| `on-accent` on `accent` (`#1a0e08` / `#ff8a5b`) | 8,1:1 | AAA |
| `success-text` on `success-wash` (`#5fc79b` / `#12291f`) | 7,6:1 | AAA |
| `warning-text` on `warning-wash` (`#f0b44c` / `#2e2413`) | 7,4:1 | AAA |
| `danger-text` on `danger-wash` (`#f08a80` / `#2e1714`) | 5,9:1 | AA |
| `border-strong` / `surface` (`#6e7466` / `#151814`) | 3,6:1 | AA (UI) |

### 4.5 `tokens/scale.css` — typography

```css
:root {
    /* Family — Be Vietnam Pro là duy nhất, self-host woff2 (xem Phase 1) */
    --sn-font-sans: 'Be Vietnam Pro', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    --sn-font-numeric: var(--sn-font-sans);

    /* Weight */
    --sn-weight-regular: 400;
    --sn-weight-medium: 500;
    --sn-weight-semibold: 600;
    --sn-weight-bold: 700;

    /* Size */
    --sn-text-2xs: 0.6875rem;   /* 11px — nhãn in hoa */
    --sn-text-xs: 0.75rem;      /* 12px — metadata, helper */
    --sn-text-sm: 0.8125rem;    /* 13px — bảng dày */
    --sn-text-base: 0.9375rem;  /* 15px — body UI */
    --sn-text-md: 1rem;         /* 16px — body đọc */
    --sn-text-lg: 1.125rem;     /* 18px — lead */
    --sn-text-xl: 1.375rem;     /* 22px — H3 */
    --sn-text-2xl: 1.75rem;     /* 28px — H2 */
    --sn-text-3xl: 2.25rem;     /* 36px — H1 */
    --sn-text-4xl: clamp(2.75rem, 3.5vw, 3.5rem);   /* 44–56px — page display */
    --sn-text-display: clamp(3rem, 5.5vw, 4.75rem); /* 48–76px — hero only */

    /* Line height */
    --sn-leading-none: 1;
    --sn-leading-tight: 1.08;
    --sn-leading-snug: 1.22;
    --sn-leading-normal: 1.5;
    --sn-leading-relaxed: 1.65;

    /* Tracking */
    --sn-tracking-tight: -0.02em;
    --sn-tracking-snug: -0.01em;
    --sn-tracking-normal: 0;
    --sn-tracking-wide: 0.06em;
    --sn-tracking-wider: 0.1em;

    /* Measure */
    --sn-measure-prose: 65ch;
    --sn-measure-lead: 46ch;
}
```

### 4.6 `tokens/scale.css` — spacing và kích thước

```css
:root {
    /* Spacing — cơ số 4px */
    --sn-space-0: 0;
    --sn-space-1: 0.25rem;  /* 4 */
    --sn-space-2: 0.5rem;   /* 8 */
    --sn-space-3: 0.75rem;  /* 12 */
    --sn-space-4: 1rem;     /* 16 */
    --sn-space-5: 1.25rem;  /* 20 */
    --sn-space-6: 1.5rem;   /* 24 */
    --sn-space-7: 1.75rem;  /* 28 */
    --sn-space-8: 2rem;     /* 32 */
    --sn-space-10: 2.5rem;  /* 40 */
    --sn-space-12: 3rem;    /* 48 */
    --sn-space-14: 3.5rem;  /* 56 */
    --sn-space-16: 4rem;    /* 64 */
    --sn-space-20: 5rem;    /* 80 */
    --sn-space-24: 6rem;    /* 96 */
    --sn-space-32: 8rem;    /* 128 */

    /* Rhythm */
    --sn-gutter: clamp(1rem, 2.5vw, 2rem);        /* 16–32 */
    --sn-section: clamp(2.5rem, 5vw, 4.5rem);     /* 40–72 */
    --sn-section-tight: clamp(1.5rem, 3vw, 2.5rem);
    --sn-container: 90rem;          /* 1440 */
    --sn-container-narrow: 65rem;   /* 1040 */
    --sn-container-form: 26.25rem;  /* 420 */

    /* Control */
    --sn-control-sm: 2rem;      /* 32 */
    --sn-control-md: 2.5rem;    /* 40 */
    --sn-control-lg: 3rem;      /* 48 */
    --sn-tap: 2.75rem;          /* 44 — touch target tối thiểu */

    /* Icon */
    --sn-icon-xs: 0.875rem;     /* 14 */
    --sn-icon-sm: 1rem;         /* 16 */
    --sn-icon-md: 1.25rem;      /* 20 */
    --sn-icon-lg: 1.5rem;       /* 24 */

    /* Shell */
    --sn-header: 3.5rem;        /* 56 */
    --sn-topbar: 3.5rem;
    --sn-sidebar: 14.5rem;      /* 232 */
    --sn-account-rail: 13.75rem;/* 220 */
    --sn-filter-rail: 16.5rem;  /* 264 */

    /* Chat */
    --sn-chat-launcher: 3.5rem;
    --sn-chat-panel: 23.75rem;  /* 380 */
    --sn-chat-panel-height: min(40rem, calc(100dvh - 3rem));
    --sn-chat-sheet-height: 85dvh;

    /* Avatar */
    --sn-avatar-sm: 1.75rem;    /* 28 */
    --sn-avatar-md: 2.25rem;    /* 36 */
    --sn-avatar-lg: 3rem;       /* 48 */
}
```

### 4.7 `tokens/scale.css` — radius, shadow, motion, z-index

```css
:root {
    /* Radius — nhỏ, đều */
    --sn-radius-none: 0;
    --sn-radius-xs: 0.125rem;   /* 2 — ảnh, media */
    --sn-radius-sm: 0.25rem;    /* 4 — control nhỏ, badge vuông */
    --sn-radius-md: 0.375rem;   /* 6 — input, button */
    --sn-radius-lg: 0.5rem;     /* 8 — card, toast */
    --sn-radius-xl: 0.75rem;    /* 12 — dialog, sheet */
    --sn-radius-pill: 9999px;

    /* Shadow — chỉ cho lớp nổi */
    --sn-shadow-popover: 0 10px 30px -18px rgb(21 22 15 / 0.28);
    --sn-shadow-overlay: 0 24px 64px -32px rgb(21 22 15 / 0.42);

    /* Motion */
    --sn-dur-instant: 90ms;
    --sn-dur-fast: 150ms;
    --sn-dur-base: 180ms;
    --sn-dur-slow: 240ms;
    --sn-dur-reveal: 320ms;
    --sn-ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --sn-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --sn-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
    --sn-stagger: 40ms;

    /* Z-index */
    --sn-z-base: 0;
    --sn-z-raised: 10;
    --sn-z-sticky: 20;
    --sn-z-header: 30;
    --sn-z-dropdown: 40;
    --sn-z-chat: 45;
    --sn-z-overlay: 50;
    --sn-z-modal: 60;
    --sn-z-toast: 70;
    --sn-z-tooltip: 80;
}

[data-theme='dark'] {
    --sn-shadow-popover: 0 10px 30px -18px rgb(0 0 0 / 0.6);
    --sn-shadow-overlay: 0 24px 64px -32px rgb(0 0 0 / 0.75);
}
```

### 4.8 Breakpoints

CSS custom property không dùng được trong `@media`, nên breakpoint là hằng số ghi trong tài liệu và dùng literal:

| Tên | Giá trị | Dùng cho |
|---|---:|---|
| `xs` | 480px | điện thoại lớn |
| `sm` | 768px | tablet dọc, ranh giới 1 cột |
| `md` | 1024px | tablet ngang, sidebar mở |
| `lg` | 1280px | desktop |
| `xl` | 1440px | container tối đa |

Quy ước mobile-first: viết mặc định cho 375, thêm `@media (min-width: …)`.

### 4.9 Dark mode mechanics

- `<html data-theme="light|dark">`; `data-theme` do JS resolve từ `localStorage('theme')` (`light|dark|system`) + `prefers-color-scheme`.
- **Mirror `.dark` trong giai đoạn chuyển đổi:** Phase 1–10 vẫn set thêm class `.dark` trên `<html>` để `Page.css` (`html.dark`, `body.dark`), `base.css` (`.dark body`) và `legacy-tokens.css` (`.dark`) tiếp tục hoạt động. Phase 11 xoá mirror cùng toàn bộ `.dark` selectors.
- Inline script trong `<head>` của `app.blade.php` để set trước paint, tránh FOUC:

```html
<script>
    (function () {
        try {
            var saved = localStorage.getItem('theme') || 'system';
            var dark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            var root = document.documentElement;
            root.dataset.theme = dark ? 'dark' : 'light';
            root.classList.toggle('dark', dark);
            root.style.colorScheme = dark ? 'dark' : 'light';
        } catch (error) {
            document.documentElement.dataset.theme = 'light';
        }
    })();
</script>
```

- Script phải nằm **trước** `@vite` và trước mọi stylesheet trong `<head>`.
- `useTheme.ts` đổi sang `data-theme` **và** giữ mirror:
  - `root.dataset.theme = isDark ? 'dark' : 'light'`
  - `root.classList.toggle('dark', isDark)`
  - `root.style.colorScheme = isDark ? 'dark' : 'light'` (nếu không, inline `color-scheme` từ script sẽ thắng CSS `[data-theme='dark']`).
  - Giữ API `theme / resolvedTheme / changeTheme`.
  - **SSR-safe:** `config/inertia.php` đang bật SSR; không đọc `localStorage` khi `typeof window === 'undefined'`, và bọc try/catch.
- `Settings/Appearance` giữ 3 lựa chọn; lưu localStorage. Nếu backend đã có cột appearance thì đồng bộ thêm, nhưng **không** đổi schema trong refactor.
- `HandleAppearance` đọc cookie `appearance`, nhưng hiện **không có nơi nào set cookie này**; `$appearance` luôn là `system`. Phase 1 bỏ `@class` trên `<html>` và để inline script set cả `data-theme` lẫn `.dark`; middleware giữ nguyên.
- Không dùng `@media (prefers-color-scheme)` trong component; chỉ fallback ở token.

### 4.10 File CSS

```
resources/css/
├── app.css                     # entry: layer order + import
├── fonts.css                   # @font-face self-host Be Vietnam Pro
├── tokens/
│   ├── primitive.css           # màu gốc
│   ├── semantic.css            # light + dark + fallback
│   └── scale.css               # type, space, size, radius, shadow, motion, z
├── base/
│   ├── reset.css
│   ├── typography.css
│   ├── forms.css
│   └── a11y.css
├── components/                 # global primitive, @layer sn-components
│   ├── button.css
│   ├── field.css               # input, textarea, select, checkbox, radio, switch
│   ├── card.css
│   ├── badge.css
│   ├── table.css
│   ├── tabs.css
│   ├── dialog.css
│   ├── menu.css                # dropdown, select popover
│   ├── toast.css
│   ├── alert.css
│   ├── pagination.css
│   ├── skeleton.css
│   ├── breadcrumbs.css
│   ├── avatar.css
│   ├── progress.css
│   ├── tooltip.css
│   └── file-dropzone.css
├── layouts/
│   ├── storefront.css
│   ├── auth.css
│   ├── account.css
│   └── workspace.css
└── utilities.css               # .sn-container, .sn-numeric, .sn-visually-hidden, .sn-stack
```

`app.css`:

```css
@layer sn-reset, sn-base, sn-components, sn-layouts, sn-utilities;

@import 'tailwindcss';
@import './legacy-tokens.css';
@import './tokens.css';
@import './tokens/primitive.css';
@import './tokens/semantic.css';
@import './tokens/scale.css';
@import './fonts.css';

@import './base/reset.css';
@import './base/typography.css';
@import './base/forms.css';
@import './base/a11y.css';

@import './components/button.css';
/* … từng primitive … */

@import './layouts/storefront.css';
@import './layouts/auth.css';
@import './layouts/account.css';
@import './layouts/workspace.css';

@import './utilities.css';
```

> **Layer naming:** dùng `sn-*` để không trùng `base/components/utilities` của Tailwind v4 trong giai đoạn chuyển đổi. Mỗi file CSS tự khai layer bên trong (`@layer sn-base { … }`, `@layer sn-components { … }`, `@layer sn-layouts { … }`, `@layer sn-utilities { … }`); **không** dùng `layer()` trong `@import` để tránh layer lồng nhau.
>
> **Giai đoạn chuyển đổi (Phase 1–10):** giữ thêm `@import 'tailwindcss';` và `@import './tokens.css';` để các trang chưa migrate không vỡ. Hai dòng này bị xoá ở Phase 11, cùng lúc với `Page.css`.
>
> **Thứ tự kích hoạt:** Phase 1 chỉ import 3 file token và `fonts.css`, chưa thêm `@layer sn-*`/`base/*`/`components/*`. Phase 2 import dần `components/*.css`. Phase 3 mới thêm khai báo `@layer sn-*` và import `base/*.css` + `layouts/*.css` + `utilities.css`. Không import trước, tránh đổi giao diện toàn cục khi trang cũ còn chạy.

### 4.11 Utilities tối thiểu

Chỉ được tồn tại 8 utility sau trong `utilities.css`. Không thêm utility mới; nếu cần, tạo class trong module hoặc primitive.

```css
@layer sn-utilities {
    .sn-container {
        width: 100%;
        max-width: var(--sn-container);
        margin-inline: auto;
        padding-inline: var(--sn-gutter);
    }

    .sn-container--narrow {
        max-width: var(--sn-container-narrow);
    }

    .sn-prose {
        max-width: var(--sn-measure-prose);
        font-size: var(--sn-text-md);
        line-height: var(--sn-leading-relaxed);
        color: var(--sn-color-text);
    }

    .sn-prose > * + * {
        margin-top: var(--sn-space-4);
    }

    .sn-numeric {
        font-variant-numeric: tabular-nums slashed-zero;
        font-feature-settings: 'tnum' 1, 'zero' 1;
    }

    .sn-label {
        font-size: var(--sn-text-2xs);
        font-weight: var(--sn-weight-semibold);
        letter-spacing: var(--sn-tracking-wider);
        line-height: var(--sn-leading-snug);
        text-transform: uppercase;
        color: var(--sn-color-text-muted);
    }

    .sn-visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
    }

    .sn-stack {
        display: flex;
        flex-direction: column;
        gap: var(--sn-space-4);
    }

    .sn-truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
```

### 4.12 Quy ước đặt class

| Loại | Pattern | Ví dụ |
|---|---|---|
| Global primitive | `.sn-<block>` + `[data-variant]` + `[data-size]` | `.sn-btn[data-variant='primary']` |
| Global element | `.sn-<block>__<element>` | `.sn-table__head`, `.sn-card__meta` |
| State | thuộc tính | `[data-state='open']`, `[aria-current='page']`, `:disabled` |
| CSS Module | camelCase | `.heroSplit`, `.rail`, `.kpiStrip` |
| Ghép primitive trong module | `composes` | `.cta { composes: sn-btn from global; }` |
| Layer | `sn-*` | `sn-reset`, `sn-base`, `sn-components`, `sn-layouts`, `sn-utilities` |

Không: `.btn-primary`, `.is-primary`, `.mt-4`, `.text-red`, `.p-2`.

---

## 5. Kiến trúc code và quy ước component

### 5.1 Nguyên tắc hybrid

- **Global**: primitive + layout shell + utility. Lý do: dùng ở mọi nơi, cần đồng nhất tuyệt đối, tránh import lặp.
- **CSS Module**: page composition + domain component có layout riêng (`ProductCard`, `OrderTimeline`, `HeroEditorial`, …). Lý do: tránh collision, style đi theo component.

### 5.2 Bỏ `cva`, `clsx`, `tailwind-merge`

Tạo `resources/js/lib/cx.ts`:

```ts
export type ClassValue = string | false | null | undefined;
export function cx(...values: ClassValue[]): string {
    return values.filter(Boolean).join(' ');
}
```

- `cn()` → `cx()` (đổi import toàn bộ).
- `buttonVariants` bỏ; `Button` map props sang `data-variant` / `data-size`.
- Không cần merge class vì không còn utility xung đột.

### 5.3 API component

```tsx
<Button variant="primary" size="md" leftIcon={Plus}>Thêm sản phẩm</Button>
```

render:

```html
<button class="sn-btn" data-variant="primary" data-size="md">…</button>
```

Quy ước:

- `variant`: `primary | secondary | ghost | tertiary | destructive | link`
- `size`: `sm | md | lg | icon | icon-sm | icon-lg`
- `tone` (Badge/Alert/Toast): `neutral | accent | success | warning | danger`
- Prop `className` được nối bằng `cx(...)`, không ghi đè.

### 5.4 Mẫu triển khai

**Primitive global:**

```css
/* resources/css/components/button.css */
@layer sn-components {
    .sn-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--sn-space-2);
        height: var(--sn-control-md);
        padding-inline: var(--sn-space-5);
        border: 1px solid transparent;
        border-radius: var(--sn-radius-md);
        font-family: var(--sn-font-sans);
        font-size: var(--sn-text-sm);
        font-weight: var(--sn-weight-medium);
        line-height: var(--sn-leading-none);
        white-space: nowrap;
        cursor: pointer;
        transition:
            background-color var(--sn-dur-fast) var(--sn-ease-standard),
            border-color var(--sn-dur-fast) var(--sn-ease-standard),
            color var(--sn-dur-fast) var(--sn-ease-standard),
            transform var(--sn-dur-instant) var(--sn-ease-standard);
    }

    .sn-btn:focus-visible {
        outline: 2px solid var(--sn-color-focus);
        outline-offset: 2px;
    }

    .sn-btn:active {
        transform: translateY(1px);
    }

    .sn-btn:disabled {
        opacity: 0.55;
        pointer-events: none;
    }

    .sn-btn[data-size='sm'] {
        height: var(--sn-control-sm);
        padding-inline: var(--sn-space-3);
    }

    .sn-btn[data-size='lg'] {
        height: var(--sn-control-lg);
        padding-inline: var(--sn-space-6);
        font-size: var(--sn-text-base);
    }

    .sn-btn[data-variant='primary'] {
        border-color: var(--sn-color-accent);
        background: var(--sn-color-accent);
        color: var(--sn-color-on-accent);
    }

    .sn-btn[data-variant='primary']:hover {
        border-color: var(--sn-color-accent-hover);
        background: var(--sn-color-accent-hover);
    }

    .sn-btn[data-variant='secondary'] {
        border-color: var(--sn-color-border-strong);
        background: var(--sn-color-surface);
        color: var(--sn-color-text);
    }

    .sn-btn[data-variant='secondary']:hover {
        background: var(--sn-color-surface-sunken);
    }
}
```

**Page module:**

```css
/* resources/js/pages/Home/Home.module.css */
.hero {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: var(--sn-space-10);
    align-items: start;
}

.cta {
    composes: sn-btn from global;
}

.cta:global([data-variant='primary']) {
    max-width: 100%;
}

@media (max-width: 768px) {
    .hero {
        grid-template-columns: minmax(0, 1fr);
        gap: var(--sn-space-6);
    }
}
```

```tsx
import styles from './Home.module.css';

<section className={styles.hero}>
    <button className={styles.cta} data-variant="primary">Xem chợ hôm nay</button>
</section>
```

### 5.5 Accessibility

- Mọi control có `<label>` thật hoặc `aria-label`; không placeholder-only.
- Focus ring: `outline: 2px solid var(--sn-color-focus); outline-offset: 2px;` không bao giờ `outline: none` mà không thay thế.
- Dialog/Sheet: Radix giữ focus trap; title + description bắt buộc.
- Bảng: `<caption class="sn-visually-hidden">` hoặc `aria-label`.
- Icon-only button: `aria-label`, kích thước tối thiểu 32×32 (desktop) / 44×44 (touch).
- Màu không phải tín hiệu duy nhất: badge trạng thái luôn có chữ.
- `prefers-reduced-motion: reduce` tắt mọi transition/animation không thiết yếu (đã có trong base).

### 5.6 Inline style hợp lệ

Chỉ cho giá trị động:

```tsx
<div style={{ '--sn-progress': `${percent}%` } as React.CSSProperties} />
```

Không: `style={{ color: '#b23a2f' }}`, `style={{ marginTop: 16 }}`.

---

## 6. Design gate (3 skill hợp nhất)

Mapping skill → vai trò:

| Skill | Vai trò trong refactor |
|---|---|
| `design-taste-frontend` ("taste kill") | Audit trước khi vẽ, luật bố cục/typography/màu, chống giao diện template |
| `kill-ai-slop` ("unslop") | Danh mục dấu hiệu AI và cách xoá; soi cả copy lẫn CSS |
| `hallmark` | Tiêu chuẩn "được thiết kế, không phải được sinh ra"; kiểm tra độ hoàn thiện |

Mỗi page/phase phải qua checklist này. Không đạt = chưa xong.

**Giới hạn áp dụng (theo chính skill):**

`design-taste-frontend` khai báo **không dành cho** dashboard, dense product UI, data table, multi-step form. Vì vậy:

| Bề mặt | Áp dụng |
|---|---|
| Storefront, Auth, About/Contact/Legal | Đầy đủ landing rules + Audit-first + anti-slop + hallmark |
| Customer account | Audit-first, typography, color/shape lock, state coverage; **bỏ** luật hero/eyebrow/bento/marquee |
| Seller / Admin / Shipper | Audit-first, color/shape lock, form contrast, state coverage, anti-slop copy; **bỏ** toàn bộ luật landing page |

Ba override có chủ đích, ghi để không ai "sửa" ngược:

1. **Tailwind v4** là mặc định của skill, nhưng dự án đã chốt CSS thuần → override hợp lệ.
2. **Lucide** bị skill khuyến nghị tránh, nhưng dự án đã phụ thuộc Lucide và đã chốt Lucide → override hợp lệ, không trộn bộ icon khác.
3. **Font self-host** là yêu cầu của skill (không link Google Fonts ở production) → Phase 1 chuyển sang `@font-face` self-host.

### 6.1 Audit-first (design-taste-frontend)

- [ ] **Ghi audit 5 dòng trước khi vẽ**, đính trong PR/commit: (1) file page, (2) props thật, (3) các trạng thái có thể xảy ra, (4) trạng thái rỗng/lỗi, (5) hành động chính.
- [ ] Đã đọc props thật và trạng thái thật (loading/empty/error/success) trước khi vẽ.
- [ ] Không bịa số liệu, badge, tab, cột, filter không có trong dữ liệu. Nếu thiếu dữ liệu thì **bỏ bớt UI**, không tạo placeholder giả.
- [ ] Có ít nhất một quyết định bố cục đặc thù cho nội dung (không dùng một template cho mọi trang) và nêu được tên quyết định đó.
- [ ] Thứ bậc thị giác rõ: 1 H1, 1 CTA chính mỗi viewport, phần còn lại lùi.
- [ ] Kiểm tra 375 / 390 / 768 / 1024 / 1440, zoom 200%, không tràn ngang; thử chuỗi tiếng Việt dài nhất và số lớn nhất.

### 6.2 Anti-slop (kill-ai-slop)

- [ ] Không gradient (nền, chữ, viền, button).
- [ ] Không tím/chàm `indigo→violet`, không palette mặc định Tailwind.
- [ ] Không chữ serif, không italic nhấn mạnh, không highlight từ khoá bằng nền vàng.
- [ ] Không glassmorphism, không backdrop-blur trang trí, không glow.
- [ ] Không bo góc quá lớn (`>=16px` cho card), không shadow quá lớn.
- [ ] Không badge/pill spam; không chip cho mọi nhãn.
- [ ] Không icon tự vẽ, không emoji, không "01 / 02 / 03".
- [ ] Không card lồng card; không card cho từng dòng bảng.
- [ ] Không "kicker" in hoa trên mọi heading; chỉ dùng cho metadata thật.
- [ ] Không status dot nhấp nháy vô hạn, không spinner tròn, không wobble.
- [ ] Không callout viền trái màu mè; không icon tile pastel.
- [ ] Không số liệu bịa (`99,9%`, `+128%`) nếu không có nguồn.
- [ ] Không copy AI: "Nâng tầm", "Liền mạch", "Bứt phá", "Không chỉ là… mà còn…".
- [ ] Không em-dash (`—`) hoặc en-dash (`–`) trong chuỗi hiển thị; dùng hyphen.
- [ ] Không heading trung tâm + 3 card bằng nhau + CTA "Tìm hiểu thêm".

### 6.3 Chất lượng thiết kế (hallmark)

- [ ] Typography có tương phản cỡ/weight thật, không cùng một cỡ cho mọi thứ.
- [ ] Màu có vai trò; accent xuất hiện có chủ đích, không rải đều.
- [ ] Layout bất đối xứng khi nội dung cho phép; không mọi section cùng nhịp.
- [ ] Đường kẻ, khoảng trắng và căn lề tạo cấu trúc, không cần trang trí.
- [ ] Trạng thái hover/focus/press/disabled/loading đầy đủ.
- [ ] Micro-motion tinh tế, không loop; tôn trọng reduced motion.
- [ ] Dark mode không phải đảo màu máy móc: wash và border được chỉnh riêng.
- [ ] Ảnh có tỷ lệ và crop nhất quán; không ảnh placeholder lệch tông.

### 6.4 Gate kỹ thuật

- [ ] Không class Tailwind mới.
- [ ] Không hex/rgb trong `.tsx` hoặc component CSS.
- [ ] Không `@apply`, không `!important` ngoài `utilities.css` và `base/a11y.css` (reduced motion).
- [ ] Không Boxicons/FontAwesome.
- [ ] `npm run types` sạch.
- [ ] `npm run build` sạch.
- [ ] `node scripts/check-tokens.mjs` sạch.
- [ ] Không lỗi console, không warning React key.

### 6.5 Pre-flight riêng cho Storefront / Auth / Legal

Chỉ áp cho bề mặt public. Workspace bỏ qua mục này.

**Hero**

- [ ] Tối đa 4 phần tử chữ: eyebrow **hoặc** brand strip, headline, subtext, CTA.
- [ ] Headline ≤ 2 dòng ở desktop; nếu 3 dòng thì đó là lỗi cỡ chữ, không phải lỗi copy.
- [ ] Subtext ≤ 20 từ và ≤ 4 dòng.
- [ ] CTA chính thấy được **không cần scroll**; `padding-top` hero ≤ `var(--sn-space-16)` (64 px) ở desktop.
- [ ] Không tagline nhỏ dưới CTA, không trust strip trong hero, không pricing teaser trong hero.
- [ ] Không scroll cue (`Scroll`, mũi tên nhún, chuột cuộn).

**Nhịp section**

- [ ] Eyebrow (nhãn in hoa trên heading) ≤ `ceil(số section / 3)`; hero tính là 1.
- [ ] Không split-header kiểu "headline lớn bên trái + đoạn giải thích nhỏ bên phải" nếu cột phải chỉ có chữ.
- [ ] Không quá 2 section liên tiếp dùng cùng layout ảnh + chữ.
- [ ] Một trang có ≥ 4 kiểu layout khác nhau nếu có ≥ 8 section.
- [ ] Không section đánh số `01 / 02 / 03`; không badge trang trí; không status dot không mang nghĩa.

**CTA và form**

- [ ] Nhãn CTA không xuống dòng ở desktop, ≤ 3 từ cho CTA chính.
- [ ] Không hai CTA cùng ý trên một trang.
- [ ] Form: label trên, helper dưới, error dưới; placeholder không thay label.
- [ ] Contrast CTA và form đạt AA (4,5:1 body, 3:1 chữ lớn).

**Hình ảnh và theme**

- [ ] Ảnh thật (asset thật hoặc `picsum.photos/seed/...`), không fake screenshot bằng `<div>`.
- [ ] Không overlay pill/tag lên ảnh; caption nằm ngoài ảnh.
- [ ] Một theme cho cả trang; không section nào tự đảo sáng/tối giữa trang.
- [ ] Logo wall (nếu có) chỉ có logo, không kèm nhãn ngành nghề.

**Copy**

- [ ] Không em-dash/en-dash trong chuỗi hiển thị.
- [ ] Không số liệu giả chính xác.
- [ ] Không nhãn thơ mộng kiểu "Ghi chép từ xưởng", "Đang trên bàn".
- [ ] Đọc lại toàn bộ chuỗi hiển thị, không còn câu tối nghĩa hoặc nghe như máy viết.

---

## 7. Lộ trình 12 phase

### Phase 0 — Baseline, đóng băng, guardrail

**Mục tiêu:** chốt điểm xuất phát, chặn Tailwind phát sinh, thay công cụ kiểm tra.

**Việc làm**

1. Tạo `docs/ui/BASELINE.md`: inventory 78 page + 47 primitive + **41 file** `Page.css`, mapping page → layout hiện tại, **kèm props chính, các trạng thái dữ liệu, trạng thái rỗng/lỗi và hành động chính của từng page**. Ghi rõ 17 render target thiếu (gồm `Admin/Inventory/Report`).
2. Ghi quy tắc đóng băng vào `AGENTS.md` (mục Frontend): "Không thêm class Tailwind; UI mới dùng token + `sn-*`; file đã migrate phải bỏ khỏi `scripts/token-allowlist.json`".
3. Viết lại `scripts/check-tokens.mjs` theo hướng **ratchet**:
   - Giữ nguyên cơ chế `--write-baseline` ghi file-level allowlist (65 file trước Phase 0; baseline mới 187 file sau khi mở rộng rule).
   - `raw-hex` trong `resources/js/**/*.{ts,tsx}`. Baseline sẽ chứa `resources/js/app.tsx` vì còn `#4B5563`.
   - `tailwind-utility` **chỉ quét class string** (`className=`, `cn(`, `cx(`, `clsx(`), không quét toàn dòng để tránh false positive với comment/chuỗi tiếng Việt.
   - `legacy-icon`, `arbitrary-value`, `apply-directive`, `css-hardcoded-color` trong `components/**` và `layouts/**` (cho phép trong `tokens/`).
   - Output `file:line:rule:match`; exit 1 nếu có vi phạm **ngoài allowlist**.
4. **Giữ** `scripts/token-allowlist.json` đến Phase 11 làm ratchet. Sau khi thêm rule mới, chạy `npm run check:tokens:baseline` để ghi baseline. Không xoá file này ở Phase 0.
5. Giữ các script hiện có (`check:tokens`, `check:tokens:all`, `check:tokens:baseline`); thêm `check:css` như alias. Không đổi tên cũ để không phá CI/AGENTS.
6. Chụp 12 ảnh baseline thủ công (không cài Playwright) ở 1440 + 390, lưu `docs/ui/baseline/`; thêm `docs/ui/baseline/` vào `.gitignore`.
7. Chuẩn bị font: tải `woff2` Be Vietnam Pro (400/500/600/700, subset latin + vietnamese) vào `public/fonts/be-vietnam-pro/` để Phase 1 không bị chặn.

**DoD:** `npm run check:css` **pass ở chế độ ratchet** (mọi vi phạm còn lại nằm trong allowlist); baseline mới được ghi (**187 file / 4.755 vi phạm**); `npm run types` + `npm run build` sạch; không sửa page nào.

---

### Phase 1 — Token, reset, base, dark mode

**Mục tiêu:** có nền CSS thuần chạy song song, không phá trang cũ.

**Tạo**

- `resources/css/tokens/primitive.css`
- `resources/css/tokens/semantic.css`
- `resources/css/tokens/scale.css`
- `resources/css/base/reset.css`
- `resources/css/base/typography.css`
- `resources/css/base/forms.css`
- `resources/css/base/a11y.css`
- `resources/css/fonts.css` — chỉ chứa `@font-face`, được import ngay Phase 1
- `resources/css/utilities.css`

**Sửa**

- `resources/css/app.css`: **chỉ thêm**, không xoá gì ở phase này.
  - Giữ nguyên `@import 'tailwindcss'`, `@custom-variant dark`, `@source`, `tokens.css`, `base.css` để trang chưa migrate không vỡ.
  - Thêm `@import './tokens/primitive.css'`, `semantic.css`, `scale.css` ngay sau `@import 'tailwindcss'`.
  - Thêm `@import './fonts.css'` ngay sau khối token để font local có hiệu lực từ Phase 1.
  - **Chưa** import `base/*` (trừ `fonts.css`) và `components/*`; các file này được tạo nhưng chỉ kích hoạt từ Phase 3, tránh đổi giao diện toàn cục khi trang cũ còn chạy.
- `resources/css/base.css`: giữ nguyên đến Phase 11. Nội dung mới nằm ở `base/`, không ghi đè file cũ.
- `resources/css/tokens.css`: giữ nguyên đến Phase 11 (class Tailwind cũ như `bg-rice-paper`, `text-ink` vẫn cần `@theme`). Token mới sống song song, prefix `--sn-` nên không xung đột.
- **Font: self-host Be Vietnam Pro** (bắt buộc theo `design-taste-frontend`; không link Google Fonts ở production).
  - `public/fonts/be-vietnam-pro/` đã có 8 `woff2` từ Phase 0 (400/500/600/700, latin + vietnamese).
  - Copy `public/fonts/be-vietnam-pro/font-faces.css` vào `resources/css/fonts.css` (chỉ `@font-face`; giữ `font-display: swap`, `unicode-range`).
  - Weight 400–700 là đủ: codebase chỉ dùng `font-normal/medium/semibold/bold`; không có 300/800.
- `resources/views/app.blade.php`:
  - Thêm inline script set **cả** `data-theme` và mirror `.dark` trước paint; đặt trước `<style>` và `@vite`.
  - Bỏ `@class(['dark' => ...])` trên `<html>`; script set cả `data-theme` và `.dark`.
  - **Giữ** `<style> html { background-color: #f6f1e6; }` và `html.dark { ... }` đến Phase 11 (mirror legacy).
  - Xác nhận `fonts.css` đã được import qua `app.css` (không khai `@font-face` trực tiếp trong Blade).
  - Bỏ `<link>` Google Fonts **và** 2 `<link rel="preconnect">` sau khi font local chạy đúng.
  - **Chưa** xoá Boxicons (Phase 11).
  - **Chưa** bỏ `class="font-sans antialiased"` trên `<body>` (Phase 11).
- `resources/js/app.tsx`: đổi `progress.color` từ `#4B5563` sang `var(--sn-color-accent)`.
- `resources/js/hooks/useTheme.ts`:
  - Set `root.dataset.theme`, mirror `root.classList.toggle('dark', isDark)`, và `root.style.colorScheme`.
  - **SSR-safe:** `config/inertia.php` đang bật SSR; không đọc `localStorage` khi `typeof window === 'undefined'`; bọc try/catch.
  - Giữ nguyên API `theme / resolvedTheme / changeTheme`.
- **Exception `!important`:** chỉ `resources/css/base/a11y.css` được dùng `!important` cho block `prefers-reduced-motion`; cập nhật `scripts/check-tokens.mjs` cho phép path này, **không** thêm file vào allowlist.
- `resources/css/app.css` Phase 1 **chưa** thêm khai báo `@layer sn-*`; chỉ import token + fonts. Khai báo layer và import `base/*`/`components/*`/`layouts/*`/`utilities.css` để Phase 3.

**Quy ước "chưa kích hoạt toàn cục"**

- `base/*.css` (trừ `fonts.css`) và `components/*.css` chỉ được import từ Phase 3 trở đi.
- Trong giai đoạn chuyển đổi, nền trang do class `.sn-shell` trên root của từng layout đặt (`background: var(--sn-color-canvas)`), **không** đặt trên `body`. Phase 11 mới chuyển về `body`.

**Reset phải xử lý**

- `Page.css` đang có `* { margin:0; padding:0; box-sizing:border-box; font-family:... }`. Nếu reset mới đặt trong `@layer sn-reset`, nó sẽ **thua** `Page.css` (unlayered). Vì vậy Phase 1 chỉ tạo reset trong layer (chưa import đến Phase 3), **không** xoá reset cũ; Phase 11 xoá `Page.css` sau khi các wrapper legacy và `AppLayout` đã bị xoá.
- `html { overflow-x: hidden }` của `Page.css` giữ tạm; Phase 11 mới bỏ và kiểm tra tràn ngang thật.

**DoD:** app chạy như trước ở light mode; `data-theme` + mirror `.dark` + `color-scheme` đổi đồng bộ; Appearance toggle hoạt động; SSR không lỗi `localStorage`; font self-host render đúng dấu tiếng Việt; **không còn request tới `fonts.googleapis.com` / `fonts.gstatic.com`**; không còn `#4B5563` trong `app.tsx`; `npm run format:check` pass; `npm run check:css` pass; `npm run types` + `npm run build` sạch.

---

### Phase 2 — 47 primitive toàn cục

**Mục tiêu:** thay toàn bộ `components/ui` bằng primitive CSS thuần.

Chia 3 đợt để review được:

**2.1 Form controls (15)**

`button`, `icon-button`, `input`, `textarea`, `select`, `checkbox`, `switch`, `radio-card`, `form-field`, `input-error`, `search-input`, `password-strength`, `file-dropzone`, `rich-text-editor`, `primary-input` (legacy, chuyển thành alias của `Input`).

**2.2 Overlay và navigation (15)**

`dialog`, `sheet`, `dropdown-menu`, `action-dropdown`, `tooltip`, `toast`, `toaster`, `confirmation-modal` (wrapper của `feedback/ConfirmDialog`, giữ export cũ), `tabs`, `breadcrumbs`, `pagination`, `navbar`, `sidebar`, `header`, `filter-panel`.

**2.3 Data display và feedback (17)**

`card`, `table`, `data-table`, `badge`, `status-badge`, `avatar`, `alert`, `empty-state`, `error-state`, `skeleton`, `progress`, `insights`, `typography`, `text-link`, `action-button`, `action-buttons`, `language-switcher`.

`quantity` (thực chất là `commerce/QuantityStepper`), `mobile-nav` (layout) không nằm trong 47 file này; chúng được xử lý ở Phase 3 và Phase 4. `feedback/ConfirmDialog` là canonical của luồng xác nhận và được dùng từ Phase 2.

**Quy tắc**

- Mỗi primitive: 1 file `.tsx` + CSS global tương ứng trong `components/*.css`.
- Xoá `cva` khỏi primitive; dùng `data-*`. `commerce/Price.tsx` cũng dùng `cva` nên xử lý ở Phase 4.
- **Giữ nguyên từng file legacy tại đúng đường dẫn** làm wrapper mỏng (không gom vào một `legacy.ts`), vì import trong dự án là path-based. Xoá từng wrapper khi page cuối dùng nó đã migrate (cuối Phase 8/9).

| Wrapper giữ nguyên path | Hành vi | Số file đang import |
|---|---|---:|
| `action-button.tsx` | wrap `Button` | 8 |
| `action-buttons.tsx` | wrap `ButtonGroup`, giữ type `ActionConfig` | 10 |
| `action-dropdown.tsx` | wrap `DropdownMenu` | 1 |
| `confirmation-modal.tsx` | wrap `feedback/ConfirmDialog` | 8 |
| `data-table.tsx` | wrap `Table` | 13 |
| `filter-panel.tsx` | wrap `FilterPanel` | 12 |
| `status-badge.tsx` | map class `Page.css` sang `Badge tone` | 11 |
| `header.tsx` | alias `PageHeader` / `WorkspaceTopbar` | 15 |
| `primary-input.tsx` | wrap `Input` | 3 |
| `insights.tsx` | wrap `StatCard` | 2 |

- `components/ui/table.tsx` là primitive chuẩn; `data-table.tsx` chỉ còn wrapper mỏng (sort/select) dùng `Table`.
- `components/ui/*` đang bị ignore trong `.prettierignore` (không phải `.prettierrc`) — bỏ ignore ở Phase 11.
- Xoá entry của từng file `components/ui/*` khỏi `scripts/token-allowlist.json` ngay khi file đó đã sạch, để ratchet không bị trôi.

**DoD:** mọi primitive render đúng ở light/dark; keyboard + focus; không hex; `check:css` sạch cho `components/ui`.

---

### Phase 3 — Shell và layout

**Mục tiêu:** 4 khung trang mới, thay `AppLayout`.

**Storefront**

- `StorefrontLayout`, `StorefrontHeader`, `StorefrontFooter`, `MobileNav`, `UtilityStrip`, `PageContainer`, `PageHeader`, `SectionHeader`.
- Header 56 px, sticky, border-bottom; search ở giữa; account/cart phải.
- Footer 4 cột trên nền `canvas-alt`.
- Giữ nguyên `ChatDock` mount một lần trong `StorefrontLayout` qua prop `showChatDock` và logic ẩn ở auth/checkout/chat/workspace. Không mount bubble thứ hai.

**Auth**

- `AuthLayout`, `AuthBrandPanel`: split 6/6, panel trái là "ledger" chữ + số liệu thật (không ảnh stock), form 420 px.

**Account**

- `AccountLayout`: rail 220 px + content; tab dọc; mobile thành select/scroll tabs.
- Tiếp tục wrap `StorefrontLayout` để thừa hưởng `ChatDock` và footer; không tự mount chat.

**Workspace**

- `WorkspaceLayout` thay `layouts/app/AppLayout`.
- `WorkspaceSidebar` 232 px, icon Lucide, active = nền `accent-wash` + thanh 2 px accent bên trái.
- `WorkspaceTopbar` 56 px: breadcrumb, search (nếu có), theme toggle, avatar menu.
- Map role → nav giữ nguyên href/label hiện tại.
- Giữ file `layouts/app/AppLayout.tsx` làm re-export tạm đến Phase 11.

**Kích hoạt CSS toàn cục**

- Thêm khai báo `@layer sn-reset, sn-base, sn-components, sn-layouts, sn-utilities;` và import `base/*.css`, `layouts/*.css`, `utilities.css` **không dùng `layer()`**; layer nằm trong từng file.
- Import `base/*.css` và `layouts/*.css` vào `app.css` ở phase này.
- Mỗi layout root thêm `className="sn-shell"`; nền `var(--sn-color-canvas)` đặt ở `.sn-shell`, chưa đặt lên `body`.
- Kiểm tra 5 trang legacy đại diện (Admin/Products, Admin/Users, Admin/Promotions/Index, Seller/Dashboard, Seller/Products) sau khi bật base để phát hiện reset làm lệch layout.

**DoD:** 4 layout render với 1 page giả mỗi loại; nav đúng role; mobile không tràn; dark mode đúng.

---

### Phase 4 — Storefront (8 page)

| # | Page | Ghi chú |
|---:|---|---|
| 1 | `Home/Index` | Hero 7/5, 6 category tile, shelf 4-up, trust strip 4 fact, voucher band 1 dòng |
| 2 | `Home/Search` | Filter rail 264 px, sticky, mobile bottom sheet |
| 3 | `Customer/ProductDetail` | Gallery 7/5, buy box sticky, spec table, review |
| 4 | `Home/About` | Editorial + số liệu thật |
| 5 | `Home/Contact` | Form + thông tin |
| 6 | `Legal/Terms` | Prose 65ch |
| 7 | `Legal/PrivacyPolicy` | Prose 65ch |
| 8 | `Legal/SellingPolicy` | Prose 65ch |

**Component trọng tâm:** `storefront/*` (10 file), `commerce/{ProductCard, ProductGrid, ProductGallery, BuyBox, VariantSelector, QuantityStepper, Price, Rating, ReviewCard, ReviewSummary, SpecTable, ShopIdentity, CategoryPills, ActiveFilters, FilterGroup, FilterRail}`.

`commerce/Price.tsx` đang dùng `cva`; chuyển sang `data-*` trong phase này, không để sót sang Phase 11.

**Luật riêng**

- Hero chỉ 1 CTA, không carousel, không mũi tên cuộn.
- Category tile: 6, không tô màu riêng.
- Product card: ảnh 4:5, không shadow, hover chỉ border + gạch chân tên.
- Trust strip: 4 mục ngăn bằng divider, không 4 card.
- Không section "3 card bằng nhau".

**DoD:** 8 trang hợp lệ ở 375/390/768/1440; ảnh không nhảy layout (đặt `width/height` hoặc `aspect-ratio`); dark mode đạt.

---

### Phase 5 — Auth (7 page)

`Login`, `Register`, `ForgotPassword`, `ResetPassword`, `VerifyEmail`, `SellerRegister`, `ShipperRegister` + `auth/SellerRegisterForm`.

- Split layout, không card giữa màn hình.
- Form: label trên, helper dưới, error dưới, không floating label.
- Password strength dùng `Progress` + text, không thanh màu cầu vồng.
- Social login (Google) là button secondary có logo thật, không tự vẽ.
- Seller/Shipper register: multi-step giữ nguyên số bước và field.

**DoD:** toàn bộ trạng thái lỗi/validate hiển thị đúng; tab order hợp lý; không đổi route.

---

### Phase 6 — Customer + Settings (18 page)

| Nhóm | Page |
|---|---|
| Giỏ/thanh toán | `Cart`, `Checkout`, `PaymentResult` |
| Đơn hàng | `Orders/Index`, `Orders/Show` |
| Địa chỉ | `Address/Index`, `Create`, `Edit`, `Show`, `AddressForm` |
| Tài khoản | `Profile/Index`, `ChangePassword/Index`, `Notification/Index`, `Chat/Index` |
| Settings | `Settings/Profile`, `Password`, `Appearance`, `SettingsTabs` |

**Component:** `commerce/{CartLine, OrderSummary, OrderItemRow, OrderTable, OrderStatusBadge, OrderTimeline, CheckoutStepper, CheckoutAddressForm, PaymentOption, PaymentMarks, PromoField, AddressCard, NotificationRow, OrderAnnouncementCard, OrderContextRail}`, `chat/*` (13 file).

**Luật riêng**

- Checkout 2 cột 7/5, summary sticky; mobile 1 cột, summary thành accordion.
- Order timeline: đường dọc 1 px + mốc 8 px, không icon tròn nhiều màu.
- Chat: list nền `surface-sunken`, active surface + thanh accent; bubble không tail, không glow.
- Appearance: 3 lựa chọn theme, preview bằng chính token (không ảnh).

**DoD:** luồng cart → checkout → payment result không đổi hành vi; empty state có copy thật; dark mode cho toàn bộ.

---

### Phase 7 — Seller (10 page)

`Dashboard/Index`, `Products/{Index,Create,Edit,Show}`, `Orders/{Index,Show}`, `Promotions/{Index,Create}`, `Shop/Edit`.

- Dashboard: KPI strip 4 ô (số thật), 1 chart, 1 bảng đơn gần đây. Không "card soup".
- Products: bảng ledger, ảnh 40×50, filter bar 1 dòng, bulk action.
- Form sản phẩm: 2 cột, variant table, ảnh dropzone, rich text editor dùng primitive.
- Orders: status tabs + bảng; detail 2 cột.
- Promotions: form điều kiện, date range, preview.
- Shop: form + preview card.

**DoD:** `Page.css` không còn cần cho các page này; icon Lucide; bảng đúng 48 px row; số căn phải.

---

### Phase 8 — Admin (34 page)

| Nhóm | Page |
|---|---|
| Dashboard | `Dashboard/Index` |
| Users | `Users/Index`, `Users/Edit` |
| Products | `Products/Index`, `Products/Show` |
| Inventory | `Inventory/Index`, `Show`, `History` |
| Orders | `Orders/Index` |
| Promotions | `Promotions/{Index,Create,Edit,Show}` |
| Categories | `Categories/{Index,Create,Edit}` |
| Brands | `Brands/{Index,Create,Edit}` |
| Shops | `Shops/{Index,Pending,Show,Dashboard,Statistics,Violations}` |
| Shippers | `Shippers/Index`, `Show` |
| Returns | `Returns/Index` |
| Analytics | `Analytics/{Index,Orders,Products,Reports,Revenue,Users}` |

**Component:** `admin/*` (18 file) + `AnalyticsChart` (recharts) dùng token màu qua `var(...)`.

**Luật riêng**

- Bảng là trung tâm; filter bar gọn 1 dòng + "thêm filter" mở panel.
- Không card cho từng nhóm filter.
- Chart: lưới 1 px, không gradient, tooltip surface.
- Bulk action hiện khi có selection, không chiếm chỗ thường trực.
- Số liệu KPI: 1 hàng 4 ô, không icon tile màu.

**DoD:** không còn page Admin/Seller nào import `Page.css`; các wrapper legacy và `AppLayout` vẫn còn import (sẽ xoá ở Phase 11). `Page.css` chỉ bị xoá ở Phase 11.

---

### Phase 9 — Shipper (1 page)

**Hiện trạng:** `Shipper/Dashboard/Index.tsx` chỉ là stub `<div><h1>Giao diện shipper</h1></div>`; controller chỉ trả `title`; `routes/shipper.php` dùng alias `shipper` chưa đăng ký (chỉ có `isShipper`) nên route hiện lỗi.

**Việc làm**

- Sửa middleware: đăng ký alias `shipper` trong `bootstrap/app.php` trỏ `IsShipper`, hoặc đổi route sang `isShipper`. Không đổi URL, controller hay props.
- Dựng `Shipper/Dashboard/Index` trên `WorkspaceLayout`.
- Vì controller chỉ trả `title`, page gồm: header, empty state "Chưa có chuyến được giao", 1 CTA tải lại. **Không** bịa danh sách chuyến, trạng thái hay thu nhập.
- Khi backend bổ sung props chuyến, ghi backlog để làm danh sách thật.

**DoD:** route trả 200; page render shell + empty state; không có dữ liệu giả; mobile-first; tap target 44 px; không phụ thuộc hover.

---

### Phase 10 — Email, error pages, PDF

**Email (2 file)**

- `resources/views/emails/welcome.blade.php`
- `resources/views/emails/welcome_google_user.blade.php`
- Tạo `resources/views/emails/partials/theme.blade.php` chứa **hex literal** (email client không hỗ trợ CSS variable) + `<style>` embedded.
- Palette email: canvas `#f2f2ee`, surface `#ffffff`, ink `#15160f`, muted `#53564b`, accent `#c2410c`, border `#d2d2ca`, radius 6.
- Font: `Be Vietnam Pro, Arial, sans-serif`; fallback Arial.
- Không gradient, không ảnh nền, không dark mode (email client không đáng tin).

**Error pages (mới)**

- `resources/views/errors/{404,419,429,500,503}.blade.php`
- `resources/views/errors/layout.blade.php`
- **Self-contained**: toàn bộ CSS nằm trong `<style>` của layout, dùng hex literal (không phụ thuộc Vite manifest, không phụ thuộc bundle React, không dùng CSS variable vì có thể render trước khi asset sẵn sàng).
- Palette: canvas `#f2f2ee`, surface `#ffffff`, ink `#15160f`, muted `#53564b`, accent `#c2410c`, border `#d2d2ca`, font `Be Vietnam Pro, Arial, sans-serif`.
- Hỗ trợ dark mode bằng `@media (prefers-color-scheme: dark)` với graphite `#0d0f0c` / `#151814` / `#f1f2ea`.
- Nội dung: mã lỗi lớn, 1 câu giải thích, 1 CTA về `/`.
- Không thêm entry Vite cho error page.

**PDF/invoice (có điều kiện)**

- Hiện **không có** controller/view PDF; `routes/user.php` chỉ có comment.
- Nếu bật trong refactor: tạo `resources/views/pdf/invoice.blade.php` + `resources/views/pdf/layout.blade.php`.
- Dompdf **không hỗ trợ CSS custom properties** → dùng hex literal, không `var(--sn-*)`.
- Print CSS: A4, margin 16 mm, font Be Vietnam Pro (hoặc DejaVu Sans nếu thiếu glyph), bảng 2 cột, không shadow.

**DoD:** email render trong Gmail/Outlook web (test thủ công); error page không cần JS; PDF (nếu có) mở đúng.

---

### Phase 11 — Gỡ Tailwind và dọn nợ

**Checklist xoá**

| File / mục | Hành động |
|---|---|
| `package.json` | Xoá `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/postcss`, `@tailwindcss/forms`, `@tailwindcss/container-queries`, `@tailwindcss/oxide-linux-x64-gnu`, `tailwind-merge`, `tailwindcss-animate`, `class-variance-authority`, `clsx`, `prettier-plugin-tailwindcss` |
| `vite.config.ts` | Bỏ `import tailwindcss` + `tailwindcss()` |
| `postcss.config.js` | Xoá |
| `tailwind.config.ts` | Xoá |
| `components.json` | Xoá |
| `resources/css/app.css` | Bỏ `@import 'tailwindcss'`, `@custom-variant`, `@source` |
| `resources/css/tokens.css` | Xoá |
| `resources/css/legacy-tokens.css` | Xoá |
| `resources/css/Page.css` | Xoá **sau khi** wrapper legacy + `AppLayout` đã bị xoá (Phase 11) |
| `resources/css/base.css` | Xoá (Phase 1 giữ nguyên, không xoá sớm) |
| `resources/views/app.blade.php` | Bỏ Boxicons link, bỏ `class="font-sans antialiased"`, bỏ `@class(['dark' => ...])` nếu còn, xác nhận không còn link Google Fonts |
| `resources/js/app.tsx` | Xác nhận `progress.color` đã là token, không còn `#4B5563` |
| `.prettierrc` | Bỏ plugin + `tailwindFunctions` + `tailwindStylesheet` |
| `eslint.config.js` | Bỏ `tailwind.config.js` khỏi ignores |
| `scripts/token-allowlist.json` | Chạy strict lần cuối (không `--all`), xác nhận 0 vi phạm rồi xoá file |
| `resources/js/components/ui/*` wrapper legacy | Xoá `action-button`, `action-buttons`, `action-dropdown`, `confirmation-modal`, `data-table`, `filter-panel`, `header`, `insights`, `primary-input`, `status-badge` sau khi page cuối migrate |
| `layouts/app/AppLayout.tsx` | Xoá sau khi mọi page dùng `WorkspaceLayout` |
| `@/lib/utils.ts` | Chỉ xoá `cn` + `twMerge`; giữ `formatCurrency` và các helper khác, chuyển sang `cx` |
| `.dark` selectors | Xoá toàn bộ |
| `DESIGN-02.md`, `STITCH-DESIGN.md`, `PROMPT.md`, `PLAN.md` | Chuyển `docs/archive/` hoặc xoá |
| `README.md`, `AGENTS.md` | Cập nhật mô tả stack, bỏ Tailwind/Boxicons |
| `docs/ui/BASELINE.md` | Giữ làm lịch sử |

**Thứ tự thực hiện trong Phase 11:** xoá wrapper legacy và `AppLayout` trước → xoá `Page.css` → xoá `legacy-tokens.css`/`tokens.css` → gỡ Tailwind khỏi build → chạy strict check → xoá allowlist.

**Kiểm tra sau khi xoá**

1. `npm ci` sạch.
2. `npm run build` + `npm run build:ssr`.
3. `npm run types`, `npm run format:check`, `npm run lint`, `npm run check:css`.
4. `rg -n "tailwind|@apply|@theme|bx-|fa-" resources package.json vite.config.ts` → rỗng (trừ docs archive).
5. `rg -n "#[0-9a-fA-F]{3,8}" resources/js resources/css --glob '!resources/css/tokens/**'` → rỗng.
6. `php artisan test` (targeted + full nếu thời gian cho phép).

**DoD:** không còn dependency Tailwind trong `package-lock.json`; bundle CSS giảm; không file nào import CSS đã xoá.

---

### Phase 12 — QA sweep

- **Responsive:** 375, 390, 480, 768, 1024, 1280, 1440; kiểm tra `overflow-x`.
- **Dark mode:** mọi page, mọi trạng thái (badge, chart, form error, overlay).
- **A11y:** tab qua từng page, focus visible, `aria-current`, contrast spot-check, zoom 200%.
- **Reduced motion:** bật OS setting, xác nhận không animation.
- **Trạng thái:** loading skeleton, empty, error, success cho mỗi page có dữ liệu.
- **Hiệu năng:** đo CSS bundle trước/sau; mục tiêu < 120 KB uncompressed cho CSS chính (chưa gzip).
- **Rà soát slop:** chạy checklist mục 6 trên toàn bộ 78 page.
- **Tài liệu:** cập nhật `DESIGN.md` + `COMPONENTS.md` theo token/primitive thực tế.

**DoD:** không còn vi phạm `check:css`; không còn `Page.css`; danh sách page đã migrate đủ 78.

---

## 8. Thứ tự trang chi tiết

| Phase | # | Page |
|---|---:|---|
| 4 | 1 | `Home/Index` |
| 4 | 2 | `Home/Search` |
| 4 | 3 | `Customer/ProductDetail` |
| 4 | 4 | `Home/About` |
| 4 | 5 | `Home/Contact` |
| 4 | 6 | `Legal/Terms` |
| 4 | 7 | `Legal/PrivacyPolicy` |
| 4 | 8 | `Legal/SellingPolicy` |
| 5 | 9 | `Auth/Login` |
| 5 | 10 | `Auth/Register` |
| 5 | 11 | `Auth/ForgotPassword` |
| 5 | 12 | `Auth/ResetPassword` |
| 5 | 13 | `Auth/VerifyEmail` |
| 5 | 14 | `Auth/SellerRegister` |
| 5 | 15 | `Auth/ShipperRegister` |
| 6 | 16 | `Customer/Cart` |
| 6 | 17 | `Customer/Checkout` |
| 6 | 18 | `Customer/PaymentResult` |
| 6 | 19 | `Customer/Orders/Index` |
| 6 | 20 | `Customer/Orders/Show` |
| 6 | 21 | `Customer/Address/Index` |
| 6 | 22 | `Customer/Address/Create` |
| 6 | 23 | `Customer/Address/Edit` |
| 6 | 24 | `Customer/Address/Show` |
| 6 | 25 | `Customer/Address/AddressForm` |
| 6 | 26 | `Customer/Profile/Index` |
| 6 | 27 | `Customer/ChangePassword/Index` |
| 6 | 28 | `Customer/Notification/Index` |
| 6 | 29 | `Customer/Chat/Index` |
| 6 | 30 | `Settings/Profile` |
| 6 | 31 | `Settings/Password` |
| 6 | 32 | `Settings/Appearance` |
| 6 | 33 | `Settings/SettingsTabs` |
| 7 | 34 | `Seller/Dashboard/Index` |
| 7 | 35 | `Seller/Products/Index` |
| 7 | 36 | `Seller/Products/Create` |
| 7 | 37 | `Seller/Products/Edit` |
| 7 | 38 | `Seller/Products/Show` |
| 7 | 39 | `Seller/Orders/Index` |
| 7 | 40 | `Seller/Orders/Show` |
| 7 | 41 | `Seller/Promotions/Index` |
| 7 | 42 | `Seller/Promotions/Create` |
| 7 | 43 | `Seller/Shop/Edit` |
| 8 | 44 | `Admin/Dashboard/Index` |
| 8 | 45 | `Admin/Users/Index` |
| 8 | 46 | `Admin/Users/Edit` |
| 8 | 47 | `Admin/Products/Index` |
| 8 | 48 | `Admin/Products/Show` |
| 8 | 49 | `Admin/Inventory/Index` |
| 8 | 50 | `Admin/Inventory/Show` |
| 8 | 51 | `Admin/Inventory/History` |
| 8 | 52 | `Admin/Orders/Index` |
| 8 | 53 | `Admin/Promotions/Index` |
| 8 | 54 | `Admin/Promotions/Create` |
| 8 | 55 | `Admin/Promotions/Edit` |
| 8 | 56 | `Admin/Promotions/Show` |
| 8 | 57 | `Admin/Categories/Index` |
| 8 | 58 | `Admin/Categories/Create` |
| 8 | 59 | `Admin/Categories/Edit` |
| 8 | 60 | `Admin/Brands/Index` |
| 8 | 61 | `Admin/Brands/Create` |
| 8 | 62 | `Admin/Brands/Edit` |
| 8 | 63 | `Admin/Shops/Index` |
| 8 | 64 | `Admin/Shops/Pending` |
| 8 | 65 | `Admin/Shops/Show` |
| 8 | 66 | `Admin/Shops/Dashboard` |
| 8 | 67 | `Admin/Shops/Statistics` |
| 8 | 68 | `Admin/Shops/Violations` |
| 8 | 69 | `Admin/Shippers/Index` |
| 8 | 70 | `Admin/Shippers/Show` |
| 8 | 71 | `Admin/Returns/Index` |
| 8 | 72 | `Admin/Analytics/Index` |
| 8 | 73 | `Admin/Analytics/Orders` |
| 8 | 74 | `Admin/Analytics/Products` |
| 8 | 75 | `Admin/Analytics/Reports` |
| 8 | 76 | `Admin/Analytics/Revenue` |
| 8 | 77 | `Admin/Analytics/Users` |
| 9 | 78 | `Shipper/Dashboard/Index` |

Quy tắc trong mỗi phase: **layout trước, page sau; trang ít phụ thuộc trước; trang nhiều state sau**. Với Admin, thứ tự nội bộ: Dashboard → Users → Categories/Brands → Products → Inventory → Orders → Promotions → Shops → Shippers → Returns → Analytics.

---

## 9. Mapping primitive cũ → mới

| Cũ | Mới | Ghi chú |
|---|---|---|
| `action-button`, `action-buttons` | `Button` + `ButtonGroup` | Giữ type `ActionConfig` trong wrapper đến Phase 8 |
| `action-dropdown` | `DropdownMenu` | |
| `primary-input` | `Input` / `FormField` | |
| `data-table` | `DataTable` (wrap `Table`) | Giữ sort/select |
| `confirmation-modal` | wrapper của `feedback/ConfirmDialog` | `feedback/ConfirmDialog` là canonical |
| `status-badge` | `Badge` với `tone` | Wrapper map class `Page.css` sang tone |
| `filter-panel` | `FilterPanel` | Dùng chung admin/seller |
| `header` | `PageHeader` / `WorkspaceTopbar` | Tách vai trò |
| `navbar` | `WorkspaceTopbar` | |
| `sidebar` | `WorkspaceSidebar` | |
| `insights` | `StatCard` | |
| `search-input` | `SearchInput` | |
| `toast` + `toaster` | `Toast` + `Toaster` | Một hệ duy nhất |
| `typography` | class `.sn-prose` + element | Bỏ component |
| `skeleton` | giữ, CSS thuần | |
| `rich-text-editor` | giữ, style trong `field.css` | TinyMCE skin giữ mặc định |

---

## 10. Kiểm chứng

### 10.1 Lệnh mỗi phase

```bash
npm run types
npm run format:check
npm run lint
npm run build
npm run check:css
php artisan test --filter=<area>
```

`npm run lint` hiện là `--fix`, nên chạy trước `format:check` để tránh false diff. `check:css` chạy ở chế độ **ratchet** (allowlist) đến hết Phase 10; Phase 11 mới bật strict và xoá allowlist.

### 10.2 Kiểm tra thủ công mỗi page

1. `composer run dev` (PHP 9999 + Vite + queue).
2. Mở route ở 375, 390, 768, 1024, 1440.
3. Toggle `data-theme` light/dark.
4. Tab qua toàn bộ control.
5. Thử trạng thái rỗng/lỗi nếu có.
6. So với baseline (nếu có ảnh).

### 10.3 Định nghĩa "xong" cho một page

- [ ] Audit 5 dòng đã ghi (file, props, trạng thái, rỗng/lỗi, hành động chính).
- [ ] Không còn class Tailwind trong file.
- [ ] Không hex/rgb trong file.
- [ ] Dùng primitive cho mọi control.
- [ ] Layout 375/390/768/1024/1440 không tràn, zoom 200% không vỡ.
- [ ] Light + dark đạt.
- [ ] Loading / empty / error / success đủ.
- [ ] Copy đã rà, không slop, không em-dash.
- [ ] `types` + `build` + `check:css` sạch.
- [ ] Route + props không đổi.

---

## 11. Rủi ro và cách giảm

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Xung đột reset giữa `Page.css` (unlayered) và reset mới (layered) | Cao | Không xoá reset cũ ở Phase 1; chỉ xoá `Page.css` ở Phase 11 sau khi wrapper/AppLayout bị xoá và test lại toàn workspace |
| Bỏ Tailwind preflight làm lệch heading/list/img ở trang chưa migrate | Cao | `base/reset.css` phải phủ đủ; test 5 trang legacy mỗi phase |
| Guardrail ratchet bị "trôi" (file migrate xong vẫn nằm trong allowlist) | Cao | Phase nào xong phải xoá entry tương ứng; Phase 11 chạy strict, xác nhận 0 vi phạm rồi mới xoá allowlist |
| Shipper route 500 do alias `shipper` chưa đăng ký | Cao | Xử lý ở Phase 9: đăng ký alias hoặc đổi sang `isShipper`; ghi rõ là ngoại lệ config duy nhất |
| Thiếu file font `woff2` khi bắt đầu Phase 1 | Trung bình | Chuẩn bị `public/fonts/be-vietnam-pro/` từ Phase 0; kiểm tra dấu tiếng Việt trước khi bỏ Google Fonts |
| Class global `sn-*` trùng `Page.css` | Trung bình | Prefix `sn-`; rà `Page.css` trước Phase 2 |
| CSS Modules + `composes` gây khó đọc | Thấp | Chỉ compose primitive, không compose chéo module |
| Bỏ `.dark` quá sớm làm hỏng `Page.css`/`base.css`/`legacy-tokens` | Cao | Giữ mirror `.dark` đến Phase 11; inline script + `useTheme` set cả `data-theme` và class |
| `useTheme` đọc `localStorage` khi SSR | Cao | Guard `typeof window`; `config/inertia.php` đang bật SSR |
| `!important` cho reduced-motion bị guardrail chặn | Trung bình | Path exception cho `resources/css/base/a11y.css`; không thêm file vào allowlist |
| Layer `base/components/utilities` trùng Tailwind v4 | Trung bình | Dùng `sn-*` layers; import không dùng `layer()` |
| Dark mode FOUC | Trung bình | Inline script trong `<head>` trước `@vite` |
| Radix portal render ngoài root | Thấp | Style global cho `[data-radix-popper-content-wrapper]` trong `menu.css` |
| Dompdf không hỗ trợ CSS var | Trung bình | Hex literal trong PDF |
| Email client cắt `<style>` | Trung bình | Inline style cho layout, `<style>` chỉ cho media query |
| Google Fonts bị chặn trong Docker/offline | Trung bình | Self-host `woff2` ngay Phase 1; giữ fallback system; kiểm tra dấu tiếng Việt |
| `npm run lint` tự sửa file gây diff lớn | Trung bình | Chạy theo phase, commit riêng |
| 17 render target thiếu (gồm `Admin/Inventory/Report`) bị báo regression | Thấp | Ghi rõ trong baseline và PR description |
| Tailwind còn trong `node_modules` sau khi xoá | Thấp | `npm ci` + kiểm tra `package-lock.json` |
| Bundle CSS phình do module trùng lặp | Trung bình | Primitive dùng global; module chỉ layout; đo ở Phase 12 |

---

## 12. Việc không làm

- Không đổi route, controller, model, migration, seeder.
- **Ngoại lệ duy nhất:** Phase 9 đăng ký alias `shipper` trong `bootstrap/app.php` hoặc đổi middleware của route shipper sang `isShipper`. Không đổi URL, controller, props hay hành vi nghiệp vụ.
- Không đổi key i18n hiện có; chỉ thêm key mới vào **cả** `lang/vi.json` và `lang/en.json`.
- Không đổi cấu trúc `role_user` hay cách query role.
- Không thêm provider thanh toán.
- Không thêm trang mới (trừ error pages bắt buộc).
- Không nâng version dependency (chỉ gỡ).
- Không xoá `resources/js/components/ui/{table,switch,error-state}.tsx` — đây là primitive dự phòng có chủ đích.
- Không xoá `chat`, `commerce/{ReturnItemPicker,RefundOption,PreferenceRow}`, `feedback/LoadingOverlay` khi chưa xác nhận là dead code.
- Không xoá wrapper legacy (`action-button`, `action-buttons`, `confirmation-modal`, `data-table`, `filter-panel`, `status-badge`, …) trước khi page cuối cùng dùng nó đã migrate.
- Không sửa email/PDF logic nghiệp vụ, chỉ trình bày.

---

## 13. Thứ tự commit đề xuất

```
chore(ui): add baseline inventory and token guardrail
feat(ui): add Bảng Hiệu token system and dark mode
refactor(ui): replace ui primitives with plain CSS (1/3 form controls)
refactor(ui): replace ui primitives with plain CSS (2/3 overlays)
refactor(ui): replace ui primitives with plain CSS (3/3 data display)
refactor(ui): rebuild storefront, auth and workspace shells
refactor(storefront): migrate home, search, product and legal pages
refactor(auth): migrate login and registration pages
refactor(customer): migrate cart, checkout, orders and account pages
refactor(seller): migrate seller workspace
refactor(admin): migrate admin workspace
fix(shipper): register middleware alias and migrate dashboard shell
feat(ui): restyle email, error pages and invoice print
chore(ui): remove tailwind, legacy css and boxicons
test(ui): responsive, dark mode and accessibility sweep
docs(ui): rewrite design system and component rules
```

---

## 14. Phụ lục — checklist nhanh cho người triển khai

**Trước khi sửa một page**

1. Đọc props + trạng thái thật.
2. Xác định layout thuộc shell nào.
3. Liệt kê primitive cần dùng.
4. Kiểm tra copy hiện tại có slop không.
5. Xác định 3 màn: desktop, tablet, mobile.

**Trong khi sửa**

1. Không thêm class Tailwind.
2. Không hex; dùng `var(--sn-*)`.
3. Control dùng primitive, không tự viết lại.
4. Số dùng `.sn-numeric`.
5. Nhãn nhỏ dùng `.sn-label` (11 px, uppercase, tracking 0.1em).
6. Ảnh có `aspect-ratio`.
7. Focus ring không bị tắt.

**Sau khi sửa**

1. Xoá file vừa migrate khỏi `scripts/token-allowlist.json`.
2. `npm run types`
3. `npm run build`
4. `npm run check:css`
5. Toggle dark, tab, 375/390/768/1024/1440.
6. Commit theo phase.

---

## 15. Nhật ký cập nhật

**2026-11-22 — Phase 1 hoàn tất:**

- Tạo `resources/css/tokens/{primitive,semantic,scale}.css`, `resources/css/fonts.css` (8 `@font-face`), `resources/css/base/{reset,typography,forms,a11y}.css`, `resources/css/utilities.css`.
- `app.css` chỉ thêm import token + `fonts.css`; chưa import `base/*`, `components/*`, `layouts/*`, `utilities.css` hay khai báo `@layer sn-*` (để Phase 3).
- `app.blade.php`: inline script set `data-theme` + mirror `.dark` + `colorScheme` trước paint; bỏ `@class`, bỏ Google Fonts và 2 preconnect; giữ Boxicons + body class.
- `useTheme`: SSR-safe, set `data-theme`, mirror `.dark`, cập nhật `colorScheme`.
- `app.tsx`: `progress.color` dùng `var(--sn-color-accent)`; bỏ `app.tsx` khỏi allowlist (187 → 186).
- `check:css` pass (69 file checked, 186 allowlisted); `types`, `format:check`, `build` pass; CSS bundle `app.css` 124,29 kB (baseline 112,57 kB).

**2026-11-22 — rà soát trước Phase 1 (đã chốt):**

- Giữ **mirror `.dark`** đến Phase 11 để `Page.css`/`base.css`/`legacy-tokens` không mất dark mode; inline script và `useTheme` set cả `data-theme` lẫn class.
- `useTheme` set thêm `style.colorScheme` và **SSR-safe** (`config/inertia.php` đang bật SSR, không đọc `localStorage` khi không có `window`).
- Cho phép `!important` riêng trong `resources/css/base/a11y.css` cho `prefers-reduced-motion`; guardrail dùng path exception, không thêm vào allowlist.
- Đổi layer sang `sn-reset/sn-base/sn-components/sn-layouts/sn-utilities`; import không dùng `layer()` để tránh layer lồng nhau.
- Format `resources/css/legacy-tokens.css`; `npm run format:check` pass.
- Xác nhận weight 400/500/600/700 đủ dùng; bỏ cả 2 link preconnect Google Fonts ở Phase 1.

**2026-11-22 — Phase 0 hoàn tất:**

- Guardrail `scripts/check-tokens.mjs` viết lại theo ratchet; `check:css` pass với **187 file / 4.755 vi phạm** trong allowlist.
- Tạo `docs/ui/BASELINE.md`: 78 page, 47 primitive, 41 file `Page.css`, 17 render target thiếu, props/trạng thái/hành động chính.
- Tải 8 file `woff2` Be Vietnam Pro (400/500/600/700, latin + vietnamese) vào `public/fonts/be-vietnam-pro/`.
- Thêm `docs/ui/baseline/` vào `.gitignore`; tạo thư mục cho ảnh baseline thủ công.
- Ghi quy tắc đóng băng vào `AGENTS.md`; thêm `check:css` / `check:css:all` vào `package.json`.
- `npm run types` và `npm run build` sạch.

**2026-11-22 — rà soát trước Phase 0, cập nhật theo thực tế codebase:**

- Sửa số liệu: `Page.css` importers **41** (không phải 42); `className=` **2.096** (không phải 2.088); allowlist **65 file**.
- Bổ sung `Admin/Inventory/Report` vào danh sách 17 render target thiếu.
- Guardrail chuyển sang **ratchet bằng allowlist**; Phase 0 ghi baseline, Phase 11 mới strict.
- Tách `resources/css/fonts.css` để self-host font có hiệu lực ngay Phase 1.
- Thay cơ chế `legacy.ts` bằng **wrapper giữ nguyên path** cho 10 component legacy; giữ type `ActionConfig`.
- Chốt `feedback/ConfirmDialog` là canonical; `ui/confirmation-modal` thành wrapper.
- Phase 9 chốt phương án **sửa alias + shell/empty state**, không bịa dữ liệu chuyến.
- Chuyển thời điểm xoá `Page.css` sang **Phase 11**.
- Thêm `@tailwindcss/oxide-linux-x64-gnu`, `app.tsx` hex, `.gitignore` baseline, font prerequisite vào checklist.
- Giữ nguyên `ChatDock`/`showChatDock` khi tách layout.

---

*Hết kế hoạch. Mọi thay đổi ngoài phạm vi ghi vào backlog, không đưa vào refactor.*
