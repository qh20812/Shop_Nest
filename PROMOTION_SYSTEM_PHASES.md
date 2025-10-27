# Hệ Thống Khuyến Mãi Shop_Nest - Tổng Quan Các Phase

## Tổng quan

Hệ thống khuyến mãi Shop_Nest được phát triển theo từng phase với các tính năng ngày càng nâng cao, từ core system cơ bản đến enterprise-grade features.

---

## Phase 1: Core Promotion System 🎯

### Cơ sở dữ liệu
- **Bảng `promotions`**: Lưu trữ thông tin khuyến mãi cơ bản
  - ID, tên, mô tả, loại (percentage/fixed amount), giá trị giảm giá
  - Ngày bắt đầu/kết thúc, giới hạn sử dụng, số lần đã dùng
  - Trạng thái active/inactive

- **Bảng `promotion_codes`**: Mã khuyến mãi
  - Liên kết với promotion, mã code duy nhất
  - Giới hạn sử dụng riêng cho từng code

- **Bảng `order_promotion`**: Ánh xạ đơn hàng - khuyến mãi
  - Ghi nhận khuyến mãi đã áp dụng cho đơn hàng

### Models
- **`Promotion.php`**: Model chính với các quan hệ cơ bản
- **`PromotionCode.php`**: Model cho mã khuyến mãi

### Services
- **`PromotionService.php`**: Service chính xử lý logic kinh doanh
  - Tạo/chỉnh sửa/xóa promotion
  - Validate business rules
  - Áp dụng promotion cho đơn hàng
  - Tính toán giảm giá

### Controllers
- **`PromotionController.php`**: CRUD operations cơ bản
  - Index, create, store, show, edit, update, destroy
  - Basic validation và error handling

### Features đã triển khai
- ✅ Tạo promotion với các loại: percentage, fixed amount
- ✅ Áp dụng promotion cho đơn hàng
- ✅ Validate điều kiện sử dụng
- ✅ Tracking số lần sử dụng
- ✅ Soft delete cho promotions

---

## Phase 2: Advanced Features 🚀

### Enhanced Database Schema
- **Nâng cấp bảng `promotions`** với các trường nâng cao:
  - `priority`: Ưu tiên (low/medium/high/urgent)
  - `stackable`: Có thể kết hợp với promotion khác
  - `customer_eligibility`: Điều kiện khách hàng (JSON)
  - `geographic_restrictions`: Giới hạn địa lý (JSON)
  - `product_restrictions`: Giới hạn sản phẩm (JSON)
  - `budget_limit` & `budget_used`: Ngân sách
  - `daily_usage_limit`: Giới hạn sử dụng hàng ngày
  - `per_customer_limit`: Giới hạn mỗi khách
  - `first_time_customer_only`: Chỉ khách hàng mới
  - `time_restrictions`: Giới hạn thời gian (JSON)
  - `auto_apply_condition`: Điều kiện áp dụng tự động

### Usage Tracking & Analytics 📊
- **`PromotionAnalyticsService.php`**: Service phân tích
  - Track performance metrics hàng ngày
  - Tính toán revenue impact
  - Usage statistics chi tiết
  - Click-through rate, conversion rate

- **Performance Metrics Tracking**:
  - Impressions, clicks, conversions
  - Revenue và cost tracking
  - Daily metrics aggregation

### Bulk Operations ⚡
- **`PromotionBulkService.php`**: Xử lý hàng loạt
  - Bulk activate/deactivate promotions
  - Bulk delete với validation
  - Bulk update status
  - Error handling cho từng item

### Promotion Templates 📝
- **`PromotionTemplateService.php`**: Quản lý template
  - Tạo promotion từ template có sẵn
  - Template categories và public/private
  - Template versioning

- **Database**: Bảng `promotion_templates` lưu trữ templates

### Conflict Resolution ⚖️
- **`PromotionConflictResolver.php`**: Giải quyết xung đột
  - Detect overlapping promotions
  - Priority-based resolution
  - Stackable promotion logic
  - Business rule validation

### Enhanced Controllers
- **PromotionController** với các endpoint mới:
  - `getUsageStats()`: Thống kê sử dụng
  - `getRevenueImpact()`: Tác động doanh thu
  - `getPerformanceMetrics()`: Metrics hiệu suất
  - `bulkActivate()` / `bulkDeactivate()`: Operations hàng loạt
  - `getTemplates()`: Lấy danh sách templates
  - `createFromTemplate()`: Tạo từ template

### Features đã triển khai
- ✅ **Priority System**: Xử lý ưu tiên promotion
- ✅ **Stackable Promotions**: Kết hợp nhiều promotion
- ✅ **Customer Segmentation**: Điều kiện khách hàng
- ✅ **Geographic Targeting**: Giới hạn theo địa lý
- ✅ **Product Restrictions**: Giới hạn theo sản phẩm
- ✅ **Budget Management**: Quản lý ngân sách
- ✅ **Time Restrictions**: Giới hạn thời gian
- ✅ **Auto-apply Conditions**: Áp dụng tự động
- ✅ **Usage Analytics**: Phân tích chi tiết
- ✅ **Bulk Operations**: Xử lý hàng loạt
- ✅ **Template System**: Hệ thống template

---

## Phase 3: Enterprise Features 🏢

### Database Schema Mới
- **Bảng `promotion_audit_logs`**: Nhật ký audit
  - Ghi lại tất cả thay đổi promotion
  - Action types: created, updated, deleted, activated, deactivated
  - User tracking và timestamp

- **Bảng `promotion_performance_metrics`**: Metrics hiệu suất
  - Theo dõi hàng ngày: impressions, clicks, conversions
  - Tính toán CTR, conversion rate
  - Revenue và cost tracking

- **Bảng `customer_segments`**: Phân khúc khách hàng
  - Rule-based segmentation
  - Dynamic customer evaluation
  - Size categorization

- **Bảng `customer_segment_membership`**: Quan hệ khách-segment
  - Membership tracking
  - Join/leave timestamps
  - Membership duration

### Models Mới
- **`PromotionAuditLog.php`**: Model audit log
  - Relationships với Promotion và User
  - Action-based scopes và helpers

- **`PromotionPerformanceMetric.php`**: Model metrics
  - Daily tracking với accessors tính toán
  - Increment methods cho performance data

- **`PromotionTemplate.php`**: Model template
  - Creator relationships
  - Category và public scopes

- **`CustomerSegment.php`**: Model segment
  - Membership management
  - Size categorization

- **`CustomerSegmentMembership.php`**: Model membership
  - Duration tracking
  - Membership helpers

### Services Nâng cao
- **`CustomerSegmentationService.php`**: Engine phân khúc
  - Rule-based evaluation
  - Database-level filtering
  - Caching optimization

- **AuditLoggable Trait**: Code reusability
  - Centralized audit logging
  - Validation và error handling

### Background Processing
- **`CustomerSegmentRefreshJob.php`**: Job refresh segment
  - Queue-based processing
  - Progress tracking
  - Error handling với retry

### Controllers Mới
- **`CustomerSegmentController.php`**: REST API
  - Full CRUD operations
  - Background job dispatching
  - Comprehensive validation

### Form Requests
- **`CreateCustomerSegmentRequest.php`**
- **`UpdateCustomerSegmentRequest.php`**
  - Input validation
  - Business rule validation

### Features đã triển khai
- ✅ **Audit Logging**: Nhật ký chi tiết tất cả thay đổi
- ✅ **Performance Tracking**: Theo dõi hiệu suất real-time
- ✅ **Customer Segmentation**: Phân khúc khách hàng động
- ✅ **Background Processing**: Xử lý bất đồng bộ
- ✅ **Comprehensive Validation**: Validation toàn diện
- ✅ **Caching Optimization**: Tối ưu hiệu suất
- ✅ **Error Handling**: Xử lý lỗi robust
- ✅ **Database Optimization**: Query tối ưu

---

## Tóm tắt Tiến độ

| Phase | Trạng thái | Mô tả |
|-------|------------|--------|
| **Phase 1** | ✅ Hoàn thành | Core promotion system với CRUD cơ bản |
| **Phase 2** | ✅ Hoàn thành | Advanced features: analytics, bulk ops, templates |
| **Phase 3** | ✅ Hoàn thành | Enterprise features: audit, performance, segmentation |
| **Phase 4A** | ✅ Hoàn thành | Bulk Selection System - giải quyết vấn đề chọn sản phẩm thủ công |
| **Phase 4B-A** | ✅ Hoàn thành | Database & Models cho Seller Promotion System |
| **Phase 4B-B** | ✅ Hoàn thành | Seller Promotion Services & Controllers |

### Thống kê Codebase
- **Models**: 5 models mới (Phase 3) + 2 models gốc + 3 models seller promotion (Phase 4B-A)
- **Services**: 6 services chính + 1 trait + 2 services seller promotion (Phase 4B-B)
- **Controllers**: 1 controller mới + enhanced controller + 2 controllers seller promotion
- **Jobs**: 1 background job
- **Form Requests**: 2 validation requests + 4 form requests seller promotion
- **Migrations**: 5 migrations mới cho Phase 3 + 4 migrations cho Phase 4B-A
- **Database Tables**: 5 bảng mới + enhanced tables + 4 bảng seller promotion
- **Policies**: 1 policy cho seller promotion authorization

### Kiến trúc Hệ thống
- **Laravel Eloquent ORM**: Data access layer
- **Laravel Queues**: Background processing
- **Laravel Caching**: Performance optimization
- **Laravel Form Requests**: Input validation
- **Laravel Policies**: Authorization system
- **Laravel Traits**: Code reusability
- **Database Migrations**: Schema management
- **Database Transactions**: Financial operation safety
- **Inertia.js**: React frontend integration

---

## Phase 4A: Bulk Selection System 📦

### Context & Problem
Admin phải chọn sản phẩm thủ công cho mỗi promotion, gây tốn thời gian và dễ sai sót. Cần hệ thống bulk selection để tối ưu hóa quy trình.

### Database Schema
- **Nâng cấp bảng `promotions`**:
  - `selection_mode`: Chế độ chọn sản phẩm (manual/auto/bulk)
  - `bulk_criteria`: Tiêu chí bulk selection (JSON)
  - `excluded_products`: Sản phẩm loại trừ (JSON)
  - `auto_update`: Tự động cập nhật danh sách sản phẩm

### Core Features
- **Bulk Selection Criteria**:
  - Category-based selection
  - Brand-based selection
  - Price range selection
  - Stock status filtering
  - Custom rule combinations

- **Auto-update Mechanism**:
  - Real-time product list updates
  - Scheduled refreshes
  - Manual trigger options

### Services & Logic
- **`BulkSelectionService.php`**: Xử lý logic bulk selection
  - Build dynamic queries từ criteria
  - Validate selection rules
  - Performance optimization với caching

- **`PromotionProductManager.php`**: Quản lý quan hệ promotion-product
  - Add/remove products hàng loạt
  - Track selection history
  - Conflict resolution

### API Enhancements
- **PromotionController** endpoints mới:
  - `bulkSelectProducts()`: Áp dụng bulk criteria
  - `getBulkPreview()`: Preview sản phẩm sẽ được chọn
  - `updateBulkCriteria()`: Cập nhật tiêu chí
  - `refreshProductList()`: Refresh danh sách sản phẩm

### Features đã triển khai
- ✅ **Dynamic Bulk Selection**: Chọn sản phẩm theo criteria phức tạp
- ✅ **Real-time Preview**: Xem trước danh sách sản phẩm
- ✅ **Auto-update**: Tự động cập nhật khi có sản phẩm mới
- ✅ **Performance Optimization**: Query tối ưu và caching
- ✅ **Conflict Resolution**: Xử lý xung đột selection rules

