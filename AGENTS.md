# AGENTS.md

ShopNest is a Laravel 13 + Inertia 3 + React 19 marketplace with four roles (admin, seller, customer, shipper). `README.md`, `DESIGN*.md`, `COMPONENTS.md`, `PLAN.md`, `PROMPT.md` and `STITCH-DESIGN.md` describe the old/aspirational "Nếp" UI and features that do not exist; trust `composer.json`, `package.json`, `routes/`, `bootstrap/app.php`, and `REFACTOR_PLAN.md`.

## Run & verify

- `composer run dev` = `php -S 127.0.0.1:9999` + `queue:listen` + Vite. `npm run dev` is Vite only. Reverb (`php artisan reverb:start`, port 8080) is separate, so queues/broadcasts idle without it (`SESSION_DRIVER=database`, `QUEUE_CONNECTION=database`, `BROADCAST_CONNECTION=reverb`).
- `npm run build` runs the Wayfinder Vite plugin, which shells out to `php artisan wayfinder:generate`; PHP must be on PATH. Generated `resources/js/{actions,routes,wayfinder}` are gitignored — never edit them.
- SSR: `config/inertia.php` has `ssr.enabled = true`, but `npm run dev`/`npm run build` do not build `resources/js/ssr.tsx`. Use `composer run dev:ssr` (`build:ssr` + `inertia:start-ssr`) or Inertia silently falls back to client rendering.
- Tests: `php artisan test` (or `composer test`, which clears config first). Single test: `php artisan test tests/Feature/Seller/ProductControllerTest.php --filter=test_name`. Dusk is separate: `php artisan dusk` (`tests/Browser`, not in `phpunit.xml`).
- PHP 8.5 locally prints a `PDO::MYSQL_ATTR_SSL_CA` DEPRECATION on every test run; noise, not a failure. CI uses PHP 8.4.
- Formatting/lint: `vendor/bin/pint`; `npm run format` (Prettier **write**, `resources/` only); `npm run format:check`; `npm run types` (`tsc --noEmit`); `npm run lint` (ESLint **with `--fix`**, not a check). CI runs pint/format/lint only, not `types` or `check:css` — run those locally.
- CI (`.github/workflows/`) only fires for `develop`/`main`; pushes to `refactor/ui-web` skip it.
- Docker: `docker compose up --build -d` serves `localhost:8080` (PHP 8.3-fpm + nginx) with MySQL on `localhost:3307`, but passes the repo `.env` via `env_file`, so it still uses the remote Aiven DB unless you override `DB_*`.

## UI work (branch `refactor/ui-web`)

- `REFACTOR_PLAN.md` owns status/scope: Phases 0–11 are complete (storefront, auth, customer/settings/chat, seller, admin, shipper, email + error pages, Tailwind cleanup); Phase 12 QA is next. Read it before restyling. `docs/ui/BASELINE.md` is a historical pre-refactor snapshot; `DESIGN.md`/`COMPONENTS.md` still document the abandoned Nếp system and are rewritten in Phase 12.
- Tailwind, `Page.css`, `legacy-tokens.css`, `tokens.css`, `base.css` and Boxicons are gone. UI uses `--sn-*` tokens, `sn-*` classes and CSS Modules (`*.module.css`, composed with `cx` from `@/lib/cx`). Do not add a new utility framework; keep element rules in `base/*` and component visuals in `components/*`.
- `npm run check:css` (alias `check:tokens`) is now **strict**: **289 files checked, 0 allowlisted**, `scripts/token-allowlist.json` deleted. It fails on Tailwind utilities/arbitrary values, raw hex/rgba/hsl in TSX or `resources/css/{components,layouts}` + `resources/js/**/*.css`, `@apply`, `!important` outside `utilities.css`/`base/a11y.css`, and `bx-*` icons. `check:css:all` is equivalent now.
- Workspace shell: `components/layout/WorkspaceLayout.tsx` uses `.sn-workspace__content` + `.sn-workspace__main` (padding 36/24), sidebar `var(--sn-sidebar)` = 232 px. There is no `.content` wrapper or Page.css geometry; `.sn-workspace__main` owns its padding. `WorkspaceLayout` no longer imports Page.css.
- Keep the single `@layer …` line in `resources/css/app.css`; only `sn-reset, sn-base, sn-components, sn-layouts, sn-utilities` remain. Input/button styling comes from primitives; there is no Tailwind preflight anymore.
- `Pagination` renders `<div role="navigation">`, not `<nav>`; keep it that way for semantics and to avoid legacy topbar rules.
- Dark mode: the inline script in `app.blade.php` sets `data-theme` only (no `.dark` mirror). Semantic tokens key on `[data-theme='dark']`; `useTheme` (`@/hooks/useTheme`) updates `data-theme` + `colorScheme`; preference is `localStorage.theme`.
- `StorefrontLayout`/`AccountLayout` no longer accept `pinLight`; theme is entirely token-driven. `ChatDock` is mounted once in `StorefrontLayout`; `AccountLayout` wraps it. Never add a second bubble/chat mount.
- i18n: flat keys in `lang/vi.json` + `lang/en.json`, shared as the `translations` prop. Use `useTranslation()` from `@/lib/i18n` (react-i18next is unused); it supports flat keys and dot paths and returns the key when missing. Add/fix every key in **both** files.
- Naming: `components/ui/*` files are kebab-case (lowercase in git); pages are PascalCase. `pages/Auth` is capital-A in git — a lowercase directory breaks `Inertia::render('Auth/…')` on Linux. `@` maps to `resources/js` via tsconfig, and the alias is case-sensitive on Linux/tsc.
- Present but intentionally unused: `ui/switch` (only reached via unused `commerce/PreferenceRow`), `ui/error-state`, `commerce/{ReturnItemPicker,RefundOption,PreferenceRow}`. Don't "clean up" them during the refactor.

