# ShopNest Components

> Hệ component UI của ShopNest theo hướng **Nếp**.  
> Nguồn chuẩn: `DESIGN.md` · Kế hoạch: `PLAN.md`  
> Trạng thái: **Phase 0 + Phase 1 + Phase 2 hoàn tất**, luồng storefront bắt đầu từ Phase 3.

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
├── ui/           # primitive
├── layout/       # shell, header, footer, page header
├── storefront/   # module trang chủ
├── commerce/     # product, cart, checkout, order, account
├── Chat/         # chat workspace + bubble
└── feedback/     # dialog, result, loading overlay
```

Quy ước file:

- `components/ui`: kebab-case, ví dụ `form-field.tsx`.
- Các thư mục còn lại: PascalCase, ví dụ `ProductCard.tsx`.
- Hook: `useSomething.ts`.
- Type: `PascalCase`.

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
| Cart/checkout | `CartLine`, `OrderSummary`, `PromoField`, `CheckoutStepper`, `ShippingOption`, `PaymentOption` |

Page dùng chúng: `Home/search-page.tsx`, `Home/daily-discover-page.tsx`, `Home/flash-sale-page.tsx`, `Customer/Detail.tsx`, `Customer/Cart.tsx`, `Customer/Checkout.tsx`, `Customer/PaymentResult.tsx`. Ví dụ chi tiết ở mục 13.

### Phase 4 — Account

`OrderTable`, `OrderTimeline`, `OrderItemRow`, `AddressCard`, `NotificationRow`, `PreferenceRow`, `ReturnItemPicker`, `RefundOption`.

### Phase 5 — Chat

`ChatDock`, `ChatbotLauncher`, `ChatbotPanel`, `ChatWorkspace`, `ConversationList`, `ConversationRow`, `ChatHeader`, `MessageList`, `ChatMessage`, `TypingIndicator`, `QuickReplies`, `ChatComposer`, `OrderAnnouncementCard`, `OrderContextRail`.

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
- Phase 6 xoá toàn bộ allowlist.
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

Lưu ý casing trên Windows: ba primitive cũ được nâng cấp tại chỗ để tránh trùng file case-insensitive:

- `components/ui/Avatar.tsx` (không tạo thêm `avatar.tsx`)
- `components/ui/Tooltip.tsx` (không tạo thêm `tooltip.tsx`)
- `components/ui/Pagination.tsx` (không tạo thêm `pagination.tsx`)

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
import Avatar from '@/components/ui/Avatar';
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
import Pagination from '@/components/ui/Pagination';
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
import Pagination from '@/components/ui/Pagination';

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
import { ShippingOption } from '@/components/commerce/ShippingOption';

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

<ShippingOption value="standard" selected title="Giao tiêu chuẩn 2–4 ngày" price={shipping} eta="Dự kiến 2–4 ngày" onChange={setShipping} />
```

- Checkout vẫn gửi `POST /checkout` hoặc `POST /buy-now/checkout/{orderId}` với `provider`, `address_id`, `notes`. Không đổi tên field.
- Địa chỉ dùng `RadioCard`; thêm địa chỉ mở `Dialog` chứa `CheckoutAddressForm` (province → district → ward, gọi `/addresses/*`).
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
