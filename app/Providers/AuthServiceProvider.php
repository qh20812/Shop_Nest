<?php

namespace App\Providers;

use App\Models\AnalyticsReport;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Policies\AnalyticsReportPolicy;
use App\Policies\CartItemPolicy;
use App\Policies\ChatbotPolicy;
use App\Policies\InventoryPolicy;
use App\Policies\OrderPolicy;
use App\Policies\ProductPolicy;
use App\Policies\PromotionPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        AnalyticsReport::class => AnalyticsReportPolicy::class,
        CartItem::class => CartItemPolicy::class,
    Order::class => OrderPolicy::class,
        Product::class => ProductPolicy::class,
        Promotion::class => PromotionPolicy::class,
        ProductVariant::class => InventoryPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Gate::define('chatbot.access', [ChatbotPolicy::class, 'access']);
        Gate::define('manage shops', function (User $user): bool {
            return $user->isAdmin();
        });
    }
}

