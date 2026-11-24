<?php

namespace App\Providers;

use App\Events\Cart\LowStockDetected;
use App\Events\OrderCancelled;
use App\Events\ProductUpdated;
use App\Events\ReturnRequested;
use App\Listeners\Auth\MergeGuestCart;
use App\Listeners\Auth\SendWelcomeEmail;
use App\Listeners\Cart\SendLowStockNotification;
use App\Listeners\ClearProductReviewsCache;
use App\Listeners\Orders\SendOrderCancelledNotification;
use App\Listeners\Orders\SendReturnRequestNotification;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Login::class => [
            MergeGuestCart::class,
        ],
        Verified::class => [
            SendWelcomeEmail::class,
        ],
        LowStockDetected::class => [
            SendLowStockNotification::class,
        ],
        OrderCancelled::class => [
            SendOrderCancelledNotification::class,
        ],
        ReturnRequested::class => [
            SendReturnRequestNotification::class,
        ],
        ProductUpdated::class => [
            ClearProductReviewsCache::class,
        ],
    ];

    public function boot(): void
    {
        //
    }
}
