<?php

namespace App\Listeners\Orders;

use App\Events\OrderCancelled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendOrderCancelledNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(OrderCancelled $event): void
    {
        Log::info('Order cancelled notification dispatched.', [
            'order_id' => $event->order->order_id,
            'reason' => $event->reason,
        ]);
    }
}