---

## Phase 4B: Seller Empowerment Implementation 🛒

### Context & Objectives
Phase 4B tập trung vào việc trao quyền cho sellers quản lý promotion riêng, biến họ từ passive recipients thành active participants trong hệ sinh thái promotion.

### Phase 4B-A: Database & Models 🗄️

#### Database Schema Mới
- **Bảng `seller_promotion_wallets`**: Quản lý ví promotion của seller
  - `wallet_id`, `seller_id`, `balance`, `total_earned`, `total_spent`
  - `currency`, `status`, timestamps
  - Foreign key constraints và unique constraints

- **Bảng `seller_wallet_transactions`**: Lịch sử giao dịch ví
  - `transaction_id`, `wallet_id`, `amount`, `type` (credit/debit)
  - `description`, `reference_type`, `reference_id`
  - `balance_before`, `balance_after`, timestamps

- **Nâng cấp bảng `promotions`**:
  - `created_by_type`: Loại người tạo (admin/seller)
  - `seller_id`: ID seller sở hữu promotion
  - `budget_source`: Nguồn ngân sách (platform/seller_wallet)
  - `allocated_budget`, `spent_budget`: Ngân sách phân bổ/đã chi
  - `roi_percentage`: Tỷ lệ ROI

- **Bảng `seller_promotion_participation`**: Tham gia promotion platform
  - `participation_id`, `seller_id`, `platform_promotion_id`
  - `status`, `seller_contribution`, timestamps

#### Models Mới
- **`SellerPromotionWallet.php`**: Model ví promotion
  - Relationships: seller, transactions
  - Balance calculation methods
  - Status management

- **`SellerWalletTransaction.php`**: Model giao dịch ví
  - Polymorphic relationships với reference models
  - Balance tracking methods
  - Transaction type scopes

- **Enhanced `Promotion.php`**:
  - Seller ownership relationships
  - Budget tracking methods
  - ROI calculation accessors

- **`SellerPromotionParticipation.php`**: Model tham gia promotion
  - Status management
  - Contribution tracking

#### Features đã triển khai
- ✅ **Seller Wallet System**: Cơ sở dữ liệu cho ví promotion
- ✅ **Transaction Tracking**: Lịch sử giao dịch chi tiết
- ✅ **Seller Ownership**: Mở rộng promotion model cho seller
- ✅ **Participation Tracking**: Theo dõi tham gia platform promotions
- ✅ **Budget Management**: Tracking ngân sách và ROI

### Phase 4B-B: Seller Promotion Services & Controllers ⚙️

#### Core Services

##### SellerPromotionService.php
```php
class SellerPromotionService
{
    public function createPromotion(array $data, int $sellerId): Promotion
    public function updatePromotion(Promotion $promotion, array $data, int $sellerId): Promotion
    public function deletePromotion(Promotion $promotion, int $sellerId): bool
    public function validateSellerOwnership(array $productIds, int $sellerId): bool
    public function calculatePromotionROI(Promotion $promotion): float
    public function getSellerPromotions(int $sellerId, array $filters = []): Collection
    public function pausePromotion(Promotion $promotion, int $sellerId): bool
    public function resumePromotion(Promotion $promotion, int $sellerId): bool
}
```

##### SellerWalletService.php
```php
class SellerWalletService
{
    public function getWallet(int $sellerId): SellerPromotionWallet
    public function createWallet(int $sellerId): SellerPromotionWallet
    public function topUpWallet(int $sellerId, float $amount, string $paymentMethod): SellerWalletTransaction
    public function deductFromWallet(int $walletId, float $amount, string $description, string $referenceType = null, int $referenceId = null): SellerWalletTransaction
    public function getTransactionHistory(int $walletId, array $filters = []): Collection
    public function checkSufficientBalance(int $walletId, float $amount): bool
    public function getWalletBalance(int $sellerId): float
    public function transferFunds(int $fromWalletId, int $toWalletId, float $amount, string $description): array
}
```

#### Controllers

##### Seller/PromotionController.php
- **API Endpoints**:
  - `GET /seller/promotions` - List seller's promotions với filtering
  - `GET /seller/promotions/create` - Show create promotion form
  - `POST /seller/promotions` - Create new seller promotion
  - `GET /seller/promotions/{promotion}` - Show promotion details
  - `GET /seller/promotions/{promotion}/edit` - Show edit promotion form
  - `PUT /seller/promotions/{promotion}` - Update seller promotion
  - `DELETE /seller/promotions/{promotion}` - Delete seller promotion
  - `POST /seller/promotions/{promotion}/pause` - Pause promotion
  - `POST /seller/promotions/{promotion}/resume` - Resume promotion

##### Seller/WalletController.php
- **API Endpoints**:
  - `GET /seller/wallet` - Show wallet dashboard
  - `GET /seller/wallet/transactions` - List wallet transactions
  - `POST /seller/wallet/top-up` - Initiate wallet top-up
  - `GET /seller/wallet/top-up/{transaction}/status` - Check top-up status
  - `POST /seller/wallet/transfer` - Transfer funds between promotions

#### Form Request Validation
- **`StoreSellerPromotionRequest.php`**: Validation tạo promotion
- **`UpdateSellerPromotionRequest.php`**: Validation cập nhật promotion
- **`TopUpWalletRequest.php`**: Validation nạp tiền ví
- **`TransferFundsRequest.php`**: Validation chuyển tiền

#### Authorization & Policies
- **`PromotionPolicy.php`**: Policy cho promotion resources
  - `view()`: Kiểm tra quyền xem promotion
  - `update()`: Kiểm tra quyền cập nhật (seller sở hữu)
  - `delete()`: Kiểm tra quyền xóa (seller sở hữu)

#### Routes Configuration
- **routes/seller.php**: Route definitions cho seller promotion endpoints
  - Middleware groups: auth, seller role
  - Resource routes với parameter customization
  - Additional routes cho pause/resume, wallet operations

#### Features đã triển khai
- ✅ **Seller Promotion CRUD**: Đầy đủ operations cho seller promotions
- ✅ **Wallet Management**: Top-up, transfer, balance tracking
- ✅ **Business Logic Validation**: Product ownership, budget validation
- ✅ **Transaction Safety**: Database transactions cho financial operations
- ✅ **Authorization**: Policy-based access control
- ✅ **Inertia.js Integration**: React frontend compatibility

### Phase 4B-C: Frontend Implementation (Upcoming) 🎨

#### React Components (Inertia.js)
- **Seller/Promotions/Index.tsx**: Promotion dashboard với listing và filters
- **Seller/Promotions/Create.tsx**: Form tạo promotion mới
- **Seller/Promotions/Edit.tsx**: Form chỉnh sửa promotion
- **Seller/Promotions/Show.tsx**: Chi tiết promotion và analytics

#### Wallet Components
- **Seller/Wallet/Dashboard.tsx**: Wallet overview với balance display
- **Seller/Wallet/TopUp.tsx**: Modal nạp tiền ví
- **Seller/Wallet/Transactions.tsx**: Lịch sử giao dịch với pagination

#### Notification Components
- **Seller/Notifications/Index.tsx**: Notification center
- **Seller/Notifications/Preferences.tsx**: Cài đặt thông báo

#### UI/UX Requirements
- **Seller Promotion Dashboard**: Interface trực quan, quick actions
- **Wallet Management**: Balance display rõ ràng, transaction history
- **Performance Analytics**: Visual charts cho ROI, sales lift
- **Real-time Updates**: WebSocket notifications cho wallet changes

---

## Kết luận

Hệ thống khuyến mãi Shop_Nest đã được phát triển đầy đủ từ Phase 1 đến Phase 4B-B với:

- **Phase 1**: Nền tảng vững chắc với core functionality
- **Phase 2**: Tính năng nâng cao cho user experience tốt hơn
- **Phase 3**: Enterprise-grade features cho scalability và maintainability
- **Phase 4A**: Bulk Selection System giải quyết vấn đề admin workflow
- **Phase 4B-A**: Database foundation cho seller empowerment
- **Phase 4B-B**: Complete backend services và APIs cho seller promotion management

### Next Steps
- **Phase 4B-C**: Frontend Implementation - React/Inertia components
- **Phase 4C**: Payment Gateway Integration cho wallet top-ups
- **Phase 4D**: Advanced Analytics & Reporting cho sellers

Hệ thống hiện tại đã sẵn sàng cho seller promotion management với backend APIs hoàn chỉnh, chờ frontend implementation để hoàn thiện user experience. 🎉

*Ngày cập nhật: October 19, 2025*</content>
<parameter name="filePath">c:\Users\qh208\OneDrive\Desktop\Workspace\Shop_Nest\PROMOTION_SYSTEM_PHASES.md






# Phase 4B-C: Seller Promotion Frontend Implementation

## Context
Backend APIs for seller promotion management have been completed. Now we need to implement frontend React/Inertia components to create a complete interface for seller promotion dashboard, wallet management, and CRUD operations.

## Problem Statement
Sellers currently lack an interface to:
- Create and manage promotions for their products
- Track wallet balance and transaction history
- View performance analytics of promotions
- Receive notifications about platform promotions

## Phase 4B-C Objectives
Implement comprehensive React/Inertia frontend for seller promotion system with:
1. **Seller Promotion Dashboard** - CRUD operations with filtering and search
2. **Wallet Management Interface** - Balance display, top-up, transaction history
3. **Promotion Analytics** - ROI tracking and performance metrics
4. **Notification Center** - Real-time alerts and campaign invitations
5. **Responsive Design** - Mobile-friendly with Page.css styling

## Technical Requirements

### Styling Guidelines
**IMPORTANT NOTE: DO NOT USE TAILWINDCSS OR INLINE STYLES**

#### CSS Usage Rules:
- **Only use Page.css** - All styling must come from `resources/css/Page.css`
- **No TailwindCSS** - Do not import or use Tailwind classes
- **No inline styles** - Do not use `style={{}}` attribute
- **Base on existing CSS** - Use and extend existing classes from Page.css

#### CSS Classes Available:
```css
/* Layout & Structure */
.content main .header
.content main .insights
.content main .bottom-data
.content main .bottom-data>div

/* Form Elements */
.form-group
.form-label
.form-input-field
.form-input-field:focus
.form-input-field.error
.btn, .btn-primary, .btn-secondary, .btn-danger

/* Status & Badges */
.status.pending, .status.process, .status.completed

/* Tables */
.content main .bottom-data .orders table
.content main .bottom-data .orders table th
.content main .bottom-data .orders table td

/* Cards & Panels */
.content main .insights li
.content main .insights li .bx
.content main .insights li .info h3
.content main .insights li .info p

/* Navigation */
.content main .header .left .breadcrumb
.content main .header .left .breadcrumb li a.active

/* Responsive */
@media screen and (max-width: 768px)
@media screen and (max-width: 576px)
```

#### CSS Variables Available:
```css
:root {
    --light: #f6f6f9;
    --primary: #1976D2;
    --light-primary: #CFE8FF;
    --grey: #eee;
    --dark-grey: #AAAAAA;
    --dark: #363949;
    --danger: #D32F2F;
    --light-danger: #FECDD3;
    --warning: #FBC02D;
    --light-warning: #FFF2C6;
    --success: #388E3C;
    --light-success: #BBF7D0;
}
```

### Component Structure Analysis
**Read and reuse existing components:**

#### Admin Components Reference:
- **FilterPanel**: `resources/js/Pages/Admin/Products/Index.tsx`
  - Search input, filter dropdowns, breadcrumbs
  - Apply filters functionality
  - Header with title and breadcrumbs

