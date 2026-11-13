# ShopNest — Stitch Prompt Pack

This file contains the global prompt and one prompt block per screen for Google Stitch. Read `DESIGN.md` first. The prompts are written in English for Stitch; all UI copy stays in Vietnamese exactly as provided.

## How to use

1. Create a Stitch project named `ShopNest — Nếp`.
2. Upload the existing logo from `public/image/ShopnestLogoSVG.svg`.
3. Paste the master prompt once at the start of the project.
4. Generate one screen at a time using the matching block below.
5. Request both viewports for Storefront, Auth, Customer account, and Shipper screens. Request desktop and tablet for workspaces; add mobile for Seller orders and Admin orders.
6. Name outputs `SN-<screen-id>-<viewport>`, for example `SN-S01-Home-Desktop`.
7. Keep the Vietnamese copy. Do not translate it to English.
8. If Stitch cannot use a font, preserve the weight hierarchy and proportions from `DESIGN.md`; do not fall back to a generic system serif.

---

## 00 — Master prompt

```text
You are designing ShopNest, a Vietnamese multi-role e-commerce product, using the "Nếp" design system.

ShopNest has four roles: Customer, Seller, Admin, and Shipper. It is a curated Vietnamese marketplace for the home and everyday life: broad by category but selective by seller. The launch catalog is organized around six anchor categories: Electronics & Technology, Home Appliances & Kitchen, Home & Living, Mother & Baby, Fashion & Accessories, and Beauty & Personal Care. It should feel like a Vietnamese market reinterpreted as an editorial storefront and a precise back-office ledger, not a single-category craft boutique. Avoid generic SaaS, neon gradients, glassmorphism, and template-like e-commerce layouts.

VISUAL MODES
- Storefront and Auth: editorial, airy, asymmetric. Fraunces for hero and campaign headings only; Be Vietnam Pro for product, search, category, cart, checkout, and account headings; JetBrains Mono for prices and order codes.
- Customer account: Be Vietnam Pro only. Calm, practical, no serif.
- Seller, Admin, Shipper workspaces: Be Vietnam Pro for headings and UI, JetBrains Mono for numbers. Serif is forbidden in dashboards.

CATALOG
The homepage must read as a multi-category marketplace. Show at least four anchor categories above the fold, with search as the primary discovery surface. Category tiles are warm-neutral, not rainbow-colored. Use a "Shop Việt" badge or filter where relevant. Do not turn the storefront into a pottery, handicraft, or food-only boutique.

PALETTE
Rice Paper #F6F1E6 (canvas), Warm Porcelain #FFFCF4 (surface), Raw Linen #EDE4D3 (sidebar/muted band), Ink #1D1B17 (text), Ink Muted #6B6458 (secondary text), Ink Faint #9A8F7F (metadata), Border #DCD1BE (1px lines), Lacquer Red #B23A2F (the only UI accent), Lacquer Deep #8C2A22 (hover), Lacquer Wash #F2DCD5 (active background), Jade #2F6B57 (success), Turmeric #8A5A1A (warning), Brick #8B2A24 (danger). Logo Blue #4991D8 appears only inside the existing ShopNest logo and never as a UI accent.

TYPE
Fraunces for Storefront hero/campaign and Auth display only; Be Vietnam Pro for all body/UI and for search, category, product, cart, checkout, and account headings; JetBrains Mono for prices, SKUs, order codes, timestamps, and dashboard numbers. Do not use Inter, Poppins, Montserrat, generic system serifs, or more than one icon family. Use Lucide icons with 1.75px stroke.

LAYOUT
Storefront max width 1440px, 12-column grid, asymmetric 7/5 splits for hero, product detail, and checkout. Workspace uses a 240px Raw Linen sidebar, 64px top bar, and 12-column content grid. Mobile below 768px is a single column with 16px padding and 44px minimum touch targets. No horizontal overflow. No overlapping elements. No centered hero. No three equal feature cards. KPI strips may use equal data cards, but marketing sections must be asymmetric.

SURFACES
Use Rice Paper or Warm Porcelain backgrounds. Never use pure white as the full-page background. Cards use 24–28px radius on Storefront, 12–14px in Workspace, 1px Border, and a warm diffused shadow only when elevation communicates hierarchy. Dashboards should use tables, border-top dividers, and negative space rather than a card around every block.

MOTION
Design for spring physics, stiffness 100, damping 20. Hover 150–180ms, press 90ms, section reveal 240–320ms. Stagger lists at 40ms. Use shimmer skeletons, not circular spinners. Respect reduced motion.

CONTENT
Use the exact Vietnamese copy provided in each screen brief. Use "Bạn" for customers. Prices use dot separators and đồng: 14.990.000 ₫. Dates use dd/MM/yyyy. Order codes look like #SN-24817. Product examples should span the six categories: laptop, headphones, air fryer, stroller, diaper, T-shirt, serum. Do not use a single-category artisanal catalog. No emojis. No AI clichés such as "Elevate", "Seamless", "Unleash", or "Next-Gen". No generic names such as "John Doe" or "Acme". No fake round metrics such as 99.99%.

OUTPUT
Generate a static screen with a clear visual hierarchy, one primary action, realistic Vietnamese content, and explicit states. Do not invent navigation, metrics, or features that are not in the screen brief. Do not add extra tabs or cards to fill space.
```

---

## 01 — Auth

### A01 — Login

```text
SCREEN: A01 Login
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Guest customer, seller, shipper, or admin
GOAL: Sign in quickly with email/phone/username or Google, while feeling the ShopNest brand.

LAYOUT: Split screen, not a centered card. Left 5 columns: Rice Paper panel with the ShopNest logo, a short editorial line, and a product still-life image in its own cell. Right 7 columns: Warm Porcelain form panel with generous padding. Mobile stacks the brand block above a full-width form.

SECTIONS:
- Brand panel: logo, eyebrow "Chợ nhỏ, tổ ấm", one line "Đồ thật, người thật, chuyện thật." and one image.
- Form header: "Đăng nhập" in Fraunces; supporting line "Tiếp tục với tài khoản của bạn."
- Fields: "Email, số điện thoại hoặc tên đăng nhập", "Mật khẩu". Label above; show/hide password button.
- Row: checkbox "Ghi nhớ đăng nhập" and text link "Quên mật khẩu?".
- Primary CTA: "Đăng nhập".
- Divider with "hoặc".
- Google button: "Tiếp tục với Google" with the Google mark.
- Footer: "Chưa có tài khoản?" and "Tạo tài khoản".
- Role entry links below: "Bán hàng cùng ShopNest" and "Giao hàng cùng ShopNest" as quiet text links.

STATES: inline field errors, loading button with text "Đang đăng nhập...", top error banner for invalid credentials.

CONSTRAINTS: Follow DESIGN.md and the master prompt. One primary CTA. No centered auth card. No emojis. No stock photo of a generic office.
```

