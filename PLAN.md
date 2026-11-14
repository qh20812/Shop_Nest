# ShopNest UI System — Master Plan

> **Trạng thái:** Phase 0 + Phase 1 + Phase 2 + Phase 3 + Phase 4 + Phase 5 + Phase 6 hoàn tất
> **Cập nhật gần nhất:** 15/11/2026 — Phase 6 cleanup hoàn tất
> **Ngày chốt:** 13/11/2026  
> **Phạm vi:** Storefront + Auth + Customer account + Chat  
> **Nguồn chuẩn:** `DESIGN.md`  
> **Tham chiếu:** `STITCH-DESIGN.md`, `PROMPT.md`, `DESIGN-02.md`  
> **Số phase:** 7 phase (Phase 0 → Phase 6)

---

## 0. Quyết định đã khóa

| # | Quyết định | Ghi chú |
|---|---|---|
| D1 | **Fraunces** là font display duy nhất | Theo `DESIGN.md`. Không dùng Newsreader dù Stitch sinh Newsreader. |
| D2 | Chatbot bubble chỉ hiện ở **storefront + account** | Ẩn ở Auth, Checkout, Payment, Chat workspace, Seller/Admin/Shipper. |
| D3 | `DESIGN.md` là nguồn chuẩn | `DESIGN-02.md` chỉ là snapshot Stitch, không import token từ đó. |
| D4 | Stitch HTML là **reference only** | Không copy class Tailwind, không copy HTML, không copy demo scaffolding. |
| D5 | Seller/Admin/Shipper **deferred** | Chỉ chuẩn bị `WorkspaceShell` placeholder; không refactor UI workspace trong plan này. |
| D6 | Light mode là mặc định | Dark mode chưa thuộc phạm vi; không thiết kế dark palette mới trong 7 phase. |
| D7 | Không thêm UI library mới | Dùng `cva`, Radix, Lucide, Tailwind 4. Không thêm Ant/MUI/Chakra. |
| D8 | Migration tăng dần | Không big-bang. Legacy CSS/component chỉ xoá ở Phase 6 sau khi migrate xong. |
| D9 | Không đổi backend nếu không cần | Giữ nguyên route, controller, form name, CSRF, validation, payment flow. |
| D10 | Một pattern = một component chuẩn | Không giữ song song 2 button/input/card/navbar cùng chức năng. |

---

## 1. Mục tiêu

### 1.1 Mục tiêu

1. Tạo một **token layer duy nhất** cho màu, typography, spacing, size, radius, shadow, motion và z-index.
2. Tách các pattern lặp từ Stitch thành **component React tái sử dụng**, có variant và state đầy đủ.
3. Đồng bộ toàn bộ Storefront, Auth, Customer account và Chat theo hệ Nếp.
4. Tạo **chatbot bubble** mới ở góc dưới bên phải, dùng đúng token, không dùng mascot/robot.
5. Loại bỏ dần component/CSS/icon font trùng lặp và lệch hệ.
6. Có tài liệu `COMPONENTS.md` để các phase sau không tái tạo component mới tuỳ ý.

### 1.2 Không thuộc phạm vi

- Không thiết kế lại Seller/Admin/Shipper workspace.
- Không thêm feature mới ngoài UI (wishlist page, return page, recommendation engine...).
- Không đổi logic thanh toán Stripe/COD, inventory, promotion, chat backend.
- Không làm dark mode mới.
- Không đổi nội dung pháp lý.
- Không thay đổi database/migration/seeder.

---

## 2. Audit hiện trạng

### 2.1 Token hiện tại

`resources/css/app.css` vẫn dùng palette cũ:

- Primary xanh `#2563eb`.
- Accent tím `#cf52d0`.
- Background trắng `#ffffff`.
- Chart pink/coral/yellow.
- Font `Instrument Sans`.
- Dark mode token riêng.

Đây là lý do UI lệch hệ Nếp và lệch giữa các trang.

### 2.2 Component trùng chức năng

| Nhóm | Component hiện có | Xử lý |
|---|---|---|
| Button | `ui/button.tsx`, `ui/ActionButton.tsx`, `ui/ActionButtons.tsx`, `PrimaryButton.tsx` | Giữ `ui/button.tsx`; rename `action-button`/`action-buttons` (workspace legacy); xoá `PrimaryButton` |
| Input | `ui/input.tsx`, `ui/PrimaryInput.tsx`, `TextInput.tsx`, `ui/InputLabel.tsx`, `ui/InputError.tsx`, `input-error.tsx` | Giữ `ui/input.tsx` + `ui/form-field.tsx`; rename `primary-input`/`input-error`; xoá phần còn lại |
| Card sản phẩm | `product-card.tsx`, `Shared/ProductCard.tsx`, `home/ui/ProductCard.tsx` | Thay bằng `commerce/ProductCard.tsx`, xoá Phase 6 |
| Layout | `layouts/app/AppLayout.tsx`, `CustomerLayout.tsx`, `HomeLayout.tsx`, `SellerLayout.tsx`, `ShipperLayout.tsx`, `app-layout.tsx`, `settings/SettingLayout.tsx` | Storefront dùng `StorefrontLayout`; account dùng `AccountLayout`; giữ `AppLayout` cho workspace; xoá phần còn lại |
| Navigation | `ui/Navbar.tsx`, `home/ui/Navbar.tsx`, `home/ui/Header.tsx`, `ui/Sidebar.tsx` | Storefront dùng `StorefrontHeader`; workspace rename `ui/navbar`, `ui/sidebar`; xoá `home/ui/*` |
| Chat | `Chatbot.tsx`, `ChatBubble.tsx`, `ChatWindow.tsx`, `Message.tsx`, `Chat/ChatPopup.tsx`, `Chat/ChatList.tsx`, `Chat/ChatWindow.tsx` | Thay bằng `chat/ChatDock.tsx` + `chat/ChatWorkspace.tsx`, xoá Phase 6 |
| Feedback | `ui/ConfirmationModal.tsx`, `ui/NotificationToast.tsx` | `confirmation-modal` rename-only (workspace); xoá `NotificationToast`; dùng `feedback/ConfirmDialog` cho storefront/account |

### 2.3 Asset/font/icon legacy

`resources/views/app.blade.php` đang tải:

- Instrument Sans (Bunny Fonts)
- Montserrat
- Plus Jakarta Sans
- Material Symbols
- Boxicons
- Bootstrap Icons
- Font Awesome
- Tailwind CDN

Kế hoạch: thêm font Nếp ở Phase 0; Phase 6 xoá font/icon/CDN không còn dùng, **giữ Boxicons** cho workspace đến khi migrate Seller/Admin/Shipper.

### 2.4 Phát hiện từ Stitch

| Vấn đề | Quyết định |
|---|---|
| Không có navbar storefront | Build mới từ `PROMPT.md` S01 + `DESIGN.md` |
| Newsreader thay vì Fraunces | Dùng Fraunces |
| `#FEF9EE`, `#91221A`, `#58413E` ngoài palette | Bỏ, dùng token Nếp |
| Material Symbols | Thay bằng Lucide |
| Simulator bar, toast giả, pill “Khách vãng lai” | Bỏ toàn bộ |
| Gradient, `backdrop-blur`, `shadow-xl` | Bỏ, dùng token shadow |
| `h-screen`, `min-h-[1024px]` | Thay `min-h-[100dvh]` |
| `text-[13px]`, `rounded-[20px]`, `bg-[#...]` | Thay token |
| Nội dung gốm/lụa/Mộc Studio còn sót | Thay bằng catalog 6 ngành |
| Chat chỉ có 3-pane, không có bubble | Tự thiết kế bubble theo token |

### 2.5 Màn hình chuẩn để lấy mẫu

| Pattern | Màn chuẩn | Ghi chú |
|---|---|---|
| Auth shell | A01 | Split 42/58, brand panel + form panel |
| Home | S01 | Hero 7/5, utility strip, 6 category tiles, flash sale, trust strip |
| Catalog | S02 | Filter rail, category pills, product card, skeleton, empty, pagination |
| Product detail | S03 | Gallery, buy box, variant chips, spec table, reviews, toast |
| Cart | S04 | Cart line, order summary, promo, confirm dialog, empty |
| Checkout | S05 | Stepper, form, shipping/payment radio card, summary |
| Payment result | S06 | Success/pending/failure/COD |
| Orders | C01 | Order table, status badge, filter tabs, pagination |
| Tracking | C02 | Timeline dọc, item ledger, sticky action panel |
| Returns | C03 | Upload dropzone, refund options, alert |
| Wishlist | C04 | Dùng product card S02 với variant wishlist |
| Address | C05 | Address card, delete dialog, form |
| Settings | C06 | Tab rail, form field, avatar, password strength |
| Notifications | C07 | Notification row, filter tabs, preference switch |
| Chat | C08 | 3-pane workspace, message bubble, composer, order rail |
| Footer | S01 | 4 cột; S02/S03/C04 là bản compact |
| Navbar | Không có | Build mới |

---

## 3. Kiến trúc đích

### 3.1 Cây thư mục

```text
resources/
├── css/
│   ├── app.css                 # entry: tailwind + tokens + legacy + base
│   ├── tokens.css              # @theme + :root, toàn bộ token Nếp
│   ├── legacy-tokens.css       # tạm thời: token cũ + dark mode, xoá khi migrate workspace
│   └── base.css                # reset, body, focus-ring, keyframes, utilities
│
├── js/
│   ├── components/
│   │   ├── ui/                 # primitives, kebab-case
│   │   ├── layout/             # shell, header, footer, page header
│   │   ├── storefront/         # module riêng của home
│   │   ├── commerce/           # product, cart, checkout, order, account
│   │   ├── chat/               # chat workspace + bubble
│   │   └── feedback/           # dialog, result, loading overlay
│   ├── pages/                  # route screens, folder + file PascalCase
│   │   ├── Auth/
│   │   ├── Home/
│   │   ├── Customer/
│   │   └── ...
│   ├── layouts/                # legacy workspace layouts (lowercase folder)
│   ├── hooks/
│   ├── lib/
│   │   ├── format.ts
│   │   ├── status.ts
│   │   └── utils.ts            # đã có cn()
│   └── types/
│       └── commerce.ts
│
└── views/
    └── app.blade.php           # fonts, meta, no CDN sau Phase 6
```

### 3.2 Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| `components/ui` | folder lowercase, file kebab-case | `button.tsx`, `form-field.tsx` |
| `components/<domain>` | folder lowercase, file PascalCase | `commerce/ProductCard.tsx`, `chat/ChatDock.tsx` |
| `pages` | folder PascalCase, file PascalCase | `Auth/Login.tsx`, `Home/Search.tsx` |
| `layouts` | folder lowercase, file PascalCase | `layouts/app/AppLayout.tsx` |
| `hooks`, `lib` | file camelCase/lowercase đúng chức năng | `useCountdown.ts`, `format.ts` |
| Type dùng chung | file `types.ts`, type PascalCase | `chat/types.ts`, `ProductCardModel` |

Quy tắc áp dụng từ Phase 6:

- Folder component luôn lowercase, kể cả `chat` (thay cho `Chat` cũ).
- File trong `components/ui` luôn kebab-case; file component các domain khác luôn PascalCase.
- Folder page luôn PascalCase (`Auth`, `Home`, `Customer`…), không dùng `auth` lowercase.
- Module type được giữ tên `types.ts` như ngoại lệ có chủ đích.
- Rename case-only phải qua tên tạm `.tmp` để tránh lỗi filesystem Windows; sau rename chạy `types` + `build` và soát casing import cho Linux CI.

### 3.3 Quy tắc import

- Dùng alias `@/components/...`, `@/lib/...`, `@/hooks/...`.
- Không import CSS riêng lẻ trong component mới.
- Không import `@/../css/*.css` trong component mới.
- Mọi page mới chỉ import layout + component, không import CSS legacy.
- Page đã migrate không được import `Page.css`, `Home.css`, `ProductCard.css`, `Chat.css`, `chatbot.css`.

### 3.4 Quy tắc component

1. `className` luôn được merge cuối bằng `cn()`.
2. Primitive dùng `cva` cho `variant` và `size`.
3. Component cần DOM ref dùng `forwardRef`.
4. Button hỗ trợ `asChild` qua Radix Slot.
5. Mọi icon dùng Lucide, stroke 1.75, size 16/20/24.
6. Không hardcode text tiếng Việt trong primitive; text truyền qua props hoặc `t()`.
7. Không đặt business logic trong `components/ui`.
8. Commerce component được phép format giá/ngày qua `lib/format.ts`.
9. Mọi interactive target ≥ 44×44px.
10. Mọi component có `disabled`, `loading` (nếu áp dụng), `aria-*` và focus state.

