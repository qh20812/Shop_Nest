# AGENTS.md

ShopNest is a Laravel + Inertia/React e-commerce app with four roles (admin, seller, customer, shipper). The README is Vietnamese and broader than the implementation (invoice/tracking/returns flows are partial); its UI table still lists Font Awesome, but the bundle uses Lucide and keeps Boxicons only for legacy workspace pages. Trust `composer.json`, `package.json`, `routes/` and `bootstrap/app.php` over README prose.

## Run & verify

- Full local stack: `composer run dev` — PHP dev server on `http://127.0.0.1:9999` (matches `APP_URL`), queue listener, and Vite. `npm run dev` starts only Vite.
- Realtime needs a separate `php artisan reverb:start` (port 8080); `composer run dev` does not start Reverb.
- Tests: `php artisan test` (or `composer test`, which runs `config:clear` first). Single test: `php artisan test tests/Feature/Seller/ProductControllerTest.php --filter=test_name`.
- PHP formatting: `vendor/bin/pint`. Frontend: `npm run format` (Prettier write, `resources/` only), `npm run format:check`, `npm run lint` (ESLint **with `--fix`**, not a check), `npm run types` (`tsc --noEmit`).
- `npm run check:tokens` enforces tokens/Lucide/no legacy CSS. `scripts/token-allowlist.json` still allowlists ~63 workspace files; never add storefront/auth/account/chat files to it. Use `check:tokens:all` to see remaining violations.
- CI (`.github/workflows/`) targets `develop`/`main`, uses PHP 8.4 + Node 22. Lint job runs write-mode `pint` → `npm run format` → `npm run lint` (not a formatting gate). Test job: `npm ci` → `composer install` → `npm run build` → `phpunit`. CI does **not** run `npm run types` or `check:tokens`; run them locally.
- Dusk browser tests live in `tests/Browser` and are not in `phpunit.xml`; run them with `php artisan dusk`.
- Docker: `docker compose up --build -d` serves the app on `http://localhost:8080` with MySQL on `localhost:3307`. The image builds assets in a PHP 8.3 + Node 22 stage and runs PHP 8.3 + nginx.

## Architecture

