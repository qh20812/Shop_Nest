# 🛒 ShopNest

ShopNest là nền tảng thương mại điện tử được xây dựng bằng **Laravel**, **Inertia.js** và **React**, hỗ trợ bốn vai trò: **Quản trị viên**, **Người bán**, **Khách hàng** và **Người giao hàng**.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | Laravel 13.42, PHP >= 8.3 |
| Frontend | Inertia.js 3, React 19, TypeScript 5.9, Vite 8 |
| UI | Tailwind CSS 4, Radix UI / shadcn-style components, lucide-react, Font Awesome |
| Database | MySQL 8 (SQLite in-memory khi chạy test) |
| Authentication | Session-based, Google OAuth qua Laravel Socialite |
| Realtime | Laravel Reverb + Laravel Echo |
| Thanh toán | Stripe và COD |
| Chatbot | Groq / OpenAI (tùy chọn) |
| Testing | PHPUnit 12, Laravel Dusk |
| Code quality | Laravel Pint, ESLint, Prettier, TypeScript |

## Tính năng chính

### Khách hàng
- Tìm kiếm, xem chi tiết sản phẩm, xem đánh giá.
- Giỏ hàng, mua ngay, áp dụng mã khuyến mãi.
- Thanh toán bằng Stripe hoặc COD.
- Quản lý đơn hàng: hủy, mua lại, tải hóa đơn PDF, xác nhận đã nhận hàng, theo dõi giao hàng.
- Gửi yêu cầu trả hàng, đánh giá sản phẩm.
- Wishlist, sổ địa chỉ, thông báo, hồ sơ cá nhân.
- Chat với người bán và chatbot hỗ trợ.

### Người bán
- Dashboard quản lý bán hàng.
- Quản lý sản phẩm và biến thể.
- Quản lý đơn hàng và trạng thái giao hàng.
- Quản lý khuyến mãi, ví và giao dịch.
- Cập nhật thông tin shop.

### Quản trị viên
- Dashboard và phân tích doanh thu, người dùng, sản phẩm, đơn hàng.
- Quản lý danh mục, thương hiệu, sản phẩm.
- Quản lý người dùng, đơn hàng, yêu cầu trả hàng.
- Quản lý khuyến mãi, tồn kho, shipper.
- Duyệt, từ chối, tạm ngưng và kích hoạt lại shop.

### Người giao hàng
- Dashboard shipper.
- Nền tảng đã có model/profile shipper; các nghiệp vụ giao hàng đang được mở rộng.

### Nền tảng
- Phân quyền theo vai trò (RBAC).
- Audit log, inventory log.
- Đa ngôn ngữ `vi` / `en`, đa tiền tệ (USD, VND, EUR, JPY).
- Thông báo realtime, chat realtime.
- Đăng nhập Google, xác thực email.
- Dọn inventory reservation tự động mỗi giờ.

## Cấu trúc thư mục

```text
app/
├── Http/Controllers/
│   ├── Admin/         # Quản trị
│   ├── Api/           # API nội bộ (notification)
│   ├── Auth/          # Đăng nhập, đăng ký, Google OAuth
│   ├── Seller/        # Người bán
│   ├── Shipper/       # Người giao hàng
│   ├── User/          # Khách hàng
│   └── Settings/      # Cài đặt tài khoản
├── Models/
├── Policies/
├── Payments/          # Stripe + COD gateways
├── Services/          # Cart, checkout, inventory, promotion, chatbot...
└── Traits/

routes/
├── web.php            # Route công khai và các route dùng chung
├── admin.php
├── seller.php
├── user.php
├── shipper.php
├── chat.php
├── settings.php
└── auth.php

resources/js/
├── pages/             # Inertia pages
├── components/        # UI và component theo tính năng
├── layouts/           # Layout theo vai trò
├── hooks/
├── lib/               # i18n, utils
├── Contexts/
└── types/

database/
├── migrations/
└── seeders/

tests/
├── Unit/
├── Feature/
└── Browser/           # Laravel Dusk
```

## Yêu cầu hệ thống

- **PHP >= 8.3** và Composer 2.
- **Node.js 22+** và npm (Vite 8 yêu cầu Node `^20.19.0` hoặc `>=22.12.0`).
- **MySQL 8.0**.
- (Tùy chọn) Docker Desktop để chạy bằng Docker.

## Cài đặt và chạy local

### 1. Clone repository

```bash
git clone https://github.com/qh20812/Shop_Nest.git
cd Shop_Nest
```

### 2. Cài dependencies

```bash
composer install
npm ci
```

### 3. Cấu hình môi trường

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Tạo application key:

```bash
php artisan key:generate
```

Cấu hình database và các dịch vụ cần thiết trong `.env`. Ví dụ:

```env
APP_URL=http://127.0.0.1:9999
APP_LOCALE=vi
APP_TIMEZONE=Asia/Ho_Chi_Minh

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shopnest
DB_USERNAME=root
DB_PASSWORD=
```

> `.env.example` chỉ chứa các biến mặc định. Các biến tích hợp như Stripe, Google, Reverb, Groq/OpenAI cần được thêm thủ công vào `.env`.

### 4. Tạo database và dữ liệu mẫu

```bash
php artisan migrate --seed
php artisan storage:link
```

### 5. Chạy ứng dụng

```bash
composer run dev
```

Lệnh này khởi động đồng thời:

- PHP dev server tại `http://127.0.0.1:9999`
- Queue listener
- Vite dev server

Mở trình duyệt tại **http://127.0.0.1:9999**.

Nếu dùng realtime (chat, thông báo), chạy Reverb ở terminal khác:

```bash
php artisan reverb:start
```

