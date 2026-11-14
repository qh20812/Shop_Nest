# AGENTS.md

ShopNest is a Laravel + Inertia/React e-commerce app with four roles (admin, seller, customer, shipper). The README is Vietnamese and partly aspirational — it mentions Sanctum/JWT, Swagger and Ant/MUI, none of which are used. Trust `composer.json`, `package.json`, `routes/` and `bootstrap/app.php`.

## Run & verify

- Full local stack: `composer run dev` — PHP dev server on `http://127.0.0.1:9999` (matches `APP_URL`), queue listener, and Vite. `npm run dev` starts only Vite.
- Realtime needs a separate `php artisan reverb:start` (port 8080); `composer run dev` does not start Reverb.
- Tests: `php artisan test` (or `composer test`, which runs `config:clear` first). Single test: `php artisan test tests/Feature/Seller/ProductControllerTest.php --filter=test_name`.
- PHP formatting: `vendor/bin/pint`. Frontend: `npm run format` (Prettier, only `resources/`), `npm run lint` (ESLint **with `--fix`**, not a check), `npm run types` (`tsc --noEmit`).
- CI (`.github/workflows/`) targets `develop`/`main`, uses PHP 8.4 + Node 22. Lint job: `pint` → `npm run format` → `npm run lint`. Test job: installs → `npm run build` → `phpunit`.
- Dusk browser tests live in `tests/Browser` and are not in `phpunit.xml`; run them with `php artisan dusk`.
- Docker: `docker compose up --build -d` serves the app on `http://localhost:8080` with MySQL on `localhost:3307`. The image builds assets in a Node 22 stage and runs PHP 8.3 + nginx.

## Architecture

- Role route files live in `routes/{admin,user,seller,shipper,chat,settings,auth}.php`, registered from `bootstrap/app.php` (several are also `require`d in `routes/web.php`). Add role routes to the matching file. `routes/api.php` is intentionally empty: chatbot and notification "API" endpoints are in `web.php` under session auth (`/chatbot/message`, `/api/notifications/*`).
- Inertia pages resolve to `resources/js/pages/<Component>.tsx` from `Inertia::render('Seller/Products/Index')`. Component paths are case-sensitive on Linux; match the on-disk casing exactly (e.g. `Auth/`, `Home/`, `Customer/`, `Seller/`).
- Pages import their layout explicitly (`@/components/layout/StorefrontLayout` or `AccountLayout`, workspace `@/layouts/app/AppLayout`); there is no automatic role-layout middleware.
- Naming: page folders/files PascalCase (`pages/Auth/Login.tsx`); component folders lowercase (`components/chat`, `components/commerce`); component files PascalCase except `components/ui/**` kebab-case; hook/lib files camelCase/lowercase; shared type modules stay `types.ts`.
- `@` → `resources/js` (Vite and tsconfig). Import the folder as lowercase `@/components/...`; mixed-case variants like `@/Components/...` resolve on Windows but break tsc and Linux builds.
- Wayfinder generates `resources/js/{actions,routes,wayfinder}` (gitignored) during `vite` dev/build. Regenerate with `php artisan wayfinder:generate`; never edit generated files.
- Auth is session-based. Google login uses Socialite. Roles are in the `role_user` pivot with Spatie-translatable names: query `where('name->en', 'Seller')`, not `where('name', ...)`.
- Middleware aliases are `is_admin`, `isSeller`, `isShipper`, and `verified`/`verified.optional` (both point to `EnsureEmailIsVerifiedIfProvided`; users without an email count as verified). `routes/shipper.php` currently references an unregistered `shipper` alias — use `isShipper` or register it.
- CSRF is disabled for `login`, `product/*/buy-now`, `buy-now/checkout/*`, and `webhooks/*` in `bootstrap/app.php`. Webhooks verify signatures themselves; don't widen this list for normal forms.
- Models use custom primary keys: `product_id`, `category_id`, `brand_id`, `variant_id`. Product/Category/Brand name fields are spatie-translatable JSON (`{en, vi}`); resolve/query them per locale instead of assuming a plain string.
- Stock changes go through `App\Services\InventoryService` (`adjustStock`, `setStock`, ...) so `InventoryLog` and caches stay consistent. Don't update `stock_quantity` directly.
- Payments: `App\Services\PaymentService::make($provider)` supports only `stripe` and `cod`, implemented in `app/Payments/Gateways/`; webhook/return handling is in `PaymentWebhookController`/`PaymentReturnController`. PayPal/VNPay/MoMo were removed — don't reintroduce them without the matching migrations/UI.
- Frontend i18n: keys are flat English strings in `lang/vi.json` and `lang/en.json`, shared as `translations` prop. Add new keys to both files; use `useTranslation()` from `@/lib/i18n`, not react-i18next.
- Tailwind v4 is configured in `resources/css/app.css`, which imports `tokens.css` (the single source for colour, type, spacing, size, radius, shadow and motion), `base.css`, and the temporary `legacy-tokens.css`. `tailwind.config.ts` is not loaded; add tokens to `tokens.css`, not the JS config. shadcn-style UI primitives are in `resources/js/components/ui`.
- The redesign direction and tokens live in `DESIGN.md`; component rules live in `COMPONENTS.md`; the 7-phase migration plan is `PLAN.md`. Per-screen Google Stitch prompts live in `PROMPT.md`. Run `npm run check:tokens` after UI changes.

## Data & tests

- The local `.env` points at a shared remote MySQL (Aiven), not localhost. Treat `migrate:fresh`, `db:wipe`, and seeders as destructive; ask before running them. Tests use in-memory SQLite via `phpunit.xml`, so they don't touch it.
- Feature tests use `RefreshDatabase`. Roles must be seeded first (`$this->seed(RoleSeeder::class)`); then attach with `$user->roles()->attach(Role::where('name->en', 'Seller')->first())`. Inertia assertions use `Inertia\Testing\AssertableInertia`.
- Chatbot unit tests may make real Groq/OpenAI HTTP calls; without valid keys they fail. Run targeted tests when working outside that area.

## Dependency notes

- Runtime stack: Laravel 13.42, Inertia 3, React 19, Vite 8, Tailwind 4, recharts 3, lucide-react 1.x. `composer.lock` and `package-lock.json` are in sync; run `npm ci` after switching branches instead of assuming existing `node_modules`.
- CI uses PHP 8.4 + Node 22. Local PHP 8.5 works but emits deprecation warnings during tests.
