# 🛒 ShopNest

## Mô tả dự án
ShopNest là nền tảng thương mại điện tử hiện đại, hỗ trợ đầy đủ các chức năng cho khách hàng, người bán và quản trị viên. Dự án hướng tới việc xây dựng một hệ sinh thái mua bán trực tuyến an toàn, tiện lợi, dễ mở rộng và dễ tích hợp với các dịch vụ bên ngoài (thanh toán, vận chuyển, AI/ML recommendation, v.v).

## Tính năng chính
- Đăng ký/đăng nhập, phân quyền (Admin, Seller, Customer)
- Quản lý sản phẩm, danh mục, thương hiệu
- Giỏ hàng, đặt hàng, thanh toán
- Quản lý đơn hàng, đổi trả, tranh chấp
- Đánh giá, phản hồi, chat trực tuyến
- Thông báo, khuyến mãi, mã giảm giá
- Tích hợp API giao hàng, thanh toán
- Quản lý bảo mật, token, lịch sử hoạt động

## Công nghệ sử dụng (Tech Stack)
- **Backend**: Laravel (PHP)
- **Database**: MySQL
- **Authentication**: Laravel Sanctum/JWT
- **API Docs**: Laravel Swagger/OpenAPI
- **Frontend**: ReactJS + TypeScript
- **Realtime**: Pusher hoặc Laravel Echo (dự kiến)
- **UI Framework**: (Tùy chọn, ví dụ: Ant Design, Material UI)

## Hướng dẫn cài đặt & chạy

1. **Yêu cầu trước**:
   - PHP >= 8.0
   - Composer
   - MySQL
   - Node.js & npm/yarn
   - (Tùy chọn) Docker & Docker Compose
2. **Clone repository**:
   ```bash
   git clone <repo-url>
   ```
3. **Cài đặt**:
   ```bash
   cd shop_nest
   composer install
   php artisan migrate --seed
   ```
4. **Cấu hình môi trường**:
   - Sao chép `.env.example` thành `.env`
   - Cập nhật thông tin database, mail, v.v trong `.env`
5. **Chạy dự án**:
   ```bash
   composer run dev
   ```

## Hướng dẫn sử dụng
- Đăng ký tài khoản, đăng nhập và sử dụng các API qua Swagger UI hoặc giao diện React
- (Sẽ bổ sung hướng dẫn chi tiết cho từng vai trò sau)

## Ảnh chụp màn hình / GIF / Video
- (Để trống, sẽ cập nhật sau)

## Trạng thái dự án
- Đang phát triển (Development)
- Đã hoàn thiện database, seed data, sẵn sàng phát triển API và frontend

## Tác giả & Liên hệ
- **Tác giả**: Team ShopNest bao gồm 3 thành viên
  - Huỳnh Ngọc Quí - Leader - Fullstack Developer
  - Vương Khánh Nhân - Fullstack Developer
  - Trần Diệu Vỹ - Fullstack Developer
- **GitHub**: [https://github.com/qh20812](https://github.com/qh20812)
- **Số điện thoại**: 0393769711
- **Email**: [qh20812@gmail.com](mailto:qh20812@gmail.com)