### A02 — Customer register

```text
SCREEN: A02 Customer register
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: New customer
GOAL: Create an account with minimal friction and clear trust cues.

LAYOUT: Same split-screen system as A01, but the form is 7 columns and the brand panel 5 columns. Mobile stacks.

SECTIONS:
- Header: "Tạo tài khoản" (Fraunces), supporting line "Một tài khoản cho mọi đơn hàng."
- Fields: "Họ", "Tên", "Email", "Số điện thoại", "Mật khẩu", "Nhập lại mật khẩu".
- Inline password rule: "Ít nhất 8 ký tự, có chữ và số."
- Checkbox: "Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật."
- Primary CTA: "Tạo tài khoản".
- Google alternative: "Tiếp tục với Google".
- Footer: "Đã có tài khoản?" and "Đăng nhập".
- Quiet links: "Đăng ký bán hàng" and "Đăng ký giao hàng".

STATES: field errors, disabled submit until terms accepted, success redirects to email verification.

CONSTRAINTS: No walls of legal text; link to legal pages. No emojis. No centered card.
```

### A03 — Seller registration

```text
SCREEN: A03 Seller registration
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Prospective seller
GOAL: Explain the value of selling on ShopNest and collect the minimum shop information.

LAYOUT: Asymmetric 6/6 split. Left: Raw Linen panel with a 3-step seller timeline and a product still-life image. Right: Warm Porcelain form. Mobile stacks with the timeline collapsed into three inline steps.

SECTIONS:
- Left panel: eyebrow "Bán hàng cùng ShopNest"; headline "Mở shop nhỏ, chạm khách thật."; 3 steps with numbers 01/02/03: "Gửi thông tin shop", "Chờ duyệt hồ sơ", "Bắt đầu bán"; one line about fees and support.
- Right form header: "Đăng ký người bán".
- Fields: "Tên shop", "Loại hình kinh doanh", "Tỉnh/Thành phố", "Số điện thoại", "Email", "Mật khẩu", "Nhập lại mật khẩu".
- Checkbox: "Tôi đồng ý với Chính sách người bán."
- Primary CTA: "Gửi hồ sơ".
- Secondary text link: "Đã có tài khoản? Đăng nhập".
- Small trust line: "Hồ sơ được xem xét trong 1–2 ngày làm việc."

STATES: inline validation, submitting state, pending-approval confirmation screen state.

CONSTRAINTS: No fake “99% approval” claims. No emojis. No centered hero.
```

### A04 — Shipper registration

```text
SCREEN: A04 Shipper registration
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Prospective shipper
GOAL: Collect delivery profile information with a calm, practical tone.

LAYOUT: Split 6/6. Left: Rice Paper panel with a route-like editorial image and three facts about flexible shifts, local deliveries, and support. Right: form. Mobile stacks.

SECTIONS:
- Left panel: eyebrow "Giao hàng cùng ShopNest"; headline "Mỗi chuyến đi, một tổ ấm."; three factual rows with Lucide icons: "Ca linh hoạt", "Đơn trong thành phố", "Hỗ trợ khi cần".
- Form header: "Đăng ký giao hàng".
- Fields: "Họ và tên", "Số điện thoại", "Email", "Tỉnh/Thành phố", "Phương tiện", "Mật khẩu", "Nhập lại mật khẩu".
- Checkbox: "Tôi đồng ý với Điều khoản và Chính sách bảo mật."
- Primary CTA: "Gửi hồ sơ".
- Footer: "Đã có tài khoản? Đăng nhập".

STATES: validation, submitting, pending-review confirmation.

CONSTRAINTS: No mascots. No emojis. No false earnings promises.
```

### A05 — Forgot and reset password

```text
SCREEN: A05 Forgot password + reset password
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer, seller, or shipper
GOAL: Recover access without anxiety.

LAYOUT: One focused form on a Rice Paper canvas with a narrow 480px column, but not a floating centered card. A quiet brand block sits above the form, left-aligned. Mobile uses full width.

SECTIONS:
- Forgot state: header "Quên mật khẩu?" in Fraunces; supporting line "Nhập email để nhận liên kết đặt lại mật khẩu."; field "Email"; primary CTA "Gửi liên kết"; text link "Quay lại đăng nhập".
- Reset state: header "Đặt mật khẩu mới"; read-only email field; fields "Mật khẩu mới", "Nhập lại mật khẩu"; helper text "Ít nhất 8 ký tự, có chữ và số."; primary CTA "Lưu mật khẩu mới".
- Success state: a composed confirmation with a check icon, one sentence, and "Về trang đăng nhập".

STATES: sent, invalid token, expired token, success.

CONSTRAINTS: No centered card with heavy shadow. No emojis.
```

### A06 — Verify email and confirm password

```text
SCREEN: A06 Verify email + confirm password
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Authenticated customer or seller
GOAL: Complete email verification or re-confirm a password for a sensitive action.

LAYOUT: A quiet, centered composition is allowed here because the screen has one task. Use a 480px column on Rice Paper with a thin Border above the content, not a floating card.

SECTIONS:
- Verify email: icon, header "Xác thực email", line "Chúng tôi đã gửi liên kết đến email@example.com.", primary "Gửi lại email", secondary "Đổi email".
- Confirm password: header "Xác nhận mật khẩu", line "Nhập mật khẩu để tiếp tục.", field "Mật khẩu", primary "Xác nhận", secondary "Quay lại".
- Status row: "Liên kết có hiệu lực trong 60 phút."

STATES: sent, verifying, verified, expired, wrong password.

CONSTRAINTS: No emojis. One primary action. Keep copy short.
```

---

## 02 — Storefront

### S01 — Home

