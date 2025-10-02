<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
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
        }
    }
}