- Role route files live in `routes/{admin,user,seller,shipper,chat,settings,auth}.php`, registered from `bootstrap/app.php` (several are also `require`d in `routes/web.php`). Add role routes to the matching file. `routes/api.php` is intentionally empty: chatbot and notification "API" endpoints are in `web.php` under session auth (`/chatbot/message`, `/api/notifications/*`).
- Inertia pages resolve to `resources/js/pages/<Component>.tsx` from `Inertia::render('Seller/Products/Index')`. Component paths are case-sensitive on Linux; match the on-disk casing exactly (e.g. `Auth/`, `Home/`, `Customer/`, `Seller/`).
- Pages import their layout explicitly (`@/components/layout/StorefrontLayout` or `AccountLayout`, workspace `@/layouts/app/AppLayout`); there is no automatic role-layout middleware.
- Naming: page folders/files PascalCase (`pages/Auth/Login.tsx`); component folders lowercase (`components/chat`, `components/commerce`); component files PascalCase except `components/ui/**` kebab-case; hook/lib files camelCase/lowercase; shared type modules stay `types.ts`.
- `@` → `resources/js` (Vite and tsconfig). Import the folder as lowercase `@/components/...`; mixed-case variants like `@/Components/...` resolve on Windows but break tsc and Linux builds.
- Wayfinder generates `resources/js/{actions,routes,wayfinder}` (gitignored) during `vite` dev/build. Regenerate with `php artisan wayfinder:generate`; never edit generated files.
- Frontend migration status: Storefront/Auth/Account/Chat use the Nếp system; Seller/Admin/Shipper still use `layouts/app/AppLayout`, `Page.css`, Boxicons and the legacy tokens. Do **not** delete `legacy-tokens.css`, `.dark`, `Page.css` or the Boxicons CDN until the workspace is migrated. Workspace legacy components (`action-button`, `primary-input`, `data-table`, `confirmation-modal`, `status-badge`, …) are rename-only; don't merge their APIs as drive-by cleanup.
- **UI refactor freeze (Phase 0, `REFACTOR_PLAN.md`):** không thêm class Tailwind mới. UI mới dùng token `--sn-*`, primitive `sn-*` và CSS Module. `npm run check:css` chạy theo ratchet: file còn trong `scripts/token-allowlist.json` được bỏ qua; khi migrate xong một file, xoá entry của nó khỏi allowlist và **không** thêm file mới vào allowlist. Đọc `REFACTOR_PLAN.md` trước khi sửa UI.
- Reserved components that are intentionally unused: `components/ui/{table,switch,error-state}.tsx`, `components/commerce/{ReturnItemPicker,RefundOption,PreferenceRow}.tsx`, `components/feedback/LoadingOverlay.tsx`. Don't delete them as dead code.
- `ChatDock` is mounted once in `StorefrontLayout` (AccountLayout inherits it); it hides itself on auth, checkout, payments, chat and workspace routes. Don't mount another bubble or a second chatbot.
- Some Inertia renders still target missing workspace pages (`Admin/CustomerSegments/*`, `Admin/Inventory/Report`, `Admin/Orders/Show`, `Admin/Returns/Show`, `Seller/Promotions/Edit|Show`, `Seller/Reports/*`, `Seller/Wallet/*`, `Product/Index|Show`, `Auth/ConfirmPassword`). Treat those as known backlog, not a frontend regression.
- Only `app.css`, `base.css`, `tokens.css`, `legacy-tokens.css` and `Page.css` remain in `resources/css`. `app.css` imports the first four; `Page.css` is workspace-only. Don't import per-page legacy CSS in new pages.
- Auth is session-based. Google login uses Socialite. Roles are in the `role_user` pivot with Spatie-translatable names: query `where('name->en', 'Seller')`, not `where('name', ...)`.
- Middleware aliases are `is_admin`, `isSeller`, `isShipper`, and `verified`/`verified.optional` (both point to `EnsureEmailIsVerifiedIfProvided`; users without an email count as verified). `routes/shipper.php` currently references an unregistered `shipper` alias — use `isShipper` or register it.
- CSRF is disabled for `login`, `product/*/buy-now`, `buy-now/checkout/*`, and `webhooks/*` in `bootstrap/app.php`. Webhooks verify signatures themselves; don't widen this list for normal forms.
- Models use custom primary keys: `product_id`, `category_id`, `brand_id`, `variant_id`. Product/Category/Brand name fields are spatie-translatable JSON (`{en, vi}`); resolve/query them per locale instead of assuming a plain string.
- Stock changes go through `App\Services\InventoryService` (`adjustStock`, `setStock`, ...) so `InventoryLog` and caches stay consistent. Don't update `stock_quantity` directly.
- Payments: `App\Services\PaymentService::make($provider)` supports only `stripe` and `cod`, implemented in `app/Payments/Gateways/`; webhook/return handling is in `PaymentWebhookController`/`PaymentReturnController`. PayPal/VNPay/MoMo were removed — don't reintroduce them without the matching migrations/UI.
- Frontend i18n: keys are flat English strings in `lang/vi.json` and `lang/en.json`, shared as `translations` prop. Add new keys to both files; use `useTranslation()` from `@/lib/i18n`, not react-i18next.
- Tailwind v4 is configured in `resources/css/app.css`, which imports `tokens.css` (legacy Tailwind `@theme`, kept until Phase 11), `resources/css/tokens/*` (the new `--sn-*` source for colour, type, spacing, size, radius, shadow and motion), `fonts.css` (self-hosted Be Vietnam Pro), `base.css` and `legacy-tokens.css` (kept for workspace). `tailwind.config.ts` is not loaded; add new tokens to `resources/css/tokens/`, not the JS config. shadcn-style UI primitives are in `resources/js/components/ui`; `components/ui/table.tsx` is the target primitive, `data-table.tsx` is legacy workspace.
- The active UI refactor plan is `REFACTOR_PLAN.md` (Direction Bảng Hiệu, 12 phases; Phase 0 is the guardrail). `DESIGN.md` and `COMPONENTS.md` describe the previous Nếp system and are rewritten in Phase 12; `PLAN.md`/`PROMPT.md`/`STITCH-DESIGN.md`/`DESIGN-02.md` are archived in Phase 11. Run `npm run check:css` (alias `check:tokens`) after UI changes.

## Data & tests

- The local `.env` points at a shared remote MySQL (Aiven), not localhost. Treat `migrate:fresh`, `db:wipe`, and seeders as destructive; ask before running them. Tests use in-memory SQLite via `phpunit.xml`, so they don't touch it.
- Feature tests use `RefreshDatabase`. Roles must be seeded first (`$this->seed(RoleSeeder::class)`); then attach with `$user->roles()->attach(Role::where('name->en', 'Seller')->first())`. Inertia assertions use `Inertia\Testing\AssertableInertia`.
- Chatbot tests fake OpenAI/Groq with `Http::fake`; if you add providers, fake them too. The full suite is slow and deprecation-noisy on PHP 8.5 (`PDO::MYSQL_ATTR_SSL_CA`). Run targeted tests when working outside the changed area.

## Dependency notes

- Runtime stack: Laravel 13.42, Inertia 3, React 19, Vite 8, Tailwind 4, recharts 3, lucide-react 1.x. `composer.lock` and `package-lock.json` are in sync; run `npm ci` after switching branches instead of assuming existing `node_modules`.
- CI uses PHP 8.4 + Node 22. Local PHP 8.5 works but emits deprecation warnings during tests.
