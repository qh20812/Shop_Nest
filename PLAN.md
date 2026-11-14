# ShopNest UI System — Master Plan

> **Trạng thái:** Phase 0 + Phase 1 hoàn tất; Phase 2 chưa bắt đầu  
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
| Button | `ui/button.tsx`, `ui/ActionButton.tsx`, `ui/ActionButtons.tsx`, `PrimaryButton.tsx` | Giữ `ui/button.tsx`, thay 3 bản còn lại |
| Input | `ui/input.tsx`, `ui/PrimaryInput.tsx`, `TextInput.tsx`, `ui/InputLabel.tsx`, `ui/InputError.tsx`, `input-error.tsx` | Giữ `ui/input.tsx` + `ui/form-field.tsx`, xoá phần còn lại sau migrate |
| Card sản phẩm | `product-card.tsx`, `Shared/ProductCard.tsx`, `home/ui/ProductCard.tsx` | Thay bằng `commerce/ProductCard.tsx` |
| Layout | `layouts/app/AppLayout.tsx`, `CustomerLayout.tsx`, `HomeLayout.tsx`, `SellerLayout.tsx`, `ShipperLayout.tsx`, `app-layout.tsx`, `settings/SettingLayout.tsx` | Storefront dùng `StorefrontLayout`; customer dùng `AccountLayout`; workspace giữ tạm |
| Navigation | `ui/Navbar.tsx`, `home/ui/Navbar.tsx`, `home/ui/Header.tsx`, `ui/Sidebar.tsx` | Storefront dùng `StorefrontHeader`; workspace giữ tạm |
| Chat | `Chatbot.tsx`, `ChatBubble.tsx`, `ChatWindow.tsx`, `Message.tsx`, `Chat/ChatPopup.tsx`, `Chat/ChatList.tsx`, `Chat/ChatWindow.tsx` | Thay bằng `Chat/ChatDock.tsx` + `Chat/ChatWorkspace.tsx` |
| Feedback | `ui/ConfirmationModal.tsx`, `ui/NotificationToast.tsx` | Thay bằng `feedback/ConfirmDialog.tsx` + `ui/toast.tsx` |

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

Kế hoạch: thêm font Nếp ở Phase 0; chỉ xoá toàn bộ font/icon/CDN legacy ở Phase 6 sau khi tất cả trang trong phạm vi đã migrate.

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
│   ├── legacy-tokens.css       # tạm thời: token cũ + dark mode, xoá Phase 6
│   └── base.css                # reset, body, focus-ring, keyframes, utilities
│
├── js/
│   ├── components/
│   │   ├── ui/                 # primitives, kebab-case
│   │   ├── layout/             # shell, header, footer, page header
│   │   ├── storefront/         # module riêng của home
│   │   ├── commerce/           # product, cart, checkout, order, account
│   │   ├── Chat/               # chat workspace + bubble
│   │   └── feedback/           # dialog, result, loading overlay
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
| `components/ui` | kebab-case | `button.tsx`, `form-field.tsx` |
| `components/layout` | PascalCase | `StorefrontHeader.tsx` |
| `components/storefront` | PascalCase | `HeroEditorial.tsx` |
| `components/commerce` | PascalCase | `ProductCard.tsx` |
| `components/Chat` | PascalCase | `ChatDock.tsx` |
| `components/feedback` | PascalCase | `ConfirmDialog.tsx` |
| Hook | camelCase, prefix `use` | `useCountdown.ts` |
| Type | PascalCase | `ProductCardModel` |

Giữ nguyên casing thư mục hiện có (`Chat`, `Shared`, `Analytics`) để tránh vỡ import trên Linux.

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

- `legacy-tokens.css`: token cũ + `.dark`, chỉ tồn tại trong giai đoạn migrate.
- `tokens.css`: token Nếp, load sau để override font và bổ sung palette.
- Phase 6 xoá `legacy-tokens.css` và chuyển toàn bộ alias shadcn sang Nếp.

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

Trong Phase 0–5, giữ alias cũ trong `legacy-tokens.css` để các component shadcn/legacy không vỡ. Component mới dùng trực tiếp token Nếp (`bg-warm-porcelain`, `text-ink-muted`, `border-border`, `bg-lacquer-red`).

