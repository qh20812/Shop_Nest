# ShopNest — Components

> Hệ component UI theo hướng **Bảng Hiệu**.
> Nguồn chuẩn: `DESIGN.md` · `REFACTOR_PLAN.md` · `docs/ui/PHASE-12-QA.md`.

## 1. Kiến trúc

Ba lớp, không trộn:

1. **Primitive toàn cục** — `resources/js/components/ui/*`, style trong `resources/css/components/*`, class `sn-*`, variant qua `data-*`.
2. **Composition / domain** — `components/layout/*`, `components/commerce/*`, `components/storefront/*`, `components/admin/*`, `components/chat/*`, `components/feedback/*`; có thể dùng CSS Module riêng.
3. **Page** — `resources/js/pages/**`; layout đặc thù trong `*.module.css` cạnh page.

Quy tắc:

- Không Tailwind, không `@apply`, không `!important` ngoài `utilities.css`/`base/a11y.css`.
- Không hex/rgb/hsl ngoài `tokens/primitive.css`; component chỉ dùng token semantic.
- CSS Module đặt camelCase; compose class bằng `cx` từ `@/lib/cx`.
- Icon chỉ dùng **Lucide**; icon-only button phải có `aria-label`.
- Mọi chuỗi hiển thị dùng `useTranslation()` và có key trong cả `vi`/`en`.

## 2. Primitive (`components/ui`)

| File | Thành phần | Ghi chú |
|---|---|---|
| `button.tsx` | `Button` | `variant`: default/primary/secondary/outline/ghost/tertiary/destructive/link; `size`: default/sm/md/lg/icon/icon-sm/icon-lg; `surface`: content/glass/overlay; `shape`: default/pill; `leftIcon`/`rightIcon`, `loading` |
| `icon-button.tsx` | `IconButton` | Icon-only; `surface`: content/glass/overlay; bắt buộc `aria-label` |
| `input.tsx` | `Input` | `size`, `surface`, `shape`, `invalid`, icon slot |
| `textarea.tsx` | `Textarea` | resize dọc, `surface`; error qua `FormField` |
| `select.tsx` | `Select` | `options`, `size`, `surface`, `shape`, `invalid` |
| `checkbox.tsx` | `Checkbox` | label + description |
| `radio-card.tsx` | `RadioCard` | chọn một trong danh sách card |
| `switch.tsx` | `Switch` | bật/tắt; hiện chỉ dùng qua `commerce/PreferenceRow` |
| `form-field.tsx` | `FormField` | label trên, helper/error dưới, `required` |
| `search-input.tsx` | `SearchInput` | icon search, clear, submit; `surface`, `shape` |
| `password-strength.tsx` | `PasswordStrength` | meter + nhãn |
| `file-dropzone.tsx` | `FileDropzone` | kéo thả, preview, validate |
| `rich-text-editor.tsx` | `RichTextEditor` | TinyMCE, skin mặc định |
| `badge.tsx` | `Badge` | `tone`: neutral/accent/success/warning/danger/outline/ink; `size` sm/md; `dot` |
| `status-badge.tsx` | `StatusBadge` | map status → tone; dùng cho order/payment/shop/shipper |
| `avatar.tsx` | `Avatar` | `user`/`src`/`name`, size sm/md/lg, status |
| `card.tsx` | `Card` | `variant`: flat/raised/inset/ghost; `padding` none/sm/md/lg |
| `table.tsx` | `Table` | `columns`, `density`, `stickyHeader`, `loading`, `empty`, `rowKey` |
| `data-table.tsx` | `DataTable` | wrapper `Table` + header + empty; `columns/data/headerTitle/headerIcon/emptyMessage` |
| `pagination.tsx` | `Pagination` | `<div role="navigation">`, không dùng `<nav>` |
| `tabs.tsx` | `Tabs` | `variant`: underline/pill/filter; `surface`: content/glass; `ariaLabel`; `items[]` |
| `breadcrumbs.tsx` | `Breadcrumbs` | `items`, `as="nav"` |
| `dropdown-menu.tsx` | `DropdownMenu` | Radix; item config |
| `dialog.tsx` | Dialog | Radix root/trigger/content/title/description; `Dialog` shell + primitives; `size`: sm/md/lg/xl; surface đặc bo 16, close 32px hit 44 |
| `sheet.tsx` | `Sheet` | Kính nổi inset 12px bo 28; `side`: right/left/bottom; shell header + `SheetBody` cuộn + footer; mobile nav, filter |
| `tooltip.tsx` | `Tooltip` | Overlay `--sn-glass-menu` bo 10 không blur; delay 300ms, sideOffset 6, collision 8 |
| `confirmation-modal.tsx` | `ConfirmationModal` | wrapper `isOpen/onClose/onConfirm/title/message` |
| `alert.tsx` | `Alert` | `tone`: info/success/warning/danger; title/description/action |
| `toast.tsx` | `Toast`, `Toaster`, `ToastProvider`, `toast()` | tone success/error/warning/info; auto-dismiss |
| `skeleton.tsx` | `Skeleton`, `SkeletonText` | `data-variant`: text/title/rect/circle/button |
| `empty-state.tsx` | `EmptyState` | icon/title/description/actions |
| `error-state.tsx` | `ErrorState` | lỗi có retry; hiện intentionally unused |
| `progress.tsx` | `Progress` | `value/max/tone/label/showValue` |
| `typography.tsx` | `Heading`, `Text`, `Eyebrow`, `MetaText` | scale/tone; giữ API |
| `header.tsx` | `Header` | page title + breadcrumbs + report button |
| `insights.tsx` | `Insights` | KPI list, `columns`, icon |
| `filter-panel.tsx` | `FilterPanel` | filter bar/grid, collapsible |
| `action-buttons.tsx` | `ActionButtons` | nhóm action inline |
| `action-dropdown.tsx` | `ActionDropdown` | menu action |
| `primary-input.tsx` | `PrimaryInput` | deprecated; wrapper `FormField` + `Input`/`Select` |
| `language-switcher.tsx` | `LanguageSwitcher` | `surface`: content/glass; POST `/language` |

