# ShopNest Components

> Hệ component UI của ShopNest theo hướng **Nếp**.  
> Nguồn chuẩn: `DESIGN.md` · Kế hoạch: `PLAN.md`  
> Trạng thái: **Phase 0 → Phase 6 hoàn tất**, Storefront + Auth + Account + Chat dùng token/component Nếp.

---

## 1. Nguyên tắc

1. Mọi màu, font, size, spacing, radius, shadow, motion, z-index lấy từ `resources/css/tokens.css`.
2. Không viết hex màu, `text-[13px]`, `rounded-[20px]`, `shadow-xl`, `bg-gray-*` trong component mới.
3. Chỉ dùng **Lucide** cho icon. Không dùng Boxicons, Bootstrap Icons, Font Awesome, Material Symbols trong component mới.
4. `components/ui` là primitive, không biết nghiệp vụ.
5. `components/commerce` được phép format giá/ngày và biết domain commerce.
6. Một pattern chỉ có một component chuẩn.
7. Page đã migrate không import CSS legacy.
8. Không copy HTML/class từ Stitch; chỉ dùng cấu trúc và hierarchy làm reference.

---

## 2. Token quick reference

### Màu

| Token | Utility | Giá trị |
|---|---|---|
| `--color-rice-paper` | `bg-rice-paper` | `#F6F1E6` |
| `--color-warm-porcelain` | `bg-warm-porcelain` | `#FFFCF4` |
| `--color-raw-linen` | `bg-raw-linen` | `#EDE4D3` |
| `--color-ink` | `text-ink` | `#1D1B17` |
| `--color-ink-muted` | `text-ink-muted` | `#6B6458` |
| `--color-ink-faint` | `text-ink-faint` | `#9A8F7F` |
| `--color-border` | `border-border` | `#DCD1BE` |
| `--color-lacquer-red` | `bg-lacquer-red` | `#B23A2F` |
| `--color-lacquer-deep` | `bg-lacquer-deep` | `#8C2A22` |
| `--color-lacquer-wash` | `bg-lacquer-wash` | `#F2DCD5` |
| `--color-jade` | `text-jade` | `#2F6B57` |
| `--color-turmeric` | `text-turmeric` | `#8A5A1A` |
| `--color-brick` | `text-brick` | `#8B2A24` |
| `--color-logo-blue` | `text-logo-blue` | `#4991D8` — chỉ logo |

### Typography

| Token | Dùng cho |
|---|---|
| `font-display` + `text-display-xl` / `text-display-lg` | Hero, campaign, Auth, Legal |
| `text-headline-1` / `text-headline-2` / `text-headline-3` | Heading thường |
| `text-body-lg` / `text-body-md` / `text-body-sm` | Body copy |
| `text-label-code` + `font-mono` | Giá, SKU, mã đơn, ngày, KPI |
| `text-label-micro` | Eyebrow, table header, metadata uppercase |

### Layout và size

| Token | Utility | Giá trị |
|---|---|---|
| `--container-page` | `max-w-page` | `90rem` |
| `--spacing-gutter-mobile` | `px-gutter-mobile` | `1rem` |
| `--spacing-gutter-tablet` | `px-gutter-tablet` | `2rem` |
| `--spacing-gutter` | `px-gutter` | `3rem` |
| `--spacing-section` | `py-section` | `clamp(3rem, 8vw, 6rem)` |
| `--spacing-control-sm` | `h-control-sm` | `2.25rem` |
| `--spacing-control-md` | `h-control-md` | `2.75rem` |
| `--spacing-control-lg` | `h-control-lg` | `3rem` |
| `--spacing-tap` | `size-tap` | `2.75rem` |
| `--spacing-header` | `h-header` | `4rem` |
| `--spacing-sidebar` | `w-sidebar` | `15rem` |
| `--spacing-filter-rail` | `w-filter-rail` | `17.5rem` |
| `--spacing-chat-pane` | `w-chat-pane` | `20rem` |
| `--spacing-chat-launcher` | `size-chat-launcher` | `3.5rem` |
| `--spacing-chat-panel` | `w-chat-panel` | `23.75rem` |
| `--spacing-chat-panel-height` | `h-[var(--spacing-chat-panel-height)]` | `min(40rem, calc(100dvh - 3rem))` |
| `--spacing-chat-sheet-height` | `h-chat-sheet-height` | `85dvh` |
| `--spacing-chat-workspace-height` | `min-h-chat-workspace-height` | `38rem` |

### Radius và shadow

| Token | Utility |
|---|---|
| `--radius-checkbox` | `rounded-checkbox` |
| `--radius-chip` | `rounded-chip` |
| `--radius-control` | `rounded-control` |
| `--radius-card` | `rounded-card` |
| `--radius-surface` | `rounded-surface` |
| `--radius-sheet` | `rounded-sheet` |
| `--radius-pill` | `rounded-pill` |
| `--shadow-soft` | `shadow-soft` |
| `--shadow-float` | `shadow-float` |
| `--shadow-modal` | `shadow-modal` |
| `--ease-nep` | `ease-nep` |

### Z-index

| Utility | Giá trị |
|---|---:|
| `z-header` | 30 |
| `z-dropdown` | 40 |
| `z-chat` | 40 |
| `z-modal` | 50 |
| `z-toast` | 60 |

