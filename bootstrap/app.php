<?php

use App\Http\Middleware\DetectRoleLayout;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsSeller;
use App\Http\Middleware\IsShipper;
use App\Http\Middleware\SetLocale;
use App\Providers\AppServiceProvider;
use App\Providers\AuthServiceProvider;
use App\Providers\EventServiceProvider;
use Illuminate\Broadcasting\BroadcastServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;

// Load cURL configuration for SSL settings
require_once __DIR__ . '/curl_config.php';

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders([
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        App\Providers\EventServiceProvider::class,
        BroadcastServiceProvider::class,
    ])
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        then: function(){
            Route::middleware('web')->group(base_path('routes/admin.php'));
            Route::middleware('web')->group(base_path('routes/user.php'));
            Route::middleware('web')->group(base_path('routes/seller.php'));
            Route::middleware('web')->group(base_path('routes/shipper.php'));
            Route::middleware('web')->group(base_path('routes/chat.php'));
            Route::middleware('web')->group(base_path('routes/settings.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Exclude CSRF for Buy Now routes and login
        $middleware->validateCsrfTokens(except: [
            'product/*/buy-now',
            'buy-now/checkout/*',
            'login',
        ]);

        $middleware->web(append: [
            SetLocale::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'is_admin' => IsAdmin::class,
            'isSeller' => IsSeller::class,
            'isShipper'=> IsShipper::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