```text
SCREEN: S01 Home
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer / guest
GOAL: Make ShopNest feel like a broad, curated Vietnamese marketplace; help discovery through search or category, then lead to product shelves.

LAYOUT: 12-column grid. Search-first header. Asymmetric hero 7/5. Below: utility strip, six category tiles, flash sale, best sellers, suggested products, trust strip, footer. No centered hero.

SECTIONS:
- Top bar: logo, search "Tìm laptop, nồi chiên, xe đẩy...", links "Danh mục", "Khuyến mãi", "Shop Việt", "Đơn hàng", language "VI", currency "VND", account, cart with count.
- Hero: eyebrow "Mọi thứ cho tổ ấm Việt"; headline "Chọn [ảnh laptop] đồ thật kỹ, [ảnh bàn ăn] sống thật êm."; subcopy "Đồ điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm đẹp từ các shop Việt đã kiểm duyệt."; primary CTA "Xem chợ hôm nay". Right side: 2-row bento of category-spanning still-life images, each in its own cell: laptop, nồi chiên, xe đẩy, áo thun.
- Utility strip: "Freeship đơn từ 299.000 ₫", "Trả góp 0%", "Shop Việt", "Giao nhanh 2h" as four inline facts with dividers, not floating cards.
- Danh mục: six category tiles "Điện tử & công nghệ", "Gia dụng & nhà bếp", "Nhà cửa & trang trí", "Mẹ & bé", "Thời trang & phụ kiện", "Làm đẹp & chăm sóc". Each tile has a simple image or Lucide icon, not a rainbow color.
- Flash sale: asymmetric 2-column module with a countdown and a horizontal product rail; product cards: "Laptop ASUS Vivobook 14" 14.990.000 ₫, "Tai nghe Sony WH-CH720N" 2.490.000 ₫, "Nồi chiên không dầu 5L" 1.890.000 ₫.
- Best sellers: 4-up product shelf, not three equal cards. Include shop names and ratings. Example: laptop from TechNest, nồi chiên from Bếp Nhà Mình, xe đẩy from Mẹ & Bé An Nhiên, serum from Lá Beauty.
- Suggested: 4-up shelf with a "Xem tất cả" text link. Example: áo thun, bỉm quần, tai nghe, đèn bàn.
- Trust strip: "Shop đã kiểm duyệt", "Đổi trả 7 ngày", "Giao toàn quốc", "Thanh toán bảo mật".
- Footer: 4 columns, newsletter field "Nhận chuyện chợ mỗi tuần", legal links, payment marks.

STATES: logged-out and logged-in header; empty promotion state; loading shelf state.

CONSTRAINTS: Follow DESIGN.md. Multi-category marketplace, not a pottery boutique. Fraunces only for the hero/campaign headline. No emojis. No scroll arrows. No centered hero. No three equal feature cards.
```

### S02 — Search and catalog

```text
SCREEN: S02 Search and catalog
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Narrow a broad multi-category catalog quickly and confidently.

LAYOUT: Desktop: 280px filter rail left, results 8 columns right, 3-up product grid. Mobile: search bar, horizontal filter chips, 2-up product grid, filter bottom sheet.

SECTIONS:
- Header: search field with query "laptop", result count "1.248 món", sort select "Phù hợp nhất".
- Filters: Danh mục, Thương hiệu, Khoảng giá (min/max), Đánh giá, Nơi bán, Freeship, Tình trạng. Checkboxes and chips, no heavy cards.
- Active filter chips: "Điện tử & công nghệ", "ASUS", "Dưới 15 triệu" with "Xoá tất cả".
- Category quick-switch row: "Điện tử", "Gia dụng", "Nhà cửa", "Mẹ & bé", "Thời trang", "Làm đẹp"; current category selected.
- Product grid: 4:5 images, product name, shop, price, rating. Example: "Laptop ASUS Vivobook 14" 14.990.000 ₫ from TechNest, "Laptop Dell Inspiron 14" 16.490.000 ₫ from Laptop24h, "Laptop Lenovo IdeaPad Slim 5" 15.290.000 ₫ from Máy Tính Việt, "MacBook Air M2 13 inch" 22.990.000 ₫ from TechNest.
- Product card metadata: "i5 · 16GB · 512GB", "Bảo hành 24 tháng", "Shop Việt" badge.
- Empty state: "Không tìm thấy món phù hợp. Thử một từ khoá khác." plus "Xoá bộ lọc".
- Pagination: "Hiển thị 1–24 trong 1.248" with previous/next.

STATES: loading skeleton grid, no results, filter sheet open, mobile sort sheet, category switch loading.

CONSTRAINTS: No card soup. Filter rail uses border-top dividers. No emojis. Do not turn the results into a single-category craft grid.
```

### S03 — Product detail

```text
SCREEN: S03 Product detail
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Help the shopper decide within 30 seconds and add to cart with confidence, using category-specific facts.

LAYOUT: 12-column grid. Gallery 7 columns; sticky buy box 5 columns. Below: description, specification table, reviews, related products. Mobile stacks with a sticky bottom action bar.

SECTIONS:
- Breadcrumb: "Chợ / Điện tử & công nghệ / Laptop ASUS Vivobook 14".
- Gallery: one large 4:5 image, 4 thumbnails below. No carousel arrows.
- Buy box: shop "TechNest" with "Shop Việt" and verified badges; title "Laptop ASUS Vivobook 14"; rating "4,8/5 · 126 đánh giá"; price "14.990.000 ₫" and compare-at "16.490.000 ₫"; variant chips "i5 · 16GB · 512GB", "i7 · 16GB · 512GB", "Ryzen 7 · 16GB · 1TB"; quantity stepper; primary "Thêm vào giỏ"; secondary "Mua ngay"; delivery note "Giao trong 2–4 ngày tại TP.HCM"; trust notes "Bảo hành 24 tháng", "Đổi trả 7 ngày", "Shop đã kiểm duyệt".
- Description: short editorial paragraph, max 65ch; then a clean spec table with "CPU", "RAM", "Lưu trữ", "Màn hình", "Đồ họa", "Bảo hành". Use Vietnamese labels.
- Reviews: rating summary, 3 review rows with Vietnamese names and dates, "Xem tất cả đánh giá".
- Related: 4-up shelf with other laptops and accessories, not pottery.

STATES: selected variant, out-of-stock variant, added-to-cart toast, image zoom, installment note.

CONSTRAINTS: Sticky buy box must not overlap gallery. No emojis. No fake urgency countdown here. Use category-specific metadata, not generic craft copy.
```

### S04 — Cart

```text
SCREEN: S04 Cart
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Review the basket and move to checkout with clear totals.

LAYOUT: Desktop 8/4 split: line-item ledger 8 columns, sticky summary 4 columns. Mobile: stacked line items, sticky summary bar at bottom.

SECTIONS:
- Header: "Giỏ hàng" (Be Vietnam Pro, no serif), count "3 món".
- Line items: image 80x100, product name, shop, variant, quantity stepper, price, remove icon. Examples: "Laptop ASUS Vivobook 14", "i5 · 16GB · 512GB", 14.990.000 ₫ from TechNest; "Tai nghe Sony WH-CH720N", "Đen", 2.490.000 ₫ from TechNest; "Bỉm quần size L", "Gói 60 miếng", 289.000 ₫ from Mẹ & Bé An Nhiên.
- Promotion: input "Mã khuyến mãi" with "Áp dụng".
- Summary: "Tạm tính", "Giảm giá", "Phí vận chuyển" ("Tính ở bước sau"), "Tổng cộng" in JetBrains Mono; primary "Thanh toán".
- Trust line: "Shop Việt · Đổi trả 7 ngày · Thanh toán bảo mật".
- Empty state: composed illustration, "Giỏ đang trống. Chọn một món cho tổ ấm nhé.", CTA "Xem chợ hôm nay".

STATES: empty, updating quantity, invalid promo, remove confirmation.

CONSTRAINTS: One primary CTA. No card around every line item. No emojis. Use a multi-category basket, not a craft-only cart.
```

