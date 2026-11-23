# ShopNest - Kế hoạch redesign trang chủ "Sương Mai" (Glass Storefront)

> **Direction:** SƯƠNG MAI (Aurora Retail) - kính iOS có kiểm soát trên nền sứ lạnh
> **Nhánh:** `feat/storefront-aurora-glass` (tách từ `refactor/ui-web`)
> **Trạng thái:** Kế hoạch đã chốt, chưa triển khai
> **Phạm vi:** `Home/Index` + `StorefrontHeader` + `StorefrontFooter` + `ProductCard`/`Price`
> **Ngoài phạm vi:** backend, route, props Inertia, nghiệp vụ, schema, seed, API, workspace (Seller/Admin/Shipper)
> **Tài liệu liên quan:** `REFACTOR_PLAN.md` (Direction Bảng Hiệu, vẫn là nguồn cho workspace), `AGENTS.md` (chốt hiện trạng kỹ thuật)

---

## 0. Tóm tắt điều hành

### 0.1 Vấn đề

Trang chủ hiện tại không "xấu" do lỗi CSS lẻ tẻ. Nó đang bị áp **đúng** direction Bảng Hiệu: catalogue in, đường kẻ thay bóng đổ, bo góc 2-8 px, chữ 11-13 px cho metadata, một accent cam đất tiết chế. Đó là lựa chọn đúng cho bảng vận hành dày đặc, nhưng sai cho một trang chủ thương mại điện tử hướng người mua Việt.

Ba phàn nàn của chủ dự án - chữ nhỏ, bo góc ít, màu mờ nhạt - đều là **hệ quả trực tiếp của direction**, không phải lỗi implementation. Muốn sửa thì phải đổi direction cho storefront, không phải tinh chỉnh từng chỗ.

### 0.2 Quyết định đã chốt

| # | Quyết định | Giá trị |
|---|---|---|
| 1 | Phạm vi | Home + header/footer + ProductCard/Price (Search/ProductDetail chỉ chịu ảnh hưởng token, có audit) |
| 2 | Mức glass | **Kính có kiểm soát**: blur thật chỉ ở header, mobile sheet, dropdown, chat dock; card/panel dùng "kính giả" (nền bán trong suốt + hairline sáng + bóng màu, không blur) |
| 3 | Bảng màu | **Coral trên nền sứ lạnh**: accent `#D93E0E`, canvas `#F4F6F9`, mesh san hô/mint/sky/cát |
| 4 | Git | Commit riêng phần test data đang dở trên `refactor/ui-web`, rồi tách nhánh mới |
| 5 | Workspace | **Không chạm**. Mọi token override được scope trong `.sn-storefront` |
| 6 | Dữ liệu | Không thêm props, không thêm số liệu giả, bỏ toàn bộ ảnh `picsum.photos` |
| 7 | Direction cũ | Storefront tách khỏi Bảng Hiệu. `REFACTOR_PLAN.md` giữ nguyên cho workspace, ghi chú chuyển hướng ở Phase 0 |

### 0.3 Kết quả bàn giao

| Hạng mục | Kết quả |
|---|---|
| Nền | Mesh gradient tĩnh 4 màu, phủ toàn storefront, 0 chi phí GPU |
| Chrome | Header 72 px glass blur 16 px, search 48 px pill, tap target 44 px |
| Card | Radius 20 px, tên 16 px/600, giá 20 px/700, badge giảm giá nổi |
| Chữ | Body 16 px, metadata tối thiểu 13 px (legal 12 px) |
| Màu | Coral `#D93E0E` (fill) + `#B93008` (text), nền sứ lạnh, mesh ấm |
| Ảnh | 100% ảnh sản phẩm thật từ props, không còn picsum |
| A11y | Contrast ≥ 4.5:1 trên vùng mesh sáng nhất, fallback reduced-transparency |
| Hiệu năng | ≤ 3 lớp `backdrop-filter`/view, không animate backdrop-filter |

---

## 1. Chẩn đoán hiện trạng (đo trên code)

### 1.1 Nguyên nhân gốc

| Triệu chứng | Nguyên nhân trong code | Bằng chứng |
|---|---|---|
| Chữ quá nhỏ | Thang type Bảng Hiệu dành cho bảng dày: `2xs` 11 px, `xs` 12 px, `sm` 13 px, `base` 15 px | Tên sản phẩm dùng `--sn-text-sm` = 13 px; nav header 13 px; meta 12 px; nhãn in hoa 11 px |
| Bo góc ít | `--sn-radius-xs` 2 px → `xl` 12 px; card 8 px, ảnh 2 px | `tokens/scale.css` |
| Màu mờ nhạt | Canvas `#f2f2ee` + accent `#c2410c` chỉ dùng cho CTA/link; phần còn lại là xám | `tokens/semantic.css` |
| Không có chiều sâu | Luật "đường kẻ thay bóng đổ", shadow chỉ cho overlay | `REFACTOR_PLAN.md` §3.2 |
| Thiếu "app feel" | Header 56 px, search 40 px, icon 40 px | `layouts/storefront.css` |
| Nội dung generic | 4 ảnh `https://picsum.photos/...` remote, tải ngoài, không liên quan catalog | `Home/Index.tsx`, `BrandSpotlight.tsx` |
| Hero bị phủ nền | `.hero { background: var(--sn-color-canvas) }` che mọi nền phía sau | `storefront.module.css` |

### 1.2 Ràng buộc kỹ thuật phải tôn trọng

