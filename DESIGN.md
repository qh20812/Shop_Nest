# Design System: ShopNest — Nếp

Version 1.0 · Light-first · Google Stitch ready

## 0. How Stitch should use this file

This file is the single source of truth for every ShopNest screen generated in Google Stitch.

- Use the palette, type, spacing, radii, and component rules below exactly. Do not invent a second accent, a new shadow style, or a new icon family.
- There are two visual modes: **Storefront** (public, customer-facing) and **Workspace** (seller, admin, shipper). Storefront may use the editorial serif; Workspace is sans-serif only.
- Generate **desktop 1440×1024** and **mobile 390×844** for every customer/storefront screen. Generate desktop and tablet for Workspace screens; mobile is required for the customer account, seller orders, and shipper screens.
- Put real Vietnamese copy in the screens. Never translate the provided copy to English.
- Stitch generates static screens. Motion notes below describe the intended implementation, not what Stitch should animate.
- When in doubt, choose the quieter option: more whitespace, fewer decorative elements, one clear action.

## 1. Visual Theme & Atmosphere

**Concept: Nếp** — a curated Vietnamese marketplace for the home and everyday life, reinterpreted as an editorial storefront and a precise back-office ledger. The word “nếp” means order, fold, habit: the calm system behind a warm, lived-in home.

ShopNest is **broad by category but selective by seller**. It is not a single-category craft boutique and not an unbounded “sell everything” mall. The launch catalog is organized around six anchor categories, with a “Shop Việt” trust layer and verified sellers. Editorial storytelling supports discovery; search, category tiles, price, ratings, shipping facts, and trust badges carry the utility.

The atmosphere is warm, tactile, and trustworthy. Rice-paper surfaces, ink typography, and a single lacquer-red accent recall Vietnamese lacquerware, market stamps, and hand-written price tags. The storefront is gallery-airy and asymmetric; the workspace is denser and number-led, like a well-kept ledger. Nothing glows, nothing floats without purpose, and no element overlaps another.

### Design dials

| Mode | Creativity | Density | Variance | Motion |
|---|---:|---:|---:|---:|
| Storefront / Auth | 8 | 4 | 8 | 6 |
| Customer account | 5 | 5 | 4 | 4 |
| Seller workspace | 5 | 7 | 3 | 4 |
| Admin workspace | 4 | 8 | 2 | 3 |
| Shipper workspace | 4 | 6 | 2 | 3 |

Density 4 means generous breathing room, not empty. Density 7–8 means compact tables and strong information hierarchy, not cramped cards.

### Anchor categories

1. **Điện tử & công nghệ** — laptop, PC, điện thoại, tai nghe, phụ kiện.
2. **Gia dụng & nhà bếp** — nồi chiên, nồi cơm, dụng cụ bếp, vệ sinh.
3. **Nhà cửa & trang trí** — nội thất nhỏ, đèn, chăn ga, đồ decor.
4. **Mẹ & bé** — xe đẩy, bỉm, đồ chơi, quần áo trẻ em.
5. **Thời trang & phụ kiện** — quần áo, túi, giày, phụ kiện.
6. **Làm đẹp & chăm sóc** — skincare, chăm sóc cá nhân.

Curation rules:
- Launch with these six categories. Do not add fresh groceries, vehicles, real estate, industrial B2B, or other operationally heavy categories.
- “Shop Việt” is a badge and filter, not a separate catalog. It signals local sellers and provenance without limiting the category range.
- Every category shares the same shell, card anatomy, and search/filter grammar. Category-specific metadata changes, not the visual system.
- The home page must show at least four categories in the first viewport. It must not read as a pottery or handicraft store.

## 2. Color Palette & Roles

### Core palette

| Name | Hex | Role |
|---|---|---|
| Rice Paper | `#F6F1E6` | Primary canvas, page background |
| Warm Porcelain | `#FFFCF4` | Cards, sheets, elevated surfaces |
| Raw Linen | `#EDE4D3` | Sidebar, filter rails, muted bands |
| Ink | `#1D1B17` | Primary text, headings, icons |
| Ink Muted | `#6B6458` | Body copy, secondary labels |
| Ink Faint | `#9A8F7F` | Metadata, timestamps, disabled text |
| Border | `#DCD1BE` | 1px structural lines, dividers |
| Lacquer Red | `#B23A2F` | The only UI accent: primary CTA, active state, focus ring |
| Lacquer Deep | `#8C2A22` | Accent hover and pressed state |
| Lacquer Wash | `#F2DCD5` | Soft accent background, selected navigation |
| Jade | `#2F6B57` | Success, completed, in-stock |
| Turmeric | `#8A5A1A` | Warning, pending, low-stock |
| Brick | `#8B2A24` | Danger, destructive action, rejected |
| Logo Blue | `#4991D8` | Brand illustration only. Never use as a UI accent |