## 3. Composition wrapper giữ nguyên

Các wrapper sau **không xoá** dù chỉ là composition mỏng; page đang import trực tiếp:

`header`, `data-table`, `insights`, `filter-panel`, `action-buttons`, `action-dropdown`, `confirmation-modal`, `status-badge`, `primary-input`.

Lý do: giữ API page ổn định sau Phase 11; codemod `AppLayout` đã xong ở Phase 12.

## 4. Layout shells

| Layout | Dùng cho | Đặc điểm |
|---|---|---|
| `StorefrontLayout` | Home, Search, ProductDetail (auth), Legal, About/Contact | Header + main + footer; mount `ChatDock` một lần; skip-link |
| `AccountLayout` | Customer/Settings | wraps `StorefrontLayout` + rail `active`; không mount chat lần hai |
| `AuthLayout` | Login/Register/Forgot/Reset/Verify/Seller/Shipper register | `variant="split"\|"centered"`, `width="default"\|"wide"`; skip-link |
| `WorkspaceLayout` | Admin/Seller/Shipper | Sidebar 232px + topbar là hai slab kính nổi (inset 12px, radius 20, nền `--sn-color-canvas-deep`) + main; <768 off-canvas + overlay; skip-link |
| `PageContainer` | Page wrapper | container + gutter |
| `PageHeader` | Page header | title/breadcrumbs/actions |
| `BrandMark` | Logo trong header, footer, auth, workspace sidebar | Mark tô `--sn-color-accent` qua mask; wordmark ink 600, accent khi hover/focus; mark `aria-hidden` |

`components/layout/WorkspaceLayout.tsx` là shell workspace duy nhất; `layouts/app/AppLayout.tsx` đã bị xoá.

Workspace chrome dùng `.sn-glass-surface` từ `components/glass.css`: topbar là wrapper sticky trong suốt + dải che 12px + card kính + bar 56px (đúng anatomy dock storefront); sidebar là outer fixed + card kính cuộn bên trong. Hai slab inset `--sn-shell-inset` 12px, cách nhau `--sn-shell-gap` 12px; nền trang có `.sn-workspace::before` fixed dùng `--sn-workspace-wash` để blur có material phía sau. Brand dùng `BrandMark` + `.sn-brand__name` accent như navbar, role label muted bên dưới. Nav link bo `--sn-radius-item`, hover/press glass wash, active accent-wash, focus-visible offset -2. Language switcher và search trong topbar dùng `surface="glass"`; dưới 768px switcher thu còn cờ.

## 5. Domain components

### Storefront

`HeroEditorial`, `CategoryShelf`, `ProductShelf`, `ProductCard`, `FlashSaleModule`, `BrandSpotlight`, `EditorialPillars`, `TrustStrip`, `NewsletterSignup`, `MobileNav`, `StorefrontHeader`, `StorefrontFooter`.