### Utilities đặc biệt

| Utility | Dùng cho |
|---|---|
| `focus-ring` | Focus visible 2px Lacquer Red, offset 2px |
| `scrollbar-hide` | Ẩn scrollbar cho rail ngang |

---

## 3. Cấu trúc thư mục

```text
resources/js/components/
├── ui/           # primitive, file kebab-case
├── layout/       # shell, header, footer, page header
├── storefront/   # module trang chủ
├── commerce/     # product, cart, checkout, order, account
├── chat/         # chat workspace + bubble
├── admin/        # component workspace Admin (legacy)
├── auth/         # form auth dùng chung (SellerRegisterForm)
└── feedback/     # dialog, result, loading overlay
```

Quy ước file:

- Folder component: lowercase (`ui`, `layout`, `commerce`, `chat`, `admin`, `feedback`).
- `components/ui`: file kebab-case, ví dụ `form-field.tsx`.
- Các domain khác: file PascalCase, ví dụ `ProductCard.tsx`.
- Page: folder + file PascalCase, ví dụ `pages/Auth/Login.tsx`.
- Hook: `useSomething.ts`; type module: `types.ts`.

---

## 4. Component status

### Phase 1 — đã dựng

| Nhóm | Component |
|---|---|
| Typography/action | `Typography`, `Button`, `IconButton`, `TextLink` |
| Form | `Input`, `Textarea`, `Select`, `Checkbox`, `RadioCard`, `Switch`, `FormField`, `PasswordStrength`, `SearchInput`, `FileDropzone` |
| Display | `Card`, `Badge`, `OrderStatusBadge`, `Avatar`, `Progress`, `Skeleton` |
| Navigation | `Breadcrumbs`, `Tabs`, `Pagination`, `Table`, `DropdownMenu`, `Tooltip` |
| Overlay/feedback | `Dialog`, `Sheet`, `Toast`, `Toaster`, `EmptyState`, `ErrorState`, `Alert`, `ConfirmDialog`, `LoadingOverlay`, `ResultState` |
| Commerce atoms | `Price`, `Rating`, `QuantityStepper`, `Countdown`, `PaymentMarks` |

### Phase 2 — Layout/Auth/Home — đã dựng

`PageContainer`, `PageHeader`, `SectionHeader`, `StorefrontHeader`, `StorefrontFooter`, `StorefrontLayout`, `AuthLayout`, `AuthBrandPanel`, `AccountLayout`, `MobileNav`; `HeroEditorial`, `UtilityStrip`, `CategoryShelf`, `FlashSaleModule`, `ProductShelf`, `TrustStrip`, `EditorialPillars`, `BrandSpotlight`, `NewsletterSignup`.

### Phase 3 — Storefront flow — đã dựng

| Nhóm | Component |
|---|---|
| Catalog | `ProductCard`, `ProductGrid`, `FilterRail`, `FilterGroup`, `ActiveFilters`, `CategoryPills` |
| Product detail | `ProductGallery`, `BuyBox`, `VariantSelector`, `SpecTable`, `ShopIdentity`, `ReviewSummary`, `ReviewCard` |
| Cart/checkout | `CartLine`, `OrderSummary`, `PromoField`, `CheckoutStepper`, `PaymentOption` |

Page dùng chúng: `Home/Search.tsx`, `Customer/ProductDetail.tsx`, `Customer/Cart.tsx`, `Customer/Checkout.tsx`, `Customer/PaymentResult.tsx`. `daily-discover`/`flash-sale` đã xoá vì chưa có route. Ví dụ chi tiết ở mục 13.

### Phase 4 — Account — đã dựng

| Nhóm | Component |
|---|---|
| Layout | `AccountLayout` |
| Orders | `OrderTable`, `OrderTimeline`, `OrderItemRow` |
| Address | `AddressCard` (form địa chỉ nằm trong `pages/Customer/Address/AddressForm.tsx`) |
| Notifications | `NotificationRow`, `PreferenceRow` |
| Return/wishlist (component-only) | `ReturnItemPicker`, `RefundOption`, `ProductCard variant="wishlist"` |

Page dùng chúng: `Customer/Orders/Index.tsx`, `Customer/Orders/Show.tsx`, `Customer/Address/{Index,Create,Edit,Show}.tsx`, `Customer/Profile/Index.tsx`, `Customer/ChangePassword/Index.tsx`, `Customer/Notification/Index.tsx`, `Settings/{Profile,Password,Appearance}.tsx`. Ví dụ chi tiết ở mục 14.

### Phase 5 — Chat — đã dựng

| Nhóm | Component |
|---|---|
| Primitives | `ChatMessage`, `TypingIndicator`, `QuickReplies`, `ChatComposer`, `MessageList` |
| Workspace | `ConversationRow`, `ConversationList`, `ChatHeader`, `ChatWorkspace` |
| Bubble | `ChatbotLauncher`, `ChatbotPanel`, `ChatDock` |
| Commerce | `OrderAnnouncementCard`, `OrderContextRail` |
| Hook | `useChatConversations` |

Page dùng chúng: `Customer/Chat/Index.tsx`; `ChatDock` mount trong `StorefrontLayout` (AccountLayout kế thừa). Ví dụ chi tiết ở mục 15.

