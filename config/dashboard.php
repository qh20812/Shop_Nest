<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Dashboard Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for the seller dashboard,
    | including cache settings, limits, and thresholds.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Settings for dashboard caching to improve performance
    |
    */
    'cache' => [
        'ttl' => env('DASHBOARD_CACHE_TTL', 900), // 15 minutes in seconds
        'key_prefix' => env('DASHBOARD_CACHE_PREFIX', 'seller_dashboard'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Data Limits
    |--------------------------------------------------------------------------
    |
    | Limits for various dashboard data queries
    |
    */
    'limits' => [
        'recent_orders' => env('DASHBOARD_RECENT_ORDERS_LIMIT', 10),
        'top_selling_products' => env('DASHBOARD_TOP_SELLING_PRODUCTS_LIMIT', 5),
        'top_selling_product_single' => env('DASHBOARD_TOP_SELLING_PRODUCT_SINGLE_LIMIT', 1),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Rate limiting settings for dashboard access
    |
    */
    'rate_limiting' => [
        'dashboard_access' => [
            'max_attempts' => env('DASHBOARD_RATE_LIMIT_ATTEMPTS', 30),
            'decay_minutes' => env('DASHBOARD_RATE_LIMIT_DECAY', 1), // per minute
        ],
    ],
];