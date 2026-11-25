# Phase 12 — QA sweep

> Ngày chạy: 2026-11-25
> Nhánh: `refactor/ui-web`
> Phạm vi: UI-only sau Phase 11, không đổi route/controller ngoài các lỗi runtime phát hiện khi QA.

## 1. Môi trường

| Hạng mục | Giá trị |
|---|---|
| PHP | 8.5.12 |
| Dusk | 8.8.0 |
| Chrome / ChromeDriver | 158.0.8127.37 / 158.0.8127.88 |
| DB QA | MySQL 8.0 trong Docker `Shop_Nest_DB`, port host `3307`, database `shopnest_qa` |
| Server | `php artisan serve --env=dusk.local --host=127.0.0.1 --port=9999` |
| Dữ liệu | `php artisan migrate:fresh --seed --force --env=dusk.local` (full `DatabaseSeeder`) |
| Tài khoản seed | Admin `quan.nguyen@shopnest.vn`, Seller `hung.nguyen@shopnest.vn`, Customer `lan.nguyen@gmail.com`, Shipper `tai.bui@shopnest.vn`; mật khẩu seed `@12345Password` |
| Build | `npm run build`; assets lấy từ `public/build/manifest.json` |

Không dùng DB Aiven. `.env.dusk.local` và `database/*.sqlite` đã được gitignore.

## 2. Cách chạy lại

```bash
docker start Shop_Nest_DB
docker exec Shop_Nest_DB mysql -uroot -pnewpassword \
  -e "CREATE DATABASE IF NOT EXISTS shopnest_qa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

php artisan migrate:fresh --seed --force --env=dusk.local
php artisan serve --env=dusk.local --host=127.0.0.1 --port=9999

php artisan dusk:chrome-driver --detect
php artisan dusk --filter=Phase12QaTest
```

`Phase12QaTest` dùng `loginAs()` cho từng role, không chạy `CompletePurchaseFlowTest` (test cũ dùng selector đã bị xoá ở Phase 4–11).

## 3. Kết quả

- **5 test method / 10 assertion**, 0 fail (chỉ còn 6 DEPRECATION `PDO::MYSQL_ATTR_SSL_CA` của PHP 8.5).
- **74 URL/state** trên 4 role + guest.
- **287 ảnh** lưu tại `tests/Browser/screenshots/phase12/` (gitignored, không commit).
- Mỗi URL kiểm tra:
  - HTTP status qua `performance.navigation.responseStatus`;
  - redirect ngoài dự kiến;
  - `scrollWidth - innerWidth > 2px`;
  - body không chứa `[object Object]`, `NaN`, `Server Error`;
  - dark mode `data-theme='dark'` áp dụng đúng.

### Phủ breakpoint

| Nhóm | 375 | 390 | 480 | 768 | 1024 | 1280 | 1440 | Dark |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Guest: home, search, product detail | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | home, search, product, login |
| Customer: orders, cart, checkout, address, profile, settings, chat | ✓ |  |  | ✓ |  |  | ✓ | orders, cart, checkout, product |
| Seller: dashboard, products, orders, promotions, shop | ✓ |  |  | ✓ |  |  | ✓ | dashboard, products |
| Admin: dashboard, users, products, inventory, orders, promotions, categories, brands, shops, shippers, returns, analytics | ✓ |  |  | ✓ |  |  | ✓ | dashboard, analytics |
| Shipper: dashboard + settings | ✓ |  |  | ✓ |  |  | ✓ | dashboard |

Các trang layout-critical (home, search, product detail, checkout, seller dashboard/products, admin dashboard/analytics/inventory, shipper dashboard) chạy đủ **7 mốc**.

## 4. Lỗi phát hiện và đã sửa