---

## 4. Token system

### 4.1 Thứ tự load

`resources/css/app.css`:

```css
@import 'tailwindcss';
@import './legacy-tokens.css';
@import './tokens.css';
@import './base.css';

@source '../views';
@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
```

- `legacy-tokens.css`: token cũ + `.dark`, chỉ tồn tại trong giai đoạn migrate; Phase 6 giữ lại cho workspace.
- `tokens.css`: token Nếp, load sau để override font và bổ sung palette.
- Chỉ xoá `legacy-tokens.css` và chuyển alias shadcn khi migrate Seller/Admin/Shipper.

### 4.2 Màu

```css
@theme {
  --color-rice-paper: #f6f1e6;
  --color-warm-porcelain: #fffcf4;
  --color-raw-linen: #ede4d3;

  --color-ink: #1d1b17;
  --color-ink-muted: #6b6458;
  --color-ink-faint: #9a8f7f;

  --color-border: #dcd1be;

  --color-lacquer-red: #b23a2f;
  --color-lacquer-deep: #8c2a22;
  --color-lacquer-wash: #f2dcd5;

  --color-jade: #2f6b57;
  --color-turmeric: #8a5a1a;
  --color-brick: #8b2a24;

  --color-logo-blue: #4991d8;

  --color-jade-soft: color-mix(in srgb, var(--color-jade) 10%, var(--color-warm-porcelain));
  --color-turmeric-soft: color-mix(in srgb, var(--color-turmeric) 10%, var(--color-warm-porcelain));
  --color-brick-soft: color-mix(in srgb, var(--color-brick) 10%, var(--color-warm-porcelain));
  --color-overlay: color-mix(in srgb, var(--color-ink) 40%, transparent);
}
```

Quy tắc:

- Một accent duy nhất: `lacquer-red`.
- `logo-blue` chỉ dùng trong logo, không dùng cho button/link/badge.
- Không dùng `gray-*`, `slate-*`, `blue-*`, `purple-*`, `pink-*`.
- Không dùng pure white làm nền trang.
- Status color chỉ dùng cho badge, dot, chart, validation.

### 4.3 Typography

```css
@theme {
  --font-display: 'Fraunces', ui-serif, Georgia, serif;
  --font-sans: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --text-display-xl: clamp(3.5rem, 7vw, 6.5rem);
  --text-display-xl--line-height: 0.92;
  --text-display-xl--letter-spacing: -0.035em;
  --text-display-xl--font-weight: 600;

  --text-display-lg: clamp(2.5rem, 4.5vw, 4.25rem);
  --text-display-lg--line-height: 0.98;
  --text-display-lg--letter-spacing: -0.03em;
  --text-display-lg--font-weight: 600;

  --text-headline-1: clamp(2rem, 3vw, 2.75rem);
  --text-headline-1--line-height: 1.05;
  --text-headline-1--letter-spacing: -0.025em;
  --text-headline-1--font-weight: 600;

  --text-headline-2: clamp(1.5rem, 2vw, 2rem);
  --text-headline-2--line-height: 1.15;
  --text-headline-2--letter-spacing: -0.02em;
  --text-headline-2--font-weight: 600;

  --text-headline-3: 1.125rem;
  --text-headline-3--line-height: 1.3;
  --text-headline-3--letter-spacing: -0.01em;
  --text-headline-3--font-weight: 600;

  --text-body-lg: 1.125rem;
  --text-body-lg--line-height: 1.6;

  --text-body-md: 1rem;
  --text-body-md--line-height: 1.65;

  --text-body-sm: 0.875rem;
  --text-body-sm--line-height: 1.5;

  --text-label-code: 0.875rem;
  --text-label-code--line-height: 1.25;
  --text-label-code--font-weight: 500;

  --text-label-micro: 0.75rem;
  --text-label-micro--line-height: 1.4;
  --text-label-micro--letter-spacing: 0.12em;
  --text-label-micro--font-weight: 600;
}
```

Quy tắc:

- `font-display` chỉ dùng cho hero, campaign, Auth, Legal.
- Heading còn lại dùng `font-sans`.
- Giá, SKU, mã đơn, ngày, KPI dùng `font-mono`.
- Không dùng `font-medium`/`font-bold` tuỳ ý ngoài token role.
- Không dùng `text-[13px]`, `text-[32px]`.

### 4.4 Spacing và size

```css
@theme {
  --container-page: 90rem;

  --spacing-gutter-mobile: 1rem;
  --spacing-gutter-tablet: 2rem;
  --spacing-gutter: 3rem;

  --spacing-section: clamp(3rem, 8vw, 6rem);

  --spacing-control-sm: 2.25rem;
  --spacing-control-md: 2.75rem;
  --spacing-control-lg: 3rem;
  --spacing-tap: 2.75rem;

  --spacing-header: 4rem;
  --spacing-sidebar: 15rem;
  --spacing-filter-rail: 17.5rem;

  --spacing-chat-pane: 20rem;
  --spacing-chat-launcher: 3.5rem;
  --spacing-chat-panel: 23.75rem;
}
```

Dùng:

- `max-w-page mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter`
- `h-control-md`, `h-control-lg`
- `w-sidebar`, `w-filter-rail`
- `w-chat-pane`, `size-chat-launcher`, `w-chat-panel`

Internal spacing dùng scale 4px của Tailwind (`p-4`, `gap-3`). Cấm arbitrary spacing.

### 4.5 Radius, shadow, motion, z-index

```css
@theme {
  --radius-checkbox: 0.25rem;
  --radius-chip: 0.5rem;
  --radius-control: 0.75rem;
  --radius-card: 1.25rem;
  --radius-surface: 1.5rem;
  --radius-sheet: 1.75rem;
  --radius-pill: 9999px;

  --shadow-soft: 0 20px 50px -30px rgb(60 42 24 / 0.35);
  --shadow-float: 0 16px 40px -28px rgb(60 42 24 / 0.45);
  --shadow-modal: 0 24px 64px -36px rgb(29 27 23 / 0.5);

  --ease-nep: cubic-bezier(0.22, 1, 0.36, 1);
}
```

`base.css`:

```css
@layer base {
  html {
    color-scheme: light;
  }

  body {
    @apply bg-rice-paper text-ink font-sans antialiased;
  }

  ::selection {
    @apply bg-lacquer-wash text-lacquer-deep;
  }

  * {
    @apply border-border;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer utilities {
  .focus-ring:focus-visible {
    outline: 2px solid var(--color-lacquer-red);
    outline-offset: 2px;
  }

  .z-header { z-index: 30; }
  .z-dropdown { z-index: 40; }
  .z-modal { z-index: 50; }
  .z-toast { z-index: 60; }
  .z-chat { z-index: 40; }
}
```

Quy tắc motion:

- Hover: 150–180ms.
- Press: 90ms.
- Section reveal: 240–320ms.
- Stagger: 40ms.
- Chỉ animate `transform` và `opacity`.
- Không animate `top`, `left`, `width`, `height`.
- Không dùng linear cho interactive.

### 4.6 Tương thích shadcn trong giai đoạn migrate

Trong Phase 0–6, giữ alias cũ trong `legacy-tokens.css` để các component shadcn/legacy không vỡ. Component mới dùng trực tiếp token Nếp (`bg-warm-porcelain`, `text-ink-muted`, `border-border`, `bg-lacquer-red`).

Khi migrate workspace, chuyển alias:

```css
@theme inline {
  --color-background: var(--color-rice-paper);
  --color-foreground: var(--color-ink);
  --color-card: var(--color-warm-porcelain);
  --color-card-foreground: var(--color-ink);
  --color-primary: var(--color-lacquer-red);
  --color-primary-foreground: var(--color-warm-porcelain);
  --color-secondary: var(--color-raw-linen);
  --color-secondary-foreground: var(--color-ink);
  --color-muted: var(--color-raw-linen);
  --color-muted-foreground: var(--color-ink-muted);
  --color-accent: var(--color-lacquer-wash);
  --color-accent-foreground: var(--color-lacquer-deep);
  --color-destructive: var(--color-brick);
  --color-destructive-foreground: var(--color-warm-porcelain);
  --color-border: var(--color-border);
  --color-input: var(--color-border);
  --color-ring: var(--color-lacquer-red);
}
```

### 4.7 Token checker

Tạo `scripts/check-tokens.mjs`:

- Quét `resources/js` (trừ generated `actions`, `routes`, `wayfinder`).
- Fail nếu gặp:
  - Hex màu `#...`
  - `gray-*`, `slate-*`, `blue-*`, `purple-*`, `pink-*`, `indigo-*`
  - `text-[`, `bg-[`, `border-[`, `p-[`, `px-[`, `py-[`, `gap-[`, `rounded-[`, `shadow-[`
  - `h-screen`
  - `backdrop-blur`
  - `bx`, `bi bi-`, `fa-`
- Cho phép ngoại lệ:
  - `--color-logo-blue` trong logo component.
  - File generated.
- Output danh sách `file:line`.
- Exit code 1 nếu có vi phạm.

Thêm vào `package.json`:

```json
{
  "scripts": {
    "check:tokens": "node scripts/check-tokens.mjs"
  }
}
```

---

## 5. Component inventory

### 5.1 UI primitives

| Component | API chính | Nguồn | File |
|---|---|---|---|
| `Button` | `variant`, `size`, `asChild`, `loading`, `leftIcon`, `rightIcon` | A01, S01, S03, S04 | `ui/button.tsx` |
| `IconButton` | `label`, `variant`, `size`, `tooltip` | S02, S04, C08 | `ui/icon-button.tsx` |
| `SearchInput` | `value`, `onChange`, `onSubmit`, `loading`, `clearable` | S01, S02, C01, C08 | `ui/search-input.tsx` |
| `Input` | `size`, `invalid`, `leadingIcon`, `trailing` | A01, S05 | `ui/input.tsx` |
| `Textarea` | `autoGrow`, `maxRows`, `counter` | C08, C03 | `ui/textarea.tsx` |
| `Select` | `options`, `placeholder`, `invalid` | S02, S05 | `ui/select.tsx` |
| `Checkbox` | `checked`, `indeterminate`, `label` | S04, S05 | `ui/checkbox.tsx` |
| `RadioCard` | `value`, `checked`, `title`, `description`, `meta`, `disabled` | S05, C03 | `ui/radio-card.tsx` |
| `Switch` | `checked`, `onCheckedChange`, `label` | C07 | `ui/switch.tsx` |
| `FormField` | `label`, `htmlFor`, `required`, `hint`, `error`, `counter` | A01, S05, C06 | `ui/form-field.tsx` |
| `PasswordStrength` | `value` | C06 | `ui/password-strength.tsx` |
| `Typography` | `Heading(level,size,serif,tone)`, `Text(size,tone)`, `Eyebrow`, `MetaText` | Tất cả | `ui/typography.tsx` |
| `Badge` | `tone`, `size`, `icon` | S02, S03, C02 | `ui/badge.tsx` |
| `StatusBadge` | `status`, `domain` | C01, C02, C04 | `commerce/OrderStatusBadge.tsx` |
| `Card` | `variant`, `padding` | S03, C06 | `ui/card.tsx` |
| `Avatar` | `src`, `name`, `size`, `status` | C06, C08 | `ui/avatar.tsx` |
| `Breadcrumbs` | `items` | S02, S03, S04, C02 | `ui/breadcrumbs.tsx` |
| `Tabs` | `items`, `value`, `onValueChange`, `variant` | S03, C06, C01, C07 | `ui/tabs.tsx` |
| `Pagination` | `page`, `pageCount`, `total`, `pageSize`, `onPageChange`; legacy `links` | S02, C01 | `ui/pagination.tsx` |
| `Table` | `columns`, `data`, `rowKey`, `density`, `stickyHeader`, `empty` | S03, C01 | `ui/table.tsx` |
| `Dialog` | `open`, `onOpenChange`, `title`, `description`, `footer`, `tone`, `size` | S04, C05 | `ui/dialog.tsx` |
| `Sheet` | `side`, `open`, `onOpenChange` | S02 mobile filter | `ui/sheet.tsx` |
| `DropdownMenu` | `trigger`, `items` | Navbar, C04 | `ui/dropdown-menu.tsx` |
| `Tooltip` | `content`, `position`, `delay` | Existing | `ui/tooltip.tsx` |
| `Toast` / `Toaster` | `title`, `description`, `tone`, `action`, `duration` | S03, C06 | `ui/toast.tsx`, `ui/toaster.tsx` |
| `Skeleton` | `variant`, `className` | S02, C01, C07 | `ui/skeleton.tsx` |
| `EmptyState` | `icon`, `title`, `description`, `actions` | S02, S04, C01, C07, C08 | `ui/empty-state.tsx` |
| `ErrorState` | `title`, `description`, `onRetry` | S02, C06 | `ui/error-state.tsx` |
| `Alert` | `tone`, `title`, `description`, `onDismiss` | S05, C03, C06 | `ui/alert.tsx` |
| `Progress` | `value`, `tone`, `label` | S03 | `ui/progress.tsx` |
| `TextLink` | `href`, `external`, `tone` | A01, S03 | `ui/text-link.tsx` |
| `FileDropzone` | `accept`, `maxSize`, `multiple`, `onFiles` | C03 | `ui/file-dropzone.tsx` |
| `Price` | `value`, `compareAt`, `size`, `tone` | S01–S04 | `commerce/Price.tsx` |
| `Rating` | `value`, `count`, `compact` | S02, S03 | `commerce/Rating.tsx` |
| `QuantityStepper` | `value`, `min`, `max`, `onChange`, `size` | S03, S04 | `commerce/QuantityStepper.tsx` |
| `Countdown` | `endsAt`, `onEnd` | S01 | `commerce/Countdown.tsx` |
| `PaymentMarks` | `methods` | S05 | `commerce/PaymentMarks.tsx` |