- **DataTable**: `resources/js/components/ui/DataTable.tsx`
  - Column definitions with header/cell renderers
  - Empty state handling
  - Responsive table layout

- **StatusBadge**: `resources/js/components/ui/StatusBadge.tsx`
  - Status mapping and CSS class generation
  - Support for order, payment, general types

- **ActionButtons**: `resources/js/components/ui/ActionButtons.tsx`
  - Button/link actions with icons
  - Primary, danger, secondary variants

#### Seller Components Structure:
- **Layout**: Use `AppLayout` like admin pages
- **Navigation**: Seller sidebar with promotion/wallet menu items
- **Responsive**: Mobile-first approach with breakpoints from Page.css

### Component Implementation Details

#### 1. Seller Promotion Components

##### Seller/Promotions/Index.tsx
```tsx
// Main dashboard for seller promotions
// Features:
// - List promotions with filtering (status, date range, budget)
// - Search by promotion name
// - Quick actions: Create, Edit, Pause/Resume, Delete
// - Status badges and budget display
// - Pagination with DataTable component
```

**UI Structure:**
```tsx
<AppLayout>
    <FilterPanel
        title="My Promotions"
        breadcrumbs={[...]}
        searchConfig={{...}}
        filterConfigs={[
            { status: "active|paused|completed" },
            { dateRange: "last_30_days|last_7_days|custom" },
            { budgetRange: "0-1000000|1000000-5000000|5000000+" }
        ]}
    />
    <DataTable
        columns={[productInfo, budget, status, roi, actions]}
        data={promotions}
        headerTitle={`Promotions (${total})`}
    />
    <Pagination links={links} />
</AppLayout>
```

##### Seller/Promotions/Create.tsx
```tsx
// Form to create new promotion
// Features:
// - Product selection (only seller's products)
// - Budget setting with wallet balance validation
// - Promotion type selection (percentage/fixed)
// - Date range picker
// - Preview promotion before creation
```

**Form Fields:**
- Product selection (dropdown/multi-select)
- Promotion type (percentage/fixed amount)
- Discount value (percentage 1-90% / fixed amount)
- Budget allocation (from wallet)
- Start/End dates
- Target audience (optional)

##### Seller/Promotions/Edit.tsx
```tsx
// Form to edit existing promotion
// Features:
// - Load existing promotion data
// - Budget increase validation
// - Product changes (if not active)
// - Status management
```

##### Seller/Promotions/Show.tsx
```tsx
// Promotion details with analytics
// Features:
// - Promotion info display
// - Performance metrics (impressions, clicks, conversions)
// - ROI calculation and charts
// - Transaction history for this promotion
// - Edit/Delete actions
```

#### 2. Wallet Management Components

##### Seller/Wallet/Dashboard.tsx
```tsx
// Wallet overview dashboard
// Features:
// - Current balance display (large, prominent)
// - Recent transactions (5 latest)
// - Quick top-up button
// - Budget allocation summary
// - Low balance alerts
```

**UI Structure:**
```tsx
<div className="content">
    <main>
        {/* Header with balance */}
        <div className="header">
            <div className="left">
                <h1>Wallet Balance</h1>
                <div className="balance-display">
                    {/* Large balance number */}
                </div>
            </div>
            <div className="report">
                <button className="btn btn-primary">Top Up</button>
            </div>
        </div>

        {/* Insights cards */}
        <div className="insights">
            <div className="card">Total Earned</div>
            <div className="card">Total Spent</div>
            <div className="card">Active Budgets</div>
        </div>

        {/* Recent transactions */}
        <div className="bottom-data">
            <div className="transactions">
                <div className="header">
                    <h3>Recent Transactions</h3>
                    <a href="/seller/wallet/transactions" className="btn btn-secondary">View All</a>
                </div>
                <table>...</table>
            </div>
        </div>
    </main>
</div>
```

##### Seller/Wallet/TopUp.tsx
```tsx
// Modal/form for top-up wallet
// Features:
// - Amount input with validation
// - Payment method selection
// - Preview transaction
// - Redirect to payment gateway
```

##### Seller/Wallet/Transactions.tsx
```tsx
// Transaction history page
// Features:
// - Filter by type (credit/debit), date range
// - Search by description
// - Export functionality
// - Pagination
```

#### 3. Notification Components

##### Seller/Notifications/Index.tsx
```tsx
// Notification center
// Features:
// - List notifications (unread/read)
// - Mark as read individually/bulk
// - Filter by type (promotion, wallet, system)
// - Real-time updates (WebSocket)
// - Archive old notifications
```

#### 4. Analytics Components

##### Seller/Analytics/Overview.tsx
```tsx
// Analytics dashboard
// Features:
// - Overall performance metrics
// - ROI trends chart
// - Top performing promotions
// - Revenue attribution
// - Comparative analytics
```

### CSS Extensions (Add to Page.css)

#### New CSS Classes (based on existing patterns):
```css
/* Wallet specific styles */
.wallet-balance {
    font-size: 48px;
    font-weight: 700;
    color: var(--primary);
    text-align: center;
    margin: 20px 0;
}

.wallet-balance-currency {
    font-size: 24px;
    color: var(--dark-grey);
    margin-left: 8px;
}

.balance-card {
    background: var(--light);
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.balance-card .amount {
    font-size: 36px;
    font-weight: 700;
    color: var(--success);
    margin-bottom: 8px;
}

.balance-card .label {
    color: var(--dark-grey);
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Promotion specific styles */
.promotion-card {
    background: var(--light);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 16px;
    border-left: 4px solid var(--primary);
    transition: transform 0.3s ease;
}

.promotion-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.promotion-status {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.promotion-status.active {
    background: var(--light-success);
    color: var(--success);
}

.promotion-status.paused {
    background: var(--light-warning);
    color: var(--warning);
}

.promotion-status.completed {
    background: var(--light-grey);
    color: var(--dark-grey);
}

/* Analytics chart containers */
.analytics-chart {
    background: var(--light);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
}

.analytics-metric {
    text-align: center;
    padding: 20px;
}

.analytics-metric .value {
    font-size: 32px;
    font-weight: 700;
    color: var(--primary);
    display: block;
}

.analytics-metric .label {
    font-size: 14px;
    color: var(--dark-grey);
    margin-top: 8px;
}

/* Notification styles */
.notification-item {
    background: var(--light);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    border-left: 4px solid var(--primary);
    transition: all 0.3s ease;
}

.notification-item.unread {
    background: var(--light-primary);
    border-left-color: var(--primary);
}

.notification-item .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.notification-item .notification-title {
    font-weight: 600;
    color: var(--dark);
}

.notification-item .notification-time {
    font-size: 12px;
    color: var(--dark-grey);
}

.notification-item .notification-content {
    color: var(--dark);
    line-height: 1.5;
}

/* Form enhancements */
.promotion-form {
    max-width: 800px;
    margin: 0 auto;
}

.form-section {
    background: var(--light);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
}

.form-section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--grey);
}

.product-selection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    max-height: 300px;
    overflow-y: auto;
    padding: 16px;
    border: 1px solid var(--grey);
    border-radius: 8px;
}

.product-select-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--grey);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.product-select-item:hover {
    border-color: var(--primary);
    background: var(--light-primary);
}

.product-select-item.selected {
    border-color: var(--primary);
    background: var(--light-primary);
}

.product-select-item .product-image {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    margin-right: 12px;
    object-fit: cover;
}

.product-select-item .product-info {
    flex: 1;
}

.product-select-item .product-name {
    font-weight: 500;
    color: var(--dark);
    font-size: 14px;
    margin-bottom: 2px;
}

.product-select-item .product-price {
    font-size: 12px;
    color: var(--dark-grey);
}
```

### Implementation Steps

#### Step 1: Create Core Components

##### 1.1 Seller Promotion Dashboard
```bash
# Create component files
touch resources/js/Pages/Seller/Promotions/Index.tsx
touch resources/js/Pages/Seller/Promotions/Create.tsx
touch resources/js/Pages/Seller/Promotions/Edit.tsx
touch resources/js/Pages/Seller/Promotions/Show.tsx
```

**Index.tsx Structure:**
```tsx
import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import FilterPanel from '@/components/ui/FilterPanel';
import DataTable from '@/components/ui/DataTable';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionButtons, { ActionConfig } from '@/components/ui/ActionButtons';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Toast from '@/components/ui/Toast';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Promotion {
    promotion_id: number;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    budget: number;
    spent_budget: number;
    status: 'active' | 'paused' | 'completed';
    start_date: string;
    end_date: string;
    products_count: number;
    roi_percentage: number;
}

export default function Index() {
    const { t } = useTranslation();
    const { promotions = { data: [], links: [] }, filters = {}, totalPromotions = 0, flash = {} } = usePage().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateRange, setDateRange] = useState(filters.date_range || '');

    // Modal states
    const [confirmModal, setConfirmModal] = useState({/* ... */});
    const [toast, setToast] = useState(null);

    // Filter application
    const applyFilters = () => {
        router.get('/seller/promotions', {
            search,
            status,
            date_range: dateRange
        }, { preserveState: true });
    };

    // Action handlers
    const handlePause = (promotion) => {/* ... */};
    const handleResume = (promotion) => {/* ... */};
    const handleDelete = (promotion) => {/* ... */};

    // Table columns
    const columns = [
        {
            id: 'name',
            header: t('Promotion Name'),
            cell: (promotion) => (
                <div>
                    <div style={{ fontWeight: '600', color: 'var(--dark)' }}>
                        {promotion.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--dark-grey)' }}>
                        {promotion.type === 'percentage' ? `${promotion.value}% off` : `${promotion.value.toLocaleString()} VND off`}
                    </div>
                </div>
            )
        },
        {
            id: 'budget',
            header: t('Budget'),
            cell: (promotion) => (
                <div>
                    <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                        {promotion.spent_budget.toLocaleString()} / {promotion.budget.toLocaleString()} VND
                    </div>
                    <div style={{
                        width: '100px',
                        height: '6px',
                        background: 'var(--grey)',
                        borderRadius: '3px',
                        marginTop: '4px'
                    }}>
                        <div style={{
                            width: `${(promotion.spent_budget / promotion.budget) * 100}%`,
                            height: '100%',
                            background: 'var(--primary)',
                            borderRadius: '3px'
                        }}></div>
                    </div>
                </div>
            )
        },
        {
            id: 'status',
            header: t('Status'),
            cell: (promotion) => <StatusBadge status={promotion.status} />
        },
        {
            id: 'roi',
            header: t('ROI'),
            cell: (promotion) => (
                <div style={{
                    fontWeight: '600',
                    color: promotion.roi_percentage >= 100 ? 'var(--success)' : 'var(--warning)'
                }}>
                    {promotion.roi_percentage?.toFixed(1) || 0}%
                </div>
            )
        },
        {
            id: 'actions',
            header: t('Actions'),
            cell: (promotion) => {
                const actions = [];

                if (promotion.status === 'active') {
                    actions.push({
                        type: 'button',
                        onClick: () => handlePause(promotion),
                        variant: 'secondary',
                        icon: 'bx bx-pause',
                        label: t('Pause')
                    });
                } else if (promotion.status === 'paused') {
                    actions.push({
                        type: 'button',
                        onClick: () => handleResume(promotion),
                        variant: 'primary',
                        icon: 'bx bx-play',
                        label: t('Resume')
                    });
                }

                actions.push(
                    {
                        type: 'link',
                        href: `/seller/promotions/${promotion.promotion_id}`,
                        variant: 'primary',
                        icon: 'bx bx-show',
                        label: t('View')
                    },
                    {
                        type: 'link',
                        href: `/seller/promotions/${promotion.promotion_id}/edit`,
                        variant: 'secondary',
                        icon: 'bx bx-edit',
                        label: t('Edit')
                    },
                    {
                        type: 'button',
                        onClick: () => handleDelete(promotion),
                        variant: 'danger',
                        icon: 'bx bx-trash',
                        label: t('Delete')
                    }
                );

                return <ActionButtons actions={actions} />;
            }
        }
    ];

    return (
        <AppLayout>
            <Head title={t("My Promotions")} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <FilterPanel
                title={t("My Promotions")}
                breadcrumbs={[
                    { label: t("Dashboard"), href: "/seller/dashboard" },
                    { label: t("Promotions"), href: "/seller/promotions", active: true }
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t("Search promotions...")
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t("-- All Statuses --"),
                        options: [
                            { value: "active", label: t("Active") },
                            { value: "paused", label: t("Paused") },
                            { value: "completed", label: t("Completed") }
                        ]
                    },
                    {
                        value: dateRange,
                        onChange: setDateRange,
                        label: t("-- Date Range --"),
                        options: [
                            { value: "last_7_days", label: t("Last 7 days") },
                            { value: "last_30_days", label: t("Last 30 days") },
                            { value: "last_90_days", label: t("Last 90 days") }
                        ]
                    }
                ]}
                buttonConfigs={[
                    {
                        href: "/seller/promotions/create",
                        label: t("Create Promotion"),
                        icon: "bx bx-plus",
                        color: "primary"
                    }
                ]}
                onApplyFilters={applyFilters}
            />

            <DataTable
                columns={columns}
                data={promotions.data}
                headerTitle={`${t("Promotion List")} (${totalPromotions})`}
                headerIcon="bx bx-gift"
                emptyMessage={t("No promotions found")}
            />

            <Pagination links={promotions.links} />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({...confirmModal, isOpen: false})}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </AppLayout>
    );
}
```

