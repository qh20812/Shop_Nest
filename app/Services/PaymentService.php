<?php

namespace App\Services;

use App\Payments\Contracts\PaymentGateway;
use App\Payments\Gateways\MomoGateway;
use App\Payments\Gateways\PaypalGateway;
use App\Payments\Gateways\StripeGateway;
use App\Payments\Gateways\VnpayGateway;
use InvalidArgumentException;

class PaymentService
{
    public static function make(string $provider): PaymentGateway
    {
        return match ($provider) {
            'stripe' => app(StripeGateway::class),
            'paypal' => app(PaypalGateway::class),
            'vnpay' => app(VnpayGateway::class),
            'momo' => app(MomoGateway::class),
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
                'id' => 'paypal',
                'name' => 'PayPal',
                'description' => 'Thanh toán nhanh qua tài khoản PayPal',
                'icon' => 'paypal',
            ],
            [
                'id' => 'vnpay',
                'name' => 'VNPay',
                'description' => 'Thanh toán qua ngân hàng nội địa và QR VNPay',
                'icon' => 'vnpay',
            ],
            [
                'id' => 'momo',
                'name' => 'MoMo',
                'description' => 'Thanh toán ví điện tử MoMo',
                'icon' => 'momo',
            ],
        ];
    }
}