1. **Không đổi hợp đồng dữ liệu.** `HomeController::index` trả đúng 5 prop: `categories`, `flashSale`, `suggestedProducts`, `bestSellers`, `banners` (mảng rỗng), `cartCount`. Không có voucher, không có shop, không có testimonial.
2. **`check-tokens.mjs` là ratchet.** 104 file legacy sau Phase 5. Cấm hex/rgb/`rgba()` trong `resources/js/**/*.css` và `resources/css/{components,layouts}/`; cấm Tailwind utility trong TSX; cấm `@apply`; cấm `!important` ngoài `utilities.css` + `base/a11y.css`. Không bao giờ thêm entry vào allowlist.
3. **Hai theme tồn tại song song.** Home truyền `pinLight={false}` nên `data-theme` nằm ở `<html>`, không phải root. Selector dark phải xử lý cả hai vị trí + fallback `prefers-color-scheme`.
4. **`base/*` chỉ scope `.sn-shell`.** Token storefront override phải nằm trong `.sn-storefront`, không đặt ở `:root`, nếu không workspace đổi màu.
5. **Không có `filter`/`opacity` trên ancestor của header.** Chúng tạo backdrop-root và vô hiệu hoá `backdrop-filter`.
6. **`Page.css` unlayered không nằm trong `app.css`.** Storefront không import nó, nên rủi ro va chạm workspace là thấp, nhưng `.dark` legacy mirror vẫn tồn tại.

---

## 2. Nghiên cứu

### 2.1 Thị trường Việt Nam

| Dữ liệu | Nguồn |
|---|---|
| 92% người tiêu dùng VN dùng smartphone để mua sắm; desktop 30%, tablet 13% | TGM Research, Vietnam E-commerce Report 2025 (mẫu 1.120 người) |
| 50% mua online ít nhất 1 lần/tuần | TGM Research 2025 |
| Shopee VN ~53,8% traffic mobile; Lazada VN 78,7% | Similarweb 6/2025 |
| Thời trang 63%, chăm sóc cá nhân 55%, mỹ phẩm 48% là nhóm mua nhiều nhất | TGM Research 2025 |
| COD vẫn phổ biến nhất; 49% đã thử BNPL | TGM Research 2025 |

**Hệ quả thiết kế:**
- Mobile 390 px là canvas chính, không phải bản thu nhỏ của desktop.
- Lưới sản phẩm **2 cột** trên mobile (chuẩn Shopee/TikTok Shop), không phải 1 cột.
- Giá là điểm neo thị giác số 1; % giảm giá phải nổi nhưng không phải badge rác.
- Search là trung tâm; tap target ≥ 44 px.
- CTA và badge phải đọc được bằng ngón tay cái, không nằm sát mép trên.

### 2.2 Giới hạn của glassmorphism

Tổng hợp từ Clay, LogRocket, web.dev, Interface Lab, hướng dẫn Liquid Glass:

| Nguyên tắc | Hệ quả cho ShopNest |
|---|---|
| Glass là accent, không phải ngôn ngữ toàn cục. Khi mọi bề mặt là kính, không có gì đọc ra là kính | Blur thật chỉ cho chrome; card dùng kính giả |
| Trần hiệu năng 2-3 lớp `backdrop-filter`/view; blur 12 px trên 1 card có thể 60 → 40 fps trên Android tầm trung | Header + sheet + dropdown = 3; card **không blur** |
| Blur ≥ 20 px trên sticky full-width là bẫy hiệu năng | Cap 16 px, `@supports`, fallback đục |
| Contrast trong glass là động, phải đo trên vùng nền xấu nhất | Mesh giữ độ sáng cao; card nền ≥ 74% đục; chữ không nằm trên blur |
| `-webkit-backdrop-filter` vẫn cần cho Safari (~20% traffic mobile) | Bắt buộc |
| Phải có fallback: `@supports not`, `prefers-reduced-transparency`, `prefers-reduced-motion`, `forced-colors` | Bắt buộc |
| Ancestor có `filter`/`transform`/`opacity` giết blur | Mesh dùng `radial-gradient`, không `filter: blur()` |

### 2.3 Chống "AI slop" (design-taste-frontend)

Đây là danh sách **cấm** áp cho lần này:

- Không gradient tím/xanh AI, không gradient-clip headline, không glow.
- Không glassmorphism tràn lan (đúng như user yêu cầu "toàn bộ", nhưng triển khai có kiểm soát - xem §3.2).
- Không palette "warm paper + brass + espresso" (đúng cái đang có: `#f2f2ee` + `#c2410c`).
- Không pill spam: pill chỉ cho chip, search, badge, avatar.
- Không eyebrow trên mọi section: tối đa 1 eyebrow/3 section.
- Không số liệu giả, không emoji trong UI, không ảnh stock picsum.
- Không 6 card trắng giống nhau; phải có biến thiên vật liệu (kính, tint, ảnh thật).

---

## 3. Direction: SƯƠNG MAI

### 3.1 Design read

> "Đọc đây là: trang chủ marketplace cho người mua Việt trên mobile, với ngôn ngữ premium-consumer Apple-adjacent (kính sương trên nền sứ), đi theo `--sn-*` token + CSS Modules, không Tailwind."

### 3.2 Ba tầng vật liệu

Đây là điểm quan trọng nhất của kế hoạch. "Toàn bộ UI glass" được hiểu là **toàn bộ UI nằm trong một không gian kính**, chứ không phải mọi element đều `backdrop-filter`.

| Tầng | Vật liệu | Thành phần | Chi phí GPU |
|---|---|---|---|
| **Chrome** | Kính thật: `backdrop-filter: blur(16px) saturate(1.8)` + hairline sáng + inner highlight | Header sticky, mobile sheet, dropdown, chat dock | 3 lớp/view |
| **Panel** | Kính giả: nền `color-mix(surface 78%, transparent)` + hairline + bóng màu ấm | Hero stage, flash-sale panel, trust bar, brand band | 0 |
| **Content** | Đục gần hoàn toàn: `color-mix(surface 94%, transparent)` | Product card, form, bảng | 0 |

Lý do: nền mesh lộ qua lớp bán trong suốt đã đủ tạo cảm giác kính. `backdrop-filter` chỉ thêm phần "nhoè" - mà mắt chỉ nhận ra khi có chi tiết phía sau. Với card sản phẩm (nền phẳng, ảnh đục), blur không tạo thêm giá trị nhưng lấy đi 20 fps.

