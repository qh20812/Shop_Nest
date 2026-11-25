# ShopNest — Design System: Bảng Hiệu

> Hướng thiết kế: **Bảng Hiệu** — signage / industrial catalog Việt Nam.
> Nền tảng: CSS thuần, token `--sn-*`, CSS Modules, React 19 + Inertia 3.
> Nguồn chuẩn kỹ thuật: `resources/css/`, `resources/js/components/ui/`, `REFACTOR_PLAN.md`.
> QA gần nhất: `docs/ui/PHASE-12-QA.md`.

## 1. Định vị

Bảng Hiệu lấy cảm hứng từ biển hiệu cửa hàng, catalogue in và tem nhãn công nghiệp: chữ đậm, đường kẻ rõ, màu cam đất làm tín hiệu, nền giấy lạnh ở light mode và nền than ở dark mode. Giao diện phải đọc nhanh, không trang trí thừa, không giả lập dashboard SaaS.

Ba nguyên tắc:

1. **Tín hiệu, không trang trí.** Accent chỉ dùng cho hành động chính, trạng thái đang chọn và liên kết quan trọng.
2. **Cấu trúc bằng đường kẻ, khoảng trắng và một lớp kính.** Glass chỉ dành cho chrome nổi (navbar, dock, sheet, popover) qua token `--sn-glass-*`; không gradient trang trí, không glow, không icon tile pastel, không card lồng card.
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
| Glass chrome | `--sn-color-canvas-deep`, `--sn-glass-tint`, `--sn-glass-field`, `--sn-glass-menu`, `--sn-glass-hover`, `--sn-glass-press`, `--sn-glass-hairline`, `--sn-glass-highlight`, `--sn-glass-ring`, `--sn-shadow-glass`, `--sn-shadow-float`, `--sn-shadow-accent` |

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
- Wordmark `.sn-brand__name`: ink, weight 600, tracking snug. Không tô accent ở trạng thái nghỉ, để accent vẫn là tín hiệu hành động.
- Hover/focus của link brand mới chuyển wordmark sang `--sn-color-accent-text`.
- Mark là decorative (`aria-hidden`); accessible name lấy từ wordmark, không lặp `alt`.

## 4. Space & layout

- Cơ số 4px: `--sn-space-1..32`.
- Container: `--sn-container` 90rem, narrow 65rem, form 26.25rem / wide 37.5rem.
- Section rhythm: `--sn-section` clamp(40–72px), tight clamp(24–40px).
- Shell: header 56px (workspace), topbar 56px, sidebar 232px, account rail 220px, filter rail 264px.
- Storefront dock: slab kính 60px + inset 10px, tổng `--sn-header-stuck` 80px. Mọi sticky offset trong storefront dùng `calc(var(--sn-header-stuck) + var(--sn-space-2))`, không dùng `--sn-header`.
- Breakpoint dùng trong CSS: 640 / 768 / 1024 / 1280. QA chạy 375/390/480/768/1024/1280/1440.
- Workspace: `.sn-workspace__content` offset sidebar; `.sn-workspace__main` padding 36/24; <768 sidebar off-canvas + overlay + toggle.
- Storefront: header + `main` + footer; ChatDock mount một lần trong `StorefrontLayout`.
- Account: `StorefrontLayout` + rail; không mount chat lần hai.
- Auth: split/centered, brand panel riêng.

## 5. Shape & elevation

- Radius: none 0 · xs 2px · sm 4px · md 6px · lg 8px · xl 12px · 2xl 20px · 3xl 28px · pill.
- Card nội dung dùng `md/lg`; hero/panel lớn tối đa `xl` 12px. Chỉ chrome nổi được dùng `2xl` 20px (slab kính) và `3xl` 28px (sheet).
- Quy tắc shape của hệ glass: **slab 20px, menu 16px, control pill, media 12px**. Không trộn radius khác trong cùng một cụm.
- Menu dùng `--sn-radius-menu` 16 cho panel và `--sn-radius-item` 10 cho từng item. Menu kính chỉ dành cho chrome nổi (`sn-dropdown--glass`), menu trong workspace giữ nền đặc.
- Shadow chỉ cho lớp nổi: `--sn-shadow-popover`, `--sn-shadow-overlay` (popover/overlay), `--sn-shadow-glass` (dock kính), `--sn-shadow-float` (control nổi trong kính), `--sn-shadow-accent` (CTA accent). Không shadow cho card tĩnh.
- Glass: một lớp `backdrop-filter: var(--sn-blur-glass)` trên đúng phần tử slab, không blur cho control con; luôn có hairline + inset highlight + fallback đặc (`@supports`, `prefers-reduced-transparency`, `forced-colors`).
- Border 1px `--sn-color-border`; border mạnh cho hover/selected.

## 6. Motion

- Duration: instant 90ms · fast 150ms · base 180ms · slow 240ms · reveal 320ms.
- Easing: `--sn-ease-standard`, `--sn-ease-out`, `--sn-ease-in-out`; stagger 40ms.
- Chỉ animate `background-color`, `border-color`, `color`, `opacity`, `transform` ngắn. Không loop vô hạn trừ spinner/skeleton có mục đích.
- `base/a11y.css` tắt animation/transition khi `prefers-reduced-motion: reduce` (file duy nhất được dùng `!important`).

