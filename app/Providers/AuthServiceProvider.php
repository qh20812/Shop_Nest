<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Product;
use App\Models\Promotion;
use App\Policies\ProductPolicy;
use App\Policies\PromotionPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
    Product::class => ProductPolicy::class,
    Promotion::class => PromotionPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}