### 5.2 Layout

| Component | API chính | Nguồn | File |
|---|---|---|---|
| `PageContainer` | `size`, `children` | Tất cả | `layout/PageContainer.tsx` |
| `PageHeader` | `breadcrumbs`, `eyebrow`, `title`, `description`, `count`, `actions` | S04, C06, C07 | `layout/PageHeader.tsx` |
| `SectionHeader` | `eyebrow`, `title`, `description`, `action` | S01, S02, S03 | `layout/SectionHeader.tsx` |
| `StorefrontHeader` | `user`, `cartCount`, `unreadCount` | Không có Stitch | `layout/StorefrontHeader.tsx` |
| `StorefrontFooter` | `compact` | S01 | `layout/StorefrontFooter.tsx` |
| `StorefrontLayout` | `children`, `showChatDock` | S01–S06 | `layout/StorefrontLayout.tsx` |
| `AuthLayout` | `variant`, `brand`, `children` | A01 | `layout/AuthLayout.tsx` |
| `AuthBrandPanel` | `role`, `headline`, `description`, `image` | A01 | `layout/AuthBrandPanel.tsx` |
| `AccountLayout` | `title`, `tabs`, `actions`, `children` | C01, C06, C07 | `layout/AccountLayout.tsx` |
| `MobileNav` | `items`, `open`, `onOpenChange` | S01/S02 mobile | `layout/MobileNav.tsx` |
| `WorkspaceShell` | `sidebar`, `topbar`, `children` | Deferred | `layout/WorkspaceShell.tsx` |

### 5.3 Storefront modules

| Component | API chính | Nguồn | File |
|---|---|---|---|
| `HeroEditorial` | `eyebrow`, `headline`, `subcopy`, `cta`, `images` | S01, 00 | `storefront/HeroEditorial.tsx` |
| `UtilityStrip` | `items` | S01 | `storefront/UtilityStrip.tsx` |
| `CategoryShelf` | `categories`, `title`, `action` | S01 | `storefront/CategoryShelf.tsx` |
| `FlashSaleModule` | `endsAt`, `products` | S01 | `storefront/FlashSaleModule.tsx` |
| `ProductShelf` | `title`, `eyebrow`, `products`, `action` | S01 | `storefront/ProductShelf.tsx` |
| `TrustStrip` | `items` | S01 | `storefront/TrustStrip.tsx` |
| `EditorialPillars` | `pillars` | 00 | `storefront/EditorialPillars.tsx` |
| `BrandSpotlight` | `brand`, `cta` | 00 | `storefront/BrandSpotlight.tsx` |
| `NewsletterSignup` | `onSubmit`, `loading` | 00 | `storefront/NewsletterSignup.tsx` |

### 5.4 Commerce

| Component | API chính | Nguồn | File |
|---|---|---|---|
| `ProductCard` | `product`, `variant`, `onAddToCart`, `onToggleWishlist`, `priority` | S02 canonical; S01, C04 | `commerce/ProductCard.tsx` |
| `ProductGrid` | `products`, `columns`, `loading`, `empty` | S02, C04 | `commerce/ProductGrid.tsx` |
| `ProductGallery` | `images`, `alt` | S03 | `commerce/ProductGallery.tsx` |
| `BuyBox` | `product`, `selectedVariant`, `onVariantChange`, `quantity`, `onQuantityChange`, `onAddToCart`, `onBuyNow` | S03 | `commerce/BuyBox.tsx` |
| `VariantSelector` | `groups`, `value`, `onChange` | S03 | `commerce/VariantSelector.tsx` |
| `SpecTable` | `rows` | S03 | `commerce/SpecTable.tsx` |
| `ReviewSummary` | `rating`, `distribution`, `total` | S03 | `commerce/ReviewSummary.tsx` |
| `ReviewCard` | `review` | S03 | `commerce/ReviewCard.tsx` |
| `FilterRail` | `groups`, `value`, `onChange`, `onClear` | S02 | `commerce/FilterRail.tsx` |
| `FilterGroup` | `title`, `count`, `defaultOpen`, `children` | S02 | `commerce/FilterGroup.tsx` |
| `ActiveFilters` | `filters`, `onRemove`, `onClear` | S02 | `commerce/ActiveFilters.tsx` |
| `CategoryPills` | `items`, `value`, `onChange` | S02 | `commerce/CategoryPills.tsx` |
| `CartLine` | `item`, `selected`, `onSelect`, `onQuantityChange`, `onRemove` | S04 | `commerce/CartLine.tsx` |
| `OrderSummary` | `items`, `totals`, `promotion`, `onApplyPromotion`, `onRemovePromotion`, `onCheckout` | S04, S05 | `commerce/OrderSummary.tsx` |
| `PromoField` | `value`, `onApply`, `error`, `applied` | S04 | `commerce/PromoField.tsx` |
| `CheckoutStepper` | `steps`, `current` | S05 | `commerce/CheckoutStepper.tsx` |
| `PaymentOption` | `value`, `selected`, `onChange`, `children` | S05 | `commerce/PaymentOption.tsx` |
| `OrderTable` | `orders`, `loading`, `empty` | C01 | `commerce/OrderTable.tsx` |
| `OrderTimeline` | `steps`, `current` | C02 | `commerce/OrderTimeline.tsx` |
| `OrderItemRow` | `item` | C02 | `commerce/OrderItemRow.tsx` |
| `AddressCard` | `address`, `isDefault`, `onEdit`, `onDelete`, `onSetDefault` | C05 | `commerce/AddressCard.tsx` |
| `ReturnItemPicker` | `items`, `selected`, `onChange` | C03 | `commerce/ReturnItemPicker.tsx` |
| `RefundOption` | `value`, `selected`, `onChange` | C03 | `commerce/RefundOption.tsx` |
| `NotificationRow` | `notification`, `unread`, `onRead` | C07 | `commerce/NotificationRow.tsx` |
| `PreferenceRow` | `title`, `description`, `checked`, `onCheckedChange` | C07 | `commerce/PreferenceRow.tsx` |
| `ShopIdentity` | `shop` | S03, C08 | `commerce/ShopIdentity.tsx` |
| `OrderAnnouncementCard` | `order` | C08 | `commerce/OrderAnnouncementCard.tsx` |
| `OrderContextRail` | `order` | C08 | `commerce/OrderContextRail.tsx` |

### 5.5 Chat

| Component | API chính | Nguồn | File |
|---|---|---|---|
| `ChatDock` | `enabled`, `defaultOpen` | Mới | `chat/ChatDock.tsx` |
| `ChatbotLauncher` | `unreadCount`, `onClick`, `open` | Mới | `chat/ChatbotLauncher.tsx` |
| `ChatbotPanel` | `open`, `onClose`, `messages`, `onSend` | Mới + C08 | `chat/ChatbotPanel.tsx` |
| `ChatWorkspace` | `conversations`, `activeId`, `onSelect` | C08 | `chat/ChatWorkspace.tsx` |
| `ConversationList` | `conversations`, `activeId`, `onSelect`, `query`, `onQueryChange` | C08 | `chat/ConversationList.tsx` |
| `ConversationRow` | `conversation`, `active`, `onClick` | C08 | `chat/ConversationRow.tsx` |
| `ChatHeader` | `variant`, `shop`, `assistant`, `onAction` | C08 | `chat/ChatHeader.tsx` |
| `MessageList` | `messages`, `loading`, `typing` | C08 | `chat/MessageList.tsx` |
| `ChatMessage` | `variant`, `content`, `timestamp`, `status`, `attachments` | C08 | `chat/ChatMessage.tsx` |
| `TypingIndicator` | `label` | C08 | `chat/TypingIndicator.tsx` |
| `QuickReplies` | `items`, `onSelect` | C08 | `chat/QuickReplies.tsx` |
| `ChatComposer` | `value`, `onChange`, `onSend`, `disabled`, `placeholder` | C08 | `chat/ChatComposer.tsx` |

### 5.6 Feedback

| Component | API chính | Nguồn | File |
|---|---|---|---|
| `ConfirmDialog` | `open`, `onOpenChange`, `title`, `description`, `confirmLabel`, `tone`, `onConfirm` | S04, C05 | `feedback/ConfirmDialog.tsx` |
| `ResultState` | `status`, `orderCode`, `message`, `actions` | S06 | `feedback/ResultState.tsx` |
| `LoadingOverlay` | `label`, `visible` | S04 | `feedback/LoadingOverlay.tsx` |

### 5.7 Type dùng chung

`resources/js/types/commerce.ts`:

```ts
export type ProductCardModel = {
  id: number | string;
  slug: string;
  name: string;
  image: string;
  imageAlt?: string;
  shopName: string;
  shopBadge?: 'shop-viet' | 'verified' | 'official';
  price: number;
  compareAt?: number;
  rating?: number;
  reviewCount?: number;
  metadata?: string;
  badges?: Array<'sale' | 'new' | 'fast-ship' | 'official' | 'low-stock'>;
  stock?: 'in' | 'low' | 'out';
  category?: 'tech' | 'appliance' | 'home' | 'baby' | 'fashion' | 'beauty';
};

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'completed'
  | 'cancelled'
  | 'returned'
  | 'refunded';
```

### 5.8 Legacy replacement map