##### 1.2 Create Promotion Form
```tsx
// Seller/Promotions/Create.tsx
import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Product {
    product_id: number;
    name: string;
    images: Array<{ image_url: string; is_primary: boolean }>;
    variants: Array<{ price: number }>;
}

interface Wallet {
    balance: number;
    currency: string;
}

export default function Create() {
    const { t } = useTranslation();
    const { products = [], wallet } = usePage().props;

    const [formData, setFormData] = useState({
        name: '',
        type: 'percentage',
        value: '',
        budget: '',
        start_date: '',
        end_date: '',
        selected_products: [] as number[]
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/seller/promotions', formData, {
            onSuccess: () => {
                // Redirect to index with success message
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            }
        });
    };

    const handleProductToggle = (productId) => {
        setFormData(prev => ({
            ...prev,
            selected_products: prev.selected_products.includes(productId)
                ? prev.selected_products.filter(id => id !== productId)
                : [...prev.selected_products, productId]
        }));
    };

    return (
        <AppLayout>
            <Head title={t("Create Promotion")} />

            <div className="content">
                <main>
                    <div className="header">
                        <div className="left">
                            <h1>{t("Create New Promotion")}</h1>
                            <div className="breadcrumb">
                                <li><a href="/seller/dashboard">{t("Dashboard")}</a></li>
                                <li><a href="/seller/promotions">{t("Promotions")}</a></li>
                                <li><a className="active">{t("Create")}</a></li>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="promotion-form">
                        <div className="form-section">
                            <h3 className="form-section-title">{t("Basic Information")}</h3>

                            <div className="form-group">
                                <label className="form-label">{t("Promotion Name")}</label>
                                <input
                                    type="text"
                                    className={`form-input-field ${errors.name ? 'error' : ''}`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder={t("Enter promotion name")}
                                />
                                {errors.name && <div className="form-error">{errors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t("Discount Type")}</label>
                                <select
                                    className={`form-input-field ${errors.type ? 'error' : ''}`}
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="percentage">{t("Percentage Discount")}</option>
                                    <option value="fixed">{t("Fixed Amount Discount")}</option>
                                </select>
                                {errors.type && <div className="form-error">{errors.type}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    {formData.type === 'percentage' ? t("Discount Percentage") : t("Discount Amount")}
                                </label>
                                <input
                                    type="number"
                                    className={`form-input-field ${errors.value ? 'error' : ''}`}
                                    value={formData.value}
                                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                                    placeholder={formData.type === 'percentage' ? "10" : "50000"}
                                    min="0"
                                    max={formData.type === 'percentage' ? "90" : undefined}
                                />
                                {errors.value && <div className="form-error">{errors.value}</div>}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">{t("Budget & Duration")}</h3>

                            <div className="form-group">
                                <label className="form-label">{t("Budget (VND)")}</label>
                                <input
                                    type="number"
                                    className={`form-input-field ${errors.budget ? 'error' : ''}`}
                                    value={formData.budget}
                                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                    placeholder="100000"
                                    min="0"
                                    max={wallet?.balance || 0}
                                />
                                <div style={{ fontSize: '12px', color: 'var(--dark-grey)', marginTop: '4px' }}>
                                    {t("Available balance")}: {wallet?.balance?.toLocaleString() || 0} VND
                                </div>
                                {errors.budget && <div className="form-error">{errors.budget}</div>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">{t("Start Date")}</label>
                                    <input
                                        type="datetime-local"
                                        className={`form-input-field ${errors.start_date ? 'error' : ''}`}
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    />
                                    {errors.start_date && <div className="form-error">{errors.start_date}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t("End Date")}</label>
                                    <input
                                        type="datetime-local"
                                        className={`form-input-field ${errors.end_date ? 'error' : ''}`}
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    />
                                    {errors.end_date && <div className="form-error">{errors.end_date}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">{t("Select Products")}</h3>
                            <div className="product-selection-grid">
                                {products.map(product => (
                                    <div
                                        key={product.product_id}
                                        className={`product-select-item ${formData.selected_products.includes(product.product_id) ? 'selected' : ''}`}
                                        onClick={() => handleProductToggle(product.product_id)}
                                    >
                                        <img
                                            src={product.images?.find(img => img.is_primary)?.image_url || '/default-product.png'}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                        <div className="product-info">
                                            <div className="product-name">{product.name}</div>
                                            <div className="product-price">
                                                {product.variants?.[0]?.price?.toLocaleString()} VND
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.selected_products && <div className="form-error">{errors.selected_products}</div>}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <a href="/seller/promotions" className="btn btn-secondary">
                                {t("Cancel")}
                            </a>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? t("Creating...") : t("Create Promotion")}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </AppLayout>
    );
}
```

#### Step 2: Create Wallet Components

##### 2.1 Wallet Dashboard
```tsx
// Seller/Wallet/Dashboard.tsx
import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Wallet {
    balance: number;
    total_earned: number;
    total_spent: number;
    currency: string;
}

interface Transaction {
    transaction_id: number;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    created_at: string;
}

export default function Dashboard() {
    const { t } = useTranslation();
    const { wallet, recentTransactions = [] } = usePage().props;

    return (
        <AppLayout>
            <Head title={t("Wallet Dashboard")} />

            <div className="content">
                <main>
                    <div className="header">
                        <div className="left">
                            <h1>{t("My Wallet")}</h1>
                            <div className="breadcrumb">
                                <li><a href="/seller/dashboard">{t("Dashboard")}</a></li>
                                <li><a className="active">{t("Wallet")}</a></li>
                            </div>
                        </div>
                        <div className="report">
                            <Link href="/seller/wallet/top-up" className="btn btn-primary">
                                <i className='bx bx-plus'></i>
                                {t("Top Up")}
                            </Link>
                        </div>
                    </div>

                    {/* Balance Display */}
                    <div className="balance-card">
                        <div className="wallet-balance">
                            {wallet?.balance?.toLocaleString() || 0}
                            <span className="wallet-balance-currency">{wallet?.currency || 'VND'}</span>
                        </div>
                        <div style={{ color: 'var(--dark-grey)', marginTop: '8px' }}>
                            {t("Current Balance")}
                        </div>
                    </div>

                    {/* Insights */}
                    <div className="insights">
                        <div>
                            <i className='bx bx-trending-up'></i>
                            <div className="info">
                                <h3>{wallet?.total_earned?.toLocaleString() || 0}</h3>
                                <p>{t("Total Earned")}</p>
                            </div>
                        </div>
                        <div>
                            <i className='bx bx-trending-down'></i>
                            <div className="info">
                                <h3>{wallet?.total_spent?.toLocaleString() || 0}</h3>
                                <p>{t("Total Spent")}</p>
                            </div>
                        </div>
                        <div>
                            <i className='bx bx-wallet'></i>
                            <div className="info">
                                <h3>{((wallet?.balance || 0) / (wallet?.total_earned || 1) * 100).toFixed(1)}%</h3>
                                <p>{t("Savings Rate")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bottom-data">
                        <div>
                            <div className="header">
                                <h3>{t("Recent Transactions")}</h3>
                                <Link href="/seller/wallet/transactions" className="btn btn-secondary">
                                    {t("View All")}
                                </Link>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t("Description")}</th>
                                        <th>{t("Amount")}</th>
                                        <th>{t("Type")}</th>
                                        <th>{t("Date")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map(transaction => (
                                        <tr key={transaction.transaction_id}>
                                            <td>{transaction.description}</td>
                                            <td style={{
                                                color: transaction.type === 'credit' ? 'var(--success)' : 'var(--danger)',
                                                fontWeight: '600'
                                            }}>
                                                {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()} VND
                                            </td>
                                            <td>
                                                <span className={`status ${transaction.type === 'credit' ? 'completed' : 'pending'}`}>
                                                    {t(transaction.type)}
                                                </span>
                                            </td>
                                            <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
```

#### Step 3: Add CSS Extensions

##### 3.1 Update Page.css
```css
/* Add to resources/css/Page.css */

/* Wallet specific styles */
.wallet-balance {
    font-size: 48px;
    font-weight: 700;
    color: var(--primary);
    text-align: center;
    margin: 20px 0;
}

.wallet-balance-currency {
    font-size: 24px;
    color: var(--dark-grey);
    margin-left: 8px;
}

.balance-card {
    background: var(--light);
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 36px;
}

.balance-card .amount {
    font-size: 36px;
    font-weight: 700;
    color: var(--success);
    margin-bottom: 8px;
}

.balance-card .label {
    color: var(--dark-grey);
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Promotion specific styles */
.promotion-card {
    background: var(--light);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 16px;
    border-left: 4px solid var(--primary);
    transition: transform 0.3s ease;
}

.promotion-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.promotion-status {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.promotion-status.active {
    background: var(--light-success);
    color: var(--success);
}

.promotion-status.paused {
    background: var(--light-warning);
    color: var(--warning);
}

.promotion-status.completed {
    background: var(--light-grey);
    color: var(--dark-grey);
}

/* Form enhancements */
.promotion-form {
    max-width: 800px;
    margin: 0 auto;
}

.form-section {
    background: var(--light);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
}

.form-section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--grey);
}

.product-selection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    max-height: 300px;
    overflow-y: auto;
    padding: 16px;
    border: 1px solid var(--grey);
    border-radius: 8px;
}

.product-select-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--grey);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.product-select-item:hover {
    border-color: var(--primary);
    background: var(--light-primary);
}

.product-select-item.selected {
    border-color: var(--primary);
    background: var(--light-primary);
}

.product-select-item .product-image {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    margin-right: 12px;
    object-fit: cover;
}

.product-select-item .product-info {
    flex: 1;
}

.product-select-item .product-name {
    font-weight: 500;
    color: var(--dark);
    font-size: 14px;
    margin-bottom: 2px;
}

.product-select-item .product-price {
    font-size: 12px;
    color: var(--dark-grey);
}

/* Notification styles */
.notification-item {
    background: var(--light);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    border-left: 4px solid var(--primary);
    transition: all 0.3s ease;
}

.notification-item.unread {
    background: var(--light-primary);
    border-left-color: var(--primary);
}

.notification-item .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.notification-item .notification-title {
    font-weight: 600;
    color: var(--dark);
}

.notification-item .notification-time {
    font-size: 12px;
    color: var(--dark-grey);
}

.notification-item .notification-content {
    color: var(--dark);
    line-height: 1.5;
}

/* Analytics styles */
.analytics-chart {
    background: var(--light);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
}

.analytics-metric {
    text-align: center;
    padding: 20px;
}

.analytics-metric .value {
    font-size: 32px;
    font-weight: 700;
    color: var(--primary);
    display: block;
}

.analytics-metric .label {
    font-size: 14px;
    color: var(--dark-grey);
    margin-top: 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .wallet-balance {
        font-size: 36px;
    }

    .balance-card {
        padding: 20px;
    }

    .product-selection-grid {
        grid-template-columns: 1fr;
        max-height: 400px;
    }

    .promotion-form {
        margin: 0 16px;
    }
}

@media (max-width: 576px) {
    .wallet-balance {
        font-size: 28px;
    }

    .balance-card .amount {
        font-size: 28px;
    }

    .form-section {
        padding: 20px;
    }

    .product-select-item {
        padding: 10px;
    }
}
```