### Color rules

- One accent only: Lacquer Red. Do not introduce blue, purple, pink, or gold UI accents.
- Logo Blue belongs to the existing ShopNest mark. Keep the mark in its original colors and do not build buttons or links from it.
- Status colors are functional, not decorative. Use them only for badges, inline validation, chart series, and small state dots.
- Page background is Rice Paper or Warm Porcelain. Never use pure `#FFFFFF` as the full-page background.
- No gradients on surfaces or text. No neon glows. No glassmorphism.
- Text on Lacquer Red is Warm Porcelain. Body text is Ink or Ink Muted.
- Focus ring: 2px Lacquer Red, 2px offset. Never remove the visible focus state.
- Charts use Lacquer Red as the primary series, Jade and Turmeric as secondary series, and `#E8DFD0` for grid lines.

### Dark mode appendix

Dark mode is phase 2 and is not generated in the first Stitch pass. When implemented, use the same hue family: canvas `#171512`, surface `#211D19`, raised surface `#2A251F`, ink `#F5EFE3`, muted `#B8AE9E`, border `#3A342C`, accent `#D46A5A`, accent wash `#3B2521`, jade `#7FB8A2`, turmeric `#D6A653`, brick `#D07A72`.

## 3. Typography Rules

### Families

- **Display: Fraunces** — variable serif, optical sizing on, weights 500–700. Use only on Storefront hero/campaign modules, Auth, and Legal pages. Search, category, product detail, cart, checkout, and account pages use Be Vietnam Pro headings so the catalog stays scannable. Fraunces supports Vietnamese; keep diacritics intact.
- **Body and UI: Be Vietnam Pro** — weights 400, 500, 600, 700. Use for all body copy, labels, navigation, forms, and Workspace headings.
- **Numbers and metadata: JetBrains Mono** — weights 500, 600. Use for prices, SKUs, order codes, IDs, timestamps, table numbers, and KPI values. Currency symbols may fall back to Be Vietnam Pro.

### Scale

| Token | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| Display XL | `clamp(3.5rem, 7vw, 6.5rem)` | 0.92 | -0.035em | Storefront hero only |
| Display LG | `clamp(2.5rem, 4.5vw, 4.25rem)` | 0.98 | -0.03em | Section hero, auth headline |
| H1 | `clamp(2rem, 3vw, 2.75rem)` | 1.05 | -0.025em | Page title, storefront |
| H2 | `clamp(1.5rem, 2vw, 2rem)` | 1.15 | -0.02em | Section title |
| H3 | `1.125rem` | 1.3 | -0.01em | Card title, panel title |
| Body | `1rem` | 1.65 | 0 | Default copy |
| Body large | `1.125rem` | 1.6 | 0 | Intro paragraphs |
| Small | `0.875rem` | 1.5 | 0 | Helper text, metadata |
| Micro | `0.75rem` | 1.4 | 0.12em uppercase | Eyebrows, table headers |

### Typography rules

- Body copy max width: `65ch`. Never stretch a paragraph across a full 1440px canvas.
- Storefront hero and campaign headings use Fraunces with tight tracking and weight-driven hierarchy. Search, category, product, cart, checkout, and account headings use Be Vietnam Pro 600/700. Do not use oversized type just to fill space.
- Workspace headings use Be Vietnam Pro 600/700. **Serif is banned in all dashboards and software UIs.**
- Prices and numeric columns use JetBrains Mono with tabular figures. Align numbers to the right in tables.
- Uppercase micro labels always use Be Vietnam Pro 600 with `0.12em` tracking. Do not use uppercase for long sentences.
- Vietnamese diacritics must render correctly. Never use a font that drops or flattens diacritics.
- No gradient text, no outlined display text, no letter-spacing on body copy.

## 4. Component Stylings

### Buttons