| Legacy | Xử lý Phase 6 | Ghi chú |
|---|---|---|
| `ui/button.tsx` | Giữ | Primitive chuẩn |
| `ui/ActionButton.tsx` | Rename → `ui/action-button.tsx` | Workspace legacy, merge vào `button.tsx` khi migrate workspace |
| `ui/ActionButtons.tsx` | Rename → `ui/action-buttons.tsx` | Workspace legacy |
| `ui/PrimaryInput.tsx` | Rename → `ui/primary-input.tsx` | Workspace legacy, merge vào `input.tsx` sau |
| `ui/InputError.tsx` | Rename → `ui/input-error.tsx` | Workspace legacy, merge vào `form-field.tsx` sau |
| `ui/ConfirmationModal.tsx` | Rename → `ui/confirmation-modal.tsx` | Chỉ rename; chưa gộp API với `feedback/ConfirmDialog.tsx` |
| `ui/DataTable.tsx` | Rename → `ui/data-table.tsx` | Workspace legacy; `ui/table.tsx` là primitive đích |
| `ui/FilterPanel.tsx` | Rename → `ui/filter-panel.tsx` | Workspace legacy |
| `ui/Header.tsx` | Rename → `ui/header.tsx` | Workspace legacy |
| `ui/Insights.tsx` | Rename → `ui/insights.tsx` | Workspace legacy |
| `ui/LanguageSwitcher.tsx` | Rename → `ui/language-switcher.tsx` | Workspace legacy |
| `ui/Navbar.tsx` | Rename → `ui/navbar.tsx` | Workspace legacy |
| `ui/Avatar.tsx` | Rename → `ui/avatar.tsx` | Primitive đã nâng cấp |
| `ui/Pagination.tsx` | Rename → `ui/pagination.tsx` | Primitive đã nâng cấp |
| `ui/RichTextEditor.tsx` | Rename → `ui/rich-text-editor.tsx` | Workspace legacy |
| `ui/Sidebar.tsx` | Rename → `ui/sidebar.tsx` | Workspace legacy |
| `ui/StatusBadge.tsx` | Rename → `ui/status-badge.tsx` | Workspace legacy; `commerce/OrderStatusBadge` cho order |
| `ui/Tooltip.tsx` | Rename → `ui/tooltip.tsx` | Primitive đã nâng cấp |
| `PrimaryButton.tsx` | Xoá | Không còn dùng |
| `TextInput.tsx` | Xoá | Không còn dùng |
| `ui/InputLabel.tsx` | Xoá | Không còn dùng |
| `input-error.tsx` | Xoá | Không còn dùng |
| `product-card.tsx`, `Shared/ProductCard.tsx`, `home/ui/ProductCard.tsx` | Xoá | Đã thay bằng `commerce/ProductCard.tsx` |
| `home/ui/Navbar.tsx`, `home/ui/Header.tsx`, `home/ui/Footer.tsx` | Xoá | Đã thay bằng `layout/Storefront*` |
| `layouts/app/HomeLayout.tsx` | Xoá | Đã thay bằng `layout/StorefrontLayout.tsx` |
| `layouts/app/CustomerLayout.tsx` | Xoá | Đã thay bằng `layout/AccountLayout.tsx` |
| `ui/NotificationToast.tsx` | Xoá | Đã thay bằng `ui/toast.tsx` |
| `Chatbot.tsx` | Xoá | Đã thay bằng `chat/ChatDock.tsx` |
| `ChatBubble.tsx` | Xoá | Đã thay bằng `chat/ChatbotLauncher.tsx` |
| `ChatWindow.tsx`, `Message.tsx` | Xoá | Đã thay bằng `chat/ChatbotPanel.tsx` + `chat/ChatMessage.tsx` |
| `Chat/ChatPopup.tsx` | Xoá | Đã thay bằng `chat/ChatWorkspace.tsx` |
| `Chat/ChatList.tsx` | Xoá | Đã thay bằng `chat/ConversationList.tsx` |
| `Chat/ChatWindow.tsx`, `Chat/ChatInput.tsx`, `Chat/CreateConversationModal.tsx` | Xoá | Legacy chat cluster |

Lưu ý:

- Không xoá trước khi tất cả import của component đó đã được thay thế và `npm run build` pass.
- `ActionButton`, `ActionButtons`, `PrimaryInput`, `InputError`, `DataTable`, `ConfirmationModal`, `StatusBadge` vẫn là legacy workspace-only sau Phase 6; chỉ rename, chưa merge API. Việc merge để lại khi migrate Seller/Admin/Shipper.

### 5.9 Component reserved (không tính dead code)

Các component chưa có page sử dụng nhưng được giữ có chủ đích cho backlog C03/C04/C07 hoặc primitive tương lai:

- `commerce/ReturnItemPicker.tsx` — C03
- `commerce/RefundOption.tsx` — C03
- `commerce/PreferenceRow.tsx` — C07
- `ui/switch.tsx` — dùng bởi `PreferenceRow`
- `ui/table.tsx` — primitive đích thay `data-table` legacy
- `ui/error-state.tsx` — error state chuẩn
- `feedback/LoadingOverlay.tsx` — loading overlay chuẩn

Không xoá các file này trong Phase 6; ghi rõ trong `COMPONENTS.md`.

---

## 6. Chatbot bubble

### 6.1 Vị trí và kích thước

- Desktop: `fixed bottom-6 right-6`, launcher 56×56.
- Mobile: `bottom-4 right-4`, launcher 56×56, safe-area inset.
- z-index: `z-chat` = 40, thấp hơn modal (50) và toast (60).
- Không hiện khi panel đang mở; panel thay thế launcher.

### 6.2 Launcher

```text
bg-lacquer-red
text-warm-porcelain
border border-lacquer-deep
rounded-pill
shadow-float
hover:bg-lacquer-deep
active:scale-98
focus-ring
```

- Icon Lucide `MessageCircle`, 24px, stroke 1.75.
- Unread badge: `min-w-5 h-5`, `bg-warm-porcelain`, `text-lacquer-deep`, `font-mono`, `text-[11px]`, border.
- Tooltip desktop: “Trợ lý ShopNest”.
- `aria-label="Mở trợ lý ShopNest"`.
- Không dùng robot, mascot, mặt cười, emoji.

### 6.3 Panel

- Desktop: rộng 380px, cao `min(640px, calc(100dvh - 2rem))`.
- `bg-warm-porcelain`, `border-border`, `rounded-surface`, `shadow-float`.
- Header 64px:
  - Avatar tròn `bg-lacquer-wash`, icon `Sparkles` hoặc `MessageCircle`.
  - Title “Trợ lý ShopNest”.
  - Badge `AI`.
  - Status dot jade + “Trực tuyến”.
  - Nút minimize và close.
- Body:
  - Greeting bubble.
  - 3 quick reply: “Tra cứu đơn hàng”, “Chính sách đổi trả”, “Tư vấn sản phẩm”.
  - Message list dùng `ChatMessage`.
  - `aria-live="polite"`.
- Composer:
  - Textarea 44px, auto-grow tối đa 4 dòng.
  - Nút gửi primary.
  - Enter gửi, Shift+Enter xuống dòng.
- Footer micro: “Trợ lý có thể sai sót. Kiểm tra thông tin quan trọng.”
- Mobile: bottom sheet full-width, cao 85dvh, `rounded-t-sheet`, safe-area bottom.

### 6.4 Route visibility

Hiện:

- `/`
- `/search`
- `/product/*`
- `/cart`
- `/user/profile`
- `/user/orders`
- `/user/addresses`
- `/user/notifications`
- `/settings/*`

Ẩn:

- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
- `/checkout`, `/payments/*`
- `/chat`, `/customer/chat`
- `/admin/*`, `/seller/*`, `/shipper/*`

Quy tắc: `ChatDock` nhận `enabled` từ layout; không tự đoán route bằng `window.location` nếu có thể truyền prop.

### 6.5 State

- closed
- opening (scale 0.96 → 1, opacity 0 → 1, 180ms)
- open
- unread
- loading
- error
- offline

Tôn trọng `prefers-reduced-motion`.

### 6.6 Accessibility

- Focus trap khi panel mở.
- ESC đóng panel.
- Trả focus về launcher khi đóng.
- `aria-expanded`, `aria-controls`.
- Tin nhắn mới `aria-live="polite"`.
- Nút gửi có `aria-label`.
- Không tự mở panel khi user chưa click.

---

## 7. Screen coverage và phase mapping

| Screen | Page hiện có | Phase | Component chính |
|---|---|---|---|
| A01 Login | `Auth/Login.tsx` | Phase 2 | AuthLayout, AuthBrandPanel, FormField, Button |
| A02 Customer register | `Auth/Register.tsx` | Phase 2 | AuthLayout, FormField, Checkbox |
| A03 Seller register | `Auth/SellerRegister.tsx` | Phase 2 | AuthLayout variant seller |
| A04 Shipper register | `Auth/ShipperRegister.tsx` | Phase 2 | AuthLayout variant shipper |
| A05 Forgot/reset | `Auth/ForgotPassword.tsx`, `Auth/ResetPassword.tsx` | Phase 2 | AuthLayout centered, Alert |
| A06 Verify email | `Auth/VerifyEmail.tsx` | Phase 2 | AuthLayout centered, ResultState |
| S01 Home | `Home/Index.tsx` | Phase 2 | HeroEditorial, CategoryShelf, ProductShelf, TrustStrip |
| S02 Search/catalog | `Home/Search.tsx` | Phase 3 | SearchInput, FilterRail, ProductGrid, Pagination |
| S02b Daily discover | Chưa có page/route — placeholder sẽ xoá Phase 6 | Backlog | ProductGrid, CategoryPills |
| S02c Flash sale | Chưa có page/route — placeholder sẽ xoá Phase 6 | Backlog | ProductGrid, Countdown |
| S03 Product detail | `Customer/ProductDetail.tsx` | Phase 3 | ProductGallery, BuyBox, SpecTable, Reviews |
| S04 Cart | `Customer/Cart.tsx` | Phase 3 | CartLine, OrderSummary, PromoField |
| S05 Checkout | `Customer/Checkout.tsx` | Phase 3 | CheckoutStepper, FormField, RadioCard, OrderSummary |
| S06 Result | `Customer/PaymentResult.tsx` | Phase 3 | ResultState, OrderSummary |
| S01b About/Contact | `Home/About.tsx`, `Home/Contact.tsx` | Phase 2 | StorefrontLayout |
| Legal | `Legal/*.tsx` | Phase 2 | StorefrontLayout, Typography |
| C01 Orders | `Customer/Orders/Index.tsx` | Phase 4 | AccountLayout, OrderTable, Tabs |
| C02 Order detail | `Customer/Orders/Show.tsx` | Phase 4 | OrderTimeline, OrderItemRow, AddressCard |
| C03 Return | Chưa có page | Phase 4 (component-only) | ReturnItemPicker, RefundOption, FileDropzone |
| C04 Wishlist | Chưa có page | Phase 4 (component-only) | ProductCard variant wishlist |
| C05 Address | `Customer/Address/*` | Phase 4 | AddressCard, FormField, Dialog |
| C06 Profile/settings | `Customer/Profile/Index.tsx`, `Settings/*`, `Customer/ChangePassword/Index.tsx` | Phase 4 | AccountLayout, FormField, PasswordStrength |
| C07 Notifications | `Customer/Notification/Index.tsx` | Phase 4 | NotificationRow, PreferenceRow, Tabs |
| C08 Chat | `Customer/Chat/Index.tsx` | Phase 5 | ChatWorkspace, ChatComposer, OrderContextRail |
| Bubble | Mới | Phase 5 | ChatDock, ChatbotLauncher, ChatbotPanel |
| Seller | `Seller/*` | Deferred | WorkspaceShell |
| Admin | `Admin/*` | Deferred | WorkspaceShell |
| Shipper | `Shipper/*` | Deferred | WorkspaceShell |

---

## 8. Kế hoạch 7 phase

### Phase 0 — Foundations

**Mục tiêu:** Có token layer, font, format helper và checker trước khi viết bất kỳ component nào.

**Trạng thái:** Hoàn tất ngày 13/11/2026.

**Điều kiện vào:** PLAN.md được duyệt.

**Công việc:**

- [x] Tạo `resources/css/tokens.css` với đầy đủ token ở mục 4.
- [x] Tạo `resources/css/legacy-tokens.css` chứa token cũ + `.dark` tạm thời.
- [x] Tạo `resources/css/base.css` với reset, body, focus-ring, z-index utilities, reduced-motion.
- [x] Sửa `resources/css/app.css` theo thứ tự import ở mục 4.1.
- [x] Cập nhật `resources/views/app.blade.php`:
  - [x] Thêm Google Fonts: Fraunces, Be Vietnam Pro, JetBrains Mono.
  - [x] Chưa xoá font/icon legacy.
- [x] Tạo `resources/js/lib/format.ts`:
  - [x] `formatVnd`
  - [x] `formatNumber`
  - [x] `formatDate`
  - [x] `formatDateTime`
  - [x] `formatOrderCode`
- [x] Tạo `resources/js/lib/status.ts`:
  - [x] `orderStatusTone`
  - [x] `orderStatusLabel`
  - [x] `stockTone`
- [x] Tạo `resources/js/hooks/useCountdown.ts`.
- [x] Tạo `resources/js/hooks/useDisclosure.ts`.
- [x] Tạo `resources/js/types/commerce.ts`.
- [x] Tạo `scripts/check-tokens.mjs`.
- [x] Thêm script `check:tokens` vào `package.json`.
- [x] Tạo `COMPONENTS.md` skeleton.
- [x] Ghi chú migration trong `COMPONENTS.md`: legacy tokens sẽ bị xoá ở Phase 6.

**File tạo/sửa:**

```text
resources/css/tokens.css                  (new)
resources/css/legacy-tokens.css           (new, temporary)
resources/css/base.css                    (new)
resources/css/app.css                     (edit)
resources/views/app.blade.php             (edit: fonts only)
resources/js/lib/format.ts                (new)
resources/js/lib/status.ts                (new)
resources/js/hooks/useCountdown.ts        (new)
resources/js/hooks/useDisclosure.ts       (new)
resources/js/types/commerce.ts            (new)
scripts/check-tokens.mjs                  (new)
scripts/token-allowlist.json              (new: legacy baseline)
package.json                              (edit)
eslint.config.js                          (edit: Node globals for scripts/)
AGENTS.md                                 (edit: token/plan docs)
COMPONENTS.md                             (new)
```