### 3.3 Sáu nguyên tắc thị giác

1. **Nền có không khí.** Mesh 4 màu rất nhạt, tĩnh, phủ fixed. Không bao giờ để canvas phẳng một màu.
2. **Kính có viền sáng.** Mọi bề mặt kính có hairline trên sáng hơn + inner highlight 1 px. Đây là chi tiết tạo "iOS".
3. **Bo lớn, đều.** Control 14 px, card 20 px, panel 24-28 px, chip/search pill. Không trộn 2 px với 20 px.
4. **Chữ đủ lớn.** Body 16 px, không có chữ 11 px trong nội dung.
5. **Một accent, hai vai.** `#D93E0E` cho fill (chữ trắng), `#B93008` cho text/link trên nền sáng.
6. **Bóng màu, không bóng đen.** Shadow tint theo nền ấm, alpha thấp, blur lớn, spread âm.

### 3.4 Bảng màu

| Vai trò | Light | Dark | Ghi chú |
|---|---|---|---|
| Canvas | `#F4F6F9` | `#0A0C10` | Sứ lạnh, không phải giấy ấm |
| Canvas alt | `#FBFCFD` | `#101319` | Footer, band |
| Surface | `#FFFFFF` | `#14181F` | Card đục |
| Sunken | `#EAEEF3` | `#0E1117` | Ảnh placeholder, input |
| Text | `#101319` | `#F2F5F8` | 17,2:1 trên canvas |
| Text muted | `#4E5867` | `#A9B3C0` | ≥ 6:1 |
| Text faint | `#5F6978` | `#8B96A5` | 5,1:1 trên canvas |
| Border | `#DCE2EA` | `#252B35` | |
| Border strong | `#B4BECD` | `#3C4553` | |
| Accent (fill) | `#D93E0E` | `#FF8A5B` | Trắng trên `#D93E0E` = 4,52:1 |
| Accent hover | `#B93008` | `#FFA277` | |
| Accent text | `#B93008` | `#FF8A5B` | 5,56:1 trên canvas |
| Accent wash | `#FFF0EA` | `#3A241C` | |
| On accent | `#FFFFFF` | `#1A0E08` | |
| Success (freeship) | `#1F6F4A` | `#5FC79B` | Giữ ramp cũ |
| Danger (sale) | `#B3261E` | `#F08A80` | Giữ ramp cũ |

Mesh (alpha thấp, không bao giờ phủ đậm):

| Blob | Light | Vị trí |
|---|---|---|
| Coral | `rgb(255 176 145 / 0.30)` | top-left 10% / 5% |
| Mint | `rgb(150 226 197 / 0.26)` | top-right 85% / 18% |
| Sky | `rgb(160 196 255 / 0.22)` | mid-left 25% / 55% |
| Sand | `rgb(255 214 160 / 0.24)` | bottom-right 90% / 92% |

Dark: cùng hue, alpha 0.10-0.14, cộng một lớp `#0A0C10` phủ để giữ độ tối.

---

## 4. Hệ thống token

### 4.1 Nguyên tắc

1. File mới `resources/css/tokens/storefront.css`, import sau `tokens/scale.css`.
2. **Toàn bộ override scope trong `.sn-storefront`**, không đặt ở `:root`.
3. File `tokens/*` **không** bị `check-tokens` quét màu, nên được phép `rgb()`/hex. Mọi file khác thì không.
4. Không đặt token theo tên component. Đặt theo vai trò.
5. Dark mode phải xử lý 3 nhánh: `[data-theme='dark'] .sn-storefront`, `.sn-storefront[data-theme='dark']`, và `@media (prefers-color-scheme: dark)` cho trường hợp chưa có `data-theme`.

### 4.2 Khung token