- Primary: Lacquer Red fill, Warm Porcelain text, 12px radius, height 44px (mobile) / 48px (desktop), horizontal padding 20px/24px. Hover darkens to Lacquer Deep; active state translateY(1px) or scale(0.98). No outer glow.
- Secondary: transparent fill, 1px Border, Ink text. Hover fills Lacquer Wash.
- Tertiary: text-only with a 1px Lacquer Red underline offset 4px. Use for low-priority actions.
- Destructive: Brick fill or Brick outline; never pair with Lacquer Red in the same action group.
- One primary CTA per viewport. Secondary actions must be visually quieter.

### Product cards

- Image 4:5, 20px radius, Warm Porcelain frame, no heavy shadow.
- Content: product name (2 lines max), shop name (micro), price (JetBrains Mono), rating (small), optional badge.
- Category-specific metadata: tech shows chip/SKU/warranty; home appliances show capacity/wattage; kids shows age/safety; fashion shows size/color; beauty shows skin type/volume. Keep metadata to one line plus one badge.
- No card drop shadow at rest. Use a 1px Border and a border-top metadata row. Hover: image scale 1.02, name underline in Lacquer Red, 180ms ease-out.
- Product grids may be 4-up on desktop; this is commerce inventory, not a three-equal-card feature row.

### Surfaces and cards

- Storefront surfaces: 24–28px radius, Warm Porcelain fill, 1px Border, warm diffused shadow only when elevation communicates hierarchy.
- Shadow: `0 20px 50px -30px rgba(60, 42, 24, 0.35)`.
- Workspace surfaces: 12–14px radius, Warm Porcelain fill, 1px Border. Prefer border-top dividers and negative space over a card around every block.
- Never nest cards inside cards. Never use card soup to separate every table row.

### Inputs and forms

- Label above input, 12px gap; helper text below; error text below in Brick.
- Height 48px desktop / 44px mobile; 12px radius; 1px Border; Warm Porcelain fill.
- Focus: 2px Lacquer Red ring with 2px offset. Error: Brick border plus inline message.
- No floating labels. No placeholder-only fields. No hidden required markers.
- Selects and comboboxes use the same height, radius, and focus ring.
- File uploads show a dashed Border drop zone, file name, size, and a clear remove action.

### Tables

- Workspace tables are ledger-like: micro uppercase header, 56px rows, 1px Border dividers, hover Raw Linen.
- Numbers right-aligned and monospaced. Status chips sit in their own column. Actions are icon buttons with accessible labels.
- Sticky header on long tables. Pagination is a simple row count plus previous/next, not a wall of page numbers.
- Mobile tables collapse into stacked records with the primary value first and secondary metadata below.

### Navigation

- Storefront: sticky top bar, Warm Porcelain or Rice Paper, 1px Border bottom, logo left, search centered, account/cart right. No hamburger on desktop.
- Workspace: 240px Raw Linen sidebar, 64px top bar. Active item: 3px Lacquer Red left bar plus Lacquer Wash fill. Role badge visible but neutral.
- Icons: Lucide only, 1.75px stroke, 20px/24px. Do not mix Boxicons, FontAwesome, or Material Symbols in the UI.
- Mobile navigation: full-width drawer or sheet, 44px targets, clear close action.

### Badges and status

- Pill shape, 12px text, 8px/12px padding. Tinted background plus dark text. Never use a saturated fill for a badge.
- Examples: Pending = Turmeric wash, Completed = Jade wash, Rejected = Brick wash, Draft = Ink Faint wash.

### Modals, sheets, toasts

- Modal: 24px radius, Warm Porcelain, overlay `rgba(29, 27, 23, 0.48)`, width 480px/640px, focus trapped, one primary action.
- Bottom sheet on mobile: 24px top radius, drag handle, 44px actions.
- Toast: bottom-right desktop, bottom-center mobile, 16px radius, 3px left border in status color, no glow.
- Confirmation dialogs state the consequence in one sentence and name the destructive action.

### Loading, empty, error

- Skeleton shimmer matching exact layout dimensions and radii. No circular spinners.
- Empty states are composed: a simple line illustration or product still-life, one sentence, one action. Never just “No data”.
- Error states are inline and specific: what failed, what to do next, and a retry action.

### Charts

- Minimal axes, 1px grid `#E8DFD0`, no drop shadows, no gradients.
- Primary series Lacquer Red; secondary Jade/Turmeric; labels in Be Vietnam Pro; values in JetBrains Mono.
- Tooltips use Warm Porcelain, 12px radius, 1px Border. No dark tooltip panels.