## Architecture

- Role routes live in `routes/{admin,user,seller,shipper,chat,settings,auth}.php`. `bootstrap/app.php` loads all but `auth` in its `then:` block, and `web.php` also requires several, so some groups are registered twice today. Add role routes to the matching file, not `web.php`. `routes/api.php` is intentionally empty; chatbot/notification endpoints sit in `web.php` under session auth.
- `Inertia::render('Seller/Products/Index')` resolves to `resources/js/pages/Seller/Products/Index.tsx` via `import.meta.glob`; match on-disk casing (`pages/` lowercase, subfolders PascalCase). 16 render targets have no page file: `Admin/CustomerSegments/{Index,Create,Edit,Show}`, `Admin/Inventory/Report`, `Admin/Orders/Show`, `Admin/Returns/Show`, `Product/{Index,Show}`, `Seller/Promotions/{Edit,Show}`, `Seller/Reports/{Products,Revenue}`, `Seller/Wallet/{Dashboard,TopUpStatus,Transactions}`. They fail only at request time — backlog, not regressions.
- Six routes in `routes/user.php` call nonexistent `User\OrderController` methods (`downloadInvoice`, `confirmDelivery`, `createReview`, `requestReturn`, `cancelReturnRequest`, `trackDelivery`) and 500 despite README claims.
- Layouts are chosen per page; there is no role→layout middleware. The legacy `layouts/app/AppLayout.tsx` re-export was removed in Phase 12; workspace pages import `components/layout/WorkspaceLayout` directly. Storefront/auth/account shells live in `components/layout/`.
- Roles are spatie-translatable in the `role_user` pivot: query `Role::where('name->en', 'Seller')`, never `where('name', …)`. `$user->role_name` exists. Product/Category/Brand `name` and product `description` are translatable JSON — query `name->en`. Custom primary keys: `product_id`, `category_id`, `brand_id`, `variant_id`.
- Middleware aliases: `is_admin`, `isSeller`, `isShipper`, `verified`/`verified.optional` (both `EnsureEmailIsVerifiedIfProvided`; users without email count as verified). `verified` overrides Laravel's default.
- CSRF exceptions in `bootstrap/app.php`: `login`, `product/*/buy-now`, `buy-now/checkout/*`, `webhooks/*`. Webhooks verify signatures themselves; don't add normal forms.
- Locale/currency are POSTs to `/language` and `/currency`, stored in session (`APP_LOCALE=vi` default). There are no `/{locale}/…` URL prefixes.
- Stock changes go through `App\Services\InventoryService` (`adjustStock`, `setStock`, `bulkAdjust`, `adjustInventoryForOrder`, `restoreInventoryForOrder`) so `InventoryLog`/caches stay consistent. Never write `stock_quantity` directly.
- Payments: `PaymentService::make($provider)` supports only `stripe` and `cod` (`app/Payments/Gateways/`); webhook/return handling is in `PaymentWebhookController`/`PaymentReturnController`.

## Data & tests

- `.env` points at a shared remote MySQL (Aiven). Treat `migrate:fresh`, `db:wipe` and seeders as destructive; ask first. Tests use SQLite `:memory:` via `phpunit.xml`.
- Feature tests use `RefreshDatabase`. Seed `RoleSeeder` first, then attach roles: `$user->roles()->attach(Role::where('name->en', 'Seller')->first())`. Assert Inertia pages with `Inertia\Testing\AssertableInertia`. `config/inertia.php` enables `ensure_pages_exist` only in `testing`, so missing production pages fail at request time.
- Chatbot tests `Http::fake` `api.openai.com` and `api.groq.com`; fake any new provider. Test env pins `APP_LOCALE=vi`, `QUEUE_CONNECTION=sync`, `BROADCAST_CONNECTION=log`, array cache/session.

## Deps

- Laravel 13, Inertia 3, React 19, Vite 8, TypeScript 5.9, recharts 3, lucide-react 1.x, PHPUnit 12. No direct Tailwind/CVA/clsx/tailwind-merge/Boxicons/FontAwesome (`clsx` only remains transitive via `@react-aria`/recharts). Run `npm ci` after branch switches instead of trusting `node_modules`.
- Design tokens live under `resources/css/tokens/`; `tailwind.config.ts`, `components.json`, `postcss.config.js`, `Page.css`, `tokens.css`, `legacy-tokens.css` and `base.css` were removed in Phase 11. `scripts/token-allowlist.json` is deleted, so `check:css` is strict.
