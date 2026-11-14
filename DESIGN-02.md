---
name: Nếp
colors:
  surface: '#fef9ee'
  surface-dim: '#dedacf'
  surface-bright: '#fef9ee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3e8'
  surface-container: '#f2ede2'
  surface-container-high: '#ede8dd'
  surface-container-highest: '#e7e2d7'
  on-surface: '#1d1c15'
  on-surface-variant: '#58413e'
  inverse-surface: '#323029'
  inverse-on-surface: '#f5f0e5'
  outline: '#8c716d'
  outline-variant: '#dfbfbb'
  surface-tint: '#aa342a'
  primary: '#91221a'
  on-primary: '#ffffff'
  primary-container: '#b23a2f'
  on-primary-container: '#ffd9d3'
  inverse-primary: '#ffb4aa'
  secondary: '#615e59'
  on-secondary: '#ffffff'
  secondary-container: '#e8e2db'
  on-secondary-container: '#67645f'
  tertiary: '#514b3f'
  on-tertiary: '#ffffff'
  tertiary-container: '#696356'
  on-tertiary-container: '#e9e0cf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#891c16'
  secondary-fixed: '#e8e2db'
  secondary-fixed-dim: '#cbc6bf'
  on-secondary-fixed: '#1d1b17'
  on-secondary-fixed-variant: '#494641'
  tertiary-fixed: '#eae2d1'
  tertiary-fixed-dim: '#cec6b5'
  on-tertiary-fixed: '#1f1b11'
  on-tertiary-fixed-variant: '#4b463a'
  background: '#fef9ee'
  on-background: '#1d1c15'
  surface-variant: '#e7e2d7'
  rice-paper: '#F6F1E6'
  warm-porcelain: '#FFFCF4'
  raw-linen: '#EDE4D3'
  ink: '#1D1B17'
  ink-muted: '#6B6458'
  ink-faint: '#9A8F7F'
  border: '#DCD1BE'
  lacquer-red: '#B23A2F'
  lacquer-deep: '#8C2A22'
  lacquer-wash: '#F2DCD5'
  jade: '#2F6B57'
  turmeric: '#8A5A1A'
  brick: '#8B2A24'
  logo-blue: '#4991D8'
typography:
  display-xl:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 60px
    letterSpacing: -0.035em
  display-xl-mobile:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.025em
  headline-1:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-2:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-3:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 21px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-micro:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.12em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

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

**Concept: Nếp** — a Vietnamese market reinterpreted as an editorial storefront and a precise back-office ledger. The word “nếp” means order, fold, habit: the calm system behind a warm, lived-in home.

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

## 3. Typography Rules

### Families

- **Display: Fraunces** — variable serif, optical sizing on, weights 500–700. Use only on Storefront, Auth, and Legal pages. Fraunces supports Vietnamese; keep diacritics intact.
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
- No card drop shadow at rest. Use a 1px Border and a border-top metadata row. Hover: image scale 1.02, name underline in Lacquer Red, 180ms ease-out.
- Product grids may be 4-up on desktop; this is commerce inventory, not a three-equal-card feature row.
