<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_SECRET_ID'),
        'redirect' => env('GOOGLE_REDIRECT'),
    ],
    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'currency' => env('STRIPE_CURRENCY', 'USD'),
    ],
    'exchange_rate' => [
        'base_currency' => env('EXCHANGE_RATE_BASE', 'USD'),
        'api_url' => env('EXCHANGE_RATE_API_URL', 'https://v6.exchangerate-api.com/v6/'),
        'api_key' => env('EXCHANGE_RATE_API_KEY'),
        'cache_ttl' => (int) env('EXCHANGE_RATE_CACHE_TTL', 3600),
        'timeout' => (int) env('EXCHANGE_RATE_TIMEOUT', 5),
        'fallback_rates' => [
            'VND' => (float) env('EXCHANGE_RATE_FALLBACK_VND', 25000),
        ],
    ],
    'paypal' => [
        'client_id' => env('PAYPAL_CLIENT_ID'),
        'client_secret' => env('PAYPAL_CLIENT_SECRET'),
        'mode' => env('PAYPAL_MODE', 'sandbox'),
    ],

    'vnpay' => [
        'tmn_code' => env('VNP_TMN_CODE'),
        'hash_secret' => env('VNP_HASH_SECRET'),
        'payment_url' => env('VNP_PAYMENT_URL'),
        'return_url' => env('VNP_RETURN_URL'),
        'convert_rate' => (int) env('VNP_CONVERT_RATE', 27000),
    ],

    'groq' => [
        'api_key' => env('GROQ_API_KEY'),
        'base_url' => env('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),
        'default_model' => env('GROQ_MODEL', 'llama-3.1-8b-instant'),
        'timeout' => (int) env('GROQ_TIMEOUT', 20),
        'verify_ssl' => env('GROQ_VERIFY_SSL', false),
    ],

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
        'default_model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'timeout' => (int) env('OPENAI_TIMEOUT', 20),
        'verify_ssl' => env('OPENAI_VERIFY_SSL', false),
    ],

    'momo' => [
        'partner_code' => env('MOMO_PARTNER_CODE'),
        'access_key' => env('MOMO_ACCESS_KEY'),
        'secret_key' => env('MOMO_SECRET_KEY'),
        'endpoint' => env('MOMO_ENDPOINT'),
        'redirect' => env('MOMO_REDIRECT_URL'),
        'ipn' => env('MOMO_IPN_URL'),
        'convert_rate' => (int) env('MOMO_CONVERT_RATE', 25000),
    ],

    'chatbot' => [
        'fallback_enabled' => filter_var(env('CHATBOT_FALLBACK_ENABLED', true), FILTER_VALIDATE_BOOL),
    ],

];
