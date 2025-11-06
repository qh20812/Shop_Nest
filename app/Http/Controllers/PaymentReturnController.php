<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Concerns\HandlesOrderPayments;
use App\Http\Requests\PaymentReturnRequest;
use App\Models\CartItem;
use App\Models\Order;
use App\Services\CartService;
use App\Services\InventoryService;
use App\Services\PaymentService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PaymentReturnController extends Controller
{
    use HandlesOrderPayments;

    public function __construct(private CartService $cartService, private InventoryService $inventoryService) {}

    public function handle(PaymentReturnRequest $request, string $provider): Response
    {
        try {
            $gateway = PaymentService::make($provider);
        } catch (Throwable $exception) {
            Log::error('payment_return.unsupported_provider', [
                'provider' => $provider,
                'message' => $exception->getMessage(),
            ]);

            return Inertia::render('Customer/PaymentResult', [
                'provider' => $provider,
                'status' => 'failed',
                'message' => 'Unsupported payment provider.',
            ]);
        }

        $payload = $request->all();
        $result = $gateway->handleReturn($payload);

        $orderId = $request->query('order_id')
            ?? $request->input('orderId')
            ?? $request->input('vnp_TxnRef')
            ?? $result['order_id'] ?? null;

        $sanitizedOrderId = $this->sanitizeOrderId($orderId);
        $status = $result['status'] ?? 'failed';
        $shouldClearCart = false;

        $processedOrder = null;
        $shouldRestoreInventory = false;

        if ($sanitizedOrderId) {
            try {
                DB::transaction(function () use ($sanitizedOrderId, $provider, $payload, $result, $status, &$shouldClearCart, &$shouldRestoreInventory, &$processedOrder) {
                    $order = Order::lockForUpdate()->find($sanitizedOrderId);

                    if (!$order) {
                        Log::warning('payment_return.order_not_found', [
                            'provider' => $provider,
                            'order_id' => $sanitizedOrderId,
                        ]);
                        return;
                    }

                    $eventId = $result['event_id'] ?? null;

                    if ($this->isDuplicateEvent($provider, $eventId)) {
                        Log::info('payment_return.duplicate_event', [
                            'provider' => $provider,
                            'order_id' => $order->order_id,
                            'event_id' => $eventId,
                        ]);
                        return;
                    }

                    $this->persistPayment($order, $provider, [
                        'status' => $status,
                        'gateway_transaction_id' => $result['transaction_id'] ?? null,
                        'gateway_event_id' => $eventId,
                        'raw_payload' => $payload,
                        'amount' => $result['amount'] ?? null,
                        'currency' => $result['currency'] ?? null,
                    ]);

                    $shouldClearCart = $order->payment_status === PaymentStatus::PAID;
                    $shouldRestoreInventory = $order->payment_status === PaymentStatus::FAILED;
                    
                    // If payment failed or canceled, create a refund transaction
                    if ($shouldRestoreInventory) {
                        $order->transactions()->create([
                            'type' => 'refund',
                            'amount' => $order->total_amount,
                            'currency' => $order->currency ?? 'VND',
                            'gateway' => $provider,
                            'gateway_transaction_id' => $result['transaction_id'] ?? null,
                            'gateway_event_id' => $eventId,
                            'status' => 'completed',
                            'raw_payload' => $payload,
                        ]);

                        Log::info('payment_return.refund_created', [
                            'provider' => $provider,
                            'order_id' => $order->order_id,
                            'reason' => 'payment_failed',
                        ]);
                    }

                    $processedOrder = $order->fresh('items.variant');

                    Log::info('payment_return.processed', [
                        'provider' => $provider,
                        'order_id' => $order->order_id,
                        'status' => $status,
                    ]);
                });
            } catch (Throwable $exception) {
                Log::error('payment_return.transaction_failed', [
                    'provider' => $provider,
                    'order_id' => $sanitizedOrderId,
                    'message' => $exception->getMessage(),
                    'trace' => $exception->getTraceAsString(),
                ]);
            }
        } else {
            Log::warning('payment_return.invalid_order_id', [
                'provider' => $provider,
                'raw_order_id' => $orderId,
            ]);
        }

        if ($shouldClearCart) {
            Log::info('payment_return.clearing_cart', [
                'user_id' => Auth::id(),
                'provider' => $provider,
                'order_id' => $sanitizedOrderId,
            ]);
            
            // Clear the cart for this user
            $this->cartService->clearCart(Auth::user());
            
            // Verify cart was cleared
            $remainingItems = CartItem::where('user_id', Auth::id())->count();
            
            if ($remainingItems > 0) {
                Log::warning('payment_return.cart_not_fully_cleared', [
                    'user_id' => Auth::id(),
                    'remaining_items' => $remainingItems,
                ]);
            } else {
                Log::info('payment_return.cart_cleared_successfully', [
                    'user_id' => Auth::id(),
                ]);
            }
            
            // Clear any promotion session data
            session()->forget('applied_promotion');
        }

        if ($shouldRestoreInventory && $processedOrder) {
            try {
                $this->inventoryService->restoreInventoryForOrder($processedOrder);
            } catch (Throwable $exception) {
                Log::error('payment_return.restore_inventory_failed', [
                    'provider' => $provider,
                    'order_id' => $processedOrder->order_id ?? null,
                    'message' => $exception->getMessage(),
                ]);
            }
        }

        return Inertia::render('Customer/PaymentResult', [
            'provider' => $provider,
            'status' => $status,
            'message' => $result['message'] ?? '',
        ]);
    }
}