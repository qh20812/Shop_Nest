# ShopNest — Design System: Bảng Hiệu

> Hướng thiết kế: **Bảng Hiệu** — signage / industrial catalog Việt Nam.
> Phiên bản: **Bảng Hiệu 2.0**, bổ sung lớp chrome kính (glass) sau pass navbar.
> Nền tảng: CSS thuần, token `--sn-*`, CSS Modules, React 19 + Inertia 3.
> Nguồn chuẩn kỹ thuật: `resources/css/`, `resources/js/components/ui/`, `COMPONENTS.md`, `AGENTS.md`.
> QA gần nhất: `docs/ui/PHASE-12-QA.md`.

## 1. Định vị

Bảng Hiệu lấy cảm hứng từ biển hiệu cửa hàng, catalogue in và tem nhãn công nghiệp: chữ đậm, đường kẻ rõ, màu cam đất làm tín hiệu, nền giấy lạnh ở light mode và nền than ở dark mode. Giao diện phải đọc nhanh, không trang trí thừa, không giả lập dashboard SaaS.

Ba nguyên tắc:

1. **Tín hiệu, không trang trí.** Accent chỉ dùng cho hành động chính, trạng thái đang chọn và liên kết quan trọng.
2. **Cấu trúc bằng đường kẻ, khoảng trắng và một lớp kính.** Glass là vật liệu của chrome nổi (dock, menu, sheet, panel), không phải hiệu ứng cho card nội dung; mỗi vùng chỉ một lớp blur và mọi bề mặt kính phải có fallback đặc.
3. **Dữ liệu thật.** Không bịa số liệu, badge, tab, cột hay filter. Thiếu dữ liệu thì bỏ UI, không tạo placeholder giả.

## 2. Typography

- **Font duy nhất:** Be Vietnam Pro, self-host qua `resources/css/fonts.css`. Không link Google Fonts ở production (`@font-face` woff2).
- **Numeric:** `--sn-font-numeric` = cùng font; số dùng `font-variant-numeric: tabular-nums` khi cần căn cột.
- **Weight:** 400 regular, 500 medium, 600 semibold, 700 bold.
- **Scale:** `2xs` 11px · `xs` 12px · `sm` 13px · `base` 15px · `md` 16px · `lg` 18px · `xl` 22px · `2xl` 28px · `3xl` 36px · `4xl` clamp(44–56px) · `display` clamp(48–76px).
- **Line height:** tight 1.08 cho display; snug 1.22 cho heading; normal 1.5 cho body; relaxed 1.65 cho prose.
- **Tracking:** tight -0.02em cho display; wide 0.06em cho eyebrow; wider 0.1em cho nhãn nhỏ.
- **Measure:** prose 65ch, lead 46ch.
- **Quy tắc:** mỗi viewport có 1 H1; heading dùng `Heading`; body dùng `Text`; eyebrow chỉ cho metadata thật, không rải trên mọi section.

## 3. Color

### 3.1 Hai tầng token

- `resources/css/tokens/primitive.css` — palette gốc, **file duy nhất được chứa hex**.
- `resources/css/tokens/semantic.css` — role token; component **chỉ dùng tầng này**.

Không dùng `var(--sn-neutral-*)`, `var(--sn-graphite-*)`, `var(--sn-accent-*)` trong component. `check:css` chặn hex/rgb/hsl ngoài `tokens/`.

### 3.2 Role token