---

## 03 — Checkout

### S05 — Checkout

```text
SCREEN: S05 Checkout
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Complete delivery and payment with minimal uncertainty.

LAYOUT: Desktop 7/5 split: form and payment 7 columns, sticky order summary 5 columns. Mobile: single column with sticky total bar.

SECTIONS:
- Stepper: "Giỏ hàng" done, "Thông tin" active, "Hoàn tất" upcoming. Thin lines, no circles with numbers inside colored blobs.
- Delivery: saved address cards or address form; fields "Họ tên", "Số điện thoại", "Tỉnh/Thành phố", "Quận/Huyện", "Phường/Xã", "Địa chỉ cụ thể"; checkbox "Dùng làm địa chỉ mặc định".
- Shipping: "Giao tiêu chuẩn 2–4 ngày" selected; "Giao nhanh 1–2 ngày" optional.
- Payment: two selectable rows: "Stripe — Thẻ quốc tế" with card marks, and "COD — Thanh toán khi nhận hàng". Selected row uses Lacquer Wash and a Lacquer Red border.
- Order summary: line items "Laptop ASUS Vivobook 14" 14.990.000 ₫ and "Tai nghe Sony WH-CH720N" 2.490.000 ₫, promotion input, totals in JetBrains Mono; primary "Đặt hàng".
- Trust line: "Shop Việt · Đổi trả 7 ngày · Thanh toán bảo mật".
- Legal line: "Bằng cách đặt hàng, bạn đồng ý với Điều khoản và Chính sách bảo mật."

STATES: no saved address, invalid address, payment processing, COD confirmation.

CONSTRAINTS: No fake security badges. One primary CTA. No emojis. Do not use a centered card.
```

### S06 — Payment result and order success

```text
SCREEN: S06 Payment result / order success
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Confirm the outcome clearly and give one next action.

LAYOUT: A calm 560px column on Rice Paper, left-aligned, with a wide summary panel beneath on desktop. Not a floating card.

SECTIONS:
- Success: Jade check icon, "Đơn hàng đã được đặt", order code "#SN-24817", line "Shop sẽ xác nhận trong ít phút.", primary "Theo dõi đơn", secondary "Tiếp tục mua sắm".
- Pending: Turmeric clock icon, "Đang chờ thanh toán", line "Chúng tôi sẽ cập nhật khi Stripe xác nhận.", primary "Xem đơn hàng".
- Failure: Brick alert icon, "Thanh toán chưa hoàn tất", line "Đơn hàng vẫn được giữ trong 15 phút.", primary "Thử thanh toán lại", secondary "Chọn cách khác".
- Summary: order items "Laptop ASUS Vivobook 14" 14.990.000 ₫ and "Tai nghe Sony WH-CH720N" 2.490.000 ₫, delivery address, payment method, totals in JetBrains Mono.

STATES: success, pending, failed, COD confirmed.

CONSTRAINTS: No confetti, no emojis, no celebratory gradients.
```

---

## 04 — Customer account

### C01 — Orders list

```text
SCREEN: C01 Orders list
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Find an order and understand its current state at a glance.

LAYOUT: Customer account shell: top bar plus 220px account tabs on desktop; horizontal scroll tabs on mobile. Content uses ledger rows, not a card per order.

SECTIONS:
- Account header: "Đơn hàng của bạn" (Be Vietnam Pro, no serif), count and filter chips "Tất cả", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã huỷ".
- Order rows: order code, date, item thumbnails, item count, total, status chip, action "Xem chi tiết". Example "#SN-24817", 12/11/2026, "Laptop ASUS Vivobook 14" + 2 món, 17.480.000 ₫, "Đang giao".
- Empty state: "Chưa có đơn nào. Món đầu tiên đang chờ bạn." CTA "Xem chợ hôm nay".
- Pagination.

STATES: loading skeleton rows, empty, status filter, mobile stacked rows.

CONSTRAINTS: No serif in account area. No card soup. No emojis.
```

### C02 — Order detail and tracking

```text
SCREEN: C02 Order detail and tracking
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: See what was ordered, where it is, and what can be done next.

LAYOUT: Desktop 8/4: main order content 8 columns, sticky action panel 4 columns. Mobile: stacked, sticky bottom action bar.

SECTIONS:
- Header: "#SN-24817" in JetBrains Mono, status chip "Đang giao", date.
- Timeline: "Đã đặt", "Shop xác nhận", "Đã giao cho đơn vị vận chuyển", "Đang giao", "Đã nhận" with current step in Lacquer Red. Use vertical line and compact spacing.
- Items: "Laptop ASUS Vivobook 14", "i5 · 16GB · 512GB", 1 × 14.990.000 ₫ from TechNest; "Tai nghe Sony WH-CH720N", "Đen", 1 × 2.490.000 ₫ from TechNest. Total 17.480.000 ₫.
- Delivery: recipient, phone, address, shipping method, tracking code.
- Payment: "Stripe" or "COD", payment status.
- Actions: primary "Theo dõi đơn", secondary "Tải hoá đơn", quiet links "Yêu cầu trả hàng", "Đánh giá sản phẩm", "Mua lại".
- Support: small link "Cần hỗ trợ? Chat với TechNest".

STATES: cancelled, delivered, return requested, review available.

CONSTRAINTS: No overlapping timeline labels. No emojis.
```

### C03 — Return request and return detail

```text
SCREEN: C03 Return request + return detail
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Request a return with clear reasons and see the result.

LAYOUT: Request form 7 columns, order summary 5 columns. Return detail uses a status timeline and a two-column detail layout.

SECTIONS:
- Request header: "Yêu cầu trả hàng" for order "#SN-24817".
- Fields: "Lý do" select ("Sản phẩm không đúng mô tả", "Hư hỏng khi vận chuyển", "Không còn nhu cầu", "Khác"), "Mô tả" textarea with counter, "Ảnh/Video minh chứng" upload, "Số tiền mong muốn hoàn" read-only, "Phương thức hoàn tiền".
- Primary "Gửi yêu cầu"; secondary "Quay lại đơn hàng".
- Return detail: return code, status chip, timeline, items, reason, evidence, admin note, refund amount.
- Empty/pending states.

STATES: validation, uploading, submitted, approved, rejected, refunded.

CONSTRAINTS: No emojis. Clear consequence copy. No dark patterns.
```

### C04 — Wishlist

