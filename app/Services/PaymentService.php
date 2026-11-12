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
                'name' => 'Stripe (Thẻ quốc tế)',
                'description' => 'Thanh toán bằng thẻ Visa, MasterCard hoặc JCB',
                'icon' => 'stripe',
            ],
            [
                'id' => 'cod',
                'name' => 'Thanh toán khi nhận hàng (COD)',
                'description' => 'Thanh toán bằng tiền mặt khi nhận hàng',
                'icon' => 'cod',
            ],
        ];
    }
}
