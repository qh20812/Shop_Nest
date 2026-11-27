# ShopNest UI Baseline — Phase 0

> Ngày đo: 2026-11-22
> Nhánh: `refactor/ui-web`
> Nguồn: codebase tại thời điểm bắt đầu `REFACTOR_PLAN.md` Phase 0.
> Mục đích: chốt điểm xuất phát trước khi refactor, làm căn cứ cho ratchet `check:css` và QA cuối.

## 1. Tóm tắt đo được

| Chỉ số | Giá trị |
|---|---:|
| Page component | 78 |
| Primitive `components/ui` | 47 |
| File import `Page.css` | 41 |
| Chỗ dùng `className=` | 2.096 |
| Render target thiếu file | 16 (17 trước Phase 5) |
| File trong `token-allowlist.json` sau baseline | 187 |
| Tổng vi phạm guardrail ghi nhận | 4.755 |

**Phân bố layout:** `Account` 13 · `AppLayout` 39 · `Auth` 7 · `none` 8 · `Storefront` 11

**File lớn nhất theo `className`:** `Seller/Promotions/Create.tsx` (82), `Admin/Promotions/Edit.tsx` (62), `Admin/Promotions/Create.tsx` (57), `Seller/Dashboard/Index.tsx` (57), `Admin/Inventory/Show.tsx` (52).

## 2. Cách dùng baseline này

1. Trước khi sửa một page, đọc dòng tương ứng trong bảng bên dưới.
2. Ghi audit 5 dòng theo `REFACTOR_PLAN.md` §6.1 (file, props, trạng thái, rỗng/lỗi, hành động chính).
3. Sau khi migrate, xoá file khỏi `scripts/token-allowlist.json`.
4. Chạy `npm run check:css`. Nếu fail, sửa tiếp; không thêm file vào allowlist.
5. Chạy `npm run check:css:all` khi cần xem toàn bộ vi phạm còn lại.

> `resources/css/base.css` nằm trong allowlist vì còn `@apply`. `resources/js/app.tsx` nằm trong allowlist vì còn `#4B5563`. Cả hai được xử lý ở Phase 1/11.

## 3. Inventory page

### Storefront công khai (4)

| # | Page | Layout | Props chính | Trạng thái | Hành động chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Home/About | Storefront | — | static | — | no props |
| 2 | Home/Contact | Storefront | — | loading | — | no props |
| 3 | Home/Index | Storefront | categories, flashSale, suggestedProducts, bestSellers, banners, canRegister, sr… | skeleton, loading | POST /user/wishlist/items/${product.id} | — |
| 4 | Home/Search | Storefront | query, total, products, filters, activeFilters | static | GET /search; POST /user/wishlist/items/${product.id} | — |

### Trang pháp lý (3)

| # | Page | Layout | Props chính | Trạng thái | Hành động chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Legal/PrivacyPolicy | Storefront | — | static | — | no props |
| 2 | Legal/SellingPolicy | Storefront | — | static | — | no props |
| 3 | Legal/Terms | Storefront | — | static | — | no props |

### Auth (7)

| # | Page | Layout | Props chính | Trạng thái | Hành động chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Auth/ForgotPassword | Auth | status | loading, form | useForm | — |
| 2 | Auth/Login | Auth | status, canResetPassword | loading | POST /login | errors.google |
| 3 | Auth/Register | Auth | — | loading | — | no props |
| 4 | Auth/ResetPassword | Auth | email, token | loading, form | useForm | — |
| 5 | Auth/SellerRegister | Auth | — | static | — | no props |
| 6 | Auth/ShipperRegister | Auth | — | loading, form | useForm | no props |
| 7 | Auth/VerifyEmail | Auth | status | result, loading, form | useForm | — |

### Customer (15)