```text
SCREEN: C04 Wishlist
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Keep a short list of desired items and move them to cart.

LAYOUT: Account shell. 4-up product grid desktop, 2-up mobile. No card per row.

SECTIONS:
- Header: "Đã lưu" with count.
- Product cards: image, name, shop, price, "Thêm vào giỏ" secondary action, remove icon.
- Empty state: "Chưa lưu món nào. Ghé chợ và giữ lại món bạn thích." CTA "Xem chợ hôm nay".
- Sort: "Mới lưu", "Giá tăng", "Giá giảm".

STATES: empty, removed item toast, out-of-stock item.

CONSTRAINTS: No wishlist card shadows. No emojis.
```

### C05 — Address book and form

```text
SCREEN: C05 Address book + address form
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Manage delivery addresses with confidence.

LAYOUT: Account shell. Address list 8 columns, default-address explainer 4 columns. Form uses 7/5 with a small map-free location panel.

SECTIONS:
- Header: "Sổ địa chỉ", primary "Thêm địa chỉ".
- Address rows: name, phone, full address, default chip, actions "Sửa", "Đặt mặc định", "Xoá".
- Form: "Họ tên", "Số điện thoại", "Tỉnh/Thành phố", "Quận/Huyện", "Phường/Xã", "Địa chỉ cụ thể", checkbox "Đặt làm mặc định".
- Primary "Lưu địa chỉ"; secondary "Huỷ".
- Empty state: "Chưa có địa chỉ. Thêm một địa chỉ để nhận hàng."

STATES: loading provinces, dependent district/ward selects, validation, delete confirmation.

CONSTRAINTS: No map unless a real map is provided. No emojis.
```

### C06 — Profile and settings

```text
SCREEN: C06 Profile and settings
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Update personal information and security with low friction.

LAYOUT: Account shell with a 220px settings rail: "Hồ sơ", "Mật khẩu", "Giao diện". Content 8 columns, help panel 4 columns.

SECTIONS:
- Profile: avatar upload, "Họ", "Tên", "Email", "Số điện thoại", "Ngày sinh", "Giới tính"; primary "Lưu thay đổi".
- Password: "Mật khẩu hiện tại", "Mật khẩu mới", "Nhập lại mật khẩu mới"; helper text.
- Appearance: theme choices "Sáng", "Tối", "Theo hệ thống"; language "Tiếng Việt", "English"; currency "VND", "USD".
- Help panel: short security note and link to support.

STATES: saved toast, inline validation, avatar preview.

CONSTRAINTS: Sans-only. No serif. No emojis.
```

### C07 — Notifications

```text
SCREEN: C07 Notifications
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Scan updates and act on the important ones.

LAYOUT: Account shell. Single list with filters; no card per notification. A right rail on desktop can show notification preferences.

SECTIONS:
- Header: "Thông báo" with unread count, action "Đánh dấu tất cả đã đọc".
- Filters: "Tất cả", "Đơn hàng", "Khuyến mãi", "Hệ thống".
- Rows: status dot, title, one-line body, time, action link. Unread rows use Warm Porcelain; read rows use Rice Paper.
- Examples: "Đơn #SN-24817 đang giao", "Shop TechNest vừa trả lời bạn", "Ưu đãi 12% cho laptop".
- Empty state: "Chưa có thông báo. Những cập nhật mới sẽ xuất hiện ở đây."

STATES: unread, read, empty, loading rows.

CONSTRAINTS: No emojis. No toast for every row.
```

### C08 — Chat and chatbot

```text
SCREEN: C08 Chat and chatbot
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Customer
GOAL: Talk to a shop or ask the assistant for help without leaving the flow.

LAYOUT: Desktop 320px conversation list + message pane + optional order context rail. Mobile: conversation list first, then a full-screen message pane.

SECTIONS:
- List: search "Tìm cuộc trò chuyện", rows with avatar, shop name, last message, time, unread dot.
- Message pane: header with shop name and online status; messages; composer with attachment, emoji-free quick replies, send button.
- Assistant entry: a separate row "Trợ lý ShopNest" with a short capability line.
- Context rail: order code, product, status, "Xem đơn".
- Empty state: "Chọn một cuộc trò chuyện để bắt đầu."

STATES: empty, typing indicator, failed send, assistant loading.

CONSTRAINTS: No mascot. No emojis. No overlapping chat bubbles.
```

---

## 05 — Seller workspace

### V01 — Seller dashboard

```text
SCREEN: V01 Seller dashboard
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Seller
GOAL: Show the health of the shop in one scan and point to the next action.

LAYOUT: 240px Raw Linen sidebar, 64px top bar, 12-column content. KPI strip of 4 equal data cards is allowed. Below: revenue chart 8 columns, top products 4 columns; recent orders table full width; low-stock list.

SECTIONS:
- Sidebar: Tổng quan, Sản phẩm, Đơn hàng, Khuyến mãi, Ví, Shop. Active "Tổng quan" with Lacquer Wash and a 3px left bar. Role badge "Người bán".
- Top bar: shop name "TechNest", search, notifications, avatar.
- KPIs: "Doanh thu tháng" 128.460.000 ₫, "Đơn hàng" 247, "Sản phẩm đang bán" 86, "Sắp hết hàng" 12. Numbers in JetBrains Mono.
- Revenue chart: last 30 days, Lacquer Red line, no gradient; filter "30 ngày".
- Top products: 4 rows with thumbnail, name, sold count, revenue: "Laptop ASUS Vivobook 14" 42 sold, "Tai nghe Sony WH-CH720N" 86 sold, "Chuột Logitech MX Master 3S" 31 sold, "Bàn phím Keychron K2" 24 sold.
- Recent orders: table with order code, customer, total, status, date. Example "#SN-24817", "Nguyễn Thu Hà", 17.480.000 ₫, "Đang giao", 12/11/2026.
- Low stock: list with variant, stock, action "Nhập hàng": "Laptop ASUS Vivobook 14 · i5/16GB/512GB" stock 4; "Tai nghe Sony WH-CH720N" stock 7.

STATES: empty shop, loading chart, no orders.

CONSTRAINTS: Sans-only. No serif. No card around every block. No emojis.
```

### V02 — Seller products list

```text
SCREEN: V02 Seller products list
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Seller
GOAL: Manage catalog and spot problems quickly.

LAYOUT: Workspace shell. Filter bar, product table full width; bulk action bar appears when rows are selected.

SECTIONS:
- Header: "Sản phẩm", count, primary "Thêm sản phẩm".
- Filters: search, category, status, stock status; "Bộ lọc" button.
- Table columns: checkbox, product (thumbnail + name + SKU), category, price, stock, status, updated, actions.
- Rows: "Laptop ASUS Vivobook 14", SKU "LAP-AS-014", 14.990.000 ₫, 42, "Đang bán"; "Tai nghe Sony WH-CH720N", SKU "AUD-SN-021", 2.490.000 ₫, 8, "Sắp hết"; "Chuột Logitech MX Master 3S", SKU "MOU-LG-003", 2.190.000 ₫, 36, "Đang bán".
- Bulk bar: "Đã chọn 3 sản phẩm", "Cập nhật trạng thái", "Xoá".
- Pagination.

STATES: empty catalog, selected rows, low-stock filter, delete confirmation.

CONSTRAINTS: Table-first. No card per product. No emojis.
```