**Kết quả Phase 0:**

- Token Nếp đã compile thành utility thật trong build CSS.
- `--font-sans` đã chuyển sang Be Vietnam Pro; Fraunces và JetBrains Mono đã có link Google Fonts.
- Legacy token vẫn được giữ trong `legacy-tokens.css` để các trang chưa migrate không vỡ.
- `check:tokens` đã có baseline 135 file legacy; file mới sẽ bị kiểm tra.
- Chưa refactor page/component nào.

**Acceptance:**

- [x] `bg-rice-paper`, `text-ink`, `text-headline-1`, `rounded-card`, `shadow-soft`, `h-control-md`, `max-w-page` dùng được.
- [x] Fraunces/Be Vietnam Pro/JetBrains Mono load đúng, không mất dấu tiếng Việt.
- [x] `npm run check:tokens` chạy và báo vi phạm thử nghiệm.
- [x] `npm run build` pass.
- [x] `npm run types` pass.
- [x] Chưa refactor page nào.

**Verify:**

```bash
npm run types
npm run build
npm run check:tokens
```

**Rủi ro:**

- Token mới chưa được dùng nên khó thấy khác biệt.
- `legacy-tokens.css` có thể xung đột font; kiểm tra `--font-sans` load sau.
- Google Fonts chậm; dùng `display=swap`.

---

### Phase 1 — Primitives

**Mục tiêu:** Có đủ primitive ổn định để Phase 2 không phải viết lại.

**Trạng thái:** Hoàn tất ngày 13/11/2026.

**Điều kiện vào:** Phase 0 pass.

**Công việc:**

#### Batch 1 — Typography và action

- [x] `ui/typography.tsx`: `Heading`, `Text`, `Eyebrow`, `MetaText`.
- [x] `ui/button.tsx`: nâng cấp variant/size/loading/asChild.
- [x] `ui/icon-button.tsx`.
- [x] `ui/text-link.tsx`.

#### Batch 2 — Form

- [x] `ui/input.tsx`.
- [x] `ui/textarea.tsx`.
- [x] `ui/select.tsx`.
- [x] `ui/checkbox.tsx`.
- [x] `ui/radio-card.tsx`.
- [x] `ui/switch.tsx`.
- [x] `ui/form-field.tsx`.
- [x] `ui/password-strength.tsx`.
- [x] `ui/search-input.tsx`.
- [x] `ui/file-dropzone.tsx`.

#### Batch 3 — Display

- [x] `ui/card.tsx`.
- [x] `ui/badge.tsx`.
- [x] `commerce/OrderStatusBadge.tsx`.
- [x] `ui/Avatar.tsx` (nâng cấp tại chỗ).
- [x] `ui/progress.tsx`.
- [x] `ui/skeleton.tsx`.

#### Batch 4 — Navigation

- [x] `ui/breadcrumbs.tsx`.
- [x] `ui/tabs.tsx`.
- [x] `ui/Pagination.tsx` (nâng cấp tại chỗ).
- [x] `ui/table.tsx`.
- [x] `ui/dropdown-menu.tsx`.
- [x] `ui/Tooltip.tsx` (nâng cấp tại chỗ).

#### Batch 5 — Overlay/feedback

- [x] `ui/dialog.tsx`.
- [x] `ui/sheet.tsx`.
- [x] `ui/toast.tsx`.
- [x] `ui/toaster.tsx`.
- [x] `ui/empty-state.tsx`.
- [x] `ui/error-state.tsx`.
- [x] `ui/alert.tsx`.
- [x] `feedback/ConfirmDialog.tsx`.
- [x] `feedback/LoadingOverlay.tsx`.
- [x] `feedback/ResultState.tsx`.

#### Batch 6 — Commerce atoms

- [x] `commerce/Price.tsx`.
- [x] `commerce/Rating.tsx`.
- [x] `commerce/QuantityStepper.tsx`.
- [x] `commerce/Countdown.tsx`.
- [x] `commerce/PaymentMarks.tsx`.

#### Batch 7 — Docs

- [x] Mỗi component có example trong `COMPONENTS.md`.
- [x] Ghi rõ props, variant, state, a11y.
- [x] Ghi rõ component nào thay thế component legacy nào.

**Kết quả Phase 1:**

- Đã dựng đủ primitive theo 7 batch.
- Primitive dùng token Nếp, Lucide và `focus-ring`; không còn hex/arbitrary value trong file mới.
- `ui/Avatar.tsx`, `ui/Tooltip.tsx`, `ui/Pagination.tsx` được nâng cấp tại chỗ để giữ tương thích; Phase 6 rename sang `ui/avatar.tsx`, `ui/tooltip.tsx`, `ui/pagination.tsx`.
- `ToastProvider`/`useToast` đã chuyển sang store mới; `app.tsx` render một `<Toaster />` duy nhất; `Contexts/ToastContext.tsx` re-export để code cũ tiếp tục chạy.
- `COMPONENTS.md` có ví dụ sử dụng cho từng nhóm primitive.

**Acceptance:**

- [x] Mọi primitive có `variant`/`size` cần thiết.
- [x] Mọi interactive component có focus-visible, disabled, loading (nếu áp dụng).
- [x] Mọi icon dùng Lucide.
- [x] Không còn hex/arbitrary value trong component mới.
- [x] `check:tokens` pass.
- [x] `npm run types`, `npm run build` pass.
- [x] Chưa refactor page nào.

**Verify:**

```bash
npm run types
npm run lint
npm run build
npm run check:tokens
```

**Rủi ro:**

- API quá nhiều variant gây phức tạp; giữ variant tối thiểu dùng thật.
- Radix Dialog/Sheet cần kiểm tra SSR/Inertia.
- Toast provider phải đặt đúng trong `app.tsx`, không tạo provider trùng.

---

### Phase 2 — Layout + Auth + Home

**Mục tiêu:** Chốt “xương sống” storefront và auth; migrate S01 + A01–A06.

**Trạng thái:** Hoàn tất ngày 14/11/2026.

**Điều kiện vào:** Phase 1 pass.

**Công việc:**

#### Batch 1 — Layout

- [x] `layout/PageContainer.tsx`.
- [x] `layout/PageHeader.tsx`.
- [x] `layout/SectionHeader.tsx`.
- [x] `layout/StorefrontHeader.tsx`:
  - [x] Logo.
  - [x] Search.
  - [x] Links: Danh mục, Khuyến mãi, Shop Việt, Đơn hàng.
  - [x] Language VI, currency VND.
  - [x] Account dropdown.
  - [x] Cart count.
  - [x] Mobile menu.
- [x] `layout/StorefrontFooter.tsx`:
  - [x] 4 cột.
  - [x] Newsletter.
  - [x] Legal links.
  - [x] Payment marks.
- [x] `layout/StorefrontLayout.tsx`.
- [x] `layout/AuthLayout.tsx`.
- [x] `layout/AuthBrandPanel.tsx`.
- [x] `layout/MobileNav.tsx`.

#### Batch 2 — Home modules

- [x] `storefront/HeroEditorial.tsx`.
- [x] `storefront/UtilityStrip.tsx`.
- [x] `storefront/CategoryShelf.tsx`.
- [x] `storefront/FlashSaleModule.tsx`.
- [x] `storefront/ProductShelf.tsx`.
- [x] `storefront/TrustStrip.tsx`.
- [x] `storefront/EditorialPillars.tsx`.
- [x] `storefront/BrandSpotlight.tsx`.
- [x] `storefront/NewsletterSignup.tsx`.

#### Batch 3 — Auth pages

- [x] `Auth/Login.tsx`.
- [x] `Auth/Register.tsx`.
- [x] `Auth/SellerRegister.tsx`:
  - [x] Xác định route `seller.register` dùng `Auth/SellerRegister.tsx`.
  - [x] Migrate `SellerRegister` + `SellerRegisterForm`; `auth/seller-register-page.tsx` cũ sẽ xoá ở Phase 6.
- [x] `Auth/ShipperRegister.tsx`.
- [x] `Auth/ForgotPassword.tsx`.
- [x] `Auth/ResetPassword.tsx`.
- [x] `Auth/VerifyEmail.tsx`.

#### Batch 4 — Home/static pages

- [x] `Home/Index.tsx`.
- [x] `Home/About.tsx`.
- [x] `Home/Contact.tsx`.
- [x] `Legal/Terms.tsx`.
- [x] `Legal/PrivacyPolicy.tsx`.
- [x] `Legal/SellingPolicy.tsx`.

#### Batch 5 — Cleanup riêng phase

- [x] Xoá import `HomeLayout` khỏi các page đã migrate.
- [x] Xoá import CSS legacy khỏi các page đã migrate.
- [x] Chưa xoá file legacy.

**Kết quả Phase 2:**

- Đã dựng `PageContainer`, `PageHeader`, `SectionHeader`, `StorefrontHeader`, `StorefrontFooter`, `StorefrontLayout`, `AuthLayout`, `AuthBrandPanel`, `MobileNav`.
- Header có search, nav, language/currency, account dropdown, cart, notifications và mobile sheet.
- Đã dựng đủ home modules: Hero, UtilityStrip, CategoryShelf, FlashSaleModule, ProductShelf, TrustStrip, EditorialPillars, BrandSpotlight, NewsletterSignup.
- Đã dựng `ProductCard` sớm để home shelves dùng chung với Phase 3.
- Đã migrate A01–A06, S01, About, Contact và 3 trang Legal sang layout/component mới.
- `HomeLayout` chỉ còn wrapper tương thích sang `StorefrontLayout`; các page chưa migrate vẫn chạy.
- `HomeController` trả thêm `cartCount` để header hiển thị đúng số món.
- `COMPONENTS.md` có thêm ví dụ layout/storefront.

**Acceptance:**

- [x] S01 render đúng 6 category, hero 7/5, trust strip.
- [x] Header search hoạt động; cart count đúng; account dropdown đúng role.
- [x] Auth pages giữ nguyên route, form name, CSRF, validation error.
- [x] Google login vẫn hoạt động.
- [x] Không có horizontal scroll ở 390px.
- [x] Không còn Material Symbol/Boxicon trong các page đã migrate.
- [x] `npm run types`, `npm run lint`, `npm run build` pass.
- [x] `php artisan test` pass.

**Verify:**

```bash
npm run types
npm run lint
npm run build
npm run check:tokens
php artisan test
```

Manual:

- 390×844
- 768×1024
- 1024×768
- 1440×1024

**Rủi ro:**

- Navbar chưa có mẫu Stitch; cần review sớm.
- Auth có nhiều page trùng; phải kiểm tra route trước khi xoá.
- Footer newsletter có thể chưa có backend; giữ UI + trạng thái disabled nếu cần.

---

### Phase 3 — Storefront flow

**Mục tiêu:** Migrate toàn bộ luồng mua hàng S02 → S06.

**Trạng thái:** Hoàn tất ngày 14/11/2026.

**Điều kiện vào:** Phase 2 pass.

**Công việc:**

#### Batch 1 — Catalog components

- [x] `commerce/ProductCard.tsx`.
- [x] `commerce/ProductGrid.tsx`.
- [x] `commerce/FilterRail.tsx`.
- [x] `commerce/FilterGroup.tsx`.
- [x] `commerce/ActiveFilters.tsx`.
- [x] `commerce/CategoryPills.tsx`.

#### Batch 2 — Product detail components

- [x] `commerce/ProductGallery.tsx`.
- [x] `commerce/BuyBox.tsx`.
- [x] `commerce/VariantSelector.tsx`.
- [x] `commerce/SpecTable.tsx`.
- [x] `commerce/ShopIdentity.tsx`.
- [x] `commerce/ReviewSummary.tsx`.
- [x] `commerce/ReviewCard.tsx`.

#### Batch 3 — Cart/checkout components

- [x] `commerce/CartLine.tsx`.
- [x] `commerce/OrderSummary.tsx`.
- [x] `commerce/PromoField.tsx`.
- [x] `commerce/CheckoutStepper.tsx`.
- [x] `commerce/ShippingOption.tsx` — sẽ xoá Phase 6 vì checkout chỉ có một phương thức vận chuyển backend.
- [x] `commerce/PaymentOption.tsx`.

#### Batch 4 — Pages