### Reserved — chưa dùng nhưng giữ có chủ đích

- `commerce/ReturnItemPicker.tsx`, `RefundOption.tsx` — C03
- `commerce/PreferenceRow.tsx` + `ui/switch.tsx` — C07
- `ui/table.tsx` — primitive đích thay `data-table` workspace
- `ui/error-state.tsx`, `feedback/LoadingOverlay.tsx` — trạng thái chuẩn

### Workspace legacy (đã rename, chưa merge API)

`ui/action-button`, `ui/action-buttons`, `ui/primary-input`, `ui/input-error`, `ui/data-table`, `ui/confirmation-modal`, `ui/status-badge`, `ui/filter-panel`, `ui/header`, `ui/insights`, `ui/language-switcher`, `ui/navbar`, `ui/rich-text-editor`, `ui/sidebar`.

Các file này chỉ dùng cho Seller/Admin/Shipper, sẽ merge vào primitive Nếp khi migrate workspace.

### Deferred

`WorkspaceShell` (Seller/Admin/Shipper), charts, C03 return page, C04 wishlist page, dark mode.

---

## 5. Cách thêm component mới

1. Kiểm tra bảng inventory trong `PLAN.md` và file này.
2. Nếu pattern đã có, dùng lại hoặc mở rộng variant; không tạo component trùng.
3. Nếu cần giá trị mới, thêm token vào `resources/css/tokens.css` trước.
4. Tạo file đúng thư mục, export PascalCase.
5. Dùng `cn()` cho `className`.
6. Dùng `cva` cho `variant`/`size`.
7. Thêm state: default, hover, focus, disabled, loading, error (nếu áp dụng).
8. Thêm ví dụ vào file này.
9. Chạy `npm run check:tokens`.

Ví dụ cấu trúc component:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const exampleVariants = cva('inline-flex items-center rounded-control font-sans', {
    variants: {
        tone: {
            ink: 'bg-warm-porcelain text-ink border border-border',
            accent: 'bg-lacquer-red text-warm-porcelain',
        },
        size: {
            md: 'h-control-md px-5 text-body-sm',
            lg: 'h-control-lg px-6 text-body-md',
        },
    },
    defaultVariants: {
        tone: 'ink',
        size: 'md',
    },
});

type ExampleProps = React.ComponentProps<'div'> & VariantProps<typeof exampleVariants>;

export function Example({ className, tone, size, ...props }: ExampleProps) {
    return <div className={cn(exampleVariants({ tone, size }), className)} {...props} />;
}
```

---

## 6. Legacy allowlist

`scripts/token-allowlist.json` chứa các file legacy còn vi phạm token. Mục đích là để `check:tokens` có thể pass trong giai đoạn migrate mà không che giấu code mới.

Quy tắc:

- File mới **không** được thêm vào allowlist.
- Khi migrate xong một file, xoá entry tương ứng khỏi allowlist.
- Phase 6 giữ allowlist cho workspace legacy (Seller/Admin/Shipper); xoá khi migrate workspace.
- Reserved components không nằm trong allowlist trừ khi có vi phạm token thật.
- Chạy `npm run check:tokens:all` để xem toàn bộ vi phạm còn lại.

---

## 7. Lệnh kiểm tra

```bash
npm run types
npm run lint
npm run build
npm run check:tokens
```

Xem toàn bộ vi phạm legacy:

```bash
npm run check:tokens:all
```

Tạo lại baseline sau khi đã migrate:

```bash
npm run check:tokens:baseline
```

---

## 8. Chatbot bubble

Đặc tả đầy đủ ở `PLAN.md` mục 6. Tóm tắt:

- Launcher 56×56, `bg-lacquer-red`, icon Lucide `MessageCircle`.
- Panel desktop 380px, mobile bottom sheet 85dvh.
- Chỉ hiện ở storefront + account.
- Không mascot/robot.
- Dùng `ChatMessage`, `ChatComposer` của C08.
- `z-chat` = 40.

---

## 9. Phase 1 — đã hoàn tất

- [x] Dựng toàn bộ primitive theo batch.
- [x] Thêm example cho từng component vào file này.
- [x] Giữ entry legacy cho tới khi page/component được migrate.
- [x] Không refactor page trước khi primitive ổn định.

Lưu ý casing trên Windows: Phase 6 đã rename ba primitive cũ sang kebab-case qua tên tạm `.tmp`:

- `components/ui/avatar.tsx`
- `components/ui/tooltip.tsx`
- `components/ui/pagination.tsx`

---

## 10. Ví dụ sử dụng primitive

### Typography

```tsx
import { Eyebrow, Heading, MetaText, Text } from '@/components/ui/typography';

<Eyebrow tone="accent">Mọi thứ cho tổ ấm Việt</Eyebrow>
<Heading level={1} size="headline-1">Giỏ hàng</Heading>
<Text tone="muted">Đồ điện tử, gia dụng và đồ dùng mỗi ngày.</Text>
<MetaText>#SN-24817</MetaText>
```

`serif` chỉ dùng cho hero/campaign/Auth:

```tsx
<Heading level={1} size="display-lg" serif>
  Chọn đồ thật kỹ, sống thật êm.
</Heading>
```

### Button và IconButton

```tsx
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';

