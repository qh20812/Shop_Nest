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
| `StorefrontLayout` | Home, Search, ProductDetail (auth), Checkout (auth), Legal, About/Contact | Header + main + footer; mount `ChatDock` một lần; skip-link. `showChatDock={false}` cho checkout; `footerClassName` chừa chỗ cho fixed mobile bar |
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

`CategoryShelf` là frosted media tile: nền `--sn-glass-control`, hairline, inset highlight, `--sn-shadow-card`, bo `--sn-radius-card` 16; mỗi tile padding 8, ảnh 1:1 inset theo padding, bo `--sn-radius-media` 10, icon fallback 32px. Tên 2 dòng đổi accent khi hover, meta "Xem sản phẩm" dùng sans 12px muted. Hover nhấc 3px + zoom ảnh 1.03; focus-visible chỉ đổi border để ring xuất hiện tức thì; reduced-motion bỏ transform, reduced-transparency dùng surface đặc. Trang chủ bỏ eyebrow và mũi tên ở action "Tất cả danh mục".

`HeroEditorial` là “storefront wash”: `backdropImage` full-bleed phía sau, blur + wash canvas, panel chữ kính 5/12 (mobile full width), media window 7/12 gồm ảnh dẫn 4:5 và hai ảnh 4:3. Panel dùng `--sn-glass-menu`, radius 20, hairline, inset highlight, shadow-glass, không `backdrop-filter`; caption dưới ảnh có hairline. Ảnh dẫn eager + `fetchPriority="high"`; motion nền 20s một lần, panel/ảnh rise 320ms, tắt dưới reduced motion. Reduced transparency ẩn wash và dùng surface đặc; forced-colors ẩn wash.

`FlashSaleModule` là band full-width, không card: rule accent 2px trên, hairline dưới, header title + countdown, grid 4/2. `BrandSpotlight` là split 12 cột ảnh trái 7/copy 5, ảnh 4:3 bo 16, không card. `EditorialPillars` dùng 5/3/4 với top hairline, ảnh 4:3 bo 16. `TrustStrip` là service ledger 4/2/1 cột, hairline dọc, icon inline 18px, không icon box.

`StorefrontFooter` là content band đặc: rule accent 2px trên, nền `--sn-color-canvas-alt`, masthead 5/7 gồm brand lockup lớn + contact và newsletter có hairline dọc; directory 3 cột từ 640px / 1 cột mobile với top hairline; bottom bar copyright + legal + PaymentMarks. Compact footer ẩn newsletter và masthead còn 1 cột. Social placeholder `href="#"` đã bỏ.

`NewsletterSignup` dùng label “Email” nhìn thấy (`htmlFor` + `useId`), input + button cùng hàng từ 640px; form giữ submit hiện tại.

### Commerce

`Price`, `Rating`, `ReviewCard`, `ReviewSummary`, `QuantityStepper`, `VariantSelector`, `ProductGallery`, `ProductGrid`, `BuyBox`, `SpecTable`, `OrderTable`, `OrderSummary`, `OrderItemRow`, `OrderTimeline`, `OrderAnnouncementCard`, `PaymentOption`, `PaymentMarks`, `CheckoutStepper`, `CheckoutAddressForm`, `AddressCard`, `CartLine`, `PromoField`, `FilterRail`, `FilterGroup`, `ActiveFilters`, `CategoryPills`, `Countdown`, `NotificationRow`, `ShopIdentity`.

`ProductCard` là frosted media card: nền `--sn-glass-control`, hairline, inset highlight, `--sn-shadow-card`, bo `--sn-radius-card` 16; ảnh 1:1 inset 8px bo `--sn-radius-media` 10. Sale pill trên ảnh, wishlist và quick-action pill dùng `surface="overlay"`. Quick pill label "Choose options", hiện khi hover/focus, luôn hiện dưới 768px hoặc thiết bị không hover. `actionLabel`/`actionIcon` cho phép override nhãn và icon hành động (mặc định "Choose options" + `ShoppingCart`).