```css
/* resources/css/tokens/storefront.css
 * Storefront skin - scoped so workspace keeps Direction Bảng Hiệu.
 * Chỉ file này được phép dùng màu thô.
 */

.sn-storefront,
.sn-storefront[data-theme='light'] {
    color-scheme: light;

    /* Surface */
    --sn-color-canvas: #f4f6f9;
    --sn-color-canvas-alt: #fbfcfd;
    --sn-color-surface: #ffffff;
    --sn-color-surface-sunken: #eaeef3;
    --sn-color-border: #dce2ea;
    --sn-color-border-strong: #b4becd;

    /* Text */
    --sn-color-text: #101319;
    --sn-color-text-muted: #4e5867;
    --sn-color-text-faint: #5f6978;

    /* Accent */
    --sn-color-accent: #d93e0e;
    --sn-color-accent-hover: #b93008;
    --sn-color-accent-text: #b93008;
    --sn-color-accent-wash: #fff0ea;
    --sn-color-on-accent: #ffffff;
    --sn-color-focus: #d93e0e;

    /* Radius - lớn hơn Bảng Hiệu */
    --sn-radius-xs: 0.5rem;   /* 8  - ảnh nhỏ */
    --sn-radius-sm: 0.625rem; /* 10 */
    --sn-radius-md: 0.875rem; /* 14 - input/button */
    --sn-radius-lg: 1.25rem;  /* 20 - card */
    --sn-radius-xl: 1.75rem;  /* 28 - panel */

    /* Type - nâng sàn */
    --sn-text-2xs: 0.75rem;   /* 12 - nhãn in hoa */
    --sn-text-xs: 0.8125rem;  /* 13 */
    --sn-text-sm: 0.875rem;   /* 14 */
    --sn-text-base: 1rem;     /* 16 - body */
    --sn-text-md: 1.0625rem;  /* 17 - đọc */
    --sn-text-lg: 1.25rem;    /* 20 - giá */
    --sn-text-xl: 1.5rem;     /* 24 */
    --sn-text-2xl: 1.875rem;  /* 30 */
    --sn-text-3xl: 2.25rem;   /* 36 */
    --sn-text-4xl: clamp(2.125rem, 4vw, 3.75rem);

    /* Glass */
    --sn-glass-bg: rgb(255 255 255 / 0.72);
    --sn-glass-bg-strong: rgb(255 255 255 / 0.88);
    --sn-glass-line: rgb(255 255 255 / 0.62);
    --sn-glass-line-outer: rgb(16 19 25 / 0.07);
    --sn-glass-highlight: rgb(255 255 255 / 0.55);
    --sn-glass-blur: 16px;
    --sn-glass-saturate: 1.8;

    /* Elevation - màu ấm, không đen */
    --sn-shadow-card: 0 18px 40px -28px rgb(40 24 12 / 0.28);
    --sn-shadow-float: 0 28px 64px -36px rgb(40 24 12 / 0.34);
    --sn-shadow-chrome: 0 12px 32px -24px rgb(40 24 12 / 0.26);
    --sn-shadow-inset: inset 0 1px 0 var(--sn-glass-highlight);

    /* Mesh */
    --sn-mesh-coral: rgb(255 176 145 / 0.3);
    --sn-mesh-mint: rgb(150 226 197 / 0.26);
    --sn-mesh-sky: rgb(160 196 255 / 0.22);
    --sn-mesh-sand: rgb(255 214 160 / 0.24);

    /* Chuyển động */
    --sn-lift: -2px;
}

[data-theme='dark'] .sn-storefront,
.sn-storefront[data-theme='dark'] {
    color-scheme: dark;

    --sn-color-canvas: #0a0c10;
    --sn-color-canvas-alt: #101319;
    --sn-color-surface: #14181f;
    --sn-color-surface-sunken: #0e1117;
    --sn-color-border: #252b35;
    --sn-color-border-strong: #3c4553;

    --sn-color-text: #f2f5f8;
    --sn-color-text-muted: #a9b3c0;
    --sn-color-text-faint: #8b96a5;

    --sn-color-accent: #ff8a5b;
    --sn-color-accent-hover: #ffa277;
    --sn-color-accent-text: #ff8a5b;
    --sn-color-accent-wash: #3a241c;
    --sn-color-on-accent: #1a0e08;
    --sn-color-focus: #ff8a5b;

    --sn-glass-bg: rgb(20 24 31 / 0.62);
    --sn-glass-bg-strong: rgb(20 24 31 / 0.82);
    --sn-glass-line: rgb(255 255 255 / 0.1);
    --sn-glass-line-outer: rgb(0 0 0 / 0.4);
    --sn-glass-highlight: rgb(255 255 255 / 0.12);

    --sn-shadow-card: 0 18px 40px -28px rgb(0 0 0 / 0.7);
    --sn-shadow-float: 0 28px 64px -36px rgb(0 0 0 / 0.8);
    --sn-shadow-chrome: 0 12px 32px -24px rgb(0 0 0 / 0.6);

    --sn-mesh-coral: rgb(255 138 91 / 0.12);
    --sn-mesh-mint: rgb(95 199 155 / 0.1);
    --sn-mesh-sky: rgb(110 150 255 / 0.1);
    --sn-mesh-sand: rgb(255 180 76 / 0.1);
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme]) .sn-storefront {
        /* Sao chép nguyên block dark ở trên.
         * Lý do: Home truyền pinLight={false}, data-theme nằm ở <html>.
         * Nếu thiếu nhánh này, dark mode vỡ riêng ở Home. */
    }
}
```

> Ghi chú triển khai: tránh lặp 3 lần bằng cách đặt block dark vào một custom property set dùng chung, hoặc chấp nhận lặp có comment. Không dùng `@media` lồng trong selector.

### 4.3 Primitive kính

`resources/css/components/glass.css`, nằm trong `@layer sn-components`, chỉ dùng token:

```css
@layer sn-components {
    .sn-glass {
        position: relative;
        border: 1px solid var(--sn-glass-line-outer);
        border-radius: var(--sn-radius-xl);
        background: var(--sn-glass-bg);
        box-shadow: var(--sn-shadow-card), var(--sn-shadow-inset);
    }

    /* Kính thật - chỉ dùng cho chrome */
    .sn-glass--chrome {
        background: var(--sn-glass-bg-strong);
        border-color: var(--sn-glass-line);
        box-shadow: var(--sn-shadow-chrome), var(--sn-shadow-inset);
    }

    @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
        .sn-glass--chrome {
            background: var(--sn-glass-bg);
            backdrop-filter: blur(var(--sn-glass-blur)) saturate(var(--sn-glass-saturate));
            -webkit-backdrop-filter: blur(var(--sn-glass-blur)) saturate(var(--sn-glass-saturate));
        }
    }

    /* Không hỗ trợ blur: nền gần đục, vẫn có viền và bóng */
    @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
        .sn-glass--chrome {
            background: var(--sn-glass-bg-strong);
        }
    }

    /* Viền sáng phía trên - chi tiết tạo cảm giác khối kính */
    .sn-glass::before {
        content: '';
        position: absolute;
        inset: 0 0 auto;
        height: 1px;
        border-radius: inherit;
        background: linear-gradient(90deg, transparent, var(--sn-glass-highlight), transparent);
        pointer-events: none;
    }

    .sn-glass--flat {
        box-shadow: none;
        border-color: var(--sn-color-border);
        background: var(--sn-color-surface);
    }

    @media (prefers-reduced-transparency: reduce) {
        .sn-glass,
        .sn-glass--chrome {
            background: var(--sn-color-surface);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sn-glass {
            transition: none;
        }
    }

    @media (forced-colors: active) {
        .sn-glass,
        .sn-glass--chrome {
            border: 1px solid CanvasText;
            background: Canvas;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
        }
    }
}
```

### 4.4 Mesh nền

Nằm trong `@layer sn-layouts`, gắn vào `.sn-storefront`:

