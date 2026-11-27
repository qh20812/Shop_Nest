<?php

return [
    /*
    |--------------------------------------------------------------------------
    | VietQR bank transfer details
    |--------------------------------------------------------------------------
    |
    | These values are rendered as a VietQR image URL. The account number and
    | name are not secrets, but they stay in .env so they can be changed
    | without touching code.
    |
    */
    'vietqr' => [
        'bank_bin' => env('VIETQR_BANK_BIN', '970407'),
        'account_no' => env('VIETQR_ACCOUNT_NO'),
        'account_name' => env('VIETQR_ACCOUNT_NAME'),
        'template' => env('VIETQR_TEMPLATE', 'compact2'),
    ],

    'topup' => [
        'min_amount' => (float) env('WALLET_TOPUP_MIN_AMOUNT', 10000),
        'max_amount' => (float) env('WALLET_TOPUP_MAX_AMOUNT', 50000000),
        'ttl_hours' => (int) env('WALLET_TOPUP_TTL_HOURS', 24),
    ],
];
