# Analytics Database Design Documentation

## Tổng quan
Hệ thống Analytics của Shop_Nest bao gồm 2 bảng chính để hỗ trợ tính năng phân tích dữ liệu:

1. **analytics_reports** - Lưu trữ các báo cáo phân tích đã tạo
2. **user_events** - Tracking hành vi người dùng

---

## 1. Bảng `analytics_reports`

### Mục đích
- Lưu trữ lịch sử các báo cáo phân tích đã tạo
- Hỗ trợ xuất file, gửi email báo cáo định kỳ
- Tracking hiệu suất và trạng thái các báo cáo

### Cấu trúc bảng
```sql
CREATE TABLE analytics_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    type ENUM('revenue', 'orders', 'products', 'users', 'custom'),
    period_type ENUM('daily', 'weekly', 'monthly', 'yearly', 'custom'),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    parameters JSON NULL,
    result_data JSON NULL,
    file_path VARCHAR(255) NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type_created (type, created_at),
    INDEX idx_status_created (status, created_at),
    INDEX idx_created_by (created_by)
);
```

### Các hằng số Model
- **Status**: `pending`, `completed`, `failed`
- **Type**: `revenue`, `orders`, `products`, `users`, `custom`
- **Period**: `daily`, `weekly`, `monthly`, `yearly`, `custom`

### Relationships
- `belongsTo(User::class, 'created_by')` - Admin tạo báo cáo

---

## 2. Bảng `user_events`

### Mục đích
- Tracking hành vi người dùng trên website
- Phân tích funnel conversion, user journey
- Hỗ trợ AI phân tích hành vi khách hàng

### Cấu trúc bảng
```sql
CREATE TABLE user_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL,
    session_id VARCHAR(255) NOT NULL,
    event_type ENUM('page_view', 'product_view', 'add_to_cart', 'remove_from_cart', 
                    'checkout_start', 'checkout_complete', 'purchase', 'login', 
                    'register', 'logout', 'search', 'filter', 'wishlist_add'),
    event_category VARCHAR(255) DEFAULT 'general',
    event_data JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    referrer VARCHAR(255) NULL,
    url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_event_created (event_type, created_at),
    INDEX idx_category_created (event_category, created_at),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
);
```

### Các loại sự kiện (Event Types)
- **Navigation**: `page_view`
- **Product**: `product_view`, `search`, `filter`
- **Cart**: `add_to_cart`, `remove_from_cart`
- **Checkout**: `checkout_start`, `checkout_complete`, `purchase`
- **User**: `login`, `register`, `logout`
- **Engagement**: `wishlist_add`

### Event Categories
- `user` - Sự kiện liên quan đến tài khoản
- `product` - Sự kiện liên quan đến sản phẩm
- `order` - Sự kiện liên quan đến đơn hàng
- `navigation` - Sự kiện điều hướng
- `general` - Sự kiện chung

### Static Method Tracking
```php
UserEvent::track(
    eventType: 'product_view',
    userId: 123,
    sessionId: 'abc123',
    eventData: ['product_id' => 456],
    category: 'product'
);
```

### Relationships
- `belongsTo(User::class)` - Người dùng thực hiện sự kiện

---

## 3. Chức năng Analytics có thể thực hiện

### Với bảng hiện có + 2 bảng mới:

#### A. Phân tích doanh thu & đơn hàng
- Doanh thu theo thời gian (ngày/tuần/tháng/năm)
- Số lượng đơn hàng, giá trị trung bình đơn hàng
- Tỷ lệ đơn hàng theo trạng thái
- Top sản phẩm/danh mục bán chạy

#### B. Phân tích người dùng
- Số lượng user mới theo thời gian
- Tỷ lệ conversion từ visitor → register → purchase
- User journey analysis
- Retention rate, churn rate

#### C. Phân tích sản phẩm
- Sản phẩm được xem nhiều nhất
- Tỷ lệ conversion từ view → cart → purchase
- Sản phẩm có tỷ lệ abandon cart cao
- Inventory analysis (sản phẩm sắp hết hàng)

#### D. Phân tích hiệu suất
- Page views, session duration
- Bounce rate theo trang
- Search keywords phổ biến
- Conversion funnel analysis

#### E. Báo cáo tự động
- Lưu trữ lịch sử báo cáo
- Xuất file PDF/Excel
- Gửi email báo cáo định kỳ
- So sánh performance theo kỳ

---

## 4. Tích hợp AI

### Các chức năng AI có thể thực hiện:
1. **Dự báo doanh thu** dựa trên lịch sử
2. **Phát hiện bất thường** trong dữ liệu bán hàng
3. **Đề xuất sản phẩm** cần nhập thêm/khuyến mãi
4. **Phân tích hành vi khách hàng** từ user events
5. **Tự động tạo insights** và recommendations
6. **Chatbot analytics** trả lời câu hỏi về số liệu

### Data Sources cho AI:
- Historical data từ orders, products, users
- Real-time events từ user_events
- Saved reports từ analytics_reports
- External data (seasonal trends, market data)

---

## 5. Implementation Plan

### Phase 1: Basic Analytics
- Implement AnalyticsController với các method cơ bản
- Dashboard hiển thị key metrics
- Basic reporting (revenue, orders, users)

### Phase 2: Advanced Analytics  
- User behavior tracking
- Conversion funnel analysis
- Automated report generation

### Phase 3: AI Integration
- Predictive analytics
- Anomaly detection
- AI-powered insights và recommendations

---

Hệ thống này cung cấp foundation mạnh mẽ cho việc phát triển tính năng Analytics và tích hợp AI trong tương lai.