Phase 6 chuyển alias:

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
| `Avatar` | `src`, `name`, `size`, `status` | C06, C08 | `ui/Avatar.tsx` |
| `Breadcrumbs` | `items` | S02, S03, S04, C02 | `ui/breadcrumbs.tsx` |
| `Tabs` | `items`, `value`, `onValueChange`, `variant` | S03, C06, C01, C07 | `ui/tabs.tsx` |
| `Pagination` | `page`, `pageCount`, `total`, `pageSize`, `onPageChange`; legacy `links` | S02, C01 | `ui/Pagination.tsx` |
| `Table` | `columns`, `data`, `rowKey`, `density`, `stickyHeader`, `empty` | S03, C01 | `ui/table.tsx` |
| `Dialog` | `open`, `onOpenChange`, `title`, `description`, `footer`, `tone`, `size` | S04, C05 | `ui/dialog.tsx` |
| `Sheet` | `side`, `open`, `onOpenChange` | S02 mobile filter | `ui/sheet.tsx` |
| `DropdownMenu` | `trigger`, `items` | Navbar, C04 | `ui/dropdown-menu.tsx` |
| `Tooltip` | `content`, `position`, `delay` | Existing | `ui/Tooltip.tsx` |
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
| `ShippingOption` | `value`, `selected`, `onChange` | S05 | `commerce/ShippingOption.tsx` |
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
| `ChatDock` | `enabled`, `defaultOpen` | Mới | `Chat/ChatDock.tsx` |
| `ChatbotLauncher` | `unreadCount`, `onClick`, `open` | Mới | `Chat/ChatbotLauncher.tsx` |
| `ChatbotPanel` | `open`, `onClose`, `messages`, `onSend` | Mới + C08 | `Chat/ChatbotPanel.tsx` |
| `ChatWorkspace` | `conversations`, `activeId`, `onSelect` | C08 | `Chat/ChatWorkspace.tsx` |
| `ConversationList` | `conversations`, `activeId`, `onSelect`, `query`, `onQueryChange` | C08 | `Chat/ConversationList.tsx` |
| `ConversationRow` | `conversation`, `active`, `onClick` | C08 | `Chat/ConversationRow.tsx` |
| `ChatHeader` | `variant`, `shop`, `assistant`, `onAction` | C08 | `Chat/ChatHeader.tsx` |
| `MessageList` | `messages`, `loading`, `typing` | C08 | `Chat/MessageList.tsx` |
| `ChatMessage` | `variant`, `content`, `timestamp`, `status`, `attachments` | C08 | `Chat/ChatMessage.tsx` |
| `TypingIndicator` | `label` | C08 | `Chat/TypingIndicator.tsx` |
| `QuickReplies` | `items`, `onSelect` | C08 | `Chat/QuickReplies.tsx` |
| `ChatComposer` | `value`, `onChange`, `onSend`, `disabled`, `placeholder` | C08 | `Chat/ChatComposer.tsx` |

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

| Legacy | Thay bằng | Phase xoá |
|---|---|---|
| `ui/button.tsx` | `ui/button.tsx` (upgrade) | Giữ |
| `ui/ActionButton.tsx` | `ui/button.tsx` | Phase 6 |
| `ui/ActionButtons.tsx` | `ui/button.tsx` | Phase 6 |
| `PrimaryButton.tsx` | `ui/button.tsx` | Phase 6 |
| `ui/PrimaryInput.tsx` | `ui/input.tsx` | Phase 6 |
| `TextInput.tsx` | `ui/input.tsx` | Phase 6 |
| `ui/InputLabel.tsx` | `ui/form-field.tsx` | Phase 6 |
| `ui/InputError.tsx` | `ui/form-field.tsx` | Phase 6 |
| `input-error.tsx` | `ui/form-field.tsx` | Phase 6 |
| `product-card.tsx` | `commerce/ProductCard.tsx` | Phase 6 |
| `Shared/ProductCard.tsx` | `commerce/ProductCard.tsx` | Phase 6 |
| `home/ui/ProductCard.tsx` | `commerce/ProductCard.tsx` | Phase 6 |
| `home/ui/Navbar.tsx` | `layout/StorefrontHeader.tsx` | Phase 6 |
| `home/ui/Header.tsx` | `layout/StorefrontHeader.tsx` | Phase 6 |
| `home/ui/Footer.tsx` | `layout/StorefrontFooter.tsx` | Phase 6 |
| `layouts/app/HomeLayout.tsx` | `layout/StorefrontLayout.tsx` | Phase 6 |
| `layouts/app/CustomerLayout.tsx` | `layout/AccountLayout.tsx` | Phase 6 |
| `ui/ConfirmationModal.tsx` | `feedback/ConfirmDialog.tsx` | Phase 6 |
| `ui/NotificationToast.tsx` | `ui/toast.tsx` | Phase 6 |
| `Chatbot.tsx` | `Chat/ChatDock.tsx` | Phase 6 |
| `ChatBubble.tsx` | `Chat/ChatbotLauncher.tsx` | Phase 6 |
| `ChatWindow.tsx` | `Chat/ChatbotPanel.tsx` | Phase 6 |
| `Message.tsx` | `Chat/ChatMessage.tsx` | Phase 6 |
| `Chat/ChatPopup.tsx` | `Chat/ChatWorkspace.tsx` | Phase 6 |
| `Chat/ChatList.tsx` | `Chat/ConversationList.tsx` | Phase 6 |
| `Chat/ChatWindow.tsx` | `Chat/ChatWorkspace.tsx` | Phase 6 |