<Button rightIcon={ArrowRight}>Xem chợ hôm nay</Button>
<Button variant="secondary" size="sm">Mua ngay</Button>
<Button variant="destructive" loading>Đang xoá</Button>
<IconButton label="Thêm vào giỏ" tooltip="Thêm vào giỏ">
  <Plus />
</IconButton>
```

### Form

```tsx
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

<FormField label="Email" required hint="Dùng để nhận cập nhật đơn hàng." error={errors.email}>
  <Input type="email" placeholder="ban@example.com" />
</FormField>

<FormField label="Tỉnh / Thành phố" required>
  <Select
    placeholder="Chọn tỉnh thành"
    options={[
      { value: 'HN', label: 'Hà Nội' },
      { value: 'HCM', label: 'TP. Hồ Chí Minh' },
    ]}
  />
</FormField>
```

`FormField` tự inject `id`, `aria-invalid`, `aria-describedby` vào control con.

### Checkbox, RadioCard, Switch

```tsx
import { Checkbox } from '@/components/ui/checkbox';
import { RadioCard } from '@/components/ui/radio-card';
import { Switch } from '@/components/ui/switch';

<Checkbox label="Ghi nhớ đăng nhập" />
<RadioCard
  name="shipping"
  value="standard"
  checked={shipping === 'standard'}
  onChange={() => setShipping('standard')}
  title="Giao tiêu chuẩn"
  description="2–4 ngày làm việc"
  meta="Miễn phí"
/>
<Switch checked={enabled} onCheckedChange={setEnabled} label="Nhận tin đơn hàng" />
```

### Search, Textarea, FileDropzone

```tsx
import SearchInput from '@/components/ui/search-input';
import Textarea from '@/components/ui/textarea';
import FileDropzone from '@/components/ui/file-dropzone';

<SearchInput value={query} onChange={(event) => setQuery(event.target.value)} onSubmit={runSearch} />
<Textarea autoGrow maxRows={6} counter maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} />
<FileDropzone files={files} onFiles={(next) => setFiles(next)} onRemove={removeFile} />
```

### Card, Badge, Avatar, Progress

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

<Card variant="raised" padding="lg">
  <CardHeader>
    <CardTitle>Doanh thu tháng</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>

<Badge tone="success" dot>Đang bán</Badge>
<Avatar name="Nguyễn Thu Hà" size="md" status="online" />
<Progress value={88} tone="warning" label="Đã bán" showValue />
```

### Breadcrumbs, Tabs, Pagination, Table

```tsx
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Tabs } from '@/components/ui/tabs';
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';

<Breadcrumbs items={[{ label: 'Chợ', href: '/' }, { label: 'Điện tử' }]} />
<Tabs
  variant="underline"
  value={tab}
  onValueChange={setTab}
  items={[
    { value: 'description', label: 'Mô tả sản phẩm' },
    { value: 'specs', label: 'Thông số kỹ thuật' },
    { value: 'reviews', label: 'Đánh giá', count: 126 },
  ]}
/>
<Pagination page={page} pageCount={52} total={1248} pageSize={24} onPageChange={setPage} />
<Table
  columns={[
    { key: 'code', header: 'Mã đơn', accessor: (row) => row.code },
    { key: 'total', header: 'Tổng tiền', align: 'right', accessor: (row) => row.total },
  ]}
  data={orders}
  rowKey="id"
  empty="Chưa có đơn nào."
/>
```

### Dialog, Sheet, ConfirmDialog

```tsx
import { Dialog } from '@/components/ui/dialog';
import { Sheet } from '@/components/ui/sheet';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Đổi địa chỉ giao hàng"
  description="Chọn địa chỉ đã lưu hoặc thêm địa chỉ mới."
  footer={<Button onClick={save}>Lưu thay đổi</Button>}
>
  ...
</Dialog>

<Sheet open={filtersOpen} onOpenChange={setFiltersOpen} side="bottom" title="Bộ lọc">
  ...
</Sheet>

<ConfirmDialog
  open={removeOpen}
  onOpenChange={setRemoveOpen}
  title="Xác nhận bỏ sản phẩm?"
  description="Món hàng này sẽ được gỡ khỏi giỏ thanh toán."
  confirmLabel="Đồng ý xoá"
  onConfirm={removeItem}
/>
```

### Toast

```tsx
import { useToast } from '@/components/ui/toast';

const { success, error } = useToast();

success('Đã thêm vào giỏ hàng', '1× Laptop ASUS Vivobook 14');
error('Không thể áp dụng mã', 'Mã đã hết lượt sử dụng.');
```

`app.tsx` render `<Toaster />` một lần. `Contexts/ToastContext.tsx` hiện re-export từ `ui/toast` để code cũ tiếp tục chạy.

### Empty, Error, Alert, ResultState

```tsx
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Alert } from '@/components/ui/alert';
import { ResultState } from '@/components/feedback/ResultState';

<EmptyState title="Giỏ đang trống" description="Chọn một món cho tổ ấm nhé." actions={<Button>Xem chợ hôm nay</Button>} />
<ErrorState onRetry={reload} />
<Alert tone="warning" title="Mã khuyến mãi không hợp lệ" description="Mã đã hết lượt áp dụng." />
<ResultState status="success" orderCode="SN-24817" title="Đặt hàng thành công" message="Shop sẽ xác nhận đơn trong 15 phút." />
```