| Lỗi | Ảnh hưởng | Fix |
|---|---|---|
| Shell storefront kéo `commerce.module.css` 53,5 KB + chat 20 KB | First-load storefront/account ~157–174 KB | Tách `payment-marks.module.css`, `chat-launcher.module.css`; lazy `ChatbotPanel` (`10ceec7`) |
| Filter tabs Admin Analytics tràn ngang 61 px @375 | Scrollbar toàn trang | `min-width: 0`/`max-width: 100%` cho `.sn-tabs`, `.filtersActions` (`05a0b3b`) |
| Y-axis chart hiện `00000000` do thiếu width/format | Chart không đọc được | `tickFormatter` compact + `width={64}` (`05a0b3b`) |
| Order card mobile dính mã đơn và ngày | Khó đọc | `.orderCardMeta` flex column (`05a0b3b`) |
| 500 `/admin/shops/{id}` và `/statistics` | MySQL 8 `DISTINCT` + `ORDER BY` | `recentCustomersForShop` dùng `GROUP BY` + `MAX(created_at)` (`2181a1b`) |
| 500 `/admin/analytics/orders` | Enum cast + filter alias `o.created_at` | Cast `BackedEnum`, viết lại `buildFulfillmentMetrics` (`2181a1b`) |
| Log `avatar_url` không tồn tại ở Admin Dashboard | Recent orders rỗng | Select `avatar` + `append('avatar_url')` (`2181a1b`) |
| Checkout hiện `[object Object]` ở phường/quận/tỉnh | Sai địa chỉ | `Localization::resolveField` trong `buildAddressPayload` (`651edd3`) |
| Thiếu 4 nhãn loại khuyến mãi tiếng Việt | Seller Promotions hiện tiếng Anh | Thêm 4 key `vi` (`ff3458a`) |
| Không có skip-link | Keyboard/AT khó vào nội dung | `.sn-skip-link` + `id="main-content"` ở 3 layout (`59729d4`) |

## 5. Bundle CSS sau Phase 12

| Chunk | Bytes | Ghi chú |
|---|---:|---|
| `app-*.css` | 86.063 | Entry toàn cục, ~84 KB |
| `StorefrontLayout-*.css` | 14.582 | Storefront shell + chat launcher + payment marks |
| `commerce-*.css` | 46.058 | Lazy/route commerce |
| `MessageList-*.css` | 14.766 | Lazy chat panel |
| Tổng CSS emit | 238.281 | Tất cả chunk |

First-load ước tính:

| Surface | Trước | Sau |
|---|---:|---:|
| Home / About / Contact / Legal | ~157 KB | **~98 KB** |
| Account (Customer/Settings) | ~174 KB | **~111 KB** |
| Workspace Admin/Seller/Shipper | ~87–103 KB | ~99–102 KB |

Mục tiêu `< 120 KB` cho CSS chính đã đạt trên cả 4 surface.

## 6. Giới hạn / backlog

- **16 render target chưa có page** (giữ nguyên backlog): `Admin/CustomerSegments/*`, `Admin/Inventory/Report`, `Admin/Orders/Show`, `Admin/Returns/Show`, `Product/{Index,Show}`, `Seller/Promotions/{Edit,Show}`, `Seller/Reports/*`, `Seller/Wallet/*`.
- **6 route `User\OrderController`** trỏ method không tồn tại (backend backlog, không có link trong UI).
- `Auth/VerifyEmail` không sweep được bằng guest (redirect); cần user chưa xác thực nếu muốn QA riêng.
- Reduced motion kiểm tra bằng rule toàn cục trong `base/a11y.css`; chưa emulate OS setting trong Dusk.
- Zoom 200% và contrast spot-check làm thủ công, chưa tự động.
- Ảnh sản phẩm seed có thể trống ở một số card do dữ liệu demo; không phải lỗi CSS.
- Chart dùng compact `N`/`Tr`/`NT` cho số rất lớn; có thể đổi sang hậu tố `nghìn`/`triệu`/`tỷ` nếu muốn rõ hơn.
- `avatar_url` vẫn là accessor; nếu thêm cột DB thật cần migration riêng (ngoài UI).

## 7. Gate cuối

```bash
npm run check:css
npm run types
npm run format:check
npm run lint
npm run build
npm run build:ssr
php artisan test
php artisan dusk --filter=Phase12QaTest
```

`check:css` strict (không còn allowlist), **290 file checked**; PHPUnit **473 test / 2.100 assertion**, 0 fail.