Lưu ý: Không xoá trước khi tất cả import của component đó đã được thay thế và `npm run build` pass.

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
- `/daily-discover`
- `/flash-sale`
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
| A01 Login | `auth/login-page.tsx` | Phase 2 | AuthLayout, AuthBrandPanel, FormField, Button |
| A02 Customer register | `auth/register-page.tsx` | Phase 2 | AuthLayout, FormField, Checkbox |
| A03 Seller register | `auth/SellerRegister.tsx`, `auth/seller-register-page.tsx` | Phase 2 | AuthLayout variant seller |
| A04 Shipper register | `auth/ShipperRegister.tsx` | Phase 2 | AuthLayout variant shipper |
| A05 Forgot/reset | `auth/forgot-password.tsx`, `auth/reset-password.tsx` | Phase 2 | AuthLayout centered, Alert |
| A06 Verify email | `auth/VerifyEmail.tsx` | Phase 2 | AuthLayout centered, ResultState |
| S01 Home | `Home/Index.tsx` | Phase 2 | HeroEditorial, CategoryShelf, ProductShelf, TrustStrip |
| S02 Search/catalog | `Home/search-page.tsx` | Phase 3 | SearchInput, FilterRail, ProductGrid, Pagination |
| S02b Daily discover | `Home/daily-discover-page.tsx` | Phase 3 | ProductGrid, CategoryPills |
| S02c Flash sale | `Home/flash-sale-page.tsx` | Phase 3 | ProductGrid, Countdown |
| S03 Product detail | `Customer/Detail.tsx` | Phase 3 | ProductGallery, BuyBox, SpecTable, Reviews |
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
| C07 Notifications | `Customer/Notification/Index.tsx`, `Notifications/Index.tsx` | Phase 4 | NotificationRow, PreferenceRow, Tabs |
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
- `ui/Avatar.tsx`, `ui/Tooltip.tsx`, `ui/Pagination.tsx` được nâng cấp tại chỗ để giữ tương thích và tránh trùng casing trên Windows.
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

**Điều kiện vào:** Phase 1 pass.

**Công việc:**

#### Batch 1 — Layout

- [ ] `layout/PageContainer.tsx`.
- [ ] `layout/PageHeader.tsx`.
- [ ] `layout/SectionHeader.tsx`.
- [ ] `layout/StorefrontHeader.tsx`:
  - [ ] Logo.
  - [ ] Search.
  - [ ] Links: Danh mục, Khuyến mãi, Shop Việt, Đơn hàng.
  - [ ] Language VI, currency VND.
  - [ ] Account dropdown.
  - [ ] Cart count.
  - [ ] Mobile menu.
- [ ] `layout/StorefrontFooter.tsx`:
  - [ ] 4 cột.
  - [ ] Newsletter.
  - [ ] Legal links.
  - [ ] Payment marks.
- [ ] `layout/StorefrontLayout.tsx`.
- [ ] `layout/AuthLayout.tsx`.
- [ ] `layout/AuthBrandPanel.tsx`.
- [ ] `layout/MobileNav.tsx`.

