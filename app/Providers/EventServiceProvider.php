<?php

namespace App\Providers;

use App\Events\Cart\LowStockDetected;
use App\Listeners\Auth\MergeGuestCart;
use App\Listeners\Cart\SendLowStockNotification;
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
    ];

    public function boot(): void
    {
        //
    }
}
