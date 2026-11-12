<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGateway;

class CodGateway implements PaymentGateway
{
    /**
     * COD does not redirect to an external gateway; send the user to the order detail page.
     */
    public function createPayment(Order $order): string
    {
        return route('user.orders.show', $order->getKey());
    }

    public function handleReturn(array $payload): array
    {
        return [
            'status' => 'pending',
            'transaction_id' => null,
            'message' => 'Cash on delivery orders stay unpaid until the courier collects payment.',
        ];
    }

    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        return [
            'status' => 'ignored',
            'transaction_id' => null,
            'message' => 'Cash on delivery does not use webhooks.',
        ];
    }
}
