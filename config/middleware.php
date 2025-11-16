<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Middleware Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for various middleware components including rate limiting
    | and caching settings for role-based access control middlewares.
    |
    */

    'seller' => [
        /*
        |--------------------------------------------------------------------------
        | Rate Limiting
        |--------------------------------------------------------------------------
        |
        | Configuration for rate limiting in seller middleware to prevent
        | brute force attacks on seller routes.
        |
        */
        'rate_limiting' => [
            'max_attempts' => env('SELLER_RATE_LIMIT_MAX_ATTEMPTS', 5),
            'decay_minutes' => env('SELLER_RATE_LIMIT_DECAY_MINUTES', 1),
        ],

        /*
        |--------------------------------------------------------------------------
        | Caching
        |--------------------------------------------------------------------------
        |
        | Configuration for caching seller status checks to improve performance.
        |
        */
        'cache' => [
            'ttl_seconds' => env('SELLER_CACHE_TTL_SECONDS', 300), // 5 minutes
        ],
    ],

    'admin' => [
        /*
        |--------------------------------------------------------------------------
        | Rate Limiting
        |--------------------------------------------------------------------------
        |
        | Configuration for rate limiting in admin middleware.
        |
        */
        'rate_limiting' => [
            'max_attempts' => env('ADMIN_RATE_LIMIT_MAX_ATTEMPTS', 5),
            'decay_minutes' => env('ADMIN_RATE_LIMIT_DECAY_MINUTES', 1),
        ],

        /*
        |--------------------------------------------------------------------------
        | Caching
        |--------------------------------------------------------------------------
        |
        | Configuration for caching admin status checks.
        |
        */
        'cache' => [
            'ttl_seconds' => env('ADMIN_CACHE_TTL_SECONDS', 300), // 5 minutes
        ],
    ],
];