```css
.sn-storefront {
    position: relative;
    isolation: isolate;
}

.sn-storefront::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(60rem 40rem at 8% 2%, var(--sn-mesh-coral), transparent 62%),
        radial-gradient(52rem 36rem at 92% 14%, var(--sn-mesh-mint), transparent 60%),
        radial-gradient(46rem 34rem at 22% 58%, var(--sn-mesh-sky), transparent 62%),
        radial-gradient(56rem 40rem at 88% 96%, var(--sn-mesh-sand), transparent 64%),
        var(--sn-color-canvas);
}
```

Quan trọng:

- **Không** dùng `filter: blur()`. Radial gradient đã mềm sẵn, không tốn GPU.
- **Không** đặt `filter`/`opacity` lên `.sn-storefront` (sẽ giết `backdrop-filter` của header).
- `.sn-storefront__main` hiện có `background: var(--sn-color-canvas)` - phải đổi thành `transparent`.
- Mọi section home đang có nền đục (`.hero`, `.flashPanel`, ...) phải bỏ nền hoặc dùng kính.

---

## 5. Kiến trúc file

### 5.1 File mới

| File | Nội dung | Lý do |
|---|---|---|
| `resources/css/tokens/storefront.css` | Token override scoped `.sn-storefront`, 3 nhánh theme | Nơi duy nhất được dùng màu thô |
| `resources/css/components/glass.css` | `.sn-glass`, `--chrome`, `--flat` + 4 fallback | Primitive dùng lại được cho các phase sau |

### 5.2 File sửa

| File | Thay đổi |
|---|---|
| `resources/css/app.css` | `@import './tokens/storefront.css'` sau `scale.css`; `@import './components/glass.css'` sau `button.css` |
| `resources/css/layouts/storefront.css` | Header glass, search 48 px, nav 15 px, footer nền alt; `.sn-storefront__main` trong suốt; mesh; section header lớn hơn |
| `resources/js/components/layout/StorefrontHeader.tsx` | Thêm class glass, nút search, thứ tự action mobile; giữ nguyên logic/logout/locale |
| `resources/js/components/layout/StorefrontFooter.tsx` | Chỉ chỉnh cấu trúc nếu cần cho band kính; copy giữ nguyên |
| `resources/js/pages/Home/Index.tsx` | Bỏ 4 ảnh picsum; hero lấy ảnh thật; bỏ `EditorialPillars`; giữ nguyên props/handler |
| `resources/js/pages/Home/Home.module.css` | Skeleton khớp layout mới (2 cột mobile) |
| `resources/js/components/storefront/storefront.module.css` | Viết lại toàn bộ layout section |
| `resources/js/components/storefront/HeroEditorial.tsx` | Thêm slot cho ảnh thật, bỏ caption in hoa 11 px |
| `resources/js/components/storefront/CategoryShelf.tsx` | Rail scroll-snap mobile, tile ảnh lớn hơn, bỏ meta "Xem món" lặp |
| `resources/js/components/storefront/FlashSaleModule.tsx` | Panel kính, countdown chip |
| `resources/js/components/storefront/TrustStrip.tsx` | Thanh kính 4 mục, mobile 2x2 |
| `resources/js/components/storefront/BrandSpotlight.tsx` | Band kính, ảnh thật từ props (nếu có), bỏ default picsum |
| `resources/js/components/widgets/...` (nếu cần) | Không thêm |
| `resources/js/components/commerce/commerce.module.css` | ProductCard/Price restyle |
| `resources/js/components/commerce/ProductCard.tsx` | Chỉ thêm class/badge nếu cần; logic giữ nguyên |

### 5.3 File xoá khỏi Home (không xoá khỏi repo)

- `EditorialPillars` không còn render trong `Home/Index.tsx`. Giữ file + component vì có thể dùng lại; đây là dead code tạm thời, ghi vào backlog dọn ở phase sau. **Không** thêm vào allowlist.

### 5.4 Không chạm

`HomeController`, `routes/*`, `ProductCard` logic, `ChatDock` mounting, `MobileNav` logic, `WorkspaceLayout`, `Page.css`, `base.css`, `legacy-tokens.css`, Boxicons CDN, `tailwind.config.ts`.

---

## 6. Spec chi tiết

### 6.1 Header (`StorefrontHeader` + `layouts/storefront.css`)

| Thuộc tính | Hiện tại | Mới |
|---|---|---|
| Cao | 56 px | 72 px desktop, 64 px mobile + hàng search |
| Nền | `canvas` đục + border-bottom | `sn-glass--chrome`, blur 16 px |
| Sticky | Có | Giữ, `z-index: var(--sn-z-header)` |
| Logo | 36 px | 40 px, tên 20 px/700 |
| Nav | 13 px, xám | 15 px/500, hover pill `surface-sunken`, active accent |
| Search | 40 px, viền | 48 px, pill, nền `surface` 88%, icon 20 px, placeholder 15 px |
| Icon button | 40 px | 44 px (tap target), icon 20 px |
| Cart badge | 20 px, 11 px | 22 px, 12 px/700, viền 2 px màu header |
| Login | secondary 32 px | primary 40 px pill |
| Locale | hiện từ 1280 | hiện từ 1280, chữ 14 px |

Lưu ý: không thêm scroll listener. Nếu cần shadow khi scroll, dùng `animation-timeline: scroll()` trong `@supports`, fallback luôn có shadow nhẹ. Không animate `backdrop-filter`.

Mobile:
- Hàng 1: logo 40 + chuông + giỏ + menu (44 px).
- Hàng 2: search full width 48 px.
- Bỏ nút login khỏi header mobile (đã có trong MobileNav).

### 6.2 Hero

Bố cục desktop 7/5, mobile 1 cột.