| # | Page | Layout | Props chính | Trạng thái | Hành động chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Customer/Address/AddressForm | none | — | loading | — | no layout; no props |
| 2 | Customer/Address/Create | Account | provinces, errors | static | POST /user/addresses | — |
| 3 | Customer/Address/Edit | Account | address, provinces, wards, errors, name, phone, province_id, … (+2) | static | PUT /user/addresses/${address.id} | — |
| 4 | Customer/Address/Index | Account | addresses | empty, confirm, loading | PATCH /user/addresses/${address.id}/default; DELETE /user/addresses/${pendingDelete.id} | — |
| 5 | Customer/Address/Show | Account | address | confirm, loading | DELETE /user/addresses/${address.id} | — |
| 6 | Customer/Cart | Storefront | cartItems, totals, promotion | empty, confirm, loading | axios | — |
| 7 | Customer/ChangePassword/Index | Account | errors | loading | POST /user/change-password | — |
| 8 | Customer/Chat/Index | Account | — | static | — | no props |
| 9 | Customer/Checkout | Storefront | cartItems, order, orderItems, totals, subtotal, shipping, discount, … (+4) | empty, loading | axios | — |
| 10 | Customer/Notification/Index | Account | notifications, filters | empty, loading | GET /user/notifications; POST /user/notifications/mark-all-read | — |
| 11 | Customer/Orders/Index | Account | orders, filters, search | static | GET /user/orders | — |
| 12 | Customer/Orders/Show | Account | order | loading | POST /user/orders/${order.id}/reorder; POST /user/orders/${order.id}/cancel; POST /user/orders/${order.id}/review | — |
| 13 | Customer/PaymentResult | Storefront | provider, status, message, order, actions | result | — | — |
| 14 | Customer/ProductDetail | Storefront | product, reviews, rating, sold_count | empty | fetch | — |
| 15 | Customer/Profile/Index | Account | user, errors | loading | POST /user/profile | — |

### Seller workspace (10)

| # | Page | Layout | Props chính | Trạng thái | Hành động chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Seller/Dashboard/Index | AppLayout | shopStats, recentOrders, topSellingProducts, stockAlerts, currencyCode, total_r… | static | — | Page.css; Boxicons |
| 2 | Seller/Orders/Index | AppLayout | orders, filters, stats, flash, type | static | — | — |
| 3 | Seller/Orders/Show | AppLayout | order | loading | PUT /seller/orders/${order.id}/status | — |
| 4 | Seller/Products/Create | AppLayout | categories, brands, name, name_en, description, description_en, price, … (+10) | loading, form | useForm | Page.css; Boxicons |
| 5 | Seller/Products/Edit | AppLayout | product, categories, brands | loading, form | useForm | Page.css; Boxicons |
| 6 | Seller/Products/Index | AppLayout | products, filters, categories, brands | static | GET /seller/products; DELETE /seller/products/${product.product_id} | Page.css; Boxicons |
| 7 | Seller/Products/Show | AppLayout | product | static | — | Page.css; Boxicons |
| 8 | Seller/Promotions/Create | AppLayout | products, wallet | empty, confirm | POST /seller/promotions | Page.css |
| 9 | Seller/Promotions/Index | AppLayout | promotions, filters, pagination, wallet, flash, data | confirm | GET /seller/promotions; DELETE /seller/promotions/${confirmModal.promotionId}; fetch | Page.css; Boxicons |
| 10 | Seller/Shop/Edit | AppLayout | shop, name, description, logo, banner | static | POST /seller/shop | Page.css |

### Admin workspace (34)