`ProductShelf` render `variant="grid"` 2 cột mobile / 4 cột desktop hoặc `variant="rail"` cuộn ngang với card 16rem desktop, 13rem mobile và scroll-snap. Trang chủ dùng grid cho best sellers, rail cho suggestions; action mặc định "Xem tất cả" không mũi tên.

`Price` render discount dưới dạng pill accent-wash 20px cao, hairline, tabular-nums; value thêm tracking snug. `Rating` nhận `chip?: boolean`; chỉ có tác dụng khi `compact` và render pill 24px (glass-control + hairline + inset highlight) bo tròn, dùng ở `ProductCard` và cạnh H1 của trang chi tiết. `ShopIdentity`, `ReviewCard`, `ReviewSummary` và trang đơn hàng giữ rating dạng text để tránh pill spam.

`Customer/ProductDetail` là product record: top stage 6/6, gallery frosted media card 4:5 với thumb strip, counter, prev/next từ 768px và ArrowLeft/ArrowRight; cột phải borderless gồm seller line (`ShopIdentity variant="compact"`), H1, rating chip link `#reviews`, price line, variants, quantity, hai CTA, delivery + assurance ledger. Mobile đặt intro trước gallery, purchase sau gallery. Nội dung xếp dọc: `Details` (mô tả 7 cột + thông số 5 cột), `Reviews` (summary 4 cột + list 8 cột + pager), `Related products` 4/2 cột. Không còn tab, không còn shop card lặp, không card lồng card. Sticky cột mua chỉ bật từ 1024px và viewport cao ≥820px.

`ProductGallery` nhận `images`, `activeIndex`, `onChange`, `productName`, `wishlisted`, `onToggleWishlist`; hiển thị tất cả ảnh trong strip cuộn ngang, counter `n / total`, disable điều hướng khi chỉ có một ảnh. `BuyBox` chỉ nhận price/compareAt/stock/canBuy/quantity/CTA/delivery/trust và `children` (variant selector); không render title, shop hay rating. `ShopIdentity` nhận `variant="compact"`, `chatLabel`, `viewShopLabel`. `ReviewSummary` render hàng breakdown tĩnh khi không có `onFilter`, chỉ dùng button khi filter được truyền. `SpecTable` là ledger 2 cột từ 640px, nhận rows từ category/brand/SKU và thuộc tính của biến thể đang chọn.

`Customer/Checkout` là app screen: header không eyebrow, stepper rail 3 đoạn, desktop 7/5 với form hairline và order slip sticky, mobile có fixed bottom bar `Tổng cộng` + `Đặt hàng`; ChatDock ẩn trên checkout. Address/payment dùng `RadioCard`, shipping là ledger row phẳng, note là `FormField` + `Textarea`; CTA không disabled ở trạng thái nghỉ, validate và cuộn tới section thiếu. `Checkout.module.css` sở hữu layout; `customer.module.css` không còn được trang này import.

`OrderSummary` nhận `mobileActionBar?: boolean`: khi bật, CTA trong card ẩn dưới 1024 và một fixed bar hiện total + CTA; desktop giữ card sticky, toggle tĩnh và title hiện. Item ảnh 1:1 48px với `width`/`height`/`alt=""` và `onError`; legal note dùng `--sn-text-xs` muted; trust dùng check icon. `PaymentOption` đặt `PaymentMarks` dưới description thay vì meta để title không bị ép. `CheckoutStepper` là grid 3 cột marker + label, bỏ separator `/` và thanh accent rời.

`FilterRail` là content panel đặc: surface, hairline, bo `--sn-radius-xl` 12; desktop sticky với `max-height: calc(100dvh - var(--sn-header-stuck) - 16px)`, `.filterRailBody` cuộn riêng, header và nút "Xoá tất cả" đứng yên. `variant="sheet"` bỏ nền/border/max-height để sheet là bề mặt duy nhất và ẩn header trùng với tiêu đề sheet. `FilterGroup` dùng `summary` có hit area, hover wash và focus ring; count là pill neutral, active count là pill accent-wash.

