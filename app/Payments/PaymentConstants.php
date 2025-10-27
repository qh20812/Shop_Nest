<?php

namespace App\Payments;

class PaymentConstants
{
    /**
     * Multiplier to convert currency amount to cents/smallest unit.
     */
    public const CENTS_MULTIPLIER = 100;

    /**
     * Default currency precision (decimal places).
     */
    public const CURRENCY_PRECISION = 2;

    /**
     * Exchange rate calculation precision.
     */
    public const EXCHANGE_RATE_PRECISION = 6;

    /**
     * Maximum retry attempts for failed API calls.
     */
    public const MAX_RETRY_ATTEMPTS = 3;

    /**
     * Timeout for payment gateway API calls (in seconds).
     */
    public const API_TIMEOUT = 10;

    /**
     * Supported payment providers.
     */
    public const PROVIDERS = [
        'stripe',
        'paypal',
    ];

    /**
     * Payment statuses.
     */
    public const STATUS_SUCCEEDED = 'succeeded';
    public const STATUS_PENDING = 'pending';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELED = 'canceled';
    public const STATUS_IGNORED = 'ignored';
}