- [x] `Home/Search.tsx`.
- [x] `Home/daily-discover-page.tsx` — sẽ xoá Phase 6 vì chưa có route/controller.
- [x] `Home/flash-sale-page.tsx` — sẽ xoá Phase 6 vì chưa có route/controller.
- [x] `Customer/ProductDetail.tsx`.
- [x] `Customer/Cart.tsx`.
- [x] `Customer/Checkout.tsx`.
- [x] `Customer/PaymentResult.tsx`.

#### Batch 5 — Behavior

- [x] Search + query params.
- [x] Filter state + clear all.
- [x] Sort.
- [x] Pagination.
- [x] Product variant selection.
- [x] Add to cart.
- [x] Buy now.
- [x] Cart quantity update/remove.
- [x] Promotion apply/remove.
- [x] Shipping method.
- [x] Payment Stripe/COD.
- [x] Empty/skeleton/error states.
- [x] Mobile sticky summary.

**Kết quả Phase 3:**

- Đã dựng 18 component commerce (trong đó `ShippingOption` sẽ xoá ở Phase 6) và migrate đủ 7 page S02–S06 sang `StorefrontLayout` + token Nếp.
- `Search.tsx` giữ nguyên query key backend (`search`, `category_ids[]`, `brand_ids[]`, `price_min/max`, `rating_min`, `states[]`, `sort`, `page`), thêm filter rail sticky, sheet bộ lọc mobile, chip bộ lọc đang chọn và phân trang server-side.
- `ProductDetail.tsx` giữ nguyên route/payload `add-to-cart`, `buy-now`, wishlist; thêm gallery, variant selector, spec table, review summary/card và rail shop.
- `Cart.tsx` sửa mutation về đúng route backend: `POST /cart/update/{itemId}` và `POST /cart/remove/{itemId}`; CTA thanh toán chuyển sang `/checkout`; giữ `apply-promotion`/`remove-promotion`.
- `Checkout.tsx` giữ nguyên `POST /checkout` và `POST /buy-now/checkout/{orderId}` với payload `provider`, `address_id`, `notes`; thêm stepper, chọn địa chỉ, Stripe/COD, promo, ghi chú và confirm khi rời trang.
- `PaymentResult.tsx` dùng `ResultState` + `OrderSummary`; `daily-discover` và `flash-sale` là placeholder không có route/controller, sẽ xoá ở Phase 6.
- `CheckoutAddressForm` và `CheckoutExitConfirmation` được viết lại bằng primitive; `RadioCard` mở type `title` để nhận ReactNode.
- `COMPONENTS.md` có thêm ví dụ catalog/detail/cart/checkout.

**Acceptance:**

- [x] Không đổi payload/route hiện có.
- [x] Tổng tiền khớp backend.
- [x] Cart empty state đúng copy.
- [x] Checkout validation hiển thị đúng field.
- [x] Stripe redirect và COD flow không đổi.
- [x] Product card metadata đúng ngành.
- [x] `check:tokens` pass.
- [x] `php artisan test` pass — lần chạy đầy đủ gần nhất: 415 deprecated (do PHP 8.5 + `PDO::MYSQL_ATTR_SSL_CA`), 4 passed, 0 failed. `OrderControllerTest::test_user_can_create_order_from_cart` từng fail một lần do thứ tự chạy, pass lại khi chạy riêng class và ở lần full suite sau.

**Verify:**

```bash
npm run types
npm run lint
npm run build
npm run check:tokens
php artisan test
```

Manual flow:

1. Search → filter → product detail.
2. Add to cart → update quantity → apply promotion.
3. Checkout COD → result.
4. Checkout Stripe test → result.
5. Buy now.
6. Empty cart.
7. Out-of-stock variant.

**Rủi ro:**

- Cart/checkout coupling với controller.
- Promotion state.
- Address selects.
- Stripe redirect.
- Buy-now route.
- Product detail có thể có gallery logic cũ.

---

### Phase 4 — Account

**Mục tiêu:** Migrate C01, C02, C05, C06, C07; chuẩn bị component cho C03/C04.

**Trạng thái:** Hoàn tất ngày 14/11/2026.

**Điều kiện vào:** Phase 3 pass.

**Công việc:**

#### Batch 1 — Account layout/components

- [x] `layout/AccountLayout.tsx`.
- [x] `commerce/OrderTable.tsx`.
- [x] `commerce/OrderTimeline.tsx`.
- [x] `commerce/OrderItemRow.tsx`.
- [x] `commerce/AddressCard.tsx`.
- [x] `commerce/NotificationRow.tsx`.
- [x] `commerce/PreferenceRow.tsx`.
- [x] `commerce/ReturnItemPicker.tsx` (component-only).
- [x] `commerce/RefundOption.tsx` (component-only).

#### Batch 2 — Orders

- [x] `Customer/Orders/Index.tsx`.
- [x] `Customer/Orders/Show.tsx`.

#### Batch 3 — Address

- [x] `Customer/Address/Index.tsx`.
- [x] `Customer/Address/Create.tsx`.
- [x] `Customer/Address/Edit.tsx`.
- [x] `Customer/Address/Show.tsx`.

#### Batch 4 — Profile/settings

- [x] `Customer/Profile/Index.tsx`.
- [x] `Customer/ChangePassword/Index.tsx`.
- [x] `Settings/Profile.tsx`.
- [x] `Settings/Password.tsx`.
- [x] `Settings/Appearance.tsx`.

#### Batch 5 — Notifications

- [x] `Customer/Notification/Index.tsx`.
- [x] `Notifications/Index.tsx` — page demo cũ, redirect `/notifications`; sẽ xoá Phase 6.
- [x] Kiểm tra route `/notifications` và `/user/notifications`.
- [x] Thống nhất một page chuẩn; page còn lại redirect hoặc giữ nếu là demo.

#### Batch 6 — C03/C04

- [x] Build component C03/C04.
- [x] Chưa tạo route/page mới nếu chưa có yêu cầu.
- [x] Ghi vào backlog: tích hợp khi page được tạo.

**Kết quả Phase 4:**

- Đã dựng `AccountLayout` dùng `StorefrontLayout` + `PageHeader` + thanh điều hướng tài khoản (Đơn hàng, Địa chỉ, Hồ sơ, Mật khẩu, Thông báo, Cài đặt).
- Đã dựng 8 component account: `OrderTable`, `OrderTimeline`, `OrderItemRow`, `AddressCard`, `NotificationRow`, `PreferenceRow`, `ReturnItemPicker`, `RefundOption`.
- C01: bảng đơn hàng desktop + card mobile, lọc theo trạng thái, tìm kiếm debounce, trạng thái/thanh toán map từ enum backend sang badge Nếp.
- C02: trang chi tiết dùng props thật của controller (`code`, `total`, `items[].product_name`, …), có timeline, tóm tắt thanh toán, địa chỉ giao hàng, mua lại, huỷ đơn (dialog + lý do), gửi đánh giá 1–5 sao.
- C05: CRUD địa chỉ đầy đủ; sửa route đặt mặc định từ `POST /user/addresses/{id}/set-default` (không tồn tại) sang `PATCH /user/addresses/{id}/default`; form dùng API `{success, data}` của controller.
- C06: hồ sơ + đổi mật khẩu + 3 trang `/settings/*` đều dùng `AccountLayout`/`FormField`/`PasswordStrength`; giữ nguyên payload `POST /user/profile` (`_method=PUT`), `POST /user/change-password`, `PATCH /settings/profile`, `PUT /settings/password`.
- C07: `/user/notifications` là page chuẩn với tab lọc, mark-read và mark-all-read; `/notifications` chuyển thành redirect để không còn hai page trùng.
- C03/C04: `ReturnItemPicker`, `RefundOption` và `ProductCard variant="wishlist"` đã sẵn sàng; chưa tạo route/page.
- Backend chỉ thêm dữ liệu hiển thị cho `OrderController@show` (`created_at`, `can_review`, `shipping_address`, `reviews`) — không đổi logic/route.
- `COMPONENTS.md` có thêm ví dụ account.

**Acceptance:**

- [x] Order table responsive: table desktop, card mobile.
- [x] Status badge đúng màu.
- [x] Timeline đúng current step.
- [x] Address CRUD hoạt động.
- [x] Avatar upload hoạt động.
- [x] Profile/password validation giữ nguyên.
- [x] Notification read/mark-all-read hoạt động.
- [x] Settings tabs đúng.
- [x] Không còn CSS legacy trong page đã migrate.
- [x] `php artisan test` pass.

**Verify:**

```bash
npm run types
npm run lint
npm run build
npm run check:tokens
php artisan test
```

Manual:

- Cập nhật profile.
- Đổi mật khẩu.
- Thêm/sửa/xoá địa chỉ.
- Đặt mặc định.
- Xem order + timeline.
- Đọc notification.
- Mark all read.

**Rủi ro:**

- Hai page notification trùng.
- Hai page profile trùng.
- Address form có select phụ thuộc API.
- AvatarUpload cũ có crop/upload logic riêng.
- Appearance/dark mode: chưa quyết định; giữ nguyên hành vi cũ, không thiết kế dark mới.

---

### Phase 5 — Chat + Chatbot bubble

**Mục tiêu:** Migrate C08 và thay toàn bộ chat bubble cũ bằng hệ chat tokenized.

**Trạng thái:** Hoàn tất ngày 14/11/2026.

**Điều kiện vào:** Phase 4 pass.

**Công việc:**

#### Batch 1 — Chat primitives

- [x] `chat/ChatMessage.tsx`.
- [x] `chat/TypingIndicator.tsx`.
- [x] `chat/QuickReplies.tsx`.
- [x] `chat/ChatComposer.tsx`.
- [x] `chat/MessageList.tsx`.

#### Batch 2 — Chat workspace

- [x] `chat/ConversationRow.tsx`.
- [x] `chat/ConversationList.tsx`.
- [x] `chat/ChatHeader.tsx`.
- [x] `chat/ChatWorkspace.tsx`.
- [x] `commerce/OrderAnnouncementCard.tsx`.
- [x] `commerce/OrderContextRail.tsx`.

#### Batch 3 — Bubble

- [x] `chat/ChatbotLauncher.tsx`.
- [x] `chat/ChatbotPanel.tsx`.
- [x] `chat/ChatDock.tsx`.
- [x] Tích hợp `ChatDock` vào `StorefrontLayout` và `AccountLayout`.
- [x] Ẩn theo route như mục 6.4.
- [x] Focus trap, ESC, aria-live.
- [x] Mobile bottom sheet.

#### Batch 4 — Page

- [x] `Customer/Chat/Index.tsx`.
- [x] Kiểm tra `chat/ChatPopup.tsx` và `Chatbot.tsx` cũ.
- [x] Chuyển logic gửi chat 1-1 sang `ChatWorkspace`.
- [x] Chuyển logic chatbot AI sang `ChatbotPanel`.
- [x] Giữ endpoint `/chatbot/message`.
- [x] Giữ Echo/Reverb behavior.

#### Batch 5 — States

- [x] Empty conversation.
- [x] Typing.
- [x] Failed send.
- [x] Loading messages.
- [x] Unread count.
- [x] Assistant conversation.
- [x] Shop conversation.
- [x] Order context rail.

**Kết quả Phase 5:**

- Đã dựng 12 component chat + 2 component commerce cho C08; toàn bộ dùng token Nếp/Lucide, không import CSS chat legacy.
- `useChatConversations` gom logic fetch, normalize, gửi tin, mark-read, tạo cuộc trò chuyện, tìm người dùng và Echo (`chat.{id}` / `.message.created`) từ `ChatPopup` cũ.
- `ChatWorkspace` là C08 3-pane: danh sách cuộc trò chuyện, cửa sổ chat, rail ngữ cảnh đơn; mobile chuyển thành list → chat với nút quay lại.
- `ChatDock` mount một lần ở `StorefrontLayout` (AccountLayout kế thừa), tự ẩn ở Auth/Checkout/Payment/Chat/Workspace; launcher 56px, panel desktop 380px, mobile bottom sheet 85dvh, Radix lo focus trap/ESC/aria và trả focus về launcher.
- Chatbot AI giữ `POST /chatbot/message`, chỉ gửi khi user click; lịch sử lưu localStorage theo user id, tối đa 40 tin.
- Thêm route `GET /customer/chat` (name `customer.chat.index`) và redirect `/chat` → `/customer/chat`; JSON endpoints `/chat/*` giữ nguyên.
- Bỏ mount `Chatbot` cũ khỏi `AppLayout` để không còn 2 bubble; `Chatbot.tsx`, `ChatBubble.tsx`, `ChatWindow.tsx`, `chat/ChatPopup.tsx`… sẽ xoá ở Phase 6.
- `OrderAnnouncementCard`/`OrderContextRail` sẵn sàng nhận order context khi backend trả kèm; hiện C08 chưa có order gắn conversation nên rail chỉ hiện khi truyền prop.
- `COMPONENTS.md` có thêm ví dụ chat.