### Chat and chatbot

- Conversation list in Raw Linen; active conversation in Warm Porcelain with a Lacquer Red left bar.
- Message bubbles: Ink text on Warm Porcelain for received, Lacquer Red fill for sent. No tails, no glow.
- Chatbot panel uses the same language as the rest of the product: helpful, short, no anthropomorphic mascot.

## 5. Hero Section

The hero exists only on the Storefront home. It must feel editorial, warm, and specific to Vietnamese homes.

- Asymmetric split: text 7 columns, visual 5 columns on desktop. Left-aligned; never centered.
- Headline uses Fraunces with **inline image typography**: small, contextual images sit between words at type height, rounded 16px, with clean spacing. Images never overlap text.
- Example headline: “Chọn [ảnh laptop] đồ thật kỹ, [ảnh bàn ăn] sống thật êm.”
- Eyebrow: “Mọi thứ cho tổ ấm Việt” in micro uppercase.
- Subcopy: one or two lines, max 46ch, Ink Muted. Example: “Đồ điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm đẹp từ các shop Việt đã kiểm duyệt.”
- One primary CTA only: “Xem chợ hôm nay”.
- Visual side: a 2-row asymmetric bento of category-spanning product still-life images — laptop, nồi chiên, xe đẩy, áo thun — each in its own grid cell. No absolute-positioned cards on top of images.
- No “Scroll to explore”, no scroll arrows, no bouncing chevrons, no secondary “Learn more”.
- Mobile: inline images stack below the headline; text remains left-aligned; one full-width CTA.

## 6. Layout Principles

### Storefront grid

- Max width `1440px`, centered, horizontal padding 16px mobile / 32px tablet / 48px desktop.
- 12-column CSS Grid. Hero `7/5`, product detail `7/5`, checkout `7/5`. Use asymmetric whitespace, not decorative offsets.
- Section rhythm: `clamp(3rem, 8vw, 6rem)` vertical gap. Do not stack every section with the same padding.
- Search-first: the top-bar search is the primary discovery surface; category tiles are the second. Do not replace search with a decorative hero.
- Category tiles: Điện tử & công nghệ, Gia dụng & nhà bếp, Nhà cửa & trang trí, Mẹ & bé, Thời trang & phụ kiện, Làm đẹp & chăm sóc. Six tiles on desktop, horizontal scroll on mobile.
- Voucher and free-shipping strip: a compact utility band below the hero, not a carousel and not a card per voucher.
- Flash sale: 2-column zig-zag or a single horizontal shelf; never a 3-equal-card feature row.
- Trust strip: 4 inline facts separated by 1px dividers, not four floating cards. Include “Shop Việt”, “Shop đã kiểm duyệt”, “Đổi trả 7 ngày”, “Giao toàn quốc”.
- Footer: 4-column information architecture with a Rice Paper ground and a single accent rule.

### Workspace grid

- Sidebar 240px fixed; content 12-column grid; top bar 64px; content padding 24px mobile / 32px desktop; max content width 1440px.
- KPI strip may use 4 equal data cards because it is data, not a marketing feature row. Below the KPI strip, prefer tables and dividers.
- Use border-top dividers to separate sections. Avoid wrapping each table or filter group in a card.
- Filter rails: 280px on desktop, bottom sheet on mobile.

### Responsive rules

- Breakpoints: 375, 390, 768, 1024, 1440.
- Below 768px: single column, full-width controls, 1rem page padding, 1.5rem gaps. No horizontal overflow.
- Body text never smaller than 14px. Headlines scale with `clamp()`.
- All interactive targets at least 44×44px. Full-width primary buttons on mobile.
- Use `min-h-[100dvh]` for full-height sections, never `h-screen`.
- No element may overlap another. No absolute-positioned content stacking.

## 7. Motion & Interaction

- Spring physics: `stiffness: 100`, `damping: 20`. No linear easing for interactive elements.
- Hover: 150–180ms; press: 90ms; page/section reveal: 240–320ms.
- Lists and grids mount with a 40ms stagger: `animation-delay: calc(var(--index) * 40ms)`.
- Perpetual micro-loops: status dot pulse, skeleton shimmer, live-order indicator. Keep them subtle and isolated.
- Animate only `transform` and `opacity`. Never animate `top`, `left`, `width`, or `height`.
- Respect `prefers-reduced-motion: reduce`; disable loops and long reveals.
- No custom cursors, no parallax, no scroll-jacking.