| Nhóm | Token |
|---|---|
| Surface | `--sn-color-canvas`, `--sn-color-canvas-alt`, `--sn-color-surface`, `--sn-color-surface-sunken`, `--sn-color-surface-strong`, `--sn-color-surface-inverse` |
| Text | `--sn-color-text`, `--sn-color-text-muted`, `--sn-color-text-faint`, `--sn-color-text-inverse`, `--sn-color-text-on-strong` |
| Line | `--sn-color-border`, `--sn-color-border-strong`, `--sn-color-border-inverse` |
| Accent | `--sn-color-accent`, `--sn-color-accent-hover`, `--sn-color-accent-text`, `--sn-color-accent-wash`, `--sn-color-on-accent`, `--sn-color-focus` |
| Success | `--sn-color-success`, `--sn-color-success-text`, `--sn-color-success-wash`, `--sn-color-on-success` |
| Warning | `--sn-color-warning`, `--sn-color-warning-text`, `--sn-color-warning-wash`, `--sn-color-on-warning` |
| Danger | `--sn-color-danger`, `--sn-color-danger-text`, `--sn-color-danger-wash`, `--sn-color-on-danger` |
| Neutral badge | `--sn-color-neutral`, `--sn-color-neutral-text`, `--sn-color-neutral-wash` |
| Utility | `--sn-color-overlay`, `--sn-color-selection`, `--sn-color-scrim` |
| Glass chrome | `--sn-color-canvas-deep`, `--sn-glass-tint`, `--sn-glass-control`, `--sn-glass-control-hover`, `--sn-glass-field`, `--sn-glass-menu`, `--sn-glass-hover`, `--sn-glass-press`, `--sn-glass-hairline`, `--sn-glass-highlight`, `--sn-glass-ring`, `--sn-shadow-glass`, `--sn-shadow-float`, `--sn-shadow-accent` |

### 3.3 Light / dark

- Light: giấy lạnh (`neutral-100/50/0`), chữ than (`neutral-950`), accent cam đất `accent-600`.
- Dark: than (`graphite-950/900/850`), chữ sáng (`graphite-50/200/300`), accent sáng hơn (`--sn-signal-accent`).
- Selector duy nhất: `[data-theme='dark']`. Không còn `.dark`.
- `color-scheme` được set bằng JS (`useTheme`) và trong token.
- Fallback không JS: `@media (prefers-color-scheme: dark)` chỉ áp cho `:root:not([data-theme])`.
- Wash/border dark được chỉnh riêng, không đảo màu máy móc.

### 3.4 Quy tắc dùng màu

- Accent: CTA chính, tab active, focus ring, link quan trọng. Không dùng accent cho toàn bộ heading.
- Success/warning/danger chỉ cho trạng thái thật, không dùng trang trí.
- Nền tối đa 2 tầng trong một vùng (canvas → surface). Không card lồng card.
- Chart: dùng token (`var(--sn-color-accent)`…), grid 1px, không gradient, không glow.

### 3.5 Brand lockup

- Mark dùng `BrandMark` (`components/layout/BrandMark.tsx`): PNG `ShopnestLogo.png` làm alpha mask, tô `--sn-color-accent`, nên mark tự sáng đúng ở dark mode.
- Wordmark `.sn-brand__name`: `--sn-color-accent`, weight 600, tracking snug. Mark và wordmark dùng cùng một màu brand.
- Wordmark là brand, không phải control: accent ở đây là brand color, không phá quy tắc accent dành cho hành động.
- Hover/focus của link brand chuyển wordmark sang `--sn-color-accent-hover`.
- Mark là decorative (`aria-hidden`); accessible name lấy từ wordmark, không lặp `alt`.
- Workspace sidebar dùng lại đúng lockup của navbar: `BrandMark` + `.sn-brand__name` accent, weight 600; role label nằm dưới wordmark với màu muted. Không dùng `<img>` logo gốc hay wordmark đen riêng.

## 4. Space & layout

- Cơ số 4px: `--sn-space-1..32`.
- Container: `--sn-container` 90rem, narrow 65rem, form 26.25rem / wide 37.5rem.
- Section rhythm: `--sn-section` clamp(40–72px), tight clamp(24–40px).
- Shell: header 56px (workspace), topbar 56px, sidebar 232px, account rail 220px, filter rail 264px. Workspace chrome inset 12px (`--sn-shell-inset`) và cách nhau 12px (`--sn-shell-gap`).
- Storefront dock: slab kính 60px + inset 10px, tổng `--sn-header-stuck` 80px. Mọi sticky offset trong storefront dùng `calc(var(--sn-header-stuck) + var(--sn-space-2))`, không dùng `--sn-header`.
- Glass: ranh giới sử dụng, token, tầng và lộ trình rollout ở mục 6.
- Breakpoint dùng trong CSS: 640 / 768 / 1024 / 1280. QA chạy 375/390/480/768/1024/1280/1440.
- Workspace: sidebar và topbar là hai slab kính nổi, inset 12px, bo `--sn-radius-2xl`, nền trang `--sn-color-canvas-deep`; `.sn-workspace__content` offset `calc(var(--sn-sidebar) + var(--sn-shell-inset))`; `.sn-workspace__main` padding 20/24; <768 sidebar off-canvas + overlay + toggle.
- Storefront: header + `main` + footer; ChatDock mount một lần trong `StorefrontLayout`.
- Account: `StorefrontLayout` + rail; không mount chat lần hai.
- Auth: split/centered, brand panel riêng.

