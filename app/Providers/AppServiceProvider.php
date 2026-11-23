<?php

namespace App\Providers;

use App\Http\Middleware\IsSeller;
use App\Models\ProductVariant;
use App\Observers\ProductVariantObserver;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Stripe\ApiRequestor;
use Stripe\HttpClient\CurlClient;
use Stripe\StripeClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(StripeClient::class, function () {
            $client = new StripeClient(config('services.stripe.secret'));

            // Configure HTTP client for local development
            if (config('app.env') === 'local') {
                // Set global HTTP client for Stripe SDK
                ApiRequestor::setHttpClient(new CurlClient([
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => false,
                ]));
            }

            return $client;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register route middleware alias for isSeller to ensure group middleware works
        $this->app['router']->aliasMiddleware('isSeller', IsSeller::class);

        ProductVariant::observe(ProductVariantObserver::class);

        // Disable SSL verification for local development (Google OAuth).
        // Guzzle 8 không cho truyền CURLOPT_SSL_VERIFYPEER trong option "curl";
        // chỉ dùng option "verify" để tránh lỗi khi Socialite đổi token.
        if (config('app.env') === 'local') {
            $guzzleConfig = [
                'verify' => false,
                'timeout' => 10,
            ];

            Socialite::extend('google', function ($app) use ($guzzleConfig) {
                $config = $app['config']['services.google'];
                $driver = new GoogleProvider(
                    $app['request'],
                    $config['client_id'],
                    $config['client_secret'],
                    $config['redirect']
                );
                $driver->setHttpClient(new Client($guzzleConfig));

                return $driver;
            });
            $request = request();
            if ($request->isSecure() || $request->header('X-Forwarded-Proto') === 'https') {
                URL::forceScheme('https');
            }
        }
    }
}