`StorefrontHeader` là dock kính: `.sn-storefront__card` bo `--sn-radius-2xl`, nền `--sn-glass-tint` + `--sn-blur-glass`, hairline + `--sn-shadow-glass`. Nav link là capsule có `aria-current`, search là pill trắng nổi, icon action là bubble tròn, Sign In là pill accent duy nhất. Trigger locale/account có hover wash và `[data-state='open']` đổi nền + xoay chevron. Sticky offset toàn storefront dùng `--sn-header-stuck` (80px), không dùng `--sn-header`.

`DropdownMenu` nhận `selected?: boolean` (render check trailing + `data-selected`) và `className="sn-dropdown--glass"` cho menu trong dock. Menu kính bo 16, item bo 10, hover dùng ink wash, selected dùng accent-wash + accent-text.

`CategoryShelf` là frosted media tile: nền `--sn-glass-control`, hairline, inset highlight, `--sn-shadow-card`, bo `--sn-radius-card` 16; mỗi tile padding 8, ảnh 1:1 inset theo padding, bo `--sn-radius-media` 10, icon fallback 32px. Tên 2 dòng đổi accent khi hover, meta "Xem sản phẩm" dùng sans 12px muted. Hover nhấc 3px + zoom ảnh 1.03; focus-visible chỉ đổi border để ring xuất hiện tức thì; reduced-motion bỏ transform, reduced-transparency dùng surface đặc.

### Commerce

`Price`, `Rating`, `ReviewCard`, `ReviewSummary`, `QuantityStepper`, `VariantSelector`, `ProductGallery`, `ProductGrid`, `BuyBox`, `SpecTable`, `OrderTable`, `OrderSummary`, `OrderItemRow`, `OrderTimeline`, `OrderAnnouncementCard`, `PaymentOption`, `PaymentMarks`, `CheckoutStepper`, `CheckoutAddressForm`, `AddressCard`, `CartLine`, `PromoField`, `FilterRail`, `FilterGroup`, `ActiveFilters`, `CategoryPills`, `Countdown`, `NotificationRow`, `ShopIdentity`.

`ProductCard` là frosted media card: nền `--sn-glass-control`, hairline, inset highlight, `--sn-shadow-card`, bo `--sn-radius-card` 16; ảnh 1:1 inset 8px bo `--sn-radius-media` 10. Sale pill trên ảnh, wishlist và quick-action pill dùng `surface="overlay"`. Quick pill label "Choose options", hiện khi hover/focus, luôn hiện dưới 768px hoặc thiết bị không hover. `actionLabel`/`actionIcon` cho phép override nhãn và icon hành động (mặc định "Choose options" + `ShoppingCart`).

`Price` render discount dưới dạng pill accent-wash 20px cao, hairline, tabular-nums; value thêm tracking snug. `Rating` nhận `chip?: boolean`; chỉ có tác dụng khi `compact` và render pill 24px (glass-control + hairline + inset highlight) bo tròn, dùng ở `ProductCard` và `BuyBox`. `BuyBox` chỉ render rating khi `rating > 0` để không hiện chip "0 (0)". `ShopIdentity`, `ReviewCard`, `ReviewSummary` và trang đơn hàng giữ rating dạng text để tránh pill spam.

`FilterRail` là content panel đặc: surface, hairline, bo `--sn-radius-xl` 12; desktop sticky với `max-height: calc(100dvh - var(--sn-header-stuck) - 16px)`, `.filterRailBody` cuộn riêng, header và nút "Xoá tất cả" đứng yên. `variant="sheet"` bỏ nền/border/max-height để sheet là bề mặt duy nhất và ẩn header trùng với tiêu đề sheet. `FilterGroup` dùng `summary` có hit area, hover wash và focus ring; count là pill neutral, active count là pill accent-wash.

`PaymentMarks` dùng `payment-marks.module.css` riêng để footer không kéo toàn bộ commerce CSS.

### Admin / Analytics

`AnalyticsCard`, `AnalyticsChart` (recharts + token), `AnalyticsTable`, `AnalyticsFilters`, `QuickFilter`, `ExportButton`, `ShipperInfoCard`.