**Acceptance:**

- [x] Chat 1-1 gửi/nhận được.
- [x] Chatbot AI gửi/nhận được.
- [x] Không còn 2 bubble cùng lúc.
- [x] Bubble không hiện ở Auth/Checkout/Payment/Chat/Workspace.
- [x] Bubble hiện ở Home/Product/Cart/Account.
- [x] Mobile panel dùng bottom sheet, không tràn.
- [x] `aria-expanded` đúng.
- [x] Focus trả về launcher khi đóng.
- [x] `check:tokens` pass.
- [x] `php artisan test` pass.

**Verify:**

```bash
npm run types
npm run lint
npm run build
npm run check:tokens
php artisan test
```

Manual:

- Mở/đóng bubble.
- Gửi tin assistant.
- Mở C08, chọn shop, gửi tin.
- Mobile 390×844.
- Reverb chạy và không chạy.

**Rủi ro:**

- Echo/Reverb cần server riêng.
- Hai backend chat khác nhau.
- Scroll auto-bottom.
- Tin nhắn dài, ảnh, failed state.
- Bubble có thể che CTA mobile; kiểm tra safe-area.

---

### Phase 6 — Cleanup + Verification

**Mục tiêu:** Xoá file chết, chuẩn hoá tên file/page, bỏ asset legacy không còn dùng, giữ workspace build được, full QA.

**Trạng thái:** Hoàn tất ngày 15/11/2026.

**Điều kiện vào:** Phase 5 pass; tất cả page trong phạm vi Storefront/Auth/Account/Chat đã migrate.

**Nguyên tắc Phase 6:**

1. File không còn dùng → xoá.
2. File còn dùng nhưng sai quy ước → rename, không đổi API.
3. Workspace Seller/Admin/Shipper chưa migrate: chỉ rename file legacy, không merge API, không xoá Boxicons/Page.css/legacy tokens.
4. Mỗi batch phải chạy `types`, `lint`, `build`, `check:tokens`; cuối phase chạy `php artisan test`.
5. Rename case-only phải qua tên tạm `.tmp` để tránh lỗi filesystem Windows.

**Công việc:**

#### Batch 0 — Baseline và backup

- [x] Backup `resources/js`, `resources/css`, `resources/views/app.blade.php` (repo chưa có git).
- [x] Chạy baseline: `npm run types`, `npm run lint`, `npm run build`, `npm run check:tokens`, `php artisan test`.
- [x] Ghi lại số file/allowlist hiện tại: 238 file checked, 129 legacy allowlisted.

#### Batch 1 — Xoá JS/TS chết (120 file)

- [x] Xoá toàn bộ `components/home/**` (27 file).
- [x] Xoá toàn bộ `components/customer/**` (14 file).
- [x] Xoá toàn bộ `components/product-detail/**` (8 file).
- [x] Xoá toàn bộ `components/cart/**` (5 file).
- [x] Xoá toàn bộ `components/Shared/**` (5 file).
- [x] Xoá toàn bộ `components/settings/**` (4 file).
- [x] Xoá legacy chat: `components/Chat/ChatInput.tsx`, `ChatList.tsx`, `ChatPopup.tsx`, `ChatWindow.tsx`, `CreateConversationModal.tsx`.
- [x] Xoá `components/Checkout/CheckoutModal.tsx`, `CheckoutOrderNotes.tsx`, `CheckoutPaymentSection.tsx`, `CheckoutProductList.tsx`.
- [x] Xoá `components/admin/Shops/BulkActions.tsx`, `Shops/ShopFilters.tsx`.
- [x] Xoá `components/admin/categories/CategoryFilters.tsx`, `CategoryTable.tsx`.
- [x] Xoá `components/admin/orders/OrderActionsDropdown.tsx`.
- [x] Xoá `components/admin/promotions/AutoApplyToggle.tsx`, `CsvImportModal.tsx`, `PromotionForm.tsx`, `RuleBuilder.tsx`, `RulePreview.tsx`.
- [x] Xoá 8 component auth chết: `AuthButton`, `AuthContainer`, `AuthInput`, `AuthSocialIcons`, `SellerAuthContainer`, `SignInForm`, `SignUpForm`, `TogglePanel` (giữ `SellerRegisterForm.tsx`).
- [x] Xoá `components/ui/AvatarUpload.tsx`, `CurrencyDropdown.tsx`, `NotificationToast.tsx`, `OrderStatusCell.tsx`.
- [x] Xoá root legacy: `Chatbot.tsx`, `ChatBubble.tsx`, `ChatWindow.tsx`, `Message.tsx`, `EmailPromptBanner.tsx`, `Icons.tsx`, `InputError.tsx`, `InputLabel.tsx`, `Main.tsx`, `PrimaryButton.tsx`, `TextInput.tsx`, `input-error.tsx`, `product-card.tsx`, `text-link.tsx`.
- [x] Xoá `layouts/app/CustomerLayout.tsx`, `HomeLayout.tsx`, `SellerLayout.tsx`, `ShipperLayout.tsx`, `layouts/app-layout.tsx`, `layouts/settings/SettingLayout.tsx`.
- [x] Xoá `hooks/useClickOutside.ts`, `useDarkMode.ts`, `usePerformanceMonitor.ts`.
- [x] Xoá `lib/csrf.ts`, `echo.js`.
- [x] Xoá `components/commerce/ShippingOption.tsx`.
- [x] Chạy verify Batch 1.

#### Batch 2 — Xoá page chết (7 file)

- [x] Xoá `pages/Home/daily-discover-page.tsx` (không route/controller).
- [x] Xoá `pages/Home/flash-sale-page.tsx` (không route/controller).
- [x] Xoá `pages/Notifications/Index.tsx` và `pages/Notifications/types.ts`.
- [x] Xoá `pages/Seller/Register.tsx`.
- [x] Xoá `pages/auth/seller-register-page.tsx`.
- [x] Xoá `pages/Admin/Orders/Index.backup.tsx`.
- [x] Chạy verify Batch 2.

#### Batch 3 — Prune allowlist + xoá CSS chết

- [x] Xoá entry trong `scripts/token-allowlist.json` ứng với file đã xoá.
- [x] Xoá CSS không còn importer:
  - [x] `AuthPage.css`, `cart-page.css`, `Chat.css`, `chatbot.css`, `chatbot-animations.css`.
  - [x] `Customer.css`, `home-filter.css`, `Home.css`, `login-page.css`, `navbar.css`.
  - [x] `NotificationToast.css`, `payment-result-popup.css`, `PopupAddToCart.css`.
  - [x] `ProductCard.css`, `ProductDetail.css`, `quill-custom.css`, `register-page.css`.
  - [x] `seller-register-page.css`, `SellerRegister.css`, `VerifyEmail.css`.
  - [x] Toàn bộ `customer-style/*.css` (10 file).
  - [x] `home-style/home-page.css`, `home-style/search-page.css`, `home-style/search-product-card.css`.
- [x] Review `payment.css`: xoá nếu không còn class nào dùng; nếu còn thì giữ.
- [x] Giữ `Page.css` (workspace).
- [x] Chạy verify Batch 3.

#### Batch 4 — Chuẩn hoá page + render string

- [x] Đổi `pages/auth` → `pages/Auth`.
- [x] Rename:
  - [x] `Auth/Login.tsx`
  - [x] `Auth/Register.tsx`
  - [x] `Auth/ForgotPassword.tsx`
  - [x] `Auth/ResetPassword.tsx`
  - [x] `Auth/SellerRegister.tsx`
  - [x] `Auth/ShipperRegister.tsx`
  - [x] `Auth/VerifyEmail.tsx`
- [x] Rename `Home/search-page.tsx` → `Home/Search.tsx`.
- [x] Rename `Customer/Detail.tsx` → `Customer/ProductDetail.tsx`.
- [x] Cập nhật `Inertia::render`:
  - [x] `auth/login-page` → `Auth/Login`
  - [x] `auth/register-page` → `Auth/Register`
  - [x] `auth/forgot-password` → `Auth/ForgotPassword`
  - [x] `auth/reset-password` → `Auth/ResetPassword`
  - [x] `auth/SellerRegister` → `Auth/SellerRegister`
  - [x] `auth/ShipperRegister` → `Auth/ShipperRegister`
  - [x] `auth/VerifyEmail` → `Auth/VerifyEmail`
  - [x] `auth/confirm-password` → `Auth/ConfirmPassword` (page vẫn thiếu, ghi backlog)
  - [x] `Home/search-page` → `Home/Search`
  - [x] `Customer/Detail` → `Customer/ProductDetail`
- [x] Chạy verify Batch 4.

#### Batch 5 — Rename/move component + import

- [x] Đổi `components/Chat` → `components/chat`; cập nhật import `@/components/chat/...`.
- [x] Move `components/Checkout/CheckoutAddressForm.tsx` → `components/commerce/CheckoutAddressForm.tsx`.
- [x] Move `components/Checkout/CheckoutExitConfirmation.tsx` → `components/commerce/CheckoutExitConfirmation.tsx`.
- [x] Xoá folder `components/Checkout` sau khi move.
- [x] Move 6 file `components/Analytics/*` → `components/admin/analytics/*`.
- [x] Xoá folder `components/Analytics` sau khi move.
- [x] Rename `components/ui` sang kebab:
  - [x] `ActionButton` → `action-button`
  - [x] `ActionButtons` → `action-buttons`
  - [x] `ActionDropdown` → `action-dropdown`
  - [x] `Avatar` → `avatar`
  - [x] `ConfirmationModal` → `confirmation-modal`
  - [x] `DataTable` → `data-table`
  - [x] `FilterPanel` → `filter-panel`
  - [x] `Header` → `header`
  - [x] `InputError` → `input-error`
  - [x] `Insights` → `insights`
  - [x] `LanguageSwitcher` → `language-switcher`
  - [x] `Navbar` → `navbar`
  - [x] `Pagination` → `pagination`
  - [x] `PrimaryInput` → `primary-input`
  - [x] `RichTextEditor` → `rich-text-editor`
  - [x] `Sidebar` → `sidebar`
  - [x] `StatusBadge` → `status-badge`
  - [x] `Tooltip` → `tooltip`
- [x] Cập nhật toàn bộ import trong pages/components/layouts.
- [x] Chạy verify Batch 5.

#### Batch 6 — Font/icon/CDN

- [x] `resources/views/app.blade.php`: xoá Instrument Sans (Bunny Fonts).
- [x] Xoá Montserrat.
- [x] Xoá Plus Jakarta Sans.
- [x] Xoá Material Symbols.
- [x] Xoá Bootstrap Icons.
- [x] Xoá Font Awesome CDN.
- [x] Xoá import `@fortawesome/fontawesome-free/css/all.min.css` trong `app.tsx`.
- [x] Xoá Tailwind CDN.
- [x] **Giữ Boxicons** vì 45 file workspace còn dùng.
- [x] Giữ Google Fonts Nếp + Vite assets.
- [x] Chạy verify Batch 6; kiểm tra icon workspace vẫn hiển thị.

#### Batch 7 — Fix route/page mismatch + reserved

- [x] `routes/user.php`: `Inertia::render('PaymentResult')` → `Inertia::render('Customer/PaymentResult')`.
- [x] Giữ các route workspace trỏ page thiếu làm backlog; không xoá route.
- [x] Ghi backlog cho các page/route thiếu: CustomerSegments, Admin/Orders/Show, Admin/Returns/Show, Seller/Wallet, Seller/Reports, Seller/Promotions/Edit|Show, Product/Index|Show, Auth/ConfirmPassword.
- [x] Giữ component reserved và ghi rõ trong `COMPONENTS.md`:
  - [x] `commerce/ReturnItemPicker.tsx`
  - [x] `commerce/RefundOption.tsx`
  - [x] `commerce/PreferenceRow.tsx`
  - [x] `ui/switch.tsx`
  - [x] `ui/table.tsx`
  - [x] `ui/error-state.tsx`
  - [x] `feedback/LoadingOverlay.tsx`

#### Batch 8 — Token (deferred một phần)