#### Step 4: Update Routes

##### 4.1 Add Seller Routes
```php
// routes/seller.php - Add to existing file
Route::middleware(['auth', 'seller'])->prefix('seller')->name('seller.')->group(function () {
    // Existing routes...
    
    // Promotion routes
    Route::resource('promotions', \App\Http\Controllers\Seller\PromotionController::class)->parameters([
        'promotions' => 'promotion:promotion_id'
    ]);
    Route::post('promotions/{promotion}/pause', [\App\Http\Controllers\Seller\PromotionController::class, 'pause'])->name('promotions.pause');
    Route::post('promotions/{promotion}/resume', [\App\Http\Controllers\Seller\PromotionController::class, 'resume'])->name('promotions.resume');
    
    // Wallet routes
    Route::get('wallet', [\App\Http\Controllers\Seller\WalletController::class, 'show'])->name('wallet.show');
    Route::get('wallet/transactions', [\App\Http\Controllers\Seller\WalletController::class, 'transactions'])->name('wallet.transactions');
    Route::get('wallet/top-up', [\App\Http\Controllers\Seller\WalletController::class, 'topUpForm'])->name('wallet.top-up');
    Route::post('wallet/top-up', [\App\Http\Controllers\Seller\WalletController::class, 'topUp'])->name('wallet.top-up.store');
    Route::post('wallet/transfer', [\App\Http\Controllers\Seller\WalletController::class, 'transfer'])->name('wallet.transfer');
    
    // Notification routes
    Route::get('notifications', [\App\Http\Controllers\Seller\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/read', [\App\Http\Controllers\Seller\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::put('notifications/preferences', [\App\Http\Controllers\Seller\NotificationController::class, 'updatePreferences'])->name('notifications.preferences');
    
    // Analytics routes
    Route::get('analytics', [\App\Http\Controllers\Seller\AnalyticsController::class, 'overview'])->name('analytics.overview');
    Route::get('analytics/promotions/{promotion}', [\App\Http\Controllers\Seller\AnalyticsController::class, 'promotion'])->name('analytics.promotion');
});
```

#### Step 5: Update Sidebar Navigation

##### 5.1 Update Seller Sidebar
```tsx
// resources/js/layouts/app/AppLayout.tsx - Update seller menu
const sellerMenuItems = [
    // Existing items...
    {
        icon: 'bx bx-gift',
        label: t('Promotions'),
        href: '/seller/promotions',
        active: location.pathname.startsWith('/seller/promotions')
    },
    {
        icon: 'bx bx-wallet',
        label: t('Wallet'),
        href: '/seller/wallet',
        active: location.pathname.startsWith('/seller/wallet')
    },
    {
        icon: 'bx bx-bell',
        label: t('Notifications'),
        href: '/seller/notifications',
        active: location.pathname.startsWith('/seller/notifications'),
        badge: unreadNotificationsCount
    },
    {
        icon: 'bx bx-bar-chart',
        label: t('Analytics'),
        href: '/seller/analytics',
        active: location.pathname.startsWith('/seller/analytics')
    }
];
```

## Testing Requirements

### Unit Tests
- Component rendering with props
- Form validation logic
- State management
- Action handlers

### Integration Tests
- API calls and data flow
- Form submission
- Navigation flow
- Error handling

### E2E Tests
- Complete user workflows
- Cross-component interactions
- Mobile responsiveness

## Success Criteria
- ✅ Sellers can create, edit, delete promotions
- ✅ Wallet balance is displayed and updated in real-time
- ✅ Interface is responsive on mobile and desktop
- ✅ Form validation is complete and user-friendly
- ✅ Performance is good with large datasets
- ✅ UI/UX is consistent with admin interface

## Files to Create/Modify
### New Components:
- `Seller/Promotions/Index.tsx`
- `Seller/Promotions/Create.tsx`
- `Seller/Promotions/Edit.tsx`
- `Seller/Promotions/Show.tsx`
- `Seller/Wallet/Dashboard.tsx`
- `Seller/Wallet/TopUp.tsx`
- `Seller/Wallet/Transactions.tsx`
- `Seller/Notifications/Index.tsx`
- `Seller/Analytics/Overview.tsx`

### Modified Files:
- `resources/css/Page.css` - Add new CSS classes
- `routes/seller.php` - Add new routes
- `resources/js/layouts/app/AppLayout.tsx` - Update sidebar

### Controllers (if needed):
- `Seller/AnalyticsController.php`
- `Seller/NotificationController.php`

## Dependencies
- Phase 4B-B (Backend APIs)
- Existing UI components (FilterPanel, DataTable, etc.)
- Page.css styling system
- Inertia.js for React integration

## Timeline Estimate
- Component creation: 5 days
- CSS styling and responsive: 2 days
- Integration with backend: 2 days
- Testing and optimization: 2 days
- **Total: 11 days**

Begin implementation with Seller/Promotions/Index.tsx and Seller/Wallet/Dashboard.tsx, then create forms and add CSS styling.

---

# Phase 4D: Admin Promotion Frontend Implementation

## Context
Backend APIs for admin promotion management have been completed. Now we need to implement comprehensive React/Inertia components to create a complete admin interface for platform-wide promotion management, analytics, and system oversight.

## Problem Statement
Admins currently lack a centralized interface to:
- Manage all platform promotions across all sellers
- Monitor promotion performance and ROI system-wide
- Handle promotion conflicts and approval workflows
- Create platform-wide promotional campaigns
- Analyze promotion effectiveness and revenue impact
- Manage promotion templates and bulk operations

## Phase 4D Objectives
Implement comprehensive React/Inertia frontend for admin promotion system with:
1. **Admin Promotion Dashboard** - System-wide promotion overview with advanced filtering
2. **Promotion Management** - CRUD operations for all promotions with approval workflow
3. **Analytics & Reporting** - Platform-wide promotion analytics and ROI tracking
4. **Conflict Resolution** - Tools to detect and resolve promotion conflicts
5. **Bulk Operations** - Mass promotion management and template system
6. **Template Management** - Create and manage promotion templates
7. **Responsive Design** - Mobile-friendly with Page.css styling

## Technical Requirements

### Styling Guidelines
**IMPORTANT NOTE: DO NOT USE TAILWINDCSS OR INLINE STYLES**

#### CSS Usage Rules:
- **Only use Page.css** - All styling must come from `resources/css/Page.css`
- **No TailwindCSS** - Do not import or use Tailwind classes
- **No inline styles** - Do not use `style={{}}` attribute
- **Base on existing CSS** - Use and extend existing classes from Page.css

#### CSS Classes Available:
```css
/* Layout & Structure */
.content main .header
.content main .insights
.content main .bottom-data
.content main .bottom-data>div

/* Form Elements */
.form-group
.form-label
.form-input-field
.form-input-field:focus
.form-input-field.error
.btn, .btn-primary, .btn-secondary, .btn-danger

/* Status & Badges */
.status.pending, .status.process, .status.completed

/* Tables */
.content main .bottom-data .orders table
.content main .bottom-data .orders table th
.content main .bottom-data .orders table td

/* Cards & Panels */
.content main .insights li
.content main .insights li .bx
.content main .insights li .info h3
.content main .insights li .info p

/* Navigation */
.content main .header .left .breadcrumb
.content main .header .left .breadcrumb li a.active

/* Responsive */
@media screen and (max-width: 768px)
@media screen and (max-width: 576px)
```

### Component Structure Analysis
**Read and reuse existing components:**

#### Admin Components Reference:
- **FilterPanel**: `resources/js/Pages/Admin/Products/Index.tsx`
  - Search input, filter dropdowns, breadcrumbs
  - Header with title and breadcrumbs

- **DataTable**: `resources/js/components/ui/DataTable.tsx`
  - Column definitions with header/cell renderers
  - Sorting, pagination, bulk actions

- **StatusBadge**: `resources/js/components/ui/StatusBadge.tsx`
  - Status mapping and CSS class generation
  - Support for promotion, order, payment types

- **ActionButtons**: `resources/js/components/ui/ActionButtons.tsx`
  - Button/link actions with icons
  - Primary, danger, secondary variants

#### Admin Components Structure:
- **Layout**: Use `AdminLayout` for admin pages
- **Navigation**: Admin sidebar with promotion management menu
- **Responsive**: Mobile-first approach with breakpoints from Page.css

### Component Implementation Details

#### 1. Admin Promotion Components

##### Admin/Promotions/Index.tsx
```tsx
// Main dashboard for admin promotion management
// Features:
// - List all promotions across all sellers with advanced filtering
// - Search by promotion name, seller name, product name
// - Filter by status, type, date range, budget range, ROI
// - Bulk actions: approve, reject, pause, delete
// - Export functionality
// - Real-time status updates
// - Conflict detection alerts
```