#### Batch 2 — Home modules

- [ ] `storefront/HeroEditorial.tsx`.
- [ ] `storefront/UtilityStrip.tsx`.
- [ ] `storefront/CategoryShelf.tsx`.
- [ ] `storefront/FlashSaleModule.tsx`.
- [ ] `storefront/ProductShelf.tsx`.
- [ ] `storefront/TrustStrip.tsx`.
- [ ] `storefront/EditorialPillars.tsx`.
- [ ] `storefront/BrandSpotlight.tsx`.
- [ ] `storefront/NewsletterSignup.tsx`.

#### Batch 3 — Auth pages

- [ ] `auth/login-page.tsx`.
- [ ] `auth/register-page.tsx`.
- [ ] `auth/SellerRegister.tsx` và `auth/seller-register-page.tsx`:
  - [ ] Kiểm tra route nào thực sự dùng.
  - [ ] Giữ một page chuẩn, redirect page còn lại nếu an toàn.
- [ ] `auth/ShipperRegister.tsx`.
- [ ] `auth/forgot-password.tsx`.
- [ ] `auth/reset-password.tsx`.
- [ ] `auth/VerifyEmail.tsx`.

#### Batch 4 — Home/static pages

- [ ] `Home/Index.tsx`.
- [ ] `Home/About.tsx`.
- [ ] `Home/Contact.tsx`.
- [ ] `Legal/Terms.tsx`.
- [ ] `Legal/PrivacyPolicy.tsx`.
- [ ] `Legal/SellingPolicy.tsx`.

#### Batch 5 — Cleanup riêng phase

- [ ] Xoá import `HomeLayout` khỏi các page đã migrate.
- [ ] Xoá import CSS legacy khỏi các page đã migrate.
- [ ] Chưa xoá file legacy.

**Acceptance:**

- [ ] S01 render đúng 6 category, hero 7/5, trust strip.
- [ ] Header search hoạt động; cart count đúng; account dropdown đúng role.
- [ ] Auth pages giữ nguyên route, form name, CSRF, validation error.
- [ ] Google login vẫn hoạt động.
- [ ] Không có horizontal scroll ở 390px.
- [ ] Không còn Material Symbol/Boxicon trong các page đã migrate.
- [ ] `npm run types`, `npm run lint`, `npm run build` pass.
- [ ] `php artisan test` pass.

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

**Điều kiện vào:** Phase 2 pass.

**Công việc:**

#### Batch 1 — Catalog components

- [ ] `commerce/ProductCard.tsx`.
- [ ] `commerce/ProductGrid.tsx`.
- [ ] `commerce/FilterRail.tsx`.
- [ ] `commerce/FilterGroup.tsx`.
- [ ] `commerce/ActiveFilters.tsx`.
- [ ] `commerce/CategoryPills.tsx`.

#### Batch 2 — Product detail components

- [ ] `commerce/ProductGallery.tsx`.
- [ ] `commerce/BuyBox.tsx`.
- [ ] `commerce/VariantSelector.tsx`.
- [ ] `commerce/SpecTable.tsx`.
- [ ] `commerce/ShopIdentity.tsx`.
- [ ] `commerce/ReviewSummary.tsx`.
- [ ] `commerce/ReviewCard.tsx`.

#### Batch 3 — Cart/checkout components

- [ ] `commerce/CartLine.tsx`.
- [ ] `commerce/OrderSummary.tsx`.
- [ ] `commerce/PromoField.tsx`.
- [ ] `commerce/CheckoutStepper.tsx`.
- [ ] `commerce/ShippingOption.tsx`.
- [ ] `commerce/PaymentOption.tsx`.

#### Batch 4 — Pages

- [ ] `Home/search-page.tsx`.
- [ ] `Home/daily-discover-page.tsx`.
- [ ] `Home/flash-sale-page.tsx`.
- [ ] `Customer/Detail.tsx`.
- [ ] `Customer/Cart.tsx`.
- [ ] `Customer/Checkout.tsx`.
- [ ] `Customer/PaymentResult.tsx`.

#### Batch 5 — Behavior