### Price, Rating, QuantityStepper, Countdown, PaymentMarks

```tsx
import Price from '@/components/commerce/Price';
import { Rating } from '@/components/commerce/Rating';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { Countdown } from '@/components/commerce/Countdown';
import { PaymentMarks } from '@/components/commerce/PaymentMarks';

<Price value={14990000} compareAt={16490000} size="xl" />
<Rating value={4.8} count={126} />
<QuantityStepper value={quantity} min={1} max={14} onChange={setQuantity} />
<Countdown endsAt="2026-11-13T23:59:59+07:00" />
<PaymentMarks methods={['visa', 'mastercard', 'jcb', 'stripe']} />
```

---

## 11. Quy tắc khi dùng primitive

1. Không truyền class màu thủ công để “sửa” primitive; thêm variant/token nếu thiếu.
2. Không bọc `Button` trong `div` chỉ để căn lề; dùng `className` của Button.
3. Không tự tạo `input`/`select`/`button` mới trong page nếu primitive đã có.
4. `FormField` là nơi duy nhất xử lý label/hint/error layout.
5. `Dialog`/`Sheet` đã có focus trap; không tự viết modal mới.
6. Toast dùng store toàn cục; không tạo `ToastProvider` lồng nhau có `Toaster` riêng.
7. IconButton phải có `label`; icon chỉ dùng Lucide.

---

## 12. Ví dụ layout và storefront

### Storefront shell

```tsx
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';

<StorefrontLayout>
  <HeroEditorial ... />
  <CategoryShelf categories={categories} />
  <TrustStrip items={trustItems} />
</StorefrontLayout>
```

`HomeLayout` hiện chỉ còn là wrapper tương thích:

```tsx
import HomeLayout from '@/layouts/app/HomeLayout';

<HomeLayout>
  <LegacyPage />
</HomeLayout>
```

Trang mới nên import `StorefrontLayout` trực tiếp.

### Container và heading

```tsx
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';

<PageContainer className="py-section">
  <PageHeader
    breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Giỏ hàng' }]}
    eyebrow="Đơn hàng"
    title="Giỏ hàng"
    count="3 món"
    actions={<Button>Thanh toán</Button>}
  />
  <SectionHeader eyebrow="Gợi ý" title="Sản phẩm bán chạy" action={<TextLink href="/search">Xem tất cả</TextLink>} />
</PageContainer>
```

### Hero và home modules

```tsx
<HeroEditorial
  eyebrow="Mọi thứ cho tổ ấm Việt"
  title={<>Chọn <HeroInlineImage src={laptop} alt="Laptop" /> đồ thật kỹ,<br />sống <HeroInlineImage src={table} alt="Bàn ăn" /> thật êm.</>}
  subcopy="Đồ điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm đẹp từ các shop Việt đã kiểm duyệt."
  cta={{ label: 'Xem chợ hôm nay', href: '/search' }}
  images={[{ src: laptop, alt: 'Laptop' }, { src: airfryer, alt: 'Nồi chiên' }, { src: stroller, alt: 'Xe đẩy' }]}
  trust={['1.200+ Shop Việt', '100% kiểm định nguồn gốc']}
/>

<UtilityStrip items={utilityItems} />
<CategoryShelf categories={categories} />
<FlashSaleModule endsAt={endTime} products={products} />
<ProductShelf title="Sản phẩm bán chạy" products={bestSellers} />
<BrandSpotlight />
<TrustStrip items={trustItems} />
```

### Auth layout

```tsx
import { AuthBrandPanel } from '@/components/layout/AuthBrandPanel';
import { AuthLayout } from '@/components/layout/AuthLayout';

<AuthLayout brand={<AuthBrandPanel role="seller" />}>
  <SellerRegisterForm />
</AuthLayout>

// A05 / A06
<AuthLayout variant="centered">
  <ForgotPasswordForm />
</AuthLayout>
```

### Header và footer

```tsx
import { StorefrontFooter } from '@/components/layout/StorefrontFooter';
import { StorefrontHeader } from '@/components/layout/StorefrontHeader';

<StorefrontHeader cartCount={3} unreadCount={2} />
<StorefrontFooter />
<StorefrontFooter compact />
```

Header tự lấy `auth.user`, `locale`, `currency`, `cartCount` và `unreadCount` từ Inertia page props; prop truyền vào sẽ override.

### Product card

```tsx
import { ProductCard } from '@/components/commerce/ProductCard';

<ProductCard
  product={product}
  priority
  onAddToCart={(item) => router.visit(`/product/${item.id}`)}
  onToggleWishlist={(item) => router.post(`/user/wishlist/items/${item.id}`)}
/>
```

`variant="wishlist"` dùng cho lưới yêu thích; `variant="compact"` cho rail hẹp.

---

## 13. Ví dụ storefront flow (Phase 3)

### Catalog: filter rail + grid + phân trang