| # | Page | Layout | Props chính | Trạng thái | Hành động chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Admin/Analytics/Index | AppLayout | stats, revenueChart, userGrowthChart, recentActivities, meta, locale, props | static | — | Page.css; Boxicons |
| 2 | Admin/Analytics/Orders | AppLayout | orders, filters, statusOptions, locale, currency, props | static | GET /admin/analytics/orders | Page.css; Boxicons |
| 3 | Admin/Analytics/Products | AppLayout | products, filters, locale, currency, props | static | GET /admin/analytics/products | Page.css; Boxicons |
| 4 | Admin/Analytics/Reports | AppLayout | report, filters, availableTypes, exportFormats, locale, props | static | GET /admin/analytics/reports | Page.css; Boxicons |
| 5 | Admin/Analytics/Revenue | AppLayout | revenue, filters, availablePeriods, locale, props | static | GET /admin/analytics/revenue; GET /admin/analytics/reports | Page.css; Boxicons |
| 6 | Admin/Analytics/Users | AppLayout | users, filters, availableRanges, locale, currency, props | static | GET /admin/analytics/users | Page.css; Boxicons |
| 7 | Admin/Brands/Create | AppLayout | — | form | useForm | Page.css; no props |
| 8 | Admin/Brands/Edit | AppLayout | brand | form | useForm | Page.css |
| 9 | Admin/Brands/Index | AppLayout | brands, totalBrands, filters, flash | confirm | GET /admin/brands; DELETE /admin/brands/${confirmModal.brandId}; PATCH /admin/brands/${confirmModal.brandId}/restore | Page.css; Boxicons |
| 10 | Admin/Categories/Create | AppLayout | parentCategories, flash | form | useForm | — |
| 11 | Admin/Categories/Edit | AppLayout | category, parentCategories, flash | form | useForm | — |
| 12 | Admin/Categories/Index | AppLayout | categories, totalCategories, filters, flash, type | confirm | GET /admin/categories; DELETE /admin/categories/${confirmModal.categoryId}; PATCH /admin/categories/${confirmModal.categoryId}/restore; DELETE /admin/categories/${confirmModal.categoryId}/force-delete | Boxicons |
| 13 | Admin/Dashboard/Index | AppLayout | stats, recentOrders, newUsers, revenueChart, userGrowthChart, currency, currenc… | static | — | Page.css; Boxicons |
| 14 | Admin/Inventory/History | AppLayout | product, history, locale, header, cell | static | — | Page.css; Boxicons |
| 15 | Admin/Inventory/Index | AppLayout | variants, filters, sellers, categories, brands, stockStatuses, flash, … (+2) | static | GET /admin/inventory; GET /admin/inventory/report | Page.css; Boxicons |
| 16 | Admin/Inventory/Show | AppLayout | product, locale, in_stock, low_stock, out_of_stock | static | — | Page.css; Boxicons |
| 17 | Admin/Orders/Index | AppLayout | orders, filters, statusOptions, paymentStatusOptions, orderSummary, currencyCod… | static | GET /admin/orders; GET /admin/orders/${orderId}; GET /admin/orders/${orderId}/assign-shipper; GET /admin/orders/${orderId}/update-status | — |
| 18 | Admin/Products/Index | AppLayout | products, categories, brands, filters, totalProducts, flash | confirm | GET /admin/products; PATCH /admin/products/${confirmModal.productId}/status | Page.css; Boxicons |
| 19 | Admin/Products/Show | AppLayout | product | static | — | — |
| 20 | Admin/Promotions/Create | AppLayout | products, categories, promotionTypes, flash, errors | loading, form | GET /admin/promotions; useForm | Page.css |
| 21 | Admin/Promotions/Edit | AppLayout | promotion, products, categories, promotionTypes, flash, errors, type | loading, form | GET /admin/promotions/${promotion.promotion_id}; useForm | Page.css |
| 22 | Admin/Promotions/Index | AppLayout | promotions, typeOptions, statusFilters, filters, flash, open | confirm | GET /admin/promotions; DELETE /admin/promotions/${confirmState.promotionId} | Page.css; Boxicons |
| 23 | Admin/Promotions/Show | AppLayout | promotion | static | GET /admin/promotions; GET /admin/promotions/${promotion.promotion_id}/edit | Page.css |
| 24 | Admin/Returns/Index | AppLayout | returns, filters, flash | static | GET /admin/returns; DELETE /admin/returns/${id} | — |
| 25 | Admin/Shippers/Index | AppLayout | shippers, totalShippers, filters, statusOptions, flash, type | confirm | GET /admin/shippers | Page.css; Boxicons |
| 26 | Admin/Shippers/Show | AppLayout | shipper, flash, type | confirm | PATCH /admin/shippers/${shipper.id}/status | Page.css; Boxicons |
| 27 | Admin/Shops/Dashboard | none | — | static | — | no layout; no props |
| 28 | Admin/Shops/Index | AppLayout | shops, filters, metrics | static | GET /admin/shops; GET /admin/shops/${shop.id} | Page.css |
| 29 | Admin/Shops/Pending | none | — | static | — | no layout; no props |
| 30 | Admin/Shops/Show | none | — | static | — | no layout; no props |
| 31 | Admin/Shops/Statistics | none | — | static | — | no layout; no props |
| 32 | Admin/Shops/Violations | none | — | static | — | no layout; no props |
| 33 | Admin/Users/Edit | AppLayout | user, roles, errors | static | — | — |
| 34 | Admin/Users/Index | AppLayout | users, roles, totalUsers, filters, flash, auth, type | confirm | GET /admin/users; DELETE /admin/users/${confirmModal.userId} | Page.css; Boxicons |

