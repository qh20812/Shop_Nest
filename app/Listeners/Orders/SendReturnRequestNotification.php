<?php

namespace App\Listeners\Orders;

use App\Events\ReturnRequested;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendReturnRequestNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(ReturnRequested $event): void
    {
        Log::info('Return request notification dispatched.', [
            'return_id' => $event->returnRequest->return_id,
            'order_id' => $event->returnRequest->order_id,
        ]);
    }
}