```tsx
import { ProductGrid } from '@/components/commerce/ProductGrid';
import { FilterRail } from '@/components/commerce/FilterRail';
import { FilterGroup } from '@/components/commerce/FilterGroup';
import { ActiveFilters } from '@/components/commerce/ActiveFilters';
import { CategoryPills } from '@/components/commerce/CategoryPills';
import Pagination from '@/components/ui/pagination';

<CategoryPills
  items={[{ value: '', label: 'Tất cả' }, ...categories]}
  value={selectedCategoryId}
  onChange={(value) => updateFilters({ category_ids: value === '' ? [] : [Number(value)] })}
/>

<ActiveFilters filters={activeFilters} onRemove={removeFilter} onClear={clearAll} />

<FilterRail activeCount={activeFilters.length} onClear={clearAll}>
  <FilterGroup title="Danh mục" count={selectedCategoryIds.length}>
    <Checkbox checked={checked} onCheckedChange={(next) => toggle(...)} label={category.name} />
  </FilterGroup>
</FilterRail>

<ProductGrid
  products={products}
  columns={3}
  onAddToCart={(product) => router.visit(`/product/${product.id}`)}
  onToggleWishlist={(product) => router.post(`/user/wishlist/items/${product.id}`)}
/>

<Pagination page={page} pageCount={lastPage} total={total} pageSize={perPage} onPageChange={goToPage} />
```

- `ProductGrid` có `loading` (render skeleton) và `emptyTitle`/`emptyDescription`.
- `FilterRail` sticky ở `lg`, dùng lại nguyên khối trong `Sheet` cho mobile.
- Server giữ query key: `search`, `category_ids[]`, `brand_ids[]`, `price_min`, `price_max`, `rating_min`, `states[]`, `sort`, `page`.

### Product detail

```tsx
import { ProductGallery } from '@/components/commerce/ProductGallery';
import { BuyBox } from '@/components/commerce/BuyBox';
import { VariantSelector } from '@/components/commerce/VariantSelector';
import { SpecTable } from '@/components/commerce/SpecTable';
import { ShopIdentity } from '@/components/commerce/ShopIdentity';
import { ReviewSummary } from '@/components/commerce/ReviewSummary';
import { ReviewCard } from '@/components/commerce/ReviewCard';

<ProductGallery images={images} activeIndex={index} onChange={setIndex} productName={name}
  wishlisted={favorited} onToggleWishlist={toggleWishlist} />

<BuyBox
  title={product.name}
  shop={shop}
  rating={rating.average}
  reviewCount={rating.count}
  soldCount={soldCount}
  price={currentPrice}
  compareAt={compareAt}
  stock={variant.available_quantity}
  quantity={quantity}
  maxQuantity={maxQuantity}
  onQuantityChange={setQuantity}
  onAddToCart={handleAddToCart}
  onBuyNow={handleBuyNow}
  adding={isAdding}
  buying={isBuying}
>
  <VariantSelector groups={groups} selected={selected} onChange={handleAttributeSelect} />
</BuyBox>

<SpecTable rows={[{ label: 'Thương hiệu', value: brand.name }]} />
<ReviewSummary rating={rating.average} count={rating.count} breakdown={breakdown} onFilter={setRatingFilter} />
<ReviewCard review={{ id, user: { name, avatar }, rating, comment, createdAt, verified }} />
```

- `BuyBox` sticky ở `lg`, gồm shop, giá, tồn kho, số lượng, CTA và trust list; `children` đặt giữa giá và stepper (dùng cho variant).
- Route/payload giữ nguyên: `POST /product/{id}/add-to-cart`, `POST /product/{id}/buy-now`, wishlist `/user/wishlist/items/{id}`.

### Cart

```tsx
import { CartLine } from '@/components/commerce/CartLine';
import { OrderSummary } from '@/components/commerce/OrderSummary';
import { PromoField } from '@/components/commerce/PromoField';

<CartLine
  item={{ id, name, image, href, shopName, variant, price, compareAt, quantity, maxQuantity }}
  selected={selected}
  onSelect={setSelected}
  onQuantityChange={setQuantity}
  onRemove={() => setPendingDelete([id])}
/>

<OrderSummary
  items={summaryItems}
  subtotal={totals.subtotal}
  discount={totals.discount}
  shipping={totals.shipping}
  shippingLabel={totals.shipping > 0 ? undefined : 'Tính ở bước sau'}
  total={totals.total}
  ctaLabel="Thanh toán"
  onCheckout={() => router.visit('/checkout')}
  promotion={<PromoField value={code} onChange={setCode} onApply={applyPromo} onRemove={removePromo} appliedCode={promotion?.code} />}
  footerNote="Đã bao gồm thuế VAT và phí kiểm định."
/>
```

- Cart mutation đúng backend: `POST /cart/update/{itemId}` body `{ quantity }`, `POST /cart/remove/{itemId}`.
- Checkbox trong giỏ chỉ phục vụ xoá hàng loạt; checkout luôn dùng toàn bộ giỏ như backend hiện tại.
- Xoá dùng `ConfirmDialog`; `OrderSummary` hiển thị tổng theo backend, không tự tính lại.

### Checkout

```tsx
import { CheckoutStepper } from '@/components/commerce/CheckoutStepper';
import { PaymentOption } from '@/components/commerce/PaymentOption';

<CheckoutStepper current={1} steps={[{ label: 'Giỏ hàng', state: 'done' }, { label: 'Thông tin & thanh toán' }, { label: 'Hoàn tất' }]} />

<PaymentOption
  value="stripe"
  selected={selectedPayment === 'stripe'}
  onChange={setSelectedPayment}
  title="Stripe — Thẻ quốc tế"
  description="Thanh toán bằng thẻ Visa/MasterCard/JCB"
  icon={CreditCard}
  marks={['visa', 'mastercard', 'jcb', 'stripe']}
/>
```