| Thành phần | Spec |
|---|---|
| Eyebrow | 12 px/600, tracking 0.08em, accent-text. **Chỉ 1 eyebrow cho cả trang** (hero). Các section khác bỏ eyebrow. |
| H1 | `clamp(2.125rem, 4vw, 3.75rem)`, weight 600, tracking -0.02em, line-height 1.06, tối đa 2 dòng, tối đa 6 từ |
| Subcopy | 17 px/1.6, `text-muted`, tối đa 20 từ, `max-width: 46ch` |
| CTA | Primary 52 px, pill, chữ 16 px/600, icon 20 px; tối đa 1 CTA |
| Stage | `.sn-glass` panel 28 px, ảnh thật bên trong |
| Ảnh | 1 ảnh lớn 4:5 + 2 ảnh nhỏ 1:1, lấy từ `bestSellers` hoặc `suggestedProducts` |
| Fallback | Catalog rỗng: stage chỉ có mesh + 3 khối kính trừu tượng, **không** ảnh stock, không caption giả |

Bỏ `heroCaption` in hoa 11 px. Nếu cần nhãn ảnh, dùng 13 px và đặt dưới ảnh, không phủ lên.

Hero phải nằm gọn trong viewport đầu ở 390x844: H1 + sub + CTA hiển thị không cần scroll (ảnh có thể bắt đầu ló ra).

### 6.3 Trust bar

- Ngay dưới hero, một thanh `.sn-glass` mỏng (radius 20, padding 16/20).
- 4 mục: icon 20 px trong ô 36 px radius 12, tiêu đề 14 px/600, mô tả 13 px/1.45.
- Mobile 2x2, **chỉ hiện tiêu đề** (mô tả `display: none` dưới 640 px) để không thành khối chữ.
- Bỏ border-top/bottom hiện tại.

### 6.4 Category shelf

- Mobile: rail `scroll-snap-type: x mandatory`, mỗi item 96 px, ảnh 88 px radius 20, nhãn 15 px/600 tối đa 2 dòng. Ẩn scrollbar. Có `padding-inline` để item đầu không dính mép.
- Desktop 6 cột, item thành tile dọc.
- Bỏ nhãn "Xem món" (đang lặp 6 lần).
- Ảnh danh mục: `category.image_url` thật; fallback lucide icon 28 px trên nền `sunken`.
- `section header`: tiêu đề 30 px, bỏ eyebrow "Sáu nhóm ngành".

### 6.5 Flash sale

- Panel `.sn-glass` radius 28, padding 24, tint coral rất nhẹ ở góc (`radial-gradient` nội bộ, alpha 0.10).
- Header: tiêu đề 30 px + countdown dạng chip: mỗi ô 40x40, radius 10, nền `surface-strong`, chữ 18 px tabular-nums, nhãn 12 px.
- Bỏ eyebrow "Giờ vàng" (đã có tiêu đề).
- Lưới 2 cột mobile → 4 desktop.
- Không có sản phẩm: module trả `null` (giữ nguyên hành vi).

### 6.6 Product shelf (bán chạy + gợi ý)

- Header: tiêu đề 30 px, mô tả 15 px, action "Xem tất cả" 14 px accent-text.
- Lưới: 2 cột ≥ 390, 3 cột ≥ 768, 4 cột ≥ 1024, 5 cột ≥ 1440.
- Gap 12 px mobile, 20 px desktop.
- Empty state giữ nguyên component, chỉ tăng chữ.

### 6.7 Brand spotlight

- Band kính radius 28, 7/5 split.
- Ảnh: dùng ảnh sản phẩm thật đầu tiên nếu có; nếu không, bỏ cột ảnh và dùng band typographic + icon shield, **không** picsum.
- CTA secondary pill 44 px.

### 6.8 Product card + Price

| Thuộc tính | Hiện tại | Mới |
|---|---|---|
| Card radius | 8 px | 20 px |
| Card nền | `surface` đục | `color-mix(surface 94%, transparent)` |
| Card bóng | không | `--sn-shadow-card`, hover `--sn-shadow-float` + `translateY(-2px)` |
| Ảnh radius | 2 px | 16 px |
| Tỉ lệ ảnh | 4:5 | 4:5 (giữ) |
| Tên | 13 px/600 | 16 px/600, line-height 1.35 |
| Shop | 12 px | 13 px |
| Meta | 12 px | 13 px |
| Giá | 18 px/600 | 20 px/700 |
| Giá gốc | 14 px | 14 px, gạch ngang |
| Badge giảm | 11 px, wash | 12 px/700, pill, fill accent, chữ trắng |
| Nút giỏ | 32 px | 40 px desktop, 44 px mobile |
| Padding body | 12 px | 14 px |

Hover chỉ dùng `transform` + `box-shadow`; không animate `backdrop-filter`.

### 6.9 Footer

- Nền `canvas-alt`, hairline trên, **không** blur.
- Chữ link 14 px, tiêu đề cột 14 px/600.
- Social chip pill.
- Giữ nguyên toàn bộ link hiện có.

### 6.10 Skeleton

`HomeSkeleton` phải khớp layout mới: 2 cột mobile, hero stage 4:5, trust bar 1 khối. Không dùng skeleton 1 cột như hiện tại (gây nhảy layout).

---

## 7. Responsive

| Breakpoint | Hành vi |
|---|---|
| < 480 | 1 cột hero, 2 cột sản phẩm, trust 2x2 chỉ tiêu đề, category rail |
| 480-639 | 2 cột sản phẩm, category rail |
| 640-767 | trust 2x2 có mô tả, category 3 cột |
| 768-1023 | hero 7/5, category 6 cột, sản phẩm 3 cột |
| 1024-1279 | sản phẩm 4 cột, flash 4 cột, footer 4 cột |
| ≥ 1280 | sản phẩm 5 cột, hiện locale switcher |
| ≥ 1440 | container 90rem giữ nguyên |

Quy tắc: mọi lưới nhiều cột phải khai báo fallback mobile ngay trong file, không dựa vào "Tailwind lo".

---

## 8. Accessibility và hiệu năng

### 8.1 Ngân sách hiệu năng