## 5. Shape & elevation

- Radius: none 0 · xs 2px · sm 4px · md 6px · lg 8px · xl 12px · 2xl 20px · 3xl 28px · pill. Control thêm `--sn-radius-control` 12; media card thêm `--sn-radius-card` 16 và `--sn-radius-media` 10; overlay thêm `--sn-radius-menu` 16 (panel) và `--sn-radius-item` 10 (item).
- Card nội dung dùng `md/lg`; hero/panel lớn tối đa `xl` 12px. Media card dùng `--sn-radius-card` 16, ảnh bên trong `--sn-radius-media` 10. Chỉ chrome nổi được dùng `2xl` 20px (slab kính) và `3xl` 28px (sheet).
- Quy tắc shape của hệ glass: **slab 20px, menu 16px, media card 16px (ảnh 10px), stat card frosted 16px, control 12px trên nội dung và pill trên chrome, media 12px**. Không trộn radius khác trong cùng một cụm.
- Menu dùng `--sn-radius-menu` 16 cho panel và `--sn-radius-item` 10 cho từng item. Menu kính chỉ dành cho chrome nổi (`sn-dropdown--glass`), menu trong workspace giữ nền đặc.
- Overlay dùng shape riêng: dialog `--sn-radius-menu` 16, sheet `--sn-radius-3xl` 28 và nổi cách viewport 12px, tooltip `--sn-radius-item` 10. Filter rail là content panel bo `--sn-radius-xl` 12 và cuộn trong, không dùng glass.
- Shadow chỉ cho lớp nổi: `--sn-shadow-popover`, `--sn-shadow-overlay` (popover/overlay), `--sn-shadow-glass` (dock kính), `--sn-shadow-float` (control nổi trong kính), `--sn-shadow-accent` (CTA accent). Không shadow cho card tĩnh.
- Bề mặt kính: đúng một lớp blur trên slab, không blur control con; chi tiết vật liệu, fallback và tầng ở mục 6.
- Border 1px `--sn-color-border`; border mạnh cho hover/selected.
- Chip dữ liệu (giảm giá, rating compact) dùng pill 20–24px cao, padding ngang 8, hairline + `--sn-glass-control` (rating) hoặc accent-wash (giảm giá). Tối đa hai chip metadata trên một product card; tag trạng thái vẫn tối đa hai.

## 6. Glass system

Glass là vật liệu của **lớp chrome nổi**, không phải hiệu ứng trang trí cho nội dung. Mục tiêu: dock, menu, sheet và panel đọc như cùng một vật liệu; card, bảng và form vẫn đặc để đọc lâu.

### 6.1 Ranh giới dùng

| Dùng glass | Giữ bề mặt đặc |
|---|---|
| Storefront dock, sticky toolbar | Table, data grid, form, multi-step dialog |
| Dropdown/context menu ngắn | Page section, hero band, footer band |
| Sheet mobile, chat panel, command palette | Field, input, select, textarea |
| Floating filter bar, floating action, toast | Content card không phải media |
| Workspace sidebar, topbar, filter bar | Chart card, data table, form dài |

**Frosted media card**: product card và category card dùng `--sn-glass-control` + `--sn-glass-hairline` + inset highlight + `--sn-shadow-card`, **không blur**. Control nằm trên ảnh (wishlist, quick action) dùng `surface="overlay"` với `--sn-glass-menu` để giữ tương phản trên mọi ảnh.

**Frosted stat card**: Insights, AnalyticsCard và metric card của workspace dùng cùng recipe frosted (glass-control, hairline, inset highlight, `--sn-shadow-card`, radius 16), **không blur**; chỉ filter bar và shell mới dùng slab blur.

**Overlay**: dialog giữ surface đặc (form/modal dài), bo 16. Sheet là slab kính nổi inset 12px, bo 28, nền `--sn-glass-menu` + blur; shell khoá header/footer, chỉ `sn-sheet__body` cuộn. Tooltip là overlay alpha `--sn-glass-menu` + hairline + highlight, bo 10, **không blur**. Filter rail là content panel đặc, bo 12, header/footer đứng yên và body cuộn trong.