## 8. Content & Tone

### Language and tone

- Vietnamese-first. Use “Bạn” for customers. Workspace copy is neutral and concise.
- Short sentences. Concrete nouns. No exclamation marks in transactional UI.
- Avoid AI clichés: “Elevate”, “Seamless”, “Unleash”, “Next-Gen”, “Revolutionize”, “Discover more below”.
- No emojis anywhere in UI copy, alt text, or filenames.

### Formatting

- Prices: `1.290.000 ₫`, `349.000 ₫`, `89.000 ₫`. Use dot separators for thousands and the đồng symbol.
- Dates: `12/11/2026`. Times: 24-hour, `14:30`.
- Order codes: `#SN-24817`, `#SN-24831`, `#SN-24904`.
- Percentages and metrics: organic values such as `47,2%`, `+128`, `3,8/5`. Avoid `99.99%`, `50%`, `1234567`.
- Phone numbers: `+84 28 3847 1926` or `0393 769 711`.

### Sample content

Products across the six anchor categories:

- “Laptop ASUS Vivobook 14” — `14.990.000 ₫`
- “Tai nghe Sony WH-CH720N” — `2.490.000 ₫`
- “Nồi chiên không dầu 5L” — `1.890.000 ₫`
- “Xe đẩy em bé gấp gọn” — `3.290.000 ₫`
- “Bỉm quần size L” — `289.000 ₫`
- “Áo thun cotton compact” — `199.000 ₫`
- “Serum vitamin C 15%” — `349.000 ₫`

Shops:

- “TechNest” — Điện tử & công nghệ
- “Bếp Nhà Mình” — Gia dụng & nhà bếp
- “Nhà Cửa Xinh” — Nhà cửa & trang trí
- “Mẹ & Bé An Nhiên” — Mẹ & bé
- “The Local Wardrobe” — Thời trang & phụ kiện
- “Lá Beauty” — Làm đẹp & chăm sóc

People:

- “Nguyễn Thu Hà”
- “Trần Minh Quân”
- “Lê Ngọc Anh”
- “Phạm Đức Huy”

Category-specific card metadata:

- **Điện tử:** `i5 · 16GB · 512GB`, “Bảo hành 24 tháng”, trade-in or installment note.
- **Gia dụng:** `5L · 1200W`, “Bảo hành 12 tháng”, energy or capacity note.
- **Nhà cửa:** dimensions, material, “Lắp đặt tại nhà” where relevant.
- **Mẹ & bé:** age range, safety standard, “Chính hãng” badge.
- **Thời trang:** size range, color swatches, “Đổi size 7 ngày”.
- **Làm đẹp:** skin type, volume, “Chính hãng” badge, ingredient note.

Trust copy:

- “Shop Việt” — local seller badge
- “Shop đã kiểm duyệt”
- “Đổi trả 7 ngày”
- “Giao toàn quốc”
- “Thanh toán khi nhận hàng”

Empty-state examples:

- Cart: “Giỏ đang trống. Chọn một món cho tổ ấm nhé.”
- Orders: “Chưa có đơn nào. Món đầu tiên đang chờ bạn.”
- Search: “Không tìm thấy món phù hợp. Thử một từ khoá khác.”
- Error: “Không tải được dữ liệu. Thử lại sau ít phút.”

CTA examples:

- “Xem chợ hôm nay”
- “Thêm vào giỏ”
- “Mua ngay”
- “Thanh toán”
- “Lưu thay đổi”
- “Gửi yêu cầu”

## 9. Role Modes

| Mode | Typography | Density | Navigation | Notes |
|---|---|---|---|---|
| Storefront | Fraunces (hero/campaign) + Be Vietnam Pro | Airy | Top bar | Multi-category marketplace; editorial hero, search-first shelves |
| Auth | Fraunces + Be Vietnam Pro | Airy | Minimal top bar | Split screen, no centered card |
| Customer account | Be Vietnam Pro only | Balanced | Top bar + account tabs | Sans-only; no serif in account panels |
| Seller workspace | Be Vietnam Pro + JetBrains Mono | Dense | 240px sidebar | Orders, products, promotions, wallet |
| Admin workspace | Be Vietnam Pro + JetBrains Mono | Denser | 240px sidebar | Tables, filters, moderation |
| Shipper workspace | Be Vietnam Pro + JetBrains Mono | Balanced | 240px sidebar | Deliveries, status, route facts |

