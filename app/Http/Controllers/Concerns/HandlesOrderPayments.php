<?php

namespace App\Http\Controllers\Concerns;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Transaction;

trait HandlesOrderPayments
{
    private function persistPayment(Order $order, string $provider, array $attributes): void
    {
        $amount = array_key_exists('amount', $attributes)
            ? (float) $attributes['amount']
            : (float) $order->total_amount;

        $currency = $attributes['currency'] ?? ($order->currency ?? 'VND');

        $transaction = $this->lockPaymentTransaction($order, $provider);

        if (!$transaction) {
            $transaction = $order->transactions()->create([
                'type' => 'payment',
                'amount' => $amount,
                'currency' => $currency,
                'gateway' => $provider,
                'status' => 'pending',
            ]);
        } else {
            if (array_key_exists('amount', $attributes)) {
                $transaction->amount = $amount;
            }

            if (array_key_exists('currency', $attributes)) {
                $transaction->currency = $currency;
            }
        }

        $eventId = $attributes['gateway_event_id'] ?? null;

        if ($eventId && $transaction->gateway_event_id === $eventId) {
            return;
        }

        $normalized = $this->normalizeStatuses($attributes['status'] ?? '');

        if ($transaction->status !== 'completed' || $normalized['transaction_status'] === 'completed') {
            $transaction->status = $normalized['transaction_status'];
        }

        if (!empty($attributes['gateway_transaction_id'])) {
            $transaction->gateway_transaction_id = $attributes['gateway_transaction_id'];
        }

        if ($eventId) {
            $transaction->gateway_event_id = $eventId;
        }

        if (array_key_exists('raw_payload', $attributes)) {
            $transaction->raw_payload = $attributes['raw_payload'];
        }

        $transaction->save();

        $shouldUpdatePaymentStatus = $order->payment_status !== PaymentStatus::PAID
            || $normalized['payment_status'] === PaymentStatus::PAID;

        if ($shouldUpdatePaymentStatus) {
            $order->payment_status = $normalized['payment_status'];
        }

        if (!empty($attributes['gateway_transaction_id'])) {
            $order->payment_transaction_id = $attributes['gateway_transaction_id'];
        }

        if ($order->payment_status === PaymentStatus::PAID && $order->status === OrderStatus::PENDING_CONFIRMATION) {
            $order->status = OrderStatus::PROCESSING;
        }

        $order->save();
    }

    private function lockPaymentTransaction(Order $order, string $provider): ?Transaction
    {
        return $order->transactions()
            ->where('type', 'payment')
            ->where('gateway', $provider)
            ->latest('id')
            ->lockForUpdate()
            ->first();
    }

    private function normalizeStatuses(string $status): array
    {
        $normalized = strtolower($status);

        return match ($normalized) {
            'succeeded', 'success', 'completed', 'paid' => [
                'payment_status' => PaymentStatus::PAID,
                'transaction_status' => 'completed',
            ],
            'pending', 'processing' => [
                'payment_status' => PaymentStatus::UNPAID,
                'transaction_status' => 'pending',
            ],
            'canceled', 'cancelled' => [
                'payment_status' => PaymentStatus::FAILED,
                'transaction_status' => 'canceled',
            ],
            default => [
                'payment_status' => PaymentStatus::FAILED,
                'transaction_status' => 'failed',
            ],
        };
    }

    private function sanitizeOrderId(mixed $orderId): ?int
    {
        if (is_numeric($orderId) && (int) $orderId > 0) {
            return (int) $orderId;
        }

        return null;
    }

    private function isDuplicateEvent(string $provider, ?string $eventId): bool
    {
        if (!$eventId) {
            return false;
        }

        return Transaction::where('gateway', $provider)
            ->where('gateway_event_id', $eventId)
            ->lockForUpdate()
            ->exists();
    }
}