Ba luật cứng:

- Một vùng chỉ một lớp blur. Control nằm trong slab dùng `--sn-glass-field` (alpha, không blur).
- Không lồng slab trong slab. Tối đa ba tầng: `canvas-deep → glass slab → field`.
- Bề mặt chứa form dài hoặc nội dung cuộn dài dùng `--sn-color-surface`, không dùng glass.

### 6.2 Token

| Token | Vai trò | Light / dark |
|---|---|---|
| `--sn-color-canvas-deep` | Nền trang storefront và workspace, lùi một bậc để slab nổi | neutral-150 / graphite-950 |
| `--sn-glass-tint` | Nền slab chrome | trắng 0.78 / graphite 0.62 |
| `--sn-glass-control` | Nền button content (secondary/outline) | trắng 0.62 / trắng 0.06 |
| `--sn-glass-control-hover` | Hover của button content | trắng 0.9 / trắng 0.1 |
| `--sn-glass-field` | Nền control nằm trong slab | surface / trắng 0.07 |
| `--sn-glass-menu` | Nền menu, đục hơn slab | trắng 0.92 / graphite 0.88 |
| `--sn-glass-hover` / `--sn-glass-press` | Wash hover/press trên slab | ink 0.06 / 0.10 · trắng 0.07 / 0.11 |
| `--sn-glass-hairline` | Viền 1px | ink 0.10 / trắng 0.12 |
| `--sn-glass-highlight` | Inset highlight cạnh trên | trắng 0.90 / trắng 0.08 |
| `--sn-glass-ring` | Ring quanh badge/avatar nổi trên slab | trắng 0.92 / graphite 0.95 |
| `--sn-blur-glass` | Blur và saturate của slab (`scale.css`) | blur(22px) saturate(170%) |
| `--sn-shadow-glass`, `--sn-shadow-float`, `--sn-shadow-accent` | Shadow slab, control nổi, CTA accent (`semantic.css`) | theo theme |
| `--sn-shadow-card` | Shadow rest của media card (`semantic.css`) | rất mềm, nhuộm nền |
| `--sn-workspace-wash-warm` / `--sn-workspace-wash-cool` | Quầng material phía sau chrome workspace (`semantic.css`) | accent 0.07 + ink 0.035 / accent 0.06 + trắng 0.03 |
| `--sn-workspace-wash` | Tổ hợp hai radial-gradient của workspace | dùng `background` trên pseudo fixed |

Dark: kính phải sáng hơn canvas, không bao giờ tối hơn. Light: kính trắng trên giấy lạnh, không dùng trắng 100%.

**Workspace ambient wash**: chrome workspace không có ảnh cuộn phía sau như storefront dock, nên `.sn-workspace::before` giữ một lớp `position: fixed`, `z-index: -1`, nền `--sn-workspace-wash`, `pointer-events: none`. Đây là lớp material duy nhất cho glass workspace: alpha thấp, không blur filter, không animate, tắt trong `forced-colors`. Không dùng lớp này cho nội dung, card hay storefront.

### 6.3 Recipe

Recipe chuẩn của slab nằm ở `components/glass.css` dưới class `.sn-glass-surface` (workspace sidebar/topbar, filter bar). Menu kính vẫn giữ recipe cục bộ `.sn-dropdown--glass`; sheet giữ recipe cục bộ `.sn-sheet` trong `overlay.css`; dock vẫn dùng `.sn-storefront__card` cho tới Phase 9.

```css
.sn-glass-surface {
    border: 1px solid var(--sn-glass-hairline);
    border-radius: var(--sn-radius-2xl);
    background: var(--sn-glass-tint);
    box-shadow: var(--sn-shadow-glass);
    backdrop-filter: var(--sn-blur-glass);
    -webkit-backdrop-filter: var(--sn-blur-glass);
}

.sn-glass-surface--menu {
    border-radius: var(--sn-radius-menu);
    background: var(--sn-glass-menu);
    box-shadow: inset 0 1px 0 var(--sn-glass-highlight), var(--sn-shadow-overlay);
}
```