Role identity comes from labels, navigation, and content, not from different accent colors. Do not give each role its own primary color.

## 10. Anti-Patterns (Banned)

- No emojis anywhere.
- No `Inter`, `Poppins`, `Montserrat`, generic system serif, Times New Roman, Georgia, Garamond, or Palatino.
- No pure black `#000000`; use Ink `#1D1B17`.
- No purple, violet, neon blue, or magenta UI accents.
- No gradient text, gradient buttons, neon outer glows, or glassmorphism.
- No centered hero layouts. No hero text overlapping images.
- No three equal feature cards in a row.
- No card soup dashboards; use tables, border-top dividers, and negative space.
- No single-category boutique framing. The home must read as a multi-category marketplace, not a pottery or handicraft shop.
- No rainbow category colors or one accent per category. Categories share the same warm neutral system; differentiate with typography, imagery, and labels.
- No unbounded marketplace clutter: no fake urgency marquees, no wall of vouchers, no every-category-at-once mega menu above the fold.
- No mixed icon families. Lucide only for UI.
- No generic names such as “John Doe”, “Acme”, “Nexus”, “SmartFlow”.
- No fake round metrics such as `99.99%`, `50%`, `1234567`.
- No AI copy clichés: “Elevate”, “Seamless”, “Unleash”, “Next-Gen”.
- No filler UI text: “Scroll to explore”, “Swipe down”, scroll arrows, bouncing chevrons.
- No broken Unsplash links; use the image seeds in section 11.
- No custom mouse cursors, parallax, scroll-jacking, or excessive z-index.
- No `h-screen`; use `min-h-[100dvh]`.
- No circular loading spinners; use skeletal shimmer.
- No full-page pure white; use Rice Paper or Warm Porcelain.

## 11. Stitch Notes and References

### Files and assets

- Existing logo: `public/image/ShopnestLogoSVG.svg`. Use it as a small full-color mark on a Rice Paper or Warm Porcelain chip. Do not redraw or recolor it.
- UI icons: Lucide, 1.75px stroke, 20px/24px.
- Fonts via Google Fonts:
  - Fraunces: `opsz,wght@9..144,500..700`
  - Be Vietnam Pro: `wght@400;500;600;700`
  - JetBrains Mono: `wght@500;600`
- Image seeds for placeholders:
  - `https://picsum.photos/seed/shopnest-laptop/800/1000`
  - `https://picsum.photos/seed/shopnest-audio/800/1000`
  - `https://picsum.photos/seed/shopnest-airfryer/800/1000`
  - `https://picsum.photos/seed/shopnest-stroller/800/1000`
  - `https://picsum.photos/seed/shopnest-fashion/800/1000`
  - `https://picsum.photos/seed/shopnest-beauty/800/1000`
  - `https://picsum.photos/seed/shopnest-home/1200/800`
  - `https://picsum.photos/seed/shopnest-market/1200/800`

### Stitch generation rules

- Generate one screen at a time. Use the screen briefs in `PROMPT.md`.
- Always request desktop and mobile variants for Storefront, Auth, Customer account, and Shipper screens.
- For Workspace screens, request desktop first, then tablet `1024×768`; add mobile for Seller orders and Admin orders.
- Use real Vietnamese copy from `PROMPT.md`. Do not replace it with English placeholder text.
- Keep the visual hierarchy: one primary action, one accent, one icon family.
- The home page must show at least four anchor categories in the first viewport. Do not turn it into a single-category boutique.
- Show “Shop Việt” or “Shop đã kiểm duyệt” where the brief includes it; do not invent trust badges.
- Do not add features, tabs, metrics, or navigation that are not in the screen brief.
- If Stitch cannot use a font, keep the same proportions and weight hierarchy; do not substitute a generic system font.

### Handoff

After Stitch generates a screen, name it `SN-<screen-id>-<viewport>` and export it. The implementation phase will map each screen to its route and existing Inertia page. Missing pages found during the audit, such as `Admin/Inventory/Report`, `Admin/Returns/Show`, `Seller/Wallet/*`, and `auth/confirm-password`, are expected to be created during implementation, not inside Stitch.