| Hạng mục | Ngân sách |
|---|---|
| Lớp `backdrop-filter`/view | ≤ 3 (header, sheet, dropdown/chat) |
| Bán kính blur | ≤ 16 px |
| `filter` trên ancestor của glass | 0 |
| Ảnh hero | `loading="eager"`, `fetchpriority="high"`, kích thước cố định |
| Ảnh shelf | `loading="lazy"` |
| Ảnh remote ngoài domain | 0 (bỏ hết picsum) |
| Animate | chỉ `transform`/`opacity` |
| LCP mobile mục tiêu | < 2,5 s |
| CLS | < 0,1 |

### 8.2 A11y checklist

- [ ] Body ≥ 4,5:1, đo trên vùng mesh sáng nhất (không đo trên mockup).
- [ ] Text phụ (13 px) ≥ 4,5:1; nếu không đạt thì đẩy lên `text-muted`, không dùng `faint`.
- [ ] Focus ring 2 px `--sn-color-focus`, offset 2 px, ≥ 3:1 trên cả kính và nền.
- [ ] Không bỏ outline ở bất kỳ control nào.
- [ ] Tap target ≥ 44 px trên mobile.
- [ ] `prefers-reduced-transparency: reduce` → nền đục, vẫn nhận ra hierarchy.
- [ ] `prefers-reduced-motion: reduce` → không hover lift, không transition.
- [ ] `forced-colors: active` → viền `CanvasText`, không mất boundary.
- [ ] Keyboard: tab qua header → search → nav → hero CTA → category → card → footer, không bẫy focus.
- [ ] Landmark: `header`, `nav`, `main`, `footer`, mỗi `section` có heading.
- [ ] Alt text tiếng Việt, mô tả sản phẩm thật, không "image", không emoji.

### 8.3 Contrast đã tính

| Cặp | Tỉ lệ | Kết luận |
|---|---|---|
| `#101319` trên `#F4F6F9` | 17,2:1 | AAA |
| `#4E5867` trên `#F4F6F9` | ~6,7:1 | AA+ |
| `#5F6978` trên `#F4F6F9` | 5,1:1 | AA |
| `#FFFFFF` trên `#D93E0E` | 4,52:1 | AA (sát ngưỡng, chỉ dùng weight ≥ 600, size ≥ 16) |
| `#B93008` trên `#F4F6F9` | 5,56:1 | AA |
| `#FFFFFF` trên `#B93008` | ~7:1 | AAA |

Nếu contrast `on-accent`/`accent` không đạt sau khi đo thực tế, hạ fill xuống `#C9370B` hoặc tăng weight chữ. Không chấp nhận chữ trắng 14 px/400 trên accent.

---

## 9. Lộ trình

Mỗi phase là một commit độc lập, revert được.

### Phase 0 - Chuẩn bị (S)

1. Trên `refactor/ui-web`: commit riêng `database/factories`, `database/seeders`, `routes/web.php`, migration mới.
   ```
   git add database/ routes/web.php
   git commit -m "chore: sync factories, seeders, routes and administrative division migration"
   ```
2. `git switch -c feat/storefront-aurora-glass`.
3. Chạy baseline: `npm run check:css`, `npm run types` (phải xanh trước khi sửa).
4. Chụp ảnh baseline 1440/1024/768/390 cho Home, Search, ProductDetail.
5. Ghi 1 dòng vào `REFACTOR_PLAN.md` §15 (Nhật ký): storefront chuyển sang Direction Sương Mai từ nhánh này, workspace giữ Bảng Hiệu.

**DoD:** nhánh sạch, baseline xanh, có ảnh đối chiếu.

### Phase 1 - Token + primitive (M)

1. Tạo `tokens/storefront.css` (§4.2).
2. Tạo `components/glass.css` (§4.3).
3. Import vào `app.css`.
4. Mesh nền (§4.4), bỏ nền đục ở `.sn-storefront__main`.
5. Kiểm tra: workspace không đổi màu; dark mode đúng ở 3 nhánh.

**DoD:** `check:css` xanh, `types` xanh, Home đổi màu/bo góc/chữ nhưng bố cục chưa đổi; workspace không đổi pixel nào (so ảnh).

### Phase 2 - Header + footer (M)

1. Header glass, search 48 px, nav 15 px, tap target 44 px.
2. Footer nền alt, chữ 14 px.
3. Cập nhật `.sn-storefront__badge`, logo 40 px.

**DoD:** 4 breakpoint không tràn; menu mobile + dropdown vẫn hoạt động; logout/locale/currency vẫn chạy; chỉ có 1 lớp blur ở header khi đóng sheet.

### Phase 3 - Home recomposition (L)

1. `Home/Index.tsx`: bỏ picsum, bỏ `EditorialPillars`, truyền ảnh thật vào hero/brand.
2. Hero, trust bar, category rail, flash panel, 2 shelf, brand band.
3. `storefront.module.css` viết lại.
4. Skeleton khớp layout.

**DoD:** 390/768/1024/1440 đúng spec §6; hero gọn trong viewport đầu; không ảnh ngoài; không số liệu giả; `HomeControllerTest` pass.

### Phase 4 - Product card + Price (M)

1. `commerce.module.css` phần card/price.
2. Badge giảm giá, nút giỏ 44 px mobile.
3. Audit Search + ProductDetail: chỉ chấp nhận thay đổi do token (radius, chữ, màu), không vỡ layout.

**DoD:** card 2 cột mobile đẹp, giá đọc rõ, hover không giật; Search/ProductDetail không tràn ngang.

### Phase 5 - QA (M)

1. Contrast trên nền mesh thật (dùng DevTools eyedropper tại 4 vùng).
2. Light/dark, reduced-motion, reduced-transparency, forced-colors.
3. Keyboard + screen reader spot check.
4. Lighthouse mobile trên `npm run build` + `php artisan serve`, không phải Vite dev.
5. 4x CPU throttle, scroll shelf, xem FPS.
6. Chụp ảnh after, so baseline.

