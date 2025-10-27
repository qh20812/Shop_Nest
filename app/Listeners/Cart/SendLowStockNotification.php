<?php

namespace App\Listeners\Cart;

use App\Events\Cart\LowStockDetected;
use Illuminate\Support\Facades\Log;

class SendLowStockNotification
{
    public function handle(LowStockDetected $event): void
    {
        Log::warning('Cart operation triggered low stock warning.', [
            'variant_id' => $event->variant->variant_id,
            'product_id' => $event->variant->product_id,
            'requested_quantity' => $event->requestedQuantity,
            'available_quantity' => $event->variant->available_quantity,
        ]);
    }
}