`AnalyticsCard` và `Insights` dùng frosted stat card (glass-control + hairline + inset highlight + `--sn-shadow-card`, radius 16, không blur). Metric card của Seller thêm `metricCardFrosted` khi đứng trực tiếp trên canvas; bên trong `Card` nội dung thì giữ nền đặc để không lồng card. `AnalyticsFilters` mặc định là glass slab (`surface="glass"`, blur) và đặt thẳng trên nền `canvas-deep`; khi nằm trong panel kính khác thì truyền `surface="content"`. `FilterPanel` dùng `.sn-glass-surface` cho grid; control bên trong dùng `surface="glass"`. Chart card và data table giữ bề mặt đặc.

`Admin/Dashboard` dùng composition 3 dải: KPI instrument rail (`dl` frosted, 4 register, doanh thu rộng hơn), signal grid (doanh thu area 2fr + user growth bar 1fr), ledger grid (Recent Orders `DataTable` 2fr + New Users ledger 1fr). `DataTable` nhận `headerMeta` tuỳ chọn để hiện count bên phải head; New Users dùng head + rows hairline, không card.

`Admin/Users` là directory ledger: `PageHeader` (badge tổng user), filter toolbar kính có label Tìm kiếm/Vai trò/Trạng thái + nút Áp dụng, `DataTable` gộp identity (avatar, tên, #id, email) và `headerMeta` là range phân trang thật. Search/role/status state, auto-search, confirm toggle, toast, modal và pagination giữ nguyên; role badge neutral.

`Admin/Users/Edit` là account record: `PageHeader` (breadcrumb Dashboard > Users > tên user, action quay lại danh sách), grid 2 cột ≥1024 gồm form panel đặc và rail hồ sơ. Form chia section Thông tin tài khoản (họ, tên, email + hint đăng nhập) và Quyền truy cập (status, role register dùng `description` thật từ `RoleSeeder`); rail hiện avatar, username, ID, ngày tham gia, email xác minh. Tự sửa mình khoá status/role ở cả UI và backend (403), form chỉ gửi họ tên/email; không card lồng card, `Save changes` có loading.

`Admin/Products` là directory 5 cột: `PageHeader` (badge totalProducts filtered), filter toolbar kính có label Tìm kiếm/Danh mục/Thương hiệu/Trạng thái + nút Áp dụng, `DataTable` với ProductInfoCell, Seller + brand, Price + stock, Status, Actions; `headerMeta` là range phân trang. Status actions, toast, modal, pagination giữ nguyên; giá dùng text thường, không accent.

`Admin/Inventory` là stock ledger: `PageHeader`, filter toolbar kính có label Tìm kiếm/Người bán/Danh mục/Thương hiệu/Trạng thái tồn + nút Áp dụng, stock rail 4 register (tổng biến thể filtered, trên trang, tồn thấp trang, hết hàng trang) và `DataTable` 5 cột (Product 3 dòng, Seller, Price + discount, Stock + status, Actions). `headerMeta` là range phân trang; View/History, pagination, filter state và toast giữ nguyên.

Chart: `YAxis` dùng compact formatter (`N`/`Tr`/`NT`) + width 64; grid 1px; không gradient.

### Chat

`ChatDock` (shell + lazy panel), `ChatbotLauncher`, `ChatbotPanel`, `ChatHeader`, `MessageList`, `ChatMessage`, `ChatComposer`, `QuickReplies`, `MarkdownText`, `ConversationRow`, `ChatWorkspace`.

- `ChatDock` mount một lần trong `StorefrontLayout`.
- `ChatbotPanel` lazy (`React.lazy` + `Suspense`) để tách chat/commerce CSS khỏi shell.
- Launcher/shell dùng `chat-launcher.module.css`; panel dùng `chat.module.css`.

## 6. Pattern sử dụng

### Button

```tsx
<Button variant="primary" size="md" leftIcon={Plus} loading={saving} onClick={save}>
    {t('Save')}
</Button>

<Button variant="ghost" size="icon" surface="glass" aria-label={t('Cart')}>
    <ShoppingBag />
</Button>
```

### Form

```tsx
<FormField label={t('Email')} required error={errors.email} hint={t('We never share it')}>
    <Input value={email} onChange={(e) => setEmail(e.target.value)} invalid={!!errors.email} />
</FormField>
```

### Table / DataTable

- Table thuần: `columns`, `data`, `loading`, `empty`, `density`, `stickyHeader`.
- Workspace list: dùng `DataTable` để có header + empty mặc định.
- Bảng luôn nằm trong `.sn-table-wrap` (`overflow-x: auto`); không để document tràn ngang.
- Row height workspace 48px; số căn phải, trạng thái dùng `StatusBadge`.

### Filter

- `FilterPanel` cho filter bar/grid; `Tabs variant="filter"` cho quick filter.
- Filter tabs phải co được (`min-width: 0`, `max-width: 100%`) và scroll trong container, không đẩy document.

### Dialog / Sheet / Confirm

- Dialog dùng Radix; luôn có title + description (có thể `.sn-visually-hidden`). Surface đặc `--sn-color-surface`, hairline, bo 16, padding 20/24, close 32px (hit 44) và `aria-label` lấy từ `t('Close')`.
- Sheet dùng Radix Dialog primitive nhưng là glass slab nổi inset 12px, bo 28; header và footer cố định, chỉ `.sn-sheet__body` cuộn. `SheetBody` là wrapper chuẩn cho nội dung.
- Xoá/suspend dùng `ConfirmationModal` hoặc `ConfirmDialog`; mobile nav/filter dùng `Sheet` và đưa action chính vào prop `footer` để luôn thấy.
- Tooltip chỉ dành cho icon-only hoặc nhãn cần giải thích; nội dung lấy từ `t()`, không đặt tooltip lên control đã có text.

### Feedback

- Thành công ngắn: `toast({ tone: 'success', message })`.
- Lỗi form: `FormField error` hoặc `Alert tone="danger"`.
- Kết quả thanh toán: `ResultState` (success/pending/failure/cod).
- Loading: `Skeleton`/`SkeletonText`; bảng dùng `loading`.

## 7. Trạng thái & rỗng

- `Table`/`DataTable` tự render `empty` (mặc định “Chưa có dữ liệu.”).
- List custom dùng `EmptyState` với lý do + CTA nếu có.
- Không hiển thị `[object Object]`, `NaN`, `undefined`.
- Khi filter không có kết quả, giữ filter visible và hiện empty trong vùng kết quả.

## 8. Accessibility

- Skip link ở 3 layout → `#main-content`; `main` có `tabIndex={-1}`.
- `:focus-visible` toàn cục 2px accent; không xoá outline nếu không thay thế.
- Nav `aria-current="page"`; tablist có `aria-label`; dialog Radix trap focus.
- Icon-only button có `aria-label`; ảnh có `alt`; decorative icon `aria-hidden`.
- Reduced motion tắt animation/transition trong `base/a11y.css`.
- QA: tab qua page, 375–1440, light/dark, zoom 200%.

## 9. Mapping cũ → mới

| Cũ | Mới |
|---|---|
| `action-button`, `action-buttons` | `Button`/`IconButton` + `ActionButtons` |
| `action-dropdown` | `ActionDropdown`/`DropdownMenu` |
| `primary-input` | `PrimaryInput` → `Input`/`FormField` |

`surface="glass"` dùng cho control nằm trong chrome (dock, sheet, floating bar). `surface="overlay"` dùng cho control nằm trên ảnh/media (wishlist, quick action) với `--sn-glass-menu`. Control không bao giờ có `backdrop-filter`; kính của control là alpha + hairline + shadow, blur chỉ nằm trên slab.
| `data-table` | `DataTable` (wrap `Table`) |
| `confirmation-modal` | `ConfirmationModal` (wrap `ConfirmDialog`) |
| `status-badge` | `StatusBadge` (wrap `Badge` tone) |
| `filter-panel` | `FilterPanel` |
| `header` | `Header` + `WorkspaceTopbar` |
| `navbar` | `WorkspaceTopbar` (đã xoá file cũ) |
| `sidebar` | `WorkspaceSidebar` (đã xoá file cũ) |
| `insights` | `Insights` |
| `AnalyticsCard/Chart/Table/Filters` | token + `Analytics*` hiện tại |
| `QuickFilter` | `Tabs variant="filter"` |
| `ExportButton` | `Button` |
| `search-input` | `SearchInput` |
| `toast`/`toaster` | `Toast`/`Toaster` |
| `typography` | `Heading`/`Text`/`Eyebrow`/`MetaText` |
| `skeleton` | `Skeleton`/`SkeletonText` |
| `rich-text-editor` | `RichTextEditor` |

## 10. Kiểm chứng

```bash
npm run check:css       # strict, 290 file
npm run types
npm run format:check
npm run lint
npm run build
npm run build:ssr
php artisan test
php artisan dusk --filter=Phase12QaTest
```

Dusk QA cần `.env.dusk.local` (Docker MySQL 3307, `shopnest_qa`); không chạy `php artisan dusk` với `.env` Aiven.