### Settings (4)

| # | Page | Layout | Props chính | Trạng thái | Hành động chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Settings/Appearance | Account | — | static | — | no props |
| 2 | Settings/Password | Account | — | loading, form | useForm | no props |
| 3 | Settings/Profile | Account | user, mustVerifyEmail, status, errors | loading, form | useForm | — |
| 4 | Settings/SettingsTabs | none | url | static | — | no layout |

### Shipper (1)

| # | Page | Layout | Props chính | Trạng thái | Hành động chính | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Shipper/Dashboard/Index | none | — | static | — | stub; no props |

## 4. Primitive `components/ui`

| Primitive | Số import | Import Page.css |
|---|---|---|
| button | 39 | — |
| typography | 19 | — |
| toast | 17 | — |
| badge | 16 | — |
| form-field | 16 | — |
| input | 16 | — |
| header | 15 | yes |
| pagination | 15 | — |
| card | 14 | — |
| data-table | 13 | — |
| avatar | 12 | — |
| filter-panel | 12 | yes |
| status-badge | 11 | — |
| action-buttons | 10 | — |
| empty-state | 9 | — |
| action-button | 8 | — |
| checkbox | 8 | — |
| confirmation-modal | 8 | — |
| icon-button | 8 | — |
| alert | 7 | — |
| text-link | 7 | — |
| skeleton | 6 | — |
| dialog | 5 | — |
| search-input | 5 | — |
| select | 5 | — |
| textarea | 5 | — |
| password-strength | 4 | — |
| radio-card | 4 | — |
| breadcrumbs | 3 | — |
| primary-input | 3 | — |
| tabs | 3 | — |
| insights | 2 | yes |
| rich-text-editor | 2 | — |
| sheet | 2 | — |
| action-dropdown | 1 | — |
| dropdown-menu | 1 | — |
| file-dropzone | 1 | — |
| language-switcher | 1 | — |
| navbar | 1 | yes |
| progress | 1 | — |
| sidebar | 1 | yes |
| switch | 1 | — |
| toaster | 1 | — |
| error-state | 0 | — |
| input-error | 0 | — |
| table | 0 | — |
| tooltip | 0 | — |

## 5. File đang import `Page.css` (41)

- `components/admin/analytics/AnalyticsCard.tsx`
- `components/admin/analytics/AnalyticsChart.tsx`
- `components/admin/analytics/AnalyticsFilters.tsx`
- `components/admin/analytics/AnalyticsTable.tsx`
- `components/admin/analytics/ExportButton.tsx`
- `components/admin/analytics/QuickFilter.tsx`
- `components/ui/filter-panel.tsx`
- `components/ui/header.tsx`
- `components/ui/insights.tsx`
- `components/ui/navbar.tsx`
- `components/ui/sidebar.tsx`
- `pages/Admin/Analytics/Index.tsx`
- `pages/Admin/Analytics/Orders.tsx`
- `pages/Admin/Analytics/Products.tsx`
- `pages/Admin/Analytics/Reports.tsx`
- `pages/Admin/Analytics/Revenue.tsx`
- `pages/Admin/Analytics/Users.tsx`
- `pages/Admin/Brands/Create.tsx`
- `pages/Admin/Brands/Edit.tsx`
- `pages/Admin/Brands/Index.tsx`
- `pages/Admin/Dashboard/Index.tsx`
- `pages/Admin/Inventory/History.tsx`
- `pages/Admin/Inventory/Index.tsx`
- `pages/Admin/Inventory/Show.tsx`
- `pages/Admin/Products/Index.tsx`
- `pages/Admin/Promotions/Create.tsx`
- `pages/Admin/Promotions/Edit.tsx`
- `pages/Admin/Promotions/Index.tsx`
- `pages/Admin/Promotions/Show.tsx`
- `pages/Admin/Shippers/Index.tsx`
- `pages/Admin/Shippers/Show.tsx`
- `pages/Admin/Shops/Index.tsx`
- `pages/Admin/Users/Index.tsx`
- `pages/Seller/Dashboard/Index.tsx`
- `pages/Seller/Products/Create.tsx`
- `pages/Seller/Products/Edit.tsx`
- `pages/Seller/Products/Index.tsx`
- `pages/Seller/Products/Show.tsx`
- `pages/Seller/Promotions/Create.tsx`
- `pages/Seller/Promotions/Index.tsx`
- `pages/Seller/Shop/Edit.tsx`

