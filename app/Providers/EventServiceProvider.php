<?php

namespace App\Providers;

use App\Events\Cart\LowStockDetected;
use App\Events\OrderCancelled;
use App\Events\ReturnRequested;
use App\Listeners\Auth\MergeGuestCart;
use App\Listeners\Cart\SendLowStockNotification;
use App\Listeners\Orders\SendOrderCancelledNotification;
use App\Listeners\Orders\SendReturnRequestNotification;
use Illuminate\Auth\Events\Login;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Login::class => [
            MergeGuestCart::class,
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
    ];

    public function boot(): void
    {
        //
    }
}