Mọi bề mặt kính phải kèm ba fallback, tất cả đặt nền đặc và tắt blur:

```css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .sn-glass-surface { background: var(--sn-color-surface); }
}

@media (prefers-reduced-transparency: reduce) {
    .sn-glass-surface {
        background: var(--sn-color-surface);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
    }
}

@media (forced-colors: active) {
    .sn-glass-surface {
        border-color: CanvasText;
        background: Canvas;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
    }
}
```

### 6.4 Tầng và tương phản

- `canvas-deep → slab → field` là tối đa; không thêm tầng kính thứ tư.
- Nav, label và menu item trên slab dùng `--sn-color-text`; không dùng `text-faint` cho nội dung cần đọc.
- Khi slab nằm trên ảnh tối, tăng tint lên 0.86 hoặc dùng `--sn-glass-menu` để giữ AA.
- Accent trên kính chỉ cho CTA, selected và focus ring.

### 6.5 Trạng thái

- Hover: `--sn-glass-hover`, không đổi blur hay shadow lớn.
- Press: `--sn-glass-press` + `scale(.96)` hoặc dịch 1px.
- Open/selected: `--sn-glass-press` + hairline, hoặc accent-wash + accent-text.
- Focus: ring 2px `--sn-color-focus` offset 2; item trong menu dùng inset -2.
- Chỉ animate màu, opacity, transform; không animate `backdrop-filter`.

### 6.6 Hiệu năng và fallback

- Một `backdrop-filter` cho mỗi vùng; không đặt trên container cuộn dài.
- Không `will-change` cho slab; không filter trên control con.
- Luôn có fallback đặc; máy yếu thì giữ tint và bỏ blur, không hy sinh tương phản.
- Kiểm tra 375px và một máy Android tầm trung trước khi nhân rộng.

### 6.7 Rollout

| Phase | Phạm vi | Trạng thái |
|---|---|---|
| 1 | Storefront dock, BrandMark, dropdown locale/account | Xong |
| 2 | Button, input, field toàn cục | Xong |
| 3 | Product card: frosted media card + quick-action pill | Xong |
| 4 | Category card, Price/Rating chip | Xong |
| 5 | Sheet, dialog, tooltip, filter rail | Xong |
| 6 | Chat dock, panel, composer | Xong |
| 7 | Footer, newsletter, legal | Tiếp theo |
| 8 | Workspace sidebar, topbar, ambient wash, filter bar, stat card frosted | Xong |
| 9 | Data table, QA sweep toàn UI | Cuối |

- Phase 2 đã hấp thụ override navbar (search pill, icon bubble, login pill) vào `button.css` và `field.css`; layout chỉ còn kích thước và trạng thái mở menu.
- Phase 6: chat dùng một slab kính cho dock (header/footer chrome), message list giữ nền đặc để đọc; composer và quick reply là field alpha, không blur.
- Phase 4: category tile dùng cùng recipe frosted với media card, ảnh 1:1 inset 8px bo `--sn-radius-media`, hover nhấc 3px + zoom 1.03, focus chỉ đổi border để ring không fade. Rating chip chỉ dùng ở ProductCard và BuyBox; Price discount chip là pill accent-wash.
- Phase 5: sheet kính nổi inset 12px bo 28, body cuộn riêng; dialog surface đặc bo 16, close 32px hit 44; tooltip overlay 10 không blur; filter rail đặc bo 12, header/footer cố định, body cuộn và clear all luôn tới được.
- Trang chủ customer đã redesign full composition: hero “storefront window”, flash sale thành band, suggestions thành rail, brand/editorial/trust bỏ card; mobile shelf 2 cột. Chi tiết ở 6.8.
- Layout chỉ được override kích thước, vị trí và radius cục bộ; không override tint, blur hay hairline của primitive.

Checklist cho mỗi component:

1. Phân loại chrome nổi hay nội dung.
2. Chọn radius theo mục 5.
3. Chỉ dùng token `--sn-glass-*`; không thêm alpha mới.
4. Đủ state: default, hover, focus-visible, active, disabled, loading, error, success (nếu có).
5. Đủ ba fallback.
6. Ảnh 375/768/1440, light/dark, zoom 200%, reduced motion.
7. Cập nhật bảng Rollout.

Definition of done cho toàn UI:

- Mọi chrome nổi dùng đúng năm dấu hiệu: tint, blur, hairline, inset highlight, shadow nhuộm màu nền.
- Không card nội dung nào có blur.
- `check:css` pass, không hex/alpha ngoài `tokens/`.
- Không còn menu hay panel nổi nào giữ radius 6 cũ.

### 6.8 Trang chủ

- Hero **storefront window**: copy 5 cột, media 7 cột gồm một ảnh dẫn 4:5 và hai ảnh 4:3 xếp chồng; caption nằm dưới ảnh với hairline, ảnh dẫn `loading="eager"` + `fetchPriority="high"`. Không eyebrow.
- Category shelf giữ 6 frosted tile, bỏ eyebrow; flash sale là band có rule accent 2px trên và hairline dưới, không card; best sellers grid 4/2; suggestions rail ngang card 16rem/13rem; brand split ảnh trái 7 cột, copy 5 cột, không card; editorial 5/3/4; trust ledger 4/2/1 cột với hairline dọc.
- Mobile: best sellers và flash sale 2 cột; rail card 13rem; trust 1 cột dưới 640.
- Home renders ngay từ Inertia props, không skeleton chặn first paint; `Home.module.css` đã xóa.

## 7. Motion

- Duration: instant 90ms · fast 150ms · base 180ms · slow 240ms · reveal 320ms.
- Easing: `--sn-ease-standard`, `--sn-ease-out`, `--sn-ease-in-out`; stagger 40ms.
- Chỉ animate `background-color`, `border-color`, `color`, `opacity`, `transform` ngắn. Không loop vô hạn trừ spinner/skeleton có mục đích.
- `base/a11y.css` tắt animation/transition khi `prefers-reduced-motion: reduce` (file duy nhất được dùng `!important`).

## 8. Icon & hình ảnh

- **Lucide** là bộ icon duy nhất; không trộn Boxicons/FontAwesome, không tự vẽ SVG icon.
- Size: xs 14 · sm 16 · md 20 · lg 24; stroke mặc định 1.75–2.
- Icon-only button phải có `aria-label`; icon trang trí `aria-hidden="true"`.
- Ảnh sản phẩm: card 1:1 (khớp asset 900×900), gallery 4:5; mỗi component giữ một tỷ lệ nhất quán, `object-fit: cover`, có `aspect-ratio` để tránh layout shift.
- Không fake screenshot bằng `<div>`, không overlay pill/tag lên ảnh.

## 9. Nội dung & giọng điệu

- Tiếng Việt là mặc định; mọi key phải có trong cả `lang/vi.json` và `lang/en.json`.
- Câu ngắn, cụ thể, hướng hành động. Không dùng “Nâng tầm”, “Liền mạch”, “Bứt phá”, “Không chỉ là… mà còn…”.
- Không em-dash/en-dash trong chuỗi hiển thị; dùng hyphen.
- Không emoji, không “01 / 02 / 03”, không số liệu bịa.
- CTA ≤ 3 từ ở desktop; một CTA chính mỗi viewport.

## 10. Trạng thái

Mỗi page có dữ liệu phải xử lý:

| Trạng thái | Cách dùng |
|---|---|
| Loading | `Skeleton`/`SkeletonText`; `Table` có skeleton rows; không spinner toàn trang. |
| Empty | `EmptyState` hoặc `empty` prop của `Table`/`DataTable`; nêu lý do + hành động nếu có. |
| Error | `ErrorState` hoặc `Alert tone="danger"`; giữ dữ liệu cũ nếu có thể. |
| Success | `ResultState` (success/pending/failure/cod) hoặc `Toast`; không thay toàn trang bằng màu xanh. |

Không hiển thị `[object Object]`, `NaN`, `undefined`; QA Dusk kiểm tra các chuỗi này.

## 11. Accessibility

- `:focus-visible` toàn cục: outline 2px `--sn-color-focus`, offset 2px.
- Skip link `.sn-skip-link` ở Storefront/Auth/Workspace → `#main-content`; `main` có `tabIndex={-1}`.
- Nav dùng `aria-current="page"`; pagination `role="navigation"`; dialog dùng Radix (focus trap + Escape).
- Icon-only button có `aria-label`; form label luôn hiển thị, error dưới field.
- Contrast spot-check AA: body 4.5:1, chữ lớn 3:1; không dùng `text-faint` cho nội dung quan trọng.
- Bàn phím: tab qua mọi control, không bẫy focus ngoài dialog.
- QA: 375–1440, light/dark, zoom 200%, reduced motion.