- [ ] Search + query params.
- [ ] Filter state + clear all.
- [ ] Sort.
- [ ] Pagination.
- [ ] Product variant selection.
- [ ] Add to cart.
- [ ] Buy now.
- [ ] Cart quantity update/remove.
- [ ] Promotion apply/remove.
- [ ] Shipping method.
- [ ] Payment Stripe/COD.
- [ ] Empty/skeleton/error states.
- [ ] Mobile sticky summary.

**Acceptance:**

- [ ] Không đổi payload/route hiện có.
- [ ] Tổng tiền khớp backend.
- [ ] Cart empty state đúng copy.
- [ ] Checkout validation hiển thị đúng field.
- [ ] Stripe redirect và COD flow không đổi.
- [ ] Product card metadata đúng ngành.
- [ ] `check:tokens` pass.
- [ ] `php artisan test` pass.

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

**Điều kiện vào:** Phase 3 pass.

**Công việc:**

#### Batch 1 — Account layout/components

- [ ] `layout/AccountLayout.tsx`.
- [ ] `commerce/OrderTable.tsx`.
- [ ] `commerce/OrderTimeline.tsx`.
- [ ] `commerce/OrderItemRow.tsx`.
- [ ] `commerce/AddressCard.tsx`.
- [ ] `commerce/NotificationRow.tsx`.
- [ ] `commerce/PreferenceRow.tsx`.
- [ ] `commerce/ReturnItemPicker.tsx` (component-only).
- [ ] `commerce/RefundOption.tsx` (component-only).

#### Batch 2 — Orders

- [ ] `Customer/Orders/Index.tsx`.
- [ ] `Customer/Orders/Show.tsx`.

#### Batch 3 — Address

- [ ] `Customer/Address/Index.tsx`.
- [ ] `Customer/Address/Create.tsx`.
- [ ] `Customer/Address/Edit.tsx`.
- [ ] `Customer/Address/Show.tsx`.

#### Batch 4 — Profile/settings

- [ ] `Customer/Profile/Index.tsx`.
- [ ] `Customer/ChangePassword/Index.tsx`.
- [ ] `Settings/Profile.tsx`.
- [ ] `Settings/Password.tsx`.
- [ ] `Settings/Appearance.tsx`.

#### Batch 5 — Notifications

- [ ] `Customer/Notification/Index.tsx`.
- [ ] `Notifications/Index.tsx`.
- [ ] Kiểm tra route `/notifications` và `/user/notifications`.
- [ ] Thống nhất một page chuẩn; page còn lại redirect hoặc giữ nếu là demo.

#### Batch 6 — C03/C04

- [ ] Build component C03/C04.
- [ ] Chưa tạo route/page mới nếu chưa có yêu cầu.
- [ ] Ghi vào backlog: tích hợp khi page được tạo.

**Acceptance:**

- [ ] Order table responsive: table desktop, card mobile.
- [ ] Status badge đúng màu.
- [ ] Timeline đúng current step.
- [ ] Address CRUD hoạt động.
- [ ] Avatar upload hoạt động.
- [ ] Profile/password validation giữ nguyên.
- [ ] Notification read/mark-all-read hoạt động.
- [ ] Settings tabs đúng.
- [ ] Không còn CSS legacy trong page đã migrate.
- [ ] `php artisan test` pass.

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

**Điều kiện vào:** Phase 4 pass.

**Công việc:**

#### Batch 1 — Chat primitives

- [ ] `Chat/ChatMessage.tsx`.
- [ ] `Chat/TypingIndicator.tsx`.
- [ ] `Chat/QuickReplies.tsx`.
- [ ] `Chat/ChatComposer.tsx`.
- [ ] `Chat/MessageList.tsx`.

#### Batch 2 — Chat workspace

- [ ] `Chat/ConversationRow.tsx`.
- [ ] `Chat/ConversationList.tsx`.
- [ ] `Chat/ChatHeader.tsx`.
- [ ] `Chat/ChatWorkspace.tsx`.
- [ ] `commerce/OrderAnnouncementCard.tsx`.
- [ ] `commerce/OrderContextRail.tsx`.

#### Batch 3 — Bubble

