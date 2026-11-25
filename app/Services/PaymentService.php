<?php

namespace App\Services;

use App\Payments\Contracts\PaymentGateway;
use App\Payments\Gateways\CodGateway;
use App\Payments\Gateways\StripeGateway;
use InvalidArgumentException;

class PaymentService
{
    public static function make(string $provider): PaymentGateway
    {
        return match ($provider) {
            'stripe' => app(StripeGateway::class),
            'cod' => app(CodGateway::class),
            default => throw new InvalidArgumentException('unsupported provider'),
        };
    }

    public static function list(): array
    {
        return [
            [
                'id' => 'stripe',
                'name' => __('Stripe (International card)'),
                'description' => __('Pay with Visa, MasterCard or JCB'),
                'icon' => 'stripe',
            ],
            [
                'id' => 'cod',
                'name' => __('Cash on delivery (COD)'),
                'description' => __('Pay with cash when your order arrives'),
                'icon' => 'cod',
            ],
        ];
    }
}