## 7. Icon & hình ảnh

- **Lucide** là bộ icon duy nhất; không trộn Boxicons/FontAwesome, không tự vẽ SVG icon.
- Size: xs 14 · sm 16 · md 20 · lg 24; stroke mặc định 1.75–2.
- Icon-only button phải có `aria-label`; icon trang trí `aria-hidden="true"`.
- Ảnh sản phẩm: tỷ lệ nhất quán (1:1 hoặc 4:3), `object-fit: cover`, có `width/height` hoặc `aspect-ratio` để tránh layout shift.
- Không fake screenshot bằng `<div>`, không overlay pill/tag lên ảnh.

## 8. Nội dung & giọng điệu

- Tiếng Việt là mặc định; mọi key phải có trong cả `lang/vi.json` và `lang/en.json`.
- Câu ngắn, cụ thể, hướng hành động. Không dùng “Nâng tầm”, “Liền mạch”, “Bứt phá”, “Không chỉ là… mà còn…”.
- Không em-dash/en-dash trong chuỗi hiển thị; dùng hyphen.
- Không emoji, không “01 / 02 / 03”, không số liệu bịa.
- CTA ≤ 3 từ ở desktop; một CTA chính mỗi viewport.

## 9. Trạng thái

Mỗi page có dữ liệu phải xử lý:

| Trạng thái | Cách dùng |
|---|---|
| Loading | `Skeleton`/`SkeletonText`; `Table` có skeleton rows; không spinner toàn trang. |
| Empty | `EmptyState` hoặc `empty` prop của `Table`/`DataTable`; nêu lý do + hành động nếu có. |
| Error | `ErrorState` hoặc `Alert tone="danger"`; giữ dữ liệu cũ nếu có thể. |
| Success | `ResultState` (success/pending/failure/cod) hoặc `Toast`; không thay toàn trang bằng màu xanh. |

Không hiển thị `[object Object]`, `NaN`, `undefined`; QA Dusk kiểm tra các chuỗi này.

## 10. Accessibility

- `:focus-visible` toàn cục: outline 2px `--sn-color-focus`, offset 2px.
- Skip link `.sn-skip-link` ở Storefront/Auth/Workspace → `#main-content`; `main` có `tabIndex={-1}`.
- Nav dùng `aria-current="page"`; pagination `role="navigation"`; dialog dùng Radix (focus trap + Escape).
- Icon-only button có `aria-label`; form label luôn hiển thị, error dưới field.
- Contrast spot-check AA: body 4.5:1, chữ lớn 3:1; không dùng `text-faint` cho nội dung quan trọng.
- Bàn phím: tab qua mọi control, không bẫy focus ngoài dialog.
- QA: 375–1440, light/dark, zoom 200%, reduced motion.

## 11. Anti-slop checklist

- [ ] Không gradient trang trí (trừ layered tint của glass và skeleton shimmer có mục đích).
- [ ] Không indigo/violet, không palette Tailwind mặc định.
- [ ] Không serif, không italic nhấn mạnh, không highlight vàng.
- [ ] Glass chỉ trên chrome nổi, không glass cho card nội dung, không glow, không blur lồng nhiều lớp.
- [ ] Không card nội dung bo ≥16px; slab kính 20px là ngoại lệ duy nhất, shadow lớn chỉ cho lớp nổi.
- [ ] Không badge/pill spam; không chip cho mọi nhãn.
- [ ] Không icon tự vẽ/emoji/số thứ tự trang trí.
- [ ] Không card lồng card; không card cho từng dòng bảng.
- [ ] Không kicker in hoa trên mọi heading.
- [ ] Không status dot nhấp nháy vô hạn, không spinner wobble.
- [ ] Không callout viền trái màu mè, không icon tile pastel.
- [ ] Không số liệu bịa, không copy AI.
- [ ] Không em-dash/en-dash trong chuỗi hiển thị.
- [ ] Không heading trung tâm + 3 card bằng nhau + “Tìm hiểu thêm”.

## 12. File map

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
├── components/              # 9 file primitive toàn cục
│   ├── button.css  field.css  file-dropzone.css  overlay.css
│   ├── feedback.css  navigation.css  data.css  status.css  typography.css
├── layouts/
│   ├── storefront.css  auth.css  account.css  workspace.css
└── utilities.css            # utility cuối cùng; không lạm dụng
```

CSS Modules nằm cạnh page/component (`*.module.css`), chỉ chứa layout/visual đặc thù; primitive dùng class `sn-*` toàn cục.

## 13. Quy tắc kỹ thuật

- Không Tailwind, không `@apply`, không `!important` ngoài `utilities.css`/`base/a11y.css`.
- Không hex/rgb/hsl ngoài `tokens/primitive.css`; không token primitive trong component.
- Class CSS Module đặt camelCase; compose bằng `cx` từ `@/lib/cx`.
- `npm run check:css` strict; `types`, `format:check`, `lint`, `build`, `build:ssr`, `php artisan test` trước khi commit.
- Dusk QA: `php artisan dusk --filter=Phase12QaTest` với `.env.dusk.local` + DB QA local.