**DoD:** toàn bộ §8 pass; không regression ngoài phạm vi.

### Phase 6 - Tùy chọn rollout (L, tách nhánh riêng)

Search, ProductDetail refinement, Account/Cart/Checkout, Chat. Chỉ làm sau khi Phase 5 được duyệt. Auth đã xong ở Phase 5 của refactor trước, không cần chạm.

---

## 10. Git

```
refactor/ui-web
  └─ chore: sync factories, seeders, routes
  └─ feat/storefront-aurora-glass
       ├─ 01 feat(storefront): add glass tokens and mesh skin
       ├─ 02 feat(storefront): glass header and footer
       ├─ 03 feat(home): recompose hero, trust, categories and shelves
       ├─ 04 feat(commerce): restyle product card and price
       └─ 05 chore(qa): a11y, contrast and performance pass
```

Quay lại `refactor/ui-web` bất cứ lúc nào là về nguyên trạng. Không merge vào `develop`/`main` cho đến khi Phase 5 được duyệt.

---

## 11. Kiểm chứng

```bash
# Bắt buộc, phải xanh
npm run check:css
npm run types
npm run lint
npm run build

# Test backend (props không đổi nên phải pass)
php artisan test tests/Feature/HomeControllerTest.php

# Tùy chọn, trước khi merge
vendor/bin/pint --test
npm run format:check
```

Kỳ vọng:

- `check:css` báo `104 file(s) checked, N legacy file(s) allowlisted` với N **không tăng**.
- Không file mới nào xuất hiện trong `scripts/token-allowlist.json`.
- Không hex/rgb trong `resources/js/**/*.css`.
- `HomeControllerTest` pass toàn bộ, không sửa test.

---

## 12. Rủi ro và cách giảm

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Glass làm chữ khó đọc trên vùng mesh đậm | Cao | Card nền ≥ 74% đục; chữ không đặt trên blur; mesh alpha ≤ 0.30; đo contrast trên nền sáng nhất |
| Tụt FPS Android tầm trung | Cao | ≤ 3 lớp blur; cap 16 px; card dùng kính giả; test 4x CPU throttle |
| Token override lan sang Search/ProductDetail gây vỡ | Trung bình | Audit 2 trang; chỉ chấp nhận thay đổi do radius/type; ảnh trước/sau |
| Dark mode vỡ riêng Home do `data-theme` ở `<html>` | Trung bình | 3 nhánh selector + test thủ công cả 3 |
| Xung đột với Direction Bảng Hiệu | Trung bình | Scope `.sn-storefront`; ghi nhật ký `REFACTOR_PLAN.md`; workspace không chạm |
| Ancestor `filter`/`opacity` giết blur | Trung bình | Không đặt filter lên shell; mesh dùng radial-gradient |
| Hero rỗng khi chưa có sản phẩm | Thấp | Fallback typographic + khối kính, không ảnh giả |
| Bỏ `EditorialPillars` bị coi là mất tính năng | Thấp | Đây là UI, không phải feature; file giữ nguyên trong repo |
| Màu coral không đạt AA ở 14 px | Thấp | Chỉ dùng `accent-text` cho chữ; fill chỉ với chữ ≥ 16 px/600 |
| Ảnh sản phẩm tỉ lệ lệch làm card so le | Thấp | `aspect-ratio: 4/5` + `object-fit: cover` |

**Rollback:** `git switch refactor/ui-web`. Không có migration, không có thay đổi DB, nên rollback tức thời.

---

## 13. Ngoài phạm vi

- Không sửa `HomeController`, route, props, validation.
- Không thêm section cần dữ liệu mới (voucher band, testimonial, shop wall, "đã bán 1,2k").
- Không thêm emoji, không dùng ảnh stock/picsum/AI-generated.
- Không đổi logo, không đổi font (Be Vietnam Pro giữ nguyên).
- Không chạm workspace, auth, account, cart, checkout.
- Không thêm Tailwind class, không gỡ Tailwind (Phase 11 của refactor cũ).
- Không thêm dependency npm.

---

## 14. Checklist nhanh cho người triển khai

**Trước khi code**
- [ ] Đã commit phần test data, đã tách nhánh
- [ ] `check:css` + `types` xanh trên baseline
- [ ] Đã chụp ảnh baseline 4 breakpoint

**Token**
- [ ] `tokens/storefront.css` scoped `.sn-storefront`
- [ ] 3 nhánh dark mode
- [ ] `glass.css` có `@supports`, reduced-transparency, forced-colors
- [ ] Mesh dùng radial-gradient, không `filter: blur`

**Header**
- [ ] 72 px, blur 16 px, hairline sáng
- [ ] Search 48 px pill
- [ ] Tap target 44 px
- [ ] Không có scroll listener

**Home**
- [ ] 0 ảnh picsum
- [ ] Hero dùng ảnh sản phẩm thật
- [ ] 2 cột sản phẩm mobile
- [ ] 1 eyebrow cho cả trang
- [ ] Không số liệu giả
- [ ] `EditorialPillars` không render

**Card**
- [ ] Radius 20, tên 16, giá 20
- [ ] Hover chỉ transform + shadow
- [ ] Search/ProductDetail không vỡ

**QA**
- [ ] Contrast đo trên mesh thật
- [ ] Light + dark
- [ ] Reduced-motion / reduced-transparency / forced-colors
- [ ] Keyboard tab không bẫy
- [ ] Lighthouse mobile ≥ 85
- [ ] `check:css`, `types`, `lint`, `build`, `HomeControllerTest` xanh

---

## 15. Nhật ký

| Ngày | Việc |
|---|---|
| 2026-11-24 | Chốt kế hoạch. 4 quyết định: phạm vi Home + chrome + card, glass có kiểm soát, coral trên sứ lạnh, commit riêng trước khi tách nhánh. Chưa triển khai. |