`PaymentMarks` dùng `payment-marks.module.css` riêng để footer không kéo toàn bộ commerce CSS.

### Admin / Analytics

`AnalyticsCard`, `AnalyticsChart` (recharts + token), `AnalyticsTable`, `AnalyticsFilters`, `QuickFilter`, `ExportButton`, `ShipperInfoCard`.

`AnalyticsCard` và `Insights` dùng frosted stat card (glass-control + hairline + inset highlight + `--sn-shadow-card`, radius 16, không blur). Metric card của Seller thêm `metricCardFrosted` khi đứng trực tiếp trên canvas; bên trong `Card` nội dung thì giữ nền đặc để không lồng card. `AnalyticsFilters` mặc định là glass slab (`surface="glass"`, blur) và đặt thẳng trên nền `canvas-deep`; khi nằm trong panel kính khác thì truyền `surface="content"`. `FilterPanel` dùng `.sn-glass-surface` cho grid; control bên trong dùng `surface="glass"`. Chart card và data table giữ bề mặt đặc.

`Admin/Dashboard` dùng composition 3 dải: KPI instrument rail (`dl` frosted, 4 register, doanh thu rộng hơn), signal grid (doanh thu area 2fr + user growth bar 1fr), ledger grid (Recent Orders `DataTable` 2fr + New Users ledger 1fr). `DataTable` nhận `headerMeta` tuỳ chọn để hiện count bên phải head; New Users dùng head + rows hairline, không card.