### V03 — Seller product create and edit

```text
SCREEN: V03 Seller product create/edit
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Seller
GOAL: Create a complete product without losing context.

LAYOUT: Two-column form: main content 8 columns, sticky publish panel 4 columns. Tabs: "Thông tin", "Biến thể", "Hình ảnh", "Mô tả".

SECTIONS:
- Header: "Thêm sản phẩm" or "Sửa sản phẩm"; breadcrumb back to products.
- Main: name VI/EN, slug, category, brand, status, short description, rich-text description.
- Category-specific attributes panel: for "Điện tử & công nghệ" show CPU, RAM, lưu trữ, màn hình, đồ họa, bảo hành; for "Gia dụng" show công suất, dung tích, bảo hành; for "Mẹ & bé" show độ tuổi, tiêu chuẩn an toàn; for "Thời trang" show chất liệu, size; for "Làm đẹp" show loại da, dung tích. The panel changes by category but keeps the same layout.
- Variants: table with variant name, SKU, price, stock, option values; add-row action. Example rows: "i5 · 16GB · 512GB", SKU "LAP-AS-014-I5", 14.990.000 ₫, 24; "i7 · 16GB · 512GB", SKU "LAP-AS-014-I7", 18.490.000 ₫, 12.
- Images: drag-and-drop zone, primary image marker, reorder, remove.
- Publish panel: status "Nháp/Đang bán/Ẩn", price summary, "Lưu nháp", primary "Lưu và đăng bán".
- Meta: SEO title, slug, description.

STATES: validation, unsaved changes warning, uploading images, missing variant, category changed warning.

CONSTRAINTS: No emojis. No giant card around the whole form. Category-specific fields must not turn the form into a different visual system.
```

### V04 — Seller orders list and detail

```text
SCREEN: V04 Seller orders list + detail
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Seller
GOAL: Process orders and update fulfilment state.

LAYOUT: List uses workspace table; detail uses 8/4 split with order items 8 columns and action panel 4 columns.

SECTIONS:
- List header: "Đơn hàng", filters "Tất cả", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã huỷ".
- Table: order code, customer, items, total, payment, status, date, action.
- Detail: order code, status, customer, delivery address, items, subtotal/shipping/total, payment method, timeline.
- Action panel: primary "Xác nhận đơn", secondary "In hoá đơn", quiet "Huỷ đơn".
- Note: "Cập nhật trạng thái sẽ gửi thông báo cho khách."

STATES: pending, confirmed, shipping, completed, cancelled, refund.

CONSTRAINTS: No emojis. No card per order row.
```

### V05 — Seller promotions list and create

```text
SCREEN: V05 Seller promotions list + create
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Seller
GOAL: Create a clear promotion and understand its cost.

LAYOUT: List table; create uses 8/4 form with a live preview and budget panel.

SECTIONS:
- List: "Khuyến mãi", primary "Tạo khuyến mãi"; table with name, type, budget, used, status, dates, actions; pause/resume.
- Create: name, type ("Giảm theo %", "Giảm số tiền", "Miễn phí vận chuyển"), value, budget, start/end date, product scope, rules.
- Preview: a small product card showing the final price; discount breakdown.
- Budget panel: "Ngân sách", "Đã dùng", "Còn lại" in JetBrains Mono.
- Primary "Tạo khuyến mãi"; secondary "Lưu nháp".

STATES: invalid date, budget exceeded, no products selected, paused.

CONSTRAINTS: No fake urgency. No emojis. No card soup.
```

### V06 — Seller wallet

```text
SCREEN: V06 Seller wallet
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Seller
GOAL: Understand balance, income, and withdrawals.

LAYOUT: KPI strip, balance panel 5 columns, transaction table 7 columns; transfer form in a side sheet.

SECTIONS:
- Header: "Ví người bán"; primary "Rút tiền".
- KPIs: "Số dư khả dụng" 24.680.000 ₫, "Đang chờ" 3.240.000 ₫, "Đã nhận tháng này" 18.920.000 ₫.
- Balance panel: account name, bank masked number, last updated.
- Transactions: date, type, reference, amount, status. Use mono for amounts.
- Transfer sheet: amount, bank account, note, fee, primary "Xác nhận rút".

STATES: insufficient balance, pending transfer, failed transfer, empty transactions.

CONSTRAINTS: No emojis. No card per transaction.
```

### V07 — Seller shop profile

```text
SCREEN: V07 Seller shop profile
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Seller
GOAL: Present the shop and keep public information accurate.

LAYOUT: 8/4 split: form 8 columns, public preview 4 columns. Sticky save bar.

SECTIONS:
- Header: "Hồ sơ shop", status chip "Đang hoạt động".
- Form: shop name, description, logo, banner, return policy, contact email, phone, address.
- Preview: a storefront card with logo, shop name, rating, product count.
- Primary "Lưu thay đổi"; secondary "Xem shop".

STATES: uploading, unsaved changes, suspended shop warning.

CONSTRAINTS: No emojis. No serif. No card soup.
```

---

## 06 — Admin workspace

### D01 — Admin dashboard

```text
SCREEN: D01 Admin dashboard
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: See marketplace health and urgent operational work.

LAYOUT: 240px sidebar, 64px top bar, KPI strip, charts/tables. Dense but calm.

SECTIONS:
- Sidebar: Tổng quan, Phân tích, Sản phẩm, Đơn hàng, Tồn kho, Khuyến mãi, Người dùng, Shop, Trả hàng, Shipper, Danh mục. Active "Tổng quan".
- KPIs: "GMV tháng" 4.820.000.000 ₫, "Đơn hàng" 8.412, "Shop chờ duyệt" 17, "Tồn kho thấp" 42.
- Revenue chart 8 columns; category mix 4 columns with "Điện tử & công nghệ 38,4%", "Gia dụng & nhà bếp 22,1%", "Nhà cửa & trang trí 14,7%", "Mẹ & bé 11,2%", "Thời trang 8,9%", "Làm đẹp 4,7%".
- "Việc cần xử lý" list: shop approvals, returns, low-stock alerts, flagged reviews.
- Recent orders table: code, customer, shop, total, status, date. Example "#SN-24817", "Nguyễn Thu Hà", "TechNest", 17.480.000 ₫, "Đang giao", 12/11/2026.
- Top shops: "TechNest" 1.284.000.000 ₫, "Bếp Nhà Mình" 842.000.000 ₫, "Mẹ & Bé An Nhiên" 617.000.000 ₫; columns GMV, orders, rating.

STATES: empty queue, loading charts, error banner.

CONSTRAINTS: Sans-only. No serif. No card soup. No emojis.
```