- Checkout vẫn gửi `POST /checkout` hoặc `POST /buy-now/checkout/{orderId}` với `provider`, `address_id`, `notes`. Không đổi tên field.
- Vận chuyển hiện chỉ có một phương thức backend tính phí; không còn `ShippingOption` chọn tay.
- Địa chỉ dùng `RadioCard`; thêm địa chỉ mở `Dialog` chứa `CheckoutAddressForm` (province → ward, gọi `/addresses/*`).
- Rời trang khi có ghi chú/promo chưa lưu sẽ hiện `ConfirmDialog` qua `CheckoutExitConfirmation`.

### Kết quả thanh toán

```tsx
import { ResultState } from '@/components/feedback/ResultState';

<ResultState
  status="success"
  orderCode={order.code}
  title="Đặt hàng thành công"
  message="Shop sẽ xác nhận đơn trong 15 phút."
  actions={<Button asChild><Link href="/user/orders">Xem đơn hàng</Link></Button>}
/>
```

`status` nhận `success | pending | failure`; `PaymentResult` tự map `succeeded | canceled | failed` từ backend và fallback action theo trạng thái.

---

## 14. Ví dụ account flow (Phase 4)

### Account shell

```tsx
import { AccountLayout } from '@/components/layout/AccountLayout';

<AccountLayout
  active="orders"
  breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Đơn hàng' }]}
  eyebrow="Tài khoản"
  title="Đơn hàng của tôi"
  description="Theo dõi trạng thái và tiến trình giao hàng."
  count={`${orders.length} đơn`}
  actions={<Button asChild><Link href="/user/addresses">Địa chỉ</Link></Button>}
>
  {children}
</AccountLayout>
```

- `AccountLayout` bọc `StorefrontLayout` + `PageContainer` + `PageHeader` và thanh nav tài khoản (Đơn hàng, Địa chỉ, Hồ sơ, Mật khẩu, Thông báo, Cài đặt).
- Không truyền `active` thì layout tự suy ra từ `usePage().url`; `active` dùng khi cần override (ví dụ `/settings/*`).
- Page tự render `<Head title="..." />`; layout không đặt title.

### Đơn hàng (C01)

```tsx
import { OrderTable } from '@/components/commerce/OrderTable';

<OrderTable
  orders={orders.map((order) => ({
    id: order.id,
    code: order.code,
    status: order.status, // enum backend: pending_confirmation, delivering, ...
    paymentStatus: order.payment_status,
    total: order.total,
    createdAt: order.created_at,
  }))}
  emptyDescription="Khi bạn đặt món đầu tiên, đơn hàng sẽ xuất hiện tại đây."
/>
```

- Desktop render `<table>`, mobile tự chuyển sang danh sách card.
- `status` nhận nguyên enum backend; `normalizeOrderStatus` + `backendOrderStatusLabel` trong `lib/status.ts` map sang badge Nếp.
- `paymentStatus` dùng `paymentStatusTone`/`paymentStatusLabel`.

### Chi tiết đơn + timeline (C02)

```tsx
import { OrderTimeline } from '@/components/commerce/OrderTimeline';
import { OrderItemRow } from '@/components/commerce/OrderItemRow';
import { OrderStatusBadge } from '@/components/commerce/OrderStatusBadge';

<OrderStatusBadge status={normalizeOrderStatus(order.status)} label={backendOrderStatusLabel(order.status)} />

<OrderTimeline
  steps={[
    { key: 'placed', label: 'Đặt hàng' },
    { key: 'confirmed', label: 'Shop xác nhận' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã giao' },
  ]}
  current={currentStep(order.status)}
  tone={isCancelled ? 'cancelled' : isReturned ? 'returned' : 'default'}
/>

<OrderItemRow item={{ id, name, image, variant: sku, quantity, price }} />
```

- `OrderTimeline` đánh dấu bước đã xong bằng `Check`, bước hiện tại bằng dot, bước huỷ/trả bằng `X`.
- Huỷ đơn dùng `Dialog` + `Textarea` lý do rồi `POST /user/orders/{id}/cancel`; mua lại dùng `POST /user/orders/{id}/reorder`.
- Đánh giá chỉ hiện khi `order.can_review` và chưa có review; gửi `POST /user/orders/{id}/review` với `rating`, `comment`.

### Địa chỉ (C05)

```tsx
import { AddressCard } from '@/components/commerce/AddressCard';

<AddressCard
  address={address}
  busy={busyId === address.id}
  onEdit={() => router.visit(`/user/addresses/${address.id}/edit`)}
  onSetDefault={() => router.patch(`/user/addresses/${address.id}/default`)}
  onDelete={() => setPendingDelete(address)}
/>
```

- Đặt mặc định dùng `PATCH /user/addresses/{id}/default` (không dùng `set-default`).
- Xoá dùng `ConfirmDialog`; backend tự chọn địa chỉ kế tiếp làm mặc định.
- Form create/edit dùng `pages/Customer/Address/AddressForm.tsx`; API tỉnh/xã trả `{ success, data }`.