**UI Structure:**
```tsx
<AdminLayout>
    <FilterPanel
        title={t("Promotion Management")}
        searchPlaceholder={t("Search promotions, sellers, products...")}
        filters={[
            {
                key: 'status',
                label: t('Status'),
                options: [
                    { value: 'draft', label: t('Draft') },
                    { value: 'active', label: t('Active') },
                    { value: 'paused', label: t('Paused') },
                    { value: 'expired', label: t('Expired') },
                    { value: 'rejected', label: t('Rejected') }
                ]
            },
            {
                key: 'type',
                label: t('Type'),
                options: [
                    { value: 'percentage', label: t('Percentage') },
                    { value: 'fixed_amount', label: t('Fixed Amount') },
                    { value: 'free_shipping', label: t('Free Shipping') },
                    { value: 'buy_x_get_y', label: t('Buy X Get Y') }
                ]
            }
        ]}
        actions={[
            {
                label: t("Create Promotion"),
                href: route('admin.promotions.create'),
                variant: 'primary'
            },
            {
                label: t("Bulk Actions"),
                onClick: () => setShowBulkModal(true),
                variant: 'secondary'
            }
        ]}
    />

    <DataTable
        data={promotions}
        columns={[
            {
                key: 'promotion_id',
                header: t('ID'),
                sortable: true,
                width: '80px'
            },
            {
                key: 'name',
                header: t('Promotion Name'),
                sortable: true,
                render: (promotion) => (
                    <div className="promotion-cell">
                        <div className="promotion-name">{promotion.name}</div>
                        <div className="promotion-seller">
                            {t('Seller')}: {promotion.seller?.name}
                        </div>
                    </div>
                )
            },
            {
                key: 'type',
                header: t('Type'),
                render: (promotion) => (
                    <StatusBadge
                        status={promotion.type}
                        type="promotion-type"
                    />
                )
            },
            {
                key: 'value',
                header: t('Discount'),
                render: (promotion) => (
                    <div className="promotion-discount">
                        {promotion.type === 'percentage'
                            ? `${promotion.value}%`
                            : `${promotion.value.toLocaleString()} VND`
                        }
                    </div>
                )
            },
            {
                key: 'budget',
                header: t('Budget'),
                render: (promotion) => (
                    <div className="promotion-budget">
                        <div className="promotion-budget-amount">
                            {promotion.allocated_budget?.toLocaleString()} VND
                        </div>
                        <div className="promotion-budget-caption">
                            {t('Used')}: {promotion.spent_budget?.toLocaleString()} VND
                        </div>
                    </div>
                )
            },
            {
                key: 'status',
                header: t('Status'),
                render: (promotion) => (
                    <StatusBadge
                        status={promotion.status}
                        type="promotion"
                    />
                )
            },
            {
                key: 'roi_percentage',
                header: t('ROI'),
                render: (promotion) => (
                    <div className={`promotion-roi ${promotion.roi_percentage >= 0 ? 'positive' : 'negative'}`}>
                        {promotion.roi_percentage?.toFixed(1)}%
                    </div>
                )
            },
            {
                key: 'actions',
                header: t('Actions'),
                render: (promotion) => (
                    <ActionButtons
                        actions={[
                            {
                                label: t('View'),
                                href: route('admin.promotions.show', promotion.promotion_id),
                                icon: 'bx-show'
                            },
                            {
                                label: t('Edit'),
                                href: route('admin.promotions.edit', promotion.promotion_id),
                                icon: 'bx-edit',
                                show: promotion.status === 'draft'
                            },
                            {
                                label: promotion.status === 'active' ? t('Pause') : t('Resume'),
                                onClick: () => handleStatusToggle(promotion),
                                icon: promotion.status === 'active' ? 'bx-pause' : 'bx-play',
                                variant: 'secondary'
                            },
                            {
                                label: t('Delete'),
                                onClick: () => handleDelete(promotion),
                                icon: 'bx-trash',
                                variant: 'danger',
                                confirm: true
                            }
                        ]}
                    />
                )
            }
        ]}
        selectable={true}
        onSelectionChange={setSelectedPromotions}
        pagination={pagination}
    />

    {/* Bulk Actions Modal */}
    {showBulkModal && (
        <BulkActionsModal
            selectedCount={selectedPromotions.length}
            onClose={() => setShowBulkModal(false)}
            onAction={handleBulkAction}
        />
    )}
</AdminLayout>
```

##### Admin/Promotions/Create.tsx
```tsx
// Form to create new platform promotion
// Features:
// - Product/category selection across all sellers
// - Advanced targeting rules (sellers, categories, price ranges)
// - Budget allocation and approval workflow
// - Template selection
// - Preview impact before creation
```

**Form Fields:**
- Promotion name and description
- Promotion type (percentage/fixed/free shipping/buy X get Y)
- Discount value with validation
- Target selection (products/categories/sellers/rules)
- Budget allocation
- Date range with timezone handling
- Usage limits and approval settings

##### Admin/Promotions/Edit.tsx
```tsx
// Form to edit existing promotion
// Features:
// - Load existing promotion data
// - Modify targeting rules (if not active)
// - Budget adjustments with approval
// - Status management with restrictions
// - Change history tracking
```

##### Admin/Promotions/Show.tsx
```tsx
// Promotion details with comprehensive analytics
// Features:
// - Complete promotion information
// - Performance metrics (impressions, clicks, conversions, revenue)
// - ROI analysis with charts
// - Geographic performance data
// - Seller performance breakdown
// - Transaction history
// - Edit/Delete/Clone actions
// - Conflict alerts
```

#### 2. Analytics Components

##### Admin/Analytics/Promotions.tsx
```tsx
// Platform-wide promotion analytics
// Features:
// - Overall promotion performance metrics
// - ROI trends and forecasting
// - Top performing promotions/campaigns
// - Revenue attribution analysis
// - Comparative analytics (period over period)
// - Category/seller performance breakdown
```

**UI Structure:**
```tsx
<AdminLayout>
    <div className="content">
        <main>
            <div className="header">
                <div className="left">
                    <h1>{t("Promotion Analytics")}</h1>
                    <div className="breadcrumb">
                        <li><a href="/admin/dashboard">{t("Dashboard")}</a></li>
                        <li><a className="active">{t("Analytics")}</a></li>
                        <li><a className="active">{t("Promotions")}</a></li>
                    </div>
                </div>
            </div>

            <div className="insights">
                <div className="analytics-metric">
                    <div className="value">{totalRevenue.toLocaleString()}</div>
                    <div className="label">{t("Total Revenue from Promotions")}</div>
                </div>
                <div className="analytics-metric">
                    <div className="value">{averageROI.toFixed(1)}%</div>
                    <div className="label">{t("Average ROI")}</div>
                </div>
                <div className="analytics-metric">
                    <div className="value">{activePromotions}</div>
                    <div className="label">{t("Active Promotions")}</div>
                </div>
                <div className="analytics-metric">
                    <div className="value">{totalBudget.toLocaleString()}</div>
                    <div className="label">{t("Total Budget Allocated")}</div>
                </div>
            </div>

            <div className="bottom-data">
                <div className="analytics-chart">
                    <h3>{t("ROI Trends")}</h3>
                    {/* Chart component */}
                </div>

                <div className="analytics-chart">
                    <h3>{t("Top Performing Promotions")}</h3>
                    {/* Table component */}
                </div>
            </div>
        </main>
    </div>
</AdminLayout>
```

#### 3. Template Management Components

##### Admin/PromotionTemplates/Index.tsx
```tsx
// Template management dashboard
// Features:
// - List all promotion templates
// - Create new templates from existing promotions
// - Template usage statistics
// - Public/private template management
// - Bulk template operations
```

##### Admin/PromotionTemplates/Create.tsx
```tsx
// Template creation form
// Features:
// - Build template from scratch or existing promotion
// - Define variable fields
// - Set template metadata (name, description, category)
// - Preview template usage
```

#### 4. Conflict Resolution Components

##### Admin/PromotionConflicts/Index.tsx
```tsx
// Conflict detection and resolution interface
// Features:
// - List all current conflicts
// - Conflict details and impact analysis
// - Resolution suggestions
// - Bulk conflict resolution
// - Conflict prevention rules
```

### CSS Extensions (Add to Page.css)

#### New CSS Classes for Admin Promotions:
```css
/* Admin Promotion Dashboard */
.admin-promotion-dashboard {
    /* Custom styles for admin overview */
}

.promotion-conflict-alert {
    background: var(--light-danger);
    border: 1px solid var(--danger);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 16px;
}

.promotion-conflict-alert .alert-title {
    font-weight: 600;
    color: var(--danger);
    margin-bottom: 4px;
}

.promotion-conflict-alert .alert-description {
    color: var(--dark);
    font-size: 14px;
}

/* Bulk Actions */
.bulk-actions-bar {
    background: var(--light);
    border: 1px solid var(--grey);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.bulk-actions-bar .selection-count {
    font-weight: 500;
    color: var(--dark);
}

.bulk-actions-bar .bulk-buttons {
    display: flex;
    gap: 8px;
}

/* Advanced Filters */
.advanced-filters {
    background: var(--light);
    border: 1px solid var(--grey);
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
}

.advanced-filters .filter-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 12px;
}

.advanced-filters .filter-row:last-child {
    margin-bottom: 0;
}

/* Promotion Templates */
.template-card {
    background: var(--light);
    border: 1px solid var(--grey);
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;
}

.template-card:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.template-card .template-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.template-card .template-name {
    font-weight: 600;
    color: var(--dark);
    font-size: 16px;
}

.template-card .template-meta {
    font-size: 12px;
    color: var(--dark-grey);
}

.template-card .template-description {
    color: var(--dark);
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 12px;
}

.template-card .template-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: var(--dark-grey);
}

/* Analytics Dashboard */
.analytics-dashboard {
    /* Custom styles for analytics overview */
}

.analytics-chart {
    background: var(--light);
    border: 1px solid var(--grey);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
}

.analytics-chart h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--primary);
}

.analytics-metric {
    text-align: center;
    padding: 20px;
    background: var(--light);
    border-radius: 8px;
    border: 1px solid var(--grey);
}

.analytics-metric .value {
    font-size: 32px;
    font-weight: 700;
    color: var(--primary);
    display: block;
    margin-bottom: 8px;
}

.analytics-metric .label {
    font-size: 14px;
    color: var(--dark-grey);
    font-weight: 500;
}

/* Conflict Resolution */
.conflict-resolution-panel {
    background: var(--light-danger);
    border: 1px solid var(--danger);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
}

.conflict-resolution-panel .conflict-title {
    font-weight: 600;
    color: var(--danger);
    margin-bottom: 8px;
}

.conflict-resolution-panel .conflict-details {
    color: var(--dark);
    font-size: 14px;
    margin-bottom: 12px;
}

.conflict-resolution-panel .resolution-actions {
    display: flex;
    gap: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .bulk-actions-bar {
        flex-direction: column;
        align-items: stretch;
    }

    .advanced-filters .filter-row {
        grid-template-columns: 1fr;
    }

    .template-card .template-header {
        flex-direction: column;
        gap: 8px;
    }

    .analytics-metric .value {
        font-size: 24px;
    }
}
```

### Implementation Steps

#### Step 1: Create Core Components

##### 1.1 Admin Promotion Dashboard
```bash
# Create component files
touch resources/js/Pages/Admin/Promotions/Index.tsx
touch resources/js/Pages/Admin/Promotions/Create.tsx
touch resources/js/Pages/Admin/Promotions/Edit.tsx
touch resources/js/Pages/Admin/Promotions/Show.tsx
touch resources/js/Pages/Admin/Analytics/Promotions.tsx
```