### D02 — Admin analytics

```text
SCREEN: D02 Admin analytics
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Compare revenue, orders, users, and product performance over time.

LAYOUT: Filter bar, KPI strip, 8/4 charts, full-width table. Tabs: "Doanh thu", "Người dùng", "Sản phẩm", "Đơn hàng", "Báo cáo".

SECTIONS:
- Filters: date range "01/10/2026–12/11/2026", comparison "Kỳ trước", segment, shop, category.
- KPIs: revenue, orders, AOV, conversion.
- Charts: revenue line, orders bar, category mix; no gradients.
- Table: product/shop/period rows with revenue, orders, refund rate, growth.
- Export button "Xuất CSV".

STATES: loading, no data for range, partial data warning.

CONSTRAINTS: Numbers in JetBrains Mono. No emojis.
```

### D03 — Admin products list and detail

```text
SCREEN: D03 Admin products list + detail
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Moderate catalog quality and resolve product issues.

LAYOUT: List table; detail 8/4 with product summary and moderation panel.

SECTIONS:
- List: search, filters shop/category/status, table with product, shop, price, stock, status, updated, actions.
- Detail: gallery, product info, variants, shop, category, status, moderation history.
- Moderation panel: status select, reason textarea, primary "Cập nhật trạng thái", secondary "Yêu cầu chỉnh sửa".
- Related: reports/flags list.

STATES: pending approval, rejected, hidden, flagged.

CONSTRAINTS: No emojis. No card per row.
```

### D04 — Admin orders list and detail

```text
SCREEN: D04 Admin orders list + detail
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Resolve order exceptions and coordinate fulfilment.

LAYOUT: List table; detail 8/4 with timeline, payment, shipping, and admin actions.

SECTIONS:
- List: filters status, payment, shop, date; table with code, customer, shop, total, status, payment, date.
- Detail: order summary, items, customer, delivery, payment, timeline, notes.
- Actions: assign shipper, refund, cancel, add internal note.
- Confirmation modal for refund/cancel.

STATES: pending assignment, delivering, refunded, cancelled, failed payment.

CONSTRAINTS: No emojis. No card soup.
```

### D05 — Admin inventory list, report, history

```text
SCREEN: D05 Admin inventory list + report + history
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Keep stock healthy across sellers and spot shrinkage.

LAYOUT: Tabs "Tồn kho", "Báo cáo", "Lịch sử". List uses table; report uses summary cards plus charts; history is a ledger table.

SECTIONS:
- List: filters seller/category/stock status, table with product, variant, SKU, stock, reserved, status, updated. Examples: "Laptop ASUS Vivobook 14", "i5 · 16GB · 512GB", stock 4, "Sắp hết"; "Tai nghe Sony WH-CH720N", "Đen", stock 8, "Sắp hết"; "Nồi chiên không dầu 5L", "5L", stock 26, "Đang bán".
- Report: KPIs "Tổng tồn", "Sắp hết", "Hết hàng", "Tồn lâu"; charts by seller/category across Điện tử, Gia dụng, Nhà cửa, Mẹ & bé, Thời trang, Làm đẹp; export CSV.
- History: date, variant, change, reason, user, note. Example "12/11/2026", "LAP-AS-014-I5", "-2", "Bán hàng", "Nguyễn Thu Hà", "#SN-24817".
- Actions: stock in, stock out, bulk update.

STATES: empty, low-stock filter, export loading.

CONSTRAINTS: Numbers monospaced. No emojis.
```

### D06 — Admin promotions

```text
SCREEN: D06 Admin promotions
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Manage platform promotions and seller participation.

LAYOUT: List table; create/edit uses 8/4 with rules and preview.

SECTIONS:
- List: name, type, scope, budget, used, status, dates, actions.
- Create: name, type, value, budget, schedule, scope, rules, auto-apply toggle.
- Rules builder: conditions and benefits in a vertical list, not a card per rule.
- Preview: example product price and discount.
- Primary "Tạo khuyến mãi"; secondary "Lưu nháp".

STATES: invalid rule, budget exceeded, paused, scheduled.

CONSTRAINTS: No emojis. No card soup.
```

### D07 — Admin users

```text
SCREEN: D07 Admin users
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Manage accounts, roles, and account status.

LAYOUT: Table with filters; edit uses a 7/5 layout.

SECTIONS:
- List: search, role filter, status filter, table with user, email, role, shop, status, joined, actions.
- Edit: profile, roles, status, shop linkage, notes.
- Actions: activate, suspend, reset password, view activity.

STATES: suspended, pending verification, admin role warning.

CONSTRAINTS: No emojis. No card per user.
```

### D08 — Admin shops and approvals

```text
SCREEN: D08 Admin shops + approvals
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Approve trustworthy shops and handle violations.

LAYOUT: Tabs "Tất cả", "Chờ duyệt", "Tạm ngưng". Table with shop, owner, category, status, GMV, joined. Detail uses 8/4.

SECTIONS:
- List: filters, bulk approve/reject, table.
- Detail: shop profile, documents, owner, metrics, violations, audit log.
- Decision panel: approve, reject with reason, suspend with duration.
- Confirmation modal.

STATES: pending, approved, rejected, suspended, violation added.

CONSTRAINTS: No emojis. No card soup.
```

### D09 — Admin returns

```text
SCREEN: D09 Admin returns
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Resolve return requests consistently.

LAYOUT: List table; detail 8/4 with request, order, evidence, and decision panel.

SECTIONS:
- List: filters status/date/shop, table with return code, order, customer, amount, status, date.
- Detail: return reason, description, evidence, items, order summary, timeline.
- Decision panel: status select, admin note, refund amount, primary "Cập nhật".
- Confirmation for refund/reject.

STATES: pending, approved, rejected, refunded, exchanged.

CONSTRAINTS: No emojis. No card per request.
```

### D10 — Admin shippers

```text
SCREEN: D10 Admin shippers
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Manage shipper accounts and capacity.

LAYOUT: Table with filters; detail 8/4 with profile, documents, and activity.

SECTIONS:
- List: search, status filter, table with shipper, phone, area, status, delivered, rating.
- Detail: profile, vehicle, documents, assigned orders, activity, status.
- Actions: approve, suspend, reactivate.

STATES: pending, active, suspended, rejected.

CONSTRAINTS: No emojis. No card soup.
```

### D11 — Admin categories and brands

