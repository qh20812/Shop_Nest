# ShopNest — Kế hoạch refactor toàn bộ UI sang CSS thuần

> **Direction:** BẢNG HIỆU (signage / industrial catalog)
> **Branch:** `refactor/ui-web`
> **Trạng thái:** Phase 0, 1, 2A, 2B, 2C, 3, 4, 5, 6 hoàn tất; **Phase 7 hoàn tất** (2026-11-24) — 10 page Seller + 7 wrapper dùng chung, allowlist **57 → 42**, 139 key `vi` + 101 key `en` mới. Phase 8 chưa build. Chi tiết ở §15.
> **Phạm vi:** toàn bộ UI React/Inertia + email template + error pages + PDF/invoice (tạo mới có điều kiện)
> **Ngoài phạm vi:** backend, route, props Inertia, nghiệp vụ, schema, seed, API

**Mục lục:** [0 Tóm tắt](#0-tóm-tắt-điều-hành) · [1 Quyết định](#1-quyết-định-đã-chốt) · [2 Hiện trạng](#2-hiện-trạng-đo-được) · [3 Direction](#3-direction-bảng-hiệu) · [4 Token](#4-hệ-thống-token) · [5 Kiến trúc code](#5-kiến-trúc-code-và-quy-ước-component) · [6 Design gate](#6-design-gate-3-skill-hợp-nhất) · [7 Lộ trình](#7-lộ-trình-12-phase) · [8 Thứ tự trang](#8-thứ-tự-trang-chi-tiết) · [9 Mapping](#9-mapping-primitive-cũ--mới) · [10 Kiểm chứng](#10-kiểm-chứng) · [11 Rủi ro](#11-rủi-ro-và-cách-giảm) · [12 Không làm](#12-việc-không-làm) · [13 Commit](#13-thứ-tự-commit-đề-xuất) · [14 Checklist](#14-phụ-lục--checklist-nhanh-cho-người-triển-khai) · [15 Nhật ký](#15-nhật-ký-cập-nhật)

---

## 0. Tóm tắt điều hành

### 0.1 Mục tiêu

1. Loại bỏ **hoàn toàn** Tailwind khỏi runtime, build và tooling.
2. Thay bằng CSS thuần có kiến trúc: token 2 tầng + primitive toàn cục + CSS Modules cho page.
3. Thống nhất 4 role (customer, seller, admin, shipper) trên **một** hệ thống thị giác duy nhất.
4. Xoá nợ kỹ thuật: `Page.css` (62 KB), `legacy-tokens.css`, `.dark`, Boxicons, `tailwind.config.ts`, `components.json`, `postcss.config.js`, shadcn alias.
5. Đưa dark mode thành hạng nhất (token override, không phải bản vá).
6. Áp bộ lọc chống "AI slop" và luật thẩm mỹ ở mọi phase, không chỉ ở trang chủ.

### 0.2 Kết quả bàn giao

| Hạng mục    | Kết quả                                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------- |
| CSS runtime | 1 entry `resources/css/app.css`, không Tailwind, không `@apply`, không `@theme`                 |
| Token       | `--sn-*` 2 tầng, đầy đủ trong `resources/css/tokens/`                                           |
| Component   | 47 primitive toàn cục (37 ở Phase 2 + 10 legacy defer), dùng class `sn-*`, variant qua `data-*` |
| Page        | 79 page dùng `*.module.css`, không còn class Tailwind                                           |
| Dark mode   | `[data-theme='dark']`, đủ token, không FOUC                                                     |
| Workspace   | `WorkspaceLayout` mới thay `layouts/app/AppLayout`, icon Lucide                                 |
| Tooling     | `scripts/check-tokens.mjs` viết lại thành guardrail CSS thuần                                   |
| Docs        | `DESIGN.md`, `COMPONENTS.md` viết lại; tài liệu cũ lỗi thời được xoá/archived                   |

### 0.3 Nguyên tắc bất biến

1. **Không đổi hợp đồng dữ liệu.** Route name, URL, props Inertia, payload, validation giữ nguyên.
2. **Không thêm tính năng.** Refactor thuần; mọi ý tưởng mới ghi vào backlog.
3. **Một nguồn màu duy nhất.** Không hex trong `.tsx`, không hex trong component CSS; chỉ trong `tokens/primitive.css`.
4. **Một accent duy nhất.** Cam đất `--sn-accent-600`. Không accent thứ hai cho role/category.
5. **Không class Tailwind mới** kể từ Phase 0. Tailwind bị đóng băng, gỡ ở Phase 11.
6. **Không inline style cho màu/khoảng cách.** Chỉ dùng inline style cho giá trị động (progress, transform theo toạ độ) qua custom property.
7. **Mỗi phase là một đơn vị merge được.** Không trộn phase, không merge khi chưa qua DoD.

### 0.4 Độ phức tạp

| Phase | Nội dung                                  |  Cỡ | File chạm |
| ----- | ----------------------------------------- | --: | --------: |
| 0     | Baseline + đóng băng + guardrail          |   S |       ~10 |
| 1     | Token + reset + dark mode                 |   L |       ~14 |
| 2     | 37 primitive dùng chung + 10 legacy defer |  XL |       ~56 |
| 3     | 4 shell/layout + tách reset Page.css      |   L |       ~26 |
| 4     | Storefront                                |   L |       ~35 |
| 5     | Auth                                      |   M |       ~14 |
| 6     | Customer + Settings                       |  XL |       ~66 |
| 7     | Seller                                    |   L |       ~29 |
| 8     | Admin                                     |  XL |       ~55 |
| 9     | Shipper                                   |   S |        ~4 |
| 10    | Email, error pages, PDF                   |   M |       ~12 |
| 11    | Gỡ Tailwind + dọn nợ                      |   M |       ~15 |
| 12    | QA sweep                                  |   L |   toàn bộ |

### 0.5 Design read & dials

**Design read:** "Đọc đây là: marketplace đa ngành cho người mua Việt và ba vai trò vận hành, với ngôn ngữ bảng hiệu/catalogue in (nền giấy lạnh, một accent cam đất, đường kẻ thay bóng đổ), đi theo token tự dựng + CSS thuần, không Tailwind."

**Dials** (theo `design-taste-frontend`, đã hạ motion vì đây là UI giao dịch, không phải landing page):

| Khu vực          | `DESIGN_VARIANCE` | `MOTION_INTENSITY` | `VISUAL_DENSITY` | Lý do                                                        |
| ---------------- | ----------------: | -----------------: | ---------------: | ------------------------------------------------------------ |
| Storefront       |                 8 |                  5 |                4 | Catalogue bất đối xứng, ảnh dẫn dắt; motion chỉ hover/reveal |
| Auth             |                 6 |                  4 |                3 | Split 6/6, form là trung tâm; không cần chuyển động          |
| Customer account |                 5 |                  4 |                5 | Rail + bảng đơn; ưu tiên rõ hơn đẹp                          |
| Seller           |                 4 |                  3 |                7 | Bảng, form, KPI; gần như tĩnh                                |
| Admin            |                 3 |                  3 |                8 | Ledger dày nhất; không card soup, số tabular                 |
| Shipper          |                 4 |                  3 |                6 | Mobile-first, tap target lớn                                 |

Khác biệt so với baseline `8 / 6 / 4` của skill: **motion thấp hơn** vì mỗi animation phải có lý do (feedback hoặc state transition), và **density cao hơn** ở workspace vì đó là công cụ làm việc, không phải trang giới thiệu.

---

## 1. Quyết định đã chốt

| #   | Quyết định     | Giá trị                                                                                                                                                                                       |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hướng thẩm mỹ  | **A — BẢNG HIỆU**, hướng mới hoàn toàn                                                                                                                                                        |
| 2   | Kiến trúc CSS  | **Hybrid**: primitive global + CSS Modules cho page/domain layout                                                                                                                             |
| 3   | Token          | **2 tầng**: primitive → semantic, prefix `--sn-`                                                                                                                                              |
| 4   | Thứ tự         | Nền tảng → Storefront → Auth → Customer → Seller → Admin → Shipper                                                                                                                            |
| 5   | Dark mode      | **Giữ**, làm bằng token override ngay từ Phase 1                                                                                                                                              |
| 6   | Workspace cũ   | **Rebuild sạch**, xoá `Page.css` + Boxicons                                                                                                                                                   |
| 7   | Gỡ Tailwind    | **Đóng băng → gỡ ở Phase 11**                                                                                                                                                                 |
| 8   | Dependency     | Bỏ `tailwindcss`, `@tailwindcss/*`, `tailwind-merge`, `tailwindcss-animate`, `cva`, `clsx`                                                                                                    |
| 9   | Kiểm chứng     | `build` + `types` + `lint` + `check:tokens` + review thủ công                                                                                                                                 |
| 10  | Quyền thay đổi | Toàn quyền bố cục, section, nhãn điều hướng, copy tiếng Việt trong UI                                                                                                                         |
| 11  | Phạm vi file   | React UI + email + error pages + PDF (tạo mới nếu bật)                                                                                                                                        |
| 12  | Page.css reset | **Gói 6 block toàn cục** (`*`, `a`, `li`, `html`, `body`, `body.dark`) vào `@layer sn-legacy-reset` đứng **đầu** danh sách layer; phần còn lại của Page.css vẫn unlayered. Xoá hẳn ở Phase 11 |
| 13  | `base/*.css`   | **Scope `.sn-shell`** cho rule element-level (`body`, `a`, `label`) đến Phase 11; class/primitive vẫn dùng toàn cục                                                                           |
| 14  | Workspace DOM  | Giữ `<div class="content"><main>` cho 66 selector của Page.css; **sidebar 230px**; sidebar mới dùng class riêng, z-index thấp hơn `--sn-z-modal`                                              |
| 15  | Topbar         | Giữ **đủ** chức năng của `navbar.tsx`: breadcrumb, search, chuông + polling, LanguageSwitcher, avatar menu, logout, theme toggle                                                              |
| 16  | Nav shipper    | **Rút còn Dashboard + Cài đặt**; 6 href chưa có route ghi backlog. Alias `shipper` vẫn sửa ở Phase 9                                                                                          |
| 17  | Auth panel     | **Bỏ "số liệu thật" + ảnh picsum**; panel là editorial: logo, eyebrow, headline, mô tả, 3 trust point, hotline/email                                                                          |
| 18  | Breakpoints    | **Thêm mốc 640** (`sm`), dồn thang: `xs 480 / sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1440`                                                                                                 |
| 19  | `UtilityStrip` | **Bỏ khỏi Home Phase 4**, giữ file + allowlist đến Phase 11; header đã có locale/currency, TrustStrip phủ 4 fact                                                                             |
| 20  | Git            | Commit riêng 2A/2B/2C trước Phase 3; `git mv` 7 file `components/ui` về chữ thường để CI Linux không fail                                                                                     |
| 21  | Theme pin      | `StorefrontLayout` nhận prop `pinLight` ở **root**; 8 trang Phase 4 truyền `pinLight={false}`; `AccountLayout`, `Cart`, `Checkout`, `PaymentResult` giữ `pinLight` mặc định `true` đến Phase 6. `Settings/Appearance` xử lý riêng để không khoá theme |
| 22  | Pagination DOM | Đổi 2 nhánh `<nav>` của `Pagination` sang `<div role="navigation" aria-label="Phân trang">` để thoát `.content nav` unlayered của `Page.css`; không sửa thêm `Page.css` |
| 23  | UtilityStrip   | **Bỏ khỏi Home Phase 4**; giữ file + allowlist như dead code đến Phase 11. Header đã có locale/currency, TrustStrip đã phủ 4 fact |
| 24  | Voucher band   | **Bỏ khỏi spec Phase 4** vì `Home/Index` không có prop voucher; ghi backlog, không thêm band tĩnh hoặc số liệu giả |
| 25  | WorkspaceTopbar| **Điều chỉnh plan theo hiện trạng**: breadcrumb nằm ở `PageHeader`; search desktop; toggle sidebar chỉ mobile; desktop collapse để Phase 11. Không coi là thiếu DoD Phase 3 |
| 26  | Base scope     | Thu hẹp `base/typography.css` + `base/forms.css` về đúng `.sn-shell` / `.sn-shell a` / `.sn-shell label`; heading/form element-level để primitive xử lý. Reset + a11y giữ toàn cục |
| 27  | Home sections  | Giữ `BrandSpotlight` + `EditorialPillars` nhưng redesign: bỏ `01/02/03`, bỏ badge trùng eyebrow, bỏ câu/số liệu slop. Bỏ `UtilityStrip` khỏi Home |
| 28  | Data authenticity | Bỏ badge “Shop Việt” / “Đã mua” và mọi số liệu `1.200+`, `100%`, `299.000 ₫`, `3 phút`, `2h` nếu không có prop/DB xác thực. Chỉ giữ claim không số |
| 29  | Phase 3 hotfix | Trước Phase 4: (1) thêm nền `var(--sn-color-canvas)` cho `.sn-storefront__main` hoặc pin root đúng cách; (2) đổi Pagination sang `div role=navigation`; (3) scope `base/*`; (4) chụp/so 5 trang legacy; (5) smoke 4 layout + modal trên sidebar |
| 30  | Docs tạm xoá   | Khôi phục `PROMPT.md`, `STITCH-DESIGN.md`, `DESIGN-02.md`; chỉ xoá/archived ở Phase 11. Không đưa các xoá này vào commit Phase 3 |
| 31  | Phase 4 thêm   | Thêm `commerce/Countdown.tsx` vào phạm vi Phase 4 (dependency của `FlashSaleModule`). `check-tokens.mjs` phải quét thêm `resources/js/**/*.module.css` trước khi Phase 4 dùng module CSS |
| 32  | Phase 5 scope  | **8 page**: 7 page cũ + `Auth/ConfirmPassword` tạo mới (~40 dòng, trên `AuthLayout variant="centered"`, không đổi route/props). Thêm `components/feedback/ResultState.tsx` vào Phase 5 vì `VerifyEmail` phụ thuộc và `PaymentResult` sẽ dùng lại ở Phase 6. Allowlist 112 → **104** (7 entry Auth + `ResultState`) |
| 33  | Password strength | Viết lại `password-strength` dùng primitive `Progress` **1 thanh** + nhãn chữ; xoá khối `.sn-password*` trong `field.css`. Không giữ 4 thanh segmented 3 màu |
| 34  | Auth form width | `Login`, `ForgotPassword`, `ResetPassword`, `VerifyEmail`, `ConfirmPassword` giữ `--sn-container-form` (420 px); `Register`, `SellerRegister`, `ShipperRegister` dùng biến thể rộng `--sn-container-form-wide` (**600 px**) để grid 2 cột không bị bóp còn ~200 px/ô |
| 35  | Auth panel    | Trust point **không số**: "Shop đã kiểm duyệt", "Đổi trả theo chính sách", "Hỗ trợ qua hotline". Bỏ `7 ngày`, `24/7`, "Shop Việt đã kiểm duyệt" (không có nguồn trong Legal, trái #28). Bỏ props chết `imageUrl`/`imageAlt`, bỏ `serif`, tối đa 4 phần tử chữ (bỏ label role trùng eyebrow hoặc bỏ tagline) |
| 36  | Auth theme    | Auth **không pin light**; sau migrate phải đạt cả light và dark, kiểm bằng computed color (không chỉ nhìn ảnh). Hiện `text-ink` ở heading section đo được `rgb(29,27,23)` trên nền `rgb(13,15,12)` |
| 37  | Auth a11y     | Nút hiện/ẩn mật khẩu dùng `IconButton` (bỏ `focus-ring`/`rounded-chip` legacy); `FileDropzone` nhận `label`/`aria-label` theo từng field (3 dropzone hiện dùng chung một label); đồng bộ validate client `Register` với regex của `RegisterRequest` (hoa/thường/số/ký tự đặc biệt) |
| 38  | Auth props    | `Login` khai báo `canResetPassword` + `status` do `AuthenticatedSessionController::create` truyền; hiện flash `status`, ẩn link "Quên mật khẩu?" khi route không tồn tại. Không đổi payload/route |
| 39  | Git trước Phase 5 | Commit **tách riêng** phần backend/route/test đang dở (52 file working tree, gồm `routes/{web,user}.php`, controllers, factories, seeders, 2 page Phase 4) trước khi build Phase 5. Không trộn vào commit UI, giữ nguyên tắc “mỗi phase là một đơn vị merge được” |
| 40  | Checkout address | **Sửa trong Phase 6**: `CheckoutAddressForm` gọi `/user/addresses/provinces` + `/user/addresses/wards/{provinceId}` (bỏ cấp quận/huyện); `Checkout` submit bằng `axios.post('/user/addresses')` và coi response resolved là thành công (controller luôn redirect về danh sách địa chỉ), sau đó `router.reload({ only: ['addresses'] })`. Không dùng Inertia router vì sẽ điều hướng khỏi Checkout. Không đổi backend/route |
| 41  | Phase 6 scope | **16 page + 2 component** trong `pages/` (`Address/AddressForm`, `Settings/SettingsTabs`); thêm vào scope `feedback/ConfirmDialog`, `CheckoutExitConfirmation`, `PaymentMarks`; `CheckoutAddressForm` đã có trong plan nhưng phải sửa luồng (xem #40); `chat/*` là 12 component + `hooks/useChatConversations.ts` |
| 42  | Phase 6 data authenticity | Áp #28 trong Phase 6 **và sửa Phase 4 leftover**: bỏ `shopName: 'Shop Việt'`, trust `Shop Việt`/`Đổi trả 7 ngày`/`Hỗ trợ 24/7`, `Giao 2–4 ngày`, `phí kiểm định`; sửa `OrderSummary`, `BuyBox`, `ProductDetail`. Chỉ giữ claim không số |
| 43  | Mobile summary | `OrderSummary` dùng `<details>/<summary>` native trên mobile; desktop giữ `lg:sticky` |
| 44  | Commerce dead code | **Migrate luôn** `ReturnItemPicker`, `RefundOption`, `PreferenceRow` (0 importer) trong Phase 6 để allowlist về 57; không xoá file |
| 45  | Phase 6 theme | **Bỏ pin toàn bộ**: `AccountLayout` nhận `pinLight`; `Cart`/`Checkout`/`PaymentResult` truyền `false`; sau Phase 6 đổi `StorefrontLayout` default `pinLight` → `false` (giữ prop đến Phase 11) |
| 46  | Appearance | Xoá `Alert` “Giao diện tối đang thử nghiệm”; thêm panel preview bằng chính token (canvas/text/accent/border) cho 3 lựa chọn |
| 47  | Phase 6 allowlist | 104 → **57** (13 Customer + 4 Settings + 17 commerce + 12 chat + `ConfirmDialog`); `check:css` pass thực tế **227 file checked, 57 allowlisted** (sau khi commit Phase 6) |
| 48  | Phase 7 scope | **Bám code thực tế**: 10 page (`Dashboard`, `Products/{Index,Create,Edit,Show}`, `Orders/{Index,Show}`, `Promotions/{Index,Create}`, `Shop/Edit`). Bỏ khỏi spec các mục không tồn tại: chart Dashboard, bulk action Products, status tabs Orders, preview Promotions, preview card Shop. Không thêm tính năng |
| 49  | Phase 7 i18n | Bổ sung key `vi.json` + `en.json` cho key `t()` hiện có; chuyển `$` + `en-US` ở Orders sang `formatVnd` + `vi-VN`; giá dùng `1.290.000 ₫`; giữ `useTranslation`. **Thực tế:** 139 key `vi` + 101 key `en` |
| 50  | Phase 7 Promotions | **Ẩn/disable** action Xem + Sửa trong `Promotions/Index` (trỏ `Promotions/Show` và `Promotions/Edit` không tồn tại); giữ pause/resume/delete. Không tạo page mới |
| 51  | Phase 7 cross-phase | Migrate trong Phase 7: `ui/insights`, `ui/confirmation-modal`, `admin/users/Toast`, `admin/products/ProductInfoCell`, `utils/tinymce.ts`. Mở rộng API icon của `Header`/`FilterPanel`/`DataTable`/`ActionButton(s)` nhận `LucideIcon` hoặc `string` (Seller dùng Lucide, Admin giữ string đến Phase 8) |
| 52  | Phase 7 allowlist | 57 → **42** (10 page Seller + `action-button` + `action-buttons` + `data-table` + `admin/users/Toast` + `utils/tinymce.ts`). Kết quả: `check:css` pass **251 checked / 42 allowlisted** |
| 53  | Git trước Phase 7 | Commit **tách riêng toàn bộ thay đổi ngoài refactor** trong working tree (hiện là cụm chatbot/Markdown: dependency, `ChatDock`/`MarkdownText`, service/controller, route, migration); kiểm tra `git status` lại ngay trước khi build vì cây đang thay đổi. Không trộn dependency/tính năng mới vào commit Seller |
| 54  | Phase 7 implementation | `DataTable` mở rộng thêm `key` + `align` (additive, Admin không phải sửa); `Insights` thêm prop `columns` (3/4); `lib/icon.tsx` chuẩn hoá `LucideIcon` hoặc Boxicons string (`bx x`); bỏ action chết “Download Report” + “Product Guidelines”; Shop hint trung tính; thêm 6 module CSS (`seller`, `insights`, `data-table`, `action-buttons`, `toast`, `product-info-cell`) |

---

## 2. Hiện trạng đo được

### 2.1 Số liệu

| Chỉ số                           |                                             Giá trị |
| -------------------------------- | --------------------------------------------------: |
| File page                        |                    79 (78 component + 1 `types.ts`) |
| File component                   |                                                 139 |
| Primitive `components/ui`        |                                                  47 |
| Chỗ dùng `className=`            |                                               2.096 |
| File import `Page.css`           |                                                  41 |
| `Page.css`                       |                                        62.838 bytes |
| `legacy-tokens.css`              |                                         4.455 bytes |
| `tokens.css` (Tailwind `@theme`) |                                         5.042 bytes |
| Page file lớn nhất               | `Seller/Promotions/Create.tsx` (82 chỗ `className`) |

### 2.2 Hai hệ thống song song

| Khu vực                             | Layout                                            | CSS                              | Font           | Icon     | Palette                         |
| ----------------------------------- | ------------------------------------------------- | -------------------------------- | -------------- | -------- | ------------------------------- |
| Storefront/Auth/Account/Chat        | `StorefrontLayout`, `AuthLayout`, `AccountLayout` | Tailwind + `tokens.css`          | Be Vietnam Pro | Lucide   | Rice paper + lacquer red        |
| Seller/Admin (Shipper hiện là stub) | `layouts/app/AppLayout`                           | `Page.css` + `legacy-tokens.css` | Be Vietnam Pro | Boxicons | `#1976d2`, `#9c27b0`, `#ff9800` |

Đây là nguyên nhân gốc khiến giao diện "không đúng ý": hai ngôn ngữ thị giác, hai bảng màu, hai thang mật độ, hai bộ icon.

### 2.3 Nợ kỹ thuật cụ thể

| File / nhóm                       | Vấn đề                                                                                                               | Xử lý                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `resources/css/Page.css`          | `:root` riêng, `* { margin:0; padding:0 }` **unlayered** (đè mọi `sn-*`/utility), palette xanh/tím/cam, `.bx` 1.7rem | Tách reset toàn cục vào layer yếu ở Phase 3; xoá Phase 11 |
| `resources/css/legacy-tokens.css` | Alias shadcn trên palette `#2563eb`/`#cf52d0`, `.dark`                                                               | Xoá Phase 11                                              |
| `resources/css/tokens.css`        | Token khai trong `@theme` (Tailwind-specific)                                                                        | Giữ đến Phase 11                                          |
| `resources/css/base.css`          | Dùng `@apply`                                                                                                        | Giữ đến Phase 11, thay bằng `base/`                       |
| `tailwind.config.ts`              | Không được load nhưng gây hiểu nhầm                                                                                  | Xoá Phase 11                                              |
| `components.json`                 | Trỏ `tailwind.config.js` không tồn tại                                                                               | Xoá Phase 11                                              |
| `postcss.config.js`               | Chỉ có plugin Tailwind                                                                                               | Xoá Phase 11                                              |
| `.prettierrc`                     | `prettier-plugin-tailwindcss`, `tailwindStylesheet`                                                                  | Sửa Phase 11                                              |
| `eslint.config.js`                | Ignore `tailwind.config.js`                                                                                          | Sửa Phase 11                                              |
| `scripts/check-tokens.mjs`        | Regex token + allowlist file-level                                                                                   | Viết lại Phase 0, giữ ratchet                             |
| `scripts/token-allowlist.json`    | 65 trước Phase 0; 187 sau baseline; 186 sau Phase 1; 175 sau Phase 2A; 168 sau Phase 2B; 156 sau Phase 2C; 143 sau Phase 3; 112 sau Phase 4; 104 sau Phase 5; 57 sau Phase 6; **42 sau Phase 7**        | Giữ làm ratchet đến Phase 11                              |
| `app.blade.php`                   | `class="font-sans antialiased"`, Boxicons CDN, Google Fonts link weight 300–800                                      | Self-host font + sửa Phase 1, bỏ Boxicons Phase 11        |
| `app.css`                         | `@import 'tailwindcss'`, `@custom-variant`, `@source`                                                                | Sửa Phase 1                                               |
| `DESIGN-02.md`                    | Fraunces + JetBrains Mono (trái quyết định)                                                                          | Xoá/archived Phase 11                                     |
| `STITCH-DESIGN.md`                | 11.325 dòng HTML dùng Tailwind CDN                                                                                   | Archived Phase 11                                         |
| `PROMPT.md`, `PLAN.md`            | Kế hoạch Nếp cũ                                                                                                      | Archived Phase 11                                         |
| `useTheme.ts`                     | Dùng `.dark` class                                                                                                   | Sửa Phase 1                                               |
| `AppLayout.tsx`                   | Sidebar Boxicons hardcode                                                                                            | Thay Phase 3                                              |

### 2.4 Trang thiếu (backlog, không tạo trong refactor)

`Admin/CustomerSegments/*` (4), `Admin/Inventory/Report`, `Admin/Orders/Show`, `Admin/Returns/Show`, `Seller/Promotions/Edit`, `Seller/Promotions/Show`, `Seller/Reports/*` (2), `Seller/Wallet/*` (3), `Product/Index`, `Product/Show` — **16 render target**.

Các `Inertia::render` này đang trỏ file không tồn tại. **Không sửa trong refactor UI**; ghi nhận để không bị hiểu là regression.

**Ngoại lệ Phase 5:** `Auth/ConfirmPassword` đã được đưa **vào** Phase 5 (quyết định #32) vì route `password.confirm` đã đăng ký (`ConfirmablePasswordController::show`) và page thiếu làm truy cập trực tiếp hỏng ở client. 16 target còn lại vẫn giữ backlog.

### 2.5 Phát hiện khi rà soát trước Phase 3 (2026-11-23)

Các số liệu dưới đây đo trực tiếp trên code + Edge headless/CDP, dùng để chốt Phase 3:

| Phát hiện                                                               | Bằng chứng                                                                                                                                                  | Ảnh hưởng                                                                                                              |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Page.css` unlayered đè `sn-*`                                          | Nạp `AppLayout-*.css` vào `/login`: `.sn-btn` padding-left 24px → **0px**, `.sn-input` 40px → **0px**; test cô lập `@layer` 20px vs unlayered 0px → **0px** | Mọi padding/margin của primitive mất trên 41 page workspace, gồm StatusBadge (2C)                                      |
| Tailwind utilities trong workspace đã chết từ trước                     | `form.mt-7` margin-top 28px → **0px** khi có `Page.css`                                                                                                     | Nợ có sẵn từ lúc lên Tailwind v4, không do refactor                                                                    |
| `Page.css` phụ thuộc DOM `.content`                                     | **66 selector** bắt đầu bằng `.content`; `.content { width: calc(100% - 230px); left: 230px }`; `.sidebar { z-index: 2000 }`                                | Layout mới phải giữ `.content`/`<main>`; sidebar 230px; modal (z 60) sẽ nằm dưới sidebar nếu dùng lại class `.sidebar` |
| `base/*.css` chưa từng chạy                                             | `body 15px`, `a { color: accent }`, `label 12px`                                                                                                            | Nếu import toàn cục sẽ restyle 41 trang; 10/12 `<Link>` ở Admin/Seller không có `text-*`                               |
| `routes/shipper.php` chỉ có `/dashboard` + alias `shipper` chưa đăng ký | Nav shipper có 8 href, 6 href không tồn tại; cả nhóm route 500                                                                                              | Phase 3 phải rút nav, không "giữ nguyên href"                                                                          |
| Shared props không có số liệu                                           | `HandleInertiaRequests::share()` chỉ có `name/quote/auth/sidebarOpen/locale/translations/currency/csrfToken`                                                | AuthBrandPanel không thể có "số liệu thật"                                                                             |
| i18n thiếu key                                                          | `auth.logout` **đã có** trong nested `auth` ở cả hai file; `Search...`, `Shops` thiếu; 43 key chỉ có ở `en`                                          | Navbar từng render literal `auth.logout`; Phase 3 thêm `Search`, `Search...`, `Shops`; dùng flat key, không thêm object `navbar` trùng |
| Breakpoint 640 chưa có trong tài liệu                                   | `@media (min-width: 40rem)` ở overlay/feedback/navigation                                                                                                   | Phase 3 dùng breakpoint dày đặc, cần chốt trước                                                                        |
| Git casing                                                              | 7 file `components/ui` track chữ hoa nhưng đĩa chữ thường (`Avatar`, `Header`, `Insights`, `Navbar`, `Pagination`, `Sidebar`, `Tooltip`)                    | Checkout Linux/CI có thể fail                                                                                          |
| `@fortawesome/fontawesome-free`                                         | 0 chỗ dùng trong `resources/js`                                                                                                                             | Ghi backlog, xoá ở Phase 11                                                                                            |

### 2.6 Đo lại trước Phase 5 (2026-11-23)

Số liệu dưới đây đo trực tiếp trên working tree (build sạch + Edge headless/CDP) để chốt scope Phase 5:

| Chỉ số                                         | Giá trị đo được                                                                                     |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| File page / primitive                          | 78 / 47 (79 page sau khi tạo `Auth/ConfirmPassword` ở Phase 5)                                       |
| `className=`                                   | 2.081                                                                                               |
| File import `Page.css`                         | **40** (không phải 41; một file đã migrate ở Phase 4)                                                |
| File import `layouts/app/AppLayout`            | 39 (khớp tài liệu)                                                                                   |
| `bx-*`                                         | 232                                                                                                 |
| Allowlist                                      | 112 file, trong đó **7 entry Auth** (`Login`, `Register`, `ForgotPassword`, `ResetPassword`, `ShipperRegister`, `VerifyEmail`, `components/auth/SellerRegisterForm`) |
| CSS bundle `build`                             | `app-*.css` **179,67 kB** + chunk `Page.css` **43,85 kB** (không tái lập được con số 130,77 kB ở §15) |
| Gate                                           | `types`, `format:check`, `check:css` (167 file), `build` đều pass; `/login`, `/register`, `/forgot-password`, `/reset-password/*`, `/register/seller`, `/register/shipper` trả 200 |
| Auth light                                     | `.sn-auth__form` 420 px, panel 720 px @1440; không tràn ngang ở 390/768/1440 (`scrollWidth === innerWidth`) |
| Auth dark                                      | Nền shell `rgb(13,15,12)`; heading `sn-*` đúng token, nhưng 4 heading section dùng `text-ink` đo được `rgb(29,27,23)` → gần như vô hình |
| Utility Nếp còn trong Auth                     | 57 chỗ (`Login` 10, `Register` 11, `ResetPassword` 9, `ShipperRegister` 15, `SellerRegisterForm` 10, `ForgotPassword` 2) |
| Form đăng ký                                   | `SellerRegister` 420×940, `ShipperRegister` 420×1177 @1440; grid 2 cột cho input ~202 px             |

### 2.7 Đo lại trước Phase 6 (2026-11-24)

Số liệu đo trực tiếp trên working tree để chốt scope Phase 6:

| Chỉ số | Giá trị đo được |
|---|---|
| File trong phạm vi | **66** (`pages/Customer` 14 + `pages/Settings` 4 + `components/commerce` 36 + `components/chat` 12) |
| Page thật / component trong `pages/` | **16 / 2** (`Address/AddressForm`, `Settings/SettingsTabs`) |
| Entry allowlist thuộc Phase 6 | **46** (13 Customer + 4 Settings + 17 commerce + 12 chat) + `ConfirmDialog` = **47** |
| Vi phạm trong vùng Phase 6 | **1.743 / 2.338** (75%): `tailwind-utility` 1.741, `arbitrary-value` 2 |
| Raw hex / Boxicons trong vùng | **0 / 0** |
| Page/component Phase 6 import `Page.css` | **0** (không có rủi ro layer/geometry) |
| CSS Modules hiện có cho vùng | 0 |
| Test liên quan | 15 file (Cart, Checkout*, Settings/*, Address, Orders, Chat) |
| Gate hiện tại | `types` + `check:css` pass (176 file checked, 104 allowlisted) |
| Working tree | **31 file bẩn** từ việc khác → phải commit/stash trước Phase 6 |

**Sai biệt phát hiện khi đo:**
- `Address/AddressForm` và `Settings/SettingsTabs` nằm trong `pages/` nhưng là component; plan gọi “18 page” → thực tế 16 page.
- `chat/*` là **12 component + 1 hook** (`useChatConversations.ts`); plan ghi 13 file nếu tính cả hook.
- Plan thiếu `ConfirmDialog` (Cart/CheckoutExitConfirmation/Orders dùng) và `CheckoutExitConfirmation` (Checkout dùng); `PaymentMarks` render trong `StorefrontFooter` nên vẫn là Nếp trên mọi page Storefront Phase 4.
- `PaymentMarks` tự vẽ logo Mastercard bằng 2 vòng tròn màu → trái luật “logo thật”.
- Checkout address hỏng 3 lớp: sai prefix `/addresses`, POST `/addresses` không tồn tại, form 3 cấp trong khi DB 2 cấp; `AddressController::store` trả redirect nên nhánh `response.data.success` không bao giờ chạy.
- Theme đang pin sáng: `AccountLayout` không truyền `pinLight`, `Cart`/`Checkout`/`PaymentResult` dùng default `true`.
- Claim giả trong vùng: `Shop Việt`, `Đổi trả 7 ngày`, `Hỗ trợ 24/7`, `Giao tiêu chuẩn 2–4 ngày`, `phí kiểm định`; `BuyBox`/`ProductDetail` (Phase 4) còn `7 ngày`/`2-4 ngày`.
- Copy: 8 em/en-dash; `CheckoutStepper` render “01.”, `OrderTimeline` render số thứ tự.

### 2.8 Đo lại trước Phase 7 (2026-11-24)

Số liệu đo trực tiếp trên working tree sau Phase 6 để chốt scope Phase 7:

| Chỉ số | Giá trị đo được |
|---|---|
| Page Seller trong phạm vi | **10** (`Dashboard/Index`, `Products/{Index,Create,Edit,Show}`, `Orders/{Index,Show}`, `Promotions/{Index,Create}`, `Shop/Edit`) |
| Entry allowlist thuộc Phase 7 | **15**: 10 page + `action-button` + `action-buttons` + `data-table` + `admin/users/Toast` + `utils/tinymce.ts` |
| Vi phạm guardrail trong `pages/Seller` | **248 dòng**: `tailwind-utility` 137, `legacy-icon` 61, `raw-hex` 50 |
| File nhiều vi phạm nhất | `Orders/Show` 104, `Products/Show` 42, `Products/Edit` 23, `Orders/Index` 21, `Dashboard` 18 |
| Class `Page.css` dùng trong Seller | **85 token** (`btn`, `orders`, `header`, `bottom-data`, `metric-*`, `promotion-*`, `insights`, …) |
| Page Seller import `Page.css` | **8/10** (Orders/Index và Orders/Show không import trực tiếp) |
| `bx-*` literal trong Seller | **61** (chưa tính icon truyền qua prop như `reportButton`, `Insights`, `DataTable`, `ActionButton(s)`) |
| i18n | **217 key `t()`**; **104 thiếu `vi.json`**, **69 thiếu `en.json`** → `t()` trả key, UI hiện tiếng Anh |
| Test Seller | 3 file (`DashboardControllerTest`, `ProductControllerTest`, `SellerRoutesAccessTest`); **không có test Orders/Promotions/Shop** |
| Gate hiện tại | `types` + `build` pass; `check:css` pass **229 checked / 57 allowlisted** (2 file Markdown chat chưa commit) |
| Working tree | **6+ file bẩn** từ việc khác (cụm chatbot/Markdown đang thay đổi; kiểm tra lại `git status` trước Phase 7) |
| Render target thiếu | **16**, trong đó **7 của Seller** (`Promotions/Edit` và `Promotions/Show`, `Reports/*` 2, `Wallet/*` 3) |

**Sai biệt phát hiện khi đo:**
- Spec Phase 7 cũ yêu cầu **chart Dashboard, bulk action Products, status tabs Orders, preview Promotions, preview card Shop** — code hiện tại **không có** các thành phần này; thêm mới sẽ trái nguyên tắc “không thêm tính năng” (quyết định #48).
- `action-dropdown` **không page Seller nào dùng** (chỉ Admin); có thể defer Phase 8.
- `confirmation-modal` **không phải wrapper của `ConfirmDialog`** như §9 ghi; là modal tự viết bằng inline style + `ActionButton`, không nằm trong allowlist.
- `insights`, `confirmation-modal`, `ProductInfoCell`, `header`, `filter-panel` **không nằm trong allowlist** nhưng vẫn là Nếp/inline style/Boxicons động (`bx ${...}`) → guardrail không bắt.
- `ButtonGroup` và `StatCard` (đích mapping §9) **không tồn tại** trong `components/ui`.
- `Promotions/Index` render action **Xem/Sửa** trỏ `Promotions/Show` và `Promotions/Edit` không tồn tại → bấm vào lỗi.
- `Orders/Index`/`Orders/Show` hiển thị **`$` + `en-US`**, copy tiếng Anh; `Products/Index` dùng `toLocaleString() + " VND"` thay `formatVnd`.
- `Dashboard` có nút **“Download Report” chỉ `console.log`**; nút “Product Guidelines” là placeholder; `Shop/Edit` dùng `alert()`.
- `Products/Create|Edit` có SEO preview dùng hex Google (`#1a0dab`, `#006621`, …) và copy “Sample previews…”.
- `utils/tinymce.ts` nằm trong allowlist vì `style_formats` có `#ff0000`.

---

## 3. Direction: BẢNG HIỆU

### 3.1 Ý tưởng

ShopNest là chợ đa ngành, người bán được kiểm duyệt. Giao diện đọc như **bảng hiệu và catalogue in**: nền giấy lạnh, chữ mực gần đen, một mảng cam đất duy nhất, đường kẻ rõ, số liệu thẳng cột. Storefront là catalogue có nhịp; workspace là bảng vận hành, dày nhưng không rối.

Từ khoá: **rõ, rắn, thẳng, đáng tin, không trang trí thừa**.

### 3.2 Sáu nguyên tắc thị giác

1. **Đường kẻ thay bóng đổ.** Phân cấp bằng border, khoảng trắng và cỡ chữ. Shadow chỉ dùng cho overlay (dialog, popover, toast).
2. **Một accent.** Cam đất chỉ xuất hiện ở CTA chính, link, active state, focus ring. Không tô màu category, không tô màu role.
3. **Số phải thẳng.** Mọi giá, tồn kho, mã đơn, KPI dùng `font-variant-numeric: tabular-nums` và căn phải trong bảng.
4. **Nhãn nhỏ in hoa.** Metadata dùng 11 px, `letter-spacing: 0.1em`, uppercase; không dùng cho câu dài.
5. **Bo góc nhỏ.** 4 px cho control, 8 px cho surface. Không 20 px, không pill tràn lan (pill chỉ cho badge trạng thái và avatar).
6. **Không chuyển động trang trí.** Chỉ hover/focus/press và skeleton. Không parallax, không auto-carousel, không pulse vô hạn trên status dot.

### 3.3 Tư thế theo khu vực

| Khu vực          | Grid                         | Mật độ     | Nhịp dọc       | Đặc trưng                                                                          |
| ---------------- | ---------------------------- | ---------- | -------------- | ---------------------------------------------------------------------------------- |
| Storefront       | 12 cột, hero 7/5, shelf 4-up | Thoáng vừa | `--sn-section` | Catalogue in, tiêu đề lớn, ảnh 4:5, metadata 1 dòng                                |
| Auth             | 6/6 split, form 420 px (600 px cho trang đăng ký) | Thoáng     | 32 px          | Không card giữa màn hình; panel trái là brand ledger                               |
| Customer account | 220 px rail + content        | Vừa        | 24–32 px       | Bảng đơn, timeline, form dọc                                                       |
| Seller           | 232 px sidebar               | Dày        | 20–24 px       | KPI strip, bảng, form 2 cột                                                        |
| Admin            | 232 px sidebar               | Dày nhất   | 16–20 px       | Bảng ledger, filter bar, bulk action                                               |
| Shipper          | 232 px sidebar               | Vừa        | 20 px          | Shell + empty state; danh sách chuyến chỉ khi backend có dữ liệu, tap target 44 px |

> **Sidebar 230 vs 232:** `--sn-sidebar` = 232px là giá trị đích. Trong giai đoạn chuyển đổi, `Page.css` hard-code `.content { width: calc(100% - 230px); left: 230px }` ở unlayered nên Phase 3 dùng **230px** cho khớp; đổi về 232 khi xoá `Page.css` (Phase 11).

### 3.4 Anatomy component

| Component          | Đặc tả                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| Button             | Cao 32/40/48; padding ngang 12/16/20; radius 4 px (sm) / 6 px (md, lg); border 1 px; weight 500; icon 16/20     |
| Button primary     | Fill `--sn-color-accent`, chữ `--sn-color-on-accent`, hover `--sn-color-accent-hover`, active `translateY(1px)` |
| Button secondary   | Nền surface, border `--sn-color-border-strong`, chữ ink, hover `--sn-color-surface-sunken`                      |
| Button ghost       | Không border, hover `--sn-color-surface-sunken`                                                                 |
| Button tertiary    | Chữ accent, gạch chân 1 px offset 3 px                                                                          |
| Button destructive | Fill `--sn-color-danger`, chữ `--sn-color-on-danger`                                                            |
| Input              | Cao 40; radius 6; border 1 px `--sn-color-border-strong`; nền surface; focus ring 2 px accent offset 2          |
| Label              | 12 px, weight 500, margin-bottom 6 px; helper 12 px muted; error 12 px danger-text                              |
| Card               | Nền surface, border 1 px `--sn-color-border`, radius 8, padding 16/20; **không shadow**                         |
| Table              | Header 11 px uppercase, row 48 px, divider 1 px, hover `--sn-color-surface-sunken`; số căn phải                 |
| Badge              | Cao 20/22, radius pill, padding 4/8, 12 px weight 500, nền wash + chữ text tương ứng                            |
| Dialog             | Nền surface, radius 12, border 1, shadow overlay, max-width 480/640                                             |
| Toast              | Radius 8, border-left 3 px theo tone, shadow popover, không glow                                                |
| Tabs               | Gạch chân 2 px accent cho active, không pill                                                                    |
| Pagination         | Nút 32 px vuông, số hiện tại fill ink, không dãy số dài                                                         |
| Skeleton           | Nền `--sn-color-surface-sunken`, shimmer 1.4 s, đúng kích thước thật                                            |
| Empty state        | 1 dòng giải thích + 1 action, không minh hoạ vector tự vẽ                                                       |
| Chart              | Lưới 1 px `--sn-color-border`, series accent + success + warning, không gradient                                |

### 3.5 Icon và ảnh

- **Lucide only**, stroke 1.75, size 14/16/20/24. Xoá Boxicons khỏi `app.blade.php` ở Phase 11.
- Ảnh sản phẩm 4:5, radius 2 px, `object-fit: cover`. Không overlay card lên ảnh.
- Logo dùng asset thật đang có: `public/image/ShopnestLogo.png` (logo ngang, kèm chữ) và `public/image/ShopnestLogoIcon.ico`; không đổi màu. **Lưu ý:** `app.blade.php` đang link favicon `/image/ShopnestLogoSVG.svg` — file này **không tồn tại**; sửa link trong Phase 11 cùng lúc dọn blade (hoặc thêm asset SVG nếu muốn giữ tên).
- Không icon tự vẽ SVG, không emoji trong UI/alt/filename.

### 3.6 Copy

- Tiếng Việt, xưng "Bạn" với khách; workspace trung tính.
- Câu ngắn, danh từ cụ thể, không dấu chấm than trong giao dịch.
- Cấm: "Nâng tầm", "Liền mạch", "Bứt phá", "Thế hệ mới", "Khám phá ngay", "Không chỉ là… mà còn…".
- Giá: `1.290.000 ₫`. Ngày: `12/11/2026`. Giờ 24h: `14:30`. Mã đơn: `#SN-24817`.
- **Không em-dash (`—`) và không en-dash (`–`) trong copy hiển thị.** Dùng hyphen thường `-`. Áp cho heading, nhãn, badge, body, caption, alt text, button. (Dấu `…` chỉ dùng khi thật sự cần rút gọn, không dùng làm nhịp câu.)
- **Không số liệu giả chính xác.** Chỉ dùng số thật từ props/DB; nếu là dữ liệu mẫu phải ghi rõ trong code comment, không đưa lên UI như số thật.
- **Không nhãn trang trí:** không `01 / 02 / 03`, không `PHẦN 1`, không `No. 01`, không `Scroll to explore`, không `v0.6 / BETA`, không strip thành phố/thời tiết, không credit ảnh giả.
- **Không pill/tag phủ lên ảnh.** Caption (nếu có) nằm dưới ảnh.
- **Một CTA một ý.** Không dùng đồng thời "Liên hệ" + "Gọi cho chúng tôi" + "Bắt đầu" cho cùng một hành động.
- **Một giọng duy nhất mỗi trang.** Không trộn giọng kỹ thuật, giọng quảng cáo và giọng biên tập trong cùng một màn.

---

## 4. Hệ thống token

### 4.1 Quy tắc

1. Prefix `--sn-` để cùng tồn tại với `Page.css`/`legacy-tokens` trong giai đoạn chuyển đổi.
2. **Primitive** chỉ định nghĩa trong `tokens/primitive.css`. **Semantic** trong `tokens/semantic.css`. **Scale** (type/space/size/radius/shadow/motion/z) trong `tokens/scale.css`.
3. Component **chỉ** dùng semantic + scale. Không dùng primitive trực tiếp, trừ khi viết chính file token.
4. Không hex trong `resources/js/**`, không hex trong `components/*.css`, không `rgb()` rời.
5. Không đặt token theo tên component (`--sn-button-bg` là sai). Đặt theo vai trò (`--sn-color-accent`).
6. Mọi token phải có mặt trong cả light và dark, trừ token hình học.
7. **Surface trắng `#ffffff` chỉ dùng cho card/sheet trên nền `#f2f2ee`**, không dùng làm nền trang. Dark mode không dùng `#000` cho surface; chỉ dùng đen trong shadow/overlay.
8. **Accent `#c2410c` có saturation ~87%**, cao hơn mặc định 80% của skill. Chấp nhận có chủ đích: đây là fill đặc duy nhất, không glow, không gradient, contrast với trắng 5,2:1. Không thêm accent thứ hai để "cân bằng".

### 4.2 `tokens/primitive.css` — bảng màu gốc

```css
:root {
    /* Neutral — giấy lạnh, dùng cho light mode */
    --sn-neutral-0: #ffffff;
    --sn-neutral-25: #fcfcfa;
    --sn-neutral-50: #f7f7f4;
    --sn-neutral-100: #f2f2ee;
    --sn-neutral-150: #ecece7;
    --sn-neutral-200: #e3e3dd;
    --sn-neutral-300: #d2d2ca;
    --sn-neutral-400: #a9aaa0;
    --sn-neutral-500: #8e9086;
    --sn-neutral-600: #6b6e62;
    --sn-neutral-700: #53564b;
    --sn-neutral-800: #3a3d34;
    --sn-neutral-900: #262923;
    --sn-neutral-950: #15160f;
    --sn-neutral-1000: #0b0c0a;

    /* Graphite — than, dùng cho dark mode */
    --sn-graphite-50: #f1f2ea;
    --sn-graphite-100: #d6d9cf;
    --sn-graphite-200: #b4b8aa;
    --sn-graphite-300: #8d9184;
    --sn-graphite-350: #6e7466;
    --sn-graphite-400: #5a5f54;
    --sn-graphite-500: #3a4036;
    --sn-graphite-600: #2b3028;
    --sn-graphite-700: #242922;
    --sn-graphite-800: #1c201a;
    --sn-graphite-850: #151814;
    --sn-graphite-900: #101210;
    --sn-graphite-950: #0d0f0c;

    /* Accent — cam đất (bảng hiệu) */
    --sn-accent-50: #fdf1ec;
    --sn-accent-100: #fae0d5;
    --sn-accent-200: #f4c2ae;
    --sn-accent-300: #ec9d7f;
    --sn-accent-400: #e1744e;
    --sn-accent-500: #d0552b;
    --sn-accent-600: #c2410c;
    --sn-accent-700: #9a3208;
    --sn-accent-800: #7a2a0b;
    --sn-accent-900: #61240c;

    /* Success — xanh rêu */
    --sn-success-50: #e9f4ee;
    --sn-success-100: #d2e9dd;
    --sn-success-200: #a6d3bd;
    --sn-success-300: #6fb596;
    --sn-success-400: #3f9573;
    --sn-success-500: #1f6f4a;
    --sn-success-600: #1a5c3d;
    --sn-success-700: #154a32;
    --sn-success-800: #103a27;

    /* Warning — hổ phách tối */
    --sn-warning-50: #fbf2de;
    --sn-warning-100: #f6e3bb;
    --sn-warning-200: #ecc97f;
    --sn-warning-300: #dca93f;
    --sn-warning-400: #bc8a12;
    --sn-warning-500: #9a6200;
    --sn-warning-600: #7a4e00;
    --sn-warning-700: #5e3c00;

    /* Danger — đỏ gạch */
    --sn-danger-50: #fbeae8;
    --sn-danger-100: #f7d2ce;
    --sn-danger-200: #eea7a0;
    --sn-danger-300: #e0786e;
    --sn-danger-400: #cd4a3f;
    --sn-danger-500: #b3261e;
    --sn-danger-600: #8c1d18;
    --sn-danger-700: #711713;

    /* Dark-mode signal (đủ tương phản trên nền than) */
    --sn-signal-success: #5fc79b;
    --sn-signal-warning: #f0b44c;
    --sn-signal-danger: #f08a80;
    --sn-signal-accent: #ff8a5b;
    --sn-signal-accent-hover: #ffa277;
}
```

### 4.3 `tokens/semantic.css` — light mode

```css
:root,
[data-theme='light'] {
    color-scheme: light;

    /* Surface */
    --sn-color-canvas: var(--sn-neutral-100); /* #f2f2ee */
    --sn-color-canvas-alt: var(--sn-neutral-50); /* #f7f7f4 */
    --sn-color-surface: var(--sn-neutral-0); /* #ffffff */
    --sn-color-surface-sunken: var(--sn-neutral-150); /* #ecece7 */
    --sn-color-surface-strong: var(--sn-neutral-900); /* #262923 */
    --sn-color-surface-inverse: var(--sn-neutral-950);

    /* Text */
    --sn-color-text: var(--sn-neutral-950); /* #15160f */
    --sn-color-text-muted: var(--sn-neutral-700); /* #53564b */
    --sn-color-text-faint: var(--sn-neutral-600); /* #6b6e62 */
    --sn-color-text-inverse: var(--sn-neutral-25); /* #fcfcfa */
    --sn-color-text-on-strong: var(--sn-neutral-25);

    /* Line */
    --sn-color-border: var(--sn-neutral-300); /* #d2d2ca */
    --sn-color-border-strong: var(--sn-neutral-500); /* #8e9086 */
    --sn-color-border-inverse: var(--sn-neutral-700);

    /* Accent */
    --sn-color-accent: var(--sn-accent-600); /* #c2410c */
    --sn-color-accent-hover: var(--sn-accent-700); /* #9a3208 */
    --sn-color-accent-text: var(--sn-accent-700); /* #9a3208 */
    --sn-color-accent-wash: var(--sn-accent-50); /* #fdf1ec */
    --sn-color-on-accent: var(--sn-neutral-0); /* #ffffff */
    --sn-color-focus: var(--sn-accent-600);

    /* Success */
    --sn-color-success: var(--sn-success-500); /* #1f6f4a */
    --sn-color-success-text: var(--sn-success-700); /* #154a32 */
    --sn-color-success-wash: var(--sn-success-50); /* #e9f4ee */
    --sn-color-on-success: var(--sn-neutral-0);

    /* Warning */
    --sn-color-warning: var(--sn-warning-500); /* #9a6200 */
    --sn-color-warning-text: var(--sn-warning-600); /* #7a4e00 */
    --sn-color-warning-wash: var(--sn-warning-50); /* #fbf2de */
    --sn-color-on-warning: var(--sn-neutral-0);

    /* Danger */
    --sn-color-danger: var(--sn-danger-500); /* #b3261e */
    --sn-color-danger-text: var(--sn-danger-600); /* #8c1d18 */
    --sn-color-danger-wash: var(--sn-danger-50); /* #fbeae8 */
    --sn-color-on-danger: var(--sn-neutral-0);

    /* Neutral badge */
    --sn-color-neutral: var(--sn-neutral-700);
    --sn-color-neutral-text: var(--sn-neutral-800);
    --sn-color-neutral-wash: var(--sn-neutral-150);

    /* Utility */
    --sn-color-overlay: rgb(21 22 15 / 0.52);
    --sn-color-selection: var(--sn-accent-100);
    --sn-color-scrim: rgb(21 22 15 / 0.08);
}
```

**Kiểm tra tương phản light (WCAG 2.2):**

| Cặp                                                 |  Tỷ lệ | Kết luận |
| --------------------------------------------------- | -----: | -------- |
| `text` on `canvas` (`#15160f` / `#f2f2ee`)          | 16,2:1 | AAA      |
| `text-muted` on `canvas` (`#53564b` / `#f2f2ee`)    |  6,7:1 | AA       |
| `text-faint` on `canvas` (`#6b6e62` / `#f2f2ee`)    |  4,6:1 | AA       |
| `on-accent` on `accent` (`#ffffff` / `#c2410c`)     |  5,2:1 | AA       |
| `accent-text` on `canvas` (`#9a3208` / `#f2f2ee`)   |  6,6:1 | AA       |
| `on-success` on `success` (`#ffffff` / `#1f6f4a`)   |  6,1:1 | AA       |
| `on-warning` on `warning` (`#ffffff` / `#9a6200`)   |  5,1:1 | AA       |
| `on-danger` on `danger` (`#ffffff` / `#b3261e`)     |  6,6:1 | AA       |
| `border-strong` / `surface` (`#8e9086` / `#ffffff`) |  3,2:1 | AA (UI)  |

### 4.4 `tokens/semantic.css` — dark mode

```css
[data-theme='dark'] {
    color-scheme: dark;

    /* Surface */
    --sn-color-canvas: var(--sn-graphite-950); /* #0d0f0c */
    --sn-color-canvas-alt: var(--sn-graphite-900); /* #101210 */
    --sn-color-surface: var(--sn-graphite-850); /* #151814 */
    --sn-color-surface-sunken: var(--sn-graphite-900); /* #101210 */
    --sn-color-surface-strong: var(--sn-graphite-50); /* #f1f2ea */
    --sn-color-surface-inverse: var(--sn-graphite-50);

    /* Text */
    --sn-color-text: var(--sn-graphite-50); /* #f1f2ea */
    --sn-color-text-muted: var(--sn-graphite-200); /* #b4b8aa */
    --sn-color-text-faint: var(--sn-graphite-300); /* #8d9184 */
    --sn-color-text-inverse: var(--sn-graphite-950);
    --sn-color-text-on-strong: var(--sn-graphite-950);

    /* Line */
    --sn-color-border: var(--sn-graphite-600); /* #2b3028 */
    --sn-color-border-strong: var(--sn-graphite-350); /* #6e7466 */
    --sn-color-border-inverse: var(--sn-graphite-300);

    /* Accent */
    --sn-color-accent: var(--sn-signal-accent); /* #ff8a5b */
    --sn-color-accent-hover: var(--sn-signal-accent-hover); /* #ffa277 */
    --sn-color-accent-text: var(--sn-signal-accent); /* #ff8a5b */
    --sn-color-accent-wash: #3a241c;
    --sn-color-on-accent: #1a0e08;
    --sn-color-focus: var(--sn-signal-accent);

    /* Success */
    --sn-color-success: #3aa87a;
    --sn-color-success-text: var(--sn-signal-success);
    --sn-color-success-wash: #12291f;
    --sn-color-on-success: #07150f;

    /* Warning */
    --sn-color-warning: #b07416;
    --sn-color-warning-text: var(--sn-signal-warning);
    --sn-color-warning-wash: #2e2413;
    --sn-color-on-warning: #1a1205;

    /* Danger */
    --sn-color-danger: #e05a50;
    --sn-color-danger-text: var(--sn-signal-danger);
    --sn-color-danger-wash: #2e1714;
    --sn-color-on-danger: #1a0a08;

    /* Neutral badge */
    --sn-color-neutral: var(--sn-graphite-300);
    --sn-color-neutral-text: var(--sn-graphite-200);
    --sn-color-neutral-wash: var(--sn-graphite-700);

    /* Utility */
    --sn-color-overlay: rgb(0 0 0 / 0.66);
    --sn-color-selection: #4a2a1e;
    --sn-color-scrim: rgb(0 0 0 / 0.32);
}

/* Fallback khi chưa có JS: theo hệ điều hành */
@media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
        color-scheme: dark;
        --sn-color-canvas: var(--sn-graphite-950);
        --sn-color-canvas-alt: var(--sn-graphite-900);
        --sn-color-surface: var(--sn-graphite-850);
        --sn-color-surface-sunken: var(--sn-graphite-900);
        --sn-color-surface-strong: var(--sn-graphite-50);
        --sn-color-surface-inverse: var(--sn-graphite-50);
        --sn-color-text: var(--sn-graphite-50);
        --sn-color-text-muted: var(--sn-graphite-200);
        --sn-color-text-faint: var(--sn-graphite-300);
        --sn-color-text-inverse: var(--sn-graphite-950);
        --sn-color-text-on-strong: var(--sn-graphite-950);
        --sn-color-border: var(--sn-graphite-600);
        --sn-color-border-strong: var(--sn-graphite-350);
        --sn-color-border-inverse: var(--sn-graphite-300);
        --sn-color-accent: var(--sn-signal-accent);
        --sn-color-accent-hover: var(--sn-signal-accent-hover);
        --sn-color-accent-text: var(--sn-signal-accent);
        --sn-color-accent-wash: #3a241c;
        --sn-color-on-accent: #1a0e08;
        --sn-color-focus: var(--sn-signal-accent);
        --sn-color-success: #3aa87a;
        --sn-color-success-text: var(--sn-signal-success);
        --sn-color-success-wash: #12291f;
        --sn-color-on-success: #07150f;
        --sn-color-warning: #b07416;
        --sn-color-warning-text: var(--sn-signal-warning);
        --sn-color-warning-wash: #2e2413;
        --sn-color-on-warning: #1a1205;
        --sn-color-danger: #e05a50;
        --sn-color-danger-text: var(--sn-signal-danger);
        --sn-color-danger-wash: #2e1714;
        --sn-color-on-danger: #1a0a08;
        --sn-color-neutral: var(--sn-graphite-300);
        --sn-color-neutral-text: var(--sn-graphite-200);
        --sn-color-neutral-wash: var(--sn-graphite-700);
        --sn-color-overlay: rgb(0 0 0 / 0.66);
        --sn-color-selection: #4a2a1e;
        --sn-color-scrim: rgb(0 0 0 / 0.32);
    }
}
```

**Kiểm tra tương phản dark:**

| Cặp                                                      |  Tỷ lệ | Kết luận |
| -------------------------------------------------------- | -----: | -------- |
| `text` on `canvas` (`#f1f2ea` / `#0d0f0c`)               | 17,1:1 | AAA      |
| `text-muted` on `canvas` (`#b4b8aa` / `#0d0f0c`)         |  9,5:1 | AAA      |
| `text-faint` on `surface` (`#8d9184` / `#151814`)        |  5,6:1 | AA       |
| `accent` on `canvas` (`#ff8a5b` / `#0d0f0c`)             |  8,3:1 | AAA      |
| `on-accent` on `accent` (`#1a0e08` / `#ff8a5b`)          |  8,1:1 | AAA      |
| `success-text` on `success-wash` (`#5fc79b` / `#12291f`) |  7,6:1 | AAA      |
| `warning-text` on `warning-wash` (`#f0b44c` / `#2e2413`) |  7,4:1 | AAA      |
| `danger-text` on `danger-wash` (`#f08a80` / `#2e1714`)   |  5,9:1 | AA       |
| `border-strong` / `surface` (`#6e7466` / `#151814`)      |  3,6:1 | AA (UI)  |

### 4.5 `tokens/scale.css` — typography

```css
:root {
    /* Family — Be Vietnam Pro là duy nhất, self-host woff2 (xem Phase 1) */
    --sn-font-sans: 'Be Vietnam Pro', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    --sn-font-numeric: var(--sn-font-sans);

    /* Weight */
    --sn-weight-regular: 400;
    --sn-weight-medium: 500;
    --sn-weight-semibold: 600;
    --sn-weight-bold: 700;

    /* Size */
    --sn-text-2xs: 0.6875rem; /* 11px — nhãn in hoa */
    --sn-text-xs: 0.75rem; /* 12px — metadata, helper */
    --sn-text-sm: 0.8125rem; /* 13px — bảng dày */
    --sn-text-base: 0.9375rem; /* 15px — body UI */
    --sn-text-md: 1rem; /* 16px — body đọc */
    --sn-text-lg: 1.125rem; /* 18px — lead */
    --sn-text-xl: 1.375rem; /* 22px — H3 */
    --sn-text-2xl: 1.75rem; /* 28px — H2 */
    --sn-text-3xl: 2.25rem; /* 36px — H1 */
    --sn-text-4xl: clamp(2.75rem, 3.5vw, 3.5rem); /* 44–56px — page display */
    --sn-text-display: clamp(3rem, 5.5vw, 4.75rem); /* 48–76px — hero only */

    /* Line height */
    --sn-leading-none: 1;
    --sn-leading-tight: 1.08;
    --sn-leading-snug: 1.22;
    --sn-leading-normal: 1.5;
    --sn-leading-relaxed: 1.65;

    /* Tracking */
    --sn-tracking-tight: -0.02em;
    --sn-tracking-snug: -0.01em;
    --sn-tracking-normal: 0;
    --sn-tracking-wide: 0.06em;
    --sn-tracking-wider: 0.1em;

    /* Measure */
    --sn-measure-prose: 65ch;
    --sn-measure-lead: 46ch;
}
```

### 4.6 `tokens/scale.css` — spacing và kích thước

```css
:root {
    /* Spacing — cơ số 4px */
    --sn-space-0: 0;
    --sn-space-1: 0.25rem; /* 4 */
    --sn-space-2: 0.5rem; /* 8 */
    --sn-space-3: 0.75rem; /* 12 */
    --sn-space-4: 1rem; /* 16 */
    --sn-space-5: 1.25rem; /* 20 */
    --sn-space-6: 1.5rem; /* 24 */
    --sn-space-7: 1.75rem; /* 28 */
    --sn-space-8: 2rem; /* 32 */
    --sn-space-10: 2.5rem; /* 40 */
    --sn-space-12: 3rem; /* 48 */
    --sn-space-14: 3.5rem; /* 56 */
    --sn-space-16: 4rem; /* 64 */
    --sn-space-20: 5rem; /* 80 */
    --sn-space-24: 6rem; /* 96 */
    --sn-space-32: 8rem; /* 128 */

    /* Rhythm */
    --sn-gutter: clamp(1rem, 2.5vw, 2rem); /* 16–32 */
    --sn-section: clamp(2.5rem, 5vw, 4.5rem); /* 40–72 */
    --sn-section-tight: clamp(1.5rem, 3vw, 2.5rem);
    --sn-container: 90rem; /* 1440 */
    --sn-container-narrow: 65rem; /* 1040 */
    --sn-container-form: 26.25rem; /* 420 */
    --sn-container-form-wide: 37.5rem; /* 600 — trang đăng ký nhiều section (quyết định #34) */

    /* Control */
    --sn-control-sm: 2rem; /* 32 */
    --sn-control-md: 2.5rem; /* 40 */
    --sn-control-lg: 3rem; /* 48 */
    --sn-tap: 2.75rem; /* 44 — touch target tối thiểu */

    /* Icon */
    --sn-icon-xs: 0.875rem; /* 14 */
    --sn-icon-sm: 1rem; /* 16 */
    --sn-icon-md: 1.25rem; /* 20 */
    --sn-icon-lg: 1.5rem; /* 24 */

    /* Shell */
    --sn-header: 3.5rem; /* 56 */
    --sn-topbar: 3.5rem;
    --sn-sidebar: 14.5rem; /* 232 */
    --sn-account-rail: 13.75rem; /* 220 */
    --sn-filter-rail: 16.5rem; /* 264 */

    /* Chat */
    --sn-chat-launcher: 3.5rem;
    --sn-chat-panel: 23.75rem; /* 380 */
    --sn-chat-panel-height: min(40rem, calc(100dvh - 3rem));
    --sn-chat-sheet-height: 85dvh;

    /* Avatar */
    --sn-avatar-sm: 1.75rem; /* 28 */
    --sn-avatar-md: 2.25rem; /* 36 */
    --sn-avatar-lg: 3rem; /* 48 */
}
```

### 4.7 `tokens/scale.css` — radius, shadow, motion, z-index

```css
:root {
    /* Radius — nhỏ, đều */
    --sn-radius-none: 0;
    --sn-radius-xs: 0.125rem; /* 2 — ảnh, media */
    --sn-radius-sm: 0.25rem; /* 4 — control nhỏ, badge vuông */
    --sn-radius-md: 0.375rem; /* 6 — input, button */
    --sn-radius-lg: 0.5rem; /* 8 — card, toast */
    --sn-radius-xl: 0.75rem; /* 12 — dialog, sheet */
    --sn-radius-pill: 9999px;

    /* Shadow — chỉ cho lớp nổi */
    --sn-shadow-popover: 0 10px 30px -18px rgb(21 22 15 / 0.28);
    --sn-shadow-overlay: 0 24px 64px -32px rgb(21 22 15 / 0.42);

    /* Motion */
    --sn-dur-instant: 90ms;
    --sn-dur-fast: 150ms;
    --sn-dur-base: 180ms;
    --sn-dur-slow: 240ms;
    --sn-dur-reveal: 320ms;
    --sn-ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --sn-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --sn-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
    --sn-stagger: 40ms;

    /* Z-index */
    --sn-z-base: 0;
    --sn-z-raised: 10;
    --sn-z-sticky: 20;
    --sn-z-header: 30;
    --sn-z-dropdown: 40;
    --sn-z-chat: 45;
    --sn-z-overlay: 50;
    --sn-z-modal: 60;
    --sn-z-toast: 70;
    --sn-z-tooltip: 80;
}

[data-theme='dark'] {
    --sn-shadow-popover: 0 10px 30px -18px rgb(0 0 0 / 0.6);
    --sn-shadow-overlay: 0 24px 64px -32px rgb(0 0 0 / 0.75);
}
```

### 4.8 Breakpoints

CSS custom property không dùng được trong `@media`, nên breakpoint là hằng số ghi trong tài liệu và dùng literal:

| Tên   | Giá trị | Dùng cho                                                 |
| ----- | ------: | -------------------------------------------------------- |
| `xs`  |   480px | điện thoại lớn                                           |
| `sm`  |   640px | mốc chuyển layout hẹp (dialog footer, toast, pagination) |
| `md`  |   768px | tablet dọc, ranh giới 1 cột                              |
| `lg`  |  1024px | tablet ngang, sidebar mở                                 |
| `xl`  |  1280px | desktop                                                  |
| `2xl` |  1440px | container tối đa                                         |

Quy ước mobile-first: viết mặc định cho 375, thêm `@media (min-width: …)`.

> `sm = 640px` là mốc kế thừa từ Tailwind (`sm:` cũ) và đang được dùng ở `overlay.css`, `feedback.css`, `navigation.css`. Không đổi các media query này sang 768; mọi layout mới dùng đúng bảng trên.
>
> **Ngoại lệ Phase 3:** `layouts/workspace.css` dùng `@media (min-width: 769px)` để bật sidebar, vì `Page.css` đang có `@media (max-width: 768px)` kéo `.content` sang `left: 200px`. 769 là chủ đích để hai mốc không chồng nhau; xoá ngoại lệ này khi bỏ `Page.css` ở Phase 11.

### 4.9 Dark mode mechanics

- `<html data-theme="light|dark">`; `data-theme` do JS resolve từ `localStorage('theme')` (`light|dark|system`) + `prefers-color-scheme`.
- **Mirror `.dark` trong giai đoạn chuyển đổi:** Phase 1–10 vẫn set thêm class `.dark` trên `<html>` để `Page.css` (`html.dark`, `body.dark`), `base.css` (`.dark body`) và `legacy-tokens.css` (`.dark`) tiếp tục hoạt động. Phase 11 xoá mirror cùng toàn bộ `.dark` selectors.
- Inline script trong `<head>` của `app.blade.php` để set trước paint, tránh FOUC:

```html
<script>
    (function () {
        try {
            var saved = localStorage.getItem('theme') || 'system';
            var dark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            var root = document.documentElement;
            root.dataset.theme = dark ? 'dark' : 'light';
            root.classList.toggle('dark', dark);
            root.style.colorScheme = dark ? 'dark' : 'light';
        } catch (error) {
            document.documentElement.dataset.theme = 'light';
        }
    })();
</script>
```

- Script phải nằm **trước** `@vite` và trước mọi stylesheet trong `<head>`.
- `useTheme.ts` đổi sang `data-theme` **và** giữ mirror:
    - `root.dataset.theme = isDark ? 'dark' : 'light'`
    - `root.classList.toggle('dark', isDark)`
    - `root.style.colorScheme = isDark ? 'dark' : 'light'` (nếu không, inline `color-scheme` từ script sẽ thắng CSS `[data-theme='dark']`).
    - Giữ API `theme / resolvedTheme / changeTheme`.
    - **SSR-safe:** `config/inertia.php` đang bật SSR; không đọc `localStorage` khi `typeof window === 'undefined'`, và bọc try/catch.
- `Settings/Appearance` giữ 3 lựa chọn; lưu localStorage. Nếu backend đã có cột appearance thì đồng bộ thêm, nhưng **không** đổi schema trong refactor.
- `HandleAppearance` đọc cookie `appearance`, nhưng hiện **không có nơi nào set cookie này**; `$appearance` luôn là `system`. Phase 1 bỏ `@class` trên `<html>` và để inline script set cả `data-theme` lẫn `.dark`; middleware giữ nguyên.
- Không dùng `@media (prefers-color-scheme)` trong component; chỉ fallback ở token.

### 4.10 File CSS

```
resources/css/
├── app.css                     # entry: layer order + import
├── fonts.css                   # @font-face self-host Be Vietnam Pro
├── base.css                    # legacy Nếp, @apply — xoá Phase 11
├── legacy-tokens.css           # legacy shadcn alias — xoá Phase 11
├── tokens.css                  # legacy Tailwind @theme — xoá Phase 11
├── Page.css                    # legacy workspace; 6 block toàn cục nằm trong @layer sn-legacy-reset
├── tokens/
│   ├── primitive.css           # màu gốc
│   ├── semantic.css            # light + dark + fallback
│   └── scale.css               # type, space, size, radius, shadow, motion, z
├── base/
│   ├── reset.css
│   ├── typography.css
│   ├── forms.css
│   └── a11y.css
├── components/                 # global primitive, @layer sn-components
│   ├── button.css              # button, icon-button
│   ├── field.css               # input, textarea, select, checkbox, switch, radio-card, form-field,
│   │                           # search-input, password-strength, rich-text-editor
│   ├── file-dropzone.css
│   ├── overlay.css             # scrim, dialog, sheet, dropdown, tooltip
│   ├── feedback.css            # toaster, toast
│   ├── navigation.css          # tabs, pagination, breadcrumbs, language switcher
│   ├── data.css                # card, table, badge, avatar, skeleton, progress
│   ├── status.css              # alert, empty state, error state
│   └── typography.css          # heading, text, eyebrow, meta, text link
├── layouts/
│   ├── storefront.css
│   ├── auth.css
│   ├── account.css
│   └── workspace.css
└── utilities.css               # .sn-container, .sn-numeric, .sn-visually-hidden, .sn-stack
```

> Danh sách trên là **hiện trạng sau Phase 2** (9 file `components/*`, không phải 18 file như bản kế hoạch ban đầu). Phase 3 thêm `layouts/*.css`; không tách lại các file `components/*` đã gộp.

`app.css`:

```css
@layer sn-legacy-reset, sn-reset, theme, base, sn-base, components, sn-components, sn-layouts, sn-utilities, utilities;

@import 'tailwindcss';
@import './legacy-tokens.css';
@import './tokens.css';
@import './tokens/primitive.css';
@import './tokens/semantic.css';
@import './tokens/scale.css';
@import './fonts.css';

@import './base/reset.css';
@import './base/typography.css';
@import './base/forms.css';
@import './base/a11y.css';

@import './components/button.css';
/* … từng primitive … */

@import './layouts/storefront.css';
@import './layouts/auth.css';
@import './layouts/account.css';
@import './layouts/workspace.css';

@import './utilities.css';
```

> **Layer naming:** dùng `sn-*` để không trùng `base/components/utilities` của Tailwind v4 trong giai đoạn chuyển đổi. Mỗi file CSS tự khai layer bên trong (`@layer sn-base { … }`, `@layer sn-components { … }`, `@layer sn-layouts { … }`, `@layer sn-utilities { … }`); **không** dùng `layer()` trong `@import` để tránh layer lồng nhau.
>
> **Thứ tự bắt buộc:** `sn-legacy-reset, sn-reset, theme, base, sn-base, components, sn-components, sn-layouts, sn-utilities, utilities`. Phải chen `sn-components` **sau** Tailwind `base`/`components` (nếu không preflight reset input/button) và **trước** Tailwind `utilities` (để `className` utility của page vẫn thắng). Đây là lỗi đã gặp ở 2A và đã sửa.
>
> **`sn-legacy-reset` (thêm ở Phase 3):** layer **yếu nhất**, chỉ để chứa 6 block toàn cục của `Page.css` (`*`, `a`, `li`, `html`, `body`, `body.dark`). Vì CSS xếp layer thấp hơn specificity, `Page.css` unlayered hiện đang thắng cả `sn-*` lẫn Tailwind utilities; đưa 6 block đó vào layer yếu làm `sn-*` và utility hoạt động trở lại mà **không** đổi phần còn lại của Page.css. Layer này khai báo **đầu tiên** trong `app.css` để `app.css` (load trước) quyết định thứ tự; nếu chỉ khai trong `Page.css` (load sau) nó sẽ bị chèn vào cuối và mạnh hơn `sn-*`.
>
> **Giai đoạn chuyển đổi (Phase 1–10):** giữ thêm `@import 'tailwindcss';` và `@import './tokens.css';` để các trang chưa migrate không vỡ. Hai dòng này bị xoá ở Phase 11, cùng lúc với `Page.css`.
>
> **Thứ tự kích hoạt:** Phase 1 chỉ import 3 file token và `fonts.css`. Phase 2 thêm khai báo layer (lúc đó chưa có `sn-legacy-reset`) và import từng `components/*.css` khi primitive xong; **chưa** import `base/*`, `layouts/*`, `utilities.css`. Phase 3 thêm `sn-legacy-reset`, tách reset của `Page.css`, rồi import `base/*.css`, `layouts/*.css`, `utilities.css`. Không import trước, tránh đổi giao diện toàn cục khi trang cũ còn chạy.

### 4.11 Utilities tối thiểu

Chỉ được tồn tại 8 utility sau trong `utilities.css`. Không thêm utility mới; nếu cần, tạo class trong module hoặc primitive.

**Phase 2 không import `utilities.css`:** primitive phải tự chứa style (kể cả visually-hidden nếu cần). File này chỉ được import ở Phase 3.

```css
@layer sn-utilities {
    .sn-container {
        width: 100%;
        max-width: var(--sn-container);
        margin-inline: auto;
        padding-inline: var(--sn-gutter);
    }

    .sn-container--narrow {
        max-width: var(--sn-container-narrow);
    }

    .sn-prose {
        max-width: var(--sn-measure-prose);
        font-size: var(--sn-text-md);
        line-height: var(--sn-leading-relaxed);
        color: var(--sn-color-text);
    }

    .sn-prose > * + * {
        margin-top: var(--sn-space-4);
    }

    .sn-numeric {
        font-variant-numeric: tabular-nums slashed-zero;
        font-feature-settings:
            'tnum' 1,
            'zero' 1;
    }

    .sn-label {
        font-size: var(--sn-text-2xs);
        font-weight: var(--sn-weight-semibold);
        letter-spacing: var(--sn-tracking-wider);
        line-height: var(--sn-leading-snug);
        text-transform: uppercase;
        color: var(--sn-color-text-muted);
    }

    .sn-visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
    }

    .sn-stack {
        display: flex;
        flex-direction: column;
        gap: var(--sn-space-4);
    }

    .sn-truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
```

### 4.12 Quy ước đặt class

| Loại                        | Pattern                                          | Ví dụ                                                                                                             |
| --------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Global primitive            | `.sn-<block>` + `[data-variant]` + `[data-size]` | `.sn-btn[data-variant='primary']`                                                                                 |
| Global element              | `.sn-<block>__<element>`                         | `.sn-table__head`, `.sn-card__meta`                                                                               |
| State                       | thuộc tính                                       | `[data-state='open']`, `[aria-current='page']`, `:disabled`                                                       |
| CSS Module                  | camelCase                                        | `.heroSplit`, `.rail`, `.kpiStrip`                                                                                |
| Ghép primitive trong module | `composes`                                       | `.cta { composes: sn-btn from global; }`                                                                          |
| Layer                       | `sn-*` chen Tailwind                             | `sn-legacy-reset, sn-reset, theme, base, sn-base, components, sn-components, sn-layouts, sn-utilities, utilities` |

Không: `.btn-primary`, `.is-primary`, `.mt-4`, `.text-red`, `.p-2`.

---

## 5. Kiến trúc code và quy ước component

### 5.1 Nguyên tắc hybrid

- **Global**: primitive + layout shell + utility. Lý do: dùng ở mọi nơi, cần đồng nhất tuyệt đối, tránh import lặp.
- **CSS Module**: page composition + domain component có layout riêng (`ProductCard`, `OrderTimeline`, `HeroEditorial`, …). Lý do: tránh collision, style đi theo component.

### 5.2 Bỏ `cva`, `clsx`, `tailwind-merge`

Tạo `resources/js/lib/cx.ts`:

```ts
export type ClassValue = string | false | null | undefined;
export function cx(...values: ClassValue[]): string {
    return values.filter(Boolean).join(' ');
}
```

- `cn()` → `cx()` **chỉ trong primitive Phase 2**; pages giữ `cn` đến phase của chúng.
- Bỏ `cva` khỏi 7 primitive UI; giữ export `buttonVariants`/`iconButtonVariants`/`badgeVariants`/`cardVariants`/`inputVariants` dưới dạng helper class string để không phá import cũ.
- `Button` map props sang `sn-btn` + `data-variant` / `data-size`; `className` nối bằng `cx`.
- Không cần merge class vì không còn utility xung đột.

### 5.3 API component

```tsx
<Button variant="primary" size="md" leftIcon={Plus}>
    Thêm sản phẩm
</Button>
```

render:

```html
<button class="sn-btn" data-variant="primary" data-size="md">…</button>
```

Quy ước:

- `variant` (Button): `default | primary | secondary | outline | ghost | tertiary | destructive | link`
- `size` (Button/IconButton): `default | sm | md | lg | icon | icon-sm | icon-lg`
- `size` (Input/Select): `sm | md | lg`
- `tone` (Badge): `neutral | accent | success | warning | danger | outline | ink`
- `tone` (Alert): `info | success | warning | danger` (`info` map về accent)
- `tone` (Toast): `info | success | warning | error` (`error` map về danger)
- `variant` (Card): `flat | raised | inset | ghost`; `padding`: `none | sm | md | lg`
- `variant` (Tabs): `underline | pill | filter`
- Typography: giữ size `display-xl/display-lg/headline-1/2/3/body-lg/md/sm/label-code`, tone `ink/muted/faint/accent/success/warning/danger`, prop `serif`.
- Prop `className` được nối bằng `cx(...)`, không ghi đè.

### 5.4 Mẫu triển khai

**Primitive global:**

```css
/* resources/css/components/button.css */
@layer sn-components {
    .sn-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--sn-space-2);
        height: var(--sn-control-md);
        padding-inline: var(--sn-space-5);
        border: 1px solid transparent;
        border-radius: var(--sn-radius-md);
        font-family: var(--sn-font-sans);
        font-size: var(--sn-text-sm);
        font-weight: var(--sn-weight-medium);
        line-height: var(--sn-leading-none);
        white-space: nowrap;
        cursor: pointer;
        transition:
            background-color var(--sn-dur-fast) var(--sn-ease-standard),
            border-color var(--sn-dur-fast) var(--sn-ease-standard),
            color var(--sn-dur-fast) var(--sn-ease-standard),
            transform var(--sn-dur-instant) var(--sn-ease-standard);
    }

    .sn-btn:focus-visible {
        outline: 2px solid var(--sn-color-focus);
        outline-offset: 2px;
    }

    .sn-btn:active {
        transform: translateY(1px);
    }

    .sn-btn:disabled {
        opacity: 0.55;
        pointer-events: none;
    }

    .sn-btn[data-size='sm'] {
        height: var(--sn-control-sm);
        padding-inline: var(--sn-space-3);
    }

    .sn-btn[data-size='lg'] {
        height: var(--sn-control-lg);
        padding-inline: var(--sn-space-6);
        font-size: var(--sn-text-base);
    }

    .sn-btn[data-variant='primary'] {
        border-color: var(--sn-color-accent);
        background: var(--sn-color-accent);
        color: var(--sn-color-on-accent);
    }

    .sn-btn[data-variant='primary']:hover {
        border-color: var(--sn-color-accent-hover);
        background: var(--sn-color-accent-hover);
    }

    .sn-btn[data-variant='secondary'] {
        border-color: var(--sn-color-border-strong);
        background: var(--sn-color-surface);
        color: var(--sn-color-text);
    }

    .sn-btn[data-variant='secondary']:hover {
        background: var(--sn-color-surface-sunken);
    }
}
```

**Page module:**

```css
/* resources/js/pages/Home/Home.module.css */
.hero {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: var(--sn-space-10);
    align-items: start;
}

.cta {
    composes: sn-btn from global;
}

.cta:global([data-variant='primary']) {
    max-width: 100%;
}

@media (max-width: 768px) {
    .hero {
        grid-template-columns: minmax(0, 1fr);
        gap: var(--sn-space-6);
    }
}
```

```tsx
import styles from './Home.module.css';

<section className={styles.hero}>
    <button className={styles.cta} data-variant="primary">
        Xem chợ hôm nay
    </button>
</section>;
```

### 5.5 Accessibility

- Mọi control có `<label>` thật hoặc `aria-label`; không placeholder-only.
- Focus ring: `outline: 2px solid var(--sn-color-focus); outline-offset: 2px;` không bao giờ `outline: none` mà không thay thế.
- Dialog/Sheet: Radix giữ focus trap; title + description bắt buộc.
- Bảng: `<caption class="sn-visually-hidden">` hoặc `aria-label`.
- Icon-only button: `aria-label`, kích thước tối thiểu 32×32 (desktop) / 44×44 (touch).
- Màu không phải tín hiệu duy nhất: badge trạng thái luôn có chữ.
- `prefers-reduced-motion: reduce` tắt mọi transition/animation không thiết yếu (đã có trong base).

### 5.6 Inline style hợp lệ

Chỉ cho giá trị động:

```tsx
<div style={{ '--sn-progress': `${percent}%` } as React.CSSProperties} />
```

Không: `style={{ color: '#b23a2f' }}`, `style={{ marginTop: 16 }}`.

**Ngoại lệ Phase 3:** `WorkspaceLayout` dùng inline `style={{ width: '100%', left: 0 }}` ở mobile để vượt `.content { left: 230px }` unlayered của `Page.css`. Đây là geometry động theo viewport, không phải màu/spacing tĩnh; xoá cùng `Page.css` ở Phase 11.

---

## 6. Design gate (3 skill hợp nhất)

Mapping skill → vai trò:

| Skill                                  | Vai trò trong refactor                                                      |
| -------------------------------------- | --------------------------------------------------------------------------- |
| `design-taste-frontend` ("taste kill") | Audit trước khi vẽ, luật bố cục/typography/màu, chống giao diện template    |
| `kill-ai-slop` ("unslop")              | Danh mục dấu hiệu AI và cách xoá; soi cả copy lẫn CSS                       |
| `hallmark`                             | Tiêu chuẩn "được thiết kế, không phải được sinh ra"; kiểm tra độ hoàn thiện |

Mỗi page/phase phải qua checklist này. Không đạt = chưa xong.

**Giới hạn áp dụng (theo chính skill):**

`design-taste-frontend` khai báo **không dành cho** dashboard, dense product UI, data table, multi-step form. Vì vậy:

| Bề mặt                                | Áp dụng                                                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Storefront, Auth, About/Contact/Legal | Đầy đủ landing rules + Audit-first + anti-slop + hallmark                                                      |
| Customer account                      | Audit-first, typography, color/shape lock, state coverage; **bỏ** luật hero/eyebrow/bento/marquee              |
| Seller / Admin / Shipper              | Audit-first, color/shape lock, form contrast, state coverage, anti-slop copy; **bỏ** toàn bộ luật landing page |

Ba override có chủ đích, ghi để không ai "sửa" ngược:

1. **Tailwind v4** là mặc định của skill, nhưng dự án đã chốt CSS thuần → override hợp lệ.
2. **Lucide** bị skill khuyến nghị tránh, nhưng dự án đã phụ thuộc Lucide và đã chốt Lucide → override hợp lệ, không trộn bộ icon khác.
3. **Font self-host** là yêu cầu của skill (không link Google Fonts ở production) → Phase 1 chuyển sang `@font-face` self-host.

### 6.1 Audit-first (design-taste-frontend)

- [ ] **Ghi audit 5 dòng trước khi vẽ**, đính trong PR/commit: (1) file page, (2) props thật, (3) các trạng thái có thể xảy ra, (4) trạng thái rỗng/lỗi, (5) hành động chính.
- [ ] Đã đọc props thật và trạng thái thật (loading/empty/error/success) trước khi vẽ.
- [ ] Không bịa số liệu, badge, tab, cột, filter không có trong dữ liệu. Nếu thiếu dữ liệu thì **bỏ bớt UI**, không tạo placeholder giả.
- [ ] Có ít nhất một quyết định bố cục đặc thù cho nội dung (không dùng một template cho mọi trang) và nêu được tên quyết định đó.
- [ ] Thứ bậc thị giác rõ: 1 H1, 1 CTA chính mỗi viewport, phần còn lại lùi.
- [ ] Kiểm tra 375 / 390 / 768 / 1024 / 1440, zoom 200%, không tràn ngang; thử chuỗi tiếng Việt dài nhất và số lớn nhất.

### 6.2 Anti-slop (kill-ai-slop)

- [ ] Không gradient (nền, chữ, viền, button).
- [ ] Không tím/chàm `indigo→violet`, không palette mặc định Tailwind.
- [ ] Không chữ serif, không italic nhấn mạnh, không highlight từ khoá bằng nền vàng.
- [ ] Không glassmorphism, không backdrop-blur trang trí, không glow.
- [ ] Không bo góc quá lớn (`>=16px` cho card), không shadow quá lớn.
- [ ] Không badge/pill spam; không chip cho mọi nhãn.
- [ ] Không icon tự vẽ, không emoji, không "01 / 02 / 03".
- [ ] Không card lồng card; không card cho từng dòng bảng.
- [ ] Không "kicker" in hoa trên mọi heading; chỉ dùng cho metadata thật.
- [ ] Không status dot nhấp nháy vô hạn, không spinner tròn, không wobble.
- [ ] Không callout viền trái màu mè; không icon tile pastel.
- [ ] Không số liệu bịa (`99,9%`, `+128%`) nếu không có nguồn.
- [ ] Không copy AI: "Nâng tầm", "Liền mạch", "Bứt phá", "Không chỉ là… mà còn…".
- [ ] Không em-dash (`—`) hoặc en-dash (`–`) trong chuỗi hiển thị; dùng hyphen.
- [ ] Không heading trung tâm + 3 card bằng nhau + CTA "Tìm hiểu thêm".

### 6.3 Chất lượng thiết kế (hallmark)

- [ ] Typography có tương phản cỡ/weight thật, không cùng một cỡ cho mọi thứ.
- [ ] Màu có vai trò; accent xuất hiện có chủ đích, không rải đều.
- [ ] Layout bất đối xứng khi nội dung cho phép; không mọi section cùng nhịp.
- [ ] Đường kẻ, khoảng trắng và căn lề tạo cấu trúc, không cần trang trí.
- [ ] Trạng thái hover/focus/press/disabled/loading đầy đủ.
- [ ] Micro-motion tinh tế, không loop; tôn trọng reduced motion.
- [ ] Dark mode không phải đảo màu máy móc: wash và border được chỉnh riêng.
- [ ] Ảnh có tỷ lệ và crop nhất quán; không ảnh placeholder lệch tông.

### 6.4 Gate kỹ thuật

- [ ] Không class Tailwind mới.
- [ ] Không hex/rgb trong `.tsx` hoặc component CSS.
- [ ] Không `@apply`, không `!important` ngoài `utilities.css` và `base/a11y.css` (reduced motion).
- [ ] Không Boxicons/FontAwesome trong file đã migrate; file legacy defer vẫn nằm trong allowlist.
- [ ] `npm run types` sạch.
- [ ] `npm run build` sạch.
- [ ] `node scripts/check-tokens.mjs` sạch, **bao gồm `resources/js/**/*.module.css`**.
- [ ] Không lỗi console, không warning React key.

### 6.5 Pre-flight riêng cho Storefront / Auth / Legal

Chỉ áp cho bề mặt public. Workspace bỏ qua mục này.

**Hero**

- [ ] Tối đa 4 phần tử chữ: eyebrow **hoặc** brand strip, headline, subtext, CTA.
- [ ] Headline ≤ 2 dòng ở desktop; nếu 3 dòng thì đó là lỗi cỡ chữ, không phải lỗi copy.
- [ ] Subtext ≤ 20 từ và ≤ 4 dòng.
- [ ] CTA chính thấy được **không cần scroll**; `padding-top` hero ≤ `var(--sn-space-16)` (64 px) ở desktop.
- [ ] Không tagline nhỏ dưới CTA, không trust strip trong hero, không pricing teaser trong hero.
- [ ] Không scroll cue (`Scroll`, mũi tên nhún, chuột cuộn).

**Nhịp section**

- [ ] Eyebrow (nhãn in hoa trên heading) ≤ `ceil(số section / 3)`; hero tính là 1.
- [ ] Không split-header kiểu "headline lớn bên trái + đoạn giải thích nhỏ bên phải" nếu cột phải chỉ có chữ.
- [ ] Không quá 2 section liên tiếp dùng cùng layout ảnh + chữ.
- [ ] Một trang có ≥ 4 kiểu layout khác nhau nếu có ≥ 8 section.
- [ ] Không section đánh số `01 / 02 / 03`; không badge trang trí; không status dot không mang nghĩa.

**CTA và form**

- [ ] Nhãn CTA không xuống dòng ở desktop, ≤ 3 từ cho CTA chính.
- [ ] Không hai CTA cùng ý trên một trang.
- [ ] Form: label trên, helper dưới, error dưới; placeholder không thay label.
- [ ] Contrast CTA và form đạt AA (4,5:1 body, 3:1 chữ lớn).

**Hình ảnh và theme**

- [ ] Ảnh thật (asset thật hoặc `picsum.photos/seed/...`), không fake screenshot bằng `<div>`.
- [ ] Không overlay pill/tag lên ảnh; caption nằm ngoài ảnh.
- [ ] Một theme cho cả trang; không section nào tự đảo sáng/tối giữa trang.
- [ ] Logo wall (nếu có) chỉ có logo, không kèm nhãn ngành nghề.

**Copy**

- [ ] Không em-dash/en-dash trong chuỗi hiển thị.
- [ ] Không số liệu giả chính xác.
- [ ] Không nhãn thơ mộng kiểu "Ghi chép từ xưởng", "Đang trên bàn".
- [ ] Đọc lại toàn bộ chuỗi hiển thị, không còn câu tối nghĩa hoặc nghe như máy viết.

---

## 7. Lộ trình 12 phase

### Phase 0 — Baseline, đóng băng, guardrail

**Mục tiêu:** chốt điểm xuất phát, chặn Tailwind phát sinh, thay công cụ kiểm tra.

**Việc làm**

1. Tạo `docs/ui/BASELINE.md`: inventory 78 page + 47 primitive + **41 file** `Page.css`, mapping page → layout hiện tại, **kèm props chính, các trạng thái dữ liệu, trạng thái rỗng/lỗi và hành động chính của từng page**. Ghi rõ 17 render target thiếu (gồm `Admin/Inventory/Report`).
2. Ghi quy tắc đóng băng vào `AGENTS.md` (mục Frontend): "Không thêm class Tailwind; UI mới dùng token + `sn-*`; file đã migrate phải bỏ khỏi `scripts/token-allowlist.json`".
3. Viết lại `scripts/check-tokens.mjs` theo hướng **ratchet**:
    - Giữ nguyên cơ chế `--write-baseline` ghi file-level allowlist (65 file trước Phase 0; baseline mới 187 file sau khi mở rộng rule).
    - `raw-hex` trong `resources/js/**/*.{ts,tsx}`. Baseline sẽ chứa `resources/js/app.tsx` vì còn `#4B5563`.
    - `tailwind-utility` **chỉ quét class string** (`className=`, `cn(`, `cx(`, `clsx(`), không quét toàn dòng để tránh false positive với comment/chuỗi tiếng Việt.
    - `legacy-icon`, `arbitrary-value`, `apply-directive`, `css-hardcoded-color` trong `components/**` và `layouts/**` (cho phép trong `tokens/`).
    - Output `file:line:rule:match`; exit 1 nếu có vi phạm **ngoài allowlist**.
4. **Giữ** `scripts/token-allowlist.json` đến Phase 11 làm ratchet. Sau khi thêm rule mới, chạy `npm run check:tokens:baseline` để ghi baseline. Không xoá file này ở Phase 0.
5. Giữ các script hiện có (`check:tokens`, `check:tokens:all`, `check:tokens:baseline`); thêm `check:css` như alias. Không đổi tên cũ để không phá CI/AGENTS.
6. Chụp 12 ảnh baseline thủ công (không cài Playwright) ở 1440 + 390, lưu `docs/ui/baseline/`; thêm `docs/ui/baseline/` vào `.gitignore`.
7. Chuẩn bị font: tải `woff2` Be Vietnam Pro (400/500/600/700, subset latin + vietnamese) vào `public/fonts/be-vietnam-pro/` để Phase 1 không bị chặn.

**DoD:** `npm run check:css` **pass ở chế độ ratchet** (mọi vi phạm còn lại nằm trong allowlist); baseline mới được ghi (**187 file / 4.755 vi phạm**); `npm run types` + `npm run build` sạch; không sửa page nào.

---

### Phase 1 — Token, reset, base, dark mode

**Mục tiêu:** có nền CSS thuần chạy song song, không phá trang cũ.

**Tạo**

- `resources/css/tokens/primitive.css`
- `resources/css/tokens/semantic.css`
- `resources/css/tokens/scale.css`
- `resources/css/base/reset.css`
- `resources/css/base/typography.css`
- `resources/css/base/forms.css`
- `resources/css/base/a11y.css`
- `resources/css/fonts.css` — chỉ chứa `@font-face`, được import ngay Phase 1
- `resources/css/utilities.css`

**Sửa**

- `resources/css/app.css`: **chỉ thêm**, không xoá gì ở phase này.
    - Giữ nguyên `@import 'tailwindcss'`, `@custom-variant dark`, `@source`, `tokens.css`, `base.css` để trang chưa migrate không vỡ.
    - Thêm `@import './tokens/primitive.css'`, `semantic.css`, `scale.css` ngay sau `@import 'tailwindcss'`.
    - Thêm `@import './fonts.css'` ngay sau khối token để font local có hiệu lực từ Phase 1.
    - **Chưa** import `base/*` (trừ `fonts.css`) và `components/*`; các file này được tạo nhưng chỉ kích hoạt từ Phase 3, tránh đổi giao diện toàn cục khi trang cũ còn chạy.
- `resources/css/base.css`: giữ nguyên đến Phase 11. Nội dung mới nằm ở `base/`, không ghi đè file cũ.
- `resources/css/tokens.css`: giữ nguyên đến Phase 11 (class Tailwind cũ như `bg-rice-paper`, `text-ink` vẫn cần `@theme`). Token mới sống song song, prefix `--sn-` nên không xung đột.
- **Font: self-host Be Vietnam Pro** (bắt buộc theo `design-taste-frontend`; không link Google Fonts ở production).
    - `public/fonts/be-vietnam-pro/` đã có 8 `woff2` từ Phase 0 (400/500/600/700, latin + vietnamese).
    - Copy `public/fonts/be-vietnam-pro/font-faces.css` vào `resources/css/fonts.css` (chỉ `@font-face`; giữ `font-display: swap`, `unicode-range`).
    - Weight 400–700 là đủ: codebase chỉ dùng `font-normal/medium/semibold/bold`; không có 300/800.
- `resources/views/app.blade.php`:
    - Thêm inline script set **cả** `data-theme` và mirror `.dark` trước paint; đặt trước `<style>` và `@vite`.
    - Bỏ `@class(['dark' => ...])` trên `<html>`; script set cả `data-theme` và `.dark`.
    - **Giữ** `<style> html { background-color: #f6f1e6; }` và `html.dark { ... }` đến Phase 11 (mirror legacy).
    - Xác nhận `fonts.css` đã được import qua `app.css` (không khai `@font-face` trực tiếp trong Blade).
    - Bỏ `<link>` Google Fonts **và** 2 `<link rel="preconnect">` sau khi font local chạy đúng.
    - **Chưa** xoá Boxicons (Phase 11).
    - **Chưa** bỏ `class="font-sans antialiased"` trên `<body>` (Phase 11).
- `resources/js/app.tsx`: đổi `progress.color` từ `#4B5563` sang `var(--sn-color-accent)`.
- `resources/js/hooks/useTheme.ts`:
    - Set `root.dataset.theme`, mirror `root.classList.toggle('dark', isDark)`, và `root.style.colorScheme`.
    - **SSR-safe:** `config/inertia.php` đang bật SSR; không đọc `localStorage` khi `typeof window === 'undefined'`; bọc try/catch.
    - Giữ nguyên API `theme / resolvedTheme / changeTheme`.
- **Exception `!important`:** chỉ `resources/css/base/a11y.css` được dùng `!important` cho block `prefers-reduced-motion`; cập nhật `scripts/check-tokens.mjs` cho phép path này, **không** thêm file vào allowlist.
- `resources/css/app.css` Phase 1 **chưa** thêm khai báo `@layer sn-*`; chỉ import token + fonts. Khai báo layer + import `components/*` làm ở Phase 2; `base/*`/`layouts/*`/`utilities.css` ở Phase 3.

**Quy ước "chưa kích hoạt toàn cục"**

- `base/*.css` (trừ `fonts.css`) chỉ import từ Phase 3; `components/*.css` import từ Phase 2.
- Trong giai đoạn chuyển đổi, nền trang do class `.sn-shell` trên root của từng layout đặt (`background: var(--sn-color-canvas)`), **không** đặt trên `body`. Phase 11 mới chuyển về `body`.

**Reset phải xử lý**

- `Page.css` đang có `* { margin:0; padding:0; box-sizing:border-box; font-family:... }`. Nếu reset mới đặt trong `@layer sn-reset`, nó sẽ **thua** `Page.css` (unlayered). Vì vậy Phase 1 chỉ tạo reset trong layer (chưa import đến Phase 3), **không** xoá reset cũ; Phase 11 xoá `Page.css` sau khi các wrapper legacy và `AppLayout` đã bị xoá.
- `html { overflow-x: hidden }` của `Page.css` giữ tạm; Phase 11 mới bỏ và kiểm tra tràn ngang thật.

**DoD:** app chạy như trước ở light mode; `data-theme` + mirror `.dark` + `color-scheme` đổi đồng bộ; Appearance toggle hoạt động; SSR không lỗi `localStorage`; font self-host render đúng dấu tiếng Việt; **không còn request tới `fonts.googleapis.com` / `fonts.gstatic.com`**; không còn `#4B5563` trong `app.tsx`; `npm run format:check` pass; `npm run check:css` pass; `npm run types` + `npm run build` sạch.

---

### Phase 2 — 37 primitive dùng chung (10 legacy defer)

**Mục tiêu:** thay các primitive dùng chung bằng CSS thuần, giữ nguyên API public. Nhóm workspace legacy được defer để tránh map 64 Boxicon và tránh double work với Phase 3.

**Phạm vi:** 37 file. **Defer sang Phase 3/7/8:** `action-button`, `action-buttons`, `action-dropdown`, `confirmation-modal`, `data-table`, `filter-panel`, `header`, `insights`, `navbar`, `sidebar`.

**2A — Form controls (15) — DONE 2026-11-22**

`button`, `icon-button`, `input`, `textarea`, `select`, `checkbox`, `switch`, `radio-card`, `form-field`, `input-error`, `search-input`, `password-strength`, `file-dropzone`, `rich-text-editor`, `primary-input` (legacy wrapper của `Input`).

**2B — Overlay + feedback (9) — DONE 2026-11-22**

`dialog`, `sheet`, `dropdown-menu`, `tooltip`, `toast`, `toaster`, `tabs`, `pagination`, `breadcrumbs`.

CSS: `components/overlay.css` (scrim, dialog, sheet, dropdown, tooltip), `components/feedback.css` (toaster, toast), `components/navigation.css` (tabs, pagination, breadcrumbs).

**2C — Data display (13) — DONE 2026-11-22**

`card`, `table`, `badge`, `status-badge`, `avatar`, `alert`, `empty-state`, `error-state`, `skeleton`, `progress`, `typography`, `text-link`, `language-switcher`.

CSS: `components/data.css` (card, table, badge, avatar, skeleton, progress), `components/status.css` (alert, empty state, error state), `components/typography.css` (heading, text, eyebrow, meta, text link), `sn-lang*` trong `components/navigation.css`.

`quantity` (`commerce/QuantityStepper`) và `mobile-nav` (layout) không thuộc 37 file này; xử lý ở Phase 3/4.

**Phase 2 hoàn tất: 37/37 primitive.**

**Quy tắc**

- Tạo `resources/js/lib/cx.ts`; primitive mới dùng `cx`, pages vẫn dùng `cn` đến phase của chúng.
- Thêm `@layer sn-reset, theme, base, sn-base, components, sn-components, sn-layouts, sn-utilities, utilities;` vào `app.css` **trước** import, rồi import từng `components/*.css` khi primitive xong. (Phase 3 chèn thêm `sn-legacy-reset` lên **đầu** danh sách — xem §4.10.)
- Không import `base/*`, `layouts/*`, `utilities.css` trong Phase 2.
- Không `@apply`, không `!important`, không hex trong component CSS; dùng `--sn-*`.
- Bỏ `cva` khỏi 7 file UI (`button`, `icon-button`, `badge`, `card`, `input`, `skeleton`, `typography`). `commerce/Price.tsx` để Phase 4; dependency `class-variance-authority` giữ đến Phase 11.
- Giữ export tương thích `buttonVariants`, `iconButtonVariants`, `badgeVariants`, `cardVariants`, `inputVariants`, `skeletonVariants` dưới dạng helper class string nếu đang export.
- **Giữ nguyên API/variant đang dùng**, không chỉ danh sách trong plan:

| Component    | Giá trị phải hỗ trợ                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button       | `default`, `primary`, `secondary`, `outline`, `ghost`, `tertiary`, `destructive`, `link`; size `default/sm/md/lg/icon/icon-sm/icon-lg`               |
| Badge        | tone `neutral`, `accent`, `success`, `warning`, `danger`, `outline`, `ink`; size `sm/md`                                                             |
| Alert        | tone `info`, `success`, `warning`, `danger` (map `info` → accent)                                                                                    |
| Toast        | tone `info`, `success`, `warning`, `error` (map `info` → accent, `error` → danger)                                                                   |
| Card         | variant `flat`, `raised`, `inset`, `ghost`; padding `none/sm/md/lg`                                                                                  |
| Tabs         | variant `underline`, `pill`, `filter`                                                                                                                |
| Typography   | size `display-xl`, `display-lg`, `headline-1/2/3`, `body-lg/md/sm`, `label-code`; tone `ink/muted/faint/accent/success/warning/danger`; prop `serif` |
| Input/Select | size `sm/md/lg`; `invalid`; `aria-invalid`                                                                                                           |

- `typography` **giữ component** `Heading/Text/Eyebrow/MetaText` (19 file dùng); đổi ruột sang `sn-*` + `cx`; thêm `resources/css/components/typography.css`. Xoá component ở Phase 11 nếu đã migrate hết.
- `className` của consumer phải được nối bằng `cx`, không ghi đè.
- `.prettierignore` đang ignore `components/ui`; format thủ công các file đã sửa, `format:check` sẽ không bắt.
- Xoá entry `components/ui/*` khỏi `scripts/token-allowlist.json` ngay khi file sạch. File defer vẫn nằm trong allowlist.
- **Không** rewrite `data-table` theo giả định sort/select: API thực tế là `columns, data, headerTitle, headerIcon: string`; xử lý ở Phase 7/8.
- **Không** map 64 Boxicon string trong Phase 2; các page legacy giữ icon string đến phase tương ứng.

**Checkpoint từng đợt**

1. Rewrite + CSS + xoá allowlist của đợt.
2. `npm run check:css`, `npm run types`, `npm run build`.
3. Render thử 2 page đang dùng primitive (login + một page customer).
4. Chỉ sang đợt tiếp theo khi pass.

**DoD:** 37 primitive render đúng light/dark; API/variant không đổi; `check:css` sạch cho các file đã rewrite (file defer vẫn allowlist); `types` + `build` pass. Ghi nhận đây là **thay đổi visual toàn cục có chủ đích** trên các page chưa migrate (Button 39 file, Input 16, Card 14, Badge 16, Pagination 15).

---

### Phase 3 — Shell và layout

**Mục tiêu:** 4 khung trang mới, thay `AppLayout`. Đây là phase mở workspace nên phải xử lý nợ layer/Page.css trước khi vẽ.

**3.0 — Chuẩn bị (làm trước, không vẽ gì)**

1. **Commit 2A/2B/2C** thành 3 commit riêng theo §13; sau đó `git mv` 7 file `components/ui` về chữ thường (`avatar`, `header`, `insights`, `navbar`, `pagination`, `sidebar`, `tooltip`) để checkout Linux không fail.
   - **Thực tế:** 2A/2B/2C đang nằm gộp trong một commit. Không rewrite history; chỉ cần commit Phase 3 (và hotfix) riêng, ghi rõ trong PR.
2. **`sn-legacy-reset`:** thêm layer này **đầu tiên** trong câu `@layer` của `app.css`, rồi bọc 6 block toàn cục của `Page.css` vào `@layer sn-legacy-reset { … }`:
    - `*` (margin/padding/box-sizing/font-family), `a`, `li`, `html`, `body`, `body.dark`.
    - **Không** đụng phần còn lại của `Page.css` (`.sidebar`, `.content`, `.orders`, `.header`…).
    - Lý do: `Page.css` unlayered đang thắng mọi `sn-*` và Tailwind utility (đo được: `.sn-btn` 24px → 0px). Nếu không sửa, mọi shell đặt trên `sn-*` sẽ mất padding.
3. **Scope `base/*.css`:** đổi `body`, `a`, `label` trong `base/typography.css` + `base/forms.css` thành `.sn-shell` / `.sn-shell a` / `.sn-shell label` (và `.sn-shell` cho font-size/color). Rule reset + `a11y` giữ toàn cục. Phase 11 bỏ scope.
   - **Hotfix Phase 3:** bản hiện tại đang scope rộng hơn (h1-h6, strong, small, code, hr, toàn bộ form element). Trước Phase 4 phải thu hẹp về đúng body/a/label để tránh restyle 41 trang legacy.
4. **Baseline 5 trang legacy:** chụp ảnh 1440 + 390 trước khi bật CSS, lưu `docs/ui/baseline/` (đã gitignore). Dùng để so sau bước 5.

**3.1 — Hotfix bắt buộc trước Phase 4 (đã hoàn tất 2026-11-23)**

Các mục dưới đây phát hiện khi rà soát sau Phase 3; đã xử lý trước khi build Phase 4:

1. **Nền storefront:** `StorefrontLayout` đang đặt `data-theme="light"` trên `<main>` nhưng `.sn-storefront__main` không có background; root vẫn tối. Đo CDP: root `rgb(13,15,12)`, main trong suốt, heading `rgb(21,22,15)` → chữ tối trên nền tối ở mọi section không `bg-*`. Thêm `background: var(--sn-color-canvas)` cho `.sn-storefront__main` **và** chuyển pin light sang prop `pinLight` ở root (quyết định #21).
2. **Pagination:** `Pagination` render `<nav>` nên bị `.content nav` unlayered biến thành topbar (đo được `height:56px`, `position:sticky`, `z-index:1000`). Đổi 2 nhánh sang `<div role="navigation">` (quyết định #22); retest `Admin/Products`, `Admin/Users`, `Admin/Promotions/Index`, `Seller/Products`.
3. **Base scope:** thu hẹp `base/typography.css` + `base/forms.css` về body/a/label (quyết định #26).
4. **Kiểm chứng tối thiểu:** chụp/so 5 trang legacy ở 1440; smoke 4 layout; kiểm dialog/sheet trên workspace nằm trên sidebar; kiểm mobile 375/390.
5. **Tooling:** mở rộng `scripts/check-tokens.mjs` quét `resources/js/**/*.module.css` (quyết định #31) trước khi Phase 4 tạo module CSS.
6. **Git/docs:** khôi phục `PROMPT.md`, `STITCH-DESIGN.md`, `DESIGN-02.md` (quyết định #30); commit Phase 3 riêng, không trộn các xoá tài liệu.
7. **Cập nhật log:** sửa lại tuyên bố “dark mode render đúng” ở §15; hiện storefront dark mode **chưa đạt** cho đến khi xong mục 1.

**Kết quả hotfix:**

- `StorefrontLayout` nhận `pinLight` (default `true`) và đặt `data-theme` ở root; bỏ pin khỏi `<main>`. `.sn-storefront__main` có `background` + `color` token. CDP: root/main `rgb(242,242,238)`, heading `rgb(21,22,15)`, không còn chữ tối trên nền tối.
- `Pagination` render `div role="navigation"` ở cả 2 nhánh; harness `app.css + Page.css`: pagination `height:40px`, `static`, `z:auto`; `<nav>` đối chứng vẫn `56px/sticky/1000`.
- `base/typography.css` + `base/forms.css` chỉ còn `.sn-shell`, `.sn-shell a`, `.sn-shell label`; bundle CSS giảm còn **186,57 kB**.
- `check-tokens.mjs` quét thêm `resources/js/**/*.css` và đưa module vào `isCssColorScope`.
- Khôi phục `PROMPT.md`, `STITCH-DESIGN.md`, `DESIGN-02.md`.
- Feature tests: `ProductManagementTest`, `UserControllerTest`, `Seller/ProductControllerTest`, `Seller/DashboardControllerTest` — **40 passed / 200 assertions** (chỉ DEPRECATION PHP 8.5).
- `format:check`, `check:css` (129 file, 143 allowlisted), `types`, `build` pass.
- Còn nợ thủ công: 5 ảnh so sánh legacy (đặc biệt Admin/Promotions chưa có test) và dialog/sheet trên workspace; cần phiên đăng nhập/DB phù hợp.

**Storefront**

- `StorefrontLayout`, `StorefrontHeader`, `StorefrontFooter`, `MobileNav`, `PageContainer`, `PageHeader`, `SectionHeader`.
- **Không** làm `UtilityStrip` trong Phase 3; **Phase 4 bỏ hẳn khỏi Home**, giữ file + allowlist đến Phase 11 (quyết định #23). Header đã có locale/currency, `TrustStrip` phủ 4 fact.
- Header 56 px (`--sn-header`), sticky, border-bottom; search ở giữa; account/cart phải. Giữ nguyên hành vi: search `router.get('/search', { search })`, dropdown locale/currency `POST /language` + `/currency`, badge giỏ/thông báo, menu mobile qua `MobileNav`.
- Footer 4 cột trên nền `canvas-alt`; giữ `NewsletterSignup`, `PaymentMarks`, social row.
- `PageContainer` giữ đủ 4 size `page | prose | narrow | full`; `page` dùng `.sn-container`, `prose` dùng `--sn-measure-prose`, `narrow` giữ ~48rem.
- Giữ nguyên `ChatDock` mount một lần trong `StorefrontLayout` qua prop `showChatDock` và logic ẩn ở auth/checkout/chat/workspace. Không mount bubble thứ hai.

**Auth**

- `AuthLayout`, `AuthBrandPanel`: split **6/6**, form rộng `--sn-container-form` (420 px); trang đăng ký dùng `--sn-container-form-wide` (600 px, quyết định #34).
- Panel trái là editorial: logo, eyebrow, headline, mô tả, **3 trust point không số**, hotline/email. **Bỏ ảnh picsum và bỏ ý "số liệu thật"** (shared props không có số, backend ngoài phạm vi). Tối đa 4 phần tử chữ — không lặp eyebrow + tagline + label role (quyết định #35).
- Giữ `variant="centered"` cho các trang không dùng split (`ForgotPassword`, `ResetPassword`, `VerifyEmail`, `ConfirmPassword`).

**Account**

- `AccountLayout`: rail 220 px (`--sn-account-rail`) + content; tab dọc; mobile thành scroll tabs (không dựng `<select>` mới).
- Tiếp tục wrap `StorefrontLayout` để thừa hưởng `ChatDock` và footer; không tự mount chat.
- Giữ nguyên 7 mục nav và `resolveActiveKey`.

**Workspace**

- `WorkspaceLayout` thay `layouts/app/AppLayout`; giữ `<div className="content"><main>{children}</main></div>` vì **66 selector** của `Page.css` bám vào `.content`.
- `WorkspaceSidebar`: **230 px** (khớp `calc(100% - 230px)` của Page.css, không dùng 232), icon Lucide, active = `accent-wash` + thanh 2 px accent trái. Dùng class riêng (`sn-workspace__sidebar`), **không** dùng `.sidebar` để tránh `z-index: 2000` đè modal.
- `WorkspaceTopbar` 56 px, giữ đủ chức năng đã chốt:
    - search desktop (placeholder `t('Search...')`), ẩn dưới 768 px; **không** thêm search mobile ở Phase 4
    - chuông + `unreadCount` + polling `/api/notifications/unread-count` mỗi 30 s
    - `LanguageSwitcher`
    - avatar menu: Hồ sơ, Đổi mật khẩu, Cài đặt, Đăng xuất
    - theme toggle (mới, dùng `useTheme`)
    - toggle sidebar chỉ mobile; **desktop collapse defer Phase 11** (xem quyết định #25)
    - **breadcrumb nằm ở `PageHeader`**, không lặp trong topbar
- Nav role **giữ nguyên label + href** cho admin/seller; **shipper rút còn Dashboard + Cài đặt** (6 href còn lại chưa có route; ghi backlog).
- Giữ file `layouts/app/AppLayout.tsx` làm re-export tạm đến Phase 11 (39 page import default).
- Xử lý wrapper legacy defer từ Phase 2: `header`, `navbar`, `sidebar`, `filter-panel`. `action-*`, `data-table`, `insights`, `confirmation-modal` để Phase 7/8.
    - `header.tsx`: map `title/breadcrumbs/reportButton` sang `PageHeader` + `Breadcrumbs` (`active` → `current`), giữ `icon: string` (Boxicons) cho `reportButton`.
    - `filter-panel.tsx`: giữ API `searchConfig/filterConfigs/buttonConfigs/reportButtonConfig`, giữ `icon: string`; bỏ inline style `var(--light)`; dùng `Input` + `Select` + `Button`.
    - `navbar.tsx`/`sidebar.tsx`: chỉ còn dùng bởi `AppLayout`; sau khi re-export thì để nguyên (vẫn allowlist) và xoá Phase 11.

**Kích hoạt CSS toàn cục**

- `app.css` thêm `@import './base/reset.css'`, `typography.css`, `forms.css`, `a11y.css`, `./layouts/{storefront,auth,account,workspace}.css`, `./utilities.css`; **không** dùng `layer()` trong `@import`.
- Mỗi layout root thêm `className="sn-shell"`; nền `var(--sn-color-canvas)` đặt ở `.sn-shell`, chưa đặt lên `body`.
- `layouts/*.css` đặt dưới `@layer sn-layouts`.

**Kiểm chứng bắt buộc**

1. **Regression `sn-*`:** trên một trang workspace, `.sn-btn` padding-left phải > 0 và `.sn-input` padding-left > 0 (đây là bài test bắt được lỗi unlayered; trước Phase 3 cả hai bằng 0).
2. **Nền storefront:** sau hotfix, `.sn-storefront__main` phải có background `var(--sn-color-canvas)` (đo computed style > 0 alpha), không còn chữ tối trên nền tối ở dark mode.
3. **Pagination:** `Pagination` phải render `div role="navigation"`, không phải `<nav>`; computed `height` không còn 56px/sticky/z 1000.
4. **5 trang legacy** (Admin/Products, Admin/Users, Admin/Promotions/Index, Seller/Dashboard, Seller/Products) so ảnh trước/sau ở 1440; chấp nhận thay đổi spacing do Tailwind utility bắt đầu có hiệu lực, nhưng không được vỡ bố cục.
5. Header/sidebar/topbar ở 375, 390, 768, 1024, 1440; không tràn ngang.
6. Light + dark; dialog/sheet mở trên workspace phải nằm **trên** sidebar.
7. Thêm key i18n còn thiếu vào **cả** `lang/vi.json` và `lang/en.json`: `Search`, `Search...`, `Shops` (`auth.logout` đã có).
8. `npm run check:css`, `npm run types`, `npm run build`.

**DoD:** 4 layout render với 1 page giả mỗi loại; `.sn-*` giữ padding trên workspace; 5 trang legacy không vỡ; nav đúng role (shipper 2 mục); modal nằm trên sidebar; mobile không tràn; dark mode đúng; allowlist giảm ít nhất 2 entry (`header`, `filter-panel`); `navbar`/`sidebar` thành dead code nhưng vẫn để nguyên + allowlist đến Phase 11.

> **Trạng thái 2026-11-23:** hotfix §3.1 đã xong; DoD kỹ thuật đạt. Còn review thủ công 5 ảnh legacy + dialog workspace khi có phiên đăng nhập; 4/5 trang legacy đã có test render pass. Phase 4 có thể bắt đầu sau khi commit Phase 3.

---

### Phase 4 — Storefront (8 page)

|   # | Page                     | Ghi chú                                                                        |
| --: | ------------------------ | ------------------------------------------------------------------------------ |
|   1 | `Home/Index`             | Hero 7/5, 6 category tile, shelf 4-up, trust strip 4 fact; giữ BrandSpotlight + EditorialPillars nhưng bỏ 01/02/03 và badge trùng; **bỏ UtilityStrip + voucher band** |
|   2 | `Home/Search`            | Filter rail 264 px, sticky, mobile bottom sheet                                |
|   3 | `Customer/ProductDetail` | Gallery 7/5, buy box sticky, spec table, review                                |
|   4 | `Home/About`             | Editorial; **không có prop/số liệu** — không bịa số (xem ghi chú dưới)         |
|   5 | `Home/Contact`           | Form + thông tin                                                               |
|   6 | `Legal/Terms`            | Prose 65ch                                                                     |
|   7 | `Legal/PrivacyPolicy`    | Prose 65ch                                                                     |
|   8 | `Legal/SellingPolicy`    | Prose 65ch                                                                     |

**Component trọng tâm:** `storefront/*` (10 file, **trừ `UtilityStrip` không migrate**), `commerce/{ProductCard, ProductGrid, ProductGallery, BuyBox, VariantSelector, QuantityStepper, Price, Rating, ReviewCard, ReviewSummary, SpecTable, ShopIdentity, CategoryPills, ActiveFilters, FilterGroup, FilterRail, Countdown}`.

`commerce/Price.tsx` đang dùng `cva`; chuyển sang `data-*` trong phase này, không để sót sang Phase 11. `commerce/Countdown.tsx` là dependency của `FlashSaleModule`, đưa vào scope Phase 4.

**Luật riêng**

- Hero chỉ 1 CTA, không carousel, không mũi tên cuộn. **Bỏ trust strip khỏi hero**; trust strip là section riêng.
- CTA chính ≤ 3 từ, không xuống dòng ở desktop.
- Category tile: 6, không tô màu riêng.
- Product card: ảnh 4:5, không shadow, hover chỉ border + gạch chân tên. **Bỏ badge/pill phủ lên ảnh**; đưa metadata ra ngoài ảnh nếu cần.
- Trust strip: 4 mục ngăn bằng divider, không 4 card.
- Không section "3 card bằng nhau"; không đánh số `01/02/03`; eyebrow ≤ `ceil(số section / 3)`.
- `BrandSpotlight` + `EditorialPillars`: giữ nhưng redesign; bỏ badge trùng eyebrow, bỏ nhãn số, bỏ copy slop.
- **Không số liệu giả:** bỏ `1.200+`, `100%`, `299.000 ₫`, `3 phút`, `2h` nếu không có props/DB.
- **Không badge xác thực giả:** bỏ “Shop Việt” trên `ProductCard`/`ShopIdentity` và “Đã mua” trên review khi không có cờ xác thực từ backend.
- **Dark mode:** 8 trang Phase 4 truyền `pinLight={false}`; Account/Cart/Checkout/PaymentResult vẫn pin `true` đến Phase 6.
- `Home/About` và `Home/Contact` render bằng closure trong `routes/web.php`, **không truyền prop nào**; không dựng bảng số liệu/KPI. Muốn có số thật phải bổ sung controller/props — ghi backlog, không làm trong refactor.
- Legal: viết lại nội dung tiếng Việt (hiện đang English), prose 65ch; không giữ “Terms of Service/Privacy Policy/Selling Policy”.
- Copy: xoá toàn bộ en-dash/em-dash trong page/component Phase 4 (`Search`, `Contact`, `BuyBox`, …).

**DoD:** 8 trang hợp lệ ở 375/390/768/1024/1440; ảnh không nhảy layout (đặt `width/height` hoặc `aspect-ratio`); dark mode đạt; không còn class Tailwind/Nếp trong file đã migrate; mỗi page có `*.module.css`; allowlist giảm tương ứng; `types` + `build` + `check:css` sạch.

> **Trạng thái 2026-11-23:** 8 page đã migrate; `Price` bỏ `cva`; thêm `Countdown`; `ProductCard`/`ShopIdentity` bỏ badge xác thực giả, badge ra khỏi ảnh; Home bỏ UtilityStrip/voucher/hero trust/số liệu giả/01-02-03, còn 7 section + 2 eyebrow; Search rail 264px sticky, mobile sheet, filter group rỗng bị ẩn; Legal viết lại tiếng Việt prose 65ch; copy en-dash đã xoá.
> Allowlist 143 → **112**; `check:css` pass (167 file checked); `types`/`format:check`/`build` pass; CSS bundle **130,77 kB** (đo lại 2026-11-23: `app-*.css` 179,67 kB + chunk `Page.css` 43,85 kB — xem §2.6 và ghi chú ở §15). Runtime: 7 trang guest verify light/dark, không tràn ngang ở 375/390/768/1024/1440; `ProductDetail` chưa có product trong DB để chụp, cần review khi có dữ liệu mẫu.

---

### Phase 5 — Auth (8 page)

|   # | Page                     | Layout                    | Ghi chú                                                                                   |
| --: | ------------------------ | ------------------------- | ----------------------------------------------------------------------------------------- |
|   9 | `Auth/Login`             | split 6/6, form 420       | Nhận `canResetPassword` + `status`; Google button; flash `status` hiển thị bằng `Alert`     |
|  10 | `Auth/Register`          | split 6/6, form 600       | Đồng bộ validate client với `RegisterRequest`; `PasswordStrength` dùng `Progress`           |
|  11 | `Auth/ForgotPassword`    | centered 420              | Giữ `status` success bằng `Alert`                                                          |
|  12 | `Auth/ResetPassword`     | centered 420              | Email readonly + token hidden; 2 field mật khẩu                                            |
|  13 | `Auth/VerifyEmail`       | centered 420              | Thay `ResultState` bằng bản CSS thuần (migrate cùng phase)                                 |
|  14 | `Auth/SellerRegister`    | split 6/6, form 600       | Qua `components/auth/SellerRegisterForm`; **1 trang 3 section**, không có stepper          |
|  15 | `Auth/ShipperRegister`   | split 6/6, form 600       | 3 section + 3 dropzone tài liệu                                                            |
|  16 | `Auth/ConfirmPassword`   | centered 420              | **Tạo mới** (quyết định #32); route `password.confirm` đã có sẵn                            |

**File chạm:** 8 page + `components/auth/SellerRegisterForm.tsx` + `components/layout/{AuthLayout,AuthBrandPanel}.tsx` + `components/ui/password-strength.tsx` + `components/ui/file-dropzone.tsx` (thêm prop) + `components/feedback/ResultState.tsx` + `css/layouts/auth.css` + `css/components/{field,status}.css` + `css/tokens/scale.css`.

**Luật riêng**

- Split layout, không card giữa màn hình; form là trung tâm, panel trái là brand ledger.
- Form: label trên, helper (`hint`) dưới, error dưới, không floating label. `FormField` đã hỗ trợ `hint`/`error`/`counter` — dùng, không tự dựng label.
- `PasswordStrength` viết lại bằng `Progress` **1 thanh** + nhãn chữ; score 0–4 map tone `danger/warning/success`; xoá `.sn-password*` khỏi `field.css` (quyết định #33).
- Social login (Google) là `Button variant="secondary"` có logo thật `/google-color-svgrepo-com.svg`, không tự vẽ; chỉ có ở `Login`.
- Seller/Shipper register: **giữ nguyên 3 section và toàn bộ field** (không dựng stepper mới, không đổi payload). Dùng `--sn-container-form-wide` để grid 2 cột không bị bóp.
- Nút hiện/ẩn mật khẩu dùng `IconButton variant="ghost" size="sm"` với `label` (không dùng `focus-ring`/`rounded-chip` legacy).
- `FileDropzone`: thêm prop tuỳ chọn `label`/`aria-label`, truyền "CCCD mặt trước", "CCCD mặt sau", "Giấy phép lái xe"; error của dropzone phải được mô tả qua `aria-describedby`.
- `VerifyEmail`: `ResultState` chuyển sang `sn-*` + CSS thuần, bỏ Tailwind/`cn`; giữ nguyên API `status/orderCode/title/message/actions` để `PaymentResult` (Phase 6) dùng lại.
- `ConfirmPassword`: form 1 field mật khẩu, label + error, nút xác nhận; POST `/confirm-password`, không đổi route.
- Theme: **không pin light**; light + dark dùng token (quyết định #36). Không còn `text-ink`, `text-brick`, `bg-raw-linen`, `border-border`, `focus-ring` trong file Auth.
- `AuthBrandPanel`: trust point không số; bỏ `imageUrl`/`imageAlt`; bỏ `serif`; không lặp eyebrow + label role (quyết định #35).
- Copy: tiếng Việt, không em-dash/en-dash; không claim có số khi không có nguồn.
- i18n: giữ nguyên chuỗi tiếng Việt hardcode như hiện tại (không đổi key, không thêm object mới); nếu thêm key mới phải có ở **cả** `vi.json` và `en.json`.

**DoD**

- 8 page render ở 375/390/768/1024/1440, `scrollWidth === innerWidth`, zoom 200% không vỡ.
- Light + dark đạt: đo computed color, không còn chữ tối trên nền tối (đặc biệt 4 heading section của 2 trang đăng ký).
- Toàn bộ trạng thái lỗi/validate hiển thị đúng: required, sai định dạng, mật khẩu yếu/không khớp, lỗi server (`identifier`, `password`, `email`, `token`, `agreeToTerms`, lỗi file), flash `status`.
- Tab order hợp lý, focus visible, mọi input có label thật, 3 dropzone có label riêng.
- Không còn class Tailwind/Nếp, hex/rgb, `focus-ring` trong file Auth; mỗi phần layout đặc thù có `*.module.css` **chỉ khi cần** (không bắt buộc mỗi page một module).
- Không đổi route, payload, validation backend.
- Allowlist 112 → **104** (7 entry Auth + `ResultState`); `check:css` pass; `types` + `format:check` + `build` sạch.

> **Trạng thái 2026-11-23 — hoàn tất:**
>
> - 8 page migrated + `Auth/ConfirmPassword` tạo mới (route `password.confirm` hết 500). `SellerRegister`/`ShipperRegister`/`Register` dùng `sn-auth__form--wide` (600 px); 5 page còn lại 420 px.
> - `PasswordStrength` dùng `Progress` 1 thanh + nhãn; xoá khối `.sn-password*`. `AuthBrandPanel` bỏ claim có số, props chết, `serif`; còn brand/eyebrow/headline/mô tả + 3 trust point không số + hotline/email.
> - Nút hiện/ẩn mật khẩu dùng `IconButton`; ẩn native reveal của Edge; `FileDropzone` nhận `label` + `aria-describedby`; `Register` validate trùng regex server.
> - `ResultState` + `VerifyEmail` chuyển sang `sn-result*` trong `status.css`.
> - `git mv pages/auth → pages/Auth` (Linux/CI resolve đúng `Inertia::render('Auth/…')`).
> - `vite.config.ts`: `publicDir: 'public'` + `build.copyPublicDir: false` để `url('/fonts/…')` trong CSS không 404 ở dev (trước đó rơi về font hệ thống).
> - Allowlist 112 → **104**; `check:css` pass (176 file checked); `types`/`format`/`build` pass; `app.css` **184,60 kB**.
> - Tests: `php artisan test tests/Feature/Auth` — **27 passed / 97 assertions** (chỉ DEPRECATION PDO PHP 8.5).
> - CDP/Edge: 8 page (6 guest + 2 cần đăng nhập kiểm bằng feature test) ở 390/768/1440, light + dark; `scrollWidth === innerWidth`; `h2` section đạt `rgb(21,22,15)` light và `rgb(241,242,234)` dark; input/label/divider/dropzone đúng token; không console error; strength meter đo `aria-valuenow=4`, tone success và `aria-valuenow=1`, tone danger cho mật khẩu yếu.
> - Chưa chụp được `VerifyEmail`/`ConfirmPassword` bằng mắt vì cần phiên đăng nhập; component resolve đã được `PasswordConfirmationTest` + `EmailVerificationTest` phủ, visual `ResultState` kiểm bằng harness light/dark.

---

### Phase 6 — Customer + Settings (16 page + 2 component)

**Page**

| Nhóm           | Page                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| Giỏ/thanh toán | `Cart`, `Checkout`, `PaymentResult`                                         |
| Đơn hàng       | `Orders/Index`, `Orders/Show`                                               |
| Địa chỉ        | `Address/Index`, `Create`, `Edit`, `Show`                                   |
| Tài khoản      | `Profile/Index`, `ChangePassword/Index`, `Notification/Index`, `Chat/Index` |
| Settings       | `Settings/Profile`, `Password`, `Appearance`                                |

**Component trong `pages/` (không có layout):** `Address/AddressForm` (Create/Edit dùng), `Settings/SettingsTabs` (3 page Settings dùng).

**Component bắt buộc:** `commerce/{CartLine, OrderSummary, OrderItemRow, OrderTable, OrderStatusBadge, OrderTimeline, CheckoutStepper, CheckoutAddressForm, PaymentOption, PaymentMarks, PromoField, AddressCard, NotificationRow, OrderAnnouncementCard, OrderContextRail}` + `CheckoutExitConfirmation` (đã sạch, Checkout dùng) + `ReturnItemPicker`, `RefundOption`, `PreferenceRow` (0 importer, migrate theo quyết định #44) + `feedback/ConfirmDialog` (Cart/CheckoutExitConfirmation/Orders dùng) + `chat/*` (12 component + `hooks/useChatConversations.ts`).

**Quyết định áp dụng:** #40 sửa Checkout address; #41 scope component; #42 data authenticity gồm Phase 4 leftover; #43 `<details>` mobile; #44 migrate 3 file dead; #45 bỏ pin theme; #46 Appearance preview; #47 allowlist 57.

**Luật riêng**

- Checkout 2 cột 7/5, summary sticky desktop; mobile 1 cột, summary thành accordion bằng `<details>/<summary>` (không dựng primitive mới).
- Order timeline: đường dọc 1 px + mốc 8 px, không icon tròn nhiều màu, không số thứ tự.
- Chat: list nền `surface-sunken`, active surface + thanh accent; bubble không tail (`rounded-br-chip`/`rounded-bl-chip`), không glow.
- Appearance: 3 lựa chọn theme; **bỏ** `Alert` “Giao diện tối đang thử nghiệm”; preview bằng chính token (canvas/text/accent/border), không ảnh.
- **Data authenticity (#28):** bỏ `shopName: 'Shop Việt'` trong `Cart` (backend không trả shop); bỏ trust `Shop Việt`/`Đổi trả 7 ngày`/`Hỗ trợ 24/7`; bỏ “Giao tiêu chuẩn 2–4 ngày”; bỏ footerNote “phí kiểm định”; `OrderSummary` default `trust = []`; sửa `BuyBox`/`ProductDetail` (Phase 4 leftover) về claim không số.
- **Copy:** xoá 8 em/en-dash trong vùng Phase 6; `CheckoutStepper` bỏ “01./02.”; `OrderTimeline` bỏ số thứ tự; `PaymentMarks` thay logo Mastercard tự vẽ bằng asset/label thật.
- **Theme:** `AccountLayout` nhận `pinLight`; `Cart`/`Checkout`/`PaymentResult` truyền `false`; sau Phase 6 `StorefrontLayout` default `pinLight` → `false` (giữ prop đến Phase 11).
- **Checkout address:** form 2 cấp (province → ward), endpoint `/user/addresses/*`; submit bằng `axios.post('/user/addresses')` và coi response resolved là thành công (controller luôn redirect), sau đó `router.reload({ only: ['addresses'] })`; không dùng Inertia router vì sẽ điều hướng khỏi Checkout.
- **Component:** `ConfirmDialog` chuyển sang `sn-*` + `cx` (dùng Dialog primitives, giữ API); `PaymentMarks` migrate nhưng lưu ý đổi footer trên toàn Storefront; `OrderStatusBadge`/`QuantityStepper` đã sạch, không sửa.
- Không đổi route/controller/payload; không thêm invoice/track/return vì `OrderController` thiếu method.

**Allowlist:** 104 → **57** (13 Customer + 4 Settings + 17 commerce + 12 chat + `ConfirmDialog`). `check:css` dự kiến ~223 file checked.

**Kiểm chứng**

1. `npm run format` → `format:check`; `types`; `check:css`; `build`.
2. Tests: `tests/Feature/Customer/CartControllerTest.php`, `tests/Feature/Checkout/*`, `tests/Feature/Customer/OrderControllerTest.php`, `tests/Feature/User/AddressControllerTest.php`, `tests/Feature/Settings/*`, `tests/Feature/Chat/ChatControllerTest.php`.
3. CDP/Edge: `/cart`, `/checkout`, `/user/orders`, `/user/orders/{id}`, `/user/addresses/*`, `/user/profile`, `/user/notifications`, `/customer/chat`, `/settings/*`; 375/390/768/1024/1440; light + dark; `scrollWidth === innerWidth`.
4. Kiểm riêng: thêm địa chỉ trong Checkout end-to-end; summary accordion mobile; Appearance preview; không còn claim giả/dash/số trang trí.

**DoD**

- Luồng cart → checkout → payment result không đổi hành vi; thêm địa chỉ trong Checkout hoạt động end-to-end.
- Dark mode cho toàn bộ 16 page + Settings/Appearance; không còn `pinLight` trên Account/Cart/Checkout/PaymentResult.
- Empty state có copy thật (Cart/Orders/Address/Notification/Chat).
- Không còn claim có số/không nguồn trong vùng Phase 6 và `BuyBox`/`ProductDetail`.
- 0 em/en-dash trong file Phase 6; không còn “01./02.” ở `CheckoutStepper`/`OrderTimeline`.
- `ConfirmDialog` không còn Tailwind; `PaymentMarks` không tự vẽ logo.
- Allowlist **57**; `types` + `format:check` + `build` + `check:css` sạch.

> **Trạng thái 2026-11-24 — hoàn tất:**
>
> - Migrate 16 page + 2 component trong `pages/` (`Address/AddressForm`, `Settings/SettingsTabs`), 17 component commerce (gồm 3 file dead `ReturnItemPicker`/`RefundOption`/`PreferenceRow`), `feedback/ConfirmDialog` và 12 component chat. `Customer/Chat/Index` chỉ là layout + `ChatWorkspace`, không cần sửa.
> - **Theme:** `StorefrontLayout` default `pinLight = false`; `AccountLayout` nhận prop; Cart/Checkout/PaymentResult truyền `false`. Không còn page Storefront/Account bị khoá sáng.
> - **Checkout address:** form còn 2 cấp tỉnh → phường, gọi `/user/addresses/provinces` + `/user/addresses/wards/{provinceId}`. Submit bằng `axios.post('/user/addresses')` và coi response resolved là thành công, vì `AddressController::store` luôn redirect về danh sách địa chỉ; dùng Inertia sẽ điều hướng khỏi Checkout. Sau đó `router.reload({ only: ['addresses'] })`.
> - **Data authenticity (#28):** bỏ `shopName: 'Shop Việt'`, `Đổi trả 7 ngày`, `Hỗ trợ 24/7`, `Giao tiêu chuẩn 2–4 ngày`, `phí kiểm định`; `OrderSummary` default `trust = []`; sửa `BuyBox` (`Theo địa chỉ giao hàng`, trust rỗng) và `ProductDetail` (`Đổi trả theo chính sách`).
> - **Layout/copy:** `OrderSummary` dùng `<details>` native trên mobile (controlled + `matchMedia`), desktop sticky; `CheckoutStepper` bỏ `01./02.`; `OrderTimeline` còn đường 1 px + mốc 8 px, không số/icon tròn; `PaymentMarks` dùng nhãn chữ thay logo Mastercard tự vẽ; 0 em/en-dash trong vùng Phase 6.
> - **Appearance:** xoá `Alert` “Giao diện tối đang thử nghiệm”; thêm 3 panel preview dùng chính token qua `data-theme` cục bộ (light/dark/system).
> - **Chat:** list nền `surface-sunken`, active surface + thanh accent; bubble phẳng, bỏ tail/glow; `TypingIndicator` có bounce nhưng tôn trọng `prefers-reduced-motion`.
> - **Allowlist:** 104 → **57** (bỏ 47 entry Phase 6). `check:css` pass: **227 file checked, 57 allowlisted**.
> - **Gate:** `format:check`, `types`, `check:css`, `build` sạch; `app-*.css` **183,8 kB**. Tests: `Customer`, `Checkout`, `User/AddressControllerTest`, `Settings`, `Chat/ChatControllerTest` — **91 passed / 454 assertions**, chỉ DEPRECATION PDO PHP 8.5.
> - **Chưa kiểm chứng runtime:** các page Customer/Settings cần phiên đăng nhập trên DB remote; chưa chụp CDP light/dark cho 16 page. Code/types/build/test đã phủ, cần review thủ công khi có phiên.

---

### Phase 7 — Seller (10 page)

| Nhóm       | Page                                                              |
| ---------- | ----------------------------------------------------------------- |
| Dashboard  | `Dashboard/Index`                                                 |
| Sản phẩm   | `Products/Index`, `Products/Create`, `Products/Edit`, `Products/Show` |
| Đơn hàng   | `Orders/Index`, `Orders/Show`                                     |
| Khuyến mãi | `Promotions/Index`, `Promotions/Create`                           |
| Shop       | `Shop/Edit`                                                       |

**Component/wrapper chạm trong Phase 7:** `ui/{action-button, action-buttons, data-table, insights, confirmation-modal, header, filter-panel}` + `admin/users/Toast` + `admin/products/ProductInfoCell` + `utils/tinymce.ts`. Không đụng `action-dropdown` (chỉ Admin dùng, defer Phase 8).

**Quyết định áp dụng:** #48 bám code thực tế; #49 i18n + định dạng; #50 ẩn link Promotions; #51 migrate cross-phase; #52 allowlist 42; #53 commit các file chatbot/Markdown trước Phase 7.

**Luật riêng**

- **Dashboard:** KPI **4 ô** đúng dữ liệu `shopStats` (`total_revenue`, `total_orders`, `monthly_revenue_growth`, `unique_customers`), giữ `recentOrders` + `topSellingProducts`; **không dựng chart** vì props không có series. Các số còn lại (`pending_orders_count`, `low_stock_alerts`, `average_order_value`, `top_selling_product`) chỉ hiển thị nếu là props thật, không bịa.
- **Products:** bảng ledger, ảnh **40×50**, `FilterPanel` 1 dòng; **không thêm bulk action** (code chưa có selection/bulk endpoint). Form sản phẩm 2 cột, variant table, ảnh dropzone, `RichTextEditor` dùng primitive; SEO preview dùng token trung tính hoặc bỏ, không dùng hex Google.
- **Orders:** `FilterPanel` + select status + bảng; detail 2 cột; **không dựng status tabs**. Đổi toàn bộ `$` + `en-US` sang `formatVnd` + `vi-VN`; copy tiếng Việt; nút xem chi tiết dùng `Button`/`Badge`, không `text-blue-500`.
- **Promotions:** `Index` giữ pause/resume/delete, **ẩn Xem + Sửa** (trỏ page không tồn tại); `Create` giữ form + date range; **không thêm preview**. `ConfirmationModal` chuyển thành wrapper `ConfirmDialog`.
- **Shop:** form + preview logo/banner hiện có; **không thêm preview card**; thay `alert()` bằng `useToast`.
- **Copy/i18n (#49):** thêm **104 key `vi` + 69 key `en`**; audit thêm key động (`t(labelKey)`, `t(statusLabel)`); giá `1.290.000 ₫`, ngày `vi-VN`; không em/en-dash; không copy AI.
- **Dead action/data authenticity:** bỏ “Download Report” (`console.log`), bỏ/disable “Product Guidelines” placeholder; không giữ “Sample previews…” trên UI.
- **Wrapper/icon (#51):** migrate `insights`, `confirmation-modal`, `data-table`, `action-button(s)` sang `sn-*`/module; `header`/`filter-panel`/`data-table`/`action-*` nhận `icon: LucideIcon` hoặc `string` (Seller truyền Lucide, Admin vẫn string đến Phase 8). `Toast` và `ProductInfoCell` restyle giữ API; `ProductInfoCell` dùng ảnh 40×50 và bỏ inline CSS var.
- **`utils/tinymce.ts`:** bỏ style format “Red text/Red header” dùng `#ff0000` (hoặc thay bằng token nếu TinyMCE nhận), xoá entry allowlist.
- **Không đổi** route/controller/payload; không tạo `Promotions/Edit` và `Promotions/Show`, `Reports/*`, `Wallet/*`.
- Giữ `AppLayout` re-export đến Phase 11; chỉ xoá `import '@/../css/Page.css'` khỏi 8 page Seller sau khi không còn class Page.css.

**Allowlist:** 57 → **42**. `check:css` dự kiến tăng số file checked do thêm module CSS, nhưng 42 entry allowlist.

**Kiểm chứng**

1. `npm run format` → `format:check`; `types`; `check:css`; `build`.
2. Tests: `tests/Feature/Seller/DashboardControllerTest.php`, `ProductControllerTest.php`, `SellerRoutesAccessTest.php`; smoke route Orders/Promotions/Shop (chưa có test riêng).
3. CDP/Edge (cần phiên Seller): `/seller/dashboard`, `/seller/products`, `/seller/products/create|edit|show`, `/seller/orders`, `/seller/orders/{id}`, `/seller/promotions`, `/seller/promotions/create`, `/seller/shop`; 375/390/768/1024/1440; light + dark; `scrollWidth === innerWidth`.
4. Kiểm riêng: 0 Boxicons trong file Seller; 0 hex; 4 KPI đúng props; bảng 48 px + số căn phải; `formatVnd`; không link Promotions chết; i18n không còn key thiếu.

**DoD**

- 10 page render đúng props, không thêm tính năng ngoài phạm vi; `Page.css` không còn cần cho các page này.
- Icon Lucide trong file Seller và wrapper; bảng 48 px, số căn phải, `formatVnd`.
- `check:css` pass, allowlist **42**; `types` + `format:check` + `build` sạch.
- 0 `t()` key thiếu trong `vi.json`/`en.json` cho Seller; không còn `$`/`en-US`/copy tiếng Anh.
- Không còn link tới `Promotions/Show` và `Promotions/Edit`; không còn dead action.
- Không đổi route/controller/payload backend.

> **Trạng thái 2026-11-24 — hoàn tất:**
>
> - Migrate 10 page Seller sang `sn-*` + `pages/Seller/seller.module.css`: Dashboard, Products (Index/Create/Edit/Show), Orders (Index/Show), Promotions (Index/Create), Shop/Edit. Không còn page Seller import `Page.css`.
> - Migrate 7 wrapper dùng chung: `ui/{insights, data-table, action-button, action-buttons, confirmation-modal, header, filter-panel}`; thêm `lib/icon.tsx` nhận `LucideIcon` hoặc Boxicons string. Restyle `admin/users/Toast` và `admin/products/ProductInfoCell` (ảnh 40×50). `utils/tinymce.ts` bỏ style “Red text/Red header”.
> - **Bám code thực tế (#48):** không dựng chart, bulk action, status tabs, preview; bỏ nút “Download Report” (`console.log`) và “Product Guidelines” placeholder.
> - **Dữ liệu/định dạng (#49):** `formatVnd` + `vi-VN` cho mọi số tiền/ngày ở Seller; không còn `$`, `en-US`, copy tiếng Anh hardcode trong page đã migrate.
> - **Promotions (#50):** ẩn Xem + Sửa; giữ pause/resume/delete; `ConfirmationModal` chuyển thành wrapper của `ConfirmDialog`.
> - **i18n:** thêm **139 key `vi.json` + 101 key `en.json`** (nhiều hơn 104/69 dự kiến vì page viết lại dùng thêm key trạng thái, media, SEO và Shop); audit key động (`t(labelKey)`, `t(option.label)`).
> - **Allowlist:** 57 → **42**; `check:css` pass **251 file checked, 42 allowlisted**.
> - **Gate:** `format:check`, `types`, `check:css`, `build` sạch; ESLint trên toàn bộ file Phase 7 sạch. `php artisan test tests/Feature/Seller` — 17 test (91 assertions), chỉ DEPRECATION PDO PHP 8.5.
> - **Chưa kiểm chứng runtime:** 10 page cần phiên Seller trên DB remote; chưa chụp CDP 375/390/768/1024/1440 light + dark. Code/types/build/test đã phủ; ghi lại cho Phase 12 hoặc lần review có phiên.

---

### Phase 8 — Admin (34 page)

| Nhóm       | Page                                                         |
| ---------- | ------------------------------------------------------------ |
| Dashboard  | `Dashboard/Index`                                            |
| Users      | `Users/Index`, `Users/Edit`                                  |
| Products   | `Products/Index`, `Products/Show`                            |
| Inventory  | `Inventory/Index`, `Show`, `History`                         |
| Orders     | `Orders/Index`                                               |
| Promotions | `Promotions/{Index,Create,Edit,Show}`                        |
| Categories | `Categories/{Index,Create,Edit}`                             |
| Brands     | `Brands/{Index,Create,Edit}`                                 |
| Shops      | `Shops/{Index,Pending,Show,Dashboard,Statistics,Violations}` |
| Shippers   | `Shippers/Index`, `Show`                                     |
| Returns    | `Returns/Index`                                              |
| Analytics  | `Analytics/{Index,Orders,Products,Reports,Revenue,Users}`    |

**Component:** `admin/*` (18 file) + `AnalyticsChart` (recharts) dùng token màu qua `var(...)`.

**Luật riêng**

- Bảng là trung tâm; filter bar gọn 1 dòng + "thêm filter" mở panel.
- Không card cho từng nhóm filter.
- Chart: lưới 1 px, không gradient, tooltip surface.
- Bulk action hiện khi có selection, không chiếm chỗ thường trực.
- Số liệu KPI: 1 hàng 4 ô, không icon tile màu.
- Dọn nốt wrapper legacy còn lại sau Phase 7; xoá entry allowlist tương ứng.

**DoD:** không còn page Admin/Seller nào import `Page.css`; các wrapper legacy và `AppLayout` vẫn còn import (sẽ xoá ở Phase 11). `Page.css` chỉ bị xoá ở Phase 11.

---

### Phase 9 — Shipper (1 page)

**Hiện trạng:** `Shipper/Dashboard/Index.tsx` chỉ là stub `<div><h1>Giao diện shipper</h1></div>`; controller chỉ trả `title`; `routes/shipper.php` dùng alias `shipper` chưa đăng ký (chỉ có `isShipper`) nên route hiện lỗi.

**Việc làm**

- Sửa middleware: đăng ký alias `shipper` trong `bootstrap/app.php` trỏ `IsShipper`, hoặc đổi route sang `isShipper`. Không đổi URL, controller hay props.
- Nav shipper đã rút còn Dashboard + Cài đặt từ Phase 3; khi backend bổ sung route thật thì mở lại mục tương ứng.
- Dựng `Shipper/Dashboard/Index` trên `WorkspaceLayout`.
- Vì controller chỉ trả `title`, page gồm: header, empty state "Chưa có chuyến được giao", 1 CTA tải lại. **Không** bịa danh sách chuyến, trạng thái hay thu nhập.
- Khi backend bổ sung props chuyến, ghi backlog để làm danh sách thật.

**DoD:** route trả 200; page render shell + empty state; không có dữ liệu giả; mobile-first; tap target 44 px; không phụ thuộc hover.

---

### Phase 10 — Email, error pages, PDF

**Email (2 file)**

- `resources/views/emails/welcome.blade.php`
- `resources/views/emails/welcome_google_user.blade.php`
- Tạo `resources/views/emails/partials/theme.blade.php` chứa **hex literal** (email client không hỗ trợ CSS variable) + `<style>` embedded.
- Palette email: canvas `#f2f2ee`, surface `#ffffff`, ink `#15160f`, muted `#53564b`, accent `#c2410c`, border `#d2d2ca`, radius 6.
- Font: `Be Vietnam Pro, Arial, sans-serif`; fallback Arial.
- Không gradient, không ảnh nền, không dark mode (email client không đáng tin).

**Error pages (mới)**

- `resources/views/errors/{404,419,429,500,503}.blade.php`
- `resources/views/errors/layout.blade.php`
- **Self-contained**: toàn bộ CSS nằm trong `<style>` của layout, dùng hex literal (không phụ thuộc Vite manifest, không phụ thuộc bundle React, không dùng CSS variable vì có thể render trước khi asset sẵn sàng).
- Palette: canvas `#f2f2ee`, surface `#ffffff`, ink `#15160f`, muted `#53564b`, accent `#c2410c`, border `#d2d2ca`, font `Be Vietnam Pro, Arial, sans-serif`.
- Hỗ trợ dark mode bằng `@media (prefers-color-scheme: dark)` với graphite `#0d0f0c` / `#151814` / `#f1f2ea`.
- Nội dung: mã lỗi lớn, 1 câu giải thích, 1 CTA về `/`.
- Không thêm entry Vite cho error page.

**PDF/invoice (có điều kiện)**

- Hiện **không có** controller/view PDF; `routes/user.php` chỉ có comment.
- Nếu bật trong refactor: tạo `resources/views/pdf/invoice.blade.php` + `resources/views/pdf/layout.blade.php`.
- Dompdf **không hỗ trợ CSS custom properties** → dùng hex literal, không `var(--sn-*)`.
- Print CSS: A4, margin 16 mm, font Be Vietnam Pro (hoặc DejaVu Sans nếu thiếu glyph), bảng 2 cột, không shadow.

**DoD:** email render trong Gmail/Outlook web (test thủ công); error page không cần JS; PDF (nếu có) mở đúng.

---

### Phase 11 — Gỡ Tailwind và dọn nợ

**Checklist xoá**

| File / mục                                                 | Hành động                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                             | Xoá `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/postcss`, `@tailwindcss/forms`, `@tailwindcss/container-queries`, `@tailwindcss/oxide-linux-x64-gnu`, `tailwind-merge`, `tailwindcss-animate`, `class-variance-authority`, `clsx`, `prettier-plugin-tailwindcss` |
| `vite.config.ts`                                           | Bỏ `import tailwindcss` + `tailwindcss()`                                                                                                                                                                                                                              |
| `postcss.config.js`                                        | Xoá                                                                                                                                                                                                                                                                    |
| `tailwind.config.ts`                                       | Xoá                                                                                                                                                                                                                                                                    |
| `components.json`                                          | Xoá                                                                                                                                                                                                                                                                    |
| `resources/css/app.css`                                    | Bỏ `@import 'tailwindcss'`, `@custom-variant`, `@source`                                                                                                                                                                                                               |
| `resources/css/tokens.css`                                 | Xoá                                                                                                                                                                                                                                                                    |
| `resources/css/legacy-tokens.css`                          | Xoá                                                                                                                                                                                                                                                                    |
| `resources/css/Page.css`                                   | Xoá **sau khi** wrapper legacy + `AppLayout` đã bị xoá (Phase 11)                                                                                                                                                                                                      |
| `resources/css/base.css`                                   | Xoá (Phase 1 giữ nguyên, không xoá sớm)                                                                                                                                                                                                                                |
| `resources/views/app.blade.php`                            | Bỏ Boxicons link, bỏ `class="font-sans antialiased"`, bỏ `@class(['dark' => ...])` nếu còn, xác nhận không còn link Google Fonts                                                                                                                                       |
| `resources/js/app.tsx`                                     | Xác nhận `progress.color` đã là token, không còn `#4B5563`                                                                                                                                                                                                             |
| `.prettierrc`                                              | Bỏ plugin + `tailwindFunctions` + `tailwindStylesheet`                                                                                                                                                                                                                 |
| `eslint.config.js`                                         | Bỏ `tailwind.config.js` khỏi ignores                                                                                                                                                                                                                                   |
| `scripts/token-allowlist.json`                             | Chạy strict lần cuối (không `--all`), xác nhận 0 vi phạm rồi xoá file                                                                                                                                                                                                  |
| `resources/js/components/ui/*` wrapper legacy              | Xoá `action-button`, `action-buttons`, `action-dropdown`, `confirmation-modal`, `data-table`, `filter-panel`, `header`, `insights`, `primary-input`, `status-badge` sau khi page cuối migrate                                                                          |
| `layouts/app/AppLayout.tsx`                                | Xoá sau khi mọi page dùng `WorkspaceLayout`                                                                                                                                                                                                                            |
| `@/lib/utils.ts`                                           | Chỉ xoá `cn` + `twMerge`; giữ `formatCurrency` và các helper khác, chuyển sang `cx`                                                                                                                                                                                    |
| `.dark` selectors                                          | Xoá toàn bộ                                                                                                                                                                                                                                                            |
| `DESIGN-02.md`, `STITCH-DESIGN.md`, `PROMPT.md`, `PLAN.md` | Chuyển `docs/archive/` hoặc xoá                                                                                                                                                                                                                                        |
| `README.md`, `AGENTS.md`                                   | Cập nhật mô tả stack, bỏ Tailwind/Boxicons                                                                                                                                                                                                                             |
| `docs/ui/BASELINE.md`                                      | Giữ làm lịch sử                                                                                                                                                                                                                                                        |

**Thứ tự thực hiện trong Phase 11:** xoá wrapper legacy và `AppLayout` trước → xoá `Page.css` → xoá `legacy-tokens.css`/`tokens.css` → gỡ Tailwind khỏi build → chạy strict check → xoá allowlist.

**Kiểm tra sau khi xoá**

1. `npm ci` sạch.
2. `npm run build` + `npm run build:ssr`.
3. `npm run types`, `npm run format:check`, `npm run lint`, `npm run check:css`.
4. `rg -n "tailwind|@apply|@theme|bx-|fa-" resources package.json vite.config.ts` → rỗng (trừ docs archive).
5. `rg -n "#[0-9a-fA-F]{3,8}" resources/js resources/css --glob '!resources/css/tokens/**'` → rỗng.
6. `php artisan test` (targeted + full nếu thời gian cho phép).

**DoD:** không còn dependency Tailwind trong `package-lock.json`; bundle CSS giảm; không file nào import CSS đã xoá.

---

### Phase 12 — QA sweep

- **Responsive:** 375, 390, 480, 768, 1024, 1280, 1440; kiểm tra `overflow-x`.
- **Dark mode:** mọi page, mọi trạng thái (badge, chart, form error, overlay).
- **A11y:** tab qua từng page, focus visible, `aria-current`, contrast spot-check, zoom 200%.
- **Reduced motion:** bật OS setting, xác nhận không animation.
- **Trạng thái:** loading skeleton, empty, error, success cho mỗi page có dữ liệu.
- **Hiệu năng:** đo CSS bundle trước/sau; mục tiêu < 120 KB uncompressed cho CSS chính (chưa gzip).
- **Rà soát slop:** chạy checklist mục 6 trên toàn bộ 79 page.
- **Tài liệu:** cập nhật `DESIGN.md` + `COMPONENTS.md` theo token/primitive thực tế.

**DoD:** không còn vi phạm `check:css`; không còn `Page.css`; danh sách page đã migrate đủ 79.

---

## 8. Thứ tự trang chi tiết

| Phase |   # | Page                            |
| ----- | --: | ------------------------------- |
| 4     |   1 | `Home/Index`                    |
| 4     |   2 | `Home/Search`                   |
| 4     |   3 | `Customer/ProductDetail`        |
| 4     |   4 | `Home/About`                    |
| 4     |   5 | `Home/Contact`                  |
| 4     |   6 | `Legal/Terms`                   |
| 4     |   7 | `Legal/PrivacyPolicy`           |
| 4     |   8 | `Legal/SellingPolicy`           |
| 5     |   9 | `Auth/Login`                    |
| 5     |  10 | `Auth/Register`                 |
| 5     |  11 | `Auth/ForgotPassword`           |
| 5     |  12 | `Auth/ResetPassword`            |
| 5     |  13 | `Auth/VerifyEmail`              |
| 5     |  14 | `Auth/SellerRegister`           |
| 5     |  15 | `Auth/ShipperRegister`          |
| 5     |  16 | `Auth/ConfirmPassword`          |
| 6     |  17 | `Customer/Cart`                 |
| 6     |  18 | `Customer/Checkout`             |
| 6     |  19 | `Customer/PaymentResult`        |
| 6     |  20 | `Customer/Orders/Index`         |
| 6     |  21 | `Customer/Orders/Show`          |
| 6     |  22 | `Customer/Address/Index`        |
| 6     |  23 | `Customer/Address/Create`       |
| 6     |  24 | `Customer/Address/Edit`         |
| 6     |  25 | `Customer/Address/Show`         |
| 6     |  26 | `Customer/Address/AddressForm`  |
| 6     |  27 | `Customer/Profile/Index`        |
| 6     |  28 | `Customer/ChangePassword/Index` |
| 6     |  29 | `Customer/Notification/Index`   |
| 6     |  30 | `Customer/Chat/Index`           |
| 6     |  31 | `Settings/Profile`              |
| 6     |  32 | `Settings/Password`             |
| 6     |  33 | `Settings/Appearance`           |
| 6     |  34 | `Settings/SettingsTabs`         |
| 7     |  35 | `Seller/Dashboard/Index`        |
| 7     |  36 | `Seller/Products/Index`         |
| 7     |  37 | `Seller/Products/Create`        |
| 7     |  38 | `Seller/Products/Edit`          |
| 7     |  39 | `Seller/Products/Show`          |
| 7     |  40 | `Seller/Orders/Index`           |
| 7     |  41 | `Seller/Orders/Show`            |
| 7     |  42 | `Seller/Promotions/Index`       |
| 7     |  43 | `Seller/Promotions/Create`      |
| 7     |  44 | `Seller/Shop/Edit`              |
| 8     |  45 | `Admin/Dashboard/Index`         |
| 8     |  46 | `Admin/Users/Index`             |
| 8     |  47 | `Admin/Users/Edit`              |
| 8     |  48 | `Admin/Products/Index`          |
| 8     |  49 | `Admin/Products/Show`           |
| 8     |  50 | `Admin/Inventory/Index`         |
| 8     |  51 | `Admin/Inventory/Show`          |
| 8     |  52 | `Admin/Inventory/History`       |
| 8     |  53 | `Admin/Orders/Index`            |
| 8     |  54 | `Admin/Promotions/Index`        |
| 8     |  55 | `Admin/Promotions/Create`       |
| 8     |  56 | `Admin/Promotions/Edit`         |
| 8     |  57 | `Admin/Promotions/Show`         |
| 8     |  58 | `Admin/Categories/Index`        |
| 8     |  59 | `Admin/Categories/Create`       |
| 8     |  60 | `Admin/Categories/Edit`         |
| 8     |  61 | `Admin/Brands/Index`            |
| 8     |  62 | `Admin/Brands/Create`           |
| 8     |  63 | `Admin/Brands/Edit`             |
| 8     |  64 | `Admin/Shops/Index`             |
| 8     |  65 | `Admin/Shops/Pending`           |
| 8     |  66 | `Admin/Shops/Show`              |
| 8     |  67 | `Admin/Shops/Dashboard`         |
| 8     |  68 | `Admin/Shops/Statistics`        |
| 8     |  69 | `Admin/Shops/Violations`        |
| 8     |  70 | `Admin/Shippers/Index`          |
| 8     |  71 | `Admin/Shippers/Show`           |
| 8     |  72 | `Admin/Returns/Index`           |
| 8     |  73 | `Admin/Analytics/Index`         |
| 8     |  74 | `Admin/Analytics/Orders`        |
| 8     |  75 | `Admin/Analytics/Products`      |
| 8     |  76 | `Admin/Analytics/Reports`       |
| 8     |  77 | `Admin/Analytics/Revenue`       |
| 8     |  78 | `Admin/Analytics/Users`         |
| 9     |  79 | `Shipper/Dashboard/Index`       |

> **Ghi chú Phase 6:** 18 dòng trong bảng gồm **16 page + 2 component** (`Address/AddressForm`, `Settings/SettingsTabs`); `Customer/Chat/Index` đã sạch (chỉ layout, không nằm trong allowlist). `BuyBox`/`ProductDetail` là file Phase 4 nhưng được sửa trong Phase 6 để bỏ claim trái #28 (quyết định #42).
>
> **Ghi chú Phase 7:** 10 dòng Seller đúng code hiện tại; `Promotions/Edit` và `Promotions/Show`, `Reports/*`, `Wallet/*` vẫn là backlog (7 render target) và **không tạo** trong Phase 7. `Promotions/Index` phải ẩn link Xem/Sửa để không trỏ page thiếu.

Quy tắc trong mỗi phase: **layout trước, page sau; trang ít phụ thuộc trước; trang nhiều state sau**. Với Admin, thứ tự nội bộ: Dashboard → Users → Categories/Brands → Products → Inventory → Orders → Promotions → Shops → Shippers → Returns → Analytics.

---

## 9. Mapping primitive cũ → mới

| Cũ                                | Mới                                  | Ghi chú                                                                                      |
| --------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `action-button`, `action-buttons` | `Button` + module group | **Phase 7**; `ButtonGroup` **không tồn tại** trong `components/ui`, dùng `Button`/`IconButton` + module flex. Giữ type `ActionConfig` đến khi page migrate |
| `action-dropdown`                 | `DropdownMenu`                       | **Defer Phase 8**; không page Seller nào dùng, chỉ Admin |
| `primary-input`                   | `Input` / `FormField`                | Wrapper giữ path, Phase 2                                                                    |
| `data-table`                      | `DataTable` (wrap `Table`)           | **Phase 7/8**; API thực tế `columns/data/headerTitle/headerIcon`, không có sort/select; `headerIcon` nhận `LucideIcon` hoặc `string` đến Phase 8 |
| `confirmation-modal`              | wrapper của `feedback/ConfirmDialog` | **Phase 7**; hiện **không phải** wrapper (modal tự viết, inline style), sẽ viết lại giữ API `isOpen/onClose/onConfirm/title/message` |
| `status-badge`                    | `Badge` với `tone`                   | Phase 2; map status → tone, bỏ class `Page.css`                                              |
| `filter-panel`                    | `FilterPanel`                        | **Phase 3/7**; icon truyền qua prop cần đổi sang `LucideIcon` hoặc `string` |
| `header`                          | `PageHeader` / `WorkspaceTopbar`     | **Phase 3/7**; `reportButton.icon` cần `LucideIcon` hoặc `string` (Seller dùng Lucide) |
| `navbar`                          | `WorkspaceTopbar`                    | **Defer Phase 3**; giữ đủ chuông + polling, LanguageSwitcher, avatar menu, logout            |
| `sidebar`                         | `WorkspaceSidebar`                   | **Defer Phase 3**                                                                            |
| `insights`                        | KPI list (`StatCard` chưa tồn tại)   | **Phase 7/8**; giữ API `Insights` và restyle `sn-*`, hoặc tách `StatCard` mới; icon `LucideIcon` hoặc `string` |
| `search-input`                    | `SearchInput`                        | Phase 2                                                                                      |
| `toast` + `toaster`               | `Toast` + `Toaster`                  | Phase 2; giữ API hiện tại                                                                    |
| `typography`                      | Giữ component, đổi ruột sang `sn-*`  | Phase 2; xoá component ở Phase 11 khi pages đã migrate                                       |
| `skeleton`                        | giữ, CSS thuần                       |                                                                                              |
| `rich-text-editor`                | giữ, style trong `field.css`         | TinyMCE skin giữ mặc định                                                                    |

---

## 10. Kiểm chứng

### 10.1 Lệnh mỗi phase

```bash
npm run types
npm run format:check
npm run lint
npm run build
npm run check:css
php artisan test --filter=<area>
```

`npm run lint` hiện là `--fix`, nên chạy trước `format:check` để tránh false diff. `check:css` chạy ở chế độ **ratchet** (allowlist) đến hết Phase 10; Phase 11 mới bật strict và xoá allowlist.

### 10.2 Kiểm tra thủ công mỗi page

1. `composer run dev` (PHP 9999 + Vite + queue).
2. Mở route ở 375, 390, 768, 1024, 1440.
3. Toggle `data-theme` light/dark.
4. Tab qua toàn bộ control.
5. Thử trạng thái rỗng/lỗi nếu có.
6. So với baseline (nếu có ảnh).

### 10.3 Định nghĩa "xong" cho một page

- [ ] Audit 5 dòng đã ghi (file, props, trạng thái, rỗng/lỗi, hành động chính).
- [ ] Không còn class Tailwind trong file.
- [ ] Không hex/rgb trong file.
- [ ] Dùng primitive cho mọi control.
- [ ] Layout 375/390/768/1024/1440 không tràn, zoom 200% không vỡ.
- [ ] Light + dark đạt.
- [ ] Loading / empty / error / success đủ.
- [ ] Copy đã rà, không slop, không em-dash.
- [ ] Không badge/số liệu xác thực giả khi props/DB không có.
- [ ] Page có `*.module.css` (nếu cần layout) và module đã qua `check:css`.
- [ ] `types` + `build` + `check:css` sạch.
- [ ] Route + props không đổi.
- [ ] Trên workspace: `.sn-btn`, `.sn-input`, `.sn-badge`, `.sn-card` còn padding (không bị `Page.css` reset về 0).

---

## 11. Rủi ro và cách giảm

| Rủi ro                                                                  | Mức        | Giảm thiểu                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Xung đột reset giữa `Page.css` (unlayered) và reset mới (layered)       | Cao        | **Phase 3:** đưa 5 block toàn cục của `Page.css` vào `@layer sn-legacy-reset` khai báo **đầu tiên** trong `app.css`; giữ phần còn lại của Page.css unlayered; chỉ xoá `Page.css` ở Phase 11. Không sửa thì mọi `sn-*` mất padding trên 41 page workspace (đo được `.sn-btn` 24px → 0px) |
| `base/*.css` restyle 41 trang chưa migrate                              | Cao        | **Phase 3:** scope `body`/`a`/`label` vào `.sn-shell`; reset + a11y giữ toàn cục; bỏ scope ở Phase 11                                                                                                                                                                                   |
| Layout workspace mới phá scope `.content` của Page.css                  | Cao        | Giữ `<div class="content"><main>`; sidebar 230px khớp `calc(100% - 230px)`; 66 selector `.content` vẫn khớp                                                                                                                                                                             |
| Sidebar cũ `z-index: 2000` đè dialog/sheet (`--sn-z-modal: 60`)         | Cao        | Sidebar mới dùng class riêng, không dùng `.sidebar`; kiểm dialog mở trên workspace                                                                                                                                                                                                      |
| Shipper nav trỏ route không tồn tại                                     | Trung bình | Phase 3 rút nav còn Dashboard + Cài đặt; alias `shipper` vẫn sửa ở Phase 9                                                                                                                                                                                                              |
| i18n thiếu key dùng ở topbar                                            | Thấp       | Thêm `auth.logout`, `Search...`, `Shops` vào cả `vi.json` và `en.json` trong Phase 3                                                                                                                                                                                                    |
| 7 file `components/ui` track chữ hoa                                    | Trung bình | `git mv` về chữ thường trước Phase 3 để checkout Linux/CI không fail                                                                                                                                                                                                                    |
| Bỏ Tailwind preflight làm lệch heading/list/img ở trang chưa migrate    | Cao        | `base/reset.css` phải phủ đủ; test 5 trang legacy mỗi phase                                                                                                                                                                                                                             |
| Guardrail ratchet bị "trôi" (file migrate xong vẫn nằm trong allowlist) | Cao        | Phase nào xong phải xoá entry tương ứng; Phase 11 chạy strict, xác nhận 0 vi phạm rồi mới xoá allowlist                                                                                                                                                                                 |
| Shipper route 500 do alias `shipper` chưa đăng ký                       | Cao        | Xử lý ở Phase 9: đăng ký alias hoặc đổi sang `isShipper`; ghi rõ là ngoại lệ config duy nhất                                                                                                                                                                                            |
| Thiếu file font `woff2` khi bắt đầu Phase 1                             | Trung bình | Chuẩn bị `public/fonts/be-vietnam-pro/` từ Phase 0; kiểm tra dấu tiếng Việt trước khi bỏ Google Fonts                                                                                                                                                                                   |
| Class global `sn-*` trùng `Page.css`                                    | Trung bình | Prefix `sn-`; rà `Page.css` trước Phase 2                                                                                                                                                                                                                                               |
| Phase 2 đổi primitive dùng chung làm page chưa migrate đổi giao diện    | Cao        | Chấp nhận có chủ đích; verify login + customer sau mỗi đợt; page migration ở Phase 4–8                                                                                                                                                                                                  |
| Dark mode trộn token mới với layout sáng cũ                             | Cao        | **Hotfix Phase 3:** pin light ở **root** qua prop `pinLight`, thêm background canvas cho `<main>`; 8 trang Phase 4 tắt pin, Account/Cart/Checkout/PaymentResult giữ pin đến Phase 6; Settings/Appearance xử lý riêng                                                                       |
| Auth dark mode: heading section dùng `text-ink` không đổi theo theme    | Cao        | **Phase 5:** migrate hết utility Nếp trong Auth; đo computed color (`h2` đang `rgb(29,27,23)` trên nền `rgb(13,15,12)`), thêm bước verify dark vào DoD thay vì chỉ nhìn ảnh                                                  |
| `VerifyEmail` phụ thuộc `feedback/ResultState` (Nếp, allowlist)         | Trung bình | Đưa `ResultState` vào scope Phase 5 (quyết định #32), migrate sang `sn-*`; `PaymentResult` dùng lại ở Phase 6, tránh làm hai lần                                                                                         |
| `Auth/ConfirmPassword` thiếu page nhưng route đã đăng ký                | Trung bình | Tạo page ở Phase 5 (quyết định #32); không đổi route/controller; bỏ khỏi danh sách backlog (§2.4 còn 16)                                                                                                                |
| Form đăng ký 420 px + grid 2 cột làm input ~200 px                      | Trung bình | Thêm `--sn-container-form-wide` (600 px) cho `Register`/`SellerRegister`/`ShipperRegister`; login/reset giữ 420 px                                                                                                      |
| `FileDropzone` dùng chung một label cho 3 tài liệu shipper              | Trung bình | Thêm prop `label`/`aria-label`; nối `aria-describedby` cho error; kiểm tab order và trình đọc màn hình                                                                                                                   |
| Checkout address hỏng 3 lớp (sai prefix, POST `/addresses`, form 3 cấp) | Cao        | **Phase 6:** đổi sang `/user/addresses/*`, bỏ quận/huyện, submit bằng `axios.post('/user/addresses')` (controller redirect) và `router.reload({ only:['addresses'] })`; test thêm địa chỉ end-to-end                                                                 |
| Bỏ pin theme làm lộ component còn Nếp (ChatDock, PaymentMarks, ConfirmDialog) | Cao    | **Phase 6:** migrate `ConfirmDialog` + `PaymentMarks` cùng phase; `AccountLayout`/Cart/Checkout/PaymentResult truyền `pinLight={false}`; verify dark bằng computed color                                                      |
| Claim giả trong Phase 6 + Phase 4 leftover (`Shop Việt`, `7 ngày`, `24/7`, `2–4 ngày`) | Cao | **Phase 6:** áp #28; bỏ claim có số/không nguồn; sửa `OrderSummary`, `BuyBox`, `ProductDetail` (ghi rõ là bug-fix, không mở lại Phase 4)                                                                                    |
| Mobile summary/Appearance/OrderTimeline chưa có thiết kế đích            | Trung bình | `<details>` cho summary mobile; preview token ở Appearance; timeline 1 px + mốc 8 px; không dùng số `01/02`                                                                                                               |
| Phase 7 spec cũ yêu cầu chart/bulk/status tabs/preview nhưng code không có | Cao | **Phase 7:** bám code thực tế (#48); không thêm tính năng; ghi các mục không tồn tại vào backlog thay vì dựng UI giả                                                                                                     |
| Guardrail bỏ sót file Nếp trong vùng Seller                              | Cao        | `insights`, `confirmation-modal`, `ProductInfoCell`, `header`, `filter-panel` không nằm trong allowlist nhưng vẫn Nếp/inline style/Boxicons động. **Phase 7:** audit tay + migrate theo #51, không tin `check:css` một mình |
| Seller thiếu i18n và dùng USD/en-US                                      | Cao        | **Phase 7:** thêm 104 key `vi` + 69 key `en`, đổi `$`/`en-US` sang `formatVnd`/`vi-VN` (#49); audit key động                                                                                                            |
| `Promotions/Index` link tới page không tồn tại                           | Trung bình | **Phase 7:** ẩn/disable Xem + Sửa (#50); không tạo `Promotions/Show` và `Promotions/Edit`                                                                                                                   |
| Cross-phase component dùng chung với Admin                               | Cao        | **Phase 7:** migrate `Toast`, `ProductInfoCell`, `insights`, `confirmation-modal`; icon API union `LucideIcon` hoặc `string` cho `Header`/`FilterPanel`/`DataTable`/`ActionButton(s)`; Phase 8 bỏ string |
| Working tree bẩn từ tính năng chatbot/Markdown                            | Trung bình | **Trước Phase 7:** commit riêng toàn bộ cụm chatbot/Markdown (#53); không trộn dependency/migration vào commit Seller                                                                                                                |
| Seller thiếu test Orders/Promotions/Shop                                 | Trung bình | **Phase 7:** chạy 3 test hiện có + smoke/CDP; không thêm test backend trừ khi cần; ghi backlog nếu không có phiên                                                                                                       |
| Phase 7 khối lượng lớn (10 page, ~3.300 dòng)                            | Trung bình | Chia commit: wrapper/KPI → dashboard/orders → products → promotions/shop/i18n → docs; tránh một diff khổng lồ                                                                                                            |
| `Page.css` `.content nav` biến Pagination thành topbar                  | Cao        | **Hotfix Phase 3:** đổi `Pagination` sang `<div role="navigation">`; đo lại computed style; retest 4 trang legacy có phân trang                                                                                                                                                          |
| Guardrail không quét `resources/js/**/*.module.css`                     | Cao        | **Hotfix Phase 3:** mở rộng `check-tokens.mjs` quét module CSS và thêm vào `isCssColorScope` trước khi Phase 4 tạo module                                                                                                                                                                   |
| Badge/số liệu bịa (`Shop Việt`, `Đã mua`, `1.200+`, `100%`, `299k`)     | Cao        | **Phase 4:** chỉ render khi có prop/DB xác thực; còn lại bỏ badge/số, dùng claim không số                                                                                                                                                                                               |
| Mất variant cũ khi rewrite primitive                                    | Cao        | Giữ `default/outline`, `ink/outline`, `info`, `inset/ghost`, `pill/filter`; bảng tương thích trong Phase 2                                                                                                                                                                              |
| Wrapper legacy defer vẫn dùng Boxicons/Page.css                         | Trung bình | Giữ trong allowlist đến Phase 7/8; không map 64 icon ở Phase 2                                                                                                                                                                                                                          |
| CSS Modules + `composes` gây khó đọc                                    | Thấp       | Chỉ compose primitive, không compose chéo module                                                                                                                                                                                                                                        |
| Bỏ `.dark` quá sớm làm hỏng `Page.css`/`base.css`/`legacy-tokens`       | Cao        | Giữ mirror `.dark` đến Phase 11; inline script + `useTheme` set cả `data-theme` và class                                                                                                                                                                                                |
| `useTheme` đọc `localStorage` khi SSR                                   | Cao        | Guard `typeof window`; `config/inertia.php` đang bật SSR                                                                                                                                                                                                                                |
| `!important` cho reduced-motion bị guardrail chặn                       | Trung bình | Path exception cho `resources/css/base/a11y.css`; không thêm file vào allowlist                                                                                                                                                                                                         |
| Layer `base/components/utilities` trùng Tailwind v4                     | Cao        | Dùng `sn-*` và chen đúng thứ tự `sn-legacy-reset, sn-reset, theme, base, sn-base, components, sn-components, sn-layouts, sn-utilities, utilities`; import không dùng `layer()`                                                                                                          |
| Dark mode FOUC                                                          | Trung bình | Inline script trong `<head>` trước `@vite`                                                                                                                                                                                                                                              |
| Radix portal render ngoài root                                          | Thấp       | Style global cho `[data-radix-popper-content-wrapper]` trong `menu.css`                                                                                                                                                                                                                 |
| Dompdf không hỗ trợ CSS var                                             | Trung bình | Hex literal trong PDF                                                                                                                                                                                                                                                                   |
| Email client cắt `<style>`                                              | Trung bình | Inline style cho layout, `<style>` chỉ cho media query                                                                                                                                                                                                                                  |
| Google Fonts bị chặn trong Docker/offline                               | Trung bình | Self-host `woff2` ngay Phase 1; giữ fallback system; kiểm tra dấu tiếng Việt                                                                                                                                                                                                            |
| `npm run lint` tự sửa file gây diff lớn                                 | Trung bình | Chạy theo phase, commit riêng                                                                                                                                                                                                                                                           |
| 16 render target thiếu (gồm `Admin/Inventory/Report`) bị báo regression | Thấp       | Ghi rõ trong baseline và PR description; `Auth/ConfirmPassword` đã được tạo ở Phase 5 nên chỉ còn 16                                                                                                                    |
| Tailwind còn trong `node_modules` sau khi xoá                           | Thấp       | `npm ci` + kiểm tra `package-lock.json`                                                                                                                                                                                                                                                 |
| Bundle CSS phình do module trùng lặp                                    | Trung bình | Primitive dùng global; module chỉ layout; đo ở Phase 12                                                                                                                                                                                                                                 |

---

## 12. Việc không làm

- Không đổi route, controller, model, migration, seeder.
- **Ngoại lệ duy nhất:** Phase 9 đăng ký alias `shipper` trong `bootstrap/app.php` hoặc đổi middleware của route shipper sang `isShipper`. Không đổi URL, controller, props hay hành vi nghiệp vụ.
- Không đổi key i18n hiện có; chỉ thêm key mới vào **cả** `lang/vi.json` và `lang/en.json`.
- Không đổi cấu trúc `role_user` hay cách query role.
- Không thêm provider thanh toán.
- Không thêm trang mới (trừ error pages bắt buộc).
- **Ngoại lệ Phase 5:** được tạo `Auth/ConfirmPassword` (quyết định #32) vì route `password.confirm` đã có và page thiếu làm hỏng truy cập trực tiếp. Không đổi route, controller hay props.
- **Ngoại lệ Phase 6:** được sửa `commerce/BuyBox.tsx` và `Customer/ProductDetail.tsx` (file Phase 4) để bỏ claim trái #28; được migrate `feedback/ConfirmDialog` và `PaymentMarks`. Không xoá 3 file commerce dead, chỉ migrate (quyết định #44).
- **Ngoại lệ Phase 7:** được migrate `ui/{insights,confirmation-modal}`, `admin/users/Toast`, `admin/products/ProductInfoCell`, `utils/tinymce.ts` và mở rộng API icon `LucideIcon` hoặc `string` cho `Header`/`FilterPanel`/`DataTable`/`ActionButton(s)`; được ẩn action Xem/Sửa trong `Promotions/Index`. Không tạo page mới, không thêm tính năng.
- Không nâng version dependency (chỉ gỡ).
- Không xoá `resources/js/components/ui/{table,switch,error-state}.tsx` — đây là primitive dự phòng có chủ đích.
- Không xoá `chat`, `commerce/{ReturnItemPicker,RefundOption,PreferenceRow}`, `feedback/LoadingOverlay` khi chưa xác nhận là dead code. Phase 6 **migrate** 3 file commerce này, không xoá.
- Không xoá `storefront/UtilityStrip.tsx` trước Phase 11; Phase 4 chỉ bỏ nó khỏi Home.
- Không thêm voucher band, số liệu `1.200+`/`100%`/`299k`, badge “Shop Việt”/“Đã mua” nếu không có props/DB xác thực.
- Không đưa các xoá `PROMPT.md`, `STITCH-DESIGN.md`, `DESIGN-02.md` vào Phase 3; khôi phục và để Phase 11.
- Không xoá wrapper legacy (`action-button`, `action-buttons`, `confirmation-modal`, `data-table`, `filter-panel`, `status-badge`, …) trước khi page cuối cùng dùng nó đã migrate.
- Không sửa email/PDF logic nghiệp vụ, chỉ trình bày.
- **Ngoại lệ thứ hai (Phase 3):** được sửa `resources/css/Page.css` **đúng 6 block toàn cục** (`*`, `a`, `li`, `html`, `body`, `body.dark`) để bọc vào `@layer sn-legacy-reset`. Không sửa bất kỳ selector component nào trong file này; không xoá file trước Phase 11.

---

## 13. Thứ tự commit đề xuất

```
chore(ui): add baseline inventory and token guardrail
feat(ui): add Bảng Hiệu token system and dark mode
refactor(ui): replace ui primitives with plain CSS (1/3 form controls)
refactor(ui): replace ui primitives with plain CSS (2/3 overlays)
refactor(ui): replace ui primitives with plain CSS (3/3 data display)
fix(ui): move legacy global reset under sn-legacy-reset
refactor(ui): rebuild storefront, auth and workspace shells
fix(ui): restore storefront surface and workspace pagination
refactor(storefront): migrate home, search, product and legal pages
chore(repo): commit pending backend, route and test work before phase 5
refactor(feedback): migrate ResultState and fix Auth page casing
refactor(auth): migrate login and registration pages
chore(build): serve public assets in vite dev for css url()
refactor(customer): migrate cart, checkout and payment result
refactor(customer): migrate orders, addresses and profile pages
refactor(customer): migrate notifications and chat workspace
refactor(settings): migrate profile, password and appearance
refactor(commerce): migrate order, cart and address components
refactor(feedback): migrate ConfirmDialog to plain CSS
docs(ui): log phase 6 customer and settings
chore(chat): render assistant markdown replies
refactor(seller): migrate shared wrappers, KPI and table components
refactor(seller): migrate dashboard and orders pages
refactor(seller): migrate products pages
refactor(seller): migrate promotions, shop and seller i18n keys
docs(ui): log phase 7 seller migration
refactor(admin): migrate admin workspace
fix(shipper): register middleware alias and migrate dashboard shell
feat(ui): restyle email, error pages and invoice print
chore(ui): remove tailwind, legacy css and boxicons
test(ui): responsive, dark mode and accessibility sweep
docs(ui): rewrite design system and component rules
```

> **Trước Phase 5 (quyết định #39):** working tree đang có 52 file backend/route/test chưa commit (gồm `routes/{web,user}.php`, controllers, factories, seeders, 2 page Phase 4, 1 migration untracked). Commit phần này thành commit riêng (`chore(repo): …`) trước khi build Phase 5 để phase UI vẫn là một đơn vị merge sạch; không trộn vào commit `refactor(auth)`.

---

## 14. Phụ lục — checklist nhanh cho người triển khai

**Trước khi sửa một page**

1. Đọc props + trạng thái thật.
2. Xác định layout thuộc shell nào.
3. Liệt kê primitive cần dùng.
4. Kiểm tra copy hiện tại có slop không.
5. Xác định 3 màn: desktop, tablet, mobile.

**Trong khi sửa**

1. Không thêm class Tailwind.
2. Không hex; dùng `var(--sn-*)`.
3. Control dùng primitive, không tự viết lại.
4. Số dùng `.sn-numeric`.
5. Nhãn nhỏ dùng `.sn-label` (11 px, uppercase, tracking 0.1em).
6. Ảnh có `aspect-ratio`.
7. Focus ring không bị tắt.

**Sau khi sửa**

1. Xoá file vừa migrate khỏi `scripts/token-allowlist.json`.
2. `npm run types`
3. `npm run build`
4. `npm run check:css` (đã bao gồm `resources/js/**/*.module.css`)
5. Toggle dark, tab, 375/390/768/1024/1440.
6. Rà badge/số liệu: chỉ giữ khi có props/DB xác thực.
7. Commit theo phase.

---

## 15. Nhật ký cập nhật

**2026-11-24 — Phase 7 hoàn tất (Seller):**

- **Code:** migrate 10 page (`Dashboard/Index`, `Products/{Index,Create,Edit,Show}`, `Orders/{Index,Show}`, `Promotions/{Index,Create}`, `Shop/Edit`) sang `sn-*` + `pages/Seller/seller.module.css`; bỏ import `Page.css` khỏi toàn bộ Seller. Không còn `bx-*`, hex hay `$`/`en-US` trong vùng này.
- **Wrapper dùng chung:** `Insights` (KPI `sn-*`, prop `columns` 3/4), `DataTable` (wrap `Table` primitive, thêm `key`/`align`, header panel), `ActionButton(s)` (dùng `Button`), `ConfirmationModal` (wrapper `ConfirmDialog`), `Header`/`FilterPanel` (icon `LucideIcon` hoặc `string`), `admin/users/Toast` (`sn-toast`), `admin/products/ProductInfoCell` (ảnh 40×50 + module CSS). Thêm `lib/icon.tsx`.
- **Hành vi:** Dashboard bỏ “Download Report”/“Product Guidelines”, KPI đúng 4 prop `shopStats`; Products dùng `ConfirmDialog` cho xoá, `formatVnd`; Orders đổi `$`/`en-US` sang `formatVnd`/`formatDateTime`, `StatusBadge`; Promotions ẩn Xem/Sửa, giữ pause/resume/delete, `Progress` cho ngân sách; Shop/Edit thay `alert()` bằng `useToast`.
- **i18n:** thêm 139 key `vi` + 101 key `en`; audit cả key động (`Paused until`, `Ended on`, `Starts on`, `Ends on`, trạng thái đơn, media/SEO).
- **Allowlist:** 57 → **42**; `check:css` **251 file checked, 42 allowlisted**.
- **Gate:** `format:check`, `types`, `check:css`, `build`, ESLint (file Phase 7) sạch; `php artisan test tests/Feature/Seller` 17 test / 91 assertions (chỉ DEPRECATION PDO PHP 8.5).
- **Chưa làm:** CDP/Edge 10 page ở 5 breakpoint light + dark vì cần phiên Seller trên DB remote; ghi lại cho Phase 12 hoặc lần review có phiên.
- **Quyết định #54:** `DataTable` thêm `key`/`align` (additive); `Insights` thêm `columns`; `renderIcon` chuẩn hoá Boxicons string; bỏ action chết; Shop hint trung tính; thêm 6 module CSS.
- **Working tree ngoài phạm vi:** favicon/`app.blade.php` và asset favicon đang do việc khác; **không** đưa vào commit Phase 7.

**2026-11-24 — rà soát trước Phase 7 và chốt scope (chưa build):**

- **Đo lại** (ghi §2.8): 10 page Seller; **248 vi phạm guardrail** trong `pages/Seller` (137 tailwind-utility, 61 legacy-icon, **50 raw-hex**); `Orders/Show` 104, `Products/Show` 42, `Products/Edit` 23, `Orders/Index` 21, `Dashboard` 18. **85 class `Page.css`** còn dùng; **8/10** page import `Page.css`; **61 `bx-*`** literal; **217 key `t()`**, **104 thiếu `vi`**, **69 thiếu `en`**.
- **Gate hiện tại:** `types` + `build` pass; `check:css` pass **229 checked / 57 allowlisted** (2 file Markdown chat chưa commit). Allowlist Phase 7 dự kiến **15 entry** → còn **42**.
- **Sai biệt với plan:**
    - Spec cũ yêu cầu chart Dashboard, bulk action Products, status tabs Orders, preview Promotions, preview card Shop — **code không có** các thành phần này; thêm mới là feature creep.
    - `action-dropdown` **không page Seller nào dùng** (chỉ Admin).
    - `confirmation-modal` **không phải wrapper của `ConfirmDialog`**; là modal tự viết inline style.
    - `insights`, `confirmation-modal`, `ProductInfoCell`, `header`, `filter-panel` **không nằm trong allowlist** nhưng vẫn Nếp/Boxicons động (`bx ${...}`) → guardrail bỏ sót.
    - `ButtonGroup` và `StatCard` (đích mapping §9) **không tồn tại**.
    - `Promotions/Index` có link Xem/Sửa trỏ `Promotions/Show` và `Promotions/Edit` không tồn tại (2 trong 7 render target Seller thiếu).
    - `Orders/Index`/`Orders/Show` dùng **`$` + `en-US`**, copy tiếng Anh; `Products/Index` dùng `toLocaleString() + " VND"` thay `formatVnd`.
    - `Dashboard` có “Download Report” chỉ `console.log`; “Product Guidelines” là placeholder; `Shop/Edit` dùng `alert()`.
    - `Products/Create|Edit` có SEO preview hex Google; `utils/tinymce.ts` có `#ff0000` và đang nằm trong allowlist.
    - Working tree có cụm **chatbot/Markdown ngoài refactor** (dependency, components, service/controller, route, migration) và đang thay đổi trong lúc rà soát; phải kiểm tra `git status` lại trước Phase 7.
- **Quyết định #48–#53:**
    - #48 bám code thực tế; bỏ chart/bulk/tabs/preview; không thêm tính năng.
    - #49 thêm 104 key `vi` + 69 key `en`; đổi `$`/`en-US` sang `formatVnd`/`vi-VN`.
    - #50 ẩn/disable Xem + Sửa ở `Promotions/Index`; không tạo page mới.
    - #51 migrate cross-phase: `insights`, `confirmation-modal`, `Toast`, `ProductInfoCell`, `tinymce`; icon API `LucideIcon` hoặc `string` đến Phase 8.
    - #52 allowlist 57 → **42**.
    - #53 commit riêng các file chatbot/Markdown đang bẩn trước Phase 7.
- **Cập nhật tài liệu:** header status, §0.4 (`~24`), §1 (#40 sửa axios; #47 số đo 227; #48–#53), §2.3 (target 42), §2.8 (mới), §7 Phase 6 (bỏ câu Inertia), Phase 7 (viết lại), §8 (ghi chú Phase 7), §9 (mapping wrapper/icon), §11 (9 rủi ro Phase 7), §12 (ngoại lệ Phase 7), §13 (commit Phase 7), §15.

**2026-11-24 — Phase 6 hoàn tất (Customer + Settings):**

- **Code:** migrate 16 page + 2 component trong `pages/`, 17 component commerce (gồm 3 file dead), `ConfirmDialog`, 12 component chat. Tạo `pages/Customer/customer.module.css`, `pages/Settings/settings.module.css`, `components/chat/chat.module.css`, `components/feedback/feedback.module.css`; nối tiếp `components/commerce/commerce.module.css`.
- **Theme:** `pinLight` default `false` ở `StorefrontLayout`; `AccountLayout` nhận prop; Cart/Checkout/PaymentResult truyền `false`. Dark mode không còn bị khoá ở Account/Cart/Checkout/PaymentResult.
- **Checkout address:** bỏ cấp quận/huyện; `CheckoutAddressForm` gọi `/user/addresses/provinces` và `/user/addresses/wards/{provinceId}`. `Checkout` submit bằng axios và coi response resolved là thành công vì controller redirect về danh sách địa chỉ; đóng Dialog, toast, `router.reload({ only: ['addresses'] })`. Không đổi route/controller/payload.
- **Data authenticity:** bỏ `Shop Việt`, `Đổi trả 7 ngày`, `Hỗ trợ 24/7`, `Giao tiêu chuẩn 2–4 ngày`, `phí kiểm định`; `OrderSummary` default `trust = []`; `BuyBox` default `deliveryNote = 'Theo địa chỉ giao hàng.'`, trust `[]`; `ProductDetail` dùng `Đổi trả theo chính sách`.
- **Component/layout:** `OrderSummary` là `<details>` mobile (controlled + `matchMedia`) và sticky desktop; `CheckoutStepper` bỏ số thứ tự; `OrderTimeline` dùng đường 1 px + mốc 8 px; `PaymentMarks` bỏ logo Mastercard tự vẽ, dùng nhãn chữ; `ConfirmDialog` sang `sn-*` + `cx`.
- **Appearance:** xoá cảnh báo “dark đang thử nghiệm”; thêm 3 panel preview dùng token qua `data-theme` cục bộ.
- **Copy:** 0 em/en-dash trong vùng Phase 6; 0 nhãn `01./02.`; chat bubble bỏ tail/glow.
- **Allowlist:** 104 → **57** (bỏ 47 entry). `check:css` pass: 227 file checked, 57 allowlisted.
- **Gate:** `format:check`, `types`, `check:css`, `build` sạch; `app-*.css` 183,8 kB. Tests: 91 passed / 454 assertions (chỉ DEPRECATION PDO PHP 8.5).
- **Chưa làm:** chụp/so CDP 16 page ở 375/390/768/1024/1440 light + dark vì cần phiên đăng nhập trên DB remote; ghi lại để Phase 12 hoặc lần review có phiên.

**2026-11-24 — rà soát và chốt scope Phase 6 (chưa build):**

- **Đo lại** (ghi §2.7): 66 file trong phạm vi (14 Customer + 4 Settings + 36 commerce + 12 chat); thực tế **16 page + 2 component** (`Address/AddressForm`, `Settings/SettingsTabs`). Allowlist Phase 6 **46 entry + `ConfirmDialog` = 47**. Vi phạm vùng Phase 6 **1.743 / 2.338** (75%), nhưng **0 raw hex, 0 Boxicons**; **0 file** import `Page.css`; 0 CSS module. Gate `types` + `check:css` pass; working tree bẩn 31 file từ việc khác.
- **Sai biệt với plan:**
    - Plan gọi “18 page” nhưng 2 file là component; `chat/*` là 12 component + 1 hook.
    - Plan thiếu `ConfirmDialog` (Cart/Orders dùng), `CheckoutExitConfirmation` (Checkout dùng); `PaymentMarks` render trong footer nên vẫn Nếp trên page Phase 4.
    - Plan ước lượng ~30 file; thực tế 66 file ứng viên / 47 allowlist.
    - Plan không có bước bỏ `pinLight`; `AccountLayout` + Cart/Checkout/PaymentResult vẫn khoá sáng.
    - Plan không có bước sửa Checkout address; code đang hỏng 3 lớp.
- **Lỗi thực tế phát hiện:**
    - `CheckoutAddressForm` gọi `/addresses/provinces|districts|wards` (route thật `/user/addresses/*`); `Checkout` POST `/addresses` (không tồn tại); form 3 cấp trong khi DB 2 cấp; `AddressController::store` trả redirect nên `response.data.success` không chạy.
    - Claim giả: `Shop Việt` (gán cứng trong `Cart`), `Đổi trả 7 ngày`, `Hỗ trợ 24/7`, `Giao tiêu chuẩn 2–4 ngày`, `phí kiểm định`; `BuyBox`/`ProductDetail` (Phase 4) còn `7 ngày`/`2-4 ngày`.
    - 8 em/en-dash trong vùng; `CheckoutStepper` “01.”; `OrderTimeline` số thứ tự; `PaymentMarks` tự vẽ Mastercard.
    - `OrderSummary` chưa có accordion mobile; `Settings/Appearance` còn `Alert` “dark đang thử nghiệm”, chưa có preview token.
- **Quyết định #40–#47:** sửa Checkout address; mở rộng scope component; áp #28 gồm Phase 4 leftover; `<details>` mobile summary; migrate 3 file commerce dead; bỏ pin theme toàn bộ; Appearance bỏ cảnh báo + preview token; allowlist 104 → **57**.
- **Cập nhật tài liệu:** header status, §0.4 (`~66`), §1 (#40–#47), §2.7 (mới), §7 Phase 6 (viết lại), §8 (ghi chú 16 page + 2 component), §11 (4 rủi ro Phase 6), §12 (ngoại lệ Phase 6), §13 (commit tách nhỏ + ConfirmDialog), §15.

**2026-11-23 — Phase 5 hoàn tất (Auth):**

- Migrate 8 page: `Auth/{Login,Register,ForgotPassword,ResetPassword,VerifyEmail,SellerRegister,ShipperRegister}` + **`Auth/ConfirmPassword` tạo mới** (route `password.confirm` có sẵn, trước đó thiếu page). Backlog còn **16** render target.
- `AuthLayout` thêm prop `width` (`default` 420 / `wide` 600) + `.sn-auth__form--wide`; `Register`/`SellerRegister`/`ShipperRegister` dùng 600 px, 5 page còn lại 420 px.
- `layouts/auth.css` thêm lớp composition `.sn-auth-page*` (intro, form, divider, footnote, aside, section, grid, docs, preview) dùng token; không thêm utility mới.
- `PasswordStrength` viết lại bằng `Progress` (1 thanh + nhãn, tone danger/warning/success); xoá toàn bộ khối `.sn-password*` khỏi `field.css`.
- `AuthBrandPanel`: trust point đổi thành “Shop đã kiểm duyệt”, “Đổi trả theo chính sách”, “Hỗ trợ qua hotline”; bỏ `7 ngày`/`24/7`/“Shop Việt”, bỏ tagline + label role, bỏ props chết `imageUrl`/`imageAlt`, bỏ `serif`.
- `Login`: nhận `canResetPassword` + `status`; flash `status` bằng `Alert`; ẩn link quên mật khẩu khi route không có; giữ cảnh báo lỗi Google (`errors.google`) do người dùng thêm trước đó.
- `Register`: validate client khớp `RegisterRequest` (8 ký tự + hoa/thường/số/ký tự đặc biệt, username cho phép `_` và `.`); `agreeToTerms` dùng `.sn-field__error`.
- Nút hiện/ẩn mật khẩu → `IconButton ghost/sm`; thêm `.sn-input::-ms-reveal/::-ms-clear { display: none }` để không hiện 2 icon trên Edge.
- `FileDropzone` thêm prop `label` → `aria-label` + `aria-invalid` + `aria-describedby` nối error; 3 dropzone shipper có nhãn riêng.
- `ResultState` chuyển sang `sn-result*` (status success/pending/failure/cod, code chip, title, message, actions) trong `status.css`; `VerifyEmail` dùng lại; `PaymentResult` sẽ dùng ở Phase 6.
- `field.css`: `.sn-input[readonly]` dùng `surface-sunken` + `text-muted` (email ở `ResetPassword`).
- `git mv resources/js/pages/auth → Auth` để checkout Linux resolve `Inertia::render('Auth/…')`; trước đó git track chữ thường như 7 file `components/ui` ở Phase 3.
- **Tooling:** `vite.config.ts` thêm `publicDir: 'public'` + `build.copyPublicDir: false`. `laravel-vite-plugin` mặc định `publicDir: false`, nên CSS `url('/fonts/…')` resolve về origin Vite và 404 ở dev; sau fix cả 8 woff2 trả 200, không còn rơi về font hệ thống.
- Allowlist 112 → **104** (7 entry Auth + `ResultState`); `check:css` pass (176 file checked); `format`/`types`/`build` pass; `app.css` **184,60 kB** (từ 179,67 kB).
- Tests: `php artisan test tests/Feature/Auth` — **27 passed / 97 assertions**, gồm `PasswordConfirmationTest` hiển thị page mới (chỉ DEPRECATION PDO PHP 8.5).
- CDP/Edge (6 trang guest): `/login`, `/register`, `/forgot-password`, `/reset-password/*`, `/register/seller`, `/register/shipper` ở 390/768/1440, light + dark.
    - `scrollWidth === innerWidth`; form 420/600 đúng thiết kế; panel 720 px @1440, ẩn dưới 1024.
    - `h2` section trước đây `rgb(29,27,23)` trên nền `rgb(13,15,12)` nay `rgb(21,22,15)` light / `rgb(241,242,234)` dark; label, input, divider, aside, dropzone đều đúng token.
    - Password strength: `Abcd1234!` → “Mạnh”, tone success, `aria-valuenow=4`; `abcdefgh` → “Rất yếu”, tone danger, `aria-valuenow=1`; submit yếu hiện đúng lỗi regex của server.
    - Không còn console error (sau khi sửa font dev); `tailwindLeft = 0` trong toàn bộ `.sn-auth-page`.
    - Visual `ResultState` kiểm bằng harness light/dark (4 status), đã xoá harness sau khi chụp.
    - Chưa chụp `VerifyEmail`/`ConfirmPassword` vì cần phiên đăng nhập; component resolve đã được feature test phủ.
- Commit: `chore(repo)` (dọn working tree), `refactor(feedback)` (ResultState + casing), `refactor(auth)` (8 page + layout + primitive), `chore(build)` (font dev).

**2026-11-23 — rà soát trước Phase 5 (chốt 8 quyết định, chưa build):**

- **Đo lại toàn bộ** (build sạch + Edge headless/CDP), ghi thành §2.6: 78 page / 47 primitive; `className=` 2.081; `Page.css` importers **40**; `AppLayout` 39; `bx-*` 232; allowlist 112 (7 entry Auth); `types`/`format:check`/`check:css`/`build` pass; 6 route Auth trả 200.
- **Bundle:** `app-*.css` **179,67 kB** + chunk `Page.css` **43,85 kB**. Con số **130,77 kB** ghi ở log Phase 4 **không tái lập được** trên cùng commit → giữ làm số lịch sử, thêm ghi chú ở §7/§15 và dùng số đo mới cho Phase 12. Tổng CSS thực tế ~259 kB, vượt mục tiêu < 120 kB nếu tính cả chunk legacy.
- **Auth hiện trạng:** `.sn-auth__form` 420 px, panel 720 px @1440, không tràn ngang 390/768/1440 (`scrollWidth === innerWidth`). Dark mode: heading `sn-*` đúng token nhưng **4 heading section dùng `text-ink` đo được `rgb(29,27,23)` trên nền `rgb(13,15,12)`** → gần như vô hình. Còn **57 chỗ utility Nếp** trong Auth (`Login` 10, `Register` 11, `ResetPassword` 9, `ShipperRegister` 15, `SellerRegisterForm` 10, `ForgotPassword` 2).
- **Sai biệt với plan đã sửa:**
    - Phase 5 ghi “multi-step” nhưng code là **1 trang 3 section**, không có stepper → đổi thành “giữ nguyên 3 section + field”.
    - `PasswordStrength` là 4 thanh segmented 3 màu, không phải `Progress` → quyết định #33.
    - `AuthBrandPanel` có claim có số (`7 ngày`, `24/7`, “Shop Việt đã kiểm duyệt”) không có nguồn trong Legal, trái #28 → quyết định #35.
    - `Login` bỏ qua props `canResetPassword`/`status` do controller truyền (BASELINE ghi sai “no props”) → quyết định #38.
    - `VerifyEmail` phụ thuộc `feedback/ResultState` (Nếp, allowlist) ngoài scope → quyết định #32.
    - `Auth/ConfirmPassword` thiếu page dù route `password.confirm` đã đăng ký → quyết định #32; backlog còn **16** target.
    - `FileDropzone` dùng chung một label cho 3 tài liệu shipper; nút hiện/ẩn mật khẩu còn `focus-ring`/`rounded-chip` → quyết định #37.
    - §3.5 tham chiếu `public/image/ShopnestLogoSVG.svg` **không tồn tại** (chỉ có `ShopnestLogo.png` + `.ico`); `app.blade.php` vẫn link favicon SVG đó → sửa ở Phase 11 cùng lúc dọn blade.
    - Working tree bẩn 52 file (backend/route/test + 2 page Phase 4) → quyết định #39, commit tách riêng trước Phase 5.
- **Quyết định mới #32–#39:** scope 8 page; `Progress` 1 thanh; form đăng ký rộng 600 px; trust point không số; Auth không pin theme, dark đầy đủ; a11y dropzone + `IconButton` + đồng bộ validate; `Login` nhận props; commit backend riêng.
- **Cập nhật tài liệu:** §0.2/§0.4, §1 (#32–#39), §2.4 (17 → 16, thêm ngoại lệ), §2.6 (mới), §3.3/§3.5, §4.6 (`--sn-container-form-wide`), §7 Phase 3 (Auth shell), Phase 4 (ghi chú bundle), **Phase 5 viết lại đầy đủ 8 page + DoD**, Phase 12 (79 page), §8 (thêm `Auth/ConfirmPassword` #16, đánh số lại 1–79), §11 (5 rủi ro Phase 5), §12 (ngoại lệ trang mới), §13 (commit backend + `ResultState`).

**2026-11-23 — Phase 4 hoàn tất (Storefront):**

- Migrate 8 page: `Home/Index`, `Home/Search`, `Customer/ProductDetail`, `Home/About`, `Home/Contact`, `Legal/{Terms,PrivacyPolicy,SellingPolicy}`.
- Tạo CSS Modules: `Home/Home.module.css`, `Home/Search.module.css`, `Customer/ProductDetail.module.css`, `Home/About.module.css`, `Home/Contact.module.css`, `components/storefront/storefront.module.css`, `components/commerce/commerce.module.css`.
- Home: bỏ `UtilityStrip` + voucher band + trust strip trong hero; bỏ số liệu `1.200+`/`100%`/`299k`/`3 phút`/`2h`; bỏ `01/02/03`; CTA đổi thành “Xem chợ” (2 từ); còn 7 section, 2 eyebrow; editorial media cao đều 13rem; giữ BrandSpotlight + EditorialPillars đã redesign.
- Search: rail 264px sticky dưới header, mobile bottom sheet, ẩn filter group rỗng, bỏ en-dash trong khoảng giá; page grid `264px + 1fr`.
- ProductDetail: 7/5 gallery/buy box, buy box sticky, tab bar sticky, content 8/4; bỏ `verified: true` giả, bỏ badge “Shop Việt” luôn hiện; mô tả dùng `.description` thay arbitrary utilities; trust còn policy thật.
- Commerce: `Price` bỏ `cva`; `ProductCard` bỏ badge/pill trên ảnh và hover scale, badge chuyển thành text; `ShopIdentity` bỏ badge xác thực; `Countdown` vào scope; `FilterRail` có variant sheet; `Pagination` giữ `div role=navigation`.
- Legal: viết lại toàn bộ nội dung tiếng Việt, prose 65ch, bỏ card bao ngoài.
- Copy: xoá en-dash/em-dash khỏi page/component Phase 4; giữ hyphen.
- Allowlist 143 → **112** (31 entry Phase 4). `check:css` pass: 167 file checked, 112 allowlisted.
- `types`, `format:check`, `build` pass; CSS bundle `app.css` **130,77 kB** (từ 186,57 kB). *Đo lại 2026-11-23 trên cùng commit: 179,67 kB + 43,85 kB `Page.css` — con số 130,77 không tái lập, xem §2.6.*
- Runtime verify bằng CDP/Edge:
  - Light: `/`, `/search`, `/about`, `/contact`, `/terms` screenshot; Home hero 2 dòng, 7 section, 2 eyebrow; Search rail 264px; Contact form 2 cột; Legal prose đọc tốt.
  - Dark: 7 trang guest có main bg `rgb(13,15,12)`, text `rgb(241,242,234)`; không còn chữ tối trên nền tối.
  - Responsive: 375/390/768/1024/1440 cho 7 page, `scrollWidth === innerWidth`, không tràn ngang.
  - Mobile filter sheet mở đúng (dialog count 1, scrim, nút đóng).
- Chưa verify runtime `ProductDetail` vì DB hiện không có product (`/product/1` 404); cần dữ liệu mẫu để chụp/so visual. Code/types/build đã pass.

**2026-11-23 — Phase 3 hotfix hoàn tất:**

- `StorefrontLayout`: thêm prop `pinLight` (default `true`), đặt `data-theme` ở **root** thay vì `<main>`; bỏ `data-theme` khỏi `<main>`. Thêm `background`/`color` token cho `.sn-storefront__main`.
- CDP trên `/`: root/main `rgb(242,242,238)`, heading `rgb(21,22,15)`, HTML vẫn `dark` nhưng shell storefront là một theme sáng hoàn chỉnh; hết chữ tối trên nền tối.
- `Pagination`: đổi 2 `<nav>` sang `<div role="navigation" aria-label="Phân trang">`. Harness `app.css + Page.css`: pagination `height:40px`, `position:static`, `z-index:auto`; `<nav>` đối chứng vẫn `56px/sticky/1000`.
- `base/typography.css` + `base/forms.css`: thu hẹp còn `.sn-shell`, `.sn-shell a`, `.sn-shell label`; heading/form element-level để primitive xử lý. CSS bundle `app.css` còn **186,57 kB**.
- `check-tokens.mjs`: quét thêm `resources/js/**/*.css` (Phase 4 module CSS) và thêm module vào `isCssColorScope`.
- Khôi phục `PROMPT.md`, `STITCH-DESIGN.md`, `DESIGN-02.md`; không đưa các xoá tài liệu vào Phase 3.
- Feature tests: `Admin/ProductManagementTest`, `Admin/UserControllerTest`, `Seller/ProductControllerTest`, `Seller/DashboardControllerTest` — **40 passed / 200 assertions** (chỉ DEPRECATION `PDO::MYSQL_ATTR_SSL_CA` do PHP 8.5).
- `format:check`, `check:css` (129 file, 143 allowlisted), `types`, `build` pass; smoke `/`, `/login`, `/about`, `/contact`, `/terms`, `/privacy-policy`, `/selling-policy`, `/search` đều 200.
- Chưa chụp được 5 ảnh legacy do không có phiên đăng nhập trên DB remote; Admin/Promotions chưa có feature test. Cần review thủ công khi có DB/phiên phù hợp.

**2026-11-23 — chốt quyết định trước Phase 4 (sau rà soát Phase 3):**

- **Theme:** `StorefrontLayout` nhận `pinLight` ở root; 8 trang Phase 4 truyền `false`; Account/Cart/Checkout/PaymentResult giữ `true` đến Phase 6; Settings/Appearance xử lý riêng.
- **Pagination:** đổi 2 `<nav>` sang `<div role="navigation">` để thoát `.content nav` unlayered; không sửa thêm `Page.css`.
- **UtilityStrip:** bỏ khỏi Home Phase 4; giữ file + allowlist đến Phase 11.
- **Voucher band:** bỏ khỏi spec Phase 4 vì không có prop; ghi backlog.
- **WorkspaceTopbar:** điều chỉnh plan theo hiện trạng (breadcrumb ở PageHeader, search desktop, toggle mobile); desktop collapse defer Phase 11.
- **Base scope:** thu hẹp về `.sn-shell` / `.sn-shell a` / `.sn-shell label`; heading/form để primitive.
- **Home sections:** giữ BrandSpotlight + EditorialPillars nhưng redesign; bỏ 01/02/03, badge trùng, copy/số liệu slop.
- **Data authenticity:** bỏ “Shop Việt”/“Đã mua” và `1.200+`/`100%`/`299k`/`3 phút`/`2h` nếu không có props/DB xác thực.
- **Phase 3 hotfix:** sửa nền storefront, Pagination, base scope, kiểm chứng legacy, quét module CSS, khôi phục tài liệu; commit Phase 3 riêng trước Phase 4.
- **Countdown:** thêm `commerce/Countdown.tsx` vào scope Phase 4.
- **Docs:** khôi phục `PROMPT.md`, `STITCH-DESIGN.md`, `DESIGN-02.md`; chỉ xoá/archived ở Phase 11.

**2026-11-23 — Phase 3 hoàn tất phần code (trước hotfix §3.1):**

- `app.css`: chèn `sn-legacy-reset` lên đầu danh sách layer; import `base/reset`, `base/typography`, `base/forms`, `base/a11y`, `layouts/{storefront,auth,account,workspace}` và `utilities.css`.
- `Page.css`: bọc đúng 6 block toàn cục (`*`, `a`, `li`, `html`, `body`, `body.dark`) vào `@layer sn-legacy-reset`; phần còn lại vẫn unlayered. Kiểm bằng HTML tĩnh nạp `app.css` + `Page.css`: `.sn-btn` padding-left **20px**, `.sn-input` **16px** (trước Phase 3 đều 0).
- `base/typography.css` + `base/forms.css`: scope element rules vào `.sn-shell`; thêm base `.sn-shell` (canvas, text, font). Reset/a11y giữ toàn cục.
- Tạo `resources/css/layouts/{storefront,auth,account,workspace}.css`, dùng `--sn-*` và class `sn-*`, không hex/`!important`.
- Rewrite 10 file `components/layout` sang `sn-*`; `PageContainer` giữ 4 size, `PageHeader`/`SectionHeader`/`Breadcrumbs` không còn Tailwind. `Breadcrumbs` thêm prop `as` để tránh `.content nav` của Page.css.
- `WorkspaceLayout` + `WorkspaceSidebar` (230px, z 51) + `WorkspaceTopbar` (search, chuông + polling 30s, LanguageSwitcher, avatar menu, logout, theme toggle); giữ `<div class="content"><main>` và override geometry mobile bằng inline style có chú thích. `layouts/app/AppLayout.tsx` thành re-export. Import `Page.css` tại `WorkspaceLayout` để 9 page trước đây hưởng import bắc cầu không mất style.
- Nav shipper rút còn Dashboard + Cài đặt; admin/seller giữ nguyên label/href. `header.tsx` → `PageHeader` + `Breadcrumbs`; `filter-panel.tsx` → `Input`/`Select`/`Button`, bỏ inline style.
- `git mv` 7 file `components/ui` về chữ thường (avatar, header, insights, navbar, pagination, sidebar, tooltip).
- i18n: thêm `Search`, `Search...`, `Shops` vào cả `vi.json` và `en.json`; `auth.logout` và `navbar.profile/settings` đã có flat key từ trước, không thêm object `navbar` trùng.
- Storefront/account tạm pin `data-theme="light"` trên `<main>` để trang Nếp chưa migrate không bị chữ sáng trên nền sáng ở dark mode. **Bản này chưa đủ:** `<main>` không có background nên root tối lộ qua; quyết định trước Phase 4 là chuyển sang `pinLight` ở root và thêm background canvas (xem §3.1).
- Allowlist 156 → **143** (10 layout, `header`, `filter-panel`, `AppLayout`; `navbar`/`sidebar` vẫn giữ).
- `check:css` pass (129 file checked, 143 allowlisted); `types`, `format:check`, `build` pass; CSS bundle `app.css` 188,11 kB (từ 168,49 kB).
- Verify Edge headless: `/login` (auth split), `/` (storefront shell/header/footer), form width 358px @390, không tràn ngang. **Dark mode storefront chưa đạt:** CDP đo root `rgb(13,15,12)`, main trong suốt, heading `rgb(21,22,15)`; cần hotfix trước Phase 4.
- Phát hiện thêm sau Phase 3: `Pagination` (`<nav>`) bị `.content nav` unlayered biến thành topbar (computed `height:56px`, `sticky`, `z-index:1000`), ảnh hưởng 4/5 trang legacy; chưa đóng DoD Phase 3.

**2026-11-23 — chốt 9 quyết định trước Phase 3 (chưa build):**

- Rà soát code + đo bằng Edge headless/CDP phát hiện: `Page.css` unlayered đè toàn bộ padding/margin của `sn-*` (`.sn-btn` 24px → 0px, `.sn-input` 40px → 0px) và Tailwind utilities trong workspace cũng đã chết từ khi lên Tailwind v4 (`form.mt-7` 28px → 0px). Đã ghi thành §2.5.
- **Quyết định:** thêm layer `sn-legacy-reset` (yếu nhất, khai báo đầu tiên trong `app.css`) và bọc 6 block toàn cục của `Page.css`; phần còn lại giữ unlayered.
- **Quyết định:** scope `body`/`a`/`label` của `base/*.css` vào `.sn-shell` đến Phase 11 để không restyle 41 trang chưa migrate.
- **Quyết định:** WorkspaceLayout giữ `<div class="content"><main>` và sidebar **230px** (khớp Page.css); sidebar dùng class riêng, không dùng `.sidebar` để tránh `z-index: 2000`.
- **Quyết định:** `WorkspaceTopbar` giữ đủ chức năng `navbar.tsx` (chuông + polling, LanguageSwitcher, avatar menu, logout) và thêm theme toggle.
- **Quyết định:** nav shipper rút còn Dashboard + Cài đặt; 6 href chưa có route ghi backlog. Alias `shipper` vẫn sửa ở Phase 9.
- **Quyết định:** `AuthBrandPanel` bỏ "số liệu thật" và ảnh picsum; panel là editorial + 3 trust point + hotline/email.
- **Quyết định:** bảng breakpoint thêm mốc `sm = 640px` (xs 480 / sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1440); không đổi 3 media query đã viết ở 2B.
- **Quyết định:** bỏ `UtilityStrip` khỏi Phase 3 (ghi backlog).
- **Quyết định:** commit riêng 2A/2B/2C trước Phase 3 và `git mv` 7 file `components/ui` về chữ thường; thêm commit `fix(ui): move legacy global reset under sn-legacy-reset` vào §13.
- Cập nhật §2.3, §2.5, §4.8, §4.10 (cây file thật: 9 `components/*.css` + `Page.css`), §4.10 layer note, §7 Phase 3 (viết lại đầy đủ), §9, §10.3, §11, §12, §13.

**2026-11-22 — Phase 2C hoàn tất (hết Phase 2):**

- Thêm 4 file CSS dưới `@layer sn-components`: `data.css` (card, table, badge, avatar, skeleton, progress), `status.css` (alert, empty state, error state), `typography.css` (heading, text, eyebrow, meta, text link) và khối `sn-lang*` trong `navigation.css`.
- Rewrite 13 primitive: `card`, `table`, `badge`, `status-badge`, `avatar`, `alert`, `empty-state`, `error-state`, `skeleton`, `progress`, `typography`, `text-link`, `language-switcher`.
- Bỏ `cva` khỏi `card`, `badge`, `skeleton`, `typography` (đủ 7/7 file theo kế hoạch, cùng `button`, `icon-button`, `input` ở 2A). Helper `cardVariants`/`badgeVariants`/`skeletonVariants`/`headingVariants`/`textVariants` giữ nguyên chữ ký, trả class `sn-*`.
- Chuyển variant sang `data-*`: `data-variant`/`data-padding` (Card), `data-tone`/`data-size` (Badge), `data-align`/`data-density`/`data-sticky`/`data-clickable`/`data-empty` (Table), `data-size`/`data-status` (Avatar), `data-variant`/`data-width` (Skeleton), `data-tone` (Progress, Alert), `data-size`/`data-tone`/`data-serif` (Heading, Text, Eyebrow, Meta), `data-tone`/`data-underline` (TextLink).
- `status-badge` bỏ hẳn class `status pending|process|completed` của `Page.css`; map sang tone `warning|accent|success` qua bảng tra, giữ nguyên toàn bộ nhánh `status`/`type` và chuỗi `t(...)`.
- `language-switcher` bỏ toàn bộ inline style và 3 giá trị hex (`#ffffff`), chuyển sang `.sn-lang*`; thay tam giác CSS bằng `ChevronDown`, bỏ state `isHovering` (hover do CSS đảm nhiệm).
- `Table` composite giữ API `columns/data/rowKey/density/stickyHeader/loading/empty/onRowClick`; ô loading dùng `<Skeleton />`, ô rỗng dùng `data-empty`.
- Lint: `_props` trong các helper `*Variants` bị `@typescript-eslint/no-unused-vars` bắt; đổi sang kiểu hàm `(props?: …) => string` với implementation không tham số ở cả 7 file (gồm 3 file của 2A).
- Allowlist 168 → **156** (12 entry; `status-badge` vốn không nằm trong danh sách).
- `check:css` pass (109 file checked, 156 allowlisted); `types`, `format:check`, `eslint ui/`, `build` pass; CSS bundle 168,49 kB.
- Verify bằng Edge headless + CDP: light và dark đều đúng token cho card (surface/inset/sunken), table (header 11 px in hoa, số căn phải, tabular), badge (accent/neutral/ink/success), avatar, alert, empty/error, skeleton (shimmer 1,4 s), progress, heading/text/eyebrow/meta/text-link, language switcher; `/`, `/search`, `/contact`, `/about`, `/login` không có console error.

**2026-11-22 — Phase 2B hoàn tất:**

- Thêm 3 file CSS dưới `@layer sn-components`: `overlay.css` (scrim, dialog, sheet, dropdown, tooltip), `feedback.css` (toaster, toast), `navigation.css` (tabs, pagination, breadcrumbs).
- Rewrite 7 primitive: `dialog`, `sheet`, `dropdown-menu`, `toast`, `tabs`, `pagination`, `breadcrumbs`. `tooltip` và `toaster` vốn đã sạch (tooltip không nằm trong allowlist từ trước).
- Chuyển variant/trạng thái sang `data-*`: `data-size` (dialog), `data-side` (sheet), `data-variant`/`data-active` (tab, tab count), `data-active` (pagination), `data-tone` (toast icon), `data-inset`/`data-destructive` (dropdown item), `data-current` (breadcrumb).
- Giữ nguyên API public: `Dialog`/`DialogContent` (`size`, `showClose`, `showOverlay`), `Sheet` (`side`), `DropdownMenu` (`items`, `align`), `Tabs` (`variant`), `Pagination` (cả chế độ `links` legacy lẫn `page`/`pageCount`), `Breadcrumbs` (`maxItems`), `toast`/`useToast`/`Toaster` và toàn bộ type export.
- Pagination: chuỗi "Hiển thị 1 – 12" đổi sang dấu gạch ngang thường để đúng luật copy (không en-dash).
- Breadcrumbs: tách nhánh rút gọn thành `VisibleCrumb` nội bộ thay vì nhét icon ellipsis vào `label`, để `BreadcrumbItem` giữ nguyên shape.
- Allowlist 175 → **168**.
- `check:css` pass (94 file checked, 168 allowlisted); `types`, `format:check`, `build` pass; CSS bundle 152,11 kB.
- Verify bằng Edge headless + CDP ở light và dark: mọi selector (`sn-dialog`, `sn-sheet`, `sn-dropdown`, `sn-tooltip`, `sn-tab`, `sn-tabs`, `sn-pagination*`, `sn-breadcrumbs*`, `sn-toast*`, `sn-toaster`) nhận đúng token; `/`, `/login`, `/search` không có console error; sheet mobile 390 mở đúng `data-side="bottom"`, có scrim và nút đóng.

**2026-11-22 — Phase 2A hoàn tất:**

- Tạo `resources/js/lib/cx.ts`; `button.css`, `field.css`, `file-dropzone.css` dưới `@layer sn-components`.
- Rewrite 15 form primitive: button, icon-button, input, textarea, select, checkbox, switch, radio-card, form-field, input-error, search-input, password-strength, file-dropzone, rich-text-editor, primary-input.
- Giữ API/variant: Button `default/outline`, size `default/icon-*`; Input/Select size `sm/md/lg`; Checkbox/Switch/Radio giữ nguyên.
- **Sửa lỗi layer:** `sn-components` phải nằm sau Tailwind `base/components` và trước `utilities`; thứ tự mới `sn-reset, theme, base, sn-base, components, sn-components, sn-layouts, sn-utilities, utilities`. Trước khi sửa, preflight reset input/button (ô nhập trong suốt, button mất nền).
- Allowlist 186 → **175** (11 entry UI có trong danh sách; 4 file vốn đã sạch).
- `check:css` pass (84 file checked, 175 allowlisted); `types`, `format:check`, `build` pass; CSS bundle 138,83 kB.
- Verify `/login` ở 1440: label/input/button/checkbox nhận đúng token; screenshot light mode OK.

**2026-11-22 — chốt kế hoạch Phase 2:**

- Phạm vi **37 primitive dùng chung**; defer 10 file legacy (`action-button`, `action-buttons`, `action-dropdown`, `confirmation-modal`, `data-table`, `filter-panel`, `header`, `insights`, `navbar`, `sidebar`) sang Phase 3/7/8.
- Chia 3 đợt: **2A** form controls (15), **2B** overlay/feedback (9), **2C** data display (13).
- Kích hoạt `@layer sn-*` và import `components/*.css` trong Phase 2; **không** import `utilities.css`/`base/*`/`layouts/*`.
- Giữ component `typography` + API (19 file dùng), chỉ đổi ruột; thêm `components/typography.css`.
- Giữ tương thích variant: Button `default/outline`; Badge `ink/outline`; Alert/Toast `info`; Card `inset/ghost`; Tabs `pill/filter`; Typography size/tone/serif.
- `cva` bỏ khỏi 7 primitive UI; `Price.tsx` để Phase 4. `cn` chỉ đổi trong primitive; pages giữ `cn`.
- Xoá allowlist từng file sau rewrite; file defer vẫn allowlist.

**2026-11-22 — Phase 1 hoàn tất:**

- Tạo `resources/css/tokens/{primitive,semantic,scale}.css`, `resources/css/fonts.css` (8 `@font-face`), `resources/css/base/{reset,typography,forms,a11y}.css`, `resources/css/utilities.css`.
- `app.css` chỉ thêm import token + `fonts.css`; chưa import `base/*`, `components/*`, `layouts/*`, `utilities.css` hay khai báo `@layer sn-*` (để Phase 2).
- `app.blade.php`: inline script set `data-theme` + mirror `.dark` + `colorScheme` trước paint; bỏ `@class`, bỏ Google Fonts và 2 preconnect; giữ Boxicons + body class.
- `useTheme`: SSR-safe, set `data-theme`, mirror `.dark`, cập nhật `colorScheme`.
- `app.tsx`: `progress.color` dùng `var(--sn-color-accent)`; bỏ `app.tsx` khỏi allowlist (187 → 186).
- `check:css` pass (69 file checked, 186 allowlisted); `types`, `format:check`, `build` pass; CSS bundle `app.css` 124,29 kB (baseline 112,57 kB).

**2026-11-22 — rà soát trước Phase 1 (đã chốt):**

- Giữ **mirror `.dark`** đến Phase 11 để `Page.css`/`base.css`/`legacy-tokens` không mất dark mode; inline script và `useTheme` set cả `data-theme` lẫn class.
- `useTheme` set thêm `style.colorScheme` và **SSR-safe** (`config/inertia.php` đang bật SSR, không đọc `localStorage` khi không có `window`).
- Cho phép `!important` riêng trong `resources/css/base/a11y.css` cho `prefers-reduced-motion`; guardrail dùng path exception, không thêm vào allowlist.
- Đổi layer sang `sn-reset/sn-base/sn-components/sn-layouts/sn-utilities`; import không dùng `layer()` để tránh layer lồng nhau.
- Format `resources/css/legacy-tokens.css`; `npm run format:check` pass.
- Xác nhận weight 400/500/600/700 đủ dùng; bỏ cả 2 link preconnect Google Fonts ở Phase 1.

**2026-11-22 — Phase 0 hoàn tất:**

- Guardrail `scripts/check-tokens.mjs` viết lại theo ratchet; `check:css` pass với **187 file / 4.755 vi phạm** trong allowlist.
- Tạo `docs/ui/BASELINE.md`: 78 page, 47 primitive, 41 file `Page.css`, 17 render target thiếu, props/trạng thái/hành động chính.
- Tải 8 file `woff2` Be Vietnam Pro (400/500/600/700, latin + vietnamese) vào `public/fonts/be-vietnam-pro/`.
- Thêm `docs/ui/baseline/` vào `.gitignore`; tạo thư mục cho ảnh baseline thủ công.
- Ghi quy tắc đóng băng vào `AGENTS.md`; thêm `check:css` / `check:css:all` vào `package.json`.
- `npm run types` và `npm run build` sạch.

**2026-11-22 — rà soát trước Phase 0, cập nhật theo thực tế codebase:**

- Sửa số liệu: `Page.css` importers **41** (không phải 42); `className=` **2.096** (không phải 2.088); allowlist **65 file**.
- Bổ sung `Admin/Inventory/Report` vào danh sách 17 render target thiếu.
- Guardrail chuyển sang **ratchet bằng allowlist**; Phase 0 ghi baseline, Phase 11 mới strict.
- Tách `resources/css/fonts.css` để self-host font có hiệu lực ngay Phase 1.
- Thay cơ chế `legacy.ts` bằng **wrapper giữ nguyên path** cho 10 component legacy; giữ type `ActionConfig`.
- Chốt `feedback/ConfirmDialog` là canonical; `ui/confirmation-modal` thành wrapper.
- Phase 9 chốt phương án **sửa alias + shell/empty state**, không bịa dữ liệu chuyến.
- Chuyển thời điểm xoá `Page.css` sang **Phase 11**.
- Thêm `@tailwindcss/oxide-linux-x64-gnu`, `app.tsx` hex, `.gitignore` baseline, font prerequisite vào checklist.
- Giữ nguyên `ChatDock`/`showChatDock` khi tách layout.

---

_Hết kế hoạch. Mọi thay đổi ngoài phạm vi ghi vào backlog, không đưa vào refactor._