- [ ] `Chat/ChatbotLauncher.tsx`.
- [ ] `Chat/ChatbotPanel.tsx`.
- [ ] `Chat/ChatDock.tsx`.
- [ ] Tích hợp `ChatDock` vào `StorefrontLayout` và `AccountLayout`.
- [ ] Ẩn theo route như mục 6.4.
- [ ] Focus trap, ESC, aria-live.
- [ ] Mobile bottom sheet.

#### Batch 4 — Page

- [ ] `Customer/Chat/Index.tsx`.
- [ ] Kiểm tra `Chat/ChatPopup.tsx` và `Chatbot.tsx` cũ.
- [ ] Chuyển logic gửi chat 1-1 sang `ChatWorkspace`.
- [ ] Chuyển logic chatbot AI sang `ChatbotPanel`.
- [ ] Giữ endpoint `/chatbot/message`.
- [ ] Giữ Echo/Reverb behavior.

#### Batch 5 — States

- [ ] Empty conversation.
- [ ] Typing.
- [ ] Failed send.
- [ ] Loading messages.
- [ ] Unread count.
- [ ] Assistant conversation.
- [ ] Shop conversation.
- [ ] Order context rail.

**Acceptance:**

- [ ] Chat 1-1 gửi/nhận được.
- [ ] Chatbot AI gửi/nhận được.
- [ ] Không còn 2 bubble cùng lúc.
- [ ] Bubble không hiện ở Auth/Checkout/Payment/Chat/Workspace.
- [ ] Bubble hiện ở Home/Product/Cart/Account.
- [ ] Mobile panel dùng bottom sheet, không tràn.
- [ ] `aria-expanded` đúng.
- [ ] Focus trả về launcher khi đóng.
- [ ] `check:tokens` pass.
- [ ] `php artisan test` pass.

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

**Mục tiêu:** Xoá legacy, bỏ CDN/icon font, chốt token toàn cục, full QA.

**Điều kiện vào:** Phase 5 pass; tất cả page trong phạm vi đã migrate.

**Công việc:**

#### Batch 1 — Xoá component legacy

- [ ] `ui/ActionButton.tsx`
- [ ] `ui/ActionButtons.tsx`
- [ ] `PrimaryButton.tsx`
- [ ] `ui/PrimaryInput.tsx`
- [ ] `TextInput.tsx`
- [ ] `ui/InputLabel.tsx`
- [ ] `ui/InputError.tsx`
- [ ] `input-error.tsx`
- [ ] `product-card.tsx`
- [ ] `Shared/ProductCard.tsx`
- [ ] `home/ui/ProductCard.tsx`
- [ ] `home/ui/Navbar.tsx`
- [ ] `home/ui/Header.tsx`
- [ ] `home/ui/Footer.tsx`
- [ ] `layouts/app/HomeLayout.tsx`
- [ ] `layouts/app/CustomerLayout.tsx`
- [ ] `ui/ConfirmationModal.tsx`
- [ ] `ui/NotificationToast.tsx`
- [ ] `Chatbot.tsx`
- [ ] `ChatBubble.tsx`
- [ ] `ChatWindow.tsx`
- [ ] `Message.tsx`
- [ ] `Chat/ChatPopup.tsx`
- [ ] `Chat/ChatList.tsx`
- [ ] `Chat/ChatWindow.tsx`

#### Batch 2 — Xoá CSS legacy

Chỉ xoá sau khi `grep` không còn import:

- [ ] `resources/css/Page.css`
- [ ] `resources/css/Home.css`
- [ ] `resources/css/ProductCard.css`
- [ ] `resources/css/Chat.css`
- [ ] `resources/css/chatbot.css`
- [ ] Các file CSS legacy khác không còn import.

#### Batch 3 — Bỏ font/icon/CDN

`resources/views/app.blade.php`:

- [ ] Xoá Instrument Sans.
- [ ] Xoá Montserrat.
- [ ] Xoá Plus Jakarta Sans.
- [ ] Xoá Material Symbols.
- [ ] Xoá Boxicons.
- [ ] Xoá Bootstrap Icons.
- [ ] Xoá Font Awesome.
- [ ] Xoá Tailwind CDN.
- [ ] Chỉ giữ Google Fonts Nếp + Vite assets.

#### Batch 4 — Token toàn cục