Reverb mặc định chạy ở port `8080`.

Để build assets cho production:

```bash
npm run build
```

## Biến môi trường quan trọng

| Biến | Mô tả |
|---|---|
| `APP_URL` | URL của ứng dụng, ví dụ `http://127.0.0.1:9999` |
| `APP_LOCALE` | Ngôn ngữ mặc định (`vi` hoặc `en`) |
| `APP_TIMEZONE` | Múi giờ, ví dụ `Asia/Ho_Chi_Minh` |
| `DB_*` | Thông tin kết nối MySQL |
| `STRIPE_KEY`, `STRIPE_SECRET` | Khóa Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret xác thực webhook Stripe |
| `STRIPE_CURRENCY` | Đơn vị tiền tệ Stripe, ví dụ `VND` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_SECRET_ID` | Google OAuth client secret |
| `GOOGLE_REDIRECT` | URL callback Google OAuth |
| `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET` | Cấu hình Reverb server |
| `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME` | Địa chỉ Reverb |
| `VITE_REVERB_*` | Cấu hình Reverb cho frontend (được bake lúc build Vite) |
| `GROQ_API_KEY`, `OPENAI_API_KEY` | API key chatbot (tùy chọn) |
| `EXCHANGE_RATE_*` | Cấu hình tỷ giá (tùy chọn) |

Không commit file `.env` hoặc các khóa bí mật lên repository.

## Tài khoản mẫu

Sau khi chạy `php artisan migrate --seed`:

| Vai trò | Username | Email | Mật khẩu |
|---|---|---|---|
| Admin | `superadmin` | `admin@shopnest.com` | `@12345Password` |
| Seller | `testseller` | `testseller@shopnest.com` | `@12345Password` |
| Shipper | `testshipper` | `testshipper@shopnest.com` | `@12345Password` |

Seeder cũng tạo thêm 20 seller và 100 customer cùng dữ liệu mẫu cho shop, sản phẩm, đơn hàng, khuyến mãi...

> Các tài khoản trên chỉ dùng cho môi trường phát triển. Hãy đổi mật khẩu và cấu hình bảo mật trước khi triển khai thật.

## Các lệnh thường dùng

| Lệnh | Mô tả |
|---|---|
| `composer run dev` | Chạy PHP server, queue và Vite |
| `npm run dev` | Chỉ chạy Vite |
| `npm run build` | Build assets production |
| `php artisan reverb:start` | Chạy Reverb WebSocket server |
| `php artisan test` | Chạy toàn bộ test |
| `php artisan test tests/Feature/Seller/ProductControllerTest.php --filter=test_name` | Chạy một test cụ thể |
| `php artisan dusk` | Chạy Laravel Dusk |
| `npm run types` | Kiểm tra TypeScript |
| `npm run lint` | Chạy ESLint và tự động sửa lỗi |
| `npm run format` | Format frontend bằng Prettier |
| `vendor/bin/pint` | Format PHP bằng Laravel Pint |

> `php artisan migrate:fresh --seed` sẽ xóa toàn bộ dữ liệu. Chỉ chạy khi chắc chắn đang dùng database phát triển.

## Testing

- Test PHPUnit sử dụng SQLite in-memory theo cấu hình trong `phpunit.xml`, không ảnh hưởng database trong `.env`.
- Laravel Dusk cần Chrome/ChromeDriver; chạy `php artisan dusk` sau khi cài đặt.
- Một số test chatbot có thể gọi API Groq/OpenAI thật; cần API key hợp lệ nếu chạy nhóm test đó.

## Chạy bằng Docker (tùy chọn)

Yêu cầu: Docker Desktop đang chạy.

### 1. Cấu hình `.env`

```bash
Copy-Item .env.example .env
php artisan key:generate
```

Trong `.env`, đặt các giá trị sau để container kết nối đúng:

```env
APP_URL=http://localhost:8080
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=Shop_Nest_DB
DB_USERNAME=root
DB_PASSWORD=newpassword
```

### 2. Build và chạy

```bash
docker compose up --build -d
```

### 3. Khởi tạo database

```bash
docker compose exec app php artisan migrate --seed
docker compose exec app php artisan storage:link
```

### 4. Truy cập

- Ứng dụng: **http://localhost:8080**
- MySQL: `localhost:3307`

Docker image được build theo 2 stage:

- **Builder (PHP 8.3 + Node 22)**: cài PHP dependencies, `npm ci` và build Vite assets (bao gồm Wayfinder).
- **Runtime (PHP 8.3 + Nginx + PHP-FPM)**: chạy ứng dụng.

Sau khi thay đổi code, rebuild image:

```bash
docker compose up --build -d
```

> Realtime trong Docker cần cấu hình `VITE_REVERB_*` trước khi build frontend để Vite bake đúng địa chỉ WebSocket.

## Trạng thái dự án

- Đang phát triển.
- Các module chính đã được triển khai: mua hàng, thanh toán, quản lý sản phẩm, đơn hàng, khuyến mãi, tồn kho, quản trị và chat.
- Shipper hiện có dashboard cơ bản; các nghiệp vụ giao hàng đang được mở rộng.
- Docker image dùng PHP 8.3 và Node 22.

## Giấy phép

Dự án sử dụng giấy phép **MIT**.

## Tác giả & Liên hệ

- **Team ShopNest** gồm 1 thành viên:
  - Huỳnh Ngọc Quí - Leader - Fullstack Developer
- **GitHub**: [https://github.com/qh20812](https://github.com/qh20812)
- **Số điện thoại**: 0393769711
- **Email**: [qh20812@gmail.com](mailto:qh20812@gmail.com)
