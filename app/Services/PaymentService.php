<?php

namespace App\Services;

use App\Payments\Contracts\PaymentGateway;
use App\Payments\Gateways\StripeGateway;
use InvalidArgumentException;

class PaymentService
{
    public static function make(string $provider): PaymentGateway
    {
        return match ($provider) {
            'stripe' => app(StripeGateway::class),
            'default' => throw new InvalidArgumentException('unsupported provider'),
        };
    }
}