- [ ] Xoá `legacy-tokens.css`.
- [ ] Chuyển alias shadcn sang Nếp trong `tokens.css`.
- [ ] Xoá `.dark` nếu Appearance không còn dark.
- [ ] Nếu giữ Appearance dark: tạo Nếp dark palette riêng hoặc disable toggle có thông báo. Không ship dark nửa vời.
- [ ] `body` dùng Rice Paper.
- [ ] `:root` không còn primary xanh/tím.

#### Batch 5 — Docs/CI

- [ ] Hoàn thiện `COMPONENTS.md`.
- [ ] Thêm `check:tokens` vào CI sau lint.
- [ ] Ghi chú quy ước token trong `README` hoặc `AGENTS.md` nếu cần.
- [ ] Cập nhật `DESIGN.md` link tới `COMPONENTS.md` nếu phù hợp.

#### Batch 6 — Full QA

- [ ] Tất cả page trong phạm vi ở 390/768/1024/1440.
- [ ] Không horizontal scroll.
- [ ] Không console error.
- [ ] Keyboard navigation.
- [ ] Focus ring.
- [ ] Contrast.
- [ ] 44px targets.
- [ ] `prefers-reduced-motion`.
- [ ] Ảnh 4:5 không méo.
- [ ] Giá/ngày đúng format.
- [ ] Chat bubble không che CTA.
- [ ] `npm run types`, `lint`, `build`, `check:tokens`.
- [ ] `php artisan test`.
- [ ] `php artisan dusk` cho flow chính (nếu môi trường cho phép).

**Acceptance:**

- [ ] Không còn import legacy trong page đã migrate.
- [ ] Không còn icon font/CDN.
- [ ] Không còn hex/arbitrary value trong `resources/js`.
- [ ] Một pattern chỉ còn một component.
- [ ] Build production pass.
- [ ] Tests pass.
- [ ] Seller/Admin/Shipper vẫn build được (dù UI chưa migrate).

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
- Tailwind CDN removal có thể làm mất class động.
- Icon font removal có thể làm mất icon ở page Seller/Admin chưa migrate.
- Dark mode removal ảnh hưởng Settings/Appearance.

**Quy tắc an toàn Phase 6:**

1. `grep` toàn repo trước khi xoá từng file.
2. Build sau mỗi batch.
3. Nếu page Seller/Admin còn dùng icon font, giữ icon font đến khi migrate workspace; hoặc thay icon tự động bằng Lucide trước khi xoá.
4. Không xoá `dark` nếu chưa có quyết định product.

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
| Hai page auth trùng | Trung bình | Kiểm tra route trước khi xoá |
| Hai page notification trùng | Trung bình | Thống nhất một page |
| Tailwind CDN removal | Trung bình | Phase 6; build từng bước |
| Icon font removal | Trung bình | Chỉ xoá sau khi workspace migrate hoặc thay hết icon |
| Dark mode | Trung bình | Không thiết kế mới; giữ nguyên hoặc disable có thông báo |
| Font tiếng Việt | Trung bình | Test dấu ở Fraunces/Be Vietnam Pro |
| Token checker false positive | Thấp | Allowlist file logo/generated |
| Windows/Linux casing | Trung bình | Giữ nguyên casing hiện có; build trên CI Linux |
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
- [ ] `COMPONENTS.md` đã cập nhật.

Toàn bộ dự án hoàn thành khi:

- [ ] 7 phase xong.
- [ ] Storefront, Auth, Account, Chat dùng cùng token/component.
- [ ] Chatbot bubble hoạt động đúng phạm vi.
- [ ] Không còn duplicate primitives.
- [ ] Không còn icon font/CDN.
- [ ] Seller/Admin/Shipper vẫn build được.
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
7. **Dark mode Nếp** — chưa thiết kế.
8. **Dusk E2E đầy đủ** — chỉ critical flows.
9. **Storybook** — không thêm dependency; dùng `COMPONENTS.md`.
10. **Content rewrite** — không đổi copy ngoài sample data.

---

## 13. Execution checklist

### Trước khi bắt đầu

- [ ] Đọc lại `DESIGN.md`, `PROMPT.md`, `PLAN.md`.
- [ ] Xác nhận `git status` sạch.
- [ ] Xác nhận `npm ci` / `composer install` đã chạy.
- [ ] Xác nhận `.env` và DB test.
- [ ] Tạo branch `feat/ui-system`.

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