**Index.tsx Structure:**
```tsx
import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/AdminLayout';
import FilterPanel from '@/components/ui/FilterPanel';
import DataTable from '@/components/ui/DataTable';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionButtons, { ActionConfig } from '@/components/ui/ActionButtons';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import BulkActionsModal from '@/components/ui/BulkActionsModal';
import Toast from '@/components/ui/Toast';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Promotion {
    promotion_id: number;
    name: string;
    type: string;
    value: number;
    start_date: string;
    end_date: string;
    allocated_budget: number;
    spent_budget: number;
    roi_percentage: number;
    status: string;
    seller: {
        name: string;
    };
    products_count: number;
}

export default function Index() {
    const { t } = useTranslation();
    const { promotions, filters, pagination } = usePage().props;

    const [selectedPromotions, setSelectedPromotions] = useState<number[]>([]);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleStatusToggle = async (promotion: Promotion) => {
        try {
            await router.post(
                route('admin.promotions.toggle-status', promotion.promotion_id),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Refresh data
                    }
                }
            );
        } catch (error) {
            console.error('Failed to toggle promotion status:', error);
        }
    };

    const handleDelete = async (promotion: Promotion) => {
        if (!confirm(t('Are you sure you want to delete this promotion?'))) {
            return;
        }

        try {
            await router.delete(
                route('admin.promotions.destroy', promotion.promotion_id),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Refresh data
                    }
                }
            );
        } catch (error) {
            console.error('Failed to delete promotion:', error);
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedPromotions.length === 0) return;

        try {
            setLoading(true);
            await router.post(
                route('admin.promotions.bulk-action'),
                {
                    action,
                    promotion_ids: selectedPromotions
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSelectedPromotions([]);
                        setShowBulkModal(false);
                    }
                }
            );
        } catch (error) {
            console.error('Bulk action failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Head title={t("Promotion Management")} />

            <FilterPanel
                title={t("Promotion Management")}
                searchPlaceholder={t("Search promotions, sellers, products...")}
                filters={[
                    {
                        key: 'status',
                        label: t('Status'),
                        options: [
                            { value: 'draft', label: t('Draft') },
                            { value: 'active', label: t('Active') },
                            { value: 'paused', label: t('Paused') },
                            { value: 'expired', label: t('Expired') },
                            { value: 'rejected', label: t('Rejected') }
                        ]
                    },
                    {
                        key: 'type',
                        label: t('Type'),
                        options: [
                            { value: 'percentage', label: t('Percentage') },
                            { value: 'fixed_amount', label: t('Fixed Amount') },
                            { value: 'free_shipping', label: t('Free Shipping') },
                            { value: 'buy_x_get_y', label: t('Buy X Get Y') }
                        ]
                    },
                    {
                        key: 'date_range',
                        label: t('Date Range'),
                        type: 'date_range'
                    },
                    {
                        key: 'budget_range',
                        label: t('Budget Range'),
                        type: 'number_range'
                    }
                ]}
                actions={[
                    {
                        label: t("Create Promotion"),
                        href: route('admin.promotions.create'),
                        variant: 'primary'
                    },
                    {
                        label: t("Analytics"),
                        href: route('admin.analytics.promotions'),
                        variant: 'secondary'
                    },
                    {
                        label: t("Templates"),
                        href: route('admin.promotion-templates.index'),
                        variant: 'secondary'
                    }
                ]}
            />

            {/* Conflict Alerts */}
            {conflicts?.length > 0 && (
                <div className="promotion-conflict-alert">
                    <div className="alert-title">
                        ⚠️ {t('Promotion Conflicts Detected')}
                    </div>
                    <div className="alert-description">
                        {t('{{count}} promotions have conflicts that need resolution.', { count: conflicts.length })}
                        <a href={route('admin.promotion-conflicts.index')} className="btn btn-secondary btn-small">
                            {t('Resolve Conflicts')}
                        </a>
                    </div>
                </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedPromotions.length > 0 && (
                <div className="bulk-actions-bar">
                    <div className="selection-count">
                        {t('{{count}} promotions selected', { count: selectedPromotions.length })}
                    </div>
                    <div className="bulk-buttons">
                        <button
                            onClick={() => handleBulkAction('activate')}
                            className="btn btn-primary btn-small"
                            disabled={loading}
                        >
                            {t('Activate')}
                        </button>
                        <button
                            onClick={() => handleBulkAction('pause')}
                            className="btn btn-secondary btn-small"
                            disabled={loading}
                        >
                            {t('Pause')}
                        </button>
                        <button
                            onClick={() => handleBulkAction('delete')}
                            className="btn btn-danger btn-small"
                            disabled={loading}
                        >
                            {t('Delete')}
                        </button>
                    </div>
                </div>
            )}

            <DataTable
                data={promotions.data}
                columns={[
                    {
                        key: 'promotion_id',
                        header: t('ID'),
                        sortable: true,
                        width: '80px'
                    },
                    {
                        key: 'name',
                        header: t('Promotion Name'),
                        sortable: true,
                        render: (promotion) => (
                            <div className="promotion-cell">
                                <div className="promotion-name">{promotion.name}</div>
                                <div className="promotion-seller">
                                    {t('Seller')}: {promotion.seller?.name}
                                </div>
                            </div>
                        )
                    },
                    {
                        key: 'type',
                        header: t('Type'),
                        render: (promotion) => (
                            <StatusBadge
                                status={promotion.type}
                                type="promotion-type"
                            />
                        )
                    },
                    {
                        key: 'value',
                        header: t('Discount'),
                        render: (promotion) => (
                            <div className="promotion-discount">
                                {promotion.type === 'percentage'
                                    ? `${promotion.value}%`
                                    : `${promotion.value.toLocaleString()} VND`
                                }
                            </div>
                        )
                    },
                    {
                        key: 'budget',
                        header: t('Budget'),
                        render: (promotion) => (
                            <div className="promotion-budget">
                                <div className="promotion-budget-amount">
                                    {promotion.allocated_budget?.toLocaleString()} VND
                                </div>
                                <div className="promotion-budget-caption">
                                    {t('Used')}: {promotion.spent_budget?.toLocaleString()} VND
                                </div>
                            </div>
                        )
                    },
                    {
                        key: 'status',
                        header: t('Status'),
                        render: (promotion) => (
                            <StatusBadge
                                status={promotion.status}
                                type="promotion"
                            />
                        )
                    },
                    {
                        key: 'roi_percentage',
                        header: t('ROI'),
                        render: (promotion) => (
                            <div className={`promotion-roi ${promotion.roi_percentage >= 0 ? 'positive' : 'negative'}`}>
                                {promotion.roi_percentage?.toFixed(1)}%
                            </div>
                        )
                    },
                    {
                        key: 'actions',
                        header: t('Actions'),
                        render: (promotion) => (
                            <ActionButtons
                                actions={[
                                    {
                                        label: t('View'),
                                        href: route('admin.promotions.show', promotion.promotion_id),
                                        icon: 'bx-show'
                                    },
                                    {
                                        label: t('Edit'),
                                        href: route('admin.promotions.edit', promotion.promotion_id),
                                        icon: 'bx-edit',
                                        show: promotion.status === 'draft'
                                    },
                                    {
                                        label: promotion.status === 'active' ? t('Pause') : t('Resume'),
                                        onClick: () => handleStatusToggle(promotion),
                                        icon: promotion.status === 'active' ? 'bx-pause' : 'bx-play',
                                        variant: 'secondary'
                                    },
                                    {
                                        label: t('Delete'),
                                        onClick: () => handleDelete(promotion),
                                        icon: 'bx-trash',
                                        variant: 'danger',
                                        confirm: true
                                    }
                                ]}
                            />
                        )
                    }
                ]}
                selectable={true}
                onSelectionChange={setSelectedPromotions}
                pagination={promotions}
                loading={loading}
            />
        </AdminLayout>
    );
}
```

