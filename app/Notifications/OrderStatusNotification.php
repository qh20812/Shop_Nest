<?php

namespace App\Notifications;

use App\Mail\OrderStatusMail;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

/**
 * Email cập nhật trạng thái đơn hàng cho khách.
 *
 * Được dispatch từ App\Observers\OrderObserver nên mọi luồng đổi trạng thái
 * (khách huỷ, seller cập nhật, admin giao shipper, hoàn tiền) đều phủ.
 */
class OrderStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Order $order,
        private readonly string $event,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): OrderStatusMail
    {
        return (new OrderStatusMail(
            order: $this->order,
            event: $this->event,
            greetingName: method_exists($notifiable, 'mailName') ? $notifiable->mailName() : (string) $notifiable->username,
        ))->to($notifiable->email);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->order_id,
            'order_number' => $this->order->order_number,
            'event' => $this->event,
        ];
    }
}
