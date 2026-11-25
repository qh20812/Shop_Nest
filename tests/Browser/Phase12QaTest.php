<?php

namespace Tests\Browser;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\User;
use App\Models\UserAddress;
use Facebook\WebDriver\WebDriverKeys;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class Phase12QaTest extends DuskTestCase
{
    /** @var list<string> */
    private array $failures = [];

    private const ALL_WIDTHS = [375, 390, 480, 768, 1024, 1280, 1440];

    private const CORE_WIDTHS = [375, 768, 1440];

    public function test_guest_surfaces(): void
    {
        $this->browse(function (Browser $browser): void {
            $pages = [
                'home' => '/',
                'search' => '/search',
                'search-price' => '/search?q=ao&sort=price_asc',
                'about' => '/about',
                'contact' => '/contact',
                'terms' => '/terms',
                'privacy' => '/privacy-policy',
                'selling-policy' => '/selling-policy',
                'login' => '/login',
                'register' => '/register',
                'register-seller' => '/register/seller',
                'register-shipper' => '/register/shipper',
                'forgot-password' => '/forgot-password',
            ];

            foreach ($pages as $label => $path) {
                $this->sweep($browser, $label, $path);
            }

            $this->sweep($browser, 'home-full', '/', self::ALL_WIDTHS);
            $this->sweep($browser, 'search-full', '/search', self::ALL_WIDTHS);

            $this->darkSweep($browser, 'dark-home', '/');
            $this->darkSweep($browser, 'dark-search', '/search');
            $this->darkSweep($browser, 'dark-login', '/login');
        });

        $this->assertSame([], $this->failures, implode(PHP_EOL, $this->failures));
    }

    public function test_skip_link_and_main_landmark(): void
    {
        $this->browse(function (Browser $browser): void {
            $browser->resize(1440, 900)->visit('/');

            $browser->assertPresent('.sn-skip-link');
            $this->assertSame('#main-content', $browser->attribute('.sn-skip-link', 'href'));
            $this->assertSame('main-content', $browser->attribute('main', 'id'));

            $browser->driver->getKeyboard()->pressKey(WebDriverKeys::TAB);

            $active = (string) $browser->driver->executeScript('return document.activeElement ? document.activeElement.className : "";');
            $this->assertStringContainsString('sn-skip-link', $active, 'First Tab should focus the skip link.');

            $browser->driver->getKeyboard()->pressKey(WebDriverKeys::ENTER);

            $hash = (string) $browser->driver->executeScript('return window.location.hash;');
            $this->assertSame('#main-content', $hash);
        });
    }

    public function test_customer_surfaces(): void
    {
        $customer = User::where('email', 'lan.nguyen@gmail.com')->firstOrFail();
        $cartCustomer = User::where('email', 'long.ho45@gmail.com')->firstOrFail();

        $orderId = Order::where('customer_id', $customer->id)->value('order_id');
        $addressId = UserAddress::where('user_id', $customer->id)->value('id');

        $this->browse(function (Browser $browser) use ($customer, $cartCustomer, $orderId, $addressId): void {
            $browser->loginAs($customer->id);

            $pages = [
                'customer-orders' => '/user/orders',
                'customer-order-show' => '/user/orders/'.$orderId,
                'customer-addresses' => '/user/addresses',
                'customer-address-create' => '/user/addresses/create',
                'customer-address-show' => '/user/addresses/'.$addressId,
                'customer-address-edit' => '/user/addresses/'.$addressId.'/edit',
                'customer-profile' => '/user/profile',
                'customer-password' => '/user/change-password',
                'customer-notifications' => '/user/notifications',
                'customer-chat' => '/customer/chat',
                'customer-product-detail' => '/product/1',
                'settings-profile' => '/settings/profile',
                'settings-password' => '/settings/password',
                'settings-appearance' => '/settings/appearance',
                'customer-cart-empty' => '/cart',
            ];

            foreach ($pages as $label => $path) {
                $this->sweep($browser, $label, $path);
            }

            $browser->loginAs($cartCustomer->id);

            $this->sweep($browser, 'customer-cart-full', '/cart');
            $this->sweep($browser, 'customer-checkout', '/checkout', self::ALL_WIDTHS);

            $this->darkSweep($browser, 'dark-customer-orders', '/user/orders');
            $this->darkSweep($browser, 'dark-customer-cart', '/cart');
            $this->darkSweep($browser, 'dark-customer-product-detail', '/product/1');
            $this->darkSweep($browser, 'dark-customer-checkout', '/checkout');
        });

        $this->assertSame([], $this->failures, implode(PHP_EOL, $this->failures));
    }

    public function test_seller_surfaces(): void
    {
        $seller = User::where('email', 'hung.nguyen@shopnest.vn')->firstOrFail();

        $productId = Product::where('seller_id', $seller->id)->value('product_id');
        $orderId = Order::query()
            ->whereHas('items.variant.product', fn ($query) => $query->where('seller_id', $seller->id))
            ->value('order_id');

        $this->browse(function (Browser $browser) use ($seller, $productId, $orderId): void {
            $browser->loginAs($seller->id);

            $pages = [
                'seller-dashboard' => '/seller/dashboard',
                'seller-products' => '/seller/products',
                'seller-product-create' => '/seller/products/create',
                'seller-product-show' => '/seller/products/'.$productId,
                'seller-product-edit' => '/seller/products/'.$productId.'/edit',
                'seller-orders' => '/seller/orders',
                'seller-order-show' => '/seller/orders/'.$orderId,
                'seller-promotions' => '/seller/promotions',
                'seller-promotion-create' => '/seller/promotions/create',
                'seller-shop' => '/seller/shop',
            ];

            foreach ($pages as $label => $path) {
                $this->sweep($browser, $label, $path);
            }

            $this->sweep($browser, 'seller-dashboard-full', '/seller/dashboard', self::ALL_WIDTHS);
            $this->sweep($browser, 'seller-products-full', '/seller/products', self::ALL_WIDTHS);

            $this->darkSweep($browser, 'dark-seller-dashboard', '/seller/dashboard');
            $this->darkSweep($browser, 'dark-seller-products', '/seller/products');
        });

        $this->assertSame([], $this->failures, implode(PHP_EOL, $this->failures));
    }

    public function test_admin_surfaces(): void
    {
        $admin = User::where('email', 'quan.nguyen@shopnest.vn')->firstOrFail();
        $seller = User::where('email', 'hung.nguyen@shopnest.vn')->firstOrFail();
        $customer = User::where('email', 'lan.nguyen@gmail.com')->firstOrFail();
        $shipper = User::where('email', 'tai.bui@shopnest.vn')->firstOrFail();

        $productId = Product::value('product_id');
        $promotionId = Promotion::value('promotion_id');
        $categoryId = Category::value('category_id');
        $brandId = Brand::value('brand_id');

        $this->browse(function (Browser $browser) use ($admin, $seller, $customer, $shipper, $productId, $promotionId, $categoryId, $brandId): void {
            $browser->loginAs($admin->id);

            $pages = [
                'admin-dashboard' => '/admin/dashboard',
                'admin-users' => '/admin/users',
                'admin-user-edit' => '/admin/users/'.$customer->id.'/edit',
                'admin-products' => '/admin/products',
                'admin-product-show' => '/admin/products/'.$productId,
                'admin-inventory' => '/admin/inventory',
                'admin-inventory-show' => '/admin/inventory/'.$productId,
                'admin-inventory-history' => '/admin/inventory/'.$productId.'/history',
                'admin-orders' => '/admin/orders',
                'admin-promotions' => '/admin/promotions',
                'admin-promotion-create' => '/admin/promotions/create',
                'admin-promotion-show' => '/admin/promotions/'.$promotionId,
                'admin-promotion-edit' => '/admin/promotions/'.$promotionId.'/edit',
                'admin-categories' => '/admin/categories',
                'admin-category-edit' => '/admin/categories/'.$categoryId.'/edit',
                'admin-brands' => '/admin/brands',
                'admin-brand-edit' => '/admin/brands/'.$brandId.'/edit',
                'admin-shops' => '/admin/shops',
                'admin-shops-pending' => '/admin/shops/pending',
                'admin-shop-show' => '/admin/shops/'.$seller->id,
                'admin-shop-statistics' => '/admin/shops/'.$seller->id.'/statistics',
                'admin-shop-violations' => '/admin/shops/'.$seller->id.'/violations',
                'admin-shippers' => '/admin/shippers',
                'admin-shipper-show' => '/admin/shippers/'.$shipper->id,
                'admin-returns' => '/admin/returns',
                'admin-analytics' => '/admin/analytics',
                'admin-analytics-orders' => '/admin/analytics/orders',
                'admin-analytics-products' => '/admin/analytics/products',
                'admin-analytics-reports' => '/admin/analytics/reports',
                'admin-analytics-revenue' => '/admin/analytics/revenue',
                'admin-analytics-users' => '/admin/analytics/users',
            ];

            foreach ($pages as $label => $path) {
                $this->sweep($browser, $label, $path);
            }

            $this->sweep($browser, 'admin-dashboard-full', '/admin/dashboard', self::ALL_WIDTHS);
            $this->sweep($browser, 'admin-analytics-full', '/admin/analytics', self::ALL_WIDTHS);
            $this->sweep($browser, 'admin-inventory-full', '/admin/inventory', self::ALL_WIDTHS);

            $this->darkSweep($browser, 'dark-admin-dashboard', '/admin/dashboard');
            $this->darkSweep($browser, 'dark-admin-analytics', '/admin/analytics');
        });

        $this->assertSame([], $this->failures, implode(PHP_EOL, $this->failures));
    }

    public function test_shipper_surfaces(): void
    {
        $shipper = User::where('email', 'tai.bui@shopnest.vn')->firstOrFail();

        $this->browse(function (Browser $browser) use ($shipper): void {
            $browser->loginAs($shipper->id);

            $pages = [
                'shipper-dashboard' => '/shipper/dashboard',
                'shipper-settings-profile' => '/settings/profile',
                'shipper-settings-password' => '/settings/password',
                'shipper-settings-appearance' => '/settings/appearance',
            ];

            foreach ($pages as $label => $path) {
                $this->sweep($browser, $label, $path);
            }

            $this->sweep($browser, 'shipper-dashboard-full', '/shipper/dashboard', self::ALL_WIDTHS);

            $this->darkSweep($browser, 'dark-shipper-dashboard', '/shipper/dashboard');
        });

        $this->assertSame([], $this->failures, implode(PHP_EOL, $this->failures));
    }

    /**
     * @param  list<int>|null  $widths
     */
    private function sweep(Browser $browser, string $label, string $path, ?array $widths = null): void
    {
        foreach ($widths ?? self::CORE_WIDTHS as $width) {
            $browser->resize($width, 900);
            $browser->visit($path);

            if ($browser->element('.sn-skeleton')) {
                $browser->waitUntilMissing('.sn-skeleton', 8);
            }

            try {
                $browser->waitUntil('return Array.from(document.images).every(function (img) { return img.complete; });', 3);
            } catch (\Throwable) {
                // Lazy images below the fold may never load; layout checks do not depend on them.
            }

            $currentPath = (string) $browser->driver->executeScript('return window.location.pathname;');
            $expectedPath = parse_url($path, PHP_URL_PATH) ?: '/';

            if ($currentPath !== $expectedPath) {
                $this->failures[] = "{$label} {$path} @ {$width}px: redirected to {$currentPath}";
            }

            $status = (int) $browser->driver->executeScript(
                'const entry = performance.getEntriesByType("navigation")[0]; return entry && entry.responseStatus ? entry.responseStatus : 200;'
            );
            $overflow = (float) $browser->driver->executeScript(
                'return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;'
            );

            if ($status >= 400) {
                $this->failures[] = "{$label} {$path} @ {$width}px: HTTP {$status}";
            }

            if ($overflow > 2) {
                $offenders = $browser->driver->executeScript(
                    'return Array.from(document.querySelectorAll("body *")).map(function (el) { var r = el.getBoundingClientRect(); return { tag: el.tagName, cls: String(el.className).slice(0, 80), right: Math.round(r.right), width: Math.round(r.width) }; }).filter(function (x) { return x.right > window.innerWidth + 2; }).slice(0, 6);'
                );

                $this->failures[] = "{$label} {$path} @ {$width}px: horizontal overflow {$overflow}px ".json_encode($offenders);
            }

            $bodyText = (string) $browser->driver->executeScript('return document.body ? document.body.innerText : "";');

            foreach (['[object Object]', 'NaN', 'Server Error'] as $needle) {
                if (str_contains($bodyText, $needle)) {
                    $this->failures[] = "{$label} {$path} @ {$width}px: body contains {$needle}";
                }
            }

            if (in_array($width, self::CORE_WIDTHS, true)) {
                $browser->screenshot('phase12/'.$label.'-'.$width);
            }
        }
    }

    private function darkSweep(Browser $browser, string $label, string $path): void
    {
        foreach ([375, 1440] as $width) {
            $browser->resize($width, 900)->visit($path);
            $browser->script("localStorage.setItem('theme', 'dark');");
            $browser->visit($path);

            if ($browser->element('.sn-skeleton')) {
                $browser->waitUntilMissing('.sn-skeleton', 8);
            }

            try {
                $browser->waitUntil('return Array.from(document.images).every(function (img) { return img.complete; });', 3);
            } catch (\Throwable) {
                // Lazy images below the fold may never load; layout checks do not depend on them.
            }

            $currentPath = (string) $browser->driver->executeScript('return window.location.pathname;');
            $expectedPath = parse_url($path, PHP_URL_PATH) ?: '/';

            if ($currentPath !== $expectedPath) {
                $this->failures[] = "{$label} {$path} @ {$width}px: redirected to {$currentPath}";
            }

            $theme = (string) $browser->driver->executeScript('return document.documentElement.getAttribute("data-theme");');
            $overflow = (float) $browser->driver->executeScript(
                'return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;'
            );

            if ($theme !== 'dark') {
                $this->failures[] = "{$label} {$path} @ {$width}px: dark theme not applied";
            }

            if ($overflow > 2) {
                $this->failures[] = "{$label} {$path} @ {$width}px: dark horizontal overflow {$overflow}px";
            }

            $bodyText = (string) $browser->driver->executeScript('return document.body ? document.body.innerText : "";');

            foreach (['[object Object]', 'NaN', 'Server Error'] as $needle) {
                if (str_contains($bodyText, $needle)) {
                    $this->failures[] = "{$label} {$path} @ {$width}px: dark body contains {$needle}";
                }
            }

            $browser->screenshot('phase12/'.$label.'-'.$width);
        }

        $browser->script("localStorage.removeItem('theme');");
    }
}