##### 1.2 Create Promotion Form
```tsx
// Admin/Promotions/Create.tsx
import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/AdminLayout';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Product {
    product_id: number;
    name: string;
    sku: string;
    seller_name: string;
    price: number;
    category_name: string;
}

interface Category {
    category_id: number;
    name: string;
    product_count: number;
}

export default function Create() {
    const { t } = useTranslation();
    const { products, categories, templates } = usePage().props;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'percentage',
        value: '',
        allocated_budget: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
        min_order_amount: '',
        max_discount_amount: '',
        // Targeting
        target_type: 'products', // products, categories, sellers, rules
        selected_products: [] as number[],
        selected_categories: [] as number[],
        selected_sellers: [] as number[],
        // Rules
        selection_rules: [] as any[],
        auto_apply_new_products: false,
        // Template
        template_id: '',
        is_draft: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Filter products based on search
    const filteredProducts = products?.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const validateForm = (): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = t('Promotion name is required');
        }

        if (!formData.value || parseFloat(formData.value) <= 0) {
            errors.value = t('Discount value must be greater than 0');
        }

        if (formData.type === 'percentage' && parseFloat(formData.value) > 100) {
            errors.value = t('Percentage discount cannot exceed 100%');
        }

        if (!formData.allocated_budget || parseFloat(formData.allocated_budget) <= 0) {
            errors.allocated_budget = t('Budget must be greater than 0');
        }

        if (!formData.start_date) {
            errors.start_date = t('Start date is required');
        } else {
            const startDate = new Date(formData.start_date);
            const now = new Date();
            if (startDate <= now) {
                errors.start_date = t('Start date must be in the future');
            }
        }

        if (!formData.end_date) {
            errors.end_date = t('End date is required');
        } else if (formData.start_date && formData.end_date) {
            const startDate = new Date(formData.start_date);
            const endDate = new Date(formData.end_date);
            if (endDate <= startDate) {
                errors.end_date = t('End date must be after start date');
            }
        }

        // Validate targeting
        if (formData.target_type === 'products' && formData.selected_products.length === 0) {
            errors.selected_products = t('At least one product must be selected');
        }

        if (formData.target_type === 'categories' && formData.selected_categories.length === 0) {
            errors.selected_categories = t('At least one category must be selected');
        }

        return errors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Scroll to first error
            const firstError = Object.keys(validationErrors)[0];
            const element = document.querySelector(`[name="${firstError}"]`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        // Prepare submit data based on target type
        const submitData = {
            ...formData,
            value: parseFloat(formData.value),
            allocated_budget: parseFloat(formData.allocated_budget),
            usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
            min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
            max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        };

        router.post('/admin/promotions', submitData, {
            onSuccess: () => {
                router.visit('/admin/promotions', {
                    method: 'get',
                    data: { success: t('Promotion created successfully!') }
                });
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            }
        });
    };

    const handleProductToggle = (productId: number) => {
        setFormData(prev => ({
            ...prev,
            selected_products: prev.selected_products.includes(productId)
                ? prev.selected_products.filter(id => id !== productId)
                : [...prev.selected_products, productId]
        }));
    };

    const handleCategoryToggle = (categoryId: number) => {
        setFormData(prev => ({
            ...prev,
            selected_categories: prev.selected_categories.includes(categoryId)
                ? prev.selected_categories.filter(id => id !== categoryId)
                : [...prev.selected_categories, categoryId]
        }));
    };

    return (
        <AdminLayout>
            <Head title={t("Create Promotion")} />

            <div className="content">
                <main>
                    <div className="header">
                        <div className="left">
                            <h1>{t("Create New Promotion")}</h1>
                            <div className="breadcrumb">
                                <li><a href="/admin/dashboard">{t("Dashboard")}</a></li>
                                <li><a href="/admin/promotions">{t("Promotions")}</a></li>
                                <li><a className="active">{t("Create")}</a></li>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="promotion-form">
                        {/* Basic Information */}
                        <div className="form-section">
                            <h3 className="form-section-title">{t("Basic Information")}</h3>

                            <div className="form-group">
                                <label className="form-label">{t("Promotion Name")}</label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-input-field ${errors.name ? 'error' : ''}`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder={t("Enter promotion name")}
                                />
                                {errors.name && <div className="form-error">{errors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t("Description")}</label>
                                <textarea
                                    name="description"
                                    className={`form-input-field ${errors.description ? 'error' : ''}`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder={t("Enter promotion description")}
                                    rows={3}
                                />
                                {errors.description && <div className="form-error">{errors.description}</div>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t("Discount Type")}</label>
                                    <select
                                        name="type"
                                        className={`form-input-field ${errors.type ? 'error' : ''}`}
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="percentage">{t("Percentage Discount")}</option>
                                        <option value="fixed_amount">{t("Fixed Amount Discount")}</option>
                                        <option value="free_shipping">{t("Free Shipping")}</option>
                                        <option value="buy_x_get_y">{t("Buy X Get Y")}</option>
                                    </select>
                                    {errors.type && <div className="form-error">{errors.type}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        {formData.type === 'percentage' ? t("Discount Percentage") :
                                         formData.type === 'fixed_amount' ? t("Discount Amount") :
                                         formData.type === 'buy_x_get_y' ? t("Buy Quantity") : t("Value")}
                                    </label>
                                    <input
                                        type="number"
                                        name="value"
                                        className={`form-input-field ${errors.value ? 'error' : ''}`}
                                        value={formData.value}
                                        onChange={(e) => setFormData({...formData, value: e.target.value})}
                                        placeholder={formData.type === 'percentage' ? "10" : "50000"}
                                        min="0"
                                        max={formData.type === 'percentage' ? "100" : undefined}
                                    />
                                    {errors.value && <div className="form-error">{errors.value}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Budget & Duration */}
                        <div className="form-section">
                            <h3 className="form-section-title">{t("Budget & Duration")}</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t("Budget (VND)")}</label>
                                    <input
                                        type="number"
                                        name="allocated_budget"
                                        className={`form-input-field ${errors.allocated_budget ? 'error' : ''}`}
                                        value={formData.allocated_budget}
                                        onChange={(e) => setFormData({...formData, allocated_budget: e.target.value})}
                                        placeholder="100000"
                                        min="0"
                                    />
                                    {errors.allocated_budget && <div className="form-error">{errors.allocated_budget}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t("Usage Limit")}</label>
                                    <input
                                        type="number"
                                        name="usage_limit"
                                        className={`form-input-field ${errors.usage_limit ? 'error' : ''}`}
                                        value={formData.usage_limit}
                                        onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                                        placeholder={t("Unlimited")}
                                        min="1"
                                    />
                                    {errors.usage_limit && <div className="form-error">{errors.usage_limit}</div>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t("Start Date")}</label>
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        className={`form-input-field ${errors.start_date ? 'error' : ''}`}
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    />
                                    {errors.start_date && <div className="form-error">{errors.start_date}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t("End Date")}</label>
                                    <input
                                        type="datetime-local"
                                        name="end_date"
                                        className={`form-input-field ${errors.end_date ? 'error' : ''}`}
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    />
                                    {errors.end_date && <div className="form-error">{errors.end_date}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Targeting */}
                        <div className="form-section">
                            <h3 className="form-section-title">{t("Target Selection")}</h3>

                            <div className="form-group">
                                <label className="form-label">{t("Target Type")}</label>
                                <select
                                    name="target_type"
                                    className={`form-input-field ${errors.target_type ? 'error' : ''}`}
                                    value={formData.target_type}
                                    onChange={(e) => setFormData({...formData, target_type: e.target.value})}
                                >
                                    <option value="products">{t("Specific Products")}</option>
                                    <option value="categories">{t("Product Categories")}</option>
                                    <option value="sellers">{t("Specific Sellers")}</option>
                                    <option value="rules">{t("Rule-based Selection")}</option>
                                </select>
                                {errors.target_type && <div className="form-error">{errors.target_type}</div>}
                            </div>

                            {/* Product Selection */}
                            {formData.target_type === 'products' && (
                                <div className="target-selection">
                                    <div className="selection-header">
                                        <input
                                            type="text"
                                            placeholder={t("Search products...")}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="form-input-field search-input"
                                        />
                                        <div className="selection-actions">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({...prev, selected_products: filteredProducts.map(p => p.product_id)}))}
                                                className="btn btn-secondary btn-small"
                                            >
                                                {t("Select All")}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({...prev, selected_products: []}))}
                                                className="btn btn-secondary btn-small"
                                            >
                                                {t("Clear All")}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="selection-summary">
                                        {t("Selected")}: {formData.selected_products.length} {t("products")}
                                    </div>

                                    <div className="product-grid">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.product_id}
                                                className={`product-item ${formData.selected_products.includes(product.product_id) ? 'selected' : ''}`}
                                                onClick={() => handleProductToggle(product.product_id)}
                                            >
                                                <div className="product-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.selected_products.includes(product.product_id)}
                                                        onChange={() => {}}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="product-info">
                                                    <div className="product-name">{product.name}</div>
                                                    <div className="product-sku">SKU: {product.sku}</div>
                                                    <div className="product-seller">{t("Seller")}: {product.seller_name}</div>
                                                    <div className="product-price">{product.price.toLocaleString()} VND</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.selected_products && <div className="form-error">{errors.selected_products}</div>}
                                </div>
                            )}

                            {/* Category Selection */}
                            {formData.target_type === 'categories' && (
                                <div className="target-selection">
                                    <div className="category-grid">
                                        {categories?.map(category => (
                                            <div
                                                key={category.category_id}
                                                className={`category-item ${formData.selected_categories.includes(category.category_id) ? 'selected' : ''}`}
                                                onClick={() => handleCategoryToggle(category.category_id)}
                                            >
                                                <div className="category-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.selected_categories.includes(category.category_id)}
                                                        onChange={() => {}}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="category-info">
                                                    <div className="category-name">{category.name}</div>
                                                    <div className="category-count">{category.product_count} {t("products")}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.selected_categories && <div className="form-error">{errors.selected_categories}</div>}
                                </div>
                            )}
                        </div>

                        {/* Advanced Options */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="form-section-title">{t("Advanced Options")}</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="btn btn-secondary btn-small"
                                >
                                    {showAdvanced ? t("Hide") : t("Show")} {t("Advanced")}
                                </button>
                            </div>

                            {showAdvanced && (
                                <div className="advanced-options">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">{t("Minimum Order Amount")}</label>
                                            <input
                                                type="number"
                                                name="min_order_amount"
                                                className={`form-input-field ${errors.min_order_amount ? 'error' : ''}`}
                                                value={formData.min_order_amount}
                                                onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})}
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.min_order_amount && <div className="form-error">{errors.min_order_amount}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">{t("Maximum Discount Amount")}</label>
                                            <input
                                                type="number"
                                                name="max_discount_amount"
                                                className={`form-input-field ${errors.max_discount_amount ? 'error' : ''}`}
                                                value={formData.max_discount_amount}
                                                onChange={(e) => setFormData({...formData, max_discount_amount: e.target.value})}
                                                placeholder={t("No limit")}
                                                min="0"
                                            />
                                            {errors.max_discount_amount && <div className="form-error">{errors.max_discount_amount}</div>}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="auto_apply_new_products"
                                                checked={formData.auto_apply_new_products}
                                                onChange={(e) => setFormData({...formData, auto_apply_new_products: e.target.checked})}
                                            />
                                            {t("Automatically apply to new products matching criteria")}
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="is_draft"
                                                checked={formData.is_draft}
                                                onChange={(e) => setFormData({...formData, is_draft: e.target.checked})}
                                            />
                                            {t("Save as draft")}
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <a href="/admin/promotions" className="btn btn-secondary">
                                {t("Cancel")}
                            </a>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? t("Creating...") : formData.is_draft ? t("Save Draft") : t("Create Promotion")}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </AdminLayout>
    );
}
```

#### Step 2: Add CSS Extensions

##### 2.1 Update Page.css
```css
/* Add to resources/css/Page.css */

/* Form Enhancements */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--grey);
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--primary);
}

/* Target Selection */
.target-selection {
    margin-top: 16px;
}

.selection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 16px;
}

.selection-actions {
    display: flex;
    gap: 8px;
}

.product-grid,
.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--grey);
    border-radius: 6px;
    padding: 12px;
}

.product-item,
.category-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--grey);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
}

.product-item:hover,
.category-item:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 4px rgba(25, 118, 210, 0.1);
}

.product-item.selected,
.category-item.selected {
    border-color: var(--primary);
    background: var(--light-primary);
}

.product-checkbox,
.category-checkbox {
    flex-shrink: 0;
}

.product-checkbox input[type="checkbox"],
.category-checkbox input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--primary);
}

.product-info,
.category-info {
    flex: 1;
    min-width: 0;
}

.product-name {
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 4px;
}

.product-sku {
    font-size: 12px;
    color: var(--dark-grey);
    margin-bottom: 2px;
}

.product-seller {
    font-size: 12px;
    color: var(--dark-grey);
    margin-bottom: 4px;
}

.product-price {
    font-weight: 600;
    color: var(--primary);
}

.category-name {
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 4px;
}

.category-count {
    font-size: 12px;
    color: var(--dark-grey);
}

/* Advanced Options */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.advanced-options {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--grey);
}

/* Responsive Design */
@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }

    .selection-header {
        flex-direction: column;
        align-items: stretch;
    }

    .product-grid,
    .category-grid {
        grid-template-columns: 1fr;
        max-height: 300px;
    }

    .form-actions {
        flex-direction: column;
    }

    .form-actions .btn {
        width: 100%;
    }
}
```

#### Step 3: Add Translation Keys

##### 3.1 Update en.json and vi.json
Add the following keys to both files:
```json
"Create New Promotion": "Create New Promotion",
"Description": "Description",
"Enter promotion description": "Enter promotion description",
"Fixed Amount Discount": "Fixed Amount Discount",
"Free Shipping": "Free Shipping",
"Buy X Get Y": "Buy X Get Y",
"Buy Quantity": "Buy Quantity",
"Value": "Value",
"Usage Limit": "Usage Limit",
"Unlimited": "Unlimited",
"Target Selection": "Target Selection",
"Target Type": "Target Type",
"Specific Products": "Specific Products",
"Product Categories": "Product Categories",
"Specific Sellers": "Specific Sellers",
"Rule-based Selection": "Rule-based Selection",
"Clear All": "Clear All",
"Seller": "Seller",
"Advanced Options": "Advanced Options",
"Hide": "Hide",
"Show": "Show",
"Advanced": "Advanced",
"Minimum Order Amount": "Minimum Order Amount",
"Maximum Discount Amount": "Maximum Discount Amount",
"No limit": "No limit",
"Automatically apply to new products matching criteria": "Automatically apply to new products matching criteria",
"Save as draft": "Save as draft",
"Save Draft": "Save Draft",
"Promotion created successfully!": "Promotion created successfully!",
"Promotion name is required": "Promotion name is required",
"Discount value must be greater than 0": "Discount value must be greater than 0",
"Percentage discount cannot exceed 100%": "Percentage discount cannot exceed 100%",
"Budget must be greater than 0": "Budget must be greater than 0",
"Start date is required": "Start date is required",
"Start date must be in the future": "Start date must be in the future",
"End date is required": "End date is required",
"End date must be after start date": "End date must be after start date",
"At least one product must be selected": "At least one product must be selected",
"At least one category must be selected": "At least one category must be selected"
```

### Implementation Timeline

#### Phase 4D Implementation Plan:
- **Week 1**: Admin Promotion Dashboard (Index.tsx) + basic CSS
- **Week 2**: Create/Edit/Show forms + advanced targeting
- **Week 3**: Analytics dashboard + template management
- **Week 4**: Conflict resolution + bulk operations + testing

#### Key Features to Implement:
1. **Advanced Filtering**: Status, type, date range, budget range, ROI
2. **Bulk Operations**: Mass approve/reject/pause/delete
3. **Conflict Detection**: Real-time conflict alerts
4. **Template System**: Save/load promotion templates
5. **Analytics**: Platform-wide ROI tracking
6. **Rule-based Targeting**: Dynamic product selection

#### Technical Considerations:
- **Performance**: Lazy loading for large product lists
- **Real-time**: WebSocket for status updates
- **Caching**: Redis for analytics data
- **Validation**: Complex business rule validation
- **Security**: Admin permission checks

Begin implementation with Admin/Promotions/Index.tsx and add CSS styling progressively.