`Admin/Users` là directory ledger: `PageHeader` (badge tổng user), filter toolbar kính có label Tìm kiếm/Vai trò/Trạng thái + nút Áp dụng, `DataTable` gộp identity (avatar, tên, #id, email) và `headerMeta` là range phân trang thật. Search/role/status state, auto-search, confirm toggle, toast, modal và pagination giữ nguyên; role badge neutral.

`Admin/Users/Edit` là account record: `PageHeader` (breadcrumb Dashboard > Users > tên user, action quay lại danh sách), grid 2 cột ≥1024 gồm form panel đặc và rail hồ sơ. Form chia section Thông tin tài khoản (họ, tên, email + hint đăng nhập) và Quyền truy cập (status, role register dùng `description` thật từ `RoleSeeder`); rail hiện avatar, username, ID, ngày tham gia, email xác minh. Tự sửa mình khoá status/role ở cả UI và backend (403), form chỉ gửi họ tên/email; không card lồng card, `Save changes` có loading.

`Admin/Categories` là category directory: `PageHeader` count + nút Thêm danh mục, filter toolbar kính Tìm kiếm/Trạng thái + Áp dụng, summary rail 4 register (Tổng không gồm trashed/Đang hoạt động/Ngừng/Hidden) lấy từ `statusCounts`, `DataTable` 5 cột (Category thumb + tên + #ID + ngày tạo, Description clamp 2 dòng, Structure parent + số danh mục con/sản phẩm, Status, Actions). Inactive có Activate nhanh; trashed có Restore/Delete; ảnh được chuẩn hoá `Storage::url`.

`Admin/Brands` là brand ledger: `PageHeader` count + nút Thêm thương hiệu, filter toolbar kính Tìm kiếm/Trạng thái + Áp dụng, summary rail 4 register (Tổng không gồm trashed/Đang hoạt động/Ngừng/Đã ẩn) lấy từ `statusCounts`, `DataTable` 5 cột (Brand logo contain + tên + #ID + ngày tạo, Description clamp 2 dòng, Products count, Status, Actions). Status phân biệt `deleted_at` = Hidden, `is_active = false` = Inactive; soft-delete đổi nhãn thành Hide, trashed có Restore; logo được chuẩn hoá `Storage::url`.

`Admin/Brands/Create` và `Edit` dùng chung `BrandForm`: `PageHeader`, grid 2 cột ≥1024 gồm form panel (Brand Name, Description rich text full width, Status) và rail logo 1:1 + tóm tắt. File input native styled, preview logo hiện tại/mới bằng object URL, hint PNG/JPG/WebP tối đa 1 MB; Edit giữ payload `_method: PUT`, hiện Products và Created Date. Không tách EN/VI, giữ một tên như cũ.

`Admin/Orders` là order ledger: `PageHeader` count filtered, một filter slab duy nhất gồm Search/Status/Payment/From/To + Áp dụng/Đặt lại, summary register 4 ô toàn bộ đơn (Tổng/Chờ xác nhận/Hoàn tất/Đã hủy), `DataTable` 5 cột (Order mã + ngày, Customer tên + email, Total, Status, Payment) với `headerMeta` range thật và View mở chi tiết. Bỏ metric card icon tile + label in hoa; empty state theo filter.

`Admin/Orders/Show` là order record: `PageHeader` mã đơn + badge status/payment, grid 2 cột ≥1024 gồm panel items ledger (thumb, tên, variant, qty, đơn giá, thành tiền) + Payment Summary, rail customer/shipping address/payment/timeline/notes. Assign Shipper và Refund dùng route hiện có, chỉ hiện khi còn hiệu lực; controller đã sửa eager-load `shippingAddress`, product image, role shipper `name->en` và cột `shipment_journeys` để trang không 500.

`Admin/Categories/Create` và `Edit` dùng chung `CategoryForm`: `PageHeader`, grid 2 cột gồm form panel (tên EN/VI, mô tả rich text full width, parent/status) và rail ảnh 1:1 + tóm tắt. Parent options build cây nhiều cấp, loại self + descendants, thụt depth, inactive bị disable trừ parent hiện tại; Edit giữ nguyên payload `_method: PUT`, preview ảnh current/new và ngày tạo.

`Admin/Products` là directory 5 cột: `PageHeader` (badge totalProducts filtered), filter toolbar kính có label Tìm kiếm/Danh mục/Thương hiệu/Trạng thái + nút Áp dụng, `DataTable` với ProductInfoCell, Seller + brand, Price + stock, Status, Actions; `headerMeta` là range phân trang. Status actions, toast, modal, pagination giữ nguyên; giá dùng text thường, không accent. Draft/pending có thêm View để mở trang chi tiết trước khi duyệt.

`Admin/Products/Show` là product record: `PageHeader` (badge trạng thái + danh mục/thương hiệu trong description, actions kiểm duyệt theo ngữ cảnh), grid 2 cột gồm gallery + tabs Mô tả/Đánh giá bên trái và rail hồ sơ bên phải (seller + link shop, Product ID, danh mục, thương hiệu, Created/Updated, tổng biến thể/tồn/khoảng giá), bảng biến thể full width (SKU, thuộc tính, giá + giảm giá, tồn + badge). Approve/Reject/Activate/Deactivate dùng `ConfirmationModal`, gửi `redirect_to=show` để ở lại trang; review chưa duyệt có badge "Chờ duyệt".

`Admin/Inventory` là stock ledger: `PageHeader`, filter toolbar kính có label Tìm kiếm/Người bán/Danh mục/Thương hiệu/Trạng thái tồn + nút Áp dụng, stock rail 4 register (tổng biến thể filtered, trên trang, tồn thấp trang, hết hàng trang) và `DataTable` 5 cột (Product 3 dòng, Seller, Price + discount, Stock + status, Actions). `headerMeta` là range phân trang; View/History, pagination, filter state và toast giữ nguyên.

`Admin/Inventory/Show` là product stock record: `PageHeader` (tên sản phẩm, #ID/seller/danh mục/thương hiệu trong description), stock rail 4 register (tổng tồn, đã giữ, tồn thấp, hết hàng), `DataTable` biến thể 5 cột (Variant SKU + thuộc tính, Price + discount, Reserved, Stock + badge, History) và timeline "Biến động gần đây" 8 log mới nhất. Link History theo biến thể truyền `?variant=`.

`Admin/Inventory/History` là movement ledger: `PageHeader` (tên sản phẩm + seller), filter bar kính Biến thể/Loại biến động + Áp dụng (state trên URL), summary rail 4 register tính trên tập đã lọc (tổng thay đổi, lượt nhập, lượt xuất, cập nhật cuối), `DataTable` 5 cột (Time, Variant, Change, Reason, User), `headerMeta` range thật và `Pagination` giữ filter. Trang dùng chung `InventoryDetail.module.css` với Show.

`Admin/Promotions` là promotion ledger: `PageHeader` count filtered + nút Tạo khuyến mãi, filter toolbar kính Tìm kiếm/Trạng thái/Loại + Áp dụng, summary rail 4 register trạng thái (Upcoming/Active/Paused/Expired, đếm backend trên scope search/type), `DataTable` 6 cột (Promotion + scope Platform/Seller + type + ngày, Discount, Budget + spent, Usage, Status, Actions). `statusCounts`/`totalPromotions` do controller trả; `Xem/Sửa/Xoá` giữ nguyên, confirm xoá kèm tên.

`Admin/Promotions/Show` là promotion record: `PageHeader` (status badge + scope + type), rail Discount/Usage/Allocated/Spent, panel Thông tin (ngày, min order, max discount, ROI, auto apply, mô tả) + Sản phẩm, aside Phạm vi (Platform/seller + email) + Danh mục. Ngày dùng `formatDate` + `formatTime`, không middle dot; product tag link sang `/admin/products/{id}`.

`Admin/Promotions/Create` và `Edit` dùng chung `PromotionForm`: `PageHeader`, form panel đặc 3 section (Thông tin chung / Lịch trình / Áp dụng cho) và rail Tóm tắt live (type, value, ngày, giới hạn, số sản phẩm/danh mục, auto-apply); Edit thêm section Hiện tại (status, scope, allocated/spent/ROI, used_count) và giữ logic status chỉ sửa khi active/paused. Chọn sản phẩm/danh mục dùng `PromotionPicker`: search theo tên/SKU (bỏ dấu tiếng Việt), danh sách checkbox cuộn, đếm selected + clear, cap 100 kết quả; Status badge dùng chung `PromotionStatusBadge` map draft → Upcoming.

Chart: `YAxis` dùng compact formatter (`N`/`Tr`/`NT`) + width 64; grid 1px; không gradient.

### Wallet

`Wallet/Index` (`/wallet`, mọi role đã đăng nhập) chọn layout theo prop `layout`: `AccountLayout` cho customer, `WorkspaceLayout` cho admin/seller/shipper. Cột trái là số dư (không card: label, số tabular, hairline, Đã nhận/Đã dùng) và sổ giao dịch 5 cột có filter Loại/Từ ngày/Đến ngày giữ state trên URL; cột phải là phiếu nạp: preset 100k/200k/500k/1m + input, khi có mã thì hiện mã 6 ký tự, số tiền, ngân hàng/STK/chủ TK kèm nút copy, QR VietQR trên nền giấy cố định, đếm ngược 24 giờ, nút "Tôi đã chuyển"/"Huỷ mã", poll 15 giây. "Yêu cầu nạp gần đây" giữ rejected/expired vì hai trạng thái này không có dòng sổ cái.

`Admin/WalletTopups` là review queue: `PageHeader` + rail 5 trạng thái đếm thật (`statusCounts`), filter kính Trạng thái/Mã, `DataTable` 8 cột (Người dùng, Mã, Khai báo, Ghi có, Trạng thái, Chờ, Hạn, Actions). Mặc định lọc `transferred` và sắp cũ nhất trước; dialog duyệt nhập số tiền ghi có, hiện chênh lệch live, cảnh báo khi user chưa báo chuyển, từ chối bằng disclosure lý do (không mở modal thứ hai). Trang tự poll 8 giây (dừng khi tab ẩn, refresh khi focus), cập nhật row/count trong chỗ và highlight row mới 10 giây; không reload sau khi duyệt.

Trang ví và queue dùng `LiveStatus` (nhãn "Cập nhật lúc HH:mm" + nút làm mới). `/wallet` poll `GET /wallet/state` mỗi 10 giây; queue poll JSON admin mỗi 8 giây; action trả state/counts mới nên không cần `router.reload`.

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