```text
SCREEN: D11 Admin categories + brands
VIEWPORTS: desktop 1440x1024; tablet 1024x768
ROLE: Admin
GOAL: Keep the catalog taxonomy clean.

LAYOUT: Two tabs, each with a table and a side form. No card per row.

SECTIONS:
- Categories: table with name VI/EN, parent, products, status, order. Examples: "Điện tử & công nghệ" 1.284 sản phẩm, "Gia dụng & nhà bếp" 842, "Nhà cửa & trang trí" 517, "Mẹ & bé" 396, "Thời trang & phụ kiện" 274, "Làm đẹp & chăm sóc" 188. Create/edit form with name, slug, parent, image, status.
- Brands: table with name, logo, products, status. Examples: ASUS, Sony, Logitech, Philips, Coolmate, La Roche-Posay. Create/edit form.
- Actions: restore, force delete, reorder.

STATES: empty, archived, restore confirmation.

CONSTRAINTS: No emojis. No card soup.
```

---

## 07 — Shipper workspace

### H01 — Shipper dashboard

```text
SCREEN: H01 Shipper dashboard
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Shipper
GOAL: See today's deliveries and the next action.

LAYOUT: 240px sidebar, top bar, KPI strip, delivery list. Mobile uses a single column with a sticky "Mở tuyến" action.

SECTIONS:
- Sidebar: Tổng quan, Chuyến giao, Lịch sử. Active "Tổng quan".
- KPIs: "Đơn hôm nay" 8, "Đã giao" 3, "Đang giao" 2, "Thu nhập tuần" 1.240.000 ₫.
- Delivery list: order code, customer, address, time window, status, action "Xem".
- Route summary: simple ordered stops with numbers, no map required.
- Empty state: "Hôm nay chưa có chuyến. Chúng tôi sẽ báo khi có đơn."

STATES: no deliveries, in-progress, completed, failed delivery.

CONSTRAINTS: Sans-only. No emojis. No fake map if no map data.
```

### H02 — Shipper delivery detail

```text
SCREEN: H02 Shipper delivery detail
VIEWPORTS: mobile 390x844; tablet 1024x768
ROLE: Shipper
GOAL: Complete a delivery with the fewest possible taps.

LAYOUT: Single column, sticky bottom action bar.

SECTIONS:
- Header: order code, status, time window.
- Customer: name, phone, address, note; actions "Gọi", "Mở bản đồ" if a real map link exists.
- Order: item count, cash-to-collect if COD, delivery note.
- Steps: "Đã đến", "Đã giao", "Không giao được" with reason.
- Primary "Xác nhận đã giao"; secondary "Báo không giao được".
- Proof: photo upload, recipient name, note.

STATES: COD amount, failed delivery reason, uploading proof, success.

CONSTRAINTS: 44px targets. No emojis. No fake map.
```

---

## 08 — System states

### X01 — Empty states

```text
SCREEN: X01 Empty states
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: All roles
GOAL: Make empty screens feel composed and actionable.

LAYOUT: One composition per state; use a simple line illustration or a still-life crop, one sentence, one action. No generic "No data".

SECTIONS:
- Cart empty: "Giỏ đang trống. Chọn một món cho tổ ấm nhé." CTA "Xem chợ hôm nay".
- Orders empty: "Chưa có đơn nào. Món đầu tiên đang chờ bạn." CTA "Xem chợ hôm nay".
- Search empty: "Không tìm thấy món phù hợp. Thử một từ khoá khác." CTA "Xoá bộ lọc".
- Seller products empty: "Chưa có sản phẩm. Thêm món đầu tiên để mở shop." CTA "Thêm sản phẩm".
- Admin queue empty: "Không còn việc cần xử lý." secondary "Xem tất cả".
- Notifications empty: "Chưa có thông báo. Những cập nhật mới sẽ xuất hiện ở đây."

CONSTRAINTS: No emojis. No sad-face illustrations. No generic database icons.
```

### X02 — Loading skeletons

```text
SCREEN: X02 Loading skeletons
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: All roles
GOAL: Preserve layout while data loads.

LAYOUT: Show skeletons that match the final layout dimensions for product grids, tables, charts, and order rows.

SECTIONS:
- Product grid skeleton: 4 cards with 4:5 image blocks and two text lines.
- Table skeleton: header plus 6 rows with aligned columns.
- Chart skeleton: axis blocks plus a shimmering line area.
- Detail skeleton: gallery, title, price, CTA.

CONSTRAINTS: Warm shimmer, not gray. No circular spinners. No layout shift.
```

### X03 — Error, 404, 500

```text
SCREEN: X03 Error, 404, 500
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: All roles
GOAL: Explain what happened and offer a clear recovery.

LAYOUT: Left-aligned 560px composition on Rice Paper; no centered card.

SECTIONS:
- 404: "Không tìm thấy trang này." line "Đường dẫn có thể đã đổi hoặc không còn tồn tại." primary "Về trang chủ".
- 500: "Có gì đó chưa ổn." line "Chúng tôi đang kiểm tra. Thử lại sau ít phút." primary "Thử lại", secondary "Về trang chủ".
- Inline error: "Không tải được dữ liệu. Thử lại sau ít phút." with retry.

CONSTRAINTS: No emojis. No stack traces. No giant error codes as decoration.
```

### X04 — Modals, toasts, confirmations

```text
SCREEN: X04 Modals, toasts, confirmations
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: All roles
GOAL: Handle destructive and async actions without ambiguity.

LAYOUT: Modal 480px/640px, 24px radius; mobile bottom sheet. Toast bottom-right desktop, bottom-center mobile.

SECTIONS:
- Destructive modal: title "Xoá sản phẩm?", body "Sản phẩm sẽ bị ẩn khỏi shop. Bạn có thể khôi phục sau.", primary "Xoá sản phẩm", secondary "Giữ lại".
- Success toast: "Đã lưu thay đổi." with undo if possible.
- Error toast: "Không thể lưu. Thử lại."
- Confirmation modal: one consequence sentence, one primary, one secondary.

CONSTRAINTS: No emojis. No glow. One primary action.
```

### X05 — Legal pages

```text
SCREEN: X05 Legal pages
VIEWPORTS: desktop 1440x1024; mobile 390x844
ROLE: Public
GOAL: Make terms, privacy, and selling policy readable.

LAYOUT: Editorial reading page: 720px text column, 200px table of contents on desktop, no cards. Fraunces for the page title, Be Vietnam Pro for body.

SECTIONS:
- Header: "Điều khoản sử dụng", "Chính sách bảo mật", or "Chính sách người bán"; last updated date.
- Table of contents with anchor links.
- Body: h2/h3, paragraphs max 65ch, lists, callout for important changes.
- Footer: contact and related legal links.

CONSTRAINTS: No emojis. No dense legal walls; use spacing and hierarchy.
```

---

## End note

For every screen: follow `DESIGN.md`, use the exact Vietnamese copy, keep one accent, one primary action, and one icon family. The storefront must read as a multi-category marketplace, not a single-category boutique. If Stitch produces a generic e-commerce layout, regenerate with the constraint that the hero must be asymmetric, product shelves must be editorial, search must be prominent, and dashboards must be table-led.