## 6. Render target thiếu file (16)

Trước Phase 5 là 17; `Auth/ConfirmPassword` đã được tạo trong Phase 5.

| Component | Nguồn render |
|---|---|
| Admin/CustomerSegments/Create | app/Http/Controllers/Admin/CustomerSegmentController.php |
| Admin/CustomerSegments/Edit | app/Http/Controllers/Admin/CustomerSegmentController.php |
| Admin/CustomerSegments/Index | app/Http/Controllers/Admin/CustomerSegmentController.php |
| Admin/CustomerSegments/Show | app/Http/Controllers/Admin/CustomerSegmentController.php |
| Admin/Inventory/Report | app/Http/Controllers/Admin/Concerns/InventoryReportingTrait.php |
| Admin/Orders/Show | app/Http/Controllers/Admin/OrderController.php |
| Admin/Returns/Show | app/Http/Controllers/Admin/ReturnController.php |
| Product/Index | app/Http/Controllers/ProductController.php |
| Product/Show | app/Http/Controllers/ProductController.php |
| Seller/Promotions/Edit | app/Http/Controllers/Seller/PromotionController.php |
| Seller/Promotions/Show | app/Http/Controllers/Seller/PromotionController.php |
| Seller/Reports/Products | app/Http/Controllers/Seller/ReportController.php |
| Seller/Reports/Revenue | app/Http/Controllers/Seller/ReportController.php |
| Seller/Wallet/Dashboard | app/Http/Controllers/Seller/WalletController.php |
| Seller/Wallet/TopUpStatus | app/Http/Controllers/Seller/WalletController.php |
| Seller/Wallet/Transactions | app/Http/Controllers/Seller/WalletController.php |

Không sửa các target này trong refactor UI. Ghi nhận để không bị hiểu là regression.

## 7. Baseline ảnh (thủ công)

Chụp 12 ảnh ở 1440 và 390, lưu vào `docs/ui/baseline/` (đã gitignore). Không cần Playwright.

| Route | Page |
|---|---|
| / | Home/Index |
| /search?q=laptop | Home/Search |
| /product/1 | Customer/ProductDetail |
| /about | Home/About |
| /contact | Home/Contact |
| /login | Auth/Login |
| /cart | Customer/Cart |
| /checkout | Customer/Checkout |
| /user/orders | Customer/Orders/Index |
| /seller/dashboard | Seller/Dashboard/Index |
| /admin/dashboard | Admin/Dashboard/Index |
| /shipper/dashboard | Shipper/Dashboard/Index (hiện 500, chụp sau Phase 9) |

Ghi chú:
- Cần đăng nhập tài khoản test có role Seller/Admin/Shipper cho các route workspace.
- `/shipper/dashboard` hiện lỗi do alias `shipper` chưa đăng ký; bỏ qua và chụp lại sau Phase 9.
- Đặt tên file: `<page>-1440.png`, `<page>-390.png`.
- Nếu chưa chụp được, ghi rõ trong PR; không chặn Phase 0 vì `check:css` đã là guardrail chính.

## 8. Giới hạn đã biết

- `tailwind-utility` chỉ quét class string trên dòng có `className`, `cn(`, `cx(`, `clsx(`; template literal nhiều dòng có thể bị bỏ sót.
- Allowlist là file-level: một file đã allowlist vẫn có thể nhận vi phạm mới. Vì vậy mỗi phase phải xoá entry khi migrate xong.
- Số liệu props/trạng thái/hành động được trích tự động từ source, không thay thế việc đọc code trước khi sửa page.
- Ảnh baseline là bước thủ công; Phase 0 không chặn nếu chưa có ảnh.
