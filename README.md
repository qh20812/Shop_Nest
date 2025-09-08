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
- **Backend**: ASP.NET Core 9.0 Web API
- **ORM**: Entity Framework Core 8.0
- **Database**: MySQL (Pomelo.EntityFrameworkCore.MySql)
- **Authentication**: JWT, BCrypt.Net
- **API Docs**: Swagger (Swashbuckle.AspNetCore)
- **Realtime**: SignalR (dự kiến)
- **Frontend**: (để trống, sẽ bổ sung sau)

## Hướng dẫn cài đặt & chạy
1. Clone repo về máy:
   ```sh
   git clone <repo-url>
   ```
2. Cài đặt .NET 9.0 SDK và MySQL
3. Cấu hình chuỗi kết nối trong `appsettings.json`
4. Chạy migration và seed database:
   ```sh
   dotnet ef database update
   dotnet run --seed-data
   ```
5. Chạy ứng dụng:
   ```sh
   dotnet run
   ```
6. Truy cập Swagger UI tại: `http://localhost:<port>/swagger`

## Hướng dẫn sử dụng
- Đăng ký tài khoản, đăng nhập và sử dụng các API qua Swagger UI
- (Sẽ bổ sung hướng dẫn chi tiết cho từng vai trò sau)

## Ảnh chụp màn hình / GIF / Video
- (Để trống, sẽ cập nhật sau)

## Trạng thái dự án
- Đang phát triển (Development)
- Đã hoàn thiện database, seed data, sẵn sàng phát triển API và frontend

## Tác giả & Liên hệ
- **Tác giả**: Huỳnh Ngọc Quí
- **GitHub**: [https://github.com/1h20812](https://github.com/1h20812)
- **Số điện thoại**: 0393769711
- **Email**: 1h20812@gmail.com
