<?php

namespace App\Providers;

use App\Http\Middleware\IsSeller;
use App\Models\ProductVariant;
use App\Observers\ProductVariantObserver;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
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
                \Stripe\ApiRequestor::setHttpClient(new \Stripe\HttpClient\CurlClient([
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

        // Disable SSL verification for local development (Google OAuth)
        if (config('app.env') === 'local') {
            $guzzleConfig = [
                'verify' => false,
                'curl' => [
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => false,
                ]
            ];
            
            \Laravel\Socialite\Facades\Socialite::extend('google', function ($app) use ($guzzleConfig) {
                $config = $app['config']['services.google'];
                $driver = new \Laravel\Socialite\Two\GoogleProvider(
                    $app['request'],
                    $config['client_id'],
                    $config['client_secret'],
                    $config['redirect']
                );
                $driver->setHttpClient(new \GuzzleHttp\Client($guzzleConfig));
                return $driver;
            });
            $request = request();
            if ($request->isSecure() || $request->header('X-Forwarded-Proto') === 'https') {
                URL::forceScheme('https');
            }
        }
    }
}