### Thông báo (C07)

```tsx
import { NotificationRow } from '@/components/commerce/NotificationRow';

<NotificationRow notification={notification} onRead={(id) => markRead(id)} />
```

- `NotificationRow` tự chọn icon Lucide theo `category`/`type_label`; không dùng Material Symbol.
- `POST /user/notifications/mark-all-read` qua Inertia; `POST /user/notifications/{id}/read` qua axios rồi cập nhật state cục bộ.
- `/notifications` redirect sang `/user/notifications`; page demo `pages/Notifications/Index.tsx` đã xoá ở Phase 6.

### Return/refund (C03/C04 — component-only)

```tsx
import { ReturnItemPicker } from '@/components/commerce/ReturnItemPicker';
import { RefundOption } from '@/components/commerce/RefundOption';

<ReturnItemPicker items={items} value={selected} onChange={setSelected} />
<RefundOption
  value={method}
  onChange={setMethod}
  options={[
    { value: 'original', title: 'Hoàn về phương thức ban đầu' },
    { value: 'wallet', title: 'Hoàn vào ví ShopNest' },
  ]}
/>
```

Chưa có route/page C03; chỉ dùng lại khi backend trả hàng được nối.

### Settings

- `SettingsTabs` (page-local) render tab Hồ sơ / Mật khẩu / Giao diện.
- `Settings/Profile` giữ payload `POST /settings/profile` với `_method=PATCH`, `avatar`, `remove_avatar`.
- `Settings/Password` giữ payload `PUT /settings/password` với `current_password`, `password`, `password_confirmation`.
- `Settings/Appearance` dùng `useTheme` + `RadioCard`; giao diện tối vẫn là thử nghiệm và sẽ xử lý cùng workspace/legacy tokens.

---

## 15. Ví dụ chat (Phase 5)

### ChatDock (bubble)

`ChatDock` tự mount trong `StorefrontLayout`; không cần thêm vào page.

```tsx
import { ChatDock } from '@/components/chat/ChatDock';

<ChatDock />
<ChatDock enabled={false} />
```

- Tự ẩn ở `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/checkout`, `/payments/*`, `/chat`, `/customer/chat`, `/admin/*`, `/seller/*`, `/shipper/*`.
- Chỉ render khi `auth.user` tồn tại; launcher 56px, panel 380px desktop, bottom sheet 85dvh mobile.
- Radix Dialog lo focus trap, ESC, `aria-expanded`, trả focus về launcher; panel và launcher không hiện cùng lúc.
- Gọi `POST /chatbot/message` (JSON), hiển thị typing, lỗi mạng thành bubble lỗi; lịch sử lưu localStorage theo user id.

### Primitives

```tsx
import { ChatMessage } from '@/components/chat/ChatMessage';
import { MessageList } from '@/components/chat/MessageList';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { QuickReplies } from '@/components/chat/QuickReplies';
import { ChatComposer } from '@/components/chat/ChatComposer';

<ChatMessage variant="incoming" content="Đơn của bạn đang giao." timestamp="14:30" />
<ChatMessage variant="outgoing" content="Cảm ơn shop" status="delivered" timestamp="14:31" />
<ChatMessage variant="error" content="Không thể kết nối trợ lý." />

<TypingIndicator label="Đang soạn tin" />
<QuickReplies items={['Tra cứu đơn hàng', 'Chính sách đổi trả']} onSelect={(value) => send(value)} />
<ChatComposer value={draft} onChange={setDraft} onSend={send} />
<MessageList messages={items} typing={typing} loading={loading} />
```

- `ChatMessage.variant`: `incoming | outgoing | system | error`; `status`: `sending | sent | delivered | failed`.
- `MessageList` auto-scroll đáy, `role="log"` + `aria-live="polite"`, có skeleton và empty state.
- `ChatComposer` Enter gửi, Shift+Enter xuống dòng, chặn IME composition, tối đa 500 ký tự.

### Workspace (C08)

```tsx
import { ChatWorkspace } from '@/components/chat/ChatWorkspace';

<ChatWorkspace />
<ChatWorkspace order={{ id: 12, code: 'ORD-123', status: 'delivering', total: 450000 }} />
```

- `useChatConversations` fetch `GET /chat/conversations`, gửi `POST /chat/messages`, tạo cuộc trò chuyện `POST /chat/conversations`, tìm người `GET /chat/users/search?q=`.
- Echo private `chat.{id}` lắng nghe `.message.created`; nếu Reverb tắt, gửi/nhận vẫn hoạt động ở phía client đã gửi.
- Mobile: danh sách → chat, nút back đưa về danh sách; màn hình lớn là 2–3 pane.
- `OrderContextRail` chỉ hiện khi truyền `order`; hiện backend chat chưa gắn order vào conversation.
- Trang chuẩn: `/customer/chat`; `/chat` redirect về đó.

### Order context

```tsx
import { OrderAnnouncementCard } from '@/components/commerce/OrderAnnouncementCard';
import { OrderContextRail } from '@/components/commerce/OrderContextRail';

<OrderAnnouncementCard order={{ id, code, status, total, itemCount }} />
<OrderContextRail order={order} onAsk={(question) => setDraft(question)} />
```

Dùng trong message (order announcement) hoặc rail phải của workspace khi có order context thật.