## 12. Anti-slop checklist

- [ ] Không gradient trang trí (trừ layered tint của glass và skeleton shimmer có mục đích).
- [ ] Không indigo/violet, không palette Tailwind mặc định.
- [ ] Không serif, không italic nhấn mạnh, không highlight vàng.
- [ ] Glass chỉ trên chrome nổi, không glass cho card nội dung, không glow, không blur lồng nhiều lớp.
- [ ] Mỗi vùng tối đa một lớp blur; control trong kính dùng `--sn-glass-field`, không blur.
- [ ] Bề mặt kính có đủ ba fallback đặc và đạt AA khi đặt trên ảnh tối.
- [ ] Không dùng glass để che hierarchy yếu; bỏ blur mà bố cục vẫn rõ thì mới đúng.
- [ ] Không card nội dung thường bo ≥16px; media card 16 và slab kính 20 là ngoại lệ, shadow lớn chỉ cho lớp nổi.
- [ ] Không badge/pill spam; không chip cho mọi nhãn.
- [ ] Không icon tự vẽ/emoji/số thứ tự trang trí.
- [ ] Không card lồng card; không card cho từng dòng bảng.
- [ ] Không kicker in hoa trên mọi heading.
- [ ] Không status dot nhấp nháy vô hạn, không spinner wobble.
- [ ] Không callout viền trái màu mè, không icon tile pastel.
- [ ] Không số liệu bịa, không copy AI.
- [ ] Không em-dash/en-dash trong chuỗi hiển thị.
- [ ] Không heading trung tâm + 3 card bằng nhau + “Tìm hiểu thêm”.

## 13. File map

```
resources/css/
├── app.css                  # layer order + import
├── fonts.css                # Be Vietnam Pro self-host
├── tokens/
│   ├── primitive.css        # palette gốc (hex duy nhất)
│   ├── semantic.css         # role token + light/dark
│   └── scale.css            # type, space, size, radius, shadow, motion, z
├── base/
│   ├── reset.css            # reset parity (thay Tailwind preflight)
│   ├── typography.css
│   ├── forms.css
│   └── a11y.css             # focus-visible, skip link, reduced motion
├── components/              # 10 file primitive toàn cục
│   ├── button.css  field.css  file-dropzone.css  glass.css  overlay.css
│   ├── feedback.css  navigation.css  data.css  status.css  typography.css
├── layouts/
│   ├── storefront.css  auth.css  account.css  workspace.css
└── utilities.css            # utility cuối cùng; không lạm dụng
```

CSS Modules nằm cạnh page/component (`*.module.css`), chỉ chứa layout/visual đặc thù; primitive dùng class `sn-*` toàn cục.

Bề mặt kính của chrome workspace nằm ở `components/glass.css` (`.sn-glass-surface`, có đủ ba fallback). Dock vẫn ở `layouts/storefront.css` và menu ở `components/overlay.css`; Phase 9 sẽ chuyển nốt hai consumer này sang primitive chung.

## 14. Quy tắc kỹ thuật

- Không Tailwind, không `@apply`, không `!important` ngoài `utilities.css`/`base/a11y.css`.
- Không hex/rgb/hsl ngoài `tokens/primitive.css`; không token primitive trong component.
- Bề mặt kính mới chỉ dùng token `--sn-glass-*`, kèm đủ ba fallback (`@supports`, `prefers-reduced-transparency`, `forced-colors`); không thêm alpha ngoài `tokens/`.
- Không đặt `backdrop-filter` trên container cuộn dài hoặc lồng trong slab khác.
- `html[data-js]` được set trong `app.blade.php` cho progressive enhancement; chỉ dùng để ẩn control hover-only (quick action), không ẩn nội dung chính.
- Class CSS Module đặt camelCase; compose bằng `cx` từ `@/lib/cx`.
- `npm run check:css` strict; `types`, `format:check`, `lint`, `build`, `build:ssr`, `php artisan test` trước khi commit.
- Dusk QA: `php artisan dusk --filter=Phase12QaTest` với `.env.dusk.local` + DB QA local.
