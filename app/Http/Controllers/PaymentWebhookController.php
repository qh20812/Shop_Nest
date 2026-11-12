<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HandlesOrderPayments;
use App\Models\Order;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;
use Stripe\Webhook;
use Throwable;

class PaymentWebhookController extends Controller
{
    use HandlesOrderPayments;

    public function __construct(private InventoryService $inventoryService) {}

    public function stripe(Request $request)
    {
        $secret = config('services.stripe.webhook_secret');
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent($payload, $signature, $secret);
        } catch (Throwable $exception) {
            Log::warning('webhooks.stripe.invalid_signature', ['message' => $exception->getMessage()]);

            return response('Invalid', 400);
        }

        $normalizedPayload = json_decode($payload, true) ?? [];

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $orderId = $session->metadata->order_id ?? null;
            $paymentIntent = $session->payment_intent ?? null;
            $this->complete($orderId, $paymentIntent, $event->id, 'stripe', $normalizedPayload);

            return response('OK', 200);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent = $event->data->object;
            $orderId = $intent->metadata->order_id ?? null;

            if (! $orderId && $intent->id) {
                try {
                    $sessions = app(StripeClient::class)->checkout->sessions->all([
                        'payment_intent' => $intent->id,
                        'limit' => 1,
                    ]);

                    if (! empty($sessions->data[0]->metadata->order_id)) {
                        $orderId = $sessions->data[0]->metadata->order_id;
                    }
                } catch (Throwable $exception) {
                    Log::warning('webhooks.stripe.lookup_failed', ['message' => $exception->getMessage()]);
                }
            }

            $this->complete($orderId, $intent->id ?? null, $event->id, 'stripe', $normalizedPayload);

            return response('OK', 200);
        }

        return response('Ignored', 200);
    }

    private function complete(?string $orderId, ?string $paymentIntentId, string $eventId, string $provider, array $payload): void
    {
        $sanitizedOrderId = $this->sanitizeOrderId($orderId);

        if (! $sanitizedOrderId) {
            Log::warning('webhooks.payment.missing_order', [
                'provider' => $provider,
                'event_id' => $eventId,
            ]);

            return;
        }

        DB::transaction(function () use ($sanitizedOrderId, $paymentIntentId, $eventId, $provider, $payload) {
            $order = Order::with('items')->lockForUpdate()->find($sanitizedOrderId);

            if (! $order) {
                Log::warning('webhooks.payment.order_not_found', [
                    'provider' => $provider,
                    'order_id' => $sanitizedOrderId,
                    'event_id' => $eventId,
                ]);

                return;
            }

            if ($this->isDuplicateEvent($provider, $eventId)) {
                Log::info('webhooks.payment.duplicate_event', [
                    'provider' => $provider,
                    'order_id' => $order->order_id,
                    'event_id' => $eventId,
                ]);

                return;
            }

            $this->inventoryService->adjustInventoryForOrder($order);

            $this->persistPayment($order, $provider, [
                'status' => 'succeeded',
                'gateway_transaction_id' => $paymentIntentId,
                'gateway_event_id' => $eventId,
                'raw_payload' => $payload,
            ]);

            Log::info('webhooks.payment.completed', [
                'provider' => $provider,
                'order_id' => $order->order_id,
                'event_id' => $eventId,
            ]);
        });
    }
}
