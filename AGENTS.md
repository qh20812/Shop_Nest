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

- `REFACTOR_PLAN.md` owns status/scope: Phases 0–10 are complete (storefront, auth, customer/settings/chat, seller, admin, shipper, email + error pages); Phase 11 cleanup is next. Read it before restyling. `docs/ui/BASELINE.md` is a historical pre-refactor snapshot; `DESIGN.md`/`COMPONENTS.md` still document the abandoned Nếp system.
- Tailwind is frozen. New UI uses `--sn-*` tokens, `sn-*` classes and CSS Modules (`*.module.css`, composed with `cx` from `@/lib/cx`). No new Tailwind utility classes; the `tailwindcss`/`tokens.css` imports remain only until Phase 11.
- `npm run check:css` (alias `check:tokens`) is a ratchet: currently **293 files checked, 5 allowlisted**. Never add an allowlist entry. It fails on Tailwind utilities/arbitrary values, raw hex/rgba/hsl in TSX or `resources/css/{components,layouts}` + `resources/js/**/*.css`, `@apply`, `!important` outside `utilities.css`/`base/a11y.css`, and `bx-*` icons. `check:css:all` lists everything.
- Allowlisted legacy files: `resources/css/base.css`, `components/feedback/LoadingOverlay.tsx`, `components/storefront/UtilityStrip.tsx`, `components/ui/navbar.tsx`, `components/ui/sidebar.tsx`. Do not delete them before Phase 11.
- The workspace shell is still legacy: `components/layout/WorkspaceLayout.tsx` imports `Page.css` (as do legacy `ui/navbar`/`ui/sidebar`) and keeps `<div class="content"><main class="sn-workspace__main">`. `Page.css` is unlayered for `.content`/`.sidebar` geometry (230 px sidebar, `z-index: 2000`) and wins over `@layer` rules; its six global resets live in `@layer sn-legacy-reset`. Don't delete `Page.css`, `base.css`, `tokens.css`, `legacy-tokens.css`, or the Boxicons CDN before Phase 11. `sn-workspace__main` has no padding of its own; it inherits `.content main` from Page.css, so removing Page.css requires replacement CSS.
- Keep the single `@layer …` line in `resources/css/app.css`; `sn-components` must stay after Tailwind `base`/`components` and before `utilities`, or preflight strips input/button styling.
- `Pagination` renders `<div role="navigation">`, not `<nav>`, so Page.css `.content nav` does not treat it as the topbar.
- Dark mode: the inline script in `app.blade.php` sets `data-theme` **and** the legacy `.dark` mirror before paint. Semantic tokens key on `[data-theme='dark']`; `.dark` exists only for legacy CSS. `useTheme` (`@/hooks/useTheme`) mirrors both; preference is `localStorage.theme`. Remove the mirror only in Phase 11.
- `StorefrontLayout`'s `pinLight` prop defaults to `false`; pass `pinLight` only to force a light shell. Remove the prop in Phase 11.
- `ChatDock` is mounted once in `StorefrontLayout`; `AccountLayout` wraps it. Never add a second bubble/chat mount.
- i18n: flat keys in `lang/vi.json` + `lang/en.json`, shared as the `translations` prop. Use `useTranslation()` from `@/lib/i18n` (react-i18next is unused); it supports flat keys and dot paths and returns the key when missing. Add/fix every key in **both** files.
- Naming: `components/ui/*` files are kebab-case (lowercase in git); pages are PascalCase. `pages/Auth` is capital-A in git — a lowercase directory breaks `Inertia::render('Auth/…')` on Linux. `@` maps to `resources/js` via tsconfig, and the alias is case-sensitive on Linux/tsc.
- Present but intentionally unused: `ui/switch` (only reached via unused `commerce/PreferenceRow`), `ui/error-state`, `feedback/LoadingOverlay`, `storefront/UtilityStrip`, `commerce/{ReturnItemPicker,RefundOption,PreferenceRow}`. Don't "clean up" them during the refactor.

## Architecture

- Role routes live in `routes/{admin,user,seller,shipper,chat,settings,auth}.php`. `bootstrap/app.php` loads all but `auth` in its `then:` block, and `web.php` also requires several, so some groups are registered twice today. Add role routes to the matching file, not `web.php`. `routes/api.php` is intentionally empty; chatbot/notification endpoints sit in `web.php` under session auth.
- `Inertia::render('Seller/Products/Index')` resolves to `resources/js/pages/Seller/Products/Index.tsx` via `import.meta.glob`; match on-disk casing (`pages/` lowercase, subfolders PascalCase). 16 render targets have no page file: `Admin/CustomerSegments/{Index,Create,Edit,Show}`, `Admin/Inventory/Report`, `Admin/Orders/Show`, `Admin/Returns/Show`, `Product/{Index,Show}`, `Seller/Promotions/{Edit,Show}`, `Seller/Reports/{Products,Revenue}`, `Seller/Wallet/{Dashboard,TopUpStatus,Transactions}`. They fail only at request time — backlog, not regressions.
- Six routes in `routes/user.php` call nonexistent `User\OrderController` methods (`downloadInvoice`, `confirmDelivery`, `createReview`, `requestReturn`, `cancelReturnRequest`, `trackDelivery`) and 500 despite README claims.
- Layouts are chosen per page; there is no role→layout middleware. `layouts/app/AppLayout.tsx` is a legacy re-export of `components/layout/WorkspaceLayout`; storefront/auth/account shells live in `components/layout/`.
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

- Laravel 13, Inertia 3, React 19, Vite 8, Tailwind 4, TypeScript 5.9, recharts 3, lucide-react 1.x, PHPUnit 12. Run `npm ci` after branch switches instead of trusting `node_modules`.
- `tailwind.config.ts` is not loaded (Tailwind v4 is CSS-first); add tokens under `resources/css/tokens/`, not the JS config. `components.json` is vestigial. `@fortawesome/fontawesome-free` has zero references and is slated for removal in Phase 11.