- [x] **Không xoá** `legacy-tokens.css` trong Phase 6.
- [x] **Không xoá** `.dark` trong Phase 6.
- [x] Không chuyển alias shadcn sang Nếp trong Phase 6.
- [x] `body` vẫn dùng Rice Paper cho khu vực đã migrate; workspace giữ token cũ qua Page.css/legacy-tokens.
- [x] Ghi backlog: token cleanup + dark mode + alias shadcn chỉ làm khi migrate workspace.

#### Batch 9 — Docs/CI

- [x] Cập nhật `COMPONENTS.md`: đường dẫn mới, reserved list, workspace legacy list.
- [x] Cập nhật `PLAN.md`: trạng thái Phase 6, backlog.
- [x] Thêm quy ước naming vào `AGENTS.md`.
- [x] Thêm `check:tokens` vào CI sau lint.
- [x] Cập nhật `DESIGN.md` link tới `COMPONENTS.md` nếu phù hợp.

#### Batch 10 — Full QA

- [x] Tất cả page trong phạm vi ở 390/768/1024/1440.
- [x] Không horizontal scroll.
- [x] Không console error.
- [x] Keyboard navigation.
- [x] Focus ring.
- [x] Contrast.
- [x] 44px targets.
- [x] `prefers-reduced-motion`.
- [x] Ảnh 4:5 không méo.
- [x] Giá/ngày đúng format.
- [x] Chat bubble không che CTA.
- [x] `npm run types`, `lint`, `build`, `check:tokens`.
- [x] `php artisan test`.
- [x] `php artisan dusk` cho flow chính (nếu môi trường cho phép).

**Kết quả Phase 6:**

- Đã xoá 120 file JS/TS chết và 7 file page chết; allowlist giảm từ 129 xuống 63.
- Đã xoá 33 file CSS legacy; giữ `Page.css` cho workspace và `legacy-tokens.css`/tokens/base theo kế hoạch.
- Đã chuẩn hoá naming: `pages/Auth/*`, `Home/Search`, `Customer/ProductDetail`, `components/chat`, `components/admin/analytics`, `components/commerce/Checkout*`, 18 file `components/ui` sang kebab-case.
- Đã sửa `PaymentResult` về `Customer/PaymentResult`; `Auth/ConfirmPassword` và các page workspace thiếu vẫn là backlog.
- Đã bỏ Instrument Sans, Montserrat, Plus Jakarta, Material Symbols, Bootstrap Icons, Font Awesome, Tailwind CDN và `payment.css`; giữ Boxicons + `Page.css`.
- Giữ reserved components và workspace legacy rename-only; chưa merge API.
- `npm run types`, `lint`, `build`, `check:tokens` pass; `php artisan test` pass.

**Acceptance:**

- [x] Storefront/Auth/Account/Chat không còn import legacy.
- [x] Không còn file chết ngoài reserved list.
- [x] Không còn page chết (daily-discover, flash-sale, Notifications demo, Seller/Register, seller-register-page, Admin backup).
- [x] Tất cả file đang dùng tuân quy ước naming mới.
- [x] Không còn Material Symbols/Bootstrap Icons/Font Awesome/Instrument Sans/Montserrat/Plus Jakarta/Tailwind CDN.
- [x] Boxicons + `Page.css` + `legacy-tokens.css` được giữ có chủ đích cho workspace.
- [x] Storefront/Auth/Account/Chat: một pattern chỉ còn một component.
- [x] Workspace legacy được rename và ghi rõ TODO merge, không tính là dead code.
- [x] Build production pass.
- [x] Tests pass.
- [x] Seller/Admin/Shipper vẫn build được và icon vẫn hiển thị.

**Verify:**

```bash
npm run types
npm run lint
npm run build
npm run check:tokens
php artisan test
php artisan dusk
```

**Rủi ro:**

- Xoá legacy quá sớm gây vỡ page chưa migrate.
- Rename case-only trên Windows dễ sai casing; phải qua `.tmp` và soát import.
- `Inertia::render` string sai casing sẽ chỉ lộ trên Linux CI.
- Tailwind CDN removal có thể làm mất class động; phải build + QA.
- Boxicons/Page.css/legacy-tokens không được xoá khi workspace chưa migrate.
- Route workspace trỏ page thiếu vẫn là backlog, không phải regression mới.

**Quy tắc an toàn Phase 6:**

1. `grep`/audit toàn repo trước khi xoá từng cụm.
2. Build sau mỗi batch.
3. Không xoá Boxicons/Page.css/legacy-tokens khi workspace chưa migrate.
4. Không xoá route workspace khi chưa có quyết định product.
5. Reserved components không bị coi là dead code.

---

## 9. Test matrix

### 9.1 Automated

| Lệnh | Khi nào | Mục đích |
|---|---|---|
| `npm run types` | Mỗi batch | TypeScript |
| `npm run lint` | Mỗi batch | ESLint + Prettier |
| `npm run build` | Mỗi phase | Vite production |
| `npm run check:tokens` | Mỗi batch | Token compliance |
| `php artisan test` | Mỗi phase | Backend + feature |
| `php artisan dusk` | Phase 6 | E2E critical flows |

### 9.2 Manual viewport

| Viewport | Kiểm tra |
|---|---|
| 390×844 | Mobile, bottom sheet, sticky bar, 1 cột |
| 768×1024 | Tablet, 2 cột, nav |
| 1024×768 | Tablet ngang, filter rail |
| 1440×1024 | Desktop, 12 cột, 4-up grid |

### 9.3 Critical flows

1. Login / logout.
2. Register customer.
3. Search → filter → product detail.
4. Add to cart → update quantity.
5. Apply promotion.
6. Checkout COD.
7. Checkout Stripe test.
8. Buy now.
9. Order tracking.
10. Address CRUD.
11. Notification read.
12. Chat 1-1.
13. Chatbot AI.
14. Bubble open/close mobile.

### 9.4 Accessibility checklist

- [ ] Keyboard tab order.
- [ ] Focus visible.
- [ ] ESC đóng dialog/sheet/chat.
- [ ] Focus trap trong modal/panel.
- [ ] `aria-label` cho icon button.
- [ ] `aria-live` cho toast/chat.
- [ ] `aria-expanded` cho dropdown/chat.
- [ ] Label gắn với input.
- [ ] Error text gắn với field.
- [ ] Contrast text ≥ 4.5:1.
- [ ] Target ≥ 44×44.

---

## 10. Rủi ro và cách giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---:|---|
| Navbar không có mẫu Stitch | Cao | Review sớm ở Phase 2; dùng PROMPT S01 + DESIGN |
| 82 page, scope dễ lan | Cao | Chỉ migrate page trong bảng mục 7; Seller/Admin deferred |
| Cart/checkout coupling backend | Cao | Không đổi controller; test từng flow |
| Chat Echo/Reverb | Cao | Test có/không Reverb; giữ logic cũ |
| Hai page auth trùng | Trung bình | Sẽ xoá `seller-register-page` Phase 6; route dùng `Auth/SellerRegister` |
| Hai page notification trùng | Trung bình | Đã redirect `/notifications`; xoá demo page Phase 6 |
| Tailwind CDN removal | Trung bình | Xoá Phase 6; build + QA vì có class động |
| Icon font removal | Trung bình | Xoá Font Awesome/Material/Bootstrap; **giữ Boxicons** cho workspace |
| Dark mode / legacy tokens | Trung bình | Defer cùng workspace; không xoá `legacy-tokens.css`/`.dark` ở Phase 6 |
| Font tiếng Việt | Trung bình | Test dấu ở Fraunces/Be Vietnam Pro |
| Token checker false positive | Thấp | Allowlist file logo/generated; prune sau khi xoá file |
| Windows/Linux casing | Cao | Rename qua `.tmp`, soát import, build trên CI Linux |
| Dead route/page mismatch | Trung bình | Chỉ sửa `Customer/PaymentResult`; ghi backlog route workspace |
| Radix SSR/Inertia | Thấp | Test build; dùng client-only nếu cần |
| Bubble che CTA mobile | Trung bình | Safe-area + ẩn ở checkout; test 390px |

---

## 11. Definition of Done

Một phase chỉ được coi là xong khi:

- [ ] Tất cả task trong phase đã hoàn thành.
- [ ] `npm run types` pass.
- [ ] `npm run lint` pass.
- [ ] `npm run build` pass.
- [ ] `npm run check:tokens` pass.
- [ ] `php artisan test` pass.
- [ ] Không có regression chức năng.
- [ ] Screenshot 390/768/1024/1440 đã review.
- [ ] Không còn import legacy trong page đã migrate.
- [ ] Tất cả file đang dùng tuân quy ước naming mới.
- [ ] `COMPONENTS.md` đã cập nhật.

Toàn bộ dự án hoàn thành khi:

- [ ] 7 phase xong.
- [ ] Storefront, Auth, Account, Chat dùng cùng token/component.
- [ ] Chatbot bubble hoạt động đúng phạm vi.
- [ ] Storefront/Auth/Account/Chat không còn duplicate primitives.
- [ ] Không còn icon font/CDN ngoài Boxicons giữ cho workspace.
- [ ] Seller/Admin/Shipper vẫn build được và icon hiển thị.
- [ ] Tài liệu component đầy đủ.

---

## 12. Deferred backlog

Các mục sau không làm trong 7 phase này:

1. **Seller workspace** — chờ Stitch V01–V06.
2. **Admin workspace** — chờ Stitch D01–D12.
3. **Shipper workspace** — chờ Stitch H01–H04.
4. **Charts** — KPI, revenue, category mix; chờ workspace.
5. **C03 return page** — component đã có, page/route chưa có.
6. **C04 wishlist page** — component variant đã có, page chưa có.
7. **Dark mode Nếp + legacy tokens** — chưa thiết kế; `legacy-tokens.css`/`.dark`/alias shadcn chỉ xử lý khi migrate workspace.
8. **Workspace legacy merge** — `action-button` → `button`, `primary-input`/`input-error` → form primitives, `data-table` → `table`, `confirmation-modal` → `ConfirmDialog`, `status-badge` → `OrderStatusBadge`.
9. **S02b Daily discover / S02c Flash sale** — chưa có route/controller; placeholder sẽ xoá Phase 6.
10. **Route/page thiếu của workspace** — CustomerSegments, Admin/Orders/Show, Admin/Returns/Show, Seller/Wallet, Seller/Reports, Seller/Promotions/Edit|Show, Product/Index|Show, Auth/ConfirmPassword.
11. **Dusk E2E đầy đủ** — chỉ critical flows.
12. **Storybook** — không thêm dependency; dùng `COMPONENTS.md`.
13. **Content rewrite** — không đổi copy ngoài sample data.

---

## 13. Execution checklist

### Trước khi bắt đầu

- [ ] Đọc lại `DESIGN.md`, `PROMPT.md`, `PLAN.md`.
- [ ] Backup `resources/js`, `resources/css`, `resources/views/app.blade.php` (repo hiện chưa có git).
- [ ] Xác nhận `npm ci` / `composer install` đã chạy.
- [ ] Xác nhận `.env` và DB test.
- [ ] Nếu có git: tạo branch `feat/ui-system`.

### Mỗi phase

- [ ] Tạo checklist riêng cho phase.
- [ ] Làm theo batch nhỏ.
- [ ] Chạy type/lint/build sau mỗi batch.
- [ ] Chụp screenshot 4 viewport.
- [ ] Review với user trước khi sang phase tiếp.

### Sau mỗi phase

- [ ] Cập nhật `COMPONENTS.md`.
- [ ] Ghi chú component mới.
- [ ] Ghi chú legacy đã thay.
- [ ] Commit theo format:
  - `feat(ui): add design tokens`
  - `feat(ui): add primitives`
  - `feat(storefront): migrate home`
  - `feat(storefront): migrate catalog and checkout`
  - `feat(account): migrate account pages`
  - `feat(chat): add chat workspace and chatbot bubble`
  - `chore(ui): remove legacy components and assets`
  - `chore(ui): normalize component and page filenames`

### Khi bị block

- [ ] Không tự ý đổi backend.
- [ ] Không tự ý xoá page/route.
- [ ] Ghi rõ blocker vào phase checklist.
- [ ] Hỏi user nếu quyết định ảnh hưởng product.

---

## 14. Ghi chú cuối

- `DESIGN-02.md` không phải source of truth.
- Stitch HTML không được copy nguyên khối.
- Mọi giá trị màu/kích thước/spacing/radius/shadow phải đến từ `tokens.css`.
- Nếu một component cần giá trị mới, thêm token trước, không viết trực tiếp.
- Nếu một page cần pattern mới, kiểm tra `COMPONENTS.md` trước khi tạo component.
- Ưu tiên sửa ít, đúng hệ, không phá chức năng.
