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
| `button.tsx` | `Button` | `variant`: default/primary/secondary/outline/ghost/tertiary/destructive/link; `size`: default/sm/md/lg/icon/icon-sm/icon-lg; `leftIcon`/`rightIcon`, `loading` |
| `icon-button.tsx` | `IconButton` | Icon-only; bắt buộc `aria-label` |
| `input.tsx` | `Input` | `size`, `invalid`, icon slot |
| `textarea.tsx` | `Textarea` | resize dọc, error qua `FormField` |
| `select.tsx` | `Select` | `options`, `size`, `invalid` |
| `checkbox.tsx` | `Checkbox` | label + description |
| `radio-card.tsx` | `RadioCard` | chọn một trong danh sách card |
| `switch.tsx` | `Switch` | bật/tắt; hiện chỉ dùng qua `commerce/PreferenceRow` |
| `form-field.tsx` | `FormField` | label trên, helper/error dưới, `required` |
| `input-error.tsx` | `InputError` | lỗi field đơn lẻ |
| `search-input.tsx` | `SearchInput` | icon search, clear, submit |
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
| `tabs.tsx` | `Tabs` | `variant`: underline/pill/filter; `ariaLabel`; `items[]` |
| `breadcrumbs.tsx` | `Breadcrumbs` | `items`, `as="nav"` |
| `dropdown-menu.tsx` | `DropdownMenu` | Radix; item config |
| `dialog.tsx` | Dialog | Radix root/trigger/content/title/description |
| `sheet.tsx` | `Sheet` | Drawer trái/phải; mobile nav, filter |
| `tooltip.tsx` | `Tooltip` | delay mặc định 300ms |
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
| `primary-input.tsx` | `PrimaryInput` | wrapper tương thích |
| `language-switcher.tsx` | `LanguageSwitcher` | POST `/language` |

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
| `WorkspaceLayout` | Admin/Seller/Shipper | Sidebar 232px + topbar + main; <768 off-canvas + overlay; skip-link |
| `PageContainer` | Page wrapper | container + gutter |
| `PageHeader` | Page header | title/breadcrumbs/actions |

`components/layout/WorkspaceLayout.tsx` là shell workspace duy nhất; `layouts/app/AppLayout.tsx` đã bị xoá.

## 5. Domain components

### Storefront

`HeroEditorial`, `CategoryShelf`, `ProductShelf`, `ProductCard`, `FlashSaleModule`, `BrandSpotlight`, `EditorialPillars`, `TrustStrip`, `NewsletterSignup`, `MobileNav`, `StorefrontHeader`, `StorefrontFooter`.

### Commerce

`Price`, `Rating`, `ReviewCard`, `ReviewSummary`, `QuantityStepper`, `VariantSelector`, `ProductGallery`, `ProductGrid`, `BuyBox`, `SpecTable`, `OrderTable`, `OrderSummary`, `OrderItemRow`, `OrderTimeline`, `OrderAnnouncementCard`, `PaymentOption`, `PaymentMarks`, `CheckoutStepper`, `CheckoutAddressForm`, `AddressCard`, `CartLine`, `PromoField`, `FilterRail`, `FilterGroup`, `ActiveFilters`, `CategoryPills`, `Countdown`, `NotificationRow`, `ShopIdentity`.

`PaymentMarks` dùng `payment-marks.module.css` riêng để footer không kéo toàn bộ commerce CSS.

### Admin / Analytics

`AnalyticsCard`, `AnalyticsChart` (recharts + token), `AnalyticsTable`, `AnalyticsFilters`, `QuickFilter`, `ExportButton`, `ShipperInfoCard`.

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

- Dialog dùng Radix; luôn có title + description (có thể `.sn-visually-hidden`).
- Xoá/suspend dùng `ConfirmationModal` hoặc `ConfirmDialog`.
- Mobile nav/filter dùng `Sheet`.

### Feedback

- Thành công ngắn: `toast({ tone: 'success', message })`.
- Lỗi form: `InputError`/`Alert tone="danger"`.
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
